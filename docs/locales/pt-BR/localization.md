# Localização

Inglês (`en`) é canônico para fontes do framework, comandos, contratos, identificadores, mensagens padrão, templates, testes e skills ativas. Português brasileiro (`pt-BR`) é a tradução secundária da documentação e da apresentação.

Idioma da conversa e idioma editorial de um personagem são escolhas independentes do usuário.

## Organização das fontes

| Conteúdo | Fonte inglesa | Edição pt-BR |
| --- | --- | --- |
| Guias | `docs/*.md` | `docs/locales/pt-BR/*.md` |
| Documentos da raiz | Arquivos Markdown da raiz | Arquivos correspondentes em `docs/locales/pt-BR/` |
| READMEs do núcleo e manual | `framework/`, `docs-site/` | Subdiretórios correspondentes em `docs/locales/pt-BR/` |
| Interface e catálogos do manual | Fontes e `docs-site/locales/en.json` | `docs-site/locales/pt-BR.json` |
| Templates | `templates/` | `templates/locales/pt-BR/` |
| Skills | `skills/` | Cópias para leitura em `docs/locales/pt-BR/skills/` |
| Apresentação do setup | `scripts/onboarding-locales/en.json` | `scripts/onboarding-locales/pt-BR.json` |

O instalador projeta os bytes canônicos das skills em `.agents/skills/` para Codex ou `.claude/skills/` para Claude Code. Cópias traduzidas são material de leitura, não uma segunda instalação ativa. O `AGENTS.md` da raiz rege o desenvolvimento; estúdios instalados recebem o template criativo e sua cópia traduzida correspondente para leitura.

## O que muda ao escolher um idioma

O manual começa em inglês e oferece pt-BR pelo seletor ou por `?lang=pt-BR`. Uma escolha explícita pode persistir. As duas edições acompanham os builds portáteis.

```sh
node bin/olympox.mjs setup ../my-studio --assistant codex --locale pt-BR --yes
```

`setup --locale` traduz perguntas e resumos do setup. Não altera fontes canônicas instaladas, tokens persistidos nem idioma do personagem. `install` direto não tem opção `--locale`.

Traduza o texto explicativo mantendo sintaxe de comandos, campos JSON, estados, IDs de capacidades, caminhos e IDs de papéis em inglês. Preserve nomes próprios estabelecidos como Atena, Psiquê, Íris e Têmis. Não traduza nomes de arquivos de referência nem fontes importadas de fornecedores.

## Compatibilidade com registros históricos

Novos workflows usam `create-character`, `produce-piece` e `review-correct`. As entradas históricas `criar-personagem`, `produzir-peca` e `revisar-corrigir` continuam aceitas. Estados e decisões portugueses históricos são interpretados pela camada de compatibilidade.

Preserve bytes, idioma e hashes originais de personagens, aprovações, snapshots, selos, versões editoriais, execuções e backups existentes. Tradução não é aprovação de identidade nem migração. Edições de governança podem exigir revisão de contexto em uma execução antiga; siga o [procedimento de nova tentativa](framework-02.md) sem reescrever seu histórico.

## Checklist de contribuição

1. Atualize primeiro a fonte canônica inglesa e a edição pt-BR afetada na mesma tarefa.
2. Preserve os mesmos requisitos, limites, exemplos e autoridade nos dois idiomas.
3. Atualize títulos e traduções dos catálogos quando navegação ou contratos mudarem. Placeholders da interface devem corresponder.
4. Verifique links a partir da localização real de cada arquivo traduzido.
5. Gere o manual, inspecione as duas edições renderizadas e execute `npm run verify`.

Verificações de build e cobertura detectam fontes ausentes e catálogos divergentes. Não comprovam precisão da tradução; revise o significado além da estrutura. Consulte [manutenção do manual](living-documentation.md).
