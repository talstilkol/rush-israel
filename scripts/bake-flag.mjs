#!/usr/bin/env node
/** Bake Israeli flag. Drawn, not a photo. */
import { deflateSync } from "node:zlib";
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const W = 256;
const H = 160;
const img = Buffer.alloc(W * H * 4);

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
  if (x < 0 || y < 0 || x >= W || y >= H) return;
  const i = (y * W + x) * 4;
  img[i] = r;
  img[i + 1] = g;
  img[i + 2] = b;
  img[i + 3] = 255;
}
function fillRect(x0, y0, x1, y1, r, g, b) {
  for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) setPx(x, y, r, g, b);
}
function line(x0, y0, x1, y1, w, r, g, b) {
  const n = Math.max(2, Math.hypot(x1 - x0, y1 - y0) | 0);
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const cx = x0 + (x1 - x0) * t;
    const cy = y0 + (y1 - y0) * t;
    for (let dy = -w; dy <= w; dy++) for (let dx = -w; dx <= w; dx++) setPx((cx + dx) | 0, (cy + dy) | 0, r, g, b);
  }
}

fillRect(0, 0, W, H, 247, 247, 247);
fillRect(0, 22, W, 44, 0, 56, 184);
fillRect(0, 116, W, 138, 0, 56, 184);
const cx = 128, cy = 80, rad = 28;
const pts = [];
for (let i = 0; i < 6; i++) {
  const a = -Math.PI / 2 + (i * Math.PI) / 3;
  pts.push([cx + Math.cos(a) * rad, cy + Math.sin(a) * rad]);
}
for (let i = 0; i < 6; i++) {
  const a = pts[i];
  const b = pts[(i + 1) % 6];
  line(a[0], a[1], b[0], b[1], 2, 0, 56, 184);
}

const out = join(dirname(fileURLToPath(import.meta.url)), "../public/game/israel-flag.png");
writeFileSync(out, pngRgba(W, H, img));
console.log("baked", out);
