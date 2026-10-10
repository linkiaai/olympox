# ADR 001 — One canonical repository and a separate installed product

Date: October 9, 2026 (America/Sao_Paulo). Owner: Aria, AIOX Architect; coordinator: Orion.

Status: **Accepted repository decision** following the user's explicit choice. The focused F4/F5 repair design below is an implementation handoff; this document alone does not demonstrate an implemented or verified repair.

English is canonical. [Brazilian Portuguese edition](001-canonical-repository-and-engineering-boundary.pt-BR.md).

## Context and decision

Maintain one canonical public OLYMPOX source repository. Use AIOX to engineer that product in the development checkout. Install OLYMPOX into independent studios for Codex, Claude Code or both. Do not create a second independently editable copy of the product or move this Codex project as part of this decision.

Git source, the selected release package and an installed studio are distinct artifacts. Public source includes product code, tests, documentation, licenses and reusable, nonprivate engineering guides/decisions. Consumer installation selects only the reusable product and supplies studio-specific instructions and host skill projections. It does not install AIOX, authenticate providers, generate media or publish.

The local AIOX runtime, dependencies, generated projections and private state stay outside Git and the installed product. `.development/` is not categorically private: reviewed reusable guides, tooling scripts, decisions and sanitized engineering stories may be versioned; state, logs, private evidence and credentials may not. Keep private assessment/run/backup material in the existing ignored locations. Inspect exact files before staging instead of treating an entire directory as safe.

The root `AGENTS.md` governs engineering. `templates/studio-AGENTS.md` and `templates/studio-CLAUDE.md` govern destination studios. `.development/project.json`, with `schemaVersion: 1` and `kind: framework-development`, selects the development context. Canonical creative skills under `skills/` are product source here; their active projections belong to independent studios. AIOX role activation is an instruction choice for the assistant; real delegation exists only when a worker actually runs.

## Artifact and state boundaries

| Artifact | Canonical content and boundary |
| --- | --- |
| Public Git source | Product sources/tests/docs and reviewed reusable engineering files; one history for fixes, review and release provenance |
| npm/release package | Explicit `package.json` selection; no root engineering instructions, `.development/`, AIOX runtime/dependencies/projections or private state |
| Installed studio | Explicit installer inventory, creative instructions and selected canonical skill projections; no development marker or AIOX requirement |
| Local engineering tooling | Ignored `.aiox-core/`, `.codex/`, `.agents/skills/aiox-*`, with pinned provenance and reproducible configuration/repair |
| Private work | Existing ignored `work/`, `tmp/`, `backups/`, `.development/state/`, `.development/logs/`, provider tools/credentials and personal production records |

Current contracts: `package.json` declares Node 22+ and no dependencies/devDependencies; its `files` selects product paths. `scripts/install-framework.mjs` owns the separate installation inventory and supplies studio/Git templates instead of copying local engineering instructions/configuration. `scripts/assistant-targets.mjs` projects the same canonical skill bytes into the selected host directories. `.gitignore` is a local preservation aid, not proof of either export boundary. Verify both the package selection and actual installed tree.

## Alternatives and consequences

- A second public or private development repository containing another editable OLYMPOX code tree was rejected for now: it creates source divergence, duplicate corrections and harder association of tests, PR decisions and release commits.
- A private canonical development repository with an automatically promoted public distribution repository remains possible if the user later needs private engineering. It would require one source of truth, exact commit/artifact linkage, preservation of licenses/history and tested promotion. That need is not established by choosing AIOX.
- Separate local checkouts/worktrees remain useful for isolation and concurrent work; they can share the same canonical Git history. They do not require a second remote repository.

The single repository keeps code, tests, manuals and review history together. It intentionally exposes reusable engineering instructions while excluding execution state. A clean source clone is a development checkout, not an installed personal studio. The public setup command produces the latter. No change to repository visibility, Git remotes, project location, tags or published 0.5.0 bytes follows automatically from this decision.

For a later authorized release, Gage must review the exact source diff and package inventory, bind the artifact to its frozen commit, and exercise independent installation/preservation checks. Preserve immutable released bytes. A local commit, package version or passing test does not imply a new published release or hosted manual deployment. Coordinate manual changes with their owning conversation.

## F4 design — close public creative-skill activation in development

Confirmed trigger: `scripts/install-skill.mjs:14` calls `installSkill` without the development context check, although `scripts/studio.mjs:18-30` reads the marker and `:74-78` refuses creative operations. The assessment reproduced a successful creative projection in a marked synthetic checkout. This is an accidental-use policy gap, not a security boundary against someone who can edit local source.

Use one small shared, dependency-free context reader for the public studio and skill-activation CLIs. Extract the existing marker semantics rather than introducing a second environment heuristic or checking for AIOX installation. Before the activation CLI invokes `installSkill`, reject a valid development context with an actionable English message directing users to an independent installed studio. Preserve registered skill names, host options, normal studio installation and existing source/destination preflight.

Keep the programmatic `installSkill` API usable for controlled synthetic fixtures and installation operations. Do not add a bypass flag to the public activation CLI and do not delete preexisting projections while refusing activation. The core API is not a sandbox; repository instructions still constrain its real use.

Required cases for the bounded repair:

1. Marked development checkout: default/each registered skill and `codex`, `claude`, `both` refuse before creating directories or changing bytes, including unrelated existing files.
2. Missing marker, including an unrelated `.development/` note folder: normal installed-studio activation retains current behavior. The location of the script determines its root; a different shell working directory must not bypass the marker.
3. Malformed JSON, unsupported marker schema/kind, marker of the wrong file type, and linked marker/directory: fail closed using the same semantics as the studio entrypoint. Preserve existing read-only help behavior consistently; do not turn help into activation.
4. Existing conflict, identical installation and junction/path tests continue to protect unmarked studios. Fixture script inventories must include the new shared reader if one is extracted.

Use `tests/install-skill.test.mjs` and `tests/development-context.test.mjs` for meaningful refusal/preservation cases; existing installer fixtures remain independent studios. Do not modify personal records or weaken canonical skill matching to pass tests.

## F5 design — load actual AIOX engineering context reproducibly

Confirmed cause: `.development/configure-aiox.mjs:22` configures the three `.development/` guides, but `.aiox-core/data/agent-config-requirements.yaml` contains literal `docs/framework/*` requirements. The upstream loader's `getFilesToLoad` reads those entries (`agent-config-loader.js:169-184`); missing files return `content: null` (`:250-258`) while a full role load may still succeed. `devLoadAlwaysFiles` does not override that file list.

Prefer a narrow adaptation of configuration data in the pinned local runtime, not a source patch to `agent-config-loader.js`, monkey patch, fake product document copies or relaxed verification. Generate it reproducibly from the integrity-verified official `@aiox-squads/core@5.4.1` requirement file using the existing isolated configure/repair workflow. Keep the unmodified baseline and record its provenance in ignored development state.

Only these exact path substitutions are needed, including their shared-file/cache references:

| Official requirement | Engineering source |
| --- | --- |
| `docs/framework/coding-standards.md` | `.development/coding-standards.md` |
| `docs/framework/tech-stack.md` | `.development/tech-stack.md` |
| `docs/framework/source-tree.md` | `.development/source-tree.md` |

Preserve roles, required entries, lazy/condition behavior, upstream technical-preference/test documents, profile bytes and all unrelated configuration. Preflight pinned package/archive integrity, requirement baseline and destination paths before writes. Accept only the reviewed official baseline or its recognized already-adapted result; refuse unrelated drift for review rather than overwriting it. Retain the baseline, mapping, before/after hashes and adaptation revision/operation in local provenance. Repeating configuration must preserve the recognized result without multiplying edits. An upstream version/content change needs a new reviewed baseline rather than a blind text replacement.

At design inspection, requirement SHA-256 was `68e87b5777d1872c4fed6644dd3c7e3c3e8fd590df7d2b58c36d541cf8e38dd3`; loader SHA-256 was `6935a5574f887d88101c44340a96f2a4f8d01b2bdeb433108b84253178a106c7`. These identify inspected bytes; compare the requirement baseline against the integrity-verified official archive before treating it as trusted upstream source.

Extend `node .development/verify-aiox.mjs` with real `AgentConfigLoader.loadComplete` calls in a fresh process, bypassing content caches and disabling performance/state writes for probes. Independently assert this expected engineering-guide set, so deleting a requirement cannot make the check pass:

| Role | Required engineering guides |
| --- | --- |
| `dev` | coding standards, technology, source tree |
| `pm` | coding standards, technology |
| `sm` | coding standards |
| `analyst` | technology, source tree |
| `ux-design-expert` | technology, coding standards |

Compare loaded contents to the exact nonempty `.development/` source bytes and reject `null`, missing or error results. Also verify remaining non-lazy upstream requirements, role identity and unchanged profiles/loader. Do not verify only a file count, command count, greeting or exit 0. The upstream loader caches requirements separately from file contents; run verification after configuration in a new process. A missing upstream required file remains an explicit defect to investigate, not permission to remove that requirement or invent a replacement. The known grouped UX-command normalization limitation is separate from F5 and must remain disclosed.

F5 tooling and provenance stay out of the product package; no product dependency, API, database or runtime adapter is needed. Exercise the documented engineering setup once in a clean independent checkout before publishing this development layer. Do not run the official AIOX installer directly over unreviewed concurrent product changes.

## Remaining findings and evidence sequence

F4/F5 improve development reliability; the repository decision itself does not resolve them or the media findings. Next, bound F1's reusable authorized exact-file transfer and design F2/F3's new speaking-canon checkpoint and additive local stage-readiness records with product/QA review. Preserve silent/historical records, exact-reference hashes, uncertain-outcome reconciliation and offline preparation. A Markdown plan or a synthetic file is not evidence that a provider accepted inputs or that listening occurred.

F6 requires real, independent studio acceptance evidence: current exact module/route access, accepted references, usable exports, complete speech/motion review and observed Codex/Claude journeys. Applicable provider connection/upload/generation scope and spending authorization must exist before each external action; reuse authorization that already covers the work. Where exact inputs, capabilities, budget or required authorization are missing, the affected external stage stays pending while local preparation can continue. This document authorizes no login, upload, charge, training, publication or model-quality claim, and does not prescribe unverified provider parameters or a paid quota.

## Verification and maintenance

Engineering: `node .development/verify-aiox.mjs`, including real required-context loads. Product changes: `npm.cmd run verify`, plus focused activation/preservation checks and an independent package/installed-tree audit. No root lint/typecheck gates exist. Local checks do not prove live host discovery, media fidelity or remote publication.

Maintain the English decision and affected pt-BR companion together. Keep execution events, private assessment reports and repair provenance in their ignored maintenance/state records. This decision is reusable public engineering source and is excluded from the consumer package by the existing selection boundary.
