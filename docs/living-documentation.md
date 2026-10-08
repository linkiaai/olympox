# Living documentation for OLYMPOX

The manual uses project files as its sources. Names and roles come from the registry; contracts and sequences come from the JSON files; command syntax comes from the help written in the CLI. Guides are the Markdown documents selected in `docs-site/config.json`.

## Open it and follow changes

In the project folder, run:

```powershell
npm.cmd run docs:dev
```

Open the address shown in the terminal. While this process is running, source changes are detected and the site is regenerated. The browser refreshes the page while retaining the selected section. If a source is temporarily invalid during editing, the last valid version stays visible and the issue is flagged. Updating resumes when the source is corrected.

## Build a portable version

```powershell
npm.cmd run docs:build
npm.cmd run docs:check
```

The output is in `docs-site/dist/`. You can open `index.html` directly; this copy works without a server but follows changes only after another build. `docs:check` detects missing, modified, or outdated content without changing files.

`npm.cmd run verify` builds the manual before the tests and then checks its integrity. Normal project verification therefore also keeps the site current.

English is the default language. The language selector can switch to Brazilian Portuguese, and `?lang=pt-BR` selects that translation directly. The browser retains the preference. Both languages are available in the development server and portable build; builds and integrity checks include hashes for both source trees.

## What updates automatically

| Source change | Effect on the manual |
| --- | --- |
| Name or profile in the registry | Coordinator name, team catalog, counts, and task relationships. |
| Task contract | Owner, criteria, requirements, capability, and deliverable. |
| Workflow stages | Sequence, owners, and optional stages. |
| CLI help | Command syntax; editorial description coverage is required. |
| Selected Markdown guide | Text, examples, tables, and internal navigation. |
| Project code or instructions | A new source revision; behavioral explanations must be reviewed alongside the change. |

## Keep explanations accurate

When framework behavior changes, Codex must update the corresponding guide in the same task. This responsibility is recorded in `AGENTS.md`. The generator synchronizes structured information; it does not interpret code to invent explanations or promise new capabilities.

A new command needs syntax in CLI help and a description in `commandDescriptions` in the configuration. A new guide goes into `guides`. Allowed files are explicit: character information, media, prompts, runs, backups, credentials, and operational state are excluded.

English is the canonical documentation language, and Brazilian Portuguese is a secondary translation. Maintain both selected trees when shared behavior changes, following the [language policy](localization.md). Translations use canonical English command and record tokens; compatibility does not rewrite historical files.

## Evolution and sharing

The manifest includes source hashes and the framework version, allowing each build's sources to be checked. The site is local. Hosting and updating a remote version require a defined publication process; the local server does not send content to the internet.

[Brazilian Portuguese translation](locales/pt-BR/living-documentation.md).
