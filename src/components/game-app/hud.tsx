import type { RefObject } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { Gauge, Pause } from "lucide-react";
import { formatTime } from "@/game/math";
import { MODE_INFO } from "@/game/modes";
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
	onPhotoLock: () => void;
	onRadio: () => void;
};
// RSH-018-BLOCK-END:HudProps
// RSH-018-BLOCK-BEGIN:Hud
function Hud({ hud, langHe, mapRef, onPause, onMute, muted, night, onNight, onSkipReplay, onPhotoFilter, onPhotoHide, onPhotoExit, onPhotoSave, onPhotoLock, onRadio }: HudProps) {
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
							hud.canLock ? /* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: onPhotoLock,
								className: "min-h-11 rounded-md border border-border px-3 text-sm",
								children: hud.landmark || (langHe ? "פריים המסדרון" : "Corridor frame")
							}) : null,
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
			hud.weather === "rain" || hud.weather === "storm" ? /* @__PURE__ */ jsx("div", {
				className: "pointer-events-none absolute inset-0",
				style: {
					opacity: hud.weather === "storm" ? 0.5 : 0.28,
					backgroundImage: "repeating-linear-gradient(108deg, transparent 0 12px, rgba(214,224,232,0.45) 12px 13px)"
				}
			}) : null,
			hud.weather === "hamsin" ? /* @__PURE__ */ jsx("div", {
				className: "pointer-events-none absolute inset-0",
				style: { background: "rgba(176, 112, 48, 0.2)" }
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
									hud.mode === "roam" ? (langHe ? "חופשי" : "Roam") : hud.pointToPoint ? (langHe ? "נקודה לנקודה" : "A → B") : (langHe ? `הקפה ${hud.lap}/${hud.totalLaps}` : `Lap ${hud.lap}/${hud.totalLaps}`),
									hud.mode === "roam" || hud.mode === "circuit" ? "" : ` · ${langHe ? MODE_INFO[hud.mode].he : MODE_INFO[hud.mode].en}`,
									hud.mode === "roam" ? "" : (langHe ? ` · מקום ${hud.position}/${hud.totalRacers}` : ` · P${hud.position}/${hud.totalRacers}`)
								]
							}),
							/* @__PURE__ */ jsxs("p", {
								className: "mt-1 flex items-baseline gap-3 text-fg",
								children: [
									/* @__PURE__ */ jsx("span", {
										className: "text-lg font-semibold tabular-nums leading-none",
										children: formatTime(hud.lapTime)
									}),
									hud.rivalName ? /* @__PURE__ */ jsx("span", {
										className: "text-[11px] font-medium tabular-nums text-muted",
										children: `${hud.rivalName} ${hud.rivalGap >= 0 ? "+" : ""}${hud.rivalGap.toFixed(1)}s`
									}) : null,
									/* @__PURE__ */ jsx("span", {
										className: "text-[11px] font-medium tabular-nums text-muted",
										children: `₪${(hud.cash ?? 0).toLocaleString()}`
									})
								]
							}),
							/* @__PURE__ */ jsx("p", {
								className: "mt-1 text-[11px] font-medium uppercase tracking-widest text-muted",
								children: hud.camName === "hood" ? (langHe ? "מכסה · C" : "Hood · C") : hud.camName === "bumper" ? (langHe ? "פגוש · C" : "Bumper · C") : hud.camName === "heli" ? (langHe ? "מסוק · C" : "Heli · C") : (langHe ? "מעקב · C" : "Chase · C")
							}),
							hud.saving ? /* @__PURE__ */ jsx("p", {
								className: "mt-1 text-[11px] font-medium text-muted",
								children: langHe ? "חיסכון גרפי" : "Graphics saver"
							}) : null,
							hud.bestLap > 0 ? /* @__PURE__ */ jsx("p", {
								className: "mt-1 text-[11px] tabular-nums text-muted",
								children: `${langHe ? "שיא" : "Best"} ${formatTime(hud.bestLap)}`
							}) : null,
							Math.abs(hud.sectorDelta) > 0.02 ? /* @__PURE__ */ jsx("p", {
								className: cn("mt-0.5 text-[11px] font-medium tabular-nums", hud.sectorDelta > 0 ? "text-danger" : "text-accent"),
								children: `${langHe ? "סקטור" : "Sector"} ${hud.sectorDelta > 0 ? "+" : ""}${hud.sectorDelta.toFixed(2)}`
							}) : null,
							hud.ghost ? /* @__PURE__ */ jsx("p", {
								className: "mt-0.5 text-[11px] tabular-nums text-muted",
								children: `${langHe ? "רוח" : "Ghost"} ${hud.ghostDelta >= 0 ? "+" : ""}${hud.ghostDelta.toFixed(1)}s`
							}) : null,
							hud.ghostRival ? /* @__PURE__ */ jsx("p", {
								className: "mt-0.5 text-[11px] tabular-nums text-muted",
								children: `${langHe ? "יריב" : "Rival"} ${hud.ghostRivalDelta >= 0 ? "+" : ""}${hud.ghostRivalDelta.toFixed(1)}s`
							}) : null,
							hud.board && hud.board.length > 1 ? /* @__PURE__ */ jsx("ol", {
								className: "mt-2 space-y-0.5",
								children: hud.board.slice(0, 8).map((row, i) => /* @__PURE__ */ jsxs("li", {
									className: row.you ? "flex justify-between gap-3 text-[11px] font-semibold" : "flex justify-between gap-3 text-[11px] text-muted",
									children: [
										/* @__PURE__ */ jsx("span", { className: "max-w-[8rem] truncate", children: `${i + 1} ${row.name}` }),
										/* @__PURE__ */ jsx("span", {
											className: "tabular-nums",
											children: row.you ? "" : `${row.gap >= 0 ? "+" : ""}${row.gap.toFixed(1)}`
										})
									]
								}, `${row.name}-${i}`))
							}) : null
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
			/* @__PURE__ */ jsx("div", {
				className: "pointer-events-none absolute left-1/2 top-16",
				style: { transform: `translateX(-50%) rotate(${hud.navAngle || 0}rad)` },
				children: /* @__PURE__ */ jsx("div", {
					className: "h-0 w-0 border-x-[9px] border-b-[16px] border-x-transparent border-b-fg drop-shadow",
					"aria-hidden": true
				})
			}),
			hud.banter ? /* @__PURE__ */ jsx("p", {
				className: "pointer-events-none absolute left-1/2 top-24 max-w-sm -translate-x-1/2 px-4 text-center text-sm font-medium text-fg",
				children: hud.banter
			}) : null,
			hud.brakeWarn && !hud.finished && !hud.replay ? /* @__PURE__ */ jsx("p", {
				className: "pointer-events-none absolute left-1/2 top-[28%] -translate-x-1/2 text-3xl font-semibold tracking-widest text-danger",
				children: langHe ? "בלום" : "BRAKE"
			}) : null,
			hud.boosting ? /* @__PURE__ */ jsx("p", {
				className: "pointer-events-none absolute left-1/2 top-36 -translate-x-1/2 text-sm font-semibold tracking-widest text-accent",
				children: langHe ? "ניטרו" : "NITRO"
			}) : null,
			hud.lapNote ? /* @__PURE__ */ jsx("p", {
				className: cn("pointer-events-none absolute left-1/2 top-44 -translate-x-1/2 text-2xl font-semibold tracking-widest", hud.lapNote === "הקפה אחרונה" || hud.lapNote === "LAST LAP" ? "text-danger" : "text-fg"),
				children: hud.lapNote
			}) : null,
			hud.cashNote ? /* @__PURE__ */ jsx("p", {
				className: "pointer-events-none absolute left-1/2 top-52 -translate-x-1/2 text-xl font-semibold tabular-nums text-accent",
				children: hud.cashNote
			}) : null,
			(hud.camFlash ?? 0) > 0.04 ? /* @__PURE__ */ jsxs("div", {
				className: "pointer-events-none absolute inset-0 z-20 flex items-start justify-center pt-28",
				style: { background: `rgba(242,238,232,${(hud.camFlash ?? 0) * 0.45})` },
				children: /* @__PURE__ */ jsx("p", {
					className: "text-sm font-semibold tracking-widest text-bg",
					children: langHe ? "מצלמת מהירות" : "SPEED CAMERA"
				})
			}) : null,
			/* @__PURE__ */ jsx("canvas", {
				ref: mapRef,
				width: 180,
				height: 180,
				className: "pointer-events-none absolute start-4 bottom-36 h-28 w-28 rounded-lg border border-border md:bottom-4 md:h-36 md:w-36",
				"aria-hidden": true
			}),
			hud.checkpointPing > 0.15 ? /* @__PURE__ */ jsx("p", {
				className: "mt-4 text-center text-sm font-semibold tracking-widest text-accent",
				children: langHe ? "שער" : "GATE"
			}) : null,
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
			}) : hud.lookingBack ? /* @__PURE__ */ jsx("p", {
				className: "mt-6 text-center text-lg font-semibold tracking-widest text-fg",
				children: langHe ? "מבט אחורה" : "LOOK BACK"
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
						hud.surface && hud.surface !== "asphalt" ? /* @__PURE__ */ jsx("p", {
							className: "mt-1 text-[11px] font-medium uppercase tracking-widest text-accent",
							children: hud.surface === "sand" ? (langHe ? "חול" : "Sand") : (langHe ? "שוליים" : "Curb")
						}) : null,
						/* @__PURE__ */ jsx("p", {
							className: "mt-1 text-[11px] text-muted",
							children: `${hud.tod || (hud.night ? (langHe ? "לילה" : "Night") : (langHe ? "יום" : "Day"))} · ${hud.weather === "storm" ? (langHe ? "סערה" : "Storm") : hud.weather === "rain" ? (langHe ? "גשם" : "Rain") : hud.weather === "hamsin" ? (langHe ? "חמסין" : "Hamsin") : (langHe ? "בהיר" : "Clear")}`
						}),
						hud.mode === "heat" ? /* @__PURE__ */ jsx("span", {
							className: "mt-1 block h-1 overflow-hidden rounded-full bg-surface-2",
							children: /* @__PURE__ */ jsx("span", {
								className: "block h-full bg-danger",
								style: { width: `${Math.round(clamp01(hud.heat) * 100)}%` }
							})
						}) : null,
						hud.combo > 1 ? /* @__PURE__ */ jsx("p", {
							className: "mt-1 text-[11px] font-medium text-accent",
							children: langHe ? `רצף ×${hud.combo}` : `Combo ×${hud.combo}`
						}) : null,
						hud.driftBonus ? /* @__PURE__ */ jsx("p", {
							className: "mt-1 text-[11px] font-medium text-accent",
							children: hud.driftBonus
						}) : null,
						hud.mode === "roam" && hud.poiNeed > 0 ? /* @__PURE__ */ jsx("p", {
							className: "mt-1 text-[11px] tabular-nums text-muted",
							children: langHe ? `נקודות ${hud.poiHunt}/${hud.poiNeed}` : `Spots ${hud.poiHunt}/${hud.poiNeed}`
						}) : null,
						hud.dirt > 0.08 ? /* @__PURE__ */ jsx("p", {
							className: "mt-1 text-[11px] text-muted",
							children: langHe ? "בוץ" : "Dirt"
						}) : null,
						hud.absActive || hud.tcsActive || hud.escActive ? /* @__PURE__ */ jsx("p", {
							className: "mt-1 text-[11px] font-medium tracking-widest text-accent",
							children: [hud.absActive ? "ABS" : "", hud.tcsActive ? "TCS" : "", hud.escActive ? "ESC" : ""].filter(Boolean).join(" ")
						}) : null,
						hud.drafting ? /* @__PURE__ */ jsx("p", {
							className: "mt-1 text-[11px] font-medium uppercase tracking-widest text-accent",
							children: langHe ? "דריפט אוויר" : "Draft"
						}) : null,
						hud.mode === "drift" || hud.drifting || hud.driftScore > 0 ? /* @__PURE__ */ jsx("p", {
							className: "mt-1 text-[11px] tabular-nums text-muted",
							children: `${langHe ? "דריפט" : "Drift"} ${Math.round(hud.driftScore)} · ${Math.round(clamp01(hud.driftCharge) * 100)}%`
						}) : null,
						Math.abs(hud.driftAngle) > 8 ? /* @__PURE__ */ jsx("p", {
							className: "mt-1 text-[11px] font-medium tabular-nums text-accent",
							children: `${Math.round(Math.abs(hud.driftAngle))}°`
						}) : null,
						hud.radio ? /* @__PURE__ */ jsx("button", {
							type: "button",
							onClick: onRadio,
							className: "pointer-events-auto mt-1 max-w-[11rem] truncate text-start text-[11px] text-muted",
							children: hud.radio
						}) : null,
						hud.damage > 0.02 ? /* @__PURE__ */ jsx("p", {
							className: "mt-1 text-[11px] font-medium tabular-nums text-danger",
							children: `${langHe ? "נזק" : "Damage"} ${Math.round(hud.damage * 100)}%`
						}) : null,
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
										}),
										hud.gear > 0 ? /* @__PURE__ */ jsx("span", {
											className: "ms-2 text-sm font-medium text-muted",
											children: langHe ? `הילוך ${hud.gear}` : `G${hud.gear}`
										}) : null,
										/* @__PURE__ */ jsx("span", {
											className: "mt-1 block h-1 w-16 overflow-hidden rounded-full bg-surface-2",
											children: /* @__PURE__ */ jsx("span", {
												className: "block h-full bg-fg",
												style: { width: `${Math.round(clamp01(hud.rpm) * 100)}%` }
											})
										}),
										/* @__PURE__ */ jsx("span", {
											className: "mt-1 block h-1 w-16 overflow-hidden rounded-full bg-surface-2",
											children: /* @__PURE__ */ jsx("span", {
												className: "block h-full bg-accent",
												style: { width: `${Math.round(clamp01(hud.nitro) * 100)}%` }
											})
										}),
										hud.rewinds > 0.2 ? /* @__PURE__ */ jsx("span", {
											className: "mt-1 block text-[11px] tabular-nums text-muted",
											children: langHe ? `R ריוויינד ${hud.rewinds.toFixed(1)}ש` : `R rewind ${hud.rewinds.toFixed(1)}s`
										}) : null
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
