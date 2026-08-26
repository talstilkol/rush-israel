#!/usr/bin/env node
/** Bake sidewalk tiles. Procedural, not photos. */
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

const size = 256;
const img = Buffer.alloc(size * size * 4);
for (let y = 0; y < size; y++)
  for (let x = 0; x < size; x++) {
    const i = (y * size + x) * 4;
    const n = (hash01(i, 17) - 0.5) * 18;
    img[i] = Math.max(0, Math.min(255, 216 + n));
    img[i + 1] = Math.max(0, Math.min(255, 210 + n));
    img[i + 2] = Math.max(0, Math.min(255, 200 + n));
    img[i + 3] = 255;
  }
function line(x0, y0, x1, y1) {
  const n = Math.max(2, Math.hypot(x1 - x0, y1 - y0) | 0);
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const x = (x0 + (x1 - x0) * t) | 0;
    const y = (y0 + (y1 - y0) * t) | 0;
    for (let k = -1; k <= 1; k++) {
      const xi = x + (x1 === x0 ? k : 0);
      const yi = y + (y1 === y0 ? k : 0);
      if (xi < 0 || yi < 0 || xi >= size || yi >= size) continue;
      const p = (yi * size + xi) * 4;
      img[p] = 90;
      img[p + 1] = 86;
      img[p + 2] = 80;
    }
  }
}
for (let i = 0; i <= 4; i++) {
  const u = (i * size) / 4;
  line(u, 0, u, size);
  line(0, u, size, u);
}
const out = join(dirname(fileURLToPath(import.meta.url)), "../public/game/sidewalk.png");
writeFileSync(out, pngRgba(size, size, img));
console.log("baked", out);
