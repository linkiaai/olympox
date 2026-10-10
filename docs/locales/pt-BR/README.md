# OLYMPOX - AI Influencer framework

OLYMPOX ajuda a desenvolver influenciadores originais de IA e manter sua identidade, história e registros de produção entre sessões. Codex ou Claude Code coordena o trabalho por meio de Atena e oito perfis especialistas. Higgsfield é o fluxo padrão de mídia.

O framework oferece skills locais, contratos de tarefas, workflows retomáveis, registros de personagens, snapshots do cânone, versões editoriais e backups. Funciona com **Node 22+**, sem dependências externas de execução.

## Instale um estúdio independente

Instale a versão candidata **0.6.0-rc.1** para testes:

```sh
npx --yes github:linkiaai/olympox#v0.6.0-rc.1 setup
```

A partir de checkout revisado ou pacote extraído, use `node bin/olympox.mjs setup`.

Escolha Codex, Claude Code ou ambos e um destino independente. O setup resume o plano de instalação e as quantidades a copiar/manter, instala instruções e skills para os assistentes escolhidos e verifica o estúdio local. Abra o destino no assistente e invoque `$olympox` no Codex ou `/olympox` no Claude Code.

Para instalação sem interação, forneça todas as escolhas obrigatórias:

```sh
node bin/olympox.mjs setup ../my-studio --assistant codex --yes
```

Use `--locale pt-BR` para mensagens do setup em português. No Windows, use `npm.cmd` se o PowerShell bloquear o inicializador do npm.

Consulte [instalação](installation.md) para seleção de fontes, conflitos de merge e preservação de um estúdio existente. Atualizar estes guias localmente não altera o pacote já publicado nem o manual hospedado.

Este repositório é o checkout de desenvolvimento do framework, usando AIOX para engenharia de software. As ferramentas e dependências do AIOX ficam fora do pacote do produto. Crie personagens pessoais e mídia no estúdio instalado separadamente.

A candidata acrescenta transferência local delimitada de imagens, verificações explícitas de cânone com/sem fala e prontidão de mídia por etapa. Comece pela preparação local; descoberta real no assistente e produção de mídia ainda precisam de testes no seu ambiente. Leia as [notas da versão e instruções de teste](release-notes.md) para conhecer os limites e relatar um problema reproduzível. A release histórica 0.5.0 permanece intacta.

## Crie seu primeiro personagem

No estúdio, diga:

> Use OLYMPOX para criar um influenciador original para [público/tema]. Proponha três conceitos diferentes e recomende um.

O assistente desenvolve conceito, persona, narrativa e roteiros. A sequência de produção é exploração visual, referências selecionadas, amostra vocal ouvida quando o personagem fala, aprovação do cânone exato e um piloto inspecionado antes dos lotes. Verifique acesso ao Higgsfield, referências aceitas, exportação e orçamento do piloto completo antes da produção paga. Imagens integradas ao assistente são uma alternativa explícita.

Comece pelo [início rápido](quick-start.md), depois siga [desenvolvimento de personagens](strategy.md) e [produção](production.md).

## Documentação

O [manual do framework](framework-manual.md) explica o produto e encaminha para o guia adequado. Para abrir o manual navegável localmente:

```sh
npm run docs:dev
```

O manual reúne inglês e português brasileiro, equipe, catálogos de workflows e contratos e sintaxe de comandos extraída da ajuda da CLI. Leia [manutenção do manual](living-documentation.md) para builds e exportações.

## Verifique e desenvolva

Na raiz do framework ou do estúdio instalado:

```sh
npm run verify
node scripts/studio.mjs help
```

`verify` gera o manual e executa testes, validação de registros, diagnóstico estrutural e verificações da documentação. Essas verificações demonstram consistência local; acesso ao provedor e qualidade de mídia exigem execução e inspeção próprias.

Colaboradores seguem [AGENTS.md](AGENTS.md), a [constituição](CONSTITUTION.md), [arquitetura](framework-architecture.md) e [localização](localization.md). Preserve trabalho não relacionado e histórico privado. A instalação copia arquivos reutilizáveis; não autentica provedores, gera mídia nem publica.

Distribuído sob a [licença MIT](../../../LICENSE).
