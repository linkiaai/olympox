import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createPersona, safePath } from '../scripts/storage-core.mjs';
import { backupPersona, verifyBackup, restoreBackup, testRestore } from '../scripts/backup-core.mjs';
import { readJson, hash } from '../scripts/studio-core.mjs';
import { startRun } from '../scripts/framework-core.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const parent = path.join(root, 'tmp', 'backup-tests');
const scratch = [];
function fixture() {
  fs.mkdirSync(parent, { recursive: true });
  const dir = fs.mkdtempSync(path.join(parent, 'backup-fixture-')); scratch.push(dir);
  fs.mkdirSync(path.join(dir, 'templates'));
  for (const name of ['persona.json', 'brief.md']) fs.copyFileSync(path.join(root, 'templates', name), path.join(dir, 'templates', name));
  fs.cpSync(path.join(root, 'framework'), path.join(dir, 'framework'), { recursive: true });
  for (const name of ['CONSTITUTION.md', 'AGENTS.md', 'docs/studio-team.md']) {
    fs.mkdirSync(path.dirname(path.join(dir, name)), { recursive: true });
    fs.copyFileSync(path.join(root, name), path.join(dir, name));
  }
  return dir;
}
test.after(() => { for (const dir of scratch) { assert.equal(path.dirname(dir), parent); assert.match(path.basename(dir), /^backup-fixture-/); fs.rmSync(dir, { recursive: true, force: true }); } });

test('creation commits a complete persona, preserves the destination, and refuses a lock', () => {
  const dir = fixture();
  const result = createPersona(dir, 'test-persona');
  assert.equal(readJson(path.join(result.dir, 'assets.json')).schemaVersion, 2);
  assert.equal(fs.existsSync(path.join(result.dir, 'narrative')), true);
  assert.throws(() => createPersona(dir, 'test-persona'), /already exists/);
  fs.writeFileSync(path.join(dir, 'influencers/.new-other.lock'), 'asset');
  assert.throws(() => createPersona(dir, 'other'), /in progress/);
  assert.equal(fs.existsSync(path.join(dir, 'influencers/other')), false);
});

test('backup and restoration preserve bytes, refuse overwrites, and verify the inventory', () => {
  const dir = fixture(); const { dir: base } = createPersona(dir, 'test-persona');
  fs.writeFileSync(path.join(base, 'media/candidates/original.png'), 'fictional bytes; not approved media');
  const backup = backupPersona(dir, 'test-persona');
  const verified = verifyBackup(dir, backup.backupId);
  assert.ok(verified.files >= 5);
  assert.throws(() => restoreBackup(dir, backup.backupId), /already exists/);
  const target = fixture();
  const restored = restoreBackup(dir, backup.backupId, target);
  assert.equal(fs.existsSync(path.join(restored.path, 'references/canon')), true);
  assert.equal(hash(fs.readFileSync(path.join(restored.path, 'media/candidates/original.png'))), hash(fs.readFileSync(path.join(base, 'media/candidates/original.png'))));
  assert.equal(testRestore(dir, backup.backupId).tested, true);
  fs.writeFileSync(path.join(verified.filesDir, 'brief.md'), 'changed');
  assert.throws(() => verifyBackup(dir, backup.backupId), /changed/);
});

test('backup refuses locks, invalid records, and uninventoried extra files', () => {
  const dir = fixture(); const { dir: base } = createPersona(dir, 'test-persona');
  fs.writeFileSync(path.join(base, '.assets.lock'), 'operation');
  assert.throws(() => backupPersona(dir, 'test-persona'), /Pending/);
  fs.unlinkSync(path.join(base, '.assets.lock'));
  const backup = backupPersona(dir, 'test-persona');
  const verified = verifyBackup(dir, backup.backupId);
  fs.writeFileSync(path.join(verified.filesDir, 'extra.txt'), 'uninventoried');
  assert.throws(() => verifyBackup(dir, backup.backupId), /uninventoried/);
  fs.writeFileSync(path.join(base, 'assets.json'), '{}');
  assert.throws(() => backupPersona(dir, 'test-persona'), /intact records/);
});

test('backup and creation paths refuse traversal and Windows aliases', () => {
  const dir = fixture();
  for (const relative of ['../outside', 'C:/outside', 'folder\\file', 'folder/file:stream', 'folder/nul.txt', 'folder/name.']) assert.throws(() => safePath(dir, relative));
  assert.throws(() => verifyBackup(dir, '../outside'), /Invalid slug/);
});

test('backup includes valid persona tasks and refuses partial records', () => {
  const dir = fixture(); createPersona(dir, 'test-persona'); createPersona(dir, 'other');
  const run = startRun(dir, { workflowId: 'create-character', personaId: 'test-persona', objective: 'Structural recovery test', inputs: ['influencers/test-persona/brief.md'] });
  startRun(dir, { workflowId: 'create-character', personaId: 'other', objective: 'Another test persona', inputs: ['influencers/other/brief.md'] });
  const backup = backupPersona(dir, 'test-persona');
  assert.equal(backup.linkedRuns, 1);
  const target = fixture(); restoreBackup(dir, backup.backupId, target);
  assert.deepEqual(readJson(path.join(target, `work/runs/${run.runId}.json`)), readJson(path.join(dir, `work/runs/${run.runId}.json`)));
  assert.deepEqual(fs.readdirSync(path.join(target, 'work/runs')), [`${run.runId}.json`]);
  const record = readJson(path.join(dir, `work/runs/${run.runId}.json`)); record.attempts = [];
  fs.writeFileSync(path.join(dir, `work/runs/${run.runId}.json`), JSON.stringify(record));
  assert.throws(() => backupPersona(dir, 'test-persona'), /Record|Attempts/);
});

test('task restoration verifies copied bytes and removes only its incomplete write', () => {
  const dir = fixture(); createPersona(dir, 'test-persona');
  startRun(dir, { workflowId: 'create-character', personaId: 'test-persona', objective: 'Simulate a change after verification', inputs: ['influencers/test-persona/brief.md'] });
  const backup = backupPersona(dir, 'test-persona'), target = fixture();
  const originalCopy = fs.copyFileSync;
  fs.copyFileSync = (from, to, ...options) => {
    originalCopy(from, to, ...options);
    if (String(from).includes(`${path.sep}linked-runs${path.sep}`)) fs.writeFileSync(to, 'CORRUPTED DURING COPY');
  };
  try { assert.throws(() => restoreBackup(dir, backup.backupId, target), /Task changed during/); }
  finally { fs.copyFileSync = originalCopy; }
  assert.equal(fs.existsSync(path.join(target, 'influencers/test-persona')), false);
  assert.deepEqual(fs.readdirSync(path.join(target, 'work/runs')), []);
  assert.equal(verifyBackup(dir, backup.backupId).characterId, 'test-persona');
});
