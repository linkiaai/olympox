# OLYMPOX - AI Influencer framework

Versão **0.5.0** — **9 de outubro de 2026**. Leia as [notas da versão](release-notes.md) e as [orientações de atualização](installation.md#atualizar-um-estudio-existente). A revisão de componente do núcleo/tarefas permanece 0.2.0; novos runs incluem política versionada de fornecedor de mídia.

OLYMPOX é um framework local para criar influenciadores de IA originais e memoráveis com potencial de viralização a ser testado, coordenado por Atena e uma equipe de especialistas com nomes de deusas. Codex ou Claude Code coordena assinatura visual, personalidade, público, conteúdo recorrente, voz e atuação do personagem. Cada influenciador tem identidade e histórico próprios; viralização é uma hipótese para testar, nunca um resultado prometido.

O pacote reutilizável contém governança, skills, perfis de especialistas, contratos de tarefas, fluxos, comandos locais, templates e um manual. A skill `olympox` organiza o trabalho criativo em um estúdio instalado. Cada usuário instala um estúdio independente e cria ali seus próprios influenciadores originais. Fichas de personagens, mídia, runs, backups, credenciais e binários opcionais de fornecedores ficam fora do pacote do framework.

Este repositório e seu projeto do assistente são dedicados ao desenvolvimento e à manutenção do framework. O `AGENTS.md` da raiz define as instruções de desenvolvimento. A instalação usa `templates/studio-AGENTS.md` para as instruções criativas do estúdio separado.

## Instalar seu estúdio

Requer **Node 22 ou posterior** e **Codex ou Claude Code**. Inicie a instalação guiada pela versão publicada:

```sh
npx --yes github:linkiaai/olympox#v0.5.0 setup
```

Da cópia revisada ou pacote extraído, use `node bin/olympox.mjs setup`.

O guia permite escolher Codex, Claude Code ou ambos, definir uma pasta independente para o estúdio e revisar destino resolvido e contagens reais de arquivos novos/idênticos antes de instalar. Depois gera o manual local e verifica instruções, skills e registros. Cancelar antes de instalar não cria arquivos; mudança no plano revisado é recusada antes de escrever. Inglês é o idioma padrão da apresentação, com `--locale pt-BR` disponível. O guia termina com invocação exata no host e primeiro pedido de prontidão do Higgsfield. Conexão do fornecedor e geração continuam separadas da instalação.

Para a suíte completa de testes do framework, execute `npm run verify` na **pasta do estúdio instalado** após a preparação.

Para scripts, use escolha explícita:

```sh
npx --yes github:linkiaai/olympox#v0.5.0 setup ../my-studio --assistant claude --yes
```

O primeiro `--yes` pertence ao npx e aceita sua confirmação de pacote. O `--yes` após `setup` pertence ao OLYMPOX e aceita seu plano de instalação revisado. Setup sem interação exige `--yes`, destino e `--assistant`. O comando direto `install` continua disponível com padrão compatível `codex`; `install` interativo sem assistente explícito abre o guia. Abra o estúdio instalado e invoque sua skill `olympox` descoberta (`$olympox` no Codex, `/olympox` no Claude Code). Claude Code importa instruções criativas por `CLAUDE.md` e descobre `.claude/skills/`; Codex usa `AGENTS.md` e `.agents/skills/`. Reinicie ou recarregue o host se necessário; instalação não comprova descoberta real na sessão. No Windows use `npm.cmd` se o PowerShell bloquear o inicializador. Instalações existentes da `v0.4.0` conservam seu método anterior até atualização explícita para `v0.5.0`.

Para um projeto existente, acrescente `--merge` ao comando de instalação. O instalador confere todos os destinos antes de escrever, mantém arquivos idênticos do framework e recusa arquivos diferentes ou colisões. Revise os conflitos antes de tentar novamente; arquivos locais não relacionados são preservados.

Para desenvolver ou inspecionar o código-fonte do framework:

```sh
git clone https://github.com/linkiaai/olympox.git
cd olympox
npm run verify
npm run studio -- help
```

Mantenha produção criativa em um estúdio instalado independente. A cópia do código-fonte é para desenvolvimento e manutenção do framework. O núcleo local não tem dependências externas de execução e não exige `npm install` para esses comandos. Consulte [instalação](installation.md) para o conteúdo do pacote, o comportamento de merge e a verificação.

**Atena** é a mestra e diretora do estúdio: você fala com ela, ou faz o pedido normalmente, e seu assistente organiza o trabalho. A [equipe](studio-team.md) reúne nove perfis femininos com nomes de deusas: Atena e oito especialistas, regidos pela [constituição](CONSTITUTION.md). O núcleo 0.2 salva tarefas e tentativas, indica a próxima responsável e detecta mudanças no contexto. Os perfis são instruções; delegações reais dependem das ferramentas disponíveis na sessão.

**Gaia** pesquisa oportunidades antes de explorar uma nova persona. **Aurora** pesquisa tendências e cria ideias de conteúdo para personagens existentes, incluindo formatos e áudio quando disponíveis. O [método de pesquisa](trend-research.md) exige fontes atuais e adaptações coerentes com cada personagem. Ambas atuam sob demanda.

## Começar na conversa

O [manual do framework](framework-manual.md) também está disponível em forma de site. Execute `npm.cmd run docs:dev` e abra o endereço mostrado no terminal. O site reúne visão geral, início rápido, equipe, fluxos, contratos, comandos e guias, e acompanha mudanças nas fontes enquanto o servidor estiver aberto. `npm.cmd run verify` também gera e verifica o manual. Leia [documentação viva](living-documentation.md) para funcionamento, limites e manutenção.

No projeto do assistente do estúdio instalado, você pode dizer:

> Vamos criar nossa primeira influencer. Quero explorar [tema/público/estilo]. Use o estúdio para propor três direções diferentes e recomendar a mais interessante.

Ou:

> Atena, use OLYMPOX. Quero criar uma persona com estas referências: [...]. Prepare a identidade e as primeiras imagens candidatas.

Para pesquisa:

> Atena, peça à Gaia três oportunidades de novas influencers para [mercado/canal], com fontes e uma recomendação.

> Atena, peça à Aurora tendências e ideias para [personagem], com formato, abertura, cenas e opções de áudio verificadas.

Para um personagem novo, Atena começa uma [conversa curta de onboarding](strategy.md), reaproveita suas respostas e propõe três conceitos distintos com uma recomendação. Escolha o objetivo, como entretenimento viral, apresentador recorrente ou personagem de marca, e o estilo desejado; “pode propor” é válido. O [brief](../../../templates/locales/pt-BR/brief.md) registra escolhas sem virar questionário obrigatório. A direção criativa padrão é realismo variado e memorável, com personalidade e presença fortes; outro estilo continua sendo sua escolha.

Desenvolva conceito, personalidade, narrativa, roteiros e planejamento com o assistente coordenador, Codex ou Claude Code. Higgsfield é o pipeline padrão de mídia para aparência, candidatas, referências, cenas, edições de imagem, voz, animação, vídeo e lip-sync. Siga o método observado na referência por módulos Higgsfield verificados, separando observações da fonte e adaptações atuais. Geração integrada de imagens do assistente é somente uma alternativa explícita; não a use automaticamente nem substitua silenciosamente uma etapa Higgsfield ausente. Cada módulo necessário exige acesso verificado, entradas exatas aceitas, custo conhecido ou incerteza autorizada, exportação e inspeção. Capacidade ausente mantém a etapa pendente. O núcleo local continua utilizável para preparação sem fornecedor conectado; a instalação nunca autentica nem gera. Siga o [pipeline de referência Higgsfield](higgsfield-influencer-method.md), [plugin](higgsfield-plugin.md) ou [preparação da CLI](higgsfield-setup.md). O [guia de imagens integradas](integrated-images.md) cobre a alternativa explícita.

## Método

Siga os [pontos de verificação do assistente ao Higgsfield](production-handoff.md): confira antecipadamente caminho e orçamento do piloto completo, prepare identidade/voz exatas, roteiros e imagens de cena inspecionadas; depois envie entradas suportadas a módulos Higgsfield verificados. Salve o [pacote de passagem](../../../templates/locales/pt-BR/video-handoff.md) com prontidão, responsável e entradas reais por cena. Reutilize IDs confirmados do fornecedor; verifique transferência automática suportada para originais locais antes de propor anexo manual. Um piloto inspecionado antecede lotes.

1. Onboarding curto, público/oportunidade e três conceitos de personagem distintos com aberturas recorrentes.
2. Escolha do conceito e registro do [plano de método de produção](../../../templates/locales/pt-BR/production-method.md), incluindo evidência da fonte, módulos, recursos, etapas e escopos de custo.
3. Exploração da identidade visual por módulos Higgsfield verificados seguindo o mapeamento salvo do método de referência, referências coerentes e cena expressiva que comunique a premissa. O usuário seleciona a candidata; anexe referências reais às gerações seguintes e inspecione anatomia, presença e continuidade entre ângulos/cenas. Para personagem com fala, prepare e revise amostra vocal durante o trabalho de rascunho/referência; depois aprove o cânone visual/vocal completo e exato antes da produção.
4. Desenvolvimento de roteiros com o assistente coordenador, depois cenas Higgsfield e um pequeno piloto com módulos verificados e orçamento limitado do piloto inteiro, usando identidade/voz aprovadas. Treinamento só é avaliado quando justificado.
5. Revisão completa da mídia e exportação dos bytes reais antes de ampliar para lotes de conteúdo.
6. Publicação com autorização aplicável, comparação de resultados reais em janelas adequadas e ajuste da hipótese sem descartar conceitos cedo demais.

Consulte [estratégia](strategy.md), [produção](production.md), [qualidade](quality.md) e [ferramentas](tools.md). A [análise da referência](video-reference.md) identifica o que foi consultado e o que adaptamos por decisão própria.

A [revisão e arquitetura do framework](framework-architecture.md) orienta a evolução. A base atual é o núcleo local 0.2: especialistas, contratos de tarefas, três fluxos retomáveis, histórico do cânone, execuções seladas, narrativa/conteúdo versionados e backup verificável. O [guia do núcleo](framework-02.md) explica o uso e seus limites.

## Operação local

Execute comandos de registros criativos a partir da raiz do seu estúdio instalado:

```powershell
npm.cmd run verify
node scripts/studio.mjs new my-persona
node scripts/studio.mjs list
node scripts/studio.mjs validate my-persona
```

Os comandos criam fichas, montam especificações de geração e verificam registros. Eles não chamam modelos, não aprovam mídia e não publicam. O assistente usa as ferramentas disponíveis para executar a parte criativa.

Leia [operação](operations.md) para referências, hashes e manifesto. Mídia, fichas, tarefas e backups ficam locais e ignorados pelo Git. Use `backup`, `backup-verify` e `backup-test` após ciclos importantes, e mantenha uma cópia dos backups em outro local. A skill de origem em `skills/` e sua instalação escolhida em `.agents/skills/` ou `.claude/skills/` devem continuar idênticas; `doctor` detecta divergência.

## Capacidades e limites

| Parte | Comportamento incluído |
| --- | --- |
| Instruções e skill do projeto | Governança e skills reutilizáveis instaladas no estúdio escolhido |
| Fichas, prompts e registros | Scripts e templates locais para seus próprios influenciadores |
| Coordenação e histórico 0.2 | Registry, contratos, tarefas retomáveis, snapshots e registros editoriais locais |
| Backup de personagens | Inventário de arquivos e tarefas vinculadas, verificação e teste de restauração |
| Imagens integradas do assistente | Alternativa explícita quando ferramentas de geração e inspeção estiverem disponíveis; sujeita aos limites da conta |
| Plugin ou CLI do Higgsfield | Pipeline padrão de mídia com módulos verificados do método da fonte, acesso à conta, transferência real de referências e custos conhecidos |
| Identidade e piloto | Sua própria exploração de candidatos, aprovação explícita do cânone e piloto inspecionado antes de lotes |

Os perfis são instruções, e os pacotes locais não despacham agentes. Os comandos mantêm registros e integridade; geração, inspeção, serviços pagos e publicação precisam das ferramentas e autorizações aplicáveis ao seu estúdio. Testes não demonstram identidade visual, qualidade de voz nem execução por um fornecedor. A disponibilidade do plugin por si só não demonstra voz, Soul ID, mídia para download, exportação nem cobrança equivalente à CLI. Consulte [estado do framework](studio-status.md), [plugin Higgsfield](higgsfield-plugin.md) e [preparação opcional da CLI](higgsfield-setup.md).

Distribuído sob a [licença MIT](../../../LICENSE).
