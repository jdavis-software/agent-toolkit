export const repository = 'https://github.com/jdavis-software/agent-toolkit';
export const withBase = (path = '') => `${import.meta.env.BASE_URL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
export const sourceUrl = (path: string) => `${repository}/blob/main/${path}`;
