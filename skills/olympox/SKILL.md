---
name: olympox
description: Create, direct, produce or review AI influencers in this project, including original personas, visual identity, content and quality control.
---

# OLYMPOX - AI Influencer framework

Produce original characters with consistent identity and verifiable quality. Work through proposals, generation, visual review and approval; generation may require several attempts. Framework instructions and new technical records use English; character voice and content follow the approved audience language. See `docs/localization.md` for secondary Brazilian Portuguese translations and legacy compatibility.

## Context and references

**All paths in this skill are relative to the OLYMPOX project root, not the skill folder.** Read `AGENTS.md`; for an existing character, read `influencers/<slug>/persona.json` and its manifest `influencers/<slug>/assets.json`. Preserve approved decisions and identify the next requested result.

Load only the references needed:

- Brief and persona: `templates/brief.md` and `docs/strategy.md`.
- Images, video and voice: `docs/production.md` and `docs/tools.md`.
- Review and approval: `docs/quality.md`.
- Structure, commands and versioning: `docs/operations.md`.

Ask only for essential missing information. For reversible choices, recommend a clear direction and record assumptions; avoid a lengthy interview.

## Working modes

**Brief and persona.** Define purpose, audience, positioning, personality, voice and editorial boundaries. Create an original fictional adult. Connect visual choices and content to strategy. When there is no brief, use `templates/brief.md` as a guide and present a proposal for review.

**Image.** Use Codex's integrated image generation by default, without requiring an API key. Check tool availability before promising execution. Produce candidate variants; the user visually approves the canonical identity. After approval, edit using approved references and preserve face, proportion and distinctive-feature invariants. Record references, instructions and versions for each delivery.

**Video and voice.** Check actual capabilities and `docs/tools.md`. Prepare scripts, scenes, references and specifications even when no execution tool is connected. Verify current official documentation when relying on external features. Clearly distinguish prepared, generated and verified work; image availability does not demonstrate video or voice availability.

**Content.** Write for the approved persona and audience: script, caption, scene sequence and performance direction. Bind each production to its editorial purpose and character references. Preserve the distinction between verifiable facts and character fiction.

**Quality.** Follow `docs/quality.md` and visually inspect results. Check identity, anatomy, continuity, finish and brief alignment. References use `candidate`, `approved`, `rejected`; assets use `draft`, `production`, `rejected`, based on actual inspection and decisions. Legacy Portuguese values remain readable. Structural validation and successful generation do not automatically approve identity or quality.

## Local operation

Run commands from the project root:

```text
node scripts/studio.mjs doctor
node scripts/studio.mjs list
node scripts/studio.mjs new <slug>
node scripts/studio.mjs validate [slug]
node scripts/studio.mjs prompt <slug> <shot.json>
node scripts/studio.mjs check-assets <slug>
node scripts/studio.mjs canon-hash <slug>
```

`prompt` writes a draft to standard output; review it before generation. Use `new` to scaffold a character, `validate` to check records and `check-assets` to check files. `canon-hash` calculates a hash on standard output and does not approve the character. Read `docs/operations.md` for fields and procedures.

Persona status is `draft`, `canon-approved` or `production`. Canon approval records `identityVersion`, reviewer, date, notes and `canonHash`. References use paths relative to the character folder, with role, status and SHA-256; do not confuse these with project-root documentation paths.

Save new versions without overwriting approved references or deliveries. Keep traceability between persona, reference, scene and result. Never simulate user approval or declare identity perfect because a command succeeded.

Prepare work within the authorized scope. Publication or external cost requires a user decision when applicable authorization is absent; do not request authorization again when already granted. Do not introduce APIs, frameworks or automatic publication into a creative-production request.
