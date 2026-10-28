import { build } from 'esbuild';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const result = await build({
  entryPoints: ['tests/ui/fixture.tsx'],
  bundle: true,
  write: false,
  outdir: 'test-results/ui-bundle',
  jsx: 'automatic',
  define: { 'process.env.NODE_ENV': '"development"' },
});
const files = new Map(
  result.outputFiles.map((file) => [
    `/${file.path.endsWith('.css') ? 'fixture.css' : 'fixture.js'}`,
    file.contents,
  ]),
);
const html =
  '<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="stylesheet" href="/fixture.css"><style>.fixture-grid{display:grid;grid-template-columns:1fr 1fr;gap:48px;align-items:center}.fixture-grid .abstract-artwork{background:var(--navy)}@media(max-width:640px){.fixture-grid{grid-template-columns:1fr}}</style></head><body><div id="root"></div><script src="/fixture.js"></script></body></html>';
createServer(async (request, response) => {
  const path = new URL(request.url, 'http://127.0.0.1').pathname;
  if (path === '/') {
    response.setHeader('Content-Type', 'text/html; charset=utf-8');
    response.end(html);
  } else if (files.has(path)) {
    response.setHeader(
      'Content-Type',
      path.endsWith('.css') ? 'text/css' : 'text/javascript',
    );
    response.end(files.get(path));
  } else if (/^\/assets\/abstract-[a-z-]+\.svg$/.test(path)) {
    try {
      response.setHeader('Content-Type', 'image/svg+xml');
      response.end(await readFile(resolve(`public${path}`)));
    } catch {
      response.writeHead(404).end();
    }
  } else {
    response.writeHead(404).end();
  }
}).listen(3101, '127.0.0.1');
