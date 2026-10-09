# Character records

In an installed studio, create a character folder with:

```sh
node scripts/studio.mjs new <slug>
```

The command creates a draft `persona.json`, `brief.md`, `decisions.md`, `assets.json` and directories for references, media, prompts and exports. The catalog reads these folders directly. Templates are scaffolding; read the actual character record and decisions to establish its current state.

Keep personal characters in independent installed studios. This framework development checkout distributes this guide only.

Character files and media are ignored by Git by default. Use the [backup procedures](../docs/operations.md) and keep an independent copy outside the working disk. Character language and voice are chosen for its audience; historical files retain their original bytes and history.
