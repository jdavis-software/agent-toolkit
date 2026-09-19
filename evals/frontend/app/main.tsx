import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { App } from './App';
// Browser-only fixture lifetime. A server-rendered app needs a per-request client.
const client = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });
const root = document.getElementById('root');
if (!root) throw new Error('Missing fixture root');
createRoot(root).render(<StrictMode><QueryClientProvider client={client}><App /></QueryClientProvider></StrictMode>);
