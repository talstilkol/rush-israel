/** Canonical Version 1 audio, HUD, keyboard, touch and gamepad lock (RSH-034). */

export const AUDIO_HUD_INPUT_GIS_CLAIM = false;
export const AUDIO_HUD_INPUT_OWNER_FREEZE = false;
export const AUDIO_HUD_INPUT_PUBLIC_DISTRIBUTION = false;
export const AUDIO_BACKEND = "oscillator" as const;
export const AUDIO_FMOD = false;
export const AUDIO_HOWLER = false;
export const AUDIO_STREAMING_MUSIC = false;
export const AUDIO_MUTE = "esc_settings" as const;
export const RADIO_COUNT = 4;
export const RADIO_STATIONS = [
  { id: 0, he: "פאלס 101", en: "Pulse 101" },
  { id: 1, he: "גל ים", en: "Yam FM" },
  { id: 2, he: "המחתרת", en: "Underground" },
  { id: 3, he: "לילה לבן", en: "White Night" },
] as const;
export const RADIO_BPM = [126, 94, 138, 108] as const;

export const KEYBOARD_STEER_LEFT = ["KeyA", "ArrowLeft"] as const;
export const KEYBOARD_STEER_RIGHT = ["KeyD", "ArrowRight"] as const;
export const KEYBOARD_STEER_LEFT_SIGN = 1;
export const KEYBOARD_STEER_RIGHT_SIGN = -1;
export const KEYBOARD_THROTTLE = ["KeyW", "ArrowUp"] as const;
export const KEYBOARD_BRAKE = ["KeyS", "ArrowDown"] as const;
export const KEYBOARD_DRIFT = ["Space", "ShiftLeft", "ShiftRight"] as const;
export const KEYBOARD_NITRO = ["KeyE", "KeyQ"] as const;
export const KEYBOARD_PAUSE = ["Escape", "KeyP"] as const;
export const KEYBOARD_REWIND = ["KeyR"] as const;

export const GAMEPAD_INDEX = 0;
export const GAMEPAD_STEER_AXIS = 0;
export const GAMEPAD_STEER_INVERTED = true;
export const GAMEPAD_THROTTLE_AXIS = 1;
export const GAMEPAD_THROTTLE_AXIS_THRESHOLD = -0.12;
export const GAMEPAD_THROTTLE_BUTTON = 7;
export const GAMEPAD_BRAKE_BUTTON = 6;
export const GAMEPAD_DRIFT_BUTTONS = [4, 5] as const;
export const GAMEPAD_NITRO_BUTTONS = [0, 1] as const;
export const GAMEPAD_REWIND_BUTTON = 2;
export const GAMEPAD_FFB = false;
export const PAD_CURVE_DEADZONE = 0.12;
export const PAD_CURVE_EXPONENT = 1.6;

export const TOUCH_VISIBLE = "md:hidden" as const;
export const TOUCH_PAD = "steer_throttle_brake" as const;
export const TOUCH_BUTTONS = ["rewind", "brake", "drift", "nitro", "gas"] as const;

export const HUD_SPEED_UNIT = "km/h" as const;
export const HUD_SPEED_SCALE = 3.6;
export const HUD_SPEED_DISPLAY = "Math.round(hud.speedKmh)" as const;
export const HUD_QA_QUERY = "qa=1" as const;
export const HUD_QA_FIELDS = ["backend", "p95", "dc", "tri", "geometries", "textures", "kinMix"] as const;
export const HUD_PHOTO_WATERMARK = true;
export const HUD_WRONG_WAY = true;
export const HUD_REWIND_BANNER = true;

export const CARS_SOURCE_REWRITTEN = false;
export const PACKAGE_JSON_CHANGED = false;
export const PHYSICS_SOURCE_REWRITTEN = false;

export function canonicalAudioDigest() {
  return [
    "backend=oscillator",
    "radio=4:Pulse 101,Yam FM,Underground,White Night",
    "bpm=126,94,138,108",
    "fmod=false",
    "howler=false",
    "streaming=false",
    "mute=esc_settings",
  ].join("\n") + "\n";
}

export function canonicalInputDigest() {
  return [
    "steer_left=KeyA,ArrowLeft:+1",
    "steer_right=KeyD,ArrowRight:-1",
    "throttle=KeyW,ArrowUp",
    "brake=KeyS,ArrowDown",
    "drift=Space,ShiftLeft,ShiftRight",
    "nitro=KeyE,KeyQ",
    "pause=Escape,KeyP",
    "rewind=KeyR",
    "pad_index=0",
    "pad_steer=axes[0] inverted padCurve",
    "pad_curve=dead 0.12 exp 1.6",
    "pad_throttle=axes[1]<-0.12 or buttons[7]",
    "pad_brake=buttons[6]",
    "pad_drift=buttons[4]|buttons[5]",
    "pad_nitro=buttons[0]|buttons[1]",
    "pad_rewind=buttons[2]",
    "ffb=false",
    "touch_visible=md:hidden",
    "touch_pad=steer_throttle_brake",
    "touch_buttons=rewind,brake,drift,nitro,gas",
  ].join("\n") + "\n";
}

export function canonicalHudDigest() {
  return [
    "speed_unit=km/h",
    "speed_scale=3.6",
    "speed_display=Math.round(hud.speedKmh)",
    "qa=qa=1 backend p95 dc tri g t kin",
    "photo=true",
    "wrong_way=true",
    "rewind_banner=true",
    "gis=false",
    "owner_freeze=false",
    "public_distribution=false",
  ].join("\n") + "\n";
}
