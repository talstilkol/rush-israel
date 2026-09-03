/** Canonical unique Ayalon golden pack and owner-approval lock (RSH-035). */

export const AYALON_GOLDEN_GIS_CLAIM = false;
export const AYALON_GOLDEN_OWNER_FREEZE = false;
export const AYALON_GOLDEN_PUBLIC_DISTRIBUTION = false;

export const AYALON_LOCK_GENERATION = 11;
export const AYALON_LOCK_HASH = "0c34b9d1f9ded36eaa8400c7aaba48a4f725033bfe25412a4648c36c73910d48";
export const DUPLICATE_PLACEHOLDER_HASH = "38a303adb7188d398628e58223973cb31d37ccf37d597da33c8ac442b4052094";

export const PIXEL_THRESHOLD = 0.12;
export const PIXEL_FAIL_PERCENT = 8;
export const PIXEL_GOLDEN_FRAMES = [
  "ayalon-day-g01.png",
  "ayalon-day-g05.png",
  "ayalon-day-g07.png",
  "ayalon-night-g08.png",
] as const;

export const NON_AUTHORITY_PLACEHOLDERS = [
  "hashalom-g04.png",
  "hashalom-g05.png",
  "hashalom-g06.png",
  "hashalom-ramp.png",
] as const;

export const UNIQUE_AUTHORITY_FRAMES = [
  "ayalon-chase.png",
  "ayalon-day-g01.png",
  "ayalon-day-g05.png",
  "ayalon-day-g07.png",
  "ayalon-night-chase.png",
  "ayalon-night-g08.png",
  "hashalom-azrieli.png",
  "hashalom-citygate.png",
  "hashalom-electra.png",
  "hashalom-galuyot.png",
  "hashalom-hagana.png",
  "hashalom-hakirya.png",
  "hashalom-midtown.png",
  "hashalom-platinum.png",
  "hashalom-sarona.png",
  "hashalom-savidor.png",
  "hashalom-shalommeir.png",
  "hashalom-tau.png",
  "hashalom-toha.png",
  "hashalom-university.png",
] as const;

export const OWNER_APPROVAL = {
  unit: "RSH-035",
  instruction: "המשך",
  unique_pack_approved: true,
  placeholders_are_unique_evidence: false,
  freeze_granted: false,
  gis_claim: false,
  public_distribution: false,
  approved_by: "owner",
} as const;

export function canonicalGoldenDigest() {
  return [
    "track=ayalon",
    `lock_generation=${AYALON_LOCK_GENERATION}`,
    `lock_hash=${AYALON_LOCK_HASH}`,
    `pixel_threshold=${PIXEL_THRESHOLD}`,
    `pixel_fail_percent=${PIXEL_FAIL_PERCENT}`,
    `pixel_frames=${PIXEL_GOLDEN_FRAMES.join(",")}`,
    `unique_count=${UNIQUE_AUTHORITY_FRAMES.length}`,
    `unique_frames=${UNIQUE_AUTHORITY_FRAMES.join(",")}`,
    `placeholders=${NON_AUTHORITY_PLACEHOLDERS.join(",")}`,
    `placeholder_hash=${DUPLICATE_PLACEHOLDER_HASH}`,
    "gis=false",
    "owner_freeze=false",
    "public_distribution=false",
    "unique_pack_approved=true",
    "placeholders_are_unique_evidence=false",
    "freeze_granted=false",
  ].join("\n") + "\n";
}
