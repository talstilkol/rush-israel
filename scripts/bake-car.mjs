#!/usr/bin/env node
/** Export the GT extrude to GLB. Still a procedural mesh, not a scan. */
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as THREE from "three";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";

if (typeof FileReader === "undefined") {
  globalThis.FileReader = class {
    result = null;
    onloadend = null;
    readAsDataURL(blob) {
      blob.arrayBuffer().then((ab) => {
        this.result = "data:application/octet-stream;base64," + Buffer.from(ab).toString("base64");
        this.onloadend?.();
      });
    }
    readAsArrayBuffer(blob) {
      blob.arrayBuffer().then((ab) => {
        this.result = ab;
        this.onloadend?.();
      });
    }
  };
}

const pts = [
  [-2.24, 0.16], [-2.26, 0.48], [-1.92, 0.62], [-1.32, 0.64], [-1.08, 1.2],
  [-0.12, 1.3], [0.62, 1.26], [1.04, 0.72], [1.62, 0.6], [2.18, 0.5],
  [2.28, 0.32], [2.22, 0.15], [1.82, 0.14], [-1.82, 0.14],
];
const sh = new THREE.Shape();
sh.moveTo(pts[0][0], pts[0][1]);
for (let i = 1; i < pts.length; i++) sh.lineTo(pts[i][0], pts[i][1]);
sh.closePath();
const width = 1.82 * 0.9;
const body = new THREE.ExtrudeGeometry(sh, {
  depth: width,
  bevelEnabled: true,
  bevelThickness: 0.09,
  bevelSize: 0.07,
  bevelSegments: 4,
  steps: 1,
});
body.translate(0, 0, -width / 2);
body.rotateY(-Math.PI / 2);
body.computeVertexNormals();

const group = new THREE.Group();
group.name = "gt";
const paint = new THREE.MeshPhysicalMaterial({
  color: 0xc45c3a,
  metalness: 0.06,
  roughness: 0.22,
  clearcoat: 1,
  clearcoatRoughness: 0.06,
});
const bodyMesh = new THREE.Mesh(body, paint);
bodyMesh.name = "body";
group.add(bodyMesh);

const exporter = new GLTFExporter();
const json = await exporter.parseAsync(group, { binary: false });
const out = join(dirname(fileURLToPath(import.meta.url)), "../public/game/car-gt.gltf");
writeFileSync(out, JSON.stringify(json));
console.log("baked", out);
