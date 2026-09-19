import type { ButtonHTMLAttributes, ReactNode } from 'react';
export const tones = {
  primary: 'bg-accent text-on-accent border-accent hover:opacity-90',
  quiet: 'bg-panel text-ink border-line hover:bg-hover',
  danger: 'bg-danger text-white border-danger hover:opacity-90',
} as const;
export const buttonBase = 'inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border px-4 py-2 font-semibold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none';
export function Button({ tone = 'quiet', className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { tone?: keyof typeof tones }) {
  return <button type="button" className={`${buttonBase} ${tones[tone]} ${className}`} {...props} />;
}
export function IconButton({ label, children, ...props }: Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'aria-label'> & { label: string; children: ReactNode }) {
  return <Button {...props} aria-label={label} className="w-11 shrink-0 px-0">{children}</Button>;
}
