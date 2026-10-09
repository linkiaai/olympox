import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { validateFramework } from './framework-core.mjs';

export const DOCS_ASSETS = ['index.html', 'styles.css', 'markdown.js', 'localization.js', 'app.js', 'favicon.svg', 'olympox-logo.png', 'olympox-icon.png', 'content.js', 'manifest.json'];
export const LANDING_SOURCES = ['landing.html', 'landing.css', 'landing.js', 'doc-redirect.js'];
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');

export function sourceFile(root, relative) {
  if (typeof relative !== 'string' || !relative || relative.includes('\\') || path.posix.isAbsolute(relative) || /^[a-z]:/i.test(relative) || relative.split('/').some(part => !part || part === '.' || part === '..')) throw new Error(`Invalid documentation path: ${relative}`);
  const file = path.resolve(root, relative);
  const resolved = fs.realpathSync(file);
  if (!resolved.startsWith(fs.realpathSync(root) + path.sep) || !fs.statSync(file).isFile()) throw new Error(`Source outside the project: ${relative}`);
  const actual = path.relative(fs.realpathSync(root), resolved).split(path.sep).join('/');
  const normalize = value => process.platform === 'win32' ? value.toLowerCase() : value;
  if (normalize(actual) !== normalize(relative)) throw new Error(`Source redirected by a link: ${relative}`);
  return file;
}

function assertPublicGuide(relative, locale = 'en') {
  if (typeof relative !== 'string') throw new Error(`Missing ${locale} guide source in the public selection.`);
  const allowed = locale === 'en'
    ? relative === 'CONSTITUTION.md' || relative === 'framework/README.md' || relative === 'docs-site/README.md' || /^docs\/[a-z0-9-]+\.md$/.test(relative)
    : ['docs/locales/pt-BR/framework/README.md', 'docs/locales/pt-BR/docs-site/README.md'].includes(relative) || /^docs\/locales\/pt-BR\/(?:[a-z0-9-]+|CONSTITUTION|README)\.md$/.test(relative);
  const filename = path.posix.basename(relative);
  if (!allowed || ['estado-do-estudio.md', 'referencia-video.md', 'preparacao-higgsfield.md'].includes(filename)) throw new Error(`Guide outside the public selection: ${relative}`);
}

export function commandCatalog(source, descriptions) {
  const help = source.slice(source.indexOf("command === 'help'"));
  const commands = [...help.matchAll(/node scripts\/studio\.mjs ([^\\\r\n`]+)(?:\\n|\r?\n)/g)].map(match => ({ id: match[1].split(' ')[0], syntax: `node scripts/studio.mjs ${match[1]}` }));
  commands.push({ id: 'help', syntax: 'node scripts/studio.mjs help' });
  const implementations = [...source.matchAll(/command === '([^']+)'/g)].map(match => match[1]);
  if (new Set(commands.map(command => command.id)).size !== commands.length) throw new Error('Duplicate commands in CLI help.');
  for (const id of implementations) if (!commands.some(command => command.id === id)) throw new Error(`Command without syntax in CLI help: ${id}`);
  for (const command of commands) {
    if (!implementations.includes(command.id)) throw new Error(`Advertised command without implementation: ${command.id}`);
    if (!descriptions[command.id]?.trim()) throw new Error(`Command without description in the manual: ${command.id}`);
    command.description = descriptions[command.id];
  }
  return commands;
}

export function installationCommandCatalog(source, descriptions) {
  const commands = [...source.matchAll(/^\s+olympox (setup|install)([^\r\n]+)/gm)].map(match => ({ id: match[1], syntax: `node bin/olympox.mjs ${match[1]}${match[2]}` }));
  if (commands.length !== 2 || new Set(commands.map(command => command.id)).size !== 2) throw new Error('Installation commands require unique setup and install syntax in CLI help.');
  for (const command of commands) {
    if (!source.includes(`command === '${command.id}'`)) throw new Error(`Installation command without implementation: ${command.id}`);
    if (!descriptions[command.id]?.trim()) throw new Error(`Installation command without description: ${command.id}`);
    command.description = descriptions[command.id];
  }
  return commands;
}

export function collectDocumentation(root) {
  const files = new Map();
  const read = relative => {
    if (!files.has(relative)) files.set(relative, fs.readFileSync(sourceFile(root, relative)));
    return files.get(relative).toString('utf8');
  };
  const config = JSON.parse(read('docs-site/config.json'));
  if (!Array.isArray(config.guides) || !config.guides.length) throw new Error('Guide selection is missing.');
  if (typeof config.title !== 'string' || !config.title.trim()) throw new Error('Manual title is missing.');
  if (config.defaultLocale !== 'en' || Object.keys(config.locales ?? {}).sort().join(',') !== 'en,pt-BR') throw new Error('The manual requires English as default and Brazilian Portuguese as a secondary locale.');
  const requiredSections = ['overview', 'start', 'sync', 'constitution'];
  for (const section of requiredSections) if (config.guides.filter(guide => guide.section === section).length !== 1) throw new Error(`Required section missing or duplicated: ${section}`);
  const seen = new Set();
  const guides = config.guides.map(guide => {
    if (!guide || typeof guide.path !== 'string' || typeof guide.label !== 'string' || !guide.label.trim() || (guide.section && !requiredSections.includes(guide.section))) throw new Error('Guide without path/label or with an unknown section.');
    assertPublicGuide(guide.path);
    if (guide.group && !['start', 'create', 'produce', 'records', 'reference', 'maintain'].includes(guide.group)) throw new Error(`Unknown guide navigation group: ${guide.group}`);
    if (seen.has(guide.path)) throw new Error(`Duplicate guide: ${guide.path}`);
    seen.add(guide.path);
    return { ...guide, markdown: read(guide.path) };
  });
  // Validate every registered path before the framework validator reads it.
  const registry = JSON.parse(read('framework/registry.json'));
  for (const [kind, directory, extension] of [['roles', 'roles', 'md'], ['tasks', 'tasks', 'json'], ['workflows', 'workflows', 'json']]) {
    for (const item of registry[kind] ?? []) {
      if (!new RegExp(`^framework/${directory}/[a-z0-9-]+\\.${extension}$`).test(item.path)) throw new Error(`Source for ${kind} outside the public catalog: ${item.path}`);
      sourceFile(root, item.path);
    }
  }
  for (const item of registry.constitutionPaths ?? []) sourceFile(root, item);
  const validation = validateFramework(root);
  if (!validation.valid) throw new Error(`Invalid framework: ${validation.errors.join('; ')}`);
  const roles = registry.roles.map(role => ({ ...role, markdown: read(role.path) }));
  const tasks = registry.tasks.map(item => ({ ...JSON.parse(read(item.path)), path: item.path }));
  const workflows = registry.workflows.map(item => ({ ...JSON.parse(read(item.path)), path: item.path }));
  const commands = [...installationCommandCatalog(read('bin/olympox.mjs'), config.commandDescriptions ?? {}), ...commandCatalog(read('scripts/studio.mjs'), config.commandDescriptions ?? {})];
  for (const [locale, settings] of Object.entries(config.locales)) if (!new RegExp(`^docs-site/locales/${locale}\\.json$`).test(settings.resource)) throw new Error(`Locale resource outside the public selection: ${settings.resource}`);
  const ui = JSON.parse(read(config.locales.en.resource)).ui;
  if (!ui || !Object.keys(ui).length || Object.values(ui).some(value => typeof value !== 'string' || !value.trim())) throw new Error('English UI messages must be nonempty strings.');
  const uiKeys = [
    ...[...read('docs-site/src/app.js').matchAll(/\bt\(['"]([a-zA-Z]+)['"]/g)].map(match => match[1]),
    ...[...read('docs-site/src/index.html').matchAll(/data-i18n(?:-aria)?="([a-zA-Z]+)"/g)].map(match => match[1]),
    'copy', 'codeText', 'table', 'localReference'
  ];
  for (const key of uiKeys) if (!ui[key]) throw new Error(`Missing English UI message: ${key}`);
  const locales = {};
  for (const [locale, settings] of Object.entries(config.locales)) {
    if (locale === 'en') continue;
    const translation = JSON.parse(read(settings.resource));
    const requireText = (value, key) => { if (typeof value !== 'string' || !value.trim()) throw new Error(`Missing ${locale} translation: ${key}`); return value; };
    const placeholders = value => [...new Set([...value.matchAll(/\{([a-zA-Z]+)\}/g)].map(match => match[1]))].sort().join(',');
    for (const key of Object.keys(ui)) {
      requireText(translation.ui?.[key], `ui.${key}`);
      if (placeholders(ui[key]) !== placeholders(translation.ui[key])) throw new Error(`Mismatched ${locale} UI placeholders: ${key}`);
    }
    if (Object.keys(translation.ui).some(key => !(key in ui))) throw new Error(`Unknown ${locale} UI translation key.`);
    const requireCatalog = (items, kind) => {
      if (Object.keys(translation[kind] ?? {}).sort().join(',') !== items.map(item => item.id).sort().join(',')) throw new Error(`Incomplete ${locale} ${kind} translation catalog.`);
    };
    requireCatalog(roles, 'roles'); requireCatalog(tasks, 'tasks'); requireCatalog(workflows, 'workflows');
    const translatedGuides = guides.map(item => {
      const sourcePath = item.translations?.[locale];
      assertPublicGuide(sourcePath, locale);
      return { ...item, sourcePath, label: requireText(translation.guideLabels?.[item.path], `guideLabels.${item.path}`), markdown: read(sourcePath) };
    });
    const translatedRoles = roles.map(item => ({ ...item, title: requireText(translation.roles[item.id].title, `roles.${item.id}.title`), markdown: requireText(translation.roles[item.id].markdown, `roles.${item.id}.markdown`) }));
    const translatedTasks = tasks.map(item => {
      const translated = translation.tasks[item.id];
      if (!Array.isArray(translated.criteria) || translated.criteria.length !== item.criteria.length) throw new Error(`Incomplete ${locale} criteria translation: ${item.id}`);
      return { ...item, name: requireText(translated.name, `tasks.${item.id}.name`), criteria: translated.criteria.map((criterion, index) => requireText(criterion, `tasks.${item.id}.criteria.${index}`)) };
    });
    const translatedWorkflows = workflows.map(item => ({ ...item, name: requireText(translation.workflows[item.id].name, `workflows.${item.id}.name`) }));
    const translatedCommands = commands.map(item => ({ ...item, description: requireText(translation.commandDescriptions?.[item.id], `commandDescriptions.${item.id}`) }));
    locales[locale] = { title: requireText(translation.title, 'title'), ui: translation.ui, guides: translatedGuides, roles: translatedRoles, tasks: translatedTasks, workflows: translatedWorkflows, commands: translatedCommands };
  }
  const templates = fs.readdirSync(path.join(root, 'templates')).filter(name => ['studio-AGENTS.md', 'studio-CLAUDE.md'].includes(name) || /^[a-z0-9-]+\.(json|md)$/.test(name)).sort().map(name => {
    const relative = `templates/${name}`;
    return { path: relative, text: read(relative) };
  });
  for (const [locale, translated] of Object.entries(locales)) translated.templates = templates.map(template => {
    const sourcePath = `templates/locales/${locale}/${path.posix.basename(template.path)}`;
    return { path: template.path, sourcePath, text: read(sourcePath) };
  });
  // Observe implementation hashes without incorporating source code into the site.
  for (const name of fs.readdirSync(path.join(root, 'scripts')).filter(name => name.endsWith('.mjs')).sort()) read(`scripts/${name}`);
  for (const locale of ['en', 'pt-BR']) read(`scripts/onboarding-locales/${locale}.json`);
  for (const name of ['AGENTS.md', 'CONSTITUTION.md', 'package.json']) read(name);
  for (const item of registry.constitutionPaths ?? []) read(item);
  for (const asset of DOCS_ASSETS.filter(name => !['content.js', 'manifest.json'].includes(name))) read(`docs-site/src/${asset}`);
  for (const asset of LANDING_SOURCES) read(`docs-site/src/${asset}`);
  const sources = [...files].sort(([a], [b]) => a.localeCompare(b)).map(([file, bytes]) => ({ path: file, sha256: hash(bytes) }));
  const fingerprint = hash(JSON.stringify(sources));
  const localeNames = Object.fromEntries(Object.entries(config.locales).map(([id, settings]) => [id, settings.name]));
  const manifest = { schemaVersion: 2, frameworkVersion: registry.version, defaultLocale: 'en', locales: localeNames, fingerprint, sources };
  const data = { schemaVersion: 2, defaultLocale: 'en', localeNames, title: config.title, ui, locales, version: registry.version, executionMode: registry.executionMode, fingerprint, roles, tasks, workflows, commands, guides, templates, sources };
  return { data, manifest, files };
}

export function documentationOutput(root) {
  const documentation = collectDocumentation(root);
  const output = new Map();
  for (const name of DOCS_ASSETS.filter(name => !['content.js', 'manifest.json'].includes(name))) output.set(name, documentation.files.get(`docs-site/src/${name}`));
  output.set('content.js', Buffer.from(`globalThis.STUDIO_DOCS = ${JSON.stringify(documentation.data).replace(/</g, '\\u003c').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029')};\n`));
  output.set('manifest.json', Buffer.from(JSON.stringify(documentation.manifest, null, 2) + '\n'));
  return { ...documentation, output };
}

function outputDirectory(root) {
  const parent = sourceFile(root, 'docs-site/config.json');
  const base = path.dirname(parent);
  const destination = path.join(base, 'dist');
  if (fs.existsSync(destination) && fs.realpathSync(destination) !== destination) throw new Error('The documentation output cannot be a link.');
  fs.mkdirSync(destination, { recursive: true });
  return destination;
}

export function buildDocumentation(root) {
  const built = documentationOutput(root);
  const destination = outputDirectory(root);
  for (const [name, bytes] of built.output) {
    const target = path.join(destination, name);
    if (fs.existsSync(target) && fs.lstatSync(target).isSymbolicLink()) throw new Error(`Output cannot be a link: ${name}`);
    const temporary = `${target}.${process.pid}.tmp`;
    fs.writeFileSync(temporary, bytes);
    fs.renameSync(temporary, target);
  }
  return built;
}

export function checkDocumentation(root) {
  const expected = documentationOutput(root);
  for (const [name, bytes] of expected.output) {
    const target = `docs-site/dist/${name}`;
    let actual;
    try { actual = fs.readFileSync(sourceFile(root, target)); } catch { throw new Error(`Manual missing or inaccessible: ${target}. Run npm.cmd run docs:build.`); }
    if (!actual.equals(bytes)) throw new Error(`Manual is stale: ${target}. Run npm.cmd run docs:build.`);
  }
  return expected;
}
