import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { canonHash, snapshotCanon, validatePersona, validateAssets } from '../scripts/studio-core.mjs';
import { validateFramework, startRun, readRun, validateRunRecord, transitionRun, resumeRun } from '../scripts/framework-core.mjs';

const sourceRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const scratchRoot = path.join(sourceRoot, 'tmp', 'framework-tests');
const scratch = [];
const at = '2026-10-07T15:00:00-03:00';
const digest = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const json = file => JSON.parse(fs.readFileSync(file, 'utf8'));
function save(root, relative, content) {
  const target = path.join(root, relative);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, typeof content === 'string' ? content : JSON.stringify(content, null, 2));
  return relative;
}
function person(root, id = 'alpha', approved = true) {
  const p = json(path.join(sourceRoot, 'templates/persona.json'));
  Object.assign(p, { id, status: approved ? 'canon-approved' : 'draft' });
  Object.assign(p.profile, { name: `Persona ${id}`, age: 29, audience: 'Internal test', valueProposition: 'Validate state without generating media' });
  Object.assign(p.identity, { face: 'Oval', eyes: 'Brown', hair: 'Short', skin: 'Natural texture', body: 'Adult proportions', invariants: ['Facial structure'] });
  Object.assign(p.voice, { accent: 'Brazilian', tone: 'Calm', pace: 'Moderate' });
  p.references = ['front', 'three-quarter'].map(role => {
    const relative = `references/${role}.png`;
    save(root, `influencers/${id}/${relative}`, `Structural fixture ${id} ${role}, without actual pixels`);
    return { id: role, role, path: relative, status: 'approved', origin: 'Fixture, not actual inspection', sha256: digest(path.join(root, `influencers/${id}/${relative}`)), review: { reviewer: 'Fixture', at, notes: 'Declared simulation' } };
  });
  p.approval = approved ? { reviewer: 'Fixture', at, notes: 'Simulation, not identity proof', canonHash: canonHash(p) } : null;
  save(root, `influencers/${id}/persona.json`, p);
  return p;
}
function fixture() {
  fs.mkdirSync(scratchRoot, { recursive: true });
  const root = fs.mkdtempSync(path.join(scratchRoot, 'studio-'));
  scratch.push(root);
  fs.cpSync(path.join(sourceRoot, 'framework'), path.join(root, 'framework'), { recursive: true });
  for (const file of ['CONSTITUTION.md', 'AGENTS.md', 'docs/studio-team.md']) {
    fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
    fs.copyFileSync(path.join(sourceRoot, file), path.join(root, file));
  }
  person(root); person(root, 'beta');
  save(root, 'brief.md', 'Test brief');
  return root;
}
test.after(() => {
  for (const root of scratch) {
    assert.equal(path.dirname(path.resolve(root)), path.resolve(scratchRoot));
    assert.match(path.basename(root), /^studio-/);
    fs.rmSync(root, { recursive: true, force: true });
  }
});
function evidence(type, extra = {}) { return { type, performed: true, actor: 'Fixture', at, eventId: `fixture-${crypto.randomUUID()}`, notes: 'Simulated declaration; tests do not generate or inspect media.', ...(type === 'generated' ? { provider: 'fixture' } : {}), ...extra }; }
function begin(root, workflowId = 'produce-piece', overrides = {}) {
  return startRun(root, { workflowId, personaId: 'alpha', objective: 'Exercise local coordination without tools', inputs: ['brief.md'], medium: 'image', capabilities: ['image-generation', 'image-inspection', 'fixture:image-generation'], mediaProviders: { image: 'fixture', video: 'fixture', audio: 'fixture' }, ...overrides });
}
function document(root, run, suffix = '') {
  const output = save(root, `influencers/alpha/work/${run.nextTask.stepId}${suffix}.md`, `Document ${run.nextTask.stepId}${suffix}`);
  return transitionRun(root, run.runId, { action: 'complete', outputs: [output], evidence: evidence('prepared') });
}
function reachGeneration(root, run = begin(root)) {
  run = transitionRun(root, run.runId, { action: 'skip', reason: 'Brief defined; trend research is unnecessary in this test.' });
  run = document(root, run);
  return document(root, run);
}
function generate(root, run) {
  const output = save(root, `influencers/alpha/media/${crypto.randomUUID()}.png`, 'Fixture .png without actual media evidence; extension only classifies the file.');
  return transitionRun(root, run.runId, { action: 'complete', outputs: [output], evidence: evidence('generated', { tool: 'fixture-no-tool', provider: run.mediaProviders?.image ?? 'fixture' }) });
}
function review(root, run, overrides = {}) {
  const media = run.run.attempts.at(-1).results.filter(result => result.taskId === 'generate-piece').at(-1).outputs;
  const output = save(root, `influencers/alpha/work/review-${crypto.randomUUID()}.md`, 'Simulated inspection report');
  return transitionRun(root, run.runId, { action: 'complete', outputs: [output], evidence: evidence('reviewed', { reviewer: 'Fixture', method: 'visual', decision: 'approve', criticalIssues: [], limitations: [], media, ...overrides }) });
}
function fileInventory(directory) {
  const result = {};
  function visit(current, prefix = '') {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const relative = prefix + entry.name, target = path.join(current, entry.name);
      if (entry.isDirectory()) visit(target, relative + '/');
      else result[relative] = digest(target);
    }
  }
  visit(directory);
  return result;
}
function freeze(root) {
  const p = json(path.join(root, 'influencers/alpha/persona.json'));
  snapshotCanon(p, path.join(root, 'influencers/alpha'));
  return p;
}
function changeApprovedIdentity(root, increment = false) {
  const p = json(path.join(root, 'influencers/alpha/persona.json'));
  p.identity.face = 'Different structural identity';
  if (increment) p.identityVersion++;
  p.status = 'canon-approved';
  p.approval = { reviewer: 'Fixture', at, notes: 'Reapproved structural fixture', canonHash: canonHash(p) };
  save(root, 'influencers/alpha/persona.json', p);
  return p;
}
function reachCanonApproval(root, run = begin(root, 'create-character'), tool = 'fixture') {
  run = transitionRun(root, run.runId, { action: 'skip', reason: 'Research already applicable.' });
  run = document(root, run);
  run = transitionRun(root, run.runId, { action: 'skip', reason: 'Direction selected in this fixture.' });
  run = document(root, run);
  const output = save(root, 'influencers/alpha/media/candidate.png', 'Synthetic candidate bytes');
  run = transitionRun(root, run.runId, { action: 'complete', outputs: [output], evidence: evidence('generated', { tool, provider: run.mediaProviders?.image ?? 'fixture' }) });
  const report = save(root, 'influencers/alpha/work/candidate-review.md', 'Synthetic review');
  return transitionRun(root, run.runId, { action: 'complete', outputs: [report], evidence: evidence('reviewed', {
    reviewer: 'Fixture', method: 'visual', decision: 'approve', criticalIssues: [], limitations: [],
    media: [{ path: output, sha256: digest(path.join(root, output)) }]
  }) });
}
function canonDecision(p) {
  return { explicit: true, decision: 'approve', reviewer: 'Fixture', at, eventId: 'synthetic-human-event', source: 'fixture',
    notes: 'Simulated declaration, not human identity proof.', canonHash: canonHash(p), identityVersion: p.identityVersion };
}

test('registry validates nine roles, three workflows, and constitutional files', () => {
  const root = fixture(), result = validateFramework(root);
  assert.equal(result.valid, true);
  assert.equal(result.registry.roles.length, 9);
  assert.equal(result.registry.workflows.length, 3);
  fs.unlinkSync(path.join(root, 'CONSTITUTION.md'));
  assert.equal(validateFramework(root).valid, false);
});

test('invalid contract, unknown owner, and skippable review are refused', () => {
  const root = fixture(), file = path.join(root, 'framework/tasks/review-media.json'), task = json(file);
  task.owner = 'unknown'; fs.writeFileSync(file, JSON.stringify(task));
  assert.equal(validateFramework(root).valid, false);
  task.owner = 'qa'; fs.writeFileSync(file, JSON.stringify(task));
  const workflowFile = path.join(root, 'framework/workflows/produce-piece.json'), workflow = json(workflowFile);
  workflow.steps.find(step => step.task === 'review-media').optional = true;
  fs.writeFileSync(workflowFile, JSON.stringify(workflow));
  assert.equal(validateFramework(root).valid, false);
  assert.throws(() => begin(root), /skipped/);
});

test('start/status preserve inputs, hashes, owner, and execution limits', () => {
  const root = fixture(), run = begin(root), status = readRun(root, run.runId);
  assert.equal(run.state, 'planned'); assert.equal(status.responsible.name, 'Aurora');
  assert.equal(status.executionMode, 'instruction'); assert.equal(status.automaticallyDispatched, false);
  assert.deepEqual(status.inputs, [{ path: 'brief.md', sha256: digest(path.join(root, 'brief.md')) }]);
  assert.ok(status.constitutionPaths.includes('CONSTITUTION.md'));
  assert.ok(status.limitation.includes('does not dispatch'));
});

test('reapproved frozen version cannot start a workflow even with an empty manifest', () => {
  const root = fixture(); freeze(root);
  const p = changeApprovedIdentity(root), base = path.join(root, 'influencers/alpha');
  const manifest = { schemaVersion: 1, assets: [] }; save(root, 'influencers/alpha/assets.json', manifest);
  assert.ok(validatePersona(p, base).errors.some(error => /Increment identityVersion/.test(error)));
  assert.deepEqual(validateAssets(manifest, p, base), []);
  const before = fileInventory(root);
  for (const workflow of ['create-character', 'produce-piece', 'review-correct']) {
    assert.throws(() => begin(root, workflow), /Increment identityVersion/);
    assert.deepEqual(fileInventory(root), before);
  }
  assert.equal(fs.existsSync(path.join(root, 'work/runs')), false);
});

test('reapproved frozen version cannot bind to an unbound creation run', () => {
  const root = fixture(); freeze(root);
  const run = begin(root, 'create-character', { personaId: null });
  changeApprovedIdentity(root);
  const before = fileInventory(root);
  assert.throws(() => transitionRun(root, run.runId, { action: 'bind-persona', personaId: 'alpha' }), /Increment identityVersion/);
  assert.deepEqual(fileInventory(root), before);
  assert.equal(readRun(root, run.runId).run.personaId, null);
});

test('changed frozen canon blocks task and final delivery acceptance and new attempts without rewriting history', () => {
  for (const phase of ['task', 'delivery']) {
    const root = fixture(); freeze(root);
    let run = begin(root), completion;
    if (phase === 'task') {
      run = transitionRun(root, run.runId, { action: 'skip', reason: 'Research already applicable.' });
      const output = save(root, 'influencers/alpha/work/prepared.md', 'Synthetic prepared document');
      completion = { action: 'complete', outputs: [output], evidence: evidence('prepared') };
    } else {
      run = review(root, generate(root, reachGeneration(root, run)));
      run = transitionRun(root, run.runId, { action: 'skip', reason: 'Distribution experiment outside this fixture.' });
      const media = run.run.attempts.at(-1).results.find(result => result.taskId === 'generate-piece').outputs;
      completion = { action: 'complete', outputs: media.map(output => output.path), evidence: evidence('delivered') };
      assert.equal(run.nextTask.taskId, 'deliver-piece');
    }
    changeApprovedIdentity(root);
    const before = fileInventory(root), status = readRun(root, run.runId);
    assert.equal(status.canContinue, false);
    assert.ok(status.drift.some(change => /Increment identityVersion/.test(change.actual?.error ?? '')));
    for (const options of [{ action: 'start' }, completion]) {
      assert.throws(() => transitionRun(root, run.runId, options), /changed/);
      assert.deepEqual(fileInventory(root), before);
    }
    assert.throws(() => resumeRun(root, run.runId, { newAttempt: true, reason: 'Attempt to accept reapproved same version.' }), /Increment identityVersion/);
    assert.deepEqual(fileInventory(root), before);
    assert.equal(json(path.join(root, 'work/runs', `${run.runId}.json`)).attempts.length, 1);
    const held = resumeRun(root, run.runId);
    assert.equal(held.state, 'awaiting-input'); assert.equal(held.detail.requiresNewAttempt, true); assert.equal(held.canContinue, false);
    assert.deepEqual(held.run.attempts[0].results, run.run.attempts[0].results);
  }
});

test('a draft creation run cannot record a conflicting same-version canon approval', () => {
  const root = fixture(), original = freeze(root);
  save(root, 'influencers/alpha/persona.json', { ...original, status: 'draft', approval: null });
  const run = reachCanonApproval(root);
  assert.equal(run.canonBinding, null); assert.equal(run.nextTask.taskId, 'approve-canon');
  const p = changeApprovedIdentity(root), before = fileInventory(root);
  for (const options of [{ action: 'start' }, { action: 'complete', approval: canonDecision(p) }]) {
    assert.throws(() => transitionRun(root, run.runId, options), /Increment identityVersion/);
    assert.deepEqual(fileInventory(root), before);
  }
  assert.equal(readRun(root, run.runId).nextTask.taskId, 'approve-canon');
});

test('matching and unfrozen approval and valid new versions remain usable without implicit snapshots', () => {
  const root = fixture(), base = path.join(root, 'influencers/alpha');
  let run = reachCanonApproval(root);
  const p = json(path.join(base, 'persona.json'));
  run = transitionRun(root, run.runId, { action: 'complete', approval: canonDecision(p) });
  assert.equal(run.nextTask.taskId, 'prepare-piece'); assert.equal(fs.existsSync(path.join(base, 'canon')), false);
  freeze(root);
  const frozenBytes = fileInventory(path.join(base, 'canon'));
  const matching = begin(root); assert.equal(matching.canContinue, true);
  const next = changeApprovedIdentity(root, true);
  const fresh = begin(root); assert.equal(fresh.canonBinding.identityVersion, next.identityVersion);
  const resumed = resumeRun(root, matching.runId, { newAttempt: true, reason: 'Explicitly adopt the approved new version.' });
  assert.equal(resumed.canContinue, true); assert.equal(resumed.canonBinding.identityVersion, 2); assert.equal(resumed.run.attempts.length, 2);
  assert.deepEqual(resumed.run.attempts[0].inputs, matching.run.attempts[0].inputs);
  assert.equal(fs.existsSync(path.join(base, 'canon/v000002')), false);
  assert.deepEqual(fileInventory(path.join(base, 'canon')), frozenBytes);
});

test('canon conflict does not obstruct reconciliation or authorize repeating an unresolved external job', () => {
  const root = fixture(); freeze(root);
  const run = reachGeneration(root);
  const pending = transitionRun(root, run.runId, { action: 'start', job: { provider: 'fixture', jobId: 'job-1', requestId: 'request-1', receipt: 'receipt-1' } });
  changeApprovedIdentity(root);
  const snapshotBefore = fileInventory(path.join(root, 'influencers/alpha/canon'));
  const before = fileInventory(root);
  assert.throws(() => resumeRun(root, run.runId, { newAttempt: true, reason: 'Attempt to repeat an unresolved job.' }), /uncertain/);
  assert.deepEqual(fileInventory(root), before);
  const held = resumeRun(root, run.runId);
  assert.equal(held.detail.needsReconciliation, true); assert.equal(held.state, 'uncertain-result'); assert.equal(held.canContinue, false);
  const observed = transitionRun(root, run.runId, { action: 'uncertain', reason: 'Preserve outstanding external result.', job: { provider: 'fixture' } });
  assert.equal(observed.run.attempts.at(-1).job.receipt, 'receipt-1');
  const resolved = transitionRun(root, run.runId, { action: 'resolve', job: { provider: 'fixture', jobId: 'job-1', requestId: 'request-1', status: 'failed' }, evidence: evidence('reconciled') });
  assert.equal(resolved.attemptId, pending.attemptId); assert.equal(resolved.nextTask.taskId, 'generate-piece'); assert.equal(resolved.canContinue, false);
  const resolvedBefore = fileInventory(root);
  assert.throws(() => transitionRun(root, run.runId, { action: 'start', job: { provider: 'fixture' } }), /changed/);
  assert.throws(() => resumeRun(root, run.runId, { newAttempt: true, reason: 'Replan after reconciliation.' }), /Increment identityVersion/);
  assert.deepEqual(fileInventory(root), resolvedBefore);
  assert.deepEqual(fileInventory(path.join(root, 'influencers/alpha/canon')), snapshotBefore);
});

test('cross-persona, outside paths, and invalid IDs cannot read or create runs', () => {
  const root = fixture();
  assert.throws(() => begin(root, 'produce-piece', { inputs: ['influencers/beta/persona.json'] }), /another character/);
  for (const input of ['../outside', 'C:/outside', 'a\\b', '/outside', '.git/config']) assert.throws(() => begin(root, 'produce-piece', { inputs: [input] }));
  assert.throws(() => readRun(root, '../../file'), /ID/);
});

test('only optional steps allow skipping with a reason', () => {
  const root = fixture(), run = begin(root);
  assert.throws(() => transitionRun(root, run.runId, { action: 'skip' }), /explicit reason/);
  const next = transitionRun(root, run.runId, { action: 'skip', reason: 'Objective and direction already defined.' });
  assert.equal(next.responsible.name, 'Saraswati');
  assert.throws(() => transitionRun(root, run.runId, { action: 'skip', reason: 'Skip preparation' }), /optional/);
});

test('missing tool waits without consuming a step or claiming generation', () => {
  const root = fixture(), run = reachGeneration(root, begin(root, 'produce-piece', { capabilities: [] }));
  const pending = transitionRun(root, run.runId, { action: 'complete', outputs: [], evidence: evidence('generated', { tool: 'fixture' }) });
  assert.equal(pending.state, 'awaiting-tool'); assert.equal(pending.nextTask.taskId, 'generate-piece');
  assert.equal(pending.detail.note, 'No tool was called.');
});

test('media requires the correct file type and generation event; document is not generated media', () => {
  const root = fixture(), run = reachGeneration(root), output = save(root, 'influencers/alpha/work/draft.md', 'Only a prompt');
  assert.throws(() => transitionRun(root, run.runId, { action: 'complete', outputs: [output], evidence: evidence('generated', { tool: 'fixture' }) }), /documents are not generated media/);
  const image = save(root, 'influencers/alpha/media/take.png', 'Structural fixture');
  assert.throws(() => transitionRun(root, run.runId, { action: 'complete', outputs: [image], evidence: evidence('prepared') }), /Evidence/);
  const generated = generate(root, run);
  assert.equal(generated.nextTask.taskId, 'review-media');
  assert.throws(() => transitionRun(root, run.runId, { action: 'skip', reason: 'Already generated.' }), /optional/);
});

test('review binds bytes and requires a method, no issues, and complete inspection', () => {
  const root = fixture(), run = generate(root, reachGeneration(root));
  assert.throws(() => review(root, run, { criticalIssues: ['Face changed'] }), /Review requires/);
  assert.throws(() => review(root, run, { limitations: ['Not viewed'] }), /Review requires/);
  assert.throws(() => review(root, run, { method: 'listening' }), /Review requires/);
  assert.throws(() => review(root, run, { media: [{ path: 'other.png', sha256: 'a'.repeat(64) }] }), /hashes/);
  assert.equal(review(root, run).nextTask.taskId, 'plan-distribution');
});

test('workflow completes only by delivering already reviewed files without publication', () => {
  const root = fixture(); let run = review(root, generate(root, reachGeneration(root)));
  run = transitionRun(root, run.runId, { action: 'skip', reason: 'Independent delivery, without an experiment this round.' });
  const media = run.run.attempts.at(-1).results.find(result => result.taskId === 'generate-piece').outputs;
  const unreviewed = save(root, 'influencers/alpha/media/export.png', 'New export without review');
  assert.throws(() => transitionRun(root, run.runId, { action: 'complete', outputs: [unreviewed], evidence: evidence('delivered') }), /new review/);
  run = transitionRun(root, run.runId, { action: 'complete', outputs: media.map(item => item.path), evidence: evidence('delivered') });
  assert.equal(run.state, 'completed'); assert.equal(run.nextTask, null);
  assert.ok(run.run.attempts.at(-1).events.at(-1).note.includes('does not mean publication'));
});

test('changed input/canon requires an explicit new attempt without changing history', () => {
  const root = fixture(), run = begin(root);
  save(root, 'brief.md', 'Direction changed by the test');
  assert.throws(() => transitionRun(root, run.runId, { action: 'skip', reason: 'Do not research' }), /changed/);
  const pending = resumeRun(root, run.runId); assert.equal(pending.state, 'awaiting-input'); assert.ok(pending.drift.length);
  assert.throws(() => resumeRun(root, run.runId, { newAttempt: true }), /reason/);
  const resumed = resumeRun(root, run.runId, { newAttempt: true, reason: 'Brief changed; explicitly replan.' });
  assert.notEqual(resumed.attemptId, run.attemptId); assert.equal(resumed.run.attempts.length, 2); assert.equal(resumed.drift.length, 0);
  assert.equal(resumed.run.attempts[0].inputs[0].sha256, run.inputs[0].sha256);
  const p = json(path.join(root, 'influencers/alpha/persona.json')); p.identity.eyes = 'Verdes'; p.identityVersion++; p.approval.canonHash = canonHash(p); save(root, 'influencers/alpha/persona.json', p);
  assert.ok(readRun(root, run.runId).drift.some(item => item.path.endsWith('#canon')));
});

test('a saved production method planning output is observed before generation and drift preserves prior evidence', () => {
  const root = fixture(), identityBefore = fileInventory(path.join(root, 'influencers/alpha'));
  let run = begin(root);
  run = transitionRun(root, run.runId, { action: 'skip', reason: 'This synthetic brief already defines its objective.' });
  const script = save(root, 'influencers/alpha/work/script.md', 'Synthetic script; no actual production.');
  const methodContent = [
    '# Synthetic production method',
    'Requested provider: Higgsfield; module: AI Influencer Builder; access route: plugin.',
    'Model: unverified. Required stages: identity references, scenes, voice, video, inspection.',
    'Preserve approved fixture identity. No external tools or generation were used.'
  ].join('\n');
  const method = save(root, 'influencers/alpha/work/production-method-v1.md', methodContent);
  const methodHash = digest(path.join(root, method));
  run = transitionRun(root, run.runId, { action: 'complete', outputs: [script, method], evidence: evidence('prepared') });
  const planning = run.run.attempts.at(-1).results.find(result => result.taskId === 'prepare-piece');
  assert.deepEqual(planning.outputs.find(output => output.path === method), { path: method, sha256: methodHash });
  assert.deepEqual(run.inputs.find(input => input.path === method), { path: method, sha256: methodHash });
  run = document(root, run);
  assert.equal(run.nextTask.taskId, 'generate-piece');
  assert.equal(run.canContinue, true);
  const previous = structuredClone(run.run.attempts.at(-1));
  save(root, method, 'Synthetic tampering with a recorded method plan before generation.');
  const changedHash = digest(path.join(root, method)), status = readRun(root, run.runId);
  assert.equal(status.canContinue, false);
  assert.deepEqual(status.drift.find(change => change.path === method), { path: method, expected: methodHash, actual: changedHash });
  const syntheticMedia = save(root, 'influencers/alpha/media/unsubmitted.png', 'Synthetic bytes; no tool was called.');
  const recordBefore = digest(path.join(root, `work/runs/${run.runId}.json`));
  for (const options of [
    { action: 'start' },
    { action: 'complete', outputs: [syntheticMedia], evidence: evidence('generated', { tool: 'fixture-no-tool' }) }
  ]) assert.throws(() => transitionRun(root, run.runId, options), /changed/);
  assert.equal(digest(path.join(root, `work/runs/${run.runId}.json`)), recordBefore);
  const held = resumeRun(root, run.runId);
  assert.equal(held.state, 'awaiting-input');
  assert.equal(held.detail.requiresNewAttempt, true);
  assert.deepEqual(held.run.attempts[0].results, previous.results);
  save(root, method, methodContent);
  const revisedMethod = save(root, 'influencers/alpha/work/production-method-v2.md', methodContent + '\nVersion 2: synthetic explicit decision to revise the scene sequence.');
  const resumed = resumeRun(root, run.runId, { newAttempt: true, reason: 'Explicit synthetic replanning in version 2; preserve restored version 1 after tamper detection.' });
  assert.notEqual(resumed.attemptId, run.attemptId);
  assert.equal(resumed.run.attempts.length, 2);
  assert.deepEqual(resumed.run.attempts[0].inputs, previous.inputs);
  assert.deepEqual(resumed.run.attempts[0].results, previous.results);
  assert.deepEqual(resumed.run.attempts[0].events.slice(0, previous.events.length), previous.events);
  assert.deepEqual(resumed.inputs.find(input => input.path === method), { path: method, sha256: methodHash });
  assert.equal(resumed.run.attempts[1].stepIndex, 0);
  assert.equal(resumed.run.attempts[1].results.length, 0);
  let replanned = transitionRun(root, run.runId, { action: 'skip', reason: 'Objective still defined by the same synthetic brief.' });
  const revisedScript = save(root, 'influencers/alpha/work/script-v2.md', 'Revised synthetic scene sequence.');
  replanned = transitionRun(root, run.runId, { action: 'complete', outputs: [revisedScript, revisedMethod], evidence: evidence('prepared') });
  assert.deepEqual(replanned.inputs.find(input => input.path === revisedMethod), { path: revisedMethod, sha256: digest(path.join(root, revisedMethod)) });
  assert.deepEqual(replanned.run.attempts[0].results, previous.results);
  assert.equal(digest(path.join(root, method)), methodHash);
  for (const [relative, hash] of Object.entries(identityBefore)) assert.equal(digest(path.join(root, 'influencers/alpha', relative)), hash);
});

test('a production method input does not bypass a missing generation capability or complete its required stage', () => {
  const root = fixture();
  const method = save(root, 'influencers/alpha/work/production-method-v1.md', [
    '# Synthetic production method',
    'Requested provider: Higgsfield; module: AI Influencer Builder; access route: plugin.',
    'Video generation: pending, because no verified video-generation capability exists.'
  ].join('\n'));
  const run = reachGeneration(root, begin(root, 'produce-piece', { medium: 'video', inputs: ['brief.md', method], capabilities: [], mediaProviders: { video: 'higgsfield' } }));
  assert.deepEqual(run.inputs.find(input => input.path === method), { path: method, sha256: digest(path.join(root, method)) });
  assert.deepEqual(run.missingCapabilities, ['video-generation', 'higgsfield:video-generation']);
  const syntheticMedia = save(root, 'influencers/alpha/media/unsubmitted.mp4', 'Synthetic bytes; no actual media or tool submission.');
  const before = structuredClone(run.run.attempts.at(-1));
  const held = transitionRun(root, run.runId, { action: 'complete', outputs: [syntheticMedia], evidence: evidence('generated', { tool: 'fixture-no-tool' }) });
  assert.equal(held.state, 'awaiting-tool');
  assert.equal(held.nextTask.taskId, 'generate-piece');
  assert.equal(held.canContinue, false);
  assert.equal(held.detail.note, 'No tool was called.');
  assert.deepEqual(held.run.attempts.at(-1).results, before.results);
  assert.deepEqual(held.run.attempts.at(-1).inputs, before.inputs);
  assert.equal(held.run.attempts.at(-1).stepIndex, before.stepIndex);
  assert.equal(held.run.attempts.at(-1).job, null);
});

test('changed generated file blocks review, delivery, and attempt resume', () => {
  const root = fixture(), run = generate(root, reachGeneration(root));
  const media = run.run.attempts.at(-1).results.find(result => result.taskId === 'generate-piece').outputs[0];
  save(root, media.path, 'Bytes changed after the recorded generation');
  assert.ok(readRun(root, run.runId).drift.some(item => item.path === media.path));
  assert.throws(() => review(root, run), /changed/);
  assert.equal(resumeRun(root, run.runId).state, 'awaiting-input');
});

test('profile or contract changes detect drift; overall hash protects events and state', () => {
  const root = fixture(), run = begin(root);
  save(root, 'framework/roles/content.md', '# Changed profile');
  assert.ok(readRun(root, run.runId).drift.some(item => item.path === 'framework/roles/content.md'));
  assert.throws(() => transitionRun(root, run.runId, { action: 'skip', reason: 'Skip research' }), /changed/);
  assert.equal(validateRunRecord(run.run), true);
  const historical = structuredClone(run.run); historical.attempts[0].events[0].note = 'Evento reescrito';
  assert.throws(() => validateRunRecord(historical), /Record hash/);
  const target = path.join(root, 'work/runs', `${run.runId}.json`), changed = json(target);
  changed.attempts[0].state = 'completed'; fs.writeFileSync(target, JSON.stringify(changed));
  assert.throws(() => readRun(root, run.runId), /Record hash/);
});

test('uncertain job blocks a step, new attempt, and retry; reconciliation does not complete generation', () => {
  const root = fixture(), run = reachGeneration(root);
  const uncertain = transitionRun(root, run.runId, { action: 'uncertain', reason: 'Connection dropped after declared manual submission', job: { provider: 'fixture', jobId: 'job-1', requestId: 'request-1' } });
  assert.equal(uncertain.state, 'uncertain-result');
  assert.throws(() => generate(root, uncertain), /uncertain/);
  assert.throws(() => resumeRun(root, run.runId, { newAttempt: true, reason: 'Try again' }), /uncertain/);
  assert.equal(resumeRun(root, run.runId).detail.needsReconciliation, true);
  assert.throws(() => transitionRun(root, run.runId, { action: 'resolve', job: { provider: 'fixture', jobId: 'other', requestId: 'request-1', status: 'succeeded' }, evidence: evidence('reconciled') }), /same provider/);
  const resolved = transitionRun(root, run.runId, { action: 'resolve', job: { provider: 'fixture', jobId: 'job-1', requestId: 'request-1', status: 'succeeded' }, evidence: evidence('reconciled') });
  assert.equal(resolved.state, 'planned'); assert.equal(resolved.nextTask.taskId, 'generate-piece');
});

test('human gate cannot consume itself and requires an explicit event matching the canon', () => {
  const root = fixture(); let run = begin(root, 'create-character');
  run = transitionRun(root, run.runId, { action: 'skip', reason: 'Direction already has applicable research.' }); run = document(root, run);
  run = transitionRun(root, run.runId, { action: 'skip', reason: 'Direction previously chosen by the user.' }); run = document(root, run);
  const output = save(root, 'influencers/alpha/media/candidate.png', 'Fixture candidato');
  run = transitionRun(root, run.runId, { action: 'complete', outputs: [output], evidence: evidence('generated', { tool: 'fixture' }) });
  const report = save(root, 'influencers/alpha/work/candidate-review.md', 'Simulated review');
  run = transitionRun(root, run.runId, { action: 'complete', outputs: [report], evidence: evidence('reviewed', { reviewer: 'Fixture', method: 'visual', decision: 'approve', criticalIssues: [], limitations: [], media: [{ path: output, sha256: digest(path.join(root, output)) }] }) });
  assert.equal(run.nextTask.taskId, 'approve-canon');
  assert.equal(transitionRun(root, run.runId, { action: 'start' }).state, 'awaiting-input');
  assert.throws(() => transitionRun(root, run.runId, { action: 'complete' }), /Human decision/);
  const p = json(path.join(root, 'influencers/alpha/persona.json'));
  const approval = { explicit: true, decision: 'approve', reviewer: 'Fixture', at, eventId: 'simulated-human-event', source: 'fixture', notes: 'Simulated declaration; reviewer does not prove humanity.', canonHash: canonHash(p), identityVersion: p.identityVersion };
  assert.throws(() => transitionRun(root, run.runId, { action: 'complete', approval: { ...approval, canonHash: 'a'.repeat(64) } }), /version\/hash/);
  assert.equal(transitionRun(root, run.runId, { action: 'complete', approval }).nextTask.taskId, 'prepare-piece');
});

test('the Higgsfield default cannot silently consume a generic or integrated image capability', () => {
  const root = fixture(); person(root, 'alpha', false);
  let run = startRun(root, { workflowId: 'create-character', personaId: 'alpha', objective: 'Test the default media provider without actual generation', capabilities: ['image-generation', 'image-inspection', 'integrated-images:image-generation'] });
  assert.equal(run.run.medium, 'video');
  assert.deepEqual(run.mediaProviders, { image: 'higgsfield', video: 'higgsfield', audio: 'higgsfield' });
  run = transitionRun(root, run.runId, { action: 'skip', reason: 'Synthetic brief defines the opportunity.' });
  run = document(root, run);
  run = transitionRun(root, run.runId, { action: 'skip', reason: 'Synthetic selected concept.' });
  run = document(root, run);
  assert.deepEqual(run.missingCapabilities, ['higgsfield:image-generation']);
  assert.equal(run.nextTask.medium, 'image');
  const before = structuredClone(run.run.attempts.at(-1));
  run = transitionRun(root, run.runId, { action: 'complete', outputs: [], evidence: evidence('generated', { tool: 'synthetic-integrated-tool', provider: 'integrated-images' }) });
  assert.equal(run.state, 'awaiting-tool');
  assert.deepEqual(run.run.attempts.at(-1).results, before.results);
  assert.equal(run.run.attempts.at(-1).job, null);
  assert.throws(() => transitionRun(root, run.runId, { action: 'start', mediaProviders: { image: 'integrated-images' } }), /explicit new attempt|newAttempt/);
});

test('a selected provider requires matching intent and generation evidence', () => {
  const root = fixture();
  let run = reachGeneration(root, begin(root, 'produce-piece', { mediaProviders: { image: 'higgsfield' }, capabilities: ['image-generation', 'image-inspection', 'higgsfield:image-generation'] }));
  const output = save(root, 'influencers/alpha/media/synthetic-provider.png', 'Synthetic bytes, not provider output');
  const before = fs.readFileSync(path.join(root, 'work/runs', `${run.runId}.json`));
  assert.throws(() => transitionRun(root, run.runId, { action: 'start', job: { provider: 'integrated-images' } }), /selected media provider/);
  assert.throws(() => transitionRun(root, run.runId, { action: 'complete', outputs: [output], evidence: evidence('generated', { tool: 'synthetic-tool', provider: 'integrated-images' }) }), /selected media provider/);
  assert.deepEqual(fs.readFileSync(path.join(root, 'work/runs', `${run.runId}.json`)), before);
  run = transitionRun(root, run.runId, { action: 'complete', outputs: [output], evidence: evidence('generated', { tool: 'synthetic-higgsfield', provider: 'higgsfield' }) });
  assert.equal(run.nextTask.taskId, 'review-media');
  assert.equal(run.run.attempts.at(-1).results.at(-1).evidence.provider, 'higgsfield');
});

test('new character image candidates lead to a video pilot with separate capabilities and complete review', () => {
  const root = fixture(), p = person(root);
  let run = reachCanonApproval(root, begin(root, 'create-character', { medium: 'video', mediaProviders: { image: 'higgsfield', video: 'higgsfield' }, capabilities: ['image-generation', 'image-inspection', 'higgsfield:image-generation'] }));
  assert.equal(run.nextTask.taskId, 'approve-canon');
  assert.equal(run.run.attempts.at(-1).results.find(result => result.taskId === 'generate-candidates').outputs[0].path.endsWith('.png'), true);
  run = transitionRun(root, run.runId, { action: 'complete', approval: canonDecision(p) });
  run = document(root, run);
  assert.equal(run.nextTask.medium, 'video');
  assert.deepEqual(run.missingCapabilities, ['video-generation', 'higgsfield:video-generation']);
  const pilot = save(root, 'influencers/alpha/media/synthetic-pilot.mp4', 'Synthetic video extension only; no actual motion, speech, or provider execution');
  const videoEvidence = evidence('generated', { tool: 'synthetic-higgsfield-video', provider: 'higgsfield' });
  run = transitionRun(root, run.runId, { action: 'complete', outputs: [pilot], evidence: videoEvidence });
  assert.equal(run.state, 'awaiting-tool');
  run = transitionRun(root, run.runId, { action: 'complete', capabilities: [...run.run.capabilities, 'video-generation', 'higgsfield:video-generation', 'video-inspection'], outputs: [pilot], evidence: videoEvidence });
  assert.equal(run.nextTask.medium, 'video');
  const media = run.run.attempts.at(-1).results.at(-1).outputs;
  const report = save(root, 'influencers/alpha/work/synthetic-video-review.md', 'Synthetic complete review declaration');
  const reviewEvidence = evidence('reviewed', { reviewer: 'Fixture', method: 'visual', decision: 'approve', criticalIssues: [], limitations: [], media });
  assert.throws(() => transitionRun(root, run.runId, { action: 'complete', outputs: [report], evidence: reviewEvidence }), /Review requires/);
  run = transitionRun(root, run.runId, { action: 'complete', outputs: [report], evidence: { ...reviewEvidence, method: 'visual-and-audio' } });
  run = transitionRun(root, run.runId, { action: 'complete', outputs: [pilot], evidence: evidence('delivered') });
  assert.equal(run.state, 'completed');
});

test('an explicit new attempt changes the media route while preserving prior method and candidate evidence', () => {
  const root = fixture();
  const run = reachCanonApproval(root, begin(root, 'create-character', { mediaProviders: { image: 'higgsfield' }, capabilities: ['image-generation', 'image-inspection', 'higgsfield:image-generation'] }));
  const previous = structuredClone(run.run.attempts.at(-1)), references = fileInventory(path.join(root, 'influencers/alpha/references'));
  assert.throws(() => resumeRun(root, run.runId, { mediaProviders: { image: 'integrated-images' } }), /newAttempt/);
  const changed = resumeRun(root, run.runId, { newAttempt: true, reason: 'Synthetic explicit user choice to use integrated images', mediaProviders: { image: 'integrated-images' } });
  assert.deepEqual(changed.mediaProviders, { image: 'integrated-images', video: 'higgsfield', audio: 'higgsfield' });
  assert.deepEqual(changed.run.attempts[0].mediaProviders, previous.mediaProviders);
  assert.deepEqual(changed.run.attempts[0].results, previous.results);
  assert.deepEqual(changed.run.attempts[0].inputs, previous.inputs);
  assert.deepEqual(fileInventory(path.join(root, 'influencers/alpha/references')), references);
  assert.equal(validateRunRecord(changed.run), true);
  assert.throws(() => begin(root, 'produce-piece', { mediaProviders: { video: 'integrated-images' } }), /not a video or voice/);
});

test('historical attempts without provider selection remain readable and do not acquire a route on resume', () => {
  const root = fixture(), run = reachGeneration(root, begin(root, 'produce-piece', { medium: 'video', capabilities: ['video-generation', 'video-inspection'] }));
  const saved = structuredClone(run.run);
  delete saved.attempts[0].mediaProviders;
  delete saved.recordHash;
  const stable = value => Array.isArray(value) ? value.map(stable) : value && typeof value === 'object' ? Object.fromEntries(Object.keys(value).sort().map(key => [key, stable(value[key])])) : value;
  saved.recordHash = crypto.createHash('sha256').update(JSON.stringify(stable(saved))).digest('hex');
  save(root, `work/runs/${run.runId}.json`, saved);
  const before = fs.readFileSync(path.join(root, 'work/runs', `${run.runId}.json`));
  assert.equal(validateRunRecord(saved), true);
  const read = readRun(root, run.runId);
  assert.equal(read.mediaProviders, null);
  assert.deepEqual(read.missingCapabilities, []);
  assert.deepEqual(fs.readFileSync(path.join(root, 'work/runs', `${run.runId}.json`)), before);
  const resumed = resumeRun(root, run.runId);
  assert.equal(resumed.mediaProviders, null);
  assert.equal(Object.hasOwn(resumed.run.attempts[0], 'mediaProviders'), false);
  const output = save(root, 'influencers/alpha/media/historical.mp4', 'Synthetic legacy video');
  const generated = transitionRun(root, run.runId, { action: 'complete', outputs: [output], evidence: evidence('generated', { tool: 'legacy-tool', provider: 'legacy-provider' }) });
  assert.equal(generated.nextTask.taskId, 'review-media');
  const changed = resumeRun(root, run.runId, { newAttempt: true, reason: 'Explicit new method using current framework defaults' });
  assert.deepEqual(changed.mediaProviders, { image: 'higgsfield', video: 'higgsfield', audio: 'higgsfield' });
  assert.equal(Object.hasOwn(changed.run.attempts[0], 'mediaProviders'), false);
});

test('an explicit integrated image alternative preserves canon selection and pilot review requirements', () => {
  const root = fixture(), p = person(root, 'alpha', false);
  const method = save(root, 'influencers/alpha/work/method-v1.md', [
    '# Synthetic stage plan',
    'Visual candidates, references and image pilot: integrated ChatGPT/Codex images.',
    'Only image-generation, image-inspection, and integrated-images:image-generation are declared; no Higgsfield capability.',
    'Silent scope: vocal reference is not applicable. Real speaking scope still needs generated, listened-to, selected voice before complete canon.',
    'No real image tool, reference attachment, inspection or user decision is performed by this fixture.'
  ].join('\n'));
  const identityFiles = ['references/front.png', 'references/three-quarter.png'];
  const hashes = identityFiles.map(file => digest(path.join(root, 'influencers/alpha', file)));
  let run = reachCanonApproval(root, begin(root, 'create-character', { inputs: ['brief.md', method], mediaProviders: { image: 'integrated-images' }, capabilities: ['image-generation', 'image-inspection', 'integrated-images:image-generation'] }), 'synthetic-integrated-image-tool');
  assert.deepEqual(run.run.capabilities, ['image-generation', 'image-inspection', 'integrated-images:image-generation']);
  assert.deepEqual(run.mediaProviders, { image: 'integrated-images', video: 'higgsfield', audio: 'higgsfield' });
  assert.equal(run.canonBinding, null);
  assert.equal(run.nextTask.taskId, 'approve-canon');
  assert.equal(run.inputs.find(input => input.path === method).sha256, digest(path.join(root, method)));
  for (const relative of ['tools/higgsfield', '.env', '.agents/skills/higgsfield-studio']) assert.equal(fs.existsSync(path.join(root, relative)), false);
  assert.throws(() => transitionRun(root, run.runId, { action: 'skip', reason: 'Generation cannot replace identity selection.' }), /optional/);
  assert.throws(() => transitionRun(root, run.runId, { action: 'complete', approval: canonDecision(p) }), /already recorded and approved canon/);
  p.status = 'canon-approved';
  p.approval = { reviewer: 'Fixture', at, notes: 'Synthetic silent-scope approval, no actual user decision.', canonHash: canonHash(p) };
  save(root, 'influencers/alpha/persona.json', p);
  run = transitionRun(root, run.runId, { action: 'complete', approval: canonDecision(p) });
  snapshotCanon(p, path.join(root, 'influencers/alpha'));
  run = document(root, run);
  assert.equal(run.nextTask.taskId, 'generate-piece');
  run = generate(root, run);
  assert.equal(run.nextTask.taskId, 'review-media');
  assert.throws(() => transitionRun(root, run.runId, { action: 'skip', reason: 'No batches before pilot inspection.' }), /optional/);
  const pilot = run.run.attempts.at(-1).results.find(result => result.taskId === 'generate-piece').outputs;
  assert.throws(() => review(root, run, { media: [{ ...pilot[0], sha256: 'a'.repeat(64) }] }), /hashes/);
  run = review(root, run);
  run = transitionRun(root, run.runId, { action: 'complete', outputs: pilot.map(item => item.path), evidence: evidence('delivered') });
  assert.equal(run.state, 'completed');
  assert.deepEqual(identityFiles.map(file => digest(path.join(root, 'influencers/alpha', file))), hashes);
  assert.equal(validateRunRecord(run.run), true);
});

test('unavailable integrated image generation leaves new-character visuals pending without provider substitution', () => {
  const root = fixture(); person(root, 'alpha', false);
  let run = begin(root, 'create-character', { mediaProviders: { image: 'integrated-images' }, capabilities: ['image-inspection', 'integrated-images:image-generation'] });
  run = transitionRun(root, run.runId, { action: 'skip', reason: 'Synthetic brief already defines the direction.' });
  run = document(root, run);
  run = transitionRun(root, run.runId, { action: 'skip', reason: 'Synthetic concept already selected.' });
  run = document(root, run);
  assert.deepEqual(run.missingCapabilities, ['image-generation']);
  const before = structuredClone(run.run.attempts.at(-1));
  run = transitionRun(root, run.runId, { action: 'start' });
  assert.equal(run.state, 'awaiting-tool');
  assert.equal(run.nextTask.taskId, 'generate-candidates');
  assert.equal(run.detail.note, 'No tool was called.');
  assert.deepEqual(run.run.attempts.at(-1).results, before.results);
  assert.equal(run.run.attempts.at(-1).job, null);
});

test('external intent persisted before submission prevents retry after interruption', () => {
  const root = fixture(), run = reachGeneration(root);
  const armed = transitionRun(root, run.runId, { action: 'start', job: { provider: 'fixture' } });
  assert.equal(armed.run.attempts.at(-1).job.status, 'planned');
  assert.equal(armed.canContinue, false);
  assert.equal(resumeRun(root, run.runId).state, 'uncertain-result');
  assert.throws(() => resumeRun(root, run.runId, { newAttempt: true, reason: 'New call' }), /uncertain/);
  const clarified = transitionRun(root, run.runId, { action: 'resolve', job: { provider: 'fixture', status: 'not-submitted' }, evidence: evidence('reconciled') });
  assert.equal(clarified.state, 'planned');
});

test('unresolved job preserves receipts and prevents premature local cancellation', () => {
  const root = fixture(), run = reachGeneration(root);
  const pending = transitionRun(root, run.runId, { action: 'uncertain', reason: 'Manual submission without response', job: { provider: 'fixture', jobId: 'job-original', requestId: 'request-original', receipt: 'receipt-original' } });
  for (const value of [null, '', 'other']) {
    assert.throws(() => transitionRun(root, run.runId, { action: 'uncertain', reason: 'Do not delete receipt', job: { provider: 'fixture', jobId: value } }), /replace or delete/);
    assert.throws(() => transitionRun(root, run.runId, { action: 'uncertain', reason: 'Do not delete request', job: { provider: 'fixture', requestId: value } }), /replace or delete/);
  }
  assert.throws(() => transitionRun(root, run.runId, { action: 'uncertain', reason: 'Do not change receipt', job: { provider: 'fixture', receipt: null } }), /replace or delete/);
  assert.throws(() => transitionRun(root, run.runId, { action: 'cancel', reason: 'Interrupt work' }), /Reconcile/);
  const stillPending = transitionRun(root, run.runId, { action: 'uncertain', reason: 'New observation without changing receipts', job: { provider: 'fixture' } });
  assert.equal(stillPending.run.attempts.at(-1).job.jobId, 'job-original');
  assert.equal(stillPending.run.attempts.at(-1).job.requestId, 'request-original');
  assert.equal(stillPending.run.attempts.at(-1).job.receipt, 'receipt-original');
  assert.equal(stillPending.attemptId, pending.attemptId);
  transitionRun(root, run.runId, { action: 'resolve', job: { provider: 'fixture', jobId: 'job-original', requestId: 'request-original', status: 'failed' }, evidence: evidence('reconciled') });
  assert.equal(transitionRun(root, run.runId, { action: 'cancel', reason: 'Resultado esclarecido; encerrar trabalho local' }).state, 'cancelled');
});

test('creation without persona allows initial planning but requires binding before references', () => {
  const root = fixture(); let run = begin(root, 'create-character', { personaId: null });
  run = transitionRun(root, run.runId, { action: 'skip', reason: 'Brief recebido' });
  const output = save(root, 'portfolio-plan.md', 'Plan without a defined character');
  run = transitionRun(root, run.runId, { action: 'complete', outputs: [output], evidence: evidence('prepared') });
  run = transitionRun(root, run.runId, { action: 'skip', reason: 'Direction defined by the request.' });
  assert.throws(() => transitionRun(root, run.runId, { action: 'start' }), /Bind/);
  run = transitionRun(root, run.runId, { action: 'bind-persona', personaId: 'alpha' });
  assert.equal(run.run.personaId, 'alpha');
});

test('lock preserves state and delegation requires a declared actual agent ID', () => {
  const root = fixture(), run = begin(root), target = path.join(root, 'work/runs', `${run.runId}.json`), lock = path.join(root, 'work/runs', `${run.runId}.lock`);
  const before = digest(target); fs.writeFileSync(lock, 'fixture processo');
  assert.throws(() => resumeRun(root, run.runId), /in use/); assert.equal(digest(target), before); fs.unlinkSync(lock);
  assert.throws(() => transitionRun(root, run.runId, { action: 'start', execution: { mode: 'delegated' } }), /Delegation requires/);
  const started = transitionRun(root, run.runId, { action: 'start', execution: { mode: 'delegated', agentId: 'fixture-subagent', eventId: 'fixture-spawn', actor: 'Fixture', at } });
  assert.equal(started.executionMode, 'delegated'); assert.equal(started.automaticallyDispatched, false);
  assert.equal(resumeRun(root, run.runId).state, 'planned');
});

test('outside junction/symlink prevents reads and writes in run storage', t => {
  const root = fixture(), outside = fixture();
  try { fs.symlinkSync(outside, path.join(root, 'escape'), process.platform === 'win32' ? 'junction' : 'dir'); }
  catch (error) { if (error.code === 'EPERM') { t.skip('Host does not allow junction.'); return; } throw error; }
  assert.throws(() => begin(root, 'produce-piece', { inputs: ['escape/brief.md'] }), /inside the project/);
  fs.symlinkSync(path.join(outside, 'framework'), path.join(root, 'work'), process.platform === 'win32' ? 'junction' : 'dir');
  assert.throws(() => begin(root), /escaped the project/);
});
