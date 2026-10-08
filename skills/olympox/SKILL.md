---
name: olympox
description: Create, direct, produce or review memorable AI influencers with viral potential. Use integrated ChatGPT/Codex image generation for visual creation by default when available, with optional specialized tools, preserved identity and quality control.
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

## Choose and preserve the method by stage

Develop concepts, personality, the narrative world, scripts and planning in ChatGPT/Codex. Use integrated ChatGPT/Codex image generation by default when available for appearance, visual candidates, references, settings, images and edits. This path requires neither Higgsfield, AI Influencer Builder, an external CLI nor an API key. Availability depends on the actual tool and account limits; never describe it as free or unlimited. Voice, animation, video, lip-sync and specialized operations use verified tools selected for the stage's needs, quality and cost. Higgsfield remains optional when its capabilities help a stage or the user selects it.

Plan adaptive discovery and distinct concepts when the direction is open, visual exploration with personality and an in-character scene that expresses the premise, user visual selection, a coherent reference pack and fidelity review, a vocal sample when needed while the persona remains `draft` with `purpose: reference`, final complete visual/vocal canon approval, a pilot before batches, complete media review and export. For a speaking character, generate, listen to and select the vocal sample before final canon approval: `canonHash` binds voice settings and approved references as well as visual identity. Early visual selection does not freeze incomplete canon. Reuse existing approved voice and canon; for silent content, record why voice is not applicable. Exact references require user approval regardless of the chosen provider; Soul ID remains separately justified and authorized when selected.

Recover the user's selected production method from the request, brief, decisions and relevant run inputs before choosing tools. A request to follow the same process as a reference is a method requirement, even when the user does not repeat the provider name. A reference supplied only for inspiration does not select a provider or authorize external actions.

Prepare a versioned plan using `templates/production-method.md`. Map the requested stages to their actual provider, module, connection route and model; record source coverage, exact approved inputs, verified capabilities, dependencies and pending work. Do not claim a transcript establishes unseen screens or a particular module. For a requested Higgsfield influencer method or AI Influencer Builder, apply `higgsfield-studio` and read `docs/higgsfield-influencer-method.md` before planning images or video. A direct Kling video is not evidence of a completed Builder stage.

Save the method plan as a planning output or an input to the applicable local run so its bytes are hashed and observed. Carry it through specialist handoffs. Higgsfield installation and connection remain optional setup steps: the framework installer does not perform them, authenticate, or generate. A missing capability leaves that stage pending; prepare the package, identify what is missing and propose alternatives. A switch to paid external generation needs applicable authorization; honor explicit method choices and preserve prior authorizations and approvals. Missing Higgsfield or Builder does not block integrated visual creation. Existing approved canon remains unchanged; new outputs are candidates until inspected, and a provider change does not itself require a new identity approval. Do not migrate approved characters or rewrite historical records, media, approvals, backups or runs. Changes to tracked context follow the existing explicit new-attempt procedure.

## Working modes

**Brief and persona.** Define purpose, audience, positioning, personality, voice and editorial boundaries. Create an original fictional adult. When direction is open, propose three genuinely different concepts, each with a premise, recognizable visual signature, attitude, editorial contrast, three content ideas and a sharing hypothesis. Vary combinations of age, silhouette, styling, behavior and perspective; do not reduce the options to attractive ordinary portraits with different hair or clothing. Connect visual choices to voice and repeatable content. Follow `docs/strategy.md` and use `templates/brief.md`; recommend a direction with reasons before consolidating identity.

**Image.** Use integrated ChatGPT/Codex image generation by default when available, including new identity exploration and reference development. Respect an explicit alternative method. Apply `higgsfield-studio` only for selected Higgsfield stages and verify its actual plugin or CLI capabilities before execution. Preserve the selected concept in the prompt and inspect whether its age, silhouette, styling and expression survive generation. Prepare neutral references for fidelity and an in-character scene for presence; a clean portrait alone does not demonstrate the concept. The user selects the visual identity. Inspect anatomy, presence and identity continuity between angles and scenes before approving references. Inspect reference images before editing and attach the exact selected or approved images through the tool's supported reference inputs for subsequent generations; a path, hash or mention in a prompt alone is not an attachment. Record which bytes were actually supplied. For new speaking characters, complete vocal selection before final canon approval. After complete approval, edit using approved references and preserve face, proportion and distinctive-feature invariants.

**Video and voice.** Check actual capabilities and `docs/tools.md`, selecting verified tools for voice, animation, video, lip-sync and specialized work according to need, quality and cost. For selected Higgsfield stages, apply `higgsfield-studio`: a connected plugin can be used without the local CLI, following `docs/higgsfield-plugin.md`; CLI use follows `docs/higgsfield-setup.md`. Prepare scripts, scenes, references and specifications even when no execution tool is connected. Verify current official documentation and live schemas when relying on external features. Clearly distinguish prepared, generated and verified work; image availability does not demonstrate video or voice availability. Every method retains local intent, exact references, exposed job IDs, sealed media and complete review. A successful generation does not replace listening to audio or reviewing the complete video and its audio when present.

**Content.** Develop concepts, personality, the narrative world, scripts and planning in ChatGPT/Codex. Write for the approved persona and audience: script, caption, scene sequence and performance direction. Bind each production to its editorial purpose and character references. Preserve the distinction between verifiable facts and character fiction.

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

Save new versions without overwriting approved references or deliveries. Keep traceability between persona, reference, scene and result. Record the method by stage, actual tool/provider, model when exposed (otherwise unknown), prompts, references actually attached, files, hashes, known costs and limitations. Unknown monetary cost remains `cost: null`, including integrated generation whose per-image cost is not exposed; never infer zero from account access. Preserve account-limit and availability gaps. Seal generated media and review exact output files. Never simulate user approval or declare identity perfect because a command succeeded.

Prepare work within the authorized scope. Publication or external cost requires a user decision when applicable authorization is absent; do not request authorization again when already granted. Do not introduce APIs, frameworks or automatic publication into a creative-production request.
