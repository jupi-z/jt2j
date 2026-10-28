import { getPayload } from 'payload';
import { leadRequestSchema, type LeadRequest } from '@/lib/validation/leadSchema';
import { sendLeadNotification, type LeadNotification } from '@/lib/email/sendLeadNotification';

export interface LeadPayloadAdapter {
  find(args: { collection: string; where: unknown; limit?: number }): Promise<{ docs: Array<Record<string, unknown>> }>;
  create(args: { collection: string; data: Record<string, unknown>; overrideAccess?: boolean }): Promise<Record<string, unknown>>;
}

type LeadNotifier = (lead: LeadNotification) => Promise<void>;
type LeadRateLimitOptions = { max: number; windowMs: number };

export interface LeadPostDependencies {
  payload: LeadPayloadAdapter;
  notify: LeadNotifier;
  now?: () => Date;
  rateLimit?: LeadRateLimitOptions;
}

function getDefaultRateLimit(): LeadRateLimitOptions {
  const configuredMax = Number.parseInt(process.env.LEAD_RATE_LIMIT_MAX || '', 10);
  return {
    max: Number.isFinite(configuredMax) && configuredMax > 0 ? configuredMax : 5,
    windowMs: 15 * 60 * 1000,
  };
}
let defaultPayload: Promise<LeadPayloadAdapter> | undefined;
let defaultPost: ((request: Request) => Promise<Response>) | undefined;

async function getDefaultPayload(): Promise<LeadPayloadAdapter> {
  if (!defaultPayload) {
    defaultPayload = (async () => {
      const { default: config } = await import('../../../payload.config');
      return (await getPayload({ config })) as unknown as LeadPayloadAdapter;
    })();
  }
  return defaultPayload;
}

function json(data: unknown, status: number, headers?: HeadersInit) {
  return Response.json(data, {
    status,
    headers: { 'cache-control': 'no-store', ...headers },
  });
}

function clientKey(request: Request) {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

function isRateLimited(
  limiter: Map<string, number[]>,
  key: string,
  options: LeadRateLimitOptions,
  now: number,
) {
  const recent = (limiter.get(key) ?? []).filter((timestamp) => timestamp > now - options.windowMs);
  if (recent.length >= options.max) {
    limiter.set(key, recent);
    return true;
  }
  recent.push(now);
  limiter.set(key, recent);
  return false;
}

async function relationId(payload: LeadPayloadAdapter, collection: 'divisions' | 'services', slug?: string) {
  if (!slug) return undefined;
  const result = await payload.find({ collection, where: { slug: { equals: slug } }, limit: 1 });
  return result.docs[0]?.id;
}

function safeConfirmationId(id: unknown) {
  return `lead_${String(id).replace(/[^a-zA-Z0-9_-]/g, '')}`;
}

function notificationLead(id: unknown, request: LeadRequest, division?: string, service?: string): LeadNotification {
  return {
    id: Number(id),
    name: request.name,
    email: request.email,
    phone: request.phone,
    company: request.company,
    message: request.message,
    sourcePage: request.sourcePage,
    locale: request.locale,
    division,
    service,
  };
}

export function createLeadPostHandler(dependencies: LeadPostDependencies) {
  const now = dependencies.now ?? (() => new Date());
  const rateLimit = dependencies.rateLimit ?? getDefaultRateLimit();
  const limiter = new Map<string, number[]>();

  return async function post(request: Request): Promise<Response> {
    const currentTime = now();
    if (isRateLimited(limiter, clientKey(request), rateLimit, currentTime.getTime())) {
      return json(
        { error: { code: 'RATE_LIMITED', message: 'Too many contact requests.' } },
        429,
        { 'retry-after': String(Math.ceil(rateLimit.windowMs / 1000)) },
      );
    }

    let input: unknown;
    try {
      input = await request.json();
    } catch {
      return json({ error: { code: 'VALIDATION_ERROR', message: 'Invalid contact request.' } }, 400);
    }
    const parsed = leadRequestSchema.safeParse(input);
    if (!parsed.success) {
      return json({ error: { code: 'VALIDATION_ERROR', message: 'Invalid contact request.' } }, 400);
    }
    if (parsed.data.website.trim() !== '') return json({ accepted: true }, 202);

    const requestData = parsed.data;
    let lead: Record<string, unknown>;
    let division: unknown;
    let service: unknown;
    try {
      const duplicate = await dependencies.payload.find({
        collection: 'leads',
        where: {
          and: [
            { email: { equals: requestData.email } },
            { message: { equals: requestData.message } },
            { createdAt: { greater_than: new Date(currentTime.getTime() - 24 * 60 * 60 * 1000).toISOString() } },
          ],
        },
        limit: 1,
      });
      if (duplicate.docs.length > 0) {
        return json(
          { error: { code: 'DUPLICATE_REQUEST', message: 'A similar request was already received.' } },
          409,
        );
      }

      [division, service] = await Promise.all([
        relationId(dependencies.payload, 'divisions', requestData.division),
        relationId(dependencies.payload, 'services', requestData.service),
      ]);
      lead = await dependencies.payload.create({
        collection: 'leads',
        overrideAccess: true,
        data: {
          name: requestData.name,
          email: requestData.email,
          phone: requestData.phone,
          company: requestData.company,
          message: requestData.message,
          sourcePage: requestData.sourcePage,
          locale: requestData.locale,
          division,
          service,
          status: 'new',
          consent: {
            accepted: true,
            policyVersion: process.env.LEAD_POLICY_VERSION || 'v1',
            recordedAt: currentTime.toISOString(),
          },
        },
      });
    } catch {
      return json(
        { error: { code: 'PERSISTENCE_UNAVAILABLE', message: 'Your request could not be saved.' } },
        503,
      );
    }
    const confirmationId = safeConfirmationId(lead.id);

    try {
      await dependencies.notify(notificationLead(lead.id, requestData, requestData.division, requestData.service));
    } catch {
      return json(
        {
          error: {
            code: 'NOTIFICATION_FAILED',
            message: 'Your request was saved, but notification is temporarily unavailable.',
            confirmationId,
          },
        },
        503,
      );
    }
    return json({ confirmationId }, 201);
  };
}

export async function POST(request: Request) {
  if (!defaultPost) {
    const payload = await getDefaultPayload();
    defaultPost = createLeadPostHandler({ payload, notify: sendLeadNotification });
  }
  return defaultPost(request);
}
