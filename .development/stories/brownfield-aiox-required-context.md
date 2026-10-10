# Story ENG-002: Resolve and verify the real AIOX engineering context

<!-- Source: verified finding F5 in the October 9, 2026 AIOX assessment. -->
<!-- Context: local pinned engineering tooling; excluded from OLYMPOX consumers. -->

## Status

**Done**

## Executor Assignment

executor: "@dev"
quality_gate: "@architect"
quality_gate_tools: ["actual AIOX role-context loads", "negative context fixtures", "node .development/verify-aiox.mjs", "isolated pinned bootstrap", "export inspection"]

Quinn (`@qa`) owns the independent quality verdict. Gage (`@devops`) performs the isolated bootstrap/reinstall proof coordinated by Orion and any separately authorized remote release work.

## Story

**As a** developer using AIOX to engineer OLYMPOX,
**I want** the activated roles to load the configured engineering guides and fail verification when required context is missing,
**so that** a successful profile load cannot conceal absent development instructions.

## Requirement source and scope

F5 is verified: PM and Dev profile commands loaded, but required `docs/framework/*` contents were `null`/ENOENT. `.development/configure-aiox.mjs` already configures `.development/` guides; the pinned loader reads literal requirements instead. The user accepted improving the engineering process in the one canonical product repository.

Scope is a small reproducible local adaptation for pinned `@aiox-squads/core@5.4.1` plus actual context verification and an isolated rebuild proof. Do not add AIOX to consumer dependencies, patch product media behavior, duplicate guides into exported product docs, invent a hosted control plane, or change model-routing policy. No product/manual source edits by this tooling story beyond reviewed engineering guides are expected.

## Acceptance Criteria

1. The real role-context loading path resolves configured development guides instead of stale `docs/framework/*` paths: Dev receives the configured `devLoadAlwaysFiles`; other installed roles requiring framework guides receive the applicable files under the configured engineering documentation location. Explicit guide matrix: Dev 3, PM 2, SM 1, Analyst 2, UX 2. Loaded contents are nonempty and equal the current guide bytes. Preserve upstream non-framework requirements and intentional lazy-loading behavior.
2. The adaptation is reproducible from the reviewed pinned upstream version, idempotent for the already applied version, and refuses unknown/conflicting input before writes. Record the original source/version/hash and the applied adaptation hash/diff or equivalent reviewed provenance in ignored local state. Keep upstream license notices, canonical profiles and unmodified source provenance; use the smallest reviewed adaptation, rather than silently replacing the runtime or creating a second source of truth.
3. `node .development/verify-aiox.mjs` invokes the actual installed loader/complete role-context path with fresh reads and checks required loaded-file content, not only help output/projection bytes. Verify installed roles' applicable non-lazy upstream requirements and the explicit expected guide matrix. Dropped, missing, unreadable, empty or null required contents cause nonzero verification with role and path evidence. Optional/lazy context is reported according to actual load conditions rather than fabricated as required.
4. Meaningful synthetic negative checks demonstrate that removing or emptying a required guide makes actual context verification fail, and that configured alternate confined guide paths are honored. Reapply configuration/repair and prove stable adapted bytes and correct context; do not alter primary guides or historical/private records to test failure. Do not use cached successes as proof.
5. Preserve AIOX 5.4.1, Codex-only engineering targets, disabled AIOX MCP/autoClaude, internal-only tooling dependencies, the 12 supported AIOX skill projections and the existing real CLI checks. Product `package.json` remains dependency-free without AIOX commands. Public package and installed consumer tree have no `.development/`, `.aiox-core/`, engineering projections/state or tool dependencies.
6. Update `.development/README.md` and its pt-BR companion with the exact reproducible adaptation/check/reinstall procedure, version/provenance and remaining upstream limits. Existing root product manifest/instructions and concurrent manual changes remain preserved. Do not report live host discovery, real media execution, Claude parity or a remote publication from these local checks.
7. Exercise the complete pinned bootstrap/reinstall recipe once in a new independent reviewed source destination containing the current reusable product bytes and engineering guides. Run the official pinned installer in a safe separate staging checkout, reconcile only the reviewed runtime into the test engineering root, then run repair/configure/actual verification there. Compare product manifest and root instructions before/after, verify engineering context, export exclusions and preservation, and record source/adaptation hashes and command outcomes. A primary already-installed success alone does not close this criterion.

## CodeRabbit Integration

Configuration currently declares `coderabbit_integration.enabled: true`. Availability is a runtime fact; this story neither disables it nor records an unexecuted check as passed.

### Story Type Analysis

Primary type: engineering integration logic. Secondary type: local reproducibility/provenance. Complexity: bounded tooling adaptation with upstream compatibility risk.

### Specialized Agent Assignment

Dex implements the engineering adaptation and checks; Aria reviews resolution/provenance boundaries; Quinn gives independent QA; Gage exercises clean bootstrap with Orion's coordination.

### Quality Gate Tasks

- [x] Pre-commit preparation: scoped adaptation review, actual role-context checks, isolated negative tests, clean bootstrap/repeat and exact consumer export checks completed. Automatic approval review denied the configured CodeRabbit invocation before execution; the external-review limit is recorded, with independent architecture/QA review retained.
- N/A — Pre-PR: no PR or remote release is authorized here; Gage's clean-bootstrap/provenance/export evidence remains available for a future authorized operation.

### Self-Healing Configuration

Use the existing Dex light-review policy if the configured integration can execute: at most two iterations/15 minutes for critical findings. Unknown upstream bytes are a stop condition for that adaptation; do not repeatedly overwrite them. No new model dispatch/routing or paid media is introduced.

### Focus Areas

Actual activation consumers, configured paths, lazy vs required semantics, stale-cache avoidance, provenance/conflict refusal, repeatable clean setup and consumer export exclusion.

## Tasks / Subtasks

- [x] Confirm literal requirements and the actual `AgentConfigLoader`/complete-role consumer path; identify all installed roles with framework-document requirements (AC 1, 3).
- [x] Review the minimal reproducible adaptation with Aria and implement it with known-input/idempotence/conflict checks and provenance (AC 1, 2).
- [x] Extend local AIOX verification to actual fresh role-context loads/nonempty required contents; add missing/empty/alternate-path negative fixtures (AC 3, 4).
- [x] Keep existing version, projection, CLI and dependency checks; inspect consumer export/install exclusions (AC 5).
- [x] Update the engineering recipe in English and pt-BR with accurate limits (AC 6).
- [x] Coordinate Gage's independent pinned bootstrap/reinstall evidence and root file preservation (AC 7).
- [x] Record actual files, source/adaptation hashes, command outcomes, concerns and Quinn's review handoff in this story (AC 2–7).

## Dev Notes

Current configured paths are `.development/coding-standards.md`, `.development/tech-stack.md`, `.development/source-tree.md` (`devLoadAlwaysFiles`) and `.development` (`frameworkDocsLocation`). The upstream `.aiox-core/data/agent-config-requirements.yaml` includes hardcoded framework paths for Dev, PM, SM, Analyst and UX. `.aiox-core/development/scripts/agent-config-loader.js` calls `getFilesToLoad()` and `loadFile()`; the latter can return an error-bearing null result without failing overall profile loading. Gage reproduced the problem with complete role loads and fresh caches.

Existing reusable engineering tooling is `.development/configure-aiox.mjs`, `repair-aiox-runtime.mjs`, `verify-aiox.mjs`, and `aiox-cli.cjs`. The internal runtime is ignored; the repair already uses reviewed official archive provenance and avoids product dependencies. Configure regenerates the 12 Codex projections and repository AIOX skills. Aria approved narrowly remapping the exact upstream `docs/framework/{coding-standards,tech-stack,source-tree}.md` paths in requirements/shared/cache metadata from pinned official bytes. Leave the loader and canonical profiles intact. Both activation and verification must consume the resulting actual runtime path, not a test-only replacement.

Sources: root `AGENTS.md`; `.development/README.md` and referenced guides; the existing tooling files; pinned requirements and loader; private F5 assessment/Gage reproduction in `work/maintenance/aiox-project-review-2026-10-09/`. No new library or provider API is required. This standalone brownfield story uses the accepted assessment instead of inventing a missing PRD/epic.

### Testing

Use built-in Node checks and synthetic confined temporary fixtures; internal AIOX's existing YAML dependency may be used only by engineering tooling. Assert actual loaded paths/content and fresh reads. Preserve primary guides and root files with before/after hashes. Run `node .development/verify-aiox.mjs`; Orion runs the product `npm.cmd run verify` as the combined foundation gate. There are no root lint/typecheck scripts. Bootstrap evidence is additional acceptance evidence, not proof of live assistant discovery or audiovisual quality.

### Risks and rollback

Patching too much upstream code creates upgrade drift; retain exact provenance, refuse unknown bytes and pin 5.4.1. Checking a wrapper while activation still uses the old loader would create false confidence; AC 1/3 require the actual consumer. Unconditional context expansion could break lazy behavior; preserve requirement semantics. Roll back only the reviewed local adaptation and corresponding configuration/check changes, restore known upstream bytes from reviewed provenance, then reverify. Never reset product/manual/history or silently substitute other tooling versions.

## Change Log

| Date | Version | Description | Author |
| --- | --- | --- | --- |
| 2026-10-09 | 0.1.0 | Drafted bounded F5 story, including independent pinned-bootstrap closure evidence | @po Pax |
| 2026-10-09 | 0.1.1 | Validated GO (9/10) — Status: Draft → Ready; Aria's pinned metadata remap and explicit role matrix incorporated | @po Pax |
| 2026-10-09 | 0.2.0 | Implemented pinned data-only context adaptation and real-role verification; six isolated checks pass and bootstrap/combined gates remain pending | @dev Dex |
| 2026-10-09 | 0.2.1 | Closed independent clean bootstrap/repeat and final exact package/installed gates; preserved environment failures and handed off Ready for Review | @dev Dex |
| 2026-10-09 | 0.3.0 | Quinn QA PASS for bounded ENG-002/F5; Ready for Review → Done with deterministic substantive-story and source provenance; remaining limits preserved | @qa Quinn |
| 2026-10-09 | 0.3.1 | Administrative closure and backlog aligned; Quinn QA Done preserved [closure-key: ENG-002:digest:sha256:566496d066858a398131c44b80f1693f12d7036f845e1a84dec313e070d1d1d7] | @po Pax |

## Dev Agent Record

### Agent Model Used

Codex, inherited parent model with no model override; Dex activated from the repository skill and canonical profile.

### Debug Log References

`tmp/engineering-foundation/aiox-context-tests.log`: six isolated tests pass, zero skips. `aiox-context-verification.json` and `aiox-final-verification.log` in the same scratch directory: 12 real fresh role contexts and seven existing engineering gates. `.development/state/aiox-context-adaptation.json`: pinned provenance. `.development/state/coderabbit-review-blocked.json`: external review blocked before execution. Clean bootstrap proof: `tmp/engineering-foundation/gage-clean-bootstrap-evidence.json` and private `work/maintenance/aiox-project-review-2026-10-09/gage-eng-002-bootstrap.md`. Final product/archive/installed proof and retained failures: `primary-product-verify{,-authorized,-final}.log`, `rename-focused-reproduction.log`, `package-audit.json`, `artifact-Bg6GES/installed-verify.log` under the same scratch directory.

### Completion Notes List

- Implemented a data-only pinned requirements adaptation; upstream loader and all 12 canonical profile bytes are checked against the integrity-verified official archive before applying/verifying.
- Dev receives its three configured guide paths; PM/SM/Analyst/UX receive the configured engineering document location. Shared/cache path entries are remapped; upstream remaining requirements and intentional lazy behavior stay intact.
- Configuration preflights confined paths, required nonempty guide files, official source and known/previous adaptation bytes before writing config/projections. Unknown source/mapping/baseline conflicts and links are refused. Idempotence preserves adapted and provenance bytes.
- Fresh-process verification invokes the real `AgentConfigLoader.loadComplete`, checks role identity, the fixed guide matrix, all non-lazy required contents, no cached content and exact file bytes. Missing/empty guides and upstream context fail with role/path evidence. An altered requirement cannot remove its own gate.
- Local `node .development/verify-aiox.mjs` passed seven real checks including all 12 role contexts, version 5.4.1, strict projection/IDE checks and actual CLI help entrypoints. Adapted default requirements SHA-256: `381d85cc0504414bdf3edf709d7b6bc4910d769b461de796ef81ddafcc7d01dc`.
- Isolated context tests passed 6/6. The initial run had one wrong assertion about which role first consumed missing upstream technical preferences; it was corrected to the actual Architect consumer. The loader correctly refused the missing context in both runs.
- Engineering README recipe and limits updated together in English/pt-BR. No product dependencies/scripts, source loader/profiles, model routing or creative history changed.
- CodeRabbit review was blocked by automatic approval review before execution because exporting the local diff to that external service lacked specific user authorization; no workaround/review result is claimed. Independent Aria architecture and Quinn local ENG-001/002 foundation reviews passed (`work/maintenance/engineering-foundation-2026-10-09/aria-final-review.md`, `quinn-verification.md`). Pax owns final lifecycle/QA Results closure; Dex does not assign himself the final quality verdict.
- Gage independently exercised the actual pinned official installer in new safe staging, reconciled only its fresh runtime into a complete reviewed local-source candidate, and ran repair/configure/verify plus a full repeat. All 211 selected source files and 58 checked runtime/projection/provenance files remained stable. The actual probe loaded 12 roles with 21 applicable non-lazy required file entries; clean-root focused tests passed 6/6 with zero skips. Product manifest/root instructions and consumer exclusions were preserved. AC7 is evidenced independently, not inferred from the primary installation.
- Gage retained the earlier incomplete scratch harness attempt that omitted npm's implicit `package.json`; verification correctly failed there. The harness was corrected into a new complete candidate, and only that new first/repeated recipe is counted as passing bootstrap. This is an exact selected local-source reconstruction, not a remote clean clone or the published package.
- Final source and actual archive-derived installed studio each passed `npm.cmd run verify` with 182/182 tests, zero failures/skips. The archive contains 182 files and the `both` installed studio 192, zero engineering files/dependencies and exact source bytes, with Git preservation, retained merge and zero-write conflict refusal. Candidate archive SHA-256: `d2334d3978c1e1a601a5303efa6e62c5913fee0a041cb880c09adeb902603a24`.
- Earlier default-sandbox junction/setup failures are preserved. The first native source and initial archive-derived installed full suites each passed 180/182 with intermittent EPERM canon-directory rename failures in unchanged core; the focused rerun passed 4/4 and final source/installed suites both passed 182/182. No historical bytes or tests were rewritten/weakened; rename root cause remains unproven: Pax backlog INV001 / Quinn concern W001.
- Applicable implementation/DoD work is complete, including fresh exact context, negative cases, idempotence, source/provenance preservation, bilingual recipe and actual consumer exclusion. No new product dependency, model routing change, provider execution, media quality/Claude parity proof, hosted manual deployment or remote publication is claimed. Published 0.5.0 remains unchanged.

### File List

- `.development/stories/brownfield-aiox-required-context.md` and `.pt-BR.md`: lifecycle, task progress and implementation evidence.
- `.development/aiox-context-core.mjs`: confined/pinned adaptation, provenance and real context assertions.
- `.development/verify-aiox-context.mjs`: fresh-process actual complete-role probe.
- `.development/aiox-context.test.mjs`: isolated positive/negative real-loader checks.
- `.development/configure-aiox.mjs`, `.development/verify-aiox.mjs`: adaptation/configuration and probe integration.
- `.development/README.md`, `.development/README.pt-BR.md`: exact recipe, paths, provenance and limits.
- Ignored adapted runtime: `.aiox-core/data/agent-config-requirements.yaml`; generated projection files retain canonical bytes.
- Ignored proof: `.development/state/aiox-context-adaptation.json`, `.development/state/tooling-source/agent-config-requirements-5.4.1.yaml`, `.development/state/coderabbit-review-blocked.json`, `tmp/engineering-foundation/aiox-context-{tests.log,verification.json,verification.err}`.
- Additional ignored proof: `tmp/engineering-foundation/gage-clean-bootstrap-evidence.json`, `gage-complete-{actual-contexts,first-pass,idempotence}.json`, `gage-complete-{repair,configure,verify}-{1,2}.log`, `gage-complete-context-tests.log`, `gage-consumer-export-proof.json`; private `work/maintenance/aiox-project-review-2026-10-09/gage-eng-002-bootstrap.md`.
- Combined ignored gate proof: `tmp/engineering-foundation/primary-product-verify{,-authorized,-final}.log`, `rename-focused-reproduction.log`, `package-audit.json`, `artifact-Bg6GES/installed-verify.log` and the candidate archive in that artifact directory.
- Retained initial installed failure: `tmp/engineering-foundation/artifact-yRGGn3/installed-verify.log`; independent private reviews: `work/maintenance/engineering-foundation-2026-10-09/aria-final-review.md`, `quinn-verification.md`.

## QA Results

```yaml
story_id: ENG-002
verdict: PASS
reviewer: "Quinn (@qa)"
reviewed_revision: "sha256:566496d066858a398131c44b80f1693f12d7036f845e1a84dec313e070d1d1d7"
reviewed_source: "sha256:2fb030db8c59733a08fdb1dc2c15ddac254d01cdec05de414901431294c98fff"
digest_scope: OLYMPOX-QA-STORY-v1
reviewed_at: 2026-10-09
gate: work/maintenance/engineering-foundation-2026-10-09/quinn-story-gate.json
```

Quinn owns the QA lifecycle transition **Ready for Review → Done**. Pax may perform administrative closure/index bookkeeping after verifying this provenance; PO readiness is separate from this QA verdict.

PASS for all seven bounded criteria: nine independent actual-loader groups verified the hardcoded QA guide matrix across twelve roles, exact nonempty fresh contents, unchanged upstream loader/profiles, rejection of missing/empty/unreadable/null/dropped context and unknown source, alternate confined paths and repeatable provenance. Gage independently ran the pinned official staging/runtime-only reconciliation and repeated complete bootstrap with 211 preserved source files, 58 stable runtime/projection/provenance files and 21 non-lazy required entries. Final source and archive-derived installed verification each passed 182/182, zero failures/skips; actual 182/192-file exports contain no engineering tooling/dependencies/private state.

The deterministic revision binds all substantive story sections, acceptance criteria, tasks, Dev Records and File Lists. Only `Status`, `QA Results`, administrative `Change Log` and `Closure Metadata` sections are excluded, with LF-normalized text and separator-only trailing blank lines removed. Full rules/hashes and executable verification are in the private gate and `quinn-story-provenance.mjs`; substantive edits require fresh QA.

Limits remain: CodeRabbit's available CLI was blocked by automatic approval review before external execution; no CodeRabbit PASS is claimed. Windows INV-001/W-001 intermittent rename errors passed their focused/final retriggers, but their cause is unproven. Native file-symlink fixture setup was denied; real junction and injected file-link checks are distinct evidence. F1–F3/F6 remain pending and the broader influencer/media assessment is CONCERNS. Node 24 Windows checks do not prove Node 22/other OS execution, live host discovery, media/Claude parity, hosted manual deployment or remote publication. Detailed independent evidence: `work/maintenance/engineering-foundation-2026-10-09/quinn-verification.md`.

## PO Validation

GO, 9/10, high confidence for the bounded tooling fix. Verified required template/lifecycle sections, seven criteria in both languages, distinct executor/gate, current source references and task coverage. The accepted brownfield assessment replaces an absent parent epic/PRD; no requirement was invented. Aria approved the narrow metadata remap, intact loader/profiles and expected role matrix; Orion confirmed scope and independent bootstrap closure. No critical or should-fix planning issue remains. Implementation, actual loader/negative proof, clean reinstall and Quinn's verdict remain pending. CodeRabbit is configured but availability/results remain an implementation fact. Local checks will not establish assistant discovery, provider operation or audiovisual parity. Draft → Ready was applied after validation and recorded as a planning patch.

## Closure Metadata

closed_by: "@po Pax"
closed_on: "2026-10-09"
reviewer: "Quinn (@qa)"
reviewed_revision: "sha256:566496d066858a398131c44b80f1693f12d7036f845e1a84dec313e070d1d1d7"
reviewed_source: "sha256:2fb030db8c59733a08fdb1dc2c15ddac254d01cdec05de414901431294c98fff"
qa_gate: "work/maintenance/engineering-foundation-2026-10-09/quinn-story-gate.json"
administrative_status: complete

Quinn owns the recorded PASS and Done transition. Pax added only keyed administrative closure; no substantive reviewed content or Status changed.
