#!/usr/bin/env node
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { createBytePlusProvider } from './providers/byteplus.mjs';
import { prepareJob, submitJob, pollJob, exportJob, reconcileJob, cancelJob, dispatchQueue, listJobs, setBudget, getBudget, readProviderInput } from './provider-execution-core.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export function printHelp() {
  console.log(`Optional provider execution — independent studios, own consumer accounts

node scripts/provider-execution.mjs capabilities
node scripts/provider-execution.mjs prepare <request.json>
node scripts/provider-execution.mjs submit <job-id> <authorization.json>
node scripts/provider-execution.mjs status <job-id>
node scripts/provider-execution.mjs export <job-id>
node scripts/provider-execution.mjs jobs
node scripts/provider-execution.mjs budget [budget.json]
node scripts/provider-execution.mjs reconcile <job-id> <receipt.json>
node scripts/provider-execution.mjs cancel <job-id> <event.json>
node scripts/provider-execution.mjs dispatch [maximum-jobs]

Preparation/capabilities are offline. No login, generation or publication on install.
BytePlus is an explicit experimental alternative; Higgsfield remains the default.
Consumers supply ARK_API_KEY and separate BYTEPLUS_SPEECH_API_KEY privately.
Submission needs an exact expiring grant and a numerical local USD budget.
Reservations constrain this executor; provider billing/account activity is separate.
Uncertain original submissions are never replayed automatically.
dispatch executes only already-authorized queued work, without renewing grants.
status may refresh original video outputs; export preserves new draft bytes.
Preset TTS is MP3 reference preparation; canonical voice conditioning stays pending.
No output automatically approves canon, completes a task or publishes.
Use docs/provider-execution.md and templates/provider-*.json.
Keep the shared execution ledger and character history together when backing up.`);
}
async function main() {
  const [requested = 'help', ...args] = process.argv.slice(2);
  const command = requested === '--help' ? 'help' : requested;
  if (command === 'help') { if (args.length) throw new Error('help accepts no arguments.'); printHelp(); return; }
  const credentials = { apiKey: process.env.ARK_API_KEY, speechApiKey: process.env.BYTEPLUS_SPEECH_API_KEY };
  const driver = createBytePlusProvider({ credentials });
  const outputKey = medium => {
    const key = medium === 'audio' ? credentials.speechApiKey : credentials.apiKey;
    if (!key) throw new Error('Configure your own provider credential for this medium.');
    return crypto.createHash('sha256').update('OLYMPOX private provider outputs v1\0').update(key).digest();
  };
  const options = { driver, outputKey };
  let result;
  if (command === 'capabilities' && !args.length) result = { ...driver.capabilities(), executor: { experimental: true, imageAudioReferenceBytes: true, videoReferences: 'pending-verified-transfer', presetTTS: 'reference-mp3-only', accountAccess: 'unverified', externalHardBudgetCap: 'unverified' } };
  else if (command === 'prepare' && args.length === 1) result = prepareJob(root, readProviderInput(root, args[0]), { driver });
  else if (command === 'submit' && args.length === 2) result = await submitJob(root, args[0], readProviderInput(root, args[1]), options);
  else if (command === 'status' && args.length === 1) result = await pollJob(root, args[0], options);
  else if (command === 'export' && args.length === 1) result = await exportJob(root, args[0], options);
  else if (command === 'jobs' && !args.length) result = listJobs(root);
  else if (command === 'budget' && args.length <= 1) result = args.length ? setBudget(root, readProviderInput(root, args[0])) : getBudget(root);
  else if (command === 'reconcile' && args.length === 2) result = reconcileJob(root, args[0], readProviderInput(root, args[1]));
  else if (command === 'cancel' && args.length === 2) result = cancelJob(root, args[0], readProviderInput(root, args[1]));
  else if (command === 'dispatch' && args.length <= 1) result = await dispatchQueue(root, { ...options, maxJobs: args.length ? Number(args[0]) : 1 });
  else throw new Error('Unknown command or arguments; use help.');
  console.log(JSON.stringify(result, null, 2));
  if ([result].flat().some(job => ['uncertain', 'submitting'].includes(job?.state))) process.exitCode = 2;
}
main().catch(error => { console.error(`Provider execution: ${error instanceof SyntaxError ? 'Invalid local JSON; inspect the private descriptor without copying secrets into logs.' : error.message}`); process.exitCode = 1; });
