# Personagens

Cada personagem terá sua própria pasta, criada por `node scripts/studio.mjs new <slug>`.

Nenhum personagem foi escolhido ainda. Os exemplos em `templates/` são formulários, não identidades aprovadas.

O comando cria `persona.json`, `brief.md`, `decisions.md`, `assets.json` e pastas para referências, mídia, prompts e exportações. O catálogo é lido das pastas: não existe um índice central que possa ficar desatualizado.

Os dados e a mídia dos personagens ficam locais e ignorados pelo Git por padrão. Faça backup dessa pasta: Git não será o backup dos personagens. Se quiser versionar um personagem, revise os arquivos antes de alterar `.gitignore`.
