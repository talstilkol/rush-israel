import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { Moon, Play, RotateCcw, Sun, Volume2, VolumeX } from "lucide-react";
import { BootOverlay } from "@/components/boot-overlay";
import { TouchControls } from "@/components/touch-controls";
import { Button } from "@/components/ui/button";
import { getEvent, starsFor } from "@/game/career";
import { emptyTune, racePayout } from "@/game/garage";
import { estimateLoadMs, recordLoadMs } from "@/game/load-eta";
import { formatTime } from "@/game/math";
import { beginRaceStartup } from "@/game/race-startup";
import { drawMinimapRoute, minimapPreviewIndices } from "@/game/minimap-route";
import {
  addCash,
  getCash,
  markDailyDone,
  markWeeklyDone,
  recordBest,
  recordEventStars,
  setMutedSave,
  setNightSave,
  setQualitySave,
  totalStars,
} from "@/game/save";
import type { RaceEngine } from "@/game/engine";
import type {
  AssistFlags,
  CarId,
  HandlingMode,
  HudState,
  Quality,
  RaceMode,
  RaceResult,
  TrackDef,
  TrackId,
  Weather,
} from "@/game/types";
import { Hud } from "./hud";
import { Overlay, type CopyFn } from "./screens";

export type RaceControllerProps = {
	screen: string;
	setScreen: Dispatch<SetStateAction<string>>;
	trackId: TrackId;
	carId: CarId;
	langHe: boolean;
	night: boolean;
	setNight: Dispatch<SetStateAction<boolean>>;
	quality: Quality;
	setQuality: Dispatch<SetStateAction<Quality>>;
	fov: number;
	mode: RaceMode;
	eventId: string | null;
	weather: Weather;
	tuneTick: number;
	handling: HandlingMode;
	assists: AssistFlags;
	muted: boolean;
	setMuted: Dispatch<SetStateAction<boolean>>;
	setStarTotal: Dispatch<SetStateAction<number>>;
	setCash: Dispatch<SetStateAction<number>>;
	track: TrackDef;
	t: CopyFn;
	engineRef: { current: RaceEngine | null };
};

export function RaceController({
	screen,
	setScreen,
	trackId,
	carId,
	langHe,
	night,
	setNight,
	quality,
	setQuality,
	fov,
	mode,
	eventId,
	weather,
	tuneTick,
	handling,
	assists,
	muted,
	setMuted,
	setStarTotal,
	setCash,
	track,
	t,
	engineRef,
}: RaceControllerProps) {
	const [hud, setHud] = useState<HudState | null>(null);
	const [result, setResult] = useState<RaceResult | null>(null);
	const [paused, setPaused] = useState(false);
	const [record, setRecord] = useState(false);
	const [raceKey, setRaceKey] = useState(0);
	const [earned, setEarned] = useState(0);
	const [loadError, setLoadError] = useState<"retry" | "reload" | null>(null);
	const [boot, setBoot] = useState<{ etaMs: number; frac: number } | null>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const mapRef = useRef<HTMLCanvasElement>(null);
// RSH-018-BLOCK-BEGIN:boot-effect
	useLayoutEffect(() => {
		if (screen !== "race") {
			setBoot(null);
			return;
		}
		setBoot({ etaMs: estimateLoadMs(trackId, quality, night), frac: 0 });
	}, [
		screen,
		trackId,
		carId,
		langHe,
		raceKey,
		mode,
		eventId,
		weather,
		tuneTick,
		handling
	]);
// RSH-018-BLOCK-END:boot-effect
// RSH-018-BLOCK-BEGIN:engine-effect
	useEffect(() => {
		if (screen !== "race") return;
		const canvas = canvasRef.current;
		if (!canvas) return;
		let cancelled = false;
		let loadingModules = true;
		const t0 = performance.now();
		setHud(null);
		setResult(null);
		setPaused(false);
		setLoadError(null);
		const startup = beginRaceStartup({
			prepare: async () => {
			await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
			await new Promise((r) => setTimeout(r, 48));
			const { RaceEngine } = await import("@/game/engine");
			const { loadAyalonRoad } = await import("@/game/road-assets");
			loadingModules = false;
			if (trackId === "ayalon") await loadAyalonRoad();
			return () => new RaceEngine(canvas, {
				trackId,
				carId,
				langHe,
				night,
				quality,
				fovExtra: fov,
				mode,
				eventId: eventId ?? void 0,
				weather,
				tune: emptyTune(),
				handling,
				assists,
				onHud: (value) => { if (!cancelled) setHud(value); },
				onBoot: (frac) => { if (!cancelled) setBoot((b) => (b ? { ...b, frac } : { etaMs: estimateLoadMs(trackId, quality, night), frac })); },
				onRestore: () => { if (!cancelled) setRaceKey((k) => k + 1); },
				onFinish: (r) => {
					if (cancelled) return;
					const ok = r.eligible !== false;
					const isBest = ok ? recordBest(r.trackId, r.totalTime, { eligible: true, carId }) : false;
					setRecord(isBest);
					const ev = r.eventId ? getEvent(r.eventId) : null;
					const got = !ok ? 0 : ev ? starsFor(ev, r) : r.place === 1 ? 3 : r.place === 2 ? 2 : r.place === 3 ? 1 : 0;
					setEarned(got);
					if (ok && r.eventId) recordEventStars(r.eventId, got);
					if (ok && r.eventId?.startsWith("daily-")) markDailyDone(r.eventId.slice(6));
					if (ok && r.eventId?.startsWith("weekly-")) markWeeklyDone(r.eventId.slice(7));
					setStarTotal(totalStars());
					const pay = ok ? (r.cash || racePayout(r)) : 0;
					setCash(ok ? addCash(pay) : getCash());
					setResult(r);
				},
			});
			},
			onReady: (inst) => {
				recordLoadMs(trackId, quality, night, performance.now() - t0);
				inst.unlockAudio();
				if (muted) inst.toggleMute();
				engineRef.current = inst;
				setBoot(null);
			},
			onError: (error) => {
				cancelled = true;
				console.error("[race] startup failed", error);
				engineRef.current = null;
				setHud(null);
				setBoot(null);
				setLoadError(loadingModules ? "reload" : "retry");
			},
		});
		return () => {
			cancelled = true;
			startup.cancel();
			engineRef.current = null;
		};
	}, [
		screen,
		trackId,
		carId,
		langHe,
		raceKey,
		mode,
		eventId,
		weather,
		tuneTick,
		handling,
		assists
	]);
// RSH-018-BLOCK-END:engine-effect
// RSH-018-BLOCK-BEGIN:keyboard-effect
	useEffect(() => {
		if (screen !== "race") return;
		const onKey = (e: KeyboardEvent) => {
			if (!engineRef.current) return;
			if (e.code === "KeyN") {
				if (result) return;
				const next = !night;
				setNight(next);
				setNightSave(next);
				engineRef.current?.setNight(next);
				return;
			}
			if (e.code !== "Escape" && e.code !== "KeyP") return;
			if (result) return;
			if (engineRef.current?.isPhoto()) {
				engineRef.current.exitPhoto();
				return;
			}
			setPaused((p) => {
				const next = !p;
				engineRef.current?.setPaused(next);
				return next;
			});
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [
		screen,
		result,
		night
	]);
// RSH-018-BLOCK-END:keyboard-effect
// RSH-018-BLOCK-BEGIN:minimap-effect
	useEffect(() => {
		const el = mapRef.current;
		const h = hud;
		if (!el || !h) return;
		const ctx = el.getContext("2d");
		if (!ctx) return;
		const w = el.width;
		const ht = el.height;
		ctx.clearRect(0, 0, w, ht);
		ctx.fillStyle = "rgba(8,10,12,0.72)";
		ctx.fillRect(0, 0, w, ht);
		const pts = h.trackPoly;
		if (!pts.length) return;
		let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity;
		for (const p of pts) {
			minX = Math.min(minX, p.x);
			maxX = Math.max(maxX, p.x);
			minZ = Math.min(minZ, p.z);
			maxZ = Math.max(maxZ, p.z);
		}
		const pad = 16;
		const sx = (w - 32) / Math.max(1, maxX - minX);
		const sz = (ht - 32) / Math.max(1, maxZ - minZ);
		const s = Math.min(sx, sz);
		const mx = (x: number) => pad + (x - minX) * s;
		const mz = (z: number) => pad + (z - minZ) * s;
		ctx.strokeStyle = "#3d484c";
		ctx.lineWidth = 7;
		ctx.lineJoin = "round";
		drawMinimapRoute(ctx, pts, mx, mz, track.open === true);
		ctx.stroke();
		ctx.strokeStyle = "#9aa4aa";
		ctx.lineWidth = 3;
		ctx.stroke();
		const preview = minimapPreviewIndices(pts.length, h.progress, track.open === true);
		ctx.strokeStyle = "#ffd24a";
		ctx.lineWidth = 5;
		ctx.beginPath();
		for (let k = 0; k < preview.length; k++) {
			const p = pts[preview[k]];
			if (k === 0) ctx.moveTo(mx(p.x), mz(p.z));
			else ctx.lineTo(mx(p.x), mz(p.z));
		}
		ctx.stroke();
		for (const p of h.poiMarks) {
			ctx.fillStyle = "#c9a05a";
			ctx.fillRect(mx(p.x) - 2.2, mz(p.z) - 2.2, 4.4, 4.4);
		}
		for (const c of h.minimap) {
			ctx.fillStyle = c.isPlayer ? "#f2eee8" : c.cop ? "#d45b4a" : c.traffic ? "#d4b46a" : "#8b959e";
			if (c.isPlayer) {
				ctx.save();
				ctx.translate(mx(c.x), mz(c.z));
				ctx.rotate(-c.yaw);
				ctx.beginPath();
				ctx.moveTo(0, -7);
				ctx.lineTo(-4.2, 5);
				ctx.lineTo(4.2, 5);
				ctx.closePath();
				ctx.fill();
				ctx.restore();
			} else {
				ctx.beginPath();
				ctx.arc(mx(c.x), mz(c.z), c.cop ? 3.2 : c.traffic ? 2.2 : 3, 0, Math.PI * 2);
				ctx.fill();
			}
		}
	}, [hud, track.open]);
// RSH-018-BLOCK-END:minimap-effect
// RSH-018-BLOCK-BEGIN:toggleNight
	const toggleNight = () => {
		const next = !night;
		setNight(next);
		setNightSave(next);
		engineRef.current?.setNight(next);
	};
// RSH-018-BLOCK-END:toggleNight

	if (screen !== "race") return null;
// RSH-018-BLOCK-BEGIN:race-view
	return /* @__PURE__ */ jsxs(Fragment, { children: [
			/* @__PURE__ */ jsx("canvas", {
				ref: canvasRef,
				className: "block h-full w-full touch-none",
				onPointerDown: () => engineRef.current?.unlockAudio()
			}),
			loadError ? /* @__PURE__ */ jsx(Overlay, {
				children: jsxs("section", {
					role: "alert",
					"aria-live": "assertive",
					"aria-labelledby": "race-load-error-title",
					"data-testid": "race-load-error",
					children: [
						jsx("h2", { id: "race-load-error-title", className: "text-2xl font-semibold", children: t("טעינת המרוץ נכשלה", "Race could not load") }),
						jsx("p", { className: "my-4", children: t("בדקו את החיבור ונסו שוב. אם התקלה נמשכת, טענו את הדף מחדש.", "Check the connection and retry. If the problem persists, reload the page.") }),
						jsx(Button, { autoFocus: true, onClick: () => { if (loadError === "reload") window.location.reload(); else setRaceKey((key) => key + 1); }, children: loadError === "reload" ? t("טעינת הדף מחדש", "Reload page") : t("ניסיון חוזר", "Retry") }),
						jsx(Button, { variant: "outline", className: "ms-2", onClick: () => setScreen("title"), children: t("מסך ראשי", "Main menu") }),
					],
				}),
			}) : null,
			boot ? /* @__PURE__ */ jsx(BootOverlay, {
				etaMs: boot.etaMs,
				frac: boot.frac,
				langHe,
				city: langHe ? track.cityHe : track.cityEn,
				name: langHe ? track.nameHe : track.nameEn
			}) : null,
			hud && !result && !boot ? /* @__PURE__ */ jsx(Hud, {
				hud,
				langHe,
				mapRef,
				onPause: () => {
					const next = !paused;
					setPaused(next);
					engineRef.current?.setPaused(next);
				},
				onMute: () => {
					const m = engineRef.current?.toggleMute() ?? !muted;
					setMuted(m);
					setMutedSave(m);
				},
				muted,
				night: hud.night,
				onNight: toggleNight,
				onSkipReplay: () => engineRef.current?.skipReplay(),
				onPhotoFilter: () => engineRef.current?.cyclePhotoFilter(),
				onPhotoHide: () => engineRef.current?.togglePhotoHud(),
				onPhotoExit: () => engineRef.current?.exitPhoto(),
				onPhotoSave: () => engineRef.current?.capturePhoto()
			}) : null,
			hud && !hud.photo && !boot ? /* @__PURE__ */ jsx(TouchControls, {
				engine: engineRef.current,
				langHe
			}) : null,
			hud && hud.countdown > 0 && !boot ? /* @__PURE__ */ jsxs("div", {
				className: "pointer-events-none absolute inset-0 z-30 flex flex-col items-center justify-center gap-6",
				children: [
					/* @__PURE__ */ jsx("div", {
						className: "text-6xl font-semibold tabular-nums tracking-tight text-fg",
						children: hud.countdown > 1 ? Math.ceil(hud.countdown) : t("סע!", "GO")
					}),
					/* @__PURE__ */ jsx("p", {
						className: "rounded-full border border-border bg-surface/80 px-4 py-2 text-sm font-medium text-fg",
						children: t("W גז · A/D הגה", "W gas · A/D steer")
					}),
					hud.banter ? /* @__PURE__ */ jsx("p", {
						className: "max-w-md px-6 text-center text-sm font-medium text-fg",
						children: hud.banter
					}) : null
				]
			}) : null,
			paused && !result && !hud?.photo ? /* @__PURE__ */ jsxs(Overlay, { children: [/* @__PURE__ */ jsx("h2", {
				className: "text-2xl font-semibold tracking-tight",
				children: t("תפריט", "Menu")
			}), /* @__PURE__ */ jsxs("div", {
				className: "mt-5 flex flex-col gap-2",
				children: [
					/* @__PURE__ */ jsxs(Button, {
						onClick: () => {
							setPaused(false);
							engineRef.current?.setPaused(false);
						},
						children: [/* @__PURE__ */ jsx(Play, { className: "size-4" }), t("המשך", "Resume")]
					}),
					/* @__PURE__ */ jsxs(Button, {
						variant: "outline",
						onClick: () => {
							engineRef.current?.restartRace();
							setPaused(false);
						},
						children: [/* @__PURE__ */ jsx(RotateCcw, { className: "size-4" }), t("התחל מחדש", "Restart")]
					}),
					/* @__PURE__ */ jsx(Button, {
						variant: "outline",
						onClick: () => {
							setPaused(false);
							setScreen("title");
							setHud(null);
							setResult(null);
						},
						children: t("מסך ראשי", "Main menu")
					}),
					/* @__PURE__ */ jsxs(Button, {
						variant: "outline",
						onClick: () => {
							const m = engineRef.current?.toggleMute() ?? !muted;
							setMuted(m);
							setMutedSave(m);
						},
						children: [muted ? /* @__PURE__ */ jsx(VolumeX, { className: "size-4" }) : /* @__PURE__ */ jsx(Volume2, { className: "size-4" }), muted ? t("מושתק", "Muted") : t("צליל", "Sound")]
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mt-2 text-xs font-medium uppercase tracking-widest text-muted",
						children: t("הגדרות", "Settings")
					}),
					/* @__PURE__ */ jsxs(Button, {
						variant: "outline",
						onClick: toggleNight,
						children: [night ? /* @__PURE__ */ jsx(Moon, { className: "size-4" }) : /* @__PURE__ */ jsx(Sun, { className: "size-4" }), night ? t("יום", "Day") : t("לילה", "Night")]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ jsx(Button, {
							variant: quality === "low" ? "primary" : "outline",
							className: "flex-1",
							onClick: () => {
								setQuality("low");
								setQualitySave("low");
								engineRef.current?.applyQuality("low");
							},
							children: t("נמוכה", "Low")
						}), /* @__PURE__ */ jsx(Button, {
							variant: quality === "mid" ? "primary" : "outline",
							className: "flex-1",
							onClick: () => {
								setQuality("mid");
								setQualitySave("mid");
								engineRef.current?.applyQuality("mid");
							},
							children: t("בינונית", "Mid")
						}), /* @__PURE__ */ jsx(Button, {
							variant: quality === "high" ? "primary" : "outline",
							className: "flex-1",
							onClick: () => {
								setQuality("high");
								setQualitySave("high");
								engineRef.current?.applyQuality("high");
							},
							children: t("גבוהה", "High")
						})]
					})
				]
			})] }) : null,
			result ? /* @__PURE__ */ jsxs(Overlay, { children: [
				/* @__PURE__ */ jsxs("p", {
					className: "text-xs font-medium uppercase tracking-widest text-muted",
					children: [
						langHe ? track.cityHe : track.cityEn,
						" · ",
						langHe ? track.nameHe : track.nameEn
					]
				}),
				/* @__PURE__ */ jsx("h2", {
					className: "mt-2 text-3xl font-semibold tracking-tight",
					children: result.place === 1 ? t("ניצחון", "Victory") : t(`מקום ${result.place}`, `P${result.place}`)
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-3 font-medium tabular-nums text-lg",
					children: formatTime(result.totalTime)
				}),
				/* @__PURE__ */ jsxs("p", {
					className: "mt-1 text-sm text-muted",
					children: [
						t("הקפה הטובה", "Best lap"),
						" ",
						formatTime(result.bestLap)
					]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "mt-6 flex flex-col gap-2",
					children: [/* @__PURE__ */ jsxs(Button, {
						onClick: () => {
							setResult(null);
							setHud(null);
							setPaused(false);
							setRaceKey((k) => k + 1);
						},
						children: [/* @__PURE__ */ jsx(RotateCcw, { className: "size-4" }), t("מרוץ נוסף", "Race again")]
					}), /* @__PURE__ */ jsx(Button, {
						variant: "outline",
						onClick: () => {
							setResult(null);
							setHud(null);
							setScreen("tracks");
						},
						children: t("בחירת מסלול", "Choose track")
					})]
				})
			] }) : null
		] });
// RSH-018-BLOCK-END:race-view
}
