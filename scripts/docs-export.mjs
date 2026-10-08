#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDocumentation, DOCS_ASSETS } from './docs-core.mjs';

const redirects = '/doc /doc/ 308\n/docs /doc/ 308\n/docs/ /doc/ 308\n/docs/* /doc/:splat 308\n';
const headers = `/*
  Cache-Control: no-cache
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'
`;
const legacyIndex = '<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>OLYMPOX documentation</title><script src="/site/doc-redirect.js" defer></script></head><body><a href="/doc/">OLYMPOX documentation / Documentação OLYMPOX</a></body></html>\n';
const escape = value => String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
const localized = (en, pt) => `data-localized data-en="${escape(en)}" data-pt="${escape(pt)}"`;

function landing(built) {
  const { data } = built, pt = data.locales['pt-BR'];
  const roles = data.roles.map((role, index) => `<a class="agent" href="/doc/?lang=pt-BR#agent/${escape(role.id)}" data-doc="agent/${escape(role.id)}"><span class="agent-number">${String(index + 1).padStart(2, '0')}</span><h3>${escape(role.name)}</h3><p ${localized(role.title, pt.roles.find(item => item.id === role.id).title)}>${escape(pt.roles.find(item => item.id === role.id).title)}</p><span class="agent-detail" data-l="agentDetail">Conhecer o perfil</span></a>`).join('\n');
  const panels = data.workflows.map((workflow, index) => {
    const name = pt.workflows.find(item => item.id === workflow.id).name;
    const steps = workflow.steps.map((step, stepIndex) => {
      const task = data.tasks.find(item => item.id === step.task), translated = pt.tasks.find(item => item.id === step.task);
      const owner = data.roles.find(item => item.id === task.owner);
      return `<li><span class="step-index">${String(stepIndex + 1).padStart(2, '0')}</span><div><strong ${localized(task.name, translated.name)}>${escape(translated.name)}</strong><span class="step-owner">${escape(owner.name)}${step.optional ? ' <span data-l="optional">· opcional</span>' : ''}</span></div></li>`;
    }).join('\n');
    return `<section class="flow-panel" id="panel-${escape(workflow.id)}" role="tabpanel" aria-labelledby="tab-${escape(workflow.id)}" tabindex="0"${index ? ' hidden' : ''}><div class="flow-heading"><h3 ${localized(workflow.name, name)}>${escape(name)}</h3><span><b>${workflow.steps.length}</b> <span data-l="steps">etapas</span></span></div><ol class="flow-steps">${steps}</ol><a class="text-link" href="/doc/?lang=pt-BR#workflow/${escape(workflow.id)}" data-doc="workflow/${escape(workflow.id)}" data-l="flowDetail">Ver o fluxo completo na documentação</a></section>`;
  }).join('\n');
  return built.files.get('docs-site/src/landing.html').toString('utf8').replace(/\{\{([A-Z_]+)\}\}/g, (_match, key) => {
    const values = { VERSION: escape(data.version), ROLE_COUNT: data.roles.length, TASK_COUNT: data.tasks.length, WORKFLOW_COUNT: data.workflows.length, ROLE_CARDS: roles, WORKFLOW_PANELS: panels };
    if (!(key in values)) throw new Error(`Unknown landing placeholder: ${key}`);
    return values[key];
  });
}

export function exportDocumentation(root) {
  const output = path.resolve(root, 'out');
  const allowed = new Set(['index.html', '_redirects', '_headers', 'site/landing.css', 'site/landing.js', 'site/doc-redirect.js', ...DOCS_ASSETS.flatMap(name => [`doc/${name}`, `docs/${name}`])]);
  // Refuse unexpected output before writing so stale/private files cannot be published.
  function inspect(directory, relative = '') {
    const stat = fs.lstatSync(directory, { throwIfNoEntry: false });
    if (!stat) return;
    if (stat.isSymbolicLink() || !stat.isDirectory()) throw new Error(`Unsafe public output directory: ${directory}`);
    for (const name of fs.readdirSync(directory)) {
      const child = path.join(directory, name), key = relative ? `${relative}/${name}` : name;
      const childStat = fs.lstatSync(child);
      if (childStat.isSymbolicLink()) throw new Error(`Unsafe public output link: ${key}`);
      if (childStat.isDirectory() && ['doc', 'docs', 'site'].includes(key)) inspect(child, key);
      else if (!childStat.isFile() || !allowed.has(key)) throw new Error(`Unexpected public output: ${key}. Move it outside out/ before exporting.`);
    }
  }
  inspect(output);
  const built = buildDocumentation(root);
  const files = new Map([...built.output].map(([name, bytes]) => [`doc/${name}`, bytes]));
  files.set('index.html', Buffer.from(landing(built)));
  for (const name of ['landing.css', 'landing.js', 'doc-redirect.js']) files.set(`site/${name}`, built.files.get(`docs-site/src/${name}`));
  files.set('docs/index.html', Buffer.from(legacyIndex));
  // Open tabs on the previous /docs release also discover the migration.
  files.set('docs/manifest.json', built.output.get('manifest.json'));
  files.set('_redirects', Buffer.from(redirects));
  files.set('_headers', Buffer.from(headers));
  for (const directory of ['doc', 'docs', 'site']) fs.mkdirSync(path.join(output, directory), { recursive: true });
  for (const [name, bytes] of files) fs.writeFileSync(path.join(output, name), bytes);
  // Remove only known generated files from the old manual, after full preflight.
  for (const name of DOCS_ASSETS.filter(name => !['index.html', 'manifest.json'].includes(name))) {
    const previous = path.join(output, 'docs', name);
    if (fs.existsSync(previous)) fs.unlinkSync(previous);
  }
  return { directory: output, fingerprint: built.data.fingerprint, files: [...files.keys()] };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    if (process.argv.length > 2) throw new Error('Use: node scripts/docs-export.mjs');
    const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
    const result = exportDocumentation(root);
    console.log(`Landing at / and public manual at /doc/ · revision ${result.fingerprint.slice(0, 12)} · ${result.files.length} permitted files`);
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
