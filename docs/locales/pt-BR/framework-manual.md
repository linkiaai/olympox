# Manual do framework OLYMPOX

OLYMPOX é um framework local para desenvolver influenciadores originais de IA com identidade consistente, conteúdo versionado e histórico de produção retomável. Seu assistente coordena o trabalho; Higgsfield fornece o fluxo padrão de mídia.

## Escolha por onde começar

| Você quer… | Leia |
| --- | --- |
| Instalar um estúdio ou preservar um existente | [Instalação](installation.md) |
| Fazer seu primeiro pedido | [Início rápido](quick-start.md) |
| Desenvolver um personagem e escolher sua identidade | [Desenvolvimento de personagens](strategy.md) |
| Produzir um piloto ou uma peça de conteúdo | [Produção](production.md) |
| Inspecionar mídia e pedir correções | [Qualidade e continuidade](quality.md) |
| Manter registros, cânone e backups | [Identidade e registros](operations.md) |
| Iniciar, concluir ou retomar tarefas de workflow | [Operação dos workflows](framework-02.md) |
| Entender a implementação ou contribuir | [Arquitetura](framework-architecture.md) e [manutenção do manual](living-documentation.md) |

## Como o trabalho avança no OLYMPOX

1. Defina público e objetivo. Explore conceitos diferentes e selecione uma direção.
2. Desenvolva persona, narrativa e referências visuais. Para um personagem que fala, ouça e selecione a voz antes de aprovar o cânone completo.
3. Prepare roteiros e cenas com as referências aprovadas exatas. Verifique ferramentas, transferência, exportação e orçamento do piloto.
4. Gere e inspecione um piloto representativo. Corrija falhas em novas versões e revise os bytes exportados.
5. Amplie para lotes depois da aprovação do piloto. Publique com a autorização aplicável e aprenda com resultados reais.

[A equipe](studio-team.md) distribui responsabilidades entre Atena e oito especialistas. O catálogo de workflows conecta suas tarefas; cada execução preserva entradas, saídas, tentativas e a próxima responsável. Os perfis orientam o assistente, e a delegação real usa subagentes disponíveis na sessão.

## O que está incluído

| Componente | Finalidade |
| --- | --- |
| Instruções e skills | Orientar o trabalho do assistente em um estúdio local independente |
| Registro, contratos e workflows | Definir responsáveis, entregas obrigatórias e critérios de conclusão |
| Registros de personagens e editoriais | Vincular persona, narrativa, roteiros e assets ao seu contexto |
| Snapshots do cânone e selos de execução | Preservar referências aprovadas e entradas declaradas de geração |
| Execuções e backups | Permitir continuidade, verificação de integridade e recuperação |
| Manual navegável | Oferecer guias e catálogos de referência derivados das fontes |

Os comandos locais mantêm arquivos e validam registros. Conexão com o provedor, geração, escuta, visualização de vídeo e publicação usam ferramentas disponíveis na sessão. A validação local não comprova qualidade criativa nem execução externa.

## Termos usados neste manual

| Termo | Significado |
| --- | --- |
| Persona | Registro de trabalho do personagem: público, personalidade, aparência, voz e limites |
| Cânone | Identidade visual e vocal aprovada com versão, referências exatas e hashes |
| Narrativa | História fictícia, comportamento e voz editorial versionados |
| Peça de conteúdo | Roteiro, legenda, cenas, fontes factuais e vínculos de contexto de um item |
| Asset | Arquivo de mídia com registros de origem e revisão |
| Run | Execução de workflow que contém tarefas e tentativas preservadas |
| Selo de execução | Registro preservado do contexto declarado de geração e do prompt |
| Plano do método de produção | Etapas, ferramentas, entradas, escopo de custo e pendências escolhidos |

## Escopo e versão

Use um estúdio instalado para seus próprios personagens. Este repositório contém o framework reutilizável e sua documentação de desenvolvimento. Personagens privados, mídia, execuções e credenciais ficam fora da distribuição.

O código atual é a versão candidata **0.6.0-rc.1** para testes da comunidade. Consulte [notas de versão](release-notes.md) para mudanças, instruções de teste e aceitação real pendente e [capacidades suportadas](studio-status.md) para o limite entre recursos locais e serviços externos. Um piloto de vídeo com fala é o escopo padrão de criação; um brief explícito pode escolher apenas imagens ou um personagem sem fala. Potencial viral é testado por conteúdo e resultados.
