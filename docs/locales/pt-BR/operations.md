# Registros de personagens, mídia e recuperação

Execute os comandos em [estúdio instalado independente](installation.md), com Node 22+. Eles mantêm registros locais; o assistente gera e inspeciona pelas ferramentas disponíveis. Produção criativa pessoal pertence ao estúdio, fora da cópia de desenvolvimento.

## Criar um draft

```sh
node scripts/studio.mjs new my-persona
node scripts/studio.mjs list
node scripts/studio.mjs validate my-persona
```

`new` prepara a pasta completa antes de disponibilizá-la e recusa destino existente ou criação concorrente. Preencha `brief.md` e `persona.json`, depois registre escolhas e cronologia em `decisions.md`. Campos draft podem ficar pendentes; validação distingue erros estruturais de campos ainda não definidos.

| Arquivo ou diretório | Finalidade |
| --- | --- |
| `persona.json` | Âncoras de identidade, voz, contexto editorial, referências e aprovação do canon |
| `brief.md`, `decisions.md` | Objetivo, hipóteses, decisões e cronologia |
| `assets.json` | Manifesto de mídia, origem, hashes e revisões |
| `references/candidates/`, `references/canon/` | Arquivos candidatos e aprovados de referência |
| `media/candidates/`, `media/approved/`, `exports/` | Tentativas, versões aprovadas e entregáveis finais |
| `prompts/` | Especificações de shots e prompts exatos |
| `canon/`, `executions/` | Identidade congelada e contexto de execução |
| `narrative/`, `content/` | Registros editoriais versionados |

Ficam em `influencers/my-persona/`. Caminhos em persona, shot, manifesto e registros editoriais são relativos à pasta da personagem, com `/`. Entradas/saídas de runs usam caminhos relativos à raiz do estúdio. Caminhos com `..` ou que escapam da pasta aplicável são recusados. Copie referências permitidas para a personagem e conserve a origem.

## Referências e aprovação do canon

O assistente edita `persona.references`; não existe comando CLI separado para cadastrar referência ou aprovar canon. Cada referência exige:

| Campo | Valor |
| --- | --- |
| `id`, `path` | ID único e arquivo real relativo à personagem |
| `role` | `front`, `three-quarter`, `profile`, `full-body`, `expression` ou `voice` |
| `status` | `candidate`, `approved` ou `rejected` |
| `origin` | Contexto real de ferramenta/origem e permissão aplicável |
| `sha256` | Hash do arquivo exato |
| `review` | Referências aprovadas exigem `reviewer`, data ISO `at` e `notes` reais |

Calcule hashes com:

```sh
node scripts/studio.mjs file-hash my-persona references/canon/front-v1.png
node scripts/studio.mjs canon-hash my-persona
```

Seleção visual pertence ao usuário e segue [inspeção de qualidade](quality.md). O mínimo estrutural é vista frontal aprovada e vista three-quarter ou profile aprovada; produção pode precisar de conjunto coerente mais amplo. Personagem falante também precisa de referência vocal gerada, ouvida e selecionada. Aponte `voice.referenceId` para essa entrada `voice` aprovada. Descrição sozinha não estabelece voz.

Novos rascunhos começam com `voice.applicability: "unspecified"` e `voice.selection: null`. Mantenha a preparação em `draft` até escolher `speaking` ou `silent`; escopo unspecified não conclui o cânone. Para `silent`, deixe `voice.referenceId` e `voice.selection` null e explique o escopo nas notas existentes de aprovação/decisão. Cânone silent permite imagens e vídeo sem fala; fala exige o procedimento de versão de identidade e aprovação.

Para `speaking`, selecione uma referência `voice` de áudio aprovada (`.wav`, `.mp3`, `.m4a`, `.ogg` ou `.flac`) com revisão válida. Registre o evento real de escuta/seleção em `voice.selection`, substituindo os valores do exemplo por evidência observada:

```json
{
  "referenceId": "voice-v1",
  "path": "references/canon/voice-v1.wav",
  "sha256": "<SHA-256 exato registrado>",
  "method": "listening",
  "performed": true,
  "generated": true,
  "listened": true,
  "selected": true,
  "reviewer": "<responsável pela escuta>",
  "at": "<timestamp ISO>",
  "eventId": "<evento real de seleção>",
  "source": "<ferramenta ou fonte real da decisão>",
  "notes": "<notas reais de escuta e seleção>",
  "criticalIssues": [],
  "limitations": []
}
```

A seleção deve vincular o mesmo ID, caminho e SHA-256 de `voice.referenceId` e sua referência aprovada; bytes alterados, evidência incompleta ou pendências impedem o cânone completo. O evento de escuta pode diferir do evento de aprovação da referência. Declarações comprovam consistência local, não escuta real, execução do fornecedor, identidade do revisor ou qualidade.

Personas históricas sem campos de aplicabilidade e contratos antigos salvos mantêm validação e hashes originais; sem inserção de defaults ou migrações. A task `approve-canon` atualizada exige escopo explícito mesmo se o validador genérico aceitar a ausência histórica. Presença de campo/versão é fronteira de compatibilidade, não autenticação: o guard não identifica registros legados forjados deliberadamente nem fonte modificada.

Após decisão real sobre canon completo, escreva `approval` na persona com `reviewer`, `at`, `notes` e `canonHash` retornado; defina status `canon-approved`. O hash cobre ID, versão da identidade, nome/idade, âncoras, voz e dados das referências aprovadas. Evolução editorial não muda esse canon automaticamente. Valide e preserve:

```sh
node scripts/studio.mjs validate my-persona
node scripts/studio.mjs canon-snapshot my-persona
```

Aprovação sozinha não cria snapshot. `canon-snapshot` exige canon aprovado e preserva persona e cópias de referências. Cadastrar ativo sob canon aprovado também cria/reutiliza snapshot. Cada `identityVersion` aceita um único canon congelado. Para mudar identidade, preserve a versão antiga, incremente `identityVersion`, volte a `draft`, inspecione/selecione novas referências e obtenha nova aprovação.

Validação e operações dos fluxos comparam canon aprovado atual com snapshot existente da mesma versão. Trocar hash de aprovação não legitima identidade diferente na mesma versão. Snapshots históricos ausentes não são reconstruídos como evidência; registro aprovado atual sem snapshot ainda pode ser estruturalmente válido.

## Especificação de shot e prompt exato

Copie `templates/shot.json` para `prompts/` da personagem e preencha enquadramento, cena, meio, fala e referências. `purpose: reference` permite explorar identidade draft; `purpose: production` exige canon aprovado. Vídeo/áudio definem duração; produção com fala exige voz canônica. Vídeo silencioso pode ter script vazio.

```sh
node scripts/studio.mjs prompt my-persona influencers/my-persona/prompts/shot-v1.json
```

O comando retorna texto. Salve UTF-8 com ferramenta de escrita; redirecionamento antigo do PowerShell pode gerar UTF-16. Inclui identidade, contexto criativo preenchido do perfil, fala exata e caminhos/hashes das referências. História fictícia permanece contexto fictício.

`referenceIds` vazio seleciona referências visuais aprovadas para imagem/vídeo ou voz canônica para áudio; vídeo com fala também inclui voz aprovada. Prefira subconjunto relevante explícito e aceito pelo módulo. Anexe realmente essas referências na geração e registre evidência de transferência. Prompt não transfere arquivos nem comprova parâmetros de API suportados. Não seleciona fornecedor nem chama modelo. Siga o [método de produção](production.md) salvo.

## Registrar geração e selar o contexto

Salve bytes reais em novo arquivo, depois cadastre:

```sh
node scripts/studio.mjs register my-persona media/candidates/portrait-v1.png image
```

Tipos: `image`, `video` e `audio`. Cadastro acrescenta ativo `draft` com UUID, hash do arquivo, versão e hash do canon. Recusa arquivo já cadastrado; edição exige nova versão.

Em `assets.json`, preencha `provider`, `model`, `referenceIds`, `promptPath`, `promptSha256` e `cost` reais. Se modelo não for exposto, registre isso honestamente. Para vídeo, defina `hasSpeech: true` ou `false`. Imagem/vídeo exige referências visuais; áudio usa apenas vocais; áudio e vídeo falado exigem voz canônica aprovada. Salve o prompt real e calcule hash com `file-hash`.

`cost: null` significa desconhecido. Custo conhecido usa `{ "amount": 1.25, "currency": "BRL" }`, com valor não negativo e moeda de três letras maiúsculas. Separe moedas nos totais. Antes da geração paga, use [intenção de submissão e reconciliação](framework-02.md#submissoes-externas-e-resultados-incertos) e autorização de orçamento aplicável.

```sh
node scripts/studio.mjs execution-seal my-persona ASSET_ID
```

Selar exige cânone aprovado que corresponda à versão e ao hash registrados no asset. A operação usa um snapshot histórico válido ou preserva o cânone atual aprovado correspondente como parte do selo. Durante exploração de identidade em rascunho, mantenha bytes de candidatos/referências, hashes, prompts, origem e registros de inspeção; identidade não aprovada não pode ser selada. Preserve o contexto anterior em vez de reescrever seus hashes para forçar um selo.

Substitua `ASSET_ID` pelo UUID cadastrado. O selo preserva contexto declarado e prompt, vincula canon e registra `executionPath`/`executionSha256`. Detecta alterações posteriores em fornecedor, referências, prompt, custo e outros campos selados. Não prova geração nem inspeção.

## Revisar mídia exata e aprovar uso

Inspecione o ativo completo contra referências e uso pretendido. Salve revisão no manifesto; não existe CLI que inspecione ou promova automaticamente. Campos exigidos para produção:

| Campo | Requisito |
| --- | --- |
| `reviewer`, `at`, `notes` | Responsável real, data ISO e relato da inspeção |
| `method` | Imagem: `visual`; áudio: `listening`; vídeo: `visual-and-audio` |
| `decision` | `approve` para produção; caso contrário `correct`, `reject` ou `pending` |
| `mediaSha256`, `promptSha256` | Mídia inspecionada e prompt executado exatos |
| `canonHash`, `identityVersion` | Canon usado nessa produção |
| `executionSha256` | Selo correspondente em registros atuais v2 |
| `criticalIssues`, `limitations` | Ambas vazias antes de aprovação para produção |

Em vídeo silencioso, documente ausência de áudio e inspecione todo movimento. Falta de acesso a escuta/visualização permanece limitação. Somente após aprovação real, campos correspondentes e ausência de falhas críticas ou inspeções pendentes, defina status `production` e confira:

```sh
node scripts/studio.mjs check-assets my-persona
```

`production` significa mídia revisada elegível no manifesto local, não publicação. Hashes não substituem inspeção nem autenticam responsável. Cortes, legendas, edição e recompressão mudam bytes: salve novo arquivo, cadastre draft, registre contexto e revise exportação final antes da entrega.

## Versionar narrativa e conteúdo

Copie `templates/narrative.json` e `templates/content.json` para arquivos de trabalho. Preencha `characterId` com o slug e dê `id` próprio a cada peça.

```sh
node scripts/studio.mjs narrative-save my-persona influencers/my-persona/prompts/narrative-v1.json
node scripts/studio.mjs narrative-show my-persona
node scripts/studio.mjs content-save my-persona influencers/my-persona/prompts/piece-v1.json
```

Cada salvamento acrescenta versão; versões antigas permanecem intactas. Para aprovar narrativa, envolva os campos em `data` e forneça `review` com `decision: approve`, `reviewer`, `at` e `notes` reais. Sem decisão separada, a narrativa salva fica draft, inclusive se entrada copiada continha aprovação antiga.

Peça vincula versões/hashes de canon/narrativa, scripts, shots, ativos, fontes consultadas, fatos e disclosure. `ready-for-production` exige contexto aprovado, revisão editorial explícita, hashes dos shots e disclosure virtual/comercial definido. Significa preparação editorial, não mídia gerada ou publicada. Validadores conferem estrutura/vínculos de fontes, não verdade dos fatos.

Música com `useInProduction: true` exige evidência consultada de disponibilidade no catálogo e elegibilidade para plataforma, região, tipo de conta e uso antes que peça pronta dependa dela. Registre alternativa viável enquanto pendente; reavalie quando a janela de uso mudar.

## Backups e recuperação

Registros privados e mídia são ignorados pelo Git por padrão. Faça backup de ciclos importantes e mantenha cópia independente fora do disco de trabalho:

```sh
node scripts/studio.mjs backup my-persona
node scripts/studio.mjs backup-verify BACKUP_ID
node scripts/studio.mjs backup-test BACKUP_ID
```

Substitua `BACKUP_ID` pelo `my-persona/<timestamp-and-UUID>` retornado. Backup é diretório local com inventário de bytes/diretórios, pasta completa da personagem e runs vinculados. Inclui pastas vazias, canon, selos, versões editoriais e mídia nessa pasta. Recusa registros inválidos, arquivos de operações pendentes, locks ativos ou mudanças concorrentes detectadas. Preserve cópia independente dos originais antes de diagnosticar dados históricos inválidos.

`backup-verify` valida inventário e registros. `backup-test` restaura cópia temporária, verifica estrutura e remove a cópia sem tocar a personagem atual. Para recuperação real:

```sh
node scripts/studio.mjs restore BACKUP_ID
```

Restauração exige que destino original da personagem esteja ausente. Mantém runs idênticos, recusa diferentes e não sobrescreve personagens. Governança compartilhada, framework, ferramentas, credenciais e entradas fora da personagem são excluídos; preserve contexto compartilhado separadamente. Testar restauração demonstra integridade, não reprodução da geração nem qualidade de mídia.

## Registros legados e verificações rotineiras

`migrate-assets my-persona` adota explicitamente manifestos legados, preservando evidência antiga de produção. Congela canon aprovado atual, não identidade histórica inventada. Revisão legada não ganha selo atual nem nova inspeção. Nova aprovação exige registro draft v2 com contexto completo e revisão real. Não reescreva mídia, snapshots, aprovações ou runs antigos para satisfazer verificações atuais.

```sh
npm run verify
node scripts/studio.mjs doctor
```

Verificação confere testes locais, registros, consistência das skills instaladas e integridade do manual. Skills usam `.agents/skills/` no Codex e `.claude/skills/` no Claude Code; mantenha conforme [instalação](installation.md#manter-skills-e-acesso-ao-fornecedor). Para estado dos fluxos e trabalho externo interrompido, leia [runs e retomada](framework-02.md).

## Prontidão por etapa

Contratos atuais de geração `0.3.0` exigem `stage-readiness-v1` estruturado antes do início e da conclusão correspondente. O assistente prepara/importa `templates/media-readiness.json` com observações reais por `run-step`, ação `record-media-readiness`; a pessoa não escreve JSON. `readinessPlanPath` opcional vincula um plano offline no início/nova tentativa. Viabilidade do piloto, entradas atuais exatas e resultado concluído são distintos: bytes futuros de voz/cena podem ficar pendentes. Cada etapa necessária exige sua decisão real de método, acesso/esquema, exposição de destino/modelo, preço/incerteza autorizada, autorizações do piloto/etapa, export original e inspeção completa. Desconhecido é pendente, nunca gratuito. Limite da etapa não amplia o teto comparável do piloto, que inclui custos conhecidos capturados de etapas concluídas.

Start informa `stageId` e captura escopo/entradas/preços/autorizações; complete exige captura e evidência correspondente da etapa/provedor/ferramenta/módulo/rota/modelo. Expirar após início válido não impede conclusão correspondente. Status expõe `pipelineReady`, pendências/resultados por etapa, `currentStageReady`, `canStartStage` e identidade da captura. Atualização no mesmo plano acrescenta evidências; mudanças vinculadas exigem nova tentativa explícita. Reconcilie jobs originais não resolvidos antes. Contratos históricos capturados `0.1.0`/`0.2.0` preservam semântica/bytes. Declarações privadas não autenticam acesso/consentimento, impõem teto real de gasto ou provam escuta/qualidade. Veja [o contrato exato de prontidão](framework/README.md) para campos, hashes e evidência de transição.
