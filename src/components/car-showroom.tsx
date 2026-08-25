import { useEffect, useRef } from "react";
import * as THREE from "three";
import { applyDamage, createCarVisual, setCarLights } from "@/game/car-mesh";
import type { CarDef, Tune } from "@/game/types";

export function CarShowroom({
  color,
  accent,
  body,
  damage = 0,
  kit,
  tune,
}: {
  color: number;
  accent: number;
  body: CarDef["body"];
  damage?: number;
  kit?: CarDef["kit"];
  tune?: Tune;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "low-power" });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 40);
    camera.position.set(5.4, 2.1, 6.2);
    camera.lookAt(0, 0.6, 0);
    scene.add(new THREE.HemisphereLight(0xd8e4f0, 0x2a241c, 1.1));
    const key = new THREE.DirectionalLight(0xfff1dc, 2.2);
    key.position.set(4, 8, 3);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0x88a0c8, 0.55);
    fill.position.set(-6, 2, -4);
    scene.add(fill);
    const vis = createCarVisual(color, accent, false, false, body, kit === "police", tune);
    setCarLights(vis, false);
    applyDamage(vis, damage);
    vis.group.position.set(0, 0, 0);
    scene.add(vis.group);
    const floor = new THREE.Mesh(
      new THREE.CircleGeometry(6, 48),
      new THREE.MeshStandardMaterial({ color: 0x1c1c1c, metalness: 0.6, roughness: 0.35 }),
    );
    floor.rotation.x = -Math.PI / 2;
    scene.add(floor);
    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      vis.group.rotation.y += dt * 0.45;
      const w = canvas.clientWidth;
      const h = Math.max(1, canvas.clientHeight);
      if (canvas.width !== w || canvas.height !== h) {
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      }
      renderer.render(scene, camera);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      renderer.dispose();
      scene.clear();
    };
  }, [color, accent, body, damage, kit, tune]);

  return <canvas ref={ref} className="h-44 w-full rounded-lg border border-border bg-surface" />;
}
