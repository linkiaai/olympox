---
name: higgsfield-studio
description: Prepare and use the main Higgsfield AI Influencer Builder method for new OLYMPOX influencers, unless the user explicitly selects another method, through verified plugin or CLI capabilities with estimates and traceable production.
---

# Higgsfield in the studio

Work from the installed studio root. Read `docs/tools.md` to choose the Higgsfield plugin or local CLI. For the plugin, read `docs/higgsfield-plugin.md`; for the CLI, read `docs/higgsfield-setup.md`. For a character, also apply `olympox` and check its canon and exact files. Maintain framework instructions in English; character content retains its approved language. In the framework development checkout, limit work to framework changes and synthetic verification.

## Choose the route

- Honor the user's selected route. When none is selected, use a connected Higgsfield plugin with the required callable capabilities; otherwise check the prepared local CLI. If neither is ready, prepare the production package and report the missing capability. Do not install, authenticate or switch routes silently.
- Plugin use does not require the local CLI, its binary checks or CLI OAuth. A CLI diagnostic failure does not block a usable plugin. Framework installation supplies instructions; it does not connect either provider route or dispatch tools automatically.
- Recheck live tool instructions, input schemas, account/workspace, references, model and cost for the selected route. Do not assume the plugin and CLI expose the same models, prices, allowances, training, voices or file access.

## Influencer method and Builder

For new OLYMPOX influencer creation, the main method is the complete Higgsfield sequence with an AI Influencer Builder identity/reference stage unless the user explicitly selects another method. Read `docs/higgsfield-influencer-method.md` before planning or executing that work, and for any requested Higgsfield influencer process. Carry the saved `templates/production-method.md` plan through concept, identity/reference sheets and pack, preliminary visual selection and fidelity review, a vocal sample when needed while the persona remains `draft` with `purpose: reference`, final complete visual/vocal canon approval, scenes and a production video pilot, complete review and export. For a speaking character, listen to and select the vocal sample before final canon approval: `canonHash` binds voice settings and approved references as well as visual identity. Early visual selection does not freeze incomplete canon. Reuse existing approved voice and canon; for silent content, record why voice is not applicable. Missing required capabilities leave their stages pending; they do not trigger a fallback to Codex images or direct Kling video. Provider setup remains optional and is never performed by the framework installer. Unrelated generic image editing and work within approved canon can use checked tools that honor the applicable method.

Preserve the selected memorable concept, including realistic age, silhouette, style and personality; do not treat a randomized design or a preset tier as proof of viral potential. Verify each required module separately. Higgsfield is the provider; Builder is a character-sheet module; plugin/CLI is the connection route; Kling can be a downstream video model. One does not prove completion of the others. The main Builder method reflects the current explicit user requirement, not a claim that the original reference video used Builder exclusively. Keep inspected source evidence separate from the chosen framework adaptation.

For an existing approved character, inspect and transfer the exact approved identity reference through a supported route, preserving its bytes and canon. In current plugin metadata, `ai_influencer_prepare` accepts one identity reference in `medias` and separate Style references in `item_medias`. Use `randomize=false` and an explicit appropriate tier to preserve design; verify current schemas and avoid conflicting traits. Prepare one sheet for the pilot, preserve the returned params and scoped quote, and pass those params unchanged to `ai_influencer_generate` only within applicable authorization. `ai_influencer_get_settings` can recover an existing sheet's design; it is neither a generation nor a current quote. Saving settings or generating a sheet does not train Soul ID, approve canon, select a voice or produce video.

Inspect sheet fidelity against approved references before downstream use. Do not overwrite or automatically promote sheets into canon. Reuse already completed stages only with exact evidence and compatibility with the selected method; identify a newly required Builder stage as pending when missing. Missing Builder or reference transfer is not permission to replace the method with direct Kling generation. Soul ID remains separately justified and authorized; voice, scenes and video need their own verified capabilities and stage-specific estimates. A video quote does not cover character sheets, voice or training. Preserve tool-specific picker and submission requirements and all unresolved job IDs.

## Plugin preparation and execution

Discover the Higgsfield plugin through the host's available plugin tools or directory. If installation or connection is pending, give the user the required step and continue independent local preparation. Use provider tools only after connection is confirmed; their presence alone does not prove a working account or generation.

Inspect the actual tools and schemas needed for the request. Preserve any required picker or exclusive-tool turn; prepare and persist local context before the submission turn. Do not invent slash commands, IDs or parameters. Honor current tool-specific requirements without treating a preset's creative claims as verified facts or authorization.

Local paths are not plugin attachments. Verify a supported transfer route for the exact approved bytes and map their hashes to confirmed provider media IDs or authorized URLs. Attachment-only and remote-sandbox helpers cannot read arbitrary studio files. Keep production pending when a required reference cannot be transferred faithfully. Estimates with URLs/media may import or upload references even when they submit no generation; check side effects and applicable upload authorization, and reuse confirmed inputs to avoid duplicate imports.

Before generation, use the shared production procedure below. Submit through the connected tool with the actual parameters and applicable allowance/budget choice. Record returned IDs, adjustments, results and costs that are exposed. Query the same job with an available status tool after uncertainty; switching to CLI would be a separate submission and must not duplicate an unresolved job.

Use the host's supported media preview and export path. Save the same result bytes as a new local character version before registration, sealing and final review. If only a remote preview/URL is available, preserve it with the job record and leave local delivery pending; do not bypass host display/export restrictions or claim a local asset exists.

## CLI preparation and inspection

- Use `node scripts/higgsfield-local.mjs doctor`, `version` and `help [command [subcommand]]`. The wrapper checks the local binary version and hash; it does not install or update automatically.
- Login uses `node scripts/higgsfield-local.mjs login`, only when connection is authorized. The user completes OAuth. Do not print tokens, collect passwords or store the session inside the project.
- After connection, use `inspect account status`, `inspect workspace status` and `inspect model list/get` as described in the guide. Verify current schemas and features before choosing parameters; documented models are candidates, not proven availability.
- **`generate cost` with local media can upload the file to the provider.** The wrapper accepts estimates only with simple parameters, without media/files/URLs. If pricing requires references, preserve the pending step until applicable upload authorization exists; an incomplete estimate is not an exact price.

## Production

Both routes follow the same canon, run, asset and quality process. The CLI wrapper handles preparation and inspection; it does not generate, upload files or train identity. For authorized CLI production, follow “Authorized production later” in the setup guide and use the pinned local executable with separate arguments and a verified schema. Do not bypass an authorization refusal by switching tools.

Before submission, persist the job intent, inputs/hashes, model, parameters and applicable limit in the run. A subscription, proposed direction or visual approval does not automatically authorize spending, uploads, training or voice likeness. Reuse previously granted authorizations that cover the action; focus additional decisions on what is actually missing.

Record the ID as soon as available. If submission is uncertain, inspect the same job before repeating it. Record the actual route in the tool/provider description; record an unexposed model honestly as unknown and keep unknown cost as `null`, never zero. Preserve media in a new version, the prompt, known cost and context; seal the execution and inspect the complete file. A completed job does not approve identity, audio, lip-sync or publication. Missing transfer, status, export or inspection capabilities remain pending.

Keep quoted/charged provider credits and allowance choices in additional provenance; the asset's `cost` field accepts a monetary amount and currency, not credits. Retain `cost: null` when monetary cost is unavailable. A response asking for an allowance choice or rejecting parameters may submit no job; distinguish that from an uncertain submission. For batches, persist every accepted job ID and reconcile each before resolving the attempt.

## Vendor reference

Consult `vendor/higgsfield-skills/higgsfield-generate/references/` only for the required format, after verifying the current catalog. The preserved revision and hashes are in `vendor/higgsfield-skills/provenance.json`.

Do not execute the original skill's `curl | sh` bootstrap, generation defaults or paid test simply because they are present in vendor files. The studio uses an inspected local installation and a per-attempt budget; vendor quality claims and virality scores require actual evidence. Reserve Soul ID for a need demonstrated by the pilot, with its own authorization.
