# Localization

English (`en`) is canonical for framework sources, commands, contracts, identifiers, default messages, templates, tests and active skills. Brazilian Portuguese (`pt-BR`) is the secondary documentation and presentation translation.

Conversation language and a character's editorial language are independent user choices.

## Source layout

| Content | English source | pt-BR edition |
| --- | --- | --- |
| Guides | `docs/*.md` | `docs/locales/pt-BR/*.md` |
| Root documents | Root Markdown files | Matching files under `docs/locales/pt-BR/` |
| Core and manual READMEs | `framework/`, `docs-site/` | Matching subdirectories under `docs/locales/pt-BR/` |
| Manual interface and catalogs | Sources and `docs-site/locales/en.json` | `docs-site/locales/pt-BR.json` |
| Templates | `templates/` | `templates/locales/pt-BR/` |
| Skills | `skills/` | Reading copies under `docs/locales/pt-BR/skills/` |
| Setup presentation | `scripts/onboarding-locales/en.json` | `scripts/onboarding-locales/pt-BR.json` |

The installer projects canonical skill bytes into `.agents/skills/` for Codex or `.claude/skills/` for Claude Code. Translated skill copies are reading material, not a second active installation. The source root's `AGENTS.md` governs development; installed studios receive the creative studio template and its matching translated reading copy.

## What changes with a language choice

The manual starts in English and offers pt-BR through its selector or `?lang=pt-BR`. An explicit choice can persist. Both editions are included in portable builds.

```sh
node bin/olympox.mjs setup ../my-studio --assistant codex --locale pt-BR --yes
```

`setup --locale` translates setup prompts and summaries. It does not change canonical installed sources, persisted tokens or character language. Direct `install` has no `--locale` option.

Translate explanatory text while keeping command syntax, JSON keys, states, capability IDs, file paths and role IDs in English. Keep established proper names such as Atena, Psiquê, Íris and Têmis. Translate neither reference filenames nor imported vendor sources.

## Compatibility with historical records

New workflows use `create-character`, `produce-piece` and `review-correct`. The historical inputs `criar-personagem`, `produzir-peca` and `revisar-corrigir` remain accepted. Historical Portuguese states and decisions are interpreted through the compatibility layer.

Preserve the original bytes, language and hashes of existing characters, approvals, snapshots, seals, editorial versions, runs and backups. Translation is not an identity approval or migration. Governance edits can trigger context review in an older run; follow the explicit [new-attempt procedure](framework-02.md) without rewriting its history.

## Contributor checklist

1. Update the canonical English source first and the affected pt-BR edition in the same task.
2. Preserve the same requirements, boundaries, examples and authority in both languages.
3. Update labels and catalog translations when navigation or contracts change. UI placeholders must match.
4. Check links from each translated file's actual location.
5. Build the manual, inspect both rendered editions and run `npm run verify`.

Build and coverage checks detect missing sources and mismatched catalogs. They do not establish translation accuracy; review the meaning as well as the structure. See [manual maintenance](living-documentation.md).
