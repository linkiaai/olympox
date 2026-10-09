# Studio team

OLYMPOX organizes work through Atena and eight specialist profiles. Use this guide to choose the responsibility a request needs and understand the expected handoff. The profiles and [task contracts](../framework/README.md) are instructions for the coordinating assistant, Codex or Claude Code. A profile does not start a worker; report delegation only when a real subagent ran.

## Choose a responsibility

| Name | Role ID | Use for | Expected output |
| --- | --- | --- | --- |
| Atena | `master` | Coordinate a request and its decisions | Objective, task sequence, consolidated delivery and next step |
| Gaia | `opportunity-research` | Find an audience or editorial opportunity for a new character | Sourced opportunities, comparison and recommendation |
| Psiquê | `persona` | Develop positioning, personality and narrative | Distinct concept proposals, brief and coherent persona/narrative |
| Íris | `art` | Define visual identity and direct scenes | Visual anchors, candidate/reference plan and scene specifications |
| Aurora | `content-trends` | Adapt current signals to an existing character | Sourced content ideas, openings, scenes and audio dependencies |
| Saraswati | `content` | Write content with the character's voice | Versioned scripts, dialogue, captions and factual sources |
| Selene | `production` | Prepare and execute audiovisual work | Verified capabilities, generation records and actual exported files |
| Têmis | `qa` | Inspect identity, continuity and final media | Assessment of exact files, defects, decision and pending checks |
| Fortuna | `growth` | Plan distribution and learn from results | Experiment plan, metric definitions and evidence-based recommendations |

The names are internal project names, separate from influencer IDs and public identities. Their origins follow the framework's goddess naming convention: [Atena](https://www.getty.edu/cona/CONAIconographyRecord.aspx?iconid=901000069), [Gaia](https://www.britishmuseum.org/collection/term/BIOG58378), [Íris](https://www.britishmuseum.org/collection/term/BIOG58866), [Selene](https://www.classics.cam.ac.uk/files/seleneinstructions2.pdf) and [Têmis](https://www.perseus.tufts.edu/hopper/text?doc=Perseus%3Atext%3A1999.01.0134%3Abook%3D15%3Acard%3D78) draw on Greek traditions; Psiquê on the Greco-Roman story of Psyche; [Aurora](https://www.metmuseum.org/art/collection/search/252525) and [Fortuna](https://www.britishmuseum.org/learn/schools/ages-7-11/ancient-rome/gods-and-goddesses-roman-britain) on Roman traditions; [Saraswati](https://www.metmuseum.org/art/collection/search/74840) on Hindu tradition. The association with each responsibility is a symbolic project choice.

## Responsibilities and handoffs

### Atena

Speak normally or address Atena directly:

> Atena, help me develop an original character for this audience. Compare three directions and recommend one.

Atena reads the request, existing decisions, character state and available tools. She chooses the necessary responsibilities, resolves reversible details, tracks pending work and consolidates results. She can complete simple work directly or delegate independent tasks when actual subagent tools are available. She preserves material disagreements and explains the decision they affect.

Direction and identity selection remain with the user. Atena records applicable authorizations for spending, training and publication; she does not infer them from concept or canon approval. All work follows the [constitution](../CONSTITUTION.md).

### Gaia

Gaia receives the market/language, audience question, existing portfolio and production constraints. She compares sourced signals, contrary evidence, differentiation and feasibility. The handoff is up to three opportunities with a recommendation and gaps, using [opportunity research](trend-research.md). Improving an existing character or finding insufficient evidence are valid conclusions.

### Psiquê

Psiquê receives the selected direction, brief and research. She develops an original adult character with an audience, premise, desire, values, behavior and editorial voice. When direction is open, she proposes at least three genuinely distinct concepts before portraits. She separates fiction, assumptions and real facts, and keeps narrative versions distinct from visual/vocal canon. See [strategy](strategy.md).

### Íris

Íris receives the selected concept, approved canon when present and inspected references. She defines recognizable anchors, permitted variations and scene direction. For a new character, the output includes expressive candidates, a neutral reference view and a scene expressing the premise. The user selects the visual identity; coherent reference views are developed from that selection and actually attached to later generation calls.

Íris and Têmis check anatomy, presence and continuity across angles and scenes. A speaking character also needs a generated, listened-to and selected vocal reference before complete canon approval. Existing identities remain within their approved variations.

### Aurora

Aurora receives the character, narrative, audience, channel/region, recent content and available results. She delivers original adaptations of current topics, formats or audio with dated sources, a concrete opening/payoff, scene sequence, fit and dependencies. She can recommend passing on a trend. See [research](trend-research.md).

### Saraswati

Saraswati receives the brief, exact canon/narrative versions and selected idea. She writes scripts, dialogue, captions and series with a recognizable voice and sources for real-world claims. A piece marked `ready-for-production` has completed editorial preparation; it still needs generated media, inspection and any publication authorization. She preserves identity and narrative when adapting a topic.

### Selene

Selene receives scripts, scene specifications, exact reference files and the approved execution scope. Higgsfield is the default media pipeline; assistant-integrated images require an explicit alternative choice. She verifies each selected module, supported inputs, reference transfer, whole-pilot budget, export and inspection access before submission. Missing capabilities leave the affected stage pending. Follow [production](production.md) and the [method plan](../templates/production-method.md).

She records method, tool/module, model when exposed, prompts, actual attachments, files/hashes, known cost and limitations. External intent is recorded before submission; uncertain jobs require real querying and reconciliation before another charge. Generated media is exported as actual bytes and passed to review. A pilot precedes batches.

### Têmis

Têmis receives the complete files, exact references, script, sealed execution context and intended use. She inspects images visually, listens to audio and reviews complete video motion/audio when applicable. Her handoff identifies regions or timestamps, evidence and an `approve`, `correct`, `reject` or `pending` decision. Inaccessible media or critical failures prevent approval. See [quality](quality.md).

### Fortuna

Fortuna receives strategy, actual publication records, available platform data and production costs. She defines hypotheses, comparable windows, raw counts and denominators, then recommends repeating, adjusting or ending an experiment. Data must be supplied or collected through a real tool; the framework installs no analytics integration. Offers and partnerships need evidence of actual value. Publishing, advertising and purchases use their applicable authorization.

## Keep contributions traceable

A useful handoff identifies the objective, character ID when applicable, canon/narrative versions, exact input/output paths and hashes, acceptance criterion, actual work performed and unresolved limitations. Store private creative records in the installed studio; reusable profiles belong to the framework.

The local core saves runs and attempts in `work/runs`, records task owners and identifies the next step. It does not automatically dispatch specialists, generate, query external jobs or publish. Missing tools and uncertain submissions remain explicit pending states. Changed inputs, canon or governance use the existing new-attempt procedure without rewriting history. See [core operation](framework-02.md) and [preservation](operations.md).
