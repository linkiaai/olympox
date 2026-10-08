# Install OLYMPOX

**OLYMPOX - AI Influencer framework** installs a reusable local studio for Codex. Each user creates original influencers and keeps their private records in that independent studio. The source repository is dedicated to framework development and maintenance. The package includes framework sources and templates, with no real character records or credentials.

## Requirements

- Node **22 or later**, including npm and npx.
- Codex for conversational coordination and the tools available in your session.
- Git when cloning the repository. npm's GitHub package route may also require Git on your system.
- Access to the repository and chosen release tag. A private repository may require authenticated Git access on your machine.

The local core has no external runtime dependencies. You do not need `npm install` to operate its records. External provider setup is separate from core installation and requires its own preparation.

Release **0.4.0** defaults to [integrated ChatGPT/Codex visual creation](integrated-images.md) when available, with adaptive onboarding and distinctive concepts. It requires no Higgsfield, Builder, external CLI, or API key; account limits apply. Explicit user method choices take precedence. The [Codex-to-video procedure](production-handoff.md) prepares coherent references, exact voice when speaking, scripts and inspected scene images before a verified specialized video tool; Higgsfield remains optional. Missing capabilities leave stages pending with proposed alternatives; a paid external substitute requires applicable authorization. The commands below pin `v0.4.0`. Existing studios require the explicit upgrade procedure below.

## Create a studio from GitHub

Run from the parent folder where you want the studio:

```sh
npx --yes github:linkiaai/olympox#v0.4.0 install ./my-studio
cd my-studio
npm run verify
npm run studio -- help
```

Use `npx.cmd` and `npm.cmd` on Windows if PowerShell blocks the normal launchers. The installation directory defaults to `.` when omitted. Fresh installation accepts an absent or empty directory; an existing `.git` directory can be retained. Other existing items require `--merge`.

The installer copies reusable framework files, writes the studio's `AGENTS.md` from `templates/studio-AGENTS.md`, and creates active local skills from their versioned sources. The development checkout's root instructions remain separate. Installation does not install external plugins or provider binaries, authenticate accounts, generate media, or publish a site. `verify` builds the local manual and checks the installation's local behavior and integrity.

Open the installed studio folder in Codex. Invoke the skill in conversation:

```text
Use $olympox. Help me create an original influencer for [audience/topic].
Propose three directions and recommend one before exploring the identity.
```

If Codex does not show the new skill, reload Codex or reopen the project. File installation and automatic discovery are separate checks.

## Choose optional Higgsfield access

Higgsfield is optional, selected when its verified capabilities are useful to a stage or the user explicitly requests its method/provider. Choose its [Codex plugin](higgsfield-plugin.md) or another verified route exposing the required operations; the selected [Builder workflow](higgsfield-influencer-method.md) retains its procedures. The [local CLI and wrapper](higgsfield-setup.md) require their own binary/account preparation and do not establish feature parity. Install/connect providers separately; the plugin does not need a local CLI. The core and default integrated visual creation remain usable without external access. A missing required capability leaves that stage pending; propose alternatives without silently replacing an explicitly selected method or authorizing paid generation.

```text
Atena, use Higgsfield through the plugin for this studio.
Check the tools available in this session and prepare a pilot for [character].
Record the inputs, execution, and review in OLYMPOX.
```

This selects a route; it does not authorize paid generation, training, or publication by itself. Follow applicable prior authorization and the same canon, attempt, cost, and inspection rules on both routes. Plugin discovery does not establish account access or feature availability; inspect actual tools and results before promising a capability.

## Use an existing project

```sh
npx --yes github:linkiaai/olympox#v0.4.0 install ./existing-project --merge
```

Merge checks all intended destinations before any write. Identical framework files are retained and missing framework files are installed. Differing files or collisions stop the operation without overwriting them. Unrelated local files are preserved. The installer rejects symbolic links and junctions in installation source or destination paths.

If files conflict, review and reconcile them explicitly, or install into a separate empty studio and compare the two versions. `--merge` is not an automatic updater for modified framework sources or local instructions. Existing character records, approvals, hashes, and run history remain subject to their preservation rules.

## Upgrade an existing studio

Release **0.4.0** changes the visual default to integrated ChatGPT/Codex generation and defines the preparation and fidelity checkpoints before video, retaining Higgsfield as an optional per-stage integration. Existing approved identities and historical evidence are preserved without automatic migration. The local core API, run schemas, and task component revision remain 0.2.0. Read the [release notes](release-notes.md) and preserve the existing studio before comparing framework changes.

1. Create and verify backups of private characters and linked runs using the existing [backup operations](operations.md). Keep an independent copy of the current framework files, shared context, and local instructions too; character backups exclude that foundation.
2. Install the release into an independent empty directory, such as `./my-studio-v0.4.0`, using the pinned command above. Run `npm run verify` there and compare its reusable framework sources with the existing studio.
3. Explicitly reconcile only the intended framework sources, active skills, studio instruction template, templates, and documentation. Preserve local customizations and keep active skill copies consistent with their canonical sources. `--merge` retains identical files and refuses differing files before writing; it does not perform this reconciliation for you.
4. Keep existing character files, media, approvals, snapshots, runs, and backups in place with their original bytes and hashes. A new release's empty studio does not replace private records, and historical bytes must not be rewritten to fit new instructions or make verification pass.
5. Run `npm run verify` in the updated studio and reopen or reload Codex for skill discovery. Review resumed runs for context changes. When governance or inputs have changed, use the existing explicit new-attempt procedure with a reason, preserving prior attempts and approvals; see [core operation](framework-02.md).

The framework update does not install or authenticate the Higgsfield plugin, submit generation, train identities, or publish content.

Reconcile any unresolved provider submission through its original job before a new attempt or a tool change. Updating the framework does not cancel or resolve external work.

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
| Guides and local manual | Provider installations, accounts, and credentials |
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

An empty character list is expected in a new studio. Open the address printed by `docs:dev` to read the manual. The manual is local; its development server does not publish it remotely. See [quick start](quick-start.md), [operations](operations.md), and [framework capabilities](studio-status.md).

OLYMPOX is distributed under the [MIT license](../LICENSE). Character content, external references, and provider services retain their own applicable terms and rights.
