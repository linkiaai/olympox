# Ferramentas e prontidão dos fornecedores

Use este guia para escolher a rota de execução e verificar se o estúdio consegue concluir a mídia planejada. OLYMPOX fornece registros e instruções locais; Codex ou Claude Code usa as ferramentas disponíveis na sessão. A instalação do framework não conecta fornecedor nem gera mídia.

## Responsabilidades

| Trabalho | Rota padrão | Conferir antes do uso |
| --- | --- | --- |
| Pesquisa, conceito, personalidade, narrativa, roteiros e planejamento | Coordenador conversacional | Fontes, contexto da personagem e entrega solicitada |
| Candidatas, pacotes de referência, cenas e edições de imagens | Higgsfield | Módulo escolhido, referências exatas, exportação e inspeção visual |
| Voz, animação, vídeo e sincronização labial | Higgsfield | Entradas de áudio/movimento, operação suportada, escuta e revisão completa do vídeo |
| Runs locais, histórico de canon, registros de ativos e backups | Comandos OLYMPOX | Arquivos exatos, versões e decisões registradas |
| Imagens integradas ao assistente | Alternativa escolhida explicitamente pelo usuário | Geração de imagens, anexos, exportação e inspeção no aplicativo |

Higgsfield é o fornecedor padrão de mídia. O [método de produção](higgsfield-influencer-method.md) separa seus módulos; o [estudo da fonte](video-reference.md) explica a referência desse método. Um recurso do site ou uma skill instalada não comprova acesso executável no assistente.

## Escolher uma rota Higgsfield

Use o [plugin](higgsfield-plugin.md) quando suas ferramentas conectadas aceitam as entradas necessárias. Ele dispensa CLI local. A [CLI local opcional](higgsfield-setup.md) pode oferecer operações verificadas separadamente ou transferir referências locais quando suportado. Sessões de conta, modelos, mecanismos de entrada e cobrança podem diferir; verifique a rota escolhida de forma independente.

O wrapper de CLI do framework oferece verificações locais de integridade, login interativo e consultas limitadas. Ele não submete geração, envia mídia nem treina identidade. Nenhuma rota possui adaptador automático de submissão no núcleo local.

Para referências locais, confira transferência suportada por ferramentas antes de propor anexos manuais. Reutilize IDs confirmados do fornecedor quando adequado. Um caminho escrito no prompt não anexa arquivo; registre quais arquivos/hashes exatos chegaram ao fornecedor e seus papéis de entrada.

## Conferir o piloto completo antes da primeira etapa paga

Salve um [plano de método de produção](../../../templates/locales/pt-BR/production-method.md) com:

1. Módulos e operações executáveis para identidade, referências, voz quando necessária, cenas e piloto.
2. Acesso à conta/workspace, transferência e reutilização de referências e schemas atuais dos parâmetros.
3. Como exportar e inspecionar saídas reais: imagens visualmente, áudio por escuta e vídeo com revisão completa de movimento/áudio.
4. Estimativas por etapa, unidades, saldo disponível, limites de tentativas/correções e cobranças desconhecidas. Separe créditos de custo monetário.
5. Autorização aplicável para uploads, geração paga e treinamento opcional. Reutilize autorizações que já cobrem o escopo.

Se uma etapa obrigatória estiver indisponível, identifique o recurso ausente, próxima ação e alternativa proposta. Mantenha essa etapa pendente. [Imagens integradas](integrated-images.md) exigem escolha explícita de alternativa; falta de acesso ao Higgsfield não as seleciona automaticamente.

## Registrar execução e entrega

Persista intenção externa antes da submissão, preserve IDs retornados e reconcilie resultados incertos pelo job original antes de repetir. Salve saídas como novas versões locais, registre os ativos, sele o contexto declarado e inspecione os arquivos finais exatos. Veja [execução pelo plugin](higgsfield-plugin.md), [operações locais](operations.md) e [qualidade](quality.md).

Para vídeo, prepare a [passagem dos planos](production-handoff.md) e aprove um piloto inspecionado antes de lotes. Prévia do fornecedor, job concluído ou teste local não comprova fidelidade final. A entrega usa bytes revisados; publicação exige autorização aplicável própria e evidência real.

## Fontes do fornecedor

A base preservada da CLI/skill e a licença estão inventariadas na [proveniência do fornecedor](../../../vendor/higgsfield-skills/provenance.json). Referências importadas ajudam na pesquisa de schemas/prompts; não ativam fornecedor, autorizam cobranças nem demonstram qualidade. Confira o catálogo atual e ferramentas reais da sessão em vez de depender de listas de modelos ou preços copiados para a documentação.
