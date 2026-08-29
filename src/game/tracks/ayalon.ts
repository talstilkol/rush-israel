import { defineTrack } from "../track-schema";
import { TLV_BLUE, tlv } from "./shared";

export default defineTrack({
    id: "ayalon",
    nameHe: "נתיבי איילון",
    nameEn: "Ayalon Highway",
    city: "telaviv",
    cityHe: "תל אביב",
    cityEn: "Tel Aviv",
    lengthHint: "נסיעה אחת · דרום לצפון",
    description: "קיבוץ גלויות עד האוניברסיטה, נגד אחד. לא מפה GIS — בהשראת כביש 20.",
    descriptionEn: "Kibbutz Galuyot to the university, one carriageway. Not GIS — inspired by Highway 20.",
    image: "/tracks/ayalon.jpg",
    width: 28,
    seed: 2020,
    theme: "highway",
    open: true,
    ground: 0x6a6e72,
    sand: 0xb0a898,
    sky: { ...TLV_BLUE, fogDensity: 0.0009 },
    checkpointCount: 8,
    points: (() => {
      const west = 34.795;
      const pts: { x: number; z: number }[] = [];
      for (let lat = 32.052; lat <= 32.106; lat += 0.002) pts.push(tlv(Number(lat.toFixed(4)), west));
      return pts;
    })(),
    elevation: (t) => 0.5 + 1.7 * Math.sin(t * Math.PI) + 0.85 * Math.sin(t * Math.PI * 5),
    streets: [
      { from: 0.0, to: 0.12, he: "קיבוץ גלויות", en: "Kibbutz Galuyot" },
      { from: 0.12, to: 0.22, he: "ההגנה", en: "HaHagana" },
      { from: 0.22, to: 0.32, he: "לה גרדיה", en: "LaGuardia" },
      { from: 0.32, to: 0.48, he: "השלום", en: "HaShalom" },
      { from: 0.48, to: 0.62, he: "סבידור מרכז", en: "Savidor Center" },
      { from: 0.62, to: 1, he: "אוניברסיטת תל אביב", en: "Tel Aviv University" },
    ],
    pois: [
      { ...tlv(32.0547, 34.7848), r: 36, he: "תחנת ההגנה", en: "HaHagana Station" },
      { ...tlv(32.0735, 34.793), r: 40, he: "תחנת השלום", en: "HaShalom Station" },
      { ...tlv(32.0837, 34.7975), r: 40, he: "סבידור מרכז", en: "Savidor Center" },
      { ...tlv(32.1035, 34.8042), r: 36, he: "תחנת האוניברסיטה", en: "University Station" },
      { ...tlv(32.0744, 34.7922), r: 48, he: "עזריאלי", en: "Azrieli" },
      { ...tlv(32.0695, 34.7894), r: 36, he: "מגדל תוהה", en: "ToHa Tower" },
      { ...tlv(32.0699, 34.7918), r: 36, he: "מגדל אלקטרה", en: "Electra Tower" },
      { ...tlv(32.0832, 34.8027), r: 44, he: "מגדל משה אביב", en: "Moshe Aviv Tower" },
      { ...tlv(32.0806, 34.7926), r: 36, he: "מידטאון", en: "Midtown TLV" },
    ],
  });
