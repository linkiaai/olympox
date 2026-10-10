# Story ENG-003: Transfer an exact local image reference with a recoverable receipt

<!-- Source: verified assessment F1, accepted ADR 002 and the user's local next-increment authorization. -->

## Status

**Done**

## Executor Assignment

executor: "@dev"
quality_gate: "@architect"
quality_gate_tools: ["exact staged-byte native-argv fixtures", "authorization/destination/path/drift refusal", "uncertain-outcome reconciliation and output redaction", "npm.cmd run verify", "actual archive and independent installed-studio preservation"]

Dex reference-transfer worker implements after Ready; Aria owns design review. Quinn owns independent QA and the Done lifecycle. Pax validates and later administers accepted closure; Orion coordinates shared file ownership with ENG-004. Gage handles only a separately authorized remote release.

## Story

**As a** creator using an independent OLYMPOX studio,
**I want** the assistant to transfer my explicitly authorized exact local image through the verified native Higgsfield CLI and retain an accountable receipt,
**so that** I can continue from the chosen reference without manually uploading it or silently substituting another file or destination.

## Requirement source and scope

F1 is a verified gap: the existing local preparation wrapper cannot transfer files; writing a local path in a prompt is not attaching the reference. The plugin's remote sandbox upload and actual ChatGPT attachment helper do not establish access to an arbitrary Windows studio file. Accepted [ADR 002](../decisions/002-exact-reference-and-vocal-scope.md) defines the separate native transport; its [pt-BR companion](../decisions/002-exact-reference-and-vocal-scope.pt-BR.md) preserves the same scope.

This increment implements a dependency-free local transport and synthetic verification. Native image receipts are supported by actual checked response evidence; audio/video success enums and other platforms are unverified and remain pending. No live login/upload, account/workspace mutation, paid generation, training, personal production or publication is authorized here. A future actual send requires its own applicable exact transfer authorization in an installed studio. ENG-001/002 closure bytes stay untouched; ENG-004, F3, F6 and INV-001 have separate scopes.

## Acceptance Criteria

1. Add one bounded transfer core, public CLI and reusable specification template, separate from `scripts/higgsfield-local.mjs`. Expose offline help/preparation, redacted status, one authorized send and explicit read-only reconciliation with documented syntax. Recognize the allowed local image/video/audio extensions and report the execution support boundary; this increment's send supports images only. Unsupported media cannot silently dispatch or become a supported success. No package dependencies, general provider framework, automatic install/login/workspace selection or shell-composed command is added. The existing `inspect` route remains unable to upload, generate or accept media-bearing cost estimates.
2. A private specification/intent binds one character, one relative source in that character's `references/` or `media/`, SHA-256, byte count, media type, provider/native baseline, expected account fingerprint and exact workspace ID. A separate applicable grant supplied at send names the same digest/size/destination and has actual actor/date/event/source/notes provenance; conceptual/canon approval alone is insufficient. Offline plan/status do not require that send grant. Existing explicit session authorization may be recorded without asking again. A declaration is traceability, not human authentication. Help and preparation remain usable without provider tools; no credential files are opened.
3. Before source-byte reads or mutation, preflight supported types and every source/record/staging/lock path. Refuse absolute/traversal/device/control-character paths, paths outside the selected character, credential/provider-install paths, linked parents/leaves, junctions and equivalent redirects, including links pointing back inside the tree. Apply the strict development-context guard before mutation/dispatch. Malformed markers, markers missing required fields and linked development paths fail closed; ordinary unmarked installed studios and the internal synthetic fixture API remain usable. Refusal before a plan writes has zero-write evidence and no provider invocation.
4. Planning records a private intent and exclusive controlled snapshot of the exact source bytes. Sending rechecks both original source and snapshot hash/size against the authorized expected values, and passes that controlled snapshot to the native upload. Source or snapshot drift refuses before upload without changing historical bytes or authorization. Confined atomic records and a local exclusive lock prevent ordinary concurrent/duplicate dispatch; link checks also cover newly used record/lock/staging paths. Preserve intent/snapshot on uncertain outcomes. These controls are local integrity checks, not a hostile-user filesystem security guarantee.
5. The public send resolves only the existing verified official `@higgsfield/cli@1.1.26` Windows x64 binary with its pinned SHA-256. Immediately before dispatch it reads actual `account status --json` and `workspace status --json`, derives `SHA256(UTF8(email.trim().toLowerCase()))`, and compares the exact native workspace string and account fingerprint with both intent and authorization. Missing/malformed identity, changed account/workspace/version/binary, query failure or absent provider refuses before upload. Never auto-switch workspace. Native dispatch uses fixed `upload create <snapshot> --json` arguments, `shell: false`, `windowsHide: true`, bounded output and timeout. A private injected adapter is a synthetic API seam; no public CLI/environment override selects arbitrary binaries.
6. Persist intent and `submitting` before the single native upload call. Accept only the verified native response shape `{id: string, type: string, url: string}` with a valid opaque ID, supported `image` type and ordinary HTTPS URL shape without userinfo/query/fragment; unknown/ambiguous schemas never become success. Parse needed provider values only in memory. Persist/print only allowlisted local source/destination/event/state fields plus returned media ID/type: exclude every provider URL, raw email, credentials, arbitrary fields and raw stdout/stderr, including error/status/debug paths. The receipt binds exact local bytes and native acknowledgement; provider-stored byte equality and plugin/module accessibility remain explicitly unverified until independent actual checks. It is not generation readiness.
7. Timeout/interruption/nonzero exit after upload dispatch, malformed/unknown output or failure saving an accepted response is uncertain. A crash left at `submitting` stays unresolved; no automatic retry, new slot, alternate plugin route or inferred failure is allowed. Send refuses an already dispatched, uncertain or terminal intent; changed source/destination needs a new intent/authorization after earlier uncertainty is reconciled. Preserve failed evidence and staged bytes; do not mark a missing receipt as proof that no remote upload happened.
8. Reconciliation never uploads, generates or deletes. Use the verified paginated `upload list` route with a known returned ID when available and explicit source-bound tool/event observations. A matching library ID proves existence only. Unknown-ID timestamps, a new row, truncated/empty recent pages or missing rows do not prove source association/absence and cannot authorize retry; retain uncertainty. An external confirmed receipt may be recorded only with actual source/destination/tool/event provenance. Record each resolved claim at the scope its evidence proves; do not invent provider idempotency, deletion or an unverified `upload get` API.
9. Meaningful fixtures exercise exact snapshot bytes and argv; absent/mismatched authorization/account/workspace; original/snapshot drift; invalid types/paths/linked parents/leaves/junctions/markers; missing/wrong binary; malformed/unknown/oversized output; timeout/interruption; persist-before-dispatch; concurrent sends/lock collision; receipt-write failure/crash recovery; known-ID pagination and unknown-ID uncertainty; terminal duplicate refusal; redaction of planted email/URL/token/raw error values; zero-write and zero-upload refusal where applicable. Exercise public CLI and core boundaries, not only matching helper tokens. Synthetic image/media shapes prove local handling, not live provider output, byte retention, image quality or cross-plugin acceptance.
10. Update affected English help/templates/Higgsfield setup/guidance and pt-BR editions together, plus command descriptions in existing manual configuration/locales. Reconcile shared skill/studio instruction files with ENG-004 through Orion; preserve unrelated manual work. Explicitly include only reusable modules/templates/tests/guidance in package/installer selection; intents, receipts, staged media, provider binaries/credentials and all engineering state stay excluded. Complete `npm.cmd run verify`, actual packed/extracted installation in an independent temporary destination, exact-source/export inspection, both-host instruction checks, unrelated-file/Git preservation and merge conflict zero-write checks, followed by Aria/Quinn scoped review. No live provider or Codex/Claude media-parity claim follows from those gates.

## CodeRabbit Integration

`coderabbit_integration.enabled: true` is configured. The prior external diff-review command was rejected before execution by automatic approval review because authorization did not cover exporting the diff to that service. This story authorizes no such export; retain the existing blocked record and do not report an unexecuted review as passed.

### Story Type Analysis

Primary: external-system integration through a verified local CLI. Secondary: local authorization, persistence, privacy and installer/export. Risk: medium with consequential dispatch uncertainty; isolated new operation, no change to creative history, canon or generation. Integration points are the optional pinned binary, contained studio files, transfer records, installed CLI/help and explicit export selection.

### Specialized Agent Assignment

Dex reference-transfer worker implements; Aria reviews architecture; Quinn independently tests/verifies and owns lifecycle; Pax validates planning; Orion allocates overlapping documentation/catalog changes. Gage handles a future authorized remote operation only.

### Quality Gate Tasks

- [x] Pre-commit preparation: focused failure/regression checks, full product verification, actual archive/install/privacy/preservation review and independent Aria/Quinn evidence prepared for the final QA verdict. Record the configured CodeRabbit block accurately without rerouting the diff externally.
- N/A — Pre-PR and deployment: no remote operation or deployment is authorized in this increment.

### Self-Healing Configuration

Existing Dex light-review policy applies only if an authorized review can execute: maximum two iterations/15 minutes for critical findings, preserving unresolved failure evidence. No retry of media dispatch or paid provider operation is part of self-healing.

### Focus Areas

Exact inputs and staged bytes, destination/authorization matching, original preparation behavior, confined paths, no duplicate uncertain upload, redacted records, explicit evidence limits, privacy/preservation and reversible isolated source changes.

## Tasks / Subtasks

- [x] Add the bounded core/CLI/specification with offline help, preparation, status and scoped image-only execution support (AC 1, 2).
- [x] Implement strict context/path/type/authorization checks and exact controlled snapshots with atomic lock/state handling (AC 2–4).
- [x] Reuse or narrowly extract the pinned binary integrity resolver; implement allowlisted native identity/upload/list arguments and bounded output (AC 1, 5, 6, 8).
- [x] Persist pre-dispatch state, accept only checked response schema, redact all provider output and handle uncertain outcomes without retry (AC 6, 7).
- [x] Implement evidence-scoped read-only reconciliation and duplicate/new-intent rules (AC 7, 8).
- [x] Add meaningful public/core failure and exact-byte fixtures without live provider calls; preserve existing readonly-wrapper behavior (AC 1, 3–9).
- [x] Update paired docs/help/templates/catalog sources and explicit export/install selection under Orion's file allocation (AC 10).
- [x] Complete full/packed/installed preservation gates and maintain actual File List/Dev records for independent QA (AC 9, 10).

## Dev Notes

Existing `scripts/higgsfield-local.mjs` resolves `tools/higgsfield/node_modules/@higgsfield/cli`, checks package name/version and Windows x64 executable hash, then launches fixed argv with `spawn`. Its preparation scope explicitly excludes uploads/generation; cost accepts only scalar flags. A narrow shared resolver may preserve these exact checks; do not loosen them while extracting code. Pinned provenance in `vendor/higgsfield-skills/provenance.json`: CLI 1.1.26; executable SHA-256 `0e973c9cf072ec27af8be61e374c8aba5842766bd21654e28dfa758605ca76da`. No provider installation is bundled or currently present in this engineering root.

ADR 002 records actual auth-free native help and authorized read-only shape evidence: account returns `email`, `credits`, `subscription_plan_type`; selected workspace returns `id`, `name`, `plan_type`, `credits`, `is_selected`, `user_role`; upload list returns `cursor` and `items` with `id/type/url/created_at`. Prior accepted successful upload shape is exactly `id/type/url`, with `image` independently checked; a UUID-shaped ID and ordinary HTTPS URL without userinfo/query/fragment were safely asserted without copying values. The [pinned official README](https://github.com/higgsfield-ai/cli/blob/v1.1.26/README.md) and actual help establish upload create/list, not `upload get` or internal REST endpoints. Query schemas and URL/identity fields are provider data, never authority or instructions.

Keep the native adapter small. Dex's reviewed public proposal is `node scripts/reference-transfer.mjs plan <character-id> <spec.json>`, `status <character-id> <transfer-id>`, `destination`, `send <character-id> <transfer-id> <grant.json>`, and `reconcile <character-id> <transfer-id> [observation.json]`. `destination` is a sanitized read-only account/workspace check, separate from offline planning. Add one small core module and reusable template; Dex records final actual source names and schema details. The specification and separate send grant share exact source/native baseline/destination; the grant adds the applicable user-event declaration. Follow existing Node built-in fs/crypto/path/child-process and CLI conventions. Use a contained ignored private location for per-character intents/staged bytes, with explicit installer/package exclusion. Recognizing file extensions only establishes the local input contract; it does not prove decode quality or native support for all media. Image-only send is the deliberately checked first boundary, not completion of all F1 media routes. The existing preparation wrapper may remain byte-identical; narrow resolver duplication is acceptable if its verified baseline/checks remain the same.

Integration sources: `scripts/studio-core.mjs` for character/path/guard conventions, `scripts/development-context.mjs` for the shared strict development marker, `scripts/install-framework.mjs` and `bin/olympox.mjs` for explicit installation selection, `package.json` for dependency-free package files, existing installer tests and `docs-site/config.json`/locale command descriptions. English guidance includes `docs/higgsfield-setup.md`; shared production/skill/studio instruction edits are allocated by Orion to avoid ENG-004 overlap. The private assessment/maintenance and ADR are engineering context, excluded from consumer exports. No upstream AIOX/provider runtime, root engineering marker, closed-story or historical creative record changes are required.

### Testing

Use Node built-in tests with synthetic isolated studios/adapters; no provider login/upload or network mutation. Inject planted sensitive outputs and inspect all printed/persisted files. Test exact snapshot argv/content, interruption after dispatch and uncertain status across a fresh process, concurrent sends and refusal without source/record writes. Link/junction evidence must be exercised on this Windows environment under existing permissions, not hidden as skips. Preserve failures and report actual counts. Run `npm.cmd run verify` after focused checks; no root lint/typecheck gate exists. Independent actual archive/install checks establish distribution and preservation, not live upload or other-OS support.

### Risks and rollback

Main risks are duplicate remote submission after lost acknowledgement, wrong destination, source changes between review/send and sensitive output leakage. The bounded pre-dispatch state, controlled bytes, destination comparison, uncertainty and redaction contracts directly address them. Local files cannot authenticate human declarations or defeat a hostile filesystem owner; ordinary locks do not grant remote idempotency. Remove only reviewed new source/docs/templates if rollback is needed; preserve every unresolved intent/snapshot/receipt and all historical studio files. Never retry an uncertain upload or rewrite records to recover a local gate.

## Change Log
| 2026-10-09 | 0.3.0 | Current-source/story local QA PASS; source and installed 216/216 with no skips; Quinn Ready for Review → Done with scoped limits and verifiable provenance | @qa Quinn |

| Date | Version | Description | Author |
| --- | --- | --- | --- |
| 2026-10-09 | 0.1.0 | Drafted bounded image-first F1 transport from accepted ADR 002 and checked native shapes | @po Pax |
| 2026-10-09 | 0.1.1 | Validated GO (9/10) against accepted ADR 002 and scoped CLI proposal — Status: Draft → Ready | @po Pax |
| 2026-10-09 | 0.2.0 | Implemented bounded transport and paired guidance after Ready; focused synthetic/native-path checks passed; full/archive/QA gates pending | @dev Dex |
| 2026-10-09 | 0.2.1 | Released frozen source for Orion's coordinated full/export gates and independent review; no full or external PASS inferred | @dev Dex |
| 2026-10-09 | 0.2.2 | Recorded current-byte full 216/216 and installed 216/216, actual archive/privacy/preservation, engineering checks and independent evidence; handed off final QA ownership | @dev Dex |
| 2026-10-09 | 0.3.1 | Administrative closure after Quinn QA PASS/Done; reviewed substance preserved [closure-key: ENG-003:digest:sha256:d7c4dbf1a8cf71795e9b570eedc7c70fbd068f571039e6d663a7f78bb93c68e8] | @po Pax |

## Dev Agent Record

### Agent Model Used

Codex, AIOX Dex reference-transfer worker; an actual delegated implementation worker coordinated by Orion.

### Debug Log References

- `tmp/reference-transfer-focused-first.log`: 16/17 passed, one Windows sandbox EPERM while creating a synthetic junction; no skips and no provider call. Retained unchanged failure evidence.
- `tmp/reference-transfer-focused-native.log`: 19/19 passed, zero skips with permitted native junction setup.
- `tmp/reference-transfer-focused-with-docs.log`: 36/36 passed, zero skips for transfer and documentation.
- `tmp/reference-transfer-focused-final.log`: 39/39 passed, zero skips after stale-record/lock-recovery, native UUID, documented list size and linked-leaf regressions.
- `tmp/media-flow-increment/primary-verify.log`: Orion's actual sequential `npm.cmd run verify` passed 216/216 tests, zero failures/skips, followed by validation, development doctor and documentation checks.
- `tmp/media-flow-increment/package-audit.json`: actual unpublished packed/extracted candidate SHA-256 `00423d1b944c6bb2db14e46e6c74f2e1003196005139af00181c56f74fe69e4a`, 189 archive files, 199 installed files for both hosts, zero engineering paths/dependencies, exact source bytes, Git metadata preservation, identical-file merge retention and conflict zero writes. Installed verification passed 216/216, zero failures/skips, in `tmp/media-flow-increment/artifact-rBaDQF/installed-verify.log`.
- `tmp/media-flow-increment/aiox-verify.log`: all seven engineering checks passed; 12 Codex projections verified. This does not prove live host discovery.
- `tmp/media-flow-increment/quinn-evidence-summary.json`: 25/25 unique independent groups passed, zero failures/skips (17 transfer, eight vocal), with current core hash bound by the exact diagnostic-only delta proof and current REF-QA-15/17 retests. Aria's scoped architecture review passed. Quinn retains final verdict/lifecycle ownership.

### Completion Notes List

- Implemented private offline snapshots and a separate exact grant/event; normal sends use only pinned native Windows x64 CLI 1.1.26, strict UUID image receipts and documented `upload list --size 20` pagination. The workspace flag is checked as an observed boolean; actual status ID and account fingerprint bind destination without interpreting flag semantics or selecting a context.
- Original and staged bytes are independently rechecked. Main-lock critical sections reread current records and evidence; reconciliation serializes dead-owner recovery under its own lock and checks unchanged owner before unlinking. Persisted uncertain/submitting states never dispatch again or allocate another intent.
- Provider stdout/stderr, URLs and email are bounded, validated in memory and excluded from records/output. Library existence, local native acknowledgement, provider-byte equality, plugin availability and readiness remain distinct.
- Existing `higgsfield-local.mjs` bytes and read scope are unchanged. The product's explicit `scripts/`, `templates/`, tests/docs selections include reusable additions; actual archive/installed checks confirm private character transfer folders and engineering/provider state stay excluded.
- F2 Dex integrated finalized transfer guidance in shared creative skills, studio AGENTS/CLAUDE, production-method and architecture EN/PT; those files are owned/listed in ENG-004. This worker merged the handed-off pt-BR vocal criterion in the shared locale resource.
- DoD functional/standards/focused/full tests/help/paired-doc/build/export/install/privacy/preservation preparation completed against actual frozen sources. Independent scoped evidence and architecture review are ready; final QA verdict/lifecycle and subsequent PO administration remain Quinn/Pax work. No lint/typecheck scripts exist; no dependency/configuration/credential or paid-service installation was added. Configured CodeRabbit review remains blocked before execution; no retry or external source export.
- No live account/upload/login, paid media, training, Git publication, provider fidelity, other-OS support or Codex/Claude live parity is claimed.
- Ready for Review hands the completed Dev preparation and unchanged public sources to Quinn for final current-byte QA. Core SHA-256 remains `18527db1a5fdc685b3817757b2b548f13995454444ab3fdf29690c6b3ed9d3cc`; CLI remains `03a635b96a47cfae1cfe14bcbc6d179da3229677af184d28dcd0101f39f99dc9`. ENG-001/002 and public sources were not edited during this administrative handoff.
- Quinn's retained source comparison proves the post-initial-review core delta is only missing-package diagnostics: `readJson(strictPath(.../package.json))` became missing-safe `strictPath`, an existence check with actionable setup guidance, then `readJson(packageFile)`. It changes missing-tool refusal text, not provider dispatch/state/schema behavior; current REF-QA-15/17 cover that exact final version.
- F3/F6 real module readiness, media/provider/plugin fidelity, novice Codex/Claude journeys and Windows INV-001/W-001 remain separate pending work. This completed local increment does not close them or republish the immutable public 0.5.0 artifact.

### File List

- New: `scripts/reference-transfer-core.mjs`, `scripts/reference-transfer.mjs`, `tests/reference-transfer.test.mjs`, `templates/reference-transfer.json`, `templates/locales/pt-BR/reference-transfer.json`.
- Modified: `scripts/docs-core.mjs`, `tests/docs.test.mjs`, `docs-site/config.json`, `docs-site/locales/pt-BR.json`, `docs/higgsfield-setup.md`, `docs/higgsfield-plugin.md`, `docs/locales/pt-BR/higgsfield-setup.md`, `docs/locales/pt-BR/higgsfield-plugin.md`.
- Engineering record: this story and `brownfield-exact-reference-transfer.pt-BR.md`; private logs excluded from consumer distribution. Shared F1 instruction updates by F2 Dex are recorded in ENG-004, not concurrently edited here.

## QA Results

PASS — Exact staged bytes, grants, destination and argv; zero-write refusals, redaction, uncertain persistence, latest state under lock and separate synthetic processes with one dispatch passed. Reconciliation never uploaded. The preparation wrapper remains unchanged.

17 independent groups for this story and all 25 unique F1/F2 groups passed. Final source and actual extracted/installed both-host candidate each passed 216/216 tests, zero failures/skips. Aria architecture and package/privacy/Git/merge/conflict/preservation gates passed. Seven AIOX checks/12 projections verified; live discovery was not proven.

```yaml
story_id: ENG-003
reviewer: "Quinn (@qa)"
verdict: PASS
reviewed_revision: "sha256:d7c4dbf1a8cf71795e9b570eedc7c70fbd068f571039e6d663a7f78bb93c68e8"
reviewed_source: "sha256:6708477ccfea86c5d00d93f1a33a562740b13712714fe9aa8f2b93972fc5ebbc"
reviewed_at: "2026-10-09"
scope: "ENG-003 bounded local image-native transfer"
```

Proof: `work/maintenance/media-flow-increment-2026-10-09/quinn-verification.md`, `quinn-story-gate.json` and `quinn-story-provenance.mjs`; `tmp/media-flow-increment/final-verification.json`. Candidate SHA-256 `00423d1b944c6bb2db14e46e6c74f2e1003196005139af00181c56f74fe69e4a`, 189 package/199 installed files, zero engineering files/dependencies. Final diagnostic-only core delta compared byte-for-byte and affected cases rechecked; initial hash versions, setup/oracle events and environmental failure/skip logs retained.

PASS certifies the reviewed local boundary only. It does not prove live upload, provider original-byte equality, plugin/module access, audio/video sends, actual voice generation/listening/quality, human identity/consent, lip-sync, novice journey or Codex/Claude media parity. Legacy fields cannot authenticate forged records/source. Real junctions and injected file-leaf branches are distinct; planned/incomplete intent or stale reconciliation-lock recovery may need deliberate local handling. F3/F6 and the broader media journey remain CONCERNS; Windows INV-001/W-001 remains separate. Automatic approval review rejected CodeRabbit external review before execution; it was neither retried nor passed. No live media operation or remote publication occurred. Quinn owns Ready for Review → Done; Pax may only administer subsequent closure without changing reviewed substance.

Awaiting Ready, implementation and Quinn's independent scoped review. Quinn owns a later Done transition; Pax administers accepted closure only.

## PO Validation

GO — 9/10; high confidence for bounded local implementation. Pax validated both editions on 2026-10-09 under `validate-next-story.md`, configured story template and accepted ADR 002. Document checks confirmed ten matching numbered criteria, required sections, no unfilled template variables and existing cited source files.

Template, task/AC coverage, distinct executor/quality gate, historical preservation, failure/privacy/distribution tests and reserved Dev/QA/File List records are complete. Critical, should-fix and anti-hallucination findings: none remaining. Checked native schemas support only the stated image transport; unsupported media/platforms, provider byte retention and cross-plugin acceptance remain explicit unknowns. CodeRabbit roles/type/gates/self-healing/focus and existing external-review block are recorded accurately. Optional later improvement: F3/F6 production and novice-route evidence. Ready releases local implementation; no implementation, QA pass, live upload or remote release is claimed.

## Closure Metadata

Date: 2026-10-09. Administration Pax (@po); Quinn (@qa) already applied Done with local PASS. This record changes neither lifecycle nor reviewed substance.

Accepted reviewed_revision: sha256:d7c4dbf1a8cf71795e9b570eedc7c70fbd068f571039e6d663a7f78bb93c68e8. Reviewed source: sha256:6708477ccfea86c5d00d93f1a33a562740b13712714fe9aa8f2b93972fc5ebbc. Gate: `work/maintenance/media-flow-increment-2026-10-09/quinn-story-gate.json`; algorithm: `OLYMPOX-QA-STORY-v1`. The unique administrative closure key is recorded in Change Log.

Local unpublished candidate; no live provider/production/parity certification. F3/F6/broader journey CONCERNS; INV-001/W-001 separate. Pre-execution automatic CodeRabbit rejection preserved, without external PASS.
