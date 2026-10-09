# OLYMPOX coordination core 0.2

The registry points to nine profiles, task contracts, and three workflows. Profiles guide the user's available coordinating assistant, such as Codex or Claude. Media generation defaults to verified Higgsfield tools, independently of the assistant's image capabilities. The `scripts/framework-core.mjs` module records packages and local state; it does not dispatch agents, generate media, query services, or publish. Assistant-neutral contracts do not demonstrate that a Claude session or any provider has been exercised.

Input and output paths are relative to the project root, with `/`. Files belonging to another character and paths that leave the root are rejected. State is stored in `work/runs/run-<UUID>.json`; a lock prevents simultaneous writers, and replacement uses a complete temporary file. Interruptions can leave a lock: check processes before removing it.

## API

- `validateFramework(root)` returns `valid`, errors, the registry, and resolved contracts.
- `startRun(root, {workflowId, personaId, objective, inputs, medium, capabilities, mediaProviders})` creates a run and returns its package. New `create-character` runs default to a `video` pilot; other workflows default to `image`. An explicit `medium` can select another scope. `personaId` can be `null` at the start of `create-character`; use the `bind-persona` transition before references. Production/correction require approved canon.
- `readRun(root, runId)` returns state, the next task/owner, prerequisites, inputs/hashes, governance, and detected changes. It does not modify the record.
- `validateRunRecord(run)` checks the structure and hashes of historical JSON without relying on current files. It returns `true` or throws an error; backup inventories can use this API.
- `transitionRun(root, runId, options)` records `start`, `complete`, `skip`, `bind-persona`, `wait`, `uncertain`, `resolve`, `fail`, or `cancel`.
- `resumeRun(root, runId, {newAttempt, reason, mediaProviders})` resumes the package. Changes to inputs/canon/governance or the selected media provider require `newAttempt: true` and a reason. The new attempt starts from the workflow's first stage and preserves the previous attempt. It does not resubmit external work or consume prior approvals.

New runs record `mediaProviders: {image: "higgsfield", video: "higgsfield", audio: "higgsfield"}` in their attempt by default. An explicit specification can select another provider per medium, for example `mediaProviders: {image: "integrated-images"}`; omitted media keep the Higgsfield default. `integrated-images` applies only to images. Changing a selected provider requires an explicit new attempt and a reason. The previous method, outputs, approvals, and events remain in the saved attempt. Historical attempts without this field retain their saved behavior; a new attempt adopts the current default unless another provider is selected.

Capabilities are session declarations, such as `image-generation`, `image-inspection`, `video-generation`, and `video-inspection`. For new runs, generation also requires the selected provider's declaration, such as `higgsfield:image-generation` or the explicit alternative `integrated-images:image-generation`. Generic image availability cannot silently replace a missing Higgsfield tool. The shell does not prove connection, module/model support, input transfer, budget, or export. A missing required capability leaves the stage `awaiting-tool`. Profiles and packages carry limitations; this module has no external adapters.

New character candidate generation/review use the `image` medium, while the pilot uses the run's selected `medium`, such as `video`. `nextTask.medium` reports that stage's medium. Historical attempts without the provider map keep their original single-medium interpretation. Stage planning must additionally verify the exact requested modules: Builder character sheets, Soul Cinema images, voice, identity training, and Seedance video are separate capabilities. A generic capability declaration cannot establish reference-method equivalence.

Persona validation with a character directory, workflow start, binding, task acceptance, and a new attempt compare an approved current canon with any existing frozen snapshot for its `identityVersion`, including its character ID and canon hash. A same-version identity change is rejected even if the approval hash was replaced. For a bound canon, `readRun` reports the conflict as drift and ordinary `resumeRun` blocks continuation; an uncertain external job can still be reconciled without accepting that canon. Use a new `identityVersion` and explicit approval for identity evolution. These checks do not create snapshots or invent missing historical context; an approved record without an existing snapshot can remain valid.

The contract and entire record have hashes; the constitution, registry, profiles, and contracts have observed file hashes to detect drift. These hashes detect changes but are neither signatures nor authentication against someone with access who can recalculate them. The coordinating assistant needs to read only the context of the next task; the hash list does not require loading all profiles into context.

## Completion declarations

For non-decision tasks, `complete` requires existing outputs, calculated hashes, and evidence with `type`, `performed: true`, `actor`, `at`, `eventId`, and `notes`. Types are `prepared` for a document, `generated` for generation, `reviewed` for review, and `delivered` for delivery. Generation also requires `tool` and an extension compatible with the stage's medium; new runs require `provider` matching the selected media provider. An extension or declared provider does not prove MIME type, pixels, or real execution. Human decision gates instead require the explicit `approval` described below and can have zero outputs when their contract permits; they do not require the normal `evidence` object.

Review also requires `reviewer`, `method` (`visual`, `listening`, or `visual-and-audio`), `decision: approve`, empty `criticalIssues` and `limitations` lists, and `media: [{path, sha256}]` matching the latest generation. The review output is a report. Delivery accepts only bytes already reviewed; an altered export needs another review.

A decision gate requires `approval: {explicit: true, decision: approve, reviewer, at, eventId, source, notes}`. The `approve-canon` task also requires the `canonHash` and `identityVersion` of the approved canon recorded in the persona. Naming a reviewer does not prove humanity, message authenticity, or inspection: the module validates and records declarations; the coordinating assistant must connect them to the event that actually occurred. The module does not change persona approval.

`execution: {mode: delegated, agentId, eventId, actor, at}` records declared delegation. The module does not trigger it. The normal mode is `instruction`, in which the coordinating assistant uses the appropriate profile. Do not present loaded profiles as dispatched agents.

## Resumption and uncertain results

Supplied inputs and outputs of completed stages become observed snapshots. Avoid including a persona record still being edited among immutable inputs; approved canon context is bound separately. During creation, the draft persona can evolve up to the gate; the decision fixes canon for the pilot.

Before an external submission, record intent with `start` and `job: {provider, jobId?, requestId?}`. For new runs, the provider must match the selected media provider for that stage. The job state starts as `planned`; the module does not submit it. Any resumption of a job that is still unresolved becomes `uncertain-result`, including when the process was interrupted before recording its response. After real work, `resolve` records the reconciled outcome; only then complete the stage.

The `uncertain` transition accepts `job: {provider, jobId?, requestId?}` and a reason; it preserves known identifiers and blocks continuation, retry, or a new attempt. `resolve` requires status `succeeded`, `failed`, or `not-submitted`, matching IDs when known, and evidence `type: reconciled`. The provider query happens outside this module and must be real. Resolving a job does not complete generation: the file and stage evidence are still required. If no submission occurred, record the `not-submitted` reconciliation before a new attempt. Without the prior intent record, the runtime cannot discover a call made outside it.

Gaia/Aurora research and distribution planning are optional according to each workflow. `skip` requires a reason and cannot skip generation, review, delivery, or canon decisions. State `completed` means that local contracts have been fulfilled; it does not mean publication or quality proven by the runtime.

Historical workflow and state values remain accepted without rewriting records or approvals.
