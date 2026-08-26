#!/usr/bin/env node
/** Bake headlight cookie. Drawn radial. */
import { deflateSync } from "node:zlib";
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

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
function lerp(a, b, t) {
  return a + (b - a) * t;
}
const size = 256;
const img = Buffer.alloc(size * size * 4);
const cx = size * 0.5, cy = size * 0.62, r0 = 6, r1 = size * 0.48;
for (let y = 0; y < size; y++)
  for (let x = 0; x < size; x++) {
    const d = Math.hypot(x - cx, y - cy);
    let t = (d - r0) / (r1 - r0);
    if (t < 0) t = 0;
    let r = 255, g = 248, b = 220, a = 255;
    if (t < 0.22) {
      const u = t / 0.22;
      r = lerp(255, 255, u);
      g = lerp(248, 236, u);
      b = lerp(220, 190, u);
      a = lerp(255, 178, u);
    } else if (t < 0.55) {
      const u = (t - 0.22) / 0.33;
      r = lerp(255, 255, u);
      g = lerp(236, 210, u);
      b = lerp(190, 140, u);
      a = lerp(178, 46, u);
    } else if (t <= 1) {
      const u = (t - 0.55) / 0.45;
      r = lerp(255, 0, u);
      g = lerp(210, 0, u);
      b = lerp(140, 0, u);
      a = lerp(46, 0, u);
    } else a = 0;
    const i = (y * size + x) * 4;
    img[i] = r;
    img[i + 1] = g;
    img[i + 2] = b;
    img[i + 3] = a;
  }
const out = join(dirname(fileURLToPath(import.meta.url)), "../public/game/beam.png");
writeFileSync(out, pngRgba(size, size, img));
console.log("baked", out);
