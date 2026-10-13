import { createHash } from 'node:crypto';

// ENG-006. Schemas: docs.byteplus.com/en/docs/modelark/{image-generation-api,
// create-video-generation-task-api,get-video-generation-task-api};
// docs.byteplus.com/en/docs/byteplusvoice/unidirectional_tts_http.
export const BYTEPLUS_MODELS = Object.freeze({
  image: 'dola-seedream-5-0-pro-260628',
  imageLite: 'seedream-5-0-lite-260128',
  video: 'dreamina-seedance-2-5-260628',
  audio: 'seed-tts-2.0',
});
export const BYTEPLUS_API_ORIGINS = Object.freeze([
  'https://ark.ap-southeast.bytepluses.com',
  'https://voice.ap-southeast-1.bytepluses.com',
]);
export const BYTEPLUS_OUTPUT_HOST_SUFFIXES = Object.freeze([
  'bytepluscdn.com', 'bytepluses.com', 'volces.com', 'volccdn.com',
]);
const ARK = `${BYTEPLUS_API_ORIGINS[0]}/api/v3`;
const SPEECH = `${BYTEPLUS_API_ORIGINS[1]}/api/v3/tts/unidirectional`;
const INLINE_LIMIT = 30 * 1024 * 1024;
const RESPONSE_LIMIT = 64 * 1024 * 1024;
const STATES = ['queued', 'running', 'succeeded', 'failed', 'cancelled', 'expired'];
const DIMENSIONS = {
  '480p': { '16:9': [854, 480], '4:3': [752, 560], '1:1': [640, 640], '3:4': [560, 752], '9:16': [480, 854], '21:9': [992, 432] },
  '720p': { '16:9': [1280, 720], '4:3': [1112, 834], '1:1': [960, 960], '3:4': [834, 1112], '9:16': [720, 1280], '21:9': [1470, 630] },
  '1080p': { '16:9': [1920, 1080], '4:3': [1664, 1248], '1:1': [1440, 1440], '3:4': [1248, 1664], '9:16': [1080, 1920], '21:9': [2206, 946] },
};

export class BytePlusProviderError extends Error {
  constructor(category, { outcomeUnknown = false, httpStatus = null } = {}) {
    super(`BytePlus ${category}.`);
    this.name = 'BytePlusProviderError';
    this.category = category;
    this.code = category;
    this.outcomeUnknown = outcomeUnknown;
    this.httpStatus = httpStatus;
    this.retryable = false;
  }
}
const fail = category => { throw new BytePlusProviderError(category); };
const hash = value => createHash('sha256').update(value).digest('hex');
function object(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
    && [Object.prototype, null].includes(Object.getPrototypeOf(value));
}
function keys(value, allowed) {
  if (!object(value) || Object.keys(value).some(key => !allowed.includes(key))) fail('unsupported-fields');
}
function choice(value, allowed) {
  if (!allowed.includes(value)) fail('unsupported-parameter');
  return value;
}
function boolean(value) {
  if (typeof value !== 'boolean') fail('invalid-parameter');
  return value;
}
function integer(value, low, high) {
  if (!Number.isSafeInteger(value) || value < low || value > high) fail('invalid-parameter');
  return value;
}
function token(value) {
  if (typeof value !== 'string' || !/^[a-zA-Z0-9_.-]{1,160}$/.test(value)) fail('invalid-identifier');
  return value;
}
function base64(value) {
  if (typeof value !== 'string' || value.length === 0 || value.length > RESPONSE_LIMIT
      || value.length % 4 !== 0 || !/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(value)) fail('invalid-media-encoding');
  const bytes = Buffer.from(value, 'base64');
  if (bytes.toString('base64') !== value) fail('invalid-media-encoding');
  return bytes;
}
function https(value, output = false) {
  let url;
  try { url = new URL(value); } catch { fail('invalid-media-url'); }
  if (url.protocol !== 'https:' || url.username || url.password || url.port && url.port !== '443'
      || url.hostname === 'localhost' || /^[\d.]+$/.test(url.hostname) || url.hostname.includes(':')) fail('invalid-media-url');
  if (output && !BYTEPLUS_OUTPUT_HOST_SUFFIXES.some(suffix => url.hostname === suffix || url.hostname.endsWith(`.${suffix}`))) fail('untrusted-output-url');
  return url.href;
}
function references(input) {
  if (!Array.isArray(input) || input.length > 50) fail('invalid-references');
  const seen = new Set();
  let total = 0;
  return input.map((ref, index) => {
    keys(ref, ['kind', 'role', 'dataUrl', 'url', 'sha256', 'bytes', 'referenceId', 'order']);
    choice(ref.kind, ['image', 'audio', 'video']);
    const order = integer(ref.order ?? index, 0, 10000);
    if (seen.has(order)) fail('duplicate-reference-order');
    seen.add(order);
    if (ref.kind === 'video') {
      if (ref.dataUrl !== undefined || typeof ref.url !== 'string'
          || !/^[a-f0-9]{64}$/.test(ref.sha256 ?? '') || !Number.isSafeInteger(ref.bytes) || ref.bytes <= 0
          || typeof ref.referenceId !== 'string' || !ref.referenceId) fail('missing-video-binding');
      const url = /^asset:\/\/[a-zA-Z0-9_-]{1,160}$/.test(ref.url) ? ref.url : https(ref.url);
      return { ...ref, order, url };
    }
    if (ref.url !== undefined || typeof ref.dataUrl !== 'string' || ref.dataUrl.length > INLINE_LIMIT * 1.4) fail('inline-reference-required');
    const match = /^data:((?:image|audio)\/[a-z0-9_.+-]+);base64,([A-Za-z0-9+/=]+)$/.exec(ref.dataUrl);
    if (!match || !match[1].startsWith(`${ref.kind}/`)) fail('invalid-media-encoding');
    const allowed = ref.kind === 'image' ? ['image/jpeg', 'image/png', 'image/webp', 'image/bmp', 'image/tiff', 'image/gif', 'image/heic', 'image/heif']
      : ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/x-wav', 'audio/ogg', 'audio/mp4', 'audio/aac'];
    choice(match[1], allowed);
    const bytes = base64(match[2]);
    total += bytes.length;
    if (total > INLINE_LIMIT) fail('inline-reference-limit');
    const sha256 = hash(bytes);
    if (ref.bytes !== undefined && ref.bytes !== bytes.length || ref.sha256 !== undefined && ref.sha256 !== sha256) fail('reference-drift');
    return { ...ref, order, bytes: bytes.length, sha256 };
  }).sort((a, b) => a.order - b.order);
}
function imageSize(value, lite) {
  const levels = lite ? ['2K', '3K', '4K'] : ['1K', '1.5K', '2K'];
  if (levels.includes(value)) return value;
  const match = /^(\d{2,5})x(\d{2,5})$/.exec(value ?? '');
  if (!match) fail('invalid-image-size');
  const width = Number(match[1]), height = Number(match[2]), pixels = width * height;
  if (width / height < 1 / 16 || width / height > 16
      || pixels < (lite ? 3686400 : 921600) || pixels > (lite ? 16777216 : 4624220)) fail('invalid-image-size');
  return value;
}
function imagePayload(request, refs) {
  const lite = request.model === BYTEPLUS_MODELS.imageLite, params = request.parameters ?? {};
  keys(params, ['size', 'response_format', 'output_format', 'watermark', 'sequential_image_generation', 'sequential_image_generation_options']);
  if (refs.some(ref => ref.kind !== 'image' || ref.role !== 'reference_image') || refs.length > (lite ? 14 : 10)) fail('unsupported-image-references');
  const payload = {
    model: request.model, prompt: request.prompt, size: imageSize(params.size ?? '2K', lite),
    response_format: choice(params.response_format ?? 'b64_json', ['url', 'b64_json']),
    output_format: choice(params.output_format ?? 'png', ['png', 'jpeg']),
    watermark: boolean(params.watermark ?? false),
  };
  if (refs.length) payload.image = refs.length === 1 ? refs[0].dataUrl : refs.map(ref => ref.dataUrl);
  if (!lite && (params.sequential_image_generation !== undefined || params.sequential_image_generation_options !== undefined)) fail('unsupported-image-batch');
  if (lite) {
    payload.sequential_image_generation = choice(params.sequential_image_generation ?? 'disabled', ['disabled', 'auto']);
    if (params.sequential_image_generation_options !== undefined) {
      keys(params.sequential_image_generation_options, ['max_images']);
      if (payload.sequential_image_generation !== 'auto') fail('invalid-image-batch');
      const max = integer(params.sequential_image_generation_options.max_images, 1, 15);
      if (max + refs.length > 15) fail('invalid-image-batch');
      payload.sequential_image_generation_options = { max_images: max };
    } else if (payload.sequential_image_generation === 'auto') {
      // Always send an explicit image-count ceiling, including when the API has a default.
      payload.sequential_image_generation_options = { max_images: 15 - refs.length };
    }
  }
  return payload;
}
function videoPayload(request, refs) {
  const params = request.parameters ?? {};
  keys(params, ['duration', 'ratio', 'resolution', 'generate_audio', 'watermark', 'output_format', 'omni_reference_task_type']);
  const imageRefs = refs.filter(ref => ref.kind === 'image'), audioRefs = refs.filter(ref => ref.kind === 'audio'), videoRefs = refs.filter(ref => ref.kind === 'video');
  if (imageRefs.length > 30 || audioRefs.length > 10 || videoRefs.length > 10) fail('reference-count-limit');
  for (const ref of refs) choice(ref.role, ref.kind === 'image' ? ['reference_image', 'first_frame', 'last_frame']
    : ref.kind === 'audio' ? ['reference_audio', 'voice'] : ['reference_video']);
  const first = imageRefs.filter(ref => ref.role === 'first_frame'), last = imageRefs.filter(ref => ref.role === 'last_frame');
  if (first.length > 1 || last.length > 1 || last.length && !first.length
      || first.length && (imageRefs.length !== first.length + last.length || videoRefs.length || audioRefs.length)) fail('unsupported-frame-combination');
  const mode = choice(params.omni_reference_task_type ?? 'reference', ['reference', 'edit', 'extend']);
  if (mode !== 'reference' && !videoRefs.length) fail('video-input-required');
  const ratio = choice(params.ratio ?? (first.length || mode !== 'reference' ? 'adaptive' : '16:9'), [...Object.keys(DIMENSIONS['480p']), 'adaptive']);
  if ((first.length || mode !== 'reference') && ratio !== 'adaptive') fail('adaptive-ratio-required');
  const audio = boolean(params.generate_audio ?? request.hasSpeech ?? false);
  if (request.hasSpeech && (!audio || !audioRefs.length)) fail('canonical-audio-required');
  if (audioRefs.length && !audio) fail('audio-generation-required');
  const duration = params.duration === -1 ? -1 : integer(params.duration ?? 5, 4, 30);
  const content = [{ type: 'text', text: request.prompt }, ...refs.map(ref => {
    const type = `${ref.kind}_url`;
    return { type, [type]: { url: ref.kind === 'video' ? ref.url : ref.dataUrl }, role: ref.role === 'voice' ? 'reference_audio' : ref.role };
  })];
  const payload = {
    model: request.model, content, duration, ratio,
    resolution: choice(params.resolution ?? '720p', ['480p', '720p', '1080p']),
    generate_audio: audio, watermark: boolean(params.watermark ?? false),
    output_format: choice(params.output_format ?? 'mp4', ['mp4', 'mov']),
  };
  // The task hint applies to omni-reference generation, not first/last-frame tasks.
  if (!first.length && (refs.length || params.omni_reference_task_type !== undefined)) payload.omni_reference_task_type = mode;
  return payload;
}
function audioPayload(request, refs) {
  const params = request.parameters ?? {};
  keys(params, ['speaker_id', 'service_resource', 'format', 'sample_rate', 'speech_rate', 'loudness_rate', 'language']);
  if (refs.length) fail('tts-reference-unsupported');
  if (params.service_resource !== undefined && params.service_resource !== BYTEPLUS_MODELS.audio) fail('voice-cloning-unsupported');
  const audio = {
    format: choice(params.format ?? 'mp3', ['mp3', 'ogg_opus', 'pcm']),
    sample_rate: choice(params.sample_rate ?? 24000, [8000, 16000, 22050, 24000, 32000, 44100, 48000]),
    speech_rate: integer(params.speech_rate ?? 0, -50, 100),
    loudness_rate: integer(params.loudness_rate ?? 0, -50, 100),
  };
  const additions = {};
  if (params.language !== undefined) additions.explicit_language = choice(String(params.language).toLowerCase(), ['zh-cn', 'en', 'ja', 'es-mx', 'es', 'id', 'pt-br', 'pt', 'ko', 'it', 'de', 'fr', 'th', 'vi', 'ru', 'fil', 'ms', 'ar', 'pl', 'tr', 'sv']);
  return { req_params: { text: request.prompt, speaker: token(params.speaker_id), audio_params: audio, additions: JSON.stringify(additions) } };
}
function prepare(request) {
  keys(request, ['provider', 'medium', 'purpose', 'model', 'prompt', 'parameters', 'references', 'hasSpeech']);
  if (request.provider !== 'byteplus' || typeof request.purpose !== 'string' || !request.purpose
      || typeof request.prompt !== 'string' || !request.prompt.trim()) fail('invalid-request');
  if (request.hasSpeech !== undefined) boolean(request.hasSpeech);
  choice(request.medium, ['image', 'video', 'audio']);
  const models = request.medium === 'image' ? [BYTEPLUS_MODELS.image, BYTEPLUS_MODELS.imageLite] : [BYTEPLUS_MODELS[request.medium]];
  if (!models.includes(request.model)) fail('model-unavailable');
  const refs = references(request.references ?? []);
  const payload = request.medium === 'image' ? imagePayload(request, refs) : request.medium === 'video' ? videoPayload(request, refs) : audioPayload(request, refs);
  return {
    provider: 'byteplus', medium: request.medium, model: request.model, payload,
    endpoint: request.medium === 'image' ? `${ARK}/images/generations` : request.medium === 'video' ? `${ARK}/contents/generations/tasks` : SPEECH,
    referenceBindings: refs.map(ref => ({ kind: ref.kind, role: ref.role, order: ref.order, referenceId: ref.referenceId ?? null, sha256: ref.sha256, bytes: ref.bytes })),
  };
}
function quote(prepared) {
  const result = { currency: 'USD', amount: null, maxEstimate: null, guaranteed: false, pricingDate: '2026-10-08', basis: 'unverified-current-price', assumptions: ['Account entitlement and current tariffs are not verified.', 'This estimate is not a provider-enforced spending limit.'] };
  if (prepared.medium !== 'video') return result;
  const payload = prepared.payload, dimensions = DIMENSIONS[payload.resolution][payload.ratio];
  if (!dimensions || payload.duration === -1 || prepared.referenceBindings.some(ref => ref.kind === 'video')) {
    result.basis = 'unknown-dimensions-duration-or-input-video';
    return result;
  }
  const tokens = Math.ceil(dimensions[0] * dimensions[1] * payload.duration * 24 / 1024);
  const rate = payload.resolution === '1080p' ? 11.7 : 10.7;
  return { ...result, amount: Math.ceil(tokens * rate) / 1000000, basis: 'published-video-token-rate', tokens, ratePerMillion: rate, assumptions: [...result.assumptions, '24 fps, fixed documented output dimensions, no input video; taxes and account discounts excluded.'] };
}
async function boundedText(response) {
  if (Number(response.headers?.get?.('content-length')) > RESPONSE_LIMIT) fail('response-limit');
  if (!response.body?.getReader) {
    const text = await response.text();
    if (Buffer.byteLength(text) > RESPONSE_LIMIT) fail('response-limit');
    return text;
  }
  const reader = response.body.getReader(), chunks = [];
  let count = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      count += value.byteLength;
      if (count > RESPONSE_LIMIT) { await reader.cancel(); fail('response-limit'); }
      chunks.push(Buffer.from(value));
    }
  } finally { reader.releaseLock(); }
  return Buffer.concat(chunks).toString('utf8');
}
function usage(value) {
  const tokens = value?.total_tokens ?? value?.completion_tokens;
  return Number.isSafeInteger(tokens) && tokens >= 0 ? { tokens } : {};
}
function resultBase(prepared) {
  return { provider: 'byteplus', medium: prepared.medium, model: prepared.model, outputs: [], usage: {}, actualCost: null };
}
function decode(prepared, text, receipt) {
  if (prepared.medium === 'audio') {
    const chunks = [], lines = text.trim().split(/\r?\n/), format = prepared.payload.req_params.audio_params.format;
    let completed = false;
    for (const line of lines) {
      const item = JSON.parse(line);
      if (item.code === 20000000) { completed = true; continue; }
      if (completed || item.code !== 0) throw new BytePlusProviderError(item.code === 45000000 ? 'speaker-access-denied' : 'speech-failed');
      if (item.data) chunks.push(base64(item.data));
    }
    if (!completed || !chunks.length) fail('ambiguous-response');
    return { ...resultBase(prepared), status: 'succeeded', outputs: [{ kind: 'audio', mimeType: format === 'mp3' ? 'audio/mpeg' : format === 'ogg_opus' ? 'audio/ogg' : 'audio/pcm', data: Buffer.concat(chunks), sampleRate: prepared.payload.req_params.audio_params.sample_rate }] };
  }
  const value = JSON.parse(text);
  if (!object(value) || value.error || value.model !== undefined && value.model !== prepared.model) fail('ambiguous-response');
  if (prepared.medium === 'image') {
    if (!Array.isArray(value.data) || !value.data.length || value.data.length > (prepared.payload.sequential_image_generation_options?.max_images ?? 1)) fail('ambiguous-response');
    const outputs = value.data.filter(item => !item.error).map(item => {
      const output = { kind: 'image', mimeType: (item.output_format ?? prepared.payload.output_format) === 'jpeg' ? 'image/jpeg' : 'image/png' };
      if (typeof item.b64_json === 'string') output.data = base64(item.b64_json);
      else if (typeof item.url === 'string') output.url = https(item.url, true);
      else fail('ambiguous-response');
      return output;
    });
    return { ...resultBase(prepared), status: outputs.length === value.data.length ? 'succeeded' : 'failed', outputs, usage: usage(value.usage) };
  }
  const jobId = token(value.id);
  if (receipt && jobId !== receipt.jobId) fail('job-binding-mismatch');
  const status = value.status ?? 'queued';
  if (!STATES.includes(status)) fail('ambiguous-response');
  const outputs = [];
  if (status === 'succeeded') {
    if (typeof value.content?.video_url !== 'string') fail('ambiguous-response');
    const url = https(value.content.video_url, true);
    const format = value.output_format ?? prepared.payload?.output_format ?? (/\.mov$/i.test(new URL(url).pathname) ? 'mov' : 'mp4');
    choice(format, ['mp4', 'mov']);
    outputs.push({ kind: 'video', mimeType: format === 'mov' ? 'video/quicktime' : 'video/mp4', url });
  }
  return { ...resultBase(prepared), jobId, status, outputs, usage: usage(value.usage) };
}

export function createBytePlusProvider(options = {}) {
  keys(options, ['fetch', 'credentials', 'region', 'timeoutMs']);
  const fetchImpl = options.fetch ?? globalThis.fetch, timeoutMs = integer(options.timeoutMs ?? 30000, 1, 300000);
  if (typeof fetchImpl !== 'function') fail('missing-http-transport');
  choice(options.region ?? 'ap-southeast-1', ['ap-southeast-1']);
  const credentials = options.credentials ?? { apiKey: process.env.ARK_API_KEY, speechApiKey: process.env.BYTEPLUS_SPEECH_API_KEY };
  keys(credentials, ['apiKey', 'speechApiKey']);
  for (const value of Object.values(credentials)) if (value !== undefined && value !== null && value !== ''
      && (typeof value !== 'string' || !/^[\x21-\x7e]{1,4096}$/.test(value))) fail('invalid-credentials');
  const effectiveKeys = { image: credentials.apiKey || null, video: credentials.apiKey || null, audio: credentials.speechApiKey || null };
  function credentialFingerprint(medium) {
    choice(medium, ['image', 'video', 'audio']);
    return effectiveKeys[medium] ? hash(`byteplus\0${medium === 'audio' ? 'speech' : 'ark'}\0${effectiveKeys[medium]}`) : null;
  }
  async function call(prepared, method, endpoint, { signal } = {}, receipt) {
    if (signal !== undefined && !(signal instanceof AbortSignal)) fail('invalid-signal');
    if (signal?.aborted) throw new BytePlusProviderError('aborted');
    const key = effectiveKeys[prepared.medium];
    if (!key) fail('missing-credentials');
    if (receipt?.credentialFingerprint && receipt.credentialFingerprint !== credentialFingerprint(prepared.medium)) fail('credential-binding-mismatch');
    const post = method === 'POST', controller = new AbortController();
    const combined = signal ? AbortSignal.any([signal, controller.signal]) : controller.signal;
    // X-Api-App-Key is the public fixed service identifier in the TTS header table.
    // X-Api-Key always carries this consumer's private speech credential.
    const headers = prepared.medium === 'audio'
      ? { 'X-Api-Key': key, 'X-Api-Resource-Id': BYTEPLUS_MODELS.audio, 'X-Api-App-Key': 'aGjiRDfUWi', 'Content-Type': 'application/json' }
      : { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' };
    let timer, abortListener;
    const interrupted = new Promise((resolve, reject) => {
      timer = setTimeout(() => { controller.abort(); reject(new BytePlusProviderError('timeout', { outcomeUnknown: post })); }, timeoutMs);
      if (signal) {
        abortListener = () => reject(new BytePlusProviderError('aborted', { outcomeUnknown: post }));
        signal.addEventListener('abort', abortListener, { once: true });
      }
    });
    const execute = async () => {
      const response = await fetchImpl(endpoint, { method, headers, redirect: 'error', signal: combined, ...(post ? { body: JSON.stringify(prepared.payload) } : {}) });
      if (!response || !Number.isInteger(response.status)) fail('ambiguous-response');
      if (response.status < 200 || response.status >= 300) {
        const status = response.status, category = status === 401 || status === 403 ? 'authentication-failed' : status === 404 ? 'model-unavailable' : status === 429 ? 'rate-limit' : status >= 500 ? 'provider-failed' : status >= 300 && status < 400 ? 'unexpected-redirect' : 'request-rejected';
        throw new BytePlusProviderError(category, { outcomeUnknown: post && (status >= 500 || status >= 300 && status < 400), httpStatus: status });
      }
      try { return decode(prepared, await boundedText(response), receipt); }
      catch (error) {
        if (error instanceof BytePlusProviderError && ['speaker-access-denied', 'speech-failed'].includes(error.category)) throw error;
        throw new BytePlusProviderError(error instanceof BytePlusProviderError ? error.category : 'ambiguous-response', { outcomeUnknown: post });
      }
    };
    try { return await Promise.race([execute(), interrupted]); }
    catch (error) {
      if (error instanceof BytePlusProviderError) throw error;
      throw new BytePlusProviderError('transport-failed', { outcomeUnknown: post });
    } finally { clearTimeout(timer); if (signal && abortListener) signal.removeEventListener('abort', abortListener); }
  }
  return {
    capabilities() {
      return {
        provider: 'byteplus', region: 'ap-southeast-1', accountAccess: 'unverified',
        models: { image: [BYTEPLUS_MODELS.image, BYTEPLUS_MODELS.imageLite], video: [BYTEPLUS_MODELS.video], audio: [BYTEPLUS_MODELS.audio] },
        configured: Object.fromEntries(Object.entries(effectiveKeys).map(([medium, key]) => [medium, Boolean(key)])),
        inlineBytesLimit: INLINE_LIMIT, responseBytesLimit: RESPONSE_LIMIT, voiceCloning: false,
        imageBatch: { pro: false, lite: true, maximumInputAndOutputImages: 15 },
        referenceTransport: { image: 'exact-inline-data-url', audio: 'exact-inline-data-url', video: 'verified-https-or-asset-binding' },
        limitations: ['Documented schemas do not verify account access or identity fidelity.', 'Preset TTS does not accept a canonical voice file or clone a voice.', 'Remote video bindings require independent transfer and duration verification.'],
      };
    },
    credentialFingerprint,
    validate: prepare,
    estimate(request) { return quote(prepare(request)); },
    async submit(request, options) {
      const prepared = prepare(request);
      return { ...await call(prepared, 'POST', prepared.endpoint, options), estimatedCost: quote(prepared) };
    },
    async getStatus(receipt, options) {
      if (!object(receipt) || receipt.provider !== 'byteplus' || receipt.medium !== 'video' || receipt.model !== BYTEPLUS_MODELS.video) fail('unsupported-status-receipt');
      token(receipt.jobId);
      if (receipt.outputFormat !== undefined) choice(receipt.outputFormat, ['mp4', 'mov']);
      const prepared = { provider: 'byteplus', medium: 'video', model: receipt.model, payload: { output_format: receipt.outputFormat } };
      return call(prepared, 'GET', `${ARK}/contents/generations/tasks/${receipt.jobId}`, options, receipt);
    },
  };
}
