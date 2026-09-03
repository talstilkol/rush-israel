/** Canonical Version 1 night lighting, headlights and weather lock (RSH-032). */

export const NIGHT_HDRI = false;
export const NIGHT_REAL_SKY_IBL = false;
export const NIGHT_GIS_CLAIM = false;
export const NIGHT_OWNER_FREEZE = false;
export const NIGHT_DEFAULT_BOOT = false;
export const WEATHER_DEFAULT_BOOT = "clear" as const;

export const NIGHT_LOOK_ID = "night" as const;
export const NIGHT_EXPOSURE = 1.22;
export const NIGHT_WETNESS = 0.22;
export const NIGHT_AMOUNT = 1;
export const NIGHT_VIS = 0.9;

export const NIGHTRAIN_LOOK_ID = "nightrain" as const;
export const NIGHTRAIN_EXPOSURE = 1.18;
export const NIGHTRAIN_WETNESS = 0.7;
export const NIGHTRAIN_AMOUNT = 1;
export const NIGHTRAIN_VIS = 0.76;

export const RAIN_LOOK_ID = "rain" as const;
export const RAIN_EXPOSURE = 0.58;
export const RAIN_WETNESS = 1;
export const RAIN_AMOUNT = 0.08;
export const RAIN_VIS = 0.55;

export const NIGHT_HEMI_COLOR = 0x6a88b0;
export const NIGHT_HEMI_GROUND = 0x2a241c;
export const NIGHT_HEMI_INTENSITY = 0.52;
export const NIGHT_DIR_COLOR = 0xc8d4e8;
export const NIGHT_DIR_INTENSITY = 0.38;
export const NIGHT_FILL_COLOR = 0xffc070;
export const NIGHT_FILL_INTENSITY = 0.48;
export const NIGHT_AMBIENT_COLOR = 0x4a6080;
export const NIGHT_AMBIENT_INTENSITY = 0.28;
export const NIGHT_ENV_INTENSITY_BOOT = 0.42;
export const NIGHT_ENV_INTENSITY_UPGRADE = 0.52;
export const NIGHT_FOG_CITY = 0.000045;
export const NIGHT_FOG_FAR = 10000;
export const NIGHT_FOG_COLOR = 0x2a4058;
export const NIGHT_BACKGROUND = 0x182436;
export const NIGHT_CLOCK = 0.92;

export const SKY_NIGHT_ASSET = "/game/sky-night.png";
export const SKY_NIGHT_WIDTH = 1024;
export const SKY_NIGHT_HEIGHT = 512;
export const SKY_MAPPING = "EquirectangularReflectionMapping";
export const SKY_COLOR_SPACE = "SRGBColorSpace";
export const SKY_ANISOTROPY = 4;
export const SKY_NIGHT_STARS = 80;
export const SKY_NIGHT_ZENITH = [10, 20, 36] as const;
export const SKY_NIGHT_MID = [21, 32, 48] as const;
export const SKY_NIGHT_HORIZON = [28, 44, 64] as const;
export const SKY_NIGHT_PNG_SHA256 = "3868cec9a4c9027f2acbc7bd9da2b59d518bf2e7e3617630d7ab5e56049ccdb9";

export const IBL_NIGHT_KIND = "tiny_pmrem";
export const IBL_NIGHT_BACKGROUND = 0x182436;
export const IBL_NIGHT_HEMI_SKY = 0x4a6080;
export const IBL_NIGHT_HEMI_GROUND = 0x1a1410;
export const IBL_NIGHT_HEMI_INTENSITY = 0.55;
export const IBL_NIGHT_SUN_COLOR = 0xa8c0e0;
export const IBL_NIGHT_SUN_INTENSITY = 0.32;
export const IBL_NIGHT_SUN_POSITION = [6, 14, 4] as const;
export const IBL_NIGHT_DISC = false;
export const IBL_NIGHT_GROUND = false;
export const IBL_NIGHT_SIGMA = 0.04;

export const HEADLIGHT_COLOR = 0xfff1c8;
export const HEADLIGHT_INTENSITY = 28;
export const HEADLIGHT_DISTANCE = 48;
export const HEADLIGHT_ANGLE = 0.5;
export const HEADLIGHT_PENUMBRA = 0.68;
export const HEADLIGHT_DECAY = 1.05;
export const HEADLIGHT_SHADOW_MAP = 256;
export const HEADLIGHT_SHADOW_BIAS = -0.00025;
export const HEADLIGHT_SHADOW_NEAR = 0.6;
export const HEADLIGHT_SHADOW_FAR = 42;
export const HEADLIGHT_EMISSIVE_NIGHT = 5.2;
export const HEADLIGHT_EMISSIVE_DAY = 0.85;
export const HEADLIGHT_GLOW_NIGHT = 0.78;
export const HEADLIGHT_GLOW_DAY = 0.16;
export const HEADLIGHT_POOL_OPACITY = 0.88;
export const HEADLIGHT_POOL_RADIUS = 5.4;
export const HEADLIGHT_ENV_NIGHT = 1.15;
export const HEADLIGHT_ENV_DAY = 1.4;
export const LAMP_COLOR = 0xffc070;
export const LAMP_COUNT = 10;
export const LAMP_INTENSITY = 200;
export const LAMP_DISTANCE = 44;
export const LAMP_ANGLE = 0.9;
export const LAMP_PENUMBRA = 0.65;
export const LAMP_DECAY = 1.2;
export const NEON_INTENSITY = 42;
export const NEON_DISTANCE = 16;
export const NEON_DECAY = 2;

export const WEATHER_IDS = ["clear", "rain", "storm", "hamsin"] as const;
export const WEATHER_CLEAR = { long: 1, lat: 1, roll: 1, hydro: 0, vis: 1 } as const;
export const WEATHER_RAIN = { long: 0.78, lat: 0.72, roll: 1.42, hydro: 0.22, vis: 0.82 } as const;
export const WEATHER_STORM = { long: 0.62, lat: 0.55, roll: 1.7, hydro: 0.4, vis: 0.62 } as const;
export const WEATHER_HAMSIN = { long: 0.9, lat: 0.84, roll: 1.12, hydro: 0, vis: 0.7 } as const;
export const RAIN_COUNT = 560;
export const STORM_COUNT = 900;
export const HAMSIN_COUNT = 640;
export const SNOW_COUNT = 720;
export const LITE_PRECIP_COUNT = 280;

export function canonicalNightDigest() {
  return [
    "look=night",
    "exposure=1.22",
    "wetness=0.22",
    "night=1",
    "vis=0.9",
    "nightrain=1.18/0.7/1/0.76",
    "rain_look=0.58/1/0.08/0.55",
    "hemi=6a88b0/2a241c/0.52",
    "dir=c8d4e8/0.38",
    "fill=ffc070/0.48",
    "ambient=4a6080/0.28",
    "env_intensity_boot=0.42",
    "env_intensity_upgrade=0.52",
    "fog_city_night=0.000045/10000/2a4058",
    "background=182436",
    "clock=0.92",
    "hdri=false",
    "default_boot=day",
  ].join("\n") + "\n";
}

export function canonicalHeadlightDigest() {
  return [
    "spot=fff1c8/28/48/0.5/0.68/1.05",
    "shadow=256/-0.00025/0.6/42",
    "emissive_night=5.2",
    "emissive_day=0.85",
    "glow_night=0.78",
    "glow_day=0.16",
    "pool=5.4/0.88",
    "env_night=1.15",
    "env_day=1.4",
    "lamps=10/ffc070/200/44/0.9/0.65/1.2",
    "neon=42/16/2",
  ].join("\n") + "\n";
}

export function canonicalWeatherDigest() {
  return [
    "ids=clear,rain,storm,hamsin",
    "default=clear",
    "clear=1/1/1/0/1",
    "rain=0.78/0.72/1.42/0.22/0.82",
    "storm=0.62/0.55/1.7/0.4/0.62",
    "hamsin=0.9/0.84/1.12/0/0.7",
    "precip=560/900/640/720/280",
    "sky_night=/game/sky-night.png",
    "sky_size=1024x512",
    "stars=80",
    "png=3868cec9a4c9027f2acbc7bd9da2b59d518bf2e7e3617630d7ab5e56049ccdb9",
    "ibl_night=tiny_pmrem",
    "ibl_bg=182436",
    "ibl_hemi=4a6080/1a1410/0.55",
    "ibl_sun=a8c0e0/0.32",
    "ibl_disc=false",
    "sigma=0.04",
  ].join("\n") + "\n";
}
