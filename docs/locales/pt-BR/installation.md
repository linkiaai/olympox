# Instalar o OLYMPOX

**OLYMPOX - AI Influencer framework** instala um estúdio local reutilizável para o Codex. Cada usuário cria influenciadores originais e mantém seus registros privados nesse estúdio independente. O repositório de origem é dedicado ao desenvolvimento e à manutenção do framework. O pacote inclui fontes e templates do framework, sem fichas reais de personagens nem credenciais.

## Requisitos

- Node **22 ou posterior**, incluindo npm e npx.
- Codex para coordenação por conversa e as ferramentas disponíveis na sua sessão.
- Git para clonar o repositório. A instalação de pacotes GitHub pelo npm também pode exigir Git no sistema.
- Acesso ao repositório e à tag da versão escolhida. Um repositório privado pode exigir acesso Git autenticado na sua máquina.

O núcleo local não tem dependências externas de execução. Não é necessário executar `npm install` para operar seus registros. Fornecedores de mídia são opcionais e exigem preparação própria.

## Criar um estúdio pelo GitHub

Execute a partir da pasta onde deseja criar o estúdio:

```sh
npx --yes github:linkiaai/olympox#v0.2.1 install ./my-studio
cd my-studio
npm run verify
npm run studio -- help
```

Use `npx.cmd` e `npm.cmd` no Windows se o PowerShell bloquear os inicializadores comuns. O diretório de instalação padrão é `.` quando omitido. Uma instalação nova aceita um diretório ausente ou vazio; um diretório `.git` existente pode ser mantido. Outros itens existentes exigem `--merge`.

O instalador copia arquivos reutilizáveis do framework, escreve o `AGENTS.md` do estúdio a partir de `templates/studio-AGENTS.md` e cria as skills locais ativas a partir de suas fontes versionadas. As instruções da raiz da cópia de desenvolvimento continuam separadas. A instalação não instala plugins externos ou binários de fornecedores, autentica contas, gera mídia ou publica um site. `verify` gera o manual local e verifica o comportamento local e a integridade da instalação.

Abra a pasta do estúdio instalado no Codex. Invoque a skill na conversa:

```text
Use $olympox. Ajude-me a criar um influenciador original para [público/tema].
Proponha três direções e recomende uma antes de explorar a identidade.
```

Se o Codex não mostrar a nova skill, recarregue o Codex ou reabra o projeto. A instalação dos arquivos e a descoberta automática são verificações separadas.

## Escolher acesso opcional ao Higgsfield

A geração de imagens integrada do Codex é o padrão quando disponível, salvo se você escolher o Higgsfield. Para o Higgsfield, escolha seu [plugin do Codex](higgsfield-plugin.md) ou a [CLI e wrapper locais](higgsfield-setup.md). Instale e conecte o plugin separadamente na sua conta do Codex; essa rota não exige a CLI local do Higgsfield. A rota da CLI exige a preparação do binário e da conta próprios. Nenhuma das duas é necessária para operar o núcleo do OLYMPOX.

```text
Atena, use o Higgsfield pelo plugin neste estúdio.
Confira as ferramentas disponíveis nesta sessão e prepare um piloto para [personagem].
Registre as entradas, a execução e a revisão no OLYMPOX.
```

Isso escolhe uma rota; por si só, não autoriza geração paga, treinamento ou publicação. Siga as autorizações anteriores aplicáveis e as mesmas regras de cânone, tentativas, custos e inspeção em ambas as rotas. A descoberta do plugin não comprova acesso à conta nem disponibilidade de recursos; inspecione ferramentas e resultados reais antes de prometer uma capacidade.

## Usar um projeto existente

```sh
npx --yes github:linkiaai/olympox#v0.2.1 install ./existing-project --merge
```

O merge confere todos os destinos planejados antes de escrever. Arquivos idênticos do framework são mantidos, e arquivos ausentes são instalados. Arquivos diferentes ou colisões interrompem a operação sem sobrescrevê-los. Arquivos locais não relacionados são preservados. O instalador recusa links simbólicos e junções nos caminhos de origem ou destino da instalação.

Se houver conflitos, revise e reconcilie os arquivos explicitamente ou instale em um estúdio separado e vazio para comparar as duas versões. `--merge` não é um atualizador automático de fontes modificadas do framework nem de instruções locais. Fichas existentes, aprovações, hashes e histórico de runs continuam sujeitos às suas regras de preservação.

## Atualizar um estúdio existente

A release **0.2.1** acrescenta uma rota opcional por conversa para o plugin Higgsfield. A API do núcleo local e os contratos mantêm a revisão de componente 0.2.0. Leia as [notas da versão](release-notes.md) e preserve o estúdio existente antes de comparar mudanças no framework.

1. Crie e verifique backups de personagens privados e runs vinculadas pelas [operações de backup](operations.md) existentes. Mantenha também uma cópia independente dos arquivos atuais do framework, contexto compartilhado e instruções locais; os backups de personagens excluem essa base.
2. Instale a release em um diretório vazio independente, como `./my-studio-v0.2.1`, com o comando fixado na tag acima. Execute `npm run verify` ali e compare as fontes reutilizáveis do framework com o estúdio existente.
3. Reconcilie explicitamente apenas as fontes pretendidas do framework, skills ativas, template de instruções do estúdio, templates e documentação. Preserve customizações locais e mantenha as cópias ativas das skills consistentes com suas fontes principais. `--merge` mantém arquivos idênticos e recusa arquivos diferentes antes de escrever; ele não faz essa reconciliação por você.
4. Mantenha fichas existentes, mídia, aprovações, snapshots, runs e backups no lugar com seus bytes e hashes originais. O estúdio vazio de uma nova release não substitui registros privados, e bytes históricos não devem ser reescritos para acomodar novas instruções ou fazer uma verificação passar.
5. Execute `npm run verify` no estúdio atualizado e reabra ou recarregue o Codex para descoberta das skills. Revise runs retomadas quanto a mudanças no contexto. Quando a governança ou as entradas tiverem mudado, use o procedimento existente de nova tentativa explícita com um motivo, preservando tentativas e aprovações anteriores; consulte [operação do núcleo](framework-02.md).

A atualização do framework não instala nem autentica o plugin Higgsfield, submete geração, treina identidades ou publica conteúdo.

Reconcilie qualquer submissão pendente do fornecedor pelo job original antes de uma nova tentativa ou troca de ferramenta. Atualizar o framework não cancela nem resolve trabalho externo.

## Desenvolver com uma cópia do código-fonte

```sh
git clone https://github.com/linkiaai/olympox.git
cd olympox
npm run verify
npm run studio -- help
```

Abra essa cópia no Codex para desenvolver e manter o framework conforme seu `AGENTS.md` da raiz. Crie um estúdio independente com o comando de instalação para trabalho real com influenciadores. Fixtures sintéticas dos testes demonstram comportamento local; personagens pessoais e produção pertencem a esse estúdio separado.

## Conteúdo do pacote

| Incluído | Mantido no estúdio de cada usuário |
| --- | --- |
| Constituição e instruções do projeto | Fichas de personagens e identidade aprovada |
| Perfis, contratos e fluxos do framework | Referências, mídia gerada, prompts e exportações |
| Scripts e templates locais | Runs, estado de manutenção e backups |
| Guias e manual local | Instalações de fornecedores, contas e credenciais |
| Fontes do manual e ferramentas de geração | Manual gerado e arquivos temporários locais |
| Skills versionadas e proveniência permitida de fontes dos fornecedores | Arquivos produzidos pelo seu próprio trabalho criativo |

O instalador cria `.agents/skills/olympox` e `.agents/skills/higgsfield-studio` a partir das fontes principais. As instruções criativas instaladas vêm do template do estúdio, em vez do `AGENTS.md` da raiz de desenvolvimento. A proveniência e o material de leitura dos fornecedores não autenticam contas nem instalam binários externos.

## Verificar e começar

A partir da raiz do seu estúdio:

```sh
npm run verify
npm run studio -- doctor
npm run studio -- list
npm run docs:dev
```

Uma lista de personagens vazia é esperada em um estúdio novo. Abra o endereço mostrado por `docs:dev` para ler o manual. O manual é local; seu servidor de desenvolvimento não o publica remotamente. Consulte [início rápido](quick-start.md), [operação](operations.md) e [capacidades do framework](studio-status.md).

O OLYMPOX é distribuído sob a [licença MIT](../../../LICENSE). Conteúdo de personagens, referências externas e serviços de fornecedores mantêm seus próprios termos e direitos aplicáveis.
