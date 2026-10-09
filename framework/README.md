# Runtime contract reference

`scripts/framework-core.mjs` implements local workflow records for OLYMPOX. The registry selects profiles, task contracts, and workflow definitions; a run saves those definitions with its observed context. The coordinating assistant performs the work and supplies declarations and existing files. The module has no agent dispatcher or provider adapter.

The framework package and registry use version **0.5.0**. Task/workflow JSON contracts retain component revision **0.2.0** and `schemaVersion: 1`; these are compatibility identifiers, not the current product release number. This reference describes the current implementation, including additive provider policy for new attempts.

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
