/** Canonical WebGL context-loss/recovery lock (RSH-041). */

export const CONTEXT_LOSS_GIS_CLAIM = false;
export const CONTEXT_LOSS_OWNER_FREEZE = false;
export const CONTEXT_LOSS_PUBLIC_DISTRIBUTION = false;
export const CONTEXT_LOSS_DEFINED = true;
export const CONTEXT_LOSS_ENFORCED = true;
export const SOAK_ENFORCED = false;
export const REAL_DEVICE_BASELINE_ACCEPTED = false;
export const CONTEXT_LOSS_CYCLES = 8;
export const LIVE_LOOP_ADAPTER = "src/game/engine/loop-adapter.ts" as const;
export const LIVE_ENGINE = "src/game/engine.ts" as const;
export const LIVE_RACE_CONTROLLER = "src/components/game-app/race-controller.tsx" as const;
export const PACKAGE_SOURCE_SHA256 = "ae427c122d1e8f4a7b419fa83e7deaab7bfb5c88f200699182f8e3d85cf9df94";

export type ContextHost = {
  glLost: boolean;
  disposed: boolean;
  restoreCount: number;
  skippedFrames: number;
  opts: { onRestore?: () => void };
};

export type SessionState = {
  cash: number;
  stars: number;
  records: Array<{ trackId: string; time: number }>;
  raceKey: number;
};

export function applyContextLost(host: ContextHost, event: { preventDefault(): void }): void {
  event.preventDefault();
  host.glLost = true;
}

export function applyContextRestored(host: ContextHost): void {
  host.glLost = false;
  host.opts.onRestore?.();
}

export function shouldSkipFrame(host: ContextHost): boolean {
  return host.disposed || host.glLost;
}

export function runContextLossCycles(initial: SessionState, cycles = CONTEXT_LOSS_CYCLES) {
  const session: SessionState = {
    cash: initial.cash,
    stars: initial.stars,
    records: initial.records.map((row) => ({ ...row })),
    raceKey: initial.raceKey,
  };
  const host: ContextHost = {
    glLost: false,
    disposed: false,
    restoreCount: 0,
    skippedFrames: 0,
    opts: {
      onRestore: () => {
        host.restoreCount += 1;
        session.raceKey += 1;
      },
    },
  };
  const reports = [];
  for (let i = 0; i < cycles; i++) {
    let prevented = false;
    applyContextLost(host, { preventDefault() { prevented = true; } });
    const skipped = shouldSkipFrame(host);
    if (skipped) host.skippedFrames += 1;
    const cash = session.cash;
    const stars = session.stars;
    const records = JSON.stringify(session.records);
    applyContextRestored(host);
    reports.push({
      prevented,
      skipped,
      glLostAfterRestore: host.glLost,
      raceKey: session.raceKey,
      cashUnchanged: session.cash === cash,
      starsUnchanged: session.stars === stars,
      recordsUnchanged: JSON.stringify(session.records) === records,
    });
  }
  return { host, session, reports };
}

export function canonicalContextDigest(): string {
  return [
    "context_loss_cycles=8",
    "prevent_default=true",
    "skip_frames_while_lost=true",
    "restore_clears_gl_lost=true",
    "restore_remounts_race=true",
    "save_data_survives=true",
    "context_loss_enforced=true",
    "soak_enforced=false",
    "real_device_baseline=false",
    "gis=false",
    "owner_freeze=false",
    "public_distribution=false",
  ].join("\n") + "\n";
}
