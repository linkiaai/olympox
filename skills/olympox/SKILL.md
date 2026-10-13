---
name: olympox
description: Create, direct, produce or review memorable AI influencers with a default Higgsfield media pipeline, explicitly selected optional providers, preserved identity and quality control.
---

# OLYMPOX - AI Influencer framework

Create varied, memorable original characters with viral potential, consistent identity and verifiable quality. Prioritize realistic characters with strong personality and presence unless the user selects another visual language. Work through concept proposals, generation, visual review and approval; generation may require several attempts. Viral potential is a content hypothesis to test, not a promised result. Framework instructions and new technical records use English; character voice and content follow the approved audience language.

## Context and references

Before selecting media tools, read the nonsecret `work/studio-settings.json` if present. Use its `mediaProvider` preference for new work unless the user explicitly chooses another method or per-stage provider; without a preference, Higgsfield remains the fallback. New runs resolve registry defaults, then studio choice, then explicit `mediaProviders`. Existing attempts retain their captured choices until an explicit new attempt; changing the studio preference never migrates canon or rewrites history. A saved BytePlus choice is already an explicit alternative decision, not a reason to ask for it again.

New personas start with `voice.applicability: unspecified`. Before complete canon, declare `speaking` with exact approved audio `voice.selection` and actual listening/selection evidence, or `silent` with null reference/selection and no speech. Use `docs/operations.md`; preserve absent historical fields and unchanged approved identity without migration.

For supported authorized local image transfer, the assistant uses `node scripts/reference-transfer.mjs plan <character-id> <spec.json>` and `send <character-id> <transfer-id> <grant.json>` itself, reusing applicable user authorization. Plan/status are offline; `destination` checks sanitized native identity without login/switching. Follow `templates/reference-transfer.json` and `docs/higgsfield-setup.md`. The pinned Windows x64 CLI sends controlled exact bytes once; uncertain submissions need `status`/`reconcile`, never automatic retry. Check provider original bytes and actual plugin/module access separately: a native receipt does not establish media input readiness. Remote sandbox/attachment helpers do not read arbitrary local studio paths.

**All paths in this skill are relative to the OLYMPOX project root, not the skill folder.** Read `AGENTS.md`; for an existing character, read `influencers/<slug>/persona.json` and its manifest `influencers/<slug>/assets.json`. Preserve approved decisions and identify the next requested result.

Load only the references needed:

- Brief and persona: `templates/brief.md` and `docs/strategy.md`.
- Images, video and voice: `docs/production.md` and `docs/tools.md`.
- Explicit optional BytePlus execution: `docs/provider-execution.md`.
- Review and approval: `docs/quality.md`.
- Structure, commands and versioning: `docs/operations.md`.

Ask only for essential missing information. For reversible choices, recommend a clear direction and record assumptions; avoid a lengthy interview.

For a new character, use the short conversational onboarding in `docs/strategy.md`: offer goal and character-style options, accept "please propose," reuse supplied answers, and present concrete concept options before generation. Existing characters or a complete brief skip discovery that has already been resolved. Do not require special commands or a filled form.

## Choose and preserve the method by stage

Develop concepts, personality, narrative, scripts and planning with the coordinating assistant. Use the saved explicit studio or stage choice for media; Higgsfield is the fallback without an alternative. When Higgsfield is selected, follow its reference method through verified modules, separating source observations and adaptations. BytePlus follows the optional route below and does not establish Builder equivalence or missing capabilities. Integrated images remain an explicit alternative; do not select them automatically. Each stage needs checked access, accepted exact inputs, known cost or authorized uncertainty, export and inspection. Missing capabilities leave the stage pending. The local core prepares without a connection; installation never authenticates or generates.

Before the first paid stage, check the complete pilot path: selected modules, account/workspace, exact-reference transport and reuse, voice/listening, motion/lip-sync, output export and full inspection. Present the estimated whole-pilot scope, available balance, bounded attempts/corrections and unknown charges. Reuse applicable authorization covering that scope rather than asking again for each covered stage. Use confirmed provider media IDs for references already generated there; for local originals, verify an authorized supported transfer, including the official local CLI bridge when prepared. User attachment is a fallback after checking supported automatic routes, not the default instruction. Connection/consent may require user action; never bypass a provider or host restriction.

Plan adaptive discovery and distinct concepts when the direction is open, visual exploration with personality and an in-character scene that expresses the premise, user visual selection, a coherent reference pack and fidelity review, a vocal sample when needed while the persona remains `draft` with `purpose: reference`, final complete visual/vocal canon approval, a pilot before batches, complete media review and export. For a speaking character, generate, listen to and select the vocal sample before final canon approval: `canonHash` binds voice settings and approved references as well as visual identity. Early visual selection does not freeze incomplete canon. Reuse existing approved voice and canon; for silent content, record why voice is not applicable. Exact references require user approval regardless of the chosen provider; Soul ID remains separately justified and authorized when selected.

Recover the user's selected production method from the request, brief, decisions and relevant run inputs before choosing tools. A request to follow the same process as a reference is a method requirement, even when the user does not repeat the provider name. A reference supplied only for inspiration does not select a provider or authorize external actions.

Prepare a versioned plan using `templates/production-method.md`. Map the requested stages to their actual provider, module, connection route and model; record source coverage, exact approved inputs, verified capabilities, dependencies and pending work. Do not claim a transcript establishes unseen screens or a particular module. For the default Higgsfield pipeline, a requested reference method or AI Influencer Builder, apply `higgsfield-studio` and read `docs/higgsfield-influencer-method.md` before planning images or video. A direct Kling video is not evidence of a completed Builder stage.

Save the method plan as a planning output or an input to the applicable local run so its bytes are hashed and observed. Carry it through specialist handoffs. Higgsfield installation and connection are separate production-readiness steps: the framework installer does not perform them, authenticate, or generate. A missing capability leaves that stage pending; prepare the package, identify what is missing and propose alternatives. A switch to paid external generation needs applicable authorization; honor explicit method choices and preserve prior authorizations and approvals. Missing a required Higgsfield module blocks that production stage; an explicit alternative changes the versioned method and attempt. Existing approved canon remains unchanged; new outputs are candidates until inspected, and a provider change does not itself require a new identity approval. Do not migrate approved characters or rewrite historical records, media, approvals, backups or runs. Changes to tracked context follow the existing explicit new-attempt procedure.

## Explicit optional provider execution

When the saved studio choice or an explicit stage decision selects BytePlus, follow `docs/provider-execution.md` and use the independent `scripts/provider-execution.mjs` executor for supported operations. Map the actual model, accepted inputs and remaining stages into the versioned method plan; API image/video does not establish Builder, training, canonical voice, lip-sync or an equivalent complete method. Unsupported stages stay pending without silently changing providers or recreating the character.

Each consumer uses their own account, model access and numerical budget. Direct the user to `node scripts/provider-connect.mjs byteplus --locale en` in the installed studio for hidden terminal input, or allow configuration later. Never ask for keys in chat, argv, public JSON or manually edited credential files. On Windows the DPAPI CurrentUser vault is outside the studio under `%LOCALAPPDATA%/OLYMPOX/credentials`; other platforms do not persist plaintext secrets and can use hidden per-operation memory input. `ARK_API_KEY` and separate `BYTEPLUS_SPEECH_API_KEY` environment values override saved credentials in memory. Local status/configuration does not prove accepted authentication, model/reference eligibility, charges, ownership or media fidelity. Installation stays offline; separate optional local configuration does not authorize generation. The assistant prepares request, budget, grant and evidence records without requiring the creator to write JSON.

The assistant fills `templates/provider-request.json`, `provider-budget.json`, `provider-authorization.json`, `provider-reconciliation.json` and `provider-event.json` from actual context and applicable user decisions; unfilled templates grant nothing. Preserve exact prompt, parameters, reference roles/order and bytes, canon/version and listened-to voice when applicable. Prepare before submitting; submit only the matching authorized job and preserve its intent, receipts, reservations and results. Local budgets reserve comparable USD amounts and retain uncertain charges; they do not guarantee an external invoice ceiling. Reconcile the original uncertain job before any replacement; never replay its generation automatically.

The initial route accepts exact local image/audio inputs where supported; local video-reference transfer stays pending. Preset TTS is only `purpose: reference` draft voice preparation and does not condition on a canonical audio file or clone an existing voice; TTS production stays pending. Export actual new media bytes, register/seal them and inspect the full result through existing procedures. A successful API response, export or paid request never approves canon, completes a review or authorizes publication. A provider change preserves existing identity and uses a new explicit job/attempt when bound context changes. Prove the consumer's authorized full pilot before adopting a primary route or batches.

## Working modes

**Brief and persona.** Define purpose, audience, positioning, personality, voice and editorial boundaries. Create an original fictional adult. When direction is open, propose three genuinely different concepts, each with a premise, recognizable visual signature, attitude, editorial contrast, three content ideas and a sharing hypothesis. Vary combinations of age, silhouette, styling, behavior and perspective; do not reduce the options to attractive ordinary portraits with different hair or clothing. Connect visual choices to voice and repeatable content. Follow `docs/strategy.md` and use `templates/brief.md`; recommend a direction with reasons before consolidating identity.

**Image.** Use verified image/reference modules from the selected provider; Higgsfield is the fallback without a saved or explicit alternative. When Higgsfield is selected, apply `higgsfield-studio` and the versioned method, including Builder or Soul Cinema when required. BytePlus only executes verified supported stages. Integrated images require an explicit decision. Preserve concept, age, silhouette, style and expression; prepare neutral references and an expressive premise scene. The user selects visual identity. Inspect anatomy, presence and continuity across angles/scenes. Inspect references before editing and attach exact selected or approved bytes through supported inputs; a path, hash or prompt mention is not an attachment. Record the bytes actually supplied. For new speaking characters, complete vocal selection before final canon. After complete approval, preserve face, proportion and distinctive-feature invariants.

**Video and voice.** Check actual capabilities and `docs/tools.md`, selecting verified tools for voice, animation, video, lip-sync and specialized work according to need, quality and cost. For the default Higgsfield voice/video stages, apply `higgsfield-studio`: a connected plugin can be used without the local CLI, following `docs/higgsfield-plugin.md`; CLI use follows `docs/higgsfield-setup.md`. Prepare scripts, scenes, references and specifications even when no execution tool is connected. Verify current official documentation and live schemas when relying on external features. Clearly distinguish prepared, generated and verified work; image availability does not demonstrate video or voice availability. Every method retains local intent, exact references, exposed job IDs, sealed media and complete review. A successful generation does not replace listening to audio or reviewing the complete video and its audio when present.

**Content.** Develop concepts, personality, the narrative world, scripts and planning with the coordinating assistant. Write for the approved persona and audience: script, caption, scene sequence and performance direction. Bind each production to its editorial purpose and character references. Preserve the distinction between verifiable facts and character fiction.

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

## Per-stage readiness

Current generation contracts `0.3.0` require structured `stage-readiness-v1` before start and matching completion. The assistant prepares/imports `templates/media-readiness.json` from actual observations using `run-step` action `record-media-readiness`; the creator does not author JSON. Optional `readinessPlanPath` binds an offline plan on start/new-attempt. Whole-pilot feasibility is distinct from exact current inputs and completed outcome: future voice/scene bytes can remain pending. Each required stage needs its actual method-choice decision, access/schema, destination/model exposure, quote/scoped cost uncertainty, applicable pilot/current grants, original-byte export and full inspection support. Unknown is pending, never free. Stage limits cannot override the comparable pilot envelope, which includes captured known completed-stage costs.

Start names `stageId` and captures exact scope/input/quote/grant context; completion requires that capture and matching generated stage/provider/tool/module/route/model evidence. Expiry after valid start does not block matching completion. Status exposes `pipelineReady`, stage pending reasons/outcomes, `currentStageReady`, `canStartStage` and capture identity. Same-plan refresh appends evidence; bound context changes require an explicit new attempt. Unresolved original jobs must be reconciled first. Historical captured `0.1.0`/`0.2.0` retain original semantics/bytes. These private declarations do not authenticate provider access/consent, enforce actual spend caps or prove listening/media quality. See [the exact readiness contract](../../framework/README.md) for fields, scope hashes and transition evidence.
