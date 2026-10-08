import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import test from 'node:test';
import assert from 'node:assert/strict';
import { installFramework } from '../scripts/install-framework.mjs';

const project = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const parent = path.join(project, 'tmp', 'installer-tests');

function temporary() {
  fs.mkdirSync(parent, { recursive: true });
  const root = fs.mkdtempSync(path.join(parent, 'install-'));
  return { root, close() {
    assert.equal(path.dirname(path.resolve(root)), parent);
    assert.match(path.basename(root), /^install-/);
    fs.rmSync(root, { recursive: true, force: true });
  } };
}

function write(root, relative, bytes = `Fixture: ${relative}`) {
  const file = path.join(root, relative);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, bytes);
}

function sourceFixture(root) {
  const source = path.join(root, 'source');
  fs.mkdirSync(source);
  for (const name of ['AGENTS.md', 'CONSTITUTION.md', 'README.md', 'package.json', 'LICENSE', '.gitignore']) fs.copyFileSync(path.join(project, name), path.join(source, name));
  for (const name of ['bin', 'framework', 'scripts', 'skills', 'docs', 'templates', 'tests', 'vendor']) fs.cpSync(path.join(project, name), path.join(source, name), { recursive: true });
  for (const name of ['README.md', 'config.json']) { fs.mkdirSync(path.join(source, 'docs-site'), { recursive: true }); fs.copyFileSync(path.join(project, 'docs-site', name), path.join(source, 'docs-site', name)); }
  for (const name of ['locales', 'src']) fs.cpSync(path.join(project, 'docs-site', name), path.join(source, 'docs-site', name), { recursive: true });
  fs.mkdirSync(path.join(source, 'influencers'));
  fs.copyFileSync(path.join(project, 'influencers/README.md'), path.join(source, 'influencers/README.md'));
  return source;
}

function snapshot(root) {
  const result = [];
  function walk(directory, relative = '') {
    for (const name of fs.readdirSync(directory).sort()) {
      const file = path.join(directory, name), key = relative ? `${relative}/${name}` : name;
      const stat = fs.lstatSync(file);
      result.push([key, stat.isDirectory() ? 'directory' : fs.readFileSync(file).toString('base64')]);
      if (stat.isDirectory()) walk(file, key);
    }
  }
  if (fs.existsSync(root)) walk(root);
  return result;
}

test('fresh installation contains reusable sources, generated skills and a working empty studio', () => {
  const instance = temporary();
  try {
    const target = path.join(instance.root, 'fresh');
    const result = installFramework(project, target);
    assert.equal(result.targetRoot, target);
    assert.ok(result.copied.includes('scripts/install-framework.mjs'));
    assert.equal(result.retained.length, 0);
    assert.deepEqual(fs.readFileSync(path.join(target, 'AGENTS.md')), fs.readFileSync(path.join(project, 'templates/studio-AGENTS.md')));
    assert.deepEqual(fs.readFileSync(path.join(target, 'docs/locales/pt-BR/AGENTS.md')), fs.readFileSync(path.join(project, 'templates/locales/pt-BR/studio-AGENTS.md')));
    for (const name of ['olympox', 'higgsfield-studio']) {
      for (const file of ['SKILL.md', 'agents/openai.yaml']) assert.deepEqual(fs.readFileSync(path.join(target, '.agents/skills', name, file)), fs.readFileSync(path.join(project, 'skills', name, file)));
    }
    assert.deepEqual(fs.readdirSync(path.join(target, 'influencers')), ['README.md']);
    for (const name of ['olympox-logo.png', 'olympox-icon.png']) {
      const relative = `docs-site/src/${name}`;
      assert.ok(result.copied.includes(relative));
      assert.deepEqual(fs.readFileSync(path.join(target, relative)), fs.readFileSync(path.join(project, relative)));
    }
    for (const name of ['work', 'tmp', 'tools', '.git', 'node_modules', 'docs-site/dist']) assert.equal(fs.existsSync(path.join(target, name)), false, name);
    for (const command of ['list', 'doctor']) {
      const execution = spawnSync(process.execPath, [path.join(target, 'scripts/studio.mjs'), command], { cwd: target, encoding: 'utf8' });
      assert.equal(execution.status, 0, execution.stderr);
      if (command === 'list') assert.match(execution.stdout, /No characters created/);
    }
    for (const command of ['build', 'check']) {
      const execution = spawnSync(process.execPath, [path.join(target, 'scripts/docs.mjs'), command], { cwd: target, encoding: 'utf8' });
      assert.equal(execution.status, 0, execution.stderr);
    }
    for (const name of ['olympox-logo.png', 'olympox-icon.png']) assert.deepEqual(fs.readFileSync(path.join(target, 'docs-site/dist', name)), fs.readFileSync(path.join(project, 'docs-site/src', name)));
  } finally { instance.close(); }
});

test('installation excludes private state and regenerates active skills from canonical sources', () => {
  const instance = temporary();
  try {
    const source = sourceFixture(instance.root), target = path.join(instance.root, 'target');
    const excluded = ['work/runs/private.json', 'tmp/private.md', 'tools/provider/private.json', 'backups/private.json', '.git/config', '.env', 'node_modules/private.json', 'docs-site/dist/private.js', 'docs-site/src/private.png', 'docs-site/src/other/olympox-icon.png', 'influencers/private/README.md', 'influencers/private/persona.json', 'influencers/private/references/person.png', 'docs/work/private.md', 'scripts/node_modules/private.js'];
    for (const relative of excluded) write(source, relative, 'PRIVATE-INSTALLER-FIXTURE');
    write(source, 'AGENTS.md', 'PRIVATE-INSTALLER-FIXTURE');
    write(source, 'docs/locales/pt-BR/AGENTS.md', 'PRIVATE-INSTALLER-FIXTURE');
    write(source, '.agents/skills/olympox/SKILL.md', 'PRIVATE-INSTALLER-FIXTURE');
    write(source, 'docs/portrait.png', 'PRIVATE-INSTALLER-FIXTURE');
    installFramework(source, target);
    assert.deepEqual(fs.readFileSync(path.join(target, 'AGENTS.md')), fs.readFileSync(path.join(source, 'templates/studio-AGENTS.md')));
    assert.notDeepEqual(fs.readFileSync(path.join(target, 'AGENTS.md')), fs.readFileSync(path.join(source, 'AGENTS.md')));
    assert.deepEqual(fs.readFileSync(path.join(target, 'docs/locales/pt-BR/AGENTS.md')), fs.readFileSync(path.join(source, 'templates/locales/pt-BR/studio-AGENTS.md')));
    assert.notDeepEqual(fs.readFileSync(path.join(target, 'docs/locales/pt-BR/AGENTS.md')), fs.readFileSync(path.join(source, 'docs/locales/pt-BR/AGENTS.md')));
    for (const relative of [...excluded, 'docs/portrait.png']) assert.equal(fs.existsSync(path.join(target, relative)), false, relative);
    for (const name of ['olympox-logo.png', 'olympox-icon.png']) assert.deepEqual(fs.readFileSync(path.join(target, 'docs-site/src', name)), fs.readFileSync(path.join(source, 'docs-site/src', name)));
    assert.deepEqual(fs.readFileSync(path.join(target, '.agents/skills/olympox/SKILL.md')), fs.readFileSync(path.join(source, 'skills/olympox/SKILL.md')));
    assert.equal(snapshot(target).some(([, bytes]) => bytes.includes(Buffer.from('PRIVATE-INSTALLER-FIXTURE').toString('base64'))), false);
  } finally { instance.close(); }
});

test('a conflicting merge fails before writing any file or directory', () => {
  const instance = temporary();
  try {
    const target = path.join(instance.root, 'existing');
    write(target, 'templates/persona.json', 'Preserved local customization');
    write(target, 'notes/local.md', 'Preserved local note');
    const before = snapshot(target);
    assert.throws(() => installFramework(project, target, { merge: true }), /Destination conflict.*Nothing was written/);
    assert.deepEqual(snapshot(target), before);
    assert.throws(() => installFramework(project, target), /Destination is not empty/);
    assert.deepEqual(snapshot(target), before);
  } finally { instance.close(); }
});

test('identical merge is idempotent and preserves local characters and unrelated files', () => {
  const instance = temporary();
  try {
    const target = path.join(instance.root, 'existing');
    installFramework(project, target);
    write(target, 'influencers/local/persona.json', 'Preserved local character');
    write(target, 'work/notes.md', 'Preserved local state');
    const before = snapshot(target);
    const result = installFramework(project, target, { merge: true });
    assert.deepEqual(result.copied, []);
    assert.ok(result.retained.length > 0);
    assert.deepEqual(snapshot(target), before);
  } finally { instance.close(); }
});

test('installation permits an existing Git directory and uses the packed gitignore fallback', () => {
  const instance = temporary();
  try {
    const source = sourceFixture(instance.root), target = path.join(instance.root, 'existing');
    const expected = fs.readFileSync(path.join(source, '.gitignore'));
    write(source, 'templates/project.gitignore', expected);
    fs.unlinkSync(path.join(source, '.gitignore'));
    write(target, '.git/config', 'Existing Git metadata');
    installFramework(source, target);
    assert.deepEqual(fs.readFileSync(path.join(target, '.gitignore')), expected);
    assert.equal(fs.readFileSync(path.join(target, '.git/config'), 'utf8'), 'Existing Git metadata');
  } finally { instance.close(); }
});

test('source links and destination junctions are rejected without writing outside the studio', () => {
  const instance = temporary();
  try {
    const source = sourceFixture(instance.root), target = path.join(instance.root, 'target'), external = path.join(instance.root, 'external');
    fs.mkdirSync(external);
    write(external, 'private.md', 'Outside content');
    const sourceLink = path.join(source, 'docs/redirect');
    fs.symlinkSync(external, sourceLink, process.platform === 'win32' ? 'junction' : 'dir');
    assert.throws(() => installFramework(source, target), /Links and junctions/);
    assert.equal(fs.existsSync(target), false);
    fs.unlinkSync(sourceLink);
    fs.mkdirSync(target);
    fs.symlinkSync(external, path.join(target, 'docs'), process.platform === 'win32' ? 'junction' : 'dir');
    const before = snapshot(external);
    assert.throws(() => installFramework(source, target, { merge: true }), /Links and junctions/);
    assert.deepEqual(snapshot(external), before);
    assert.deepEqual(fs.readdirSync(target), ['docs']);
  } finally { instance.close(); }
});

test('installer CLI supports help, explicit destinations and rejects invalid arguments', () => {
  const instance = temporary();
  try {
    const script = path.join(project, 'scripts/install-framework.mjs');
    const help = spawnSync(process.execPath, [script, '--help'], { encoding: 'utf8' });
    assert.equal(help.status, 0, help.stderr); assert.match(help.stdout, /\[directory\] \[--merge\]/);
    const target = path.join(instance.root, 'cli');
    const installed = spawnSync(process.execPath, [script, target], { encoding: 'utf8' });
    assert.equal(installed.status, 0, installed.stderr); assert.match(installed.stdout, /OLYMPOX installed/);
    const before = snapshot(target);
    const invalid = spawnSync(process.execPath, [script, target, '--unknown'], { encoding: 'utf8' });
    assert.equal(invalid.status, 1); assert.match(invalid.stderr, /Use node scripts/);
    assert.deepEqual(snapshot(target), before);
  } finally { instance.close(); }
});
