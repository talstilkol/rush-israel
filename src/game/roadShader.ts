/** UV lane marks. Chain AFTER CSM onBeforeCompile. uv.y in the mesh is meters/6. */
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
      float meters = ru.y * 6.0;
      float dash = step(0.45, fract(meters / 8.0));
      float laneU = ru.x * lanes;
      float k = floor(laneU + 0.5);
      float skipEdge = step(k, 0.5) + step(lanes - 0.5, k);
      float skipMid = lanes >= 7.5 ? (1.0 - smoothstep(0.02, 0.06, abs(ru.x - 0.5))) : 0.0;
      float bound = 1.0 - smoothstep(0.018, 0.04, abs(fract(laneU + 0.5) - 0.5));
      diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.94), bound * dash * (1.0 - skipEdge) * (1.0 - skipMid) * 0.78);
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
