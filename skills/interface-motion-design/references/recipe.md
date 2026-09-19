# Animation and Motion Design — original recipe

## Recipe: pending feedback

Use a text status that remains meaningful when animation is disabled. A small loading indicator may rotate only when the user has not requested reduced motion; the accessible name should still communicate pending work.

For a list reorder, compare final item identity and focus after rapid repeated updates. Motion should visualize accepted state, not become the mechanism that determines it.

## Failure fixture

A dialog’s exit animation removes the trigger before focus returns, and reduced-motion users wait through an unnecessary full-screen pan.

**Expected:** Preserve a valid focus destination, make interruption safe and provide a reduced-motion transition that retains meaning.

This recipe is synthetic. A consuming project must bind real versions, components, tools and authority before applying it.
