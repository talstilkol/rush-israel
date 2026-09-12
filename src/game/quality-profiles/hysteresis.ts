/** Canonical dynamic-quality hysteresis (RSH-038). */

export type HysteresisState = {
  step: number;
  over: number;
  cool: number;
};

export function createHysteresisState(): HysteresisState {
  return { step: 0, over: 0, cool: 0 };
}

export function gfxPassFlags(step: number) {
  const s = Math.max(0, step);
  return {
    planar: s < 1,
    bloom: s < 2,
    csm: s < 3,
    pixelExtra: Math.max(0, s - 3),
  };
}

export function noteHysteresis(state: HysteresisState, p95: number, dt: number): "drop" | "raise" | null {
  if (p95 > 20) {
    state.over++;
    state.cool = 0;
    if (state.over >= 90 && state.step < 8) {
      state.step++;
      state.over = 0;
      return "drop";
    }
    return null;
  }
  state.over = 0;
  if (p95 < 16) {
    state.cool += dt;
    if (state.cool >= 5 && state.step > 0) {
      state.step--;
      state.cool = 0;
      return "raise";
    }
  } else state.cool = 0;
  return null;
}

export function resetHysteresis(state: HysteresisState): void {
  state.step = 0;
  state.over = 0;
  state.cool = 0;
}
