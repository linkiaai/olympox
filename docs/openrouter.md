# OpenRouter video route

Use OpenRouter when the user explicitly selects it for a video stage. Choose Higgsfield or OpenRouter explicitly; neither is preselected. The OpenRouter adapter targets **Seedance 2.5**, model ID `bytedance/seedance-2.5`. Choosing this route does not migrate an approved character or replace other production stages.

The adapter uses Node 22+ built-in APIs and `OPENROUTER_API_KEY` from the process environment. It does not install a provider SDK, save the API key, authenticate during framework installation, or generate automatically. Keep credentials out of specifications, prompts, readiness evidence and source control.

## Check the selected model

```sh
node scripts/openrouter-local.mjs doctor
node scripts/openrouter-local.mjs models
node scripts/openrouter-local.mjs model bytedance/seedance-2.5
```

`doctor` checks whether the environment variable is present and emits its credential fingerprint without exposing the key; it does not authenticate or prove an account/workspace identity. `models` reads the public video catalog and `model` reads endpoint metadata without submitting generation. Refresh metadata before preparing a paid stage; a catalog entry does not establish access, available balance, accepted character references, successful generation or media quality. Media preparation, sending, status and export run only in an independent installed studio.

On October 15, 2026, the public [video catalog](https://openrouter.ai/api/v1/videos/models) returned `bytedance/seedance-2.5` with canonical ID `bytedance/seedance-2.5-20260807`, durations of 4–30 seconds, 480p/720p output, first/last frame support, generated audio and a seed. It listed aspect ratios `16:9`, `4:3`, `1:1`, `3:4`, `9:16`, `21:9` and passthrough keys `watermark`, `req_key`, `output_format`. Do not infer 1080p or 4K support from another Seedance variant.

The [model description](https://openrouter.ai/bytedance/seedance-2.5) reports image, video and audio references. Verify the actual selected inputs and policy separately. Generated audio does not establish a reusable voice identity, vocal selection or a standalone voice-generation service.

## Preserve exact inputs and authorization

Prepare a [production-method plan](../templates/production-method.md) and the existing [stage readiness](framework-02.md) evidence. Record provider `openrouter`, exact model, actual route/tool/module, input roles, applicable authorization and cost uncertainty. The route uses capabilities `video-generation` and `openrouter:video-generation`; no image-generation or standalone voice capability follows from them.

The assistant prepares a specification from [the version 2 template](../templates/openrouter-video-v2.json) and saves a version under `work/`, such as `work/seedance-video-v002.json`. The [version 1 template](../templates/openrouter-video.json) remains supported for inline images with its original byte contract. Replace the template's null `credentialFingerprint` with the hexadecimal fingerprint observed through `doctor`. Prepare a UTF-8 prompt file under the character's `prompts/` and references under its `references/` or `media/`. Set explicit `duration`, `resolution`, `aspect_ratio` and `generate_audio`; `seed` is optional. Each reference records `path`, `sha256`, `bytes`, `referenceId`, `role`, `usage` and zero-based `order`. Preserve its approved canonical `role`, such as `front` or `three-quarter`. Version 2 also records `mediaType` (`image`, `audio` or `video`) and `transport`. All local paths are relative to the studio root.

Use `usage: "reference"` for mixed image, voice and video guidance in `input_references`. Only images may use `first_frame` or `last_frame`; the adapter refuses a combination of frames and general references because OpenRouter gives frames precedence and may ignore the audio/video references. A speaking-canon run must attach the exact selected canonical audio as `mediaType: "audio"`, `role: "voice"`, with `generate_audio: true`. A video's soundtrack cannot replace that canonical audio attachment.

Use provider `openrouter`, requested model `bytedance/seedance-2.5`, module `video-generation`, route `openrouter-api` and tool `openrouter-local` in the readiness stage. Include the exact specification, prompt and references in its captured inputs with kinds `parameters`, `prompt` and `reference`. Reference IDs, roles and order must match. An approved-canon run needs an actual visual reference from that canon; prompt-only generation remains pending. Start the corresponding generation stage with readiness evidence and record planned external intent for `openrouter` before submission. A changed prompt, reference, provider, model, credential or tracked governance context follows the existing new-attempt procedure; retain original bytes, approvals and job evidence.

```sh
node scripts/openrouter-local.mjs prepare <spec.json>
node scripts/openrouter-local.mjs send <run-id> <spec.json>
node scripts/openrouter-local.mjs status <run-id>
node scripts/openrouter-local.mjs export <run-id> <output.mp4>
```

`prepare` reads local bytes, resolves the named URL environment variables and checks their fingerprints without network calls. It prints sanitized typed input metadata, hashes, parameters and request hash, without reference bytes or URLs. `send` requires the captured started stage and planned external intent, rechecks current catalog support, verifies HTTPS reference bytes before the paid POST and makes one submission. A character-owned receipt under `influencers/<id>/.openrouter/<run-id>/<capture-id>.json` preserves safe typed reference metadata, HTTPS readback observations, the attempt and known job ID, and travels with the existing character backup. It stores neither signed URLs nor credentials. It never automatically retries a submission whose outcome may involve a charge. After an interruption, inspect the receipt and query that same job with `status`; a terminal status reconciles the original core job. An uncertain outcome without a usable job ID stays pending for reconciliation through actual service evidence; do not create another charge to discover what happened.

`send`, `status` and `export` verify the environment key against the bound fingerprint. Keep the original key available for original-job reconciliation and export. A different key requires a new authorized attempt after unresolved original work is reconciled; changing credentials never authorizes a repeat charge. The fingerprint binds a credential, not a verified account identity or provider consent.

`export` retrieves completed output bytes into a new `.mp4` under the bound character's `media/` or `exports/` and refuses an existing destination. Export is followed by normal asset registration, execution sealing and complete review; the download itself does not finish the generation contract or approve the asset.

## Reference transport

OpenRouter's [video guide](https://openrouter.ai/docs/guides/overview/multimodal/video-generation) distinguishes `frame_images` for exact first/last frames from `input_references` for guidance. Frame images take precedence when both are supplied; choose the intended mode explicitly so references are not silently ignored.

The official [video API reference](https://openrouter.ai/docs/api/api-reference/video-generation/submit-a-video-generation-request) documents audio/video `input_references` for Seedance generation 2 and newer. The [OpenAPI source](https://github.com/OpenRouterTeam/docs/blob/main/openapi/openapi.yaml) defines `audio_url`/`video_url` entries with nested `url` strings; the [Seedance 2.5 guide](https://openrouter.ai/blog/insights/seedance-2-5-review/) demonstrates HTTPS video references. The [OpenRouter video skill source](https://github.com/OpenRouterTeam/skills/blob/main/skills/openrouter-video/SKILL.md) separately documents inline image data URLs. This adapter does not infer inline audio/video support from a URL field or from chat-understanding APIs.

For an inline PNG/JPEG/WebP image, use `transport: {"kind":"inline"}`. For an audio or video reference, use `transport: {"kind":"https","urlEnv":"OLYMPOX_OPENROUTER_REFERENCE_VOICE_URL","urlSha256":"<64-hex-digits>"}`. Version 2 can also send an image through HTTPS. The URL stays in the named process environment variable; the specification binds its SHA-256 fingerprint rather than the secret URL. Obtain the fingerprint and sanitized origin offline with:

```sh
node scripts/openrouter-local.mjs reference OLYMPOX_OPENROUTER_REFERENCE_VOICE_URL
```

The assistant obtains temporary or versioned HTTPS access to the exact local bytes through an already authorized media/storage tool. This adapter does not upload files or provision storage. If no suitable route exists, keep the transfer stage pending with alternatives; do not default to asking the user to drag files manually. Missing keys or URL variables remain pending and are never filled by framework installation. URLs must be directly retrievable without custom authentication headers. Treat a signed URL as a secret and scope its lifetime/access for the authorized job. A changed URL fingerprint requires a new captured attempt.

Before submitting, `send` performs a bounded HTTPS GET and compares the retrieved hash and byte count with the captured local reference. It sends no OpenRouter authorization to storage, and refuses redirects and private-network destinations. This observes matching bytes at that moment; it cannot guarantee that the provider later fetches the same bytes, accepts the reference or preserves identity. A filename in a prompt is not an attachment. Record source hashes, transport evidence and observed output separately.

Supported local formats are PNG/JPEG/WebP images; WAV, MP3, FLAC, Ogg audio and M4A audio; and MP4 video containing a video track. File signatures are recognized and MP4 track handlers are checked; these checks do not decode or audition media. Version 2 limits each image to 16 MiB, audio to 32 MiB and video to 64 MiB, with 64 MiB total reference bytes. Version 1 retains its 16 MiB aggregate limit. These are adapter limits, not verified provider limits; confirm the actual formats, durations and applicable policy for the chosen inputs before a live pilot.

The API's provider passthrough uses `provider.options.<provider-slug>.parameters`. The checked Seedance endpoint is `seed`; options for a different provider can be ignored. This adapter currently accepts only the normalized parameters listed above and sends no passthrough or provider-pinning fields. Keep the captured endpoint/model evidence and recheck changes before a new paid attempt.

## Cost, completion and review

The live catalog returned USD/token SKUs `video_tokens: 0.0000107`, `video_tokens_without_audio: 0.0000107`, and `video_tokens_with_video_input: 0.0000064`. These are dated observations, not a spend cap. The official [Seedance guide](https://openrouter.ai/blog/insights/seedance-2-5-review/) describes estimated video tokens as `(width × height × 24 × duration) / 1024`; final billing uses provider-reported tokens. A 10-second 1280×720 base-rate estimate is about USD 2.31. Video-input billing can depend on input footage; the guide describes a flat USD 2 preauthorization for that route, which is not a final price or cap. Budget the actual footage and output scope. Unknown cost needs scoped authorization; record actual returned cost when available.

Video jobs are asynchronous: submit, poll, then download. Stop on `completed`, `failed`, `cancelled` or `expired`; a transient status-query error is not permission to resubmit. Download URLs carrying signatures are secrets; use the authenticated content route without exposing credentials or temporary signed links in records. OpenRouter's video guide states that video generation is incompatible with enforced Zero Data Retention.

Review the complete exported video and listen to its audio against the approved references and script. Preserve the selected canonical voice, keep unavailable stages pending, and inspect a pilot before batches. Transport support does not guarantee voice cloning or character identity. Local tests, structural media checks and catalog checks prove neither live provider behavior nor identity, diction, lip-sync or continuity.
