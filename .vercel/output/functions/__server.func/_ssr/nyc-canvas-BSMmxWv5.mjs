import { $ as RepeatWrapping, O as DataTexture, et as SRGBColorSpace, z as LinearMipmapLinearFilter } from "../_libs/three.mjs";
import { s as hash01 } from "./router-BJmaoFfx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/nyc-canvas-BSMmxWv5.js
/** NYC-only runtime DataTextures. Israel must not import this unless city==="nyc". */
function hexRgb(hex) {
	const h = hex.replace("#", "");
	return [
		parseInt(h.slice(0, 2), 16),
		parseInt(h.slice(2, 4), 16),
		parseInt(h.slice(4, 6), 16)
	];
}
function makeTex(w, h, fill) {
	const data = new Uint8Array(w * h * 4);
	const paint = (x0, y0, x1, y1, r, g, b) => {
		const xa = Math.max(0, Math.floor(x0));
		const ya = Math.max(0, Math.floor(y0));
		const xb = Math.min(w, Math.ceil(x1));
		const yb = Math.min(h, Math.ceil(y1));
		for (let y = ya; y < yb; y++) for (let x = xa; x < xb; x++) {
			const i = (y * w + x) * 4;
			data[i] = r;
			data[i + 1] = g;
			data[i + 2] = b;
			data[i + 3] = 255;
		}
	};
	fill(paint, data);
	const tex = new DataTexture(data, w, h);
	tex.colorSpace = SRGBColorSpace;
	tex.wrapS = tex.wrapT = RepeatWrapping;
	tex.anisotropy = 8;
	tex.flipY = true;
	tex.generateMipmaps = true;
	tex.minFilter = LinearMipmapLinearFilter;
	tex.needsUpdate = true;
	return tex;
}
function facadeTexture(theme, night) {
	const stone = theme === "stone";
	const jaffa = theme === "jaffa";
	const hwy = theme === "highway" || theme === "manhattan";
	const desert = theme === "desert";
	const port = theme === "port";
	const bau = theme === "bauhaus" || !stone && !jaffa && !hwy && !desert && !port;
	const base = stone ? hexRgb("#c4b090") : jaffa ? hexRgb("#c4a070") : hwy ? hexRgb("#1a3040") : desert ? hexRgb("#d4b48c") : port ? hexRgb("#b0a898") : hexRgb("#e8e0d4");
	return makeTex(256, 512, (paint) => {
		paint(0, 0, 256, 512, base[0], base[1], base[2]);
		if (stone) for (let y = 0; y < 512; y += 28) {
			const row = y % 56 === 0 ? hexRgb("#b8a07c") : hexRgb("#d0be9c");
			paint(0, y, 256, y + 26, row[0], row[1], row[2]);
			paint(0, y + 26, 256, y + 28, 138, 120, 96);
			for (let x = y / 28 % 2 * 40; x < 256; x += 80) if (night && hash01(x, y) > .62) paint(x + 18, y + 6, x + 36, y + 22, 255, 226, 160);
			else paint(x + 18, y + 6, x + 36, y + 22, 106, 88, 68);
		}
		else if (jaffa) for (let y = 20; y < 490; y += 72) for (let x = 8; x < 250; x += 64) {
			const warm = hash01(x, y) > .5 ? hexRgb("#d2b080") : hexRgb("#b89060");
			paint(x, y, x + 52, y + 58, warm[0], warm[1], warm[2]);
			paint(x + 14, y + 36, x + 38, y + 52, 42, 32, 24);
			paint(x + 20, y + 28, x + 32, y + 40, 42, 32, 24);
			if (night && hash01(x, y, 2) > .55) paint(x + 16, y + 30, x + 36, y + 50, 255, 208, 128);
		}
		else if (hwy) {
			paint(0, 0, 256, 512, 14, 36, 48);
			for (let y = 0; y < 512; y += 36) {
				paint(0, y, 256, y + 2, 106, 144, 160);
				for (let x = 4; x < 252; x += 32) if (night && hash01(x, y, 3) > .4) paint(x + 4, y + 6, x + 26, y + 32, 200, 232, 248);
				else paint(x + 4, y + 6, x + 26, y + 32, 26, 64, 80);
			}
			for (let x = 0; x < 256; x += 32) paint(x, 0, x + 2, 512, 138, 176, 192);
		} else {
			paint(0, 0, 256, 512, 239, 232, 220);
			for (let y = 12; y < 500; y += 56) {
				paint(0, y + 40, 256, y + 48, 216, 208, 196);
				if (night) paint(8, y + 10, 248, y + 32, 58, 68, 76);
				else paint(8, y + 10, 248, y + 32, 90, 104, 112);
				for (let x = 12; x < 240; x += 28) if (night && hash01(x, y, 4) > .48) paint(x, y + 12, x + 18, y + 30, 255, 232, 176);
				else if (bau) paint(x, y + 12, x + 18, y + 30, 154, 168, 176);
				else paint(x, y + 12, x + 18, y + 30, 112, 128, 138);
			}
			paint(0, 0, 256, 22, 200, 192, 180);
		}
		paint(0, 480, 256, 512, Math.floor(base[0] * .84), Math.floor(base[1] * .84), Math.floor(base[2] * .84));
	});
}
function windowEmitTexture() {
	return makeTex(256, 512, (paint) => {
		paint(0, 0, 256, 512, 0, 0, 0);
		for (let y = 0; y < 10; y++) for (let x = 0; x < 5; x++) if (hash01(x, y, 11) > .28) {
			const cool = hash01(x, y, 13) > .62;
			paint(16 + x * 48, 48 + y * 44, 40 + x * 48, 74 + y * 44, cool ? 154 : 255, cool ? 224 : 208, cool ? 255 : 137);
		}
	});
}
var GLYPH = {
	" ": [
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	R: [
		30,
		17,
		17,
		30,
		20,
		18,
		17
	],
	U: [
		17,
		17,
		17,
		17,
		17,
		17,
		14
	],
	S: [
		14,
		17,
		16,
		14,
		1,
		17,
		14
	],
	H: [
		17,
		17,
		17,
		31,
		17,
		17,
		17
	],
	P: [
		30,
		17,
		17,
		30,
		16,
		16,
		16
	],
	L: [
		16,
		16,
		16,
		16,
		16,
		16,
		31
	],
	E: [
		31,
		16,
		16,
		30,
		16,
		16,
		31
	],
	T: [
		31,
		4,
		4,
		4,
		4,
		4,
		4
	],
	V: [
		17,
		17,
		17,
		17,
		10,
		10,
		4
	],
	"0": [
		14,
		17,
		19,
		21,
		25,
		17,
		14
	],
	"1": [
		4,
		12,
		4,
		4,
		4,
		4,
		14
	],
	"י": [
		1,
		1,
		1,
		1,
		1,
		0,
		0
	],
	"פ": [
		31,
		1,
		1,
		15,
		1,
		1,
		1
	],
	"ו": [
		1,
		1,
		1,
		1,
		1,
		1,
		1
	]
};
function adBoardTexture(bg, fg, t) {
	const [br, bgc, bb] = hexRgb(bg);
	const [fr, fgC, fb] = hexRgb(fg);
	return makeTex(512, 256, (paint) => {
		paint(0, 0, 512, 256, br, bgc, bb);
		const chars = [...t];
		const gw = 28;
		const gh = 40;
		const total = chars.length * 36;
		let x = Math.floor((512 - total) / 2);
		const y0 = 108;
		for (const ch of chars) {
			const rows = GLYPH[ch] ?? GLYPH[" "];
			for (let row = 0; row < 7; row++) {
				const bits = rows[row] ?? 0;
				for (let col = 0; col < 5; col++) if (bits & 1 << 4 - col) {
					const px = x + col * (gw / 5);
					const py = y0 + row * (gh / 7);
					paint(px, py, px + gw / 5 - 1, py + gh / 7 - 1, fr, fgC, fb);
				}
			}
			x += 36;
		}
	});
}
//#endregion
export { adBoardTexture, facadeTexture, windowEmitTexture };
