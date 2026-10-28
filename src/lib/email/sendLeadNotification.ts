import type { Lead } from '../../payload-types';

export type LeadNotification = Pick<
  Lead,
  'id' | 'name' | 'email' | 'phone' | 'company' | 'message' | 'sourcePage' | 'locale'
> & {
  division?: string;
  service?: string;
};

export async function sendLeadNotification(lead: LeadNotification): Promise<void> {
  const endpoint = process.env.LEAD_MAIL_SINK_URL;
  const to = process.env.LEAD_NOTIFICATION_TO;
  const from = process.env.LEAD_NOTIFICATION_FROM;
  if (!endpoint || !to || !from) {
    throw new Error('Lead notification transport is not configured.');
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      to,
      from,
      subject: `[JT2J] New contact request ${lead.id}`,
      text: [
        `Name: ${lead.name}`,
        `Email: ${lead.email}`,
        lead.phone ? `Phone: ${lead.phone}` : null,
        lead.company ? `Company: ${lead.company}` : null,
        `Locale: ${lead.locale}`,
        `Source: ${lead.sourcePage}`,
        lead.division ? `Division: ${lead.division}` : null,
        lead.service ? `Service: ${lead.service}` : null,
        '',
        lead.message,
      ]
        .filter((line): line is string => line !== null)
        .join('\n'),
    }),
  });

  if (!response.ok) throw new Error(`Lead mail sink responded with ${response.status}.`);
}
