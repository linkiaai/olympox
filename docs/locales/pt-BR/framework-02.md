# Núcleo 0.2 — uso na conversa e operação

O estúdio tem nove perfis, quinze contratos de tarefa e três fluxos persistentes. Atena organiza o pedido e chama a especialidade necessária. Você pode conversar normalmente; os comandos servem para preservar o trabalho entre sessões. O guia de [operação](operations.md) cobre identidade e revisão de mídia; [framework/README](framework/README.md) descreve as APIs e declarações de cada etapa.

## Primeiro ciclo recomendado

1. Quando a direção exigir pesquisa, Gaia investiga até três oportunidades para um mercado/canal, com fontes, hipóteses, concorrência e razões para descartar uma direção. Com um objetivo já definido, essa pesquisa pode ser dispensada com motivo.
2. Atena recomenda uma oportunidade e transforma a escolha em brief. Psiquê define valor, personalidade e limites; Íris dirige candidatos visuais.
3. Você escolhe a identidade a partir dos arquivos reais. A aprovação fixa referências e hashes; o cânone aprovado ganha snapshot.
4. Saraswati prepara conteúdo coerente com a personagem; Aurora pesquisa tendências quando necessário. Selene prepara e executa a produção com as ferramentas disponíveis; Têmis inspeciona o resultado completo.
5. Atena entrega a peça revisada. Fortuna prepara distribuição e coleta de resultados quando houver publicação autorizada.

O piloto precede lotes. Fontes e desempenho real orientam melhorias; volume de personagens, número de agentes e uma promessa de viralização não demonstram qualidade.

## Responsáveis e estado persistente

O registry em `framework/registry.json` liga perfis, tarefas e fluxos. IDs dos fluxos: `create-character`, `produce-piece`, `review-correct`. O primeiro pode começar sem personagem; os dois últimos exigem cânone aprovado. Os IDs históricos em português continuam compatíveis sem reescrever runs anteriores.

Crie um arquivo JSON de especificação dentro do projeto, por exemplo `tmp/first-cycle.json`:

```json
{
  "personaId": null,
  "objective": "Pesquisar três oportunidades e recomendar uma direção original para o primeiro piloto",
  "inputs": [],
  "medium": "image",
  "capabilities": []
}
```

```powershell
node scripts/studio.mjs run-start create-character tmp/first-cycle.json
node scripts/studio.mjs run-status RETURNED_RUN_ID
```

O pacote retorna próxima tarefa, responsável, entregável, critérios, contexto observado e pendências. Inputs/outputs usam caminhos relativos à raiz com `/`. Arquivos de outra persona e caminhos fora do projeto são recusados. O registro fica em `work/runs/`; ele não despacha uma agente nem consulta serviços. O Codex executa o trabalho e registra eventos verdadeiros. Delegações reais devem identificar o evento e a agente que foi despachada.

`run-step RUN_ID transition.json` aplica uma transição declarada. Para iniciar a etapa local, o JSON mínimo é `{"action":"start"}`. Concluir exige arquivos existentes e evidência apropriada: documento preparado, mídia gerada, mídia inspecionada ou entrega realizada. Tipos e campos completos estão em [framework/README](framework/README.md). Registre ator, data, evento e notas do que realmente ocorreu. Não preencher nomes e datas hipotéticos como prova de execução.

Quando a persona existir, a transição `bind-persona` vincula seu slug. Etapas opcionais podem ser puladas com motivo; inspeção e aprovação do cânone não podem ser puladas. O gate de aprovação registra uma decisão explícita real e exige correspondência com a aprovação já registrada na ficha; ele não aprova a identidade sozinho.

Capacidades como `image-generation` e `image-inspection` representam o que está disponível na sessão. Declarar uma capacidade no JSON não instala nem testa uma ferramenta. A ausência de uma capacidade requerida mantém a tarefa aguardando ferramenta.

## Interrupções e retomada

```powershell
node scripts/studio.mjs run-resume RUN_ID
```

Entradas, saídas concluídas e arquivos de governança têm hashes observados. Uma alteração exige revisão do contexto. Uma nova tentativa precisa de JSON com `newAttempt: true` e motivo; ela recomeça o fluxo preservando a anterior e não reutiliza aprovações silenciosamente.

Antes de enviar um trabalho externo, a transição `start` pode registrar `job` com fornecedor e identificador disponível, preservando a intenção antes do envio. Se o processo interromper sem resposta conclusiva, a retomada trata esse trabalho como resultado incerto e bloqueia repetição. Consulte o fornecedor e registre `resolve` com evidência de reconciliação. O runtime não descobre chamadas feitas sem esse registro prévio.

Locks recusam gravações concorrentes. Uma interrupção pode deixar lock ou pasta temporária: confira os processos e preserve os dados antes de qualquer limpeza. Não há expiração automática que possa disparar trabalho cobrado novamente.

## Identidade e execução da geração

`persona.json` conserva o estado atual. `canon-snapshot` preserva uma versão aprovada e cópias dos arquivos de referência. A evolução da identidade exige nova versão; produções antigas continuam ligadas ao seu snapshot. `migrate-assets` preserva registros legados, sem criar revisões que nunca ocorreram.

Depois de gerar, registrar o arquivo e completar sua origem, `execution-seal` preserva o prompt e contexto informado. O novo registro de produção precisa de revisão vinculada a esse selo, à mídia e ao cânone. Isso detecta mudança posterior em fornecedor/modelo, referências, custo e outros parâmetros informados. O selo é um registro local; não comprova que a execução ou inspeção ocorreu.

## Narrativa e peças

Copie `templates/narrative.json` e `templates/content.json` para arquivos de trabalho da personagem. Preencha `characterId` com o slug e, na peça, um `id` próprio. Salve com:

```powershell
node scripts/studio.mjs narrative-save my-persona influencers/my-persona/prompts/narrative-v1.json
node scripts/studio.mjs narrative-show my-persona
node scripts/studio.mjs content-save my-persona influencers/my-persona/prompts/piece-v1.json
```

Cada salvamento cria outra versão; não sobrescreve snapshots anteriores. Narrativa descreve desejo, valores, contradição, hábitos, limites e voz escrita. Mudanças editoriais não redefinem automaticamente rosto ou voz canônica. Para aprovar a narrativa, o arquivo de entrada usa `data` com os campos narrativos e `review` com decisão `approve`, responsável, data e notas do evento real. Sem decisão explícita, o salvamento é rascunho, mesmo que tenha uma aprovação copiada de outra versão.

Peças mantêm roteiro, legenda, shots, fontes, afirmações factuais, referências ao cânone e narrativa, ativos vinculados e áudio. `ready-for-production` exige contexto aprovado, hashes dos shots, revisão explícita e identificação virtual/comercial definida. Não significa mídia gerada nem publicada. Alegações factuais precisam de fontes consultadas; a validação verifica vínculos, não a verdade das alegações.

Uma música proposta não é automaticamente utilizável. Quando `useInProduction` for verdadeiro, a peça pronta exige evidência consultada de disponibilidade e elegibilidade para plataforma, região, tipo de conta e uso. Registrar uma alternativa evita depender de áudio ainda pendente. A pesquisa precisa ser refeita quando a janela de uso mudar.

## Preservação e limites da verificação

`backup` inventaria a pasta inteira da persona e os registros das tarefas vinculadas. `backup-verify` confere bytes e estrutura. `backup-test` restaura em uma cópia temporária sem tocar na persona atual. `restore` recusa destino existente e tarefas com versões divergentes. Os arquivos compartilhados do framework, ferramentas e inputs fora da persona precisam ser preservados separadamente; a retomada confere o contexto atual.

```powershell
npm.cmd run verify
```

Os testes verificam caminhos, histórico, estados, integridade e comandos locais. Não inspecionam pixels, escutam áudio, assistem vídeos nem autenticam uma declaração humana. Cada estúdio precisa de um piloto inspecionado para demonstrar consistência visual, movimento, voz e utilidade do conteúdo com ferramentas reais.


> Tradução secundária em português do Brasil. A base canônica, os comandos e os tokens do framework são em inglês. Valores históricos em português continuam compatíveis; essa compatibilidade não reescreve fichas, runs, snapshots, hashes ou aprovações anteriores. O idioma editorial das personagens permanece independente. Consulte a [política de idiomas](localization.md).
