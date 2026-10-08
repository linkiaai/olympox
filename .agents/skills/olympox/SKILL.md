---
name: olympox
description: Create, direct, produce or review memorable AI influencers with viral potential. New influencers follow the full Higgsfield AI Influencer Builder method unless the user explicitly chooses another method; preserve identity, content and quality control.
---

# OLYMPOX - AI Influencer framework

Create varied, memorable original characters with viral potential, consistent identity and verifiable quality. Prioritize realistic characters with strong personality and presence unless the user selects another visual language. Work through concept proposals, generation, visual review and approval; generation may require several attempts. Viral potential is a content hypothesis to test, not a promised result. Framework instructions and new technical records use English; character voice and content follow the approved audience language.

## Context and references

**All paths in this skill are relative to the OLYMPOX project root, not the skill folder.** Read `AGENTS.md`; for an existing character, read `influencers/<slug>/persona.json` and its manifest `influencers/<slug>/assets.json`. Preserve approved decisions and identify the next requested result.

Load only the references needed:

- Brief and persona: `templates/brief.md` and `docs/strategy.md`.
- Images, video and voice: `docs/production.md` and `docs/tools.md`.
- Review and approval: `docs/quality.md`.
- Structure, commands and versioning: `docs/operations.md`.

Ask only for essential missing information. For reversible choices, recommend a clear direction and record assumptions; avoid a lengthy interview.

For a new character, use the short conversational onboarding in `docs/strategy.md`: offer goal and character-style options, accept "please propose," reuse supplied answers, and present concrete concept options before generation. Existing characters or a complete brief skip discovery that has already been resolved. Do not require special commands or a filled form.

## Preserve the requested method

For new OLYMPOX influencer creation, the main method is the full Higgsfield sequence with AI Influencer Builder for identity/reference sheets, unless the user explicitly selects another method. Plan concept discovery, Builder sheets and reference pack, preliminary visual selection and fidelity review, a vocal sample when needed while the persona remains `draft` with `purpose: reference`, final complete visual/vocal canon approval, scenes and a production video pilot, complete QA and export; Soul ID remains separately justified and authorized when required. For a speaking character, listen to and select the vocal sample before final canon approval: `canonHash` binds voice settings and approved references as well as visual identity. Early visual selection does not freeze incomplete canon. Reuse existing approved voice and canon; for silent content, record why voice is not applicable. Apply `higgsfield-studio` and read `docs/higgsfield-influencer-method.md` before choosing an image or video tool. This main method is the current user-required framework direction; do not claim the original reference video used Builder exclusively.

Recover the user's selected production method from the request, brief, decisions and relevant run inputs before choosing tools. A request to follow the same process as a reference is a method requirement, even when the user does not repeat the provider name. A reference supplied only for inspiration does not select a provider or authorize external actions.

Prepare a versioned plan using `templates/production-method.md`. Map the requested stages to their actual provider, module, connection route and model; record source coverage, exact approved inputs, verified capabilities, dependencies and pending work. Do not claim a transcript establishes unseen screens or a particular module. For a requested Higgsfield influencer method or AI Influencer Builder, apply `higgsfield-studio` and read `docs/higgsfield-influencer-method.md` before planning images or video. A direct Kling video is not evidence of a completed Builder stage.

Save the method plan as a planning output or an input to the applicable local run so its bytes are hashed and observed. Carry it through specialist handoffs. Higgsfield installation and connection remain optional setup steps: the framework installer does not perform them, authenticate, or generate. A missing capability in the main or selected method leaves that stage pending; prepare the package and identify what is missing without falling back to another image provider or direct video generation. Propose a material substitution for the user's decision. Preserve prior authorizations and approvals. Existing approved canon remains unchanged; new provider sheets are candidates until inspected, and a provider change does not itself require a new identity approval. Changes to a tracked plan follow the existing explicit new-attempt procedure.

## Working modes

**Brief and persona.** Define purpose, audience, positioning, personality, voice and editorial boundaries. Create an original fictional adult. When direction is open, propose three genuinely different concepts, each with a premise, recognizable visual signature, attitude, editorial contrast, three content ideas and a sharing hypothesis. Vary combinations of age, silhouette, styling, behavior and perspective; do not reduce the options to attractive ordinary portraits with different hair or clothing. Connect visual choices to voice and repeatable content. Follow `docs/strategy.md` and use `templates/brief.md`; recommend a direction with reasons before consolidating identity.

**Image.** New influencer identity exploration and reference sheets follow the main Higgsfield Builder method unless the user explicitly selects another method. Apply `higgsfield-studio` and verify its actual plugin or CLI capabilities before execution. For unrelated image edits or image work within approved canon, choose checked tools that honor the applicable method; Codex's integrated image generation can be used when available without requiring an API key. Preserve the selected concept in the prompt and inspect whether its age, silhouette, styling and expression survive generation. Prepare neutral references for fidelity and an in-character scene for presence; a clean portrait alone does not demonstrate the concept. The user selects the visual identity; for new speaking characters, complete vocal selection before final canon approval. After complete approval, edit using approved references and preserve face, proportion and distinctive-feature invariants. Record references, instructions and versions for each delivery.

**Video and voice.** Check actual capabilities and `docs/tools.md`. For Higgsfield, apply `higgsfield-studio`: a connected plugin can be used without the local CLI, following `docs/higgsfield-plugin.md`; CLI use follows `docs/higgsfield-setup.md`. Prepare scripts, scenes, references and specifications even when no execution tool is connected. Verify current official documentation and live schemas when relying on external features. Clearly distinguish prepared, generated and verified work; image availability does not demonstrate video or voice availability. Both routes retain local intent, exact references, exposed job IDs, sealed media and complete review.

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
