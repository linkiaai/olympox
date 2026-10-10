import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { strictPath } from './reference-transfer-core.mjs';
import { isToken } from './language-compat.mjs';

export const MEDIA_READINESS_POLICY = 'stage-readiness-v1';
const generationTasks = new Set(['generate-candidates', 'generate-piece']);
const object = v => v !== null && typeof v === 'object' && !Array.isArray(v);
const clone = v => JSON.parse(JSON.stringify(v));
const stable = v => Array.isArray(v) ? v.map(stable) : object(v) ? Object.fromEntries(Object.keys(v).sort().map(k => [k, stable(v[k])])) : v;
export const readinessHash = v => crypto.createHash('sha256').update(JSON.stringify(stable(v))).digest('hex');
const digest = v => typeof v === 'string' && /^[a-f0-9]{64}$/.test(v);
const token = v => typeof v === 'string' && /^[a-z][a-z0-9-]{0,63}$/.test(v);
const text = v => typeof v === 'string' && v.trim().length > 0 && v.length <= 2048 && !/[\x00-\x1f\x7f]|https?:\/\/|\bBearer\s|\bAuthorization\s*:|[^\s@]+@[^\s@]+/i.test(v);
const date = v => {
  if (typeof v !== 'string' || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(v) || !Number.isFinite(Date.parse(v))) return false;
  return new Date(v).toISOString() === (v.includes('.') ? v : v.replace('Z', '.000Z'));
};
const method = medium => ({ image: 'visual', audio: 'listening', video: 'visual-and-audio' })[medium];
const activeAttempt = run => run.attempts.at(-1);
function need(ok, message) { if (!ok) throw new Error(`Media readiness: ${message}`); }
function exact(v, keys, label) { need(object(v) && Object.keys(v).sort().join(',') === [...keys].sort().join(','), `${label} has missing or unknown fields.`); }
function array(v, label, max = 64) { need(Array.isArray(v) && v.length <= max, `${label} must be a bounded list.`); }
function unique(v, label, predicate = token) { array(v, label); need(v.every(predicate) && new Set(v).size === v.length, `${label} contains invalid or duplicate values.`); }
function strings(v, label) { array(v, label); need(v.every(text), `${label} requires sanitized text.`); }
function provenance(v, explicit = false) {
  exact(v, ['actor', 'at', 'eventId', 'source', 'notes', ...(explicit ? ['explicit'] : [])], 'provenance');
  need(['actor', 'eventId', 'source', 'notes'].every(k => text(v[k])) && date(v.at) && (!explicit || v.explicit === true), 'provenance needs actual sanitized actor/date/event/source/notes.');
}
function nullable(v, validate) { if (v !== null) validate(v); }
function currentMedium(run, task) { return activeAttempt(run).mediaProviders && task.id === 'generate-candidates' ? 'image' : run.medium; }
export function mediaReadinessPolicy(task) {
  if (!generationTasks.has(task.id)) return false;
  need(task.version === '0.3.0' && task.mediaReadinessPolicy === MEDIA_READINESS_POLICY || ['0.1.0', '0.2.0'].includes(task.version) && task.mediaReadinessPolicy === undefined, 'generation mediaReadinessPolicy must be stage-readiness-v1 for the updated task version.');
  return task.mediaReadinessPolicy === MEDIA_READINESS_POLICY;
}
export function readinessEnabled(run) { return run.contract.workflow.steps.some(s => mediaReadinessPolicy(run.contract.tasks[s.task])); }

export function readinessPath(root, relative, personaId, missing = false) {
  need(typeof relative === 'string' && relative.length <= 512, 'use a bounded relative source path.');
  const parts = relative.split('/');
  const allowed = parts[0] === 'work' && !['runs', 'maintenance'].includes(parts[1]) || personaId && parts[0] === 'influencers' && parts[1] === personaId;
  need(allowed && parts.every(p => !/^(\.git|\.agents|\.codex|\.claude|\.aws|tools|node_modules|\.reference-transfers|credentials|\.env(?:\..*)?)$/i.test(p)), 'source must remain in studio work or the bound character, excluding private tooling/configuration and other characters.');
  return strictPath(root, relative, 'file', missing);
}
export function preflightReadinessRun(root, runId = null) {
  strictPath(root, 'work/runs', 'directory', true);
  if (runId) {
    need(/^run-[a-f0-9-]{36}$/.test(runId), 'invalid run ID.');
    strictPath(root, `work/runs/${runId}.json`);
    strictPath(root, `work/runs/${runId}.lock`, 'file', true);
  }
}
export function readReadinessJson(root, relative, personaId) {
  const target = readinessPath(root, relative, personaId);
  need(path.extname(relative).toLowerCase() === '.json' && fs.statSync(target).size <= 1024 * 1024, 'metadata must be a JSON file no larger than 1 MiB.');
  const bytes = fs.readFileSync(target);
  need(bytes.length <= 1024 * 1024, 'metadata exceeds 1 MiB.');
  let value; try { value = JSON.parse(bytes.toString('utf8').replace(/^\uFEFF/, '')); } catch { need(false, 'invalid JSON metadata.'); }
  return { value, sha256: crypto.createHash('sha256').update(bytes).digest('hex') };
}
export function hashFileChunks(target) {
  const fd = fs.openSync(target, 'r');
  try {
    const before = fs.fstatSync(fd), buffer = Buffer.alloc(1024 * 1024), h = crypto.createHash('sha256');
    let size = 0, length;
    while ((length = fs.readSync(fd, buffer, 0, buffer.length, null))) { size += length; h.update(buffer.subarray(0, length)); }
    const after = fs.fstatSync(fd);
    need(before.isFile() && size === after.size && before.size === after.size && before.mtimeMs === after.mtimeMs, 'source changed while hashing.');
    return { sha256: h.digest('hex'), bytes: size };
  } finally { fs.closeSync(fd); }
}
function sourceFile(root, input, personaId) {
  const actual = hashFileChunks(readinessPath(root, input.path, personaId));
  need(actual.sha256 === input.sha256 && (input.bytes === undefined || actual.bytes === input.bytes), 'source bytes/hash changed; review context and use an explicit new attempt.');
}
function planStages(run) {
  return run.contract.workflow.steps.filter(s => generationTasks.has(s.task)).map(s => ({ stepId: s.id, medium: currentMedium(run, run.contract.tasks[s.task]) }));
}
export function validateReadinessPlan(plan, run, root) {
  exact(plan, ['schemaVersion', 'methodSource', 'choice', 'requirements', 'stages'], 'plan'); need(plan.schemaVersion === 1, 'plan schemaVersion must be 1.');
  exact(plan.methodSource, ['path', 'sha256'], 'methodSource'); need(text(plan.methodSource.path) && digest(plan.methodSource.sha256), 'methodSource requires exact path/hash.'); provenance(plan.choice, true);
  array(plan.stages, 'stages', 32); array(plan.requirements, 'requirements');
  unique(plan.stages.map(s => s.id), 'stage IDs'); unique(plan.requirements.map(r => r.id), 'requirement IDs');
  for (const stage of plan.stages) {
    exact(stage, ['id', 'stepId', 'purpose', 'medium', 'provider', 'method', 'module', 'route', 'tool', 'requestedModel', 'inputSlots'], 'plan stage');
    need((stage.stepId === null || token(stage.stepId)) && text(stage.purpose) && ['image', 'video', 'audio'].includes(stage.medium) && token(stage.provider) && text(stage.method), 'invalid stage identity/method/medium/provider.');
    for (const key of ['module', 'route', 'tool', 'requestedModel']) need(stage[key] === null || text(stage[key]), `stage ${key} must be checked text or null.`);
    need(stage.provider !== 'integrated-images' || stage.medium === 'image', 'integrated-images cannot supply audio/video.');
    array(stage.inputSlots, 'inputSlots'); unique(stage.inputSlots.map(s => s.id), 'slot IDs');
    for (const slot of stage.inputSlots) {
      exact(slot, ['id', 'kind', 'role', 'order', 'fromStageId'], 'input slot');
      need(['prompt', 'parameters', 'reference'].includes(slot.kind) && (slot.fromStageId === null || token(slot.fromStageId)), 'invalid slot kind/dependency.');
      need(slot.kind === 'reference' ? token(slot.role) && Number.isInteger(slot.order) && slot.order >= 0 && slot.order < 64 : slot.role === null && slot.order === null, 'slot reference role/order mismatch.');
      if (slot.fromStageId !== null) need(plan.stages.findIndex(s => s.id === slot.fromStageId) >= 0 && plan.stages.findIndex(s => s.id === slot.fromStageId) < plan.stages.indexOf(stage), 'dependencies must name an earlier stage; cycles are refused.');
    }
    if (stage.stepId !== null) {
      const mapped = planStages(run).find(s => s.stepId === stage.stepId);
      need(mapped && mapped.medium === stage.medium && stage.provider === activeAttempt(run).mediaProviders?.[stage.medium], 'execution stage must match captured step/medium/provider.');
      need(stage.inputSlots.some(s => s.kind === 'prompt') && stage.inputSlots.some(s => s.kind === 'parameters'), 'execution stage requires prompt and parameter slots.');
    }
  }
  for (const expected of planStages(run)) need(plan.stages.filter(s => s.stepId === expected.stepId).length === 1, 'each captured generation step requires exactly one execution stage.');
  for (const requirement of plan.requirements) {
    exact(requirement, ['id', 'applicability', 'reason', 'decision', 'stageIds'], 'requirement');
    need(['required', 'reuse', 'not-required'].includes(requirement.applicability) && (requirement.reason === null || text(requirement.reason)), 'invalid requirement applicability/reason.');
    unique(requirement.stageIds, 'covering stage IDs'); need(requirement.stageIds.every(id => plan.stages.some(s => s.id === id)), 'requirement references unknown stage.');
    nullable(requirement.decision, v => provenance(v, true));
    if (requirement.applicability !== 'required') need(text(requirement.reason) && requirement.decision !== null, 'reuse/omission needs actual explicit decision and reason.');
    if (requirement.applicability === 'not-required') need(requirement.stageIds.length === 0, 'not-required cannot cover an execution stage.');
    if (requirement.applicability === 'reuse') need(requirement.stageIds.every(id => plan.stages.find(s => s.id === id).stepId === null), 'required execution stages cannot be declared reused.');
  }
  if (root) sourceFile(root, plan.methodSource, run.personaId);
  return readinessHash(plan);
}
function exposure(v, destination = false) {
  exact(v, ['exposed', 'value', 'reason', 'provenance'], destination ? 'destination' : 'model'); need(typeof v.exposed === 'boolean' && (v.reason === null || text(v.reason)), 'invalid exposure declaration.'); provenance(v.provenance);
  if (!v.exposed) need(v.value === null && text(v.reason), 'non-exposure needs null value and actual reason.');
  else if (destination) { exact(v.value, ['accountFingerprint', 'workspaceId'], 'destination value'); need(digest(v.value.accountFingerprint) && text(v.value.workspaceId), 'invalid checked destination.'); }
  else need(text(v.value), 'exposed model must name its value.');
}
function unit(v) {
  exact(v, ['kind', 'code'], 'unit'); need(['credits', 'currency', 'free'].includes(v.kind), 'invalid quote unit.');
  need(v.kind === 'free' ? v.code === null : v.kind === 'currency' ? typeof v.code === 'string' && /^[A-Z]{3}$/.test(v.code) : token(v.code), 'invalid unit code.');
}
function quote(v) {
  exact(v, ['status', 'amount', 'unit', 'scopeHash', 'source', 'at', 'expiresAt', 'reason'], 'quote');
  need(['known', 'unknown'].includes(v.status) && digest(v.scopeHash) && text(v.source) && date(v.at) && (v.expiresAt === null || date(v.expiresAt)) && (v.reason === null || text(v.reason)), 'invalid scoped quote.');
  nullable(v.unit, unit);
  need(v.status === 'known' ? Number.isFinite(v.amount) && v.amount >= 0 && v.unit !== null : v.amount === null && text(v.reason), 'known cost needs amount/unit; unknown cost needs null amount and reason.');
  need(v.unit?.kind !== 'free' || v.status === 'known' && v.amount === 0, 'free requires observed known zero.');
  need(v.expiresAt === null || Date.parse(v.expiresAt) >= Date.parse(v.at), 'quote expiry precedes its observation.');
}
function authorization(v) {
  exact(v, ['approved', 'scopeHash', 'quoteHashes', 'stageIds', 'limits', 'acceptUnknownCost', 'provenance'], 'authorization');
  need(typeof v.approved === 'boolean' && digest(v.scopeHash), 'invalid applicable authorization.');
  unique(v.quoteHashes, 'quote hashes', digest); unique(v.stageIds, 'authorized stages'); unique(v.acceptUnknownCost, 'unknown-cost stages'); provenance(v.provenance);
  array(v.limits, 'limits');
  for (const limit of v.limits) { exact(limit, ['unit', 'maximum'], 'limit'); unit(limit.unit); need(Number.isFinite(limit.maximum) && limit.maximum >= 0, 'limit must be finite/nonnegative.'); }
  need(new Set(v.limits.map(l => readinessHash(l.unit))).size === v.limits.length, 'duplicate unit limits.');
}
function support(v, inspection, medium) {
  exact(v, inspection ? ['available', 'tool', 'method', 'limitations', 'provenance'] : ['available', 'tool', 'route', 'format', 'originalBytes', 'limitations', 'provenance'], inspection ? 'inspection' : 'export');
  need(typeof v.available === 'boolean' && text(v.tool), 'support needs observed availability/tool.'); strings(v.limitations, 'support limitations'); provenance(v.provenance);
  need(inspection ? ['visual', 'listening', 'visual-and-audio'].includes(v.method) : text(v.route) && text(v.format) && typeof v.originalBytes === 'boolean', 'invalid complete media support declaration.');
}
function input(v, stage) {
  exact(v, ['slotId', 'path', 'sha256', 'bytes', 'referenceId', 'role', 'order'], 'exact input');
  const slot = stage.inputSlots.find(s => s.id === v.slotId);
  need(slot && text(v.path) && digest(v.sha256) && Number.isSafeInteger(v.bytes) && v.bytes > 0, 'invalid exact input/slot/digest/bytes.');
  need(slot.kind === 'reference' ? text(v.referenceId) && v.role === slot.role && v.order === slot.order : v.referenceId === null && v.role === null && v.order === null, 'exact input role/order/reference mismatch.');
}
function observation(v, stage, feasibility) {
  exact(v, feasibility ? ['stageId', 'access', 'acceptedInputSlots', 'destination', 'model', 'quote', 'export', 'inspection', 'limitations', 'provenance'] : ['stageId', 'inputs', 'acceptedInputs', 'model', 'destination', 'quote', 'authorization', 'export', 'inspection', 'limitations', 'outcome', 'provenance'], 'stage observation');
  strings(v.limitations, 'stage limitations'); provenance(v.provenance); nullable(v.destination, d => exposure(d, true)); nullable(v.model, m => exposure(m)); nullable(v.quote, quote);
  nullable(v.export, e => support(e, false, stage.medium)); nullable(v.inspection, i => support(i, true, stage.medium));
  if (feasibility) {
    nullable(v.access, a => { exact(a, ['available', 'provenance'], 'access'); need(typeof a.available === 'boolean', 'access availability must be declared.'); provenance(a.provenance); });
    array(v.acceptedInputSlots, 'accepted input slots'); unique(v.acceptedInputSlots.map(i => i.slotId), 'accepted slot IDs');
    for (const accepted of v.acceptedInputSlots) { exact(accepted, ['slotId', 'supported', 'provenance'], 'accepted slot'); need(stage.inputSlots.some(s => s.id === accepted.slotId) && typeof accepted.supported === 'boolean', 'unknown/invalid accepted input slot.'); provenance(accepted.provenance); }
  } else {
    array(v.inputs, 'exact inputs'); array(v.acceptedInputs, 'accepted inputs'); unique(v.inputs.map(i => i.slotId), 'exact slot IDs'); unique(v.acceptedInputs.map(i => i.slotId), 'attachment slot IDs');
    for (const i of v.inputs) input(i, stage);
    for (const accepted of v.acceptedInputs) { exact(accepted, ['slotId', 'sha256', 'bytes', 'inputId', 'scopeHash', 'provenance'], 'accepted input'); need(stage.inputSlots.some(s => s.id === accepted.slotId) && digest(accepted.sha256) && Number.isSafeInteger(accepted.bytes) && accepted.bytes > 0 && text(accepted.inputId) && digest(accepted.scopeHash), 'invalid exact accepted attachment.'); provenance(accepted.provenance); }
    nullable(v.authorization, authorization);
    nullable(v.outcome, o => {
      exact(o, ['status', 'files', 'evidence', 'review'], 'outcome'); need(['completed', 'reused'].includes(o.status), 'unknown outcome status.'); array(o.files, 'outcome files');
      for (const f of o.files) { exact(f, ['path', 'sha256', 'bytes'], 'outcome file'); need(text(f.path) && digest(f.sha256) && Number.isSafeInteger(f.bytes) && f.bytes > 0, 'invalid outcome bytes.'); }
      need(o.files.length > 0, 'outcome requires actual files.'); exact(o.evidence, ['type', 'performed', 'provenance'], 'outcome evidence'); need(o.evidence.performed === true && o.evidence.type === (o.status === 'reused' ? 'reused' : 'generated'), 'invalid declared outcome evidence.'); provenance(o.evidence.provenance);
      exact(o.review, ['performed', 'method', 'decision', 'criticalIssues', 'limitations', 'provenance'], 'outcome review'); need(o.review.performed === true && o.review.method === method(stage.medium) && o.review.decision === 'approve' && Array.isArray(o.review.criticalIssues) && !o.review.criticalIssues.length && Array.isArray(o.review.limitations) && !o.review.limitations.length, 'outcome requires complete approved review.'); provenance(o.review.provenance);
    });
  }
}
const binding = v => v ? { exposed: v.exposed, value: v.value } : null;
export function mediaReadinessHashes(run, plan, stageId, observation = null, phase = 'execution') {
  const a = activeAttempt(run), planHash = readinessHash(plan), stage = plan.stages.find(s => s.id === stageId);
  const base = { policy: MEDIA_READINESS_POLICY, runId: run.id, attemptId: a.id, planHash };
  const completed = a.results.find(r => r.stepId === stage?.stepId)?.execution?.mediaReadiness;
  return {
    planHash, pilotScopeHash: readinessHash({ ...base, phase: 'pilot' }),
    scopeHash: readinessHash(phase === 'feasibility' ? { ...base, stageId, phase, model: binding(observation?.model), destination: binding(observation?.destination) } : { ...base, stageId, phase: 'execution', canonBinding: completed ? completed.canonBinding : run.canonBinding, currentStage: stage, model: binding(observation?.model), destination: binding(observation?.destination), inputs: stage?.inputSlots.flatMap(s => observation?.inputs?.filter(i => i.slotId === s.id) ?? []) ?? [] })
  };
}
export function validateReadinessRecord(record, run, root) {
  exact(record, ['schemaVersion', 'policy', 'runId', 'attemptId', 'plan', 'feasibility', 'stages', 'provenance'], 'readiness envelope');
  need(record.schemaVersion === 1 && record.policy === MEDIA_READINESS_POLICY && record.runId === run.id && record.attemptId === activeAttempt(run).id, 'record must match current run/attempt/policy.');
  need(Buffer.byteLength(JSON.stringify(record)) <= 1024 * 1024, 'readiness metadata exceeds 1 MiB.'); provenance(record.provenance);
  validateReadinessPlan(record.plan, run, root); exact(record.feasibility, ['stages', 'authorization'], 'feasibility'); nullable(record.feasibility.authorization, authorization);
  for (const [entries, feasibility] of [[record.feasibility.stages, true], [record.stages, false]]) {
    array(entries, 'observations', 32); unique(entries.map(s => s.stageId), 'observed stage IDs');
    for (const entry of entries) {
      const stage = record.plan.stages.find(s => s.id === entry.stageId); need(stage, 'observation references unknown stage.'); observation(entry, stage, feasibility);
      const hashes = mediaReadinessHashes(run, record.plan, stage.id, entry, feasibility ? 'feasibility' : 'execution');
      if (entry.quote) need(entry.quote.scopeHash === hashes.scopeHash, 'quote scope does not match exact stage/context.');
      if (!feasibility) {
        for (const accepted of entry.acceptedInputs) { const i = entry.inputs.find(i => i.slotId === accepted.slotId); need(i && accepted.sha256 === i.sha256 && accepted.bytes === i.bytes && accepted.scopeHash === hashes.scopeHash, 'attachment acceptance does not match exact input/context.'); }
        if (entry.authorization) need(entry.authorization.scopeHash === hashes.scopeHash, 'authorization scope does not match exact stage/context.');
        if (root) for (const i of [...entry.inputs, ...(entry.outcome?.files ?? [])]) sourceFile(root, i, run.personaId);
      }
    }
  }
  if (record.feasibility.authorization) need(record.feasibility.authorization.scopeHash === mediaReadinessHashes(run, record.plan, null).pilotScopeHash, 'pilot authorization scope mismatch.');
  return record;
}

function merged(a) {
  const feasibility = new Map(), stages = new Map(); let authorization = null;
  for (const snapshot of a.mediaReadiness?.records ?? []) {
    for (const e of snapshot.record.feasibility.stages) feasibility.set(e.stageId, e);
    for (const e of snapshot.record.stages) stages.set(e.stageId, e);
    authorization = snapshot.record.feasibility.authorization;
  }
  return { feasibility, stages, authorization };
}
export function assertReadinessRefresh(a, incoming) {
  if (a.mediaReadiness) need(a.mediaReadiness.planHash === readinessHash(incoming.plan), 'immutable plan changed; use a new attempt with a reason.');
  const previous = merged(a);
  for (const [entries, oldMap] of [[incoming.feasibility.stages, previous.feasibility], [incoming.stages, previous.stages]]) {
    for (const entry of entries) {
      const old = oldMap.get(entry.stageId); if (!old) continue;
      for (const key of ['model', 'destination']) if (old[key]) need(entry[key] && readinessHash(binding(old[key])) === readinessHash(binding(entry[key])), `bound ${key} changed; use a new attempt.`);
      for (const input of old.inputs ?? []) need(entry.inputs.some(i => i.slotId === input.slotId && readinessHash(i) === readinessHash(input)), 'bound input changed or removed; use a new attempt.');
      if (old.outcome) {
        need(entry.outcome && readinessHash(entry.outcome) === readinessHash(old.outcome), 'declared outcome cannot be rewritten.');
        if (old.quote !== null) need(readinessHash(entry.quote) === readinessHash(old.quote), 'completed outcome quote cannot be replaced by a refreshed estimate.');
      }
    }
  }
  for (const entry of incoming.stages) { const f = incoming.feasibility.stages.find(s => s.stageId === entry.stageId) ?? previous.feasibility.get(entry.stageId); for (const key of ['model', 'destination']) if (entry[key] && f?.[key]) need(readinessHash(binding(entry[key])) === readinessHash(binding(f[key])), `current-stage ${key} differs from checked feasibility.`); }
}
function grantReasons(grant, scopeHash, quotes, stageIds, at) {
  const reasons = [];
  if (!grant || !grant.approved) return ['Applicable authorization remains pending.'];
  if (grant.scopeHash !== scopeHash || readinessHash([...grant.stageIds].sort()) !== readinessHash([...stageIds].sort()) || readinessHash([...grant.quoteHashes].sort()) !== readinessHash(quotes.map(q => readinessHash(q)).sort())) reasons.push('Authorization does not cover exact scope, stages and quote hashes.');
  const totals = new Map();
  for (let i = 0; i < quotes.length; i++) {
    const q = quotes[i];
    if (Date.parse(q.at) > Date.parse(at) || q.expiresAt && Date.parse(q.expiresAt) < Date.parse(at)) reasons.push(`Quote for ${stageIds[i]} is stale or not yet applicable.`);
    if (q.status === 'unknown' || q.unit === null) { if (!grant.acceptUnknownCost.includes(stageIds[i])) reasons.push(`Unknown cost for ${stageIds[i]} lacks scoped acceptance.`); }
    else if (q.unit.kind !== 'free') { const key = readinessHash(q.unit); totals.set(key, (totals.get(key) ?? 0) + q.amount); }
  }
  for (const [key, total] of totals) { const limit = grant.limits.find(l => readinessHash(l.unit) === key); if (!limit || total > limit.maximum) reasons.push('Known quoted cost exceeds or lacks its comparable unit limit.'); }
  if (Date.parse(grant.provenance.at) > Date.parse(at)) reasons.push('Authorization is not yet applicable.');
  return reasons;
}
function supportReasons(stage, entry) {
  const reasons = [];
  if (!stage.module || !stage.route || !stage.tool) reasons.push('Concrete module/route/tool remains pending in the immutable plan.');
  if (!entry?.model) reasons.push('Checked model exposure remains pending.');
  else if (stage.requestedModel !== null && (!entry.model.exposed || entry.model.value !== stage.requestedModel)) reasons.push('Model observation does not match requested model.');
  if (!entry?.destination || stage.route === 'native-cli' && !entry.destination.exposed) reasons.push('Checked destination identity/exposure remains pending.');
  if (!entry?.export?.available || !entry.export.originalBytes || entry.export.limitations.length) reasons.push('Original-byte export support remains pending.');
  if (!entry?.inspection?.available || entry.inspection.method !== method(stage.medium) || entry.inspection.limitations.length) reasons.push('Complete media inspection support remains pending.');
  if (entry?.limitations.length) reasons.push('Required stage has unresolved limitations.');
  return reasons;
}
function personaAt(root, run) {
  if (!root || !run.personaId) return null;
  const relative = `influencers/${run.personaId}/persona.json`;
  return JSON.parse(fs.readFileSync(readinessPath(root, relative, run.personaId), 'utf8').replace(/^\uFEFF/, ''));
}
function coverageReasons(plan, run, p, state) {
  const required = isToken(run.workflowId, 'create-character') ? ['visual-exploration', 'premise-scene', 'reference-pack', 'voice', 'pilot'] : ['scene-inputs', 'voice', 'final-media'];
  const reasons = [];
  for (const id of required) if (!plan.requirements.some(r => r.id === id)) reasons.push(`Required method coverage ${id} is missing.`);
  for (const r of plan.requirements) {
    if (r.applicability === 'required' && r.decision === null) reasons.push(`Required coverage ${r.id} still needs its actual method-choice decision.`);
    if (r.applicability !== 'not-required' && !r.stageIds.length) reasons.push(`Required coverage ${r.id} has no supporting stage.`);
    if (r.id === 'voice' && r.applicability === 'not-required' && p?.voice?.applicability !== 'silent' && (isToken(run.workflowId, 'create-character') || Object.hasOwn(p?.voice ?? {}, 'applicability') || !p || isToken(p.status, 'draft'))) reasons.push('Voice N/A requires silent scope or an explicitly chosen static piece under compatible historical canon.');
    if (r.applicability === 'reuse') for (const id of r.stageIds) {
      const entry = state.stages.get(id);
      if (entry?.outcome?.status !== 'reused') reasons.push(`Reuse ${r.id} requires exact existing outcome and reviewed context.`);
      if (r.id === 'voice') {
        const ref = p?.references?.find(ref => ref.id === p.voice?.referenceId && ref.role === 'voice' && isToken(ref.status, 'approved'));
        const selectedPath = ref && `influencers/${p.id}/${ref.path}`;
        const matched = file => ref && file.path === selectedPath && file.sha256 === ref.sha256;
        if (!ref || !/\.(wav|mp3|m4a|ogg|flac)$/i.test(ref.path) || !entry?.outcome?.files.some(matched)) reasons.push('Voice reuse must bind the exact selected approved audio reference outcome.');
      }
    }
  }
  return reasons;
}
export function evaluateMediaReadiness(root, run, { at = new Date().toISOString(), captured = null } = {}) {
  const a = activeAttempt(run), stored = a.mediaReadiness;
  if (!stored) return { pipelineReady: false, currentStageReady: false, canStartStage: false, planHash: null, currentStageId: null, reasons: ['Record a structured media readiness plan and observations for the selected method.'], stages: [], activeSnapshot: a.execution?.mediaReadiness?.id ?? null };
  const plan = stored.plan, state = merged(a), p = personaAt(root, run), current = run.contract.workflow.steps[a.stepIndex];
  const coverage = coverageReasons(plan, run, p, state), requiredIds = [...new Set([...plan.stages.filter(s => s.stepId !== null).map(s => s.id), ...plan.requirements.filter(r => r.applicability !== 'not-required').flatMap(r => r.stageIds)])];
  const feasibilityReasons = [...coverage], quotes = [];
  for (const id of requiredIds) {
    const stage = plan.stages.find(s => s.id === id), f = state.feasibility.get(id), reasons = supportReasons(stage, f);
    if (!f?.access?.available) reasons.push('Exact module access remains pending.');
    for (const slot of stage.inputSlots) if (!f?.acceptedInputSlots.some(i => i.slotId === slot.id && i.supported)) reasons.push(`Accepted schema for slot ${slot.id} remains pending.`);
    const scopedQuote = captured?.feasibilityQuotes.find(q => q.stageId === id)?.quote ?? f?.quote;
    if (!scopedQuote) reasons.push('Whole-plan stage quote/uncertainty remains pending.'); else quotes.push(scopedQuote);
    feasibilityReasons.push(...reasons.map(reason => `${id}: ${reason}`));
  }
  if (quotes.length === requiredIds.length) feasibilityReasons.push(...grantReasons(captured?.pilotAuthorization ?? state.authorization, mediaReadinessHashes(run, plan, null).pilotScopeHash, quotes, requiredIds, captured?.startedAt ?? at));
  else feasibilityReasons.push('Whole-pilot authorization cannot cover missing stage quotes.');
  const stageStatuses = plan.stages.map(stage => {
    const entry = state.stages.get(stage.id), f = state.feasibility.get(stage.id), reasons = supportReasons(stage, entry);
    const hashes = mediaReadinessHashes(run, plan, stage.id, entry);
    for (const slot of stage.inputSlots) {
      const i = entry?.inputs.find(i => i.slotId === slot.id), accepted = entry?.acceptedInputs.find(i => i.slotId === slot.id);
      if (!i) reasons.push(`Exact input slot ${slot.id} is pending.`);
      else if (root) {
        try {
          sourceFile(root, i, run.personaId);
          if (slot.kind === 'reference' && p && !isToken(p.status, 'draft')) { const ref = p.references.find(r => r.id === i.referenceId && isToken(r.status, 'approved')); need(ref && i.path === `influencers/${p.id}/${ref.path}` && i.sha256 === ref.sha256 && i.role === ref.role, 'canonical reference does not match selected approved bytes/role.'); if (stage.medium === 'audio' || slot.role === 'voice') need(ref.id === p.voice.referenceId, 'speech must use selected canonical voice.'); }
        } catch (error) { reasons.push(error.message); }
      }
      if (i && slot.fromStageId !== null) {
        const upstream = state.stages.get(slot.fromStageId)?.outcome?.files ?? a.results.find(r => r.execution?.mediaReadiness?.stageId === slot.fromStageId)?.outputs ?? [];
        if (!upstream.some(file => file.path === i.path && file.sha256 === i.sha256)) reasons.push(`Input ${slot.id} does not bind the declared upstream stage outcome.`);
      }
      if (!accepted || !i || accepted.sha256 !== i.sha256 || accepted.bytes !== i.bytes || accepted.scopeHash !== hashes.scopeHash) reasons.push(`Exact accepted attachment for ${slot.id} remains pending or mismatched.`);
    }
    const voice = plan.requirements.find(r => r.id === 'voice');
    if (stage.stepId !== null && ['video', 'audio'].includes(stage.medium) && voice?.applicability !== 'not-required' && p && !isToken(p.status, 'draft')) {
      const ref = p.references.find(r => r.id === p.voice?.referenceId && r.role === 'voice' && isToken(r.status, 'approved'));
      if (!ref || !entry?.inputs.some(i => i.referenceId === ref.id && i.role === 'voice' && i.path === `influencers/${p.id}/${ref.path}` && i.sha256 === ref.sha256)) reasons.push('Speaking execution requires its selected approved canonical audio attachment.');
    }
    for (const key of ['model', 'destination']) if (!entry?.[key] || !f?.[key] || readinessHash(binding(entry[key])) !== readinessHash(binding(f[key]))) reasons.push(`${key} must match whole-plan checked context.`);
    if (!entry?.quote || entry.quote.scopeHash !== hashes.scopeHash) reasons.push('Exact-stage quote scope remains pending or mismatched.');
    else reasons.push(...grantReasons(captured?.stageId === stage.id ? captured.authorization : entry.authorization, hashes.scopeHash, [captured?.stageId === stage.id ? captured.quote : entry.quote], [stage.id], captured?.startedAt ?? at));
    if (stage.medium === 'audio' && p?.voice.applicability === 'silent') reasons.push('Silent canon does not permit speech production.');
    return { stageId: stage.id, stepId: stage.stepId, ready: !reasons.length, scopeHash: hashes.scopeHash, reasons, outcome: entry?.outcome ?? null };
  });
  const currentStage = stageStatuses.find(s => s.stepId === current?.id), allReasons = [...feasibilityReasons, ...(currentStage?.reasons ?? ['Current execution stage is not mapped.'])];
  const currentQuote = captured?.quote ?? state.stages.get(currentStage?.stageId)?.quote;
  if (currentQuote) {
    const substituted = requiredIds.map((id, i) => {
      const completedQuote = a.results.find(r => r.execution?.mediaReadiness?.stageId === id)?.execution.mediaReadiness.quote;
      const observation = state.stages.get(id), stage = plan.stages.find(s => s.id === id);
      if (stage.stepId === null && observation?.outcome) {
        if (!observation.quote) allReasons.push(`${id}: Completed auxiliary actual cost remains pending; a feasibility estimate cannot replace it.`);
        return observation.quote;
      }
      const outcomeQuote = observation?.outcome ? observation.quote : null;
      return id === currentStage?.stageId ? currentQuote : completedQuote ?? outcomeQuote ?? quotes[i];
    }).filter(Boolean);
    if (substituted.length === requiredIds.length) {
      const pilot = captured?.pilotAuthorization ?? state.authorization;
      const totals = new Map();
      for (let i = 0; i < substituted.length; i++) {
        const q = substituted[i];
        if (q.status === 'unknown' || q.unit === null) { if (!pilot?.acceptUnknownCost.includes(requiredIds[i])) allReasons.push('Current-stage unknown cost lacks whole-pilot scoped acceptance.'); }
        else if (q.unit.kind !== 'free') { const key = readinessHash(q.unit); totals.set(key, (totals.get(key) ?? 0) + q.amount); }
      }
      for (const [key, total] of totals) { const limit = pilot?.limits.find(l => readinessHash(l.unit) === key); if (!limit || total > limit.maximum) allReasons.push('Current-stage cost and remaining known quotes exceed or lack the comparable whole-pilot limit.'); }
    }
  }
  if (root) try { sourceFile(root, plan.methodSource, run.personaId); } catch (error) { allReasons.push(error.message); }
  return { pipelineReady: !feasibilityReasons.length, currentStageReady: !!currentStage?.ready, canStartStage: !allReasons.length, planHash: stored.planHash, currentStageId: currentStage?.stageId ?? null, reasons: allReasons, feasibilityReasons, stages: stageStatuses, activeSnapshot: a.execution?.mediaReadiness?.id ?? null };
}
export function captureMediaReadiness(run, stageId, startedAt) {
  const a = activeAttempt(run), state = merged(a), entry = state.stages.get(stageId), hashes = mediaReadinessHashes(run, a.mediaReadiness.plan, stageId, entry);
  const payload = { stageId, planHash: hashes.planHash, scopeHash: hashes.scopeHash, canonBinding: clone(run.canonBinding), inputs: clone(entry.inputs), quote: clone(entry.quote), authorization: clone(entry.authorization), feasibilityQuotes: [...state.feasibility.values()].filter(f => f.quote).map(f => ({ stageId: f.stageId, quote: clone(f.quote) })), pilotAuthorization: clone(state.authorization), startedAt, recordId: a.mediaReadiness.records.at(-1).id };
  return { ...payload, id: readinessHash(payload) };
}
export function assertMediaReadinessCompletion(run, options) {
  const a = activeAttempt(run), captured = a.execution?.mediaReadiness;
  need(captured, 'complete requires the captured readiness snapshot from an earlier matching start.');
  const stage = a.mediaReadiness.plan.stages.find(s => s.id === captured.stageId), e = options.evidence;
  exact(e, ['type', 'performed', 'actor', 'at', 'eventId', 'notes', 'tool', 'provider', 'stageId', 'planHash', 'scopeHash', 'readinessSnapshotId', 'module', 'route', 'modelExposed', 'model'], 'current generated evidence');
  need(e.type === 'generated' && e.performed === true && ['actor', 'eventId', 'notes', 'tool', 'provider', 'stageId', 'module', 'route'].every(key => text(e[key])) && date(e.at) && ['planHash', 'scopeHash', 'readinessSnapshotId'].every(key => digest(e[key])) && typeof e.modelExposed === 'boolean' && (e.modelExposed ? text(e.model) : e.model === null), 'current generated evidence requires bounded sanitized actual stage provenance.');
  const observed = merged(a).stages.get(stage.id);
  need(options.stageId === stage.id && e?.stageId === stage.id && e.planHash === captured.planHash && e.scopeHash === captured.scopeHash && e.readinessSnapshotId === captured.id, 'generation evidence must match captured stage/plan/scope/snapshot.');
  need(e.provider === stage.provider && e.tool === stage.tool && e.module === stage.module && e.route === stage.route && e.modelExposed === observed.model.exposed && e.model === observed.model.value, 'generation evidence must match actual provider/tool/module/route/model exposure.');
  return captured;
}

export function validateSavedReadiness(run) {
  for (const a of run.attempts) {
    if (a.mediaReadiness === undefined) continue;
    need(readinessEnabled(run), 'legacy captured contracts cannot acquire the current readiness action.');
    exact(a.mediaReadiness, ['plan', 'planHash', 'records'], 'saved readiness');
    const context = { ...run, attempts: [a] };
    need(a.mediaReadiness.planHash === validateReadinessPlan(a.mediaReadiness.plan, context), 'saved plan hash mismatch.');
    array(a.mediaReadiness.records, 'saved snapshots', 256);
    for (const snapshot of a.mediaReadiness.records) {
      exact(snapshot, ['id', 'sourcePath', 'sourceSha256', 'importedAt', 'canonBinding', 'record'], 'saved snapshot');
      const { id, ...payload } = snapshot;
      need(digest(id) && readinessHash(payload) === id && digest(snapshot.sourceSha256) && date(snapshot.importedAt), 'saved snapshot hash/provenance mismatch.');
      validateReadinessRecord(snapshot.record, { ...context, canonBinding: snapshot.canonBinding });
      need(readinessHash(snapshot.record.plan) === a.mediaReadiness.planHash, 'saved snapshot replaced its plan.');
    }
    for (const captured of [a.execution?.mediaReadiness, ...a.results.map(r => r.execution?.mediaReadiness)].filter(Boolean)) {
      exact(captured, ['id', 'stageId', 'planHash', 'scopeHash', 'canonBinding', 'inputs', 'quote', 'authorization', 'feasibilityQuotes', 'pilotAuthorization', 'startedAt', 'recordId'], 'captured start');
      const { id, ...payload } = captured;
      need(digest(id) && id === readinessHash(payload) && date(captured.startedAt) && captured.planHash === a.mediaReadiness.planHash && a.mediaReadiness.records.some(s => s.id === captured.recordId), 'captured start identity/hash/source mismatch.');
      const sourceIndex = a.mediaReadiness.records.findIndex(s => s.id === captured.recordId);
      const source = merged({ mediaReadiness: { records: a.mediaReadiness.records.slice(0, sourceIndex + 1) } });
      const observation = source.stages.get(captured.stageId);
      need(observation && captured.scopeHash === mediaReadinessHashes({ ...context, canonBinding: captured.canonBinding }, a.mediaReadiness.plan, captured.stageId, observation).scopeHash && readinessHash(captured.inputs) === readinessHash(observation.inputs) && readinessHash(captured.quote) === readinessHash(observation.quote) && readinessHash(captured.authorization) === readinessHash(observation.authorization) && readinessHash(captured.pilotAuthorization) === readinessHash(source.authorization) && readinessHash(captured.feasibilityQuotes) === readinessHash([...source.feasibility.values()].filter(f => f.quote).map(f => ({ stageId: f.stageId, quote: f.quote }))), 'captured start does not match its exact source observation.');
    }
  }
  return true;
}
