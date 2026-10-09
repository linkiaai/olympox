# Equipe do estúdio

O OLYMPOX organiza o trabalho por meio de Atena e oito perfis especialistas. Use este guia para escolher a responsabilidade necessária para um pedido e entender a entrega esperada. Os perfis e [contratos de tarefa](framework/README.md) orientam o assistente coordenador, Codex ou Claude Code. Um perfil não inicia uma agente; relate delegação somente quando uma subagente real tiver trabalhado.

## Escolha uma responsabilidade

| Nome | ID do papel | Use para | Entrega esperada |
| --- | --- | --- | --- |
| Atena | `master` | Coordenar um pedido e suas decisões | Objetivo, sequência de tarefas, entrega consolidada e próxima etapa |
| Gaia | `opportunity-research` | Encontrar público ou oportunidade editorial para uma nova personagem | Oportunidades com fontes, comparação e recomendação |
| Psiquê | `persona` | Desenvolver posicionamento, personalidade e narrativa | Propostas de conceitos distintos, brief e persona/narrativa coerente |
| Íris | `art` | Definir identidade visual e dirigir cenas | Âncoras visuais, plano de candidatos/referências e especificações de cenas |
| Aurora | `content-trends` | Adaptar sinais atuais a uma personagem existente | Ideias com fontes, aberturas, cenas e dependências de áudio |
| Saraswati | `content` | Escrever conteúdo com a voz da personagem | Roteiros, diálogos, legendas e fontes factuais versionados |
| Selene | `production` | Preparar e executar trabalho audiovisual | Recursos verificados, registros de geração e arquivos realmente exportados |
| Têmis | `qa` | Inspecionar identidade, continuidade e mídia final | Avaliação de arquivos exatos, defeitos, decisão e verificações pendentes |
| Fortuna | `growth` | Planejar distribuição e aprender com resultados | Plano de experimento, definições de métricas e recomendações baseadas em evidências |

Os nomes são internos ao projeto, separados dos IDs das influencers e de suas identidades públicas. Suas origens seguem a convenção de nomes de deusas do framework: [Atena](https://www.getty.edu/cona/CONAIconographyRecord.aspx?iconid=901000069), [Gaia](https://www.britishmuseum.org/collection/term/BIOG58378), [Íris](https://www.britishmuseum.org/collection/term/BIOG58866), [Selene](https://www.classics.cam.ac.uk/files/seleneinstructions2.pdf) e [Têmis](https://www.perseus.tufts.edu/hopper/text?doc=Perseus%3Atext%3A1999.01.0134%3Abook%3D15%3Acard%3D78) remetem a tradições gregas; Psiquê, à história greco-romana de Psyche; [Aurora](https://www.metmuseum.org/art/collection/search/252525) e [Fortuna](https://www.britishmuseum.org/learn/schools/ages-7-11/ancient-rome/gods-and-goddesses-roman-britain), a tradições romanas; [Saraswati](https://www.metmuseum.org/art/collection/search/74840), à tradição hindu. A associação com cada responsabilidade é uma escolha simbólica do projeto.

## Responsabilidades e passagens de trabalho

### Atena

Fale normalmente ou dirija-se a Atena:

> Atena, ajude a desenvolver uma personagem original para este público. Compare três direções e recomende uma.

Atena lê o pedido, as decisões existentes, o estado da personagem e as ferramentas disponíveis. Escolhe as responsabilidades necessárias, resolve detalhes reversíveis, acompanha pendências e consolida resultados. Pode realizar diretamente trabalhos simples ou delegar tarefas independentes quando houver ferramentas reais de subagentes. Preserva divergências relevantes e explica qual decisão elas afetam.

A escolha de direção e identidade permanece com o usuário. Atena registra as autorizações aplicáveis para gastos, treinamento e publicação; não as infere da aprovação de conceito ou canon. Todo o trabalho segue a [constituição](CONSTITUTION.md).

### Gaia

Gaia recebe mercado/idioma, a questão sobre o público, portfólio existente e restrições de produção. Compara sinais com fontes, evidências contrárias, diferenciação e viabilidade. Entrega até três oportunidades com recomendação e lacunas, seguindo a [pesquisa de oportunidades](trend-research.md). Melhorar uma personagem existente ou concluir que faltam evidências são resultados válidos.

### Psiquê

Psiquê recebe a direção selecionada, brief e pesquisa. Desenvolve uma personagem adulta e original com público, premissa, desejo, valores, comportamento e voz editorial. Quando a direção estiver aberta, propõe pelo menos três conceitos de fato distintos antes dos retratos. Separa ficção, hipóteses e fatos reais e mantém as versões narrativas distintas do canon visual/vocal. Consulte [estratégia](strategy.md).

### Íris

Íris recebe o conceito selecionado, canon aprovado quando houver e referências inspecionadas. Define âncoras reconhecíveis, variações permitidas e direção de cenas. Para uma personagem nova, a entrega inclui candidatos expressivos, uma vista neutra de referência e uma cena que expresse a premissa. O usuário seleciona a identidade visual; vistas coerentes de referência são desenvolvidas a partir dessa seleção e realmente anexadas às gerações seguintes.

Íris e Têmis verificam anatomia, presença e continuidade entre ângulos e cenas. Uma personagem falante também precisa de uma referência vocal gerada, ouvida e selecionada antes da aprovação do canon completo. Identidades existentes permanecem dentro das variações aprovadas.

### Aurora

Aurora recebe personagem, narrativa, público, canal/região, conteúdo recente e resultados disponíveis. Entrega adaptações originais de temas, formatos ou áudios atuais, com fontes datadas, abertura e desfecho concretos, sequência de cenas, compatibilidade e dependências. Pode recomendar deixar uma tendência passar. Consulte [pesquisa](trend-research.md).

### Saraswati

Saraswati recebe brief, versões exatas do canon/narrativa e a ideia selecionada. Escreve roteiros, diálogos, legendas e séries com voz reconhecível e fontes para afirmações sobre o mundo real. Uma peça marcada como `ready-for-production` concluiu a preparação editorial; ainda precisa de mídia gerada, inspeção e eventual autorização de publicação. Preserva identidade e narrativa ao adaptar um tema.

### Selene

Selene recebe roteiros, especificações de cenas, arquivos exatos de referência e o escopo aprovado de execução. Higgsfield é o pipeline padrão de mídia; imagens integradas ao assistente exigem escolha explícita de alternativa. Verifica cada módulo selecionado, entradas aceitas, transferência de referências, orçamento do piloto completo, exportação e acesso à inspeção antes do envio. Recursos ausentes deixam a etapa afetada pendente. Siga [produção](production.md) e o [plano do método](../../../templates/locales/pt-BR/production-method.md).

Registra método, ferramenta/módulo, modelo quando exposto, prompts, anexos reais, arquivos/hashes, custo conhecido e limitações. A intenção externa é registrada antes do envio; jobs incertos exigem consulta real e reconciliação antes de outra cobrança. A mídia gerada é exportada como bytes reais e encaminhada à revisão. Um piloto precede os lotes.

### Têmis

Têmis recebe arquivos completos, referências exatas, roteiro, contexto selado da execução e uso pretendido. Inspeciona imagens visualmente, ouve áudio e revisa movimento/áudio completos de vídeo quando aplicável. Sua entrega identifica regiões ou tempos, evidências e uma decisão `approve`, `correct`, `reject` ou `pending`. Mídia inacessível ou falhas críticas impedem aprovação. Consulte [qualidade](quality.md).

### Fortuna

Fortuna recebe estratégia, registros reais de publicação, dados disponíveis das plataformas e custos de produção. Define hipóteses, janelas comparáveis, contagens brutas e denominadores, depois recomenda repetir, ajustar ou encerrar um experimento. Dados precisam ser fornecidos ou coletados com uma ferramenta real; o framework não instala integração de analytics. Ofertas e parcerias precisam de evidências de valor efetivo. Publicação, publicidade e compras usam suas autorizações aplicáveis.

## Mantenha as contribuições rastreáveis

Uma passagem útil identifica objetivo, ID da personagem quando aplicável, versões do canon/narrativa, caminhos e hashes exatos de entradas/saídas, critério de aceitação, trabalho realizado e limitações abertas. Guarde registros criativos privados no estúdio instalado; os perfis reutilizáveis pertencem ao framework.

O núcleo local salva runs e tentativas em `work/runs`, registra responsáveis e identifica a próxima etapa. Não despacha especialistas, gera, consulta jobs externos ou publica automaticamente. Ferramentas ausentes e envios incertos permanecem como pendências explícitas. Mudanças em entradas, canon ou governança usam o procedimento existente de nova tentativa, sem reescrever o histórico. Consulte [operação do núcleo](framework-02.md) e [preservação](operations.md).
