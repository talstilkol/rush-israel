import type { RefObject } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { Gauge, Pause } from "lucide-react";
import { formatTime } from "@/game/math";
import type { HudState } from "@/game/types";
import { cn } from "@/lib/utils";

// RSH-018-BLOCK-BEGIN:clamp01
function clamp01(v: number) {
	return Math.max(0, Math.min(1, Number(v) || 0));
}
// RSH-018-BLOCK-END:clamp01
// RSH-018-BLOCK-BEGIN:HudProps
type HudProps = {
	hud: HudState;
	langHe: boolean;
	mapRef: RefObject<HTMLCanvasElement | null>;
	onPause: () => void;
	onMute: () => void;
	muted: boolean;
	night: boolean;
	onNight: () => void;
	onSkipReplay: () => void;
	onPhotoFilter: () => void;
	onPhotoHide: () => void;
	onPhotoExit: () => void;
	onPhotoSave: () => void;
};
// RSH-018-BLOCK-END:HudProps
// RSH-018-BLOCK-BEGIN:Hud
function Hud({ hud, langHe, mapRef, onPause, onMute, muted, night, onNight, onSkipReplay, onPhotoFilter, onPhotoHide, onPhotoExit, onPhotoSave }: HudProps) {
	if (hud.photo) {
		if (hud.photoHide) return null;
		return /* @__PURE__ */ jsxs("div", {
			className: "pointer-events-none absolute inset-0 z-10 p-4 pt-[max(1rem,env(safe-area-inset-top))]",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "pointer-events-none absolute inset-5",
				children: [
					/* @__PURE__ */ jsx("span", { className: "absolute start-0 top-0 h-8 w-8 border-s-2 border-t-2 border-fg/50" }),
					/* @__PURE__ */ jsx("span", { className: "absolute end-0 top-0 h-8 w-8 border-e-2 border-t-2 border-fg/50" }),
					/* @__PURE__ */ jsx("span", { className: "absolute start-0 bottom-0 h-8 w-8 border-s-2 border-b-2 border-fg/50" }),
					/* @__PURE__ */ jsx("span", { className: "absolute end-0 bottom-0 h-8 w-8 border-e-2 border-b-2 border-fg/50" })
				]
			}), /* @__PURE__ */ jsxs("div", {
				className: "pointer-events-auto mx-auto flex max-w-lg flex-col gap-2 rounded-lg border border-border bg-surface/85 p-3",
				children: [
					/* @__PURE__ */ jsx("p", {
						className: "text-xs font-medium uppercase tracking-widest text-muted",
						children: langHe ? "מצב צילום" : "Photo mode"
					}),
					/* @__PURE__ */ jsx("p", {
						className: "text-sm text-muted",
						children: langHe ? "A/D סיבוב · W/S גובה · E קרוב · רווח רחוק" : "A/D orbit · W/S height · E closer · Space farther"
					}),
					/* @__PURE__ */ jsxs("p", {
						className: "text-xs text-muted",
						children: [
							langHe ? "פילטר" : "Filter",
							" · ",
							hud.photoFilter
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex flex-wrap gap-2",
						children: [
							/* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: onPhotoFilter,
								className: "min-h-11 rounded-md border border-border px-3 text-sm",
								children: langHe ? "פילטר הבא" : "Next filter"
							}),
							/* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: onPhotoHide,
								className: "min-h-11 rounded-md border border-border px-3 text-sm",
								children: langHe ? "הסתר ממשק" : "Hide UI"
							}),
							/* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: onPhotoSave,
								className: "min-h-11 rounded-md border border-border px-3 text-sm",
								children: langHe ? "שמור תמונה" : "Save photo"
							}),
							/* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: onPhotoExit,
								className: "min-h-11 rounded-md border border-border px-3 text-sm",
								children: langHe ? "יציאה" : "Exit"
							})
						]
					})
				]
			})]
		});
	}
	return /* @__PURE__ */ jsxs("div", {
		className: "pointer-events-none absolute inset-0 z-10 p-4 pt-[max(1rem,env(safe-area-inset-top))]",
		children: [
			typeof location !== "undefined" && /(?:^|[?&])qa=1(?:&|$)/.test(location.search) ? /* @__PURE__ */ jsxs("p", {
				className: "pointer-events-none absolute start-3 top-3 z-20 font-mono text-[10px] text-muted",
				children: [hud.backend, " · p95 ", Math.round(hud.msP95 || 0), "ms · dc ", hud.drawCalls || 0, " · tri ", (hud.triangles || 0) >= 1000 ? `${Math.round((hud.triangles || 0) / 1000)}k` : hud.triangles || 0, " · g", hud.geometries || 0, " t", hud.textures || 0, " · kin ", Number(hud.kinMix || 0).toFixed(2)]
			}) : null,
			hud.mode === "heat" && hud.heat > .12 ? /* @__PURE__ */ jsx("div", {
				className: cn("pointer-events-none absolute inset-0", hud.heat > .7 ? "shadow-[inset_0_0_90px_var(--color-danger)]" : "shadow-[inset_0_0_70px_var(--color-accent)]"),
				style: { opacity: .25 + hud.heat * .45 }
			}) : null,
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-start justify-between gap-3",
				children: [
					!hud.replay && !hud.finished ? /* @__PURE__ */ jsxs("div", {
						className: "rounded-lg border border-border bg-surface/80 px-3 py-2",
						children: [
							/* @__PURE__ */ jsxs("p", {
								className: "text-[11px] font-medium uppercase tracking-widest text-muted",
								children: [
									hud.mode === "roam" ? (langHe ? "חופשי" : "Roam") : hud.pointToPoint ? (langHe ? "נקודה לנקודה" : "A → B") : (langHe ? `הקפה ${hud.lap}/${hud.totalLaps}` : `Lap ${hud.lap}/${hud.totalLaps}`)
								]
							}),
							/* @__PURE__ */ jsxs("p", {
								className: "mt-1 flex items-baseline gap-3 text-fg",
								children: [
									/* @__PURE__ */ jsx("span", {
										className: "text-lg font-semibold tabular-nums leading-none",
										children: formatTime(hud.lapTime)
									})
								]
							})
						]
					}) : /* @__PURE__ */ jsx("span", {}),
					/* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: onPause,
						className: "pointer-events-auto grid size-11 place-items-center rounded-md border border-border bg-surface/80 text-fg",
						"aria-label": "pause",
						children: /* @__PURE__ */ jsx(Pause, { className: "size-4" })
					})
				]
			}),
			hud.wrongWay ? /* @__PURE__ */ jsx("div", {
				className: "mt-6 flex justify-center",
				children: /* @__PURE__ */ jsx("p", {
					className: "rounded-lg border border-danger bg-danger px-5 py-2 text-center text-xl font-semibold tracking-wide text-bg",
					children: langHe ? "כיוון הפוך · הסתובב" : "WRONG WAY · turn around"
				})
			}) : !hud.onTrack ? /* @__PURE__ */ jsx("div", {
				className: "mt-6 flex justify-center",
				children: /* @__PURE__ */ jsx("p", {
					className: "rounded-lg border border-accent bg-accent px-5 py-2 text-center text-xl font-semibold tracking-wide text-bg",
					children: langHe ? "חזור לכביש · עקוב אחרי החצים" : "Back on the road · follow the arrows"
				})
			}) : null,
			hud.mode === "heat" && hud.chasing && hud.heat > .35 ? /* @__PURE__ */ jsx("p", {
				className: "mt-6 text-center text-lg font-semibold tracking-widest text-danger",
				children: langHe ? "מבוקש" : "WANTED"
			}) : null,
			hud.rewind ? /* @__PURE__ */ jsx("p", {
				className: "mt-6 text-center text-lg font-semibold tracking-widest text-accent",
				children: langHe ? "ריוויינד" : "REWIND"
			}) : null,
			hud.replay ? /* @__PURE__ */ jsxs("div", {
				className: "pointer-events-auto mx-auto mt-8 flex max-w-sm flex-col items-center gap-3 rounded-lg border border-border bg-surface/85 px-4 py-3",
				children: [
					/* @__PURE__ */ jsx("p", {
						className: "text-xs font-medium uppercase tracking-widest text-muted",
						children: langHe ? "ריפליי" : "Replay"
					}),
					hud.replaySlow ? /* @__PURE__ */ jsx("p", {
						className: "text-sm font-semibold tracking-widest text-accent",
						children: langHe ? "הילוך איטי" : "SLOW-MO"
					}) : null,
					/* @__PURE__ */ jsx("p", {
						className: "text-sm font-medium",
						children: hud.camName === "hood" ? langHe ? "תא נהג" : "Hood" : hud.camName === "bumper" ? langHe ? "פגוש" : "Bumper" : hud.camName === "heli" ? langHe ? "מסוק" : "Helicopter" : langHe ? "מעקב" : "Chase"
					}),
					/* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: onSkipReplay,
						className: "min-h-11 rounded-md border border-border bg-surface px-4 text-sm font-medium",
						children: langHe ? "דלג · Enter" : "Skip · Enter"
					})
				]
			}) : null,
			/* @__PURE__ */ jsx("div", {
				className: "absolute bottom-28 end-4 md:bottom-6",
				children: /* @__PURE__ */ jsxs("div", {
					className: "min-w-[11.5rem] rounded-lg border border-border bg-surface/80 px-3 py-2",
					children: [
						/* @__PURE__ */ jsxs("p", {
							className: "max-w-[11rem] truncate text-xs font-medium text-muted",
							children: [hud.street, hud.poi ? ` · ${hud.poi}` : ""]
						}),
						/* @__PURE__ */ jsxs("p", {
							className: "mt-1 flex items-end justify-between gap-3",
							children: [
								/* @__PURE__ */ jsxs("span", {
									children: [
										/* @__PURE__ */ jsxs("span", {
											className: "flex items-center gap-2 text-xs text-muted",
											children: [/* @__PURE__ */ jsx(Gauge, { className: "size-3.5" }), langHe ? "קמ״ש" : "km/h"]
										}),
										/* @__PURE__ */ jsx("span", {
											className: "text-4xl font-semibold tabular-nums leading-tight",
											children: Math.round(hud.speedKmh)
										})
									]
								})
							]
						})
					]
				})
			})
		]
	});
}
// RSH-018-BLOCK-END:Hud

export { Hud };
export type { HudProps };
