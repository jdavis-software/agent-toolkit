# React Forms and Validation — original recipe

## Recipe: a minimal lifecycle

The isolated React fixture uses React Hook Form with a label field, explicit default value, a whitespace-aware minimum and a bounded maximum. Its submit handler awaits a synthetic HTTP request, maps a conflict with `setError`, and resets only after accepted creation.

For an edit form, add a separate dirty-refetch test rather than copying this create-form reset rule. For multi-step forms, write down whether unmounted values are retained and validate the entire final submission at the server boundary.

## Failure fixture

A name form looks valid locally, receives a server conflict, then resets all user input and announces success because the submit promise was not awaited.

**Expected:** Await submission, show the server error, keep the draft, block duplicate submits and verify the success path only after actual acceptance.

This recipe is synthetic. A consuming project must bind real versions, components, tools and authority before applying it.
