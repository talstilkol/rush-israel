import { clamp, lerp, lerpColor } from "../math";
import type { CityId } from "../types";

const TLV_DUSK = {
  elevation: 6.5,
  azimuth: 248,
  turbidity: 6.4,
  rayleigh: 2.05,
  mieCoefficient: 0.0054,
  mieDirectionalG: 0.88,
  exposure: 0.84,
  fog: 0x6e645c,
  fogDensity: 0.0042,
};

const TLV_NIGHT = {
  elevation: 3.2,
  azimuth: 252,
  turbidity: 5.1,
  rayleigh: 1.55,
  mieCoefficient: 0.0048,
  mieDirectionalG: 0.9,
  exposure: 0.72,
  fog: 0x4a4450,
  fogDensity: 0.0048,
};

const TLV_GOLDEN = {
  elevation: 16,
  azimuth: 240,
  turbidity: 7.2,
  rayleigh: 1.9,
  mieCoefficient: 0.006,
  mieDirectionalG: 0.82,
  exposure: 0.96,
  fog: 0xc4a888,
  fogDensity: 0.0046,
};

const TLV_BLUE = {
  elevation: 8.4,
  azimuth: 236,
  turbidity: 4.6,
  rayleigh: 1.7,
  mieCoefficient: 0.0044,
  mieDirectionalG: 0.86,
  exposure: 0.78,
  fog: 0x5a6270,
  fogDensity: 0.0038,
};

/** Tel Aviv geographic projection. Origin: 32.075N 34.770E. 1m real ≈ 0.45 game units. */
export function tlv(lat: number, lon: number) {
  return {
    x: (lon - 34.77) * 94350 * 0.45,
    z: (lat - 32.075) * 111320 * 0.45,
  };
}

/** Jerusalem. Origin: Jaffa Gate 31.778N 35.228E. */
export function jer(lat: number, lon: number) {
  return {
    x: (lon - 35.228) * 94670 * 0.5,
    z: (lat - 31.778) * 111320 * 0.5,
  };
}

/** Haifa. Origin: Baháʼí terrace 32.815N 34.990E. */
export function hai(lat: number, lon: number) {
  return {
    x: (lon - 34.99) * 93500 * 0.45,
    z: (lat - 32.815) * 111320 * 0.45,
  };
}

export function eil(lat: number, lon: number) {
  return {
    x: (lon - 34.952) * 96800 * 0.5,
    z: (lat - 29.555) * 111320 * 0.5,
  };
}

export function dsea(lat: number, lon: number) {
  return {
    x: (lon - 35.365) * 95200 * 0.5,
    z: (lat - 31.19) * 111320 * 0.5,
  };
}

export function acr(lat: number, lon: number) {
  return {
    x: (lon - 35.07) * 93400 * 0.55,
    z: (lat - 32.922) * 111320 * 0.55,
  };
}

export function cae(lat: number, lon: number) {
  return {
    x: (lon - 34.892) * 93800 * 0.55,
    z: (lat - 32.501) * 111320 * 0.55,
  };
}

export function bsv(lat: number, lon: number) {
  return {
    x: (lon - 34.791) * 95200 * 0.5,
    z: (lat - 31.252) * 111320 * 0.5,
  };
}

export function mas(lat: number, lon: number) {
  return {
    x: (lon - 35.354) * 95200 * 0.5,
    z: (lat - 31.315) * 111320 * 0.5,
  };
}

export function net(lat: number, lon: number) {
  return {
    x: (lon - 34.855) * 93700 * 0.5,
    z: (lat - 32.332) * 111320 * 0.5,
  };
}

export function hzl(lat: number, lon: number) {
  return {
    x: (lon - 34.802) * 93800 * 0.5,
    z: (lat - 32.163) * 111320 * 0.5,
  };
}

export function tib(lat: number, lon: number) {
  return {
    x: (lon - 35.542) * 93200 * 0.5,
    z: (lat - 32.785) * 111320 * 0.5,
  };
}

export function hwy1(lat: number, lon: number) {
  return {
    x: (lon - 35.01) * 94600 * 0.18,
    z: (lat - 31.82) * 111320 * 0.18,
  };
}

export function nik(lat: number, lon: number) {
  return {
    x: (lon - 35.11) * 93200 * 0.5,
    z: (lat - 33.085) * 111320 * 0.5,
  };
}

export function tzf(lat: number, lon: number) {
  return {
    x: (lon - 35.495) * 93200 * 0.55,
    z: (lat - 32.965) * 111320 * 0.55,
  };
}

export function ram(lat: number, lon: number) {
  return {
    x: (lon - 34.802) * 96000 * 0.5,
    z: (lat - 30.61) * 111320 * 0.5,
  };
}

export function naz(lat: number, lon: number) {
  return {
    x: (lon - 35.297) * 93300 * 0.55,
    z: (lat - 32.702) * 111320 * 0.55,
  };
}

export function gol(lat: number, lon: number) {
  return {
    x: (lon - 35.69) * 92800 * 0.22,
    z: (lat - 32.995) * 111320 * 0.22,
  };
}

export function hwy6(lat: number, lon: number) {
  return {
    x: (lon - 34.95) * 94000 * 0.16,
    z: (lat - 32.12) * 111320 * 0.16,
  };
}

export function hwy2(lat: number, lon: number) {
  return {
    x: (lon - 34.88) * 93700 * 0.16,
    z: (lat - 32.42) * 111320 * 0.16,
  };
}

export function rsh(lat: number, lon: number) {
  return {
    x: (lon - 34.804) * 94300 * 0.5,
    z: (lat - 31.964) * 111320 * 0.5,
  };
}

export function pth(lat: number, lon: number) {
  return {
    x: (lon - 34.88) * 94100 * 0.5,
    z: (lat - 32.09) * 111320 * 0.5,
  };
}

export function asd(lat: number, lon: number) {
  return {
    x: (lon - 34.645) * 94800 * 0.5,
    z: (lat - 31.81) * 111320 * 0.5,
  };
}

export function ask(lat: number, lon: number) {
  return {
    x: (lon - 34.56) * 95000 * 0.5,
    z: (lat - 31.67) * 111320 * 0.5,
  };
}

export function bym(lat: number, lon: number) {
  return {
    x: (lon - 34.745) * 94400 * 0.5,
    z: (lat - 32.015) * 111320 * 0.5,
  };
}

export function rhv(lat: number, lon: number) {
  return {
    x: (lon - 34.812) * 94400 * 0.5,
    z: (lat - 31.896) * 111320 * 0.5,
  };
}

export function nah(lat: number, lon: number) {
  return {
    x: (lon - 35.094) * 93300 * 0.5,
    z: (lat - 33.006) * 111320 * 0.5,
  };
}

export function hol(lat: number, lon: number) {
  return {
    x: (lon - 34.779) * 94300 * 0.5,
    z: (lat - 32.01) * 111320 * 0.5,
  };
}

export function hdr(lat: number, lon: number) {
  return {
    x: (lon - 34.89) * 93700 * 0.45,
    z: (lat - 32.44) * 111320 * 0.45,
  };
}

export function hwy90(lat: number, lon: number) {
  return {
    x: (lon - 35.25) * 96000 * 0.2,
    z: (lat - 30.71) * 111320 * 0.2,
  };
}

export function raa(lat: number, lon: number) {
  return {
    x: (lon - 34.87) * 94000 * 0.5,
    z: (lat - 32.184) * 111320 * 0.5,
  };
}

export function ksb(lat: number, lon: number) {
  return {
    x: (lon - 34.908) * 93900 * 0.5,
    z: (lat - 32.175) * 111320 * 0.5,
  };
}

export function rml(lat: number, lon: number) {
  return {
    x: (lon - 34.865) * 94400 * 0.5,
    z: (lat - 31.927) * 111320 * 0.5,
  };
}

export function lodp(lat: number, lon: number) {
  return {
    x: (lon - 34.885) * 94300 * 0.4,
    z: (lat - 31.975) * 111320 * 0.4,
  };
}

export function mod(lat: number, lon: number) {
  return {
    x: (lon - 35.005) * 94200 * 0.45,
    z: (lat - 31.896) * 111320 * 0.45,
  };
}

export function afl(lat: number, lon: number) {
  return {
    x: (lon - 35.29) * 93600 * 0.5,
    z: (lat - 32.61) * 111320 * 0.5,
  };
}

export function her(lat: number, lon: number) {
  return {
    x: (lon - 35.77) * 92800 * 0.4,
    z: (lat - 33.28) * 111320 * 0.4,
  };
}

export function hwy40(lat: number, lon: number) {
  return {
    x: (lon - 34.79) * 95600 * 0.28,
    z: (lat - 30.83) * 111320 * 0.28,
  };
}

export function bsn(lat: number, lon: number) {
  return {
    x: (lon - 35.5) * 93800 * 0.5,
    z: (lat - 32.5) * 111320 * 0.5,
  };
}

export function ksm(lat: number, lon: number) {
  return {
    x: (lon - 35.57) * 93000 * 0.4,
    z: (lat - 33.21) * 111320 * 0.4,
  };
}

export function ard(lat: number, lon: number) {
  return {
    x: (lon - 35.22) * 95200 * 0.45,
    z: (lat - 31.258) * 111320 * 0.45,
  };
}

export const CITY_FILTERS: { id: "all" | CityId; he: string; en: string }[] = [
  { id: "all", he: "הכל", en: "All" },
  { id: "telaviv", he: "תל אביב", en: "Tel Aviv" },
  { id: "jerusalem", he: "ירושלים", en: "Jerusalem" },
  { id: "haifa", he: "חיפה", en: "Haifa" },
  { id: "eilat", he: "אילת", en: "Eilat" },
  { id: "caesarea", he: "קיסריה", en: "Caesarea" },
  { id: "deadsea", he: "ים המלח", en: "Dead Sea" },
  { id: "acre", he: "עכו", en: "Acre" },
  { id: "beersheva", he: "באר שבע", en: "Be'er Sheva" },
  { id: "netanya", he: "נתניה", en: "Netanya" },
  { id: "highway", he: "כבישים", en: "Highways" },
  { id: "herzliya", he: "הרצליה", en: "Herzliya" },
  { id: "galilee", he: "גליל", en: "Galilee" },
  { id: "kinneret", he: "כנרת", en: "Kinneret" },
  { id: "golan", he: "גולן", en: "Golan" },
  { id: "petah", he: "פתח תקווה", en: "Petah Tikva" },
  { id: "rishon", he: "ראשון לציון", en: "Rishon LeZion" },
  { id: "ashdod", he: "אשדוד", en: "Ashdod" },
  { id: "ashkelon", he: "אשקלון", en: "Ashkelon" },
  { id: "modiin", he: "מודיעין", en: "Modiin" },
  { id: "negev", he: "נגב", en: "Negev" },
  { id: "rehovot", he: "רחובות", en: "Rehovot" },
  { id: "ramla", he: "רמלה", en: "Ramla" },
  { id: "nyc", he: "ניו יורק", en: "New York" },
];

// RSH-014: GENERATED EXPORT BRIDGE — excluded from the reconstructed RSH-013 source
export { TLV_BLUE, TLV_DUSK, TLV_GOLDEN, TLV_NIGHT, clamp, lerp, lerpColor };
