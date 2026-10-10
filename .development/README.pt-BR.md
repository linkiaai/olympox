# Desenvolvimento do OLYMPOX

Este repositório desenvolve o produto OLYMPOX. AIOX 5.4.1 fornece papéis de engenharia para o Codex; perfis e skills do OLYMPOX são artefatos do produto para estúdios independentes de influenciadores.

Use architect, dev, qa e devops no trabalho de software. Examine perfis do produto como requisitos do domínio, sem ativar o framework criativo aqui. Leia [padrões](coding-standards.pt-BR.md), [tecnologia](tech-stack.pt-BR.md) e [árvore de fontes](source-tree.pt-BR.md).

## Ferramentas locais

AIOX está fixado no pacote oficial `@aiox-squads/core@5.4.1`. Runtime e dependências ficam em `.aiox-core/`; papéis gerados do Codex ficam em `.codex/`, e a projeção de skills reconhecida no repositório é `.agents/skills/aiox-*`. O manifesto do produto continua sem dependências.

Execute `node .development/verify-aiox.mjs` para as ferramentas locais e `npm.cmd run verify` para o framework. Validação de arquivos não comprova descoberta pelo Codex nem execução de fornecedor remoto.

O marker explícito `.development/project.json` seleciona diagnósticos de desenvolvimento e impede comandos criativos e ativação pública de skills criativas antes de escrever. Os dois pontos de entrada usam o mesmo leitor estrito; markers malformados e caminhos de desenvolvimento ligados por links são recusados. A ajuda continua disponível somente para leitura. Estúdios instalados não têm o marker e mantêm verificações de skills e salvaguardas de produção. A API interna de instalação de skills permanece disponível para fixtures sintéticas e o instalador de destinos.

## Selecionar um papel de engenharia

No Codex, selecione a skill do repositório para a tarefa de engenharia atual:

- `$aiox-architect`: arquitetura e projeto; perfil `.aiox-core/development/agents/architect.md`.
- `$aiox-dev`: implementação; perfil `.aiox-core/development/agents/dev.md`.
- `$aiox-qa`: verificação e revisão; perfil `.aiox-core/development/agents/qa.md`.
- `$aiox-devops`: releases dentro da autorização do usuário; perfil `.aiox-core/development/agents/devops.md`.

Confirme que o host expõe a skill antes de afirmar ativação. Se a descoberta estiver indisponível, carregue explicitamente o perfil canônico correspondente como instruções para o assistente coordenador. Ler uma skill ou perfil não despacha um worker; relate delegação somente quando um subagente real tiver sido executado. Perfis criativos do OLYMPOX continuam sendo requisitos do produto para os estúdios de destino.

## Reinstalar as ferramentas fixadas com segurança

Execute o instalador oficial em uma cópia Git separada e revisada, para que ele não possa reescrever o `AGENTS.md` de engenharia ou o `package.json` do produto desta cópia:

```powershell
npx.cmd --yes --package @aiox-squads/core@5.4.1 aiox install --quiet --ide codex --merge
```

Revise e reconcilie somente `.aiox-core/` dessa instalação isolada, preservando configuração local, estado e mudanças não relacionadas. Não copie suas instruções da raiz, manifesto do produto ou outros arquivos do produto. Na cópia de engenharia, execute:

```powershell
node .development/repair-aiox-runtime.mjs
node .development/configure-aiox.mjs
node .development/verify-aiox.mjs
```

O reparo verifica o arquivo oficial, restaura os quatro arquivos de qualidade ausentes e instala dependências revisadas ausentes somente no pacote interno do AIOX. A configuração pré-verifica guias e fontes fixadas, aplica ajustes exclusivos do Codex, adapta metadados de contexto obrigatório e regenera as projeções do Codex e do repositório. A verificação do produto continua sendo `npm.cmd run verify`.

A adaptação de contexto parte de `data/agent-config-requirements.yaml` upstream, SHA-256 `68e87b5777d1872c4fed6644dd3c7e3c3e8fd590df7d2b58c36d541cf8e38dd3`, no arquivo fixado com integridade verificada. Substitui somente os caminhos exatos `docs/framework/{coding-standards,tech-stack,source-tree}.md`, incluindo referências compartilhadas/cache. Dev segue os três `devLoadAlwaysFiles` configurados, na ordem padrões, tecnologia e árvore de fontes; os outros papéis seguem `frameworkDocsLocation`. A configuração preserva caminhos alternativos contidos existentes. Os guias obrigatórios precisam ser arquivos não vazios, os caminhos ficam neste checkout, e links, alterações upstream/runtime desconhecidas e bytes conflitantes da adaptação são recusados antes de escrever a configuração. O loader e os 12 perfis canônicos continuam byte a byte iguais ao arquivo oficial.

Repetir a configuração reconhece a base oficial ou uma adaptação anterior verificada por proveniência e produz bytes adaptados estáveis. A base intacta e `.development/state/aiox-context-adaptation.json` registram versão, integridade/hash do arquivo, mapeamento exato, hashes de entrada/resultado e hashes preservados do loader/perfis. Com os caminhos padrão, os requisitos adaptados têm hash `381d85cc0504414bdf3edf709d7b6bc4910d769b461de796ef81ddafcc7d01dc`. Revise uma nova versão upstream antes de alterar essas fontes fixadas; não sobrescreva desvios desconhecidos.

`verify-aiox.mjs` inicia `verify-aiox-context.mjs` em um processo novo, ignora caches de conteúdo/definição e desliga gravações de desempenho. Carrega o contexto completo real dos 12 papéis, verifica identidades e compara o conteúdo de todos os requisitos não lazy aplicáveis com os bytes exatos das fontes. Uma matriz fixa independente exige os três guias de Dev, dois de PM, padrões de SM, tecnologia/árvore de Analyst e tecnologia/padrões de UX. Requisitos ausentes, vazios, ilegíveis ou removidos falham com evidência de papel/caminho; contexto intencionalmente lazy permanece ignorado conforme o loader upstream real.

Execute os testes isolados de regressão separadamente da suíte do produto para consumidores:

```powershell
node --test .development/aiox-context.test.mjs
node .development/verify-aiox-context.mjs
```

As fixtures usam o loader fixado real para demonstrar falhas de guias ausentes/vazios, caminhos alternativos configurados, idempotência, conflitos de fontes desconhecidas e recusa de caminhos/links. Neste host Windows gerenciado, criar junctions e reescrever projeções protegidas `.codex/`/`.agents/` exige a escalada normal da ferramenta; isso é um limite de permissões do filesystem, não motivo para omitir verificações. Um bootstrap limpo precisa executar a receita completa de instalador isolado/reparo/configuração/verificação e comparar instruções da raiz/manifesto do produto antes e depois; uma instalação primária existente não comprova reprodutibilidade.

Limites conhecidos da versão upstream 5.4.1: o verificador de consistência dos agentes relata 121 avisos de dependências/categorias e zero erros; seu loader converte os comandos agrupados de `ux-design-expert` em um array vazio, enquanto o perfil original e a skill projetada preservam esses comandos. Verificações locais das ferramentas não comprovam descoberta ou delegação real pelo host. A proveniência e as verificações locais do reparo estão em `.development/state/tooling-runtime-repair.json`.

## Distribuição

O `AGENTS.md` da raiz é política de engenharia e fica fora do pacote npm. Seu par é [AGENTS.pt-BR.md](AGENTS.pt-BR.md). As instruções instaladas em inglês e português vêm dos templates de estúdio. O instalador usa templates próprios do Git, nunca a configuração local de engenharia.

Não exporte `.development/`, `.aiox-core/`, `.codex/`, projeções de engenharia, dependências de ferramentas, stories, manutenção local ou credenciais. Quem instala OLYMPOX no Codex ou Claude Code não precisa de código ou dependências do AIOX.

A release pública 0.5.0 permanece um artefato imutável separado; mudanças de desenvolvimento não a republicam. Coordene sobreposições com o trabalho do manual de outras conversas.
