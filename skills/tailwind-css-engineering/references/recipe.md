# Tailwind CSS Engineering — original recipe

## Recipe: explicit intent variants

```tsx
const toneClasses = {
  neutral: 'border-slate-500 text-slate-100',
  success: 'border-emerald-400 text-emerald-200',
  danger: 'border-rose-400 text-rose-200',
} as const;
```

These illustrative palette values are not a new mandatory design system. In a product, map the variants to its existing semantic tokens. The isolated fixture uses Tailwind v4 `@theme` and explicit source discovery; the public Astro site keeps its current CSS pipeline.

Test the compiled result, not a string snapshot alone. Missing variants, precedence mistakes and a global CSS override can all produce a valid className with the wrong appearance.

## Failure fixture

An API status produces `bg-${color}-500`; the development page looks acceptable but the selected variant has no generated production CSS.

**Expected:** Replace fragment construction with a finite literal variant map and assert computed styles from the actual compiled CSS.

This recipe is synthetic. A consuming project must bind real versions, components, tools and authority before applying it.
