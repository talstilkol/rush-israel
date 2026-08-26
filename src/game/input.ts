import { clamp } from "./math";
import type { InputState } from "./types";
import { padCurve } from "./input-curve";

export { padCurve };
export class GameInput {
  keys = new Set<string>();
  touchSteer = 0;
  touchThrottle = 0;
  touchBrake = 0;
  touchDrift = false;
  touchNitro = false;
  touchRewind = false;
  steerOverride: number | null = null;
  throttleOverride: number | null = null;
  brakeOverride: number | null = null;
  paused = false;
  private steerFilt = 0;
  private thrFilt = 0;
  private lastPoll = 0;
  private canvas: HTMLElement;
  private unbind: (() => void)[] = [];

  constructor(target: HTMLElement) {
    this.canvas = target;
    const down = (e: KeyboardEvent) => {
      this.keys.add(e.code);
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"].includes(e.code)) {
        e.preventDefault();
      }
    };
    const up = (e: KeyboardEvent) => {
      this.keys.delete(e.code);
    };
    const blur = () => this.keys.clear();
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    window.addEventListener("blur", blur);
    document.addEventListener("visibilitychange", blur);
    this.unbind.push(() => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      window.removeEventListener("blur", blur);
      document.removeEventListener("visibilitychange", blur);
    });
  }

  setTouch(partial: { steer?: number; throttle?: number; brake?: number; drift?: boolean; nitro?: boolean; rewind?: boolean }) {
    if (partial.steer !== undefined) this.touchSteer = clamp(partial.steer, -1, 1);
    if (partial.throttle !== undefined) this.touchThrottle = clamp(partial.throttle, 0, 1);
    if (partial.brake !== undefined) this.touchBrake = clamp(partial.brake, 0, 1);
    if (partial.drift !== undefined) this.touchDrift = partial.drift;
    if (partial.nitro !== undefined) this.touchNitro = partial.nitro;
    if (partial.rewind !== undefined) this.touchRewind = partial.rewind;
  }

  poll(): InputState {
    let steer = 0;
    if (this.keys.has("KeyA") || this.keys.has("ArrowLeft")) steer += 1;
    if (this.keys.has("KeyD") || this.keys.has("ArrowRight")) steer -= 1;
    steer += this.touchSteer;

    let throttle = this.touchThrottle;
    let brake = this.touchBrake;
    if (this.keys.has("KeyW") || this.keys.has("ArrowUp")) throttle = 1;
    if (this.keys.has("KeyS") || this.keys.has("ArrowDown")) brake = 1;

    const pads = typeof navigator !== "undefined" ? navigator.getGamepads?.() : null;
    const gp = pads?.[0];
    if (gp) {
      steer -= padCurve(gp.axes[0] ?? 0);
      const ay = gp.axes[1] ?? 0;
      if (ay < -0.12) throttle = Math.max(throttle, padCurve(-ay));
      const rt = gp.buttons[7]?.value ?? 0;
      const lt = gp.buttons[6]?.value ?? 0;
      if (rt > 0.05) throttle = Math.max(throttle, rt);
      if (lt > 0.05) brake = Math.max(brake, lt);
    }

    if (this.steerOverride !== null) steer = this.steerOverride;
    if (this.throttleOverride !== null) throttle = this.throttleOverride;
    if (this.brakeOverride !== null) brake = this.brakeOverride;

    const now = typeof performance !== "undefined" ? performance.now() : 0;
    const dt = this.lastPoll ? Math.min(0.05, (now - this.lastPoll) / 1000) : 0.016;
    this.lastPoll = now;
    if (this.steerOverride !== null) this.steerFilt = steer;
    else {
      const k = Math.abs(steer) < 0.05 ? 11 : 6.5;
      this.steerFilt += (steer - this.steerFilt) * Math.min(1, k * dt);
      if (Math.abs(this.steerFilt) < 0.01) this.steerFilt = 0;
      steer = this.steerFilt;
    }
    if (this.throttleOverride !== null) this.thrFilt = throttle;
    else {
      const k = throttle > this.thrFilt ? 5.5 : 8;
      this.thrFilt += (throttle - this.thrFilt) * Math.min(1, k * dt);
      throttle = this.thrFilt;
    }

    const drift =
      this.touchDrift ||
      this.keys.has("Space") ||
      this.keys.has("ShiftLeft") ||
      this.keys.has("ShiftRight") ||
      !!gp?.buttons[4]?.pressed ||
      !!gp?.buttons[5]?.pressed;

    const nitro =
      this.touchNitro ||
      this.keys.has("KeyE") ||
      this.keys.has("KeyQ") ||
      !!gp?.buttons[0]?.pressed ||
      !!gp?.buttons[1]?.pressed;

    return {
      steer: clamp(steer, -1, 1),
      throttle: clamp(throttle, 0, 1),
      brake: clamp(brake, 0, 1),
      drift,
      nitro,
    };
  }

  wantsPause() {
    return this.keys.has("Escape") || this.keys.has("KeyP");
  }

  wantsRewind() {
    const gp = typeof navigator !== "undefined" ? navigator.getGamepads?.()?.[0] : null;
    return this.touchRewind || this.keys.has("KeyR") || !!gp?.buttons[2]?.pressed;
  }

  dispose() {
    for (const u of this.unbind) u();
    this.unbind = [];
    this.keys.clear();
  }
}
