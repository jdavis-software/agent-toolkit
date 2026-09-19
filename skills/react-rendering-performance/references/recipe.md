# React Rendering and Performance — original recipe

## Recipe: measure before memoizing

Record an input-to-visible-result trace at the agreed dataset size. Keep a separate count of network requests and React commits. Repeat the same script before and after the proposed boundary change; use the same production/Profiler configuration for both.

A useful failure fixture types `map`, changes it to `cedar`, and resolves the older request last. Rendering a stale result faster is still a failure. A compiler-enabled app and a non-compiler app may need different identity optimizations; neither permits mutating props or suppressing hook dependency warnings.

## Failure fixture

A search field becomes unresponsive because every keystroke filters and paints a very large table.

**Expected:** Measure the bottleneck, isolate urgent input, reduce or defer presentation work, and verify that the newest search result and keyboard focus remain correct.

This recipe is synthetic. A consuming project must bind real versions, components, tools and authority before applying it.
