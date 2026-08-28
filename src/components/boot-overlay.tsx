type Props = {
  etaMs: number;
  frac: number;
  langHe: boolean;
  city: string;
  name: string;
};

export function BootOverlay({ etaMs, frac, langHe, city, name }: Props) {
  const ms = Math.max(400, Math.min(20000, Math.round(etaMs)));
  const p = Math.max(0, Math.min(1, frac));
  const remain = p >= 0.18 ? Math.max(0, (ms * (1 - p)) / 1000) : null;
  const stuck = p > 0 && p < 0.18;

  return (
    <div
      className="absolute inset-0 z-50 flex items-center justify-center bg-bg p-6 text-fg"
      data-boot-overlay="1"
      data-boot-eta={ms}
      data-boot-frac={p.toFixed(2)}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="w-full max-w-md">
        <p className="text-xs font-medium uppercase tracking-widest text-muted">{city}</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight">{langHe ? "טוען מסלול" : "Loading track"}</h2>
        <p className="mt-1 text-sm text-muted">{name}</p>

        <p className="mt-8 text-center text-3xl font-semibold tabular-nums tracking-tight">
          {remain == null || stuck
            ? langHe
              ? "טוען…"
              : "Loading…"
            : langHe
              ? `עוד ${remain.toFixed(1)} שניות`
              : `${remain.toFixed(1)}s remaining`}
        </p>

        <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-surface-2">
          <div className="h-full rounded-full bg-accent" style={{ width: `${Math.max(4, p * 100)}%` }} />
        </div>
        <p className="mt-3 text-center text-xs font-medium uppercase tracking-widest text-subtle">
          {langHe ? "זמן שנותר עד הזינוק" : "Time left until start"}
        </p>
      </div>
    </div>
  );
}
