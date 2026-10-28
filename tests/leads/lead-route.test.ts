import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  createLeadPostHandler,
  type LeadPayloadAdapter,
} from '../../app/api/leads/route';

const validRequest = {
  name: 'Aline Kabeya',
  email: 'aline@example.test',
  phone: '+243 812 345 678',
  company: 'JT2J Client',
  message: 'Nous souhaitons échanger sur vos services.',
  locale: 'fr',
  sourcePage: '/fr/contact?source=home',
  division: 'logistique-et-suivi',
  service: 'transport-logistics',
  consent: true,
  website: '',
};

function request(body: unknown, ip = '198.51.100.10') {
  return new Request('http://localhost/api/leads', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-forwarded-for': ip,
    },
    body: JSON.stringify(body),
  });
}

function payloadAdapter(overrides: Partial<LeadPayloadAdapter> = {}) {
  return {
    find: vi.fn().mockResolvedValue({ docs: [] }),
    create: vi.fn().mockImplementation(async ({ data }) => ({ id: 42, ...data })),
    ...overrides,
  } satisfies LeadPayloadAdapter;
}

describe('POST /api/leads', () => {
  beforeEach(() => vi.restoreAllMocks());

  it('persists the normalized request with locale, source and server consent', async () => {
    const payload = payloadAdapter();
    const notify = vi.fn().mockResolvedValue(undefined);
    const post = createLeadPostHandler({ payload, notify, now: () => new Date('2026-10-28T10:00:00.000Z') });

    const response = await post(request(validRequest));
    const body = await response.json();

    expect(response.status).toBe(201);
    expect(body).toEqual({ confirmationId: 'lead_42' });
    expect(payload.create).toHaveBeenCalledWith(
      expect.objectContaining({
        collection: 'leads',
        data: expect.objectContaining({
          name: 'Aline Kabeya',
          email: 'aline@example.test',
          locale: 'fr',
          sourcePage: '/fr/contact?source=home',
          status: 'new',
          consent: {
            accepted: true,
            policyVersion: 'v1',
            recordedAt: '2026-10-28T10:00:00.000Z',
          },
        }),
      }),
    );
    expect(notify).toHaveBeenCalledWith(expect.objectContaining({ id: 42 }));
  });

  it('returns a structured validation error without persistence or notification', async () => {
    const payload = payloadAdapter();
    const notify = vi.fn();
    const post = createLeadPostHandler({ payload, notify });

    const response = await post(request({ ...validRequest, email: 'bad' }));
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({
      error: { code: 'VALIDATION_ERROR', message: 'Invalid contact request.' },
    });
    expect(payload.create).not.toHaveBeenCalled();
    expect(notify).not.toHaveBeenCalled();
  });

  it('silently absorbs a filled honeypot without creating a lead or sending mail', async () => {
    const payload = payloadAdapter();
    const notify = vi.fn();
    const post = createLeadPostHandler({ payload, notify });

    const response = await post(request({ ...validRequest, website: 'bot' }));
    const body = await response.json();

    expect(response.status).toBe(202);
    expect(body).toEqual({ accepted: true });
    expect(payload.create).not.toHaveBeenCalled();
    expect(notify).not.toHaveBeenCalled();
  });

  it('rate limits repeated requests from one client before persistence', async () => {
    const payload = payloadAdapter();
    const post = createLeadPostHandler({
      payload,
      notify: vi.fn().mockResolvedValue(undefined),
      rateLimit: { max: 1, windowMs: 60_000 },
    });

    expect((await post(request(validRequest))).status).toBe(201);
    const response = await post(request({ ...validRequest, email: 'other@example.test' }));
    const body = await response.json();

    expect(response.status).toBe(429);
    expect(body).toEqual({
      error: { code: 'RATE_LIMITED', message: 'Too many contact requests.' },
    });
  });

  it('returns a safe duplicate response and does not send a second notification', async () => {
    const payload = payloadAdapter({
      find: vi.fn().mockResolvedValue({ docs: [{ id: 7 }] }),
    });
    const notify = vi.fn();
    const post = createLeadPostHandler({ payload, notify });

    const response = await post(request(validRequest));
    const body = await response.json();

    expect(response.status).toBe(409);
    expect(body).toEqual({
      error: { code: 'DUPLICATE_REQUEST', message: 'A similar request was already received.' },
    });
    expect(payload.create).not.toHaveBeenCalled();
    expect(notify).not.toHaveBeenCalled();
  });

  it('keeps the persisted lead when notification fails and never returns a mailto fallback', async () => {
    const payload = payloadAdapter();
    const post = createLeadPostHandler({
      payload,
      notify: vi.fn().mockRejectedValue(new Error('mail sink unavailable')),
    });

    const response = await post(request(validRequest));
    const body = await response.json();

    expect(response.status).toBe(503);
    expect(body).toEqual({
      error: {
        code: 'NOTIFICATION_FAILED',
        message: 'Your request was saved, but notification is temporarily unavailable.',
        confirmationId: 'lead_42',
      },
    });
    expect(JSON.stringify(body)).not.toContain('mailto:');
  });

  it('returns a safe server error when Payload persistence is unavailable', async () => {
    const payload = payloadAdapter({
      find: vi.fn().mockRejectedValue(new Error('database password leaked here')),
    });
    const post = createLeadPostHandler({ payload, notify: vi.fn() });

    const response = await post(request(validRequest));
    const body = await response.json();

    expect(response.status).toBe(503);
    expect(body).toEqual({
      error: { code: 'PERSISTENCE_UNAVAILABLE', message: 'Your request could not be saved.' },
    });
    expect(JSON.stringify(body)).not.toContain('database password');
  });
});
