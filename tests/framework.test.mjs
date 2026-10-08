import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { canonHash } from '../scripts/studio-core.mjs';
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
function evidence(type, extra = {}) { return { type, performed: true, actor: 'Fixture', at, eventId: `fixture-${crypto.randomUUID()}`, notes: 'Simulated declaration; tests do not generate or inspect media.', ...extra }; }
function begin(root, workflowId = 'produce-piece', overrides = {}) {
  return startRun(root, { workflowId, personaId: 'alpha', objective: 'Exercise local coordination without tools', inputs: ['brief.md'], capabilities: ['image-generation', 'image-inspection'], ...overrides });
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
  return transitionRun(root, run.runId, { action: 'complete', outputs: [output], evidence: evidence('generated', { tool: 'fixture-no-tool' }) });
}
function review(root, run, overrides = {}) {
  const media = run.run.attempts.at(-1).results.filter(result => result.taskId === 'generate-piece').at(-1).outputs;
  const output = save(root, `influencers/alpha/work/review-${crypto.randomUUID()}.md`, 'Simulated inspection report');
  return transitionRun(root, run.runId, { action: 'complete', outputs: [output], evidence: evidence('reviewed', { reviewer: 'Fixture', method: 'visual', decision: 'approve', criticalIssues: [], limitations: [], media, ...overrides }) });
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

test('external intent persisted before submission prevents retry after interruption', () => {
  const root = fixture(), run = reachGeneration(root);
  const armed = transitionRun(root, run.runId, { action: 'start', job: { provider: 'fixture-external' } });
  assert.equal(armed.run.attempts.at(-1).job.status, 'planned');
  assert.equal(armed.canContinue, false);
  assert.equal(resumeRun(root, run.runId).state, 'uncertain-result');
  assert.throws(() => resumeRun(root, run.runId, { newAttempt: true, reason: 'New call' }), /uncertain/);
  const clarified = transitionRun(root, run.runId, { action: 'resolve', job: { provider: 'fixture-external', status: 'not-submitted' }, evidence: evidence('reconciled') });
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
