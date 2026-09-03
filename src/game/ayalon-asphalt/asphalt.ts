/** Canonical Version 1 Ayalon asphalt, sidewalks, markings and signs (RSH-029). */

export const AYALON_TRACK_ID = "ayalon" as const;
export const AYALON_WIDTH = 28;
export const AYALON_OPEN = true;
export const AYALON_GIS_CLAIM = false;
export const AYALON_OWNER_FREEZE = false;

export const AYALON_LANES = 8;
export const AYALON_ASPHALT_KIT_ID = 8;
export const AYALON_ASPHALT_MAP = "/game/asphalt-8.png";
export const AYALON_ASPHALT_ROUGH = "/game/asphalt-8-rough.png";
export const AYALON_ASPHALT_BUMP = "/game/asphalt-8-bump.png";

export const AYALON_ROAD_BUMP_SCALE = 0.36;
export const AYALON_ROAD_COLOR = 0xffffff;
export const AYALON_ROAD_ROUGHNESS = 0.48;
export const AYALON_ROAD_METALNESS = 0;
export const AYALON_ROAD_ENV_MAP_INTENSITY = 0.85;
export const AYALON_ROAD_CLEARCOAT = 0.28;
export const AYALON_ROAD_CLEARCOAT_ROUGHNESS = 0.4;
export const AYALON_ROAD_REFLECTIVITY = 0.28;

export const AYALON_RAMP_BUMP_SCALE = 0.18;
export const AYALON_RAMP_COLOR_KIT = 0xffffff;
export const AYALON_RAMP_COLOR_FALLBACK = 6053990;
export const AYALON_RAMP_ROUGHNESS = 0.45;
export const AYALON_RAMP_METALNESS = 0;
export const AYALON_RAMP_ENV_MAP_INTENSITY = 0.85;
export const AYALON_RAMP_CLEARCOAT = 0.22;
export const AYALON_RAMP_CLEARCOAT_ROUGHNESS = 0.4;

export const AYALON_SIDEWALK_PRESENT = false;
export const AYALON_SIDEWALK_ASSET = "/game/sidewalk.png";
export const AYALON_SIDEWALK_REPEAT_X = 1;
export const AYALON_SIDEWALK_REPEAT_Y = 8;
export const AYALON_SIDEWALK_ROUGHNESS = 0.88;
export const AYALON_SIDEWALK_METALNESS = 0.04;
export const AYALON_SIDEWALK_ENV_MAP_INTENSITY = 0.3;

export const AYALON_EDGE_LINE_WIDTH = 0.16;
export const AYALON_EDGE_LINE_HEIGHT = 0.46;
export const AYALON_EDGE_LINE_COLOR = 0xffffff;
export const AYALON_DASH_WIDTH = 0.2;
export const AYALON_DASH_HEIGHT = 0.045;
export const AYALON_DASH_LENGTH = 4.4;
export const AYALON_DASH_COLOR = 0xf7f8f4;
export const AYALON_DASH_SKIP_PERIOD = 9;
export const AYALON_DASH_OPPOSITE_OFFSET = AYALON_WIDTH + 18;
export const AYALON_CHEVRON_COUNT = 48;
export const AYALON_CHEVRON_SCALE = 1.55;
export const AYALON_CHEVRON_WIDTH = 2.8;
export const AYALON_CHEVRON_LENGTH = 3.6;
export const AYALON_LANE_ARROW_ASSET = "/game/lane-arrow.png";
export const AYALON_ARROW_GANTRY_LATS = [32.055, 32.061, 32.067, 32.0735, 32.083, 32.092, 32.101] as const;
export const AYALON_ARROW_GANTRY_LONS = [34.795, 34.7971] as const;
export const AYALON_ARROW_PER_GANTRY = 8;
export const AYALON_ARROW_PLANE_WIDTH = 3.2;
export const AYALON_ARROW_PLANE_HEIGHT = 4.6;

export const AYALON_GANTRY_IDS = [
  "gantry-kibbutz-galuyot",
  "gantry-hahagana",
  "gantry-laguardia",
  "gantry-hashalom",
  "gantry-savidor-center",
  "gantry-university",
] as const;
export const AYALON_STATION_GANTRY_IDS = [
  "stn-galuyot",
  "stn-hagana",
  "stn-shalom",
  "stn-savidor",
  "stn-uni",
] as const;
export const AYALON_DEST_RAIL = "dest-rail" as const;
export const AYALON_HIGHWAY_SIGN_KINDS = ["speed90", "speed80", "none"] as const;
export const AYALON_INTERCHANGE_SPEED_SIGN = "speed90" as const;
export const AYALON_GANTRY_PLANE_WIDTH = 18;
export const AYALON_GANTRY_PLANE_HEIGHT = 4.2;
export const AYALON_GANTRY_Y = 13.8;
export const AYALON_SPEED90_OFFSET_EXTRA = 4.2;
export const AYALON_SPEED90_PLATE = 1.6;
export const AYALON_GREEN_SIGN_COLOR = 1731130;

export function canonicalAsphaltDigest(): string {
  return [
    `lanes=${AYALON_LANES}`,
    `kit=${AYALON_ASPHALT_KIT_ID}`,
    `map=${AYALON_ASPHALT_MAP}`,
    `rough=${AYALON_ASPHALT_ROUGH}`,
    `bump=${AYALON_ASPHALT_BUMP}`,
    `road_bumpScale=${AYALON_ROAD_BUMP_SCALE}`,
    `road_color=${AYALON_ROAD_COLOR}`,
    `road_roughness=${AYALON_ROAD_ROUGHNESS}`,
    `road_metalness=${AYALON_ROAD_METALNESS}`,
    `road_env=${AYALON_ROAD_ENV_MAP_INTENSITY}`,
    `road_clearcoat=${AYALON_ROAD_CLEARCOAT}`,
    `road_clearcoatRoughness=${AYALON_ROAD_CLEARCOAT_ROUGHNESS}`,
    `road_reflectivity=${AYALON_ROAD_REFLECTIVITY}`,
    `ramp_bumpScale=${AYALON_RAMP_BUMP_SCALE}`,
    `ramp_colorKit=${AYALON_RAMP_COLOR_KIT}`,
    `ramp_colorFallback=${AYALON_RAMP_COLOR_FALLBACK}`,
    `ramp_roughness=${AYALON_RAMP_ROUGHNESS}`,
    `ramp_metalness=${AYALON_RAMP_METALNESS}`,
    `ramp_env=${AYALON_RAMP_ENV_MAP_INTENSITY}`,
    `ramp_clearcoat=${AYALON_RAMP_CLEARCOAT}`,
    `ramp_clearcoatRoughness=${AYALON_RAMP_CLEARCOAT_ROUGHNESS}`,
    `sidewalk_present=${AYALON_SIDEWALK_PRESENT}`,
    `sidewalk_asset=${AYALON_SIDEWALK_ASSET}`,
    `sidewalk_repeat=${AYALON_SIDEWALK_REPEAT_X}x${AYALON_SIDEWALK_REPEAT_Y}`,
    `sidewalk_roughness=${AYALON_SIDEWALK_ROUGHNESS}`,
    `sidewalk_metalness=${AYALON_SIDEWALK_METALNESS}`,
    `sidewalk_env=${AYALON_SIDEWALK_ENV_MAP_INTENSITY}`,
  ].join("\n") + "\n";
}

export function canonicalMarkingDigest(): string {
  return [
    `edge=${AYALON_EDGE_LINE_WIDTH}x${AYALON_EDGE_LINE_HEIGHT}@${AYALON_EDGE_LINE_COLOR}`,
    `dash=${AYALON_DASH_WIDTH}x${AYALON_DASH_HEIGHT}x${AYALON_DASH_LENGTH}@${AYALON_DASH_COLOR}`,
    `dash_skip=${AYALON_DASH_SKIP_PERIOD}`,
    `dash_offs=0,${AYALON_DASH_OPPOSITE_OFFSET}`,
    `chevron_n=${AYALON_CHEVRON_COUNT}`,
    `chevron_scale=${AYALON_CHEVRON_SCALE}`,
    `chevron_geo=${AYALON_CHEVRON_WIDTH}x${AYALON_CHEVRON_LENGTH}`,
    `arrow_asset=${AYALON_LANE_ARROW_ASSET}`,
    `arrow_lats=${AYALON_ARROW_GANTRY_LATS.join(",")}`,
    `arrow_lons=${AYALON_ARROW_GANTRY_LONS.join(",")}`,
    `arrow_per=${AYALON_ARROW_PER_GANTRY}`,
    `arrow_plane=${AYALON_ARROW_PLANE_WIDTH}x${AYALON_ARROW_PLANE_HEIGHT}`,
  ].join("\n") + "\n";
}

export function canonicalSignDigest(): string {
  return [
    `gantries=${AYALON_GANTRY_IDS.join(",")}`,
    `stations=${AYALON_STATION_GANTRY_IDS.join(",")}`,
    `dest=${AYALON_DEST_RAIL}`,
    `highway_kinds=${AYALON_HIGHWAY_SIGN_KINDS.join(",")}`,
    `interchange_speed=${AYALON_INTERCHANGE_SPEED_SIGN}`,
    `gantry_plane=${AYALON_GANTRY_PLANE_WIDTH}x${AYALON_GANTRY_PLANE_HEIGHT}`,
    `gantry_y=${AYALON_GANTRY_Y}`,
    `speed90_off=width/2+${AYALON_SPEED90_OFFSET_EXTRA}`,
    `speed90_plate=${AYALON_SPEED90_PLATE}`,
    `green=${AYALON_GREEN_SIGN_COLOR}`,
  ].join("\n") + "\n";
}
