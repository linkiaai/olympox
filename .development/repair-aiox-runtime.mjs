import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const packageName = '@aiox-squads/core';
const version = '5.4.1';
const expectedIntegrity = 'sha512-lWxAnKvQ8IlkVnHnznw6lUDowtAvcQcgumcQ2XZFgf/dceLGHoQXwmEnAzD4uS+o9zYd05MwDGMkyP8i0wzWDQ==';
const gitHead = '70456b3203ba03d8e0724f22c78d6311f7ad5b85';
const internalDir = path.join(root, '.aiox-core');
const internalManifestPath = path.join(internalDir, 'package.json');
assertSafeTarget(internalDir);
assertSafeTarget(internalManifestPath);
assertSafeTarget(path.join(internalDir, 'package-lock.json'));
assertSafeTarget(path.join(internalDir, 'node_modules'));
const internal = JSON.parse(fs.readFileSync(internalManifestPath, 'utf8'));
if (internal.name !== '@aiox-squads/core-internal' || internal.version !== version) {
  throw new Error(`Install the official AIOX ${version} internal runtime before repairing it.`);
}
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const sourceDir = path.join(root, '.development/state/tooling-source');
const reportPath = path.join(root, '.development/state/tooling-runtime-repair.json');
const protectedPaths = ['package.json', 'package-lock.json', 'AGENTS.md', 'CLAUDE.md', '.aiox-core/core-config.yaml'];
const snapshot = () => Object.fromEntries(protectedPaths.map(p => [p, fs.existsSync(path.join(root, p)) ? hash(fs.readFileSync(path.join(root, p))) : null]));
const before = snapshot();
function assertSafeTarget(target) {
  const relative = path.relative(root, target);
  if (relative.startsWith('..') || path.isAbsolute(relative)) throw new Error('Target leaves development checkout');
  let current = root;
  if (fs.lstatSync(current).isSymbolicLink()) throw new Error('Linked checkout is unsupported');
  for (const part of relative.split(path.sep)) {
    current = path.join(current, part);
    let stat;
    try { stat = fs.lstatSync(current); } catch (error) { if (error.code !== 'ENOENT' && error.code !== 'ENOTDIR') throw error; }
    if (stat?.isSymbolicLink()) throw new Error(`Linked target is unsupported: ${current}`);
  }
}
assertSafeTarget(sourceDir);
assertSafeTarget(reportPath);
assertSafeTarget(path.join(sourceDir, 'npm-pack.json'));
fs.mkdirSync(sourceDir, {recursive: true});
const archive = path.join(sourceDir, 'aiox-squads-core-5.4.1.tgz');
assertSafeTarget(archive);
function runNpm(args, cwd) {
  const result = process.platform === 'win32'
    ? execFileSync(process.env.ComSpec || 'cmd.exe', ['/d', '/s', '/c', 'npm.cmd', ...args], {cwd, encoding:'utf8', windowsHide:true, maxBuffer:16*1024*1024})
    : execFileSync('npm', args, {cwd, encoding:'utf8', maxBuffer:16*1024*1024});
  return result;
}
if (!fs.existsSync(archive)) {
  const raw = runNpm(['pack', `${packageName}@${version}`, '--ignore-scripts', '--json', '--pack-destination', '.development/state/tooling-source'], root);
  const info = JSON.parse(raw)[0];
  if (info.name !== packageName || info.version !== version || info.filename !== path.basename(archive)) throw new Error('Unexpected npm package');
  fs.writeFileSync(path.join(sourceDir, 'npm-pack.json'), JSON.stringify([info], null, 2)+'\n');
}
const archiveBytes = fs.readFileSync(archive);
const integrity = 'sha512-'+crypto.createHash('sha512').update(archiveBytes).digest('base64');
if (integrity !== expectedIntegrity) throw new Error('Official AIOX archive integrity mismatch');
const readArchive = p => execFileSync('tar', ['-xOf', archive, `package/${p}`], {maxBuffer:16*1024*1024});
const officialInternal = JSON.parse(readArchive('.aiox-core/package.json'));
if (officialInternal.version !== version) throw new Error('Archive version mismatch');
const files = ['.aiox-core/quality/metrics-collector.js', '.aiox-core/quality/metrics-hook.js', '.aiox-core/quality/seed-metrics.js', '.aiox-core/quality/schemas/quality-metrics.schema.json'];
const review = files.map(p => {
  const bytes = readArchive(p);
  const target = path.join(root, p);
  assertSafeTarget(target);
  const existed = fs.existsSync(target);
  if (existed && !fs.readFileSync(target).equals(bytes)) throw new Error(`Existing local source conflicts with official bytes: ${p}`);
  return {path:p, target, bytes, sha256:hash(bytes), existed};
});
const licensePath = path.join(sourceDir, 'AIOX-LICENSE');
const license = readArchive('LICENSE');
assertSafeTarget(licensePath);
if (fs.existsSync(licensePath) && !fs.readFileSync(licensePath).equals(license)) throw new Error('Existing AIOX license differs from official source');
const requirements = {'ajv-formats':'3.0.1', handlebars:'4.7.8'};
const require = createRequire(internalManifestPath);
const missingDependencies = [];
for (const [name, exact] of Object.entries(requirements)) {
  assertSafeTarget(path.join(internalDir, 'node_modules', name));
  assertSafeTarget(path.join(internalDir, 'node_modules', name, 'package.json'));
  let installed;
  try {
    const metadataPath = require.resolve(`${name}/package.json`);
    const modulesRoot = path.join(internalDir, 'node_modules')+path.sep;
    if (metadataPath.startsWith(modulesRoot)) installed = require(metadataPath).version;
  } catch (error) { if (error.code !== 'MODULE_NOT_FOUND') throw error; }
  const declared = internal.dependencies?.[name];
  if (installed && installed !== exact) throw new Error(`Existing ${name} ${installed} differs from reviewed ${exact}`);
  if (declared && declared !== exact) throw new Error(`Existing declaration for ${name} differs from reviewed ${exact}`);
  if (!installed || !declared) missingDependencies.push(`${name}@${exact}`);
}
for (const f of review) {
  if (!f.existed) {
    fs.mkdirSync(path.dirname(f.target), {recursive:true});
    fs.writeFileSync(f.target, f.bytes, {flag:'wx'});
  }
}
if (!fs.existsSync(licensePath)) fs.writeFileSync(licensePath, license, {flag:'wx'});
if (missingDependencies.length) {
  // Run only inside the private AIOX internal package; lifecycle scripts disabled.
  runNpm(['install', '--ignore-scripts', '--no-audit', '--no-fund', '--save-exact', ...missingDependencies], internalDir);
}
const previous = fs.existsSync(reportPath) ? JSON.parse(fs.readFileSync(reportPath, 'utf8')) : null;
const after = snapshot();
const event = {
  at:new Date().toISOString(),
  action:'Verified and restored the pinned official AIOX quality runtime; dependencies remain scoped to its internal package.',
  restored:review.filter(f=>!f.existed).map(f=>f.path),
  installed:missingDependencies,
  protectedFilesBefore:before,
  protectedFilesAfter:after,
  protectedFilesUnchanged:Object.keys(before).every(p=>before[p]===after[p])
};
const report = {
  ...previous,
  objective:'Repair isolated AIOX development tooling without changing OLYMPOX product sources or dependencies.',
  status:previous?.status || 'runtime_repaired_pending_checks',
  upstream:{package:packageName,version,repository:'https://github.com/SynkraAI/aiox-core',gitHead,tarball:'https://registry.npmjs.org/@aiox-squads/core/-/core-5.4.1.tgz',integrity,sha256:hash(archiveBytes),license:'MIT',licenseFile:'.development/state/tooling-source/AIOX-LICENSE',licenseSha256:hash(license)},
  restoredFiles:review.map(({path:p,sha256,existed})=>({path:p,sha256,existed})),
  dependencyChanges:Object.entries(requirements).map(([name,exact])=>({name,installed:exact,scope:'.aiox-core'})),
  cliBridge:'.development/aiox-cli.cjs',
  cliEntryPointNote:'The upstream .aiox-core/cli/index.js is export-only. Direct node invocation exits without parsing flags; the local bridge invokes createProgram and reports the internal package version.',
  events:[...(previous?.events || []),event]
};
if (!event.protectedFilesUnchanged) report.status = 'preservation_change_detected';
fs.writeFileSync(reportPath, JSON.stringify(report,null,2)+'\n');
if (!event.protectedFilesUnchanged) throw new Error('Protected product or config files changed during repair; inspect concurrent edits before continuing.');
console.log(JSON.stringify({version,restored:event.restored,installed:missingDependencies,protectedFilesUnchanged:event.protectedFilesUnchanged,report:'.development/state/tooling-runtime-repair.json'},null,2));
