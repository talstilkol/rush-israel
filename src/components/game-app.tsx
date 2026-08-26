import { useEffect, useLayoutEffect, useRef, useState, type Dispatch, type ReactNode, type RefObject, type SetStateAction } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import {
  Flag,
  Gauge,
  Moon,
  Pause,
  Play,
  RotateCcw,
  Settings,
  Shield,
  Star,
  Sun,
  Timer,
  Trophy,
  Volume2,
  VolumeX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CarShowroom } from "@/components/car-showroom";
import { TouchControls } from "@/components/touch-controls";
import { BootOverlay } from "@/components/boot-overlay";
import { CARS } from "@/game/cars";
import { chapters, dailyEvent, getEvent, maxStars, starsFor, weeklyEvent, CAR_UNLOCK } from "@/game/career";
import { applyTune, LIVERIES, LIVERY_COST, nextCost, PAINT_COST, PAINTS, racePayout } from "@/game/garage";
import { formatTime } from "@/game/math";
import { MODE_INFO, RACE_MODES } from "@/game/modes";
import {
  addCash,
  allBests,
  allEventStars,
  getAssists,
  getCash,
  getDamage,
  getFov,
  getHandling,
  getLang,
  getMuted,
  getNight,
  getQuality,
  getTune,
  isCarUnlocked,
  markDailyDone,
  markWeeklyDone,
  recordBest,
  recordEventStars,
  repairCar,
  repairCost,
  setAssistsSave,
  setFovSave,
  setHandlingSave,
  setLangSave,
  setMutedSave,
  setNightSave,
  setQualitySave,
  setTune,
  spendCash,
  totalStars,
} from "@/game/save";
import { CITY_FILTERS, TRACKS, isDriveable } from "@/game/tracks";
import { estimateLoadMs, recordLoadMs } from "@/game/load-eta";
import { copy, dirFor, langShort, nextLang, type Lang } from "@/game/i18n";
import { cn } from "@/lib/utils";
import type { AssistFlags, CarDef, CarId, HandlingMode, HudState, Quality, RaceMode, RaceResult, TrackDef, TrackId, Tune, Weather } from "@/game/types";
import type { RaceEngine } from "@/game/engine";

function themeWash(theme: string, night: boolean) {
	if (night) return "#12151a";
	if (theme === "desert") return "#8a6240";
	if (theme === "snow") return "#6a7a8c";
	if (theme === "stone") return "#6a5a48";
	if (theme === "carmel") return "#2a4030";
	if (theme === "jaffa") return "#6a4838";
	if (theme === "highway") return "#2a3038";
	if (theme === "bauhaus") return "#4a4038";
	if (theme === "park") return "#2a4838";
	if (theme === "port") return "#243848";
	return "#243040";
}

export function GameApp() {
	const [screen, setScreen] = useState("title");
	const [trackId, setTrackId] = useState<TrackId>("telaviv");
	const [carId, setCarId] = useState<CarId>("sabra");
	const [hud, setHud] = useState<HudState | null>(null);
	const [result, setResult] = useState<RaceResult | null>(null);
	const [paused, setPaused] = useState(false);
	const [muted, setMuted] = useState(false);
	const [night, setNight] = useState(false);
	const [quality, setQuality] = useState<Quality>("high");
	const [fov, setFov] = useState(0);
	const [lang, setLang] = useState<Lang>("he");
	const langHe = lang === "he";
	const [handling, setHandling] = useState<HandlingMode>("simcade");
	const [assists, setAssists] = useState<AssistFlags>({ abs: true, tcs: true, esc: true });
	const [record, setRecord] = useState(false);
	const [raceKey, setRaceKey] = useState(0);
	const [mode, setMode] = useState<RaceMode>("circuit");
	const [eventId, setEventId] = useState<string | null>(null);
	const [earned, setEarned] = useState(0);
	const [starTotal, setStarTotal] = useState(0);
	const [weather, setWeather] = useState<Weather>("clear");
	const [cash, setCash] = useState(500);
	const [tuneTick, setTuneTick] = useState(0);
	const [boot, setBoot] = useState<{ etaMs: number } | null>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const engineRef = useRef<RaceEngine | null>(null);
	const mapRef = useRef<HTMLCanvasElement>(null);
	useEffect(() => {
		setMuted(getMuted());
		setNight(getNight());
		setQuality(getQuality());
		setFov(getFov());
		setStarTotal(totalStars());
		setCash(getCash());
		setHandling(getHandling());
		setAssists(getAssists());
		const savedLang = getLang();
		if (savedLang) setLang(savedLang);
	}, []);
	useLayoutEffect(() => {
		if (screen !== "race") {
			setBoot(null);
			return;
		}
		setBoot({ etaMs: estimateLoadMs(trackId, quality, night) });
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
	useEffect(() => {
		if (screen !== "race") return;
		const canvas = canvasRef.current;
		if (!canvas) return;
		let cancelled = false;
		let inst: RaceEngine | null = null;
		const t0 = performance.now();
		setHud(null);
		void (async () => {
			await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
			await new Promise((r) => setTimeout(r, 48));
			if (cancelled) return;
			const { RaceEngine } = await import("@/game/engine");
			const { loadAyalonRoad } = await import("@/game/road-assets");
			if (trackId === "ayalon") await loadAyalonRoad();
			if (cancelled) return;
			inst = new RaceEngine(canvas, {
				trackId,
				carId,
				langHe,
				night,
				quality,
				fovExtra: fov,
				mode,
				eventId: eventId ?? void 0,
				weather,
				tune: getTune(carId),
				handling,
				assists,
				onHud: setHud,
				onRestore: () => setRaceKey((k) => k + 1),
				onFinish: (r) => {
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
			await inst.ready;
			if (cancelled) {
				inst.dispose();
				return;
			}
			recordLoadMs(trackId, quality, night, performance.now() - t0);
			inst.unlockAudio();
			engineRef.current = inst;
			if (muted) inst.toggleMute();
			setBoot(null);
		})();
		return () => {
			cancelled = true;
			engineRef.current?.dispose();
			engineRef.current = null;
			inst?.dispose();
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
	useEffect(() => {
		if (screen !== "race") return;
		const onKey = (e: KeyboardEvent) => {
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
		ctx.beginPath();
		pts.forEach((p, i) => {
			if (i === 0) ctx.moveTo(mx(p.x), mz(p.z));
			else ctx.lineTo(mx(p.x), mz(p.z));
		});
		ctx.closePath();
		ctx.stroke();
		ctx.strokeStyle = "#9aa4aa";
		ctx.lineWidth = 3;
		ctx.stroke();
		const n = pts.length;
		const start = Math.floor((h.progress % 1 + 1) % 1 * n);
		ctx.strokeStyle = "#ffd24a";
		ctx.lineWidth = 4;
		ctx.beginPath();
		for (let k = 0; k < Math.max(6, Math.floor(n * .2)); k++) {
			const p = pts[(start + k) % n];
			if (k === 0) ctx.moveTo(mx(p.x), mz(p.z));
			else ctx.lineTo(mx(p.x), mz(p.z));
		}
		ctx.stroke();
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
	}, [hud]);
	const t = (he: string, en: string, ar?: string) => copy(lang, he, en, ar);
	const track = TRACKS.find((x) => x.id === trackId) ?? TRACKS[0]!;
	const car = CARS.find((x) => x.id === carId) ?? CARS[0]!;
	const toggleNight = () => {
		const next = !night;
		setNight(next);
		setNightSave(next);
		engineRef.current?.setNight(next);
	};
	const cycleLang = () => {
		const next = nextLang(lang);
		setLang(next);
		setLangSave(next);
	};
	return /* @__PURE__ */ jsx("div", {
		dir: dirFor(lang),
		className: "relative h-dvh w-full overflow-hidden bg-bg text-fg",
		children: screen === "race" ? /* @__PURE__ */ jsxs(Fragment, { children: [
			/* @__PURE__ */ jsx("canvas", {
				ref: canvasRef,
				className: "block h-full w-full touch-none",
				onPointerDown: () => engineRef.current?.unlockAudio()
			}),
			boot ? /* @__PURE__ */ jsx(BootOverlay, {
				etaMs: boot.etaMs,
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
		] }) : /* @__PURE__ */ jsx(Menu, {
			screen,
			setScreen,
			trackId,
			setTrackId,
			carId,
			setCarId,
			langHe,
			lang,
			cycleLang,
			muted,
			setMuted: (m: boolean) => {
				setMuted(m);
				setMutedSave(m);
			},
			night,
			setNightMode: (n: boolean) => {
				setNight(n);
				setNightSave(n);
			},
			t,
			track,
			car,
			quality,
			setQualityMode: (q: Quality) => {
				setQuality(q);
				setQualitySave(q);
			},
			fov,
			setFovMode: (v: number) => {
				setFov(v);
				setFovSave(v);
				engineRef.current?.setFovExtra(v);
			},
			mode,
			setMode,
			starTotal,
			eventId,
			setEventId,
			weather,
			setWeatherMode: setWeather,
			cash,
			setCash,
			handling,
			setHandlingMode: (h: HandlingMode) => {
				setHandling(h);
				setHandlingSave(h);
			},
			assists,
			setAssistsMode: (a: AssistFlags) => {
				setAssists(a);
				setAssistsSave(a);
			},
			onTuned: () => setTuneTick((n) => n + 1),
			startCareer: (id: string) => {
				const ev = getEvent(id);
				if (!ev) return;
				if (totalStars() < ev.unlockStars) return;
				setEventId(ev.id);
				setTrackId(ev.trackId);
				setMode(ev.mode);
				setNight(ev.night);
				setNightSave(ev.night);
				setWeather(ev.weather ?? "clear");
				if (!isCarUnlocked(carId)) setCarId("sabra");
				setScreen("race");
			}
		})
	});
}
function clamp01(v: number) {
	return Math.max(0, Math.min(1, Number(v) || 0));
}
function Overlay({ children }: { children: ReactNode }) {
	return /* @__PURE__ */ jsx("div", {
		className: "absolute inset-0 z-40 flex items-center justify-center bg-bg/70 p-4",
		children: /* @__PURE__ */ jsx("div", {
			className: "w-full max-w-sm rounded-xl border border-border bg-surface p-6",
			children
		})
	});
}
type CopyFn = (he: string, en: string, ar?: string) => string;
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
									hud.mode === "roam" ? (langHe ? "חופשי" : "Roam") : (langHe ? `הקפה ${hud.lap}/${hud.totalLaps}` : `Lap ${hud.lap}/${hud.totalLaps}`)
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
											className: "text-3xl font-semibold tabular-nums leading-tight",
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
type MenuProps = {
	screen: string;
	setScreen: Dispatch<SetStateAction<string>>;
	trackId: TrackId;
	setTrackId: Dispatch<SetStateAction<TrackId>>;
	carId: CarId;
	setCarId: Dispatch<SetStateAction<CarId>>;
	langHe: boolean;
	lang: Lang;
	cycleLang: () => void;
	muted: boolean;
	setMuted: (m: boolean) => void;
	night: boolean;
	setNightMode: (n: boolean) => void;
	t: CopyFn;
	track: TrackDef;
	car: CarDef;
	quality: Quality;
	setQualityMode: (q: Quality) => void;
	fov: number;
	setFovMode: (v: number) => void;
	mode: RaceMode;
	setMode: Dispatch<SetStateAction<RaceMode>>;
	starTotal: number;
	eventId: string | null;
	setEventId: Dispatch<SetStateAction<string | null>>;
	weather: Weather;
	setWeatherMode: Dispatch<SetStateAction<Weather>>;
	cash: number;
	setCash: Dispatch<SetStateAction<number>>;
	handling: HandlingMode;
	setHandlingMode: (h: HandlingMode) => void;
	assists: AssistFlags;
	setAssistsMode: (a: AssistFlags) => void;
	onTuned: () => void;
	startCareer: (id: string) => void;
};
function Menu({ screen, setScreen, trackId, setTrackId, carId, setCarId, langHe, lang, cycleLang, muted, setMuted, night, setNightMode, t, track, car, quality, setQualityMode, fov, setFovMode, mode, setMode, starTotal, eventId, setEventId, weather, setWeatherMode, cash, setCash, handling, setHandlingMode, assists, setAssistsMode, onTuned, startCareer }: MenuProps) {
	const [cityFilter, setCityFilter] = useState("telaviv");
	const [showSet, setShowSet] = useState(false);
	allBests();
	return /* @__PURE__ */ jsxs("div", {
		className: "relative flex h-full min-h-0 flex-col",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "absolute inset-0 h-full w-full transition duration-500",
				style: { background: themeWash(track.theme, night) },
				"aria-hidden": true
			}),
			/* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute inset-0 bg-bg/72" }),
			/* @__PURE__ */ jsxs("header", {
				className: "relative z-10 flex items-center justify-between px-5 py-4",
				children: [/* @__PURE__ */ jsx("p", {
					className: "text-sm font-medium tracking-wide text-muted",
					children: "RUSH"
				}), /* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ jsx("button", {
						type: "button",
						className: "min-h-11 rounded-md border border-border bg-surface/80 px-3 text-xs font-medium",
						onClick: cycleLang,
						children: langShort(lang)
					}), /* @__PURE__ */ jsx("button", {
						type: "button",
						className: "grid size-11 place-items-center rounded-md border border-border bg-surface/80",
						onClick: () => setShowSet((v) => !v),
						"aria-label": "settings",
						children: /* @__PURE__ */ jsx(Settings, { className: "size-4" })
					})]
				})]
			}),
			showSet ? /* @__PURE__ */ jsxs("div", {
				className: "relative z-20 mx-5 mb-2 rounded-lg border border-border bg-surface/90 p-4",
				children: [
					/* @__PURE__ */ jsx("p", {
						className: "text-sm font-medium",
						children: t("הגדרות", "Settings")
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "mt-3 flex gap-2",
						children: [/* @__PURE__ */ jsx("button", {
							type: "button",
							className: cn("min-h-10 flex-1 rounded-md border text-sm", quality === "low" ? "border-fg bg-fg text-bg" : "border-border"),
							onClick: () => setQualityMode("low"),
							children: t("נמוכה", "Low")
						}), /* @__PURE__ */ jsx("button", {
							type: "button",
							className: cn("min-h-10 flex-1 rounded-md border text-sm", quality === "mid" ? "border-fg bg-fg text-bg" : "border-border"),
							onClick: () => setQualityMode("mid"),
							children: t("בינונית", "Mid")
						}), /* @__PURE__ */ jsx("button", {
							type: "button",
							className: cn("min-h-10 flex-1 rounded-md border text-sm", quality === "high" ? "border-fg bg-fg text-bg" : "border-border"),
							onClick: () => setQualityMode("high"),
							children: t("גבוהה", "High")
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "mt-3 flex gap-2",
						children: [/* @__PURE__ */ jsxs("button", {
							type: "button",
							className: cn("flex min-h-10 flex-1 items-center justify-center gap-2 rounded-md border text-sm", !night ? "border-fg bg-fg text-bg" : "border-border"),
							onClick: () => setNightMode(false),
							children: [/* @__PURE__ */ jsx(Sun, { className: "size-4" }), t("יום", "Day")]
						}), /* @__PURE__ */ jsxs("button", {
							type: "button",
							className: cn("flex min-h-10 flex-1 items-center justify-center gap-2 rounded-md border text-sm", night ? "border-fg bg-fg text-bg" : "border-border"),
							onClick: () => setNightMode(true),
							children: [/* @__PURE__ */ jsx(Moon, { className: "size-4" }), t("לילה", "Night")]
						})]
					}),
					/* @__PURE__ */ jsxs("button", {
						type: "button",
						className: "mt-3 flex min-h-10 w-full items-center justify-center gap-2 rounded-md border border-border text-sm",
						onClick: () => setMuted(!muted),
						children: [muted ? /* @__PURE__ */ jsx(VolumeX, { className: "size-4" }) : /* @__PURE__ */ jsx(Volume2, { className: "size-4" }), muted ? t("מושתק", "Muted") : t("צליל", "Sound")]
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mt-3 text-xs text-muted",
						children: t("שדה ראייה", "Field of view", "مجال الرؤية")
					}),
					/* @__PURE__ */ jsx("input", {
						type: "range",
						min: 0,
						max: 12,
						value: fov,
						onChange: (e: { target: { value: string } }) => setFovMode(Number(e.target.value)),
						className: "mt-1 w-full accent-current"
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mt-3 text-xs text-muted",
						children: t("פיזיקה", "Physics", "فيزياء")
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "mt-2 flex gap-2",
						children: [/* @__PURE__ */ jsx("button", {
							type: "button",
							className: cn("min-h-10 flex-1 rounded-md border text-sm", handling === "simcade" ? "border-fg bg-fg text-bg" : "border-border"),
							onClick: () => setHandlingMode("simcade"),
							children: t("סימקייד", "Simcade", "سيمكيد")
						}), /* @__PURE__ */ jsx("button", {
							type: "button",
							className: cn("min-h-10 flex-1 rounded-md border text-sm", handling === "arcade" ? "border-fg bg-fg text-bg" : "border-border"),
							onClick: () => setHandlingMode("arcade"),
							children: t("ארקייד", "Arcade", "أركيد")
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "mt-2 flex gap-2",
						children: (["abs", "tcs", "esc"] as const).map((k) => /* @__PURE__ */ jsx("button", {
							type: "button",
							className: cn("min-h-10 flex-1 rounded-md border text-xs font-medium uppercase tracking-widest", assists[k] ? "border-fg bg-fg text-bg" : "border-border"),
							onClick: () => setAssistsMode({ ...assists, [k]: !assists[k] }),
							children: k.toUpperCase()
						}, k))
					})
				]
			}) : null,
			/* @__PURE__ */ jsxs("main", {
				className: "relative z-10 flex min-h-0 flex-1 flex-col overflow-y-auto px-5 pb-8",
				children: [
					screen === "title" ? /* @__PURE__ */ jsxs("div", {
						className: "mx-auto mt-auto mb-4 w-full max-w-lg",
						children: [
							/* @__PURE__ */ jsx("p", {
								className: "text-sm text-muted",
								children: t("סימקייד ישראלי · 120Hz", "Israeli simcade · 120Hz", "سيمكيد إسرائيلي · 120Hz")
							}),
							/* @__PURE__ */ jsx("h1", {
								className: "mt-2 text-5xl font-semibold tracking-tight text-balance",
								children: "RUSH"
							}),
							/* @__PURE__ */ jsx("p", {
								className: "mt-4 max-w-md text-pretty text-sm leading-relaxed text-muted",
								children: t("איילון, רוטשילד וירושלים — משקל, צמיגים ועזרות. בחר עיר וסע.", "Ayalon, Rothschild and Jerusalem — weight, tires and assists. Pick a city and drive.", "أيالون وروتشيلد والقدس — وزن وإطارات ومساعدات. اختر مدينة وقُد.")
							}),
							/* @__PURE__ */ jsxs(Button, {
								className: "mt-8 min-h-14 w-full text-base",
								onClick: () => {
									setEventId(null);
									setMode("circuit");
									setScreen("tracks");
								},
								children: [/* @__PURE__ */ jsx(Flag, { className: "size-4" }), t("בחר מסלול", "Choose track", "اختر المسار")]
							}),
							/* @__PURE__ */ jsx("p", {
								className: "mt-6 text-xs text-subtle",
								children: t("W גז · A/D הגה · Esc תפריט", "W gas · A/D steer · Esc menu", "W بنزين · A/D توجيه · Esc قائمة")
							})
						]
					}) : null,
					screen === "career" ? /* @__PURE__ */ jsx(CareerPanel, {
						langHe,
						t,
						starTotal,
						onBack: () => setScreen("title"),
						onStart: startCareer
					}) : null,
					screen === "garage" ? /* @__PURE__ */ jsx(GaragePanel, {
						langHe,
						t,
						carId,
						setCarId,
						cash,
						setCash,
						onBack: () => setScreen("title"),
						onTuned
					}) : null,
					screen === "tracks" ? /* @__PURE__ */ jsxs("div", {
						className: "mx-auto w-full max-w-3xl",
						children: [
							/* @__PURE__ */ jsx("div", {
								className: "sticky top-0 z-20 -mx-1 mb-3 border-b border-border bg-bg/95 px-1 py-3 backdrop-blur",
								children: /* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-3",
									children: [
										/* @__PURE__ */ jsx("button", {
											type: "button",
											className: "shrink-0 text-sm text-muted",
											onClick: () => setScreen("title"),
											children: t("חזרה", "Back")
										}),
										/* @__PURE__ */ jsx("p", {
											className: "min-w-0 flex-1 truncate text-sm font-medium",
											children: langHe ? track.nameHe : track.nameEn
										}),
										/* @__PURE__ */ jsx(Button, {
											className: "min-h-11 shrink-0 px-5",
											onClick: () => {
												setMode("circuit");
												setEventId(null);
												setScreen("race");
											},
											children: t("סע", "Drive")
										})
									]
								})
							}),
							/* @__PURE__ */ jsx("h2", {
								className: "text-3xl font-semibold tracking-tight",
								children: t("מסלולים", "Tracks")
							}),
							/* @__PURE__ */ jsx("p", {
								className: "mt-1 text-sm text-muted",
								children: t("בהשראת המקומות — לא מפה, לא GIS. בחר וסע.", "Inspired by the places — not a map, not GIS. Pick and drive.")
							}),
							/* @__PURE__ */ jsx("div", {
								className: "mt-4 flex flex-wrap gap-2",
								children: CITY_FILTERS.filter((c) => c.id === "all" || TRACKS.some((tr) => isDriveable(tr) && tr.city === c.id)).map((c) => {
									const active = cityFilter === c.id;
									return /* @__PURE__ */ jsx("button", {
										type: "button",
										onClick: () => setCityFilter(c.id),
										className: cn("min-h-10 rounded-full border px-3.5 text-sm font-medium", active ? "border-fg bg-fg text-bg" : "border-border bg-surface/80 text-muted"),
										children: langHe ? c.he : c.en
									}, c.id);
								})
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "mt-3 flex gap-2",
								children: [/* @__PURE__ */ jsxs("button", {
									type: "button",
									onClick: () => setNightMode(false),
									className: cn("flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg border text-sm font-medium", !night ? "border-fg bg-fg text-bg" : "border-border bg-surface/80 text-muted"),
									children: [/* @__PURE__ */ jsx(Sun, { className: "size-4" }), t("יום", "Day")]
								}), /* @__PURE__ */ jsxs("button", {
									type: "button",
									onClick: () => setNightMode(true),
									className: cn("flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg border text-sm font-medium", night ? "border-fg bg-fg text-bg" : "border-border bg-surface/80 text-muted"),
									children: [/* @__PURE__ */ jsx(Moon, { className: "size-4" }), t("לילה", "Night")]
								})]
							}),
							/* @__PURE__ */ jsx("div", {
								className: "mt-5 grid gap-3 sm:grid-cols-2",
								children: TRACKS.filter((tr) => isDriveable(tr) && (cityFilter === "all" || tr.city === cityFilter)).map((tr) => {
									const active = tr.id === trackId;
									return /* @__PURE__ */ jsxs("button", {
										type: "button",
										onClick: () => {
											setTrackId(tr.id);
											setEventId(null);
											setMode("circuit");
											setScreen("race");
										},
										className: cn("overflow-hidden rounded-xl border text-start", active ? "border-fg" : "border-border"),
										children: [/* @__PURE__ */ jsxs("span", {
											className: "relative block",
											children: [
												/* @__PURE__ */ jsx("span", {
													className: "block h-24 w-full",
													style: { background: themeWash(tr.theme, night) },
													"aria-hidden": true
												}),
												night ? /* @__PURE__ */ jsx("span", { className: "pointer-events-none absolute inset-0 bg-bg/35" }) : null,
												/* @__PURE__ */ jsxs("span", {
													className: "absolute top-2 end-2 flex items-center gap-1 rounded-md border border-border bg-surface/85 px-2 py-1 text-xs font-medium",
													children: [night ? /* @__PURE__ */ jsx(Moon, { className: "size-3" }) : /* @__PURE__ */ jsx(Sun, { className: "size-3" }), night ? t("לילה", "Night") : t("יום", "Day")]
												})
											]
										}), /* @__PURE__ */ jsxs("div", {
											className: "bg-surface p-4",
											children: [
												/* @__PURE__ */ jsx("p", {
													className: "text-xs text-muted",
													children: langHe ? tr.cityHe : tr.cityEn
												}),
												/* @__PURE__ */ jsx("p", {
													className: "mt-1 font-semibold",
													children: langHe ? tr.nameHe : tr.nameEn
												}),
												/* @__PURE__ */ jsx("p", {
													className: "mt-1 text-xs text-muted",
													children: tr.lengthHint
												}),
												/* @__PURE__ */ jsx("p", {
													className: "mt-2 text-xs leading-relaxed text-subtle",
													children: langHe ? tr.description : tr.descriptionEn
												})
											]
										})]
									}, tr.id);
								})
							})
						]
					}) : null,
					screen === "cars" ? /* @__PURE__ */ jsxs("div", {
						className: "mx-auto w-full max-w-xl",
						children: [
							/* @__PURE__ */ jsx("div", {
								className: "sticky top-0 z-20 -mx-1 mb-3 border-b border-border bg-bg/95 px-1 py-3 backdrop-blur",
								children: /* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-3",
									children: [
										/* @__PURE__ */ jsx("button", {
											type: "button",
											className: "shrink-0 text-sm text-muted",
											onClick: () => setScreen(eventId ? "career" : "tracks"),
											children: t("חזרה", "Back")
										}),
										/* @__PURE__ */ jsx("p", {
											className: "min-w-0 flex-1 truncate text-sm font-medium",
											children: langHe ? car.nameHe : car.nameEn
										}),
										/* @__PURE__ */ jsx(Button, {
											className: "min-h-11 shrink-0 px-5",
											disabled: !isCarUnlocked(carId),
											onClick: () => setScreen("race"),
											children: t("זינוק", "Start")
										})
									]
								})
							}),
							/* @__PURE__ */ jsx("h2", {
								className: "text-3xl font-semibold tracking-tight",
								children: t("רכב", "Car")
							}),
							/* @__PURE__ */ jsx("div", {
								className: "mt-4",
								children: /* @__PURE__ */ jsx(CarShowroom, {
									color: applyTune(car, getTune(carId)).color,
									accent: car.accent,
									body: car.body,
									damage: getDamage(carId),
									kit: car.kit,
									tune: getTune(carId)
								})
							}),
							/* @__PURE__ */ jsxs("p", {
								className: "mt-1 text-sm text-muted",
								children: [
									langHe ? track.cityHe : track.cityEn,
									" · ",
									langHe ? track.nameHe : track.nameEn,
									" · ",
									night ? t("לילה", "Night") : t("יום", "Day"),
									" · ",
									langHe ? MODE_INFO[mode].he : MODE_INFO[mode].en
								]
							}),
							/* @__PURE__ */ jsx("div", {
								className: "mt-5 grid gap-2",
								children: CARS.map((c) => {
									const active = c.id === carId;
									const unlocked = isCarUnlocked(c.id);
									const need = CAR_UNLOCK[c.id];
									return /* @__PURE__ */ jsxs("button", {
										type: "button",
										onClick: () => {
											if (unlocked) setCarId(c.id);
										},
										className: cn("flex items-center gap-4 rounded-lg border bg-surface p-4 text-start", active && unlocked ? "border-fg" : "border-border", !unlocked && "opacity-55"),
										children: [
											/* @__PURE__ */ jsx("span", {
												className: "size-10 shrink-0 rounded-md border border-border",
												style: { background: `#${c.color.toString(16).padStart(6, "0")}` }
											}),
											/* @__PURE__ */ jsxs("span", {
												className: "min-w-0 flex-1",
												children: [
													/* @__PURE__ */ jsx("span", {
														className: "block font-medium",
														children: langHe ? c.nameHe : c.nameEn
													}),
													/* @__PURE__ */ jsx("span", {
														className: "mt-0.5 block text-xs text-muted",
														children: c.tagline
													}),
													/* @__PURE__ */ jsxs("span", {
														className: "mt-2 flex gap-3",
														children: [
															/* @__PURE__ */ jsxs("span", {
																className: "block w-16",
																children: [/* @__PURE__ */ jsx("span", {
																	className: "block text-xs text-subtle",
																	children: langHe ? "מהירות" : "Speed"
																}), /* @__PURE__ */ jsx("span", {
																	className: "mt-0.5 block h-1 rounded-full bg-surface-2",
																	children: /* @__PURE__ */ jsx("span", {
																		className: "block h-full rounded-full bg-fg",
																		style: { width: `${Math.round(c.maxSpeed / 52 * 100)}%` }
																	})
																})]
															}),
															/* @__PURE__ */ jsxs("span", {
																className: "block w-16",
																children: [/* @__PURE__ */ jsx("span", {
																	className: "block text-xs text-subtle",
																	children: langHe ? "האצה" : "Accel"
																}), /* @__PURE__ */ jsx("span", {
																	className: "mt-0.5 block h-1 rounded-full bg-surface-2",
																	children: /* @__PURE__ */ jsx("span", {
																		className: "block h-full rounded-full bg-fg",
																		style: { width: `${Math.round(c.accel / 24 * 100)}%` }
																	})
																})]
															}),
															/* @__PURE__ */ jsxs("span", {
																className: "block w-16",
																children: [/* @__PURE__ */ jsx("span", {
																	className: "block text-xs text-subtle",
																	children: langHe ? "אחיזה" : "Grip"
																}), /* @__PURE__ */ jsx("span", {
																	className: "mt-0.5 block h-1 rounded-full bg-surface-2",
																	children: /* @__PURE__ */ jsx("span", {
																		className: "block h-full rounded-full bg-fg",
																		style: { width: `${Math.round(c.grip * 100)}%` }
																	})
																})]
															})
														]
													})
												]
											}),
											/* @__PURE__ */ jsx("span", {
												className: "text-xs tabular-nums text-muted",
												children: unlocked ? `${Math.round(c.maxSpeed * 3.6)} km/h` : t(`נעול · ${need}★`, `Locked · ${need}★`)
											})
										]
									}, c.id);
								})
							}),
							/* @__PURE__ */ jsx(Button, {
								className: "mt-6 min-h-12 w-full",
								disabled: !isCarUnlocked(carId),
								onClick: () => setScreen("race"),
								children: t(`זינוק · ${car.nameHe}`, `Start · ${car.nameEn}`)
							})
						]
					}) : null
				]
			})
		]
	});
}
function CareerPanel({ langHe, t, starTotal, onBack, onStart }: { langHe: boolean; t: CopyFn; starTotal: number; onBack: () => void; onStart: (id: string) => void }) {
	const earned = allEventStars();
	return /* @__PURE__ */ jsxs("div", {
		className: "mx-auto w-full max-w-3xl",
		children: [
			/* @__PURE__ */ jsx("button", {
				type: "button",
				className: "text-sm text-muted",
				onClick: onBack,
				children: t("חזרה", "Back")
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "mt-3 flex items-end justify-between gap-3",
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
					className: "text-3xl font-semibold tracking-tight",
					children: t("קריירה", "Career")
				}), /* @__PURE__ */ jsx("p", {
					className: "mt-1 text-sm text-muted",
					children: t("רישיון תל אביב, אחר כך הערים. תפוס את הרחוב.", "TLV license, then the cities. Take the street.")
				})] }), /* @__PURE__ */ jsxs("p", {
					className: "flex items-center gap-1.5 text-sm font-medium",
					children: [
						/* @__PURE__ */ jsx(Star, { className: "size-4 fill-accent text-accent" }),
						starTotal,
						"/",
						maxStars()
					]
				})]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "mt-6 space-y-8",
				children: chapters().map((ch) => {
					const open = starTotal >= (ch.events[0]?.unlockStars ?? 0);
					return /* @__PURE__ */ jsxs("section", { children: [/* @__PURE__ */ jsxs("p", {
						className: "text-xs font-medium uppercase tracking-widest text-muted",
						children: [langHe ? ch.he : ch.en, !open ? ` · ${t("נעול", "Locked")}` : ""]
					}), /* @__PURE__ */ jsx("div", {
						className: "mt-3 grid gap-2",
						children: ch.events.map((ev) => {
							const locked = starTotal < ev.unlockStars;
							const got = earned[ev.id] ?? 0;
							const info = MODE_INFO[ev.mode];
							const Icon = ev.mode === "heat" ? Shield : ev.mode === "time" ? Timer : ev.mode === "drift" ? Gauge : Trophy;
							return /* @__PURE__ */ jsxs("button", {
								type: "button",
								disabled: locked,
								onClick: () => onStart(ev.id),
								className: cn("flex items-center gap-3 rounded-lg border bg-surface p-4 text-start", locked ? "border-border opacity-50" : "border-border hover:border-fg"),
								children: [
									/* @__PURE__ */ jsx("span", {
										className: "grid size-10 shrink-0 place-items-center rounded-md border border-border bg-surface-2",
										children: /* @__PURE__ */ jsx(Icon, { className: "size-4" })
									}),
									/* @__PURE__ */ jsxs("span", {
										className: "min-w-0 flex-1",
										children: [
											/* @__PURE__ */ jsx("span", {
												className: "block font-medium",
												children: langHe ? ev.nameHe : ev.nameEn
											}),
											/* @__PURE__ */ jsxs("span", {
												className: "mt-0.5 block text-xs text-muted",
												children: [
													langHe ? info.he : info.en,
													ev.night ? ` · ${t("לילה", "Night")}` : ` · ${t("יום", "Day")}`,
													ev.weather && ev.weather !== "clear" ? ` · ${ev.weather === "storm" ? t("סערה", "Storm") : ev.weather === "hamsin" ? t("חמסין", "Hamsin") : t("גשם", "Rain")}` : "",
													locked ? ` · ${t(`${ev.unlockStars} כוכבים`, `${ev.unlockStars} stars`)}` : ""
												]
											}),
											ev.lineHe && !locked ? /* @__PURE__ */ jsx("span", {
												className: "mt-1 block text-[11px] text-fg/80",
												children: langHe ? ev.lineHe : ev.lineEn
											}) : null
										]
									}),
									/* @__PURE__ */ jsx("span", {
										className: "flex gap-0.5",
										children: [
											0,
											1,
											2
										].map((i) => /* @__PURE__ */ jsx(Star, { className: cn("size-4", i < got ? "fill-accent text-accent" : "text-subtle") }, i))
									})
								]
							}, ev.id);
						})
					})] }, ch.en);
				})
			})
		]
	});
}
function GaragePanel({ langHe, t, carId, setCarId, cash, setCash, onBack, onTuned }: { langHe: boolean; t: CopyFn; carId: CarId; setCarId: Dispatch<SetStateAction<CarId>>; cash: number; setCash: Dispatch<SetStateAction<number>>; onBack: () => void; onTuned: () => void }) {
	const car = CARS.find((c) => c.id === carId) ?? CARS[0]!;
	const tune = getTune(carId);
	const tuned = applyTune(car, tune);
	const buy = (kind: "engine" | "tires" | "nitro") => {
		const cost = nextCost(kind, tune[kind]);
		if (cost == null) return;
		if (!spendCash(cost)) return;
		setTune(carId, {
			...tune,
			[kind]: tune[kind] + 1
		});
		setCash(getCash());
		onTuned();
	};
	const buyPaint = (id: number) => {
		if (id === tune.paint) return;
		if (id !== 0 && !spendCash(450)) return;
		setTune(carId, {
			...tune,
			paint: id
		});
		setCash(getCash());
		onTuned();
	};
	const buyLivery = (id: number) => {
		if (id === (tune.livery ?? 0)) return;
		if (id !== 0 && !spendCash(700)) return;
		setTune(carId, {
			...tune,
			livery: id
		});
		setCash(getCash());
		onTuned();
	};
	const baseHex = `#${car.color.toString(16).padStart(6, "0")}`;
	return /* @__PURE__ */ jsxs("div", {
		className: "mx-auto w-full max-w-xl",
		children: [
			/* @__PURE__ */ jsx("button", {
				type: "button",
				className: "text-sm text-muted",
				onClick: onBack,
				children: t("חזרה", "Back")
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "mt-3 flex items-end justify-between gap-3",
				children: [/* @__PURE__ */ jsx("h2", {
					className: "text-3xl font-semibold tracking-tight",
					children: t("מוסך", "Garage")
				}), /* @__PURE__ */ jsxs("p", {
					className: "tabular-nums text-sm font-medium",
					children: ["₪", cash.toLocaleString()]
				})]
			}),
			/* @__PURE__ */ jsx("p", {
				className: "mt-1 text-sm text-muted",
				children: t("שדרג מנוע, צמיגים וניטרו. צבע ₪450. ליבריה ₪700.", "Upgrade engine, tires and nitro. Paint ₪450. Livery ₪700.")
			}),
			/* @__PURE__ */ jsx("div", {
				className: "mt-5 grid gap-2",
				children: CARS.map((c) => {
					const unlocked = isCarUnlocked(c.id);
					return /* @__PURE__ */ jsxs("button", {
						type: "button",
						disabled: !unlocked,
						onClick: () => unlocked && setCarId(c.id),
						className: cn("flex items-center gap-3 rounded-lg border bg-surface p-3 text-start", c.id === carId ? "border-fg" : "border-border", !unlocked && "opacity-50"),
						children: [
							/* @__PURE__ */ jsx("span", {
								className: "size-8 shrink-0 rounded-md border border-border",
								style: { background: `#${applyTune(c, getTune(c.id)).color.toString(16).padStart(6, "0")}` }
							}),
							/* @__PURE__ */ jsx("span", {
								className: "min-w-0 flex-1 font-medium",
								children: langHe ? c.nameHe : c.nameEn
							}),
							/* @__PURE__ */ jsx("span", {
								className: "text-xs tabular-nums text-muted",
								children: unlocked ? `${Math.round(applyTune(c, getTune(c.id)).maxSpeed * 3.6)} km/h` : t("נעול", "Locked")
							})
						]
					}, c.id);
				})
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "mt-6 space-y-3 rounded-lg border border-border bg-surface p-4",
				children: [
					/* @__PURE__ */ jsx("p", {
						className: "text-sm font-medium",
						children: langHe ? car.nameHe : car.nameEn
					}),
					([
						[
							"engine",
							t("מנוע", "Engine"),
							t("מהירות והאצה", "Speed and accel")
						],
						[
							"tires",
							t("צמיגים", "Tires"),
							t("אחיזה והגה", "Grip and turn")
						],
						[
							"nitro",
							t("ניטרו", "Nitro"),
							t("מיכל וצריכה", "Tank and drain")
						]
					] as const).map(([key, label, hint]) => {
						const lvl = tune[key];
						const cost = nextCost(key, lvl);
						return /* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "min-w-0 flex-1",
								children: [
									/* @__PURE__ */ jsx("p", {
										className: "text-sm font-medium",
										children: label
									}),
									/* @__PURE__ */ jsx("p", {
										className: "text-xs text-muted",
										children: hint
									}),
									/* @__PURE__ */ jsx("div", {
										className: "mt-1.5 flex gap-1",
										children: [
											0,
											1,
											2
										].map((i) => /* @__PURE__ */ jsx("span", { className: cn("h-1.5 flex-1 rounded-full", i < lvl ? "bg-accent" : "bg-surface-2") }, i))
									})
								]
							}), /* @__PURE__ */ jsx("button", {
								type: "button",
								disabled: cost == null || cash < cost,
								onClick: () => buy(key),
								className: "min-h-11 shrink-0 rounded-md border border-border px-3 text-xs font-medium disabled:opacity-40",
								children: cost == null ? t("מקס", "Max") : `₪${cost.toLocaleString()}`
							})]
						}, key);
					}),
					/* @__PURE__ */ jsxs("p", {
						className: "pt-2 text-xs text-muted",
						children: [
							t("אחרי שדרוג", "Tuned"),
							" · ",
							Math.round(tuned.maxSpeed * 3.6),
							" km/h · ",
							t("האצה", "accel"),
							" ",
							tuned.accel.toFixed(0)
						]
					}),
					/* @__PURE__ */ jsx("div", {
						className: "flex flex-wrap gap-2 pt-1",
						children: PAINTS.map((p) => /* @__PURE__ */ jsx("button", {
							type: "button",
							onClick: () => buyPaint(p.id),
							className: cn("size-11 rounded-md border", tune.paint === p.id ? "border-fg" : "border-border"),
							style: { background: p.id === 0 ? `#${car.color.toString(16).padStart(6, "0")}` : `#${p.color.toString(16).padStart(6, "0")}` },
							"aria-label": langHe ? p.he : p.en
						}, p.id))
					}),
					/* @__PURE__ */ jsx("p", {
						className: "pt-2 text-xs text-muted",
						children: t("ליבריה", "Livery")
					}),
					/* @__PURE__ */ jsx("div", {
						className: "flex flex-wrap gap-2",
						children: LIVERIES.map((lv) => /* @__PURE__ */ jsx("button", {
							type: "button",
							onClick: () => buyLivery(lv.id),
							className: cn("min-h-11 min-w-11 rounded-md border px-2 text-[10px] font-medium", (tune.livery ?? 0) === lv.id ? "border-fg" : "border-border"),
							style: {
								background: lv.id === 0 ? baseHex : lv.id === 1 ? `linear-gradient(90deg, ${baseHex} 38%, #f4f0ea 38%, #121418 48%, #f4f0ea 58%, ${baseHex} 58%)` : lv.id === 2 ? "linear-gradient(120deg, #c45c3a 40%, #2a8f8a 100%)" : lv.id === 3 ? "repeating-linear-gradient(90deg, #111 0 6px, #f0c400 6px 12px)" : lv.id === 4 ? "linear-gradient(0deg, #e24a12, #f2c44a)" : lv.id === 5 ? `linear-gradient(180deg, ${baseHex} 55%, #d4a017 55% 62%, ${baseHex} 62%)` : "linear-gradient(90deg, #121418 48%, #f2eee8 48% 52%, #c45c3a 52%)",
								color: lv.id === 0 || lv.id === 5 ? void 0 : "#f2eee8"
							},
							"aria-label": langHe ? lv.he : lv.en,
							children: langHe ? lv.he : lv.en
						}, lv.id))
					}),
					repairCost(carId) > 0 ? /* @__PURE__ */ jsxs("button", {
						type: "button",
						disabled: cash < repairCost(carId),
						onClick: () => {
							if (repairCar(carId)) {
								setCash(getCash());
								onTuned();
							}
						},
						className: "mt-3 min-h-11 w-full rounded-md border border-border text-sm font-medium disabled:opacity-40",
						children: [
							t("תיקון מרכב", "Repair body"),
							" · ₪",
							repairCost(carId).toLocaleString()
						]
					}) : /* @__PURE__ */ jsx("p", {
						className: "mt-3 text-xs text-muted",
						children: t("המרכב תקין", "Body is clean")
					})
				]
			})
		]
	});
}
//#endregion
//#region src/routes/index.tsx?tsr-split=component
