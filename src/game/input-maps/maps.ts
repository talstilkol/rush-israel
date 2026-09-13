/** Canonical RSH-044 Unify keyboard, touch and gamepad input maps lock. Honest: no GIS, no public distribution, no RTL-scope (RSH-045). */
export const UNIT_ID = "RSH-044" as const;
export const LOCK_DEFINED = true;
export const GIS_CLAIM = false;
export const OWNER_FREEZE = false;
export const PUBLIC_DISTRIBUTION = false;
export const PACKAGE_SOURCE_SHA256 = "ae427c122d1e8f4a7b419fa83e7deaab7bfb5c88f200699182f8e3d85cf9df94";
export const INPUT_MAPS_UNIFIED = true;
export const TOUCH_ACTION = "none" as const;
export const TOUCH_ACTION_LOCKED = true;
export const CANVAS_TOUCH_NONE = true;
export const POINTER_CANCEL_LOCKED = true;
export const RTL_SCOPE_COMPLETE = false;
export const UNIFIED_ACTION_COUNT = 7;
export const PAUSE_KEYBOARD_ONLY = true;
export const UNIFIED_ACTIONS = [
  "steer",
  "throttle",
  "brake",
  "drift",
  "nitro",
  "pause",
  "rewind",
] as const;

export const KEYBOARD_MAP = {
  steer_left: { codes: ["KeyA", "ArrowLeft"], sign: 1 },
  steer_right: { codes: ["KeyD", "ArrowRight"], sign: -1 },
  throttle: { codes: ["KeyW", "ArrowUp"] },
  brake: { codes: ["KeyS", "ArrowDown"] },
  drift: { codes: ["Space", "ShiftLeft", "ShiftRight"] },
  nitro: { codes: ["KeyE", "KeyQ"] },
  pause: { codes: ["Escape", "KeyP"] },
  rewind: { codes: ["KeyR"] },
} as const;

export const GAMEPAD_MAP = {
  index: 0,
  steer_axis: 0,
  steer_inverted: true,
  throttle_axis: 1,
  throttle_axis_threshold: -0.12,
  throttle_button: 7,
  brake_button: 6,
  drift_buttons: [4, 5] as const,
  nitro_buttons: [0, 1] as const,
  rewind_button: 2,
  pause: false,
  ffb: false,
  pad_curve_deadzone: 0.12,
  pad_curve_exponent: 1.6,
} as const;

export const TOUCH_MAP = {
  visible: "md:hidden",
  pad: "steer_throttle_brake",
  buttons: ["rewind", "brake", "drift", "nitro", "gas"] as const,
  pause: false,
  pointer_cancel: true,
  canvas_touch_none: true,
  touch_action: "none",
} as const;

export type LockReport = { claimedRtlComplete?: boolean; claimedUniversalPause?: boolean };

export function evaluateLock(report: LockReport = {}) {
  return {
    defined: LOCK_DEFINED,
    unified: INPUT_MAPS_UNIFIED,
    touchAction: TOUCH_ACTION,
    claimedRtlComplete: Boolean(report.claimedRtlComplete),
    acceptedAsRtlComplete: false,
    claimedUniversalPause: Boolean(report.claimedUniversalPause),
    acceptedAsUniversalPause: false,
    pauseKeyboardOnly: PAUSE_KEYBOARD_ONLY,
    publicDistribution: PUBLIC_DISTRIBUTION,
    gisClaim: GIS_CLAIM,
  };
}

export function canonicalDigest(): string {
  return [
    "input_maps_unified=true",
    "touch_action=none",
    "canvas_touch_none=true",
    "pointer_cancel_locked=true",
    "unified_action_count=7",
    "pause_keyboard_only=true",
    "rtl_scope_complete=false",
    "gis=false",
    "owner_freeze=false",
    "public_distribution=false",
  ].join("\n") + "\n";
}
