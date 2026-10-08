#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { installFramework } from '../scripts/install-framework.mjs';

const sourceRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const [command = 'help', ...options] = args;

function help() {
  console.log(`OLYMPOX - AI Influencer framework

Usage:
  olympox install [directory] [--merge]
  olympox <studio-command> [arguments]
  olympox --version

Install a new studio:
  npx --yes github:linkiaai/olympox install ./my-studio

The installer copies reusable framework files and local skills. Personal
characters, media, work, backups and credentials are never included.
--merge keeps identical files and rejects conflicting files before writing.

Run studio commands from the installed project's root. To list them:
  node bin/olympox.mjs studio-help
`);
}

try {
  if (['help', '--help', '-h'].includes(command)) help();
  else if (['--version', '-v'].includes(command)) console.log(JSON.parse(fs.readFileSync(path.join(sourceRoot, 'package.json'), 'utf8')).version);
  else if (command === 'install') {
    if (options.some(value => ['--help', '-h'].includes(value))) { help(); }
    else {
      const unknown = options.filter(value => value.startsWith('-') && value !== '--merge');
      const directories = options.filter(value => !value.startsWith('-'));
      if (unknown.length || directories.length > 1 || options.filter(value => value === '--merge').length > 1) throw new Error('Use olympox install [directory] [--merge].');
      const result = installFramework(sourceRoot, path.resolve(directories[0] ?? '.'), { merge: options.includes('--merge') });
      console.log(`OLYMPOX installed: ${result.targetRoot}`);
      console.log(`${result.copied.length} files copied; ${result.retained.length} identical files retained.`);
      console.log('Open this folder in Codex and use $olympox. Run npm run verify to check the local installation.');
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
