#!/usr/bin/env node
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createOpenRouterClient } from './openrouter-client.mjs';
import { prepareVideo, describeReferenceUrl, sendVideo, videoStatus, exportVideo } from './openrouter-core.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export function printHelp() {
  console.log(`Optional OpenRouter video route — Seedance 2.5

node scripts/openrouter-local.mjs doctor
node scripts/openrouter-local.mjs models
node scripts/openrouter-local.mjs model <model-id>
node scripts/openrouter-local.mjs reference <url-env>
node scripts/openrouter-local.mjs prepare <spec.json>
node scripts/openrouter-local.mjs send <run-id> <spec.json>
node scripts/openrouter-local.mjs status <run-id>
node scripts/openrouter-local.mjs export <run-id> <output.mp4>

doctor checks OPENROUTER_API_KEY presence and its fingerprint; it does not authenticate.
models/model read public metadata. prepare reads local bytes without network calls.
send requires a matching captured readiness start and planned OpenRouter external intent.
It reads the current video catalog and sends exactly once, with no automatic retry.
status queries and reconciles the original job; export saves new original MP4 bytes.
reference fingerprints a dedicated reference URL environment variable without network calls.
Version 1 images use exact data URLs; version 2 adds audio/video via verified HTTPS bytes.
Signed URLs stay in environment variables. No file staging or storage upload occurs here.
No credentials are saved, no default provider is changed, and installation never sends.
See templates/openrouter-video.json, templates/openrouter-video-v2.json and docs/openrouter.md.`);
}

async function main() {
  const [command = 'help', ...args] = process.argv.slice(2);
  const client = createOpenRouterClient();
  let result;
  if (command === 'help' && !args.length) { printHelp(); return; }
  if (command === 'doctor' && !args.length) result = { configured: Boolean(process.env.OPENROUTER_API_KEY?.trim()), credentialFingerprint: process.env.OPENROUTER_API_KEY?.trim() ? client.credentialFingerprint() : null, authenticated: false, limitation: 'Credential fingerprint and environment presence only; this does not identify or authenticate an account. No provider was called.' };
  else if (command === 'models' && !args.length) result = await client.models();
  else if (command === 'model' && args.length === 1) result = await client.endpoints(args[0]);
  else if (command === 'reference' && args.length === 1) { const { url, ...safe } = describeReferenceUrl(args[0]); result = { ...safe, downloaded: false, limitation: 'URL fingerprint only; no bytes were fetched or sent.' }; }
  else if (command === 'prepare' && args.length === 1) { const prepared = prepareVideo(root, args[0]); result = { model: prepared.model, parameters: prepared.parameters, requestHash: prepared.requestHash, files: prepared.files, mediaInputs: prepared.mediaInputs, limitation: 'Offline preparation only; no HTTPS readback, reference acceptance, quote, authorization or generation was verified.' }; }
  else if (command === 'send' && args.length === 2) result = await sendVideo(root, args[0], args[1], client);
  else if (command === 'status' && args.length === 1) result = await videoStatus(root, args[0], client);
  else if (command === 'export' && args.length === 2) result = await exportVideo(root, args[0], args[1], client);
  else throw new Error('Unsupported OpenRouter command or arguments. Run node scripts/openrouter-local.mjs help.');
  console.log(JSON.stringify(result, null, 2));
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });
