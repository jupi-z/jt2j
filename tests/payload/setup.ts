import { fork } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import type { TestProject } from 'vitest/node';

export default async function setup(project: TestProject) {
  const child = fork(
    fileURLToPath(new URL('./postgres-process.ts', import.meta.url)),
    [],
    {
      execArgv: ['--import', 'tsx'],
      windowsHide: true,
      stdio: ['ignore', 'ignore', 'inherit', 'ipc'],
    },
  );
  const url = await new Promise<string>((resolve, reject) => {
    child.once('error', reject);
    child.once('exit', (code) =>
      reject(new Error(`Test PostgreSQL exited before readiness (${code})`)),
    );
    child.once('message', (message: { url?: string; error?: string }) =>
      message.url ? resolve(message.url) : reject(new Error(message.error)),
    );
  });
  project.provide('postgresURL', url);
  return async () => {
    await new Promise<void>((resolve) => {
      child.once('exit', () => resolve());
      child.send('stop');
    });
  };
}

declare module 'vitest' {
  export interface ProvidedContext {
    postgresURL: string;
  }
}
