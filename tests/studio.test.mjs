import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { assertSlug, readJson, hash, fileHash, localFile, canonHash, validatePersona, buildPrompt, validateAssets, registerAsset } from '../scripts/studio-core.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const testRoot = path.join(root, 'tmp', 'tests');
const time = '2026-10-07T15:00:00-03:00';
const scratch = [];

function temporary() {
  fs.mkdirSync(testRoot, { recursive: true });
  const dir = fs.mkdtempSync(path.join(testRoot, 'olympox-test-'));
  scratch.push(dir);
  return dir;
}
test.after(() => {
  for (const dir of scratch) {
    const resolved = path.resolve(dir);
    assert.equal(path.dirname(resolved), path.resolve(testRoot));
    assert.match(path.basename(resolved), /^olympox-test-/);
    fs.rmSync(resolved, { recursive: true, force: true });
  }
});

function fixture(approved = false) {
  const dir = temporary();
  // Fictional bytes: these tests verify records, never pixels, voice, or fidelity.
  for (const name of ['front.png', 'angle.png', 'voice.wav', 'output.png', 'output.wav', 'output.mp4', 'prompt.md']) fs.writeFileSync(path.join(dir, name), `fixture-${name}`);
  fs.writeFileSync(path.join(dir, 'assets.json'), JSON.stringify({ schemaVersion: 1, assets: [] }));
  const persona = readJson(path.join(root, 'templates/persona.json'));
  Object.assign(persona, { id: 'test-persona', status: approved ? 'canon-approved' : 'draft' });
  Object.assign(persona.profile, { name: 'Test persona', age: 30, audience: 'Internal test', valueProposition: 'Verify records without generating media' });
  Object.assign(persona.identity, { face: 'Oval', eyes: 'Brown', hair: 'Short', skin: 'Natural texture', body: 'Adult proportions', invariants: ['Facial structure', 'Proportions'] });
  Object.assign(persona.voice, { accent: 'Brazilian', tone: 'Calm', pace: 'Moderate', referenceId: 'voice' });
  persona.references = [['front', 'front.png', 'front'], ['angle', 'angle.png', 'three-quarter'], ['voice', 'voice.wav', 'voice']].map(([id, file, role]) => ({
    id, path: file, role, status: 'approved', origin: 'Structural fixture, without actual media review', sha256: fileHash(dir, file),
    review: { reviewer: 'Fixture', at: time, notes: 'Metadata simulation' }
  }));
  if (approved) persona.approval = { reviewer: 'Fixture', at: time, notes: 'Simulation, not identity evidence', canonHash: canonHash(persona) };
  const shot = readJson(path.join(root, 'templates/shot.json'));
  return { dir, persona, shot };
}

function productionAsset(persona, dir, type = 'image') {
  const file = { image: 'output.png', audio: 'output.wav', video: 'output.mp4' }[type];
  const asset = {
    id: 'test-asset', type, path: file, status: 'production',
    sha256: fileHash(dir, file), canonHash: canonHash(persona), identityVersion: persona.identityVersion,
    createdAt: time, provider: 'fixture', model: 'fixture', promptPath: 'prompt.md', promptSha256: fileHash(dir, 'prompt.md'), cost: null,
    referenceIds: type === 'audio' ? ['voice'] : ['front'], hasSpeech: type === 'audio', review: null
  };
  asset.review = {
    reviewer: 'Fixture', at: time, decision: 'approve', notes: 'Review simulation',
    method: { image: 'visual', audio: 'listening', video: 'visual-and-audio' }[type],
    mediaSha256: asset.sha256, promptSha256: asset.promptSha256, canonHash: asset.canonHash, identityVersion: asset.identityVersion,
    criticalIssues: [], limitations: []
  };
  return asset;
}

test('slug refuses directory escape and Windows reserved names', () => {
  for (const slug of ['../outside', 'Foo', 'name/with/slash', 'con', 'nul', 'lpt1', 'x'.repeat(49), '']) assert.throws(() => assertSlug(slug));
  assert.equal(assertSlug('persona-02'), 'persona-02');
});

test('incomplete draft is valid with warnings; incomplete approved persona is refused', () => {
  const p = readJson(path.join(root, 'templates/persona.json'));
  p.id = 'test-persona';
  assert.equal(validatePersona(p).errors.length, 0);
  assert.ok(validatePersona(p).warnings.length);
  p.status = 'canon-approved';
  assert.ok(validatePersona(p).errors.length);
  p.profile.age = 17;
  assert.ok(validatePersona(p).errors.some(error => error.includes('adult')));
});

test('approval binds identity and references; editorial content can evolve', () => {
  const { persona: p, dir } = fixture(true);
  assert.deepEqual(validatePersona(p, dir).errors, []);
  p.editorial.pillars.push('Tema novo');
  assert.deepEqual(validatePersona(p, dir).errors, []);
  p.identity.eyes = 'Outra cor';
  assert.ok(validatePersona(p, dir).errors.some(error => error.includes('current canon')));
});

test('changing reference bytes invalidates integrity without updating approval', () => {
  const { persona, dir } = fixture(true);
  fs.writeFileSync(path.join(dir, 'front.png'), 'changed');
  assert.ok(validatePersona(persona, dir).errors.some(error => error.includes('changed after registration')));
});

test('absolute files, traversal, and directories are refused', () => {
  const { dir } = fixture();
  for (const file of ['../front.png', '/front.png', 'C:/front.png', 'folder\\front.png', './front.png', '']) assert.throws(() => localFile(dir, file));
  fs.mkdirSync(path.join(dir, 'folder'));
  assert.throws(() => localFile(dir, 'folder'));
});

test('junction cannot reference files outside the persona', t => {
  const { dir } = fixture();
  const outside = temporary();
  fs.writeFileSync(path.join(outside, 'external.png'), 'external');
  try { fs.symlinkSync(outside, path.join(dir, 'link'), process.platform === 'win32' ? 'junction' : 'dir'); }
  catch (error) { if (error.code === 'EPERM') { t.skip('Host does not allow symlink/junction.'); return; } throw error; }
  assert.throws(() => localFile(dir, 'link/external.png'), /outside the character directory/);
});

test('exploration builds a prompt; production requires approval and approved references', () => {
  const { dir, persona, shot } = fixture();
  assert.match(buildPrompt(persona, shot, dir), /Preserve: Facial structure/);
  shot.purpose = 'production';
  assert.throws(() => buildPrompt(persona, shot, dir), /approved canon/);
  persona.status = 'canon-approved';
  persona.approval = { reviewer: 'Fixture', at: time, notes: 'Test', canonHash: canonHash(persona) };
  assert.match(buildPrompt(persona, shot, dir), /front.png/);
  shot.referenceIds = ['another-persona'];
  assert.throws(() => buildPrompt(persona, shot, dir), /unknown/);
});

test('generation prompts retain distinctive fictional profile context without changing source records or exact speech', () => {
  const { dir, persona, shot } = fixture(true);
  Object.assign(persona.profile, {
    name: 'Synthetic urban creator',
    age: 67,
    audience: 'Adults who notice overlooked city life',
    valueProposition: 'Turn ordinary street corners into surprising miniature stories',
    personality: ['Dry humor', 'Fearless curiosity', 'Playful confidence'],
    backstory: 'A fictional former night-bus conductor who invents one-minute city tales.'
  });
  persona.identity.distinctiveMarks = ['A narrow silver streak in short hair'];
  persona.identity.invariants.push('Lively eyebrows');
  persona.approval.canonHash = canonHash(persona);
  Object.assign(shot, { purpose: 'production', medium: 'video', referenceIds: ['front'], script: 'I am 67. "Watch this corner."\nHere comes the story.', durationSeconds: 8 });
  const personaFile = path.join(dir, 'persona.json'), shotFile = path.join(dir, 'shot.json');
  fs.writeFileSync(personaFile, JSON.stringify(persona, null, 4) + '\n');
  fs.writeFileSync(shotFile, JSON.stringify(shot, null, 4) + '\n');
  const personaBytes = fs.readFileSync(personaFile), shotBytes = fs.readFileSync(shotFile);
  const personaBefore = structuredClone(persona), shotBefore = structuredClone(shot), canonBefore = canonHash(persona);
  const prompt = buildPrompt(persona, shot, dir);
  for (const value of [persona.profile.audience, persona.profile.valueProposition, ...persona.profile.personality, persona.profile.backstory]) {
    assert.ok(prompt.includes(value), `Prompt lost selected profile context: ${value}`);
  }
  assert.match(prompt, /^Fictional background[^\n]*$/m);
  assert.ok(prompt.includes(persona.identity.distinctiveMarks[0]));
  for (const invariant of persona.identity.invariants) assert.ok(prompt.includes(invariant));
  for (const reference of persona.references.filter(reference => ['front', 'voice'].includes(reference.id))) {
    assert.ok(prompt.includes(reference.path));
    assert.ok(prompt.includes(reference.sha256));
  }
  assert.ok(prompt.includes(`Exact speech: ${JSON.stringify(shot.script)}`));
  assert.deepEqual(persona, personaBefore);
  assert.deepEqual(shot, shotBefore);
  assert.equal(canonHash(persona), canonBefore);
  assert.deepEqual(fs.readFileSync(personaFile), personaBytes);
  assert.deepEqual(fs.readFileSync(shotFile), shotBytes);
});

test('legacy empty profile context remains usable for reference exploration', () => {
  const { dir, persona, shot } = fixture();
  Object.assign(persona.profile, { audience: '', valueProposition: '', backstory: '', personality: [] });
  const before = structuredClone(persona);
  assert.deepEqual(validatePersona(persona, dir).errors, []);
  const prompt = buildPrompt(persona, shot, dir);
  assert.match(prompt, /Preserve: Facial structure/);
  assert.match(prompt, /front.png/);
  assert.doesNotMatch(prompt, /^Audience:\s*$|^Editorial proposition:\s*$|^Personality:\s*$|^Fictional background[^\n]*:\s*$/m);
  assert.deepEqual(persona, before);
});

test('audio uses the voice file and spoken video includes image and voice', () => {
  const { dir, persona, shot } = fixture(true);
  Object.assign(shot, { purpose: 'production', medium: 'audio', script: 'Exact text for a test.' });
  const audio = buildPrompt(persona, shot, dir);
  assert.match(audio, /voice.wav/);
  assert.doesNotMatch(audio, /Entrada \d+: front.png/);
  shot.medium = 'video';
  const video = buildPrompt(persona, shot, dir);
  assert.match(video, /front.png/);
  assert.match(video, /voice.wav/);
  persona.voice.referenceId = null;
  persona.approval.canonHash = canonHash(persona);
  assert.throws(() => buildPrompt(persona, shot, dir), /voice reference/);
});

test('critical issues, limitations, and insufficient method prevent production', () => {
  const { dir, persona } = fixture(true);
  const asset = productionAsset(persona, dir, 'video');
  assert.deepEqual(validateAssets({ schemaVersion: 1, assets: [asset] }, persona, dir), []);
  asset.review.criticalIssues.push('Identidade muda');
  assert.ok(validateAssets({ schemaVersion: 1, assets: [asset] }, persona, dir).some(error => error.includes('Critical issues')));
  asset.review.criticalIssues = [];
  asset.review.limitations.push('Audio not heard');
  assert.ok(validateAssets({ schemaVersion: 1, assets: [asset] }, persona, dir).length);
  asset.review.limitations = [];
  asset.review.method = 'visual';
  assert.ok(validateAssets({ schemaVersion: 1, assets: [asset] }, persona, dir).some(error => error.includes('Insufficient review')));
});

test('previous review does not apply to another file or canon', () => {
  const { dir, persona } = fixture(true);
  const asset = productionAsset(persona, dir);
  assert.deepEqual(validateAssets({ schemaVersion: 1, assets: [asset] }, persona, dir), []);
  asset.path = 'angle.png'; asset.sha256 = fileHash(dir, asset.path);
  assert.ok(validateAssets({ schemaVersion: 1, assets: [asset] }, persona, dir).some(error => error.includes('Review does not match')));
  persona.identityVersion += 1;
  assert.ok(validateAssets({ schemaVersion: 1, assets: [asset] }, persona, dir).some(error => error.includes('Outdated')));
});

test('changed prompt cannot reuse approval and its hash must remain bound to review', () => {
  const { dir, persona } = fixture(true);
  const asset = productionAsset(persona, dir);
  fs.writeFileSync(path.join(dir, 'prompt.md'), 'Another script or direction');
  assert.ok(validateAssets({ schemaVersion: 1, assets: [asset] }, persona, dir).some(error => error.includes('Prompt changed')));
  asset.promptSha256 = fileHash(dir, 'prompt.md');
  assert.ok(validateAssets({ schemaVersion: 1, assets: [asset] }, persona, dir).some(error => error.includes('Review does not match the prompt')));
  asset.promptPath = 'front.png';
  asset.promptSha256 = fileHash(dir, asset.promptPath);
  asset.review.promptSha256 = asset.promptSha256;
  assert.ok(validateAssets({ schemaVersion: 1, assets: [asset] }, persona, dir).some(error => error.includes('text file')));
});

test('unknown cost stays null; provided cost has a valid amount and currency', () => {
  const { dir, persona } = fixture(true);
  const asset = productionAsset(persona, dir);
  const errors = () => validateAssets({ schemaVersion: 1, assets: [asset] }, persona, dir);
  assert.deepEqual(errors(), []);
  asset.cost = { amount: 1.25, currency: 'BRL' };
  assert.deepEqual(errors(), []);
  for (const cost of [{ amount: -1, currency: 'USD' }, { amount: '0', currency: 'USD' }, { amount: 0, currency: 'R$' }, 'free']) {
    asset.cost = cost;
    assert.ok(errors().some(error => error.includes('Invalid cost')));
  }
});

test('incompatible roles and malformed lists fail without throwing internal errors', () => {
  const { dir, persona } = fixture(true);
  const image = productionAsset(persona, dir);
  image.referenceIds = ['voice'];
  assert.ok(validateAssets({ schemaVersion: 1, assets: [image] }, persona, dir).some(error => error.includes('Missing visual')));
  image.referenceIds = ['front', 'voice'];
  assert.ok(validateAssets({ schemaVersion: 1, assets: [image] }, persona, dir).some(error => error.includes('incompatible with image')));
  const audio = productionAsset(persona, dir, 'audio');
  audio.referenceIds = ['front'];
  assert.ok(validateAssets({ schemaVersion: 1, assets: [audio] }, persona, dir).some(error => error.includes('Missing voice')));
  image.referenceIds = 'front';
  assert.ok(validateAssets({ schemaVersion: 1, assets: [image] }, persona, dir).length);
});

test('registration preserves files, refuses duplication, and does not promote media', () => {
  const { dir, persona } = fixture();
  const before = fileHash(dir, 'output.png');
  const asset = registerAsset(persona, dir, 'output.png', 'image');
  assert.equal(asset.status, 'draft');
  assert.equal(asset.review, null);
  assert.equal(fileHash(dir, 'output.png'), before);
  assert.equal(readJson(path.join(dir, 'assets.json')).assets.length, 1);
  assert.throws(() => registerAsset(persona, dir, 'output.png', 'image'), /already registered/);
  assert.equal(fs.existsSync(path.join(dir, '.assets.lock')), false);
});

test('on Windows, case differences do not duplicate the same file', t => {
  if (process.platform !== 'win32') { t.skip('Invariante de caminho do Windows.'); return; }
  const { dir, persona } = fixture();
  registerAsset(persona, dir, 'output.png', 'image');
  assert.throws(() => registerAsset(persona, dir, 'OUTPUT.PNG', 'image'), /already registered/);
  assert.equal(readJson(path.join(dir, 'assets.json')).assets.length, 1);
});

test('lock refuses concurrency while preserving the manifest', () => {
  const { dir, persona } = fixture();
  fs.writeFileSync(path.join(dir, '.assets.lock'), 'test process');
  const before = hash(fs.readFileSync(path.join(dir, 'assets.json')));
  assert.throws(() => registerAsset(persona, dir, 'output.png', 'image'), /in use/);
  assert.equal(hash(fs.readFileSync(path.join(dir, 'assets.json'))), before);
  assert.equal(fs.existsSync(path.join(dir, '.assets.lock')), true);
});

test('CLI creates an isolated persona, validates it, and refuses overwriting', () => {
  const dir = temporary();
  for (const folder of ['scripts', 'templates', 'influencers']) fs.mkdirSync(path.join(dir, folder));
  for (const folder of ['scripts', 'templates']) {
    for (const file of fs.readdirSync(path.join(root, folder)).filter(name => /\.(mjs|json|md)$/.test(name))) {
      fs.copyFileSync(path.join(root, folder, file), path.join(dir, folder, file));
    }
  }
  if (fs.existsSync(path.join(root, 'framework'))) fs.cpSync(path.join(root, 'framework'), path.join(dir, 'framework'), { recursive: true });
  const run = (...args) => spawnSync(process.execPath, [path.join(dir, 'scripts/studio.mjs'), ...args], { cwd: dir, encoding: 'utf8' });
  assert.equal(run('new', 'test-cli').status, 0);
  const profile = path.join(dir, 'influencers/test-cli/persona.json');
  const before = fs.readFileSync(profile, 'utf8');
  assert.equal(run('new', 'test-cli').status, 1);
  assert.equal(fs.readFileSync(profile, 'utf8'), before);
  assert.equal(run('validate', 'test-cli').status, 0);
  assert.match(run('list').stdout, /test-cli\tdraft/);
  assert.equal(run('new', '../outside').status, 1);
  fs.unlinkSync(path.join(dir, 'templates/brief.md'));
  assert.equal(run('new', 'missing-template').status, 1);
  assert.equal(fs.existsSync(path.join(dir, 'influencers/missing-template')), false);
  fs.unlinkSync(path.join(dir, 'influencers/test-cli/brief.md'));
  assert.equal(run('validate', 'test-cli').status, 1);
});
