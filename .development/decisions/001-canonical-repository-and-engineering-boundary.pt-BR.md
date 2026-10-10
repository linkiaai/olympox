# ADR 001 — Um repositório canônico e um produto instalado separado

Data: 9 de outubro de 2026 (America/Sao_Paulo). Responsável: Aria, AIOX Architect; coordenação: Orion.

Status: **Decisão de repositório aceita**, conforme escolha explícita do usuário. O desenho limitado das correções F4/F5 abaixo é um encaminhamento para implementação; este documento sozinho não demonstra correção implementada ou verificada.

O inglês é canônico. [Fonte inglesa](001-canonical-repository-and-engineering-boundary.md).

## Contexto e decisão

Manter um único repositório público canônico das fontes do OLYMPOX. Usar AIOX para desenvolver esse produto no checkout de desenvolvimento. Instalar OLYMPOX em estúdios independentes para Codex, Claude Code ou ambos. Esta decisão não cria outra cópia do produto editada independentemente nem move este projeto Codex.

As fontes Git, o pacote selecionado da release e um estúdio instalado são artefatos distintos. As fontes públicas incluem código, testes, documentação, licenças e guias/decisões reutilizáveis de engenharia sem conteúdo privado. A instalação para consumidores seleciona apenas o produto reutilizável e fornece instruções do estúdio e projeções de skills do assistente escolhido. Ela não instala AIOX, autentica fornecedores, gera mídia ou publica.

O runtime local do AIOX, suas dependências, projeções geradas e estado privado ficam fora do Git e do produto instalado. `.development/` não é inteiramente privado: guias, scripts de ferramentas, decisões e stories de engenharia revisadas e sem informações privadas podem ser versionados; estado, logs, evidências privadas e credenciais não podem. Manter avaliações/runs/backups privados nos locais ignorados existentes. Revisar os arquivos exatos antes de colocá-los no staging, sem tratar um diretório inteiro como seguro.

O `AGENTS.md` da raiz governa a engenharia. `templates/studio-AGENTS.md` e `templates/studio-CLAUDE.md` governam os estúdios de destino. `.development/project.json`, com `schemaVersion: 1` e `kind: framework-development`, seleciona o contexto de desenvolvimento. As skills criativas canônicas em `skills/` são fontes do produto aqui; suas projeções ativas pertencem aos estúdios independentes. Ativar um papel AIOX é selecionar instruções para o assistente; só existe delegação real quando um worker executa trabalho.

## Limites de artefatos e estado

| Artefato | Conteúdo canônico e limite |
| --- | --- |
| Fontes Git públicas | Fontes/testes/docs do produto e arquivos reutilizáveis revisados de engenharia; um histórico para correções, revisão e proveniência das releases |
| Pacote npm/release | Seleção explícita de `package.json`; sem instruções de engenharia da raiz, `.development/`, runtime/dependências/projeções AIOX ou estado privado |
| Estúdio instalado | Inventário explícito do instalador, instruções criativas e projeções das skills canônicas escolhidas; sem marker de desenvolvimento ou requisito AIOX |
| Ferramentas locais de engenharia | `.aiox-core/`, `.codex/`, `.agents/skills/aiox-*` ignorados, com proveniência fixa e configuração/correção reproduzível |
| Trabalho privado | `work/`, `tmp/`, `backups/`, `.development/state/`, `.development/logs/` ignorados existentes, ferramentas/credenciais de fornecedores e registros de produção pessoal |

Contratos atuais: `package.json` declara Node 22+ e nenhuma dependência/devDependency; `files` seleciona caminhos do produto. `scripts/install-framework.mjs` controla o inventário separado de instalação e fornece templates do estúdio/Git em vez de copiar instruções/configuração locais de engenharia. `scripts/assistant-targets.mjs` projeta os mesmos bytes de skills canônicas nos diretórios dos assistentes selecionados. `.gitignore` ajuda na preservação local; não prova os limites de exportação. Verificar a seleção do pacote e a árvore realmente instalada.

## Alternativas e consequências

- Outro repositório público ou privado de desenvolvimento contendo uma segunda árvore editável de código OLYMPOX foi rejeitado por enquanto: cria divergência de fontes, correções duplicadas e dificulta associar testes, decisões de PR e commits de release.
- Um repositório privado canônico de desenvolvimento, promovido automaticamente a um repositório público de distribuição, continua possível se o usuário futuramente precisar de engenharia privada. Exigiria uma fonte da verdade, ligação exata entre commit/artefato, preservação de licenças/histórico e promoção testada. Escolher AIOX não estabelece essa necessidade.
- Checkouts/worktrees locais separados continuam úteis para isolamento e trabalho concorrente; podem compartilhar o mesmo histórico Git canônico. Não exigem outro repositório remoto.

O repositório único mantém código, testes, manuais e histórico de revisão juntos. Ele expõe intencionalmente instruções reutilizáveis de engenharia e exclui estado de execução. Um clone limpo das fontes é um checkout de desenvolvimento, não um estúdio pessoal instalado. O comando público de setup produz o estúdio. Alterar visibilidade do repositório, remotes Git, local do projeto, tags ou bytes publicados da 0.5.0 não decorre automaticamente desta decisão.

Numa release posterior autorizada, Gage deve revisar o diff exato e o inventário do pacote, vincular o artefato ao commit congelado e exercitar instalação/preservação independentes. Preservar bytes imutáveis de releases publicadas. Um commit local, versão de pacote ou teste aprovado não implica nova release publicada nem deploy do manual hospedado. Coordenar mudanças do manual com sua conversa responsável.

## Desenho de F4 — impedir ativação pública de skill criativa no desenvolvimento

Gatilho confirmado: `scripts/install-skill.mjs:14` chama `installSkill` sem verificar o contexto de desenvolvimento, enquanto `scripts/studio.mjs:18-30` lê o marker e `:74-78` recusa operações criativas. A avaliação reproduziu criação bem-sucedida de uma projeção criativa em checkout sintético marcado. É uma lacuna de proteção contra uso acidental, não uma fronteira de segurança contra alguém capaz de editar as fontes locais.

Usar um único leitor pequeno de contexto, sem dependências, compartilhado pelas CLIs públicas do estúdio e de ativação de skill. Extrair a semântica existente do marker, sem criar outra heurística de ambiente ou verificar a instalação do AIOX. Antes de chamar `installSkill`, a CLI de ativação deve recusar um contexto válido de desenvolvimento com mensagem acionável em inglês direcionando para um estúdio independente instalado. Preservar nomes registrados de skills, opções de assistente, instalação normal do estúdio e preflight existente de fontes/destinos.

Manter a API programática `installSkill` disponível para fixtures sintéticas controladas e operações de instalação. Não acrescentar flag de bypass na CLI pública nem apagar projeções existentes ao recusar a ativação. A API do núcleo não é sandbox; as instruções do repositório continuam limitando seu uso real.

Casos obrigatórios para a correção limitada:

1. Checkout de desenvolvimento marcado: skill padrão/cada skill registrada e `codex`, `claude`, `both` recusam antes de criar diretórios ou alterar bytes, inclusive arquivos existentes não relacionados.
2. Marker ausente, inclusive uma pasta `.development/` com notas não relacionadas: ativação normal de estúdio mantém o comportamento atual. O local do script determina a raiz; outro diretório de trabalho do shell não pode contornar o marker.
3. JSON inválido, schema/kind não suportado, marker de tipo incorreto e marker/diretório vinculados: recusar com a mesma semântica da entrada do estúdio. Preservar ajuda somente leitura de forma consistente; ajuda não deve ativar skills.
4. Conflitos existentes, instalação idêntica e testes de junction/caminho continuam protegendo estúdios não marcados. Os inventários de scripts das fixtures devem incluir o leitor compartilhado se ele for extraído.

Usar `tests/install-skill.test.mjs` e `tests/development-context.test.mjs` para casos relevantes de recusa/preservação; fixtures existentes do instalador continuam sendo estúdios independentes. Não modificar registros pessoais nem enfraquecer correspondência de skills canônicas para aprovar testes.

## Desenho de F5 — carregar contexto real de engenharia AIOX de forma reproduzível

Causa confirmada: `.development/configure-aiox.mjs:22` configura os três guias em `.development/`, mas `.aiox-core/data/agent-config-requirements.yaml` contém requisitos literais em `docs/framework/*`. `getFilesToLoad` do loader upstream lê essas entradas (`agent-config-loader.js:169-184`); arquivos ausentes retornam `content: null` (`:250-258`), enquanto o carregamento completo de um papel ainda pode indicar sucesso. `devLoadAlwaysFiles` não substitui essa lista de arquivos.

Preferir adaptação restrita dos dados de configuração no runtime local fixado, sem patch no código de `agent-config-loader.js`, monkey patch, cópias artificiais de documentos no produto ou relaxamento da verificação. Gerá-la de forma reproduzível a partir do arquivo oficial de requisitos de `@aiox-squads/core@5.4.1`, com integridade verificada, usando o fluxo isolado existente de configuração/correção. Preservar o baseline sem alterações e registrar sua proveniência em estado de desenvolvimento ignorado.

Apenas estas substituições exatas de caminhos são necessárias, incluindo referências de arquivos compartilhados/cache:

| Requisito oficial | Fonte de engenharia |
| --- | --- |
| `docs/framework/coding-standards.md` | `.development/coding-standards.md` |
| `docs/framework/tech-stack.md` | `.development/tech-stack.md` |
| `docs/framework/source-tree.md` | `.development/source-tree.md` |

Preservar papéis, entradas obrigatórias, comportamento lazy/condition, documentos upstream de preferências técnicas/testes, bytes dos perfis e configuração não relacionada. Antes de escrever, validar pacote/integridade do archive fixado, baseline de requisitos e caminhos de destino. Aceitar somente o baseline oficial revisado ou seu resultado reconhecido já adaptado; recusar divergência não relacionada para revisão, sem sobrescrever. Registrar baseline, mapeamento, hashes antes/depois e revisão/operação da adaptação na proveniência local. Repetir a configuração deve preservar o resultado reconhecido, sem multiplicar alterações. Nova versão/conteúdo upstream exige novo baseline revisado, em vez de substituição cega de texto.

Na inspeção do desenho, o SHA-256 de requisitos era `68e87b5777d1872c4fed6644dd3c7e3c3e8fd590df7d2b58c36d541cf8e38dd3`; o do loader era `6935a5574f887d88101c44340a96f2a4f8d01b2bdeb433108b84253178a106c7`. Identificam os bytes inspecionados; comparar o baseline de requisitos ao archive oficial com integridade verificada antes de tratá-lo como fonte upstream confiável.

Ampliar `node .development/verify-aiox.mjs` com chamadas reais a `AgentConfigLoader.loadComplete` em processo novo, ignorando caches de conteúdo e desativando writes de desempenho/estado nos probes. Exigir independentemente este conjunto esperado de guias de engenharia, para que remover um requisito não faça o check passar:

| Papel | Guias obrigatórios de engenharia |
| --- | --- |
| `dev` | normas de código, tecnologia, árvore de fontes |
| `pm` | normas de código, tecnologia |
| `sm` | normas de código |
| `analyst` | tecnologia, árvore de fontes |
| `ux-design-expert` | tecnologia, normas de código |

Comparar conteúdos carregados aos bytes exatos e não vazios das fontes em `.development/`; recusar resultados `null`, ausentes ou com erro. Verificar também requisitos upstream restantes não lazy, identidade do papel e perfis/loader sem alterações. Não verificar apenas contagem de arquivos, comandos, saudação ou saída 0. O loader upstream mantém cache de requisitos separado do conteúdo; executar a verificação após a configuração em processo novo. Um arquivo obrigatório upstream ausente continua sendo defeito explícito a investigar, não autorização para remover o requisito ou inventar substituto. A limitação conhecida de normalização de comandos agrupados de UX é separada de F5 e continua declarada.

Ferramentas/proveniência de F5 permanecem fora do pacote do produto; não é necessária dependência, API, banco ou adapter de runtime do produto. Exercitar uma vez o setup documentado de engenharia em checkout limpo independente antes de publicar essa camada de desenvolvimento. Não executar o instalador oficial AIOX diretamente sobre alterações concorrentes do produto sem revisão.

## Achados restantes e sequência de evidências

F4/F5 melhoram a confiabilidade do desenvolvimento; a decisão de repositório não resolve essas correções nem os achados de mídia. Depois, limitar F1 à transferência reutilizável autorizada de arquivos exatos e desenhar F2/F3 como checkpoint de novo canon falado e registros locais aditivos de prontidão por etapa, com revisão de produto/QA. Preservar registros silenciosos/históricos, hashes de referências exatas, reconciliação de resultados incertos e preparação offline. Plano Markdown ou arquivo sintético não prova aceitação dos inputs pelo fornecedor nem que houve escuta.

F6 exige evidência real de aceitação em estúdios independentes: acesso atual ao módulo/rota exatos, referências aceitas, exportações utilizáveis, revisão completa de fala/movimento e jornadas observadas de Codex/Claude. Escopo aplicável de conexão/upload/geração e autorização de gasto precisam existir antes de cada ação externa; reutilizar autorizações que já cobrem o trabalho. Sem inputs exatos, capacidades, orçamento ou autorização obrigatória, a etapa externa afetada permanece pendente, enquanto a preparação local pode continuar. Este documento não autoriza login, upload, cobrança, treinamento, publicação ou afirmações sobre qualidade de modelos, nem prescreve parâmetros de fornecedor não verificados ou cota paga.

## Verificação e manutenção

Engenharia: `node .development/verify-aiox.mjs`, incluindo carregamento real do contexto obrigatório. Mudanças no produto: `npm.cmd run verify`, checks focados de ativação/preservação e auditoria independente do pacote/árvore instalada. Não existem gates de lint/typecheck na raiz. Checks locais não provam descoberta real pelo host, fidelidade de mídia ou publicação remota.

Manter juntas a decisão inglesa e a tradução pt-BR afetada. Eventos de execução, avaliações privadas e proveniência de correção ficam nos registros ignorados de manutenção/estado. Esta decisão é fonte pública reutilizável de engenharia e fica fora do pacote do consumidor pela seleção existente.
