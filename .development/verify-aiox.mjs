import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const yaml = createRequire(path.join(root, '.aiox-core/package.json'))('js-yaml');
const config = yaml.load(fs.readFileSync(path.join(root, '.aiox-core/core-config.yaml'), 'utf8'));
assert.deepEqual(config.ide.selected, ['codex']);
assert.equal(config.autoClaude.enabled, false);
assert.equal(config.autoClaude.worktree.enabled, false);
assert.equal(config.mcp.enabled, false);
assert.equal(config.mcp.docker_mcp.enabled, false);
for (const [name, enabled] of Object.entries(config.ide.configs)) assert.equal(enabled, name === 'codex');
assert.equal(config.devStoryLocation, '.development/stories');
assert.equal(config.storyBacklog.location, '.development/stories/backlog');
assert.equal(config.qa.qaLocation, '.development/qa');
assert.equal(config.coderabbit_integration.report_location, '.development/qa/coderabbit-reports/');
assert.equal(config.squadsLocation, '.development/squads');
assert.equal(config.squadsTemplateLocation, '.development/templates/squad');
assert.equal(config.squads.templateLocation, '.development/templates/squad');
assert.equal(config.mindsLocation, '.development/state/minds');
assert.equal(config.pvMindContext.location, '.development/state/minds/pedro_valerio');
for (const [name, target] of Object.entries(config.ideSync.targets)) assert.equal(target.enabled, name === 'codex');
const context = JSON.parse(fs.readFileSync(path.join(root, '.development/project.json'), 'utf8'));
assert.equal(context.kind, 'framework-development');
assert.equal(context.schemaVersion, 1);
const internal = JSON.parse(fs.readFileSync(path.join(root, '.aiox-core/package.json'), 'utf8'));
assert.equal(internal.version, '5.4.1');
const product = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
assert.equal(product.dependencies, undefined);
assert.equal(product.devDependencies, undefined);
assert.ok(!product.files.includes('AGENTS.md'));
const active = fs.readdirSync(path.join(root, '.agents/skills')).toSorted();
const generated = fs.readdirSync(path.join(root, '.codex/skills')).filter(name => name.startsWith('aiox-')).toSorted();
assert.equal(generated.length, 12);
assert.deepEqual(active, generated);
for (const name of generated) assert.deepEqual(fs.readFileSync(path.join(root, '.agents/skills', name, 'SKILL.md')), fs.readFileSync(path.join(root, '.codex/skills', name, 'SKILL.md')));
const checks = [
  ['.development/verify-aiox-context.mjs'],
  ['.aiox-core/infrastructure/scripts/ide-sync/index.js', 'validate', '--ide', 'codex', '--strict'],
  ['.aiox-core/infrastructure/scripts/codex-skills-sync/validate.js', '--strict'],
  ['.development/aiox-cli.cjs', '--version'],
  ['.development/aiox-cli.cjs', '--help'],
  ['.development/aiox-cli.cjs', 'config', '--help'],
  ['.development/aiox-cli.cjs', 'metrics', '--help']
];
for (const args of checks) {
  const output = execFileSync(process.execPath, args, { cwd: root, encoding: 'utf8', maxBuffer: 4 * 1024 * 1024, timeout: 30000 });
  assert.ok(output.trim(), 'An empty CLI result does not prove the entrypoint ran.');
  if (args.includes('--version')) assert.equal(output.trim(), '5.4.1');
  console.log('PASS ' + args.join(' '));
}
console.log('AIOX engineering configuration and 12 Codex skill projections verified. Product dependencies: 0. Live skill discovery requires a separate host check.');
