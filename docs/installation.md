# Install and update OLYMPOX

Install **OLYMPOX - AI Influencer framework** into an independent studio for Codex, Claude Code, or both. The development checkout maintains reusable sources; your studio holds its own characters, media, runs, and backups.

## Requirements and source selection

- **Node 22 or later**, with npm.
- **Codex or Claude Code** able to read and write the studio files.
- A reviewed framework checkout or extracted package. Git and repository access are needed when obtaining source through GitHub.

The local core has no external runtime dependencies; these commands need no `npm install`. Higgsfield access is prepared separately. You can install, plan characters, and maintain records before connecting a provider.

This guide describes **0.5.0**. Install the published tag with `npx --yes github:linkiaai/olympox#v0.5.0 setup`. Use the local commands below for a reviewed checkout or extracted package. A later local edit does not update the published tag or hosted manual. See [release notes](release-notes.md).

## Guided setup

From the framework checkout or extracted package:

```sh
node bin/olympox.mjs setup
```

The guide asks for presentation language (`en` or `pt-BR`), assistant (`codex`, `claude`, or `both`), and a studio directory outside the source checkout. It checks all selected source and destination files, then presents the resolved destination, options, copy/retain counts, and planned checks. Cancellation, EOF, or Ctrl+C before installation leaves the destination untouched.

To provide choices in advance:

```sh
node bin/olympox.mjs setup ../my-studio --assistant both --locale pt-BR
```

For a noninteractive terminal, supply an explicit directory, assistant, and `--yes`:

```sh
node bin/olympox.mjs setup ../my-studio --assistant claude --locale en --yes
```

`--yes` accepts local installation and verification. It does not imply `--merge` or authorize generation, training, or publication. When using npx, its `--yes` accepts npm's package prompt; OLYMPOX's `--yes` comes after `setup` and has a separate purpose. `--locale` changes setup presentation only; canonical installed instructions, skills, commands, and identifiers remain English.

The plan is checked again before writing. A changed planned source, destination, or option aborts installation; review a fresh plan before retrying. After installation, setup runs these installed scripts in order:

```sh
node scripts/docs.mjs build
node scripts/studio.mjs doctor
node scripts/studio.mjs validate
node scripts/docs.mjs check
```

It stops on the first failure and preserves installed files for diagnosis. This checks the manual, foundation, skills, and records, but does not run the complete test suite. From the installed studio, finish with `npm run verify`. On Windows, use `npm.cmd` or `npx.cmd` if PowerShell blocks the normal launcher.

## Direct installation

Use explicit assistant selection for predictable scripted installation:

```sh
node bin/olympox.mjs install ../my-studio --assistant both
cd ../my-studio
npm run verify
```

Syntax: `install [directory] [--merge] [--assistant codex|claude|both]`. Direct installation defaults to `codex` and directory `.`. Choose an independent destination explicitly. Fresh installation accepts an absent or empty directory, including allowed existing `.git` metadata; other contents require `--merge`. The low-level installer is `node scripts/install-framework.mjs` with the same options.

In an interactive terminal, no command or `install` without an explicit `--assistant` opens the guide. With no arguments in a noninteractive terminal, the entrypoint shows help. `--locale` and `--yes` belong to `setup`, not direct `install`.

| Assistant | Active skill directory | Project instructions | Invocation |
| --- | --- | --- | --- |
| `codex` | `.agents/skills/` | Creative `AGENTS.md` | `$olympox` |
| `claude` | `.claude/skills/` | Creative `AGENTS.md`, imported by `CLAUDE.md` | `/olympox` |
| `both` | Both directories | Both instruction entrypoints | Host-specific syntax above |

Both targets receive `olympox` and `higgsfield-studio` from the same canonical sources. Codex also receives `agents/openai.yaml` metadata. The installer writes studio instructions from `templates/studio-AGENTS.md` and, when selected, `templates/studio-CLAUDE.md`; it does not copy development instructions into the studio.

Open the installed directory in the selected assistant and invoke the skill. Reload or reopen the project if discovery is pending. A useful first request is:

```text
Atena, help me create an original influencer for [audience/topic].
Propose three directions and recommend one.
Check the complete Higgsfield pilot path, references, export and budget first.
```

Installed files and successful local checks do not establish live skill discovery. The Claude target configures local Claude Code project files, not Claude web or other environments.

## Merge into an existing project

```sh
node bin/olympox.mjs install ../existing-project --merge --assistant both
```

Merge preflights every intended file across all selected assistants before writing. It retains identical framework files, adds missing files, and refuses differences or file/directory collisions. Unrelated local files, allowed Git metadata, and unselected assistant projections are retained. Unsafe paths, links, and junctions in checked source/destination paths are rejected.

**`--merge` is not an automatic updater.** A customized instruction file or active skill is a conflict. Review and reconcile it explicitly. You can add another assistant to an otherwise identical installation with `--merge --assistant both`; differing framework files still block the entire preflight.

## Upgrade an existing studio

Read the [release notes](release-notes.md), then compare a clean installation of the intended revision with the existing studio.

1. Stop concurrent writes and preserve the current studio. Create, verify, and restore-test [character backups](operations.md#backups-and-recovery). Backups require structurally valid records; if validation fails, preserve an independent byte-for-byte copy before diagnosing, rather than changing history to pass. Separately preserve shared context, framework files, and custom instructions.
2. Install the reviewed revision into a separate empty directory with the intended assistant target. Run `npm run verify` there.
3. Compare and explicitly reconcile intended reusable sources, skills, templates, instructions, and guides. Preserve customizations and keep active skills consistent with their canonical sources. Check for concurrent changes again before writing.
4. Verify that private records, media, approvals, snapshots, runs, and backups retain their original bytes and hashes.
5. Run `npm run verify` in the updated studio and reopen the assistant. For a resumed run with changed observed inputs, canon, or governance, use [an explicit new attempt](framework-02.md#resume-work-and-review-context-changes). A changed provider also requires a new attempt and reason.

An upgrade neither migrates approved identities nor resolves provider jobs. Reconcile unresolved external submissions through their original provider before another attempt. Earlier attempts and their saved contracts remain preserved.

## Maintain skills and provider access

The standalone installer selects registered skills and assistant targets:

```sh
node scripts/install-skill.mjs olympox --assistant both
node scripts/install-skill.mjs higgsfield-studio --assistant both
```

It preflights all selected files, retains identical copies, and refuses differences. It does not create the Claude instruction bridge by itself. Review changed active copies as part of an explicit update; the installer does not overwrite them.

Connect Higgsfield in the actual assistant session using the [plugin route](higgsfield-plugin.md) or [local CLI route](higgsfield-setup.md). Check each required module, accepted references, submission/status operations, export, inspection, known cost, and applicable authorization. Access in one assistant does not establish access in another. Missing stages remain pending; an alternative method needs an explicit decision. Installation does not authenticate, install provider binaries, generate, train, or publish.

## Package boundary and local checks

Installation selects reusable governance, code, skills, profiles, contracts, workflows, templates, tests, guides, manual sources, and permitted provider provenance. It excludes private characters, generated media, runs, maintenance state, backups, credentials, provider installations, and generated manual output. Active skills are projected from `skills/`.

From the installed studio:

```sh
npm run studio -- help
npm run studio -- doctor
npm run studio -- list
npm run docs:dev
```

An empty character list is expected after fresh installation. `doctor` checks local foundation and skill consistency; the development server serves the manual locally. Neither operation proves provider execution, media fidelity, or publication. Continue with [quick start](quick-start.md), [operations](operations.md), and [capabilities](studio-status.md).
