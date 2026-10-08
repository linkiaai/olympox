import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const names = new Set(['olympox', 'higgsfield-studio']);
const name = process.argv[2] ?? 'olympox';
const source = path.join(root, 'skills', name);
const target = path.join(root, '.agents', 'skills', name);
const files = ['SKILL.md', 'agents/openai.yaml'];
try {
  if (!names.has(name) || process.argv.length > 3) throw new Error('Choose olympox or higgsfield-studio; arbitrary paths are not accepted.');
  for (const file of files) {
    const destination = path.join(target, file);
    if (fs.existsSync(destination) && !fs.readFileSync(destination).equals(fs.readFileSync(path.join(source, file)))) {
      throw new Error(`Installed skill differs at ${file}; review before updating. Nothing was overwritten.`);
    }
  }
  for (const file of files) {
    const destination = path.join(target, file);
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    if (!fs.existsSync(destination)) fs.copyFileSync(path.join(source, file), destination, fs.constants.COPYFILE_EXCL);
  }
  console.log(`Local skill installed: ${target}`);
} catch (error) { console.error(error.message); process.exitCode = 1; }
