# Optional provider execution

Use an explicitly selected provider to execute media stages while OLYMPOX preserves the character, canon, narrative, attempts and reviews. Higgsfield remains the default media pipeline. It is not required for a stage whose selected alternative has verified inputs, access, cost, export and inspection support.

BytePlus is an experimental direct API route. Local implementation and synthetic checks do not demonstrate account eligibility, accepted character references, production quality or a successful speaking-character pilot. Keep unsupported stages pending and preserve the [production method](higgsfield-influencer-method.md) and the user's selected scope.

The local core remains usable offline on Node 22+ with no external runtime dependencies. Installing or preparing a studio does not authenticate, submit generation, train identities or publish.

## Configure credentials without editing files

Release candidate 0.6.0-rc.3 includes guided provider choice and private credential configuration. Setup saves the nonsecret choice in `work/studio-settings.json` and offers separate configuration after installation and checks. `--yes` stays offline and never requests or stores secrets.

From the installed studio root:

```sh
node scripts/provider-connect.mjs byteplus --locale en
node scripts/provider-connect.mjs status
node scripts/provider-connect.mjs help
```

Sign in to the [official BytePlus console and create/copy an API key](https://docs.byteplus.com/en/docs/modelark/api-key?redirect=1), then paste it only into hidden terminal input. This web login prepares a key; it is not inference API OAuth login or proof of model access. Check region/project and access compatible with the supported AP route. The speech key is separate and optional for draft-sample TTS; it does not imply cloning or use of an existing canonical voice.

On Windows, the command writes a DPAPI CurrentUser protected vault under `%LOCALAPPDATA%/OLYMPOX/credentials` outside the studio. Do not edit credential files, use keys as arguments or paste secrets in chat. On systems without this protected storage, hidden input can apply only to the current operation in memory; there is no plaintext persistence. You can configure later or use the private process environment.

The `ARK_API_KEY` environment value overrides the saved ModelArk key; `BYTEPLUS_SPEECH_API_KEY` separately overrides the speech key. `status` reports local choice/configuration without revealing secrets or calling the API. Configuration does not establish accepted authentication, model/reference access, charges or media fidelity. The assistant prepares request, budget and authorization records; you do not need to write JSON. Configuration does not authorize paid generation.

## Use your studio's account

Consumers run this reusable code in their independently installed studios. Each studio supplies its own BytePlus account, model access, credentials and applicable spending authorization; OLYMPOX supplies no shared account, API key, credits or centrally operated service.

The supported BytePlus routes use `ARK_API_KEY` for ModelArk and `BYTEPLUS_SPEECH_API_KEY` for speech. The executor receives secrets in memory from the private environment or protected local vault. Keys are never request JSON fields, prompts, canon, jobs, logs, public examples or studio backups. A configured value does not establish account entitlement or model availability.

Private remote output locators are encrypted for recovery with the original consumer credential. The CLI derives the protection key in memory; consumers do not create or paste an extra key into receipts. Keep access to the original credential when recovering an existing job. A changed credential cannot silently retarget an old job or unlock its recorded locators, and character backups do not contain those credentials.

## Explicit execution commands

Run the separate CLI from the installed studio root:

```sh
node scripts/provider-execution.mjs help
node scripts/provider-execution.mjs capabilities
node scripts/provider-execution.mjs budget
node scripts/provider-execution.mjs jobs
```

`capabilities` reports the installed driver's supported operations and prerequisites, not live account discovery. The assistant prepares request, budget and authorization files from the user's scope and verified observations; the creator does not need to author JSON.

| Operation | Purpose |
| --- | --- |
| `budget <budget.json>` | Set the studio's local USD ceiling and optional character limits |
| `prepare <request.json>` | Preserve an exact request and its offline estimate without submitting |
| `submit <job-id> <authorization.json>` | Submit one prepared request with matching explicit authorization and local budget reservation |
| `status <job-id>` | Query the original accepted job and preserve its observed state |
| `export <job-id>` | Save actual outputs as draft files for registration and review |
| `reconcile <job-id> <receipt.json>` | Resolve an ambiguous outcome/cost from matching original-job evidence |
| `cancel <job-id> <event.json>` | Cancel eligible local prepared/queued work with provenance; do not assume remote work was cancelled |
| `dispatch [maximum-jobs]` | Explicitly dispatch a bounded number of authorized queued jobs without replaying uncertain work |

Use the returned job identifier rather than submitting the request file again. Request files identify character, purpose, medium, actual model, prompt/parameters, exact references, destination and optional workflow binding. File paths must remain in the permitted private studio scope or bound character; reference paths are character-relative. Preserve the exported draft job evidence with the character's private records and backup.

Keep the shared private ledger under `work/provider-execution/` as well as the character's `executions/provider-jobs/` receipts and snapshots. Character backups preserve their local evidence but do not contain the entire shared queue/budget. Receipts alone do not rebuild a lost ledger; preserve those shared files separately before recovery or moving a studio.

`status` performs an explicit bounded query of the original job. `dispatch` processes only a bounded selection of already-authorized queued work. There is no background daemon or automatic polling/backoff service; repeating a read/status/export operation does not authorize another generation.

An executor job is separate from a workflow task. A workflow-bound submission records the required intent through the existing readiness/start checks; standalone auxiliary work does not claim task completion. Export does not automatically register assets, seal execution, approve canon, complete a task or publish. Use the existing [asset operations](operations.md) and [workflow transitions](framework-02.md) with the actual returned evidence.

## Private request and grant files

Copy the reusable [request](../templates/provider-request.json), [budget](../templates/provider-budget.json), [authorization](../templates/provider-authorization.json), [reconciliation](../templates/provider-reconciliation.json) and [event](../templates/provider-event.json) templates into the permitted private studio scope and fill them from actual context. Their empty/false/zero authorization placeholders grant no spending permission.

The request uses `schemaVersion: 1`:

| Fields | Meaning |
| --- | --- |
| `characterId`, `purpose` | Bound original adult virtual character; `reference` for exploration or `production` for approved preserved canon |
| `provider`, `medium`, `model` | Explicit `byteplus`, `image`, `video` or `audio`, and a supported exact model ID |
| `promptPath`, `parameters` | Existing character prompt/private work file and only supported provider parameters |
| `references` | Ordered list of `referenceId`, character-relative `path`, `sha256`, `bytes`, `kind`, canonical `role` and zero-based `order` |
| `hasSpeech` | Explicit speech scope; audio requires `true`, images require `false`, and video `parameters.generate_audio` must match it |
| `destination` | `accountLabel` and `region: ap-southeast-1`; the label is a declaration, not verified account discovery |
| `runBinding` | `null` for standalone work, or exact `runId`, `attemptId` and `stageId` for a workflow stage |
| `voiceReuse` | Optional current listening declaration for speaking production under historical canon without `voice.applicability`; never modifies the old canon |

An optional reference `providerRole` maps a canonical role such as `front` or `voice` to a supported API role such as `reference_image`, `first_frame`, `last_frame` or `reference_audio`. Preserve canonical role/order and exact bytes separately. Local image inputs support PNG/JPEG/WebP and audio references support WAV/MP3. Preset TTS preparation exports MP3; other TTS encodings and input-video bindings remain pending in this executor.

Historical speaking canon without `voice.applicability` requires `voiceReuse` with exact `method: listening`, `performed: true`, `referenceId`, character-relative `path`, `sha256`, empty `criticalIssues`/`limitations`, and actual `provenance`. Listen to the preserved approved audio and record its current reuse against those exact bytes. This additive request evidence does not insert fields into the historical voice object or reapprove its old identity; modern canon still uses its existing structured vocal selection. Historical static production does not require vocal reuse.

Preparation computes source hashes, captures the normalized provider request and relevant framework governance, and returns a `job-id` and `requestHash`. Changing a prompt, reference, canon or normalized driver/governance context requires a new prepared job and matching authorization. An estimate alone does not authorize dispatch.

A budget declares `schemaVersion`, positive `maximumUSD`, `perCharacter` USD limits, `maxConcurrent` from 1 to 10 and `provenance`. Authorization declares `schemaVersion`, exact `requestHash`, `explicit: true`, positive `maximumUSD`, `acceptEstimatedCost: true`, explicit `acceptUnknownCost`, a future UTC `expiresAt` and `provenance`. Provenance identifies actual `actor`, UTC `at`, `eventId`, `source` and `notes`; it must not contain credentials or private URLs.

Reconciliation binds `schemaVersion`, `requestHash`, original `providerJobId`, terminal `status`, observed `actualCostUSD` and `provenance`. Do not replace a known provider ID or rewrite a known terminal outcome. `not-submitted` needs real no-submission evidence, no accepted job ID and zero charge; missing evidence does not establish any of those facts. The local ledger records these declarations without independently authenticating invoices or the reviewer.

## Bind execution to workflow readiness

Select `byteplus` for the affected medium in the run's `mediaProviders` and prepare the existing structured readiness plan/observations. Use `tool: olympox-provider-execution`, the exact model ID as `module`, and the driver's sanitized route token:

| Medium | `route` |
| --- | --- |
| Image | `byteplus-modelark-image-http` |
| Video | `byteplus-modelark-video-http` |
| Audio reference | `byteplus-speech-http` |

These are machine tokens; do not put endpoint URLs into readiness `route`. The observed model must match the request model. The driver does not discover verified account/workspace identity: record that destination exposure as `exposed: false`, `value: null`, with a truthful reason/provenance rather than inventing an account fingerprint or equating it with `accountLabel`. Request account/region labels are declarations; the consumer credential fingerprint is bound at submission/recovery without proving account ownership. Match the exact prompt, JSON parameters and reference set, including their paths/hashes/bytes and canonical roles/order. The job receipt/summary exposes its execution metadata for this binding.

Submission runs the captured stage's existing `start`/intent check before the provider POST. Original-job status/reconciliation synchronizes the workflow's external outcome; media completion, registration, sealing and review remain separate. A provider receipt cannot replace the whole-pilot readiness requirements. See [workflow operation](framework-02.md#per-stage-readiness).

## BytePlus driver scope

The initial driver targets `ap-southeast-1` through fixed official API origins. Its catalog is a supported implementation boundary, not an account entitlement check:

| Route | Exposed model | Boundary |
| --- | --- | --- |
| Seedream 5 Pro | `dola-seedream-5-0-pro-260628` | Single image with up to 10 image references |
| Seedream 5 Lite | `seedream-5-0-lite-260128` | Single or sequential image outputs; at most 14 references and 15 combined inputs/outputs |
| Seedance 2.5 | `dreamina-seedance-2-5-260628` | Asynchronous video creation and original-job status queries |
| Seed Speech 2.0 | `seed-tts-2.0` | MP3 preset voice reference synthesis through the HTTP streaming TTS route; no cloning, ICL or WebSocket workflow |

The initial executor transfers exact local image/audio bytes through supported inline inputs where the selected operation accepts them. Input-video transfer remains pending until a verified transport extension is available, even though the underlying driver describes HTTPS/asset bindings. A remote video URL or provider asset alone does not establish exact-byte acceptance. Current model IDs are explicit choices rather than aliases that automatically follow a later model.

Preset TTS can create a draft vocal sample for selection. It does not clone an existing approved voice from another provider or use a canonical sample as audio conditioning. The initial preset route is limited to reference preparation; existing speaking production requiring canonical audio remains pending on that route. Do not claim that an ignored local audio file was remotely attached. Seedance audio-reference support is a separate capability and still requires complete listening/motion review.

## Separate the framework from the media engine

| Responsibility | Required evidence |
| --- | --- |
| Character identity and memory | Approved canon version/hash, exact visual/vocal reference files and preserved snapshots |
| Creative direction | Selected concept, narrative, script, shot specification and versioned method decision |
| Provider execution | Actual provider, route, module/model, accepted inputs, parameters, job identifiers and known costs |
| Media delivery | Actual exported bytes, SHA-256, registered asset and sealed execution context |
| Quality and publication | Complete applicable inspection, exact-file approval and separate publication authorization/evidence |

An API model is not the character's persistent memory. Supply the exact references needed for each operation. A model label, seed, textual description or completed job does not establish continuity. Builder sheets, image/reference generation, identity training, voice and video remain distinct capabilities; replace only the stages the selected route actually supports.

## Check the whole route before paid work

Prepare the [method plan](../templates/production-method.md) and [per-stage readiness](framework-02.md#per-stage-readiness) from actual observations. Verify the intended account/workspace, accepted reference roles/order and current schema, actual model exposure, quote or explicitly accepted uncertainty, applicable authorization, original-byte export and inspection support.

Recorded capabilities constrain workflow completion; they do not discover tools or prove a provider account works. A configured driver likewise does not prove every advertised model or stage is available. Missing account access, reference acceptance, voice, export or inspection keeps the corresponding stage pending. Do not substitute another route silently.

Keep credentials in the selected provider's private environment/configuration mechanism, outside prompts, canon, run evidence, public guides and backups. Provider errors and receipts must not expose secrets or raw account responses. Configure and execute real media work in an independent installed studio; framework development uses synthetic fixtures.

## Preserve exact visual and vocal inputs

Bind the character, canon version/hash, prompt/parameter files and actual attachments before submission. Record input bytes/hash, role/order and provider identifiers where exposed. A local filename or URL claim does not prove those bytes reached the operation. Verify transformations and limitations explicitly. Changing bound inputs, provider, model or method requires the existing [new-attempt procedure](framework-02.md#resume-work-and-review-context-changes).

For an existing character, a new provider image is a derivative candidate until inspected. Do not replace approved references, rewrite history or regenerate a different face to satisfy an API restriction. If the exact canon cannot be used, keep that stage pending and present the required adaptation for a material decision.

For a speaking character, use the approved vocal selection and verify that the route accepts the applicable exact audio reference. Native generated speech or timbre guidance alone does not establish the approved voice. New characters remain `draft` through generation, listening and selection of their vocal sample; silent scope is explicit and does not authorize speech. Check Portuguese pronunciation, accent, rhythm, meaning and lip-sync when pt-BR is the intended language. See [canon preparation](production.md#complete-visual-and-vocal-canon) and [quality](quality.md).

## BytePlus portrait restrictions

The [official portrait asset guide](https://docs.byteplus.com/en/docs/modelark/seedance-portrait-asset-guide) documents restrictions for Seedance 2.5/2.0 references containing real human faces. Its trusted ModelArk-output route depends on supported original outputs from the same account within the stated 30-day window; cross-platform/account material and edited copies do not acquire that eligibility. Preset avatars do not establish a specific existing character, and verified real-person assets have their own authorization procedure.

That rule is not proof that every externally generated fictional face is rejected or accepted. Verify the actual character references and classification in the intended account before adopting the route. Provider-origin or account-bound asset eligibility can constrain portability even when the adapter interface is interchangeable. Keep any such limitation in the method plan and production evidence; do not automatically recreate the canon inside the provider.

## Keep execution and approval separate

Persist intent and exact authorized scope before a submission. Retain original request/job identifiers. A timeout or interrupted response does not establish that no paid job exists. Query and reconcile the original job before another submission; never retry an ambiguous generation automatically through another provider.

Recovery depends on preserved durable state and the provider's available results. Asynchronous video can query its original ID and refresh output locators without generating again. Synchronous image/TTS responses have no supported original-job query: a process failure after recording the result metadata but before staging the first media bytes can leave a known outcome and retained reservation without recoverable local outputs. Export then remains pending on supported original-provider/manual recovery. Do not automatically regenerate to fill that gap or claim that every crash window restores every byte.

Track costs with their units and provenance. Unknown cost is not free, credits are not a monetary amount without a justified conversion, and a quote is not authorization. Include rejected attempts, corrections and in-flight work when checking the applicable budget. Local accounting cannot discover calls made outside the recorded execution path or replace a provider's actual invoice.

The initial executor ledger uses USD. Keep offline estimates, the explicit authorized maximum, held reservations and observed actual charges separate. Unknown final charge conserves the reservation until supported reconciliation; a completed or exported job does not itself establish zero or final cost. The local ceiling covers this executor's submissions, not a verified provider-side spending cap.

Export actual outputs as new files, register and seal them, then inspect the complete media against exact canon and script. Images need visual review, audio needs listening, and video needs full motion/audio review. A successful API response or valid hash does not approve the asset. Corrections, editing and compression create new versions for review.

## Prove a pilot before changing defaults

Use a representative pilot in the intended medium and keep identity, references, scene, script, duration, resolution, aspect ratio and review criteria comparable. Record differences in actual model version, accepted inputs, prompt processing and post-processing rather than assuming equal commercial names produce equal results.

Evaluate cost per approved output, including discarded attempts, alongside continuity, voice, motion, latency and correction effort. Critical quality failures prevent approval regardless of an average score. BytePlus remains experimental until the intended route passes its real-reference and complete-media acceptance; the current default is not changed by configuring an alternative.

To return to a previously selected route, reconcile outstanding jobs first and create an explicit new attempt with a reason. Preserve all prior inputs, outputs, costs, decisions and history. See [workflow operation](framework-02.md), [production](production.md) and [quality](quality.md).
