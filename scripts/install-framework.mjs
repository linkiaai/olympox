#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootFiles = ['CONSTITUTION.md', 'README.md', 'package.json', 'LICENSE'];
const sourceDirectories = ['bin', 'framework', 'scripts', 'skills', 'docs', 'templates', 'tests', 'vendor'];
const manualFiles = ['docs-site/README.md', 'docs-site/config.json'];
const manualDirectories = ['docs-site/locales', 'docs-site/src'];
const activeSkills = ['olympox', 'higgsfield-studio'];
const substitutedSources = new Set(['docs/locales/pt-BR/AGENTS.md']);
const excludedNames = new Set(['.git', '.agents', 'node_modules', 'work', 'tmp', 'tools', 'dist', 'backups', 'personas', 'influencers']);
const sourceExtensions = new Set(['.md', '.mjs', '.js', '.json', '.yaml', '.yml', '.html', '.css', '.svg']);
const manualImages = new Set(['docs-site/src/olympox-logo.png', 'docs-site/src/olympox-icon.png']);

function statIfPresent(file) {
  try { return fs.lstatSync(file); }
  catch (error) { if (error.code === 'ENOENT') return null; throw error; }
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

function inventory(sourceRoot) {
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
  add('templates/locales/pt-BR/studio-AGENTS.md', 'docs/locales/pt-BR/AGENTS.md');
  add(statIfPresent(path.join(sourceRoot, '.gitignore')) ? '.gitignore' : 'templates/project.gitignore', '.gitignore');
  add(statIfPresent(path.join(sourceRoot, ".gitattributes")) ? ".gitattributes" : "templates/project.gitattributes", ".gitattributes");
  for (const relative of sourceDirectories) walk(relative);
  for (const relative of manualFiles) add(relative);
  for (const relative of manualDirectories) walk(relative);
  add('influencers/README.md');
  for (const name of activeSkills) {
    for (const relative of ['SKILL.md', 'agents/openai.yaml']) add(`skills/${name}/${relative}`, `.agents/skills/${name}/${relative}`);
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

/** Install reusable sources without overwriting a destination file or importing local studio state. */
export function installFramework(sourceRoot, targetRoot, { merge = false } = {}) {
  if (typeof sourceRoot !== 'string' || !sourceRoot || typeof targetRoot !== 'string' || !targetRoot) throw new Error('Provide source and destination directories.');
  if (typeof merge !== 'boolean') throw new Error('The merge option must be a boolean.');
  const source = assertDirectoryPath(sourceRoot);
  if (!statIfPresent(source)?.isDirectory()) throw new Error('Framework source directory does not exist.');
  const target = assertDirectoryPath(targetRoot);
  if (inside(target, source)) throw new Error('The destination cannot contain the framework source.');
  if (inside(source, target)) {
    const top = path.relative(source, target).split(path.sep)[0];
    if ([...sourceDirectories, 'docs-site', 'influencers', '.agents'].includes(top)) throw new Error('The destination cannot be inside a framework source directory.');
  }
  if (!merge && statIfPresent(target) && fs.readdirSync(target).some(name => name !== '.git')) {
    throw new Error('Destination is not empty. Use --merge to retain identical framework files; differing files are never overwritten.');
  }

  const files = inventory(source);
  const pending = [];
  const retained = [];
  // Validate every collision before creating the destination or writing any file.
  for (const [relative, data] of files) {
    const destination = targetPath(target, relative);
    if (destination.stat) {
      if (!destination.stat.isFile() || !fs.readFileSync(destination.target).equals(data.bytes)) throw new Error(`Destination conflict: ${relative}. Nothing was written; existing files are never overwritten.`);
      retained.push(relative);
    } else pending.push({ relative, ...data });
  }
  fs.mkdirSync(target, { recursive: true });
  for (const { relative, bytes, mode } of pending) {
    const destination = targetPath(target, relative);
    fs.mkdirSync(path.dirname(destination.target), { recursive: true });
    targetPath(target, relative);
    fs.writeFileSync(destination.target, bytes, { flag: 'wx', mode });
  }
  return { targetRoot: target, copied: pending.map(item => item.relative), retained };
}

function main() {
  const args = process.argv.slice(2);
  if (args.length === 1 && ['--help', '-h'].includes(args[0])) {
    console.log('OLYMPOX installer\n\nnode scripts/install-framework.mjs [directory] [--merge]\n\nDefault directory: .\nInstalls reusable framework sources and local skills. Existing files are never overwritten.\n--merge retains identical framework files and refuses differences before writing.');
    return;
  }
  const positional = args.filter(arg => !arg.startsWith('-'));
  if (positional.length > 1 || args.some(arg => arg.startsWith('-') && arg !== '--merge') || args.filter(arg => arg === '--merge').length > 1) throw new Error('Use node scripts/install-framework.mjs [directory] [--merge].');
  const sourceRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const result = installFramework(sourceRoot, path.resolve(positional[0] ?? '.'), { merge: args.includes('--merge') });
  console.log(`OLYMPOX installed: ${result.targetRoot}\nCopied ${result.copied.length} files; retained ${result.retained.length} identical files.\nRun npm run verify in the installed directory.`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { main(); }
  catch (error) { console.error(error.message); process.exitCode = 1; }
}
