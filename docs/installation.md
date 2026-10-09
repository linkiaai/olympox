# Install OLYMPOX

**OLYMPOX - AI Influencer framework** installs a reusable local studio for Codex, Claude Code, or both. Each user creates original influencers and keeps private records in that independent studio. The source repository is dedicated to framework development and maintenance. The package includes reusable sources and templates, with no real character records or credentials.

## Requirements

- Node **22 or later**, including npm and npx.
- Codex or Claude Code with access to the studio's files and the tools available in the actual session.
- Git when cloning the repository, and access to the chosen repository revision.
- Verified Higgsfield access for the default media workflow. Provider setup is separate from installation.

The local core has no external runtime dependencies. You do not need `npm install` to operate its records. The assistant coordinates discovery, concept, personality, narrative, scripts, planning and records. The [Higgsfield influencer method](higgsfield-influencer-method.md) performs default visual and audiovisual production through its verified stages. Assistant image generation is an explicit alternative, not a requirement for using OLYMPOX with Claude Code. Missing capabilities leave the relevant stage pending; they do not silently change the method. Paid generation requires applicable authorization.

Version **0.5.0** is available as [GitHub release `v0.5.0`](https://github.com/linkiaai/olympox/releases/tag/v0.5.0). Existing `v0.4.0` installations retain their historical workflow until explicitly upgraded.

## Guided setup

Run the published guided installer:

```sh
npx --yes github:linkiaai/olympox#v0.5.0 setup
```

From a reviewed framework checkout or extracted package, use `node bin/olympox.mjs setup`. `npx --yes` accepts the npm package prompt; it does not answer the OLYMPOX guide or authorize generation.

The guide uses Node's built-in terminal input with no added dependencies. It asks for presentation language (`en` or `pt-BR`), assistant (`codex`, `claude` or `both`) and an independent studio directory outside the source checkout. It then checks the source and destination and shows the actual installation plan before asking to proceed. The summary identifies the destination, selected assistant, language, merge mode and counts of files to copy or retain, plus the planned local checks and pending provider access. Choose cancellation or press Ctrl+C before installation to leave the destination untouched.

The installer checks the reviewed plan again immediately before writing. If planned source or destination files, or installation options changed since review, it refuses the stale plan without writing. Run setup again to refresh the plan and review the new summary before proceeding. Conflicts must be resolved explicitly; setup does not overwrite differing files or upgrade a customized studio automatically.

After installation, setup runs these installed Node scripts in order:

```sh
node scripts/docs.mjs build
node scripts/studio.mjs doctor
node scripts/studio.mjs validate
node scripts/docs.mjs check
```

It stops at the first failed check and retains the installed files for diagnosis. It reports the checks that actually ran and their outcomes, then provides the selected assistant's activation syntax and a first conversational prompt. These checks are smaller than the full test suite. Run `npm run verify` from the installed studio for complete local verification. Neither check establishes live skill discovery, Higgsfield connection, provider execution or media quality; Higgsfield access and the required media stages remain pending until checked in that assistant session.

You can supply choices in advance:

```sh
node bin/olympox.mjs setup ../my-studio --assistant both --locale pt-BR
```

`--locale` changes setup presentation only. It does not translate installed canonical skills, commands or records, choose the character's editorial language, or authenticate a provider. See [language policy](localization.md).

In a noninteractive terminal, setup requires `--yes`, an explicit directory and `--assistant`:

```sh
node bin/olympox.mjs setup ../my-studio --assistant claude --locale en --yes
```

`--yes` accepts the local installation plan and local checks. It does not authorize media generation, training or publication, bypass preflight, or imply `--merge`. Add `--merge` only when the destination requires it. Missing required noninteractive choices produce an error before installation.

With an interactive terminal, running `node bin/olympox.mjs` without a command, or `install` without an explicit `--assistant`, opens the same guide. In a noninteractive terminal, no arguments show help; direct `install` remains deterministic. Use the explicit low-level installer below for scripts.

## Direct installation

From the framework checkout or extracted package, choose an independent destination:

```sh
node bin/olympox.mjs install ../my-studio --assistant both
cd ../my-studio
npm run verify
npm run studio -- help
```

Direct `install` with an explicit `--assistant` runs without the guide. Its existing flags remain `install [directory] [--merge] [--assistant codex|claude|both]`; `--locale` and `--yes` belong to `setup`. The destination defaults to `.` when omitted. Fresh installation accepts an absent or empty directory; an existing `.git` directory can be retained. Other existing items require `--merge`. Use `npm.cmd` on Windows if PowerShell blocks the normal launcher.

| Selection | Active skills | Project instructions |
| --- | --- | --- |
| `--assistant codex` (default) | `.agents/skills/olympox` and `.agents/skills/higgsfield-studio` | Studio `AGENTS.md` |
| `--assistant claude` | `.claude/skills/olympox` and `.claude/skills/higgsfield-studio` | Studio `AGENTS.md` and a `CLAUDE.md` importing it |
| `--assistant both` | Both host projections | The same studio instructions plus the Claude bridge |

The Codex default preserves compatibility with existing installation commands. Assistant selection changes local instructions and skill discovery paths; it does not select a media provider. Both hosts receive the same canonical `SKILL.md` bytes. Codex additionally receives `agents/openai.yaml`; Claude Code does not need that host-specific metadata. Claude's project skill directory and the `@AGENTS.md` import follow [official skills documentation](https://code.claude.com/docs/en/skills) and [project instruction documentation](https://code.claude.com/docs/en/memory).

The installer writes creative instructions from `templates/studio-AGENTS.md`, and Claude's bridge from `templates/studio-CLAUDE.md` when selected. It never copies the development checkout's root `AGENTS.md` or `CLAUDE.md` into the studio. Installation does not install external plugins or provider binaries, authenticate accounts, generate media, or publish. `verify` builds the local manual and checks local behavior and integrity.

Open the installed studio in your selected assistant. In Codex, invoke `$olympox`; in Claude Code, invoke `/olympox`. A natural-language request can begin with:

```text
Help me create an original influencer for [audience/topic].
Propose three directions and recommend one before exploring identity.
Use the Higgsfield influencer workflow and verify its required stages first.
```

Reload or reopen the project if the host does not discover the skill. Claude Code can inspect loaded project instructions through its session controls. File installation and structural verification do not demonstrate live skill discovery. A Claude Code installation target does not automatically configure Claude web, Cowork, or another assistant environment.

## Connect Higgsfield in the chosen host

Follow [Higgsfield access](higgsfield-plugin.md) and [local CLI preparation](higgsfield-setup.md). Verify the actual route in each host: a Codex plugin connection does not establish the same connection in Claude Code. An available plugin/MCP or official CLI is an access route; it must expose the specific required module, upload/reference input, status query and export operations. Installing the skill does not connect the provider or demonstrate module parity.

Before promising the pilot, check account access, the requested stages and models, transport of local references, export of actual bytes, known prices and budget. The framework should perform supported file transfer itself, using verified tools. If the selected route cannot execute a required stage, report that exact gap and preserve the pending stage rather than silently substituting assistant images or a different provider.

```text
Atena, check Higgsfield access in this session and prepare the complete pilot.
Record its exact method, references, known cost and pending capabilities.
```

This selects preparation, not paid generation, training or publication. Apply existing authorization without requesting it again. Preserve canon, attempts, cost records and inspection on every connection route. Core installation and local records remain usable while media stages await provider access.

## Merge into an existing project

```sh
node bin/olympox.mjs install ../existing-project --merge --assistant both
```

Merge checks every intended destination for every selected host before any write. Identical framework files are retained and missing files are installed. Differing files or collisions stop the operation without overwriting them. Unrelated local files, existing Git metadata, and unselected host projections are preserved. The installer rejects unsafe paths, symbolic links and junctions in source and destination paths.

A customized `CLAUDE.md` or skill is a conflict just like another differing framework file. Reconcile it explicitly, or install into a separate empty studio and compare. `--merge` is not an automatic updater. Adding another host to an otherwise identical studio is possible with `--merge --assistant both`; existing modified framework sources still cause the full preflight to refuse writes.

## Upgrade an existing studio

The new default media method applies to new work after an explicit framework update. Existing approved identities and historical evidence are preserved without automatic migration. Read the [release notes](release-notes.md) and preserve the existing studio before comparing framework changes.

1. Create and verify backups of private characters and linked runs through [backup operations](operations.md). Keep an independent copy of framework files, shared context and local instructions too; character backups exclude that foundation.
2. Install the reviewed revision into an independent empty directory with the intended assistant target. Run `npm run verify` there and compare its reusable sources with the existing studio.
3. Explicitly reconcile the intended framework sources, active host skills, studio instructions, templates and documentation. Preserve customizations and keep each active skill copy consistent with its canonical source. `--merge` does not perform this reconciliation.
4. Keep character files, media, approvals, snapshots, runs and backups in place with their original bytes and hashes. Never rewrite historical bytes to fit new instructions or pass verification.
5. Run `npm run verify` in the updated studio and reopen the chosen host for discovery. If resumed run governance, inputs or media provider selection changes, use the existing explicit new-attempt procedure with a reason. See [core operation](framework-02.md).

The update does not authenticate providers or resolve outstanding external submissions. Reconcile uncertain work through its original job before a new attempt or tool change.

## Maintain active skill copies

The standalone skill installer supports the same assistant selection:

```sh
node scripts/install-skill.mjs olympox --assistant both
node scripts/install-skill.mjs higgsfield-studio --assistant both
```

It installs only registered canonical files after preflight across all selected hosts, retaining identical files and refusing conflicts. It does not create a Claude instruction bridge by itself; the full framework installer supplies that bridge. Changing the canonical skill requires deliberate reconciliation of differing active copies.

## Develop from a source checkout

```sh
git clone https://github.com/linkiaai/olympox.git
cd olympox
npm run verify
npm run studio -- help
```

Open the source checkout in Codex or Claude Code to maintain the framework under its root `AGENTS.md`; root `CLAUDE.md` imports those development instructions. Create an independent studio for real influencer work. Synthetic test fixtures demonstrate local behavior, not personal production.

## Package contents and verification

The export includes reusable governance, sources, profiles, contracts, workflows, templates, tests, guides, manual source, skills and permitted provider provenance. Character records, references, generated media, prompts, exports, runs, maintenance state, backups, provider installations, accounts, credentials, local assistant state and generated manual output stay in their private studio. Active skills are regenerated from `skills/`, never copied from an existing assistant directory.

From the studio root:

```sh
npm run verify
npm run studio -- doctor
npm run studio -- list
npm run docs:dev
```

`doctor` verifies Codex, Claude Code or both active projections and the Claude instruction import when applicable. It does not test host discovery, provider connection, generation, references actually attached or media quality. An empty character list is expected in a fresh studio. `docs:dev` serves the local manual and does not publish remotely. See [quick start](quick-start.md), [operations](operations.md) and [capabilities](studio-status.md).

OLYMPOX is distributed under the [MIT license](../LICENSE). Character content, external references and provider services retain their own applicable terms and rights.
