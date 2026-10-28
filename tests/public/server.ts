import { fork, spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { getPayload } from 'payload';
import { createPayloadConfig } from '../../src/payload/config';
import { seed } from '../../src/seed/seed';
const pg = fork(
  fileURLToPath(new URL('../payload/postgres-process.ts', import.meta.url)),
  [],
  {
    execArgv: ['--import', 'tsx'],
    windowsHide: true,
    stdio: ['ignore', 'ignore', 'inherit', 'ipc'],
  },
);
const url = await new Promise<string>((resolve, reject) => {
  pg.once('error', reject);
  pg.once('message', (message: { url?: string; error?: string }) =>
    message.url ? resolve(message.url) : reject(new Error(message.error)),
  );
});
// Only this freshly created disposable database receives fixture publications.
const env = {
  ...process.env,
  DATABASE_URL: `${url}/jt2j_test_public`,
  PAYLOAD_SECRET: 'disposable-browser-test-secret-32-characters',
  MEDIA_STORAGE: 'local',
  NEXT_TELEMETRY_DISABLED: '1',
};
const payload = await getPayload({ config: createPayloadConfig(env) });
await payload.db.migrate();
await seed(payload);
const publisher = await payload.create({
  collection: 'users',
  data: {
    email: 'publisher@example.test',
    password: 'disposable-test-password',
    role: 'publisher',
  },
});
for (const collection of ['divisions', 'services', 'pages', 'faqs'] as const) {
  const docs = (await payload.find({ collection, pagination: false })).docs;
  for (const doc of docs)
    await payload.update({
      collection,
      id: doc.id,
      overrideAccess: false,
      user: publisher,
      data: {
        _status: 'published',
        publicationApproved: true,
        claims: (doc.claims ?? []).map((c) => ({
          ...c,
          status: 'approved' as const,
          approvedBy: 'Test fixture',
          evidence: 'Disposable browser fixture only',
        })),
      },
    });
}
await payload.destroy();
const app = spawn(
  process.execPath,
  [
    'node_modules/next/dist/bin/next',
    'start',
    '--hostname',
    '127.0.0.1',
    '--port',
    '3100',
  ],
  { env, windowsHide: true, stdio: 'inherit' },
);
let stopping = false;
async function stop() {
  if (stopping) return;
  stopping = true;
  app.kill();
  pg.send('stop');
}
process.on('SIGINT', () => {
  void stop();
});
process.on('SIGTERM', () => {
  void stop();
});
app.on('exit', () => {
  void stop();
});
