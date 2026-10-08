# Tools and integration

CLI sources consulted: **October 7, 2026**; Higgsfield plugin catalog checked: **October 8, 2026**. Check capabilities, plans, and commands again before use: this information can change.

## Images

For new influencer creation and later visual work, default appearance, candidates, references, settings, images, and edits to integrated ChatGPT/Codex generation when available. Follow [integrated visual creation](integrated-images.md) and the host's actual image-tool instructions. This path requires no Higgsfield, AI Influencer Builder, external CLI, or API key. Tool availability and account limits apply; never describe it as free or unlimited. An explicit user-selected method/provider takes precedence. Record real generations in the character folder.

For consistency, open and compare the approved set, describe anchors, and attach images to the request. A prompt containing a path does not send that file. A grid is useful for selection, but the final reference for each angle must have its own readable file. Copy results belonging to the project into the character folder, preserving the original version.

Distinguish visual inspiration from a request to follow the demonstrated process. Preserve a requested method and the tool chosen for each stage in a versioned [production-method plan](../templates/production-method.md); inspect the source before claiming its modules. Concepts, personality, narrative world, scripts, and planning stay in ChatGPT/Codex. Voice, animation, video, lip-sync, and specialized work use verified tools according to need, quality, and cost; Higgsfield remains an optional choice for useful stages. Missing capabilities leave the stage pending with proposed alternatives; a switch to paid external generation needs applicable authorization. A user preference observed after changing art direction/framing is process evidence, not a controlled model comparison or proof of general provider superiority. Controlled comparisons require the same identity, scene, camera, and scoped budget. LoRA or Soul ID are optional when fidelity and volume justify separately authorized training.

## Higgsfield — plugin or local CLI

OLYMPOX supports two optional conversational routes. Codex selects and calls the capabilities actually available in the studio, while the local core preserves context, attempts, and reviews. There is no automatic Higgsfield provider adapter or submission through the core.

| Route | Preparation | Actual execution |
| --- | --- | --- |
| Higgsfield plugin | Discover and install the plugin in the host, connect the user's account, and check its exposed tools and schemas; no local CLI required | Available plugin tools for the requested media, references, and supported creative workflows |
| Local CLI | Install the inspected, pinned CLI separately, then connect the user's account | The local native executable with confirmed model parameters; the preparation wrapper permits only its documented operations |

The plugin catalog describes image/video generation, reference inputs, creative presets, and UGC workflows. A catalog entry or installed skill does not establish callable tools, account access, model availability, or CLI feature parity. Follow the [plugin guide](higgsfield-plugin.md) for discovery, connection, capability checks, and traceable production. Use `higgsfield-studio` to select the route; do not require the CLI when the plugin provides the needed capability.

For the CLI route, the framework supplies a local wrapper and inspected provider-source provenance in `vendor/higgsfield-skills`. Its baseline expects official CLI **1.1.26** in `tools/higgsfield`, installed and checked separately. `doctor`, `version`, and `help` check local preparation without login. Follow [local CLI setup](higgsfield-setup.md) before using interactive `login` or querying account, workspace, credits, and model schemas. **A native `generate cost` estimate with local media can upload those files**; the preparation wrapper rejects these inputs and permits simple parameters only. The wrapper does not submit production jobs or impose a server-side spending cap.

The [official CLI guide](https://higgsfield.ai/creator-hub/help-center/integrations/how-do-i-access-higgsfield-via-cli) describes account login and credits without an API key, and distinguishes CLI/MCP from free or unlimited website generations and the separate API product. Verify the actual billing terms for the chosen plugin or CLI route before production; do not assume their terms or account sessions are shared. The [official skills](https://higgsfield.ai/skills) and [provider repository](https://github.com/higgsfield-ai/skills) are source material whose current capabilities still need checking.

Both routes use the same production rules: approved canon where required, exact attached inputs and hashes, recorded external intent before submission, exposed identifiers/model/cost, preserved local media versions, execution seals, and complete inspection. A path written in a prompt does not attach a file. Unknown cost remains unknown. An uncertain submission requires real querying and reconciliation before another attempt; switching to the CLI or plugin does not justify a duplicate submission. Keep unavailable generation, export, or inspection pending. Never store passwords, tokens, or keys in character files, runs, manifests, or commits.

Framework installation supplies reusable instructions and local records; it does not install or authenticate either provider route, send media, or require a paid generation test. Each studio supplies its own provider access and applicable authorization.

## Video delivery

Follow the [Codex-to-video procedure](production-handoff.md) and its [handoff template](../templates/video-handoff.md). Prepare scripts, approved identity/voice and inspected scene images first, then verify the exact specialized operation and supported input subset. Higgsfield can supply video or earlier voice when selected; Builder is not required for that handoff. Complete pilot review precedes batches.

Vertical briefs can start at 9:16 with a target resolution of 1080 × 1920, adjusted to the model's and channel's real capabilities. Upscaling does not recover lost identity. Confirm duration, speech, reference support, audio, lip-sync, and export before promising a deliverable. Do not replace temporal review with isolated captures.

Without connected execution, Codex can still prepare the complete package: exact script, shots, performance, references, voice, captions, publication text, and review criteria. Identify the deliverable as a **production package**, without claiming a rendered video exists.

## Codex

`AGENTS.md` provides project guidance; `.agents/skills/olympox` contains the reusable process. The [official skill documentation](https://developers.openai.com/codex/skills) describes local discovery. If the skill is absent from the selector, reload Codex; it can also be read directly in this conversation. Installed files do not prove automatic loading in the app.
