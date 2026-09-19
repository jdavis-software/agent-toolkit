# Optional structural-refactoring qualification

Original synthetic TypeScript recipe; ast-grep remains external MIT-licensed software. No upstream rule or skill is copied. This is a syntax-pattern exercise inside a fixture with known declarations, not a symbol-safe general codemod.

The separate CI workflow downloads the Linux x86_64 ast-grep **0.45.3** archive and verifies SHA-256 `f8ac830881339d1edee6b2652f54798c0f4da5a827f2db38a08ee31117783ce8` from the reviewed official release metadata. It extracts a temporary binary; no global install or website dependency change occurs. Other platforms need their own independently qualified artifact.

With an explicitly installed, matching binary and the repository's locked website dependencies:

```bash
python3 evals/structural-refactoring/qualify.py --ast-grep /path/to/ast-grep
```

The runner copies fixtures into its own temporary directory, checks seven should/should-not-match inputs, verifies exactly one target match, applies the rewrite, compares independent expected bytes, and repeats the application. The original and changed fixture execute in Node and pass the existing pinned TypeScript compiler. A deliberately broken rule must fail for missing matches. Diagnostic snapshots are not used; rewrite output has a separate exact-byte oracle.

The recipe handles neither shadowed symbol resolution nor real application behavior. Expand independent cases and perform a semantic ownership review before applying a similar rule to owned project source. No model call, network request or user-source rewrite is performed by the runner. The caller chooses the binary; running an executable inherits caller authority.

References: [official release](https://github.com/ast-grep/ast-grep/releases/tag/0.45.3), [rule tests](https://ast-grep.github.io/guide/test-rule.html), [rewrites](https://ast-grep.github.io/guide/rewrite-code.html).
