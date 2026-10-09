# Estrutura das fontes do manual

O manual OLYMPOX é um site estático gerado por scripts Node locais. Não usa framework de navegador nem dependências externas de execução.

## Arquivos

| Caminho | Finalidade |
| --- | --- |
| `config.json` | Seleção explícita de guias, grupos de navegação e descrições de comandos em inglês |
| `locales/en.json` | Texto canônico da interface |
| `locales/pt-BR.json` | Interface, títulos e catálogos estruturados traduzidos |
| `src/index.html`, `src/app.js`, `src/styles.css` | Estrutura do manual, navegação e renderização de páginas |
| `src/markdown.js`, `src/localization.js` | Renderização segura de Markdown, links e seleção de idioma |
| `src/landing.*`, `src/doc-redirect.js` | Landing pública e redirecionamentos antigos |
| `src/olympox-logo.png`, `src/olympox-icon.png` | Assets distribuídos da marca |
| `dist/` | Manual portátil gerado, ignorado pelo Git |

O conteúdo dos guias vem das fontes Markdown selecionadas. Catálogos de perfis, contratos, workflows e comandos usam o registro do framework, contratos JSON e ajuda da CLI. O build também observa hashes da implementação para que mudanças motivem revisão da documentação.

## Comandos

Execute na raiz do projeto:

```sh
npm run docs:dev
npm run docs:build
npm run docs:check
npm run docs:export
```

O servidor de desenvolvimento normalmente usa `http://127.0.0.1:4321`; acrescente `-- 4322` para escolher outra porta. Abra `docs-site/dist/index.html` diretamente para o build portátil.

A exportação prepara landing em `out/index.html`, manual em `out/doc/`, assets compartilhados em `out/site/` e entrada antiga em `out/docs/`. Ela verifica a saída existente e recusa arquivos inesperados. Só assets explicitamente permitidos são servidos ou exportados.

## Edição e revisão

Mantenha os guias nos grupos de navegação definidos e atualize inglês e pt-BR. Preserve os caminhos das rotas ao reorganizar títulos; links de arquivos e favoritos usam esses caminhos. A saída pública gerada fica fora do Git e do pacote de instalação.

Siga [manutenção do manual](../living-documentation.md) e [localização](../localization.md). Revise as duas edições renderizadas, busca, rotas e navegação responsiva, depois execute `npm run verify`. O deploy é uma ação autorizada separada.
