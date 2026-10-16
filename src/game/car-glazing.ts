import * as THREE from "three";

type Pane = THREE.Mesh<THREE.BoxGeometry | THREE.PlaneGeometry, THREE.MeshPhysicalMaterial>;
type Fit = { positions: number[]; normals: number[]; lift: number };
const cache = new Map<string, Fit[]>();
const COLUMNS = 8;
const ROWS = 4;

/** Fit existing glazing to the actual car shell, in car-local coordinates.
 * Cache CPU arrays only; every visual owns and disposes its GPU geometries.
 */
export function fitCarWindows(body: THREE.Mesh, panes: Pane[], cabinHeight: number): boolean {
  if (panes.length !== 4) return false;
  body.parent?.updateMatrixWorld(true);
  body.geometry.computeBoundingBox();
  const center = body.geometry.boundingBox!.getCenter(new THREE.Vector3()).applyMatrix4(body.matrixWorld);
  const position = body.geometry.getAttribute("position");
  const vertices: number[] = [];
  for (let i = 0; i < position.count; i++) vertices.push(position.getX(i), position.getY(i), position.getZ(i));
  // Exact geometry/topology and transforms, not a random ID or bounds-only guess.
  const key = JSON.stringify([vertices, body.geometry.index ? Array.from(body.geometry.index.array) : null,
    body.matrixWorld.elements, cabinHeight, panes.map(p => [p.geometry.parameters.width, p.geometry.parameters.height, p.matrixWorld.elements])]);
  let fits = cache.get(key);
  if (!fits) {
    fits = [];
    for (const pane of panes) {
      const baseY = pane.position.y;
      let fit: Fit | undefined;
      for (const fraction of [1, .9, .8, .7, .6, .5, .4, .3, .2, .1, 0]) {
        const lift = cabinHeight * .5 * fraction;
        pane.position.y = baseY + lift;
        pane.updateMatrixWorld(true);
        const geometry = new THREE.PlaneGeometry(pane.geometry.parameters.width, pane.geometry.parameters.height, COLUMNS, ROWS);
        const positions = geometry.getAttribute("position");
        const normal = new THREE.Vector3(0, 0, 1).applyQuaternion(pane.getWorldQuaternion(new THREE.Quaternion()));
        if (normal.dot(pane.getWorldPosition(new THREE.Vector3()).sub(center)) < 0) normal.negate();
        const inverse = pane.matrixWorld.clone().invert();
        let count = 0;
        for (let i = 0; i < positions.count; i++) {
          const point = new THREE.Vector3().fromBufferAttribute(positions, i).applyMatrix4(pane.matrixWorld);
          const hits = new THREE.Raycaster(point.clone().addScaledVector(normal, 3), normal.clone().negate(), 0, 6).intersectObject(body, false);
          if (!hits.length) continue;
          point.copy(hits[0].point).addScaledVector(normal, .012).applyMatrix4(inverse);
          positions.setXYZ(i, point.x, point.y, point.z);
          count++;
        }
        if (count === positions.count) {
          geometry.computeVertexNormals();
          fit = { positions: Array.from(positions.array), normals: Array.from(geometry.getAttribute("normal").array), lift };
        }
        geometry.dispose();
        if (fit) break;
      }
      pane.position.y = baseY;
      pane.updateMatrixWorld(true);
      // Fail atomically: keep the original four surfaces if an asset no longer fits.
      if (!fit) return false;
      fits.push(fit);
    }
    if (cache.size >= 12) cache.delete(cache.keys().next().value!);
    cache.set(key, fits);
  }
  const material = panes[0].material.clone();
  material.transparent = false;
  material.opacity = 1;
  material.color.setHex(0x182a36);
  material.roughness = .13;
  material.metalness = .18;
  material.side = THREE.DoubleSide;
  for (let i = 0; i < panes.length; i++) {
    const pane = panes[i], fit = fits[i];
    const geometry = new THREE.PlaneGeometry(pane.geometry.parameters.width, pane.geometry.parameters.height, COLUMNS, ROWS);
    geometry.getAttribute("position").array.set(fit.positions);
    geometry.getAttribute("normal").array.set(fit.normals);
    geometry.computeBoundingBox();
    geometry.computeBoundingSphere();
    const previous = pane.geometry;
    pane.geometry = geometry;
    previous.dispose();
    pane.position.y += fit.lift;
    pane.material = material;
  }
  return true;
}
