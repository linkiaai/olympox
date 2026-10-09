# Tools and integration

CLI sources consulted: **October 7, 2026**; plugin metadata checked: **October 8, 2026**; current AI Influencer documentation checked: **October 9, 2026**. Check tools, schemas, plans and billing again before production because they can change.

## Images

For new influencers and later media, default to [Higgsfield’s reference method](higgsfield-influencer-method.md). Codex or Claude coordinates concept, personality, narrative, scripts, prompts and records. Higgsfield’s verified modules produce identity images, references, scenes, voice, animation, video and lip-sync. Integrated coordinator image generation is not required and is an [explicit opt-in alternative](integrated-images.md). Preserve the selected process, verify actual capabilities and costs, and save real output bytes in the character folder.

For consistency, open and compare the approved set, describe anchors, and attach images to the request. A prompt containing a path does not send that file. A grid is useful for selection, but the final reference for each angle must have its own readable file. Copy results belonging to the project into the character folder, preserving the original version.

Distinguish visual inspiration from a request to follow the demonstrated process. The [reference study](video-reference.md) establishes Soul Cinema image/references, separate Claude voice direction and Seedance 2.5 video; it does not prove exclusive Builder use. The current [AI Influencer documentation](https://higgsfield.ai/blog/new-ai-influencer) distinguishes Builder and Motion/Genjutsu with Cinema Studio reuse. Save the selected module/order and any accepted adaptation in the [production-method plan](../templates/production-method.md). Check full-pilot connection, transport, inspection/export and scoped budget early. Missing capabilities remain pending with concrete alternatives, and materially changed methods or costs require the user’s decision and applicable authorization. A workflow preference is not a controlled quality comparison or a guarantee of source results. Soul ID remains optional training with demonstrated need and separate authorization.

## Higgsfield — plugin or local CLI

OLYMPOX supports complementary plugin and local CLI transports for the default Higgsfield media pipeline. The coordinator uses actual tools and the local core preserves context, attempts and reviews. There is no automatic core provider-submission adapter. A plugin can execute without CLI where it handles the exact inputs; an authorized official CLI upload can bridge local studio files to confirmed plugin media IDs, following [reference transfer](higgsfield-plugin.md#transfer-exact-studio-references). Resolve supported operational transport autonomously; do not default to manual photo dragging.

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

Follow the [Higgsfield pilot procedure](production-handoff.md) and [handoff template](../templates/video-handoff.md). The coordinator prepares script/shot direction; verified Higgsfield modules create identity/reference and scene images and voice when speaking. Approve complete canon, map exact supported inputs and validate a representative video pilot before batches. The observed modules and current Builder/Motion operations are distinct; required stages cannot be completed by simply choosing a video model.

Vertical briefs can start at 9:16 with a target resolution of 1080 × 1920, adjusted to the model's and channel's real capabilities. Upscaling does not recover lost identity. Confirm duration, speech, reference support, audio, lip-sync, and export before promising a deliverable. Do not replace temporal review with isolated captures.

Without connected execution, the coordinator can still prepare the complete package: exact script, shots, performance, references, voice, captions, publication text, and review criteria. Identify the deliverable as a **production package**, without claiming a rendered video exists.

## Conversational coordinator

Install the selected local assistant target as described in [installation](installation.md): Codex uses `AGENTS.md` and `.agents/skills`; Claude Code uses `CLAUDE.md` and `.claude/skills`. The [Codex skill documentation](https://developers.openai.com/codex/skills) explains Codex discovery. Installed files do not prove runtime loading, available subagents, provider access or Claude web/cloud support. Reopen/reload the host and inspect actual tools. The standard method requires available local file/Node operations, generation tools and full media inspection, rather than assistant-native image generation.