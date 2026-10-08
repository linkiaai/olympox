# OLYMPOX - AI Influencer framework

OLYMPOX is a local AI influencer framework coordinated by Atena and a team of goddess-named specialists. Codex uses it to create and direct original virtual influencers through strategy, persona, references, photography, scripts, voice, video, and quality review. Each influencer has an individual identity and history.

The reusable package contains governance, skills, specialist profiles, task contracts, workflows, local commands, templates, and a manual. The `olympox` skill organizes creative work in an installed studio. Each user installs an independent studio and creates their own original influencers there. Character records, media, runs, backups, credentials, and optional provider binaries are excluded from the framework package.

This repository and its Codex project are dedicated to framework development and maintenance. The root `AGENTS.md` defines development instructions. Installation uses `templates/studio-AGENTS.md` for the separate studio's creative instructions.

## Install your studio

Requires **Node 22 or later** and **Codex**. Install from GitHub:

```sh
npx --yes github:linkiaai/olympox install ./my-studio
cd my-studio
npm run verify
npm run studio -- help
```

On Windows, use `npx.cmd` and `npm.cmd` if PowerShell blocks the launchers. Open `my-studio` in Codex and use `$olympox`. Reload Codex if the new skill is not discovered; installation alone does not demonstrate that the current session has loaded it.

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

If there are no preferences yet, Codex proposes directions. The [brief](templates/brief.md) helps organize choices and accepts "please propose." You do not need to fill out every field before starting a conversation.

## Method

1. Value proposition, audience, personality, and voice.
2. Visual candidates and a reference set for the same person.
3. Identity selection and approval; record the anchors and files.
4. A pilot covering scenes, expressions, and speech/movement when needed.
5. Content, production for each piece, and inspection of the final result.
6. Authorized publication, collection of results, and evidence-based adjustments.

See [strategy](docs/strategy.md), [production](docs/production.md), [quality](docs/quality.md), and [tools](docs/tools.md). The [reference analysis](docs/video-reference.md) identifies the material consulted and what we adapted through our own judgment.

The [framework review and architecture](docs/framework-architecture.md) guides its evolution, inspired by AIOX. The current foundation is local core 0.2: specialists, task contracts, three resumable workflows, canon history, sealed executions, versioned narrative/content, and verifiable backups. The [core guide](docs/framework-02.md) explains its use and limitations.

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
| Higgsfield for video/voice | Optional skill, wrapper, and setup guide; install and connect the provider separately |
| Identity and pilot | Your own candidate exploration, explicit canon approval, and inspected pilot before batches |

Profiles are instructions, and local packages do not dispatch agents. Commands maintain records and integrity; generation, inspection, paid services, and publication need the tools and authorizations applicable to your studio. Tests do not demonstrate visual identity, voice quality, or provider execution. Read [framework status](docs/studio-status.md) and [optional Higgsfield setup](docs/higgsfield-setup.md).

Released under the [MIT license](LICENSE).
