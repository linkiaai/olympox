import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { assertSlug, hash, readJson, validatePersona, validateAssets } from './studio-core.mjs';
import { safePath, ensureDirectory, stableHash, removeStage } from './storage-core.mjs';
import { validateEditorial } from './editorial-core.mjs';
import { validateRunRecord } from './framework-core.mjs';

function inventory(base) {
  const files = [];
  function visit(relative = '') {
    const dir = relative ? safePath(base, relative) : fs.realpathSync(base);
    for (const name of fs.readdirSync(dir).sort()) {
      const rel = relative ? `${relative}/${name}` : name;
      const file = safePath(base, rel);
      const stat = fs.lstatSync(file);
      if (name.endsWith('.lock') || /^\.(?:new|canon|editorial|backup|restore|staging)-/.test(name) || /\.tmp-/.test(name)) throw new Error(`Pending operation file: ${rel}. Check processes before backing up.`);
      if (stat.isDirectory()) { files.push({ path: rel, kind: 'directory' }); visit(rel); }
      else if (stat.isFile()) {
        const bytes = fs.readFileSync(file);
        files.push({ path: rel, kind: 'file', size: bytes.length, sha256: hash(bytes) });
      } else throw new Error(`Unsupported special file: ${rel}.`);
    }
  }
  visit();
  return files;
}

function copyFiles(source, target, files) {
  for (const item of files) {
    if (item.kind === 'directory') { ensureDirectory(target, item.path); continue; }
    const parent = path.posix.dirname(item.path);
    if (parent !== '.') ensureDirectory(target, parent);
    const from = safePath(source, item.path), to = safePath(target, item.path);
    fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL);
    const bytes = fs.readFileSync(to);
    if (bytes.length !== item.size || hash(bytes) !== item.sha256) throw new Error(`File changed during copy: ${item.path}.`);
  }
}

function linkedRuns(root, slug) {
  const runDir = safePath(root, 'work/runs');
  if (!fs.existsSync(runDir)) return [];
  const result = [];
  for (const name of fs.readdirSync(runDir).filter(name => name.endsWith('.json')).sort()) {
    const file = safePath(runDir, name), bytes = fs.readFileSync(file), run = JSON.parse(bytes.toString('utf8'));
    if (run.personaId !== slug) continue;
    if (!/^run-[a-f0-9-]{36}$/.test(run.id) || `${run.id}.json` !== name || run.schemaVersion !== 1) throw new Error(`Invalid task record: ${name}.`);
    validateRunRecord(run);
    if (fs.existsSync(safePath(runDir, `${run.id}.lock`))) throw new Error(`Task is being written: ${run.id}.`);
    result.push({ path: name, kind: 'file', size: bytes.length, sha256: hash(bytes) });
  }
  return result;
}

function personaErrors(base) {
  for (const file of ['persona.json', 'assets.json', 'brief.md', 'decisions.md']) {
    const found = safePath(base, file);
    if (!fs.statSync(found).isFile()) throw new Error(`Incomplete character: ${file}.`);
  }
  const persona = readJson(safePath(base, 'persona.json'));
  return { persona, errors: [...validatePersona(persona, base).errors, ...validateAssets(readJson(safePath(base, 'assets.json')), persona, base), ...validateEditorial(base, persona).errors] };
}

export function backupPersona(root, slug) {
  assertSlug(slug);
  const source = safePath(root, `influencers/${slug}`);
  if (!fs.statSync(source).isDirectory()) throw new Error('Character does not exist.');
  const { persona, errors } = personaErrors(source);
  if (persona.id !== slug) throw new Error('Identity differs from the directory.');
  if (errors.length) throw new Error(`Validated backup requires intact records: ${errors.join('\n')}`);
  const before = inventory(source);
  const runs = linkedRuns(root, slug);
  const parent = ensureDirectory(root, `backups/${slug}`);
  const name = `${new Date().toISOString().replace(/[:.]/g, '-')}-${crypto.randomUUID()}`;
  const backupId = `${slug}/${name}`;
  const target = safePath(root, `backups/${backupId}`);
  let stage = fs.mkdtempSync(path.join(parent, '.backup-'));
  try {
    const filesDir = ensureDirectory(stage, 'files');
    copyFiles(source, filesDir, before);
    if (runs.length) copyFiles(safePath(root, 'work/runs'), ensureDirectory(stage, 'linked-runs'), runs);
    if (stableHash(before) !== stableHash(inventory(source))) throw new Error('Character changed during backup; retry after completing writes.');
    if (stableHash(runs) !== stableHash(linkedRuns(root, slug))) throw new Error('Tasks changed during backup; retry.');
    const payload = { schemaVersion: 1, kind: 'persona-backup', characterId: slug, createdAt: new Date().toISOString(), files: before, linkedRuns: runs };
    const manifest = { ...payload, hash: stableHash(payload) };
    fs.writeFileSync(path.join(stage, 'backup.json'), JSON.stringify(manifest, null, 2) + '\n', { flag: 'wx' });
    const copied = personaErrors(filesDir);
    if (copied.errors.length) throw new Error(copied.errors.join('\n'));
    if (fs.existsSync(target)) throw new Error('Backup already exists.');
    fs.renameSync(stage, target); stage = null;
    return { backupId, path: target, characterId: slug, files: before.filter(item => item.kind === 'file').length, linkedRuns: runs.length, hash: manifest.hash };
  } finally { if (stage && fs.existsSync(stage)) removeStage(parent, stage, '.backup-'); }
}

export function verifyBackup(root, backupId) {
  if (typeof backupId !== 'string' || backupId.split('/').length !== 2) throw new Error('Provide the backup ID: character/name.');
  const [slug] = backupId.split('/'); assertSlug(slug);
  const folder = safePath(root, `backups/${backupId}`);
  const manifest = readJson(safePath(folder, 'backup.json'));
  const { hash: expected, ...payload } = manifest;
  if (manifest.schemaVersion !== 1 || manifest.kind !== 'persona-backup' || manifest.characterId !== slug || !Array.isArray(manifest.files) || !Array.isArray(manifest.linkedRuns) || !manifest.files.length || expected !== stableHash(payload)) {
    throw new Error('Invalid/altered backup manifest.');
  }
  const filesDir = safePath(folder, 'files');
  const actual = inventory(filesDir);
  if (stableHash(actual) !== stableHash(manifest.files)) throw new Error('Backup is incomplete, changed, or contains an uninventoried file.');
  const { persona, errors } = personaErrors(filesDir);
  if (persona.id !== slug || errors.length) throw new Error(`Backup does not validate as a character: ${errors.join('\n')}`);
  const runsDir = safePath(folder, 'linked-runs');
  const actualRuns = fs.existsSync(runsDir) ? inventory(runsDir) : [];
  if (stableHash(actualRuns) !== stableHash(manifest.linkedRuns)) throw new Error('Task records in the backup changed.');
  for (const item of actualRuns) {
    const run = readJson(safePath(runsDir, item.path));
    if (run.personaId !== slug || run.schemaVersion !== 1 || `${run.id}.json` !== item.path || !/^run-[a-f0-9-]{36}$/.test(run.id)) throw new Error('Task belongs to another character or is invalid in the backup.');
    validateRunRecord(run);
  }
  return { backupId, path: folder, filesDir, manifest, characterId: slug, files: actual.filter(item => item.kind === 'file').length };
}

export function restoreBackup(root, backupId, destinationRoot = root) {
  const verified = verifyBackup(root, backupId);
  const people = ensureDirectory(destinationRoot, 'influencers');
  const target = safePath(destinationRoot, `influencers/${verified.characterId}`);
  if (fs.existsSync(target)) throw new Error('Destination already exists; restoration does not overwrite characters.');
  const runsDir = verified.manifest.linkedRuns.length ? ensureDirectory(destinationRoot, 'work/runs') : null;
  for (const item of verified.manifest.linkedRuns) {
    const to = safePath(runsDir, item.path);
    if (fs.existsSync(to) && hash(fs.readFileSync(to)) !== item.sha256) throw new Error(`Task already exists with another version: ${item.path}. Nothing was overwritten.`);
    if (fs.existsSync(safePath(runsDir, item.path.replace(/\.json$/, '.lock')))) throw new Error('Task is in use at the destination.');
  }
  const lockPath = path.join(people, `.new-${verified.characterId}.lock`);
  let lock;
  try { lock = fs.openSync(lockPath, 'wx'); }
  catch (error) { if (error.code === 'EEXIST') throw new Error('Creation/restoration is in progress for this character.'); throw error; }
  let stage;
  const createdRuns = [];
  const runLocks = [], runStages = [];
  try {
    if (fs.existsSync(target)) throw new Error('Destination already exists; nothing was overwritten.');
    stage = fs.mkdtempSync(path.join(people, '.restore-'));
    copyFiles(verified.filesDir, stage, verified.manifest.files);
    const { errors } = personaErrors(stage);
    if (errors.length) throw new Error(errors.join('\n'));
    safePath(destinationRoot, `influencers/${verified.characterId}`);
    if (fs.existsSync(target)) throw new Error('Destination already exists; nothing was overwritten.');
    for (const item of verified.manifest.linkedRuns) {
      const to = safePath(runsDir, item.path);
      const runLockPath = safePath(runsDir, item.path.replace(/\.json$/, '.lock'));
      let runLock;
      try { runLock = fs.openSync(runLockPath, 'wx'); }
      catch (error) { if (error.code === 'EEXIST') throw new Error(`Task is in use at the destination: ${item.path}.`); throw error; }
      runLocks.push({ path: runLockPath, fd: runLock });
      if (fs.existsSync(to)) {
        if (hash(fs.readFileSync(to)) !== item.sha256) throw new Error(`Task changed at the destination: ${item.path}.`);
        continue;
      }
      const runStage = safePath(runsDir, `.restore-${crypto.randomUUID()}.tmp`);
      runStages.push(runStage);
      fs.copyFileSync(safePath(verified.path, `linked-runs/${item.path}`), runStage, fs.constants.COPYFILE_EXCL);
      const copied = fs.readFileSync(runStage), copiedHash = hash(copied);
      if (copied.length !== item.size || copiedHash !== item.sha256) throw new Error(`Task changed during restoration: ${item.path}.`);
      if (fs.existsSync(to)) throw new Error(`Task appeared at the destination: ${item.path}. Nothing was overwritten.`);
      fs.renameSync(runStage, to);
      createdRuns.push({ path: to, sha256: copiedHash });
    }
    for (const item of verified.manifest.linkedRuns) if (hash(fs.readFileSync(safePath(runsDir, item.path))) !== item.sha256) throw new Error('Task changed before committing the restoration.');
    fs.renameSync(stage, target); stage = null;
    return { backupId, characterId: verified.characterId, path: target, files: verified.files, linkedRuns: verified.manifest.linkedRuns.length, verified: true };
  } finally {
    if (stage && fs.existsSync(stage)) {
      for (const item of createdRuns) {
        if (path.dirname(item.path) === runsDir && fs.existsSync(item.path) && hash(fs.readFileSync(item.path)) === item.sha256) fs.unlinkSync(item.path);
      }
      removeStage(people, stage, '.restore-');
    }
    for (const file of runStages) if (fs.existsSync(file)) fs.unlinkSync(file);
    for (const item of runLocks) { fs.closeSync(item.fd); fs.unlinkSync(item.path); }
    fs.closeSync(lock);
    fs.unlinkSync(lockPath);
  }
}

export function testRestore(root, backupId) {
  const parent = ensureDirectory(root, 'tmp/restore-checks');
  const stage = fs.mkdtempSync(path.join(parent, 'restore-test-'));
  try {
    const result = restoreBackup(root, backupId, stage);
    return { ...result, path: null, tested: true, note: 'Temporary copy restored and validated; current characters were preserved.' };
  } finally { removeStage(parent, stage, 'restore-test-'); }
}
