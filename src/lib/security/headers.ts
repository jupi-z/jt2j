export type SecurityHeadersOptions = { production?: boolean };

export function securityHeaders({
  production = process.env.NODE_ENV === 'production',
}: SecurityHeadersOptions = {}) {
  const headers: Record<string, string> = {
    'content-security-policy': [
      "default-src 'self'",
      "base-uri 'self'",
      "object-src 'none'",
      "frame-ancestors 'none'",
      "form-action 'self'",
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob:",
      "font-src 'self' data:",
      "connect-src 'self'",
    ].join('; '),
    'x-content-type-options': 'nosniff',
    'x-frame-options': 'DENY',
    'referrer-policy': 'strict-origin-when-cross-origin',
    'permissions-policy':
      'camera=(), microphone=(), geolocation=(), payment=()',
    'cross-origin-opener-policy': 'same-origin',
  };
  if (production)
    headers['strict-transport-security'] =
      'max-age=31536000; includeSubDomains; preload';
  return headers;
}
