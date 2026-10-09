# Workflows, runs, and resumption

OLYMPOX keeps a local record of an objective, its task sequence, owners, files, decisions, and attempts. Atena coordinates the work in Codex or Claude Code; the runtime returns the next task package for the assistant to execute with real tools. Conversation is the primary interface. Use the commands below when recording or resuming work.

## Choose a workflow

| Workflow ID | Starting context | Scope |
| --- | --- | --- |
| `create-character` | A direction to explore; `personaId` may be `null` | Opportunity, concept, candidates, canon decision, and first pilot |
| `produce-piece` | An existing character with approved canon | Prepare, generate, inspect, plan distribution when needed, and deliver a piece |
| `review-correct` | An existing character with approved canon | Plan a correction, generate a new version, inspect, and deliver |

The registry links nine specialist profiles and fifteen task contracts to these workflows. Read the [team](studio-team.md) for responsibilities, [operations](operations.md) for character/media records, and [runtime contract reference](../framework/README.md) for complete transition fields.

For a new character, select a distinctive concept, explore actual visual candidates, and let the user choose identity. A speaking character needs a generated, listened-to, selected vocal sample before complete visual/vocal canon approval. Preserve exact approved references, then prepare one representative pilot in the intended medium before batches. Video is the default and is needed to test planned speech, acting or motion. Research and distribution planning are optional where the saved workflow allows; generation, review, delivery, and canon approval cannot be skipped.

## Start and inspect a run

Save this specification as `tmp/first-cycle.json` inside the installed studio:

```json
{
  "personaId": null,
  "objective": "Explore three original concepts and prepare the first video pilot",
  "inputs": [],
  "medium": "video",
  "capabilities": [],
  "mediaProviders": {
    "image": "higgsfield",
    "video": "higgsfield",
    "audio": "higgsfield"
  }
}
```

```sh
node scripts/studio.mjs run-start create-character tmp/first-cycle.json
node scripts/studio.mjs run-status RUN_ID
```

Replace `RUN_ID` with the returned `run-<UUID>`. The response contains state, attempt ID, next task, responsible profile, criteria, observed context, drift, and missing capabilities. The record lives in `work/runs/`. Starting or reading it does not dispatch agents or submit media.

Run `inputs` and transition `outputs` are existing root-relative files with `/`. A bound run cannot use files from another character or files escaping the project. Observed inputs and completed outputs are hashed; use stable inputs rather than a draft persona file still being edited. Canon is bound separately.

## Record task progress

Save a transition JSON, then apply it:

```json
{ "action": "start" }
```

```sh
node scripts/studio.mjs run-step RUN_ID tmp/start.json
```

When the persona exists, bind it before tasks requiring it:

```json
{ "action": "bind-persona", "personaId": "my-persona" }
```

`complete` requires the task's existing outputs and actual execution evidence. Document tasks use `prepared`; generation uses `generated`; review uses `reviewed`; delivery uses `delivered`. Human decision gates use `approval` instead. The canon gate matches the already approved version/hash in `persona.json`; it does not write that approval for you. See the [field reference](../framework/README.md#completion-records).

Record real actors, timestamps, tool events, and files. Only record `execution.mode: delegated` when a subagent actually ran; loading a profile is instruction use.

## Declare media capabilities and method

New runs select Higgsfield for `image`, `video`, and `audio` unless the specification explicitly selects a provider for an affected medium. `integrated-images` is an explicit image alternative and is rejected for audio/video. Save the method decision and exact modules in the [production-method plan](../templates/production-method.md).

A generation stage needs its generic capability and provider capability, such as `image-generation` plus `higgsfield:image-generation`. Review needs `image-inspection`, `video-inspection`, or `audio-inspection`. Supply verified capabilities in the specification or a `start`/`complete` transition; missing ones leave the stage `awaiting-tool`. These are declarations, not tool discovery or connection tests.

New `create-character` runs default to a video pilot; candidate generation/review use image capabilities. Production/correction default to image, so specify `medium: video` or `audio` when needed. `nextTask.medium` identifies the current stage. A capability string alone cannot demonstrate Builder, Soul Cinema, voice, training, or another exact module's availability. Generated evidence and external intent must identify the selected provider.

Historical attempts without `mediaProviders` retain their saved capability and single-medium behavior. Existing identity, approval, media, and attempt bytes are not migrated.

## Resume work and review context changes

```sh
node scripts/studio.mjs run-resume RUN_ID
```

Ordinary resumption checks observed inputs, completed outputs, canon, and governance. Changed context requires review and an explicit new attempt. Save, for example, `tmp/resume.json`:

```json
{
  "newAttempt": true,
  "reason": "Reviewed the changed framework guidance before continuing"
}
```

```sh
node scripts/studio.mjs run-resume RUN_ID tmp/resume.json
```

A new attempt begins at the first saved workflow stage, observes current context, and preserves previous attempts and the run's saved contract. It does not load a replacement workflow contract, resubmit jobs, or reuse completed approvals. Start a separate run when the work needs the current workflow definition instead of the saved one.

Changing provider requires `newAttempt: true`, a reason, and the updated `mediaProviders`. Unspecified providers retain the previous attempt's choices; for a historical attempt without a provider map, current defaults are introduced. Ordinary `run-step` cannot change the map.

## External submissions and uncertain outcomes

Before calling a paid provider, use the generation stage's `start` transition with `job: {provider, jobId?, requestId?}` to persist intent. This creates a local unresolved `planned` job, not an external submission. Preserve identifiers when available.

Every recorded job needs a `resolve` transition with actual reconciliation evidence before task completion, including an ordinary successful response. Outcomes are `succeeded`, `failed`, or `not-submitted`; known provider/job/request identifiers must match. For an interruption or ambiguous response, query the real provider before deciding the outcome. `uncertain` records the problem; `run-resume` also holds an unresolved job in `uncertain-result`.

Unresolved work blocks continuation, cancellation, and new attempts. Resolution does not complete generation: local output files and generated evidence are still required. The runtime cannot discover calls made without recorded intent and does not automatically query, retry, or cancel provider work. Full fields are in [external job records](../framework/README.md#external-job-records).

## Integrity, preservation, and limits

Run locks reject concurrent writes. Check active processes before recovering an interrupted lock; preserve the record and temporary files before cleanup. There is no automatic paid retry.

Approved canon is checked against any existing snapshot for the same `identityVersion`. A changed identity cannot reuse that version by replacing its approval hash. Evolve identity through a new version and explicit approval; preserve historical snapshots. An uncertain job can still be reconciled when canon has drifted.

Use [backup operations](operations.md#backups-and-recovery) for characters and linked runs, and separately preserve shared framework context. `npm run verify` checks local structure and integrity. A workflow marked `completed` records accepted contracts and declarations; actual media inspection and publication need their own evidence. See [capabilities and limits](studio-status.md).
