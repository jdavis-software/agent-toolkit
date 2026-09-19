# Focused upstream-tool checks

The practical qualification workflow provisions gopls 0.23.0, oasdiff 1.32.1 and
Nx 23.2.1 in temporary runner locations. Nothing is added to this site's default
dependencies or to a user's global installation. Go's module verification is kept
on; the temporary Nx dependency lock and the observed tool outputs are retained
with the workflow evidence. This is version-pinned smoke evidence, not a fully
reproducible binary distribution or a declaration that all transitive packages
were audited.

The script exercises an actual Go definition lookup, MCP initialization/discovery,
Nx project/dependency lookup, and a known-breaking OpenAPI removal plus an
identical-schema control. The existing structural-refactoring workflow owns the
actual ast-grep positive/negative/repeatability recipe; do not duplicate it here.

All work is in owned disposable fixture directories. Real Codex authentication,
skill invocation, target-repository MCP roots and Mac-specific behavior are not
measured by these checks. The Node protocol fixture tests must not be labeled live
Codex tests. Run the local private probe and controller canary on the actual host
before adopting that development profile.
