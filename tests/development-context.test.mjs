import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import test from 'node:test';
import assert from 'node:assert/strict';
import { installFramework } from '../scripts/install-framework.mjs';
import { installSkill } from '../scripts/skill-install-core.mjs';

const source = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const parent = path.join(source, 'tmp', 'development-context-tests');

function fixture() {
  fs.mkdirSync(parent, { recursive: true });
  const directory = fs.mkdtempSync(path.join(parent, 'context-'));
  const root = path.join(directory, 'project');
  installFramework(source, root);
  return {
    root,
    cli(...args) { return spawnSync(process.execPath, [path.join(root, 'scripts/studio.mjs'), ...args], { cwd: root, encoding: 'utf8' }); },
    close() {
      assert.equal(path.dirname(directory), parent);
      assert.match(path.basename(directory), /^context-/);
      fs.rmSync(directory, { recursive: true, force: true });
    }
  };
}

function removeProjection(root) {
  const directory = path.resolve(root, '.agents');
  assert.equal(path.dirname(directory), root);
  fs.rmSync(directory, { recursive: true });
}

function markDevelopment(root, context = { schemaVersion: 1, kind: 'framework-development' }) {
  fs.mkdirSync(path.join(root, '.development'));
  fs.writeFileSync(path.join(root, '.development/project.json'), JSON.stringify(context));
}

test('framework development doctor verifies canonical sources without active creative skills', () => {
  const instance = fixture();
  try {
    markDevelopment(instance.root);
    removeProjection(instance.root);
    const checked = instance.cli('doctor');
    assert.equal(checked.status, 0, checked.stderr);
    assert.match(checked.stdout, /OK framework development: canonical skills/);
    assert.doesNotMatch(checked.stdout, /Higgsfield|Media providers:|New influencers:|skills match:/);
    assert.equal(fs.existsSync(path.join(instance.root, '.agents')), false);
    fs.unlinkSync(path.join(instance.root, 'skills/olympox/SKILL.md'));
    const missing = instance.cli('doctor');
    assert.equal(missing.status, 1);
    assert.match(missing.stderr, /Missing files: skills\/olympox\/SKILL.md/);
  } finally { instance.close(); }
});

test('development creative commands refuse writes while inspection remains available', () => {
  const instance = fixture();
  try {
    markDevelopment(instance.root);
    for (const command of ['new', 'prompt', 'register', 'canon-snapshot', 'execution-seal', 'migrate-assets', 'narrative-save', 'content-save', 'run-start', 'run-step', 'run-resume', 'backup', 'restore']) {
      const denied = instance.cli(command, 'synthetic-persona', 'missing-input.json');
      assert.equal(denied.status, 1, command);
      assert.match(denied.stderr, /framework development checkout.*independent OLYMPOX studio/);
    }
    assert.deepEqual(fs.readdirSync(path.join(instance.root, 'influencers')), ['README.md']);
    for (const name of ['work', 'backups']) assert.equal(fs.existsSync(path.join(instance.root, name)), false);
    for (const command of ['help', 'list', 'validate']) {
      const inspected = instance.cli(command);
      assert.equal(inspected.status, 0, inspected.stderr);
    }
  } finally { instance.close(); }
});

test('installed studios still require matching active skills and permit local creation', () => {
  const instance = fixture();
  try {
    fs.mkdirSync(path.join(instance.root, '.development'));
    fs.writeFileSync(path.join(instance.root, '.development/unrelated.md'), 'Local studio note, without a development marker.');
    assert.equal(fs.existsSync(path.join(instance.root, '.development/project.json')), false);
    removeProjection(instance.root);
    const absent = instance.cli('doctor');
    assert.equal(absent.status, 1);
    assert.match(absent.stderr, /No active olympox skill/);
    installSkill(instance.root);
    assert.equal(instance.cli('doctor').status, 0);
    fs.appendFileSync(path.join(instance.root, '.agents/skills/olympox/SKILL.md'), '\nLocal mismatch.\n');
    const corrupted = instance.cli('doctor');
    assert.equal(corrupted.status, 1);
    assert.match(corrupted.stderr, /Skill differs: codex\/olympox\/SKILL.md/);
    const created = instance.cli('new', 'synthetic-persona');
    assert.equal(created.status, 0, created.stderr);
    assert.equal(fs.existsSync(path.join(instance.root, 'influencers/synthetic-persona/persona.json')), true);
  } finally { instance.close(); }
});

test('an invalid development marker fails before creative writes', () => {
  const instance = fixture();
  try {
    markDevelopment(instance.root, { schemaVersion: 2, kind: 'framework-development' });
    const denied = instance.cli('new', 'synthetic-persona');
    assert.equal(denied.status, 1);
    assert.match(denied.stderr, /Invalid framework development marker/);
    assert.equal(instance.cli('help').status, 0);
    const inspected = instance.cli('doctor');
    assert.equal(inspected.status, 1);
    assert.match(inspected.stderr, /Invalid framework development marker/);
    assert.deepEqual(fs.readdirSync(path.join(instance.root, 'influencers')), ['README.md']);
  } finally { instance.close(); }
});

test('a UTF-8 BOM development marker preserves read-only inspection and refuses public activation', () => {
  const instance = fixture();
  try {
    markDevelopment(instance.root);
    const marker = path.join(instance.root, '.development/project.json');
    fs.writeFileSync(marker, '\uFEFF' + fs.readFileSync(marker, 'utf8'));
    removeProjection(instance.root);
    assert.equal(instance.cli('doctor').status, 0);
    const result = spawnSync(process.execPath, [path.join(instance.root, 'scripts/install-skill.mjs'), '--assistant', 'both'], { encoding: 'utf8' });
    assert.equal(result.status, 1);
    assert.match(result.stderr, /framework development checkout.*independent OLYMPOX studio/);
    assert.equal(fs.existsSync(path.join(instance.root, '.agents')), false);
    assert.equal(fs.existsSync(path.join(instance.root, '.claude')), false);
  } finally { instance.close(); }
});
