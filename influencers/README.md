# Characters

Each character has its own folder, created with `node scripts/studio.mjs new <slug>`.

The examples in `templates/` are forms, not approved identities. Read each character's actual profile and decisions before reporting its current state.

The command creates `persona.json`, `brief.md`, `decisions.md`, `assets.json` and folders for references, media, prompts and exports. The catalog is read from those folders; there is no separate central index to become stale. Character voice and editorial language are selected independently; existing character files retain their original language and history.

Character data and media remain local and are ignored by Git by default. Back up this folder: Git is not the character backup. Before deciding to version a character, review the files before changing `.gitignore`. Use `backup`, `backup-verify` and `backup-test` and keep an independent copy outside the working disk.
