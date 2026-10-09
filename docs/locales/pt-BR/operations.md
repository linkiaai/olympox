# Operação local e rastreabilidade do OLYMPOX

Instale estúdio independente pela release `v0.5.0` ou pacote/fonte revisados, com `--assistant codex`, `--assistant claude` ou `--assistant both`, conforme [instalação](installation.md). Abra no assistente local escolhido. O instalador verifica destinos de merge e preserva arquivos privados/não relacionados. Este checkout desenvolve fontes reutilizáveis; fichas pessoais e produção ficam em estúdios independentes.

Execute comandos na raiz do estúdio com Node 22+. `npm.cmd run verify` executa testes, valida personagens existentes e verifica a base. `npm.cmd run studio -- help` lista as operações locais. Nenhum comando local de registros gera mídia, chama fornecedor ou publica.

## Criar e preencher

```powershell
node scripts/studio.mjs new my-persona
node scripts/studio.mjs list
node scripts/studio.mjs validate my-persona
```

`new` prepara a ficha em uma pasta temporária e só publica a pasta completa. Recusa destino existente e criação concorrente. A persona nasce em `draft`; campos vazios são avisos de trabalho pendente. `validate` falha em erro estrutural, referência ausente/alterada, registro de aprovação incoerente ou cânone aprovado divergente do snapshot já congelado. Complete `brief.md` e `persona.json` com escolhas reais. Guarde cronologia, decisões e resultados em `decisions.md`. Não há uma persona inicial ficticiamente aprovada.

| Arquivo/pasta no personagem | Uso |
| --- | --- |
| `persona.json` | Identidade, voz, editorial, referências e aprovação do cânone |
| `brief.md` | Objetivo, escolhas e hipóteses |
| `decisions.md` | Decisões, cronologia e resultados |
| `assets.json` | Manifesto dos arquivos gerados e suas revisões |
| `references/candidates/` | Possíveis referências |
| `references/canon/` | Arquivos de identidade aprovados |
| `media/candidates/` | Tentativas de produção |
| `media/approved/` | Novas versões finais aprovadas |
| `prompts/` | Shots e prompts exatos utilizados |
| `exports/` | Entregas finais que exigem revisão após edição |
| `canon/` | Snapshots de identidade aprovada e cópias das referências |
| `executions/` | Contexto e prompt preservados de cada execução selada |
| `narrative/` | Versões da personalidade, voz escrita e arco narrativo |
| `content/` | Versões das peças, fontes, áudio e vínculos ao contexto |

Todos os caminhos dentro da ficha/manifesto são relativos à pasta do personagem, com `/`. Referências fora dessa pasta ou passando por `..` são recusadas. Copie a fonte permitida para dentro do personagem, preservando autoria/origem. O utilitário verifica conteúdo por SHA256; ele não inspeciona pixels nem áudio.

## Registrar referências e aprovar o cânone

Depois da inspeção visual e escolha do responsável, registre cada arquivo em `persona.references`:

```json
{
  "id": "face-front-v1",
  "path": "references/canon/front-v1.png",
  "role": "front",
  "status": "approved",
  "origin": "Ferramenta e contexto de criação; permissão quando houver fonte externa",
  "sha256": "REPLACE_WITH_REAL_HASH",
  "review": {
    "reviewer": "Responsável que realmente inspecionou",
    "at": "2026-10-07T15:00:00-03:00",
    "notes": "Decisão e observações reais"
  }
}
```

Papéis: `front`, `three-quarter`, `profile`, `full-body`, `expression`, `voice`. Status: `candidate`, `approved`, `rejected`. Candidatos/rejeitados também precisam de origem e hash, mas não de aprovação. Calcule o hash do arquivo:

```powershell
node scripts/studio.mjs file-hash my-persona references/canon/front-v1.png
node scripts/studio.mjs canon-hash my-persona
```

O mínimo estrutural do cânone é frente e outro ângulo aprovados; isso não equivale a pack suficiente para toda produção. Complete os enquadramentos necessários conforme [produção](production.md). Após decisão explícita, registre `approval` com `reviewer`, `at`, `notes`, `canonHash` real e altere o status para `canon-approved`. O hash cobre nome/idade, âncoras, voz, referências aprovadas e versão. Campos editoriais podem evoluir sem redefinir a identidade.

Uma mudança de âncora ou referência aprovada exige incrementar `identityVersion`, voltar a `draft`, revisar as referências e registrar nova aprovação. Não atualizar hashes silenciosamente para fazer um erro desaparecer. A voz usa `voice.referenceId` apontando para uma referência `voice` aprovada; produção falada precisa dela. Descrição de voz não substitui uma amostra inspecionada.

Antes de evoluir uma identidade aprovada, preserve seu snapshot:

```powershell
node scripts/studio.mjs canon-snapshot my-persona
```

O núcleo 0.2 confere ativos antigos contra o snapshot da versão usada, incluindo as cópias das referências. `register` também congela o cânone aprovado. Uma mesma `identityVersion` aceita um único cânone; mudanças exigem nova versão e aprovação explícita. A validação da persona, o início do fluxo, o vínculo, a aceitação de tarefas e uma nova tentativa comparam a ficha atual aprovada com qualquer snapshot já congelado daquela versão. Uma identidade alterada não pode reutilizar a versão pela substituição do hash de aprovação. A consulta de estado e a retomada comum relatam conflitos com o cânone vinculado como drift e bloqueiam a continuação; ainda é possível reconciliar um job externo incerto sem aceitar esse cânone. Essas verificações não criam snapshots: uma ficha aprovada sem snapshot pode continuar válida, enquanto um snapshot histórico ausente nunca é inventado para validar um contexto antigo. Preserve originais e revisões.

Para manifestos da base 0.1, use `migrate-assets my-persona` enquanto o cânone atual ainda estiver aprovado. A migração congela esse cânone e preserva revisões legadas sem inventar uma nova inspeção. Produções legadas continuam identificadas como tal; o selo completo só se aplica depois de voltar o ativo a rascunho, completar o contexto e realizar uma nova revisão.

Datas/revisores dos exemplos não são evidência real: substitua-os pelo evento de aprovação ocorrido.

## Montar a especificação da peça

Copie `templates/shot.json` para `prompts/` e preencha. `purpose: reference` permite explorar uma identidade ainda em rascunho; `purpose: production` exige cânone aprovado. Para vídeo/áudio, defina `script`, voz e duração alvo. Um vídeo sem fala pode ter script vazio. `referenceIds` vazio seleciona as referências visuais aprovadas para imagem/vídeo e a referência vocal canônica aprovada para áudio. Vídeo falado também inclui a referência vocal aprovada. Para controle, prefira indicar apenas as referências úteis à peça.

O prompt gerado leva `profile.audience`, `profile.valueProposition`, `profile.personality` e `profile.backstory` quando preenchidos como contexto criativo, junto das âncoras de identidade e direção do shot. História fictícia é identificada explicitamente como contexto criativo, não evidência de experiência real. Fala exata e caminhos/hashes de referências continuam na especificação. O comando escreve apenas texto: não escolhe fornecedor nem envia arquivos. Siga o método salvo e o [guia de produção](production.md) ao executá-lo.

```powershell
node scripts/studio.mjs prompt my-persona influencers/my-persona/prompts/shot-v1.json
```

A saída é texto para revisão. Salve em UTF-8 por ferramenta de escrita; evite redirecionamento do PowerShell legado que pode produzir UTF-16. Anexe as referências à geração de fato, na ordem indicada. A especificação não é API, não adiciona parâmetros que a ferramenta não suporta e não fornece seed automaticamente.

## Registrar e revisar o resultado

```powershell
node scripts/studio.mjs register my-persona media/candidates/portrait-v1.png image
node scripts/studio.mjs check-assets my-persona
```

Tipos aceitos: `image`, `video`, `audio`. `register` registra hash e versão como `draft`; nada é promovido. Depois complete `provider`, `model` (ou descrição honesta quando não exposto), `referenceIds`, `promptPath`, `promptSha256` e `cost` conhecido. Calcule o hash do prompt com `file-hash`, usando seu caminho relativo à pasta do personagem. Para vídeo, informe `hasSpeech: true/false`; fala exige incluir a referência vocal aprovada, áudio usa apenas referências vocais e imagem/vídeo precisam de referência visual. `cost: null` significa não informado, nunca grátis. Custo informado usa `{ "amount": 1.25, "currency": "BRL" }`, com valor não negativo e moeda em três letras maiúsculas; não misturar moedas ao somar custos. Não registrar mesma versão duas vezes nem sobrescrevê-la. Um lock recusa gravação concorrente; aguarde e tente novamente. Se uma interrupção deixar `.assets.lock`, confira se não há processo ativo antes de removê-lo.

Depois de completar o contexto real, sele a execução pelo ID retornado no manifesto:

```powershell
node scripts/studio.mjs execution-seal my-persona ASSET_ID
```

O selo preserva prompt e contexto da geração, inclusive fornecedor/modelo informado, referências, custo e campos adicionais. Ele não chama ferramenta nem confirma que uma geração ocorreu. Se o modelo não foi exposto, use uma descrição explícita dessa limitação em vez de inventar um nome. Alterar o contexto de um rascunho selado exige novo selo; o anterior permanece no histórico. Produções aprovadas não podem ser seladas silenciosamente.

Para promover um registro 0.2 a `production`, inspecione o arquivo final e preencha `review`:

```json
{
  "reviewer": "Revisor real",
  "at": "2026-10-07T15:00:00-03:00",
  "method": "visual",
  "decision": "approve",
  "mediaSha256": "REAL_HASH_OF_REVIEWED_FILE",
  "promptSha256": "REAL_HASH_OF_PROMPT_USED",
  "canonHash": "REAL_HASH_OF_CANON_USED",
  "identityVersion": 1,
  "executionSha256": "REAL_HASH_OF_EXECUTION_SEAL",
  "criticalIssues": [],
  "limitations": [],
  "notes": "Uso final conferido, identidade e regiões inspecionadas"
}
```

Métodos: imagem `visual`, vídeo `visual-and-audio`, áudio `listening`. Para vídeo sem faixa de áudio, registre esse fato nas notas e faça a inspeção completa do movimento. Decisões possíveis: `approve`, `correct`, `reject`, `pending`; apenas `approve`, sem falhas críticas/inspeções pendentes, permite `production`. Faltou acesso a som ou movimento: registre a limitação e mantenha rascunho. A revisão fixa hash da mídia, do prompt, do cânone, versão e selo da execução; trocar qualquer arquivo mantendo a revisão anterior é recusado. Confira também se o prompt corresponde à execução real.

Quando editar, recortar, legendar ou recomprimir, salve versão nova e registre-a novamente em rascunho. O utilitário detecta mudança de bytes em um arquivo já registrado; não demonstra se a revisão descrita ocorreu, nem se o conteúdo é fiel. Toda exportação final precisa de revisão própria.

## Nome do framework e registros históricos

OLYMPOX é o nome atual do framework. Sua skill de origem fica em `skills/olympox/`, sua cópia local ativa fica em `.agents/skills/olympox/` e a invocação na conversa é `$olympox`. A pasta do projeto pode conservar seu nome atual; os comandos são executados a partir da raiz do projeto, independentemente do nome dessa pasta.

Renomear o framework atualiza o código, as orientações e a apresentação atuais. Registros históricos de personagens, snapshots, aprovações, selos de execução, versões editoriais, runs salvos e bytes de backup preservam seus nomes e hashes originais. Não os reescreva para corresponder ao nome atual. Mudanças na governança observada podem exigir revisão do contexto; a retomada segue o procedimento de nova tentativa explícita em [operação do núcleo](framework-02.md), preservando a tentativa anterior e suas evidências.

## Skill e backup

`node scripts/install-skill.mjs` instala `olympox` em `.agents/skills`, sem alterar a configuração pessoal; passe `higgsfield-studio` para escolher essa skill e `--assistant codex|claude|both` para o destino (`codex` continua padrão). Claude Code usa `.claude/skills`; o instalador também fornece seu `CLAUDE.md`. Valida e lê os dois arquivos de origem, `SKILL.md` e `agents/openai.yaml`, e verifica previamente ambos os destinos e seus caminhos superiores antes de gravar. Origens ausentes, links ou junctions, tipos inválidos de arquivo/pasta e bytes divergentes na instalação causam falha antes de qualquer mudança. Arquivos idênticos são mantidos; arquivos ausentes só são instalados após a verificação prévia completa. Revise uma instalação divergente antes de substituí-la. A pasta da skill escolhida pode exigir permissão de escrita na sessão atual. `doctor` verifica a igualdade entre origem e instalação.

Fichas, mídia e tarefas são ignoradas pelo Git por padrão. Use o backup verificável depois de um ciclo importante:

```powershell
node scripts/studio.mjs backup my-persona
node scripts/studio.mjs backup-verify BACKUP_ID
node scripts/studio.mjs backup-test BACKUP_ID
```

O ID retornado tem formato `character/name`. `restore BACKUP_ID` restaura apenas se a pasta original estiver ausente; não sobrescreve personagens nem tarefas divergentes. O teste restaura em uma cópia temporária e a remove. O arquivo inclui toda a pasta da persona e registros das tarefas vinculadas, com inventário de bytes e diretórios. Constituição, framework, ferramentas e entradas compartilhadas fora da persona precisam de preservação própria; uma retomada verifica novamente esse contexto. Mantenha outra cópia do backup fora do disco de trabalho. Hash detecta corrupção, mas não autentica autoria nem prova qualidade da mídia.

Consulte [núcleo 0.2](framework-02.md) para narrativa, peças e coordenação. Credenciais não pertencem ao projeto.

Registros históricos continuam legíveis sem reescrever seus bytes ou aprovações. O texto e a voz das personagens conservam seu próprio idioma editorial.
