---
name: higgsfield-studio
description: Preparar e usar Higgsfield pelo plugin conectado ou pela CLI local, com consulta de recursos, estimativas e produção rastreável no estúdio. Use para pedidos de Higgsfield; imagens genéricas seguem olympox e imagegen.
---

# Higgsfield no estúdio

Trabalhe da raiz do estúdio instalado. Leia `docs/tools.md` para escolher o plugin Higgsfield ou a CLI local. Para o plugin, leia `docs/higgsfield-plugin.md`; para a CLI, leia `docs/higgsfield-setup.md`. Para uma personagem, aplique também `olympox` e confira seu cânone e arquivos exatos. Mantenha as instruções do framework em inglês; o conteúdo da personagem conserva seu idioma aprovado. No checkout de desenvolvimento do framework, limite o trabalho a mudanças do framework e verificação sintética.

## Escolher o caminho

- Respeite o caminho escolhido pelo usuário. Quando não houver escolha, use um plugin Higgsfield conectado com os recursos chamáveis necessários; caso contrário, confira a CLI local preparada. Se nenhum estiver pronto, prepare o pacote de produção e informe o recurso ausente. Não instale, autentique ou troque de caminho silenciosamente.
- Usar o plugin dispensa a CLI local, as verificações de seu binário e o OAuth da CLI. Uma falha no diagnóstico da CLI não bloqueia um plugin utilizável. A instalação do framework fornece instruções; não conecta nenhum caminho do fornecedor nem despacha ferramentas automaticamente.
- Confira as instruções atuais das ferramentas, schemas de entrada, conta/workspace, referências, modelo e custo para o caminho selecionado. Não presuma que plugin e CLI exponham os mesmos modelos, preços, franquias, treinamento, vozes ou acesso a arquivos.

## Preparação e execução pelo plugin

Localize o plugin Higgsfield pelas ferramentas de plugins disponíveis no ambiente ou pelo diretório. Se instalação ou conexão estiver pendente, informe o passo necessário ao usuário e continue a preparação local independente. Use ferramentas do fornecedor somente após confirmar a conexão; sua presença, por si só, não prova uma conta funcional ou geração.

Inspecione as ferramentas e os schemas reais necessários ao pedido. Preserve qualquer seletor obrigatório ou turno exclusivo de ferramenta; prepare e persista o contexto local antes do turno de submissão. Não invente comandos de barra, IDs ou parâmetros. Respeite os requisitos atuais de cada ferramenta sem tratar as alegações criativas de um preset como fatos comprovados ou autorização.

Caminhos locais não são anexos do plugin. Confira um caminho de transferência compatível para os bytes exatos aprovados e relacione seus hashes a IDs de mídia confirmados no fornecedor ou URLs autorizadas. Helpers restritos a anexos e sandboxes remotos não leem arquivos arbitrários do estúdio. Mantenha a produção pendente quando uma referência obrigatória não puder ser transferida fielmente. Estimativas com URLs/mídia podem importar ou enviar referências mesmo sem submeter geração; confira efeitos e autorização de upload aplicável, e reutilize entradas confirmadas para evitar importações duplicadas.

Antes de gerar, use o procedimento compartilhado de produção abaixo. Submeta pela ferramenta conectada com os parâmetros reais e a escolha aplicável de franquia/orçamento. Registre IDs retornados, ajustes, resultados e custos expostos. Após uma resposta incerta, consulte o mesmo job com uma ferramenta de estado disponível; trocar para a CLI seria outra submissão e não pode duplicar um job não resolvido.

Use o caminho de prévia e exportação de mídia compatível com o ambiente. Salve os mesmos bytes do resultado em nova versão local da personagem antes de registrar, selar e revisar. Se houver apenas prévia/URL remota, preserve-a no registro do job e mantenha a entrega local pendente; não contorne restrições de exibição/exportação do ambiente nem afirme que existe um ativo local.

## Preparação e consulta pela CLI

- Use `node scripts/higgsfield-local.mjs doctor`, `version` e `help [comando [subcomando]]`. O wrapper confere versão e hash do binário local; não instala nem atualiza automaticamente.
- O login é `node scripts/higgsfield-local.mjs login`, somente quando a conexão estiver autorizada. O usuário completa o OAuth. Não imprimir tokens, coletar senha ou gravar sessão dentro do projeto.
- Após conexão, use `inspect account status`, `inspect workspace status` e `inspect model list/get` conforme o guia. Confirme schema e recursos atuais antes de escolher parâmetros; modelos da documentação são candidatos, não disponibilidade comprovada.
- **`generate cost` com mídia local pode enviar o arquivo ao fornecedor.** O wrapper aceita estimativas apenas com parâmetros simples, sem mídia/arquivo/URL. Se o preço exigir referências, preserve a pendência até haver autorização aplicável para enviá-las; uma estimativa incompleta não é preço exato.

## Produção

Ambos os caminhos seguem o mesmo processo de cânone, run, ativo e qualidade. O wrapper da CLI é de preparação e consulta; ele não gera, envia arquivos nem treina identidade. Para produção autorizada pela CLI, siga a seção “Produção autorizada depois” do guia de preparação e use o executável local fixado, com argumentos separados e schema verificado. Não contorne uma recusa de autorização trocando ferramentas.

Antes de submeter, persista no run a intenção do job, entradas/hashes, modelo, parâmetros e limite aplicável. Assinatura, direção proposta e aprovação visual não aprovam automaticamente gasto, upload, treinamento ou timbre. Reutilize autorizações já concedidas que cubram a ação; concentre decisões adicionais no que falta de fato.

Registre o ID assim que disponível. Em submissão incerta, consulte o mesmo job antes de repetir. Registre o caminho real na descrição de ferramenta/fornecedor; descreva honestamente um modelo não exposto como desconhecido e mantenha custo desconhecido como `null`, nunca zero. Preserve mídia em nova versão, prompt, custo conhecido e contexto; sele a execução e inspecione o arquivo completo. Um job concluído não aprova identidade, áudio, lip-sync nem publicação. Recursos ausentes de transferência, estado, exportação ou inspeção permanecem pendentes.

Mantenha créditos estimados/cobrados e escolhas de franquia nos dados adicionais de proveniência; o campo `cost` do ativo aceita valor monetário e moeda, não créditos. Preserve `cost: null` quando o custo monetário estiver indisponível. Uma resposta pedindo escolha de franquia ou recusando parâmetros pode não submeter job; diferencie isso de submissão incerta. Em lotes, persista cada ID de job aceito e reconcilie todos antes de resolver a tentativa.

## Referência do fornecedor

Consulte `vendor/higgsfield-skills/higgsfield-generate/references/` somente para o formato necessário, depois de verificar o catálogo atual. A revisão preservada e seus hashes estão em `vendor/higgsfield-skills/provenance.json`.

Não execute o bootstrap `curl | sh`, defaults de geração ou teste pago da skill original por sua presença no vendor. O estúdio usa instalação local inspecionada e orçamento por tentativa; alegações de qualidade ou pontuações de viralização do fornecedor precisam de evidência real. Soul ID fica para uma necessidade demonstrada no piloto, com autorização própria.
