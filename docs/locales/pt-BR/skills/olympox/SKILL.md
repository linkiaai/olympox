---
name: olympox
description: Criar, dirigir, produzir ou revisar influenciadores memoráveis com pipeline padrão Higgsfield, fornecedores opcionais explicitamente escolhidos, identidade preservada e qualidade.
---

# OLYMPOX - AI Influencer framework

Crie personagens originais variados e memoráveis com potencial de viralização, identidade consistente e qualidade verificável. Priorize personagens realistas com personalidade e presença fortes, salvo se o usuário escolher outra linguagem visual. Trabalhe em ciclos de proposta de conceito, geração, revisão visual e aprovação; a geração pode exigir várias tentativas. Potencial de viralização é uma hipótese de conteúdo para testar, não um resultado prometido. As instruções do framework e os novos registros técnicos usam inglês; a voz e o conteúdo da personagem seguem o idioma aprovado para o público.

## Contexto e referências

Antes de escolher ferramentas de mídia, leia `work/studio-settings.json` não secreto, se existir. Use a preferência `mediaProvider` para trabalhos novos, salvo escolha explícita do usuário por outro método ou provedor por etapa; sem preferência, Higgsfield permanece padrão. Runs novos resolvem padrões do registro, depois escolha do estúdio, depois `mediaProviders` explícito. Tentativas existentes conservam suas escolhas capturadas até nova tentativa explícita; mudar a preferência nunca migra cânone nem reescreve histórico. Uma escolha salva por BytePlus já é decisão explícita de alternativa, sem pedir a mesma escolha novamente.

Novas personas começam com `voice.applicability: unspecified`. Antes do cânone completo, declare `speaking` com `voice.selection` de áudio aprovado exato e evidência real de escuta/seleção, ou `silent` com referência/seleção null e sem fala. Use `docs/operations.md`; preserve campos históricos ausentes e identidade aprovada inalterada sem migração.

Para transferência autorizada compatível de imagem local, o assistente usa `node scripts/reference-transfer.mjs plan <character-id> <spec.json>` e `send <character-id> <transfer-id> <grant.json>` por conta própria, reutilizando autorização aplicável do usuário. Plan/status são offline; `destination` consulta identidade nativa sanitizada sem login/troca. Siga `templates/reference-transfer.json` e `docs/higgsfield-setup.md`. A CLI fixada de Windows x64 envia bytes controlados exatos uma vez; submissões incertas exigem `status`/`reconcile`, nunca repetição automática. Confira separadamente bytes originais no fornecedor e acesso real pelo plugin/módulo: recibo nativo não estabelece prontidão da entrada de mídia. Helpers de sandbox/anexos remotos não leem caminhos locais arbitrários do estúdio.

**Todos os caminhos desta skill são relativos à raiz do projeto OLYMPOX, não à pasta da skill.** Leia `AGENTS.md` e, para um personagem existente, `influencers/<slug>/persona.json` e seu manifesto `influencers/<slug>/assets.json`. Preserve decisões aprovadas e identifique o próximo resultado solicitado.

Carregue apenas as referências necessárias:

- Briefing e persona: `templates/brief.md` e `docs/strategy.md`.
- Imagens, vídeo e voz: `docs/production.md` e `docs/tools.md`.
- Execução BytePlus opcional explícita: `docs/provider-execution.md`.
- Revisão e aprovação: `docs/quality.md`.
- Estrutura, comandos e versionamento: `docs/operations.md`.

Pergunte somente o essencial que estiver faltando. Para escolhas reversíveis, proponha uma direção clara e registre as hipóteses; evite uma entrevista longa.

Para uma nova personagem, use o onboarding curto por conversa de `docs/strategy.md`: ofereça opções de objetivo e estilo de personagem, aceite "pode propor", reutilize respostas fornecidas e apresente opções concretas de conceito antes da geração. Personagens existentes ou um brief completo dispensam a descoberta já resolvida. Não exija comandos especiais ou formulário preenchido.

## Escolher e preservar o método por etapa

Desenvolva conceito, personalidade, narrativa, roteiros e planejamento com o assistente coordenador. Use a escolha explícita salva do estúdio ou da etapa para mídia; Higgsfield é o padrão sem alternativa. Quando Higgsfield estiver escolhido, siga seu método de referência por módulos verificados, separando fonte e adaptações. BytePlus segue a rota opcional abaixo e não comprova equivalência ao Builder ou recursos ausentes. Imagens integradas continuam alternativa explícita; não as use automaticamente. Cada etapa precisa de acesso verificado, entradas exatas aceitas, custo conhecido ou incerteza autorizada, exportação e inspeção. Capacidades ausentes deixam a etapa pendente. O núcleo local prepara sem conexão; instalar nunca autentica nem gera.

Antes da primeira etapa cobrada, confira o caminho completo do piloto: módulos escolhidos, conta/workspace, transporte e reutilização de referências exatas, voz/escuta, movimento/lip-sync, exportação e inspeção completa. Apresente escopo estimado do piloto inteiro, saldo disponível, tentativas/correções limitadas e cobranças desconhecidas. Reutilize autorização aplicável que cubra esse escopo, sem perguntar novamente por cada etapa coberta. Use IDs confirmados de mídia para referências já geradas no fornecedor; para originais locais, verifique uma transferência suportada e autorizada, incluindo a ponte da CLI oficial local quando preparada. Anexo manual é alternativa após verificar rotas automáticas suportadas, não a instrução padrão. Conexão/consentimento pode exigir ação do usuário; nunca contorne restrições do fornecedor ou do host.

Planeje descoberta adaptativa e conceitos distintos quando a direção estiver aberta, exploração visual com personalidade e uma cena em personagem que expresse a premissa, seleção visual pelo usuário, pacote de referências coerentes e revisão de fidelidade, amostra vocal quando necessária enquanto a persona permanece `draft` com `purpose: reference`, aprovação final do cânone visual/vocal completo, piloto antes de lotes, revisão completa de mídia e exportação. Para uma personagem que fala, gere, ouça e selecione a amostra vocal antes da aprovação final do cânone: `canonHash` vincula configurações de voz e referências aprovadas, além da identidade visual. A seleção visual inicial não congela um cânone incompleto. Reutilize voz e cânone já aprovados; para conteúdo silencioso, registre por que voz não se aplica. As referências exatas exigem aprovação do usuário independentemente do fornecedor escolhido; Soul ID continua com justificativa e autorização separadas quando selecionado.

Recupere o método de produção escolhido pelo usuário no pedido, brief, decisões e entradas da execução relevante antes de escolher ferramentas. Um pedido para seguir o mesmo processo de uma referência é um requisito de método, mesmo quando o usuário não repete o nome do fornecedor. Uma referência enviada apenas como inspiração não escolhe fornecedor nem autoriza ações externas.

Prepare um plano versionado com `templates/production-method.md`. Mapeie as etapas solicitadas para fornecedor, módulo, rota de conexão e modelo reais; registre cobertura da fonte, entradas aprovadas exatas, recursos verificados, dependências e pendências. Não afirme que uma transcrição comprova telas não vistas ou um módulo específico. Para o pipeline Higgsfield padrão, um método de referência solicitado ou AI Influencer Builder, aplique `higgsfield-studio` e leia `docs/higgsfield-influencer-method.md` antes de planejar imagens ou vídeo. Um vídeo direto no Kling não comprova uma etapa concluída no Builder.

Salve o plano do método como saída de planejamento ou entrada da execução local aplicável, para que seus bytes tenham hash e sejam observados. Leve-o nos repasses entre especialistas. Instalação e conexão do Higgsfield são etapas separadas de prontidão para produção: o instalador do framework não as executa, autentica ou gera. Um recurso ausente mantém a etapa pendente; prepare o pacote, identifique o que falta e proponha alternativas. A troca para geração externa paga precisa de autorização aplicável; respeite escolhas explícitas de método e preserve autorizações e aprovações anteriores. A ausência de um módulo Higgsfield necessário bloqueia essa etapa de produção; uma alternativa explícita altera o método versionado e a tentativa. O cânone já aprovado continua intacto; novos resultados são candidatos até inspeção, e mudar de fornecedor não exige, por si só, nova aprovação de identidade. Não migre personagens aprovadas nem reescreva registros, mídias, aprovações, backups ou runs históricos. Mudanças no contexto rastreado seguem o procedimento existente de nova tentativa explícita.

## Execução opcional explícita de fornecedor

Quando a escolha salva do estúdio ou uma decisão explícita de etapa selecionar BytePlus, siga `docs/provider-execution.md` e use o executor independente `scripts/provider-execution.mjs` nas operações suportadas. Mapeie modelo real, entradas aceitas e etapas restantes no plano versionado; imagem/vídeo API não comprova Builder, treino, voz canônica, lip-sync ou método completo equivalente. Etapas sem suporte ficam pendentes, sem trocar provedor ou recriar personagem silenciosamente.

Cada consumidor usa conta, acesso a modelos e orçamento numérico próprios. Encaminhe o usuário a `node scripts/provider-connect.mjs byteplus --locale pt-BR` no estúdio instalado para entrada oculta no terminal, ou permita configurar depois. Nunca peça chaves na conversa, argv, JSON público ou arquivos de credenciais editados manualmente. No Windows, o cofre DPAPI CurrentUser fica fora do estúdio em `%LOCALAPPDATA%/OLYMPOX/credentials`; outros sistemas não persistem segredos em texto simples e podem usar entrada oculta em memória por operação. Valores de ambiente `ARK_API_KEY` e `BYTEPLUS_SPEECH_API_KEY` separado substituem credenciais salvas em memória. Status/configuração local não comprova autenticação aceita, elegibilidade de modelos/referências, cobrança, titularidade ou fidelidade da mídia. Instalação permanece offline; configuração local opcional separada não autoriza geração. O assistente prepara registros de request, orçamento, autorização e evidências sem exigir que o criador escreva JSON.

O assistente preenche `templates/provider-request.json`, `provider-budget.json`, `provider-authorization.json`, `provider-reconciliation.json` e `provider-event.json` com contexto real e decisões aplicáveis; templates vazios não autorizam nada. Preserve prompt/parâmetros, papéis/ordem/bytes das referências, cânone/versão e voz escolhida após escuta quando aplicável. Prepare antes de enviar; submeta apenas job correspondente autorizado e preserve intenção, recibos, reservas/resultados. Orçamentos locais reservam USD comparáveis e retêm cobranças incertas, sem garantir teto da fatura externa. Reconcilie job original incerto antes de substituir; não repita geração automaticamente.

A rota inicial aceita entradas locais exatas de imagem/áudio onde suportado; transferência de vídeo local permanece pendente. TTS preset serve apenas a `purpose: reference` para voz draft, sem condicionar por áudio canônico nem clonar voz existente; produção TTS fica pendente. Exporte bytes novos reais, registre, gere o selo e inspecione o resultado completo pelos procedimentos existentes. Resposta API, exportação ou pagamento não aprova cânone, conclui revisão nem autoriza publicação. Trocar fornecedor preserva identidade e usa job/tentativa explícito novo quando contexto vinculado muda. Comprove piloto completo autorizado do consumidor antes de rota principal/lotes.

## Modos de trabalho

**Briefing e persona.** Defina propósito, público, posicionamento, personalidade, voz e limites editoriais. Crie uma pessoa fictícia adulta e original. Quando a direção estiver aberta, proponha três conceitos realmente diferentes, cada um com premissa, assinatura visual reconhecível, atitude, contraste editorial, três ideias de conteúdo e hipótese de compartilhamento. Varie combinações de idade, silhueta, estilo, comportamento e ponto de vista; não reduza as opções a retratos de pessoas comuns atraentes com cabelo ou roupa diferentes. Ligue as escolhas visuais à voz e ao conteúdo repetível. Siga `docs/strategy.md` e use `templates/brief.md`; recomende uma direção com motivos antes de consolidar a identidade.

**Imagem.** Use módulos de imagem/referência verificados do provedor escolhido; Higgsfield é padrão sem alternativa salva ou explícita. Quando Higgsfield estiver escolhido, aplique `higgsfield-studio` e o método versionado, incluindo Builder ou Soul Cinema quando exigidos. BytePlus só executa etapas suportadas verificadas. Imagens integradas exigem decisão explícita. Preserve conceito, idade, silhueta, estilo e expressão; prepare referências neutras e cena expressiva da premissa. O usuário seleciona a identidade visual. Inspecione anatomia, presença e continuidade entre ângulos/cenas. Inspecione referências antes de editar e anexe bytes exatos selecionados ou aprovados nas entradas suportadas; caminho, hash ou menção no prompt não são anexos. Registre bytes realmente fornecidos. Para personagens novos com fala, conclua seleção vocal antes do cânone final. Após aprovação completa, preserve invariantes de rosto, proporções e características distintivas.

**Vídeo e voz.** Consulte a capacidade realmente disponível e `docs/tools.md`, escolhendo ferramentas verificadas para voz, animação, vídeo, sincronização labial e recursos especializados conforme necessidade, qualidade e custo. Para etapas padrão de voz/vídeo pelo Higgsfield, aplique `higgsfield-studio`: um plugin conectado pode ser usado sem CLI local, seguindo `docs/higgsfield-plugin.md`; o uso da CLI segue `docs/higgsfield-setup.md`. Prepare roteiro, cenas, referências e especificações mesmo quando não houver ferramenta de execução conectada. Confirme documentação oficial e schemas atuais quando depender de recursos externos. Descreva claramente o que foi preparado, gerado e verificado; disponibilidade de imagem não prova disponibilidade de vídeo ou voz. Todo método mantém intenção local, referências exatas, IDs de jobs expostos, mídia selada e revisão completa. Geração bem-sucedida não substitui escuta do áudio nem revisão do vídeo completo e de seu áudio quando presente.

**Conteúdo.** Desenvolva conceitos, personalidade, universo narrativo, roteiros e planejamento com o assistente coordenador. Escreva para a persona e o público aprovados: roteiro, legenda, sequência de cenas e direção de atuação. Vincule cada produção ao objetivo editorial e às referências do personagem. Preserve a distinção entre fatos verificáveis e ficção do personagem.

**Qualidade.** Use `docs/quality.md` e inspecione visualmente os resultados. Verifique identidade, anatomia, continuidade, acabamento e adequação ao briefing. Referências usam `candidate`, `approved`, `rejected`; ativos usam `draft`, `production`, `rejected`, conforme inspeção e decisão real. Valores históricos em português continuam legíveis. Validação estrutural e geração bem-sucedida não aprovam identidade ou qualidade automaticamente.

## Operação local

Execute os comandos a partir da raiz do projeto:

```text
node scripts/studio.mjs doctor
node scripts/studio.mjs list
node scripts/studio.mjs new <slug>
node scripts/studio.mjs validate [slug]
node scripts/studio.mjs prompt <slug> <shot.json>
node scripts/studio.mjs check-assets <slug>
node scripts/studio.mjs canon-hash <slug>
```

O comando `prompt` escreve um rascunho na saída padrão; revise-o antes de usar na geração. Use `new` para estruturar um personagem, `validate` para conferir os registros e `check-assets` para conferir arquivos. `canon-hash` calcula o hash na saída padrão e não aprova o personagem. Consulte `docs/operations.md` para campos e procedimentos.

O status da persona é `draft`, `canon-approved` ou `production`. Uma aprovação do canon registra `identityVersion`, revisor, data, notas e `canonHash`. As referências da persona usam caminhos relativos à pasta do personagem, com papel, status e SHA-256; não confunda esses caminhos com os caminhos de documentação relativos à raiz.

Salve novas versões sem sobrescrever referências ou entregas aprovadas. Mantenha rastreabilidade entre persona, referência, cena e resultado. Registre método por etapa, ferramenta/fornecedor reais, modelo quando exposto (caso contrário, desconhecido), prompts, referências anexadas de verdade, arquivos, hashes, custos conhecidos e limitações. Custo monetário desconhecido permanece `cost: null`, inclusive na geração integrada sem custo por imagem exposto; nunca deduza zero pelo acesso à conta. Preserve pendências de limites da conta e disponibilidade. Sele a mídia gerada e revise os arquivos exatos de saída. Nunca simule uma aprovação do usuário ou declare a identidade perfeita por causa de um comando bem-sucedido.

Prepare o trabalho dentro do escopo autorizado. Publicação ou custo externo requer decisão do usuário quando ainda não houver autorização aplicável; não solicite novamente uma autorização já concedida. Não introduza APIs, frameworks ou publicação automática como parte de um pedido de produção criativa.

## Prontidão por etapa

Contratos atuais de geração `0.3.0` exigem `stage-readiness-v1` estruturado antes do início e da conclusão correspondente. O assistente prepara/importa `templates/media-readiness.json` com observações reais por `run-step`, ação `record-media-readiness`; a pessoa não escreve JSON. `readinessPlanPath` opcional vincula um plano offline no início/nova tentativa. Viabilidade do piloto, entradas atuais exatas e resultado concluído são distintos: bytes futuros de voz/cena podem ficar pendentes. Cada etapa necessária exige sua decisão real de método, acesso/esquema, exposição de destino/modelo, preço/incerteza autorizada, autorizações do piloto/etapa, export original e inspeção completa. Desconhecido é pendente, nunca gratuito. Limite da etapa não amplia o teto comparável do piloto, que inclui custos conhecidos capturados de etapas concluídas.

Start informa `stageId` e captura escopo/entradas/preços/autorizações; complete exige captura e evidência correspondente da etapa/provedor/ferramenta/módulo/rota/modelo. Expirar após início válido não impede conclusão correspondente. Status expõe `pipelineReady`, pendências/resultados por etapa, `currentStageReady`, `canStartStage` e identidade da captura. Atualização no mesmo plano acrescenta evidências; mudanças vinculadas exigem nova tentativa explícita. Reconcilie jobs originais não resolvidos antes. Contratos históricos capturados `0.1.0`/`0.2.0` preservam semântica/bytes. Declarações privadas não autenticam acesso/consentimento, impõem teto real de gasto ou provam escuta/qualidade. Veja [o contrato exato de prontidão](../../framework/README.md) para campos, hashes e evidência de transição.
