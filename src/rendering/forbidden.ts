/**
 * Codex 84: do not implement these. Tests fail if they appear in src/.
 * UnrealBloomPass (three) is not Unreal Engine.
 */
export const FORBIDDEN = {
  pedestrians: true,
  trafficAiRewrite: true,
  windshieldRain: true,
  persistentTireMarks: true,
  fftOcean: true,
  volumetricClouds: true,
  rapierCannon: true,
  osmDem: true,
  unrealEngine: true,
  agxUntilLut: true,
  mrt: true,
  pmndrsPostprocessing: true,
} as const;
