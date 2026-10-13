# ADR 004 — Execução local opcional de fornecedores

Edição secundária de [004-provider-execution.md](004-provider-execution.md).

Status: Aceito para implementação local após aprovação do usuário, 2026-10-13. Aceitação real do fornecedor e gastos do consumidor permanecem separados.

## Problema e limite verificado

OLYMPOX 0.6.0-rc.1 já preserva escolhas de fornecedor, cânone, bytes de referências, contratos de tarefas, tentativas, prontidão por etapa, declarações de geração e revisões. `scripts/framework-core.mjs` devolve pacotes de tarefas em vez de chamar fornecedores. Seu campo `job` registra uma intenção não resolvida e exige reconciliação; não é uma fila durável de execução. `scripts/stage-readiness-core.mjs` verifica custos declarados de etapas/piloto, mas não reserva orçamento compartilhado concorrente. A transferência Higgsfield é um transporte separado de imagem fixado no Windows, não um adaptador geral de geração.

O usuário aprovou implementar a abstração recomendada no framework reutilizável. Cada estúdio instalado fornece sua própria conta, credenciais, autorização e orçamento. Esta tarefa implementa runtime reutilizável e verificação sintética; não produz um influenciador pessoal nem exige financiamento de piloto do usuário de desenvolvimento.

## Decisão

Adicionar executor local opcional sem dependências e adaptador BytePlus ao lado do core existente. Manter Node 22+, arquivos privados de estúdio e APIs HTTP/crypto/filesystem nativas. Preservar o padrão Higgsfield, fornecedores existentes, workflows capturados e bytes históricos. A instalação continua offline e não autentica, configura credenciais do consumidor, gera, treina ou publica.

O executor responde pela preparação, snapshots imutáveis de entradas, intenção durável, fila, concorrência local, reservas, reconciliação e arquivos exportados. O adaptador responde pelo schema real, combinações de modelo/entrada aceitas, autenticação no momento da chamada, estimativas, submissão/status e metadados sanitizados ou bytes do resultado. Nenhum aprova identidade ou mídia final. Selene prepara/executa a etapa escolhida nessa fronteira; cânone existente e revisão de Têmis continuam responsáveis pela aceitação.

Usar `scripts/provider-execution.mjs` como CLI pública independente. As operações são preparação, submissão explícita, inspeção local jobs/budget somente leitura, consulta explícita de status original, exportação, configuração de orçamento e cancelamento local em fila. Status pode registrar observações do fornecedor e não é inteiramente somente leitura. Cancelamento local não alega cancelamento/reembolso/reconciliação externa. Instalador, diagnóstico e ajuda não iniciam worker nem contatam fornecedor.

A API local é `prepareJob(root, request, {driver})`, `submitJob(root, id, grant, {driver, outputKey, fetch})`, `pollJob(root, id, {driver, outputKey})`, `exportJob(root, id, {fetch, outputKey})`, `reconcileJob(root, id, receipt)`, `cancelJob(root, id, provenance)`, `dispatchQueue(root, {driver, outputKey, fetch, maxJobs = 1})`, `setBudget(root, value)`, `getBudget(root)`, `listJobs(root)` e `readJob(root, id)`. `readProviderInput(root, relative)` lê descritores privados delimitados. `fetch` opcional usa transporte da plataforma. `outputKey` é Buffer de 32 bytes em memória ou função `(medium) => Buffer`; CLI deriva da credencial original por SHA-256 com separação de domínio, sem solicitar/gravar outra chave. Dispatch explícito drena trabalho autorizado; preparação/instalação não o inicia. `status` consulta vídeo original quando aplicável; `readJob`/`listJobs` inspecionam localmente. Sintaxe final fica no guia/teste de ajuda real.

O adaptador inicial fica em `scripts/providers/byteplus.mjs`. Factory: `createBytePlusProvider({fetch, credentials, region, timeoutMs})`, com `capabilities()`, `credentialFingerprint(medium)`, `validate(request)`, `estimate(request)`, `submit(request, {signal})` e `getStatus(receipt, {signal})`. Credenciais têm `apiKey` e `speechApiKey` separados. Adaptador valida schemas/decodifica sem escrever; executor obtém/persiste mídia. Transporte injetável serve a fixtures, não bypass de autorização. Este incremento suporta BytePlus em `ap-southeast-1` e rotas API/CDN permitidas; outro fornecedor exige integração explícita de adaptador/validação/trust do core, não apenas outro token.

## Contrato de solicitação e identidade

Descritor público contém `schemaVersion`, `characterId`, `purpose` (`reference` ou `production`), `medium`, `provider` explícito, `model` exato, `promptPath` local, `parameters`, `references` ordenadas, `hasSpeech`, `destination` não sensível e `runBinding` opcional/null. Identidade do job é gerada na preparação. Referência tem `referenceId`, `path`, `sha256`, `bytes`, `kind`, `role`, `order` e `providerRole` opcional; digest/tamanho fornecidos são comparados aos arquivos reais. Image/audio usam bytes inline exatos; substituições remotas/bindings de vídeo local são recusados neste incremento. Snapshots, parâmetros, payload/endpoint normalizados e governança integram escopo imutável. Preparação captura `providerContractHash`; dispatch compara novamente para impedir defaults/schema diferentes sob grant antigo. Parâmetros/combinações sem suporte são recusados explicitamente.

`reference` permite candidatas e voz draft sem inventar cânone aprovado. `production` vincula personagem aprovado, versão, hash do cânone e snapshot/bytes preservados. O executor revalida contexto/entradas antes do envio e mantém o snapshot capturado. IDs, URLs temporárias, identificadores de treino e validade são bindings de transporte, não substitutos da identidade/arquivos canônicos. Alterar fornecedor, modelo, prompt, parâmetros, referências, destino ou cânone cria outra solicitação/job; recibos, revisões e histórico não são sobrescritos nem herdados como aprovação.

Fala tem escopo explícito. Silent não envia fala. Vídeo speaking existente vincula/envia referência vocal aprovada na rota suportada. TTS preset usa somente `purpose: reference`, MP3 e nenhuma referência de condicionamento vocal: prepara amostra draft, sem comprovar clonagem/preservação. Produção TTS fica pending. Se API não aceita voz canônica, produção fica pending, sem preset/substituição/cânone novo silencioso. Áudio/timbre/lip-sync exigem escuta e revisão completa.

Suporte BytePlus image/video/TTS limita-se às rotas documentadas implementadas/testadas. Um endpoint não comprova TTS, clonagem, treino nem todos os modelos da conta. Restrições de retratos/trusted assets, condição de conta/output original e expiração devem aparecer como limites e ser revalidadas em cada etapa. Aceitação de cânone fictício externo é questão do piloto do consumidor. Não recriar/transformar personagem para contornar recusa de entrada.

## Persistência e ciclo externo

Guardar snapshots/jobs, reservas, bindings, recibos e mídia privada em estado ignorado do estúdio. Ledger compartilhado fica em `work/provider-execution/state.json` sob lock exclusivo; snapshots/recibos por job ficam em `executions/provider-jobs/<id>/` do personagem vinculado, incluídos pelo backup existente. Recusar caminhos inseguros, entradas de outro personagem, links/junctions, entradas/respostas grandes demais e conflitos de destino antes de escrever. Preservar bytes reais em novos arquivos/hashes e usar criação/substituição atômica. Estado privado deve ser excluído por seleção de pacote e verificação de exportação/árvore, não só `.gitignore`.

Persistir grant/hash/reserva antes da primeira submissão. Job em fila é reivindicado uma vez sob lock. Registrar `submitting` antes do bridge/POST. Após resposta, registrar IDs/evidência sanitizada. Interrupção/timeout/ambiguidade vira uncertain. Após reinício, status explícito consulta vídeo original com ID disponível; ausência de ID/lista vazia não prova não submissão. POST incerto não é repetido automaticamente, enviado a outro fornecedor ou reembolsado localmente. Predecessor uncertain/submitting do personagem bloqueia nova tentativa paga.

Status/export são operações explícitas delimitadas; sem daemon, polling/backoff automático ou serviço de rate limit. Chamador pode repetir leitura/status/download sem nova geração respeitando cotas reais. Geração falha/rejeitada exige job/autorização novos e mantém custo histórico. Concorrência/quantidade por dispatch são controles locais, não cotas descobertas da conta. Status completo não prova exportação, aprovação ou workflow concluído.

Metadados aceitos/IDs assíncronos persistem antes de staging; export usa manifesto durável antes de escrever e compara hashes staged/órfãos/exportados. Image/TTS síncronos não têm consulta do job original suportada: interrupção entre metadados e primeira escrita pode deixar resultado/reserva conhecidos sem bytes recuperáveis. Export fica pending para recuperação original/manual suportada. Não repetir geração automaticamente nem prometer recuperação de bytes em toda janela de crash.

Runtime funciona offline: falta de credenciais, capacidade, inputs, grant ou orçamento retorna pending/recusa antes de chamada paga. Segredos vêm do ambiente privado e passam em memória. Região/account labels são declarações salvo descoberta real; não provam titularidade. Não serializar headers, chaves, erros brutos, URLs assinadas em claro ou segredos em jobs/logs/pacote/backups. Locators remotos são ciphertext AES-GCM recuperáveis com `outputKey` derivado da credencial original. Preservar ledger compartilhado e história do personagem juntos; backup só do personagem não reconstrói fila/orçamento/credenciais.

## Limite financeiro

Usar ledger atômico por estúdio/projeto com reservas por job/personagem. Ledger inicial só suporta USD, sem créditos/conversão automática. Distinguir estimativa, máximo autorizado/reservado e cobrança observada. Recusar reserva sem saldo. Desconhecido reserva máximo integral do grant. Estimativa exige `acceptEstimatedCost` explícito; máximo/estimativa não são teto do fornecedor. Teto local limita alocação, não fatura externa.

Reserva e intenção persistem conservadoramente sob lock compartilhado. Crash entre registros mantém reserva até recuperação/reconciliação, sem liberar saldo/repetir envio. Cobrança desconhecida mantém máximo reservado. Custo efetivo só liquida por reconciliação financeira explícita coincidente; tokens retornados não viram fatura adivinhada e falta não vira zero. Job exportado pode ainda exigir reconciliação financeira. Registrar rejeições e resumir por job/personagem/projeto. Limites locais cobrem envios pelo executor; teto do fornecedor, uso externo da conta e cobrança variável são restrições separadas.

## Interoperabilidade com workflow existente

Executor fornece resultados rastreáveis às operações existentes. `runBinding` explícito aciona prontidão/start antes de POST e sincroniza idempotentemente intenção/resultado após ledger. Modelo, parâmetros, conjunto/role/order das entradas e rota/tool/module sanitizados precisam corresponder. Não substitui contrato capturado nem conclui geração/revisão automaticamente. Recibo prova status observado, não viabilidade `stage-readiness-v1` completa/revisão humana. Conclusão/registro/selo/revisão continuam aplicáveis. Incertezas existentes são reconciliadas antes de outra tentativa/rota.

`mediaProviders` continua compatível e com padrão Higgsfield. Futuro contrato por etapa/múltiplos fornecedores pode ser aditivo após esse incremento; driver BytePlus funcional não justifica mudar todo padrão ou alegar seleção inteligente. Seleção começa por capacidades e escolhas explícitas de método/fornecedor.

## Aceitação, adoção e reversão

Verificar entrypoints públicos exportados em estúdios sintéticos e stub HTTP: pedidos/anexos exatos; image, vídeo assíncrono e TTS HTTP delimitado; ausência/redação de credenciais; status/export; interrupção/POST incerto; paths/conflitos; orçamento concorrente/recuperação conservadora; vínculo visual/vocal; históricos; privacidade de instalação/pacote. Executar `npm.cmd run verify`, `node .development/verify-aiox.mjs` e fluxo em estúdio independente derivado de arquivo real. Testes não comprovam acesso real ou fidelidade.

Piloto separado autorizado do consumidor deve provar aceitação de cânone externo exato, exportação original, rosto/corpo/voz estáveis, inspeção completa, custos efetivos e restrições de reuso antes de BytePlus virar principal naquele estúdio. Piloto pessoal ou chamada paga não faz parte desta implementação.

Reversão escolhe fornecedor anterior em nova solicitação/tentativa explícita. Jobs BytePlus existentes mantêm adaptador até reconciliação/exportação; voltar a Higgsfield não os reenvia. Preservar cânone, mídia, snapshots, selos, orçamentos e tentativas. Não rebaixar schemas privados nem reescrever aprovações. Manter artefato anterior revisado disponível. Piloto real, comparação comercial, roteamento automático, scheduling cloud, workers distribuídos, clonagem e treino são follow-ups separados.

## Consequências

OLYMPOX ganha execução API reutilizável preservando core offline e governança. Abstração HTTP não garante portabilidade, equivalência de cobrança ou resultado. Reserva conservadora/resultados incertos podem manter trabalho pending e valores retidos localmente, evitando segunda cobrança não registrada. Esforço limita-se aos modos documentados e worker local; orquestração distribuída fica adiada.

Arquitetura: Aria (`@architect`). Implementação: Dex (`@dev`) com worker do adaptador. QA independente responde pelo gate; Ready/design aceito não implica teste concluído, release ou mídia real aprovada.
