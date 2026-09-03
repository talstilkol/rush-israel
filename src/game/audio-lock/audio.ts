/** Canonical Version 1 audio / HUD / input lock (RSH-034). */

export const AUDIO_HUD_GIS_CLAIM = false;
export const AUDIO_HUD_OWNER_FREEZE = false;
export const AUDIO_HUD_PUBLIC_DISTRIBUTION = false;
export const AUDIO_RUNTIME_REWRITTEN = false;
export const INPUT_RUNTIME_REWRITTEN = false;
export const HUD_RUNTIME_REWRITTEN = false;
export const TOUCH_RUNTIME_REWRITTEN = false;
export const PACKAGE_JSON_CHANGED = false;

export const AUDIO_LOCK_BACKEND = "oscillator" as const;
export const AUDIO_LOCK_MASTER_GAIN = 0.55;
export const AUDIO_LOCK_SFX_GAIN = 0.7;
export const AUDIO_LOCK_MUSIC_GAIN = 0.22;
export const AUDIO_LOCK_ENGINE_SAW_HZ = 70;
export const AUDIO_LOCK_ENGINE_TRI_HZ = 90;
export const AUDIO_LOCK_ENGINE_LP_HZ = 420;
export const AUDIO_LOCK_SIREN_HZ = 740;
export const AUDIO_LOCK_DRIFT_BP_HZ = 900;
export const AUDIO_LOCK_RAIN_HP_HZ = 1400;
export const AUDIO_LOCK_RADIO_TOAST_S = 2.6;
export const AUDIO_LOCK_STATION_BPM = [126, 94, 138, 108] as const;
export const AUDIO_LOCK_RADIO = [
  { id: 0, he: "פאלס 101", en: "Pulse 101" },
  { id: 1, he: "גל ים", en: "Yam FM" },
  { id: 2, he: "המחתרת", en: "Underground" },
  { id: 3, he: "לילה לבן", en: "White Night" },
] as const;

export const PAD_DEADZONE = 0.12;
export const PAD_EXPONENT = 1.6;
export const STEER_FILT_NEAR = 11;
export const STEER_FILT_MOVE = 6.5;
export const THR_FILT_RISE = 5.5;
export const THR_FILT_FALL = 8;
export const GAMEPAD_AXIS_STEER = 0;
export const GAMEPAD_AXIS_THROTTLE = 1;
export const GAMEPAD_AXIS_THROTTLE_GATE = -0.12;
export const GAMEPAD_BTN_RT = 7;
export const GAMEPAD_BTN_LT = 6;
export const GAMEPAD_BTN_DRIFT = [4, 5] as const;
export const GAMEPAD_BTN_NITRO = [0, 1] as const;
export const GAMEPAD_BTN_REWIND = 2;

export const KEY_STEER_LEFT = ["KeyA", "ArrowLeft"] as const;
export const KEY_STEER_RIGHT = ["KeyD", "ArrowRight"] as const;
export const KEY_THROTTLE = ["KeyW", "ArrowUp"] as const;
export const KEY_BRAKE = ["KeyS", "ArrowDown"] as const;
export const KEY_DRIFT = ["Space", "ShiftLeft", "ShiftRight"] as const;
export const KEY_NITRO = ["KeyE", "KeyQ"] as const;
export const KEY_REWIND = ["KeyR"] as const;
export const KEY_PAUSE = ["Escape", "KeyP"] as const;

export const HUD_SPEED_UNIT_EN = "km/h";
export const HUD_SPEED_UNIT_HE = "קמ״ש";
export const HUD_SURFACES = [
  "photo",
  "qa",
  "mode_or_lap",
  "pause",
  "wrong_way",
  "off_track",
  "wanted",
  "rewind",
  "replay",
  "street_poi",
  "speed",
] as const;

export const TOUCH_BREAKPOINT = "md:hidden";
export const TOUCH_PAD_SIZE = "h-28 w-40";
export const TOUCH_BUTTONS = ["rewind", "brake", "drift", "nitro", "gas"] as const;

export function canonicalAudioDigest() {
  return [
    `backend=${AUDIO_LOCK_BACKEND}`,
    "stations=Pulse 101,Yam FM,Underground,White Night",
    `bpm=${AUDIO_LOCK_STATION_BPM.join(",")}`,
    `master=${AUDIO_LOCK_MASTER_GAIN}`,
    `sfx=${AUDIO_LOCK_SFX_GAIN}`,
    `music=${AUDIO_LOCK_MUSIC_GAIN}`,
    `engine=${AUDIO_LOCK_ENGINE_SAW_HZ}/${AUDIO_LOCK_ENGINE_TRI_HZ}/${AUDIO_LOCK_ENGINE_LP_HZ}`,
    `siren=${AUDIO_LOCK_SIREN_HZ}`,
    `drift_bp=${AUDIO_LOCK_DRIFT_BP_HZ}`,
    `rain_hp=${AUDIO_LOCK_RAIN_HP_HZ}`,
    `radio_toast=${AUDIO_LOCK_RADIO_TOAST_S}`,
  ].join("\n") + "\n";
}

export function canonicalInputDigest() {
  return [
    `pad=${PAD_DEADZONE}/${PAD_EXPONENT}`,
    `steer_filt=${STEER_FILT_NEAR}/${STEER_FILT_MOVE}`,
    `thr_filt=${THR_FILT_RISE}/${THR_FILT_FALL}`,
    "keys=WASD+arrows Space/Shift drift E/Q nitro R rewind Esc/P pause",
    "gp=axis0 steer, axis1<-0.12 throttle, RT7 throttle, LT6 brake, btn4/5 drift, btn0/1 nitro, btn2 rewind",
    "ffb=false",
  ].join("\n") + "\n";
}

export function canonicalHudDigest() {
  return [
    `speed_unit=${HUD_SPEED_UNIT_EN}`,
    `surfaces=${HUD_SURFACES.join(",")}`,
    `touch=${TOUCH_BREAKPOINT}`,
    `touch_pad=${TOUCH_PAD_SIZE}`,
    `touch_buttons=${TOUCH_BUTTONS.join(",")}`,
    "hud_expanded=false",
  ].join("\n") + "\n";
}
