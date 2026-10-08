---
name: olympox
description: Criar, dirigir, produzir ou revisar influenciadores de IA neste projeto, incluindo persona original, identidade visual, conteúdo e controle de qualidade.
---

# OLYMPOX - AI Influencer framework

Conduza a produção de personagens originais com identidade consistente e qualidade verificável. Trabalhe em ciclos de proposta, geração, revisão visual e aprovação; a geração pode exigir várias tentativas. As instruções do framework e os novos registros técnicos usam inglês; a voz e o conteúdo da personagem seguem o idioma aprovado para o público.

## Contexto e referências

**Todos os caminhos desta skill são relativos à raiz do projeto OLYMPOX, não à pasta da skill.** Leia `AGENTS.md` e, para um personagem existente, `influencers/<slug>/persona.json` e seu manifesto `influencers/<slug>/assets.json`. Preserve decisões aprovadas e identifique o próximo resultado solicitado.

Carregue apenas as referências necessárias:

- Briefing e persona: `templates/brief.md` e `docs/strategy.md`.
- Imagens, vídeo e voz: `docs/production.md` e `docs/tools.md`.
- Revisão e aprovação: `docs/quality.md`.
- Estrutura, comandos e versionamento: `docs/operations.md`.

Pergunte somente o essencial que estiver faltando. Para escolhas reversíveis, proponha uma direção clara e registre as hipóteses; evite uma entrevista longa.

## Modos de trabalho

**Briefing e persona.** Defina propósito, público, posicionamento, personalidade, voz e limites editoriais. Crie uma pessoa fictícia adulta e original. Conecte escolhas visuais e conteúdo à estratégia. Quando faltar um briefing, use `templates/brief.md` como guia e apresente uma proposta revisável.

**Imagem.** Use a geração de imagens integrada do Codex por padrão, sem exigir chave de API. Verifique a disponibilidade da ferramenta antes de prometer execução. Produza variantes candidatas; o usuário aprova visualmente a identidade canônica. Após aprovação, edite usando as referências aprovadas e preserve invariantes de rosto, proporções e características distintivas. Registre referências, instruções e versões de cada entrega.

**Vídeo e voz.** Consulte a capacidade realmente disponível e `docs/tools.md`. Prepare roteiro, cenas, referências e especificações mesmo quando não houver ferramenta de execução conectada. Confirme documentação oficial atual quando depender de recursos externos. Descreva claramente o que foi preparado, gerado e verificado; disponibilidade de imagem não prova disponibilidade de vídeo ou voz.

**Conteúdo.** Escreva para a persona e o público aprovados: roteiro, legenda, sequência de cenas e direção de atuação. Vincule cada produção ao objetivo editorial e às referências do personagem. Preserve a distinção entre fatos verificáveis e ficção do personagem.

**Qualidade.** Use `docs/quality.md` e inspecione visualmente os resultados. Verifique identidade, anatomia, continuidade, acabamento e adequação ao briefing. Referências usam `candidate`, `approved`, `rejected`; ativos usam `draft`, `production`, `rejected`, conforme inspeção e decisão real. Valores históricos em português continuam legíveis. Validação estrutural e geração bem-sucedida não aprovam identidade ou qualidade automaticamente.

## Operação local

Execute os comandos a partir da raiz do projeto:

```text
node scripts/studio.mjs doctor
node scripts/studio.mjs list
node scripts/studio.mjs new <slug>
node scripts/studio.mjs validate [slug]
node scripts/studio.mjs prompt <slug> <shot.json>
node scripts/studio.mjs check-assets <slug>
node scripts/studio.mjs canon-hash <slug>
```

O comando `prompt` escreve um rascunho na saída padrão; revise-o antes de usar na geração. Use `new` para estruturar um personagem, `validate` para conferir os registros e `check-assets` para conferir arquivos. `canon-hash` calcula o hash na saída padrão e não aprova o personagem. Consulte `docs/operations.md` para campos e procedimentos.

O status da persona é `draft`, `canon-approved` ou `production`. Uma aprovação do canon registra `identityVersion`, revisor, data, notas e `canonHash`. As referências da persona usam caminhos relativos à pasta do personagem, com papel, status e SHA-256; não confunda esses caminhos com os caminhos de documentação relativos à raiz.

Salve novas versões sem sobrescrever referências ou entregas aprovadas. Mantenha rastreabilidade entre persona, referência, cena e resultado. Nunca simule uma aprovação do usuário ou declare a identidade perfeita por causa de um comando bem-sucedido.

Prepare o trabalho dentro do escopo autorizado. Publicação ou custo externo requer decisão do usuário quando ainda não houver autorização aplicável; não solicite novamente uma autorização já concedida. Não introduza APIs, frameworks ou publicação automática como parte de um pedido de produção criativa.
