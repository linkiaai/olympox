# CLI Higgsfield local opcional

Use este guia para preparar a rota CLI em estúdio instalado. Um [plugin](higgsfield-plugin.md) conectado executa etapas suportadas sem ela; a CLI pode oferecer operações verificadas separadamente e transferência de arquivos locais. A instalação do framework inclui wrapper e proveniência, mas não instala CLI nem conecta conta.

## Base suportada pelo wrapper

`scripts/higgsfield-local.mjs` exige `@higgsfield/cli` **1.1.26** em `tools/higgsfield`, no **Windows x64**. Ele verifica pacote/versão e SHA-256 do executável antes da execução nativa. Hashes de pacote, instalador e binário estão em `vendor/higgsfield-skills/provenance.json`.

| Comando do wrapper | Comportamento |
| --- | --- |
| `doctor` | Conferir pacote/versão e integridade do executável localmente |
| `version` | Executar comando de versão do binário fixado |
| `help [command [subcommand]]` | Exibir ajuda do wrapper ou tópico nativo aceito |
| `login` | Iniciar login interativo da conta |
| `inspect` | Executar consultas permitidas de conta/workspace/modelo/workflow/voz/job e estimativas somente com parâmetros simples |

O wrapper não instala/atualiza, submete geração, envia arquivos, treina identidade, publica nem imprime tokens. Binário local válido não estabelece acesso à conta ou capacidade audiovisual. Outros sistemas/versões exigem inspeção e adaptação deliberada do wrapper.

## Preparar o pacote fixado

Execute na raiz do estúdio instalado. Mantenha dependência opcional em `tools/higgsfield`, fora do manifesto principal do estúdio.

```powershell
New-Item -ItemType Directory -Path tools/higgsfield -Force
npm.cmd view @higgsfield/cli@1.1.26 version bin scripts repository dist --json
npm.cmd pack @higgsfield/cli@1.1.26 --ignore-scripts --pack-destination tools/higgsfield
```

Inspecione pacote/instalador contra proveniência preservada. O instalador inspecionado obtém arquivo oficial da plataforma, verifica hash esperado e grava executável no pacote. Após essa inspeção:

```powershell
npm.cmd install --prefix tools/higgsfield --save-exact @higgsfield/cli@1.1.26 --ignore-scripts --no-audit --no-fund
```

Antes de executar o `install.js` instalado, compare seu SHA-256 com `cli.installerSha256` em `vendor/higgsfield-skills/provenance.json`. O valor esperado nesta base é `67aa95c60484400e813099affce5a65d374de50ba7efbe2780a4ae9184062261`:

```powershell
Get-FileHash tools/higgsfield/node_modules/@higgsfield/cli/install.js -Algorithm SHA256
node tools/higgsfield/node_modules/@higgsfield/cli/install.js
node scripts/higgsfield-local.mjs doctor
node scripts/higgsfield-local.mjs version
node scripts/higgsfield-local.mjs help
```

`doctor`, `version` e ajuda dispensam login. Mantenha binários e estado da conta fora do Git e exportação. Revise novo pacote/arquivo/binário antes de mudar a versão fixada; instalar pacote mais novo não faz o wrapper aceitá-lo.

## Conectar e inspecionar

Quando conexão estiver autorizada, execute login em terminal interativo. O usuário conclui fluxo do fornecedor no navegador; mantenha credenciais fora do estúdio e backups.

```powershell
node scripts/higgsfield-local.mjs login
node scripts/higgsfield-local.mjs inspect account status
node scripts/higgsfield-local.mjs inspect workspace status
node scripts/higgsfield-local.mjs inspect model list --json
node scripts/higgsfield-local.mjs inspect workflow list --json
node scripts/higgsfield-local.mjs inspect voices list --json
```

Confirme conta/workspace, saldo e capacidades necessárias. Use ID real retornado para inspecionar schema com `inspect model get <model-id> --json`; o marcador não é nome de modelo. Leia ajuda da operação antes de definir parâmetros. Salve apenas evidência necessária da conta localmente, sem credenciais.

## Estimativas e cobrança

Inspecione `help generate cost` e schema atual do modelo. Estimativas nativas com mídia podem enviar arquivos mesmo sem criar job de geração. O wrapper recusa flags de mídia, leitura de arquivos, URLs e flags não suportadas; permite somente parâmetros simples.

Estimativa sem mídia obrigatória pode falhar ou diferir da chamada final. Registre essa limitação. Estimativas com referências exigem autorização aplicável de transferência e entradas nativas suportadas. Caminho em texto comum do prompt permanece texto.

Confira cobrança dessa rota sem presumir franquias do site/API/plugin. Salve cotações com unidade/fonte, saldo disponível, limites de piloto/tentativas e cobranças desconhecidas. O wrapper não impõe teto no serviço. Separe créditos de `cost` monetário do ativo, que continua `null` quando desconhecido.

## Transferir arquivos locais para o plugin

O assistente usa a operação separada de referência exata quando a autorização aplicável do usuário cobre arquivo e destino selecionados. Não precisa pedir que o usuário arraste esse arquivo ao site. Preserve o escopo de leitura do wrapper preparatório.

```powershell
node scripts/reference-transfer.mjs help
node scripts/reference-transfer.mjs destination
node scripts/reference-transfer.mjs plan <character-id> work/transfer-spec.json
node scripts/reference-transfer.mjs status <character-id> <transfer-id>
node scripts/reference-transfer.mjs send <character-id> <transfer-id> work/transfer-grant.json
node scripts/reference-transfer.mjs reconcile <character-id> <transfer-id> [work/transfer-observation.json]
```

Prepare `work/transfer-spec.json` pelo [template da especificação](../../../templates/locales/pt-BR/reference-transfer.json), substituindo todos os marcadores pela referência escolhida, digest e tamanho reais. `source.path` é relativo ao personagem e começa com `references/` ou `media/`; registre ID exato, papel e ordem pretendidos. O limite local do snapshot é 64 MiB. Extensões de imagem reconhecidas: PNG, JPG/JPEG, WebP e GIF; MP4/MOV/WebM e MP3/WAV/M4A/OGG podem ser planejados, mas ficam `awaiting-verified-media-type`. Extensão não comprova decodificação, qualidade ou suporte da entrada no serviço. Esta etapa aceita somente o recibo nativo `image` observado para envio.

`plan` e `status` funcionam offline. O planejamento preserva bytes exatos em `influencers/<character-id>/.reference-transfers/<transfer-id>/`, privado e ignorado, sem chamada ao fornecedor. `destination` lê conta/workspace da CLI nativa instalada e fixada, exibindo somente impressão derivada da conta e ID do workspace. Não autentica nem seleciona workspace. A impressão é SHA-256 do email nativo sem espaços nas pontas e em minúsculas; email e resposta permanecem em memória. Confirme propriedade no plugin separadamente.

ID retornado pelo workspace status nativo é comparado exatamente ao destino pretendido. Campo observado `is_selected` precisa ser boolean; operação não infere validade do contexto por true/false nem altera contexto padrão/pessoal. Shapes diferentes/desconhecidos permanecem pendentes.

A autorização separada contém `schemaVersion: 1`, `transferId`, cópias exatas de `source`, `destination` e `native` da especificação, `approved: true` e `provenance` com `actor`, `at` UTC, `event`, `source` e `notes` descrevendo autorização real do usuário. Não inclua credenciais, email ou URLs. Autorização aplicável já existente na sessão pode fundamentar a declaração sem nova pergunta; aprovação conceitual/do canon sozinha não autoriza transferência. A declaração registra proveniência, não autentica uma pessoa. JSONs privados usam caminhos relativos seguros do estúdio.

`send` recusa checkout de desenvolvimento, links/junctions, originais/snapshots alterados, versão/hash/plataforma nativa incorretos, autorização ausente/divergente e conta/workspace trocados antes do upload. Usa executável 1.1.26 Windows x64 fixado com argumentos separados `upload create <controlled-snapshot> --json`, timeout de 30 segundos e limite combinado de saída de 1 MiB. Persiste `submitting` antes da chamada única e salva somente declaração permitida de fonte/destino e ID/tipo retornados; não imprime nem persiste resposta bruta, email ou URL. Não gera, treina nem publica.

Recibo `uploaded` vincula bytes locais e reconhecimento nativo. `providerBytes`, `pluginAccess` e `generationReadiness` continuam não verificados. Confirme ID pela biblioteca real do plugin e schema da entrada do módulo exato. Compare bytes originais baixáveis quando suportado; documente verificação indisponível/transformações e inspecione fidelidade antes de usar. Upload aceito não comprova que AI Influencer Builder ou outro módulo necessário aceite aquele ID.

Timeout, interrupção, saída malformada, schema desconhecido ou falha de persistência deixam `uncertain`, ou `submitting` preservado após crash. Código de saída 2 indica resultado não resolvido. Não repita, troque rota nem crie outra intenção. `reconcile` consulta biblioteca original por `upload list` paginado e somente leitura; ID conhecido encontrado comprova existência apenas. Linha ausente, timestamp recente ou página vazia nunca comprovam associação à fonte ou não envio. Lock de processo ativo/não inspecionável é recusado; reconciliação pode liberar somente dono local comprovadamente encerrado, mantendo intenção não resolvida.

Para resolver resultado confirmado externamente, forneça observação com `schemaVersion: 1`, `transferId`, `source`, `destination`, `native` exatos e `provenance` real de ferramenta/evento como acima, mais `outcome: accepted` e `mediaId` confirmado, ou `outcome: not-submitted` com `mediaId: null` somente quando o serviço comprovar explicitamente ausência de transferência. Observação aceita também precisa corresponder ao ID na biblioteca nativa. Não derive evidência de ausência nem fabrique declaração pelo timeout. ID conhecido aceito conflita com declaração de não envio. Intenção resolvida/terminal nunca envia novamente; fonte/destino realmente novos usam nova intenção/autorização depois de resolver incertezas. Preserve intenção antiga e bytes preparados.

## Produção autorizada posterior

Prepare canon aprovado, roteiro e entradas de cena/áudio inspecionadas conforme [método de produção](higgsfield-influencer-method.md) e [passagem de vídeo](production-handoff.md). Antes de submeter etapa paga, verifique schemas, transferência, exportação/revisão, preço/orçamento e autorização, depois persista intenção no run.

Produção usa executável nativo fixado com argumentos separados ou arquivo de parâmetros revisado. Nesta base, o caminho é:

```text
tools/higgsfield/node_modules/@higgsfield/cli/vendor/hf.exe
```

Use ajuda atual e entradas verificadas para geração, upload ou treinamento opcional. Tópicos de ajuda do wrapper não significam que `inspect` permite submissões.

Preserve IDs retornados e consulte originais pelas consultas permitidas:

```powershell
node scripts/higgsfield-local.mjs inspect generate list --json
node scripts/higgsfield-local.mjs inspect generate get <job-id> --json
```

Substitua `<job-id>` por identificador real aceito. Reconcilie resultados incertos antes de nova tentativa; mudar para plugin não resolve job CLI. Salve saídas reais como novas versões, registre/sele proveniência e conclua [revisão de qualidade](quality.md) antes da entrega. Treinamento opcional tem justificativa/autorização próprias.

## Fontes de referência

- [Fonte oficial da CLI de referência](https://github.com/higgsfield-ai/cli/blob/v1.1.26/README.md).
- [Revisão preservada da skill do fornecedor](https://github.com/higgsfield-ai/skills/tree/f83af0bc1d937c8119099a11f8ebbf5e6fb99819).
- [Inventário local de fontes e licença](../../../vendor/higgsfield-skills/README.md).

A base é evidência reproduzível de preparação. Contas, schemas, preços e produção bem-sucedida atuais precisam ser verificados no estúdio.
