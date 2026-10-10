# OLYMPOX development

This repository develops the OLYMPOX product. AIOX 5.4.1 supplies engineering roles for Codex; OLYMPOX profiles and skills are source artifacts for independent influencer studios.

Use architect, dev, qa and devops for software work. Inspect product profiles as domain requirements, without activating the creative framework here. Read [coding standards](coding-standards.md), [technology](tech-stack.md) and [source tree](source-tree.md).

## Local tooling

AIOX is pinned to the official `@aiox-squads/core@5.4.1` package. Its runtime and dependencies stay in `.aiox-core/`; generated Codex roles stay in `.codex/`, and the supported repository skill projection is `.agents/skills/aiox-*`. The root product manifest remains dependency-free.

Run `node .development/verify-aiox.mjs` for local tooling and `npm.cmd run verify` for the framework. Local file validation does not prove Codex discovery or execution of a remote provider.

The explicit `.development/project.json` marker selects development diagnostics and prevents creative runtime commands and public creative skill activation before writes. Both entrypoints use one strict marker reader; malformed markers and linked development paths are refused. Read-only help remains usable. Installed studios have no marker and retain normal skill checks and production safeguards. The internal skill installation API remains available for synthetic fixtures and the destination installer.

## Select an engineering role

In Codex, select the repository skill for the current engineering task:

- `$aiox-architect`: architecture and design; profile `.aiox-core/development/agents/architect.md`.
- `$aiox-dev`: implementation; profile `.aiox-core/development/agents/dev.md`.
- `$aiox-qa`: verification and review; profile `.aiox-core/development/agents/qa.md`.
- `$aiox-devops`: release work within the user's authorization; profile `.aiox-core/development/agents/devops.md`.

Confirm that the host exposes the skill before claiming activation. If discovery is unavailable, explicitly load the matching canonical profile as instructions for the coordinating assistant. Reading a skill or profile does not dispatch a worker; report delegation only when a real subagent ran. OLYMPOX creative profiles remain product requirements for destination studios.

## Reinstall pinned tooling safely

Run the official installer in a separate reviewed Git checkout, so it cannot rewrite this checkout's engineering `AGENTS.md` or product `package.json`:

```powershell
npx.cmd --yes --package @aiox-squads/core@5.4.1 aiox install --quiet --ide codex --merge
```

Review and reconcile only `.aiox-core/` from that isolated installation, preserving local configuration, state and unrelated changes. Do not copy its root instructions, product manifest or other product files. In the engineering checkout, run:

```powershell
node .development/repair-aiox-runtime.mjs
node .development/configure-aiox.mjs
node .development/verify-aiox.mjs
```

The repair verifies the official archive, restores the four missing quality files and installs missing reviewed dependencies only in the internal AIOX package. Configuration preflights the guides and pinned source, applies Codex-only engineering settings, adapts the required-context metadata and regenerates Codex and repository projections. Product verification remains `npm.cmd run verify`.

The context adaptation starts from integrity-verified upstream `data/agent-config-requirements.yaml`, SHA-256 `68e87b5777d1872c4fed6644dd3c7e3c3e8fd590df7d2b58c36d541cf8e38dd3`, in the pinned archive. It replaces only exact `docs/framework/{coding-standards,tech-stack,source-tree}.md` paths, including shared/cache entries. Dev follows the three configured `devLoadAlwaysFiles`, ordered coding standards, technology and source tree; other roles follow `frameworkDocsLocation`. Existing confined alternate paths are preserved by configuration. Required guides must be nonempty files, paths must remain within this checkout, and links, unknown upstream/runtime changes and conflicting adaptation bytes are refused before configuration writes. The loader and all 12 canonical profiles remain byte-identical to the official archive.

Repeating configuration recognizes the official baseline or a provenance-verified prior adaptation and produces stable adapted bytes. The untouched baseline and `.development/state/aiox-context-adaptation.json` record version, archive integrity/hash, exact mapping, input/result hashes and preserved loader/profile hashes. With the default paths, the adapted requirements hash is `381d85cc0504414bdf3edf709d7b6bc4910d769b461de796ef81ddafcc7d01dc`. Review a new upstream version before changing these pinned sources; do not overwrite unknown drift.

`verify-aiox.mjs` starts `verify-aiox-context.mjs` in a fresh process, bypasses content/definition caches and disables performance writes. It loads the actual complete contexts for all 12 roles, checks their identities, and compares all applicable non-lazy required contents with exact source bytes. An independent fixed guide matrix requires Dev's three guides, PM's two, SM's coding standards, Analyst's technology/source tree, and UX's technology/coding standards. Missing, empty, unreadable or dropped requirements fail with role/path evidence; intentionally lazy context remains skipped according to the actual upstream loader.

Run isolated regression checks separately from the consumer product suite:

```powershell
node --test .development/aiox-context.test.mjs
node .development/verify-aiox-context.mjs
```

These fixtures use the real pinned loader to demonstrate missing/empty guide failure, alternate configured paths, idempotence, unknown-source conflicts and path/link refusal. On this managed Windows host, junction creation and rewriting the protected `.codex/`/`.agents/` projections require the normal tool escalation; that is a filesystem permission limit, not a reason to skip the checks. A clean bootstrap must exercise the full staged installer/repair/configure/verify recipe and compare root instructions/product manifest before and after; an existing primary installation does not prove reproducibility.

Known upstream limits in 5.4.1: the agent consistency checker reports 121 dependency/category warnings and zero errors; its loader converts grouped `ux-design-expert` commands to an empty array, while the original profile and projected skill retain those commands. Tooling checks do not establish live host discovery or dispatch. Local repair provenance and checks are in `.development/state/tooling-runtime-repair.json`.

## Distribution

Root `AGENTS.md` is engineering policy and is excluded from the npm package. Its Portuguese companion is [AGENTS.pt-BR.md](AGENTS.pt-BR.md). Installed English and Portuguese instructions come from studio templates. The installer uses its own Git templates, never local engineering configuration.

Do not export `.development/`, `.aiox-core/`, `.codex/`, development skill projections, tool dependencies, stories, local maintenance or credentials. No AIOX code or dependencies are required by a consumer installing OLYMPOX in Codex or Claude Code.

The public 0.5.0 release remains a separate immutable artifact; development changes do not republish it. Coordinate with other conversations before reconciling overlapping manual files.
