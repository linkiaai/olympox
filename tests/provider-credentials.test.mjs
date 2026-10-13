import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { PassThrough } from 'node:stream';
import { createCredentialVault, credentialsForStudio, credentialStatus, saveCredentialForStudio } from '../scripts/provider-credentials.mjs';
import { runProviderConnect } from '../scripts/provider-connect.mjs';
import { readSecret } from '../scripts/secret-input.mjs';

const STUDIO_ID = '7ba25f28-8c20-4aaa-b6b9-c50cb25c5e19';
const fingerprint = (kind, key) => crypto.createHash('sha256').update(`byteplus\0${kind === 'speech' ? 'speech' : 'ark'}\0${key}`).digest('hex');
function fixture(t) {
  const tempBase = path.resolve(os.tmpdir());
  const base = fs.mkdtempSync(path.join(tempBase, 'olympox-credential-test-'));
  t.after(() => { assert.equal(path.dirname(path.resolve(base)), tempBase); assert(path.basename(base).startsWith('olympox-credential-test-')); fs.rmSync(base, { recursive: true, force: true }); });
  const root = path.join(base, 'studio'), vaultRoot = path.join(base, 'protected-store');
  fs.mkdirSync(path.join(root, 'work'), { recursive: true }); fs.mkdirSync(path.join(root, 'influencers'));
  fs.writeFileSync(path.join(root, 'work/studio-settings.json'), JSON.stringify({ schemaVersion: 1, studioId: STUDIO_ID, mediaProvider: 'byteplus' }));
  return { root, base, vaultRoot };
}
function encryptedFixture(vaultRoot) {
  const key = crypto.randomBytes(32), calls = [];
  const transform = async (operation, payload, entropy) => {
    calls.push(operation);
    if (operation === 'protect') {
      const iv = crypto.randomBytes(12), cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
      cipher.setAAD(Buffer.from(entropy));
      const encrypted = Buffer.concat([cipher.update(Buffer.from(payload, 'base64')), cipher.final()]);
      return Buffer.concat([iv, cipher.getAuthTag(), encrypted]).toString('base64');
    }
    const bytes = Buffer.from(payload, 'base64'), decipher = crypto.createDecipheriv('aes-256-gcm', key, bytes.subarray(0, 12));
    decipher.setAAD(Buffer.from(entropy)); decipher.setAuthTag(bytes.subarray(12, 28));
    return Buffer.concat([decipher.update(bytes.subarray(28)), decipher.final()]).toString('base64');
  };
  return { vault: createCredentialVault({ platform: 'win32', vaultRoot, transform }), transform, calls };
}
function terminal() {
  const input = new PassThrough(), outputStream = new PassThrough();
  input.isTTY = true; input.isRaw = false; input.setRawMode = value => { input.isRaw = value; }; input.pause();
  outputStream.isTTY = true; let displayed = '';
  outputStream.on('data', value => { displayed += value.toString(); });
  return { input, outputStream, displayed: () => displayed };
}
function files(root) {
  const found = {};
  if (!fs.existsSync(root)) return found;
  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    const file = path.join(root, entry.name);
    if (entry.isDirectory()) Object.assign(found, Object.fromEntries(Object.entries(files(file)).map(([relative, hash]) => [entry.name + '/' + relative, hash])));
    else found[entry.name] = crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
  }
  return found;
}

test('hidden input never echoes secret bytes and restores raw mode, pause state and listeners', async () => {
  const tty = terminal(), beforeSignal = process.listenerCount('SIGINT');
  const pending = readSecret({ ...tty, prompt: 'Private key: ' });
  assert.equal(tty.input.isRaw, true);
  tty.input.emit('data', Buffer.from('synthetic-secretX\b\r\n'));
  assert.equal(await pending, 'synthetic-secret');
  assert.equal(tty.displayed(), 'Private key: \n');
  assert.equal(tty.input.isRaw, false); assert.equal(tty.input.isPaused(), true);
  assert.equal(tty.input.listenerCount('data'), 0); assert.equal(tty.input.listenerCount('end'), 0);
  assert.equal(process.listenerCount('SIGINT'), beforeSignal);
});

test('hidden input cancellation, EOF, controls, multiline paste and limits reveal no entered bytes', async () => {
  for (const [bytes, outcome] of [[Buffer.from('synthetic-cancel\x03'), 'cancel'], [Buffer.from('synthetic-eof\x04'), 'cancel'], [Buffer.from('synthetic-escape\x1b'), 'error'], [Buffer.from('synthetic-control\t'), 'error'], [Buffer.from('synthetic-line\nsecond'), 'error'], [Buffer.from('12345'), 'error']]) {
    const tty = terminal(), pending = readSecret({ ...tty, maxLength: bytes.toString() === '12345' ? 4 : 4096 });
    tty.input.emit('data', bytes);
    if (outcome === 'cancel') assert.equal(await pending, null); else await assert.rejects(pending, error => !error.message.includes('synthetic'));
    assert(!tty.displayed().includes('synthetic')); assert.equal(tty.input.isRaw, false); assert.equal(tty.input.listenerCount('data'), 0);
  }
  const tty = terminal(), pending = readSecret(tty); tty.input.emit('end'); assert.equal(await pending, null);
  const occupied = terminal(); occupied.input.on('data', () => {}); await assert.rejects(readSecret(occupied), /exclusive/);
  await assert.rejects(readSecret({ input: {}, outputStream: {} }), /private interactive terminal/);
});

test('untouched terminal input returns to inactive flow after hidden input instead of retaining the CLI', async () => {
  const input = new PassThrough(), outputStream = new PassThrough();
  input.isTTY = true; input.isRaw = false; input.setRawMode = value => { input.isRaw = value; };
  outputStream.isTTY = true; outputStream.resume();
  assert.equal(input.readableFlowing, null); assert.equal(input.isPaused(), false);
  const pending = readSecret({ input, outputStream }); input.emit('data', Buffer.from('synthetic-untouched-key\r'));
  assert.equal(await pending, 'synthetic-untouched-key');
  assert.equal(input.isPaused(), true); assert.equal(input.readableFlowing, false); assert.equal(input.isRaw, false);
  assert.equal(input.listenerCount('data'), 0);
});

test('encrypted history restores original job credentials and local status never decrypts', async t => {
  const { root, vaultRoot } = fixture(t), { vault, calls } = encryptedFixture(vaultRoot);
  const first = 'synthetic-original-modelark-key', second = 'synthetic-rotated-modelark-key';
  await saveCredentialForStudio(root, 'modelark', first, { env: {}, vault });
  await saveCredentialForStudio(root, 'modelark', second, { env: {}, vault });
  const beforeStatus = calls.length;
  assert.deepEqual(credentialStatus(root, { env: {}, vault }), { configured: { image: true, video: true, audio: false }, accountAccess: 'unverified', storage: 'windows-dpapi', selectedProvider: 'byteplus' });
  assert.equal(calls.length, beforeStatus);
  assert.equal((await credentialsForStudio(root, { env: {}, medium: 'video', vault })).apiKey, second);
  assert.equal((await credentialsForStudio(root, { env: {}, medium: 'video', fingerprint: fingerprint('modelark', first), vault })).apiKey, first);
  const record = JSON.parse(fs.readFileSync(path.join(vaultRoot, STUDIO_ID, 'modelark.json'), 'utf8'));
  assert.equal(record.entries.length, 2);
  assert(!JSON.stringify(record).includes(first)); assert(!JSON.stringify(record).includes(second));
  assert(!fs.existsSync(path.join(root, 'credentials'))); assert.equal(fs.readdirSync(path.join(root, 'work')).length, 1);
});

test('explicit environment including empty values wins, and only the required medium is decrypted', async t => {
  const { root } = fixture(t), accesses = [];
  const vault = { supported: true, storage: 'windows-dpapi', status: () => ({ modelark: true, speech: true, storage: 'windows-dpapi' }), get: async (...args) => { accesses.push(args); return args[1] === 'speech' ? 'synthetic-speech-key' : 'synthetic-saved-key'; } };
  assert.deepEqual(await credentialsForStudio(root, { env: { ARK_API_KEY: 'synthetic-environment-key' }, medium: 'image', vault }), { apiKey: 'synthetic-environment-key', speechApiKey: undefined });
  assert.equal(accesses.length, 0);
  assert.deepEqual(await credentialsForStudio(root, { env: { ARK_API_KEY: '' }, medium: 'image', promptMissing: true, readSecret: () => { throw new Error('Must not prompt'); }, vault }), { apiKey: undefined, speechApiKey: undefined });
  assert.equal(accesses.length, 0);
  assert.deepEqual(await credentialsForStudio(root, { env: {}, medium: 'audio', vault }), { apiKey: undefined, speechApiKey: 'synthetic-speech-key' });
  assert.equal(accesses.length, 1); assert.equal(accesses[0][1], 'speech');
  const envKey = 'synthetic-explicit-different-original';
  assert.equal((await credentialsForStudio(root, { env: { ARK_API_KEY: envKey }, medium: 'image', fingerprint: fingerprint('modelark', 'other-key'), vault })).apiKey, envKey);
});

test('unsupported persistence still supports hidden in-memory execution and original-key guards', async t => {
  const { root, vaultRoot } = fixture(t), vault = createCredentialVault({ platform: 'linux', vaultRoot });
  const before = files(root), key = 'synthetic-session-modelark-key';
  assert.equal((await credentialsForStudio(root, { env: {}, medium: 'video', promptMissing: true, readSecret: async () => key, vault })).apiKey, key);
  assert.deepEqual(before, files(root)); assert(!fs.existsSync(vaultRoot));
  await assert.rejects(credentialsForStudio(root, { env: {}, medium: 'video', fingerprint: fingerprint('modelark', 'original-key'), promptMissing: true, readSecret: async () => key, vault }), /original provider credential/);
  await assert.rejects(credentialsForStudio(root, { env: {}, medium: 'video', promptMissing: true, readSecret: async () => { throw new Error(key); }, vault }), error => !error.message.includes(key));
  assert.equal((await credentialsForStudio(root, { env: {}, medium: 'image', promptMissing: true, readSecret: async () => null, vault })).apiKey, undefined);
});

test('connector configures local Ark and optional Speech, redacts failures and defers without plaintext', async t => {
  const { root, vaultRoot } = fixture(t), { vault } = encryptedFixture(vaultRoot);
  const key = 'synthetic-connector-modelark-key', speechKey = 'synthetic-connector-speech-key', messages = [], sequence = [key, speechKey];
  const result = await runProviderConnect(root, { env: {}, vault, locale: 'pt-BR', output: value => messages.push(value), readSecret: async () => sequence.shift() });
  assert.equal(result.status, 'configured'); assert.deepEqual(result.configured, { image: true, video: true, audio: true }); assert.equal(result.accountAccess, 'unverified');
  assert(!messages.join('\n').includes(key)); assert(!messages.join('\n').includes(speechKey)); assert(messages.some(value => value.includes('não chama o provedor')));
  const before = files(vaultRoot);
  assert.equal((await runProviderConnect(root, { env: {}, vault, output: value => messages.push(value), readSecret: async () => null })).status, 'cancelled');
  assert.equal((await runProviderConnect(root, { env: {}, vault, output: value => messages.push(value), readSecret: async () => '' })).status, 'deferred');
  assert.equal((await runProviderConnect(root, { env: {}, vault, output: value => messages.push(value), readSecret: async () => { throw new Error(key); } })).status, 'cancelled');
  assert.deepEqual(before, files(vaultRoot)); assert(!messages.join('\n').includes(key));
  const unsupported = createCredentialVault({ platform: 'linux', vaultRoot: path.join(path.dirname(vaultRoot), 'unsupported') });
  assert.equal((await runProviderConnect(root, { env: {}, vault: unsupported, output: value => messages.push(value), readSecret: async () => { throw new Error('Must not prompt'); } })).status, 'unsupported');
});

test('credential paths, malformed ciphertext and transform failures refuse unsafe writes', async t => {
  const { root, vaultRoot, base } = fixture(t), { vault, transform } = encryptedFixture(vaultRoot);
  await vault.put(STUDIO_ID, 'modelark', 'synthetic-preserved-key');
  const file = path.join(vaultRoot, STUDIO_ID, 'modelark.json'), original = fs.readFileSync(file);
  await assert.rejects(vault.put('../../escape', 'modelark', 'synthetic-key'), /scope/);
  await assert.rejects(vault.put(STUDIO_ID, '../escape', 'synthetic-key'), /scope/);
  await assert.rejects(vault.put(STUDIO_ID, 'modelark', 'synthetic key with spaces'), /Invalid provider credential/);
  const failedVault = createCredentialVault({ platform: 'win32', vaultRoot, transform: async () => { throw new Error('synthetic-sensitive-transform-value'); } });
  await assert.rejects(failedVault.put(STUDIO_ID, 'modelark', 'synthetic-new-key'), error => !error.message.includes('synthetic-sensitive-transform-value'));
  assert.deepEqual(fs.readFileSync(file), original);
  fs.writeFileSync(file, '{"plaintext":"synthetic-do-not-print"}');
  assert.throws(() => credentialStatus(root, { env: {}, vault }), error => !error.message.includes('synthetic-do-not-print'));
  await assert.rejects(vault.put(STUDIO_ID, 'modelark', 'synthetic-new-key'), /existing bytes were preserved/);
  assert.equal(fs.readFileSync(file, 'utf8'), '{"plaintext":"synthetic-do-not-print"}');
  fs.writeFileSync(file, original);
  const outside = path.join(base, 'unrelated-store'); fs.mkdirSync(outside);
  const linked = path.join(base, 'linked-store'); fs.symlinkSync(outside, linked, process.platform === 'win32' ? 'junction' : 'dir');
  const linkedVault = createCredentialVault({ platform: 'win32', vaultRoot: linked, transform });
  await assert.rejects(linkedVault.put(STUDIO_ID, 'modelark', 'synthetic-key'), /links, junctions/);
  assert.deepEqual(fs.readdirSync(outside), []);
  const record = JSON.parse(original); record.entries[0].protected = Buffer.from('tampered-ciphertext').toString('base64'); fs.writeFileSync(file, JSON.stringify(record));
  await assert.rejects(vault.get(STUDIO_ID, 'modelark'), /unavailable for this OS user/);
});

test('concurrent external credential drift preserves both existing bytes and all old versions', async t => {
  const { vaultRoot } = fixture(t), { vault, transform } = encryptedFixture(vaultRoot);
  await vault.put(STUDIO_ID, 'modelark', 'synthetic-original-key');
  const file = path.join(vaultRoot, STUDIO_ID, 'modelark.json'), changed = fs.readFileSync(file, 'utf8') + '\n';
  const racing = createCredentialVault({ platform: 'win32', vaultRoot, transform: async (...args) => { fs.writeFileSync(file, changed); return transform(...args); } });
  await assert.rejects(racing.put(STUDIO_ID, 'modelark', 'synthetic-next-key'), /changed during saving/);
  assert.equal(fs.readFileSync(file, 'utf8'), changed);
  assert.equal(JSON.parse(changed).entries.length, 1);
  assert(!fs.readdirSync(path.dirname(file)).some(name => name.includes('.tmp-') || name.endsWith('.lock')));
});

test('bound credential helpers refuse vault/studio overlap before metadata, secret input or writes', async t => {
  const { root, base } = fixture(t), key = 'synthetic-refused-inside-studio-key', before = files(root);
  let prompts = 0, transforms = 0;
  const transform = async () => { transforms++; return Buffer.from('synthetic-encrypted-value').toString('base64'); };
  for (const vault of [
    createCredentialVault({ platform: 'win32', env: { LOCALAPPDATA: path.join(root, 'scripts') }, transform }),
    createCredentialVault({ platform: 'win32', vaultRoot: root, transform }),
    createCredentialVault({ platform: 'win32', vaultRoot: base, transform })
  ]) {
    assert.throws(() => credentialStatus(root, { env: {}, vault }), /outside the studio/);
    await assert.rejects(credentialsForStudio(root, { env: {}, medium: 'image', promptMissing: true, vault, readSecret: async () => { prompts++; return key; } }), /outside the studio/);
    await assert.rejects(saveCredentialForStudio(root, 'modelark', key, { env: {}, vault }), /outside the studio/);
    await assert.rejects(runProviderConnect(root, { env: {}, vault, output() {}, readSecret: async () => { prompts++; return key; } }), /outside the studio/);
  }
  assert.equal(prompts, 0); assert.equal(transforms, 0); assert.deepEqual(files(root), before);
  if (process.platform === 'win32') for (const alias of [path.join(root + '.', 'scripts'), path.join(root + ' ', 'scripts'), path.join(root, 'scripts:alternate'), path.join(root, 'CON')]) {
    const vault = createCredentialVault({ platform: 'win32', vaultRoot: alias, transform });
    await assert.rejects(runProviderConnect(root, { env: {}, vault, output() {}, readSecret: async () => { prompts++; return key; } }), /unsafe path aliases/);
  }
  assert.equal(prompts, 0); assert.equal(transforms, 0); assert.deepEqual(files(root), before);
});

test('actual Windows DPAPI roundtrip protects synthetic secrets and preserves original recovery', { skip: process.platform !== 'win32' ? 'Windows CurrentUser DPAPI is platform-specific.' : false }, async t => {
  const { root, vaultRoot } = fixture(t), vault = createCredentialVault({ vaultRoot });
  const key = 'synthetic-real-dpapi-original-key', next = 'synthetic-real-dpapi-next-key';
  assert.equal(vault.supported, true);
  await saveCredentialForStudio(root, 'modelark', key, { env: {}, vault });
  await saveCredentialForStudio(root, 'modelark', next, { env: {}, vault });
  assert.equal((await credentialsForStudio(root, { env: {}, medium: 'video', fingerprint: fingerprint('modelark', key), vault })).apiKey, key);
  assert.equal((await credentialsForStudio(root, { env: {}, medium: 'video', vault })).apiKey, next);
  const bytes = fs.readFileSync(path.join(vaultRoot, STUDIO_ID, 'modelark.json'));
  assert(!bytes.includes(Buffer.from(key))); assert(!bytes.includes(Buffer.from(next)));
  assert.equal(JSON.parse(bytes).entries.length, 2);
});
