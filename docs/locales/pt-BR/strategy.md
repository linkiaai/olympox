# Estratégia de personagem e conteúdo

Use este guia em um estúdio instalado para transformar um objetivo de público em personagem original, proposta editorial repetível e teste pequeno. Atena coordena a conversa; Gaia, Psiquê, Íris, Saraswati e Fortuna contribuem quando seu julgamento ajuda. O potencial de viralização de um conceito é uma hipótese a testar por meio de conteúdo e distribuição reais.

## Descubra o objetivo

Reutilize preferências informadas e decisões anteriores. Pergunte apenas os pontos essenciais ainda abertos, agrupados em no máximo três perguntas curtas sobre objetivo, presença da personagem e público/tema. “Pode propor” é uma resposta válida. Registre a conversa no [brief](../../../templates/locales/pt-BR/brief.md); o usuário não precisa completar um questionário.

| Decisão | Opções iniciais úteis |
| --- | --- |
| Objetivo | Entretenimento/alcance, comunidade, educação/narrativa, papel de marca ou uma direção proposta |
| Presença | Realismo memorável, pessoa realista com personalidade expressiva, estética estilizada escolhida ou uma proposta |
| Público/tema | Público definido, interesses a explorar ou oportunidade aberta |

Quando a direção estiver aberta, recomende conceitos realistas variados com presença forte como proposta. Preserve a estética selecionada; personagens memoráveis podem ser discretas, incomuns ou estilizadas sem exagero forçado. Uma pergunta sem resposta deixa a decisão correspondente aberta. Personagens existentes reutilizam a identidade aprovada e dispensam o onboarding de criação.

Escreva a proposta em uma frase:

> Para **[público em uma situação concreta]**, esta personagem oferece **[utilidade ou experiência]** por meio de **[perspectiva e linguagem individuais]**.

Use [pesquisa de oportunidades](trend-research.md) quando for necessário investigar público ou espaço editorial. Demanda e potencial financeiro exigem evidências; um concorrente popular ou pico de buscas, sozinho, não estabelece nenhum dos dois.

## Compare conceitos distintos antes dos retratos

Para uma direção aberta, apresente pelo menos três fichas de conceito comparáveis. Cada uma inclui:

- Público, promessa editorial e premissa narrativa em uma frase.
- Presença visual memorável: idade adulta, silhueta/postura, estilo, expressão e detalhes recorrentes conforme o conceito.
- Atitude, amostra de voz e contraste editorial: qual expectativa ou perspectiva torna a personagem distinta.
- Três ganchos concretos de conteúdo com aberturas e desfechos cumpridos, além de um motivo para assistir, salvar ou compartilhar.
- Dificuldade de produção, possibilidades recorrentes e a principal incerteza a testar.

Mudar apenas nome, cabelo ou roupa não cria outro conceito. Recomende um, explique a troca envolvida e permita que o usuário selecione ou combine elementos compatíveis antes da exploração de identidade.

| Compare | Pergunte |
| --- | --- |
| Relevância | O que faz este público voltar? |
| Diferenciação | A premissa e a voz podem ser reconhecidas sem um retrato? |
| Presença | Quais comportamentos e detalhes visíveis expressam a proposta? |
| Repetibilidade | Dez peças diferentes podem cumprir a promessa? |
| Viabilidade | O estúdio sustenta o conceito com ferramentas, tempo e orçamento disponíveis? |
| Confiança | Ele funciona sem credenciais, depoimentos ou experiências reais inventados? |

Por exemplo, uma entusiasta mais velha de reparos que trata objetos descartados como peças de luxo, uma entusiasta de força que faz demonstrações calmas e uma exploradora urbana que transforma caminhos conhecidos em mistérios têm premissas e atuações diferentes. São conceitos ilustrativos, não personagens aprovadas.

Salve conceito selecionado, retorno e decisão no brief e nos registros da personagem. Leve esses detalhes para os candidatos e cenas, em vez de reiniciar a descoberta a cada etapa.

## Desenvolva a personagem e as referências exatas

Defina uma identidade adulta, fictícia e original. Referências podem orientar luz, composição, roupa, ritmo ou linguagem; não devem copiar rosto, voz ou biografia de uma pessoa identificável. Dê à personagem um desejo, dois ou três valores, uma contradição plausível, interesses/hábitos e limites. Mostre a personalidade por decisões e reações concretas.

Escreva uma apresentação, uma opinião e uma resposta à discordância. Explique, com exemplos, vocabulário, humor, ritmo e intimidade compatíveis com a voz. Mantenha cronologia fictícia e afirmações sobre o mundo real separadas. Narrativa e conteúdo têm versões próprias; evolução editorial não muda automaticamente o canon visual/vocal.

Desenvolva conceitos, narrativa, roteiros e planejamento com Codex ou Claude Code. Higgsfield é o pipeline padrão para candidatos, referências, cenas, edições de imagem, voz e vídeo. Salve o [plano do método de produção](../../../templates/locales/pt-BR/production-method.md) e verifique cedo todo o caminho do piloto, entradas, exportação, inspeção e orçamento. Preserve os métodos de referência pedidos e registre adaptações. Imagens integradas ao assistente exigem [escolha explícita de alternativa](integrated-images.md). Recursos ausentes deixam a etapa afetada pendente; geração externa paga precisa de autorização aplicável.

Siga esta sequência para uma nova identidade:

1. Explore o conceito selecionado pelo método verificado. Inspecione uma vista neutra de identidade e uma cena expressiva ou capa no tamanho final que comunique a premissa. Revise a partir do retorno antes de ampliar o conjunto.
2. Deixe o usuário selecionar a candidata visual. Desenvolva ângulos e cenas coerentes de referência a partir dessa seleção, anexando os bytes exatos pelos campos aceitos da ferramenta; citar um caminho no prompt é insuficiente.
3. Inspecione anatomia, presença e continuidade entre essas vistas conforme [qualidade](quality.md). Seleção visual, sozinha, não aprova o canon completo.
4. Resolva `voice.applicability` antes do cânone completo. Para `speaking`, mantenha a persona `draft` ao gerar amostra vocal com `purpose: reference`; escute o áudio aprovado exato e vincule `voice.selection` a ID, caminho, SHA-256 da referência e evento real de seleção conforme [operações](operations.md). Para `silent`, mantenha `voice.referenceId` e `voice.selection` null e explique a voz não aplicável. Novo escopo `unspecified` permanece pendente; campos históricos ausentes são preservados.
5. Obtenha aprovação explícita do canon visual/vocal completo e exato e crie seu snapshot por [operações](operations.md). A produção então usa essa versão preservada e o conjunto de referências.

Uma personagem já aprovada conserva rosto, corpo, idade, voz e âncoras. Fortaleça atuação e conteúdo dentro das variações permitidas. Adicionar ou alterar voz no canon congelado exige o processo normal de versão de identidade e aprovação; voz aprovada sem mudanças não exige seleção repetida.

## Construa conteúdo repetível

Comece com um conjunto pequeno de séries que cumpra a proposta. Cada peça precisa de uma ideia, abertura concreta, desfecho, perspectiva da personagem e resposta pretendida do público.

| Função da série | Estrutura prática |
| --- | --- |
| Ajudar ou esclarecer | Pergunta concreta → resposta demonstrável → limite ou próximo passo |
| Entreter ou conectar | Desejo da personagem → tensão → consequência ou continuação |
| Convidar à conversa | Escolha ou situação → perspectiva → pergunta específica |

Adapte essas funções ao conceito. Identificação, surpresa, humor, emoção e utilidade são possíveis mecanismos de compartilhamento. Evite roteiros intercambiáveis, abertura não cumprida ou pedido de comentários sem pergunta significativa.

Aurora pode trazer [ideias de tendências atuais](trend-research.md); Saraswati desenvolve roteiros e legendas finais. Confira novamente sinais passageiros e áudio antes de produzir/publicar. Mantenha séries atemporais úteis independentemente de tendências.

## Teste a produção antes de ampliar

Produza primeiro um piloto pequeno no meio pretendido. Para uma personagem construída em torno de vídeo viral, comece com atuação vertical curta, incluindo fala/atuação quando planejadas. O piloto testa identidade em movimento, voz, interpretação, continuidade e o caminho de produção. Roteiros podem ser preparados durante a descoberta; a produção usa o canon exato aprovado.

Revise a mídia completa e exporte os bytes realmente revisados antes de lotes. Resolva defeitos com outra versão e inspeção. Uma imagem estática não estabelece qualidade de movimento, identidade vocal ou lip-sync. Consulte [produção](production.md) e [qualidade](quality.md).

Depois, escolha um experimento de público adequado à capacidade do estúdio e à autorização aplicável de publicação. Defina antes de publicar:

| Campo | Registre |
| --- | --- |
| Hipótese e variável | Uma diferença esperada concreta; altere uma característica principal quando a comparação for possível |
| Conjunto comparado | IDs reais das publicações, canal, formato, público/configurações e contexto orgânico/pago |
| Janela | Compare publicações na mesma idade; escolha duração e volume viáveis |
| Métrica principal | Numerador, denominador, unidade e fonte real da plataforma |
| Qualidade e regra de decisão | Retorno útil, evidência mínima e o que sustenta repetir/ajustar/encerrar |
| Custo | Tempo de produção e gasto autorizado real |

Mantenha contagens brutas junto às taxas. Exemplos incluem compartilhamentos ÷ alcance × 1.000 e salvamentos ÷ alcance × 1.000: contam eventos por alcance, não a porcentagem de pessoas que agiram. Conclusão de vídeo só é calculável com dados compatíveis de reproduções concluídas/iniciadas. Denominadores ausentes ou zero não são calculáveis. Separe alcance, impressões e reproduções; somar alcance de posts não produz o público único da campanha.

Comparações orgânicas são observacionais. Momento, público e distribuição podem diferir; um post bem-sucedido não prova causalidade nem valida toda uma personagem. Se a exposição for insuficiente, registre resultado inconclusivo e decida se deve ampliar ou redesenhar o teste. Encerre ou ajuste a hipótese com evidências, sem descartar a persona prematuramente.

## Cresça com evidências e confiança do público

Identifique a natureza virtual da personagem na apresentação pública e aplique os requisitos atuais da plataforma escolhida. Mantenha registros internos de identificação; legendas editoriais e artes não precisam repetir uma frase fixa. Relações comerciais precisam de identificação clara, e fatos, credenciais, uso de produtos, depoimentos, parcerias e resultados precisam de evidências.

Trate uma oferta como hipótese de valor: registre quem se beneficia, o que recebe, interesse observado, custo, preço proposto e limitações. Uma personagem fictícia não fornece prova de uma experiência física que nunca aconteceu. Separe projeções, receita bruta, custos e resultado líquido.

Antes de adicionar outra personagem, confirme necessidade de público, perspectiva/voz, mundo visual e séries distintos. Cada uma mantém canon, referências, cronologia e resultados independentes. Processos podem ser compartilhados enquanto os registros privados das personagens permanecem no estúdio instalado. Atena avança com escrita e organização reversíveis; escolhas de identidade, novos gastos, treinamento e publicação usam decisões e autorizações aplicáveis do usuário.
