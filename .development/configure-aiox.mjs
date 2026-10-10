import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
import { applyContextAdaptation, prepareContextAdaptation, safeLocalPath } from './aiox-context-core.mjs';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const yaml = createRequire(path.join(root, '.aiox-core/package.json'))('js-yaml');
const file = safeLocalPath(root, '.aiox-core/core-config.yaml');
const config = yaml.load(fs.readFileSync(file, 'utf8'));
config.ide.selected = ['codex'];
for (const key of Object.keys(config.ide.configs)) config.ide.configs[key] = key === 'codex';
for (const [key, target] of Object.entries(config.ideSync.targets)) target.enabled = key === 'codex';
config.autoClaude.enabled = false;
config.autoClaude.worktree.enabled = false;
config.mcp.enabled = false;
config.mcp.docker_mcp.enabled = false;
config.qa.qaLocation = '.development/qa';
config.prd.prdFile = '.development/prd.md';
config.prd.prdShardedLocation = '.development/prd';
config.architecture.architectureFile = '.development/architecture.md';
config.architecture.architectureShardedLocation = '.development/architecture';
const officialDevGuides = ['docs/framework/coding-standards.md', 'docs/framework/tech-stack.md', 'docs/framework/source-tree.md'];
if (!config.devLoadAlwaysFiles || JSON.stringify(config.devLoadAlwaysFiles) === JSON.stringify(officialDevGuides)) config.devLoadAlwaysFiles = ['.development/coding-standards.md', '.development/tech-stack.md', '.development/source-tree.md'];
config.devLoadAlwaysFilesFallback = [];
config.devDebugLog = '.development/state/debug-log.md';
config.devStoryLocation = '.development/stories';
config.decisionLogging.location = '.development/state';
if (!config.frameworkDocsLocation || config.frameworkDocsLocation === 'docs/framework') config.frameworkDocsLocation = '.development';
config.projectDocsLocation = '.development/decisions';
if (config.backlog) config.backlog.location = '.development/stories/backlog';
if (config.storyBacklog) config.storyBacklog.location = '.development/stories/backlog';
if (config.coderabbit_integration) config.coderabbit_integration.report_location = '.development/qa/coderabbit-reports/';
config.squadsTemplateLocation = '.development/templates/squad';
if (config.squads) config.squads.templateLocation = '.development/templates/squad';
config.squadsLocation = '.development/squads';
config.mindsLocation = '.development/state/minds';
if (config.pvMindContext) config.pvMindContext.location = '.development/state/minds/pedro_valerio';
// Preflight required guides, pinned source and recognized adaptations before writes.
prepareContextAdaptation(root, config);
fs.writeFileSync(file, yaml.dump(config, { lineWidth: 120, noRefs: true }));
const adaptation = applyContextAdaptation(root, config);
for (const args of [
  ['.aiox-core/infrastructure/scripts/ide-sync/index.js', 'sync', '--ide', 'codex'],
  ['.aiox-core/infrastructure/scripts/codex-skills-sync/index.js']
]) execFileSync(process.execPath, args, { cwd: root, stdio: 'inherit' });
for (const name of fs.readdirSync(path.join(root, '.codex/skills')).filter(name => /^aiox-[a-z-]+$/.test(name))) {
  const target = path.join(root, '.agents/skills', name);
  fs.mkdirSync(target, { recursive: true });
  fs.copyFileSync(path.join(root, '.codex/skills', name, 'SKILL.md'), path.join(target, 'SKILL.md'));
}
console.log('Configured AIOX for Codex engineering; stories and local state use .development.');
console.log(`Required engineering context adapted from AIOX 5.4.1: ${adaptation.adaptedSha256}`);
