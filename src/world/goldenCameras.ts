/**
 * G0-01: 12 golden cameras on the Ayalon corridor (progress t along the open spline).
 * Poses are spline-relative. Reference photos: unavailable.
 */
export type GoldenCam = {
  id: string;
  look: "summer14" | "golden" | "night" | "nightrain" | "rain";
  t: number;
  he: string;
  en: string;
};

export const AYALON_CORRIDOR = "ayalon" as const;

export const AYALON_GOLDEN: GoldenCam[] = [
  { id: "g01", look: "summer14", t: 0.04, he: "קיבוץ גלויות דרום", en: "Kibbutz Galuyot south" },
  { id: "g02", look: "summer14", t: 0.14, he: "ההגנה", en: "HaHagana" },
  { id: "g03", look: "summer14", t: 0.28, he: "לה גרדיה", en: "LaGuardia" },
  { id: "g04", look: "summer14", t: 0.42, he: "השלום מערב", en: "HaShalom west" },
  { id: "g05", look: "golden", t: 0.46, he: "עזריאלי צללית", en: "Azrieli silhouette" },
  { id: "g06", look: "golden", t: 0.52, he: "השלום גשר", en: "HaShalom bridge" },
  { id: "g07", look: "golden", t: 0.62, he: "סבידור", en: "Savidor" },
  { id: "g08", look: "nightrain", t: 0.48, he: "איילון לילה", en: "Ayalon night" },
  { id: "g09", look: "nightrain", t: 0.7, he: "רכבת באמצע", en: "Median rail" },
  { id: "g10", look: "rain", t: 0.38, he: "רטוב השלום", en: "Wet HaShalom" },
  { id: "g11", look: "rain", t: 0.8, he: "אוניברסיטה צפון", en: "University north" },
  { id: "g12", look: "summer14", t: 0.92, he: "קצה המסדרון", en: "Corridor end" },
];
