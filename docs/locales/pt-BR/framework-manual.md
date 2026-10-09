# OLYMPOX - AI Influencer framework

O OLYMPOX organiza a criação local de influenciadores de IA originais e memoráveis com potencial viral a testar. Você trabalha com Codex ou Claude como coordenador conversacional; Atena organiza o pedido e especialistas contribuem conforme necessário. Higgsfield é a plataforma padrão de mídia. O framework preserva versões, decisões e evidências entre sessões.

Para novas personagens, comece por [descoberta adaptativa](strategy.md) e conceitos distintos ligando aparência, personalidade, público e conteúdo recorrente. Siga o [método Higgsfield de referência](higgsfield-influencer-method.md) para identidade/referências, voz selecionada e ouvida antes do canon completo, cenas inspecionadas e piloto de vídeo antes de lotes. Confira conexão, transporte, exportação e orçamento do piloto inteiro cedo. Revise mídias reais completas e exporte bytes efetivos antes da publicação autorizada. O coordenador dispensa geração de imagens; [imagens integradas](integrated-images.md) exigem escolha explícita de alternativa. Preserve módulos escolhidos, mantenha recursos ausentes pendentes e registre mudanças materiais de método e autorização paga aplicável. Canon existente fica intacto. Potencial viral exige conteúdo e resultados reais para testar.

## Instale seu estúdio

Na versão 0.5.0, `npx --yes github:linkiaai/olympox#v0.5.0 setup` executa o instalador publicado; `node bin/olympox.mjs setup` usa cópia revisada ou pacote extraído. O guia orienta escolhas de idioma, assistente e destino, verifica o plano real de instalação e pede confirmação antes de escrever. Escolha Codex, Claude Code ou ambos; a seleção instala instruções e skills locais correspondentes, mantendo Higgsfield como plataforma padrão de mídia. O guia executa verificações locais do manual e da estrutura e apresenta um primeiro pedido. Acesso ao fornecedor, módulos necessários e descoberta real das skills continuam verificações separadas. Consulte [instalação](installation.md) para cancelamento, atualização do plano, uso não interativo e preservação; depois execute `npm run verify` para a suíte local completa.

## O que o framework faz

O [procedimento de piloto de vídeo Higgsfield](production-handoff.md) fornece prontidão ordenada, responsáveis e [pacote de passagem](../../../templates/locales/pt-BR/video-handoff.md). O coordenador dirige uma biblioteca coerente e mapeia entradas exatas suportadas por chamada do fornecedor. Higgsfield produz referências/cenas padrão e voz quando há fala; um piloto representativo valida o processo antes de lotes.

| Área | O que você ganha |
| --- | --- |
| Estratégia e identidade | Público, proposta editorial, personalidade e referências aprovadas para cada personagem. |
| Conteúdo | Narrativa, roteiros, cenas e peças versionadas, ligadas ao contexto usado. |
| Coordenação | Tarefas com responsável, entradas, entregas e critérios claros; fluxos retomáveis. |
| Continuidade | Cânone preservado, contexto de geração selado e revisão ligada aos arquivos exatos. |
| Recuperação | Histórico de tentativas, detecção de mudanças e backups verificáveis. |

## Como as partes se conectam

**Atena** entende o objetivo e escolhe a sequência. Os **perfis** orientam cada especialidade. Os **contratos** definem o que entregar e como registrar a conclusão. Os **fluxos** ligam as etapas. Um **run** guarda o estado real dessa execução.

A constituição estabelece os princípios comuns. Os guias explicam o método. O núcleo local mantém registros e hashes. O coordenador dirige e trabalha com ferramentas realmente disponíveis na sessão; geração de mídia usa o fornecedor registrado.

## Termos que aparecem no estúdio

| Termo | Significado |
| --- | --- |
| Persona | Ficha da personagem: público, personalidade, aparência, voz e limites. |
| Cânone | Identidade visual e vocal aprovada, com versão, referências e hashes. |
| Narrativa | História, hábitos, valores, contradições e linguagem editorial versionados. |
| Peça | Unidade de conteúdo: roteiro, legenda, cenas, fontes e vínculos ao contexto. |
| Ativo | Arquivo de imagem, áudio ou vídeo e seu registro de origem e revisão. |
| Run | Execução persistida de um fluxo, com tarefas, tentativas e próxima etapa. |
| Selo de execução | Registro local do prompt e do contexto informado de geração. |
| Plano de método de produção | Registro versionado do processo escolhido, evidência da fonte, módulos, etapas, custos e pendências, observado como entrada/saída do run; não é novo schema de execução nem despachante automático de fornecedor. |

## Capacidades e limites reais

O núcleo organiza o processo e verifica sua estrutura. A execução de subagentes depende de delegação real no aplicativo atual. Perfis cadastrados não ficam permanentemente ativos. Geração, consultas a fornecedores, escuta, visualização de vídeo e publicação dependem das ferramentas disponíveis e das autorizações aplicáveis.

Uma validação estrutural não comprova fidelidade visual, qualidade da voz nem autenticidade de uma declaração. Mídia gerada precisa de inspeção. A identidade é escolhida pelo usuário; publicação e geração externa cobrada exigem autorização aplicável. `production` e `completed` não significam publicado.

Para iniciar, leia [Começar](quick-start.md). Para entender os mecanismos, consulte a [arquitetura](framework-architecture.md) e a [operação do núcleo](framework-02.md).
