# OLYMPOX - AI Influencer framework

OLYMPOX é um framework local de influenciadores de IA coordenado por Atena e uma equipe de especialistas com nomes de deusas. O Codex o utiliza para criar e dirigir influenciadores virtuais originais por meio de estratégia, persona, referências, fotografia, roteiros, voz, vídeo e revisão de qualidade. Cada influenciador tem identidade e histórico próprios.

O pacote reutilizável contém governança, skills, perfis de especialistas, contratos de tarefas, fluxos, comandos locais, templates e um manual bilíngue. A skill `olympox` organiza o trabalho criativo em um estúdio instalado. Cada usuário instala um estúdio independente e cria ali seus próprios influenciadores originais. Fichas de personagens, mídia, runs, backups, credenciais e binários opcionais de fornecedores ficam fora do pacote do framework.

Este repositório e seu projeto do Codex são dedicados ao desenvolvimento e à manutenção do framework. O `AGENTS.md` da raiz define as instruções de desenvolvimento. A instalação usa `templates/studio-AGENTS.md` para as instruções criativas do estúdio separado.

O inglês é o idioma principal da documentação, dos comandos, do desenvolvimento e dos registros compartilhados do framework. Esta versão em português do Brasil é uma tradução secundária. Consulte a [política de idiomas](localization.md) e a [versão principal em inglês](../../../README.md).

## Instalar seu estúdio

Requer **Node 22 ou posterior** e **Codex**. Instale pelo GitHub:

```sh
npx --yes github:linkiaai/olympox install ./my-studio
cd my-studio
npm run verify
npm run studio -- help
```

No Windows, use `npx.cmd` e `npm.cmd` se o PowerShell bloquear os inicializadores. Abra `my-studio` no Codex e use `$olympox`. Recarregue o Codex se a nova skill não for descoberta; a instalação por si só não demonstra que a sessão atual a carregou.

Para um projeto existente, acrescente `--merge` ao comando de instalação. O instalador confere todos os destinos antes de escrever, mantém arquivos idênticos do framework e recusa arquivos diferentes ou colisões. Revise os conflitos antes de tentar novamente; arquivos locais não relacionados são preservados.

Para desenvolver ou inspecionar o código-fonte do framework:

```sh
git clone https://github.com/linkiaai/olympox.git
cd olympox
npm run verify
npm run studio -- help
```

Mantenha produção criativa em um estúdio instalado independente. A cópia do código-fonte é para desenvolvimento e manutenção do framework. O núcleo local não tem dependências externas de execução e não exige `npm install` para esses comandos. Consulte [instalação](installation.md) para o conteúdo do pacote, o comportamento de merge e a verificação.

**Atena** é a mestra e diretora do estúdio: você fala com ela, ou faz o pedido normalmente, e o Codex organiza o trabalho. A [equipe](studio-team.md) reúne nove perfis femininos com nomes de deusas: Atena e oito especialistas, regidos pela [constituição](CONSTITUTION.md). O núcleo 0.2 salva tarefas e tentativas, indica a próxima responsável e detecta mudanças no contexto. Os perfis são instruções; delegações reais dependem das ferramentas disponíveis na sessão.

**Gaia** pesquisa oportunidades antes de explorar uma nova persona. **Aurora** pesquisa tendências e cria ideias de conteúdo para personagens existentes, incluindo formatos e áudio quando disponíveis. O [método de pesquisa](trend-research.md) exige fontes atuais e adaptações coerentes com cada personagem. Ambas atuam sob demanda.

## Começar na conversa

O [manual do framework](framework-manual.md) também está disponível em forma de site. Execute `npm.cmd run docs:dev` e abra o endereço mostrado no terminal. O site reúne visão geral, início rápido, equipe, fluxos, contratos, comandos e guias, e acompanha mudanças nas fontes enquanto o servidor estiver aberto. `npm.cmd run verify` também gera e verifica o manual. Leia [documentação viva](living-documentation.md) para funcionamento, limites e manutenção.

No projeto do Codex do estúdio instalado, você pode dizer:

> Vamos criar nossa primeira influencer. Quero explorar [tema/público/estilo]. Use o estúdio para propor três direções diferentes e recomendar a mais interessante.

Ou:

> Use $olympox. Quero criar uma persona com estas referências: [...]. Prepare a identidade e as primeiras imagens candidatas.

Para pesquisa:

> Atena, peça à Gaia três oportunidades de novas influencers para [mercado/canal], com fontes e uma recomendação.

> Atena, peça à Aurora tendências e ideias para [personagem], com formato, abertura, cenas e opções de áudio verificadas.

Se ainda não houver preferências, o Codex propõe caminhos. O [brief](../../../templates/locales/pt-BR/brief.md) ajuda a organizar escolhas e aceita “pode propor”. Não é necessário preencher todos os campos antes de conversar.

## Método

1. Proposta de valor, público, personalidade e voz.
2. Candidatos visuais e conjunto de referências da mesma pessoa.
3. Escolha e aprovação da identidade; registro das âncoras e arquivos.
4. Piloto de cenas, expressões e, quando necessário, fala/movimento.
5. Conteúdo, produção por peça e inspeção do resultado final.
6. Publicação autorizada, coleta de resultados e ajustes com evidência.

Consulte [estratégia](strategy.md), [produção](production.md), [qualidade](quality.md) e [ferramentas](tools.md). A [análise da referência](video-reference.md) identifica o que foi consultado e o que adaptamos por decisão própria.

A [revisão e arquitetura do framework](framework-architecture.md) orienta a evolução inspirada no AIOX. A base atual é o núcleo local 0.2: especialistas, contratos de tarefas, três fluxos retomáveis, histórico do cânone, execuções seladas, narrativa/conteúdo versionados e backup verificável. O [guia do núcleo](framework-02.md) explica o uso e seus limites.

## Operação local

Execute comandos de registros criativos a partir da raiz do seu estúdio instalado:

```powershell
npm.cmd run verify
node scripts/studio.mjs new my-persona
node scripts/studio.mjs list
node scripts/studio.mjs validate my-persona
```

Os comandos criam fichas, montam especificações de geração e verificam registros. Eles não chamam modelos, não aprovam mídia e não publicam. O Codex usa as ferramentas disponíveis para executar a parte criativa.

Leia [operação](operations.md) para referências, hashes e manifesto. Mídia, fichas, tarefas e backups ficam locais e ignorados pelo Git. Use `backup`, `backup-verify` e `backup-test` após ciclos importantes, e mantenha uma cópia dos backups em outro local. A skill original em `skills/` e sua instalação em `.agents/skills/` devem permanecer iguais; `doctor` detecta divergência.

## Capacidades e limites

| Parte | Comportamento incluído |
| --- | --- |
| Instruções e skill do projeto | Governança e skills reutilizáveis instaladas no estúdio escolhido |
| Fichas, prompts e registros | Scripts e templates locais para seus próprios influenciadores |
| Coordenação e histórico 0.2 | Registry, contratos, tarefas retomáveis, snapshots e registros editoriais locais |
| Backup de personagens | Inventário de arquivos e tarefas vinculadas, verificação e teste de restauração |
| Imagem integrada | Disponível somente quando a sessão do Codex oferece ferramentas de geração e inspeção |
| Higgsfield para vídeo/voz | Skill opcional, wrapper e guia; instale e conecte o fornecedor separadamente |
| Identidade e piloto | Sua própria exploração de candidatos, aprovação explícita do cânone e piloto inspecionado antes de lotes |

Os perfis são instruções, e os pacotes locais não despacham agentes. Os comandos mantêm registros e integridade; geração, inspeção, serviços pagos e publicação precisam das ferramentas e autorizações aplicáveis ao seu estúdio. Testes não demonstram identidade visual, qualidade de voz nem execução por um fornecedor. Consulte [estado do framework](studio-status.md) e [preparação opcional do Higgsfield](higgsfield-setup.md).

Distribuído sob a [licença MIT](../../../LICENSE).


> Tradução secundária em português do Brasil. A base canônica, os comandos e os tokens do framework são em inglês. Valores históricos em português continuam compatíveis; essa compatibilidade não reescreve fichas, runs, snapshots, hashes ou aprovações anteriores. O idioma editorial das personagens permanece independente. Consulte a [política de idiomas](localization.md).
