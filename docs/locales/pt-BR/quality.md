# Qualidade de identidade e mídia

Use este guia para avaliar candidatos, referências e mídia final reais em relação ao conceito escolhido, canon exato e uso pretendido. Têmis registra a avaliação; Atena encaminha correções e decisões do usuário. Geração bem-sucedida, hashes, resolução e registros válidos não estabelecem fidelidade nem aprovação.

## Separe seleção, inspeção e estado do ativo

| Registro | Estados e significado |
| --- | --- |
| Persona | `draft` durante descoberta; `canon-approved` após decisão explícita de identidade |
| Referência | `candidate`, `approved` ou `rejected`; arquivos exatos selecionados sustentam o canon |
| Ativo no manifesto | `draft` antes da aprovação, `production` para uso revisado e aprovado, ou `rejected` |
| Decisão de revisão | `approve`, `correct`, `reject` ou `pending`, vinculada a arquivos e escopo exatos |

`production` não significa publicado. O usuário seleciona a identidade e aprova o canon completo; a inspeção fornece evidências para essa decisão. Registre quem realmente revisou e o método, sem inventar inspeção humana ou consenso de especialistas. Novas edições criam uma nova versão para revisão; preserve arquivos, decisões e snapshots anteriores.

## Confira conceito e referências antes do canon

Leia o conceito selecionado e compare os arquivos reais com seus critérios concretos. Para direção aberta, [estratégia](strategy.md) exige pelo menos três propostas distintas de conceito antes dos retratos. Revise candidatos para a direção escolhida pelo usuário, sem adicionar traços de identidade para satisfazer uma preferência nova.

| Verificação | Evidência necessária |
| --- | --- |
| Conceito e presença | Vista neutra de identidade mais cena expressiva ou capa no tamanho final; postura, expressão, estilo e comportamento devem comunicar a premissa escolhida |
| Anatomia e identidade | Ângulos legíveis de referência e vistas pertinentes do corpo; proporções plausíveis e reconhecimento entre cenas, além de um acessório |
| Originalidade | Personagem adulta original, sem reproduzir rosto, voz ou biografia de pessoa identificável |
| Voz criativa | Amostras de falas e séries com perspectiva reconhecível, abertura concreta e desfecho cumprido |
| Continuidade de referências | Arquivos/hashes exatos selecionados pelo usuário e evidência de anexo real nas chamadas seguintes |
| Conclusão do método | [Plano do método](../../../templates/locales/pt-BR/production-method.md) salvo, etapas selecionadas verificadas, arquivos reais de saída, custos conhecidos ou incerteza autorizada e limitações abertas |

Um conceito deliberadamente discreto pode passar se sua presença específica estiver visível. Um retrato neutro sem defeitos, sozinho, não estabelece a premissa, e um conceito memorável não prova potencial de viralização. Para personagens existentes, avalie a variação permitida conforme o canon aprovado; novos critérios criativos não revogam aprovação histórica nem autorizam substituir a identidade.

Para uma personagem falante, mantenha a persona `draft` durante seleção visual e exploração vocal. Gere uma amostra vocal de rascunho/referência, ouça o áudio exato e registre arquivo/configurações selecionados pelo usuário antes da aprovação do canon visual/vocal completo. Em escopo silencioso, registre voz como não aplicável. Crie o snapshot aprovado por [operações](operations.md); nunca acrescente novas configurações vocais a uma versão congelada nem substitua referência de canon por uma saída não aprovada.

Higgsfield é o pipeline padrão de mídia. Verifique os módulos escolhidos no plano do método de referência; um recurso separado de Builder só é necessário quando o plano realmente o seleciona. Imagens integradas ao assistente precisam de escolha explícita de alternativa. Uma etapa obrigatória ausente permanece pendente; vídeo posterior ou especificação preparada não a conclui.

## Inspecione imagens em duas escalas

Abra o resultado real junto das referências exatas. Compare primeiro ângulos/expressões semelhantes, inspecione a composição completa e detalhes críticos na resolução original, depois confira o tamanho/recorte que o público verá.

| Área | Verificações práticas |
| --- | --- |
| Rosto e corpo | Estrutura facial, distância entre olhos, nariz, mandíbula, orelhas, marcas distintivas, idade aparente, proporções e características aprovadas |
| Olhos e boca | Olhar, pupilas, pálpebras, alinhamento dos lábios, dentes e língua; expressões plausíveis sem traços fundidos ou duplicados |
| Mãos e contato | Dedos conectados, articulações, pegada, contato com objetos e anatomia parcialmente escondida |
| Cena e luz | Perspectiva, sombras, reflexos, escala e fontes de luz coerentes com pose e ambiente |
| Estilo e objetos | Regras visuais escolhidas, detalhes de pele/cabelo quando naturalistas, costuras, estampas, acessórios, logos e texto |
| Enquadramento final | Recorte, margens de segurança, legibilidade, foco e adequação ao canal |

Preserve assimetria intencional e regras de estilo selecionadas. Não troque os traços da personagem por um padrão genérico de beleza nem invente novas imperfeições em cada imagem. Identifique regiões defeituosas concretamente em vez de informar apenas “parece errado”.

## Ouça o áudio e revise o vídeo completo

Ouça o arquivo vocal exato. Para vídeo, assista ao arquivo inteiro com áudio em velocidade normal, depois reveja tempos suspeitos e encontros entre planos. Quadros estáticos ajudam a investigação, mas não substituem revisão de movimento. Confira novamente a exportação editada após aplicar música, legendas ou cortes.

| Área | Verificações práticas |
| --- | --- |
| Identidade vocal | Timbre, sotaque, pronúncia, ritmo, emoção aprovados e continuidade entre takes |
| Fala | Sentido exato, palavras completas, inteligibilidade, respiração, ruído e clipping; legendas não provam precisão da fala |
| Identidade em movimento | Estabilidade de rosto/corpo ao virar, expressar e ficar oculto; cabelo, roupa e acessórios estáveis |
| Movimento e cena | Anatomia, gestos, contato, inércia, movimento de câmera, reflexos, cintilação e fundos plausíveis ao longo do tempo |
| Lip-sync | Palavras audíveis, movimento da boca, pausas, dentes/língua e expressões alinhados |
| Entrega editada | Fala compreensível com música, legendas sincronizadas, cortes coerentes, duração e enquadramento final pretendidos |
| Atuação | Abertura/desfecho e interpretação entregam a premissa da peça e a atitude selecionada |

Um piloto curto no meio pretendido é revisado e exportado antes dos lotes. Uma imagem estática aprovada cobre apenas seu uso visual delimitado; não aprova movimento, fala ou lip-sync. Se áudio ou vídeo não puder ser acessado, deixe essa revisão pendente e identifique a inspeção necessária.

## Decida e encaminhe o resultado

| Decisão | Quando usar | Próxima etapa |
| --- | --- | --- |
| `approve` | Verificações aplicáveis concluídas sem defeito crítico ou limitação pendente | Entregar os bytes exatos revisados para o uso declarado |
| `correct` | A direção continua útil, mas precisa de reparo concreto | Salvar nova versão e repetir verificações afetadas e revisão completa |
| `reject` | Identidade errada, anatomia impossível, falha grave de continuidade ou fala/lip-sync inutilizável comprometem o resultado | Preservar a tentativa e preparar outra abordagem dentro do canon |
| `pending` | Faltam referências, acesso à inspeção, autorização ou evidência de uso para decidir | Identificar entrada/verificação exata ausente e responsável pela próxima etapa |

Falhas críticas impedem aprovação independentemente de média de pontuação: desvio de identidade, anatomia ou reflexos impossíveis, deformação ao longo do tempo, fala que muda o sentido pretendido, áudio incompreensível ou lip-sync perceptivelmente errado. Direitos de uso sabidamente inadequados impedem entrega; direitos ou permissão de referências incertos permanecem pendentes. Composição, roupa, expressão ou duração podem exigir correção quando a identidade permanece íntegra.

Faça o menor reparo útil e compare versões. Confira regiões vizinhas e o resultado completo depois: corrigir uma mão pode mudar o rosto; reparar lip-sync pode danificar dentes. Nunca resolva uma falha reescrevendo canon aprovado ou evidência histórica.

## Registre uma revisão que permita agir

Salve arquivo/versão e SHA-256 exatos, versão/hash do canon, uso/recorte pretendido, responsável pela revisão, data, método, decisão, regiões/tempos concretos e verificações abertas. Os métodos são `visual`, `listening` e `visual-and-audio`; registros históricos preservam seus bytes originais.

> `pilot-v002.mp4`, [hash do arquivo], canon 1 [hash do canon], vídeo vertical; revisão completa de movimento/áudio por [responsável real], [data], `visual-and-audio`; `correct`: o colar desaparece em 00:04 e a palavra final é cortada. Nova versão necessária antes da aprovação.

Os contratos locais verificam declarações estruturadas e integridade dos arquivos. Não comprovam que visualização/escuta ocorreu, que quem revisou é humano ou que um processo criativo funcionou. Siga [produção](production.md) para contexto selado e exportações reais; use autorização aplicável do usuário e registre evidência real separadamente para publicação.
