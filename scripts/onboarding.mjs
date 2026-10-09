import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import { planFrameworkInstall, installFramework } from './install-framework.mjs';

const messagesRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), 'onboarding-locales');
const hosts = ['codex', 'claude', 'both'];
const languages = ['en', 'pt-BR'];
const meaningful = value => typeof value === 'string' && value.trim().length > 0;

export function parseSetupOptions(args) {
  if (!Array.isArray(args) || !args.every(meaningful)) throw new Error('Setup arguments must be nonempty strings.');
  const options = { directory: null, assistant: null, locale: null, merge: false, yes: false };
  const seen = new Set();
  for (let index = 0; index < args.length; index++) {
    const value = args[index];
    if (!value.startsWith('-')) {
      if (options.directory !== null) throw new Error('Choose one independent studio directory.');
      options.directory = value;
    } else {
      if (!['--assistant', '--locale', '--merge', '--yes'].includes(value)) throw new Error(`Unknown setup option: ${value}.`);
      if (seen.has(value)) throw new Error(`Setup option repeated: ${value}.`);
      seen.add(value);
      if (value === '--merge') options.merge = true;
      else if (value === '--yes') options.yes = true;
      else {
        const selected = args[++index];
        if (!meaningful(selected) || selected.startsWith('-')) throw new Error(`${value} requires a value.`);
        if (value === '--assistant') {
          if (!hosts.includes(selected)) throw new Error('Choose --assistant codex, claude, or both.');
          options.assistant = selected;
        } else {
          if (!languages.includes(selected)) throw new Error('Choose --locale en or pt-BR.');
          options.locale = selected;
        }
      }
    }
  }
  return options;
}

function inside(root, target) {
  const relative = path.relative(root, target);
  return relative === '' || (!path.isAbsolute(relative) && relative !== '..' && !relative.startsWith('..' + path.sep));
}

function textFor(locale) {
  const messages = JSON.parse(fs.readFileSync(path.join(messagesRoot, `${locale}.json`), 'utf8'));
  return (key, values = {}) => messages[key].replace(/\{([a-z]+)\}/g, (_, field) => String(values[field] ?? `{${field}}`));
}

function terminalReader(input, output, cliConsoleCleanup) {
  const controller = new AbortController();
  const originalRawMode = input.isRaw;
  const interface_ = readline.createInterface({ input, output, terminal: Boolean(input.isTTY && output.isTTY) });
  const lines = [];
  let closed = false, pending = null, interrupted = false;
  const deliver = line => {
    if (pending) { const resolve = pending; pending = null; resolve(line); }
    else lines.push(line);
  };
  const cancel = () => {
    interrupted = true;
    lines.length = 0;
    controller.abort();
    if (pending) { const resolve = pending; pending = null; resolve(null); }
  };
  interface_.on('line', deliver);
  interface_.on('close', () => {
    closed = true;
    if (pending) { const resolve = pending; pending = null; resolve(null); }
  });
  interface_.on('SIGINT', cancel);
  process.on('SIGINT', cancel);
  return {
    signal: controller.signal,
    get interrupted() { return interrupted; },
    ask: async () => interrupted ? null : lines.length ? lines.shift() : closed ? null : new Promise(resolve => { pending = resolve; }),
    close() {
      process.removeListener('SIGINT', cancel);
      try {
        interface_.close();
        input.pause();
        const restoreRawMode = originalRawMode === true;
        if (input.isTTY && typeof input.setRawMode === 'function' && input.isRaw !== restoreRawMode) input.setRawMode(restoreRawMode);
      } catch (error) {
        const isolatedCliConsole = cliConsoleCleanup === true && process.platform === 'win32' && input === process.stdin && output === process.stdout && input.isTTY && output.isTTY;
        if (!isolatedCliConsole || !interface_.paused || !input.isPaused() || error.code !== 'EPERM' || error.syscall !== 'setRawMode') throw error;
        // Windows may deny a final console-mode reset after local checks. Only
        // the CLI may release its paused reader this way: it flushes and exits
        // immediately afterward. Embedded callers retain strict cleanup errors.
        interface_.terminal = false;
        interface_.close();
        input.pause();
      }
    }
  };
}

async function verifyInstallation(targetRoot, { signal, output, t, stdout, stderr }) {
  const checks = [];
  for (const [label, script, command] of [
    ['docsBuild', 'scripts/docs.mjs', 'build'],
    ['doctor', 'scripts/studio.mjs', 'doctor'],
    ['validate', 'scripts/studio.mjs', 'validate'],
    ['docsCheck', 'scripts/docs.mjs', 'check']
  ]) {
    output(`${t(label)}…`);
    if (signal?.aborted) return { ok: false, interrupted: true, checks };
    const result = await new Promise(resolve => {
      let settled = false;
      const finish = value => { if (!settled) { settled = true; resolve(value); } };
      let child;
      try {
        child = spawn(process.execPath, [script, command], { cwd: targetRoot, stdio: ['ignore', 'pipe', 'pipe'], shell: false, signal, windowsHide: true });
      } catch (error) { finish({ exitCode: null, signal: null, error: error.message }); return; }
      // Forward output without giving child Node processes the shared console.
      // Inheriting Windows console handles can invalidate the reader's raw mode.
      child.stdout.pipe(stdout, { end: false });
      child.stderr.pipe(stderr, { end: false });
      let childError = null;
      child.once('error', error => { childError = error.message; });
      child.once('close', (exitCode, childSignal) => finish({ exitCode, signal: childSignal, error: childError }));
    });
    checks.push({ script, command, ...result });
    if (result.exitCode !== 0) return { ok: false, interrupted: signal?.aborted ?? false, checks };
  }
  return { ok: true, checks };
}

/** Guided local setup. Provider authentication and creative production are separate. */
export async function runOnboarding(sourceRoot, parsedOptions, ioOverrides = {}) {
  const options = parsedOptions;
  if (!options || ![null, ...hosts].includes(options.assistant) || ![null, ...languages].includes(options.locale) || typeof options.merge !== 'boolean' || typeof options.yes !== 'boolean' || (options.directory !== null && !meaningful(options.directory))) throw new Error('Invalid parsed setup options. Use parseSetupOptions first.');
  const cwd = path.resolve(ioOverrides.cwd ?? process.cwd());
  const input = ioOverrides.input ?? process.stdin;
  const outputStream = ioOverrides.outputStream ?? process.stdout;
  const isTTY = ioOverrides.isTTY ?? Boolean(input.isTTY && outputStream.isTTY);
  const output = ioOverrides.output ?? (value => console.log(value));
  let locale = options.locale ?? 'en', t = textFor(locale), reader;
  const nodeVersion = ioOverrides.nodeVersion ?? process.version;
  const nodeMajor = typeof nodeVersion === 'string' ? /^v?(\d+)\./.exec(nodeVersion)?.[1] : null;
  if (nodeMajor === null || nodeMajor === undefined || Number(nodeMajor) < 22) throw new Error(t('nodeRequired', { version: nodeVersion }));
  if (options.yes && (!options.directory || !options.assistant)) throw new Error(t('explicitRequired'));
  if (!options.yes && !isTTY) throw new Error(t('nonTTY'));
  const source = path.resolve(sourceRoot);
  if (!options.yes && !ioOverrides.ask) reader = terminalReader(input, outputStream, ioOverrides.cliConsoleCleanup);
  const ask = ioOverrides.ask ?? (async () => reader.ask());
  const cancel = () => { output(t('cancelled')); return { status: 'cancelled', locale, filesWritten: false }; };
  async function question(id, message, choices, defaultValue) {
    for (;;) {
      output(message);
      for (let index = 0; index < choices.length; index++) output(`  ${index + 1}. ${choices[index].label} [${choices[index].value}]${choices[index].value === defaultValue ? ' *' : ''}`);
      if (!choices.length) output(`  [${defaultValue}]`);
      const answer = await ask({ id, message, choices, defaultValue });
      if (answer === null || answer === undefined || reader?.interrupted) return null;
      const selected = String(answer).trim();
      if (!selected) return defaultValue;
      if (!choices.length) return selected;
      const byValue = choices.find(choice => choice.value.toLowerCase() === selected.toLowerCase());
      const byIndex = /^\d+$/.test(selected) ? choices[Number(selected) - 1] : null;
      if (byValue || byIndex) return (byValue ?? byIndex).value;
      output(t('invalidChoice'));
    }
  }
  try {
    let frameworkVersion;
    try { frameworkVersion = JSON.parse(fs.readFileSync(path.join(source, 'package.json'), 'utf8')).version; }
    catch (error) { throw new Error(t('sourceFailed', { reason: error.message }), { cause: error }); }
    output(`${t('title')} (${frameworkVersion})`);
    if (!options.yes) output(t('inputHint'));
    if (!options.yes && !options.locale) {
      const selectedLocale = await question('locale', t('language'), [{ value: 'en', label: t('english') }, { value: 'pt-BR', label: t('portuguese') }], 'en');
      if (!selectedLocale) return cancel();
      locale = selectedLocale;
      t = textFor(locale);
    }
    let assistant = options.assistant;
    if (!assistant) {
      assistant = await question('assistant', t('assistant'), hosts.map(value => ({ value, label: t(value) })), 'codex');
      if (!assistant) return cancel();
    }
    const defaultDirectory = inside(source, cwd) ? path.join(path.dirname(source), 'olympox-studio') : path.join(cwd, 'olympox-studio');
    let directory = options.directory, merge = options.merge, plan;
    for (;;) {
      if (!directory) {
        directory = await question('directory', t('directory'), [], defaultDirectory);
        if (!directory) return cancel();
      }
      const target = path.resolve(cwd, directory);
      try {
        if (inside(source, target)) throw Object.assign(new Error(t('outsideSource')), { installationScope: 'destination' });
        plan = planFrameworkInstall(source, target, { assistant, merge });
        break;
      } catch (error) {
        if (error.installationScope !== 'destination') {
          if (error.installationScope === 'source') throw new Error(t('sourceFailed', { reason: error.message }), { cause: error });
          throw error;
        }
        if (options.yes) throw error;
        if (!merge && error.message.startsWith('Destination is not empty.')) {
          const action = await question('existing-directory', t('existingDirectory'), [{ value: 'another', label: t('anotherDirectory') }, { value: 'merge', label: t('merge') }, { value: 'cancel', label: t('cancel') }], 'another');
          if (!action || action === 'cancel') return cancel();
          if (action === 'merge') { merge = true; continue; }
          directory = null; merge = false; continue;
        }
        output(t('conflict', { reason: error.message }));
        const action = await question('destination-conflict', t('conflictAction'), [{ value: 'another', label: t('anotherDirectory') }, { value: 'cancel', label: t('cancel') }], 'another');
        if (!action || action === 'cancel') return cancel();
        directory = null; merge = false;
      }
    }
    output(t('summary'));
    output(t('summaryDirectory', { directory: plan.targetRoot }));
    output(t('summaryAssistant', { assistant: t(assistant) }));
    output(t('summaryLanguage', { language: t(locale === 'en' ? 'english' : 'portuguese') }));
    output(t('summaryMode', { mode: t(merge ? 'mergeMode' : 'fresh') }));
    output(t('summaryFiles', { copied: plan.copied.length, retained: plan.retained.length, total: plan.fileCount }));
    output(t('summaryVerification'));
    output(t('summaryProvider'));
    if (!options.yes) {
      const decision = await question('confirm', t('confirm'), [{ value: 'yes', label: t('yes') }, { value: 'no', label: t('no') }], 'yes');
      if (decision !== 'yes' || reader?.interrupted) return cancel();
    }
    const installation = installFramework(plan.sourceRoot, plan.targetRoot, { assistant: plan.assistant, merge: plan.merge, expectedPlanHash: plan.planHash });
    output(t('installed', { directory: installation.targetRoot }));
    output(t('verificationStart'));
    let verification;
    try {
      verification = await (ioOverrides.verify ?? verifyInstallation)(installation.targetRoot, { signal: reader?.signal, output, t, stdout: outputStream, stderr: ioOverrides.errorStream ?? process.stderr });
      if (!verification || typeof verification.ok !== 'boolean') throw new Error('Verification must return an ok boolean and its actual check results.');
    } catch (error) { verification = { ok: false, checks: [], error: error.message, interrupted: reader?.interrupted ?? false }; }
    output(t(verification.ok ? 'verified' : 'verificationFailed'));
    const verifyCommand = process.platform === 'win32' ? 'npm.cmd run verify' : 'npm run verify';
    output(t('fullVerify', { directory: installation.targetRoot }));
    output(`  ${verifyCommand}`);
    if (assistant !== 'claude') output(t('openCodex'));
    if (assistant !== 'codex') output(t('openClaude'));
    output(t('hostNote'));
    output(t('firstPrompt'));
    output(t('prompt'));
    return { status: verification.ok ? 'installed' : 'verification-failed', ...installation, locale, verification, providerReadiness: 'pending', firstPrompt: t('prompt'), nextInvocations: assistant === 'both' ? ['$olympox', '/olympox'] : [assistant === 'codex' ? '$olympox' : '/olympox'] };
  } finally { await reader?.close(); }
}
