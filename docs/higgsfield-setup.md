# Optional local Higgsfield setup

Higgsfield is an optional provider for a studio. Framework installation supplies a skill, wrapper, and provider-source provenance; each studio installs the CLI and connects its own account separately. The documented wrapper baseline is CLI **1.1.26** on Windows x64. Sources and baseline installer were reviewed on **October 7, 2026**; recheck provider terms and capabilities before use.

## Supported baseline and studio requirements

| Item | Baseline or requirement |
| --- | --- |
| Official CLI | `@higgsfield/cli` **1.1.26** expected by the wrapper; install separately in `tools/higgsfield` |
| Binary | Windows amd64, build `69f3a33c3325d8fdde3a1ecb0b8e7cc5ebc7e8a3`; archive SHA-256 checked by the inspected installer |
| Studio wrapper | `scripts/higgsfield-local.mjs`; help, version, integrity, and limited queries |
| Skill source | Generation `0.13.0` preserved in `vendor/higgsfield-skills`, with revision and hashes recorded; original not activated in `.agents` |
| Account and provider access | Your own account, connected after CLI preparation |
| Balance and cost per model | Query for your account before authorized production |
| Video, voice, and Soul ID | Requires separately authorized execution, exact references, and complete review |

Prepare the pinned CLI through the installation steps below before running the wrapper checks. Local preparation does not prove model availability in your account, character consistency, audiovisual quality, or Codex access to a skill that has not loaded yet. Candidate images can use Codex's integrated tool when available, following the identity-selection process.

## Preparation commands

Run from the project root:

```powershell
node scripts/higgsfield-local.mjs doctor
node scripts/higgsfield-local.mjs version
node scripts/higgsfield-local.mjs help
node scripts/higgsfield-local.mjs help auth login
node scripts/higgsfield-local.mjs help generate cost
```

`doctor` checks the executable's presence, version, and SHA-256. It does not access credentials, prove authentication, or query the balance. The wrapper rejects versions/binaries different from those inspected. It does not install, update, generate, upload, train, publish, or print tokens. A query error or timeout does not prove an account problem; interpret the CLI's actual message.

## Connect your account

When the user requests connection, run in an interactive terminal:

```powershell
node scripts/higgsfield-local.mjs login
```

The CLI uses browser login through OAuth PKCE with a local callback, according to its help. The user completes the interaction. Do not collect a password in chat, run `auth token`, copy credentials into `.env`, character files, runs, or commits, or change HOME/APPDATA to store the session in the project. The consulted public help does not expose the exact credential-file path; confirm the actual storage location before considering the connection complete, keeping it outside the workspace and backups. Framework installation contains no account session.

Then query only what is necessary:

```powershell
node scripts/higgsfield-local.mjs inspect account status
node scripts/higgsfield-local.mjs inspect workspace status
node scripts/higgsfield-local.mjs inspect model list --json
node scripts/higgsfield-local.mjs inspect workflow list --json
node scripts/higgsfield-local.mjs inspect voices list --json
```

Confirm the correct account and workspace, plan, credits, and capabilities. Account output may contain email; record only data needed for production and do not copy private identifiers into public documentation. Selecting another workspace changes billing for future requests and needs an applicable decision; the wrapper does not offer that change.

Inspect the exact candidate model schema before promising parameters or duration:

```powershell
node scripts/higgsfield-local.mjs inspect model get seedance_2_5 --json
node scripts/higgsfield-local.mjs inspect model get kling3_0 --json
```

These IDs are documentation candidates, not models already confirmed for the account. Final selection considers accepted references, language/speech, movement, resolution, time, and cost, followed by a pilot with approved identity.

## Credits and estimates

[CLI and skills](https://higgsfield.ai/creator-hub/help-center/integrations/how-do-i-access-higgsfield-via-cli) use the Higgsfield account and credits without an API key. Unlimited and free website generations do not apply to CLI/MCP; subscription and API are distinct products. Check these terms again when subscribing and before production.

The official `generate cost` command estimates without creating a job but **automatically sends local files supplied as media input**. Do not treat an estimate with `--image`, `--video`, or other media as read-only. The wrapper accepts only simple parameters and rejects media flags, file reading through `@file`, URLs, and flags outside its safe selection. A path passed as ordinary `--prompt` text stays text; it does not attach the file. Example query after login, without submission or file upload:

```powershell
node scripts/higgsfield-local.mjs inspect generate cost kling3_0 --prompt "Cost query for a short shot" --duration 5 --mode pro --sound off --json
```

Check the current schema before this query. An estimate omitting required media can fail or differ from the final request; do not invent a value or treat it as an exact price. When an estimate needs references, use the native CLI only after applicable authorization to send them and with the exact files already approved.

The pilot budget must record initial balance, queried cost per attempt, total credit limit, and maximum attempts. The preparation wrapper neither controls nor guarantees this budget in the service. Without queryable cost, record "unknown" and obtain authorization covering that uncertainty before the job; do not confuse subscription price with cost per approved asset.

## Authorized production later

1. Choose the persona; approve exact references and create a canon snapshot. Prepare narrative, script, scenes, and voice without confusing draft with approval.
2. Check the current schema, input rights/consent, balance, and applicable budget. Local references attached to the CLI can be sent automatically to the service.
3. Before submission, persist actual intent in the run: tool/model, parameters, inputs and hashes, objective, and limit. The local core records context but does not directly block the service. Use only generation authorization valid for this scope.
4. Invoke the local native executable with separate arguments or a reviewed parameter file. Windows x64 location:

   ```powershell
   & .\tools\higgsfield\node_modules\@higgsfield\cli\vendor\hf.exe generate create <confirmed-model> <reviewed-parameters>
   ```

   Substitute the confirmed model and reviewed parameters only for authorized execution. Do not use `npx @higgsfield/cli` for a production call because it can download another version. `--wait` can wait several minutes; retain IDs as soon as they are exposed and track actual execution.
5. Record known job/request, receipt, and exposed cost. If the response becomes uncertain, preserve the pending issue and query the job before resubmitting. Queries allowed by the wrapper:

   ```powershell
   node scripts/higgsfield-local.mjs inspect generate list --json
   node scripts/higgsfield-local.mjs inspect generate get <actual-job-id> --json
   ```

6. Save media as a new persona version, register it, and seal execution. Perform a complete video/audio review using a method actually available; record failures and real approvals. A completed URL, hash, or local test proves neither quality nor publication.

Soul ID is not a prerequisite for the first pilot. Consider training only when reference-based testing demonstrates a need; authorization for a subscription or generation does not imply authorization to train/clone identity.

## Prepare the pinned CLI

The wrapper baseline uses a pinned official npm package installed without automatic lifecycle scripts. The inspected `postinstall` downloads an archive from the official release, verifies SHA-256 included in the package, extracts only `hf.exe`, and writes metadata inside the package itself. It does not alter PATH or global configuration. Source metadata and hashes: [provenance](../vendor/higgsfield-skills/provenance.json).

To prepare your studio, check the Windows x64 environment and package before installation:

```powershell
npm.cmd view @higgsfield/cli@1.1.26 version bin scripts repository dist --json
npm.cmd pack @higgsfield/cli@1.1.26 --ignore-scripts --pack-destination tools/higgsfield
```

Create the local folder if absent; inspect the package and installer against hashes/provenance. Do not automatically follow `curl | sh`, `setup`, a global installation, or a provider's paid test. After inspection, install **only the pinned package** in the local prefix with `--ignore-scripts` and explicitly run the inspected `install.js` from `tools/higgsfield/node_modules/@higgsfield/cli`. Check `doctor`, version, and help. Local `tools/higgsfield/package.json` must contain the `@higgsfield/cli: 1.1.26` pin; do not add this dependency to the studio's package.json.

Commands after that inspection, without global installation:

```powershell
npm.cmd install --prefix tools/higgsfield --save-exact @higgsfield/cli@1.1.26 --ignore-scripts --no-audit --no-fund
node .\tools\higgsfield\node_modules\@higgsfield\cli\install.js
node scripts/higgsfield-local.mjs doctor
node scripts/higgsfield-local.mjs version
```

Run the installer explicitly only after checking that installed `install.js` matches the inspected script. The inspected baseline installer has SHA-256 `67aa95c60484400e813099affce5a65d374de50ba7efbe2780a4ae9184062261`. Version and help do not require login; finish preparatory installation here.

When updating, repeat inspection, check the new archive/binary, and change the pin deliberately. The tools folder is ignored by Git; preserve studio sources and provenance files, not credentials or large binaries.

## Official sources consulted

- [CLI: Windows installation through npm and commands](https://github.com/higgsfield-ai/cli/blob/v1.1.26/README.md).
- [Release 1.1.26](https://github.com/higgsfield-ai/cli/releases/tag/v1.1.26) and npm package `@higgsfield/cli@1.1.26`.
- [Skill installation](https://github.com/higgsfield-ai/skills/blob/f83af0bc1d937c8119099a11f8ebbf5e6fb99819/INSTALL.md).
- [Generate skill and inspected references](https://github.com/higgsfield-ai/skills/tree/f83af0bc1d937c8119099a11f8ebbf5e6fb99819/higgsfield-generate).
- [CLI + Skills integration and credit rules](https://higgsfield.ai/creator-hub/help-center/integrations/how-do-i-access-higgsfield-via-cli).
- Local executable 1.1.26 help for `auth`, `auth login`, `account`, `workspace`, `model`, and `generate cost`.

English is primary; [Brazilian Portuguese](locales/pt-BR/higgsfield-setup.md) is a secondary translation. See the [language policy](localization.md).
