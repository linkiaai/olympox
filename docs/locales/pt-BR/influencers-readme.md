# Registros de personagens

Em um estúdio instalado, crie a pasta de um personagem com:

```sh
node scripts/studio.mjs new <slug>
```

O comando cria `persona.json` em rascunho, `brief.md`, `decisions.md`, `assets.json` e pastas para referências, mídia, prompts e exportações. O catálogo lê essas pastas diretamente. Templates são estruturas iniciais; leia o registro e as decisões reais para conhecer o estado atual do personagem.

Mantenha personagens pessoais em estúdios instalados independentemente. Este checkout de desenvolvimento distribui apenas este guia.

Arquivos e mídia de personagens são ignorados pelo Git por padrão. Use os [procedimentos de backup](operations.md) e mantenha uma cópia independente fora do disco de trabalho. Idioma e voz são escolhidos para o público do personagem; arquivos históricos preservam bytes e histórico originais.
