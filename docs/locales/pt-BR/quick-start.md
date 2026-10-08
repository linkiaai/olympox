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

**Geração integrada de imagens do ChatGPT/Codex** é o padrão para aparência, candidatas, referências, cenários, imagens e edições quando disponível. Conceito, personalidade, universo narrativo, roteiros e planejamento continuam no ChatGPT/Codex. Depois de escolher o conceito, dirija uma amostra expressiva de exploração e uma cena que expresse a premissa, inspecione e ajuste antes de ampliar o conjunto de referências. Registre a seleção visual do usuário mantendo a nova persona em `draft` e anexe de verdade as referências exatas escolhidas às vistas, cenas e edições seguintes. Inspecione anatomia, presença e continuidade. Quando houver fala planejada, gere uma amostra vocal em rascunho/referência com ferramenta verificada, escute e registre a seleção do usuário do áudio e das configurações exatos. Então aprove e congele o canon visual/vocal completo antes de um piloto pequeno de produção. Para uma persona sem fala, registre voz como não aplicável. Revise a mídia completa antes dos lotes. Publicação precisa de autorização aplicável e comparação usa resultados reais dos posts. Potencial de viralização continua hipótese.

Psiquê desenvolve a persona e Íris dirige os visuais. Gaia pesquisa oportunidades quando útil. Esses perfis orientam o Codex; consulta é relatada apenas quando um subagente realmente trabalhou.

## Produzir para uma personagem existente

```text
Atena, prepare uma peça para [personagem], usando o cânone e a narrativa
aprovados. Quero um roteiro de [formato] sobre [tema], com cenas e legenda.
```

Saraswati escreve; Selene prepara e executa a produção disponível e autorizada; Têmis inspeciona a mídia completa. Aurora pesquisa tendências quando necessário. Fortuna prepara experimentos de distribuição e analisa dados próprios quando existirem.

Personagens existentes pulam a descoberta inicial de criação e mantêm canon aprovado, idioma e decisões. Reutilize referências de voz aprovadas e inalteradas sem repetir aprovação; acrescentar ou mudar voz em canon congelado exige o processo normal de versão de identidade. Fortaleça atuação, cenas e conteúdo dentro das variações permitidas; adotar Higgsfield não substitui sua identidade.

## Conferir recursos e registrar o método por etapa

Siga [produção](production.md) e salve um [plano do método de produção](../../../templates/locales/pt-BR/production-method.md) versionado. Rastreie o arquivo na run existente como entrada ou saída de planejamento; registre método, ferramenta, modelo exposto, prompts, referências realmente anexadas, arquivos/hashes, custos conhecidos e limitações por etapa. Geração de referências, voz, cenas/vídeo, exportação e revisão precisam de verificação real separada. A rota visual integrada não precisa de Higgsfield, AI Influencer Builder, CLI externa nem chave de API. Depende da disponibilidade da ferramenta e dos limites da conta; não descrevê-la como gratuita ou ilimitada. Treinamento é opcional e autorizado separadamente quando justificado.

Selecionar ferramentas verificadas para voz, animação, vídeo, sincronização labial e recursos especializados conforme necessidade, qualidade e custo conhecido. Higgsfield continua como opção conforme seu [guia de método opcional](higgsfield-influencer-method.md), pelo [plugin do Codex](higgsfield-plugin.md) ou pela [CLI e wrapper locais](higgsfield-setup.md) quando a rota suportar a operação escolhida. O plugin exige instalação e conexão próprias, sem exigir a CLI local do Higgsfield. Se faltar um recurso, manter a etapa pendente e propor alternativas enquanto prepara trabalho local independente. Trocar para geração externa paga exige autorização aplicável.

```text
Para esta peça, escolho explicitamente [método/fornecedor alternativo].
Registre a mudança de método, preserve as referências aprovadas e confira recursos.
```

Respeitar uma escolha explícita do usuário por outro método ou fornecedor. Mantém os mesmos registros de canon e runs, verificações de custos/autorizações e revisão de mídia. Uma cotação de vídeo não cobre outras etapas, como fichas do Builder, voz ou treinamento. Um método rastreado alterado segue o procedimento existente de nova tentativa; jobs externos incertos precisam primeiro ser reconciliados. Personagens e evidências históricos são preservados sem migração automática.

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

`new` cria um rascunho. O Codex salva conceito escolhido, ficha da personagem e brief da conversa antes de gerar referências. Esses comandos não produzem mídia, encaminham a um fornecedor nem aprovam identidade. Consulte [operação](operations.md) para registrar arquivos e [operar o núcleo](framework-02.md) para iniciar e retomar fluxos.

## O que informar na passagem

Informe personagem, versão do canon, conceito escolhido, plano do método de produção, arquivos exatos de entrada, objetivo, canal e entrega esperada. Pendências de ferramenta, decisão, revisão, publicação ou métricas devem permanecer visíveis. Autorizações já dadas continuam válidas; a equipe registra apenas o trabalho realmente executado.
