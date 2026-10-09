# Notas das versões

Estas notas explicam comportamento por versão. Os guias atuais descrevem o código da 0.5.0. Padrões históricos abaixo pertencem às suas revisões e não substituem orientação atual. Leia [instalação e atualização](installation.md) antes de mudar estúdio existente.

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
