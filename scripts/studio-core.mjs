import { isToken, oneOfTokens } from './language-compat.mjs';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

export function assertSlug(slug) {
  if (typeof slug !== 'string' || !/^[a-z][a-z0-9-]{0,47}$/.test(slug) ||
      /^(con|prn|aux|nul|com[0-9]|lpt[0-9])(?:-|$)/i.test(slug)) {
    throw new Error('Invalid slug. Use up to 48 lowercase letters, numbers, and hyphens; start with a letter.');
  }
  return slug;
}

export function hash(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

export function readJson(file) {
  try { return JSON.parse(fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, '')); }
  catch (error) { throw new Error(`Could not read ${file}: ${error.message}`); }
}

function stable(value) {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.keys(value).sort().map(key => [key, stable(value[key])]));
  }
  return value;
}

export function canonHash(persona) {
  // Editorial changes do not redefine face/body/voice; references and anchors do.
  return hash(JSON.stringify(stable({
    id: persona.id, identityVersion: persona.identityVersion,
    name: persona.profile.name, age: persona.profile.age, virtual: persona.profile.virtual,
    identity: persona.identity, voice: persona.voice,
    references: persona.references.filter(ref => ref && typeof ref === 'object' && isToken(ref.status, 'approved'))
  })));
}

export function localFile(base, relative) {
  if (typeof relative !== 'string' || !relative || path.isAbsolute(relative) ||
      /^[a-z]:/i.test(relative) || relative.includes('\\') ||
      relative.split('/').some(part => !part || part === '.' || part === '..' ||
        /[<>:"|?*\x00-\x1f]/.test(part) || /[. ]$/.test(part) ||
        /^(con|prn|aux|nul|com[0-9¹²³]|lpt[0-9¹²³])(?:\.|$)/i.test(part))) {
    throw new Error('File must use a path relative to the character directory, with / and no ..');
  }
  const root = fs.realpathSync(base);
  const target = fs.realpathSync(path.resolve(root, relative));
  const within = path.relative(root, target);
  if (!within || within === '..' || within.startsWith('..' + path.sep) || path.isAbsolute(within) || !fs.statSync(target).isFile()) {
    throw new Error('File is outside the character directory or is not a regular file.');
  }
  return target;
}

export function fileHash(base, relative) {
  return hash(fs.readFileSync(localFile(base, relative)));
}

function fileKey(base, relative) {
  const file = localFile(base, relative);
  return process.platform === 'win32' ? file.toLowerCase() : file;
}

const nonempty = value => typeof value === 'string' && value.trim().length > 0;
const strings = value => Array.isArray(value) && value.every(nonempty);
const digest = value => typeof value === 'string' && /^[a-f0-9]{64}$/.test(value);
const date = value => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(value) && Number.isFinite(Date.parse(value));
const obj = value => value !== null && typeof value === 'object' && !Array.isArray(value);

const clone = value => JSON.parse(JSON.stringify(value));
const jsonHash = value => hash(JSON.stringify(stable(value)));
const versionKey = value => {
  if (!Number.isSafeInteger(value) || value < 1) throw new Error('Version must be a positive safe integer.');
  return `v${String(value).padStart(6, '0')}`;
};

function envelopeHash(record) {
  const { hash: ignored, ...payload } = record;
  return jsonHash(payload);
}

function ensureDirectory(base, parts) {
  const root = fs.realpathSync(base);
  if (!fs.statSync(root).isDirectory()) throw new Error('Base must be a directory.');
  let current = root;
  for (const part of parts) {
    if (!/^[a-zA-Z0-9._-]+$/.test(part) || part === '.' || part === '..') throw new Error('Invalid internal directory.');
    const next = path.join(current, part);
    if (!fs.existsSync(next)) fs.mkdirSync(next);
    const actual = fs.realpathSync(next), relative = path.relative(root, actual);
    if (!relative || relative === '..' || relative.startsWith('..' + path.sep) || path.isAbsolute(relative) || !fs.statSync(actual).isDirectory()) {
      throw new Error('Internal directory is outside the character directory.');
    }
    current = actual;
  }
  return current;
}

function withLock(base, name, run) {
  const lockPath = path.join(fs.realpathSync(base), name);
  let fd;
  try { fd = fs.openSync(lockPath, 'wx'); }
  catch (e) {
    if (e.code === 'EEXIST') throw new Error(`${name} is in use. Check processes before removing an abandoned lock.`);
    throw e;
  }
  try {
    fs.writeFileSync(fd, JSON.stringify({ pid: process.pid, at: new Date().toISOString() }));
    return run();
  } finally {
    fs.closeSync(fd);
    fs.unlinkSync(lockPath);
  }
}

function writeManifest(base, manifest) {
  const destination = localFile(base, 'assets.json');
  const temp = path.join(fs.realpathSync(base), `assets-${crypto.randomUUID()}.tmp`);
  try {
    fs.writeFileSync(temp, JSON.stringify(manifest, null, 2) + '\n', { flag: 'wx' });
    fs.renameSync(temp, destination);
  } finally { if (fs.existsSync(temp)) fs.unlinkSync(temp); }
}

function removeStaging(base, directory, prefix) {
  const root = fs.realpathSync(base), actual = fs.realpathSync(directory);
  const relative = path.relative(root, actual);
  if (!relative || relative === '..' || relative.startsWith('..' + path.sep) || path.isAbsolute(relative) || !path.basename(actual).startsWith(prefix)) {
    throw new Error('Staging cleanup refused: target is outside the expected base.');
  }
  fs.rmSync(actual, { recursive: true, force: true });
}

function legacyPayload(asset) {
  const { recordVersion, legacy, ...payload } = asset;
  return payload;
}

function manifestV2(manifest, characterId) {
  if (!obj(manifest) || ![1, 2].includes(manifest.schemaVersion) || !Array.isArray(manifest.assets)) throw new Error('Invalid manifest for migration.');
  const result = clone(manifest);
  if (result.schemaVersion === 1) {
    result.schemaVersion = 2;
    result.migratedAt = new Date().toISOString();
    result.assets = result.assets.map(asset => {
      if (!obj(asset)) return asset;
      if (asset.recordVersion === 2) return asset;
      if (isToken(asset.status, 'production')) return { ...asset, recordVersion: 1, legacy: {
        sourceSchemaVersion: 1, adoptedAt: result.migratedAt, recordSha256: jsonHash(legacyPayload(asset))
      } };
      return { ...asset, recordVersion: 2, characterId, executionSha256: asset.executionSha256 ?? null, executionPath: asset.executionPath ?? null };
    });
  }
  return result;
}

function executionPayload(asset) {
  const { status, review, recordVersion, legacy, executionSha256, executionPath, ...payload } = asset;
  return payload;
}

function validateFrozenCanon(persona, base) {
  const root = fs.realpathSync(base);
  let current = root;
  const parts = ['canon', versionKey(persona.identityVersion), 'snapshot.json'];
  for (let index = 0; index < parts.length; index++) {
    const candidate = path.join(current, parts[index]);
    try { fs.lstatSync(candidate); }
    catch (error) { if (error.code === 'ENOENT') return; throw error; }
    const resolved = fs.realpathSync(candidate), relative = path.relative(root, resolved);
    if (!relative || relative === '..' || relative.startsWith('..' + path.sep) || path.isAbsolute(relative)) {
      throw new Error('Frozen canon path is outside the character directory.');
    }
    if (index < parts.length - 1 && !fs.statSync(resolved).isDirectory()) {
      throw new Error('Frozen canon parent must be a directory.');
    }
    current = resolved;
  }
  // Embedded snapshot personas are validated without a base, so reading history
  // does not recursively compare it with the editable current record.
  const frozen = readCanon(base, persona.identityVersion);
  if (frozen.characterId !== persona.id || frozen.canonHash !== canonHash(persona)) {
    throw new Error('Canon version already frozen with another identity. Increment identityVersion.');
  }
}

export function validatePersona(p, base) {
  const errors = [], warnings = [];
  if (!obj(p)) return { errors: ['Persona must be an object.'], warnings };
  try { assertSlug(p.id); } catch (e) { errors.push(e.message); }
  if (p.schemaVersion !== 1) errors.push('schemaVersion must be 1.');
  if (!Number.isSafeInteger(p.identityVersion) || p.identityVersion < 1) errors.push('identityVersion must be a positive safe integer.');
  if (!oneOfTokens(p.status, ['draft', 'canon-approved', 'production'])) errors.push('Invalid status.');
  for (const section of ['profile', 'identity', 'voice', 'editorial']) {
    if (!obj(p[section])) errors.push(`${section} must be an object.`);
  }
  if (errors.length) return { errors, warnings };
  if (p.profile.virtual !== true) errors.push('profile.virtual must be true.');
  if (p.profile.age !== null && (!Number.isInteger(p.profile.age) || p.profile.age < 18)) errors.push('Age must be adult (18+) or null in a draft.');
  for (const [section, fields] of Object.entries({
    profile: ['name', 'audience', 'valueProposition', 'backstory'],
    identity: ['face', 'eyes', 'hair', 'skin', 'body'],
    voice: ['language', 'accent', 'tone', 'pace'], editorial: ['disclosure']
  })) for (const field of fields) {
    if (typeof p[section][field] !== 'string') errors.push(`${section}.${field} must be text.`);
  }
  for (const [section, fields] of Object.entries({
    profile: ['personality', 'boundaries'], identity: ['distinctiveMarks', 'invariants', 'allowedChanges'],
    editorial: ['pillars', 'avoid']
  })) for (const field of fields) {
    if (!strings(p[section][field])) errors.push(`${section}.${field} must be a list of nonempty strings.`);
  }
  if (!Array.isArray(p.references)) errors.push('references must be a list.');
  if (!(p.voice.referenceId === null || nonempty(p.voice.referenceId))) errors.push('voice.referenceId must be text or null.');
  if (!(p.approval === null || obj(p.approval))) errors.push('approval must be an object or null.');
  if (errors.length) return { errors, warnings };
  const complete = [];
  for (const key of ['name', 'audience', 'valueProposition']) if (!nonempty(p.profile[key])) complete.push(`profile.${key}`);
  if (p.profile.age === null) complete.push('profile.age');
  for (const key of ['face', 'eyes', 'hair', 'skin', 'body']) if (!nonempty(p.identity[key])) complete.push(`identity.${key}`);
  if (!p.identity.invariants.length) complete.push('identity.invariants');
  if (!nonempty(p.voice.language)) complete.push('voice.language');
  if (!nonempty(p.editorial.disclosure)) complete.push('editorial.disclosure');
  const approved = !isToken(p.status, 'draft');
  if (complete.length) (approved ? errors : warnings).push(`Fields to define: ${complete.join(', ')}.`);
  const ids = new Set();
  for (const ref of p.references) {
    if (!obj(ref)) { errors.push('Reference must be an object.'); continue; }
    if (!nonempty(ref.id) || ids.has(ref.id)) errors.push('Empty or duplicate reference ID.');
    ids.add(ref.id);
    if (!['front', 'three-quarter', 'profile', 'full-body', 'expression', 'voice'].includes(ref.role)) errors.push(`Invalid reference role: ${ref.id}.`);
    if (!oneOfTokens(ref.status, ['candidate', 'approved', 'rejected'])) errors.push(`Invalid reference status: ${ref.id}.`);
    if (!nonempty(ref.origin)) errors.push(`Missing reference origin: ${ref.id}.`);
    if (!digest(ref.sha256)) errors.push(`Invalid reference hash: ${ref.id}.`);
    if (base) {
      try { if (fileHash(base, ref.path) !== ref.sha256) errors.push(`Reference changed after registration: ${ref.id}.`); }
      catch (e) { errors.push(`Reference ${ref.id}: ${e.message}`); }
    }
    if (isToken(ref.status, 'approved') && (!obj(ref.review) || !nonempty(ref.review.reviewer) ||
        !date(ref.review.at) || !nonempty(ref.review.notes))) errors.push(`Missing reference review: ${ref.id}.`);
  }
  if (p.voice.referenceId !== null && !p.references.some(ref => obj(ref) && ref.id === p.voice.referenceId && ref.role === 'voice' && isToken(ref.status, 'approved'))) {
    errors.push('voice.referenceId must point to an approved voice reference.');
  }
  if (approved) {
    if (!p.references.some(ref => obj(ref) && isToken(ref.status, 'approved') && ref.role === 'front')) errors.push('Canon requires an approved front portrait.');
    if (!p.references.some(ref => obj(ref) && isToken(ref.status, 'approved') && ['three-quarter', 'profile'].includes(ref.role))) errors.push('Canon requires another approved angle.');
    if (!obj(p.approval) || !nonempty(p.approval.reviewer) || !date(p.approval.at) || !nonempty(p.approval.notes)) errors.push('Approval from the responsible reviewer is missing.');
    if (!obj(p.approval) || p.approval.canonHash !== canonHash(p)) errors.push('Approval does not match the current canon.');
    if (base) {
      try { validateFrozenCanon(p, base); }
      catch (error) { errors.push(error.message); }
    }
  }
  return { errors, warnings };
}

function readCanonBundle(directory, identityVersion, expectedCanonHash) {
  const record = readJson(localFile(directory, 'snapshot.json'));
  if (!obj(record) || record.schemaVersion !== 1 || record.kind !== 'canon' || record.identityVersion !== identityVersion ||
      !digest(record.canonHash) || !digest(record.hash) || record.hash !== envelopeHash(record) || !date(record.createdAt)) {
    throw new Error('Invalid or altered canon snapshot.');
  }
  if (expectedCanonHash !== undefined && record.canonHash !== expectedCanonHash) throw new Error('Snapshot does not match the requested canon hash.');
  const result = validatePersona(record.persona);
  if (result.errors.length || isToken(record.persona.status, 'draft') || record.persona.id !== record.characterId ||
      record.persona.identityVersion !== identityVersion || canonHash(record.persona) !== record.canonHash) {
    throw new Error(`Invalid snapshot persona: ${result.errors.join('; ') || 'approval/context mismatch'}.`);
  }
  if (!Array.isArray(record.referenceFiles) || record.referenceFiles.length !== record.persona.references.length) {
    throw new Error('Incomplete snapshot reference map.');
  }
  const ids = new Set(), files = new Set();
  for (const file of record.referenceFiles) {
    if (!obj(file) || ids.has(file.id) || !digest(file.sha256)) throw new Error('Invalid snapshot reference map.');
    ids.add(file.id);
    const ref = record.persona.references.find(ref => ref.id === file.id && isToken(ref.status, 'approved'));
    if (!ref || file.sourcePath !== ref.path || file.sha256 !== ref.sha256 || file.role !== ref.role) throw new Error('Snapshot reference differs from the approved canon.');
    const key = fileKey(directory, file.path);
    if (files.has(key)) throw new Error('Duplicate reference file in the snapshot.');
    files.add(key);
    if (fileHash(directory, file.path) !== file.sha256) throw new Error(`Historical reference bytes changed: ${file.id}.`);
  }
  return record;
}

export function readCanon(base, identityVersion, expectedCanonHash) {
  if (expectedCanonHash !== undefined && !digest(expectedCanonHash)) throw new Error('Invalid requested canon hash.');
  const file = localFile(base, `canon/${versionKey(identityVersion)}/snapshot.json`);
  return readCanonBundle(path.dirname(file), identityVersion, expectedCanonHash);
}

export function snapshotCanon(persona, base) {
  const result = validatePersona(persona, base);
  if (result.errors.length) throw new Error(result.errors.join('\n'));
  if (isToken(persona.status, 'draft')) throw new Error('Freezing the canon requires existing approval; the snapshot does not approve identity.');
  const approved = clone(persona);
  approved.references = approved.references.filter(ref => isToken(ref.status, 'approved'));
  const identityVersion = approved.identityVersion, expected = canonHash(approved), key = versionKey(identityVersion);
  return withLock(base, '.canon.lock', () => {
    const parent = ensureDirectory(base, ['canon']);
    const destination = path.join(parent, key);
    if (fs.existsSync(destination)) {
      const existing = readCanon(base, identityVersion);
      if (existing.canonHash !== expected || existing.characterId !== approved.id) throw new Error('Canon version already frozen with another identity. Increment identityVersion.');
      return existing;
    }
    const staging = ensureDirectory(base, ['canon', `.staging-canon-${crypto.randomUUID()}`]);
    let published = false;
    try {
      ensureDirectory(staging, ['references']);
      const referenceFiles = approved.references.map((ref, index) => {
        const bytes = fs.readFileSync(localFile(base, ref.path));
        if (hash(bytes) !== ref.sha256) throw new Error(`Reference changed during snapshot: ${ref.id}.`);
        const extension = path.extname(ref.path).toLowerCase();
        const safeExtension = /^\.[a-z0-9]{1,10}$/.test(extension) ? extension : '.bin';
        const relative = `references/ref-${String(index + 1).padStart(4, '0')}${safeExtension}`;
        fs.writeFileSync(path.join(staging, relative), bytes, { flag: 'wx' });
        return { id: ref.id, sourcePath: ref.path, path: relative, role: ref.role, sha256: ref.sha256 };
      });
      const record = {
        schemaVersion: 1, kind: 'canon', characterId: approved.id, identityVersion, canonHash: expected,
        createdAt: new Date().toISOString(), persona: approved, referenceFiles
      };
      record.hash = envelopeHash(record);
      fs.writeFileSync(path.join(staging, 'snapshot.json'), JSON.stringify(record, null, 2) + '\n', { flag: 'wx' });
      readCanonBundle(staging, identityVersion, expected);
      fs.renameSync(staging, destination);
      published = true;
      return readCanon(base, identityVersion, expected);
    } finally { if (!published && fs.existsSync(staging)) removeStaging(base, staging, '.staging-canon-'); }
  });
}

function canonForAsset(persona, base, asset) {
  if (!isToken(persona.status, 'draft') && asset.identityVersion === persona.identityVersion && asset.canonHash === canonHash(persona)) {
    const result = validatePersona(persona, base);
    if (result.errors.length) throw new Error(result.errors.join('; '));
    return { persona, snapshot: null };
  }
  try {
    const snapshot = readCanon(base, asset.identityVersion, asset.canonHash);
    if (snapshot.characterId !== persona.id) throw new Error('Snapshot belongs to another character.');
    return { persona: snapshot.persona, snapshot };
  } catch (e) { throw new Error(`Outdated/unapproved canon; historical snapshot missing or invalid: ${e.message}`); }
}

export function buildPrompt(p, shot, base) {
  const result = validatePersona(p, base);
  if (result.errors.length) throw new Error(result.errors.join('\n'));
  if (!obj(shot) || !['reference', 'production'].includes(shot.purpose) || !['image', 'video', 'audio'].includes(shot.medium)) throw new Error('Shot requires purpose reference/production and medium image/video/audio.');
  for (const key of ['objective', 'scene', 'framing', 'lighting', 'expression', 'action', 'format']) {
    if (shot.medium !== 'audio' && !nonempty(shot[key])) throw new Error(`Shot.${key} is not filled in.`);
  }
  if (!strings(shot.referenceIds) || !strings(shot.avoid)) throw new Error('Shot.referenceIds and avoid must be lists of strings.');
  if (typeof shot.wardrobe !== 'string' || typeof shot.script !== 'string') throw new Error('Shot.wardrobe and script must be text.');
  if (shot.durationSeconds !== null && (!Number.isFinite(shot.durationSeconds) || shot.durationSeconds <= 0)) throw new Error('Invalid duration.');
  if (shot.purpose === 'production' && isToken(p.status, 'draft')) throw new Error('Production requires an approved canon. To explore identity, use purpose: reference.');
  if (!nonempty(p.profile.name) || p.profile.age === null || ['face', 'eyes', 'hair', 'skin', 'body'].some(key => !nonempty(p.identity[key])) || !p.identity.invariants.length) throw new Error('Define name, adult age, appearance, and anchors before building the prompt.');
  const hasSpeech = shot.medium === 'audio' || (shot.medium === 'video' && shot.script.trim().length > 0);
  if (hasSpeech) {
    if (['language', 'accent', 'tone', 'pace'].some(key => !nonempty(p.voice[key]))) throw new Error('Define language, accent, timbre, and pace for speech.');
    if (!shot.script.trim()) throw new Error('Audio requires a spoken script.');
    if (shot.purpose === 'production' && p.voice.referenceId === null) throw new Error('Production with speech requires an approved voice reference.');
  }
  let refs = shot.referenceIds.length ? shot.referenceIds.map(id => {
    const ref = p.references.find(ref => ref.id === id && isToken(ref.status, 'approved'));
    if (!ref) throw new Error(`Unapproved or unknown reference: ${id}.`);
    return ref;
  }) : p.references.filter(ref => isToken(ref.status, 'approved') &&
    (shot.medium === 'audio' ? ref.id === p.voice.referenceId : ref.role !== 'voice'));
  if (hasSpeech && p.voice.referenceId && !refs.some(ref => ref.id === p.voice.referenceId)) {
    refs = [...refs, p.references.find(ref => ref.id === p.voice.referenceId)];
  }
  if (shot.purpose === 'production' && shot.medium !== 'audio' && !refs.some(ref => ref.role !== 'voice')) throw new Error('Visual production requires an approved visual reference.');
  if (shot.medium === 'audio' && !nonempty(shot.objective)) throw new Error('Audio requires an objective.');
  if (refs.some(ref => ref.role === 'voice') && shot.medium === 'image') throw new Error('Voice reference cannot be used as an image input.');
  if (refs.some(ref => ref.role !== 'voice') && shot.medium === 'audio') throw new Error('Audio must use voice references; do not attach portraits.');
  const lines = [
    '# Generation specification — candidate for review',
    `Character: ${p.id} | canon: ${p.identityVersion} | hash: ${canonHash(p)}`,
    `Purpose: ${shot.purpose} | medium: ${shot.medium}`,
    `Objective: ${shot.objective}`,
    `Person: ${p.profile.name}, ${p.profile.age} years old, original virtual character.`,
    ...Object.entries(p.identity).filter(([, value]) => typeof value === 'string').map(([key, value]) => `${key}: ${value}`),
    `Distinctive marks: ${p.identity.distinctiveMarks.join('; ') || 'None defined; do not invent them.'}`,
    `Preserve: ${p.identity.invariants.join('; ')}`,
    `Allowed variations: ${p.identity.allowedChanges.join('; ') || 'Only those specified in the brief.'}`,
    ...refs.map((ref, index) => `Input ${index + 1}: ${ref.path} — reference ${ref.id} (${ref.role}), SHA256 ${ref.sha256}.`),
    ...['scene', 'framing', 'lighting', 'wardrobe', 'expression', 'action', 'format'].filter(key => shot[key]).map(key => `${key}: ${shot[key]}`)
  ];
  if (shot.medium !== 'image') {
    lines.push(`Target duration: ${shot.durationSeconds ?? 'define according to the script'} seconds.`);
    if (shot.script) lines.push(`Exact speech: ${JSON.stringify(shot.script)}`, `Voice: ${p.voice.language}; ${p.voice.accent}; ${p.voice.tone}; pace ${p.voice.pace}.`, `Voice reference: ${p.voice.referenceId ?? 'exploration; not yet approved'}.`);
    if (shot.medium === 'video') lines.push('Preserve identity during movement, blinking, and speech; use plausible physical contact and consistent lighting/objects.');
  }
  lines.push(`Avoid: ${shot.avoid.join('; ') || 'No additional restrictions.'}`, 'Preserve approved texture and asymmetries; avoid beautification that changes the face or body.',
    'This text does not generate media or approve identity. Actually attach references to the tool in the specified order; check capabilities before submitting.');
  return lines.join('\n') + '\n';
}

function executionReferences(asset, context) {
  if (!strings(asset.referenceIds) || !asset.referenceIds.length || new Set(asset.referenceIds).size !== asset.referenceIds.length) {
    throw new Error('Execution requires unique, nonempty reference IDs.');
  }
  const refs = asset.referenceIds.map(id => context.references.find(ref => ref.id === id && isToken(ref.status, 'approved')));
  if (refs.some(ref => !ref)) throw new Error('Execution mentions an unknown/unapproved reference.');
  if (['image', 'video'].includes(asset.type) && !refs.some(ref => ref.role !== 'voice')) throw new Error('Visual execution requires a visual reference.');
  if (asset.type === 'image' && refs.some(ref => ref.role === 'voice')) throw new Error('Voice reference is incompatible with an image.');
  if (asset.type === 'audio' && refs.some(ref => ref.role !== 'voice')) throw new Error('Visual reference is incompatible with audio.');
  if (asset.type === 'video' && typeof asset.hasSpeech !== 'boolean') throw new Error('Define video hasSpeech before sealing.');
  if ((asset.type === 'audio' || asset.hasSpeech === true) && !refs.some(ref => ref.id === context.voice.referenceId && ref.role === 'voice')) {
    throw new Error('Execution with speech requires the approved voice of the selected canon.');
  }
  return refs.map(ref => ({ id: ref.id, path: ref.path, role: ref.role, sha256: ref.sha256 }));
}

function readExecutionBundle(base, directory, expectedHash) {
  const record = readJson(localFile(directory, 'snapshot.json'));
  if (!obj(record) || record.schemaVersion !== 1 || record.kind !== 'execution' || record.hash !== expectedHash ||
      !digest(record.hash) || record.hash !== envelopeHash(record) || !date(record.createdAt) || !nonempty(record.assetId) ||
      !obj(record.data) || !obj(record.data.generation) || !obj(record.data.personaContext) || !obj(record.promptFile) ||
      !(record.previousHash === null || digest(record.previousHash))) throw new Error('Invalid or altered execution snapshot.');
  const canon = readCanon(base, record.identityVersion, record.canonHash);
  if (canon.characterId !== record.characterId || canon.hash !== record.data.canonSnapshotHash ||
      record.data.generation.id !== record.assetId || record.data.generation.characterId !== record.characterId ||
      record.data.generation.identityVersion !== record.identityVersion || record.data.generation.canonHash !== record.canonHash) {
    throw new Error('Execution context differs from the canon snapshot.');
  }
  const contextResult = validatePersona(record.data.personaContext);
  if (contextResult.errors.length || isToken(record.data.personaContext.status, 'draft') ||
      record.data.personaContext.id !== record.characterId || canonHash(record.data.personaContext) !== record.canonHash) {
    throw new Error('Invalid execution persona context.');
  }
  const refs = executionReferences(record.data.generation, canon.persona);
  if (jsonHash(refs) !== jsonHash(record.data.referenceFiles)) throw new Error('Execution inputs differ from historical references.');
  if (!digest(record.promptFile.sha256) || record.promptFile.sha256 !== record.data.generation.promptSha256 ||
      fileHash(directory, record.promptFile.path) !== record.promptFile.sha256) throw new Error('Historical prompt bytes changed.');
  return record;
}

export function readExecution(base, executionSha256) {
  if (!digest(executionSha256)) throw new Error('Invalid execution hash.');
  const file = localFile(base, `executions/${executionSha256}/snapshot.json`);
  return readExecutionBundle(base, path.dirname(file), executionSha256);
}

export function sealExecution(persona, base, assetId) {
  const personaResult = validatePersona(persona, base);
  if (personaResult.errors.length) throw new Error(personaResult.errors.join('\n'));
  return withLock(base, '.assets.lock', () => {
    const original = readJson(localFile(base, 'assets.json'));
    if (!obj(original) || !Array.isArray(original.assets)) throw new Error('Invalid manifest.');
    const matches = original.assets.filter(asset => obj(asset) && asset.id === assetId);
    if (matches.length !== 1) throw new Error('Unknown or duplicate asset ID.');
    if (!isToken(matches[0].status, 'draft')) throw new Error('Sealing execution requires a draft asset. It does not modify existing approvals.');
    const manifest = manifestV2(original, persona.id);
    const asset = manifest.assets.find(asset => asset.id === assetId);
    asset.recordVersion = 2;
    asset.characterId = persona.id;
    const check = clone(manifest);
    const unchecked = check.assets.find(candidate => candidate.id === assetId);
    unchecked.executionSha256 = null;
    unchecked.executionPath = null;
    const existingErrors = validateAssets(check, persona, base);
    if (existingErrors.length) throw new Error(existingErrors.join('\n'));
    if (isToken(asset.provider, 'not-provided') || isToken(asset.model, 'not-provided')) throw new Error('Provide the actual provider/model before sealing.');
    if (!nonempty(asset.promptPath) || !['.md', '.txt', '.json'].includes(path.extname(asset.promptPath).toLowerCase())) throw new Error('Provide the actual prompt in an .md, .txt, or .json file.');
    const promptBytes = fs.readFileSync(localFile(base, asset.promptPath));
    const promptSha256 = hash(promptBytes);
    if (asset.promptSha256 !== null && asset.promptSha256 !== undefined && asset.promptSha256 !== promptSha256) throw new Error('Prompt changed; do not update its hash silently.');
    asset.promptSha256 = promptSha256;
    const context = canonForAsset(persona, base, asset);
    const referenceFiles = executionReferences(asset, context.persona);
    const canon = context.snapshot ?? snapshotCanon(context.persona, base);
    if (digest(asset.executionSha256)) {
      const previous = readExecution(base, asset.executionSha256);
      if (jsonHash(previous.data.generation) === jsonHash(executionPayload(asset))) {
        asset.executionPath = `executions/${previous.hash}/snapshot.json`;
        writeManifest(base, manifest);
        return { asset: clone(asset), executionSha256: previous.hash, snapshotPath: asset.executionPath };
      }
    }
    const extension = path.extname(asset.promptPath).toLowerCase();
    const record = {
      schemaVersion: 1, kind: 'execution', characterId: persona.id, assetId: asset.id,
      identityVersion: asset.identityVersion, canonHash: asset.canonHash, createdAt: new Date().toISOString(),
      previousHash: digest(asset.executionSha256) ? asset.executionSha256 : null,
      attestation: 'Recorded context; the seal does not prove a provider call or media inspection.',
      data: { generation: clone(executionPayload(asset)), personaContext: clone(context.persona), canonSnapshotHash: canon.hash, referenceFiles },
      promptFile: { path: `prompt${extension}`, sha256: promptSha256 }
    };
    record.hash = envelopeHash(record);
    const parent = ensureDirectory(base, ['executions']);
    const destination = path.join(parent, record.hash);
    const staging = ensureDirectory(base, ['executions', `.staging-execution-${crypto.randomUUID()}`]);
    let published = false;
    try {
      fs.writeFileSync(path.join(staging, record.promptFile.path), promptBytes, { flag: 'wx' });
      fs.writeFileSync(path.join(staging, 'snapshot.json'), JSON.stringify(record, null, 2) + '\n', { flag: 'wx' });
      readExecutionBundle(base, staging, record.hash);
      fs.renameSync(staging, destination);
      published = true;
    } finally { if (!published && fs.existsSync(staging)) removeStaging(base, staging, '.staging-execution-'); }
    asset.executionSha256 = record.hash;
    asset.executionPath = `executions/${record.hash}/snapshot.json`;
    writeManifest(base, manifest);
    return { asset: clone(asset), executionSha256: record.hash, snapshotPath: asset.executionPath };
  });
}

export function migrateAssets(persona, base) {
  const result = validatePersona(persona, base);
  if (result.errors.length) throw new Error(result.errors.join('\n'));
  return withLock(base, '.assets.lock', () => {
    const original = readJson(localFile(base, 'assets.json'));
    const errors = validateAssets(original, persona, base);
    if (errors.length) throw new Error(errors.join('\n'));
    const migrated = manifestV2(original, persona.id);
    if (!isToken(persona.status, 'draft')) snapshotCanon(persona, base);
    writeManifest(base, migrated);
    return migrated;
  });
}

export function validateAssets(manifest, persona, base) {
  const errors = [];
  if (!obj(manifest) || ![1, 2].includes(manifest.schemaVersion) || !Array.isArray(manifest.assets)) return ['Manifest must contain schemaVersion 1 or 2 and an assets list.'];
  const ids = new Set();
  const files = new Set();
  for (const asset of manifest.assets) {
    if (!obj(asset)) { errors.push('Asset must be an object.'); continue; }
    const recordVersion = asset.recordVersion ?? (manifest.schemaVersion === 1 ? 1 : null);
    if (![1, 2].includes(recordVersion)) errors.push(`Invalid record version: ${asset.id}.`);
    if (recordVersion === 1 && manifest.schemaVersion === 2 && (!obj(asset.legacy) || asset.legacy.sourceSchemaVersion !== 1 ||
        !date(asset.legacy.adoptedAt) || asset.legacy.recordSha256 !== jsonHash(legacyPayload(asset)))) {
      errors.push(`Legacy record changed after migration: ${asset.id}. New approval requires a v2 execution record.`);
    }
    if (recordVersion === 2 && asset.characterId !== persona.id) errors.push(`Record belongs to another character: ${asset.id}.`);
    if (!nonempty(asset.id) || ids.has(asset.id)) errors.push('Empty or duplicate asset ID.');
    ids.add(asset.id);
    if (!['image', 'video', 'audio'].includes(asset.type)) errors.push(`Invalid type: ${asset.id}.`);
    if (!oneOfTokens(asset.status, ['draft', 'production', 'rejected'])) errors.push(`Invalid status: ${asset.id}.`);
    if (!digest(asset.sha256) || !digest(asset.canonHash)) errors.push(`Invalid hashes: ${asset.id}.`);
    if (!Number.isSafeInteger(asset.identityVersion) || asset.identityVersion < 1) errors.push(`Invalid identity version: ${asset.id}.`);
    if (!date(asset.createdAt)) errors.push(`Invalid date: ${asset.id}.`);
    if (!strings(asset.referenceIds)) errors.push(`Invalid referenceIds: ${asset.id}.`);
    if (!nonempty(asset.provider) || !nonempty(asset.model)) errors.push(`Provide provider/model: ${asset.id}.`);
    if (asset.cost !== null && (!obj(asset.cost) || !Number.isFinite(asset.cost.amount) || asset.cost.amount < 0 ||
        typeof asset.cost.currency !== 'string' || !/^[A-Z]{3}$/.test(asset.cost.currency))) errors.push(`Invalid cost: ${asset.id}. Use null or a nonnegative amount and a currency with three uppercase letters.`);
    try {
      const key = fileKey(base, asset.path);
      if (files.has(key)) errors.push(`Duplicate file in the manifest: ${asset.id}.`);
      files.add(key);
      if (fileHash(base, asset.path) !== asset.sha256) errors.push(`File changed after registration: ${asset.id}.`);
    }
    catch (e) { errors.push(`${asset.id}: ${e.message}`); }
    if (recordVersion === 2 && asset.executionSha256 !== null && asset.executionSha256 !== undefined) {
      try {
        const execution = readExecution(base, asset.executionSha256);
        if (execution.characterId !== persona.id || execution.assetId !== asset.id || execution.identityVersion !== asset.identityVersion ||
            execution.canonHash !== asset.canonHash || jsonHash(execution.data.generation) !== jsonHash(executionPayload(asset)) ||
            asset.executionPath !== `executions/${asset.executionSha256}/snapshot.json`) {
          errors.push(`Execution context changed after sealing: ${asset.id}.`);
        }
      } catch (e) { errors.push(`Execution ${asset.id}: ${e.message}`); }
    }
    if (isToken(asset.status, 'production')) {
      let context;
      try { context = canonForAsset(persona, base, asset).persona; }
      catch (e) { errors.push(`${e.message}: ${asset.id}.`); }
      const review = asset.review;
      const expected = { image: 'visual', video: 'visual-and-audio', audio: 'listening' }[asset.type];
      if (!obj(review) || !isToken(review.decision, 'approve') || !nonempty(review.reviewer) || !date(review.at) || !nonempty(review.notes) || !isToken(review.method, expected)) errors.push(`Insufficient review: ${asset.id}.`);
      if (!obj(review) || !Array.isArray(review.criticalIssues) || review.criticalIssues.length || !Array.isArray(review.limitations) || review.limitations.length) errors.push(`Critical issues or pending inspection: ${asset.id}.`);
      if (!obj(review) || review.mediaSha256 !== asset.sha256 || review.canonHash !== asset.canonHash || review.identityVersion !== asset.identityVersion) errors.push(`Review does not match the file/canon: ${asset.id}.`);
      const references = context && Array.isArray(asset.referenceIds) ? asset.referenceIds.map(id => context.references.find(ref => ref.id === id && isToken(ref.status, 'approved'))).filter(Boolean) : [];
      if (!Array.isArray(asset.referenceIds) || !asset.referenceIds.length || references.length !== asset.referenceIds.length) errors.push(`Missing/unapproved production references: ${asset.id}.`);
      if (['image', 'video'].includes(asset.type) && !references.some(ref => ref.role !== 'voice')) errors.push(`Missing visual reference: ${asset.id}.`);
      if (asset.type === 'image' && references.some(ref => ref.role === 'voice')) errors.push(`Reference incompatible with image: ${asset.id}.`);
      if (asset.type === 'audio' && references.some(ref => ref.role !== 'voice')) errors.push(`Reference incompatible with audio: ${asset.id}.`);
      if (asset.type === 'video' && typeof asset.hasSpeech !== 'boolean') errors.push(`Provide video hasSpeech: ${asset.id}.`);
      if ((asset.type === 'audio' || asset.hasSpeech === true) && (!context?.voice.referenceId || !references.some(ref => ref.id === context.voice.referenceId && ref.role === 'voice'))) errors.push(`Missing voice reference: ${asset.id}.`);
      if (!nonempty(asset.promptPath)) errors.push(`Missing production prompt: ${asset.id}.`);
      else {
        if (!digest(asset.promptSha256)) errors.push(`Missing/invalid prompt hash: ${asset.id}.`);
        if (!['.md', '.txt', '.json'].includes(path.extname(asset.promptPath).toLowerCase())) errors.push(`Prompt must be an .md, .txt, or .json text file: ${asset.id}.`);
        try { if (fileHash(base, asset.promptPath) !== asset.promptSha256) errors.push(`Prompt changed after registration: ${asset.id}.`); }
        catch(e) { errors.push(`Prompt ${asset.id}: ${e.message}`); }
        if (!obj(review) || review.promptSha256 !== asset.promptSha256) errors.push(`Review does not match the prompt: ${asset.id}.`);
      }
      if (isToken(asset.provider, 'not-provided') || isToken(asset.model, 'not-provided')) errors.push(`Pending generation origin: ${asset.id}.`);
      if (recordVersion === 2 && (!digest(asset.executionSha256) || !obj(review) || review.executionSha256 !== asset.executionSha256)) {
        errors.push(`V2 production requires sealed execution and matching review.executionSha256: ${asset.id}.`);
      }
    }
  }
  return errors;
}

export function registerAsset(persona, base, relative, type) {
  if (!['image', 'video', 'audio'].includes(type)) throw new Error('Type must be image, video, or audio.');
  const result = validatePersona(persona, base);
  if (result.errors.length) throw new Error(result.errors.join('\n'));
  return withLock(base, '.assets.lock', () => {
    const manifestFile = localFile(base, 'assets.json');
    const original = readJson(manifestFile);
    const errors = validateAssets(original, persona, base);
    if (errors.length) throw new Error(errors.join('\n'));
    const sha256 = fileHash(base, relative);
    const key = fileKey(base, relative);
    if (key === fileKey(base, 'assets.json')) throw new Error('The manifest cannot be registered as a media file.');
    const manifest = manifestV2(original, persona.id);
    if (manifest.assets.some(asset => fileKey(base, asset.path) === key)) throw new Error('File already registered. Create a new version; do not overwrite the original.');
    if (!isToken(persona.status, 'draft')) snapshotCanon(persona, base);
    const asset = {
      recordVersion: 2, characterId: persona.id,
      id: crypto.randomUUID(), type, path: relative, status: 'draft', sha256,
      identityVersion: persona.identityVersion, canonHash: canonHash(persona),
      createdAt: new Date().toISOString(), provider: 'not-provided', model: 'not-provided',
      referenceIds: [], promptPath: null, promptSha256: null, cost: null, executionSha256: null, executionPath: null,
      hasSpeech: type === 'video' ? null : type === 'audio', review: null
    };
    manifest.assets.push(asset);
    writeManifest(base, manifest);
    return asset;
  });
}
