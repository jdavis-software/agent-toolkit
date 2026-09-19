# Frontend Performance Budgeting — original recipe

## Recipe: a bounded bundle budget

The isolated frontend fixture records raw and gzip sizes from its real esbuild/Tailwind output. Its limits are fixture-specific, not promises about every React application. Inspect the metadata for actual imported icon modules and compare an empty-icon baseline when evaluating icon overhead.

Do not label the recorded gzip size a measured network transfer or claim a passing size budget proves good interaction latency. Use a real performance trace for the latter and separate lab from field evidence.

## Failure fixture

An icon picker imports every icon pack to avoid a few explicit imports and makes the initial route much larger.

**Expected:** Measure the emitted graph, select a bounded registry or deferred picker, and enforce a predeclared transfer budget while retaining accessible controls.

This recipe is synthetic. A consuming project must bind real versions, components, tools and authority before applying it.
