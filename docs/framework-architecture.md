# Framework architecture

OLYMPOX separates assistant direction, local records and external media execution. The current framework source is **0.5.0**; individual contracts and workflows retain their own component revisions, including `0.2.0`.

This guide describes the implementation boundary. Use [workflow operation](framework-02.md) for commands and [identity and records](operations.md) for file procedures.

## Three layers

| Layer | Sources and responsibilities |
| --- | --- |
| Assistant direction | Constitution, host instructions, skills, specialist profiles and guides tell the assistant how to organize work |
| Local core | Node scripts validate contracts, persist runs, preserve canon and editorial versions, seal reported execution context and manage backups |
| Session tools | Available assistant and provider tools perform research, delegation, media generation, transport, inspection and publication |

The core uses Node 22+ and local files with no external runtime dependencies. It returns the next task package to the coordinating assistant. The assistant executes the task with available tools and records the result; the core does not automatically dispatch agents or call providers.

## Reusable sources and private state

```text
framework/
  registry.json                 # Names, roles and registered paths
  roles/                        # Specialist instruction profiles
  tasks/                        # Completion contracts
  workflows/                    # Registered task sequences
skills/                         # Canonical skills
templates/                      # Scaffolding and studio instructions
scripts/                        # Local operations and validation
docs/, docs-site/               # Guides and manual sources

# Private state created in an installed studio:
influencers/<slug>/
  persona.json
  assets.json
  canon/v000001/
  narrative/v000001.json
  content/<id>/v000001.json
  executions/<hash>/
  references/, media/, prompts/, exports/
work/runs/run-<UUID>.json
backups/<backup-id>/
```

History folders appear when their records are created. Templates are starting structures; they do not establish an approved identity.

The installer uses explicit source selection. It writes the creative `AGENTS.md` from the studio template, adds `CLAUDE.md` for Claude Code, and projects canonical skills into the selected host's skill directory. Development instructions remain in this repository. Installation does not copy private records or connect provider accounts.

## Workflows and task contracts

The registry defines nine profiles, fifteen task contracts and three workflows:

| Workflow | Purpose |
| --- | --- |
| `create-character` | Explore a persona, select and review identity, approve canon, produce and deliver a pilot |
| `produce-piece` | Prepare content for an existing approved character, generate, review and deliver |
| `review-correct` | Plan a correction, produce a new version, review and deliver it |

Each contract defines its owner, prerequisites, output count, evidence type, capabilities and completion criteria. The generated catalogs show the actual registered definitions. Optional steps can be skipped with a reason when permitted.

A run binds inputs and applicable governance, captures the character context and stores attempts, results and events. Status reports the next owner, missing capabilities and detected changes.

## Media-provider policy

New attempts preserve a `mediaProviders` map for `image`, `video` and `audio`, defaulting to `higgsfield`. Generation requires both the medium capability and the provider-scoped capability. Recorded generation evidence and external intent must identify the selected provider.

New character runs default to a video pilot; candidate generation and review use image capabilities. An explicitly selected scope can use another medium. Changing the provider map requires a new attempt with a reason. Historical runs without the map keep their stored semantics.

These declarations constrain recorded completion. They do not authenticate, discover, price or execute provider tools. [Tools and capabilities](tools.md) explains the operational checks.

## Identity and editorial history

An approved canon version binds the persona's visual/vocal identity and exact reference bytes. When a frozen snapshot exists, identity operations reject a different canon under the same `identityVersion`. Evolving the identity requires a new version and approval.

Narrative and content have separate version histories. A narrative edit does not automatically change the identity. A content piece can link exact canon/narrative context; selected editorial files become explicit run inputs.

An execution seal preserves reported generation context and a copy of the prompt. Asset review binds the media bytes and applicable context. Changes to exported media require another review.

## Recovery and integrity

Runs detect changes to observed inputs, outputs, canon and governance. Continuation after changed context requires an explicit new attempt with a reason; previous attempts remain preserved. Rewriting this framework's guidance can therefore make an older run require context review.

Persist external intent before submission. An unresolved submission blocks continuation in `uncertain-result` until the assistant queries the real provider and records reconciliation. The core does not query or automatically resubmit jobs. Calls made without recorded intent cannot be discovered by the runtime.

Creation and restoration stage files and refuse to overwrite existing characters. Backups inventory character files, empty directories and linked runs. They exclude shared framework files, credentials, tools and inputs outside the character directory. Preserve those dependencies separately.

## Limits and extension points

Hashes establish byte consistency, not reviewer identity or creative fidelity. A completed contract represents accepted local evidence; it does not establish publication or successful real-world results.

Provider adapters, dashboards, campaign management, analytics integrations and databases are not included. Add them only for a concrete need with verified behavior, export boundaries and preservation. Consult [supported capabilities](studio-status.md) and [core interfaces](../framework/README.md) before extending the runtime.
