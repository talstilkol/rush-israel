import * as THREE from "three";
import type { Collider } from "./types";

/** Upright box in the same track-local coordinates as the vehicle physics. */
export function colliderForBox(mesh: THREE.Mesh<THREE.BoxGeometry>): Collider {
  const { width, height, depth } = mesh.geometry.parameters;
  const forward = new THREE.Vector3(0, 0, 1).applyQuaternion(mesh.quaternion);
  const up = new THREE.Vector3(0, 1, 0).applyQuaternion(mesh.quaternion);
  if (Math.abs(up.y - 1) > 1e-8) throw new Error("Tilted boxes require a 3D contact model");
  const hx = width * Math.abs(mesh.scale.x) / 2;
  const hz = depth * Math.abs(mesh.scale.z) / 2;
  return {
    x: mesh.position.x, z: mesh.position.z,
    r: Math.hypot(hx, hz), hx, hz,
    yaw: Math.atan2(forward.x, forward.z), kind: "building",
    maxY: mesh.position.y + height * Math.abs(mesh.scale.y) / 2,
  };
}
