# Referência Higgsfield inspecionada

Consulta e preparo: **7 de outubro de 2026**. Origem: [higgsfield-ai/skills](https://github.com/higgsfield-ai/skills/tree/f83af0bc1d937c8119099a11f8ebbf5e6fb99819), revisão `f83af0bc1d937c8119099a11f8ebbf5e6fb99819`. Skill `higgsfield-generate` versão `0.13.0`, com suas referências locais e licença MIT preservadas. [provenance.json](../../../vendor/higgsfield-skills/provenance.json) inventaria SHA-256 dos arquivos recebidos e a versão verificada do CLI.

Estes arquivos preservam a origem do fornecedor para consulta. **Não estão instalados como skill ativa do Codex e não concedem autorização para executar ações.** Não foi executado `setup`, `INSTALL_FOR_AGENTS.md`, `npx skills add` ou o teste pago de geração sugerido pelo repositório.

O módulo de geração não precisa de `higgsfield-common`: essa dependência não aparece nesta revisão. Soul ID, brandkit, websites e os demais módulos citados são rotas opcionais para outros pedidos; não foram copiados nem ativados. As doze referências deste módulo ficam completas para que os links internos continuem legíveis.

Há diferenças relevantes para o estúdio:

- O bootstrap do fornecedor usa `curl | sh` quando o CLI não está no PATH. Aqui usamos instalação isolada, inspecionada e fixada em `tools/higgsfield`, sem alteração global.
- A regra do fornecedor de não estimar custo salvo pedido não substitui o orçamento e a autorização aplicáveis exigidos pela constituição.
- Media paths podem ser enviados automaticamente inclusive em `generate cost`. O wrapper de preparação recusa essas entradas na estimativa.
- Defaults de modelo e descrições como “SOTA”, identidade consistente ou proxy objetivo de atenção são recomendações/alegações do fornecedor. Precisam de catálogo atual, piloto e revisão; não demonstram qualidade ou desempenho do estúdio.
- Entregar uma URL não encerra a preservação do estúdio: guardar mídia, job, entradas, prompt, contexto e revisão real quando a geração estiver autorizada.

O processo vigente está em [preparação Higgsfield](higgsfield-setup.md) e na [constituição](CONSTITUTION.md). As fontes importadas do fornecedor mantêm seus hashes de integridade originais.
