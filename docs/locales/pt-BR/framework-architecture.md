# OLYMPOX — arquitetura 0.2

Versão **0.2.0**. Núcleo local implementado; cada estúdio escolhe seus próprios influenciadores, aprova o cânone e demonstra consistência com um piloto inspecionado.

## Direção adotada

O OLYMPOX é um framework local de influenciadores de IA, operado pelo Codex e dedicado a influenciadores virtuais originais, produção e aprendizado. A organização por especialistas, tarefas, fluxos e critérios de conclusão foi inspirada no AIOX. As nove agentes têm nomes de deusas e perfis femininos; seus IDs de papel permanecem estáveis. A implementação usa Node e arquivos locais, sem dependências operacionais externas.

O Codex interpreta o pedido, carrega o pacote da próxima tarefa, usa capacidades disponíveis e registra o trabalho ocorrido. O núcleo mantém contratos, contexto e estado; não despacha agentes, gera mídia, consulta fornecedores nem publica. Perfis não são workers permanentes. Delegação existe somente quando uma subagente real é utilizado.

A documentação do AIOX descreve squads compostos por agentes, tarefas e workflows. Um squad formal depende do projeto inicializado com o núcleo AIOX. Esta organização não representa instalação, certificação ou compatibilidade com esse ecossistema. Referências da revisão inicial: [guia de squads](https://github.com/SynkraAI/aiox-core/blob/main/docs/guides/squads-guide.md) e [visão geral](https://github.com/SynkraAI/aiox-core/blob/main/docs/guides/squads-overview.md).

## O que está implementado

| Área | Núcleo local 0.2 | Limite atual |
| --- | --- | --- |
| Direção | Constituição, skill, nove perfis e contratos de tarefa | Perfis orientam o Codex; não executam sozinhos |
| Identidade | Snapshots de cânone aprovado, versão/hash e bytes de referências preservados | Aprovação e inspeção precisam ter ocorrido; dados históricos ausentes não são reconstruídos |
| Editorial | Narrativa e peças versionadas, cronologia, voz escrita, fontes e vínculos de contexto | Campanha é um ID opcional; não há gestão completa de campanhas |
| Coordenação | Três fluxos, responsável, entradas, saídas e estado persistido | Submissão a ferramentas externas acontece fora do runtime |
| Produção | Contexto de geração selado e revisão vinculada aos hashes aplicáveis | Registro não comprova execução do fornecedor nem fidelidade audiovisual |
| Recuperação | Tentativas preservadas, mudanças detectadas e bloqueio de resultado incerto | Reconciliação exige consulta real; não há retry automático |
| Continuidade | Criação transacional, backup com inventário e restauração sem sobrescrita | Contexto compartilhado fora da persona não é copiado |
| Resultados | Método de experimentos, custos e métricas documentado | Publicação e analytics não têm integração instalada |

As correções anteriores continuam aplicadas: prompt exato vinculado à revisão, recusa de arquivos duplicados por caminhos equivalentes, referências adequadas ao tipo de mídia, custo válido quando conhecido e estados de persona, referência, ativo e tarefa separados. O núcleo adiciona preservação histórica e recuperação sem apagar registros anteriores.

## Camadas e armazenamento

1. **Conhecimento e direção:** constituição, skill, guias, perfis e contratos carregados conforme a tarefa.
2. **Estado local verificável:** cânones, narrativas, peças, execuções seladas, revisões, tarefas e backups.
3. **Execução na sessão:** o Codex usa ferramentas realmente disponíveis e registra saídas e limitações. Adaptadores externos dependem de necessidade e validação próprias.

```text
framework/
  registry.json
  roles/                       # Instruções e limites das especialistas
  tasks/                       # Contratos e critérios de conclusão
  workflows/                   # Criar, produzir, revisar/correct
influencers/<slug>/
  persona.json                 # Ficha de trabalho e identidade atual
  assets.json                  # Manifesto e revisões dos ativos
  canon/v000001/               # Snapshot approved e cópias das referências
  narrative/v000001.json       # História e linguagem editorial
  content/<id>/v000001.json    # Peças e vínculos de contexto
  executions/<hash>/           # Contexto de geração e prompt copiado
  references/, media/, prompts/, exports/
work/runs/run-<UUID>.json       # Estado, tentativas e próxima tarefa
backups/<slug>/<backup-id>/    # Inventário, personagem e runs vinculados
```

Pastas de histórico são preenchidas quando seus registros são criados. Criar a ficha não aprova narrativa ou identidade e não produz mídia. Ver [contratos do núcleo](framework/README.md), [operação](operations.md) e [guia do framework 0.2](framework-02.md).

## Equipe e fluxos

**Atena** coordena e consolida decisões. **Gaia** pesquisa oportunidades; **Psiquê** constrói persona/narrativa; **Íris** dirige identidade e cenas; **Aurora** pesquisa tendências e propõe conceitos; **Saraswati** escreve a peça; **Selene** prepara e executa produção; **Têmis** inspeciona qualidade; **Fortuna** aprende com dados próprios e formula hipóteses comerciais. IDs, entregas e limites estão em [equipe do estúdio](studio-team.md).

Os três fluxos registrados são:

- `create-character`: pesquisa opcional → proposta → decisão de direção quando necessária → planejamento, geração e revisão de candidatos → decisão de cânone → planejamento, geração, revisão e entrega do piloto.
- `produce-piece`: pesquisa opcional → roteiro → direção → geração → revisão → planejamento de distribuição opcional → entrega.
- `review-correct`: plano de correção → nova geração → revisão → entrega dos bytes revisados.

Gaia e Aurora seguem [pesquisa de tendências](trend-research.md), com recorte, fontes datadas, janela e lacunas. Não há radar contínuo instalado. Etapas opcionais podem ser dispensadas com motivo quando o fluxo permitir; geração, revisão, entrega e decisão de cânone exigida não podem ser puladas.

Cada pacote identifica personagem quando aplicável, responsável, contrato, entradas/hashes, entregas e pré-requisitos. Peças podem informar os snapshots de cânone/narrativa e ser usadas como entradas exatas do run; o runtime não cria esses registros editoriais automaticamente. Atena mantém as escolhas e autorizações do usuário e conserva divergências importantes. Todas exercem julgamento independente.

## Retomada e evidências

Runs usam os estados canônicos em inglês `planned`, `in-progress`, `awaiting-input`, `awaiting-tool`, `uncertain-result`, `in-review`, `completed`, `failed` e `cancelled`. Valores históricos em português continuam legíveis por compatibilidade. Mudanças de entradas, saídas concluídas, cânone ou governança exigem nova tentativa e motivo para retomar. O fluxo recomeça, preservando a tentativa anterior e sem reaproveitar silenciosamente suas aprovações.

Antes de um envio externo, persistir intenção e identificadores conhecidos. Uma retomada com job não esclarecido fica `uncertain-result`, inclusive após interrupção antes de registrar a resposta. O Codex consulta o fornecedor com uma ferramenta real e registra a reconciliação antes de completar ou tentar novamente. O runtime não consulta nem reenvia jobs; sem intenção registrada, não descobre chamadas feitas fora dele. Interrupção não demonstra falha nem autoriza nova cobrança.

Conclusão de tarefas que não são gates de decisão exige arquivos existentes, hashes e declaração de evidência adequada à etapa. Gates de decisão humana exigem `approval` explícita; podem ter zero outputs quando o contrato permitir e não exigem o objeto `evidence` habitual. Revisão identifica os bytes da mídia, método e decisão, sem falhas críticas ou limitações pendentes. Entrega aceita os bytes revisados; exportação alterada precisa de outra revisão. Nome de revisor, extensão de arquivo e declaração registrada não comprovam humanidade, pixels, escuta ou execução real. O Codex deve vincular as declarações aos eventos ocorridos. `completed` significa contratos locais preenchidos; publicação continua uma ação separada.

## Cânone, editorial e execução

Snapshots só são criados para um cânone aprovado, por comando explícito ou pela operação de registro, selagem ou migração que exigir esse contexto. Aprovar a ficha, sozinho, não cria o snapshot. A mesma versão não aceita outro hash: evolução de identidade exige nova versão e decisão. Um ativo antigo pode ser validado contra o cânone histórico; sua reutilização exige avaliar identidade e uso atuais. Migração preserva registros legados, mas não inventa execução ou recupera arquivos/aprovações ausentes.

A narrativa mantém desejo, valores, contradição, hábitos, limites, exemplos de escrita e cronologia ficcional em versões próprias. Salvar sem decisão explícita mantém rascunho. Evolução editorial não altera o hash canônico; mudanças de âncoras visuais ou voz vocal seguem o processo de identidade.

A peça relaciona personagem, versões/hashes de cânone/narrativa, objetivo, pilar, mensagem, roteiro, legenda, cenas, ativos e fontes factuais. Música tem elegibilidade separada de popularidade, com plataforma, região, tipo de conta e uso. `ready-for-production` exige contexto aprovado e revisão editorial registrada; não aprova mídia nem publica a peça. Revisões anteriores permanecem preservadas.

A execução selada fixa o contexto de geração registrado, cânone, referências, prompt copiado, ferramenta/modelo e parâmetros expostos, finalidade e custo conhecido. A revisão do ativo se vincula a esse contexto e à mídia exata. Narrativa e roteiro permanecem nos registros editoriais e nos inputs escolhidos para o run; não presumir que estejam incorporados automaticamente ao snapshot de geração. Dados indisponíveis continuam identificados assim.

## Preservação e limites

Criação e restauração usam área temporária, lock e publicação por renomeação, sem sobrescrever personagem existente. Registros usam exclusão entre escritores e operações de preservação. Após interrupção, conferir processo e conteúdo antes de remover um lock.

O backup copia arquivos e pastas vazias do personagem, com inventário de tamanho/hash, além dos runs vinculados ao seu ID. Confere registros históricos e bytes copiados; restauração recusa conflitos. O teste de restauração confere estrutura, integridade e validação local, sem demonstrar reprodução ou fidelidade audiovisual.

Governança, framework, credenciais, ferramentas e inputs compartilhados fora da persona não acompanham esse backup. Preservar também a base do projeto e dependências da continuidade. Um personagem restaurado ainda precisa desse contexto para retomar um run. Cópia local na mesma máquina não protege contra perda do dispositivo.

Hashes detectam alterações, mas não são assinaturas nem autenticação contra alguém capaz de editar e recalcular registros. O núcleo valida integridade e declarações; julgamento criativo, aprovação verdadeira e inspeção final continuam responsabilidades da operação.

## Próximas evidências e evolução

Preservação, coordenação, continuidade editorial e recuperação estão implementadas localmente. Executar `npm.cmd run verify` após alterações para conferir testes, validação e diagnóstico. Fixtures não substituem o primeiro piloto.

O próximo marco é **uma persona**, com público/direção escolhidos, referências inspecionadas e um conjunto pequeno de peças. Conferir consistência entre ângulos, expressões, objetos e, quando aplicável, fala/movimento. Registrar falhas, correções, tempo e custo conhecidos. Exercitar também ferramenta ausente, mudança de entrada, troca de personagem e resultado incerto. Nenhuma média compensa falha crítica.

Depois do piloto, estruturar publicações efetivamente realizadas e experimentos com hipótese, variável, coorte, janela, contagens, denominadores, fonte e decisão. Custos de tentativas rejeitadas contam; moedas diferentes e dados ausentes não são tratados como equivalentes. Campanhas completas, comparação de portfólio, analytics, adaptadores, dashboard e banco de dados entram conforme necessidade observada.

Um adaptador para squads AIOX permanece uma possibilidade futura se houver demanda por esse ecossistema. Deve mapear contratos e validar um projeto real. Escala e automação dependem das evidências do piloto; quantidade de perfis não demonstra qualidade.


> Tradução secundária em português do Brasil. A base canônica, os comandos e os tokens do framework são em inglês. Valores históricos em português continuam compatíveis; essa compatibilidade não reescreve fichas, runs, snapshots, hashes ou aprovações anteriores. O idioma editorial das personagens permanece independente. Consulte a [política de idiomas](localization.md).
