import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { buildDocumentation, checkDocumentation, collectDocumentation, commandCatalog, sourceFile } from '../scripts/docs-core.mjs';
import '../docs-site/src/markdown.js';
import '../docs-site/src/localization.js';
import vm from 'node:vm';

const source = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const parent = path.join(source, 'tmp', 'docs-tests');
function fixture() {
  fs.mkdirSync(parent, { recursive: true });
  const root = fs.mkdtempSync(path.join(parent, 'manual-'));
  for (const directory of ['docs', 'framework', 'scripts', 'templates', 'docs-site']) fs.cpSync(path.join(source, directory), path.join(root, directory), { recursive: true, filter: file => !file.startsWith(path.join(source, 'docs-site', 'dist')) });
  for (const name of ['AGENTS.md', 'CONSTITUTION.md', 'package.json']) fs.copyFileSync(path.join(source, name), path.join(root, name));
  return { root, close() { assert.equal(path.dirname(root), parent); assert.match(path.basename(root), /^manual-/); fs.rmSync(root, { recursive: true, force: true }); } };
}

test('manual derives catalogs, is deterministic and checks staleness without writing', () => {
  const instance = fixture();
  try {
    const { root } = instance;
    assert.throws(() => checkDocumentation(root), /Manual missing/);
    assert.equal(fs.existsSync(path.join(root, 'docs-site/dist')), false);
    const built = buildDocumentation(root);
    assert.equal(built.data.roles.length, 9); assert.equal(built.data.tasks.length, 15); assert.equal(built.data.workflows.length, 3);
    assert.equal(built.data.commands.length, 24);
    const repeated = buildDocumentation(root);
    assert.equal(repeated.manifest.fingerprint, built.manifest.fingerprint);
    for (const [name, bytes] of built.output) assert.deepEqual(repeated.output.get(name), bytes);
    checkDocumentation(root);
    const target = path.join(root, 'docs/quick-start.md');
    fs.appendFileSync(target, '\n## Update example\nNew test text.\n');
    const previous = fs.readFileSync(path.join(root, 'docs-site/dist/content.js'));
    assert.throws(() => checkDocumentation(root), /Manual is stale/);
    assert.deepEqual(fs.readFileSync(path.join(root, 'docs-site/dist/content.js')), previous);
    const updated = buildDocumentation(root);
    assert.notEqual(updated.data.fingerprint, built.data.fingerprint);
    assert.match(updated.data.guides.find(guide => guide.path === 'docs/quick-start.md').markdown, /New test text/);
    const registryFile = path.join(root, 'framework/registry.json');
    const registry = JSON.parse(fs.readFileSync(registryFile, 'utf8'));
    registry.roles[1].name = 'Updated Gaia';
    fs.writeFileSync(registryFile, JSON.stringify(registry));
    assert.equal(buildDocumentation(root).data.roles[1].name, 'Updated Gaia');
    checkDocumentation(root);
  } finally { instance.close(); }
});

test('manual excludes private data, rejects unsafe sources and requires command coverage', () => {
  const instance = fixture();
  try {
    const { root } = instance;
    fs.mkdirSync(path.join(root, 'influencers/privada'), { recursive: true });
    const marker = 'SECRET-DO-NOT-PUBLISH-73912';
    fs.writeFileSync(path.join(root, 'influencers/privada/persona.json'), marker);
    fs.writeFileSync(path.join(root, '.env'), marker);
    fs.appendFileSync(path.join(root, 'docs/studio-status.md'), marker);
    const built = buildDocumentation(root);
    for (const bytes of built.output.values()) assert.equal(bytes.includes(marker), false);
    assert.equal(built.manifest.sources.some(item => /^(?:influencers|work|backups|\.env)/.test(item.path)), false);
    assert.throws(() => sourceFile(root, '../CONSTITUTION.md'), /path/);
    assert.throws(() => sourceFile(root, 'C:/outside.md'), /path/);
    const indirect = path.join(root, 'docs-site', 'indirect');
    fs.symlinkSync(path.join(root, 'influencers/privada'), indirect, process.platform === 'win32' ? 'junction' : 'dir');
    assert.throws(() => sourceFile(root, 'docs-site/indirect/persona.json'), /redirected/);
    const configFile = path.join(root, 'docs-site/config.json');
    const config = JSON.parse(fs.readFileSync(configFile, 'utf8'));
    const cli = fs.readFileSync(path.join(root, 'scripts/studio.mjs'), 'utf8');
    assert.throws(() => commandCatalog(cli, {}), /without description/);
    assert.throws(() => commandCatalog(cli.replace("command === 'help'", "command === 'new-operation'"), config.commandDescriptions), /without syntax/);
    const complete = structuredClone(config);
    config.guides = config.guides.filter(guide => guide.section !== 'start');
    fs.writeFileSync(configFile, JSON.stringify(config));
    assert.throws(() => collectDocumentation(root), /Required section/);
    Object.assign(config, complete);
    config.guides.push({ path: 'influencers/privada/persona.json', label: 'Invalid' });
    fs.writeFileSync(configFile, JSON.stringify(config));
    assert.throws(() => collectDocumentation(root), /public selection/);
  } finally { instance.close(); }
});

test('server watches sources, keeps the last valid version and isolates private files', { timeout: 25000 }, async () => {
  const instance = fixture();
  const child = spawn(process.execPath, [path.join(instance.root, 'scripts/docs.mjs'), 'serve', '0'], { cwd: instance.root, stdio: ['ignore', 'pipe', 'pipe'] });
  let output = '';
  child.stdout.setEncoding('utf8'); child.stderr.setEncoding('utf8');
  child.stderr.on('data', text => { output += text; });
  try {
    const url = await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error(`Server did not start: ${output}`)), 8000);
      child.once('error', error => { clearTimeout(timeout); reject(error); });
      child.once('exit', code => { clearTimeout(timeout); reject(new Error(`Server exited ${code}: ${output}`)); });
      child.stdout.on('data', text => { output += text; const match = output.match(/Local: (http:\/\/127\.0\.0\.1:\d+)/); if (match) { clearTimeout(timeout); resolve(match[1]); } });
    });
    const status = async () => (await fetch(`${url}/__docs-status`)).json();
    const until = async predicate => {
      const deadline = Date.now() + 7000;
      while (Date.now() < deadline) { const result = await status(); if (predicate(result)) return result; await new Promise(resolve => setTimeout(resolve, 100)); }
      throw new Error(`Update did not occur: ${output}`);
    };
    const initial = await status();
    assert.equal((await fetch(url)).status, 200);
    for (const name of ['package.json', '.env', 'framework/registry.json', 'influencers/privada/persona.json', '..%2fpackage.json']) assert.equal((await fetch(`${url}/${name}`)).status, 404);
    assert.equal((await fetch(url, { method: 'POST' })).status, 405);
    fs.appendFileSync(path.join(instance.root, 'docs/quick-start.md'), '\nReal automatic update text.\n');
    const updated = await until(result => result.fingerprint !== initial.fingerprint);
    assert.match(await (await fetch(`${url}/content.js`)).text(), /Real automatic update text/);
    const registryPath = path.join(instance.root, 'framework/registry.json');
    const registry = fs.readFileSync(registryPath);
    fs.writeFileSync(registryPath, '{ incomplete');
    const pending = await until(result => Boolean(result.error));
    assert.equal(pending.fingerprint, updated.fingerprint);
    assert.equal((await fetch(url)).status, 200);
    fs.writeFileSync(registryPath, registry);
    await until(result => result.error === null);
    checkDocumentation(instance.root);
  } finally {
    if (child.exitCode === null) {
      const ended = once(child, 'exit');
      child.kill('SIGTERM');
      await ended;
    }
    instance.close();
  }
});

test('Markdown escapes HTML, blocks active protocols and resolves guides and anchors', () => {
  const { render, resolveLink } = globalThis.StudioMarkdown;
  const routes = { 'docs/quick-start.md': 'start', 'CONSTITUTION.md': 'constitution', 'docs/quality.md': 'guide/docs%2Fquality.md' };
  assert.deepEqual(resolveLink('../CONSTITUTION.md', 'docs/quick-start.md', routes), { href: '#constitution', external: false });
  assert.equal(resolveLink('quality.md#Real inspection', 'docs/quick-start.md', routes), null);
  assert.equal(resolveLink('quality.md#real-inspection', 'docs/quick-start.md', routes).href, '#guide/docs%2Fquality.md~real-inspection');
  for (const target of ['javascript:alert(1)', 'data:text/html,hello', '//outside.test', '../../CONSTITUTION.md', 'file:///secret']) assert.equal(resolveLink(target, 'docs/quick-start.md', routes), null);
  const result = render('# Guide\n\n<script>alert(1)</script>\n\n[Danger](javascript:alert)\n\n[Principles](../CONSTITUTION.md)\n\n```html\n<img onerror="alert(1)">\n```\n\n| Area | Usage |\n| --- | --- |\n| Identity | Review |', 'docs/quick-start.md', routes);
  assert.equal(result.html.includes('<script>'), false);
  assert.equal(result.html.includes('<img'), false);
  assert.equal(result.html.includes('href="javascript:'), false);
  assert.match(result.html, /href="#constitution"/);
  assert.match(result.html, /<table>/);
  assert.match(result.html, /&lt;script&gt;/);
});

test('both languages are complete, hashed and use the same canonical routes and syntax', () => {
  const instance = fixture();
  try {
    const built = buildDocumentation(instance.root);
    const { data } = built, translated = data.locales['pt-BR'];
    assert.equal(data.defaultLocale, 'en');
    assert.equal(data.ui.copy, 'Copy'); assert.equal(translated.ui.copy, 'Copiar');
    assert.deepEqual(Object.keys(data.ui).sort(), Object.keys(translated.ui).sort());
    assert.equal(translated.guides.length, data.guides.length);
    assert.equal(translated.templates.length, data.templates.length);
    assert.deepEqual(translated.commands.map(item => item.syntax), data.commands.map(item => item.syntax));
    for (const item of [...translated.guides, ...translated.templates]) assert.equal(built.manifest.sources.some(source => source.path === item.sourcePath), true);
    assert.equal(built.manifest.sources.some(source => source.path === 'docs-site/locales/pt-BR.json'), true);
    const routes = globalThis.StudioLocale.routeMap(data);
    assert.equal(routes['docs/quick-start.md'], 'start');
    assert.equal(routes['docs/locales/pt-BR/quick-start.md'], 'start');
    assert.equal(routes['docs/locales/pt-BR/framework/README.md'], routes['framework/README.md']);
    assert.equal(routes['templates/locales/pt-BR/persona.json'], routes['templates/persona.json']);
    assert.equal(globalThis.StudioMarkdown.resolveLink('quality.md', 'docs/locales/pt-BR/quick-start.md', routes).href, `#${routes['docs/quality.md']}`);
    assert.deepEqual(globalThis.StudioMarkdown.resolveLink('locales/pt-BR/quick-start.md', 'docs/quick-start.md', routes), { href: '?lang=pt-BR#start', external: false, locale: 'pt-BR' });
    assert.deepEqual(globalThis.StudioMarkdown.resolveLink('../../quick-start.md', 'docs/locales/pt-BR/quick-start.md', routes), { href: '?lang=en#start', external: false, locale: 'en' });
    assert.match(globalThis.StudioMarkdown.render('[Português](locales/pt-BR/quick-start.md)', 'docs/quick-start.md', routes).html, /href="\?lang=pt-BR#start" data-locale="pt-BR"/);
    const previous = fs.readFileSync(path.join(instance.root, 'docs-site/dist/content.js'));
    fs.appendFileSync(path.join(instance.root, 'docs/locales/pt-BR/quick-start.md'), '\nTexto novo na tradução.\n');
    assert.throws(() => checkDocumentation(instance.root), /Manual is stale/);
    assert.deepEqual(fs.readFileSync(path.join(instance.root, 'docs-site/dist/content.js')), previous);
    assert.notEqual(buildDocumentation(instance.root).data.fingerprint, data.fingerprint);
    checkDocumentation(instance.root);
  } finally { instance.close(); }
});

test('incomplete and unsafe secondary translations fail before public output', () => {
  const instance = fixture();
  try {
    const resource = path.join(instance.root, 'docs-site/locales/pt-BR.json');
    const original = fs.readFileSync(resource);
    const translation = JSON.parse(original);
    delete translation.ui.noResults;
    fs.writeFileSync(resource, JSON.stringify(translation));
    assert.throws(() => collectDocumentation(instance.root), /Missing pt-BR translation: ui.noResults/);
    fs.writeFileSync(resource, original);
    translation.ui.noResults = 'Nenhum resultado.';
    const originalCoreMessage = translation.ui.core;
    translation.ui.core = 'Núcleo';
    fs.writeFileSync(resource, JSON.stringify(translation));
    assert.throws(() => collectDocumentation(instance.root), /Mismatched pt-BR UI placeholders: core/);
    translation.ui.core = originalCoreMessage;
    translation.tasks['generate-piece'].criteria.pop();
    fs.writeFileSync(resource, JSON.stringify(translation));
    assert.throws(() => collectDocumentation(instance.root), /Incomplete pt-BR criteria translation/);
    fs.writeFileSync(resource, original);
    const configPath = path.join(instance.root, 'docs-site/config.json');
    const config = JSON.parse(fs.readFileSync(configPath));
    config.guides[0].translations['pt-BR'] = 'influencers/private/persona.json';
    fs.writeFileSync(configPath, JSON.stringify(config));
    assert.throws(() => collectDocumentation(instance.root), /outside the public selection/);
    config.guides[0].translations['pt-BR'] = 'docs/locales/pt-BR/framework-manual.md';
    config.locales.en.resource = 'private.json';
    fs.writeFileSync(configPath, JSON.stringify(config));
    assert.throws(() => collectDocumentation(instance.root), /Locale resource outside the public selection/);
    assert.equal(fs.existsSync(path.join(instance.root, 'docs-site/dist')), false);
  } finally { instance.close(); }
});

test('locale selection is explicit, validates values and gives the URL precedence', () => {
  const { select, message } = globalThis.StudioLocale;
  assert.equal(select(), 'en');
  assert.equal(select('', 'pt-BR'), 'pt-BR');
  assert.equal(select('?lang=en', 'pt-BR'), 'en');
  assert.equal(select('?lang=pt-BR', 'en'), 'pt-BR');
  assert.equal(select('?lang=unsupported', 'pt-BR'), 'en');
  assert.equal(select('', 'pt'), 'en');
  assert.equal(message({ test: '{count} files' }, 'test', { count: 2 }), '2 files');
  assert.throws(() => message({}, 'unknown'), /Missing manual UI message/);
});

test('renamed manual preserves an explicit legacy locale and gives the current key precedence', () => {
  const { storageKey, readStored, select } = globalThis.StudioLocale;
  const values = new Map([['ai-influencers.manual.locale', 'pt-BR']]);
  const storage = { getItem: key => values.get(key) ?? null };
  assert.equal(select('', readStored(storage)), 'pt-BR');
  values.set(storageKey, 'en');
  assert.equal(select('', readStored(storage)), 'en');
  assert.equal(readStored({ getItem() { throw new Error('Storage denied'); } }), null);
});

function manualBrowser(data, { url = 'file:///manual/index.html', stored = null, deniedStorage = false } = {}) {
  const elements = new Map(), listeners = new Map(), storedValues = new Map();
  if (stored) storedValues.set('olympox.manual.locale', stored);
  function element(selector, dataset = {}) {
    if (elements.has(selector)) return elements.get(selector);
    const classes = new Set(), handlers = new Map();
    const node = { dataset, innerHTML: '', textContent: '', value: '', hidden: false, attrs: {}, handlers,
      setAttribute(key, value) { this.attrs[key] = value; }, removeAttribute(key) { delete this.attrs[key]; },
      addEventListener(key, handler) { handlers.set(key, handler); }, focus() {}, scrollIntoView() {},
      classList: { contains: key => classes.has(key), remove: key => classes.delete(key), add: key => classes.add(key), toggle(key, force) { const active = force ?? !classes.has(key); if (active) classes.add(key); else classes.delete(key); return active; } }
    };
    elements.set(selector, node); return node;
  }
  const location = new URL(url);
  const textLabels = ['skip', 'manual', 'locale', 'search', 'sync', 'sidebarNote', 'studio', 'footer'].map(key => element(`text:${key}`, { i18n: key }));
  const ariaLabels = ['manualNavigation', 'openNavigation'].map(key => element(`aria:${key}`, { i18nAria: key }));
  const document = { documentElement: { lang: 'en' }, body: element('body'), hidden: false, activeElement: { tagName: 'BODY' },
    querySelector: selector => element(selector), getElementById: () => null,
    querySelectorAll: selector => selector === '[data-i18n]' ? textLabels : selector === '[data-i18n-aria]' ? ariaLabels : [],
    addEventListener(key, handler) { listeners.set(`document:${key}`, handler); }
  };
  let interval, responseStatus;
  const context = vm.createContext({ STUDIO_DOCS: data, URL, URLSearchParams, document, location, navigator: { language: 'pt-BR', clipboard: { writeText: async () => {} } },
    localStorage: { getItem(key) { if (deniedStorage) throw new Error('Storage denied'); return storedValues.get(key); }, setItem(key, value) { if (deniedStorage) throw new Error('Storage denied'); storedValues.set(key, value); } },
    history: { replaceState(_state, _title, value) { location.href = value; } },
    window: { addEventListener(key, handler) { listeners.set(key, handler); }, scrollTo() {} },
    setInterval(handler) { interval = handler; }, setTimeout() {}, clearTimeout() {}, matchMedia: () => ({ matches: false }),
    fetch: async () => ({ ok: true, json: async () => responseStatus })
  });
  for (const file of ['markdown.js', 'localization.js', 'app.js']) vm.runInContext(fs.readFileSync(path.join(source, 'docs-site/src', file), 'utf8'), context);
  return { element, document, location, storedValues, navigate(route) { location.hash = `#${route}`; listeners.get('hashchange')(); }, switchLocale(value) { element('#locale-select').handlers.get('change')({ target: { value } }); }, async crossEdition(value, route) { const link = { dataset: { locale: value }, getAttribute: () => `?lang=${value}#${route}` }; await element('main').handlers.get('click')({ target: { closest: selector => selector === 'a[data-locale]' ? link : null }, preventDefault() {} }); }, search(value) { element('#search').value = value; element('#search').handlers.get('input')(); }, async status(value) { responseStatus = value; await interval(); } };
}

test('portable manual switches every UI surface, localized search and canonical contracts', () => {
  const { data } = collectDocumentation(source);
  const browser = manualBrowser(data);
  assert.equal(browser.document.documentElement.lang, 'en');
  assert.match(browser.element('main').innerHTML, /Start using the studio/);
  assert.equal(browser.element('text:skip').textContent, 'Skip to content');
  assert.equal(browser.element('aria:manualNavigation').attrs['aria-label'], 'Manual navigation');
  assert.equal(browser.element('#sync-status').textContent, 'Portable version');
  browser.navigate('task/generate-piece');
  const englishName = data.tasks.find(item => item.id === 'generate-piece').name;
  assert.match(browser.element('main').innerHTML, /<h2>Full contract<\/h2>/);
  browser.switchLocale('pt-BR');
  assert.equal(browser.document.documentElement.lang, 'pt-BR');
  assert.equal(browser.location.search, '?lang=pt-BR');
  assert.equal(browser.location.hash, '#task/generate-piece');
  assert.equal(browser.storedValues.get('olympox.manual.locale'), 'pt-BR');
  assert.equal(browser.element('text:skip').textContent, 'Ir para o conteúdo');
  assert.equal(browser.element('aria:manualNavigation').attrs['aria-label'], 'Navegação do manual');
  assert.match(browser.element('main').innerHTML, /Gerar a peça real/);
  assert.match(browser.element('main').innerHTML, /<h2>Contrato completo<\/h2>/);
  assert.equal(browser.element('main').innerHTML.includes(englishName), true);
  assert.equal(browser.element('#sync-status').textContent, 'Versão portátil');
  browser.search('Gerar a peça real');
  assert.match(browser.element('#search-results').innerHTML, /task\/generate-piece/);
  browser.search('never-a-real-search-result-73912');
  assert.match(browser.element('#search-results').innerHTML, /Nenhum resultado/);
  browser.switchLocale('en');
  assert.match(browser.element('#search-results').innerHTML, /No results/);
  assert.equal(browser.element('#search').placeholder, 'Agents, workflows, commands…');
  assert.equal(manualBrowser(data, { stored: 'pt-BR' }).document.documentElement.lang, 'pt-BR');
  assert.equal(manualBrowser(data, { url: 'file:///manual/index.html?lang=en', stored: 'pt-BR' }).document.documentElement.lang, 'en');
  const denied = manualBrowser(data, { deniedStorage: true });
  denied.switchLocale('pt-BR');
  assert.equal(denied.document.documentElement.lang, 'pt-BR');
  assert.equal(denied.location.search, '?lang=pt-BR');
});

test('development status stays localized and preserves the last valid render', async () => {
  const { data } = collectDocumentation(source);
  const browser = manualBrowser(data, { url: 'http://127.0.0.1:4321/?lang=pt-BR' });
  const before = browser.element('main').innerHTML;
  await browser.status({ watching: true, error: 'Invalid source', fingerprint: data.fingerprint });
  assert.equal(browser.element('#sync-status').textContent, 'Atualização pendente');
  assert.equal(browser.element('#update-error').hidden, false);
  assert.equal(browser.element('main').innerHTML, before);
  browser.switchLocale('en');
  assert.equal(browser.element('#sync-status').textContent, 'Update pending');
  assert.match(browser.element('#update-error').textContent, /last valid version/);
  await browser.status({ watching: true, error: null, fingerprint: data.fingerprint });
  assert.equal(browser.element('#sync-status').textContent, 'Automatic updates active');
  assert.equal(browser.element('#update-error').hidden, true);
});

test('cross-edition links change language and retain their target route for portable and served manuals', async () => {
  const { data } = collectDocumentation(source);
  for (const url of ['file:///manual/index.html', 'http://127.0.0.1:4321/']) {
    const browser = manualBrowser(data, { url });
    await browser.crossEdition('pt-BR', 'start');
    assert.equal(browser.location.search, '?lang=pt-BR');
    assert.equal(browser.location.hash, '#start');
    assert.equal(browser.document.documentElement.lang, 'pt-BR');
    assert.equal(browser.element('#breadcrumb').textContent, 'Começar');
    browser.navigate('commands');
    assert.equal(browser.document.documentElement.lang, 'pt-BR');
    await browser.crossEdition('en', 'overview');
    assert.equal(browser.location.search, '?lang=en');
    assert.equal(browser.location.hash, '#overview');
    assert.equal(browser.document.documentElement.lang, 'en');
    assert.match(browser.element('main').innerHTML, /Start using the studio/);
  }
});
