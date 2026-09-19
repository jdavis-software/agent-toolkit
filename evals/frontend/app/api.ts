import { queryOptions } from '@tanstack/react-query';
import { itemKeys, parseItems, type Filters } from './domain';
export function itemsOptions(filters: Filters) {
  return queryOptions({
    queryKey: itemKeys.list(filters),
    queryFn: async ({ signal }) => {
      const p = new URLSearchParams({ workspace: filters.workspace, q: filters.q });
      const response = await fetch(`/api/items?${p}`, { signal });
      if (!response.ok) throw new Error('Items could not be loaded.');
      return parseItems(await response.json() as unknown);
    },
    staleTime: 30_000,
    retry: false,
  });
}
export async function createItem(workspace: string, label: string) {
  const response = await fetch('/api/items', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ workspace, label: label.trim() }),
  });
  if (response.status === 409) throw new Error('That label already exists.');
  if (!response.ok) throw new Error('The item could not be saved.');
}
export async function setFavorite(workspace: string, id: string, favorite: boolean) {
  const response = await fetch(`/api/items/${encodeURIComponent(id)}`, {
    method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ workspace, favorite }),
  });
  if (!response.ok) throw new Error('Favorite could not be saved.');
}
