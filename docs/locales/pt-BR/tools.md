# Ferramentas e integração

Fontes da CLI consultadas em **7 de outubro de 2026**; catálogo do plugin Higgsfield conferido em **8 de outubro de 2026**. Verifique recursos, planos e comandos novamente antes do uso: essas informações podem mudar.

## Imagens

O caminho inicial é a ferramenta integrada de geração/edição de imagens, quando disponível na sessão do Codex. Nesse fluxo integrado, não é necessário configurar uma chave de API local. Use a skill imagegen instalada e suas instruções atuais; registre as gerações reais na pasta da personagem.

Para consistência, abra e compare o conjunto aprovado, descreva as âncoras e anexe as imagens ao pedido. Um prompt contendo um caminho não envia aquele arquivo. Uma grade é útil para seleção, mas a referência final de cada ângulo deve ter arquivo próprio legível. Copie os resultados que pertencem ao projeto para a pasta do personagem, preservando a versão original.

Não escolher um fornecedor só por uma demonstração. Faça o mesmo piloto com a mesma identidade, cenário, câmera e orçamento; compare taxa de aceitação visual, tempo de revisão e custo por ativo aprovado. Trocar modelo ou versão exige testar novamente. LoRA ou Soul ID podem ser opções futuras quando a fidelidade e o volume justificarem treinamento; não são exigência para começar.

## Higgsfield — plugin ou CLI local

OLYMPOX oferece dois caminhos conversacionais opcionais. O Codex seleciona e chama os recursos realmente disponíveis no estúdio, enquanto o núcleo local preserva contexto, tentativas e revisões. Não há adaptador automático do fornecedor Higgsfield nem submissão pelo núcleo.

| Caminho | Preparação | Execução real |
| --- | --- | --- |
| Plugin Higgsfield | Descobrir e instalar o plugin no aplicativo, conectar a conta do usuário e conferir as ferramentas e schemas expostos; não exige CLI local | Ferramentas disponíveis do plugin para a mídia, referências e fluxos criativos suportados |
| CLI local | Instalar separadamente a CLI inspecionada e fixada, depois conectar a conta do usuário | Executável nativo local com parâmetros de modelo confirmados; o wrapper preparatório permite somente suas operações documentadas |

O catálogo do plugin descreve geração de imagens/vídeos, entradas de referência, presets criativos e fluxos UGC. Uma entrada no catálogo ou skill instalada não comprova ferramentas chamáveis, acesso à conta, disponibilidade de modelos nem equivalência com a CLI. Siga o [guia do plugin](higgsfield-plugin.md) para descoberta, conexão, verificação de recursos e produção rastreável. Use `higgsfield-studio` para selecionar o caminho; não exija a CLI quando o plugin fornecer o recurso necessário.

Para o caminho da CLI, o framework fornece um wrapper local e proveniência inspecionada de fontes do fornecedor em `vendor/higgsfield-skills`. Sua base espera a CLI oficial **1.1.26** em `tools/higgsfield`, instalada e conferida separadamente. `doctor`, `version` e `help` conferem a preparação local sem login. Siga a [preparação da CLI local](higgsfield-setup.md) antes de usar `login` interativo ou consultar conta, workspace, créditos e schemas dos modelos. **Uma estimativa nativa `generate cost` com mídia local pode enviar esses arquivos**; o wrapper preparatório recusa essas entradas e permite somente parâmetros simples. O wrapper não submete jobs de produção nem impõe teto de gastos no servidor.

O [guia oficial da CLI](https://higgsfield.ai/creator-hub/help-center/integrations/how-do-i-access-higgsfield-via-cli) descreve login e créditos da conta sem API key e distingue CLI/MCP das gerações gratuitas ou ilimitadas do site e do produto separado de API. Verifique as condições reais de cobrança do caminho escolhido, plugin ou CLI, antes de produzir; não presuma compartilhamento de condições ou sessões de conta. As [skills oficiais](https://higgsfield.ai/skills) e o [repositório do fornecedor](https://github.com/higgsfield-ai/skills) são material de referência cujos recursos atuais ainda precisam ser conferidos.

Os dois caminhos seguem as mesmas regras de produção: cânone aprovado quando exigido, entradas exatas realmente anexadas e hashes, intenção externa registrada antes da submissão, identificadores/modelo/custo expostos, versões locais de mídia preservadas, selos de execução e inspeção completa. Um caminho escrito no prompt não anexa um arquivo. Custo desconhecido permanece desconhecido. Uma submissão incerta exige consulta real e reconciliação antes de outra tentativa; mudar para a CLI ou o plugin não justifica submissão duplicada. Mantenha pendentes geração, exportação ou inspeção indisponíveis. Nunca guarde senhas, tokens ou chaves em fichas de personagens, runs, manifestos ou commits.

A instalação do framework fornece instruções reutilizáveis e registros locais; não instala nem autentica nenhum dos caminhos do fornecedor, envia mídia ou exige um teste de geração pago. Cada estúdio fornece seu próprio acesso ao fornecedor e a autorização aplicável.

## Entrega de vídeo

Briefs verticais podem começar em 9:16 com resolução alvo 1080 × 1920, ajustando à capacidade real do modelo e do canal. Upscale não recupera identidade perdida. Confirmar duração, fala, suporte a referência, áudio, lip-sync e exportação antes de prometer a entrega. Não substituir uma revisão temporal por capturas isoladas.

Sem uma execução conectada, o Codex ainda pode preparar o pacote completo: roteiro exato, planos, atuação, referências, voz, legendas, texto de publicação e critérios de revisão. Identificar a entrega como **pacote de produção**, sem alegar que há vídeo renderizado.

## Codex

`AGENTS.md` dá orientação de projeto; `.agents/skills/olympox` concentra o processo reutilizável. As [docs oficiais de skills](https://developers.openai.com/codex/skills) descrevem a descoberta local. Se a skill não aparecer no seletor, recarregue o Codex; nesta conversa também pode ser lida diretamente. Arquivos instalados não comprovam carregamento automático no app.
