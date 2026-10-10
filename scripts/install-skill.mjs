import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { installSkill } from './skill-install-core.mjs';
import { parseAssistantOption } from './assistant-targets.mjs';
import { refuseDevelopmentActivation } from './development-context.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
try {
  const args = process.argv.slice(2);
  if (args.length === 1 && ['--help', '-h'].includes(args[0])) {
    console.log('node scripts/install-skill.mjs [olympox|higgsfield-studio] [--assistant codex|claude|both]\nDefault skill: olympox. Default assistant: codex.\nInstalls only canonical skill files; differing files are never overwritten. The framework installer also supplies Claude Code project instructions.\nCreative skill activation requires an independent installed studio; framework development checkouts refuse activation before writes.');
  } else {
    refuseDevelopmentActivation(root);
    const { assistant, remaining } = parseAssistantOption(args);
    if (remaining.length > 1) throw new Error('Choose olympox or higgsfield-studio; arbitrary paths are not accepted.');
    const result = installSkill(root, remaining[0] ?? 'olympox', { assistant });
    console.log(`Local skill installed: ${result.targetRoots.join(', ')}`);
  }
} catch (error) { console.error(error.message); process.exitCode = 1; }
