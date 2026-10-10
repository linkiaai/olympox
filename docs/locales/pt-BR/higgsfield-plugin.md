# Operação do plugin Higgsfield

Use este guia para trabalho de mídia pelo plugin Higgsfield conectado em um estúdio instalado. O plugin executa etapas suportadas sem CLI local. OLYMPOX fornece o [método de produção](higgsfield-influencer-method.md), registros locais e revisão; seu núcleo não chama o fornecedor automaticamente.

## Descobrir e conectar

Use ferramentas de gestão de plugins ou interface do aplicativo para encontrar Higgsfield. Inspecione instalação, conexão e permissões separadamente. Conclua o fluxo real de conexão quando coberto por autorização aplicável; o usuário realiza interação necessária com a conta. Mantenha credenciais fora dos registros e backups do estúdio.

Descubra ferramentas executáveis e leia schemas atuais. Verifique conta/workspace por conexão ou operação de leitura exposta. Skill instalada, descrição de catálogo e conta conectada são observações distintas. Sem conexão ou ferramenta obrigatória, continue preparação local e mantenha a etapa de mídia em `awaiting-tool`.

## Conferir o caminho completo de produção

Antes da primeira etapa paga, verifique o piloto completo e seu orçamento:

| Necessidade | Evidência exigida |
| --- | --- |
| Módulo escolhido de identidade/referência | Operação executável com entradas aceitas; fichas Builder, identidade treinada, voz e vídeo são capacidades distintas |
| Referências exatas | Anexação/transferência suportada, papéis/ordem/limites e identificadores confirmados |
| Voz e vídeo | Seleção/geração reais de voz, entradas de áudio/movimento, duração/formato e sincronização quando necessária |
| Custo | Cotação atual ou incerteza conhecida, unidade, limite de tentativas/correções e autorização aplicável |
| Recuperação | Operação real de consulta/status para identificadores aceitos |
| Entrega e QA | Exportação suportada de bytes reais e inspeção visual/escuta/movimento completos |

Leia instruções atuais para seletores, presets e turnos exclusivos de submissão. Não transfira flags da CLI, IDs de modelos, preços ou capacidades para chamada do plugin. Preparação/estimativa pode importar referências sem submeter geração; confira efeitos e reutilize IDs confirmados para evitar transferências desnecessárias.

Mantenha créditos com unidade/fonte na proveniência local, por exemplo `providerMetadata` adicional. `cost` do ativo aceita valor/moeda monetários; use `null` salvo valor conhecido. Cotação não é autorização nem orçamento do piloto inteiro.

## Transferir as referências exatas do estúdio

Identifique arquivos exatos selecionados/aprovados e seus SHA-256, depois use entrada suportada. Caminho local no prompt não transmite mídia. Auxiliares de anexos do usuário e uploads de sandbox remoto aceitam suas origens documentadas; sandbox remoto não lê arquivos locais arbitrários do estúdio.

Confira primeiro anexos aceitos pelo plugin. Para imagem local exata autorizada, o assistente usa a [operação nativa reutilizável](higgsfield-setup.md#transferir-arquivos-locais-para-o-plugin) com autorização dos bytes/destino, snapshot controlado e recibo recuperável antes de propor anexação manual. A rota de imagem Windows x64 fixada é separada do wrapper somente leitura; áudio/vídeo e outras plataformas ficam pendentes. Auxiliares de sandbox remoto/anexos não ganham acesso a arquivos locais por essa operação.

Registre caminho/hash/tamanho local, ID confirmado do fornecedor, papel/ordem, impressão da conta/workspace e evidência delimitada da transferência. Registros excluem email bruto, URLs e resposta do fornecedor. Reconhecimento nativo não comprova acesso pelo plugin/biblioteca/módulo, igualdade de bytes originais ou prontidão de geração. Confirme entrada mapeada na ferramenta exata; compare bytes originais baixáveis quando suportado, documente transformações/verificação indisponível e inspecione fidelidade. Reconcilie uploads nativos não resolvidos antes de nova intenção/rota; página vazia da biblioteca não autoriza repetição.

Sem transferência exata, mantenha etapa pendente com capacidade ausente e alternativa. Não invente IDs nem transmita bytes privados por serviço não aprovado.

## Persistir intenção e submeter

1. Carregue personagem, versões aplicáveis de canon/conteúdo, entradas revisadas e autorização da etapa. Exploração de candidatas/referências mantém propósito de rascunho; produção usa canon aprovado.
2. Salve prompt exato, parâmetros reais, arquivos/hashes e entradas confirmadas. Registre rota/ferramenta, modelo/preset exposto, escopo de custo e limites.
3. Use transição `start` com `job` **antes** da chamada externa. Registre somente identificadores conhecidos. Veja [operação do núcleo](framework-02.md) para arquivos e comandos de transição. Conclua persistência local antes de turno exclusivo do fornecedor quando exigido.
4. Invoque a operação verificada. Preserve todos os IDs de job/request, status, alterações expostas de prompt/configurações, custo e local de resultado. Acompanhe jobs de lote individualmente.

O núcleo registra intenção; não intercepta chamadas, impõe teto de gastos no serviço nem descobre submissões não registradas.

## Registrar o resultado do fornecedor

Uma intenção externa registrada continua não resolvida até `resolve`, inclusive com retorno normal. Use resposta real ou consulta ao job original como evidência:

| Resultado observado | Tratamento local |
| --- | --- |
| Aceito ainda pendente ou resultado ambíguo | Use `uncertain` com IDs conhecidos e motivo; consulte job original |
| Sucesso ou falha terminal | Use `resolve` com mesmo fornecedor/IDs conhecidos, `succeeded` ou `failed` e evidência `type: reconciled` |
| Resposta explícita confirmando nenhuma submissão | Use `resolve` com `not-submitted` e evidência; não invente ID de job |

Reconcilie cada job aceito antes de resolver lote. Interrupção/timeout não estabelece falha ou ausência de submissão. Sem ferramenta para consultar o original, mantenha `uncertain-result` e identifique verificação necessária no fornecedor/aplicativo. Não duplique submissão por outra rota.

Reconciliação não conclui a tarefa de mídia. Após sucesso, obtenha saídas reais e evidência de geração antes de `complete`. Sem exportação, resolva resultado do fornecedor primeiro e use `wait` com `awaiting-tool` para a etapa restante. Nova tentativa segue autorização aplicável e procedimento de contexto/retomada existente.

## Exportar, registrar e inspecionar

Use exportação suportada pelo fornecedor/aplicativo. Salve bytes reais como novos arquivos na pasta de mídia da personagem. Prévia ou URL de galeria continua como resultado remoto até entrega local disponível.

Use `register`, complete proveniência e crie `execution-seal` conforme [operações locais](operations.md). Inclua fornecedor/modelo reais, prompt, referências anexadas, informações de fala quando aplicáveis, custos e hashes. Descreva honestamente modelo não exposto como desconhecido. O selo preserva contexto declarado; não comprova qualidade.

Faça [revisão de qualidade](quality.md) nos arquivos finais exatos: inspeção visual para imagens, escuta para áudio e movimento/áudio completos para vídeo quando presentes. Registre revisor, método, decisão e limitações. Ausência de inspeção obrigatória mantém `pending`. Correções e exportações editadas/cortadas/recomprimidas são novas versões que exigem revisão. Entregue bytes revisados; publicação é ação autorizada separadamente.
