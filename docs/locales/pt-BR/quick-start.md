# Comece pela conversa.

Abra seu [estúdio instalado independente](installation.md) no Codex e faça o pedido normalmente. Nome de agente, sintaxe especial e formulário completo são desnecessários. Atena lê decisões já informadas e faz no máximo três perguntas ainda abertas sobre objetivo, presença da personagem e público/assunto. A cópia do código-fonte do framework é reservada para desenvolvimento e manutenção.

## Criar uma personagem

```text
Vamos criar uma influencer. Ajude-me a escolher o objetivo e o tipo de personagem.
Quero personagens realistas com aparência memorável e personalidade forte,
com potencial para conteúdo compartilhável. O público/tema pode ser proposto.
```

Atena oferece opções úteis: entretenimento viral/alcance, comunidade, marca/embaixadora, educação ou narrativa; realismo memorável, pessoa realista com personalidade expressiva ou estilização quando desejado. “Pode propor” é uma resposta válida. O [guia de estratégia](strategy.md) descreve a conversa curta; o [brief](../../../templates/locales/pt-BR/brief.md) registra seu resultado.

Quando a direção estiver aberta, receba pelo menos três fichas de conceito distintas antes dos retratos. Compare premissa, aparência/presença, atitude e exemplo de voz, contraste editorial, três aberturas com entregas, hipótese de compartilhamento e dificuldade de produção. Atena recomenda uma direção; você pode escolher, combinar elementos compatíveis ou pedir revisão. Presença forte pode vir de idade, silhueta, estilo e atitude variados sem impor fantasia.

O método principal para criar novos influenciadores é **Higgsfield AI Influencer Builder**. Depois de escolher o conceito e dentro da autorização aplicável, inspecione uma amostra de exploração e ajuste antes de ampliar para a ficha/conjunto de referências e uma cena da personagem. Selecione a identidade visual mantendo a nova persona em `draft`. Prepare roteiros e, quando houver fala planejada, uma amostra de voz em rascunho/referência; escute e registre áudio exato escolhido e configurações. Então aprove e congele o canon visual/vocal completo antes de produzir o piloto de cenas/vídeo no Higgsfield. Para uma persona sem fala, registre voz como não aplicável. Revise a mídia completa antes dos lotes. Publicação precisa de autorização aplicável e comparação usa resultados reais dos posts. Potencial de viralização continua hipótese.

Psiquê desenvolve a persona e Íris dirige os visuais. Gaia pesquisa oportunidades quando útil. Esses perfis orientam o Codex; consulta é relatada apenas quando um subagente realmente trabalhou.

## Produzir para uma personagem existente

```text
Atena, prepare uma peça para [personagem], usando o cânone e a narrativa
aprovados. Quero um roteiro de [formato] sobre [tema], com cenas e legenda.
```

Saraswati escreve; Selene prepara e executa a produção disponível e autorizada; Têmis inspeciona a mídia completa. Aurora pesquisa tendências quando necessário. Fortuna prepara experimentos de distribuição e analisa dados próprios quando existirem.

Personagens existentes pulam a descoberta inicial de criação e mantêm canon aprovado, idioma e decisões. Reutilize referências de voz aprovadas e inalteradas sem repetir aprovação; acrescentar ou mudar voz em canon congelado exige o processo normal de versão de identidade. Fortaleça atuação, cenas e conteúdo dentro das variações permitidas; adotar Higgsfield não substitui sua identidade.

## Conferir o método principal ou escolher uma alternativa

Siga o [método de influenciadores no Higgsfield](higgsfield-influencer-method.md) e salve um [plano do método de produção](../../../templates/locales/pt-BR/production-method.md) versionado. Rastreie o arquivo na run existente como entrada ou saída de planejamento; preserva etapas escolhidas e evidência sem acrescentar execução automática de fornecedor. Builder, geração de referências, voz, cenas/vídeo, exportação e revisão precisam de verificação real separada. Treinamento é opcional e autorizado separadamente quando justificado.

O acesso ao Higgsfield pode usar o [plugin do Codex](higgsfield-plugin.md) ou a [CLI e wrapper locais](higgsfield-setup.md), desde que a rota escolhida suporte os módulos necessários. O plugin precisa de instalação e conexão próprias no Codex, sem exigir a CLI local do Higgsfield. A instalação do OLYMPOX não fornece acesso à conta de nenhuma das rotas externas. Se faltar um recurso obrigatório, mantenha essa etapa pendente e prepare o trabalho local independente; não substitua silenciosamente Builder por imagens do Codex ou vídeo direto no Kling.

```text
Para esta peça, escolho explicitamente [método/fornecedor alternativo].
Registre a mudança de método, preserve as referências aprovadas e confira recursos.
```

Uma alternativa explícita é suportada, incluindo imagens integradas do Codex quando escolhidas. Mantém os mesmos registros de canon e runs, verificações de custos/autorizações e revisão de mídia. Uma cotação de vídeo não cobre fichas do Builder, voz ou treinamento. Um método rastreado alterado segue o procedimento existente de nova tentativa; jobs externos incertos precisam primeiro ser reconciliados.

## Revisar e corrigir

```text
Têmis, revise estes arquivos contra as referências aprovadas.
Identifique os trechos ou regiões que precisam de correção.
```

Uma falha crítica reprova o ativo. A correção cria uma nova versão e exige outra inspeção; os originais e o histórico permanecem preservados.

## Operar os registros locais

Requer Node 22 ou posterior. Não há dependências externas para operar os registros.

```powershell
npm.cmd run verify
node scripts/studio.mjs help
node scripts/studio.mjs new my-persona
node scripts/studio.mjs list
```

`new` cria um rascunho. O Codex salva conceito escolhido, ficha da personagem e brief da conversa antes de gerar referências. Esses comandos não produzem mídia, encaminham ao Builder nem aprovam identidade. Consulte [operação](operations.md) para registrar arquivos e [operar o núcleo](framework-02.md) para iniciar e retomar fluxos.

## O que informar na passagem

Informe personagem, versão do canon, conceito escolhido, plano do método de produção, arquivos exatos de entrada, objetivo, canal e entrega esperada. Pendências de ferramenta, decisão, revisão, publicação ou métricas devem permanecer visíveis. Autorizações já dadas continuam válidas; a equipe registra apenas o trabalho realmente executado.
