#!/usr/bin/env node
/** Bake traffic signs. Drawn, not photos. */
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
const W = 256;
function blank() {
  return Buffer.alloc(W * W * 4);
}
function setPx(img, x, y, r, g, b, a = 255) {
  x |= 0;
  y |= 0;
  if (x < 0 || y < 0 || x >= W || y >= W) return;
  const i = (y * W + x) * 4;
  img[i] = r;
  img[i + 1] = g;
  img[i + 2] = b;
  img[i + 3] = a;
}
function fillPoly(img, pts, rgb) {
  let minY = W, maxY = 0;
  for (const p of pts) {
    minY = Math.min(minY, p[1]);
    maxY = Math.max(maxY, p[1]);
  }
  for (let y = minY; y <= maxY; y++) {
    const xs = [];
    for (let i = 0; i < pts.length; i++) {
      const a = pts[i], b = pts[(i + 1) % pts.length];
      if ((a[1] <= y && b[1] > y) || (b[1] <= y && a[1] > y)) {
        xs.push(a[0] + ((y - a[1]) * (b[0] - a[0])) / (b[1] - a[1]));
      }
    }
    xs.sort((p, q) => p - q);
    for (let i = 0; i < xs.length; i += 2) {
      const x0 = Math.floor(xs[i]), x1 = Math.ceil(xs[i + 1] ?? xs[i]);
      for (let x = x0; x <= x1; x++) setPx(img, x, y, rgb[0], rgb[1], rgb[2]);
    }
  }
}
function disc(img, cx, cy, rad, rgb) {
  const r2 = rad * rad;
  for (let y = -rad; y <= rad; y++)
    for (let x = -rad; x <= rad; x++) if (x * x + y * y <= r2) setPx(img, cx + x, cy + y, rgb[0], rgb[1], rgb[2]);
}
function ring(img, cx, cy, rad, t, rgb) {
  for (let y = -rad - t; y <= rad + t; y++)
    for (let x = -rad - t; x <= rad + t; x++) {
      const d = Math.sqrt(x * x + y * y);
      if (d >= rad - t && d <= rad + t) setPx(img, cx + x, cy + y, rgb[0], rgb[1], rgb[2]);
    }
}
function fillRect(img, x0, y0, x1, y1, rgb) {
  for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) setPx(img, x, y, rgb[0], rgb[1], rgb[2]);
}

const red = [200, 16, 46], white = [255, 255, 255], black = [17, 17, 17];
const dir = join(dirname(fileURLToPath(import.meta.url)), "../public/game");

function stop() {
  const img = blank();
  const r = 118;
  const pts = [];
  for (let i = 0; i < 8; i++) {
    const a = Math.PI / 8 + (i * Math.PI) / 4;
    pts.push([128 + Math.cos(a) * r, 128 + Math.sin(a) * r]);
  }
  fillPoly(img, pts, red);
  const inner = pts.map((p) => [128 + (p[0] - 128) * 0.88, 128 + (p[1] - 128) * 0.88]);
  fillPoly(img, inner, white);
  const core = pts.map((p) => [128 + (p[0] - 128) * 0.78, 128 + (p[1] - 128) * 0.78]);
  fillPoly(img, core, red);
  return img;
}
function yieldSign() {
  const img = blank();
  fillPoly(img, [[128, 28], [228, 220], [28, 220]], red);
  fillPoly(img, [[128, 58], [200, 200], [56, 200]], white);
  return img;
}
function none() {
  const img = blank();
  disc(img, 128, 128, 110, red);
  fillRect(img, 38, 112, 218, 144, white);
  return img;
}
function speed(n) {
  const img = blank();
  disc(img, 128, 128, 118, white);
  ring(img, 128, 128, 107, 11, red);
  const s = String(n);
  let x = 128 - s.length * 28;
  for (const ch of s) {
    digit(img, x, 78, ch);
    x += 56;
  }
  return img;
}
function digit(img, x, y, ch) {
  const segs = {
    "5": [1, 1, 0, 1, 0, 1, 1],
    "0": [1, 1, 1, 0, 1, 1, 1],
    "8": [1, 1, 1, 1, 1, 1, 1],
    "9": [1, 1, 1, 1, 0, 1, 1],
  }[ch] || [1, 1, 1, 1, 1, 1, 1];
  const [a, b, c, d, e, f, g] = segs;
  const w = 36, h = 44, t = 8;
  if (a) fillRect(img, x, y, x + w, y + t, black);
  if (b) fillRect(img, x + w - t, y, x + w, y + h, black);
  if (c) fillRect(img, x + w - t, y + h, x + w, y + h * 2, black);
  if (d) fillRect(img, x, y + h - t / 2, x + w, y + h + t / 2, black);
  if (e) fillRect(img, x, y + h, x + t, y + h * 2, black);
  if (f) fillRect(img, x, y, x + t, y + h, black);
  if (g) fillRect(img, x, y + h * 2 - t, x + w, y + h * 2, black);
}

const files = {
  "sign-stop.png": stop(),
  "sign-yield.png": yieldSign(),
  "sign-none.png": none(),
  "sign-speed50.png": speed(50),
  "sign-speed80.png": speed(80),
  "sign-speed90.png": speed(90),
};
for (const [name, img] of Object.entries(files)) writeFileSync(join(dir, name), pngRgba(W, W, img));
console.log("baked signs");
