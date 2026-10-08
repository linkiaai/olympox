# Tools and integration

Sources consulted: **October 7, 2026**. Check capabilities, plans, and commands again before use: this information can change.

## Images

The initial route is the integrated image generation/editing tool when available in the Codex session. This integrated workflow does not require configuring a local API key. Use the installed imagegen skill and its current instructions; record real generations in the character folder.

For consistency, open and compare the approved set, describe anchors, and attach images to the request. A prompt containing a path does not send that file. A grid is useful for selection, but the final reference for each angle must have its own readable file. Copy results belonging to the project into the character folder, preserving the original version.

Do not choose a provider solely from a demonstration. Run the same pilot with the same identity, setting, camera, and budget; compare visual acceptance rate, review time, and cost per approved asset. Changing the model or version requires retesting. LoRA or Soul ID can be future options when fidelity and volume justify training; they are not required to begin.

## Higgsfield — video and voice

The [official guide](https://higgsfield.ai/creator-hub/help-center/integrations/how-do-i-access-higgsfield-via-cli) recommends CLI + skills for Codex. This route uses login and credits from the Higgsfield account; it does not require an API key. Unlimited models and free generations do not apply to CLI/MCP; the API is a separate product. The [official skills](https://higgsfield.ai/skills) and [provider repository](https://github.com/higgsfield-ai/skills) provide current instructions.

**Optional integration:** the framework includes the `higgsfield-studio` skill, a local wrapper, and inspected provider-source provenance in `vendor/higgsfield-skills`. The wrapper's baseline expects official CLI **1.1.26** in `tools/higgsfield`, installed and checked separately. Provider binaries, account sessions, balances, and generation results are supplied by each studio. See [Higgsfield setup](higgsfield-setup.md) for preparation, commands, and provenance.

When the user chooses this provider:

1. Use the `higgsfield-studio` skill and `node scripts/higgsfield-local.mjs` wrapper. `doctor`, `version`, and `help` check preparation without login; do not reinstall everything or alter global PATH/configuration.
2. When connection is requested, run interactive `login`. The user completes OAuth; confirm session storage outside the project before considering the connection complete.
3. Check the account, workspace, credits, and model schemas using the guide's read operations. Define budget and attempts before jobs. **A `generate cost` estimate with local media can send files**; the preparation wrapper rejects those inputs and allows only simple parameters.
4. With the applicable identity, references, and authorization, persist job intent and use the pinned local executable for production. The wrapper does not submit requests or impose a server-side spending cap.
5. Generate a short video; review speech, movements, and the exported file. Record the job, inputs, model, prompt, parameters, known cost, and review in `assets.json`, preserving new versions.

Do not automatically repeat a job with an unknown submission outcome: query status before resubmitting to avoid duplicate credit use. Never store passwords, tokens, or keys in `persona.json`, manifests, or commits.

## Video delivery

Vertical briefs can start at 9:16 with a target resolution of 1080 × 1920, adjusted to the model's and channel's real capabilities. Upscaling does not recover lost identity. Confirm duration, speech, reference support, audio, lip-sync, and export before promising a deliverable. Do not replace temporal review with isolated captures.

Without connected execution, Codex can still prepare the complete package: exact script, shots, performance, references, voice, captions, publication text, and review criteria. Identify the deliverable as a **production package**, without claiming a rendered video exists.

## Codex

`AGENTS.md` provides project guidance; `.agents/skills/olympox` contains the reusable process. The [official skill documentation](https://developers.openai.com/codex/skills) describes local discovery. If the skill is absent from the selector, reload Codex; it can also be read directly in this conversation. Installed files do not prove automatic loading in the app.

English is primary; [Brazilian Portuguese](locales/pt-BR/tools.md) is a secondary translation. See the [language policy](localization.md).
