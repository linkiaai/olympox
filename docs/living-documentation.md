# Build and maintain the manual

The navigable manual is generated from reusable framework sources. Guides supply explanations; the registry, contracts, workflows and CLI help supply reference catalogs. The generator detects source changes but does not interpret code or rewrite prose.

## Read locally

From the studio or framework root:

```sh
npm run docs:dev
```

Open the address printed by the command, normally `http://127.0.0.1:4321`. Set another port with `npm run docs:dev -- 4322`. The server watches sources and the browser follows valid builds while retaining its section and language.

If an edit temporarily makes a source invalid, the last valid build remains visible with an update notice. Correct the source to resume updates. Only selected manual assets are served; private studio files are outside the served tree.

## Build and check

```sh
npm run docs:build
npm run docs:check
```

Build writes `docs-site/dist/`. Open `docs-site/dist/index.html` directly for a portable manual; rebuilding is required to incorporate later edits. Check compares the expected output with saved bytes and reports missing, changed or stale output without writing.

`npm run verify` builds the manual first, then runs the framework checks and verifies documentation integrity.

## Update a page or catalog

1. Identify the changed behavior in code, help and contracts.
2. Update the canonical English guide and its matching pt-BR translation. Explain the behavior and executable procedure in the page responsible for it.
3. For a new guide, add its path, label, navigation group and translation to `docs-site/config.json`, plus its pt-BR label in the locale resource.
4. For a new command, add syntax to CLI help and descriptions to the configuration and locale resource.
5. Build, review both language editions, check links and run `npm run verify`.

The manual groups getting started, character development, production, records, framework references and maintenance. Keep each guide focused. Use links for shared procedures instead of copying policy paragraphs into every page.

Role pages use the responsibilities documented in the team guide; the registered profiles remain their instruction sources. Contract and workflow pages derive from the registered JSON. Command syntax derives from CLI help.

## Sources, versions and privacy

The manifest records source paths, hashes and the registry's framework version. Component revisions inside contracts can differ from the framework release. A build fingerprint detects changed sources; it does not prove accuracy, translation quality or a published release.

The public source selection excludes character records, generated media, personal prompts, runs, backups, credentials and maintenance state. Preserve that selection when adding material. Do not add local sessions, private account balances, receipts or character examples to public guides.

## Prepare a publication

```sh
npm run docs:export
```

Export rebuilds the manual and prepares the permitted public files under `out/`: landing page, `doc/` manual, assets and legacy redirects. Unexpected output files stop the export before writing. Export does not publish.

A hosting deployment must use the complete reviewed export and applicable publication authorization. The public manual entry is `/doc/`; legacy `/docs/` links preserve language and section through a redirect. Public pages poll the published manifest once a minute and reload on a new published revision. Local edits reach a hosted manual only through a new export and deployment.

See [manual source layout](../docs-site/README.md) and [localization](localization.md) for contributor details.
