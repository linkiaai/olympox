# OLYMPOX coordination core 0.2

The registry points to nine profiles, task contracts, and three workflows. Profiles are instructions for Codex. The `scripts/framework-core.mjs` module records packages and local state; it does not dispatch agents, generate media, query services, or publish.

Input and output paths are relative to the project root, with `/`. Files belonging to another character and paths that leave the root are rejected. State is stored in `work/runs/run-<UUID>.json`; a lock prevents simultaneous writers, and replacement uses a complete temporary file. Interruptions can leave a lock: check processes before removing it.

## API

- `validateFramework(root)` returns `valid`, errors, the registry, and resolved contracts.
- `startRun(root, {workflowId, personaId, objective, inputs, medium, capabilities})` creates a run and returns its package. `personaId` can be `null` at the start of `create-character`; use the `bind-persona` transition before references. Production/correction require approved canon.
- `readRun(root, runId)` returns state, the next task/owner, prerequisites, inputs/hashes, governance, and detected changes. It does not modify the record.
- `validateRunRecord(run)` checks the structure and hashes of historical JSON without relying on current files. It returns `true` or throws an error; backup inventories can use this API.
- `transitionRun(root, runId, options)` records `start`, `complete`, `skip`, `bind-persona`, `wait`, `uncertain`, `resolve`, `fail`, or `cancel`.
- `resumeRun(root, runId, {newAttempt, reason})` resumes the package. Changes to inputs/canon/governance require `newAttempt: true` and a reason. The new attempt starts from the workflow's first stage and preserves the previous attempt. It does not resubmit external work or consume prior approvals.

Capabilities are session declarations, such as `image-generation`, `image-inspection`, `video-generation`, and `video-inspection`. The shell does not prove that a tool is available. A missing required capability leaves the stage `awaiting-tool`. Profiles and packages carry limitations; this module has no external adapters.

The contract and entire record have hashes; the constitution, registry, profiles, and contracts have observed file hashes to detect drift. These hashes detect changes but are neither signatures nor authentication against someone with access who can recalculate them. Codex needs to read only the context of the next task; the hash list does not require loading all profiles into context.

## Completion declarations

For non-decision tasks, `complete` requires existing outputs, calculated hashes, and evidence with `type`, `performed: true`, `actor`, `at`, `eventId`, and `notes`. Types are `prepared` for a document, `generated` for generation, `reviewed` for review, and `delivered` for delivery. Generation also requires `tool` and an extension compatible with `medium`; an extension does not prove MIME type, pixels, or real execution. Human decision gates instead require the explicit `approval` described below and can have zero outputs when their contract permits; they do not require the normal `evidence` object.

Review also requires `reviewer`, `method` (`visual`, `listening`, or `visual-and-audio`), `decision: approve`, empty `criticalIssues` and `limitations` lists, and `media: [{path, sha256}]` matching the latest generation. The review output is a report. Delivery accepts only bytes already reviewed; an altered export needs another review.

A decision gate requires `approval: {explicit: true, decision: approve, reviewer, at, eventId, source, notes}`. The `approve-canon` task also requires the `canonHash` and `identityVersion` of the approved canon recorded in the persona. Naming a reviewer does not prove humanity, message authenticity, or inspection: the module validates and records declarations; Codex must connect them to the event that actually occurred. The module does not change persona approval.

`execution: {mode: delegated, agentId, eventId, actor, at}` records declared delegation. The module does not trigger it. The normal mode is `instruction`, in which Codex uses the appropriate profile. Do not present loaded profiles as dispatched agents.

## Resumption and uncertain results

Supplied inputs and outputs of completed stages become observed snapshots. Avoid including a persona record still being edited among immutable inputs; approved canon context is bound separately. During creation, the draft persona can evolve up to the gate; the decision fixes canon for the pilot.

Before an external submission, record intent with `start` and `job: {provider, jobId?, requestId?}`. The job state starts as `planned`; the module does not submit it. Any resumption of a job that is still unresolved becomes `uncertain-result`, including when the process was interrupted before recording its response. After real work, `resolve` records the reconciled outcome; only then complete the stage.

The `uncertain` transition accepts `job: {provider, jobId?, requestId?}` and a reason; it preserves known identifiers and blocks continuation, retry, or a new attempt. `resolve` requires status `succeeded`, `failed`, or `not-submitted`, matching IDs when known, and evidence `type: reconciled`. The provider query happens outside this module and must be real. Resolving a job does not complete generation: the file and stage evidence are still required. If no submission occurred, record the `not-submitted` reconciliation before a new attempt. Without the prior intent record, the runtime cannot discover a call made outside it.

Gaia/Aurora research and distribution planning are optional according to each workflow. `skip` requires a reason and cannot skip generation, review, delivery, or canon decisions. State `completed` means that local contracts have been fulfilled; it does not mean publication or quality proven by the runtime.

Canonical workflow and state tokens are English. Compatibility with legacy Brazilian Portuguese values preserves historical records instead of rewriting their bytes or approvals. See the [language policy](../docs/localization.md) and [Brazilian Portuguese translation](../docs/locales/pt-BR/framework/README.md).
