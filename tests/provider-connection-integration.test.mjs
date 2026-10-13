import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { PassThrough } from 'node:stream';
import { spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { installFramework } from '../scripts/install-framework.mjs';
import { parseSetupOptions, runOnboarding } from '../scripts/onboarding.mjs';
import { runProviderConnect } from '../scripts/provider-connect.mjs';
import { createCredentialVault, credentialStatus, credentialsForStudio, saveCredentialForStudio } from '../scripts/provider-credentials.mjs';
import { planStudioSettings, saveStudioSettings } from '../scripts/studio-settings.mjs';
import { createPersona } from '../scripts/storage-core.mjs';
import { backupPersona } from '../scripts/backup-core.mjs';
import { readSecret } from '../scripts/secret-input.mjs';

const project = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const parent = path.join(project, 'tmp/provider-connection-integration-tests');
const png = Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), Buffer.from('Synthetic exact transport fixture, not inspected pixels.')]);
const mp4 = Buffer.concat([Buffer.from([0, 0, 0, 24]), Buffer.from('ftypisom\0\0\0\0Synthetic video transport, not motion quality.')]);
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const fingerprint = key => hash('byteplus\0ark\0' + key);
const json = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const scratch = [];
const signedURL = 'https://ark-content-generation-ap-southeast-1.tos-ap-southeast-1.volces.com/original.mp4?signature=synthetic-private-url';

function write(root, relative, value) {
  const target = path.join(root, relative); fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, typeof value === 'string' || Buffer.isBuffer(value) ? value : JSON.stringify(value, null, 2) + '\n');
}
function files(root) {
  const found = {};
  if (!fs.existsSync(root)) return found;
  for (const name of fs.readdirSync(root).sort()) {
    const target = path.join(root, name), stat = fs.lstatSync(target);
    assert(!stat.isSymbolicLink(), 'Unexpected link in this synthetic integration fixture.');
    if (stat.isDirectory()) Object.assign(found, Object.fromEntries(Object.entries(files(target)).map(([relative, value]) => [name + '/' + relative, value])));
    else found[name] = hash(fs.readFileSync(target));
  }
  return found;
}
function saveChoice(root) {
  const plan = planStudioSettings(root, 'byteplus');
  saveStudioSettings(root, 'byteplus', { expectedPreviousHash: plan.previousHash, studioId: plan.settings.studioId });
  return plan.settings;
}
function fixture() {
  fs.mkdirSync(parent, { recursive: true });
  const base = fs.mkdtempSync(path.join(parent, 'setup-')); scratch.push(base);
  const studio = path.join(base, 'studio'), source = path.join(base, 'source'), localAppData = path.join(base, 'local-app-data');
  installFramework(project, studio, { assistant: 'both' });
  const settings = saveChoice(studio);
  const environment = { ...process.env, LOCALAPPDATA: localAppData };
  delete environment.ARK_API_KEY; delete environment.BYTEPLUS_SPEECH_API_KEY;
  const calls = path.join(base, 'http-calls.jsonl'), control = path.join(base, 'http-control.json'), preload = path.join(base, 'strict-http.mjs');
  write(base, 'http-control.json', { acceptedFingerprints: [] });
  write(base, 'strict-http.mjs', `import fs from 'node:fs';import crypto from 'node:crypto';import assert from 'node:assert/strict';
const calls=${JSON.stringify(calls)},control=${JSON.stringify(control)};
globalThis.fetch=async(value,init={})=>{const url=new URL(value);const method=init.method??'GET';const policy=JSON.parse(fs.readFileSync(control,'utf8'));let fp=null;
if(url.origin==='https://ark.ap-southeast.bytepluses.com'){const header=init.headers?.Authorization;assert.equal(typeof header,'string','Missing scoped synthetic authorization');assert(header.startsWith('Bearer '));fp=crypto.createHash('sha256').update('byteplus\\0ark\\0'+header.slice(7)).digest('hex');assert(policy.acceptedFingerprints.includes(fp),'Unexpected synthetic credential fingerprint');}
else{assert.equal(url.origin,'https://ark-content-generation-ap-southeast-1.tos-ap-southeast-1.volces.com');assert.equal(init.headers?.Authorization,undefined,'Credentials must not reach output storage');}
const prior=fs.existsSync(calls)?fs.readFileSync(calls,'utf8').trim().split('\\n').filter(Boolean).map(JSON.parse):[];fs.appendFileSync(calls,JSON.stringify({method,path:url.pathname,fingerprint:fp})+'\\n');
if(method==='POST'&&url.pathname==='/api/v3/contents/generations/tasks')return new Response(JSON.stringify({id:'synthetic-original-video-'+(prior.filter(row=>row.method==='POST').length+1)}));
if(method==='POST'&&url.pathname==='/api/v3/images/generations')return new Response(JSON.stringify({data:[{b64_json:${JSON.stringify(png.toString('base64'))},output_format:'png'}]}));
if(method==='GET'&&url.pathname.startsWith('/api/v3/contents/generations/tasks/'))return new Response(JSON.stringify({id:url.pathname.split('/').at(-1),status:'succeeded',content:{video_url:${JSON.stringify(signedURL)}}}));
if(method==='GET'&&url.pathname==='/original.mp4')return new Response(Buffer.from(${JSON.stringify(mp4.toString('base64'))},'base64'));
throw new Error('Unexpected synthetic HTTP route');};
`);
  environment.NODE_OPTIONS = '--import=' + pathToFileURL(preload).href;
  const invokeRaw = (args, overrides = {}, binary = false) => spawnSync(process.execPath, [binary ? 'bin/olympox.mjs' : 'scripts/provider-execution.mjs', ...args], { cwd: studio, env: { ...environment, ...overrides }, encoding: 'utf8', windowsHide: true, timeout: 30000, maxBuffer: 4 * 1024 * 1024 });
  const invoke = (args, overrides) => {
    const result = invokeRaw(args, overrides);
    assert.equal(result.status, 0, result.stderr || 'Installed CLI failed without a public diagnostic.');
    return JSON.parse(result.stdout);
  };
  const httpCalls = () => fs.existsSync(calls) ? fs.readFileSync(calls, 'utf8').trim().split('\n').filter(Boolean).map(JSON.parse) : [];
  const allow = keys => write(base, 'http-control.json', { acceptedFingerprints: keys.map(fingerprint) });
  return { base, studio, source, localAppData, settings, environment, invoke, invokeRaw, httpCalls, allow };
}
function character(root, id) {
  const base = path.join(root, 'influencers', id);
  createPersona(root, id);
  const persona = json(path.join(base, 'persona.json'));
  Object.assign(persona.profile, { name: 'Synthetic ' + id, age: 30, audience: 'Local tests', valueProposition: 'Verify protected execution', backstory: 'Invented adult fixture, without identity approval.' });
  Object.assign(persona.identity, { face: 'Oval', eyes: 'Brown', hair: 'Short', skin: 'Natural', body: 'Adult proportions', invariants: ['Structure'] });
  Object.assign(persona.voice, { language: 'pt-BR', accent: 'Brazilian', tone: 'Calm', pace: 'Moderate' });
  write(root, `influencers/${id}/references/front.png`, png);
  persona.references = [{ id: 'front', role: 'front', path: 'references/front.png', status: 'approved', origin: 'Synthetic bytes only', sha256: hash(png), review: { reviewer: 'Synthetic observer', at: new Date().toISOString(), notes: 'Metadata simulation, not visual inspection.' } }];
  write(root, `influencers/${id}/persona.json`, persona);
  write(root, `influencers/${id}/prompts/request.txt`, 'Synthetic private reference preparation for ' + id);
  return base;
}
const provenance = eventId => ({ actor: 'Synthetic local observer', at: new Date().toISOString(), eventId, source: 'Controlled integration fixture', notes: 'No actual login, paid provider call or human approval.' });
function prepare(f, id, medium = 'image') {
  const promptPath = `influencers/${id}/prompts/request.txt`;
  const request = { schemaVersion: 1, characterId: id, purpose: 'reference', medium, provider: 'byteplus', model: medium === 'image' ? 'dola-seedream-5-0-pro-260628' : 'dreamina-seedance-2-5-260628', promptPath, parameters: medium === 'video' ? { duration: 5, resolution: '480p', ratio: '16:9', generate_audio: false } : {}, references: [{ referenceId: 'front', path: 'references/front.png', sha256: hash(png), bytes: png.length, kind: 'image', role: 'front', order: 0 }], hasSpeech: false, destination: { accountLabel: 'Synthetic own fixture account', region: 'ap-southeast-1' }, runBinding: null };
  const file = `work/${id}-request.json`; write(f.studio, file, request);
  return f.invoke(['prepare', file]);
}
function submit(f, job, env) {
  const file = `work/${job.id}-grant.json`;
  write(f.studio, file, { schemaVersion: 1, requestHash: job.requestHash, explicit: true, maximumUSD: 2, acceptEstimatedCost: true, acceptUnknownCost: true, expiresAt: new Date(Date.now() + 3600000).toISOString(), provenance: provenance('synthetic-grant') });
  return f.invoke(['submit', job.id, file], env);
}
function finishOriginal(f, job) {
  const file = `work/${job.id}-receipt.json`;
  write(f.studio, file, { schemaVersion: 1, requestHash: job.requestHash, providerJobId: job.providerJobId, status: 'succeeded', actualCostUSD: 0.01, provenance: provenance('synthetic-invoice') });
  return f.invoke(['reconcile', job.id, file]);
}
test.after(() => {
  for (const base of scratch) {
    assert.equal(path.dirname(path.resolve(base)), path.resolve(parent)); assert.match(path.basename(base), /^setup-/);
    fs.rmSync(base, { recursive: true, force: true });
  }
});

test('hidden paste is armed before its prompt; failed raw mode never solicits a key and immediate input cannot resume a closed reader', async () => {
  for (const denied of [true, false]) {
    const input = new PassThrough(), outputStream = new PassThrough();
    input.isTTY = true; input.isRaw = false; input.pause(); outputStream.isTTY = true;
    input.setRawMode = value => { if (value && denied) throw new Error('Synthetic private raw-mode diagnostic.'); input.isRaw = value; return input; };
    let displayed = '', prompted = false;
    const key = 'synthetic-immediate-private-paste';
    outputStream.on('data', chunk => {
      const text = chunk.toString(); displayed += text;
      if (text.includes('Private fixture key: ')) {
        prompted = true; assert.equal(input.isRaw, true, 'Echo must be disabled before requesting a key.');
        assert.equal(input.listenerCount('data'), 1, 'The private reader must be ready before showing its prompt.');
        input.emit('data', Buffer.from(key + '\r'));
      }
    });
    const pending = readSecret({ input, outputStream, prompt: 'Private fixture key: ' });
    if (denied) { await assert.rejects(pending, /could not start/); assert.equal(prompted, false); }
    else { assert.equal(await pending, key); assert.equal(prompted, true); }
    assert(!displayed.includes(key)); assert(!displayed.includes('Synthetic private raw-mode diagnostic'));
    assert.equal(input.isRaw, false); assert.equal(input.isPaused(), true); assert.equal(input.listenerCount('data'), 0);
    input.destroy(); outputStream.destroy();
  }
});

test('actual ordinary onboarding reader closes before hidden credential paste and cannot echo its bytes', async () => {
  const f = fixture(); installFramework(project, f.source, { assistant: 'both' });
  const target = path.join(f.base, 'connected-studio'), key = 'synthetic-raw-terminal-modelark-key';
  const input = new PassThrough(), outputStream = new PassThrough();
  input.isTTY = true; input.isRaw = false; input.setRawMode = value => { input.isRaw = value; return input; };
  outputStream.isTTY = true; outputStream.columns = 80;
  let displayed = '', modelarkSent = false, speechSent = false, puts = 0, priorDataListeners;
  outputStream.on('data', bytes => {
    const text = bytes.toString(); displayed += text;
    if (!modelarkSent && text.includes('ModelArk API key (hidden')) { modelarkSent = true; setImmediate(() => input.write(key + '\r')); }
    if (!speechSent && text.includes('Optional separate Speech API key (hidden')) { speechSent = true; setImmediate(() => input.write('\r')); }
  });
  const store = { supported: true, storage: 'windows-dpapi', status: () => ({ modelark: puts > 0, speech: false, storage: 'windows-dpapi' }), put: async (studioId, kind, value) => { assert.match(studioId, /^[a-f0-9-]{36}$/); assert.equal(kind, 'modelark'); assert.equal(hash(value), hash(key)); puts++; return { configured: true }; } };
  const result = await runOnboarding(f.source, parseSetupOptions([target, '--assistant', 'codex', '--locale', 'en', '--provider', 'byteplus']), {
    cwd: f.base, isTTY: true, input, outputStream,
    output: value => { displayed += value + '\n'; if (value === 'Install this studio?') setImmediate(() => input.write('yes\r')); if (value === 'Configure BytePlus now?') setImmediate(() => input.write('now\r')); },
    verify: async () => ({ ok: true, checks: [{ synthetic: true }] }),
    connect: async (root, options) => { priorDataListeners = input.listenerCount('data'); assert.equal(priorDataListeners, 0, 'The ordinary echo reader must be closed.'); return runProviderConnect(root, { ...options, env: {}, vault: store }); }
  });
  assert.equal(priorDataListeners, 0, 'The closed readline interface must leave exclusive hidden input available.');
  assert.equal(result.status, 'installed'); assert.equal(result.connection.status, 'configured'); assert.equal(puts, 1);
  assert.equal(modelarkSent, true); assert.equal(speechSent, true); assert(!displayed.includes(key));
  assert.equal(input.isRaw, false); assert.equal(input.listenerCount('data'), 0);
  input.destroy(); outputStream.destroy();
});

test('installed local job status and connector help/status/invalid arguments remain offline without credential reads or writes', () => {
  const f = fixture(); character(f.studio, 'alpha');
  const prepared = prepare(f, 'alpha'), before = files(f.studio);
  const result = f.invokeRaw(['status', prepared.id]);
  assert.equal(result.status, 0, result.stderr); assert.equal(JSON.parse(result.stdout).state, 'prepared');
  assert.deepEqual(files(f.studio), before); assert.equal(f.httpCalls().length, 0);
  for (const args of [['connect', 'help'], ['connect', 'status'], ['connect', 'byteplus', 'unexpected-argument'], ['connect', '--locale', 'unknown']]) {
    const output = f.invokeRaw(args, {}, true);
    assert.equal(output.status, args.includes('unexpected-argument') || args.includes('unknown') ? 1 : 0);
    if (args.includes('status')) assert.equal(JSON.parse(output.stdout).selectedProvider, 'byteplus');
    assert(!output.stderr.includes('unexpected-argument')); assert(!output.stderr.includes('unknown'));
    assert.deepEqual(files(f.studio), before); assert.equal(f.httpCalls().length, 0);
  }
});

test('a vault overlapping an exportable studio path refuses metadata, decryption, saving and paste before filesystem writes', async () => {
  const f = fixture();
  const cases = [
    { env: { LOCALAPPDATA: path.join(f.studio, 'scripts') } },
    { vaultRoot: f.base },
    ...(process.platform === 'win32' ? [{ vaultRoot: path.join(f.base, 'studio.', 'scripts', 'OLYMPOX', 'credentials') }] : [])
  ];
  let reads = 0, transforms = 0;
  for (const options of cases) {
    const vault = createCredentialVault({ ...options, platform: 'win32', transform: async () => { transforms++; assert.fail('An overlapping vault must not reach encryption or decryption.'); } });
    const before = files(f.base), outside = /outside|overlap|unsafe|alias|studio.*storage|storage.*studio/i;
    assert.throws(() => credentialStatus(f.studio, { env: {}, vault }), outside);
    await assert.rejects(credentialsForStudio(f.studio, { env: {}, vault, medium: 'image', promptMissing: true, readSecret: async () => { reads++; return 'synthetic-overlap-key'; } }), outside);
    await assert.rejects(saveCredentialForStudio(f.studio, 'modelark', 'synthetic-overlap-key', { env: {}, vault }), outside);
    await assert.rejects(runProviderConnect(f.studio, { env: {}, vault, output() {}, readSecret: async () => { reads++; return 'synthetic-overlap-key'; } }), outside);
    assert.deepEqual(files(f.base), before);
    assert(!fs.existsSync(path.join(f.studio, 'scripts', 'OLYMPOX')));
    assert(!fs.existsSync(path.join(f.base, f.settings.studioId)));
  }
  assert.equal(reads, 0); assert.equal(transforms, 0);
});

test('installed executor resolves protected original versions per queued job and environment overrides without persisting keys in jobs/backups', { skip: process.platform !== 'win32' ? 'Actual Windows protected persistence is exercised only on Windows.' : false }, async () => {
  const f = fixture(), first = 'synthetic-dpapi-cli-original-key', next = 'synthetic-dpapi-cli-rotated-key', override = 'synthetic-dpapi-cli-environment-key';
  const vault = createCredentialVault({ env: { LOCALAPPDATA: f.localAppData } });
  for (const id of ['alpha', 'beta', 'gamma', 'delta', 'epsilon', 'zeta']) character(f.studio, id);
  write(f.studio, 'work/budget.json', { schemaVersion: 1, maximumUSD: 100, perCharacter: {}, maxConcurrent: 2, provenance: provenance('synthetic-budget') });
  f.invoke(['budget', 'work/budget.json']); f.allow([first, next, override]);
  await saveCredentialForStudio(f.studio, 'modelark', first, { env: {}, vault });
  const original = submit(f, prepare(f, 'alpha', 'video')); assert.equal(original.state, 'submitted');
  await saveCredentialForStudio(f.studio, 'modelark', next, { env: {}, vault });
  const second = submit(f, prepare(f, 'beta', 'video')); assert.equal(second.state, 'submitted');
  await saveCredentialForStudio(f.studio, 'modelark', first, { env: {}, vault });
  const queuedFirst = submit(f, prepare(f, 'gamma')); assert.equal(queuedFirst.state, 'queued');
  await saveCredentialForStudio(f.studio, 'modelark', next, { env: {}, vault });
  const queuedNext = submit(f, prepare(f, 'delta')); assert.equal(queuedNext.state, 'queued');
  assert.equal(f.httpCalls().filter(row => row.method === 'POST').length, 2);
  const storeFile = path.join(f.localAppData, 'OLYMPOX/credentials', f.settings.studioId, 'modelark.json'), cipherBefore = fs.readFileSync(storeFile);
  try {
    fs.writeFileSync(storeFile, '{invalid protected fixture}');
    const invalid = f.invokeRaw(['dispatch', 'not-a-number']);
    assert.equal(invalid.status, 1); assert.match(invalid.stderr, /bounded.*dispatch|dispatch.*count/i);
    assert.doesNotMatch(invalid.stderr, /protected credential records/i);
    assert.equal(f.httpCalls().length, 2);
  } finally { fs.writeFileSync(storeFile, cipherBefore); }
  finishOriginal(f, original); finishOriginal(f, second);
  const dispatched = f.invoke(['dispatch', '2']);
  assert.deepEqual(dispatched.map(job => [job.id, job.state]), [[queuedFirst.id, 'succeeded'], [queuedNext.id, 'succeeded']]);
  assert.deepEqual(f.httpCalls().filter(row => row.method === 'POST').map(row => row.fingerprint), [fingerprint(first), fingerprint(next), fingerprint(first), fingerprint(next)]);
  const refreshed = f.invoke(['status', original.id]); assert.equal(refreshed.state, 'succeeded');
  assert.equal(f.httpCalls().at(-1).fingerprint, fingerprint(first));
  const exported = f.invoke(['export', original.id]); assert.deepEqual(fs.readFileSync(path.join(f.studio, exported.outputs[0].path)), mp4);
  assert.equal(f.httpCalls().at(-1).fingerprint, null);
  const nextPrepared = prepare(f, 'epsilon'), viaEnvironment = submit(f, nextPrepared, { ARK_API_KEY: override });
  assert.equal(viaEnvironment.credentialFingerprint, fingerprint(override)); assert.equal(f.httpCalls().at(-1).fingerprint, fingerprint(override));
  const oldCalls = f.httpCalls().length;
  const wrongOriginal = f.invokeRaw(['status', second.id], { ARK_API_KEY: override });
  assert.equal(wrongOriginal.status, 1); assert.match(wrongOriginal.stderr, /original|credential destination/i); assert.equal(f.httpCalls().length, oldCalls);
  const disabled = prepare(f, 'zeta'), grantPath = `work/${disabled.id}-disabled-grant.json`;
  write(f.studio, grantPath, { schemaVersion: 1, requestHash: disabled.requestHash, explicit: true, maximumUSD: 2, acceptEstimatedCost: true, acceptUnknownCost: true, expiresAt: new Date(Date.now() + 3600000).toISOString(), provenance: provenance('synthetic-disabled-grant') });
  assert.equal(f.invokeRaw(['submit', disabled.id, grantPath], { ARK_API_KEY: '' }).status, 1); assert.equal(f.httpCalls().length, oldCalls);
  assert.equal(f.invoke(['jobs']).find(job => job.id === disabled.id).state, 'prepared');
  const local = f.invoke(['export', queuedFirst.id], { ARK_API_KEY: '' });
  assert.equal(local.outputs[0].status, 'draft'); assert.deepEqual(fs.readFileSync(path.join(f.studio, local.outputs[0].path)), png);
  const repeated = f.invoke(['export', queuedFirst.id], { ARK_API_KEY: '' }); assert.deepEqual(repeated.outputs, local.outputs);
  assert.equal(f.httpCalls().length, oldCalls);
  assert.equal(json(storeFile).entries.length, 2); assert.equal(json(storeFile).activeFingerprint, fingerprint(next));
  const backup = backupPersona(f.studio, 'alpha');
  const privateRoots = [path.join(f.studio, 'work/provider-execution'), path.join(f.studio, 'influencers/alpha'), path.join(f.studio, 'backups', backup.backupId)];
  for (const root of privateRoots) for (const relative of Object.keys(files(root))) {
    const bytes = fs.readFileSync(path.join(root, relative));
    for (const sensitive of [first, next, override, signedURL]) assert(!bytes.includes(Buffer.from(sensitive)), 'Sensitive fixture data escaped protected storage.');
  }
});
