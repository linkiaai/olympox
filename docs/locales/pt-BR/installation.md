# Instalar e atualizar o OLYMPOX

Instale **OLYMPOX - AI Influencer framework** em um estúdio independente para Codex, Claude Code ou ambos. A cópia de desenvolvimento mantém fontes reutilizáveis; o estúdio guarda seus personagens, mídias, runs e backups.

## Requisitos e escolha da origem

- **Node 22 ou posterior**, com npm.
- **Codex ou Claude Code** com leitura e escrita nos arquivos do estúdio.
- Uma cópia revisada do framework ou pacote extraído. Git e acesso ao repositório são necessários para obter a origem pelo GitHub.

O núcleo local não tem dependências externas de execução; os comandos dispensam `npm install`. Escolha Higgsfield ou OpenRouter explicitamente e prepare seu acesso separadamente. É possível instalar, planejar personagens e manter registros antes de conectar um fornecedor.

Este guia descreve a versão estável **0.7.0**. Instale sua tag com `npx --yes github:linkiaai/olympox#v0.7.0 setup`. Use os comandos locais abaixo para uma cópia revisada ou um pacote extraído. Uma edição local posterior não atualiza uma tag publicada nem o manual hospedado. As tags históricas permanecem intactas. Consulte [notas da versão e limites de validação](release-notes.md).

## Preparação guiada

Da cópia do framework ou pacote extraído:

```sh
node bin/olympox.mjs setup
```

O guia pergunta idioma da apresentação (`en` ou `pt-BR`), assistente (`codex`, `claude` ou `both`), fornecedor (`higgsfield` ou `openrouter`) e diretório fora da origem. Nenhum fornecedor vem pré-selecionado; resposta vazia repete a pergunta. Confere todos os arquivos de origem e destino selecionados, depois apresenta destino resolvido, escolhas explícitas, quantidades a copiar/manter e verificações previstas. Cancelamento, EOF ou Ctrl+C antes de instalar deixam o destino intacto.

Para fornecer escolhas antecipadamente:

```sh
node bin/olympox.mjs setup ../my-studio --assistant both --provider higgsfield --locale pt-BR
```

Em terminal não interativo, informe diretório explícito, assistente, `--provider higgsfield|openrouter` e `--yes`:

```sh
node bin/olympox.mjs setup ../my-studio --assistant claude --provider openrouter --locale en --yes
```

`--yes` aceita instalação local, a escolha explícita fornecida de fornecedor e verificação. Exige `--provider`; nenhum fornecedor é deduzido. Não implica `--merge` nem autoriza autenticação, uploads, geração, treinamento ou publicação. Ao usar npx, seu `--yes` aceita a confirmação de pacote do npm; o `--yes` do OLYMPOX vem depois de `setup` e tem finalidade própria. `--locale` muda somente a apresentação do setup; instruções, skills, comandos e identificadores canônicos instalados continuam em inglês.

O setup salva a escolha privadamente em `work/provider-choice.json`. Higgsfield seleciona rotas de `image`, `video` e `audio`; OpenRouter seleciona somente `video`, deixando imagem e áudio independente como `null`. Isso descreve rotas pretendidas, não acesso verificado à conta nem operações disponíveis. A CLI usa o mapa explícito salvo para runs novos, salvo quando o run fornece seu próprio mapa. Sem escolha, descoberta e preparação locais continuam disponíveis e a geração fica pendente. Nenhuma rota usa fallback automático. No merge, escolha salva idêntica é mantida e uma diferente é recusada antes de escrever o framework; revise uma decisão explícita de nova tentativa em vez de sobrescrever o histórico.

O plano é conferido novamente antes da escrita. Mudanças em origens, destinos ou opções previstas interrompem a instalação; revise um plano novo antes de tentar novamente. Após instalar, o setup executa estes scripts instalados, nesta ordem:

```sh
node scripts/docs.mjs build
node scripts/studio.mjs doctor
node scripts/studio.mjs validate
node scripts/docs.mjs check
```

Para na primeira falha e preserva os arquivos instalados para diagnóstico. Verifica manual, base, skills e registros, mas não executa a suíte completa. No estúdio instalado, conclua com `npm run verify`. No Windows, use `npm.cmd` ou `npx.cmd` se o PowerShell bloquear o launcher normal.

## Instalação direta

Use seleção explícita de assistente para instalação previsível em scripts:

```sh
node bin/olympox.mjs install ../my-studio --assistant both
cd ../my-studio
npm run verify
```

Sintaxe: `install [directory] [--merge] [--assistant codex|claude|both]`. A instalação direta usa `codex` e diretório `.` por padrão e pode permanecer offline sem escolher fornecedor de mídia. Escolha um destino independente explicitamente. A instalação nova aceita diretório ausente ou vazio, incluindo metadados `.git` existentes permitidos; outros conteúdos exigem `--merge`. O instalador de baixo nível é `node scripts/install-framework.mjs` com as mesmas opções.

Em terminal interativo, ausência de comando ou `install` sem `--assistant` explícito abre o guia. Sem argumentos em terminal não interativo, a entrada mostra ajuda. `--provider`, `--locale` e `--yes` pertencem a `setup`, não a `install` direto.

| Assistente | Diretório de skills ativas | Instruções do projeto | Invocação |
| --- | --- | --- | --- |
| `codex` | `.agents/skills/` | `AGENTS.md` criativo | `$olympox` |
| `claude` | `.claude/skills/` | `AGENTS.md` criativo, importado por `CLAUDE.md` | `/olympox` |
| `both` | Ambos os diretórios | Ambas as entradas de instrução | Sintaxe do host acima |

Ambos recebem `olympox` e `higgsfield-studio` das mesmas fontes canônicas. Codex também recebe metadados `agents/openai.yaml`. O instalador escreve instruções de `templates/studio-AGENTS.md` e, quando selecionado, `templates/studio-CLAUDE.md`; não copia instruções de desenvolvimento para o estúdio.

Abra o diretório instalado no assistente selecionado e invoque a skill. Recarregue ou reabra o projeto se a descoberta estiver pendente. Um primeiro pedido útil é:

```text
Atena, ajude-me a criar um influenciador original para [público/tema].
Proponha três direções e recomende uma.
Confirme minha escolha explícita por Higgsfield ou OpenRouter e confira primeiro o caminho completo do piloto, referências, exportação e orçamento.
```

Arquivos instalados e verificações locais aprovadas não demonstram descoberta real das skills. O destino Claude configura arquivos locais do projeto no Claude Code, não Claude web nem outros ambientes.

Consulte as [evidências de validação e relatos por versão](release-notes.md) para as verificações locais exatas. Instalação de arquivos e escolha de fornecedor não comprovam descoberta real das skills no assistente, acesso à conta nem piloto completo de mídia no Codex/Claude. Node 22 e outros sistemas operacionais ainda precisam de execução onde ela não foi relatada. Preserve erros reais e detalhes do ambiente ao relatar uma falha.

## Mesclar em um projeto existente

```sh
node bin/olympox.mjs install ../existing-project --merge --assistant both
```

A mesclagem pré-verifica todos os arquivos pretendidos nos assistentes selecionados antes de escrever. Mantém arquivos idênticos, acrescenta ausentes e recusa diferenças ou colisões entre arquivos/diretórios. Preserva arquivos locais não relacionados, metadados Git permitidos e projeções de assistentes não selecionadas. Rejeita caminhos inseguros, links e junctions nos caminhos verificados de origem e destino.

**`--merge` não é atualizador automático.** Uma instrução ou skill ativa personalizada causa conflito. Revise e reconcilie explicitamente. É possível acrescentar outro assistente a uma instalação idêntica com `--merge --assistant both`; arquivos diferentes ainda bloqueiam toda a verificação prévia.

## Atualizar um estúdio existente

Leia as [notas das versões](release-notes.md), depois compare uma instalação limpa da revisão desejada com o estúdio existente.

1. Interrompa escritas concorrentes e preserve o estúdio atual. Crie, verifique e teste restauração dos [backups de personagens](operations.md#backups-e-recuperacao). Eles exigem registros estruturalmente válidos; se a validação falhar, preserve uma cópia independente com os bytes originais antes de diagnosticar, em vez de mudar o histórico para passar. Preserve separadamente contexto compartilhado, arquivos do framework e instruções personalizadas.
2. Instale a revisão examinada em outro diretório vazio com o assistente desejado. Execute `npm run verify` ali.
3. Compare e reconcilie explicitamente fontes reutilizáveis, skills, templates, instruções e guias pretendidos. Preserve personalizações e mantenha skills ativas consistentes com suas fontes canônicas. Confira mudanças concorrentes novamente antes de escrever.
4. Verifique que registros privados, mídia, aprovações, snapshots, runs e backups conservam bytes e hashes originais.
5. Execute `npm run verify` no estúdio atualizado e reabra o assistente. Para retomar um run com mudanças em entradas observadas, canon ou governança, use [nova tentativa explícita](framework-02.md#retomar-trabalho-e-revisar-mudancas-de-contexto). Mudar fornecedor também exige nova tentativa e motivo.

A atualização não migra identidades aprovadas nem resolve jobs. Reconcilie submissões externas pela rota original antes de outra tentativa. Tentativas anteriores e seus contratos salvos ficam preservados.

## Manter skills e acesso ao fornecedor

O instalador individual seleciona skills registradas e assistentes:

```sh
node scripts/install-skill.mjs olympox --assistant both
node scripts/install-skill.mjs higgsfield-studio --assistant both
```

Pré-verifica todos os arquivos selecionados, mantém cópias idênticas e recusa diferenças. Não cria a ponte de instruções Claude sozinho. Revise cópias ativas alteradas durante uma atualização explícita; o instalador não as sobrescreve.

Execute esses comandos em um estúdio instalado independente. Um checkout marcado por `.development/project.json` como `framework-development` recusa a ativação de skills criativas antes de escrever; marcadores inválidos ou ligados por links também falham. A ajuda do CLI continua disponível somente para leitura. A engenharia do produto usa AIOX no checkout de desenvolvimento.

Conecte Higgsfield na sessão real do assistente pela [rota de plugin](higgsfield-plugin.md) ou [CLI local](higgsfield-setup.md). Confira cada módulo necessário, referências aceitas, submissão/consulta, exportação, inspeção, custo conhecido e autorização aplicável. Acesso em um assistente não comprova acesso em outro. Etapas ausentes ficam pendentes; método alternativo exige decisão explícita. Instalar não autentica, instala binários de fornecedores, gera, treina ou publica.

## Limites do pacote e verificações locais

A instalação seleciona governança reutilizável, código, skills, perfis, contratos, fluxos, templates, testes, guias, fontes do manual e proveniência permitida de fornecedores. Exclui personagens privados, mídia gerada, runs, manutenção, backups, credenciais, instalações de fornecedores e manual gerado. Skills ativas são projetadas de `skills/`.

No estúdio instalado:

```sh
npm run studio -- help
npm run studio -- doctor
npm run studio -- list
npm run docs:dev
```

Uma lista vazia de personagens é esperada numa instalação nova. `doctor` verifica base local e consistência das skills; o servidor de desenvolvimento disponibiliza o manual localmente. Nenhuma operação comprova execução do fornecedor, fidelidade da mídia ou publicação. Continue com [início rápido](quick-start.md), [operações](operations.md) e [capacidades](studio-status.md).
