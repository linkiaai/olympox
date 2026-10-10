# Fluxos, runs e retomada

OLYMPOX mantém um registro local do objetivo, sequência de tarefas, responsáveis, arquivos, decisões e tentativas. Atena coordena no Codex ou Claude Code; o runtime entrega a próxima tarefa para o assistente executar com ferramentas reais. A conversa é a interface principal. Use os comandos abaixo para registrar ou retomar trabalho.

## Escolher um fluxo

| ID do fluxo | Contexto inicial | Escopo |
| --- | --- | --- |
| `create-character` | Uma direção a explorar; `personaId` pode ser `null` | Oportunidade, conceito, candidatas, decisão de canon e primeiro piloto |
| `produce-piece` | Personagem existente com canon aprovado | Preparar, gerar, inspecionar, planejar distribuição quando necessário e entregar uma peça |
| `review-correct` | Personagem existente com canon aprovado | Planejar correção, gerar nova versão, inspecionar e entregar |

O registry liga nove perfis e quinze contratos de tarefas aos fluxos. Consulte [equipe](studio-team.md) para responsabilidades, [operações](operations.md) para registros de personagem/mídia e [referência dos contratos do runtime](framework/README.md) para todos os campos das transições.

Para personagem novo, selecione conceito distinto, explore candidatas visuais reais e deixe o usuário escolher a identidade. Uma personagem falante precisa de amostra vocal gerada, ouvida e selecionada antes da aprovação do canon visual/vocal completo. Preserve referências exatas aprovadas, depois prepare um piloto representativo no meio pretendido antes dos lotes. Vídeo é o padrão e é necessário para testar fala, atuação ou movimento planejados. Pesquisa e planejamento de distribuição são opcionais onde o fluxo salvo permitir; geração, revisão, entrega e aprovação do canon não podem ser puladas.

## Iniciar e consultar um run

Salve esta especificação em `tmp/first-cycle.json` dentro do estúdio instalado:

```json
{
  "personaId": null,
  "objective": "Explorar três conceitos originais e preparar o primeiro piloto em vídeo",
  "inputs": [],
  "medium": "video",
  "capabilities": [],
  "mediaProviders": {
    "image": "higgsfield",
    "video": "higgsfield",
    "audio": "higgsfield"
  }
}
```

```sh
node scripts/studio.mjs run-start create-character tmp/first-cycle.json
node scripts/studio.mjs run-status RUN_ID
```

Substitua `RUN_ID` pelo `run-<UUID>` retornado. A resposta contém estado, tentativa, próxima tarefa, perfil responsável, critérios, contexto observado, mudanças e capacidades ausentes. O registro fica em `work/runs/`. Iniciar ou consultar não despacha agentes nem submete mídia.

`inputs` do run e `outputs` da transição são arquivos existentes relativos à raiz com `/`. Um run vinculado não aceita arquivos de outra personagem nem que escapem do projeto. Entradas observadas e saídas concluídas recebem hashes; use entradas estáveis em vez de uma ficha draft ainda em edição. O canon é vinculado separadamente.

## Registrar progresso

Salve uma transição JSON e aplique:

```json
{ "action": "start" }
```

```sh
node scripts/studio.mjs run-step RUN_ID tmp/start.json
```

Quando a persona existir, vincule-a antes das tarefas que a exigem:

```json
{ "action": "bind-persona", "personaId": "my-persona" }
```

`complete` exige as saídas existentes da tarefa e evidência real de execução. Documentos usam `prepared`; geração usa `generated`; revisão usa `reviewed`; entrega usa `delivered`. Gates humanos usam `approval`. O gate de canon corresponde à versão/hash já aprovados em `persona.json`; não escreve essa aprovação. Consulte a [referência dos campos](framework/README.md#registros-de-conclusao).

Registre atores, datas, eventos de ferramentas e arquivos reais. Use `execution.mode: delegated` somente quando um subagente realmente executou; carregar um perfil é uso de instrução.

## Declarar capacidades e método de mídia

Runs novos selecionam Higgsfield para `image`, `video` e `audio`, salvo escolha explícita de fornecedor para o meio afetado. `integrated-images` é alternativa explícita de imagem e é recusada para áudio/vídeo. Salve a decisão e os módulos exatos no [plano de método](../../../templates/locales/pt-BR/production-method.md).

A geração exige capacidade genérica e do fornecedor, como `image-generation` e `higgsfield:image-generation`. Revisão exige `image-inspection`, `video-inspection` ou `audio-inspection`. Informe capacidades verificadas na especificação ou numa transição `start`/`complete`; ausentes deixam a etapa `awaiting-tool`. São declarações, não descoberta de ferramentas ou teste de conexão.

Novos runs `create-character` usam piloto em vídeo por padrão; geração/revisão de candidatas usa imagem. Produção/correção usa imagem por padrão, portanto informe `medium: video` ou `audio` quando necessário. `nextTask.medium` identifica a etapa. Uma string de capacidade não demonstra disponibilidade de Builder, Soul Cinema, voz, treinamento ou outro módulo exato. Evidência de geração e intenção externa devem identificar o fornecedor selecionado.

A task `approve-canon` atualizada, versão `0.3.0`, declara `vocalPolicy: explicit-applicability-v1`. Seu `nextTask.vocalReadiness` mostra `ready`, `applicability` e `reasons` acionáveis: resolver o novo rascunho `unspecified`, vincular áudio exato escutado em `speaking` ou declarar `silent` com referência/seleção vocal null. Concluir exige escopo resolvido, cânone correspondente já aprovado e evidência de seleção aplicável descrita em [operações](operations.md). `canContinue` descreve continuidade geral do run; prontidão vocal descreve separadamente esse pré-requisito de aprovação. Versões legadas salvas `0.1.0`/`0.2.0` sem a policy conservam a semântica anterior; retirar o marcador da versão atualizada ou informar policy desconhecida é recusado. Declarações não autenticam registros legados, ouvintes nem execução do fornecedor.

Retomar um run antigo, inclusive com nova tentativa explícita, preserva seu contrato capturado. Para adotar a policy atualizada, comece um novo run `create-character` atual e conserve o registro histórico. Campos novos declarados na persona ainda recebem a validação aplicável em ambos os contextos.

Tentativas históricas sem `mediaProviders` conservam capacidades e comportamento de meio único salvos. Bytes de identidade, aprovação, mídia e tentativas existentes não são migrados.

## Retomar trabalho e revisar mudanças de contexto

```sh
node scripts/studio.mjs run-resume RUN_ID
```

A retomada normal confere entradas observadas, saídas concluídas, canon e governança. Contexto alterado exige revisão e nova tentativa explícita. Salve, por exemplo, `tmp/resume.json`:

```json
{
  "newAttempt": true,
  "reason": "Revisei as instruções alteradas do framework antes de continuar"
}
```

```sh
node scripts/studio.mjs run-resume RUN_ID tmp/resume.json
```

Nova tentativa começa na primeira etapa do fluxo salvo, observa o contexto atual e preserva tentativas anteriores e o contrato salvo no run. Não carrega outro contrato de fluxo, reenvia jobs nem reutiliza aprovações concluídas. Inicie um run separado quando o trabalho precisar da definição atual em vez da salva.

Mudar fornecedor exige `newAttempt: true`, motivo e `mediaProviders` atualizado. Fornecedores omitidos mantêm escolhas da tentativa anterior; numa tentativa histórica sem mapa, os padrões atuais são introduzidos. `run-step` normal não pode alterar o mapa.

## Submissões externas e resultados incertos

Antes de chamar fornecedor pago, use `start` na geração com `job: {provider, jobId?, requestId?}` para persistir intenção. Isso cria job local `planned` ainda não resolvido, não submissão externa. Preserve identificadores disponíveis.

Todo job registrado exige `resolve` com evidência real de reconciliação antes de concluir a tarefa, incluindo uma resposta normal de sucesso. Resultados são `succeeded`, `failed` ou `not-submitted`; fornecedor/job/request conhecidos devem corresponder. Em interrupção ou resposta ambígua, consulte o fornecedor real antes de decidir. `uncertain` registra o problema; `run-resume` também mantém job não resolvido em `uncertain-result`.

Trabalho não resolvido bloqueia continuação, cancelamento e novas tentativas. Resolver não conclui geração: arquivos locais e evidência de geração ainda são exigidos. O runtime não descobre chamadas sem intenção registrada nem consulta, repete ou cancela trabalho do fornecedor automaticamente. Campos completos estão em [registros de jobs externos](framework/README.md#registros-de-jobs-externos).

## Integridade, preservação e limites

Locks recusam escritas concorrentes. Confira processos ativos antes de recuperar lock interrompido; preserve registro e temporários antes de limpar. Não existe repetição automática paga.

Canon aprovado é comparado com snapshot existente da mesma `identityVersion`. Identidade alterada não pode reutilizar versão substituindo hash de aprovação. Evolua em nova versão com aprovação explícita e preserve snapshots históricos. Job incerto ainda pode ser reconciliado quando o canon mudou.

Use [backups](operations.md#backups-e-recuperacao) para personagens e runs vinculados, preservando contexto compartilhado separadamente. `npm run verify` confere estrutura e integridade locais. Fluxo `completed` registra contratos e declarações aceitos; inspeção real e publicação exigem suas próprias evidências. Consulte [capacidades e limites](studio-status.md).

## Prontidão por etapa

Contratos atuais de geração `0.3.0` exigem `stage-readiness-v1` estruturado antes do início e da conclusão correspondente. O assistente prepara/importa `templates/media-readiness.json` com observações reais por `run-step`, ação `record-media-readiness`; a pessoa não escreve JSON. `readinessPlanPath` opcional vincula um plano offline no início/nova tentativa. Viabilidade do piloto, entradas atuais exatas e resultado concluído são distintos: bytes futuros de voz/cena podem ficar pendentes. Cada etapa necessária exige sua decisão real de método, acesso/esquema, exposição de destino/modelo, preço/incerteza autorizada, autorizações do piloto/etapa, export original e inspeção completa. Desconhecido é pendente, nunca gratuito. Limite da etapa não amplia o teto comparável do piloto, que inclui custos conhecidos capturados de etapas concluídas.

Start informa `stageId` e captura escopo/entradas/preços/autorizações; complete exige captura e evidência correspondente da etapa/provedor/ferramenta/módulo/rota/modelo. Expirar após início válido não impede conclusão correspondente. Status expõe `pipelineReady`, pendências/resultados por etapa, `currentStageReady`, `canStartStage` e identidade da captura. Atualização no mesmo plano acrescenta evidências; mudanças vinculadas exigem nova tentativa explícita. Reconcilie jobs originais não resolvidos antes. Contratos históricos capturados `0.1.0`/`0.2.0` preservam semântica/bytes. Declarações privadas não autenticam acesso/consentimento, impõem teto real de gasto ou provam escuta/qualidade. Veja [o contrato exato de prontidão](framework/README.md) para campos, hashes e evidência de transição.
