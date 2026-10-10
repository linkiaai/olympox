# Transferência exata de referências e aplicabilidade vocal

Estado: Aceita para implementação local delimitada e verificação sintética em 9 de outubro de 2026. A aceitação de produção real permanece separada.

## Requisitos e limites existentes

A avaliação aceita identifica F1, falta de transporte reutilizável das referências exatas, e F2, ausência da aplicabilidade vocal na verificação estruturada anterior ao canon. O usuário quer que uma conversa comum no estúdio transfira os arquivos selecionados sem pedir que ele os arraste para o Higgsfield. Codex e Claude Code coordenam conceitos e registros; etapas verificadas do Higgsfield produzem mídia. Remover um plugin não resolve a lacuna de transporte. Um caminho escrito no prompt não é um anexo.

O framework continua sem dependências externas de execução, com Node 22+. As ferramentas do fornecedor são opcionais e ficam fora dos pacotes para consumidores. O desenvolvimento do framework recusa mutações criativas. Estúdios independentes instalados e fixtures sintéticas exercitam as operações. A instalação não autentica, transfere, gera, treina ou publica. Personagens, aprovações, snapshots, assets, runs e backups existentes mantêm seus bytes e significados originais.

## Baseline verificada de transporte

Manter a baseline oficial `@higgsfield/cli` 1.1.26 Windows x64 e o SHA-256 do executável em `vendor/higgsfield-skills/provenance.json`. O checkout de engenharia não possui instalação do fornecedor; a instalação de um estúdio independente foi inspecionada somente por leitura. Nenhum código de helper, mídia privada ou credencial foi aberto ou copiado.

O [README oficial fixado da CLI](https://github.com/higgsfield-ai/cli/blob/v1.1.26/README.md) identifica upload nativo, comandos de conta/workspace, JSON legível por máquina e ajuda nativa. A ajuda do executável verificado confirma `upload create <file> --json` e `upload list` com `--image`, `--video`, `--audio`, `--size` e `--cursor`. Não existe rota `upload get` verificada. O repositório público fornece documentação e distribuições, não os fontes Go dos comandos; não inventar um adaptador REST por suposição sobre internals.

Consultas autorizadas somente de leitura no host retornaram os seguintes formatos; todos os valores identificadores e URLs foram ocultados:

| Comando / evidência | Chaves e tipos JSON observados |
| --- | --- |
| `account status --json` | `email`: string; `credits`: número; `subscription_plan_type`: string |
| `workspace status --json` | `id`: string; `name`: string ou null; `plan_type`: string; `credits`: número; `is_selected`: boolean; `user_role`: string |
| `upload list --image --size 1 --json` | `cursor`: string ou null; `items`: array de registros com `id`, `type`, `url`, `created_at` |
| Resposta anterior aceita de upload nativo, somente formato | `id`: string; `type`: string; `url`: string; enum não identificador `image` confirmado independentemente |

O mapeamento privado anterior contém campos estruturados de posterior consulta à biblioteca do plugin e comparação do original baixado. Isso estabelece uma rota observada anteriormente, não aceitação real da nova implementação. Identificadores pessoais, bytes originais e código de helper permanecem privados. Formatos de resposta desconhecidos devem recusar confirmação; nunca adivinhar um recibo de sucesso.

O contrato `media_upload` do plugin Higgsfield conectado no OpenAI permite apenas arquivos criados no seu `sandbox_exec` remoto. Seu helper de anexos aceita apenas anexos reais enviados pelo usuário no ChatGPT. Nenhuma rota pode ser apresentada como acesso direto a um arquivo local Windows do estúdio. A CLI nativa fornece o transporte reutilizável delimitado para arquivos locais. Propriedade entre rotas e aceitação por módulos precisam de consultas reais em cada estúdio.

## Decisão F1: operação de transferência autorizada separada

Adicionar um pequeno módulo de core e uma CLI pública de transferência, separados do wrapper de preparação. Manter `higgsfield-local.mjs inspect` sem upload, inclusive estimativas com mídia. Compartilhar ou extrair o resolvedor do executável somente se as verificações atuais de integridade e plataforma permanecerem idênticas. Não criar framework geral de adaptadores, adicionar dependência ao pacote, montar comandos de shell, ler credenciais nem instalar/autenticar/selecionar workspace nessa operação.

Expor preparação local, status, um envio autorizado e reconciliação explícita. Nomes exatos seguem as convenções da CLI na ENG-003. A ajuda deve funcionar sem instalação do fornecedor; a preparação deve funcionar offline. Inspeção de identidade somente por leitura pode retornar fingerprint derivada da conta e ID do workspace sem email ou tokens. O envio nativo usa argumentos fixos, `shell: false`, `windowsHide: true` e timeout limitado.

Uma especificação vincula um personagem, um arquivo em sua árvore `references/` ou `media/`, SHA-256, quantidade de bytes, extensão suportada de imagem/vídeo/áudio, fornecedor/conta/workspace pretendidos, baseline nativa e declaração de autorização aplicável. A autorização nomeia digest/tamanho exatos e destino; aprovação de conceito/canon não autoriza transferência externa sozinha. Reutilizar autorização existente da sessão sem perguntar novamente. O assistente pode preparar a declaração a partir da instrução real do usuário; sua presença não autentica o ator.

Verificar caminhos e tipos antes de escrever ou ler bytes originais: caminhos relativos com barras; recusar traversal, caminhos absolutos, dispositivos, controles, credenciais, instalação do fornecedor, pais/folhas com links, junctions e redirecionamentos equivalentes. Confinar realpath é insuficiente, pois permite links que voltam para dentro do personagem. Recusar o marcador de desenvolvimento antes de mutação ou envio. Recusar links também nos caminhos de registro, lock e staging.

O planejamento salva intenção privada e um snapshot exclusivo e controlado dos bytes. No envio, verificar novamente o original e o snapshot contra digest/tamanho autorizados; mudança do original deve impedir a chamada nativa. Passar o snapshot controlado para a CLI, em vez de um caminho original mutável que foi hasheado antes. Locks e preflight protegem processos concorrentes comuns; hashes/permissões locais verificam integridade, não são fronteira de segurança contra usuário hostil. Preservar snapshots durante resultados incertos.

Imediatamente antes do envio, consultar formatos reais de conta/workspace nativos. Vincular `SHA256(UTF8(email.trim().toLowerCase()))` e o ID exato de workspace ao destino privado esperado. Recusar divergência, identidade ausente, formato inválido, fornecedor ausente, binário/versão alterados ou falha de consulta antes do upload. Nunca trocar automaticamente o workspace selecionado. A fingerprint identifica um valor consultado; não autentica humano nem estabelece propriedade no plugin.

Persistir intenção e estado `submitting` antes da única chamada de upload. Salvar apenas campos permitidos e metadados necessários; nunca imprimir/salvar stdout/stderr brutos, email, credenciais, URLs do fornecedor ou campos arbitrários. Manter somente ID de mídia e tipo necessários ao mapeamento em registros privados ignorados e ocultar identificadores no status comum. A resposta `image` observada tem evidência nativa anterior; outros enums precisam de evidência ou permanecem não suportados. Validar IDs e formato HTTPS comum sem salvar URL; recusar userinfo, credenciais de query/URL assinada e saídas ambíguas. A resposta aceita vincula digest local e recibo nativo; igualdade dos bytes no fornecedor e acesso pelo plugin permanecem não verificados até uma consulta real independente. Recibo de transferência não significa prontidão para geração.

Timeout, interrupção, exit diferente de zero após envio, resposta inválida, formato desconhecido ou falha ao salvar recibo bem-sucedido deixam resultado incerto. Registro `submitting` interrompido permanece não resolvido. Nunca repetir automaticamente, criar outro slot, trocar para plugin ou declarar falha a partir de lista recente vazia. `send` recusa registros já enviados/incertos/terminais. Original/destino alterado exige intenção/autorização nova; intenções anteriores não resolvidas precisam de reconciliação primeiro.

A reconciliação usa a lista nativa paginada verificada, somente por leitura, e um ID conhecido quando disponível, junto de observações explicitamente vinculadas ao original. ID correspondente estabelece existência na biblioteca, não bytes originais exatos ou aceitação no plugin. Sem ID preservado, timestamps, uma linha nova ou uma página vazia não identificam qual upload pertence ao original nem provam ausência; manter incerteza até observação real de serviço/biblioteca resolver. Um recibo confirmado fora da operação pode ser registrado com procedência real de ferramenta/evento, vínculo exato ao original e consulta de destino. Reconciliação nunca chama upload/geração. Não inventar exclusão nem chave de idempotência ausente na CLI.

## Decisão F2: declaração aditiva para identidade nova

Templates novos acrescentam `voice.applicability` com tokens `unspecified`, `speaking`, `silent`, e `voice.selection`, inicialmente null. Manter persona `schemaVersion: 1`; o hash atual do objeto bruto de voz vincula os campos naturalmente. Não injetar defaults em campos históricos ausentes, normalizar JSON antigo ou recalcular aprovação/hash anterior.

Para identidades novas declaradas:

- Draft `unspecified` é preparação válida com aviso pendente; não pode ser aprovado/congelado como canon completo.
- `silent` declara voz não aplicável e exige `voice.referenceId`/`voice.selection` null. Notas da aprovação existente guardam explicação. Produção falada recusa escopo silent mesmo se depois forem acrescentados campos conflitantes.
- `speaking` permanece draft enquanto a escolha estiver ausente. Aprovação completa exige referência vocal canônica aprovada, arquivo de áudio, ID/caminho/SHA-256 exatos e declaração de escolha com `method: listening`, `performed: true`, `generated: true`, `listened: true`, `selected: true`, revisor, timestamp, evento, fonte e notas. Falhas críticas ou limitações pendentes de escuta/inspeção impedem conclusão. A escolha precisa corresponder à referência selecionada e sua revisão aprovada, não apenas conter descrição em texto.

A validação genérica impõe esses campos quando estão presentes. Personas históricas sem eles mantêm validação anterior, hashes de canon, snapshots/backups e uso estático/sem fala. Voz histórica aprovada inalterada pode ser reutilizada na produção existente sem nova aprovação de identidade. A operação não acrescenta voz/aprovação à mesma versão congelada; identidade alterada segue evolução de versão existente.

A task canônica atual `approve-canon` recebe sinal versionado, como `vocalPolicy: explicit-applicability-v1`, e incremento de versão do contrato. `validateFramework` confere o sinal suportado para essa versão atualizada; remover o sinal não enfraquece novos runs silenciosamente. Valores desconhecidos falham quando presentes. Fontes/contratos antigos legítimos continuam distinguíveis pela versão registrada e ausência dessa política aditiva. Na conclusão atual de canon, exigir aplicabilidade explícita mesmo se a validação histórica genérica permitir campo ausente. Usar uma asserção compartilhada para essa verificação e a validação declarada. `nextTask`/critérios explicam pendências vocais. Não é necessário outro orquestrador de geração nem task condicional; exploração vocal ocorre em draft/reference antes do passo canon existente.

Contratos de runs históricos salvos sem sinal mantêm semântica original. Leitura/retomada não aplica task nova retroativamente; mudanças de governança/entradas/fornecedor ainda exigem nova tentativa explícita. Aprovações atuais de `create-character` não podem evitar a verificação apagando `voice.applicability`. Identidades históricas aprovadas existentes usam `produce-piece`, não um fluxo de nova aprovação de personagem. Snapshot direto recusa escopo novo incompleto; apagar deliberadamente todos os campos novos para forjar dado histórico não pode ser inferido pela idade do arquivo e está fora das garantias locais de autenticação de registros.

## Pontos de alteração, testes e limites reais

F1 altera core/CLI/template de transferência delimitados, opcional resolvedor compartilhado de integridade da CLI, `docs/higgsfield-setup.md`, produção/skills/instruções em ambos os idiomas e seleção explícita do instalador/export. Intenções/recibos/staging ficam privados, ignorados e excluídos. A transferência não reescreve lógica existente de studio/canon/asset/run.

F2 altera templates de persona nos dois idiomas, asserção compartilhada em `studio-core.mjs`, contrato atual da task/catalogo traduzido, aprovação atual em `framework-core.mjs` e instruções/guias relevantes de studio/produção/operações/skills. Tokens de máquina continuam inglês. Não reescrever o design do manual.

Fixtures F1 verificam bytes/argv exatos de staging, divergência conta/workspace, ausência de autorização, drift no envio, pais/folhas/junctions com links, caminhos/arquivos/respostas inválidas, overflow/timeout/interrupção, lock/envios concorrentes, intenção antes do envio, crash/reconciliação, ID desconhecido incerto, recusa de duplicidade terminal, ocultação de saídas e recusa sem escrita/chamada de fornecedor. Injeção de testes é seam interna de API; CLI pública/env não selecionam binários arbitrários. Conferir pacote/árvores instaladas reais, notas não relacionadas e metadados Git. Transferência mock não é upload real.

Fixtures F2 cobrem draft, recusa atual por unspecified/ausência, escolha exata escutada, referência/caminho/hash/evento/método errados, pendências, silent/recusa de fala, gates de snapshot/canon, estabilidade de hashes/bytes históricos inglês/português, semântica congelada de tasks históricas, nova tentativa para contexto alterado e produção estática inalterada. Extensões/booleans sintéticos não provam qualidade de áudio, escuta ou identidade humana.

Executar regressões focadas e `npm.cmd run verify`, depois conferir export/instalação reais, privacidade e preservação independentemente. F3 prontidão por etapa, F6 jornadas iniciantes e piloto falado continuam trabalho posterior. Nenhum upload real novo, job pago, autenticação, mutação de conta/workspace, treinamento, publicação ou escrita em repositório remoto faz parte deste incremento. A plataforma verificada da rota nativa é Windows x64; contratos compartilhados/APIs Node não provam macOS/Linux nem paridade real de mídia em Codex/Claude.
