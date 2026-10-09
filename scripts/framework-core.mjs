import { canonicalToken, isToken, oneOfTokens, RUN_STATES } from './language-compat.mjs';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { assertSlug, validatePersona, canonHash } from './studio-core.mjs';

const STATES = new Set(RUN_STATES);
const KINDS = new Set(['document', 'media', 'review', 'human-decision', 'delivery']);
const EVIDENCE = new Set(['prepared', 'generated', 'reviewed', 'human-approved', 'delivered']);
const MEDIA = { image: ['.png', '.jpg', '.jpeg', '.webp', '.avif', '.gif'], video: ['.mp4', '.mov', '.webm', '.mkv'], audio: ['.wav', '.mp3', '.m4a', '.ogg', '.flac'] };
const DEFAULT_MEDIA_PROVIDERS = { image: 'higgsfield', video: 'higgsfield', audio: 'higgsfield' };
const DOCUMENTS = ['.md', '.txt', '.json', '.yaml', '.yml', '.csv', '.html', '.pdf'];
const obj = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const text = value => typeof value === 'string' && value.trim().length > 0;
const date = value => text(value) && /^\d{4}-\d{2}-\d{2}T/.test(value) && Number.isFinite(Date.parse(value));
const digest = value => typeof value === 'string' && /^[a-f0-9]{64}$/.test(value);
const id = value => typeof value === 'string' && /^[a-z][a-z0-9-]{0,63}$/.test(value);
const list = value => Array.isArray(value) && value.every(text);
const now = () => new Date().toISOString();
const clone = value => JSON.parse(JSON.stringify(value));
const hash = value => crypto.createHash('sha256').update(value).digest('hex');
const stable = value => Array.isArray(value) ? value.map(stable) : obj(value) ? Object.fromEntries(Object.keys(value).sort().map(key => [key, stable(value[key])])) : value;
const objectHash = value => hash(JSON.stringify(stable(value)));
function recordDigest(run) { const { recordHash, ...body } = run; return objectHash(body); }
function ensure(condition, message) { if (!condition) throw new Error(message); }
function readJson(file) { return JSON.parse(fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, '')); }
function mediaProviders(value, defaults = DEFAULT_MEDIA_PROVIDERS) {
  ensure(value === undefined || obj(value), 'mediaProviders must be an object keyed by image, video, or audio.');
  const selected = { ...defaults, ...value };
  ensure(Object.keys(selected).every(medium => Object.hasOwn(MEDIA, medium)) && Object.keys(MEDIA).every(medium => id(selected[medium])), 'Each media provider must be an English machine token for image, video, or audio.');
  ensure(selected.video !== 'integrated-images' && selected.audio !== 'integrated-images', 'integrated-images is an explicit image alternative, not a video or voice provider.');
  return selected;
}
function inside(root, target) {
  const relative = path.relative(root, target);
  return relative === '' || (!path.isAbsolute(relative) && relative !== '..' && !relative.startsWith('..' + path.sep));
}
function relativeName(value) {
  ensure(text(value) && !path.isAbsolute(value) && !/[\\:\x00\r\n]/.test(value), 'Path must be relative to the root, with / and no special separators.');
  const parts = value.split('/');
  ensure(parts.every(part => part && part !== '.' && part !== '..'), 'Path cannot contain . or ..');
  ensure(!['.git', '.agents', '.codex', '.aws'].includes(parts[0].toLowerCase()), 'Protected configuration path does not belong in a run.');
  return value;
}
function scoped(value, personaId) {
  relativeName(value);
  const parts = value.split('/');
  if (parts[0].toLowerCase() === 'influencers') ensure(personaId && parts[1] === personaId, 'Input/output belongs to another character or the character is not bound.');
}
function file(root, relative) {
  relativeName(relative);
  const base = fs.realpathSync(root), target = fs.realpathSync(path.resolve(base, relative));
  ensure(inside(base, target) && target !== base && fs.statSync(target).isFile(), 'File must remain inside the project and be a regular file.');
  return target;
}
function records(root, paths, personaId) {
  ensure(Array.isArray(paths), 'inputs/outputs must be a list of paths.');
  const seen = new Set();
  return paths.map(relative => {
    scoped(relative, personaId);
    const target = file(root, relative), key = process.platform === 'win32' ? target.toLowerCase() : target;
    scoped(path.relative(fs.realpathSync(root), target).split(path.sep).join('/'), personaId);
    ensure(!seen.has(key), 'File repeated through equivalent paths.'); seen.add(key);
    return { path: relative, sha256: hash(fs.readFileSync(target)) };
  });
}
function runDirectory(root) {
  const base = fs.realpathSync(root);
  let current = base;
  for (const part of ['work', 'runs']) {
    current = path.join(current, part);
    if (!fs.existsSync(current)) fs.mkdirSync(current);
    const resolved = fs.realpathSync(current);
    ensure(inside(base, resolved) && fs.statSync(resolved).isDirectory(), 'Run directory escaped the project.');
    current = resolved;
  }
  return current;
}
function runPath(root, runId) {
  ensure(typeof runId === 'string' && /^run-[a-f0-9-]{36}$/.test(runId), 'Invalid run ID.');
  const target = file(root, `work/runs/${runId}.json`);
  ensure(path.dirname(target) === fs.realpathSync(path.resolve(root, 'work/runs')) && path.basename(target) === `${runId}.json`, 'Run file cannot redirect to another record.');
  return target;
}
function atomicSave(target, value, exclusive = false) {
  const temp = path.join(path.dirname(target), `.run-${crypto.randomUUID()}.tmp`);
  const creationLockPath = path.join(path.dirname(target), `${path.basename(target, '.json')}.lock`);
  let creationLock;
  try {
    if (exclusive) {
      creationLock = fs.openSync(creationLockPath, 'wx');
      ensure(!fs.existsSync(target), 'Run already exists; nothing was overwritten.');
    }
    value.recordHash = recordDigest(value);
    fs.writeFileSync(temp, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
    fs.renameSync(temp, target);
  } finally {
    if (fs.existsSync(temp)) fs.unlinkSync(temp);
    if (creationLock !== undefined) { fs.closeSync(creationLock); fs.unlinkSync(creationLockPath); }
  }
}
function locked(root, runId, operation) {
  const target = runPath(root, runId), lockPath = path.join(path.dirname(target), `${runId}.lock`);
  let lock;
  try { lock = fs.openSync(lockPath, 'wx'); }
  catch (error) { if (error.code === 'EEXIST') throw new Error('Run is in use; check the process before recovering an interrupted lock.'); throw error; }
  try {
    const run = loadRun(root, runId);
    const result = operation(run);
    run.updatedAt = now();
    atomicSave(target, run);
    return packageRun(root, run, result);
  } finally { fs.closeSync(lock); fs.unlinkSync(lockPath); }
}
function reference(root, entry, expectedExtension) {
  ensure(obj(entry) && id(entry.id) && text(entry.path), 'Invalid registry reference.');
  ensure(entry.path.startsWith('framework/') && path.extname(entry.path) === expectedExtension, 'Reference must point to the expected type inside framework/.');
  return file(root, entry.path);
}

export function validateFramework(root) {
  const errors = [], warnings = [];
  let registry;
  try {
    registry = readJson(file(root, 'framework/registry.json'));
    ensure(obj(registry) && registry.schemaVersion === 1 && text(registry.version) && registry.executionMode === 'instruction-packages', 'Invalid registry/schema or execution mode.');
    if (registry.defaultMediaProviders !== undefined) mediaProviders(registry.defaultMediaProviders);
    ensure(list(registry.constitutionPaths) && registry.constitutionPaths.includes('CONSTITUTION.md') && registry.constitutionPaths.includes('AGENTS.md'), 'Registry must declare the constitution and AGENTS.');
    for (const governance of registry.constitutionPaths) file(root, governance);
    const roles = new Map(), tasks = new Map(), workflows = new Map();
    for (const key of ['roles', 'tasks', 'workflows']) ensure(Array.isArray(registry[key]) && registry[key].length, `Registry.${key} is empty/invalid.`);
    for (const entry of registry.roles) {
      reference(root, entry, '.md');
      ensure(!roles.has(entry.id) && text(entry.name) && text(entry.title), 'Role is duplicated or missing a name/responsibility.');
      roles.set(entry.id, entry);
    }
    for (const entry of registry.tasks) {
      const task = readJson(reference(root, entry, '.json'));
      ensure(obj(task) && task.id === entry.id && task.schemaVersion === 1 && text(task.version) && text(task.name), 'Invalid task contract.');
      ensure(!tasks.has(task.id) && roles.has(task.owner), 'Duplicate task or unknown owner.');
      ensure(KINDS.has(task.deliverable) && EVIDENCE.has(task.evidenceType), 'Invalid deliverable/evidence.');
      ensure(({ document: 'prepared', media: 'generated', review: 'reviewed', 'human-decision': 'human-approved', delivery: 'delivered' })[task.deliverable] === task.evidenceType, 'Deliverable and evidence are incompatible.');
      ensure(typeof task.requiresPersona === 'boolean' && typeof task.requiresApprovedCanon === 'boolean' && (!task.requiresApprovedCanon || task.requiresPersona), 'Invalid task prerequisites.');
      ensure(task.capability === null || ['generation', 'inspection'].includes(task.capability), 'Invalid task capability.');
      ensure((task.deliverable !== 'media' || task.capability === 'generation') && (task.deliverable !== 'review' || task.capability === 'inspection'), 'Generation/review must declare a capability.');
      ensure(Number.isInteger(task.minimumOutputs) && task.minimumOutputs >= (task.deliverable === 'human-decision' ? 0 : 1) && list(task.criteria) && task.criteria.length, 'Invalid completion criteria/outputs.');
      tasks.set(task.id, { ...task, path: entry.path });
    }
    for (const entry of registry.workflows) {
      const workflow = readJson(reference(root, entry, '.json'));
      ensure(obj(workflow) && workflow.id === entry.id && workflow.schemaVersion === 1 && text(workflow.version) && text(workflow.name) && typeof workflow.requiresPersona === 'boolean', 'Invalid workflow.');
      ensure(!workflows.has(workflow.id) && Array.isArray(workflow.steps) && workflow.steps.length, 'Empty/duplicate workflow.');
      const seen = new Set(); let generated = false, reviewed = false;
      for (const step of workflow.steps) {
        ensure(obj(step) && id(step.id) && !seen.has(step.id) && tasks.has(step.task) && typeof step.optional === 'boolean', 'Invalid/duplicate step or missing task.'); seen.add(step.id);
        const task = tasks.get(step.task);
        ensure(!step.optional || !['media', 'review', 'delivery'].includes(task.deliverable) && step.task !== 'approve-canon', 'Generation, review, delivery, and canon cannot be skipped.');
        if (task.deliverable === 'media') { generated = true; reviewed = false; }
        if (task.deliverable === 'review') { ensure(generated, 'Review requires earlier generation in this workflow.'); reviewed = true; }
        if (task.deliverable === 'delivery') ensure(reviewed, 'Delivery requires review after the latest generation.');
      }
      ensure(generated && reviewed && tasks.get(workflow.steps.at(-1).task).deliverable === 'delivery', 'Workflow must end in delivery after mandatory generation and review.');
      if (isToken(workflow.id, 'create-character')) ensure(workflow.steps.some(step => step.task === 'approve-canon' && !step.optional), 'Creation requires an explicit canon decision.');
      workflows.set(workflow.id, { ...workflow, path: entry.path });
    }
    return { valid: true, errors, warnings, registry, roles: Object.fromEntries(roles), tasks: Object.fromEntries(tasks), workflows: Object.fromEntries(workflows) };
  } catch (error) { errors.push(error.message); return { valid: false, errors, warnings, registry: registry ?? null }; }
}
function persona(root, personaId) {
  assertSlug(personaId);
  const p = readJson(file(root, `influencers/${personaId}/persona.json`));
  ensure(p.id === personaId, 'Persona.id differs from the directory.');
  const result = validatePersona(p, path.dirname(file(root, `influencers/${personaId}/persona.json`)));
  ensure(!result.errors.length, result.errors.join('\n'));
  return p;
}
function binding(p) { return { personaId: p.id, identityVersion: p.identityVersion, canonHash: canonHash(p) }; }
function attempt(run) { return run.attempts.at(-1); }
function current(run) {
  const a = attempt(run), step = run.contract.workflow.steps[a.stepIndex];
  return step ? { step, task: run.contract.tasks[step.task] } : null;
}
function event(run, type, detail = {}) {
  const entry = { id: crypto.randomUUID(), at: now(), type, ...detail };
  attempt(run).events.push(entry);
  return entry;
}
function validateRun(run) {
  ensure(obj(run) && run.schemaVersion === 1 && /^run-[a-f0-9-]{36}$/.test(run.id) && date(run.createdAt) && date(run.updatedAt), 'Invalid run record.');
  ensure(digest(run.recordHash) && run.recordHash === recordDigest(run), 'Record hash does not match the saved state/events/results.');
  ensure(['image', 'video', 'audio'].includes(run.medium) && text(run.objective), 'Invalid run objective/medium.');
  ensure(obj(run.contract) && objectHash(run.contract) === run.contractHash, 'Run contract changed.');
  ensure(Array.isArray(run.attempts) && run.attempts.length && list(run.capabilities) && Array.isArray(run.governanceFiles), 'Invalid attempts/capabilities.');
  ensure(list(run.constitutionPaths) && run.constitutionPaths.includes('CONSTITUTION.md'), 'Invalid constitutional paths.');
  if (run.personaId !== null) assertSlug(run.personaId);
  ensure(obj(run.contract.tasks) && obj(run.contract.roles) && obj(run.contract.workflow) && Array.isArray(run.contract.workflow.steps), 'Invalid contract snapshot.');
  const ids = new Set();
  for (const a of run.attempts) {
    ensure(obj(a) && /^attempt-[a-f0-9-]{36}$/.test(a.id) && !ids.has(a.id) && STATES.has(canonicalToken(a.state)) && Array.isArray(a.inputs) && Array.isArray(a.results) && Array.isArray(a.events), 'Invalid attempt.'); ids.add(a.id);
    if (a.mediaProviders !== undefined) ensure(objectHash(mediaProviders(a.mediaProviders)) === objectHash(a.mediaProviders), 'Attempt must preserve the complete selected media provider map.');
    ensure(Number.isInteger(a.stepIndex) && a.stepIndex >= 0 && a.stepIndex <= run.contract.workflow.steps.length && a.results.length === a.stepIndex, 'Inconsistent attempt step/result.');
    if (isToken(a.state, 'completed')) ensure(a.stepIndex === run.contract.workflow.steps.length, 'Completion without all steps.');
    for (const input of a.inputs) ensure(obj(input) && text(input.path) && digest(input.sha256), 'Invalid input snapshot.');
    for (let i = 0; i < a.results.length; i++) {
      const step = run.contract.workflow.steps[i], result = a.results[i];
      ensure(result?.stepId === step.id && result.taskId === step.task && ['completed', 'skipped'].includes(result.status), 'Inconsistent step history.');
      if (result.status === 'skipped') ensure(step.optional && text(result.reason), 'History cannot skip a mandatory step.');
    }
  }
}
// Independent of current workspace state: suitable for historical inventory/backup.
export function validateRunRecord(run) {
  validateRun(run);
  for (const a of run.attempts) {
    for (const input of a.inputs) scoped(input.path, run.personaId);
    for (const result of a.results) {
      ensure(Array.isArray(result.outputs), 'Historical outputs must be a list.');
      for (const output of result.outputs) { ensure(obj(output) && digest(output.sha256), 'Invalid output hash.'); scoped(output.path, run.personaId); }
    }
  }
  for (const governance of run.governanceFiles) { ensure(obj(governance) && digest(governance.sha256), 'Invalid governance hash.'); relativeName(governance.path); }
  for (const role of Object.values(run.contract.roles)) { ensure(obj(role) && id(role.id) && text(role.name), 'Invalid snapshot profile.'); relativeName(role.path); }
  for (const task of Object.values(run.contract.tasks)) ensure(obj(task) && run.contract.roles[task.owner] && KINDS.has(task.deliverable) && EVIDENCE.has(task.evidenceType), 'Invalid snapshot task.');
  for (const step of run.contract.workflow.steps) ensure(obj(step) && id(step.id) && run.contract.tasks[step.task] && typeof step.optional === 'boolean', 'Invalid snapshot step.');
  return true;
}
function loadRun(root, runId) {
  const run = readJson(runPath(root, runId));
  ensure(run.id === runId, 'Run ID differs from the file.'); validateRunRecord(run);
  return run;
}
function changes(root, run) {
  const changed = [];
  for (const expected of [...attempt(run).inputs, ...run.governanceFiles]) {
    let actual = null;
    try {
      const target = file(root, expected.path);
      scoped(path.relative(fs.realpathSync(root), target).split(path.sep).join('/'), run.personaId);
      actual = hash(fs.readFileSync(target));
    }
    catch (error) {
      if (!['ENOENT', 'ENOTDIR'].includes(error.code)) throw error;
    }
    if (actual !== expected.sha256) changed.push({ path: expected.path, expected: expected.sha256, actual });
  }
  if (run.canonBinding) {
    let actual = null;
    try { const p = persona(root, run.personaId); if (!isToken(p.status, 'draft')) actual = binding(p); } catch (error) { actual = { error: error.message }; }
    if (objectHash(actual) !== objectHash(run.canonBinding)) changed.push({ path: `influencers/${run.personaId}/persona.json#canon`, expected: run.canonBinding, actual });
  }
  return changed;
}
function unresolvedJob(a) { return a.job && ['planned', 'submitted', 'pending', 'unknown'].includes(a.job.status); }
function taskMedium(run, task) {
  // Historical attempts retain their saved single-medium behavior.
  return attempt(run).mediaProviders && ['generate-candidates', 'review-candidates'].includes(task.id) ? 'image' : run.medium;
}
function missingTaskCapabilities(run, task) {
  if (!task?.capability) return [];
  const medium = taskMedium(run, task), capability = `${medium}-${task.capability}`;
  const required = [capability];
  if (task.capability === 'generation' && attempt(run).mediaProviders) required.push(`${attempt(run).mediaProviders[medium]}:${capability}`);
  return required.filter(requiredCapability => !run.capabilities.includes(requiredCapability));
}
function packageRun(root, run, detail) {
  const a = attempt(run), next = current(run), drift = changes(root, run);
  const missingCapabilities = missingTaskCapabilities(run, next?.task);
  return {
    run: clone(run), runId: run.id, attemptId: a.id, state: canonicalToken(a.state),
    nextTask: next ? { stepId: next.step.id, taskId: next.task.id, name: next.task.name, optional: next.step.optional, criteria: next.task.criteria, expectedDelivery: next.task.deliverable, evidenceType: next.task.evidenceType, requiresPersona: next.task.requiresPersona, requiresApprovedCanon: next.task.requiresApprovedCanon, medium: taskMedium(run, next.task) } : null,
    responsible: next ? clone(run.contract.roles[next.task.owner]) : null,
    constitutionPaths: clone(run.constitutionPaths), governanceFiles: clone(run.governanceFiles),
    inputs: clone(a.inputs), canonBinding: clone(run.canonBinding), drift, missingCapabilities,
    mediaProviders: a.mediaProviders ? clone(a.mediaProviders) : null,
    executionMode: a.execution?.mode ?? 'instruction', automaticallyDispatched: false,
    canContinue: !drift.length && !unresolvedJob(a) && !missingCapabilities.length && !oneOfTokens(a.state, ['completed', 'failed', 'cancelled', 'uncertain-result']),
    limitation: 'Instruction package and recorded declarations. This module does not dispatch agents, generate media, query providers, publish, or prove a reviewer is human.',
    ...(detail === undefined ? {} : { detail })
  };
}
function newAttempt(inputs, reason, selectedProviders) {
  return { id: `attempt-${crypto.randomUUID()}`, startedAt: now(), finishedAt: null, state: 'planned', stepIndex: 0, inputs, results: [], events: [], job: null, execution: null, reason, ...(selectedProviders ? { mediaProviders: clone(selectedProviders) } : {}) };
}

export function startRun(root, options) {
  ensure(obj(options), 'Run specification must be an object.');
  const framework = validateFramework(root); ensure(framework.valid, framework.errors.join('\n'));
  const workflow = framework.workflows[canonicalToken(options.workflowId)]; ensure(workflow, 'Workflow does not exist.');
  ensure(text(options.objective), 'Provide a concrete objective.');
  const personaId = options.personaId ?? null, medium = options.medium ?? (isToken(workflow.id, 'create-character') ? 'video' : 'image');
  ensure(['image', 'video', 'audio'].includes(medium), 'medium must be image, video, or audio.');
  ensure(!workflow.requiresPersona || personaId, 'Workflow requires personaId.');
  const p = personaId ? persona(root, personaId) : null;
  if (workflow.requiresPersona) ensure(!isToken(p.status, 'draft'), 'Production/correction requires an approved canon.');
  const inputs = records(root, options.inputs ?? [], personaId);
  const capabilities = options.capabilities ?? []; ensure(list(capabilities), 'capabilities must be a list of strings.');
  const selectedProviders = mediaProviders(options.mediaProviders, mediaProviders(framework.registry.defaultMediaProviders));
  const run = {
    schemaVersion: 1, id: `run-${crypto.randomUUID()}`, frameworkVersion: framework.registry.version,
    workflowId: workflow.id, personaId, medium, objective: options.objective.trim(), createdAt: now(), updatedAt: now(), capabilities,
    canonBinding: p && !isToken(p.status, 'draft') ? binding(p) : null,
    constitutionPaths: clone(framework.registry.constitutionPaths),
    contract: { workflow: clone(workflow), tasks: clone(framework.tasks), roles: clone(framework.roles) }, contractHash: null,
    governanceFiles: records(root, [...new Set([...framework.registry.constitutionPaths, 'framework/registry.json', ...framework.registry.roles.map(role => role.path), ...framework.registry.tasks.map(task => task.path), ...framework.registry.workflows.map(flow => flow.path)])], null), attempts: [newAttempt(inputs, 'Explicit start', selectedProviders)]
  };
  run.contractHash = objectHash(run.contract);
  event(run, 'created', { note: 'Local run created; no agent or service was called.' });
  const dir = runDirectory(root), target = path.join(dir, `${run.id}.json`);
  atomicSave(target, run, true);
  return packageRun(root, run);
}

export function readRun(root, runId) { return packageRun(root, loadRun(root, runId)); }

function prerequisites(root, run, task) {
  if (task.requiresPersona) ensure(run.personaId, 'Bind a character before this task.');
  if (run.personaId) {
    const p = persona(root, run.personaId);
    if (task.requiresApprovedCanon) ensure(!isToken(p.status, 'draft'), 'The task requires an approved canon with matching approval.');
  }
}
function declaredEvidence(e, expected) {
  ensure(obj(e) && e.type === expected && e.performed === true && text(e.actor) && date(e.at) && text(e.eventId) && text(e.notes), 'Evidence requires the correct type, performed:true, actor, at, eventId, and declared actual notes.');
}
function lastMedia(run) {
  const a = attempt(run);
  const result = [...a.results].reverse().find(result => result.status === 'completed' && run.contract.tasks[result.taskId].deliverable === 'media');
  return result?.outputs ?? [];
}
function approval(root, run, task, value) {
  ensure(obj(value) && value.explicit === true && isToken(value.decision, 'approve') && text(value.reviewer) && date(value.at) && text(value.eventId) && text(value.source) && text(value.notes), 'Human decision requires an explicit declaration, reviewer, at, eventId, source, and notes; the runtime does not prove humanity.');
  if (task.id === 'approve-canon') {
    const p = persona(root, run.personaId), bound = binding(p);
    ensure(!isToken(p.status, 'draft') && value.canonHash === bound.canonHash && value.identityVersion === bound.identityVersion, 'Decision must refer to the version/hash of the already recorded and approved canon.');
    run.canonBinding = bound;
  }
}
function checkOutputs(root, run, task, options) {
  const outputs = records(root, options.outputs ?? [], run.personaId);
  ensure(outputs.length >= task.minimumOutputs, 'The step requires existing output files; preparation is not execution.');
  if (task.deliverable === 'media') {
    const medium = taskMedium(run, task);
    ensure(outputs.every(output => MEDIA[medium].includes(path.extname(output.path).toLowerCase())), 'Generation requires files of the requested media type; documents are not generated media.');
    declaredEvidence(options.evidence, 'generated'); ensure(text(options.evidence.tool), 'Generation requires a declared tool.');
    if (attempt(run).mediaProviders) ensure(options.evidence.provider === attempt(run).mediaProviders[medium], 'Generation must declare the selected media provider; changing a method requires an explicit new attempt.');
  } else if (task.deliverable === 'document') {
    ensure(outputs.every(output => DOCUMENTS.includes(path.extname(output.path).toLowerCase())), 'Preparation requires documents.'); declaredEvidence(options.evidence, 'prepared');
  } else if (task.deliverable === 'review') {
    declaredEvidence(options.evidence, 'reviewed');
    const e = options.evidence, expectedMethod = { image: 'visual', video: 'visual-and-audio', audio: 'listening' }[taskMedium(run, task)];
    ensure(text(e.reviewer) && isToken(e.method, expectedMethod) && isToken(e.decision, 'approve') && list(e.criticalIssues) && !e.criticalIssues.length && list(e.limitations) && !e.limitations.length, 'Review requires a complete method, reviewer, approve decision, and no critical issues/pending limitations.');
    const generated = lastMedia(run); ensure(generated.length && Array.isArray(e.media) && e.media.length === generated.length, 'Review must bind every file from the latest generation.');
    ensure(e.media.every(record => obj(record) && generated.some(output => output.path === record.path && output.sha256 === record.sha256)) && new Set(e.media.map(record => record.path)).size === generated.length, 'Review does not match generated media hashes.');
    ensure(outputs.every(output => DOCUMENTS.includes(path.extname(output.path).toLowerCase())), 'Review output must be a report.');
  } else if (task.deliverable === 'delivery') {
    declaredEvidence(options.evidence, 'delivered');
    const review = [...attempt(run).results].reverse().find(result => result.status === 'completed' && run.contract.tasks[result.taskId].deliverable === 'review');
    ensure(review && outputs.every(output => review.evidence.media.some(media => media.path === output.path && media.sha256 === output.sha256)), 'Delivery requires the same media bytes as the review; a new export requires a new review.');
  } else approval(root, run, task, options.approval);
  return outputs;
}

export function transitionRun(root, runId, options) {
  ensure(obj(options) && text(options.action), 'Provide action in the transition.');
  ensure(options.mediaProviders === undefined, 'Changing mediaProviders requires resume with newAttempt:true and a reason.');
  options = clone(options);
  if (options.state !== undefined) options.state = canonicalToken(options.state);
  for (const item of [options.approval, options.evidence]) {
    if (obj(item)) for (const key of ['decision', 'method']) {
      if (item[key] !== undefined) item[key] = canonicalToken(item[key]);
    }
  }
  return locked(root, runId, run => {
    const a = attempt(run), next = current(run);
    ensure(!oneOfTokens(a.state, ['completed', 'cancelled', 'failed']), 'Attempt is finished; start an explicit new attempt when appropriate.');
    if (options.action === 'cancel') {
      ensure(!unresolvedJob(a) && !isToken(a.state, 'uncertain-result'), 'Reconcile the external job before cancelling the local attempt; cancellation does not recover or cancel the provider job.');
      ensure(text(options.reason), 'Cancellation requires a reason.'); a.state = 'cancelled'; a.finishedAt = now(); event(run, 'cancelled', { reason: options.reason }); return;
    }
    if (options.action === 'uncertain') {
      ensure(obj(options.job) && text(options.job.provider) && text(options.reason), 'Uncertain result requires a provider and reason; missing IDs remain unknown.');
      if (unresolvedJob(a)) {
        ensure(options.job.provider === a.job.provider, 'Uncertain result must preserve the recorded provider/job/request.');
        for (const [key, value] of Object.entries(options.job)) {
          if (Object.hasOwn(a.job, key) && !['status', 'recordedAt'].includes(key)) ensure(objectHash(value) === objectHash(a.job[key]), 'Uncertain result cannot replace or delete unresolved job data.');
        }
      }
      a.job = { ...(a.job ?? {}), ...clone(options.job), status: 'unknown', recordedAt: now() }; a.state = 'uncertain-result'; event(run, 'uncertain', { reason: options.reason, job: clone(a.job) }); return;
    }
    if (options.action === 'resolve') {
      ensure(unresolvedJob(a) && obj(options.job) && ['succeeded', 'failed', 'not-submitted'].includes(options.job.status), 'Resolve only an uncertain submission with a reconciled status.');
      declaredEvidence(options.evidence, 'reconciled');
      ensure(options.job.provider === a.job.provider && (!a.job.jobId || options.job.jobId === a.job.jobId) && (!a.job.requestId || options.job.requestId === a.job.requestId), 'Reconciliation must match the same provider/job/request.');
      a.job = { ...a.job, ...clone(options.job), resolvedAt: now(), evidence: clone(options.evidence) }; a.state = 'planned'; event(run, 'reconciled', { job: clone(a.job) }); return;
    }
    ensure(!unresolvedJob(a) && !isToken(a.state, 'uncertain-result'), 'External result is uncertain: query and reconcile the job before continuing; no automatic retry.');
    const drift = changes(root, run); ensure(!drift.length, 'Inputs/canon/governance changed; use resume with newAttempt:true and a reason, without silently reusing approvals.');
    ensure(next, 'No pending step.');
    if (options.action === 'bind-persona') {
      ensure(run.personaId === null && a.stepIndex <= 3, 'Character binding is only allowed before production when no binding exists.');
      const p = persona(root, options.personaId); run.personaId = p.id;
      run.canonBinding = isToken(p.status, 'draft') ? null : binding(p); event(run, 'persona-bound', { personaId: p.id }); return;
    }
    if (options.capabilities !== undefined) { ensure(list(options.capabilities), 'Invalid capabilities.'); run.capabilities = clone(options.capabilities); }
    if (options.action === 'skip') {
      ensure(next.step.optional && text(options.reason), 'Only an optional step can be skipped, with an explicit reason.');
      a.results.push({ stepId: next.step.id, taskId: next.task.id, status: 'skipped', at: now(), reason: options.reason, outputs: [] }); a.stepIndex++; a.state = 'planned'; event(run, 'skipped', { stepId: next.step.id, reason: options.reason });
    } else if (options.action === 'wait') {
      ensure(oneOfTokens(options.state, ['awaiting-input', 'awaiting-tool', 'in-review']) && text(options.reason), 'Waiting requires a state and reason.'); a.state = canonicalToken(options.state); event(run, 'waiting', { reason: options.reason, state: options.state });
    } else if (options.action === 'fail') {
      ensure(text(options.reason), 'Failure requires a reason.'); a.state = 'failed'; a.finishedAt = now(); event(run, 'failed', { reason: options.reason });
    } else if (options.action === 'start' || options.action === 'complete') {
      prerequisites(root, run, next.task);
      const missingCapabilities = missingTaskCapabilities(run, next.task);
      if (missingCapabilities.length) {
        a.state = 'awaiting-tool'; event(run, 'capability-missing', { capability: missingCapabilities[0], capabilities: missingCapabilities, stepId: next.step.id }); return { pending: missingCapabilities[0], missingCapabilities, note: 'No tool was called.' };
      }
      if (options.action === 'start') {
        if (options.execution !== undefined) {
          ensure(obj(options.execution) && ['instruction', 'delegated'].includes(options.execution.mode), 'Invalid execution mode.');
          if (options.execution.mode === 'delegated') ensure(text(options.execution.agentId) && text(options.execution.eventId) && text(options.execution.actor) && date(options.execution.at), 'Delegation requires an agent identifier and a declared actual event.');
          a.execution = clone(options.execution);
        } else a.execution = { mode: 'instruction' };
        if (options.job !== undefined) {
          ensure(obj(options.job) && text(options.job.provider) && next.task.deliverable === 'media', 'External planning requires a provider and generation step.');
          if (a.mediaProviders) ensure(options.job.provider === a.mediaProviders[taskMedium(run, next.task)], 'External intent must identify the selected media provider; changing a method requires an explicit new attempt.');
          a.job = { ...clone(options.job), status: 'planned', recordedAt: now() };
          event(run, 'external-attempt-planned', { job: clone(a.job), note: 'Intent recorded before submission; this module does not submit the job.' });
        }
        a.state = next.task.deliverable === 'human-decision' ? 'awaiting-input' : next.task.deliverable === 'review' ? 'in-review' : 'in-progress'; event(run, 'started', { stepId: next.step.id, execution: clone(a.execution) });
      } else {
        const outputs = checkOutputs(root, run, next.task, options);
        a.results.push({ stepId: next.step.id, taskId: next.task.id, status: 'completed', at: now(), outputs, evidence: clone(options.evidence ?? null), approval: clone(options.approval ?? null), execution: clone(a.execution ?? { mode: 'instruction' }) });
        for (const output of outputs) if (!a.inputs.some(input => input.path === output.path)) a.inputs.push(output);
        a.stepIndex++; a.state = 'planned'; a.execution = null; event(run, 'completed-step', { stepId: next.step.id, outputs });
      }
    } else throw new Error('Unknown transition action.');
    if (a.stepIndex === run.contract.workflow.steps.length) { a.state = 'completed'; a.finishedAt = now(); event(run, 'completed', { note: 'Local workflow completed with declarations and files; this does not mean publication or inspection proven by the runtime.' }); }
  });
}

export function resumeRun(root, runId, options = {}) {
  ensure(obj(options), 'Invalid resume options.');
  ensure(options.mediaProviders === undefined || options.newAttempt === true, 'Changing mediaProviders requires newAttempt:true and a reason.');
  return locked(root, runId, run => {
    const a = attempt(run), drift = changes(root, run);
    if (unresolvedJob(a) || isToken(a.state, 'uncertain-result')) { a.state = 'uncertain-result'; event(run, 'resume-held', { reason: 'Reconcile submission before repeating or creating an attempt.' }); ensure(!options.newAttempt, 'Cannot create an attempt while the external result is uncertain.'); return { needsReconciliation: true }; }
    if (options.newAttempt) {
      ensure(text(options.reason), 'A new attempt requires an explicit reason.');
      const inputs = records(root, a.inputs.map(input => input.path), run.personaId);
      a.finishedAt ??= now();
      event(run, 'superseded', { reason: options.reason, drift });
      const framework = validateFramework(root);
      ensure(framework.valid, framework.errors.join('\n'));
      const selectedProviders = mediaProviders(options.mediaProviders, a.mediaProviders ?? mediaProviders(framework.registry.defaultMediaProviders));
      const currentGovernance = [...new Set([...framework.registry.constitutionPaths, 'framework/registry.json',
        ...framework.registry.roles.map(role => role.path), ...framework.registry.tasks.map(task => task.path),
        ...framework.registry.workflows.map(flow => flow.path)])];
      // Keep the saved contract and previous attempts intact; observe current files
      // only after the caller explicitly requests a new attempt.
      run.governanceFiles = records(root, currentGovernance, null);
      run.constitutionPaths = clone(framework.registry.constitutionPaths);
      if (run.personaId) { const p = persona(root, run.personaId); run.canonBinding = isToken(p.status, 'draft') ? null : binding(p); }
      run.attempts.push(newAttempt(inputs, options.reason, selectedProviders)); event(run, 'new-attempt', { previousAttempt: a.id, drift });
      return { note: 'An explicit new attempt starts the workflow from the first step; no job was resubmitted or approval consumed.' };
    }
    if (oneOfTokens(a.state, ['completed', 'failed', 'cancelled'])) return { note: 'Finished attempt preserved; a new run requires newAttempt:true and a reason.', drift };
    if (drift.length) { a.state = 'awaiting-input'; event(run, 'drift-detected', { drift }); return { requiresNewAttempt: true }; }
    if (isToken(a.state, 'in-progress')) { a.state = 'planned'; event(run, 'resumed', { note: 'Local package resumed. Check actual execution before repeating any external action.' }); }
    return { note: 'Resume provides context; it does not execute or repeat tools.' };
  });
}
