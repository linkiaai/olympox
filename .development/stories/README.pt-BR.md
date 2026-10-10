# Backlog de engenharia

O repositório público canônico contém fontes do produto OLYMPOX. AIOX desenvolve o produto localmente; runtime/projeções/estado da engenharia ficam fora da exportação. Estas histórias derivam da avaliação aceita de 9 de outubro de 2026 e salvaguardas da raiz. Sem segundo repositório ou cópia privada canônica de código.

| Ordem | Story / finding | Estado | Evidência de conclusão |
| --- | --- | --- | --- |
| 1 | [ENG-001 — guard de ativação](brownfield-development-skill-activation.pt-BR.md), F4 | Done — Quinn QA PASS, fechamento administrativo registrado | CLI 26/26; fonte final e estúdio do pacote real 182/182 cada, zero falhas/skips; exportação, preservação e conflitos aprovados |
| 1 | [ENG-002 — contexto AIOX real](brownfield-aiox-required-context.pt-BR.md), F5 | Done — Quinn QA PASS, fechamento administrativo registrado | Engenharia 6/6, contexto real de 12 papéis, bootstrap/repetição oficiais pinados e preservação aprovados; pacote/estúdio excluem engenharia |
| 2 | INV-001 — reprodução de rename atômico no Windows | Backlog; história diagnóstica delimitada, fora de ENG-001/002 | Explicar/reproduzir EPERM histórico intermitente em run/canon mantendo evidência de falhas/sucessos; preservar atomicidade, histórico e testes completos |
| 2 | [ENG-003 — transferência de referências exatas](brownfield-exact-reference-transfer.pt-BR.md), F1 | Done — Quinn QA PASS; fechamento administrativo registrado | Transferência local de imagens/recibos/incerteza; 17 grupos independentes, fonte/instalado 216/216 sem skips; outros meios/provider pendentes |
| 2 | [ENG-004 — aplicabilidade vocal antes de canon](brownfield-vocal-applicability.pt-BR.md), F2 | Done — Quinn QA PASS; fechamento administrativo registrado | Gate vocal aditivo/seleção exata/silent; 8 grupos independentes, fonte/instalado 216/216 sem skips; bytes/contratos históricos preservados |
| 2 | [ENG-005 — prontidão por etapa](brownfield-stage-readiness.pt-BR.md), F3 | Done — Quinn QA PASS; fechamento administrativo registrado | Gates de etapa/input/contexto e start/complete exatos; 22 grupos independentes, fonte/instalado 244/244 sem falhas/skips; históricos preservados, aceitação real pendente |
| 3 | F6 — aceitação por iniciante e mídia | Backlog; autorização específica de produção/orçamento | Jornadas novas independentes Codex/Claude, intervenções/tentativas/custos observados, referências/recibos exatos, piloto completo exportado/inspecionado; alegações limitadas à rota exercitada |
| 4 | Publicação futura | Aguarda autorização aplicável | Gage revisa diff/exportação, novo artefato congelado e instalação independente; 0.5.0 imutável, propriedade do manual respeitada |

ENG-001/002 estão concluídas para a fundação delimitada F4/F5. Quinn aplicou Done após PASS independente; Pax finalizou os registros administrativos sem alterar o veredito/lifecycle. Passar essas histórias não fecha F1/F2/F3/F6, comprova módulos ou um piloto falando. Não ampliar silenciosamente este incremento para produção paga.

ENG-003/F1 e ENG-004/F2 estão Done por Quinn após PASS local independente. Pax registra apenas fechamento administrativo, sem alterar lifecycle/conteúdo revisado. Transferência delimitada a imagens; áudio/vídeo, bytes originais no provider, acesso plugin/módulo e discovery vivo continuam não certificados. F3/F6/INV-001/W-001 seguem backlog; jornada ampla CONCERNS. Sem upload/login/geração paga/publicação real ou paridade de mídia Codex/Claude comprovados. Closure Metadata original abaixo registra historicamente só a fundação F4/F5.

Evidência histórica da fundação: `tmp/engineering-foundation/primary-product-verify-final.log` registra `npm.cmd run verify` nativo final na fonte (182/182, zero falhas/skips). `gage-clean-bootstrap-evidence.json` registra snapshot local revisado, instalação oficial pinada, repair/configure/verify e repetição preservando 211 hashes de fontes e 58 de runtime/projeção/proveniência, seis checks de contexto e árvore de consumidor com 192 arquivos sem engenharia. Revisão local de arquitetura de Aria passou. O pacote real final tem 182 arquivos e seu estúdio both 192; verificação instalada completa 182/182, zero falhas/skips. Bytes exatos, Git preservado, merge retido e conflito sem escrita aprovados. SHA-256 da candidata: `d2334d3978c1e1a601a5303efa6e62c5913fee0a041cb880c09adeb902603a24`. Quinn confirmou PASS delimitado e vinculou quatro revisões de histórias e fontes no gate privado. É candidata local não publicada; aceitação ampla do fluxo de influencer/mídia continua CONCERNS.

Disponibilidade do CLI CodeRabbit foi verificada separadamente (0.7.2 via WSL), mas revisão automática de aprovação rejeitou o comando de revisão externa do diff antes da execução: autorização de desenvolvimento não cobria enviar o diff para esse serviço. Revisão local independente é a alternativa; sem aprovação CodeRabbit ou alegação de publicação remota. Preservar `.development/state/coderabbit-review-blocked.json` e todos os logs reais.

INV-001 investiga EPERM Windows já observado ao renomear atomicamente diretório de canon em staging ou arquivo temporário de run. A causa permanece não comprovada; falhas não estabelecem novo defeito F4/F5, corrupção, scanner ou causa de permissão. Delimitar futura história a reprodução sintética controlada, contexto exato de OS/Node/sandbox/path/concorrência e comparação das operações atômicas. Manter logs de falha/sucesso da avaliação anterior e `tmp/engineering-foundation/`, incluindo `primary-product-verify-authorized.log`; informar taxas reais e distinguir falha de permissão ao criar links de falha de rename atômico. Não reescrever bytes privados/históricos, enfraquecer atomicidade/invariantes, pular/relaxar testes ou ocultar erro por retry sem explicação. Eventual implementação exige diagnóstico verificado e critérios/revisão próprios.

Manter checkboxes e File Lists reais; Ready → InProgress → Review → Done exige implementação/revisão registrada. Ready é plano validado, não teste aprovado. Produto: `npm.cmd run verify`; AIOX local: `node .development/verify-aiox.mjs`. Sem lint/typecheck na raiz. Git remoto/release: Gage, sob autorização aplicável.

Avaliação privada em `work/maintenance/aiox-project-review-2026-10-09/`, fora da exportação. Orion seleciona objetivo de manutenção para decisões/arquivos/checks/limites. [Inglês canônico](README.md); tokens preservados nesta edição secundária.

## Closure Metadata

Data: 2026-10-09. Responsável administrativo: Pax (`@po`). QA/lifecycle: Quinn (`@qa`). Gate privado verificado: `work/maintenance/engineering-foundation-2026-10-09/quinn-story-gate.json`; algoritmo: `OLYMPOX-QA-STORY-v1`. F1/F2/F3/F6 e INV-001 (alias Quinn W-001) continuam pendentes; fechamento não autoriza operação remota.

<!-- [closure-key: ENG-001:digest:sha256:9cad7286a71aec4a5d5c2dce10dd0f40ef9c2ba0683d5cbc782caa976a644248] -->

<!-- [closure-key: ENG-002:digest:sha256:5d258b130681465f4eb67b444cdeea137556bff7a3a31a8689414531e91b6762] -->


## Media-flow closure metadata

Data 2026-10-09; administração Pax (@po), QA/lifecycle Quinn (@qa). Gate privado `work/maintenance/media-flow-increment-2026-10-09/quinn-story-gate.json`; fonte revisada `sha256:6708477ccfea86c5d00d93f1a33a562740b13712714fe9aa8f2b93972fc5ebbc`. Fonte/estúdio real extraído e instalado 216/216 cada, zero falhas/skips; 25 grupos independentes. Pacote 189 arquivos/estúdio both-host 199, zero engenharia/dependências. SHA-256 `00423d1b944c6bb2db14e46e6c74f2e1003196005139af00181c56f74fe69e4a`. Exportação/Git/merge/conflito/preservação e Aria passaram; sete checks AIOX/12 projeções são evidência local. Candidata local não publicada. CodeRabbit externo recusado automaticamente antes de executar, sem retry/PASS. Limites de lock/recuperação/links permanecem no gate; F3/F6/jornada CONCERNS e diagnóstico Windows pendentes. Próximo planejamento F3; F6 exige produção/orçamento autorizados. Ambos os índices usam chaves canônicas inglesas.

<!-- [closure-key: ENG-003:digest:sha256:d7c4dbf1a8cf71795e9b570eedc7c70fbd068f571039e6d663a7f78bb93c68e8] -->

<!-- [closure-key: ENG-004:digest:sha256:a568db70238ff6f6440a6e705b2bc23b359a38d845fe1d799de55a5b7f000ce9] -->


## Stage-readiness closure metadata

Data 2026-10-09; administração Pax (@po), QA/lifecycle Quinn (@qa). ENG-005/F3 está Done para a política local delimitada de prontidão por etapa. Gate privado `work/maintenance/stage-readiness-2026-10-09/quinn-story-gate.json`; fonte revisada `sha256:b75303e521845908653f29461b67160c9a3454c844bdfde2f7080936efcc7fd2`. Fonte e estúdio real extraído para ambos os assistentes passaram 244/244 cada sem falhas/skips; 22 grupos independentes e revisão delimitada de Aria passaram. Pacote 197 arquivos/estúdio 207, zero engenharia/dependências; SHA-256 do arquivo `e382709ffad7b0cbe1cbe61e1780045ce168f912bb76785322015d204c36694a`. Exportação exata, preservação Git, merge retido e conflito sem escrita passaram; sete checks de engenharia/12 projeções passaram. As oito edições anteriores de histórias fechadas continuam byte-exact. Este registro atualiza a pendência histórica F3 acima sem reescrevê-la.

PASS estabelece consistência local das declarações. F6 com iniciante/mídia real e diagnóstico Windows INV-001/W-001 seguem separados; acesso/aceitação do provider, mídia gerada, escuta/qualidade/lip-sync, discovery de skills e paridade Codex/Claude não são certificados. A candidata continua local e não publicada. A recusa automática anterior do diff externo CodeRabbit está preservada; sem repetição, exportação ou PASS externo. Ambos os índices usam a chave canônica inglesa; somente QA possui Done.

<!-- [closure-key: ENG-005:digest:sha256:d98d3fbc558f81d706cd08cd199974f68cbede2fe0623733e100b581c3abacbe] -->
