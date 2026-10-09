# OLYMPOX — Fonte em inglês e tradução em português brasileiro

O inglês (`en`) é o idioma principal do framework. Governança, guias, comandos, nomes e critérios dos contratos, identificadores, mensagens padrão, arquivos iniciais, prompts, comentários, testes e skills ativas são mantidos em inglês. O português brasileiro (`pt-BR`) é uma tradução secundária. Conteúdo das personagens e idioma da conversa seguem, independentemente, a escolha do público ou do usuário.

## Organização e manutenção

Os guias originais ficam em `docs/`, com nomes de arquivo em inglês. `README.md`, `CONSTITUTION.md`, `AGENTS.md`, `framework/README.md` e `docs-site/README.md` também são fontes em inglês. As traduções ficam em `docs/locales/pt-BR/`, espelhando a estrutura das fontes quando aplicável. Traduções de perfis e catálogos ficam em `docs-site/locales/pt-BR.json`; os contratos principais continuam em `framework/`.

As skills principais ficam em `skills/` e suas cópias ativas em `.agents/skills/` para Codex ou `.claude/skills/` para Claude Code. As traduções para leitura ficam em `docs/locales/pt-BR/skills/`; elas não são uma segunda instalação ativa. Os templates principais ficam em `templates/`; suas traduções ficam em `templates/locales/pt-BR/`. Ambas as versões usam os mesmos campos e valores técnicos em inglês. Os templates portugueses de persona e narrativa selecionam explicitamente `pt-BR` como idioma editorial.

O `AGENTS.md` da raiz das fontes rege o desenvolvimento do framework. O instalador usa `templates/studio-AGENTS.md` como o `AGENTS.md` criativo de um estúdio independente, com a tradução secundária correspondente para o manual instalado. Mantenha essas instruções separadas para deixar claros os escopos de desenvolvimento e do estúdio criativo.

Altere primeiro a fonte inglesa e depois atualize a tradução pertinente na mesma tarefa. Preserve os mesmos requisitos de autoridade, histórico e qualidade nas duas versões. Gere com `npm.cmd run docs:build`, confira a integridade com `npm.cmd run docs:check` e finalize mudanças do framework com `npm.cmd run verify`. Hashes e verificações de cobertura detectam fontes ausentes ou desatualizadas, mas não comprovam a exatidão da tradução. Revise também o texto e o comportamento.

O manual navegável começa em inglês. Seu seletor oferece português brasileiro; a escolha explícita pode ser preservada para próximas visitas. Os dois idiomas acompanham o manual portátil e o servidor local. Comandos e identificadores persistidos continuam em inglês independentemente do idioma selecionado na documentação.

## Idioma de apresentação da preparação

A instalação guiada aceita `node bin/olympox.mjs setup [directory] --locale en|pt-BR`. Inglês é o idioma padrão de apresentação; uma sessão interativa pode selecionar português brasileiro. Essa escolha traduz somente perguntas e resumos da preparação. Fontes e skills canônicas instaladas, valores técnicos, sintaxe dos comandos e registros persistidos continuam em inglês. O seletor de idioma do manual e o idioma da conversa ou editorial da personagem são escolhas independentes. A preparação não migra bytes históricos nem guarda preferência de idioma de personagem. `install` direto não aceita `--locale`.

## Compatibilidade e histórico

Os novos IDs de fluxo são `create-character`, `produce-piece` e `review-correct`. Os IDs anteriores `criar-personagem`, `produzir-peca` e `revisar-corrigir` continuam aceitos como entradas de compatibilidade. Novos registros usam estados e decisões em inglês, incluindo `draft`, `canon-approved`, `production`, `candidate`, `approved`, `rejected`, `ready-for-production`, `approve`, `correct`, `reject` e `pending`. Equivalentes portugueses antigos são interpretados sem reescrever seus bytes.

Fichas existentes, snapshots do cânone, aprovações, selos de execução, versões editoriais e runs conservam idioma e hashes originais. Uma mudança de idioma não aprova identidade, realiza produção ou cria revisão do usuário. Alterações de governança podem exigir revisão do contexto de um run antigo; sua retomada segue o procedimento existente de nova tentativa explícita. Contratos históricos e tentativas anteriores são preservados.

Os dois idiomas da documentação usam o nome OLYMPOX e a assinatura `OLYMPOX - AI Influencer framework`. A skill ativa é `olympox`, com fonte principal em `skills/olympox/` e instalação escolhida por host em `.agents/skills/olympox/` ou `.claude/skills/olympox/`. Registros históricos, snapshots, aprovações e backups preservam seus bytes, nomes e hashes originais conforme as regras existentes de preservação e retomada.

Nomes de deusas como Atena, Psiquê, Íris e Têmis são nomes próprios estabelecidos do projeto e permanecem iguais, assim como os IDs técnicos dos papéis. Nomes de personagens, arquivos de referência e vozes ficcionais não são traduzidos automaticamente. Material importado de fornecedores preserva origem e hashes de integridade.

## Desenvolvimento

Escreva arquivos novos, comentários, erros, ajuda, exemplos e descrições dos testes em inglês. Coloque textos traduzidos nos recursos de idioma, sem transformar o português no comportamento padrão. Campos JSON, sintaxe, capacidades e valores técnicos são iguais nas traduções. Os testes devem cobrir a saída principal em inglês e a leitura de valores portugueses históricos; a tradução não enfraquece validações nem recria aprovações.
