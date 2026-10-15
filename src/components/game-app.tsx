import { useEffect, useRef, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { CARS } from "@/game/cars";
import { getEvent } from "@/game/career";
import {
  getAssists,
  getCash,
  getFov,
  getGrid,
  getHandling,
  getLang,
  getMuted,
  getNight,
  getQuality,
  getTraffic,
  getVolume,
  isCarUnlocked,
  setAssistsSave,
  setFovSave,
  setGridSave,
  setHandlingSave,
  setLangSave,
  setMutedSave,
  setNightSave,
  setQualitySave,
  setTrafficSave,
  setVolumeSave,
  v1Stars,
} from "@/game/save";
import { copy, dirFor, nextLang, type Lang } from "@/game/i18n";
import type { RaceEngine } from "@/game/engine";
import type {
  AssistFlags,
  CarId,
  HandlingMode,
  Quality,
  RaceMode,
  TrackId,
  Weather,
} from "@/game/types";
import type { TrafficDensity } from "@/game/save";
import { RaceController } from "@/components/game-app/race-controller";
import { Menu, resolveTrack } from "@/components/game-app/screens";

export function GameApp() {
	const [hydrated, setHydrated] = useState(false);
	const [screen, setScreen] = useState("title");
	const [trackId, setTrackId] = useState<TrackId>("ayalon");
	const [carId, setCarId] = useState<CarId>("sabra");
	const [muted, setMuted] = useState(false);
	const [night, setNight] = useState(false);
	const [quality, setQuality] = useState<Quality>("high");
	const [fov, setFov] = useState(0);
	const [grid, setGrid] = useState(6);
	const [volume, setVolume] = useState(0.55);
	const [traffic, setTraffic] = useState<TrafficDensity>("normal");
	const [lang, setLang] = useState<Lang>("he");
	const langHe = lang === "he";
	const [handling, setHandling] = useState<HandlingMode>("arcade");
	const [assists, setAssists] = useState<AssistFlags>({ abs: true, tcs: true, esc: true });
	const [mode, setMode] = useState<RaceMode>("circuit");
	const [eventId, setEventId] = useState<string | null>(null);
	const [starTotal, setStarTotal] = useState(0);
	const [weather, setWeather] = useState<Weather>("clear");
	const [cash, setCash] = useState(500);
	const [tuneTick, setTuneTick] = useState(0);
	const engineRef = useRef<RaceEngine | null>(null);
	useEffect(() => {
		if (screen === "cars") setScreen("race");
	}, [screen]);
	useEffect(() => {
		setMuted(getMuted());
		setNight(getNight());
		setQuality(getQuality());
		setFov(getFov());
		setGrid(getGrid());
		setVolume(getVolume());
		setTraffic(getTraffic());
		setStarTotal(v1Stars());
		setCash(getCash());
		setHandling(getHandling());
		setAssists(getAssists());
		const savedLang = getLang();
		if (savedLang) setLang(savedLang);
		setHydrated(true);
	}, []);
	const t = (he: string, en: string, ar?: string) => copy(lang, he, en, ar);
	const track = resolveTrack(trackId);
	const car = CARS.find((x) => x.id === carId) ?? CARS[0]!;
	const cycleLang = () => {
		const next = nextLang(lang);
		setLang(next);
		setLangSave(next);
	};
	return /* @__PURE__ */ jsxs("div", {
		dir: dirFor(lang),
		inert: !hydrated,
		"data-game-ready": hydrated ? "true" : "false",
		className: "relative h-dvh w-full overflow-hidden bg-bg text-fg",
		children: [
			/* @__PURE__ */ jsx(RaceController, {
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
				grid,
				volume,
				setVolumeMode: (v: number) => {
					setVolume(v);
					setVolumeSave(v);
					engineRef.current?.setVolume(v);
				},
				traffic,
				mode,
				eventId,
				weather,
				tuneTick,
				handling,
				assists,
				setAssistsMode: (a: AssistFlags) => {
					setAssists(a);
					setAssistsSave(a);
				},
				muted,
				setMuted,
				setStarTotal,
				setCash,
				track,
				t,
				engineRef,
				onStartEvent: (id: string) => {
					const ev = getEvent(id);
					if (!ev) return;
					if (v1Stars() < ev.unlockStars) return;
					setEventId(ev.id);
					setTrackId(ev.trackId);
					setMode(ev.mode);
					setNight(ev.night);
					setNightSave(ev.night);
					setWeather(ev.weather ?? "clear");
					if (!isCarUnlocked(carId)) setCarId("sabra");
					setScreen("race");
				},
			}),
			screen !== "race" ? /* @__PURE__ */ jsx(Menu, {
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
				grid,
				setGridMode: (n: number) => {
					setGrid(n);
					setGridSave(n);
				},
				volume,
				setVolumeMode: (v: number) => {
					setVolume(v);
					setVolumeSave(v);
					engineRef.current?.setVolume(v);
				},
				traffic,
				setTrafficMode: (d: TrafficDensity) => {
					setTraffic(d);
					setTrafficSave(d);
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
					if (v1Stars() < ev.unlockStars) return;
					setEventId(ev.id);
					setTrackId(ev.trackId);
					setMode(ev.mode);
					setNight(ev.night);
					setNightSave(ev.night);
					setWeather(ev.weather ?? "clear");
					if (!isCarUnlocked(carId)) setCarId("sabra");
					setScreen("race");
				},
			}) : null,
		],
	});
}
