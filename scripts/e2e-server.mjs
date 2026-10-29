import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const isWindows = process.platform === 'win32';
const nextCli = fileURLToPath(
  new URL('../node_modules/next/dist/bin/next', import.meta.url),
);
const child = spawn(
  process.execPath,
  [nextCli, 'dev', '--hostname', '127.0.0.1', '--port', '3100'],
  {
    env: { ...process.env, JT2J_E2E_FIXTURES: '1' },
    shell: false,
    stdio: 'inherit',
  },
);

const stop = (signal) => child.kill(isWindows ? undefined : signal);
process.on('SIGINT', () => stop('SIGINT'));
process.on('SIGTERM', () => stop('SIGTERM'));
child.on('exit', (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  else process.exit(code ?? 1);
});
