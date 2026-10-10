import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { EventEmitter } from 'node:events';
import { PassThrough } from 'node:stream';
import test from 'node:test';
import assert from 'node:assert/strict';
import { NATIVE_BASELINE, planTransfer, sendTransfer, transferStatus, reconcileTransfer, checkedDestination, inspectDestination, resolveNativeBinary, createNativeTransport, boundedNativeJson } from '../scripts/reference-transfer-core.mjs';

const project = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const parent = path.join(project, 'tmp', 'reference-transfer-tests');
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const selected = Buffer.from('Synthetic selected reference: independent exact-byte oracle\n');
const sensitive = 'Bearer planted-secret https://private.example/image?token=secret victim@example.test';
const account = { email: ' Creator@Example.test ', credits: 10, subscription_plan_type: 'synthetic' };
const workspace = { id: 'workspace-selected', name: null, plan_type: 'synthetic', credits: 10, is_selected: true, user_role: 'owner' };
const destination = { provider: 'higgsfield', route: 'native-cli', accountFingerprint: hash(Buffer.from('creator@example.test')), workspaceId: workspace.id };
const provenance = { actor: 'Synthetic user', at: '2026-10-09T12:00:00Z', event: 'Synthetic exact upload approval', source: 'test-fixture', notes: 'Transfer this exact selected image to this destination.' };
function fixture() {
  fs.mkdirSync(parent, { recursive: true });
  const root = fs.mkdtempSync(path.join(parent, 'studio-'));
  fs.mkdirSync(path.join(root, 'influencers/pilot/references'), { recursive: true });
  fs.writeFileSync(path.join(root, 'influencers/pilot/references/selected.png'), selected);
  fs.writeFileSync(path.join(root, 'unrelated-note.md'), 'preserved');
  const spec = { schemaVersion: 1, id: 'reference-001', source: { referenceId: 'ref-selected', path: 'references/selected.png', sha256: hash(selected), bytes: selected.length, mediaType: 'image', role: 'identity', order: 0 }, destination: structuredClone(destination), native: { ...NATIVE_BASELINE } };
  return { root, spec, grant: grant(spec), close() { assert.equal(path.dirname(fs.realpathSync(root)), fs.realpathSync(parent)); fs.rmSync(root, { recursive: true, force: true }); } };
}
function grant(spec) { return { schemaVersion: 1, transferId: spec.id, source: structuredClone(spec.source), destination: structuredClone(spec.destination), native: structuredClone(spec.native), approved: true, provenance: { ...provenance } }; }
function observation(spec, outcome = 'accepted', mediaId = '11111111-1111-4111-8111-111111111111') { return { schemaVersion: 1, transferId: spec.id, source: structuredClone(spec.source), destination: structuredClone(spec.destination), native: structuredClone(spec.native), outcome, mediaId, provenance: { ...provenance, event: 'Synthetic actual provider observation', source: 'synthetic-library-tool' } }; }
function adapter(overrides = {}) {
  const calls = [];
  return { calls, account: async () => { calls.push('account'); return { ...account }; }, workspace: async () => { calls.push('workspace'); return { ...workspace }; }, upload: async file => { calls.push(['upload', file, fs.readFileSync(file)]); return { id: '11111111-1111-4111-8111-111111111111', type: 'image', url: 'https://synthetic.example/media.png' }; }, list: async cursor => { calls.push(['list', cursor]); return { cursor: null, items: [{ id: '11111111-1111-4111-8111-111111111111', type: 'image', url: 'https://synthetic.example/media.png', created_at: '2026-10-09T12:00:00Z' }] }; }, ...overrides };
}
function snapshot(root) {
  const result = [];
  function walk(directory, relative = '') {
    for (const name of fs.readdirSync(directory).sort()) {
      const file = path.join(directory, name), key = relative ? `${relative}/${name}` : name, info = fs.lstatSync(file);
      if (info.isSymbolicLink()) result.push([key, 'link', fs.readlinkSync(file)]);
      else if (info.isDirectory()) { result.push([key, 'directory']); walk(file, key); }
      else result.push([key, fs.readFileSync(file).toString('base64')]);
    }
  }
  walk(root); return result;
}
function recordFile(root, id = 'reference-001') { return path.join(root, `influencers/pilot/.reference-transfers/${id}/intent.json`); }
function readRecord(root) { return JSON.parse(fs.readFileSync(recordFile(root), 'utf8')); }
function rewrite(root, change) { const record = readRecord(root); change(record); fs.writeFileSync(recordFile(root), JSON.stringify(record)); }
function copyCli(root) { fs.mkdirSync(path.join(root, 'scripts')); for (const name of ['reference-transfer.mjs', 'reference-transfer-core.mjs', 'development-context.mjs', 'higgsfield-local.mjs']) fs.copyFileSync(path.join(project, 'scripts', name), path.join(root, 'scripts', name)); }

test('offline plan/status preserve exact exclusive bytes and pending audio/video support without a provider', () => {
  const f = fixture();
  try {
    const result = planTransfer(f.root, 'pilot', f.spec);
    assert.equal(result.state, 'planned'); assert.equal(result.support, 'image-only-native-send');
    const record = readRecord(f.root); assert.deepEqual(fs.readFileSync(path.join(f.root, record.snapshot)), selected);
    assert.deepEqual(transferStatus(f.root, 'pilot', f.spec.id), result);
    const before = snapshot(f.root); assert.throws(() => planTransfer(f.root, 'pilot', f.spec), /already exists/); assert.deepEqual(snapshot(f.root), before);
    for (const [extension, mediaType] of [['wav', 'audio'], ['mp4', 'video']]) {
      const spec = structuredClone(f.spec); spec.id = `reference-${mediaType}`; spec.source.path = `references/selected.${extension}`; spec.source.mediaType = mediaType;
      fs.writeFileSync(path.join(f.root, `influencers/pilot/${spec.source.path}`), selected);
      assert.equal(planTransfer(f.root, 'pilot', spec).support, 'awaiting-verified-media-type');
    }
    assert.equal(fs.readFileSync(path.join(f.root, 'unrelated-note.md'), 'utf8'), 'preserved');
  } finally { f.close(); }
});

test('one exact authorized snapshot is persisted submitting before fixed native argv dispatch; receipts do not imply remote bytes/plugin access', async () => {
  const f = fixture();
  try {
    planTransfer(f.root, 'pilot', f.spec); const calls = [];
    const transport = createNativeTransport(f.root, async args => {
      calls.push(args);
      if (args[0] === 'account') return account;
      if (args[0] === 'workspace') return workspace;
      assert.deepEqual(args.slice(0, 2), ['upload', 'create']); assert.equal(args[3], '--json'); assert.equal(args.length, 4);
      assert.equal(readRecord(f.root).state, 'submitting'); assert.deepEqual(readRecord(f.root).authorization, provenance);
      assert.notEqual(args[2], path.join(f.root, 'influencers/pilot/references/selected.png')); assert.deepEqual(fs.readFileSync(args[2]), selected);
      return { id: '11111111-1111-4111-8111-111111111111', type: 'image', url: 'https://synthetic.example/media.png' };
    });
    const result = await sendTransfer(f.root, 'pilot', f.spec.id, f.grant, transport);
    assert.equal(result.state, 'uploaded'); assert.equal(result.mediaId, '11111111-1111-4111-8111-111111111111');
    assert.equal(result.pluginAccess, 'unverified'); assert.equal(result.providerBytes, 'unverified'); assert.equal(result.generationReadiness, 'unverified');
    assert.deepEqual(calls.slice(0, 2), [['account', 'status', '--json'], ['workspace', 'status', '--json']]);
    assert.equal(calls.filter(args => args[0] === 'upload').length, 1);
    assert.doesNotMatch(fs.readFileSync(recordFile(f.root), 'utf8'), /https:|example\.test|subscription_plan_type|credits/);
    const before = snapshot(f.root); await assert.rejects(sendTransfer(f.root, 'pilot', f.spec.id, f.grant, transport), /already been dispatched/); assert.deepEqual(snapshot(f.root), before);
  } finally { f.close(); }
});

test('grants must bind exact bytes, native route, role/order, account/workspace and actual user event; failures are zero-write/zero-provider', async () => {
  const f = fixture();
  try {
    planTransfer(f.root, 'pilot', f.spec);
    const mutations = [value => delete value.approved, value => value.approved = 'true', value => value.source.sha256 = 'a'.repeat(64), value => value.source.bytes++, value => value.source.role = 'scene', value => value.source.order++, value => value.source.referenceId = 'different-ref', value => value.destination.workspaceId = 'other-workspace', value => value.destination.accountFingerprint = 'b'.repeat(64), value => value.native.version = 'latest', value => delete value.provenance.event, value => value.provenance.notes = sensitive];
    for (const mutate of mutations) {
      const proposal = structuredClone(f.grant); mutate(proposal); const before = snapshot(f.root), transport = adapter();
      await assert.rejects(sendTransfer(f.root, 'pilot', f.spec.id, proposal, transport)); assert.deepEqual(snapshot(f.root), before); assert.equal(transport.calls.length, 0);
    }
    const reordered = { ...f.grant, source: Object.fromEntries(Object.entries(f.grant.source).reverse()), destination: Object.fromEntries(Object.entries(f.grant.destination).reverse()) };
    assert.equal((await sendTransfer(f.root, 'pilot', f.spec.id, reordered, adapter())).state, 'uploaded');
  } finally { f.close(); }
});

test('account/workspace mismatch, missing identities and query failure refuse before upload and preserve records', async () => {
  const f = fixture();
  try {
    planTransfer(f.root, 'pilot', f.spec);
    for (const overrides of [{ account: async () => ({ ...account, email: 'different@example.test' }) }, { workspace: async () => ({ ...workspace, id: 'other-workspace' }) }, { workspace: async () => ({ ...workspace, is_selected: 'yes' }) }, { account: async () => ({ email: account.email }) }, { account: async () => { throw new Error(sensitive); } }]) {
      const transport = adapter(overrides), before = snapshot(f.root);
      await assert.rejects(sendTransfer(f.root, 'pilot', f.spec.id, f.grant, transport)); assert.deepEqual(snapshot(f.root), before); assert.equal(transport.calls.some(call => Array.isArray(call) && call[0] === 'upload'), false);
    }
    assert.deepEqual(await inspectDestination(adapter()), destination);
    assert.deepEqual(checkedDestination(account, { ...workspace, is_selected: false }), destination);
    assert.throws(() => checkedDestination({ ...account, token: sensitive }, workspace), /unverified shape/);
  } finally { f.close(); }
});

test('unsafe paths/types/digests and unsupported executable source locations refuse offline before any tree change', () => {
  const f = fixture();
  try {
    for (const source of ['../selected.png', '/selected.png', 'references/../selected.png', 'references/CON.png', 'references/selected.png:stream', 'references/a\n.png', 'references/selected.png ', 'references\\selected.png', 'references/x.exe', 'tools/higgsfield/selected.png', '.env', 'media/http://private.example/x.png']) {
      const spec = structuredClone(f.spec); spec.source.path = source; const before = snapshot(f.root);
      assert.throws(() => planTransfer(f.root, 'pilot', spec)); assert.deepEqual(snapshot(f.root), before);
    }
    for (const mutate of [s => s.source.mediaType = 'video', s => s.source.bytes = 0, s => s.source.sha256 = 'a'.repeat(64), s => s.native.binarySha256 = 'b'.repeat(64), s => s.destination.provider = 'other']) {
      const spec = structuredClone(f.spec); mutate(spec); const before = snapshot(f.root); assert.throws(() => planTransfer(f.root, 'pilot', spec)); assert.deepEqual(snapshot(f.root), before);
    }
  } finally { f.close(); }
});

test('original and controlled snapshot drift, including mutation during destination checks, refuse before upload', async () => {
  for (const mutateSnapshot of [false, true]) {
    const f = fixture();
    try {
      planTransfer(f.root, 'pilot', f.spec); const file = path.join(f.root, mutateSnapshot ? readRecord(f.root).snapshot : 'influencers/pilot/references/selected.png');
      fs.chmodSync(file, 0o600); fs.writeFileSync(file, Buffer.alloc(selected.length, 65));
      const before = snapshot(f.root), transport = adapter(); await assert.rejects(sendTransfer(f.root, 'pilot', f.spec.id, f.grant, transport), /digest changed/); assert.deepEqual(snapshot(f.root), before); assert.equal(transport.calls.length, 0);
    } finally { f.close(); }
  }
  const f = fixture();
  try {
    planTransfer(f.root, 'pilot', f.spec);
    const transport = adapter({ workspace: async () => { fs.writeFileSync(path.join(f.root, 'influencers/pilot/references/selected.png'), 'new unapproved bytes'); return workspace; } });
    await assert.rejects(sendTransfer(f.root, 'pilot', f.spec.id, f.grant, transport), /changed/); assert.equal(transport.calls.some(call => Array.isArray(call) && call[0] === 'upload'), false); assert.equal(readRecord(f.root).state, 'planned');
  } finally { f.close(); }
});

test('actual directory junctions inside/outside the character and record paths refuse with zero-write evidence', () => {
  for (const targetRelative of ['influencers/pilot/references', 'outside']) {
    const f = fixture();
    try {
      const target = path.join(f.root, targetRelative); fs.mkdirSync(target, { recursive: true });
      fs.symlinkSync(target, path.join(f.root, 'influencers/pilot/media'), process.platform === 'win32' ? 'junction' : 'dir');
      const spec = structuredClone(f.spec); spec.source.path = 'media/selected.png'; const before = snapshot(f.root);
      assert.throws(() => planTransfer(f.root, 'pilot', spec), /Links and junctions/); assert.deepEqual(snapshot(f.root), before);
    } finally { f.close(); }
  }
  const f = fixture();
  try {
    fs.symlinkSync(path.join(f.root, 'influencers/pilot/references'), path.join(f.root, 'influencers/pilot/.reference-transfers'), process.platform === 'win32' ? 'junction' : 'dir');
    const before = snapshot(f.root); assert.throws(() => planTransfer(f.root, 'pilot', f.spec), /Links and junctions/); assert.deepEqual(snapshot(f.root), before);
  } finally { f.close(); }
});

test('linked source leaves, snapshot leaves, locks and development directories are refused before provider calls or writes', async () => {
  for (const location of ['source', 'snapshot', 'lock', 'development']) {
    const f = fixture();
    try {
      let file;
      if (location === 'source') file = path.join(f.root, 'influencers/pilot/references/selected.png');
      else if (location === 'development') file = path.join(f.root, '.development');
      else { planTransfer(f.root, 'pilot', f.spec); file = path.join(f.root, location === 'snapshot' ? readRecord(f.root).snapshot : 'influencers/pilot/.reference-transfers/.transfer.lock'); }
      if (fs.existsSync(file)) { fs.chmodSync(file, 0o600); fs.unlinkSync(file); }
      fs.symlinkSync(path.join(f.root, 'influencers/pilot/references'), file, process.platform === 'win32' ? 'junction' : 'dir');
      const before = snapshot(f.root), transport = adapter();
      if (['source', 'development'].includes(location)) assert.throws(() => planTransfer(f.root, 'pilot', f.spec), /Links and junctions|development/);
      else await assert.rejects(sendTransfer(f.root, 'pilot', f.spec.id, f.grant, transport), /Links and junctions/);
      assert.deepEqual(snapshot(f.root), before); assert.equal(transport.calls.length, 0);
    } finally { f.close(); }
  }
});

test('strict marker/dev paths refuse mutation, while read-only help remains available', () => {
  for (const marker of ['{', '{}', '{"schemaVersion":1,"kind":"framework-development"}']) {
    const f = fixture();
    try {
      fs.mkdirSync(path.join(f.root, '.development')); fs.writeFileSync(path.join(f.root, '.development/project.json'), marker); copyCli(f.root);
      const before = snapshot(f.root); assert.throws(() => planTransfer(f.root, 'pilot', f.spec), /development/); assert.deepEqual(snapshot(f.root), before);
      const cli = spawnSync(process.execPath, [path.join(f.root, 'scripts/reference-transfer.mjs'), 'help'], { encoding: 'utf8' }); assert.equal(cli.status, 0); assert.match(cli.stdout, /Exact local reference transfer/); assert.deepEqual(snapshot(f.root), before);
    } finally { f.close(); }
  }
});

test('unsupported planned audio/video cannot dispatch or query the provider', async () => {
  const f = fixture();
  try {
    f.spec.source.path = 'media/selected.wav'; f.spec.source.mediaType = 'audio'; fs.mkdirSync(path.join(f.root, 'influencers/pilot/media')); fs.writeFileSync(path.join(f.root, 'influencers/pilot/media/selected.wav'), selected);
    planTransfer(f.root, 'pilot', f.spec); const before = snapshot(f.root), transport = adapter();
    await assert.rejects(sendTransfer(f.root, 'pilot', f.spec.id, grant(f.spec), transport), /image receipts only/); assert.deepEqual(snapshot(f.root), before); assert.equal(transport.calls.length, 0);
  } finally { f.close(); }
});

test('ambiguous responses and raw provider failures are uncertain, redacted, and never retry or create another slot', async () => {
  const cases = [async () => { throw new Error(sensitive); }, async () => ({}), async () => ({ id: '22222222-2222-4222-8222-222222222222', type: 'image' }), async () => ({ id: '22222222-2222-4222-8222-222222222222', type: 'audio', url: 'https://synthetic.example/x.wav' }), async () => ({ id: '22222222-2222-4222-8222-222222222222', type: 'image', url: 'https://synthetic.example/x.png?token=secret' }), async () => ({ id: '22222222-2222-4222-8222-222222222222', type: 'image', url: 'https://synthetic.example/x.png', token: sensitive }), async () => ({ id: '22222222-2222-4222-8222-222222222222', type: 'image', url: 'https://user:secret@synthetic.example/x.png' }), async () => ({ id: '22222222-2222-4222-8222-222222222222', type: 'image', url: 'https://synthetic.example/x.png#secret' })];
  for (const upload of cases) {
    const f = fixture();
    try {
      planTransfer(f.root, 'pilot', f.spec); let count = 0; const transport = adapter({ upload: async file => { count++; assert.equal(readRecord(f.root).state, 'submitting'); return upload(file); } });
      const result = await sendTransfer(f.root, 'pilot', f.spec.id, f.grant, transport); assert.equal(result.state, 'uncertain'); assert.equal(count, 1);
      assert.doesNotMatch(JSON.stringify(result) + fs.readFileSync(recordFile(f.root), 'utf8'), /Bearer|planted-secret|https:|victim@|token=|secret/);
      await assert.rejects(sendTransfer(f.root, 'pilot', f.spec.id, f.grant, transport), /already been dispatched/);
      const changed = structuredClone(f.spec); changed.id = 'reference-new'; const before = snapshot(f.root); assert.throws(() => planTransfer(f.root, 'pilot', changed), /Reconcile/); assert.deepEqual(snapshot(f.root), before); assert.equal(count, 1);
    } finally { f.close(); }
  }
});

test('concurrent sends and lock collisions cannot dispatch twice', async () => {
  const f = fixture();
  try {
    planTransfer(f.root, 'pilot', f.spec); let releaseAccount; const gate = new Promise(resolve => { releaseAccount = resolve; }); let calls = 0;
    const transport = adapter({ account: async () => { await gate; return account; }, upload: async () => { calls++; return { id: '11111111-1111-4111-8111-111111111111', type: 'image', url: 'https://synthetic.example/x.png' }; } });
    const first = sendTransfer(f.root, 'pilot', f.spec.id, f.grant, transport);
    await assert.rejects(sendTransfer(f.root, 'pilot', f.spec.id, f.grant, transport), /lock/); releaseAccount(); assert.equal((await first).state, 'uploaded'); assert.equal(calls, 1);
  } finally { f.close(); }
});

test('receipt persistence failure retains submitting as an unresolved crash state and preserves snapshot', async () => {
  const f = fixture(), originalRename = fs.renameSync;
  try {
    planTransfer(f.root, 'pilot', f.spec); let dispatched = false;
    fs.renameSync = (...args) => { if (dispatched) throw Object.assign(new Error(sensitive), { code: 'EIO' }); return originalRename(...args); };
    const transport = adapter({ upload: async () => { dispatched = true; return { id: '11111111-1111-4111-8111-111111111111', type: 'image', url: 'https://synthetic.example/x.png' }; } });
    assert.equal((await sendTransfer(f.root, 'pilot', f.spec.id, f.grant, transport)).state, 'uncertain');
    assert.equal(readRecord(f.root).state, 'submitting'); assert.deepEqual(fs.readFileSync(path.join(f.root, readRecord(f.root).snapshot)), selected);
    fs.renameSync = originalRename;
    await assert.rejects(sendTransfer(f.root, 'pilot', f.spec.id, f.grant, adapter()), /already been dispatched/);
  } finally { fs.renameSync = originalRename; f.close(); }
});

test('a different process changing the record just before lock acquisition cannot cause stale planned dispatch', async () => {
  const f = fixture(), originalWrite = fs.writeFileSync;
  try {
    planTransfer(f.root, 'pilot', f.spec); let changed = false;
    fs.writeFileSync = (file, ...args) => {
      if (!changed && String(file).endsWith('.transfer.lock')) {
        changed = true;
        const record = readRecord(f.root); record.state = 'uploaded'; record.mediaId = '11111111-1111-4111-8111-111111111111'; record.mediaType = 'image';
        originalWrite(recordFile(f.root), JSON.stringify(record));
      }
      return originalWrite(file, ...args);
    };
    const transport = adapter(); await assert.rejects(sendTransfer(f.root, 'pilot', f.spec.id, f.grant, transport), /latest intent/); assert.equal(transport.calls.length, 0); assert.equal(readRecord(f.root).state, 'uploaded');
  } finally { fs.writeFileSync = originalWrite; f.close(); }
});

test('known-ID pagination proves library existence; only exact scoped observation resolves and permits a new intent', async () => {
  const f = fixture();
  try {
    planTransfer(f.root, 'pilot', f.spec); await sendTransfer(f.root, 'pilot', f.spec.id, f.grant, adapter({ upload: async () => ({ id: '11111111-1111-4111-8111-111111111111', type: 'image' }) }));
    const cursors = [], transport = adapter({ list: async cursor => { cursors.push(cursor); return cursor ? { cursor: null, items: [{ id: '11111111-1111-4111-8111-111111111111', type: 'image', url: 'https://synthetic.example/x.png', created_at: '2026-10-09T12:00:00Z' }] } : { cursor: 'next-page', items: [] }; } });
    const status = await reconcileTransfer(f.root, 'pilot', f.spec.id, null, transport); assert.equal(status.state, 'uncertain'); assert.equal(status.libraryExists, true); assert.deepEqual(cursors, [null, 'next-page']);
    const wrong = observation(f.spec); wrong.source.sha256 = 'b'.repeat(64); const before = snapshot(f.root); await assert.rejects(reconcileTransfer(f.root, 'pilot', f.spec.id, wrong, transport), /does not match/); assert.deepEqual(snapshot(f.root), before);
    const resolved = await reconcileTransfer(f.root, 'pilot', f.spec.id, observation(f.spec), transport); assert.equal(resolved.state, 'uploaded'); assert.equal(resolved.providerBytes, 'unverified'); assert.equal(resolved.pluginAccess, 'unverified');
    const next = structuredClone(f.spec); next.id = 'reference-next'; assert.equal(planTransfer(f.root, 'pilot', next).state, 'planned');
    await assert.rejects(sendTransfer(f.root, 'pilot', f.spec.id, f.grant, transport), /already been dispatched/);
  } finally { f.close(); }
});

test('unknown-ID uncertainty/empty library never proves absence; explicit actual non-submission observation can resolve', async () => {
  const f = fixture();
  try {
    planTransfer(f.root, 'pilot', f.spec); await sendTransfer(f.root, 'pilot', f.spec.id, f.grant, adapter({ upload: async () => { throw new Error('synthetic lost response'); } }));
    const transport = adapter({ list: async () => ({ cursor: null, items: [] }) });
    assert.equal((await reconcileTransfer(f.root, 'pilot', f.spec.id, null, transport)).state, 'uncertain'); assert.equal(transport.calls.some(call => Array.isArray(call) && call[0] === 'list'), false);
    assert.equal((await reconcileTransfer(f.root, 'pilot', f.spec.id, observation(f.spec, 'not-submitted', null), transport)).state, 'not-submitted');
    await assert.rejects(sendTransfer(f.root, 'pilot', f.spec.id, f.grant, transport), /already been dispatched/);
  } finally { f.close(); }
});

test('missing known ID, unknown library schemas and repeated cursors retain uncertainty without fabricated resolution', async () => {
  const f = fixture();
  try {
    planTransfer(f.root, 'pilot', f.spec); await sendTransfer(f.root, 'pilot', f.spec.id, f.grant, adapter({ upload: async () => ({ id: '11111111-1111-4111-8111-111111111111', type: 'image' }) }));
    const empty = adapter({ list: async () => ({ cursor: null, items: [] }) });
    assert.equal((await reconcileTransfer(f.root, 'pilot', f.spec.id, null, empty)).state, 'uncertain');
    const before = snapshot(f.root);
    await assert.rejects(reconcileTransfer(f.root, 'pilot', f.spec.id, observation(f.spec), empty), /absence does not prove/); assert.deepEqual(snapshot(f.root), before);
    await assert.rejects(reconcileTransfer(f.root, 'pilot', f.spec.id, null, adapter({ list: async () => ({ cursor: 'same-page', items: [] }) })), /did not advance/); assert.deepEqual(snapshot(f.root), before);
    await assert.rejects(reconcileTransfer(f.root, 'pilot', f.spec.id, null, adapter({ list: async () => ({ cursor: null, items: [], token: sensitive }) })), /Unrecognized/); assert.deepEqual(snapshot(f.root), before);
    assert.equal(readRecord(f.root).state, 'uncertain');
    const args = []; const native = createNativeTransport(f.root, async input => { args.push(input); return {}; }); await native.list('next-page');
    assert.deepEqual(args, [['upload', 'list', '--image', '--size', '20', '--cursor', 'next-page', '--json']]);
  } finally { f.close(); }
});

test('crashed submitting record remains unresolved across fresh CLI status and live-lock reconciliation refuses', async () => {
  const f = fixture();
  try {
    planTransfer(f.root, 'pilot', f.spec); rewrite(f.root, record => { record.state = 'submitting'; }); copyCli(f.root);
    const cli = spawnSync(process.execPath, [path.join(f.root, 'scripts/reference-transfer.mjs'), 'status', 'pilot', f.spec.id], { encoding: 'utf8' }); assert.equal(cli.status, 2); assert.equal(JSON.parse(cli.stdout).state, 'submitting');
    fs.writeFileSync(path.join(f.root, 'influencers/pilot/.reference-transfers/.transfer.lock'), JSON.stringify({ pid: process.pid, nonce: 'synthetic-live-owner' }));
    const before = snapshot(f.root); await assert.rejects(reconcileTransfer(f.root, 'pilot', f.spec.id, observation(f.spec, 'not-submitted', null), adapter()), /still active/); assert.deepEqual(snapshot(f.root), before);
  } finally { f.close(); }
});

test('explicit reconciliation safely reclaims a proven dead local lock owner without retrying upload', async () => {
  const f = fixture(), originalKill = process.kill;
  try {
    planTransfer(f.root, 'pilot', f.spec); rewrite(f.root, record => { record.state = 'submitting'; });
    fs.writeFileSync(path.join(f.root, 'influencers/pilot/.reference-transfers/.transfer.lock'), JSON.stringify({ pid: 123456789, nonce: 'synthetic-dead-owner' }));
    process.kill = (pid, signal) => { assert.equal(pid, 123456789); assert.equal(signal, 0); throw Object.assign(new Error('synthetic dead owner'), { code: 'ESRCH' }); };
    const transport = adapter(); const result = await reconcileTransfer(f.root, 'pilot', f.spec.id, observation(f.spec, 'not-submitted', null), transport);
    assert.equal(result.state, 'not-submitted'); assert.equal(transport.calls.some(call => Array.isArray(call) && call[0] === 'upload'), false); assert.equal(fs.existsSync(path.join(f.root, 'influencers/pilot/.reference-transfers/.transfer.lock')), false);
  } finally { process.kill = originalKill; f.close(); }
});

test('reconciliation rereads terminal state after locking instead of resolving a stale submitting copy', async () => {
  const f = fixture(), originalWrite = fs.writeFileSync;
  try {
    planTransfer(f.root, 'pilot', f.spec); rewrite(f.root, record => { record.state = 'submitting'; }); let changed = false;
    fs.writeFileSync = (file, ...args) => {
      if (!changed && String(file).endsWith('.transfer.lock')) { changed = true; const record = readRecord(f.root); record.state = 'uploaded'; record.mediaId = '11111111-1111-4111-8111-111111111111'; record.mediaType = 'image'; originalWrite(recordFile(f.root), JSON.stringify(record)); }
      return originalWrite(file, ...args);
    };
    const transport = adapter(); await assert.rejects(reconcileTransfer(f.root, 'pilot', f.spec.id, observation(f.spec, 'not-submitted', null), transport), /conflicts|cannot be changed/); assert.equal(transport.calls.length, 0); assert.equal(readRecord(f.root).state, 'uploaded');
  } finally { fs.writeFileSync = originalWrite; f.close(); }
});

test('public CLI refuses unknown operations/bypasses/invalid inputs and native pin negatives without provider invocation', () => {
  const f = fixture();
  try {
    copyCli(f.root);
    for (const args of [['send', '--binary', 'anything'], ['upload', 'x'], ['destination', '--exe', 'x'], ['plan', 'pilot', '../outside.json'], ['reconcile', 'pilot', 'missing']]) {
      const before = snapshot(f.root), result = spawnSync(process.execPath, [path.join(f.root, 'scripts/reference-transfer.mjs'), ...args], { encoding: 'utf8', env: { ...process.env, HIGGSFIELD_BINARY: 'anything' } }); assert.equal(result.status, 1); assert.deepEqual(snapshot(f.root), before); assert.doesNotMatch(result.stderr, /Bearer|planted-secret/);
    }
    assert.throws(() => resolveNativeBinary(f.root), /missing/);
    fs.mkdirSync(path.join(f.root, 'tools/higgsfield/node_modules/@higgsfield/cli/vendor'), { recursive: true });
    fs.writeFileSync(path.join(f.root, 'tools/higgsfield/node_modules/@higgsfield/cli/package.json'), JSON.stringify({ name: '@higgsfield/cli', version: 'wrong' })); assert.throws(() => resolveNativeBinary(f.root), /pinned version/);
    fs.writeFileSync(path.join(f.root, 'tools/higgsfield/node_modules/@higgsfield/cli/package.json'), JSON.stringify({ name: '@higgsfield/cli', version: '1.1.26' })); fs.writeFileSync(path.join(f.root, 'tools/higgsfield/node_modules/@higgsfield/cli/vendor/hf.exe'), 'unverified bytes'); assert.throws(() => resolveNativeBinary(f.root), /integrity|Windows x64/);
    for (const args of [['inspect', 'upload', 'create', 'references/x.png'], ['inspect', 'generate', 'cost', 'model', '--image', 'references/x.png']]) {
      const result = spawnSync(process.execPath, [path.join(f.root, 'scripts/higgsfield-local.mjs'), ...args], { encoding: 'utf8' }); assert.equal(result.status, 1); assert.match(result.stderr, /outside permitted reads|not permitted/);
    }
  } finally { f.close(); }
});

test('bounded native process uses separate argv, hides windows and redacts nonzero/oversized/malformed/interrupted raw output', async () => {
  const f = fixture();
  try {
    for (const scenario of ['nonzero', 'oversized', 'malformed', 'interrupted', 'timeout', 'success']) {
      let options, args, killed = false;
      const factory = (exe, received, opts) => {
        args = received; options = opts; const child = new EventEmitter(); child.stdout = new PassThrough(); child.stderr = new PassThrough(); child.kill = () => { killed = true; };
        queueMicrotask(() => { child.stderr.write(sensitive); if (scenario === 'timeout') return; if (scenario === 'oversized') child.stdout.write(Buffer.alloc(1024 * 1024 + 1, 65)); else child.stdout.write(scenario === 'malformed' ? sensitive : '{"synthetic":true}'); child.emit('close', scenario === 'nonzero' ? 1 : 0, scenario === 'interrupted' ? 'SIGTERM' : null); });
        return child;
      };
      const call = boundedNativeJson('synthetic-native', f.root, ['upload', 'create', 'snapshot with spaces.png', '--json'], factory, scenario === 'timeout' ? 5 : 30000);
      if (scenario === 'success') assert.deepEqual(await call, { synthetic: true });
      else await assert.rejects(call, error => { assert.doesNotMatch(error.message, /Bearer|private\.example|victim@|planted-secret/); return true; });
      assert.deepEqual(args, ['upload', 'create', 'snapshot with spaces.png', '--json']); assert.equal(options.shell, false); assert.equal(options.windowsHide, true); assert.deepEqual(options.stdio, ['ignore', 'pipe', 'pipe']); if (scenario === 'oversized') assert.equal(killed, true);
    }
  } finally { f.close(); }
});
