# Responsive UI Implementation — original recipe

## Recipe: a three-pressure layout trial

Render a workspace title with 120 characters, a translated action label and 30 results. Inspect narrow and wide containers, then increase text size. The title may wrap, the toolbar may stack, and the result region may scroll only where explicitly labeled.

Check the actual action after the layout transition: open the form, trigger an error, focus the field and submit. Avoid fixing a genuine width problem by applying `overflow-x:hidden` to the entire page.

## Failure fixture

A sidebar hides skill-to-bundle navigation on narrow screens, leaving no visible route back to the relevant workflow.

**Expected:** Keep the required link in visible semantic navigation, click it on the narrow viewport, and verify it was not merely found in hidden DOM.

This recipe is synthetic. A consuming project must bind real versions, components, tools and authority before applying it.
