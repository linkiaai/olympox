# Install OLYMPOX

**OLYMPOX - AI Influencer framework** installs a reusable local studio for Codex. Each user creates original influencers and keeps their private records in that independent studio. The source repository is dedicated to framework development and maintenance. The package includes framework sources and templates, with no real character records or credentials.

## Requirements

- Node **22 or later**, including npm and npx.
- Codex for conversational coordination and the tools available in your session.
- Git when cloning the repository. npm's GitHub package route may also require Git on your system.

The local core has no external runtime dependencies. You do not need `npm install` to operate its records. Media providers are optional and require their own preparation.

## Create a studio from GitHub

Run from the parent folder where you want the studio:

```sh
npx --yes github:linkiaai/olympox install ./my-studio
cd my-studio
npm run verify
npm run studio -- help
```

Use `npx.cmd` and `npm.cmd` on Windows if PowerShell blocks the normal launchers. The installation directory defaults to `.` when omitted. Fresh installation accepts an absent or empty directory; an existing `.git` directory can be retained. Other existing items require `--merge`.

The installer copies reusable framework files, writes the studio's `AGENTS.md` from `templates/studio-AGENTS.md`, and creates active local skills from their versioned sources. The development checkout's root instructions remain separate. Installation does not install provider binaries, authenticate accounts, generate media, or publish a site. `verify` builds the local manual and checks the installation's local behavior and integrity.

Open the installed studio folder in Codex. Invoke the skill in conversation:

```text
Use $olympox. Help me create an original influencer for [audience/topic].
Propose three directions and recommend one before exploring the identity.
```

If Codex does not show the new skill, reload Codex or reopen the project. File installation and automatic discovery are separate checks.

## Use an existing project

```sh
npx --yes github:linkiaai/olympox install ./existing-project --merge
```

Merge checks all intended destinations before any write. Identical framework files are retained and missing framework files are installed. Differing files or collisions stop the operation without overwriting them. Unrelated local files are preserved. The installer rejects symbolic links and junctions in installation source or destination paths.

If files conflict, review and reconcile them explicitly, or install into a separate empty studio and compare the two versions. `--merge` is not an automatic updater for modified framework sources or local instructions. Existing character records, approvals, hashes, and run history remain subject to their preservation rules.

## Develop from a source checkout

```sh
git clone https://github.com/linkiaai/olympox.git
cd olympox
npm run verify
npm run studio -- help
```

Open this checkout in Codex to develop and maintain the framework under its root `AGENTS.md`. Create an independent studio with the installation command for real influencer work. Synthetic fixtures in tests demonstrate local behavior; personal characters and production belong to that separate studio.

## What the package contains

| Included | Kept in each user's studio |
| --- | --- |
| Constitution and project instructions | Character records and approved identity |
| Framework profiles, contracts, and workflows | References, generated media, prompts, and exports |
| Local scripts and templates | Runs, maintenance state, and backups |
| English guides and secondary pt-BR translations | Provider installations, accounts, and credentials |
| Manual source and build tools | Generated manual and temporary local files |
| Versioned skills and permitted provider-source provenance | Files produced by your own creative work |

The installer creates `.agents/skills/olympox` and `.agents/skills/higgsfield-studio` from canonical sources. Installed creative instructions come from the studio template rather than the development root's `AGENTS.md`. Provider provenance and reading material do not authenticate accounts or install external binaries.

## Verify and start

From your studio root:

```sh
npm run verify
npm run studio -- doctor
npm run studio -- list
npm run docs:dev
```

An empty character list is expected in a new studio. Open the address printed by `docs:dev` to read the English manual or select Brazilian Portuguese. The manual is local; its development server does not publish it remotely. See [quick start](quick-start.md), [operations](operations.md), and [framework capabilities](studio-status.md).

OLYMPOX is distributed under the [MIT license](../LICENSE). Character content, external references, and provider services retain their own applicable terms and rights.

English is primary; [Brazilian Portuguese](locales/pt-BR/installation.md) is a secondary translation. See the [language policy](localization.md).
