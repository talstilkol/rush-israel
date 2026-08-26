/** 21.7: UV lane marks on MeshPhysicalMaterial. Chain after CSM onBeforeCompile. */
export function injectRoadLanes(shader: { fragmentShader: string; uniforms: Record<string, { value: unknown }> }, lanes: number) {
  if (shader.fragmentShader.includes("RUSH_LANES")) return;
  shader.uniforms.uLanes = { value: lanes };
  shader.uniforms.uWet = { value: 0 };
  shader.fragmentShader = shader.fragmentShader.replace(
    "#include <map_fragment>",
    `#include <map_fragment>
    // RUSH_LANES
    {
      vec2 ru = vMapUv;
      float lanes = uLanes;
      float edge = max(smoothstep(0.018, 0.0, ru.x), smoothstep(0.982, 1.0, ru.x));
      diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.93, 0.93, 0.94), edge * 0.9);
      float dash = step(0.42, fract(ru.y * 0.52));
      float laneU = ru.x * lanes;
      float inner = 1.0 - smoothstep(0.016, 0.038, abs(fract(laneU) - 0.5));
      float skipMid = lanes >= 7.5 ? (1.0 - smoothstep(0.018, 0.055, abs(ru.x - 0.5))) : 0.0;
      diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.94), inner * dash * (1.0 - skipMid) * 0.72);
      float wet = uWet;
      diffuseColor.rgb *= mix(1.0, 0.88, wet);
    }`,
  );
  shader.fragmentShader = "uniform float uLanes;\nuniform float uWet;\n" + shader.fragmentShader;
}

export function bindRoadCompile(mat: { userData: { lanes?: number; uWet?: { value: number } }; onBeforeCompile?: Function }) {
  const lanes = mat.userData.lanes;
  if (!lanes) return;
  const prev = mat.onBeforeCompile;
  mat.onBeforeCompile = (shader: Parameters<typeof injectRoadLanes>[0], renderer: unknown) => {
    if (typeof prev === "function") prev(shader, renderer);
    injectRoadLanes(shader, lanes);
    mat.userData.uWet = shader.uniforms.uWet as { value: number };
  };
}
