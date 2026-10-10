# ADR 003 — Prontidão de mídia por etapa

Status: Aceito para implementação local delimitada, 2026-10-09. Orion aceitou a direção após revisar as fontes e a sequência existentes. Aceitação real de fornecedor/módulo/mídia continua separada.

## Problema e limite verificado

F3 em `work/maintenance/aiox-project-review-2026-10-09/assessment.md` identifica uma lacuna concreta: capacidades de fornecedor/meio não validam o significado preenchido de um plano de método de produção. O `framework-core.mjs` atual permite concluir geração sem início anterior; verifica arquivos gerados, ferramenta/fornecedor declarados e capacidades, mas não exige prontidão exata de módulo/entrada/orçamento/autorização. Uma instalação nativa ou recibo de imagem F1 também não demonstra aceitação pelo módulo, exportação ou suporte à inspeção.

Continuam os 15 contratos e três workflows existentes. `generate-candidates` produz imagens; `generate-piece` atende às etapas de geração de piloto, produção e correção. Não há contrato separado de geração de correção. Na criação, revisão visual e escolha do usuário antecedem a escolha vocal após escuta/cânone final. Operações de voz/referências não podem se tornar operações obrigatoriamente concluídas dentro da geração de candidatas antes dessa seleção. F1/F2 e as oito edições das stories de fundação/incremento encerradas continuam preservadas.

## Decisão

Adicionar um avaliador local de prontidão sem dependências e uma ação, `record-media-readiness`, à API/CLI existente de transições. Usar o JSON privado de execução, lock, eventos e hash de registro existentes. Não adicionar execução de fornecedores, SDK, banco, dispatcher de etapas, nós no grafo ou papéis criativos automáticos.

Atualizar somente os dois contratos de geração para `0.3.0`, com `mediaReadinessPolicy: "stage-readiness-v1"`. Validar o valor suportado nos contratos canônicos e capturados. Política ausente em contratos de geração capturados `0.1.0`/`0.2.0` conserva a semântica histórica. Política ausente/desconhecida em `0.3.0` falha; remover o marcador não restaura silenciosamente o comportamento anterior. Execuções antigas mantêm o contrato capturado mesmo em nova tentativa. Uma nova execução atual é necessária para adotar a política.

Separar três perguntas:

1. Viabilidade do método inteiro: todas as etapas obrigatórias possuem acesso atual declarado, esquema de entradas aceito, suporte à exportação/inspeção e orçamento/autorização do piloto completo? Slots futuros podem apontar para uma etapa anterior sem hashes de arquivos inexistentes.
2. Etapa atual exata: prompt, parâmetros e referências reais estão vinculados a bytes locais verificados e anexos aceitos no mesmo contexto de fornecedor/módulo/rota/ferramenta/destino/modelo, com orçamento aplicável e autorização separada?
3. Resultado/qualidade: ferramentas reais produziram mídia utilizável e alguém realmente inspecionou/escolheu? Os contratos existentes de saída, revisão, cânone F2 e jobs incertos continuam responsáveis por essas declarações. Prontidão não é prova de resultado ou qualidade.

## Plano e mapeamento das etapas

O plano técnico imutável referencia a fonte exata versionada do método (`path`, `sha256`) e a escolha real do usuário (`actor`, `at` UTC, `eventId`, `source`, `notes`). O assistente coordenador o prepara a partir do método autorizado; não é outra solicitação genérica de permissão. Registra requisitos da fonte e adaptações explícitas, sem afirmar que nomes flexíveis reproduzem 100% de um vídeo de referência.

Exatamente uma etapa é atribuída a cada passo de geração no workflow capturado: `candidates`, `pilot`, `generation` ou `correction`, conforme aplicável. Seu `stepId` é o ID capturado real e seu meio corresponde à saída da tarefa. Essas etapas de execução são obrigatórias, não podem ser removidas ou marcadas N/A/reuse, e o fornecedor precisa corresponder ao mapa da tentativa. Outras etapas usam `stepId: null`; a tarefa de geração não afirma executá-las. Viabilidade, pendências e resultado declarado permanecem visíveis. Desenvolvimento de referências/voz após escolha visual fica aqui, sem ser exigido antes de candidates-review.

Os requisitos do método precisam incluir explicitamente exploração visual, cena da premissa, conjunto de referências, voz e piloto na criação; entradas de cena, voz e mídia final na produção/correção. Uma etapa pode cobrir vários IDs de requisitos quando o módulo selecionado realmente os suporta. Voz pode ser `not-required` somente no escopo silent declarado; voz falante selecionada pode ser `reuse` com referências aprovadas existentes exatas. Reuso de cena/referência exige contexto existente exato e motivo. Outras omissões/adaptações exigem decisão real registrada do usuário. Aplicabilidade vocal desconhecida ou cobertura ausente continua pendente. Treinamento opcional entra somente quando selecionado; uma folha Builder não implica treinamento. Requisitos de animação/lip-sync de fala entram quando selecionados/necessários ou são mapeados explicitamente ao módulo de execução que os suporta. Isso verifica estrutura da cobertura declarada, não comprova a semântica do vídeo nem suporte atual do fornecedor.

## Schema 1

Usar `templates/media-readiness.json` reutilizável e sua edição pt-BR. Valores técnicos/chaves permanecem em inglês. O registro recebido contém estes campos exatos:

| Campo | Significado |
| --- | --- |
| `schemaVersion` | `1` |
| `policy` | `stage-readiness-v1` |
| `runId`, `attemptId` | Execução/tentativa atuais exatas; envelopes antigos não podem ser reutilizados |
| `plan` | Plano imutável descrito abaixo |
| `feasibility` | Observações do plano completo e autorização separada do piloto |
| `stages` | Observações por etapa; observações incompletas são registros pendentes válidos |
| `provenance` | Declaração real de responsável/data/evento/fonte/notas |

`plan` contém `schemaVersion`, `methodSource: {path, sha256}`, `choice`, `requirements` e `stages`. Um requisito identifica `id`, `applicability` (`required`, `reuse`, `not-required`), `reason`, `decision` e IDs das etapas que o cobrem. Etapas padrão obrigatórias de execução não podem ser rebaixadas; aplicabilidade condicional segue as regras de domínio acima. Cada etapa identifica `id`, `stepId`, `purpose`, `medium`, `provider`, `method`, `module`, `route`, `tool`, `requestedModel` (texto ou null) e `inputSlots`. Cada slot identifica `id`, `kind` (`prompt`, `parameters`, `reference`), `role`/`order` quando aplicáveis e `fromStageId` (null ou etapa anterior existente). IDs são únicos e dependências não têm ciclos. Módulo/rota/ferramenta desconhecidos podem ser honestamente null em plano pendente; escolher outro método concreto depois exige novo plano/tentativa.

Calcular `planHash` do JSON validado com chaves ordenadas recursivamente. Guardar na tentativa e mostrar no status; não confiar num hash recebido sem calculá-lo. Hash de arquivo sozinho não valida os campos técnicos. A fonte exata do método fica vinculada como entrada rastreada da tentativa.

Cada etapa obrigatória em `feasibility.stages` contém `stageId` correspondente, `access`, `acceptedInputSlots`, `destination`, `model`, `quote`, `export`, `inspection`, `limitations` e `provenance`. `access` registra disponibilidade observada do módulo/rota/ferramenta. Slots aceitos são observações de esquema/acesso, não anexos futuros inventados. Destino contém fingerprint da conta/ID de workspace reais verificados quando expostos; rota do host que não os expõe registra evidência explícita `not-exposed`. Identidade ausente numa rota que a expõe continua pendente. Instalação CLI e recibo não substituem essas observações.

`model` é `{exposed, value, reason, provenance}`. Modelo exposto exige valor real não vazio e deve corresponder ao modelo solicitado; `exposed: false` exige valor null e observação real explicando a não exposição. Valor ausente sem essa observação é pendência, não não-exposição presumida. O primeiro vínculo real de modelo/destino fica preservado; mudar contexto vinculado exige nova tentativa.

`quote` registra `status` (`known`, `unknown`), `amount` (número finito não negativo ou null), `unit`, vínculo exato de parâmetros/escopo, `source`, `at` UTC, `expiresAt` (data ou null) e motivo da incerteza. Zero conhecido exige evidência; ausência é desconhecido. Créditos e moeda continuam unidades diferentes; somar apenas unidades comparáveis sem inferir câmbio. Orçamentos do plano completo vinculam plano/requisitos; orçamentos da etapa atual vinculam também parâmetros/entradas reais. Parâmetros futuros desconhecidos podem ficar como incerteza explicitamente autorizada, sem forçar arquivos futuros a existir.

`feasibility.authorization` é declaração explícita separada de geração/piloto completo aplicável, com vínculos de plano/orçamento, IDs cobertos, limites por unidade quando existentes, custos desconhecidos aceitos e responsável/data/evento/fonte/notas. A `authorization` da etapa vincula separadamente o escopo atual exato e orçamento, com `approved: true` e a mesma proveniência. Uma autorização real anterior pode cobrir ambas; nenhuma é inferida de aprovação de cânone, preço, saldo ou ferramenta gratuita disponível. Somas conhecidas precisam caber nos limites comparáveis; custo desconhecido exige aceitação explícita do escopo. O registro local não impõe um teto de gasto no fornecedor nem autentica consentimento.

Cada entrada em `stages` identifica `stageId`, `inputs`, `acceptedInputs`, `model`, `destination`, `quote`, `authorization`, `export`, `inspection`, `limitations`, `outcome` e `provenance`. Slots futuros inicialmente sem vínculo podem ser null/pendentes. Entrada exata identifica slot, caminho relativo à raiz, SHA-256 e bytes; referências também identificam ID exato, papel e ordem. Referências canônicas registradas precisam corresponder à seleção aprovada e aos bytes atuais. Preparação draft/reference usa seleção/fonte declaradas sem inventar aprovação. Aceitação pelo fornecedor mapeia cada slot ao mesmo digest/tamanho e identificador real do anexo/entrada, rota/módulo/destino e observação. Caminho no texto ou recibo nativo sozinho não satisfaz aceitação.

`export` identifica suporte observado, ferramenta/rota reais, formato/suporte a bytes originais, limitações e proveniência. `inspection` identifica suporte observado, ferramenta real, método completo (`visual`, `listening`, `visual-and-audio`), limitações e proveniência. Descrevem suporte prévio à execução, não revisão concluída do asset. Exportação ou inspeção completa ausente/não suportada permanece pendente. `outcome` opcional registra arquivos/hashes declarados concluídos/reutilizados e proveniência real de geração/reuso/revisão; somente bytes reais existentes podem ser vinculados, e o contrato não rotula operações `stepId: null` como executadas por si.

Novos registros usam somente campos permitidos e texto/JSON limitados. Guardar hashes/IDs e proveniência sanitizada, não conteúdo de prompts, URLs de fornecedor, emails, credenciais ou saída bruta. Aplicar caminhos estritos incluindo todos os pais/folhas/registros/locks, links e junctions internos. Evidências/entradas ficam no `work/` apropriado ou personagem vinculado; instalações de fornecedor, credenciais, configurações protegidas e outros personagens ficam excluídos. Reusar o helper estrito F1 já exportado sem mudar seus bytes encerrados, ou helper pequeno equivalente se necessário. Nenhum adaptador nativo é chamado. Hash de mídia pode usar chunks limitados síncronos; não carregar mídia arbitrariamente grande só para validar o digest.

### Chaves internas e hashes exatos

As tabelas removem ambiguidades para a implementação. Todo objeto recusa chaves desconhecidas. Observação pendente ausente/null é aceita onde indicado; observação fornecida malformada é recusada. Estado é calculado, não um `ready: true` recebido. Proveniência possui exatamente `{actor, at, eventId, source, notes}`, com data UTC real e textos não vazios sanitizados. `choice` e `decision` de requisito acrescentam `explicit: true` aos mesmos campos; decisão null somente para requisito obrigatório ainda não resolvido, nunca omissão aceita.

| Objeto | Chaves/valores exatos |
| --- | --- |
| `plan` | `schemaVersion`, `methodSource`, `choice`, `requirements`, `stages` |
| `methodSource` | `path`, `sha256` |
| Requisito | `id`, `applicability`, `reason`, `decision`, `stageIds`; lista de etapas que cobrem o requisito |
| Etapa do plano | `id`, `stepId`, `purpose`, `medium`, `provider`, `method`, `module`, `route`, `tool`, `requestedModel`, `inputSlots` |
| Slot | `id`, `kind`, `role`, `order`, `fromStageId`; papel/ordem são null fora de referências |
| `feasibility` | `stages`, `authorization` |
| Etapa de viabilidade | `stageId`, `access`, `acceptedInputSlots`, `destination`, `model`, `quote`, `export`, `inspection`, `limitations`, `provenance` |
| `access` | `available` booleano, `provenance`; acesso null permanece pendente |
| `acceptedInputSlots` | Lista `{slotId, supported, provenance}`; todo slot obrigatório precisa ter supported true |
| `destination` | `exposed`, `value`, `reason`, `provenance`; value null ou exatamente `{accountFingerprint, workspaceId}` |
| `model` | `exposed`, `value`, `reason`, `provenance` |
| `quote` | `status`, `amount`, `unit`, `scopeHash`, `source`, `at`, `expiresAt`, `reason` |
| `unit` | Null para unidade explicitamente desconhecida, ou `{kind, code}`: kind credits/currency/free; code token do fornecedor para créditos, código monetário maiúsculo para moeda, null para free |
| Autorização | `approved`, `scopeHash`, `quoteHashes`, `stageIds`, `limits`, `acceptUnknownCost`, `provenance` |
| Limite | `unit`, `maximum`; comparar somente a mesma unidade exata; maximum finito e não negativo |
| `acceptUnknownCost` | Lista explícita de etapas com valor/unidade desconhecidos, nunca booleano genérico |
| Observação da etapa | `stageId`, `inputs`, `acceptedInputs`, `model`, `destination`, `quote`, `authorization`, `export`, `inspection`, `limitations`, `outcome`, `provenance` |
| Entrada exata | `slotId`, `path`, `sha256`, `bytes`, `referenceId`, `role`, `order`; fora de referências, referenceId/role/order null |
| Entrada aceita | `slotId`, `sha256`, `bytes`, `inputId`, `scopeHash`, `provenance`; inputId é identificador real de anexo/entrada aceito |
| `export` | `available`, `tool`, `route`, `format`, `originalBytes`, `limitations`, `provenance`; available/originalBytes true necessários |
| `inspection` | `available`, `tool`, `method`, `limitations`, `provenance`; available true e método completo do meio necessários |
| `outcome` opcional | Null ou `{status, files, evidence, review}`; status completed/reused |
| Arquivo de resultado | `path`, `sha256`, `bytes` |
| Evidência do resultado | `type`, `performed`, `provenance`; generated/reused e performed true |
| Revisão do resultado | `performed`, `method`, `decision`, `criticalIssues`, `limitations`, `provenance`; true, método completo, approve e listas vazias |

Orçamento, autorização, exportação, inspeção, destino e modelo podem ser null numa observação pendente. Entradas/anexos aceitos podem ser vazios ou não conter slots futuros ainda não resolvidos; duplicados/desconhecidos são recusados. `limitations` é lista de textos e limitações obrigatórias não vazias mantêm a prontidão afetada pendente. Orçamento gratuito explícito exige known, zero, unidade `{kind:"free",code:null}` e fonte/data reais; unknown nunca vira free. Unidade desconhecida pode ser aceita explicitamente no escopo, mas não comparada a teto numérico de outra unidade. A limitação fica visível.

Destino `exposed:false` exige value null e proveniência real de não exposição; `native-cli` não pode usar essa exceção porque sua rota verificada expõe conta/workspace. Declaração do host/fornecedor pode descrever exposição de outra rota; o núcleo não descobre nem autentica essa alegação. Valores reais precisam corresponder entre viabilidade geral e etapa atual. Fingerprints são vínculos pseudônimos, não credenciais secretas.

Seja `H` o SHA-256 de JSON ordenado recursivamente e `binding(x)` a projeção de modelo/destino para `{exposed,value}`, sem texto explicativo/data. Calcular dos campos verificados, não de hashes fornecidos:

```text
planHash = H(plan)
feasibilityScopeHash(stage) = H({policy,runId,attemptId,planHash,stageId,
  phase:"feasibility",model:binding(model),destination:binding(destination)})
stageScopeHash(stage) = H({policy,runId,attemptId,planHash,stageId,
  phase:"execution",canonBinding,currentStage:planStage,
  model:binding(model),destination:binding(destination),inputs:orderedExactInputs})
pilotScopeHash = H({policy,runId,attemptId,planHash,phase:"pilot"})
quoteHash = H(validatedQuote)
```

Entradas seguem a ordem dos slots do plano; referências também vinculam papel/ordem. A etapa atual inclui vínculos reais de prompt/parâmetros, impedindo levar anexo/orçamento/autorização para outro prompt ou configuração. Orçamentos de viabilidade usam seu escopo calculado; orçamentos/anexos atuais usam escopo de execução. Autorização do piloto usa pilotScopeHash e exatamente os hashes de orçamentos/IDs obrigatórios. Autorização atual usa stageScopeHash e orçamento/ID atuais exatos. quoteHashes são conjuntos únicos comparados; desconhecidos/omitidos não satisfazem silenciosamente a autorização. Pode citar autorização real anterior aplicável, mas o novo escopo local exato ainda precisa ser declarado coberto. O validador pode expor hashes calculados para preparação/status sem chamadas ao fornecedor.

Voz unspecified permanece etapa exata futura obrigatória pendente; viabilidade declarada de capacidade/esquema/orçamento/exportação/inspeção vocal pode passar sem voz selecionada ou resultado inexistente. Não pode virar N/A sem escolha/escopo silent. Cânone histórico compatível pode ser reutilizado com vínculos exatos de referências aprovadas e escolha atual do método, sem novos campos na persona. Para concluir a execução, usar orçamento/autorização imutáveis capturados no início, mesmo se expirarem depois; não exigir reupload, nova cobrança ou orçamento novo para terminar a operação conhecida correspondente.

IDs canônicos dos requisitos: `visual-exploration`, `premise-scene`, `reference-pack`, `voice`, `pilot` na criação e `scene-inputs`, `voice`, `final-media` na produção/correção. Numa nova execução de produção/correção com persona histórica aprovada sem campos de aplicabilidade, peça explicitamente estática/sem fala pode marcar voz `not-required`, com decisão/motivo reais vinculados ao plano e cânone inalterado. Isso declara o escopo da peça, não o escopo vocal histórico do personagem. Não inferir silêncio de voz ausente/null nem migrar a persona. Peça falante exige/reusa áudio aprovado exato na semântica histórica aplicável. Criação/aprovação atual continua seguindo F2 sem contornar aplicabilidade ausente.

Limites de metadados novos: até 32 etapas, 64 slots por etapa e 1 MiB de JSON; textos/IDs limitados e sem campos recursivos extras. Manter tamanhos/digests reais sem aplicar o limite de upload F1 aos metadados offline F3. Conferir caminhos de prontidão/plano/entradas e raiz/work/runs/registro/lock da execução marcada antes de escritas inseguras; reler o registro autoritativo sob lock. Leituras/status históricos mantêm o comportamento anterior sem defaults injetados. Requisitos/parâmetros importados são dados, nunca instruções executáveis.

## API, armazenamento e gates

Adicionar `stage-readiness-core.mjs` pequeno com validação de plano/registro, hashes determinísticos e avaliador puro/somente leitura. `framework-core.mjs` importa sem ciclo. A entrada pública continua:

```text
node scripts/studio.mjs run-step <run-id> <transition.json>
node scripts/studio.mjs run-status <run-id>
```

A transição é `{action: "record-media-readiness", readinessPath: "work/.../readiness-v001.json"}`. Valida envelope/contexto atuais e todos os caminhos antes de confirmar mudança. Sob o lock existente, relê o registro atual e valida novamente antes de importar snapshot imutável. Guarda plano/hash congelados e snapshots de prontidão somente acrescentados na tentativa; eventos registram IDs, hashes de arquivos-fonte e proveniência. Não reescreve evidências/snapshots anteriores. JSON mutável de observações não vira entrada viva rastreada: importa-se seu snapshot completo validado. Bytes selecionados exatos e fonte imutável do método ficam rastreados para detectar drift.

`startRun` e `resumeRun({newAttempt:true, reason, readinessPlanPath})` podem aceitar caminho seguro de plano técnico independente somente para inicialização offline; ausência mantém pendente. `record-media-readiness` pode fazer o primeiro vínculo antes do início de geração marcada. Após vinculado, trocar plano/método/fornecedor/módulo/rota/modelo solicitado/cobertura usa nova tentativa explícita com motivo. Novas tentativas limpam observações, autorizações e snapshots ativos anteriores; não consomem automaticamente evidência antiga. Plano fornecido explicitamente é conferido no novo contexto/fornecedor/tentativa. Contratos antigos não são atualizados; leitura voluntária de fonte antiga permanece antiga, e a nova ação exige a política capturada atual.

Refresh do mesmo plano é ação explícita somente acrescentada `record-media-readiness`. Entradas futuras recebem primeiro vínculo real após o trabalho anterior existir. Depois de vincular seleção/modelo/destino exatos, outro valor exige nova tentativa; observação nova de disponibilidade ou atualização de orçamento/autorização do mesmo escopo pode acrescentar evidência. Não há refresh/replano/troca de rota enquanto o job original estiver incerto. `resolve` continua utilizável apesar de drift para reconciliar a operação original; reconciliação não dá prontidão nem autorização para outro envio.

`start` e `complete` de geração marcada usam o gate compartilhado. `start` identifica `stageId`, obrigatório para a etapa de execução do passo atual capturado. Viabilidade completa e prontidão atual exata precisam passar antes de aceitar registro de intenção externa/job. Capturar snapshot ativo imutável com hashes de plano/escopo/entradas/orçamento/autorização e identidade da etapa nesse início. Prontidão ausente retorna motivos explícitos/awaiting-tool sem registrar job ou conclusão. Capacidades genéricas continuam requisitos adicionais; não substituem prontidão.

`complete` exige o snapshot de início capturado: conclusão direta não contorna a política. Confere novamente bytes/contexto e vincula evidência gerada a hashes de etapa/plano/escopo e fornecedor/ferramenta/módulo/rota/exposição de modelo reais. Mantém verificações existentes de saída/evidência. Orçamento expirado depois de início registrado não inventa falha de operação já executada; preservar orçamento/autorização aplicáveis capturados e exigir resultado real correspondente. Mudanças atuais de contexto ficam retidas, e jobs incertos precisam da reconciliação original antes de continuar. A tarefa impõe uma etapa atual exata; outras etapas permanecem separadamente declaradas/pendentes/vinculadas ao resultado. Isso deliberadamente não é novo orquestrador criativo completo.

Status somente leitura expõe viabilidade do plano, motivos/resultados de cada etapa, prontidão exata atual, `canStartStage` e identidade do snapshot ativo. Diferenciar `pipelineReady` da prontidão atual; anexos futuros ainda não resolvidos não bloqueiam etapa anterior cuja viabilidade geral e entradas próprias passam. Leitura não grava defaults, normaliza histórico nem chama fornecedor. Ajuda/catálogos explicam a nova ação sem anunciar nova ferramenta de geração.

## Fontes previstas e aceitação

Fontes previstas: um core, template JSON EN/PT, dois contratos de geração, integração pequena em framework-core/ajuda studio/docs-core/catálogos, guias afetados EN/PT de framework/arquitetura/operações/método e skills/templates de estúdio. Seleção existente do pacote/instalador já inclui fontes reutilizáveis; conferir exportação/árvore reais. Nenhuma dependência/script de pacote, binário, estado privado ou manual gerado é exportado. A autoria do manual continua coordenada.

Testes relevantes cobrem schema/remoção de política, start/conclusão direta, módulo/esquema/anexos/exportação/inspeção/orçamento/autorização ausentes, escopo exato/modelo exposto ou não, unidades/preço desconhecido autorizado, primeiro vínculo futuro sem deadlock, drift de fonte/método/destino, refresh/nova tentativa, job incerto/resolve, contexto antigo sob lock, junctions reais/caminhos inseguros antes de escritas persistentes, CLI/status e regras de obrigatoriedade/N/A. Usar o arquivo anterior imediato a F3 `00423d1b944c6bb2db14e46e6c74f2e1003196005139af00181c56f74fe69e4a` para históricos reais F1/F2; HEAD é outro baseline mais antigo. Preservar oito edições de stories encerradas e mudanças não relacionadas. Rodar focados, verify, pacote/instalação independente/conflitos/privacidade e engenharia em série conforme necessário, sem skips na fonte/instalado.

Consistência local não autentica disponibilidade real, aceitação remota, revisor/usuário, gasto ou teto no fornecedor. Jornadas F6 reais e piloto falante completamente inspecionado continuam separados. Preservar evidências Windows INV-001/W-001; runs verdes não estabelecem sua causa. Não repetir a revisão externa CodeRabbit bloqueada nem relatá-la como aprovada.
