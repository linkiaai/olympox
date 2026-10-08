---
name: higgsfield-studio
description: Preparar e operar o CLI local do Higgsfield neste estúdio de influencers, com consulta de recursos, estimativa e produção rastreável. Use quando o pedido envolver Higgsfield; imagens genéricas seguem olympox e imagegen.
---

# Higgsfield no estúdio

Trabalhe da raiz do projeto OLYMPOX. Leia `docs/higgsfield-setup.md` para o estado da instalação, conexão, comandos e produção; leia `docs/tools.md` para escolher o caminho de imagem, voz e vídeo. Para uma personagem, aplique também `olympox` e confira seu cânone e arquivos exatos. Mantenha as instruções do framework em inglês; o conteúdo da personagem conserva seu idioma aprovado.

## Preparação e consulta

- Use `node scripts/higgsfield-local.mjs doctor`, `version` e `help [comando [subcomando]]`. O wrapper confere versão e hash do binário local; não instala nem atualiza automaticamente.
- O login é `node scripts/higgsfield-local.mjs login`, somente quando a conexão estiver autorizada. O usuário completa o OAuth. Não imprimir tokens, coletar senha ou gravar sessão dentro do projeto.
- Após conexão, use `inspect account status`, `inspect workspace status` e `inspect model list/get` conforme o guia. Confirme schema e recursos atuais antes de escolher parâmetros; modelos da documentação são candidatos, não disponibilidade comprovada.
- **`generate cost` com mídia local pode enviar o arquivo ao fornecedor.** O wrapper aceita estimativas apenas com parâmetros simples, sem mídia/arquivo/URL. Se o preço exigir referências, preserve a pendência até haver autorização aplicável para enviá-las; uma estimativa incompleta não é preço exato.

## Produção

O wrapper é de preparação e consulta; ele não gera, envia arquivos nem treina identidade. Para produção autorizada, siga a seção “Produção autorizada depois” do guia e use o executável local fixado, com argumentos separados e schema verificado. Não contorne uma recusa de autorização trocando para o binário nativo.

Antes de submeter, persista no run a intenção do job, entradas/hashes, modelo, parâmetros e limite aplicável. Assinatura, direção proposta e aprovação visual não aprovam automaticamente gasto, upload, treinamento ou timbre. Reutilize autorizações já concedidas que cubram a ação; concentre decisões adicionais no que falta de fato.

Registre o ID assim que disponível. Em submissão incerta, consulte o mesmo job antes de repetir. Preserve mídia em nova versão, prompt, custo conhecido e contexto; sele a execução e inspecione o arquivo completo. Um job concluído não aprova identidade, áudio, lip-sync nem publicação.

## Referência do fornecedor

Consulte `vendor/higgsfield-skills/higgsfield-generate/references/` somente para o formato necessário, depois de verificar o catálogo atual. A revisão preservada e seus hashes estão em `vendor/higgsfield-skills/provenance.json`.

Não execute o bootstrap `curl | sh`, defaults de geração ou teste pago da skill original por sua presença no vendor. O estúdio usa instalação local inspecionada e orçamento por tentativa; alegações de qualidade ou pontuações de viralização do fornecedor precisam de evidência real. Soul ID fica para uma necessidade demonstrada no piloto, com autorização própria.
