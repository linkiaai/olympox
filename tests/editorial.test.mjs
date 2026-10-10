import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as core from '../scripts/studio-core.mjs';
import { narrativeDraft, saveNarrative, readNarrative, saveContent, validateEditorial } from '../scripts/editorial-core.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const testRoot = path.join(root, 'tmp', 'tests');
const scratch = [];
const time = '2026-10-07T15:00:00-03:00';
const approval = () => ({ decision: 'approve', reviewer: 'Structural fixture', at: time, notes: 'Test metadata; no actual creative review.' });
const write = (file, data) => fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n');

test.after(() => {
  for (const base of scratch) {
    const resolved = path.resolve(base);
    assert.equal(path.dirname(resolved), path.resolve(testRoot));
    assert.match(path.basename(resolved), /^editorial-test-/);
    fs.rmSync(resolved, { recursive: true, force: true });
  }
});

function fixture(approved = false) {
  fs.mkdirSync(testRoot, { recursive: true });
  const base = fs.mkdtempSync(path.join(testRoot, 'editorial-test-'));
  scratch.push(base);
  const persona = core.readJson(path.join(root, 'tests/fixtures/legacy-persona-v1.json'));
  persona.id = 'editorial-test';
  if (approved) {
    Object.assign(persona.profile, { name: 'Adult fixture', age: 30, audience: 'Fixture readers', valueProposition: 'Verify record continuity' });
    Object.assign(persona.identity, { face: 'Oval', eyes: 'Brown', hair: 'Short', skin: 'Texture', body: 'Adult', invariants: ['Structure'] });
    persona.references = [['front', 'front'], ['angle', 'three-quarter']].map(([id, role]) => {
      const file = `${id}.png`;
      // Fixture bytes are not an image or evidence of actual review.
      fs.writeFileSync(path.join(base, file), `fixture-bytes-${id}`);
      return { id, role, path: file, status: 'approved', origin: 'Structural fixture', sha256: core.fileHash(base, file), review: approval() };
    });
    persona.status = 'canon-approved';
    persona.approval = { ...approval(), canonHash: core.canonHash(persona) };
  }
  write(path.join(base, 'persona.json'), persona);
  write(path.join(base, 'assets.json'), { schemaVersion: 1, assets: [] });
  return { base, persona };
}

function fullNarrative(persona) {
  const data = narrativeDraft(persona);
  Object.assign(data, { audience: 'Fixture readers', valueProposition: 'Stories with continuity', desire: 'Learn something new', values: ['Curiosity'], contradiction: 'Plans, but gets excited by new things', habits: ['Write down questions'] });
  Object.assign(data.writingVoice, {
    tone: 'Direct and cordial', rhythm: 'Short sentences',
    examples: [
      { kind: 'introduction', text: 'Today I start a new story.' },
      { kind: 'opinion', text: 'I prefer to explain one choice at a time.' },
      { kind: 'disagreement', text: 'I see a limitation in this proposal; we can compare the options.' }
    ],
    avoidExamples: ['I know everything and guarantee results.']
  });
  return data;
}

function contentDraft(persona, id = 'test-piece') {
  const data = core.readJson(path.join(root, 'templates/content.json'));
  Object.assign(data, { id, characterId: persona.id });
  return data;
}

function readyContext() {
  const { base, persona } = fixture(true);
  assert.equal(typeof core.snapshotCanon, 'function', 'Canon integration must be available.');
  core.snapshotCanon(persona, base);
  const narrative = saveNarrative(base, persona, fullNarrative(persona), approval());
  const shot = core.readJson(path.join(root, 'templates/shot.json'));
  shot.purpose = 'production'; shot.characterId = persona.id;
  write(path.join(base, 'shot-v1.json'), shot);
  const input = contentDraft(persona);
  Object.assign(input, {
    status: 'ready-for-production', canonVersion: persona.identityVersion, canonHash: core.canonHash(persona),
    narrativeVersion: narrative.version, narrativeHash: narrative.hash,
    channel: 'Fixture channel', objective: 'Present the next chapter', pillar: 'Learning',
    message: 'One question starts a story', caption: 'One question for the next chapter.',
    shots: [{ id: 'portrait', path: 'shot-v1.json', sha256: core.fileHash(base, 'shot-v1.json') }],
    disclosure: { virtual: 'Virtual fixture character.', commercial: false }, review: approval()
  });
  return { base, persona, narrative, input };
}

test('original draft without history remains valid and is not automatically approved', () => {
  const { base, persona } = fixture();
  assert.equal(validateEditorial(base, persona).errors.length, 0);
  assert.match(validateEditorial(base, persona).warnings.join('\n'), /not recorded yet/);
  const input = narrativeDraft(persona);
  input.status = 'approved';
  const snapshot = saveNarrative(base, persona, input);
  assert.equal(snapshot.data.status, 'draft');
  assert.equal(snapshot.data.approval, null);
  assert.equal(readNarrative(base).hash, snapshot.hash);
  assert.deepEqual(validateEditorial(base, persona).errors, []);
  const piece = saveContent(base, persona, contentDraft(persona));
  assert.equal(piece.data.status, 'draft');
  assert.deepEqual(validateEditorial(base, persona).errors, []);
});

test('editorial evolution creates versions without changing the canon or overwriting the previous narrative', () => {
  const { base, persona } = fixture(true);
  const identityHash = core.canonHash(persona);
  const first = saveNarrative(base, persona, fullNarrative(persona), approval());
  const original = fs.readFileSync(path.join(base, first.path));
  const input = structuredClone(first.data);
  input.desire = 'Aprender e compartilhar a descoberta';
  const second = saveNarrative(base, persona, input);
  assert.equal(second.version, 2);
  assert.equal(second.previousHash, first.hash);
  assert.equal(second.data.status, 'draft');
  assert.equal(second.data.approval, null);
  assert.deepEqual(fs.readFileSync(path.join(base, first.path)), original);
  assert.equal(readNarrative(base, 1).hash, first.hash);
  assert.equal(core.canonHash(persona), identityHash);
});

test('narrative requires ordered chronology, real dates, and earlier dependencies', () => {
  const { base, persona } = fixture();
  const event = { id: 'start', date: '2026-10-07', description: 'Fictional start', consequence: 'New question', after: [], contentIds: [], fictional: true };
  for (const events of [
    [{ ...event, date: '2026-02-30' }],
    [event, { ...event, id: 'antes', date: '2026-10-06' }],
    [event, { ...event }],
    [{ ...event, after: ['evento-futuro'] }],
    [{ ...event, fictional: false }]
  ]) assert.throws(() => saveNarrative(base, persona, { ...narrativeDraft(persona), timeline: events }));
  const second = { ...event, id: 'pergunta', date: '2026-10-08', after: ['start'] };
  saveNarrative(base, persona, { ...narrativeDraft(persona), timeline: [event, second] });
  assert.deepEqual(validateEditorial(base, persona).errors, []);
});

test('editorial approval needs an explicit decision and a sufficiently defined narrative', () => {
  const { base, persona } = fixture();
  assert.throws(() => saveNarrative(base, persona, narrativeDraft(persona), approval()), /Approved narrative/);
  assert.throws(() => saveNarrative(base, persona, fullNarrative(persona), { decision: 'approve' }), /actual reviewer/);
  const first = saveNarrative(base, persona, fullNarrative(persona), approval());
  const changed = structuredClone(first.data);
  changed.desire = 'Another intention';
  assert.throws(() => saveNarrative(base, persona, changed, first.data.approval), /Provided hash/);
});

test('ready piece requires preserved canon, approved narrative, and explicit review', () => {
  const { base, persona, input } = readyContext();
  assert.throws(() => saveContent(base, persona, { ...input, review: null }), /Editorial review/);
  const draft = saveNarrative(base, persona, fullNarrative(persona));
  assert.throws(() => saveContent(base, persona, { ...input, narrativeVersion: draft.version, narrativeHash: draft.hash }), /approved narrative/);
  const result = saveContent(base, persona, input);
  assert.equal(result.data.status, 'ready-for-production');
  assert.deepEqual(validateEditorial(base, persona).errors, []);
  assert.throws(() => saveContent(base, persona, { ...result.data, caption: 'Change without a new review.' }), /Provided hash/);
});

test('historical content remains valid after a new canon and narrative', () => {
  const { base, persona, input } = readyContext();
  const content = saveContent(base, persona, input);
  const original = fs.readFileSync(path.join(base, content.path));
  const next = structuredClone(persona);
  next.identityVersion = 2; next.identity.eyes = 'Verdes';
  next.approval = { ...approval(), canonHash: core.canonHash(next) };
  write(path.join(base, 'persona.json'), next);
  core.snapshotCanon(next, base);
  saveNarrative(base, next, { ...fullNarrative(next), desire: 'A fictional evolution' }, approval());
  assert.deepEqual(validateEditorial(base, next).errors, []);
  assert.deepEqual(fs.readFileSync(path.join(base, content.path)), original);
  const revision = saveContent(base, next, { ...contentDraft(next), id: input.id, message: 'Planning the next revision' });
  assert.equal(revision.version, 2);
  assert.equal(revision.previousHash, content.hash);
  assert.equal(revision.data.status, 'draft');
});

test('another character, incorrect narrative hash, and external files are refused', () => {
  const { base, persona, input } = readyContext();
  assert.throws(() => saveNarrative(base, persona, { ...fullNarrative(persona), characterId: 'another-persona' }), /another character/);
  assert.throws(() => saveContent(base, persona, { ...input, characterId: 'another-persona' }), /another character/);
  assert.throws(() => saveContent(base, persona, { ...input, narrativeHash: 'a'.repeat(64) }), /Narrative context/);
  assert.throws(() => saveContent(base, persona, { ...input, canonHash: 'a'.repeat(64) }));
  assert.throws(() => saveContent(base, persona, { ...input, shots: [{ id: 'external', path: '../shot.json', sha256: 'a'.repeat(64) }] }), /relative/);
  const shot = core.readJson(path.join(base, 'shot-v1.json'));
  shot.characterId = 'another-persona'; write(path.join(base, 'shot-v1.json'), shot);
  assert.throws(() => saveContent(base, persona, { ...input, shots: [{ id: 'external', path: 'shot-v1.json', sha256: core.fileHash(base, 'shot-v1.json') }] }), /another character/);
});

test('tampered snapshots are detected without rewriting hashes', () => {
  const { base, persona, input, narrative } = readyContext();
  const piece = saveContent(base, persona, input);
  const altered = core.readJson(path.join(base, piece.path));
  altered.data.caption = 'Tampered text'; write(path.join(base, piece.path), altered);
  assert.match(validateEditorial(base, persona).errors.join('\n'), /altered/);
  const story = core.readJson(path.join(base, narrative.path));
  story.data.desire = 'External change'; write(path.join(base, narrative.path), story);
  assert.throws(() => readNarrative(base), /altered/);
});

test('tampered evidence file and asset from another version are refused', () => {
  const { base, persona, input } = readyContext();
  fs.writeFileSync(path.join(base, 'evidence.md'), 'Fixture file, without actual consultation.');
  const source = { id: 'evidencia', url: null, title: 'Arquivo de fixture', collectedAt: time, status: 'consulted', notes: 'Structural fixture.', path: 'evidence.md', sha256: core.fileHash(base, 'evidence.md') };
  const record = saveContent(base, persona, { ...input, sources: [source] });
  fs.writeFileSync(path.join(base, 'evidence.md'), 'File changed after review.');
  assert.match(validateEditorial(base, persona).errors.join('\n'), /Evidence file changed/);
  assert.throws(() => saveContent(base, persona, { ...contentDraft(persona), id: record.data.id }), /Evidence file changed/);
  fs.writeFileSync(path.join(base, 'ativo.png'), 'Bytes de fixture.');
  write(path.join(base, 'assets.json'), { schemaVersion: 1, assets: [{ id: 'asset', path: 'ativo.png', sha256: core.fileHash(base, 'ativo.png'), identityVersion: 9, canonHash: core.canonHash(persona) }] });
  assert.throws(() => saveContent(base, persona, { ...input, id: 'another-piece', linkedAssetIds: ['asset'] }), /another context/);
  assert.throws(() => saveContent(base, persona, { ...input, id: 'another-piece', linkedAssetIds: ['unknown'] }), /missing/);
});

test('missing versions and tampered previous hash break the editorial chain', () => {
  const { base, persona } = fixture();
  const first = saveNarrative(base, persona, narrativeDraft(persona));
  const second = saveNarrative(base, persona, narrativeDraft(persona));
  fs.unlinkSync(path.join(base, first.path));
  assert.throws(() => readNarrative(base, second.version), /incomplete chain/);
});

test('factual sources and music distinguish catalog availability from commercial eligibility', () => {
  const { base, persona, input } = readyContext();
  const source = { id: 'source', url: 'https://example.com/fixture-evidence', title: 'Test source', collectedAt: time, status: 'consulted', notes: 'Fixture, not actual research.', path: null, sha256: null };
  const claim = { id: 'claim', text: 'Statement used only in the fixture.', sourceIds: [] };
  assert.throws(() => saveContent(base, persona, { ...input, factualClaims: [claim] }), /without a consulted source/);
  const music = {
    title: 'Fixture track', creator: 'Fixture', url: 'https://example.com/audio-fixture', versionId: 'test-version',
    platform: 'Fixture channel', region: 'BR', accountType: 'business', usage: 'advertisement', useInProduction: true,
    catalogAvailability: { status: 'confirmed', sourceId: 'source', checkedAt: time, notes: 'Metadados de fixture' },
    eligibility: { status: 'pending', sourceId: null, checkedAt: null, notes: 'Unverified' }, alternative: 'Track still undecided'
  };
  assert.throws(() => saveContent(base, persona, { ...input, sources: [source], music }), /eligibility/);
  const result = saveContent(base, persona, { ...input, sources: [source], factualClaims: [{ ...claim, sourceIds: ['source'] }], music: { ...music, useInProduction: false } });
  assert.equal(result.data.music.eligibility.status, 'pending');
  assert.equal(result.data.music.useInProduction, false);
  assert.deepEqual(validateEditorial(base, persona).errors, []);
});

test('junction cannot place editorial snapshots outside the character', t => {
  const { base, persona } = fixture();
  const outside = fixture().base;
  try { fs.symlinkSync(outside, path.join(base, 'narrative'), process.platform === 'win32' ? 'junction' : 'dir'); }
  catch (error) { if (error.code === 'EPERM') { t.skip('Host does not allow symlink/junction.'); return; } throw error; }
  assert.throws(() => saveNarrative(base, persona, narrativeDraft(persona)), /outside the character directory/);
});
