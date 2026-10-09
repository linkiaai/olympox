# Manual source layout

The OLYMPOX manual is a static site built by the local Node scripts. It uses no browser framework or external runtime dependencies.

## Files

| Path | Purpose |
| --- | --- |
| `config.json` | Explicit guide selection, navigation groups and English command descriptions |
| `locales/en.json` | Canonical interface text |
| `locales/pt-BR.json` | Translated interface, labels and structured catalogs |
| `src/index.html`, `src/app.js`, `src/styles.css` | Manual shell, navigation and page rendering |
| `src/markdown.js`, `src/localization.js` | Safe Markdown rendering, links and language selection |
| `src/landing.*`, `src/doc-redirect.js` | Public landing and legacy manual redirects |
| `src/olympox-logo.png`, `src/olympox-icon.png` | Distributed brand assets |
| `dist/` | Generated portable manual, ignored by Git |

Guide content comes from selected Markdown sources. Role, contract, workflow and command catalogs use the framework registry, JSON contracts and CLI help. The build also observes implementation hashes so changes prompt a documentation review.

## Commands

Run from the project root:

```sh
npm run docs:dev
npm run docs:build
npm run docs:check
npm run docs:export
```

The development server normally uses `http://127.0.0.1:4321`; append `-- 4322` to choose another port. Open `docs-site/dist/index.html` directly for the portable build.

Export prepares a landing at `out/index.html`, manual at `out/doc/`, shared assets at `out/site/` and legacy entry at `out/docs/`. It preflights existing output and refuses unexpected files. Only explicitly permitted assets are served or exported.

## Editing and review

Keep guides in their assigned navigation groups and update both English and pt-BR. Preserve existing route paths when reorganizing labels; source-file links and saved bookmarks use those paths. Public generated output stays outside Git and the installation package.

Follow [manual maintenance](../docs/living-documentation.md) and [localization](../docs/localization.md). Review both rendered editions, search, routes and responsive navigation, then run `npm run verify`. Deployment is a separate authorized action.
