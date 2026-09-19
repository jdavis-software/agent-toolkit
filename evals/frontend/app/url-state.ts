import { useSyncExternalStore } from 'react';
import { parseFilters, writeFilters, type Filters } from './domain';
const EVENT = 'fixture-route-change';
function subscribe(notify: () => void) {
  window.addEventListener('popstate', notify);
  window.addEventListener(EVENT, notify);
  return () => { window.removeEventListener('popstate', notify); window.removeEventListener(EVENT, notify); };
}
export function useFilters() {
  const search = useSyncExternalStore(subscribe, () => window.location.search, () => '');
  const setFilters = (patch: Partial<Filters>, mode: 'push' | 'replace' = 'replace') => {
    const next = window.location.pathname + writeFilters(window.location.search, patch) + window.location.hash;
    if (mode === 'push') history.pushState(null, '', next); else history.replaceState(null, '', next);
    window.dispatchEvent(new Event(EVENT));
  };
  return [parseFilters(search), setFilters] as const;
}
