---
name: higgsfield-studio
description: Preparar e usar o método principal Higgsfield AI Influencer Builder para novos influenciadores OLYMPOX, salvo escolha explícita de outro método pelo usuário, por recursos verificados de plugin ou CLI com estimativas e produção rastreável.
---

# Higgsfield no estúdio

Trabalhe da raiz do estúdio instalado. Leia `docs/tools.md` para escolher o plugin Higgsfield ou a CLI local. Para o plugin, leia `docs/higgsfield-plugin.md`; para a CLI, leia `docs/higgsfield-setup.md`. Para uma personagem, aplique também `olympox` e confira seu cânone e arquivos exatos. Mantenha as instruções do framework em inglês; o conteúdo da personagem conserva seu idioma aprovado. No checkout de desenvolvimento do framework, limite o trabalho a mudanças do framework e verificação sintética.

## Escolher o caminho

- Respeite o caminho escolhido pelo usuário. Quando não houver escolha, use um plugin Higgsfield conectado com os recursos chamáveis necessários; caso contrário, confira a CLI local preparada. Se nenhum estiver pronto, prepare o pacote de produção e informe o recurso ausente. Não instale, autentique ou troque de caminho silenciosamente.
- Usar o plugin dispensa a CLI local, as verificações de seu binário e o OAuth da CLI. Uma falha no diagnóstico da CLI não bloqueia um plugin utilizável. A instalação do framework fornece instruções; não conecta nenhum caminho do fornecedor nem despacha ferramentas automaticamente.
- Confira as instruções atuais das ferramentas, schemas de entrada, conta/workspace, referências, modelo e custo para o caminho selecionado. Não presuma que plugin e CLI exponham os mesmos modelos, preços, franquias, treinamento, vozes ou acesso a arquivos.

## Método de influenciador e Builder

Para criar novos influenciadores OLYMPOX, o método principal é a sequência completa pelo Higgsfield com uma etapa de identidade/referências no AI Influencer Builder, salvo escolha explícita de outro método pelo usuário. Leia `docs/higgsfield-influencer-method.md` antes de planejar ou executar esse trabalho e para qualquer processo de influenciador pelo Higgsfield solicitado. Leve o plano salvo de `templates/production-method.md` pelas etapas de conceito, fichas e pacote de identidade/referências, seleção visual preliminar e revisão de fidelidade, amostra vocal quando necessária enquanto a persona permanece `draft` com `purpose: reference`, aprovação final do cânone visual/vocal completo, cenas e piloto de vídeo em produção, revisão completa e exportação. Para uma personagem que fala, ouça e selecione a amostra vocal antes da aprovação final do cânone: `canonHash` vincula configurações de voz e referências aprovadas, além da identidade visual. A seleção visual inicial não congela um cânone incompleto. Reutilize voz e cânone já aprovados; para conteúdo silencioso, registre por que voz não se aplica. Recursos obrigatórios ausentes mantêm suas etapas pendentes; não acionam uma alternativa de imagens no Codex ou vídeo direto no Kling. A preparação do fornecedor continua opcional e nunca é realizada pelo instalador do framework. Edição genérica de imagem sem relação com essa criação e trabalho dentro do cânone aprovado podem usar ferramentas verificadas que respeitem o método aplicável.

Preserve o conceito memorável escolhido, incluindo idade realista, silhueta, estilo e personalidade; não trate um design aleatório ou tier de preset como prova de potencial de viralização. Confira separadamente cada módulo obrigatório. Higgsfield é o fornecedor; Builder é um módulo de fichas de personagem; plugin/CLI é a rota de conexão; Kling pode ser um modelo de vídeo posterior. Um não comprova a conclusão dos outros. O método principal pelo Builder reflete o requisito explícito atual do usuário, não uma afirmação de que o vídeo original de referência usou exclusivamente o Builder. Mantenha evidências inspecionadas da fonte separadas da adaptação escolhida para o framework.

Para uma personagem já aprovada, inspecione e transfira a referência de identidade aprovada exata por uma rota suportada, preservando bytes e cânone. Nos metadados atuais do plugin, `ai_influencer_prepare` aceita uma referência de identidade em `medias` e referências separadas de Style em `item_medias`. Use `randomize=false` e um tier explícito adequado para preservar o design; confira os schemas atuais e evite traços conflitantes. Prepare uma ficha para o piloto, preserve os params retornados e a cotação com seu escopo, e envie esses params sem alteração a `ai_influencer_generate` somente dentro da autorização aplicável. `ai_influencer_get_settings` pode recuperar o design de uma ficha existente; não é geração nem cotação atual. Salvar configurações ou gerar uma ficha não treina Soul ID, aprova cânone, escolhe voz ou produz vídeo.

Inspecione a fidelidade da ficha contra referências aprovadas antes do uso posterior. Não sobrescreva nem promova fichas automaticamente ao cânone. Reutilize etapas já concluídas somente com evidência exata e compatibilidade com o método escolhido; identifique uma nova etapa obrigatória do Builder como pendente quando ausente. Falta de Builder ou transferência de referência não permite substituir o método por geração direta no Kling. Soul ID continua com justificativa e autorização separadas; voz, cenas e vídeo precisam de recursos verificados e estimativas próprias de cada etapa. Uma cotação de vídeo não cobre fichas de personagem, voz ou treinamento. Preserve requisitos de seleção e envio de cada ferramenta e todos os IDs de jobs não resolvidos.

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
