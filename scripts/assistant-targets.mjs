const targets = Object.freeze({
  codex: Object.freeze({ name: 'codex', skillRoot: '.agents/skills', files: Object.freeze(['SKILL.md', 'agents/openai.yaml']) }),
  claude: Object.freeze({ name: 'claude', skillRoot: '.claude/skills', files: Object.freeze(['SKILL.md']) })
});

/** Host projections share canonical skill bytes; they never select a media provider. */
export function assistantTargets(assistant = 'codex') {
  if (!['codex', 'claude', 'both'].includes(assistant)) throw new Error('Choose --assistant codex, claude, or both.');
  return assistant === 'both' ? [targets.codex, targets.claude] : [targets[assistant]];
}

export function parseAssistantOption(args) {
  let assistant = 'codex', found = false;
  const remaining = [];
  for (let index = 0; index < args.length; index++) {
    if (args[index] !== '--assistant') { remaining.push(args[index]); continue; }
    if (found || index + 1 >= args.length) throw new Error('Choose one --assistant codex, claude, or both.');
    found = true;
    assistant = args[++index];
    assistantTargets(assistant);
  }
  return { assistant, remaining };
}
