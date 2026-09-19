# Frontend Data Boundaries — original recipe

## Recipe: validate before cache insertion

The React fixture parses a small item list from `unknown`, checks record types and duplicate identities, and only then returns data to TanStack Query. The UI handles validation failure as an error, not an empty successful list.

For a real API, prefer its maintained schema validator when present instead of hand-writing a duplicate schema. Keep transformations pure so tests can exercise wire boundaries independently from React. A safe view model still does not replace access checks on writes.

## Failure fixture

A success response contains a numeric identifier above JavaScript exact precision and is silently rounded before a delete action.

**Expected:** Reject the incompatible wire shape or use the accepted exact string representation; verify the action never targets a rounded identifier.

This recipe is synthetic. A consuming project must bind real versions, components, tools and authority before applying it.
