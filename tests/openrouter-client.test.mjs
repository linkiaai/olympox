import test from 'node:test';
import assert from 'node:assert/strict';
import { createOpenRouterClient, OpenRouterError } from '../scripts/openrouter-client.mjs';

const apiKey = 'sk-or-synthetic-never-send';
const secret = 'Bearer planted-secret https://private.example/media?token=secret';
const json = value => new Response(JSON.stringify(value), { headers: { 'Content-Type': 'application/json' } });
function fixture(responses, key = apiKey) {
  const calls = [];
  const client = createOpenRouterClient({ apiKey: key, fetchImpl: async (url, options) => {
    calls.push({ url, ...options });
    const response = responses.shift();
    if (response instanceof Error) throw response;
    return response;
  } });
  return { client, calls };
}
function cleanError(error, code, status = null) {
  assert.ok(error instanceof OpenRouterError);
  assert.equal(error.code, code); assert.equal(error.status, status);
  assert.doesNotMatch(`${error.stack} ${JSON.stringify(error)}`, /planted-secret|private\.example|sk-or-synthetic|token=secret/);
  return true;
}

test('public catalogs use the fixed API without credentials and all requests refuse redirects', async () => {
  const models = { data: [{ id: 'bytedance/seedance-2.5' }] }, endpoints = { data: { endpoints: [{ name: 'Seed' }] } };
  const f = fixture([json(models), json(endpoints)], '');
  assert.deepEqual(await f.client.models(), models);
  assert.deepEqual(await f.client.endpoints('bytedance/seedance-2.5'), endpoints);
  assert.deepEqual(f.calls.map(call => call.url), ['https://openrouter.ai/api/v1/videos/models', 'https://openrouter.ai/api/v1/models/bytedance/seedance-2.5/endpoints']);
  for (const call of f.calls) {
    assert.equal(call.method, 'GET'); assert.equal(call.redirect, 'error');
    assert.equal(call.headers.Authorization, undefined); assert.ok(call.signal instanceof AbortSignal);
  }
});

test('submission dispatches once with the exact model and returns only a normalized safe receipt', async () => {
  const f = fixture([json({ id: 'video-01', status: 'pending', generation_id: 'gen-01', usage: { cost: 0 }, url: secret, error: secret, cost: 999 })]);
  const payload = { model: 'bytedance/seedance-2.5', prompt: 'Synthetic motion', duration: 5 };
  assert.deepEqual(await f.client.submit(payload), { id: 'video-01', status: 'pending', generationId: 'gen-01', cost: 0 });
  assert.equal(f.calls.length, 1);
  assert.equal(f.calls[0].url, 'https://openrouter.ai/api/v1/videos'); assert.equal(f.calls[0].method, 'POST');
  assert.equal(f.calls[0].headers.Authorization, `Bearer ${apiKey}`);
  assert.equal(f.calls[0].headers['Content-Type'], 'application/json');
  assert.deepEqual(JSON.parse(f.calls[0].body), payload);
});

test('status accepts documented states, finite USD costs and never returns URLs or provider errors', async () => {
  for (const state of ['pending', 'in_progress', 'completed', 'failed', 'cancelled', 'expired']) {
    const f = fixture([json({ id: 'video-01', status: state, usage: { cost: 1.25 }, outputs: [{ url: secret }], error: secret })]);
    assert.deepEqual(await f.client.status('video-01'), { id: 'video-01', status: state, generationId: null, cost: 1.25 });
    assert.equal(f.calls[0].url, 'https://openrouter.ai/api/v1/videos/video-01');
    assert.equal(f.calls[0].headers.Authorization, `Bearer ${apiKey}`);
  }
  const f = fixture([json({ id: 'video-01', status: 'completed' })]);
  assert.equal((await f.client.status('video-01')).cost, null);
});

test('private methods require a safe key while unsafe identifiers and indices never dispatch', async () => {
  for (const key of ['', 'bad key', 'bad\r\nkey']) {
    const f = fixture([], key);
    assert.throws(() => f.client.checkAuthorization(), error => cleanError(error, 'KEY_REQUIRED'));
    await assert.rejects(f.client.submit({ model: 'bytedance/seedance-2.5' }), error => cleanError(error, 'KEY_REQUIRED'));
    await assert.rejects(f.client.status('video-01'), error => cleanError(error, 'KEY_REQUIRED'));
    await assert.rejects(f.client.content('video-01'), error => cleanError(error, 'KEY_REQUIRED'));
    assert.equal(f.calls.length, 0);
  }
  const f = fixture([]);
  assert.equal(f.client.checkAuthorization(), undefined); assert.equal(f.calls.length, 0);
  for (const id of ['../secret', 'a/b', 'https://evil.test', 'job?key=secret', 'job#fragment', 'job%2fpath', '', 'a'.repeat(129)]) {
    await assert.rejects(f.client.status(id), error => cleanError(error, 'INVALID_INPUT'));
    assert.throws(() => f.client.content(id), error => cleanError(error, 'INVALID_INPUT'));
  }
  for (const model of ['../seedance', 'bytedance/../seedance', 'bytedance/seedance?x=y', 'a/b/c']) {
    assert.throws(() => f.client.endpoints(model), error => cleanError(error, 'INVALID_INPUT'));
    await assert.rejects(f.client.submit({ model }), error => cleanError(error, 'INVALID_INPUT'));
  }
  for (const index of [-1, 1.1, '0', Infinity, Number.MAX_SAFE_INTEGER + 1]) assert.throws(() => f.client.content('video-01', index), error => cleanError(error, 'INVALID_INPUT'));
  assert.equal(f.calls.length, 0);
});

test('credential fingerprints bind the captured key without exposing it or contacting a provider', () => {
  const first = fixture([]), same = fixture([]), different = fixture([], 'sk-or-other-synthetic');
  const fingerprint = first.client.credentialFingerprint();
  assert.match(fingerprint, /^[a-f0-9]{64}$/);
  assert.equal(same.client.credentialFingerprint(), fingerprint);
  assert.notEqual(different.client.credentialFingerprint(), fingerprint);
  assert.equal(fingerprint.includes(apiKey), false);
  assert.deepEqual([first.calls.length, same.calls.length, different.calls.length], [0, 0, 0]);
  const missing = fixture([], '');
  assert.throws(() => missing.client.credentialFingerprint(), error => cleanError(error, 'KEY_REQUIRED'));
  assert.equal(missing.calls.length, 0);
});

test('HTTP errors retain numeric status without reading or echoing upstream bodies and never retry', async () => {
  for (const status of [302, 401, 429, 500]) {
    let cancelled = false;
    const body = new ReadableStream({ start(controller) { controller.enqueue(new TextEncoder().encode(secret)); }, cancel() { cancelled = true; } });
    const f = fixture([new Response(body, { status, headers: { Location: 'https://private.example' } })]);
    await assert.rejects(f.client.submit({ model: 'bytedance/seedance-2.5' }), error => cleanError(error, status, status));
    assert.equal(cancelled, true); assert.equal(f.calls.length, 1);
  }
  const f = fixture([new Error(secret)]);
  await assert.rejects(f.client.submit({ model: 'bytedance/seedance-2.5' }), error => cleanError(error, 'REQUEST_FAILED'));
  assert.equal(f.calls.length, 1);
  const redirected = json({ id: 'video-01', status: 'pending' });
  Object.defineProperty(redirected, 'redirected', { value: true });
  const redirect = fixture([redirected]);
  await assert.rejects(redirect.client.status('video-01'), error => cleanError(error, 'REDIRECT_REFUSED'));
});

test('invalid JSON, receipts, generation IDs, mismatching jobs and costs fail with sanitized errors', async () => {
  const values = [null, [], { id: 'video-01', status: 'unknown' }, { id: secret, status: 'pending' }, { id: 'video-01', status: 'pending', generation_id: secret }, { id: 'video-01', status: 'pending', usage: { cost: -1 } }, { id: 'video-01', status: 'pending', usage: { cost: '1.25' } }];
  for (const value of values) {
    const f = fixture([json(value)]);
    await assert.rejects(f.client.submit({ model: 'bytedance/seedance-2.5' }), error => cleanError(error, 'INVALID_RESPONSE'));
    assert.equal(f.calls.length, 1);
  }
  const invalidJson = fixture([new Response(secret)]);
  await assert.rejects(invalidJson.client.models(), error => cleanError(error, 'INVALID_RESPONSE'));
  const mismatch = fixture([json({ id: 'other-job', status: 'pending' })]);
  await assert.rejects(mismatch.client.status('video-01'), error => cleanError(error, 'INVALID_RESPONSE'));
  const circular = { model: 'bytedance/seedance-2.5' }; circular.self = circular;
  const f = fixture([]);
  await assert.rejects(f.client.submit(circular), error => cleanError(error, 'INVALID_INPUT'));
  assert.equal(f.calls.length, 0);
});

test('JSON length headers and streamed data enforce the 4 MiB response bound', async () => {
  const header = fixture([new Response('{}', { headers: { 'Content-Length': String(4 * 1024 * 1024 + 1) } })]);
  await assert.rejects(header.client.models(), error => cleanError(error, 'RESPONSE_TOO_LARGE'));
  let cancelled = false;
  const body = new ReadableStream({ start(controller) { controller.enqueue(new Uint8Array(4 * 1024 * 1024)); controller.enqueue(new Uint8Array(1)); }, cancel() { cancelled = true; } });
  const streamed = fixture([new Response(body)]);
  await assert.rejects(streamed.client.models(), error => cleanError(error, 'RESPONSE_TOO_LARGE'));
  assert.equal(cancelled, true);
});

test('content exports authenticated bounded MP4 bytes with a safe index and no URL fetching', async () => {
  const bytes = Buffer.from('synthetic-mp4-byte-fixture');
  const response = new Response(bytes, { headers: { 'Content-Type': 'video/mp4; charset=binary' } });
  response.arrayBuffer = () => { throw new Error('Unbounded reads must not be used.'); };
  const f = fixture([response]);
  assert.deepEqual(await f.client.content('video-01', 2), { bytes, contentType: 'video/mp4' });
  assert.equal(f.calls.length, 1); assert.equal(f.calls[0].url, 'https://openrouter.ai/api/v1/videos/video-01/content?index=2');
  assert.equal(f.calls[0].headers.Authorization, `Bearer ${apiKey}`); assert.equal(f.calls[0].redirect, 'error');
  for (const contentType of ['application/json', 'text/html', 'video/webm']) {
    const invalid = fixture([new Response(secret, { headers: { 'Content-Type': contentType } })]);
    await assert.rejects(invalid.client.content('video-01'), error => cleanError(error, 'INVALID_CONTENT_TYPE'));
  }
  const empty = fixture([new Response(null, { headers: { 'Content-Type': 'video/mp4' } })]);
  await assert.rejects(empty.client.content('video-01'), error => cleanError(error, 'INVALID_RESPONSE'));
});

test('MP4 length headers and streamed data enforce the 256 MiB export bound', async () => {
  const header = fixture([new Response('x', { headers: { 'Content-Type': 'video/mp4', 'Content-Length': String(256 * 1024 * 1024 + 1) } })]);
  await assert.rejects(header.client.content('video-01'), error => cleanError(error, 'RESPONSE_TOO_LARGE'));
  let count = 0, cancelled = false;
  const chunk = new Uint8Array(4 * 1024 * 1024);
  const body = new ReadableStream({ pull(controller) { count++; controller.enqueue(chunk); }, cancel() { cancelled = true; } }, { highWaterMark: 0 });
  const streamed = fixture([new Response(body, { headers: { 'Content-Type': 'video/mp4' } })]);
  await assert.rejects(streamed.client.content('video-01'), error => cleanError(error, 'RESPONSE_TOO_LARGE'));
  assert.equal(cancelled, true); assert.equal(count, 65);
});
