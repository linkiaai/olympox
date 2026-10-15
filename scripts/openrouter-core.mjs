import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { isFrameworkDevelopment } from './development-context.mjs';
import { strictPath } from './reference-transfer-core.mjs';
import { readinessPath, evaluateMediaReadiness } from './stage-readiness-core.mjs';
import { readRun, transitionRun } from './framework-core.mjs';
import { validateReferenceUrl, verifyHttpsReference } from './openrouter-reference-http.mjs';

export const SEEDANCE_MODEL = 'bytedance/seedance-2.5';
const now = () => new Date().toISOString();
const digest = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const need = (ok, message) => { if (!ok) throw new Error(`OpenRouter: ${message}`); };
const object = value => value && typeof value === 'object' && !Array.isArray(value);
const exact = (value, keys) => object(value) && Object.keys(value).sort().join(',') === [...keys].sort().join(',');
const token = value => typeof value === 'string' && /^[a-zA-Z0-9][a-zA-Z0-9_-]{0,127}$/.test(value);

function studio(root) {
  need(!isFrameworkDevelopment(root), 'media operations require an independent installed studio.');
}
function input(root, relative, personaId, maximum) {
  const target = readinessPath(root, relative, personaId);
  const stat = fs.statSync(target);
  need(stat.size > 0 && stat.size <= maximum, 'input exceeds its byte limit or is empty.');
  const bytes = fs.readFileSync(target);
  need(bytes.length === stat.size, 'input changed during inspection.');
  return { path: relative, sha256: digest(bytes), bytes: bytes.length, content: bytes };
}
function imageType(bytes) {
  if (bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) return 'image/png';
  if (bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255) return 'image/jpeg';
  if (bytes.toString('ascii', 0, 4) === 'RIFF' && bytes.toString('ascii', 8, 12) === 'WEBP') return 'image/webp';
  throw new Error('OpenRouter: only PNG, JPEG and WebP local image transport is supported; decoding and fidelity require separate inspection.');
}

// Inspect container structure without transcoding or claiming audiovisual decoding.
function mp4Type(bytes) {
  need(bytes.length >= 16 && bytes.toString('ascii', 4, 8) === 'ftyp', 'unsupported MP4 container.');
  const handlers = new Set(); let boxes = 0;
  function walk(start, end, depth = 0) {
    need(depth <= 4, 'MP4 container nesting exceeds the inspection limit.');
    for (let at = start; at < end;) {
      need(++boxes <= 10000 && at + 8 <= end, 'invalid or excessive MP4 boxes.');
      let size = bytes.readUInt32BE(at), header = 8;
      const kind = bytes.toString('ascii', at + 4, at + 8);
      if (size === 1) { need(at + 16 <= end, 'truncated MP4 box.'); const large = bytes.readBigUInt64BE(at + 8); need(large <= BigInt(Number.MAX_SAFE_INTEGER), 'MP4 box is too large.'); size = Number(large); header = 16; }
      if (size === 0) size = end - at;
      need(size >= header && at + size <= end, 'MP4 box exceeds its container.');
      if (['moov', 'trak', 'mdia'].includes(kind)) walk(at + header, at + size, depth + 1);
      if (kind === 'hdlr') { need(size >= header + 12, 'invalid MP4 track handler.'); handlers.add(bytes.toString('ascii', at + header + 8, at + header + 12)); }
      at += size;
    }
  }
  walk(0, bytes.length);
  if (handlers.has('vide')) return 'video/mp4';
  need(handlers.has('soun'), 'MP4 needs an identifiable audio or video track.');
  return 'audio/mp4';
}
function referenceType(bytes, mediaType) {
  if (mediaType === 'image') return imageType(bytes);
  let mime;
  if (bytes.toString('ascii', 0, 4) === 'RIFF' && bytes.toString('ascii', 8, 12) === 'WAVE') mime = 'audio/wav';
  else if (bytes.toString('ascii', 0, 4) === 'fLaC') mime = 'audio/flac';
  else if (bytes.toString('ascii', 0, 3) === 'ID3' || bytes[0] === 255 && (bytes[1] & 224) === 224 && (bytes[1] & 6) !== 0) mime = 'audio/mpeg';
  else if (bytes.toString('ascii', 0, 4) === 'OggS' && (bytes.subarray(0, 4096).includes(Buffer.from('OpusHead')) || bytes.subarray(0, 4096).includes(Buffer.from([1, 118, 111, 114, 98, 105, 115])))) mime = 'audio/ogg';
  else if (bytes.toString('ascii', 4, 8) === 'ftyp') mime = mp4Type(bytes);
  need(mime?.startsWith(`${mediaType}/`), 'declared media type does not match a supported audio/video container.');
  return mime;
}
export function describeReferenceUrl(urlEnv, env = process.env) {
  need(typeof urlEnv === 'string' && /^OLYMPOX_OPENROUTER_REFERENCE_[A-Z][A-Z0-9_]{0,63}$/.test(urlEnv), 'use a dedicated OLYMPOX_OPENROUTER_REFERENCE_ environment variable.');
  const url = validateReferenceUrl(env[urlEnv]);
  return { urlEnv, urlSha256: digest(Buffer.from(url.href)), origin: url.origin, url: url.href };
}

// Read bytes once. The in-memory payload is the same one checked against captured inputs.
export function prepareVideo(root, specPath, { env = process.env } = {}) {
  studio(root);
  const specFile = input(root, specPath, null, 1024 * 1024);
  let spec;
  try { spec = JSON.parse(specFile.content.toString('utf8')); } catch { throw new Error('OpenRouter: invalid request specification JSON.'); }
  need(exact(spec, ['schemaVersion', 'model', 'credentialFingerprint', 'promptPath', 'parameters', 'references']) && [1, 2].includes(spec.schemaVersion) && spec.model === SEEDANCE_MODEL, 'use a version 1 or 2 Seedance 2.5 specification without unknown fields or model substitutions.');
  need(typeof spec.credentialFingerprint === 'string' && /^[a-f0-9]{64}$/.test(spec.credentialFingerprint), 'bind the credential fingerprint from doctor; no API key belongs in a specification.');
  const personaId = /^influencers\/([a-z0-9]+(?:-[a-z0-9]+)*)\/prompts\//.exec(spec.promptPath)?.[1];
  need(personaId, 'promptPath must be in the bound character prompts directory.');
  const prompt = input(root, spec.promptPath, personaId, 64 * 1024);
  const promptText = new TextDecoder('utf-8', { fatal: true }).decode(prompt.content);
  need(promptText.trim() && !promptText.includes('\0'), 'provide a nonempty UTF-8 prompt.');
  const p = spec.parameters;
  need(object(p) && Object.keys(p).every(key => ['duration', 'resolution', 'aspect_ratio', 'generate_audio', 'seed'].includes(key)), 'unsupported video parameter.');
  need(Number.isInteger(p.duration) && p.duration >= 4 && p.duration <= 30 && ['480p', '720p'].includes(p.resolution) && ['16:9', '4:3', '1:1', '3:4', '9:16', '21:9'].includes(p.aspect_ratio) && typeof p.generate_audio === 'boolean', 'explicit Seedance duration, resolution, aspect_ratio and generate_audio are required.');
  need(p.seed === undefined || Number.isSafeInteger(p.seed) && p.seed >= 0, 'seed must be a nonnegative safe integer.');
  need(Array.isArray(spec.references) && spec.references.length <= 50, 'references must be a bounded list.');
  const payload = { model: spec.model, prompt: promptText, ...p }, files = [specFile, prompt];
  const refs = [], remoteReferences = [], mediaInputs = [], ids = new Set(), frameRoles = new Set();
  let total = 0;
  for (const [order, ref] of spec.references.entries()) {
    const version2 = spec.schemaVersion === 2;
    need(exact(ref, ['path', 'sha256', 'bytes', 'referenceId', 'role', 'usage', 'order', ...(version2 ? ['mediaType', 'transport'] : [])]) && token(ref.referenceId) && !ids.has(ref.referenceId) && ref.order === order && typeof ref.role === 'string' && /^[a-z][a-z0-9-]{0,63}$/.test(ref.role) && ['reference', 'first_frame', 'last_frame'].includes(ref.usage), 'invalid reference identity, canonical role, transport usage or order.');
    const mediaType = version2 ? ref.mediaType : 'image';
    need(['image', 'audio', 'video'].includes(mediaType), 'unsupported reference mediaType.');
    need(ref.usage === 'reference' || mediaType === 'image', 'first and last frames must be images; use general-reference mode for audio and video.');
    need(ref.role !== 'voice' || mediaType === 'audio', 'the canonical voice must be an audio reference; video speech cannot substitute for it.');
    need(ref.role !== 'voice' || p.generate_audio, 'a voice attachment requires generate_audio true.');
    need(typeof ref.path === 'string' && (ref.path.startsWith(`influencers/${personaId}/references/`) || ref.path.startsWith(`influencers/${personaId}/media/`)), 'references must belong to this character.');
    const maximum = !version2 || mediaType === 'image' ? 16 : mediaType === 'audio' ? 32 : 64;
    const source = input(root, ref.path, personaId, maximum * 1024 * 1024);
    need(source.sha256 === ref.sha256 && source.bytes === ref.bytes, 'reference bytes differ from their declaration.');
    total += source.bytes; need(total <= (version2 ? 64 : 16) * 1024 * 1024, 'aggregate local references exceed the adapter byte limit.');
    const mimeType = referenceType(source.content, mediaType), transport = version2 ? ref.transport : { kind: 'inline' };
    let url, urlFingerprint = null;
    if (transport?.kind === 'inline') {
      need(exact(transport, ['kind']) && mediaType === 'image', 'inline data URLs are supported only for images; audio and video need verified HTTPS access.');
      url = `data:${mimeType};base64,${source.content.toString('base64')}`;
    } else {
      need(exact(transport, ['kind', 'urlEnv', 'urlSha256']) && transport.kind === 'https', 'invalid HTTPS reference transport.');
      const checked = describeReferenceUrl(transport.urlEnv, env);
      need(checked.urlSha256 === transport.urlSha256, 'reference URL differs from the captured transport scope.');
      url = checked.url; urlFingerprint = checked.urlSha256;
      remoteReferences.push({ url, sha256: source.sha256, bytes: source.bytes, mimeType });
    }
    const key = `${mediaType}_url`, media = { type: key, [key]: { url } };
    if (ref.usage === 'reference') (payload.input_references ??= []).push(media);
    else {
      need(!frameRoles.has(ref.usage), 'duplicate first or last frame.'); frameRoles.add(ref.usage);
      (payload.frame_images ??= []).push({ ...media, frame_type: ref.usage });
    }
    ids.add(ref.referenceId); files.push(source); refs.push({ ...ref, mediaType });
    mediaInputs.push({ referenceId: ref.referenceId, role: ref.role, usage: ref.usage, mediaType, mimeType, sha256: source.sha256, bytes: source.bytes, transport: transport.kind, urlFingerprint });
  }
  need(!(payload.frame_images && payload.input_references), 'frame images override input_references; choose one mode so no reference is silently ignored.');
  need(new Set(files.map(file => file.path)).size === files.length, 'each input path must be distinct.');
  return { payload, personaId, refs, remoteReferences, mediaInputs, credentialFingerprint: spec.credentialFingerprint, files: files.map(({ content, ...file }) => file), requestHash: digest(Buffer.from(JSON.stringify(payload))), model: spec.model, parameters: p };
}

export function validateVideoCatalog(prepared, catalog) {
  const model = catalog?.data?.find(item => item.id === prepared.model);
  need(model, 'the exact requested model is absent from the current video catalog; no fallback was selected.');
  for (const [parameter, field] of [['duration', 'supported_durations'], ['resolution', 'supported_resolutions'], ['aspect_ratio', 'supported_aspect_ratios']]) need(Array.isArray(model[field]) && model[field].includes(prepared.parameters[parameter]), 'requested parameters are not accepted by the current video catalog.');
  need(!prepared.parameters.generate_audio || model.generate_audio === true, 'generated audio support remains pending.');
  need(prepared.parameters.seed === undefined || model.seed === true, 'seed support remains pending.');
  for (const ref of prepared.refs.filter(ref => ref.usage !== 'reference')) need(model.supported_frame_images?.includes(ref.usage), 'requested frame role is not supported.');
  return { id: model.id, canonicalSlug: model.canonical_slug ?? null, pricingSkus: model.pricing_skus ?? {}, observedAt: now(), limitation: 'Public catalog and pricing SKUs are not account access, a scoped quote, spending authorization, accepted reference evidence or a successful pilot.' };
}

function activeContext(root, runId, prepared = null) {
  studio(root);
  const state = readRun(root, runId), a = state.run.attempts.at(-1), captured = a.execution?.mediaReadiness;
  need(captured && state.nextTask?.expectedDelivery === 'media' && state.nextTask.medium === 'video' && a.mediaProviders?.video === 'openrouter', 'an active OpenRouter video stage with captured readiness is required.');
  const stage = a.mediaReadiness.plan.stages.find(item => item.id === captured.stageId);
  need(stage?.stepId === state.nextTask.stepId && stage.provider === 'openrouter' && stage.requestedModel === SEEDANCE_MODEL && stage.module === 'video-generation' && stage.route === 'openrouter-api' && stage.tool === 'openrouter-local', 'captured method must match the exact OpenRouter adapter and Seedance 2.5 model.');
  if (prepared) {
    need(!state.drift.length && !state.missingCapabilities.length && state.run.personaId === prepared.personaId && evaluateMediaReadiness(root, state.run, { captured }).canStartStage && evaluateMediaReadiness(root, state.run).canStartStage, 'run inputs, canon, current quotes, grants or capabilities are no longer ready.');
    need([captured.quote, ...captured.feasibilityQuotes.map(item => item.quote)].every(quote => quote.expiresAt === null || Date.parse(quote.expiresAt) >= Date.now()), 'captured quote expired before actual dispatch; prepare a newly authorized attempt.');
    need(captured.inputs.length === prepared.files.length, 'every captured input must be included in this exact request.');
    need(!state.run.canonBinding || prepared.refs.some(ref => ['image', 'video'].includes(ref.mediaType) && ref.role !== 'voice'), 'approved canon requires an actual selected visual reference; audio-only or prompt-only production remains pending.');
    const voice = a.mediaReadiness.plan.requirements.find(item => item.id === 'voice');
    need(voice?.applicability === 'not-required' || prepared.parameters.generate_audio === true, 'speaking execution requires generate_audio true and the selected canonical audio.');
    for (const [index, file] of prepared.files.entries()) {
      const bound = captured.inputs.find(item => item.path === file.path);
      const slot = stage.inputSlots.find(item => item.id === bound?.slotId);
      need(bound && bound.sha256 === file.sha256 && bound.bytes === file.bytes && slot?.kind === (index === 0 ? 'parameters' : index === 1 ? 'prompt' : 'reference'), 'request files do not match the captured stage input bytes and kinds.');
      if (index >= 2) { const ref = prepared.refs[index - 2]; need(bound.referenceId === ref.referenceId && bound.role === ref.role && bound.order === ref.order, 'reference roles/order do not match captured readiness.'); }
    }
  }
  const relative = `influencers/${state.run.personaId}/.openrouter/${runId}/${captured.id}.json`;
  return { state, a, captured, relative };
}
function saveReceipt(root, relative, receipt, exclusive = false) {
  const target = strictPath(root, relative, 'file', true);
  if (exclusive) {
    fs.mkdirSync(path.dirname(target), { recursive: true }); strictPath(root, relative, 'file', true);
    fs.writeFileSync(target, JSON.stringify(receipt, null, 2) + '\n', { flag: 'wx', mode: 0o600 });
  } else {
    const temporary = `${relative}.tmp-${crypto.randomUUID()}`, staged = strictPath(root, temporary, 'file', true);
    fs.writeFileSync(staged, JSON.stringify(receipt, null, 2) + '\n', { flag: 'wx', mode: 0o600 });
    fs.renameSync(staged, target);
  }
}
function receiptFor(root, context) {
  const receipt = JSON.parse(fs.readFileSync(strictPath(root, context.relative), 'utf8'));
  need(receipt.schemaVersion === 1 && receipt.runId === context.state.runId && receipt.attemptId === context.a.id && receipt.captureId === context.captured.id && receipt.model === SEEDANCE_MODEL, 'receipt does not match the captured run.');
  return receipt;
}

async function receiptLock(root, relative, operation) {
  const lockPath = strictPath(root, `${relative}.lock`, 'file', true);
  fs.mkdirSync(path.dirname(lockPath), { recursive: true }); strictPath(root, `${relative}.lock`, 'file', true);
  if (fs.existsSync(lockPath)) {
    let owner;
    try { owner = JSON.parse(fs.readFileSync(lockPath, 'utf8')); } catch { throw new Error('OpenRouter: receipt lock cannot be inspected; check the original operation.'); }
    need(Number.isInteger(owner.pid) && owner.pid > 0, 'receipt lock owner is unknown; inspect before continuing.');
    let dead = false;
    try { process.kill(owner.pid, 0); } catch (error) { dead = error.code === 'ESRCH'; }
    need(dead, 'receipt is in use or its owner cannot be inspected.');
    fs.unlinkSync(lockPath);
  }
  const handle = fs.openSync(lockPath, 'wx');
  try { fs.writeFileSync(handle, JSON.stringify({ pid: process.pid })); return await operation(); }
  finally { fs.closeSync(handle); fs.unlinkSync(lockPath); }
}

export async function sendVideo(root, runId, specPath, client, options = {}) {
  client.checkAuthorization();
  const context = activeContext(root, runId);
  return receiptLock(root, context.relative, () => sendVideoUnlocked(root, runId, specPath, client, options));
}
export async function videoStatus(root, runId, client) {
  const context = activeContext(root, runId);
  return receiptLock(root, context.relative, () => videoStatusUnlocked(root, runId, client));
}
export async function exportVideo(root, runId, outputPath, client) {
  const context = activeContext(root, runId);
  return receiptLock(root, context.relative, () => exportVideoUnlocked(root, runId, outputPath, client));
}

async function sendVideoUnlocked(root, runId, specPath, client, { env = process.env, verifyReference = verifyHttpsReference } = {}) {
  client.checkAuthorization();
  const prepared = prepareVideo(root, specPath, { env }), context = activeContext(root, runId, prepared);
  need(client.credentialFingerprint() === prepared.credentialFingerprint, 'current credential differs from the captured request; preserve the original account and authorization context.');
  need(context.a.state === 'in-progress' && context.a.job?.status === 'planned' && context.a.job.provider === 'openrouter' && !context.a.job.jobId, 'record a fresh external intent with the captured start before sending; unresolved outcomes cannot be retried.');
  // Public catalog reads precede the durable single-dispatch barrier.
  const catalog = validateVideoCatalog(prepared, await client.models());
  const referenceChecks = [];
  for (const reference of prepared.remoteReferences) referenceChecks.push(await verifyReference(reference));
  const refreshed = activeContext(root, runId, prepared);
  need(refreshed.captured.id === context.captured.id && refreshed.a.id === context.a.id && refreshed.a.state === 'in-progress' && refreshed.a.job?.status === 'planned' && !refreshed.a.job.jobId, 'external intent changed during preflight; nothing was submitted.');
  const receipt = { schemaVersion: 1, runId, attemptId: context.a.id, captureId: context.captured.id, provider: 'openrouter', model: prepared.model, credentialFingerprint: prepared.credentialFingerprint, requestHash: prepared.requestHash, inputs: prepared.files, mediaInputs: prepared.mediaInputs, referenceChecks, catalog, status: 'submitting', jobId: null, generationId: null, cost: null, createdAt: now(), updatedAt: now() };
  saveReceipt(root, context.relative, receipt, true);
  let job;
  try {
    job = await client.submit(prepared.payload);
    Object.assign(receipt, { status: job.status, jobId: job.id, generationId: job.generationId, cost: job.cost, updatedAt: now() });
    saveReceipt(root, context.relative, receipt);
  } catch {
    receipt.status = 'uncertain'; receipt.updatedAt = now();
    try { saveReceipt(root, context.relative, receipt); } catch { /* The existing submitting barrier still forbids another send. */ }
    try { transitionRun(root, runId, { action: 'uncertain', job: { provider: 'openrouter', ...(job ? { jobId: job.id } : {}) }, reason: 'OpenRouter submission outcome or receipt persistence is uncertain. Query the original job; never resubmit automatically.' }); } catch { /* Preserve the original intent and receipt even if the run cannot be updated. */ }
    throw new Error(`OpenRouter: submission needs reconciliation; never resend.${job ? ` Original job: ${job.id}.` : ' No job ID was confirmed.'}`);
  }
  transitionRun(root, runId, { action: 'uncertain', job: { provider: 'openrouter', jobId: job.id }, reason: 'Original OpenRouter video job awaits terminal status and reconciliation.' });
  return { receipt: context.relative, jobId: job.id, status: job.status, cost: job.cost, limitation: 'Submission acknowledgement does not establish completed media or quality.' };
}

async function videoStatusUnlocked(root, runId, client) {
  const context = activeContext(root, runId), receipt = receiptFor(root, context);
  need(client.credentialFingerprint() === receipt.credentialFingerprint, 'use the original credential to query this job.');
  need(token(receipt.jobId), 'original job ID remains unknown; reconcile using actual service evidence before any new attempt.');
  const job = await client.status(receipt.jobId);
  need(job.id === receipt.jobId, 'provider returned a different job; original outcome remains unresolved.');
  const terminal = status => ['completed', 'failed', 'cancelled', 'expired'].includes(status);
  need(!terminal(receipt.status) || receipt.status === job.status, 'original terminal job status changed; preserve the receipt and reconcile service evidence.');
  Object.assign(receipt, { status: job.status, generationId: job.generationId ?? receipt.generationId, cost: job.cost ?? receipt.cost, updatedAt: now() });
  saveReceipt(root, context.relative, receipt);
  if (['completed', 'failed', 'cancelled', 'expired'].includes(job.status) && ['planned', 'submitted', 'pending', 'unknown'].includes(context.a.job?.status)) {
    transitionRun(root, runId, { action: 'resolve', job: { provider: 'openrouter', jobId: job.id, status: job.status === 'completed' ? 'succeeded' : 'failed' }, evidence: { type: 'reconciled', performed: true, actor: 'openrouter-local', at: now(), eventId: crypto.randomUUID(), notes: `Read the original OpenRouter job; terminal status ${job.status}.` } });
  }
  return { receipt: context.relative, jobId: job.id, status: job.status, cost: receipt.cost, currency: receipt.cost === null ? null : 'USD' };
}

async function exportVideoUnlocked(root, runId, outputPath, client) {
  const context = activeContext(root, runId), receipt = receiptFor(root, context);
  need(client.credentialFingerprint() === receipt.credentialFingerprint, 'use the original credential to export this job.');
  const prefix = `influencers/${context.state.run.personaId}/`;
  need(typeof outputPath === 'string' && (outputPath.startsWith(`${prefix}media/`) || outputPath.startsWith(`${prefix}exports/`)) && outputPath.endsWith('.mp4'), 'export must be a new MP4 in the bound character media or exports directory.');
  const target = strictPath(root, outputPath, 'file', true);
  need(!fs.existsSync(target), 'export destination already exists; preserve it and choose a new version.');
  need(receipt.status === 'completed' && token(receipt.jobId), 'query the original job to confirmed completion before export.');
  const { bytes } = await client.content(receipt.jobId);
  need(bytes.length >= 12 && bytes.toString('ascii', 4, 8) === 'ftyp', 'content is not an MP4 file; no final asset was written.');
  fs.mkdirSync(path.dirname(target), { recursive: true }); strictPath(root, outputPath, 'file', true);
  fs.writeFileSync(target, bytes, { flag: 'wx' });
  const file = { path: outputPath, bytes: bytes.length, sha256: digest(bytes) };
  receipt.exports ??= []; receipt.exports.push({ ...file, at: now() }); receipt.updatedAt = now(); saveReceipt(root, context.relative, receipt);
  return { ...file, jobId: receipt.jobId, cost: receipt.cost, limitation: 'Exported original response bytes still require asset registration, execution sealing and complete visual/audio review.' };
}
