#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

// This preparation wrapper intentionally has no generation, upload, training,
// publishing, token-printing, install, or update route.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const cliRoot = path.join(root, 'tools', 'higgsfield', 'node_modules', '@higgsfield', 'cli');
const pinnedVersion = '1.1.26';
const pinnedWindowsBinarySha256 = '0e973c9cf072ec27af8be61e374c8aba5842766bd21654e28dfa758605ca76da';
const routes = new Set([
  'auth', 'auth login', 'account', 'account status', 'account transactions',
  'workspace', 'workspace list', 'workspace status', 'model', 'model list', 'model get',
  'workflow', 'workflow list', 'workflow get', 'voices', 'voices list', 'voices get',
  'generate', 'generate create', 'generate cost', 'generate get', 'generate list', 'generate wait',
  'generate workflow', 'soul-id', 'soul-id create', 'upload', 'upload create',
]);

function binary() {
  const packageFile = path.join(cliRoot, 'package.json');
  if (!fs.existsSync(packageFile)) throw new Error('Local CLI is missing. Follow docs/higgsfield-setup.md; the wrapper does not install tools automatically.');
  const pkg = JSON.parse(fs.readFileSync(packageFile, 'utf8'));
  if (pkg.name !== '@higgsfield/cli' || pkg.version !== pinnedVersion) throw new Error(`Local version differs; expected @higgsfield/cli ${pinnedVersion}. Review the installation before updating the pin.`);
  if (process.platform !== 'win32' || process.arch !== 'x64') throw new Error('This setup was verified on Windows x64. Inspect your platform distribution before adapting the wrapper.');
  const exe = path.join(cliRoot, 'vendor', 'hf.exe');
  if (!fs.existsSync(exe)) throw new Error('Package is present, but the binary is not installed. See the inspected installation procedure.');
  const digest = crypto.createHash('sha256').update(fs.readFileSync(exe)).digest('hex');
  if (digest !== pinnedWindowsBinarySha256) throw new Error('Executable SHA-256 differs from the verified setup; execution refused.');
  return { exe, version: pkg.version, sha256: digest };
}

function printHelp() {
  console.log(`Local Higgsfield — studio setup

node scripts/higgsfield-local.mjs doctor
node scripts/higgsfield-local.mjs version
node scripts/higgsfield-local.mjs help [command [subcommand]]
node scripts/higgsfield-local.mjs login
node scripts/higgsfield-local.mjs inspect <read command>

Accepted reads: account status/transactions; workspace status/list;
model list/get; workflow list/get; voices list/get; generate list/get;
generate cost with scalar parameters, without media flags, file reads, or URLs.

Login is interactive and should run when the user requests connection.
Account credits and capabilities require login; doctor/version/help do not verify them.
This wrapper does not submit jobs, upload files, train identity, or publish.
Procedure and recovery: docs/higgsfield-setup.md.`);
}

function inspectionArguments(args) {
  const [group, operation, ...rest] = args;
  const allowed = {
    account: ['status', 'transactions'], workspace: ['status', 'list'],
    model: ['list', 'get'], workflow: ['list', 'get'], voices: ['list', 'get'],
    generate: ['list', 'get', 'cost'],
  };
  if (!allowed[group]?.includes(operation)) throw new Error('Command is outside permitted reads. Submissions, uploads, training, publishing, and printing tokens require a separate authorized procedure.');
  if (operation === 'cost') {
    // The vendor cost command auto-uploads paths passed as media inputs.
    // Only scalar model parameters are permitted in this preparation route.
    const safeFlags = new Set(['--prompt', '--duration', '--resolution', '--aspect_ratio', '--aspect-ratio', '--mode', '--quality', '--sound', '--generate-audio', '--bitrate_mode', '--json', '--no-color']);
    let position = 0;
    if (rest[position] === 'workflow') position++;
    if (!/^[a-z0-9][a-z0-9_-]*$/i.test(rest[position] ?? '')) throw new Error('Provide a valid model/workflow ID for estimation.');
    position++;
    for (; position < rest.length; position++) {
      const flag = rest[position];
      if (!safeFlags.has(flag)) throw new Error(`Parameter ${flag} is not permitted in this estimate without upload.`);
      if (flag === '--json' || flag === '--no-color') continue;
      const value = rest[++position];
      if (!value || value.startsWith('-') || value.startsWith('@') || /https?:\/\/|[\r\n\0]/i.test(value)) throw new Error(`Invalid value for ${flag}; use scalar parameters without a file or URL.`);
    }
  } else {
    for (const value of rest) {
      if (value === 'auth' || value === 'token' || value === 'login' || value.startsWith('@') || /[\r\n\0]/.test(value)) throw new Error('Argument is outside the read scope.');
    }
  }
  return args;
}

function execute(args, interactive = false) {
  const { exe } = binary();
  return new Promise((resolve, reject) => {
    const child = spawn(exe, args, { cwd: root, shell: false, windowsHide: true, stdio: 'inherit', env: { ...process.env, HIGGSFIELD_INSTALL_METHOD: 'npm', HIGGSFIELD_PACKAGE_MANAGER: 'npm' } });
    const timeout = interactive ? null : setTimeout(() => { child.kill(); reject(new Error('Read interrupted after 30 seconds; this does not prove login failure or service unavailability.')); }, 30000);
    child.once('error', err => { if (timeout) clearTimeout(timeout); reject(err); });
    child.once('exit', (code, signal) => { if (timeout) clearTimeout(timeout); if (signal) reject(new Error(`CLI interrupted (${signal}).`)); else resolve(code ?? 1); });
  });
}

async function main() {
  const [command = 'help', ...args] = process.argv.slice(2);
  if (command === 'help' && !args.length) { printHelp(); return; }
  if (command === 'doctor') {
    if (args.length) throw new Error('doctor does not accept arguments.');
    const inspected = binary();
    console.log(JSON.stringify({ installed: true, version: inspected.version, binarySha256: inspected.sha256, path: path.relative(root, inspected.exe).replaceAll('\\', '/'), account: 'awaiting-login-and-inspection', checks: ['local package and version', 'executable SHA-256'], limitations: ['No credential reads', 'No account, balance, or remote catalog reads', 'No generation or upload'] }, null, 2));
    return;
  }
  if (command === 'version') {
    if (args.length) throw new Error('version does not accept arguments.');
    process.exitCode = await execute(['version']); return;
  }
  if (command === 'help') {
    if (!routes.has(args.join(' '))) throw new Error('Unknown help topic. Use help without arguments to see the wrapper.');
    process.exitCode = await execute([...args, '--help']); return;
  }
  if (command === 'login') {
    if (args.length) throw new Error('login does not accept tokens or files; use the interactive OAuth flow.');
    process.exitCode = await execute(['auth', 'login'], true); return;
  }
  if (command === 'inspect') {
    process.exitCode = await execute(inspectionArguments(args)); return;
  }
  throw new Error(`Command ${command} is unsupported. Use help.`);
}

main().catch(err => { console.error(`Higgsfield: ${err.message}`); process.exitCode = 1; });
