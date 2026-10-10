import fs from 'node:fs';
import path from 'node:path';

// The explicit marker separates product engineering from an installed studio.
export function isFrameworkDevelopment(root) {
  const directory = path.join(root, '.development');
  let directoryStat;
  try { directoryStat = fs.lstatSync(directory); }
  catch (error) { if (error.code === 'ENOENT') return false; throw error; }
  if (!directoryStat.isDirectory() || directoryStat.isSymbolicLink()) throw new Error('Invalid framework development directory.');
  const marker = path.join(directory, 'project.json');
  let markerStat;
  try { markerStat = fs.lstatSync(marker); }
  catch (error) { if (error.code === 'ENOENT') return false; throw error; }
  if (!markerStat.isFile() || markerStat.isSymbolicLink()) throw new Error('Invalid framework development marker.');
  let context;
  try { context = JSON.parse(fs.readFileSync(marker, 'utf8').replace(/^\uFEFF/, '')); }
  catch (error) { throw new Error(`Invalid framework development marker: ${error.message}`); }
  if (context?.schemaVersion !== 1 || context.kind !== 'framework-development') throw new Error('Invalid framework development marker.');
  return true;
}

export function refuseDevelopmentActivation(root) {
  if (isFrameworkDevelopment(root)) throw new Error('Creative skill activation is unavailable in the framework development checkout. Install an independent OLYMPOX studio to activate creative skills.');
}
