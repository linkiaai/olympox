# OLYMPOX - AI Influencer framework

OLYMPOX helps you develop original AI influencers and carry their identity, story and production history from one session to the next. Codex or Claude Code coordinates the work through Atena and eight specialist profiles. The person explicitly chooses Higgsfield or OpenRouter; neither is the default.

The framework provides local skills, task contracts, resumable workflows, character records, canon snapshots, editorial versions and backups. It runs on **Node 22+**, with no external runtime dependencies.

For explicitly selected video stages, the optional [OpenRouter route](docs/openrouter.md) supports Seedance 2.5 with exact local images and audio/video references through bound HTTPS URLs, one authorized submission, original-job reconciliation and MP4 export. HTTPS bytes are checked against the local references before submission; a provider pilot still needs visual and listening review for voice and identity continuity. There is no provider default or automatic fallback.

Stable version **0.7.0** adds explicit Higgsfield/OpenRouter selection and Seedance 2.5 video with bound audio/video references. Setup selects the assistant, provider and independent studio with no provider preselection. Assistant-integrated images remain an explicit image-stage choice. See [release notes](docs/release-notes.md).

## Set up an independent studio

Install stable version **0.7.0**:

```sh
npx --yes github:linkiaai/olympox#v0.7.0 setup
```

From a reviewed checkout or extracted package, use `node bin/olympox.mjs setup`.

Choose Codex, Claude Code or both, explicitly choose Higgsfield or OpenRouter, then select an independent destination. Setup summarizes the installation plan and copy/retain counts, installs the selected host instructions and skills, and checks the local studio. Open the destination in your assistant and invoke `$olympox` in Codex or `/olympox` in Claude Code.

For an unattended installation, provide all required choices:

```sh
node bin/olympox.mjs setup ../my-studio --assistant codex --provider openrouter --yes
```

Use `--locale pt-BR` for Portuguese setup prompts. On Windows, use `npm.cmd` when PowerShell blocks the npm launcher.

See [installation](docs/installation.md) for source selection, merge conflicts and preserving an existing studio. Updating these guides locally does not change the already published package or hosted manual.

This repository is the framework development checkout, using AIOX for software engineering. AIOX tooling and dependencies are excluded from the product package. Create personal characters and media in the independently installed studio.

The OpenRouter choice configures video only; image and standalone audio generation remain pending until a supported method is explicitly selected and verified. The local core remains usable offline. Start with local preparation; actual host discovery and media production still need testing in your environment. Read the [release notes and validation limits](docs/release-notes.md) for the local checks, the open intermittent Windows rename concern and reporting a reproducible issue. Historical release tags remain unchanged.

## Create your first character

In your studio, say:

> Use OLYMPOX to create an original influencer for [audience/topic]. Propose three distinct concepts and recommend one.

The assistant develops the concept, persona, narrative and scripts. The production sequence is visual exploration, selected references, a listened-to voice sample when the character speaks, approval of the exact canon, and one inspected pilot before batches. Check Higgsfield access, accepted references, export and the whole pilot budget before paid production. Assistant-integrated images are an explicit alternative.

Start with [the quick start](docs/quick-start.md), then follow [character development](docs/strategy.md) and [production](docs/production.md).

## Documentation

The [framework manual](docs/framework-manual.md) explains the product and routes you to the appropriate guide. To open the navigable manual locally:

```sh
npm run docs:dev
```

The manual includes English and Brazilian Portuguese, the team, workflow and contract catalogs, and command syntax drawn from CLI help. Read [manual maintenance](docs/living-documentation.md) for builds and exports.

## Verify and develop

From the framework or installed studio root:

```sh
npm run verify
node scripts/studio.mjs help
```

`verify` builds the manual and runs tests, record validation, structural diagnosis and documentation checks. These checks establish local consistency; provider access and media quality need their own execution and inspection.

Contributors follow [AGENTS.md](AGENTS.md), the [constitution](CONSTITUTION.md), [architecture](docs/framework-architecture.md) and [localization](docs/localization.md). Preserve unrelated work and private history. Installation copies reusable files; it does not authenticate providers, generate media or publish.

Released under the [MIT license](LICENSE).
