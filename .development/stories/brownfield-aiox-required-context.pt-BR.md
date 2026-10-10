# Story ENG-002: Resolver e verificar o contexto real de engenharia AIOX

Edição secundária de [brownfield-aiox-required-context.md](brownfield-aiox-required-context.md). Fonte: finding F5 comprovado em 9 de outubro de 2026. Ferramenta local de engenharia pinada, excluída do produto instalado.

## Status

**Done**

## Executor Assignment

executor: "@dev"
quality_gate: "@architect"
quality_gate_tools: ["actual AIOX role-context loads", "negative context fixtures", "node .development/verify-aiox.mjs", "isolated pinned bootstrap", "export inspection"]

Quinn (`@qa`) dá o veredito independente. Gage (`@devops`) executa bootstrap/reinstalação isolada sob coordenação de Orion e eventual release remota autorizada.

## Story

**Como** desenvolvedor usando AIOX para construir OLYMPOX,
**quero** que os papéis carreguem os guias de engenharia configurados e que a verificação falhe quando faltar contexto obrigatório,
**para que** carregar um perfil com sucesso não esconda instruções de desenvolvimento ausentes.

## Origem e escopo

F5 é comprovado: os comandos PM/Dev carregaram, mas documentos obrigatórios `docs/framework/*` retornaram `null`/ENOENT. Configure já aponta para `.development/`; o loader pinado lê requisitos literais. O usuário aceitou melhorar a engenharia no repositório único canônico.

Escopo: adaptação local pequena e reproduzível para `@aiox-squads/core@5.4.1`, verificação de contexto real e prova de reconstrução isolada. Não incluir AIOX em dependências de consumidor, alterar mídia, duplicar guias em docs exportadas, inventar controle hospedado ou mudar roteamento de modelos. Não se esperam mudanças em produto/manual além dos guias de engenharia revisados.

## Acceptance Criteria

1. O caminho real de carregamento resolve guias configurados em vez de `docs/framework/*`: Dev recebe `devLoadAlwaysFiles`; demais papéis recebem guias pertinentes em `frameworkDocsLocation`. Matriz explícita: Dev 3, PM 2, SM 1, Analyst 2, UX 2. Os conteúdos carregados devem ser não vazios e iguais aos bytes dos guias atuais. Preservar requisitos upstream alheios a guias e lazy loading intencional.
2. Adaptação reproduzível a partir da versão upstream pinada revisada, idempotente quando aplicada e que recusa input desconhecido/conflitante antes de escrita. Registrar versão/hash originais e hash/diff da adaptação ou proveniência equivalente em estado local ignorado. Preservar licença, perfis canônicos e proveniência upstream; usar menor adaptação revisada, sem troca silenciosa de runtime ou segunda fonte canônica.
3. `node .development/verify-aiox.mjs` chama loader/complete-role real instalado, com leituras novas, e verifica conteúdo obrigatório. Cobrir requisitos non-lazy dos papéis instalados e matriz de guias explícita. Requisito removido, ausente, ilegível, vazio ou `null` causa erro identificando papel/path. Conteúdo lazy/opcional segue condições reais; não inventar obrigatoriedade.
4. Checks negativos sintéticos comprovam falha por guia removido/vazio e respeito a paths alternativos configurados e contidos. Reaplicar configuração/repair e provar bytes estáveis e contexto correto. Não alterar guias primários ou histórico para provocar falhas; sucesso em cache não é evidência.
5. Preservar AIOX 5.4.1, somente Codex, MCP/autoClaude AIOX desativados, dependências internas, 12 projeções AIOX e checks reais de CLI existentes. `package.json` do produto sem dependências/comandos AIOX. Pacote público/árvore instalada sem `.development/`, `.aiox-core/`, projeções/estado de engenharia ou dependências de tooling.
6. Atualizar `.development/README.md` e tradução com procedimento exato, versão/proveniência e limites upstream restantes. Preservar manifest/instruções da raiz e trabalho concorrente do manual. Checks locais não provam discovery vivo, mídia real, paridade Claude ou publicação remota.
7. Executar receita completa uma vez em novo destino independente com bytes atuais revisados de produto/guias. Rodar instalador oficial pinado em staging separado seguro, reconciliar apenas runtime revisado na raiz de teste e executar repair/configure/verificação real. Comparar manifest/instruções antes/depois, verificar contexto, exclusões e preservação, registrar hashes/resultados. Somente verificar instalação primária existente não fecha este critério.

## CodeRabbit Integration

A configuração declara `coderabbit_integration.enabled: true`. Disponibilidade é verificada em execução; a história não desativa nem registra aprovação inexistente.

### Story Type Analysis

Tipo principal: integração da engenharia. Secundário: reprodução/proveniência local. Complexidade delimitada, com risco de compatibilidade upstream.

### Specialized Agent Assignment

Dex implementa adaptação/checks; Aria revisa resolução/proveniência; Quinn dá QA independente; Gage executa bootstrap isolado com Orion.

### Quality Gate Tasks

- [x] Preparação antes do commit: revisão delimitada, contexto real, negativos isolados, bootstrap/repetição limpos e exportação exata concluídos. Revisão automática recusou CodeRabbit antes de executar; limite externo registrado e revisões independentes Aria/Quinn mantidas.
- N/A — Antes de PR: sem PR/release remota autorizados aqui; evidências de Gage preservadas para futura operação autorizada.

### Self-Healing Configuration

Política light de Dex quando executável: até duas iterações/15 minutos para problemas críticos. Bytes upstream desconhecidos interrompem adaptação, sem sobrescritas repetidas. Sem novos dispatch/roteamento de modelos ou mídia paga.

### Focus Areas

Consumidor real de ativação, paths configurados, requisitos lazy/obrigatórios, cache, proveniência/recusa de conflito, instalação limpa reproduzível e exclusão de exportação.

## Tasks / Subtasks

- [x] Confirmar requisitos literais e consumidor real `AgentConfigLoader`/complete-role; identificar papéis com requisitos de guias (AC 1, 3).
- [x] Implementar adaptação mínima revisada por Aria, com input conhecido, idempotência, recusa de conflito e proveniência (AC 1, 2).
- [x] Estender verificação com carregamento real novo e conteúdo obrigatório; negativos ausente/vazio/path alternativo (AC 3, 4).
- [x] Manter checks de versão/projeção/CLI/dependências e revisar exportação/instalação (AC 5).
- [x] Atualizar receita inglês/pt-BR e limites corretos (AC 6).
- [x] Coordenar prova de Gage da receita pinada isolada e preservação da raiz (AC 7).
- [x] Registrar arquivos, hashes, resultados, preocupações e handoff da revisão de Quinn (AC 2–7).

## Dev Notes

Paths atuais: `.development/coding-standards.md`, `.development/tech-stack.md`, `.development/source-tree.md` em `devLoadAlwaysFiles`; `.development` em `frameworkDocsLocation`. Requisitos literais upstream afetam Dev/PM/SM/Analyst/UX. O loader usa `getFilesToLoad()` e `loadFile()` e aceita retorno de erro com conteúdo null sem falhar o perfil. Gage reproduziu usando complete-role e cache novo.

Tooling atual: configure/repair/verify e `aiox-cli.cjs` em `.development/`; runtime interno ignorado. Repair já usa proveniência oficial e evita dependências de produto. Configure gera 12 projeções Codex/repository skills. Aria aprovou remapeamento estreito dos paths exatos `docs/framework/{coding-standards,tech-stack,source-tree}.md` em requisitos/metadados compartilhados/cache a partir de bytes oficiais pinados. Manter loader e perfis canônicos intactos. Ativação e verificação devem consumir o runtime real resultante, sem substituição apenas de teste.

Fontes: `AGENTS.md`, README/guias de engenharia, tooling existente, requisitos/loader pinados, avaliação privada F5 e reprodução Gage em `work/maintenance/aiox-project-review-2026-10-09/`. Não precisa de biblioteca/provider API nova. História brownfield independente usa avaliação aceita, sem inventar PRD/épico ausente.

### Testing

Node built-in e fixtures sintéticas contidas; YAML interno existente AIOX somente no tooling. Verificar paths/conteúdo reais e leitura nova. Hashes antes/depois preservam guias/raiz. Executar `node .development/verify-aiox.mjs`; Orion executa `npm.cmd run verify` do produto no gate combinado. Não há lint/typecheck na raiz. Bootstrap não prova discovery vivo ou qualidade audiovisual.

### Riscos e rollback

Patch amplo cria drift: proveniência exata, recusa de bytes desconhecidos e pin 5.4.1. Verificar wrapper sem alterar ativação daria confiança falsa: AC 1/3 exigem consumidor real. Expansão incondicional pode quebrar lazy loading: preservar semântica. Reverter apenas adaptação/config/checks revisados, restaurar bytes upstream conhecidos e verificar novamente. Não resetar produto/manual/histórico nem substituir versões silenciosamente.

## Change Log

| Date | Version | Description | Author |
| --- | --- | --- | --- |
| 2026-10-09 | 0.1.0 | História F5 redigida incluindo prova pinada independente | @po Pax |
| 2026-10-09 | 0.1.1 | Validada GO (9/10) — Status: Draft → Ready; remapeamento pinado/matriz explícita aprovados por Aria | @po Pax |
| 2026-10-09 | 0.2.0 | Adaptação pinada somente dos dados e verificação de papéis reais implementadas; seis checks isolados aprovados, bootstrap/gates combinados pendentes | @dev Dex |
| 2026-10-09 | 0.2.1 | Bootstrap/repetição independentes e gates finais de pacote/estúdio concluídos; falhas de ambiente preservadas e handoff Ready for Review | @dev Dex |
| 2026-10-09 | 0.3.0 | Quinn QA PASS para ENG-002/F5 delimitado; Ready for Review → Done com proveniência determinística da história substantiva e fonte; limites preservados | @qa Quinn |
| 2026-10-09 | 0.3.1 | Fechamento administrativo/backlog alinhados; Quinn QA Done preservado [closure-key: ENG-002:digest:sha256:5d258b130681465f4eb67b444cdeea137556bff7a3a31a8689414531e91b6762] | @po Pax |

## Dev Agent Record

### Agent Model Used

Codex, modelo herdado do coordenador sem override; Dex ativado pela skill do repositório e perfil canônico.

### Debug Log References

`tmp/engineering-foundation/aiox-context-tests.log`: seis testes isolados aprovados, zero skips; `aiox-context-verification.json` e `aiox-final-verification.log` no mesmo diretório: 12 contextos reais novos e sete gates existentes. `.development/state/aiox-context-adaptation.json`: proveniência; `.development/state/coderabbit-review-blocked.json`: revisão externa bloqueada antes de executar. Bootstrap limpo: `tmp/engineering-foundation/gage-clean-bootstrap-evidence.json` e privado `work/maintenance/aiox-project-review-2026-10-09/gage-eng-002-bootstrap.md`. Gates finais/falhas preservadas: `primary-product-verify{,-authorized,-final}.log`, `rename-focused-reproduction.log`, `package-audit.json`, `artifact-{yRGGn3,Bg6GES}/installed-verify.log` no mesmo diretório. Revisões privadas: `work/maintenance/engineering-foundation-2026-10-09/aria-final-review.md`, `quinn-verification.md`.

### Completion Notes List

- Implementada adaptação somente dos dados de requisitos; loader e 12 perfis upstream são comparados com o arquivo oficial de integridade verificada antes de adaptar/verificar.
- Dev recebe seus três guias configurados; PM/SM/Analyst/UX recebem a localização de documentação de engenharia configurada. Paths compartilhados/cache remapeados; demais requisitos e comportamento lazy permanecem intactos.
- Configuração pré-verifica caminhos contidos, guias não vazios, fontes oficiais e bytes conhecidos/anteriores da adaptação antes de escrever config/projeções. Conflitos desconhecidos de fonte/mapeamento/base e links são recusados; idempotência preserva bytes da adaptação/proveniência.
- Processo novo usa o `AgentConfigLoader.loadComplete` real, confere identidade, matriz fixa de guias, todo requisito não lazy aplicável, conteúdo sem cache e bytes exatos. Guias/contexto upstream ausentes ou vazios falham com papel/caminho. Alterar requisitos não elimina seu próprio gate.
- `node .development/verify-aiox.mjs` aprovou sete checks reais: 12 contextos, versão 5.4.1, projeções/IDE estritos e help real. Hash padrão adaptado: `381d85cc0504414bdf3edf709d7b6bc4910d769b461de796ef81ddafcc7d01dc`.
- Testes isolados 6/6 aprovados. A primeira execução tinha uma assertion incorreta sobre o primeiro papel a consumir technical preferences ausente; corrigida para Architect. O loader recusou corretamente o contexto ausente em ambas.
- Receita/limites do README de engenharia atualizados em inglês/pt-BR. Sem mudanças em dependências/scripts de produto, loader/perfis upstream, roteamento de modelos ou histórico criativo.
- Revisão automática recusou CodeRabbit antes de executar por faltar autorização específica para exportar o diff local ao serviço externo; sem contorno/resultado. Aria aprovou arquitetura delimitada e Quinn aprovou a fundação local ENG-001/002 em revisão independente. Pax encerra lifecycle/QA Results; Dex não se atribui veredito final.
- Gage executou o instalador oficial fixado em staging novo seguro, reconciliou somente runtime novo numa candidata completa de fontes locais revisadas e executou repair/configure/verify com repetição completa. Os 211 arquivos selecionados de fonte e 58 de runtime/projeções/proveniência ficaram estáveis. Probe real: 12 papéis, 21 requisitos non-lazy aplicáveis; seis testes focados aprovados na raiz limpa, zero skips. Manifesto/instruções da raiz e exclusões preservados. AC7 tem prova independente.
- A tentativa anterior de harness incompleto que omitiu o `package.json` implícito do npm foi preservada e falhou corretamente na verificação. O harness foi corrigido numa candidata nova completa; só a receita primeira/repetida dela conta como bootstrap aprovado. É reconstrução exata local selecionada, não clone remoto limpo ou pacote público.
- Fontes e estúdio derivado do arquivo real aprovaram `npm.cmd run verify` com 182/182, zero falhas/skips. Arquivo: 182 arquivos; estúdio `both`: 192, zero engenharia/dependências, bytes exatos, Git preservado, merge retido e conflito sem escrita. SHA-256 da candidata: `d2334d3978c1e1a601a5303efa6e62c5913fee0a041cb880c09adeb902603a24`.
- Falhas de preparação de junction no sandbox padrão preservadas. As primeiras suítes nativas da fonte/estúdio inicial aprovaram 180/182 com EPERM intermitente no rename canon em core intacto; rerun focado 4/4 e fontes/estúdio finais 182/182. Sem enfraquecer/reescrever testes/histórico; causa exata do rename não comprovada, backlog INV001 de Pax / preocupação W001 de Quinn.
- Implementação/DoD aplicável concluída: contexto exato novo, negativos, idempotência, preservação/proveniência, receita bilíngue e exclusão real do consumidor. Sem alegar dependência nova, roteamento, execução de fornecedor, qualidade/paridade Claude, deploy do manual hospedado ou publicação. A 0.5.0 publicada permanece intacta.

### File List

- `.development/stories/brownfield-aiox-required-context.md` e `.pt-BR.md`: lifecycle, tarefas e evidências.
- `.development/aiox-context-core.mjs`: adaptação/proveniência e assertions de contexto real.
- `.development/verify-aiox-context.mjs`: probe de processo novo com contexto completo.
- `.development/aiox-context.test.mjs`: cenários positivos/negativos com loader real.
- `.development/configure-aiox.mjs`, `.development/verify-aiox.mjs`: configuração/adaptação e integração do probe.
- `.development/README.md`, `.development/README.pt-BR.md`: receita, caminhos, proveniência e limites.
- Runtime ignorado adaptado: `.aiox-core/data/agent-config-requirements.yaml`; projeções geradas preservam bytes canônicos.
- Evidência ignorada: `.development/state/aiox-context-adaptation.json`, `.development/state/tooling-source/agent-config-requirements-5.4.1.yaml`, `.development/state/coderabbit-review-blocked.json`, `tmp/engineering-foundation/aiox-context-{tests.log,verification.json,verification.err}`.
- Prova adicional ignorada: `tmp/engineering-foundation/gage-clean-bootstrap-evidence.json`, `gage-complete-{actual-contexts,first-pass,idempotence}.json`, `gage-complete-{repair,configure,verify}-{1,2}.log`, `gage-complete-context-tests.log`, `gage-consumer-export-proof.json`; privado `work/maintenance/aiox-project-review-2026-10-09/gage-eng-002-bootstrap.md`.
- Prova combinada ignorada: `tmp/engineering-foundation/primary-product-verify{,-authorized,-final}.log`, `rename-focused-reproduction.log`, `package-audit.json`, `artifact-{yRGGn3,Bg6GES}/installed-verify.log` e candidata no diretório final.
- Revisões privadas: `work/maintenance/engineering-foundation-2026-10-09/aria-final-review.md`, `quinn-verification.md`.

## QA Results

```yaml
story_id: ENG-002
verdict: PASS
reviewer: "Quinn (@qa)"
reviewed_revision: "sha256:5d258b130681465f4eb67b444cdeea137556bff7a3a31a8689414531e91b6762"
reviewed_source: "sha256:2fb030db8c59733a08fdb1dc2c15ddac254d01cdec05de414901431294c98fff"
digest_scope: OLYMPOX-QA-STORY-v1
reviewed_at: 2026-10-09
gate: work/maintenance/engineering-foundation-2026-10-09/quinn-story-gate.json
```

Quinn é responsável pela transição QA **Ready for Review → Done**. Pax pode efetuar fechamento administrativo/índices depois de verificar a proveniência; validação PO de planejamento é separada deste veredito.

PASS nos sete critérios delimitados: nove grupos independentes com loader real verificaram matriz própria de QA nos 12 papéis, conteúdo exato/não vazio/novo, loader/perfis upstream intactos, recusa de contexto ausente/vazio/ilegível/null/removido e fonte desconhecida, caminhos alternativos contidos e proveniência repetível. Gage executou staging oficial fixado/reconciliação só do runtime e bootstrap completo repetido, com 211 fontes preservadas, 58 arquivos estáveis de runtime/projeções/proveniência e 21 requisitos non-lazy. Fonte e estúdio derivado do arquivo real passaram 182/182, zero falhas/skips; exportações reais de 182/192 arquivos não incluem tooling/dependências/estado privado.

A revisão determinística vincula todas as seções substantivas, critérios, tarefas, Dev Records e File Lists. Só `Status`, `QA Results`, `Change Log` administrativo e `Closure Metadata` são excluídos, normalizando LF e removendo linhas em branco finais usadas como separadores. Regras/hashes e verificador executável estão no gate privado e `quinn-story-provenance.mjs`; alterações substantivas exigem nova QA.

Limites: a aprovação automática bloqueou CodeRabbit antes da revisão externa, embora o CLI esteja disponível; não existe PASS CodeRabbit. Erros Windows INV-001/W-001 de rename passaram nos retestes focado/completos, mas a causa segue não comprovada. O Windows recusou criar symlink real de arquivo; junctions reais e file-link simulado são provas distintas. F1–F3/F6 continuam pendentes e a avaliação geral de influencer/mídia permanece CONCERNS. Checks Windows/Node 24 não comprovam Node 22/outros sistemas, discovery vivo, mídia/paridade Claude, deploy hospedado do manual ou publicação remota. Prova independente detalhada: `work/maintenance/engineering-foundation-2026-10-09/quinn-verification.md`.

## PO Validation

GO, 9/10, alta confiança para correção delimitada. Verificadas seções/lifecycle, sete critérios nas duas edições, executor/gate distintos, fontes atuais e cobertura por tarefas. Avaliação brownfield aceita substitui épico/PRD ausente, sem inventar requisitos. Aria aprovou remapeamento de metadados, loader/perfis intactos e matriz; Orion confirmou escopo e bootstrap independente. Sem problema crítico ou should-fix de planejamento. Implementação, carga/negativos reais, reinstalação limpa e veredito Quinn pendentes. Disponibilidade/resultado CodeRabbit são fatos da implementação. Checks locais não provam discovery, provider ou paridade audiovisual. Draft → Ready aplicado após validação e registrado como patch de planejamento.

## Closure Metadata

closed_by: "@po Pax"
closed_on: "2026-10-09"
reviewer: "Quinn (@qa)"
reviewed_revision: "sha256:5d258b130681465f4eb67b444cdeea137556bff7a3a31a8689414531e91b6762"
reviewed_source: "sha256:2fb030db8c59733a08fdb1dc2c15ddac254d01cdec05de414901431294c98fff"
qa_gate: "work/maintenance/engineering-foundation-2026-10-09/quinn-story-gate.json"
administrative_status: complete

Quinn é responsável pelo PASS e transição Done registrados. Pax acrescentou somente fechamento administrativo com chave; conteúdo substantivo revisado e Status preservados.
