# Comece pela conversa.

Abra seu [estúdio instalado independente](installation.md) no Codex. Diga a Atena o objetivo, o público e o resultado que você quer. Pode fazer o pedido normalmente, sem nome de agente, sintaxe especial ou formulário completo. Quando a direção estiver aberta, peça alternativas e uma recomendação. A cópia do código-fonte do framework é reservada para desenvolvimento e manutenção.

## Criar uma personagem

```text
Atena, proponha três direções originais para uma influencer de humor cotidiano,
voltada ao Brasil. Explique o público, a proposta editorial e sua recomendação.
```

Psiquê desenvolve a persona e Íris dirige os candidatos visuais. Gaia pesquisa oportunidades quando essa investigação ajudar a decisão. Você escolhe a identidade a partir de arquivos reais; o cânone aprovado preserva as referências exatas. Faça um piloto antes de lotes.

## Produzir para uma personagem existente

```text
Atena, prepare uma peça para [personagem], usando o cânone e a narrativa
aprovados. Quero um roteiro de [formato] sobre [tema], com cenas e legenda.
```

Saraswati escreve; Selene prepara e executa a produção disponível e autorizada; Têmis inspeciona a mídia completa. Aurora pesquisa tendências quando necessário. Fortuna prepara experimentos de distribuição e analisa dados próprios quando existirem.

## Escolher uma ferramenta de produção

A geração de imagens integrada do Codex é o padrão quando disponível, salvo se você escolher outro fornecedor. O acesso opcional ao Higgsfield pode usar o [plugin do Codex](higgsfield-plugin.md) ou a [CLI e wrapper locais](higgsfield-setup.md). O plugin precisa de instalação e conexão próprias no Codex, sem exigir a CLI local do Higgsfield. A instalação do OLYMPOX não fornece acesso à conta de nenhuma das rotas externas.

```text
Atena, use o Higgsfield pelo plugin para [personagem].
Confira as ferramentas disponíveis e prepare esta peça usando as referências aprovadas.
Mantenha os registros de execução e revisão no OLYMPOX.
```

Selene confere as capacidades e custos reais da rota escolhida antes da submissão autorizada. Ambas usam os mesmos registros de cânone e runs; a mídia final continua exigindo inspeção. Uma listagem do plugin não demonstra voz, Soul ID, download de mídia, exportação ou cobrança equivalente à CLI.

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

`new` cria um rascunho. Preencha a ficha e o brief antes de gerar referências. Esses comandos não produzem mídia nem aprovam identidade. Consulte [operação](operations.md) para registrar arquivos e [operar o núcleo](framework-02.md) para iniciar e retomar fluxos.

## O que informar na passagem

Informe personagem, versão do cânone, arquivos de entrada, objetivo, canal e entrega esperada. Uma pendência de ferramenta, decisão ou revisão deve permanecer visível. Autorizações já dadas continuam válidas; a equipe registra apenas o trabalho realmente executado.
