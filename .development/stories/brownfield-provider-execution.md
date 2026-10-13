# Story ENG-006: Execute optional providers with durable identity and budget bindings

Source: the user's approved provider-abstraction recommendation and clarification that this is a reusable framework for independent consumers, 2026-10-13.

## Status

**Done** — independent local QA, source gates and actual packed/installed verification passed. Live provider/media acceptance remains a consumer pilot.

## Executor Assignment

executor: "@dev"
quality_gate: "@architect"
quality_gate_tools: ["public CLI and controlled HTTP fixture flow", "canonical references and vocal scope", "uncertain submission recovery", "atomic budget concurrency", "npm.cmd run verify", "actual archive/independent installation preservation"]

River (`@sm`) prepares and validates this user-approved story; Aria owns [ADR 004](../decisions/004-provider-execution.md) and its [pt-BR edition](../decisions/004-provider-execution.pt-BR.md). The coordinating implementation worker owns the executor/CLI and integration; the BytePlus worker owns its adapter; independent QA owns verification. Ready follows the user's implementation authorization and does not reopen completed ENG-001–005 or authorize publishing.

## Story

**As an** independent OLYMPOX consumer with my own provider account,
**I want** reusable image, video and bounded speech API execution with preserved character inputs, durable jobs and numerical budgets,
**so that** I can change supported media engines without rebuilding identity or losing execution and cost history.

## Requirement source and scope

The consultation identified a real boundary: the core records provider/method choices and readiness, but does not execute providers or reserve shared budgets. The user approved implementing an optional generic boundary and initial BytePlus route, then clarified that their own personal credentials, budget or influencer pilot are not required to build the framework. Scope is Node 22+ dependency-free product sources, public CLI/templates/guides, synthetic HTTP/core tests and independent installed-studio verification.

BytePlus image/video and documented HTTP TTS are separate capabilities. Preset TTS is draft voice preparation, not canon cloning. Existing Higgsfield default, integrations, workflow/task captures, private influencer history, voice selections and frozen canon remain preserved. No live login, account mutation, paid submission, identity training, private production or remote release is performed by this development task. Consumers configure their own access after installation.

## Acceptance Criteria

1. Add an optional generic provider executor/CLI separate from `framework-core.mjs`, plus BytePlus adapter with documented capability/request validation, estimation, submission/status and result extraction. Use built-in Node APIs; no database, hosting, provider binary, SDK/runtime dependency or always-running service is mandatory. Offline preparation/status/help remains usable. Installer never authenticates or dispatches. Default Higgsfield choices and existing entrypoints/contracts retain their behavior; a BytePlus choice is explicit and has no silent fallback.
2. Prepare immutable request/input snapshots from prompt file, parameters and exact ordered reference bytes. Bind character, purpose, provider/model, declared destination and numerical grant/max cost. Production binds approved canon/version/snapshot and exact visual/vocal references; reference purpose supports draft exploration without fake approval. Silent scope refuses speech. A preset or native generated audio cannot silently replace approved voice; unsupported canonical audio is pending. Unsupported parameters, origin/expiry restrictions or missing capabilities are explicit. Changing bound context creates a new job rather than mutating old evidence/canon.
3. Persist applicable intent and conservative budget reservation before POST. Durable private jobs retain sanitized IDs/status/errors and immutable request/source hashes. Queued jobs are claimed once under a lock; restart recovers local work and queries accepted original jobs. Interrupted/ambiguous POST is uncertain and never automatically resubmitted through the same or another route. Missing IDs do not prove no submission. Poll/download transient retries are bounded. Local queued cancellation does not claim external cancellation/refund. New paid attempts remain explicit distinct jobs.
4. Configure/inspect a numerical studio/project budget with atomic reservations, per-job/character attribution, comparable units, estimated/maximum/actual separation and retained rejected attempts. Concurrent jobs cannot spend the same local allowance. Missing/unbounded charge evidence cannot dispatch as free: unknown cost reserves the scoped grant's whole maximum and estimated billing requires explicit `acceptEstimatedCost`. Unknown actual cost conserves reservation; recovery does not silently release ambiguous spend. Actual-cost settlement uses matching explicit billing reconciliation rather than inferred tokens. State the limit's scope: local allocation, not external account spending or an unverified provider hard cap.
5. Runtime adapter implements documented BytePlus image, asynchronous video and bounded HTTP TTS response handling with request-time credentials in memory. Missing own-account credentials/budget returns actionable pending/refusal before network generation. Keep secret headers, raw errors, signed URLs and keys out of persistent jobs, stdout, package and character backups. Nonsensitive account/region labels are caller declarations unless verified discovery exists. Credentials/account setup and live model entitlement are consumer steps, never installer side effects or fixture claims.
6. Export actual successful media as new confined files, preserving bytes/hash/size and refusing conflicts, links/junctions or another character's path. Completed provider status does not equal export, workflow completion or approval. Produced evidence feeds existing run/readiness/registration/seal/review procedures; no automatic canon approval, task completion, publication or review occurs. Failed export can recover the same accepted job without another generation. Keep source/input and execution history usable after provider selection reversal.
7. Meaningful fixtures cover real public CLI/core flow with a controlled HTTP transport, image/TTS bytes and asynchronous video; own-account auth absence and redaction; reference ordering/hash drift; speaking/silent/legacy identity scope; production without approved voice; unknown/failed POST and restart without duplicate POST; malformed/oversized provider responses; status/download retries; output conflicts; unsafe/linked input/state/lock/output paths; simultaneous budget claims/conservative recovery; existing workflow/canon/history bytes. Tests verify failures before lasting writes where applicable and cannot pass by weakening preservation or pretending a generated image proves audiovisual identity.
8. Update affected English help/templates/guides/manual selection and pt-BR companions. Include only reusable sources/tests/provenance in the package and installer; actual jobs, accounts, reservations, media and credentials remain private. Run full `npm.cmd run verify` plus local AIOX verification and actual packed/extracted independent-studio checks, including installed CLI/HTTP fixtures, explicit export contents, Git/unrelated-file preservation, retained merge and conflict preflight. Record actual gate evidence and limitations. A live consumer pilot with their own credentials/authorization remains pending; no credentials or paid budget request to the development user is needed to complete local acceptance.

## Tasks / Subtasks

- [x] Implement optional executor/CLI and BytePlus driver with explicit capabilities and complete offline behavior (AC 1, 5).
- [x] Prepare exact inputs/canon/vocal scope, immutable requests and provider-specific validation (AC 2).
- [x] Implement durable queue/intent/status/uncertainty/recovery and conservative atomic budgets (AC 3, 4).
- [x] Export original media safely and connect traceable evidence to existing operations without automatic approval (AC 6).
- [x] Add independent public-flow, HTTP, privacy, failure, concurrency and preservation regressions (AC 7).
- [x] Maintain public English/pt-BR documentation and actual installation/package checks (AC 8).
- [x] Record final scoped implementation/architecture/QA results with honest live-consumer limits (AC 1–8).

## Dev Notes

Relevant current interfaces are `framework-core.mjs` provider map/run transitions, `stage-readiness-core.mjs` exact stage scopes, `studio-core.mjs` canon/voice/snapshot/manifest/seal and `reference-transfer-core.mjs` strict path/conservative uncertainty behavior. Reuse checked generic helpers without importing provider-specific assumptions into character identity. The new queue is not a replacement for historical run records. Adapter methods and descriptor names must match the finished CLI/API; implementation may resolve reversible naming details without another architecture approval.

Runtime API: `prepareJob`, `submitJob`, `pollJob`, `exportJob`, `reconcileJob`, `cancelJob`, `dispatchQueue`, `setBudget`, `getBudget`, `listJobs`, `readJob`. Shared ledger: `work/provider-execution/state.json`; character job history: `executions/provider-jobs/<id>/`. Driver: `scripts/providers/byteplus.mjs`. Consumer process secrets: `ARK_API_KEY` and separate `BYTEPLUS_SPEECH_API_KEY`; no key is a request field. Public guide: `docs/provider-execution.md` and pt-BR counterpart. ADR 004's request/identity, lifecycle and financial sections define the relevant failure boundaries.

All tests run against synthetic independent studios. The development marker refuses creative runtime mutation in this checkout. Controlled HTTP fixtures establish request/response behavior only; actual provider origin rules, model access, voice acceptance, export fidelity and costs require a consumer pilot. For a live speaking pipeline, acceptance includes exact approved external canon and canonical vocal attachment; fixture acceptance of a file is not live service acceptance. Do not change the default merely because mocks pass.

## Quality Gate

Independent review focuses on conservative crash behavior, atomic budget/state boundaries, caller-controlled paths/parameters, authentication redaction and preservation of canon/voice/history. Complete the public product gates and independent installed flow after combined changes. No root lint or typecheck script exists. Remote Git/release work remains a separately applicable Gage responsibility.

## CodeRabbit Integration

### Story Type Analysis

Primary: integration/API. Secondary: security, local asynchronous state and budget accounting. Complexity: high for uncertainty/concurrency and identity preservation; no database/distributed service is introduced.

### Specialized Agent Assignment

`@dev` implements executor/integration and the adapter worker; `@architect` reviews boundaries/security; `@qa` verifies independently; `@sm` prepares the story. `@devops` has no remote release task in this increment.

### Quality Gate Tasks

- [x] Pre-commit: actual public-flow tests, budget/recovery/privacy assertions, full source and installed product gates, independent architecture/QA review.
- N/A — Pre-PR/pre-deployment: no PR, publication or remote deployment is part of this increment.

### Self-Healing Configuration

Dev light review: at most two local correction iterations/15 minutes for critical findings before escalating unresolved findings. This does not authorize external CodeRabbit export, paid retries, weakening assertions or discarding failure evidence. QA retains its independent verdict.

### Focus Areas

Exact identity/vocal attachments, caller-controlled paths/parameters, secret redaction, conservative crash recovery, no uncertain POST retry, numerical reservations, export fidelity and historical/distribution preservation. CodeRabbit is enabled upstream, but external diff review is not invoked by this story. The previously recorded automatic approval rejection remains preserved; local independent review is the planned gate. No external review PASS or permission bypass is implied.

## Story Preparation Validation

River read the canonical SM profile, `create-next-story.md` and the actual `product/checklists/story-draft-checklist.md` (the activator's development/checklists path is stale). The direct approved requirement and ADR replace a missing formal epic; no invented epic, ClickUp record or additional user approval is claimed. Goal/context, technical guidance, references, self-containment, testing and configured review sections provide sufficient developer guidance. Ready records planning only, not a product quality verdict.

## Dev Agent Record

Implementation by Codex (GPT-6), using the actual Dex/AIOX engineering profile and delegated adapter, architecture and independent QA workers. The dependency-free optional CLI/queue and BytePlus HTTP adapter are implemented; consumer credentials stay in memory. Exact canon, input snapshots, normalized adapter/governance hashes, legacy vocal reuse, conservative USD reservations, original-job recovery and draft-only export preserve historical bytes. The existing Higgsfield default is retained; explicit supported BytePlus stages do not require Higgsfield.

Source verification: `npm.cmd run verify` passed 282/282 tests, zero failures/skips, followed by validate, development doctor and docs:check. `node .development/verify-aiox.mjs` passed 12 local projections with zero product dependencies. Actual EN/pt-BR manual navigation/language switch and independent malformed-private-JSON CLI redaction checks passed. `npm.cmd pack --offline --ignore-scripts` produced a real archive with 214 entries. Independent packed/installed verification passed: 214 archive files, 224 exact installed byte mappings, 282/282 installed tests with zero failures/skips, doctor and docs:check. One mock POST exported exact draft PNG bytes; Git, private/unrelated state, retained merge and zero-write conflict preservation passed. Evidence: `tmp/provider-install-ZMrmGX/report.json` and `installed-product-verify.log`. Prior ten-minute timeout is preserved separately; the fresh streaming installed run passed in 140.891 seconds without product-source changes.

Corrected findings include readiness route tokens/model/input bindings, frozen canon and historical voice compatibility, normalized request/governance drift, blocked replacement uncertain submissions, aligned explicit 4xx refusal, ledger-first workflow intent with idempotent reconciliation, monotonic polling, staged-byte tampering checks and durable export intent. Synchronous image/TTS interruption before staging can leave export pending without a queryable provider ID; no automatic regeneration is permitted. Live access, origin eligibility, invoice enforcement, identity/voice fidelity and full audiovisual acceptance remain consumer pilot limits.

### File List

Planning artifacts: ADR by Aria, story prepared/validated by River:

- `.development/decisions/004-provider-execution.md`
- `.development/decisions/004-provider-execution.pt-BR.md`
- `.development/stories/brownfield-provider-execution.md`
- `.development/stories/brownfield-provider-execution.pt-BR.md`

Concrete combined diff:

- `.development/decisions/004-provider-execution.md`
- `.development/decisions/004-provider-execution.pt-BR.md`
- `.development/stories/brownfield-provider-execution.md`
- `.development/stories/brownfield-provider-execution.pt-BR.md`
- `README.md`
- `docs-site/config.json`
- `docs-site/locales/en.json`
- `docs-site/locales/pt-BR.json`
- `docs/framework-02.md`
- `docs/framework-architecture.md`
- `docs/framework-manual.md`
- `docs/locales/pt-BR/README.md`
- `docs/locales/pt-BR/framework-02.md`
- `docs/locales/pt-BR/framework-architecture.md`
- `docs/locales/pt-BR/framework-manual.md`
- `docs/locales/pt-BR/production.md`
- `docs/locales/pt-BR/provider-execution.md`
- `docs/locales/pt-BR/skills/olympox/SKILL.md`
- `docs/locales/pt-BR/tools.md`
- `docs/production.md`
- `docs/provider-execution.md`
- `docs/tools.md`
- `scripts/docs-core.mjs`
- `scripts/provider-execution-core.mjs`
- `scripts/provider-execution.mjs`
- `scripts/providers/byteplus.mjs`
- `skills/olympox/SKILL.md`
- `templates/locales/pt-BR/provider-authorization.json`
- `templates/locales/pt-BR/provider-budget.json`
- `templates/locales/pt-BR/provider-event.json`
- `templates/locales/pt-BR/provider-reconciliation.json`
- `templates/locales/pt-BR/provider-request.json`
- `templates/locales/pt-BR/studio-AGENTS.md`
- `templates/provider-authorization.json`
- `templates/provider-budget.json`
- `templates/provider-event.json`
- `templates/provider-reconciliation.json`
- `templates/provider-request.json`
- `templates/studio-AGENTS.md`
- `tests/byteplus-provider.test.mjs`
- `tests/docs.test.mjs`
- `tests/provider-execution.test.mjs`

Private evidence: `work/maintenance/provider-execution-2026-10-13.json` and `tmp/provider-execution-install-verify.mjs`; these remain excluded from package/installation.

### DoD self-assessment

- [x] Implemented local functional scope, Node 22+ built-in APIs, exact schemas and input/path/secret protections.
- [x] Meaningful HTTP, public CLI, preservation, uncertainty, concurrency, voice and crash fixtures; source 282/282 PASS.
- [x] EN/pt-BR public documentation, real manual rendering and source-dependent catalogs/fingerprint.
- [x] No runtime dependencies added; private environment credentials documented; actual local archive produced.
- [x] Final archive/installed gate and independent QA PASS completed; local scope Done, with consumer live pilot and release excluded.
- N/A: root lint/typecheck, coverage-percentage target, remote deployment/release and external CodeRabbit export. These are not provided or authorized gates for this scope.
- Follow-up: consumer live pilot for model access, canonical-reference eligibility, actual charges and audiovisual fidelity; unsupported video transfer/preset voice conditioning remain explicit pending capabilities.

## QA Results

**Gate: PASS for the local reusable framework scope.** Independent implementation review has no remaining blocking finding; the actual packed/installed gate is complete.

Quinn (`@qa`) independently reviewed the executor, BytePlus adapter, workflow/readiness bindings and public guides. Corrected findings cover immutable normalized requests/governance, frozen canon and historical vocal reuse, conservative uncertain submissions/reservations, idempotent workflow recovery, monotonic status, staged-byte verification, export journals and sanitized public errors. Existing identity/voice/history bytes and explicit Higgsfield defaults remain preserved.

Recorded evidence: the coordinating worker's complete source `npm.cmd run verify` passed 282/282 tests, zero failures/skips, with validate, development doctor and docs:check; local AIOX verification passed 12 projections with zero product dependencies. QA independently ran the 12/12 BytePlus controlled-HTTP tests and a real public-CLI malformed-private-JSON negative: exit 1, empty stdout, generic stderr, no leaked synthetic secret/signed URL and no provider call or job state. New manual command-catalog and nested-driver staleness assertions passed; the final full source gate also passed the docs server/path checks that the restricted sandbox initially blocked. Actual EN/pt-BR manual navigation, language switch and screenshot inspection were recorded by the coordinating worker.

Aria's independent `node tmp/provider-execution-install-verify.mjs tmp/provider-package-audit/olympox-0.6.0-rc.1.tgz --full-verify` completed with exit 0. QA inspected `tmp/provider-install-ZMrmGX/report.json` and the finished installed log: installed `npm.cmd run verify` passed 282/282 tests, zero failures/cancellations/skips, in 140891.3842 ms, followed by validate, doctor and docs:check. The real archive contains 214 reusable files; installation verified 224 exact source-byte mappings, both host skill bytes and preserved Git metadata. Read-only CLI caused zero writes. The installed CLI's controlled HTTP flow made exactly one POST, exported the exact PNG as draft, reconciled synthetic cost, preserved persona bytes and persisted no fixture key. Identical merge preserved unrelated/private state; conflicting README preflight caused zero writes; extracted sources stayed unchanged. Archive SHA-256: `c197fc7dea54f1cdef57841904bd1bd513b5211c83593e6d117009af0de51766`.

This is a local framework gate, not live BytePlus authentication, paid generation, reference-origin eligibility, actual billing, identity/voice fidelity or audiovisual acceptance. Consumers still need their own controlled pilot, including actual host skill discovery and novice flow where applicable. The documented synchronous image/TTS crash window may require original-provider/manual recovery; no automatic regeneration or complete crash-recovery guarantee is accepted. No remote release, publication or external CodeRabbit PASS is claimed.

## Change Log

| Date | Change | Author |
| --- | --- | --- |
| 2026-10-13 | Ready plan from user-approved consultation; own-account reusable scope and pending consumer pilot retained | River (`@sm`); architecture Aria (`@architect`) |
| 2026-10-13 | Independent local QA review and source evidence recorded; packed/installed gate remains pending in Review | Quinn (`@qa`) |
| 2026-10-13 | Actual packed/installed gate and final independent QA PASS recorded; local story Done with consumer live limits preserved | Quinn (`@qa`) |
