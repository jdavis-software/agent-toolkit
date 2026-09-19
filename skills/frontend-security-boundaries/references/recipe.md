# Frontend Security Boundaries — original recipe

## Recipe: presentation is not permission

In the React fixture, API labels are rendered as text nodes; a hostile-looking label must not create a new element or execute script. That demonstration does not validate an HTML sanitizer or prove a real server authorizes edits.

For a rich-content feature, maintain separate tests for sanitized markup, link schemes, embedded assets and later client updates. Include the actual policy boundaries in the consuming project rather than adding an unreviewed security framework to this public collection.

## Failure fixture

A user-supplied `javascript:` destination is passed to navigation, or a sanitized-looking preview uses raw innerHTML for later updates.

**Expected:** Constrain the actual sink on every path and verify hostile input remains text or is rejected without execution.

This recipe is synthetic. A consuming project must bind real versions, components, tools and authority before applying it.
