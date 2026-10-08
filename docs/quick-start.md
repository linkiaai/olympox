# Start with a conversation.

Open your [independently installed studio](installation.md) in Codex. Tell Atena the objective, audience, and result you want. Make the request normally, without an agent name, special syntax, or a complete form. When the direction is open, ask for alternatives and a recommendation. The framework source checkout is reserved for development and maintenance.

## Create a character

```text
Atena, propose three original directions for an everyday-humor influencer
aimed at Brazil. Explain the audience, editorial proposition, and your recommendation.
```

Psiquê develops the persona and Íris directs the visual candidates. Gaia researches opportunities when that investigation helps the decision. You choose the identity from real files; approved canon preserves the exact references. Make a pilot before batches.

## Produce for an existing character

```text
Atena, prepare a content piece for [character], using the approved canon
and narrative. I want a [format] script about [topic], with scenes and a caption.
```

Saraswati writes; Selene prepares and executes available, authorized production; Têmis inspects the complete media. Aurora researches trends when needed. Fortuna prepares distribution experiments and analyzes first-party data when it exists.

## Choose a production tool

Integrated Codex image generation is the default when available unless you choose another provider. Optional Higgsfield access can use the [Codex plugin](higgsfield-plugin.md) or the [local CLI and wrapper](higgsfield-setup.md). The plugin needs its own installation and connection in Codex, with no local Higgsfield CLI required. OLYMPOX installation supplies neither external route's account access.

```text
Atena, use Higgsfield through the plugin for [character].
Check the available tools and prepare this piece using the approved references.
Keep the execution and review records in OLYMPOX.
```

Selene checks the selected route's actual capabilities and costs before authorized submission. Both routes use the same canon and run records; final media still needs inspection. A plugin listing does not demonstrate voice, Soul ID, media download, export, or equivalent CLI billing.

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

`new` creates a draft. Fill in the character record and brief before generating references. These commands do not produce media or approve identity. See [operations](operations.md) to register files and [core operation](framework-02.md) to start and resume workflows.

## What to include in a handoff

Provide the character, canon version, input files, objective, channel, and expected deliverable. Outstanding tool access, decisions, or reviews must remain visible. Previously granted authorizations remain valid; the team records only work that actually occurred.
