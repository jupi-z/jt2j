import type { LeadPayloadAdapter } from '../../../app/api/leads/route';
import { appLogger, type StructuredLogger } from '../observability/logger';
import type { LeadNotification } from './sendLeadNotification';

type RetryPayload = Pick<LeadPayloadAdapter, 'find'> &
  Required<Pick<LeadPayloadAdapter, 'update'>>;

function safeLog(
  logger: StructuredLogger,
  level: 'info' | 'warn' | 'error',
  event: string,
  data: Record<string, unknown>,
) {
  try {
    logger[level](event, data);
  } catch {
    // Observability must never change the notification state transition.
  }
}

export async function processLeadNotificationRetries({
  payload,
  notify,
  now = () => new Date(),
  maxAttempts = 3,
  logger: injectedLogger,
}: {
  payload: RetryPayload;
  notify: (lead: LeadNotification) => Promise<void>;
  now?: () => Date;
  maxAttempts?: number;
  logger?: StructuredLogger;
}) {
  const logger = injectedLogger ?? appLogger;
  const currentTime = now();
  const due = await payload.find({
    collection: 'leads',
    where: {
      and: [
        { notificationStatus: { equals: 'retry_pending' } },
        { notificationNextAttemptAt: { less_than_equal: currentTime.toISOString() } },
        { notificationAttempts: { less_than: maxAttempts } },
      ],
    },
    limit: 100,
  });
  let sent = 0;
  let failed = 0;

  for (const lead of due.docs) {
    const attempts = Number(lead.notificationAttempts || 0);
    const notification: LeadNotification = {
      id: Number(lead.id),
      name: String(lead.name || ''),
      email: String(lead.email || ''),
      phone: lead.phone ? String(lead.phone) : undefined,
      company: lead.company ? String(lead.company) : undefined,
      message: String(lead.message || ''),
      sourcePage: String(lead.sourcePage || ''),
      locale: lead.locale === 'en' ? 'en' : 'fr',
      division: typeof lead.division === 'string' ? lead.division : undefined,
      service: typeof lead.service === 'string' ? lead.service : undefined,
    };
    try {
      await notify(notification);
      await payload.update({
        collection: 'leads',
        id: lead.id,
        overrideAccess: true,
        data: {
          notificationStatus: 'sent',
          notificationAttempts: attempts + 1,
          notificationNextAttemptAt: null,
          notificationAlertRequired: false,
        },
      });
      sent += 1;
      safeLog(logger, 'info', 'lead.notification_retry_succeeded', {
        leadId: lead.id,
        attempts: attempts + 1,
      });
    } catch {
      const nextAttempts = attempts + 1;
      await payload.update({
        collection: 'leads',
        id: lead.id,
        overrideAccess: true,
        data: {
          notificationStatus: 'retry_pending',
          notificationAttempts: nextAttempts,
          notificationNextAttemptAt: new Date(
            currentTime.getTime() + 5 * 60 * 1000 * 2 ** Math.max(0, nextAttempts - 1),
          ).toISOString(),
          notificationLastError: 'transport_unavailable',
          notificationAlertRequired: nextAttempts >= maxAttempts,
        },
      });
      safeLog(logger, 'error', 'lead.notification_retry_failed', {
        leadId: lead.id,
        attempts: nextAttempts,
      });
      if (nextAttempts >= maxAttempts) {
        safeLog(logger, 'warn', 'lead.notification_retry_alert_required', {
          leadId: lead.id,
          attempts: nextAttempts,
        });
      }
      failed += 1;
    }
  }

  return { processed: due.docs.length, sent, failed };
}
