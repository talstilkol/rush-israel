#!/usr/bin/env node
/** Bake foliage + bark. Procedural, not photos. */
import { deflateSync } from "node:zlib";
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

function hash01(...parts) {
  let h = 2166136261;
  for (const p of parts) {
    h ^= p | 0;
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 4294967296;
}
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
function crc32(buf) {
  let c = ~0;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
  }
  return ~c >>> 0;
}
function pngRgba(w, h, data) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const chunk = (type, body) => {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(body.length);
    const t = Buffer.from(type);
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(crc32(Buffer.concat([t, body])));
    return Buffer.concat([len, t, body, crc]);
  };
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  const raw = Buffer.alloc((w * 4 + 1) * h);
  for (let y = 0; y < h; y++) {
    raw[y * (w * 4 + 1)] = 0;
    data.copy(raw, y * (w * 4 + 1) + 1, y * w * 4, (y + 1) * w * 4);
  }
  return Buffer.concat([sig, chunk("IHDR", ihdr), chunk("IDAT", deflateSync(raw)), chunk("IEND", Buffer.alloc(0))]);
}

const size = 128;
const foliage = Buffer.alloc(size * size * 4);
const bark = Buffer.alloc(size * size * 4);
for (let y = 0; y < size; y++)
  for (let x = 0; x < size; x++) {
    const i = (y * size + x) * 4;
    const n = hash01(x, y) * 40 - 12;
    const vein = Math.abs(Math.sin(x * 0.4 + y * 0.15)) < 0.12 ? -18 : 0;
    const g = clamp(88 + n + vein, 36, 140);
    foliage[i] = 18 + n * 0.2;
    foliage[i + 1] = g;
    foliage[i + 2] = 22 + n * 0.15;
    foliage[i + 3] = 255;
    const ridge = Math.sin(x * 0.55) * 18 + hash01(x, y) * 22 - 10;
    const crack = Math.abs(Math.sin(x * 1.2 + y * 0.08)) < 0.08 ? -28 : 0;
    bark[i] = clamp(74 + ridge + crack, 28, 120);
    bark[i + 1] = clamp(48 + ridge * 0.6 + crack, 18, 88);
    bark[i + 2] = clamp(28 + ridge * 0.3, 10, 52);
    bark[i + 3] = 255;
  }
const dir = join(dirname(fileURLToPath(import.meta.url)), "../public/game");
writeFileSync(join(dir, "foliage.png"), pngRgba(size, size, foliage));
writeFileSync(join(dir, "bark.png"), pngRgba(size, size, bark));
console.log("baked trees");
