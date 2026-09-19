# React Component Architecture — original recipe

## Recipe: an editable collection boundary

Separate a collection owner (query, ordering, selected ID) from an item editor (draft, validation, submit). Let the collection provide the accepted item ID as the editor key. Reset a draft only when the accepted identity actually changes, not whenever a new result object is allocated.

Write a consumer fixture with two items named Cedar and Maple. Focus Maple, type a suffix, reverse the list, then submit. The assertion checks Maple's submitted ID and value as well as focus. A screenshot of the final list alone would miss the identity defect.

Use `type="button"` on non-submit actions inside a form. A visual `Button` abstraction must still deliver a real button or an explicit link, not nested interactive elements.

## Failure fixture

A reordered editable list loses focus and applies the draft to a different record because keys use array positions.

**Expected:** Keep identity with the record ID, preserve the draft and focused field during reorder, and test that editing record A never changes B.

This recipe is synthetic. A consuming project must bind real versions, components, tools and authority before applying it.
