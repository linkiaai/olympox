import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { canonicalToken } from '../scripts/language-compat.mjs';
import { createPersona, stableHash } from '../scripts/storage-core.mjs';
import { canonHash, fileHash, validatePersona, snapshotCanon, readCanon, registerAsset, validateAssets } from '../scripts/studio-core.mjs';
import { startRun, readRun, validateRunRecord, resumeRun, transitionRun } from '../scripts/framework-core.mjs';
import { narrativeDraft, saveNarrative, readNarrative, saveContent, validateEditorial } from '../scripts/editorial-core.mjs';
import { usePreReadinessContracts } from './fixtures/pre-stage-readiness/activate.mjs';

const sourceRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const parent = path.join(sourceRoot, 'tmp', 'language-tests');
const scratch = [];
const at = '2026-10-08T12:00:00Z';
function write(root, relative, value) {
  const target = path.join(root, relative);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, typeof value === 'string' ? value : JSON.stringify(value, null, 2) + '\n');
  return target;
}
function fixture() {
  fs.mkdirSync(parent, { recursive: true });
  const root = fs.mkdtempSync(path.join(parent, 'language-'));
  scratch.push(root);
  for (const folder of ['templates', 'framework']) fs.cpSync(path.join(sourceRoot, folder), path.join(root, folder), { recursive: true });
  usePreReadinessContracts(root);
  for (const file of ['CONSTITUTION.md', 'AGENTS.md', 'docs/studio-team.md']) {
    write(root, file, fs.readFileSync(path.join(sourceRoot, file), 'utf8'));
  }
  const { dir: base, persona } = createPersona(root, 'test-character');
  return { root, base, persona };
}
test.after(() => {
  for (const root of scratch) {
    assert.equal(path.dirname(path.resolve(root)), path.resolve(parent));
    assert.match(path.basename(root), /^language-/);
    fs.rmSync(root, { recursive: true, force: true });
  }
});
function legacyPersona(base, draft) {
  const persona = structuredClone(draft);
  // Historical absence is independent of the current template's new defaults.
  delete persona.voice.applicability; delete persona.voice.selection;
  persona.status = 'canon_aprovado';
  Object.assign(persona.profile, { name: 'Structural fixture', age: 30, audience: 'Internal testing', valueProposition: 'Verify historical integrity' });
  Object.assign(persona.identity, { face: 'Oval', eyes: 'Brown', hair: 'Short', skin: 'Natural', body: 'Adult', invariants: ['Face structure'] });
  persona.references = ['front', 'three-quarter'].map(role => {
    const relative = `references/canon/${role}.png`;
    write(base, relative, `Fictional bytes for ${role}; no actual media inspection.`);
    return { id: role, role, path: relative, status: 'aprovado', origin: 'Historical structural fixture', sha256: fileHash(base, relative), review: { reviewer: 'Fixture', at, notes: 'Metadata only' } };
  });
  // Independently calculate the old algorithm using unmodified reference tokens.
  const { id, identityVersion, identity, voice, references } = persona;
  persona.approval = { reviewer: 'Fixture', at, notes: 'Metadata only', canonHash: stableHash({ id, identityVersion,
    name: persona.profile.name, age: persona.profile.age, virtual: persona.profile.virtual, identity, voice,
    references: references.filter(ref => ref.status === 'aprovado') }) };
  write(base, 'persona.json', persona);
  return persona;
}
function legacyRun(root, personaId, state = 'pronta') {
  const run = startRun(root, { workflowId: 'create-character', personaId, objective: 'Historical compatibility fixture' }).run;
  run.workflowId = 'criar-personagem';
  Object.assign(run.contract.workflow, { id: 'criar-personagem', path: 'framework/workflows/criar-personagem.json', name: 'Criar personagem' });
  Object.assign(run.contract.tasks['approve-canon'], { version: '0.2.0' });
  delete run.contract.tasks['approve-canon'].vocalPolicy;
  run.contractHash = stableHash(run.contract);
  run.attempts[0].state = state;
  const governance = run.governanceFiles.find(item => item.path === 'framework/workflows/create-character.json');
  governance.path = 'framework/workflows/criar-personagem.json';
  if (state === 'concluida') {
    run.attempts[0].stepIndex = run.contract.workflow.steps.length;
    run.attempts[0].results = run.contract.workflow.steps.map(step => ({ stepId: step.id, taskId: step.task, status: 'completed', outputs: [] }));
  }
  const { recordHash, ...body } = run;
  run.recordHash = stableHash(body);
  write(root, `work/runs/${run.id}.json`, run);
  return run;
}

test('new persona, workflow aliases, asset defaults, and task waits use English', () => {
  const { root, base, persona } = fixture();
  assert.equal(persona.status, 'draft');
  assert.match(fs.readFileSync(path.join(base, 'decisions.md'), 'utf8'), /^# Decisions/);
  write(base, 'media/candidates/output.png', 'Fictional bytes, no image generation.');
  const asset = registerAsset(persona, base, 'media/candidates/output.png', 'image');
  assert.equal(asset.status, 'draft');
  assert.equal(asset.provider, 'not-provided');
  assert.equal(asset.model, 'not-provided');
  const started = startRun(root, { workflowId: 'criar-personagem', personaId: persona.id, objective: 'Alias input test' });
  assert.equal(started.run.workflowId, 'create-character');
  assert.equal(started.state, 'planned');
  const waiting = transitionRun(root, started.runId, { action: 'wait', state: 'aguardando_decisao', reason: 'Compatibility fixture' });
  assert.equal(waiting.state, 'awaiting-input');
  assert.equal(waiting.run.attempts[0].events.at(-1).state, 'awaiting-input');
});

test('Portuguese approved canon preserves its original hash, references, and snapshot bytes', () => {
  const { base, persona: draft } = fixture();
  const persona = legacyPersona(base, draft);
  const sourceBytes = fs.readFileSync(path.join(base, 'persona.json'));
  assert.equal(validatePersona(persona, base).errors.length, 0);
  assert.equal(canonHash(persona), persona.approval.canonHash);
  const normalized = structuredClone(persona);
  for (const ref of normalized.references) ref.status = canonicalToken(ref.status);
  assert.notEqual(canonHash(normalized), persona.approval.canonHash);
  const saved = snapshotCanon(persona, base);
  const snapshotPath = path.join(base, 'canon/v000001/snapshot.json');
  const historicalBytes = fs.readFileSync(snapshotPath);
  assert.equal(readCanon(base, 1, saved.canonHash).hash, saved.hash);
  assert.equal(readCanon(base, 1).persona.references[0].status, 'aprovado');
  assert.deepEqual(fs.readFileSync(snapshotPath), historicalBytes);
  assert.deepEqual(fs.readFileSync(path.join(base, 'persona.json')), sourceBytes);
  const asset = { id: 'legacy-asset', type: 'image', path: persona.references[0].path, status: 'rascunho',
    sha256: persona.references[0].sha256, canonHash: saved.canonHash, identityVersion: 1, createdAt: at,
    referenceIds: [], provider: 'nao_informado', model: 'nao_informado', cost: null };
  assert.deepEqual(validateAssets({ schemaVersion: 1, assets: [asset] }, persona, base), []);
});

test('historical contracts and completed Portuguese states validate without rewriting', () => {
  const { root, persona } = fixture();
  const historical = legacyRun(root, persona.id, 'concluida');
  const file = path.join(root, `work/runs/${historical.id}.json`), bytes = fs.readFileSync(file);
  assert.equal(validateRunRecord(historical), true);
  const status = readRun(root, historical.id);
  assert.equal(status.state, 'completed');
  assert.equal(status.canContinue, false);
  assert.equal(status.run.workflowId, 'criar-personagem');
  assert.equal(status.run.contract.workflow.name, 'Criar personagem');
  assert.equal(status.run.attempts[0].state, 'concluida');
  assert.deepEqual(fs.readFileSync(file), bytes);
});

test('Portuguese approved production retains decisions and full audio/video inspection methods', () => {
  const { base, persona: draft } = fixture();
  const persona = legacyPersona(base, draft);
  write(base, 'references/canon/voice.wav', 'Fictional voice bytes; no actual audio inspection.');
  persona.voice.referenceId = 'voice';
  persona.references.push({ id: 'voice', role: 'voice', path: 'references/canon/voice.wav', status: 'aprovado',
    origin: 'Historical structural fixture', sha256: fileHash(base, 'references/canon/voice.wav'),
    review: { reviewer: 'Fixture', at, notes: 'Metadata only' } });
  persona.approval.canonHash = canonHash(persona);
  write(base, 'prompts/legacy.md', 'Recorded historical prompt fixture.');
  const assets = ['image', 'audio', 'video'].map(type => {
    const extension = { image: 'png', audio: 'wav', video: 'mp4' }[type];
    const relative = `media/approved/legacy.${extension}`;
    write(base, relative, `Historical ${type} fixture bytes; no generation or inspection.`);
    const asset = { id: `legacy-${type}`, type, path: relative, status: 'producao',
      sha256: fileHash(base, relative), canonHash: persona.approval.canonHash, identityVersion: 1, createdAt: at,
      provider: 'fixture', model: 'fixture', cost: null, promptPath: 'prompts/legacy.md', promptSha256: fileHash(base, 'prompts/legacy.md'),
      referenceIds: type === 'audio' ? ['voice'] : type === 'video' ? ['front', 'voice'] : ['front'], hasSpeech: type !== 'image' };
    asset.review = { reviewer: 'Fixture', at, notes: 'Historical metadata only', decision: 'aprovar',
      method: { image: 'visual', audio: 'escuta', video: 'visual-e-audio' }[type], criticalIssues: [], limitations: [],
      mediaSha256: asset.sha256, promptSha256: asset.promptSha256, canonHash: asset.canonHash, identityVersion: 1 };
    return asset;
  });
  const manifest = { schemaVersion: 1, assets };
  const file = write(base, 'assets.json', manifest), bytes = fs.readFileSync(file);
  assert.deepEqual(validateAssets(manifest, persona, base), []);
  assert.deepEqual(fs.readFileSync(file), bytes);
});

test('renamed historical governance requires an explicit attempt and keeps its saved contract', () => {
  const { root, persona } = fixture();
  const historical = legacyRun(root, persona.id);
  const contract = structuredClone(historical.contract), contractHash = historical.contractHash;
  const status = readRun(root, historical.id);
  assert.ok(status.drift.some(item => item.path === 'framework/workflows/criar-personagem.json' && item.actual === null));
  assert.throws(() => transitionRun(root, historical.id, { action: 'skip', reason: 'Fixture' }), /newAttempt:true/);
  const resumed = resumeRun(root, historical.id, { newAttempt: true, reason: 'Accept changed language governance' });
  assert.equal(resumed.run.attempts.length, 2);
  assert.equal(resumed.run.attempts[0].state, 'pronta');
  assert.equal(resumed.run.attempts[1].state, 'planned');
  assert.deepEqual(resumed.run.contract, contract);
  assert.equal(resumed.run.contractHash, contractHash);
  assert.equal(resumed.drift.length, 0);
  assert.equal(validateRunRecord(resumed.run), true);
});

test('old narrative tokens and hashes remain valid while new editorial saves use English', () => {
  const { base, persona } = fixture();
  const data = narrativeDraft(persona);
  data.status = 'rascunho';
  data.writingVoice.examples = [{ kind: 'apresentacao', text: 'Historical fixture example' }];
  const historical = { schemaVersion: 1, kind: 'narrative', characterId: persona.id, version: 1, createdAt: at,
    previousHash: null, path: 'narrative/v000001.json', data };
  historical.hash = stableHash(historical);
  const file = write(base, historical.path, historical), bytes = fs.readFileSync(file);
  assert.equal(readNarrative(base).hash, historical.hash);
  assert.equal(validateEditorial(base, persona).errors.length, 0);
  const next = saveNarrative(base, persona, historical.data);
  assert.equal(next.data.status, 'draft');
  assert.equal(next.data.writingVoice.examples[0].kind, 'introduction');
  assert.equal(next.previousHash, historical.hash);
  assert.deepEqual(fs.readFileSync(file), bytes);
  const content = JSON.parse(fs.readFileSync(path.join(sourceRoot, 'templates/content.json'), 'utf8'));
  Object.assign(content, { id: 'piece', characterId: persona.id, status: 'rascunho',
    sources: [{ id: 'source', url: null, title: '', collectedAt: null, status: 'pendente', notes: '', path: null, sha256: null }] });
  const saved = saveContent(base, persona, content);
  assert.equal(saved.data.status, 'draft');
  assert.equal(saved.data.sources[0].status, 'pending');
});
