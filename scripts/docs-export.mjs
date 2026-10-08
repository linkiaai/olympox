#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDocumentation, DOCS_ASSETS } from './docs-core.mjs';

const redirects = '/ /docs/ 308\n/docs /docs/ 308\n';
const headers = `/*
  Cache-Control: no-cache
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'
`;
const index = '<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta http-equiv="refresh" content="0;url=/docs/"><title>OLYMPOX documentation</title></head><body><a href="/docs/">OLYMPOX documentation</a></body></html>\n';

export function exportDocumentation(root) {
  const output = path.resolve(root, 'out');
  const allowed = new Set(['index.html', '_redirects', '_headers', ...DOCS_ASSETS.map(name => `docs/${name}`)]);
  // Refuse unexpected output before writing so stale/private files cannot be published.
  function inspect(directory, relative = '') {
    const stat = fs.lstatSync(directory, { throwIfNoEntry: false });
    if (!stat) return;
    if (stat.isSymbolicLink() || !stat.isDirectory()) throw new Error(`Unsafe public output directory: ${directory}`);
    for (const name of fs.readdirSync(directory)) {
      const child = path.join(directory, name), key = relative ? `${relative}/${name}` : name;
      const childStat = fs.lstatSync(child);
      if (childStat.isSymbolicLink()) throw new Error(`Unsafe public output link: ${key}`);
      if (childStat.isDirectory() && key === 'docs') inspect(child, key);
      else if (!childStat.isFile() || !allowed.has(key)) throw new Error(`Unexpected public output: ${key}. Move it outside out/ before exporting.`);
    }
  }
  inspect(output);
  const built = buildDocumentation(root);
  const files = new Map([...built.output].map(([name, bytes]) => [`docs/${name}`, bytes]));
  files.set('index.html', Buffer.from(index));
  files.set('_redirects', Buffer.from(redirects));
  files.set('_headers', Buffer.from(headers));
  fs.mkdirSync(path.join(output, 'docs'), { recursive: true });
  for (const [name, bytes] of files) fs.writeFileSync(path.join(output, name), bytes);
  return { directory: output, fingerprint: built.data.fingerprint, files: [...files.keys()] };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    if (process.argv.length > 2) throw new Error('Use: node scripts/docs-export.mjs');
    const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
    const result = exportDocumentation(root);
    console.log(`Public manual prepared at /docs/ · revision ${result.fingerprint.slice(0, 12)} · ${result.files.length} permitted files`);
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
