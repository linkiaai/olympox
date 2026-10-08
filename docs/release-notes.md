# OLYMPOX release notes

## 0.2.1 — October 8, 2026

This patch adds guidance for using Higgsfield through its connected Codex plugin, alongside the existing local CLI and wrapper. Users can choose the plugin in conversation without installing a local Higgsfield CLI. The framework release is 0.2.1; the unchanged local core API and task contracts retain component revision 0.2.0.

### Changes

- The optional `higgsfield-studio` skill and studio instructions cover plugin and CLI selection, capability checks, actual reference submission, and output handoff. Integrated Codex image generation remains the default when available unless the user chooses another provider.
- The [Higgsfield plugin guide](higgsfield-plugin.md) explains session tool discovery, account and cost checks, reference attachment, output retrieval, and the existing production record sequence. Both routes use the same canon, runs, submission intent, execution seals, and exact-file quality review.
- Installation, quick start, tools, production, framework status, and the local manual explain the optional route in English and Brazilian Portuguese.
- External-job documentation clarifies `resolve` for ordinary success, failure, and confirmed non-submission, preserving existing transition syntax and behavior.
- Test files run sequentially to reduce peak resource use during local verification; the same checks remain required.

The package provides instructions for using real tools available in the session. It does not add an automated provider adapter, install or authenticate the external plugin, or automatically submit, query, retry, download, or approve provider jobs. Voice, Soul ID, reference handling, media retrieval/export, and billing must be verified through the selected route. A local Windows canon path does not establish plugin upload access; a remote gallery or URL becomes a final local asset only after the exact bytes are saved and inspected.

### Install or upgrade

For a fresh independent studio, with access to the repository and tag:

```sh
npx --yes github:linkiaai/olympox#v0.2.1 install ./my-studio
cd my-studio
npm run verify
```

Use `npx.cmd` and `npm.cmd` on Windows if required. A private GitHub repository may require authenticated Git access on the machine.

For an existing studio, first back up private records and the shared framework foundation. Install this release in an independent directory, compare the reusable sources, and explicitly reconcile the intended framework, skills, templates, and documentation. Preserve private records and historical bytes. `--merge` preflights conflicts and refuses differing files; it is not an automatic updater. Follow [upgrade guidance](installation.md#upgrade-an-existing-studio), including a new attempt with a reason when an existing run detects changed governance or inputs.

### Verification and limits

Release **0.2.1** passed **124 local tests** in the source checkout and **124** in an independent studio installed from the npm archive. Verification covers local records, preservation, installer/export selection, documentation, skill consistency, and existing external-job state handling. The archive contains only reusable sources; installation preserves allowed Git metadata and unrelated files, while merge conflicts are refused before any write.

No live Higgsfield generation was performed for this change. Local tests do not prove fresh Codex skill discovery, plugin account access, provider generation, identity fidelity, voice quality, media export, or remote publication. The plugin workflow preserves those checks as actual production work in each installed studio.
