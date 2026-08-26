#!/usr/bin/env node
/** Bake Jerusalem stone. Procedural, not photogrammetry. */
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
  return Buffer.concat([sig, chunk("IHDR", ihdr), chunk("IDAT", deflateSync(raw)), chunk("IEND", Buffer.alloc(0))]);
}
function setPx(x, y, r, g, b) {
  if (x < 0 || y < 0 || x >= W || y >= W) return;
  const i = (y * W + x) * 4;
  img[i] = r;
  img[i + 1] = g;
  img[i + 2] = b;
  img[i + 3] = 255;
}
function fillRect(x0, y0, x1, y1, r, g, b) {
  for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) setPx(x, y, r, g, b);
}

fillRect(0, 0, W, W, 138, 122, 98);
for (let row = 0; row < 8; row++) {
  const h = 32;
  const off = row % 2 ? 20 : 0;
  for (let col = -1; col < 6; col++) {
    const x = col * 48 + off;
    const y = row * h;
    const light = row % 3 === 0;
    fillRect(x + 2, y + 2, x + 46, y + 30, light ? 196 : 184, light ? 180 : 164, light ? 150 : 130);
    fillRect(x + 2, y + h - 6, x + 46, y + h - 3, 40, 32, 22);
  }
}
const out = join(dirname(fileURLToPath(import.meta.url)), "../public/game/herodian.png");
writeFileSync(out, pngRgba(W, W, img));
console.log("baked", out);
