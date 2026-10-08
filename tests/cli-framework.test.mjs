import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import test from 'node:test';
import assert from 'node:assert/strict';

const source = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const parent = path.join(source, 'tmp', 'cli-framework-tests');

test('CLI operates narrative, content, resumable tasks, and backup through documented commands', () => {
  fs.mkdirSync(parent, { recursive: true });
  const root = fs.mkdtempSync(path.join(parent, 'cli-'));
  const save = (name, data) => { const file = path.join(root, name); fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, JSON.stringify(data, null, 2)); return file; };
  const cli = (...args) => {
    const result = spawnSync(process.execPath, [path.join(root, 'scripts/studio.mjs'), ...args], { cwd: root, encoding: 'utf8' });
    assert.equal(result.status, 0, `${args[0]}: ${result.stderr}\n${result.stdout}`);
    return result.stdout;
  };
  try {
    for (const name of ['scripts', 'templates', 'framework']) fs.cpSync(path.join(source, name), path.join(root, name), { recursive: true });
    for (const name of ['AGENTS.md', 'CONSTITUTION.md', 'docs/studio-team.md']) { fs.mkdirSync(path.dirname(path.join(root, name)), { recursive: true }); fs.copyFileSync(path.join(source, name), path.join(root, name)); }
    cli('new', 'test-persona');
    const narrative = JSON.parse(fs.readFileSync(path.join(root, 'templates/narrative.json'), 'utf8')); narrative.characterId = 'test-persona';
    const saved = JSON.parse(cli('narrative-save', 'test-persona', save('tmp/narrative.json', narrative)));
    assert.equal(saved.version, 1); assert.equal(saved.data.status, 'draft');
    assert.equal(JSON.parse(cli('narrative-show', 'test-persona')).hash, saved.hash);
    const content = JSON.parse(fs.readFileSync(path.join(root, 'templates/content.json'), 'utf8')); Object.assign(content, { id: 'piloto', characterId: 'test-persona' });
    assert.equal(JSON.parse(cli('content-save', 'test-persona', save('tmp/content.json', content))).data.id, 'piloto');
    cli('validate', 'test-persona');
    const run = JSON.parse(cli('run-start', 'create-character', save('tmp/spec.json', { personaId: 'test-persona', objective: 'Verify local interface without actual research or media', inputs: ['influencers/test-persona/brief.md'] })));
    assert.equal(JSON.parse(cli('run-status', run.runId)).responsible.name, 'Gaia');
    assert.equal(JSON.parse(cli('run-step', run.runId, save('tmp/start.json', { action: 'start' }))).state, 'in-progress');
    fs.writeFileSync(path.join(root, 'influencers/test-persona/brief.md'), 'Deliberate change in test input');
    assert.equal(JSON.parse(cli('run-resume', run.runId)).state, 'awaiting-input');
    const fresh = JSON.parse(cli('run-resume', run.runId, save('tmp/resume.json', { newAttempt: true, reason: 'Input changed in the integration test' })));
    assert.equal(fresh.run.attempts.length, 2);
    const backup = JSON.parse(cli('backup', 'test-persona'));
    assert.equal(backup.linkedRuns, 1);
    assert.equal(JSON.parse(cli('backup-verify', backup.backupId)).verified, true);
    assert.equal(JSON.parse(cli('backup-test', backup.backupId)).tested, true);
    const denied = spawnSync(process.execPath, [path.join(root, 'scripts/studio.mjs'), 'restore', backup.backupId], { cwd: root, encoding: 'utf8' });
    assert.equal(denied.status, 1); assert.match(denied.stderr, /does not overwrite/);
  } finally {
    assert.equal(path.dirname(root), parent); assert.match(path.basename(root), /^cli-/);
    fs.rmSync(root, { recursive: true, force: true });
  }
});
