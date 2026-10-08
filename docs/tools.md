# Tools and integration

CLI sources consulted: **October 7, 2026**; Higgsfield plugin catalog checked: **October 8, 2026**. Check capabilities, plans, and commands again before use: this information can change.

## Images

The initial route is the integrated image generation/editing tool when available in the Codex session. This integrated workflow does not require configuring a local API key. Use the installed imagegen skill and its current instructions; record real generations in the character folder.

For consistency, open and compare the approved set, describe anchors, and attach images to the request. A prompt containing a path does not send that file. A grid is useful for selection, but the final reference for each angle must have its own readable file. Copy results belonging to the project into the character folder, preserving the original version.

Do not choose a provider solely from a demonstration. Run the same pilot with the same identity, setting, camera, and budget; compare visual acceptance rate, review time, and cost per approved asset. Changing the model or version requires retesting. LoRA or Soul ID can be future options when fidelity and volume justify training; they are not required to begin.

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

Vertical briefs can start at 9:16 with a target resolution of 1080 × 1920, adjusted to the model's and channel's real capabilities. Upscaling does not recover lost identity. Confirm duration, speech, reference support, audio, lip-sync, and export before promising a deliverable. Do not replace temporal review with isolated captures.

Without connected execution, Codex can still prepare the complete package: exact script, shots, performance, references, voice, captions, publication text, and review criteria. Identify the deliverable as a **production package**, without claiming a rendered video exists.

## Codex

`AGENTS.md` provides project guidance; `.agents/skills/olympox` contains the reusable process. The [official skill documentation](https://developers.openai.com/codex/skills) describes local discovery. If the skill is absent from the selector, reload Codex; it can also be read directly in this conversation. Installed files do not prove automatic loading in the app.
