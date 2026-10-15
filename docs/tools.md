# Tools and provider readiness

Use this guide to select the execution route and check whether a studio can complete its planned media. OLYMPOX supplies local records and instructions; Codex or Claude Code uses the tools available in its session. Framework installation does not connect a provider or generate media.

## Responsibilities

| Work | Explicit route or local responsibility | Check before use |
| --- | --- | --- |
| Research, concept, personality, narrative, scripts and planning | Conversational coordinator | Sources, character context and requested deliverable |
| Candidates, reference packs, scenes and image edits | Verified image route chosen by the person; Higgsfield when selected | Selected module, exact reference inputs, export and visual inspection |
| Voice, animation, video and lip-sync | Verified route chosen per stage; Higgsfield when selected | Required audio/motion inputs, supported operation, listening and complete video review |
| Local runs, canon history, asset records and backups | OLYMPOX commands | Exact files, versions and recorded decisions |
| Assistant-integrated images | Explicit user-selected alternative | Image generation, attachment, export and inspection tools in the host |
| Seedance 2.5 video through OpenRouter | Explicit user-selected alternative | Current video catalog, captured stage readiness, exact local references, applicable spending authorization and full output review |

Choose Higgsfield or OpenRouter explicitly; neither is a default and their stage capabilities differ. Setup saves only that choice in `work/provider-choice.json`: Higgsfield selects image/video/audio routes, while OpenRouter selects video only. Missing choices leave generation pending without blocking offline preparation. An explicit run map can select verified methods per medium. The [production method](higgsfield-influencer-method.md) separates its modules and the [source study](video-reference.md) explains the reference behind that method. A website feature or installed skill does not establish callable access in your assistant.

## Choose a Higgsfield route

Use the [plugin](higgsfield-plugin.md) when its connected tools accept the required inputs. It does not require a local CLI. The [optional local CLI](higgsfield-setup.md) can supply separately verified operations or transfer local references where supported. Their account sessions, models, input mechanisms and billing can differ; verify the chosen route independently.

The framework's CLI wrapper supports local integrity checks, interactive login and limited queries. It does not submit generation, upload media or train identity. Neither route has an automatic submission adapter in the local core.

For local references, check supported tool transfer before proposing manual attachment. Reuse confirmed provider media IDs where suitable. A path written in a prompt does not attach a file; record which exact files/hashes reached the provider and their input roles.

## Choose the optional OpenRouter video route

Follow [OpenRouter video](openrouter.md) for the explicitly selected `bytedance/seedance-2.5` route. The dependency-free adapter uses `OPENROUTER_API_KEY` from the environment and capabilities `video-generation` and `openrouter:video-generation`. It provides public catalog queries, request preparation, one authorized submission, same-job status and original-byte export. Submission requires existing captured stage readiness and recorded external intent; uncertain submissions are preserved without automatic retry.

Version 1 keeps exact inline PNG/JPEG/WebP references. Version 2 adds typed audio/video references through HTTPS URLs held in named environment variables and bound by URL fingerprint. The assistant obtains access through authorized existing media/storage tools; the adapter provisions no storage. Before a paid submission it checks retrieved bytes against the captured local hash/size, refuses redirects/private networks and sends no OpenRouter credentials to storage. A speaking-canon run needs the exact selected audio with `role: "voice"` and `generate_audio: true`; a video's soundtrack is not a substitute. Review the full exported video and listen to its audio before batches. Missing transport/access stays pending, and local checks cannot guarantee provider fetches or voice identity. Provider choices remain explicit, and approved canon and history remain intact.

## Check the whole pilot before the first paid stage

Save a [production-method plan](../templates/production-method.md) covering:

1. The selected modules and callable operations for identity, references, voice when needed, scenes and the pilot.
2. Account/workspace access, supported reference transfer and reuse, and current parameter schemas.
3. How actual outputs will be exported and inspected: images visually, audio by listening, and video with complete motion/audio review.
4. Stage estimates, units, available balance, attempt/correction limits and unknown charges. Keep credits separate from monetary cost.
5. Applicable authorization for uploads, paid generation and any optional training. Reuse authorization already covering the scope.

If a required stage is unavailable, identify the missing capability, next action and a proposed alternative. Keep that stage pending. [Integrated images](integrated-images.md) require an explicit alternative choice; missing Higgsfield access does not select them automatically.

## Record execution and delivery

Persist external intent before submission, retain returned job IDs, and reconcile uncertain results through the original job before retrying. Save outputs as new local versions, register them, seal their declared context and inspect the exact final files. See [plugin execution](higgsfield-plugin.md), [local operations](operations.md) and [quality](quality.md).

For video, prepare the [shot handoff](production-handoff.md) and approve an inspected pilot before batches. A provider preview, completed job or local test does not establish final fidelity. Delivery uses reviewed bytes; publication requires its own applicable authorization and actual evidence.

## Provider source material

The preserved CLI/skill baseline and license are inventoried in [vendor provenance](../vendor/higgsfield-skills/provenance.json). Imported references guide schema and prompt research; they do not activate a provider, authorize charges or demonstrate quality. Check the current provider catalog and the session's real tools rather than relying on model lists or prices copied into documentation.
