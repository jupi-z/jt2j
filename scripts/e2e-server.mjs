import { spawn } from 'node:child_process';

const command = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm';
const child = spawn(
  command,
  ['dev', '--hostname', '127.0.0.1', '--port', '3100'],
  {
    env: { ...process.env, JT2J_E2E_FIXTURES: '1' },
    stdio: 'inherit',
  },
);

const stop = (signal) => child.kill(signal);
process.on('SIGINT', () => stop('SIGINT'));
process.on('SIGTERM', () => stop('SIGTERM'));
child.on('exit', (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  else process.exit(code ?? 1);
});
