# Story ENG-006: Executar fornecedores opcionais com vínculos duráveis de identidade e orçamento

Edição secundária de [brownfield-provider-execution.md](brownfield-provider-execution.md). Fonte: recomendação de abstração aprovada e esclarecimento do usuário sobre framework reutilizável para consumidores independentes, 2026-10-13.

## Status

**Done** — QA local independente, gates da fonte e verificação real do pacote instalado passaram. Aceitação real do fornecedor/mídia continua como piloto do consumidor.

## Executor Assignment

executor: "@dev"
quality_gate: "@architect"
quality_gate_tools: ["public CLI and controlled HTTP fixture flow", "canonical references and vocal scope", "uncertain submission recovery", "atomic budget concurrency", "npm.cmd run verify", "actual archive/independent installation preservation"]

River (`@sm`) prepara/valida esta story aprovada; Aria responde pelo [ADR 004](../decisions/004-provider-execution.md) e [pt-BR](../decisions/004-provider-execution.pt-BR.md). Worker coordenador implementa executor/CLI/integração; worker BytePlus implementa adaptador; QA independente verifica. Ready decorre da autorização do usuário e não reabre ENG-001–005 nem autoriza publicação.

## Story

**Como** consumidor independente OLYMPOX com conta própria,
**quero** execução API reutilizável image/video/speech delimitada com entradas preservadas, jobs duráveis e orçamentos numéricos,
**para** trocar motores suportados sem reconstruir identidade nem perder histórico de execução/custos.

## Origem e escopo

A consulta identificou limite real: core registra escolhas/prontidão, mas não executa fornecedores nem reserva orçamento compartilhado. O usuário aprovou fronteira genérica opcional e rota BytePlus, esclarecendo que credenciais, orçamento ou influenciador pessoal dele não são requisitos para construir framework. Escopo: fontes reutilizáveis Node 22+ sem dependências, CLI/templates/guias, testes HTTP/core sintéticos e verificação em estúdio instalado independente.

Image/video BytePlus e TTS HTTP documentado são capacidades separadas. Preset TTS prepara voz draft, não clonagem canônica. Padrão Higgsfield, integrações, contratos/workflows capturados, histórias privadas, seleção vocal e cânone congelado permanecem. Esta tarefa não faz login real, mutação de conta, geração paga, treino, produção privada ou release remoto. Consumidores configuram acesso após instalação.

## Acceptance Criteria

1. Adicionar executor/CLI opcional separado de `framework-core.mjs` e adaptador BytePlus com capacidades/validação, estimativa, submissão/status e extração documentadas. Usar APIs Node nativas; banco, hosting, binário, SDK/dependência e serviço permanente não são obrigatórios. Preparação/status/help offline continuam. Instalador nunca autentica/envia. Higgsfield e entrypoints/contratos existentes mantêm comportamento; escolha BytePlus é explícita sem fallback silencioso.
2. Preparar snapshots imutáveis de prompt, parâmetros e referências ordenadas exatas. Vincular personagem, purpose, fornecedor/modelo, destino declarado e grant/max cost numérico. Produção vincula cânone/versão/snapshot aprovado e referências visuais/vocais; reference permite draft sem aprovação inventada. Silent recusa fala. Preset/áudio gerado não substitui voz aprovada; áudio canônico sem suporte fica pending. Parâmetros, origem/validade ou capacidade sem suporte são explícitos. Mudança vinculada cria job, sem alterar evidência/cânone.
3. Persistir intenção e reserva conservadora antes de POST. Jobs duráveis privados guardam IDs/status/erros sanitizados e hashes imutáveis. Fila reivindica uma vez sob lock; reinício recupera trabalho local e consulta jobs originais aceitos. POST interrompido/ambíguo vira uncertain, sem reenvio automático na mesma/outra rota. ID ausente não prova não submissão. Retries de consulta/download são delimitados. Cancelamento local não alega cancelamento/reembolso externo. Nova tentativa paga é job explícito distinto.
4. Configurar/inspecionar orçamento numérico por estúdio/projeto com reservas atômicas, atribuição job/personagem, unidades comparáveis, distinção estimado/máximo/efetivo e rejeições. Jobs concorrentes não consomem o mesmo saldo local. Cobrança ausente/sem limite não vira grátis: desconhecido reserva máximo integral do grant e estimativa exige `acceptEstimatedCost` explícito. Custo efetivo desconhecido conserva reserva; recuperação não libera gasto ambíguo. Liquidação usa reconciliação financeira explícita coincidente, sem inferir por tokens. Limite cobre alocação local, não uso externo da conta/teto do fornecedor não verificado.
5. Implementar rotas documentadas image/vídeo assíncrono/TTS HTTP delimitado com credenciais em memória no momento da chamada. Falta de acesso próprio/orçamento retorna pending/recusa antes de geração em rede. Headers secretos, erros brutos, URLs assinadas e chaves ficam fora de jobs, stdout, pacote e backups. Account/region labels não sensíveis são declarações, salvo descoberta verificada. Conta/credenciais e acesso real são passos do consumidor, não efeito da instalação nem alegação de fixture.
6. Exportar bytes reais de mídia bem-sucedida em arquivos novos/confinados com hash/tamanho e recusar conflitos, links/junctions ou path de outro personagem. Status concluído não é exportação, workflow concluído nem aprovação. Evidência usa operações existentes de run/readiness/registro/selo/revisão; sem cânone, task, publicação ou revisão automática. Falha de exportação recupera mesmo job sem nova geração. Manter histórico/entradas utilizáveis após reversão de fornecedor.
7. Fixtures significativas cobrem fluxo público CLI/core com HTTP controlado, bytes image/TTS/vídeo assíncrono; falta/redação de auth; ordenação/drift de referências; scope speaking/silent/legacy; produção sem voz aprovada; POST falho/incerto/reinício sem duplicata; respostas malformadas/grandes; retries status/download; conflitos; paths/links de input/state/lock/output; orçamento simultâneo/recuperação conservadora; bytes workflow/cânone/histórico. Verificar recusa antes de escrita persistente quando aplicável; sem enfraquecer preservação nem tratar imagem como prova audiovisual.
8. Atualizar ajuda/templates/guias/manual inglês e pt-BR. Pacote/instalador incluem apenas reutilizáveis/testes/proveniência; jobs, contas, reservas, mídia e credenciais ficam privados. Executar `npm.cmd run verify`, AIOX local e estúdio independente packed/extracted real, incluindo CLI/HTTP instalado, conteúdo de exportação, preservação Git/arquivos, merge idêntico/conflito preflight. Registrar resultados/limites reais. Piloto real com acesso/autorização do consumidor permanece pending; não é necessário pedir credenciais/orçamento pago ao usuário de desenvolvimento para aceitação local.

## Tasks / Subtasks

- [x] Implementar executor/CLI/driver explícitos e funcionamento offline (AC 1, 5).
- [x] Preparar inputs/cânone/voz exatos, requests imutáveis e validação do fornecedor (AC 2).
- [x] Implementar fila/intenção/status/incerteza/recuperação e orçamentos atômicos conservadores (AC 3, 4).
- [x] Exportar original e fornecer evidência a operações existentes sem aprovação automática (AC 6).
- [x] Acrescentar regressões independentes públicas/HTTP/privacidade/falhas/concorrência/preservação (AC 7).
- [x] Manter documentação EN/pt-BR e verificações reais de pacote/instalação (AC 8).
- [x] Registrar implementação/arquitetura/QA finais e limites reais do piloto do consumidor (AC 1–8).

## Dev Notes

Interfaces relevantes: mapa/transições de `framework-core.mjs`, escopos exatos em `stage-readiness-core.mjs`, cânone/voz/snapshot/manifesto/selo em `studio-core.mjs` e caminhos estritos/incerteza conservadora de `reference-transfer-core.mjs`. Reutilizar helpers genéricos verificados sem inserir pressupostos do fornecedor na identidade. Fila não substitui runs históricos. Métodos/descritor precisam coincidir com CLI/API final; nomes reversíveis podem ser resolvidos durante implementação sem nova aprovação.

API runtime: `prepareJob`, `submitJob`, `pollJob`, `exportJob`, `reconcileJob`, `cancelJob`, `dispatchQueue`, `setBudget`, `getBudget`, `listJobs`, `readJob`. Ledger: `work/provider-execution/state.json`; histórico do personagem: `executions/provider-jobs/<id>/`. Driver: `scripts/providers/byteplus.mjs`. Segredos de processo do consumidor: `ARK_API_KEY` e `BYTEPLUS_SPEECH_API_KEY` separado; chave não é campo de request. Guia público: `docs/provider-execution.md` e pt-BR. Seções de request/identidade, ciclo e finanças do ADR 004 definem falhas relevantes.

Testes usam estúdios sintéticos independentes. Marcador de desenvolvimento recusa mutação criativa neste checkout. HTTP controlado prova pedido/resposta, não regras reais de origem, acesso, voz, fidelidade/exportação ou custo: esses exigem piloto do consumidor. Pipeline falante real precisa cânone externo exato e áudio vocal canônico aprovados; fixture não prova aceitação do serviço. Não trocar padrão porque mocks passaram.

## Quality Gate

Revisão independente foca crashes conservadores, limites atômicos, caminhos/parâmetros do chamador, redação de auth e preservação de cânone/voz/histórico. Completar gates do produto/fluxo instalado após integração. Não há lint/typecheck root. Git/release remoto exige autorização aplicável separada e Gage.

## CodeRabbit Integration

### Story Type Analysis

Primary: integration/API. Secondary: segurança, estado local assíncrono e orçamento. Complexidade alta em incerteza/concorrência/preservação; sem banco/serviço distribuído.

### Specialized Agent Assignment

`@dev` implementa executor/integração e worker do adaptador; `@architect` revisa fronteiras/segurança; `@qa` verifica; `@sm` prepara story. `@devops` não tem release remoto neste incremento.

### Quality Gate Tasks

- [x] Pre-commit: fluxo público real, orçamento/recuperação/privacidade, gates fonte/instalado e revisão independente.
- N/A — Pre-PR/pre-deployment: PR/publicação/deploy remoto não fazem parte.

### Self-Healing Configuration

Dev light review: no máximo duas correções locais/15 minutos para critical antes de escalar achados restantes. Não autoriza CodeRabbit externo, retries pagos, enfraquecer assertions ou descartar falhas. QA mantém veredito independente.

### Focus Areas

Anexos exatos de identidade/voz, paths/parâmetros do chamador, redação de segredo, recuperação conservadora, sem retry POST incerto, reservas numéricas, exportação/história/distribuição. CodeRabbit está enabled upstream, mas externo não é invocado. Recusa automática anterior fica preservada; gate planejado é revisão local independente. Sem PASS externo/bypass.

## Story Preparation Validation

River leu perfil SM canônico, `create-next-story.md` e `product/checklists/story-draft-checklist.md` real (path development/checklists do ativador é stale). Requisito direto aprovado e ADR substituem epic formal ausente; não se inventa epic, ClickUp ou nova aprovação humana. Objetivo/contexto, orientação técnica, referências, autocontenção, testes e seções de revisão fornecem orientação suficiente. Ready registra planejamento, não veredito de qualidade.

## Dev Agent Record

Implementação por Codex (GPT-6), usando o perfil real Dex/AIOX e workers delegados de adaptador, arquitetura e QA independente. CLI/fila opcional sem dependências e adaptador HTTP BytePlus implementados; credenciais do consumidor ficam em memória. Cânone exato, snapshots, hashes de request normalizado/governança, reutilização vocal histórica, reservas conservadoras USD, recuperação do job original e exportação apenas draft preservam bytes históricos. Higgsfield padrão permanece; etapas BytePlus compatíveis escolhidas explicitamente não dependem dele.

Verificação da fonte: `npm.cmd run verify` passou 282/282 testes, zero falhas/skips, seguido por validate, doctor de desenvolvimento e docs:check. `node .development/verify-aiox.mjs` passou 12 projeções locais e zero dependências do produto. Navegação/troca EN/pt-BR no manual real e negativo independente da CLI para JSON privado malformado sanitizado passaram. `npm.cmd pack --offline --ignore-scripts` produziu arquivo real com 214 entradas. Verificação independente do pacote instalado passou: 214 arquivos no pacote, 224 correspondências exatas, 282/282 testes instalados sem falhas/skips, doctor e docs:check. Um POST simulado exportou bytes PNG draft exatos; Git, estado privado/não relacionado, merge retido e conflito sem escrita preservados. Evidência: `tmp/provider-install-ZMrmGX/report.json` e `installed-product-verify.log`. Timeout anterior de dez minutos preservado separadamente; tentativa fresca com streaming passou em 140,891 segundos sem alterar fontes do produto.

Achados corrigidos: tokens de rota/modelo/entradas de readiness, cânone congelado e compatibilidade vocal histórica, drift de request normalizado/governança, bloqueio de nova submissão após incerteza, recusa 4xx explícita alinhada, intenção no ledger antes do run com reconciliação idempotente, polling monotônico, hashes do staging e intenção durável de exportação. Interrupção image/TTS síncrona antes do staging pode deixar export pendente sem ID consultável; regeneração automática é proibida. Acesso real, elegibilidade de origem, fatura/limite externo, fidelidade de identidade/voz e aceitação audiovisual são limites do piloto do consumidor.

### File List

Artefatos: ADR por Aria; story preparada/validada por River:

- `.development/decisions/004-provider-execution.md`
- `.development/decisions/004-provider-execution.pt-BR.md`
- `.development/stories/brownfield-provider-execution.md`
- `.development/stories/brownfield-provider-execution.pt-BR.md`

Diff combinado real:

- `.development/decisions/004-provider-execution.md`
- `.development/decisions/004-provider-execution.pt-BR.md`
- `.development/stories/brownfield-provider-execution.md`
- `.development/stories/brownfield-provider-execution.pt-BR.md`
- `README.md`
- `docs-site/config.json`
- `docs-site/locales/en.json`
- `docs-site/locales/pt-BR.json`
- `docs/framework-02.md`
- `docs/framework-architecture.md`
- `docs/framework-manual.md`
- `docs/locales/pt-BR/README.md`
- `docs/locales/pt-BR/framework-02.md`
- `docs/locales/pt-BR/framework-architecture.md`
- `docs/locales/pt-BR/framework-manual.md`
- `docs/locales/pt-BR/production.md`
- `docs/locales/pt-BR/provider-execution.md`
- `docs/locales/pt-BR/skills/olympox/SKILL.md`
- `docs/locales/pt-BR/tools.md`
- `docs/production.md`
- `docs/provider-execution.md`
- `docs/tools.md`
- `scripts/docs-core.mjs`
- `scripts/provider-execution-core.mjs`
- `scripts/provider-execution.mjs`
- `scripts/providers/byteplus.mjs`
- `skills/olympox/SKILL.md`
- `templates/locales/pt-BR/provider-authorization.json`
- `templates/locales/pt-BR/provider-budget.json`
- `templates/locales/pt-BR/provider-event.json`
- `templates/locales/pt-BR/provider-reconciliation.json`
- `templates/locales/pt-BR/provider-request.json`
- `templates/locales/pt-BR/studio-AGENTS.md`
- `templates/provider-authorization.json`
- `templates/provider-budget.json`
- `templates/provider-event.json`
- `templates/provider-reconciliation.json`
- `templates/provider-request.json`
- `templates/studio-AGENTS.md`
- `tests/byteplus-provider.test.mjs`
- `tests/docs.test.mjs`
- `tests/provider-execution.test.mjs`

Evidência privada: `work/maintenance/provider-execution-2026-10-13.json` e `tmp/provider-execution-install-verify.mjs`; continuam fora do pacote/instalação.

### Autoavaliação DoD

- [x] Escopo funcional local implementado, APIs nativas Node 22+, schemas exatos e proteção de entradas/paths/segredos.
- [x] Fixtures relevantes de HTTP, CLI pública, preservação, incerteza, concorrência, voz e interrupções; fonte 282/282 PASS.
- [x] Documentação pública EN/pt-BR, manual renderizado real e catálogos/fingerprint derivados da fonte.
- [x] Nenhuma dependência runtime nova; ambiente privado de credenciais documentado; arquivo local real produzido.
- [x] Gate final do pacote/estúdio instalado e QA independente PASS concluídos; escopo local Done, sem piloto real do consumidor nem release.
- N/A: lint/typecheck na raiz, meta percentual de cobertura, deployment/release remoto e exportação externa CodeRabbit. Não são gates disponíveis ou autorizados neste escopo.
- Follow-up: piloto real do consumidor para acesso aos modelos, elegibilidade de referências canônicas, cobranças reais e fidelidade audiovisual; transferência de vídeo e condicionamento vocal por preset não suportados continuam explicitamente pendentes.

## QA Results

**Gate: PASS no escopo local do framework reutilizável.** Revisão independente da implementação sem achado bloqueante restante; gate real do pacote instalado concluído.

Quinn (`@qa`) revisou de forma independente executor, adaptador BytePlus, vínculos de workflow/readiness e guias públicos. Achados corrigidos cobrem requests normalizados/governança imutáveis, cânone congelado e reutilização vocal histórica, submissões/reservas conservadoras após incerteza, recuperação idempotente de workflow, status monotônico, verificação dos bytes salvos, journals de exportação e erros públicos sanitizados. Bytes existentes de identidade/voz/histórico e padrões Higgsfield explícitos continuam preservados.

Evidência registrada: `npm.cmd run verify` completo da fonte pelo worker coordenador passou 282/282 testes, zero falhas/skips, com validate, doctor de desenvolvimento e docs:check; AIOX local passou 12 projeções e zero dependências do produto. QA executou de forma independente os 12/12 testes HTTP controlados BytePlus e negativo real da CLI pública para JSON privado malformado: exit 1, stdout vazio, stderr genérico, sem segredo/URL assinada sintéticos expostos nem chamada ao fornecedor ou estado de job. Novas assertions do catálogo de comandos e staleness do driver aninhado passaram; gate completo final da fonte também passou verificações de servidor/paths do manual inicialmente bloqueadas pelo sandbox restrito. Navegação real EN/pt-BR, troca de idioma e inspeção de screenshot foram registradas pelo worker coordenador.

O comando independente de Aria `node tmp/provider-execution-install-verify.mjs tmp/provider-package-audit/olympox-0.6.0-rc.1.tgz --full-verify` terminou com exit 0. QA inspecionou `tmp/provider-install-ZMrmGX/report.json` e log instalado concluído: `npm.cmd run verify` instalado passou 282/282 testes, zero falhas/cancelamentos/skips, em 140891.3842 ms, seguido por validate, doctor e docs:check. Arquivo real contém 214 arquivos reutilizáveis; instalação verificou 224 correspondências exatas de bytes da fonte, skills dos dois hosts e Git preservado. CLI de leitura produziu zero escritas. Fluxo HTTP controlado da CLI instalada fez exatamente um POST, exportou PNG exato como draft, reconciliou custo sintético, preservou bytes da persona e não persistiu chave da fixture. Merge idêntico preservou estado privado/arquivos sem relação; conflito de README recusado no preflight sem escritas; fontes extraídas ficaram intactas. SHA-256 do arquivo: `c197fc7dea54f1cdef57841904bd1bd513b5211c83593e6d117009af0de51766`.

Este gate cobre framework local, não autenticação BytePlus real, geração paga, elegibilidade de origem, cobrança efetiva, fidelidade de identidade/voz ou aceitação audiovisual. Consumidores ainda precisam de piloto controlado próprio, incluindo descoberta real das skills pelo host e fluxo iniciante quando aplicável. Janela de interrupção síncrona imagem/TTS documentada pode exigir recuperação original/manual; regeneração automática ou garantia de recuperação completa não são aceitas. Não se alega release remoto, publicação ou PASS externo CodeRabbit.

## Change Log

| Date | Change | Author |
| --- | --- | --- |
| 2026-10-13 | Ready autorizado após consulta; escopo de conta própria reutilizável e piloto do consumidor pending preservados | River (`@sm`); arquitetura Aria (`@architect`) |
| 2026-10-13 | QA local independente e evidência da fonte registrados; gate do pacote instalado continua pending em Review | Quinn (`@qa`) |
| 2026-10-13 | Gate real do pacote instalado e QA independente final PASS registrados; story local Done com limites reais do consumidor preservados | Quinn (`@qa`) |
