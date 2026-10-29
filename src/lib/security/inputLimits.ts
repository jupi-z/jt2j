export const MAX_PUBLIC_JSON_BYTES = 16 * 1024;

export async function readJsonWithLimit(
  request: Request,
  maxBytes = MAX_PUBLIC_JSON_BYTES,
) {
  const declared = Number(request.headers.get('content-length') || 0);
  if (declared > maxBytes) throw new Error('REQUEST_BODY_TOO_LARGE');
  if (!request.body) return JSON.parse('') as unknown;
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > maxBytes) throw new Error('REQUEST_BODY_TOO_LARGE');
      chunks.push(value);
    }
  } catch (error) {
    await reader.cancel();
    throw error;
  }
  const bytes = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return JSON.parse(new TextDecoder().decode(bytes)) as unknown;
}
