/** Canonical Version 1 Ayalon road geometry, widths and lanes (RSH-026). */

export const AYALON_TRACK_ID = "ayalon" as const;
export const AYALON_NAME_HE = "נתיבי איילון";
export const AYALON_NAME_EN = "Ayalon Highway";
export const AYALON_THEME = "highway" as const;
export const AYALON_OPEN = true;
export const AYALON_WIDTH = 28;
export const AYALON_LANES = 8;
export const AYALON_LANE_WIDTH = AYALON_WIDTH / AYALON_LANES;
export const AYALON_SEED = 2020;
export const AYALON_WEST_LON = 34.795;
export const AYALON_LAT_START = 32.052;
export const AYALON_LAT_LOOP_END = 32.106;
export const AYALON_LAT_STEP = 0.002;
export const AYALON_LAT_LAST_SAMPLE = 32.104;
export const AYALON_POINT_COUNT = 27;
export const AYALON_OPPOSITE_CARRIAGEWAY_OFFSET = AYALON_WIDTH + 18;
export const AYALON_GIS_CLAIM = false;
export const AYALON_OWNER_FREEZE = false;

export const AYALON_ELEVATION = {
  base: 0.5,
  sine1: 1.7,
  sine5: 0.85,
} as const;

export const TLV_ORIGIN = {
  lat: 32.075,
  lon: 34.77,
  lonScale: 94350,
  latScale: 111320,
  gameScale: 0.45,
} as const;

export function tlvProject(lat: number, lon: number): { x: number; z: number } {
  return {
    x: (lon - TLV_ORIGIN.lon) * TLV_ORIGIN.lonScale * TLV_ORIGIN.gameScale,
    z: (lat - TLV_ORIGIN.lat) * TLV_ORIGIN.latScale * TLV_ORIGIN.gameScale,
  };
}

/** Exact existing spline loop. IEEE accumulation does not reach 32.106. */
export function ayalonControlPoints(): { x: number; z: number }[] {
  const pts: { x: number; z: number }[] = [];
  for (let lat = AYALON_LAT_START; lat <= AYALON_LAT_LOOP_END; lat += AYALON_LAT_STEP) {
    pts.push(tlvProject(Number(lat.toFixed(4)), AYALON_WEST_LON));
  }
  return pts;
}

export function ayalonElevation(t: number): number {
  return (
    AYALON_ELEVATION.base +
    AYALON_ELEVATION.sine1 * Math.sin(t * Math.PI) +
    AYALON_ELEVATION.sine5 * Math.sin(t * Math.PI * 5)
  );
}

export function canonicalControlPointDigest(points = ayalonControlPoints()): string {
  return points.map((point) => `${point.x.toFixed(12)},${point.z.toFixed(12)}`).join("\n") + "\n";
}
