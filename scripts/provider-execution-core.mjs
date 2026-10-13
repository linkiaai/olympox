import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { strictPath } from './reference-transfer-core.mjs';
import { isFrameworkDevelopment } from './development-context.mjs';
import { assertSlug, canonHash, validatePersona, vocalReadiness, readCanon } from './studio-core.mjs';
import { stableHash } from './storage-core.mjs';
import { isToken } from './language-compat.mjs';
import { readRun, transitionRun } from './framework-core.mjs';

const BASE = 'work/provider-execution';
const MAX_JSON = 16 * 1024 * 1024;
const MAX_INPUT = 64 * 1024 * 1024;
const MAX_OUTPUT = 256 * 1024 * 1024;
const terminal = new Set(['succeeded', 'failed', 'cancelled', 'expired', 'not-submitted']);
const active = new Set(['submitting', 'submitted', 'uncertain']);
const states = new Set(['prepared', 'queued', ...active, ...terminal]);
const extensions = { image: { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp' }, audio: { '.wav': 'audio/wav', '.mp3': 'audio/mpeg' }, video: { '.mp4': 'video/mp4', '.mov': 'video/quicktime' } };
const clone = value => structuredClone(value);
const digest = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const object = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const need = (ok, message) => { if (!ok) throw new Error(message); };
const hash = value => typeof value === 'string' && /^[a-f0-9]{64}$/.test(value);
const jobId = value => typeof value === 'string' && /^job-[a-f0-9-]{36}$/.test(value);
const text = value => typeof value === 'string' && value.trim() && value.length <= 2048 && !/[\x00-\x1f]|https?:\/\/|\bBearer\s|\bAuthorization\s*:|\b(?:ARK_API_KEY|BYTEPLUS_SPEECH_API_KEY)\s*=/i.test(value);
const date = value => typeof value === 'string' && /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d{3})?Z$/.test(value) && Number.isFinite(Date.parse(value)) && new Date(value).toISOString() === (value.includes('.') ? value : value.replace('Z', '.000Z'));
function fields(value, required, optional = []) {
  need(object(value) && required.every(key => Object.hasOwn(value, key)) && Object.keys(value).every(key => [...required, ...optional].includes(key)), 'Unknown or missing descriptor fields.');
}
function provenance(value) {
  fields(value, ['actor', 'at', 'eventId', 'source', 'notes']);
  need(['actor', 'eventId', 'source', 'notes'].every(key => text(value[key])) && date(value.at), 'Provide actual event provenance without secrets or URLs.');
}
function micros(value) {
  need(Number.isFinite(value) && value >= 0 && value <= 1e6, 'Use a bounded nonnegative USD amount.');
  return Math.ceil(value * 1e6 - 1e-8);
}
const usd = value => value / 1e6;
function context(root) {
  need(!isFrameworkDevelopment(root), 'Provider execution requires an independent installed studio.');
  strictPath(root, 'influencers', 'directory');
}
function fileBytes(root, relative, maximum = MAX_INPUT) {
  const target = strictPath(root, relative);
  const size = fs.statSync(target).size;
  need(size > 0 && size <= maximum, 'Input is empty or exceeds its bounded size.');
  return fs.readFileSync(target);
}
export function readProviderInput(root, relative) {
  context(root);
  need(typeof relative === 'string' && /^(work|influencers)\//.test(relative), 'Private descriptors belong in work/ or the character directory.');
  return JSON.parse(fileBytes(root, relative, 1024 * 1024).toString('utf8').replace(/^\uFEFF/, ''));
}
function mkdir(root, relative) {
  const target = strictPath(root, relative, 'directory', true);
  fs.mkdirSync(target, { recursive: true });
  strictPath(root, relative, 'directory');
  return target;
}
function save(root, relative, value, exclusive = false) {
  const target = strictPath(root, relative, 'file', true);
  mkdir(root, path.posix.dirname(relative));
  const temporary = `${relative}.tmp-${crypto.randomUUID()}`;
  const bytes = Buffer.from(JSON.stringify(value, null, 2) + '\n');
  need(bytes.length <= MAX_JSON, 'Private execution state exceeds its bounded size.');
  if (exclusive) { fs.writeFileSync(target, bytes, { flag: 'wx' }); return; }
  const temp = strictPath(root, temporary, 'file', true);
  try {
    const fd = fs.openSync(temp, 'wx', 0o600);
    try { fs.writeFileSync(fd, bytes); fs.fsyncSync(fd); } finally { fs.closeSync(fd); }
    strictPath(root, relative, 'file', true);
    fs.renameSync(temp, target);
  } finally { if (fs.existsSync(temp)) fs.unlinkSync(temp); }
}
function loadState(root) {
  context(root);
  const file = strictPath(root, `${BASE}/state.json`, 'file', true);
  if (!fs.existsSync(file)) return { schemaVersion: 1, budget: null, jobs: {} };
  const state = JSON.parse(fileBytes(root, `${BASE}/state.json`, MAX_JSON));
  fields(state, ['schemaVersion', 'budget', 'jobs']);
  need(state.schemaVersion === 1 && object(state.jobs) && Object.keys(state.jobs).length <= 2048, 'Invalid execution ledger.');
  if (state.budget !== null) validateBudget(state.budget);
  for (const [id, job] of Object.entries(state.jobs)) {
    need(jobId(id) && job.id === id && states.has(job.state) && hash(job.requestHash) && stableHash(job.scope) === job.requestHash, 'Invalid job or immutable request hash.');
    assertSlug(job.scope.request.characterId);
    need(job.reservationMicros === null || Number.isSafeInteger(job.reservationMicros) && job.reservationMicros >= 0, 'Invalid reservation.');
    need(job.actualCostMicros === null || Number.isSafeInteger(job.actualCostMicros) && job.actualCostMicros >= 0, 'Invalid reconciled cost.');
    need(Array.isArray(job.stagedOutputs) && Array.isArray(job.exported) && job.stagedOutputs.length <= 16 && job.exported.length <= 16, 'Invalid bounded output records.');
    for (const item of job.stagedOutputs) validateOutputRecord(item, `${jobDirectory(job)}/result-`, false);
    const exportPrefix = `influencers/${job.scope.request.characterId}/media/candidates/${job.id}-`;
    for (const item of job.exported) validateOutputRecord(item, exportPrefix, true);
    if (job.exportIntent) { need(Array.isArray(job.exportIntent) && job.exportIntent.length <= 16, 'Invalid export intent.'); for (const item of job.exportIntent) validateOutputRecord(item, exportPrefix, true); }
  }
  return state;
}
function validateOutputRecord(item, prefix, draft) {
  need(object(item) && typeof item.path === 'string' && item.path.startsWith(prefix) && /^\d+\.(png|jpg|webp|wav|mp3|mp4|mov)$/.test(item.path.slice(prefix.length)) && hash(item.sha256) && Number.isSafeInteger(item.bytes) && item.bytes > 0 && item.bytes <= MAX_OUTPUT && ['image', 'audio', 'video'].includes(item.kind) && (!draft || item.status === 'draft'), 'Output record is outside the original job or has invalid bytes.');
}
function locked(root, operation) {
  context(root);
  mkdir(root, BASE);
  const lock = strictPath(root, `${BASE}/ledger.lock`, 'file', true);
  let fd;
  try { fd = fs.openSync(lock, 'wx', 0o600); }
  catch (error) { if (error.code === 'EEXIST') throw new Error('Execution ledger is locked; inspect the owning process before recovering a stale lock.'); throw error; }
  try {
    fs.writeFileSync(fd, JSON.stringify({ pid: process.pid, at: new Date().toISOString() }));
    const state = loadState(root), result = operation(state);
    save(root, `${BASE}/state.json`, state);
    // Copies in the character backup contain encrypted locators, never credentials.
    for (const job of Object.values(state.jobs)) save(root, `${jobDirectory(job)}/receipt.json`, job);
    return result;
  } finally { fs.closeSync(fd); fs.unlinkSync(lock); }
}
function jobDirectory(job) { return `influencers/${job.scope.request.characterId}/executions/provider-jobs/${job.id}`; }
function getJob(state, id) { need(jobId(id) && state.jobs[id], 'Unknown provider job.'); return state.jobs[id]; }
function event(job, name, detail = {}) { job.events.push({ at: new Date().toISOString(), name, ...detail }); }
function summary(job) {
  const request = job.scope.request;
  return { id: job.id, requestHash: job.requestHash, characterId: request.characterId, purpose: request.purpose, provider: request.provider, medium: request.medium, model: request.model, destination: request.destination, execution: clone(job.scope.execution), canonBinding: clone(job.scope.canonBinding), state: job.state, providerJobId: job.providerJobId, credentialFingerprint: job.credentialFingerprint, requiresExportCredential: job.state === 'succeeded' && !job.exported.length && Boolean(job.protectedOutputs), estimate: job.estimate, reservedUSD: job.reservationMicros === null ? null : usd(job.reservationMicros), actualCostUSD: job.actualCostMicros === null ? null : usd(job.actualCostMicros), usage: job.usage, outputs: job.exported, receiptPath: `${jobDirectory(job)}/receipt.json`, reason: job.reason, request: clone(request) };
}
export function readJob(root, id) { return summary(getJob(loadState(root), id)); }
export function listJobs(root) { return Object.values(loadState(root).jobs).map(summary); }
function validateBudget(value) {
  fields(value, ['schemaVersion', 'maximumUSD', 'perCharacter', 'maxConcurrent', 'provenance']);
  need(value.schemaVersion === 1 && micros(value.maximumUSD) > 0 && object(value.perCharacter) && Number.isInteger(value.maxConcurrent) && value.maxConcurrent >= 1 && value.maxConcurrent <= 10, 'Invalid numerical studio budget or concurrency limit.');
  provenance(value.provenance);
  for (const [character, amount] of Object.entries(value.perCharacter)) { assertSlug(character); micros(amount); }
}
function exposure(state, character = null) {
  return Object.values(state.jobs).filter(job => character === null || job.scope.request.characterId === character)
    .reduce((sum, job) => sum + (job.actualCostMicros ?? job.reservationMicros ?? 0), 0);
}
export function setBudget(root, value) {
  validateBudget(value);
  return locked(root, state => {
    need(micros(value.maximumUSD) >= exposure(state), 'New budget is below committed spending and reservations.');
    for (const [id, amount] of Object.entries(value.perCharacter)) need(micros(amount) >= exposure(state, id), 'Character budget is below its committed exposure.');
    state.budget = clone(value); return { ...clone(value), committedUSD: usd(exposure(state)) };
  });
}
export function getBudget(root) {
  const state = loadState(root);
  return { budget: clone(state.budget), committedUSD: usd(exposure(state)), remainingUSD: state.budget ? usd(Math.max(0, micros(state.budget.maximumUSD) - exposure(state))) : null, limitation: 'Local reservations constrain this executor, not external account activity or unverified provider billing.' };
}
function source(root, originalPath, expected = null) {
  const bytes = fileBytes(root, originalPath), result = { originalPath, bytes: bytes.length, sha256: digest(bytes) };
  if (expected) need(result.bytes === expected.bytes && result.sha256 === expected.sha256, 'Selected reference bytes differ from the descriptor.');
  return { ...result, data: bytes };
}
function inspectRequest(root, request) {
  fields(request, ['schemaVersion', 'characterId', 'purpose', 'medium', 'provider', 'model', 'promptPath', 'parameters', 'references', 'hasSpeech', 'destination', 'runBinding'], ['voiceReuse']);
  need(request.schemaVersion === 1 && ['reference', 'production'].includes(request.purpose) && ['image', 'video', 'audio'].includes(request.medium) && request.provider === 'byteplus' && typeof request.model === 'string' && object(request.parameters) && Array.isArray(request.references) && request.references.length <= 50 && typeof request.hasSpeech === 'boolean', 'Invalid generation descriptor.');
  assertSlug(request.characterId);
  const prefix = `influencers/${request.characterId}/`;
  const personaBytes = fileBytes(root, `${prefix}persona.json`, 1024 * 1024), persona = JSON.parse(personaBytes);
  need(persona.id === request.characterId && Number.isInteger(persona.profile?.age) && persona.profile.age >= 18, 'Bind an original adult character before generation.');
  const characterBase = strictPath(root, prefix.slice(0, -1), 'directory');
  need(validatePersona(persona, characterBase).errors.length === 0, 'Character descriptor does not validate.');
  fields(request.destination, ['accountLabel', 'region']);
  need(text(request.destination.accountLabel) && request.destination.region === 'ap-southeast-1', 'Use an own-account label and supported AP region.');
  need(typeof request.promptPath === 'string' && (request.promptPath.startsWith(`${prefix}prompts/`) || request.promptPath.startsWith('work/')), 'Prompt belongs in this character\'s prompts/ or private work/.');
  const prompt = source(root, request.promptPath);
  need(prompt.bytes <= 1024 * 1024, 'Prompt exceeds its bounded size.');
  need(!(request.medium === 'image' && request.hasSpeech) && (request.medium !== 'audio' || request.hasSpeech), 'Speech scope does not match the medium.');
  if (request.medium === 'video') need(request.parameters.generate_audio === request.hasSpeech, 'Explicit generate_audio must match the chosen speech scope.');
  if (request.medium === 'audio') {
    need(request.purpose === 'reference', 'Preset TTS supports reference preparation; production voice conditioning remains pending.');
    need(request.parameters.format === undefined || request.parameters.format === 'mp3', 'This executor exports preset TTS as MP3; other speech encodings remain pending.');
    need(request.references.length === 0, 'Preset TTS does not accept audio reference conditioning.');
  }
  if (request.hasSpeech) need(persona.voice?.applicability !== 'silent', 'Silent canon does not permit speech.');
  const inputs = [prompt];
  const references = request.references.map((ref, index) => {
    fields(ref, ['referenceId', 'path', 'sha256', 'bytes', 'kind', 'role', 'order'], ['providerRole', 'binding']);
    need(text(ref.referenceId) && text(ref.role) && ref.order === index && hash(ref.sha256) && Number.isInteger(ref.bytes) && ref.bytes > 0 && object(extensions[ref.kind]), 'Invalid exact ordered reference.');
    need(typeof ref.path === 'string' && /^(references|media)\//.test(ref.path), 'References belong in this character\'s references/ or media/.');
    const mimeType = extensions[ref.kind][path.posix.extname(ref.path).toLowerCase()];
    need(mimeType, 'Unsupported reference extension.');
    const input = source(root, prefix + ref.path, ref);
    need(ref.kind !== 'video', 'Exact local video-reference transfer remains pending; this executor supports image/audio references.');
    need(ref.binding === undefined, 'Image/audio references use exact local bytes, without a remote substitution.');
    if (ref.providerRole !== undefined) need(['reference_image', 'first_frame', 'last_frame', 'reference_audio', 'reference_video'].includes(ref.providerRole), 'Unsupported provider reference role.');
    inputs.push(input);
    return { ...clone(ref), mimeType };
  });
  need(new Set(references.map(ref => ref.referenceId)).size === references.length, 'Reference IDs must be unique.');
  let canonBinding = null;
  if (request.purpose === 'production') {
    need(isToken(persona.status, 'canon-approved') || isToken(persona.status, 'production'), 'Production requires approved canon; use reference purpose for draft exploration.');
    need(persona.approval?.canonHash === canonHash(persona), 'Canon approval does not match its exact version.');
    canonBinding = { identityVersion: persona.identityVersion, canonHash: canonHash(persona) };
    const canonDirectory = `${prefix}canon/v${String(persona.identityVersion).padStart(6, '0')}`;
    strictPath(root, `${canonDirectory}/snapshot.json`);
    const frozen = readCanon(characterBase, persona.identityVersion, canonBinding.canonHash);
    for (const ref of frozen.referenceFiles) strictPath(root, `${canonDirectory}/${ref.path}`);
    for (const ref of references) need(persona.references.some(canonical => isToken(canonical.status, 'approved') && canonical.id === ref.referenceId && canonical.path === ref.path && canonical.sha256 === ref.sha256 && canonical.role === ref.role), 'Production reference does not match approved canonical bytes and role.');
    if (['image', 'video'].includes(request.medium)) need(references.some(ref => ref.kind === 'image'), 'Production visual generation requires an approved identity reference.');
    if (request.hasSpeech) {
      // Explicit modern selection is required; historical voice bytes remain reusable.
      need(vocalReadiness(persona, characterBase).ready, 'Speaking production requires an exact listened-to approved voice.');
      need(references.some(ref => ref.kind === 'audio' && ref.referenceId === persona.voice.referenceId && ref.role === 'voice'), 'Speaking production requires its selected canonical audio reference.');
      const voiceRef = persona.references.find(ref => ref.id === persona.voice.referenceId);
      need(voiceRef?.review && isToken(voiceRef.status, 'approved'), 'Historical speaking canon still needs its reviewed exact vocal reference.');
      if (!Object.hasOwn(persona.voice, 'applicability') || request.voiceReuse !== undefined) {
        need(request.voiceReuse, 'Historical approved voice needs a current exact listening/reuse declaration in the job; preserve the old canon bytes.');
        fields(request.voiceReuse, ['method', 'performed', 'referenceId', 'path', 'sha256', 'criticalIssues', 'limitations', 'provenance']);
        const reuse = request.voiceReuse; provenance(reuse.provenance);
        need(reuse.method === 'listening' && reuse.performed === true && reuse.referenceId === voiceRef.id && reuse.path === voiceRef.path && reuse.sha256 === voiceRef.sha256 && Array.isArray(reuse.criticalIssues) && !reuse.criticalIssues.length && Array.isArray(reuse.limitations) && !reuse.limitations.length, 'Current approved voice reuse must bind listened-to exact canonical bytes without unresolved issues.');
      }
    }
  }
  if (request.voiceReuse !== undefined) need(request.purpose === 'production' && request.hasSpeech, 'Voice reuse evidence belongs to speaking production.');
  if (request.runBinding !== null) {
    fields(request.runBinding, ['runId', 'attemptId', 'stageId']);
    need(/^run-[a-f0-9-]{36}$/.test(request.runBinding.runId) && /^attempt-[a-f0-9-]{36}$/.test(request.runBinding.attemptId) && text(request.runBinding.stageId), 'Invalid workflow binding.');
    need(!(request.medium === 'audio' && request.purpose === 'production'), 'Linked TTS production stays pending: preset synthesis does not attach canonical audio conditioning. Use a separately verified compatible vocal module.');
  }
  return { request: clone(request), personaSha256: digest(personaBytes), canonBinding, inputs, references };
}
function driverEnvelope(request, prompt, references) {
  return { provider: request.provider, medium: request.medium, purpose: request.purpose, model: request.model, prompt, parameters: clone(request.parameters), references, hasSpeech: request.hasSpeech };
}
function resolved(root, job) {
  const scope = job.scope, request = scope.request;
  const references = scope.references.map((ref, index) => {
    const input = scope.inputs[index + 1], bytes = checkedSnapshot(root, input);
    return { kind: ref.kind, role: ref.providerRole ?? ({ image: 'reference_image', audio: 'reference_audio', video: 'reference_video' }[ref.kind]), referenceId: ref.referenceId, sha256: ref.sha256, bytes: ref.bytes, order: ref.order, ...(ref.kind === 'video' ? { url: ref.binding.url } : { dataUrl: `data:${ref.mimeType};base64,${bytes.toString('base64')}` }) };
  });
  return driverEnvelope(request, checkedSnapshot(root, scope.inputs[0]).toString('utf8'), references);
}
function checkedSnapshot(root, input) {
  const bytes = fileBytes(root, input.snapshotPath);
  need(bytes.length === input.bytes && digest(bytes) === input.sha256, 'Immutable input snapshot changed.');
  return bytes;
}
function checkContext(root, job) {
  const fresh = inspectRequest(root, job.scope.request);
  need(fresh.personaSha256 === job.scope.personaSha256 && stableHash(fresh.canonBinding) === stableHash(job.scope.canonBinding), 'Character context changed; preserve this job and prepare a new one.');
  for (const input of job.scope.inputs) {
    const actual = source(root, input.originalPath);
    need(actual.sha256 === input.sha256 && actual.bytes === input.bytes, 'Bound source changed; prepare a new job.'); checkedSnapshot(root, input);
  }
  need(stableHash(governance(root)) === stableHash(job.scope.governance), 'Framework/provider contract changed; preserve this job and prepare a new one.');
}
function governance(root) {
  const registry = JSON.parse(fileBytes(root, 'framework/registry.json', 1024 * 1024));
  const names = [...new Set(['CONSTITUTION.md', 'framework/registry.json', 'scripts/providers/byteplus.mjs', 'scripts/provider-execution-core.mjs', 'scripts/provider-credentials.mjs', 'scripts/secret-input.mjs', ...registry.constitutionPaths, ...registry.roles.map(item => item.path), ...registry.tasks.map(item => item.path), ...registry.workflows.map(item => item.path)])].sort();
  return names.map(relative => ({ path: relative, sha256: digest(fileBytes(root, relative)) }));
}
function contract(driver, request) { return stableHash(driver.validate(request)); }
function checkRun(root, job) {
  const binding = job.scope.request.runBinding;
  if (!binding) return null;
  const status = readRun(root, binding.runId);
  need(status.attemptId === binding.attemptId && status.run.personaId === job.scope.request.characterId && status.nextTask?.expectedDelivery === 'media' && status.nextTask.medium === job.scope.request.medium && status.mediaProviders?.[job.scope.request.medium] === job.scope.request.provider && status.canContinue, 'Workflow context/readiness is pending or no longer matches this job.');
  need(status.mediaReadiness?.currentStageId === binding.stageId, 'Workflow stage differs from the selected execution stage.');
  const attempt = status.run.attempts.at(-1), stage = attempt.mediaReadiness.plan.stages.find(item => item.id === binding.stageId);
  need(!stage.requestedModel || stage.requestedModel === job.scope.request.model, 'Workflow requested model differs.');
  need(stage.tool === job.scope.execution.tool && stage.module === job.scope.execution.module && stage.route === job.scope.execution.route, 'Workflow tool/module/route differs from the installed executor.');
  const observed = [...attempt.mediaReadiness.records].reverse().map(item => item.record.stages.find(item => item.stageId === binding.stageId)).find(Boolean);
  need(observed?.model?.value === job.scope.request.model, 'Workflow observed model differs from the selected provider request.');
  // ModelArk exposes no account/workspace discovery in this adapter. The declared
  // label stays in the request hash; dispatch binds the actual private credential.
  for (const input of job.scope.inputs) need(observed.inputs.some(item => item.path === input.originalPath && item.sha256 === input.sha256 && item.bytes === input.bytes), 'Workflow readiness does not bind the exact provider inputs.');
  const parameterSlot = stage.inputSlots.find(item => item.kind === 'parameters');
  need(parameterSlot, 'Workflow stage requires an exact parameter input slot.');
  const parameterInput = observed.inputs.find(item => item.slotId === parameterSlot.id);
  need(parameterInput && stableHash(JSON.parse(fileBytes(root, parameterInput.path))) === stableHash(job.scope.request.parameters), 'Workflow parameters differ from the provider request.');
  need(observed.inputs.length === job.scope.inputs.length + 1, 'Workflow readiness includes a different input set.');
  for (const ref of job.scope.references) {
    const input = observed.inputs.find(item => item.path === `influencers/${job.scope.request.characterId}/${ref.path}`);
    need(input?.referenceId === ref.referenceId && input.role === ref.role && input.order === ref.order, 'Workflow reference role/order differs.');
  }
  return status;
}
export function prepareJob(root, request, { driver } = {}) {
  context(root); need(driver && typeof driver.validate === 'function', 'Choose an implemented provider adapter.');
  const captured = inspectRequest(root, request), id = `job-${crypto.randomUUID()}`;
  const base = `influencers/${request.characterId}/executions/provider-jobs/${id}`;
  const scope = { request: captured.request, personaSha256: captured.personaSha256, canonBinding: captured.canonBinding, governance: governance(root), references: captured.references, inputs: captured.inputs.map((input, index) => ({ originalPath: input.originalPath, sha256: input.sha256, bytes: input.bytes, snapshotPath: `${base}/input-${index}${path.posix.extname(input.originalPath) || '.txt'}` })) };
  // Validate before any lasting write; driver validation is offline.
  const withBytes = driverEnvelope(request, captured.inputs[0].data.toString('utf8'), captured.references.map((ref, index) => ({ kind: ref.kind, role: ref.providerRole ?? ({ image: 'reference_image', audio: 'reference_audio' }[ref.kind]), referenceId: ref.referenceId, order: ref.order, sha256: ref.sha256, bytes: ref.bytes, dataUrl: `data:${ref.mimeType};base64,${captured.inputs[index + 1].data.toString('base64')}` })));
  const prepared = driver.validate(withBytes);
  scope.providerContractHash = stableHash(prepared);
  scope.execution = { tool: 'olympox-provider-execution', module: request.model, route: request.medium === 'audio' ? 'byteplus-speech-http' : `byteplus-modelark-${request.medium}-http` };
  const estimate = driver.estimate(withBytes);
  return locked(root, state => {
    need(Object.keys(state.jobs).length < 2048, 'Bounded job store is full; preserve/archive history before adding jobs.');
    for (const input of captured.inputs) { const fresh = source(root, input.originalPath); need(fresh.sha256 === input.sha256, 'Source changed during preparation.'); }
    mkdir(root, base);
    for (let index = 0; index < captured.inputs.length; index++) fs.writeFileSync(strictPath(root, scope.inputs[index].snapshotPath, 'file', true), captured.inputs[index].data, { flag: 'wx' });
    const job = { schemaVersion: 1, id, scope, requestHash: stableHash(scope), state: 'prepared', estimate: clone(estimate), providerJobId: null, credentialFingerprint: null, protectedOutputs: null, stagedOutputs: [], exported: [], usage: null, reservationMicros: null, actualCostMicros: null, authorization: null, reason: null, events: [] };
    event(job, 'prepared', { noProviderCall: true }); state.jobs[id] = job; return summary(job);
  });
}
function validateGrant(grant, job) {
  fields(grant, ['schemaVersion', 'requestHash', 'explicit', 'maximumUSD', 'acceptEstimatedCost', 'acceptUnknownCost', 'expiresAt', 'provenance']);
  provenance(grant.provenance);
  need(grant.schemaVersion === 1 && grant.explicit === true && grant.requestHash === job.requestHash && micros(grant.maximumUSD) > 0 && grant.acceptEstimatedCost === true && typeof grant.acceptUnknownCost === 'boolean' && date(grant.expiresAt) && Date.parse(grant.expiresAt) > Date.now(), 'Grant must cover this exact request, a live expiry and estimated-cost limitations.');
  need(job.estimate.amount !== null ? micros(job.estimate.amount) <= micros(grant.maximumUSD) : grant.acceptUnknownCost, 'Estimated cost exceeds the grant or unknown cost is not authorized.');
}
function reserve(state, job, grant) {
  need(state.budget, 'Configure your own studio budget before submission.');
  const maximum = micros(grant.maximumUSD), character = job.scope.request.characterId;
  noUncertainPredecessor(state, job);
  need(exposure(state) + maximum <= micros(state.budget.maximumUSD), 'Studio budget would exceed committed spending and reservations.');
  if (Object.hasOwn(state.budget.perCharacter, character)) need(exposure(state, character) + maximum <= micros(state.budget.perCharacter[character]), 'Character budget would be exceeded.');
  job.reservationMicros = maximum; job.authorization = clone(grant);
}
function noUncertainPredecessor(state, job) {
  need(!Object.values(state.jobs).some(other => other.id !== job.id && other.scope.request.characterId === job.scope.request.characterId && ['submitting', 'uncertain'].includes(other.state)), 'Reconcile the character\'s uncertain original request before another paid attempt.');
}
function credential(driver, job) {
  const fingerprint = driver.credentialFingerprint?.(job.scope.request.medium);
  need(hash(fingerprint), 'Configure your own provider credential for this medium before submission or recovery.');
  if (job.credentialFingerprint) need(fingerprint === job.credentialFingerprint, 'Credential destination differs from the submitted job; reconcile using the original account/key.');
  return fingerprint;
}
function capacity(state) { return Object.values(state.jobs).filter(job => active.has(job.state)).length < state.budget.maxConcurrent; }
function outputKey(value) { need(Buffer.isBuffer(value) && value.length === 32, 'Provide an in-memory output protection key for private result recovery.'); return value; }
const selectedKey = (value, job) => outputKey(typeof value === 'function' ? value(job.scope.request.medium) : value);
function encrypt(value, key) {
  const iv = crypto.randomBytes(12), cipher = crypto.createCipheriv('aes-256-gcm', outputKey(key), iv);
  const bytes = Buffer.concat([cipher.update(JSON.stringify(value), 'utf8'), cipher.final()]);
  return { iv: iv.toString('base64'), tag: cipher.getAuthTag().toString('base64'), data: bytes.toString('base64') };
}
function decrypt(value, key) {
  try { const decipher = crypto.createDecipheriv('aes-256-gcm', outputKey(key), Buffer.from(value.iv, 'base64')); decipher.setAuthTag(Buffer.from(value.tag, 'base64')); return JSON.parse(Buffer.concat([decipher.update(Buffer.from(value.data, 'base64')), decipher.final()]).toString('utf8')); }
  catch { throw new Error('Private result locators cannot be recovered with this output protection key.'); }
}
function recordResult(root, job, receipt, key) {
  need(object(receipt) && receipt.provider === job.scope.request.provider && receipt.model === job.scope.request.model && ['queued', 'running', ...terminal].includes(receipt.status) && Array.isArray(receipt.outputs) && receipt.outputs.length <= 16, 'Invalid provider receipt; preserve the uncertain original submission.');
  if (job.providerJobId) need(receipt.jobId === job.providerJobId, 'Provider job ID changed during recovery.');
  if (receipt.jobId) need(typeof receipt.jobId === 'string' && /^[a-zA-Z0-9_.:-]{1,200}$/.test(receipt.jobId), 'Invalid provider job ID.');
  job.providerJobId ??= receipt.jobId ?? null;
  if (terminal.has(job.state) && receipt.status !== job.state) return [];
  if (job.exported.length) return [];
  const remote = [], staged = [];
  for (const [index, output] of receipt.outputs.entries()) {
    need(output.kind === job.scope.request.medium, 'Output medium differs from the selected job.');
    if (output.data) {
      const bytes = Buffer.from(output.data), extension = mediaExtension(bytes, output.kind);
      const relative = `${jobDirectory(job)}/result-${index}.${extension}`;
      staged.push({ path: relative, bytes });
      if (!job.stagedOutputs.some(item => item.path === relative)) job.stagedOutputs.push({ path: relative, kind: output.kind, sha256: digest(bytes), bytes: bytes.length });
    } else { validateMediaURL(output.url); remote.push({ url: output.url, kind: output.kind }); }
  }
  if (remote.length) job.protectedOutputs = encrypt(remote, key);
  job.usage = object(receipt.usage) ? Object.fromEntries(Object.entries(receipt.usage).filter(([name, value]) => ['tokens', 'completion_tokens', 'total_tokens', 'characters'].includes(name) && Number.isSafeInteger(value) && value >= 0)) : null;
  job.state = terminal.has(receipt.status) ? receipt.status : 'submitted';
  job.reason = null; event(job, 'provider-status', { status: receipt.status });
  // Token usage is not an invoice. Keep the full reservation until explicit billing reconciliation.
  return staged;
}
function acceptReceipt(root, id, receipt, key) {
  // Commit original output hashes before writing bytes, so completed staging can recover.
  const staged = locked(root, state => recordResult(root, getJob(state, id), receipt, key));
  if (!staged.length) return;
  locked(root, state => {
    const job = getJob(state, id);
    for (const file of staged) {
      need(job.stagedOutputs.some(item => item.path === file.path && item.sha256 === digest(file.bytes) && item.bytes === file.bytes.length), 'Output staging differs from the accepted receipt.');
      if (fs.existsSync(strictPath(root, file.path, 'file', true))) need(digest(fileBytes(root, file.path, MAX_OUTPUT)) === digest(file.bytes), 'Previously staged output changed.');
    }
    for (const file of staged) if (!fs.existsSync(strictPath(root, file.path, 'file', true))) fs.writeFileSync(strictPath(root, file.path, 'file', true), file.bytes, { flag: 'wx' });
    event(job, 'outputs-staged');
  });
}
export function validateMediaURL(value) {
  let url; try { url = new URL(value); } catch { throw new Error('Invalid provider media URL.'); }
  const suffixes = ['bytepluscdn.com', 'bytepluses.com', 'volces.com', 'volccdn.com'];
  need(url.protocol === 'https:' && !url.username && !url.password && (!url.port || url.port === '443') && !url.hash && suffixes.some(suffix => url.hostname === suffix || url.hostname.endsWith(`.${suffix}`)), 'Media URL must use an official HTTPS BytePlus storage/CDN host, without redirects or credentials.');
  return url.href;
}
async function download(url, fetcher, maximum = MAX_OUTPUT) {
  validateMediaURL(url);
  const response = await fetcher(url, { redirect: 'error', signal: AbortSignal.timeout(60000) });
  need(response.ok && !response.redirected, 'Provider media download did not succeed.');
  const length = Number(response.headers?.get('content-length'));
  need(!Number.isFinite(length) || length <= maximum, 'Provider media exceeds its bounded size.');
  need(response.body?.getReader, 'Provider media requires a bounded readable response.');
  const reader = response.body.getReader(), chunks = []; let size = 0;
  try { while (true) { const { done, value } = await reader.read(); if (done) break; size += value.length; need(size <= maximum, 'Provider media exceeds its bounded size.'); chunks.push(Buffer.from(value)); } }
  finally { await reader.cancel().catch(() => {}); }
  need(size > 0, 'Provider output is empty.'); return Buffer.concat(chunks);
}
async function validateRemoteReferences(root, job, fetcher) {
  for (const ref of job.scope.references.filter(item => item.kind === 'video')) {
    need(Date.parse(ref.binding.expiresAt) > Date.now(), 'Video reference binding expired; no generation was submitted.');
    const bytes = await download(ref.binding.url, fetcher, MAX_INPUT);
    need(digest(bytes) === ref.sha256 && bytes.length === ref.bytes, 'Provider video reference is not the exact selected original bytes.');
  }
}
async function dispatchJob(root, id, { driver, outputKey: key, fetch: fetcher = globalThis.fetch }) {
  const before = getJob(loadState(root), id);
  key = selectedKey(key, before);
  await validateRemoteReferences(root, before, fetcher);
  let request;
  locked(root, state => {
    const job = getJob(state, id); need(job.state === 'queued' && capacity(state), 'Job is not eligible for dispatch or concurrency is full.');
    validateGrant(job.authorization, job); noUncertainPredecessor(state, job); checkContext(root, job); checkRun(root, job); credential(driver, job);
    request = resolved(root, job); need(contract(driver, request) === job.scope.providerContractHash, 'Normalized provider request changed; prepare a new job.');
    job.state = 'submitting'; event(job, 'external-intent', { requestHash: job.requestHash });
  });
  // The durable ledger intent precedes the workflow write and the one external POST.
  const run = before.scope.request.runBinding;
  if (run) {
    try {
      const started = transitionRun(root, run.runId, { action: 'start', stageId: run.stageId, job: { provider: before.scope.request.provider, requestId: id } });
      need(started.run.attempts.at(-1).job?.requestId === id && started.state === 'in-progress', 'Workflow did not accept the exact external intent.');
    } catch {
      locked(root, state => { const job = getJob(state, id); job.state = 'not-submitted'; job.actualCostMicros = 0; job.reservationMicros = 0; job.reason = 'Workflow bridge refused the intent before any provider POST.'; event(job, 'bridge-refused'); });
      syncRun(root, id); return readJob(root, id);
    }
  }
  try {
    // One POST only. Any interruption leaves an intent that can never be replayed automatically.
    const receipt = await driver.submit(request);
    // Preserve an accepted original ID even if subsequent local output staging fails.
    if (receipt.jobId && receipt.provider === before.scope.request.provider && receipt.model === before.scope.request.model && /^[a-zA-Z0-9_.:-]{1,200}$/.test(receipt.jobId)) locked(root, state => { const job = getJob(state, id); need(!job.providerJobId || job.providerJobId === receipt.jobId, 'Original provider ID differs.'); job.providerJobId = receipt.jobId; });
    acceptReceipt(root, id, receipt, key);
  } catch (error) {
    locked(root, state => {
      const job = getJob(state, id);
      if (terminal.has(job.state)) return;
      const knownNotSubmitted = !job.providerJobId && error?.outcomeUnknown === false && Number.isInteger(error.httpStatus) && error.httpStatus >= 400 && error.httpStatus < 500;
      job.state = knownNotSubmitted ? 'not-submitted' : 'uncertain'; job.reason = knownNotSubmitted ? 'Provider explicitly refused submission.' : 'Submission outcome is uncertain; reconcile the original request before any new attempt.';
      if (knownNotSubmitted) { job.actualCostMicros = 0; job.reservationMicros = 0; }
      event(job, job.state);
    });
  }
  syncRun(root, id);
  return readJob(root, id);
}
export async function submitJob(root, id, grant, options) {
  need(options?.driver, 'Select an implemented driver.');
  const queued = locked(root, state => {
    const job = getJob(state, id); need(job.state === 'prepared', 'Job has already been queued or submitted; inspect/reconcile it instead of repeating.');
    validateGrant(grant, job); checkContext(root, job); checkRun(root, job);
    const request = resolved(root, job); need(contract(options.driver, request) === job.scope.providerContractHash, 'Normalized provider request changed; prepare a new job.');
    job.credentialFingerprint = credential(options.driver, job); selectedKey(options.outputKey, job);
    reserve(state, job, grant); job.state = 'queued'; event(job, 'authorized-queue', { requestHash: job.requestHash }); return !capacity(state);
  });
  return queued ? readJob(root, id) : dispatchJob(root, id, options);
}
export async function dispatchQueue(root, options = {}) {
  const maxJobs = options.maxJobs ?? 1; need(Number.isInteger(maxJobs) && maxJobs >= 1 && maxJobs <= 64, 'Use a bounded dispatch count.');
  need(options.resolveJobOptions === undefined || typeof options.resolveJobOptions === 'function', 'Invalid per-job credential resolver.');
  const results = [];
  for (const job of Object.values(loadState(root).jobs).filter(item => item.state === 'queued').slice(0, maxJobs)) {
    if (!capacity(loadState(root))) break;
    const scoped = options.resolveJobOptions ? await options.resolveJobOptions(summary(job)) : options;
    need(scoped?.driver, 'Select an implemented driver for the queued job.');
    results.push(await dispatchJob(root, job.id, { ...options, ...scoped }));
  }
  return results;
}
export async function pollJob(root, id, { driver, outputKey: key } = {}) {
  const job = getJob(loadState(root), id);
  if (job.state === 'submitting' && !job.providerJobId) { locked(root, state => { const pending = getJob(state, id); if (pending.state !== 'submitting') return; pending.state = 'uncertain'; pending.reason = 'An interrupted intent has no known remote ID; use provider reconciliation, never replay.'; event(pending, 'interrupted-intent'); }); syncRun(root, id); return readJob(root, id); }
  if (!active.has(job.state) && !(job.state === 'succeeded' && job.providerJobId && !job.exported.length)) { syncRun(root, id); return summary(job); }
  credential(driver, job);
  need(job.providerJobId, 'Original remote job ID is unknown; inspect the provider account and reconcile explicitly.');
  const receipt = await driver.getStatus({ provider: job.scope.request.provider, medium: job.scope.request.medium, model: job.scope.request.model, jobId: job.providerJobId, outputFormat: job.scope.request.parameters.output_format ?? 'mp4', credentialFingerprint: job.credentialFingerprint });
  acceptReceipt(root, id, receipt, selectedKey(key, job));
  syncRun(root, id);
  return readJob(root, id);
}
export function cancelJob(root, id, declaration) {
  provenance(declaration);
  return locked(root, state => {
    const job = getJob(state, id); need(['prepared', 'queued'].includes(job.state), 'Only local unsubmitted jobs can be cancelled; external cancellation is a separate provider operation.');
    job.state = 'cancelled'; job.reservationMicros = 0; job.actualCostMicros = 0; event(job, 'local-cancelled', { provenance: clone(declaration) }); return summary(job);
  });
}
export function reconcileJob(root, id, receipt) {
  locked(root, state => {
    const job = getJob(state, id);
    fields(receipt, ['schemaVersion', 'requestHash', 'providerJobId', 'status', 'actualCostUSD', 'provenance']); provenance(receipt.provenance);
    need(receipt.schemaVersion === 1 && receipt.requestHash === job.requestHash && terminal.has(receipt.status) && (active.has(job.state) || terminal.has(job.state)) && job.actualCostMicros === null, 'Reconciliation must match an unresolved charge and terminal original outcome.');
    need(!job.providerJobId || receipt.providerJobId === job.providerJobId, 'Reconciliation cannot replace the original remote job ID.');
    if (receipt.providerJobId !== null) need(typeof receipt.providerJobId === 'string' && /^[a-zA-Z0-9_.:-]{1,200}$/.test(receipt.providerJobId), 'Invalid reconciled provider job ID.');
    need(receipt.status !== 'not-submitted' || receipt.actualCostUSD === 0 && receipt.providerJobId === null && !job.providerJobId, 'No-submission requires zero charge and no accepted job ID.');
    if (terminal.has(job.state)) need(receipt.status === job.state, 'Billing reconciliation cannot rewrite the known terminal outcome.');
    job.providerJobId ??= receipt.providerJobId; job.state = receipt.status; job.actualCostMicros = micros(receipt.actualCostUSD); job.reservationMicros = 0;
    event(job, 'billing-reconciled', { provenance: clone(receipt.provenance), actualCostUSD: receipt.actualCostUSD });
    return summary(job);
  });
  syncRun(root, id); return readJob(root, id);
}
function syncRun(root, id) {
  const job = getJob(loadState(root), id), binding = job.scope.request.runBinding;
  if (!binding) return;
  const status = readRun(root, binding.runId), original = status.run.attempts.find(item => item.id === binding.attemptId);
  need(original, 'Original workflow attempt is missing; preserve the execution receipt.');
  // A resolved original job needs no second transition, even after the run advances.
  if (original.job?.requestId === id && ['succeeded', 'failed', 'not-submitted'].includes(original.job.status)) return;
  if (!original.job && job.state === 'not-submitted') return;
  need(status.attemptId === binding.attemptId && (!original.job || original.job.requestId === id), 'Workflow intent differs; reconcile the original recorded attempt.');
  const external = { provider: job.scope.request.provider, requestId: id, ...(job.providerJobId ? { jobId: job.providerJobId } : {}) };
  if (terminal.has(job.state)) {
    if (!original.job) transitionRun(root, binding.runId, { action: 'uncertain', job: external, reason: 'Recover the durable executor intent and its original provider outcome.' });
    transitionRun(root, binding.runId, { action: 'resolve', job: { ...external, status: job.state === 'succeeded' ? 'succeeded' : job.state === 'not-submitted' ? 'not-submitted' : 'failed' }, evidence: { type: 'reconciled', performed: true, actor: 'OLYMPOX provider executor', at: new Date().toISOString(), eventId: `${id}-${job.events.length}`, notes: 'Original provider outcome recorded; cost, media export and review remain separate.' } });
  } else if (['submitted', 'uncertain'].includes(job.state)) {
    if (original.job?.status === 'unknown' && (original.job.jobId ?? null) === job.providerJobId) return;
    transitionRun(root, binding.runId, { action: 'uncertain', job: external, reason: 'Query the original accepted/uncertain provider job; generation is never replayed automatically.' });
  }
}
function mediaExtension(bytes, kind) {
  need(bytes.length > 0 && bytes.length <= MAX_OUTPUT, 'Invalid media byte count.');
  let extension = null;
  if (kind === 'image') {
    if (bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) extension = 'png';
    else if (bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255) extension = 'jpg';
    else if (bytes.toString('ascii', 0, 4) === 'RIFF' && bytes.toString('ascii', 8, 12) === 'WEBP') extension = 'webp';
  } else if (kind === 'audio') {
    if (bytes.toString('ascii', 0, 4) === 'RIFF' && bytes.toString('ascii', 8, 12) === 'WAVE') extension = 'wav';
    else if (bytes.toString('ascii', 0, 3) === 'ID3' || bytes[0] === 255 && (bytes[1] & 224) === 224) extension = 'mp3';
  } else if (kind === 'video' && bytes.toString('ascii', 4, 8) === 'ftyp') extension = bytes.toString('ascii', 8, 12) === 'qt  ' ? 'mov' : 'mp4';
  need(extension, 'Provider bytes do not have the expected media signature; inspect the response without approving it.'); return extension;
}
export async function exportJob(root, id, { fetch: fetcher = globalThis.fetch, outputKey: key } = {}) {
  const job = getJob(loadState(root), id);
  need(job.state === 'succeeded', 'Only a successful provider job can export media.');
  if (job.exported.length) { for (const file of job.exported) { const bytes = fileBytes(root, file.path, MAX_OUTPUT); need(bytes.length === file.bytes && digest(bytes) === file.sha256, 'Exported media changed; retain history and create a new reviewed version.'); } return summary(job); }
  const results = job.stagedOutputs.map(item => { const bytes = fileBytes(root, item.path, MAX_OUTPUT); need(bytes.length === item.bytes && digest(bytes) === item.sha256, 'Previously staged provider bytes changed.'); return { bytes, kind: item.kind }; });
  const remote = job.protectedOutputs ? decrypt(job.protectedOutputs, selectedKey(key, job)) : [];
  for (const output of remote) results.push({ bytes: await download(output.url, fetcher), kind: output.kind });
  need(results.length > 0, 'No recoverable outputs; query the original provider job without generating again.');
  const files = results.map(({ bytes, kind }, index) => ({ bytes, kind, path: `influencers/${job.scope.request.characterId}/media/candidates/${id}-${index}.${mediaExtension(bytes, kind)}`, sha256: digest(bytes) }));
  const manifest = files.map(({ path: file, sha256, bytes, kind }) => ({ path: file, sha256, bytes: bytes.length, kind, status: 'draft' }));
  locked(root, state => {
    const current = getJob(state, id); need(current.state === 'succeeded', 'Provider outcome changed before export.');
    if (current.exported.length) return;
    if (current.exportIntent) need(stableHash(current.exportIntent) === stableHash(manifest), 'Recovered output differs from the original export intent.');
    else {
      for (const file of files) need(!fs.existsSync(strictPath(root, file.path, 'file', true)), 'Export conflict; existing files are never overwritten.');
      current.exportIntent = clone(manifest); event(current, 'export-intent', { files: clone(manifest) });
    }
  });
  return locked(root, state => {
    const current = getJob(state, id); need(current.state === 'succeeded' && stableHash(current.exportIntent) === stableHash(manifest), 'Output intent changed.');
    if (current.exported.length) return summary(current);
    for (const file of files) if (fs.existsSync(strictPath(root, file.path, 'file', true))) { const existing = fileBytes(root, file.path, MAX_OUTPUT); need(existing.length === file.bytes.length && digest(existing) === file.sha256, 'Export conflict; recovered files must match the durable original intent.'); }
    mkdir(root, `influencers/${job.scope.request.characterId}/media/candidates`);
    for (const file of files) if (!fs.existsSync(strictPath(root, file.path, 'file', true))) fs.writeFileSync(strictPath(root, file.path, 'file', true), file.bytes, { flag: 'wx' });
    current.exported = clone(manifest);
    event(current, 'exported', { files: clone(current.exported), review: 'pending' }); return summary(current);
  });
}
