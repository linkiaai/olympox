# Optional local Higgsfield CLI

Use this guide to prepare the CLI route in an installed studio. A connected [plugin](higgsfield-plugin.md) can execute supported stages without it; the CLI can provide separately verified operations and local-file transfer. Framework installation includes the wrapper and provider provenance, but does not install the CLI or connect an account.

## Supported wrapper baseline

`scripts/higgsfield-local.mjs` expects `@higgsfield/cli` **1.1.26** in `tools/higgsfield`, on **Windows x64**. It verifies package/version and the executable SHA-256 before native execution. The baseline package, installer and binary hashes are recorded in `vendor/higgsfield-skills/provenance.json`.

| Wrapper command | Behavior |
| --- | --- |
| `doctor` | Check package/version and executable integrity locally |
| `version` | Run the pinned executable's version command |
| `help [command [subcommand]]` | Show wrapper help or an accepted native help topic |
| `login` | Start interactive account login |
| `inspect` | Run allowed account/workspace/model/workflow/voice/job queries and scalar-only estimates |

The wrapper does not install/update, submit generation, upload files, train identity, publish or print tokens. A valid local binary does not establish account access or audiovisual capability. Other operating systems or CLI versions require deliberate inspection and wrapper adaptation.

## Prepare the pinned package

Run from the installed studio root. Keep this optional dependency in `tools/higgsfield`, outside the studio's main package manifest.

```powershell
New-Item -ItemType Directory -Path tools/higgsfield -Force
npm.cmd view @higgsfield/cli@1.1.26 version bin scripts repository dist --json
npm.cmd pack @higgsfield/cli@1.1.26 --ignore-scripts --pack-destination tools/higgsfield
```

Inspect the package and installer against the preserved provenance. The inspected installer obtains the official platform archive, verifies its expected hash and writes the executable inside the package. After that inspection:

```powershell
npm.cmd install --prefix tools/higgsfield --save-exact @higgsfield/cli@1.1.26 --ignore-scripts --no-audit --no-fund
```

Before running the installed `install.js`, compare its SHA-256 with `cli.installerSha256` in `vendor/higgsfield-skills/provenance.json`. This baseline's expected value is `67aa95c60484400e813099affce5a65d374de50ba7efbe2780a4ae9184062261`:

```powershell
Get-FileHash tools/higgsfield/node_modules/@higgsfield/cli/install.js -Algorithm SHA256
node tools/higgsfield/node_modules/@higgsfield/cli/install.js
node scripts/higgsfield-local.mjs doctor
node scripts/higgsfield-local.mjs version
node scripts/higgsfield-local.mjs help
```

`doctor`, `version` and help do not require login. Keep binaries and account state outside Git and the framework export. Review a new package/archive/binary before changing the pin; installing a newer package alone will not make this wrapper accept it.

## Connect and inspect

When connection is authorized, run login in an interactive terminal. The user completes the provider's browser flow; keep credentials outside the studio and its backups.

```powershell
node scripts/higgsfield-local.mjs login
node scripts/higgsfield-local.mjs inspect account status
node scripts/higgsfield-local.mjs inspect workspace status
node scripts/higgsfield-local.mjs inspect model list --json
node scripts/higgsfield-local.mjs inspect workflow list --json
node scripts/higgsfield-local.mjs inspect voices list --json
```

Confirm the intended account/workspace, balance and required capabilities. Use an actual returned model ID to inspect its schema with `inspect model get <model-id> --json`; the placeholder is not a model name. Read help for the selected operation before setting parameters. Store only necessary account evidence locally, without credentials.

## Estimates and billing

Inspect `help generate cost` and the current model schema. Native estimates with media inputs can upload those files even when no generation job is created. The preparation wrapper rejects media flags, file reads, URLs and unsupported estimate flags; it permits simple scalar parameters only.

An estimate without required media can fail or differ from the final request. Keep that limitation explicit. Reference-bearing estimates require applicable transfer authorization and the native CLI's supported inputs. A path inside ordinary prompt text remains text.

Check billing for this route rather than assuming website, API or plugin allowances apply. Save stage quotes with their units and source, available balance, total pilot/attempt limits and unknown charges. The wrapper does not impose a service spending cap. Keep credits separate from monetary asset `cost`, which stays `null` when unknown.

## Transfer local files for plugin use

Check the current native upload help and confirm both routes use the intended account/workspace:

```powershell
node scripts/higgsfield-local.mjs help upload create
```

With the exact file/hash and applicable upload authorization, use the pinned native executable's `upload create <local-file> --json`. This is an external media transfer; the preparation wrapper does not expose it as an `inspect` operation.

Record source path, SHA-256/size, upload response and returned media ID/URL. Verify its availability through the plugin's actual library/read tools before use. Compare downloadable original bytes where supported; document transformations or unavailable byte verification and inspect fidelity. Use confirmed mapped inputs in their accepted roles. The framework supplies this procedure, not an automatic bridge or proof of cross-route access in every account.

## Authorized production later

Prepare approved canon, script and inspected scene/audio inputs following the [production method](higgsfield-influencer-method.md) and [video handoff](production-handoff.md). Before a paid submission, verify actual schemas, transfer, export/review support, price/budget and applicable authorization, then persist external intent in the local run.

Production uses the pinned native executable with separate arguments or a reviewed parameter file. On this baseline its path is:

```text
tools/higgsfield/node_modules/@higgsfield/cli/vendor/hf.exe
```

Use its current help and verified inputs for generation, upload or optional training. The wrapper's help topics do not mean its `inspect` route permits submissions.

Preserve returned job IDs and inspect the original jobs through allowed queries:

```powershell
node scripts/higgsfield-local.mjs inspect generate list --json
node scripts/higgsfield-local.mjs inspect generate get <job-id> --json
```

Replace `<job-id>` with a real accepted identifier. Reconcile uncertain outcomes before another attempt; switching to the plugin does not resolve a CLI job. Save actual outputs as new local versions, register/seal their provenance and complete [quality review](quality.md) before delivery. Optional identity training has its own justification and authorization.

## Source references

- [Official CLI baseline source](https://github.com/higgsfield-ai/cli/blob/v1.1.26/README.md).
- [Preserved vendor skill revision](https://github.com/higgsfield-ai/skills/tree/f83af0bc1d937c8119099a11f8ebbf5e6fb99819).
- [Local provider source inventory and license](../vendor/higgsfield-skills/README.md).

The source baseline is reproducible preparation evidence. Current accounts, schemas, prices and successful production must be checked in the studio.
