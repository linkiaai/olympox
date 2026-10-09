# OLYMPOX - AI Influencer framework

Version **0.5.0** — **October 9, 2026**. Read the [release notes](docs/release-notes.md) and [upgrade guidance](docs/installation.md#upgrade-an-existing-studio). Core/task component revision remains 0.2.0; new runs add a versioned media-provider policy.

OLYMPOX is a local framework for creating memorable original AI influencers with testable viral potential, coordinated by Atena and a team of goddess-named specialists. Codex or Claude Code coordinates the character's visual signature, personality, audience, recurring content, voice, and performance. Each influencer has an individual identity and history; virality is a hypothesis to test, never a promised result.

The reusable package contains governance, skills, specialist profiles, task contracts, workflows, local commands, templates, and a manual. The `olympox` skill organizes creative work in an installed studio. Each user installs an independent studio and creates their own original influencers there. Character records, media, runs, backups, credentials, and optional provider binaries are excluded from the framework package.

This repository and its assistant project are dedicated to framework development and maintenance. The root `AGENTS.md` defines development instructions. Installation uses `templates/studio-AGENTS.md` for the separate studio's creative instructions.

## Install your studio

Requires **Node 22 or later** and **Codex or Claude Code**. Start the guided installation from the published release:

```sh
npx --yes github:linkiaai/olympox#v0.5.0 setup
```

From a reviewed checkout or extracted package, use `node bin/olympox.mjs setup` instead.

The guide lets you select Codex, Claude Code or both, choose an independent studio folder, and review the resolved destination and actual copy/retain counts before installing. It then builds the local manual and checks the instructions, skills and records. Cancellation before installation creates no files; a changed reviewed plan is refused before writes. English is the default presentation language, with `--locale pt-BR` available. The guide ends with the exact host invocation and first readiness prompt for Higgsfield. Provider connection and generation remain separate from installation.

For the complete framework test suite, run `npm run verify` from the **installed studio directory** after setup.

For scripts, use explicit selection:

```sh
npx --yes github:linkiaai/olympox#v0.5.0 setup ../my-studio --assistant claude --yes
```

The first `--yes` belongs to npx and accepts its package prompt. The `--yes` after `setup` belongs to OLYMPOX and accepts its reviewed installation plan. Noninteractive setup requires `--yes`, a destination and `--assistant`. The direct `install` command remains available with its compatible `codex` default; an interactive `install` without an explicit assistant opens the guide. Open the installed studio and invoke its discovered `olympox` skill (`$olympox` in Codex, `/olympox` in Claude Code). Claude Code imports creative instructions through `CLAUDE.md` and discovers `.claude/skills/`; Codex uses `AGENTS.md` and `.agents/skills/`. Restart or reload the host if needed; installation does not prove live discovery. On Windows use `npm.cmd` if PowerShell blocks the launcher. Existing `v0.4.0` installations retain their earlier method until explicitly upgraded to `v0.5.0`.

For an existing project, add `--merge` to the installation command. The installer checks all destinations before writing, retains identical framework files, and refuses differing files or collisions. Review conflicts before retrying; it preserves unrelated local files.

To develop or inspect the framework source:

```sh
git clone https://github.com/linkiaai/olympox.git
cd olympox
npm run verify
npm run studio -- help
```

Keep creative production in an independently installed studio. The source checkout is for framework development and maintenance. The local core has no external runtime dependencies and needs no `npm install` for these commands. See [installation](docs/installation.md) for package contents, merge behavior, and verification.

**Atena** is the studio master and director: speak to her, or make a request normally, and your assistant organizes the work. The [team](docs/studio-team.md) consists of nine female profiles named after goddesses: Atena and eight specialists, governed by the [constitution](CONSTITUTION.md). Core 0.2 saves tasks and attempts, identifies the next owner, and detects context changes. Profiles are instructions; real delegation depends on the tools available in the session.

**Gaia** researches opportunities before a new persona is explored. **Aurora** researches trends and develops content ideas for existing characters, including formats and audio when available. The [research method](docs/trend-research.md) requires current sources and adaptations that fit each character. Both work on demand.

## Start in conversation

The [framework manual](docs/framework-manual.md) is also available as a website. Run `npm.cmd run docs:dev` and open the address shown in the terminal. The site brings together the overview, quick start, team, workflows, contracts, commands, and guides, and follows source changes while the server is running. `npm.cmd run verify` also builds and checks the manual. Read [living documentation](docs/living-documentation.md) for its operation, limitations, and maintenance.

In the installed studio's assistant project, you can say:

> Let's create our first influencer. I want to explore [topic/audience/style]. Use the studio to propose three different directions and recommend the most interesting one.

Or:

> Atena, use OLYMPOX. I want to create a persona with these references: [...]. Prepare the identity and the first candidate images.

For research:

> Atena, ask Gaia for three opportunities for new influencers in [market/channel], with sources and a recommendation.

> Atena, ask Aurora for trends and ideas for [character], including the format, opening, scenes, and verified audio options.

For a new character, Atena starts a short [onboarding conversation](docs/strategy.md), reuses your answers, and proposes three distinct concepts with a recommendation. Choose the goal, such as viral entertainment, a recurring presenter, or a brand role, and the desired character style; "please propose" is valid. The [brief](templates/brief.md) records choices without becoming a mandatory questionnaire. The default creative direction is varied, memorable realism with strong personality and presence; another style remains your choice.

Develop concepts, personality, narrative, scripts and planning with the coordinating assistant, Codex or Claude Code. Higgsfield is the default media pipeline for appearance, candidates, reference packs, scenes, image edits, voice, animation, video and lip-sync. Follow the observed reference method through verified Higgsfield modules, preserving source observations separately from current adaptations. Assistant-integrated image generation is an explicit alternative only; do not use it automatically or silently replace a missing Higgsfield stage. Each required module needs checked access, accepted exact inputs, known cost or an authorized uncertainty, export and inspection support. Missing capabilities leave the affected stage pending. The local core remains usable for preparation without a connected provider; installation never authenticates or generates. Follow the [Higgsfield reference pipeline](docs/higgsfield-influencer-method.md), [plugin](docs/higgsfield-plugin.md) or [CLI preparation](docs/higgsfield-setup.md). The [integrated image guide](docs/integrated-images.md) covers the explicit alternative.

## Method

Follow the [assistant-to-Higgsfield checkpoints](docs/production-handoff.md): check the complete pilot path and budget early, prepare exact identity/voice, scripts and inspected scene images, then submit supported inputs to verified Higgsfield modules. Save the [handoff package](templates/video-handoff.md) with readiness, owner and actual inputs per scene. Reuse confirmed provider media IDs; verify supported automatic transfer for local originals before proposing manual attachment. One inspected pilot precedes batches.

1. Short onboarding, audience/opportunity, and three distinctive character concepts with recurring hooks.
2. Select a concept and save the [production-method plan](templates/production-method.md), including source evidence, modules, capabilities, stages, and cost scopes.
3. Explore visual identity through verified Higgsfield modules following the saved reference-method mapping, coherent references and an expressive scene communicating the premise. Let the user select the candidate, attach real references to subsequent generations, and inspect anatomy, presence, and continuity across angles/scenes. For a speaking character, prepare and review a vocal sample during draft/reference work; then approve the complete exact visual/vocal canon before production.
4. Develop scripts with the coordinating assistant, then Higgsfield scenes and a small pilot with verified modules and a bounded whole-pilot budget, using the approved identity/voice. Evaluate training only when justified.
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

The commands create records, assemble generation specifications, and validate records. They do not call models, approve media, or publish. The assistant uses the available tools to carry out the creative work.

Read [operations](docs/operations.md) for references, hashes, and the manifest. Media, character records, tasks, and backups stay local and are ignored by Git. Use `backup`, `backup-verify`, and `backup-test` after important cycles, and keep a copy of the backups elsewhere. The source skill in `skills/` and its selected installation in `.agents/skills/` or `.claude/skills/` must remain identical; `doctor` detects discrepancies.

## Capabilities and limits

| Component | Included behavior |
| --- | --- |
| Project instructions and skill | Governance and reusable skills installed into the chosen studio |
| Character records, prompts, and logs | Local scripts and templates for your own influencers |
| Coordination and history 0.2 | Registry, contracts, resumable tasks, snapshots, and local editorial records |
| Character backups | File and linked-task inventory, verification, and restore testing |
| Assistant-integrated images | Explicit alternative when generation and inspection tools are available; subject to account limits |
| Higgsfield plugin or CLI | Default media pipeline with verified source-method modules, account access, actual reference transfer and known costs |
| Identity and pilot | Your own candidate exploration, explicit canon approval, and inspected pilot before batches |

Profiles are instructions, and local packages do not dispatch agents. Commands maintain records and integrity; generation, inspection, paid services, and publication need the tools and authorizations applicable to your studio. Tests do not demonstrate visual identity, voice quality, or provider execution. Plugin availability alone does not demonstrate voice, Soul ID, downloadable media, export, or equivalent CLI billing. Read [framework status](docs/studio-status.md), [Higgsfield plugin](docs/higgsfield-plugin.md), and [optional CLI setup](docs/higgsfield-setup.md).

Released under the [MIT license](LICENSE).
