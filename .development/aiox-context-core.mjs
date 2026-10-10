import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

export const aioxVersion = '5.4.1';
const integrity = 'sha512-lWxAnKvQ8IlkVnHnznw6lUDowtAvcQcgumcQ2XZFgf/dceLGHoQXwmEnAzD4uS+o9zYd05MwDGMkyP8i0wzWDQ==';
const requirementsPath = '.aiox-core/data/agent-config-requirements.yaml';
const reportPath = '.development/state/aiox-context-adaptation.json';
const baselinePath = '.development/state/tooling-source/agent-config-requirements-5.4.1.yaml';
export const roles = ['aiox-master', 'analyst', 'architect', 'data-engineer', 'dev', 'devops', 'pm', 'po', 'qa', 'sm', 'squad-creator', 'ux-design-expert'];
export const guideNames = ['coding-standards.md', 'tech-stack.md', 'source-tree.md'];
// This independent matrix prevents a removed requirement from passing verification.
export const roleGuideIndexes = { dev: [0, 1, 2], pm: [0, 1], sm: [0], analyst: [1, 2], 'ux-design-expert': [1, 0] };
export const sha256 = bytes => crypto.createHash('sha256').update(bytes).digest('hex');

export function safeLocalPath(root, relative) {
  if (typeof relative !== 'string' || !relative || relative.includes('\\') || path.posix.isAbsolute(relative) || path.win32.isAbsolute(relative)
    || relative.split('/').some(part => !part || part === '.' || part === '..' || !/^[A-Za-z0-9._ -]+$/.test(part))) {
    throw new Error(`Unsafe engineering context path: ${relative}`);
  }
  const resolvedRoot = path.resolve(root), target = path.resolve(resolvedRoot, relative);
  if (!target.startsWith(resolvedRoot + path.sep)) throw new Error(`Engineering context path leaves checkout: ${relative}`);
  let current = resolvedRoot;
  for (const part of ['', ...relative.split('/')]) {
    if (part) current = path.join(current, part);
    let stat;
    try { stat = fs.lstatSync(current); } catch (error) { if (error.code !== 'ENOENT') throw error; }
    if (stat?.isSymbolicLink()) throw new Error(`Linked engineering context path is unsupported: ${relative}`);
  }
  return target;
}

export function contextPaths(root, config, { checkGuides = true } = {}) {
  safeLocalPath(root, config.frameworkDocsLocation);
  if (!Array.isArray(config.devLoadAlwaysFiles) || config.devLoadAlwaysFiles.length !== 3 || new Set(config.devLoadAlwaysFiles).size !== 3) {
    throw new Error('AIOX engineering needs exactly three distinct devLoadAlwaysFiles, ordered coding standards, technology, source tree.');
  }
  const common = guideNames.map(name => `${config.frameworkDocsLocation}/${name}`);
  const dev = [...config.devLoadAlwaysFiles];
  for (const file of new Set([...common, ...dev])) {
    const target = safeLocalPath(root, file);
    if (checkGuides) {
      if (!fs.lstatSync(target).isFile() || !fs.readFileSync(target, 'utf8').trim()) throw new Error(`Required engineering guide is missing or empty: ${file}`);
    }
  }
  return { frameworkDocsLocation: config.frameworkDocsLocation, devLoadAlwaysFiles: dev, common, dev };
}

function adaptedRequirements(baseline, mapping) {
  let role = null;
  const text = baseline.toString('utf8').split(/(?<=\n)/).map(line => {
    const roleMatch = line.match(/^  ([a-z-]+):\s*(?:\r?\n)?$/);
    if (roleMatch) role = roleMatch[1];
    if (/^[a-z_]+:/.test(line)) role = null;
    return line.replace(/docs\/framework\/(coding-standards\.md|tech-stack\.md|source-tree\.md)/g, (_, name) => {
      const index = guideNames.indexOf(name);
      return JSON.stringify((role === 'dev' ? mapping.dev : mapping.common)[index]);
    });
  }).join('');
  return Buffer.from(text);
}

export function readPinnedSource(root) {
  const archive = safeLocalPath(root, '.development/state/tooling-source/aiox-squads-core-5.4.1.tgz');
  const bytes = fs.readFileSync(archive);
  if ('sha512-' + crypto.createHash('sha512').update(bytes).digest('base64') !== integrity) throw new Error('Official AIOX 5.4.1 archive integrity mismatch; run the reviewed repair recipe.');
  const read = relative => execFileSync('tar', ['-xOf', archive, `package/${relative}`], { maxBuffer: 16 * 1024 * 1024, windowsHide: true });
  const baseline = read(requirementsPath);
  if (sha256(baseline) !== '68e87b5777d1872c4fed6644dd3c7e3c3e8fd590df7d2b58c36d541cf8e38dd3') throw new Error('Pinned upstream requirement baseline differs from the reviewed source.');
  const internal = JSON.parse(fs.readFileSync(safeLocalPath(root, '.aiox-core/package.json'), 'utf8'));
  if (internal.name !== '@aiox-squads/core-internal' || internal.version !== aioxVersion) throw new Error('Expected the pinned official AIOX 5.4.1 internal runtime.');
  const preservedSources = {};
  for (const file of ['.aiox-core/development/scripts/agent-config-loader.js', ...roles.map(role => `.aiox-core/development/agents/${role}.md`)]) {
    const official = read(file), actual = fs.readFileSync(safeLocalPath(root, file));
    if (!actual.equals(official)) throw new Error(`AIOX source differs from pinned upstream; refusing context adaptation: ${file}`);
    preservedSources[file] = sha256(official);
  }
  return { baseline, preservedSources, upstream: { package: '@aiox-squads/core', version: aioxVersion, integrity, archiveSha256: sha256(bytes), requirementsSha256: sha256(baseline) } };
}

export function prepareContextAdaptation(root, config, { checkGuides = true } = {}) {
  const mapping = contextPaths(root, config, { checkGuides });
  const source = readPinnedSource(root);
  const adapted = adaptedRequirements(source.baseline, mapping);
  const target = safeLocalPath(root, requirementsPath);
  const current = fs.readFileSync(target);
  const report = safeLocalPath(root, reportPath), baselineTarget = safeLocalPath(root, baselinePath);
  if (fs.existsSync(baselineTarget) && !fs.readFileSync(baselineTarget).equals(source.baseline)) throw new Error('Stored official requirement baseline conflicts with pinned source.');
  let previous = null, recognized = current.equals(source.baseline) || current.equals(adapted);
  if (fs.existsSync(report)) {
    previous = JSON.parse(fs.readFileSync(report, 'utf8'));
    if (previous.revision !== 1 || previous.upstream?.requirementsSha256 !== source.upstream.requirementsSha256 || previous.upstream?.integrity !== source.upstream.integrity) throw new Error('Unknown AIOX context adaptation provenance; review before writing.');
    const oldMapping = contextPaths(root, previous.mapping, { checkGuides: false });
    const oldBytes = adaptedRequirements(source.baseline, oldMapping);
    if (sha256(oldBytes) !== previous.adaptedSha256) throw new Error('Stored AIOX context adaptation hash does not match its reviewed mapping.');
    recognized ||= current.equals(oldBytes);
  }
  if (!recognized) throw new Error('Existing AIOX requirements conflict with pinned baseline/adaptation; refusing writes.');
  return { ...source, mapping, adapted, target, current, report, baselineTarget, previous };
}

export function applyContextAdaptation(root, config) {
  const plan = prepareContextAdaptation(root, config);
  const adaptedSha256 = sha256(plan.adapted);
  const sameApplication = plan.previous?.adaptedSha256 === adaptedSha256 && typeof plan.previous.inputSha256 === 'string';
  const mapping = { frameworkDocsLocation: plan.mapping.frameworkDocsLocation, devLoadAlwaysFiles: plan.mapping.devLoadAlwaysFiles };
  const report = { revision: 1, operation: 'remap-engineering-guide-requirements', upstream: plan.upstream, baselineFile: baselinePath, mapping,
    inputSha256: sameApplication ? plan.previous.inputSha256 : sha256(plan.current),
    adaptedSha256, preservedSources: plan.preservedSources, appliedAt: sameApplication ? plan.previous.appliedAt : new Date().toISOString() };
  fs.mkdirSync(path.dirname(plan.baselineTarget), { recursive: true });
  if (!fs.existsSync(plan.baselineTarget)) fs.writeFileSync(plan.baselineTarget, plan.baseline, { flag: 'wx' });
  if (!plan.current.equals(plan.adapted)) fs.writeFileSync(plan.target, plan.adapted);
  fs.writeFileSync(plan.report, JSON.stringify(report, null, 2) + '\n');
  return report;
}

export async function verifyRoleContexts(root, config, require) {
  assert.equal(path.resolve(process.cwd()), path.resolve(root), 'The real AIOX loader resolves files from process.cwd().');
  const plan = prepareContextAdaptation(root, config, { checkGuides: false });
  assert.ok(plan.current.equals(plan.adapted), 'AIOX requirements have not been adapted to the configured engineering paths.');
  const yaml = require('js-yaml');
  const requirements = yaml.load(plan.adapted.toString('utf8'));
  const { AgentConfigLoader } = require('./development/scripts/agent-config-loader.js');
  const summary = [];
  for (const role of roles) {
    const loader = new AgentConfigLoader(role);
    const loaded = await loader.loadComplete(config, { skipCache: true, trackPerformance: false });
    assert.equal(loaded.agent.id, role, `Loaded role identity differs: ${role}`);
    const expectedGuides = (roleGuideIndexes[role] || []).map(index => (role === 'dev' ? plan.mapping.dev : plan.mapping.common)[index]);
    const required = (requirements.agents[role].files_loaded || []).map(entry => typeof entry === 'string' ? { path: entry, lazy: false } : entry);
    for (const file of expectedGuides) assert.ok(required.some(entry => entry.path === file && !entry.lazy), `${role}: missing required engineering guide ${file}`);
    for (const entry of required) {
      if (entry.lazy && !loader.shouldLoadLazy(entry.condition)) continue;
      const fullPath = safeLocalPath(root, entry.path);
      const actual = loaded.files[entry.path];
      assert.ok(typeof actual?.content === 'string' && actual.content.trim() && !actual.error, `${role}: required context unavailable or empty: ${entry.path} (${actual?.error || 'no contents'})`);
      assert.equal(actual.fromCache, false, `${role}: fresh context required: ${entry.path}`);
      assert.ok(Buffer.from(actual.content, 'utf8').equals(fs.readFileSync(fullPath)), `${role}: loaded bytes differ: ${entry.path}`);
    }
    summary.push({ role, requiredFiles: required.filter(entry => !entry.lazy).map(entry => entry.path), skippedLazy: required.filter(entry => entry.lazy && !loader.shouldLoadLazy(entry.condition)).map(entry => entry.path), engineeringGuides: expectedGuides });
  }
  return { version: aioxVersion, adaptedSha256: sha256(plan.adapted), roles: summary };
}
