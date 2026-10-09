# Referência dos contratos do runtime

`scripts/framework-core.mjs` implementa registros locais de fluxos no OLYMPOX. O registry seleciona perfis, contratos de tarefas e definições de fluxos; um run salva essas definições com seu contexto observado. O assistente coordenador realiza o trabalho e fornece declarações e arquivos existentes. O módulo não tem dispatcher de agentes nem adaptador de fornecedor.

Pacote e registry usam versão **0.5.0**. Contratos JSON de tarefas/fluxos mantêm revisão de componente **0.2.0** e `schemaVersion: 1`; são identificadores de compatibilidade, não a versão atual do produto. Esta referência descreve a implementação atual, incluindo política aditiva de fornecedor para novas tentativas.

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
