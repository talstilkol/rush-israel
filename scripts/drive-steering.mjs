/** Serializable real-browser probe: direction is tested from independent,
 * forward-moving, undamaged starts, not after a previous turn hit the verge. */
export function measureForwardSteering(direction) {
  if (direction !== 1 && direction !== -1) throw new Error('steering direction must be1 or-1');
  const t = globalThis.__controlsTest;
  if (!t) throw new Error('controls unavailable');
  const wrap = a => Math.atan2(Math.sin(a), Math.cos(a));
  const samples = [];
  const sample = () => {
    const s = { speed: t.getSpeed(), yaw: t.getYaw(), damage: t.getDamage(), on: t.getOnTrack(), airborne: t.getAirborne(), mix: t.getKinMix() };
    if (![s.speed, s.yaw, s.damage, s.mix].every(Number.isFinite)) throw new Error('nonfinite steering state');
    if (s.damage > 0.000001 || !s.on || s.airborne) throw new Error('steering probe lost clean road contact');
    return s;
  };
  try {
    t.resetStart(); t.skipCountdown(); t.setDamage(0); t.setSteer(0); t.setThrottle(1); t.setKeys(['KeyW']);
    let current = sample();
    for (let i = 0; i < 240 && current.speed < 12; i++) { t.advanceTime(50); current = sample(); }
    if (current.speed < 12) throw new Error('steering probe never reached12');
    const startYaw = current.yaw;
    t.setSteer(direction);
    for (let i = 0; i < 12; i++) {
      t.advanceTime(50); current = sample();
      if (current.speed < 12 || current.mix > 0.001) throw new Error('steering probe left forward dynamic regime');
      samples.push(current);
    }
    const delta = wrap(current.yaw - startYaw);
    if (direction * delta <= 0.03) throw new Error('steering direction response ' + JSON.stringify({ direction, delta }));
    return { direction, delta, startYaw, minSpeed: Math.min(...samples.map(s => s.speed)), samples };
  } finally { t.setSteer(0); t.setThrottle(0); t.setKeys([]); }
}
