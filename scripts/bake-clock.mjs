#!/usr/bin/env node
/** Bake Jaffa clock face. Still drawn, not a photo. */
import { deflateSync } from "node:zlib";
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const W = 256;
const img = Buffer.alloc(W * W * 4);

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
  const idat = deflateSync(raw);
  const iend = Buffer.alloc(0);
  return Buffer.concat([sig, chunk("IHDR", ihdr), chunk("IDAT", idat), chunk("IEND", iend)]);
}
function setPx(x, y, r, g, b, a = 255) {
  if (x < 0 || y < 0 || x >= W || y >= W) return;
  const i = (y * W + x) * 4;
  img[i] = r;
  img[i + 1] = g;
  img[i + 2] = b;
  img[i + 3] = a;
}
function disc(cx, cy, rad, r, g, b) {
  const r2 = rad * rad;
  for (let y = -rad; y <= rad; y++)
    for (let x = -rad; x <= rad; x++) if (x * x + y * y <= r2) setPx(cx + x, cy + y, r, g, b);
}
function ring(cx, cy, rad, t, r, g, b) {
  for (let y = -rad - t; y <= rad + t; y++)
    for (let x = -rad - t; x <= rad + t; x++) {
      const d = Math.sqrt(x * x + y * y);
      if (d >= rad - t && d <= rad + t) setPx(cx + x, cy + y, r, g, b);
    }
}
function line(x0, y0, x1, y1, w, r, g, b) {
  const n = Math.max(2, Math.hypot(x1 - x0, y1 - y0) | 0);
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const x = x0 + (x1 - x0) * t;
    const y = y0 + (y1 - y0) * t;
    disc(x | 0, y | 0, w, r, g, b);
  }
}

disc(128, 128, 120, 244, 238, 224);
ring(128, 128, 118, 4, 42, 36, 24);
for (let i = 0; i < 12; i++) {
  const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
  disc((128 + Math.cos(a) * 96) | 0, (128 + Math.sin(a) * 96) | 0, i % 3 === 0 ? 6 : 3, 42, 36, 24);
}
line(128, 128, 128, 58, 3, 26, 24, 20);
line(128, 128, 178, 128, 2, 26, 24, 20);
disc(128, 128, 5, 26, 24, 20);

const out = join(dirname(fileURLToPath(import.meta.url)), "../public/game/jaffa-clock.png");
writeFileSync(out, pngRgba(W, W, img));
console.log("baked", out);
