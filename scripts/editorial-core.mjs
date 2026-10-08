import { canonicalToken, isToken, oneOfTokens } from './language-compat.mjs';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import * as core from './studio-core.mjs';

const object = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const text = value => typeof value === 'string' && value.trim().length > 0;
const strings = value => Array.isArray(value) && value.every(text);
const digest = value => typeof value === 'string' && /^[a-f0-9]{64}$/.test(value);
const integer = value => Number.isSafeInteger(value) && value > 0;
const instant = value => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(value) && /(?:Z|[+-]\d{2}:\d{2})$/.test(value) && Number.isFinite(Date.parse(value));
const stable = value => Array.isArray(value) ? value.map(stable) : object(value) ? Object.fromEntries(Object.keys(value).sort().map(key => [key, stable(value[key])])) : value;
const checksum = value => core.hash(JSON.stringify(stable(value)));
const clone = value => JSON.parse(JSON.stringify(value));
const without = (value, field) => Object.fromEntries(Object.entries(value).filter(([key]) => key !== field));
const numbered = version => `v${String(version).padStart(6, '0')}.json`;
const fail = message => { throw new Error(message); };

function url(value) {
  try { const parsed = new URL(value); return ['https:', 'http:'].includes(parsed.protocol) && !parsed.username && !parsed.password; }
  catch { return false; }
}
function day(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}
function keys(value, allowed, label) {
  for (const key of Object.keys(value)) if (!allowed.includes(key)) fail(`${label}: unknown field ${key}.`);
}
function owner(base, characterId) {
  core.assertSlug(characterId);
  const persona = core.readJson(core.localFile(base, 'persona.json'));
  if (persona.id !== characterId) fail('characterId belongs to another character or differs from the local persona.');
  return persona;
}
function validPersona(base, persona) {
  owner(base, persona?.id);
  const result = core.validatePersona(persona, base);
  if (result.errors.length) fail(result.errors.join('\n'));
}

// Refuse junctions escaping the character before either reads or writes. No recursive
// filesystem operation is performed until the resolved directory has been checked.
function directory(base, relative, create = false) {
  const root = fs.realpathSync(base);
  let current = root;
  for (const part of relative.split('/')) {
    if (!part || part === '.' || part === '..' || part.includes('\\') || part.includes(':')) fail('Invalid editorial directory.');
    current = path.join(current, part);
    if (!fs.existsSync(current)) {
      if (!create) return null;
      fs.mkdirSync(current);
    }
    const resolved = fs.realpathSync(current);
    if (!resolved.startsWith(root + path.sep) || !fs.statSync(resolved).isDirectory()) fail('Editorial directory is outside the character directory.');
    current = resolved;
  }
  return current;
}
function files(base, relative) {
  const dir = directory(base, relative);
  if (!dir) return [];
  const names = fs.readdirSync(dir);
  for (const name of names) if (!/^v\d{6}\.json$/.test(name)) fail(`Unexpected editorial file: ${relative}/${name}.`);
  return names.sort().map(name => `${relative}/${name}`);
}
function history(base, relative, kind, characterId, checkData) {
  let previous = null;
  return files(base, relative).map((file, index) => {
    const item = core.readJson(core.localFile(base, file));
    if (!object(item) || item.schemaVersion !== 1 || item.kind !== kind || item.characterId !== characterId ||
        item.version !== index + 1 || item.path !== `${relative}/${numbered(index + 1)}` || !instant(item.createdAt) ||
        item.previousHash !== previous || !digest(item.hash) || item.hash !== checksum(without(item, 'hash'))) {
      fail(`Invalid/altered editorial snapshot or incomplete chain: ${file}.`);
    }
    if (item.data?.characterId !== characterId) fail(`Snapshot belongs to another character: ${file}.`);
    checkData(item.data);
    previous = item.hash;
    return item;
  });
}
function append(base, relative, kind, characterId, data, previous) {
  const version = previous.length + 1;
  if (version > 999999) fail('Editorial version limit reached.');
  const dir = directory(base, relative, true);
  const item = {
    schemaVersion: 1, kind, characterId, version,
    createdAt: new Date().toISOString(), previousHash: previous.at(-1)?.hash ?? null,
    path: `${relative}/${numbered(version)}`, data
  };
  item.hash = checksum(item);
  const target = path.join(dir, numbered(version));
  if (fs.existsSync(target)) fail('Editorial version already exists; nothing was overwritten.');
  const temp = path.join(dir, `.editorial-${crypto.randomUUID()}.tmp`);
  try {
    fs.writeFileSync(temp, JSON.stringify(item, null, 2) + '\n', { flag: 'wx' });
    fs.renameSync(temp, target);
  } finally { if (fs.existsSync(temp)) fs.unlinkSync(temp); }
  return item;
}
function locked(base, work) {
  const lockPath = path.join(fs.realpathSync(base), '.editorial.lock');
  let handle;
  try { handle = fs.openSync(lockPath, 'wx'); }
  catch (error) { if (error.code === 'EEXIST') fail('Editorial records are in use; check processes before recovering .editorial.lock.'); throw error; }
  try { return work(); }
  finally { fs.closeSync(handle); fs.unlinkSync(lockPath); }
}
function review(value, label) {
  if (!object(value) || !isToken(value.decision, 'approve') || !text(value.reviewer) || !instant(value.at) || !text(value.notes)) {
    fail(`${label} requires an approve decision, actual reviewer, date, and explicit notes.`);
  }
  keys(value, ['decision', 'reviewer', 'at', 'notes', 'dataHash'], label);
}

export function narrativeDraft(persona) {
  core.assertSlug(persona?.id);
  return {
    schemaVersion: 1, characterId: persona.id, status: 'draft',
    audience: persona.profile?.audience ?? '', valueProposition: persona.profile?.valueProposition ?? '',
    backstory: persona.profile?.backstory ?? '', desire: '', values: [], contradiction: '', habits: [],
    boundaries: [...(persona.profile?.boundaries ?? [])],
    writingVoice: { language: persona.voice?.language ?? '', tone: '', rhythm: '', vocabulary: [], examples: [], avoidExamples: [] },
    timeline: [], approval: null
  };
}
function narrativeData(data) {
  if (!object(data) || data.schemaVersion !== 1) fail('Narrative must be an object with schemaVersion 1.');
  keys(data, ['schemaVersion', 'characterId', 'status', 'audience', 'valueProposition', 'backstory', 'desire', 'values', 'contradiction', 'habits', 'boundaries', 'writingVoice', 'timeline', 'approval'], 'Narrative');
  core.assertSlug(data.characterId);
  if (!oneOfTokens(data.status, ['draft', 'approved'])) fail('Invalid narrative status.');
  for (const key of ['audience', 'valueProposition', 'backstory', 'desire', 'contradiction']) if (typeof data[key] !== 'string') fail(`Narrative.${key} must be text.`);
  for (const key of ['values', 'habits', 'boundaries']) if (!strings(data[key])) fail(`Narrative.${key} must be a list of strings.`);
  const voice = data.writingVoice;
  if (!object(voice)) fail('writingVoice must be an object.');
  keys(voice, ['language', 'tone', 'rhythm', 'vocabulary', 'examples', 'avoidExamples'], 'writingVoice');
  for (const key of ['language', 'tone', 'rhythm']) if (typeof voice[key] !== 'string') fail(`writingVoice.${key} must be text.`);
  if (!strings(voice.vocabulary) || !strings(voice.avoidExamples) || !Array.isArray(voice.examples)) fail('Invalid editorial voice examples/vocabulary.');
  const kinds = new Set();
  for (const example of voice.examples) {
    if (!object(example)) fail('Invalid editorial example.');
    keys(example, ['kind', 'text'], 'Example');
    if (!oneOfTokens(example.kind, ['introduction', 'opinion', 'disagreement']) || kinds.has(canonicalToken(example.kind)) || !text(example.text)) fail('Example must have a unique kind and nonempty text.');
    kinds.add(canonicalToken(example.kind));
  }
  if (!Array.isArray(data.timeline)) fail('timeline must be a list.');
  const events = new Set();
  let last = '';
  for (const event of data.timeline) {
    if (!object(event)) fail('Invalid timeline event.');
    keys(event, ['id', 'date', 'description', 'consequence', 'after', 'contentIds', 'fictional'], 'Event');
    core.assertSlug(event.id);
    if (events.has(event.id) || !day(event.date) || event.date < last || !text(event.description) ||
        typeof event.consequence !== 'string' || event.fictional !== true || !strings(event.after) || !strings(event.contentIds)) {
      fail('Timeline requires unique IDs, valid ordered dates, description, and explicit fiction.');
    }
    if (event.after.some(id => !events.has(id))) fail('Event depends on a missing or later timeline event.');
    for (const id of event.contentIds) core.assertSlug(id);
    events.add(event.id); last = event.date;
  }
  if (isToken(data.status, 'approved')) {
    if (['audience', 'valueProposition', 'desire', 'contradiction'].some(key => !text(data[key])) || !data.values.length ||
        ['language', 'tone', 'rhythm'].some(key => !text(voice[key])) || kinds.size !== 3 || !voice.avoidExamples.length) {
      fail('Approved narrative requires audience, value, desire, values, contradiction, and editorial voice examples.');
    }
    review(data.approval, 'Narrative approval');
    if (data.approval.dataHash !== checksum(without(data, 'approval'))) fail('Approval does not match the narrative.');
  } else if (data.approval !== null) fail('Draft narrative cannot record approval.');
}

export function saveNarrative(base, persona, input, decision = null) {
  validPersona(base, persona);
  if (!object(input)) fail('Narrative input must be an object.');
  if (input.writingVoice !== undefined && !object(input.writingVoice)) fail('writingVoice must be an object.');
  const defaults = narrativeDraft(persona);
  const supplied = clone(input);
  const data = { ...defaults, ...supplied, writingVoice: { ...defaults.writingVoice, ...supplied.writingVoice }, status: decision ? 'approved' : 'draft', approval: null };
  if (Array.isArray(data.writingVoice.examples)) for (const example of data.writingVoice.examples) {
    if (object(example)) example.kind = canonicalToken(example.kind);
  }
  if (data.characterId !== persona.id) fail('Narrative belongs to another character.');
  if (decision) {
    review(decision, 'Narrative approval');
    const dataHash = checksum(without(data, 'approval'));
    if (decision.dataHash && decision.dataHash !== dataHash) fail('Provided hash does not match the reviewed narrative.');
    data.approval = { ...clone(decision), decision: canonicalToken(decision.decision), dataHash };
  }
  narrativeData(data);
  return locked(base, () => append(base, 'narrative', 'narrative', persona.id, data, history(base, 'narrative', 'narrative', persona.id, narrativeData)));
}

export function readNarrative(base, version) {
  const persona = core.readJson(core.localFile(base, 'persona.json'));
  owner(base, persona.id);
  if (version !== undefined && !integer(version)) fail('Invalid narrative version.');
  const items = history(base, 'narrative', 'narrative', persona.id, narrativeData);
  const item = version === undefined ? items.at(-1) : items.find(item => item.version === version);
  if (!item) fail('Narrative version not found.');
  return item;
}

function pair(version, value, label) {
  if (!(version === null && value === null) && (!integer(version) || !digest(value))) fail(`${label} requires version and hash together, or both null.`);
}
function contentData(data) {
  if (!object(data) || data.schemaVersion !== 1) fail('Content piece must be an object with schemaVersion 1.');
  keys(data, ['schemaVersion', 'id', 'characterId', 'status', 'campaignId', 'canonVersion', 'canonHash', 'narrativeVersion', 'narrativeHash', 'channel', 'objective', 'pillar', 'message', 'script', 'caption', 'shots', 'linkedAssetIds', 'sources', 'factualClaims', 'music', 'disclosure', 'review'], 'Piece');
  core.assertSlug(data.id); core.assertSlug(data.characterId);
  if (data.campaignId !== null) core.assertSlug(data.campaignId);
  if (!oneOfTokens(data.status, ['draft', 'ready-for-production'])) fail('Invalid piece status.');
  pair(data.canonVersion, data.canonHash, 'Canon'); pair(data.narrativeVersion, data.narrativeHash, 'Narrative');
  for (const key of ['channel', 'objective', 'pillar', 'message', 'script', 'caption']) if (typeof data[key] !== 'string') fail(`Piece.${key} must be text.`);
  if (!strings(data.linkedAssetIds) || new Set(data.linkedAssetIds).size !== data.linkedAssetIds.length) fail('Invalid or duplicate asset IDs.');
  for (const field of ['shots', 'sources', 'factualClaims']) if (!Array.isArray(data[field])) fail(`${field} must be a list.`);
  const shotIds = new Set();
  for (const shot of data.shots) {
    if (!object(shot)) fail('Linked shot must be an object.');
    keys(shot, ['id', 'path', 'sha256'], 'Shot'); core.assertSlug(shot.id);
    if (shotIds.has(shot.id) || !(shot.path === null && shot.sha256 === null) && (!text(shot.path) || !digest(shot.sha256))) fail('Invalid or duplicate shot; use path/sha256 together or null.');
    shotIds.add(shot.id);
  }
  const sourceIds = new Set();
  for (const source of data.sources) {
    if (!object(source)) fail('Source must be an object.');
    keys(source, ['id', 'url', 'title', 'collectedAt', 'status', 'notes', 'path', 'sha256'], 'Source'); core.assertSlug(source.id);
    if (sourceIds.has(source.id) || !oneOfTokens(source.status, ['consulted', 'pending']) || typeof source.title !== 'string' || typeof source.notes !== 'string' ||
        !(source.url === null || url(source.url)) || !(source.collectedAt === null || instant(source.collectedAt)) ||
        !(source.path === null && source.sha256 === null) && (!text(source.path) || !digest(source.sha256))) fail('Invalid or duplicate source.');
    if (isToken(source.status, 'consulted') && (!instant(source.collectedAt) || (!source.url && !source.path))) fail('Consulted source requires a date and URL or evidence file.');
    sourceIds.add(source.id);
  }
  const claimIds = new Set();
  for (const claim of data.factualClaims) {
    if (!object(claim)) fail('Factual claim must be an object.');
    keys(claim, ['id', 'text', 'sourceIds'], 'Claim'); core.assertSlug(claim.id);
    if (claimIds.has(claim.id) || !text(claim.text) || !strings(claim.sourceIds) || claim.sourceIds.some(id => !sourceIds.has(id))) fail('Invalid factual claim or unknown source.');
    claimIds.add(claim.id);
  }
  if (!object(data.disclosure) || typeof data.disclosure.virtual !== 'string' || ![null, true, false].includes(data.disclosure.commercial)) fail('Invalid virtual/commercial disclosure.');
  keys(data.disclosure, ['virtual', 'commercial'], 'Disclosure');
  if (data.music !== null) {
    const music = data.music;
    if (!object(music)) fail('Music must be an object or null.');
    keys(music, ['title', 'creator', 'url', 'versionId', 'platform', 'region', 'accountType', 'usage', 'useInProduction', 'catalogAvailability', 'eligibility', 'alternative'], 'Music');
    for (const field of ['title', 'creator', 'platform', 'region', 'accountType', 'alternative']) if (typeof music[field] !== 'string') fail(`Music.${field} must be text.`);
    if (!(music.url === null || url(music.url)) || !(music.versionId === null || text(music.versionId)) ||
        typeof music.useInProduction !== 'boolean' || !oneOfTokens(music.usage, ['organic', 'advertisement', 'export'])) fail('Invalid music context.');
    for (const field of ['catalogAvailability', 'eligibility']) {
      const check = music[field];
      if (!object(check)) fail(`Music.${field} must be an object.`);
      keys(check, ['status', 'sourceId', 'checkedAt', 'notes'], `Music.${field}`);
      if (!oneOfTokens(check.status, ['confirmed', 'pending', 'not-permitted']) || !(check.sourceId === null || sourceIds.has(check.sourceId)) ||
          !(check.checkedAt === null || instant(check.checkedAt)) || typeof check.notes !== 'string') fail(`Invalid music verification: ${field}.`);
      if (isToken(check.status, 'confirmed') && (!check.sourceId || !instant(check.checkedAt) || !isToken(data.sources.find(source => source.id === check.sourceId)?.status, 'consulted'))) fail(`Music.${field} confirmed status requires consulted evidence and a date.`);
    }
  }
  if (isToken(data.status, 'ready-for-production')) {
    if (data.canonVersion === null || data.narrativeVersion === null || ['channel', 'objective', 'pillar', 'message'].some(key => !text(data[key])) ||
        (!text(data.script) && !text(data.caption)) || !data.shots.length || data.shots.some(shot => !shot.path) ||
        !text(data.disclosure.virtual) || data.disclosure.commercial === null) fail('Ready piece requires defined context, message, script/caption, shots, and disclosure.');
    if (data.factualClaims.some(claim => !claim.sourceIds.length || claim.sourceIds.some(id => !isToken(data.sources.find(source => source.id === id)?.status, 'consulted')))) fail('A factual claim without a consulted source prevents a ready piece.');
    if (data.music?.useInProduction && (['title', 'creator', 'platform', 'region', 'accountType'].some(field => !text(data.music[field])) ||
        (!data.music.url && !data.music.versionId) || !isToken(data.music.catalogAvailability.status, 'confirmed') || !isToken(data.music.eligibility.status, 'confirmed'))) fail('Music in use requires confirmed catalog availability and eligibility for the usage context.');
    review(data.review, 'Editorial review');
    if (data.review.dataHash !== checksum(without(data, 'review'))) fail('Review does not match the piece.');
  } else if (data.review !== null) fail('Draft piece cannot record an approval review.');
}

// Historical production always requires the immutable canon resolver. The fallback
// supports current drafts only; it does not manufacture a historical approval.
function context(base, persona, data, strictDraft = false) {
  const warnings = [];
  let canonical = null;
  const ready = isToken(data.status, 'ready-for-production');
  if (data.canonVersion !== null) {
    try {
      if (typeof core.readCanon !== 'function') fail('Canon snapshot reader is unavailable.');
      const snapshot = core.readCanon(base, data.canonVersion, data.canonHash);
      canonical = snapshot.persona;
      if (snapshot.characterId !== persona.id || canonical.id !== persona.id || isToken(canonical.status, 'draft')) fail('Canon snapshot belongs to another character or is unapproved.');
    } catch (error) {
      if (ready) throw error;
      if (data.canonVersion === persona.identityVersion && data.canonHash === core.canonHash(persona)) canonical = persona;
      else if (strictDraft) throw error;
      warnings.push(`Piece ${data.id}: draft canon context is not preserved/approved: ${error.message}`);
    }
  } else warnings.push(`Piece ${data.id}: canon needs binding.`);
  if (data.narrativeVersion !== null) {
    const narrative = readNarrative(base, data.narrativeVersion);
    if (narrative.characterId !== persona.id || narrative.hash !== data.narrativeHash) fail('Narrative context does not match the piece.');
    if (ready && !isToken(narrative.data.status, 'approved')) fail('Ready piece requires an approved narrative.');
  } else warnings.push(`Piece ${data.id}: narrative needs binding.`);
  for (const shot of data.shots) {
    if (!shot.path) continue;
    if (path.extname(shot.path).toLowerCase() !== '.json' || core.fileHash(base, shot.path) !== shot.sha256) fail(`Shot changed or format invalid: ${shot.id}.`);
    const input = core.readJson(core.localFile(base, shot.path));
    if (!object(input) || !['image', 'video', 'audio'].includes(input.medium)) fail(`Invalid shot: ${shot.id}.`);
    if (input.characterId !== undefined && input.characterId !== persona.id) fail('Shot belongs to another character.');
    if (input.identityVersion !== undefined && input.identityVersion !== data.canonVersion) fail('Shot belongs to another canon version.');
    if (input.canonHash !== undefined && input.canonHash !== data.canonHash) fail('Shot canon hash does not match the piece.');
    if (ready && input.purpose !== 'production') fail('Ready piece requires production shots.');
    if (!strings(input.referenceIds)) fail('Invalid shot.referenceIds.');
    if (canonical && input.referenceIds.some(id => !canonical.references.some(ref => ref.id === id && isToken(ref.status, 'approved')))) fail('Shot reference is unknown or belongs to another character.');
  }
  for (const source of data.sources) if (source.path && core.fileHash(base, source.path) !== source.sha256) fail(`Evidence file changed: ${source.id}.`);
  if (data.linkedAssetIds.length) {
    const manifest = core.readJson(core.localFile(base, 'assets.json'));
    if (!Array.isArray(manifest.assets)) fail('Invalid asset manifest.');
    for (const id of data.linkedAssetIds) {
      const asset = manifest.assets.find(item => item.id === id);
      if (!asset || asset.characterId !== undefined && asset.characterId !== persona.id || asset.identityVersion !== data.canonVersion || asset.canonHash !== data.canonHash) fail(`Asset is missing or belongs to another context: ${id}.`);
      if (core.fileHash(base, asset.path) !== asset.sha256) fail(`Linked asset changed: ${id}.`);
    }
  }
  return warnings;
}

export function saveContent(base, persona, input) {
  validPersona(base, persona);
  if (!object(input)) fail('Piece input must be an object.');
  const data = clone(input);
  data.status = canonicalToken(data.status);
  if (Array.isArray(data.sources)) for (const source of data.sources) {
    if (object(source)) source.status = canonicalToken(source.status);
  }
  if (object(data.music)) {
    data.music.usage = canonicalToken(data.music.usage);
    for (const key of ['catalogAvailability', 'eligibility']) {
      if (object(data.music[key])) data.music[key].status = canonicalToken(data.music[key].status);
    }
  }
  if (object(data.review)) data.review.decision = canonicalToken(data.review.decision);
  if (data.characterId !== persona.id) fail('Piece belongs to another character.');
  if (isToken(data.status, 'ready-for-production')) {
    review(data.review, 'Editorial review');
    const dataHash = checksum(without(data, 'review'));
    if (data.review.dataHash && data.review.dataHash !== dataHash) fail('Provided hash does not match the reviewed piece.');
    data.review.dataHash = dataHash;
  }
  contentData(data);
  context(base, persona, data, true);
  return locked(base, () => {
    const relative = `content/${data.id}`;
    const previous = history(base, relative, 'content', persona.id, record => {
      contentData(record);
      if (record.id !== data.id) fail('Piece ID differs from the directory.');
      context(base, persona, record);
    });
    return append(base, relative, 'content', persona.id, data, previous);
  });
}

export function validateEditorial(base, persona) {
  const errors = [], warnings = [];
  try { owner(base, persona?.id); } catch (error) { return { errors: [error.message], warnings }; }
  try {
    const records = history(base, 'narrative', 'narrative', persona.id, narrativeData);
    if (!records.length) warnings.push('Narrative is not recorded yet; additive migration preserves the legacy persona.');
    else if (isToken(records.at(-1).data.status, 'draft')) warnings.push('Current narrative is a draft.');
  } catch (error) { errors.push(error.message); }
  try {
    const dir = directory(base, 'content');
    if (dir) for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      try {
        core.assertSlug(entry.name);
        if (!entry.isDirectory() && !entry.isSymbolicLink()) fail('Piece record must be a directory.');
        const records = history(base, `content/${entry.name}`, 'content', persona.id, data => {
          contentData(data); if (data.id !== entry.name) fail('Piece ID differs from the directory.');
        });
        if (!records.length) fail('Piece directory contains no versions.');
        for (const record of records) warnings.push(...context(base, persona, record.data));
      } catch (error) { errors.push(`Piece ${entry.name}: ${error.message}`); }
    }
  } catch (error) { errors.push(error.message); }
  return { errors, warnings: [...new Set(warnings)] };
}
