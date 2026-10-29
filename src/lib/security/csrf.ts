import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';

export const csrfCookieName = 'jt2j_csrf';
export const csrfHeaderName = 'x-csrf-token';

export function createCsrfToken(
  secret: string,
  nonce = randomBytes(24).toString('base64url'),
) {
  const signature = createHmac('sha256', secret)
    .update(nonce)
    .digest('base64url');
  return `${nonce}.${signature}`;
}

function validToken(token: string | null, secret: string) {
  if (!token) return false;
  const [nonce, signature] = token.split('.');
  if (!nonce || !signature) return false;
  const expected = createHmac('sha256', secret)
    .update(nonce)
    .digest('base64url');
  if (signature.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}

export function validateCsrfRequest(request: Request, secret: string) {
  const header = request.headers.get(csrfHeaderName);
  const cookie =
    request.headers
      .get('cookie')
      ?.split(';')
      .map((part) => part.trim())
      .find((part) => part.startsWith(`${csrfCookieName}=`))
      ?.slice(csrfCookieName.length + 1) || null;
  return validToken(header, secret) && header === cookie;
}

export function csrfCookie(
  token: string,
  secure = process.env.NODE_ENV === 'production',
) {
  return `${csrfCookieName}=${token}; Max-Age=3600; Path=/; HttpOnly; SameSite=Lax${secure ? '; Secure' : ''}`;
}
