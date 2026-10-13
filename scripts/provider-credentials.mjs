import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawn } from 'node:child_process';
import { readStudioSettings } from './studio-settings.mjs';
import { readSecret } from './secret-input.mjs';
import { isFrameworkDevelopment } from './development-context.mjs';

const MAX_FILE = 1024 * 1024, MAX_VERSIONS = 128;
const need = (ok, message) => { if (!ok) throw new Error(message); };
const object = value => value && typeof value === 'object' && !Array.isArray(value);
const exact = (value, names) => object(value) && Object.keys(value).sort().join(',') === [...names].sort().join(',');
const uuid = value => typeof value === 'string' && /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/.test(value);
const hash = value => typeof value === 'string' && /^[a-f0-9]{64}$/.test(value);
const kinds = ['modelark', 'speech'];
function secret(value) { need(typeof value === 'string' && /^[\x21-\x7e]{1,4096}$/.test(value), 'Invalid provider credential; its value was not recorded.'); return value; }
function keyFingerprint(kind, value) { return crypto.createHash('sha256').update(`byteplus\0${kind === 'speech' ? 'speech' : 'ark'}\0${value}`).digest('hex'); }
function base64(value) { return typeof value === 'string' && value.length > 0 && value.length <= 16384 && /^[a-zA-Z0-9+/]+={0,2}$/.test(value) && Buffer.from(value, 'base64').toString('base64') === value; }

// The command is constant. Secret bytes travel only through private stdin/stdout pipes.
const POWERSHELL_PROGRAM = `$ErrorActionPreference='Stop';try { Add-Type -AssemblyName System.Security; $request=[Console]::In.ReadToEnd() | ConvertFrom-Json; $bytes=[Convert]::FromBase64String($request.payload); $entropy=[Text.Encoding]::UTF8.GetBytes($request.entropy); if ($request.operation -eq 'protect') { $result=[Security.Cryptography.ProtectedData]::Protect($bytes,$entropy,[Security.Cryptography.DataProtectionScope]::CurrentUser) } elseif ($request.operation -eq 'unprotect') { $result=[Security.Cryptography.ProtectedData]::Unprotect($bytes,$entropy,[Security.Cryptography.DataProtectionScope]::CurrentUser) } else { throw 'Invalid operation' }; [Console]::Out.Write([Convert]::ToBase64String($result)) } catch { [Console]::Error.Write('Protected credential operation failed.'); exit 1 }`;
const ENCODED_PROGRAM = Buffer.from(POWERSHELL_PROGRAM, 'utf16le').toString('base64');
async function windowsTransform(operation, payload, entropy) {
  need(process.platform === 'win32', 'Protected credential storage is unavailable on this platform.');
  const executable = path.join(process.env.SystemRoot || 'C:\\Windows', 'System32', 'WindowsPowerShell', 'v1.0', 'powershell.exe');
  const environment = { ...process.env };
  delete environment.ARK_API_KEY; delete environment.BYTEPLUS_SPEECH_API_KEY;
  return new Promise((resolve, reject) => {
    let child, settled = false, output = [], outputBytes = 0;
    const finish = (error, value) => { if (settled) return; settled = true; clearTimeout(timer); output.forEach(buffer => buffer.fill(0)); output = []; if (error) reject(new Error('Protected credential storage could not complete the private operation.')); else resolve(value); };
    const timer = setTimeout(() => { child?.kill(); finish(true); }, 15000);
    try { child = spawn(executable, ['-NoLogo', '-NoProfile', '-NonInteractive', '-EncodedCommand', ENCODED_PROGRAM], { windowsHide: true, stdio: ['pipe', 'pipe', 'pipe'], shell: false, env: environment }); }
    catch { finish(true); return; }
    child.once('error', () => finish(true)); child.stdin.on('error', () => finish(true));
    child.stdout.on('data', bytes => { outputBytes += bytes.length; if (outputBytes > 32768) { child.kill(); finish(true); } else output.push(Buffer.from(bytes)); });
    // Raw PowerShell diagnostics must never be inherited or included in an error.
    let errorBytes = 0;
    child.stderr.on('data', bytes => { errorBytes += bytes.length; if (errorBytes > 4096) { child.kill(); finish(true); } });
    child.once('close', code => {
      if (settled) return;
      const result = Buffer.concat(output).toString('ascii');
      if (code !== 0 || !base64(result)) { finish(true); return; }
      finish(false, result);
    });
    child.stdin.end(JSON.stringify({ operation, payload, entropy }));
  });
}

function safePath(target, type, create = false) {
  const absolute = path.resolve(target), parsed = path.parse(absolute);
  need(path.isAbsolute(target) && !target.includes('\0') && !absolute.startsWith('\\\\'), 'Credential storage requires a safe local absolute path.');
  let current = parsed.root;
  const segments = absolute.slice(parsed.root.length).split(path.sep).filter(Boolean);
  if (process.platform === 'win32') need(segments.every(segment => !/[<>:"|?*\x00-\x1f]/.test(segment) && !/[. ]$/.test(segment) && !/^(?:con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.|$)/i.test(segment)), 'Credential storage refuses unsafe path aliases or segments.');
  let physical;
  try { physical = fs.realpathSync.native(parsed.root); } catch { throw new Error('Credential storage root could not be inspected.'); }
  for (let index = 0; index < segments.length; index++) {
    current = path.join(current, segments[index]);
    const leaf = index === segments.length - 1;
    let stat;
    try { stat = fs.lstatSync(current); } catch (error) { if (error.code !== 'ENOENT') throw new Error('Credential storage path could not be inspected.'); }
    if (!stat && create && (!leaf || type === 'directory')) { fs.mkdirSync(current, { mode: 0o700 }); stat = fs.lstatSync(current); }
    if (stat) {
      need(!stat.isSymbolicLink() && (leaf && type === 'file' ? stat.isFile() : stat.isDirectory()), 'Credential storage refuses links, junctions and unsafe file types.');
      try { physical = fs.realpathSync.native(current); } catch { throw new Error('Credential storage path could not be inspected.'); }
    } else physical = path.join(physical, segments[index]);
  }
  return physical;
}
function validateRecord(value, studioId, kind) {
  need(exact(value, ['schemaVersion', 'studioId', 'kind', 'activeFingerprint', 'entries']) && value.schemaVersion === 1 && value.studioId === studioId && value.kind === kind && hash(value.activeFingerprint) && Array.isArray(value.entries) && value.entries.length > 0 && value.entries.length <= MAX_VERSIONS, 'Invalid protected credential records; existing bytes were preserved.');
  const found = new Set();
  for (const entry of value.entries) {
    need(exact(entry, ['fingerprint', 'protected', 'createdAt']) && hash(entry.fingerprint) && !found.has(entry.fingerprint) && base64(entry.protected) && typeof entry.createdAt === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(entry.createdAt) && Number.isFinite(Date.parse(entry.createdAt)), 'Invalid protected credential version; existing bytes were preserved.');
    found.add(entry.fingerprint);
  }
  need(found.has(value.activeFingerprint), 'Protected active credential version is missing.'); return value;
}

/** Windows CurrentUser DPAPI, outside the studio. Existing encrypted versions are retained. */
export function createCredentialVault({ env = process.env, platform = process.platform, vaultRoot, transform = windowsTransform } = {}) {
  const base = vaultRoot ?? (env.LOCALAPPDATA ? path.join(env.LOCALAPPDATA, 'OLYMPOX', 'credentials') : null);
  const supported = platform === 'win32' && typeof base === 'string' && path.isAbsolute(base);
  function assertOutsideStudio(root) {
    const studio = safePath(path.resolve(root), 'directory');
    if (base === null) return;
    const directory = safePath(base, 'directory');
    const contains = (parent, child) => {
      const relative = path.relative(parent, child);
      return relative === '' || relative !== '..' && !relative.startsWith('..' + path.sep) && !path.isAbsolute(relative);
    };
    need(!contains(studio, directory) && !contains(directory, studio), 'Protected credentials must stay outside the studio and its ancestor directories.');
  }
  function location(studioId, kind, create = false) {
    need(uuid(studioId) && kinds.includes(kind), 'Invalid studio credential scope.');
    need(supported, 'Protected credential persistence is unavailable; use hidden session input or configure later.');
    safePath(base, 'directory', create);
    const directory = safePath(path.join(base, studioId), 'directory', create);
    return safePath(path.join(directory, kind + '.json'), 'file');
  }
  function inspect(studioId, kind) {
    const file = location(studioId, kind);
    if (!fs.existsSync(file)) return { record: null, hash: null };
    need(fs.statSync(file).size <= MAX_FILE, 'Protected credential records exceed the bounded size.');
    let value, bytes;
    try { bytes = fs.readFileSync(file); value = JSON.parse(bytes.toString('utf8')); } catch { throw new Error('Protected credential records could not be read; their bytes were preserved.'); }
    return { record: validateRecord(value, studioId, kind), hash: crypto.createHash('sha256').update(bytes).digest('hex') };
  }
  const read = (studioId, kind) => inspect(studioId, kind).record;
  const entropy = (studioId, kind) => `OLYMPOX protected credentials v1\0${studioId}\0${kind}`;
  return {
    supported,
    storage: supported ? 'windows-dpapi' : 'unsupported',
    assertOutsideStudio,
    status(studioId) {
      if (!supported) return { modelark: false, speech: false, storage: 'unsupported' };
      return { modelark: Boolean(read(studioId, 'modelark')), speech: Boolean(read(studioId, 'speech')), storage: 'windows-dpapi' };
    },
    async get(studioId, kind, { fingerprint } = {}) {
      if (!supported) return null;
      need(fingerprint === undefined || hash(fingerprint), 'Invalid original credential fingerprint.');
      const record = read(studioId, kind); if (!record) return null;
      const entry = record.entries.find(item => item.fingerprint === (fingerprint ?? record.activeFingerprint));
      if (!entry) return null;
      let decoded;
      try { decoded = await transform('unprotect', entry.protected, entropy(studioId, kind)); }
      catch { throw new Error('The original protected credential is unavailable for this OS user.'); }
      need(base64(decoded), 'Protected credential response was invalid.');
      const bytes = Buffer.from(decoded, 'base64');
      let value;
      try { value = secret(bytes.toString('utf8')); } finally { bytes.fill(0); }
      need(keyFingerprint(kind, value) === entry.fingerprint, 'Protected credential identity differs from its recorded version.'); return value;
    },
    async put(studioId, kind, value) {
      secret(value);
      const file = location(studioId, kind, true), lock = safePath(file + '.lock', 'file');
      let lockFd;
      try { lockFd = fs.openSync(lock, 'wx', 0o600); } catch { throw new Error('Protected credential storage is locked or unavailable; existing versions were preserved.'); }
      const temporary = file + '.tmp-' + crypto.randomUUID();
      try {
        const observed = inspect(studioId, kind), existing = observed.record, originalHash = observed.hash;
        const fingerprint = keyFingerprint(kind, value);
        const record = existing ?? { schemaVersion: 1, studioId, kind, activeFingerprint: fingerprint, entries: [] };
        if (!record.entries.some(entry => entry.fingerprint === fingerprint)) {
          need(record.entries.length < MAX_VERSIONS, 'Protected credential history is full; existing versions were preserved.');
          let encrypted;
          try { encrypted = await transform('protect', Buffer.from(value, 'utf8').toString('base64'), entropy(studioId, kind)); }
          catch { throw new Error('Protected credential storage failed; no plaintext fallback was used.'); }
          need(base64(encrypted), 'Protected credential response was invalid.');
          record.entries.push({ fingerprint, protected: encrypted, createdAt: new Date().toISOString() });
        }
        record.activeFingerprint = fingerprint; validateRecord(record, studioId, kind);
        const bytes = Buffer.from(JSON.stringify(record, null, 2) + '\n'); need(bytes.length <= MAX_FILE, 'Protected credential records exceed the bounded size.');
        safePath(temporary, 'file');
        const fd = fs.openSync(temporary, 'wx', 0o600);
        try { fs.writeFileSync(fd, bytes); fs.fsyncSync(fd); } finally { fs.closeSync(fd); }
        // Recheck the entire destination path immediately before the atomic replacement.
        location(studioId, kind);
        const currentHash = fs.existsSync(file) ? crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex') : null;
        need(currentHash === originalHash, 'Protected credential versions changed during saving; existing bytes were preserved.');
        fs.renameSync(temporary, file);
        return { storage: 'windows-dpapi', configured: true };
      } finally {
        fs.closeSync(lockFd);
        if (fs.existsSync(temporary)) { safePath(temporary, 'file'); fs.unlinkSync(temporary); }
        safePath(lock, 'file'); fs.unlinkSync(lock);
      }
    }
  };
}

/** Read local configuration status without decrypting a key or calling a provider. */
export function credentialStatus(root, { env = process.env, vault = createCredentialVault({ env }) } = {}) {
  vault.assertOutsideStudio?.(root);
  const settings = readStudioSettings(root);
  const saved = settings ? vault.status(settings.studioId) : { modelark: false, speech: false, storage: vault.storage ?? 'unsupported' };
  const configured = (name, present) => Object.hasOwn(env, name) ? typeof env[name] === 'string' && /^[\x21-\x7e]{1,4096}$/.test(env[name]) : present;
  const modelark = configured('ARK_API_KEY', saved.modelark), speech = configured('BYTEPLUS_SPEECH_API_KEY', saved.speech);
  return { configured: { image: modelark, video: modelark, audio: speech }, accountAccess: 'unverified', storage: saved.storage, selectedProvider: settings?.mediaProvider ?? 'higgsfield' };
}

/** Resolve only the requested medium, retaining explicit environment overrides. */
export async function credentialsForStudio(root, { env = process.env, medium, fingerprint, promptMissing = false, input = process.stdin, outputStream = process.stdout, readSecret: reader = readSecret, vault = createCredentialVault({ env }) } = {}) {
  vault.assertOutsideStudio?.(root);
  need(medium === undefined || ['image', 'video', 'audio'].includes(medium), 'Invalid credential medium.');
  need(fingerprint === undefined || fingerprint === null || hash(fingerprint), 'Invalid original credential fingerprint.');
  need(!fingerprint || medium !== undefined, 'Original credential recovery requires its medium.');
  const required = medium === 'audio' ? ['speech'] : medium ? ['modelark'] : kinds;
  const result = { apiKey: undefined, speechApiKey: undefined };
  let settings;
  for (const kind of required) {
    const envName = kind === 'speech' ? 'BYTEPLUS_SPEECH_API_KEY' : 'ARK_API_KEY', field = kind === 'speech' ? 'speechApiKey' : 'apiKey';
    if (Object.hasOwn(env, envName)) {
      const value = env[envName];
      if (value !== undefined && value !== null && value !== '') result[field] = secret(value);
      continue; // An explicit empty override disables the saved key and hidden fallback.
    }
    settings ??= readStudioSettings(root);
    let value = settings ? await vault.get(settings.studioId, kind, { ...(fingerprint ? { fingerprint } : {}) }) : null;
    if (!value && promptMissing) {
      try { value = await reader({ input, outputStream, prompt: kind === 'speech' ? 'BytePlus Speech API key (hidden, this operation only): ' : 'BytePlus ModelArk API key (hidden, this operation only): ' }); }
      catch { throw new Error('Private provider credential input could not complete.'); }
      if (value === null || value === '') value = null;
    }
    if (value) {
      secret(value);
      if (fingerprint) need(keyFingerprint(kind, value) === fingerprint, 'Use the original provider credential for this job.');
      result[field] = value;
    }
  }
  return result;
}

export async function saveCredentialForStudio(root, kind, value, { env = process.env, vault = createCredentialVault({ env }) } = {}) {
  need(!isFrameworkDevelopment(root), 'Credential configuration requires an independent installed studio.');
  vault.assertOutsideStudio?.(root);
  const settings = readStudioSettings(root); need(settings, 'Configure the studio preference before saving a protected credential.');
  return vault.put(settings.studioId, kind, secret(value));
}
