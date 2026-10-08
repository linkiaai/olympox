# OLYMPOX navigable manual

The navigable manual for **OLYMPOX - AI Influencer framework** is a local, static site with no dependencies, generated from project files. `src/` contains the interface; `config.json` selects guides and describes commands. Catalogs come from the registry, profiles, contracts, workflows, and CLI help.

Create an independent studio using the [installation guide](../docs/installation.md), or clone the framework source for development and maintenance. The package contains the manual's sources; a local build creates `dist/`. From the installed studio or development checkout root:

```powershell
npm.cmd run docs:dev
npm.cmd run docs:build
npm.cmd run docs:check
```

The server watches sources at `http://127.0.0.1:4321`. Set the port with `npm.cmd run docs:dev -- 4322`. The portable copy is at `dist/index.html` and works when opened directly. `dist/` is generated and ignored by Git.

English is the default. The language selector switches to Brazilian Portuguese, and `?lang=pt-BR` opens that translation directly. The browser remembers the preference. Both languages work in portable and development builds, and build/check operations include hashes for both source trees.

See [living documentation](../docs/living-documentation.md) for maintenance and limitations. Only permitted output files are served; the project root and character data are not accessible. There is no automatic remote publication or integration.

English is primary and [Brazilian Portuguese](../docs/locales/pt-BR/docs-site/README.md) is a secondary translation. See the [language policy](../docs/localization.md).
