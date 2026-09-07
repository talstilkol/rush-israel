/** Serializable browser probe. Physics ticks, not rendering/wall-clock time,
 * determine the existing 220 ms ramp and 50 + 900 ms falling checks. */
export function probeAirbornePhysics(controls = globalThis.__controlsTest) {
  const report = { ok: false, physicsHz: 120, dropHeight: 2.2, phases: {}, error: null };
  const t = controls;
  let canClean = false;
  try {
    for (const name of ['getTick', 'getPhysicsHz', 'advanceTime', 'resetStart', 'skipCountdown',
      'getRamps', 'teleport', 'getX', 'getY', 'getZ', 'getYaw', 'getSpeed', 'getAirborne',
      'getOnTrack', 'setThrottle', 'setSteer', 'setKeys']) {
      if (typeof t?.[name] !== 'function') throw new Error(`missing airborne control: ${name}`);
    }
    canClean = true;
    if (t.getPhysicsHz() !== 120) throw new Error('airborne physics rate must remain 120 Hz');
    const snapshot = () => {
      const s = { tick: t.getTick(), x: t.getX(), y: t.getY(), z: t.getZ(), speed: t.getSpeed(),
        airborne: t.getAirborne(), onTrack: t.getOnTrack() };
      if (!Number.isSafeInteger(s.tick) || s.tick < 0 ||
        ![s.x, s.y, s.z, s.speed].every(Number.isFinite) ||
        typeof s.airborne !== 'boolean' || typeof s.onTrack !== 'boolean') {
        throw new Error('invalid airborne physics state');
      }
      return s;
    };
    const advance = (name, ms) => {
      const before = snapshot();
      t.advanceTime(ms);
      const after = snapshot();
      const expectedSteps = Math.floor(ms / (1000 / 120));
      report.phases[name] = { ...after, requestedMs: ms, expectedSteps, actualSteps: after.tick - before.tick };
      if (after.tick - before.tick !== expectedSteps) throw new Error(`incorrect physics tick advance: ${name}`);
      return after;
    };
    t.setThrottle(0); t.setSteer(0); t.setKeys([]);
    t.resetStart(); t.skipCountdown();
    const ramps = t.getRamps();
    if (!Array.isArray(ramps)) throw new Error('invalid ramp inventory');
    const r = ramps.find(item => /שלום|HaShalom/i.test(item.he) && Math.abs(item.y1 - item.y0) > 5);
    if (!r || ![r.x, r.z, r.sx, r.sz, r.len, r.y0, r.y1].every(Number.isFinite) || r.len <= 0) {
      throw new Error('no valid HaShalom ramp');
    }
    const along = (0.34 - 0.5) * r.len;
    t.teleport(r.x + r.sx * along, r.z + r.sz * along,
      Math.atan2(-r.sx, -r.sz), r.y0 + (r.y1 - r.y0) * 0.34);
    const onRamp = advance('ramp', 220);
    if (onRamp.airborne) throw new Error('ramp set airborne');
    t.resetStart(); t.skipCountdown();
    advance('settled', 80);
    t.teleport(t.getX(), t.getZ(), t.getYaw(), t.getY() + 2.2);
    report.phases.start = snapshot();
    const mid = advance('mid', 50);
    if (!mid.airborne) throw new Error('drop did not go airborne');
    // Existing gravity is 18; six semi-implicit 120 Hz steps fall 0.02625.
    const steps = report.phases.mid.expectedSteps;
    const expectedFall = 18 * (1 / 120) ** 2 * steps * (steps + 1) / 2;
    if (Math.abs(report.phases.start.y - mid.y - expectedFall) > 1e-6) {
      throw new Error('fall was clamped or did not follow gravity');
    }
    const land = advance('land', 900);
    if (land.airborne) throw new Error('stuck airborne');
    if (!land.onTrack) throw new Error('fell off Ayalon');
    if (land.y >= mid.y) throw new Error('landing did not descend');
    report.elapsedPhysicsSteps = land.tick - report.phases.start.tick;
    report.elapsedPhysicsSeconds = report.elapsedPhysicsSteps / 120;
    report.ok = true;
  } catch (error) {
    report.error = String(error instanceof Error ? error.message : error);
  } finally {
    if (canClean) { t.setThrottle(0); t.setSteer(0); t.setKeys([]); }
  }
  return report;
}
