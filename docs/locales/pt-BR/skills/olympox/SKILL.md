---
name: olympox
description: Criar, dirigir, produzir ou revisar influenciadores de IA memoráveis com potencial de viralização. Novos influenciadores seguem o método completo do Higgsfield AI Influencer Builder, salvo escolha explícita de outro método pelo usuário; preservar identidade, conteúdo e controle de qualidade.
---

# OLYMPOX - AI Influencer framework

Crie personagens originais variados e memoráveis com potencial de viralização, identidade consistente e qualidade verificável. Priorize personagens realistas com personalidade e presença fortes, salvo se o usuário escolher outra linguagem visual. Trabalhe em ciclos de proposta de conceito, geração, revisão visual e aprovação; a geração pode exigir várias tentativas. Potencial de viralização é uma hipótese de conteúdo para testar, não um resultado prometido. As instruções do framework e os novos registros técnicos usam inglês; a voz e o conteúdo da personagem seguem o idioma aprovado para o público.

## Contexto e referências

**Todos os caminhos desta skill são relativos à raiz do projeto OLYMPOX, não à pasta da skill.** Leia `AGENTS.md` e, para um personagem existente, `influencers/<slug>/persona.json` e seu manifesto `influencers/<slug>/assets.json`. Preserve decisões aprovadas e identifique o próximo resultado solicitado.

Carregue apenas as referências necessárias:

- Briefing e persona: `templates/brief.md` e `docs/strategy.md`.
- Imagens, vídeo e voz: `docs/production.md` e `docs/tools.md`.
- Revisão e aprovação: `docs/quality.md`.
- Estrutura, comandos e versionamento: `docs/operations.md`.

Pergunte somente o essencial que estiver faltando. Para escolhas reversíveis, proponha uma direção clara e registre as hipóteses; evite uma entrevista longa.

Para uma nova personagem, use o onboarding curto por conversa de `docs/strategy.md`: ofereça opções de objetivo e estilo de personagem, aceite "pode propor", reutilize respostas fornecidas e apresente opções concretas de conceito antes da geração. Personagens existentes ou um brief completo dispensam a descoberta já resolvida. Não exija comandos especiais ou formulário preenchido.

## Preservar o método solicitado

Para criar novos influenciadores OLYMPOX, o método principal é a sequência completa pelo Higgsfield com AI Influencer Builder para fichas de identidade/referências, salvo escolha explícita de outro método pelo usuário. Planeje descoberta de conceito, fichas do Builder e pacote de referências, seleção visual preliminar e revisão de fidelidade, amostra vocal quando necessária enquanto a persona permanece `draft` com `purpose: reference`, aprovação final do cânone visual/vocal completo, cenas e piloto de vídeo em produção, QA completa e exportação; Soul ID continua com justificativa e autorização separadas quando exigido. Para uma personagem que fala, ouça e selecione a amostra vocal antes da aprovação final do cânone: `canonHash` vincula configurações de voz e referências aprovadas, além da identidade visual. A seleção visual inicial não congela um cânone incompleto. Reutilize voz e cânone já aprovados; para conteúdo silencioso, registre por que voz não se aplica. Aplique `higgsfield-studio` e leia `docs/higgsfield-influencer-method.md` antes de escolher ferramenta de imagem ou vídeo. Esse método principal é a direção atual exigida pelo usuário para o framework; não afirme que o vídeo original de referência usou exclusivamente o Builder.

Recupere o método de produção escolhido pelo usuário no pedido, brief, decisões e entradas da execução relevante antes de escolher ferramentas. Um pedido para seguir o mesmo processo de uma referência é um requisito de método, mesmo quando o usuário não repete o nome do fornecedor. Uma referência enviada apenas como inspiração não escolhe fornecedor nem autoriza ações externas.

Prepare um plano versionado com `templates/production-method.md`. Mapeie as etapas solicitadas para fornecedor, módulo, rota de conexão e modelo reais; registre cobertura da fonte, entradas aprovadas exatas, recursos verificados, dependências e pendências. Não afirme que uma transcrição comprova telas não vistas ou um módulo específico. Para um método de influenciador pelo Higgsfield ou AI Influencer Builder solicitado, aplique `higgsfield-studio` e leia `docs/higgsfield-influencer-method.md` antes de planejar imagens ou vídeo. Um vídeo direto no Kling não comprova uma etapa concluída no Builder.

Salve o plano do método como saída de planejamento ou entrada da execução local aplicável, para que seus bytes tenham hash e sejam observados. Leve-o nos repasses entre especialistas. Instalação e conexão do Higgsfield continuam sendo etapas opcionais de preparação: o instalador do framework não as executa, autentica ou gera. Um recurso ausente no método principal ou escolhido mantém essa etapa pendente; prepare o pacote e identifique o que falta sem recorrer a outro fornecedor de imagem ou geração direta de vídeo. Proponha uma substituição material para decisão do usuário. Preserve autorizações e aprovações anteriores. O cânone já aprovado continua intacto; novas fichas do fornecedor são candidatas até inspeção, e mudar de fornecedor não exige, por si só, uma nova aprovação de identidade. Mudanças no plano rastreado seguem o procedimento existente de nova tentativa explícita.

## Modos de trabalho

**Briefing e persona.** Defina propósito, público, posicionamento, personalidade, voz e limites editoriais. Crie uma pessoa fictícia adulta e original. Quando a direção estiver aberta, proponha três conceitos realmente diferentes, cada um com premissa, assinatura visual reconhecível, atitude, contraste editorial, três ideias de conteúdo e hipótese de compartilhamento. Varie combinações de idade, silhueta, estilo, comportamento e ponto de vista; não reduza as opções a retratos de pessoas comuns atraentes com cabelo ou roupa diferentes. Ligue as escolhas visuais à voz e ao conteúdo repetível. Siga `docs/strategy.md` e use `templates/brief.md`; recomende uma direção com motivos antes de consolidar a identidade.

**Imagem.** Exploração de identidade e fichas de referências de novos influenciadores seguem o método principal Higgsfield Builder, salvo escolha explícita de outro método pelo usuário. Aplique `higgsfield-studio` e verifique os recursos reais de plugin ou CLI antes da execução. Para edições de imagem sem relação com essa criação ou trabalho de imagem dentro do cânone aprovado, escolha ferramentas verificadas que respeitem o método aplicável; a geração integrada de imagens do Codex pode ser usada quando disponível, sem exigir chave de API. Preserve o conceito escolhido no prompt e inspecione se idade, silhueta, estilo e expressão sobrevivem à geração. Prepare referências neutras para fidelidade e uma cena em personagem para presença; um retrato limpo sozinho não demonstra o conceito. O usuário seleciona a identidade visual; para novas personagens que falam, conclua a seleção vocal antes da aprovação final do cânone. Após aprovação completa, edite usando as referências aprovadas e preserve invariantes de rosto, proporções e características distintivas. Registre referências, instruções e versões de cada entrega.

**Vídeo e voz.** Consulte a capacidade realmente disponível e `docs/tools.md`. Para Higgsfield, aplique `higgsfield-studio`: um plugin conectado pode ser usado sem CLI local, seguindo `docs/higgsfield-plugin.md`; o uso da CLI segue `docs/higgsfield-setup.md`. Prepare roteiro, cenas, referências e especificações mesmo quando não houver ferramenta de execução conectada. Confirme documentação oficial e schemas atuais quando depender de recursos externos. Descreva claramente o que foi preparado, gerado e verificado; disponibilidade de imagem não prova disponibilidade de vídeo ou voz. Ambos os caminhos mantêm intenção local, referências exatas, IDs de jobs expostos, mídia selada e revisão completa.

**Conteúdo.** Escreva para a persona e o público aprovados: roteiro, legenda, sequência de cenas e direção de atuação. Vincule cada produção ao objetivo editorial e às referências do personagem. Preserve a distinção entre fatos verificáveis e ficção do personagem.

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

Salve novas versões sem sobrescrever referências ou entregas aprovadas. Mantenha rastreabilidade entre persona, referência, cena e resultado. Nunca simule uma aprovação do usuário ou declare a identidade perfeita por causa de um comando bem-sucedido.

Prepare o trabalho dentro do escopo autorizado. Publicação ou custo externo requer decisão do usuário quando ainda não houver autorização aplicável; não solicite novamente uma autorização já concedida. Não introduza APIs, frameworks ou publicação automática como parte de um pedido de produção criativa.
