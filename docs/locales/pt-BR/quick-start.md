# Comece pela conversa.

Abra seu [estúdio instalado independente](installation.md) no assistente local escolhido, Codex ou Claude Code, e faça o pedido normalmente. Nome de agente, sintaxe especial e formulário completo são desnecessários. Atena reutiliza decisões e faz no máximo três perguntas abertas sobre objetivo, presença e público/assunto. O código-fonte do framework fica reservado ao desenvolvimento. O assistente coordena; Higgsfield cria mídia padrão por ferramentas realmente disponíveis naquele aplicativo. Instalação não conecta contas nem comprova Claude web/cloud ou execução real do fornecedor.

## Prepare primeiro um estúdio

A versão 0.5.0 oferece instalador guiado publicado:

```sh
npx --yes github:linkiaai/olympox#v0.5.0 setup
```

Da cópia revisada ou pacote extraído, `node bin/olympox.mjs setup` executa o mesmo guia. `npx --yes` aceita apenas a confirmação de pacote do npm.

Escolha idioma de apresentação, Codex, Claude Code ou ambos e um destino independente. Revise o resumo real da verificação prévia antes da instalação; cancelar antes da escrita preserva o destino. A preparação executa verificações locais do manual e da estrutura e mostra a sintaxe de ativação do assistente escolhido e um primeiro pedido. Execute `npm run verify` no estúdio instalado para a suíte local completa. Conexão Higgsfield e prontidão de mídia são verificações separadas na sessão real. O [guia de instalação](installation.md) cobre `--yes` não interativo com diretório e assistente explícitos, instalação direta, mesclagem e preservação.

## Criar uma personagem

```text
Vamos criar uma influencer. Ajude-me a escolher o objetivo e o tipo de personagem.
Quero personagens realistas com aparência memorável e personalidade forte,
com potencial para conteúdo compartilhável. O público/tema pode ser proposto.
```

Atena oferece opções úteis: entretenimento viral/alcance, comunidade, marca/embaixadora, educação ou narrativa; realismo memorável, pessoa realista com personalidade expressiva ou estilização quando desejado. “Pode propor” é uma resposta válida. O [guia de estratégia](strategy.md) descreve a conversa curta; o [brief](../../../templates/locales/pt-BR/brief.md) registra seu resultado.

Quando a direção estiver aberta, receba pelo menos três fichas de conceito distintas antes dos retratos. Compare premissa, aparência/presença, atitude e exemplo de voz, contraste editorial, três aberturas com entregas, hipótese de compartilhamento e dificuldade de produção. Atena recomenda uma direção; você pode escolher, combinar elementos compatíveis ou pedir revisão. Presença forte pode vir de idade, silhueta, estilo e atitude variados sem impor fantasia.

**Higgsfield é a plataforma padrão de mídia**, seguindo o [método de referência](higgsfield-influencer-method.md). Codex ou Claude coordena conceito, personalidade, narrativa, roteiros e prompts. Confira conexão, módulos, transporte exato, exportação e orçamento do piloto completo antes da geração externa. Produza candidatas expressivas e cena da premissa com operações Higgsfield verificadas; inspecione, ajuste e registre seleção visual enquanto a persona fica `draft`. Anexe referências exatas às vistas/cenas seguintes e inspecione anatomia, presença e continuidade. Com fala planejada, gere/ouça/selecione amostra vocal de rascunho antes de aprovar canon visual/vocal completo e exato. Depois produza piloto curto representativo de vídeo; QA completo e exportação de bytes reais antecedem lotes e publicação autorizada. Brief somente de imagens pode definir seu escopo. Potencial viral continua hipótese. Imagens integradas pelo assistente são [alternativa explícita](integrated-images.md).

Psiquê desenvolve a persona e Íris dirige os visuais. Gaia pesquisa oportunidades quando útil. Esses perfis orientam o coordenador; consulta é relatada apenas quando um subagente realmente trabalhou.

## Produzir para uma personagem existente

```text
Atena, prepare uma peça para [personagem], usando o cânone e a narrativa
aprovados. Quero um roteiro de [formato] sobre [tema], com cenas e legenda.
```

Saraswati escreve; Selene prepara e executa a produção disponível e autorizada; Têmis inspeciona a mídia completa. Aurora pesquisa tendências quando necessário. Fortuna prepara experimentos de distribuição e analisa dados próprios quando existirem.

Personagens existentes pulam a descoberta inicial de criação e mantêm canon aprovado, idioma e decisões. Reutilize referências de voz aprovadas e inalteradas sem repetir aprovação; acrescentar ou mudar voz em canon congelado exige o processo normal de versão de identidade. Fortaleça atuação, cenas e conteúdo dentro das variações permitidas; adotar Higgsfield não substitui sua identidade.

## Conferir recursos e registrar o método por etapa

Siga [produção](production.md) e salve [plano versionado](../../../templates/locales/pt-BR/production-method.md) como entrada/saída de planejamento rastreada no run. Registre por etapa método, ferramenta, modelo exposto, prompts, entradas exatas anexadas, arquivos/hashes, custos, autorização aplicável e limites. Confira geração de referências, voz, cenas/vídeo, exportação e revisão separadamente. Não exige ferramenta integrada de imagem do coordenador. Treinamento é opcional e autorizado separadamente quando justificado; aprovação de ficha ou vídeo não cobre outra etapa paga.

Use módulos Higgsfield escolhidos e verificados pelo [plugin](higgsfield-plugin.md) ou [CLI oficial](higgsfield-setup.md), com transporte complementar quando apropriado. Preserve módulos observados e registre adaptações propostas; a interface AI Influencer atual não é API única verificada. O plugin precisa de conexão própria; CLI local é dispensável quando suas ferramentas atendem às entradas. Recurso ausente mantém etapa pendente enquanto preparação independente continua. Mudança material de método ou escopo pago exige decisão do usuário e autorização aplicável.

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

`new` cria um rascunho. O coordenador salva o conceito escolhido, ficha da personagem e brief da conversa antes de gerar referências. Esses comandos não produzem mídia, encaminham a um fornecedor nem aprovam identidade. Consulte [operação](operations.md) para registrar arquivos e [operar o núcleo](framework-02.md) para iniciar e retomar fluxos.

## O que informar na passagem

Informe personagem, versão do canon, conceito escolhido, plano do método de produção, arquivos exatos de entrada, objetivo, canal e entrega esperada. Pendências de ferramenta, decisão, revisão, publicação ou métricas devem permanecer visíveis. Autorizações já dadas continuam válidas; a equipe registra apenas o trabalho realmente executado.
