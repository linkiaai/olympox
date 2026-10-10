#!/usr/bin/env node
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { TransferError, readTransferInput, planTransfer, transferStatus, inspectDestination, sendTransfer, reconcileTransfer, createNativeTransport } from './reference-transfer-core.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export function printHelp() {
  console.log(`Exact local reference transfer — independent studios

node scripts/reference-transfer.mjs plan <character-id> <spec.json>
node scripts/reference-transfer.mjs status <character-id> <transfer-id>
node scripts/reference-transfer.mjs destination
node scripts/reference-transfer.mjs send <character-id> <transfer-id> <grant.json>
node scripts/reference-transfer.mjs reconcile <character-id> <transfer-id> [observation.json]

plan/status are offline. plan preserves an exact private staged snapshot.
destination is a sanitized native read; it does not authenticate or select a workspace.
send needs an applicable exact-byte/destination grant and the pinned Windows x64 CLI.
Only image sends are verified; audio/video remain awaiting-verified-media-type.
Persisted submitting/uncertain outcomes forbid retry and new intents until reconciled.
reconcile only reads the original library; absence never proves no upload happened.
Receipts do not prove provider-byte equality, plugin access or generation readiness.
Use templates/reference-transfer.json and docs/higgsfield-setup.md.
No installation, login, generation, training or publication occurs here.`);
}
async function main() {
  const [command = 'help', ...args] = process.argv.slice(2);
  if (command === 'help') { if (args.length) throw new TransferError('help accepts no arguments.'); printHelp(); return; }
  let result;
  if (command === 'plan' && args.length === 2) result = planTransfer(root, args[0], readTransferInput(root, args[1]));
  else if (command === 'status' && args.length === 2) result = transferStatus(root, ...args);
  else if (command === 'destination' && !args.length) result = await inspectDestination(createNativeTransport(root));
  else if (command === 'send' && args.length === 3) result = await sendTransfer(root, args[0], args[1], readTransferInput(root, args[2]));
  else if (command === 'reconcile' && [2, 3].includes(args.length)) result = await reconcileTransfer(root, args[0], args[1], args[2] ? readTransferInput(root, args[2]) : null);
  else throw new TransferError('Unknown command or arguments; use help.');
  console.log(JSON.stringify(result, null, 2));
  if (result.state === 'uncertain' || result.state === 'submitting') process.exitCode = 2;
}
main().catch(error => { console.error(`Reference transfer: ${error instanceof TransferError ? error.message : 'Local operation failed; inspect the retained private intent before continuing.'}`); process.exitCode = 1; });
