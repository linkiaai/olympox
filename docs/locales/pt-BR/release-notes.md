# Notas das versões

Estas notas explicam comportamento por versão. Os guias atuais descrevem a versão estável 0.6.0. Padrões históricos abaixo pertencem às suas revisões e não substituem a orientação atual. Leia [instalação e atualização](installation.md) antes de mudar um estúdio existente.

## 0.6.0 — 15 de outubro de 2026

A versão 0.6.0 promove o framework local revisado à linha estável. Higgsfield permanece o pipeline padrão de mídia; imagens integradas ao assistente continuam alternativa explícita para etapas de imagem. O executor BytePlus, conector de credenciais, preferência salva de provedor e escolha de provedor no onboarding ficam excluídos. Tags e arquivos históricos, incluindo rc.1–rc.4 e 0.5.0, permanecem intactos.

### Comportamento incluído

- **Estúdios independentes offline:** o setup guiado escolhe assistente e destino, revisa o plano de cópia/manutenção e executa verificações locais. Projeções de skills para ambos os assistentes e merge com recusa de conflitos preservam arquivos não relacionados e metadados Git permitidos. Instalar nunca conecta provedor, solicita chave de provedor, gera mídia nem publica.
- **Referências exatas e identidade preservada:** a transferência delimitada de imagens no Windows x64 usa a CLI Higgsfield opcional fixada, autorização de bytes/destino exatos e intenção recuperável. Confirmação nativa ainda exige verificações separadas de bytes no provedor e acesso pelo plugin/módulo. Seleção visual, seleção vocal ouvida quando há fala, aprovação completa do cânone, snapshots imutáveis, piloto revisado e exportação de bytes reais continuam parte do método de produção.
- **Correções de prontidão vocal:** cobertura vocal obrigatória permanece pendente quando suas etapas de apoio são apenas de imagem. Ela precisa de etapa de áudio ou vídeo; um run de áudio não pode marcar voz como `not-required`, inclusive com canon legado aprovado. A compatibilidade com imagem estática e vídeo silencioso explícito continua preservada, sem reescrever registros históricos.
- **Correções documentais:** a referência de contratos lista `readinessPlanPath` opcional; tabelas de transições e prontidão preservam todos os valores permitidos na renderização. Os guias em inglês e pt-BR explicam o mesmo limite vocal.

### Validação e limites restantes

A revisão de 15 de outubro anterior à promoção estável aprovou `npm.cmd run verify` com 248 testes, sem falhas ou skips, além de validação, doctor e verificações do manual no Windows com Node 24.18.0. Verificações independentes de instalação derivada do arquivo cobriram projeções dos dois assistentes, preservação e recusa de conflitos; 32 testes de prontidão no estúdio instalado passaram. Os 25 pares de guias foram auditados, incluindo 346 destinos locais e 28 âncoras, e o manual local foi inspecionado em inglês e pt-BR. São verificações locais com registros sintéticos, não um piloto real de mídia.

A revisão inicial encontrou três falhas `EPERM` no rename de diretório em `createPersona` no Windows. A base inalterada passou nos sete testes afetados em OS TEMP independente, e a revisão completa final passou em 248/248. A causa da condição intermitente continua não confirmada; não foi introduzida correção de armazenamento nem repetição automática. Preserve o erro original e o ambiente ao relatar.

Autenticação real do provedor, disponibilidade de módulos/modelos, entradas de referência aceitas, continuidade vocal verificada por escuta, vídeo completo com fala, lip-sync, faturamento e fidelidade de exportação ainda exigem piloto inspecionado em estúdio independente. Execução no Node 22, outros sistemas operacionais e descoberta real de skills no assistente continuam verificações de aceitação separadas. Atualizar estas fontes ou publicar uma release no GitHub não implanta o manual hospedado.

Instale com `npx --yes github:linkiaai/olympox#v0.6.0 setup`. Estúdios existentes usam o [procedimento de atualização com preservação](installation.md#atualizar-um-estudio-existente); merge não atualiza nem desinstala automaticamente. Relate problemas reproduzíveis por [issues no GitHub](https://github.com/linkiaai/olympox/issues), incluindo versão `0.6.0` do framework, sistema operacional, versões do Node e assistente, comando/pedido, resultado esperado e erro real sanitizado. Mantenha credenciais, identificadores de conta e registros criativos privados fora dos relatos.

## 0.6.0-rc.4 — 13 de outubro de 2026

O executor opcional BytePlus, o conector protegido de credenciais, a preferência salva de provedor e a escolha de provedor no onboarding foram retirados a pedido do usuário. O setup volta a escolher apenas o assistente e o estúdio independente. Higgsfield permanece o pipeline padrão; imagens integradas ao assistente continuam uma alternativa explícita. Nenhum provedor substituto foi conectado.

Cânone dos personagens, mídia, runs, jobs de provedor, configurações do estúdio e cofres externos de credenciais existentes são preservados. Tags e arquivos publicados rc.2/rc.3 permanecem como artefatos históricos; essas releases ainda contêm o recurso retirado. Seus guias e comandos de provedor pertencem às respectivas fontes da tag, não a esta release. A correção geral de remoção dos listeners do terminal foi mantida.

Instale em um estúdio independente novo com `npx --yes github:linkiaai/olympox#v0.6.0-rc.4 setup`. Estúdios existentes exigem o [procedimento de atualização com preservação](installation.md#atualizar-um-estudio-existente); merge não atualiza nem desinstala automaticamente. Esta release não apaga jobs históricos de provedor, configurações nem cofres externos de credenciais, e não autentica nem conecta um provedor substituto.

## 0.6.0-rc.3 — 13 de outubro de 2026

Esta candidata experimental acrescenta escolha guiada de provedor e configuração privada de credenciais BytePlus ao onboarding de estúdios independentes. Cada consumidor usa sua própria conta. Tag e arquivo históricos rc.2 e release estável 0.5.0 permanecem intactos.

### O que mudou

- **Escolha de provedor no setup:** escolha Higgsfield (padrão) ou BytePlus (experimental), ou informe `--provider higgsfield|byteplus`. Runs novos respeitam a preferência salva antes de overrides explícitos por mídia. Tentativas existentes conservam escolhas capturadas, identidade, cânone, aprovações e histórico. Setup não interativo preserva escolha salva ou usa Higgsfield.
- **Configurar agora ou depois:** após verificações offline bem-sucedidas, o setup BytePlus oferece colagem protegida da chave de API. O comando separado `node scripts/provider-connect.mjs byteplus` permite conectar depois. Login no console serve para criar/copiar a chave; não há fluxo OAuth de inferência implementado. Instalar nunca autentica, submete geração paga ou publica.
- **Credenciais próprias protegidas:** Windows CurrentUser DPAPI guarda versões criptografadas por estúdio/mídia fora do estúdio. Entrada oculta evita eco no terminal; chaves não entram em registros, argumentos ou backups do estúdio. Credenciais Speech opcionais são separadas. Outros sistemas usam entrada protegida em memória por operação, sem persistência em texto puro. Overrides pelo ambiente continuam suportados.
- **Recuperação de jobs originais:** jobs em fila podem selecionar individualmente sua versão original da credencial protegida. Ajuda, status local e exportações já preparadas evitam leituras desnecessárias de segredos. Configurar não comprova acesso à conta/modelos, elegibilidade de referências ou cobrança e não autoriza gastos.

### Testar a candidata

Instale em diretório independente novo e responda à pergunta de provedor:

```sh
npx --yes github:linkiaai/olympox#v0.6.0-rc.3 setup
```

Use `--locale pt-BR` para mensagens em português. Siga [instalação e atualização](installation.md) e conexão privada (guia histórico na tag da respectiva release). Execute `npm run verify` no estúdio instalado; Windows pode usar `npm.cmd` ou `npx.cmd`. Mantenha chaves fora de conversas e relatos sanitizados de problemas.

### Verificação e limites experimentais

Verificações sintéticas cobrem precedência, preservação de tentativas originais, entrada protegida, histórico DPAPI no Windows, recuperação de credenciais, inspeção offline, privacidade do pacote, instalação nova e recusa de conflitos. Aceitação nativa no terminal Windows usa chaves sintéticas e nenhuma chamada ao provedor. Limites de mídia da rc.2 continuam aplicáveis: autenticação real, custos, aceitação de referências e continuidade audiovisual exigem piloto do consumidor; TTS predefinido não clona voz canônica.

A investigação de `EPERM` em rename atômico no checkout principal Windows permanece aberta, sem causa comprovada. Fontes de desenvolvimento independentes idênticas e estúdios instalados a partir do arquivo fornecem verificação separada; seus resultados não declaram corrigido o problema do caminho principal. Node 22, outros sistemas, descoberta real de skills e aceitação humana por iniciantes permanecem verificações separadas.

## 0.6.0-rc.2 — 13 de outubro de 2026

Esta candidata experimental acrescenta um executor direto opcional da BytePlus para consumidores com contas, credenciais e orçamentos próprios. A escolha dessa alternativa é explícita; Higgsfield continua sendo o pipeline padrão de mídia. Identidade, cânone, voz aprovada, referências e tentativas históricas dos personagens existentes permanecem preservados. Não houve produção criativa pessoal nem piloto pago real de provedor no checkout de desenvolvimento.

### O que mudou

- **Execução opcional de provedor:** uma CLI separada, sem dependências, aceita pedidos explícitos de imagens Seedream, vídeos Seedance 2.5 e TTS SeedSpeech com voz predefinida na região AP. Cada consumidor fornece credenciais privadas por variáveis de ambiente. Instalação e preparação offline não autenticam nem geram mídia. Credenciais configuradas não comprovam acesso ao modelo. Consulte execução de provedores (guia histórico na tag da respectiva release).
- **Entradas aprovadas exatas:** jobs capturam bytes imutáveis de prompts e referências, hashes, papéis, ordem, parâmetros, cânone e contratos do framework. O envio recusa alterações de entrada, credenciais ou contrato. Referências de produção devem corresponder ao cânone aprovado; a reutilização vocal histórica suportada exige declaração atual de escuta da referência exata, sem reescrever o cânone antigo.
- **Fila, autorizações delimitadas e reservas:** um registro local durável coordena jobs e reservas concorrentes de orçamento entre personagens. A submissão exige autorização explícita correspondente e não expirada. Cotações, incerteza autorizada, valores reservados e cobranças reais reconciliadas permanecem distintos. Um teto local em USD não impõe limite de gastos no provedor, e cobranças reais desconhecidas mantêm a reserva até reconciliação explícita do faturamento.
- **Recuperação do job original:** submissões incertas conservam sua intenção e nunca são repetidas automaticamente. Jobs assíncronos conhecidos são consultados pelo identificador original com a credencial vinculada. Localizadores de saída criptografados mantêm URLs assinadas fora dos registros e backups persistidos em texto simples. A mudança de credenciais não redireciona silenciosamente um job existente.
- **Exportação em rascunho e evidências do workflow:** a exportação delimitada verifica os bytes reais da mídia, registra hashes e preserva arquivos existentes por meio de um diário de exportação. Vínculos capturados com o workflow podem registrar evidências de submissão, recuperação e exportação. A conclusão de um job do provedor não aprova um asset, altera o cânone, conclui uma tarefa do workflow nem autoriza publicação.

### Teste a candidata

Instale em um diretório independente novo:

```sh
npx --yes github:linkiaai/olympox#v0.6.0-rc.2 setup
```

Para um estúdio existente, siga o [procedimento de atualização com preservação](installation.md#atualizar-um-estudio-existente). Execute `npm run verify` no estúdio instalado; no Windows, use `npm.cmd` ou `npx.cmd` quando necessário. Comece pela preparação offline e consulte execução de provedores (guia histórico na tag da respectiva release) antes de conectar uma conta. Um piloto real de mídia exige separadamente acesso ao modelo, entradas exatas elegíveis, orçamento viável do piloto completo, autorização aplicável, bytes exportados e inspeção completa da mídia.

Relate resultados reproduzíveis por [issues no GitHub](https://github.com/linkiaai/olympox/issues), incluindo versão do framework, sistema operacional, versões do Node e assistente, comando, comportamento esperado e erro real sem dados sensíveis. Diferencie instalação, execução local, descoberta de skills no assistente e comportamento real do provedor. Não inclua credenciais, identificadores de conta, registros criativos privados, URLs assinadas, mídia ou backups nos relatos.

### Verificação e limites experimentais

A implementação passou em 282 testes, sem falhas ou skips, no Windows com Node 24.18.0, tanto no checkout de fontes quanto em um estúdio independente instalado a partir de um pacote real. Fixtures de HTTP controlado exercitaram a CLI pública, bytes exatos de referências, reservas concorrentes, resultados incertos, vínculo de credenciais, recuperação de exportação e preservação. Verificações do pacote e da árvore instalada cobriram seleção das fontes reutilizáveis, exclusão de dados privados, preservação dos metadados Git e recusa de conflitos. São verificações locais com mídia e credenciais sintéticas.

Autenticação real, disponibilidade dos modelos, origem aceita de retratos/referências, continuidade de identidade, fidelidade vocal verificada por escuta, saída audiovisual completa, faturamento real e recuperação no provedor original permanecem não verificados. As regras de retratos da BytePlus restringem entradas elegíveis de pessoas reais; o catálogo da API não comprova aceitação de um personagem fictício externo existente. Confirme a elegibilidade na conta do próprio consumidor antes de gastar. A transferência local de referência em vídeo permanece pendente. TTS com voz predefinida produz amostras vocais em rascunho e não clona nem condiciona a geração por um arquivo vocal canônico existente; nessa rota, produção com voz existente permanece pendente.

Respostas síncronas de imagem/TTS têm uma janela de falha entre receber um resultado bem-sucedido e gravar seus primeiros bytes de mídia na área temporária. Se esses bytes não forem salvos, o job pode manter o resultado aceito e a reserva sem uma saída local recuperável. A exportação permanece pendente e pode exigir recuperação no provedor original ou manual; o executor não regenera automaticamente. Esta candidata não promete recuperação completa de falhas.

Node 22+ continua sendo o mínimo declarado; execução no Node 22, outros sistemas operacionais, descoberta real de skills no Codex/Claude, observação de iniciante humano e paridade entre assistentes/mídia ainda exigem validação independente. A investigação histórica de `EPERM` no rename atômico do Windows continua aberta. Um piloto do consumidor é necessário antes de lotes ou publicação.

## 0.6.0-rc.1 — 9 de outubro de 2026

Esta versão candidata se destina a testes da comunidade no framework local atualizado. Ela não certifica produção completa de mídia, onboarding de iniciantes nem paridade Codex/Claude. A release histórica `v0.5.0` permanece intacta.

### O que mudou

- **Transferência de imagens locais exatas:** uma operação separada prepara um snapshot local imutável da referência, verifica a conta/workspace pretendidos e uma autorização exata de transferência, depois permite um upload pela base opcional oficial `@higgsfield/cli@1.1.26` no Windows x64. A instalação não instala nem autentica essa CLI. Este incremento aceita apenas recibos de imagens; transferência de áudio/vídeo, outras plataformas e aceitação real das entradas pelo provedor permanecem pendentes. Transferências incertas preservam sua intenção e exigem reconciliação antes de outro envio. O reconhecimento nativo não comprova bytes originais no provedor nem acesso por um plugin/módulo. Consulte [transferência local](higgsfield-setup.md#transferir-arquivos-locais-para-o-plugin).
- **Cânone com e sem fala:** o novo escopo vocal declarado diferencia `speaking`, `silent` e aplicabilidade não resolvida. Cânone com fala exige referência de áudio revisada exata e seleção de escuta registrada; cânone sem fala declara explicitamente que voz não se aplica. Escopo não resolvido permanece em rascunho. Campos historicamente ausentes, contratos salvos, aprovações e hashes mantêm suas semânticas originais. As verificações locais validam declarações e bytes; não comprovam que uma pessoa ouviu nem que a voz tem qualidade. Consulte [identidade e registros](operations.md).
- **Prontidão de mídia por etapa:** contratos atuais de geração vinculam método escolhido, viabilidade do piloto completo, entradas exatas atuais, identificadores de entradas aceitas, cotações, autorizações delimitadas e contexto de execução. Módulos ausentes, entradas não verificadas ou incerteza de custo não aceita continuam como pendências acionáveis. Planejamento e status offline não chamam o provedor; os gates locais verificam consistência das observações registradas, sem autenticar consentimento, comprovar aceitação pelo provedor nem impor teto de gastos no serviço. Tentativas antigas retêm seus contratos capturados. Consulte [operação dos workflows](framework-02.md) e [referência do runtime](framework/README.md).
- **Separação entre desenvolvimento e estúdio:** o checkout de fontes usa AIOX para engenharia de software e recusa gravações do runtime criativo quando marcado como desenvolvimento do framework. Estúdios instalados independentes recebem instruções criativas e skills OLYMPOX. Runtime, projeções e dependências do AIOX ficam fora do pacote do produto e do instalador.

### Teste a candidata

1. Comece em um diretório independente novo, usando a candidata identificada pela tag:

   ```sh
   npx --yes github:linkiaai/olympox#v0.6.0-rc.1 setup
   ```

   Escolha seu assistente e revise o destino. Para um estúdio existente, siga o [procedimento de atualização com preservação](installation.md#atualizar-um-estudio-existente). `--merge` mantém arquivos idênticos e recusa conflitos; não é um atualizador automático.
2. Execute `npm run verify` no estúdio instalado, abra-o em seu ambiente real do Codex ou Claude Code e invoque `$olympox` ou `/olympox`. No Windows, use `npm.cmd` ou `npx.cmd` quando necessário. Comece com: “Use OLYMPOX para propor três conceitos diferentes de influenciadores adultos originais para vídeos curtos de comédia. Recomende um. Prepare somente conceitos agora; não gere mídia, envie arquivos, autentique serviços, gaste créditos nem publique.” Um provedor de mídia conectado não é necessário para essa preparação.
3. Relate um resultado reproduzível por [issues no GitHub](https://github.com/linkiaai/olympox/issues), incluindo versão `0.6.0-rc.1` do framework, sistema operacional, versão do Node, assistente/versão, comando ou pedido, resultado esperado e erro real. Diferencie instalação, carregamento da skill e execução do provedor. Remova credenciais, identificadores de conta e detalhes criativos privados; não anexe registros privados de personagens, arquivos de referência, saída bruta completa do provedor nem backups.

A preparação local basta para começar a testar esta candidata. Um teste real de mídia exige separadamente módulos e transferência verificados, orçamento viável do piloto completo, autorização aplicável, bytes efetivamente exportados, seleção vocal ouvida e reprodução completa do vídeo. A instalação não autoriza essas operações externas.

### Limites conhecidos da aceitação

As verificações de preparação anteriores à release rodaram no Windows com Node 24.18.0, antes da atualização dos metadados de versão. Node 22+ continua sendo o mínimo declarado; execução no Node 22 e nos demais sistemas operacionais permanece pendente. As projeções de instalação Codex e Claude passaram nas verificações locais. Uma sessão do Codex CLI 0.135.0 preparou três conceitos após duas falhas de configuração preservadas: esforço `ultra` não aceito, depois rejeição do modelo configurado `gpt-6.1-sol` naquela rota ChatGPT da CLI. Uma tentativa com `--ignore-user-config` apenas no processo teve sucesso sem alterar configurações pessoais. Sua transcrição não comprovou de forma independente o carregamento completo da skill. Nenhuma sessão real do Claude Code estava disponível, e a rota do provedor em uma nova sessão da CLI/Claude permanece não verificada.

Upload e aceitação reais das referências, voz gerada/ouvida, vídeo completo com fala inspecionado, observação de iniciante humano e paridade de mídia permanecem pendentes. Catálogos e cotações consultados são evidências de preparação, não de produção bem-sucedida. O `EPERM` histórico intermitente no Windows durante rename atômico segue como investigação separada, com causa não comprovada; esta candidata não afirma corrigir o problema. Preserve o erro original e o ambiente ao relatá-lo.

## 0.5.0 — 9 de outubro de 2026

A tag `v0.5.0` identifica a release publicada do framework. Instale com `npx --yes github:linkiaai/olympox#v0.5.0 setup` ou use `node bin/olympox.mjs setup` a partir de checkout revisado ou pacote extraído. Mudanças na documentação posteriores à release exigem exportação e publicação próprias.

### Instalação e assistentes

- `setup` guiado escolhe idioma da apresentação, Codex/Claude Code/ambos e destino independente. Apresenta plano completo e confere que permaneceu igual antes de escrever.
- Cancelar antes de instalar deixa destino intacto. Setup não interativo exige diretório, assistente e `--yes` explícitos.
- Setup executa build do manual, doctor, validação de registros e check da documentação em ordem. A suíte completa continua sendo `npm run verify` no estúdio instalado.
- Instalação direta aceita `--assistant codex|claude|both`, com padrão compatível `codex`. Claude Code recebe `.claude/skills/` e importação do `AGENTS.md` criativo por `CLAUDE.md`.
- Todos os destinos selecionados são pré-verificados. Arquivos idênticos são mantidos; diferenças são recusadas. `--merge` não atualiza personalizações automaticamente.

### Método de mídia e política dos runs

Higgsfield é pipeline padrão para aparência, candidatas, referências, cenas, edições, voz, animação, vídeo e lip-sync novos. Codex ou Claude Code coordena conceitos, personalidade, narrativa, roteiros e planejamento. Imagens integradas exigem escolha explícita de alternativa. Módulos necessários ausentes ficam pendentes.

Runs novos salvam `mediaProviders` por tentativa para image/video/audio. Capacidades de geração, intenção externa e evidência de conclusão devem corresponder ao fornecedor. Novos runs `create-character` usam piloto em vídeo por padrão; geração/revisão de candidatas usa imagem. Mudar fornecedor de run existente exige nova tentativa explícita e motivo.

O [guia do método](higgsfield-influencer-method.md) separa etapas observadas da fonte e adaptações atuais. Conexão genérica não comprova módulo exato. A [passagem do piloto](production-handoff.md) confere rota completa, transporte exato, escuta vocal, inspeção de vídeo, exportação e custo delimitado antes de produção paga. O framework oferece preparação e registros rastreáveis, não upload ou execução automáticos.

### Compatibilidade e documentação

Tentativas históricas sem política conservam semântica salva. Identidade, voz aprovada, mídia, snapshots, aprovações e tentativas antigas ficam intactos. Nova tentativa preserva contrato salvo no run; inicie run separado quando precisar de definição de fluxo alterada.

Revisões dos contratos de tarefas/fluxos permanecem 0.2.0 com política aditiva; isso não torna 0.2.0 a release do framework. Guias ingleses e pt-BR explicam comportamento, comandos, responsabilidades, preservação e limites conjuntamente.

Verificação local cobre registros, política, meios das etapas, instalação, seleção da exportação e preservação. Não demonstra descoberta real, execução do fornecedor, fidelidade audiovisual ou publicação remota. Resultados pertencem à revisão e ambiente realmente verificados.

## 0.4.0 — 8 de outubro de 2026

Política histórica de imagens: geração integrada ChatGPT/Codex passou a ser preferida para aparência, candidatas, referências, cenas, imagens e edições quando disponível. Métodos explícitos do usuário tinham prioridade; voz/vídeo/lip-sync especializados continuavam dependentes de ferramentas verificadas. Rotas Higgsfield eram opcionais nas etapas selecionadas.

A passagem ao vídeo introduziu controles concretos de identidade/voz, script, cena, subconjunto de referências, transferência e exportação. Aprovação completa de canon falante, anexos reais, piloto antes de lotes, inspeção completa e autorização de publicação permaneceram exigidos. Essa preferência não constituía benchmark nem promessa de geração grátis/ilimitada.

A tag `v0.4.0` identifica essa revisão histórica. Canon e registros de execução salvos são preservados nas atualizações explícitas. Use o guia atual para trabalho novo após atualizar; não aplique esses padrões históricos automaticamente à 0.5.0.

## 0.3.0 — 8 de outubro de 2026

Descoberta adaptativa curta e três conceitos distintos conectaram assinatura visual, personalidade e conteúdo recorrente. O método Higgsfield documentado usava seleção de candidatas, referências coerentes, exploração/escuta vocal draft para personagens falantes, aprovação completa do canon e piloto em vídeo antes de lotes. Soul ID permaneceu condicionado à necessidade e com autorização separada.

O estudo da referência separou imagens observadas e adaptações para Builder. Plano de método versionado preservou mapeamento das etapas e lacunas. Prompts passaram a incluir contexto de público, proposta, personalidade e história fictícia quando presentes, junto da identidade e fala exata.

A tag `v0.3.0` identifica essa revisão histórica. Testes locais cobriram contexto de prompt, mudanças no método salvo, capacidades obrigatórias e preservação do pacote/instalador; não comprovaram produção real nem viralização.

## 0.2.1 — 8 de outubro de 2026

Orientações e skill `higgsfield-studio` acrescentaram plugin conectado junto da CLI/wrapper existentes. Ambas as rotas usaram canon, intenção no run, reconciliação, selos e revisão do arquivo exato. Imagens integradas continuavam padrão documentado quando disponíveis nessa revisão.

Orientações de jobs esclareceram `resolve` para sucesso normal, falha e não submissão confirmada. Arquivos de testes passaram a executar sequencialmente para reduzir pico de recursos. A tag `v0.2.1` identifica essa revisão histórica; componente local de núcleo/tarefas permaneceu 0.2.0.

Orientações de plugin não acrescentaram adaptador automático, autenticação, submissão, consulta, repetição, download ou aprovação. Continuaram sendo operações reais do estúdio, com ferramentas e autorização aplicável.

## Atualizar a partir de uma versão histórica

Preserve registros privados e base compartilhada, instale revisão desejada separadamente, compare fontes reutilizáveis e reconcilie mudanças explícitas. Verifique estúdio atualizado e revise contexto observado dos runs retomados. Jobs externos pendentes precisam ser reconciliados antes de nova tentativa. Siga [atualização completa](installation.md#atualizar-um-estudio-existente); não reescreva histórico para adequar à política atual.
