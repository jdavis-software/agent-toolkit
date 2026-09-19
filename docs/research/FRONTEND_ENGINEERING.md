# Frontend engineering — source review and original implementation decisions

Research date: 2026-09-18. Public toolkit baseline: `14e143d113bc9f3288b9987bc3a5239d419b8c58`. Scope: the requested React, Next.js, TanStack Query, Tailwind, design, forms, icons and frontend-quality expansion. This is not an exhaustive comparison of all open-source skill repositories or an independent benchmark of their agents.

## Open-source references reviewed

| Primary source | Useful idea | Original implementation decision |
| --- | --- | --- |
| [Vercel agent skills](https://github.com/vercel-labs/agent-skills) | Performance/architecture guidance separated into actionable areas | Use task-specific ownership, profiling and boundary procedures rather than reproduce an upstream rule list. No upstream skill files copied. |
| [UI UX Pro Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) | Establish a coherent product-specific direction before construction | Write an original Interface Design Brief and state matrix. Do not copy the style database or make conversion claims. |
| [shadcn/ui](https://ui.shadcn.com/docs) | Source-owned components and registry-driven composition | Qualify installed source and primitive base, preserve local modifications and test composed behavior. No automatic CLI installation or component import. |
| [React Icons](https://github.com/react-icons/react-icons) | One React interface over many icon families | Keep a coherent family, named imports, action-level accessible names and family-specific notices. The optional fixture actually uses the Bootstrap family. |
| [Lucide React](https://lucide.dev/guide/react) | Direct icon imports and reusable SVG components | Support it as an alternative where already installed, not a mandatory second icon dependency. |

## Technology contracts used

[React state structure](https://react.dev/learn/choosing-the-state-structure) and [effects](https://react.dev/learn/you-might-not-need-an-effect) inform the distinction between derived state and external synchronization. The original skills additionally require an explicit draft, navigation and server-state owner for each value. [Profiler](https://react.dev/reference/react/Profiler) and [transitions](https://react.dev/reference/react/useTransition) inform the measured rendering work; a transition is not a worker thread or a network-order guarantee.

[Next server/client boundaries](https://nextjs.org/docs/app/getting-started/server-and-client-components), [caching](https://nextjs.org/docs/app/getting-started/caching) and [data security](https://nextjs.org/docs/app/guides/data-security) are version-sensitive. The procedures require inspecting installed versions and flags, deployment mode, browser payloads and independent server authorization rather than blindly assuming a historical caching default. No Next.js runtime test is claimed by the CSR fixture.

[TanStack Query defaults](https://tanstack.com/query/latest/docs/framework/react/guides/important-defaults), [optimistic updates](https://tanstack.com/query/latest/docs/framework/react/guides/optimistic-updates), [cancellation](https://tanstack.com/query/latest/docs/framework/react/guides/query-cancellation) and [SSR](https://tanstack.com/query/latest/docs/framework/react/guides/advanced-ssr) informed the query skill and real-library tests. Freshness and retention are distinct, conflicting optimistic operations need an explicit strategy, and request-scoped server clients must not become shared private caches.

[Tailwind source detection](https://tailwindcss.com/docs/detecting-classes-in-source-files) and [theme variables](https://tailwindcss.com/docs/theme) informed an actual v4 compilation fixture using full literal classes and explicit source discovery. Do not transplant v4 CSS configuration into a v3 application.

React Hook Form's public docs returned access errors during this review; its [official repository](https://github.com/react-hook-form/react-hook-form) and [documentation source for reset](https://github.com/react-hook-form/documentation/blob/master/src/content/docs/useform/reset.mdx) were inspected instead. The form skill distinguishes preserving dirty values from blindly resetting on refetch and requires awaiting actual submissions.

[WAI button](https://www.w3.org/WAI/ARIA/apg/patterns/button/) and [dialog patterns](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/), [Radix accessibility](https://www.radix-ui.com/primitives/docs/overview/accessibility), [Motion accessibility](https://motion.dev/docs/react-accessibility), [Playwright visual comparisons](https://playwright.dev/docs/test-snapshots), [Web Vitals](https://web.dev/articles/vitals), [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API), [workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers) and [OWASP XSS prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html) are the primary references for the corresponding procedures. Narrow automated checks are not complete accessibility/security/performance certification.

## Version and evidence boundaries

The isolated fixture package/lock was generated by npm in a disposable CI job without executing dependency scripts. Top-level versions are recorded in that package, not guessed from a model's prior knowledge. Root website dependencies and the pnpm lock were not upgraded. Builds use the committed standalone lock and preserve dependency notices.

The instructions, procedures, examples, tests and fixture application are original requirements-first work. The actual libraries and Bootstrap glyphs remain third-party material with retained notices. Research links are kept here as an honest source record, not as a claim that the original skills are renamed upstream packages.
