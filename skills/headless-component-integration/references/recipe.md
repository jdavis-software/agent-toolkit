# Headless Components and shadcn/ui — original recipe

## Recipe: qualify the primitive before composing

Inspect the installed Button and Dialog source and its primitive dependencies. A Radix composition using `asChild` and a Base UI composition using `render` are not interchangeable recipes. Do not fabricate imports for components that have not been added.

For a new registry item, review the proposed diff, dependencies and CSS changes. Keep an explicit record of any copied third-party source and notices. This skill does not install shadcn/ui, Radix or Base UI as a side effect of resolving the bundle.

## Failure fixture

A wrapper drops the trigger ref and event props, so a composed dropdown no longer returns focus or opens from the keyboard.

**Expected:** Preserve the actual base contract and test the composed control’s keyboard/focus behavior rather than replacing it with a visually similar div.

This recipe is synthetic. A consuming project must bind real versions, components, tools and authority before applying it.
