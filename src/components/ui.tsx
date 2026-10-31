import { useEffect, useId, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { KilaMascot } from './KilaMascot';
interface ModalProps { open: boolean; onClose: () => void; title?: string; children: ReactNode; maxWidth?: string }
export function Modal({ open, onClose, title, children, maxWidth = 'max-w-2xl' }: ModalProps) {
  const panel = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  const titleId = useId();
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const items = () => Array.from(panel.current?.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], input:not([disabled]), select, textarea, [tabindex="0"]') ?? []).filter(el => el.getClientRects().length);
    (items()[0] ?? panel.current)?.focus();
    const keydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeRef.current();
      if (event.key !== 'Tab') return;
      const focusable = items();
      const first = focusable[0]; const last = focusable[focusable.length - 1];
      if (!first) { event.preventDefault(); panel.current?.focus(); }
      else if (event.shiftKey && (document.activeElement === first || document.activeElement === panel.current)) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', keydown);
    return () => { document.removeEventListener('keydown', keydown); document.body.style.overflow = overflow; previous?.focus(); };
  }, [open]);
  if (!open) return null;
  return <div className="modal-backdrop" onClick={onClose}><div ref={panel} role="dialog" aria-modal="true" aria-labelledby={titleId} tabIndex={-1} className={`${maxWidth} story-modal`} onClick={e => e.stopPropagation()}>
    <div className="flex items-center justify-between gap-4 mb-5"><h2 id={titleId} className="text-2xl font-display font-bold">{title ?? 'Details'}</h2><button onClick={onClose} className="icon-button" aria-label="Close dialog"><X size={22} /></button></div>{children}
  </div></div>;
}
export function AIBadge({ label = 'Storybook adaptation' }: { label?: string }) { return <span className="inline-flex px-3 py-1 rounded-full text-xs font-bold bg-neon-purple/10 text-neon-purple">{label}</span>; }
export function Card({ children, className = '', onClick }: { children: ReactNode; className?: string; onClick?: () => void }) {
  return <div onClick={onClick} role={onClick ? 'button' : undefined} tabIndex={onClick ? 0 : undefined} onKeyDown={onClick ? e => { if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); onClick(); } } : undefined} className={`card-base p-5 ${onClick ? 'card-hover cursor-pointer' : ''} ${className}`}>{children}</div>;
}
export function Button({ children, onClick, variant = 'primary', size = 'md', disabled, className = '', ariaLabel }: { children: ReactNode; onClick?: () => void; variant?: 'primary' | 'secondary' | 'neon-blue' | 'neon-pink' | 'neon-green' | 'ghost' | 'danger'; size?: 'sm' | 'md' | 'lg'; disabled?: boolean; className?: string; ariaLabel?: string }) {
  return <button type="button" onClick={onClick} disabled={disabled} aria-label={ariaLabel} className={`story-button button-${variant} button-${size} ${className}`}>{children}</button>;
}
export function SectionTitle({ children, subtitle }: { children: ReactNode; subtitle?: string }) { return <div className="mb-6"><h2 className="text-3xl font-display font-bold">{children}</h2>{subtitle && <p className="text-ink-300 mt-2">{subtitle}</p>}</div>; }
export function EmptyState({ message }: { emoji?: string; message: string }) { return <div className="flex flex-col items-center justify-center py-16 text-center"><KilaMascot size={100} /><p className="text-ink-300 text-lg mt-4">{message}</p></div>; }
