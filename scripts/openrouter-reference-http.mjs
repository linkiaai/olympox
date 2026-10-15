import { createHash } from 'node:crypto';
import { lookup } from 'node:dns/promises';
import { request } from 'node:https';
import { isIP } from 'node:net';

const REFERENCE_LIMIT = 64 * 1024 * 1024;
const TIMEOUT_MS = 30_000;
const MESSAGES = {
  INVALID_URL: 'Use a public HTTPS reference URL without credentials, fragments or a custom port.',
  UNSAFE_ADDRESS: 'The reference URL resolves to an unsupported or non-public network address.',
  INVALID_INPUT: 'The reference requires a SHA-256 digest, a positive byte count up to 64 MiB and a canonical MIME type.',
  DNS_FAILED: 'The reference hostname could not be resolved safely.',
  REQUEST_FAILED: 'The reference HTTPS readback could not be completed.',
  TIMEOUT: 'The reference HTTPS readback exceeded its time limit.',
  REDIRECT_REFUSED: 'Reference HTTPS redirects are refused.',
  HTTP_ERROR: 'The reference server did not return HTTP 200.',
  INVALID_CONTENT_TYPE: 'The reference server returned a different media type.',
  INVALID_ENCODING: 'The reference server returned an encoded response.',
  INVALID_LENGTH: 'The reference server returned a different or invalid byte count.',
  HASH_MISMATCH: 'The reference HTTPS bytes do not match the expected SHA-256 digest.'
};

export class OpenRouterReferenceError extends Error {
  constructor(code) {
    super(MESSAGES[code]);
    this.name = 'OpenRouterReferenceError';
    this.code = code;
  }
}

function fail(code) { throw new OpenRouterReferenceError(code); }
function need(condition, code) { if (!condition) fail(code); }

function ipv4Number(address) {
  return address.split('.').reduce((value, octet) => value * 256 + Number(octet), 0);
}

function ipv6Number(address) {
  const [left, right] = address.split('::');
  const start = left ? left.split(':') : [];
  const end = right ? right.split(':') : [];
  const parts = right === undefined ? start : [...start, ...Array(8 - start.length - end.length).fill('0'), ...end];
  return parts.reduce((value, part) => (value << 16n) + BigInt(`0x${part}`), 0n);
}

// Conservatively refuse IANA special-purpose space, including globally routed special services.
// Sources: https://www.iana.org/assignments/iana-ipv4-special-registry
//          https://www.iana.org/assignments/iana-ipv6-special-registry
const IPV4_BLOCKS = [
  ['0.0.0.0', 8], ['10.0.0.0', 8], ['100.64.0.0', 10], ['127.0.0.0', 8],
  ['169.254.0.0', 16], ['172.16.0.0', 12], ['192.0.0.0', 24], ['192.0.2.0', 24],
  ['192.31.196.0', 24], ['192.52.193.0', 24], ['192.88.99.0', 24], ['192.168.0.0', 16],
  ['192.175.48.0', 24], ['198.18.0.0', 15], ['198.51.100.0', 24], ['203.0.113.0', 24],
  ['224.0.0.0', 4], ['240.0.0.0', 4]
].map(([address, prefix]) => [ipv4Number(address), 2 ** (32 - prefix)]);
const IPV6_BLOCKS = [
  ['2001::', 23], ['2001:db8::', 32], ['2002::', 16], ['2620:4f:8000::', 48], ['3fff::', 20]
].map(([address, prefix]) => [ipv6Number(address), BigInt(128 - prefix)]);

function publicAddress(address) {
  if (typeof address !== 'string' || address.includes('%')) return false;
  const family = isIP(address);
  if (family === 4) {
    const value = ipv4Number(address);
    return !IPV4_BLOCKS.some(([base, size]) => Math.floor(value / size) === Math.floor(base / size));
  }
  if (family !== 6 || !/^[a-f0-9:]+$/i.test(address)) return false;
  const value = ipv6Number(address);
  // Only global unicast 2000::/3 is eligible; this excludes mapped, local and translation space.
  return value >> 125n === 1n && !IPV6_BLOCKS.some(([base, shift]) => value >> shift === base >> shift);
}

function urlHostname(url) { return url.hostname.replace(/^\[|\]$/g, ''); }

export function validateReferenceUrl(value) {
  try {
    need(typeof value === 'string' && value.length > 0 && value.length <= 8192 && /^https:\/\//i.test(value) && !/[\s\\\x00-\x1f\x7f]/.test(value), 'INVALID_URL');
    const url = new URL(value);
    need(url.protocol === 'https:' && !url.username && !url.password && !value.slice(value.indexOf('//') + 2).split(/[/?#]/, 1)[0].includes('@') && !url.hash && !value.includes('#') && (!url.port || url.port === '443'), 'INVALID_URL');
    const hostname = urlHostname(url);
    if (isIP(hostname)) {
      need(publicAddress(hostname), 'UNSAFE_ADDRESS');
    } else {
      need(hostname.length <= 253 && hostname.includes('.') && !hostname.endsWith('.') && hostname.split('.').every(label => /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(label)), 'INVALID_URL');
      need(!/(^|\.)(?:localhost|local|localdomain|internal|intranet|lan|home|test|invalid|example|onion|alt|arpa)$/.test(hostname), 'INVALID_URL');
    }
    return url;
  } catch (error) {
    if (error instanceof OpenRouterReferenceError) throw error;
    fail('INVALID_URL');
  }
}

function destroy(stream) { try { stream?.destroy(); } catch { /* Discard transport errors without recording upstream details. */ } }

async function resolveAddresses(hostname, lookupImpl, deadline) {
  if (isIP(hostname)) return [{ address: hostname, family: isIP(hostname) }];
  let timer;
  try {
    const addresses = await Promise.race([
      Promise.resolve().then(() => lookupImpl(hostname, { all: true, verbatim: true })),
      new Promise((resolve, reject) => { timer = setTimeout(() => reject(new OpenRouterReferenceError('TIMEOUT')), Math.max(1, deadline - Date.now())); })
    ]);
    need(Array.isArray(addresses) && addresses.length > 0, 'DNS_FAILED');
    need(addresses.every(entry => entry && publicAddress(entry.address) && entry.family === isIP(entry.address)), 'UNSAFE_ADDRESS');
    return addresses.map(({ address, family }) => ({ address, family }));
  } catch (error) {
    if (error instanceof OpenRouterReferenceError) throw error;
    fail('DNS_FAILED');
  } finally { clearTimeout(timer); }
}

function pinnedLookup(hostname, addresses) {
  return (queriedHost, options, callback) => {
    if (typeof options === 'function') { callback = options; options = {}; }
    if (queriedHost !== hostname) return callback(new OpenRouterReferenceError('DNS_FAILED'));
    const family = typeof options === 'number' ? options : options?.family;
    const selected = family === 4 || family === 6 ? addresses.filter(entry => entry.family === family) : addresses;
    if (!selected.length) return callback(new OpenRouterReferenceError('DNS_FAILED'));
    if (options?.all) return callback(null, selected.map(entry => ({ ...entry })));
    return callback(null, selected[0].address, selected[0].family);
  };
}

export async function verifyHttpsReference(reference, { lookupImpl = lookup, requestImpl = request } = {}) {
  try {
    const url = validateReferenceUrl(reference?.url);
    const { sha256, bytes, mimeType } = reference;
    need(typeof sha256 === 'string' && /^[a-f0-9]{64}$/.test(sha256) && Number.isSafeInteger(bytes) && bytes > 0 && bytes <= REFERENCE_LIMIT && typeof mimeType === 'string' && /^[a-z0-9][a-z0-9!#$&^_.+-]*\/[a-z0-9][a-z0-9!#$&^_.+-]*$/.test(mimeType), 'INVALID_INPUT');
    need(typeof lookupImpl === 'function' && typeof requestImpl === 'function', 'INVALID_INPUT');
    const deadline = Date.now() + TIMEOUT_MS;
    const hostname = urlHostname(url);
    const addresses = await resolveAddresses(hostname, lookupImpl, deadline);
    return await new Promise((resolve, reject) => {
      let req, response, settled = false, received = 0;
      const digest = createHash('sha256');
      const stop = code => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        reject(new OpenRouterReferenceError(code));
        destroy(response); destroy(req);
      };
      const timer = setTimeout(() => stop('TIMEOUT'), Math.max(1, deadline - Date.now()));
      try {
        req = requestImpl(url, {
          method: 'GET', port: 443, agent: false,
          headers: { Accept: mimeType, 'Accept-Encoding': 'identity' },
          lookup: pinnedLookup(hostname, addresses), rejectUnauthorized: true,
          ...(isIP(hostname) ? {} : { servername: hostname })
        }, incoming => {
          response = incoming;
          incoming.on('error', () => stop('REQUEST_FAILED'));
          if (settled) return destroy(incoming);
          incoming.on('aborted', () => stop('INVALID_LENGTH'));
          incoming.on('close', () => { if (!settled) stop('INVALID_LENGTH'); });
          if (incoming.statusCode !== 200) return stop(incoming.statusCode >= 300 && incoming.statusCode < 400 ? 'REDIRECT_REFUSED' : 'HTTP_ERROR');
          const type = incoming.headers?.['content-type'];
          const actualMime = typeof type === 'string' ? type.split(';', 1)[0].trim().toLowerCase() : null;
          if (actualMime !== mimeType && actualMime !== 'application/octet-stream') return stop('INVALID_CONTENT_TYPE');
          const encoding = incoming.headers?.['content-encoding'];
          if (encoding !== undefined && (typeof encoding !== 'string' || encoding.trim().toLowerCase() !== 'identity')) return stop('INVALID_ENCODING');
          const length = incoming.headers?.['content-length'];
          if (length !== undefined && (typeof length !== 'string' || !/^\d+$/.test(length) || Number(length) !== bytes)) return stop('INVALID_LENGTH');
          incoming.on('data', chunk => {
            if (settled) return;
            if (!(chunk instanceof Uint8Array) || received + chunk.byteLength > bytes) return stop('INVALID_LENGTH');
            received += chunk.byteLength;
            digest.update(chunk);
          });
          incoming.on('end', () => {
            if (settled) return;
            if (received !== bytes || incoming.complete === false) return stop('INVALID_LENGTH');
            if (digest.digest('hex') !== sha256) return stop('HASH_MISMATCH');
            settled = true; clearTimeout(timer);
            resolve({ sha256, bytes, mimeType, checkedAt: new Date().toISOString(), urlFingerprint: createHash('sha256').update(url.href).digest('hex'), transport: 'https' });
          });
        });
        req.on('error', () => stop('REQUEST_FAILED'));
        req.setTimeout(TIMEOUT_MS, () => stop('TIMEOUT'));
        if (settled) destroy(req); else req.end();
      } catch { stop('REQUEST_FAILED'); }
    });
  } catch (error) {
    if (error instanceof OpenRouterReferenceError) throw error;
    fail('REQUEST_FAILED');
  }
}
