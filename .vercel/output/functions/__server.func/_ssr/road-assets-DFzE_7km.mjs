import { $ as RepeatWrapping, C as ClampToEdgeWrapping, at as TextureLoader, et as SRGBColorSpace } from "../_libs/three.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/road-assets-DFzE_7km.js
var kits = /* @__PURE__ */ new Map();
function getBakedRoad(lanes) {
	const n = lanes >= 8 ? 8 : lanes >= 4 ? 4 : lanes >= 3 ? 3 : 0;
	return n ? kits.get(n) : void 0;
}
function getAyalonRoad() {
	return kits.get(8);
}
function prep(tex, srgb) {
	tex.wrapS = ClampToEdgeWrapping;
	tex.wrapT = RepeatWrapping;
	tex.anisotropy = srgb ? 16 : 8;
	tex.colorSpace = srgb ? SRGBColorSpace : "";
	tex.needsUpdate = true;
	return tex;
}
async function loadLane(n) {
	if (kits.has(n)) return kits.get(n);
	const L = new TextureLoader();
	const [map, roughnessMap, bumpMap] = await Promise.all([
		L.loadAsync(`/game/asphalt-${n}.png`),
		L.loadAsync(`/game/asphalt-${n}-rough.png`),
		L.loadAsync(`/game/asphalt-${n}-bump.png`)
	]);
	const kit = {
		map: prep(map, true),
		roughnessMap: prep(roughnessMap, false),
		bumpMap: prep(bumpMap, false)
	};
	kits.set(n, kit);
	return kit;
}
/** Baked procedural PNGs. Not photogrammetry. */
async function loadAyalonRoad() {
	return loadLane(8);
}
async function loadRoadFor(trackId) {
	if (trackId === "ayalon") return loadLane(8);
	if (trackId === "hw1" || trackId === "hw2" || trackId === "hw6" || trackId === "hw40" || trackId === "hw90") return loadLane(4);
	return loadLane(3);
}
//#endregion
export { getAyalonRoad, getBakedRoad, loadAyalonRoad, loadRoadFor };
