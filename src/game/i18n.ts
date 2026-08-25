export type Lang = "he" | "ar" | "en";

export function copy(lang: Lang, he: string, en: string, ar?: string) {
  if (lang === "he") return he;
  if (lang === "ar") return ar ?? en;
  return en;
}

export function nextLang(lang: Lang): Lang {
  if (lang === "he") return "ar";
  if (lang === "ar") return "en";
  return "he";
}

export function langShort(lang: Lang) {
  if (lang === "he") return "עב";
  if (lang === "ar") return "ع";
  return "EN";
}

export function dirFor(lang: Lang) {
  return lang === "en" ? "ltr" : "rtl";
}

export function isRtl(lang: Lang) {
  return lang !== "en";
}
