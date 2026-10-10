# Story ENG-001: Recusar ativação de skills criativas em checkouts de desenvolvimento

Edição secundária de [brownfield-development-skill-activation.md](brownfield-development-skill-activation.md). Fonte: finding F4 comprovado na avaliação AIOX de 9 de outubro de 2026. Correção brownfield delimitada; sem novo épico ou arquitetura de consumidor.

## Status

**Done**

## Executor Assignment

executor: "@dev"
quality_gate: "@architect"
quality_gate_tools: ["focused Node tests", "independent installed-studio checks", "npm.cmd run verify", "export inspection"]

Quinn (`@qa`) é responsável pelo veredito independente após implementação. Gage (`@devops`) executa operações remotas de Git/release que tenham autorização aplicável.

## Story

**Como** desenvolvedor do produto OLYMPOX,
**quero** que todo comando público de ativação de skills criativas respeite o marcador explícito de desenvolvimento antes de escrever,
**para que** a engenharia use AIOX enquanto estúdios independentes possam ativar OLYMPOX normalmente.

## Origem e escopo

F4 foi reproduzido em fixture sintética: `scripts/install-skill.mjs` retornou sucesso e criou uma projeção criativa apesar de `.development/project.json` declarar `framework-development`. O `AGENTS.md` exige recusa de comandos criativos neste checkout. O usuário aceitou manter um repositório público canônico e aplicar as recomendações da avaliação.

O escopo é o CLI público de ativação e a interpretação compartilhada do marcador. Isso não transforma o marcador em controle de segurança/autorização, impede APIs internas de fixtures, altera providers, migra registros históricos ou publica outra release.

## Acceptance Criteria

1. Com marcador válido `schemaVersion: 1`, `kind: "framework-development"`, a ativação pública de `install-skill.mjs` termina com erro para ambas as skills criativas e todos os destinos (`codex`, `claude`, `both`), antes de criar/alterar qualquer diretório ou arquivo de projeção. A mensagem orienta usar um estúdio independente instalado.
2. JSON inválido, schema/kind não suportado, marcador que não é arquivo e caminhos de desenvolvimento com links/junctions são recusados antes de escritas quando há marcador. Erros de leitura não são interpretados silenciosamente como estúdio sem marcador. A interpretação compartilhada mantém o comportamento do marcador e dos comandos de inspeção de `studio.mjs`; help permanece disponível e sem escrita.
3. Sem marcador, inclusive com `.development/` contendo apenas notas locais, o CLI mantém seleção normal de skill/host, retenção de bytes idênticos e preflight de conflitos. Conflito em qualquer destino selecionado impede todas as escritas da ativação; arquivos alheios e metadados Git existentes ficam preservados.
4. Há uma implementação reutilizável de validação do marcador para os entrypoints públicos afetados. O uso interno de `installSkill` em fixtures sintéticas e no instalador mantém seus contratos; nenhuma produção criativa ocorre na raiz de desenvolvimento.
5. Regressões significativas cobrem o comando público que falhava, ambas as skills, todos os hosts, marcadores inválidos e sucesso/preservação em estúdio sem marcador. Os testes observam árvore/bytes antes e depois da recusa, além de mensagem ou chamada de helper.
6. A exportação do produto e um estúdio independente incluem o guard reutilizável, quando necessário ao CLI, sem runtime AIOX, guias/histórias/projeções de engenharia ou dependências. A instalação não autentica, gera nem publica mídia.
7. Atualizar help e a orientação de comportamento afetada em inglês e pt-BR juntos, mantendo tokens. Coordenar arquivos do manual com seu responsável; não alegar atualização do manual hospedado. Executar `npm.cmd run verify`, checks independentes pertinentes de instalação/conflito/preservação e revisão exata da exportação; registrar resultados e limites reais.

## CodeRabbit Integration

A configuração declara `coderabbit_integration.enabled: true`; esta história não altera isso nem afirma disponibilidade do serviço/CLI.

### Story Type Analysis

Tipo principal: lógica de CLI local. Tipo secundário: integração do contexto de engenharia. Complexidade pequena, com regressões sensíveis à preservação.

### Specialized Agent Assignment

Dex implementa/revisa o diff; Aria revisa a fronteira compartilhada; Quinn dá o veredito independente. Gage atua em PR/release posterior autorizado.

### Quality Gate Tasks

- [x] Preparação antes do commit: revisão delimitada, testes focados, verificação final do produto e checks reais do pacote/estúdio concluídos. A revisão automática recusou CodeRabbit antes de executar; limite externo registrado, com revisões independentes Aria/Quinn.
- N/A — Antes de PR: sem PR/release remota autorizados neste trabalho; evidências preservadas por Gage para uma futura operação autorizada separadamente.

### Self-Healing Configuration

Usar política light existente de Dex quando a integração executar: no máximo duas iterações/15 minutos para problemas críticos. Preservar evidência de falhas e relatar defeitos pendentes. Sem novos custos, roteamento de modelos ou dispatch automático.

### Focus Areas

Guard antes de escrita, marcador inválido consistente, nenhum bypass de conflito, estúdio normal preservado, fronteira da exportação e orientação inglês/pt-BR correta.

## Tasks / Subtasks

- [x] Inspecionar parsing do marcador e chamadas de ativação/instalação; confirmar o CLI falho em fixture sintética (AC 1–4).
- [x] Implementar interpretação compartilhada e guard nos entrypoints públicos antes de mutação (AC 1, 2, 4).
- [x] Cobrir recusa, marcadores inválidos, ambas as skills/todos os hosts e sucesso/conflitos normais (AC 3, 5).
- [x] Atualizar help e orientação inglês/pt-BR sem sobrescrever trabalho simultâneo do manual (AC 7).
- [x] Executar checks focados e `npm.cmd run verify`; revisar pacote e instalação independente com preservação/conflitos (AC 3, 6, 7).
- [x] Manter File List, evidências, preocupações e handoff para QA (AC 7).

## Dev Notes

O parser atual é função local em `scripts/studio.mjs`: `lstatSync`, JSON, schema/kind e allowlist de inspeção. `scripts/install-skill.mjs` chama `installSkill` sem verificar marcador, exceto help. `scripts/skill-install-core.mjs` já rejeita paths arbitrários, links e bytes conflitantes antes de escrever; preservar esse desenho.

`tests/development-context.test.mjs` cria estúdios sintéticos independentes e cobre recusa criativa e criação normal; `tests/installer.test.mjs` cobre fronteiras de instalação. Aria aprovou uma leitura compartilhada estrita entre `studio.mjs` e `install-skill.mjs`, com guard no CLI e API interna de fixtures preservada. Não importar `.development/` no código do produto.

O produto usa Node 22+, built-ins e nenhuma dependência runtime. A exportação seleciona fontes explicitamente. Ler os arquivos atuais antes de editar: a separação de engenharia já está sem commit e o manual tem outro responsável.

Fontes: `AGENTS.md`; `.development/README.md`, `coding-standards.md`, `tech-stack.md`, `source-tree.md`; `docs/framework-architecture.md`; `docs/localization.md`; scripts e testes citados; avaliação privada F4 e relatório Quinn em `work/maintenance/aiox-project-review-2026-10-09/`. Evidência privada não integra exportação de consumidor.

### Testing

Usar `node:test`/assertions built-in, arquivos sintéticos e destinos temporários contidos. Exercitar CLI público, status e inventário/hashes antes/depois da recusa. APIs internas podem preparar fixture, sem substituir o comando que falhava. Executar `npm.cmd run verify`; não há lint/typecheck na raiz. Testes não provam discovery vivo Codex/Claude ou qualidade de mídia.

### Riscos e rollback

Guard amplo demais pode bloquear estúdios normais/fixtures; AC 3/4 protegem isso. Parsing divergente pode aceitar marcador malformado; AC 2 cobre. Reverter apenas mudanças delimitadas após revisar diff, preservando histórico e trabalho concorrente. Não resetar checkout ou remover registros de estúdio.

## Change Log

| Date | Version | Description | Author |
| --- | --- | --- | --- |
| 2026-10-09 | 0.1.0 | História F4 redigida a partir da avaliação e fontes verificadas | @po Pax |
| 2026-10-09 | 0.1.1 | Validada GO (9/10) — Status: Draft → Ready; fronteira de leitura estrita compartilhada aprovada por Aria | @po Pax |
| 2026-10-09 | 0.2.0 | Implementados guard público compartilhado, compatibilidade BOM e 26 casos focados aprovados; gates combinados/handoff QA pendentes | @dev Dex |
| 2026-10-09 | 0.2.1 | Gates finais de fonte/pacote/estúdio concluídos; falhas de ambiente preservadas e handoff Ready for Review, sem alegar revisão externa CodeRabbit | @dev Dex |
| 2026-10-09 | 0.3.0 | Quinn QA PASS para ENG-001/F4 delimitado; Ready for Review → Done com proveniência determinística da história substantiva e fonte; limites preservados | @qa Quinn |
| 2026-10-09 | 0.3.1 | Fechamento administrativo/backlog alinhados; Quinn QA Done preservado [closure-key: ENG-001:digest:sha256:9cad7286a71aec4a5d5c2dce10dd0f40ef9c2ba0683d5cbc782caa976a644248] | @po Pax |

## Dev Agent Record

### Agent Model Used

Codex, modelo herdado do coordenador sem override; Dex ativado pela skill do repositório e perfil canônico.

### Debug Log References

Prova focada: `tmp/engineering-foundation/creative-activation-tests.log` (26/26, zero skips). Fonte final: `tmp/engineering-foundation/primary-product-verify-final.log` (182/182, zero falhas/skips). Arquivo real/estúdio: `tmp/engineering-foundation/package-audit.json` e `artifact-Bg6GES/installed-verify.log` (182/182, zero falhas/skips). Falhas preservadas no mesmo diretório: `primary-product-verify.log`, `primary-product-verify-authorized.log`, `rename-focused-reproduction.log` e `artifact-yRGGn3/installed-verify.log`. CodeRabbit: `.development/state/coderabbit-review-blocked.json` (bloqueado antes de executar; sem resultado externo). Revisões privadas independentes: `work/maintenance/engineering-foundation-2026-10-09/aria-final-review.md` e `quinn-verification.md`. Pax mantém a decisão final de lifecycle.

### Completion Notes List

- Implementado leitor estrito compartilhado, preservando compatibilidade de BOM UTF-8. Os dois entrypoints recusam contexto inválido/com links; ativação recusa desenvolvimento antes de escrever e help permanece somente leitura.
- API interna `installSkill` e estúdios sem marcador preservam escolha de host, bytes exatos, preflight de conflitos, arquivos não relacionados e metadados Git. Testes cobrem ambas as skills, todos os hosts, falhas de marcador e inspeção com BOM.
- Help do comando existente e dois parágrafos delimitados no guia de instalação atualizados em inglês/pt-BR, preservando outros arquivos do manual, histórico e registros privados.
- Revisão local de Dex e `git diff --check` aprovadas. O primeiro teste em sandbox padrão falhou em sete preparações de junction com EPERM; a execução com escalada autorizada aprovou os 26 casos. Nenhum teste foi omitido ou enfraquecido.
- Quinn verificou disponibilidade do CLI CodeRabbit, mas a revisão automática de aprovação recusou executá-lo porque poderia exportar o diff local ao serviço externo sem autorização específica. O comando não executou e não houve contorno. Revisão independente de Quinn ainda necessária; isso não é CodeRabbit aprovado.
- Fontes e estúdio derivado do arquivo real aprovaram `npm.cmd run verify` com 182/182 testes, zero falhas/skips. A candidata não publicada contém 182 arquivos reutilizáveis; o estúdio `both` tem 192 arquivos instalados, zero engenharia/dependências, bytes exatos, instruções criativas próprias, Git preservado, merge que reteve tudo e conflito recusado sem escrita.
- SHA-256 da candidata local: `d2334d3978c1e1a601a5303efa6e62c5913fee0a041cb880c09adeb902603a24`. Não é nova release ou substituição da 0.5.0 publicada imutável.
- A primeira execução combinada no sandbox padrão teve 167/182 aprovados, 11 falhas de preparação de junction e quatro skips do ambiente. As primeiras suítes nativas da fonte e do estúdio inicial aprovaram 180/182 com EPERM intermitente no rename canon em core intacto. O rerun focado aprovou 4/4, seguido de 182/182 nas fontes e estúdio finais. Logs falhos preservados, sem enfraquecer testes/reescrever histórico. Causa exata do rename não comprovada: backlog INV001 de Pax / preocupação W001 de Quinn.
- Aria aprovou a fronteira de arquitetura delimitada; Quinn aprovou a fundação local ENG-001/002 em revisão independente. Implementação/DoD aplicável concluída: casos funcionais, inglês/pt-BR, exportação/preservação e verificação significativa. Pax encerra lifecycle/QA Results; Dex não se atribui veredito final. Não se alega dependência nova ou lint/typecheck inexistente.
- CodeRabbit continua bloqueado antes de executar pela revisão automática, sem contorno/resultado externo. Sem provider call, mídia paga, deploy hospedado do manual, publicação remota ou migração histórica. Checks locais não comprovam discovery vivo Codex/Claude ou paridade audiovisual.

### File List

- `.development/stories/brownfield-development-skill-activation.md` e `.pt-BR.md`: lifecycle, tarefas e evidências.
- `scripts/development-context.mjs`: leitura estrita/guard compartilhado.
- `scripts/studio.mjs`, `scripts/install-skill.mjs`: contexto público compartilhado e help.
- `tests/install-skill.test.mjs`, `tests/development-context.test.mjs`: recusa/preservação e regressão BOM.
- `docs/installation.md`, `docs/locales/pt-BR/installation.md`: orientação delimitada de ativação.
- Evidências ignoradas: `tmp/engineering-foundation/creative-activation-tests.log`, `.development/state/coderabbit-review-blocked.json`.
- Prova combinada ignorada: `tmp/engineering-foundation/primary-product-verify{,-authorized,-final}.log`, `rename-focused-reproduction.log`, `package-audit.json`, `artifact-{yRGGn3,Bg6GES}/installed-verify.log` e candidata no diretório do artefato final.
- Revisões privadas: `work/maintenance/engineering-foundation-2026-10-09/aria-final-review.md`, `quinn-verification.md`.

## QA Results

```yaml
story_id: ENG-001
verdict: PASS
reviewer: "Quinn (@qa)"
reviewed_revision: "sha256:9cad7286a71aec4a5d5c2dce10dd0f40ef9c2ba0683d5cbc782caa976a644248"
reviewed_source: "sha256:2fb030db8c59733a08fdb1dc2c15ddac254d01cdec05de414901431294c98fff"
digest_scope: OLYMPOX-QA-STORY-v1
reviewed_at: 2026-10-09
gate: work/maintenance/engineering-foundation-2026-10-09/quinn-story-gate.json
```

Quinn é responsável pela transição QA **Ready for Review → Done**. Pax pode efetuar fechamento administrativo/índices depois de verificar a proveniência; validação PO de planejamento é separada deste veredito.

PASS nos sete critérios delimitados: nove grupos independentes confirmaram recusa pública das duas skills/todos os hosts antes de escrita, BOM/help/fixtures preservados e instalação normal/conflitos/Git intactos em estúdios sem marcador. Fonte e estúdio derivado do arquivo real passaram 182/182, zero falhas/skips. Arquivo/consumidor têm 182/192 arquivos, sem engenharia, dependências ou estado privado, com bytes exatos e preservação.

A revisão determinística vincula todas as seções substantivas, critérios, tarefas, Dev Records e File Lists. Só `Status`, `QA Results`, `Change Log` administrativo e `Closure Metadata` são excluídos, normalizando LF e removendo linhas em branco finais usadas como separadores. Regras/hashes e verificador executável estão no gate privado e `quinn-story-provenance.mjs`; alterações substantivas exigem nova QA.

Limites: a aprovação automática bloqueou CodeRabbit antes da revisão externa, embora o CLI esteja disponível; não existe PASS CodeRabbit. Erros Windows INV-001/W-001 de rename passaram nos retestes focado/completos, mas a causa segue não comprovada. O Windows recusou criar symlink real de arquivo; junctions reais e file-link simulado são provas distintas. F1–F3/F6 continuam pendentes e a avaliação geral de influencer/mídia permanece CONCERNS. Não se comprovaram discovery vivo, mídia/paridade Claude, deploy hospedado do manual ou publicação remota. Prova independente detalhada: `work/maintenance/engineering-foundation-2026-10-09/quinn-verification.md`.

## PO Validation

GO, 9/10, alta confiança para implementação delimitada. Verificadas seções/lifecycle, sete critérios nas duas edições, executor/gate distintos, cobertura por tarefas e referências atuais. A avaliação brownfield aceita fornece requisitos sem inventar épico/PRD. Aria e Orion revisaram a fronteira. Sem problema crítico ou should-fix de planejamento; testes, exportação/preservação e QA independente ainda pendentes. CodeRabbit configurado, mas disponibilidade/resultado não comprovados; registrar resultado real na implementação. Sem UI, execução de provider ou geração paga. Draft → Ready aplicado após validação, com patch da versão de planejamento registrado.

## Closure Metadata

closed_by: "@po Pax"
closed_on: "2026-10-09"
reviewer: "Quinn (@qa)"
reviewed_revision: "sha256:9cad7286a71aec4a5d5c2dce10dd0f40ef9c2ba0683d5cbc782caa976a644248"
reviewed_source: "sha256:2fb030db8c59733a08fdb1dc2c15ddac254d01cdec05de414901431294c98fff"
qa_gate: "work/maintenance/engineering-foundation-2026-10-09/quinn-story-gate.json"
administrative_status: complete

Quinn é responsável pelo PASS e transição Done registrados. Pax acrescentou somente fechamento administrativo com chave; conteúdo substantivo revisado e Status preservados.
