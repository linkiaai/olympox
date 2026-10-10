import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { startRun, transitionRun } from '../../scripts/framework-core.mjs';
import { canonHash } from '../../scripts/studio-core.mjs';
import { readinessHash, mediaReadinessHashes } from '../../scripts/stage-readiness-core.mjs';

export const source = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
export const parent = path.join(source, 'tmp/stage-readiness-tests');
export const scratch = [];
export const at = '2026-10-09T00:00:00.000Z';
export const clone = value => JSON.parse(JSON.stringify(value));
export const json = file => JSON.parse(fs.readFileSync(file, 'utf8'));
export const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
export function save(root, relative, value) {
  const target = path.join(root, relative); fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, typeof value === 'string' ? value : JSON.stringify(value, null, 2) + '\n'); return relative;
}
export const provenance = (eventId = `fixture-${crypto.randomUUID()}`) => ({ actor: 'Synthetic observer', at, eventId, source: 'Synthetic local event', notes: 'Metadata only; no real provider or media inspection.' });
export const decision = () => ({ ...provenance(), explicit: true });
export const evidence = (type, extra = {}) => ({ type, performed: true, actor: 'Fixture', at, eventId: crypto.randomUUID(), notes: 'Synthetic declaration only', ...extra });
export function fixture({ scope = 'silent', draft = false, legacy = false } = {}) {
  fs.mkdirSync(parent, { recursive: true }); const root = fs.mkdtempSync(path.join(parent, 'studio-')); scratch.push(root);
  for (const name of ['framework', 'scripts', 'templates']) fs.cpSync(path.join(source, name), path.join(root, name), { recursive: true });
  for (const name of ['CONSTITUTION.md', 'docs/studio-team.md', 'package.json']) save(root, name, fs.readFileSync(path.join(source, name), 'utf8'));
  save(root, 'AGENTS.md', fs.readFileSync(path.join(source, 'templates/studio-AGENTS.md'), 'utf8'));
  const p = json(path.join(source, 'tests/fixtures/legacy-persona-v1.json'));
  Object.assign(p, { id: 'alpha', status: draft ? 'draft' : 'canon-approved' });
  Object.assign(p.profile, { name: 'Fixture Alpha', age: 30, audience: 'Tests', valueProposition: 'Synthetic consistency' });
  Object.assign(p.identity, { face: 'Oval', eyes: 'Brown', hair: 'Short', skin: 'Natural', body: 'Adult', invariants: ['Structure'] });
  Object.assign(p.voice, { accent: 'Brazilian', tone: 'Calm', pace: 'Moderate' });
  p.references = [['front', 'front.png'], ['three-quarter', 'angle.png'], ...(scope === 'speaking' ? [['voice', 'voice.wav']] : [])].map(([role, name]) => {
    const relative = `references/${name}`; save(root, `influencers/alpha/${relative}`, `Synthetic ${name}; no media quality claim.`);
    return { id: role, role, path: relative, status: 'approved', origin: 'Synthetic fixture', sha256: hash(fs.readFileSync(path.join(root, `influencers/alpha/${relative}`))), review: { reviewer: 'Fixture', at, notes: 'Synthetic' } };
  });
  p.voice.referenceId = scope === 'speaking' ? 'voice' : null;
  if (!legacy) Object.assign(p.voice, { applicability: scope, selection: scope === 'speaking' ? { referenceId: 'voice', path: 'references/voice.wav', sha256: p.references[2].sha256, method: 'listening', performed: true, generated: true, listened: true, selected: true, reviewer: 'Fixture', at, eventId: 'fixture-voice-selection', source: 'Synthetic', notes: 'No real listening', criticalIssues: [], limitations: [] } : null });
  if (!draft) p.approval = { reviewer: 'Fixture', at, notes: 'Synthetic', canonHash: canonHash(p) }; else p.approval = null;
  save(root, 'influencers/alpha/persona.json', p);
  for (const name of ['brief.md', 'decisions.md']) save(root, `influencers/alpha/${name}`, 'Synthetic');
  save(root, 'influencers/alpha/assets.json', { schemaVersion: 1, assets: [] });
  save(root, 'work/method-v001.md', 'Synthetic versioned method; no paid operation.');
  return { root, p };
}
export function begin(root, workflowId = 'produce-piece', medium = 'image') {
  return startRun(root, { workflowId, personaId: 'alpha', objective: 'Synthetic media readiness', medium, mediaProviders: { image: 'fixture', audio: 'fixture', video: 'fixture' }, capabilities: ['image-generation', 'video-generation', 'audio-generation', 'image-inspection', 'video-inspection', 'audio-inspection', 'fixture:image-generation', 'fixture:video-generation', 'fixture:audio-generation'] });
}
export function next(root, run) {
  const task = run.nextTask;
  if (task.optional) return transitionRun(root, run.runId, { action: 'skip', reason: 'Unnecessary in this synthetic fixture.' });
  if (task.expectedDelivery === 'human-decision') {
    const p = json(path.join(root, 'influencers/alpha/persona.json'));
    return transitionRun(root, run.runId, { action: 'complete', approval: { explicit: true, decision: 'approve', reviewer: 'Fixture', at, eventId: crypto.randomUUID(), source: 'Synthetic choice', notes: 'Synthetic only', canonHash: canonHash(p), identityVersion: p.identityVersion } });
  }
  const output = save(root, `influencers/alpha/work/${task.stepId}.md`, 'Synthetic document');
  const extra = task.expectedDelivery === 'review' ? { reviewer: 'Fixture', method: run.run.medium === 'image' || task.taskId === 'review-candidates' ? 'visual' : run.run.medium === 'audio' ? 'listening' : 'visual-and-audio', decision: 'approve', criticalIssues: [], limitations: [], media: [...run.run.attempts.at(-1).results].reverse().find(r => r.evidence?.type === 'generated').outputs } : {};
  return transitionRun(root, run.runId, { action: 'complete', outputs: task.expectedDelivery === 'delivery' ? [...run.run.attempts.at(-1).results].reverse().find(r => r.evidence?.type === 'generated').outputs.map(o => o.path) : [output], evidence: evidence(task.evidenceType, extra) });
}
export function reach(root, run) { while (!['generate-candidates', 'generate-piece'].includes(run.nextTask.taskId)) run = next(root, run); return run; }
export function planFor(root, run, { voice = 'not-required', futureVoice = false } = {}) {
  const stages = run.run.contract.workflow.steps.filter(step => ['generate-candidates', 'generate-piece'].includes(step.task)).map(step => ({ id: step.id, stepId: step.id, purpose: `Synthetic ${step.id} stage`, medium: step.task === 'generate-candidates' ? 'image' : run.run.medium, provider: 'fixture', method: 'Selected synthetic method', module: 'synthetic-module', route: 'fixture', tool: 'synthetic-tool', requestedModel: null, inputSlots: [{ id: 'prompt', kind: 'prompt', role: null, order: null, fromStageId: null }, { id: 'parameters', kind: 'parameters', role: null, order: null, fromStageId: null }] }));
  const creation = run.run.workflowId === 'create-character';
  if (voice === 'reuse' || futureVoice) stages.splice(creation ? 1 : 0, 0, { id: 'voice-reference', stepId: null, purpose: 'Selected vocal reference', medium: 'audio', provider: 'fixture', method: 'Synthetic reference voice', module: 'voice-module', route: 'fixture', tool: 'synthetic-tool', requestedModel: null, inputSlots: [{ id: 'voice', kind: 'reference', role: 'voice', order: 0, fromStageId: null }] });
  if (voice === 'reuse') for (const stage of stages.filter(s => s.stepId !== null && ['video', 'audio'].includes(s.medium))) stage.inputSlots.push({ id: 'voice', kind: 'reference', role: 'voice', order: 0, fromStageId: null });
  const execution = stages.filter(s => s.stepId !== null);
  const ids = creation ? ['visual-exploration', 'premise-scene', 'reference-pack', 'voice', 'pilot'] : ['scene-inputs', 'voice', 'final-media'];
  return { schemaVersion: 1, methodSource: { path: 'work/method-v001.md', sha256: hash(fs.readFileSync(path.join(root, 'work/method-v001.md'))) }, choice: decision(), requirements: ids.map(id => ({ id, applicability: id === 'voice' ? futureVoice ? 'required' : voice : 'required', reason: id === 'voice' && !futureVoice ? 'Explicit silent piece or exact selected voice reuse.' : null, decision: decision(), stageIds: id === 'voice' ? futureVoice || voice === 'reuse' ? ['voice-reference'] : [] : [id === 'pilot' || id === 'final-media' ? execution.at(-1).id : execution[0].id] })), stages };
}
const exposure = destination => ({ exposed: false, value: null, reason: `Synthetic route does not expose ${destination ? 'destination' : 'model'}.`, provenance: provenance() });
const quoteFor = scopeHash => ({ status: 'known', amount: 1, unit: { kind: 'credits', code: 'fixture' }, scopeHash, source: 'Synthetic checked quote', at, expiresAt: null, reason: null });
export const grant = (scopeHash, quotes, stageIds, maximum = 100) => ({ approved: true, scopeHash, quoteHashes: quotes.map(readinessHash), stageIds, limits: [{ unit: { kind: 'credits', code: 'fixture' }, maximum }], acceptUnknownCost: [], provenance: provenance() });
export function recordFor(root, run, plan, currentOnly = false) {
  const stages = [], feasibility = [];
  for (const stage of plan.stages) {
    const support = { model: exposure(false), destination: exposure(true), export: { available: true, tool: 'synthetic-export', route: 'fixture', format: stage.medium, originalBytes: true, limitations: [], provenance: provenance() }, inspection: { available: true, tool: 'synthetic-inspection', method: { image: 'visual', audio: 'listening', video: 'visual-and-audio' }[stage.medium], limitations: [], provenance: provenance() }, limitations: [], provenance: provenance() };
    const f = { stageId: stage.id, access: { available: true, provenance: provenance() }, acceptedInputSlots: stage.inputSlots.map(slot => ({ slotId: slot.id, supported: true, provenance: provenance() })), ...clone(support), quote: null };
    f.quote = quoteFor(mediaReadinessHashes(run.run, plan, stage.id, f, 'feasibility').scopeHash); feasibility.push(f);
    const inputs = [];
    if (!currentOnly || stage.stepId === run.nextTask.stepId) for (const slot of stage.inputSlots) {
      const relative = slot.kind === 'reference' ? 'influencers/alpha/references/voice.wav' : `work/${stage.id}-${slot.id}.json`;
      if (slot.kind !== 'reference') save(root, relative, { synthetic: stage.id, slot: slot.id });
      if (fs.existsSync(path.join(root, relative))) { const bytes = fs.readFileSync(path.join(root, relative)); inputs.push({ slotId: slot.id, path: relative, sha256: hash(bytes), bytes: bytes.length, referenceId: slot.kind === 'reference' ? 'voice' : null, role: slot.role, order: slot.order }); }
    }
    const entry = { stageId: stage.id, inputs, acceptedInputs: [], ...clone(support), quote: null, authorization: null, outcome: null };
    const scopeHash = mediaReadinessHashes(run.run, plan, stage.id, entry).scopeHash;
    entry.acceptedInputs = inputs.map(i => ({ slotId: i.slotId, sha256: i.sha256, bytes: i.bytes, inputId: `accepted-${stage.id}-${i.slotId}`, scopeHash, provenance: provenance() }));
    entry.quote = quoteFor(scopeHash); entry.authorization = grant(scopeHash, [entry.quote], [stage.id]);
    if (plan.requirements.some(r => r.applicability === 'reuse' && r.stageIds.includes(stage.id)) && inputs.length) entry.outcome = { status: 'reused', files: inputs.map(({ path, sha256, bytes }) => ({ path, sha256, bytes })), evidence: { type: 'reused', performed: true, provenance: provenance() }, review: { performed: true, method: 'listening', decision: 'approve', criticalIssues: [], limitations: [], provenance: provenance() } };
    stages.push(entry);
  }
  return { schemaVersion: 1, policy: 'stage-readiness-v1', runId: run.runId, attemptId: run.attemptId, plan, feasibility: { stages: feasibility, authorization: grant(mediaReadinessHashes(run.run, plan, null).pilotScopeHash, feasibility.map(f => f.quote), feasibility.map(f => f.stageId)) }, stages, provenance: provenance() };
}
export function rebind(run, record) {
  for (const f of record.feasibility.stages) if (f.quote) f.quote.scopeHash = mediaReadinessHashes(run.run, record.plan, f.stageId, f, 'feasibility').scopeHash;
  for (const e of record.stages) {
    const scope = mediaReadinessHashes(run.run, record.plan, e.stageId, e).scopeHash;
    for (const accepted of e.acceptedInputs) accepted.scopeHash = scope;
    if (e.quote) e.quote.scopeHash = scope;
    if (e.authorization) { e.authorization.scopeHash = scope; e.authorization.quoteHashes = e.quote ? [readinessHash(e.quote)] : []; }
  }
  if (record.feasibility.authorization) { record.feasibility.authorization.scopeHash = mediaReadinessHashes(run.run, record.plan, null).pilotScopeHash; record.feasibility.authorization.quoteHashes = record.feasibility.stages.filter(f => f.quote).map(f => readinessHash(f.quote)); }
  record.provenance = provenance(); return record;
}
export function importRecord(root, run, record) {
  const relative = save(root, `work/readiness-${crypto.randomUUID()}.json`, record);
  return transitionRun(root, run.runId, { action: 'record-media-readiness', readinessPath: relative });
}
export function generated(root, run, extra = {}) {
  const a = run.run.attempts.at(-1), capture = a.execution.mediaReadiness, stage = a.mediaReadiness.plan.stages.find(s => s.id === capture.stageId);
  const output = save(root, `influencers/alpha/media/${stage.id}.${stage.medium === 'image' ? 'png' : stage.medium === 'audio' ? 'wav' : 'mp4'}`, 'Synthetic extension only; not real generated media.');
  return transitionRun(root, run.runId, { action: 'complete', stageId: stage.id, outputs: [output], evidence: evidence('generated', { provider: 'fixture', tool: stage.tool, module: stage.module, route: stage.route, modelExposed: false, model: null, stageId: stage.id, planHash: capture.planHash, scopeHash: capture.scopeHash, readinessSnapshotId: capture.id, ...extra }) });
}
