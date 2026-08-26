/** G0 / G1-02: capability probe. No 2–4s microbench yet. */
export type Caps = {
  secure: boolean;
  webgpu: boolean;
  webgpuReason: string;
  webgl2: boolean;
  maxTexture: number;
  renderer: string;
};

export async function probeCapabilities(): Promise<Caps> {
  const secure = typeof window !== "undefined" && window.isSecureContext;
  let webgpu = false;
  let webgpuReason = "no navigator.gpu";
  const gpu = typeof navigator !== "undefined" ? (navigator as Navigator & { gpu?: { requestAdapter: () => Promise<unknown> } }).gpu : undefined;
  if (!secure) webgpuReason = "insecure context";
  else if (gpu) {
    try {
      const adapter = await gpu.requestAdapter();
      if (!adapter) webgpuReason = "no adapter";
      else {
        webgpu = true;
        webgpuReason = "adapter";
      }
    } catch (e) {
      webgpuReason = e instanceof Error ? e.message : "requestAdapter failed";
    }
  }

  let webgl2 = false;
  let maxTexture = 0;
  let renderer = "unknown";
  if (typeof document !== "undefined") {
    const c = document.createElement("canvas");
    const gl = c.getContext("webgl2");
    if (gl) {
      webgl2 = true;
      maxTexture = gl.getParameter(gl.MAX_TEXTURE_SIZE) as number;
      const ext = gl.getExtension("WEBGL_debug_renderer_info");
      renderer = ext ? String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL)) : "webgl2";
    }
  }
  return { secure, webgpu, webgpuReason, webgl2, maxTexture, renderer };
}
