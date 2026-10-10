'use strict';
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const {createProgram} = require(path.join(root, '.aiox-core/cli/index.js'));
const internal = require(path.join(root, '.aiox-core/package.json'));
const program = createProgram();
// Upstream CLI is an exported module and reads the host product manifest.
// Preserve its command registrations, but report the isolated tooling version.
program.removeAllListeners('option:version');
program.on('option:version', () => {
  process.stdout.write(`${internal.version}\n`);
  process.exit(0);
});
program.parseAsync(process.argv).catch(error => {
  console.error(error.message);
  process.exitCode = 1;
});
