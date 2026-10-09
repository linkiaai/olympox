# Manual navegável do OLYMPOX

O manual navegável do **OLYMPOX - AI Influencer framework** é um site local e estático, sem dependências, produzido a partir dos arquivos do projeto. `src/` contém a interface; `config.json` seleciona os guias e descreve os comandos. Os catálogos vêm do registry, perfis, contratos, fluxos e ajuda da CLI.

Crie um estúdio independente pelo [guia de instalação](../installation.md) ou clone as fontes do framework para desenvolvimento e manutenção. O pacote contém as fontes do manual; uma geração local cria `dist/`.

A versão 0.5.0 oferece o instalador guiado publicado `npx --yes github:linkiaai/olympox#v0.5.0 setup`; cópia revisada ou pacote extraído usa `node bin/olympox.mjs setup`. Orienta escolhas de idioma de apresentação, Codex/Claude Code/ambos e destino e revisa o plano real de instalação antes da escrita. Depois de instalar, gera e confere o manual local e executa verificações locais de estrutura. A escolha de idioma afeta a apresentação da preparação; o manual instalado mantém seu próprio seletor de idioma. A verificação local completa continua sendo `npm run verify`; descoberta no assistente, acesso Higgsfield e execução de mídia exigem conferências separadas na sessão real.

Comandos do manual na raiz do estúdio ou das fontes:

```powershell
npm.cmd run docs:dev
npm.cmd run docs:build
npm.cmd run docs:check
```

O servidor acompanha as fontes em `http://127.0.0.1:4321`. A porta pode ser informada com `npm.cmd run docs:dev -- 4322`. A cópia portátil fica em `dist/index.html` e funciona aberta diretamente. `dist/` é gerado e ignorado pelo Git.

Veja [documentação viva](../living-documentation.md) para manutenção e limites. Somente os arquivos de saída permitidos são servidos; a raiz do projeto e os dados de personagens não ficam acessíveis. Não há publicação ou integração remota automática.
