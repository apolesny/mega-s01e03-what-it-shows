import { createServer } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';
import { render } from 'svelte/server';
import path from 'path';
import fs from 'fs';
const app = path.resolve(process.argv[2]);          // project root (copy of repo)
const route = '/' + process.argv[3];
const out = process.argv[4];
const server = await createServer({
  root: app, configFile: false, mode: 'production', logLevel: 'warn',
  plugins: [svelte({
    extensions: ['.svelte', '.svx'], compilerOptions: { dev: false },
    preprocess: [mdsvex({ extensions: ['.svx'], layout: { runbook: path.join(app, 'src/lib/layouts/runbook.svelte') } })],
  })],
  resolve: { alias: { '#lib': path.join(app, 'src/lib') } },
  server: { middlewareMode: true, fs: { strict: false } },
  appType: 'custom',
});
try {
  const mod = await server.ssrLoadModule(route);
  const { body, head } = render(mod.default, { props: {} });
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">${head}</head><body>${body}</body></html>`;
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, html);
  console.log('rendered', html.length);
} catch (e) { console.error('ERR', e); process.exitCode = 1; }
await server.close();
