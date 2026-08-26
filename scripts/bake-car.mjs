#!/usr/bin/env node
/** Export extruded bodies to glTF. Still procedural, not scans. */
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

const SHAPES = {
  hatch: { w: 1.76 * 0.9, p: [[-2.02,0.16],[-2.05,0.5],[-1.78,0.74],[-1.48,1.24],[-0.18,1.34],[0.52,1.3],[0.92,0.8],[1.52,0.64],[2.0,0.5],[2.08,0.32],[2.02,0.15],[1.62,0.14],[-1.62,0.14]] },
  muscle: { w: 1.9 * 0.9, p: [[-2.4,0.15],[-2.42,0.46],[-2.08,0.58],[-1.52,0.6],[-1.22,1.06],[-0.12,1.12],[0.52,1.08],[1.18,0.6],[1.98,0.5],[2.4,0.46],[2.44,0.26],[2.36,0.14],[1.9,0.13],[-1.9,0.13]] },
  rally: { w: 1.84 * 0.9, p: [[-2.14,0.18],[-2.16,0.58],[-1.82,0.8],[-1.52,1.3],[-0.18,1.4],[0.48,1.36],[0.9,0.84],[1.42,0.7],[2.08,0.58],[2.16,0.34],[2.08,0.16],[1.68,0.16],[-1.68,0.16]] },
  super: { w: 1.96 * 0.9, p: [[-2.24,0.13],[-2.26,0.38],[-1.82,0.46],[-1.32,0.9],[-0.18,0.98],[0.58,0.94],[1.28,0.5],[1.98,0.4],[2.26,0.36],[2.3,0.2],[2.2,0.12],[1.78,0.12],[-1.78,0.12]] },
  gt: { w: 1.82 * 0.9, p: [[-2.24,0.16],[-2.26,0.48],[-1.92,0.62],[-1.32,0.64],[-1.08,1.2],[-0.12,1.3],[0.62,1.26],[1.04,0.72],[1.62,0.6],[2.18,0.5],[2.28,0.32],[2.22,0.15],[1.82,0.14],[-1.82,0.14]] },
};

const outDir = join(dirname(fileURLToPath(import.meta.url)), "../public/game");
const exporter = new GLTFExporter();

async function bake(name, spec) {
  const sh = new THREE.Shape();
  sh.moveTo(spec.p[0][0], spec.p[0][1]);
  for (let i = 1; i < spec.p.length; i++) sh.lineTo(spec.p[i][0], spec.p[i][1]);
  sh.closePath();
  const body = new THREE.ExtrudeGeometry(sh, {
    depth: spec.w,
    bevelEnabled: true,
    bevelThickness: 0.09,
    bevelSize: 0.07,
    bevelSegments: 4,
    steps: 1,
  });
  body.translate(0, 0, -spec.w / 2);
  body.rotateY(-Math.PI / 2);
  body.computeVertexNormals();
  const group = new THREE.Group();
  group.name = name;
  const paint = new THREE.MeshPhysicalMaterial({
    color: 0xc45c3a,
    metalness: 0.06,
    roughness: 0.22,
    clearcoat: 1,
    clearcoatRoughness: 0.06,
  });
  const mesh = new THREE.Mesh(body, paint);
  mesh.name = "body";
  group.add(mesh);
  const json = await exporter.parseAsync(group, { binary: false });
  const out = join(outDir, `car-${name}.gltf`);
  writeFileSync(out, JSON.stringify(json));
  console.log("baked", out);
}

for (const [name, spec] of Object.entries(SHAPES)) await bake(name, spec);
