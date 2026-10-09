# Imagens integradas ao assistente

Use este procedimento quando o usuário escolher explicitamente geração ou edição de imagens dentro do assistente conversacional. Higgsfield continua como [caminho padrão de mídia](higgsfield-influencer-method.md). A alternativa vale para etapas de imagem selecionadas; não estabelece suporte a voz, animação, vídeo ou sincronização labial.

## Escolher e registrar a alternativa

Confira se o aplicativo oferece geração/edição de imagens, anexação de referências exatas, exportação e inspeção visual. Limites da conta e restrições das ferramentas se aplicam. Salve etapas afetadas, ferramentas e motivo no [plano de método de produção](../../../templates/locales/pt-BR/production-method.md).

Para um novo run local, declare a exceção de imagem na especificação:

```json
{
  "mediaProviders": {
    "image": "integrated-images",
    "video": "higgsfield",
    "audio": "higgsfield"
  }
}
```

Este fragmento integra uma especificação completa de run; não é chamada de ferramenta. Declare capacidades reais exigidas pelo fluxo, incluindo `integrated-images:image-generation` para geração de imagens. O núcleo verifica a declaração do fornecedor escolhido, mas não chama a ferramenta nem verifica sua qualidade. Veja [operação do núcleo](framework-02.md).

Mudança de fornecedor ou método observado usa `run-resume` com `newAttempt: true` e motivo. Preserve tentativas anteriores e resolva primeiro qualquer job externo pendente. Canon, referências e aprovações existentes permanecem intactos.

## Criar candidatas e referências

1. Comece pelo conceito selecionado ou personagem aprovada. Use [estratégia](strategy.md) para descoberta pendente. Quando a direção estiver aberta, compare três conceitos distintos e recomende um antes da exploração visual.
2. Dirija uma candidata expressiva e uma cena em personagem que comuniquem personalidade e premissa recorrente. Especifique idade, silhueta, estilo, expressão, cenário e ação.
3. Inspecione saídas reais e registre a seleção visual do usuário. Desenvolva vistas coerentes dessa candidata: frente, três quartos, perfil, corpo e expressões conforme o conteúdo pretendido.
4. Salve referências individuais utilizáveis, preserve originais e compare anatomia, proporções, reconhecimento e presença entre vistas/cenas. Grade ajuda na seleção, mas não substitui arquivos exatos legíveis.
5. Antes de nova geração ou edição, inspecione referências selecionadas e anexe arquivos reais pelos campos de referência suportados. Registre hashes, papéis/ordem e IDs expostos. Nome de arquivo no texto do prompt não anexa bytes.

Candidatas continuam como material em rascunho até seleção e revisão aplicáveis. Para uma personagem existente, compare cada derivada com canon aprovado e mantenha novas saídas separadas do pacote de referências até revisão.

## Concluir canon e piloto

Seleção visual inicial não aprova canon completo. Uma nova personagem com fala precisa de amostra vocal gerada durante trabalho de rascunho/referência, com `purpose: reference`; escute o áudio exato e registre seleção do usuário, arquivo/hash e configurações antes da aprovação visual/vocal final. Escopo silencioso registra por que voz não se aplica. Reutilize voz e canon aprovados compatíveis.

Aprove e preserve canon completo por [operações locais](operations.md), depois prepare cenas de produção a partir de suas referências exatas. Para vídeo, use o [procedimento de passagem](production-handoff.md) com ferramentas de voz/movimento/sincronização verificadas separadamente. Higgsfield continua padrão nessas etapas, salvo mudança explícita.

Gere um piloto representativo antes de lotes. Exporte bytes reais, registre e sele o contexto, depois conclua a [revisão de qualidade](quality.md). Ausência de anexação de referências, exportação ou inspeção mantém a etapa afetada pendente.

## Preservar proveniência

Salve cada saída como nova versão local da personagem. Registre ferramenta/modelo exposto, prompt exato, arquivos/hashes realmente anexados, custo conhecido, limitações, IDs de resultados e revisão real. Custo monetário desconhecido continua `null`; franquia da conta não comprova custo zero. Reconcilie submissões incertas pelos jobs originais antes de nova tentativa.

O núcleo local preserva declarações e integridade dos arquivos. Ele não inspeciona pixels, escolhe identidade, aprova canon nem estabelece fidelidade das imagens geradas pelo assistente. Publicação continua ação autorizada separadamente com bytes finais revisados.
