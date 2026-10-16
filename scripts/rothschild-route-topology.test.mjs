import assert from 'node:assert/strict';
import { test } from 'node:test';
import { buildTrack } from '../src/game/spline.ts';
import { getTrack } from '../src/game/tracks.ts';
import { roadLaneOffset } from '../src/game/road-layout.ts';

// Test the authored route, before upwardTriangles can hide a folded ribbon
// by reversing its faces. Positive progress must also mean forward motion
// at both lane centers, road edges and outer sidewalk edges.
const track = buildTrack(getTrack('rothschild'));
for (const side of [-1, 1]) {
  for (const [name, offset] of [
    ['lane center', roadLaneOffset(track, side)],
    ['median edge', side * track.medianHalfWidth],
    ['road edge', side * track.width / 2],
    ['outer sidewalk edge', side * (track.width / 2 + 0.42 + 3.2)],
  ]) {
    test(`Rothschild ${side}/${name}: every real route segment advances without folding`, () => {
      const reversed = [];
      const points = track.samples.map(s => ({ x: s.x + s.rx * offset, z: s.z + s.rz * offset }));
      for (let i = 0; i < track.samples.length; i++) {
        const a = track.samples[i], b = track.samples[(i + 1) % track.samples.length];
        const dx = b.x + b.rx * offset - a.x - a.rx * offset;
        const dz = b.z + b.rz * offset - a.z - a.rz * offset;
        const forward = dx * (a.tx + b.tx) + dz * (a.tz + b.tz);
        if (forward <= 0) reversed.push({ segment: i, progress: a.t, forward });
      }
      assert.deepEqual(reversed, [], 'an offset route must not double back inside its own carriageway');
      const cross = (a, b, c) => (b.x - a.x) * (c.z - a.z) - (b.z - a.z) * (c.x - a.x);
      const onSegment = (a, b, p) => Math.abs(cross(a, b, p)) <= 1e-9
        && p.x >= Math.min(a.x, b.x) - 1e-9 && p.x <= Math.max(a.x, b.x) + 1e-9
        && p.z >= Math.min(a.z, b.z) - 1e-9 && p.z <= Math.max(a.z, b.z) + 1e-9;
      const intersections = [];
      for (let i = 0; i < points.length; i++) {
        const a = points[i], b = points[(i + 1) % points.length];
        for (let j = i + 2; j < points.length; j++) {
          if ((j + 1) % points.length === i) continue;
          const c = points[j], d = points[(j + 1) % points.length];
          if ((cross(a, b, c) * cross(a, b, d) < 0 && cross(c, d, a) * cross(c, d, b) < 0)
            || onSegment(a, b, c) || onSegment(a, b, d) || onSegment(c, d, a) || onSegment(c, d, b)) intersections.push([i, j]);
        }
      }
      assert.deepEqual(intersections, [], 'non-adjacent segments must not cross each other');
    });
  }
}
