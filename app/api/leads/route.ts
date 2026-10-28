import { getPayload } from 'payload';
import { createHash } from 'node:crypto';
import { leadRequestSchema, type LeadRequest } from '@/lib/validation/leadSchema';
import { sendLeadNotification, type LeadNotification } from '@/lib/email/sendLeadNotification';

export interface LeadPayloadAdapter {
  find(args: { collection: string; where: unknown; limit?: number }): Promise<{ docs: Array<Record<string, unknown>> }>;
  create(args: { collection: string; data: Record<string, unknown>; overrideAccess?: boolean }): Promise<Record<string, unknown>>;
  update?(args: { collection: string; id: unknown; data: Record<string, unknown>; overrideAccess?: boolean }): Promise<Record<string, unknown>>;
  db?: { pool?: LeadRateLimitPool };
}

type LeadNotifier = (lead: LeadNotification) => Promise<void>;
export type LeadRateLimitOptions = { max: number; windowMs: number };

export interface LeadRateLimitPool {
  query(
    text: string,
    values?: readonly unknown[],
  ): Promise<{ rows: Array<{ request_count: number }> }>;
}

export interface LeadRateLimitStore {
  consume(key: string, options: LeadRateLimitOptions, now: number): Promise<boolean>;
}

export interface LeadPostDependencies {
  payload: LeadPayloadAdapter;
  notify: LeadNotifier;
  now?: () => Date;
  rateLimit?: LeadRateLimitOptions;
  rateLimitStore?: LeadRateLimitStore;
}

type MemoryRateLimitEntry = { timestamps: number[]; lastSeen: number };

export function createMemoryRateLimitStore({
  maxEntries = 10_000,
  now = () => Date.now(),
}: { maxEntries?: number; now?: () => number } = {}) {
  const entries = new Map<string, MemoryRateLimitEntry>();

  function prune(currentTime: number, windowMs: number) {
    for (const [key, entry] of entries) {
      entry.timestamps = entry.timestamps.filter((timestamp) => timestamp > currentTime - windowMs);
      if (entry.timestamps.length === 0) entries.delete(key);
    }
    while (entries.size > maxEntries) {
      const oldest = [...entries.entries()].sort((a, b) => a[1].lastSeen - b[1].lastSeen)[0];
      if (!oldest) break;
      entries.delete(oldest[0]);
    }
  }

  return {
    async consume(key: string, options: LeadRateLimitOptions, currentTime = now()) {
      prune(currentTime, options.windowMs);
      const entry = entries.get(key) ?? { timestamps: [], lastSeen: currentTime };
      const limited = entry.timestamps.length >= options.max;
      if (!limited) entry.timestamps.push(currentTime);
      entry.lastSeen = currentTime;
      entries.set(key, entry);
      prune(currentTime, options.windowMs);
      return limited;
    },
    size: () => entries.size,
  } satisfies LeadRateLimitStore & { size: () => number };
}

export function createPostgresRateLimitStore(pool: LeadRateLimitPool, maxEntries = 10_000): LeadRateLimitStore {
  return {
    async consume(key, options, currentTime) {
      const result = await pool.query(
        `WITH current_window AS (
          INSERT INTO "lead_rate_limits" ("key", "window_started_at", "request_count", "updated_at")
          VALUES ($1, to_timestamp($2 / 1000.0), 1, to_timestamp($2 / 1000.0))
          ON CONFLICT ("key") DO UPDATE SET
            "request_count" = CASE
              WHEN "lead_rate_limits"."window_started_at" <= to_timestamp($2 / 1000.0) - ($3 * interval '1 millisecond') THEN 1
              ELSE "lead_rate_limits"."request_count" + 1
            END,
            "window_started_at" = CASE
              WHEN "lead_rate_limits"."window_started_at" <= to_timestamp($2 / 1000.0) - ($3 * interval '1 millisecond') THEN to_timestamp($2 / 1000.0)
              ELSE "lead_rate_limits"."window_started_at"
            END,
            "updated_at" = to_timestamp($2 / 1000.0)
          RETURNING "request_count"
        ), expired AS (
          DELETE FROM "lead_rate_limits"
          WHERE "updated_at" < to_timestamp($2 / 1000.0) - interval '1 day'
        )
        SELECT "request_count" FROM current_window`,
        [key, currentTime, options.windowMs],
      );
      await pool.query(
        `DELETE FROM "lead_rate_limits"
         WHERE "key" IN (
           SELECT "key" FROM "lead_rate_limits"
           ORDER BY "updated_at" DESC
           OFFSET $1
         )`,
        [maxEntries],
      );
      return (result.rows[0]?.request_count ?? options.max + 1) > options.max;
    },
  };
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
const defaultMemoryRateLimitStore = createMemoryRateLimitStore();

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
  if (process.env.TRUST_PROXY !== 'true') return 'untrusted-client';
  const headerName = process.env.TRUSTED_PROXY_IP_HEADER || 'x-forwarded-for';
  const value = request.headers.get(headerName)?.split(',')[0]?.trim();
  return value ? `trusted-proxy:${value}` : 'trusted-proxy:unknown';
}

function idempotencyKey(request: LeadRequest) {
  return createHash('sha256')
    .update(JSON.stringify({
      email: request.email,
      message: request.message,
      locale: request.locale,
      sourcePage: request.sourcePage,
      division: request.division,
      service: request.service,
    }))
    .digest('hex');
}

function isUniqueViolation(error: unknown) {
  const candidate = error as { code?: string; message?: string };
  return candidate.code === '23505' || /duplicate key|unique constraint/i.test(candidate.message || '');
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
  const rateLimitStore = dependencies.rateLimitStore ?? createMemoryRateLimitStore();

  return async function post(request: Request): Promise<Response> {
    const currentTime = now();
    let rateLimited: boolean;
    try {
      rateLimited = await rateLimitStore.consume(clientKey(request), rateLimit, currentTime.getTime());
    } catch {
      return json({ error: { code: 'RATE_LIMIT_UNAVAILABLE', message: 'Contact service is temporarily unavailable.' } }, 503);
    }
    if (rateLimited) {
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
          idempotencyKey: idempotencyKey(requestData),
          locale: requestData.locale,
          division,
          service,
          status: 'new',
          notificationStatus: 'pending',
          notificationAttempts: 0,
          notificationNextAttemptAt: currentTime.toISOString(),
          notificationAlertRequired: false,
          consent: {
            accepted: true,
            policyVersion: process.env.LEAD_POLICY_VERSION || 'v1',
            recordedAt: currentTime.toISOString(),
          },
        },
      });
    } catch (error) {
      if (isUniqueViolation(error)) {
        return json(
          { error: { code: 'DUPLICATE_REQUEST', message: 'A similar request was already received.' } },
          409,
        );
      }
      return json(
        { error: { code: 'PERSISTENCE_UNAVAILABLE', message: 'Your request could not be saved.' } },
        503,
      );
    }
    const confirmationId = safeConfirmationId(lead.id);

    try {
      await dependencies.notify(notificationLead(lead.id, requestData, requestData.division, requestData.service));
      await dependencies.payload.update?.({
        collection: 'leads',
        id: lead.id,
        overrideAccess: true,
        data: {
          notificationStatus: 'sent',
          notificationAttempts: 1,
          notificationNextAttemptAt: null,
          notificationAlertRequired: false,
        },
      });
    } catch {
      try {
        await dependencies.payload.update?.({
          collection: 'leads',
          id: lead.id,
          overrideAccess: true,
          data: {
            notificationStatus: 'retry_pending',
            notificationAttempts: 1,
            notificationNextAttemptAt: new Date(currentTime.getTime() + 5 * 60 * 1000).toISOString(),
            notificationLastError: 'transport_unavailable',
            notificationAlertRequired: true,
          },
        });
      } catch {
        // The lead was created with a pending notification state; keep the safe response.
      }
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
    const postgresPool = payload.db?.pool;
    const rateLimitStore = postgresPool
      ? createPostgresRateLimitStore(postgresPool)
      : defaultMemoryRateLimitStore;
    defaultPost = createLeadPostHandler({ payload, notify: sendLeadNotification, rateLimitStore });
  }
  return defaultPost(request);
}
