#!/usr/bin/env node
/** Bake car-paint flake noise. Drawn, not a scan. */
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
for (let i = 0; i < size * size; i++) {
  img[i * 4] = 122;
  img[i * 4 + 1] = 122;
  img[i * 4 + 2] = 122;
  img[i * 4 + 3] = 255;
}
function setPx(x, y, r, g, b) {
  const xi = x | 0, yi = y | 0;
  if (xi < 0 || yi < 0 || xi >= size || yi >= size) return;
  const p = (yi * size + xi) * 4;
  img[p] = r;
  img[p + 1] = g;
  img[p + 2] = b;
}
for (let i = 0; i < 4200; i++) {
  const x = hash01(i, 1) * size;
  const y = hash01(i, 2) * size;
  const s = hash01(i, 3) * 1.6 + 0.25;
  const c = hash01(i, 4) > 0.5 ? [244, 240, 232] : hash01(i, 5) > 0.5 ? [220, 230, 244] : [232, 216, 176];
  for (let dy = 0; dy < s; dy++) for (let dx = 0; dx < s; dx++) setPx(x + dx, y + dy, c[0], c[1], c[2]);
}
const out = join(dirname(fileURLToPath(import.meta.url)), "../public/game/flake.png");
writeFileSync(out, pngRgba(size, size, img));
console.log("baked", out);
