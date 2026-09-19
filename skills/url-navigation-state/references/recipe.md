# URL and Navigation State — original recipe

## Recipe: canonical filters

A public-safe fixture accepts `workspace=studio|docs` and `q` of at most 80 characters. Omit default workspace and empty query on serialization. A committed workspace change pushes a history entry; typing replaces the current entry so every keystroke does not become a Back step.

The standalone fixture uses the History API because it has no framework router. It emits its own local change event after push/replace, since those operations do not themselves deliver a popstate event. A Next.js product should use its router's supported integration instead.

## Failure fixture

Browser Back changes the URL, but the select control and query remain on the newer workspace because each keeps separate local state.

**Expected:** Subscribe to the selected router state, derive controls and query identity together, and prove back/forward restores all three.

This recipe is synthetic. A consuming project must bind real versions, components, tools and authority before applying it.
