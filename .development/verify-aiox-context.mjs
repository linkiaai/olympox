import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { safeLocalPath, verifyRoleContexts } from './aiox-context-core.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(path.join(root, '.aiox-core/package.json'));
const yaml = require('js-yaml');
try {
  const config = yaml.load(fs.readFileSync(safeLocalPath(root, '.aiox-core/core-config.yaml'), 'utf8'));
  const report = await verifyRoleContexts(root, config, require);
  console.log(JSON.stringify(report, null, 2));
} catch (error) { console.error(`AIOX required-context verification failed: ${error.message}`); process.exitCode = 1; }
