/** The supplied original is the only canonical mascot; do not redraw its face. */
export function KilaMascot({ size = 80, className = '', decorative = false }: { size?: number; className?: string; decorative?: boolean }) {
  return <img src="/art/kila-original.png" width={size} height={size} className={`kila-mascot ${className}`} alt={decorative ? '' : 'Kila, your friendly yellow star cultural companion'} draggable={false} />;
}
