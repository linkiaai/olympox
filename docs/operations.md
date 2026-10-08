# OLYMPOX local operation and traceability

Install an independent studio with `npx --yes github:linkiaai/olympox install ./my-studio`, then open that folder in Codex. The [installation guide](installation.md) explains fresh setup, `--merge`, and framework development from a source checkout. The package contains reusable framework sources; each studio maintains its own character records and media separately from framework development.

Run commands from the studio root with Node 22+. `npm.cmd run verify` runs tests, validates existing characters, and checks the foundation. `npm.cmd run studio -- help` lists local operations. No local record command generates media, calls a provider, or publishes.

## Create and fill in records

```powershell
node scripts/studio.mjs new my-persona
node scripts/studio.mjs list
node scripts/studio.mjs validate my-persona
```

`new` prepares the record in a temporary folder and publishes only the complete folder. It rejects an existing destination or concurrent creation. A persona starts as `draft`; empty fields are warnings of outstanding work. `validate` fails on structural errors, missing/changed references, inconsistent approval records, or an approved canon that differs from its existing frozen snapshot. Complete `brief.md` and `persona.json` with real choices. Keep chronology, decisions, and results in `decisions.md`. There is no fictitiously approved initial persona.

| Character file/folder | Purpose |
| --- | --- |
| `persona.json` | Identity, voice, editorial information, references, and canon approval |
| `brief.md` | Objective, choices, and assumptions |
| `decisions.md` | Decisions, chronology, and results |
| `assets.json` | Manifest of generated files and their reviews |
| `references/candidates/` | Possible references |
| `references/canon/` | Approved identity files |
| `media/candidates/` | Production attempts |
| `media/approved/` | New approved final versions |
| `prompts/` | Shots and exact prompts used |
| `exports/` | Final deliverables that require review after editing |
| `canon/` | Approved identity snapshots and reference copies |
| `executions/` | Preserved context and prompt for each sealed execution |
| `narrative/` | Versions of personality, written voice, and narrative arc |
| `content/` | Versions of pieces, sources, audio, and context links |

All paths within the record/manifest are relative to the character folder, with `/`. References outside that folder or traversing `..` are rejected. Copy a permitted source into the character folder, preserving authorship/origin. The utility checks content using SHA256; it does not inspect pixels or audio.

## Register references and approve canon

After visual inspection and selection by the responsible person, register each file in `persona.references`:

```json
{
  "id": "face-front-v1",
  "path": "references/canon/front-v1.png",
  "role": "front",
  "status": "approved",
  "origin": "Tool and creation context; permission when an external source is involved",
  "sha256": "REPLACE_WITH_REAL_HASH",
  "review": {
    "reviewer": "The person who actually inspected the reference",
    "at": "2026-10-07T15:00:00-03:00",
    "notes": "Actual decision and observations"
  }
}
```

Roles: `front`, `three-quarter`, `profile`, `full-body`, `expression`, `voice`. Status: `candidate`, `approved`, `rejected`. Candidates/rejected references also need provenance and a hash, but not approval. Calculate the file hash:

```powershell
node scripts/studio.mjs file-hash my-persona references/canon/front-v1.png
node scripts/studio.mjs canon-hash my-persona
```

The structural canon minimum is an approved front view and another angle; this does not equal a sufficient pack for all production. Complete the required framing according to [production](production.md). After an explicit decision, record `approval` with `reviewer`, `at`, `notes`, and the real `canonHash`, and change status to `canon-approved`. The hash covers name/age, anchors, voice, approved references, and version. Editorial fields can evolve without redefining identity.

A change to an anchor or approved reference requires incrementing `identityVersion`, returning to `draft`, reviewing references, and recording new approval. Do not silently update hashes to hide an error. Voice uses `voice.referenceId` pointing to an approved `voice` reference; spoken production needs it. A voice description does not replace an inspected sample.

Before evolving an approved identity, preserve its snapshot:

```powershell
node scripts/studio.mjs canon-snapshot my-persona
```

Core 0.2 checks old assets against the snapshot of the version used, including reference copies. `register` also freezes approved canon. Each `identityVersion` accepts a single canon; changes require a new version and explicit approval. Persona validation, workflow start, binding, task acceptance, and a new attempt compare an approved current record with any existing frozen snapshot for that version. A changed identity cannot reuse the version by replacing its approval hash. Status and ordinary resumption report conflicts with a bound canon as drift and block continuation; reconciling an uncertain external job remains possible without accepting that canon. These checks do not create snapshots: an approved record without one can remain valid, while a missing historical snapshot is never invented to validate an old context. Preserve originals and reviews.

For core 0.1 manifests, use `migrate-assets my-persona` while the current canon is still approved. Migration freezes that canon and preserves legacy reviews without inventing new inspection. Legacy productions remain identified as such; the full seal applies only after returning the asset to draft, completing its context, and performing a new review.

Example dates/reviewers are not real evidence: replace them with the approval event that actually occurred.

## Assemble a piece specification

Copy `templates/shot.json` into `prompts/` and fill it in. `purpose: reference` allows exploration of an identity still in draft; `purpose: production` requires approved canon. For video/audio, define `script`, voice, and target duration. A video without speech can have an empty script. Empty `referenceIds` selects approved visual references for image/video and the approved canonical voice reference for audio. Spoken video also includes its approved voice reference. For control, explicitly select only references useful to the piece.

```powershell
node scripts/studio.mjs prompt my-persona influencers/my-persona/prompts/shot-v1.json
```

The output is text for review. Save it as UTF-8 using a writing tool; avoid legacy PowerShell redirection that can produce UTF-16. Actually attach references to generation in the indicated order. The specification is not an API, does not add parameters unsupported by the tool, and does not supply a seed automatically.

## Register and review the result

```powershell
node scripts/studio.mjs register my-persona media/candidates/portrait-v1.png image
node scripts/studio.mjs check-assets my-persona
```

Accepted types: `image`, `video`, `audio`. `register` records the hash and version as `draft`; nothing is promoted. Then complete `provider`, `model` (or an honest description when not exposed), `referenceIds`, `promptPath`, `promptSha256`, and known `cost`. Calculate the prompt hash with `file-hash`, using its path relative to the character folder. For video, specify `hasSpeech: true/false`; speech requires the approved vocal reference, audio uses only vocal references, and image/video require a visual reference. `cost: null` means unknown, never free. A known cost uses `{ "amount": 1.25, "currency": "BRL" }`, with a nonnegative value and a three-letter uppercase currency; do not mix currencies when totaling costs. Do not register the same version twice or overwrite it. A lock rejects concurrent writes; wait and retry. If interruption leaves `.assets.lock`, check that no process is active before removing it.

After completing the real context, seal execution using the ID returned in the manifest:

```powershell
node scripts/studio.mjs execution-seal my-persona ASSET_ID
```

The seal preserves the generation prompt and context, including the declared provider/model, references, cost, and additional fields. It neither calls a tool nor confirms generation occurred. If the model was not exposed, use an explicit description of that limitation instead of inventing a name. Changing a sealed draft's context requires a new seal; the previous seal remains in history. Approved productions cannot be silently sealed.

To promote a 0.2 record to `production`, inspect the final file and complete `review`:

```json
{
  "reviewer": "Actual reviewer",
  "at": "2026-10-07T15:00:00-03:00",
  "method": "visual",
  "decision": "approve",
  "mediaSha256": "REAL_HASH_OF_REVIEWED_FILE",
  "promptSha256": "REAL_HASH_OF_PROMPT_USED",
  "canonHash": "REAL_HASH_OF_CANON_USED",
  "identityVersion": 1,
  "executionSha256": "REAL_HASH_OF_EXECUTION_SEAL",
  "criticalIssues": [],
  "limitations": [],
  "notes": "Final use checked; identity and regions inspected"
}
```

Methods: image `visual`, video `visual-and-audio`, audio `listening`. For video without an audio track, record that fact in notes and inspect the complete motion. Possible decisions: `approve`, `correct`, `reject`, `pending`; only `approve`, without critical failures or pending inspections, allows `production`. If sound or motion access was missing, record the limitation and retain draft status. Review fixes the media hash, prompt hash, canon hash, version, and execution seal; replacing any file while retaining the earlier review is rejected. Also check that the prompt corresponds to real execution.

When editing, cropping, captioning, or recompressing, save a new version and register it again as a draft. The utility detects changed bytes in a registered file; it does not demonstrate that the declared review occurred or that content is faithful. Every final export needs its own review.

## Framework name and historical records

The framework's name is OLYMPOX, with the signature `OLYMPOX - AI Influencer framework`. Its source skill is `skills/olympox/`, its active local copy is `.agents/skills/olympox/`, and the conversational invocation is `$olympox`. Commands run from the project root regardless of that folder's label.

Historical character records, snapshots, approvals, execution seals, editorial versions, saved runs, and backups retain their original bytes, names, and hashes. Saved runs follow the existing [context review and resumption rules](framework-02.md) when observed governance has changed.

## Skill and backup

`node scripts/install-skill.mjs` installs `olympox` in `.agents/skills` without changing personal configuration; pass `higgsfield-studio` to select that skill instead. It validates and reads both source files, `SKILL.md` and `agents/openai.yaml`, and preflights both destinations and their parent paths before writing. Missing sources, links or junctions, invalid file/directory types, and differing installed bytes fail before changes. Identical files are retained; missing files are installed only after the complete preflight. Review a differing installation before replacing it. The folder may require write permission in the Codex session. `doctor` checks source/installation equality.

Character records, media, and tasks are ignored by Git by default. Use verifiable backup after an important cycle:

```powershell
node scripts/studio.mjs backup my-persona
node scripts/studio.mjs backup-verify BACKUP_ID
node scripts/studio.mjs backup-test BACKUP_ID
```

The returned ID has the form `character/name`. `restore BACKUP_ID` restores only when the original folder is absent; it does not overwrite characters or differing tasks. The test restores into a temporary copy and removes it. The archive includes the full persona folder and linked task records, with a byte and directory inventory. The constitution, framework, tools, and shared inputs outside the persona need separate preservation; resumption checks that context again. Keep another backup copy outside the working disk. A hash detects corruption but neither authenticates authorship nor proves media quality.

See [core 0.2](framework-02.md) for narrative, pieces, and coordination. Credentials do not belong in the project.

Historical records remain readable without rewriting their bytes or approvals. Character prose and voice keep their own editorial language.
