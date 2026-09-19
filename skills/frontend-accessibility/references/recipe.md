# Frontend Accessibility — original recipe

## Recipe: a named icon action

The SVG is decorative because the button supplies the operation name. A visual tooltip may reinforce that name but must not be the only keyboard-accessible explanation. For toggles, provide state such as `aria-pressed` when it matches the interaction.

A representative acceptance path uses only keyboard: reach the action, activate it, traverse fields, submit invalid input, hear/read the associated error, dismiss and return to a meaningful control. Preserve required title/description parts when composing Radix or another primitive.

## Failure fixture

A dialog opens from an icon-only action but has no accessible title, loses the trigger on close and leaves keyboard focus behind the overlay.

**Expected:** Give the action and dialog names, use a qualified focus pattern, test dismissal/return focus, and record any untested assistive-technology coverage.

This recipe is synthetic. A consuming project must bind real versions, components, tools and authority before applying it.
