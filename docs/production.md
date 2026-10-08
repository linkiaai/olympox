# OLYMPOX influencer production

This workflow prepares original, repeatable characters before producing campaigns. Start with a few strong assets, approve identity, and only then increase volume. Provider selection follows the brief and a controlled test; availability, limits, and costs must be checked at the time of use.

## 1. Define the character

Before generating media, resolve the proposition: name, audience, topic, personality, values, language, speaking style, and reason to follow this influencer. Establish explicit adult age and create an original identity. Visual references guide aesthetics; using a real person's face or voice requires appropriate authorization.

Separate three layers:

| Layer | Definition | Examples |
| --- | --- | --- |
| Identity anchors | Traits that must remain recognizable. | Facial structure, body proportions, apparent age, distinctive marks, and vocal signature. |
| Style rules | Coherent ranges of expression and presentation. | Palette, language, energy, makeup, wardrobe, and lighting treatment. |
| Content variations | Elements that can change per piece. | Setting, permitted hairstyle, clothing, pose, topic, camera, and emotion. |

Variable details must not become the only way to recognize the person. A character needs to remain identifiable in different clothes and lighting.

## 2. Build the reference pack

Explore candidates in `draft`, select a direction, and produce references to close gaps. Do not assemble images of different candidates as though they were a single identity.

The initial pack should cover:

- Front and three-quarter face views from both sides, with a neutral expression and simple lighting.
- Profile and smile, to check the nose, jaw, ears, and teeth.
- Half-body and full-body views, with natural posture and clothing that allows assessment of proportions.
- A different lighting condition and expression, to test recognition beyond the main portrait.
- If voice is included: an approved spoken sample with a neutral sentence, a question, and moderate emotion, accompanied by the language, accent, rhythm, and timbre description.

These framings are an initial proposal, not a quality guarantee. Use only the set needed for the character and production medium. Invisible or uninspected material cannot be an approved reference.

Each reference needs an exact file, framing description, origin, and observations. Choose a main reference and coherent complementary references. Preserve original files and the pack version. Naming an image "official" does not approve it: review it using the [quality guide](quality.md) and obtain approval from the responsible person before marking `canon-approved`.

## 3. Test consistency before batches

After pack approval, make a small pilot covering real content situations: close-up, smile, half-body, full-body, and a different setting. For video, include short speech, a moderate head turn, and a simple gesture. If the first campaign does not use some of these elements, adapt the pilot to actual needs.

Compare every result with canon without adding failures to the pack itself. If the method works only at one angle or depends on hiding the face, resolve that before promising recurring production. Approve individual assets; do not approve the whole method based on a single good take.

## 4. Write a brief for each piece

Every brief needs an objective, channel, audience, format, main message, desired action, and identity reference. Include what actually guides production:

- **Photography:** setting, framing, lens or desired perspective, light direction, pose, gaze, expression, wardrobe, and mandatory elements.
- **Video:** spoken script, target duration, shot sequence, movements, gestures, pacing, voice, and audio composition. Short sentences and one main movement per take simplify diagnosis and editing.
- **Delivery:** intended aspect ratio, crop, resolution, and duration; caption or text; placement of elements that need to survive channel cropping.
- **Constraints:** anchors to preserve, authorized variations, and required rights.

Naturalism needs direction: textured skin, plausible hair, coherent light, and human gestures. Expressions such as "perfect," "hyper-beautiful," or "8K" do not replace these decisions and can push the result toward an artificial appearance.

## 5. Produce and record

Integrated Codex image generation remains the default when available unless the user chooses Higgsfield or another provider. Higgsfield can use its optional [Codex plugin](higgsfield-plugin.md) or the [local CLI and wrapper](higgsfield-setup.md). The plugin route requires no local Higgsfield CLI; check its actual tools, account access, reference inputs, costs, and output retrieval separately. Plugin availability does not establish voice, Soul ID, export, or equivalent CLI billing. Both routes retain the same canon, authorization, and review requirements.

Use approved references and record the tool/model when available, canon version, prompt, relevant parameters, and input/output files. Record a seed only if the tool exposes one; it helps traceability but does not guarantee the same identity across tools, versions, or settings.

Persist submission intent in the run before calling an external tool, then record returned job IDs, status, known cost, and retrievable output files. Use actual tool evidence for the selected route; a plugin call does not create a local OLYMPOX record automatically. Query and reconcile uncertain results before another submission. Preserve the exact generation context through the execution seal and bind review to the final files and hashes. Missing output retrieval or inspection keeps the corresponding stage pending.

A local Windows canon path does not establish that a plugin tool can read or attach it. Verify the supported attachment/upload route and record the references actually submitted. A remote URL or gallery remains a provider result until the final bytes are saved locally and inspected; follow the [plugin guide](higgsfield-plugin.md) for this handoff.

Generate a candidate, review, and adjust. When testing a hypothesis, change one main variable at a time. Produce batches only after finding a configuration that works in the pilot. Define an attempt and cost limit for each piece before using paid services; if the limit is reached, stop and review the brief or method.

Keep source files, working versions, and exports separate and identifiable. Also retain rejected attempts when they help diagnose a failure; never mix rejected results into the approved pack.

## 6. Approve and export

Follow the [quality guide](quality.md), including temporal review and listening for videos. A local correction does not waive review of the whole result. Review the final export again after editing, compression, music, captions, or cropping.

Moving to `production` requires an inspected final file and a recorded decision. Preparing a file for publication is a separate stage from publishing: the state does not authorize posting, scheduling, or sending to third parties.

## Operating multiple characters

Keep identity, pack, briefs, scripts, versions, and reviews separate for each character. Each task must declare the character and canon version before selecting references. Share only generic resources such as export presets and brief templates; do not reuse another influencer's faces, voices, or distinctive marks without checking.

A campaign can have shared style without unintentionally bringing identities closer together. When two people appear in one shot, review each and their interaction: scale, contact, gaze direction, and continuity.

## Recommended first cycle

1. Choose a character and resolve positioning and anchors.
2. Produce and review the minimum pack; approve canon.
3. Test an image and, when part of the plan, a short video with voice.
4. Correct actual observed problems and approve final assets.
5. Document the method that worked and start the next piece or character.

This cycle makes clear what was approved, what still needs inspection, and which production conditions were actually exercised. Expand the process according to verified needs without turning hypotheses into quality guarantees.
