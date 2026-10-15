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
      float edge = max(1.0 - smoothstep(0.0, 0.018, ru.x), smoothstep(0.982, 1.0, ru.x));
      diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.93, 0.93, 0.94), edge * 0.9);
      float meters = ru.y * 6.0;
      float dash = step(0.45, fract(meters / 8.0));
      float laneU = ru.x * lanes;
      float k = floor(laneU + 0.5);
      float skipEdge = step(k, 0.5) + step(lanes - 0.5, k);
      float skipMid = 0.0;
      float bound = 1.0 - smoothstep(0.018, 0.04, abs(fract(laneU + 0.5) - 0.5));
      diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.96), bound * dash * (1.0 - skipEdge) * (1.0 - skipMid) * 0.92);
      float grain = fract(sin(dot(floor(ru * vec2(64.0, 22.0)), vec2(127.1, 311.7))) * 43758.5453);
      diffuseColor.rgb *= mix(0.84, 1.0, grain);
      float wear = 1.0 - smoothstep(0.06, 0.34, abs(fract(laneU) - 0.5));
      diffuseColor.rgb *= mix(1.0, 0.78, wear * (1.0 - skipEdge) * 0.65);
      float rumble = step(0.5, fract(meters * 1.7));
      float shoulder = max(1.0 - smoothstep(0.02, 0.055, ru.x), smoothstep(0.945, 0.98, ru.x));
      diffuseColor.rgb = mix(diffuseColor.rgb, mix(vec3(0.12), vec3(0.9), rumble), shoulder * 0.9);
      float along = fract(meters / 18.0);
      float head = smoothstep(0.02, 0.12, along) * (1.0 - smoothstep(0.16, 0.34, along));
      float shaft = step(0.1, along) * step(along, 0.28);
      float lateral = abs(fract(laneU) - 0.5);
      float inLane = (1.0 - skipEdge) * (1.0 - smoothstep(0.04, 0.22, lateral));
      float chevron = max(head * (1.0 - smoothstep(0.02, 0.14, lateral)), shaft * step(lateral, 0.035));
      diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.96, 0.96, 0.9), chevron * inLane * 0.55);
      float wet = uWet;
      diffuseColor.rgb *= mix(1.0, 0.88, wet);
    }`,
  );
  if (!shader.fragmentShader.includes("RUSH_WET_R")) {
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <roughnessmap_fragment>",
      `#include <roughnessmap_fragment>
      roughnessFactor = mix(roughnessFactor, 0.14, uWet); // RUSH_WET_R`,
    );
  }
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
