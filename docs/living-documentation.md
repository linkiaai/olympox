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

When framework behavior changes, the maintainer must update the corresponding guide in the same task. This responsibility is recorded in `AGENTS.md`. The generator synchronizes structured information; it does not interpret code to invent explanations or promise new capabilities.

A new command needs syntax in CLI help and a description in `commandDescriptions` in the configuration. A new guide goes into `guides`. Allowed files are explicit: character information, media, prompts, runs, backups, credentials, and operational state are excluded.

## Evolution and sharing

The manifest includes source hashes and the framework version, allowing each build's sources to be checked. The public manual is at `https://olympox.linkia.ai/doc/`. The local server does not send content to the internet.

`npm.cmd run docs:export` regenerates the manual and prepares only the permitted assets under `out/doc/`. The hosting project is recorded in `.openai/hosting.json`. Publish this complete build through Sites whenever a framework change updates the documentation. Exporting alone does not publish. Unexpected files in `out/` stop the export to prevent accidental disclosure.

The root at `https://olympox.linkia.ai/` presents the framework through a bilingual landing page. Its profile counts, team and workflow steps come from the same canonical sources as the manual. Landing sources participate in the documentation fingerprint. The old `/docs/` entry forwards to `/doc/`, retaining language and section; its compatibility manifest lets already-open pages discover the migration.

The public page checks its published manifest once a minute. When a new publication arrives, it refreshes while retaining the language and section. This detects published changes; it does not read a developer's local files or call the local development server.
