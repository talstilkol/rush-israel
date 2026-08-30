import { useState, type Dispatch, type ReactNode, type SetStateAction } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import {
  Flag,
  Gauge,
  Moon,
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
import { CARS } from "@/game/cars";
import { chapters, maxStars, CAR_UNLOCK } from "@/game/career";
import { applyTune, LIVERIES, nextCost, PAINTS } from "@/game/garage";
import { MODE_INFO } from "@/game/modes";
import {
  allBests,
  allEventStars,
  getCash,
  getTune,
  isCarUnlocked,
  repairCar,
  repairCost,
  setTune,
  spendCash,
} from "@/game/save";
import { CITY_FILTERS, TRACKS, isDriveable } from "@/game/tracks";
import { langShort, type Lang } from "@/game/i18n";
import { cn } from "@/lib/utils";
import type {
  AssistFlags,
  CarDef,
  CarId,
  HandlingMode,
  Quality,
  RaceMode,
  TrackDef,
  TrackId,
  Weather,
} from "@/game/types";

// RSH-018-BLOCK-BEGIN:themeWash
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
// RSH-018-BLOCK-END:themeWash
export function resolveTrack(trackId: TrackId): TrackDef {
	return TRACKS.find((track) => track.id === trackId) ?? TRACKS[0]!;
}

// RSH-018-BLOCK-BEGIN:Overlay
function Overlay({ children }: { children: ReactNode }) {
	return /* @__PURE__ */ jsx("div", {
		className: "absolute inset-0 z-40 flex items-center justify-center bg-bg/70 p-4",
		children: /* @__PURE__ */ jsx("div", {
			className: "w-full max-w-sm rounded-xl border border-border bg-surface p-6",
			children
		})
	});
}
// RSH-018-BLOCK-END:Overlay
// RSH-018-BLOCK-BEGIN:CopyFn
type CopyFn = (he: string, en: string, ar?: string) => string;
// RSH-018-BLOCK-END:CopyFn
// RSH-018-BLOCK-BEGIN:MenuProps
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
// RSH-018-BLOCK-END:MenuProps
// RSH-018-BLOCK-BEGIN:Menu
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
								children: t("מרוץ בישראל", "Race Israel", "سباق إسرائيل")
							}),
							/* @__PURE__ */ jsx("h1", {
								className: "mt-2 text-5xl font-semibold tracking-tight text-balance",
								children: "RUSH"
							}),
							/* @__PURE__ */ jsx("p", {
								className: "mt-4 max-w-md text-pretty text-sm leading-relaxed text-muted",
								children: t("בחר מסלול וסע. W גז, A/D הגה.", "Pick a track and drive. W gas, A/D steer.", "اختر مساراً وقد. W بنزين، A/D توجيه.")
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
								className: "mt-4 flex gap-2",
								children: CARS.map((c) => /* @__PURE__ */ jsx("button", {
									type: "button",
									className: cn("h-10 flex-1 rounded-md border", c.id === carId ? "border-fg" : "border-border"),
									style: { background: `#${c.color.toString(16).padStart(6, "0")}` },
									onClick: () => setCarId(c.id),
									"aria-label": c.id
								}, c.id))
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
// RSH-018-BLOCK-END:Menu
// RSH-018-BLOCK-BEGIN:CareerPanel
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
// RSH-018-BLOCK-END:CareerPanel
// RSH-018-BLOCK-BEGIN:GaragePanel
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
// RSH-018-BLOCK-END:GaragePanel

export { Menu, Overlay };
export type { CopyFn, MenuProps };
