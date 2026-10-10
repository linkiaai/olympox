# Story ENG-004: Declarar aplicabilidade vocal antes de novo canon

Edição secundária de [brownfield-vocal-applicability.md](brownfield-vocal-applicability.md). Fonte: finding F2 verificado e autorização do próximo incremento.

## Status

**Done**

## Executor Assignment

executor: "@dev"
quality_gate: "@architect"
quality_gate_tools: ["speaking/silent/unspecified synthetic flow tests", "historical byte/hash/snapshot preservation", "npm.cmd run verify", "independent installed-studio checks"]

Aria define fronteira aditiva; Dex implementa após Ready. Quinn responde por QA independente e lifecycle Done. Pax valida Draft e administra fechamento posterior. Gage cuida de operação remota autorizada separadamente.

## Story

**Como** criador preparando novo personagem em estúdio OLYMPOX independente,
**quero** explicitar aplicabilidade vocal speaking, silent ou unspecified antes do canon completo,
**para que** selecione uma referência vocal exata após escuta quando o personagem fala, sem descobrir sua ausência depois de congelar identidade.

## Origem e escopo

F2 comprovado: canon visual com `voice.referenceId: null` valida; `create-character` vai da revisão de candidatos ao canon sem checkpoint vocal estruturado. Produção com fala falha depois. A história resolve descoberta tardia em novos fluxos; não invalida todo canon silencioso histórico.

Continuação autoriza implementação local e checks sintéticos. Login/upload/geração real de áudio, gastos, produção privada e publicação estão fora deste incremento. ENG-001/002 continuam fechadas e com bytes preservados; F1 transferência e F3 prontidão são separados.

## Acceptance Criteria

1. Novos templates usam `voice.applicability: "unspecified"` e `voice.selection: null`, mantendo schema 1. Só aceitam `unspecified`, `speaking`, `silent`. Draft unspecified permite preparação conceitual/visual; não vira silent/speaking silenciosamente. Workflow/status explica pendência vocal antes de aprovar novo canon completo.
2. A task canônica atualizada `approve-canon` recebe marcador reconhecido `vocalPolicy: "explicit-applicability-v1"` e incremento de versão do contrato. Validação canônica exige marcador nessa versão atualizada e recusa policy ausente/desconhecida antes de novo run; fontes/contratos antigos legítimos são distinguíveis pela versão registrada e marcador ausente. Aprovação sob policy atual exige campo presente/resolvido e seleção aplicável, mesmo quando validator genérico legado aceita ausência. Operações diretas de canon/snapshot em persona declarada e fala aplicam novos checks; unspecified não aprova. Snapshots históricos sem marcador preservam comportamento anterior.
3. Speaking exige `voice.referenceId` ligado a referência exata canônica de áudio voice aprovada, com path/SHA-256/bytes atuais iguais. `voice.selection` liga o mesmo referenceId/path/SHA-256 e declara `method: "listening"`, `performed: true`, `generated: true`, `listened: true`, `selected: true`, reviewer, at, eventId, source, notes, sem critical issues/pending limitations. Evidência incompleta, papel/áudio errado, outra referência ou bytes alterados não completa canon speaking. Declarações provam consistência local, não provider/escuta real, identidade humana ou qualidade.
4. `silent` explícito declara voz não aplicável: `voice.referenceId: null`, `voice.selection: null`; explicar escopo nas notes existentes de aprovação/transição, sem outro campo inventado. Completa canon sem gerar/escutar voz; não fabricar escuta nem exigir áudio pago. Produção com fala recusa silent explícito, mesmo com campos vocais conflitantes; uso speaking posterior requer versão/aprovação existentes.
5. Personas/aprovações/referências/hashes/snapshots/seals/runs/backups históricos preservam semântica e bytes. Ausência de novo campo permanece ausência histórica, sem default inserido ou migração automática. Safeguards novos valem pela fronteira aditiva revisada; snapshots de contratos anteriores não ganham etapas/requisitos reescritos.
6. Adicionar/alterar voz ou aplicabilidade após canon usa regras existentes de versão/hash/aprovação. Mudança de inputs/contrato usa new-attempt explícito quando aplicável. Não recalcular aprovações antigas, alterar canon congelado na mesma versão, gerar voz substituta automaticamente ou conceder autorização externa.
7. Regressões cobrem novos unspecified/speaking/silent, seleção exata completa/incompleta, referência ausente/alterada/papel errado, conflito de escopo, identidade congelada e personas/snapshots históricos sem novos campos/policy. Cobrir marcador canônico ausente/alterado e campo ausente na task atual marcada, com recusas sem escrita. Comparar inventários históricos fixos e exercitar CLI/run, além de helper. Documentar limite: edição intencional do registro/fonte para imitar legado fica fora do guard; presença de campo não autentica ou prova idade.
8. Atualizar contratos/templates/help/guias inglês e pt-BR juntos; refletir sintaxe/catálogos nas fontes existentes, sem sobrescrever outro trabalho do manual. Executar `npm.cmd run verify`, instalação independente/exportação/preservação pertinentes e revisão Quinn. Sintéticos provam contratos locais, não discovery vivo, qualidade vocal ou piloto completo de iniciante.

## CodeRabbit Integration

`coderabbit_integration.enabled: true` permanece configurado. Revisão externa anterior foi recusada antes de executar pela aprovação automática por falta de autorização específica de exportação. Esta história não concede autorização externa; não apresentar CodeRabbit não executado como aprovado.

### Story Type Analysis

Principal: lógica de contrato/workflow local. Secundário: compatibilidade histórica/preservação de identidade. Mudança aditiva delimitada, com risco de integração canon/hash.

### Specialized Agent Assignment

Dex implementa; Aria responde por desenho/revisão; Quinn por QA/lifecycle; Pax por planejamento/administração. Gage apenas PR/release futuro autorizado.

### Quality Gate Tasks

- [x] Preparação antes de commit: checks pertinentes, verificação do produto, exportação/histórico exatos e revisão Aria/Quinn. Registrar limite CodeRabbit sem contornar recusa.
- N/A — PR/deploy: nenhuma operação remota autorizada neste incremento.

### Self-Healing Configuration

Política light Dex somente se integração autorizada executar: até duas iterações/15 minutos para críticos; relatar pendências/preservar falhas. Sem novo roteamento, provider call ou loop pago.

### Focus Areas

Novo escopo vocal resolvido, áudio exato, sem bypass do canon completo, silent utilizável, bytes/hashes históricos intactos, limites e comportamento inglês/pt-BR.

## Tasks / Subtasks

- [x] Implementar campos aditivos e policy versionada aprovados por Aria sem alterar formato legado ou função de hash (AC 1–6).
- [x] Implementar aplicabilidade/checkpoint em fronteiras revisadas, mantendo preparação draft e silent (AC 1–4).
- [x] Vincular escuta/seleção ao áudio exato e recusar deriva/evidência incompleta (AC 3, 6).
- [x] Preservar formato/contratos históricos e regras de versão/new-attempt (AC 5, 6).
- [x] Cobrir fluxos reais, fronteiras diretas e preservação histórica (AC 2–7).
- [x] Atualizar fontes inglês/pt-BR afetadas sem assumir manual alheio (AC 8).
- [x] Executar focused/full/installed pertinentes e manter File List, evidências/handoff QA (AC 7, 8).

## Dev Notes

`templates/persona.json` tem schema 1 e referência vocal nullable sem aplicabilidade. `studio-core.mjs` exige front/angle aprovados e valida voz opcional. `canonHash` inclui todo objeto voice; inserir campos em leituras históricas mudaria hashes de aprovação. Não normalizar objetos antigos com defaults.

Workflow `create-character` versão de componente `0.2.0`: `review-candidates` → `approve-canon`; requisito vocal só em prosa. `framework-core.mjs` captura contratos/tasks completos nos runs e aprova canon já registrado por versão/hash. Snapshots antigos preservam requisitos; novos fluxos atuais precisam de fronteira aditiva explícita.

Aria aprovou desenho mínimo: novos `voice.applicability`/`voice.selection`, sem schema bump, normalização de default ou etapa adicional de geração/escuta. `validatePersona` aplica novo contrato somente com campo presente. Speaking usa áudio/review registrado exato mais declaração vinculada; silent é N/A explícito com ref/selection null. Versionar task canon atual com `vocalPolicy: "explicit-applicability-v1"`; validação canônica exige marcador nessa versão atualizada e recusa policy desconhecida; versões antigas legítimas e snapshots históricos não o ganham. Usar uma assertion compartilhada na validação declarada e aprovação marcada, independentemente da aceitação genérica legada; next-task/status mostra motivo de pendência/resolução.

Manter `canonHash` intacto: já inclui voice cru; campos novos afetam naturalmente hashes novos e ausência histórica preserva hashes exatos. Evolução de canon/aprovação/snapshot usa versão existente. Presença de marcador/campo é fronteira de compatibilidade, não autenticação: legado forjado intencionalmente ou fonte antiga modificada não são identificados pelo mecanismo local. Sem dependência, banco, serviço, SDK, etapa de orquestração ou geração necessária.

Fontes: [ADR 002 canônico aceito](../decisions/002-exact-reference-and-vocal-scope.md) e [tradução pt-BR](../decisions/002-exact-reference-and-vocal-scope.pt-BR.md); AGENTS/CONSTITUTION, studio-team, arquitetura/operations/framework-02/localization, template/workflow/task/cores citados; avaliação privada F2 e relatórios Morgan/Quinn. Histórico/evidência privada fora da exportação.

### Testing

Node built-in, fixtures sintéticas de estúdios instalados contidos. Áudio fictício verifica estrutura, não escuta real ou provider. Incluir bytes legados independentes do template novo; mudança de template não redefine silenciosamente testes históricos. Snapshots/hashes fixos preservados, sem alterar esperado para esconder regressão. Aceitação de mídia/host real: F6 autorizado. `npm.cmd run verify`; sem lint/typecheck raiz.

### Riscos e rollback

Validação global pode invalidar canon/runs antigos: isolar semântica nova. Silent pode ser obrigado a áudio pago: exigir apenas motivo/contrato aplicável. Declarações podem ser tomadas como escuta real: explicitar limite. Reverter apenas mudanças novas revisadas, preservando produção/histórico/aprovações e manual alheio. Não resetar/migrar estúdios para passar teste.

## Change Log
| 2026-10-09 | 0.2.0 | QA local PASS nos bytes/histórias atuais; fonte e instalado 216/216 sem skips; Ready for Review → Done sob Quinn, limites e proveniência registrados | @qa Quinn |

| Date | Version | Description | Author |
| --- | --- | --- | --- |
| 2026-10-09 | 0.1.0 | Draft F2 baseado em gap comprovado; handoff final Aria pendente | @po Pax |
| 2026-10-09 | 0.1.1 | Validada GO (9/10) contra ADR 002 aceito — Status: Draft → Ready | @po Pax |
| 2026-10-09 | 0.1.2 | Gate vocal aditivo e orientações pareadas implementados; regressões nativas focused passam; Ready for Review com gates combinados produto/export/QA pendentes | @dev Dex |
| 2026-10-09 | 0.1.3 | Registrados passes finais source/installed de 216 testes, privacidade/preservação do pacote real, AIOX e revisão independente; registros pareados liberados a Quinn para lifecycle QA | @dev Dex |
| 2026-10-09 | 0.2.1 | Fechamento administrativo após Quinn QA PASS/Done; conteúdo revisado preservado [closure-key: ENG-004:digest:sha256:9cbcc58aa01c8bd6017aa11442658998f949d35d48bbb0f914055a4cdd852a93] | @po Pax |

## Dev Agent Record

### Agent Model Used

Codex, assistente baseado em GPT-6, ativado como AIOX Dex com skill do repositório e perfil dev canônico.

### Debug Log References

- `tmp/media-flow-increment/f2-focused.log`: suites afetadas seriais no sandbox, 105 testes / 101 passaram / 0 falhas / 4 skips existentes de junction Windows. Evidência de limitação ambiental preservada.
- `tmp/media-flow-increment/f2-focused-native.log`: execução nativa serial autorizada, 105 testes / 105 passaram / 0 falhas / 0 skips, incluindo junctions e 11 novos casos de fluxo vocal.
- Oráculo de hash legado capturado antes de alterar fonte/template: `019ec855021dcab621c9fd550d2f8d40b4ea6b9069c8b52b6cef8279ed4f3c12`. Função `canonHash` de voice cru intacta.
- `tmp/media-flow-increment/primary-verify.log`: `npm.cmd run verify` final dos bytes atuais executado por Orion passou, 216 testes / 216 passaram / 0 falhas / 0 skips, doctor aprovado e manual sincronizado.
- `tmp/media-flow-increment/package-audit.json`: candidato real não publicado SHA-256 `00423d1b944c6bb2db14e46e6c74f2e1003196005139af00181c56f74fe69e4a`; 189 arquivos no pacote, 199 instalados com ambos os assistentes, zero arquivos de engenharia/dependências, bytes de fonte exatos, Git preservado, merge idêntico retido, conflito com zero escritas e ativação criativa sem marker verificada.
- `tmp/media-flow-increment/artifact-rBaDQF/installed-verify.log`: candidato final extraído/instalado passou verificação completa, 216 testes / 216 passaram / 0 falhas / 0 skips. São checks locais de pacote/instalação, não publicação remota.
- `tmp/media-flow-increment/aiox-verify.log`: sete verificações reais de engenharia passaram e 12 projeções Codex verificadas; sem alegação de descoberta real pelo host.
- `work/maintenance/media-flow-increment-2026-10-09/aria-final-review.md`: arquitetura local F1/F2 final PASS, incluindo comparação independente de `canonHash` cru intacto.
- `work/maintenance/media-flow-increment-2026-10-09/quinn-verification.md`: 25 grupos dirigidos independentes passaram (8 vocais + 17 transferência), incluindo reconstrução de históricos inglês/pt-BR anteriores e preservação exata de inventários/hashes. Quinn mantém autoridade sobre QA final e lifecycle Done após este handoff de registros.

### Completion Notes List

- `vocalReadiness` / `assertVocalScope` compartilhados sem inserir campos históricos ausentes. Novo rascunho unspecified e speaking sem seleção ficam pendentes com motivo; cânone declarado completo os recusa. Speaking vincula referência aprovada/revisada de áudio e ID/caminho/hash/bytes atuais exatos da seleção de escuta, eventos obrigatórios e arrays de issues/limitations vazios. Revisão da referência e seleção de escuta podem ter revisores/eventos diferentes.
- Silent explícito mantém referência/seleção null, permite imagens/vídeo silencioso e recusa prompts falados, produção e selo de execução com fala. Regras existentes de versão congelada/aprovação preservam evolução da identidade.
- Task canon `0.3.0` exige `explicit-applicability-v1`; policy desconhecida/ausente atualizada recusa antes de criar run. Versões antigas conhecidas `0.1.0`/`0.2.0` sem policy mantêm comportamento histórico. Conclusão marcada exige aplicabilidade explícita independentemente da aceitação genérica legada; status expõe `nextTask.vocalReadiness`. Retomada/nova tentativa de run antigo preserva contrato capturado; novo run atual adota a policy.
- Helpers históricos usam template fixo anterior sem campos ou removem defaults novos explicitamente. Hashes crus e inventários congelados preservados; sem migrar/regravar persona privada, aprovação, snapshot, selo, run ou backup. Dados/fonte forjados para imitar legado estão fora da garantia de autenticação do guard.
- Fontes inglês/pt-BR, help, templates e skills afetados atualizados de forma delimitada. Instruções compartilhadas incorporam sintaxe ENG-003 de transferência autorizada de imagem e distinguem recibo nativo da prontidão de bytes/plugin/módulo. Dex F1 faz merge da tradução de critério canon no catálogo. Manual alheio e stories de fundação fechadas preservados.
- Autoavaliação DoD: implementação funcional, estrutura, Node sem dependências, testes significativos unit/fluxo/CLI, documentação pareada, gates finais produto/export/installed e evidência independente de arquitetura/QA dirigido completos. Lint/typecheck inexistentes na raiz e PR/deploy remoto são N/A neste incremento local. Entrada final QA/lifecycle de Quinn sucede este handoff; Dex mantém Ready for Review. CodeRabbit externo continua rejeitado antes da execução, sem nova tentativa ou alegação de pass.
- Verificações completas da fonte e do estúdio extraído passaram nos bytes atuais finais. Seleção real pacote/installer exclui estado local de engenharia/privado e dependências, preserva arquivos permitidos exatos e Git, mantém merges idênticos e recusa conflitos sem escritas. Skips anteriores de junction no sandbox continuam registrados; focused nativo e agregados finais têm zero skips. Evidência de falha/skip não foi substituída nem suprimida.
- F3 prontidão de mídia por etapa e F6 aceitação real de host/mídia continuam separadamente pendentes. Checks sintéticos e contrato nativo de transferência não comprovam uploads reais, qualidade de voz gerada/escutada, igualdade de bytes originais no fornecedor, acesso plugin/módulo, jornada de novatos Codex/Claude ou piloto audiovisual completo. Sem alegar prontidão substituta nem qualidade real aprovada.
- Sem login/upload/geração real de fornecedor, voz paga, piloto, commit, tag, push ou publicação. Áudio/extensões/declarações sintéticas comprovam consistência local, não escuta real, identidade do revisor, execução de fornecedor ou qualidade audiovisual. Status é handoff de revisão, não Done.

### File List

- Runtime: `scripts/studio-core.mjs`, `scripts/framework-core.mjs`, `scripts/studio.mjs`; contrato `framework/tasks/approve-canon.json`.
- Templates persona/método: `templates/persona.json`, `templates/locales/pt-BR/persona.json`, `templates/production-method.md`, `templates/locales/pt-BR/production-method.md`.
- Instruções compartilhadas: `templates/studio-AGENTS.md`, `templates/locales/pt-BR/studio-AGENTS.md`, `docs/locales/pt-BR/AGENTS.md`, `templates/studio-CLAUDE.md`, `templates/locales/pt-BR/studio-CLAUDE.md`.
- Skills: `skills/olympox/SKILL.md`, `skills/higgsfield-studio/SKILL.md`, `docs/locales/pt-BR/skills/olympox/SKILL.md`, `docs/locales/pt-BR/skills/higgsfield-studio/SKILL.md`.
- Guias: `docs/operations.md`, `docs/framework-02.md`, `docs/strategy.md`, `docs/framework-architecture.md` e pares em `docs/locales/pt-BR/`.
- Testes: `tests/vocal-scope.test.mjs`, `tests/fixtures/legacy-persona-v1.json`, `tests/studio.test.mjs`, `tests/canon.test.mjs`, `tests/framework.test.mjs`, `tests/language-compat.test.mjs`, `tests/editorial.test.mjs`.
- Tradução coordenada de critério canon: `docs-site/locales/pt-BR.json` (merge por Dex ENG-003 para evitar escrita concorrente).
- Registros de engenharia locais: esta tradução e `brownfield-vocal-applicability.md`. Logs privados ignorados em `tmp/media-flow-increment/`; sem material de engenharia na exportação do produto.

## QA Results

PASS — Novos contratos exigem escopo resolvido e seleção vinculada ao áudio exato; silent permanece utilizável e recusa fala. Históricos reais do código anterior EN/pt-BR, com/sem voz, mantiveram canon, hashes, seals, contratos de run e backups sem alterar bytes.

8 grupos independentes desta história e 25 grupos únicos F1/F2 passaram. Fonte final e candidato real extraído/instalado para ambos os hosts passaram 216/216 testes cada, zero falhas/skips. Arquitetura Aria e pacote/privacidade/Git/merge/conflito/preservação passaram. Sete checks AIOX/12 projeções verificados; descoberta viva não foi comprovada.

```yaml
story_id: ENG-004
reviewer: "Quinn (@qa)"
verdict: PASS
reviewed_revision: "sha256:9cbcc58aa01c8bd6017aa11442658998f949d35d48bbb0f914055a4cdd852a93"
reviewed_source: "sha256:6708477ccfea86c5d00d93f1a33a562740b13712714fe9aa8f2b93972fc5ebbc"
reviewed_at: "2026-10-09"
scope: "ENG-004 additive local vocal applicability and exact selection"
```

Prova: `work/maintenance/media-flow-increment-2026-10-09/quinn-verification.md`, `quinn-story-gate.json` e `quinn-story-provenance.mjs`; `tmp/media-flow-increment/final-verification.json`. SHA-256 do candidato `00423d1b944c6bb2db14e46e6c74f2e1003196005139af00181c56f74fe69e4a`, 189 arquivos no pacote/199 instalados, zero arquivos de engenharia/dependências. Delta final somente de diagnóstico comparado byte a byte e casos afetados revalidados; versões anteriores de hash, eventos de setup/oráculo e logs ambientais de falha/skip preservados.

PASS somente da fronteira local revisada. Não comprova upload real, bytes originais no provider, acesso plugin/módulo, send de áudio/vídeo, geração/escuta ou qualidade vocal real, identidade humana/consentimento, lip-sync, jornada inicial ou paridade Codex/Claude. Campos legados não autenticam dados/fonte forjados. Junctions reais e folhas de link injetadas são evidências distintas; intent planned/incompleto ou lock de reconciliação abandonado pode exigir recuperação local deliberada. F3/F6 e a jornada ampla permanecem CONCERNS; Windows INV-001/W-001 segue separado. Aprovação automática recusou CodeRabbit externo antes de executar; não foi repetido nem aprovado. Sem operação de mídia viva ou publicação remota. Quinn aplica Ready for Review → Done; Pax apenas administra fechamento posterior sem alterar conteúdo revisado.

Aguardando Ready, implementação e Quinn independente. Quinn aplica Done posterior; Pax apenas administra fechamento aceito.

## PO Validation

GO — 9/10; confiança alta para implementação local delimitada. Pax validou ambas as edições em 2026-10-09 com `validate-next-story.md`, template configurado e ADR 002 aceito.

Template: seções exigidas, executor/quality gate distintos, oito critérios, tasks correspondentes, plano de testes, File List reservado e autoridade de lifecycle presentes; sem variáveis não resolvidas. Achados críticos, should-fix e anti-hallucination: nenhum restante. Fontes comprovam hash de voice cru, fronteira de contratos salvos e gap real; sem capacidade de provider ou migração histórica inventada. Classificação/roles/gates/self-healing/focos CodeRabbit registrados; revisão externa segue bloqueada, sem pass de teste de prontidão. Melhoria opcional: evidência real de escuta/host pertence a F6. Ready libera somente implementação; implementação, QA PASS e operação externa ainda não ocorreram.

## Closure Metadata

Data: 2026-10-09. Administração Pax (@po); Quinn (@qa) já aplicou Done com PASS local. Este registro não altera lifecycle ou conteúdo revisado.

Accepted reviewed_revision: sha256:9cbcc58aa01c8bd6017aa11442658998f949d35d48bbb0f914055a4cdd852a93. Reviewed source: sha256:6708477ccfea86c5d00d93f1a33a562740b13712714fe9aa8f2b93972fc5ebbc. Gate: `work/maintenance/media-flow-increment-2026-10-09/quinn-story-gate.json`; algorithm: `OLYMPOX-QA-STORY-v1`. The unique administrative closure key is recorded in Change Log.

Candidata local não publicada; sem provider vivo/produção/paridade certificados. F3/F6/jornada CONCERNS; INV-001/W-001 separado. Recusa automática CodeRabbit antes da execução preservada, sem PASS externo.
