export function assertProductionEnvironment(
  input: Record<string, string | undefined>,
) {
  if (input.NODE_ENV !== 'production') return;
  const siteUrl = input.SITE_URL || '';
  const required = ['DATABASE_URL', 'PAYLOAD_SECRET', 'CSRF_SECRET'];
  const missing = required.filter((name) => !input[name]);
  if (!siteUrl.startsWith('https://')) missing.push('SITE_URL(https)');
  for (const name of ['PAYLOAD_SECRET', 'CSRF_SECRET']) {
    if (input[name] && input[name]!.length < 32)
      missing.push(`${name}(length)`);
  }
  if (missing.length)
    throw new Error(`Invalid production environment: ${missing.join(', ')}`);
}
