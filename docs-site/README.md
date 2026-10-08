# OLYMPOX navigable manual

The navigable manual for **OLYMPOX - AI Influencer framework** is a local, static site with no dependencies, generated from project files. `src/` contains the interface; `config.json` selects guides and describes commands. Catalogs come from the registry, profiles, contracts, workflows, and CLI help.

Create an independent studio using the [installation guide](../docs/installation.md), or clone the framework source for development and maintenance. The package contains the manual's sources; a local build creates `dist/`. From the installed studio or development checkout root:

```powershell
npm.cmd run docs:dev
npm.cmd run docs:build
npm.cmd run docs:check
npm.cmd run docs:export
```

The server watches sources at `http://127.0.0.1:4321`. Set the port with `npm.cmd run docs:dev -- 4322`. The portable copy is at `dist/index.html` and works when opened directly. `dist/` is generated and ignored by Git.

See [living documentation](../docs/living-documentation.md) for maintenance and limitations. Only permitted output files are served; the project root and character data are not accessible.

The public manual lives at `https://olympox.linkia.ai/doc/`. `docs:export` regenerates the manual and exports only permitted assets to `out/doc/`, along with root navigation, redirects, and cache/security headers. Unexpected files in `out/` stop the export. Sites publishing uses the project identity in `.openai/hosting.json` and the complete `out/` build; generated files are not committed. On the public site, the browser checks `doc/manifest.json` once a minute and reloads when a new publication changes the source revision, preserving the current language and section. The development endpoint is polled only on localhost. Local source changes require a new export and publication to reach the public domain.

The visual identity uses rose and lilac accents, a plum navigation panel, and a single geometric Zeus lightning bolt. `src/olympox-logo.png` is the horizontal wordmark; `src/olympox-icon.png` is the icon and browser favicon. The PNGs use a dark plum background. Both are included in builds, source fingerprints, and studio installations, so changes to the brand trigger the same automatic local refresh as other manual sources. Brand colors live in `src/styles.css`; the primary action color is `#ad2b91` and the light lilac accent is `#d48ce9`. The [brand generation record](src/olympox-brand-v2.json) preserves the final prompts and source image identifiers.

## Public landing page

The site root presents OLYMPOX in Portuguese and English, with profiles and workflow steps derived from the same canonical catalogs as the manual. Landing HTML, CSS, JavaScript and the legacy redirect live in src/ and participate in source fingerprints. The export includes the landing at out/index.html, its assets under out/site/, the manual under out/doc/, and a minimal compatibility entry under out/docs/. Legacy links preserve language and section through the redirect script, including on static hosts that do not process _redirects. Known old generated manual assets are removed only after public-output preflight; unexpected files still stop export before any write.

