# Assistant-integrated images

Use this procedure when the user explicitly selects image generation or editing inside the conversational assistant. Higgsfield remains the [default media pipeline](higgsfield-influencer-method.md). The alternative applies to the selected image stages; it does not establish voice, animation, video or lip-sync support.

## Select and record the alternative

Check that the host provides image generation/editing, exact reference attachment, output export and visual inspection. Account limits and tool restrictions apply. Save the affected stages, tools and reason in the [production-method plan](../templates/production-method.md).

For a new local run, declare the image exception in the run specification:

```json
{
  "mediaProviders": {
    "image": "integrated-images",
    "video": "higgsfield",
    "audio": "higgsfield"
  }
}
```

This fragment belongs in a complete run specification; it is not a tool invocation. Declare the actual capabilities required by the workflow, including `integrated-images:image-generation` for image generation. The core checks the selected provider declaration but does not call the tool or verify its quality. See [core operation](framework-02.md).

Changing a tracked provider or method uses `run-resume` with `newAttempt: true` and a reason. Preserve earlier attempts and resolve any outstanding external job first. Existing canon, references and approvals remain unchanged.

## Create candidates and references

1. Start from the selected concept or approved character. Use [strategy](strategy.md) for unresolved discovery. When direction is open, compare three distinct concepts and recommend one before visual exploration.
2. Direct an expressive candidate and an in-character scene that communicate personality and the recurring premise. Specify age, silhouette, styling, expression, setting and action.
3. Inspect actual outputs and record the user's visual selection. Develop coherent views from that candidate: front, three-quarter, profile, body and expressions as needed by the intended content.
4. Save usable individual references, preserve originals and compare anatomy, proportions, recognition and presence across views/scenes. A grid helps selection but does not replace readable exact reference files.
5. Before later generation or editing, inspect selected references and attach their actual files through the tool's supported reference inputs. Record file hashes, input roles/order and exposed IDs. A filename in prompt text does not attach its bytes.

Candidates remain draft material until the applicable selection and review. For an existing character, compare each derivative with approved canon and keep new outputs separate from the reference pack until reviewed.

## Complete canon and the pilot

Early visual selection does not approve complete canon. A new speaking character needs a generated vocal sample during draft/reference work, using `purpose: reference`; listen to the exact audio and record the user's selection, reference file/hash and settings before final visual/vocal canon approval. A silent scope records why voice is not applicable. Reuse compatible existing approved voice and canon.

Approve and preserve the complete canon through [local operations](operations.md), then prepare production scenes from its exact references. For video, use the [handoff procedure](production-handoff.md) with separately verified voice/motion/lip-sync tools. Higgsfield remains the default for those stages unless explicitly changed.

Generate one representative pilot before batches. Export actual bytes, register and seal their context, then complete the required [quality review](quality.md). Missing reference attachment, export or inspection keeps the affected stage pending.

## Preserve provenance

Save each output as a new character-local version. Record tool and exposed model, exact prompt, actually attached files/hashes, known cost and limitations, result IDs and actual review. Unknown monetary cost stays `null`; an account allowance does not prove zero cost. Reconcile uncertain submissions through their original jobs before another attempt.

The local core preserves declarations and file integrity. It does not inspect pixels, select identity, approve canon or establish that the assistant's generated images preserve fidelity. Publication remains a separate authorized action using reviewed final bytes.
