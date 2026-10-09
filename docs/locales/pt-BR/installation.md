# Instalar o OLYMPOX

**OLYMPOX - AI Influencer framework** instala um estúdio local reutilizável para Codex, Claude Code ou ambos. Cada usuário cria influenciadores originais e mantém registros privados nesse estúdio independente. O repositório de origem é dedicado ao desenvolvimento e à manutenção do framework. O pacote inclui fontes reutilizáveis e templates, sem fichas reais de personagens nem credenciais.

## Requisitos

- Node **22 ou posterior**, incluindo npm e npx.
- Codex ou Claude Code com acesso aos arquivos do estúdio e às ferramentas disponíveis na sessão real.
- Git ao clonar o repositório e acesso à revisão escolhida.
- Acesso verificado ao Higgsfield para o fluxo de mídia padrão. A preparação do fornecedor é separada da instalação.

O núcleo local não tem dependências externas de execução. Não é necessário `npm install` para operar seus registros. O assistente coordena descoberta, conceito, personalidade, narrativa, roteiros, planejamento e registros. O [método de influenciador no Higgsfield](higgsfield-influencer-method.md) executa a produção visual e audiovisual padrão pelas etapas verificadas. Geração de imagens pelo assistente é uma alternativa explícita, não um requisito para usar OLYMPOX com Claude Code. Recursos ausentes mantêm a etapa relevante pendente; não mudam silenciosamente o método. Geração paga exige autorização aplicável.

A versão **0.5.0** está disponível na [release `v0.5.0` do GitHub](https://github.com/linkiaai/olympox/releases/tag/v0.5.0). Instalações existentes da `v0.4.0` conservam seu fluxo histórico até atualização explícita.

## Preparação guiada

Execute o instalador guiado publicado:

```sh
npx --yes github:linkiaai/olympox#v0.5.0 setup
```

Da cópia revisada do framework ou pacote extraído, use `node bin/olympox.mjs setup`. `npx --yes` aceita a confirmação de pacote do npm; não responde ao guia OLYMPOX nem autoriza geração.

O guia usa a entrada de terminal nativa do Node, sem dependências adicionais. Pergunta idioma de apresentação (`en` ou `pt-BR`), assistente (`codex`, `claude` ou `both`) e diretório de estúdio independente fora da cópia de origem. Depois verifica origem e destino e mostra o plano real de instalação antes de pedir confirmação. O resumo identifica destino, assistente escolhido, idioma, modo de mesclagem e quantidades de arquivos a copiar ou manter, além das verificações locais previstas e acesso pendente ao fornecedor. Escolha cancelar ou pressione Ctrl+C antes da instalação para deixar o destino intacto.

O instalador confere novamente o plano revisado imediatamente antes da escrita. Se arquivos de origem ou destino previstos no plano, ou opções mudaram desde a revisão, recusa o plano desatualizado sem escrever. Execute novamente a preparação para atualizar o plano e revise o novo resumo antes de continuar. Conflitos exigem resolução explícita; a preparação não sobrescreve arquivos diferentes nem atualiza automaticamente estúdios personalizados.

Após instalar, a preparação executa estes scripts Node instalados, nesta ordem:

```sh
node scripts/docs.mjs build
node scripts/studio.mjs doctor
node scripts/studio.mjs validate
node scripts/docs.mjs check
```

Para na primeira falha e mantém os arquivos instalados para diagnóstico. Informa as verificações realmente executadas e seus resultados; depois fornece a sintaxe de ativação do assistente escolhido e um primeiro pedido conversacional. Essas verificações são menores que a suíte completa de testes. Execute `npm run verify` no estúdio instalado para a verificação local completa. Nenhuma dessas verificações comprova descoberta real das skills, conexão com Higgsfield, execução do fornecedor ou qualidade de mídia; acesso Higgsfield e etapas de mídia continuam pendentes até a conferência na sessão do assistente.

Você pode fornecer escolhas antecipadamente:

```sh
node bin/olympox.mjs setup ../my-studio --assistant both --locale pt-BR
```

`--locale` altera somente a apresentação da preparação. Não traduz skills canônicas, comandos ou registros instalados, escolhe idioma editorial da personagem nem autentica fornecedor. Consulte a [política de idiomas](localization.md).

Em terminal não interativo, a preparação exige `--yes`, diretório explícito e `--assistant`:

```sh
node bin/olympox.mjs setup ../my-studio --assistant claude --locale en --yes
```

`--yes` aceita o plano local de instalação e as verificações locais. Não autoriza geração de mídia, treinamento ou publicação, não ignora a verificação prévia nem implica `--merge`. Acrescente `--merge` somente quando necessário para o destino. Escolhas obrigatórias ausentes no modo não interativo produzem erro antes da instalação.

Em terminal interativo, executar `node bin/olympox.mjs` sem comando, ou `install` sem `--assistant` explícito, abre o mesmo guia. Em terminal não interativo, a ausência de argumentos mostra ajuda; `install` direto continua determinístico. Use o instalador explícito abaixo para scripts.

## Instalação direta

Da cópia do framework ou pacote extraído, escolha um destino independente:

```sh
node bin/olympox.mjs install ../my-studio --assistant both
cd ../my-studio
npm run verify
npm run studio -- help
```

`install` direto com `--assistant` explícito executa sem o guia. Suas opções existentes continuam `install [directory] [--merge] [--assistant codex|claude|both]`; `--locale` e `--yes` pertencem a `setup`. O destino padrão é `.` quando omitido. A instalação nova aceita diretório ausente ou vazio; um diretório `.git` existente pode ser mantido. Outros itens existentes exigem `--merge`. Use `npm.cmd` no Windows se o PowerShell bloquear o launcher normal.

| Seleção | Skills ativas | Instruções do projeto |
| --- | --- | --- |
| `--assistant codex` (padrão) | `.agents/skills/olympox` e `.agents/skills/higgsfield-studio` | `AGENTS.md` do estúdio |
| `--assistant claude` | `.claude/skills/olympox` e `.claude/skills/higgsfield-studio` | `AGENTS.md` do estúdio e um `CLAUDE.md` que o importa |
| `--assistant both` | Ambas as projeções | As mesmas instruções do estúdio e a ponte para Claude |

O padrão Codex conserva compatibilidade com comandos de instalação existentes. A seleção de assistente muda instruções locais e caminhos de descoberta de skills; não seleciona fornecedor de mídia. Ambos os hosts recebem os mesmos bytes canônicos de `SKILL.md`. Codex também recebe `agents/openai.yaml`; Claude Code dispensa esses metadados específicos do host. O diretório de skills do projeto no Claude e a importação `@AGENTS.md` seguem a [documentação oficial de skills](https://code.claude.com/docs/en/skills) e a [documentação de instruções do projeto](https://code.claude.com/docs/en/memory).

O instalador escreve instruções criativas de `templates/studio-AGENTS.md` e a ponte do Claude de `templates/studio-CLAUDE.md` quando selecionada. Nunca copia o `AGENTS.md` nem o `CLAUDE.md` da raiz de desenvolvimento para o estúdio. A instalação não instala plugins externos nem binários de fornecedores, autentica contas, gera mídia ou publica. `verify` compila o manual local e verifica comportamento e integridade locais.

Abra o estúdio instalado no assistente escolhido. No Codex, invoque `$olympox`; no Claude Code, invoque `/olympox`. Uma solicitação natural pode começar com:

```text
Ajude-me a criar um influenciador original para [público/tema].
Proponha três direções e recomende uma antes de explorar a identidade.
Use o fluxo de influenciador no Higgsfield e verifique primeiro suas etapas necessárias.
```

Recarregue ou reabra o projeto se o host não descobrir a skill. Claude Code pode inspecionar instruções carregadas pelos controles da sessão. Instalação de arquivos e verificação estrutural não demonstram descoberta real das skills. O destino de instalação para Claude Code não configura automaticamente Claude web, Cowork ou outro ambiente de assistente.

## Conectar Higgsfield no host escolhido

Siga [acesso ao Higgsfield](higgsfield-plugin.md) e [preparação da CLI local](higgsfield-setup.md). Verifique a rota real em cada host: uma conexão de plugin no Codex não estabelece a mesma conexão no Claude Code. Um plugin/MCP disponível ou CLI oficial é uma rota de acesso; precisa expor o módulo específico necessário, upload/entrada de referência, consulta de status e exportação. Instalar a skill não conecta o fornecedor nem demonstra equivalência entre módulos.

Antes de prometer o piloto, verifique acesso à conta, etapas e modelos solicitados, transporte de referências locais, exportação dos bytes reais, preços conhecidos e orçamento. O framework deve realizar a transferência de arquivos suportada por conta própria, usando ferramentas verificadas. Se a rota escolhida não executar uma etapa necessária, informe a lacuna exata e preserve a etapa pendente em vez de substituir silenciosamente por imagens do assistente ou outro fornecedor.

```text
Atena, verifique acesso ao Higgsfield nesta sessão e prepare o piloto completo.
Registre método exato, referências, custo conhecido e recursos pendentes.
```

Isso seleciona preparação, não geração paga, treinamento ou publicação. Aplique autorizações existentes sem solicitá-las novamente. Preserve canon, tentativas, custos e inspeção em cada rota de acesso. A instalação do núcleo e os registros locais continuam utilizáveis enquanto etapas de mídia aguardam acesso ao fornecedor.

## Mesclar em um projeto existente

```sh
node bin/olympox.mjs install ../existing-project --merge --assistant both
```

A mesclagem verifica todos os destinos pretendidos de todos os hosts selecionados antes de qualquer escrita. Arquivos idênticos são mantidos e ausentes são instalados. Diferenças ou colisões interrompem a operação sem sobrescrever. Arquivos locais não relacionados, metadados Git existentes e projeções de hosts não selecionados são preservados. O instalador rejeita caminhos inseguros, links simbólicos e junctions na origem e no destino.

Um `CLAUDE.md` ou skill personalizada gera conflito como qualquer arquivo diferente do framework. Reconcilie explicitamente ou instale em estúdio vazio separado e compare. `--merge` não é atualizador automático. Adicionar outro host a um estúdio idêntico é possível com `--merge --assistant both`; fontes modificadas existentes ainda fazem a verificação completa recusar escritas.

## Atualizar um estúdio existente

O novo método de mídia padrão aplica-se ao trabalho novo após atualização explícita do framework. Identidades aprovadas e evidências históricas são preservadas sem migração automática. Leia as [notas da versão](release-notes.md) e preserve o estúdio antes de comparar mudanças.

1. Crie e verifique backups de personagens privados e runs vinculadas pelas [operações de backup](operations.md). Guarde também cópia independente dos arquivos do framework, contexto compartilhado e instruções locais; backups de personagens excluem essa base.
2. Instale a revisão revisada em diretório vazio independente com o destino de assistente pretendido. Execute `npm run verify` e compare suas fontes reutilizáveis com o estúdio existente.
3. Reconcilie explicitamente as fontes pretendidas, skills ativas dos hosts, instruções do estúdio, templates e documentação. Preserve personalizações e mantenha cada cópia ativa consistente com a fonte canônica. `--merge` não realiza essa reconciliação.
4. Mantenha arquivos de personagens, mídia, aprovações, snapshots, runs e backups com bytes e hashes originais. Nunca reescreva bytes históricos para adequar a instruções novas ou passar verificações.
5. Execute `npm run verify` no estúdio atualizado e reabra o host escolhido para descoberta. Se governança, entradas ou fornecedor de mídia mudarem numa run retomada, use o procedimento existente de nova tentativa explícita com motivo. Consulte [operação do núcleo](framework-02.md).

A atualização não autentica fornecedores nem resolve submissões externas pendentes. Reconcilie trabalho incerto pelo job original antes de nova tentativa ou troca de ferramenta.

## Manter cópias ativas de skills

O instalador individual de skills aceita a mesma seleção de assistente:

```sh
node scripts/install-skill.mjs olympox --assistant both
node scripts/install-skill.mjs higgsfield-studio --assistant both
```

Ele instala somente arquivos canônicos registrados após verificar todos os hosts selecionados, mantendo idênticos e recusando conflitos. Não cria a ponte de instruções do Claude por conta própria; o instalador completo a fornece. Alterar a skill canônica exige reconciliação deliberada das cópias ativas diferentes.

## Desenvolver a partir de uma cópia da origem

```sh
git clone https://github.com/linkiaai/olympox.git
cd olympox
npm run verify
npm run studio -- help
```

Abra a origem no Codex ou Claude Code para manter o framework conforme o `AGENTS.md` da raiz; o `CLAUDE.md` da raiz importa essas instruções de desenvolvimento. Crie estúdio independente para trabalho real. Fixtures sintéticas demonstram comportamento local, não produção pessoal.

## Conteúdo do pacote e verificação

A exportação inclui governança reutilizável, fontes, perfis, contratos, fluxos, templates, testes, guias, fontes do manual, skills e proveniência permitida de fornecedores. Fichas de personagens, referências, mídia gerada, prompts, exportações, runs, manutenção, backups, instalações de fornecedores, contas, credenciais, estado local dos assistentes e manual gerado ficam no estúdio privado. Skills ativas são regeneradas de `skills/`, nunca copiadas de diretórios existentes de assistentes.

Da raiz do estúdio:

```sh
npm run verify
npm run studio -- doctor
npm run studio -- list
npm run docs:dev
```

`doctor` verifica projeções ativas do Codex, Claude Code ou ambos e a importação de instruções do Claude quando aplicável. Não testa descoberta no host, conexão com fornecedor, geração, referências realmente anexadas nem qualidade da mídia. Lista vazia de personagens é esperada num estúdio novo. `docs:dev` serve o manual local e não publica remotamente. Consulte [início rápido](quick-start.md), [operações](operations.md) e [capacidades](studio-status.md).

OLYMPOX é distribuído sob a [licença MIT](../LICENSE). Conteúdo de personagens, referências externas e serviços de fornecedores conservam seus termos e direitos aplicáveis.
