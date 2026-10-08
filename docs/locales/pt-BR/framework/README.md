# Núcleo de coordenação 0.2

O registry aponta para nove perfis, contratos de tarefa e três fluxos. Os perfis são instruções para o Codex. O módulo `scripts/framework-core.mjs` registra pacotes e estado local; não despacha agentes, gera mídia, consulta serviços ou publica.

Os caminhos de inputs e outputs são relativos à raiz do projeto, com `/`. Arquivos de outro personagem e caminhos que saem da raiz são recusados. O estado fica em `work/runs/run-<UUID>.json`; um lock impede escritores simultâneos e a substituição usa um arquivo temporário completo. Interrupções podem deixar lock: conferir processos antes de remover.

## API

- `validateFramework(root)` retorna `valid`, erros, registry e contratos resolvidos.
- `startRun(root, {workflowId, personaId, objective, inputs, medium, capabilities})` cria uma execução e retorna o pacote. `personaId` pode ser `null` no início de `create-character`; antes das referências, usar a transição `bind-persona`. Produção/correção exigem cânone aprovado.
- `readRun(root, runId)` retorna estado, próxima tarefa/responsável, pré-requisitos, entradas/hashes, governança e mudanças detectadas. Não altera o registro.
- `validateRunRecord(run)` verifica estrutura e hashes do JSON histórico, sem depender dos arquivos atuais. Retorna `true` ou lança erro; inventários de backup podem usar essa API.
- `transitionRun(root, runId, options)` registra `start`, `complete`, `skip`, `bind-persona`, `wait`, `uncertain`, `resolve`, `fail` ou `cancel`.
- `resumeRun(root, runId, {newAttempt, reason})` retoma o pacote. Mudanças nas entradas/cânone/governança exigem `newAttempt: true` e motivo. A nova tentativa começa o fluxo desde a primeira etapa, preservando a anterior. Não reenvia trabalho externo nem consome aprovações anteriores.

Capacidades são declarações da sessão, por exemplo `image-generation`, `image-inspection`, `video-generation` e `video-inspection`. O shell não prova que uma ferramenta está disponível. Ausência da capacidade requerida deixa a etapa `awaiting-tool`. Perfis e pacotes carregam as limitações; não há adaptadores externos neste módulo.

O contrato e o registro inteiro têm hashes; constituição, registry, perfis e contratos têm seus arquivos observados para detectar drift. Esses hashes detectam alterações, mas não são assinaturas nem autenticação contra alguém que tenha acesso e possa recalculá-los. Só o contexto da próxima tarefa precisa ser lido pelo Codex; a lista de hashes não exige carregar todos os perfis no contexto.

## Declarações de conclusão

Para tarefas que não são gates de decisão, `complete` exige outputs existentes, hashes calculados e evidência com `type`, `performed: true`, `actor`, `at`, `eventId` e `notes`. Tipos: `prepared` para documento, `generated` para geração, `reviewed` para revisão e `delivered` para entrega. Geração também exige `tool` e extensão compatível com `medium`; extensão não prova MIME, pixels ou execução real. Gates de decisão humana exigem a `approval` explícita descrita abaixo e podem ter zero outputs quando o contrato permitir; não exigem o objeto `evidence` habitual.

Revisão também exige `reviewer`, `method` (`visual`, `listening` ou `visual-and-audio`), `decision: approve`, listas vazias `criticalIssues` e `limitations`, além de `media: [{path, sha256}]` correspondendo à última geração. Saída da revisão é um relatório. A entrega aceita somente os bytes já revisados; exportação alterada precisa de outra revisão.

Um gate de decisão exige `approval: {explicit: true, decision: approve, reviewer, at, eventId, source, notes}`. A tarefa `approve-canon` também exige `canonHash` e `identityVersion` do cânone aprovado registrado na persona. Informar o nome de um revisor não comprova humanidade, autenticidade de uma mensagem ou inspeção: o módulo valida e registra declarações; o Codex deve ligá-las ao evento realmente ocorrido. O módulo não altera a aprovação da persona.

`execution: {mode: delegated, agentId, eventId, actor, at}` registra uma delegação declarada. O módulo não a dispara. O modo normal é `instruction`, em que o Codex usa o perfil apropriado. Não apresentar perfis carregados como agentes despachadas.

## Retomada e resultado incerto

Entradas fornecidas e saídas de etapas concluídas tornam-se snapshots observados. Evite colocar a ficha de persona ainda em edição entre inputs imutáveis; o contexto de um cânone aprovado é vinculado separadamente. Na criação, a persona em rascunho pode evoluir até o gate; a decisão fixa o cânone para o piloto.

Antes de um envio externo, registre a intenção com `start` e `job: {provider, jobId?, requestId?}`. O estado do job começa `planned`; o módulo não efetua o envio. Qualquer retomada desse job ainda sem esclarecimento fica `uncertain-result`, inclusive quando o processo foi interrompido antes de registrar a resposta. Após o trabalho real, `resolve` registra o resultado esclarecido; apenas depois complete a etapa.

A transição `uncertain` recebe `job: {provider, jobId?, requestId?}` e motivo; preserva identificadores já conhecidos e bloqueia continuar, retry ou nova tentativa. `resolve` exige status `succeeded`, `failed` ou `not-submitted`, IDs correspondentes quando conhecidos e evidência `type: reconciled`. A consulta ao fornecedor ocorre fora deste módulo e precisa ser real. Resolver um job não conclui geração: ainda faltam arquivo e evidência da etapa. Se não houve envio, registre o esclarecimento `not-submitted` antes de uma nova tentativa. Sem o registro prévio de intenção, o runtime não consegue descobrir uma chamada feita fora dele.

Pesquisas de Gaia/Aurora e planejamento de distribuição são opcionais conforme cada fluxo. `skip` exige justificativa e não pode pular geração, revisão, entrega ou decisão do cânone. Estado `completed` significa que contratos locais foram preenchidos; não significa publicação nem qualidade comprovada pelo runtime.


> Tradução secundária em português do Brasil. A base canônica, os comandos e os tokens do framework são em inglês. Valores históricos em português continuam compatíveis; essa compatibilidade não reescreve fichas, runs, snapshots, hashes ou aprovações anteriores. O idioma editorial das personagens permanece independente. Consulte a [política de idiomas](../localization.md).
