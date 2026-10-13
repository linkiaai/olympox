import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { createBytePlusProvider, BytePlusProviderError, BYTEPLUS_MODELS, BYTEPLUS_API_ORIGINS, BYTEPLUS_OUTPUT_HOST_SUFFIXES } from '../scripts/providers/byteplus.mjs';

const secret = 'synthetic-key-never-print';
const speechSecret = 'synthetic-speech-key-never-print';
const visualBytes = Buffer.from('Independent synthetic exact image oracle\0\xff', 'latin1');
const voiceBytes = Buffer.from('Independent synthetic approved audio oracle\0\x80', 'latin1');
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
function ref(kind = 'image', role = 'reference_image', order = 0, bytes = visualBytes) {
  return { kind, role, order, referenceId: `reference-${order}`, bytes: bytes.length, sha256: sha(bytes), dataUrl: `data:${kind}/${kind === 'image' ? 'png' : 'wav'};base64,${bytes.toString('base64')}` };
}
function request(medium = 'image', overrides = {}) {
  return { provider: 'byteplus', medium, purpose: 'reference', model: BYTEPLUS_MODELS[medium], prompt: 'Independent synthetic scene', parameters: {}, references: [], hasSpeech: false, ...overrides };
}
const json = (value, status = 200) => new Response(JSON.stringify(value), { status, headers: { 'Content-Type': 'application/json' } });
function fixture(responses, options = {}) {
  const calls = [];
  const fetch = async (url, init) => {
    calls.push({ url, init, payload: init.body ? JSON.parse(init.body) : null });
    const value = responses[calls.length - 1];
    return typeof value === 'function' ? value(url, init) : value;
  };
  return { calls, driver: createBytePlusProvider({ fetch, credentials: { apiKey: secret, speechApiKey: speechSecret }, ...options }) };
}

test('offline capabilities, parameter validation and prices neither authenticate nor expose consumer credentials', () => {
  const f = fixture([]);
  const capabilities = f.driver.capabilities();
  assert.deepEqual(capabilities.configured, { image: true, video: true, audio: true });
  assert.equal(capabilities.voiceCloning, false);
  assert.equal(capabilities.accountAccess, 'unverified');
  assert.deepEqual(capabilities.models.image, [BYTEPLUS_MODELS.image, BYTEPLUS_MODELS.imageLite]);
  const quote = f.driver.estimate(request('video', { parameters: { duration: 5, resolution: '480p', ratio: '16:9' } }));
  assert.equal(quote.tokens, 48038);
  assert.equal(quote.amount, 0.514007);
  assert.equal(quote.maxEstimate, null);
  assert.equal(quote.guaranteed, false);
  assert.equal(f.driver.estimate(request()).amount, null);
  assert.equal(f.driver.estimate(request('video', { parameters: { ratio: 'adaptive' } })).amount, null);
  assert.equal(f.driver.estimate(request('video', { parameters: { duration: -1 } })).amount, null);
  assert.equal(f.calls.length, 0);
  assert.doesNotMatch(JSON.stringify(capabilities), /synthetic-key|synthetic-speech-key/);
  assert.match(f.driver.credentialFingerprint('video'), /^[a-f0-9]{64}$/);
  assert.equal(f.driver.credentialFingerprint('image'), f.driver.credentialFingerprint('video'));
  assert.notEqual(f.driver.credentialFingerprint('audio'), f.driver.credentialFingerprint('video'));
  const empty = fixture([], { credentials: {} });
  assert.equal(empty.driver.credentialFingerprint('video'), null);
  assert.equal(empty.driver.validate(request()).model, BYTEPLUS_MODELS.image);
  assert.deepEqual(empty.driver.capabilities().configured, { image: false, video: false, audio: false });
});

test('Seedream HTTP request preserves exact ordered original bytes and extracts exact returned image bytes', async () => {
  const output = Buffer.from('Independent generated image bytes\x00', 'latin1');
  const f = fixture([json({ model: BYTEPLUS_MODELS.image, data: [{ b64_json: output.toString('base64'), output_format: 'png' }], usage: { total_tokens: 41 } })]);
  const a = ref(), b = ref('image', 'reference_image', 1, Buffer.from('Second independent image'));
  const result = await f.driver.submit(request('image', { references: [b, a], parameters: { size: '1.5K', watermark: false } }));
  assert.equal(f.calls.length, 1);
  assert.equal(f.calls[0].url, `${BYTEPLUS_API_ORIGINS[0]}/api/v3/images/generations`);
  assert.equal(f.calls[0].init.redirect, 'error');
  assert.equal(f.calls[0].init.headers.Authorization, `Bearer ${secret}`);
  assert.deepEqual(f.calls[0].payload.image, [a.dataUrl, b.dataUrl]);
  assert.deepEqual(Buffer.from(f.calls[0].payload.image[0].split(',')[1], 'base64'), visualBytes);
  assert.equal(f.calls[0].payload.response_format, 'b64_json');
  assert.equal(result.status, 'succeeded');
  assert.deepEqual(result.outputs[0].data, output);
  assert.equal(result.outputs[0].mimeType, 'image/png');
  assert.equal(result.usage.tokens, 41);
  assert.equal(result.actualCost, null);
});

test('Seedream lite supports a bounded reference batch; pro refuses batch fields and unsafe sizes', async () => {
  const f = fixture([json({ data: [{ b64_json: 'YQ==' }, { b64_json: 'Yg==' }] })]);
  const req = request('image', { model: BYTEPLUS_MODELS.imageLite, references: [ref()], parameters: { size: '3K', sequential_image_generation: 'auto', sequential_image_generation_options: { max_images: 2 } } });
  const result = await f.driver.submit(req);
  assert.equal(result.outputs.length, 2);
  assert.deepEqual(f.calls[0].payload.sequential_image_generation_options, { max_images: 2 });
  assert.throws(() => f.driver.validate(request('image', { parameters: { sequential_image_generation: 'auto' } })), /unsupported-image-batch/);
  assert.throws(() => f.driver.validate({ ...req, parameters: { sequential_image_generation: 'auto', sequential_image_generation_options: { max_images: 15 } } }), /invalid-image-batch/);
  assert.throws(() => f.driver.validate(request('image', { parameters: { size: '512x512' } })), /invalid-image-size/);
  assert.throws(() => f.driver.validate({ ...req, parameters: { size: '1K' } }), /invalid-image-size/);
});

test('Seedance posts once with real inline voice bytes; manual GET retains accepted job binding and usage', async () => {
  const f = fixture([
    json({ id: 'cgt-fixture-001' }),
    json({ id: 'cgt-fixture-001', model: BYTEPLUS_MODELS.video, status: 'running' }),
    json({ id: 'cgt-fixture-001', model: BYTEPLUS_MODELS.video, status: 'succeeded', content: { video_url: 'https://ark-content-generation-ap-southeast-1.tos-ap-southeast-1.volces.com/clip.mp4?signature=private' }, usage: { completion_tokens: 216000 } }),
  ]);
  const req = request('video', { hasSpeech: true, references: [ref(), ref('audio', 'voice', 1, voiceBytes)], parameters: { generate_audio: true, duration: 10, resolution: '720p' } });
  const queued = await f.driver.submit(req);
  assert.equal(queued.status, 'queued');
  assert.equal(queued.jobId, 'cgt-fixture-001');
  assert.equal(f.calls.length, 1);
  const content = f.calls[0].payload.content;
  assert.equal(content[0].text, req.prompt);
  assert.equal(content[2].role, 'reference_audio');
  assert.deepEqual(Buffer.from(content[2].audio_url.url.split(',')[1], 'base64'), voiceBytes);
  const receipt = { ...queued, credentialFingerprint: f.driver.credentialFingerprint('video') };
  assert.equal((await f.driver.getStatus(receipt)).status, 'running');
  const completed = await f.driver.getStatus(receipt);
  assert.equal(completed.status, 'succeeded');
  assert.equal(completed.usage.tokens, 216000);
  assert.equal(completed.actualCost, null);
  assert.equal(completed.outputs[0].kind, 'video');
  assert.deepEqual(f.calls.map(call => call.init.method), ['POST', 'GET', 'GET']);
  assert.ok(f.calls.slice(1).every(call => !call.init.body));
});

test('exact reference drift, unsupported fields, model and identity combinations fail before any HTTP request', async () => {
  const f = fixture([]);
  for (const req of [
    request('image', { parameters: { endpoint: 'https://evil.example' } }),
    request('image', { model: 'unverified-model' }),
    request('image', { references: [{ ...ref(), sha256: '0'.repeat(64) }] }),
    request('image', { references: [{ ...ref(), bytes: 1 }] }),
    request('image', { references: [ref(), ref()] }),
    request('image', { references: [{ ...ref(), url: 'https://arbitrary.example/image.png', dataUrl: undefined }] }),
    request('video', { references: [ref('image', 'last_frame')] }),
    request('video', { references: [ref('image', 'first_frame')], parameters: { ratio: '9:16' } }),
    request('video', { hasSpeech: true }),
    request('video', { references: [ref('audio', 'voice', 0, voiceBytes)], parameters: { generate_audio: false } }),
    request('video', { references: [{ kind: 'video', role: 'reference_video', order: 0, dataUrl: 'data:video/mp4;base64,YQ==' }] }),
    request('video', { references: [{ kind: 'video', role: 'reference_video', order: 0, url: 'file:///C:/private.mp4' }] }),
    { ...request(), endpoint: 'https://evil.example' },
  ]) await assert.rejects(f.driver.submit(req), BytePlusProviderError);
  assert.equal(f.calls.length, 0);
  assert.throws(() => createBytePlusProvider({ baseUrl: 'https://evil.example', credentials: {} }), /unsupported-fields/);
  assert.throws(() => createBytePlusProvider({ region: 'unverified-region', credentials: {} }), /unsupported-parameter/);
});

test('remote video requires binding and never receives an invented fixed quote; missing speech credentials stay offline', async () => {
  const f = fixture([], { credentials: { apiKey: secret } });
  const remote = { kind: 'video', role: 'reference_video', order: 0, referenceId: 'original-transfer-receipt', bytes: 100, sha256: 'a'.repeat(64), url: 'https://consumer.tos-ap-southeast-1.bytepluses.com/original.mov' };
  assert.equal(f.driver.validate(request('video', { references: [remote] })).payload.content[1].video_url.url, remote.url);
  assert.equal(f.driver.estimate(request('video', { references: [remote] })).amount, null);
  assert.equal(f.driver.estimate(request('video', { references: [{ ...remote, url: 'asset://verified-asset' }] })).maxEstimate, null);
  await assert.rejects(f.driver.submit(request('audio', { parameters: { speaker_id: 'en_female_skye_emo_v2_mars_bigtts' } })), /missing-credentials/);
  assert.equal(f.calls.length, 0);
});

test('TTS consumes bounded JSON audio chunks as original bytes with separate consumer auth and no clone route', async () => {
  const a = Buffer.from([0, 1, 128, 255]), b = Buffer.from([3, 4, 5]);
  const f = fixture([new Response(`${JSON.stringify({ code: 0, data: a.toString('base64') })}\n${JSON.stringify({ code: 0, data: b.toString('base64') })}\n${JSON.stringify({ code: 20000000, message: 'ok', data: null })}\n`)]);
  const req = request('audio', { prompt: 'Olá, esta é uma referência vocal sintética.', parameters: { speaker_id: 'en_female_skye_emo_v2_mars_bigtts', language: 'pt-BR', format: 'mp3', sample_rate: 24000 } });
  const result = await f.driver.submit(req);
  assert.equal(f.calls[0].url, `${BYTEPLUS_API_ORIGINS[1]}/api/v3/tts/unidirectional`);
  assert.equal(f.calls[0].init.headers['X-Api-Key'], speechSecret);
  assert.equal(f.calls[0].init.headers['X-Api-Resource-Id'], 'seed-tts-2.0');
  assert.equal(f.calls[0].init.headers.Authorization, undefined);
  assert.equal(f.calls[0].payload.req_params.speaker, req.parameters.speaker_id);
  assert.equal(JSON.parse(f.calls[0].payload.req_params.additions).explicit_language, 'pt-br');
  assert.deepEqual(result.outputs[0].data, Buffer.concat([a, b]));
  assert.equal(result.outputs[0].mimeType, 'audio/mpeg');
  assert.equal(result.status, 'succeeded');
  assert.equal(result.actualCost, null);
  assert.throws(() => f.driver.validate({ ...req, references: [ref('audio', 'voice', 0, voiceBytes)] }), /tts-reference-unsupported/);
  assert.throws(() => f.driver.validate({ ...req, parameters: { ...req.parameters, service_resource: 'seed-icl-2.0' } }), /voice-cloning-unsupported/);
});

test('transport timeout, 5xx and malformed accepted responses are uncertain and never retried automatically', async () => {
  for (const response of [json({ id: 'server-might-have-submitted' }, 503), new Response('malformed'), json({}), json({ id: 'cgt-fixture', model: 'different-model' })]) {
    const f = fixture([response]);
    await assert.rejects(f.driver.submit(request('video')), error => error instanceof BytePlusProviderError && error.outcomeUnknown === true);
    assert.equal(f.calls.length, 1);
  }
  const timeout = fixture([() => new Promise(() => {})], { timeoutMs: 5 });
  await assert.rejects(timeout.driver.submit(request('video')), error => error.category === 'timeout' && error.outcomeUnknown === true);
  assert.equal(timeout.calls.length, 1);
  const transport = fixture([() => { throw new Error(`${secret} ${ref().dataUrl}`); }]);
  await assert.rejects(transport.driver.submit(request('video')), error => {
    assert.equal(error.category, 'transport-failed');
    assert.equal(error.outcomeUnknown, true);
    assert.doesNotMatch(`${error.stack} ${JSON.stringify(error)}`, /synthetic-key|data:image|base64/);
    return true;
  });
});

test('explicit provider rejections redact raw bodies; unsafe/oversized results and incomplete TTS remain uncertain', async () => {
  for (const [status, category] of [[401, 'authentication-failed'], [403, 'authentication-failed'], [404, 'model-unavailable'], [429, 'rate-limit'], [422, 'request-rejected']]) {
    const f = fixture([json({ error: { message: `${secret} ${ref().dataUrl}` } }, status)]);
    await assert.rejects(f.driver.submit(request('video')), error => {
      assert.equal(error.category, category);
      assert.equal(error.outcomeUnknown, false);
      assert.doesNotMatch(`${error.stack} ${JSON.stringify(error)}`, /synthetic-key|data:image|base64/);
      return true;
    });
    assert.equal(f.calls.length, 1);
  }
  for (const response of [json({ data: [{ url: 'https://evil.example/private.png' }] }), json({ data: [{ url: 'https://bytepluses.com.evil.example/private.png' }] }), new Response('{}', { headers: { 'content-length': String(65 * 1024 * 1024) } })]) {
    const f = fixture([response]);
    await assert.rejects(f.driver.submit(request()), error => error.outcomeUnknown === true);
  }
  const incomplete = fixture([json({ code: 0, data: 'YQ==' })]);
  await assert.rejects(incomplete.driver.submit(request('audio', { parameters: { speaker_id: 'preset-speaker' } })), error => error.outcomeUnknown === true);
  const denied = fixture([json({ code: 45000000, message: speechSecret })]);
  await assert.rejects(denied.driver.submit(request('audio', { parameters: { speaker_id: 'preset-speaker' } })), error => error.category === 'speaker-access-denied' && error.outcomeUnknown === false && !error.message.includes(speechSecret));
});

test('status refuses changed account/job/model bindings and pre-aborted calls without paid retry', async () => {
  const f = fixture([json({ id: 'other-job', model: BYTEPLUS_MODELS.video, status: 'running' })]);
  const receipt = { provider: 'byteplus', medium: 'video', model: BYTEPLUS_MODELS.video, jobId: 'original-job' };
  await assert.rejects(f.driver.getStatus({ ...receipt, credentialFingerprint: '0'.repeat(64) }), /credential-binding-mismatch/);
  await assert.rejects(f.driver.getStatus({ ...receipt, jobId: '../escape' }), /invalid-identifier/);
  await assert.rejects(f.driver.getStatus({ ...receipt, model: 'unverified-model' }), /unsupported-status-receipt/);
  assert.equal(f.calls.length, 0);
  await assert.rejects(f.driver.getStatus(receipt), error => error.category === 'job-binding-mismatch' && error.outcomeUnknown === false);
  const controller = new AbortController(); controller.abort();
  await assert.rejects(f.driver.submit(request('video'), { signal: controller.signal }), error => error.category === 'aborted' && error.outcomeUnknown === false);
  assert.equal(f.calls.length, 1);
  assert.deepEqual(BYTEPLUS_OUTPUT_HOST_SUFFIXES, ['bytepluscdn.com', 'bytepluses.com', 'volces.com', 'volccdn.com']);
});

test('MOV status metadata preserves the sealed format and frame generation avoids an omni-reference task hint', async () => {
  const f = fixture([json({ id: 'original-job', model: BYTEPLUS_MODELS.video, status: 'succeeded', content: { video_url: 'https://output.bytepluscdn.com/opaque-download?signature=private' } })]);
  const result = await f.driver.getStatus({ provider: 'byteplus', medium: 'video', model: BYTEPLUS_MODELS.video, jobId: 'original-job', outputFormat: 'mov' });
  assert.equal(result.outputs[0].mimeType, 'video/quicktime');
  const payload = f.driver.validate(request('video', { references: [ref('image', 'first_frame')], parameters: { output_format: 'mov' } })).payload;
  assert.equal(payload.ratio, 'adaptive');
  assert.equal(payload.output_format, 'mov');
  assert.equal(payload.omni_reference_task_type, undefined);
  assert.throws(() => createBytePlusProvider({ credentials: { apiKey: 0 } }), /invalid-credentials/);
});

test('an oversized chunked response is canceled without trusting content-length or repeating submission', async () => {
  let chunks = 0, canceled = false;
  const response = new Response(new ReadableStream({
    pull(controller) {
      chunks++;
      controller.enqueue(new Uint8Array(1024 * 1024));
    },
    cancel() { canceled = true; },
  }));
  const f = fixture([response]);
  await assert.rejects(f.driver.submit(request('video')), error => error.category === 'response-limit' && error.outcomeUnknown === true);
  assert.equal(canceled, true);
  assert.ok(chunks <= 67);
  assert.equal(f.calls.length, 1);
});
