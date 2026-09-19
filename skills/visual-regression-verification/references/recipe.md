# Visual Regression and UI Verification — original recipe

## Recipe: visual evidence without fake baseline coverage

Capture the first meaningful view, an invalid form, a refreshed list and an open disclosure in both themes. A manual screenshot review should be labeled manual; only call it a pixel-regression test when an accepted baseline was actually compared.

The toolkit’s browser fixtures write screenshots and assert behavior/overflow. They do not claim a maintained cross-browser pixel-baseline suite or physical-device certification.

## Failure fixture

A screenshot test is updated to accept a narrow layout that clipped the Save action and hid the focused control.

**Expected:** Reject the baseline update until the action is visible and usable, test it directly, and record the corrected screenshot.

This recipe is synthetic. A consuming project must bind real versions, components, tools and authority before applying it.
