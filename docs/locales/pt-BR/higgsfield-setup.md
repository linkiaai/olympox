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

Confira ajuda nativa atual de upload e confirme conta/workspace pretendidos nas duas rotas:

```powershell
node scripts/higgsfield-local.mjs help upload create
```

Com arquivo/hash exatos e autorização aplicável, use `upload create <local-file> --json` no executável nativo fixado. É transferência externa; o wrapper preparatório não a oferece como `inspect`.

Registre caminho, SHA-256/tamanho, resposta e ID/URL retornados. Confira disponibilidade pelo plugin antes do uso. Compare bytes originais baixáveis quando suportado; documente transformações ou verificação indisponível e inspecione fidelidade. Use entradas mapeadas confirmadas nos papéis aceitos. O framework fornece procedimento, não ponte automática ou prova de acesso entre rotas em toda conta.

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
