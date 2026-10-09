#!/usr/bin/env node
import { canonicalToken, isToken } from './language-compat.mjs';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { assistantTargets } from './assistant-targets.mjs';
import { assertSlug, readJson, localFile, fileHash, canonHash, validatePersona, validateAssets, buildPrompt, registerAsset, snapshotCanon, sealExecution, migrateAssets } from './studio-core.mjs';
import { createPersona } from './storage-core.mjs';
import { backupPersona, verifyBackup, restoreBackup, testRestore } from './backup-core.mjs';
import { validateFramework, startRun, readRun, transitionRun, resumeRun } from './framework-core.mjs';
import { saveNarrative, readNarrative, saveContent, validateEditorial } from './editorial-core.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const people = path.join(root, 'influencers');
const args = process.argv.slice(2);
const [command = 'help', slug, value, type] = args;

function folder(id) {
  assertSlug(id);
  const dir = path.join(people, id);
  if (!fs.existsSync(dir)) throw new Error(`Character does not exist: ${id}.`);
  if (!fs.realpathSync(dir).startsWith(fs.realpathSync(people) + path.sep)) throw new Error('Character directory is outside the studio.');
  return dir;
}
function load(id) {
  const dir = folder(id);
  for (const file of ['persona.json', 'brief.md', 'decisions.md', 'assets.json']) {
    try { localFile(dir, file); } catch(e) { throw new Error(`Character ${id} is incomplete: ${file}. ${e.message}`); }
  }
  const persona = readJson(path.join(dir, 'persona.json'));
  if (persona.id !== id) throw new Error('persona.id differs from the directory.');
  return { dir, persona };
}
function slugs() {
  return fs.readdirSync(people, { withFileTypes: true }).filter(entry => entry.isDirectory() && !entry.name.startsWith('.')).map(entry => entry.name).sort();
}
function validate(id) {
  const { dir, persona } = load(id);
  const result = validatePersona(persona, dir);
  const manifest = readJson(localFile(dir, 'assets.json'));
  if (!result.errors.length) result.errors.push(...validateAssets(manifest, persona, dir));
  if (manifest.schemaVersion === 1 || Array.isArray(manifest.assets) && manifest.assets.some(asset => asset.recordVersion === 1 && isToken(asset.status, 'production'))) {
    result.warnings.push('Legacy records preserved; old approval does not contain a complete 0.2 execution seal. Do not invent a new review.');
  }
  const editorial = validateEditorial(dir, persona);
  result.errors.push(...editorial.errors); result.warnings.push(...editorial.warnings);
  for (const warning of result.warnings) console.log(`WARNING ${id}: ${warning}`);
  for (const error of result.errors) console.error(`ERROR ${id}: ${error}`);
  if (result.errors.length) process.exitCode = 1;
  else console.log(`OK ${id}: records are consistent; this command does not verify visual quality.`);
}

try {
  if (command === 'new') {
    const { dir } = createPersona(root, slug);
    console.log(`Created as a draft: ${dir}\nFill in brief.md and persona.json before generating references.`);
  } else if (command === 'list') {
    for (const id of slugs()) { const { persona } = load(id); console.log(`${id}\t${canonicalToken(persona.status)}\t${persona.profile?.name || '(name to define)'}`); }
    if (!slugs().length) console.log('No characters created.');
  } else if (command === 'validate') {
    const ids = slug ? [slug] : slugs();
    if (!ids.length) console.log('No characters: structure prepared, without media or approved identity.');
    for (const id of ids) { try { validate(id); } catch (e) { console.error(`ERROR ${id}: ${e.message}`); process.exitCode = 1; } }
  } else if (command === 'prompt') {
    const { persona, dir } = load(slug);
    if (!value) throw new Error('Provide a shot.json file.');
    process.stdout.write(buildPrompt(persona, readJson(path.resolve(value)), dir));
  } else if (command === 'canon-hash') {
    const { persona, dir } = load(slug), result = validatePersona(persona, dir);
    // Allows hashing before registering approval while still checking structure.
    const errors = result.errors.filter(error => !error.startsWith('Approval'));
    if (errors.length) throw new Error(errors.join('\n'));
    console.log(canonHash(persona));
  } else if (command === 'canon-snapshot') {
    const { persona, dir } = load(slug);
    console.log(JSON.stringify(snapshotCanon(persona, dir), null, 2));
  } else if (command === 'execution-seal') {
    const { persona, dir } = load(slug);
    console.log(JSON.stringify(sealExecution(persona, dir, value), null, 2));
  } else if (command === 'migrate-assets') {
    const { persona, dir } = load(slug);
    console.log(JSON.stringify(migrateAssets(persona, dir), null, 2));
  } else if (command === 'narrative-save') {
    const { persona, dir } = load(slug);
    if (!value) throw new Error('Provide a narrative file.');
    const input = readJson(path.resolve(value));
    console.log(JSON.stringify(saveNarrative(dir, persona, input.data ?? input, input.review ?? null), null, 2));
  } else if (command === 'narrative-show') {
    console.log(JSON.stringify(readNarrative(folder(slug), value ? Number(value) : undefined), null, 2));
  } else if (command === 'content-save') {
    const { persona, dir } = load(slug);
    if (!value) throw new Error('Provide a content file.');
    console.log(JSON.stringify(saveContent(dir, persona, readJson(path.resolve(value))), null, 2));
  } else if (command === 'run-start') {
    if (!value) throw new Error('Provide a workflow and specification file.');
    console.log(JSON.stringify(startRun(root, { ...readJson(path.resolve(value)), workflowId: slug }), null, 2));
  } else if (command === 'run-status') {
    console.log(JSON.stringify(readRun(root, slug), null, 2));
  } else if (command === 'run-step') {
    if (!value) throw new Error('Provide a transition file.');
    console.log(JSON.stringify(transitionRun(root, slug, readJson(path.resolve(value))), null, 2));
  } else if (command === 'run-resume') {
    console.log(JSON.stringify(resumeRun(root, slug, value ? readJson(path.resolve(value)) : {}), null, 2));
  } else if (command === 'backup') {
    console.log(JSON.stringify(backupPersona(root, slug), null, 2));
  } else if (command === 'backup-verify') {
    const checked = verifyBackup(root, slug);
    console.log(JSON.stringify({ backupId: checked.backupId, characterId: checked.characterId, files: checked.files, verified: true }, null, 2));
  } else if (command === 'backup-test') {
    console.log(JSON.stringify(testRestore(root, slug), null, 2));
  } else if (command === 'restore') {
    console.log(JSON.stringify(restoreBackup(root, slug), null, 2));
  } else if (command === 'file-hash') {
    console.log(fileHash(folder(slug), value));
  } else if (command === 'check-assets') {
    validate(slug);
  } else if (command === 'register') {
    const { persona, dir } = load(slug);
    registerAsset(persona, dir, value, type);
    console.log(`Registered as a draft: ${value}. Fill in origin, prompt, and references; review before approval.`);
  } else if (command === 'doctor') {
    const required = ['AGENTS.md', 'CONSTITUTION.md', 'README.md', 'framework/registry.json', 'templates/brief.md', 'templates/persona.json', 'templates/shot.json', 'templates/narrative.json', 'templates/content.json', 'templates/opportunity-research.md', 'templates/content-research.md', 'docs/studio-team.md', 'docs/trend-research.md', 'docs/framework-02.md', 'docs/strategy.md', 'docs/production.md', 'docs/quality.md', 'docs/tools.md', 'docs/integrated-images.md', 'docs/higgsfield-plugin.md', 'docs/operations.md', 'docs/video-reference.md'];
    const missing = required.filter(file => !fs.existsSync(path.join(root, file)));
    if (missing.length) { console.error(`Missing files: ${missing.join(', ')}`); process.exitCode = 1; }
    else {
      const hosts = assistantTargets('both').filter(target => ['olympox', 'higgsfield-studio'].some(skill => fs.existsSync(path.join(root, target.skillRoot, skill))));
      if (!hosts.length) { console.error('No active olympox skill: install a Codex or Claude Code projection from canonical skills.'); process.exitCode = 1; }
      const verified = [];
      for (const target of hosts) {
        const skills = ['olympox'];
        if (fs.existsSync(path.join(root, target.skillRoot, 'higgsfield-studio'))) skills.push('higgsfield-studio');
        for (const skill of skills) {
          for (const file of target.files) {
            const source = path.join(root, 'skills', skill, file);
            const installed = path.join(root, target.skillRoot, skill, file);
            if (!fs.existsSync(source) || !fs.existsSync(installed) || !fs.readFileSync(source).equals(fs.readFileSync(installed))) {
              console.error(`Skill differs: ${target.name}/${skill}/${file}.`); process.exitCode = 1;
            }
          }
          verified.push(`${target.name}/${skill}`);
        }
        if (target.name === 'claude') {
          const bridge = path.join(root, 'CLAUDE.md');
          if (!fs.existsSync(bridge) || !/^@AGENTS\.md\s*$/m.test(fs.readFileSync(bridge, 'utf8'))) {
            console.error('Claude Code instructions must import the studio AGENTS.md from CLAUDE.md.'); process.exitCode = 1;
          }
        }
      }
      const framework = validateFramework(root);
      for (const error of framework.errors) { console.error(`Framework: ${error}`); process.exitCode = 1; }
      if (!process.exitCode) console.log(`OK local base: instructions, templates, and guides present; skills match: ${verified.join(', ')}.`);
    }
    console.log(`Node ${process.version}; no external dependencies required to operate records.`);
    console.log('New influencers: default to the Higgsfield media workflow; follow docs/higgsfield-influencer-method.md. Codex or Claude Code coordinates concept, writing and records. Respect explicit method/provider choices; missing capabilities leave stages pending.');
    console.log('Media providers: new runs default image, video and audio to higgsfield. Explicit exceptions belong in the run specification; changed methods on resumption require a new attempt and reason.');
    console.log('Higgsfield plugin/MCP: verify the required modules, reference upload, export, account and cost in the current host. This diagnostic does not test a connection or provider tools.');
    console.log('Higgsfield CLI: another verified connection route; check installation/integrity with node scripts/higgsfield-local.mjs doctor. This diagnostic does not query account, credits, or generation.');
    console.log('Assistant images: an explicit alternative only; never replace a missing Higgsfield stage silently. Follow docs/integrated-images.md when selected.');
    console.log('QA: structural verification does not demonstrate identity, audio, or movement.');
  } else if (command === 'help') {
    console.log(`OLYMPOX ${JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8')).version} - AI Influencer framework. Local coordination by Codex or Claude Code; default media production in Higgsfield.\n\nnode scripts/studio.mjs new <slug>\nnode scripts/studio.mjs list\nnode scripts/studio.mjs validate [slug]\nnode scripts/studio.mjs prompt <slug> <shot.json>\nnode scripts/studio.mjs canon-hash <slug>\nnode scripts/studio.mjs canon-snapshot <slug>\nnode scripts/studio.mjs file-hash <slug> <relative-file>\nnode scripts/studio.mjs register <slug> <relative-file> <image|video|audio>\nnode scripts/studio.mjs execution-seal <slug> <asset-id>\nnode scripts/studio.mjs migrate-assets <slug>\nnode scripts/studio.mjs narrative-save <slug> <input.json>\nnode scripts/studio.mjs narrative-show <slug> [version]\nnode scripts/studio.mjs content-save <slug> <input.json>\nnode scripts/studio.mjs run-start <workflow-id> <spec.json>\nnode scripts/studio.mjs run-status <run-id>\nnode scripts/studio.mjs run-step <run-id> <transition.json>\nnode scripts/studio.mjs run-resume <run-id> [resume.json]\nnode scripts/studio.mjs backup <slug>\nnode scripts/studio.mjs backup-verify <backup-id>\nnode scripts/studio.mjs backup-test <backup-id>\nnode scripts/studio.mjs restore <backup-id>\nnode scripts/studio.mjs check-assets <slug>\nnode scripts/studio.mjs doctor\n\nRun specifications default mediaProviders.image, video and audio to higgsfield. Explicit exceptions must be declared in the specification. A changed route requires run-resume with newAttempt: true and a reason. Read docs/operations.md and docs/framework-02.md. No paid calls or automatic publication.\n`);
  } else throw new Error(`Unknown command: ${command}. Use help.`);
} catch (error) { console.error(error.message); process.exitCode = 1; }
