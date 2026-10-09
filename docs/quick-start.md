# Start with a conversation.

Open your [independently installed studio](installation.md) in its selected local assistant, Codex or Claude Code, and make the request normally. An agent name, special syntax and a complete form are unnecessary. Atena reuses existing decisions and asks at most three unresolved questions about objective, presence and audience/subject. The framework source checkout is reserved for development. The assistant coordinates; Higgsfield creates default media through tools actually available in that host. Installation does not connect accounts or demonstrate Claude web/cloud or live provider execution.

## Set up a studio first

Version 0.5.0 provides a published guided installer:

```sh
npx --yes github:linkiaai/olympox#v0.5.0 setup
```

From a reviewed checkout or extracted package, `node bin/olympox.mjs setup` runs the same guide. `npx --yes` accepts only the npm package prompt.

Choose the presentation language, Codex, Claude Code or both, then an independent destination. Review the actual preflight summary before installation; cancellation before writing preserves the destination. Setup runs local manual and structural checks and prints your selected assistant's activation syntax and first prompt. Run `npm run verify` in the installed studio for the complete local suite. Higgsfield connection and media readiness are separate live checks. The [installation guide](installation.md) covers noninteractive `--yes` with an explicit directory and assistant, direct installation, merge and preservation.

## Create a character

```text
Let's create an influencer. Help me choose the objective and character type.
I want realistic characters with a memorable look and strong personality,
with potential for shareable content. The audience/topic can be proposed.
```

Atena offers useful options: viral entertainment/reach, community, brand/ambassador, education or narrative; memorable realism, a realistic person with expressive personality, or stylization when desired. "Please propose" is a valid answer. The [strategy guide](strategy.md) describes the short conversation; the [brief](../templates/brief.md) records its result.

When direction is open, receive at least three distinct concept cards before portraits. Compare their premise, look/presence, attitude and sample voice, editorial contrast, three hooks with payoffs, sharing hypothesis and production difficulty. Atena recommends a direction; you can choose, combine compatible elements or ask for revision. Strong presence can come from varied age, silhouette, styling and attitude without forcing fantasy.

**Higgsfield is the default media platform**, following the [reference method](higgsfield-influencer-method.md). Codex or Claude coordinates concept, personality, narrative, scripts and prompts. Check the whole pilot’s connection, module access, exact-reference transport, export and budget before external generation. Produce expressive candidates and a premise scene through verified Higgsfield image/identity operations; inspect, adjust and record visual selection while the persona stays `draft`. Attach exact selected references to subsequent views/scenes and inspect anatomy, presence and continuity. When speech is planned, generate/listen to/select a draft vocal sample before approving complete exact visual/vocal canon. Then produce a representative short video pilot; full QA and actual-byte export precede batches and authorized publication. An image-only brief can select its own scope. Viral potential remains a hypothesis. Integrated assistant images are an [explicit alternative](integrated-images.md).

Psiquê develops the persona and Íris directs the visuals. Gaia researches opportunities when helpful. These profiles guide the coordinator; consultation is reported only when a subagent actually ran.

## Produce for an existing character

```text
Atena, prepare a content piece for [character], using the approved canon
and narrative. I want a [format] script about [topic], with scenes and a caption.
```

Saraswati writes; Selene prepares and executes available, authorized production; Têmis inspects the complete media. Aurora researches trends when needed. Fortuna prepares distribution experiments and analyzes first-party data when it exists.

Existing characters skip creation onboarding and keep their approved canon, language and decisions. Reuse unchanged approved voice references without repeating approval; adding or changing voice in frozen canon requires the normal identity-version process. Strengthen performance, scenes and content within allowed variations; adopting Higgsfield does not replace their identity.

## Check capabilities and record the method per stage

Follow [production](production.md) and save a versioned [production-method plan](../templates/production-method.md) as a tracked run input/planning output. Record each stage’s method, tool, exposed model, prompts, exact attached inputs, files/hashes, costs, applicable authorization and limitations. Check reference generation, voice, scenes/video, export and review separately. No integrated coordinator image tool is required. Training is optional and separately authorized when justified; approval for a sheet or video does not cover another paid stage.

Use the selected verified Higgsfield modules through the [plugin](higgsfield-plugin.md) or [official CLI](higgsfield-setup.md), with complementary transport when appropriate. Preserve the observed source modules and record proposed adaptations; the current AI Influencer interface is not one verified all-in-one API. The plugin requires its own connection; no local CLI is needed when its own tools handle required inputs. Missing capability keeps that stage pending while independent preparation continues. A materially changed method or paid scope needs the user’s decision and applicable authorization.

```text
For this piece I explicitly choose [alternative method/provider].
Record the method change, preserve the approved references and check capabilities.
```

Respect an explicit user choice of another method or provider. It retains the same canon, run records, costs/authorization checks and media review. A quote for one video does not cover other stages such as Builder sheets, voice or training. A changed tracked method follows the existing new-attempt procedure; uncertain external jobs must first be reconciled. Historical characters and evidence are preserved without automatic migration.

## Review and correct

```text
Têmis, review these files against the approved references.
Identify the segments or regions that need correction.
```

A critical failure rejects the asset. Correction creates a new version and requires another inspection; originals and history remain preserved.

## Operate local records

Requires Node 22 or later. Operating the records requires no external dependencies.

```powershell
npm.cmd run verify
node scripts/studio.mjs help
node scripts/studio.mjs new my-persona
node scripts/studio.mjs list
```

`new` creates a draft. The coordinator saves the selected concept, character record and conversation brief before generating references. These commands do not produce media, route to a provider or approve identity. See [operations](operations.md) to register files and [core operation](framework-02.md) to start and resume workflows.

## What to include in a handoff

Provide the character, canon version, selected concept, production-method plan, exact input files, objective, channel, and expected deliverable. Outstanding tool access, decisions, reviews, publication or metrics must remain visible. Previously granted authorizations remain valid; the team records only work that actually occurred.
