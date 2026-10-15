import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { EventEmitter } from 'node:events';
import { Readable } from 'node:stream';
import { OpenRouterReferenceError, validateReferenceUrl, verifyHttpsReference } from '../scripts/openrouter-reference-http.mjs';

const content = Buffer.from('synthetic exact audio reference bytes');
const sha256 = value => createHash('sha256').update(value).digest('hex');
const secretUrl = 'https://media.example.com/voice.wav?token=planted-secret';
const reference = { url: secretUrl, sha256: sha256(content), bytes: content.length, mimeType: 'audio/wav' };
const publicDns = [{ address: '8.8.8.8', family: 4 }, { address: '2606:4700:4700::1111', family: 6 }];

function cleanError(error, code) {
  assert.ok(error instanceof OpenRouterReferenceError);
  assert.equal(error.code, code);
  assert.doesNotMatch(`${error.stack} ${JSON.stringify(error)}`, /planted-secret|media\.example|token=|upstream-private/);
  assert.equal(error.cause, undefined);
  return true;
}

function fixture({ addresses = publicDns, dnsError, requestError, status = 200, headers = {}, chunks = [content], responseError, aborted = false, complete = true, hang = false, idleTimeout = false } = {}) {
  const calls = [], dnsCalls = [];
  let requestDestroyed = false, responseDestroyed = false, timeoutMs;
  const response = Readable.from(chunks);
  response.statusCode = status;
  response.headers = { 'content-type': reference.mimeType, ...headers };
  response.complete = complete;
  const originalDestroy = response.destroy.bind(response);
  response.destroy = (...args) => { responseDestroyed = true; return originalDestroy(...args); };
  const lookupImpl = async (...args) => {
    dnsCalls.push(args);
    if (dnsError) throw dnsError;
    return addresses;
  };
  const requestImpl = (url, options, callback) => {
    calls.push({ url, ...options });
    if (requestError) throw requestError;
    const req = new EventEmitter();
    req.destroy = () => { requestDestroyed = true; };
    req.setTimeout = (milliseconds, onTimeout) => { timeoutMs = milliseconds; if (idleTimeout) queueMicrotask(onTimeout); };
    req.end = () => {
      queueMicrotask(() => {
        if (hang || requestDestroyed) return;
        callback(response);
        if (responseError) response.destroy(responseError);
        if (aborted) response.emit('aborted');
      });
    };
    return req;
  };
  return { calls, dnsCalls, lookupImpl, requestImpl, response, get requestDestroyed() { return requestDestroyed; }, get responseDestroyed() { return responseDestroyed; }, get timeoutMs() { return timeoutMs; } };
}

test('HTTPS readback streams exact bytes and returns a URL-free receipt with normalized URL fingerprint', async () => {
  const f = fixture({ chunks: [content.subarray(0, 7), content.subarray(7)], headers: { 'content-length': String(content.length), 'content-type': 'audio/wav; charset=binary' } });
  const result = await verifyHttpsReference(reference, f);
  assert.deepEqual({ ...result, checkedAt: 'checked' }, { sha256: reference.sha256, bytes: content.length, mimeType: 'audio/wav', checkedAt: 'checked', urlFingerprint: sha256(secretUrl), transport: 'https' });
  assert.equal(new Date(result.checkedAt).toISOString(), result.checkedAt);
  assert.doesNotMatch(JSON.stringify(result), /planted-secret|https:|token=/);
  assert.deepEqual(f.dnsCalls, [['media.example.com', { all: true, verbatim: true }]]);
  assert.equal(f.calls.length, 1);
  assert.equal(f.timeoutMs, 30_000);
  assert.equal(f.requestDestroyed, false);
});

test('requests use GET without credentials or cookies, pin DNS and retain TLS hostname verification', async () => {
  const f = fixture();
  await verifyHttpsReference(reference, f);
  const call = f.calls[0];
  assert.equal(call.method, 'GET'); assert.equal(call.port, 443); assert.equal(call.agent, false);
  assert.equal(call.servername, 'media.example.com'); assert.equal(call.rejectUnauthorized, true);
  assert.deepEqual(call.headers, { Accept: 'audio/wav', 'Accept-Encoding': 'identity' });
  assert.equal(call.auth, undefined); assert.equal(call.body, undefined);
  assert.equal(call.url.username, ''); assert.equal(call.url.password, '');
  const runLookup = (host, options) => new Promise((resolve, reject) => call.lookup(host, options, (error, ...values) => error ? reject(error) : resolve(values)));
  assert.deepEqual(await runLookup('media.example.com', { all: true }), [publicDns]);
  assert.deepEqual(await runLookup('media.example.com', {}), ['8.8.8.8', 4]);
  assert.deepEqual(await runLookup('media.example.com', { family: 6 }), ['2606:4700:4700::1111', 6]);
  const mutable = (await runLookup('media.example.com', { all: true }))[0];
  mutable[0].address = '127.0.0.1';
  assert.deepEqual(await runLookup('media.example.com', { family: 4 }), ['8.8.8.8', 4]);
  await assert.rejects(runLookup('upstream-private.local', { all: true }), error => cleanError(error, 'DNS_FAILED'));
  assert.equal(f.dnsCalls.length, 1);
});

test('public IP URLs bypass DNS and octet-stream responses are accepted without relaxing exact-byte checks', async () => {
  for (const url of ['https://8.8.8.8/voice.wav', 'https://[2606:4700:4700::1111]/voice.wav']) {
    const f = fixture({ headers: { 'content-type': 'application/octet-stream', 'content-encoding': 'identity' } });
    const result = await verifyHttpsReference({ ...reference, url }, f);
    assert.equal(result.sha256, reference.sha256); assert.equal(result.mimeType, 'audio/wav');
    assert.equal(f.dnsCalls.length, 0); assert.equal(f.calls[0].servername, undefined);
  }
  assert.equal(validateReferenceUrl('HTTPS://MEDIA.EXAMPLE.COM:443/a/../voice.wav').href, 'https://media.example.com/voice.wav');
});

test('video references receive the same full-byte verification as audio references', async () => {
  const f = fixture({ headers: { 'content-type': 'video/mp4' } });
  const result = await verifyHttpsReference({ ...reference, mimeType: 'video/mp4' }, f);
  assert.equal(result.mimeType, 'video/mp4'); assert.equal(result.sha256, reference.sha256);
  assert.equal(f.calls[0].headers.Accept, 'video/mp4');
});

test('invalid URLs never resolve or dispatch and errors never echo signed URL secrets', async () => {
  const values = [undefined, null, '', {}, secretUrl + '#fragment', secretUrl + '#', 'http://media.example.com/?token=planted-secret', 'https://planted-secret@media.example.com/', 'https://@media.example.com/', 'https://media.example.com:8443/?token=planted-secret', 'https://media.example.com/\nplanted-secret', 'https://media.example.com\\upstream-private', 'https:media.example.com', 'https://printer/', 'https://localhost/', 'https://voice.localhost/', 'https://voice.local/', 'https://voice.internal/', 'https://voice.lan/', 'https://voice.test/', 'https://voice.invalid/', 'https://voice.onion/', 'https://media.example.com./'];
  for (const url of values) {
    const f = fixture();
    await assert.rejects(verifyHttpsReference({ ...reference, url }, f), error => cleanError(error, 'INVALID_URL'));
    assert.equal(f.dnsCalls.length, 0); assert.equal(f.calls.length, 0);
  }
});

test('private, reserved, documentation, transition and multicast IP addresses are refused before requests', async () => {
  const ipv4 = ['0.0.0.0', '10.255.255.255', '100.64.0.1', '100.127.255.255', '127.0.0.1', '169.254.169.254', '172.16.0.1', '172.31.255.255', '192.0.0.9', '192.0.2.1', '192.31.196.1', '192.52.193.1', '192.88.99.1', '192.168.1.1', '192.175.48.1', '198.18.0.1', '198.19.255.255', '198.51.100.1', '203.0.113.1', '224.0.0.1', '239.255.255.255', '240.0.0.1', '255.255.255.255'];
  const ipv6 = ['::', '::1', '::ffff:127.0.0.1', '::ffff:8.8.8.8', '64:ff9b::808:808', '64:ff9b:1::1', '100::1', '2001::1', '2001:2::1', '2001:20::1', '2001:30::1', '2001:db8::1', '2002:0808:0808::1', '2620:4f:8000::1', '3fff::1', '3fff:fff:ffff::1', '5f00::1', 'fc00::1', 'fdff::1', 'fe80::1', 'ff02::1'];
  for (const address of [...ipv4, ...ipv6]) {
    const url = `https://${address.includes(':') ? `[${address}]` : address}/?token=planted-secret`;
    const f = fixture();
    await assert.rejects(verifyHttpsReference({ ...reference, url }, f), error => cleanError(error, 'UNSAFE_ADDRESS'));
    assert.equal(f.dnsCalls.length, 0); assert.equal(f.calls.length, 0);
  }
  for (const url of ['https://2130706433/', 'https://0x7f000001/', 'https://0177.0.0.1/']) {
    assert.throws(() => validateReferenceUrl(url), error => cleanError(error, 'UNSAFE_ADDRESS'));
  }
});

test('every DNS answer must be public and malformed or mixed answers never dispatch', async () => {
  for (const address of ['10.0.0.1', '127.0.0.1', '169.254.169.254', '100.64.0.1', '192.168.0.1', '198.51.100.1', '::1', 'fd00::1', 'fe80::1', '::ffff:7f00:1', '2001:db8::1', 'fe80::1%eth0']) {
    const f = fixture({ addresses: [...publicDns, { address, family: address.includes(':') ? 6 : 4 }] });
    await assert.rejects(verifyHttpsReference(reference, f), error => cleanError(error, 'UNSAFE_ADDRESS'));
    assert.equal(f.calls.length, 0);
  }
  for (const addresses of [[{ address: '8.8.8.8', family: 6 }], [null], [{ address: 'upstream-private' }]]) {
    const f = fixture({ addresses });
    await assert.rejects(verifyHttpsReference(reference, f), error => cleanError(error, 'UNSAFE_ADDRESS'));
    assert.equal(f.calls.length, 0);
  }
  for (const addresses of [[], undefined, null, {}]) {
    const f = fixture({ addresses: addresses ?? publicDns });
    if (addresses === undefined || addresses === null) f.lookupImpl = async () => addresses;
    await assert.rejects(verifyHttpsReference(reference, f), error => cleanError(error, 'DNS_FAILED'));
    assert.equal(f.calls.length, 0);
  }
});

test('expected hashes, MIME types and byte counts are bounded before any network access', async () => {
  const invalid = [{ sha256: 'bad' }, { sha256: 'A'.repeat(64) }, { bytes: 0 }, { bytes: -1 }, { bytes: 1.5 }, { bytes: '1' }, { bytes: 64 * 1024 * 1024 + 1 }, { bytes: Infinity }, { mimeType: 'Audio/Wav' }, { mimeType: 'audio/wav; token=planted-secret' }, { mimeType: 'audio/wav\r\nAuthorization: planted-secret' }];
  for (const fields of invalid) {
    const f = fixture();
    await assert.rejects(verifyHttpsReference({ ...reference, ...fields }, f), error => cleanError(error, 'INVALID_INPUT'));
    assert.equal(f.dnsCalls.length, 0); assert.equal(f.calls.length, 0);
  }
});

test('redirects and non-200 responses destroy the original request without following locations', async () => {
  for (const status of [201, 206, 301, 302, 307, 308, 401, 403, 404, 500]) {
    const f = fixture({ status, headers: { location: 'https://upstream-private.local/?token=planted-secret' } });
    await assert.rejects(verifyHttpsReference(reference, f), error => cleanError(error, status >= 300 && status < 400 ? 'REDIRECT_REFUSED' : 'HTTP_ERROR'));
    assert.equal(f.calls.length, 1); assert.equal(f.requestDestroyed, true); assert.equal(f.responseDestroyed, true);
  }
});

test('MIME and content encoding mismatches are refused and destroy the response', async () => {
  for (const type of ['video/mp4', 'text/html', '', undefined, ['audio/wav', 'text/html']]) {
    const f = fixture({ headers: { 'content-type': type } });
    await assert.rejects(verifyHttpsReference(reference, f), error => cleanError(error, 'INVALID_CONTENT_TYPE'));
    assert.equal(f.requestDestroyed, true); assert.equal(f.responseDestroyed, true);
  }
  for (const encoding of ['gzip', 'br', '', ['identity']]) {
    const f = fixture({ headers: { 'content-encoding': encoding } });
    await assert.rejects(verifyHttpsReference(reference, f), error => cleanError(error, 'INVALID_ENCODING'));
    assert.equal(f.requestDestroyed, true);
  }
});

test('declared lengths, oversized streams, truncated streams and changed bytes cannot produce verification evidence', async () => {
  for (const length of [String(content.length - 1), String(content.length + 1), String(64 * 1024 * 1024 + 1), 'bad', '-1', '1.5', ['1', '2']]) {
    const f = fixture({ headers: { 'content-length': length } });
    await assert.rejects(verifyHttpsReference(reference, f), error => cleanError(error, 'INVALID_LENGTH'));
    assert.equal(f.requestDestroyed, true);
  }
  for (const setup of [{ chunks: [content, Buffer.from('x')] }, { chunks: [content.subarray(1)] }, { chunks: [] }, { complete: false }, { aborted: true }]) {
    const f = fixture(setup);
    await assert.rejects(verifyHttpsReference(reference, f), error => cleanError(error, 'INVALID_LENGTH'));
    assert.equal(f.requestDestroyed, true);
  }
  const changed = fixture({ chunks: [Buffer.alloc(content.length, 1)] });
  await assert.rejects(verifyHttpsReference(reference, changed), error => cleanError(error, 'HASH_MISMATCH'));
  assert.equal(changed.requestDestroyed, true);
});

test('upstream DNS, request and stream errors are sanitized and no automatic retry occurs', async () => {
  const privateError = new Error(`upstream-private ${secretUrl}`);
  for (const [setup, code] of [[{ dnsError: privateError }, 'DNS_FAILED'], [{ requestError: privateError }, 'REQUEST_FAILED'], [{ responseError: privateError }, 'REQUEST_FAILED']]) {
    const f = fixture(setup);
    await assert.rejects(verifyHttpsReference(reference, f), error => cleanError(error, code));
    assert.ok(f.calls.length <= 1);
  }
  const f = fixture();
  f.requestImpl = () => {
    const req = new EventEmitter();
    req.setTimeout = () => {}; req.destroy = () => {};
    req.end = () => queueMicrotask(() => req.emit('error', privateError));
    return req;
  };
  await assert.rejects(verifyHttpsReference(reference, f), error => cleanError(error, 'REQUEST_FAILED'));
});

test('socket timeout destroys the request without leaking the signed reference URL', async () => {
  const f = fixture({ hang: true, idleTimeout: true });
  await assert.rejects(verifyHttpsReference(reference, f), error => cleanError(error, 'TIMEOUT'));
  assert.equal(f.requestDestroyed, true); assert.equal(f.calls.length, 1);
});

test('a total 30 second deadline bounds DNS even when the resolver never returns', async context => {
  context.mock.timers.enable({ apis: ['setTimeout'] });
  const f = fixture();
  f.lookupImpl = () => new Promise(() => {});
  const pending = verifyHttpsReference(reference, f);
  const checked = assert.rejects(pending, error => cleanError(error, 'TIMEOUT'));
  context.mock.timers.tick(30_000);
  await checked;
  assert.equal(f.calls.length, 0);
});

test('a total deadline also destroys an active request independently of socket activity', async context => {
  context.mock.timers.enable({ apis: ['setTimeout'] });
  const f = fixture({ hang: true });
  let signalStarted;
  const started = new Promise(resolve => { signalStarted = resolve; });
  const mockRequest = f.requestImpl;
  f.requestImpl = (...args) => { const req = mockRequest(...args); signalStarted(); return req; };
  const pending = verifyHttpsReference(reference, f);
  const checked = assert.rejects(pending, error => cleanError(error, 'TIMEOUT'));
  await started;
  context.mock.timers.tick(30_000);
  await checked;
  assert.equal(f.requestDestroyed, true); assert.equal(f.calls.length, 1);
});
