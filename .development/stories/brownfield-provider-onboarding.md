# Guided provider choice and private credentials

Status: Ready for Review

## User story

As a creator installing an independent OLYMPOX studio, I choose my media provider during onboarding and configure my own account through protected copy and paste, without editing configuration files. The user explicitly authorized this change on October 13, 2026. It extends the optional executor after the immutable rc.2 release; it does not republish that release or migrate personal studios.

## Acceptance criteria

1. Interactive setup asks Higgsfield (default) or BytePlus (experimental) before the reviewed installation confirmation. `--provider higgsfield|byteplus` supports automation. Missing unattended selection preserves an existing preference or the historical Higgsfield default.
2. Private nonsecret `work/studio-settings.json` uses `{schemaVersion:1,studioId:<uuid>,mediaProvider:<token>}`. Settings are preflighted before copying, and drift, malformed state or links refuse writes. Identical settings retain their bytes. No credential is in this file.
3. New runs resolve registry defaults, then the saved studio preference, then explicit per-medium overrides. Existing runs/attempts preserve captured choices, canon, inputs, approvals and history; changing preference does not migrate them.
4. After successful offline installation verification, interactive BytePlus setup offers configure now or later. Unattended installation never reads keys, authenticates, calls a provider or generates. Cancellation of connection preserves a valid installation.
5. A separate connector guides account-console/API-key creation and hidden terminal paste, never requiring a code editor or key in chat/arguments. Documentation does not invent an inference OAuth flow.
6. Windows uses DPAPI CurrentUser with bounded private pipes and encrypted per-studio, per-medium storage outside the studio. Links, unsafe paths, plaintext fallback and raw secret/error exposure are refused. Existing encrypted versions remain preserved for original-job recovery.
7. Explicit process environment credentials override the saved key. Unsupported persistent-vault platforms support later configuration and hidden in-memory prompting when an operation needs a key. Connection/configuration does not prove account/model access or billing.
8. English and pt-BR instructions, onboarding presentation, first prompt, CLI help, manual command catalog and affected guides explain the resulting behavior. First prompt and assistant instructions honor the saved choice.
9. Synthetic tests cover the actual guided flow, hidden input, cancellation, preference precedence, historical preservation, secret exclusion, credential recovery, export/install privacy and conflicts. Complete product and AIOX checks pass, and an independent installation exercises the changed code.

## Tasks

- [x] Implement private settings and new-run preference precedence.
- [x] Add provider selection and local connection handoff to onboarding.
- [x] Implement protected connector, credential resolver and hidden input.
- [x] Integrate credentials with the existing optional executor without weakening original-job checks.
- [x] Update paired instructions, guides, CLI and manual catalogs.
- [x] Complete focused and full synthetic tests, independent installation/privacy checks and QA review.

## Dev notes

Use `.development/{coding-standards,tech-stack,source-tree}.md`, `docs/installation.md`, `docs/provider-execution.md`, `docs/framework-02.md`, `docs/localization.md` and `docs/living-documentation.md`. Keep Node 22+ and no product runtime dependency. Read-only capability/status is local and never an authentication test. ModelArk API key and speech API key are distinct. Preserve the complete-pilot and canon contracts and leave unsupported voice/video routes pending. Official authentication sources are reviewed by Aria. External CodeRabbit export was previously rejected; use independent local Aria/Quinn review without retrying that export.

## Dev Agent Record

Implementation: complete locally; publication and the unresolved primary-path gate remain outside the completed acceptance scope. User authorization: explicit onboarding and simpler private key configuration. Engineering roles: Dex implementation, Aria authentication/credential architecture and isolated modules, Quinn independent integrated tests and review, Uma copy/documentation. Personal production, real keys, paid media, remote publication and historic tag edits are outside this task.

### Checks and files

Implementation is complete locally and remains unreleased. The published rc.2 archive/tag and personal studios are unchanged. Independent review found no remaining blocking implementation defect; the primary-checkout full gate remains a recorded host concern.

- Full archive-derived installed gate: 311/311, 0 failures/skips; 221 package and 231 installed file mappings, both assistants, privacy, existing Git, merge preservation and conflict zero writes. Report: `tmp/provider-release-install-L1R1td/report.json`.
- Identical independent development source: 311/311 and complete `npm.cmd run verify` exit 0. All 225 mappings (221 package sources plus four exact engineering-context files) preserved before/after; development marker retained. Report: `work/maintenance/provider-onboarding-verification-2026-10-13/isolated-development-source-report.json`. This is a path-isolation check, not a claim that the primary checkout passed.
- Native Windows PTY: guided BytePlus selection/configure-now/hidden paste, standalone rotation and cancellation all exited naturally with 0; no key echo/plaintext, protected old/new key recovery, separate optional speech, external vault and 0 provider HTTP. Synthetic keys only. Report: `tmp/provider-onboarding-acceptance-iMJEK0/installed-inspection-report.json`.
- AIOX: seven engineering checks and 12 Codex projections, 0 product dependencies. Log: `tmp/provider-onboarding-aiox.log`. No root lint/typecheck scripts exist; those gates are not reported as passing.
- Final editorial delta changes only two installation-guide sentences to describe saved-choice preservation accurately. Documentation tests/build/check and fresh archive/install byte checks passed after this delta; runtime and test code remain byte-identical to the full 311 gates. Report: `work/maintenance/provider-onboarding-verification-2026-10-13/final-editorial-report.json`.
- Primary checkout: retained first failure (specific settings-path diagnostic compatibility, corrected without changing the legacy test); later full runs each passed 310/311 and failed on observed Windows EPERM in unchanged native rename helpers, once snapshotCanon and once atomicSave. Cause unconfirmed. Logs: `work/maintenance/provider-onboarding-verification-2026-10-13/source-verify.log`, `work/maintenance/provider-onboarding-verification-2026-10-13/source-verify-final.log`, `work/maintenance/provider-onboarding-verification-2026-10-13/source-verify-sequential.log`. Earlier asynchronous precheck 43/44 is retained, with the same isolated assertion then 1/1; cause unconfirmed.
- Live BytePlus authentication, account/model access, costs, exact reference eligibility, media continuity, host skill discovery and paid generation were not tested.

Changed product files (37):

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

Engineering records: this story and its paired pt-BR story; private evidence stays under ignored `work/` and `tmp/`. Final source digest: `3ae2193df6be458d874afd93705860e3bfdeb518c375fc02a03f1ea3fefe68b4`.

## QA Results

Quinn decision: **PASS for the local implementation and independent acceptance scope**. Independent integrated tests verified preference precedence, historical-byte preservation, configuration deferral, masked input, original protected-key recovery, environment overrides and secret exclusion. Actual native Windows PTY acceptance completed guided setup, standalone rotation and cancellation with natural exit 0, synthetic keys, no key echo and no provider HTTP.

The identical development-source gate and archive-derived installed gate each passed 311/311 with no failures or skips. Independent final readback verified all 37 frozen paths against actual and Git-filtered bytes, all 221 archive files against source and all 231 installed mappings against the full-gate installation. Only the exact paired installation-guide sentence corrections differ from those complete gates; documentation passed 20/20 plus build/check. Final archive SHA-256: `78276260536433af7bd256bb132fad6fff59ce08c0aba64a8d108c90f81c829a`. Detailed decision: `work/maintenance/provider-onboarding-2026-10-13/quinn-integration-qa.json`.

**Open verification concern:** the primary checkout's complete gate remains unresolved after observed EPERM rename failures, with cause unproved. This review does not claim that path passed or that the underlying issue was fixed. Status remains Ready for Review. Live provider access, costs, media quality and personal credentials were not tested; the published rc.2 release remains unchanged.

## Change log

- 2026-10-13: Ready for Dev from the user's explicit request; separate from the completed rc.2 release.

- 2026-10-13: Ready for Review after independent full-code, installed, PTY and final documentation acceptance; primary-checkout EPERM remains recorded.
- 2026-10-13: Quinn recorded scoped implementation QA PASS after exact final package/install readback; Ready for Review and the primary-path verification concern remain unchanged.

## Authorized rc.3 release preparation

On October 13, 2026 the user explicitly requested publication: "publica por favor". Gage prepared the additive 0.6.0-rc.3 GitHub prerelease. The final source and actual archive-derived independent installed gates each passed 311/311 with zero failures/skips; 221 package sources and 231 installed mappings passed privacy/preservation checks. Final release evidence: `work/maintenance/provider-onboarding-release-2026-10-13/final-gates.json`. Runtime/test bytes remain those reviewed by Aria and Quinn; current-version presentation and paired release notes are updated. The primary-path EPERM concern remains open and explicitly disclosed. Stable 0.5.0, rc.2 history, personal studios, npm registry and hosted manual are outside mutation scope. Remote tag, release and actual public npx verification are recorded separately after execution.
