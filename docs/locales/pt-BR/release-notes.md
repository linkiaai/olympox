# Notas das versões do OLYMPOX

## 0.4.0 — 8 de outubro de 2026

A geração integrada de imagens do ChatGPT/Codex passa a ser o padrão para aparência, candidatas, referências, cenários, imagens e edições quando disponível. Dispensa Higgsfield, Builder, CLI externa e chave de API; aplicam-se limites da conta e disponibilidade, sem promessa de geração gratuita ou ilimitada. Conceito, personalidade, universo narrativo, roteiros e planejamento continuam no ChatGPT/Codex. Métodos/fornecedores escolhidos explicitamente pelo usuário têm prioridade; voz, animação, vídeo e sincronização labial especializados usam ferramentas verificadas conforme necessidade, qualidade e custo. Procedimentos de plugin/CLI e Builder do Higgsfield continuam opcionais por etapa selecionada.

O [procedimento do Codex ao vídeo](production-handoff.md) define pontos de controle de fidelidade e um [pacote concreto de passagem ao vídeo](../../../templates/locales/pt-BR/video-handoff.md). Preparar referências coerentes de identidade, expressões e vistas úteis, cenários e objetos adequados ao conteúdo planejado, roteiros, áudio vocal exato quando houver fala e imagens por cena inspecionadas no Codex antes de passar as entradas suportadas a uma ferramenta de vídeo verificada. Preservar a biblioteca local rica de referências separada do subconjunto relevante e suportado realmente anexado em cada chamada. Registrar arquivos/hashes exatos, papéis e evidência de transferência desse subconjunto; arquivos adicionais não estabelecem fidelidade melhor. Higgsfield é um destino opcional de vídeo, e uma ferramenta especializada de voz verificada pode ser usada antes quando necessário.

Descoberta adaptativa, conceitos distintos, cenas expressivas da premissa, anexos reais de referência, inspeção de anatomia/presença/continuidade, seleção visual pelo usuário, referências vocais geradas/ouvidas/selecionadas pelo usuário antes do canon completo de personagens falantes, aprovações exatas, canon preservado, piloto antes de lotes, revisão/exportação completas de mídia e publicação autorizada continuam exigidos. Método/ferramenta/modelo por etapa, prompts, referências reais, arquivos/hashes, custos conhecidos e limitações continuam rastreáveis. Recursos ausentes ficam pendentes com alternativas; substituições externas pagas exigem autorização aplicável. A API do núcleo local, schemas de runs e revisão de componente das tarefas continuam em **0.2.0**.

É uma preferência de processo sustentada por retorno do usuário após direção de arte e enquadramento também mudarem, sem constituir comparação controlada nem prova de superioridade geral de fornecedor. Personagens aprovadas, mídias, aprovações, backups, runs e bytes históricos ficam intactos; mudança de método ou contexto observado segue o procedimento existente de nova tentativa explícita em vez de reescrever evidências.

### Instalar ou atualizar

Instale um estúdio independente com acesso ao repositório e à tag:

```sh
npx --yes github:linkiaai/olympox#v0.4.0 install ./my-studio
cd my-studio
npm run verify
```

Use `npx.cmd` e `npm.cmd` no Windows se necessário. Estúdios existentes seguem as [orientações de atualização](installation.md#atualizar-um-estudio-existente): faça backup dos registros privados e da base do framework, instale separadamente, compare e reconcilie arquivos reutilizáveis, e preserve registros pessoais e bytes históricos. `--merge` recusa arquivos diferentes antes de escrever; ele não é um atualizador automático. A instalação não conecta fornecedores nem executa produção paga.

### Verificação e limites

Concluir `npm.cmd run verify` e revisar a exportação explícita do framework e as verificações de instalação independente para esta release. Testes locais de coordenação não demonstram geração real, condicionamento real por referência, qualidade vocal, fidelidade audiovisual, descoberta de skills pelo Codex ou publicação remota. Não inclui produção pessoal nem benchmark de fornecedores. Cada estúdio instalado ainda precisa de evidência real de geração de mídia, anexos, inspeção e exportação. As seções históricas abaixo preservam comportamento, tags de instalação e evidências de verificação das releases 0.3.0 e 0.2.1.

## 0.3.0 — 8 de outubro de 2026

A criação de novos influenciadores começa com onboarding adaptativo curto e três conceitos distintos, conectando assinatura visual memorável, personalidade forte e conteúdo recorrente. O método principal usa AI Influencer Builder do Higgsfield e um pacote coerente de referências. Seleção visual preliminar e revisão de fidelidade antecedem a amostra vocal de uma personagem que fala, preparada e ouvida enquanto a persona permanece `draft` com `purpose: reference`. A aprovação final vincula o cânone visual/vocal completo antes de roteiros, cenas e piloto de vídeo em produção seguirem com esse contexto aprovado. Conteúdo silencioso registra por que voz não se aplica; voz e cânone já aprovados são reutilizados. QA/exportação completos antecedem publicação autorizada e comparação de resultados reais. Soul ID continua condicionado à necessidade e com autorização separada.

Escolha explícita do usuário pode selecionar outro método. Recursos obrigatórios ausentes ficam pendentes sem substituição silenciosa por imagens integradas ou geração direta de vídeo. Potencial de viralização continua sendo uma hipótese para testar, não um resultado garantido. Cânone existente e registros históricos ficam preservados.

O [estudo da referência](video-reference.md) atualizado registra análise audiovisual automática por cenas e inspeção direta de quadros importantes, com limites de cobertura. Diferencia a tela observada de Soul Cinema do mapeamento atual pelo Builder. O [guia de método](higgsfield-influencer-method.md), skills, critérios de tarefas, instruções do estúdio e [template versionado de plano](../../../templates/locales/pt-BR/production-method.md) preservam o processo escolhido usando entradas/saídas existentes do run. Não acrescentam despacho automático do fornecedor nem imposição semântica pelo núcleo.

Prompts gerados levam público, proposta editorial, personalidade e história fictícia quando preenchidos, junto das âncoras de identidade e entradas exatas de shot/fala existentes. Fontes inglesas e traduções brasileiras mudam juntas. A API do núcleo local, schemas de runs e revisão de componente das tarefas continuam em **0.2.0**, com critérios de método e direção criativa esclarecidos. Governança atualizada ou entradas observadas podem exigir nova tentativa explícita com motivo na retomada; tentativas e aprovações anteriores ficam preservadas.

### Instalar ou atualizar

Instale um estúdio independente com acesso ao repositório e à tag:

```sh
npx --yes github:linkiaai/olympox#v0.3.0 install ./my-studio
cd my-studio
npm run verify
```

Use `npx.cmd` e `npm.cmd` no Windows se necessário. Estúdios existentes seguem as [orientações de atualização](installation.md#atualizar-um-estudio-existente): faça backup dos registros privados e da base do framework, instale separadamente, compare e reconcilie arquivos reutilizáveis, e preserve registros pessoais e bytes históricos. `--merge` recusa arquivos diferentes antes de escrever; ele não é um atualizador automático. A instalação não conecta fornecedores nem executa produção paga.

### Verificação e limites

O framework atualizado passou em **128 testes locais** na cópia do código-fonte e **128** em um estúdio independente instalado do arquivo npm. A cobertura de regressão inclui contexto criativo do perfil nos prompts, registros de origem e fala exata intactos, hashes e mudança/retomada do método salvo, e ausência de recurso obrigatório de geração. As verificações de instalador/exportação cobrem seleção do pacote reutilizável, arquivos e metadados preservados, e recusa de conflitos.

Nenhuma geração real do Higgsfield foi executada para esta release. Verificações locais não comprovam descoberta de skills pelo Codex, acesso ou execução do fornecedor, fidelidade de identidade, qualidade de voz, exportação de mídia, resultados de viralização ou publicação. Cada estúdio instalado precisa executar as verificações de produção aplicáveis com ferramentas e mídia reais. As notas históricas abaixo mantêm o comportamento e a tag de instalação da release 0.2.1.

## 0.2.1 — 8 de outubro de 2026

Esta atualização de correção acrescenta orientações para usar o Higgsfield pelo plugin conectado do Codex, junto à CLI e wrapper locais existentes. O usuário pode escolher o plugin na conversa sem instalar a CLI local do Higgsfield. A release do framework é 0.2.1; a API do núcleo local e os contratos de tarefas, sem mudanças, mantêm a revisão de componente 0.2.0.

### Mudanças

- A skill opcional `higgsfield-studio` e as instruções do estúdio cobrem a escolha de plugin ou CLI, verificações de capacidades, submissão real de referências e passagem dos resultados. A geração de imagens integrada do Codex continua sendo o padrão quando disponível, salvo se o usuário escolher outro fornecedor.
- O [guia do plugin Higgsfield](higgsfield-plugin.md) explica descoberta de ferramentas na sessão, verificações de conta e custos, anexo de referências, obtenção de saídas e a sequência existente dos registros de produção. Ambas as rotas usam os mesmos registros de cânone, runs, intenção de submissão, selos de execução e revisão de qualidade dos arquivos exatos.
- Instalação, início rápido, ferramentas, produção, estado do framework e manual local explicam a rota opcional em inglês e português brasileiro.
- A documentação de jobs externos esclarece `resolve` em sucesso normal, falha e ausência de submissão confirmada, preservando a sintaxe e o comportamento existentes da transição.
- Os arquivos de testes executam em sequência para reduzir o pico de uso de recursos na verificação local; os mesmos checks continuam obrigatórios.

O pacote fornece instruções para usar ferramentas reais disponíveis na sessão. Ele não acrescenta um adaptador automatizado de fornecedor, instala ou autentica o plugin externo, nem submete, consulta, repete, baixa ou aprova jobs de fornecedores automaticamente. Voz, Soul ID, uso de referências, obtenção/exportação de mídia e cobrança devem ser verificados pela rota escolhida. Um caminho local de cânone no Windows não comprova acesso de upload pelo plugin; uma galeria ou URL remota só se torna um ativo local final depois que os bytes exatos são salvos e inspecionados.

### Instalar ou atualizar

Para um estúdio independente novo, com acesso ao repositório e à tag:

```sh
npx --yes github:linkiaai/olympox#v0.2.1 install ./my-studio
cd my-studio
npm run verify
```

Use `npx.cmd` e `npm.cmd` no Windows se necessário. Um repositório privado do GitHub pode exigir acesso Git autenticado na máquina.

Para um estúdio existente, faça primeiro backup dos registros privados e da base compartilhada do framework. Instale esta release em um diretório independente, compare as fontes reutilizáveis e reconcilie explicitamente o framework, skills, templates e documentação pretendidos. Preserve registros privados e bytes históricos. `--merge` verifica conflitos previamente e recusa arquivos diferentes; ele não é um atualizador automático. Siga as [orientações de atualização](installation.md#atualizar-um-estudio-existente), incluindo uma nova tentativa com motivo quando uma run existente detectar mudanças na governança ou nas entradas.

### Verificação e limites

A release **0.2.1** passou em **124 testes locais** na cópia do código-fonte e **124** em um estúdio independente instalado do arquivo npm. A verificação cobre registros locais, preservação, seleção do instalador/exportação, documentação, consistência das skills e o tratamento existente de estados de jobs externos. O pacote contém apenas fontes reutilizáveis; a instalação preserva metadados Git permitidos e arquivos não relacionados, enquanto conflitos de merge são recusados antes de qualquer escrita.

Nenhuma geração real do Higgsfield foi executada para esta mudança. Testes locais não comprovam nova descoberta de skills pelo Codex, acesso à conta do plugin, geração do fornecedor, fidelidade de identidade, qualidade de voz, exportação de mídia ou publicação remota. O fluxo do plugin preserva essas verificações como trabalho real de produção em cada estúdio instalado.
