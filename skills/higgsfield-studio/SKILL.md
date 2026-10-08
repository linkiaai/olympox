---
name: higgsfield-studio
description: Prepare and operate the local Higgsfield CLI in this influencer studio, including capability checks, estimates and traceable production. Use for Higgsfield requests; generic images follow olympox and imagegen.
---

# Higgsfield in the studio

Work from the OLYMPOX project root. Read `docs/higgsfield-setup.md` for installation state, connection, commands and production; read `docs/tools.md` to choose an image, voice or video path. For a character, also apply `olympox` and check its canon and exact files. Maintain framework instructions in English; Brazilian Portuguese reading translations are secondary, and character content retains its approved language.

## Preparation and inspection

- Use `node scripts/higgsfield-local.mjs doctor`, `version` and `help [command [subcommand]]`. The wrapper checks the local binary version and hash; it does not install or update automatically.
- Login uses `node scripts/higgsfield-local.mjs login`, only when connection is authorized. The user completes OAuth. Do not print tokens, collect passwords or store the session inside the project.
- After connection, use `inspect account status`, `inspect workspace status` and `inspect model list/get` as described in the guide. Verify current schemas and features before choosing parameters; documented models are candidates, not proven availability.
- **`generate cost` with local media can upload the file to the provider.** The wrapper accepts estimates only with simple parameters, without media/files/URLs. If pricing requires references, preserve the pending step until applicable upload authorization exists; an incomplete estimate is not an exact price.

## Production

The wrapper handles preparation and inspection; it does not generate, upload files or train identity. For authorized production, follow “Later authorized production” in the guide and use the pinned local executable with separate arguments and a verified schema. Do not bypass an authorization refusal by switching to the native binary.

Before submission, persist the job intent, inputs/hashes, model, parameters and applicable limit in the run. A subscription, proposed direction or visual approval does not automatically authorize spending, uploads, training or voice likeness. Reuse previously granted authorizations that cover the action; focus additional decisions on what is actually missing.

Record the ID as soon as available. If submission is uncertain, inspect the same job before repeating it. Preserve media in a new version, the prompt, known cost and context; seal the execution and inspect the complete file. A completed job does not approve identity, audio, lip-sync or publication.

## Vendor reference

Consult `vendor/higgsfield-skills/higgsfield-generate/references/` only for the required format, after verifying the current catalog. The preserved revision and hashes are in `vendor/higgsfield-skills/provenance.json`.

Do not execute the original skill's `curl | sh` bootstrap, generation defaults or paid test simply because they are present in vendor files. The studio uses an inspected local installation and a per-attempt budget; vendor quality claims and virality scores require actual evidence. Reserve Soul ID for a need demonstrated by the pilot, with its own authorization.
