# Gere e mantenha o manual

O manual navegável é gerado a partir das fontes reutilizáveis do framework. Os guias fornecem explicações; registro, contratos, workflows e ajuda da CLI fornecem catálogos de referência. O gerador detecta mudanças nas fontes, mas não interpreta código nem reescreve textos.

## Leia localmente

Na raiz do estúdio ou do framework:

```sh
npm run docs:dev
```

Abra o endereço informado pelo comando, normalmente `http://127.0.0.1:4321`. Escolha outra porta com `npm run docs:dev -- 4322`. O servidor acompanha fontes e o navegador segue builds válidos, mantendo seção e idioma.

Se uma edição deixar uma fonte temporariamente inválida, o último build válido permanece visível com um aviso. Corrija a fonte para retomar atualizações. Só os assets selecionados do manual são servidos; arquivos privados do estúdio ficam fora dessa árvore.

## Gere e verifique

```sh
npm run docs:build
npm run docs:check
```

O build escreve em `docs-site/dist/`. Abra `docs-site/dist/index.html` diretamente para um manual portátil; outro build é necessário para incorporar edições futuras. A verificação compara a saída esperada com os bytes salvos e informa saída ausente, alterada ou desatualizada sem escrever.

`npm run verify` gera primeiro o manual, depois executa as verificações do framework e confere a integridade da documentação.

## Atualize uma página ou catálogo

1. Identifique o comportamento alterado em código, ajuda e contratos.
2. Atualize o guia canônico em inglês e sua tradução pt-BR. Explique comportamento e procedimento executável na página responsável.
3. Para um guia novo, adicione caminho, título, grupo de navegação e tradução em `docs-site/config.json`, além do título pt-BR no recurso de idioma.
4. Para um comando novo, adicione sintaxe à ajuda da CLI e descrições à configuração e ao recurso de idioma.
5. Gere, revise os dois idiomas, verifique links e execute `npm run verify`.

O manual agrupa início, desenvolvimento de personagens, produção, registros, referências do framework e manutenção. Mantenha cada guia focado. Use links para procedimentos compartilhados em vez de repetir parágrafos de política.

Páginas de perfis usam as responsabilidades documentadas no guia da equipe; os perfis registrados permanecem suas fontes de instruções. Páginas de contratos e workflows derivam do JSON registrado. A sintaxe dos comandos deriva da ajuda da CLI.

## Fontes, versões e privacidade

O manifest registra caminhos de fontes, hashes e a versão do framework no registro. Revisões de componentes nos contratos podem diferir da release do framework. O fingerprint detecta fontes alteradas; não comprova precisão, qualidade da tradução nem release publicada.

A seleção pública exclui registros de personagens, mídia gerada, prompts pessoais, execuções, backups, credenciais e estado de manutenção. Preserve essa seleção ao adicionar material. Não inclua sessões locais, saldos privados, recibos ou exemplos de personagens privados nos guias públicos.

## Prepare uma publicação

```sh
npm run docs:export
```

A exportação gera novamente o manual e prepara arquivos públicos permitidos em `out/`: landing page, manual em `doc/`, assets e redirecionamentos antigos. Arquivos inesperados na saída interrompem a exportação antes da escrita. Exportar não publica.

Um deploy deve usar a exportação completa revisada e a autorização aplicável de publicação. A entrada do manual público é `/doc/`; links antigos de `/docs/` preservam idioma e seção pelo redirecionamento. Páginas públicas consultam o manifest publicado a cada minuto e recarregam ao detectar nova revisão publicada. Edições locais chegam ao manual hospedado apenas por nova exportação e deploy.

Consulte [estrutura das fontes do manual](docs-site/README.md) e [localização](localization.md) para detalhes de contribuição.
