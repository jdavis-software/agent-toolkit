# Design System Architecture — original recipe

## Recipe: a primitive acceptance card

For a button, record semantics (`button` versus navigation link), intent, size, disabled behavior, pending feedback, icon positioning and focus appearance. Reject nested buttons and avoid presenting `aria-disabled` as physical prevention of a click unless the component enforces it.

For a form field, record label, help text, invalid state, error association and optional/required treatment. Compare a representative composition before a token rollout. A pretty gallery does not by itself prove keyboard behavior or contrast in every theme.

## Failure fixture

A global token update makes destructive buttons indistinguishable from primary actions and removes visible focus in dark mode.

**Expected:** Test semantic states and focus in each theme, preserve noncolor cues, and migrate affected consumers with explicit acceptance.

This recipe is synthetic. A consuming project must bind real versions, components, tools and authority before applying it.
