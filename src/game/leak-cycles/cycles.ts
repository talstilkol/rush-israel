/** Canonical 20-cycle enter-exit leak lock (RSH-040). */

export const LEAK_CYCLES_GIS_CLAIM = false;
export const LEAK_CYCLES_OWNER_FREEZE = false;
export const LEAK_CYCLES_PUBLIC_DISTRIBUTION = false;
export const LEAK_CYCLES_DEFINED = true;
export const CONTEXT_LOSS_ENFORCED = false;
export const SOAK_ENFORCED = false;
export const REAL_DEVICE_BASELINE_ACCEPTED = false;
export const ENTER_EXIT_CYCLES = 20;
export const REQUIRED_CI_CYCLES = 2;
export const TEXTURE_DELTA_MAX = 2;
export const GEOMETRY_DELTA_MAX = 2;
export const DISPOSE_ALL_IDEMPOTENT = true;
export const LIVE_REGISTRY = "src/rendering/ResourceRegistry.ts" as const;
export const LIVE_DISPOSE_OBJECT3D = "src/rendering/disposeObject3D.ts" as const;
export const LIVE_SOAK = "scripts/soak-menu-race.mjs" as const;
export const LIVE_SOAK_SMOKE = "scripts/soak-smoke.mjs" as const;
export const PACKAGE_SOURCE_SHA256 = "ae427c122d1e8f4a7b419fa83e7deaab7bfb5c88f200699182f8e3d85cf9df94";

export type EnterExitRegistry = {
  retain(id: string, dispose: () => void): boolean;
  disposeAll(): { alreadyDisposed: boolean; disposed: number; outstanding: number };
};

export function runEnterExitCycles(
  createRegistry: () => EnterExitRegistry,
  cycles = ENTER_EXIT_CYCLES,
) {
  const reports = [];
  for (let i = 0; i < cycles; i++) {
    const registry = createRegistry();
    registry.retain(`world-${i}`, () => {});
    registry.retain(`csm-${i}`, () => {});
    registry.retain(`post-${i}`, () => {});
    const first = registry.disposeAll();
    const second = registry.disposeAll();
    reports.push({ first, second });
  }
  return reports;
}

export function canonicalLeakDigest(): string {
  return [
    "enter_exit_cycles=20",
    "required_ci_cycles=2",
    "texture_delta_max=2",
    "geometry_delta_max=2",
    "dispose_all_idempotent=true",
    "context_loss_enforced=false",
    "soak_enforced=false",
    "real_device_baseline=false",
    "gis=false",
    "owner_freeze=false",
    "public_distribution=false",
  ].join("\n") + "\n";
}
