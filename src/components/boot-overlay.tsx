import type { CSSProperties } from "react";

type Props = {
  etaMs: number;
  langHe: boolean;
  city: string;
  name: string;
};

function labelsFor(etaMs: number, langHe: boolean) {
  const n = Math.max(1, Math.round(etaMs / 100));
  const out: string[] = [];
  for (let i = 0; i < n; i++) {
    const sec = Math.max(0.1, (etaMs - (i * etaMs) / n) / 1000);
    out.push(langHe ? `עוד ${sec.toFixed(1)} שניות` : `${sec.toFixed(1)}s remaining`);
  }
  out.push(langHe ? "כמעט מוכן" : "Almost ready");
  return { labels: out, steps: n };
}

export function BootOverlay({ etaMs, langHe, city, name }: Props) {
  const ms = Math.max(400, Math.min(20000, Math.round(etaMs)));
  const { labels, steps } = labelsFor(ms, langHe);
  const style = {
    "--boot-eta-ms": `${ms}ms`,
    "--boot-steps": String(steps),
  } as CSSProperties;

  return (
    <div
      className="absolute inset-0 z-50 flex items-center justify-center bg-bg p-6 text-fg"
      data-boot-overlay="1"
      data-boot-eta={ms}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="w-full max-w-md" style={style}>
        <p className="text-xs font-medium uppercase tracking-widest text-muted">{city}</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight">{langHe ? "טוען מסלול" : "Loading track"}</h2>
        <p className="mt-1 text-sm text-muted">{name}</p>

        <p className="boot-eta-static mt-8 text-center text-3xl font-semibold tabular-nums tracking-tight">
          {langHe ? `עוד ${(ms / 1000).toFixed(1)} שניות` : `${(ms / 1000).toFixed(1)}s remaining`}
        </p>
        <div className="boot-eta-viewport mt-8 text-center">
          <div
            className="boot-eta-strip"
            style={{
              animationDuration: `${ms}ms`,
              animationTimingFunction: `steps(${steps}, end)`,
            }}
          >
            {labels.map((label, i) => (
              <span key={i} className="boot-eta-line">
                {label}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-surface-2">
          <div className="boot-bar-fill h-full rounded-full bg-accent" style={{ animationDuration: `${ms}ms` }} />
        </div>
        <p className="mt-3 text-center text-xs font-medium uppercase tracking-widest text-subtle">
          {langHe ? "זמן שנותר עד הזינוק" : "Time left until start"}
        </p>
      </div>
    </div>
  );
}
