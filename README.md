# OLYMPOX - AI Influencer framework

OLYMPOX helps you develop original AI influencers and carry their identity, story and production history from one session to the next. Codex or Claude Code coordinates the work through Atena and eight specialist profiles. Higgsfield is the default media pipeline.

The framework provides local skills, task contracts, resumable workflows, character records, canon snapshots, editorial versions and backups. It runs on **Node 22+**, with no external runtime dependencies.

## Set up an independent studio

Install the **0.6.0-rc.1** release candidate for testing:

```sh
npx --yes github:linkiaai/olympox#v0.6.0-rc.1 setup
```

From a reviewed checkout or extracted package, use `node bin/olympox.mjs setup`.

Choose Codex, Claude Code or both, then an independent destination. Setup summarizes the installation plan and copy/retain counts, installs the selected host instructions and skills, and checks the local studio. Open the destination in your assistant and invoke `$olympox` in Codex or `/olympox` in Claude Code.

For an unattended installation, provide all required choices:

```sh
node bin/olympox.mjs setup ../my-studio --assistant codex --yes
```

Use `--locale pt-BR` for Portuguese setup prompts. On Windows, use `npm.cmd` when PowerShell blocks the npm launcher.

See [installation](docs/installation.md) for source selection, merge conflicts and preserving an existing studio. Updating these guides locally does not change the already published package or hosted manual.

This repository is the framework development checkout, using AIOX for software engineering. AIOX tooling and dependencies are excluded from the product package. Create personal characters and media in the independently installed studio.

The candidate adds bounded local image transfer, explicit speaking/silent canon checks and media readiness per stage. Start with local preparation; actual host discovery and media production still need testing in your environment. Read the [release notes and testing instructions](docs/release-notes.md) for known limits and reporting a reproducible issue. The historical 0.5.0 release remains unchanged.

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
