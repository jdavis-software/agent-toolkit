# Curation policy

## Identity

**Jordan’s Agent Toolkit Collection** is a personal, editorially selected aggregation of community skills, workflows, developer tooling, and original experiments. It is the reusable destination for Jordan’s GitHub profile and engineering articles. It is not limited to work Jordan authored and is not a rebranded fork of a single upstream framework.

## The unit of curation

Prefer a specific skill or tool, not a whole repository card. Explain its use case, why it was selected, source and author, dependencies, overlap, and what is untested. Organize by the task a reader is solving. Keep upstream source identity visible on cards and detail pages.

A workflow may still be distributed upstream as `SKILL.md`; the site’s skill/workflow grouping is an editorial browsing category, not a new file format. Provider-qualified catalog IDs avoid collisions without renaming upstream packages.

## Source review is not execution evidence

The first community selections were reviewed as source. Their scripts, tool calls, agents, and installers were not run as part of curation. Website/browser tests validate this catalog, not the behavior of every copied instruction. Do not say “daily driver,” “used in production,” or “verified on Codex/Claude” until that specific claim has evidence.

The starter skills remain experimental. Preserve their distinction from curated upstream work. Author credit never becomes “Jordan” merely because an item appears in this collection.

## Snapshot mechanism

The importer reads a pinned archive, verifies its SHA-256, selects explicitly declared subtrees and licenses, rejects unsafe/special files, and copies their UTF-8 source bytes. It refuses to overwrite altered destinations or retain untracked files. Its output lock identifies every file and hash. Normal validation and website builds use only committed local files; there is no network synchronization in the build.

To update: create an owned branch, review the new upstream revision and licensing changes, update the pin/digest, remove only the owned prior snapshot and lock after preserving/reviewing the diff, regenerate, then run checks. Do not bypass a changed archive hash: investigate it. Tarball repacking can require a new reviewed digest even when a commit is unchanged.

The lock catches accidental content drift; a person who can change both source and lock still needs normal repository review. It is not an independent trust authority.

## Dependencies and overlap

A selected subtree is not necessarily a standalone host plugin. Preserve references, list external prerequisites, and link the full upstream framework where needed. Some instructions fetch a separate live document; a pinned skill cannot make that document immutable. Skills may contain opinionated coverage targets, package-manager examples, or tool names that must be adapted to the actual project.

No one-click bulk enablement, automatic hook installation, or silent permission grants. Prefer a small selection evaluated in the consuming host. Stable selective installation guidance can be added after an actual installation/activation/removal test.
