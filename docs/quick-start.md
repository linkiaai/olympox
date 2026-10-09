# Quick start

Install an independent studio, open it in Codex or Claude Code, and describe what you want to create. You can speak normally; Atena coordinates the request and loads the relevant OLYMPOX guidance.

## 1. Install and open the studio

Requires Node 22+ and a local Codex or Claude Code environment. Install the published release:

```sh
npx --yes github:linkiaai/olympox#v0.5.0 setup
```

From a reviewed source checkout or extracted package, use `node bin/olympox.mjs setup`.

Choose the assistant and destination, review the installation plan, and open the installed folder. Invoke `$olympox` in Codex or `/olympox` in Claude Code. Reload the host if it has not discovered the new skills. See [installation](installation.md) for scripted setup, merge and upgrades.

Setup checks the local files and manual. Connect Higgsfield separately and check the modules needed for your intended pilot.

## 2. Ask for a character

> Use OLYMPOX to create an influencer for [audience/topic]. Propose three distinct concepts, show how each could sustain a recurring series, and recommend one.

If the direction is open, the assistant asks a short set of unresolved questions about objective, presence and audience. “Please propose” is a valid answer. Compare the premise, personality, visual signature, sample voice, recurring hooks and production difficulty before choosing.

The selected direction becomes a draft persona and brief. [Character development](strategy.md) explains this stage.

## 3. Select identity and voice

Before paid generation, check the complete pilot path: account access, required modules, accepted references, export, inspection and budget. [The production method](higgsfield-influencer-method.md) describes the default Higgsfield sequence.

Generate expressive candidates and a premise scene. Select the visual direction, build coherent references and inspect anatomy, presence and continuity. If the character speaks, listen to and select a draft vocal sample. Approve the exact visual/vocal canon after those choices are ready.

Your choices stay explicit in the record. An approved persona alone does not create a frozen snapshot; the record operations preserve it. Assistant-integrated image generation requires an [explicit alternative choice](integrated-images.md).

## 4. Produce and inspect one pilot

> Prepare one short pilot with the approved identity and voice. Show the script, scenes, exact inputs and cost scope before generation.

The assistant writes and directs; verified Higgsfield tools generate the media. Inspect the complete pilot and its actual exported bytes. Correct failures in new versions. Expand into batches after the pilot passes.

Follow [production](production.md), [pilot handoff](production-handoff.md) and [quality](quality.md). Publication uses the applicable authorization.

## Work with an existing character

> Prepare a [format] piece for [character] about [topic], using its approved canon and current narrative.

The assistant reuses the existing decisions, language and approved references. Changes within permitted variation keep the identity; changes to frozen identity require a new canon version and approval. Use [workflow operation](framework-02.md) to resume a saved run.

## Check local records

Run these commands from the installed studio root:

```sh
node scripts/studio.mjs list
node scripts/studio.mjs validate
node scripts/studio.mjs help
npm run verify
```

The commands maintain and check records. See [identity and backups](operations.md) for files, snapshots and recovery. If a tool is unavailable, keep the affected stage pending and continue preparation that does not depend on it.
