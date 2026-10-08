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

O inglês é o idioma padrão. O seletor de idiomas alterna para português do Brasil, e `?lang=pt-BR` seleciona essa tradução diretamente. O navegador mantém a preferência. Ambos os idiomas estão disponíveis no servidor de desenvolvimento e na cópia portátil; a geração e a verificação de integridade incluem hashes das duas árvores de fontes.

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

O inglês é o idioma canônico da documentação, e o português do Brasil é uma tradução secundária. Mantenha as duas árvores selecionadas quando o comportamento compartilhado mudar, conforme a [política de idiomas](localization.md). As traduções usam os tokens canônicos em inglês nos comandos e registros; a compatibilidade não reescreve arquivos históricos.

## Evolução e compartilhamento

O manifesto inclui hashes das fontes e a versão do framework, permitindo conferir de onde veio cada geração. O site é local. Hospedagem e atualização de uma versão remota precisam de um processo de publicação definido; o servidor local não envia conteúdo para a internet.


> Tradução secundária em português do Brasil. A base canônica, os comandos e os tokens do framework são em inglês. Valores históricos em português continuam compatíveis; essa compatibilidade não reescreve fichas, runs, snapshots, hashes ou aprovações anteriores. O idioma editorial das personagens permanece independente. Consulte a [política de idiomas](localization.md).
