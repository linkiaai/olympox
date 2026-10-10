# Referência dos contratos do runtime

`scripts/framework-core.mjs` implementa registros locais de fluxos no OLYMPOX. O registry seleciona perfis, contratos de tarefas e definições de fluxos; um run salva essas definições com seu contexto observado. O assistente coordenador realiza o trabalho e fornece declarações e arquivos existentes. O módulo não tem dispatcher de agentes nem adaptador de fornecedor.

Pacote e registry usam a versão candidata **0.6.0-rc.1**. Contratos JSON de tarefas/fluxos mantêm revisões individuais de componente, incluindo **0.2.0** e **0.3.0**, e `schemaVersion: 1`; são identificadores de compatibilidade, não a versão atual do produto. Esta referência descreve a implementação atual, incluindo políticas aditivas de fornecedor, voz e prontidão por etapa. Consulte [notas da versão](../release-notes.md) para testes e aceitação real pendente.

Para fluxo conversacional e sequência CLI, leia [fluxos e retomada](../framework-02.md). Para comandos de persona, manifesto e backup, leia [operações](../operations.md).

## API do módulo

| Função | Comportamento |
| --- | --- |
| `validateFramework(root)` | Resolve e valida registry, perfis, tarefas e fluxos; retorna `valid`, erros, avisos e definições resolvidas |
| `startRun(root, options)` | Cria run do fluxo selecionado e retorna o pacote da tarefa |
| `readRun(root, runId)` | Retorna registro salvo, próxima tarefa, mudanças de contexto e requisitos sem alterar |
| `validateRunRecord(run)` | Valida estrutura e hashes históricos independentemente dos arquivos atuais; retorna `true` ou lança erro |
| `transitionRun(root, runId, options)` | Aplica transição declarada sob lock do run |
| `resumeRun(root, runId, options = {})` | Confere continuação ou cria nova tentativa explícita preservando histórico |

Opções de `startRun`: `workflowId`, `personaId`, `objective`, `inputs`, `medium`, `capabilities` e `mediaProviders`. `objective` deve ser preenchido. `create-character` permite `personaId: null` e usa `medium: video` por padrão; produção/correção exige canon aprovado e usa imagem por padrão. Meios aceitos: `image`, `video` e `audio`.

Entradas/saídas são listas de caminhos existentes relativos à raiz com `/`. Caminhos que escapam da raiz, arquivos equivalentes repetidos e arquivos de outra personagem são recusados. Registros: `work/runs/run-<UUID>.json`. O pacote informa `nextTask`, `responsible`, `state`, `attemptId`, `inputs`, `canonBinding`, `drift`, `missingCapabilities` e `canContinue`, junto do run salvo. `automaticallyDispatched` é sempre `false`.

## Política de fornecedor e capacidades

Novas tentativas salvam um mapa completo:

```json
{
  "image": "higgsfield",
  "video": "higgsfield",
  "audio": "higgsfield"
}
```

Opções explícitas podem substituir fornecedor por meio; valores omitidos usam padrões. IDs são tokens ingleses. `integrated-images` é alternativa explícita de imagem e é recusada para vídeo/áudio. Salve a decisão e operações exatas no plano de produção.

Geração exige `<medium>-generation` e `<provider>:<medium>-generation`; inspeção exige `<medium>-inspection`. Imagens Higgsfield, portanto, precisam de `image-generation` e `higgsfield:image-generation`. Capacidades podem ser atualizadas nas opções da transição. Uma capacidade ausente define `awaiting-tool` sem chamar ferramenta.

Em tentativas com política de fornecedor, `generate-candidates` e `review-candidates` usam imagem mesmo com piloto em vídeo. Outras tarefas usam o meio do run; `nextTask.medium` informa a escolha. Tentativas históricas sem mapa conservam comportamento salvo de meio único e capacidades genéricas.

Declarações não provam acesso à conta, suporte exato a Builder/Soul Cinema/voz/vídeo, referências aceitas, custo, exportação ou execução. Confira pelas ferramentas reais antes de prometer produção.

## Campos das transições

Toda transição contém `action`. Ações disponíveis:

| Ação | Campos adicionais e restrições |
| --- | --- |
| `start` | Confere requisitos/capacidades; `execution` e `capabilities` opcionais; `job` somente na geração |
| `complete` | Confere requisitos/capacidades e valida saídas com `evidence` ou `approval` humana |
| `bind-persona` | `personaId`; somente sem vínculo existente, antes das etapas que exigem personagem |
| `skip` | `reason`; somente etapa marcada opcional no fluxo salvo |
| `wait` | `state: awaiting-input|awaiting-tool|in-review` e `reason` |
| `uncertain` | `job` com fornecedor/IDs conhecidos e `reason`; preserva identificadores não resolvidos |
| `resolve` | Status/IDs reconciliados de `job` e `evidence` de tipo `reconciled` |
| `fail` | `reason`; termina tentativa local após reconciliação de jobs |
| `cancel` | `reason`; termina tentativa local após reconciliação de jobs |

Geração, revisão, entrega e decisões de canon não podem ser puladas. Tentativas encerradas exigem nova tentativa para continuar. `mediaProviders` é recusado na transição; altere por retomada explícita.

`execution` usa `{ "mode": "instruction" }` por padrão. Delegação declarada usa `mode: delegated`, `agentId`, `eventId`, `actor` e data ISO `at`. Registre somente após dispatch real de subagente. O runtime não cria esse dispatch.

## Registros de conclusão

Para tarefas sem decisão humana, informe `outputs` e `evidence` com estes campos básicos:

| Campo | Significado |
| --- | --- |
| `type` | `prepared`, `generated`, `reviewed` ou `delivered`, conforme contrato |
| `performed` | Deve ser `true`, descrevendo trabalho real |
| `actor` | Responsável real |
| `at` | Data ISO real |
| `eventId` | Identificador rastreável do evento |
| `notes` | Descrição preenchida do trabalho e evidência |

Saídas devem atender ao mínimo do contrato. Preparação exige documentos. Geração exige extensões compatíveis com o meio da etapa, `tool` e, nas tentativas com política, `provider` correspondente ao mapa. Conferir extensão e declaração não inspeciona MIME/conteúdo.

Revisão também exige `reviewer`, `method`, `decision: approve`, listas vazias `criticalIssues` e `limitations`, e `media: [{path, sha256}]` correspondente a todos os arquivos da última geração concluída. Métodos: `visual` para imagem, `listening` para áudio e `visual-and-audio` para vídeo. Saídas são relatórios em documentos. Entrega deve corresponder aos caminhos revisados e bytes exatos; exportações editadas exigem sua própria revisão aplicável.

Gates humanos usam `approval: {explicit: true, decision: approve, reviewer, at, eventId, source, notes}`. O contrato pode permitir zero saídas. `approve-canon` também exige `identityVersion` e `canonHash` correspondentes à aprovação já registrada na persona. Vincula canon ao run; não aprova nem edita a ficha.

Declarações validam campos rastreáveis, não identidade humana, autenticidade de mensagem ou inspeção concluída. Vincule-as a eventos reais; não copie nomes ou datas de exemplos como evidência.

## Registros de jobs externos

Antes de submeter na geração, use `start` com `job: {provider, jobId?, requestId?}`. Fornecedor deve corresponder à etapa nas novas tentativas. O runtime guarda `status: planned` e intenção antes da submissão; não chama fornecedor.

Todo job permanece não resolvido até `resolve`, incluindo sucesso normal. Uma resposta interrompida pode ser registrada com `uncertain`; retomar job não resolvido define `uncertain-result`. Identificadores conhecidos não podem ser substituídos ao registrar incerteza.

`resolve` exige mesmo fornecedor e IDs conhecidos, status `succeeded`, `failed` ou `not-submitted`, e campos básicos de evidência com `type: reconciled`. Consulte o fornecedor real quando necessário e registre a conclusão real. A transição guarda reconciliação e volta ao estado local `planned`. Geração ainda exige arquivos e evidência em `complete`.

Job não resolvido bloqueia progresso, cancelamento e nova tentativa. Cancelamento local não cancela trabalho do fornecedor nem recupera cobrança. O runtime não descobre chamadas sem intenção e nunca consulta ou repete automaticamente.

## Mudanças de contexto e novas tentativas

Entradas observadas, saídas concluídas, governança, contratos e canon vinculado têm hashes. Transição/retomada comum detecta mudanças e bloqueia continuação. Use `resumeRun(root, runId, {newAttempt: true, reason, mediaProviders?})` somente após revisar mudança e reconciliar jobs externos.

Nova tentativa reinicia o fluxo salvo na primeira etapa, preserva tentativas anteriores e `run.contract`, e observa arquivos atuais de entrada/governança/canon. Não troca definições de fluxos nem reutiliza aprovações anteriores. Inicie run separado quando precisar do contrato atual. Fornecedores omitidos mantêm o mapa anterior; tentativas históricas sem mapa adotam padrões atuais.

Canon aprovado é comparado com snapshot existente da mesma `identityVersion`. Mudança na mesma versão falha mesmo com hash de aprovação substituído. Essas verificações não criam snapshots nem reconstroem história ausente; persona aprovada sem snapshot existente pode continuar válida. Reconciliação de job externo continua possível com outros contextos alterados.

## Armazenamento e limites da verificação

Locks exclusivos impedem escritores simultâneos; arquivos temporários completos são usados para substituição. Interrupção pode deixar lock: confira processos ativos e preserve evidência antes de recuperar. Hashes detectam alterações; não são assinaturas nem autenticam quem pode editar e recalcular registros.

Entradas históricas de fluxos/estados continuam compatíveis sem reescrever bytes. Conclusão local significa que contratos salvos aceitaram arquivos e declarações. Não comprova qualidade, sucesso do fornecedor além da evidência registrada nem publicação. Consulte [capacidades e limites](../studio-status.md).

## Prontidão estruturada de mídia

O assistente coordenador prepara `templates/media-readiness.json` a partir de escolhas e observações reais no estúdio instalado; a pessoa continua pela conversa. Os placeholders null estão incompletos e não são evidência. Salve uma versão do método e vincule seu caminho/SHA-256. Um `plan` independente pode ser informado em `readinessPlanPath` no run-start ou na nova tentativa explícita; planejamento offline não chama o provedor. A primeira importação também pode vincular o plano. A decisão de cada requisito necessário registra o evento real de escolha do método já aplicável; decisões null e módulos desconhecidos ficam pendentes.

Nos contratos atuais `generate-candidates` e `generate-piece` `0.3.0`, o assistente importa `{action:"record-media-readiness",readinessPath:"work/readiness-v001.json"}` por `run-step`. O envelope schema-1 tem exatamente `{schemaVersion,policy,runId,attemptId,plan,feasibility,stages,provenance}` e `policy:"stage-readiness-v1"`. Uma etapa executável necessária corresponde a cada passo de geração capturado: `candidates`/`pilot`, `generation` ou `correction`. Etapas auxiliares usam `stepId:null`; seus resultados separados não são execução dessas tarefas. A criação cobre `visual-exploration,premise-scene,reference-pack,voice,pilot`; produção/correção cobre `scene-inputs,voice,final-media`.

A viabilidade do piloto inteiro verifica acesso de cada módulo, esquemas de entrada aceitos, exposição de modelo/destino, preço ou incerteza autorizada, exportação e inspeção completa. Ela não exige arquivos futuros de voz ou cena inexistentes. A execução atual vincula separadamente arquivos de prompt/parâmetros, papéis e ordem das referências, tamanho/hash dos bytes originais e IDs reais de entrada aceita. Modelo/destino registra `{exposed,value,reason,provenance}`; desconhecido fica pendente e ausência de exposição observada é explícita. `native-cli` exige fingerprint real da conta e workspace. Preços vinculam `{status,amount,unit,scopeHash,source,at,expiresAt,reason}`; credits/currency/free são unidades distintas. Desconhecido nunca vira zero. Autorizações do piloto e da etapa atual vinculam separadamente `{approved,scopeHash,quoteHashes,stageIds,limits,acceptUnknownCost,provenance}`. Custos conhecidos de etapas concluídas, execução atual e estimativas restantes devem caber em cada limite comparável do piloto; a autorização da etapa não amplia esse teto. Declarações não autenticam consentimento nem impõem teto no provedor.

Cada provenance é exatamente `{actor,at,eventId,source,notes}`, com data UTC real; escolhas e decisões acrescentam `explicit:true`. Metadados recusam chaves desconhecidas, limitam JSON a 1 MiB, 32 etapas e 64 slots por etapa e excluem corpo de prompts, saída bruta, credenciais, URLs e emails. Prompts completos ficam nos arquivos locais versionados; o registro carrega hashes. Fontes ficam em `work/` seguro ou no personagem vinculado; links/junctions, configuração protegida e outros personagens são recusados antes de gravar. Hashes de mídia são lidos em blocos sem impor limite de upload.

Use `start` com `stageId` exato somente quando viabilidade e prontidão atual passam. O núcleo captura plano/escopo/entradas/preços/autorizações imutáveis antes da intenção opcional de job. `complete` exige esse início e arquivos de mídia existentes. A evidência generated contém somente `type,performed,actor,at,eventId,notes,tool,provider,stageId,planHash,scopeHash,readinessSnapshotId,module,route,modelExposed,model`, correspondendo à captura e ao método selecionado. Capacidade genérica, acknowledgement, instruction mode ou conclusão direta não burlam a regra. Preço válido no início capturado pode expirar antes da conclusão correspondente. Inspeção completa e entrega continuam necessárias.

Status mostra `pipelineReady` (viabilidade), pendências exatas/resultados por etapa, `currentStageReady`, `canStartStage` e identidade da captura ativa sem gravação ou consulta ao provedor. Entradas futuras podem ficar pendentes enquanto candidatos podem começar. Escopo silencioso explícito pode dispensar voz; ausência histórica compatível de campos vocais permite uma peça estática/silenciosa explicitamente escolhida sem alterar o personagem. Reutilização falada vincula o áudio aprovado selecionado como entrada/resultado exatos e o anexa à execução falada. Isso não burla a seleção vocal do canon atual completo.

Atualização de observações/preços/autorizações no mesmo plano acrescenta snapshots imutáveis; o JSON importado não vira entrada mutável monitorada. Mudar entradas/modelo/destino já vinculados ou plano/método exige `run-resume` com `newAttempt:true`, motivo e, opcionalmente, novo `readinessPlanPath`. A nova tentativa limpa evidências/captura atuais, preserva tentativas anteriores e mantém contratos salvos. Job original não resolvido bloqueia atualização/repetição; `resolve` correspondente segue disponível apesar de drift. Geração capturada `0.1.0`/`0.2.0` mantém semântica legada sem defaults novos; um run atual novo adota a política. Consistência local não prova execução do provedor, escuta, lip-sync, qualidade ou paridade dos hosts. Observações/preços/autorizações privados ficam fora do export do framework.

Objetos internos usam estas chaves exatas. Observações ausentes/null ficam pendentes; objetos fornecidos malformados são recusados. Omissão/reutilização exige decisão aplicável explícita e motivo. Etapas executáveis necessárias não podem ser reutilizadas ou removidas. `inputs` segue ordem dos slots, com papel/ordem exatos das referências; `fromStageId` indica uma etapa anterior e seus bytes reais de saída. Treinamento opcional entra no método apenas quando justificado.

| Objeto | Campos exatos |
| --- | --- |
| Plan | `schemaVersion,methodSource,choice,requirements,stages` |
| Fonte do método | `path,sha256` |
| Requisito | `id,applicability,reason,decision,stageIds`; applicability `required|reuse|not-required` |
| Etapa do plano | `id,stepId,purpose,medium,provider,method,module,route,tool,requestedModel,inputSlots` |
| Slot | `id,kind,role,order,fromStageId`; kind `prompt|parameters|reference`; role/order null fora de referência |
| Feasibility | `stages,authorization` |
| Etapa de viabilidade | `stageId,access,acceptedInputSlots,destination,model,quote,export,inspection,limitations,provenance` |
| Access / slot aceito | `available,provenance` / `slotId,supported,provenance` |
| Valor do destino / unidade do preço | `accountFingerprint,workspaceId` / `kind,code` (token do provedor para credits, moeda em maiúsculas, free com code null) |
| Observação de execução | `stageId,inputs,acceptedInputs,model,destination,quote,authorization,export,inspection,limitations,outcome,provenance` |
| Entrada exata | `slotId,path,sha256,bytes,referenceId,role,order`; referenceId/role/order null fora de referência |
| Entrada aceita | `slotId,sha256,bytes,inputId,scopeHash,provenance` |
| Export / inspection | `available,tool,route,format,originalBytes,limitations,provenance` / `available,tool,method,limitations,provenance` |
| Limite da autorização | `unit,maximum`; `acceptUnknownCost` é lista explícita de IDs, nunca boolean genérico |
| Outcome opcional | `status,files,evidence,review`; completed/reused com arquivos existentes `{path,sha256,bytes}` |
| Evidência / revisão do resultado | `type,performed,provenance` / `performed,method,decision,criticalIssues,limitations,provenance` |

Evidência do resultado é generated/reused e performed true. Revisão completa do meio é approve sem criticalIssues/limitations. Suporte anterior à execução não declara essa revisão concluída. Modelo/destino `exposed:false` exige valor null e motivo real de não exposição. Preço desconhecido exige amount null e reason; zero/free conhecido ainda precisa fonte/data reais. Hashes de preços e IDs autorizados formam conjuntos únicos exatos.

Resultado auxiliar completed/reused sem preço real mantém a continuação pendente; a estimativa anterior de viabilidade não substitui esse custo real ausente. Uma importação explícita pode vincular o primeiro preço real conhecido ou uma declaração real de custo desconhecido com aceitação específica no piloto. Depois de vinculado ao resultado concluído, o preço é imutável; observações posteriores não o trocam por estimativa mais barata.

`readinessHash` calcula SHA-256 do JSON com chaves ordenadas recursivamente (`H`). `binding` projeta exposição em `{exposed,value}`. `mediaReadinessHashes(run,plan,stageId,observation,phase)` fornece hashes offline para preparação; hash de plano fornecido pelo chamador não substitui validação:

```text
planHash = H(plan)
feasibilityScopeHash = H({policy,runId,attemptId,planHash,stageId,
  phase:"feasibility",model:binding(model),destination:binding(destination)})
stageScopeHash = H({policy,runId,attemptId,planHash,stageId,
  phase:"execution",canonBinding,currentStage:planStage,
  model:binding(model),destination:binding(destination),inputs:orderedExactInputs})
pilotScopeHash = H({policy,runId,attemptId,planHash,phase:"pilot"})
quoteHash = H(validatedQuote)
```

Preços de viabilidade vinculam feasibilityScopeHash; preços/entradas aceitas/autorizações de execução vinculam stageScopeHash. Autorização do piloto vincula pilotScopeHash e cada preço/etapa de viabilidade necessário; autorização da etapa vincula o preço/etapa atual exatos. Aprovar canon pode mudar o escopo do piloto futuro: vincule entradas/contexto reais após a decisão, preservando evidência das etapas concluídas. Hashes verificam consistência local e não são assinaturas.
