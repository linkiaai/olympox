# Story ENG-005: Vincular prontidão de geração às etapas exatas e contexto da tentativa

Edição secundária de [brownfield-stage-readiness.md](brownfield-stage-readiness.md). Fonte: F3 comprovado e autorização do próximo incremento local.

## Status

**Done**

## Executor Assignment

executor: "@dev"
quality_gate: "@architect"
quality_gate_tools: ["marked-generation start/complete refusal", "exact stage/input/destination/context binding", "offline pending and append-only evidence", "historical bytes and captured-contract regression", "npm.cmd run verify", "actual archive/independent installation preservation"]

Aria define fronteira aditiva no ADR 003; Dex implementa só após Ready. Quinn verifica independentemente e responde por Done. Pax valida/administra fechamento posterior. Orion coordena fontes/gates; Gage apenas release autorizado separadamente.

## Story

**Como** criador planejando mídia em estúdio OLYMPOX independente,
**quero** prontidão por etapa com módulo, inputs, destino, custo/autorização e caminho de entrega reais,
**para que** capability genérica ou acknowledgement não apresentem rota incompleta como pronta.

## Origem e escopo

F3 comprovado: capabilities atuais são tokens de meio/provider; módulo exato, transporte, preço/autorização e exportação/inspeção vivem no Markdown conversacional. Hash de plano preserva bytes sem validar significado preenchido. ENG-003 trouxe transporte exato de imagens; ENG-004 aplicabilidade vocal; nenhuma certifica todas as etapas.

Usuário autoriza incremento local: registro pequeno/aditivo e gate de geração de contrato atual, checks sintéticos/instalação, Node 22+ sem deps. Login, mutação de provider/conta, upload/geração real, gasto, produção privada e publicação fora. ENG-001–004 fechadas/bytes intactos; F6 e Windows INV-001/W-001 separados. [ADR 003 canônico aceito](../decisions/003-per-stage-media-readiness.md)/[pt-BR](../decisions/003-per-stage-media-readiness.pt-BR.md), com apêndices exatos de campos/hashes, definem fronteira de implementação.

## Acceptance Criteria

1. Adicionar `stage-readiness-core.mjs` sem deps e templates schema-1 `templates/media-readiness.json` pareados, importando snapshots validados nas tentativas privadas. Envelope: `policy: "stage-readiness-v1"`, runId/attemptId exatos, plan imutável, feasibility, stages/provenance reais. Vincular fonte versionada path/hash e escolha real de método; calcular planHash por JSON validado com chaves recursivamente ordenadas, sem confiar em hash recebido. Exatamente uma etapa obrigatória por step de geração capturado, com medium/provider iguais; auxiliares `stepId: null` não são alegadas executadas pela task. Cobertura exige exploração visual/premissa/referências/voz/piloto na criação e cena/voz/mídia final em produção/correção; silent/reuse/adaptações seguem decisões reais, sem apagar etapas arbitrariamente. Módulo/rota/tool/model exposto/slots ordenados/bytes/destino explícitos; sem capacidade/modelo oculto ou prosa/capability/ack substitutos.
2. Etapas exigidas ficam pendentes até checks de acesso/inputs aceitos/quote ou incerteza explicitamente autorizada/autorização/exportação/inspeção e provenance actor/date/event/source/notes. Viabilidade futura de schemas/rotas/custo difere de bytes atuais; candidatos não exigem voz/cenas futuras. Voz unspecified mantém etapa exata/outcome futura pendente mesmo com feasibility passando. Calcular hashes de feasibility/execution/pilot/quote do ADR a partir de campos validados; conferir conjuntos de quotes/stages, limites de unidades comparáveis e lista explícita de etapas com custo desconhecido. Zero/free só com evidência; unknown nunca vira free. Conexão/F1 receipt/ID/capability/sucesso alheio não substitui check. Model/destination coincidem entre fases; native-cli não usa conta/workspace not-exposed. Declarações provam consistência, não provider/humanidade/qualidade/certificação integral.
3. Draft/preparação offline continuam utilizáveis sem ferramentas/inputs/preço/autorização. Status/next-task mostra etapas/checks de viabilidade versus execução atual/razões acionáveis sem provider. Execução futura aguarda arquivos próprios sem bloquear etapa anterior satisfeita. Escopo explícito com motivo preservado pode justificar inaplicabilidade; falta de capacidade/dinheiro não apaga requisito. Em novo produce/correct com persona legada aprovada sem aplicabilidade, peça explicitamente estática/silent pode ter voice not-required, decisão/motivo reais vinculados a canon/plano inalterados; não relabela personagem nem insere campos. Speaking usa áudio aprovado exato na semântica legada; criação/canon atual mantém F2. Sem provider substituído/upload/dispatch pago/custo zero/free/ilimitado fabricados.
4. Atualizar só `generate-candidates`/`generate-piece` para `0.3.0` com `mediaReadinessPolicy: "stage-readiness-v1"`; validação canônica/capturada recusa ausência/policy desconhecida nessa versão antes de escrever. Gate compartilhado start/complete. Start nomeia stageId atual, exige viabilidade completa/inputs exatos e captura hashes imutáveis de plano/escopo/input/quote/grant antes do job. Complete exige start capturado correspondente, reconfere bytes/contexto e liga evidência a provider/tool/module/route/model/escopo reais, mantendo output/review existentes. Ausência retorna pending/awaiting-tool acionável sem job/conclusão; complete direto/instruction/ack não bypassam. Quote expirada após start válido não inventa falha da operação original concluída. Apenas declaração local, sem dispatch/autorização ampliada.
5. Adicionar ação run-step `{action: "record-media-readiness", readinessPath: "work/.../readiness-v001.json"}` e readinessPlanPath standalone seguro opcional em start/new-attempt offline. Validar envelope/paths antes de escrita persistente e reler contexto sob lock antes de importar snapshot imutável; JSON mutável de observação não vira input vivo. Rastrear fonte do método/bytes selecionados para deriva. Troca de plano ou contexto/seleção/modelo/destino já vinculados exige new-attempt/motivo; primeiro vínculo futuro real após upstream é permitido. Disponibilidade ou quote/grant atualizados do mesmo escopo acrescentam snapshots. Nova tentativa limpa observações/grants/start atuais sem mudar anteriores/herdar evidência. Sem refresh/replano com job incerto; resolve original permanece apesar de deriva, sem liberar outro envio.
6. Canon/personas/aprovações/seals/referências/mídia/backups/contratos históricos mantêm bytes/hashes/comportamento. Geração capturada `0.1.0`/`0.2.0` sem policy fica legada, inclusive new-attempt; nova ação/gate exige policy capturada atual, adotada em run atual novo. Sem defaults/troca de contrato/gate retroativo; fronteira não autentica legado forjado. Estática/silent/tentativas encerradas/incertas intactas. Status readonly expõe pipelineReady, razões/outcome de todas as etapas, prontidão atual, canStartStage e identidade do start sem escrever/alegar qualidade. Sem reabrir ENG-001–004 ou reescrever aprovações.
7. Regressões públicas CLI/core: offline pending/checks ausentes/sem mídia futura/ack insuficiente/prontidão exata/start e complete bypass/escopo condicional ou peça estática legada/model exposto ou não/destino native/source/module/route/tool/attempt/step/contract divergentes/hashes scopequotegrant/unidades/zero conhecido/unknown autorizado/expiry antes de start versus após captura/deriva/append-only/primeiro vínculo futuro/new-attempt/job incerto com resolve apesar de drift/reread sob lock/metadata malformada-extra-grande/bytes EN/pt-BR históricos. Recusar readiness plan/input/root/work/runs/record/parent/lock inseguros ou linkados, incluindo links/junctions internos, antes de persistir; zero escrita e snapshots preservados. Fonte real F1/F2 anterior extraída é oráculo, não HEAD. Tokens/fixtures não provam provider/mídia/host reais.
8. Atualizar templates/criteria/status/help/guias inglês e pt-BR, catálogos/fontes atuais do manual só quando necessário, sem reescrever manual alheio. Readiness/evidência/preços/grants/recibos/IDs privados fora da exportação; distribuir só fontes/templates/testes/guias. Executar `npm.cmd run verify`, pacote real/estúdio independente extraído e instalado, exportação exata/preservação histórica/arquivos/Git/merge/conflito, com Aria/Quinn. Relatar evidência/limites; sem provar módulos vivos, escuta/lip-sync/qualidade/piloto iniciante, publicação ou paridade de mídia Codex/Claude.

## CodeRabbit Integration

`coderabbit_integration.enabled: true` configurado. Aprovação automática recusou diff externo antes de executar porque autorização não cobria exportação ao serviço. Sem nova exportação/retry/PASS externo; preservar bloqueio e review local independente delimitado.

### Story Type Analysis

Principal: lógica local de workflow/contrato. Secundário: vínculo de evidência, compatibilidade, privacidade/distribuição. Risco médio em transições/versões/status e semântica de referência/voz; sem dispatcher/serviço de persistência novos.

### Specialized Agent Assignment

Dex após Ready; Aria desenho/fronteira; Quinn QA/lifecycle; Pax planejamento/administração; Orion arquivos/gates. Gage só release remoto autorizado.

### Quality Gate Tasks

- [x] Preparação antes de commit: regressões reais de transição, produto completo, exportação/preservação e Aria/Quinn. Registrar recusa CodeRabbit sem bypass.
- N/A — PR/deploy: nenhuma operação remota autorizada neste incremento.

### Self-Healing Configuration

Política light Dex só se review autorizado executar: até duas iterações/15 minutos para críticos, mantendo falhas. Sem retry de provider, gasto ou nova tentativa automáticos.

### Focus Areas

Inputs/contexto de todas as etapas, razões claras de pendência, gates start/complete iguais, evidência append-only, tentativa explícita na mudança material, bytes históricos, limites honestos/privacidade.

## Tasks / Subtasks

- [x] Implementar schema/hashes mínimos exatos ADR 003, dois contratos versionados, etapas mapeadas/template (AC 1–6).
- [x] Implementar plano/evidência/status contidos e binding run/attempt/step/contract/input/destino/checks (AC 1–3).
- [x] Gate compartilhado start/complete e validação versionada, com preparação offline (AC 3, 4).
- [x] Plano imutável/evidência append-only/mudança material/new-attempt/incerteza (AC 5, 6).
- [x] CLI/core atual/histórico com casos pertinentes e falhas sem escrita (AC 4–7).
- [x] Parear templates/contratos/help/guias/catálogos e privacidade de pacote/instalação sem manual alheio (AC 8).
- [x] Gates focused/full/installed, File List/evidências reais para Quinn (AC 7, 8).

## Dev Notes

Fontes atuais: `scripts/framework-core.mjs` testa tokens em `missingTaskCapabilities`; `packageRun` apresenta `canContinue`, task e prontidão vocal. `startRun` captura workflow/tasks/roles/hash completo. `transitionRun` já registra deriva, ack e resultado externo incerto; `checkOutputs` aceita arquivos existentes e evidência declarada. Prontidão complementa controles sem afirmar dispatch real.

`framework/tasks/generate-candidates.json`/`generate-piece.json` versão `0.2.0`, capability generation e requisitos por módulo em prosa. `templates/production-method.md` diz que é plano conversacional, não schema; exige método/tool/provider/module/route/model exposto, anexos exatos, preço/autorização/exportação/inspeção. Hash não interpreta isso. `scripts/studio.mjs`: `run-start/run-status/run-step/run-resume`; mutações guardadas por `scripts/development-context.mjs`.

ADR 003 aceito: `scripts/stage-readiness-core.mjs` sem import circular, storage/lock/eventos existentes e ação record-media-readiness. Envelope schemaVersion1/policy stage-readiness-v1/runId/attemptId/plan/feasibility/stages/provenance. Plan: schemaVersion/methodSource `{path,sha256}`/choice/requirements/stages. Requirement required|reuse|not-required com motivo/decisão real/IDs cobertos. Stage: id/stepId/purpose/medium/provider/method/module/route/tool/requestedModel/inputSlots; slot id/kind prompt|parameters|reference/role/order/fromStageId. IDs únicos, dependência acíclica. Module/route/tool null desconhecidos são pending honesto; seleção concreta diferente replana.

Feasibility por etapa: access/acceptedInputSlots/destination/model/quote/export/inspection/limitations/provenance, com autorização separada do piloto completo. Slots são schema futuro aceito, sem inventar arquivos. Execução: inputs/acceptedInputs/model/destination/quote/authorization/export/inspection/limitations/outcome/provenance. Input slot/path/SHA-256/bytes, referenceId/role/order quando aplicável; canon coincide com seleção real, draft não fabrica aprovação. Aceitação mapeia digest/tamanho exatos ao attachment/input ID real no mesmo contexto/module/route/destino. Acknowledgement F1 não substitui.

Destino expõe fingerprint/workspace ou observação not-exposed onde não são expostos; ausência em rota que expõe segue pendente. Model `{exposed,value,reason,provenance}` exige valor real/matching requestedModel ou observação de não exposição. Quote known/unknown liga unit/amount/parameters/scope/source/UTC at/expiry/uncertainty; somar só unidades comparáveis, zero comprovado, desconhecido explicitamente aceito. Autorizações piloto/etapa separadas ligam plano/quotes/cobertura/limites/escopo exato/user provenance; mesma autorização real pode cobrir ambas, mas canon/preço/saldo/free não substituem. Sem autenticar consentimento/teto real de gasto.

Export/inspection declaram suporte/route/tool/format ou método completo/limitações/provenance, sem review final. Outcome só vincula bytes reais existentes. Ausente/unsupported pending. Objetos fornecidos recusam chaves extras; missing/null pendentes documentados são aceitos. Tabelas exatas ADR são normativas: estado derivado, sem ready:true recebido. Limites 32 etapas/64 slots por etapa/1 MiB JSON, textos/IDs sanitizados/limitados; não impor cap de upload F1 ao hash offline F3. Sem prompt bodies/URLs/email/credenciais/output persistidos. Preflight plan/observação/source/root/work/runs/record/lock marcado, recusando links/junctions internos/externos antes de persistir; hash em chunks. Sem adapter.

Apêndice: H é hash de JSON com chaves recursivamente ordenadas; binding(model/destination) só exposed/value. planHash=H(plan). Scope feasibility liga policy/runId/attemptId/planHash/stageId/phase feasibility e bindings. Scope execution acrescenta phase execution/canonBinding/current plan stage/inputs exatos ordenados de prompt/parâmetros/referências. Pilot scope liga policy/runId/attemptId/planHash/phase pilot; quoteHash=H(validatedQuote). Grant piloto cobre exatamente quotes/stages obrigatórios; grant atual liga quoteHash/stageScopeHash/stageId exatos. Slots/hashes duplicados/desconhecidos recusados; anexos usam scope execution calculado. Prosa/datas não substituem hashes/autenticam declaração. Preparar hashes calculados é avaliação offline.

run-step importa `{action:"record-media-readiness",readinessPath:"work/...json"}`; readinessPlanPath opcional em start/newAttempt liga plano offline. Refresh acrescenta snapshots sob lock; sourcehash/provenance registrados sem input vivo do JSON mutável. Start identifica stageId/captura prontidão; complete exige hashes/contexto/evidência correspondentes. Status separa pipelineReady/canStartStage/prontidão/outcome; canContinue/capabilities não certificam. Tasks geração `0.3.0`/mediaReadinessPolicy stage-readiness-v1; capturados `0.1.0`/`0.2.0` intactos inclusive newAttempt. Sem banco/SDK/scheduler/nó no grafo/verificador remoto; 15 tasks/três workflows mantidos.

Fontes: ADR 003 aceito EN/PT/apêndice final campos/hashes, AGENTS/CONSTITUTION/studio-team, `.development/README.md`/guias, arquitetura/framework-02/operations/localization, runtime/tasks/templates citados, avaliação privada F3/Morgan/Quinn. ENG-003/004 são requisitos de domínio, nunca arquivos reabertos. Mudanças previstas: core/template, dois contratos, integração pequena framework/studio-help/docs-core/catálogos e fontes pareadas framework/operations/produção/skills/instruções; seleção já inclui reutilizáveis e deve ser exercitada. Manutenção/avaliação/records privados fora da exportação.

### Testing

Node built-in e estúdios sintéticos isolados. Históricos fixos independentes de templates/tasks novos, preservando bytes/hashes sem regenerar esperado. Candidato F1/F2 anterior extraído, SHA-256 `00423d1b944c6bb2db14e46e6c74f2e1003196005139af00181c56f74fe69e4a`, é oráculo real de fonte anterior; HEAD sozinho não representa aquela implementação. CLI e transições start/complete diretas, append/new-attempt/drift e readiness input/record/parent/lock link/junction inválidos, incluindo links internos, e status readonly. Provider/mídia/declarations fictícios não provam qualidade/transporte/escuta. Manter falhas; não relaxar atomicidade, omitir casos ou esconder Windows por retry. `npm.cmd run verify`; sem lint/typecheck. Quinn aplica Done após gates reais delimitados. Plano privado prévio de Quinn: `work/maintenance/stage-readiness-2026-10-09/quinn-test-plan.md`; planejamento, não QA PASS.

### Riscos e rollback

Validação ampla pode bloquear legado; gate incompleto pode aceitar capability ou complete direto. Policy capturada/versionada e gate compartilhado mitigam. Declarações editáveis não são verificação provider/humana. Mudança de plano pode usar preço/grant stale; contexto/new-attempt exatos. Reverter só mudanças novas revisadas mantendo observações/histórico/snapshots/aprovações/trabalho alheio; sem reset/migração de estúdio para passar teste.

## Change Log

| Date | Version | Description | Author |
| --- | --- | --- | --- |
| 2026-10-09 | 0.1.0 | Draft F3 delimitado; handoff schema/API aceito no ADR 003 pendente | @po Pax |
| 2026-10-09 | 0.1.1 | Validada GO (9/10) contra ADR 003 final EN/PT e apêndice exato — Status: Draft → Ready | @po Pax |
| 2026-10-09 | 0.1.2 | ENG005-DEV-RFR: implementação local, gates fonte/instalação e revisão independente reais concluídos; Status Ready for Review, Done reservado a Quinn | @dev Dex |
| 2026-10-09 | 0.1.3 | QA Gate PASS — Status: Ready for Review → Done; qa-gate:ENG-005:90aeb0cb0b8cfbd4cf9502266ac0177b3b15806f6c462ab115c347af2f73c221 | @qa Quinn |
| 2026-10-09 | 0.1.4 | Fechamento administrativo após Quinn QA PASS/Done; conteúdo revisado e histórias anteriores preservados [closure-key: ENG-005:digest:sha256:90aeb0cb0b8cfbd4cf9502266ac0177b3b15806f6c462ab115c347af2f73c221] | @po Pax |

## Dev Agent Record

### Agent Model Used

Codex; worker Dex real com configuração de modelo herdada do coordenador. Perfil canônico dev e skill aiox-dev carregados; nenhum perfil criativo ativado.

### Debug Log References

- `tmp/stage-readiness/dex-focused-01.log`: falha inicial preservada, 17/24; sete divergências dos fixtures (regex generated/generation, pilotScopeHash, provider default e unidade credits válida). Sem relaxar validação do produto.
- `tmp/stage-readiness/dex-focused-02.log`: PASS 77/77, fail 0, skipped 0; 26 regressões atuais F3 e 51 regressões explícitas legadas de framework/idioma/vocal.
- `tmp/stage-readiness/dex-focused-03.log`: PASS 27/27 F3, fail 0, skipped 0 após incluir custo real de outcome auxiliar concluído.
- `tmp/stage-readiness/dex-handoff.json`: hashes/File List congelados para QA; contratos legados comparados aos bytes da extração real pré-F3; oito histórias anteriores preservadas.

- `tmp/stage-readiness/dex-r2-focused.log`: PASS 28/28 F3, fail 0, skipped 0; custo real auxiliar ausente fica pendente, primeiro preço real conhecido/desconhecido pode ser vinculado explicitamente e depois fica imutável. Teste afetado `dex-r2-affected.log`: PASS 1/1. Provas iniciais preservadas; `dex-handoff-r2.json` registra quatro hashes de produto alterados após achado independente real.

- `tmp/stage-readiness/primary-preverify-01.log`: falha real de build anterior aos testes, por omissão dos novos critérios pt-BR; correção exata restrita ao catálogo registrada em `dex-locale-correction.json`, com logs docs:build/docs:check PASS e hashes antes/depois.
- `tmp/stage-readiness/primary-verify.log`: `npm.cmd run verify` PASS, 244/244, fail 0/skipped 0, seguido de validate/doctor/docs:check reais.
- `tmp/stage-readiness/package-audit.json` e `package-audit.log`: arquivo real `e382709ffad7b0cbe1cbe61e1780045ce168f912bb76785322015d204c36694a`, 197 arquivos empacotados/207 instalados, verificação instalada 244/244 sem falhas/skips, bytes exatos, privacidade, Git, merge idêntico e conflito sem escrita.
- `tmp/stage-readiness/aiox-verify.log`: 7/7 checks reais e 12 projeções Codex locais; dependências do produto 0.
- `work/maintenance/stage-readiness-2026-10-09/aria-final-review.json`: PASS arquitetural local na fonte final, incluindo r2 e delta de tradução.
- `tmp/stage-readiness/quinn-evidence-summary.json` e `quinn-package-results.json`: 22/22 grupos únicos independentes, fail 0/skipped 0, incluindo CLI-03 no pacote/instalação reais; composto dos grupos já aprovados e dois grupos corrigidos/reexecutados, sem inventar uma única execução 22/22.
- Histórico QA preservado: primeiro run 14/21, segundo 19/21 e afetados 2/2; setups/oracles privados documentados em `quinn-first-run-triage.md`. Achado real separado `quinn-aux-null-cost-repro.json`/log reproduziu custo auxiliar ausente e primeiro binding bloqueado antes da correção r2; não foi classificado como erro do fixture.
- `tmp/stage-readiness/final-verification.json`: 197 fontes finais congeladas, 198 caminhos baseline com somente 26 alterações revisadas e oito arquivos novos, oito histórias encerradas preservadas, F1/wrapper intactos, AGENTS pt-BR igual em fonte/arquivo/instalação e HEAD inalterado.


### Completion Notes List

ENG-005 local concluído e pronto para revisão/aceitação de Quinn. Implementação, cobertura de AC 1–8, documentação EN/PT, export/instalação e gates reais acima passam na fonte final. Preservados plano/entradas/canon/evidências e contratos históricos; geração atual exige viabilidade, entradas/aceitação/custos/autorizações reais declarados e início/conclusão correspondentes. Fonte local não publicada, ainda versão de pacote 0.5.0; não regravou release anterior. Node v24.18.0 no Windows foi exercitado; Node 22 mínimo, outros OS, descoberta real de skills no Codex/Claude, provedor vivo, mídia, escuta, lip-sync, qualidade, paridade e publicação não foram certificados. F6 e INV-001 continuam separados. CodeRabbit permaneceu bloqueado pela aprovação automática por faltar autorização específica de exportar o diff ao serviço; registro anterior preservado e revisão local aplicada, sem retry/bypass/PASS externo. QA conserva autoridade sobre Done; Pax administra fechamento posterior.

### Developer DoD Self-Assessment

- [x] Requisitos/AC 1–8: implementação delimitada, testes atuais/históricos e revisão Aria/Quinn ligados acima.
- [x] Padrões/estrutura/API/modelos/validação/erros/privacidade: Node ESM sem dependências externas, schemas exatos e paths/bytes preservados; sem segredos hardcoded.
- [x] Testes/funcionalidade/edge cases: focused real, CLI sintético e produto/instalação 244/244; não se afirma produção audiovisual real.
- [x] Administração: tarefas marcadas, decisões/falhas/limites e File List reais; Status Ready for Review, ainda não Done.
- [x] Build/configuração/documentação: build/check reais e traduções completas; nenhum novo ambiente/dependência/provider dispatcher.
- N/A — lint/typecheck, meta formal de cobertura e auditoria de novas dependências: sem gates/metas configurados ou dependências novas; nenhum PASS inexistente.
- N/A — revisão externa/publicação/provedor real: fora da autorização local; bloqueio CodeRabbit e trabalhos F6/INV-001 preservados.
- [x] Dex confirma itens aplicáveis atendidos; aceitação de ciclo de vida pendente com Quinn/Pax.

### File List

- `docs-site/config.json`
- `docs-site/locales/pt-BR.json`
- `docs/framework-02.md`
- `docs/framework-architecture.md`
- `docs/locales/pt-BR/AGENTS.md`
- `docs/locales/pt-BR/framework-02.md`
- `docs/locales/pt-BR/framework-architecture.md`
- `docs/locales/pt-BR/framework/README.md`
- `docs/locales/pt-BR/operations.md`
- `docs/locales/pt-BR/skills/higgsfield-studio/SKILL.md`
- `docs/locales/pt-BR/skills/olympox/SKILL.md`
- `docs/operations.md`
- `framework/README.md`
- `framework/tasks/generate-candidates.json`
- `framework/tasks/generate-piece.json`
- `scripts/framework-core.mjs`
- `scripts/studio.mjs`
- `skills/higgsfield-studio/SKILL.md`
- `skills/olympox/SKILL.md`
- `templates/locales/pt-BR/production-method.md`
- `templates/locales/pt-BR/studio-AGENTS.md`
- `templates/production-method.md`
- `templates/studio-AGENTS.md`
- `tests/framework.test.mjs`
- `tests/language-compat.test.mjs`
- `tests/vocal-scope.test.mjs`
- `scripts/stage-readiness-core.mjs`
- `templates/locales/pt-BR/media-readiness.json`
- `templates/media-readiness.json`
- `tests/fixtures/pre-stage-readiness/activate.mjs`
- `tests/fixtures/pre-stage-readiness/generate-candidates.json`
- `tests/fixtures/pre-stage-readiness/generate-piece.json`
- `tests/fixtures/stage-readiness.mjs`
- `tests/stage-readiness.test.mjs`

Registros de implementação nesta edição e `brownfield-stage-readiness.md`. Estado temporário privado citado acima não faz parte do produto. ENG-001–004, bytes F1 fechados e histórico privado fora do escopo.

## QA Results

PASS — A política local delimitada verifica início e conclusão da geração, exige inputs exatos aceitos e evidência ligada ao snapshot capturado, preserva plano imutável/snapshots append-only e mantém suporte, custo ou autorização ausentes como pendentes. A viabilidade do piloto é separada dos arquivos futuros. O orçamento retém quotes de execuções capturadas e auxiliares concluídos: outcome auxiliar sem quote atual fica pendente, a primeira quote aplicável pode ser vinculada uma vez e a substituição posterior é recusada. Reuse vocal vincula o áudio exato aprovado e selecionado ao input da execução speaking.

Os 22 grupos independentes passaram no escopo final: 19 grupos da versão final do runtime mais dois grupos de fixtures corrigidos, seguidos pelo CLI do pacote/instalação reais. Código 244/244 e instalação extraída para os dois assistentes 244/244 passaram sem falhas/skips. Passaram freeze de 197 fontes, 197 arquivos no pacote/207 instalados, privacidade/ausência de dependências, projeções/instruções exatas, preservação Git, merge idêntico e conflito sem escrita. Sete checks de engenharia/12 projeções passaram. Aria aprovou a arquitetura local delimitada. As oito edições fechadas de ENG-001–004 e as fontes de preparação/transporte F1 permaneceram byte-exact.

As falhas iniciais de setup/oracle, o defeito reproduzido de quote auxiliar null, a correção estreita e a falha do catálogo pt-BR anterior aos testes estão preservados. O único delta posterior de tradução passou inspeção e gates docs/full/pacote; não se alega repetição dos testes de runtime.

```yaml
story_id: ENG-005
reviewer: "Quinn (@qa)"
verdict: PASS
reviewed_revision: "sha256:90aeb0cb0b8cfbd4cf9502266ac0177b3b15806f6c462ab115c347af2f73c221"
reviewed_source: "sha256:b75303e521845908653f29461b67160c9a3454c844bdfde2f7080936efcc7fd2"
reviewed_at: "2026-10-09"
scope: "ENG-005 bounded local stage-readiness policy"
```

Proof: `work/maintenance/stage-readiness-2026-10-09/quinn-verification.md`, `quinn-story-gate.json`, `quinn-story-provenance.mjs`; `tmp/stage-readiness/quinn-evidence-summary.json` and `final-verification.json`. Actual candidate SHA-256 `e382709ffad7b0cbe1cbe61e1780045ce168f912bb76785322015d204c36694a`.

PASS certifica somente consistência local. Não autentica consentimento/acesso/inspeção reais nem comprova teto de gasto do provider, acesso/aceitação de inputs reais, mídia gerada, escuta/qualidade/lip-sync, jornada de iniciante, descoberta de skills ou paridade de mídia Codex/Claude. Junctions de diretório nativas foram exercitadas; branches de file-symlink não são alegados. F6 ao vivo e Windows INV-001/W-001 seguem separados. A aprovação automática bloqueou CodeRabbit antes da execução; não houve repetição nem PASS externo. O candidato é local e não publicado; não houve operação de provider nem Git/publicação. Quinn possui Ready for Review → Done; Pax pode administrar fechamento sem alterar conteúdo revisado.

## PO Validation

GO — 9/10; confiança alta para implementação local delimitada. Pax validou EN/PT em 2026-10-09 com validate-next-story.md, template configurado e ADR 003 final aceito/campos-hashes-limites/precisão peça estática legada. Orion aceitou desenho; sem decisão do usuário faltante.

Template: seções exigidas/oito AC correspondentes/executor-gate distintos/tasks/fontes/testes pertinentes/Dev-QA-File List reservados, sem variáveis não resolvidas. Críticos/should-fix/anti-hallucination: nenhum restante. Viabilidade/execução atual/outcome separados; sem capacidade/provider/serviço/migração inventados. CodeRabbit type/roles/gates/self-healing/focos/recusa pré-execução explícitos, sem PASS externo. Evidência futura opcional pertence a F6/INV-001. Ready libera implementação local, não código/QA/produção/publicação aprovados.


## Closure Metadata

Data: 2026-10-09. Responsável administrativo: Pax (@po). Autoridade QA/lifecycle: Quinn (@qa); Status Done preservado.

reviewed_revision aceita: sha256:90aeb0cb0b8cfbd4cf9502266ac0177b3b15806f6c462ab115c347af2f73c221. Fonte revisada: sha256:b75303e521845908653f29461b67160c9a3454c844bdfde2f7080936efcc7fd2. Gate: `work/maintenance/stage-readiness-2026-10-09/quinn-story-gate.json`; algoritmo: `OLYMPOX-QA-STORY-v1`. A chave única está em Change Log. Apenas seções administrativas excluídas mudaram; conteúdo revisado e as oito edições fechadas ENG-001–004 permanecem byte-exact. F6 e Windows INV-001/W-001 seguem separados. Este fechamento administrativo não executa publicação nem operação de provider.
