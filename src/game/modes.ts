import type { RaceMode } from "./types";

export const MODE_LAPS: Record<RaceMode, number> = {
  circuit: 3,
  time: 2,
  drift: 2,
  knockout: 3,
  heat: 2,
  roam: 99,
};

export const MODE_INFO: Record<
  RaceMode,
  { he: string; en: string; blurbHe: string; blurbEn: string }
> = {
  circuit: {
    he: "מעגל",
    en: "Circuit",
    blurbHe: "שלוש הקפות מול יריבים. מקום ראשון = שלושה כוכבים.",
    blurbEn: "Three laps against rivals. First place is three stars.",
  },
  time: {
    he: "נגד השעון",
    en: "Time attack",
    blurbHe: "שתי הקפות נקיות. בלי יריבים — רק אתה, השעון והרחוב.",
    blurbEn: "Two clean laps. No rivals — just you, the clock and the street.",
  },
  drift: {
    he: "דריפט",
    en: "Drift",
    blurbHe: "זווית מתוקה, קומבו וניר-מיס. שמור על 20–40°.",
    blurbEn: "Sweet angle, combo and near-miss. Hold 20–40°.",
  },
  knockout: {
    he: "הדחה",
    en: "Knockout",
    blurbHe: "כל הקפה מוציאה את האחרון. תשרוד עד הסוף.",
    blurbEn: "Last place is cut each lap. Survive to the end.",
  },
  heat: {
    he: "מרדף",
    en: "Heat",
    blurbHe: "המשטרה מאחוריך. מחסומים, כוכבי מבוקש, קירור אם תברח.",
    blurbEn: "Cops on your tail. Roadblocks, wanted stars, cooldown if you escape.",
  },
  roam: {
    he: "חופשי",
    en: "Free roam",
    blurbHe: "גוש דן פתוח. אסוף ציוני דרך. בלי יריבים, בלי הקפות.",
    blurbEn: "Open Gush Dan. Collect landmarks. No rivals, no laps.",
  },
};

export const RACE_MODES: RaceMode[] = ["circuit", "time", "drift", "knockout", "heat", "roam"];

export function hasAiPack(mode: RaceMode) {
  return mode === "circuit" || mode === "knockout";
}

export function hasCops(mode: RaceMode) {
  return mode === "heat";
}
