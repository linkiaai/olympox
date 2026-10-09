# Character records, media, and recovery

Run these commands from an [independently installed studio](installation.md) using Node 22+. They maintain local records; the assistant performs generation and inspection through available tools. Personal creative production belongs in the studio, outside the framework development checkout.

## Create a draft

```sh
node scripts/studio.mjs new my-persona
node scripts/studio.mjs list
node scripts/studio.mjs validate my-persona
```

`new` stages a complete character folder before making it available and refuses an existing destination or concurrent creation. Fill in `brief.md` and `persona.json`, then record choices and chronology in `decisions.md`. Draft fields can remain pending; validation reports structural errors separately from unfinished draft fields.

| File or directory | Purpose |
| --- | --- |
| `persona.json` | Identity anchors, voice, editorial context, references, and canon approval |
| `brief.md`, `decisions.md` | Objective, assumptions, decisions, and chronology |
| `assets.json` | Media manifest, origin, hashes, and reviews |
| `references/candidates/`, `references/canon/` | Candidate and approved reference files |
| `media/candidates/`, `media/approved/`, `exports/` | Attempts, approved versions, and final deliverables |
| `prompts/` | Shot specifications and exact prompts |
| `canon/`, `executions/` | Frozen identity and execution context |
| `narrative/`, `content/` | Versioned editorial records |

These live under `influencers/my-persona/`. Paths inside persona, shot, manifest, and editorial records are relative to that character folder, with `/`. Run inputs/outputs instead use studio-root-relative paths. Paths that traverse `..` or escape the applicable folder are rejected. Copy permitted references into the character folder and retain their origin.

## References and canon approval

The assistant edits `persona.references`; there is no separate reference-registration or canon-approval CLI command. Each reference requires:

| Field | Value |
| --- | --- |
| `id`, `path` | Unique reference ID and actual character-relative file |
| `role` | `front`, `three-quarter`, `profile`, `full-body`, `expression`, or `voice` |
| `status` | `candidate`, `approved`, or `rejected` |
| `origin` | Actual tool/source context and applicable permission |
| `sha256` | Hash of the exact file |
| `review` | Approved references require actual `reviewer`, ISO timestamp `at`, and `notes` |

Calculate hashes with:

```sh
node scripts/studio.mjs file-hash my-persona references/canon/front-v1.png
node scripts/studio.mjs canon-hash my-persona
```

Visual selection belongs to the user and follows [quality inspection](quality.md). The structural canon minimum is an approved front view and approved three-quarter or profile view; production may need a broader coherent reference pack. A speaking character also needs a generated, listened-to, selected voice reference. Set `voice.referenceId` to that approved `voice` entry. A description alone does not establish voice.

After the actual complete-canon decision, write persona `approval` with `reviewer`, `at`, `notes`, and the returned `canonHash`; set status to `canon-approved`. The hash covers character ID, identity version, name/age, identity anchors, voice, and approved reference data. Editorial evolution does not automatically change that canon. Validate, then preserve it:

```sh
node scripts/studio.mjs validate my-persona
node scripts/studio.mjs canon-snapshot my-persona
```

Approval itself does not create the snapshot. `canon-snapshot` requires approved canon and preserves the persona plus reference copies. Registration of an asset under approved canon also creates/reuses that snapshot. Each `identityVersion` can have only one frozen canon. To change identity, preserve the old version, increment `identityVersion`, return to `draft`, inspect/select new references, and obtain new approval.

Validation and workflow operations compare approved current canon with any existing snapshot of the same version. Replacing an approval hash cannot legitimize a changed same-version identity. Missing historical snapshots are not reconstructed as evidence; an approved current record without a snapshot can still be structurally valid.

## Shot specification and exact prompt

Copy `templates/shot.json` into the character's `prompts/` and fill the intended framing, scene, medium, speech, and references. `purpose: reference` permits draft identity exploration; `purpose: production` requires approved canon. Video/audio define target duration; spoken production requires canonical voice. Silent video may use an empty script.

```sh
node scripts/studio.mjs prompt my-persona influencers/my-persona/prompts/shot-v1.json
```

The command returns text. Save it as UTF-8 with a writing tool; legacy PowerShell redirection can produce UTF-16. It includes identity and nonempty creative profile context, exact speech, and selected reference paths/hashes. Fictional background remains fictional context.

Empty `referenceIds` selects approved visual references for image/video or canonical voice for audio; spoken video also includes approved voice. Prefer an explicit relevant subset supported by the selected module. Actually attach those exact references during generation and record transfer evidence. Prompt text neither transfers files nor establishes supported API parameters. It does not select a provider or call a model. Follow the saved [production method](production.md).

## Record generation and seal its context

Save actual output bytes under a new filename, then register the file:

```sh
node scripts/studio.mjs register my-persona media/candidates/portrait-v1.png image
```

Types are `image`, `video`, and `audio`. Registration adds a `draft` asset with a UUID, file hash, identity version, and canon hash. It refuses a file already registered; edited outputs need a new version.

In `assets.json`, complete the real `provider`, `model`, `referenceIds`, `promptPath`, `promptSha256`, and `cost`. If the tool does not expose a model, record that honestly. For video set `hasSpeech: true` or `false`. Image/video require visual references; audio uses vocal references only; audio and spoken video require the approved canonical voice. Save the actual prompt and hash it with `file-hash`.

`cost: null` means unknown. A known cost uses `{ "amount": 1.25, "currency": "BRL" }`, with a nonnegative amount and a three-letter uppercase currency. Preserve currencies separately when totaling costs. Before paid generation, use [run submission intent and reconciliation](framework-02.md#external-submissions-and-uncertain-outcomes) and the applicable budget authorization.

```sh
node scripts/studio.mjs execution-seal my-persona ASSET_ID
```

Sealing requires approved canon matching the asset's recorded version/hash. It uses a valid historical snapshot or preserves the matching current approved canon as part of sealing. During draft identity exploration, keep candidate/reference bytes, hashes, prompts, origin and inspection records; unapproved identity cannot be sealed. Preserve earlier context rather than rewriting its hashes to force a seal.

Replace `ASSET_ID` with the registered UUID. The seal preserves declared generation context and the prompt, binds the canon, and records `executionPath`/`executionSha256`. It detects later changes to provider, references, prompt, cost, and other sealed fields. It does not prove that generation occurred or that the result was inspected.

## Review exact media and approve use

Inspect the complete asset against its references and intended use. Save its review in the manifest; there is no CLI that automatically inspects or promotes it. Required production review fields are:

| Field | Requirement |
| --- | --- |
| `reviewer`, `at`, `notes` | Actual reviewer, ISO timestamp, and inspection account |
| `method` | Image: `visual`; audio: `listening`; video: `visual-and-audio` |
| `decision` | `approve` for production; otherwise `correct`, `reject`, or `pending` |
| `mediaSha256`, `promptSha256` | Exact inspected media and executed prompt |
| `canonHash`, `identityVersion` | Canon used in that production |
| `executionSha256` | Matching execution seal for current v2 records |
| `criticalIssues`, `limitations` | Both empty before approval for production |

For a silent video, document absence of audio and inspect all motion. Missing listening/viewing access remains a limitation. Only after real approval, complete matching fields, and no critical issues or pending inspection, set asset status to `production` and check:

```sh
node scripts/studio.mjs check-assets my-persona
```

`production` means eligible reviewed media in the local manifest, not publication. Hash checks do not replace inspection or authenticate the reviewer. Cropping, captions, editing, or recompression create different bytes: save a new file, register it as draft, record context, and review the final export before delivery.

## Version narrative and content

Copy `templates/narrative.json` and `templates/content.json` into working files. Set `characterId` to the slug and give each content piece its own `id`.

```sh
node scripts/studio.mjs narrative-save my-persona influencers/my-persona/prompts/narrative-v1.json
node scripts/studio.mjs narrative-show my-persona
node scripts/studio.mjs content-save my-persona influencers/my-persona/prompts/piece-v1.json
```

Each save appends a version; old versions remain intact. For narrative approval, wrap narrative fields in `data` and supply `review` with actual `decision: approve`, `reviewer`, `at`, and `notes`. Without that separate decision, the saved narrative remains draft, including when copied input contained an old approval.

A piece links canon/narrative versions and hashes, scripts, shots, assets, consulted sources, factual claims, and disclosure. `ready-for-production` requires approved context, explicit editorial review, shot hashes, and defined virtual/commercial disclosure. It means editorial preparation, not generated or published media. Validators check source structure/links, not factual truth.

Music marked `useInProduction: true` needs consulted evidence of catalog availability and eligibility for platform, region, account type, and intended use before a ready piece can depend on it. Record a usable alternative while this is pending; reassess when the usage window changes.

## Backups and recovery

Private records and media are ignored by Git by default. Back up important cycles and keep an independent copy outside the working disk:

```sh
node scripts/studio.mjs backup my-persona
node scripts/studio.mjs backup-verify BACKUP_ID
node scripts/studio.mjs backup-test BACKUP_ID
```

Replace `BACKUP_ID` with the returned `my-persona/<timestamp-and-UUID>`. The backup is a local directory with a byte/directory inventory, the complete character folder, and linked run records. It includes empty folders, canon, seals, editorial versions, and media inside that folder. Backup refuses invalid records, pending operation files, active locks, or detected concurrent changes. Preserve an independent original copy before diagnosing invalid historical data.

`backup-verify` validates inventory and records. `backup-test` restores into a temporary copy, checks structure, then removes that copy without touching the current character. For actual recovery:

```sh
node scripts/studio.mjs restore BACKUP_ID
```

Restoration requires the original character destination to be absent. It retains identical linked runs, refuses differing ones, and does not overwrite existing characters. Shared governance, framework, tools, credentials, and inputs outside the character are excluded; preserve shared context separately. Restore testing demonstrates integrity, not reproducible provider generation or media quality.

## Legacy records and routine checks

`migrate-assets my-persona` explicitly adopts legacy manifests while preserving legacy production evidence. It freezes the approved current canon, not an invented historical identity. A legacy review does not acquire a current execution seal or a new inspection. New approval requires a draft v2 record with complete context and actual review. Do not rewrite old media, snapshots, approvals, or runs to satisfy current checks.

```sh
npm run verify
node scripts/studio.mjs doctor
```

Verification checks local tests, records, installed skill consistency, and manual integrity. Skills use `.agents/skills/` in Codex and `.claude/skills/` in Claude Code; maintain them through the [installation guide](installation.md#maintain-skills-and-provider-access). For workflow state and interrupted provider work, read [runs and resumption](framework-02.md).
