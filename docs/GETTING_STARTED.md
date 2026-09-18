# Getting started

## Read before installing
Start with one original skill's `SKILL.md`. Its body contains when to use it, when not to use it, its output, failure cases, and a synthetic example. The first packages are experimental; there is no tested one-click installation or host-compatibility claim yet.

Original repository licensing is pending. Do not assume that public visibility grants reuse rights. Upstream curated projects have their own installation instructions and licenses.

## Evaluate an original package
After licensing and host installation decisions are settled, use a disposable repository with no production credentials. Record the host/version, operating system, skill revision, task input, actual output, and relevant artifacts. Try one intended trigger and one non-trigger or failure case. For a handoff, verify reported commits and checks against real command output. For verification, seed a failing check and confirm it is not reported as passing.

Store only public-safe, reviewed evidence. Do not fabricate transcripts or benchmark gains. Update metadata only when the evidence justifies it.

## Local website development
Follow the README's pinned toolchain and commands. The static site reads local repository content; it never contacts Notion. The JSON catalog and counts are derived from the same source used for detail pages.

## Deploying
Enable GitHub Pages with GitHub Actions as the source. The workflow on `main` installs from the committed lockfile, validates, checks, tests, builds, uploads, and deploys. Verify the returned public URL after deployment. A successful static build is not confirmation that Pages settings or deployment succeeded.
