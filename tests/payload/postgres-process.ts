// Isolate embedded-postgres' process exit hooks from Vitest's exit code.
import EmbeddedPostgres from 'embedded-postgres';
import { mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createServer } from 'node:net';

const server = createServer();
await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
const address = server.address();
if (!address || typeof address === 'string') throw new Error('No test port');
const port = address.port;
await new Promise<void>((resolve, reject) =>
  server.close((error) => (error ? reject(error) : resolve())),
);
const pg = new EmbeddedPostgres({
  databaseDir: await mkdtemp(join(tmpdir(), 'jt2j-payload-test-')),
  user: 'postgres',
  password: 'disposable-test-only',
  port,
  persistent: false,
  initdbFlags: ['--locale=C', '--encoding=UTF8'],
  postgresFlags: ['-h', '127.0.0.1'],
  onLog: () => {},
  onError: () => {},
});
let stopping = false;
const stop = async () => {
  if (stopping) return;
  stopping = true;
  await pg.stop();
  process.exit(0);
};
process.on('message', () => {
  void stop();
});
process.on('disconnect', () => {
  void stop();
});
try {
  await pg.initialise();
  await pg.start();
  for (const name of ['access', 'localization', 'seed', 'rollback', 'review'])
    await pg.createDatabase(`jt2j_test_${name}`);
  process.send?.({
    url: `postgresql://postgres:disposable-test-only@127.0.0.1:${port}`,
  });
} catch (error) {
  process.send?.({ error: String(error) });
  await stop();
}
