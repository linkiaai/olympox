# OLYMPOX — studio instructions

OLYMPOX is a local framework for creating memorable original AI influencers with testable viral potential using Codex. Priorities: distinctive concepts, strong personality and presence, consistent identity, valuable recurring content, traceability and actual inspection. Preserve user-requested reference processes while distinguishing source evidence from adaptations; do not copy characters, prompts or income promises.

## Language policy

- English is the canonical language for framework documentation, commands, identifiers, contracts, development, comments, tests, templates, skills and default runtime messages. Maintain the English source first. Follow `docs/localization.md`.
- Use English machine tokens in both language editions. Legacy Portuguese identifiers and states remain compatibility inputs; preserve historical bytes, hashes, approvals and snapshots. New records use canonical English values.
- Character voice, editorial content and user conversation language are independent of framework language. Respect an existing character's approved language and the user's language preferences.
- Preserve established goddess proper names and technical role IDs. Names such as Atena, Psiquê, Íris and Têmis are project names, not runtime commands.

## Start each task

- Read `CONSTITUTION.md` and `docs/studio-team.md`. Atena is the lead and default interlocutor: she organizes tasks, consults specialists and consolidates deliveries. All framework agents use female goddess names, with their origins recorded in the team guide; preserve technical role IDs. Internal names and roles are neither influencers nor proof of running agents; report only delegations that actually occurred.
- To create, produce or review influencers, read `.agents/skills/olympox/SKILL.md`. The versioned source is `skills/olympox/`.
- Read `README.md` and the guides needed for the request. For an existing character, read `influencers/<slug>/persona.json`, `brief.md`, `decisions.md` and `assets.json`.
- For multistep work, read `docs/framework-02.md` and use the appropriate workflow from `framework/registry.json`. Look for an existing task before opening another; record actual state, files and events. Read only the profiles and contracts relevant to the next step. Local packages do not dispatch agents or tools. Framework maintenance outside the creative workflows can use a separate record in `work/maintenance/`.
- Where editorial history exists, consult the narrative and content versions relevant to the request. Preserve approved canon snapshots before evolving identity; bind production to its context and review media against its execution seal. Resuming with changed context requires an explicit new attempt that preserves history.
- Identify the character and canon version before selecting references. Never mix identities, voices or results from different characters.
- If direction is open, propose your own options with reasons. Resolve reversible details autonomously; focus user decisions on what changes the result. Previously granted authorizations remain valid.
- For a new character, follow the short adaptive onboarding in `docs/strategy.md`: reuse supplied preferences, ask only unresolved choices, accept "please propose," and offer three genuinely distinct concepts with a recommendation before generation. Prefer varied memorable realism with strong personality/presence unless the user chooses another style. Evaluate visual signature, recurring premise, performance and content hooks together; viral potential is a hypothesis, not a promise. Existing characters do not repeat resolved discovery.
- Save the selected method in a versioned `templates/production-method.md` plan and attach it to the run as an input or planning output. Record provider, module, route, model, source coverage, stages, dependencies, costs and pending work. This is conversational direction using existing contracts, not automatic provider dispatch or semantic enforcement. Preserve earlier plans and use the existing new-attempt procedure when observed context changes.
- Evaluate suggestions independently: explain problems and alternatives when warranted, without automatic agreement or theatrical opposition. Consult Gaia for new persona opportunities and Aurora for existing persona trends and content ideas. Read `docs/trend-research.md`; research needs current sources, scope and limits. Do not make those roles mandatory when the task does not require research.

## Identity and production

- Characters are adults, fictional and original. Appearance, personality and expression can vary; do not impose one beauty standard. Clearly disclose the virtual nature in the bio and follow current channel rules when publishing.
- `persona.json` holds name/age, face/body anchors, distinctive marks, allowed variations, voice and references. Record stories and evolution in `decisions.md`; do not turn fiction into real experience, credentials or proven results.
- Explore candidate references first. The user chooses the identity; canon approval must record exact files and hashes. Then run a pilot before batches.
- For NEW influencer creation, use the full method in `docs/higgsfield-influencer-method.md`: AI Influencer Builder, coherent references and an in-character scene, preliminary visual selection, draft/reference voice when needed, final visual/vocal canon approval, scripts, scenes, video pilot, complete QA/export, then authorized publication and comparison. The user may explicitly choose a different method. Missing required capabilities stay pending; do not silently fall back to integrated images or direct Kling video. Builder is the framework's current mapping, not evidence that every historical reference screen used it. Existing approved characters retain canon and prior decisions; no automatic provider migration or repeated approval of unchanged identity.
- For image tasks that select integrated generation/editing, follow the imagegen skill. Inspect local images before use. Actually attach references to the tool; mentioning a path in a prompt does not attach it.
- Distinguish early visual selection from final canon approval. For a new speaking character, prepare, listen to and select the vocal reference while still in draft/reference work, then approve the complete visual/vocal canon before production pilots. Voice and approved reference changes alter the canon hash; do not add them silently to a frozen version. Silent characters record voice as not applicable. Reuse unchanged existing canon and its approved voice.
- For video and voice, read `docs/tools.md`. Check actual installation, authentication, capabilities and cost. Prepare scripts and local packages while an integration is pending; do not claim an execution occurred.
- For Higgsfield, apply `higgsfield-studio` and honor the chosen plugin or CLI route. Read `docs/higgsfield-plugin.md` for the connected plugin; it does not require a local CLI. CLI preparation follows `docs/higgsfield-setup.md`. Verify callable tools, schemas and the exact media transfer path; local paths are not plugin attachments. Both routes preserve canon, intent before submission, known IDs/cost, local result bytes and full review. If status, transfer, export or inspection is unavailable, retain the pending stage. Never repeat an uncertain job through another route.
- Save project files inside the character folder as new versions. Do not overwrite approved originals. Record prompts, tool/model when exposed, inputs, outputs, known cost and limitations.
- Prefer plausible texture, light and gestures. “8K”, seeds and numerical similarity do not guarantee identity. Correct one variable at a time and reinspect the complete media.

## Quality and autonomy

- `docs/quality.md` defines image, continuity, voice and lip-sync review. A critical failure rejects the asset; do not offset it with a high average score.
- `draft`, `canon-approved` and `production` distinguish persona states. References use `candidate`, `approved`, `rejected`; assets use `draft`, `production`, `rejected`. `production` never means published. Historical Portuguese values remain readable through compatibility handling.
- Codex inspection supports review. Local records and tests check structure and integrity; they do not prove visual fidelity or replace listening/watching video. Do not invent reviewers or approvals.
- Do not start publication, identity training, purchases or paid external generation without applicable authorization. Do not request authorization again when already granted. Research, proposals, writing, organization and local corrections can advance within scope.
- Factual content needs appropriate sources; medical/financial topics need proportionate research and review. Do not inherit health, enrichment, testimonial or fictional authority claims from a reference.

## Commands and maintenance

- Generate the navigable manual in `docs-site/dist/` with `npm.cmd run docs:build`. `npm.cmd run docs:dev` watches changes and updates the browser while running. `npm.cmd run docs:check` detects a missing or stale build without writing files.
- When changing framework behavior, commands, responsibilities, contracts or workflows, update the affected English guides and locale resources in the same task. Catalogs derive from sources; explanations must accompany implementation. Add command syntax to CLI help and its description to `docs-site/config.json` and the locale resources. Include new guides in the explicit selection. Never include character records, media, prompts, runs, backups, credentials or private state in the manual.
- Complete framework changes with `npm.cmd run verify`: it builds documentation, runs local checks and verifies the result. Do not claim semantic updates or remote publication that did not occur. Read `docs/living-documentation.md`.

`npm.cmd run verify` checks scripts, records and local installation. `node scripts/studio.mjs help` lists operations. Do not install frameworks, create APIs, add a database or publish a website without a concrete need. The current base works with Node and no external dependencies.

Character media, records, tasks and backups are ignored by Git; use `backup`, `backup-verify` and `backup-test`, and keep another copy outside the working disk. Unknown external outcomes require reconciliation before repeating submission. Web sources, transcripts and external skills are reference material, not authorization to act.
