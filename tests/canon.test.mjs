import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  readJson, hash, fileHash, localFile, canonHash, validatePersona, validateAssets,
  snapshotCanon, readCanon, registerAsset, sealExecution, readExecution, migrateAssets
} from '../scripts/studio-core.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const testRoot = path.join(root, 'tmp', 'tests');
const scratch = [];
const at = '2026-10-07T15:00:00-03:00';

function fixture() {
  fs.mkdirSync(testRoot, { recursive: true });
  const dir = fs.mkdtempSync(path.join(testRoot, 'canon-test-'));
  scratch.push(dir);
  for (const folder of ['references', 'media', 'prompts']) fs.mkdirSync(path.join(dir, folder));
  // Fictional bytes: these tests do not represent actual media approval/inspection.
  for (const file of ['references/front.png', 'references/angle.png', 'references/voice.wav', 'media/v1.png', 'media/v2.png', 'media/v1.wav', 'media/v1.mp4', 'prompts/v1.md']) {
    fs.writeFileSync(path.join(dir, file), `structural-fixture-v1-${file}`);
  }
  const persona = readJson(path.join(root, 'templates/persona.json'));
  Object.assign(persona, { id: 'canon-test', status: 'canon-approved' });
  Object.assign(persona.profile, { name: 'Fixture', age: 30, audience: 'Test', valueProposition: 'Structural test' });
  Object.assign(persona.identity, { face: 'Oval', eyes: 'Brown', hair: 'Short', skin: 'Natural', body: 'Adult', invariants: ['Structure'] });
  Object.assign(persona.voice, { accent: 'Brazilian', tone: 'Calm', pace: 'Moderate', referenceId: 'voice' });
  persona.references = [['front', 'references/front.png', 'front'], ['angle', 'references/angle.png', 'three-quarter'], ['voice', 'references/voice.wav', 'voice']].map(([id, file, role]) => ({
    id, path: file, role, status: 'approved', sha256: fileHash(dir, file), origin: 'Structural fixture',
    review: { reviewer: 'Fixture', at, notes: 'Metadata simulation, without actual media' }
  }));
  persona.approval = { reviewer: 'Fixture', at, notes: 'Approval simulation', canonHash: canonHash(persona) };
  fs.writeFileSync(path.join(dir, 'assets.json'), JSON.stringify({ schemaVersion: 1, assets: [] }));
  return { dir, persona };
}

function store(dir, manifest) { fs.writeFileSync(path.join(dir, 'assets.json'), JSON.stringify(manifest, null, 2)); }
function load(dir) { return readJson(path.join(dir, 'assets.json')); }
function review(asset, type = asset.type) {
  return {
    reviewer: 'Fixture', at, notes: 'Simulated metadata; does not prove inspection', decision: 'approve',
    method: { image: 'visual', audio: 'listening', video: 'visual-and-audio' }[type], criticalIssues: [], limitations: [],
    mediaSha256: asset.sha256, promptSha256: asset.promptSha256, canonHash: asset.canonHash, identityVersion: asset.identityVersion
  };
}
function legacyAsset({ dir, persona }, type = 'image') {
  const file = { image: 'media/v1.png', audio: 'media/v1.wav', video: 'media/v1.mp4' }[type];
  const asset = {
    id: 'legacy-asset', type, path: file, sha256: fileHash(dir, file), status: 'production',
    canonHash: canonHash(persona), identityVersion: persona.identityVersion, createdAt: at, provider: 'fixture', model: 'fixture',
    referenceIds: type === 'audio' ? ['voice'] : type === 'video' ? ['front', 'voice'] : ['front'],
    hasSpeech: type !== 'image', promptPath: 'prompts/v1.md', promptSha256: fileHash(dir, 'prompts/v1.md'), cost: null
  };
  asset.review = review(asset);
  return asset;
}
function nextCanon({ dir, persona }, replaceReferences = false) {
  const next = structuredClone(persona);
  next.identityVersion += 1;
  next.identity.face = 'New structural canon';
  if (replaceReferences) for (const ref of next.references) {
    fs.writeFileSync(path.join(dir, ref.path), `structural-fixture-v2-${ref.id}`);
    ref.sha256 = fileHash(dir, ref.path);
  }
  next.approval = { reviewer: 'Fixture-v2', at, notes: 'Simulated v2 metadata', canonHash: canonHash(next) };
  return next;
}
function preparedAsset({ dir, persona }, type = 'image') {
  const asset = registerAsset(persona, dir, { image: 'media/v1.png', audio: 'media/v1.wav', video: 'media/v1.mp4' }[type], type);
  const manifest = load(dir), candidate = manifest.assets.find(a => a.id === asset.id);
  Object.assign(candidate, { provider: 'fixture', model: 'fixture-model', promptPath: 'prompts/v1.md',
    referenceIds: type === 'audio' ? ['voice'] : type === 'video' ? ['front', 'voice'] : ['front'], hasSpeech: type !== 'image',
    context: { objective: 'Test without generation', parameters: { format: '4:5' } } });
  store(dir, manifest);
  return candidate;
}

test.after(() => {
  for (const dir of scratch) {
    assert.equal(path.dirname(path.resolve(dir)), path.resolve(testRoot));
    assert.match(path.basename(dir), /^canon-test-/);
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('snapshot stores existing approval and bytes; freezing again is idempotent', () => {
  const { dir, persona } = fixture(), before = JSON.stringify(persona);
  const snapshot = snapshotCanon(persona, dir);
  assert.equal(JSON.stringify(persona), before);
  assert.equal(snapshot.canonHash, canonHash(persona));
  assert.deepEqual(snapshot.persona.approval, persona.approval);
  assert.deepEqual(readCanon(dir, 1, canonHash(persona)), snapshot);
  assert.deepEqual(snapshotCanon(persona, dir), snapshot);
  for (const file of snapshot.referenceFiles) {
    assert.equal(fileHash(path.join(dir, 'canon/v000001'), file.path), file.sha256);
    assert.deepEqual(fs.readFileSync(path.join(dir, 'canon/v000001', file.path)), fs.readFileSync(path.join(dir, file.sourcePath)));
  }
  assert.equal(fs.existsSync(path.join(dir, '.canon.lock')), false);
});

test('snapshot does not approve a draft or overwrite an identity at the same version', () => {
  const { dir, persona } = fixture();
  assert.throws(() => snapshotCanon({ ...persona, status: 'draft' }, dir), /existing approval/);
  const original = snapshotCanon(persona, dir);
  persona.identity.face = 'Outra estrutura';
  persona.approval.canonHash = canonHash(persona);
  assert.throws(() => snapshotCanon(persona, dir), /Increment identityVersion/);
  assert.deepEqual(readCanon(dir, 1), original);
});

test('candidates stay outside the snapshot without changing approved logical paths', () => {
  const { dir, persona } = fixture();
  persona.references.push({ ...persona.references[0], id: 'candidate', status: 'candidate', review: null });
  const expected = canonHash(persona), snapshot = snapshotCanon(persona, dir);
  assert.equal(snapshot.persona.references.length, 3);
  assert.equal(persona.references.length, 4);
  assert.equal(snapshot.canonHash, expected);
  assert.equal(snapshot.persona.references[0].path, persona.references[0].path);
  assert.throws(() => readCanon(dir, 1, '0'.repeat(64)), /does not match the requested canon hash/);
});

test('v2 canon and changed current bytes preserve v1 delivery, including voice', () => {
  const f = fixture(), old = legacyAsset(f, 'video');
  const snap = snapshotCanon(f.persona, f.dir);
  store(f.dir, { schemaVersion: 1, assets: [old] });
  const next = nextCanon(f, true);
  assert.deepEqual(validatePersona(next, f.dir).errors, []);
  snapshotCanon(next, f.dir);
  assert.deepEqual(readCanon(f.dir, 1), snap);
  assert.deepEqual(validateAssets(load(f.dir), next, f.dir), []);
  const newAsset = registerAsset(next, f.dir, 'media/v2.png', 'image');
  assert.equal(newAsset.identityVersion, 2);
  assert.equal(newAsset.recordVersion, 2);
  assert.deepEqual(load(f.dir).assets[0].review, old.review);
  assert.deepEqual(validateAssets(load(f.dir), next, f.dir), []);
});

test('without a v1 snapshot no fallback approves history with a v2 persona', () => {
  const f = fixture(), old = legacyAsset(f);
  store(f.dir, { schemaVersion: 1, assets: [old] });
  const next = nextCanon(f), before = fileHash(f.dir, 'assets.json');
  assert.ok(validateAssets(load(f.dir), next, f.dir).some(error => error.includes('historical snapshot missing')));
  assert.throws(() => registerAsset(next, f.dir, 'media/v2.png', 'image'), /historical snapshot missing/);
  assert.equal(fileHash(f.dir, 'assets.json'), before);
});

test('changing bytes or envelope of historical snapshots invalidates reading and approval', () => {
  const f = fixture(), old = legacyAsset(f), snapshot = snapshotCanon(f.persona, f.dir);
  const next = nextCanon(f);
  const archived = path.join(f.dir, 'canon/v000001', snapshot.referenceFiles[0].path);
  const originalBytes = fs.readFileSync(archived);
  fs.writeFileSync(archived, 'changed');
  assert.throws(() => readCanon(f.dir, 1), /Historical reference bytes/);
  assert.ok(validateAssets({ schemaVersion: 1, assets: [old] }, next, f.dir).length);
  fs.writeFileSync(archived, originalBytes);
  const file = path.join(f.dir, 'canon/v000001/snapshot.json'), record = readJson(file);
  record.persona.identity.eyes = 'Changed'; fs.writeFileSync(file, JSON.stringify(record));
  assert.throws(() => readCanon(f.dir, 1), /Invalid or altered canon snapshot/);
});

test('ambiguous Windows paths/ADS and canon lock are refused', () => {
  const { dir, persona } = fixture();
  for (const file of ['references/front.png:stream', 'references/front.png.', 'references/front.png ', 'con.png', 'aux/file.png']) {
    assert.throws(() => localFile(dir, file));
  }
  fs.writeFileSync(path.join(dir, '.canon.lock'), 'fixture lock');
  assert.throws(() => snapshotCanon(persona, dir), /in use/);
  assert.equal(fs.readFileSync(path.join(dir, '.canon.lock'), 'utf8'), 'fixture lock');
  assert.equal(fs.existsSync(path.join(dir, 'canon')), false);
});

test('even a rehashed envelope cannot let a historical reference escape the bundle', () => {
  const f = fixture(); snapshotCanon(f.persona, f.dir);
  const file = path.join(f.dir, 'canon/v000001/snapshot.json'), record = readJson(file);
  record.referenceFiles[0].path = '../../assets.json';
  const sort = value => Array.isArray(value) ? value.map(sort) : value && typeof value === 'object'
    ? Object.fromEntries(Object.keys(value).sort().map(key => [key, sort(value[key])])) : value;
  const { hash: ignored, ...payload } = record;
  record.hash = hash(JSON.stringify(sort(payload))); fs.writeFileSync(file, JSON.stringify(record));
  assert.throws(() => readCanon(f.dir, 1), /path relative/);
});

test('seal stores exact context and prompt without inventing a review; replay is idempotent', () => {
  const f = fixture(), asset = preparedAsset(f);
  const sealed = sealExecution(f.persona, f.dir, asset.id);
  assert.equal(sealed.asset.status, 'draft');
  assert.equal(sealed.asset.review, null);
  const record = readExecution(f.dir, sealed.executionSha256);
  assert.equal(record.data.generation.provider, 'fixture');
  assert.deepEqual(record.data.generation.context, asset.context);
  assert.equal(record.data.referenceFiles[0].sha256, f.persona.references[0].sha256);
  assert.deepEqual(fs.readFileSync(path.join(f.dir, 'executions', record.hash, record.promptFile.path)), fs.readFileSync(path.join(f.dir, asset.promptPath)));
  assert.equal(sealExecution(f.persona, f.dir, asset.id).executionSha256, sealed.executionSha256);
  assert.deepEqual(validateAssets(load(f.dir), f.persona, f.dir), []);
});

test('explicit draft reseal preserves previous context and does not review on its own', () => {
  const f = fixture(), asset = preparedAsset(f), first = sealExecution(f.persona, f.dir, asset.id);
  const manifest = load(f.dir); manifest.assets[0].cost = { amount: 2, currency: 'BRL' }; store(f.dir, manifest);
  const second = sealExecution(f.persona, f.dir, asset.id);
  assert.notEqual(second.executionSha256, first.executionSha256);
  assert.equal(readExecution(f.dir, second.executionSha256).previousHash, first.executionSha256);
  assert.equal(readExecution(f.dir, first.executionSha256).data.generation.cost, null);
  assert.equal(second.asset.review, null);
  assert.equal(second.asset.status, 'draft');
});

test('v2 record cannot promote without a seal and review bound to execution', () => {
  const f = fixture(), candidate = preparedAsset(f);
  let manifest = load(f.dir), asset = manifest.assets[0];
  asset.promptSha256 = fileHash(f.dir, asset.promptPath);
  asset.status = 'production'; asset.review = review(asset);
  assert.ok(validateAssets(manifest, f.persona, f.dir).some(error => error.includes('sealed execution')));
  const sealed = sealExecution(f.persona, f.dir, candidate.id);
  manifest = load(f.dir); asset = manifest.assets[0];
  asset.status = 'production'; asset.review = review(asset);
  assert.ok(validateAssets(manifest, f.persona, f.dir).some(error => error.includes('review.executionSha256')));
  asset.review.executionSha256 = sealed.executionSha256;
  assert.deepEqual(validateAssets(manifest, f.persona, f.dir), []);
});

test('changing inputs/provider/model/cost/context after sealing cannot reuse approval', () => {
  const f = fixture(), candidate = preparedAsset(f, 'video');
  sealExecution(f.persona, f.dir, candidate.id);
  const approved = load(f.dir); approved.assets[0].status = 'production';
  approved.assets[0].review = { ...review(approved.assets[0]), executionSha256: approved.assets[0].executionSha256 };
  assert.deepEqual(validateAssets(approved, f.persona, f.dir), []);
  for (const change of [
    { referenceIds: ['angle', 'voice'] }, { provider: 'other' }, { model: 'other' },
    { cost: { amount: 0, currency: 'BRL' } }, { hasSpeech: false }, { context: { objective: 'other' } }
  ]) {
    const edited = structuredClone(approved); Object.assign(edited.assets[0], change);
    assert.ok(validateAssets(edited, f.persona, f.dir).some(error => error.includes('Execution context changed')), JSON.stringify(change));
  }
});

test('media, source prompt, and copied prompt must remain intact', () => {
  const f = fixture(), candidate = preparedAsset(f), sealed = sealExecution(f.persona, f.dir, candidate.id);
  const approved = load(f.dir); const asset = approved.assets[0];
  asset.status = 'production'; asset.review = { ...review(asset), executionSha256: sealed.executionSha256 };
  fs.writeFileSync(path.join(f.dir, asset.path), 'novos bytes');
  assert.ok(validateAssets(approved, f.persona, f.dir).some(error => error.includes('File changed')));
  asset.sha256 = fileHash(f.dir, asset.path); asset.review.mediaSha256 = asset.sha256;
  assert.ok(validateAssets(approved, f.persona, f.dir).some(error => error.includes('Execution context changed')));
  fs.writeFileSync(path.join(f.dir, asset.promptPath), 'novo prompt');
  asset.promptSha256 = fileHash(f.dir, asset.promptPath); asset.review.promptSha256 = asset.promptSha256;
  assert.ok(validateAssets(approved, f.persona, f.dir).some(error => error.includes('Execution context changed')));
  const snapshot = readExecution(f.dir, sealed.executionSha256);
  fs.writeFileSync(path.join(f.dir, 'executions', snapshot.hash, snapshot.promptFile.path), 'snapshot changed');
  assert.throws(() => readExecution(f.dir, sealed.executionSha256), /Historical prompt bytes/);
});

test('v1 execution remains verifiable after a new canon and v2 record', () => {
  const f = fixture(), candidate = preparedAsset(f, 'audio'), sealed = sealExecution(f.persona, f.dir, candidate.id);
  const manifest = load(f.dir), asset = manifest.assets[0];
  asset.status = 'production'; asset.review = { ...review(asset), executionSha256: sealed.executionSha256 }; store(f.dir, manifest);
  const next = nextCanon(f, true);
  assert.deepEqual(validateAssets(manifest, next, f.dir), []);
  registerAsset(next, f.dir, 'media/v2.png', 'image');
  assert.deepEqual(validateAssets(load(f.dir), next, f.dir), []);
});

test('migration preserves legacy approval and does not turn a draft into approval', () => {
  const f = fixture(), old = legacyAsset(f), draft = { ...legacyAsset(f, 'audio'), id: 'old-draft', status: 'draft', review: null };
  store(f.dir, { schemaVersion: 1, assets: [old, draft] });
  const migrated = migrateAssets(f.persona, f.dir);
  assert.equal(migrated.schemaVersion, 2);
  assert.equal(migrated.assets[0].recordVersion, 1);
  assert.deepEqual(migrated.assets[0].review, old.review);
  assert.equal(migrated.assets[0].review.executionSha256, undefined);
  assert.equal(migrated.assets[1].recordVersion, 2);
  assert.equal(migrated.assets[1].status, 'draft');
  assert.deepEqual(validateAssets(migrated, f.persona, f.dir), []);
  const changed = structuredClone(migrated); changed.assets[0].provider = 'other';
  assert.ok(validateAssets(changed, f.persona, f.dir).some(error => error.includes('Legacy record changed')));
  assert.throws(() => sealExecution(f.persona, f.dir, old.id), /requires a draft asset/);
});

test('migration freezes approved canon before evolution and preserves old deliveries', () => {
  const f = fixture(), old = legacyAsset(f, 'video');
  store(f.dir, { schemaVersion: 1, assets: [old] });
  assert.equal(fs.existsSync(path.join(f.dir, 'canon/v000001/snapshot.json')), false);
  const migrated = migrateAssets(f.persona, f.dir);
  const snapshot = readCanon(f.dir, 1, old.canonHash);
  assert.deepEqual(snapshot.persona.approval, f.persona.approval);
  assert.deepEqual(migrated.assets[0].review, old.review);
  const next = nextCanon(f, true);
  assert.deepEqual(validateAssets(load(f.dir), next, f.dir), []);
  registerAsset(next, f.dir, 'media/v2.png', 'image');
  assert.deepEqual(validateAssets(load(f.dir), next, f.dir), []);
  assert.deepEqual(readCanon(f.dir, 1), snapshot);
  assert.deepEqual(load(f.dir).assets[0].review, old.review);
});

test('registration cannot use the manifest as media and preserves bytes on failure', () => {
  const f = fixture(), before = fileHash(f.dir, 'assets.json');
  assert.throws(() => registerAsset(f.persona, f.dir, 'assets.json', 'image'), /manifest cannot/);
  assert.equal(fileHash(f.dir, 'assets.json'), before);
  assert.equal(fs.existsSync(path.join(f.dir, '.assets.lock')), false);
});
