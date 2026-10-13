# Escolha guiada de provedor e credenciais privadas

Status: Ready for Review

## História

Como criador instalando um estúdio OLYMPOX independente, escolho o provedor no onboarding e configuro minha conta por copiar e colar em entrada protegida, sem editar arquivos. O usuário autorizou explicitamente esta mudança em 13 de outubro de 2026. Ela estende o executor opcional após a rc.2 imutável; não republica aquela versão nem migra estúdios pessoais.

## Critérios de aceitação

1. O setup interativo pergunta Higgsfield (padrão) ou BytePlus (experimental) antes da confirmação revisada. `--provider higgsfield|byteplus` serve à automação. Sem seleção não interativa, mantém a preferência existente ou o padrão histórico Higgsfield.
2. `work/studio-settings.json` privado e sem segredos usa `{schemaVersion:1,studioId:<uuid>,mediaProvider:<token>}`. Preflight antecede a cópia; mudanças concorrentes, estado inválido ou links recusam escrita. Configuração idêntica mantém bytes. Nenhuma credencial nesse arquivo.
3. Runs novos aplicam padrões do registro, preferência do estúdio e overrides explícitos por mídia. Runs/tentativas existentes mantêm escolhas capturadas, cânone, entradas, aprovações e histórico; mudar a preferência não os migra.
4. Após instalação offline e verificação bem-sucedida, o setup BytePlus interativo oferece configurar agora ou depois. Instalação não interativa nunca lê chaves, autentica, chama provedor nem gera. Cancelar conexão preserva a instalação válida.
5. Um conector separado orienta console da conta/criação de chave e colagem oculta no terminal, sem editor de código ou chave em chat/argumentos. A documentação não inventa OAuth para inferência.
6. Windows usa DPAPI CurrentUser com pipes privados delimitados e armazenamento criptografado por estúdio/mídia fora do estúdio. Recusa links, caminhos inseguros, fallback em texto puro e exposição de segredos/erros brutos. Versões criptografadas anteriores continuam preservadas para recuperar jobs originais.
7. Credenciais explícitas do ambiente do processo prevalecem sobre a chave salva. Plataformas sem cofre persistente suportado permitem configurar depois e entrada oculta em memória quando a operação exige chave. Configuração não comprova acesso, modelo ou cobrança.
8. Instruções EN/pt-BR, apresentação do onboarding, primeiro pedido, ajuda CLI, catálogo do manual e guias afetados explicam o resultado. Primeiro pedido e instruções do assistente respeitam a escolha salva.
9. Testes sintéticos cobrem fluxo guiado real, entrada oculta, cancelamento, precedência, preservação histórica, exclusão de segredos, recuperação, privacidade de exportação/instalação e conflitos. Verificações completas do produto/AIOX passam; instalação independente exercita o código alterado.

## Tarefas

- [x] Implementar configurações privadas e precedência para runs novos.
- [x] Adicionar escolha de provedor e conexão local ao onboarding.
- [x] Implementar conector protegido, resolução de credenciais e entrada oculta.
- [x] Integrar credenciais ao executor sem enfraquecer verificações de jobs originais.
- [x] Atualizar instruções, guias, CLI e catálogos nas duas línguas.
- [x] Concluir testes focados/completos, instalação independente/privacidade e revisão QA.

## Notas de desenvolvimento

Use `.development/{coding-standards,tech-stack,source-tree}.md`, `docs/installation.md`, `docs/provider-execution.md`, `docs/framework-02.md`, `docs/localization.md` e `docs/living-documentation.md`. Node 22+, sem dependência externa no produto. Capabilities/status são locais, nunca teste de autenticação. Chaves ModelArk/voz são distintas. Preservar contratos de piloto/cânone e deixar rotas não suportadas pendentes. Aria revisa fontes oficiais. Exportação externa CodeRabbit foi recusada anteriormente; usar revisão local independente Aria/Quinn sem repetir a exportação.

## Registro Dev

Implementação: concluída localmente; publicação e gate pendente do caminho principal permanecem fora da aceitação concluída. Autorização: onboarding e configuração privada simplificada. Papéis: Dex implementação, Aria arquitetura de autenticação/credenciais e módulos isolados, Quinn testes/revisão independentes, Uma texto/documentação. Produção pessoal, chaves reais, mídia paga, publicação remota e edição de tags históricas estão fora desta tarefa.

### Verificações e arquivos

Implementação local concluída e ainda não publicada. Arquivo/tag rc.2 e estúdios pessoais permanecem intactos. Revisão independente não encontrou defeito bloqueante na implementação; o gate completo do checkout principal permanece uma ressalva do ambiente registrada.

- Gate completo da instalação derivada do pacote: 311/311, 0 falhas/skips; 221 arquivos do pacote e 231 instalados conferidos, dois assistentes, privacidade, Git existente, merge preservado e conflito sem escrita. Relatório: `tmp/provider-release-install-L1R1td/report.json`.
- Fonte de desenvolvimento idêntica e independente: 311/311, `npm.cmd run verify` completo com exit 0. Todos os 225 arquivos (221 fontes do pacote e quatro arquivos exatos de contexto de engenharia) preservados antes/depois, com marcador de desenvolvimento. Relatório: `work/maintenance/provider-onboarding-verification-2026-10-13/isolated-development-source-report.json`. Verifica isolamento do caminho; não declara aprovação do checkout principal.
- PTY Windows real: escolha BytePlus/configurar agora/colagem oculta, rotação e cancelamento terminaram naturalmente com 0; sem eco/texto puro, recuperação de chaves antiga/ativa, voz separada opcional, cofre externo e 0 HTTP de provedor. Somente chaves sintéticas. Relatório: `tmp/provider-onboarding-acceptance-iMJEK0/installed-inspection-report.json`.
- AIOX: sete verificações de engenharia e 12 projeções Codex, 0 dependências de produto. Log: `tmp/provider-onboarding-aiox.log`. Não existem scripts lint/typecheck na raiz; esses gates não são declarados aprovados.
- Delta editorial final altera apenas duas frases dos guias de instalação para explicar corretamente a preservação da escolha salva. Testes/build/check da documentação e conferência de bytes do novo pacote/instalação passaram após o delta; código de runtime e testes permanece idêntico aos gates completos de 311. Relatório: `work/maintenance/provider-onboarding-verification-2026-10-13/final-editorial-report.json`.
- Checkout principal: primeira falha preservada (compatibilidade específica do diagnóstico de caminho, corrigida sem alterar o teste legado); execuções completas posteriores passaram 310/311 e falharam com EPERM observado no Windows em helpers nativos de rename inalterados, uma em snapshotCanon e outra em atomicSave. Causa não comprovada. Logs: `work/maintenance/provider-onboarding-verification-2026-10-13/source-verify.log`, `work/maintenance/provider-onboarding-verification-2026-10-13/source-verify-final.log`, `work/maintenance/provider-onboarding-verification-2026-10-13/source-verify-sequential.log`. Precheck assíncrono anterior 43/44 preservado, com a mesma asserção isolada depois 1/1; causa não comprovada.
- Autenticação BytePlus real, acesso à conta/modelos, custos, elegibilidade das referências exatas, continuidade de mídia, descoberta de skills no host e geração paga não foram testados.

Arquivos de produto alterados (37):

- `README.md`
- `bin/olympox.mjs`
- `docs-site/config.json`
- `docs-site/locales/en.json`
- `docs-site/locales/pt-BR.json`
- `docs/framework-02.md`
- `docs/installation.md`
- `docs/locales/pt-BR/README.md`
- `docs/locales/pt-BR/framework-02.md`
- `docs/locales/pt-BR/installation.md`
- `docs/locales/pt-BR/provider-execution.md`
- `docs/locales/pt-BR/quick-start.md`
- `docs/locales/pt-BR/skills/olympox/SKILL.md`
- `docs/locales/pt-BR/tools.md`
- `docs/provider-execution.md`
- `docs/quick-start.md`
- `docs/tools.md`
- `scripts/docs-core.mjs`
- `scripts/framework-core.mjs`
- `scripts/onboarding-locales/en.json`
- `scripts/onboarding-locales/pt-BR.json`
- `scripts/onboarding.mjs`
- `scripts/provider-connect.mjs`
- `scripts/provider-credentials.mjs`
- `scripts/provider-execution-core.mjs`
- `scripts/provider-execution.mjs`
- `scripts/secret-input.mjs`
- `scripts/studio-settings.mjs`
- `scripts/studio.mjs`
- `skills/olympox/SKILL.md`
- `templates/locales/pt-BR/studio-AGENTS.md`
- `templates/studio-AGENTS.md`
- `tests/docs.test.mjs`
- `tests/onboarding.test.mjs`
- `tests/provider-connection-integration.test.mjs`
- `tests/provider-credentials.test.mjs`
- `tests/provider-onboarding.test.mjs`

Registros de engenharia: esta história e a versão EN; evidências privadas permanecem em `work/` e `tmp/` ignorados. Digest final das fontes: `3ae2193df6be458d874afd93705860e3bfdeb518c375fc02a03f1ea3fefe68b4`.

## QA Results

Decisão de Quinn: **PASS para a implementação local e o escopo de aceitação independente**. Testes integrados independentes verificaram precedência da preferência, preservação de bytes históricos, configuração posterior, entrada oculta, recuperação da chave protegida original, overrides do ambiente e exclusão de segredos. A aceitação em PTY Windows real concluiu setup guiado, rotação separada e cancelamento com saída natural 0, chaves sintéticas, sem eco de chave e sem HTTP de provedor.

Os gates da fonte de desenvolvimento idêntica e da instalação derivada do pacote passaram, cada um, 311/311, sem falhas ou skips. A conferência final independente validou os 37 caminhos congelados contra bytes reais e filtrados pelo Git, os 221 arquivos do pacote contra a fonte e os 231 instalados contra a instalação do gate completo. Apenas as correções exatas das frases nos dois guias de instalação diferem daqueles gates completos; documentação passou 20/20 e build/check. SHA-256 do pacote final: `78276260536433af7bd256bb132fad6fff59ce08c0aba64a8d108c90f81c829a`. Decisão detalhada: `work/maintenance/provider-onboarding-2026-10-13/quinn-integration-qa.json`.

**Ressalva de verificação aberta:** o gate completo do checkout principal permanece pendente após falhas observadas de rename com EPERM, sem causa comprovada. Esta revisão não declara aprovação daquele caminho nem correção da causa. Status permanece Ready for Review. Acesso real ao provedor, custos, qualidade da mídia e credenciais pessoais não foram testados; a rc.2 publicada permanece intacta.

## Histórico

- 2026-10-13: Ready for Dev a partir da solicitação explícita do usuário; separado da rc.2 concluída.

- 2026-10-13: Ready for Review após aceitação independente completa do código, instalação, PTY e documentação final; EPERM do checkout principal permanece registrado.
- 2026-10-13: Quinn registrou QA PASS no escopo da implementação após conferir pacote e instalação finais; Ready for Review e a ressalva do caminho principal permanecem intactos.

## Preparação autorizada da release rc.3

Em 13 de outubro de 2026, o usuário solicitou explicitamente publicação: "publica por favor". Gage preparou a prévia aditiva 0.6.0-rc.3 no GitHub. Gates finais da fonte e instalação independente derivada do arquivo passaram 311/311 cada, sem falhas/skips; 221 fontes do pacote e 231 arquivos instalados passaram privacidade/preservação. Evidência final: `work/maintenance/provider-onboarding-release-2026-10-13/final-gates.json`. Bytes de runtime/testes permanecem revisados por Aria e Quinn; apresentação da versão e notas pareadas foram atualizadas. Ressalva EPERM do caminho principal permanece aberta e declarada. Estável 0.5.0, histórico rc.2, estúdios pessoais, registro npm e manual hospedado ficam fora do escopo de mutação. Tag, release e verificação pública real por npx serão registradas separadamente após executar.
