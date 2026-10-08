#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { fileURLToPath } from 'node:url';
import { buildDocumentation, checkDocumentation, collectDocumentation, sourceFile, DOCS_ASSETS } from './docs-core.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const [operation = 'build', portArgument] = process.argv.slice(2);
const report = data => console.log(`Manual synchronized · framework ${data.version} · ${data.roles.length} profiles · ${data.tasks.length} contracts · ${data.workflows.length} workflows · revision ${data.fingerprint.slice(0, 12)}`);

try {
  if (operation === 'build') report(buildDocumentation(root).data);
  else if (operation === 'check') report(checkDocumentation(root).data);
  else if (operation === 'serve') {
    const port = Number(portArgument ?? 4321);
    if (!Number.isInteger(port) || port < 0 || port > 65535) throw new Error('Invalid port.');
    let current = buildDocumentation(root).data;
    let error = null;
    const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png' };
    const server = http.createServer((request, response) => {
      response.setHeader('Cache-Control', 'no-store');
      response.setHeader('X-Content-Type-Options', 'nosniff');
      response.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'");
      if (!['GET', 'HEAD'].includes(request.method)) { response.writeHead(405); response.end(); return; }
      let pathname;
      try { pathname = new URL(request.url, 'http://127.0.0.1').pathname; } catch { response.writeHead(400); response.end(); return; }
      if (pathname === '/__docs-status') {
        response.setHeader('Content-Type', 'application/json; charset=utf-8');
        response.end(request.method === 'HEAD' ? undefined : JSON.stringify({ fingerprint: current.fingerprint, watching: true, error }));
        return;
      }
      const name = pathname === '/' ? 'index.html' : pathname.slice(1);
      if (!DOCS_ASSETS.includes(name)) { response.writeHead(404); response.end('File unavailable.'); return; }
      try {
        const bytes = fs.readFileSync(sourceFile(root, `docs-site/dist/${name}`));
        const extension = path.extname(name);
        response.setHeader('Content-Type', extension === '.png' ? types[extension] : `${types[extension]}; charset=utf-8`);
        response.end(request.method === 'HEAD' ? undefined : bytes);
      } catch { response.writeHead(500); response.end('Unable to read the manual.'); }
    });
    const timer = setInterval(() => {
      try {
        const next = collectDocumentation(root).data;
        if (next.fingerprint !== current.fingerprint) { current = buildDocumentation(root).data; report(current); }
        if (error) console.log('Sources corrected; updates resumed.');
        error = null;
      } catch (failure) {
        if (error !== failure.message) console.error(`Update pending: ${failure.message}`);
        error = failure.message;
      }
    }, 1000);
    server.on('error', failure => { clearInterval(timer); console.error(`Unable to open the manual: ${failure.message}`); process.exitCode = 1; });
    server.listen(port, '127.0.0.1', () => {
      console.log(`Local: http://127.0.0.1:${server.address().port}`);
      console.log('Automatic updates active. Ctrl+C stops the server.');
    });
    const close = () => { clearInterval(timer); server.close(() => process.exit(0)); };
    process.on('SIGINT', close);
    process.on('SIGTERM', close);
  } else throw new Error('Use: node scripts/docs.mjs build | check | serve [port]');
} catch (error) { console.error(error.message); process.exitCode = 1; }
