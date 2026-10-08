# Identity and media quality

The objective is a recognizable character with an individual presence and behavior. Quality does not mean textureless skin or perfect symmetry: it means consistency with canon, intentional naturalism, and freedom from defects that interrupt the experience.

## Approval rule

Every generated file starts as `draft`. Valid metadata, high resolution, calculated similarity, or a correct prompt do not demonstrate identity fidelity. Approval requires a person inspecting real media and recording the result. Codex can identify defects and organize evidence; it must not present automatic validation as proof that the character was preserved.

| State | Meaning | Required evidence |
| --- | --- | --- |
| `draft` | Exploration or an asset not yet approved. | An available file and identified provenance. |
| `canon-approved` | Persona state whose identity has been chosen and recorded. | Reference inspection and explicit approval by the person responsible for the character. |
| `production` | An asset approved for the use specified in its brief. | Visual inspection; listening when audio is present; continuity review for video; recorded decision. |

`production` does not mean published. Changing the face, body, voice, or essential characteristics requires a new canon review. Subsequent changes to an approved file return that version to `draft`.

In the persona record, each reference uses `candidate`, `approved`, or `rejected`; the approved set supports the persona's `canon-approved` state. In the manifest, assets use `draft`, `production`, or `rejected`.

## Review an image

1. Open the result alongside approved references. First compare a reference with a similar angle and expression; use the others to resolve uncertainty. Do not judge identity solely by hair color or wardrobe.
2. Examine the entire composition to check proportions, pose, scale, perspective, and relationship to the scene.
3. Inspect the face, hands, and details at original resolution. Then check the media at the size and crop the audience will see.
4. Decide `approve`, `correct`, or `reject`. Record concrete defects and affected regions. If references are insufficient, record `pending` and retain `draft`.

| Area | What to check |
| --- | --- |
| Facial identity | Skull and face shape, eye spacing, eyebrows, nose, jaw, chin, ears, and distinctive marks. Expression and perspective can change appearance; structure must remain compatible. |
| Body and proportions | Limb length, relative head size, shoulders, neck, posture, and approved body characteristics. Avoid unintended changes to apparent age or build. |
| Naturalism | Skin texture, pores, strands of hair, gentle asymmetries, and plausible light transitions. Preserve the character's actual traits; do not invent new imperfections in every image. |
| Eyes and mouth | Gaze direction, pupils, eyelids, lip alignment, tongue and tooth continuity. Smiles need plausible anatomy without fused, duplicated, or excessively bright teeth. |
| Hands and contact | Finger count and connection, nails, joints, grip, and object contact. Check places where hands are hidden or partially visible. |
| Scene and optics | Shadows, reflections in mirrors and glasses, geometry, depth, blur, and light sources. A reflection must match the person, pose, and scene. |
| Clothing and objects | Seams, patterns, jewelry, accessories, text, and logos. Check distortions and elements appearing or disappearing. |
| Final framing | Crops, safe margins, legibility, focus, and channel fit. An intact image can fail after cropping. |

## Review video and voice

Watch the complete file with audio at normal speed. Revisit suspicious segments, including frames near the beginning and end. A selection of frames does not replace temporal review.

- **Identity and continuity:** face, hair, body, clothing, and accessories must remain stable as the person turns their head, blinks, smiles, or becomes partially occluded. Look for identity drift, merging, and apparent age changes.
- **Motion:** gestures need intention, anatomy, and plausible inertia. Check the neck, shoulders, fingers, walking, object contact, and camera motion.
- **Scene over time:** check skin/light flicker, rebuilding backgrounds, inconsistent reflections, jumping objects, and joins between shots. Camera movement requires additional attention to edges and parallax.
- **Lip-sync:** compare audible speech with mouth opening/closing, pauses, and expressions. Inspect teeth and tongue during speech. Do not accept perceptible delay or mouth movements when audio is silent.
- **Voice:** listen for vocal identity, pronunciation, approved accent, rhythm, emotion, breathing, and continuity between takes. Look for substituted words, truncated syllables, noise, clipping, and timbre changes. A correct caption does not prove the speech is correct.
- **Final delivery:** also watch the edited, exported version with music and captions. Check synchronization, speech comprehension, cuts, and duration on the target device.

If Codex or the available tool cannot access audio or motion, record that limitation and leave the corresponding approval pending.

## Critical failures

Any item below rejects the asset, even if other dimensions are good or a numerical average is high:

- The person looks like another character, or face, body, and voice diverge from canon.
- Impossible anatomy, an incompatible reflection, or a visible deformation remains in final use.
- Identity or anatomy changes during the video.
- Speech changes the script's meaning, becomes incomprehensible, or has noticeably incorrect lip-sync.
- Media relies on a reference, authorization, or usage right that is still unconfirmed.

Composition, expression, wardrobe, duration, or text issues can justify correction without discarding the approach. Describe the correction and keep the asset `draft` until the new version is reviewed. Do not use an overall score to dilute a critical failure.

## Minimum review record

Record alongside the asset: exact version/file, canon version, intended use and crop, reviewer, date, review method, decision, and identified problems. For video, identify affected segments; for images, regions. Also record items that could not be checked. Canon approval and identity changes belong to the person responsible for the character.

Example: "`take-03-v2.mp4`, canon 1, vertical Reel; complete review with audio by [reviewer], [date]; correct: the necklace disappears at 00:04 and the final word is cut off; remains a draft."

## Correct without losing identity

Make the smallest necessary change. Prefer correcting the setting, framing, or a local detail while preserving approved references. Change one variable per attempt and compare versions. After a repair, also inspect neighboring regions and the entire media: correcting a hand can alter the face; improving lip-sync can introduce defective teeth. Preserve the original and never replace a canon reference with an unapproved result.

Canonical review methods are `visual`, `listening`, and `visual-and-audio`. Legacy Portuguese tokens remain supported for historical records without rewriting prior files or approvals. See the [language policy](localization.md) and [Brazilian Portuguese translation](locales/pt-BR/quality.md).
