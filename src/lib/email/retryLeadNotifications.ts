import type { LeadPayloadAdapter } from '../../../app/api/leads/route';
import type { LeadNotification } from './sendLeadNotification';

type RetryPayload = Pick<LeadPayloadAdapter, 'find'> &
  Required<Pick<LeadPayloadAdapter, 'update'>>;

export async function processLeadNotificationRetries({
  payload,
  notify,
  now = () => new Date(),
  maxAttempts = 3,
}: {
  payload: RetryPayload;
  notify: (lead: LeadNotification) => Promise<void>;
  now?: () => Date;
  maxAttempts?: number;
}) {
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
      failed += 1;
    }
  }

  return { processed: due.docs.length, sent, failed };
}
