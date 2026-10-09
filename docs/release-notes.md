# Release notes

These notes explain framework behavior by version. The current guides describe the 0.5.0 source. Historical defaults below apply to their own revisions and do not override current guidance. Read [installation and upgrade](installation.md) before changing an existing studio.

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
