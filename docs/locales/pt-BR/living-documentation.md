# Uma documentação que acompanha o framework.

O manual usa os próprios arquivos do projeto como fonte. Nomes e papéis vêm do registry; contratos e sequências vêm dos JSONs; a sintaxe dos comandos vem da ajuda escrita na CLI. Os guias são os documentos Markdown selecionados em `docs-site/config.json`.

## Abrir e acompanhar alterações

Na pasta do projeto, execute:

```powershell
npm.cmd run docs:dev
```

Abra o endereço mostrado no terminal. Enquanto esse processo estiver aberto, alterações nas fontes são detectadas e o site é regenerado. O navegador atualiza a página mantendo a seção selecionada. Se uma fonte estiver temporariamente inválida durante a edição, a última versão válida permanece visível, com a pendência sinalizada. A atualização volta quando a fonte for corrigida.

## Gerar uma versão portátil

```powershell
npm.cmd run docs:build
npm.cmd run docs:check
```

O resultado fica em `docs-site/dist/`. Você pode abrir `index.html` diretamente; essa cópia funciona sem servidor, mas acompanha mudanças somente depois de outra geração. `docs:check` detecta conteúdo ausente, alterado ou desatualizado sem modificar os arquivos.

`npm.cmd run verify` gera o manual antes dos testes e depois confere sua integridade. Assim, a verificação normal do projeto também mantém o site atualizado.

## O que se atualiza sozinho

| Mudança na fonte | Efeito no manual |
| --- | --- |
| Nome ou perfil no registry | Nome da coordenadora, catálogo da equipe, contagens e relações com tarefas. |
| Contrato de tarefa | Responsável, critérios, requisitos, capacidade e entregável. |
| Etapas de um fluxo | Sequência, responsáveis e etapas opcionais. |
| Ajuda da CLI | Sintaxe dos comandos; descrição editorial tem cobertura obrigatória. |
| Guia Markdown selecionado | Texto, exemplos, tabelas e navegação interna. |
| Código ou instruções do projeto | Nova revisão das fontes; o texto sobre comportamento deve ser revisado junto da mudança. |

## Como manter as explicações corretas

Ao mudar o comportamento do framework, o Codex deve atualizar o guia correspondente na mesma tarefa. Essa responsabilidade está registrada em `AGENTS.md`. O gerador sincroniza informações estruturadas; ele não interpreta código para inventar explicações ou prometer capacidades novas.

Um comando novo precisa de sintaxe na ajuda da CLI e descrição em `commandDescriptions` no config. Um guia novo entra na lista `guides`. Os arquivos permitidos são explícitos: informações de personagens, mídia, prompts, runs, backups, credenciais e estado operacional não são incorporados.

## Evolução e compartilhamento

O manifesto inclui hashes das fontes e a versão do framework, permitindo conferir de onde veio cada geração. O manual público está em `https://olympox.linkia.ai/doc/`. O servidor local não envia conteúdo para a internet.

`npm.cmd run docs:export` regenera o manual e prepara somente os arquivos permitidos em `out/doc/`. O projeto de hospedagem está registrado em `.openai/hosting.json`. Publique essa geração completa pelo Sites sempre que uma mudança no framework atualizar a documentação. Exportar sozinho não publica. Arquivos inesperados em `out/` interrompem a exportação para evitar divulgação acidental.

A raiz em `https://olympox.linkia.ai/` apresenta o framework em uma landing page bilíngue. Contagens, equipe e etapas dos fluxos vêm das mesmas fontes canônicas do manual. As fontes da landing participam do fingerprint da documentação. A entrada antiga `/docs/` encaminha para `/doc/`, mantendo idioma e seção; seu manifesto de compatibilidade permite que páginas já abertas detectem a migração.

A página pública consulta seu manifesto publicado uma vez por minuto. Quando chega uma nova publicação, ela atualiza mantendo idioma e seção. Isso detecta alterações já publicadas; não lê os arquivos locais de quem está desenvolvendo nem consulta o servidor de desenvolvimento.
