# OLYMPOX core 0.2 — conversation and operation

The studio has nine profiles, fifteen task contracts, and three persistent workflows. Atena organizes requests and calls the necessary specialty. You can converse normally; commands preserve work between sessions. The [operations](operations.md) guide covers identity and media review; [framework/README](../framework/README.md) describes the APIs and declarations for each stage.

## Recommended first cycle

1. When direction requires research, Gaia investigates up to three opportunities for a market/channel, with sources, assumptions, competitors, and reasons to discard a direction. With an already defined objective, research can be omitted with a reason.
2. Atena recommends an opportunity and turns the selection into a brief. Psiquê defines value, personality, and boundaries; Íris directs visual candidates.
3. You choose visual identity from real files. If speech is planned, generate, listen to and select the exact vocal sample before complete canon approval. Approval fixes complete references/settings and hashes. Preserve the approved canon with `canon-snapshot` before evolving identity; approval alone does not create a snapshot.
4. Saraswati prepares content consistent with the character; Aurora researches trends when needed. Selene prepares and executes production with available tools; Têmis inspects the complete result.
5. Atena delivers the reviewed piece. Fortuna prepares distribution and results collection when publication is authorized.

The pilot precedes batches. Sources and actual performance guide improvement; the number of characters, number of agents, and a promise of virality do not demonstrate quality.

## Owners and persistent state

The registry in `framework/registry.json` connects profiles, tasks, and workflows. Workflow IDs: `create-character`, `produce-piece`, `review-correct`. The first can start without a character; the other two require approved canon. Historical workflow IDs remain compatible without rewriting earlier runs.

Create a JSON specification file inside the project, such as `tmp/first-cycle.json`:

```json
{
  "personaId": null,
  "objective": "Research three opportunities and recommend an original direction for the first pilot",
  "inputs": [],
  "medium": "video",
  "capabilities": [],
  "mediaProviders": { "image": "higgsfield", "video": "higgsfield", "audio": "higgsfield" }
}
```

```powershell
node scripts/studio.mjs run-start create-character tmp/first-cycle.json
node scripts/studio.mjs run-status RETURNED_RUN_ID
```

The package returns the next task, owner, deliverable, criteria, observed context, and outstanding issues. Inputs/outputs use root-relative paths with `/`. Files from another persona and paths outside the project are rejected. The record stays in `work/runs/`; it neither dispatches an agent nor queries services. The conversational coordinator performs work through actual tools and records real events. Actual delegations must identify the event and dispatched agent.

`run-step RUN_ID transition.json` applies a declared transition. To start the local stage, the minimum JSON is `{"action":"start"}`. Completion requires existing files and appropriate evidence: a prepared document, generated media, inspected media, or completed delivery. Complete types and fields are in [framework/README](../framework/README.md). Record the actor, date, event, and notes about what actually happened. Do not fill in hypothetical names and dates as execution evidence.

Once the persona exists, the `bind-persona` transition links its slug. Optional stages can be skipped with a reason; inspection and canon approval cannot be skipped. The approval gate records an actual explicit decision and requires a match with approval already recorded in the persona; it does not approve identity by itself.

New `create-character` runs default to `medium: video`, matching the representative audiovisual pilot; an explicit image-only scope can use `medium: image`. Identity candidate generation/review still uses image capabilities in new provider-aware runs, while the pilot uses its selected medium. New runs record `mediaProviders` for `image`, `video` and `audio`; omitted stages default to `higgsfield`. Generation needs both the generic capability, such as `image-generation`, and the selected provider capability, such as `higgsfield:image-generation`. Generated completion evidence and external job intent record the matching `provider`. Generic integrated-image availability alone cannot advance a Higgsfield generation stage. Inspection capabilities remain generic because inspection uses actual available tools. These declarations do not install tools, submit media or prove execution; missing requirements leave the task `awaiting-tool`.

An explicit alternative records its actual provider in `mediaProviders` and saves the user’s method decision and affected stages in the production plan. Changing the provider map of an existing run requires `run-resume` with `newAttempt: true`, a reason and the updated `mediaProviders`; ordinary `run-step` cannot change it. A provider policy does not prove a required Builder/Soul Cinema module was used; retain exact operation/model/inputs in provenance and inspect actual results. Runs saved before provider policy existed retain their historical capability semantics and stored medium without rewriting bytes or approvals. They are not evidence of the new default. Changed observed context still requires the existing explicit new-attempt procedure.

## Interruptions and resumption

```powershell
node scripts/studio.mjs run-resume RUN_ID
```

Inputs, completed outputs, and governance files have observed hashes. A change requires context review. A new attempt needs JSON with `newAttempt: true` and a reason; it restarts the workflow while preserving the previous attempt and does not silently reuse approvals.

Before submitting external work, the `start` transition can record `job` with the provider and available identifier, preserving intent before submission. Every recorded job starts unresolved and needs `resolve` with actual reconciliation evidence before local completion, including ordinary success and definitive no-submission responses. Use `succeeded`, `failed`, or `not-submitted` as the reconciled status. If the process is interrupted without a conclusive response, resumption treats the work as an uncertain result and blocks repetition. Query the provider and record `resolve` with reconciliation evidence. Resolving the job does not complete the stage; its local files and evidence are still required. The runtime does not discover calls made without that prior record.

Locks reject concurrent writes. An interruption can leave a lock or temporary folder: check processes and preserve data before cleanup. There is no automatic expiration that could trigger paid work again.

## Identity and generation execution

`persona.json` preserves current state. `canon-snapshot` preserves an approved version and copies of reference files. Persona validation, workflow start, binding, task acceptance, and a new attempt check the current approved canon against any existing frozen snapshot for the same `identityVersion`. Status and ordinary resumption report conflicts with a bound canon as drift and block continuation; an uncertain external job can still be reconciled without accepting that canon. Replacing an approval hash cannot make a different identity valid under that version. Identity evolution requires a new `identityVersion` and explicit approval; old productions stay linked to their snapshot. These checks never create a missing snapshot. `migrate-assets` preserves legacy records without inventing historical snapshots or reviews that never occurred.

After generation, file registration, and completion of provenance, `execution-seal` preserves the prompt and declared context. A new production record requires review linked to that seal, media, and canon. This detects subsequent changes to the declared provider/model, references, cost, and other parameters. The seal is a local record; it does not prove execution or inspection occurred.

## Narrative and pieces

Copy `templates/narrative.json` and `templates/content.json` into character working files. Fill `characterId` with the slug and give the piece its own `id`. Save with:

```powershell
node scripts/studio.mjs narrative-save my-persona influencers/my-persona/prompts/narrative-v1.json
node scripts/studio.mjs narrative-show my-persona
node scripts/studio.mjs content-save my-persona influencers/my-persona/prompts/piece-v1.json
```

Every save creates another version; it does not overwrite earlier snapshots. Narrative describes desire, values, contradiction, habits, boundaries, and written voice. Editorial changes do not automatically redefine the face or canonical voice. To approve narrative, the input file uses `data` for narrative fields and `review` with decision `approve`, the responsible person, date, and notes about the actual event. Without an explicit decision, saving produces a draft, even if an approval was copied from another version.

Pieces maintain scripts, captions, shots, sources, factual claims, canon/narrative references, linked assets, and audio. `ready-for-production` requires approved context, shot hashes, explicit review, and defined virtual/commercial disclosure. It does not mean media has been generated or published. Factual claims need consulted sources; validation checks links, not the truth of claims.

A proposed song is not automatically usable. When `useInProduction` is true, a ready piece requires consulted evidence of availability and eligibility for its platform, region, account type, and use. Recording an alternative avoids dependency on pending audio. Research must be repeated when the usage window changes.

## Preservation and verification limitations

`backup` inventories the entire persona folder and linked task records. `backup-verify` checks bytes and structure. `backup-test` restores into a temporary copy without touching the current persona. `restore` rejects an existing destination and tasks with differing versions. Shared framework files, tools, and inputs outside the persona need separate preservation; resumption checks current context.

```powershell
npm.cmd run verify
```

Tests check paths, history, states, integrity, and local commands. They do not inspect pixels, listen to audio, watch videos, or authenticate a human declaration. Each studio needs an inspected pilot to demonstrate visual consistency, motion, voice, and useful content with real tools.
