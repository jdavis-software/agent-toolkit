# Small role profiles

`catalog/roles.json` selects canonical skills for four optional roles: coordinator,
Go implementer, TypeScript implementer and independent reviewer. A role is a
selection, not another worker, permission grant, or mandatory agent topology.
No new skill bodies or external services are introduced.

```sh
node tools/rolekit.mjs list
node tools/rolekit.mjs resolve go-worker
node tools/rolekit.mjs stage go-worker --revision FULL_REVIEWED_COMMIT --dest /owned/new-package
node tools/rolekit.mjs verify /owned/new-package
```

Use a clean full toolkit checkout. `stage` requires an explicit reviewed revision,
writes only a new destination outside that checkout and refuses existing paths.
It copies the existing resolver's dependency closure, not just `SKILL.md`: required
helper modules, documentation and reference files keep their original paths.
No installer scripts, models, tools or MCP servers are executed by staging.
The optional Python companion still requires its separately provisioned interpreter.

A staged package keeps `skills/`, `tools/`, and documentation together. Its
`.agents/skills/` contains relative links to the selected canonical directories.
To test discovery, use this directory as an explicit extra skill root in the local
Codex adapter, or deliberately link selected skill folders into an owned project's
`.agents/skills/`. The tool never installs globally or modifies another project.
Use the pinned package's absolute helper path and the target repository's explicit
root/commands when consuming its helpers. The private adapter supplies these
bindings; do not assume the target repository contains the toolkit's `tools/`.

`verify` checks the manifest, selected bytes, unexpected files, and discovery links;
it does not authenticate the author, prove that Codex loaded a skill, or authorize
execution. Staging failures retain the partial destination; examine it before
manual removal. A stage is immutable: upgrade into a new destination, test it,
then explicitly switch the consuming binding. Roll back by selecting the prior
package. Never overwrite or delete user-modified skills as an upgrade strategy.
The original-content license decision remains unchanged.

Host activation and model behavior are separate from packaging integrity. Record
actual runtime version, discovered paths/digests, invocation and independent task
results before claiming real-host qualification. See `LOCAL_ADAPTER.md` for the
explicit local probe; no personal account, paths or private acceptance records
belong in this public repository.
