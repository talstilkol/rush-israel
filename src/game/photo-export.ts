/** Codex 97: Photo-mode PNG dump. Only allowed runtime 2D canvas. */

export function exportPhotoPng(src: HTMLCanvasElement) {
  const c = document.createElement("canvas");
  c.width = src.width;
  c.height = src.height;
  const ctx = c.getContext("2d");
  if (!ctx) return;
  ctx.drawImage(src, 0, 0);
  const size = Math.max(13, Math.round(c.width / 78));
  ctx.font = `${size}px ui-sans-serif, system-ui, sans-serif`;
  ctx.fillStyle = "rgba(255,255,255,0.7)";
  ctx.textAlign = "right";
  ctx.textBaseline = "bottom";
  ctx.fillText("PHOTO MODE · RUSH", c.width - 18, c.height - 16);
  const a = document.createElement("a");
  a.href = c.toDataURL("image/png");
  a.download = `rush-photo-${Date.now()}.png`;
  a.click();
}
