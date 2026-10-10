import fs from 'node:fs';
import path from 'node:path';
import { createHash, randomUUID } from 'node:crypto';
import { spawn } from 'node:child_process';
import { isFrameworkDevelopment } from './development-context.mjs';

export const NATIVE_BASELINE = Object.freeze({ version: '1.1.26', binarySha256: '0e973c9cf072ec27af8be61e374c8aba5842766bd21654e28dfa758605ca76da' });
const MAX_BYTES = 64 * 1024 * 1024;
const MAX_OUTPUT = 1024 * 1024;
const digest = bytes => createHash('sha256').update(bytes).digest('hex');
const types = new Map([['.png', 'image'], ['.jpg', 'image'], ['.jpeg', 'image'], ['.webp', 'image'], ['.gif', 'image'], ['.mp4', 'video'], ['.mov', 'video'], ['.webm', 'video'], ['.mp3', 'audio'], ['.wav', 'audio'], ['.m4a', 'audio'], ['.ogg', 'audio']]);
const states = new Set(['planned', 'submitting', 'uncertain', 'uploaded', 'not-submitted']);
export class TransferError extends Error {}
function fail(message) { throw new TransferError(message); }
function need(condition, message) { if (!condition) fail(message); }
function object(value) { return value && typeof value === 'object' && !Array.isArray(value); }
function exact(value, keys) { return object(value) && Object.keys(value).sort().join(',') === [...keys].sort().join(','); }
function identifier(value) { return typeof value === 'string' && /^[a-zA-Z0-9][a-zA-Z0-9_.:-]{0,127}$/.test(value); }
function mediaIdentifier(value) { return typeof value === 'string' && /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(value); }
function token(value) { return typeof value === 'string' && /^[a-z][a-z0-9-]{0,63}$/.test(value); }
function hash(value) { return typeof value === 'string' && /^[a-f0-9]{64}$/.test(value); }
function text(value) { return typeof value === 'string' && value.trim().length > 0 && value.length <= 2048 && !/[\x00-\x1f\x7f]|https?:\/\/|\bBearer\s|\bAuthorization\s*:|[^\s@]+@[^\s@]+/i.test(value); }
function relativePath(value) { return typeof value === 'string' && value.length <= 512 && !/[\\:\x00-\x1f\x7f<>"|?*]/.test(value) && !path.posix.isAbsolute(value) && value.split('/').every(part => part && part !== '.' && part !== '..' && !/[. ]$/.test(part) && !/^(con|prn|aux|nul|com[0-9]|lpt[0-9])(?:\.|$)/i.test(part)); }
function stat(file) { try { return fs.lstatSync(file); } catch (error) { if (error.code === 'ENOENT') return null; fail('A local path could not be inspected.'); } }

// Inspect every component: realpath confinement alone permits links into the tree.
export function strictPath(root, relative, kind = 'file', missing = false) {
  need(relativePath(relative), 'Use a safe relative slash path without unsafe components.');
  const absolute = path.resolve(root), parsed = path.parse(absolute);
  let current = parsed.root;
  for (const segment of absolute.slice(parsed.root.length).split(path.sep).filter(Boolean)) {
    current = path.join(current, segment);
    const info = stat(current);
    need(info?.isDirectory() && !info.isSymbolicLink(), 'Studio parent paths must be regular directories without links.');
  }
  const parts = relative.split('/');
  for (let index = 0; index < parts.length; index++) {
    current = path.join(current, parts[index]);
    const info = stat(current);
    if (!info) { need(missing, 'A required local path is missing.'); continue; }
    need(!info.isSymbolicLink(), 'Links and junctions are refused.');
    need(index < parts.length - 1 || kind === 'directory' ? info.isDirectory() : info.isFile(), 'Unexpected local path type.');
  }
  return current;
}
function context(root, character) {
  need(token(character), 'Use a canonical character ID.');
  strictPath(root, `influencers/${character}`, 'directory');
  try { need(!isFrameworkDevelopment(root), 'Reference transfer is unavailable in the framework development checkout; use an independent studio.'); }
  catch (error) { if (error instanceof TransferError) throw error; fail('Invalid framework development context.'); }
  return `influencers/${character}/.reference-transfers`;
}
function sourceSpec(value) {
  need(exact(value, ['referenceId', 'path', 'sha256', 'bytes', 'mediaType', 'role', 'order']), 'Invalid exact-source specification.');
  need(identifier(value.referenceId) && hash(value.sha256) && Number.isSafeInteger(value.bytes) && value.bytes > 0 && value.bytes <= MAX_BYTES && token(value.role) && Number.isInteger(value.order) && value.order >= 0 && value.order < 100, 'Invalid reference identity, digest, size or role/order.');
  need(relativePath(value.path) && /^(references|media)\//.test(value.path) && types.get(path.posix.extname(value.path).toLowerCase()) === value.mediaType, 'Unsupported source location or media extension/type.');
}
function destinationSpec(value) {
  need(exact(value, ['provider', 'route', 'accountFingerprint', 'workspaceId']) && value.provider === 'higgsfield' && value.route === 'native-cli' && hash(value.accountFingerprint) && identifier(value.workspaceId), 'Invalid exact destination.');
}
function nativeSpec(value) { need(exact(value, ['version', 'binarySha256']) && value.version === NATIVE_BASELINE.version && value.binarySha256 === NATIVE_BASELINE.binarySha256, 'Native baseline differs from the verified Windows x64 CLI.'); }
function specification(value) {
  need(exact(value, ['schemaVersion', 'id', 'source', 'destination', 'native']) && value.schemaVersion === 1 && token(value.id), 'Invalid transfer specification.');
  sourceSpec(value.source); destinationSpec(value.destination); nativeSpec(value.native);
  return value;
}
function eventSpec(value) {
  need(exact(value, ['actor', 'at', 'event', 'source', 'notes']) && [value.actor, value.event, value.source, value.notes].every(text) && typeof value.at === 'string' && /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d{3})?Z$/.test(value.at) && Number.isFinite(Date.parse(value.at)), 'An actual actor/date/event/source/notes declaration is required; omit credentials, email and URLs.');
}
const canonical = value => JSON.stringify(value, Object.keys(value).sort());
function scopeMatches(value, spec) { return canonical(value.source) === canonical(spec.source) && canonical(value.destination) === canonical(spec.destination) && canonical(value.native) === canonical(spec.native); }
function validateScope(value, spec, keys) {
  need(exact(value, keys) && value.schemaVersion === 1 && value.transferId === spec.id, 'Invalid transfer evidence envelope.');
  sourceSpec(value.source); destinationSpec(value.destination); nativeSpec(value.native); eventSpec(value.provenance);
  need(scopeMatches(value, spec), 'Transfer evidence does not match the exact source, native route and destination.');
}
function readJson(file) {
  try { const bytes = fs.readFileSync(file); need(bytes.length <= MAX_OUTPUT, 'Local JSON exceeds the bounded input size.'); return JSON.parse(bytes.toString('utf8').replace(/^\uFEFF/, '')); }
  catch (error) { if (error instanceof TransferError) throw error; fail('Local JSON could not be read or parsed.'); }
}
export function readTransferInput(root, relative) { return readJson(strictPath(root, relative)); }
function sourcePath(root, character, spec) { return strictPath(root, `influencers/${character}/${spec.source.path}`); }
function checkedBytes(file, source) {
  try { const info = fs.lstatSync(file); need(info.isFile() && !info.isSymbolicLink() && info.size === source.bytes, 'Exact source or snapshot size changed.'); const bytes = fs.readFileSync(file); need(bytes.length === source.bytes && digest(bytes) === source.sha256, 'Exact source or snapshot digest changed.'); return bytes; }
  catch (error) { if (error instanceof TransferError) throw error; fail('Exact source or snapshot could not be read.'); }
}
function paths(root, character, id) {
  const base = context(root, character); need(token(id), 'Invalid transfer ID.');
  return { base, directory: `${base}/${id}`, intent: `${base}/${id}/intent.json`, lock: `${base}/.transfer.lock` };
}
function readRecord(root, character, id) {
  const locations = paths(root, character, id), record = readJson(strictPath(root, locations.intent));
  const allowed = new Set(['schemaVersion', 'character', 'spec', 'snapshot', 'state', 'createdAt', 'authorization', 'dispatchedAt', 'mediaId', 'mediaType', 'acknowledgedAt', 'reason', 'reconciliation', 'resolvedAt', 'libraryExists']);
  need(object(record) && Object.keys(record).every(key => allowed.has(key)) && record.schemaVersion === 1 && record.character === character && states.has(record.state), 'Invalid private transfer record.');
  specification(record.spec); need(record.spec.id === id, 'Transfer record ID does not match its directory.');
  need(record.snapshot === `${locations.directory}/snapshot${path.posix.extname(record.spec.source.path).toLowerCase()}`, 'Invalid controlled snapshot location.');
  strictPath(root, record.snapshot);
  need(record.mediaId === undefined || mediaIdentifier(record.mediaId), 'Invalid recorded native media ID.');
  need(record.mediaType === undefined || record.mediaType === 'image', 'Invalid recorded native media type.');
  if (record.authorization) eventSpec(record.authorization);
  if (record.reconciliation) eventSpec(record.reconciliation);
  if (record.reason) need(['Upload outcome is uncertain; reconcile the original operation without retrying.', 'No source-bound resolution exists; library absence or unknown-ID timestamps never authorize retry.'].includes(record.reason), 'Invalid private uncertainty reason.');
  return { locations, record };
}
function inventory(root, base) {
  const directory = strictPath(root, base, 'directory', true);
  if (!stat(directory)) return [];
  const records = [];
  for (const entry of fs.readdirSync(directory)) {
    if (entry === '.transfer.lock' || entry === '.reconcile.lock') { strictPath(root, `${base}/${entry}`); continue; }
    need(token(entry), 'Unknown file in the private transfer directory.');
    strictPath(root, `${base}/${entry}`, 'directory');
    const record = readRecord(root, base.split('/')[1], entry).record;
    records.push(record);
  }
  return records;
}
function unresolved(records) { return records.some(record => record.state === 'submitting' || record.state === 'uncertain'); }
function lock(root, locations) {
  const file = strictPath(root, locations.lock, 'file', true);
  need(!stat(file), 'Transfer lock exists; inspect the earlier operation before reconciliation.');
  const nonce = randomUUID();
  try { fs.writeFileSync(file, JSON.stringify({ pid: process.pid, nonce }), { flag: 'wx', mode: 0o600 }); }
  catch { fail('Another local operation owns the transfer lock.'); }
  return () => { try { if (readJson(strictPath(root, locations.lock)).nonce === nonce) fs.unlinkSync(file); } catch { /* A lost lock is a local recovery limitation, never permission to retry. */ } };
}
function saveRecord(root, locations, record) {
  const file = strictPath(root, locations.intent), temporary = `${locations.directory}/.state-${randomUUID()}.tmp`;
  strictPath(root, temporary, 'file', true);
  try { fs.writeFileSync(path.join(root, temporary), `${JSON.stringify(record, null, 2)}\n`, { flag: 'wx', mode: 0o600 }); strictPath(root, locations.intent); fs.renameSync(path.join(root, temporary), file); }
  catch { fail('Private state persistence failed; inspect the retained intent before any further transfer.'); }
}
function summary(record) {
  return { schemaVersion: 1, character: record.character, id: record.spec.id, state: record.state, source: record.spec.source, destination: record.spec.destination, native: record.spec.native, support: record.spec.source.mediaType === 'image' ? 'image-only-native-send' : 'awaiting-verified-media-type', mediaId: record.mediaId ?? null, mediaType: record.mediaType ?? null, libraryExists: record.libraryExists ?? false, providerBytes: 'unverified', pluginAccess: 'unverified', generationReadiness: 'unverified', ...(record.reason ? { reason: record.reason } : {}) };
}

export function planTransfer(root, character, input) {
  const spec = specification(input), locations = paths(root, character, spec.id);
  const source = sourcePath(root, character, spec);
  strictPath(root, locations.directory, 'directory', true); strictPath(root, locations.intent, 'file', true); strictPath(root, locations.lock, 'file', true);
  const snapshot = `${locations.directory}/snapshot${path.posix.extname(spec.source.path).toLowerCase()}`;
  strictPath(root, snapshot, 'file', true);
  const records = inventory(root, locations.base);
  need(!unresolved(records), 'Reconcile the earlier uncertain transfer before creating another intent.');
  need(!stat(path.join(root, locations.directory)) && !stat(path.join(root, locations.lock)), 'Transfer ID or lock already exists; no overwrite is permitted.');
  const bytes = checkedBytes(source, spec.source);
  fs.mkdirSync(path.join(root, locations.base), { recursive: true, mode: 0o700 });
  const release = lock(root, locations);
  try {
    need(!unresolved(inventory(root, locations.base)), 'An earlier uncertain transfer must be reconciled.');
    fs.mkdirSync(path.join(root, locations.directory), { mode: 0o700 });
    fs.writeFileSync(path.join(root, snapshot), bytes, { flag: 'wx', mode: 0o400 });
    const record = { schemaVersion: 1, character, spec: structuredClone(spec), snapshot, state: 'planned', createdAt: new Date().toISOString() };
    fs.writeFileSync(path.join(root, locations.intent), `${JSON.stringify(record, null, 2)}\n`, { flag: 'wx', mode: 0o600 });
    return summary(record);
  } finally { release(); }
}
export function transferStatus(root, character, id) { return summary(readRecord(root, character, id).record); }

function httpsUrl(value) {
  need(typeof value === 'string' && value.length <= 4096 && !/[\x00-\x20\x7f]/.test(value), 'Invalid provider response URL shape.');
  let url; try { url = new URL(value); } catch { fail('Invalid provider response URL shape.'); }
  need(url.protocol === 'https:' && url.hostname && !url.username && !url.password && !url.search && !url.hash, 'Provider response URL contains unsupported private or ambiguous data.');
}
function uploadReceipt(value) {
  need(exact(value, ['id', 'type', 'url']) && mediaIdentifier(value.id) && value.type === 'image', 'Unrecognized native image receipt.'); httpsUrl(value.url);
  return { mediaId: value.id, mediaType: value.type };
}
export function checkedDestination(account, workspace) {
  need(exact(account, ['email', 'credits', 'subscription_plan_type']) && typeof account.email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(account.email.trim()) && Number.isFinite(account.credits) && typeof account.subscription_plan_type === 'string', 'Native account identity is missing or has an unverified shape.');
  need(exact(workspace, ['id', 'name', 'plan_type', 'credits', 'is_selected', 'user_role']) && identifier(workspace.id) && (workspace.name === null || typeof workspace.name === 'string') && typeof workspace.plan_type === 'string' && Number.isFinite(workspace.credits) && typeof workspace.is_selected === 'boolean' && typeof workspace.user_role === 'string', 'Native current workspace identity is missing or has an unverified shape.');
  return { provider: 'higgsfield', route: 'native-cli', accountFingerprint: digest(Buffer.from(account.email.trim().toLowerCase(), 'utf8')), workspaceId: workspace.id };
}
export async function inspectDestination(transport) {
  try { return checkedDestination(await transport.account(), await transport.workspace()); }
  catch (error) { if (error instanceof TransferError) throw error; fail('Native destination inspection failed; no upload was dispatched.'); }
}
async function matchDestination(transport, spec) {
  const actual = await inspectDestination(transport);
  need(canonical(actual) === canonical(spec.destination), 'Native account or selected workspace differs from the authorized destination.');
}
function recheck(root, character, record) {
  const locations = paths(root, character, record.spec.id);
  checkedBytes(sourcePath(root, character, record.spec), record.spec.source);
  need(record.snapshot === `${locations.directory}/snapshot${path.posix.extname(record.spec.source.path).toLowerCase()}`, 'Invalid controlled snapshot location.');
  return strictPath(root, record.snapshot);
}
export async function sendTransfer(root, character, id, grant, transport = createNativeTransport(root)) {
  const { locations } = readRecord(root, character, id); let { record } = readRecord(root, character, id);
  validateScope(grant, record.spec, ['schemaVersion', 'transferId', 'source', 'destination', 'native', 'approved', 'provenance']);
  need(grant.approved === true, 'An explicit applicable exact transfer grant is required.');
  need(record.state === 'planned', 'This intent has already been dispatched or resolved; automatic retry is refused.');
  need(record.spec.source.mediaType === 'image', 'This native send supports verified image receipts only; audio/video remain pending.');
  need(!unresolved(inventory(root, locations.base)), 'Reconcile every earlier uncertain transfer before sending.');
  checkedBytes(recheck(root, character, record), record.spec.source);
  const release = lock(root, locations);
  try {
    record = readRecord(root, character, id).record;
    validateScope(grant, record.spec, ['schemaVersion', 'transferId', 'source', 'destination', 'native', 'approved', 'provenance']);
    need(record.state === 'planned' && grant.approved === true, 'The latest intent has already been dispatched or its exact grant changed; retry is refused.');
    need(!unresolved(inventory(root, locations.base)), 'Reconcile every earlier uncertain transfer before sending.');
    await matchDestination(transport, record.spec);
    const snapshot = recheck(root, character, record); checkedBytes(snapshot, record.spec.source);
    record.authorization = structuredClone(grant.provenance); record.state = 'submitting'; record.dispatchedAt = new Date().toISOString();
    saveRecord(root, locations, record);
    try {
      // No mutable original path is supplied to the native process.
      checkedBytes(recheck(root, character, record), record.spec.source);
      const result = await transport.upload(snapshot);
      if (mediaIdentifier(result?.id)) record.mediaId = result.id;
      Object.assign(record, uploadReceipt(result), { state: 'uploaded', acknowledgedAt: new Date().toISOString() });
      saveRecord(root, locations, record);
    } catch {
      record.state = 'uncertain'; record.reason = 'Upload outcome is uncertain; reconcile the original operation without retrying.';
      try { saveRecord(root, locations, record); } catch { /* Persisted submitting is deliberately unresolved. */ }
    }
    return summary(record);
  } finally { release(); }
}

function listPage(value) {
  need(exact(value, ['cursor', 'items']) && (value.cursor === null || typeof value.cursor === 'string' && /^[a-zA-Z0-9_=-]{1,1024}$/.test(value.cursor)) && Array.isArray(value.items) && value.items.length <= 20, 'Unrecognized paginated native library response.');
  return { cursor: value.cursor, items: value.items.map(item => { need(exact(item, ['id', 'type', 'url', 'created_at']) && mediaIdentifier(item.id) && item.type === 'image' && typeof item.created_at === 'string' && Number.isFinite(Date.parse(item.created_at)), 'Unrecognized native library item.'); httpsUrl(item.url); return { id: item.id, type: item.type }; }) };
}
export async function reconcileTransfer(root, character, id, observation = null, transport = createNativeTransport(root)) {
  const { locations } = readRecord(root, character, id); let { record } = readRecord(root, character, id);
  function checkObservation() {
    need(['submitting', 'uncertain', 'uploaded'].includes(record.state), 'Reconciliation requires an earlier dispatched intent.');
    if (!observation) return;
    validateScope(observation, record.spec, ['schemaVersion', 'transferId', 'source', 'destination', 'native', 'outcome', 'mediaId', 'provenance']);
    need(['accepted', 'not-submitted'].includes(observation.outcome) && (observation.outcome === 'accepted' ? mediaIdentifier(observation.mediaId) : observation.mediaId === null), 'Invalid explicit provider observation.');
    need(!record.mediaId || observation.mediaId === record.mediaId, 'Observation conflicts with the known media ID.');
    need(record.state !== 'uploaded' || observation.outcome === 'accepted', 'An acknowledged upload cannot be changed to not-submitted.');
  }
  checkObservation();
  // Only reconciliation can reclaim a proven dead local owner. No elapsed-time
  // assumption permits a new send, and the submitting intent remains unresolved.
  const lockFile = strictPath(root, locations.lock, 'file', true);
  strictPath(root, `${locations.base}/.reconcile.lock`, 'file', true);
  const recoveryRelease = lock(root, { ...locations, lock: `${locations.base}/.reconcile.lock` });
  let release;
  try {
    if (stat(lockFile)) {
      const owner = readJson(lockFile);
      need(exact(owner, ['pid', 'nonce']) && Number.isInteger(owner.pid) && owner.pid > 0 && typeof owner.nonce === 'string', 'Invalid existing transfer lock.');
      let dead = false;
      try { process.kill(owner.pid, 0); } catch (error) { if (error.code === 'ESRCH') dead = true; }
      need(dead, 'The original transfer lock owner is still active or cannot be checked.');
      const currentOwner = readJson(strictPath(root, locations.lock));
      need(currentOwner.pid === owner.pid && currentOwner.nonce === owner.nonce, 'Original lock ownership changed during inspection; reconciliation refuses.');
      fs.unlinkSync(lockFile);
    }
    release = lock(root, locations);
    record = readRecord(root, character, id).record; checkObservation();
    await matchDestination(transport, record.spec);
    const knownId = observation?.outcome === 'accepted' ? observation.mediaId : record.mediaId;
    let found = false;
    if (knownId) {
      let cursor = null; const seen = new Set();
      for (let page = 0; page < 100; page++) {
        const response = listPage(await transport.list(cursor));
        if (response.items.some(item => item.id === knownId)) { found = true; break; }
        if (response.cursor === null) break;
        need(!seen.has(response.cursor), 'Native pagination did not advance; uncertainty remains.');
        seen.add(response.cursor); cursor = response.cursor;
      }
    }
    if (observation) {
      if (observation.outcome === 'accepted') { need(found, 'The observed ID was not found; absence does not prove non-submission.'); record.mediaId = observation.mediaId; record.mediaType = 'image'; record.state = 'uploaded'; }
      else { need(!record.mediaId, 'A known accepted ID cannot be declared not-submitted.'); record.state = 'not-submitted'; }
      record.reconciliation = structuredClone(observation.provenance); record.resolvedAt = new Date().toISOString(); delete record.reason;
    } else if (knownId && found) { record.libraryExists = true; }
    else { record.reason = 'No source-bound resolution exists; library absence or unknown-ID timestamps never authorize retry.'; }
    if (found) record.libraryExists = true;
    saveRecord(root, locations, record);
    return summary(record);
  } finally { if (release) release(); recoveryRelease(); }
}

export function resolveNativeBinary(root) {
  const relative = 'tools/higgsfield/node_modules/@higgsfield/cli';
  const packageFile = strictPath(root, `${relative}/package.json`, 'file', true);
  need(stat(packageFile), 'Local native CLI is missing; follow docs/higgsfield-setup.md. Transfer never installs or authenticates it.');
  const pkg = readJson(packageFile);
  need(pkg.name === '@higgsfield/cli' && pkg.version === NATIVE_BASELINE.version, 'Local native CLI is missing or differs from the pinned version; follow docs/higgsfield-setup.md.');
  need(process.platform === 'win32' && process.arch === 'x64', 'Native transfer is verified only on Windows x64.');
  const exe = strictPath(root, `${relative}/vendor/hf.exe`);
  need(digest(fs.readFileSync(exe)) === NATIVE_BASELINE.binarySha256, 'Native executable integrity differs; execution refused.');
  return exe;
}
// Internal process seam for deterministic fixtures; no CLI or environment bypass.
export function nativeJson(root, args, processFactory = spawn) {
  const exe = resolveNativeBinary(root);
  return boundedNativeJson(exe, root, args, processFactory);
}
export function boundedNativeJson(exe, root, args, processFactory = spawn, timeoutMilliseconds = 30000) {
  return new Promise((resolve, reject) => {
    const stdout = []; let length = 0, done = false, child;
    try { child = processFactory(exe, args, { cwd: root, shell: false, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'], env: { ...process.env, HIGGSFIELD_INSTALL_METHOD: 'npm', HIGGSFIELD_PACKAGE_MANAGER: 'npm' } }); }
    catch { reject(new TransferError('Native process could not run.')); return; }
    const finish = (error, value) => { if (done) return; done = true; clearTimeout(timer); process.removeListener('SIGINT', interrupt); process.removeListener('SIGTERM', interrupt); if (error) reject(new TransferError(error)); else resolve(value); };
    const interrupt = () => { child.kill(); finish('Native operation interrupted; no raw provider output is retained.'); };
    const timer = setTimeout(() => { child.kill(); finish('Native operation timed out; no raw provider output is retained.'); }, timeoutMilliseconds);
    process.once('SIGINT', interrupt); process.once('SIGTERM', interrupt);
    const consume = (bytes, keep) => { if (done) return; length += bytes.length; if (length > MAX_OUTPUT) { child.kill(); finish('Native output exceeds the bounded size.'); } else if (keep) stdout.push(Buffer.from(bytes)); };
    child.stdout.on('data', bytes => consume(bytes, true)); child.stderr.on('data', bytes => consume(bytes, false));
    child.once('error', () => finish('Native process could not run.'));
    child.once('close', (code, signal) => {
      if (code !== 0 || signal) return finish('Native operation did not return a successful result.');
      try { finish(null, JSON.parse(Buffer.concat(stdout).toString('utf8'))); } catch { finish('Native output is not unambiguous JSON.'); }
    });
  });
}
export function createNativeTransport(root, execute = args => nativeJson(root, args)) {
  return { account: () => execute(['account', 'status', '--json']), workspace: () => execute(['workspace', 'status', '--json']), upload: snapshot => execute(['upload', 'create', snapshot, '--json']), list: cursor => execute(['upload', 'list', '--image', '--size', '20', ...(cursor ? ['--cursor', cursor] : []), '--json']) };
}
