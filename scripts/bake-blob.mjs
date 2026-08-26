#!/usr/bin/env node
/** Bake car blob-shadow. Drawn radial, not a photo. */
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

const W = 128;
const img = Buffer.alloc(W * W * 4);
for (let y = 0; y < W; y++)
  for (let x = 0; x < W; x++) {
    const dx = x - 64;
    const dy = y - 64;
    const d = Math.sqrt(dx * dx + dy * dy);
    let a = 0;
    if (d <= 6) a = 0.78;
    else if (d <= 62) {
      const t = (d - 6) / 56;
      a = t < 0.38 ? 0.78 + (0.38 - 0.78) * (t / 0.38) : t < 0.72 ? 0.38 + (0.1 - 0.38) * ((t - 0.38) / 0.34) : 0.1 * (1 - (t - 0.72) / 0.28);
    }
    const i = (y * W + x) * 4;
    img[i] = img[i + 1] = img[i + 2] = 0;
    img[i + 3] = Math.max(0, Math.min(255, a * 255));
  }
const out = join(dirname(fileURLToPath(import.meta.url)), "../public/game/blob.png");
writeFileSync(out, pngRgba(W, W, img));
console.log("baked", out);
