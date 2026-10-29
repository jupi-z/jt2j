import { publicRoutes } from '../src/routing/catalog';

export type SmokeConfig = { baseUrl: string; contactToken?: string };
export type SmokeCheck = { path: string; method?: 'GET' | 'POST'; expectedContentType?: string };

export function parseSmokeConfig(input: Record<string, string | undefined>): SmokeConfig {
  const raw = input.SMOKE_BASE_URL?.trim();
  if (!raw) throw new Error('SMOKE_BASE_URL is required');
  const url = new URL(raw);
  if (!['http:', 'https:'].includes(url.protocol)) throw new Error('SMOKE_BASE_URL must use http or https');
  return { baseUrl: url.toString().replace(/\/$/, ''), contactToken: input.SMOKE_CONTACT_TOKEN?.trim() || undefined };
}

export function buildSmokeChecks(config: SmokeConfig): SmokeCheck[] {
  const paths = new Set<string>([
    '/api/health',
    ...['fr', 'en'].flatMap((locale) => publicRoutes.map((route) => `/${locale}${route.path}`)),
    '/robots.txt',
    '/sitemap.xml',
  ]);
  if (config.contactToken) paths.add('/api/leads');
  return [...paths].map((path) => ({
    path,
    method: path === '/api/leads' ? 'POST' : 'GET',
    expectedContentType: path === '/api/health' ? 'application/json' : undefined,
  }));
}

async function run() {
  const config = parseSmokeConfig(process.env);
  const checks = buildSmokeChecks(config);
  const failures: string[] = [];
  for (const check of checks) {
    const response = await fetch(`${config.baseUrl}${check.path}`, {
      method: check.method,
      headers: check.method === 'POST' ? { 'content-type': 'application/json', 'x-jt2j-smoke-token': config.contactToken || '' } : undefined,
      body: check.method === 'POST' ? JSON.stringify({ name: 'JT2J smoke test', email: 'smoke-test@example.invalid', message: 'Automated staging contact smoke test.', locale: 'fr', sourcePage: '/fr/contact', consent: true, website: '' }) : undefined,
    });
    const statusOk = check.path === '/api/leads' ? response.status < 500 : response.ok;
    const contentType = response.headers.get('content-type') || '';
    const contentTypeOk = check.expectedContentType ? contentType.includes(check.expectedContentType) : true;
    if (!statusOk || !contentTypeOk) failures.push(`${check.method || 'GET'} ${check.path}: ${response.status} ${contentType}`);
  }
  if (failures.length) throw new Error(`Smoke checks failed:\n${failures.join('\n')}`);
  console.log(`SMOKE_OK checks=${checks.length} contactMode=${Boolean(config.contactToken)}`);
}

if (process.argv[1] && /smoke-public\.(ts|js)$/.test(process.argv[1])) await run();
