# Tools and provider readiness

Use this guide to select the execution route and check whether a studio can complete its planned media. OLYMPOX supplies local records and instructions; Codex or Claude Code uses the tools available in its session. Framework installation does not connect a provider or generate media.

## Responsibilities

| Work | Default route | Check before use |
| --- | --- | --- |
| Research, concept, personality, narrative, scripts and planning | Conversational coordinator | Sources, character context and requested deliverable |
| Candidates, reference packs, scenes and image edits | Saved studio choice; Higgsfield fallback | Selected module, exact reference inputs, export and visual inspection |
| Voice, animation, video and lip-sync | Saved studio choice; Higgsfield fallback | Required audio/motion inputs, supported operation, listening and complete video review |
| Local runs, canon history, asset records and backups | OLYMPOX commands | Exact files, versions and recorded decisions |
| Assistant-integrated images | Explicit user-selected alternative | Image generation, attachment, export and inspection tools in the host |

Higgsfield is the default media provider. The [production method](higgsfield-influencer-method.md) separates its modules and the [source study](video-reference.md) explains the reference behind that method. A website feature or installed skill does not establish callable access in your assistant. An explicitly selected [optional provider route](provider-execution.md), including experimental BytePlus execution, can supply verified stages without Higgsfield.

## Read the choice and configure later

The assistant reads `work/studio-settings.json` before choosing tools for new work and respects explicit stage choices. Existing attempts retain captured methods and providers; changing the preference does not alter canon or history. Guided setup offers default Higgsfield or experimental BytePlus, saves the choice and, after offline checks, offers configuration now or later. These onboarding and connection steps are included in release candidate 0.6.0-rc.3.

For BytePlus, run `node scripts/provider-connect.mjs byteplus --locale en` from the studio root. Paste keys only into hidden terminal input, never in chat, as arguments or through manual file editing. The Windows vault is outside the studio and uses DPAPI CurrentUser; unsupported systems do not persist plaintext secrets. `node scripts/provider-connect.mjs status` reports local configuration without proving actual access, charges or fidelity. The assistant prepares the required records and checks the whole pilot. See [credentials and limits](provider-execution.md#configure-credentials-without-editing-files).

## Choose a Higgsfield route

Use the [plugin](higgsfield-plugin.md) when its connected tools accept the required inputs. It does not require a local CLI. The [optional local CLI](higgsfield-setup.md) can supply separately verified operations or transfer local references where supported. Their account sessions, models, input mechanisms and billing can differ; verify the chosen route independently.

The framework's Higgsfield CLI wrapper supports local integrity checks, interactive login and limited queries. It does not submit generation, upload media or train identity. Neither Higgsfield route has an automatic submission adapter in the workflow core; the separate optional executor does not turn plugin/CLI calls into a shared Higgsfield session.

For local references, check supported tool transfer before proposing manual attachment. Reuse confirmed provider media IDs where suitable. A path written in a prompt does not attach a file; record which exact files/hashes reached the provider and their input roles.

## Choose an optional direct API route

Each independent studio uses its own provider account, keys and budget; the framework supplies reusable code and records rather than a central service. BytePlus is an explicit experimental alternative for supported operations. Check real model access, accepted exact references, voice dependencies, account/region restrictions, export and costs before paid work. Configuration and declared capability strings do not establish those observations.

Use [provider execution](provider-execution.md) for boundaries, credentials, reference restrictions and pilot criteria. A missing required stage stays pending. An explicit video-only BytePlus choice does not change other media; the studio preference seeds all media in new runs, subject to overrides and supported capabilities. No choice migrates canon, trains identity or approves media.

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
