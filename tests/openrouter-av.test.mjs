import fs from 'node:fs';
import path from 'node:path';
import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { fixture, scratch, parent, save, hash, provenance, reach, planFor, recordFor, rebind } from './fixtures/stage-readiness.mjs';
import { startRun, transitionRun, readRun } from '../scripts/framework-core.mjs';
import { canonHash } from '../scripts/studio-core.mjs';
import { prepareVideo, describeReferenceUrl, sendVideo, SEEDANCE_MODEL } from '../scripts/openrouter-core.mjs';

const specPath = 'work/seedance-av-v002.json';
const png = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10, 0]);
function wav() {
  const bytes = Buffer.alloc(48); bytes.write('RIFF'); bytes.writeUInt32LE(40, 4); bytes.write('WAVEfmt ', 8); bytes.writeUInt32LE(16, 16); bytes.writeUInt16LE(1, 20); bytes.writeUInt16LE(1, 22); bytes.writeUInt32LE(8000, 24); bytes.writeUInt32LE(16000, 28); bytes.writeUInt16LE(2, 32); bytes.writeUInt16LE(16, 34); bytes.write('data', 36); bytes.writeUInt32LE(4, 40); return bytes;
}
function box(type, payload) { const header = Buffer.alloc(8); header.writeUInt32BE(8 + payload.length); header.write(type, 4); return Buffer.concat([header, payload]); }
function mp4(handler = 'vide') {
  const payload = Buffer.alloc(12); payload.write(handler, 8);
  return Buffer.concat([box('ftyp', Buffer.from('isom0000')), box('moov', box('trak', box('mdia', box('hdlr', payload)))), box('mdat', Buffer.from([1, 2]))]);
}
const env = { OLYMPOX_OPENROUTER_REFERENCE_VOICE_URL: 'https://media.example.com/voice.wav?signature=voice-private', OLYMPOX_OPENROUTER_REFERENCE_VIDEO_URL: 'https://media.example.com/expression.mp4?signature=video-private' };
const catalog = { data: [{ id: SEEDANCE_MODEL, supported_durations: [5], supported_resolutions: ['480p'], supported_aspect_ratios: ['9:16'], supported_frame_images: ['first_frame', 'last_frame'], generate_audio: true, seed: true, pricing_skus: { video_tokens: '0.0000107', video_tokens_with_video_input: '0.0000064' } }] };
function client(submit) { return { checkAuthorization() {}, credentialFingerprint: () => hash(Buffer.from('fixture-key')), models: async () => catalog, submit: submit ?? (async () => ({ id: 'job-av-fixture', status: 'pending', generationId: null, cost: null })) }; }
const verifyReference = async reference => ({ sha256: reference.sha256, bytes: reference.bytes, mimeType: reference.mimeType, checkedAt: new Date().toISOString(), urlFingerprint: hash(Buffer.from(reference.url)), transport: 'https' });

function avFixture({ image = true, audio = true, video = true, wrongVoice = false } = {}) {
  const { root, p } = fixture({ scope: 'speaking' });
  fs.writeFileSync(path.join(root, 'influencers/alpha/references/front.png'), png);
  fs.writeFileSync(path.join(root, 'influencers/alpha/references/voice.wav'), wav());
  fs.writeFileSync(path.join(root, 'influencers/alpha/references/expression.mp4'), mp4());
  p.references[0].sha256 = hash(png); p.references[2].sha256 = hash(wav()); p.voice.selection.sha256 = hash(wav());
  p.references.push({ id: 'expression', role: 'expression', path: 'references/expression.mp4', sha256: hash(mp4()), status: 'approved', origin: 'Synthetic approved video reference', review: { reviewer: 'Fixture', at: p.approval.at, notes: 'Synthetic structure only; no media quality claim.' } });
  p.approval.canonHash = canonHash(p); save(root, 'influencers/alpha/persona.json', p);
  const promptPath = save(root, 'influencers/alpha/prompts/scene-v002.txt', 'Synthetic speech scene following the selected voice and visual references.');
  const references = [];
  function ref(name, role, mediaType, content, urlEnv) {
    const extension = mediaType === 'image' ? 'png' : mediaType === 'audio' ? 'wav' : 'mp4';
    references.push({ path: `influencers/alpha/references/${name}.${extension}`, sha256: hash(content), bytes: content.length, referenceId: name, role, usage: 'reference', order: references.length, mediaType, transport: urlEnv ? { kind: 'https', urlEnv, urlSha256: describeReferenceUrl(urlEnv, env).urlSha256 } : { kind: 'inline' } });
  }
  if (image) ref('front', 'front', 'image', png);
  if (audio) ref('voice', 'voice', 'audio', wav(), 'OLYMPOX_OPENROUTER_REFERENCE_VOICE_URL');
  if (video) ref('expression', 'expression', 'video', mp4(), 'OLYMPOX_OPENROUTER_REFERENCE_VIDEO_URL');
  const spec = { schemaVersion: 2, model: SEEDANCE_MODEL, credentialFingerprint: hash(Buffer.from('fixture-key')), promptPath, parameters: { duration: 5, resolution: '480p', aspect_ratio: '9:16', generate_audio: true }, references };
  if (wrongVoice) {
    const voice = references.find(ref => ref.role === 'voice');
    voice.referenceId = 'unselected-voice'; voice.path = 'influencers/alpha/references/unselected-voice.wav';
    fs.writeFileSync(path.join(root, voice.path), wav());
    p.references.push({ ...p.references.find(ref => ref.id === 'voice'), id: voice.referenceId, path: 'references/unselected-voice.wav' });
    p.approval.canonHash = canonHash(p); save(root, 'influencers/alpha/persona.json', p);
  }
  save(root, specPath, spec);
  return { root, p, spec };
}
function readyAv(options = {}) {
  const setup = avFixture(options), { root, spec } = setup;
  let run = startRun(root, { workflowId: 'produce-piece', personaId: 'alpha', objective: 'Synthetic speaking identity and exact AV references', medium: 'video', mediaProviders: { image: 'higgsfield', video: 'openrouter', audio: 'higgsfield' }, capabilities: ['video-generation', 'openrouter:video-generation', 'video-inspection'] });
  run = reach(root, run);
  const plan = planFor(root, run, { voice: 'reuse' }), execution = plan.stages.find(stage => stage.stepId !== null);
  Object.assign(execution, { provider: 'openrouter', requestedModel: SEEDANCE_MODEL, module: 'video-generation', route: 'openrouter-api', tool: 'openrouter-local' });
  execution.inputSlots = execution.inputSlots.filter(slot => slot.kind !== 'reference');
  for (const ref of spec.references) execution.inputSlots.push({ id: ref.referenceId, kind: 'reference', role: ref.role, order: ref.order, fromStageId: null });
  const record = recordFor(root, run, plan), prepared = prepareVideo(root, specPath, { env });
  const entry = record.stages.find(stage => stage.stageId === execution.id);
  entry.inputs = prepared.files.map((file, index) => ({ slotId: index === 0 ? 'parameters' : index === 1 ? 'prompt' : spec.references[index - 2].referenceId, ...file, referenceId: index >= 2 ? spec.references[index - 2].referenceId : null, role: index >= 2 ? spec.references[index - 2].role : null, order: index >= 2 ? spec.references[index - 2].order : null }));
  entry.acceptedInputs = entry.inputs.map(file => ({ slotId: file.slotId, sha256: file.sha256, bytes: file.bytes, inputId: `synthetic-${file.slotId}`, scopeHash: '0'.repeat(64), provenance: provenance() }));
  for (const stage of [...record.stages, ...record.feasibility.stages].filter(stage => stage.stageId === execution.id)) stage.model = { exposed: true, value: SEEDANCE_MODEL, reason: null, provenance: provenance() };
  rebind(run, record); save(root, 'work/readiness-av.json', record);
  run = transitionRun(root, run.runId, { action: 'record-media-readiness', readinessPath: 'work/readiness-av.json' });
  run = transitionRun(root, run.runId, { action: 'start', stageId: execution.id, job: { provider: 'openrouter' } });
  if (options.expectReady !== false) assert.equal(run.state, 'in-progress', JSON.stringify(run.mediaReadiness));
  return { ...setup, run };
}
after(() => { for (const root of scratch) { assert.equal(path.dirname(root), parent); assert.match(path.basename(root), /^studio-/); fs.rmSync(root, { recursive: true, force: true }); } });

test('version 2 prepares typed image, canonical audio and video references without changing local bytes', () => {
  const { root } = avFixture(), prepared = prepareVideo(root, specPath, { env });
  assert.deepEqual(prepared.payload.input_references.map(ref => ref.type), ['image_url', 'audio_url', 'video_url']);
  assert.equal(prepared.remoteReferences.length, 2); assert.equal(prepared.mediaInputs[1].mimeType, 'audio/wav');
  assert.equal(prepared.mediaInputs[2].mimeType, 'video/mp4');
  assert.equal(prepared.payload.input_references[1].audio_url.url, env.OLYMPOX_OPENROUTER_REFERENCE_VOICE_URL);
  assert.deepEqual(fs.readFileSync(path.join(root, prepared.refs[1].path)), wav());
  assert.doesNotMatch(JSON.stringify(prepared.mediaInputs), /signature=|voice-private|video-private/);
});

test('speaking dispatch binds selected voice, visual canon and both HTTPS readback observations', async () => {
  const { root, run } = readyAv(); let calls = 0; const checked = [];
  const personaBefore = fs.readFileSync(path.join(root, 'influencers/alpha/persona.json'));
  const sent = await sendVideo(root, run.runId, specPath, client(async payload => { calls++; assert.equal(payload.generate_audio, true); assert.deepEqual(payload.input_references.map(ref => ref.type), ['image_url', 'audio_url', 'video_url']); return { id: 'job-av-fixture', status: 'pending', generationId: null, cost: null }; }), { env, verifyReference: async reference => { checked.push(reference.mimeType); return verifyReference(reference); } });
  assert.equal(calls, 1); assert.deepEqual(checked, ['audio/wav', 'video/mp4']);
  const receipt = JSON.parse(fs.readFileSync(path.join(root, sent.receipt)));
  assert.equal(receipt.referenceChecks.length, 2); assert.deepEqual(receipt.mediaInputs.map(ref => ref.mediaType), ['image', 'audio', 'video']);
  assert.doesNotMatch(JSON.stringify(receipt), /https:\/\/|signature=|voice-private|video-private|data:image/);
  assert.deepEqual(fs.readFileSync(path.join(root, 'influencers/alpha/persona.json')), personaBefore);
});

test('a failed HTTPS verification never submits and permits safe read-only preflight again', async () => {
  const { root, run } = readyAv(); let calls = 0;
  const provider = client(async () => { calls++; return { id: 'job-av-fixture', status: 'pending', generationId: null, cost: null }; });
  await assert.rejects(sendVideo(root, run.runId, specPath, provider, { env, verifyReference: async () => { throw new Error('Synthetic readback mismatch'); } }), /readback mismatch/);
  assert.equal(calls, 0); assert.equal(readRun(root, run.runId).state, 'in-progress');
  await sendVideo(root, run.runId, specPath, provider, { env, verifyReference }); assert.equal(calls, 1);
});

test('changed canonical audio or video stops before remote reads and paid submission', async () => {
  for (const refId of ['voice', 'expression']) {
    const { root, run, spec } = readyAv(); const ref = spec.references.find(ref => ref.referenceId === refId); let calls = 0;
    fs.appendFileSync(path.join(root, ref.path), 'Drift');
    await assert.rejects(sendVideo(root, run.runId, specPath, client(), { env, verifyReference: async () => { calls++; } }), /bytes differ/);
    assert.equal(calls, 0);
  }
});

test('canonical voice cannot travel as video, silent output, inline AV or an overridden frame reference', () => {
  const { root, spec } = avFixture();
  const original = structuredClone(spec);
  spec.references[1].mediaType = 'video'; save(root, specPath, spec);
  assert.throws(() => prepareVideo(root, specPath, { env }), /canonical voice must be an audio/);
  Object.assign(spec, structuredClone(original)); spec.parameters.generate_audio = false; save(root, specPath, spec);
  assert.throws(() => prepareVideo(root, specPath, { env }), /generate_audio true/);
  Object.assign(spec, structuredClone(original)); spec.references[1].transport = { kind: 'inline' }; save(root, specPath, spec);
  assert.throws(() => prepareVideo(root, specPath, { env }), /only for images/);
  Object.assign(spec, structuredClone(original)); spec.references[0].usage = 'first_frame'; save(root, specPath, spec);
  assert.throws(() => prepareVideo(root, specPath, { env }), /silently ignored/);
  Object.assign(spec, structuredClone(original)); spec.references[2].usage = 'last_frame'; save(root, specPath, spec);
  assert.throws(() => prepareVideo(root, specPath, { env }), /frames must be images/);
});

test('voice-only execution cannot satisfy the approved visual identity guard', async () => {
  const { root, run } = readyAv({ image: false, video: false });
  await assert.rejects(sendVideo(root, run.runId, specPath, client(), { env, verifyReference }), /selected visual reference/);
});

test('missing or unselected canonical voice cannot acquire a dispatchable start', async () => {
  for (const options of [{ audio: false }, { wrongVoice: true }]) {
    const { root, run } = readyAv({ ...options, expectReady: false });
    assert.equal(run.state, 'awaiting-tool'); assert.equal(run.run.attempts.at(-1).execution, null);
    let submissions = 0;
    await assert.rejects(sendVideo(root, run.runId, specPath, client(async () => { submissions++; }), { env, verifyReference }), /captured readiness/);
    assert.equal(submissions, 0);
  }
});

test('an approved video reference can supply visual identity alongside its selected canonical voice', async () => {
  const { root, run } = readyAv({ image: false });
  await sendVideo(root, run.runId, specPath, client(async payload => {
    assert.deepEqual(payload.input_references.map(ref => ref.type), ['audio_url', 'video_url']);
    return { id: 'job-video-identity', status: 'pending', generationId: null, cost: null };
  }), { env, verifyReference });
});

test('wrong reference MIME and changed or unsafe URL scopes are refused offline', () => {
  const { root, spec } = avFixture();
  const original = structuredClone(spec);
  spec.references[2].mediaType = 'audio'; save(root, specPath, spec);
  assert.throws(() => prepareVideo(root, specPath, { env }), /media type does not match/);
  Object.assign(spec, structuredClone(original)); save(root, specPath, spec);
  assert.throws(() => prepareVideo(root, specPath, { env: { ...env, OLYMPOX_OPENROUTER_REFERENCE_VOICE_URL: 'https://media.example.com/voice.wav?signature=changed' } }), /URL differs/);
  assert.throws(() => describeReferenceUrl('OPENROUTER_API_KEY', { OPENROUTER_API_KEY: 'secret' }), /dedicated/);
  assert.throws(() => describeReferenceUrl('OLYMPOX_OPENROUTER_REFERENCE_BAD_URL', { OLYMPOX_OPENROUTER_REFERENCE_BAD_URL: 'http://127.0.0.1/secret' }));
});

test('MP4 track structure distinguishes audio-only M4A from video even when the path claims audio', () => {
  const { root, spec } = avFixture(); const voice = spec.references[1];
  fs.writeFileSync(path.join(root, voice.path), mp4('soun')); voice.sha256 = hash(mp4('soun')); voice.bytes = mp4('soun').length; save(root, specPath, spec);
  assert.equal(prepareVideo(root, specPath, { env }).mediaInputs[1].mimeType, 'audio/mp4');
  fs.writeFileSync(path.join(root, voice.path), mp4('vide')); voice.sha256 = hash(mp4('vide')); voice.bytes = mp4('vide').length; save(root, specPath, spec);
  assert.throws(() => prepareVideo(root, specPath, { env }), /media type does not match/);
});

test('the offline URL fingerprint CLI never prints a signed path, query or provider credential', () => {
  const urlEnv = 'OLYMPOX_OPENROUTER_REFERENCE_VOICE_URL';
  const result = spawnSync(process.execPath, [fileURLToPath(new URL('../scripts/openrouter-local.mjs', import.meta.url)), 'reference', urlEnv], { encoding: 'utf8', windowsHide: true, env: { ...process.env, ...env, OPENROUTER_API_KEY: 'synthetic-provider-secret' } });
  assert.equal(result.status, 0, result.stderr);
  const data = JSON.parse(result.stdout);
  assert.equal(data.urlSha256, hash(Buffer.from(env[urlEnv]))); assert.equal(data.origin, 'https://media.example.com'); assert.equal(data.downloaded, false);
  assert.doesNotMatch(result.stdout + result.stderr, /voice-private|signature=|voice\.wav|synthetic-provider-secret/);
});
