import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { strictPath } from './reference-transfer-core.mjs';
import { isFrameworkDevelopment } from './development-context.mjs';

export const STUDIO_SETTINGS_PATH = 'work/studio-settings.json';
export const MEDIA_PROVIDER_CHOICES = Object.freeze(['higgsfield', 'byteplus']);
const uuid = value => typeof value === 'string' && /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/.test(value);
const digest = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const need = (ok, message) => { if (!ok) throw new Error(message); };

function inspectRoot(root) {
  const absolute = path.resolve(root), parsed = path.parse(absolute);
  let current = parsed.root, exists = true;
  for (const segment of absolute.slice(parsed.root.length).split(path.sep).filter(Boolean)) {
    current = path.join(current, segment);
    let stat;
    try { stat = fs.lstatSync(current); } catch (error) { if (error.code !== 'ENOENT') throw new Error('Studio settings path could not be inspected.'); }
    if (stat) need(stat.isDirectory() && !stat.isSymbolicLink(), 'Studio settings refuse links, junctions and non-directory parents.');
    else exists = false;
  }
  return { absolute, exists };
}
function validateSettings(value) {
  need(value && typeof value === 'object' && !Array.isArray(value) && Object.keys(value).sort().join(',') === 'mediaProvider,schemaVersion,studioId'
    && value.schemaVersion === 1 && uuid(value.studioId) && MEDIA_PROVIDER_CHOICES.includes(value.mediaProvider), 'Invalid private studio settings; preserve the file and inspect its nonsecret schema.');
  return value;
}
function inspectSettings(root) {
  const context = inspectRoot(root);
  if (!context.exists) return { settings: null, bytes: null, previousHash: null };
  let target;
  try { target = strictPath(context.absolute, STUDIO_SETTINGS_PATH, 'file', true); }
  catch (error) {
    if (error.message === 'Links and junctions are refused.') throw new Error('Studio settings path escaped the project or contains links/junctions; reads were refused.');
    throw error;
  }
  if (!fs.existsSync(target)) return { settings: null, bytes: null, previousHash: null };
  need(fs.statSync(target).size <= 4096, 'Private studio settings exceed the bounded size.');
  const bytes = fs.readFileSync(target);
  let value;
  try { value = JSON.parse(bytes.toString('utf8').replace(/^\uFEFF/, '')); }
  catch { throw new Error('Invalid private studio settings JSON; existing bytes were preserved.'); }
  return { settings: validateSettings(value), bytes, previousHash: digest(bytes) };
}

/** Missing settings preserve the product defaults. This read never creates state. */
export function readStudioSettings(root) { return inspectSettings(root).settings; }

export function planStudioSettings(root, provider) {
  need(MEDIA_PROVIDER_CHOICES.includes(provider), 'Choose higgsfield or byteplus.');
  const existing = inspectSettings(root);
  return { settings: { schemaVersion: 1, studioId: existing.settings?.studioId ?? crypto.randomUUID(), mediaProvider: provider }, previousHash: existing.previousHash };
}

/** Save only nonsecret preferences after the reviewed installation or explicit selection. */
export function saveStudioSettings(root, provider, { expectedPreviousHash, studioId } = {}) {
  need(!isFrameworkDevelopment(root), 'Studio configuration requires an independent installed studio.');
  strictPath(root, 'influencers', 'directory');
  const existing = inspectSettings(root);
  if (expectedPreviousHash !== undefined) need(existing.previousHash === expectedPreviousHash, 'Studio settings changed after review; existing preferences were preserved.');
  const settings = validateSettings({ schemaVersion: 1, studioId: studioId ?? existing.settings?.studioId ?? crypto.randomUUID(), mediaProvider: provider });
  need(!existing.settings || existing.settings.studioId === settings.studioId, 'Preserve the existing studio identifier.');
  if (existing.settings?.mediaProvider === provider) return existing.settings;
  const target = strictPath(root, STUDIO_SETTINGS_PATH, 'file', true);
  const directory = strictPath(root, 'work', 'directory', true);
  fs.mkdirSync(directory, { recursive: true, mode: 0o700 });
  strictPath(root, 'work', 'directory');
  const lock = strictPath(root, 'work/.studio-settings.lock', 'file', true);
  let lockFd;
  try { lockFd = fs.openSync(lock, 'wx', 0o600); }
  catch { throw new Error('Studio settings are locked by another configuration; no preferences were overwritten.'); }
  const temporary = STUDIO_SETTINGS_PATH + '.tmp-' + crypto.randomUUID();
  let temporaryPath;
  try {
    temporaryPath = strictPath(root, temporary, 'file', true);
    need(inspectSettings(root).previousHash === existing.previousHash, 'Studio settings changed while acquiring the configuration lock; concurrent preferences were preserved.');
    const fd = fs.openSync(temporaryPath, 'wx', 0o600);
    try { fs.writeFileSync(fd, JSON.stringify(settings, null, 2) + '\n'); fs.fsyncSync(fd); } finally { fs.closeSync(fd); }
    need(inspectSettings(root).previousHash === existing.previousHash, 'Studio settings changed before saving; concurrent preferences were preserved.');
    strictPath(root, STUDIO_SETTINGS_PATH, 'file', true);
    fs.renameSync(temporaryPath, target);
  } finally {
    if (temporaryPath && fs.existsSync(temporaryPath)) fs.unlinkSync(temporaryPath);
    fs.closeSync(lockFd);
    fs.unlinkSync(strictPath(root, 'work/.studio-settings.lock'));
  }
  return settings;
}

export function preferredMediaProviders(root, defaults) {
  const settings = readStudioSettings(root);
  return settings ? { image: settings.mediaProvider, video: settings.mediaProvider, audio: settings.mediaProvider } : { ...defaults };
}
