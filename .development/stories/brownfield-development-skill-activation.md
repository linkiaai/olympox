# Story ENG-001: Refuse creative skill activation in development checkouts

<!-- Source: verified finding F4 in the October 9, 2026 AIOX assessment. -->
<!-- Context: bounded brownfield fix; no new epic or consumer architecture. -->

## Status

**Done**

## Executor Assignment

executor: "@dev"
quality_gate: "@architect"
quality_gate_tools: ["focused Node tests", "independent installed-studio checks", "npm.cmd run verify", "export inspection"]

Quinn (`@qa`) owns the independent quality verdict after implementation. Gage (`@devops`) owns any separately authorized remote Git or release operation.

## Story

**As a** developer of the OLYMPOX product,
**I want** every public creative skill activation command to honor the explicit development marker before writing,
**so that** engineering stays with AIOX while independent installed studios can activate OLYMPOX normally.

## Requirement source and scope

F4 was reproduced in a synthetic fixture: `scripts/install-skill.mjs` returned success and created a creative projection despite `.development/project.json` declaring `framework-development`. Root `AGENTS.md` requires creative runtime commands to be refused in this checkout. The user accepted keeping one canonical public source repository and applying the assessment recommendations.

This story covers the public activation CLI and shared marker interpretation. It does not turn the marker into an authorization/security boundary, prevent internal synthetic fixture APIs, change provider behavior, migrate historical records, or publish another release.

## Acceptance Criteria

1. For a valid `schemaVersion: 1`, `kind: "framework-development"` marker, public `install-skill.mjs` activation exits nonzero for both registered creative skills and each supported assistant target (`codex`, `claude`, `both`), before creating or changing any projection directory/file. The error explains that an independent installed studio is required.
2. Invalid JSON, unsupported schema/kind, a non-file marker, and linked/junction development paths are refused before activation writes whenever a marker is present. Read errors are not silently treated as an unmarked studio. Existing `studio.mjs` marker and inspection behavior remains consistent with the shared interpretation; help stays read-only and usable.
3. Without the marker, including a `.development/` directory containing unrelated notes only, the public CLI retains normal registered-skill/host selection, byte-identical retention and conflict preflight. A conflict in any selected destination prevents all activation writes; unrelated files and existing Git metadata remain unchanged.
4. Marker validation has one reusable implementation for the affected public entrypoints. Internal `installSkill` use for synthetic fixtures and the destination installer remains available according to existing contracts; no creative production is exercised in the development root.
5. Meaningful regression checks cover the originally failing marked-root public command, both skill names, all host targets, invalid markers, and unmarked-studio success/preservation. Tests observe filesystem bytes/tree before and after refusal, rather than relying only on error text or helper calls.
6. Product export and an independent installed studio contain the reusable guard if needed by the CLI, with zero AIOX runtime, engineering guides/stories/projections or dependencies. Installation remains authentication-free and does not generate or publish media.
7. Update public CLI help and affected English/pt-BR behavior guidance together, preserving machine tokens. Coordinate overlapping manual files with their owner; implementation does not claim a hosted manual update. Complete `npm.cmd run verify`, relevant independent install/conflict/preservation checks and exact export review; record actual results and limitations.

## CodeRabbit Integration

Configuration currently declares `coderabbit_integration.enabled: true`; this story does not change that setting or assert that a CodeRabbit service/CLI is available.

### Story Type Analysis

Primary type: local CLI logic. Secondary type: engineering-context integration. Complexity: small, with preservation-sensitive regression coverage.

### Specialized Agent Assignment

Dex implements and reviews the diff; Aria reviews the shared guard boundary; Quinn gives the independent QA verdict. Gage handles a later authorized PR/release only.

### Quality Gate Tasks

- [x] Pre-commit preparation: scoped diff review, focused tests, final product verification and actual export/installed checks completed. The configured CodeRabbit invocation was denied by automatic approval review before execution; that external review remains unexecuted, with its limit recorded and independent review supplied by Aria/Quinn.
- N/A — Pre-PR: no PR or remote release is authorized by this work; Gage's export/provenance evidence is retained for a future separately authorized operation.

### Self-Healing Configuration

Use the existing Dex light-review policy when the configured integration is executable: at most two iterations/15 minutes for critical findings. Preserve failed evidence and report unresolved defects. No model routing, spending, or additional automated dispatch is introduced by this story.

### Focus Areas

Guard before writes, consistent invalid-marker handling, no conflict bypass, unchanged normal studio behavior, consumer export boundary and accurate English/pt-BR guidance.

## Tasks / Subtasks

- [x] Inspect current marker parsing and activation/install call sites; confirm the failing public route in a synthetic fixture (AC 1–4).
- [x] Implement the shared marker guard at affected public activation/creative entrypoints before mutation (AC 1, 2, 4).
- [x] Add regression scenarios for refusal, invalid markers and all host/skill combinations, plus unchanged unmarked success/conflicts (AC 3, 5).
- [x] Update affected help and English/pt-BR guidance without overwriting concurrent manual work (AC 7).
- [x] Run focused checks and `npm.cmd run verify`; inspect the package and independent installed destination including preservation/conflicts (AC 3, 6, 7).
- [x] Maintain this story's File List, evidence links, remaining concerns and QA handoff (AC 7).

## Dev Notes

The current marker parser is a local function in `scripts/studio.mjs`; it uses `lstatSync`, JSON parsing, schema/kind checks and a read-only inspection command allowlist. The public `scripts/install-skill.mjs` calls `installSkill` unconditionally except for help. `scripts/skill-install-core.mjs` already refuses arbitrary skill paths, links and conflicting destination bytes before its writes. Preserve that preflight design.

Relevant existing tests: `tests/development-context.test.mjs` builds independent synthetic installed fixtures and verifies marked-root creative refusal plus unmarked creation. `tests/installer.test.mjs` covers installation boundaries. Aria approved one shared strict marker reader between `studio.mjs` and `install-skill.mjs`, the guard at the public CLI boundary and continued internal fixture API access. Do not import `.development/` into product code.

The product uses Node 22+ built-ins and no runtime dependencies. Export uses explicit package/installer source selection. Read the current source before editing because the engineering separation is already uncommitted and the manual has a separate owner.

Sources: root `AGENTS.md`; `.development/README.md`, `coding-standards.md`, `tech-stack.md`, `source-tree.md`; `docs/framework-architecture.md`; `docs/localization.md`; `scripts/studio.mjs`; `scripts/install-skill.mjs`; `scripts/skill-install-core.mjs`; `tests/development-context.test.mjs`; private assessment F4 and Quinn's report under `work/maintenance/aiox-project-review-2026-10-09/`. Private evidence is not a consumer export.

### Testing

Use `node:test` and built-in assertions with synthetic files in contained temporary roots. Exercise the public CLI in the fixture, record exit status and compare inventory/content hashes across refusal. Existing internal APIs may prepare fixtures but do not substitute for testing the public failing command. Run `npm.cmd run verify`; there are no root lint/typecheck gates. Source tests do not establish live Codex/Claude discovery or media quality.

### Risks and rollback

Overbroad guards could break unmarked studios or fixture preparation; AC 3/4 prevent that. Inconsistent parsing could let malformed markers bypass the policy; AC 2 tests it. Roll back only the scoped guard/CLI/test/doc changes after reviewing the actual diff; retain private history and concurrent work. Do not reset the checkout or remove installed studio records.

## Change Log

| Date | Version | Description | Author |
| --- | --- | --- | --- |
| 2026-10-09 | 0.1.0 | Drafted bounded F4 story from verified assessment and current source | @po Pax |
| 2026-10-09 | 0.1.1 | Validated GO (9/10) — Status: Draft → Ready; Aria's shared strict-reader boundary incorporated | @po Pax |
| 2026-10-09 | 0.2.0 | Implemented the shared public guard, preserved BOM compatibility, and verified 26 focused regression cases; combined gates/QA handoff pending | @dev Dex |
| 2026-10-09 | 0.2.1 | Closed final source/package/installed gates and recorded preserved environment failures; handed off Ready for Review without claiming external CodeRabbit execution | @dev Dex |
| 2026-10-09 | 0.3.0 | Quinn QA PASS for bounded ENG-001/F4; Ready for Review → Done with deterministic substantive-story and source provenance; remaining limits preserved | @qa Quinn |
| 2026-10-09 | 0.3.1 | Administrative closure and backlog aligned; Quinn QA Done preserved [closure-key: ENG-001:digest:sha256:23fe2860d928f3ebd689d0d2d03f440c0ad7962e68491d59c2aaf10b6fc8ca73] | @po Pax |

## Dev Agent Record

### Agent Model Used

Codex, inherited parent model with no model override; Dex activated from the repository skill and canonical profile.

### Debug Log References

Focused public CLI proof: `tmp/engineering-foundation/creative-activation-tests.log` (26/26 pass, zero skips). Final source gate: `tmp/engineering-foundation/primary-product-verify-final.log` (182/182 pass, zero failures/skips). Actual archive/installed proof: `tmp/engineering-foundation/package-audit.json` and `tmp/engineering-foundation/artifact-Bg6GES/installed-verify.log` (182/182 pass, zero failures/skips). Preserved earlier evidence: `primary-product-verify.log`, `primary-product-verify-authorized.log`, `rename-focused-reproduction.log` in the same scratch directory. CodeRabbit rejection: `.development/state/coderabbit-review-blocked.json` (blocked before execution; no external review result). Quinn/Pax retain the final independent QA/lifecycle decision.

### Completion Notes List

- Implemented one shared strict development marker reader, preserving UTF-8 BOM compatibility. Both public entrypoints refuse invalid/linked context; activation refuses a recognized development marker before writes and help stays read-only.
- Internal `installSkill` and unmarked studios preserve existing host selection, exact bytes, conflict preflight, unrelated files and Git metadata. Regression checks cover both skills, all hosts, marker failure types and BOM inspection compatibility.
- Added the existing command's help guidance and two narrow installation-guide paragraphs in English/pt-BR. Unrelated manual files, source history and private records were preserved.
- Local Dex diff review and `git diff --check` passed. Initial default-sandbox focused run had seven EPERM junction setup failures; the authorized escalation rerun passed all 26 focused cases. No tests were skipped or weakened.
- CodeRabbit CLI availability was verified separately by Quinn, but automatic approval review rejected invoking the configured review because it could export the local diff to that external service. The command did not execute; no workaround was attempted. Independent Quinn review remains required. This is not a CodeRabbit pass.
- Final source `npm.cmd run verify` passed 182/182 tests with zero failures/skips. The actual unpublished archive contains 182 reusable files; the independent `both` studio contains 192 installed files, zero engineering files and zero dependencies, with exact source bytes, studio instructions, Git preservation, all-retained merge and zero-write conflict refusal. That studio's full verification passed 182/182 with zero failures/skips.
- Candidate archive SHA-256: `d2334d3978c1e1a601a5303efa6e62c5913fee0a041cb880c09adeb902603a24`. This is the current local candidate, not a new public release or replacement of immutable 0.5.0.
- The first combined default-sandbox run had 167 passing tests, 11 junction/setup failures and four skips caused by that environment. The first authorized native source and initial archive-derived installed runs each had 180/182 passing with intermittent EPERM canon-directory rename failures in unchanged core code. The focused rename rerun passed 4/4, followed by both final source and installed 182/182 passes. These failed logs are retained; no tests or history were weakened/rewritten. The exact rename root cause remains unproven: Pax backlog INV001 / Quinn concern W001.
- Aria's independent architecture review passed the scoped shared-guard/export boundary; Quinn independently passed the local ENG-001/002 foundation (`work/maintenance/engineering-foundation-2026-10-09/aria-final-review.md`, `quinn-verification.md`). Applicable implementation/DoD work is complete: functional cases, English/pt-BR guidance, exact export/preservation and meaningful verification; no new dependency or nonexistent lint/typecheck gate is claimed. Pax owns final lifecycle/QA Results closure; Dex does not assign himself the final quality verdict.
- No provider call, paid generation, hosted manual deployment, remote publication or historical migration occurred. Local checks do not prove live Codex/Claude discovery or audiovisual parity.

### File List

- `.development/stories/brownfield-development-skill-activation.md` and `.pt-BR.md`: lifecycle, task progress and implementation evidence.
- `scripts/development-context.mjs`: reusable strict marker reader/activation guard.
- `scripts/studio.mjs`, `scripts/install-skill.mjs`: public shared context and help behavior.
- `tests/install-skill.test.mjs`, `tests/development-context.test.mjs`: public refusal/preservation and BOM regressions.
- `docs/installation.md`, `docs/locales/pt-BR/installation.md`: scoped activation boundary guidance.
- Ignored evidence: `tmp/engineering-foundation/creative-activation-tests.log`, `.development/state/coderabbit-review-blocked.json`.
- Additional ignored evidence: `tmp/engineering-foundation/primary-product-verify{,-authorized,-final}.log`, `rename-focused-reproduction.log`, `package-audit.json`, `artifact-Bg6GES/installed-verify.log`, and the candidate archive in the same artifact directory.
- Retained initial installed failure: `tmp/engineering-foundation/artifact-yRGGn3/installed-verify.log`; independent private reviews: `work/maintenance/engineering-foundation-2026-10-09/aria-final-review.md`, `quinn-verification.md`.

## QA Results

```yaml
story_id: ENG-001
verdict: PASS
reviewer: "Quinn (@qa)"
reviewed_revision: "sha256:23fe2860d928f3ebd689d0d2d03f440c0ad7962e68491d59c2aaf10b6fc8ca73"
reviewed_source: "sha256:2fb030db8c59733a08fdb1dc2c15ddac254d01cdec05de414901431294c98fff"
digest_scope: OLYMPOX-QA-STORY-v1
reviewed_at: 2026-10-09
gate: work/maintenance/engineering-foundation-2026-10-09/quinn-story-gate.json
```

Quinn owns the QA lifecycle transition **Ready for Review → Done**. Pax may perform administrative closure/index bookkeeping after verifying this provenance; PO readiness is separate from this QA verdict.

PASS for all seven bounded criteria: nine independent activation groups confirmed both skills/all hosts refuse marked or invalid context before writes, preserve BOM/help/internal fixtures, and retain normal unmarked installation/conflicts/Git bytes. Final source and archive-derived installed verification each passed 182/182 with zero failures/skips. Actual archive/consumer proofs contain 182/192 files, zero engineering dependencies or private state, with exact source bytes and preservation.

The deterministic revision binds all substantive story sections, acceptance criteria, tasks, Dev Records and File Lists. Only `Status`, `QA Results`, administrative `Change Log` and `Closure Metadata` sections are excluded, with LF-normalized text and separator-only trailing blank lines removed. Full rules/hashes and executable verification are in the private gate and `quinn-story-provenance.mjs`; substantive edits require fresh QA.

Limits remain: CodeRabbit's available CLI was blocked by automatic approval review before external execution; no CodeRabbit PASS is claimed. Windows INV-001/W-001 intermittent rename errors passed their focused/final retriggers, but their cause is unproven. Native file-symlink fixture setup was denied; real junction and injected file-link checks are distinct evidence. F1–F3/F6 remain pending and the broader influencer/media assessment is CONCERNS. No live host discovery, media/Claude parity, hosted manual deployment or remote publication is established. Detailed independent evidence: `work/maintenance/engineering-foundation-2026-10-09/quinn-verification.md`.

## PO Validation

GO, 9/10, high confidence for this bounded implementation. Verified template/lifecycle sections, all seven criteria in both languages, distinct executor/gate assignment, task-to-criteria coverage and current source references. The accepted brownfield assessment supplies requirements instead of an invented parent epic/PRD. Aria and Orion reviewed the narrow boundary. No critical or should-fix planning issue remains; source tests, export/preservation checks and independent QA are still pending. CodeRabbit is configured but its availability/result is not established; record the actual outcome during implementation. No UI, provider execution or paid generation is required. Draft → Ready was applied after validation, with the planning version patch recorded above.

## Closure Metadata

closed_by: "@po Pax"
closed_on: "2026-10-09"
reviewer: "Quinn (@qa)"
reviewed_revision: "sha256:23fe2860d928f3ebd689d0d2d03f440c0ad7962e68491d59c2aaf10b6fc8ca73"
reviewed_source: "sha256:2fb030db8c59733a08fdb1dc2c15ddac254d01cdec05de414901431294c98fff"
qa_gate: "work/maintenance/engineering-foundation-2026-10-09/quinn-story-gate.json"
administrative_status: complete

Quinn owns the recorded PASS and Done transition. Pax added only keyed administrative closure; no substantive reviewed content or Status changed.
