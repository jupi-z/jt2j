import {
  createCsrfToken,
  csrfCookie,
  csrfCookieName,
} from '@/lib/security/csrf';

export const dynamic = 'force-dynamic';

export async function GET() {
  const secret = process.env.CSRF_SECRET || process.env.PAYLOAD_SECRET;
  if (!secret || secret.length < 32)
    return Response.json({ error: 'CSRF_UNAVAILABLE' }, { status: 503 });
  const token = createCsrfToken(secret);
  return Response.json(
    { token },
    {
      headers: {
        'cache-control': 'no-store',
        'set-cookie': csrfCookie(token),
        'x-csrf-cookie': csrfCookieName,
      },
    },
  );
}
