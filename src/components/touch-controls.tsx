import type { RaceEngine } from "@/game/engine";

type Props = {
  engine: RaceEngine | null;
  langHe: boolean;
};

export function TouchControls({ engine, langHe }: Props) {
  const t = (he: string, en: string) => (langHe ? he : en);
  const setPadFromEvent = (el: HTMLDivElement, clientX: number, clientY: number) => {
    const r = el.getBoundingClientRect();
    const x = (clientX - r.left) / r.width;
    const y = (clientY - r.top) / r.height;
    const steer = (0.5 - x) * 2;
    const vert = 1 - y * 2;
    engine?.setTouch({
      steer,
      throttle: vert > 0.08 ? vert : 0,
      brake: vert < -0.08 ? -vert : 0,
    });
  };

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex items-end justify-between gap-4 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] md:hidden">
      <div
        className="pointer-events-auto h-28 w-40 rounded-xl border border-border bg-surface/80"
        onPointerDown={(e) => {
          (e.target as HTMLElement).setPointerCapture(e.pointerId);
          setPadFromEvent(e.currentTarget, e.clientX, e.clientY);
        }}
        onPointerMove={(e) => {
          if (e.buttons) setPadFromEvent(e.currentTarget, e.clientX, e.clientY);
        }}
        onPointerUp={() => engine?.setTouch({ steer: 0, throttle: 0, brake: 0 })}
        onPointerCancel={() => engine?.setTouch({ steer: 0, throttle: 0, brake: 0 })}
      >
        <div className="flex h-full items-center justify-center text-xs font-medium text-muted">{t("הגה · גז", "Steer · gas")}</div>
      </div>
      <div className="pointer-events-auto flex gap-2">
        <button
          type="button"
          className="min-h-14 min-w-16 rounded-lg border border-border bg-surface/80 px-3 text-sm font-medium text-fg"
          onPointerDown={() => engine?.setTouch({ rewind: true })}
          onPointerUp={() => engine?.setTouch({ rewind: false })}
          onPointerCancel={() => engine?.setTouch({ rewind: false })}
        >
          {t("ריוויינד", "Rewind")}
        </button>
        <button
          type="button"
          className="min-h-14 min-w-16 rounded-lg border border-border bg-surface/80 px-3 text-sm font-medium text-fg"
          onPointerDown={() => engine?.setTouch({ brake: 1 })}
          onPointerUp={() => engine?.setTouch({ brake: 0 })}
          onPointerCancel={() => engine?.setTouch({ brake: 0 })}
        >
          {t("בלם", "Brake")}
        </button>
        <button
          type="button"
          className="min-h-14 min-w-16 rounded-lg border border-border bg-surface/80 px-3 text-sm font-medium text-fg"
          onPointerDown={() => engine?.setTouch({ drift: true })}
          onPointerUp={() => engine?.setTouch({ drift: false })}
          onPointerCancel={() => engine?.setTouch({ drift: false })}
        >
          {t("דריפט", "Drift")}
        </button>
        <button
          type="button"
          className="min-h-14 min-w-16 rounded-lg border border-accent/50 bg-surface/80 px-3 text-sm font-medium text-accent"
          onPointerDown={() => engine?.setTouch({ nitro: true })}
          onPointerUp={() => engine?.setTouch({ nitro: false })}
          onPointerCancel={() => engine?.setTouch({ nitro: false })}
        >
          {t("ניטרו", "Nitro")}
        </button>
        <button
          type="button"
          className="min-h-20 min-w-20 rounded-lg bg-fg px-4 text-sm font-medium text-bg"
          onPointerDown={() => engine?.setTouch({ throttle: 1 })}
          onPointerUp={() => engine?.setTouch({ throttle: 0 })}
          onPointerCancel={() => engine?.setTouch({ throttle: 0 })}
        >
          {t("גז", "Gas")}
        </button>
      </div>
    </div>
  );
}
