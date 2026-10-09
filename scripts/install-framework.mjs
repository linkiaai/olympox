#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { assistantTargets, parseAssistantOption } from './assistant-targets.mjs';

const rootFiles = ['CONSTITUTION.md', 'README.md', 'package.json', 'LICENSE'];
const sourceDirectories = ['bin', 'framework', 'scripts', 'skills', 'docs', 'templates', 'tests', 'vendor'];
const manualFiles = ['docs-site/README.md', 'docs-site/config.json'];
const manualDirectories = ['docs-site/locales', 'docs-site/src'];
const activeSkills = ['olympox', 'higgsfield-studio'];
const substitutedSources = new Set(['docs/locales/pt-BR/AGENTS.md']);
const excludedNames = new Set(['.git', '.agents', '.claude', 'node_modules', 'work', 'tmp', 'tools', 'dist', 'backups', 'personas', 'influencers']);
const sourceExtensions = new Set(['.md', '.mjs', '.js', '.json', '.yaml', '.yml', '.html', '.css', '.svg']);
const manualImages = new Set(['docs-site/src/olympox-logo.png', 'docs-site/src/olympox-icon.png']);

function statIfPresent(file) {
  try { return fs.lstatSync(file); }
  catch (error) { if (error.code === 'ENOENT') return null; throw error; }
}

function inInstallationScope(scope, operation) {
  try { return operation(); }
  catch (error) {
    if (error instanceof Error) error.installationScope = scope;
    throw error;
  }
}

function inside(root, file) {
  const relative = path.relative(root, file);
  return relative === '' || (!path.isAbsolute(relative) && relative !== '..' && !relative.startsWith(`..${path.sep}`));
}

function assertDirectoryPath(directory) {
  const absolute = path.resolve(directory);
  const parsed = path.parse(absolute);
  let current = parsed.root;
  for (const segment of absolute.slice(parsed.root.length).split(path.sep).filter(Boolean)) {
    current = path.join(current, segment);
    const stat = statIfPresent(current);
    if (stat?.isSymbolicLink()) throw new Error(`Links and junctions are not permitted: ${current}`);
    if (stat && !stat.isDirectory()) throw new Error(`Expected a directory: ${current}`);
  }
  return absolute;
}

function sourcePath(root, relative, expectedType) {
  const file = path.resolve(root, relative);
  if (!inside(root, file) || file === root) throw new Error(`Source path is outside the framework: ${relative}`);
  assertDirectoryPath(path.dirname(file));
  const stat = statIfPresent(file);
  if (!stat) throw new Error(`Framework source is missing: ${relative}`);
  if (stat.isSymbolicLink()) throw new Error(`Links and junctions are not permitted: ${relative}`);
  if (expectedType === 'file' ? !stat.isFile() : !stat.isDirectory()) throw new Error(`Invalid framework source: ${relative}`);
  if (!inside(root, fs.realpathSync(file))) throw new Error(`Source path is outside the framework: ${relative}`);
  return file;
}

function validateRelative(relative) {
  if (path.isAbsolute(relative) || relative.includes('\\') || relative.includes(':') || relative.split('/').some(part =>
    !part || part === '.' || part === '..' || /[. ]$/.test(part) || /^(con|prn|aux|nul|com[0-9]|lpt[0-9])(?:\.|$)/i.test(part))) {
    throw new Error(`Unsafe framework filename: ${relative}`);
  }
}

function inventory(sourceRoot, targets) {
  const files = new Map();
  const names = new Set();
  function add(sourceRelative, destinationRelative = sourceRelative) {
    validateRelative(sourceRelative); validateRelative(destinationRelative);
    const normalized = destinationRelative.toLowerCase();
    if (names.has(normalized)) throw new Error(`Duplicate framework destination: ${destinationRelative}`);
    const file = sourcePath(sourceRoot, sourceRelative, 'file');
    names.add(normalized);
    files.set(destinationRelative, { bytes: fs.readFileSync(file), mode: fs.statSync(file).mode & 0o777 });
  }
  function walk(relative) {
    const directory = sourcePath(sourceRoot, relative, 'directory');
    for (const entry of fs.readdirSync(directory, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      if (excludedNames.has(entry.name) || entry.name.startsWith('.')) continue;
      const child = `${relative}/${entry.name}`;
      if (substitutedSources.has(child)) continue;
      const stat = fs.lstatSync(path.join(directory, entry.name));
      if (stat.isSymbolicLink()) throw new Error(`Links and junctions are not permitted: ${child}`);
      if (stat.isDirectory()) walk(child);
      else if (stat.isFile() && (sourceExtensions.has(path.extname(entry.name)) || manualImages.has(child) || ['LICENSE', 'project.gitignore', 'project.gitattributes'].includes(entry.name))) add(child);
      else if (!stat.isFile()) throw new Error(`Unsupported framework source: ${child}`);
    }
  }
  for (const relative of rootFiles) add(relative);
  add('templates/studio-AGENTS.md', 'AGENTS.md');
  if (targets.some(target => target.name === 'claude')) add('templates/studio-CLAUDE.md', 'CLAUDE.md');
  add('templates/locales/pt-BR/studio-AGENTS.md', 'docs/locales/pt-BR/AGENTS.md');
  add(statIfPresent(path.join(sourceRoot, '.gitignore')) ? '.gitignore' : 'templates/project.gitignore', '.gitignore');
  add(statIfPresent(path.join(sourceRoot, ".gitattributes")) ? ".gitattributes" : "templates/project.gitattributes", ".gitattributes");
  for (const relative of sourceDirectories) walk(relative);
  for (const relative of manualFiles) add(relative);
  for (const relative of manualDirectories) walk(relative);
  add('influencers/README.md');
  for (const target of targets) {
    for (const name of activeSkills) {
      for (const relative of target.files) add(`skills/${name}/${relative}`, `${target.skillRoot}/${name}/${relative}`);
    }
  }
  return new Map([...files].sort(([a], [b]) => a.localeCompare(b)));
}

function targetPath(targetRoot, relative) {
  validateRelative(relative);
  const target = path.resolve(targetRoot, relative);
  if (!inside(targetRoot, target) || target === targetRoot) throw new Error(`Destination path is outside the studio: ${relative}`);
  assertDirectoryPath(path.dirname(target));
  const stat = statIfPresent(target);
  if (stat?.isSymbolicLink()) throw new Error(`Links and junctions are not permitted: ${relative}`);
  return { target, stat };
}

function prepareInstall(sourceRoot, targetRoot, { merge = false, assistant = 'codex' } = {}) {
  if (typeof sourceRoot !== 'string' || !sourceRoot || typeof targetRoot !== 'string' || !targetRoot) throw new Error('Provide source and destination directories.');
  if (typeof merge !== 'boolean') throw new Error('The merge option must be a boolean.');
  const targets = assistantTargets(assistant);
  const source = inInstallationScope('source', () => {
    const directory = assertDirectoryPath(sourceRoot);
    if (!statIfPresent(directory)?.isDirectory()) throw new Error('Framework source directory does not exist.');
    return directory;
  });
  // Validate the package first: choosing another destination cannot repair missing or unsafe sources.
  const files = inInstallationScope('source', () => inventory(source, targets));
  const target = inInstallationScope('destination', () => {
    const directory = assertDirectoryPath(targetRoot);
    if (inside(directory, source)) throw new Error('The destination cannot contain the framework source.');
    if (inside(source, directory)) {
      const top = path.relative(source, directory).split(path.sep)[0];
      if ([...sourceDirectories, 'docs-site', 'influencers', '.agents', '.claude'].includes(top)) throw new Error('The destination cannot be inside a framework source directory.');
    }
    if (!merge && statIfPresent(directory) && fs.readdirSync(directory).some(name => name !== '.git')) {
      throw new Error('Destination is not empty. Use --merge to retain identical framework files; differing files are never overwritten.');
    }
    return directory;
  });

  const pending = [];
  const retained = [];
  const reviewedFiles = [];
  // Validate every collision before creating the destination or writing any file.
  inInstallationScope('destination', () => {
    for (const [relative, data] of files) {
      const destination = targetPath(target, relative);
      if (destination.stat) {
        if (!destination.stat.isFile() || !fs.readFileSync(destination.target).equals(data.bytes)) throw new Error(`Destination conflict: ${relative}. Nothing was written; existing files are never overwritten.`);
        retained.push(relative);
      } else pending.push({ relative, ...data });
      reviewedFiles.push({ relative, sha256: createHash('sha256').update(data.bytes).digest('hex'), mode: data.mode, disposition: destination.stat ? 'retain' : 'copy' });
    }
  });
  const context = { sourceRoot: source, targetRoot: target, assistant, merge };
  const planHash = createHash('sha256').update(JSON.stringify({ ...context, files: reviewedFiles })).digest('hex');
  return { summary: { ...context, copied: pending.map(item => item.relative), retained, fileCount: files.size, planHash }, pending };
}

/** Preview the complete intended installation without creating directories or exposing source bytes. */
export function planFrameworkInstall(sourceRoot, targetRoot, options = {}) {
  return prepareInstall(sourceRoot, targetRoot, options).summary;
}

/** Install reusable sources without overwriting files; optionally require the exact reviewed plan. */
export function installFramework(sourceRoot, targetRoot, { merge = false, assistant = 'codex', expectedPlanHash } = {}) {
  if (expectedPlanHash !== undefined && (typeof expectedPlanHash !== 'string' || !/^[a-f0-9]{64}$/.test(expectedPlanHash))) throw new Error('expectedPlanHash must be a lowercase SHA-256 installation plan hash.');
  const { summary, pending } = prepareInstall(sourceRoot, targetRoot, { merge, assistant });
  if (expectedPlanHash !== undefined && expectedPlanHash !== summary.planHash) throw new Error('Installation plan changed since review. Nothing was written; preview the current source, destination, and options again.');
  const target = summary.targetRoot;
  inInstallationScope('destination', () => {
    fs.mkdirSync(target, { recursive: true });
    for (const { relative, bytes, mode } of pending) {
      const destination = targetPath(target, relative);
      fs.mkdirSync(path.dirname(destination.target), { recursive: true });
      targetPath(target, relative);
      fs.writeFileSync(destination.target, bytes, { flag: 'wx', mode });
    }
  });
  return { targetRoot: target, assistant, copied: summary.copied, retained: summary.retained };
}

function main() {
  const args = process.argv.slice(2);
  if (args.length === 1 && ['--help', '-h'].includes(args[0])) {
    console.log('OLYMPOX installer\n\nnode scripts/install-framework.mjs [directory] [--merge] [--assistant codex|claude|both]\n\nDefault directory: .\nDefault assistant: codex. Claude Code uses CLAUDE.md and .claude/skills; both installs both projections.\nInstalls reusable framework sources and local skills. Existing files are never overwritten.\n--merge retains identical framework files and refuses differences before writing.');
    return;
  }
  const { assistant, remaining } = parseAssistantOption(args);
  const positional = remaining.filter(arg => !arg.startsWith('-'));
  if (positional.length > 1 || remaining.some(arg => arg.startsWith('-') && arg !== '--merge') || remaining.filter(arg => arg === '--merge').length > 1) throw new Error('Use node scripts/install-framework.mjs [directory] [--merge] [--assistant codex|claude|both].');
  const sourceRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const result = installFramework(sourceRoot, path.resolve(positional[0] ?? '.'), { merge: remaining.includes('--merge'), assistant });
  console.log(`OLYMPOX installed: ${result.targetRoot}\nAssistant: ${assistant}. Copied ${result.copied.length} files; retained ${result.retained.length} identical files.\nRun npm run verify in the installed directory.`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { main(); }
  catch (error) { console.error(error.message); process.exitCode = 1; }
}
