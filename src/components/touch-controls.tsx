import { useEffect } from "react";
import type { PointerEvent } from "react";
import type { RaceEngine } from "@/game/engine";

type Props = {
  engine: RaceEngine | null;
  langHe: boolean;
};

function hold(e: PointerEvent<HTMLButtonElement>, down: () => void, up: () => void) {
  e.preventDefault();
  const el = e.currentTarget;
  el.setPointerCapture(e.pointerId);
  down();
  const end = () => up();
  el.addEventListener("pointerup", end, { once: true });
  el.addEventListener("pointercancel", end, { once: true });
  el.addEventListener("lostpointercapture", end, { once: true });
}

export function TouchControls({ engine, langHe }: Props) {
  const t = (he: string, en: string) => (langHe ? he : en);
  useEffect(() => {
    const clear = () => engine?.setTouch({ steer: 0, throttle: 0, brake: 0, drift: false, nitro: false, rewind: false });
    window.addEventListener("blur", clear);
    document.addEventListener("visibilitychange", clear);
    return () => {
      window.removeEventListener("blur", clear);
      document.removeEventListener("visibilitychange", clear);
    };
  }, [engine]);
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
  const btn = "min-h-11 rounded-lg border border-border bg-surface/80 px-1 text-[11px] font-medium text-fg";

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex items-end justify-between gap-2 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:hidden">
      <div
        className="pointer-events-auto h-32 w-28 shrink-0 rounded-xl border border-border bg-surface/80"
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          setPadFromEvent(e.currentTarget, e.clientX, e.clientY);
        }}
        onPointerMove={(e) => {
          if (e.currentTarget.hasPointerCapture(e.pointerId)) setPadFromEvent(e.currentTarget, e.clientX, e.clientY);
        }}
        onPointerUp={() => engine?.setTouch({ steer: 0, throttle: 0, brake: 0 })}
        onPointerCancel={() => engine?.setTouch({ steer: 0, throttle: 0, brake: 0 })}
        onLostPointerCapture={() => engine?.setTouch({ steer: 0, throttle: 0, brake: 0 })}
      >
        <div className="flex h-full items-center justify-center text-xs font-medium text-muted">{t("הגה · גז", "Steer · gas")}</div>
      </div>
      <div className="pointer-events-auto grid w-[min(16.5rem,calc(100%-8rem))] grid-cols-4 gap-1.5">
        <button type="button" className={btn} onPointerDown={(e) => hold(e, () => engine?.cycleCam(), () => {})}>{t("מצלמה", "Cam")}</button>
        <button type="button" className={btn} onPointerDown={(e) => hold(e, () => engine?.setTouch({ brake: 1 }), () => engine?.setTouch({ brake: 0 }))}>{t("בלם", "Brake")}</button>
        <button type="button" className={btn} onPointerDown={(e) => hold(e, () => engine?.setTouch({ drift: true }), () => engine?.setTouch({ drift: false }))}>{t("דריפט", "Drift")}</button>
        <button type="button" className={btn} onPointerDown={(e) => hold(e, () => engine?.horn(), () => {})}>{t("צופר", "Horn")}</button>
        <button type="button" className={btn} onPointerDown={(e) => hold(e, () => engine?.rescue(), () => {})}>{t("כביש", "Reset")}</button>
        <button type="button" className={btn} onPointerDown={(e) => hold(e, () => engine?.setTouch({ rewind: true }), () => engine?.setTouch({ rewind: false }))}>{t("אחורה", "Rewind")}</button>
        <button type="button" className={`${btn} border-accent/50 text-accent`} onPointerDown={(e) => hold(e, () => engine?.setTouch({ nitro: true }), () => engine?.setTouch({ nitro: false }))}>{t("ניטרו", "Nitro")}</button>
        <button type="button" className="min-h-11 rounded-lg bg-fg px-1 text-[11px] font-medium text-bg" onPointerDown={(e) => hold(e, () => engine?.setTouch({ throttle: 1 }), () => engine?.setTouch({ throttle: 0 }))}>{t("גז", "Gas")}</button>
      </div>
    </div>
  );
}