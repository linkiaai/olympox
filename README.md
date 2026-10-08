# OLYMPOX - AI Influencer framework

Framework release **0.3.0** — **October 8, 2026**. Read the [release notes](docs/release-notes.md) and [upgrade guidance](docs/installation.md#upgrade-an-existing-studio) before updating an existing studio. The local core and task component revision remain 0.2.0, with clarified production criteria.

OLYMPOX is a local framework for creating memorable original AI influencers with testable viral potential, coordinated by Atena and a team of goddess-named specialists. Codex connects the character's visual signature, personality, audience, recurring content, voice, and performance. Each influencer has an individual identity and history; virality is a hypothesis to test, never a promised result.

The reusable package contains governance, skills, specialist profiles, task contracts, workflows, local commands, templates, and a manual. The `olympox` skill organizes creative work in an installed studio. Each user installs an independent studio and creates their own original influencers there. Character records, media, runs, backups, credentials, and optional provider binaries are excluded from the framework package.

This repository and its Codex project are dedicated to framework development and maintenance. The root `AGENTS.md` defines development instructions. Installation uses `templates/studio-AGENTS.md` for the separate studio's creative instructions.

## Install your studio

Requires **Node 22 or later** and **Codex**. Install from GitHub:

```sh
npx --yes github:linkiaai/olympox#v0.3.0 install ./my-studio
cd my-studio
npm run verify
npm run studio -- help
```

The GitHub command requires access to the repository and release tag. A private repository may require authenticated Git access on your machine. On Windows, use `npx.cmd` and `npm.cmd` if PowerShell blocks the launchers. Open `my-studio` in Codex and use `$olympox`. Reload Codex if the new skill is not discovered; installation alone does not demonstrate that the current session has loaded it.

For an existing project, add `--merge` to the installation command. The installer checks all destinations before writing, retains identical framework files, and refuses differing files or collisions. Review conflicts before retrying; it preserves unrelated local files.

To develop or inspect the framework source:

```sh
git clone https://github.com/linkiaai/olympox.git
cd olympox
npm run verify
npm run studio -- help
```

Keep creative production in an independently installed studio. The source checkout is for framework development and maintenance. The local core has no external runtime dependencies and needs no `npm install` for these commands. See [installation](docs/installation.md) for package contents, merge behavior, and verification.

**Atena** is the studio master and director: speak to her, or make a request normally, and Codex organizes the work. The [team](docs/studio-team.md) consists of nine female profiles named after goddesses: Atena and eight specialists, governed by the [constitution](CONSTITUTION.md). Core 0.2 saves tasks and attempts, identifies the next owner, and detects context changes. Profiles are instructions; real delegation depends on the tools available in the session.

**Gaia** researches opportunities before a new persona is explored. **Aurora** researches trends and develops content ideas for existing characters, including formats and audio when available. The [research method](docs/trend-research.md) requires current sources and adaptations that fit each character. Both work on demand.

## Start in conversation

The [framework manual](docs/framework-manual.md) is also available as a website. Run `npm.cmd run docs:dev` and open the address shown in the terminal. The site brings together the overview, quick start, team, workflows, contracts, commands, and guides, and follows source changes while the server is running. `npm.cmd run verify` also builds and checks the manual. Read [living documentation](docs/living-documentation.md) for its operation, limitations, and maintenance.

In the installed studio's Codex project, you can say:

> Let's create our first influencer. I want to explore [topic/audience/style]. Use the studio to propose three different directions and recommend the most interesting one.

Or:

> Use $olympox. I want to create a persona with these references: [...]. Prepare the identity and the first candidate images.

For research:

> Atena, ask Gaia for three opportunities for new influencers in [market/channel], with sources and a recommendation.

> Atena, ask Aurora for trends and ideas for [character], including the format, opening, scenes, and verified audio options.

For a new character, Atena starts a short [onboarding conversation](docs/strategy.md), reuses your answers, and proposes three distinct concepts with a recommendation. Choose the goal, such as viral entertainment, a recurring presenter, or a brand role, and the desired character style; "please propose" is valid. The [brief](templates/brief.md) records choices without becoming a mandatory questionnaire. The default creative direction is varied, memorable realism with strong personality and presence; another style remains your choice.

The main new-influencer method uses **Higgsfield AI Influencer Builder**, followed by references, voice when needed, scripts, scenes, video, and review. Follow the [complete method](docs/higgsfield-influencer-method.md), using the [Codex plugin](docs/higgsfield-plugin.md) or another verified route that actually exposes the required operations. The plugin needs no local CLI. External access remains separately configured and the local core remains usable without it; missing required capabilities keep production pending. A different method requires an explicit user choice. Integrated Codex images remain available for tasks that select them. Installation never connects providers or executes production.

## Method

1. Short onboarding, audience/opportunity, and three distinctive character concepts with recurring hooks.
2. Select a concept and save the [production-method plan](templates/production-method.md), including source evidence, modules, capabilities, stages, and cost scopes.
3. Explore visual identity through AI Influencer Builder, coherent references and an in-character scene. For a speaking character, prepare and review a vocal sample during draft/reference work; then approve the complete exact visual/vocal canon before production.
4. Develop scripts, scenes and a small video pilot through verified Higgsfield tools using the approved identity/voice. Evaluate training only when justified.
5. Review the complete media and export its actual bytes before expanding into content batches.
6. Publish with applicable authorization, compare real results across suitable windows, and adjust the hypothesis without prematurely discarding concepts.

See [strategy](docs/strategy.md), [production](docs/production.md), [quality](docs/quality.md), and [tools](docs/tools.md). The [reference analysis](docs/video-reference.md) identifies the material consulted and what we adapted through our own judgment.

The [framework review and architecture](docs/framework-architecture.md) guides its evolution. The current foundation is local core 0.2: specialists, task contracts, three resumable workflows, canon history, sealed executions, versioned narrative/content, and verifiable backups. The [core guide](docs/framework-02.md) explains its use and limitations.

## Local operation

Run these creative operations from your installed studio:

```powershell
npm.cmd run verify
node scripts/studio.mjs new my-persona
node scripts/studio.mjs list
node scripts/studio.mjs validate my-persona
```

The commands create records, assemble generation specifications, and validate records. They do not call models, approve media, or publish. Codex uses the available tools to carry out the creative work.

Read [operations](docs/operations.md) for references, hashes, and the manifest. Media, character records, tasks, and backups stay local and are ignored by Git. Use `backup`, `backup-verify`, and `backup-test` after important cycles, and keep a copy of the backups elsewhere. The source skill in `skills/` and its installation in `.agents/skills/` must remain identical; `doctor` detects discrepancies.

## Capabilities and limits

| Component | Included behavior |
| --- | --- |
| Project instructions and skill | Governance and reusable skills installed into the chosen studio |
| Character records, prompts, and logs | Local scripts and templates for your own influencers |
| Coordination and history 0.2 | Registry, contracts, resumable tasks, snapshots, and local editorial records |
| Character backups | File and linked-task inventory, verification, and restore testing |
| Integrated images | Available only when the Codex session provides generation and inspection tools |
| Higgsfield plugin or CLI | Separately configured access for the main new-influencer method; check the selected route's available tools, account access, and costs |
| Identity and pilot | Your own candidate exploration, explicit canon approval, and inspected pilot before batches |

Profiles are instructions, and local packages do not dispatch agents. Commands maintain records and integrity; generation, inspection, paid services, and publication need the tools and authorizations applicable to your studio. Tests do not demonstrate visual identity, voice quality, or provider execution. Plugin availability alone does not demonstrate voice, Soul ID, downloadable media, export, or equivalent CLI billing. Read [framework status](docs/studio-status.md), [Higgsfield plugin](docs/higgsfield-plugin.md), and [optional CLI setup](docs/higgsfield-setup.md).

Released under the [MIT license](LICENSE).
