# Arquitetura do framework

OLYMPOX separa direção do assistente, registros locais e execução externa de mídia. O código atual do framework é a versão candidata **0.6.0-rc.1**; contratos e workflows mantêm revisões próprias de componente, incluindo `0.2.0` e `0.3.0`. Consulte [notas da versão](release-notes.md) para testes e aceitação real pendente.

Este guia descreve os limites da implementação. Use [operação dos workflows](framework-02.md) para comandos e [identidade e registros](operations.md) para procedimentos de arquivos.

## Três camadas

| Camada | Fontes e responsabilidades |
| --- | --- |
| Direção do assistente | Constituição, instruções do assistente, skills, perfis especialistas e guias orientam a organização do trabalho |
| Núcleo local | Scripts Node validam contratos, persistem execuções, preservam versões do cânone e editoriais, selam o contexto declarado de geração e gerenciam backups |
| Ferramentas da sessão | Ferramentas disponíveis do assistente e do provedor fazem pesquisa, delegação, geração de mídia, transferência, inspeção e publicação |

O núcleo usa Node 22+ e arquivos locais, sem dependências externas de execução. Ele entrega o pacote da próxima tarefa ao assistente coordenador. O assistente executa a tarefa com ferramentas disponíveis e registra o resultado; o núcleo não despacha agentes nem chama provedores automaticamente.

## Fontes reutilizáveis e estado privado

```text
framework/
  registry.json                 # Names, roles and registered paths
  roles/                        # Specialist instruction profiles
  tasks/                        # Completion contracts
  workflows/                    # Registered task sequences
skills/                         # Canonical skills
templates/                      # Scaffolding and studio instructions
scripts/                        # Local operations and validation
docs/, docs-site/               # Guides and manual sources

# Private state created in an installed studio:
influencers/<slug>/
  persona.json
  assets.json
  canon/v000001/
  narrative/v000001.json
  content/<id>/v000001.json
  executions/<hash>/
  references/, media/, prompts/, exports/
work/runs/run-<UUID>.json
backups/<backup-id>/
```

Pastas de histórico aparecem quando seus registros são criados. Templates são estruturas iniciais; não estabelecem uma identidade aprovada.

O instalador usa seleção explícita de fontes. Ele escreve o `AGENTS.md` criativo a partir do template do estúdio, adiciona `CLAUDE.md` para Claude Code e projeta skills canônicas na pasta do assistente escolhido. As instruções de desenvolvimento permanecem neste repositório. A instalação não copia registros privados nem conecta contas de provedores.

## Workflows e contratos de tarefas

O registro define nove perfis, quinze contratos de tarefas e três workflows:

| Workflow | Finalidade |
| --- | --- |
| `create-character` | Explorar uma persona, selecionar e revisar identidade, aprovar cânone, produzir e entregar um piloto |
| `produce-piece` | Preparar conteúdo para personagem aprovado existente, gerar, revisar e entregar |
| `review-correct` | Planejar correção, produzir nova versão, revisar e entregar |

Cada contrato define responsável, pré-requisitos, quantidade de saídas, tipo de evidência, capacidades e critérios de conclusão. Os catálogos gerados mostram as definições registradas reais. Etapas opcionais podem ser omitidas com motivo quando permitido.

Uma execução vincula entradas e governança aplicável, captura o contexto do personagem e salva tentativas, resultados e eventos. O status informa próxima responsável, capacidades ausentes e mudanças detectadas.

## Política de provedores de mídia

Novas tentativas preservam um mapa `mediaProviders` para `image`, `video` e `audio`, com padrão `higgsfield`. A geração exige tanto a capacidade do meio quanto a capacidade específica do provedor. Evidência de geração e intenção externa registradas devem identificar o provedor escolhido.

Novas execuções de criação usam um piloto de vídeo por padrão; geração e revisão de candidatos usam capacidades de imagem. Um escopo explicitamente escolhido pode usar outro meio. Alterar o mapa exige nova tentativa com motivo. Execuções históricas sem o mapa mantêm a semântica salva.

Essas declarações restringem a conclusão registrada. Elas não autenticam, descobrem, precificam nem executam ferramentas do provedor. [Ferramentas e capacidades](tools.md) explica as verificações operacionais.

## Histórico de identidade e editorial

Uma versão aprovada do cânone vincula identidade visual/vocal da persona e bytes exatos das referências. Quando existe snapshot congelado, operações de identidade rejeitam outro cânone sob a mesma `identityVersion`. Evoluir a identidade exige nova versão e aprovação.

Novos templates declaram aplicabilidade vocal e seleção exata de escuta. Tasks atualizadas de cânone exigem escopo `speaking` ou `silent` resolvido; identidade silent declarada recusa fala. O hash de voice cru permanece igual, portanto campos históricos ausentes e policies antigas salvas mantêm o significado registrado. [Operações](operations.md) documenta fronteira aditiva de compatibilidade e limites da evidência.

Narrativa e conteúdo têm históricos de versões separados. Uma edição de narrativa não altera automaticamente a identidade. Uma peça pode vincular contexto exato do cânone/narrativa; arquivos editoriais selecionados viram entradas explícitas da execução.

Um selo de execução preserva o contexto declarado de geração e uma cópia do prompt. A revisão do asset vincula bytes da mídia e contexto aplicável. Alterações na mídia exportada exigem nova revisão.

## Recuperação e integridade

Execuções detectam mudanças nas entradas observadas, saídas, cânone e governança. Continuar após mudança de contexto exige nova tentativa explícita com motivo; tentativas anteriores permanecem preservadas. Reformular orientações do framework pode, portanto, exigir revisão de contexto em uma execução antiga.

Persista a intenção externa antes do envio. Um envio não resolvido bloqueia continuidade em `uncertain-result` até o assistente consultar o provedor real e registrar a reconciliação. O núcleo não consulta nem reenvia jobs automaticamente. Chamadas sem intenção registrada não podem ser descobertas pelo runtime.

Criação e restauração preparam arquivos em área temporária e recusam sobrescrever personagens existentes. Backups inventariam arquivos do personagem, pastas vazias e execuções vinculadas. Excluem framework compartilhado, credenciais, ferramentas e entradas fora da pasta do personagem. Preserve essas dependências separadamente.

## Limites e pontos de extensão

Hashes comprovam consistência de bytes, não identidade de revisores nem fidelidade criativa. Um contrato concluído representa evidência local aceita; não comprova publicação nem resultados no mundo real.

Adaptadores de provedores, dashboards, gestão de campanhas, integrações analíticas e bancos de dados não estão incluídos. Adicione-os apenas para necessidade concreta com comportamento verificado, limites de exportação e preservação. Consulte [capacidades suportadas](studio-status.md) e [interfaces do núcleo](framework/README.md) antes de estender o runtime.

A operação opcional separada `reference-transfer.mjs` oferece transferência autorizada de imagem local exata pela CLI nativa Higgsfield fixada; núcleo de workflows e wrapper de preparação continuam sem upload ou geração automáticos. Ela registra snapshot controlado dos bytes e uma submissão, recusa repetição automática de resultados incertos e exige verificações posteriores de bytes no fornecedor e acesso pelo plugin. Veja [preparação Higgsfield](higgsfield-setup.md).

## Prontidão por etapa

Contratos atuais de geração `0.3.0` exigem `stage-readiness-v1` estruturado antes do início e da conclusão correspondente. O assistente prepara/importa `templates/media-readiness.json` com observações reais por `run-step`, ação `record-media-readiness`; a pessoa não escreve JSON. `readinessPlanPath` opcional vincula um plano offline no início/nova tentativa. Viabilidade do piloto, entradas atuais exatas e resultado concluído são distintos: bytes futuros de voz/cena podem ficar pendentes. Cada etapa necessária exige sua decisão real de método, acesso/esquema, exposição de destino/modelo, preço/incerteza autorizada, autorizações do piloto/etapa, export original e inspeção completa. Desconhecido é pendente, nunca gratuito. Limite da etapa não amplia o teto comparável do piloto, que inclui custos conhecidos capturados de etapas concluídas.

Start informa `stageId` e captura escopo/entradas/preços/autorizações; complete exige captura e evidência correspondente da etapa/provedor/ferramenta/módulo/rota/modelo. Expirar após início válido não impede conclusão correspondente. Status expõe `pipelineReady`, pendências/resultados por etapa, `currentStageReady`, `canStartStage` e identidade da captura. Atualização no mesmo plano acrescenta evidências; mudanças vinculadas exigem nova tentativa explícita. Reconcilie jobs originais não resolvidos antes. Contratos históricos capturados `0.1.0`/`0.2.0` preservam semântica/bytes. Declarações privadas não autenticam acesso/consentimento, impõem teto real de gasto ou provam escuta/qualidade. Veja [o contrato exato de prontidão](framework/README.md) para campos, hashes e evidência de transição.
