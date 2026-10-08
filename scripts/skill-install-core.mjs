import fs from 'node:fs';
import path from 'node:path';

const names = new Set(['olympox', 'higgsfield-studio']);
const files = ['SKILL.md', 'agents/openai.yaml'];

function statIfPresent(file) {
  try { return fs.lstatSync(file); }
  catch (error) { if (error.code === 'ENOENT') return null; throw error; }
}

function directoryPath(directory) {
  const absolute = path.resolve(directory);
  const anchor = path.parse(absolute).root;
  let current = anchor;
  for (const part of absolute.slice(anchor.length).split(path.sep).filter(Boolean)) {
    current = path.join(current, part);
    const stat = statIfPresent(current);
    if (stat?.isSymbolicLink()) throw new Error(`Links and junctions are not permitted: ${current}`);
    if (stat && !stat.isDirectory()) throw new Error(`Expected a directory: ${current}`);
  }
  return absolute;
}

function checkedFile(root, relative) {
  const file = path.resolve(root, relative);
  const inside = path.relative(root, file);
  if (!inside || path.isAbsolute(inside) || inside === '..' || inside.startsWith(`..${path.sep}`)) {
    throw new Error('Skill path is outside the studio.');
  }
  directoryPath(path.dirname(file));
  const stat = statIfPresent(file);
  if (stat?.isSymbolicLink()) throw new Error(`Links and junctions are not permitted: ${relative}`);
  if (stat && !stat.isFile()) throw new Error(`Expected a file: ${relative}`);
  return { file, stat };
}

/** Install only the two registered skill files after all sources and destinations pass preflight. */
export function installSkill(studioRoot, name = 'olympox') {
  if (!names.has(name)) throw new Error('Choose olympox or higgsfield-studio; arbitrary paths are not accepted.');
  if (typeof studioRoot !== 'string' || !studioRoot) throw new Error('Provide the studio directory.');
  const root = directoryPath(studioRoot);
  if (!statIfPresent(root)?.isDirectory()) throw new Error('Studio directory does not exist.');

  // Load every source before checking destinations or creating any directory.
  const sources = files.map(relative => {
    const source = checkedFile(root, `skills/${name}/${relative}`);
    if (!source.stat) throw new Error(`Skill source is missing: skills/${name}/${relative}`);
    return { relative, bytes: fs.readFileSync(source.file), mode: source.stat.mode & 0o777 };
  });
  const pending = [], retained = [];
  for (const source of sources) {
    const destination = checkedFile(root, `.agents/skills/${name}/${source.relative}`);
    if (destination.stat) {
      if (!fs.readFileSync(destination.file).equals(source.bytes)) {
        throw new Error(`Installed skill differs at ${source.relative}; review before updating. Nothing was overwritten.`);
      }
      retained.push(source.relative);
    } else pending.push(source);
  }

  for (const { relative, bytes, mode } of pending) {
    const destination = checkedFile(root, `.agents/skills/${name}/${relative}`);
    fs.mkdirSync(path.dirname(destination.file), { recursive: true });
    checkedFile(root, `.agents/skills/${name}/${relative}`);
    fs.writeFileSync(destination.file, bytes, { flag: 'wx', mode });
  }
  return { targetRoot: path.join(root, '.agents', 'skills', name), copied: pending.map(item => item.relative), retained };
}
