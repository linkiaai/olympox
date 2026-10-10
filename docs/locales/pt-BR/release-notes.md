# Notas das versões

Estas notas explicam comportamento por versão. Os guias atuais descrevem a versão candidata 0.6.0-rc.1. Padrões históricos abaixo pertencem às suas revisões e não substituem orientação atual. Leia [instalação e atualização](installation.md) antes de mudar estúdio existente.

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
