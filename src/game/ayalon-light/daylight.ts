/** Canonical Version 1 daylight, sky and image-based lighting lock (RSH-031). */

export const DAYLIGHT_HDRI = false;
export const DAYLIGHT_REAL_SKY_IBL = false;
export const DAYLIGHT_GIS_CLAIM = false;
export const DAYLIGHT_OWNER_FREEZE = false;

export const DAYLIGHT_LOOK_ID = "summer14" as const;
export const DAYLIGHT_EXPOSURE = 0.56;
export const DAYLIGHT_WETNESS = 0.18;
export const DAYLIGHT_NIGHT = 0;
export const DAYLIGHT_VIS = 1;

export const DAYLIGHT_HEMI_COLOR = 0xa8c8e8;
export const DAYLIGHT_HEMI_GROUND = 0x4a5248;
export const DAYLIGHT_HEMI_INTENSITY = 0.68;
export const DAYLIGHT_DIR_COLOR = 0xfff0d0;
export const DAYLIGHT_DIR_INTENSITY = 1.12;
export const DAYLIGHT_FILL_COLOR = 0xc4d8f0;
export const DAYLIGHT_FILL_INTENSITY = 0.28;
export const DAYLIGHT_AMBIENT_COLOR = 0xb0c4d8;
export const DAYLIGHT_AMBIENT_INTENSITY = 0.32;
export const DAYLIGHT_ENV_INTENSITY_BOOT = 0.7;
export const DAYLIGHT_ENV_INTENSITY_UPGRADE = 0.88;
export const DAYLIGHT_FOG_DAY = 0.00001;
export const DAYLIGHT_FOG_FAR = 10000;
export const DAYLIGHT_FOG_COLOR = 0x6eb4dc;
export const DAYLIGHT_BACKGROUND = 0x2f8fd4;
export const DAYLIGHT_NOON_CLOCK = 0.5;

export const SKY_DAY_ASSET = "/game/sky-day.png";
export const SKY_DAY_WIDTH = 1024;
export const SKY_DAY_HEIGHT = 512;
export const SKY_MAPPING = "EquirectangularReflectionMapping";
export const SKY_COLOR_SPACE = "SRGBColorSpace";
export const SKY_ANISOTROPY = 4;
export const SKY_PROCEDURAL_VISIBLE = false;
export const SKY_NOON_ELEVATION = 64;
export const SKY_NOON_TURBIDITY = 1.85;
export const SKY_NOON_RAYLEIGH = 0.72;
export const SKY_NOON_MIE_COEFFICIENT = 0.0018;
export const SKY_NOON_MIE_DIRECTIONAL_G = 0.55;
export const SKY_NOON_EXPOSURE = 0.94;
export const SKY_DAY_PNG_SHA256 = "0385c7aa2320e36b3a7b07cadc713269d30ad6f5810d9ee071abd10c95c78133";

export const IBL_KIND = "tiny_pmrem";
export const IBL_BACKGROUND = 0x3a9ae0;
export const IBL_HEMI_SKY = 0xc8e8ff;
export const IBL_HEMI_GROUND = 0xb89868;
export const IBL_HEMI_INTENSITY = 1.2;
export const IBL_SUN_COLOR = 0xffe8c4;
export const IBL_SUN_INTENSITY = 1.2;
export const IBL_SUN_POSITION = [6, 14, 4] as const;
export const IBL_DISC_COLOR = 0xfff6d8;
export const IBL_DISC_RADIUS = 2.4;
export const IBL_DISC_POSITION = [10, 16, 7] as const;
export const IBL_GROUND_COLOR = 0x3a4248;
export const IBL_GROUND_RADIUS = 22;
export const IBL_SIGMA = 0.04;

export const COLOR_OUTPUT = "SRGBColorSpace";
export const COLOR_TONE_MAPPING = "ACESFilmicToneMapping";

export function canonicalDaylightDigest() {
  return [
    "look=summer14",
    "exposure=0.56",
    "wetness=0.18",
    "night=0",
    "vis=1",
    "hemi=a8c8e8/4a5248/0.68",
    "dir=fff0d0/1.12",
    "fill=c4d8f0/0.28",
    "ambient=b0c4d8/0.32",
    "env_intensity_boot=0.7",
    "env_intensity_upgrade=0.88",
    "fog_city_day=0.00001/10000/6eb4dc",
    "background=2f8fd4",
    "color=srgb+aces",
    "hdri=false",
  ].join("\n") + "\n";
}

export function canonicalSkyDigest() {
  return [
    "asset=/game/sky-day.png",
    "size=1024x512",
    "mapping=EquirectangularReflectionMapping",
    "colorspace=SRGBColorSpace",
    "anisotropy=4",
    "hdri=false",
    "procedural_sky_visible=false",
    "noon_clock=0.5",
    "noon_elevation=64",
    "noon_turbidity=1.85",
    "noon_rayleigh=0.72",
    "noon_mie=0.0018",
    "noon_mie_g=0.55",
    "noon_exposure=0.94",
    "png=0385c7aa2320e36b3a7b07cadc713269d30ad6f5810d9ee071abd10c95c78133",
  ].join("\n") + "\n";
}

export function canonicalIblDigest() {
  return [
    "kind=tiny_pmrem",
    "hdri=false",
    "real_sky_ibl=false",
    "background=3a9ae0",
    "hemi=c8e8ff/b89868/1.2",
    "sun=ffe8c4/1.2",
    "sun_pos=6,14,4",
    "disc=fff6d8/2.4/10,16,7",
    "ground=3a4248/22",
    "sigma=0.04",
    "day_only=true",
  ].join("\n") + "\n";
}
