# Capacidades e limites

OLYMPOX combina instruções para assistentes com runtime Node local para estúdios de influenciadores originais. O framework fornece métodos e registros reutilizáveis; cada estúdio instalado fornece escolhas de personagens, mídia, acesso ao fornecedor e evidência de execução. Consulte [instalação](installation.md) e [início rápido](quick-start.md).

## Capacidades locais incluídas

| Área | Comportamento incluído | Evidência ainda necessária no estúdio |
| --- | --- | --- |
| Instalação | Setup guiado, destinos Codex/Claude/ambos, verificação integral de conflitos e checks locais | Descoberta real da skill no assistente escolhido |
| Coordenação | Nove perfis, quinze contratos e três fluxos persistentes | Execução real e dispatch real de subagentes quando relatado |
| Identidade | Drafts, hashes de referências, declarações de aprovação e snapshots congelados | Seleção do usuário, fidelidade visual e escuta/seleção vocal quando há fala |
| Registros de produção | Shots/prompts, cadastro draft de mídia, selos e revisões vinculadas | Referências submetidas, geração real e inspeção completa |
| Histórico editorial | Narrativa/conteúdo versionados, fontes e vínculos de canon/narrativa | Escrita adequada, verificação factual e elegibilidade de áudio aplicável |
| Retomada | Detecção de mudanças, tentativas preservadas e bloqueio de jobs pendentes | Reconciliação do fornecedor pelas ferramentas reais |
| Recuperação | Inventário de personagem/runs, verificação e teste de restauração | Cópias independentes e contexto compartilhado preservado separadamente |
| Documentação | Fonte inglesa, edição pt-BR, catálogos derivados e manual local | Revisão do texto/tradução e eventual publicação remota |
| Rota Higgsfield | Orientações, wrapper local e proveniência permitida | Conta, módulos exatos, entradas aceitas, exportação, inspeção e orçamento |

Fluxos: `create-character`, `produce-piece` e `review-correct`. Perfis orientam o assistente; não são trabalhadores persistentes. Comandos não despacham especialistas, geram mídia, consultam fornecedores, repetem trabalho pago, publicam, agendam pesquisa ou coletam métricas automaticamente.

## Suporte a assistentes e fornecedores

O instalador cria instruções de projeto e projeções de skills locais para Codex, Claude Code ou ambos. É estrutura de arquivos suportada e caminho de instalação testado localmente. Não comprova descoberta por uma sessão específica nem configura Claude web ou outro ambiente.

Higgsfield é o método padrão de mídia para trabalho novo. Conceitos, personalidade, narrativa, roteiros e planejamento ficam com o assistente. [Geração integrada](integrated-images.md) é alternativa explícita para imagens. Etapa Higgsfield ausente fica pendente até existir capacidade necessária ou decisão explícita de método.

[Plugin](higgsfield-plugin.md) e [CLI local](higgsfield-setup.md) precisam ser conferidos independentemente na sessão real. Recursos do site, plugin conectado ou CLI autenticada não comprovam acesso a todo módulo, voz, treinamento, upload de referências, exportação ou saldo de cobrança equivalente. Confira o [piloto completo](production-handoff.md) antes da primeira etapa paga e aplique autorização existente aplicável.

O método exige identidade visual coerente selecionada, canon visual/vocal exato, voz ouvida para fala, entradas de cenas inspecionadas e piloto completamente revisado antes de lotes. Bytes finais reais devem ser exportados e revisados; publicação tem autorização e evidência próprias. Testes não substituem produção.

## O que a verificação local confere

No estúdio instalado:

```sh
npm run verify
npm run studio -- help
```

`verify` compila manual, executa testes, valida registros disponíveis de personagens/editoriais, executa `doctor` e confere integridade do manual. Estúdio vazio pode passar sem personagem ou mídia gerada. Draft pode passar validação estrutural com campos pendentes relatados como avisos.

| Resultado | O que estabelece |
| --- | --- |
| Testes aprovados | Comportamento local coberto funcionou nessa versão/ambiente |
| Validação de personagem aprovada | Registros, hashes e vínculos de revisão declarados são consistentes |
| `doctor` aprovado | Base, contratos registrados e projeções de skills são consistentes |
| Check da documentação aprovado | Fontes selecionadas e manual gerado correspondem |
| Teste de restauração aprovado | Registros inventariados podem ser restaurados e validados localmente |

Nenhum autentica responsável, inspeciona pixels, ouve áudio, revisa movimento, comprova condicionamento por referência ou estabelece publicação. Hashes detectam mudanças; quem escreve pode editar e recalcular. Contagem de testes de release anterior não comprova saúde atual do estúdio.

## Quando o trabalho fica pendente

| Condição | Próxima ação |
| --- | --- |
| Capacidade obrigatória de geração/inspeção ausente | Mantenha etapa pendente e confira rota/módulo exato |
| Transporte de referência ou exportação não suportado | Resolva antes de assumir o piloto completo |
| Canon/contexto observado alterado | Revise e use nova tentativa explícita; preserve histórico |
| Submissão externa não resolvida | Consulte/reconcilie job original antes de continuar ou tentar novamente |
| Falha crítica ou inspeção incompleta | Preserve tentativa, corrija nova versão e inspecione novamente |
| Instalador encontra arquivos diferentes | Compare/reconcilie; `--merge` não sobrescreve |
| Dado histórico falha na validação | Preserve originais e diagnostique sem reescrever evidência |

Siga [operações](operations.md) para arquivos, mídia e backups e [runs e retomada](framework-02.md) para estado. Pacote preparado, execução selada, run concluído e conteúdo publicado descrevem resultados distintos; registre apenas o que ocorreu.
