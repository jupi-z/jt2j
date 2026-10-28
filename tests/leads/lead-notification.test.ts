import { afterEach, describe, expect, it, vi } from 'vitest';
import { sendLeadNotification } from '../../src/lib/email/sendLeadNotification';

const lead = {
  id: 42,
  name: 'Aline Kabeya',
  email: 'aline@example.test',
  phone: '+243 812 345 678',
  company: 'JT2J Client',
  message: 'Nous souhaitons échanger sur vos services.',
  sourcePage: '/fr/contact',
  locale: 'fr' as const,
  division: 'logistique-et-suivi',
  service: 'transport-logistics',
};

describe('sendLeadNotification', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it('sends a transactional message to the configured mail sink without client credentials', async () => {
    vi.stubEnv('LEAD_MAIL_SINK_URL', 'http://mail-sink.test/messages');
    vi.stubEnv('LEAD_NOTIFICATION_TO', 'contact@jt2j.example');
    vi.stubEnv('LEAD_NOTIFICATION_FROM', 'no-reply@jt2j.example');
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 202 }));
    vi.stubGlobal('fetch', fetchMock);

    await sendLeadNotification(lead);

    expect(fetchMock).toHaveBeenCalledWith(
      'http://mail-sink.test/messages',
      expect.objectContaining({
        method: 'POST',
        body: expect.stringContaining('Aline Kabeya'),
      }),
    );
    expect(JSON.stringify(fetchMock.mock.calls[0])).not.toMatch(/api[_-]?key|secret|password/i);
  });

  it('fails closed when the mail sink rejects the message', async () => {
    vi.stubEnv('LEAD_MAIL_SINK_URL', 'http://mail-sink.test/messages');
    vi.stubEnv('LEAD_NOTIFICATION_TO', 'contact@jt2j.example');
    vi.stubEnv('LEAD_NOTIFICATION_FROM', 'no-reply@jt2j.example');
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(null, { status: 503 })));

    await expect(sendLeadNotification(lead)).rejects.toThrow();
  });
});
