import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { installFramework } from '../scripts/install-framework.mjs';
import { parseSetupOptions, runOnboarding } from '../scripts/onboarding.mjs';
import { readStudioSettings, planStudioSettings, saveStudioSettings, preferredMediaProviders } from '../scripts/studio-settings.mjs';
import { startRun, readRun, resumeRun } from '../scripts/framework-core.mjs';
import { stableHash } from '../scripts/storage-core.mjs';

const project = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const parent = path.join(project, 'tmp/provider-onboarding-tests');
const scratch = [];
const settingsPath = 'work/studio-settings.json';
const higgsfield = { image: 'higgsfield', video: 'higgsfield', audio: 'higgsfield' };
const byteplus = { image: 'byteplus', video: 'byteplus', audio: 'byteplus' };
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
const originalFetch = globalThis.fetch;
let networkAttempts = 0;

function write(root, relative, value) {
  const target = path.join(root, relative);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, typeof value === 'string' ? value : JSON.stringify(value, null, 2) + '\n');
}
function fixture({ installed = false, assistant = 'codex' } = {}) {
  fs.mkdirSync(parent, { recursive: true });
  const base = fs.mkdtempSync(path.join(parent, 'setup-')); scratch.push(base);
  const source = path.join(base, 'source'), studio = path.join(base, 'studio');
  // Use complete reusable sources in an independent synthetic installation.
  // No media, provider account or host-discovery claim is made by this fixture.
  installFramework(project, source, { assistant: 'both' });
  if (installed) installFramework(source, studio, { assistant });
  return { base, source, studio };
}
function inventory(root) {
  if (!fs.existsSync(root)) return null;
  const entries = {};
  function visit(relative = '') {
    for (const name of fs.readdirSync(path.join(root, relative)).sort()) {
      const item = relative ? relative + '/' + name : name;
      const target = path.join(root, item), stat = fs.lstatSync(target);
      if (stat.isSymbolicLink()) entries[item] = ['link', fs.readlinkSync(target)];
      else if (stat.isDirectory()) { entries[item] = ['directory']; visit(item); }
      else entries[item] = ['file', crypto.createHash('sha256').update(fs.readFileSync(target)).digest('hex')];
    }
  }
  visit(); return entries;
}
function saveChoice(root, provider) {
  const plan = planStudioSettings(root, provider);
  saveStudioSettings(root, provider, { expectedPreviousHash: plan.previousHash, studioId: plan.settings.studioId });
  return plan.settings;
}
function session(answers, extra = {}) {
  const prompts = [], output = [], events = [];
  const queues = Object.fromEntries(Object.entries(answers).map(([key, value]) => [key, Array.isArray(value) ? [...value] : [value]]));
  const io = {
    isTTY: true,
    output: value => output.push(value),
    ask: async question => {
      prompts.push(question); events.push(question.id);
      assert(queues[question.id]?.length, 'Unexpected prompt: ' + question.id);
      const answer = queues[question.id].shift();
      return typeof answer === 'function' ? answer(question) : answer;
    },
    verify: async () => { events.push('verify'); return { ok: true, checks: [{ synthetic: true, notes: 'Injected local verifier; not the full product gate.' }] }; },
    connect: async () => assert.fail('Configure-later must not read credentials or connect.'),
    ...extra
  };
  return { io, prompts, output, events };
}
function begin(root, mediaProviders) {
  return startRun(root, { workflowId: 'create-character', objective: 'Synthetic offline provider selection only', ...(mediaProviders ? { mediaProviders } : {}) });
}
function historicalRun(root, withoutProviders = false) {
  const run = begin(root), file = path.join(root, 'work/runs', run.runId + '.json');
  if (withoutProviders) {
    const record = JSON.parse(fs.readFileSync(file, 'utf8'));
    delete record.attempts[0].mediaProviders;
    const { recordHash, ...body } = record;
    record.recordHash = stableHash(body);
    fs.writeFileSync(file, JSON.stringify(record, null, 2) + '\n');
  }
  return { run: readRun(root, run.runId), file };
}

test.before(() => {
  globalThis.fetch = async () => { networkAttempts++; assert.fail('Onboarding/preferences must stay offline and never call a provider.'); };
});
test.after(() => {
  globalThis.fetch = originalFetch;
  assert.equal(networkAttempts, 0);
  for (const base of scratch) {
    assert.equal(path.dirname(path.resolve(base)), path.resolve(parent));
    assert.match(path.basename(base), /^setup-/);
    fs.rmSync(base, { recursive: true, force: true });
  }
});

test('provider setup parsing accepts only one explicit supported preference and never a credential argument', () => {
  assert.equal(parseSetupOptions([]).provider, null);
  assert.equal(parseSetupOptions(['studio', '--assistant', 'both', '--provider', 'byteplus', '--yes']).provider, 'byteplus');
  assert.equal(parseSetupOptions(['--provider', 'higgsfield']).provider, 'higgsfield');
  for (const args of [['--provider'], ['--provider', '--yes'], ['--provider', 'other'], ['--provider', 'BytePlus'], ['--provider', 'byteplus', '--provider', 'higgsfield'], ['--api-key', 'synthetic-private-key']]) assert.throws(() => parseSetupOptions(args));
});

test('preference planning writes nothing; saved studio identity and logically identical historical bytes remain stable', () => {
  const { studio } = fixture({ installed: true }), before = inventory(studio);
  assert.equal(readStudioSettings(studio), null);
  const plan = planStudioSettings(studio, 'byteplus');
  assert.deepEqual(Object.keys(plan.settings).sort(), ['mediaProvider', 'schemaVersion', 'studioId']);
  assert.equal(plan.settings.schemaVersion, 1); assert.equal(plan.settings.mediaProvider, 'byteplus');
  assert.match(plan.settings.studioId, uuid); assert.equal(plan.previousHash, null);
  assert.deepEqual(inventory(studio), before);
  saveStudioSettings(studio, 'byteplus', { expectedPreviousHash: plan.previousHash, studioId: plan.settings.studioId });
  assert.deepEqual(readStudioSettings(studio), plan.settings);
  const historicalBytes = '{\r\n "schemaVersion": 1, "studioId": "' + plan.settings.studioId + '", "mediaProvider": "byteplus"\r\n}\r\n';
  write(studio, settingsPath, historicalBytes);
  const identical = planStudioSettings(studio, 'byteplus'), sameBefore = inventory(studio);
  saveStudioSettings(studio, 'byteplus', { expectedPreviousHash: identical.previousHash, studioId: identical.settings.studioId });
  assert.deepEqual(inventory(studio), sameBefore);
  assert.equal(fs.readFileSync(path.join(studio, settingsPath), 'utf8'), historicalBytes);
  const changed = saveChoice(studio, 'higgsfield');
  assert.equal(changed.studioId, plan.settings.studioId);
});

test('strict private settings reject malformed schemas and drift without changing consumer files or exposing malformed content', () => {
  const { studio } = fixture({ installed: true });
  const valid = { schemaVersion: 1, studioId: crypto.randomUUID(), mediaProvider: 'byteplus' };
  for (const malformed of [null, [], { ...valid, schemaVersion: 2 }, { ...valid, studioId: 'not-a-uuid' }, { schemaVersion: 1, mediaProvider: 'byteplus' }, { ...valid, mediaProvider: 'other' }, { ...valid, apiKey: 'synthetic-private-key' }, '{"private":"SYNTHETIC_PRIVATE_FRAGMENT']) {
    write(studio, settingsPath, malformed);
    const before = inventory(studio);
    for (const operation of [() => readStudioSettings(studio), () => planStudioSettings(studio, 'byteplus'), () => saveStudioSettings(studio, 'byteplus')]) {
      assert.throws(operation, error => { assert.doesNotMatch(error.message, /SYNTHETIC_PRIVATE_FRAGMENT|synthetic-private-key/); return true; });
      assert.deepEqual(inventory(studio), before);
    }
  }
  write(studio, settingsPath, valid);
  const plan = planStudioSettings(studio, 'higgsfield');
  write(studio, settingsPath, { ...valid, mediaProvider: 'higgsfield' });
  const concurrent = inventory(studio);
  assert.throws(() => saveStudioSettings(studio, 'higgsfield', { expectedPreviousHash: plan.previousHash, studioId: plan.settings.studioId }), /changed|drift|review/i);
  assert.deepEqual(inventory(studio), concurrent);
});

test('interleaved initial preference writers cannot replace the winning studio identity or leave lock/temp residue', () => {
  const { studio } = fixture({ installed: true });
  const first = planStudioSettings(studio, 'higgsfield'), concurrent = planStudioSettings(studio, 'byteplus');
  assert.notEqual(first.settings.studioId, concurrent.settings.studioId);
  const target = path.join(studio, settingsPath), originalRename = fs.renameSync;
  let interleaved = false;
  fs.renameSync = function (source, destination, ...args) {
    if (!interleaved && path.resolve(destination) === path.resolve(target)) {
      interleaved = true;
      const beforeCompetingWrite = inventory(studio);
      assert.throws(() => saveStudioSettings(studio, 'byteplus', { expectedPreviousHash: concurrent.previousHash, studioId: concurrent.settings.studioId }), /lock|use|progress|concurrent/i);
      assert.deepEqual(inventory(studio), beforeCompetingWrite);
    }
    return originalRename.call(fs, source, destination, ...args);
  };
  try { saveStudioSettings(studio, 'higgsfield', { expectedPreviousHash: first.previousHash, studioId: first.settings.studioId }); }
  finally { fs.renameSync = originalRename; }
  assert.equal(interleaved, true);
  assert.deepEqual(readStudioSettings(studio), first.settings);
  const winning = inventory(studio);
  assert.throws(() => saveStudioSettings(studio, 'byteplus', { expectedPreviousHash: concurrent.previousHash, studioId: concurrent.settings.studioId }), /changed|drift|review/i);
  assert.deepEqual(inventory(studio), winning);
  assert.deepEqual(fs.readdirSync(path.join(studio, 'work')), ['studio-settings.json']);
});

test('preference writes refuse a linked private scope and a framework development marker before changing files', () => {
  const { studio, base } = fixture({ installed: true });
  const outside = path.join(base, 'outside'); fs.mkdirSync(outside);
  write(outside, 'studio-settings.json', { schemaVersion: 1, studioId: crypto.randomUUID(), mediaProvider: 'byteplus' });
  const originalOutside = inventory(outside), link = path.join(studio, 'work');
  fs.symlinkSync(outside, link, process.platform === 'win32' ? 'junction' : 'dir');
  try {
    const before = inventory(studio);
    assert.throws(() => planStudioSettings(studio, 'byteplus'), /link|junction|outside|unsafe/i);
    assert.throws(() => saveStudioSettings(studio, 'byteplus'), /link|junction|outside|unsafe/i);
    assert.deepEqual(inventory(studio), before); assert.deepEqual(inventory(outside), originalOutside);
  } finally { fs.unlinkSync(link); }
  write(studio, '.development/project.json', { schemaVersion: 1, kind: 'framework-development' });
  const developmentBefore = inventory(studio);
  assert.throws(() => saveStudioSettings(studio, 'byteplus'), /development|independent.*studio/i);
  assert.deepEqual(inventory(studio), developmentBefore);
});

test('new runs resolve registry then studio then explicit medium overrides without changing registry or preferences', () => {
  const { studio } = fixture({ installed: true });
  const registryPath = path.join(studio, 'framework/registry.json'), registryBefore = fs.readFileSync(registryPath);
  assert.deepEqual(preferredMediaProviders(studio, higgsfield), higgsfield);
  assert.deepEqual(begin(studio).mediaProviders, higgsfield);
  saveChoice(studio, 'byteplus');
  const preferenceBefore = fs.readFileSync(path.join(studio, settingsPath));
  assert.deepEqual(preferredMediaProviders(studio, higgsfield), byteplus);
  assert.deepEqual(begin(studio).mediaProviders, byteplus);
  assert.deepEqual(begin(studio, { image: 'integrated-images', audio: 'higgsfield' }).mediaProviders, { image: 'integrated-images', video: 'byteplus', audio: 'higgsfield' });
  assert.deepEqual(fs.readFileSync(registryPath), registryBefore);
  assert.deepEqual(fs.readFileSync(path.join(studio, settingsPath)), preferenceBefore);
});

test('changing a studio default does not rewrite or drift captured and legacy runs; resume preserves their prior selection', () => {
  for (const legacy of [false, true]) {
    const { studio } = fixture({ installed: true });
    const historical = historicalRun(studio, legacy), before = fs.readFileSync(historical.file), prior = historical.run.run.attempts[0];
    saveChoice(studio, 'byteplus');
    const observed = readRun(studio, historical.run.runId);
    assert.deepEqual(fs.readFileSync(historical.file), before);
    assert.deepEqual(observed.run, historical.run.run);
    assert.deepEqual(observed.mediaProviders, legacy ? null : higgsfield);
    const resumed = resumeRun(studio, historical.run.runId, { newAttempt: true, reason: 'Synthetic explicit retry, preserving the saved media method.' });
    assert.deepEqual(resumed.mediaProviders, higgsfield);
    assert.deepEqual(resumed.run.contract, historical.run.run.contract);
    assert.deepEqual(resumed.run.attempts[0].mediaProviders, prior.mediaProviders);
    assert.deepEqual(resumed.run.attempts[0].inputs, prior.inputs);
    assert.deepEqual(begin(studio).mediaProviders, byteplus);
  }
});

test('interactive BytePlus selection persists only private settings and permits configuring later after verification in either language', async () => {
  for (const locale of ['en', 'pt-BR']) {
    const { base, source, studio } = fixture(), sourceBefore = inventory(source);
    const flow = session({ provider: 'byteplus', confirm: 'yes', 'configure-provider': 'later' }, { cwd: base });
    const result = await runOnboarding(source, parseSetupOptions([studio, '--assistant', 'both', '--locale', locale]), flow.io);
    assert.equal(result.status, 'installed'); assert.equal(result.provider, 'byteplus'); assert.equal(result.providerReadiness, 'pending');
    assert.deepEqual(flow.events, ['provider', 'confirm', 'verify', 'configure-provider']);
    assert.equal(flow.prompts[0].defaultValue, 'higgsfield'); assert.equal(flow.prompts.at(-1).defaultValue, 'later');
    assert.equal(readStudioSettings(studio).mediaProvider, 'byteplus'); assert.deepEqual(begin(studio).mediaProviders, byteplus);
    assert.deepEqual(inventory(source), sourceBefore);
    assert.deepEqual(fs.readdirSync(path.join(studio, 'work')).sort(), ['runs', 'studio-settings.json']);
    assert.equal(fs.existsSync(path.join(studio, 'influencers', 'alpha')), false);
  }
});

test('provider choice or installation confirmation cancellation causes zero destination and source writes', async () => {
  for (const cancelledAt of ['provider', 'confirm']) {
    const { base, source, studio } = fixture(), before = inventory(base);
    const flow = session({ provider: 'byteplus', confirm: 'yes', [cancelledAt]: null }, { cwd: base, verify: async () => assert.fail('Cancelled installation cannot verify or connect.') });
    assert.equal((await runOnboarding(source, parseSetupOptions([studio, '--assistant', 'codex', '--locale', 'en']), flow.io)).status, 'cancelled');
    assert.deepEqual(inventory(base), before);
    assert.equal(fs.existsSync(studio), false);
  }
});

test('private setting drift at confirmation and framework conflicts refuse before adding another host or changing private history', async () => {
  const { base, source, studio } = fixture({ installed: true });
  saveChoice(studio, 'higgsfield');
  write(studio, '.git/config', 'Synthetic preserved Git metadata.');
  write(studio, 'influencers/preserved/persona.json', 'Synthetic immutable private history.');
  let afterDrift;
  const flow = session({ provider: 'byteplus', confirm: () => {
    const current = readStudioSettings(studio);
    write(studio, settingsPath, { ...current, mediaProvider: 'byteplus' });
    afterDrift = inventory(studio); return 'yes';
  } }, { cwd: base, verify: async () => assert.fail('Drift must refuse before installed verification.') });
  await assert.rejects(() => runOnboarding(source, parseSetupOptions([studio, '--assistant', 'both', '--locale', 'en', '--merge']), flow.io), /changed|drift|review/i);
  assert.deepEqual(inventory(studio), afterDrift);
  assert.equal(fs.existsSync(path.join(studio, '.claude')), false);
  write(studio, 'README.md', 'Conflicting existing README, not replaceable.');
  const conflictBefore = inventory(studio);
  const conflict = session({ 'destination-conflict': 'cancel' }, { cwd: base });
  assert.equal((await runOnboarding(source, parseSetupOptions([studio, '--assistant', 'both', '--locale', 'en', '--merge']), conflict.io)).status, 'cancelled');
  assert.deepEqual(inventory(studio), conflictBefore);
  assert.equal(conflict.prompts.some(question => question.id === 'provider'), false);
});

test('noninteractive setup retains an existing preference or selects Higgsfield, and never prompts for credentials', async () => {
  for (const existing of [null, 'byteplus']) {
    const { base, source, studio } = fixture({ installed: existing !== null });
    let preferenceBefore;
    if (existing) { saveChoice(studio, existing); preferenceBefore = fs.readFileSync(path.join(studio, settingsPath)); }
    const args = [studio, '--assistant', 'both', '--locale', 'en', '--yes', ...(existing ? ['--merge'] : [])];
    const result = await runOnboarding(source, parseSetupOptions(args), { cwd: base, isTTY: false, output() {}, ask: async () => assert.fail('--yes must not ask for choices or credentials.'), connect: async () => assert.fail('--yes must not read credentials.'), verify: async () => ({ ok: true, checks: [{ synthetic: true }] }) });
    assert.equal(result.provider, existing ?? 'higgsfield');
    assert.equal(readStudioSettings(studio).mediaProvider, existing ?? 'higgsfield');
    if (existing) assert.deepEqual(fs.readFileSync(path.join(studio, settingsPath)), preferenceBefore);
  }
});

test('configure-now uses a separate connection hook only after successful verification; verification failure preserves installation without a credential read', async () => {
  for (const verified of [true, false]) {
    const { base, source, studio } = fixture(); let connections = 0;
    const flow = session({ provider: 'byteplus', confirm: 'yes', 'configure-provider': 'now' }, { cwd: base });
    flow.io.verify = async () => { flow.events.push('verify'); return { ok: verified, checks: [{ synthetic: true }] }; };
    flow.io.connect = async (target, options) => {
      connections++; flow.events.push('connect'); assert.equal(target, studio); assert.equal(options.locale, 'en');
      assert.equal(readStudioSettings(target).mediaProvider, 'byteplus');
      return { status: 'configured', accountAccess: 'unverified', synthetic: true };
    };
    const result = await runOnboarding(source, parseSetupOptions([studio, '--assistant', 'codex', '--locale', 'en']), flow.io);
    assert.equal(result.status, verified ? 'installed' : 'verification-failed');
    assert.equal(connections, verified ? 1 : 0);
    assert.deepEqual(flow.events, verified ? ['provider', 'confirm', 'verify', 'configure-provider', 'connect'] : ['provider', 'confirm', 'verify']);
    assert.equal(readStudioSettings(studio).mediaProvider, 'byteplus');
  }
});
