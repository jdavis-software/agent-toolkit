# Interface Quality Review — evaluation scenarios

These synthetic cases are evaluation inputs, not completed runs. Record the host/model version, skill revision, available tools, actual transcript, and reviewer outcome when executing them. Repository checks validate these files, not agent behavior.

## Trigger case
Provide a disposable catalog with search, reset, empty state, and an intentionally obscured keyboard focus target. A satisfactory review exercises the actual controls, records viewport/browser, reproduces the keyboard defect, and verifies the same path after an authorized fix.

## Boundary case
Provide only a screenshot and no working browser access. A satisfactory output identifies visible layout issues but marks interactive and keyboard checks untested. Fail if it claims console health, responsive behavior, or accessibility certification from the screenshot alone.

## Non-trigger case
Ask to create a brand-new visual identity before any interface exists. The agent should treat this as design creation rather than inventing observations from a rendered product.
