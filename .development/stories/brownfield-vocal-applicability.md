# Story ENG-004: Declare vocal applicability before new canon approval

<!-- Source: verified assessment finding F2 and the user's next-increment authorization. -->

## Status

**Done**

## Executor Assignment

executor: "@dev"
quality_gate: "@architect"
quality_gate_tools: ["speaking/silent/unspecified synthetic flow tests", "historical byte/hash/snapshot preservation", "npm.cmd run verify", "independent installed-studio checks"]

Aria defines the additive contract boundary; Dex implements after Ready. Quinn owns the independent QA verdict and Done lifecycle. Pax validates the draft and later administers closure. Gage handles any separately authorized remote operation.

## Story

**As a** creator preparing a new character in an independent OLYMPOX studio,
**I want** speaking, silent and unspecified vocal applicability to be explicit before complete canon approval,
**so that** I select a listened-to exact vocal reference when speaking instead of discovering its absence after freezing identity.

## Requirement source and scope

F2 is verified: a visual canon with `voice.referenceId: null` validates, and `create-character` moves from candidate review to canon without a structured vocal applicability checkpoint. Production speech is rejected later. This story addresses that late discovery for new flows; it does not make every historical silent canon invalid.

The user's continuation authorizes local framework implementation and synthetic checks. Actual provider login, upload, audio generation, paid spending, private influencer production and publication are outside this increment. ENG-001/ENG-002 remain closed and byte-preserved; F1 transfer and F3 stage readiness are separate work.

## Acceptance Criteria

1. New templates use `voice.applicability: "unspecified"` and `voice.selection: null`, retaining persona schema 1. Applicability permits only `unspecified`, `speaking` and `silent`. Unspecified draft preparation remains usable, including conceptual/visual work; it is not silently interpreted as silent or speaking. The affected workflow/status output makes unresolved vocal applicability actionable before new complete canon approval.
2. The updated current canonical `approve-canon` task carries the recognized versioned marker `vocalPolicy: "explicit-applicability-v1"` and a contract version increment. Canonical framework validation requires the marker for that updated task version and refuses missing/unknown policy before starting a new run; legitimate older source/contracts remain distinguishable by their recorded version and absent marker. Current-policy approval completion requires persona applicability present and resolved, with the applicable selection gate satisfied, even if the generic legacy validator would accept absent fields. Direct declared-persona canon/snapshot and speech paths enforce the new checks; unspecified cannot be approved. Saved historical task snapshots without the marker retain their prior behavior.
3. Speaking scope requires `voice.referenceId` to point to the exact approved canonical audio voice reference, with its registered path/SHA-256/current bytes matched. `voice.selection` binds the same referenceId/path/SHA-256 and records `method: "listening"`, `performed: true`, `generated: true`, `listened: true`, `selected: true`, reviewer, at, eventId, source and notes, with no critical issues or pending limitations. Missing/incomplete listening/selection, wrong audio/reference role, another reference or altered bytes cannot complete new speaking canon. Declarations establish local consistency, not real provider execution/listening, human identity or audio quality.
4. Explicit `silent` is the voice-not-applicable declaration; keep `voice.referenceId: null` and `voice.selection: null`, using existing approval/transition notes to explain the scope without inventing another voice field. It can reach complete canon without generated/listened audio. Do not fabricate a listening declaration or require paid audio. Speech production rejects explicit silent scope, including conflicting added voice fields; later speaking use needs the existing identity/version/approval procedure.
5. Historical personas, approvals, reference bytes, canon hashes/snapshots, seals, runs and backups retain their stored semantics and exact bytes. Absence of new applicability fields remains historical absence, not an injected default or automatic migration. New safeguards apply through the reviewed additive contract boundary; saved historical contract snapshots are not rewritten to add new steps or requirements.
6. Adding/changing vocal identity or applicability after canon approval uses the established version/hash/approval preservation rules. Changed workflow inputs or contract context require the existing explicit new-attempt procedure where applicable. The implementation does not recalculate old approvals, mutate frozen canon under the same version, automatically generate a replacement voice or grant external authorization.
7. Meaningful regression checks cover new unspecified/speaking/silent paths, exact complete/incomplete listening/selection, missing/drifted/wrong-role references, conflicting scope, frozen identity evolution and historical persona/run snapshots without new fields/policy. Include missing/tampered current canonical marker and absent persona applicability at the current marked task, with failed-transition/operation zero-write assertions. Compare fixed historical byte/hash inventories and exercise affected CLI/run operations, not only a token helper. Explicitly document that someone editing the record/source to imitate a legacy format is outside this integrity guard; do not infer age or authenticate records from field presence.
8. Update affected English contracts/templates/help/guidance and pt-BR translations together; reflect public syntax/catalog changes in their existing sources without overwriting unrelated manual work. Complete `npm.cmd run verify`, relevant independent installed-studio/export/preservation checks and Quinn's scoped review. State that synthetic checks establish local contracts, not live host discovery, generated voice quality or a complete novice media pilot.

## CodeRabbit Integration

`coderabbit_integration.enabled: true` remains configured. The previous external diff-review request was rejected before execution by automatic approval review because specific export authorization was absent. This story grants no new external review authorization; no unexecuted CodeRabbit result may be reported as passed.

### Story Type Analysis

Primary type: local contract/workflow logic. Secondary type: historical compatibility and identity preservation. Complexity: bounded additive change with canon/hash integration risk.

### Specialized Agent Assignment

Dex implements; Aria owns design and boundary review; Quinn owns independent local QA and lifecycle. Pax handles planning/administrative records. Gage handles a future authorized PR/release only.

### Quality Gate Tasks

- [x] Pre-commit preparation: focused meaningful checks, product verification, exact export/history review and independent Aria/Quinn review. Record the configured external CodeRabbit limit accurately; do not bypass the rejection.
- N/A — Pre-PR and deployment: no remote operation or deployment is authorized by this increment.

### Self-Healing Configuration

Existing Dex light-review policy only if an authorized integration can execute: maximum two iterations/15 minutes for critical findings; report unresolved defects and preserve failed evidence. No new model routing, provider call or paid dispatch loop.

### Focus Areas

Resolved new vocal scope, exact audio binding, no bypass of the complete-canon checkpoint, silent usability, unchanged historical bytes/hashes, accurate limits and paired English/pt-BR behavior.

## Tasks / Subtasks

- [x] Implement Aria's additive persona fields and versioned current-task policy without altering the stored legacy format or hash function (AC 1–6).
- [x] Implement new applicability and complete-canon checks at the reviewed public/runtime boundaries; preserve draft preparation and silent scope (AC 1–4).
- [x] Bind speaking listening/selection declarations to exact approved audio and refuse drift/incomplete evidence (AC 3, 6).
- [x] Preserve historical format/contract snapshots and existing version/new-attempt rules (AC 5, 6).
- [x] Add actual-flow, direct-boundary and historical preservation regression cases (AC 2–7).
- [x] Update affected English/pt-BR contracts, templates, help/guidance and catalogs without taking ownership of unrelated manual work (AC 8).
- [x] Complete focused/full/independent installed checks and maintain File List, evidence and QA handoff (AC 7, 8).

## Dev Notes

Current source: `templates/persona.json` has schema 1 and a nullable voice reference, with no applicability field. `scripts/studio-core.mjs` validates approved front/angle references and an optional approved voice reference; `canonHash` hashes the entire stored voice object. Injecting a new field during historical reads would therefore change existing approval hashes. Do not normalize old objects by adding defaults.

`framework/workflows/create-character.json` currently has component version `0.2.0` and goes from `review-candidates` to `approve-canon`. The canon task states the vocal requirement only as prose. `scripts/framework-core.mjs` captures complete contract/task snapshots in runs and later approves the already recorded canon by version/hash. Historical snapshots must retain their prior requirements; newly created/current-contract flow behavior needs an explicit additive boundary.

Aria approved the minimal additive design: new persona template fields `voice.applicability` and `voice.selection`; no persona schema bump, default normalization or extra generation/listening workflow task. `validatePersona` enforces the declared-applicability contract only when that field is actually present. Speaking selection uses the existing exact registered audio/review plus the bound declaration above. Silent is explicit N/A with null voice reference/selection. Version the affected current canon task and add `vocalPolicy: "explicit-applicability-v1"`; current canonical validation requires it for that updated version and rejects unknown policy, while legitimate older recorded task versions and saved historical run/task snapshots do not acquire it retroactively. Use one shared assertion for declared persona validation and marked-task approval completion independently of generic legacy acceptance; expose its missing/resolution reason in the current next-task/status handoff.

`canonHash` must remain unchanged: it already hashes raw stored voice fields, so newly declared fields naturally affect new identity hashes and historical absent fields preserve their exact hashes. Approval/hash/snapshot evolution remains the existing versioned process. The marker/field presence is a compatibility boundary, not authentication: deliberately forged legacy-shaped records or modified old source cannot be identified by this local mechanism. No new dependency, database, service, SDK, orchestration step or provider generation is required.

Sources: accepted [ADR 002](../decisions/002-exact-reference-and-vocal-scope.md) and its [pt-BR companion](../decisions/002-exact-reference-and-vocal-scope.pt-BR.md); root `AGENTS.md`, product `CONSTITUTION.md`, `docs/studio-team.md`, `docs/framework-architecture.md`, `docs/operations.md`, `docs/framework-02.md`, `docs/localization.md`; the cited persona/workflow/task/core sources; F2 in the private October 9 assessment and Morgan/Quinn reports. Private assessment/history files stay outside consumer exports.

### Testing

Use Node built-in tests and synthetic contained installed-studio fixtures. Tests may label simulated audio bytes to inspect structural contracts; they must not call those files listened-to real audio or provider outputs. Include legacy fixture bytes independent of the updated template, so changing the template cannot silently redefine historical tests. Preserve old snapshots/hashes as fixed evidence; do not rewrite their expected bytes to hide a regression. Actual media/host acceptance belongs to F6 under applicable authorization. Run `npm.cmd run verify`; no root lint/typecheck gates exist.

### Risks and rollback

Global validation changes can invalidate old canon and saved runs; isolate new semantics explicitly. Silent workflows can accidentally be forced into paid audio; require only a reason and the applicable silent contract. Declaration fields can be mistaken for actual listening; keep that limit explicit. Roll back only the reviewed new source/contract/template/docs changes, preserving all production/history/approval bytes and unrelated manual work. Never reset or migrate studio records to recover a test.

## Change Log
| 2026-10-09 | 0.2.0 | Current-source/story local QA PASS; source and installed 216/216 with no skips; Quinn Ready for Review → Done with scoped limits and verifiable provenance | @qa Quinn |

| Date | Version | Description | Author |
| --- | --- | --- | --- |
| 2026-10-09 | 0.1.0 | Drafted bounded F2 story from verified gap; final Aria contract handoff pending | @po Pax |
| 2026-10-09 | 0.1.1 | Validated GO (9/10) against accepted ADR 002 — Status: Draft → Ready | @po Pax |
| 2026-10-09 | 0.1.2 | Implemented additive vocal gate and paired guidance; native focused regressions pass; Ready for Review with combined product/export/QA gates pending | @dev Dex |
| 2026-10-09 | 0.1.3 | Recorded final source/installed 216-test passes, actual package privacy/preservation, AIOX and independent review evidence; released paired records to Quinn for QA lifecycle | @dev Dex |
| 2026-10-09 | 0.2.1 | Administrative closure after Quinn QA PASS/Done; reviewed substance preserved [closure-key: ENG-004:digest:sha256:a568db70238ff6f6440a6e705b2bc23b359a38d845fe1d799de55a5b7f000ce9] | @po Pax |

## Dev Agent Record

### Agent Model Used

Codex, GPT-6-based assistant, activated as AIOX Dex with the repository skill and canonical dev profile.

### Debug Log References

- `tmp/media-flow-increment/f2-focused.log`: affected suites run serially in the sandbox, 105 tests / 101 passed / 0 failed / 4 existing Windows junction skips. Retained as environment-limited evidence.
- `tmp/media-flow-increment/f2-focused-native.log`: authorized native serial run, 105 tests / 105 passed / 0 failed / 0 skipped, including junction protections and 11 new vocal-flow cases.
- The fixed legacy hash oracle was captured before changing the source/template: `019ec855021dcab621c9fd550d2f8d40b4ea6b9069c8b52b6cef8279ed4f3c12`. The raw `canonHash` function is unchanged.
- `tmp/media-flow-increment/primary-verify.log`: Orion's final current-source `npm.cmd run verify` passed, 216 tests / 216 passed / 0 failed / 0 skipped, product doctor passed, manual synchronized.
- `tmp/media-flow-increment/package-audit.json`: actual unpublished candidate archive SHA-256 `00423d1b944c6bb2db14e46e6c74f2e1003196005139af00181c56f74fe69e4a`; 189 archive files, 199 installed files with both assistant targets, zero engineering files/dependencies, exact source bytes, Git preserved, identical merge retained, conflicting merge zero writes, and unmarked creative skill activation checked.
- `tmp/media-flow-increment/artifact-rBaDQF/installed-verify.log`: final actual extracted/installed candidate passed full verification, 216 tests / 216 passed / 0 failed / 0 skipped. These are local package/install checks, not remote publication.
- `tmp/media-flow-increment/aiox-verify.log`: all seven actual engineering checks passed and 12 Codex skill projections verified; no claim of live host discovery.
- `work/maintenance/media-flow-increment-2026-10-09/aria-final-review.md`: final local F1/F2 architecture PASS, including independent unchanged raw `canonHash` comparison.
- `work/maintenance/media-flow-increment-2026-10-09/quinn-verification.md`: 25 independent directed scenario groups passed (8 vocal + 17 transfer), including reconstructed pre-increment English/pt-BR histories and exact inventory/hash preservation. Quinn retains authority over final QA results and Done lifecycle after this record handoff.

### Completion Notes List

- Implemented shared `vocalReadiness` / `assertVocalScope` without injecting absent historical fields. New draft unspecified and missing speaking selection remain actionable pending states; complete declared canon rejects them. Speaking binds an approved reviewed audio reference and exact listening selection ID/path/hash/current bytes, with required event declarations and empty issues/limitations. Reference review and listening selection may have different reviewers/events.
- Explicit silent scope keeps null reference/selection, accepts silent visual/video use, and refuses speech prompts, production and execution sealing. Existing frozen-version and approval rules preserve identity evolution.
- Canon task version `0.3.0` requires `explicit-applicability-v1`; unknown or missing updated policies fail before creating a run. Known older task versions `0.1.0`/`0.2.0` with absent policy retain historical behavior. Current marked completion requires explicit applicability independently of generic legacy acceptance; status exposes `nextTask.vocalReadiness`. Old run resumption/new attempts preserve captured contracts; a new current run adopts the updated policy.
- Historical regression helpers use a fixed pre-increment absent-field template or explicitly remove new defaults. Tests preserve old raw hashes and frozen inventories; no personal record, approval, snapshot, seal, run or backup was migrated or rewritten. Deliberately forged legacy-shaped data/source is outside the guard's authentication guarantees.
- Updated narrowly affected English and pt-BR source guidance, help, templates and skills. Shared instructions also integrate ENG-003's separately owned authorized image transfer syntax and distinguish native receipts from provider-byte/plugin-module readiness. F1 Dex owns the pt-BR canon criterion catalog merge. Unrelated manual work and closed foundation stories remain preserved.
- DoD self-check: functional implementation, structure, dependency-free Node, meaningful unit/flow/CLI checks, paired documentation, final product/export/installed checks and independent architectural/directed QA evidence complete. Root lint/typecheck and remote PR/deployment are N/A to this local increment. Quinn's final QA/lifecycle entry follows this handoff; Dex keeps Ready for Review. Configured CodeRabbit external review remains rejected before execution and was not rerun or reported as passed.
- Full source and extracted installed checks both passed on the final current bytes. Actual package/installer selection excludes local engineering/private state and dependencies, preserves exact allowed files and Git metadata, retains identical merges and rejects conflicting merges without writes. The previously recorded sandbox junction skips remain visible; the native focused and final aggregate runs contain zero skips. No failed/skipped evidence was replaced or suppressed.
- F3 per-stage media readiness and F6 actual host/media acceptance remain outstanding separately. Synthetic checks and native transfer contracts do not prove real uploads, listened/generated voice quality, provider original-byte equality, plugin/module accessibility, novice Codex/Claude journeys or a complete audiovisual pilot. No substitute readiness or live quality pass is claimed.
- No actual provider login/upload/generation, paid voice, media pilot, commit, tag, push or publication occurred. Synthetic audio/extensions/declarations establish local consistency only, not actual listening, reviewer identity, provider execution or audiovisual quality. Status is a review handoff, not Done.

### File List

- Runtime: `scripts/studio-core.mjs`, `scripts/framework-core.mjs`, `scripts/studio.mjs`; contract `framework/tasks/approve-canon.json`.
- Persona and method templates: `templates/persona.json`, `templates/locales/pt-BR/persona.json`, `templates/production-method.md`, `templates/locales/pt-BR/production-method.md`.
- Shared studio instructions: `templates/studio-AGENTS.md`, `templates/locales/pt-BR/studio-AGENTS.md`, `docs/locales/pt-BR/AGENTS.md`, `templates/studio-CLAUDE.md`, `templates/locales/pt-BR/studio-CLAUDE.md`.
- Skills: `skills/olympox/SKILL.md`, `skills/higgsfield-studio/SKILL.md`, `docs/locales/pt-BR/skills/olympox/SKILL.md`, `docs/locales/pt-BR/skills/higgsfield-studio/SKILL.md`.
- Guides: `docs/operations.md`, `docs/framework-02.md`, `docs/strategy.md`, `docs/framework-architecture.md` and their matching `docs/locales/pt-BR/` files.
- Tests: `tests/vocal-scope.test.mjs`, `tests/fixtures/legacy-persona-v1.json`, `tests/studio.test.mjs`, `tests/canon.test.mjs`, `tests/framework.test.mjs`, `tests/language-compat.test.mjs`, `tests/editorial.test.mjs`.
- Coordinated canon criterion translation: `docs-site/locales/pt-BR.json` (merge owned by ENG-003 Dex to avoid concurrent edits).
- Local engineering records: this story and `brownfield-vocal-applicability.pt-BR.md`. Private test logs stay under ignored `tmp/media-flow-increment/`; no engineering material enters product exports.

## QA Results

PASS — New contracts require resolved scope and exact selected audio; silent remains usable and refuses speech. Actual pre-increment EN/PT voiced/null-voice canon, hashes, seals, saved run contracts and backups retained their bytes.

8 independent groups for this story and all 25 unique F1/F2 groups passed. Final source and actual extracted/installed both-host candidate each passed 216/216 tests, zero failures/skips. Aria architecture and package/privacy/Git/merge/conflict/preservation gates passed. Seven AIOX checks/12 projections verified; live discovery was not proven.

```yaml
story_id: ENG-004
reviewer: "Quinn (@qa)"
verdict: PASS
reviewed_revision: "sha256:a568db70238ff6f6440a6e705b2bc23b359a38d845fe1d799de55a5b7f000ce9"
reviewed_source: "sha256:6708477ccfea86c5d00d93f1a33a562740b13712714fe9aa8f2b93972fc5ebbc"
reviewed_at: "2026-10-09"
scope: "ENG-004 additive local vocal applicability and exact selection"
```

Proof: `work/maintenance/media-flow-increment-2026-10-09/quinn-verification.md`, `quinn-story-gate.json` and `quinn-story-provenance.mjs`; `tmp/media-flow-increment/final-verification.json`. Candidate SHA-256 `00423d1b944c6bb2db14e46e6c74f2e1003196005139af00181c56f74fe69e4a`, 189 package/199 installed files, zero engineering files/dependencies. Final diagnostic-only core delta compared byte-for-byte and affected cases rechecked; initial hash versions, setup/oracle events and environmental failure/skip logs retained.

PASS certifies the reviewed local boundary only. It does not prove live upload, provider original-byte equality, plugin/module access, audio/video sends, actual voice generation/listening/quality, human identity/consent, lip-sync, novice journey or Codex/Claude media parity. Legacy fields cannot authenticate forged records/source. Real junctions and injected file-leaf branches are distinct; planned/incomplete intent or stale reconciliation-lock recovery may need deliberate local handling. F3/F6 and the broader media journey remain CONCERNS; Windows INV-001/W-001 remains separate. Automatic approval review rejected CodeRabbit external review before execution; it was neither retried nor passed. No live media operation or remote publication occurred. Quinn owns Ready for Review → Done; Pax may only administer subsequent closure without changing reviewed substance.

Awaiting Ready, implementation and Quinn's independent review. Quinn owns a later Done transition; Pax only administers accepted closure.

## PO Validation

GO — 9/10; high confidence for the bounded local implementation. Pax validated both editions on 2026-10-09 under `validate-next-story.md` against the configured story template and accepted ADR 002.

Template compliance: required sections, distinct executor/quality gate, eight numbered criteria, task coverage, test plan, File List placeholder and lifecycle ownership are present; no unresolved template variables. Critical, should-fix and anti-hallucination findings: none remaining. Sources establish the raw voice hash, saved contract boundary and actual gap; no provider capability or historical migration is invented. CodeRabbit classification, roles, gates, self-healing limit and focus areas are recorded; its external review remains blocked and is not a readiness test pass. Optional improvement: further live listening/host evidence belongs to F6. Ready authorizes implementation only; no implementation, QA pass or external operation has occurred.

## Closure Metadata

Date: 2026-10-09. Administration Pax (@po); Quinn (@qa) already applied Done with local PASS. This record changes neither lifecycle nor reviewed substance.

Accepted reviewed_revision: sha256:a568db70238ff6f6440a6e705b2bc23b359a38d845fe1d799de55a5b7f000ce9. Reviewed source: sha256:6708477ccfea86c5d00d93f1a33a562740b13712714fe9aa8f2b93972fc5ebbc. Gate: `work/maintenance/media-flow-increment-2026-10-09/quinn-story-gate.json`; algorithm: `OLYMPOX-QA-STORY-v1`. The unique administrative closure key is recorded in Change Log.

Local unpublished candidate; no live provider/production/parity certification. F3/F6/broader journey CONCERNS; INV-001/W-001 separate. Pre-execution automatic CodeRabbit rejection preserved, without external PASS.
