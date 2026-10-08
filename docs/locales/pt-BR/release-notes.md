# Notas das versões do OLYMPOX

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
