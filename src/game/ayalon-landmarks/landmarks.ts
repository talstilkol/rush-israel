/** Canonical Version 1 Ayalon landmark placement (RSH-028). */

export const AYALON_TRACK_ID = "ayalon" as const;
export const AYALON_WIDTH = 28;
export const AYALON_OPEN = true;
export const AYALON_GIS_CLAIM = false;
export const AYALON_OWNER_FREEZE = false;

export const AYALON_TRACK_POI_COUNT = 9;
export const AYALON_BUILDER_PLACE_CALLS = 8;
export const AYALON_BUILDER_EXTRA_LANDMARKS = 6;

export const AYALON_TRACK_POIS = [
  { lat: 32.0547, lon: 34.7848, r: 36, he: "תחנת ההגנה", en: "HaHagana Station" },
  { lat: 32.0735, lon: 34.793, r: 40, he: "תחנת השלום", en: "HaShalom Station" },
  { lat: 32.0837, lon: 34.7975, r: 40, he: "סבידור מרכז", en: "Savidor Center" },
  { lat: 32.1035, lon: 34.8042, r: 36, he: "תחנת האוניברסיטה", en: "University Station" },
  { lat: 32.0744, lon: 34.7922, r: 48, he: "עזריאלי", en: "Azrieli" },
  { lat: 32.0695, lon: 34.7894, r: 36, he: "מגדל תוהה", en: "ToHa Tower" },
  { lat: 32.0699, lon: 34.7918, r: 36, he: "מגדל אלקטרה", en: "Electra Tower" },
  { lat: 32.0832, lon: 34.8027, r: 44, he: "מגדל משה אביב", en: "Moshe Aviv Tower" },
  { lat: 32.0806, lon: 34.7926, r: 36, he: "מידטאון", en: "Midtown TLV" },
] as const;

export const AYALON_BUILDER_PLACE_CALLS_LOCK = [
  { name: "placeAzrieli", args: "1.42" },
  { name: "placeToHa", args: "1.28, 32.0695, 34.7894" },
  { name: "placeCityGate", args: "1" },
  { name: "placeMidtown", args: "1.15" },
  { name: "placeElectra", args: "1.2" },
  { name: "placeSarona", args: "1.32" },
  { name: "placeHakirya", args: "1.1" },
  { name: "placeShalomMeir", args: "1.15" },
] as const;

export const AYALON_BUILDER_EXTRA_LANDMARKS_LOCK = [
  { id: "ibm", recipe: "parkOff(32.0856, 34.7987, 36, true)" },
  { id: "yovel", recipe: "parkOff(32.0788, 34.7916, 30, false)" },
  { id: "platinum", recipe: "parkOff(32.0842, 34.8036, 42, true)" },
  { id: "tau", recipe: "parkOff(32.1124, 34.8046, 48, true)" },
  { id: "hashalom_tube", recipe: "tlv(32.0735, 34.79605)" },
  { id: "ayalon_mall", recipe: "tlv(32.1004, 34.7996)" },
] as const;

export const AYALON_AZRIELI_HINT = "tlv(32.0744, 34.7932)" as const;

export function canonicalPoiDigest(
  pois: readonly { lat: number; lon: number; r: number; en: string }[] = AYALON_TRACK_POIS,
): string {
  return pois.map((poi) => `${poi.en}|${poi.lat}|${poi.lon}|${poi.r}`).join("\n") + "\n";
}

export function canonicalPlacementDigest(): string {
  return [
    ...AYALON_BUILDER_PLACE_CALLS_LOCK.map((item) => `${item.name}(${item.args})`),
    ...AYALON_BUILDER_EXTRA_LANDMARKS_LOCK.map((item) => `${item.id}=${item.recipe}`),
    `azrieli_hint=${AYALON_AZRIELI_HINT}`,
  ].join("\n") + "\n";
}
