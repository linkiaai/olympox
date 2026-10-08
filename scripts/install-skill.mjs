import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { installSkill } from './skill-install-core.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const name = process.argv[2] ?? 'olympox';
try {
  if (process.argv.length > 3) throw new Error('Choose olympox or higgsfield-studio; arbitrary paths are not accepted.');
  const result = installSkill(root, name);
  console.log(`Local skill installed: ${result.targetRoot}`);
} catch (error) { console.error(error.message); process.exitCode = 1; }
