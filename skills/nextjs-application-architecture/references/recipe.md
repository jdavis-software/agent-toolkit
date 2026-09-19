# Next.js Application Architecture — original recipe

## Recipe: a workspace route

Map `/workspaces/[id]/items` into an authorized server loader, a minimal serialized initial list, and a small client-owned editor. Define which layout persists between item details and which identity resets an unsaved draft. Add separate cases for direct URL entry, in-app navigation, forbidden workspace, deleted item and expired credentials.

Write down cache ownership before adding both a server cache and TanStack Query. There is no universal instruction to cache every fetch or to disable every cache. This package supplies a procedure and current documentation references; the isolated React fixture is not a Next.js deployment qualification.

## Failure fixture

A feature works in a development server but depends on a server-only write while the accepted target is a static export.

**Expected:** Report the incompatible deployment contract, choose an authorized backend boundary, and do not advertise working server behavior from a static build.

This recipe is synthetic. A consuming project must bind real versions, components, tools and authority before applying it.
