#!/usr/bin/env node
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createCredentialVault, credentialStatus, saveCredentialForStudio } from './provider-credentials.mjs';
import { readStudioSettings } from './studio-settings.mjs';
import { readSecret } from './secret-input.mjs';
import { isFrameworkDevelopment } from './development-context.mjs';

const messages = {
  en: {
    heading: 'BytePlus private local credential configuration',
    guide: 'Log in to your own BytePlus console and create/copy a ModelArk API key for the correct region/project. Browser login does not configure this executor. Never paste the key in chat or an argument.',
    unverified: 'Saved credentials configure this computer only; account/model access and billing remain unverified. This command makes no provider call.',
    unsupported: 'Protected persistent storage is unavailable on this platform. Configure later, or paste the key privately when an executor operation requests it; session input is never saved as plaintext.',
    missingSettings: 'Run guided studio setup to record the studio preference before saving a credential.',
    terminal: 'Run this connector in a private interactive terminal to paste keys without echo.',
    modelarkPrompt: 'ModelArk API key (hidden; Enter configures later): ',
    speechPrompt: 'Optional separate Speech API key (hidden; Enter skips): ',
    savedModelark: 'ModelArk credential saved with Windows CurrentUser protection. Original encrypted versions remain available for existing jobs.',
    savedSpeech: 'Speech credential saved with Windows CurrentUser protection.',
    deferred: 'Credential configuration deferred; the installed studio remains usable offline.',
    cancelled: 'Private connection cancelled; the installation and any already-saved encrypted version were preserved.',
    failure: 'Private credential configuration could not complete. No key or raw diagnostic was printed.',
    help: 'Hidden terminal paste; Windows CurrentUser encrypted storage outside the studio.\nNo login API, authentication probe, generation or publication.\nProcess environment overrides saved credentials; account access stays unverified.'
  },
  'pt-BR': {
    heading: 'Configuração local privada de credenciais BytePlus',
    guide: 'Entre no seu console BytePlus e crie/copie uma API key ModelArk da região/projeto correto. O login no navegador não configura este executor. Nunca cole a chave na conversa ou em um argumento.',
    unverified: 'As credenciais configuram somente este computador; acesso à conta/modelos e cobrança permanecem não verificados. Este comando não chama o provedor.',
    unsupported: 'Armazenamento persistente protegido indisponível nesta plataforma. Configure depois ou cole a chave em particular quando uma operação do executor pedir; a entrada da sessão nunca é salva como texto simples.',
    missingSettings: 'Execute o setup guiado do studio para registrar a preferência antes de salvar uma credencial.',
    terminal: 'Execute este conector em um terminal interativo privado para colar chaves sem exibição.',
    modelarkPrompt: 'API key ModelArk (oculta; Enter configura depois): ',
    speechPrompt: 'API key Speech separada e opcional (oculta; Enter pula): ',
    savedModelark: 'Credencial ModelArk salva com proteção do usuário atual do Windows. Versões cifradas originais continuam disponíveis para jobs existentes.',
    savedSpeech: 'Credencial Speech salva com proteção do usuário atual do Windows.',
    deferred: 'Configuração de credenciais adiada; o studio instalado continua utilizável offline.',
    cancelled: 'Conexão privada cancelada; a instalação e qualquer versão cifrada já salva foram preservadas.',
    failure: 'A configuração privada não pôde terminar. Nenhuma chave ou diagnóstico bruto foi exibido.',
    help: 'Colagem oculta no terminal; armazenamento cifrado do usuário atual do Windows fora do studio.\nSem API de login, teste de autenticação, geração ou publicação.\nO ambiente do processo substitui credenciais salvas; acesso à conta não verificado.'
  }
};
const API_KEY_GUIDE = 'https://docs.byteplus.com/en/docs/modelark/api-key';

export function printHelp(locale = 'en') {
  if (!Object.hasOwn(messages, locale)) throw new Error('Choose locale en or pt-BR.');
  const syntax = `
node scripts/provider-connect.mjs byteplus [--locale en|pt-BR]
node scripts/provider-connect.mjs status [--locale en|pt-BR]
node scripts/provider-connect.mjs help [--locale en|pt-BR]
`;
  console.log(syntax.trimStart() + '\n' + messages[locale].help);
}

/** Configure local secret storage only. This function never authenticates or fetches. */
export async function runProviderConnect(root, { locale = 'en', input = process.stdin, outputStream = process.stdout, output = message => outputStream.write(message + '\n'), readSecret: reader = readSecret, vault, env = process.env } = {}) {
  if (!Object.hasOwn(messages, locale)) throw new Error('Choose locale en or pt-BR.');
  if (isFrameworkDevelopment(root)) throw new Error('Credential connection requires an independent installed studio.');
  const text = messages[locale], store = vault ?? createCredentialVault({ env });
  store.assertOutsideStudio?.(root);
  const result = status => ({ status, ...credentialStatus(root, { env, vault: store }) });
  output(text.heading); output(text.guide); output(API_KEY_GUIDE); output(text.unverified);
  if (!readStudioSettings(root)) { output(text.missingSettings); return result('deferred'); }
  if (!store.supported) { output(text.unsupported); return result('unsupported'); }
  if (reader === readSecret && (!input?.isTTY || !outputStream?.isTTY)) { output(text.terminal); return result('deferred'); }
  let modelark;
  try { modelark = await reader({ input, outputStream, prompt: text.modelarkPrompt }); }
  catch { output(text.failure); return result('cancelled'); }
  if (modelark === null) { output(text.cancelled); return result('cancelled'); }
  if (modelark === '') { output(text.deferred); return result('deferred'); }
  try { await saveCredentialForStudio(root, 'modelark', modelark, { env, vault: store }); }
  catch { output(text.failure); return result('cancelled'); }
  modelark = null; output(text.savedModelark);
  let speech;
  try { speech = await reader({ input, outputStream, prompt: text.speechPrompt }); }
  catch { output(text.failure); return result('cancelled'); }
  if (speech === null) { output(text.cancelled); return result('cancelled'); }
  if (speech !== '') {
    try { await saveCredentialForStudio(root, 'speech', speech, { env, vault: store }); }
    catch { output(text.failure); return result('cancelled'); }
    speech = null; output(text.savedSpeech);
  }
  output(text.unverified); return result('configured');
}

function parse(args) {
  let operation = null, locale = 'en', localeSeen = false;
  for (let index = 0; index < args.length; index++) {
    if (args[index] === '--locale') {
      if (localeSeen || index + 1 >= args.length || !Object.hasOwn(messages, args[index + 1])) throw new Error('Choose one locale en or pt-BR.');
      localeSeen = true; locale = args[++index];
    } else if (!operation && ['byteplus', 'status', 'help', '--help', '-h'].includes(args[index])) operation = args[index];
    else throw new Error('Use provider-connect help; credential values are never arguments.');
  }
  return { operation: ['--help', '-h'].includes(operation) ? 'help' : operation ?? 'byteplus', locale };
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  try {
    const options = parse(process.argv.slice(2));
    if (options.operation === 'help') printHelp(options.locale);
    else if (options.operation === 'status') console.log(JSON.stringify(credentialStatus(root), null, 2));
    else if (options.operation === 'byteplus') console.log(JSON.stringify(await runProviderConnect(root, options), null, 2));
  } catch { console.error('Private provider connection failed. Use provider-connect help; no key or raw diagnostic was printed.'); process.exitCode = 1; }
}
