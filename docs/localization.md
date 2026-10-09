# OLYMPOX — English source and Brazilian Portuguese translation

English (`en`) is the canonical language of the framework. Governance, guides, commands, contract names and criteria, identifiers, default messages, generated scaffolding, prompts, comments, tests and active skills are maintained in English. Brazilian Portuguese (`pt-BR`) is a secondary translation. Character content and conversation language can use the audience's or user's chosen language independently.

## Source layout and maintenance

The English guides live in `docs/`, with English filenames. `README.md`, `CONSTITUTION.md`, `AGENTS.md`, `framework/README.md` and `docs-site/README.md` are also English sources. Their translated editions live under `docs/locales/pt-BR/`, mirroring the source layout where applicable. Role and catalog translations live in `docs-site/locales/pt-BR.json`; English contracts remain in `framework/`.

Canonical skills live in `skills/` and their active copies in `.agents/skills/` for Codex or `.claude/skills/` for Claude Code. Translated reading copies live in `docs/locales/pt-BR/skills/`; they are not a second active installation. Canonical templates live in `templates/`; translated templates live in `templates/locales/pt-BR/`. Both editions use the same English field names and machine values. A Portuguese persona or narrative template explicitly selects `pt-BR` for its editorial voice.

The source root's `AGENTS.md` governs framework development. The installer uses `templates/studio-AGENTS.md` as an independent studio's creative `AGENTS.md`, with the matching secondary translation for the installed manual. Maintain these instructions separately so development scope and creative studio scope remain clear.

Change the English source first, then update the affected translation in the same task. Keep the same authority, preservation and quality requirements in both editions. Build with `npm.cmd run docs:build`; check source integrity with `npm.cmd run docs:check`; finish framework work with `npm.cmd run verify`. Hash and coverage checks detect missing or stale sources, but do not prove translation accuracy. Review the wording and behavior too.

The navigable manual defaults to English. Its language selector provides Brazilian Portuguese; the explicit choice can persist for later visits. Both languages are bundled in the portable manual and served by the local development server. CLI commands and persisted identifiers remain English regardless of the selected documentation language.

## Setup presentation language

Guided installation accepts `node bin/olympox.mjs setup [directory] --locale en|pt-BR`. English is its default presentation language; an interactive session can select Brazilian Portuguese. This choice translates the setup prompts and summaries only. Canonical installed sources and skills, machine tokens, command syntax and persisted records remain English. The manual's language selector and the user's conversation or character editorial language are independent choices. Setup does not migrate historical bytes or store a character language preference. Direct `install` does not accept `--locale`.

## Compatibility and history

New workflow IDs are `create-character`, `produce-piece` and `review-correct`. Existing `criar-personagem`, `produzir-peca` and `revisar-corrigir` IDs remain accepted as compatibility inputs. New records use English states and decisions, including `draft`, `canon-approved`, `production`, `candidate`, `approved`, `rejected`, `ready-for-production`, `approve`, `correct`, `reject` and `pending`. Legacy Portuguese equivalents are interpreted without rewriting their stored bytes.

Existing character files, canon snapshots, approvals, execution seals, editorial versions and saved runs retain their original language and hashes. A language migration is not an identity approval, new production or user review. Governance changes can make an old run require context review; resuming after such drift requires the existing explicit new-attempt procedure. Historical contracts and prior attempts remain preserved.

Both documentation languages use the name OLYMPOX and the signature `OLYMPOX - AI Influencer framework`. The active skill is `olympox`, with canonical source in `skills/olympox/` and host-selected installation in `.agents/skills/olympox/` or `.claude/skills/olympox/`. Historical records, snapshots, approvals and backups retain their original bytes, names, and hashes under the existing preservation and resumption rules.

Goddess names such as Atena, Psiquê, Íris and Têmis are established project proper names and remain unchanged, as do technical role IDs. Character names, reference filenames and fictional voices are not automatically translated. Imported vendor material retains its original provenance and integrity hashes.

## Development practice

Write new source files, comments, errors, help text, examples and test descriptions in English. Place translated presentation text in the locale resources instead of making Portuguese the default branch. Keep JSON keys, command syntax, capability IDs and machine tokens identical across translations. Tests should exercise both canonical English output and read-only compatibility with historical Portuguese values; translation must not weaken validation or recreate approvals.
