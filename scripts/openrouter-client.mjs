import { createHash } from 'node:crypto';

const API_ROOT = 'https://openrouter.ai/api/v1';
const JSON_LIMIT = 4 * 1024 * 1024;
const VIDEO_LIMIT = 256 * 1024 * 1024;
const JOB_STATES = new Set(['pending', 'in_progress', 'completed', 'failed', 'cancelled', 'expired']);
const identifier = value => typeof value === 'string' && /^[a-zA-Z0-9][a-zA-Z0-9_-]{0,127}$/.test(value);
const modelIdentifier = value => typeof value === 'string' && /^[a-zA-Z0-9][a-zA-Z0-9._-]{0,127}\/[a-zA-Z0-9][a-zA-Z0-9._-]{0,127}$/.test(value);
const object = value => value !== null && typeof value === 'object' && !Array.isArray(value);

export class OpenRouterError extends Error {
  constructor(message, code, status = null) {
    super(message);
    this.name = 'OpenRouterError';
    this.code = code;
    this.status = status;
  }
}

function fail(message, code, status) { throw new OpenRouterError(message, code, status); }
function need(condition, message, code = 'INVALID_INPUT') { if (!condition) fail(message, code); }
async function cancel(body) { try { await body?.cancel(); } catch { /* The response is already being discarded. */ } }

async function readBounded(response, limit) {
  const length = response.headers.get('content-length');
  if (length !== null && /^\d+$/.test(length) && Number(length) > limit) {
    await cancel(response.body);
    fail('OpenRouter response exceeds the supported size.', 'RESPONSE_TOO_LARGE');
  }
  need(response.body?.getReader, 'OpenRouter returned an empty response.', 'INVALID_RESPONSE');
  const reader = response.body.getReader(), chunks = [];
  let size = 0;
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      need(value instanceof Uint8Array, 'OpenRouter returned an invalid response stream.', 'INVALID_RESPONSE');
      size += value.byteLength;
      if (size > limit) {
        try { await reader.cancel(); } catch { /* Preserve the bounded-response error. */ }
        fail('OpenRouter response exceeds the supported size.', 'RESPONSE_TOO_LARGE');
      }
      chunks.push(Buffer.from(value));
    }
    need(size > 0, 'OpenRouter returned an empty response.', 'INVALID_RESPONSE');
    return Buffer.concat(chunks, size);
  } finally {
    reader.releaseLock();
  }
}

function jobReceipt(value) {
  need(object(value) && identifier(value.id) && JOB_STATES.has(value.status), 'OpenRouter returned an invalid video job.', 'INVALID_RESPONSE');
  const generationId = value.generation_id ?? null;
  need(generationId === null || identifier(generationId), 'OpenRouter returned an invalid generation identifier.', 'INVALID_RESPONSE');
  const cost = value.usage?.cost ?? null;
  need(cost === null || (typeof cost === 'number' && Number.isFinite(cost) && cost >= 0), 'OpenRouter returned an invalid video cost.', 'INVALID_RESPONSE');
  return { id: value.id, status: value.status, generationId, cost };
}

export function createOpenRouterClient({ apiKey = process.env.OPENROUTER_API_KEY, fetchImpl = globalThis.fetch } = {}) {
  function checkAuthorization() {
    need(typeof apiKey === 'string' && /^[\x21-\x7e]{1,512}$/.test(apiKey), 'Set OPENROUTER_API_KEY before accessing video jobs.', 'KEY_REQUIRED');
  }
  async function request(relative, { payload, authenticated = false, content = false } = {}) {
    need(typeof fetchImpl === 'function', 'A supported HTTP client is required.', 'CLIENT_UNAVAILABLE');
    if (authenticated) checkAuthorization();
    const headers = { Accept: content ? 'video/mp4' : 'application/json' };
    if (authenticated) headers.Authorization = `Bearer ${apiKey}`;
    let body;
    if (payload !== undefined) {
      try { body = JSON.stringify(payload); } catch { fail('The video request must be serializable JSON.', 'INVALID_INPUT'); }
      headers['Content-Type'] = 'application/json';
    }
    try {
      const response = await fetchImpl(`${API_ROOT}${relative}`, {
        method: payload === undefined ? 'GET' : 'POST', headers,
        ...(body === undefined ? {} : { body }),
        redirect: 'error', signal: AbortSignal.timeout(content ? 120_000 : 30_000)
      });
      if (response.redirected) {
        await cancel(response.body);
        fail('OpenRouter redirects are refused.', 'REDIRECT_REFUSED');
      }
      if (!response.ok) {
        await cancel(response.body);
        const status = Number.isInteger(response.status) && response.status >= 100 && response.status <= 599 ? response.status : null;
        fail('OpenRouter rejected the request.', status ?? 'HTTP_ERROR', status);
      }
      if (content) {
        const contentType = response.headers.get('content-type')?.split(';', 1)[0].trim().toLowerCase();
        if (contentType !== 'video/mp4') {
          await cancel(response.body);
          fail('OpenRouter did not return MP4 video bytes.', 'INVALID_CONTENT_TYPE');
        }
        return { bytes: await readBounded(response, VIDEO_LIMIT), contentType };
      }
      const bytes = await readBounded(response, JSON_LIMIT);
      try { return JSON.parse(bytes.toString('utf8')); } catch { fail('OpenRouter returned invalid JSON.', 'INVALID_RESPONSE'); }
    } catch (error) {
      if (error instanceof OpenRouterError) throw error;
      fail('OpenRouter request could not be completed; reconcile an existing submission before retrying.', 'REQUEST_FAILED');
    }
  }

  return {
    checkAuthorization,
    credentialFingerprint() {
      checkAuthorization();
      return createHash('sha256').update(apiKey).digest('hex');
    },
    models: () => request('/videos/models'),
    endpoints(modelId) {
      need(modelIdentifier(modelId), 'Use a safe author/model identifier.');
      return request(`/models/${modelId}/endpoints`);
    },
    async submit(payload) {
      need(object(payload) && modelIdentifier(payload.model), 'The video request requires a safe author/model identifier.');
      return jobReceipt(await request('/videos', { payload, authenticated: true }));
    },
    async status(jobId) {
      need(identifier(jobId), 'Use a safe video job identifier.');
      const receipt = jobReceipt(await request(`/videos/${jobId}`, { authenticated: true }));
      need(receipt.id === jobId, 'OpenRouter returned a different video job.', 'INVALID_RESPONSE');
      return receipt;
    },
    content(jobId, index = 0) {
      need(identifier(jobId), 'Use a safe video job identifier.');
      need(Number.isSafeInteger(index) && index >= 0, 'Use a nonnegative integer video index.');
      return request(`/videos/${jobId}/content?index=${index}`, { authenticated: true, content: true });
    }
  };
}
