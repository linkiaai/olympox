import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';

const relative = 'work/provider-choice.json';
const digest = bytes => createHash('sha256').update(bytes).digest('hex');
function fail(message) {
  const error = new Error(message);
  error.installationScope = 'destination';
  throw error;
}
function choice(provider) {
  if (!['higgsfield', 'openrouter'].includes(provider)) fail('Choose higgsfield or openrouter explicitly.');
  return { schemaVersion: 1, provider, mediaProviders: provider === 'higgsfield' ? { image: provider, video: provider, audio: provider } : { image: null, video: provider, audio: null } };
}
function inspect(root) {
  const absolute = path.resolve(root), parsed = path.parse(absolute);
  let current = parsed.root;
  const segments = [...absolute.slice(parsed.root.length).split(path.sep).filter(Boolean), 'work', 'provider-choice.json'];
  for (let index = 0; index < segments.length; index++) {
    current = path.join(current, segments[index]);
    let info;
    try { info = fs.lstatSync(current); } catch (error) { if (error.code === 'ENOENT') continue; fail('The provider-choice destination could not be inspected.'); }
    if (info.isSymbolicLink() || (index === segments.length - 1 ? !info.isFile() : !info.isDirectory())) fail('Provider-choice paths must be regular files and directories without links or junctions.');
    if (index === segments.length - 1 && info.size > 4096) fail('The saved provider choice is too large.');
  }
  return current;
}
function read(root) {
  const file = inspect(root);
  let bytes;
  try { bytes = fs.readFileSync(file); } catch (error) { if (error.code === 'ENOENT') return null; fail('The saved provider choice could not be read.'); }
  let value;
  try { value = JSON.parse(bytes.toString('utf8')); } catch { fail('The saved provider choice is malformed.'); }
  if (!value || JSON.stringify(Object.keys(value).sort()) !== JSON.stringify(['mediaProviders', 'provider', 'schemaVersion']) || value.schemaVersion !== 1) fail('The saved provider choice has an unsupported schema.');
  const expected = choice(value.provider), map = value.mediaProviders;
  if (!map || typeof map !== 'object' || Array.isArray(map) || Object.keys(map).sort().join(',') !== 'audio,image,video' || Object.keys(expected.mediaProviders).some(key => map[key] !== expected.mediaProviders[key])) fail('The saved provider choice has an inconsistent media map.');
  return { value: expected, sha256: digest(bytes) };
}

export function readProviderChoice(root) { return read(root)?.value ?? null; }

export function planProviderChoice(root, provider) {
  const value = choice(provider), existing = read(root);
  if (existing && existing.value.provider !== provider) fail('A different provider choice already exists; preserve it and choose another destination.');
  return { relative, value, retained: !!existing, sha256: existing?.sha256 ?? null };
}

export function saveProviderChoice(root, plan) {
  if (plan?.relative !== relative || !plan.value) fail('Invalid provider-choice installation plan.');
  const current = planProviderChoice(root, plan.value.provider);
  if (JSON.stringify(current) !== JSON.stringify(plan)) fail('The provider choice changed after preflight; no provider choice was written.');
  if (current.retained) return current;
  const file = inspect(root);
  try {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    inspect(root);
    fs.writeFileSync(file, `${JSON.stringify(current.value, null, 2)}\n`, { flag: 'wx', mode: 0o600 });
  } catch { fail('The provider choice could not be saved exclusively; inspect the destination before retrying.'); }
  return { ...current, retained: false };
}
