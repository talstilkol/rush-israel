import { defineTrack } from "../track-schema";
import { ram } from "./shared";

export default defineTrack({
    id: "ramon",
    nameHe: "מכתש רמון · הירידה",
    nameEn: "Ramon Crater Descent",
    city: "negev",
    cityHe: "נגב",
    cityEn: "Negev",
    lengthHint: "ירידה אחת · מהתצפית לרצפה",
    description: "מהתצפית במצפה רמון, סרפנטינות במצוק, עד רצפת המכתש. בלי בניינים — רק מדבר. בהשראת המקום, לא מפה ולא GIS.",
    descriptionEn: "From the Mitzpe Ramon lookout, switchbacks down the cliff, to the crater floor. Desert only. Inspired by the place — not a map, not GIS.",
    image: "/tracks/ramon.jpg",
    width: 26,
    seed: 1956,
    theme: "desert",
    open: true,
    ground: 0xb07a52,
    sand: 0xd4a070,
    sky: {
      elevation: 52,
      azimuth: 204,
      turbidity: 8.2,
      rayleigh: 1.2,
      mieCoefficient: 0.0068,
      mieDirectionalG: 0.7,
      exposure: 0.82,
      fog: 0xe0c8a4,
      fogDensity: 0.00028,
    },
    checkpointCount: 8,
    points: [
      ram(30.6132, 34.801),
      ram(30.612, 34.8042),
      ram(30.6106, 34.8074),
      ram(30.6088, 34.8092),
      ram(30.6064, 34.8078),
      ram(30.6052, 34.8048),
      ram(30.6066, 34.8018),
      ram(30.6042, 34.8002),
      ram(30.6014, 34.8026),
      ram(30.5992, 34.806),
      ram(30.5964, 34.8044),
      ram(30.5938, 34.801),
      ram(30.5904, 34.7992),
      ram(30.5872, 34.8024),
      ram(30.584, 34.8058),
      ram(30.5802, 34.8038),
      ram(30.5764, 34.8002),
      ram(30.5722, 34.7974),
    ],
    elevation: (t) => {
      if (t < 0.08) return 168;
      if (t > 0.9) return 1.2;
      const u = (t - 0.08) / 0.82;
      return 168 * Math.pow(1 - u, 1.18) + 1.2;
    },
    streets: [
      { from: 0.0, to: 0.14, he: "התצפית", en: "The Lookout" },
      { from: 0.14, to: 0.32, he: "שפת המכתש", en: "Crater Rim" },
      { from: 0.32, to: 0.62, he: "הסרפנטינות", en: "Switchbacks" },
      { from: 0.62, to: 0.82, he: "נחל רמון", en: "Nahal Ramon" },
      { from: 0.82, to: 1, he: "רצפת המכתש", en: "Crater Floor" },
    ],
    pois: [
      { ...ram(30.6132, 34.801), r: 32, he: "התצפית", en: "The Lookout" },
      { ...ram(30.6088, 34.8092), r: 36, he: "שפת המכתש", en: "Crater Rim" },
      { ...ram(30.5992, 34.806), r: 32, he: "הסרפנטינות", en: "Switchbacks" },
      { ...ram(30.5722, 34.7974), r: 40, he: "רצפת המכתש", en: "Crater Floor" },
    ],
  });
