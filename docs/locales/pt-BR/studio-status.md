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
| Acesso opcional ao Higgsfield | Orientações para o fluxo por plugin e wrapper da CLI local, usando os mesmos registros de cânone, runs e revisão |
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

A criação de novos influenciadores usa [criação visual integrada do ChatGPT/Codex](integrated-images.md) por padrão quando disponível, sujeita à disponibilidade da ferramenta e limites da conta, sem exigir Higgsfield, Builder, CLI externa ou chave de API. Respeite escolha explícita de método/fornecedor. Onboarding adaptativo curto e conceitos distintos antecedem geração; cenas expressivas de personalidade/premissa e referências coerentes inspecionadas preservam a direção criativa. Personagens falantes exigem referência vocal gerada, ouvida e selecionada pelo usuário antes da aprovação do canon completo. Aprovações exatas, preservação do canon, piloto antes de lotes, revisão completa de mídia, exportação e publicação autorizada continuam exigidos. Ferramentas especializadas, incluindo Higgsfield, são escolhidas por etapa útil conforme necessidade, qualidade e custo. Canon existente fica preservado. São instruções de skills/tarefas; hashes observam planos salvos, mas o núcleo não impõe completude semântica nem despacha fornecedores automaticamente.

Acesso ao fornecedor continua preparado separadamente: o [plugin do Codex](higgsfield-plugin.md) dispensa CLI local; a [CLI e wrapper locais](higgsfield-setup.md) são outra rota, cujos recursos exigidos devem ser conferidos. O pacote inclui orientações, wrapper e proveniência permitida de fontes do fornecedor. A instalação nunca instala/conecta fornecedores externos. O núcleo funciona sem eles; recursos obrigatórios de produção ausentes ficam pendentes em vez de trocar de método silenciosamente.

Sessões de conta, credenciais, disponibilidade de ferramentas/modelos e saldos devem ser conferidos no ambiente do usuário para a rota escolhida. A descoberta do plugin por si só não demonstra acesso à conta, voz, Soul ID, uso de referências, download/exportação de mídia ou cobrança equivalente à CLI. A verificação local cobre registros e orientações do framework; ela não exercita o serviço do plugin. Siga [ferramentas](tools.md) e o guia da rota escolhida. Ambas exigem evidência real de execução, registros locais e inspeção completa da mídia.

O núcleo não submete ou consulta jobs externos automaticamente, repete submissões incertas, agenda um radar de tendências, publica conteúdo ou coleta métricas dos canais. Geração paga, treinamento de identidade e publicação precisam de autorização aplicável. Um roteiro ou pacote de produção preparado continua sendo preparação até que execução e revisão ocorram.

## Seu primeiro ciclo criativo

1. Defina público, proposta editorial e uma persona adulta original.
2. Explore referências candidatas reais e escolha a identidade explicitamente.
3. Para personagens falantes, gere, ouça e selecione a referência vocal exata antes de aprovar o canon visual/vocal completo; registre arquivos e hashes exatos e preserve o canon. Para conteúdo silencioso, registre por que voz não se aplica.
4. Prepare narrativa e uma peça concreta; execute um pequeno piloto com ferramentas disponíveis.
5. Inspecione a mídia completa e corrija falhas críticas em novas versões antes de lotes.

Mantenha fichas de personagens, mídia, runs e backups locais. O framework distribuído não contém arquivos reais de personagens. Use backup verificável e mantenha uma cópia independente fora do disco de trabalho; o contexto compartilhado do framework precisa de preservação própria.
