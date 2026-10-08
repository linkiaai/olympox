# Capacidades e limites do OLYMPOX

O OLYMPOX é um framework local reutilizável de influenciadores de IA. Seu núcleo mantém orientações, fichas de personagens, estado das tarefas, versões e evidências. Cada estúdio fornece seus próprios influenciadores originais, arquivos de produção, acesso a fornecedores e decisões. Consulte [instalação](installation.md) para criar um estúdio a partir do pacote público.

## Incluído no framework

| Área | Capacidade local |
| --- | --- |
| Governança e skills | Constituição, instruções do projeto para o Codex, `olympox` e a skill opcional `higgsfield-studio` |
| Coordenação | Nove perfis com nomes de deusas, contratos de tarefas e três fluxos retomáveis |
| Pesquisa e direção | Métodos de oportunidades e tendências sob demanda, com fontes, recorte e limitações |
| Fichas de personagens | Brief, âncoras de identidade, referências, narrativa, peças de conteúdo e especificações de geração |
| Continuidade | Snapshots do cânone aprovado, selos de execução, vínculos de revisão com arquivos exatos e tentativas preservadas |
| Recuperação | Detecção de mudanças no contexto, tratamento de resultados incertos, backups com inventário e testes de restauração |
| Documentação | Manual local navegável |
| Instalação | Criação de estúdio novo e merge com verificação prévia que mantém arquivos idênticos e recusa arquivos conflitantes do framework |

Os fluxos são `create-character`, `produce-piece` e `review-correct`. Atena coordena pedidos no Codex. Perfis registrados orientam o trabalho; a delegação real para uma especialista ocorre somente quando uma subagente é efetivamente despachada.

## O que a verificação demonstra

A partir da raiz do estúdio, execute:

```powershell
npm.cmd run verify
npm.cmd run studio -- help
```

A verificação gera o manual, executa testes locais, valida os registros disponíveis, confere a consistência entre fontes e instalação das skills e verifica o manual resultante. Os testes exercitam registros, caminhos, preservação, transições de estado e comportamento dos comandos locais. Os resultados pertencem à versão e ao ambiente em que esses comandos foram executados; contagens históricas copiadas não demonstram o funcionamento de uma nova instalação.

Verificações estruturais não inspecionam pixels, escutam vozes, visualizam movimento, confirmam a execução de fornecedores nem autenticam um revisor nomeado. Um contrato concluído ou um teste de restauração bem-sucedido não comprova qualidade audiovisual ou publicação. Hashes detectam mudanças; não comprovam autoria ou aprovação.

## Ferramentas e produção

O Codex usa as ferramentas de geração, inspeção, pesquisa web e subagentes realmente disponíveis na sessão atual. Skills instaladas não criam acesso a ferramentas nem demonstram nova descoberta pelo Codex. Reabra ou recarregue o projeto quando necessário.

O suporte ao Higgsfield é opcional: o pacote inclui instruções, um wrapper local e proveniência de fontes do fornecedor. Binários de fornecedores, sessões de conta, credenciais, disponibilidade de modelos e saldos não são fornecidos por uma instalação do framework. Confira e prepare esses recursos no seu ambiente antes de usar, seguindo [ferramentas](tools.md) e [preparação Higgsfield](higgsfield-setup.md).

O núcleo não submete ou consulta jobs externos automaticamente, repete submissões incertas, agenda um radar de tendências, publica conteúdo ou coleta métricas dos canais. Geração paga, treinamento de identidade e publicação precisam de autorização aplicável. Um roteiro ou pacote de produção preparado continua sendo preparação até que execução e revisão ocorram.

## Seu primeiro ciclo criativo

1. Defina público, proposta editorial e uma persona adulta original.
2. Explore referências candidatas reais e escolha a identidade explicitamente.
3. Registre os arquivos aprovados e hashes exatos e preserve o cânone.
4. Prepare narrativa e uma peça concreta; execute um pequeno piloto com ferramentas disponíveis.
5. Inspecione a mídia completa e corrija falhas críticas em novas versões antes de lotes.

Mantenha fichas de personagens, mídia, runs e backups locais. O framework distribuído não contém arquivos reais de personagens. Use backup verificável e mantenha uma cópia independente fora do disco de trabalho; o contexto compartilhado do framework precisa de preservação própria.
