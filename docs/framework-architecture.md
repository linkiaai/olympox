# OLYMPOX — architecture 0.2

Version **0.2.0**. Local core implemented; each studio chooses its own influencers, approves canon, and demonstrates consistency through an inspected pilot.

## Adopted direction

OLYMPOX is a local AI influencer framework, operated by Codex and dedicated to original virtual influencers, production, and learning. Its organization into specialists, tasks, workflows, and completion criteria was inspired by AIOX. The nine agents have goddess names and female profiles; their role IDs remain stable. The implementation uses Node and local files, with no external operational dependencies.

Codex interprets the request, loads the next task's package, uses available capabilities, and records work that occurred. The core maintains contracts, context, and state; it does not dispatch agents, generate media, query providers, or publish. Profiles are not permanent workers. Delegation exists only when a real subagent is used.

AIOX documentation describes squads composed of agents, tasks, and workflows. A formal squad requires a project initialized with AIOX core. This organization does not represent installation, certification, or compatibility with that ecosystem. Initial review references: [squad guide](https://github.com/SynkraAI/aiox-core/blob/main/docs/guides/squads-guide.md) and [overview](https://github.com/SynkraAI/aiox-core/blob/main/docs/guides/squads-overview.md).

## What is implemented

| Area | Local core 0.2 | Current limitation |
| --- | --- | --- |
| Direction | Constitution, skill, nine profiles, and task contracts | Profiles guide Codex; they do not execute independently |
| Identity | Approved canon snapshots, version/hash, and preserved reference bytes | Approval and inspection must have occurred; missing historical data is not reconstructed |
| Editorial | Versioned narrative and pieces, chronology, written voice, sources, and context links | Campaign is an optional ID; there is no complete campaign management |
| Coordination | Three workflows, owners, inputs, outputs, and persisted state | External tool submission happens outside the runtime |
| Production | Sealed generation context and review linked to applicable hashes | A record proves neither provider execution nor audiovisual fidelity |
| Recovery | Preserved attempts, detected changes, and uncertain-result blocking | Reconciliation requires real querying; there is no automatic retry |
| Continuity | Transactional creation, inventoried backup, and restoration without overwrites | Shared context outside the persona is not copied |
| Results | Documented experiment, cost, and metrics method | Publication and analytics have no installed integration |

Earlier fixes remain in place: the exact prompt is linked to review, duplicate files through equivalent paths are rejected, references match the media type, known costs are valid, and persona, reference, asset, and task states are separate. The core adds historical preservation and recovery without deleting earlier records.

## Layers and storage

1. **Knowledge and direction:** constitution, skill, guides, profiles, and contracts loaded according to the task.
2. **Verifiable local state:** canons, narratives, pieces, sealed executions, reviews, tasks, and backups.
3. **Session execution:** Codex uses tools actually available and records outputs and limitations. External adapters require their own need and validation.

```text
framework/
  registry.json
  roles/                       # Specialist instructions and boundaries
  tasks/                       # Contracts and completion criteria
  workflows/                   # Create, produce, review/correct
influencers/<slug>/
  persona.json                 # Working record and current identity
  assets.json                  # Asset manifest and reviews
  canon/v000001/               # Approved snapshot and reference copies
  narrative/v000001.json       # Story and editorial language
  content/<id>/v000001.json     # Content pieces and context links
  executions/<hash>/           # Generation context and copied prompt
  references/, media/, prompts/, exports/
work/runs/run-<UUID>.json       # State, attempts, and next task
backups/<slug>/<backup-id>/     # Inventory, character, and linked runs
```

History folders are populated when their records are created. Creating the character record does not approve narrative or identity and does not produce media. See [core contracts](../framework/README.md), [operations](operations.md), and the [framework 0.2 guide](framework-02.md).

## Team and workflows

**Atena** coordinates and consolidates decisions. **Gaia** researches opportunities; **Psiquê** develops persona/narrative; **Íris** directs identity and scenes; **Aurora** researches trends and proposes concepts; **Saraswati** writes the piece; **Selene** prepares and executes production; **Têmis** inspects quality; **Fortuna** learns from first-party data and formulates commercial hypotheses. IDs, deliverables, and boundaries are in the [studio team](studio-team.md).

The three registered workflows are:

- `create-character`: optional research → proposal → direction decision when needed → candidate planning, generation, and review → canon decision → pilot planning, generation, review, and delivery.
- `produce-piece`: optional research → script → direction → generation → review → optional distribution planning → delivery.
- `review-correct`: correction plan → new generation → review → delivery of reviewed bytes.

Gaia and Aurora follow [trend research](trend-research.md), with scope, dated sources, a window, and gaps. No continuous trend radar is installed. Optional stages can be omitted with a reason when the workflow permits; generation, review, delivery, and required canon decisions cannot be skipped.

Each package identifies the character when applicable, owner, contract, inputs/hashes, deliverables, and prerequisites. Pieces can identify canon/narrative snapshots and serve as exact run inputs; the runtime does not automatically create these editorial records. Atena retains user choices and authorizations and preserves important disagreements. All exercise independent judgment.

## Resumption and evidence

Runs use these states: `planned`, `in-progress`, `awaiting-input`, `awaiting-tool`, `uncertain-result`, `in-review`, `completed`, `failed`, and `cancelled`. Historical state values remain readable for compatibility. Changes to inputs, completed outputs, canon, or governance require a new attempt and a reason to resume. The workflow restarts, preserving the previous attempt without silently reusing its approvals.

Before external submission, persist intent and known identifiers. Resuming an unresolved job enters `uncertain-result`, including after interruption before recording the response. Codex queries the provider with a real tool and records reconciliation before completing or trying again. The runtime neither queries nor resubmits jobs; without recorded intent, it cannot discover calls made outside it. Interruption neither demonstrates failure nor authorizes another charge.

Completion of non-decision tasks requires existing files, hashes, and an evidence declaration appropriate to the stage. Human decision gates instead require explicit `approval`; they can have zero outputs when their contract permits and do not require the normal `evidence` object. Review identifies media bytes, method, and decision, with no outstanding critical failures or limitations. Delivery accepts reviewed bytes; an altered export needs another review. A reviewer name, file extension, and recorded declaration do not prove humanity, pixels, listening, or real execution. Codex must connect declarations to actual events. `completed` means local contracts are fulfilled; publication remains a separate action.

## Canon, editorial work, and execution

Snapshots are created only for approved canon, through an explicit command or a registration, sealing, or migration operation that requires that context. Approving the record alone does not create a snapshot. The same version cannot accept a different hash: identity evolution requires a new version and decision. An old asset can be validated against historical canon; reuse requires assessing current identity and use. Migration preserves legacy records but does not invent execution or recover missing files/approvals.

Narrative maintains desire, values, contradiction, habits, boundaries, writing examples, and fictional chronology in its own versions. Saving without an explicit decision leaves a draft. Editorial evolution does not change the canon hash; changes to visual anchors or vocal voice follow the identity process.

A piece relates the character, canon/narrative versions and hashes, objective, pillar, message, script, caption, scenes, assets, and factual sources. Music eligibility is separate from popularity, with platform, region, account type, and use. `ready-for-production` requires approved context and recorded editorial review; it neither approves media nor publishes the piece. Earlier reviews remain preserved.

A sealed execution fixes the recorded generation context, canon, references, copied prompt, tool/model and exposed parameters, purpose, and known cost. Asset review is linked to that context and exact media. Narrative and script remain in editorial records and selected run inputs; do not assume they are automatically included in the generation snapshot. Unavailable data stays identified as unavailable.

## Preservation and limitations

Creation and restoration use a temporary area, lock, and publication by rename, without overwriting an existing character. Records use writer exclusion and preservation operations. After an interruption, check the process and contents before removing a lock.

Backup copies the character's files and empty folders, with a size/hash inventory and runs linked to its ID. It checks historical records and copied bytes; restoration rejects conflicts. Restore testing checks structure, integrity, and local validation without demonstrating reproduction or audiovisual fidelity.

Governance, framework, credentials, tools, and shared inputs outside the persona are excluded from this backup. Also preserve the project foundation and continuity dependencies. A restored character still needs that context to resume a run. A local copy on the same machine does not protect against device loss.

Hashes detect changes but are neither signatures nor authentication against someone able to edit and recalculate records. The core validates integrity and declarations; creative judgment, genuine approval, and final inspection remain operational responsibilities.

## Next evidence and evolution

Preservation, coordination, editorial continuity, and recovery are implemented locally. Run `npm.cmd run verify` after changes to check tests, validation, and diagnosis. Fixtures do not replace the first pilot.

The next milestone is **one persona**, with a chosen audience/direction, inspected references, and a small set of pieces. Check consistency between angles, expressions, objects, and speech/movement when applicable. Record failures, corrections, time, and known cost. Also exercise missing tools, changed inputs, character switching, and uncertain results. No average compensates for a critical failure.

After the pilot, structure actual publications and experiments with a hypothesis, variable, cohort, window, counts, denominators, source, and decision. Costs of rejected attempts count; different currencies and missing data are not treated as equivalent. Complete campaigns, portfolio comparison, analytics, adapters, a dashboard, and a database are introduced according to observed need.

An AIOX squad adapter remains a future possibility if demand for that ecosystem emerges. It must map contracts and validate a real project. Scale and automation depend on pilot evidence; the number of profiles does not demonstrate quality.
