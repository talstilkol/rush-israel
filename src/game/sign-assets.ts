import * as THREE from "three";

const kits = new Map<string, THREE.Texture>();
const GANTRY = [
  "gantry-kibbutz-galuyot",
  "gantry-hahagana",
  "gantry-laguardia",
  "gantry-hashalom",
  "gantry-savidor-center",
  "gantry-university",
  "stn-galuyot",
  "stn-hagana",
  "stn-shalom",
  "stn-savidor",
  "stn-uni",
  "dest-rail",
] as const;

export function getSign(kind: string) {
  return kits.get(kind);
}

export function getGantry(id: string) {
  return kits.get(id);
}

export async function loadSigns() {
  if (kits.size) return;
  const L = new THREE.TextureLoader();
  const names = ["stop", "yield", "none", "speed50", "speed80", "speed90"] as const;
  await Promise.all([
    ...names.map(async (k) => {
      const t = await L.loadAsync(`/game/sign-${k}.png`);
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = 4;
      t.needsUpdate = true;
      kits.set(k, t);
    }),
    ...GANTRY.map(async (k) => {
      const t = await L.loadAsync(`/game/${k}.png`);
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = 4;
      t.needsUpdate = true;
      kits.set(k, t);
    }),
  ]);
  kits.set("speed120", paintSpeed(120));
}

function paintSpeed(n: number) {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const g = canvas.getContext("2d");
  if (!g) throw new Error("speed sign canvas missing");
  g.clearRect(0, 0, 256, 256);
  g.fillStyle = "#ffffff";
  g.beginPath();
  g.arc(128, 128, 118, 0, Math.PI * 2);
  g.fill();
  g.strokeStyle = "#c8102e";
  g.lineWidth = 22;
  g.beginPath();
  g.arc(128, 128, 107, 0, Math.PI * 2);
  g.stroke();
  g.fillStyle = "#111111";
  g.font = "700 78px sans-serif";
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillText(String(n), 128, 132);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  tex.needsUpdate = true;
  return tex;
}
