# Start with a conversation.

Open your [independently installed studio](installation.md) in Codex and make the request normally. An agent name, special syntax and a complete form are unnecessary. Atena reads decisions already supplied and asks at most three unresolved questions about the objective, character presence and audience/subject. The framework source checkout is reserved for development and maintenance.

## Create a character

```text
Let's create an influencer. Help me choose the objective and character type.
I want realistic characters with a memorable look and strong personality,
with potential for shareable content. The audience/topic can be proposed.
```

Atena offers useful options: viral entertainment/reach, community, brand/ambassador, education or narrative; memorable realism, a realistic person with expressive personality, or stylization when desired. "Please propose" is a valid answer. The [strategy guide](strategy.md) describes the short conversation; the [brief](../templates/brief.md) records its result.

When direction is open, receive at least three distinct concept cards before portraits. Compare their premise, look/presence, attitude and sample voice, editorial contrast, three hooks with payoffs, sharing hypothesis and production difficulty. Atena recommends a direction; you can choose, combine compatible elements or ask for revision. Strong presence can come from varied age, silhouette, styling and attitude without forcing fantasy.

**Integrated ChatGPT/Codex image generation** is the default for appearance, candidates, references, settings, images and edits when available. Concept, personality, narrative world, scripts and planning remain in ChatGPT/Codex. After choosing the concept, direct an expressive exploration sample and scene that expresses the premise, inspect it and adjust before expanding the reference set. Record the user's visual selection while keeping the new persona `draft`, and actually attach the exact selected references to subsequent views, scenes and edits. Inspect anatomy, presence and continuity. When speech is planned, generate a draft/reference vocal sample with a verified tool, listen and record the user's selection of exact audio and settings. Then approve and freeze the complete visual/vocal canon before a small production pilot. For a silent persona, record voice as not applicable. Review the complete media before batches. Publication requires applicable authorization, and comparison uses actual post results. Viral potential remains a hypothesis.

Psiquê develops the persona and Íris directs the visuals. Gaia researches opportunities when helpful. These profiles guide Codex; consultation is reported only when a subagent actually ran.

## Produce for an existing character

```text
Atena, prepare a content piece for [character], using the approved canon
and narrative. I want a [format] script about [topic], with scenes and a caption.
```

Saraswati writes; Selene prepares and executes available, authorized production; Têmis inspects the complete media. Aurora researches trends when needed. Fortuna prepares distribution experiments and analyzes first-party data when it exists.

Existing characters skip creation onboarding and keep their approved canon, language and decisions. Reuse unchanged approved voice references without repeating approval; adding or changing voice in frozen canon requires the normal identity-version process. Strengthen performance, scenes and content within allowed variations; adopting Higgsfield does not replace their identity.

## Check capabilities and record the method per stage

Follow [production](production.md) and save a versioned [production-method plan](../templates/production-method.md). Track the file in the existing run as an input or planning output; record method, tool, exposed model, prompts, actual attached references, files/hashes, known costs and limitations for each stage. Reference generation, voice, scenes/video, export and review each need a real capability check. The integrated visual route needs no Higgsfield, AI Influencer Builder, external CLI or API key. It depends on tool availability and account limits; do not describe it as free or unlimited. Training is optional and separately authorized when justified.

Select verified voice, animation, video, lip-sync and specialized tools according to need, quality and known cost. Higgsfield remains an option under its [optional method guide](higgsfield-influencer-method.md), through the [Codex plugin](higgsfield-plugin.md) or the [local CLI and wrapper](higgsfield-setup.md) when that route supports the selected operation. The plugin requires its own installation and connection, with no local Higgsfield CLI required. If a capability is absent, keep the stage pending and propose alternatives while preparing independent local work. Switching to paid external generation needs applicable authorization.

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

`new` creates a draft. Codex saves the selected concept, character record and conversation brief before generating references. These commands do not produce media, route to a provider or approve identity. See [operations](operations.md) to register files and [core operation](framework-02.md) to start and resume workflows.

## What to include in a handoff

Provide the character, canon version, selected concept, production-method plan, exact input files, objective, channel, and expected deliverable. Outstanding tool access, decisions, reviews, publication or metrics must remain visible. Previously granted authorizations remain valid; the team records only work that actually occurred.
