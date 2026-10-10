# Exact reference transfer and vocal applicability

Status: Accepted for bounded local implementation and synthetic verification on October 9, 2026. Live production acceptance remains separate.

## Requirements and existing boundaries

The accepted assessment identifies F1, a reusable exact-reference transport gap, and F2, vocal applicability missing from the structured pre-canon gate. The user wants an ordinary studio session to transfer its own selected files without asking the user to drag them into Higgsfield. Codex and Claude Code coordinate concepts and records; verified Higgsfield stages provide media. Removing a plugin does not solve the transport gap. A path written in a prompt is not an attachment.

The framework remains dependency-free on Node 22+. Provider tooling is optional and excluded from consumer packages. Framework development refuses creative mutation. Independent installed studios and synthetic fixtures exercise these operations. Installation does not authenticate, transfer, generate, train or publish. Existing characters, approvals, snapshots, assets, runs and backups retain their original bytes and meanings.

## Verified transport baseline

Keep the existing official `@higgsfield/cli` 1.1.26 Windows x64 baseline and executable SHA-256 from `vendor/higgsfield-skills/provenance.json`. The local engineering checkout has no provider installation; an independent studio's provider installation was inspected read-only. No helper code, private media or credentials were opened or copied.

The [pinned official CLI README](https://github.com/higgsfield-ai/cli/blob/v1.1.26/README.md) identifies native upload, account/workspace commands, machine-readable JSON and native command help. Native help from the verified executable confirms `upload create <file> --json` and `upload list` with `--image`, `--video`, `--audio`, `--size` and `--cursor`. There is no verified `upload get` route. The public repository provides documentation and distributions, not the Go command sources; do not invent a REST adapter from guessed internals.

Authorized read-only calls on the host returned the following shapes; all identifying values and URLs were suppressed:

| Command / evidence | Observed JSON keys and types |
| --- | --- |
| `account status --json` | `email`: string; `credits`: number; `subscription_plan_type`: string |
| `workspace status --json` | `id`: string; `name`: string or null; `plan_type`: string; `credits`: number; `is_selected`: boolean; `user_role`: string |
| `upload list --image --size 1 --json` | `cursor`: string or null; `items`: array of records containing `id`, `type`, `url`, `created_at` |
| Previously accepted native upload response, shape-only inspection | `id`: string; `type`: string; `url`: string; nonidentifying media type enum `image` independently confirmed |

The prior private transfer mapping has structured fields for subsequent plugin-library verification and downloaded-original equality. This establishes a prior observed route, not live acceptance of the new implementation. Its personal identifiers, source bytes and helper code remain private. Unknown response shapes fail closed; they must never be guessed into a successful receipt.

The connected OpenAI Higgsfield plugin's `media_upload` contract permits files created inside its remote `sandbox_exec` only. Its attachment helper accepts actual user-provided ChatGPT attachments only. Neither route can be presented as direct access to a local Windows studio file. The native CLI is the bounded reusable local-file transport. Cross-route ownership and module acceptance need real checks in each studio.

## F1 decision: separate authorized transfer operation

Add one small core module and public transfer CLI, separate from the preparation wrapper. Keep `higgsfield-local.mjs inspect` unable to upload, including media-bearing estimates. Share or extract the verified binary resolver only if its existing integrity and platform checks remain identical. Do not create a general provider adapter framework, add a package dependency, shell-compose commands, read credentials or add provider installation/login/workspace selection to the operation.

Expose local preparation, status, one authorized send and explicit reconciliation. Exact command names can follow the CLI conventions in ENG-003. Help must work without a provider installation; preparation must remain useful offline. Read-only identity inspection may return a derived account fingerprint and workspace ID without email or tokens. Native send uses fixed arguments, `shell: false`, `windowsHide: true` and a bounded timeout.

A transfer specification binds one character, one media file in its `references/` or `media/` tree, SHA-256, byte count, supported image/video/audio extension, intended provider/account/workspace, the native baseline and an applicable transfer authorization declaration. Authorization names the exact digest/size and destination; concept/canon approval alone does not authorize external transfer. Use existing session authorization without asking again. An assistant may prepare this declaration from the actual user instruction; its presence does not authenticate the actor.

Preflight all paths and types before writing or reading source bytes: relative slash paths only; no traversal, absolute paths, devices, control characters, credentials, provider installation, linked parent, linked leaf, junction or equivalent redirection. Realpath confinement alone is insufficient because it allows links pointing back inside the character. Refuse the framework development marker before transfer mutation or dispatch. Reject linked record, lock and staging paths as well.

Plan records private intent and an exclusive controlled staged byte snapshot. At send, revalidate the source and snapshot against the authorized digest and byte count; source drift must refuse before the native upload call. Pass the controlled snapshot path to the CLI rather than a previously hashed mutable source path. Locks and preflight protect ordinary concurrent processes; hashes/local permissions are integrity checks, not a hostile-user security boundary. Preserve snapshots while an outcome is uncertain.

Immediately before dispatch, read the actual native account/workspace shapes. Bind `SHA256(UTF8(email.trim().toLowerCase()))` and the exact workspace ID to the expected private destination. Refuse mismatch, missing identity, malformed schema, missing provider, changed binary/version or account query failure before upload. Never switch the provider's selected workspace automatically. The fingerprint identifies a checked account value; it does not authenticate a human or establish plugin ownership.

Persist the intent and `submitting` state before the single native upload call. Save only allowlisted output fields and necessary event metadata; never print/store raw stdout, stderr, email, credentials, provider URLs or arbitrary response fields. Keep only the returned media ID and type needed for subsequent mapping in ignored private records and redacted ordinary status. The observed `image` response is supported by prior native evidence; other response enums require checked evidence or remain unsupported. Validate response IDs and ordinary HTTPS URL shape without persisting the URL; reject userinfo, signed/query credentials and ambiguous output rather than forwarding it. An accepted response binds the local source digest and native receipt; provider-stored byte equality and cross-plugin accessibility remain explicitly unverified until an actual independent check records them. A transfer receipt is not generation readiness.

Timeout, interruption, nonzero exit after dispatch, malformed response, unknown output schema, or failure saving a successful receipt are uncertain outcomes. An interrupted `submitting` record remains unresolved. Never automatically retry, allocate another slot, switch to a plugin route or mark failure from an empty recent list. `send` must refuse a dispatched/uncertain/terminal record. A changed source/target requires a new intent and authorization; unresolved earlier intents must first be reconciled.

Reconciliation uses the verified read-only paginated native upload list and a known returned ID when available, plus explicit source-bound observations. A matching ID establishes library existence, not exact original bytes or plugin acceptance. When no ID survives, timestamps, a new row or one empty page cannot prove which upload belongs to the source or prove absence; retain uncertainty until a real service/library observation resolves it. A confirmed receipt obtained outside this operation can be recorded with actual tool/event provenance, exact source binding and destination check. Reconciliation never calls upload or generation. Do not invent deletion or an idempotency key the native CLI does not expose.

## F2 decision: additive new-identity declaration

New persona templates add `voice.applicability` with machine tokens `unspecified`, `speaking`, `silent`, and `voice.selection`, initially null. Retain persona `schemaVersion: 1`; the existing raw voice-object canon hash naturally binds these additive fields. Do not inject defaults into absent historical fields, normalize old JSON or recompute an old approval/hash.

For declared new identities:

- Draft `unspecified` is valid preparation with an explicit pending warning; it cannot be approved or frozen as complete canon.
- `silent` declares voice not applicable and requires both `voice.referenceId` and `voice.selection` to be null. Existing approval notes carry any explanation. Spoken production must reject silent scope even if conflicting reference fields are later added.
- `speaking` remains draft while selection is missing. Complete approval requires the approved canonical voice reference, an audio file, its exact ID/path/SHA-256 and a selection declaration with `method: listening`, `performed: true`, `generated: true`, `listened: true`, `selected: true`, reviewer, timestamp, event, source and notes. Critical issues or unresolved listening/inspection limitations prevent completion. The selection must match the selected reference and approved reference review, rather than merely contain descriptive prose.

Generic persona validation enforces these fields when they are actually present. Historical personas without them retain their prior validation, canon hashes, snapshot/backup behavior and silent/static use. An unchanged approved historical voice can still be reused in existing production without another identity approval. The operation does not add a voice or new approval to a frozen identity version; a changed identity uses the existing version-evolution procedure.

The current canonical `approve-canon` task receives a versioned policy signal, such as `vocalPolicy: explicit-applicability-v1`, and a contract version increment. `validateFramework` checks the supported signal for that updated task version so removing it from current source cannot silently weaken new runs; unknown policy values fail when present. Legitimate older source/contracts remain distinguishable by their recorded version and absence of this additive policy. At current-policy canon completion, require the explicit persona applicability even if the generic legacy validator accepts absent fields. Use one shared assertion for this gate and declared persona validation. Current `nextTask`/criteria must explain unresolved vocal applicability. No extra generation orchestrator or conditional workflow task is needed; vocal exploration occurs under existing draft/reference preparation before the canon step.

Saved historical run contracts without this signal keep their original semantics. Reading/resuming them does not apply a new canonical task retroactively; changed governance/input/provider scope still requires the existing explicit new-attempt procedure. New current `create-character` approvals cannot evade the checkpoint by deleting `voice.applicability`. Existing approved historical identities belong in `produce-piece`, not a new-character approval flow. Direct canon snapshot validation blocks incomplete newly declared scope; deliberately deleting all new fields to forge legacy data cannot be inferred from file age and is outside the local record authentication guarantees.

## Hooks, tests and live limits

F1 hooks are a narrow transfer core/CLI and template; optional shared CLI integrity resolver; `docs/higgsfield-setup.md`, production/skills/studio instructions in both languages; explicit installer/export source inclusion. Private intents/receipts/staging remain ignored and excluded from packages. The existing studio/freeze/asset/run mutation logic must not be rewritten by transfer work.

F2 hooks are persona templates in both languages, a shared vocal assertion in `studio-core.mjs`, current task contract and its locale catalog, current-policy approval in `framework-core.mjs`, relevant studio/production/operations/skills documentation. Machine tokens stay English. No manual design rewrite is required.

Meaningful F1 fixtures exercise exact staged bytes/argv, account/workspace mismatch, missing authorization, drift at send, linked parents/leaf/junctions, invalid file/path/response shapes, overflow/timeout/interrupt, lock/concurrent sends, persist-before-dispatch, crash/reconciliation, unknown-ID uncertainty, terminal duplicate refusal, output redaction and zero-write/pre-provider refusal. Test injection remains an internal API seam; public CLI/env cannot select arbitrary unverified binaries. Exercise actual package/extracted installed trees and preserve unrelated notes/Git metadata. Mocked transfer is not a live upload.

Meaningful F2 fixtures cover draft preparation, unspecified/missing current-policy refusal, exact listened selection, wrong reference/path/hash/event/method, pending issues, silent acceptance/speech refusal, snapshot and complete-canon gates, stable historical English/Portuguese hashes and bytes, historical frozen task semantics, changed context requiring a new attempt, and unchanged static production. Synthetic extensions/booleans do not prove audio quality, listening or human identity.

Complete focused regressions and `npm.cmd run verify`, then independently verify actual export/install privacy and preservation. F3 per-stage readiness, F6 novice host journeys and the speaking pilot remain later work. No new live upload, paid job, authentication, account/workspace mutation, training, publication or remote repository write is part of this increment. The native route's verified runtime platform is Windows x64; shared contracts/Node APIs alone do not prove macOS/Linux or Codex/Claude live media parity.
