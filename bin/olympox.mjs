#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { installFramework } from '../scripts/install-framework.mjs';
import { parseAssistantOption } from '../scripts/assistant-targets.mjs';
import { parseSetupOptions, runOnboarding } from '../scripts/onboarding.mjs';

const sourceRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const [command = (process.stdin.isTTY && process.stdout.isTTY ? 'setup' : 'help'), ...options] = args;
let guidedSetup = false;

async function finishGuidedCli() {
  // The API has closed its reader and awaited local verification. Windows
  // console reads can still block natural shutdown after raw mode is restored.
  await Promise.all([process.stdout, process.stderr].map(stream => new Promise(resolve => stream.write('', resolve))));
  process.exit(process.exitCode ?? 0);
}

function help() {
  console.log(`OLYMPOX - AI Influencer framework

Usage:
  olympox setup [directory] [--assistant codex|claude|both] [--locale en|pt-BR] [--merge] [--yes]
  olympox install [directory] [--merge] [--assistant codex|claude|both]
  olympox <studio-command> [arguments]
  olympox --version

Install a new studio:
  npx --yes github:linkiaai/olympox#v0.5.0 setup

From a reviewed source checkout or extracted package:
  node bin/olympox.mjs setup

Setup guides language, assistant, destination, a reviewed installation plan and
local verification. English is the default presentation language.
Noninteractive setup requires --yes, an explicit directory and --assistant.
An interactive install without --assistant opens the same guide.
Explicit install arguments remain available for scripts.

The installer copies reusable framework files and local skills. Personal
characters, media, work, backups and credentials are never included.
--merge keeps identical files and rejects conflicting files before writing.
Direct install defaults to codex. Claude Code uses CLAUDE.md and .claude/skills.
The assistant target changes local instructions and skills, not the media method.

Run studio commands from the installed project's root. To list them:
  node bin/olympox.mjs studio-help
`);
}

try {
  if (['help', '--help', '-h'].includes(command)) help();
  else if (['--version', '-v'].includes(command)) console.log(JSON.parse(fs.readFileSync(path.join(sourceRoot, 'package.json'), 'utf8')).version);
  else if (command === 'setup') {
    if (options.some(value => ['--help', '-h'].includes(value))) help();
    else {
      guidedSetup = true;
      const result = await runOnboarding(sourceRoot, parseSetupOptions(options), { cliConsoleCleanup: true });
      if (result.status === 'verification-failed') process.exitCode = 1;
    }
  }
  else if (command === 'install') {
    if (options.some(value => ['--help', '-h'].includes(value))) { help(); }
    else if (!options.includes('--assistant') && process.stdin.isTTY && process.stdout.isTTY) {
      guidedSetup = true;
      const result = await runOnboarding(sourceRoot, parseSetupOptions(options), { cliConsoleCleanup: true });
      if (result.status === 'verification-failed') process.exitCode = 1;
    }
    else {
      const { assistant, remaining } = parseAssistantOption(options);
      const unknown = remaining.filter(value => value.startsWith('-') && value !== '--merge');
      const directories = remaining.filter(value => !value.startsWith('-'));
      if (unknown.length || directories.length > 1 || remaining.filter(value => value === '--merge').length > 1) throw new Error('Use olympox install [directory] [--merge] [--assistant codex|claude|both].');
      const result = installFramework(sourceRoot, path.resolve(directories[0] ?? '.'), { merge: remaining.includes('--merge'), assistant });
      console.log(`OLYMPOX installed: ${result.targetRoot}`);
      console.log(`${result.copied.length} files copied; ${result.retained.length} identical files retained.`);
      if (assistant !== 'claude') console.log('Open this folder in Codex and use $olympox.');
      if (assistant !== 'codex') console.log('Open this folder in Claude Code and use /olympox.');
      console.log('Run npm run verify to check the local installation; tool connection and media quality require separate live checks.');
    }
  } else {
    const targetRoot = process.cwd();
    const metadataPath = path.join(targetRoot, 'package.json');
    const studio = path.join(targetRoot, 'scripts', 'studio.mjs');
    if (!fs.existsSync(metadataPath) || JSON.parse(fs.readFileSync(metadataPath, 'utf8')).name !== 'olympox' || !fs.existsSync(studio)) {
      throw new Error('Run studio commands from an installed OLYMPOX project. Use olympox install <directory> to create one.');
    }
    const result = spawnSync(process.execPath, [studio, command === 'studio-help' ? 'help' : command, ...options], { cwd: targetRoot, stdio: 'inherit' });
    if (result.error) throw result.error;
    process.exitCode = result.status ?? 1;
  }
} catch (error) {
  console.error(`OLYMPOX: ${error.message}`);
  process.exitCode = 1;
}
if (guidedSetup) await finishGuidedCli();
