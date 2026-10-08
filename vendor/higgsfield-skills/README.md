# Inspected Higgsfield reference

Inspection and preparation: **October 7, 2026**. Source: [higgsfield-ai/skills](https://github.com/higgsfield-ai/skills/tree/f83af0bc1d937c8119099a11f8ebbf5e6fb99819), revision `f83af0bc1d937c8119099a11f8ebbf5e6fb99819`. The `higgsfield-generate` skill is version `0.13.0`, with its local references and MIT license preserved. [provenance.json](provenance.json) inventories SHA-256 hashes of the received files and the verified CLI version.

These files preserve the vendor source for reference. **They are not installed as an active Codex skill and do not authorize actions.** `setup`, `INSTALL_FOR_AGENTS.md`, `npx skills add` and the repository's suggested paid generation test were not executed.

The generation module does not need `higgsfield-common`: that dependency does not appear in this revision. Soul ID, brandkit, websites and the other listed modules are optional paths for other requests; they were not copied or activated. This module's twelve references remain complete so their internal links stay readable.

The studio applies these operational differences:

- The vendor bootstrap uses `curl | sh` when the CLI is not on PATH. Here we use an isolated, inspected installation pinned in `tools/higgsfield`, without global changes.
- The vendor rule against estimating cost unless requested does not replace the budget and applicable authorization required by the constitution.
- Media paths may be uploaded automatically, including during `generate cost`. The preparation wrapper rejects those estimate inputs.
- Default models and claims such as “SOTA”, consistent identity or an objective attention proxy are vendor recommendations/claims. They require a current catalog, pilot and review; they do not demonstrate studio quality or performance.
- Delivering a URL does not complete studio preservation: retain media, job, inputs, prompt, context and actual review when generation is authorized.

The current process is documented in [Higgsfield setup](../../docs/higgsfield-setup.md) and the [constitution](../../CONSTITUTION.md). Imported vendor sources retain their original integrity hashes; this studio-authored guide has a secondary [Brazilian Portuguese edition](../../docs/locales/pt-BR/higgsfield-vendor-readme.md).
