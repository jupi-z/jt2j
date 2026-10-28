export const MAX_PUBLIC_JSON_BYTES = 16 * 1024;

export async function readJsonWithLimit(
  request: Request,
  maxBytes = MAX_PUBLIC_JSON_BYTES,
) {
  const declared = Number(request.headers.get('content-length') || 0);
  if (declared > maxBytes) throw new Error('REQUEST_BODY_TOO_LARGE');
  const body = await request.text();
  if (new TextEncoder().encode(body).byteLength > maxBytes)
    throw new Error('REQUEST_BODY_TOO_LARGE');
  return JSON.parse(body) as unknown;
}
