# ADR 003 — Per-stage media readiness

Status: Accepted for bounded local implementation, 2026-10-09. Orion accepted the direction after reviewing the existing source and workflow sequence. Actual provider/module/media acceptance remains separate.

## Problem and verified boundary

F3 in `work/maintenance/aiox-project-review-2026-10-09/assessment.md` identifies a concrete gap: provider/medium capability tokens do not validate the filled-in meaning of a production-method plan. Current `framework-core.mjs` permits generation completion without an earlier start; it checks generated files, declared tool/provider and capabilities, but has no exact module/input/quote/authorization readiness gate. A native installation or F1 image receipt also does not establish module acceptance, export or inspection support.

The existing 15 contracts and three workflows remain. `generate-candidates` produces images; `generate-piece` serves the pilot, production and correction generation steps. There is no separate correction-generation contract. In creation, visual review and user selection precede the final listened voice selection/canon checkpoint. Voice/reference operations must not become mandatory completed operations inside image candidate generation before that selection. F1/F2 and eight closed foundation/increment story editions remain preserved.

## Decision

Add one dependency-free local readiness evaluator and one action, `record-media-readiness`, to the existing run transition API/CLI. Use the existing private run JSON, lock, events and record hash. Do not add provider execution, a provider SDK, a database, a stage dispatcher, task graph nodes or automatic creative roles.

Update only the two generation contracts to version `0.3.0`, with `mediaReadinessPolicy: "stage-readiness-v1"`. Validate the supported value in canonical and captured contracts. Absent policy on captured `0.1.0`/`0.2.0` generation contracts retains historical semantics. Current `0.3.0` missing/unknown policy fails validation; removing the marker cannot silently restore legacy behavior. A saved old run keeps its captured contract even on a new attempt. A fresh current run is required to adopt the policy.

Separate three questions:

1. Whole-method feasibility: do all required stages have declared current access, accepted input schema, export/inspection support and a scoped whole-pilot budget/authorization? Future input slots can identify an upstream stage without nonexistent output hashes.
2. Exact current execution stage: are its actual prompt, parameters and references bound to checked local bytes and accepted attachments for the same provider/module/route/tool/destination/model context, with an applicable quote and separate authorization?
3. Outcome/quality: did real tools produce usable media and did someone actually inspect/select it? Existing output, review, F2 canon and uncertain-job contracts remain responsible for these declarations. Readiness is not outcome or quality evidence.

## Plan and stage mapping

The immutable machine plan references the exact versioned production-method source (`path`, `sha256`) and its actual user method choice (`actor`, UTC `at`, `eventId`, `source`, `notes`). The coordinating assistant prepares it from the authorized method; this is not another blanket permission request. It records source requirements and any explicit adaptation rather than claiming that flexible labels reproduce 100% of a reference video.

Exactly one stage is assigned to each generation step in the captured workflow: `candidates`, `pilot`, `generation` or `correction` as applicable. Its `stepId` is that real captured ID and its medium matches the task's actual output medium. These execution stages are required, cannot be deleted or marked N/A/reuse, and their provider must match the attempt's selected medium provider. Additional method stages use `stepId: null`; the generation task does not claim to execute them. Their feasibility, pending reasons and declared outcome remain visible. In particular, reference development/voice after visual selection belongs here, rather than being forced before the candidates-review step.

The method requirements must explicitly include visual exploration, premise scene, reference pack, voice and pilot for creation; scene inputs, voice and final media for production/correction. One stage can cover multiple requirement IDs when the actual selected module supports them. Voice can be `not-required` only for declared silent scope; selected speaking voice can be `reuse` with exact existing approved references. Scene/reference reuse needs exact existing context and a reason. Other omissions/adaptations require a recorded actual user method decision. Unknown vocal applicability or missing coverage remains pending. Optional training is included only if selected; a Builder sheet must not implicitly claim training. Speech lip-sync/animation requirements are included when selected/needed, or explicitly mapped to the supporting execution module. This is structural checking of declared coverage, not semantic proof of the source video's method or current provider support.

## Schema 1

Use a new reusable `templates/media-readiness.json` and pt-BR counterpart. Tokens/keys are English in both. The incoming record has these exact top-level fields:

| Field | Meaning |
| --- | --- |
| `schemaVersion` | `1` |
| `policy` | `stage-readiness-v1` |
| `runId`, `attemptId` | Exact current run and attempt; old envelopes cannot be reused |
| `plan` | Immutable plan described below |
| `feasibility` | Whole-plan observations and separate pilot authorization |
| `stages` | Per-stage observations; incomplete observations are valid pending records |
| `provenance` | Actual actor/date/event/source/notes declaration |

`plan` contains `schemaVersion`, `methodSource: {path, sha256}`, `choice`, `requirements` and `stages`. A requirement names `id`, `applicability` (`required`, `reuse`, `not-required`), `reason`, `decision` and covering stage IDs. Required default execution stages cannot be demoted; conditional applicability uses the domain rules above. Each plan stage names `id`, `stepId`, `purpose`, `medium`, `provider`, `method`, `module`, `route`, `tool`, `requestedModel` (string or null), and `inputSlots`. Each slot names `id`, `kind` (`prompt`, `parameters`, `reference`), `role`/`order` where applicable and `fromStageId` (null or an existing earlier stage). IDs are unique and dependencies are acyclic. Unknown module/route/tool may be honestly null in a pending plan; choosing a different concrete method later requires a new plan/attempt.

Compute `planHash` from recursively key-sorted JSON of this validated plan. Store it in the attempt and report it through status; do not trust an incoming hash instead of computing it. A file hash alone does not validate the machine fields. Keep the exact method-source byte binding as a tracked attempt input.

Every required stage in `feasibility.stages` has matching `stageId`, `access`, `acceptedInputSlots`, `destination`, `model`, `quote`, `export`, `inspection`, `limitations` and `provenance`. `access` records observed availability for the selected module/route/tool. Accepted input slots are schema/access observations, not invented future attachments. Destination holds actual checked account fingerprint/workspace ID when exposed; a host route that does not expose them records explicit `not-exposed` evidence. Missing destination identity on a route that exposes it remains pending. Neither CLI installation nor a receipt substitutes for these observations.

`model` is `{exposed, value, reason, provenance}`. An exposed model requires its actual nonempty value and must match any requested model; `exposed: false` requires null value and a real observation explaining non-exposure. A missing value without that observation is pending, not silently interpreted as unexposed. First actual model/destination binding is retained; changing a bound context requires a new attempt.

`quote` records `status` (`known`, `unknown`), `amount` (finite nonnegative number or null), `unit`, exact parameter/scope binding, `source`, UTC `at`, `expiresAt` (date or null) and uncertainty reason. A known zero requires actual evidence; absence is unknown. Credits and monetary currency remain different units; sum only comparable units and never infer an exchange rate. Whole-plan quotes bind plan/requirement scope; current-stage quotes additionally bind actual parameter/input scope. Unknown future parameters can remain an explicitly authorized uncertainty instead of forcing future files into existence.

`feasibility.authorization` is a separate explicit applicable generation/whole-pilot declaration with exact plan/quote bindings, covered stage IDs, any per-unit limits, accepted unknown costs, and actor/date/event/source/notes. Stage `authorization` separately binds the exact current stage scope and quote, with `approved: true` and the same provenance fields. A previous real user authorization may cover both declarations; neither is inferred from canon approval, a price quote, an available balance or `free` tool availability. Known sums must fit declared comparable limits; unknown cost needs explicit scoped acceptance. The local record does not enforce a provider spend cap or authenticate consent.

Each entry in `stages` names `stageId`, `inputs`, `acceptedInputs`, `model`, `destination`, `quote`, `authorization`, `export`, `inspection`, `limitations`, `outcome` and `provenance`. Initially unbound future slots can be null/pending. An exact input names slot ID, root-relative path, SHA-256 and byte count; references also name exact reference ID, role and order. Registered canonical references must match the current selected approved reference and bytes. Draft/reference preparation uses its declared selection/source without inventing canon approval. Provider acceptance maps every slot to the same source digest/size and actual attachment/provider input identifier, route/module/destination and observation. A local path in prose or a native upload receipt alone cannot satisfy acceptance.

`export` names observed support, actual tool/route, original-byte format/support, limitations and provenance. `inspection` names observed support, actual tool, complete medium method (`visual`, `listening`, `visual-and-audio`), limitations and provenance. These describe support before execution, not a completed asset review. Missing/unsupported export or complete inspection remains pending. Optional `outcome` records declared completed/reused files/hashes and actual generation/reuse/review provenance; only real existing bytes can be bound, and the generation contract never labels `stepId: null` work as executed by itself.

New records contain only allowlisted fields and bounded strings/JSON. Persist file hashes/IDs and sanitized provenance, not prompt contents, provider URLs, emails, credentials or raw provider output. Enforce strict paths including all parent/leaf/record/lock components, links and inward junctions. Evidence and input paths are confined to appropriate studio `work/` or the bound character; provider installations, credentials, protected configuration and other characters are excluded. Reuse the already exported F1 strict-path helper without changing its closed bytes, or use an equivalent small helper if necessary. No native adapter is invoked. Hash media synchronously in bounded chunks if needed; do not load arbitrary-size media solely to validate its digest.

### Exact nested keys and hashes

The tables below remove ambiguity for the implementation. Every object rejects unknown keys. A missing/null pending observation is allowed where specified; a malformed supplied observation is refused. State is derived, not an incoming `ready: true` flag. All provenance objects have exactly `{actor, at, eventId, source, notes}` with a real UTC date and sanitized nonempty strings. `choice` and requirement `decision` add `explicit: true` to those same fields; null decision is allowed only for an unresolved required requirement, never an accepted omission.

| Object | Exact keys / values |
| --- | --- |
| `plan` | `schemaVersion`, `methodSource`, `choice`, `requirements`, `stages` |
| `methodSource` | `path`, `sha256` |
| Requirement | `id`, `applicability`, `reason`, `decision`, `stageIds`; `stageIds` is the covering stage-ID list |
| Plan stage | `id`, `stepId`, `purpose`, `medium`, `provider`, `method`, `module`, `route`, `tool`, `requestedModel`, `inputSlots` |
| Input slot | `id`, `kind`, `role`, `order`, `fromStageId`; non-reference role/order are null |
| `feasibility` | `stages`, `authorization` |
| Feasibility stage | `stageId`, `access`, `acceptedInputSlots`, `destination`, `model`, `quote`, `export`, `inspection`, `limitations`, `provenance` |
| `access` | `available` (boolean), `provenance`; null access remains pending |
| `acceptedInputSlots` | List of `{slotId, supported, provenance}`; every required slot must be covered with supported true |
| `destination` | `exposed`, `value`, `reason`, `provenance`; value is null or exactly `{accountFingerprint, workspaceId}` |
| `model` | `exposed`, `value`, `reason`, `provenance` |
| `quote` | `status`, `amount`, `unit`, `scopeHash`, `source`, `at`, `expiresAt`, `reason` |
| `unit` | Null for explicitly unknown unit, or `{kind, code}`: kind credits/currency/free; code provider token for credits, uppercase currency code for currency, null for free |
| Authorization | `approved`, `scopeHash`, `quoteHashes`, `stageIds`, `limits`, `acceptUnknownCost`, `provenance` |
| Limit | `unit`, `maximum`; compare only the exact same unit; maximum finite and nonnegative |
| `acceptUnknownCost` | Explicit list of covered stage IDs with unknown amount or unit, never a blanket truthy value |
| Stage observation | `stageId`, `inputs`, `acceptedInputs`, `model`, `destination`, `quote`, `authorization`, `export`, `inspection`, `limitations`, `outcome`, `provenance` |
| Exact input | `slotId`, `path`, `sha256`, `bytes`, `referenceId`, `role`, `order`; non-reference referenceId/role/order are null |
| Accepted input | `slotId`, `sha256`, `bytes`, `inputId`, `scopeHash`, `provenance`; inputId is a real accepted attachment/provider-input identifier |
| `export` | `available`, `tool`, `route`, `format`, `originalBytes`, `limitations`, `provenance`; available/originalBytes true required |
| `inspection` | `available`, `tool`, `method`, `limitations`, `provenance`; available true and full medium method required |
| Optional `outcome` | Null or `{status, files, evidence, review}`; status completed/reused |
| Outcome file | `path`, `sha256`, `bytes` |
| Outcome evidence | `type`, `performed`, `provenance`; generated/reused and performed true |
| Outcome review | `performed`, `method`, `decision`, `criticalIssues`, `limitations`, `provenance`; true, complete medium method, approve and empty criticalIssues/limitations |

Quote, grant, export, inspection, destination and model may be null in a pending observation. Inputs/accepted inputs may be empty or lack unresolved future slots; duplicates and unknown slots are refused. `limitations` is a string list and nonempty required-stage limitations keep the affected readiness pending. Explicit free quotes require status known, amount zero, unit `{kind:"free",code:null}` and actual source/date; unknown never becomes free. A scoped unknown-unit cost can be accepted explicitly, but cannot be compared with a numerical cap in another unit. The record makes that limitation visible.

Destination `exposed:false` requires null value and real non-exposure provenance; `native-cli` cannot use that exception because its verified status route exposes account/workspace identity. A declared host/provider observation may describe another route's exposure; the core never discovers it or authenticates the claim. Actual values must match between whole-plan and current-stage observations. Fingerprints remain pseudonymous bindings, not secret account credentials.

Let `H` be SHA-256 of recursively sorted JSON and `binding(x)` project a model/destination observation to `{exposed,value}` only, omitting explanatory prose/date. Compute these values from checked fields, not supplied hashes:

```text
planHash = H(plan)
feasibilityScopeHash(stage) = H({policy,runId,attemptId,planHash,stageId,
  phase:"feasibility",model:binding(model),destination:binding(destination)})
stageScopeHash(stage) = H({policy,runId,attemptId,planHash,stageId,
  phase:"execution",canonBinding,currentStage:planStage,
  model:binding(model),destination:binding(destination),inputs:orderedExactInputs})
pilotScopeHash = H({policy,runId,attemptId,planHash,phase:"pilot"})
quoteHash = H(validatedQuote)
```

Inputs are ordered by their plan slot order; a reference's role/order is also part of the input. The current stage includes actual prompt and parameter-file bindings, so accepted input/quote/authorization scope cannot be moved to a different prompt or generation setting. Feasibility quotes use their computed feasibility scope; stage quotes and accepted inputs use the computed execution scope. Pilot authorization uses pilotScopeHash and exactly the required feasibility quote hashes/stage IDs. Current authorization uses stageScopeHash and the exact current quote hash/stage ID. Recorded quoteHashes are compared as unique sets; no unknown or omitted required quote can silently satisfy the grant. Grants may cite previously applicable real user events, but the exact new local scope must still be declared covered. The validator can export these computed hashes for preparation/status without provider calls.

Unspecified voice remains a required future exact stage pending; declared voice capability/input-schema/quote/export/inspection feasibility can pass without a nonexistent selected voice or its outcome. It cannot become N/A without silent scope/choice. Existing compatible historical canon may be reused with exact approved reference bindings and current scoped method choice, without adding new persona fields. At execution completion, use the immutable quote/grant captured when the stage actually started, even if expired afterward; do not demand reupload, recharge or a fresh quote to finish a matching known operation.

Canonical requirement IDs are `visual-exploration`, `premise-scene`, `reference-pack`, `voice`, `pilot` for creation and `scene-inputs`, `voice`, `final-media` for production/correction. In a fresh production/correction run using an approved historical persona with absent applicability fields, an explicitly chosen static/silent piece may mark voice `not-required` with actual decision/reason bound to the plan and unchanged canon. This declares the piece's scope, not the character's historical vocal scope. Never infer silence from a null/missing voice or migrate the persona. A speaking piece instead requires/reuses exact approved audio under the applicable legacy reference semantics. Current creation/canon approval still follows F2 and gains no missing-applicability bypass.

Limits for new metadata: at most 32 stages, 64 input slots per stage and 1 MiB of JSON; bounded strings and identifier shapes, no recursive untrusted extras. Retain actual file sizes/digests without imposing the F1 upload operation's media-size cap on offline F3 metadata. Preflight readiness/plan/input paths and the marked run's root/work/runs/record/lock paths before unsafe writes; reread the authoritative run under its lock. Historical ordinary status/read paths keep their prior behavior and gain no injected defaults. Canonical requirements/parameters are data, never executable instructions from the imported file.

## API, storage and gates

Add a small `stage-readiness-core.mjs` with plan/record validation, deterministic scope hashes and a pure/read-only evaluator. `framework-core.mjs` imports it without a circular import. Public entry remains:

```text
node scripts/studio.mjs run-step <run-id> <transition.json>
node scripts/studio.mjs run-status <run-id>
```

The transition is `{action: "record-media-readiness", readinessPath: "work/.../readiness-v001.json"}`. It validates the current envelope/context and every path before committing a run change. Under the existing run lock, reread the current record and validate again before importing an immutable snapshot. Store the frozen plan/hash and append-only readiness snapshots in the current attempt; existing events record their IDs, source-file hashes and provenance. Old evidence files/snapshots are not rewritten. Do not track mutable observation JSON as a live attempt input: import its complete validated snapshot. Track selected exact source bytes and immutable method-source inputs for drift checks.

`startRun` and `resumeRun({newAttempt:true, reason, readinessPlanPath})` may accept a safe standalone machine plan path, for offline initialization only; absence leaves readiness pending. `record-media-readiness` can make the initial plan binding before a marked generation starts. Once bound, replacement of plan/method/provider/module/route/requested model or coverage uses an explicit new attempt and reason. New attempts clear prior readiness observations, grants and active execution snapshots; they do not automatically consume old evidence. An explicitly supplied plan must be rechecked against the new attempt/provider/context. Old run contracts are not upgraded; voluntary legacy source reading stays legacy, and recording/enforcing the new action requires the current captured policy.

Refresh within the same plan is an explicit append-only `record-media-readiness` action. Future inputs acquire their first actual binding after upstream work exists. Once exact selection/model/destination is bound, a different value requires a new attempt; changing a pending check to observed availability or refreshing the same-scope quote/grant can append evidence. No refresh/replan/reroute is allowed while an original job is unresolved. The existing `resolve` path remains usable despite drift so the original operation can be reconciled; reconciliation never gains readiness or authorization for another submission.

Both marked generation `start` and `complete` use the shared gate. `start` names `stageId`, which must be the required execution stage for the current captured step. Whole-plan feasibility and the exact current stage must pass before any external-intent/job record is accepted. Capture an immutable active readiness snapshot containing plan/scope/input/quote/grant hashes and stage identity with that start. Missing readiness returns explicit pending reasons/awaiting-tool without recording a job or generation completion. Generic capability tokens remain additional prerequisites; they cannot replace readiness.

`complete` requires the captured start snapshot: direct completion cannot bypass the new policy. It rechecks source/context and binds generated evidence to stage/plan/scope hashes and actual provider/tool/module/route/model exposure. It still requires the existing output/evidence checks. A quote expiring after an already recorded execution start does not fabricate failure of a completed operation; retain the applicable captured quote/grant and require the matching actual outcome. Current context changes are held, and uncertain jobs must use original reconciliation before proceeding. One exact current execution stage is enforced by the task; other method stages remain separately declared/pending/outcome-bound. This is deliberately not a new full creative orchestrator.

Read-only status exposes whole-plan feasibility, every stage's pending reasons/outcome, current exact stage readiness, `canStartStage` and the active captured snapshot identity. Distinguish `pipelineReady` from current-stage readiness; future unresolved exact attachments do not deadlock an earlier stage whose whole-path feasibility and own exact inputs pass. No status read writes defaults, normalizes history or calls a provider. CLI help/catalog descriptions must explain the new action rather than advertise a new generation tool.

## Implementation footprint and acceptance

Expected product footprint: one core, EN/PT JSON template, the two generation contracts, narrow framework-core/studio-help/docs-core/catalog integration, affected EN/PT framework/architecture/operations/production-method guidance and studio skills/templates. Existing installer/package selection already carries these reusable sources; confirm actual export/installed tree. No dependency/package scripts, provider binaries, private state or generated manual output are exported. Manual ownership remains coordinated.

Meaningful tests cover schema/policy removal, both start and direct completion, missing module/schema/attachments/export/inspection/quote/grant, exact scope and known/unexposed model, per-unit pricing/unknown authorization, first future binding without deadlock, bound-source/method/destination drift, explicit refresh/new attempt, unresolved job plus resolve, under-lock stale context, real inward junction/unsafe paths before lasting writes, actual CLI/status and the required-stage/N/A rules. Use the retained immediate pre-F3 archive `00423d1b944c6bb2db14e46e6c74f2e1003196005139af00181c56f74fe69e4a` for real F1/F2 histories; HEAD is an older separate baseline. Preserve eight closed story edition bytes and all unrelated changes. Run focused tests, product verify, actual package/independent install/conflict/privacy and engineering checks serially as appropriate, with source/installed zero skips.

Local consistency cannot authenticate real tool availability, remote input acceptance, a reviewer/user, actual spending or a provider cap. Live F6 host journeys and a fully inspected speaking pilot remain separate. Preserve Windows INV-001/W-001 evidence; green new runs do not establish its cause. Do not retry the previously blocked external CodeRabbit review or report it as passed.
