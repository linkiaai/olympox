import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { canonHash, hash, validatePersona, snapshotCanon, readCanon, buildPrompt, registerAsset, sealExecution } from '../scripts/studio-core.mjs';
import { startRun, transitionRun, readRun, validateFramework } from '../scripts/framework-core.mjs';
import { usePreReadinessContracts } from './fixtures/pre-stage-readiness/activate.mjs';

const source = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const parent = path.join(source, 'tmp', 'vocal-scope-tests'), scratch = [];
const at = '2026-10-09T12:00:00Z';
const json = file => JSON.parse(fs.readFileSync(file, 'utf8'));
function save(root, relative, value) {
  const target = path.join(root, relative);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, typeof value === 'string' ? value : JSON.stringify(value, null, 2) + '\n');
  return relative;
}
function inventory(root) {
  const result = {};
  const visit = (dir, prefix = '') => {
    for (const name of fs.readdirSync(dir).sort()) {
      const file = path.join(dir, name), relative = prefix + name;
      if (fs.statSync(file).isDirectory()) visit(file, relative + '/');
      else result[relative] = hash(fs.readFileSync(file));
    }
  };
  visit(root); return result;
}
function fixture(scope = 'unspecified', status = 'draft') {
  fs.mkdirSync(parent, { recursive: true });
  const root = fs.mkdtempSync(path.join(parent, 'vocal-')); scratch.push(root);
  for (const dir of ['framework', 'scripts', 'templates']) fs.cpSync(path.join(source, dir), path.join(root, dir), { recursive: true });
  usePreReadinessContracts(root);
  for (const file of ['CONSTITUTION.md', 'AGENTS.md', 'docs/studio-team.md', 'package.json']) save(root, file, fs.readFileSync(path.join(source, file), 'utf8'));
  const base = path.join(root, 'influencers/alpha');
  // Fixed pre-increment template: legacy expectations cannot change with new defaults.
  const p = json(path.join(source, 'tests/fixtures/legacy-persona-v1.json'));
  Object.assign(p, { id: 'alpha', status });
  Object.assign(p.profile, { name: 'Vocal fixture', age: 30, audience: 'Tests', valueProposition: 'Structural consistency' });
  Object.assign(p.identity, { face: 'Oval', eyes: 'Brown', hair: 'Short', skin: 'Natural', body: 'Adult', invariants: ['Structure'] });
  Object.assign(p.voice, { accent: 'Brazilian', tone: 'Calm', pace: 'Moderate' });
  p.references = [['front', 'front.png', 'front'], ['angle', 'angle.png', 'three-quarter'], ['voice', 'voice.wav', 'voice']].map(([id, name, role]) => {
    const relative = `references/${name}`, bytes = `Synthetic ${name}; no real media or inspection.`;
    save(base, relative, bytes);
    return { id, path: relative, role, status: 'approved', origin: 'Synthetic fixture', sha256: hash(bytes), review: { reviewer: 'Fixture', at, notes: 'Declared metadata only' } };
  });
  if (scope !== 'legacy') Object.assign(p.voice, { applicability: scope, selection: null });
  if (scope === 'speaking') {
    p.voice.referenceId = 'voice';
    const ref = p.references[2];
    p.voice.selection = { referenceId: ref.id, path: ref.path, sha256: ref.sha256, method: 'listening', performed: true, generated: true, listened: true, selected: true,
      reviewer: 'Selection fixture', at, eventId: 'fixture-listening-1', source: 'Synthetic test declaration', notes: 'No real listening performed', criticalIssues: [], limitations: [] };
  }
  if (status !== 'draft') p.approval = { reviewer: 'Fixture', at, notes: 'Synthetic scope declaration', canonHash: canonHash(p) };
  save(base, 'persona.json', p); save(base, 'brief.md', 'Synthetic'); save(base, 'decisions.md', 'Synthetic'); save(base, 'assets.json', { schemaVersion: 1, assets: [] });
  return { root, base, p };
}
test.after(() => {
  for (const root of scratch) {
    assert.equal(path.dirname(root), parent); assert.match(path.basename(root), /^vocal-/);
    fs.rmSync(root, { recursive: true, force: true });
  }
});
function approval(p) { return { explicit: true, decision: 'approve', reviewer: 'Fixture', at, eventId: 'fixture-canon', source: 'Synthetic', notes: 'Declared silent or selected speaking scope', canonHash: canonHash(p), identityVersion: p.identityVersion }; }
function atCanon({ root, p }) {
  let run = startRun(root, { workflowId: 'create-character', personaId: p.id, objective: 'Synthetic vocal gate', medium: 'image', capabilities: ['image-generation', 'image-inspection', 'fixture:image-generation'], mediaProviders: { image: 'fixture', audio: 'fixture', video: 'fixture' } });
  while (run.nextTask.taskId !== 'approve-canon') {
    const task = run.nextTask;
    const evidence = { type: task.evidenceType, performed: true, actor: 'Fixture', at, eventId: `fixture-${task.stepId}`, notes: 'Synthetic only' };
    let outputs = [];
    if (task.expectedDelivery === 'human-decision') run = transitionRun(root, run.runId, { action: 'complete', approval: approval(p) });
    else {
      const relative = `influencers/alpha/work/${task.stepId}.${task.expectedDelivery === 'media' ? 'png' : 'md'}`;
      outputs = [save(root, relative, 'Synthetic output')];
      if (task.expectedDelivery === 'media') Object.assign(evidence, { provider: 'fixture', tool: 'synthetic' });
      if (task.expectedDelivery === 'review') Object.assign(evidence, { method: 'visual', reviewer: 'Fixture', decision: 'approve', criticalIssues: [], limitations: [], media: run.run.attempts[0].results.filter(r => r.taskId === 'generate-candidates').at(-1).outputs });
      run = transitionRun(root, run.runId, { action: 'complete', outputs, evidence });
    }
  }
  return run;
}

test('new templates preserve pending draft scope and refuse incomplete direct canon without writes', () => {
  for (const file of ['templates/persona.json', 'templates/locales/pt-BR/persona.json']) {
    const p = json(path.join(source, file));
    assert.equal(p.voice.applicability, 'unspecified'); assert.equal(p.voice.selection, null); assert.equal(p.schemaVersion, 1);
  }
  const { p, base } = fixture();
  assert.deepEqual(validatePersona(p, base).errors, []);
  assert.match(validatePersona(p, base).warnings.join(' '), /voice.applicability/);
  p.status = 'canon-approved'; p.approval = approval(p);
  const before = inventory(base);
  assert.throws(() => snapshotCanon(p, base), /applicability/);
  assert.deepEqual(inventory(base), before);
});

test('exact speaking selection approves and freezes; independent selection event is allowed', () => {
  const f = fixture('speaking', 'canon-approved');
  assert.deepEqual(validatePersona(f.p, f.base).errors, []);
  const record = snapshotCanon(f.p, f.base);
  assert.equal(readCanon(f.base, 1).hash, record.hash);
  const run = atCanon(f);
  assert.equal(run.nextTask.vocalReadiness.ready, true);
  assert.notEqual(transitionRun(f.root, run.runId, { action: 'complete', approval: approval(f.p) }).nextTask.taskId, 'approve-canon');
});

test('speaking selection is bound to exact reviewed audio and complete declarations', () => {
  const f = fixture('speaking', 'canon-approved');
  const mutations = [
    p => { p.voice.selection = null; }, p => { p.voice.referenceId = null; },
    ...['referenceId', 'path', 'sha256'].map(key => p => { p.voice.selection[key] = key === 'sha256' ? '0'.repeat(64) : 'wrong'; }),
    ...['performed', 'generated', 'listened', 'selected'].map(key => p => { p.voice.selection[key] = false; }),
    ...['reviewer', 'eventId', 'source', 'notes'].map(key => p => { p.voice.selection[key] = ''; }),
    p => { p.voice.selection.at = 'invalid'; }, p => { p.voice.selection.method = 'visual'; },
    p => { p.voice.selection.criticalIssues = ['Unresolved']; }, p => { p.voice.selection.limitations = ['Pending']; },
    p => { p.references[2].role = 'front'; }, p => { p.references[2].status = 'candidate'; },
    p => { p.references[2].path = 'references/front.png'; p.voice.selection.path = p.references[2].path; },
    p => { p.references[2].review = null; }
  ];
  for (const mutate of mutations) {
    const p = structuredClone(f.p); mutate(p); p.approval.canonHash = canonHash(p);
    const before = inventory(f.base);
    assert.ok(validatePersona(p, f.base).errors.length, mutate.toString());
    assert.throws(() => snapshotCanon(p, f.base));
    assert.deepEqual(inventory(f.base), before);
  }
  fs.writeFileSync(path.join(f.base, 'references/voice.wav'), 'Changed bytes');
  assert.match(validatePersona(f.p, f.base).errors.join(' '), /changed|match/i);
});

test('silent scope completes without voice and refuses spoken prompt paths', () => {
  const f = fixture('silent', 'canon-approved');
  assert.deepEqual(validatePersona(f.p, f.base).errors, []);
  const run = atCanon(f);
  transitionRun(f.root, run.runId, { action: 'complete', approval: approval(f.p) });
  const shot = json(path.join(source, 'templates/shot.json'));
  Object.assign(shot, { purpose: 'production', medium: 'video', objective: 'Synthetic', scene: 'Room', framing: 'Portrait', lighting: 'Soft', expression: 'Calm', action: 'Still', format: '9:16', script: '', referenceIds: ['front'] });
  assert.match(buildPrompt(f.p, shot, f.base), /medium: video/);
  for (const purpose of ['reference', 'production']) {
    shot.purpose = purpose; shot.script = 'Synthetic speech';
    assert.throws(() => buildPrompt(f.p, shot, f.base), /silent/i);
  }
  f.p.voice.referenceId = 'voice';
  assert.match(validatePersona(f.p, f.base).errors.join(' '), /silent/i);
});

test('silent audio execution refuses sealing without modifying its manifest or canon', () => {
  const f = fixture('silent', 'canon-approved');
  save(f.base, 'media/output.wav', 'Synthetic audio bytes'); save(f.base, 'prompts/audio.md', 'Synthetic speech');
  const asset = registerAsset(f.p, f.base, 'media/output.wav', 'audio');
  const manifest = json(path.join(f.base, 'assets.json'));
  Object.assign(manifest.assets[0], { provider: 'fixture', model: 'fixture', promptPath: 'prompts/audio.md', referenceIds: ['voice'] });
  save(f.base, 'assets.json', manifest);
  const before = inventory(f.base);
  assert.throws(() => sealExecution(f.p, f.base, asset.id), /silent/i);
  assert.deepEqual(inventory(f.base), before);
});

test('unspecified and incomplete speaking drafts expose the current gate without allowing completion', () => {
  for (const scope of ['unspecified', 'speaking']) {
    const f = fixture(scope);
    if (scope === 'speaking') { f.p.voice.selection = null; save(f.base, 'persona.json', f.p); }
    assert.deepEqual(validatePersona(f.p, f.base).errors, []);
    assert.ok(validatePersona(f.p, f.base).warnings.length);
    const run = atCanon(f), before = inventory(f.root);
    assert.equal(run.nextTask.vocalReadiness.ready, false);
    assert.throws(() => transitionRun(f.root, run.runId, { action: 'complete', approval: approval(f.p) }), /applicability|selection/);
    assert.deepEqual(inventory(f.root), before);
  }
  const f = fixture('unknown');
  assert.match(validatePersona(f.p).errors.join(' '), /applicability/);
});

test('current marked canon gate refuses absent legacy applicability with actionable status and zero writes', () => {
  const f = fixture('legacy', 'canon-approved'), run = atCanon(f);
  assert.equal(run.nextTask.vocalReadiness.ready, false);
  assert.match(run.nextTask.vocalReadiness.reasons.join(' '), /applicability/);
  const before = inventory(f.root);
  assert.throws(() => transitionRun(f.root, run.runId, { action: 'complete', approval: approval(f.p) }), /applicability/);
  assert.deepEqual(inventory(f.root), before);
  assert.equal(readRun(f.root, run.runId).nextTask.taskId, 'approve-canon');
});

test('updated canonical task rejects removed or unknown policy; verified legacy task version remains usable', () => {
  const f = fixture('silent'), relative = 'framework/tasks/approve-canon.json', task = json(path.join(f.root, relative));
  assert.equal(task.vocalPolicy, 'explicit-applicability-v1');
  for (const value of [undefined, 'unknown-v1']) {
    const changed = { ...task, vocalPolicy: value }; save(f.root, relative, changed);
    const before = inventory(f.root);
    assert.equal(validateFramework(f.root).valid, false);
    assert.throws(() => startRun(f.root, { workflowId: 'create-character', objective: 'Synthetic' }), /vocalPolicy/);
    assert.deepEqual(inventory(f.root), before);
  }
  save(f.root, relative, { ...task, version: '0.2.0', vocalPolicy: undefined });
  assert.equal(validateFramework(f.root).valid, true);
});

test('fixed historical raw voice hash and frozen record bytes retain legacy semantics', () => {
  const f = fixture('legacy', 'canon-approved');
  assert.equal(canonHash(f.p), '019ec855021dcab621c9fd550d2f8d40b4ea6b9069c8b52b6cef8279ed4f3c12');
  const frozen = snapshotCanon(f.p, f.base), before = inventory(f.base);
  assert.deepEqual(validatePersona(f.p, f.base).errors, []);
  assert.equal(readCanon(f.base, 1).hash, frozen.hash);
  assert.equal(Object.hasOwn(f.p.voice, 'applicability'), false);
  assert.deepEqual(inventory(f.base), before);
  const taskFile = 'framework/tasks/approve-canon.json', task = json(path.join(f.root, taskFile));
  save(f.root, taskFile, { ...task, version: '0.2.0', vocalPolicy: undefined });
  const run = atCanon(f), runFile = `work/runs/${run.runId}.json`, saved = json(path.join(f.root, runFile));
  assert.equal(Object.hasOwn(saved.contract.tasks['approve-canon'], 'vocalPolicy'), false);
  const runBytes = fs.readFileSync(path.join(f.root, runFile));
  assert.equal(readRun(f.root, run.runId).nextTask.vocalReadiness, undefined);
  assert.ok(runBytes.equals(fs.readFileSync(path.join(f.root, runFile))));
  transitionRun(f.root, run.runId, { action: 'complete', approval: approval(f.p) });
});

test('vocal identity evolution keeps earlier canon and requires a new identity version', () => {
  const f = fixture('silent', 'canon-approved'); snapshotCanon(f.p, f.base);
  const before = inventory(path.join(f.base, 'canon'));
  const selected = fixture('speaking', 'canon-approved').p;
  f.p.voice = selected.voice; f.p.approval.canonHash = canonHash(f.p);
  assert.throws(() => snapshotCanon(f.p, f.base), /frozen|identityVersion/i);
  assert.deepEqual(inventory(path.join(f.base, 'canon')), before);
  f.p.identityVersion++; f.p.approval.canonHash = canonHash(f.p);
  snapshotCanon(f.p, f.base);
  assert.equal(readCanon(f.base, 1).persona.voice.applicability, 'silent');
  assert.equal(readCanon(f.base, 2).persona.voice.applicability, 'speaking');
});

test('public studio CLI reports pending draft and refuses incomplete canon snapshot without writes', () => {
  const f = fixture(), cli = path.join(f.root, 'scripts/studio.mjs');
  const validated = spawnSync(process.execPath, [cli, 'validate', 'alpha'], { cwd: f.root, encoding: 'utf8' });
  assert.equal(validated.status, 0, validated.stderr);
  assert.match(validated.stdout, /voice.applicability/);
  f.p.status = 'canon-approved'; f.p.approval = approval(f.p); save(f.base, 'persona.json', f.p);
  const before = inventory(f.root), result = spawnSync(process.execPath, [cli, 'canon-snapshot', 'alpha'], { cwd: f.root, encoding: 'utf8' });
  assert.equal(result.status, 1); assert.match(result.stderr, /applicability/);
  assert.deepEqual(inventory(f.root), before);
});
