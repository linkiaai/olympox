@AGENTS.md

# OLYMPOX — Claude Code

As instruções importadas governam este estúdio criativo independente. Use as skills do projeto em `.claude/skills/`: invoque `/olympox` para trabalho com influenciadores e `/higgsfield-studio` para produção no Higgsfield. As fontes reutilizáveis canônicas das skills continuam em `skills/`.

Verifique ferramentas e acesso ao fornecedor nesta sessão real. O assistente coordena e escreve; a pessoa escolhe Higgsfield ou OpenRouter explicitamente, sem pré-seleção nem fallback automático. Leia a escolha explícita salva em `work/provider-choice.json` quando existir. OpenRouter oferece somente vídeo atualmente; etapas não suportadas de imagem e áudio independente ficam pendentes até seleção explícita de método compatível. Um arquivo de skill ou uma importação de instruções não conecta uma conta, disponibiliza ferramentas de geração, autoriza trabalho pago nem demonstra qualidade audiovisual.

Siga o gate vocal estruturado importado: resolva novo `voice.applicability` antes do cânone completo; `speaking` vincula seleção de áudio exato escutado, e `silent` mantém referência/seleção vocal null e recusa fala. Preserve campos históricos ausentes e identidades já aprovadas. Veja `docs/operations.md`.

Para trabalho Higgsfield escolhido explicitamente, use a operação autorizada separada `reference-transfer.mjs` para imagens locais compatíveis conforme instruções importadas e `docs/higgsfield-setup.md`; preserve submissões incertas e depois confirme separadamente acesso real pelo plugin/módulo e bytes no fornecedor antes da prontidão de mídia.
