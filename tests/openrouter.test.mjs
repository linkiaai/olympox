import fs from 'node:fs';
import path from 'node:path';
import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import { fixture, scratch, parent, save, hash, provenance, reach, planFor, recordFor, rebind } from './fixtures/stage-readiness.mjs';
import { startRun, transitionRun, readRun } from '../scripts/framework-core.mjs';
import { prepareVideo, validateVideoCatalog, sendVideo, videoStatus, exportVideo, SEEDANCE_MODEL } from '../scripts/openrouter-core.mjs';
import { createOpenRouterClient } from '../scripts/openrouter-client.mjs';
import { canonHash } from '../scripts/studio-core.mjs';
import { backupPersona, verifyBackup } from '../scripts/backup-core.mjs';
import { openrouterCommandCatalog } from '../scripts/docs-core.mjs';

const specPath = 'work/openrouter-spec-v001.json';
const catalog = { data: [{ id: SEEDANCE_MODEL, canonical_slug: 'bytedance/seedance-2.5-20260807', supported_durations: [5], supported_resolutions: ['480p'], supported_aspect_ratios: ['9:16'], supported_frame_images: ['first_frame', 'last_frame'], generate_audio: true, seed: true, pricing_skus: { video_tokens: '0.0000107' } }] };
const response = (status = 'pending') => ({ id: 'job-fixture', status, generationId: 'gen-fixture', cost: status === 'completed' ? 0.52 : null });
function mockClient(overrides = {}) { return { checkAuthorization() {}, credentialFingerprint: () => hash(Buffer.from('fixture-key')), models: async () => catalog, submit: async () => response(), status: async () => response('completed'), content: async () => ({ bytes: Buffer.from([0, 0, 0, 20, 102, 116, 121, 112, 105, 115, 111, 109]), contentType: 'video/mp4' }), ...overrides }; }
function requestFixture() {
  const { root } = fixture();
  const promptPath = save(root, 'influencers/alpha/prompts/scene-v001.txt', 'Synthetic silent camera test.');
  const spec = { schemaVersion: 1, model: SEEDANCE_MODEL, credentialFingerprint: hash(Buffer.from('fixture-key')), promptPath, parameters: { duration: 5, resolution: '480p', aspect_ratio: '9:16', generate_audio: false }, references: [] };
  save(root, specPath, spec);
  return { root, spec };
}
function readyFixture({ reference = true } = {}) {
  const { root, spec } = requestFixture();
  // An approved synthetic canon can exercise exact attachment plumbing without claiming image quality.
  if (reference) {
    const refPath = 'influencers/alpha/references/front.png';
    fs.writeFileSync(path.join(root, refPath), Buffer.from([137, 80, 78, 71, 13, 10, 26, 10, 0]));
    const p = JSON.parse(fs.readFileSync(path.join(root, 'influencers/alpha/persona.json')));
    p.references[0].sha256 = hash(fs.readFileSync(path.join(root, refPath)));
    // Recreate the fixture approval after changing synthetic reference bytes.
    p.approval.canonHash = canonHash(p);
    save(root, 'influencers/alpha/persona.json', p);
  }
  let run = startRun(root, { workflowId: 'produce-piece', personaId: 'alpha', objective: 'Synthetic optional video route', medium: 'video', mediaProviders: { image: 'higgsfield', video: 'openrouter', audio: 'higgsfield' }, capabilities: ['video-generation', 'openrouter:video-generation', 'video-inspection'] });
  run = reach(root, run);
  const plan = planFor(root, run);
  for (const stage of plan.stages) Object.assign(stage, { provider: 'openrouter', requestedModel: SEEDANCE_MODEL, module: 'video-generation', route: 'openrouter-api', tool: 'openrouter-local' });
  if (reference) {
    const file = 'influencers/alpha/references/front.png', bytes = fs.readFileSync(path.join(root, file));
    spec.references.push({ path: file, sha256: hash(bytes), bytes: bytes.length, referenceId: 'front', role: 'front', usage: 'first_frame', order: 0 });
    plan.stages[0].inputSlots.push({ id: 'front', kind: 'reference', role: 'front', order: 0, fromStageId: null });
    save(root, specPath, spec);
  }
  const record = recordFor(root, run, plan), prepared = prepareVideo(root, specPath);
  const entry = record.stages[0];
  entry.inputs = prepared.files.map((file, index) => ({ slotId: index === 0 ? 'parameters' : index === 1 ? 'prompt' : 'front', ...file, referenceId: index >= 2 ? 'front' : null, role: index >= 2 ? 'front' : null, order: index >= 2 ? 0 : null }));
  entry.acceptedInputs = entry.inputs.map(file => ({ slotId: file.slotId, sha256: file.sha256, bytes: file.bytes, inputId: `synthetic-${file.slotId}`, scopeHash: '0'.repeat(64), provenance: provenance() }));
  for (const stage of [...record.stages, ...record.feasibility.stages]) stage.model = { exposed: true, value: SEEDANCE_MODEL, reason: null, provenance: provenance() };
  rebind(run, record);
  save(root, 'work/readiness.json', record);
  run = transitionRun(root, run.runId, { action: 'record-media-readiness', readinessPath: 'work/readiness.json' });
  run = transitionRun(root, run.runId, { action: 'start', stageId: plan.stages[0].id, job: { provider: 'openrouter' } });
  assert.equal(run.state, 'in-progress', JSON.stringify(run.mediaReadiness));
  return { root, spec, run };
}
after(() => { for (const root of scratch) { assert.equal(path.dirname(root), parent); assert.match(path.basename(root), /^studio-/); fs.rmSync(root, { recursive: true, force: true }); } });

test('request preparation rejects unselected model, unsafe inputs and remote references', () => {
  const { root, spec } = requestFixture();
  assert.equal(prepareVideo(root, specPath).payload.model, SEEDANCE_MODEL);
  spec.model = 'bytedance/seedance-2.0'; save(root, specPath, spec);
  assert.throws(() => prepareVideo(root, specPath), /substitutions/);
  spec.model = SEEDANCE_MODEL; spec.promptPath = '../outside'; save(root, specPath, spec);
  assert.throws(() => prepareVideo(root, specPath), /bound character/);
  spec.promptPath = 'influencers/alpha/prompts/scene-v001.txt'; spec.parameters.resolution = '1080p'; save(root, specPath, spec);
  assert.throws(() => prepareVideo(root, specPath), /Seedance/);
  spec.parameters.resolution = '480p'; spec.references = [{ path: 'https://example.com/reference.png', sha256: '0'.repeat(64), bytes: 5, referenceId: 'front', role: 'front', usage: 'first_frame', order: 0 }]; save(root, specPath, spec);
  assert.throws(() => prepareVideo(root, specPath), /belong to this character/);
});

test('single submission consumes captured input bytes, then queries the same job and exports a new MP4', async () => {
  const { root, run } = readyFixture(); let calls = 0;
  const client = mockClient({ submit: async payload => { calls++; assert.equal(payload.model, SEEDANCE_MODEL); return response(); } });
  const sent = await sendVideo(root, run.runId, specPath, client);
  assert.equal(calls, 1); assert.equal(readRun(root, run.runId).state, 'uncertain-result');
  await assert.rejects(sendVideo(root, run.runId, specPath, client), /retried|intent/); assert.equal(calls, 1);
  assert.equal((await videoStatus(root, run.runId, client)).status, 'completed');
  assert.equal(readRun(root, run.runId).run.attempts.at(-1).job.status, 'succeeded');
  const out = await exportVideo(root, run.runId, 'influencers/alpha/media/pilot-v001.mp4', client);
  assert.equal(out.bytes, 12); assert.equal(out.sha256, hash(fs.readFileSync(path.join(root, out.path))));
  await assert.rejects(exportVideo(root, run.runId, out.path, client), /already exists/);
  await assert.rejects(exportVideo(root, run.runId, 'work/stolen.mp4', client), /bound character/);
  const receipt = fs.readFileSync(path.join(root, sent.receipt), 'utf8');
  assert.doesNotMatch(receipt, /Bearer|data:image|synthetic-api-key/);
  const backup = backupPersona(root, 'alpha');
  const manifest = JSON.parse(fs.readFileSync(path.join(backup.path, 'backup.json')));
  assert.ok(manifest.files.some(file => file.path === sent.receipt.replace('influencers/alpha/', '')));
  assert.equal(verifyBackup(root, backup.backupId).characterId, 'alpha');
});

test('approved canonical image role remains separate from first-frame transport usage', async () => {
  const { root, run } = readyFixture({ reference: true });
  const prepared = prepareVideo(root, specPath);
  assert.equal(prepared.refs[0].role, 'front'); assert.equal(prepared.payload.frame_images[0].frame_type, 'first_frame');
  assert.match(prepared.payload.frame_images[0].image_url.url, /^data:image\/png;base64,/);
  const expected = { model: SEEDANCE_MODEL, prompt: 'Synthetic silent camera test.', duration: 5, resolution: '480p', aspect_ratio: '9:16', generate_audio: false, frame_images: [{ type: 'image_url', image_url: { url: 'data:image/png;base64,iVBORw0KGgoA' }, frame_type: 'first_frame' }] };
  assert.deepEqual(prepared.payload, expected);
  assert.equal(prepared.requestHash, hash(Buffer.from(JSON.stringify(expected))));
  await sendVideo(root, run.runId, specPath, mockClient());
});

test('network ambiguity leaves an irreversible local barrier and no automatic second dispatch', async () => {
  const { root, run } = readyFixture(); let calls = 0;
  const client = mockClient({ submit: async () => { calls++; throw new Error('sensitive upstream details'); } });
  await assert.rejects(sendVideo(root, run.runId, specPath, client), /never resend/);
  await assert.rejects(sendVideo(root, run.runId, specPath, client), /retried|intent/);
  await assert.rejects(videoStatus(root, run.runId, client), /ID remains unknown/); assert.equal(calls, 1);
});

test('missing key, catalog drift and changed bytes stop before dispatch', async () => {
  const { root, run } = readyFixture(); let calls = 0;
  await assert.rejects(sendVideo(root, run.runId, specPath, createOpenRouterClient({ apiKey: '' })), /OPENROUTER_API_KEY/);
  assert.equal(fs.existsSync(path.join(root, 'influencers/alpha/.openrouter')), false);
  const client = mockClient({ models: async () => ({ data: [] }), submit: async () => { calls++; return response(); } });
  await assert.rejects(sendVideo(root, run.runId, specPath, client), /absent/);
  save(root, 'influencers/alpha/prompts/scene-v001.txt', 'Changed after authorization');
  await assert.rejects(sendVideo(root, run.runId, specPath, mockClient()), /no longer ready/); assert.equal(calls, 0);
});

test('a persisted submitting receipt stops concurrent sends across the same captured start', async () => {
  const { root, run } = readyFixture(); let calls = 0, release;
  const waiting = new Promise(resolve => { release = resolve; });
  const client = mockClient({ submit: async () => { calls++; await waiting; return response(); } });
  const first = sendVideo(root, run.runId, specPath, client);
  await new Promise(resolve => setImmediate(resolve));
  await assert.rejects(sendVideo(root, run.runId, specPath, client), /in use|EEXIST/); release(); await first;
  assert.equal(calls, 1);
});

test('public catalog validation never silently substitutes a model or unsupported frame role', () => {
  const { root } = requestFixture(), prepared = prepareVideo(root, specPath);
  assert.equal(validateVideoCatalog(prepared, catalog).id, SEEDANCE_MODEL);
  assert.throws(() => validateVideoCatalog(prepared, { data: [] }), /no fallback/);
});

test('credential changes and prompt-only approved canon cannot consume a captured grant', async () => {
  const { root, run } = readyFixture();
  await assert.rejects(sendVideo(root, run.runId, specPath, mockClient({ credentialFingerprint: () => '0'.repeat(64) })), /credential differs/);
  const other = readyFixture({ reference: false });
  await assert.rejects(sendVideo(other.root, other.run.runId, specPath, mockClient()), /actual selected visual reference/);
});

test('polls preserve known cost and terminal evidence and refuse to change the original job', async () => {
  const { root, run } = readyFixture(), client = mockClient();
  const sent = await sendVideo(root, run.runId, specPath, client);
  await videoStatus(root, run.runId, client);
  const refreshed = await videoStatus(root, run.runId, mockClient({ status: async () => ({ ...response('completed'), cost: null, generationId: null }) }));
  assert.equal(refreshed.cost, 0.52);
  await assert.rejects(videoStatus(root, run.runId, mockClient({ status: async () => response('pending') })), /terminal job status changed/);
  await assert.rejects(videoStatus(root, run.runId, mockClient({ status: async () => ({ ...response('completed'), id: 'another-job' }) })), /different job/);
  assert.equal(JSON.parse(fs.readFileSync(path.join(root, sent.receipt))).status, 'completed');
});

test('manual derives every implemented OpenRouter operation and enforces descriptions', () => {
  const cli = fs.readFileSync(new URL('../scripts/openrouter-local.mjs', import.meta.url), 'utf8');
  const config = JSON.parse(fs.readFileSync(new URL('../docs-site/config.json', import.meta.url)));
  assert.equal(openrouterCommandCatalog(cli, config.commandDescriptions).length, 8);
  assert.throws(() => openrouterCommandCatalog(cli, {}), /without description/);
  assert.throws(() => openrouterCommandCatalog(cli.replace('node scripts/openrouter-local.mjs models', 'node scripts/openrouter-local.mjs model'), config.commandDescriptions), /unique implemented/);
});
