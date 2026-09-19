# React Server Component Boundaries — original recipe

## Recipe: a private service and a public view model

Keep the authorization/read operation in a server-only module. Project `{id, label, canEdit}` only after the server independently evaluates access. The `canEdit` prop controls presentation; the subsequent server write must perform its own access check.

Render a public, deterministic empty shell for storage-dependent preferences until the supported hydration path resolves them. A timestamp, locale-specific label or localStorage value should not change the first tree unpredictably.

The React fixture in this repository is client-only. It does not claim RSC serialization or Next server-action coverage.

## Failure fixture

A harmless-looking shared barrel re-exports a server database helper into a client component.

**Expected:** Split the export boundary, fail an intentional forbidden-import fixture, and inspect the browser bundle and serialized props for private values.

This recipe is synthetic. A consuming project must bind real versions, components, tools and authority before applying it.
