# Método de produção Higgsfield de referência

Este guia leva um conceito de personagem a um piloto completo de mídia. Codex ou Claude Code coordena pesquisa, personalidade, narrativa, roteiros e direção. Higgsfield é o fornecedor padrão para candidatas, referências, cenas, edições de imagens, voz, animação, vídeo e sincronização labial, por operações verificadas para o estúdio atual.

O [estudo de referência](video-reference.md) explica a sequência da fonte. Etapas observadas de imagem/referência, direção vocal e vídeo permanecem separadas das ferramentas escolhidas hoje. Salve mapeamento e adaptações em [plano de método de produção](../../../templates/locales/pt-BR/production-method.md) versionado; use o plano como entrada do run ou saída de planejamento.

## Escolher método e conferir prontidão

Identifique módulos, entregas, dependências, rota e canon existente. Confira conta/workspace, transferência de referências exatas, voz/escuta quando necessárias, exportação e inspeção completa do piloto antes da primeira etapa paga. Registre cotações delimitadas, saldo, limites de tentativas/correções, cobranças desconhecidas e autorização aplicável. Reutilize autorização que já cobre o trabalho.

Nomes de módulos descrevem operações distintas. Builder prepara fichas de personagem; ficha não é Soul ID treinado, referência vocal nem vídeo. Rótulos Soul Cinema e Seedance da fonte não estabelecem disponibilidade executável atual. Verifique módulos obrigatórios separadamente. Se um faltar, mantenha sua etapa pendente e proponha adaptação compatível. Mudança material do fornecedor/método selecionado exige decisão do usuário; [imagens integradas](integrated-images.md) são alternativa explícita.

## Seguir a sequência criativa

| Etapa | Trabalho e evidência de conclusão |
| --- | --- |
| Descoberta e conceito | Resolva lacunas do brief; com direção aberta, compare três conceitos distintos e recomende um. Salve público, personalidade, assinatura visual, premissa recorrente e direção escolhida. |
| Exploração visual | Dirija candidatas expressivas e cena em personagem pelo módulo verificado de imagem/referência. Registre saídas reais, inspeção e seleção visual do usuário. |
| Pacote de referências | Desenvolva vistas coerentes da candidata escolhida com anexos reais. Inspecione reconhecimento, anatomia, proporções e presença entre ângulos/cenas. Salve arquivos exatos legíveis. |
| Voz quando há fala | Gere amostra falada de rascunho/referência, escute e registre seleção do usuário, arquivo/hash e configurações antes do canon final. Escopo silencioso registra por que voz não se aplica. |
| Canon completo | Aprove referências visuais/vocais exatas revisadas e preserve versão/hash e snapshot por operações locais. Canon existente compatível é reutilizado. |
| Roteiro e cenas | Prepare conteúdo/planos contra contexto aprovado. Gere entradas de cena com referências exatas e inspecione antes de animar. |
| Piloto | Use entradas de imagem/áudio/movimento suportadas para peça representativa no meio pretendido. Trabalho de fala/atuação exige piloto adequado de vídeo antes de lotes. |
| Revisão e entrega | Exporte bytes reais, registre/sele proveniência e inspecione mídia completa. Corrija falhas em novas versões e revise novamente. |
| Publicação e aprendizado | Publique com autorização aplicável; registre posts/resultados reais e compare janelas, exposição e custos adequados. Potencial viral é hipótese testável. |

Use [estratégia](strategy.md) para descoberta, [produção](production.md) para decisões de personagem/referências e [passagem de vídeo](production-handoff.md) para planos. Padrão da ferramenta não é direção de arte: dirija idade, silhueta, aparência, atitude e premissa deliberadamente.

Nova personagem com fala permanece `draft` durante preparação da amostra com `purpose: reference`. Direção vocal escrita não substitui escuta. Configurações de voz e referências aprovadas contribuem ao hash do canon; voz alterada após congelamento exige nova versão e aprovação.

## Quando escolhido, preparar Builder com ferramentas atuais do plugin

Leia schemas atuais antes do uso. Os nomes abaixo identificam ferramentas do fornecedor, não comandos OLYMPOX nem adaptadores automáticos:

| Operação | Propósito |
| --- | --- |
| `ai_influencer_prepare` | Preparar desenho da ficha e obter parâmetros retornados e cotação delimitada |
| `ai_influencer_generate` | Submeter desenho preparado dentro da franquia/teto aplicáveis |
| `ai_influencer_get_settings` | Recuperar configurações pelo ID real do job de ficha existente para nova preparação |

Para preservar desenho, use referências de identidade confirmadas e configurações explícitas compatíveis de aparência/tier, com `randomize: false` quando suportado pelo schema atual. Separe identidade de Style/itens e respeite limites reais. Passe `params` retornados sem alterações à geração, com controles atuais de custo. Confirme elegibilidade/controles de geração somente gratuita quando esse for o escopo autorizado; custo ausente não significa gratuito.

Persista intenção antes de gerar, preserve todos os IDs aceitos e reconcilie resultados reais. Configurações salvas exigem nova preparação e preço; não repetem job nem restauram canon local. Siga [execução pelo plugin](higgsfield-plugin.md) para transferência, registro de resultado e exportação. Parâmetros públicos do site/API não estabelecem equivalência com plugin/CLI.

## Preservar personagem aprovada

Carregue ID, versão/hash de canon, aprovação e arquivos exatos, incluindo voz quando aplicável. Nova ficha do fornecedor é candidata derivada: inspecione contra canon e preserve como nova versão. Mudança de fornecedor não autoriza redesenho, substituição de referências aprovadas ou migração histórica.

Use identidades transferidas confirmadas em papéis suportados e compare ângulos/cenas com canon original. Seeds, configurações e job concluído não comprovam fidelidade. Evolução de identidade exige decisão do usuário, versão e aprovação próprias. Mudanças de entradas, método/fornecedor ou governança observados usam nova tentativa explícita com motivo; bytes e aprovações anteriores são preservados.

## Treinamento opcional de identidade

Considere Soul ID ou outro treinamento somente quando o caminho escolhido exigir ou o piloto mostrar problema concreto de consistência. Verifique acesso real, imagens exigidas, direitos, preço, uso de saídas e recuperação. Registre justificativa e autorização de treinamento separadas. Ficha de personagem não comprova treinamento; conteúdo recorrente sozinho não o exige.

## Registrar evidência por etapa

Mantenha método/módulo/rota, ferramenta/modelo exposto, prompt/parâmetros exatos, arquivos/hashes realmente anexados e IDs do fornecedor, saídas, custo/unidade conhecidos, limitações e revisão real. Custo monetário desconhecido continua `null`; créditos ficam em proveniência separada.

Persista intenção externa antes de submeter e reconcilie originais antes de repetir. Registre saídas locais reais e sele o contexto. O núcleo preserva registros e declarações de fornecedor; ferramentas e inspeção reais estabelecem se a mídia existe e serve ao objetivo. Pacotes preparados, jobs concluídos e exemplos da fonte não demonstram piloto bem-sucedido do estúdio.
