#!/usr/bin/env node
/** Bake Ayalon gantry / station / train dest signs. Browser text, not runtime canvas. */
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const SIGNS = [
  { id: "gantry-kibbutz-galuyot", he: "קיבוץ גלויות", en: "Kibbutz Galuyot" },
  { id: "gantry-hahagana", he: "ההגנה", en: "HaHagana" },
  { id: "gantry-laguardia", he: "לה גרדיה", en: "LaGuardia" },
  { id: "gantry-hashalom", he: "השלום", en: "HaShalom" },
  { id: "gantry-savidor-center", he: "סבידור מרכז", en: "Savidor Center" },
  { id: "gantry-university", he: "אוניברסיטה", en: "University" },
  { id: "stn-galuyot", he: "תחנת קיבוץ גלויות" },
  { id: "stn-hagana", he: "תחנת ההגנה" },
  { id: "stn-shalom", he: "תחנת השלום" },
  { id: "stn-savidor", he: "תחנת סבידור" },
  { id: "stn-uni", he: "תחנת האוניברסיטה" },
  { id: "dest-rail", he: "רכבת ישראל", en: "HaHagana" },
];

const dir = join(dirname(fileURLToPath(import.meta.url)), "../public/game");
const b = await chromium.launch({ headless: true });
const p = await b.newPage();
for (const s of SIGNS) {
  const dataUrl = await p.evaluate(({ he, en }) => {
    const c = document.createElement("canvas");
    c.width = 512;
    c.height = 128;
    const ctx = c.getContext("2d");
    if (!ctx) return "";
    ctx.fillStyle = "#0c4a2a";
    ctx.fillRect(0, 0, 512, 128);
    ctx.strokeStyle = "#d8e8d8";
    ctx.lineWidth = 8;
    ctx.strokeRect(6, 6, 500, 116);
    ctx.fillStyle = "#f4f7f4";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "700 40px Arial, sans-serif";
    ctx.fillText(he, 256, en ? 48 : 64);
    if (en) {
      ctx.font = "600 22px Arial, sans-serif";
      ctx.fillText(en, 256, 92);
    }
    return c.toDataURL("image/png");
  }, s);
  const b64 = dataUrl.split(",")[1];
  if (!b64) throw new Error("bake failed " + s.id);
  writeFileSync(join(dir, s.id + ".png"), Buffer.from(b64, "base64"));
}
await b.close();
console.log("baked gantry", SIGNS.length);
