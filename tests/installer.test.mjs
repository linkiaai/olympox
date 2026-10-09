import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import test from 'node:test';
import assert from 'node:assert/strict';
import { installFramework, planFrameworkInstall } from '../scripts/install-framework.mjs';

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
    for (const operation of [planFrameworkInstall, installFramework]) {
      assert.throws(() => operation(source, target), { installationScope: 'source', message: /Links and junctions/ });
    }
    assert.equal(fs.existsSync(target), false);
    fs.unlinkSync(sourceLink);
    fs.mkdirSync(target);
    fs.symlinkSync(external, path.join(target, 'docs'), process.platform === 'win32' ? 'junction' : 'dir');
    const before = snapshot(external);
    for (const operation of [planFrameworkInstall, installFramework]) {
      assert.throws(() => operation(source, target, { merge: true }), { installationScope: 'destination', message: /Links and junctions/ });
    }
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

test('Claude-only installation imports studio instructions and passes doctor without Codex skills', () => {
  const instance = temporary();
  try {
    const target = path.join(instance.root, 'claude');
    const result = installFramework(project, target, { assistant: 'claude' });
    assert.equal(result.assistant, 'claude');
    assert.deepEqual(fs.readFileSync(path.join(target, 'CLAUDE.md')), fs.readFileSync(path.join(project, 'templates/studio-CLAUDE.md')));
    assert.match(fs.readFileSync(path.join(target, 'CLAUDE.md'), 'utf8'), /^@AGENTS\.md$/m);
    for (const skill of ['olympox', 'higgsfield-studio']) {
      assert.deepEqual(fs.readFileSync(path.join(target, '.claude/skills', skill, 'SKILL.md')), fs.readFileSync(path.join(project, 'skills', skill, 'SKILL.md')));
      assert.equal(fs.existsSync(path.join(target, '.claude/skills', skill, 'agents')), false);
    }
    assert.equal(fs.existsSync(path.join(target, '.agents')), false);
    const checked = spawnSync(process.execPath, [path.join(target, 'scripts/studio.mjs'), 'doctor'], { encoding: 'utf8', cwd: target });
    assert.equal(checked.status, 0, checked.stderr);
    assert.match(checked.stdout, /claude\/olympox/);
    const before = snapshot(target);
    assert.deepEqual(installFramework(project, target, { assistant: 'claude', merge: true }).copied, []);
    assert.deepEqual(snapshot(target), before);
    write(target, 'CLAUDE.md', 'Bridge accidentally replaced');
    const broken = spawnSync(process.execPath, [path.join(target, 'scripts/studio.mjs'), 'doctor'], { encoding: 'utf8', cwd: target });
    assert.equal(broken.status, 1);
    assert.match(broken.stderr, /must import/);
  } finally { instance.close(); }
});

test('both hosts retain Git and unrelated Claude state and refuse late host conflicts before writing', () => {
  const instance = temporary();
  try {
    const target = path.join(instance.root, 'both');
    write(target, '.git/config', 'Git metadata to preserve');
    write(target, '.claude/settings.local.json', '{"local":true}');
    write(target, 'influencers/local/persona.json', 'Private original bytes');
    installFramework(project, target, { assistant: 'both', merge: true });
    assert.equal(fs.readFileSync(path.join(target, '.git/config'), 'utf8'), 'Git metadata to preserve');
    assert.equal(fs.readFileSync(path.join(target, '.claude/settings.local.json'), 'utf8'), '{"local":true}');
    assert.equal(fs.readFileSync(path.join(target, 'influencers/local/persona.json'), 'utf8'), 'Private original bytes');
    const checked = spawnSync(process.execPath, [path.join(target, 'scripts/studio.mjs'), 'doctor'], { encoding: 'utf8', cwd: target });
    assert.equal(checked.status, 0, checked.stderr);
    assert.match(checked.stdout, /codex\/olympox.*claude\/olympox/);
    const conflict = path.join(instance.root, 'conflict');
    write(conflict, '.claude/skills/higgsfield-studio/SKILL.md', 'Private customized skill');
    const before = snapshot(conflict);
    assert.throws(() => installFramework(project, conflict, { assistant: 'both', merge: true }), /Destination conflict.*Nothing was written/);
    assert.deepEqual(snapshot(conflict), before);
    assert.equal(fs.existsSync(path.join(conflict, '.agents')), false);
  } finally { instance.close(); }
});

test('host selection rejects invalid inputs and regenerates Claude projections instead of copying private host state', () => {
  const instance = temporary();
  try {
    const source = sourceFixture(instance.root), target = path.join(instance.root, 'target');
    for (const relative of ['CLAUDE.md', '.claude/skills/olympox/SKILL.md', '.claude/settings.json', '.claude/memory/private.md']) write(source, relative, 'PRIVATE-INSTALLER-FIXTURE');
    installFramework(source, target, { assistant: 'both' });
    assert.deepEqual(fs.readFileSync(path.join(target, 'CLAUDE.md')), fs.readFileSync(path.join(source, 'templates/studio-CLAUDE.md')));
    for (const relative of ['.claude/settings.json', '.claude/memory/private.md']) assert.equal(fs.existsSync(path.join(target, relative)), false);
    assert.deepEqual(fs.readFileSync(path.join(target, '.claude/skills/olympox/SKILL.md')), fs.readFileSync(path.join(source, 'skills/olympox/SKILL.md')));
    const absent = path.join(instance.root, 'absent');
    for (const assistant of ['other', '../claude', '', null]) assert.throws(() => installFramework(source, absent, { assistant }), /Choose --assistant/);
    assert.equal(fs.existsSync(absent), false);
    for (const script of ['bin/olympox.mjs', 'scripts/install-framework.mjs']) {
      const prefix = script.startsWith('bin/') ? ['install'] : [];
      const cliTarget = path.join(instance.root, path.basename(script));
      const installed = spawnSync(process.execPath, [path.join(project, script), ...prefix, cliTarget, '--assistant', 'claude'], { encoding: 'utf8' });
      assert.equal(installed.status, 0, installed.stderr);
      assert.equal(fs.existsSync(path.join(cliTarget, '.agents')), false);
      const before = snapshot(cliTarget);
      for (const args of [['--assistant'], ['--assistant', 'bad'], ['--assistant', 'claude', '--assistant', 'both']]) {
        const rejected = spawnSync(process.execPath, [path.join(project, script), ...prefix, cliTarget, ...args], { encoding: 'utf8' });
        assert.equal(rejected.status, 1, rejected.stdout);
        assert.match(rejected.stderr, /Choose (one )?--assistant/);
        assert.deepEqual(snapshot(cliTarget), before);
      }
    }
  } finally { instance.close(); }
});

test('Claude destination junction is rejected before either host projection is installed', () => {
  const instance = temporary();
  try {
    const target = path.join(instance.root, 'target'), external = path.join(instance.root, 'external');
    write(external, 'private.md', 'Outside original bytes');
    fs.mkdirSync(target);
    fs.symlinkSync(external, path.join(target, '.claude'), process.platform === 'win32' ? 'junction' : 'dir');
    const before = snapshot(external);
    assert.throws(() => planFrameworkInstall(project, target, { assistant: 'both', merge: true }), /Links and junctions/);
    assert.throws(() => installFramework(project, target, { assistant: 'both', merge: true }), /Links and junctions/);
    assert.deepEqual(snapshot(external), before);
    assert.deepEqual(fs.readdirSync(target), ['.claude']);
  } finally { instance.close(); }
});

test('installation preview is deterministic, exposes only its review summary, and creates no directories', () => {
  const instance = temporary();
  try {
    const source = sourceFixture(instance.root), target = path.join(instance.root, 'absent-parent/studio');
    const before = snapshot(instance.root);
    const options = { assistant: 'both' };
    const plan = planFrameworkInstall(source, target, options);
    assert.deepEqual(Object.keys(plan).sort(), ['assistant', 'copied', 'fileCount', 'merge', 'planHash', 'retained', 'sourceRoot', 'targetRoot'].sort());
    assert.equal(plan.sourceRoot, source);
    assert.equal(plan.targetRoot, target);
    assert.equal(plan.assistant, 'both');
    assert.equal(plan.merge, false);
    assert.equal(plan.fileCount, plan.copied.length + plan.retained.length);
    assert.ok(plan.copied.includes('CLAUDE.md'));
    assert.ok(plan.copied.includes('.agents/skills/olympox/SKILL.md'));
    assert.ok(plan.copied.includes('.claude/skills/olympox/SKILL.md'));
    assert.match(plan.planHash, /^[a-f0-9]{64}$/);
    assert.deepEqual(planFrameworkInstall(source, target, options), plan);
    assert.deepEqual(snapshot(instance.root), before);
    assert.equal(fs.existsSync(path.dirname(target)), false);
    const installed = installFramework(source, target, { ...options, expectedPlanHash: plan.planHash });
    assert.deepEqual(installed.copied, plan.copied);
    assert.deepEqual(installed.retained, plan.retained);
  } finally { instance.close(); }
});

test('a reviewed merge preserves private unrelated changes without including them in the fingerprint', () => {
  const instance = temporary();
  try {
    const source = sourceFixture(instance.root), target = path.join(instance.root, 'existing');
    installFramework(source, target, { assistant: 'claude' });
    write(target, 'influencers/local/persona.json', 'Private original bytes');
    write(target, 'work/private.md', 'Original private note');
    const beforePreview = snapshot(target);
    const options = { assistant: 'claude', merge: true };
    const plan = planFrameworkInstall(source, target, options);
    assert.deepEqual(plan.copied, []);
    assert.deepEqual(snapshot(target), beforePreview);
    assert.equal(JSON.stringify(plan).includes('work/private.md'), false);
    assert.equal(JSON.stringify(plan).includes('influencers/local/persona.json'), false);
    write(target, 'work/private.md', 'Updated private note');
    write(source, 'work/private.md', 'Excluded source state');
    assert.equal(planFrameworkInstall(source, target, options).planHash, plan.planHash);
    const beforeInstall = snapshot(target);
    installFramework(source, target, { ...options, expectedPlanHash: plan.planHash });
    assert.deepEqual(snapshot(target), beforeInstall);
  } finally { instance.close(); }
});

test('reviewed source bytes and source selection cannot change before installation', () => {
  for (const change of ['bytes', 'new-file']) {
    const instance = temporary();
    try {
      const source = sourceFixture(instance.root), target = path.join(instance.root, 'absent-parent/studio');
      const options = { assistant: 'claude' };
      const plan = planFrameworkInstall(source, target, options);
      if (change === 'bytes') fs.appendFileSync(path.join(source, 'README.md'), '\nChanged after review.\n');
      else write(source, 'docs/onboarding-fingerprint-fixture.md', 'Reusable new source fixture');
      const before = snapshot(instance.root);
      assert.notEqual(planFrameworkInstall(source, target, options).planHash, plan.planHash);
      assert.throws(() => installFramework(source, target, { ...options, expectedPlanHash: plan.planHash }), /Installation plan changed.*Nothing was written/);
      assert.deepEqual(snapshot(instance.root), before);
      assert.equal(fs.existsSync(path.dirname(target)), false);
    } finally { instance.close(); }
  }
});

test('reviewed destination copy and retain dispositions must still match before installation', () => {
  const instance = temporary();
  try {
    const source = sourceFixture(instance.root), target = path.join(instance.root, 'existing');
    const options = { assistant: 'both', merge: true };
    const plan = planFrameworkInstall(source, target, options);
    write(target, 'README.md', fs.readFileSync(path.join(source, 'README.md')));
    const before = snapshot(target);
    const refreshed = planFrameworkInstall(source, target, options);
    assert.notEqual(refreshed.planHash, plan.planHash);
    assert.ok(refreshed.retained.includes('README.md'));
    assert.throws(() => installFramework(source, target, { ...options, expectedPlanHash: plan.planHash }), /Installation plan changed.*Nothing was written/);
    assert.deepEqual(snapshot(target), before);
    write(target, 'README.md', 'Local conflicting customization after review');
    const beforeConflict = snapshot(target);
    assert.throws(() => installFramework(source, target, { ...options, expectedPlanHash: refreshed.planHash }), /Destination conflict.*Nothing was written/);
    assert.deepEqual(snapshot(target), beforeConflict);
  } finally { instance.close(); }
});

test('reviewed source root, destination root, assistant and merge options bind the exact plan', () => {
  const instance = temporary();
  try {
    const source = sourceFixture(instance.root), target = path.join(instance.root, 'target');
    const otherSource = path.join(instance.root, 'other-source');
    fs.cpSync(source, otherSource, { recursive: true });
    const plan = planFrameworkInstall(source, target, { assistant: 'claude' });
    const cases = [
      [otherSource, target, { assistant: 'claude' }],
      [source, path.join(instance.root, 'other-target'), { assistant: 'claude' }],
      [source, target, { assistant: 'both' }],
      [source, target, { assistant: 'claude', merge: true }]
    ];
    const before = snapshot(instance.root);
    for (const [selectedSource, selectedTarget, options] of cases) {
      assert.throws(() => installFramework(selectedSource, selectedTarget, { ...options, expectedPlanHash: plan.planHash }), /Installation plan changed.*Nothing was written/);
      assert.equal(fs.existsSync(selectedTarget), false);
    }
    for (const expectedPlanHash of ['', 'not-a-hash', 'A'.repeat(64), null, 42]) {
      assert.throws(() => installFramework(source, target, { expectedPlanHash }), /expectedPlanHash must be/);
    }
    assert.deepEqual(snapshot(instance.root), before);
  } finally { instance.close(); }
});

test('preview preserves full conflict and unsafe-path preflight without creating a partial studio', () => {
  const instance = temporary();
  try {
    const target = path.join(instance.root, 'conflict');
    write(target, '.claude/skills/higgsfield-studio/SKILL.md', 'Preserved late-host conflict');
    const before = snapshot(target);
    assert.throws(() => planFrameworkInstall(project, target, { assistant: 'both', merge: true }), /Destination conflict.*Nothing was written/);
    assert.deepEqual(snapshot(target), before);
    assert.equal(fs.existsSync(path.join(target, '.agents')), false);
    assert.throws(() => planFrameworkInstall(project, path.join(project, 'scripts/unsafe-studio')), /inside a framework source directory/);
    assert.equal(fs.existsSync(path.join(project, 'scripts/unsafe-studio')), false);
  } finally { instance.close(); }
});

test('broken package preflight identifies the source before asking for another destination', () => {
  const instance = temporary();
  try {
    const source = sourceFixture(instance.root), target = path.join(instance.root, 'nonempty');
    write(target, 'local.md', 'Preserved destination contents');
    const before = snapshot(target);
    for (const operation of [planFrameworkInstall, installFramework]) {
      assert.throws(() => operation(path.join(instance.root, 'missing-source'), target), {
        installationScope: 'source', message: 'Framework source directory does not exist.'
      });
    }
    fs.unlinkSync(path.join(source, 'README.md'));
    for (const operation of [planFrameworkInstall, installFramework]) {
      assert.throws(() => operation(source, target), {
        installationScope: 'source', message: 'Framework source is missing: README.md'
      });
    }
    assert.deepEqual(snapshot(target), before);
  } finally { instance.close(); }
});

test('recoverable destination preflight identifies conflicts and invalid directory paths', () => {
  const instance = temporary();
  try {
    const target = path.join(instance.root, 'nonempty');
    write(target, 'README.md', 'Preserved local customization');
    const before = snapshot(target);
    for (const operation of [planFrameworkInstall, installFramework]) {
      assert.throws(() => operation(project, target), { installationScope: 'destination', message: /Destination is not empty/ });
      assert.throws(() => operation(project, target, { merge: true }), { installationScope: 'destination', message: /Destination conflict: README\.md.*Nothing was written/ });
      assert.throws(() => operation(project, path.join(target, 'README.md/studio')), { installationScope: 'destination', message: /Expected a directory/ });
    }
    assert.deepEqual(snapshot(target), before);
  } finally { instance.close(); }
});

test('source read failures retain the original error and filesystem code', (context) => {
  const instance = temporary();
  try {
    const source = sourceFixture(instance.root), target = path.join(instance.root, 'target');
    const inaccessible = path.join(source, 'README.md');
    const failure = Object.assign(new Error('Fixture source access denied'), { code: 'EACCES', path: inaccessible });
    const originalRead = fs.readFileSync;
    context.mock.method(fs, 'readFileSync', function (file, ...options) {
      if (file === inaccessible) throw failure;
      return originalRead.call(this, file, ...options);
    });
    for (const operation of [planFrameworkInstall, installFramework]) {
      assert.throws(() => operation(source, target), error => {
        assert.equal(error, failure);
        assert.equal(error.installationScope, 'source');
        assert.equal(error.code, 'EACCES');
        assert.equal(error.message, 'Fixture source access denied');
        assert.equal(error.path, inaccessible);
        return true;
      });
    }
    assert.equal(fs.existsSync(target), false);
  } finally { context.mock.restoreAll(); instance.close(); }
});
