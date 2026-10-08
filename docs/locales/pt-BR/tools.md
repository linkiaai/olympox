# Ferramentas e integração

Consulta das fontes: **7 de outubro de 2026**. Verifique recursos, planos e comandos novamente antes do uso: essas informações podem mudar.

## Imagens

O caminho inicial é a ferramenta integrada de geração/edição de imagens, quando disponível na sessão do Codex. Nesse fluxo integrado, não é necessário configurar uma chave de API local. Use a skill imagegen instalada e suas instruções atuais; registre as gerações reais na pasta da personagem.

Para consistência, abra e compare o conjunto aprovado, descreva as âncoras e anexe as imagens ao pedido. Um prompt contendo um caminho não envia aquele arquivo. Uma grade é útil para seleção, mas a referência final de cada ângulo deve ter arquivo próprio legível. Copie os resultados que pertencem ao projeto para a pasta do personagem, preservando a versão original.

Não escolher um fornecedor só por uma demonstração. Faça o mesmo piloto com a mesma identidade, cenário, câmera e orçamento; compare taxa de aceitação visual, tempo de revisão e custo por ativo aprovado. Trocar modelo ou versão exige testar novamente. LoRA ou Soul ID podem ser opções futuras quando a fidelidade e o volume justificarem treinamento; não são exigência para começar.

## Higgsfield — vídeo e voz

O [guia oficial](https://higgsfield.ai/creator-hub/help-center/integrations/how-do-i-access-higgsfield-via-cli) recomenda CLI + skills para Codex. Esse caminho usa login e créditos da conta Higgsfield; não exige API key. Modelos Unlimited e gerações gratuitas não se aplicam a CLI/MCP; a API é um produto separado. As [skills oficiais](https://higgsfield.ai/skills) e o [repositório do fornecedor](https://github.com/higgsfield-ai/skills) trazem instruções atuais.

**Integração opcional:** o framework inclui a skill `higgsfield-studio`, um wrapper local e proveniência inspecionada de fontes do fornecedor em `vendor/higgsfield-skills`. A base do wrapper espera a CLI oficial **1.1.26** em `tools/higgsfield`, instalada e conferida separadamente. Binários do fornecedor, sessões de conta, saldos e resultados de geração são fornecidos por cada estúdio. Consulte [preparação Higgsfield](higgsfield-setup.md) para preparação, comandos e proveniência.

Quando o usuário escolher esse fornecedor:

1. Usar a skill `higgsfield-studio` e o wrapper `node scripts/higgsfield-local.mjs`. `doctor`, `version` e `help` verificam a preparação sem login; não instalar tudo novamente nem alterar PATH/configuração global.
2. Quando a conexão for solicitada, executar `login` interativo. O usuário completa o OAuth; confirmar armazenamento da sessão fora do projeto antes de concluir a conexão.
3. Conferir conta, workspace, créditos e schema dos modelos com as leituras do guia. Definir orçamento e tentativas antes dos jobs. **Uma estimativa `generate cost` com mídia local pode enviar os arquivos**; o wrapper preparatório recusa essas entradas e permite apenas parâmetros simples.
4. Com identidade, referências e autorização aplicáveis, persistir a intenção do job e usar o executável local fixado para produção. O wrapper não submete pedidos e não impõe teto no servidor.
5. Gerar um vídeo curto; revisar fala, movimentos e arquivo exportado. Registrar job, inputs, modelo, prompt, parâmetros, custo conhecido e revisão em `assets.json`, preservando novas versões.

Não repetir automaticamente um job cuja submissão tenha resultado desconhecido: consultar status antes de reenviar para evitar crédito duplicado. Nunca guardar senha, token ou chave em `persona.json`, manifestos ou commits.

## Entrega de vídeo

Briefs verticais podem começar em 9:16 com resolução alvo 1080 × 1920, ajustando à capacidade real do modelo e do canal. Upscale não recupera identidade perdida. Confirmar duração, fala, suporte a referência, áudio, lip-sync e exportação antes de prometer a entrega. Não substituir uma revisão temporal por capturas isoladas.

Sem uma execução conectada, o Codex ainda pode preparar o pacote completo: roteiro exato, planos, atuação, referências, voz, legendas, texto de publicação e critérios de revisão. Identificar a entrega como **pacote de produção**, sem alegar que há vídeo renderizado.

## Codex

`AGENTS.md` dá orientação de projeto; `.agents/skills/olympox` concentra o processo reutilizável. As [docs oficiais de skills](https://developers.openai.com/codex/skills) descrevem a descoberta local. Se a skill não aparecer no seletor, recarregue o Codex; nesta conversa também pode ser lida diretamente. Arquivos instalados não comprovam carregamento automático no app.
