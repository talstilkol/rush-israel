/** Canonical Version 1 Ayalon ramps, barriers, colliders and checkpoints (RSH-027). */

export const AYALON_TRACK_ID = "ayalon" as const;
export const AYALON_WIDTH = 28;
export const AYALON_OPEN = true;
export const AYALON_GIS_CLAIM = false;
export const AYALON_OWNER_FREEZE = false;

export const AYALON_CHECKPOINT_COUNT = 8;
export const AYALON_CHECKPOINT_OPEN_EXTRA = 0.15;
export const AYALON_CHECKPOINT_OPEN_DENOMINATOR = AYALON_CHECKPOINT_COUNT + AYALON_CHECKPOINT_OPEN_EXTRA;

export const AYALON_BARRIER_EDGE_STEP_MIN = 3;
export const AYALON_BARRIER_EDGE_STEP_DIVISOR = 360;
export const AYALON_BARRIER_WALL_D_EXTRA = 1.55;
export const AYALON_BARRIER_POSITIVE_RADIUS = 0.62;
export const AYALON_BARRIER_NEGATIVE_RADIUS = 1.05;

export const AYALON_INTERCHANGE_COUNT = 6;
export const AYALON_RAMPS_PER_INTERCHANGE = 7;
export const AYALON_GALUYOT_EXTRA_RAMPS = 4;
export const AYALON_LAGUARDIA_EXTRA_RAMPS = 2;
export const AYALON_FLYOVER_EXTRA_RAMPS = 2;
export const AYALON_RAMP_COUNT =
  AYALON_INTERCHANGE_COUNT * AYALON_RAMPS_PER_INTERCHANGE +
  AYALON_GALUYOT_EXTRA_RAMPS +
  AYALON_LAGUARDIA_EXTRA_RAMPS +
  AYALON_FLYOVER_EXTRA_RAMPS;

export const AYALON_DECK_Y = 9.4;
export const AYALON_RAMP_Z_LEN = 68;
export const AYALON_RAMP_APPROACH = 34;
export const AYALON_RAMP_HALF = 10.2;
export const AYALON_INNER_RAMP_LEN = 32;
export const AYALON_INNER_RAMP_HALF = 12.5;
export const AYALON_ALONG_RAMP_LEN = 36;
export const AYALON_FLYOVER_LEN = 46;
export const AYALON_FLYOVER_HALF = 6.4;
export const AYALON_FLYOVER_Y0 = 0.4;
export const AYALON_FLYOVER_Y1 = 8.6;

export const AYALON_COLUMN_CLEARANCE_EXTRA = 2.5;
export const AYALON_COLUMN_HIT_RADIUS = 1.4;
export const AYALON_COLUMN_HIT_HX = 0.95;
export const AYALON_COLUMN_HIT_HZ = 0.95;
export const AYALON_COLUMN_LATERAL_EXTRA = 12;
export const AYALON_STATION_HALL_CLEARANCE_EXTRA = 10;
export const AYALON_STATION_HALL_HIT_RADIUS = 8;

export const AYALON_INTERCHANGES = [
  { lat: 32.0525, he: "קיבוץ גלויות", en: "Kibbutz Galuyot" },
  { lat: 32.0547, he: "ההגנה", en: "HaHagana" },
  { lat: 32.062, he: "לה גרדיה", en: "LaGuardia" },
  { lat: 32.0735, he: "השלום", en: "HaShalom" },
  { lat: 32.0837, he: "סבידור מרכז", en: "Savidor Center" },
  { lat: 32.1035, he: "אוניברסיטה", en: "University" },
] as const;

export const AYALON_FLYOVERS = [
  { lat: 32.0735, he: "השלום", en: "HaShalom" },
  { lat: 32.0837, he: "סבידור מרכז", en: "Savidor Center" },
] as const;

export const AYALON_STATIONS = [
  { lat: 32.0525, kind: "galuyot" },
  { lat: 32.0547, kind: "hagana" },
  { lat: 32.0735, kind: "shalom" },
  { lat: 32.0837, kind: "savidor" },
  { lat: 32.1035, kind: "uni" },
] as const;

export function ayalonCheckpoints(count = AYALON_CHECKPOINT_COUNT, open = AYALON_OPEN): number[] {
  const checkpoints: number[] = [];
  for (let i = 0; i < count; i++) {
    checkpoints.push(open ? (i + 1) / (count + AYALON_CHECKPOINT_OPEN_EXTRA) : i / count);
  }
  return checkpoints;
}

export function canonicalCheckpointDigest(checkpoints = ayalonCheckpoints()): string {
  return checkpoints.map((value) => value.toFixed(12)).join("\n") + "\n";
}

export function canonicalRampRecipeDigest(): string {
  return [
    `interchanges=${AYALON_INTERCHANGE_COUNT}`,
    `per=${AYALON_RAMPS_PER_INTERCHANGE}`,
    `galuyot_extra=${AYALON_GALUYOT_EXTRA_RAMPS}`,
    `laguardia_extra=${AYALON_LAGUARDIA_EXTRA_RAMPS}`,
    `flyover_extra=${AYALON_FLYOVER_EXTRA_RAMPS}`,
    `total=${AYALON_RAMP_COUNT}`,
    `deck_y=${AYALON_DECK_Y}`,
    `z_len=${AYALON_RAMP_Z_LEN}`,
    `approach=${AYALON_RAMP_APPROACH}`,
    `half=${AYALON_RAMP_HALF}`,
    `inner=${AYALON_INNER_RAMP_LEN}x${AYALON_INNER_RAMP_HALF}`,
    `along=${AYALON_ALONG_RAMP_LEN}`,
    `flyover=${AYALON_FLYOVER_LEN}x${AYALON_FLYOVER_HALF}@${AYALON_FLYOVER_Y0}-${AYALON_FLYOVER_Y1}`,
    `names=${AYALON_INTERCHANGES.map((item) => item.en).join(",")}`,
  ].join("\n") + "\n";
}
