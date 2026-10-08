import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { assertSlug, readJson, validatePersona } from './studio-core.mjs';

export function safePath(root, relative) {
  if (typeof relative !== 'string' || !relative || relative.includes('\\') || relative.includes(':') || path.isAbsolute(relative) ||
      relative.split('/').some(part => !part || part === '.' || part === '..' || /[. ]$/.test(part) || /^(con|prn|aux|nul|com[0-9]|lpt[0-9])(?:\.|$)/i.test(part))) {
    throw new Error('Invalid local path: use / without absolute paths, aliases, or ..');
  }
  const anchor = fs.realpathSync(root);
  let current = anchor;
  for (const part of relative.split('/')) {
    current = path.join(current, part);
    let stat;
    try { stat = fs.lstatSync(current); } catch (error) { if (error.code !== 'ENOENT') throw error; }
    if (stat) {
      if (stat.isSymbolicLink()) throw new Error('Links/junctions are not permitted in this operation.');
      const resolved = fs.realpathSync(current);
      if (!resolved.startsWith(anchor + path.sep)) throw new Error('Path is outside the project.');
    }
  }
  return current;
}

export function ensureDirectory(root, relative) {
  const target = safePath(root, relative);
  fs.mkdirSync(target, { recursive: true });
  safePath(root, relative);
  return target;
}

export function stableHash(value) {
  const stable = item => Array.isArray(item) ? item.map(stable) : item && typeof item === 'object'
    ? Object.fromEntries(Object.keys(item).sort().map(key => [key, stable(item[key])])) : item;
  return crypto.createHash('sha256').update(JSON.stringify(stable(value))).digest('hex');
}

export function removeStage(parent, stage, prefix) {
  const actualParent = fs.realpathSync(parent);
  const actualStage = path.resolve(stage);
  if (path.dirname(actualStage) !== actualParent || !path.basename(actualStage).startsWith(prefix) || fs.lstatSync(actualStage).isSymbolicLink()) {
    throw new Error('Cleanup refused: temporary directory is outside the expected location.');
  }
  fs.rmSync(actualStage, { recursive: true, force: true });
}

export function createPersona(root, slug) {
  assertSlug(slug);
  const people = ensureDirectory(root, 'influencers');
  const target = safePath(root, `influencers/${slug}`);
  if (fs.existsSync(target)) throw new Error('Character already exists; nothing was overwritten.');
  const persona = readJson(safePath(root, 'templates/persona.json'));
  const brief = fs.readFileSync(safePath(root, 'templates/brief.md'), 'utf8');
  persona.id = slug;
  const errors = validatePersona(persona).errors;
  if (errors.length) throw new Error(`Invalid template: ${errors.join('\n')}`);
  const lockPath = path.join(people, `.new-${slug}.lock`);
  let lock;
  try { lock = fs.openSync(lockPath, 'wx'); }
  catch (error) { if (error.code === 'EEXIST') throw new Error('Creation is in progress; check the run before removing the lock.'); throw error; }
  let stage;
  try {
    stage = fs.mkdtempSync(path.join(people, `.new-${slug}-`));
    for (const sub of ['references/candidates', 'references/canon', 'media/candidates', 'media/approved', 'prompts', 'exports', 'canon', 'narrative', 'content']) {
      fs.mkdirSync(path.join(stage, sub), { recursive: true });
    }
    fs.writeFileSync(path.join(stage, 'persona.json'), JSON.stringify(persona, null, 2) + '\n', { flag: 'wx' });
    fs.writeFileSync(path.join(stage, 'assets.json'), JSON.stringify({ schemaVersion: 2, assets: [] }, null, 2) + '\n', { flag: 'wx' });
    fs.writeFileSync(path.join(stage, 'brief.md'), brief, { flag: 'wx' });
    fs.writeFileSync(path.join(stage, 'decisions.md'), `# Decisions — ${slug}\n\nRecord choices and changes here, with their date and reason. No identity has been approved yet.\n`, { flag: 'wx' });
    if (fs.existsSync(target)) throw new Error('Character already exists; nothing was overwritten.');
    safePath(root, `influencers/${slug}`);
    fs.renameSync(stage, target);
    stage = null;
    return { dir: target, persona };
  } finally {
    fs.closeSync(lock);
    fs.unlinkSync(lockPath);
    if (stage && fs.existsSync(stage)) removeStage(people, stage, `.new-${slug}-`);
  }
}
