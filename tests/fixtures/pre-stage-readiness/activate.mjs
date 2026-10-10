import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Exact generation contracts retained from the independently packed pre-F3 source.
// Archive SHA-256: 00423d1b944c6bb2db14e46e6c74f2e1003196005139af00181c56f74fe69e4a.
// These fixtures keep older general regression semantics; current policy has its own suite.
export function usePreReadinessContracts(root) {
  const source = path.dirname(fileURLToPath(import.meta.url));
  for (const name of ['generate-candidates', 'generate-piece']) fs.copyFileSync(path.join(source, `${name}.json`), path.join(root, 'framework/tasks', `${name}.json`));
}
