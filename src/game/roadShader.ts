/** Baked road kits own lane paint. The shader only changes surface wetness. */
export function injectRoadWetness(shader: { fragmentShader: string; uniforms: Record<string, { value: unknown }> }) {
  if (shader.fragmentShader.includes("RUSH_ROAD_WETNESS")) return;
  shader.uniforms.uWet = { value: 0 };
  shader.fragmentShader = "uniform float uWet;\n" + shader.fragmentShader.replace(
    "#include <roughnessmap_fragment>",
    `#include <roughnessmap_fragment>
    roughnessFactor = mix(roughnessFactor, 0.14, clamp(uWet, 0.0, 1.0)); // RUSH_ROAD_WETNESS`,
  );
}

export function bindRoadCompile(mat: { userData: { lanes?: number; roadWetness?: number; uWet?: { value: number } }; onBeforeCompile?: Function }) {
  if (!mat.userData.lanes) return;
  const previous = mat.onBeforeCompile;
  mat.onBeforeCompile = (shader: Parameters<typeof injectRoadWetness>[0], renderer: unknown) => {
    if (typeof previous === "function") previous(shader, renderer);
    injectRoadWetness(shader);
    const uniform = shader.uniforms.uWet as { value: number };
    uniform.value = mat.userData.roadWetness ?? 0;
    mat.userData.uWet = uniform;
  };
}
