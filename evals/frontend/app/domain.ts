export type Workspace = 'studio' | 'docs';
export interface Filters { workspace: Workspace; q: string; }
export interface Item { id: string; label: string; favorite: boolean; }
export const itemKeys = {
  all: (workspace: Workspace) => ['items', workspace] as const,
  list: ({ workspace, q }: Filters) => ['items', workspace, { q }] as const,
};
export function parseFilters(search: string): Filters {
  const p = new URLSearchParams(search);
  return { workspace: p.get('workspace') === 'docs' ? 'docs' : 'studio', q: (p.get('q') ?? '').slice(0, 80) };
}
export function writeFilters(search: string, patch: Partial<Filters>): string {
  const current = parseFilters(search), next = { ...current, ...patch };
  const p = new URLSearchParams(search);
  if (next.workspace === 'studio') p.delete('workspace'); else p.set('workspace', next.workspace);
  if (!next.q) p.delete('q'); else p.set('q', next.q.slice(0, 80));
  p.sort();
  return p.size ? `?${p}` : '';
}
export function validateLabel(value: string): true | string {
  const length = value.trim().length;
  return length < 3 ? 'Use at least 3 characters.' : length > 60 ? 'Use at most 60 characters.' : true;
}
export function parseItems(value: unknown): Item[] {
  if (!Array.isArray(value) || value.length > 100) throw new Error('Invalid item response');
  const ids = new Set<string>();
  return value.map((v: unknown) => {
    if (!v || typeof v !== 'object') throw new Error('Invalid item response');
    const record = v as Record<string, unknown>;
    if (typeof record.id !== 'string' || !/^[a-z0-9-]{1,40}$/.test(record.id) || ids.has(record.id)
      || typeof record.label !== 'string' || !record.label || record.label.length > 160 || typeof record.favorite !== 'boolean') {
      throw new Error('Invalid item response');
    }
    ids.add(record.id);
    return { id: record.id, label: record.label, favorite: record.favorite };
  });
}
