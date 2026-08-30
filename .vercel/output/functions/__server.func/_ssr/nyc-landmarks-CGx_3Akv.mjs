import { D as CylinderGeometry, G as MeshStandardMaterial, H as MeshBasicMaterial, O as DataTexture, S as CircleGeometry, T as ConeGeometry, V as Mesh, W as MeshPhysicalMaterial, X as PointLight, et as SRGBColorSpace, lt as Vector3, ot as TorusGeometry, rt as SphereGeometry, y as BoxGeometry } from "../_libs/three.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/nyc-landmarks-CGx_3Akv.js
function hslRgb(h, s, l) {
	const sat = s / 100;
	const lit = l / 100;
	const a = sat * Math.min(lit, 1 - lit);
	const f = (n) => {
		const k = (n + h / 30) % 12;
		return lit - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
	};
	return [
		Math.round(f(0) * 255),
		Math.round(f(8) * 255),
		Math.round(f(4) * 255)
	];
}
function ledTexture(hue) {
	const w = 128;
	const h = 256;
	const data = new Uint8Array(w * h * 4);
	const paint = (x0, y0, x1, y1, rgb) => {
		for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) {
			const i = (y * w + x) * 4;
			data[i] = rgb[0];
			data[i + 1] = rgb[1];
			data[i + 2] = rgb[2];
			data[i + 3] = 255;
		}
	};
	paint(0, 0, w, h, hslRgb(hue, 70, 18));
	for (let i = 0; i < 18; i++) paint(8, 8 + i * 13, 120, 19 + i * 13, hslRgb((hue + i * 17) % 360, 85, 38 + i % 4 * 10));
	const tex = new DataTexture(data, w, h);
	tex.colorSpace = SRGBColorSpace;
	tex.flipY = true;
	tex.needsUpdate = true;
	return tex;
}
function addNycLandmarks(group, def, bag, shadows, isNight, glows, emitList, colliders) {
	if (def.city !== "nyc") return;
	const add = (mesh) => {
		mesh.castShadow = shadows;
		mesh.receiveShadow = true;
		group.add(mesh);
		bag.push(mesh.geometry);
		if (Array.isArray(mesh.material)) mesh.material.forEach((m) => bag.push(m));
		else bag.push(mesh.material);
	};
	const glowAt = (x, y, z, color, on, dist) => {
		if (!shadows) return;
		const pl = new PointLight(color, isNight ? on : 0, dist, 2);
		pl.position.set(x, y, z);
		group.add(pl);
		glows.push({
			light: pl,
			on
		});
	};
	const hit = (x, z, r) => {
		colliders.push({
			x,
			z,
			r,
			kind: "building"
		});
	};
	const lime = new MeshStandardMaterial({
		color: 14209218,
		roughness: .62,
		metalness: .12,
		envMapIntensity: .55
	});
	const glass = new MeshPhysicalMaterial({
		color: 6983848,
		roughness: .06,
		metalness: .88,
		envMapIntensity: 2.1,
		clearcoat: 1,
		clearcoatRoughness: .06,
		emissive: 1720416,
		emissiveIntensity: isNight ? .38 : 0
	});
	const glassBlue = new MeshPhysicalMaterial({
		color: 4881048,
		roughness: .05,
		metalness: .9,
		envMapIntensity: 2.2,
		emissive: 1325136,
		emissiveIntensity: isNight ? .42 : 0
	});
	const steel = new MeshPhysicalMaterial({
		color: 13160662,
		metalness: .92,
		roughness: .18,
		envMapIntensity: 1.7,
		clearcoat: .5
	});
	const granite = new MeshStandardMaterial({
		color: 9077880,
		roughness: .82,
		envMapIntensity: .35
	});
	const brick = new MeshStandardMaterial({
		color: 9062970,
		roughness: .84,
		envMapIntensity: .3
	});
	const darkBrick = new MeshStandardMaterial({
		color: 4861992,
		roughness: .8,
		envMapIntensity: .28
	});
	const copper = new MeshPhysicalMaterial({
		color: 3836522,
		metalness: .72,
		roughness: .32,
		envMapIntensity: 1.2,
		emissive: 667680,
		emissiveIntensity: isNight ? .18 : 0
	});
	const gold = new MeshPhysicalMaterial({
		color: 13934628,
		metalness: .92,
		roughness: .16,
		envMapIntensity: 1.9,
		emissive: 13934628,
		emissiveIntensity: isNight ? .6 : .08
	});
	const white = new MeshStandardMaterial({
		color: 15657698,
		roughness: .48,
		metalness: .16,
		envMapIntensity: .7
	});
	const redGlass = new MeshPhysicalMaterial({
		color: 12591144,
		roughness: .12,
		metalness: .2,
		transparent: true,
		opacity: .88,
		emissive: 8392728,
		emissiveIntensity: isNight ? .85 : .12
	});
	bag.push(lime, glass, glassBlue, steel, granite, brick, darkBrick, copper, gold, white, redGlass);
	emitList.push({
		mat: glass,
		night: .38,
		day: 0
	}, {
		mat: glassBlue,
		night: .42,
		day: 0
	}, {
		mat: gold,
		night: .6,
		day: .08
	}, {
		mat: copper,
		night: .18,
		day: 0
	}, {
		mat: redGlass,
		night: .85,
		day: .12
	});
	const box = (sx, sy, sz, mat, x, y, z, rot = 0) => {
		const m = new Mesh(new BoxGeometry(sx, sy, sz), mat);
		m.position.set(x, y, z);
		m.rotation.y = rot;
		add(m);
		return m;
	};
	const cyl = (rt, rb, h, seg, mat, x, y, z) => {
		const m = new Mesh(new CylinderGeometry(rt, rb, h, seg), mat);
		m.position.set(x, y, z);
		add(m);
		return m;
	};
	const empire = (x, z) => {
		box(22, 18, 22, lime, x, 9, z);
		box(16, 36, 16, lime, x, 36, z);
		box(11, 24, 11, lime, x, 66, z);
		box(7, 14, 7, lime, x, 85, z);
		cyl(.55, .7, 22, 8, steel, x, 103, z);
		glowAt(x, 108, z, 16771264, 48, 46);
		hit(x, z, 12);
	};
	const chrysler = (x, z) => {
		box(16, 22, 16, steel, x, 11, z);
		box(12, 40, 12, steel, x, 42, z);
		cyl(7.4, 8.2, 8, 16, steel, x, 66, z);
		cyl(5.2, 6.4, 6, 16, steel, x, 73, z);
		cyl(3.2, 4.4, 5, 12, steel, x, 78.5, z);
		cyl(.4, .55, 18, 8, steel, x, 90, z);
		glowAt(x, 92, z, 13166847, 42, 40);
		hit(x, z, 9);
	};
	const oneWtc = (x, z) => {
		box(16, 108, 16, glassBlue, x, 54, z);
		cyl(.45, .6, 28, 8, steel, x, 122, z);
		glowAt(x, 126, z, 10540287, 56, 52);
		hit(x, z, 10);
	};
	const liberty = (x, z) => {
		box(10, 12, 10, granite, x, 6, z);
		box(7.2, 8, 7.2, granite, x, 16, z);
		cyl(2.4, 3.1, 10, 10, copper, x, 25, z);
		cyl(1.6, 2.2, 4, 8, copper, x, 32, z);
		const head = new Mesh(new SphereGeometry(1.5, 10, 8), copper);
		head.position.set(x, 35.2, z);
		add(head);
		const arm = new Mesh(new CylinderGeometry(.35, .45, 7, 6), copper);
		arm.position.set(x + 2.4, 32, z);
		arm.rotation.z = -.7;
		add(arm);
		const torch = new Mesh(new SphereGeometry(.7, 8, 8), gold);
		torch.position.set(x + 4.4, 35.4, z);
		add(torch);
		glowAt(x + 4.4, 35.4, z, 16764006, 36, 28);
		hit(x, z, 7);
	};
	const gothicTower = (x, z) => {
		const d = 12.4;
		for (const side of [-1, 1]) {
			box(7.2, 46, 5.6, granite, x, 23, z + d * side);
			const cap = new Mesh(new ConeGeometry(3.2, 9, 4), granite);
			cap.position.set(x, 51, z + d * side);
			cap.rotation.y = Math.PI / 4;
			add(cap);
		}
		box(8.4, 5.5, 30, granite, x, 48, z);
		glowAt(x, 50, z, 16770736, 30, 28);
		hit(x, z - 12.4, 5.2);
		hit(x, z + 12.4, 5.2);
	};
	const cable = (x1, y1, z1, x2, y2, z2) => {
		const a = new Vector3(x1, y1, z1);
		const b = new Vector3(x2, y2, z2);
		const dir = b.clone().sub(a);
		const len = dir.length();
		if (len < .4) return;
		const m = new Mesh(new CylinderGeometry(.07, .07, len, 4), steel);
		m.position.copy(a).add(b).multiplyScalar(.5);
		m.quaternion.setFromUnitVectors(new Vector3(0, 1, 0), dir.normalize());
		add(m);
	};
	if (def.id === "centralpark") {
		cyl(4.2, 4.6, .7, 20, granite, 8, .4, -8);
		cyl(1.1, 1.4, 3.2, 10, copper, 8, 2.2, -8);
		const angel = new Mesh(new SphereGeometry(.9, 8, 8), copper);
		angel.position.set(8, 4.4, -8);
		add(angel);
		const deck = new Mesh(new BoxGeometry(18, .5, 3.2), darkBrick);
		deck.position.set(-18, 1.4, 2);
		add(deck);
		const arch = new Mesh(new TorusGeometry(3.4, .45, 8, 16, Math.PI), granite);
		arch.rotation.z = Math.PI;
		arch.position.set(-18, 1.2, 2);
		add(arch);
		box(10, 8, 8, granite, -6, 8, 28);
		const keep = new Mesh(new ConeGeometry(4.2, 5.5, 4), granite);
		keep.position.set(-6, 14.6, 28);
		keep.rotation.y = Math.PI / 4;
		add(keep);
		cyl(.7, .8, 7, 8, granite, -2.2, 11, 30);
		box(38, 16, 14, lime, 72, 8, 38);
		box(22, 6, 8, lime, 72, 19, 38);
		for (let i = 0; i < 6; i++) cyl(.55, .55, 10, 8, lime, 58 + i * 5.2, 5, 30);
		cyl(9, 6.2, 4.5, 24, white, 72, 3.2, 88);
		cyl(11, 8, 5.5, 24, white, 72, 8, 88);
		cyl(13, 10, 6, 24, white, 72, 13.6, 88);
		box(18, 22, 18, darkBrick, -72, 11, -8);
		for (let i = 0; i < 4; i++) {
			const gx = (i % 2 * 2 - 1) * 7;
			const gz = (Math.floor(i / 2) * 2 - 1) * 7;
			box(3.2, 8, 3.2, darkBrick, -72 + gx, 18, -8 + gz);
			const gable = new Mesh(new ConeGeometry(2.4, 3.4, 4), darkBrick);
			gable.position.set(-72 + gx, 23.4, -8 + gz);
			gable.rotation.y = Math.PI / 4;
			add(gable);
		}
		box(20, 28, 14, lime, 12, 14, -148);
		box(16, 6, 12, copper, 12, 31, -148);
		box(14, 52, 12, glass, -68, 26, -128, .35);
		box(14, 52, 12, glass, -52, 26, -128, -.35);
		cyl(.7, .9, 16, 8, granite, -48, 8, -122);
		const columbus = new Mesh(new SphereGeometry(.8, 8, 8), gold);
		columbus.position.set(-48, 17, -122);
		add(columbus);
		box(16, 12, 10, lime, 58, 6, -118);
		glowAt(8, 5, -8, 13172712, 22, 20);
		glowAt(72, 16, 88, 15920872, 24, 22);
	}
	if (def.id === "timessquare") {
		box(10, 48, 8, glass, 2, 24, 10);
		const screens = [
			2780415,
			16726634,
			16761165,
			3858624,
			16734762,
			12602879
		];
		for (let i = 0; i < 6; i++) {
			const tex = ledTexture(i * 52);
			bag.push(tex);
			const mat = new MeshBasicMaterial({
				map: tex,
				color: screens[i]
			});
			bag.push(mat);
			const bill = new Mesh(new BoxGeometry(7.2, 5.4, .35), mat);
			const side = i % 2 === 0 ? 1 : -1;
			bill.position.set(2 + side * 5.4, 10 + i * 5.6, 10 + i % 3 * .4);
			bill.rotation.y = side > 0 ? Math.PI / 2 : -Math.PI / 2;
			group.add(bill);
		}
		for (let i = 0; i < def.points.length; i++) {
			const p = def.points[i];
			const n = def.points[(i + 1) % def.points.length];
			const dx = n.x - p.x;
			const dz = n.z - p.z;
			const len = Math.hypot(dx, dz) || 1;
			const nx = -dz / len;
			const nz = dx / len;
			const yaw = Math.atan2(dx, dz);
			const hangTex = ledTexture(i * 47 % 360);
			bag.push(hangTex);
			const hangMat = new MeshBasicMaterial({
				map: hangTex,
				color: screens[i % screens.length]
			});
			bag.push(hangMat);
			const hang = new Mesh(new BoxGeometry(Math.min(9, len * .7), 3.4, .28), hangMat);
			hang.position.set((p.x + n.x) * .5, 10.4, (p.z + n.z) * .5);
			hang.rotation.y = yaw;
			group.add(hang);
			if (i % 2 === 0) glowAt((p.x + n.x) * .5, 10.4, (p.z + n.z) * .5, screens[i % screens.length], 28, 16);
			const curb = def.width / 2 + 1.55;
			const totemTex = ledTexture((i * 29 + 80) % 360);
			bag.push(totemTex);
			const totemMat = new MeshBasicMaterial({
				map: totemTex,
				color: screens[(i + 3) % screens.length]
			});
			bag.push(totemMat);
			const side = i % 2 === 0 ? 1 : -1;
			const totem = new Mesh(new BoxGeometry(1.15, 7.2, .22), totemMat);
			totem.position.set(p.x + nx * curb * side, 4.1, p.z + nz * curb * side);
			totem.rotation.y = yaw;
			group.add(totem);
		}
		box(6, 3.2, 10, redGlass, 0, 1.8, 36);
		box(5.2, 2.6, 8, redGlass, 0, 3.6, 37.4);
		box(4.4, 2.2, 6, redGlass, 0, 5.2, 38.6);
		box(18, 36, 10, glass, -14, 18, 22);
		box(14, 28, 12, lime, 10, 14, 20);
		cyl(2.4, 2.4, 2, 16, gold, 10, 30, 20);
		box(22, 62, 16, lime, 8, 31, 98);
		const rink = new Mesh(new BoxGeometry(16, .2, 12), new MeshPhysicalMaterial({
			color: 11065576,
			roughness: .06,
			metalness: .2,
			envMapIntensity: 1.8
		}));
		rink.position.set(8, .2, 86);
		add(rink);
		const promo = new Mesh(new SphereGeometry(1.4, 10, 8), gold);
		promo.position.set(8, 2.2, 86);
		add(promo);
		box(28, 14, 16, lime, 68, 7, 6);
		for (let i = 0; i < 8; i++) cyl(.5, .5, 11, 8, lime, 56 + i * 3.2, 5.5, -2);
		const lionL = new Mesh(new BoxGeometry(2.4, 1.6, 4.2), granite);
		lionL.position.set(58, 1, -8);
		add(lionL);
		const lionR = new Mesh(new BoxGeometry(2.4, 1.6, 4.2), granite);
		lionR.position.set(78, 1, -8);
		add(lionR);
		box(22, 8, 16, granite, -52, 4, 4);
		empire(18, -88);
		chrysler(78, -40);
		box(12, 40, 10, glass, -36, 20, 54);
		box(10, 44, 10, glass, 28, 22, 44);
		glowAt(2, 40, 10, 16731533, 70, 48);
		glowAt(2, 28, 10, 5082623, 58, 40);
		glowAt(8, 64, 98, 16769200, 40, 36);
	}
	if (def.id === "brooklynbridge") {
		gothicTower(-22, 4);
		gothicTower(52, -8);
		const yTop = 51;
		cable(-22, yTop, 4, 16, 28, -2);
		cable(-22, yTop, 4, -58, 8, 10);
		cable(52, yTop, -8, 16, 28, -2);
		cable(52, yTop, -8, 88, 8, -22);
		for (let i = 1; i < 8; i++) {
			const t = i / 8;
			const x = -22 + 38 * t;
			const z = 4 + -6 * t;
			const sag = 18 * (1 - (2 * t - 1) ** 2);
			cable(x, 49, z, x, 8 + sag * .35, z);
			const x2 = 16 + 36 * t;
			const z2 = -2 + -6 * t;
			cable(x2, 49, z2, x2, 8 + sag * .35, z2);
		}
		oneWtc(-88, -18);
		box(12, 58, 12, lime, -70, 29, 8);
		cyl(3.2, 3.6, 12, 8, copper, -70, 64, 8);
		box(22, 28, 16, lime, -96, 14, 18);
		box(18, 8, 22, brick, 112, 4, 8);
		box(16, 10, 18, brick, 118, 5, 22);
		box(14, 9, 16, brick, 104, 4.5, 32);
		box(8, .4, 22, granite, 118, .3, 40);
		liberty(-130, -70);
		const ferry = new Mesh(new BoxGeometry(8, 2.2, 18), white);
		ferry.position.set(-40, 1.2, 70);
		add(ferry);
		glowAt(-22, 48, 4, 16770736, 34, 30);
		glowAt(52, 48, -8, 16770736, 34, 30);
	}
	if (def.id === "manhattan") {
		liberty(-40, -208);
		oneWtc(-18, -128);
		box(12, 58, 12, lime, -8, 29, -108);
		cyl(3, 3.4, 10, 8, copper, -8, 63, -108);
		gothicTower(46, -112);
		gothicTower(62, -96);
		const flat = new Mesh(new CylinderGeometry(7.4, 7.4, 42, 3), lime);
		flat.position.set(-6, 21, -48);
		flat.rotation.y = .45;
		add(flat);
		empire(8, 8);
		chrysler(32, 22);
		box(8, 48, 22, glassBlue, 52, 24, 36);
		const assembly = new Mesh(new SphereGeometry(7, 14, 10, 0, Math.PI * 2, 0, Math.PI / 2), white);
		assembly.position.set(44, 4, 28);
		add(assembly);
		box(10, 36, 8, glass, -12, 18, 18);
		box(22, 58, 14, lime, -4, 29, 32);
		box(38, 14, 14, lime, 32, 7, 88);
		cyl(8, 6, 4, 20, white, 32, 3, 108);
		cyl(11, 8, 5, 20, white, 32, 7.5, 108);
		box(16, 20, 16, darkBrick, -32, 10, 52);
		const parkLake = new Mesh(new CircleGeometry(12, 20), new MeshPhysicalMaterial({
			color: 1726552,
			roughness: .08,
			metalness: .15,
			envMapIntensity: 1.6
		}));
		parkLake.rotation.x = -Math.PI / 2;
		parkLake.position.set(-6, .05, 86);
		add(parkLake);
		glowAt(8, 108, 8, 16771264, 52, 50);
		glowAt(32, 92, 22, 13166847, 44, 42);
		glowAt(-18, 126, -128, 10540287, 58, 54);
		glowAt(-40, 36, -208, 16764006, 32, 26);
	}
}
//#endregion
export { addNycLandmarks };
