// Decorative Georgian motifs (Borjgali rosette + carved lozenge band). Purely decorative: aria-hidden.
export function Borjgali({ className = "" }: { className?: string }) {
  const rays = Array.from({ length: 7 }, (_, i) => i * (360 / 7));
  return (
    <svg viewBox="-50 -50 100 100" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round">
      {rays.map((a) => (
        <path key={a} d="M0 -8 C 14 -14, 22 -30, 10 -42" transform={`rotate(${a})`} />
      ))}
      <circle r="5" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function OrnamentDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 text-accent ${className}`} aria-hidden="true">
      <span className="ornament-band h-2.5 w-16 md:w-24" />
      <Borjgali className="h-6 w-6" />
      <span className="ornament-band h-2.5 w-16 md:w-24" />
    </div>
  );
}
