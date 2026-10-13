import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { spawnSync } from 'node:child_process';
import { createBytePlusProvider, BYTEPLUS_MODELS } from '../scripts/providers/byteplus.mjs';
import { prepareJob, submitJob, pollJob, exportJob, readJob, listJobs, setBudget, getBudget, reconcileJob, cancelJob, dispatchQueue } from '../scripts/provider-execution-core.mjs';
import { canonHash, snapshotCanon, validatePersona } from '../scripts/studio-core.mjs';
import { startRun, readRun } from '../scripts/framework-core.mjs';
import { fixture as workflowFixture, parent as workflowParent, scratch as workflowScratch, reach, planFor, recordFor, rebind, importRecord } from './fixtures/stage-readiness.mjs';

const project = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const parent = path.join(project, 'tmp/provider-execution-tests');
const scratch = [];
const at = '2026-10-13T12:00:00.000Z';
const secret = 'synthetic-consumer-ark-key';
const speechSecret = 'synthetic-consumer-speech-key';
const outputKey = crypto.createHash('sha256').update('Synthetic private output key').digest();
const png = Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), Buffer.from('Synthetic PNG body: byte transport only, not visual fidelity.')]);
const mp3 = Buffer.from('ID3\x04\x00\x00Synthetic MP3 body: byte transport only, not actual listened speech.', 'latin1');
const mp4 = Buffer.concat([Buffer.from([0, 0, 0, 24]), Buffer.from('ftypisom\x00\x00\x00\x00Synthetic video body', 'latin1')]);
const signedURL = 'https://ark-content-generation-ap-southeast-1.tos-ap-southeast-1.volces.com/original.mp4?signature=synthetic-private-signature';
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const clone = value => structuredClone(value);
const provenance = eventId => ({ actor: 'Synthetic local observer', at, eventId, source: 'Synthetic HTTP fixture', notes: 'Structural evidence only; no actual provider generation or human media inspection.' });
function write(root, relative, value) {
  const absolute = path.join(root, relative); fs.mkdirSync(path.dirname(absolute), { recursive: true });
  fs.writeFileSync(absolute, Buffer.isBuffer(value) || typeof value === 'string' ? value : JSON.stringify(value, null, 2) + '\n');
  return relative;
}
const json = file => JSON.parse(fs.readFileSync(file, 'utf8'));
function fixture(options = {}) {
  fs.mkdirSync(parent, { recursive: true });
  const root = fs.mkdtempSync(path.join(parent, 'studio-')); scratch.push(root);
  fs.cpSync(path.join(project, 'framework'), path.join(root, 'framework'), { recursive: true });
  fs.cpSync(path.join(project, 'scripts'), path.join(root, 'scripts'), { recursive: true });
  for (const relative of ['CONSTITUTION.md', 'docs/studio-team.md', 'scripts/providers/byteplus.mjs', 'scripts/provider-execution-core.mjs']) write(root, relative, fs.readFileSync(path.join(project, relative)));
  write(root, 'AGENTS.md', fs.readFileSync(path.join(project, 'templates/studio-AGENTS.md')));
  const characters = options.characters ?? ['alpha'];
  const personas = {};
  for (const id of characters) {
    const base = path.join(root, 'influencers', id);
    const persona = json(path.join(project, options.legacy ? 'tests/fixtures/legacy-persona-v1.json' : 'templates/persona.json'));
    Object.assign(persona, { id, status: options.approved ? 'canon-approved' : 'draft' });
    Object.assign(persona.profile, { name: `Synthetic ${id}`, age: 30, audience: 'Internal tests', valueProposition: 'Verify reusable execution and preservation', backstory: 'An invented adult character used only in tests.' });
    Object.assign(persona.identity, { face: 'Oval', eyes: 'Brown', hair: 'Short', skin: 'Natural', body: 'Adult proportions', invariants: ['Facial structure', 'Proportions'] });
    const scope = options.voice ?? 'unspecified';
    Object.assign(persona.voice, { language: 'pt-BR', accent: 'Brazilian', tone: 'Calm', pace: 'Moderate', referenceId: scope === 'speaking' ? 'voice' : null });
    if (!options.legacy) Object.assign(persona.voice, { applicability: scope, selection: null });
    persona.references = [['front', 'front.png', 'front', png], ['angle', 'angle.png', 'three-quarter', Buffer.concat([png, Buffer.from('second angle')])], ...(scope === 'speaking' ? [['voice', 'voice.mp3', 'voice', mp3]] : [])].map(([referenceId, name, role, bytes]) => {
      write(root, `influencers/${id}/references/${name}`, bytes);
      return { id: referenceId, path: `references/${name}`, role, status: 'approved', origin: 'Synthetic original reference', sha256: hash(bytes), review: { reviewer: 'Synthetic reviewer', at, notes: 'Metadata simulation only.' } };
    });
    if (!options.legacy && scope === 'speaking' && options.selectedVoice !== false) persona.voice.selection = {
      referenceId: 'voice', path: 'references/voice.mp3', sha256: hash(mp3), method: 'listening', performed: true, generated: true, listened: true, selected: true,
      reviewer: 'Synthetic reviewer', at, eventId: 'synthetic-selection', source: 'Synthetic declaration', notes: 'Fixture declaration; not actual listening.', criticalIssues: [], limitations: [],
    };
    if (options.approved) persona.approval = { reviewer: 'Synthetic reviewer', at, notes: 'Fixture canon approval only.', canonHash: canonHash(persona) };
    write(root, `influencers/${id}/persona.json`, persona);
    write(root, `influencers/${id}/assets.json`, { schemaVersion: 1, assets: [] });
    write(root, `influencers/${id}/prompts/scene.txt`, `Synthetic ${id} scene with ordered exact references.`);
    write(root, `influencers/${id}/decisions.md`, 'Existing private decisions must remain unchanged.');
    fs.mkdirSync(path.join(base, 'media'), { recursive: true });
    if (options.approved) { assert.deepEqual(validatePersona(persona, base).errors, []); snapshotCanon(persona, base); }
    personas[id] = persona;
  }
  write(root, 'unrelated-private-note.txt', 'Preserve unrelated studio work.');
  return { root, personas, base: id => path.join(root, 'influencers', id) };
}
function descriptor(f, { characterId = 'alpha', medium = 'image', purpose = 'reference', referenceIds = ['front'], hasSpeech = medium === 'audio', parameters = {} } = {}) {
  const persona = f.personas[characterId];
  return {
    schemaVersion: 1, characterId, medium, purpose, provider: 'byteplus', model: BYTEPLUS_MODELS[medium], promptPath: `influencers/${characterId}/prompts/scene.txt`,
    parameters: medium === 'video' ? { duration: 5, resolution: '480p', ratio: '16:9', generate_audio: hasSpeech, ...parameters } : medium === 'audio' ? { speaker_id: 'en_female_skye_emo_v2_mars_bigtts', format: 'mp3', ...parameters } : parameters,
    references: (medium === 'audio' ? [] : referenceIds).map((id, order) => {
      const ref = persona.references.find(ref => ref.id === id), bytes = fs.readFileSync(path.join(f.base(characterId), ref.path));
      return { referenceId: id, path: ref.path, sha256: hash(bytes), bytes: bytes.length, kind: ref.role === 'voice' ? 'audio' : 'image', role: ref.role, order, providerRole: ref.role === 'voice' ? 'reference_audio' : 'reference_image' };
    }),
    hasSpeech, destination: { accountLabel: 'Synthetic own consumer account', region: 'ap-southeast-1' }, runBinding: null,
  };
}
function grant(job, maximumUSD = 2, extra = {}) {
  return { schemaVersion: 1, requestHash: job.requestHash, explicit: true, maximumUSD, acceptEstimatedCost: true, acceptUnknownCost: true, expiresAt: new Date(Date.now() + 3600000).toISOString(), provenance: provenance('synthetic-spend-grant'), ...extra };
}
function budget(f, maximumUSD = 10, extra = {}) {
  return setBudget(f.root, { schemaVersion: 1, maximumUSD, perCharacter: {}, maxConcurrent: 1, provenance: provenance('synthetic-budget'), ...extra });
}
const response = (value, status = 200) => new Response(JSON.stringify(value), { status, headers: { 'Content-Type': 'application/json' } });
function transport(handler = () => response({ data: [{ b64_json: png.toString('base64'), output_format: 'png' }] }), credentials = { apiKey: secret, speechApiKey: speechSecret }) {
  const calls = [];
  const fetch = async (url, init = {}) => { const call = { url, ...init, payload: init.body ? JSON.parse(init.body) : null }; calls.push(call); return handler(call, calls.length); };
  return { calls, fetch, driver: createBytePlusProvider({ fetch, credentials, timeoutMs: 1000 }) };
}
function tree(root, prefix = '') {
  const records = [];
  function walk(relative) {
    const absolute = path.join(root, relative);
    for (const name of fs.readdirSync(absolute).sort()) {
      const item = relative ? `${relative}/${name}` : name, stat = fs.lstatSync(path.join(root, item));
      if (stat.isSymbolicLink()) records.push([item, 'link', fs.readlinkSync(path.join(root, item))]);
      else if (stat.isDirectory()) { records.push([item, 'directory']); walk(item); }
      else records.push([item, hash(fs.readFileSync(path.join(root, item)))]);
    }
  }
  walk(prefix); return records;
}
function preserved(f, id = 'alpha') {
  const base = f.base(id), files = ['persona.json', 'assets.json', 'decisions.md'];
  return { files: files.map(file => [file, fs.readFileSync(path.join(base, file))]), canon: fs.existsSync(path.join(base, 'canon')) ? tree(base, 'canon') : null, refs: tree(base, 'references') };
}
test.after(() => {
  for (const root of scratch) {
    assert.equal(path.dirname(path.resolve(root)), path.resolve(parent)); assert.match(path.basename(root), /^studio-/);
    fs.rmSync(root, { recursive: true, force: true });
  }
  for (const root of workflowScratch) {
    assert.equal(path.dirname(path.resolve(root)), path.resolve(workflowParent)); assert.match(path.basename(root), /^studio-/);
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('offline preparation stores immutable exact inputs; own credentials and budget are required before any paid call', async () => {
  const f = fixture(), t = transport(undefined, {}), before = preserved(f);
  const req = descriptor(f, { referenceIds: ['angle', 'front'] }), job = prepareJob(f.root, req, { driver: t.driver });
  assert.equal(job.state, 'prepared'); assert.match(job.requestHash, /^[a-f0-9]{64}$/); assert.equal(t.calls.length, 0);
  assert.equal(getBudget(f.root).budget, null);
  assert.equal(readJob(f.root, job.id).state, 'prepared');
  const privateJob = json(path.join(f.root, job.receiptPath));
  assert.deepEqual(fs.readFileSync(path.join(f.root, privateJob.scope.inputs[1].snapshotPath)), fs.readFileSync(path.join(f.base('alpha'), 'references/angle.png')));
  await assert.rejects(submitJob(f.root, job.id, grant(job), { driver: t.driver, outputKey }), /own provider credential/);
  assert.equal(readJob(f.root, job.id).reservedUSD, null);
  const own = transport();
  await assert.rejects(submitJob(f.root, job.id, grant(job), { driver: own.driver, outputKey }), /own studio budget/);
  assert.equal(own.calls.length, 0); assert.equal(t.calls.length, 0); assert.deepEqual(preserved(f), before);
});

test('production image export preserves original reference/canon bytes and never approves or registers generated media', async () => {
  const f = fixture({ approved: true, voice: 'silent' }), before = preserved(f), t = transport(); budget(f);
  const req = descriptor(f, { purpose: 'production', referenceIds: ['angle', 'front'] }), prepared = prepareJob(f.root, req, { driver: t.driver });
  const result = await submitJob(f.root, prepared.id, grant(prepared), { driver: t.driver, outputKey });
  assert.equal(result.state, 'succeeded'); assert.equal(result.outputs.length, 0); assert.equal(result.actualCostUSD, null); assert.equal(result.reservedUSD, 2);
  assert.equal(t.calls.length, 1); assert.deepEqual(t.calls[0].payload.image.map(url => Buffer.from(url.split(',')[1], 'base64')), req.references.map(ref => fs.readFileSync(path.join(f.base('alpha'), ref.path))));
  const exported = await exportJob(f.root, prepared.id, { fetch: () => assert.fail('Inline output must not download'), outputKey });
  assert.equal(exported.outputs.length, 1); assert.equal(exported.outputs[0].status, 'draft'); assert.equal(exported.outputs[0].sha256, hash(png)); assert.equal(exported.outputs[0].bytes, png.length);
  assert.deepEqual(fs.readFileSync(path.join(f.root, exported.outputs[0].path)), png);
  assert.deepEqual(preserved(f), before); assert.equal(json(path.join(f.base('alpha'), 'assets.json')).assets.length, 0);
  assert.deepEqual((await exportJob(f.root, prepared.id, { outputKey })).outputs, exported.outputs); assert.equal(t.calls.length, 1);
  assert.equal(getBudget(f.root).committedUSD, 2);
  reconcileJob(f.root, prepared.id, { schemaVersion: 1, requestHash: prepared.requestHash, providerJobId: null, status: 'succeeded', actualCostUSD: 0.25, provenance: provenance('actual-invoice') });
  assert.equal(getBudget(f.root).committedUSD, 0.25); assert.equal(readJob(f.root, prepared.id).actualCostUSD, 0.25);
});

test('prompt/reference/snapshot drift and unsupported descriptor paths refuse before HTTP and preserve history', async () => {
  for (const drift of ['prompt', 'reference', 'snapshot']) {
    const f = fixture(), t = transport(); budget(f);
    const prepared = prepareJob(f.root, descriptor(f), { driver: t.driver });
    const privateJob = json(path.join(f.root, prepared.receiptPath));
    const file = drift === 'prompt' ? 'influencers/alpha/prompts/scene.txt' : drift === 'reference' ? 'influencers/alpha/references/front.png' : privateJob.scope.inputs[1].snapshotPath;
    fs.appendFileSync(path.join(f.root, file), 'changed');
    const before = tree(f.root);
    await assert.rejects(submitJob(f.root, prepared.id, grant(prepared), { driver: t.driver, outputKey }), /changed|differ|does not validate/);
    assert.deepEqual(tree(f.root), before); assert.equal(t.calls.length, 0); assert.equal(getBudget(f.root).committedUSD, 0);
  }
  const f = fixture({ characters: ['alpha', 'beta'] }), t = transport(), before = tree(f.root);
  for (const modify of [req => req.promptPath = 'influencers/beta/prompts/scene.txt', req => req.references[0].path = '../beta/references/front.png', req => req.parameters.endpoint = 'https://evil.example', req => req.references[0].sha256 = '0'.repeat(64), req => req.references[0].order = 1]) {
    const req = descriptor(f); modify(req); assert.throws(() => prepareJob(f.root, req, { driver: t.driver }));
    assert.deepEqual(tree(f.root), before);
  }
  assert.equal(t.calls.length, 0);
});

test('silent, unapproved, historical vocal and TTS production scopes remain pending without rewriting canon', () => {
  for (const options of [{ approved: false }, { approved: true, voice: 'silent' }, { approved: true, voice: 'speaking', legacy: true }]) {
    const f = fixture(options), t = transport(), before = preserved(f);
    const req = descriptor(f, { medium: 'video', purpose: 'production', hasSpeech: true, referenceIds: options.voice === 'speaking' ? ['front', 'voice'] : ['front'] });
    assert.throws(() => prepareJob(f.root, req, { driver: t.driver }), /approved canon|Silent canon|approved voice|canon does not validate/);
    assert.deepEqual(preserved(f), before); assert.equal(t.calls.length, 0);
  }
  const f = fixture({ approved: true, voice: 'speaking' }), t = transport(), before = tree(f.root);
  assert.throws(() => prepareJob(f.root, descriptor(f, { medium: 'audio', purpose: 'production' }), { driver: t.driver }), /Preset TTS supports reference/);
  assert.deepEqual(tree(f.root), before);
  const historical = fixture({ approved: true, voice: 'silent', legacy: true }), original = preserved(historical);
  prepareJob(historical.root, descriptor(historical, { purpose: 'production' }), { driver: t.driver });
  assert.deepEqual(preserved(historical), original); assert.equal(Object.hasOwn(json(path.join(historical.base('alpha'), 'persona.json')).voice, 'applicability'), false);
});

test('canonical speech attachment reaches Seedance as exact selected audio; native completion remains unapproved', async () => {
  const f = fixture({ approved: true, voice: 'speaking' }), t = transport(() => response({ id: 'accepted-speaking-job' })), before = preserved(f); budget(f);
  const prepared = prepareJob(f.root, descriptor(f, { medium: 'video', purpose: 'production', hasSpeech: true, referenceIds: ['front', 'voice'] }), { driver: t.driver });
  const result = await submitJob(f.root, prepared.id, grant(prepared), { driver: t.driver, outputKey });
  assert.equal(result.state, 'submitted'); assert.equal(result.providerJobId, 'accepted-speaking-job');
  const voice = t.calls[0].payload.content.find(item => item.type === 'audio_url');
  assert.equal(voice.role, 'reference_audio'); assert.deepEqual(Buffer.from(voice.audio_url.url.split(',')[1], 'base64'), mp3);
  assert.deepEqual(preserved(f), before);
});

test('concurrent studio reservations cannot spend the same allowance; queued cancellation releases only local unused spend', async () => {
  const f = fixture({ characters: ['alpha', 'beta'] }), t = transport(() => response({ id: 'active-video-job' })); budget(f, 2);
  const a = prepareJob(f.root, descriptor(f, { medium: 'video' }), { driver: t.driver });
  const b = prepareJob(f.root, descriptor(f, { characterId: 'beta', medium: 'video' }), { driver: t.driver });
  const results = await Promise.allSettled([submitJob(f.root, a.id, grant(a, 1.5), { driver: t.driver, outputKey }), submitJob(f.root, b.id, grant(b, 1.5), { driver: t.driver, outputKey })]);
  assert.equal(results.filter(result => result.status === 'fulfilled').length, 1); assert.equal(results.filter(result => result.status === 'rejected').length, 1);
  assert.equal(t.calls.length, 1); assert.equal(getBudget(f.root).committedUSD, 1.5);
  budget(f, 3);
  const pending = readJob(f.root, b.id).state === 'prepared' ? b : a;
  assert.equal((await submitJob(f.root, pending.id, grant(pending, 1.5), { driver: t.driver, outputKey })).state, 'queued');
  assert.equal(t.calls.length, 1); assert.equal(getBudget(f.root).committedUSD, 3);
  assert.deepEqual(await dispatchQueue(f.root, { driver: t.driver, outputKey }), []);
  assert.equal(cancelJob(f.root, pending.id, provenance('cancel-unused-queued-job')).state, 'cancelled');
  assert.equal(getBudget(f.root).committedUSD, 1.5);
  const activeJob = pending.id === a.id ? b : a;
  assert.throws(() => cancelJob(f.root, activeJob.id, provenance('cannot-cancel-provider')), /Only local unsubmitted/);
  assert.throws(() => budget(f, 1), /below committed/); assert.equal(getBudget(f.root).committedUSD, 1.5);
});

test('character allocations constrain independent queues and a reconciled accepted job frees only its concurrency slot', async () => {
  const f = fixture({ characters: ['alpha', 'beta'] }), t = transport(call => response({ id: call.payload?.prompt?.includes('beta') ? 'beta-job' : 'alpha-job' }));
  budget(f, 5, { perCharacter: { alpha: 1, beta: 3 } });
  const a = prepareJob(f.root, descriptor(f, { medium: 'video' }), { driver: t.driver }), b = prepareJob(f.root, descriptor(f, { characterId: 'beta', medium: 'video' }), { driver: t.driver });
  await assert.rejects(submitJob(f.root, a.id, grant(a, 2), { driver: t.driver, outputKey }), /Character budget/); assert.equal(t.calls.length, 0);
  assert.equal((await submitJob(f.root, a.id, grant(a, 1), { driver: t.driver, outputKey })).state, 'submitted');
  assert.equal((await submitJob(f.root, b.id, grant(b, 2), { driver: t.driver, outputKey })).state, 'queued');
  reconcileJob(f.root, a.id, { schemaVersion: 1, requestHash: a.requestHash, providerJobId: 'alpha-job', status: 'succeeded', actualCostUSD: 0.8, provenance: provenance('confirmed-original-video-bill') });
  const next = await dispatchQueue(f.root, { driver: t.driver, outputKey });
  assert.equal(next.length, 1); assert.equal(next[0].id, b.id); assert.equal(next[0].state, 'submitted');
  assert.equal(t.calls.length, 2); assert.equal(getBudget(f.root).committedUSD, 2.8);
});

test('uncertain POST survives restart without repeated POST or a replacement paid attempt for that character', async () => {
  const f = fixture(), t = transport(() => { throw new Error(`${secret} provider transport closed`); }); budget(f);
  const prepared = prepareJob(f.root, descriptor(f, { medium: 'video' }), { driver: t.driver });
  const result = await submitJob(f.root, prepared.id, grant(prepared), { driver: t.driver, outputKey });
  assert.equal(result.state, 'uncertain'); assert.equal(result.actualCostUSD, null); assert.equal(result.reservedUSD, 2); assert.equal(t.calls.length, 1);
  const restarted = transport(() => assert.fail('Restart must not call generation again'));
  assert.equal(readJob(f.root, prepared.id).state, 'uncertain');
  await assert.rejects(submitJob(f.root, prepared.id, grant(prepared), { driver: restarted.driver, outputKey }), /already been queued or submitted/);
  await assert.rejects(pollJob(f.root, prepared.id, { driver: restarted.driver, outputKey }), /remote job ID is unknown/);
  assert.deepEqual(await dispatchQueue(f.root, { driver: restarted.driver, outputKey }), []);
  await assert.rejects(async () => { const replacement = prepareJob(f.root, descriptor(f, { medium: 'video' }), { driver: restarted.driver }); return submitJob(f.root, replacement.id, grant(replacement), { driver: restarted.driver, outputKey }); }, /uncertain|reconcile/i);
  assert.equal(t.calls.length, 1); assert.equal(restarted.calls.length, 0); assert.equal(getBudget(f.root).committedUSD, 2);
  const privateState = fs.readFileSync(path.join(f.root, 'work/provider-execution/state.json'), 'utf8'); assert.doesNotMatch(privateState, /synthetic-consumer-ark-key|provider transport closed/);
});

test('explicit HTTP authentication rejection proves no submission and releases its reservation without an automatic retry', async () => {
  const f = fixture(), t = transport(() => response({ error: { message: `${secret} private rejection` } }, 401)); budget(f);
  const prepared = prepareJob(f.root, descriptor(f, { medium: 'video' }), { driver: t.driver });
  const result = await submitJob(f.root, prepared.id, grant(prepared), { driver: t.driver, outputKey });
  assert.equal(result.state, 'not-submitted'); assert.equal(result.actualCostUSD, 0); assert.equal(getBudget(f.root).committedUSD, 0); assert.equal(t.calls.length, 1);
  assert.deepEqual(await dispatchQueue(f.root, { driver: t.driver, outputKey }), []); assert.equal(t.calls.length, 1);
  assert.doesNotMatch(fs.readFileSync(path.join(f.root, 'work/provider-execution/state.json'), 'utf8'), /synthetic-consumer-ark-key|private rejection/);
});

test('accepted async job recovers encrypted original URLs, refuses a changed account/key, and exports without API headers', async () => {
  const f = fixture(), t = transport(call => call.method === 'POST' ? response({ id: 'original-async-job' }) : response({ id: 'original-async-job', model: BYTEPLUS_MODELS.video, status: 'succeeded', content: { video_url: signedURL }, usage: { total_tokens: 48038 } })); budget(f);
  const prepared = prepareJob(f.root, descriptor(f, { medium: 'video' }), { driver: t.driver });
  assert.equal((await submitJob(f.root, prepared.id, grant(prepared), { driver: t.driver, outputKey })).state, 'submitted');
  const other = transport(() => assert.fail('Different credential must never query this consumer job'), { apiKey: 'another-consumer-key' });
  await assert.rejects(pollJob(f.root, prepared.id, { driver: other.driver, outputKey }), /Credential destination differs/); assert.equal(other.calls.length, 0);
  const polled = await pollJob(f.root, prepared.id, { driver: t.driver, outputKey });
  assert.equal(polled.state, 'succeeded'); assert.equal(polled.usage.tokens, 48038); assert.equal(polled.actualCostUSD, null); assert.equal(getBudget(f.root).committedUSD, 2);
  for (const file of ['work/provider-execution/state.json', polled.receiptPath]) assert.doesNotMatch(fs.readFileSync(path.join(f.root, file), 'utf8'), /signature=|synthetic-private-signature|synthetic-consumer|data:image/);
  let downloads = 0;
  const download = async (url, init) => { downloads++; assert.equal(url, signedURL); assert.equal(init.redirect, 'error'); assert.equal(init.headers, undefined); return new Response(mp4); };
  await assert.rejects(exportJob(f.root, prepared.id, { fetch: download, outputKey: Buffer.alloc(32, 1) }), /cannot be recovered/); assert.equal(downloads, 0);
  const restarted = await exportJob(f.root, prepared.id, { fetch: download, outputKey });
  assert.equal(downloads, 1); assert.equal(restarted.outputs[0].sha256, hash(mp4)); assert.deepEqual(fs.readFileSync(path.join(f.root, restarted.outputs[0].path)), mp4);
  assert.deepEqual(t.calls.map(call => call.method), ['POST', 'GET']); assert.equal(restarted.outputs[0].status, 'draft');
});

test('preset TTS draft exports exact MP3 and leaves the prior voice/canon unchanged', async () => {
  const f = fixture(), before = preserved(f), t = transport(() => new Response(`${JSON.stringify({ code: 0, data: mp3.toString('base64') })}\n${JSON.stringify({ code: 20000000, data: null })}\n`)); budget(f);
  const prepared = prepareJob(f.root, descriptor(f, { medium: 'audio' }), { driver: t.driver });
  const submitted = await submitJob(f.root, prepared.id, grant(prepared), { driver: t.driver, outputKey });
  assert.equal(submitted.state, 'succeeded'); assert.equal(t.calls[0].headers['X-Api-Key'], speechSecret); assert.equal(t.calls[0].headers.Authorization, undefined);
  const exported = await exportJob(f.root, prepared.id, { outputKey });
  assert.match(exported.outputs[0].path, /\.mp3$/); assert.deepEqual(fs.readFileSync(path.join(f.root, exported.outputs[0].path)), mp3); assert.deepEqual(preserved(f), before);
  assert.equal(json(path.join(f.base('alpha'), 'persona.json')).voice.selection, null);
});

test('staged output tampering and export conflicts refuse overwrite and cannot redefine historical output bytes', async () => {
  for (const mode of ['tamper', 'conflict']) {
    const f = fixture(), t = transport(); budget(f);
    const prepared = prepareJob(f.root, descriptor(f), { driver: t.driver }); await submitJob(f.root, prepared.id, grant(prepared), { driver: t.driver, outputKey });
    if (mode === 'tamper') {
      const privateJob = json(path.join(f.root, readJob(f.root, prepared.id).receiptPath)); fs.appendFileSync(path.join(f.root, privateJob.stagedOutputs[0].path), 'changed staged bytes');
    } else write(f.root, `influencers/alpha/media/candidates/${prepared.id}-0.png`, 'Existing unrelated candidate must never change.');
    const before = tree(f.root);
    await assert.rejects(exportJob(f.root, prepared.id, { outputKey }), /changed|conflict|differ/i);
    assert.deepEqual(tree(f.root), before); assert.equal(t.calls.length, 1);
  }
});

test('remote export rejects oversized, redirected and wrong-medium responses while preserving accepted job for recovery', async () => {
  const f = fixture(), t = transport(call => call.method === 'POST' ? response({ id: 'original-export-job' }) : response({ id: 'original-export-job', model: BYTEPLUS_MODELS.video, status: 'succeeded', content: { video_url: signedURL } })); budget(f);
  const prepared = prepareJob(f.root, descriptor(f, { medium: 'video' }), { driver: t.driver }); await submitJob(f.root, prepared.id, grant(prepared), { driver: t.driver, outputKey }); await pollJob(f.root, prepared.id, { driver: t.driver, outputKey });
  const before = tree(f.root);
  const redirected = new Response(mp4); Object.defineProperty(redirected, 'redirected', { value: true });
  for (const output of [new Response(mp4, { headers: { 'content-length': String(257 * 1024 * 1024) } }), redirected, new Response(png)]) {
    await assert.rejects(exportJob(f.root, prepared.id, { fetch: async () => output, outputKey }), /bounded size|did not succeed|media signature/);
    assert.deepEqual(tree(f.root), before); assert.equal(readJob(f.root, prepared.id).state, 'succeeded');
  }
  assert.equal((await exportJob(f.root, prepared.id, { fetch: async () => new Response(mp4), outputKey })).outputs[0].sha256, hash(mp4)); assert.equal(t.calls.filter(call => call.method === 'POST').length, 1);
});

test('expired/unknown-cost grants and forged billing receipts cannot free or enlarge authorized spending silently', async () => {
  const f = fixture(), t = transport(); budget(f, 3);
  const prepared = prepareJob(f.root, descriptor(f), { driver: t.driver });
  await assert.rejects(submitJob(f.root, prepared.id, grant(prepared, 2, { expiresAt: '2020-01-01T00:00:00.000Z' }), { driver: t.driver, outputKey }), /live expiry/);
  await assert.rejects(submitJob(f.root, prepared.id, grant(prepared, 2, { acceptUnknownCost: false }), { driver: t.driver, outputKey }), /unknown cost/);
  assert.equal(t.calls.length, 0); assert.equal(getBudget(f.root).committedUSD, 0);
  await submitJob(f.root, prepared.id, grant(prepared), { driver: t.driver, outputKey });
  const invoice = { schemaVersion: 1, requestHash: prepared.requestHash, providerJobId: null, status: 'succeeded', actualCostUSD: 1.25, provenance: provenance('known-original-billing') };
  const before = tree(f.root);
  assert.throws(() => reconcileJob(f.root, prepared.id, { ...invoice, requestHash: '0'.repeat(64) }), /match an unresolved/);
  assert.throws(() => reconcileJob(f.root, prepared.id, { ...invoice, status: 'not-submitted', actualCostUSD: 0 }), /rewrite the known terminal|No-submission/);
  assert.deepEqual(tree(f.root), before); assert.equal(getBudget(f.root).committedUSD, 2);
  reconcileJob(f.root, prepared.id, invoice); assert.equal(getBudget(f.root).committedUSD, 1.25);
  assert.throws(() => reconcileJob(f.root, prepared.id, invoice), /match an unresolved/);
});

test('real directory links at selected inputs and execution state are refused before writes', () => {
  for (const location of ['input', 'state']) {
    const f = fixture(), t = transport();
    if (location === 'input') {
      const directory = path.join(f.base('alpha'), 'references'), destination = path.join(f.root, 'linked-original-references'); fs.renameSync(directory, destination); fs.symlinkSync(destination, directory, 'junction');
    } else {
      fs.mkdirSync(path.join(f.root, 'work'), { recursive: true }); fs.mkdirSync(path.join(f.root, 'linked-execution-state')); fs.symlinkSync(path.join(f.root, 'linked-execution-state'), path.join(f.root, 'work/provider-execution'), 'junction');
    }
    const before = tree(f.root);
    assert.throws(() => location === 'input' ? prepareJob(f.root, descriptor(f), { driver: t.driver }) : budget(f), /link|junction|symbolic|unsafe|does not validate/i);
    assert.deepEqual(tree(f.root), before); assert.equal(t.calls.length, 0);
  }
});

test('public provider CLI help is offline and the development checkout refuses creative preparation', () => {
  const f = fixture();
  write(f.root, '.development/project.json', { schemaVersion: 1, kind: 'framework-development' });
  const cli = path.join(f.root, 'scripts/provider-execution.mjs'); assert.equal(fs.existsSync(cli), true, 'Public CLI must be implemented before the complete gate.');
  const environment = { ...process.env, ARK_API_KEY: '', BYTEPLUS_SPEECH_API_KEY: '' };
  const help = spawnSync(process.execPath, [cli, '--help'], { cwd: f.root, env: environment, encoding: 'utf8' });
  assert.equal(help.status, 0, help.stderr); assert.match(help.stdout, /prepare|submit|budget/); assert.doesNotMatch(help.stdout + help.stderr, /synthetic-consumer/);
  const command = spawnSync(process.execPath, [cli, 'prepare', 'work/missing-private-request.json'], { cwd: f.root, env: environment, encoding: 'utf8' });
  assert.notEqual(command.status, 0); assert.match(command.stderr + command.stdout, /independent installed studio|framework development/i);
});

test('strict UTC provenance rejects calendar rollovers and normalized driver/governance drift before generation', async () => {
  const f = fixture(), t = transport(); budget(f);
  const job = prepareJob(f.root, descriptor(f), { driver: t.driver }), before = tree(f.root);
  for (const date of ['2030-02-30T12:00:00.000Z', '2030-13-01T12:00:00.000Z', '2030-10-13T25:00:00.000Z']) {
    await assert.rejects(submitJob(f.root, job.id, grant(job, 2, { expiresAt: date }), { driver: t.driver, outputKey }), /live expiry/);
    assert.throws(() => setBudget(f.root, { schemaVersion: 1, maximumUSD: 10, perCharacter: {}, maxConcurrent: 1, provenance: { ...provenance('invalid-calendar'), at: date } }), /provenance/);
    assert.deepEqual(tree(f.root), before);
  }
  const drifted = { ...t.driver, validate(request) { const validated = t.driver.validate(request); return { ...validated, payload: { ...validated.payload, watermark: true } }; } };
  await assert.rejects(submitJob(f.root, job.id, grant(job), { driver: drifted, outputKey }), /Normalized provider request changed/);
  assert.equal(t.calls.length, 0); assert.deepEqual(tree(f.root), before);
  fs.appendFileSync(path.join(f.root, 'CONSTITUTION.md'), '\nSynthetic policy update; old job cannot inherit new context.');
  const changed = tree(f.root);
  await assert.rejects(submitJob(f.root, job.id, grant(job), { driver: t.driver, outputKey }), /Framework\/provider contract changed/);
  assert.deepEqual(tree(f.root), changed); assert.equal(t.calls.length, 0);
});

test('a stale GET cannot regress the successful original job or discard its encrypted output locator', async () => {
  const f = fixture(), t = transport((call, index) => call.method === 'POST' ? response({ id: 'monotonic-original' }) : index === 2
    ? response({ id: 'monotonic-original', model: BYTEPLUS_MODELS.video, status: 'succeeded', content: { video_url: signedURL } })
    : response({ id: 'monotonic-original', model: BYTEPLUS_MODELS.video, status: 'running' })); budget(f);
  const job = prepareJob(f.root, descriptor(f, { medium: 'video' }), { driver: t.driver }); await submitJob(f.root, job.id, grant(job), { driver: t.driver, outputKey });
  await pollJob(f.root, job.id, { driver: t.driver, outputKey }); const before = tree(f.root);
  try { assert.equal((await pollJob(f.root, job.id, { driver: t.driver, outputKey })).state, 'succeeded'); }
  catch (error) { assert.match(error.message, /terminal|outcome|regress/i); }
  assert.deepEqual(tree(f.root), before); assert.equal(readJob(f.root, job.id).state, 'succeeded'); assert.equal(t.calls.filter(call => call.method === 'POST').length, 1);
  assert.equal((await exportJob(f.root, job.id, { fetch: async () => new Response(mp4), outputKey })).outputs[0].sha256, hash(mp4));
});

test('interruption after durable intent retains reservation and recovers as uncertain without a duplicate POST', async () => {
  const f = fixture(), t = transport(() => assert.fail('Interruption precedes the external POST')); budget(f);
  const job = prepareJob(f.root, descriptor(f, { medium: 'video' }), { driver: t.driver });
  const ledger = path.join(f.root, 'work/provider-execution/state.json'), originalRename = fs.renameSync;
  let interrupted = false;
  fs.renameSync = function (source, destination, ...args) {
    const result = originalRename.call(fs, source, destination, ...args);
    if (!interrupted && path.resolve(destination) === path.resolve(ledger) && json(ledger).jobs[job.id]?.state === 'submitting') {
      interrupted = true; throw new Error('Synthetic interruption after ledger intent reached disk.');
    }
    return result;
  };
  try { await assert.rejects(submitJob(f.root, job.id, grant(job), { driver: t.driver, outputKey }), /Synthetic interruption/); }
  finally { fs.renameSync = originalRename; }
  assert.equal(interrupted, true); assert.equal(readJob(f.root, job.id).state, 'submitting'); assert.equal(getBudget(f.root).committedUSD, 2); assert.equal(t.calls.length, 0);
  assert.equal((await pollJob(f.root, job.id, { driver: t.driver, outputKey })).state, 'uncertain');
  assert.deepEqual(await dispatchQueue(f.root, { driver: t.driver, outputKey }), []); assert.equal(t.calls.length, 0); assert.equal(getBudget(f.root).committedUSD, 2);
  const privateJob = json(ledger).jobs[job.id]; assert.equal(privateJob.events.filter(event => event.name === 'external-intent').length, 1);
});

test('interrupted output write recovers only the original durable export intent without regeneration or overwrite', async () => {
  const f = fixture(), t = transport(); budget(f);
  const job = prepareJob(f.root, descriptor(f), { driver: t.driver }); await submitJob(f.root, job.id, grant(job), { driver: t.driver, outputKey });
  const candidate = path.join(f.root, `influencers/alpha/media/candidates/${job.id}-0.png`), originalWrite = fs.writeFileSync;
  let interrupted = false;
  fs.writeFileSync = function (target, ...args) {
    const result = originalWrite.call(fs, target, ...args);
    if (!interrupted && typeof target === 'string' && path.resolve(target) === path.resolve(candidate)) { interrupted = true; throw new Error('Synthetic interruption after output bytes reached disk.'); }
    return result;
  };
  try { await assert.rejects(exportJob(f.root, job.id, { outputKey }), /Synthetic interruption/); }
  finally { fs.writeFileSync = originalWrite; }
  assert.equal(interrupted, true); assert.deepEqual(fs.readFileSync(candidate), png); assert.equal(readJob(f.root, job.id).outputs.length, 0);
  const privateJob = json(path.join(f.root, readJob(f.root, job.id).receiptPath)); assert.equal(privateJob.exportIntent[0].sha256, hash(png));
  const exported = await exportJob(f.root, job.id, { outputKey }); assert.equal(exported.outputs[0].sha256, hash(png)); assert.equal(t.calls.length, 1);
  assert.equal(getBudget(f.root).committedUSD, 2); assert.equal(exported.outputs[0].status, 'draft');
});

test('provider execution bridges a real captured readiness run without automatic generation-step completion or approval', async () => {
  const workflow = workflowFixture(), root = workflow.root, persona = workflow.p, base = path.join(root, 'influencers/alpha');
  snapshotCanon(persona, base);
  const f = { root, personas: { alpha: persona }, base: () => base }, t = transport();
  let run = reach(root, startRun(root, { workflowId: 'produce-piece', personaId: 'alpha', objective: 'Synthetic actual executor bridge', medium: 'image', mediaProviders: { image: 'byteplus', video: 'higgsfield', audio: 'higgsfield' }, capabilities: ['image-generation', 'image-inspection', 'byteplus:image-generation'] }));
  const plan = planFor(root, run), stage = plan.stages.find(stage => stage.stepId === run.nextTask.stepId);
  Object.assign(stage, { provider: 'byteplus', requestedModel: BYTEPLUS_MODELS.image, tool: 'olympox-provider-execution', module: BYTEPLUS_MODELS.image, route: 'byteplus-modelark-image-http' });
  stage.inputSlots.push({ id: 'front', kind: 'reference', role: 'front', order: 0, fromStageId: null });
  const record = recordFor(root, run, plan), observed = record.stages.find(item => item.stageId === stage.id), feasibility = record.feasibility.stages.find(item => item.stageId === stage.id);
  observed.model = { exposed: true, value: BYTEPLUS_MODELS.image, reason: null, provenance: provenance('synthetic-exposed-model') }; feasibility.model = clone(observed.model);
  observed.destination = { exposed: false, value: null, reason: 'This BytePlus route does not discover account or workspace identity; the consumer label is a declaration.', provenance: provenance('synthetic-declared-destination') }; feasibility.destination = clone(observed.destination);
  const promptInput = observed.inputs.find(input => input.slotId === 'prompt'), parameterInput = observed.inputs.find(input => input.slotId === 'parameters');
  write(root, promptInput.path, 'Synthetic canonical image bridge prompt.'); write(root, parameterInput.path, {});
  for (const input of [promptInput, parameterInput]) { const bytes = fs.readFileSync(path.join(root, input.path)); input.sha256 = hash(bytes); input.bytes = bytes.length; }
  const front = persona.references.find(ref => ref.id === 'front'), bytes = fs.readFileSync(path.join(base, front.path));
  observed.inputs.push({ slotId: 'front', path: `influencers/alpha/${front.path}`, referenceId: 'front', role: 'front', order: 0, sha256: hash(bytes), bytes: bytes.length });
  observed.acceptedInputs = observed.inputs.map(input => ({ slotId: input.slotId, sha256: input.sha256, bytes: input.bytes, inputId: `accepted-${input.slotId}`, scopeHash: '0'.repeat(64), provenance: provenance(`synthetic-accepted-${input.slotId}`) }));
  rebind(run, record); run = importRecord(root, run, record); assert.equal(run.mediaReadiness.canStartStage, true);
  const request = descriptor(f, { purpose: 'production' }); request.promptPath = promptInput.path; request.runBinding = { runId: run.runId, attemptId: run.attemptId, stageId: stage.id };
  const before = preserved(f), resultsBefore = run.run.attempts.at(-1).results.length; budget(f);
  const job = prepareJob(root, request, { driver: t.driver });
  const submitted = await submitJob(root, job.id, grant(job), { driver: t.driver, outputKey }); assert.equal(submitted.state, 'succeeded'); assert.equal(t.calls.length, 1);
  const bridged = readRun(root, run.runId); assert.equal(bridged.run.attempts.at(-1).job.requestId, job.id); assert.equal(bridged.run.attempts.at(-1).job.status, 'succeeded');
  assert.equal(bridged.nextTask.stepId, stage.id); assert.equal(bridged.run.attempts.at(-1).results.length, resultsBefore); assert.notEqual(bridged.state, 'completed');
  const exported = await exportJob(root, job.id, { outputKey }); assert.equal(exported.outputs[0].sha256, hash(png)); assert.deepEqual(preserved(f), before);
  const beforePoll = fs.readFileSync(path.join(root, `work/runs/${run.runId}.json`)); await pollJob(root, job.id, { driver: t.driver, outputKey });
  assert.deepEqual(fs.readFileSync(path.join(root, `work/runs/${run.runId}.json`)), beforePoll); assert.equal(t.calls.length, 1);
});

test('public installed CLI prepares, authorizes, submits, queries and exports through a strict synthetic HTTP boundary', () => {
  const f = fixture(), request = descriptor(f), cli = path.join(f.root, 'scripts/provider-execution.mjs');
  const mockPath = write(f.root, 'work/mock-http.mjs', `
import fs from 'node:fs';
import crypto from 'node:crypto';
const ledgerPath = ${JSON.stringify(path.join(f.root, 'work/provider-execution/state.json'))};
const callPath = ${JSON.stringify(path.join(f.root, 'work/mock-http-calls.json'))};
const hash = data => crypto.createHash('sha256').update(data).digest('hex');
globalThis.fetch = async (url, init) => {
  if (url !== 'https://ark.ap-southeast.bytepluses.com/api/v3/images/generations' || init.method !== 'POST' || init.redirect !== 'error') throw new Error('Synthetic boundary refused any other network route.');
  if (init.headers.Authorization !== 'Bearer ' + process.env.ARK_API_KEY) throw new Error('Synthetic boundary requires this consumer credential.');
  const payload = JSON.parse(init.body), state = JSON.parse(fs.readFileSync(ledgerPath)), job = Object.values(state.jobs).find(job => job.state === 'submitting');
  if (!job || job.reservationMicros !== 2000000 || !job.events.some(event => event.name === 'external-intent')) throw new Error('The paid POST requires an earlier durable reserved intent.');
  const input = typeof payload.image === 'string' ? [payload.image] : payload.image;
  const prior = fs.existsSync(callPath) ? JSON.parse(fs.readFileSync(callPath)) : [];
  prior.push({ method: init.method, model: payload.model, prompt: payload.prompt, imageHashes: input.map(url => hash(Buffer.from(url.split(',')[1], 'base64'))), durableIntent: true });
  fs.writeFileSync(callPath, JSON.stringify(prior));
  return new Response(JSON.stringify({ data: [{ b64_json: ${JSON.stringify(png.toString('base64'))}, output_format: 'png' }], usage: { total_tokens: 1 } }), { headers: { 'Content-Type': 'application/json' } });
};
`);
  const environment = { ...process.env, ARK_API_KEY: secret, BYTEPLUS_SPEECH_API_KEY: speechSecret };
  const invoke = args => {
    const result = spawnSync(process.execPath, ['--import', pathToFileURL(path.join(f.root, mockPath)).href, cli, ...args], { cwd: f.root, env: environment, encoding: 'utf8' });
    assert.equal(result.status, 0, result.stderr); assert.doesNotMatch(result.stdout + result.stderr, /synthetic-consumer-ark-key|synthetic-consumer-speech-key|data:image/);
    return JSON.parse(result.stdout);
  };
  write(f.root, 'work/request.json', request);
  const prepared = invoke(['prepare', 'work/request.json']); assert.equal(prepared.state, 'prepared'); assert.equal(fs.existsSync(path.join(f.root, 'work/mock-http-calls.json')), false);
  write(f.root, 'work/budget.json', { schemaVersion: 1, maximumUSD: 5, perCharacter: { alpha: 3 }, maxConcurrent: 1, provenance: provenance('cli-budget') }); invoke(['budget', 'work/budget.json']);
  write(f.root, 'work/grant.json', grant(prepared)); const submitted = invoke(['submit', prepared.id, 'work/grant.json']); assert.equal(submitted.state, 'succeeded'); assert.equal(submitted.outputs.length, 0);
  assert.equal(invoke(['status', prepared.id]).state, 'succeeded');
  const exported = invoke(['export', prepared.id]); assert.equal(exported.outputs[0].sha256, hash(png)); assert.deepEqual(fs.readFileSync(path.join(f.root, exported.outputs[0].path)), png);
  const calls = json(path.join(f.root, 'work/mock-http-calls.json')); assert.equal(calls.length, 1); assert.equal(calls[0].durableIntent, true); assert.deepEqual(calls[0].imageHashes, [request.references[0].sha256]); assert.equal(calls[0].prompt, fs.readFileSync(path.join(f.root, request.promptPath), 'utf8'));
  write(f.root, 'work/malformed.json', `{"private":"${secret}`);
  const malformed = spawnSync(process.execPath, ['--import', pathToFileURL(path.join(f.root, mockPath)).href, cli, 'prepare', 'work/malformed.json'], { cwd: f.root, env: environment, encoding: 'utf8' });
  assert.notEqual(malformed.status, 0); assert.doesNotMatch(malformed.stdout + malformed.stderr, /synthetic-consumer-ark-key/); assert.equal(json(path.join(f.root, 'work/mock-http-calls.json')).length, 1);
  assert.equal(json(path.join(f.base('alpha'), 'assets.json')).assets.length, 0);
});

test('queued speech selects its own credential and output key after the original video frees concurrency', async () => {
  const f = fixture({ characters: ['alpha', 'beta'] }), selected = [];
  const t = transport(call => call.url.endsWith('/tts/unidirectional')
    ? new Response(`${JSON.stringify({ code: 0, data: mp3.toString('base64') })}\n${JSON.stringify({ code: 20000000, data: null })}\n`)
    : response({ id: 'original-video-before-speech' })); budget(f, 5);
  const keyFor = medium => { selected.push(medium); return crypto.createHash('sha256').update(medium === 'audio' ? 'Own speech protection key' : 'Own Ark protection key').digest(); };
  const video = prepareJob(f.root, descriptor(f, { medium: 'video' }), { driver: t.driver }), audio = prepareJob(f.root, descriptor(f, { characterId: 'beta', medium: 'audio' }), { driver: t.driver });
  await submitJob(f.root, video.id, grant(video), { driver: t.driver, outputKey: keyFor });
  assert.equal((await submitJob(f.root, audio.id, grant(audio), { driver: t.driver, outputKey: keyFor })).state, 'queued'); assert.equal(t.calls.length, 1);
  reconcileJob(f.root, video.id, { schemaVersion: 1, requestHash: video.requestHash, providerJobId: 'original-video-before-speech', status: 'succeeded', actualCostUSD: 0.7, provenance: provenance('original-video-finished') });
  const dispatched = await dispatchQueue(f.root, { driver: t.driver, outputKey: keyFor }); assert.equal(dispatched[0].id, audio.id); assert.equal(dispatched[0].state, 'succeeded');
  assert.equal(t.calls[1].headers['X-Api-Key'], speechSecret); assert.equal(t.calls[1].headers.Authorization, undefined); assert.ok(selected.includes('audio')); assert.ok(selected.includes('video'));
  const exported = await exportJob(f.root, audio.id, { outputKey: keyFor }); assert.deepEqual(fs.readFileSync(path.join(f.root, exported.outputs[0].path)), mp3); assert.equal(getBudget(f.root).committedUSD, 2.7);
});

test('explicit current listening permits exact historical voice reuse without rewriting frozen persona, approval or snapshots', async () => {
  const f = fixture({ approved: true, voice: 'speaking', legacy: true }), t = transport(() => response({ id: 'historical-voice-video' })), before = preserved(f); budget(f);
  const request = descriptor(f, { medium: 'video', purpose: 'production', referenceIds: ['front', 'voice'], hasSpeech: true });
  const voice = f.personas.alpha.references.find(ref => ref.id === 'voice');
  request.voiceReuse = { method: 'listening', performed: true, referenceId: voice.id, path: voice.path, sha256: voice.sha256, criticalIssues: [], limitations: [], provenance: provenance('current-historical-voice-listening') };
  const prepared = prepareJob(f.root, request, { driver: t.driver });
  assert.equal((await submitJob(f.root, prepared.id, grant(prepared), { driver: t.driver, outputKey })).state, 'submitted');
  const submittedVoice = t.calls[0].payload.content.find(item => item.type === 'audio_url'); assert.deepEqual(Buffer.from(submittedVoice.audio_url.url.split(',')[1], 'base64'), mp3);
  assert.deepEqual(preserved(f), before); assert.equal(Object.hasOwn(json(path.join(f.base('alpha'), 'persona.json')).voice, 'applicability'), false);
  for (const update of [{ performed: false }, { sha256: '0'.repeat(64) }, { path: 'references/another-voice.mp3' }, { limitations: ['Pending listening'] }]) {
    const invalid = { ...request, voiceReuse: { ...request.voiceReuse, ...update } }, historical = tree(f.root);
    assert.throws(() => prepareJob(f.root, invalid, { driver: t.driver }), /voice|listen|reuse/i); assert.deepEqual(tree(f.root), historical);
  }
  assert.equal(t.calls.length, 1);
});
