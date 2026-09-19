# Icon System Integration — React Icons — original recipe

## Recipe: a named, decorative icon

```tsx
import { BsArrowClockwise } from 'react-icons/bs';

export function RefreshButton({ refresh }: { refresh: () => void }) {
  return (
    <button type="button" onClick={refresh} aria-label="Refresh items">
      <BsArrowClockwise aria-hidden="true" focusable="false" />
    </button>
  );
}
```

The original React fixture uses only Bootstrap Icons through React Icons. The wrappers and glyphs remain third-party software, not original toolkit assets. Their notices are included with the isolated fixture build. This recipe does not require changing an application already using Lucide, Heroicons, Phosphor or another approved family.

Compare icon-only and text-plus-icon controls at their real rendered sizes. A tooltip is useful reinforcement but not a substitute for the button name.

## Failure fixture

A toolbar imports every React Icons pack by namespace and exposes unlabeled icon-only buttons whose SVG titles disappear in the accessibility tree.

**Expected:** Use a finite family/registry, label the actionable elements, verify keyboard/accessible names and inspect the production bundle and family notices.

This recipe is synthetic. A consuming project must bind real versions, components, tools and authority before applying it.
