import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { startRun, readRun, transitionRun, resumeRun, validateRunRecord, validateFramework } from '../scripts/framework-core.mjs';
import { canonHash } from '../scripts/studio-core.mjs';
import { validateReadinessPlan, validateReadinessRecord, evaluateMediaReadiness, mediaReadinessPolicy, readinessHash } from '../scripts/stage-readiness-core.mjs';
import { usePreReadinessContracts } from './fixtures/pre-stage-readiness/activate.mjs';
import { source, parent, scratch, at, clone, json, save, hash, provenance, fixture, begin, next, reach, planFor, recordFor, rebind, importRecord, generated, evidence } from './fixtures/stage-readiness.mjs';

test.after(() => { for (const root of scratch) { assert.equal(path.dirname(root), parent); assert.match(path.basename(root), /^studio-/); fs.rmSync(root, { recursive: true, force: true }); } });
function ready(options = {}, workflow = 'produce-piece', medium = 'image') {
  const f = fixture(options), run = reach(f.root, begin(f.root, workflow, medium));
  const plan = planFor(f.root, run, { voice: options.scope === 'speaking' ? 'reuse' : 'not-required' });
  return { ...f, run, plan, record: recordFor(f.root, run, plan) };
}
const raw = (root, run) => fs.readFileSync(path.join(root, `work/runs/${run.runId}.json`));
function noWrite(root, run, action, pattern) { const before = raw(root, run); assert.throws(action, pattern); assert.deepEqual(raw(root, run), before); }

test('generation policy is exactly versioned and missing/unknown markers refuse canonical and captured contracts', () => {
  assert.equal(mediaReadinessPolicy({ id: 'generate-piece', version: '0.2.0' }), false);
  assert.equal(mediaReadinessPolicy({ id: 'generate-piece', version: '0.3.0', mediaReadinessPolicy: 'stage-readiness-v1' }), true);
  for (const task of [{ id: 'generate-piece', version: '0.3.0' }, { id: 'generate-piece', version: '0.2.0', mediaReadinessPolicy: 'stage-readiness-v1' }, { id: 'generate-piece', version: '0.3.0', mediaReadinessPolicy: 'other' }]) assert.throws(() => mediaReadinessPolicy(task), /mediaReadinessPolicy/);
  const { root } = fixture(); const task = json(path.join(root, 'framework/tasks/generate-piece.json')); delete task.mediaReadinessPolicy; save(root, 'framework/tasks/generate-piece.json', task);
  assert.equal(validateFramework(root).valid, false); assert.throws(() => begin(root), /mediaReadinessPolicy/); assert.equal(fs.existsSync(path.join(root, 'work/runs')), false);
});

test('offline absence stays pending; capability/instruction acknowledgements cannot start or complete generation', () => {
  const { root } = fixture(), run = reach(root, begin(root)); const before = raw(root, run);
  readRun(root, run.runId); assert.deepEqual(raw(root, run), before);
  for (const action of ['start', 'complete']) {
    const pending = transitionRun(root, run.runId, { action, stageId: 'generation', execution: { mode: 'instruction' }, job: { provider: 'fixture' } });
    assert.equal(pending.state, 'awaiting-tool'); assert.equal(pending.mediaReadiness.canStartStage, false); assert.equal(pending.run.attempts[0].job, null); assert.equal(pending.run.attempts[0].results.length, run.run.attempts[0].results.length);
  }
});

for (const workflow of ['produce-piece', 'review-correct', 'create-character']) test(`current ${workflow} requires matching start then actual bound generation and full declared review`, () => {
  const f = ready({}, workflow); let run = importRecord(f.root, f.run, f.record);
  assert.equal(run.mediaReadiness.canStartStage, true);
  noWrite(f.root, run, () => transitionRun(f.root, run.runId, { action: 'complete', stageId: run.nextTask.stepId }), /captured readiness/);
  noWrite(f.root, run, () => transitionRun(f.root, run.runId, { action: 'start', stageId: 'wrong' }), /stageId/);
  run = transitionRun(f.root, run.runId, { action: 'start', stageId: run.nextTask.stepId });
  for (const mismatch of [{ module: 'other' }, { route: 'other' }, { tool: 'other' }, { provider: 'other' }, { model: 'invented' }, { planHash: 'a'.repeat(64) }, { readinessSnapshotId: 'a'.repeat(64) }, { stdout: 'Raw private provider output' }, { notes: 'person@example.invalid' }]) noWrite(f.root, run, () => generated(f.root, run, mismatch), /generat(?:ed|ion) evidence/);
  run = generated(f.root, run); assert.equal(validateRunRecord(run.run), true);
  if (workflow === 'create-character') {
    run = next(f.root, run); run = next(f.root, run); run = next(f.root, run);
    // Exact scope for the pilot is bound after canon approval; earlier immutable observations stay intact.
    const refreshed = recordFor(f.root, run, f.plan); refreshed.stages = refreshed.stages.filter(s => s.stageId === 'pilot');
    run = importRecord(f.root, run, refreshed); assert.equal(run.mediaReadiness.canStartStage, true);
    run = transitionRun(f.root, run.runId, { action: 'start', stageId: 'pilot' }); run = generated(f.root, run);
  }
  while (run.nextTask) run = next(f.root, run);
  assert.equal(run.state, 'completed'); assert.equal(validateRunRecord(run.run), true);
});

test('whole-method feasibility does not require future voice or pilot source bytes', () => {
  const { root } = fixture({ scope: 'unspecified', draft: true }); const run = reach(root, begin(root, 'create-character', 'video'));
  const plan = planFor(root, run, { futureVoice: true }), record = recordFor(root, run, plan, true);
  const imported = importRecord(root, run, record);
  assert.equal(imported.mediaReadiness.pipelineReady, true); assert.equal(imported.mediaReadiness.canStartStage, true);
  assert.equal(imported.mediaReadiness.stages.find(s => s.stageId === 'voice-reference').ready, false);
  assert.equal(imported.mediaReadiness.stages.find(s => s.stageId === 'pilot').ready, false);
  assert.equal(fs.existsSync(path.join(root, 'work/pilot-prompt.json')), false);
});

test('each missing required check remains pending despite generic capability availability', () => {
  for (const modify of [r => r.feasibility.stages[0].access.available = false, r => r.feasibility.stages[0].acceptedInputSlots = [], r => r.feasibility.authorization = null, r => r.stages[0].acceptedInputs = [], r => r.stages[0].export.originalBytes = false, r => r.stages[0].inspection.available = false, r => r.stages[0].quote = null, r => r.stages[0].authorization = null, r => r.stages[0].model = null, r => r.stages[0].destination = null, r => r.stages[0].limitations.push('Pending access'), r => r.plan.requirements[0].decision = null]) {
    const f = ready(); modify(f.record); rebind(f.run, f.record); const imported = importRecord(f.root, f.run, f.record);
    assert.equal(imported.mediaReadiness.canStartStage, false); assert.ok(imported.mediaReadiness.reasons.length);
    const pending = transitionRun(f.root, imported.runId, { action: 'start', stageId: 'generation', job: { provider: 'fixture' } }); assert.equal(pending.run.attempts[0].job, null);
  }
});

test('null required decision and unchosen module are valid offline plans but cannot authorize omission or execution', () => {
  const f = ready(); f.plan.requirements[0].decision = null; f.plan.stages[0].module = null;
  save(f.root, 'work/plan.json', f.plan); const newRun = startRun(f.root, { workflowId: 'produce-piece', personaId: 'alpha', objective: 'Offline plan', mediaProviders: { image: 'fixture', audio: 'fixture', video: 'fixture' }, readinessPlanPath: 'work/plan.json' });
  assert.equal(newRun.mediaReadiness.pipelineReady, false); assert.equal(newRun.run.attempts[0].mediaReadiness.records.length, 0);
  const bad = clone(f.plan); bad.requirements[0].applicability = 'not-required'; bad.requirements[0].reason = 'Tool missing'; bad.requirements[0].stageIds = [];
  assert.throws(() => validateReadinessPlan(bad, f.run.run, f.root), /explicit decision/);
});

test('exact inputs and scopes reject forged bytes, unknown slots, duplicate slots and unbound acceptance', () => {
  for (const change of [r => r.stages[0].inputs[0].sha256 = 'a'.repeat(64), r => r.stages[0].inputs[0].bytes++, r => r.stages[0].inputs[0].slotId = 'other', r => r.stages[0].inputs.push(clone(r.stages[0].inputs[0])), r => r.stages[0].acceptedInputs[0].inputId = '', r => r.stages[0].acceptedInputs[0].sha256 = 'a'.repeat(64), r => r.stages[0].quote.scopeHash = 'a'.repeat(64), r => r.runId = `run-${cryptoRandomUuid()}`]) {
    const f = ready(); change(f.record); noWrite(f.root, f.run, () => importRecord(f.root, f.run, f.record), /Media readiness/);
  }
});
function cryptoRandomUuid() { return '00000000-0000-0000-0000-000000000000'; }

test('known cost units and whole-pilot limits cannot be overridden by a looser stage grant', () => {
  const f = ready(); f.record.feasibility.authorization.limits[0].maximum = 1; f.record.stages[0].quote.amount = 2; rebind(f.run, f.record);
  const run = importRecord(f.root, f.run, f.record); assert.equal(run.mediaReadiness.pipelineReady, true); assert.equal(run.mediaReadiness.canStartStage, false); assert.match(run.mediaReadiness.reasons.join(' '), /whole-pilot limit/);
  const g = ready(); g.record.stages[0].quote.unit = { kind: 'currency', code: 'USD' }; rebind(g.run, g.record); const blocked = importRecord(g.root, g.run, g.record); assert.equal(blocked.mediaReadiness.canStartStage, false); assert.match(blocked.mediaReadiness.reasons.join(' '), /comparable/);
});

test('whole-pilot limit includes actual captured costs from completed stages, not their earlier estimates', () => {
  const f = ready({}, 'create-character'); f.record.feasibility.stages[0].quote.amount = 2; f.record.feasibility.stages[1].quote.amount = 1; f.record.feasibility.authorization.limits[0].maximum = 4;
  f.record.stages[0].quote.amount = 3; f.record.stages[1].quote.amount = 2; rebind(f.run, f.record);
  let run = importRecord(f.root, f.run, f.record); assert.equal(run.mediaReadiness.canStartStage, true);
  run = transitionRun(f.root, run.runId, { action: 'start', stageId: 'candidates' }); run = generated(f.root, run);
  run = next(f.root, run); run = next(f.root, run); run = next(f.root, run);
  assert.equal(run.nextTask.stepId, 'pilot'); assert.equal(run.mediaReadiness.pipelineReady, true); assert.equal(run.mediaReadiness.canStartStage, false); assert.match(run.mediaReadiness.reasons.join(' '), /whole-pilot limit/);
  const widened = clone(f.record); widened.feasibility.authorization.limits[0].maximum = 5; rebind(run, widened);
  run = importRecord(f.root, run, widened); assert.equal(run.mediaReadiness.canStartStage, true);
});

test('future sources acquire their first exact binding without replacing prior snapshots', () => {
  const { root } = fixture({ scope: 'unspecified', draft: true }); let run = reach(root, begin(root, 'create-character', 'video'));
  const plan = planFor(root, run, { futureVoice: true }), initial = recordFor(root, run, plan, true);
  run = importRecord(root, run, initial); const first = clone(run.run.attempts[0].mediaReadiness.records[0]);
  run = transitionRun(root, run.runId, { action: 'start', stageId: 'candidates' }); run = generated(root, run);
  save(root, 'influencers/alpha/references/voice.wav', 'Synthetic future voice source');
  const later = recordFor(root, run, plan); run = importRecord(root, run, later);
  assert.deepEqual(run.run.attempts[0].mediaReadiness.records[0], first); assert.equal(run.run.attempts[0].mediaReadiness.records.length, 2);
  assert.equal(run.run.attempts[0].mediaReadiness.records[1].record.stages.find(s => s.stageId === 'voice-reference').inputs.length, 1);
});

test('completed auxiliary actual quote contributes to pilot limits and cannot refresh into a cheaper estimate', () => {
  const f = ready({ scope: 'speaking', legacy: true }, 'produce-piece', 'video'); f.record.feasibility.authorization.limits[0].maximum = 4;
  f.record.stages.find(s => s.stageId === 'voice-reference').quote.amount = 5; rebind(f.run, f.record);
  const run = importRecord(f.root, f.run, f.record); assert.equal(run.mediaReadiness.pipelineReady, true); assert.equal(run.mediaReadiness.canStartStage, false); assert.match(run.mediaReadiness.reasons.join(' '), /whole-pilot limit/);
  const cheaper = clone(f.record); cheaper.stages.find(s => s.stageId === 'voice-reference').quote.amount = 1; rebind(run, cheaper);
  noWrite(f.root, run, () => importRecord(f.root, run, cheaper), /completed outcome quote/);
});

test('completed auxiliary actual cost remains pending until first exact known or explicitly accepted unknown quote', () => {
  const f = ready({ scope: 'speaking', legacy: true }, 'produce-piece', 'video'); f.record.feasibility.authorization.limits[0].maximum = 4;
  const voice = f.record.stages.find(s => s.stageId === 'voice-reference'), quoted = clone(voice.quote); voice.quote = null; voice.authorization = null; rebind(f.run, f.record);
  let run = importRecord(f.root, f.run, f.record); assert.equal(run.mediaReadiness.pipelineReady, true); assert.equal(run.mediaReadiness.canStartStage, false); assert.match(run.mediaReadiness.reasons.join(' '), /Completed auxiliary actual cost remains pending/);
  const actual = clone(f.record); actual.stages.find(s => s.stageId === 'voice-reference').quote = { ...quoted, amount: 2 }; rebind(run, actual);
  run = importRecord(f.root, run, actual); assert.equal(run.mediaReadiness.canStartStage, true);
  const cheaper = clone(actual); cheaper.stages.find(s => s.stageId === 'voice-reference').quote.amount = 1; rebind(run, cheaper); noWrite(f.root, run, () => importRecord(f.root, run, cheaper), /completed outcome quote/);

  const g = ready({ scope: 'speaking', legacy: true }, 'produce-piece', 'video'), unknown = g.record.stages.find(s => s.stageId === 'voice-reference');
  Object.assign(unknown.quote, { status: 'unknown', amount: null, unit: null, reason: 'Actual completed charge is not exposed.' }); rebind(g.run, g.record);
  let uncertain = importRecord(g.root, g.run, g.record); assert.equal(uncertain.mediaReadiness.canStartStage, false); assert.match(uncertain.mediaReadiness.reasons.join(' '), /unknown cost lacks whole-pilot scoped acceptance/);
  const accepted = clone(g.record); accepted.feasibility.authorization.acceptUnknownCost = ['voice-reference']; rebind(uncertain, accepted);
  uncertain = importRecord(g.root, uncertain, accepted); assert.equal(uncertain.mediaReadiness.canStartStage, true);
});

test('unknown costs require both explicitly scoped grants and free requires known zero evidence', () => {
  const f = ready(); const q = f.record.stages[0].quote; Object.assign(q, { status: 'unknown', amount: null, unit: null, reason: 'Provider does not expose final amount.' }); rebind(f.run, f.record);
  let run = importRecord(f.root, f.run, f.record); assert.equal(run.mediaReadiness.canStartStage, false);
  const accepted = clone(f.record); accepted.stages[0].authorization.acceptUnknownCost = ['generation']; accepted.feasibility.authorization.acceptUnknownCost = ['generation']; rebind(f.run, accepted);
  run = importRecord(f.root, run, accepted); assert.equal(run.mediaReadiness.canStartStage, true);
  const free = ready(); Object.assign(free.record.stages[0].quote, { status: 'known', amount: 0, unit: { kind: 'free', code: null } }); rebind(free.run, free.record); assert.equal(importRecord(free.root, free.run, free.record).mediaReadiness.canStartStage, true);
  free.record.stages[0].quote.status = 'unknown'; assert.throws(() => validateReadinessRecord(free.record, free.run.run, free.root), /cost|free/);
});

test('expired quotes block start but a valid captured start retains its quote and grant at completion', () => {
  const f = ready(); const expiry = new Date(Date.now() + 10000).toISOString();
  f.record.stages[0].quote.expiresAt = expiry; f.record.feasibility.stages[0].quote.expiresAt = expiry; rebind(f.run, f.record);
  let run = importRecord(f.root, f.run, f.record); run = transitionRun(f.root, run.runId, { action: 'start', stageId: 'generation' });
  const captured = run.run.attempts[0].execution.mediaReadiness;
  assert.equal(evaluateMediaReadiness(f.root, run.run, { at: '2099-01-01T00:00:00.000Z' }).canStartStage, false);
  assert.equal(evaluateMediaReadiness(f.root, run.run, { at: '2099-01-01T00:00:00.000Z', captured }).canStartStage, true);
  assert.equal(generated(f.root, run).nextTask.stepId, 'review');
});

test('bound context cannot refresh; same-plan quote renewal appends immutable evidence and source JSON is imported', () => {
  const f = ready(); let run = importRecord(f.root, f.run, f.record); const old = clone(run.run.attempts[0].mediaReadiness.records[0]);
  const changed = clone(f.record); changed.stages[0].destination = { exposed: true, value: { accountFingerprint: 'a'.repeat(64), workspaceId: 'different' }, reason: null, provenance: provenance() }; changed.feasibility.stages[0].destination = clone(changed.stages[0].destination); rebind(f.run, changed);
  noWrite(f.root, run, () => importRecord(f.root, run, changed), /bound destination/);
  const renewed = clone(f.record); renewed.stages[0].quote.amount = 3; rebind(f.run, renewed); run = importRecord(f.root, run, renewed);
  assert.deepEqual(run.run.attempts[0].mediaReadiness.records[0], old); assert.equal(run.run.attempts[0].mediaReadiness.records.length, 2);
  const sourceFile = run.run.attempts[0].mediaReadiness.records.at(-1).sourcePath; save(f.root, sourceFile, 'Now invalid mutable source JSON'); assert.equal(readRun(f.root, run.runId).drift.length, 0);
  save(f.root, f.record.stages[0].inputs[0].path, 'Changed exact prompt'); assert.ok(readRun(f.root, run.runId).drift.length);
  const resumed = resumeRun(f.root, run.runId, { newAttempt: true, reason: 'Actual prompt changed' }); assert.equal(resumed.run.attempts[1].mediaReadiness, undefined); assert.deepEqual(resumed.run.attempts[0].mediaReadiness.records[0], old);
});

test('native destination exposure and actual requested model remain separate checked prerequisites', () => {
  const f = ready(); f.record.plan.stages[0].route = 'native-cli'; rebind(f.run, f.record); const pending = importRecord(f.root, f.run, f.record); assert.equal(pending.mediaReadiness.canStartStage, false); assert.match(pending.mediaReadiness.reasons.join(' '), /destination/);
  const g = ready(); g.record.plan.stages[0].requestedModel = 'actual-model'; rebind(g.run, g.record); assert.equal(importRecord(g.root, g.run, g.record).mediaReadiness.canStartStage, false);
  const h = ready(); h.record.plan.stages[0].requestedModel = 'actual-model'; for (const e of [h.record.stages[0], h.record.feasibility.stages[0]]) e.model = { exposed: true, value: 'actual-model', reason: null, provenance: provenance() }; rebind(h.run, h.record); assert.equal(importRecord(h.root, h.run, h.record).mediaReadiness.canStartStage, true);
});

test('speaking reuse binds approved selected audio, and arbitrary work bytes cannot supply it', () => {
  const f = ready({ scope: 'speaking', legacy: true }, 'produce-piece', 'video'); let run = importRecord(f.root, f.run, f.record); assert.equal(run.mediaReadiness.canStartStage, true);
  run = transitionRun(f.root, run.runId, { action: 'start', stageId: 'generation' }); assert.equal(generated(f.root, run).nextTask.stepId, 'review');
  const g = ready({ scope: 'speaking', legacy: true }, 'produce-piece', 'video'); const voice = g.record.stages.find(s => s.stageId === 'voice-reference'); voice.inputs = []; voice.acceptedInputs = []; const arbitrary = save(g.root, 'work/arbitrary.wav', 'Synthetic unrelated audio'); voice.outcome.files = [{ path: arbitrary, sha256: hash(fs.readFileSync(path.join(g.root, arbitrary))), bytes: fs.statSync(path.join(g.root, arbitrary)).size }]; rebind(g.run, g.record);
  const pending = importRecord(g.root, g.run, g.record); assert.equal(pending.mediaReadiness.canStartStage, false); assert.match(pending.mediaReadiness.reasons.join(' '), /selected approved audio/);
});

test('current static piece on historical EN and pt-BR canon preserves absent vocal fields and all canon bytes', () => {
  for (const pt of [false, true]) {
    const f = fixture({ legacy: true }); if (pt) { f.p.status = 'canon_aprovado'; for (const r of f.p.references) r.status = 'aprovado'; f.p.approval.canonHash = canonHash(f.p); save(f.root, 'influencers/alpha/persona.json', f.p); }
    const before = fs.readFileSync(path.join(f.root, 'influencers/alpha/persona.json')); const run = reach(f.root, begin(f.root)); const record = recordFor(f.root, run, planFor(f.root, run));
    assert.equal(importRecord(f.root, run, record).mediaReadiness.canStartStage, true); assert.deepEqual(fs.readFileSync(path.join(f.root, 'influencers/alpha/persona.json')), before); assert.equal(Object.hasOwn(f.p.voice, 'applicability'), false);
  }
});

test('current speaking piece reuses preserved pt-BR historical approvals without normalizing bytes', () => {
  const f = fixture({ legacy: true, scope: 'speaking' }); f.p.status = 'canon_aprovado'; for (const r of f.p.references) r.status = 'aprovado'; f.p.approval.canonHash = canonHash(f.p); save(f.root, 'influencers/alpha/persona.json', f.p);
  const before = fs.readFileSync(path.join(f.root, 'influencers/alpha/persona.json')); const run = reach(f.root, begin(f.root, 'produce-piece', 'video')); const record = recordFor(f.root, run, planFor(f.root, run, { voice: 'reuse' }));
  assert.equal(importRecord(f.root, run, record).mediaReadiness.canStartStage, true); assert.deepEqual(fs.readFileSync(path.join(f.root, 'influencers/alpha/persona.json')), before);
});

test('unresolved original job forbids refresh/new attempt but drift-safe matching resolve remains usable', () => {
  const f = ready(); let run = importRecord(f.root, f.run, f.record); run = transitionRun(f.root, run.runId, { action: 'start', stageId: 'generation', job: { provider: 'fixture', requestId: 'original-request' } });
  noWrite(f.root, run, () => importRecord(f.root, run, rebind(run, clone(f.record))), /uncertain/);
  noWrite(f.root, run, () => resumeRun(f.root, run.runId, { newAttempt: true, reason: 'Attempted retry' }), /uncertain|Reconcile/);
  save(f.root, 'work/generation-prompt.json', 'Drift'); run = transitionRun(f.root, run.runId, { action: 'resolve', job: { provider: 'fixture', requestId: 'original-request', status: 'not-submitted' }, evidence: evidence('reconciled') });
  assert.equal(run.run.attempts[0].job.status, 'not-submitted'); assert.ok(run.drift.length); assert.equal(run.canContinue, false);
});

test('malformed metadata, invalid UTC dates and unknown objects are refused before record writes', () => {
  for (const change of [r => r.ready = true, r => r.plan.extra = true, r => r.provenance.at = '2026-02-31T00:00:00Z', r => r.provenance.at = '2026-10-09T25:00:00Z', r => r.provenance.notes = 'https://secret.example', r => r.stages[0].quote.unit = { kind: 'currency', code: 'usd' }, r => r.plan.stages[0].inputSlots[0].fromStageId = 'generation']) {
    const f = ready(); change(f.record); noWrite(f.root, f.run, () => importRecord(f.root, f.run, f.record), /Media readiness/);
  }
  const f = ready(); const target = save(f.root, 'work/huge.json', ' '.repeat(1024 * 1024 + 1)); noWrite(f.root, f.run, () => transitionRun(f.root, f.run.runId, { action: 'record-media-readiness', readinessPath: target }), /1 MiB/);
});

test('saved active capture has its own hash and exact source linkage', () => {
  const f = ready(); let run = importRecord(f.root, f.run, f.record); run = transitionRun(f.root, run.runId, { action: 'start', stageId: 'generation' });
  const edited = clone(run.run); edited.attempts[0].execution.mediaReadiness.quote.amount = 500; const { recordHash, ...body } = edited; edited.recordHash = readinessHash(body); assert.throws(() => validateRunRecord(edited), /captured start/);
  edited.attempts[0].execution.mediaReadiness.id = readinessHash(Object.fromEntries(Object.entries(edited.attempts[0].execution.mediaReadiness).filter(([k]) => k !== 'id'))); const { recordHash: old, ...changed } = edited; edited.recordHash = readinessHash(changed); assert.throws(() => validateRunRecord(edited), /exact source/);
});

test('strict plan/input/record/parent/lock paths reject inward junctions without lasting writes', () => {
  const f = ready(), inside = path.join(f.root, 'work/real'); fs.mkdirSync(inside); fs.symlinkSync(inside, path.join(f.root, 'work/linked'), 'junction'); save(f.root, 'work/real/readiness.json', f.record);
  noWrite(f.root, f.run, () => transitionRun(f.root, f.run.runId, { action: 'record-media-readiness', readinessPath: 'work/linked/readiness.json' }), /link|junction/i);
  const g = ready(); const lock = path.join(g.root, `work/runs/${g.run.runId}.lock`); fs.symlinkSync(path.join(g.root, 'work'), lock, 'junction');
  noWrite(g.root, g.run, () => transitionRun(g.root, g.run.runId, { action: 'start' }), /link|junction/i); fs.unlinkSync(lock);
  const h = ready(); fs.symlinkSync(path.join(h.root, 'work'), path.join(h.root, 'work/alias'), 'junction'); h.record.stages[0].inputs[0].path = 'work/alias/generation-prompt.json'; rebind(h.run, h.record);
  noWrite(h.root, h.run, () => importRecord(h.root, h.run, h.record), /link|junction/i);
  for (const relative of ['../outside.json', '.codex/config.json', 'influencers/other/persona.json', 'work/runs/inside.json']) noWrite(h.root, h.run, () => transitionRun(h.root, h.run.runId, { action: 'record-media-readiness', readinessPath: relative }), /Media readiness/);
});

test('authoritative run is reread after acquiring the lock rather than written from stale preview', () => {
  const f = ready(); const recordPath = path.join(f.root, `work/runs/${f.run.runId}.json`), original = fs.openSync;
  fs.openSync = function(target, flags, ...args) {
    if (String(target).endsWith(`${f.run.runId}.lock`) && flags === 'wx') {
      const actual = json(recordPath); actual.capabilities = []; const { recordHash, ...body } = actual; actual.recordHash = readinessHash(body); fs.writeFileSync(recordPath, JSON.stringify(actual) + '\n');
    }
    return original.call(this, target, flags, ...args);
  };
  try { const result = importRecord(f.root, f.run, f.record); assert.deepEqual(result.run.capabilities, []); assert.equal(result.canContinue, false); } finally { fs.openSync = original; }
});

test('legacy captured generation keeps direct completion and new-attempt semantics with no policy injection', () => {
  const { root } = fixture(); usePreReadinessContracts(root); let run = reach(root, begin(root)); const before = raw(root, run); assert.equal(run.mediaReadiness, undefined); readRun(root, run.runId); assert.deepEqual(raw(root, run), before);
  const output = save(root, 'influencers/alpha/media/legacy.png', 'Synthetic legacy media'); run = transitionRun(root, run.runId, { action: 'complete', outputs: [output], evidence: evidence('generated', { provider: 'fixture', tool: 'legacy-fixture' }) });
  const resumed = resumeRun(root, run.runId, { newAttempt: true, reason: 'Legacy explicit new attempt' }); assert.equal(resumed.mediaReadiness, undefined); assert.equal(resumed.run.contract.tasks['generate-piece'].version, '0.2.0');
  noWrite(root, resumed, () => transitionRun(root, resumed.runId, { action: 'record-media-readiness', readinessPath: 'work/absent.json' }), /legacy captured/);
});

test('public CLI imports readiness and enforces start/complete with matching status/help', () => {
  const f = ready(); const cli = (...args) => spawnSync(process.execPath, [path.join(f.root, 'scripts/studio.mjs'), ...args], { cwd: f.root, encoding: 'utf8' });
  assert.match(cli('help').stdout, /record-media-readiness/);
  const record = save(f.root, 'work/cli-readiness.json', f.record), transition = save(f.root, 'work/cli-transition.json', { action: 'record-media-readiness', readinessPath: record });
  const imported = cli('run-step', f.run.runId, path.join(f.root, transition)); assert.equal(imported.status, 0, imported.stderr); assert.equal(JSON.parse(imported.stdout).mediaReadiness.canStartStage, true);
  const status = cli('run-status', f.run.runId); assert.equal(status.status, 0); assert.equal(JSON.parse(status.stdout).mediaReadiness.pipelineReady, true);
  save(f.root, transition, { action: 'complete', stageId: 'generation' }); const denied = cli('run-step', f.run.runId, path.join(f.root, transition)); assert.equal(denied.status, 1); assert.match(denied.stderr, /captured readiness/);
  save(f.root, transition, { action: 'start', stageId: 'generation' }); const started = cli('run-step', f.run.runId, path.join(f.root, transition)); assert.equal(started.status, 0, started.stderr); assert.ok(JSON.parse(started.stdout).mediaReadiness.activeSnapshot);
});
