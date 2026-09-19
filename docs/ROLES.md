# Specialist roles

Roles describe a responsibility and select canonical skills. They are not trained agents, installed workers, permission grants or additional entries in the skill catalog. The eight initial presets are Frontend Engineer, Go Backend Engineer, Architecture Reviewer, QA & Accessibility Reviewer, Security Reviewer, Research Analyst, Video Producer and Release Verifier.

```bash
node tools/bundle.mjs roles
node tools/bundle.mjs role frontend-engineer
node tools/bundle.mjs role architecture-reviewer --require-clean --expected-revision FULL_COMMIT_SHA
```

Run from a full checkout (or supply `--root DIR`). The first command lists metadata. Resolution outputs JSON containing the role, sorted selected skill IDs, actual file hashes, source-state observations and a digest. It does not copy skill bodies into the response, install dependencies, run a model or launch workers. Save generated manifests outside a checkout that must remain clean.

`catalog/roles.json` is the canonical role registry. No credential, local path, executable command, tool grant or company-specific configuration belongs there. Each role has an ID/version, title, description, kind, requested mode, selected skills, deliverables, preferred context and non-goals. Review/analysis presets request `read-only`; implementation/production presets request `task-bound`. Both modes still require independently enforced host permissions.

The resolver shares the bundle file-selection implementation, so selected tools and supporting files travel with their actual instructions. It rejects unknown/nonlocal or duplicate skill selections, malformed modes, unsupported registry fields, unsafe paths, symlinks and oversized files. Role metadata and file content participate in the digest. Strict mode requires an observed clean Git root and optional exact revision. Content-only copies remain supported but explicitly lack Git provenance. Repeated reads detect observed changes, not every possible concurrent mutation or a malicious filesystem.

## Private binding

Choose the role for its deliverable, then select only the procedures relevant to the current task. Provide source/contract revision, owned scope, real capability observations, tool policy, accounts, resource limits and acceptance requirements separately. A browser reviewer does not acquire browser access by selecting that role. A release verifier does not gain deployment authority. A video producer does not acquire permission to spend provider credits.

There is no promise of activation in Codex, Claude or another host. A host adapter can translate this registry to its own configuration after validating the selected sources and instruction precedence. Do not copy a whole role's skill content into permanent global instructions. Agentflow remains an offline coordination helper, not a role launcher.

## Verification

`node --test tests/roles.test.mjs` exercises the real parser, safe file resolver and CLI using synthetic fixtures, source edits and Git state. The website has `/roles/`, `/roles/ROLE/` and `/roles.json` for discovery. Counts are separate from skills/tools/categories/bundles. Host permissions, execution and instruction effectiveness require separate actual-host tests.
