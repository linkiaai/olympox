# Rota de vídeo OpenRouter

Use OpenRouter quando o usuário o escolher explicitamente para uma etapa de vídeo. Escolha Higgsfield ou OpenRouter explicitamente; nenhum vem pré-selecionado. O adaptador OpenRouter atende ao **Seedance 2.5**, modelo `bytedance/seedance-2.5`. Escolher essa rota não migra uma personagem aprovada nem substitui as outras etapas de produção.

O adaptador usa APIs nativas do Node 22+ e `OPENROUTER_API_KEY` do ambiente do processo. Ele não instala SDK do fornecedor, salva a chave, autentica na instalação do framework nem gera automaticamente. Mantenha credenciais fora de especificações, prompts, evidências de prontidão e controle de versão.

## Conferir o modelo escolhido

```sh
node scripts/openrouter-local.mjs doctor
node scripts/openrouter-local.mjs models
node scripts/openrouter-local.mjs model bytedance/seedance-2.5
```

`doctor` confere a presença da variável de ambiente e mostra sua impressão digital de credencial sem expor a chave; não autentica nem comprova identidade de conta/workspace. `models` lê o catálogo público de vídeo e `model` lê metadados dos endpoints sem submeter geração. Atualize os metadados antes de preparar uma etapa paga; um item no catálogo não estabelece acesso, saldo, aceitação de referências da personagem, geração bem-sucedida nem qualidade da mídia. Preparação de mídia, envio, consulta de estado e exportação só funcionam em estúdio instalado independente.

Em 15 de outubro de 2026, o [catálogo público de vídeo](https://openrouter.ai/api/v1/videos/models) retornou `bytedance/seedance-2.5` com ID canônico `bytedance/seedance-2.5-20260807`, durações de 4–30 segundos, saída 480p/720p, suporte a primeiro/último frame, áudio gerado e seed. Listou proporções `16:9`, `4:3`, `1:1`, `3:4`, `9:16`, `21:9` e parâmetros de passthrough `watermark`, `req_key`, `output_format`. Não deduza suporte a 1080p ou 4K a partir de outra variante Seedance.

A [descrição do modelo](https://openrouter.ai/bytedance/seedance-2.5) informa referências de imagem, vídeo e áudio. Verifique separadamente as entradas escolhidas e a política aplicável. Áudio gerado não estabelece identidade vocal reutilizável, seleção de voz nem serviço independente de geração de voz.

## Preservar entradas exatas e autorização

Prepare um [plano de método de produção](../../../templates/locales/pt-BR/production-method.md) e as evidências existentes de [prontidão por etapa](framework-02.md). Registre fornecedor `openrouter`, modelo exato, rota/ferramenta/módulo reais, papéis das entradas, autorização aplicável e incerteza de custo. A rota usa capacidades `video-generation` e `openrouter:video-generation`; elas não implicam geração de imagens nem voz independente.

O assistente prepara a especificação a partir do [template versão 2](../../../templates/openrouter-video-v2.json) e salva uma versão em `work/`, como `work/seedance-video-v002.json`. O [template versão 1](../../../templates/openrouter-video.json) continua aceito para imagens embutidas, com seu contrato original de bytes. Substitua o `credentialFingerprint` null do template pela impressão digital hexadecimal observada por `doctor`. Prepare um prompt UTF-8 em `prompts/` da personagem e referências em `references/` ou `media/`. Defina explicitamente `duration`, `resolution`, `aspect_ratio` e `generate_audio`; `seed` é opcional. Cada referência registra `path`, `sha256`, `bytes`, `referenceId`, `role`, `usage` e `order` a partir de zero. Preserve seu `role` canônico aprovado, como `front` ou `three-quarter`. A versão 2 também registra `mediaType` (`image`, `audio` ou `video`) e `transport`. Caminhos locais são relativos à raiz do estúdio.

Use `usage: "reference"` para orientação mista de imagem, voz e vídeo em `input_references`. Somente imagens podem usar `first_frame` ou `last_frame`; o adaptador recusa combinar frames e referências gerais porque OpenRouter dá precedência aos frames e pode ignorar as referências de áudio/vídeo. Uma execução com cânone de fala deve anexar o áudio canônico exato selecionado como `mediaType: "audio"`, `role: "voice"`, com `generate_audio: true`. A trilha de um vídeo não substitui esse anexo de áudio canônico.

Use fornecedor `openrouter`, modelo solicitado `bytedance/seedance-2.5`, módulo `video-generation`, rota `openrouter-api` e ferramenta `openrouter-local` na etapa de prontidão. Inclua especificação, prompt e referências exatos nas entradas capturadas, com tipos `parameters`, `prompt` e `reference`. IDs, papéis e ordem das referências devem coincidir. Uma execução com cânone aprovado exige referência visual real desse cânone; geração apenas por prompt permanece pendente. Inicie a etapa correspondente com evidências de prontidão e registre intenção externa planejada para `openrouter` antes da submissão. Alterações de prompt, referência, fornecedor, modelo, credencial ou contexto de governança rastreado seguem o procedimento existente de nova tentativa; preserve bytes, aprovações e evidências do job original.

```sh
node scripts/openrouter-local.mjs prepare <spec.json>
node scripts/openrouter-local.mjs send <run-id> <spec.json>
node scripts/openrouter-local.mjs status <run-id>
node scripts/openrouter-local.mjs export <run-id> <output.mp4>
```

`prepare` lê bytes locais, resolve as variáveis de ambiente nomeadas para URLs e confere suas impressões digitais sem rede. Mostra metadados tipados das entradas, hashes, parâmetros e hash da requisição sanitizados, sem bytes nem URLs das referências. `send` exige etapa capturada já iniciada e intenção externa planejada, reconfere suporte no catálogo atual, verifica os bytes HTTPS antes do POST pago e faz uma submissão. Um recibo da personagem em `influencers/<id>/.openrouter/<run-id>/<capture-id>.json` preserva metadados tipados seguros das referências, observações de releitura HTTPS, a tentativa e o ID conhecido do job, e acompanha o backup existente da personagem. Não armazena URLs assinadas nem credenciais. Não há repetição automática de uma submissão cujo resultado possa envolver cobrança. Após interrupção, inspecione o recibo e consulte o mesmo job com `status`; um estado terminal reconcilia o job original no núcleo. Resultado incerto sem ID utilizável permanece pendente de reconciliação por evidência real do serviço; não crie outra cobrança para descobrir o que aconteceu.

`send`, `status` e `export` conferem a chave do ambiente contra a impressão digital vinculada. Preserve acesso à chave original para reconciliação e exportação do job original. Outra chave exige nova tentativa autorizada depois de reconciliar o trabalho original pendente; trocar credenciais nunca autoriza repetir uma cobrança. A impressão digital vincula uma credencial, não identidade verificada da conta nem consentimento do fornecedor.

`export` recupera os bytes da saída concluída em novo `.mp4` dentro de `media/` ou `exports/` da personagem vinculada e recusa destino existente. Depois da exportação, faça o registro normal do ativo, selo de execução e revisão completa; o download não conclui o contrato de geração nem aprova o ativo.

## Transporte de referências

O [guia de vídeo OpenRouter](https://openrouter.ai/docs/guides/overview/multimodal/video-generation) distingue `frame_images` para primeiro/último frame exatos e `input_references` para orientação. Frames prevalecem quando ambos são enviados; escolha explicitamente o modo pretendido para que referências não sejam ignoradas silenciosamente.

A [referência oficial da API de vídeo](https://openrouter.ai/docs/api/api-reference/video-generation/submit-a-video-generation-request) documenta `input_references` de áudio/vídeo para Seedance de geração 2 em diante. A [fonte OpenAPI](https://github.com/OpenRouterTeam/docs/blob/main/openapi/openapi.yaml) define entradas `audio_url`/`video_url` com strings `url` internas; o [guia Seedance 2.5](https://openrouter.ai/blog/insights/seedance-2-5-review/) demonstra referências de vídeo HTTPS. A [fonte da skill de vídeo OpenRouter](https://github.com/OpenRouterTeam/skills/blob/main/skills/openrouter-video/SKILL.md) documenta separadamente data URLs de imagem embutidos. Este adaptador não deduz suporte a áudio/vídeo embutido a partir de um campo URL nem das APIs de compreensão em chat.

Para uma imagem PNG/JPEG/WebP embutida, use `transport: {"kind":"inline"}`. Para referência de áudio ou vídeo, use `transport: {"kind":"https","urlEnv":"OLYMPOX_OPENROUTER_REFERENCE_VOICE_URL","urlSha256":"<64-hex-digits>"}`. A versão 2 também pode enviar uma imagem por HTTPS. A URL fica na variável nomeada do ambiente do processo; a especificação vincula sua impressão digital SHA-256 em vez da URL secreta. Obtenha a impressão digital e a origem sanitizada, sem rede, com:

```sh
node scripts/openrouter-local.mjs reference OLYMPOX_OPENROUTER_REFERENCE_VOICE_URL
```

O assistente obtém acesso HTTPS temporário ou versionado aos bytes locais exatos por uma ferramenta de mídia/armazenamento já autorizada. Este adaptador não faz upload nem provisiona armazenamento. Sem rota adequada, mantenha a etapa de transferência pendente com alternativas; não adote como padrão pedir ao usuário que arraste arquivos manualmente. Chaves ou variáveis de URL ausentes permanecem pendentes e nunca são preenchidas pela instalação do framework. As URLs devem permitir leitura direta sem cabeçalhos personalizados de autenticação. Trate uma URL assinada como segredo e ajuste sua validade/acesso ao job autorizado. Uma impressão digital de URL diferente exige nova tentativa capturada.

Antes de submeter, `send` faz um GET HTTPS limitado e compara hash e quantidade de bytes recuperados com a referência local capturada. Não envia autorização OpenRouter ao armazenamento e recusa redirecionamentos e destinos em redes privadas. Isso observa bytes coincidentes naquele instante; não garante que o fornecedor depois recupere os mesmos bytes, aceite a referência ou preserve a identidade. Um nome de arquivo no prompt não é anexo. Registre separadamente hashes de origem, evidências de transporte e saída observada.

Os formatos locais aceitos são imagens PNG/JPEG/WebP; áudio WAV, MP3, FLAC, Ogg e M4A; e vídeo MP4 contendo uma faixa de vídeo. As assinaturas dos arquivos são reconhecidas e os identificadores de faixas MP4 são conferidos; essas verificações não decodificam nem escutam a mídia. A versão 2 limita cada imagem a 16 MiB, áudio a 32 MiB e vídeo a 64 MiB, com 64 MiB de referências somadas. A versão 1 mantém seu limite agregado de 16 MiB. São limites do adaptador, não limites verificados do fornecedor; confirme os formatos, durações e política aplicável às entradas escolhidas antes de um piloto real.

O passthrough da API usa `provider.options.<provider-slug>.parameters`. O endpoint Seedance conferido é `seed`; opções para outro fornecedor podem ser ignoradas. Este adaptador aceita atualmente apenas os parâmetros normalizados acima e não envia campos de passthrough ou fixação de fornecedor. Preserve a evidência capturada de endpoint/modelo e confira mudanças antes de nova tentativa paga.

## Custo, conclusão e revisão

O catálogo consultado retornou SKUs em USD/token `video_tokens: 0.0000107`, `video_tokens_without_audio: 0.0000107` e `video_tokens_with_video_input: 0.0000064`. São observações datadas, não um teto de gasto. O [guia oficial Seedance](https://openrouter.ai/blog/insights/seedance-2-5-review/) descreve tokens estimados como `(width × height × 24 × duration) / 1024`; a cobrança final usa tokens informados pelo fornecedor. A estimativa de 10 segundos em 1280×720 na tarifa base é cerca de USD 2,31. A cobrança com entrada de vídeo pode depender do material de entrada; o guia descreve pré-autorização fixa de USD 2 nessa rota, que não é preço final nem teto. Considere o material real de entrada e o escopo de saída no orçamento. Custo desconhecido exige autorização com escopo; registre o custo real retornado quando disponível.

Jobs de vídeo são assíncronos: submeta, consulte e baixe. Pare em `completed`, `failed`, `cancelled` ou `expired`; erro transitório na consulta não autoriza nova submissão. URLs de download assinadas são segredos; use a rota autenticada de conteúdo sem expor credenciais nem links assinados temporários nos registros. O guia OpenRouter informa que geração de vídeo é incompatível com Zero Data Retention obrigatório.

Revise o vídeo exportado inteiro e escute seu áudio contra as referências aprovadas e o roteiro. Preserve a voz canônica selecionada, mantenha etapas indisponíveis pendentes e inspecione um piloto antes de lotes. Suporte ao transporte não garante clonagem de voz nem identidade da personagem. Testes locais, conferências estruturais de mídia e catálogo não comprovam comportamento real do fornecedor, identidade, dicção, lip-sync nem continuidade.
