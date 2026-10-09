# Início rápido

Instale um estúdio independente, abra-o no Codex ou Claude Code e descreva o que quer criar. Você pode conversar normalmente; Atena coordena o pedido e carrega as orientações relevantes do OLYMPOX.

## 1. Instale e abra o estúdio

Requer Node 22+ e um ambiente local de Codex ou Claude Code. Instale a release publicada:

```sh
npx --yes github:linkiaai/olympox#v0.5.0 setup
```

A partir de checkout revisado ou pacote extraído, use `node bin/olympox.mjs setup`.

Escolha assistente e destino, revise o plano de instalação e abra a pasta instalada. Invoque `$olympox` no Codex ou `/olympox` no Claude Code. Recarregue o assistente se as novas skills ainda não forem descobertas. Consulte [instalação](installation.md) para setup por script, merge e atualizações.

O setup verifica arquivos locais e manual. Conecte o Higgsfield separadamente e verifique os módulos necessários para o piloto pretendido.

## 2. Peça um personagem

> Use OLYMPOX para criar um influenciador para [público/tema]. Proponha três conceitos diferentes, mostre como cada um sustentaria uma série recorrente e recomende um.

Se a direção estiver aberta, o assistente faz poucas perguntas pendentes sobre objetivo, presença e público. “Pode propor” é uma resposta válida. Compare premissa, personalidade, assinatura visual, exemplo de voz, ganchos recorrentes e dificuldade de produção antes de escolher.

A direção selecionada vira uma persona em rascunho e um brief. [Desenvolvimento de personagens](strategy.md) explica essa etapa.

## 3. Selecione identidade e voz

Antes da geração paga, verifique o caminho do piloto completo: acesso à conta, módulos necessários, referências aceitas, exportação, inspeção e orçamento. [O método de produção](higgsfield-influencer-method.md) descreve a sequência padrão no Higgsfield.

Gere candidatos expressivos e uma cena da premissa. Selecione a direção visual, construa referências coerentes e inspecione anatomia, presença e continuidade. Se o personagem fala, ouça e selecione uma amostra vocal em rascunho. Aprove o cânone visual/vocal exato quando essas escolhas estiverem prontas.

Suas escolhas ficam explícitas no registro. Aprovar a persona, por si só, não cria um snapshot congelado; as operações de registro o preservam. A geração de imagens integrada ao assistente exige uma [escolha alternativa explícita](integrated-images.md).

## 4. Produza e inspecione um piloto

> Prepare um piloto curto com a identidade e voz aprovadas. Mostre roteiro, cenas, entradas exatas e escopo de custo antes da geração.

O assistente escreve e dirige; ferramentas verificadas do Higgsfield geram a mídia. Inspecione o piloto completo e os bytes efetivamente exportados. Corrija falhas em novas versões. Amplie para lotes após a aprovação do piloto.

Siga [produção](production.md), [handoff do piloto](production-handoff.md) e [qualidade](quality.md). A publicação usa a autorização aplicável.

## Trabalhe com um personagem existente

> Prepare uma peça em [formato] para [personagem] sobre [tema], usando o cânone aprovado e a narrativa atual.

O assistente reutiliza decisões, idioma e referências aprovadas. Mudanças dentro da variação permitida mantêm a identidade; mudanças na identidade congelada exigem nova versão do cânone e aprovação. Use [operação dos workflows](framework-02.md) para retomar uma execução salva.

## Verifique os registros locais

Execute estes comandos na raiz do estúdio instalado:

```sh
node scripts/studio.mjs list
node scripts/studio.mjs validate
node scripts/studio.mjs help
npm run verify
```

Os comandos mantêm e verificam registros. Consulte [identidade e backups](operations.md) para arquivos, snapshots e recuperação. Se uma ferramenta estiver indisponível, mantenha a etapa afetada pendente e continue a preparação que não depende dela.
