# Execução opcional por provedores

Use um provedor escolhido explicitamente para executar etapas de mídia enquanto o OLYMPOX preserva personagem, cânone, narrativa, tentativas e revisões. Higgsfield continua como fluxo padrão de mídia. Ele não é obrigatório em uma etapa cuja alternativa selecionada tenha entradas, acesso, custo, exportação e inspeção verificados.

BytePlus é uma rota experimental de API direta. Implementação local e verificações sintéticas não demonstram elegibilidade da conta, aceitação de referências da personagem, qualidade de produção ou piloto bem-sucedido com fala. Mantenha etapas não suportadas pendentes e preserve o [método de produção](higgsfield-influencer-method.md) e o escopo escolhido pelo usuário.

O núcleo local continua utilizável offline com Node 22+, sem dependências externas de execução. Instalar ou preparar um estúdio não autentica, submete geração, treina identidades nem publica.

## Configurar credenciais sem editar arquivos

A versão candidata 0.6.0-rc.3 inclui escolha guiada de provedor e configuração privada de credenciais. O setup salva a escolha não secreta em `work/studio-settings.json` e oferece configuração separada depois de instalar e verificar. `--yes` permanece offline e não solicita nem salva segredos.

Na raiz do estúdio instalado:

```sh
node scripts/provider-connect.mjs byteplus --locale pt-BR
node scripts/provider-connect.mjs status
node scripts/provider-connect.mjs help
```

Entre no [console oficial BytePlus e crie/copie uma chave de API](https://docs.byteplus.com/en/docs/modelark/api-key?redirect=1), depois cole-a somente no campo oculto do terminal. Esse login web prepara a chave; não é login OAuth da API de inferência nem comprovação de acesso ao modelo. Confira região/projeto e acesso compatíveis com a rota AP suportada. A chave de voz é separada e opcional para TTS de amostras em rascunho; não implica clonagem nem uso de voz canônica existente.

No Windows, o comando grava um cofre protegido por DPAPI CurrentUser em `%LOCALAPPDATA%/OLYMPOX/credentials`, fora do estúdio. Não edite arquivos de credenciais, use argumentos com chaves ou cole segredos na conversa. Em sistemas sem esse armazenamento protegido, a entrada oculta pode valer somente para a operação atual em memória; não há persistência em texto simples. Você pode configurar depois ou usar o ambiente privado do processo.

O ambiente `ARK_API_KEY` substitui a chave ModelArk salva; `BYTEPLUS_SPEECH_API_KEY` substitui separadamente a chave de voz. `status` informa escolha e configuração locais sem revelar segredos ou chamar a API. Configuração não comprova autenticação aceita, acesso a modelo/referências, cobranças nem fidelidade de mídia. O assistente prepara os registros de request, orçamento e autorização; você não precisa escrever JSON. Configurar não autoriza geração paga.

## Usar a conta do seu estúdio

Consumidores executam esse código reutilizável em seus estúdios instalados independentes. Cada estúdio fornece conta BytePlus, acesso a modelos, credenciais e autorização de gasto aplicável próprios; OLYMPOX não oferece conta compartilhada, chave de API, créditos ou serviço central operado.

As rotas BytePlus suportadas usam `ARK_API_KEY` para ModelArk e `BYTEPLUS_SPEECH_API_KEY` para voz. O executor recebe esses segredos em memória do ambiente privado ou cofre local protegido. Chaves nunca são campos de request JSON, prompts, cânone, jobs, logs, exemplos públicos ou backups do estúdio. Um valor configurado não demonstra elegibilidade da conta nem disponibilidade do modelo.

Localizadores privados de saídas remotas são criptografados para recuperação com a credencial original do consumidor. A CLI deriva a chave de proteção em memória; consumidores não criam nem colam chave adicional nos recibos. Mantenha acesso à credencial original ao recuperar job existente. Outra credencial não muda silenciosamente o destino do job antigo nem abre localizadores registrados, e backups da personagem não contêm essas credenciais.

## Comandos explícitos de execução

Execute a CLI separada na raiz do estúdio instalado:

```sh
node scripts/provider-execution.mjs help
node scripts/provider-execution.mjs capabilities
node scripts/provider-execution.mjs budget
node scripts/provider-execution.mjs jobs
```

`capabilities` informa operações e pré-requisitos suportados pelo driver instalado, sem descoberta real da conta. O assistente prepara arquivos de request, orçamento e autorização a partir do escopo do usuário e observações verificadas; a pessoa não precisa escrever JSON.

| Operação | Finalidade |
| --- | --- |
| `budget <budget.json>` | Definir teto local em USD do estúdio e limites opcionais por personagem |
| `prepare <request.json>` | Preservar request exato e estimativa offline sem submeter |
| `submit <job-id> <authorization.json>` | Submeter um request preparado com autorização explícita correspondente e reserva de orçamento local |
| `status <job-id>` | Consultar job original aceito e preservar estado observado |
| `export <job-id>` | Salvar saídas reais como arquivos draft para registro e revisão |
| `reconcile <job-id> <receipt.json>` | Resolver resultado/custo ambíguo com evidência correspondente do job original |
| `cancel <job-id> <event.json>` | Cancelar preparação/fila local elegível com proveniência; não presumir cancelamento de trabalho remoto |
| `dispatch [maximum-jobs]` | Despachar explicitamente quantidade delimitada de jobs autorizados na fila sem repetir trabalho incerto |

Use o identificador retornado em vez de submeter o arquivo de request novamente. Requests identificam personagem, finalidade, meio, modelo real, prompt/parâmetros, referências exatas, destino e vínculo opcional com workflow. Caminhos devem permanecer no escopo privado permitido do estúdio ou na personagem vinculada; referências usam caminhos relativos à personagem. Preserve evidências do job exportado com registros privados e backup da personagem.

Conserve o ledger privado compartilhado em `work/provider-execution/` e também recibos e snapshots em `executions/provider-jobs/` da personagem. Backups da personagem preservam evidências locais, sem conter toda fila/orçamento compartilhados. Recibos sozinhos não reconstroem ledger perdido; preserve esses arquivos compartilhados separadamente antes de recuperar ou mover um estúdio.

`status` faz consulta explícita delimitada ao job original. `dispatch` processa apenas seleção delimitada de trabalho em fila já autorizado. Não existe daemon de fundo nem serviço automático de polling/backoff; repetir operação de leitura/status/exportação não autoriza nova geração.

Job do executor é separado da tarefa do workflow. Submissão vinculada registra intenção exigida pelos checks existentes de prontidão/start; trabalho auxiliar independente não declara conclusão de tarefa. Exportar não registra ativos, sela execução, aprova cânone, conclui tarefa ou publica automaticamente. Use [operações de ativos](operations.md) e [transições do workflow](framework-02.md) existentes com a evidência realmente retornada.

## Arquivos privados de request e autorização

Copie templates reutilizáveis de [request](../../../templates/locales/pt-BR/provider-request.json), [orçamento](../../../templates/locales/pt-BR/provider-budget.json), [autorização](../../../templates/locales/pt-BR/provider-authorization.json), [reconciliação](../../../templates/locales/pt-BR/provider-reconciliation.json) e [evento](../../../templates/locales/pt-BR/provider-event.json) para o escopo privado permitido do estúdio e preencha com contexto real. Valores vazios/false/zero dos placeholders não concedem autorização de gasto.

O request usa `schemaVersion: 1`:

| Campos | Significado |
| --- | --- |
| `characterId`, `purpose` | Personagem virtual original adulta vinculada; `reference` para explorar ou `production` para cânone preservado aprovado |
| `provider`, `medium`, `model` | `byteplus` explícito, `image`, `video` ou `audio` e ID exato de modelo suportado |
| `promptPath`, `parameters` | Arquivo existente de prompt da personagem/work privado e somente parâmetros suportados pelo provedor |
| `references` | Lista ordenada de `referenceId`, `path` relativo à personagem, `sha256`, `bytes`, `kind`, `role` canônico e `order` iniciado em zero |
| `hasSpeech` | Escopo explícito de fala; áudio exige `true`, imagem exige `false` e `parameters.generate_audio` do vídeo deve corresponder |
| `destination` | `accountLabel` e `region: ap-southeast-1`; o rótulo é declaração, sem descoberta verificada de conta |
| `runBinding` | `null` para trabalho independente ou `runId`, `attemptId` e `stageId` exatos de uma etapa de workflow |
| `voiceReuse` | Declaração atual opcional de escuta para produção falada com cânone histórico sem `voice.applicability`; nunca modifica o cânone antigo |

`providerRole` opcional de referência mapeia papel canônico como `front` ou `voice` para papel de API suportado como `reference_image`, `first_frame`, `last_frame` ou `reference_audio`. Preserve papel/ordem canônicos e bytes exatos separadamente. Entradas locais de imagem suportam PNG/JPEG/WebP, e referências de áudio suportam WAV/MP3. Preparação de TTS predefinido exporta MP3; outros encodings TTS e vínculos de vídeo de entrada permanecem pendentes neste executor.

Cânone histórico falante sem `voice.applicability` exige `voiceReuse` com `method: listening`, `performed: true`, `referenceId`, `path` relativo à personagem, `sha256` exatos, `criticalIssues`/`limitations` vazios e `provenance` real. Escute o áudio preservado aprovado e registre reutilização atual desses bytes exatos. Essa evidência aditiva no request não insere campos no objeto vocal histórico nem reaprova identidade antiga; cânone moderno continua usando seleção vocal estruturada existente. Produção estática histórica não exige reutilização vocal.

Preparação calcula hashes das fontes, captura request normalizado do provedor e governança pertinente do framework e retorna `job-id` e `requestHash`. Mudar prompt, referência, cânone ou contexto normalizado de driver/governança exige novo job preparado e autorização correspondente. Estimativa sozinha não autoriza execução.

Orçamento declara `schemaVersion`, `maximumUSD` positivo, limites `perCharacter` em USD, `maxConcurrent` de 1 a 10 e `provenance`. Autorização declara `schemaVersion`, `requestHash` exato, `explicit: true`, `maximumUSD` positivo, `acceptEstimatedCost: true`, `acceptUnknownCost` explícito, `expiresAt` UTC futuro e `provenance`. Proveniência identifica `actor`, `at` UTC, `eventId`, `source` e `notes` reais; não pode conter credenciais ou URLs privadas.

Reconciliação vincula `schemaVersion`, `requestHash`, `providerJobId` original, `status` terminal, `actualCostUSD` observado e `provenance`. Não substitua ID conhecido do provedor nem reescreva resultado terminal conhecido. `not-submitted` precisa de evidência real de ausência de submissão, nenhum job aceito e cobrança zero; evidência ausente não estabelece nenhum desses fatos. O ledger local registra essas declarações sem autenticar faturas ou o revisor de forma independente.

## Vincular execução à prontidão do workflow

Escolha `byteplus` para o meio afetado em `mediaProviders` do run e prepare plano/observações existentes de prontidão estruturada. Use `tool: olympox-provider-execution`, ID exato de modelo como `module` e token de rota sanitizado do driver:

| Meio | `route` |
| --- | --- |
| Imagem | `byteplus-modelark-image-http` |
| Vídeo | `byteplus-modelark-video-http` |
| Referência de áudio | `byteplus-speech-http` |

Esses valores são tokens; não insira URLs de endpoint no `route` da prontidão. Modelo observado deve corresponder ao request. O driver não descobre identidade verificada de conta/workspace: registre essa exposição de destino como `exposed: false`, `value: null`, com motivo/proveniência reais, sem inventar impressão de conta ou equiparar ao `accountLabel`. Rótulos de conta/região do request são declarações; impressão da credencial é vinculada na submissão/recuperação sem comprovar titularidade da conta. Vincule conjunto exato de prompt, parâmetros JSON e referências, incluindo caminhos/hashes/bytes e papéis/ordem canônicos. Recibo/resumo do job expõe seus metadados de execução para esse vínculo.

Submissão aplica o check existente de `start`/intenção da etapa capturada antes do POST. Status/reconciliação do job original sincroniza resultado externo no workflow; conclusão de mídia, registro, selo e revisão continuam separados. Recibo de provedor não substitui requisitos de prontidão do piloto completo. Veja [operação dos workflows](framework-02.md#prontidao-por-etapa).

## Escopo do driver BytePlus

O driver inicial usa `ap-southeast-1` por origens fixas da API oficial. Seu catálogo delimita a implementação suportada; não verifica elegibilidade da conta:

| Rota | Modelo exposto | Limite |
| --- | --- | --- |
| Seedream 5 Pro | `dola-seedream-5-0-pro-260628` | Uma imagem com até 10 referências de imagem |
| Seedream 5 Lite | `seedream-5-0-lite-260128` | Saídas únicas ou sequenciais; no máximo 14 referências e 15 entradas/saídas combinadas |
| Seedance 2.5 | `dreamina-seedance-2-5-260628` | Criação assíncrona de vídeo e consulta do job original |
| Seed Speech 2.0 | `seed-tts-2.0` | Síntese de referência vocal predefinida em MP3 por rota HTTP de TTS em streaming; sem clonagem, ICL ou workflow WebSocket |

O executor inicial transfere bytes locais exatos de imagem/áudio por entradas inline suportadas quando a operação escolhida os aceita. Transferência de vídeo de entrada fica pendente até haver extensão de transporte verificada, embora o driver subjacente descreva vínculos HTTPS/asset. URL remota de vídeo ou ativo do provedor sozinhos não estabelecem aceitação dos bytes exatos. IDs atuais de modelo são escolhas explícitas, sem aliases que seguem automaticamente um modelo posterior.

TTS predefinido pode criar amostra vocal draft para seleção. Não clona uma voz aprovada existente de outro provedor nem usa amostra canônica como condicionamento de áudio. A rota inicial de presets fica limitada à preparação de referências; produção falada existente que exige áudio canônico permanece pendente nessa rota. Não declare que arquivo local ignorado de áudio foi anexado remotamente. Suporte a referência de áudio do Seedance é capacidade separada e ainda exige revisão completa de escuta/movimento.

## Separar framework e motor de mídia

| Responsabilidade | Evidência necessária |
| --- | --- |
| Identidade e memória da personagem | Versão/hash do cânone aprovado, arquivos exatos de referência visual/vocal e snapshots preservados |
| Direção criativa | Conceito selecionado, narrativa, roteiro, especificação de plano e decisão versionada de método |
| Execução do provedor | Provedor, rota, módulo/modelo reais, entradas aceitas, parâmetros, identificadores de jobs e custos conhecidos |
| Entrega da mídia | Bytes realmente exportados, SHA-256, ativo registrado e contexto de execução selado |
| Qualidade e publicação | Inspeção aplicável completa, aprovação do arquivo exato e autorização/evidência separadas para publicação |

Um modelo de API não é a memória persistente da personagem. Forneça as referências exatas necessárias em cada operação. Rótulo de modelo, seed, descrição textual ou job concluído não estabelece continuidade. Fichas do Builder, geração de imagens/referências, treinamento de identidade, voz e vídeo continuam como capacidades distintas; substitua apenas etapas realmente suportadas pela rota escolhida.

## Verificar a rota completa antes de trabalho pago

Prepare o [plano de método](../../../templates/locales/pt-BR/production-method.md) e a [prontidão por etapa](framework-02.md#prontidao-por-etapa) a partir de observações reais. Verifique conta/workspace pretendidos, papéis/ordem aceitos das referências e schema atual, exposição real do modelo, preço ou incerteza explicitamente aceita, autorização aplicável, exportação dos bytes originais e suporte à inspeção.

Capacidades registradas restringem a conclusão do workflow; não descobrem ferramentas nem provam que uma conta funciona. Um driver configurado também não prova disponibilidade de todo modelo ou etapa anunciado. Falta de acesso à conta, aceitação de referências, voz, exportação ou inspeção mantém a etapa correspondente pendente. Não substitua outra rota silenciosamente.

Mantenha credenciais no mecanismo privado de ambiente/configuração do provedor escolhido, fora de prompts, cânone, evidências do run, guias públicos e backups. Erros e recibos do provedor não devem expor segredos ou respostas brutas da conta. Configure e execute mídia real em estúdio instalado independente; desenvolvimento do framework usa fixtures sintéticas.

## Preservar entradas visuais e vocais exatas

Vincule personagem, versão/hash do cânone, arquivos de prompt/parâmetros e anexos reais antes da submissão. Registre bytes/hash das entradas, papel/ordem e identificadores do provedor quando expostos. Nome de arquivo local ou declaração de URL não prova que esses bytes chegaram à operação. Verifique transformações e limitações explicitamente. Alterar entradas, provedor, modelo ou método vinculados exige o [procedimento existente de nova tentativa](framework-02.md#retomar-trabalho-e-revisar-mudancas-de-contexto).

Para uma personagem existente, imagem de novo provedor é candidata derivada até a inspeção. Não substitua referências aprovadas, reescreva histórico ou regenere outro rosto para atender a uma restrição de API. Se o cânone exato não puder ser utilizado, mantenha a etapa pendente e apresente a adaptação necessária para uma decisão material.

Para personagem com fala, use a seleção vocal aprovada e verifique se a rota aceita a referência exata de áudio aplicável. Fala nativa gerada ou direção de timbre sozinhas não estabelecem a voz aprovada. Personagens novas permanecem `draft` durante geração, escuta e seleção da amostra vocal; escopo silencioso é explícito e não autoriza fala. Confira pronúncia, sotaque, ritmo, sentido e lip-sync em português quando pt-BR for o idioma pretendido. Veja [preparação do cânone](production.md#concluir-canon-visual-e-vocal) e [qualidade](quality.md).

## Restrições de retratos da BytePlus

O [guia oficial de ativos de retrato](https://docs.byteplus.com/en/docs/modelark/seedance-portrait-asset-guide) documenta restrições de referências com rostos humanos reais para Seedance 2.5/2.0. Sua rota de saídas confiáveis do ModelArk depende de saídas originais suportadas da mesma conta dentro do prazo declarado de 30 dias; materiais de outra plataforma/conta e cópias editadas não adquirem essa elegibilidade. Avatares predefinidos não estabelecem uma personagem existente específica, e ativos de pessoas reais verificadas têm procedimento próprio de autorização.

Essa regra não prova que todo rosto fictício gerado externamente seja rejeitado ou aceito. Verifique referências e classificação reais da personagem na conta pretendida antes de adotar a rota. Elegibilidade vinculada à origem do provedor ou à conta pode restringir portabilidade mesmo com interface intercambiável de adaptador. Mantenha essas limitações no plano de método e nas evidências; não recrie o cânone automaticamente dentro do provedor.

## Separar execução e aprovação

Persista intenção e escopo exato autorizado antes da submissão. Preserve identificadores originais de request/job. Timeout ou resposta interrompida não prova ausência de job pago. Consulte e reconcilie o original antes de outra submissão; nunca repita automaticamente uma geração ambígua por outro provedor.

Recuperação depende de estado durável preservado e resultados disponíveis no provedor. Vídeo assíncrono pode consultar ID original e renovar localizadores sem gerar novamente. Respostas síncronas de imagem/TTS não têm consulta suportada do job original: queda do processo após registrar metadados do resultado e antes de salvar os primeiros bytes pode deixar resultado conhecido e reserva retida, sem saídas locais recuperáveis. Exportação permanece pendente de recuperação suportada no provedor original/manual. Não regenere automaticamente para preencher essa lacuna nem declare restauração de todos os bytes em toda janela de queda.

Registre custos com unidades e proveniência. Custo desconhecido não é gratuito, créditos não são valor monetário sem conversão justificada e preço não é autorização. Inclua tentativas rejeitadas, correções e trabalho em voo ao conferir orçamento aplicável. Contabilidade local não descobre chamadas fora do caminho registrado nem substitui a fatura real do provedor.

O ledger inicial do executor usa USD. Separe estimativas offline, máximo explicitamente autorizado, reservas retidas e cobranças reais observadas. Cobrança final desconhecida conserva reserva até reconciliação sustentada; job concluído ou exportado não estabelece custo zero ou final por si. O teto local cobre submissões desse executor, sem comprovar limite de gasto imposto pelo provedor.

Exporte saídas reais como novos arquivos, registre e sele, depois inspecione mídia completa em relação ao cânone e roteiro exatos. Imagens exigem revisão visual, áudio exige escuta e vídeo exige revisão integral de movimento/áudio. Resposta bem-sucedida de API ou hash válido não aprova o ativo. Correções, edição e compressão criam novas versões para revisão.

## Comprovar piloto antes de mudar padrões

Use piloto representativo no meio pretendido e mantenha identidade, referências, cena, roteiro, duração, resolução, proporção e critérios de revisão comparáveis. Registre diferenças de versão real do modelo, entradas aceitas, processamento de prompt e pós-processamento em vez de assumir resultados iguais por nomes comerciais iguais.

Avalie custo por saída aprovada, incluindo tentativas descartadas, junto de continuidade, voz, movimento, latência e esforço de correção. Falhas críticas impedem aprovação independentemente de nota média. BytePlus continua experimental até a rota pretendida passar pela aceitação de referências reais e mídia completa; configurar alternativa não muda o padrão atual.

Para voltar a uma rota escolhida anteriormente, reconcilie jobs pendentes primeiro e crie nova tentativa explícita com motivo. Preserve entradas, saídas, custos, decisões e histórico anteriores. Consulte [operação dos workflows](framework-02.md), [produção](production.md) e [qualidade](quality.md).
