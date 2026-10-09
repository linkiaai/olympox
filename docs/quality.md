# Identity and media quality

Use this guide to evaluate actual candidates, references and finished media against the chosen concept, exact canon and intended use. Têmis records the assessment; Atena routes corrections and user decisions. Successful generation, hashes, resolution and valid records establish neither fidelity nor approval.

## Separate selection, inspection and asset state

| Record | States and meaning |
| --- | --- |
| Persona | `draft` during discovery; `canon-approved` after the explicit identity decision |
| Reference | `candidate`, `approved` or `rejected`; exact selected files support canon |
| Manifest asset | `draft` before approval, `production` for reviewed approved use, or `rejected` |
| Review decision | `approve`, `correct`, `reject` or `pending`, tied to exact files and scope |

`production` does not mean published. The user selects identity and approves complete canon; inspection supplies evidence for that decision. Record the actual reviewer and method without inventing human inspection or specialist consensus. New edits create a new version for review; preserve prior files, decisions and snapshots.

## Check concept and references before canon

Read the selected concept and compare the actual files with its concrete criteria. For open direction, [strategy](strategy.md) requires at least three distinct concept proposals before portraits. Review candidates for the direction the user selected, without adding identity traits to satisfy a new preference.

| Check | Evidence needed |
| --- | --- |
| Concept and presence | A neutral identity view plus an expressive scene or target-size cover; posture, expression, styling and behavior should communicate the chosen premise |
| Anatomy and identity | Readable reference angles and relevant body views; plausible proportions and recognition across scenes, beyond one accessory |
| Originality | An original adult character rather than reproduction of an identifiable person's face, voice or biography |
| Creative voice | Sample lines and series with a recognizable perspective, concrete opening and fulfilled payoff |
| Reference continuity | Exact user-selected files/hashes and evidence those references were actually attached to later calls |
| Method completion | Saved [method plan](../templates/production-method.md), verified selected stages, real output files, known costs or authorized uncertainty, and unresolved limitations |

An intentionally restrained concept can pass if its specific presence is visible. A clean neutral portrait alone does not establish the premise, and a memorable concept does not prove viral potential. For existing characters, assess allowed variation against approved canon; new creative criteria do not revoke historical approval or authorize a replacement identity.

For a speaking character, keep the persona `draft` through visual selection and vocal exploration. Generate a draft/reference vocal sample, listen to the exact audio, and record the user's selected file/settings before complete visual/vocal canon approval. For a silent scope, record voice as not applicable. Create the approved snapshot through [operations](operations.md); never add new voice settings to a frozen version or replace a canon reference with an unapproved output.

Higgsfield is the default media pipeline. Verify the modules chosen in the reference-method plan; a separate Builder capability is required only when the plan actually selects it. Assistant-integrated images need an explicit alternative choice. A missing required stage stays pending; later video output or a prepared specification does not complete it.

## Inspect images at two scales

Open the actual result alongside exact references. Compare similar angles/expressions first, inspect the whole composition and critical details at original resolution, then check the audience's intended crop/size.

| Area | Practical checks |
| --- | --- |
| Face and body | Face structure, eye spacing, nose, jaw, ears, distinctive marks, apparent age, body proportions and approved characteristics |
| Eyes and mouth | Gaze, pupils, eyelids, lip alignment, teeth and tongue; plausible expressions without fused or duplicated features |
| Hands and contact | Connected fingers, joints, grip, contact with objects and partly hidden anatomy |
| Scene and light | Perspective, shadows, reflections, scale and light sources consistent with pose and surroundings |
| Style and objects | Chosen rendering rules, skin/hair detail when naturalistic, seams, patterns, accessories, logos and text |
| Final framing | Crop, safe margins, legibility, focus and channel fit |

Preserve intentional asymmetry and selected stylistic rules. Do not replace the character's traits with a generic beauty standard or invent new imperfections in every image. Identify defective regions concretely instead of reporting only “looks wrong.”

## Listen to audio and review complete video

Listen to the exact vocal file. For video, watch the entire file with audio at normal speed, then revisit suspicious timestamps and shot joins. Still frames support investigation but do not replace motion review. Check the edited export again after music, captions or cuts are applied.

| Area | Practical checks |
| --- | --- |
| Vocal identity | Approved timbre, accent, pronunciation, rhythm, emotion and continuity between takes |
| Speech | Exact meaning, complete words, intelligibility, breathing, noise and clipping; captions do not prove spoken accuracy |
| Identity in motion | Face/body stability through turns, expressions and occlusion; stable hair, clothes and accessories |
| Motion and scene | Plausible anatomy, gestures, object contact, inertia, camera movement, reflections, flicker and backgrounds over time |
| Lip-sync | Audible words, mouth movement, pauses, teeth/tongue and expressions stay aligned |
| Edited delivery | Comprehensible speech with music, synchronized captions, coherent cuts, intended duration and final framing |
| Performance | Opening/payoff and acting deliver the piece's premise and selected attitude |

A short pilot in the intended medium is reviewed and exported before batches. An approved still image covers only its scoped visual use; it does not approve motion, speech or lip-sync. If audio or video cannot be accessed, leave that review pending and identify the needed inspection.

## Decide and route the result

| Decision | When to use it | Next step |
| --- | --- | --- |
| `approve` | Applicable checks completed with no critical defect or pending limitation | Deliver the exact reviewed bytes for the stated use |
| `correct` | The direction remains useful but a concrete repair is needed | Save a new version and repeat affected checks plus whole-file review |
| `reject` | Wrong identity, impossible anatomy, severe continuity failure or unusable speech/lip-sync defeats the result | Preserve the attempt and prepare another approach within canon |
| `pending` | Missing references, inspection access, authorization or usage evidence prevents a decision | Identify the exact missing input/check and responsible next step |

Critical failures prevent approval regardless of an average score: identity drift, impossible anatomy or reflections, temporal deformation, speech changing the intended meaning, incomprehensible audio, or perceptibly wrong lip-sync. Known unsuitable usage rights prevent delivery; uncertain rights or reference permission remain pending. Composition, wardrobe, expression or timing can warrant correction when identity remains intact.

Make the smallest useful repair and compare versions. Check neighboring regions and the whole result afterward: a hand correction may change the face; a lip-sync repair may damage teeth. Never resolve a failure by rewriting approved canon or historical evidence.

## Record a review someone can act on

Save the exact file/version and SHA-256, canon version/hash, intended use/crop, reviewer, date, inspection method, decision, concrete regions/timestamps and unresolved checks. Methods are `visual`, `listening` and `visual-and-audio`; historical records retain their original bytes.

> `pilot-v002.mp4`, [file hash], canon 1 [canon hash], vertical video; complete motion/audio review by [actual reviewer], [date], `visual-and-audio`; `correct`: necklace disappears at 00:04 and final word is clipped. New version required before approval.

The local contracts check structured declarations and file integrity. They cannot prove that viewing/listening occurred, that a reviewer is human or that a creative process succeeded. Follow [production](production.md) for sealed context and actual exports; use the applicable user authorization and record real evidence separately for publication.
