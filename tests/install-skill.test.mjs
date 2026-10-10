import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import test from 'node:test';
import assert from 'node:assert/strict';
import { installSkill } from '../scripts/skill-install-core.mjs';

const project = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const parent = path.join(project, 'tmp', 'install-skill-tests');
const skillFiles = ['SKILL.md', 'agents/openai.yaml'];

function fixture({ sources = true, cli = false } = {}) {
  fs.mkdirSync(parent, { recursive: true });
  const root = fs.mkdtempSync(path.join(parent, 'skill-'));
  if (sources) for (const name of ['olympox', 'higgsfield-studio']) {
    for (const relative of skillFiles) write(root, `skills/${name}/${relative}`, `${name}: ${relative}\n`);
  }
  if (cli) for (const name of ['install-skill.mjs', 'skill-install-core.mjs', 'assistant-targets.mjs', 'development-context.mjs']) {
    write(root, `scripts/${name}`, fs.readFileSync(path.join(project, 'scripts', name)));
  }
  return { root, close() {
    assert.equal(fs.lstatSync(root).isSymbolicLink(), false);
    assert.equal(path.dirname(fs.realpathSync(root)), fs.realpathSync(parent));
    assert.match(path.basename(root), /^skill-/);
    fs.rmSync(root, { recursive: true, force: true });
  } };
}

function write(root, relative, bytes) {
  const target = path.join(root, relative);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, bytes);
}

function snapshot(root) {
  const entries = [];
  function walk(directory, relative = '') {
    for (const name of fs.readdirSync(directory).sort()) {
      const file = path.join(directory, name), key = relative ? `${relative}/${name}` : name;
      const stat = fs.lstatSync(file);
      if (stat.isSymbolicLink()) entries.push([key, 'link', fs.readlinkSync(file)]);
      else if (stat.isDirectory()) { entries.push([key, 'directory']); walk(file, key); }
      else entries.push([key, fs.readFileSync(file).toString('base64')]);
    }
  }
  walk(root);
  return entries;
}

function junction(target, file) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.symlinkSync(target, file, process.platform === 'win32' ? 'junction' : 'dir');
}

test('skill installation copies only the exact selected sources and retains identical files', () => {
  const instance = fixture();
  try {
    const { root } = instance;
    write(root, 'skills/olympox/private-note.md', 'Not part of the skill installation');
    write(root, '.git/config', 'Existing Git metadata');
    write(root, '.agents/skills/olympox/local-note.md', 'Preserved local note');
    const installed = installSkill(root);
    assert.deepEqual(installed.copied, skillFiles);
    assert.deepEqual(installed.retained, []);
    for (const relative of skillFiles) assert.deepEqual(fs.readFileSync(path.join(root, '.agents/skills/olympox', relative)), fs.readFileSync(path.join(root, 'skills/olympox', relative)));
    assert.equal(fs.existsSync(path.join(root, '.agents/skills/olympox/private-note.md')), false);
    const before = snapshot(root);
    const repeated = installSkill(root);
    assert.deepEqual(repeated.copied, []);
    assert.deepEqual(repeated.retained, skillFiles);
    assert.deepEqual(snapshot(root), before);
    fs.unlinkSync(path.join(root, '.agents/skills/olympox/agents/openai.yaml'));
    const partial = installSkill(root);
    assert.deepEqual(partial.copied, ['agents/openai.yaml']);
    assert.deepEqual(partial.retained, ['SKILL.md']);
    assert.deepEqual(snapshot(root), before);
  } finally { instance.close(); }
});

test('a conflict in the second destination is rejected before writing the first file', () => {
  const instance = fixture();
  try {
    write(instance.root, '.agents/skills/olympox/agents/openai.yaml', 'Preserved local customization');
    const before = snapshot(instance.root);
    assert.throws(() => installSkill(instance.root), /Installed skill differs at agents\/openai.yaml/);
    assert.deepEqual(snapshot(instance.root), before);
  } finally { instance.close(); }
});

test('a missing second source is rejected before creating any destination', () => {
  const instance = fixture();
  try {
    fs.unlinkSync(path.join(instance.root, 'skills/olympox/agents/openai.yaml'));
    const before = snapshot(instance.root);
    assert.throws(() => installSkill(instance.root), /Skill source is missing.*agents\/openai.yaml/);
    assert.deepEqual(snapshot(instance.root), before);
    assert.equal(fs.existsSync(path.join(instance.root, '.agents')), false);
  } finally { instance.close(); }
});

test('source directories and blocked parents are rejected before destination changes', () => {
  for (const invalid of ['skills/olympox/agents', 'skills/olympox/agents/openai.yaml']) {
    const instance = fixture({ sources: false });
    try {
      write(instance.root, 'skills/olympox/SKILL.md', 'Valid first source');
      if (invalid.endsWith('.yaml')) fs.mkdirSync(path.join(instance.root, invalid), { recursive: true });
      else write(instance.root, invalid, 'Blocked source parent');
      const before = snapshot(instance.root);
      assert.throws(() => installSkill(instance.root), /Expected a (directory|file)/);
      assert.deepEqual(snapshot(instance.root), before);
    } finally { instance.close(); }
  }
});

test('all destination parents and leaf types pass preflight before any copy', () => {
  for (const invalid of ['.agents', '.agents/skills/olympox/agents', '.agents/skills/olympox/agents/openai.yaml']) {
    const instance = fixture();
    try {
      if (invalid.endsWith('.yaml')) fs.mkdirSync(path.join(instance.root, invalid), { recursive: true });
      else write(instance.root, invalid, 'Blocked destination parent');
      const before = snapshot(instance.root);
      assert.throws(() => installSkill(instance.root), /Expected a (directory|file)/);
      assert.deepEqual(snapshot(instance.root), before);
    } finally { instance.close(); }
  }
});

test('source junctions cannot import files from another directory', () => {
  const instance = fixture({ sources: false });
  const external = fixture({ sources: false });
  try {
    for (const relative of skillFiles) write(external.root, relative, 'External source');
    junction(external.root, path.join(instance.root, 'skills/olympox'));
    const before = snapshot(instance.root);
    const outsideBefore = snapshot(external.root);
    assert.throws(() => installSkill(instance.root), /Links and junctions/);
    assert.deepEqual(snapshot(instance.root), before);
    assert.deepEqual(snapshot(external.root), outsideBefore);
  } finally { instance.close(); external.close(); }
});

test('destination junctions cannot redirect installation or permit a partial first copy', () => {
  const instance = fixture();
  const external = fixture({ sources: false });
  try {
    write(external.root, 'local-note.md', 'Preserved outside directory');
    junction(external.root, path.join(instance.root, '.agents/skills/olympox/agents'));
    const before = snapshot(instance.root);
    const outsideBefore = snapshot(external.root);
    assert.throws(() => installSkill(instance.root), /Links and junctions/);
    assert.deepEqual(snapshot(instance.root), before);
    assert.deepEqual(snapshot(external.root), outsideBefore);
    assert.equal(fs.existsSync(path.join(instance.root, '.agents/skills/olympox/SKILL.md')), false);
    assert.equal(fs.existsSync(path.join(external.root, 'openai.yaml')), false);
  } finally { instance.close(); external.close(); }
});

test('a junction at any skill destination ancestor cannot redirect either installed file', () => {
  for (const relative of ['.agents', '.agents/skills', '.agents/skills/olympox']) {
    const instance = fixture();
    const external = fixture({ sources: false });
    try {
      write(external.root, 'local-note.md', 'Preserved outside directory');
      junction(external.root, path.join(instance.root, relative));
      const before = snapshot(instance.root);
      const outsideBefore = snapshot(external.root);
      assert.throws(() => installSkill(instance.root), /Links and junctions/);
      assert.deepEqual(snapshot(instance.root), before);
      assert.deepEqual(snapshot(external.root), outsideBefore);
    } finally { instance.close(); external.close(); }
  }
});

test('leaf links are rejected for both sources and destinations', () => {
  for (const source of [true, false]) {
    const instance = fixture({ sources: !source });
    try {
      const prefix = source ? 'skills' : '.agents/skills';
      if (source) write(instance.root, 'skills/olympox/SKILL.md', 'Valid first source');
      write(instance.root, 'external/local-note.md', 'Preserved linked directory');
      junction(path.join(instance.root, 'external'), path.join(instance.root, `${prefix}/olympox/agents/openai.yaml`));
      const before = snapshot(instance.root);
      assert.throws(() => installSkill(instance.root), /Links and junctions/);
      assert.deepEqual(snapshot(instance.root), before);
    } finally { instance.close(); }
  }
});

test('a junction in the studio root path is rejected before reads or writes', () => {
  const instance = fixture();
  try {
    junction(instance.root, path.join(instance.root, 'studio-alias'));
    const before = snapshot(instance.root);
    assert.throws(() => installSkill(path.join(instance.root, 'studio-alias')), /Links and junctions/);
    assert.deepEqual(snapshot(instance.root), before);
  } finally { instance.close(); }
});

test('skill API rejects arbitrary names and invalid roots without creating files', () => {
  const instance = fixture();
  try {
    const before = snapshot(instance.root);
    for (const name of ['../escape', 'other', '', null]) assert.throws(() => installSkill(instance.root, name), /Choose olympox or higgsfield-studio/);
    for (const root of ['', null]) assert.throws(() => installSkill(root), /Provide the studio directory/);
    assert.throws(() => installSkill(path.join(instance.root, 'missing')), /Studio directory does not exist/);
    assert.deepEqual(snapshot(instance.root), before);
  } finally { instance.close(); }
});

test('skill CLI keeps its default and registered names and reports invalid arguments', () => {
  const instance = fixture({ cli: true });
  try {
    const script = path.join(instance.root, 'scripts/install-skill.mjs');
    for (const args of [[], ['higgsfield-studio']]) {
      const result = spawnSync(process.execPath, [script, ...args], { encoding: 'utf8', cwd: instance.root });
      assert.equal(result.status, 0, result.stderr);
      assert.match(result.stdout, /Local skill installed:/);
    }
    const before = snapshot(instance.root);
    for (const args of [['../escape'], ['olympox', 'extra']]) {
      const result = spawnSync(process.execPath, [script, ...args], { encoding: 'utf8', cwd: instance.root });
      assert.equal(result.status, 1);
      assert.match(result.stderr, /Choose olympox or higgsfield-studio/);
      assert.deepEqual(snapshot(instance.root), before);
    }
  } finally { instance.close(); }
});

test('skill CLI reports a missing source without partially installing the skill', () => {
  const instance = fixture({ cli: true });
  try {
    fs.unlinkSync(path.join(instance.root, 'skills/olympox/agents/openai.yaml'));
    const before = snapshot(instance.root);
    const result = spawnSync(process.execPath, [path.join(instance.root, 'scripts/install-skill.mjs')], { encoding: 'utf8', cwd: instance.root });
    assert.equal(result.status, 1);
    assert.match(result.stderr, /Skill source is missing/);
    assert.deepEqual(snapshot(instance.root), before);
  } finally { instance.close(); }
});

test('Claude Code skills use canonical SKILL.md only and retain local files', () => {
  const instance = fixture({ cli: true });
  try {
    write(instance.root, '.claude/settings.local.json', '{"local":true}');
    fs.unlinkSync(path.join(instance.root, 'skills/olympox/agents/openai.yaml'));
    const result = installSkill(instance.root, 'olympox', { assistant: 'claude' });
    assert.deepEqual(result.copied, ['SKILL.md']);
    assert.equal(result.targetRoot, path.join(instance.root, '.claude/skills/olympox'));
    assert.deepEqual(fs.readFileSync(path.join(result.targetRoot, 'SKILL.md')), fs.readFileSync(path.join(instance.root, 'skills/olympox/SKILL.md')));
    assert.equal(fs.existsSync(path.join(result.targetRoot, 'agents')), false);
    assert.equal(fs.existsSync(path.join(instance.root, '.agents')), false);
    const before = snapshot(instance.root);
    const execution = spawnSync(process.execPath, [path.join(instance.root, 'scripts/install-skill.mjs'), '--assistant', 'claude'], { encoding: 'utf8' });
    assert.equal(execution.status, 0, execution.stderr);
    assert.deepEqual(snapshot(instance.root), before);
  } finally { instance.close(); }
});

test('both skill projections preflight a Claude conflict before copying Codex files', () => {
  const instance = fixture();
  try {
    write(instance.root, '.claude/skills/olympox/SKILL.md', 'Local customized Claude skill');
    const before = snapshot(instance.root);
    assert.throws(() => installSkill(instance.root, 'olympox', { assistant: 'both' }), /Installed skill differs/);
    assert.deepEqual(snapshot(instance.root), before);
    assert.equal(fs.existsSync(path.join(instance.root, '.agents')), false);
  } finally { instance.close(); }
});

test('Claude skill destination junctions cannot redirect either host projection', () => {
  const instance = fixture(), external = fixture({ sources: false });
  try {
    write(external.root, 'local-note.md', 'Outside content');
    junction(external.root, path.join(instance.root, '.claude'));
    const before = snapshot(instance.root), outsideBefore = snapshot(external.root);
    assert.throws(() => installSkill(instance.root, 'olympox', { assistant: 'both' }), /Links and junctions/);
    assert.deepEqual(snapshot(instance.root), before);
    assert.deepEqual(snapshot(external.root), outsideBefore);
    assert.equal(fs.existsSync(path.join(instance.root, '.agents')), false);
  } finally { instance.close(); external.close(); }
});

test('public skill activation refuses both creative skills and every host in a marked development checkout without writes', () => {
  const instance = fixture({ cli: true });
  try {
    write(instance.root, '.development/project.json', JSON.stringify({ schemaVersion: 1, kind: 'framework-development' }));
    write(instance.root, '.git/config', 'Preserved Git metadata');
    write(instance.root, '.agents/skills/local-note.md', 'Preserved local projection note');
    write(instance.root, '.claude/settings.local.json', '{"local":true}');
    const before = snapshot(instance.root);
    for (const skill of ['olympox', 'higgsfield-studio']) for (const assistant of ['codex', 'claude', 'both']) {
      const result = spawnSync(process.execPath, [path.join(instance.root, 'scripts/install-skill.mjs'), skill, '--assistant', assistant], { cwd: project, encoding: 'utf8' });
      assert.equal(result.status, 1, `${skill}/${assistant}`);
      assert.match(result.stderr, /framework development checkout.*independent OLYMPOX studio/);
      assert.deepEqual(snapshot(instance.root), before);
    }
    const defaultSkill = spawnSync(process.execPath, [path.join(instance.root, 'scripts/install-skill.mjs')], { cwd: project, encoding: 'utf8' });
    assert.equal(defaultSkill.status, 1);
    assert.deepEqual(snapshot(instance.root), before);
  } finally { instance.close(); }
});

test('invalid development markers refuse public activation while read-only help remains usable', () => {
  for (const bytes of ['{broken JSON', 'null', '{"schemaVersion":2,"kind":"framework-development"}', '{"schemaVersion":1,"kind":"studio"}']) {
    const instance = fixture({ cli: true });
    try {
      write(instance.root, '.development/project.json', bytes);
      const before = snapshot(instance.root);
      const script = path.join(instance.root, 'scripts/install-skill.mjs');
      const result = spawnSync(process.execPath, [script, '--assistant', 'both'], { encoding: 'utf8' });
      assert.equal(result.status, 1);
      assert.match(result.stderr, /Invalid framework development marker/);
      const help = spawnSync(process.execPath, [script, '--help'], { encoding: 'utf8' });
      assert.equal(help.status, 0, help.stderr);
      assert.match(help.stdout, /framework development checkouts refuse activation/);
      assert.deepEqual(snapshot(instance.root), before);
    } finally { instance.close(); }
  }
});

test('development directory and marker links or non-file markers cannot bypass public activation', () => {
  for (const scenario of ['directory-link', 'marker-link', 'marker-directory', 'directory-file']) {
    const instance = fixture({ cli: true }), external = fixture({ sources: false });
    try {
      write(external.root, 'project.json', '{"schemaVersion":1,"kind":"framework-development"}');
      if (scenario === 'directory-link') junction(external.root, path.join(instance.root, '.development'));
      else if (scenario === 'marker-link') junction(external.root, path.join(instance.root, '.development/project.json'));
      else if (scenario === 'marker-directory') fs.mkdirSync(path.join(instance.root, '.development/project.json'), { recursive: true });
      else write(instance.root, '.development', 'A file is not a development directory');
      const before = snapshot(instance.root), outsideBefore = snapshot(external.root);
      const result = spawnSync(process.execPath, [path.join(instance.root, 'scripts/install-skill.mjs'), '--assistant', 'both'], { encoding: 'utf8' });
      assert.equal(result.status, 1, scenario);
      assert.match(result.stderr, /Invalid framework development (directory|marker)/);
      assert.deepEqual(snapshot(instance.root), before);
      assert.deepEqual(snapshot(external.root), outsideBefore);
    } finally { instance.close(); external.close(); }
  }
});

test('unmarked studio activation retains all host selections, unrelated notes and Git metadata', () => {
  for (const skill of ['olympox', 'higgsfield-studio']) for (const assistant of ['codex', 'claude', 'both']) {
    const instance = fixture({ cli: true });
    try {
      write(instance.root, '.development/unrelated.md', 'A studio note is not a development marker');
      write(instance.root, '.git/config', 'Preserved Git metadata');
      const args = [path.join(instance.root, 'scripts/install-skill.mjs'), skill, '--assistant', assistant];
      const result = spawnSync(process.execPath, args, { encoding: 'utf8' });
      assert.equal(result.status, 0, result.stderr);
      for (const [host, directory] of [['codex', '.agents'], ['claude', '.claude']]) {
        const target = path.join(instance.root, directory, 'skills', skill, 'SKILL.md');
        assert.equal(fs.existsSync(target), assistant === host || assistant === 'both');
        if (fs.existsSync(target)) assert.deepEqual(fs.readFileSync(target), fs.readFileSync(path.join(instance.root, 'skills', skill, 'SKILL.md')));
      }
      const before = snapshot(instance.root);
      assert.equal(spawnSync(process.execPath, args, { encoding: 'utf8' }).status, 0);
      assert.deepEqual(snapshot(instance.root), before);
      assert.equal(fs.readFileSync(path.join(instance.root, '.git/config'), 'utf8'), 'Preserved Git metadata');
    } finally { instance.close(); }
  }
});

test('public both-host activation refuses a destination conflict before writing either projection', () => {
  const instance = fixture({ cli: true });
  try {
    write(instance.root, '.claude/skills/olympox/SKILL.md', 'Preserved customization');
    const before = snapshot(instance.root);
    const result = spawnSync(process.execPath, [path.join(instance.root, 'scripts/install-skill.mjs'), '--assistant', 'both'], { encoding: 'utf8' });
    assert.equal(result.status, 1);
    assert.match(result.stderr, /Installed skill differs/);
    assert.deepEqual(snapshot(instance.root), before);
    assert.equal(fs.existsSync(path.join(instance.root, '.agents')), false);
  } finally { instance.close(); }
});
