#!/usr/bin/env node
/** Bake lens-flare sprites. Drawn radials. */
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
function flare(size, inner, outer) {
  const img = Buffer.alloc(size * size * 4);
  const cx = size / 2;
  for (let y = 0; y < size; y++)
    for (let x = 0; x < size; x++) {
      const u = Math.hypot(x - cx, y - cx) / cx;
      let r, g, b, a;
      if (u <= 0) {
        [r, g, b, a] = inner;
      } else if (u < 0.18) {
        const t = u / 0.18;
        r = lerp(inner[0], outer[0], t);
        g = lerp(inner[1], outer[1], t);
        b = lerp(inner[2], outer[2], t);
        a = lerp(inner[3], outer[3], t);
      } else {
        const t = (u - 0.18) / 0.82;
        r = lerp(outer[0], 0, t);
        g = lerp(outer[1], 0, t);
        b = lerp(outer[2], 0, t);
        a = lerp(outer[3], 0, t);
      }
      const i = (y * size + x) * 4;
      img[i] = r;
      img[i + 1] = g;
      img[i + 2] = b;
      img[i + 3] = Math.max(0, Math.min(255, a));
    }
  return pngRgba(size, size, img);
}

const dir = join(dirname(fileURLToPath(import.meta.url)), "../public/game");
writeFileSync(join(dir, "flare-0.png"), flare(128, [255, 248, 230, 242], [255, 210, 140, 71]));
writeFileSync(join(dir, "flare-1.png"), flare(64, [255, 180, 90, 115], [255, 120, 40, 0]));
console.log("baked flares");
