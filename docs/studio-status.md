# Capabilities and limits

OLYMPOX combines assistant instructions with a local Node runtime for original AI influencer studios. The framework supplies reusable methods and records; each installed studio supplies its own character choices, media, provider access, and execution evidence. See [installation](installation.md) and [quick start](quick-start.md).

## Included local capabilities

| Area | Included behavior | Evidence still needed in the studio |
| --- | --- | --- |
| Installation | Guided setup, Codex/Claude/both targets, full-file conflict preflight, and local checks | Live skill discovery in the selected assistant |
| Coordination | Nine profiles, fifteen task contracts, and three persistent workflows | Real execution and real subagent dispatch when reported |
| Character identity | Drafts, reference hashes, approval declarations, frozen canon snapshots | User selection, visual fidelity, vocal listening/selection when speaking |
| Production records | Shot/prompt generation, draft media registration, execution seals, linked reviews | Actual references submitted, actual generation, complete inspection |
| Editorial history | Versioned narrative and content, sources, canon/narrative links | Sound writing, factual verification, and applicable audio eligibility |
| Resumption | Context change detection, preserved attempts, unresolved-job blocking | Provider reconciliation through actual tools |
| Recovery | Character and linked-run inventory, verification, restore testing | Independent copies and separately preserved shared context |
| Documentation | English source, pt-BR edition, source-derived catalogs, local manual | Wording/translation review and any remote publication |
| Higgsfield route | Workflow guidance, local wrapper, and permitted source provenance | Account, exact modules, accepted inputs, export, inspection, and budget |

The workflows are `create-character`, `produce-piece`, and `review-correct`. Profiles guide the coordinating assistant; they are not persistent workers. Commands do not automatically dispatch specialists, generate media, query providers, retry paid work, publish, schedule research, or collect channel analytics.

## Assistant and provider support

The installer creates local project instructions and skill projections for Codex, Claude Code, or both. This is a supported file layout and locally tested installation path. It does not establish that a particular running assistant discovered the skill or that Claude web or another environment has been configured.

Higgsfield is the default media method for new work. Concepts, personality, narrative, scripts, and planning remain with the coordinating assistant. [Integrated image generation](integrated-images.md) is an explicit alternative for images. A missing Higgsfield stage remains pending until the required capability or an explicit method decision is available.

The [plugin route](higgsfield-plugin.md) and [local CLI route](higgsfield-setup.md) must be checked independently in the actual session. Available website features, a connected plugin, or a logged-in CLI do not establish access to every required module, voice, identity training, reference upload, export, or an equivalent billing balance. Check the [complete pilot path](production-handoff.md) before the first paid stage and apply the existing applicable authorization.

The reference method requires coherent selected visual identity, exact visual/vocal canon, listened-to voice for speech, inspected scene inputs, and one fully inspected pilot before batches. Actual final bytes must be exported and reviewed; publication has its own authorization and evidence. Tests cannot substitute for those production steps.

## What local verification checks

From the installed studio:

```sh
npm run verify
npm run studio -- help
```

`verify` builds the manual, runs local tests, validates available character/editorial records, runs `doctor`, and checks manual integrity. An empty studio can pass without any character or generated media. A draft can pass structural validation while still having unfinished fields reported as warnings.

| Result | What it establishes |
| --- | --- |
| Passing tests | Covered local behavior worked in that version/environment |
| Passing character validation | Structured records, reference/media hashes, and declared review links are consistent |
| Passing `doctor` | Required foundation, registered contracts, and installed skill projections are consistent |
| Passing documentation check | Selected sources and generated manual agree |
| Passing backup restore test | Inventoried records can be restored and validated locally |

None authenticates a named reviewer, inspects pixels, listens to audio, reviews motion, proves reference conditioning, or establishes publication. Hashes detect changes; someone with write access can edit and recalculate them. Test counts from an earlier release do not establish a current studio's health.

## When work remains pending

| Condition | Next action |
| --- | --- |
| Required generation/inspection capability missing | Keep the stage pending and verify the exact route/module |
| Reference transport or export unsupported | Resolve that stage before committing to the complete pilot |
| Canon/observed context changed | Review the change and use an explicit new attempt; preserve old history |
| External submission unresolved | Query/reconcile the original job before continuation or another attempt |
| Media has critical failure or incomplete inspection | Preserve the attempt, correct in a new version, then inspect again |
| Installer finds different framework files | Compare/reconcile explicitly; `--merge` does not overwrite |
| Historical data fails validation | Preserve originals and diagnose without rewriting approval evidence |

Follow [operations](operations.md) for files, media, and backups, and [runs and resumption](framework-02.md) for task state. A prepared package, a sealed execution, a completed run, and published content describe different outcomes; record only the outcome that actually occurred.
