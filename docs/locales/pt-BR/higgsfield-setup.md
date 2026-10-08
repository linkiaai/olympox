# Preparação local opcional da CLI Higgsfield

Este guia cobre o caminho opcional da CLI local. O Higgsfield também é suportado pelo plugin do aplicativo, seguindo o [guia do plugin](higgsfield-plugin.md), sem exigir CLI local. Os caminhos compartilham requisitos de cânone, rastreabilidade, autorização, preservação e revisão; sessões de conta, comandos, recursos e cobrança devem ser conferidos para o caminho selecionado.

A instalação do framework fornece uma skill, um wrapper, guias e proveniência de fontes do fornecedor; cada estúdio que escolher a CLI a instala e conecta sua própria conta separadamente. A instalação não instala nem autentica o plugin ou a CLI, envia mídia ou exige geração paga. A base documentada do wrapper é a CLI **1.1.26** em Windows x64. Fontes e instalador de referência foram revisados em **7 de outubro de 2026**; confira novamente termos e capacidades do fornecedor antes de usar. Este suporte conversacional é operado pelo Codex, sem adaptador automático no núcleo.

## Base suportada e requisitos do estúdio

| Item | Base ou requisito |
| --- | --- |
| CLI oficial | `@higgsfield/cli` **1.1.26** esperado pelo wrapper; instale separadamente em `tools/higgsfield` |
| Binário | Windows amd64, build `69f3a33c3325d8fdde3a1ecb0b8e7cc5ebc7e8a3`; archive SHA-256 conferido pelo instalador inspecionado |
| Wrapper do estúdio | `scripts/higgsfield-local.mjs`; ajuda, versão, integridade e consultas limitadas |
| Fonte de skills | Geração `0.13.0` preservada em `vendor/higgsfield-skills`, revisão e hashes registrados; original não ativada em `.agents` |
| Conta e acesso ao fornecedor | Sua própria conta, conectada após a preparação da CLI |
| Saldo e custo por modelo | Consulte sua conta antes da produção autorizada |
| Vídeo, voz e Soul ID | Exigem execução autorizada separadamente, referências exatas e revisão completa |

Prepare a CLI fixada pelas etapas de instalação abaixo antes de executar as verificações do wrapper. A preparação local não prova disponibilidade de modelos na sua conta, consistência de personagem, qualidade audiovisual nem acesso do Codex a uma skill ainda não carregada. Imagens candidatas podem usar a ferramenta integrada do Codex quando disponível, respeitando o processo de escolha da identidade.

## Comandos de preparação

Execute da raiz do projeto:

```powershell
node scripts/higgsfield-local.mjs doctor
node scripts/higgsfield-local.mjs version
node scripts/higgsfield-local.mjs help
node scripts/higgsfield-local.mjs help auth login
node scripts/higgsfield-local.mjs help generate cost
```

`doctor` confere presença, versão e SHA-256 do executável. Não acessa credenciais, não prova autenticação e não consulta saldo. O wrapper recusa versão/binário diferentes dos inspecionados. Ele não instala, atualiza, gera, faz uploads, treina, publica nem imprime tokens. Um erro de consulta ou timeout não comprova problema com a conta; interpretar a mensagem real do CLI.

## Conectar sua conta

Quando o usuário solicitar a conexão, executar no terminal interativo:

```powershell
node scripts/higgsfield-local.mjs login
```

O CLI usa login no navegador por OAuth PKCE com callback local, conforme sua ajuda. O usuário conclui a interação. Não coletar senha na conversa, não executar `auth token`, não copiar credenciais para `.env`, fichas de personagens, runs ou commits, e não alterar HOME/APPDATA para guardar sessão no projeto. A ajuda pública consultada não expõe o caminho exato do arquivo de credenciais; confirmar o local efetivo do armazenamento antes de concluir a conexão, mantendo-o fora do workspace e dos backups. A instalação do framework não contém uma sessão de conta.

Depois consultar apenas o necessário:

```powershell
node scripts/higgsfield-local.mjs inspect account status
node scripts/higgsfield-local.mjs inspect workspace status
node scripts/higgsfield-local.mjs inspect model list --json
node scripts/higgsfield-local.mjs inspect workflow list --json
node scripts/higgsfield-local.mjs inspect voices list --json
```

Confirmar conta e workspace corretos, plano, créditos e recursos. A saída de conta pode conter email; registrar só os dados necessários à produção e não copiar identificadores privados para documentação pública. Selecionar outro workspace altera a cobrança de pedidos futuros e precisa de decisão aplicável; o wrapper não oferece essa alteração.

Inspecionar o schema exato dos modelos candidatos antes de prometer parâmetros ou duração:

```powershell
node scripts/higgsfield-local.mjs inspect model get seedance_2_5 --json
node scripts/higgsfield-local.mjs inspect model get kling3_0 --json
```

Esses IDs são candidatos de documentação, não modelos já confirmados para a conta. A escolha final considera referência admitida, idioma/fala, movimento, resolução, tempo e custo, seguida de piloto com a identidade aprovada.

## Créditos e estimativa

[CLI e skills](https://higgsfield.ai/creator-hub/help-center/integrations/how-do-i-access-higgsfield-via-cli) usam conta e créditos Higgsfield, sem API key. Unlimited e gerações gratuitas do site não se aplicam a CLI/MCP; assinatura e API são produtos distintos. Conferir esses termos novamente ao assinar e antes de produção.

O comando oficial `generate cost` estima sem criar job, mas **envia automaticamente arquivos locais usados como entrada de mídia**. Não tratar uma estimativa com `--image`, `--video` ou outra mídia como operação exclusivamente de leitura. O wrapper aceita só parâmetros simples e recusa flags de mídia, leitura de arquivos via `@arquivo`, URLs e flags fora da seleção segura. Um caminho passado como texto comum de `--prompt` continua sendo texto; isso não anexa o arquivo. Exemplo de consulta após login, sem submissão ou envio de arquivos:

```powershell
node scripts/higgsfield-local.mjs inspect generate cost kling3_0 --prompt "Consulta de custo para um plano curto" --duration 5 --mode pro --sound off --json
```

Verificar o schema atual antes dessa consulta. Uma estimativa que omite a mídia necessária pode falhar ou diferir do pedido final; não inventar valor nem tratá-la como preço exato. Quando a estimativa precisar das referências, usar o CLI nativo somente após autorização aplicável para enviá-las e com os arquivos exatos já aprovados.

O orçamento do piloto deve registrar saldo inicial, custo consultado por tentativa, limite total de créditos e número máximo de tentativas. O wrapper de preparação não controla nem garante esse orçamento no serviço. Sem custo consultável, registrar “desconhecido” e obter autorização que contemple essa incerteza antes do job; não confundir preço de assinatura com custo por ativo aprovado.

## Produção autorizada depois

1. Escolher a persona; aprovar referências exatas e criar snapshot do cânone. Preparar narrativa, roteiro, cenas e voz sem confundir rascunho com aprovação.
2. Conferir schema atual, direitos/consentimento dos inputs, saldo e orçamento aplicável. Referências locais anexadas ao CLI podem ser enviadas automaticamente ao serviço.
3. Antes de submeter, persistir intenção real no run: ferramenta/modelo, parâmetros, entradas e hashes, objetivo e limite. O núcleo local registra contexto, mas não bloqueia diretamente o serviço. Somente usar uma autorização de geração válida para esse escopo.
4. Invocar o executável nativo local com argumentos separados ou arquivo de parâmetros revisado. Local do Windows x64:

   ```powershell
   & .\tools\higgsfield\node_modules\@higgsfield\cli\vendor\hf.exe generate create <confirmed-model> <reviewed-parameters>
   ```

   Substitua o modelo confirmado e os parâmetros revisados somente para execução autorizada. Não use `npx @higgsfield/cli` para uma chamada de produção, pois pode baixar outra versão. `--wait` pode aguardar vários minutos; conserve IDs assim que expostos e acompanhe a execução real.
5. Registrar job/request conhecido, recebimento e custo exposto. Se a resposta ficar incerta, preservar a pendência e consultar o job antes de reenviar. Consultas permitidas pelo wrapper:

   ```powershell
   node scripts/higgsfield-local.mjs inspect generate list --json
   node scripts/higgsfield-local.mjs inspect generate get <actual-job-id> --json
   ```

   Mudar para o plugin não reconcilia uma submissão incerta da CLI nem autoriza outra cobrança. Use uma ferramenta real de status que consiga inspecionar o job original e registre a reconciliação antes de qualquer nova tentativa.

6. Salvar a mídia em nova versão na persona, registrar e selar execução. Fazer revisão completa do vídeo e áudio com método realmente disponível, registrar falhas e aprovações reais. Uma URL concluída, hash ou teste local não prova qualidade nem publicação.

Soul ID não é pré-requisito para o primeiro piloto. Só considerar treinamento quando o teste com referências demonstrar necessidade; autorização para assinatura ou geração não implica autorização para treinar/clonar identidade.

## Preparar a CLI fixada

A base do wrapper usa um pacote npm oficial fixado, instalado sem scripts automáticos de ciclo de vida. O `postinstall` inspecionado baixa um arquivo da release oficial, verifica SHA-256 incluído no pacote, extrai somente `hf.exe` e grava metadados dentro do próprio pacote. Não altera PATH nem configurações globais. Metadados e hashes das fontes: [proveniência](../../../vendor/higgsfield-skills/provenance.json).

Para preparar seu estúdio, confira o ambiente Windows x64 e o pacote antes de instalar:

```powershell
npm.cmd view @higgsfield/cli@1.1.26 version bin scripts repository dist --json
npm.cmd pack @higgsfield/cli@1.1.26 --ignore-scripts --pack-destination tools/higgsfield
```

Criar a pasta local se ausente; inspecionar pacote e instalador contra os hashes/proveniência. Não seguir automaticamente `curl | sh`, `setup`, instalação global ou teste pago do fornecedor. Depois da inspeção, instalar **somente o pacote pinado** no prefixo local com `--ignore-scripts`, e executar explicitamente o `install.js` inspecionado a partir de `tools/higgsfield/node_modules/@higgsfield/cli`. Conferir `doctor`, versão e ajuda. O arquivo `tools/higgsfield/package.json` local deve conter o pin `@higgsfield/cli: 1.1.26`; não adicionar a dependência ao package.json do estúdio.

Comandos após essa inspeção, sem instalação global:

```powershell
npm.cmd install --prefix tools/higgsfield --save-exact @higgsfield/cli@1.1.26 --ignore-scripts --no-audit --no-fund
node .\tools\higgsfield\node_modules\@higgsfield\cli\install.js
node scripts/higgsfield-local.mjs doctor
node scripts/higgsfield-local.mjs version
```

Execute o instalador explicitamente só depois de conferir que o `install.js` instalado corresponde ao script inspecionado. O instalador de referência inspecionado tem SHA-256 `67aa95c60484400e813099affce5a65d374de50ba7efbe2780a4ae9184062261`. A versão e a ajuda não exigem login; encerre aqui a instalação preparatória.

Ao atualizar, repetir inspeção, verificar novo archive/binário e ajustar o pin de forma deliberada. A pasta de ferramentas é ignorada pelo Git; preservar fontes do estúdio e arquivos de proveniência, não credenciais ou binários grandes.

## Fontes oficiais consultadas

- [CLI: instalação Windows por npm e comandos](https://github.com/higgsfield-ai/cli/blob/v1.1.26/README.md).
- [Release 1.1.26](https://github.com/higgsfield-ai/cli/releases/tag/v1.1.26) e pacote npm `@higgsfield/cli@1.1.26`.
- [Instalação das skills](https://github.com/higgsfield-ai/skills/blob/f83af0bc1d937c8119099a11f8ebbf5e6fb99819/INSTALL.md).
- [Skill generate e referências inspecionadas](https://github.com/higgsfield-ai/skills/tree/f83af0bc1d937c8119099a11f8ebbf5e6fb99819/higgsfield-generate).
- [Integração CLI + Skills e regras de créditos](https://higgsfield.ai/creator-hub/help-center/integrations/how-do-i-access-higgsfield-via-cli).
- Ajuda do executável local 1.1.26 para `auth`, `auth login`, `account`, `workspace`, `model` e `generate cost`.
