import * as THREE from "three";
import { bym } from "../../tracks";
import type { TrackWorldBuilderContext } from "../shared";

export default function buildBatyam(context: TrackWorldBuilderContext): void {
  const {
    add,
    glowAt,
    hit,
    white,
    wood,
  } = context;
  /* RSH-016:BEGIN-LEGACY-TRACK-BODY */
    const promenade = bym(32.017, 34.741);
    for (const ht of [
      {
        lat: 32.0158,
        lon: 34.7406,
        h: 18
      },
      {
        lat: 32.0172,
        lon: 34.741,
        h: 22
      },
      {
        lat: 32.0186,
        lon: 34.7414,
        h: 20
      },
      {
        lat: 32.02,
        lon: 34.7418,
        h: 24
      }
    ]) {
      const p = bym(ht.lat, ht.lon);
      const hotel = new THREE.Mesh(new THREE.BoxGeometry(9, ht.h, 8), white);
      hotel.position.set(p.x, ht.h * 0.5, p.z);
      add(hotel);
      hit(p.x, p.z, 6);
    }
    const marina = bym(32.023, 34.742);
    const pier = new THREE.Mesh(new THREE.BoxGeometry(4, 0.4, 22), wood);
    pier.position.set(marina.x, 0.22, marina.z);
    add(pier);
    glowAt(promenade.x, 20, promenade.z, 16771248, 22, 18);
    hit(promenade.x + 24, promenade.z, 12);
  /* RSH-016:END-LEGACY-TRACK-BODY */
}
