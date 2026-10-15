# Release notes

These notes explain framework behavior by version. The current guides describe stable version 0.6.0. Historical defaults below apply to their own revisions and do not override current guidance. Read [installation and upgrade](installation.md) before changing an existing studio.

## 0.6.0 — October 15, 2026

Version 0.6.0 promotes the reviewed local framework to the stable release line. Higgsfield remains the default media pipeline; assistant-integrated images remain an explicit image-stage alternative. The BytePlus executor, credential connector, saved provider preference and provider-choice onboarding are excluded. Historical tags and archives, including rc.1–rc.4 and 0.5.0, remain unchanged.

### Included behavior

- **Independent offline studios:** guided setup selects the assistant and destination, reviews the copy/retain plan and runs local checks. Both-host skill projections and conflict-refusing merge preserve unrelated files and permitted Git metadata. Installation never connects a provider, requests a provider key, generates media or publishes.
- **Exact references and preserved identity:** bounded Windows x64 image transfer uses the pinned optional Higgsfield CLI, an exact-byte/destination grant and recoverable intent. Native acknowledgement still requires separate provider-byte and plugin/module checks. Visual selection, listened-to vocal selection when speaking, complete canon approval, immutable snapshots, a reviewed pilot and actual-byte export remain part of the production method.
- **Vocal readiness corrections:** required voice coverage stays pending when its supporting stages are image-only. It needs an audio or video stage; an audio run cannot mark voice `not-required`, including with approved legacy canon. Static-image and explicit silent-video compatibility remain preserved without rewriting historical records.
- **Documentation corrections:** the runtime contract reference lists optional `readinessPlanPath`; transition and readiness tables preserve every allowed value when rendered. The English and pt-BR guides explain the same vocal boundary.

### Validation and remaining limits

The October 15 review before stable promotion passed `npm.cmd run verify` with 248 tests, zero failures or skips, plus validation, doctor and manual checks on Windows with Node 24.18.0. Independent archive-derived installation checks covered both assistant projections, preservation and conflict refusal; 32 installed readiness tests passed. The 25 guide pairs were audited, including 346 local link targets and 28 anchors, and the local manual was inspected in English and pt-BR. These are local checks using synthetic records, not a live media pilot.

The initial review encountered three `createPersona` directory-rename `EPERM` failures on Windows. The unchanged baseline passed the seven affected tests in independent OS TEMP, and the final full review passed 248/248. The intermittent condition's cause remains unconfirmed; no storage fix or automatic retry was introduced. Preserve the original error and environment when reporting it.

Real provider authentication, module/model availability, accepted reference inputs, listened-to voice continuity, complete speaking video, lip-sync, billing and export fidelity still require an inspected pilot in an independent studio. Node 22 execution, other operating systems and actual host skill discovery remain separate acceptance checks. Updating these sources or publishing a GitHub release does not deploy the hosted manual.

Install with `npx --yes github:linkiaai/olympox#v0.6.0 setup`. Existing studios use the [preservation-first upgrade procedure](installation.md#upgrade-an-existing-studio); merge does not update or uninstall automatically. Report reproducible issues through [GitHub issues](https://github.com/linkiaai/olympox/issues), including framework version `0.6.0`, operating system, Node and assistant versions, command/request, expected result and the actual sanitized error. Keep credentials, account identifiers and private creative records out of reports.

## 0.6.0-rc.4 — October 13, 2026

The optional BytePlus executor, protected credential connector, saved provider preference and provider-choice onboarding have been removed at the user's request. Setup again selects the assistant and independent studio only. Higgsfield remains the default media pipeline; assistant-integrated images remain an explicit alternative. No replacement provider has been connected.

Existing character canon, media, runs, provider jobs, studio settings and external credential vaults are preserved. Published rc.2/rc.3 tags and archives remain historical artifacts; those releases still contain the removed feature. Their provider guides and commands belong to their tagged sources, not this release. The general terminal-reader listener cleanup remains.

Install into a fresh independent studio with `npx --yes github:linkiaai/olympox#v0.6.0-rc.4 setup`. Existing studios require the explicit preservation-first [upgrade procedure](installation.md#upgrade-an-existing-studio); merge is not an automatic updater or uninstaller. This release does not delete historical provider jobs, settings or external credential vaults and does not authenticate or connect a replacement provider.

## 0.6.0-rc.3 — October 13, 2026

This experimental candidate adds guided provider choice and private BytePlus credential configuration to the independent-studio onboarding. Each consumer uses their own account. The historical rc.2 tag and archive, and stable 0.5.0 release, remain unchanged.

### What changed

- **Provider choice during setup:** choose Higgsfield (default) or BytePlus (experimental), or supply `--provider higgsfield|byteplus`. New runs honor the saved studio preference before explicit per-medium overrides. Existing attempts retain their captured choices, identity, canon, approvals and history. Unattended setup preserves a saved choice or falls back to Higgsfield.
- **Configure now or later:** after successful offline installation checks, BytePlus setup offers protected API-key paste. The separate `node scripts/provider-connect.mjs byteplus` command supports later connection. Console login is used to create/copy a key; no inference OAuth flow is implemented. Installation never authenticates, submits paid generation or publishes.
- **Protected consumer credentials:** Windows CurrentUser DPAPI stores encrypted per-studio, per-medium key versions outside the studio. Hidden input prevents terminal echo; keys do not enter studio records, arguments or backups. Optional Speech credentials are separate. Other platforms use protected per-operation memory input without plaintext persistence. Environment overrides remain supported.
- **Original-job recovery:** queued jobs can select their original protected credential version individually. Local help, status and staged exports avoid unnecessary secret reads. Configuration does not prove account/model access, reference eligibility or billing and does not authorize spending.

### Test the candidate

Install into a fresh independent directory and follow the provider question:

```sh
npx --yes github:linkiaai/olympox#v0.6.0-rc.3 setup
```

Use `--locale pt-BR` for Portuguese prompts. Follow [installation and upgrades](installation.md) and private connection (historical guide in the corresponding release tag). Run `npm run verify` in the installed studio; Windows can use `npm.cmd` or `npx.cmd`. Keep keys out of conversations and sanitized issue reports.

### Verification and experimental limits

Synthetic checks cover preference precedence, original-attempt preservation, protected input, Windows DPAPI history, credential recovery, offline inspection, package privacy, fresh installation and conflict refusal. Native Windows terminal acceptance uses synthetic keys and no provider calls. Existing rc.2 media-driver limits still apply: live authentication, actual costs, reference acceptance and audiovisual continuity require a consumer pilot; preset TTS does not clone a canonical voice.

The primary-checkout Windows atomic-rename `EPERM` investigation remains open with an unproved cause. Independent identical development sources and archive-derived installed studios provide separate verification; their results do not claim that the primary-path issue is fixed. Node 22, other operating systems, actual host skill discovery and human novice acceptance remain separate checks.

## 0.6.0-rc.2 — October 13, 2026

This experimental candidate adds an optional direct BytePlus executor for consumers using their own accounts, credentials and budgets. Selecting this alternative is explicit; Higgsfield remains the default media pipeline. Existing character identity, canon, approved voice, references and historical attempts remain preserved. No personal creative production or live paid provider pilot was performed in the development checkout.

### What changed

- **Optional provider execution:** a separate dependency-free CLI supports explicit AP-region Seedream image, Seedance 2.5 video and preset SeedSpeech TTS requests. Each consumer supplies private environment credentials. Installation and offline preparation neither authenticate nor generate media. Configured credentials do not prove model entitlement. See provider execution (historical guide in the corresponding release tag).
- **Exact approved inputs:** jobs capture immutable prompt and reference bytes, hashes, roles, ordering, parameters, canon and framework contracts. Dispatch refuses input, credential or contract drift. Production references must match approved canon; supported historical vocal reuse requires a current exact listening declaration without rewriting the old canon.
- **Queue, scoped grants and reservations:** a durable local ledger coordinates jobs and concurrent budget reservations across characters. Submission requires a matching unexpired explicit grant. Quotes, authorized uncertainty, reserved amounts and reconciled actual charges remain distinct. A local USD ceiling does not enforce a provider spending cap, and unknown actual charges retain their reservation until explicit billing reconciliation.
- **Original-job recovery:** uncertain submissions retain their intent and are never automatically repeated. Known asynchronous jobs are queried by their original identifier with the bound credential. Encrypted output locators keep signed URLs out of plain persisted records and backups. Changing credentials does not silently retarget an existing job.
- **Draft export and workflow evidence:** bounded export verifies actual media bytes, records hashes and preserves existing files through an export journal. Captured workflow bindings can record submission, recovery and export evidence. A completed provider job does not approve an asset, change canon, complete a workflow task or authorize publication.

### Test the candidate

Install into a fresh independent directory:

```sh
npx --yes github:linkiaai/olympox#v0.6.0-rc.2 setup
```

For an existing studio, follow the [preservation-first upgrade procedure](installation.md#upgrade-an-existing-studio). Run `npm run verify` in the installed studio; on Windows use `npm.cmd` or `npx.cmd` if needed. Start with offline preparation and review provider execution (historical guide in the corresponding release tag) before connecting an account. A real media pilot separately requires model access, eligible exact inputs, a feasible full-pilot budget, applicable authorization, exported bytes and complete media inspection.

Report reproducible results through [GitHub issues](https://github.com/linkiaai/olympox/issues), including framework version, operating system, Node and assistant versions, the command, expected behavior and sanitized actual error. Separate installation, local execution, host skill discovery and live provider behavior. Keep credentials, account identifiers, private creative records, signed URLs, media and backups out of reports.

### Verification and experimental limits

The implementation passed 282 tests with zero failures or skips on Windows with Node 24.18.0, both in the source checkout and in an independent studio installed from an actual package archive. Controlled HTTP fixtures exercised the public CLI, exact reference bytes, concurrent reservations, uncertain outcomes, credential binding, export recovery and preservation. Package and installed-tree checks covered reusable-source selection, private-data exclusion, preserved Git metadata and conflict refusal. These are local checks using synthetic media and credentials.

Live authentication, model availability, accepted portrait/reference origins, identity continuity, listened-to voice fidelity, complete audiovisual output, actual billing and original-provider recovery remain unverified. BytePlus portrait rules restrict eligible real-person inputs; the API catalog does not establish acceptance of an existing external fictional character. Confirm eligibility in the consumer's own account before spending. Local video-reference transfer remains pending. Preset TTS produces draft vocal samples and does not clone or condition on an existing canonical voice file; that route leaves existing-voice production pending.

Synchronous image/TTS responses have a crash window between receiving a successful result and staging its first media bytes. If those bytes were not saved, the job can retain its accepted outcome and reservation without a recoverable local output. Export remains pending and may need original-provider or manual recovery; the executor does not regenerate automatically. This candidate does not promise complete crash recovery.

Node 22+ remains the declared minimum; Node 22 execution, other operating systems, actual Codex/Claude skill discovery, human novice observation and assistant/media parity still need independent validation. The historical Windows atomic-rename `EPERM` investigation remains open. A consumer pilot is required before batches or publication.

## 0.6.0-rc.1 — October 9, 2026

This release candidate is intended for community testing of the updated local framework. It is not a certification of complete media production, novice onboarding or Codex/Claude parity. The historical `v0.5.0` release remains unchanged.

### What changed

- **Exact local image transfer:** a separate operation plans an immutable local reference snapshot, checks the intended account/workspace and an exact transfer grant, then supports one upload through the optional official `@higgsfield/cli@1.1.26` Windows x64 baseline. Installation does not install or authenticate that CLI. This increment supports image receipts only; audio/video transfer, other platforms and real provider input acceptance remain pending. Uncertain transfers retain their intent and require reconciliation before another dispatch. Native acknowledgement does not prove provider-original bytes or access in a plugin/module. See [local transfer](higgsfield-setup.md#transfer-local-files-for-plugin-use).
- **Speaking and silent canon:** new declared vocal scope distinguishes `speaking`, `silent` and unresolved applicability. Speaking canon requires an exact reviewed audio reference and a recorded listening selection; silent canon explicitly marks voice not applicable. Unresolved scope remains draft. Historical absent fields, saved contracts, approvals and hashes retain their original semantics. Local checks validate the declarations and bytes; they do not prove that a person listened or that a voice is good. See [identity and records](operations.md).
- **Media readiness per stage:** current generation contracts bind the chosen method, whole-pilot feasibility, exact current inputs, accepted input identifiers, quotes, scoped authorizations and execution context. Missing modules, unverified inputs or unaccepted cost uncertainty remain actionable pending states. Offline planning and status make no provider call; the local gates check consistency of recorded observations, without authenticating consent, proving provider acceptance or enforcing a service spending cap. Old attempts retain their captured contracts. See [workflow operation](framework-02.md) and [the runtime reference](../framework/README.md).
- **Development and studio separation:** the source checkout uses AIOX for software engineering and refuses creative runtime writes when marked as framework development. Independent installed studios receive creative instructions and OLYMPOX skills. AIOX runtime, projections and dependencies stay outside the product package and installer.

### Test the candidate

1. Start in a fresh independent directory using the tagged candidate:

   ```sh
   npx --yes github:linkiaai/olympox#v0.6.0-rc.1 setup
   ```

   Choose your assistant and review the destination. For an existing studio, follow the [preservation-first upgrade procedure](installation.md#upgrade-an-existing-studio). `--merge` retains identical files and refuses conflicts; it is not an automatic updater.
2. Run `npm run verify` from the installed studio, open it in your actual Codex or Claude Code environment and invoke `$olympox` or `/olympox`. On Windows, use `npm.cmd` or `npx.cmd` if needed. Begin with: “Use OLYMPOX to propose three distinct original adult influencer concepts for short comedy videos. Recommend one. Only prepare concepts now; do not generate media, send files, authenticate services, spend credits or publish.” A connected media provider is not required for this preparation.
3. Report a reproducible result through [GitHub issues](https://github.com/linkiaai/olympox/issues), including framework version `0.6.0-rc.1`, operating system, Node version, assistant/version, command or request, expected result and the actual error. Distinguish installation, skill loading and provider execution. Redact credentials, account identifiers and private creative details; do not attach private character records, reference files, complete raw provider output or backups.

Local preparation is sufficient to start testing this candidate. A real media test separately needs verified modules and transport, a complete feasible pilot budget, applicable authorization, actual exported bytes, listened-to voice selection and complete video playback. Installation grants none of those external operations.

### Known acceptance limits

Pre-release preparation checks ran on Windows with Node 24.18.0, before the release-version metadata was updated. Node 22+ remains the declared minimum; execution on Node 22 and the other operating systems is still pending. Codex and Claude installation projections passed local checks. A Codex CLI 0.135.0 session prepared three concepts after two preserved configuration failures: unsupported `ultra` effort, then the configured `gpt-6.1-sol` model rejected on that CLI ChatGPT route. A process-only `--ignore-user-config` attempt succeeded without changing personal settings. Its transcript did not independently establish complete skill loading. No real Claude Code session was available, and a provider route in a fresh CLI/Claude session remains unverified.

Real reference upload and acceptance, generated/listened-to voice, complete inspected speaking video, human novice observation and media parity remain pending. Read-only catalogs and quotes are preparation evidence, not successful production. Historical intermittent Windows `EPERM` during atomic rename remains a separate investigation with an unproven cause; this candidate makes no claim that it fixes that issue. Preserve the original error and environment when reporting it.

## 0.5.0 — October 9, 2026

The `v0.5.0` tag identifies the published framework release. Install it with `npx --yes github:linkiaai/olympox#v0.5.0 setup`, or use `node bin/olympox.mjs setup` from a reviewed checkout or extracted package. Documentation changes after the release require their own export and publication.

### Installation and assistants

- Guided `setup` chooses presentation language, Codex/Claude Code/both, and an independent destination. It presents the complete installation plan and checks that the reviewed plan is unchanged before writing.
- Cancellation before installation leaves the destination untouched. Noninteractive setup requires explicit directory, assistant, and `--yes`.
- Setup runs local manual build, doctor, record validation, and documentation check in order. The full test suite remains `npm run verify` from the installed studio.
- Direct installation supports `--assistant codex|claude|both`, with compatible default `codex`. Claude Code receives `.claude/skills/` and a `CLAUDE.md` import of the studio's creative `AGENTS.md`.
- All selected destinations are preflighted. Identical files are retained; differences are refused. `--merge` does not update customized framework files automatically.

### Media method and run policy

Higgsfield is the default pipeline for new appearance, candidates, references, scenes, edits, voice, animation, video, and lip-sync. Codex or Claude Code coordinates concepts, personality, narrative, scripts, and planning. Assistant-integrated images require an explicit alternative decision. Missing required modules remain pending.

New runs save `mediaProviders` per attempt for image/video/audio. Generation capabilities, external intent, and completion evidence must match the selected provider. New `create-character` runs default to a video pilot; candidate generation/review use image. Changing an existing run's provider requires an explicit new attempt and reason.

The [reference-method guide](higgsfield-influencer-method.md) distinguishes observed source steps from current adaptations. A generic connection does not demonstrate exact-module support. The [pilot handoff](production-handoff.md) checks the entire route, exact-reference transport, voice listening, full video inspection, export, and bounded cost before paid production. The framework supplies preparation and traceable records, not automatic upload or provider execution.

### Compatibility and documentation

Historical attempts without provider policy retain their saved semantics. Character identity, approved voice, media, snapshots, approvals, and old attempts remain intact. A new attempt preserves its run's saved contract; start a separate run when a changed workflow definition is required.

Task/workflow contract revisions remain 0.2.0 with additive new-run policy; this does not make 0.2.0 the framework release. English and pt-BR guides explain current behavior, commands, responsibilities, preservation, and capability limits together.

Local verification covers records, provider policy, stage media, installation, export selection, and preservation. It does not demonstrate live assistant discovery, provider execution, audiovisual fidelity, or remote publication. Verification results belong to the revision and environment actually checked.

## 0.4.0 — October 8, 2026

Historical image-generation policy: integrated ChatGPT/Codex images became the preferred route for appearance, candidates, references, scenes, images, and edits when available. Explicit user methods took precedence; specialized voice/video/lip-sync remained dependent on verified tools. Higgsfield routes were optional for selected stages.

The video handoff introduced concrete identity/voice, script, scene, reference-subset, transfer, and export checkpoints. Complete speaking-character canon approval, real reference attachment, pilot before batches, full inspection, and applicable publication authorization remained required. This policy preference was not a provider benchmark or a promise of free/unlimited generation.

The `v0.4.0` tag identifies this historical source revision. Its saved canon and execution records are preserved during explicit updates. Read the current method guide for new work after updating; do not apply these historical defaults automatically to 0.5.0.

## 0.3.0 — October 8, 2026

Short adaptive discovery and three distinct character concepts connected visual signature, personality, and recurring content. The documented Higgsfield method used candidate selection, coherent references, draft vocal exploration/listening for speaking characters, complete canon approval, and a video pilot before batches. Soul ID remained conditional and separately authorized.

The reference study separated observed source footage from current Builder adaptations. A versioned production-method plan preserved stage mapping and capability gaps. Generated prompts included creative audience, proposition, personality, and fictional background when present, alongside identity and exact speech.

The `v0.3.0` tag identifies this historical source revision. Local tests covered prompt context, saved-method drift, required capabilities, and package/installer preservation; they did not establish live media execution or virality.

## 0.2.1 — October 8, 2026

Guidance and the `higgsfield-studio` skill added a connected-plugin route alongside the existing CLI/wrapper. Both used canon, run intent, reconciliation, execution seals, and exact-file review. Integrated images remained the documented default when available at that revision.

External-job guidance clarified `resolve` for ordinary success, failure, and confirmed non-submission. Test files ran sequentially to reduce peak resource use. The `v0.2.1` tag identifies this historical source revision; the local core/task component revision remained 0.2.0.

Plugin guidance did not add an automatic adapter, authentication, submission, querying, retry, download, or approval. Those remained real studio operations with tool access and applicable authorization.

## Upgrading from a historical version

Preserve private records and the shared foundation, install the desired revision separately, compare reusable sources, and reconcile intended changes explicitly. Verify the updated studio and review any resumed run's observed context. Unresolved external jobs must be reconciled before a new attempt. Follow the complete [upgrade procedure](installation.md#upgrade-an-existing-studio); do not rewrite history to fit current policy.
