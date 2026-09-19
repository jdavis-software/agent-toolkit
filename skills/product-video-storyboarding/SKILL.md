---
name: product-video-storyboarding
description: "Plan a product video as a timed shot, asset, claim and caption contract before authorizing generation, composition or publication."
metadata:
  version: "0.1.0"
---
# Product Video Storyboarding

Original project-agnostic procedure. Agent-host effectiveness remains experimental.

## When to use

Plan a product video as a timed shot, asset, claim and caption contract before authorizing generation, composition or publication.

## When not to use

Do not impose this workflow on unrelated edits. It does not authorize installation, model calls, paid services, credential access, production changes or publication. Use the consuming environment's approved tools and authority.

## Inputs

Resolve the task, source revision, desired artifact, approved scope, evidence, actual tool versions and output constraints. Private paths, accounts, brand kits and provider bindings stay in the consuming project, not in the public skill.

## Procedure

### 1. Define the audience and message

Agree the audience, intended action, platform, duration and aspect-ratio variants. Name the claims the viewer should retain. Separate the product currently available from a roadmap, concept or staged prototype. Approval to plan is not approval to generate paid media or publish.

### 2. Inventory claims and assets

Collect approved product captures, identities, voice/music rights and brand requirements. Link feature claims to evidence of their actual status. List missing assets instead of substituting unrelated stock or invented customer endorsements. Reference credentials only inside the private execution adapter.

### 3. Create a frame-based shot plan

Choose a frame rate and total frames; define an ordered primary timeline with explicit start/end frames. Specify the purpose, focal content, assets, product claims and transition intent for every shot. Keep narration, captions and overlays separately timed. Do not let a strong transition hide an unreadable interface.

### 4. Review production and access boundaries

Resolve who can supply each asset and which provider/compositor is approved. Keep generation separate from composition and FFmpeg post-processing. Preview for crop, safe area, text readability and motion alternatives. Planned features must remain labeled as planned in the actual shot, not only in a private note.

### 5. Qualify the handoff before rendering

Check timeline continuity, available asset references, explicit rights review, claim status and caption bounds. Emit a missing/uncertain-items list. A valid manifest cannot prove consent or rights, and does not authorize a render. Verify exported media and its claims again after any generation or edit.

## Output

A bounded, source-linked artifact and review record: input identity, decisions, actual checks, findings, unresolved assumptions and the next authorized action. Separate mechanical checks from semantic review, runtime observations and independent acceptance.

## Failure handling

A storyboard labels a future remote-agent feature as available, or uses a voice with unknown permission. Block the affected shot; do not silently generate a replacement or spend provider credits.

## Example

The fifteen-second synthetic storyboard contains two search demonstration shots and one clearly labeled roadmap shot. Its placeholder asset is not an actual screenshot or a rendered promotional video.

## Companion and evaluation

The original Publicationcheck helper provides the `storyboard` command. Use a full checkout and [the exact command contracts](https://github.com/jdavis-software/agent-toolkit/blob/main/docs/PUBLICATIONCHECK.md). A passed helper check does not certify source truth, rights, search visibility or completed agent behavior. `references/scenarios.json` contains not-run host evaluation inputs.

## Technical references

- [Media accessibility](https://www.w3.org/WAI/media/av/)
- [FFmpeg documentation](https://ffmpeg.org/documentation.html)
