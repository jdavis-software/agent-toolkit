import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { BsArrowClockwise, BsCircleHalf, BsSearch, BsStar, BsStarFill, BsPlusLg } from 'react-icons/bs';
import { itemsOptions, createItem, setFavorite } from './api';
import { itemKeys, validateLabel, type Filters, type Item } from './domain';
import { useFilters } from './url-state';
import { Button, IconButton } from './components';
const field = 'min-h-11 w-full min-w-0 rounded-xl border border-line bg-canvas px-3 py-2 text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent';
function CreateForm({ workspace }: { workspace: Filters['workspace'] }) {
  const client = useQueryClient();
  const [notice, setNotice] = useState('');
  const { register, handleSubmit, reset, setError, formState: { errors, isSubmitting } } = useForm<{ label: string }>({ defaultValues: { label: '' } });
  return <form noValidate onSubmit={handleSubmit(async ({ label }) => {
    setNotice('');
    try {
      await createItem(workspace, label);
      await client.invalidateQueries({ queryKey: itemKeys.all(workspace) });
      reset({ label: '' }); setNotice('Item created.');
    } catch (error) { setError('label', { message: error instanceof Error ? error.message : 'Save failed.' }, { shouldFocus: true }); }
  })} aria-label="Create an item" className="rounded-2xl border border-line bg-panel p-6">
    <p className="text-xs font-semibold uppercase tracking-widest text-muted">Form boundary</p>
    <h2 className="mt-2 text-xl font-semibold">Create an item</h2>
    <p className="mt-2 text-sm leading-6 text-muted">A draft stays here until the synthetic API accepts it.</p>
    <label className="mt-5 block text-sm font-semibold" htmlFor="item-label">Item label</label>
    <input id="item-label" autoComplete="off" className={`${field} mt-2`} aria-invalid={Boolean(errors.label)} aria-describedby={errors.label ? 'label-help label-error' : 'label-help'} {...register('label', { validate: validateLabel })} />
    <p id="label-help" className="mt-2 text-xs text-muted">3–60 characters. Try “Conflict” to see a server rejection.</p>
    {errors.label && <p id="label-error" role="alert" className="mt-2 text-sm text-error">{errors.label.message}</p>}
    <Button type="submit" tone="primary" disabled={isSubmitting} className="mt-5 w-full"><BsPlusLg aria-hidden="true" focusable="false" />{isSubmitting ? 'Saving…' : 'Create item'}</Button>
    <p role="status" className="mt-3 min-h-5 text-sm">{notice}</p>
  </form>;
}
function ItemList({ filters }: { filters: Filters }) {
  const client = useQueryClient();
  const items = useQuery(itemsOptions(filters));
  const favorite = useMutation({
    mutationFn: ({ workspace, id, value }: { workspace: Filters['workspace']; id: string; value: boolean; key: ReturnType<typeof itemKeys.list> }) => setFavorite(workspace, id, value),
    onMutate: async (variables) => {
      await client.cancelQueries({ queryKey: variables.key, exact: true });
      const previous = client.getQueryData<Item[]>(variables.key);
      client.setQueryData<Item[]>(variables.key, (old) => old?.map(item => item.id === variables.id ? { ...item, favorite: variables.value } : item));
      return { previous, key: variables.key };
    },
    onError: (_error, _variables, context) => { if (context?.previous) client.setQueryData(context.key, context.previous); },
    onSettled: (_data, _error, variables) => client.invalidateQueries({ queryKey: itemKeys.all(variables.workspace) }),
  });
  return <section className="rounded-2xl border border-line bg-panel p-6" aria-label="Workspace items" aria-busy={items.isFetching}>
    <div className="flex items-center justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-widest text-muted">Query boundary</p><h2 className="mt-2 text-xl font-semibold">{filters.workspace === 'studio' ? 'Studio' : 'Docs'} items</h2></div>
      <IconButton label="Refresh items" disabled={items.isFetching || favorite.isPending} onClick={() => { void items.refetch(); }}><BsArrowClockwise aria-hidden="true" focusable="false" className={items.isFetching ? 'motion-safe:animate-spin' : ''} /></IconButton>
    </div>
    {items.isPending && <p role="status" className="mt-6 text-muted">Loading items…</p>}
    {items.isError && <p role="alert" className="mt-5 text-error">{items.data ? 'Refresh failed. Showing previous items.' : 'Items could not be loaded.'}</p>}
    {items.data?.length === 0 && <p className="mt-6 text-muted">No matching items. Change the filter or create one.</p>}
    {items.data && items.data.length > 0 && <ul className="mt-5 divide-y divide-line">{items.data.map(item => <li key={item.id} className="flex min-w-0 items-center justify-between gap-4 py-4">
      <span className="min-w-0 break-words text-base font-medium">{item.label}</span>
      <IconButton label={`Favorite ${item.label}`} aria-pressed={item.favorite} disabled={favorite.isPending} onClick={() => favorite.mutate({ workspace: filters.workspace, id: item.id, value: !item.favorite, key: itemKeys.list(filters) })}>
        {item.favorite ? <BsStarFill aria-hidden="true" focusable="false" className="text-accent" /> : <BsStar aria-hidden="true" focusable="false" />}
      </IconButton>
    </li>)}</ul>}
    {favorite.isError && <p role="alert" className="mt-4 text-error">Favorite failed; the previous value was restored.</p>}
    <p role="status" className="mt-4 text-xs text-muted">{items.isFetching && items.data ? 'Refreshing…' : items.data ? `${items.data.length} items in this view` : ''}</p>
  </section>;
}
export function App() {
  const [filters, setFilters] = useFilters();
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  useEffect(() => { document.documentElement.dataset.theme = theme; }, [theme]);
  return <main className="mx-auto max-w-5xl px-5 py-8 text-ink sm:px-8 sm:py-12">
    <header className="flex items-start justify-between gap-5"><div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Jordan’s Agent Toolkit / React fixture</p><h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-5xl">Frontend foundations.</h1><p className="mt-4 max-w-2xl text-base leading-7 text-muted">One small interface. Explicit state owners. Real React, query, form, CSS and icon dependencies.</p></div>
      <IconButton label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`} onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}><BsCircleHalf aria-hidden="true" focusable="false" /></IconButton>
    </header>
    <div className="mt-7 rounded-xl border border-line bg-panel px-4 py-3 text-sm leading-6 text-muted">Synthetic local API. No accounts, production writes or paid providers. This is a client-rendered fixture, not a Next.js deployment.</div>
    <section aria-label="Navigation filters" className="mt-8 grid gap-4 sm:grid-cols-[12rem_1fr]">
      <div><label htmlFor="workspace" className="mb-2 block text-sm font-semibold">Workspace</label><select id="workspace" className={field} value={filters.workspace} onChange={event => setFilters({ workspace: event.target.value === 'docs' ? 'docs' : 'studio', q: '' }, 'push')}><option value="studio">Studio</option><option value="docs">Docs</option></select></div>
      <div><label htmlFor="search" className="mb-2 block text-sm font-semibold">Search items</label><div className="relative"><BsSearch aria-hidden="true" focusable="false" className="pointer-events-none absolute left-3 top-3.5 text-muted" /><input id="search" type="search" maxLength={80} className={`${field} pl-10`} value={filters.q} onChange={event => setFilters({ q: event.target.value })} /></div></div>
    </section>
    <div className="mt-6 grid items-start gap-6 md:grid-cols-[1.4fr_1fr]"><ItemList key={`items:${filters.workspace}`} filters={filters} /><CreateForm key={`form:${filters.workspace}`} workspace={filters.workspace} /></div>
    <footer className="mt-8 border-t border-line pt-5 text-xs leading-6 text-muted">Query results belong to their workspace and filter. Drafts belong to a form. Navigation belongs to the URL. Favorite mutations are serialized in this small fixture. Icon glyphs are Bootstrap Icons through React Icons; see the included notices.</footer>
  </main>;
}
