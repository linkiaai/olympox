import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { planProviderChoice, saveProviderChoice, readProviderChoice } from '../scripts/provider-choice.mjs';

const parent = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../tmp/provider-choice-tests');
function fixture(t) {
  fs.mkdirSync(parent, { recursive: true });
  const root = fs.mkdtempSync(path.join(parent, 'choice-'));
  t.after(() => { assert.equal(path.dirname(root), parent); fs.rmSync(root, { recursive: true, force: true }); });
  return root;
}

test('provider choice is explicit, private, and preserves identical saved bytes', t => {
  const root = fixture(t), destination = path.join(root, 'future-studio');
  assert.equal(readProviderChoice(destination), null);
  assert.throws(() => planProviderChoice(destination), /explicitly/);
  const plan = planProviderChoice(destination, 'openrouter');
  assert.equal(fs.existsSync(destination), false);
  saveProviderChoice(destination, plan);
  assert.deepEqual(readProviderChoice(destination).mediaProviders, { image: null, video: 'openrouter', audio: null });
  const file = path.join(destination, plan.relative), bytes = fs.readFileSync(file);
  saveProviderChoice(destination, planProviderChoice(destination, 'openrouter'));
  assert.deepEqual(fs.readFileSync(file), bytes);
  assert.throws(() => planProviderChoice(destination, 'higgsfield'), error => error.installationScope === 'destination');
  assert.deepEqual(fs.readFileSync(file), bytes);
});

test('provider choice refuses drift, malformed maps and linked destination paths', t => {
  const root = fixture(t), plan = planProviderChoice(root, 'higgsfield');
  fs.mkdirSync(path.join(root, 'work'));
  fs.writeFileSync(path.join(root, plan.relative), JSON.stringify({ ...plan.value, mediaProviders: { image: 'openrouter', video: 'openrouter', audio: 'openrouter' } }));
  assert.throws(() => saveProviderChoice(root, plan), /inconsistent/);
  fs.writeFileSync(path.join(root, plan.relative), JSON.stringify(plan.value) + ' ');
  const retained = planProviderChoice(root, 'higgsfield');
  fs.appendFileSync(path.join(root, plan.relative), '\n');
  assert.throws(() => saveProviderChoice(root, retained), /changed after preflight/);
  fs.writeFileSync(path.join(root, plan.relative), '{');
  assert.throws(() => readProviderChoice(root), /malformed/);
  fs.unlinkSync(path.join(root, plan.relative));
  fs.rmdirSync(path.join(root, 'work'));
  const outside = path.join(root, 'outside'); fs.mkdirSync(outside);
  fs.symlinkSync(outside, path.join(root, 'work'), process.platform === 'win32' ? 'junction' : 'dir');
  assert.throws(() => planProviderChoice(root, 'higgsfield'), /links or junctions/);
  assert.deepEqual(fs.readdirSync(outside), []);
});
