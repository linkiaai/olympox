# Runtime contract reference

`scripts/framework-core.mjs` implements local workflow records for OLYMPOX. The registry selects profiles, task contracts, and workflow definitions; a run saves those definitions with its observed context. The coordinating assistant performs the work and supplies declarations and existing files. The module has no agent dispatcher or provider adapter.

The framework package and registry use the release-candidate version **0.6.0-rc.1**. Task/workflow JSON contracts retain individual component revisions, including **0.2.0** and **0.3.0**, and `schemaVersion: 1`; these are compatibility identifiers, not the current product release number. This reference describes the current implementation, including additive provider, vocal and stage-readiness policies. See [release notes](../docs/release-notes.md) for testing and pending live acceptance.

For the conversational workflow and CLI sequence, read [workflows and resumption](../docs/framework-02.md). For persona, manifest, and backup commands, read [operations](../docs/operations.md).

## Module API

| Function | Behavior |
| --- | --- |
| `validateFramework(root)` | Resolves and validates registry, profiles, tasks, and workflows; returns `valid`, errors, warnings, and resolved definitions |
| `startRun(root, options)` | Creates a run from the selected workflow and returns its task package |
| `readRun(root, runId)` | Returns the saved record, next task, context drift, and prerequisites without modifying it |
| `validateRunRecord(run)` | Validates historical record structure and hashes independently of current workspace files; returns `true` or throws |
| `transitionRun(root, runId, options)` | Applies a declared transition under the run lock |
| `resumeRun(root, runId, options = {})` | Checks continuation or creates an explicit new attempt while preserving history |

`startRun` options are `workflowId`, `personaId`, `objective`, `inputs`, `medium`, `capabilities`, and `mediaProviders`. `objective` must be nonempty. `create-character` permits `personaId: null` and defaults to `medium: video`; production/correction require approved canon and default to image. Accepted media are `image`, `video`, and `audio`.

Inputs/outputs are lists of existing root-relative paths with `/`. Paths escaping the root, duplicate equivalent files, and another character's files are rejected. Records are `work/runs/run-<UUID>.json`. The package reports `nextTask`, `responsible`, `state`, `attemptId`, `inputs`, `canonBinding`, `drift`, `missingCapabilities`, and `canContinue`, together with the saved run. `automaticallyDispatched` is always `false`.

## Provider and capability policy

New attempts save a complete provider map:

```json
{
  "image": "higgsfield",
  "video": "higgsfield",
  "audio": "higgsfield"
}
```

Explicit run options can replace a provider per medium; omitted values use defaults. Provider IDs are English machine tokens. `integrated-images` is supported as an explicit image alternative and rejected for video/audio. Save the actual method decision and exact operations in the production plan.

Generation requires `<medium>-generation` and `<provider>:<medium>-generation`; inspection requires `<medium>-inspection`. Thus Higgsfield images need both `image-generation` and `higgsfield:image-generation`. Capabilities can be updated through transition options. A missing requirement sets `awaiting-tool` without calling a tool.

For provider-aware attempts, `generate-candidates` and `review-candidates` use image even when the pilot medium is video. Other tasks use the run medium; `nextTask.medium` exposes the stage's choice. Historical attempts without a provider map retain their saved single-medium and generic-capability behavior.

These declarations do not prove account access, exact Builder/Soul Cinema/voice/video support, accepted references, cost, export, or execution. Check those capabilities through actual tools before promising production.

## Transition fields

Every transition contains `action`. Available actions:

| Action | Additional fields and constraints |
| --- | --- |
| `start` | Checks prerequisites/capabilities; optional `execution`, generation-only `job`, and `capabilities` |
| `complete` | Checks prerequisites/capabilities and validates outputs plus `evidence` or human `approval` |
| `bind-persona` | `personaId`; only when unbound, before the candidate stages require it |
| `skip` | `reason`; only a step marked optional in the saved workflow |
| `wait` | `state: awaiting-input|awaiting-tool|in-review`, and `reason` |
| `uncertain` | `job` with provider/known IDs and `reason`; preserves unresolved identifiers |
| `resolve` | Reconciled `job` status/identifiers and `evidence` of type `reconciled` |
| `fail` | `reason`; finishes the local attempt after unresolved jobs are reconciled |
| `cancel` | `reason`; finishes the local attempt after unresolved jobs are reconciled |

Generation, review, delivery, and canon decisions cannot be skipped. Finished attempts require a new attempt for further work. `mediaProviders` is rejected in transition options; change it through explicit resumption.

`execution` defaults to `{ "mode": "instruction" }`. Declared delegation uses `mode: delegated`, `agentId`, `eventId`, `actor`, and an ISO timestamp `at`. Record it only after a real subagent dispatch. The runtime does not create that dispatch.

## Completion records

For non-decision tasks, provide `outputs` and `evidence` with the following base fields:

| Field | Meaning |
| --- | --- |
| `type` | `prepared`, `generated`, `reviewed`, or `delivered`, matching the contract |
| `performed` | Must be `true`, describing work that actually occurred |
| `actor` | Actual responsible actor |
| `at` | Actual ISO timestamp |
| `eventId` | Traceable event identifier |
| `notes` | Nonempty account of the work and evidence |

Outputs must meet the contract's minimum count. Preparation requires document files. Generation requires media extensions matching the stage's medium, `tool`, and, for provider-aware attempts, `provider` matching the selected map. File extension and declaration checks are not MIME/content inspection.

Review additionally requires `reviewer`, `method`, `decision: approve`, empty `criticalIssues` and `limitations`, and `media: [{path, sha256}]` matching every file in the latest completed generation. Methods are `visual` for image, `listening` for audio, and `visual-and-audio` for video. Review outputs must be document reports. Delivery outputs must match the reviewed paths and exact bytes; edited exports need their own applicable review.

Human decision gates instead use `approval: {explicit: true, decision: approve, reviewer, at, eventId, source, notes}`. Their contract can permit zero outputs. `approve-canon` also needs `identityVersion` and `canonHash` matching approval already recorded in the persona. It binds that canon to the run; it does not approve or edit the persona itself.

Declarations validate traceable fields, not a person's identity, a message's authenticity, or completed inspection. Attach them to real events; do not copy example reviewers or timestamps as evidence.

## External job records

Before external submission at a generation stage, use `start` with `job: {provider, jobId?, requestId?}`. The provider must match the selected stage in new attempts. The runtime stores `status: planned` and intent before submission; it does not call the provider.

Any recorded job remains unresolved until `resolve`, including a normal success. An interrupted response can be recorded with `uncertain`; resuming an unresolved job sets `uncertain-result`. Known identifiers cannot be replaced while recording uncertainty.

`resolve` requires the same provider and known IDs, status `succeeded`, `failed`, or `not-submitted`, and base evidence fields with `type: reconciled`. Query the actual provider when needed and record the real conclusion. The transition stores the reconciliation and returns the local state to `planned`. Generation still needs output files and `complete` evidence.

An unresolved job blocks other progress, cancellation, and a new attempt. Local cancellation does not cancel provider work or recover a charge. The runtime cannot discover calls made without intent, and never automatically queries or retries.

## Context changes and new attempts

Observed inputs, completed outputs, governance, contracts, and bound canon have hashes. Ordinary transition/resumption detects changed context and holds continuation. Use `resumeRun(root, runId, {newAttempt: true, reason, mediaProviders?})` only after reviewing the change and reconciling external jobs.

A new attempt restarts the saved workflow from its first step, preserves prior attempts and the saved `run.contract`, and observes current input/governance/canon files. It does not replace workflow definitions or reuse prior completion approvals. Start a separate run when the current contract definition is needed. Provider choices omitted from a new attempt retain the prior map; historical attempts without a map adopt current defaults.

Approved canon is compared with any existing frozen snapshot for the same `identityVersion`. Same-version changes fail even if the approval hash is replaced. These checks do not create snapshots or reconstruct missing history; an approved persona without an existing snapshot can remain valid. Reconciliation of an unresolved external job remains possible while other context has drifted.

## Storage and verification boundary

Exclusive locks prevent simultaneous record writers; complete temporary files are used for replacement. An interruption may leave a lock: check active processes and preserve evidence before recovery. Hashes detect changes; they are not signatures and cannot authenticate someone able to edit and recalculate records.

Historical workflow/state inputs remain compatible without rewriting stored bytes. Local completion means the saved contracts accepted files and declarations. It does not establish media quality, provider success beyond recorded evidence, or publication. See [capabilities and limits](../docs/studio-status.md).

## Structured media readiness

The coordinating assistant prepares `templates/media-readiness.json` from actual choices and tool observations in the installed studio; the creator continues through conversation. Its null placeholders are unfinished, not evidence. Save a versioned method document and bind its exact path/SHA-256. Prepare a standalone `plan` with optional `readinessPlanPath` on run-start or explicit new-attempt; offline planning makes no provider call. Otherwise the first readiness import binds the plan. Every required requirement's decision records the applicable actual method-choice event; null decisions and unknown modules remain pending.

For current `generate-candidates` and `generate-piece` contracts `0.3.0`, the assistant imports `{action:"record-media-readiness",readinessPath:"work/readiness-v001.json"}` through `run-step`. The exact schema-1 envelope is `{schemaVersion,policy,runId,attemptId,plan,feasibility,stages,provenance}`, with `policy:"stage-readiness-v1"`. One required execution stage maps to each captured generation step: `candidates`/`pilot`, `generation` or `correction`. Auxiliary stages use `stepId:null`; their separately recorded outcomes are not execution of those tasks. Creation coverage is `visual-exploration,premise-scene,reference-pack,voice,pilot`; production/correction is `scene-inputs,voice,final-media`.

Whole-pilot feasibility checks each required module's access, accepted input schemas, model/destination exposure, quote or scoped cost uncertainty, export and complete inspection support. It does not require nonexistent future voice or scene files. Exact current execution separately binds prompt/parameter files, ordered reference roles, original byte counts/hashes and actual accepted input IDs. Each model/destination records `{exposed,value,reason,provenance}`; unknown is pending and observed non-exposure is explicit. `native-cli` requires actual account fingerprint/workspace. Quotes bind `{status,amount,unit,scopeHash,source,at,expiresAt,reason}`; units are separate credits/currency/free. Unknown costs never become zero. The pilot grant and current-stage grant separately bind `{approved,scopeHash,quoteHashes,stageIds,limits,acceptUnknownCost,provenance}`. Known costs of completed stages, current execution and remaining estimates must fit each exact comparable-unit pilot limit; a looser stage grant cannot override it. These declarations do not authenticate consent or impose a provider spending cap.

Each provenance is exactly `{actor,at,eventId,source,notes}`, with a real UTC timestamp; choices/requirement decisions add `explicit:true`. All metadata rejects unknown keys, is bounded to 1 MiB, 32 stages and 64 slots per stage, and excludes prompt bodies, raw output, credentials, URLs and emails. Full creative prompts stay in their versioned local source files; this record carries hashes. Sources must stay in safe studio `work/` or the bound character; links/junctions, protected configuration and other characters are rejected before record writes. Media hashes are read in chunks without an upload-size limit.

Use `start` with the exact `stageId` only when whole-path feasibility and current exact readiness pass. The core captures immutable plan/scope/input/quote/grant context before any optional job intent. `complete` requires that captured start and existing media outputs. Its generated evidence has only `type,performed,actor,at,eventId,notes,tool,provider,stageId,planHash,scopeHash,readinessSnapshotId,module,route,modelExposed,model`, matching the capture and selected method. Generic capability, acknowledgement, instruction mode or direct completion cannot bypass this gate. A quote valid at captured start can expire before matching completion. Existing full media review and delivery checks still apply.

Status reports `pipelineReady` (feasibility), per-stage exact pending reasons/outcomes, `currentStageReady`, `canStartStage` and active capture identity without writing or querying a provider. Future exact slots can remain pending while candidates can start. Explicit silent scope may make voice not-required; compatible historical absent vocal fields can support an explicitly selected static/silent piece without changing the character. Speaking reuse binds selected approved audio as exact input/outcome and attaches that audio to speaking execution. It never bypasses current complete-canon vocal selection.

Same-plan observation/quote/grant refresh appends immutable snapshots; imported JSON itself is not a tracked mutable input. Already bound input/model/destination or plan/method changes use `run-resume` with `newAttempt:true` and a reason, optionally a fresh `readinessPlanPath`. New attempts clear current readiness evidence and capture, preserve old attempts and retain the saved task contracts. Unresolved original jobs block refresh and retry; matching `resolve` remains usable despite drift. Captured generation `0.1.0`/`0.2.0` remains legacy with original semantics and no new defaults; a fresh current run adopts the new policy. Local consistency proves neither provider execution nor listening, lip-sync, media quality or host parity. Private observations/quotes/grants stay outside framework export.

The nested objects use these exact keys. Missing/null observations remain pending; malformed supplied objects are refused. Omission/reuse requires an explicit applicable decision and reason. Required execution stages cannot be reused or removed. `inputs` follow plan slot order, with exact reference role/order; `fromStageId` names an earlier stage and its actual output bytes. Optional training belongs in the selected method only when justified.

| Object | Exact fields |
| --- | --- |
| Plan | `schemaVersion,methodSource,choice,requirements,stages` |
| Method source | `path,sha256` |
| Requirement | `id,applicability,reason,decision,stageIds`; applicability `required|reuse|not-required` |
| Plan stage | `id,stepId,purpose,medium,provider,method,module,route,tool,requestedModel,inputSlots` |
| Input slot | `id,kind,role,order,fromStageId`; kind `prompt|parameters|reference`; non-reference role/order null |
| Feasibility | `stages,authorization` |
| Feasibility stage | `stageId,access,acceptedInputSlots,destination,model,quote,export,inspection,limitations,provenance` |
| Access / accepted slot | `available,provenance` / `slotId,supported,provenance` |
| Destination value / quote unit | `accountFingerprint,workspaceId` / `kind,code` (credits provider token, uppercase currency code, or free with null code) |
| Execution observation | `stageId,inputs,acceptedInputs,model,destination,quote,authorization,export,inspection,limitations,outcome,provenance` |
| Exact input | `slotId,path,sha256,bytes,referenceId,role,order`; non-reference referenceId/role/order null |
| Accepted input | `slotId,sha256,bytes,inputId,scopeHash,provenance` |
| Export / inspection | `available,tool,route,format,originalBytes,limitations,provenance` / `available,tool,method,limitations,provenance` |
| Grant limit | `unit,maximum`; `acceptUnknownCost` is an explicit list of stage IDs, never a blanket boolean |
| Optional outcome | `status,files,evidence,review`; completed/reused with actual existing `{path,sha256,bytes}` files |
| Outcome evidence / review | `type,performed,provenance` / `performed,method,decision,criticalIssues,limitations,provenance` |

Outcome evidence is generated/reused and performed true. Its full-medium review is approve with no critical issues/limitations. Support before execution does not declare this finished review. Model/destination `exposed:false` requires null value and an actual non-exposure reason. Unknown quotes require null amount and reason; known zero/free still needs an actual quote source/date. Quote hashes and authorized stage IDs are unique exact sets.

A completed/reused auxiliary outcome with no actual quote keeps continuation pending; its earlier feasibility estimate cannot substitute for that missing actual cost. An explicit append may bind the first actual known quote or an actual unknown-cost declaration with scoped pilot acceptance. Once bound to the completed outcome, that quote is immutable; later observations cannot replace it with a cheaper estimate.

`readinessHash` computes SHA-256 of recursively key-sorted JSON (`H`). `binding` projects exposure to `{exposed,value}`. `mediaReadinessHashes(run,plan,stageId,observation,phase)` exports the computed offline hashes for preparation; no caller-supplied plan hash replaces validation:

```text
planHash = H(plan)
feasibilityScopeHash = H({policy,runId,attemptId,planHash,stageId,
  phase:"feasibility",model:binding(model),destination:binding(destination)})
stageScopeHash = H({policy,runId,attemptId,planHash,stageId,
  phase:"execution",canonBinding,currentStage:planStage,
  model:binding(model),destination:binding(destination),inputs:orderedExactInputs})
pilotScopeHash = H({policy,runId,attemptId,planHash,phase:"pilot"})
quoteHash = H(validatedQuote)
```

Feasibility quotes bind feasibilityScopeHash; execution quotes, accepted inputs and stage grants bind stageScopeHash. The pilot grant binds pilotScopeHash and every required feasibility quote/stage; the stage grant binds the exact current quote/stage. Canon approval can change a future pilot's scope, so bind its real inputs/context after that decision without replacing completed-stage evidence. These are local consistency hashes, not signatures.
