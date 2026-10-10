import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { spawnSync } from 'node:child_process';
import test from 'node:test';
import assert from 'node:assert/strict';
import { applyContextAdaptation, readPinnedSource, roles, guideNames, sha256 } from './aiox-context-core.mjs';

const project = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const parent = path.join(project, 'tmp', 'aiox-context-tests');
const yaml = createRequire(path.join(project, '.aiox-core/package.json'))('js-yaml');
const source = readPinnedSource(project);
const config = yaml.load(fs.readFileSync(path.join(project, '.aiox-core/core-config.yaml'), 'utf8'));
const requirements = '.aiox-core/data/agent-config-requirements.yaml';
const officialRequirements = yaml.load(source.baseline.toString('utf8'));
const requiredFiles = [...new Set(roles.flatMap(role => (officialRequirements.agents[role].files_loaded || []).filter(entry => !entry.lazy).map(entry => entry.path)).filter(file => file.startsWith('.aiox-core/')))];

function copy(root, relative) {
  const target = path.join(root, relative);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(path.join(project, relative), target);
}

function fixture() {
  fs.mkdirSync(parent, { recursive: true });
  const root = fs.mkdtempSync(path.join(parent, 'context-'));
  for (const relative of [
    '.aiox-core/package.json', '.aiox-core/development/scripts/agent-config-loader.js', '.aiox-core/core/config/config-cache.js', '.aiox-core/infrastructure/scripts/performance-tracker.js',
    ...roles.map(role => `.aiox-core/development/agents/${role}.md`), ...requiredFiles,
    '.development/aiox-context-core.mjs', '.development/verify-aiox-context.mjs', '.development/state/tooling-source/aiox-squads-core-5.4.1.tgz',
    ...guideNames.map(name => `.development/${name}`)
  ]) copy(root, relative);
  fs.cpSync(path.join(project, '.aiox-core/node_modules/js-yaml'), path.join(root, '.aiox-core/node_modules/js-yaml'), { recursive: true });
  fs.writeFileSync(path.join(root, '.aiox-core/core-config.yaml'), yaml.dump(config));
  fs.writeFileSync(path.join(root, requirements), source.baseline);
  return { root, config: structuredClone(config),
    probe() { return spawnSync(process.execPath, [path.join(root, '.development/verify-aiox-context.mjs')], { cwd: root, encoding: 'utf8', timeout: 30000 }); },
    close() {
      assert.equal(path.dirname(fs.realpathSync(root)), fs.realpathSync(parent));
      assert.equal(fs.lstatSync(root).isSymbolicLink(), false);
      assert.match(path.basename(root), /^context-/);
      fs.rmSync(root, { recursive: true, force: true });
    }
  };
}

function snapshot(root) {
  const files = [];
  function walk(directory) {
    for (const name of fs.readdirSync(directory).sort()) {
      const target = path.join(directory, name), stat = fs.lstatSync(target), relative = path.relative(root, target);
      if (stat.isSymbolicLink()) files.push([relative, 'link', fs.readlinkSync(target)]);
      else if (stat.isDirectory()) { files.push([relative, 'directory']); walk(target); }
      else files.push([relative, sha256(fs.readFileSync(target))]);
    }
  }
  walk(root);
  return files;
}

test('pinned adaptation loads all 12 real role contexts and reapplying preserves exact adapted/provenance bytes', () => {
  const instance = fixture();
  try {
    const first = applyContextAdaptation(instance.root, instance.config);
    assert.equal(first.upstream.requirementsSha256, sha256(source.baseline));
    assert.equal(first.inputSha256, sha256(source.baseline));
    const before = snapshot(instance.root);
    assert.deepEqual(applyContextAdaptation(instance.root, instance.config), first);
    assert.deepEqual(snapshot(instance.root), before);
    const result = instance.probe();
    assert.equal(result.status, 0, result.stderr);
    const loaded = JSON.parse(result.stdout);
    assert.equal(loaded.roles.length, 12);
    assert.equal(loaded.roles.find(role => role.role === 'dev').engineeringGuides.length, 3);
    assert.equal(loaded.roles.find(role => role.role === 'pm').engineeringGuides.length, 2);
    assert.deepEqual(loaded.roles.find(role => role.role === 'aiox-master').skippedLazy, ['.aiox-core/data/aiox-kb.md']);
    assert.deepEqual(snapshot(instance.root), before, 'Fresh loader probes must not write performance or cached proof state');
  } finally { instance.close(); }
});

test('fresh complete-role verification rejects missing/empty engineering and remaining upstream required context', () => {
  const instance = fixture();
  try {
    applyContextAdaptation(instance.root, instance.config);
    assert.equal(instance.probe().status, 0);
    for (const relative of ['.development/coding-standards.md', '.aiox-core/data/technical-preferences.md']) {
      const target = path.join(instance.root, relative), original = fs.readFileSync(target);
      for (const mutation of ['missing', 'empty']) {
        if (mutation === 'missing') fs.unlinkSync(target); else fs.writeFileSync(target, ' \n');
        const result = instance.probe();
        assert.equal(result.status, 1, `${relative}/${mutation}`);
        assert.ok(result.stderr.includes(`${relative.startsWith('.development/') ? 'dev' : 'architect'}: required context unavailable or empty`), result.stderr);
        assert.ok(result.stderr.includes(relative), result.stderr);
        fs.writeFileSync(target, original);
      }
    }
    assert.equal(instance.probe().status, 0);
  } finally { instance.close(); }
});

test('configured alternate confined guides are honored by Dev and the remaining real roles', () => {
  const instance = fixture();
  try {
    applyContextAdaptation(instance.root, instance.config);
    instance.config.frameworkDocsLocation = '.development/alternate';
    instance.config.devLoadAlwaysFiles = ['.development/dev-guides/standards.md', '.development/dev-guides/technology.md', '.development/dev-guides/tree.md'];
    for (let index = 0; index < guideNames.length; index++) {
      for (const relative of [`${instance.config.frameworkDocsLocation}/${guideNames[index]}`, instance.config.devLoadAlwaysFiles[index]]) {
        const target = path.join(instance.root, relative);
        fs.mkdirSync(path.dirname(target), { recursive: true });
        fs.writeFileSync(target, `Alternate exact ${relative}\n`);
      }
    }
    fs.writeFileSync(path.join(instance.root, '.aiox-core/core-config.yaml'), yaml.dump(instance.config));
    const changed = applyContextAdaptation(instance.root, instance.config);
    assert.notEqual(changed.inputSha256, changed.adaptedSha256);
    const result = instance.probe();
    assert.equal(result.status, 0, result.stderr);
    const loaded = JSON.parse(result.stdout);
    assert.deepEqual(loaded.roles.find(role => role.role === 'dev').engineeringGuides, instance.config.devLoadAlwaysFiles);
    assert.deepEqual(loaded.roles.find(role => role.role === 'pm').engineeringGuides, ['.development/alternate/coding-standards.md', '.development/alternate/tech-stack.md']);
    const before = snapshot(instance.root);
    applyContextAdaptation(instance.root, instance.config);
    assert.deepEqual(snapshot(instance.root), before);
  } finally { instance.close(); }
});

test('unknown or dropped requirements and modified loader/profile bytes fail before adaptation writes', () => {
  for (const relative of [requirements, '.aiox-core/development/scripts/agent-config-loader.js', '.aiox-core/development/agents/dev.md']) {
    const instance = fixture();
    try {
      applyContextAdaptation(instance.root, instance.config);
      const target = path.join(instance.root, relative);
      if (relative === requirements) fs.writeFileSync(target, fs.readFileSync(target, 'utf8').replace('      - path: ".development/coding-standards.md"\n        lazy: false\n        size: 25KB\n', ''));
      else fs.appendFileSync(target, '\nUnknown source drift\n');
      const before = snapshot(instance.root);
      assert.throws(() => applyContextAdaptation(instance.root, instance.config), /conflict|differs/);
      assert.deepEqual(snapshot(instance.root), before);
      assert.equal(instance.probe().status, 1);
    } finally { instance.close(); }
  }
});

test('escape/absolute paths and linked guide directories refuse adaptation before any writes', () => {
  const instance = fixture(), external = fixture();
  try {
    for (const relative of ['../outside', 'C:/outside', '/outside', '.development/../outside']) {
      const changed = structuredClone(instance.config);
      changed.frameworkDocsLocation = relative;
      const before = snapshot(instance.root);
      assert.throws(() => applyContextAdaptation(instance.root, changed), /Unsafe|leaves checkout/);
      assert.deepEqual(snapshot(instance.root), before);
    }
    const directory = path.join(instance.root, '.development/linked');
    fs.symlinkSync(path.join(external.root, '.development'), directory, process.platform === 'win32' ? 'junction' : 'dir');
    const changed = structuredClone(instance.config);
    changed.frameworkDocsLocation = '.development/linked';
    const before = snapshot(instance.root), outsideBefore = snapshot(external.root);
    assert.throws(() => applyContextAdaptation(instance.root, changed), /Linked engineering context path/);
    assert.deepEqual(snapshot(instance.root), before);
    assert.deepEqual(snapshot(external.root), outsideBefore);
  } finally { instance.close(); external.close(); }
});

test('an untrusted archive or conflicting stored baseline refuses all adaptation writes', () => {
  for (const relative of ['.development/state/tooling-source/aiox-squads-core-5.4.1.tgz', '.development/state/tooling-source/agent-config-requirements-5.4.1.yaml']) {
    const instance = fixture();
    try {
      applyContextAdaptation(instance.root, instance.config);
      fs.appendFileSync(path.join(instance.root, relative), 'Unknown bytes');
      const before = snapshot(instance.root);
      assert.throws(() => applyContextAdaptation(instance.root, instance.config), /integrity mismatch|baseline conflicts/);
      assert.deepEqual(snapshot(instance.root), before);
    } finally { instance.close(); }
  }
});
