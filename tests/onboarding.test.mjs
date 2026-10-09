import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { PassThrough } from 'node:stream';
import { spawn } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { parseSetupOptions, runOnboarding } from '../scripts/onboarding.mjs';
import { installFramework } from '../scripts/install-framework.mjs';

const project = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const scratchRoot = path.join(project, 'tmp', 'onboarding-tests');
const scratch = [];
function write(root, relative, value) {
  const target = path.join(root, relative);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, typeof value === 'string' ? value : JSON.stringify(value));
  return target;
}
function fixture() {
  fs.mkdirSync(scratchRoot, { recursive: true });
  const base = fs.mkdtempSync(path.join(scratchRoot, 'setup-'));
  scratch.push(base);
  const source = path.join(base, 'source'), target = path.join(base, 'studio');
  for (const directory of ['bin', 'framework', 'scripts', 'skills', 'docs', 'templates', 'tests', 'vendor', 'docs-site/locales', 'docs-site/src']) fs.mkdirSync(path.join(source, directory), { recursive: true });
  for (const file of ['CONSTITUTION.md', 'README.md', 'LICENSE', 'docs-site/README.md', 'influencers/README.md']) write(source, file, `Synthetic onboarding fixture: ${file}`);
  write(source, 'package.json', { name: 'olympox', version: '0.5.0', type: 'module' });
  write(source, 'docs-site/config.json', {});
  for (const file of ['studio-AGENTS.md', 'studio-CLAUDE.md', 'locales/pt-BR/studio-AGENTS.md', 'project.gitignore', 'project.gitattributes']) write(source, `templates/${file}`, `Synthetic ${file}; no creative production or provider access.`);
  for (const skill of ['olympox', 'higgsfield-studio']) {
    write(source, `skills/${skill}/SKILL.md`, `# ${skill}\nSynthetic reusable instructions only.`);
    write(source, `skills/${skill}/agents/openai.yaml`, 'interface:\n  display_name: "Fixture"\n');
  }
  write(source, 'framework/marker.json', { fixture: true });
  return { base, source, target };
}
function inventory(root) {
  if (!fs.existsSync(root)) return null;
  const files = {};
  function visit(current, prefix = '') {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const relative = prefix + entry.name;
      if (entry.isDirectory()) visit(path.join(current, entry.name), relative + '/');
      else files[relative] = crypto.createHash('sha256').update(fs.readFileSync(path.join(current, entry.name))).digest('hex');
    }
  }
  visit(root);
  return files;
}
function scripted(answers, extra = {}) {
  const output = [], asked = [], queues = Object.fromEntries(Object.entries(answers).map(([id, values]) => [id, Array.isArray(values) ? [...values] : [values]]));
  const io = {
    isTTY: true,
    output: value => output.push(value),
    ask: async question => {
      asked.push(question.id);
      assert.ok(queues[question.id]?.length, `Unexpected prompt: ${question.id}`);
      const answer = queues[question.id].shift();
      return typeof answer === 'function' ? answer(question) : answer;
    },
    verify: async () => ({ ok: true, checks: [{ synthetic: true, notes: 'Injected fixture verifier, not actual framework verification' }] }),
    ...extra
  };
  return { io, output, asked };
}
test.after(() => {
  for (const root of scratch) {
    assert.equal(path.dirname(path.resolve(root)), path.resolve(scratchRoot));
    assert.match(path.basename(root), /^setup-/);
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('setup parsing preserves exact paths and rejects ambiguous or missing options', () => {
  assert.deepEqual(parseSetupOptions(['C:\\Example Studio', '--assistant', 'both', '--locale', 'pt-BR', '--merge', '--yes']), { directory: 'C:\\Example Studio', assistant: 'both', locale: 'pt-BR', merge: true, yes: true });
  assert.deepEqual(parseSetupOptions([]), { directory: null, assistant: null, locale: null, merge: false, yes: false });
  for (const args of [
    ['one', 'two'], ['--assistant'], ['--assistant', '--yes'], ['--assistant', 'other'], ['--locale'], ['--locale', 'pt-br'],
    ['--yes', '--yes'], ['--merge', '--merge'], ['--assistant', 'codex', '--assistant', 'claude'], ['--locale', 'en', '--locale', 'pt-BR'], ['--unknown'], ['']
  ]) assert.throws(() => parseSetupOptions(args));
});

test('new English Codex and Portuguese Claude studios receive exact projections without translating source bytes', async () => {
  for (const [locale, assistant, invocation] of [['en', 'codex', '$olympox'], ['pt-BR', 'claude', '/olympox']]) {
    const { base, source, target } = fixture(), before = inventory(source);
    const session = scripted({ locale, assistant, directory: target, confirm: 'yes' }, { cwd: base });
    const result = await runOnboarding(source, parseSetupOptions([]), session.io);
    assert.equal(result.status, 'installed');
    assert.equal(result.locale, locale);
    assert.deepEqual(result.nextInvocations, [invocation]);
    assert.equal(result.providerReadiness, 'pending');
    assert.deepEqual(inventory(source), before);
    const skillRoot = assistant === 'codex' ? '.agents' : '.claude';
    assert.deepEqual(fs.readFileSync(path.join(target, skillRoot, 'skills/olympox/SKILL.md')), fs.readFileSync(path.join(source, 'skills/olympox/SKILL.md')));
    assert.equal(fs.existsSync(path.join(target, assistant === 'codex' ? '.claude' : '.agents')), false);
    assert.equal(fs.existsSync(path.join(target, 'CLAUDE.md')), assistant === 'claude');
    assert.deepEqual(fs.readFileSync(path.join(target, 'AGENTS.md')), fs.readFileSync(path.join(source, 'templates/studio-AGENTS.md')));
    assert.ok(session.output.some(line => line.includes(target)));
    assert.ok(session.output.some(line => line.includes(invocation)));
    assert.match(result.firstPrompt, /Atena/);
    assert.match(result.firstPrompt, locale === 'en' ? /complete pilot/ : /piloto completo/);
  }
});

test('number choices and Enter defaults create a sibling studio outside the framework checkout', async () => {
  const { source, base } = fixture();
  const session = scripted({ locale: '', assistant: ['wrong', '3'], directory: '', confirm: '' }, { cwd: source });
  const result = await runOnboarding(source, parseSetupOptions([]), session.io);
  assert.equal(result.targetRoot, path.join(base, 'olympox-studio'));
  assert.equal(result.assistant, 'both');
  assert.deepEqual(result.nextInvocations, ['$olympox', '/olympox']);
  assert.equal(fs.existsSync(path.join(result.targetRoot, '.agents/skills/olympox/SKILL.md')), true);
  assert.equal(fs.existsSync(path.join(result.targetRoot, '.claude/skills/olympox/SKILL.md')), true);
  assert.ok(session.output.some(line => line.includes('Choose a listed number')));
});

test('cancellation at every guided choice and declined summary write no studio files', async () => {
  for (const step of ['locale', 'assistant', 'directory', 'confirm']) {
    const { base, source, target } = fixture();
    const answers = { locale: 'en', assistant: 'codex', directory: target, confirm: 'yes', [step]: null };
    const session = scripted(answers, { cwd: base, verify: async () => assert.fail('Cancelled setup cannot verify or execute provider work.') });
    const before = inventory(base);
    const result = await runOnboarding(source, parseSetupOptions([]), session.io);
    assert.equal(result.status, 'cancelled');
    assert.equal(result.locale, 'en');
    assert.deepEqual(inventory(base), before);
    assert.equal(fs.existsSync(target), false);
  }
  const { base, source, target } = fixture();
  const session = scripted({ confirm: 'no' }, { cwd: base });
  assert.equal((await runOnboarding(source, parseSetupOptions([target, '--assistant', 'codex', '--locale', 'en']), session.io)).status, 'cancelled');
  assert.equal(fs.existsSync(target), false);
});

test('nonterminal automation requires an explicit reviewed destination and host, and Node 22 or later', async () => {
  const { base, source, target } = fixture();
  const output = [], io = { cwd: base, isTTY: false, output: value => output.push(value), verify: async () => ({ ok: true, checks: [] }) };
  await assert.rejects(() => runOnboarding(source, parseSetupOptions([]), io), /requires a terminal/);
  await assert.rejects(() => runOnboarding(source, parseSetupOptions(['--yes']), io), /explicit directory/);
  await assert.rejects(() => runOnboarding(source, parseSetupOptions([target, '--yes']), io), /explicit directory/);
  await assert.rejects(() => runOnboarding(source, parseSetupOptions([target, '--assistant', 'codex', '--yes']), { ...io, nodeVersion: 'v21.8.0' }), /Node 22/);
  assert.equal(fs.existsSync(target), false);
  assert.deepEqual(output, []);
  const result = await runOnboarding(source, parseSetupOptions([target, '--assistant', 'codex', '--yes']), io);
  assert.equal(result.status, 'installed');
  assert.ok(output.findIndex(line => line === 'Review the installation') < output.findIndex(line => line.startsWith('Studio installed:')));
});

test('an existing studio can choose safe merge while preserving private files and Git metadata', async () => {
  const { base, source, target } = fixture();
  installFramework(source, target, { assistant: 'codex' });
  write(target, '.git/config', 'Synthetic Git metadata');
  write(target, 'influencers/private-character/persona.json', { status: 'canon-approved', fixture: true });
  write(target, 'work/runs/preserved.json', { fixture: true });
  const before = inventory(target);
  const session = scripted({ 'existing-directory': 'merge', confirm: 'yes' }, { cwd: base });
  const result = await runOnboarding(source, parseSetupOptions([target, '--assistant', 'both', '--locale', 'en']), session.io);
  assert.equal(result.status, 'installed');
  assert.ok(result.retained.length > 0);
  assert.equal(fs.existsSync(path.join(target, '.claude/skills/olympox/SKILL.md')), true);
  for (const [relative, sha] of Object.entries(before)) assert.equal(inventory(target)[relative], sha);
});

test('a conflict in either host prevents all writes and permits cancellation without changing private history', async () => {
  const { base, source, target } = fixture();
  write(target, '.claude/skills/olympox/SKILL.md', 'Unrelated customized local skill');
  write(target, 'private.txt', 'Preserved private state');
  const before = inventory(target);
  const session = scripted({ 'destination-conflict': 'cancel' }, { cwd: base });
  const result = await runOnboarding(source, parseSetupOptions([target, '--assistant', 'both', '--locale', 'en', '--merge']), session.io);
  assert.equal(result.status, 'cancelled');
  assert.deepEqual(inventory(target), before);
  assert.equal(fs.existsSync(path.join(target, '.agents')), false);
  assert.ok(session.output.some(line => line.includes('Destination conflict: .claude/skills/olympox/SKILL.md')));
});

test('a broken framework package fails without asking users to change their destination', async () => {
  const { base, source, target } = fixture();
  fs.unlinkSync(path.join(source, 'README.md'));
  const session = scripted({}, { cwd: base, verify: async () => assert.fail('Broken sources cannot be installed.') });
  await assert.rejects(() => runOnboarding(source, parseSetupOptions([target, '--assistant', 'codex', '--locale', 'en']), session.io), /framework source is incomplete or unsafe.*repaired or freshly extracted/);
  assert.deepEqual(session.asked, []);
  assert.equal(fs.existsSync(target), false);
});

test('source or destination drift after review aborts installation before writes', async () => {
  for (const drift of ['source', 'destination']) {
    const { base, source, target } = fixture();
    const session = scripted({ confirm: () => {
      if (drift === 'source') write(source, 'README.md', 'Changed after the reviewed summary');
      else write(target, 'README.md', 'Concurrent local file created after review');
      return 'yes';
    } }, { cwd: base, verify: async () => assert.fail('Changed plan cannot proceed to verification.') });
    await assert.rejects(() => runOnboarding(source, parseSetupOptions([target, '--assistant', 'both', '--locale', 'en']), session.io), /plan changed|Destination is not empty/);
    if (drift === 'source') assert.equal(fs.existsSync(target), false);
    else assert.deepEqual(fs.readdirSync(target), ['README.md']);
  }
});

test('guided studio directories inside the development source are rejected without affecting source files', async () => {
  const { base, source } = fixture();
  const target = path.join(source, 'personal-studio');
  const before = inventory(source);
  await assert.rejects(() => runOnboarding(source, parseSetupOptions([target, '--assistant', 'codex', '--yes']), { cwd: base, isTTY: false, output() {} }), /independent directory outside/);
  assert.deepEqual(inventory(source), before);
});

test('the real readline reader treats EOF before confirmation as cancellation', async () => {
  for (const answers of ['', 'en\ncodex\n../studio\n']) {
    const { source } = fixture();
    const input = new PassThrough(), outputStream = new PassThrough();
    const operation = runOnboarding(source, parseSetupOptions([]), { cwd: source, isTTY: true, input, outputStream, output() {}, verify: async () => assert.fail('EOF cannot approve installation.') });
    input.end(answers);
    const result = await operation;
    assert.equal(result.status, 'cancelled');
    assert.equal(fs.existsSync(path.join(path.dirname(source), 'studio')), false);
  }
});

test('raw terminal Ctrl-C at confirmation cancels without writing files', async () => {
  const { base, source, target } = fixture();
  const input = new PassThrough(), outputStream = new PassThrough();
  input.isTTY = true; input.setRawMode = () => input;
  outputStream.isTTY = true; outputStream.columns = 80;
  let interrupted = false;
  const resultPromise = runOnboarding(source, parseSetupOptions([target, '--assistant', 'codex', '--locale', 'en']), {
    cwd: base, isTTY: true, input, outputStream,
    output(value) { if (value === 'Install this studio?') { interrupted = true; setImmediate(() => input.write('\u0003')); } },
    verify: async () => assert.fail('Ctrl-C cannot approve installation.')
  });
  const result = await resultPromise;
  assert.equal(interrupted, true);
  assert.equal(result.status, 'cancelled');
  assert.equal(fs.existsSync(target), false);
  input.destroy(); outputStream.destroy();
});

test('default verification executes four local Node stages in order and preserves files on failure', async () => {
  for (const failed of [false, true]) {
    const { base, source, target } = fixture();
    write(source, 'scripts/docs.mjs', "import fs from 'node:fs'; fs.appendFileSync('fixture-checks.jsonl', JSON.stringify(['docs',process.argv[2]])+'\\n');\n");
    write(source, 'scripts/studio.mjs', `import fs from 'node:fs'; fs.appendFileSync('fixture-checks.jsonl', JSON.stringify(['studio',process.argv[2]])+'\\n'); ${failed ? "if(process.argv[2]==='doctor') process.exitCode=3;" : ''}\n`);
    const result = await runOnboarding(source, parseSetupOptions([target, '--assistant', 'claude', '--yes']), { cwd: base, isTTY: false, output() {} });
    assert.equal(result.status, failed ? 'verification-failed' : 'installed');
    assert.equal(fs.existsSync(path.join(target, '.claude/skills/olympox/SKILL.md')), true);
    const checks = fs.readFileSync(path.join(target, 'fixture-checks.jsonl'), 'utf8').trim().split('\n').map(line => JSON.parse(line));
    assert.deepEqual(checks, failed ? [['docs', 'build'], ['studio', 'doctor']] : [['docs', 'build'], ['studio', 'doctor'], ['studio', 'validate'], ['docs', 'check']]);
    assert.equal(result.providerReadiness, 'pending');
    assert.equal(result.verification.checks.at(-1).exitCode, failed ? 3 : 0);
  }
});

test('raw terminal Ctrl-C during real local verification waits for the child to close and preserves the installed studio', async () => {
  const { base, source, target } = fixture();
  write(source, 'scripts/docs.mjs', "import fs from 'node:fs'; fs.writeFileSync('fixture-verifier.pid',String(process.pid)); setInterval(()=>{},1000);\n");
  const input = new PassThrough(), outputStream = new PassThrough();
  input.isTTY = true; input.setRawMode = () => input;
  outputStream.isTTY = true; outputStream.columns = 80;
  let childPid = null;
  const interrupt = setInterval(() => {
    const marker = path.join(target, 'fixture-verifier.pid');
    if (childPid === null && fs.existsSync(marker)) {
      childPid = Number(fs.readFileSync(marker, 'utf8'));
      input.write('\u0003');
    }
  }, 10);
  try {
    const result = await runOnboarding(source, parseSetupOptions([target, '--assistant', 'codex', '--locale', 'en']), {
      cwd: base, isTTY: true, input, outputStream,
      output(value) { if (value === 'Install this studio?') setImmediate(() => input.write('\r')); }
    });
    assert.equal(result.status, 'verification-failed');
    assert.equal(result.verification.interrupted, true);
    assert.equal(result.verification.checks.length, 1);
    assert.notEqual(result.verification.checks[0].exitCode, 0);
    assert.equal(fs.existsSync(path.join(target, '.agents/skills/olympox/SKILL.md')), true);
    assert.equal(result.providerReadiness, 'pending');
    assert.ok(Number.isInteger(childPid) && childPid > 0);
    assert.throws(() => process.kill(childPid, 0), { code: 'ESRCH' });
    assert.equal(input.destroyed, false);
    assert.equal(outputStream.destroyed, false);
  } finally {
    clearInterval(interrupt);
    input.destroy(); outputStream.destroy();
  }
});

test('verification children use pipes, forward actual output, and leave embedding streams and raw mode intact', async () => {
  for (const originalRawMode of [false, true]) {
    const { base, source, target } = fixture();
    write(source, 'scripts/docs.mjs', "import fs from 'node:fs'; fs.writeFileSync('fixture-child-stdio.json',JSON.stringify([process.stdout.isTTY===true,process.stderr.isTTY===true])); console.log('fixture actual stdout'); console.error('fixture actual stderr');\n");
    write(source, 'scripts/studio.mjs', '');
    const input = new PassThrough(), outputStream = new PassThrough(), errorStream = new PassThrough();
    input.isTTY = true; input.isRaw = originalRawMode;
    outputStream.isTTY = true; outputStream.columns = 80;
    input.setRawMode = mode => { input.isRaw = mode; return input; };
    const actualOutput = [], actualErrors = [];
    outputStream.on('data', bytes => actualOutput.push(bytes.toString()));
    errorStream.on('data', bytes => actualErrors.push(bytes.toString()));
    try {
      const result = await runOnboarding(source, parseSetupOptions([target, '--assistant', 'codex', '--locale', 'en']), {
        cwd: base, isTTY: true, input, outputStream, errorStream,
        output(value) { if (value === 'Install this studio?') setImmediate(() => input.write('\r')); }
      });
      assert.equal(result.status, 'installed');
      assert.deepEqual(JSON.parse(fs.readFileSync(path.join(target, 'fixture-child-stdio.json'), 'utf8')), [false, false]);
      assert.match(actualOutput.join(''), /fixture actual stdout/);
      assert.match(actualErrors.join(''), /fixture actual stderr/);
      assert.equal(input.isRaw, originalRawMode);
      assert.equal(input.isPaused(), true);
      assert.equal(input.destroyed, false);
      assert.equal(outputStream.destroyed, false);
      assert.equal(errorStream.destroyed, false);
    } finally { input.destroy(); outputStream.destroy(); errorStream.destroy(); }
  }
});

test('Windows console cleanup is strict by default and permits only the explicitly isolated CLI EPERM case', { skip: process.platform !== 'win32' }, async () => {
  const moduleUrl = pathToFileURL(path.join(project, 'scripts/onboarding.mjs')).href;
  for (const [allow, code, verified, expected] of [[false, 'EPERM', true, 'fatal'], [true, 'EPERM', true, 'installed'], [true, 'EPERM', false, 'verification-failed'], [true, 'EIO', true, 'fatal']]) {
    const { base, source, target } = fixture();
    const probe = write(base, 'console-cleanup-probe.mjs', `import {parseSetupOptions,runOnboarding} from ${JSON.stringify(moduleUrl)};
Object.defineProperty(process.stdin,'isTTY',{value:true});
Object.defineProperty(process.stdout,'isTTY',{value:true});
process.stdout.columns=80; process.stdin.isRaw=false;
process.stdin.setRawMode=mode=>{if(!mode)throw Object.assign(new Error('fixture console cleanup'),{code:${JSON.stringify(code)},syscall:'setRawMode'});process.stdin.isRaw=mode;return process.stdin;};
try {
  const result=await runOnboarding(${JSON.stringify(source)},parseSetupOptions([${JSON.stringify(target)},'--assistant','codex','--locale','en']),{
    cliConsoleCleanup:${allow},output:value=>{if(value==='Install this studio?')setImmediate(()=>process.stdin.emit('keypress','\\r',{name:'return'}));},
    verify:async()=>({ok:${verified},checks:[{synthetic:true}]})
  }); console.log(JSON.stringify({status:result.status,checks:result.verification.checks.length}));
} catch(error){console.log(JSON.stringify({status:'fatal',code:error.code,syscall:error.syscall}));}
await new Promise(resolve=>process.stdout.write('',resolve));process.exit(0);
`);
    const result = await new Promise((resolve, reject) => {
      const child = spawn(process.execPath, [probe], { cwd: base, stdio: ['pipe', 'pipe', 'pipe'], shell: false, windowsHide: true });
      let stdout = '', stderr = '';
      child.stdout.on('data', bytes => { stdout += bytes; });
      child.stderr.on('data', bytes => { stderr += bytes; });
      child.once('error', reject);
      child.once('close', exitCode => resolve({ exitCode, stdout, stderr }));
    });
    assert.equal(result.exitCode, 0, result.stderr);
    const outcome = JSON.parse(result.stdout.trim().split(/\r?\n/).at(-1));
    assert.equal(outcome.status, expected);
    if (expected === 'fatal') assert.equal(outcome.code, code);
    else assert.equal(outcome.checks, 1);
    assert.equal(fs.existsSync(path.join(target, '.agents/skills/olympox/SKILL.md')), true);
  }
});

test('verification exceptions preserve the installed studio and provide a repeatable command', async () => {
  const { base, source, target } = fixture(), output = [];
  const result = await runOnboarding(source, parseSetupOptions([target, '--assistant', 'both', '--yes', '--locale', 'pt-BR']), {
    cwd: base, isTTY: false, output: value => output.push(value), verify: async () => { throw new Error('Synthetic interrupted verifier'); }
  });
  assert.equal(result.status, 'verification-failed');
  assert.equal(fs.existsSync(path.join(target, '.agents/skills/olympox/SKILL.md')), true);
  assert.equal(fs.existsSync(path.join(target, '.claude/skills/olympox/SKILL.md')), true);
  assert.match(result.verification.error, /Synthetic interrupted/);
  assert.ok(output.some(line => /npm(?:\.cmd)? run verify/.test(line)));
  assert.ok(output.some(line => line.includes(target)));
  assert.ok(output.some(line => line.includes('instalados e preservados')));
});

test('onboarding language resources have matching keys and placeholders', () => {
  const [english, portuguese] = ['en', 'pt-BR'].map(locale => JSON.parse(fs.readFileSync(path.join(project, 'scripts/onboarding-locales', `${locale}.json`), 'utf8')));
  assert.deepEqual(Object.keys(english).sort(), Object.keys(portuguese).sort());
  for (const key of Object.keys(english)) {
    assert.equal(typeof portuguese[key], 'string');
    assert.deepEqual((english[key].match(/\{[a-z]+\}/g) ?? []).sort(), (portuguese[key].match(/\{[a-z]+\}/g) ?? []).sort());
  }
});
