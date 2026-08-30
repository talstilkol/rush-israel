import { i as __toESM } from "../_runtime.mjs";
import { L as require_react, v as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as Timer, c as Shield, d as Play, f as Pause, h as Flag, l as Settings, m as Gauge, n as Volume2, o as Sun, p as Moon, r as Trophy, s as Star, t as VolumeX, u as RotateCcw } from "../_libs/lucide-react.mjs";
import { a as formatTime, l as lerp, p as __exportAll, r as clamp$1, u as lerpColor } from "./router-BJmaoFfx.mjs";
import { t as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CvydnXtJ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
Object.freeze([
	"id",
	"nameHe",
	"nameEn",
	"city",
	"cityHe",
	"cityEn",
	"lengthHint",
	"description",
	"descriptionEn",
	"image",
	"width",
	"points",
	"elevation",
	"sky",
	"ground",
	"sand",
	"streets",
	"pois",
	"checkpointCount",
	"seed",
	"theme"
]);
Object.freeze([
	"water",
	"waters",
	"clearZones",
	"open"
]);
/**
* Preserve the exact inferred literal shape while requiring TrackDef compatibility.
* RSH-014 uses this at each module boundary.
*/
function defineTrack(track) {
	return track;
}
/** Preserve catalogue order while requiring every entry to satisfy TrackDef. */
function defineTracks(tracks) {
	return tracks;
}
var TLV_DUSK = {
	elevation: 6.5,
	azimuth: 248,
	turbidity: 6.4,
	rayleigh: 2.05,
	mieCoefficient: .0054,
	mieDirectionalG: .88,
	exposure: .84,
	fog: 7234652,
	fogDensity: .0042
};
var TLV_GOLDEN = {
	elevation: 16,
	azimuth: 240,
	turbidity: 7.2,
	rayleigh: 1.9,
	mieCoefficient: .006,
	mieDirectionalG: .82,
	exposure: .96,
	fog: 12888200,
	fogDensity: .0046
};
var TLV_BLUE = {
	elevation: 8.4,
	azimuth: 236,
	turbidity: 4.6,
	rayleigh: 1.7,
	mieCoefficient: .0044,
	mieDirectionalG: .86,
	exposure: .78,
	fog: 5923440,
	fogDensity: .0038
};
/** Tel Aviv geographic projection. Origin: 32.075N 34.770E. 1m real ≈ 0.45 game units. */
function tlv(lat, lon) {
	return {
		x: (lon - 34.77) * 94350 * .45,
		z: (lat - 32.075) * 111320 * .45
	};
}
/** Jerusalem. Origin: Jaffa Gate 31.778N 35.228E. */
function jer(lat, lon) {
	return {
		x: (lon - 35.228) * 94670 * .5,
		z: (lat - 31.778) * 111320 * .5
	};
}
/** Haifa. Origin: Baháʼí terrace 32.815N 34.990E. */
function hai(lat, lon) {
	return {
		x: (lon - 34.99) * 93500 * .45,
		z: (lat - 32.815) * 111320 * .45
	};
}
function eil(lat, lon) {
	return {
		x: (lon - 34.952) * 96800 * .5,
		z: (lat - 29.555) * 111320 * .5
	};
}
function dsea(lat, lon) {
	return {
		x: (lon - 35.365) * 95200 * .5,
		z: (lat - 31.19) * 111320 * .5
	};
}
function acr(lat, lon) {
	return {
		x: (lon - 35.07) * 93400 * .55,
		z: (lat - 32.922) * 111320 * .55
	};
}
function cae(lat, lon) {
	return {
		x: (lon - 34.892) * 93800 * .55,
		z: (lat - 32.501) * 111320 * .55
	};
}
function bsv(lat, lon) {
	return {
		x: (lon - 34.791) * 95200 * .5,
		z: (lat - 31.252) * 111320 * .5
	};
}
function mas(lat, lon) {
	return {
		x: (lon - 35.354) * 95200 * .5,
		z: (lat - 31.315) * 111320 * .5
	};
}
function net(lat, lon) {
	return {
		x: (lon - 34.855) * 93700 * .5,
		z: (lat - 32.332) * 111320 * .5
	};
}
function hzl(lat, lon) {
	return {
		x: (lon - 34.802) * 93800 * .5,
		z: (lat - 32.163) * 111320 * .5
	};
}
function tib(lat, lon) {
	return {
		x: (lon - 35.542) * 93200 * .5,
		z: (lat - 32.785) * 111320 * .5
	};
}
function hwy1(lat, lon) {
	return {
		x: (lon - 35.01) * 94600 * .18,
		z: (lat - 31.82) * 111320 * .18
	};
}
function nik(lat, lon) {
	return {
		x: (lon - 35.11) * 93200 * .5,
		z: (lat - 33.085) * 111320 * .5
	};
}
function tzf(lat, lon) {
	return {
		x: (lon - 35.495) * 93200 * .55,
		z: (lat - 32.965) * 111320 * .55
	};
}
function ram(lat, lon) {
	return {
		x: (lon - 34.802) * 96e3 * .5,
		z: (lat - 30.61) * 111320 * .5
	};
}
function naz(lat, lon) {
	return {
		x: (lon - 35.297) * 93300 * .55,
		z: (lat - 32.702) * 111320 * .55
	};
}
function gol(lat, lon) {
	return {
		x: (lon - 35.69) * 92800 * .22,
		z: (lat - 32.995) * 111320 * .22
	};
}
function hwy6(lat, lon) {
	return {
		x: (lon - 34.95) * 94e3 * .16,
		z: (lat - 32.12) * 111320 * .16
	};
}
function hwy2(lat, lon) {
	return {
		x: (lon - 34.88) * 93700 * .16,
		z: (lat - 32.42) * 111320 * .16
	};
}
function rsh(lat, lon) {
	return {
		x: (lon - 34.804) * 94300 * .5,
		z: (lat - 31.964) * 111320 * .5
	};
}
function pth(lat, lon) {
	return {
		x: (lon - 34.88) * 94100 * .5,
		z: (lat - 32.09) * 111320 * .5
	};
}
function asd(lat, lon) {
	return {
		x: (lon - 34.645) * 94800 * .5,
		z: (lat - 31.81) * 111320 * .5
	};
}
function ask(lat, lon) {
	return {
		x: (lon - 34.56) * 95e3 * .5,
		z: (lat - 31.67) * 111320 * .5
	};
}
function bym(lat, lon) {
	return {
		x: (lon - 34.745) * 94400 * .5,
		z: (lat - 32.015) * 111320 * .5
	};
}
function rhv(lat, lon) {
	return {
		x: (lon - 34.812) * 94400 * .5,
		z: (lat - 31.896) * 111320 * .5
	};
}
function nah(lat, lon) {
	return {
		x: (lon - 35.094) * 93300 * .5,
		z: (lat - 33.006) * 111320 * .5
	};
}
function hol(lat, lon) {
	return {
		x: (lon - 34.779) * 94300 * .5,
		z: (lat - 32.01) * 111320 * .5
	};
}
function hdr(lat, lon) {
	return {
		x: (lon - 34.89) * 93700 * .45,
		z: (lat - 32.44) * 111320 * .45
	};
}
function hwy90(lat, lon) {
	return {
		x: (lon - 35.25) * 96e3 * .2,
		z: (lat - 30.71) * 111320 * .2
	};
}
function raa(lat, lon) {
	return {
		x: (lon - 34.87) * 94e3 * .5,
		z: (lat - 32.184) * 111320 * .5
	};
}
function ksb(lat, lon) {
	return {
		x: (lon - 34.908) * 93900 * .5,
		z: (lat - 32.175) * 111320 * .5
	};
}
function rml(lat, lon) {
	return {
		x: (lon - 34.865) * 94400 * .5,
		z: (lat - 31.927) * 111320 * .5
	};
}
function lodp(lat, lon) {
	return {
		x: (lon - 34.885) * 94300 * .4,
		z: (lat - 31.975) * 111320 * .4
	};
}
function mod(lat, lon) {
	return {
		x: (lon - 35.005) * 94200 * .45,
		z: (lat - 31.896) * 111320 * .45
	};
}
function afl(lat, lon) {
	return {
		x: (lon - 35.29) * 93600 * .5,
		z: (lat - 32.61) * 111320 * .5
	};
}
function her(lat, lon) {
	return {
		x: (lon - 35.77) * 92800 * .4,
		z: (lat - 33.28) * 111320 * .4
	};
}
function hwy40(lat, lon) {
	return {
		x: (lon - 34.79) * 95600 * .28,
		z: (lat - 30.83) * 111320 * .28
	};
}
function bsn(lat, lon) {
	return {
		x: (lon - 35.5) * 93800 * .5,
		z: (lat - 32.5) * 111320 * .5
	};
}
function ksm(lat, lon) {
	return {
		x: (lon - 35.57) * 93e3 * .4,
		z: (lat - 33.21) * 111320 * .4
	};
}
function ard(lat, lon) {
	return {
		x: (lon - 35.22) * 95200 * .45,
		z: (lat - 31.258) * 111320 * .45
	};
}
var CITY_FILTERS = [
	{
		id: "all",
		he: "הכל",
		en: "All"
	},
	{
		id: "telaviv",
		he: "תל אביב",
		en: "Tel Aviv"
	},
	{
		id: "jerusalem",
		he: "ירושלים",
		en: "Jerusalem"
	},
	{
		id: "haifa",
		he: "חיפה",
		en: "Haifa"
	},
	{
		id: "eilat",
		he: "אילת",
		en: "Eilat"
	},
	{
		id: "caesarea",
		he: "קיסריה",
		en: "Caesarea"
	},
	{
		id: "deadsea",
		he: "ים המלח",
		en: "Dead Sea"
	},
	{
		id: "acre",
		he: "עכו",
		en: "Acre"
	},
	{
		id: "beersheva",
		he: "באר שבע",
		en: "Be'er Sheva"
	},
	{
		id: "netanya",
		he: "נתניה",
		en: "Netanya"
	},
	{
		id: "highway",
		he: "כבישים",
		en: "Highways"
	},
	{
		id: "herzliya",
		he: "הרצליה",
		en: "Herzliya"
	},
	{
		id: "galilee",
		he: "גליל",
		en: "Galilee"
	},
	{
		id: "kinneret",
		he: "כנרת",
		en: "Kinneret"
	},
	{
		id: "golan",
		he: "גולן",
		en: "Golan"
	},
	{
		id: "petah",
		he: "פתח תקווה",
		en: "Petah Tikva"
	},
	{
		id: "rishon",
		he: "ראשון לציון",
		en: "Rishon LeZion"
	},
	{
		id: "ashdod",
		he: "אשדוד",
		en: "Ashdod"
	},
	{
		id: "ashkelon",
		he: "אשקלון",
		en: "Ashkelon"
	},
	{
		id: "modiin",
		he: "מודיעין",
		en: "Modiin"
	},
	{
		id: "negev",
		he: "נגב",
		en: "Negev"
	},
	{
		id: "rehovot",
		he: "רחובות",
		en: "Rehovot"
	},
	{
		id: "ramla",
		he: "רמלה",
		en: "Ramla"
	},
	{
		id: "nyc",
		he: "ניו יורק",
		en: "New York"
	}
];
var TRACKS = defineTracks([
	defineTrack({
		id: "hayarkon",
		nameHe: "חוף תל אביב",
		nameEn: "Tel Aviv Beach",
		city: "telaviv",
		cityHe: "תל אביב",
		cityEn: "Tel Aviv",
		lengthHint: "3 הקפות · טיילת הים",
		description: "הטיילת מול הים — מלון הילטון, מגדל האופרה, חוף גורדון והמרינה. בהשראת המקום, לא מפה ולא GIS.",
		descriptionEn: "The promenade on the Mediterranean — Hilton, Opera Tower, Gordon Beach and the marina. Inspired by the place — not a map, not GIS.",
		image: "/tracks/hayarkon.jpg",
		width: 26,
		seed: 1812,
		theme: "bauhaus",
		ground: 9208436,
		sand: 13680794,
		sky: {
			...TLV_BLUE,
			fogDensity: 95e-5
		},
		water: {
			x: tlv(32.078, 34.754).x,
			z: tlv(32.078, 34.754).z,
			w: 520,
			d: 1900,
			color: 1739424
		},
		checkpointCount: 14,
		points: [
			tlv(32.077, 34.7675),
			tlv(32.079, 34.7682),
			tlv(32.081, 34.7688),
			tlv(32.083, 34.7694),
			tlv(32.085, 34.77),
			tlv(32.087, 34.7705),
			tlv(32.089, 34.771),
			tlv(32.091, 34.7716),
			tlv(32.093, 34.7723),
			tlv(32.095, 34.7731),
			tlv(32.0968, 34.774),
			tlv(32.0984, 34.7752),
			tlv(32.0996, 34.7768),
			tlv(32.0998, 34.7786),
			tlv(32.0988, 34.7802),
			tlv(32.097, 34.781),
			tlv(32.095, 34.7806),
			tlv(32.093, 34.7796),
			tlv(32.091, 34.7784),
			tlv(32.089, 34.7772),
			tlv(32.087, 34.776),
			tlv(32.085, 34.7748),
			tlv(32.083, 34.7736),
			tlv(32.081, 34.7724),
			tlv(32.079, 34.7712),
			tlv(32.077, 34.77),
			tlv(32.075, 34.7688),
			tlv(32.073, 34.7676),
			tlv(32.071, 34.7664),
			tlv(32.069, 34.7652),
			tlv(32.067, 34.764),
			tlv(32.065, 34.7628),
			tlv(32.063, 34.7616),
			tlv(32.061, 34.7606),
			tlv(32.0592, 34.7594),
			tlv(32.0582, 34.7578),
			tlv(32.0586, 34.7562),
			tlv(32.0602, 34.7554),
			tlv(32.062, 34.7558),
			tlv(32.0634, 34.757),
			tlv(32.0646, 34.7584),
			tlv(32.0662, 34.7598),
			tlv(32.0682, 34.7612),
			tlv(32.0702, 34.7624),
			tlv(32.0722, 34.7636),
			tlv(32.0742, 34.7648),
			tlv(32.0762, 34.7662)
		],
		elevation: () => .2,
		streets: [
			{
				from: 0,
				to: .22,
				he: "טיילת הרברט סמואל",
				en: "Herbert Samuel"
			},
			{
				from: .22,
				to: .4,
				he: "מלון הילטון",
				en: "Hilton"
			},
			{
				from: .4,
				to: .55,
				he: "מרינה תל אביב",
				en: "Tel Aviv Marina"
			},
			{
				from: .55,
				to: .82,
				he: "הירקון",
				en: "Hayarkon St"
			},
			{
				from: .82,
				to: 1,
				he: "פארק צ'ארלס קלור",
				en: "Charles Clore"
			}
		],
		pois: [
			{
				...tlv(32.0893, 34.7732),
				r: 42,
				he: "מלון הילטון",
				en: "Hilton Tel Aviv"
			},
			{
				...tlv(32.0938, 34.7708),
				r: 36,
				he: "מרינה תל אביב",
				en: "Tel Aviv Marina"
			},
			{
				...tlv(32.0848, 34.768),
				r: 32,
				he: "בריכת גורדון",
				en: "Gordon Pool"
			},
			{
				...tlv(32.0768, 34.769),
				r: 36,
				he: "מגדל האופרה",
				en: "Opera Tower"
			},
			{
				...tlv(32.0865, 34.7728),
				r: 30,
				he: "קרלטון",
				en: "Carlton"
			},
			{
				...tlv(32.0814, 34.7704),
				r: 28,
				he: "דן תל אביב",
				en: "Dan Tel Aviv"
			},
			{
				...tlv(32.0648, 34.7618),
				r: 34,
				he: "דולפינריום",
				en: "Dolphinarium"
			},
			{
				...tlv(32.1044, 34.7776),
				r: 40,
				he: "רידינג",
				en: "Reading Power Station"
			}
		]
	}),
	defineTrack({
		id: "oldjaffa",
		nameHe: "דרום תל אביב · נמל יפו",
		nameEn: "South TLV · Jaffa Port",
		city: "telaviv",
		cityHe: "תל אביב",
		cityEn: "Tel Aviv",
		lengthHint: "3 הקפות · נמל עתיק",
		description: "נמל יפו, מגדל השעון, נווה צדק ופלורנטין — סמטאות אבן מול הים. בהשראת המקום, לא מפה ולא GIS.",
		descriptionEn: "Jaffa Port, the Clock Tower, Neve Tzedek and Florentin — stone alleys by the sea. Inspired by the place — not a map, not GIS.",
		image: "/tracks/oldjaffa.jpg",
		width: 24,
		seed: 1917,
		theme: "jaffa",
		ground: 12888194,
		sand: 14205082,
		sky: {
			...TLV_BLUE,
			fogDensity: 85e-5
		},
		water: {
			x: tlv(32.0524, 34.7488).x,
			z: tlv(32.0524, 34.7488).z,
			w: 220,
			d: 380,
			color: 1731192
		},
		checkpointCount: 10,
		points: [
			tlv(32.0549, 34.7556),
			tlv(32.0544, 34.7546),
			tlv(32.0538, 34.7536),
			tlv(32.0532, 34.7526),
			tlv(32.0526, 34.7516),
			tlv(32.052, 34.7508),
			tlv(32.0514, 34.7504),
			tlv(32.0508, 34.751),
			tlv(32.0506, 34.752),
			tlv(32.051, 34.7532),
			tlv(32.0518, 34.7544),
			tlv(32.0526, 34.7556),
			tlv(32.0534, 34.7568),
			tlv(32.0542, 34.758),
			tlv(32.055, 34.7588),
			tlv(32.0556, 34.7578),
			tlv(32.0556, 34.7566)
		],
		elevation: (t) => t > .12 && t < .45 ? 3.6 : .6,
		streets: [
			{
				from: 0,
				to: .16,
				he: "מגדל השעון",
				en: "Clock Tower"
			},
			{
				from: .16,
				to: .32,
				he: "יפת",
				en: "Yefet St"
			},
			{
				from: .32,
				to: .5,
				he: "נמל יפו",
				en: "Jaffa Port"
			},
			{
				from: .5,
				to: .66,
				he: "כיכר קדומים",
				en: "Kedumim Square"
			},
			{
				from: .66,
				to: .82,
				he: "שוק הפשפשים",
				en: "Flea Market"
			},
			{
				from: .82,
				to: 1,
				he: "ירושלים",
				en: "Jerusalem Blvd"
			}
		],
		pois: [
			{
				...tlv(32.0548, 34.7554),
				r: 28,
				he: "מגדל השעון",
				en: "Jaffa Clock Tower"
			},
			{
				...tlv(32.0526, 34.751),
				r: 36,
				he: "נמל יפו",
				en: "Jaffa Port"
			},
			{
				...tlv(32.0533, 34.751),
				r: 20,
				he: "מגדלור יפו",
				en: "Jaffa Lighthouse"
			},
			{
				...tlv(32.0544, 34.7512),
				r: 30,
				he: "כנסיית פטרוס",
				en: "St. Peter's Church"
			},
			{
				...tlv(32.0549, 34.7559),
				r: 24,
				he: "מסגד מחמודיה",
				en: "Mahmoudiya Mosque"
			},
			{
				...tlv(32.0535, 34.7582),
				r: 26,
				he: "שוק הפשפשים",
				en: "Flea Market"
			},
			{
				...tlv(32.0542, 34.752),
				r: 24,
				he: "כיכר קדומים",
				en: "Kedumim Square"
			}
		]
	}),
	defineTrack({
		id: "telaviv",
		nameHe: "מרכז תל אביב · עזריאלי",
		nameEn: "Center · Azrieli",
		city: "telaviv",
		cityHe: "תל אביב",
		cityEn: "Tel Aviv",
		lengthHint: "3 הקפות · מגדלים",
		description: "עזריאלי, משה אביב, ToHa, שרונה, דיזנגוף והבימה — קו הרקיע. בהשראת המקום, לא מפה ולא GIS.",
		descriptionEn: "Azrieli, Moshe Aviv, ToHa, Sarona, Dizengoff and Habima — the skyline. Inspired by the place — not a map, not GIS.",
		image: "/tracks/telaviv.jpg",
		width: 26,
		seed: 1701,
		theme: "highway",
		ground: 8025196,
		sand: 11577496,
		sky: {
			...TLV_BLUE,
			fogDensity: 8e-4
		},
		checkpointCount: 10,
		points: [
			tlv(32.0698, 34.7906),
			tlv(32.0718, 34.7908),
			tlv(32.0744, 34.791),
			tlv(32.0768, 34.791),
			tlv(32.079, 34.7902),
			tlv(32.0794, 34.7882),
			tlv(32.0784, 34.7862),
			tlv(32.076, 34.7852),
			tlv(32.0734, 34.7852),
			tlv(32.071, 34.786),
			tlv(32.0696, 34.7878),
			tlv(32.0694, 34.7894)
		],
		elevation: () => .6,
		streets: [
			{
				from: 0,
				to: .2,
				he: "וולפסון",
				en: "Wolfson"
			},
			{
				from: .2,
				to: .42,
				he: "דרך בגין",
				en: "Begin Rd"
			},
			{
				from: .42,
				to: .58,
				he: "עזריאלי",
				en: "Azrieli"
			},
			{
				from: .58,
				to: .76,
				he: "קפלן",
				en: "Kaplan"
			},
			{
				from: .76,
				to: 1,
				he: "שרונה",
				en: "Sarona"
			}
		],
		pois: [
			{
				...tlv(32.0744, 34.7922),
				r: 52,
				he: "מגדלי עזריאלי",
				en: "Azrieli Center"
			},
			{
				...tlv(32.0835, 34.803),
				r: 28,
				he: "משה אביב",
				en: "Moshe Aviv"
			},
			{
				...tlv(32.071, 34.7875),
				r: 30,
				he: "שרונה",
				en: "Sarona"
			},
			{
				...tlv(32.073, 34.781),
				r: 28,
				he: "הבימה",
				en: "Habima Theatre"
			},
			{
				...tlv(32.0752, 34.7865),
				r: 24,
				he: "הקריה",
				en: "Hakirya"
			},
			{
				...tlv(32.0753, 34.7748),
				r: 28,
				he: "דיזנגוף סנטר",
				en: "Dizengoff Center"
			},
			{
				...tlv(32.0639, 34.7704),
				r: 26,
				he: "מגדל שלום",
				en: "Shalom Meir Tower"
			}
		]
	}),
	defineTrack({
		id: "namal",
		nameHe: "צפון תל אביב",
		nameEn: "North Tel Aviv",
		city: "telaviv",
		cityHe: "תל אביב",
		cityEn: "Tel Aviv",
		lengthHint: "3 הקפות · רדינג והנמל",
		description: "נמל תל אביב, תחנת הכוח רדינג, פארק הירקון ושדרות רוקח. בהשראת המקום, לא מפה ולא GIS.",
		descriptionEn: "Tel Aviv Port, Reading Power Station, Yarkon Park and Rokach Boulevard. Inspired by the place — not a map, not GIS.",
		image: "/tracks/namal.jpg",
		width: 28,
		seed: 2002,
		theme: "port",
		ground: 9077880,
		sand: 14865072,
		sky: {
			...TLV_BLUE,
			fogDensity: 7e-4
		},
		water: {
			x: tlv(32.101, 34.766).x,
			z: tlv(32.101, 34.766).z,
			w: 420,
			d: 780,
			color: 1735314
		},
		waters: [{
			x: tlv(32.101, 34.766).x,
			z: tlv(32.101, 34.766).z,
			w: 420,
			d: 780,
			color: 1735314
		}, {
			x: tlv(32.1042, 34.786).x,
			z: tlv(32.1042, 34.786).z,
			w: 70,
			d: 240,
			color: 2780770
		}],
		clearZones: [{
			x: tlv(32.1035, 34.7788).x,
			z: tlv(32.1035, 34.7788).z,
			w: 90,
			d: 80
		}, {
			x: tlv(32.0968, 34.7735).x,
			z: tlv(32.0968, 34.7735).z,
			w: 80,
			d: 100
		}],
		checkpointCount: 10,
		points: [
			tlv(32.095, 34.7732),
			tlv(32.0966, 34.7744),
			tlv(32.0982, 34.7756),
			tlv(32.0998, 34.7768),
			tlv(32.1014, 34.7778),
			tlv(32.103, 34.7786),
			tlv(32.1044, 34.78),
			tlv(32.1052, 34.782),
			tlv(32.105, 34.7844),
			tlv(32.1036, 34.7864),
			tlv(32.1016, 34.7874),
			tlv(32.0994, 34.787),
			tlv(32.0974, 34.7854),
			tlv(32.096, 34.783),
			tlv(32.0952, 34.7802),
			tlv(32.0948, 34.7772),
			tlv(32.0948, 34.7748)
		],
		elevation: () => .4,
		streets: [
			{
				from: 0,
				to: .22,
				he: "נמל תל אביב",
				en: "Tel Aviv Port"
			},
			{
				from: .22,
				to: .42,
				he: "רדינג",
				en: "Reading Power"
			},
			{
				from: .42,
				to: .62,
				he: "פארק הירקון",
				en: "Yarkon Park"
			},
			{
				from: .62,
				to: .8,
				he: "שדרות רוקח",
				en: "Rokach Blvd"
			},
			{
				from: .8,
				to: 1,
				he: "נמיר",
				en: "Namir Rd"
			}
		],
		pois: [
			{
				...tlv(32.0968, 34.7735),
				r: 36,
				he: "נמל תל אביב",
				en: "Tel Aviv Port"
			},
			{
				...tlv(32.1035, 34.7788),
				r: 44,
				he: "תחנת הכוח רדינג",
				en: "Reading Power Station"
			},
			{
				...tlv(32.101, 34.786),
				r: 40,
				he: "פארק הירקון",
				en: "Yarkon Park"
			},
			{
				...tlv(32.104, 34.79),
				r: 32,
				he: "גני התערוכה",
				en: "Expo Tel Aviv"
			}
		]
	}),
	defineTrack({
		id: "jerusalem",
		nameHe: "ירושלים · שער יפו",
		nameEn: "Jerusalem · Jaffa Gate",
		city: "jerusalem",
		cityHe: "ירושלים",
		cityEn: "Jerusalem",
		lengthHint: "נסיעה אחת · יפו עד הזיתים",
		description: "מחנה יהודה, רחוב יפו, שער יפו, גיא בן הינום ועלייה להר הזיתים. בהשראת המקום, לא מפה ולא GIS.",
		descriptionEn: "Mahane Yehuda, Jaffa Road, Jaffa Gate, Hinnom Valley and the climb to the Mount of Olives. Inspired by the place — not a map, not GIS.",
		image: "/tracks/jerusalem.jpg",
		width: 30,
		seed: 3141,
		theme: "stone",
		open: true,
		ground: 12167305,
		sand: 13351060,
		sky: {
			elevation: 28,
			azimuth: 232,
			turbidity: 4.4,
			rayleigh: 1.5,
			mieCoefficient: .0034,
			mieDirectionalG: .76,
			exposure: .8,
			fog: 13943972,
			fogDensity: 32e-5
		},
		checkpointCount: 8,
		points: [
			jer(31.7852, 35.2126),
			jer(31.7836, 35.2152),
			jer(31.782, 35.2178),
			jer(31.7804, 35.2204),
			jer(31.7788, 35.2228),
			jer(31.7772, 35.2248),
			jer(31.7756, 35.2264),
			jer(31.7744, 35.2282),
			jer(31.7736, 35.2304),
			jer(31.7742, 35.2328),
			jer(31.7756, 35.2354),
			jer(31.7774, 35.238),
			jer(31.7794, 35.2404),
			jer(31.7814, 35.2426),
			jer(31.7834, 35.2446)
		],
		elevation: (t) => {
			if (t < .42) return 36 - t * 82;
			return 1.4 + Math.pow((t - .42) / .58, 1.1) * 88;
		},
		streets: [
			{
				from: 0,
				to: .18,
				he: "מחנה יהודה",
				en: "Mahane Yehuda"
			},
			{
				from: .18,
				to: .38,
				he: "רחוב יפו",
				en: "Jaffa Street"
			},
			{
				from: .38,
				to: .52,
				he: "שער יפו",
				en: "Jaffa Gate"
			},
			{
				from: .52,
				to: .7,
				he: "גיא בן הינום",
				en: "Hinnom Valley"
			},
			{
				from: .7,
				to: 1,
				he: "הר הזיתים",
				en: "Mount of Olives"
			}
		],
		pois: [
			{
				...jer(31.7848, 35.2128),
				r: 28,
				he: "מחנה יהודה",
				en: "Mahane Yehuda"
			},
			{
				...jer(31.7764, 35.2276),
				r: 36,
				he: "שער יפו",
				en: "Jaffa Gate"
			},
			{
				...jer(31.7762, 35.2284),
				r: 32,
				he: "מגדל דוד",
				en: "Tower of David"
			},
			{
				...jer(31.7766, 35.2054),
				r: 36,
				he: "הכנסת",
				en: "Knesset"
			},
			{
				...jer(31.7774, 35.2072),
				r: 20,
				he: "המנורה",
				en: "The Menorah"
			},
			{
				...jer(31.7715, 35.2247),
				r: 22,
				he: "טחנת הרוח",
				en: "Montefiore Mill"
			},
			{
				...jer(31.7767, 35.2342),
				r: 32,
				he: "הכותל",
				en: "Western Wall"
			},
			{
				...jer(31.778, 35.2354),
				r: 36,
				he: "כיפת הסלע",
				en: "Dome of the Rock"
			},
			{
				...jer(31.7761, 35.2358),
				r: 28,
				he: "אל-אקצא",
				en: "Al-Aqsa"
			},
			{
				...jer(31.7784, 35.2296),
				r: 26,
				he: "הקבר הקדוש",
				en: "Holy Sepulchre"
			},
			{
				...jer(31.7753, 35.222),
				r: 24,
				he: "YMCA",
				en: "YMCA"
			},
			{
				...jer(31.7834, 35.2446),
				r: 32,
				he: "הר הזיתים",
				en: "Mount of Olives"
			}
		]
	}),
	defineTrack({
		id: "haifa",
		nameHe: "ירידת הכרמל",
		nameEn: "Carmel Descent",
		city: "haifa",
		cityHe: "חיפה",
		cityEn: "Haifa",
		lengthHint: "נסיעה אחת · ירידה לנמל",
		description: "יפה נוף מהכרמל עד הנמל — ירידה אחת. בהשראת, לא סקר גבהים.",
		descriptionEn: "Yefe Nof down the Carmel to the port — one descent. Inspired by, not a survey.",
		image: "/tracks/haifa.jpg",
		width: 26,
		seed: 2718,
		theme: "carmel",
		open: true,
		ground: 4876860,
		sand: 12034170,
		sky: {
			elevation: 48,
			azimuth: 196,
			turbidity: 3.2,
			rayleigh: 1.15,
			mieCoefficient: .003,
			mieDirectionalG: .72,
			exposure: .78,
			fog: 11059916,
			fogDensity: 32e-5
		},
		water: {
			x: hai(32.83, 35.01).x,
			z: hai(32.83, 35.01).z,
			w: 520,
			d: 280,
			color: 1731200
		},
		checkpointCount: 8,
		points: [
			hai(32.8118, 34.9863),
			hai(32.8136, 34.9856),
			hai(32.8154, 34.9852),
			hai(32.8172, 34.9858),
			hai(32.8186, 34.9874),
			hai(32.8194, 34.9898),
			hai(32.8196, 34.9926),
			hai(32.8194, 34.9956),
			hai(32.819, 34.9988),
			hai(32.8188, 35.0018),
			hai(32.8172, 35.0036)
		],
		elevation: (t) => 2 + 118 * Math.pow(1 - t, 1.06),
		streets: [
			{
				from: 0,
				to: .2,
				he: "הגנים הבהאיים",
				en: "Baháʼí Gardens"
			},
			{
				from: .2,
				to: .4,
				he: "יפה נוף",
				en: "Yefe Nof"
			},
			{
				from: .4,
				to: .58,
				he: "המושבה הגרמנית",
				en: "German Colony"
			},
			{
				from: .58,
				to: .78,
				he: "העצמאות",
				en: "HaAtzmaut"
			},
			{
				from: .78,
				to: 1,
				he: "הנמל",
				en: "Haifa Port"
			}
		],
		pois: [
			{
				...hai(32.8118, 34.9863),
				r: 36,
				he: "הגנים הבהאיים",
				en: "Baháʼí Gardens"
			},
			{
				...hai(32.819, 35.004),
				r: 36,
				he: "נמל חיפה",
				en: "Haifa Port"
			},
			{
				...hai(32.8195, 34.989),
				r: 28,
				he: "המושבה הגרמנית",
				en: "German Colony"
			}
		]
	}),
	defineTrack({
		id: "eilat",
		nameHe: "חוף אילת",
		nameEn: "Eilat Coast",
		city: "eilat",
		cityHe: "אילת",
		cityEn: "Eilat",
		lengthHint: "3 הקפות · ים סוף",
		description: "כביש חוף מהיר, שיער סיכה במרינה, והרי אדום ברקע. בהשראת המקום, לא מפה ולא GIS.",
		descriptionEn: "Fast coastal road, a marina hairpin, and the Red Mountains behind you. Inspired by the place — not a map, not GIS.",
		image: "/tracks/eilat.jpg",
		width: 20,
		seed: 9091,
		theme: "desert",
		ground: 12886132,
		sand: 14397562,
		sky: {
			elevation: 54,
			azimuth: 208,
			turbidity: 8.5,
			rayleigh: 1.4,
			mieCoefficient: .007,
			mieDirectionalG: .7,
			exposure: .82,
			fog: 14862752,
			fogDensity: .0015
		},
		water: {
			x: eil(29.555, 34.942).x,
			z: eil(29.555, 34.942).z,
			w: 280,
			d: 520,
			color: 1278092
		},
		checkpointCount: 10,
		points: [
			eil(29.5585, 34.96),
			eil(29.5568, 34.9582),
			eil(29.5548, 34.9564),
			eil(29.5526, 34.9548),
			eil(29.5504, 34.9536),
			eil(29.5482, 34.9542),
			eil(29.5472, 34.9564),
			eil(29.5478, 34.9588),
			eil(29.5496, 34.9604),
			eil(29.5518, 34.9614),
			eil(29.5542, 34.962),
			eil(29.5566, 34.9622),
			eil(29.5584, 34.9614)
		],
		elevation: () => .4,
		streets: [
			{
				from: 0,
				to: .28,
				he: "החוף הצפוני",
				en: "North Beach"
			},
			{
				from: .28,
				to: .5,
				he: "המרינה",
				en: "The Marina"
			},
			{
				from: .5,
				to: .75,
				he: "שדרות התמרים",
				en: "Hatamarim Blvd"
			},
			{
				from: .75,
				to: 1,
				he: "הערבה",
				en: "Arava Road"
			}
		],
		pois: [
			{
				...eil(29.5488, 34.9518),
				r: 32,
				he: "המרינה",
				en: "Eilat Marina"
			},
			{
				...eil(29.5588, 34.9576),
				r: 28,
				he: "קינג סולומון",
				en: "King Solomon"
			},
			{
				...eil(29.5562, 34.957),
				r: 24,
				he: "דן אילת",
				en: "Dan Eilat"
			}
		]
	}),
	defineTrack({
		id: "rothschild",
		nameHe: "שדרות רוטשילד",
		nameEn: "Rothschild Boulevard",
		city: "telaviv",
		cityHe: "תל אביב",
		cityEn: "Tel Aviv",
		lengthHint: "3 הקפות · העיר הלבנה",
		description: "השדרה ההיסטורית — בית הבימה, היכל העצמאות, אלנבי ושינקין. בהשראת המקום, לא מפה ולא GIS.",
		descriptionEn: "The historic boulevard — Habima, Independence Hall, Allenby and Sheinkin. Inspired by the place — not a map, not GIS.",
		image: "/tracks/rothschild.jpg",
		width: 32,
		seed: 1909,
		theme: "bauhaus",
		ground: 9076852,
		sand: 13154456,
		sky: {
			...TLV_BLUE,
			fogDensity: 9e-4
		},
		checkpointCount: 10,
		points: [
			tlv(32.0632, 34.7712),
			tlv(32.0648, 34.773),
			tlv(32.0666, 34.7748),
			tlv(32.0684, 34.7766),
			tlv(32.0702, 34.7784),
			tlv(32.072, 34.78),
			tlv(32.0736, 34.7812),
			tlv(32.0748, 34.7796),
			tlv(32.0744, 34.777),
			tlv(32.0726, 34.7748),
			tlv(32.0704, 34.7728),
			tlv(32.0682, 34.771),
			tlv(32.0658, 34.7694),
			tlv(32.0638, 34.7688),
			tlv(32.0626, 34.7698),
			tlv(32.0624, 34.771)
		],
		elevation: () => .4,
		streets: [
			{
				from: 0,
				to: .22,
				he: "שדרות רוטשילד",
				en: "Rothschild Blvd"
			},
			{
				from: .22,
				to: .4,
				he: "כיכר הבימה",
				en: "Habima Square"
			},
			{
				from: .4,
				to: .62,
				he: "המלך ג'ורג'",
				en: "King George"
			},
			{
				from: .62,
				to: .82,
				he: "אלנבי",
				en: "Allenby"
			},
			{
				from: .82,
				to: 1,
				he: "היכל העצמאות",
				en: "Independence Hall"
			}
		],
		pois: [
			{
				...tlv(32.0732, 34.7805),
				r: 28,
				he: "תיאטרון הבימה",
				en: "Habima Theatre"
			},
			{
				...tlv(32.0658, 34.7758),
				r: 24,
				he: "מגדל המאה",
				en: "Century Tower"
			},
			{
				...tlv(32.0629, 34.7695),
				r: 26,
				he: "היכל העצמאות",
				en: "Independence Hall"
			},
			{
				...tlv(32.07, 34.7768),
				r: 22,
				he: "שינקין",
				en: "Sheinkin"
			}
		]
	}),
	defineTrack({
		id: "ayalon",
		nameHe: "נתיבי איילון",
		nameEn: "Ayalon Highway",
		city: "telaviv",
		cityHe: "תל אביב",
		cityEn: "Tel Aviv",
		lengthHint: "נסיעה אחת · דרום לצפון",
		description: "קיבוץ גלויות עד האוניברסיטה, נגד אחד. לא מפה GIS — בהשראת כביש 20.",
		descriptionEn: "Kibbutz Galuyot to the university, one carriageway. Not GIS — inspired by Highway 20.",
		image: "/tracks/ayalon.jpg",
		width: 28,
		seed: 2020,
		theme: "highway",
		open: true,
		ground: 6975090,
		sand: 11577496,
		sky: {
			...TLV_BLUE,
			fogDensity: 9e-4
		},
		checkpointCount: 8,
		points: (() => {
			const west = 34.795;
			const pts = [];
			for (let lat = 32.052; lat <= 32.106; lat += .002) pts.push(tlv(Number(lat.toFixed(4)), west));
			return pts;
		})(),
		elevation: (t) => .5 + 1.7 * Math.sin(t * Math.PI) + .85 * Math.sin(t * Math.PI * 5),
		streets: [
			{
				from: 0,
				to: .12,
				he: "קיבוץ גלויות",
				en: "Kibbutz Galuyot"
			},
			{
				from: .12,
				to: .22,
				he: "ההגנה",
				en: "HaHagana"
			},
			{
				from: .22,
				to: .32,
				he: "לה גרדיה",
				en: "LaGuardia"
			},
			{
				from: .32,
				to: .48,
				he: "השלום",
				en: "HaShalom"
			},
			{
				from: .48,
				to: .62,
				he: "סבידור מרכז",
				en: "Savidor Center"
			},
			{
				from: .62,
				to: 1,
				he: "אוניברסיטת תל אביב",
				en: "Tel Aviv University"
			}
		],
		pois: [
			{
				...tlv(32.0547, 34.7848),
				r: 36,
				he: "תחנת ההגנה",
				en: "HaHagana Station"
			},
			{
				...tlv(32.0735, 34.793),
				r: 40,
				he: "תחנת השלום",
				en: "HaShalom Station"
			},
			{
				...tlv(32.0837, 34.7975),
				r: 40,
				he: "סבידור מרכז",
				en: "Savidor Center"
			},
			{
				...tlv(32.1035, 34.8042),
				r: 36,
				he: "תחנת האוניברסיטה",
				en: "University Station"
			},
			{
				...tlv(32.0744, 34.7922),
				r: 48,
				he: "עזריאלי",
				en: "Azrieli"
			},
			{
				...tlv(32.0695, 34.7894),
				r: 36,
				he: "מגדל תוהה",
				en: "ToHa Tower"
			},
			{
				...tlv(32.0699, 34.7918),
				r: 36,
				he: "מגדל אלקטרה",
				en: "Electra Tower"
			},
			{
				...tlv(32.0832, 34.8027),
				r: 44,
				he: "מגדל משה אביב",
				en: "Moshe Aviv Tower"
			},
			{
				...tlv(32.0806, 34.7926),
				r: 36,
				he: "מידטאון",
				en: "Midtown TLV"
			}
		]
	}),
	defineTrack({
		id: "caesarea",
		nameHe: "קיסריה",
		nameEn: "Caesarea",
		city: "caesarea",
		cityHe: "קיסריה",
		cityEn: "Caesarea",
		lengthHint: "3 הקפות · אמת המים",
		description: "אמת המים הרומית, ההיפודרום, הנמל הצלבני וחוף הארכיאולוגיה. בהשראת המקום, לא מפה ולא GIS.",
		descriptionEn: "The Roman aqueduct, hippodrome, Crusader harbor and the archaeology beach. Inspired by the place — not a map, not GIS.",
		image: "/tracks/caesarea.jpg",
		width: 20,
		seed: 22,
		theme: "stone",
		ground: 12890256,
		sand: 14865072,
		sky: {
			elevation: 22,
			azimuth: 250,
			turbidity: 5.4,
			rayleigh: 1.7,
			mieCoefficient: .0048,
			mieDirectionalG: .82,
			exposure: .76,
			fog: 13945008,
			fogDensity: .0014
		},
		water: {
			x: cae(32.501, 34.885).x,
			z: cae(32.501, 34.885).z,
			w: 280,
			d: 420,
			color: 1732744
		},
		checkpointCount: 10,
		points: [
			cae(32.5075, 34.8995),
			cae(32.5056, 34.8974),
			cae(32.5036, 34.8952),
			cae(32.5016, 34.8932),
			cae(32.4995, 34.8915),
			cae(32.4974, 34.891),
			cae(32.4968, 34.8932),
			cae(32.4982, 34.8954),
			cae(32.5004, 34.8972),
			cae(32.5028, 34.8988),
			cae(32.5052, 34.9002),
			cae(32.507, 34.9012)
		],
		elevation: () => .5,
		streets: [
			{
				from: 0,
				to: .22,
				he: "אמת המים",
				en: "The Aqueduct"
			},
			{
				from: .22,
				to: .42,
				he: "ההיפודרום",
				en: "The Hippodrome"
			},
			{
				from: .42,
				to: .62,
				he: "הנמל הצלבני",
				en: "Crusader Harbor"
			},
			{
				from: .62,
				to: .82,
				he: "התיאטרון",
				en: "The Theatre"
			},
			{
				from: .82,
				to: 1,
				he: "חוף הקשתות",
				en: "Arches Beach"
			}
		],
		pois: [
			{
				...cae(32.5075, 34.8998),
				r: 40,
				he: "אמת המים",
				en: "Roman Aqueduct"
			},
			{
				...cae(32.4995, 34.8915),
				r: 32,
				he: "ההיפודרום",
				en: "Hippodrome"
			},
			{
				...cae(32.501, 34.891),
				r: 30,
				he: "הנמל",
				en: "The Harbor"
			},
			{
				...cae(32.5012, 34.8918),
				r: 26,
				he: "המצודה הצלבנית",
				en: "Crusader Citadel"
			},
			{
				...cae(32.497, 34.8912),
				r: 28,
				he: "התיאטרון הרומי",
				en: "Roman Theatre"
			}
		]
	}),
	defineTrack({
		id: "deadsea",
		nameHe: "ים המלח",
		nameEn: "Dead Sea",
		city: "deadsea",
		cityHe: "ים המלח",
		cityEn: "Dead Sea",
		lengthHint: "3 הקפות · כביש 90",
		description: "עין בוקק, בתי המלון, המלח והרי מואב מעבר למים. בהשראת המקום, לא מפה ולא GIS.",
		descriptionEn: "Ein Bokek, the hotel strip, salt flats and the Moab mountains across the water. Inspired by the place — not a map, not GIS.",
		image: "/tracks/deadsea.jpg",
		width: 20,
		seed: 430,
		theme: "desert",
		ground: 13152400,
		sand: 15787212,
		sky: {
			elevation: 52,
			azimuth: 200,
			turbidity: 9.2,
			rayleigh: 1.25,
			mieCoefficient: .0072,
			mieDirectionalG: .68,
			exposure: .84,
			fog: 15259832,
			fogDensity: .0014
		},
		water: {
			x: dsea(31.19, 35.385).x,
			z: dsea(31.19, 35.385).z,
			w: 320,
			d: 700,
			color: 2793648
		},
		checkpointCount: 12,
		points: [
			dsea(31.201, 35.3625),
			dsea(31.196, 35.362),
			dsea(31.19, 35.3618),
			dsea(31.183, 35.3622),
			dsea(31.176, 35.3632),
			dsea(31.168, 35.3644),
			dsea(31.16, 35.3654),
			dsea(31.154, 35.366),
			dsea(31.152, 35.3636),
			dsea(31.156, 35.3618),
			dsea(31.164, 35.3606),
			dsea(31.172, 35.36),
			dsea(31.182, 35.36),
			dsea(31.192, 35.3604),
			dsea(31.2, 35.361)
		],
		elevation: () => -.4,
		streets: [
			{
				from: 0,
				to: .22,
				he: "עין בוקק",
				en: "Ein Bokek"
			},
			{
				from: .22,
				to: .5,
				he: "כביש 90",
				en: "Route 90"
			},
			{
				from: .5,
				to: .72,
				he: "נווה זוהר",
				en: "Neve Zohar"
			},
			{
				from: .72,
				to: 1,
				he: "המלונות",
				en: "The Hotels"
			}
		],
		pois: [
			{
				...dsea(31.201, 35.362),
				r: 32,
				he: "עין בוקק",
				en: "Ein Bokek"
			},
			{
				...dsea(31.1992, 35.3658),
				r: 28,
				he: "הרודס",
				en: "Herods"
			},
			{
				...dsea(31.19, 35.38),
				r: 50,
				he: "ים המלח",
				en: "Dead Sea"
			},
			{
				...dsea(31.152, 35.365),
				r: 26,
				he: "נווה זוהר",
				en: "Neve Zohar"
			}
		]
	}),
	defineTrack({
		id: "acre",
		nameHe: "עכו העתיקה",
		nameEn: "Old Acre",
		city: "acre",
		cityHe: "עכו",
		cityEn: "Acre",
		lengthHint: "3 הקפות · החומות",
		description: "החומות הצלבניות, חאן אל-עומדאן, המסגד והנמל. בהשראת המקום, לא מפה ולא GIS.",
		descriptionEn: "Crusader walls, Khan al-Umdan, the mosque and the fishing harbor. Inspired by the place — not a map, not GIS.",
		image: "/tracks/acre.jpg",
		width: 20,
		seed: 1104,
		theme: "jaffa",
		ground: 12101768,
		sand: 13943972,
		sky: {
			...TLV_DUSK,
			fogDensity: .0015
		},
		water: {
			x: acr(32.92, 35.066).x,
			z: acr(32.92, 35.066).z,
			w: 220,
			d: 180,
			color: 1464424
		},
		checkpointCount: 10,
		points: [
			acr(32.9195, 35.0708),
			acr(32.92, 35.0694),
			acr(32.921, 35.0682),
			acr(32.9224, 35.0676),
			acr(32.9236, 35.0684),
			acr(32.9242, 35.07),
			acr(32.924, 35.0716),
			acr(32.923, 35.0728),
			acr(32.9216, 35.0732),
			acr(32.9204, 35.0724)
		],
		elevation: () => .8,
		streets: [
			{
				from: 0,
				to: .2,
				he: "הנמל",
				en: "The Harbor"
			},
			{
				from: .2,
				to: .4,
				he: "חאן אל-עומדאן",
				en: "Khan al-Umdan"
			},
			{
				from: .4,
				to: .6,
				he: "חומת הים",
				en: "Sea Wall"
			},
			{
				from: .6,
				to: .8,
				he: "מסגד אל-ג'זאר",
				en: "Al-Jazzar Mosque"
			},
			{
				from: .8,
				to: 1,
				he: "המצודה",
				en: "The Citadel"
			}
		],
		pois: [
			{
				...acr(32.9195, 35.0708),
				r: 30,
				he: "נמל עכו",
				en: "Acre Harbor"
			},
			{
				...acr(32.9208, 35.0695),
				r: 24,
				he: "חאן אל-עומדאן",
				en: "Khan al-Umdan"
			},
			{
				...acr(32.9228, 35.0708),
				r: 26,
				he: "מסגד אל-ג'זאר",
				en: "Al-Jazzar Mosque"
			},
			{
				...acr(32.9236, 35.0702),
				r: 24,
				he: "המצודה",
				en: "The Citadel"
			}
		]
	}),
	defineTrack({
		id: "centralpark",
		nameHe: "סנטרל פארק",
		nameEn: "Central Park Drive",
		city: "nyc",
		cityHe: "ניו יורק",
		cityEn: "New York",
		lengthHint: "3 הקפות · פארק דרייב",
		description: "הלולאה ההיסטורית בתוך הפארק — גרנד ארמי פלאזה, בזסדה, מאגר המים והגוגנהיים. בהשראת המקום, לא מפה ולא GIS.",
		descriptionEn: "The historic Park Drive loop — Grand Army Plaza, Bethesda, the Reservoir and the Guggenheim. Inspired by the place — not a map, not GIS.",
		image: "/tracks/centralpark.jpg",
		width: 12.6,
		seed: 1858,
		theme: "park",
		ground: 4874824,
		sand: 12890256,
		sky: {
			elevation: 18,
			azimuth: 228,
			turbidity: 4.8,
			rayleigh: 1.55,
			mieCoefficient: .0042,
			mieDirectionalG: .8,
			exposure: .98,
			fog: 12108976,
			fogDensity: .004
		},
		water: {
			x: -14,
			z: -6,
			w: 52,
			d: 40,
			color: 1726552
		},
		waters: [{
			x: -14,
			z: -6,
			w: 52,
			d: 40,
			color: 1726552
		}, {
			x: 4,
			z: 86,
			w: 58,
			d: 50,
			color: 1859688
		}],
		clearZones: [{
			x: 0,
			z: 8,
			w: 92,
			d: 250
		}],
		checkpointCount: 10,
		points: [
			{
				x: 0,
				z: -118
			},
			{
				x: 38,
				z: -92
			},
			{
				x: 48,
				z: -48
			},
			{
				x: 50,
				z: -8
			},
			{
				x: 52,
				z: 32
			},
			{
				x: 48,
				z: 72
			},
			{
				x: 36,
				z: 108
			},
			{
				x: 8,
				z: 132
			},
			{
				x: -28,
				z: 118
			},
			{
				x: -48,
				z: 78
			},
			{
				x: -50,
				z: 32
			},
			{
				x: -48,
				z: -12
			},
			{
				x: -42,
				z: -58
			},
			{
				x: -28,
				z: -102
			}
		],
		elevation: (t) => .8 * Math.sin(t * Math.PI * 5) + 1.4 * Math.sin(t * Math.PI * 2),
		streets: [
			{
				from: 0,
				to: .14,
				he: "גרנד ארמי פלאזה",
				en: "Grand Army Plaza"
			},
			{
				from: .14,
				to: .28,
				he: "איסט דרייב · גן החיות",
				en: "East Drive · Zoo"
			},
			{
				from: .28,
				to: .42,
				he: "בזסדה טרס",
				en: "Bethesda Terrace"
			},
			{
				from: .42,
				to: .56,
				he: "המוזיאון המטרופוליטן",
				en: "The Met"
			},
			{
				from: .56,
				to: .7,
				he: "מאגר המים",
				en: "The Reservoir"
			},
			{
				from: .7,
				to: .82,
				he: "הארלם מיר",
				en: "Harlem Meer"
			},
			{
				from: .82,
				to: .92,
				he: "וסט דרייב",
				en: "West Drive"
			},
			{
				from: .92,
				to: 1,
				he: "קולומבוס סירקל",
				en: "Columbus Circle"
			}
		],
		pois: [
			{
				x: 8,
				z: -8,
				r: 28,
				he: "מזרקת בזסדה",
				en: "Bethesda Fountain"
			},
			{
				x: -18,
				z: 2,
				r: 24,
				he: "גשר הקשת",
				en: "Bow Bridge"
			},
			{
				x: -6,
				z: 28,
				r: 26,
				he: "טירת בלוודיר",
				en: "Belvedere Castle"
			},
			{
				x: 72,
				z: 38,
				r: 36,
				he: "המטרופוליטן",
				en: "The Met"
			},
			{
				x: 72,
				z: 88,
				r: 32,
				he: "הגוגנהיים",
				en: "Guggenheim"
			},
			{
				x: -72,
				z: -8,
				r: 28,
				he: "הדקוטה",
				en: "The Dakota"
			},
			{
				x: -48,
				z: -122,
				r: 32,
				he: "קולומבוס סירקל",
				en: "Columbus Circle"
			},
			{
				x: 12,
				z: -148,
				r: 30,
				he: "מלון פלאזה",
				en: "The Plaza"
			}
		]
	}),
	defineTrack({
		id: "timessquare",
		nameHe: "טיימס סקוואר",
		nameEn: "Times Square",
		city: "nyc",
		cityHe: "ניו יורק",
		cityEn: "New York",
		lengthHint: "3 הקפות · ברודוויי",
		description: "הקניון הניאון — טיימס סקוואר, רוקפלר, הספרייה הציבורית ומגדל אמפייר סטייט. בהשראת המקום, לא מפה ולא GIS.",
		descriptionEn: "The neon canyon — Times Square, Rockefeller, the Public Library and the Empire State. Inspired by the place — not a map, not GIS.",
		image: "/tracks/timessquare.jpg",
		width: 13.2,
		seed: 1904,
		theme: "manhattan",
		ground: 5920852,
		sand: 11051152,
		sky: {
			elevation: 5.5,
			azimuth: 252,
			turbidity: 5.4,
			rayleigh: 1.4,
			mieCoefficient: .005,
			mieDirectionalG: .9,
			exposure: .76,
			fog: 3815496,
			fogDensity: .0052
		},
		checkpointCount: 8,
		points: [
			{
				x: 6,
				z: 0
			},
			{
				x: 46,
				z: 2
			},
			{
				x: 62,
				z: 8
			},
			{
				x: 56,
				z: 46
			},
			{
				x: 20,
				z: 52
			},
			{
				x: -4,
				z: 58
			},
			{
				x: -8,
				z: 92
			},
			{
				x: -46,
				z: 86
			},
			{
				x: -54,
				z: 36
			},
			{
				x: -50,
				z: 2
			},
			{
				x: -22,
				z: -4
			},
			{
				x: 2,
				z: -28
			}
		],
		elevation: (t) => .4 * Math.sin(t * Math.PI * 6),
		streets: [
			{
				from: 0,
				to: .16,
				he: "השדרה השביעית · 42",
				en: "7th Ave · 42nd"
			},
			{
				from: .16,
				to: .3,
				he: "רחוב 42 · בראיינט פארק",
				en: "42nd · Bryant Park"
			},
			{
				from: .3,
				to: .44,
				he: "השדרה החמישית",
				en: "Fifth Avenue"
			},
			{
				from: .44,
				to: .58,
				he: "ברודוויי",
				en: "Broadway"
			},
			{
				from: .58,
				to: .72,
				he: "רוקפלר סנטר",
				en: "Rockefeller Center"
			},
			{
				from: .72,
				to: .86,
				he: "השדרה השמינית",
				en: "8th Avenue"
			},
			{
				from: .86,
				to: 1,
				he: "פורט אותוריטי",
				en: "Port Authority"
			}
		],
		pois: [
			{
				x: 2,
				z: 10,
				r: 28,
				he: "ואן טיימס סקוואר",
				en: "One Times Square"
			},
			{
				x: 0,
				z: 36,
				r: 22,
				he: "כיכר דאפי · TKTS",
				en: "Duffy Square · TKTS"
			},
			{
				x: 8,
				z: 98,
				r: 36,
				he: "רוקפלר סנטר",
				en: "Rockefeller Center"
			},
			{
				x: 68,
				z: 6,
				r: 30,
				he: "הספרייה הציבורית",
				en: "NY Public Library"
			},
			{
				x: 18,
				z: -88,
				r: 42,
				he: "אמפייר סטייט",
				en: "Empire State"
			},
			{
				x: 78,
				z: -40,
				r: 36,
				he: "קרייזלר",
				en: "Chrysler Building"
			},
			{
				x: -52,
				z: 4,
				r: 28,
				he: "פורט אותוריטי",
				en: "Port Authority"
			}
		]
	}),
	defineTrack({
		id: "brooklynbridge",
		nameHe: "גשר ברוקלין",
		nameEn: "Brooklyn Bridge",
		city: "nyc",
		cityHe: "ניו יורק",
		cityEn: "New York",
		lengthHint: "3 הקפות · איסט ריבר",
		description: "מגדלי הגותיקה מעל האיסט ריבר — סיטי הול, דאמבו, ואן וורלד טרייד ופסל החירות. בהשראת המקום, לא מפה ולא GIS.",
		descriptionEn: "Gothic towers over the East River — City Hall, DUMBO, One World Trade and the Statue of Liberty. Inspired by the place — not a map, not GIS.",
		image: "/tracks/brooklynbridge.jpg",
		width: 12.4,
		seed: 1883,
		theme: "manhattan",
		ground: 6973536,
		sand: 11576456,
		sky: {
			elevation: 8.2,
			azimuth: 244,
			turbidity: 5.8,
			rayleigh: 1.7,
			mieCoefficient: .0046,
			mieDirectionalG: .86,
			exposure: .82,
			fog: 6976640,
			fogDensity: .0038
		},
		water: {
			x: 10,
			z: 18,
			w: 92,
			d: 160,
			color: 1456200
		},
		checkpointCount: 10,
		points: [
			{
				x: -58,
				z: 10
			},
			{
				x: -22,
				z: 4
			},
			{
				x: 16,
				z: -2
			},
			{
				x: 52,
				z: -8
			},
			{
				x: 88,
				z: -22
			},
			{
				x: 112,
				z: 4
			},
			{
				x: 108,
				z: 36
			},
			{
				x: 78,
				z: 52
			},
			{
				x: 40,
				z: 58
			},
			{
				x: 4,
				z: 52
			},
			{
				x: -36,
				z: 46
			},
			{
				x: -72,
				z: 38
			},
			{
				x: -98,
				z: 22
			},
			{
				x: -100,
				z: 12
			}
		],
		elevation: (t) => {
			return Math.exp(-(((t - .14) / .1) ** 2)) * 16.5 + Math.exp(-(((t - .58) / .1) ** 2)) * 11.5;
		},
		streets: [
			{
				from: 0,
				to: .22,
				he: "גשר ברוקלין",
				en: "Brooklyn Bridge"
			},
			{
				from: .22,
				to: .36,
				he: "קדמן פלאזה",
				en: "Cadman Plaza"
			},
			{
				from: .36,
				to: .5,
				he: "דאמבו · פולטון",
				en: "DUMBO · Fulton"
			},
			{
				from: .5,
				to: .64,
				he: "גשר מנהטן",
				en: "Manhattan Bridge"
			},
			{
				from: .64,
				to: .78,
				he: "סאות סטריט סיפורט",
				en: "South Street Seaport"
			},
			{
				from: .78,
				to: .9,
				he: "פיננשל דיסטריקט",
				en: "Financial District"
			},
			{
				from: .9,
				to: 1,
				he: "סיטי הול · פארק רואו",
				en: "City Hall · Park Row"
			}
		],
		pois: [
			{
				x: -22,
				z: 4,
				r: 28,
				he: "מגדל מנהטן",
				en: "Manhattan Tower"
			},
			{
				x: 52,
				z: -8,
				r: 28,
				he: "מגדל ברוקלין",
				en: "Brooklyn Tower"
			},
			{
				x: 112,
				z: 8,
				r: 32,
				he: "דאמבו",
				en: "DUMBO"
			},
			{
				x: -88,
				z: -8,
				r: 40,
				he: "ואן וורלד טרייד",
				en: "One World Trade"
			},
			{
				x: -70,
				z: 8,
				r: 28,
				he: "וולוורת'",
				en: "Woolworth Building"
			},
			{
				x: -130,
				z: -70,
				r: 48,
				he: "פסל החירות",
				en: "Statue of Liberty"
			},
			{
				x: -72,
				z: 38,
				r: 28,
				he: "הסיפורט",
				en: "South Street Seaport"
			}
		]
	}),
	defineTrack({
		id: "manhattan",
		nameHe: "הקפת מנהטן",
		nameEn: "Manhattan Loop",
		city: "nyc",
		cityHe: "ניו יורק",
		cityEn: "New York",
		lengthHint: "3 הקפות · האי כולו",
		description: "FDR, נהר הארלם והנרי הדסון — הקפה מלאה סביב האי עם קו הרקיע כולו. בהשראת המקום, לא מפה ולא GIS.",
		descriptionEn: "FDR Drive, Harlem River and the Henry Hudson — a full lap of the island and its skyline. Inspired by the place — not a map, not GIS.",
		image: "/tracks/manhattan.jpg",
		width: 15.2,
		seed: 1626,
		theme: "manhattan",
		ground: 6052438,
		sand: 10524808,
		sky: {
			elevation: 14,
			azimuth: 236,
			turbidity: 4.4,
			rayleigh: 1.6,
			mieCoefficient: .004,
			mieDirectionalG: .84,
			exposure: .9,
			fog: 9082532,
			fogDensity: .0032
		},
		water: {
			x: -122,
			z: 0,
			w: 118,
			d: 420,
			color: 1456208
		},
		waters: [
			{
				x: -122,
				z: 0,
				w: 118,
				d: 420,
				color: 1456208
			},
			{
				x: 120,
				z: 0,
				w: 118,
				d: 420,
				color: 1720400
			},
			{
				x: 0,
				z: -228,
				w: 280,
				d: 96,
				color: 1390664
			}
		],
		clearZones: [{
			x: 0,
			z: 88,
			w: 58,
			d: 92
		}],
		checkpointCount: 12,
		points: [
			{
				x: 0,
				z: -168
			},
			{
				x: 38,
				z: -148
			},
			{
				x: 52,
				z: -110
			},
			{
				x: 58,
				z: -60
			},
			{
				x: 62,
				z: -10
			},
			{
				x: 64,
				z: 40
			},
			{
				x: 60,
				z: 90
			},
			{
				x: 52,
				z: 138
			},
			{
				x: 18,
				z: 168
			},
			{
				x: -22,
				z: 164
			},
			{
				x: -52,
				z: 130
			},
			{
				x: -60,
				z: 80
			},
			{
				x: -62,
				z: 30
			},
			{
				x: -58,
				z: -20
			},
			{
				x: -50,
				z: -80
			},
			{
				x: -32,
				z: -130
			},
			{
				x: -8,
				z: -160
			}
		],
		elevation: (t) => .6 * Math.sin(t * Math.PI * 8) + (t > .48 && t < .62 ? 2.2 : 0),
		streets: [
			{
				from: 0,
				to: .1,
				he: "באטרי פארק",
				en: "Battery Park"
			},
			{
				from: .1,
				to: .22,
				he: "FDR · גשר ברוקלין",
				en: "FDR · Brooklyn Bridge"
			},
			{
				from: .22,
				to: .34,
				he: "FDR · איסט וילג'",
				en: "FDR · East Village"
			},
			{
				from: .34,
				to: .46,
				he: "FDR · האו\"ם",
				en: "FDR · United Nations"
			},
			{
				from: .46,
				to: .58,
				he: "קווינסבורו",
				en: "Queensboro"
			},
			{
				from: .58,
				to: .7,
				he: "נהר הארלם",
				en: "Harlem River"
			},
			{
				from: .7,
				to: .82,
				he: "הנרי הדסון",
				en: "Henry Hudson"
			},
			{
				from: .82,
				to: .92,
				he: "ריברסייד · 42",
				en: "Riverside · 42nd"
			},
			{
				from: .92,
				to: 1,
				he: "צ'לסי · הולנד",
				en: "Chelsea · Holland"
			}
		],
		pois: [
			{
				x: -40,
				z: -208,
				r: 48,
				he: "פסל החירות",
				en: "Statue of Liberty"
			},
			{
				x: -18,
				z: -128,
				r: 40,
				he: "ואן וורלד טרייד",
				en: "One World Trade"
			},
			{
				x: -6,
				z: -48,
				r: 28,
				he: "פלאטאיירון",
				en: "Flatiron"
			},
			{
				x: 8,
				z: 8,
				r: 36,
				he: "אמפייר סטייט",
				en: "Empire State"
			},
			{
				x: 32,
				z: 22,
				r: 32,
				he: "קרייזלר",
				en: "Chrysler Building"
			},
			{
				x: 52,
				z: 36,
				r: 30,
				he: "האומות המאוחדות",
				en: "United Nations"
			},
			{
				x: -12,
				z: 18,
				r: 28,
				he: "טיימס סקוואר",
				en: "Times Square"
			},
			{
				x: 0,
				z: 88,
				r: 50,
				he: "סנטרל פארק",
				en: "Central Park"
			}
		]
	}),
	defineTrack({
		id: "beersheva",
		nameHe: "באר שבע",
		nameEn: "Be'er Sheva",
		city: "beersheva",
		cityHe: "באר שבע",
		cityEn: "Be'er Sheva",
		lengthHint: "3 הקפות · הנגב",
		description: "שדרות רגר, באר אברהם, מגדל העירייה וקמפוס בן־גוריון. בהשראת המקום, לא מפה ולא GIS.",
		descriptionEn: "Rager Boulevard, Abraham's Well, City Hall tower and the BGU campus. Inspired by the place — not a map, not GIS.",
		image: "/tracks/beersheva.jpg",
		width: 20,
		seed: 1906,
		theme: "desert",
		ground: 12888184,
		sand: 15258792,
		sky: {
			elevation: 48,
			azimuth: 210,
			turbidity: 8.4,
			rayleigh: 1.2,
			mieCoefficient: .0068,
			mieDirectionalG: .7,
			exposure: .82,
			fog: 14996660,
			fogDensity: .0014
		},
		checkpointCount: 10,
		points: [
			bsv(31.252, 34.7915),
			bsv(31.2544, 34.793),
			bsv(31.2568, 34.795),
			bsv(31.2592, 34.7974),
			bsv(31.2614, 34.8002),
			bsv(31.261, 34.8032),
			bsv(31.2586, 34.8044),
			bsv(31.2558, 34.8032),
			bsv(31.2528, 34.8012),
			bsv(31.2498, 34.7988),
			bsv(31.247, 34.7962),
			bsv(31.2446, 34.7936),
			bsv(31.2436, 34.791),
			bsv(31.2454, 34.7896),
			bsv(31.2484, 34.79)
		],
		elevation: () => .6,
		streets: [
			{
				from: 0,
				to: .28,
				he: "שדרות רגר",
				en: "Rager Blvd"
			},
			{
				from: .28,
				to: .5,
				he: "האוניברסיטה",
				en: "The University"
			},
			{
				from: .5,
				to: .75,
				he: "דרך חברון",
				en: "Hebron Road"
			},
			{
				from: .75,
				to: 1,
				he: "באר אברהם",
				en: "Abraham's Well"
			}
		],
		pois: [
			{
				...bsv(31.251, 34.7936),
				r: 32,
				he: "מגדל העירייה",
				en: "City Hall"
			},
			{
				...bsv(31.2426, 34.7884),
				r: 28,
				he: "באר אברהם",
				en: "Abraham's Well"
			},
			{
				...bsv(31.2624, 34.8046),
				r: 32,
				he: "ספריית בן־גוריון",
				en: "BGU Library"
			},
			{
				...bsv(31.2448, 34.7892),
				r: 22,
				he: "התחנה העות׳מאנית",
				en: "Ottoman Station"
			}
		]
	}),
	defineTrack({
		id: "netanya",
		nameHe: "נתניה · הטיילת",
		nameEn: "Netanya Promenade",
		city: "netanya",
		cityHe: "נתניה",
		cityEn: "Netanya",
		lengthHint: "3 הקפות · המצוק",
		description: "כיכר העצמאות, טיילת המצוק, הרצל ופולג. בהשראת המקום, לא מפה ולא GIS.",
		descriptionEn: "Independence Square, the cliff promenade, Herzl Street and Poleg. Inspired by the place — not a map, not GIS.",
		image: "/tracks/netanya.jpg",
		width: 20,
		seed: 1929,
		theme: "bauhaus",
		ground: 12101768,
		sand: 14733488,
		sky: {
			...TLV_GOLDEN,
			fogDensity: .0014
		},
		water: {
			x: net(32.332, 34.845).x,
			z: net(32.332, 34.845).z,
			w: 280,
			d: 420,
			color: 1730688
		},
		checkpointCount: 10,
		points: [
			net(32.332, 34.8512),
			net(32.334, 34.8508),
			net(32.336, 34.8506),
			net(32.3372, 34.8518),
			net(32.3364, 34.8542),
			net(32.3348, 34.856),
			net(32.3328, 34.8572),
			net(32.3306, 34.8578),
			net(32.3286, 34.8572),
			net(32.3274, 34.8552),
			net(32.3282, 34.8528),
			net(32.3302, 34.8516)
		],
		elevation: () => 2.2,
		streets: [
			{
				from: 0,
				to: .28,
				he: "טיילת ניס",
				en: "Nice Blvd"
			},
			{
				from: .28,
				to: .5,
				he: "המצוק",
				en: "The Cliff"
			},
			{
				from: .5,
				to: .75,
				he: "הרצל",
				en: "Herzl Street"
			},
			{
				from: .75,
				to: 1,
				he: "כיכר העצמאות",
				en: "Independence Sq."
			}
		],
		pois: [
			{
				...net(32.3318, 34.8565),
				r: 32,
				he: "כיכר העצמאות",
				en: "Independence Square"
			},
			{
				...net(32.334, 34.851),
				r: 36,
				he: "המצוק",
				en: "The Cliff"
			},
			{
				...net(32.3266, 34.8506),
				r: 28,
				he: "מגדל ישרוטל",
				en: "Isrotel Tower"
			},
			{
				...net(32.3282, 34.8502),
				r: 26,
				he: "לאונרדו פלאזה",
				en: "Leonardo Plaza"
			},
			{
				...net(32.329, 34.858),
				r: 26,
				he: "הרצל",
				en: "Herzl Street"
			}
		]
	}),
	defineTrack({
		id: "hw1",
		nameHe: "כביש 1",
		nameEn: "Highway 1",
		city: "highway",
		cityHe: "כביש 1",
		cityEn: "Highway 1",
		lengthHint: "נסיעה אחת · לטרון לירושלים",
		description: "בהשראת כביש 1: לטרון, שער הגיא, הקסטל. לא GIS.",
		descriptionEn: "Inspired by Highway 1: Latrun, Sha'ar HaGai, Castel. Not GIS.",
		image: "/tracks/hw1.jpg",
		width: 26,
		seed: 1978,
		theme: "highway",
		open: true,
		ground: 6978136,
		sand: 12103824,
		sky: {
			elevation: 28,
			azimuth: 228,
			turbidity: 4.8,
			rayleigh: 1.5,
			mieCoefficient: .004,
			mieDirectionalG: .78,
			exposure: .78,
			fog: 13160640,
			fogDensity: .0013
		},
		checkpointCount: 8,
		points: [
			hwy1(31.835, 34.982),
			hwy1(31.831, 34.992),
			hwy1(31.826, 35.002),
			hwy1(31.821, 35.012),
			hwy1(31.817, 35.022),
			hwy1(31.813, 35.03),
			hwy1(31.811, 35.034)
		],
		elevation: (t) => 2 + 36 * Math.pow(t, 1.08),
		streets: [
			{
				from: 0,
				to: .28,
				he: "לטרון",
				en: "Latrun"
			},
			{
				from: .28,
				to: .55,
				he: "שער הגיא",
				en: "Sha'ar HaGai"
			},
			{
				from: .55,
				to: .8,
				he: "הקסטל",
				en: "Castel"
			},
			{
				from: .8,
				to: 1,
				he: "כביש 1",
				en: "Highway 1"
			}
		],
		pois: [
			{
				...hwy1(31.835, 34.98),
				r: 40,
				he: "מנזר השתקנים לטרון",
				en: "Latrun Monastery"
			},
			{
				...hwy1(31.838, 34.978),
				r: 28,
				he: "מוזיאון השריון",
				en: "Yad La-Shiryon"
			},
			{
				...hwy1(31.815, 35.023),
				r: 34,
				he: "שער הגיא",
				en: "Sha'ar HaGai"
			},
			{
				...hwy1(31.812, 35.032),
				r: 32,
				he: "הקסטל",
				en: "Castel"
			}
		]
	}),
	defineTrack({
		id: "herzliya",
		nameHe: "הרצליה פיתוח",
		nameEn: "Herzliya Pituach",
		city: "herzliya",
		cityHe: "הרצליה",
		cityEn: "Herzliya",
		lengthHint: "3 הקפות · המרינה",
		description: "המרינה, ארנה, פארק ההייטק ושדרות בן גוריון. בהשראת המקום, לא מפה ולא GIS.",
		descriptionEn: "The marina, Arena Mall, the high-tech park and Ben Gurion Boulevard. Inspired by the place — not a map, not GIS.",
		image: "/tracks/herzliya.jpg",
		width: 20,
		seed: 1924,
		theme: "port",
		ground: 9078400,
		sand: 13945008,
		sky: {
			...TLV_BLUE,
			fogDensity: .0014
		},
		water: {
			x: hzl(32.163, 34.792).x,
			z: hzl(32.163, 34.792).z,
			w: 240,
			d: 360,
			color: 1595504
		},
		checkpointCount: 10,
		points: [
			hzl(32.1635, 34.7965),
			hzl(32.1648, 34.7984),
			hzl(32.1652, 34.8012),
			hzl(32.1644, 34.8042),
			hzl(32.1628, 34.8068),
			hzl(32.1608, 34.8084),
			hzl(32.1592, 34.8072),
			hzl(32.1588, 34.8044),
			hzl(32.1596, 34.8012),
			hzl(32.1608, 34.7984),
			hzl(32.1622, 34.7966)
		],
		elevation: () => .4,
		streets: [
			{
				from: 0,
				to: .28,
				he: "המרינה",
				en: "The Marina"
			},
			{
				from: .28,
				to: .52,
				he: "מדינת היהודים",
				en: "Medinat HaYehudim"
			},
			{
				from: .52,
				to: .76,
				he: "ארנה",
				en: "Arena"
			},
			{
				from: .76,
				to: 1,
				he: "פארק ההייטק",
				en: "High-tech Park"
			}
		],
		pois: [
			{
				...hzl(32.1635, 34.7965),
				r: 36,
				he: "המרינה",
				en: "Herzliya Marina"
			},
			{
				...hzl(32.1662, 34.8004),
				r: 32,
				he: "מלון אקדאה",
				en: "Accadia Hotel"
			},
			{
				...hzl(32.1648, 34.8016),
				r: 28,
				he: "מלון דניאל",
				en: "Daniel Hotel"
			},
			{
				...hzl(32.1612, 34.8068),
				r: 30,
				he: "ארנה",
				en: "Arena Mall"
			},
			{
				...hzl(32.1594, 34.8096),
				r: 30,
				he: "פארק ההייטק",
				en: "High-tech Park"
			}
		]
	}),
	defineTrack({
		id: "hanikra",
		nameHe: "ראש הנקרה",
		nameEn: "Rosh Hanikra",
		city: "galilee",
		cityHe: "גליל מערבי",
		cityEn: "Western Galilee",
		lengthHint: "3 הקפות · המצוק",
		description: "כביש 4 על הגבול, המנהרות, הגרוטות הלבנות ושלומי. בהשראת המקום, לא מפה ולא GIS.",
		descriptionEn: "Route 4 on the border, the tunnels, the white grottos and Shlomi. Inspired by the place — not a map, not GIS.",
		image: "/tracks/hanikra.jpg",
		width: 20,
		seed: 1949,
		theme: "carmel",
		ground: 13156528,
		sand: 15261904,
		sky: {
			elevation: 26,
			azimuth: 250,
			turbidity: 4.2,
			rayleigh: 1.45,
			mieCoefficient: .004,
			mieDirectionalG: .8,
			exposure: .76,
			fog: 13161688,
			fogDensity: .0014
		},
		water: {
			x: nik(33.09, 35.098).x,
			z: nik(33.09, 35.098).z,
			w: 240,
			d: 320,
			color: 1403e3
		},
		checkpointCount: 10,
		points: [
			nik(33.093, 35.104),
			nik(33.09, 35.107),
			nik(33.086, 35.112),
			nik(33.082, 35.12),
			nik(33.078, 35.13),
			nik(33.075, 35.138),
			nik(33.073, 35.142),
			nik(33.075, 35.144),
			nik(33.079, 35.136),
			nik(33.084, 35.124),
			nik(33.088, 35.114),
			nik(33.091, 35.108)
		],
		elevation: () => 1.2,
		streets: [
			{
				from: 0,
				to: .28,
				he: "ראש הנקרה",
				en: "Rosh Hanikra"
			},
			{
				from: .28,
				to: .52,
				he: "המנהרות",
				en: "The Tunnels"
			},
			{
				from: .52,
				to: .78,
				he: "כביש 4",
				en: "Route 4"
			},
			{
				from: .78,
				to: 1,
				he: "שלומי",
				en: "Shlomi"
			}
		],
		pois: [
			{
				...nik(33.093, 35.104),
				r: 40,
				he: "המצוק",
				en: "The Cliff"
			},
			{
				...nik(33.09, 35.108),
				r: 28,
				he: "המנהרות",
				en: "The Tunnels"
			},
			{
				...nik(33.074, 35.14),
				r: 26,
				he: "שלומי",
				en: "Shlomi"
			}
		]
	}),
	defineTrack({
		id: "haifaport",
		nameHe: "נמל חיפה",
		nameEn: "Haifa Port",
		city: "haifa",
		cityHe: "חיפה",
		cityEn: "Haifa",
		lengthHint: "3 הקפות · הרציפים",
		description: "הרציפים, העגורנים, המושבה הגרמנית ובת גלים. בהשראת המקום, לא מפה ולא GIS.",
		descriptionEn: "The docks, the cranes, the German Colony and Bat Galim. Inspired by the place — not a map, not GIS.",
		image: "/tracks/haifaport.jpg",
		width: 20,
		seed: 1905,
		theme: "port",
		ground: 8025196,
		sand: 12101768,
		sky: {
			elevation: 8,
			azimuth: 248,
			turbidity: 5.4,
			rayleigh: 1.6,
			mieCoefficient: .005,
			mieDirectionalG: .86,
			exposure: .7,
			fog: 5923440,
			fogDensity: .00145
		},
		water: {
			x: hai(32.822, 35.012).x,
			z: hai(32.822, 35.012).z,
			w: 420,
			d: 280,
			color: 1726576
		},
		checkpointCount: 10,
		points: [
			hai(32.8195, 34.989),
			hai(32.8192, 34.9924),
			hai(32.819, 34.996),
			hai(32.819, 34.9996),
			hai(32.8194, 35.0032),
			hai(32.8212, 35.0044),
			hai(32.8236, 35.0028),
			hai(32.8262, 34.9992),
			hai(32.8288, 34.9948),
			hai(32.8312, 34.9902),
			hai(32.8328, 34.9856),
			hai(32.832, 34.9816),
			hai(32.8296, 34.9804),
			hai(32.8268, 34.9828),
			hai(32.8238, 34.9864),
			hai(32.8212, 34.9896)
		],
		elevation: () => .5,
		streets: [
			{
				from: 0,
				to: .22,
				he: "הרציף",
				en: "The Quay"
			},
			{
				from: .22,
				to: .42,
				he: "העצמאות",
				en: "HaAtzmaut"
			},
			{
				from: .42,
				to: .62,
				he: "בן גוריון",
				en: "Ben Gurion"
			},
			{
				from: .62,
				to: .82,
				he: "בת גלים",
				en: "Bat Galim"
			},
			{
				from: .82,
				to: 1,
				he: "הנמל",
				en: "The Port"
			}
		],
		pois: [
			{
				...hai(32.8218, 35.0064),
				r: 36,
				he: "נמל חיפה",
				en: "Haifa Port"
			},
			{
				...hai(32.8216, 34.9984),
				r: 28,
				he: "דגון",
				en: "Dagon Silos"
			},
			{
				...hai(32.8182, 34.9884),
				r: 24,
				he: "המושבה הגרמנית",
				en: "German Colony"
			},
			{
				...hai(32.833, 34.982),
				r: 26,
				he: "בת גלים",
				en: "Bat Galim"
			}
		]
	}),
	defineTrack({
		id: "stellamaris",
		nameHe: "הכרמל המלא",
		nameEn: "Full Carmel",
		city: "haifa",
		cityHe: "חיפה",
		cityEn: "Haifa",
		lengthHint: "נסיעה אחת · בהאיים לסטלה מאריס",
		description: "מהגנים הבהאיים לאורך יפה נוף עד סטלה מאריס — כיוון אחד עם נוף המפרץ. בהשראת המקום, לא מפה ולא GIS.",
		descriptionEn: "From the Baháʼí Gardens along Yefe Nof to Stella Maris — one way with the bay. Inspired by the place — not a map, not GIS.",
		image: "/tracks/stellamaris.jpg",
		width: 20,
		seed: 1868,
		theme: "carmel",
		open: true,
		ground: 6978136,
		sand: 12101768,
		sky: {
			elevation: 42,
			azimuth: 200,
			turbidity: 3.6,
			rayleigh: 1.2,
			mieCoefficient: .0032,
			mieDirectionalG: .74,
			exposure: .76,
			fog: 11585732,
			fogDensity: .0014
		},
		water: {
			x: hai(32.83, 34.978).x,
			z: hai(32.83, 34.978).z,
			w: 360,
			d: 220,
			color: 1731200
		},
		checkpointCount: 7,
		points: [
			hai(32.8118, 34.9863),
			hai(32.8142, 34.9844),
			hai(32.8168, 34.9822),
			hai(32.8196, 34.9796),
			hai(32.8226, 34.9766),
			hai(32.8254, 34.9736),
			hai(32.8276, 34.9712),
			hai(32.8288, 34.9734)
		],
		elevation: (t) => 8 + 18 * t,
		streets: [
			{
				from: 0,
				to: .22,
				he: "יפה נוף",
				en: "Yefe Nof"
			},
			{
				from: .22,
				to: .45,
				he: "טיילת לואי",
				en: "Louis Promenade"
			},
			{
				from: .45,
				to: .7,
				he: "סטלה מאריס",
				en: "Stella Maris"
			},
			{
				from: .7,
				to: 1,
				he: "הנשיא",
				en: "Hanasie"
			}
		],
		pois: [
			{
				...hai(32.8284, 34.9688),
				r: 32,
				he: "סטלה מאריס",
				en: "Stella Maris"
			},
			{
				...hai(32.8272, 34.9678),
				r: 20,
				he: "מערת אליהו",
				en: "Elijah's Cave"
			},
			{
				...hai(32.8118, 34.9863),
				r: 28,
				he: "הגנים הבהאיים",
				en: "Baháʼí Gardens"
			},
			{
				...hai(32.818, 34.984),
				r: 24,
				he: "תצפית המפרץ",
				en: "Bay Lookout"
			}
		]
	}),
	defineTrack({
		id: "tiberias",
		nameHe: "טבריה · הכנרת",
		nameEn: "Tiberias · Kinneret",
		city: "kinneret",
		cityHe: "כנרת",
		cityEn: "Kinneret",
		lengthHint: "3 הקפות · הטיילת",
		description: "טיילת טבריה, המרינה, חמי טבריה וכביש 90 על המים. בהשראת המקום, לא מפה ולא GIS.",
		descriptionEn: "The Tiberias promenade, the marina, Hamat and Route 90 on the water. Inspired by the place — not a map, not GIS.",
		image: "/tracks/tiberias.jpg",
		width: 20,
		seed: 18,
		theme: "port",
		ground: 9077880,
		sand: 13943972,
		sky: {
			...TLV_GOLDEN,
			fogDensity: .0014
		},
		water: {
			x: tib(32.785, 35.555).x,
			z: tib(32.785, 35.555).z,
			w: 360,
			d: 520,
			color: 2787488
		},
		checkpointCount: 10,
		points: [
			tib(32.79, 35.543),
			tib(32.786, 35.5422),
			tib(32.782, 35.5418),
			tib(32.777, 35.5424),
			tib(32.772, 35.5442),
			tib(32.7685, 35.547),
			tib(32.7678, 35.5448),
			tib(32.771, 35.5422),
			tib(32.776, 35.5408),
			tib(32.782, 35.5404),
			tib(32.787, 35.5408),
			tib(32.79, 35.5416)
		],
		elevation: () => .3,
		streets: [
			{
				from: 0,
				to: .28,
				he: "הטיילת",
				en: "The Promenade"
			},
			{
				from: .28,
				to: .5,
				he: "המרינה",
				en: "The Marina"
			},
			{
				from: .5,
				to: .75,
				he: "חמי טבריה",
				en: "Hamat Tiberias"
			},
			{
				from: .75,
				to: 1,
				he: "כביש 90",
				en: "Route 90"
			}
		],
		pois: [
			{
				...tib(32.785, 35.55),
				r: 48,
				he: "הכנרת",
				en: "The Kinneret"
			},
			{
				...tib(32.788, 35.543),
				r: 28,
				he: "הטיילת",
				en: "The Promenade"
			},
			{
				...tib(32.79, 35.545),
				r: 24,
				he: "המרינה",
				en: "The Marina"
			},
			{
				...tib(32.7685, 35.549),
				r: 24,
				he: "חמי טבריה",
				en: "Hamat"
			},
			{
				...tib(32.7865, 35.5425),
				r: 22,
				he: "כנסיית פטרוס",
				en: "St. Peter's"
			}
		]
	}),
	defineTrack({
		id: "golan",
		nameHe: "כביש 98 · גולן",
		nameEn: "Route 98 · Golan",
		city: "golan",
		cityHe: "גולן",
		cityEn: "Golan",
		lengthHint: "3 הקפות · הבזלת",
		description: "קצרין, כביש 98, התלוליות והחרמון באופק. בהשראת המקום, לא מפה ולא GIS.",
		descriptionEn: "Katzrin, Route 98, the volcanic hills and Hermon on the horizon. Inspired by the place — not a map, not GIS.",
		image: "/tracks/golan.jpg",
		width: 20,
		seed: 1967,
		theme: "highway",
		ground: 6969928,
		sand: 10522744,
		sky: {
			elevation: 38,
			azimuth: 210,
			turbidity: 4.2,
			rayleigh: 1.25,
			mieCoefficient: .0036,
			mieDirectionalG: .74,
			exposure: .8,
			fog: 13156528,
			fogDensity: .0013
		},
		checkpointCount: 10,
		points: [
			gol(32.992, 35.689),
			gol(32.996, 35.693),
			gol(33, 35.697),
			gol(33.005, 35.701),
			gol(33.01, 35.7),
			gol(33.012, 35.696),
			gol(33.01, 35.691),
			gol(33.006, 35.686),
			gol(33.001, 35.683),
			gol(32.996, 35.684),
			gol(32.992, 35.686)
		],
		elevation: () => 4.2,
		streets: [
			{
				from: 0,
				to: .3,
				he: "קצרין",
				en: "Katzrin"
			},
			{
				from: .3,
				to: .6,
				he: "כביש 98",
				en: "Route 98"
			},
			{
				from: .6,
				to: 1,
				he: "הבזלת",
				en: "The Basalt"
			}
		],
		pois: [
			{
				...gol(32.992, 35.689),
				r: 32,
				he: "קצרין",
				en: "Katzrin"
			},
			{
				...gol(32.9904, 35.6964),
				r: 26,
				he: "בית הכנסת",
				en: "The Synagogue"
			},
			{
				...gol(33.008, 35.706),
				r: 28,
				he: "טורבינות",
				en: "Wind Turbines"
			}
		]
	}),
	defineTrack({
		id: "hermon",
		nameHe: "החרמון · העלייה",
		nameEn: "Hermon Climb",
		city: "golan",
		cityHe: "גולן",
		cityEn: "Golan",
		lengthHint: "עלייה אחת · ממג׳דל שמס לפסגה",
		description: "ממג׳דל שמס, סרפנטינות בחרמון, יער, שלג ואתר הסקי עד הפסגה. בהשראת המקום, לא מפה ולא GIS.",
		descriptionEn: "From Majdal Shams, switchbacks up Hermon, forest, snow and the ski site to the peak. Inspired by the place — not a map, not GIS.",
		image: "/tracks/hermon.jpg",
		width: 26,
		seed: 2814,
		theme: "snow",
		open: true,
		ground: 15265524,
		sand: 16054524,
		sky: {
			elevation: 38,
			azimuth: 188,
			turbidity: 2.4,
			rayleigh: 1.05,
			mieCoefficient: .0022,
			mieDirectionalG: .68,
			exposure: .78,
			fog: 14214382,
			fogDensity: 26e-5
		},
		checkpointCount: 8,
		points: [
			her(33.2688, 35.7712),
			her(33.2716, 35.7746),
			her(33.2738, 35.771),
			her(33.2766, 35.7752),
			her(33.2788, 35.7718),
			her(33.2818, 35.7764),
			her(33.284, 35.7726),
			her(33.2872, 35.778),
			her(33.2894, 35.7742),
			her(33.2924, 35.7802),
			her(33.2946, 35.7764),
			her(33.2978, 35.7824),
			her(33.3, 35.7786),
			her(33.3032, 35.785),
			her(33.3054, 35.7814),
			her(33.3084, 35.7876),
			her(33.3112, 35.79)
		],
		elevation: (t) => 4 + 168 * Math.pow(t, 1.12),
		streets: [
			{
				from: 0,
				to: .16,
				he: "מג׳דל שמס",
				en: "Majdal Shams"
			},
			{
				from: .16,
				to: .36,
				he: "הסרפנטינות",
				en: "Switchbacks"
			},
			{
				from: .36,
				to: .58,
				he: "היער",
				en: "The Forest"
			},
			{
				from: .58,
				to: .78,
				he: "קו השלג",
				en: "Snow Line"
			},
			{
				from: .78,
				to: 1,
				he: "אתר הסקי",
				en: "Ski Site"
			}
		],
		pois: [
			{
				...her(33.2688, 35.7712),
				r: 28,
				he: "מג׳דל שמס",
				en: "Majdal Shams"
			},
			{
				...her(33.2526, 35.7147),
				r: 32,
				he: "מבצר נמרוד",
				en: "Nimrod Fortress"
			},
			{
				...her(33.284, 35.7726),
				r: 28,
				he: "העלייה",
				en: "The Climb"
			},
			{
				...her(33.3, 35.7786),
				r: 30,
				he: "קו השלג",
				en: "Snow Line"
			},
			{
				...her(33.3112, 35.79),
				r: 36,
				he: "הפסגה",
				en: "The Peak"
			}
		]
	}),
	defineTrack({
		id: "hw6",
		nameHe: "כביש 6",
		nameEn: "Highway 6",
		city: "highway",
		cityHe: "כבישים",
		cityEn: "Highways",
		lengthHint: "3 הקפות · חוצה ישראל",
		description: "בהשראת כביש 6: אייל, קסם, נחשונים. לא GIS.",
		descriptionEn: "Inspired by Highway 6: Eyal, Kesem, Nachshonim. Not GIS.",
		image: "/tracks/hw6.jpg",
		width: 26,
		seed: 2002,
		theme: "highway",
		ground: 6978136,
		sand: 12103824,
		sky: {
			elevation: 32,
			azimuth: 232,
			turbidity: 4.4,
			rayleigh: 1.4,
			mieCoefficient: .0038,
			mieDirectionalG: .76,
			exposure: .78,
			fog: 12898500,
			fogDensity: .0013
		},
		checkpointCount: 12,
		points: [
			hwy6(32.21, 34.978),
			hwy6(32.19, 34.968),
			hwy6(32.17, 34.956),
			hwy6(32.15, 34.944),
			hwy6(32.13, 34.936),
			hwy6(32.11, 34.938),
			hwy6(32.09, 34.942),
			hwy6(32.07, 34.948),
			hwy6(32.062, 34.952),
			hwy6(32.068, 34.96),
			hwy6(32.09, 34.962),
			hwy6(32.114, 34.96),
			hwy6(32.14, 34.958),
			hwy6(32.166, 34.964),
			hwy6(32.19, 34.972)
		],
		elevation: () => 1.2,
		streets: [
			{
				from: 0,
				to: .25,
				he: "מחלף אייל",
				en: "Eyal Interchange"
			},
			{
				from: .25,
				to: .5,
				he: "קסם",
				en: "Kesem"
			},
			{
				from: .5,
				to: .75,
				he: "נחשונים",
				en: "Nachshonim"
			},
			{
				from: .75,
				to: 1,
				he: "חוצה ישראל",
				en: "Trans-Israel"
			}
		],
		pois: [
			{
				...hwy6(32.21, 34.978),
				r: 32,
				he: "מחלף אייל",
				en: "Eyal"
			},
			{
				...hwy6(32.134, 34.932),
				r: 28,
				he: "קסם",
				en: "Kesem"
			},
			{
				...hwy6(32.062, 34.948),
				r: 26,
				he: "נחשונים",
				en: "Nachshonim"
			}
		]
	}),
	defineTrack({
		id: "hw2",
		nameHe: "כביש 2",
		nameEn: "Highway 2",
		city: "highway",
		cityHe: "כבישים",
		cityEn: "Highways",
		lengthHint: "3 הקפות · כביש החוף",
		description: "בהשראת כביש 2: נתניה–חיפה. לא GIS.",
		descriptionEn: "Inspired by Highway 2: Netanya–Haifa. Not GIS.",
		image: "/tracks/hw2.jpg",
		width: 26,
		seed: 1950,
		theme: "highway",
		ground: 9077880,
		sand: 13945008,
		sky: {
			...TLV_GOLDEN,
			fogDensity: .0013
		},
		water: {
			x: hwy2(32.42, 34.86).x,
			z: hwy2(32.42, 34.86).z,
			w: 280,
			d: 620,
			color: 1730688
		},
		checkpointCount: 12,
		points: [
			hwy2(32.35, 34.858),
			hwy2(32.37, 34.864),
			hwy2(32.39, 34.87),
			hwy2(32.41, 34.876),
			hwy2(32.43, 34.882),
			hwy2(32.45, 34.888),
			hwy2(32.47, 34.892),
			hwy2(32.48, 34.896),
			hwy2(32.47, 34.902),
			hwy2(32.45, 34.898),
			hwy2(32.43, 34.892),
			hwy2(32.41, 34.886),
			hwy2(32.39, 34.88),
			hwy2(32.37, 34.874),
			hwy2(32.352, 34.866)
		],
		elevation: () => .6,
		streets: [
			{
				from: 0,
				to: .28,
				he: "נתניה צפון",
				en: "Netanya North"
			},
			{
				from: .28,
				to: .52,
				he: "אולגה",
				en: "Olga"
			},
			{
				from: .52,
				to: .78,
				he: "קיסריה מחלף",
				en: "Caesarea IC"
			},
			{
				from: .78,
				to: 1,
				he: "כביש החוף",
				en: "Coastal Hwy"
			}
		],
		pois: [
			{
				...hwy2(32.35, 34.85),
				r: 36,
				he: "הים",
				en: "The Sea"
			},
			{
				...hwy2(32.35, 34.858),
				r: 28,
				he: "נתניה",
				en: "Netanya"
			},
			{
				...hwy2(32.48, 34.892),
				r: 26,
				he: "קיסריה",
				en: "Caesarea"
			}
		]
	}),
	defineTrack({
		id: "hw90",
		nameHe: "כביש 90 · ערבה",
		nameEn: "Highway 90 · Arava",
		city: "highway",
		cityHe: "כבישים",
		cityEn: "Highways",
		lengthHint: "3 הקפות · האנדורו",
		description: "סדום עד אילת: הערבה, חצבה, גרופית והחום. בהשראת המקום, לא מפה ולא GIS.",
		descriptionEn: "Sodom to Eilat: the Arava, Hatzeva, Grofit and the heat. Inspired by the place — not a map, not GIS.",
		image: "/tracks/hw90.jpg",
		width: 22,
		seed: 90,
		theme: "desert",
		ground: 12886128,
		sand: 15258792,
		sky: {
			elevation: 56,
			azimuth: 196,
			turbidity: 9.4,
			rayleigh: 1.15,
			mieCoefficient: .0074,
			mieDirectionalG: .66,
			exposure: .82,
			fog: 15259832,
			fogDensity: .0013
		},
		checkpointCount: 12,
		points: [
			hwy90(30.767, 35.278),
			hwy90(30.748, 35.268),
			hwy90(30.728, 35.258),
			hwy90(30.708, 35.248),
			hwy90(30.688, 35.24),
			hwy90(30.668, 35.234),
			hwy90(30.652, 35.232),
			hwy90(30.654, 35.242),
			hwy90(30.674, 35.25),
			hwy90(30.696, 35.258),
			hwy90(30.718, 35.268),
			hwy90(30.74, 35.276),
			hwy90(30.76, 35.284)
		],
		elevation: () => .4,
		streets: [
			{
				from: 0,
				to: .16,
				he: "סדום",
				en: "Sodom"
			},
			{
				from: .16,
				to: .34,
				he: "הערבה",
				en: "The Arava"
			},
			{
				from: .34,
				to: .52,
				he: "חצבה",
				en: "Hatzeva"
			},
			{
				from: .52,
				to: .7,
				he: "גרופית",
				en: "Grofit"
			},
			{
				from: .7,
				to: .86,
				he: "יהל",
				en: "Yahel"
			},
			{
				from: .86,
				to: 1,
				he: "אילת צפון",
				en: "Eilat North"
			}
		],
		pois: [
			{
				...hwy90(30.767, 35.278),
				r: 32,
				he: "חצבה",
				en: "Hatzeva"
			},
			{
				...hwy90(30.71, 35.25),
				r: 28,
				he: "הערבה",
				en: "The Arava"
			},
			{
				...hwy90(30.659, 35.237),
				r: 26,
				he: "עין יהב",
				en: "Ein Yahav"
			}
		]
	}),
	defineTrack({
		id: "petah",
		nameHe: "פתח תקווה",
		nameEn: "Petah Tikva",
		city: "petah",
		cityHe: "פתח תקווה",
		cityEn: "Petah Tikva",
		lengthHint: "3 הקפות · אם המושבות",
		description: "ז׳בוטינסקי, הקניון הגדול, בילינסון ואחוזת בית. בהשראת המקום, לא מפה ולא GIS.",
		descriptionEn: "Jabotinsky, HaGadol mall, Beilinson and Ahuzat Bayit. Inspired by the place — not a map, not GIS.",
		image: "/tracks/petah.jpg",
		width: 20,
		seed: 1878,
		theme: "bauhaus",
		ground: 8026736,
		sand: 13156528,
		sky: {
			...TLV_GOLDEN,
			fogDensity: .0014
		},
		checkpointCount: 10,
		points: [
			pth(32.0872, 34.887),
			pth(32.0878, 34.882),
			pth(32.0886, 34.876),
			pth(32.0894, 34.87),
			pth(32.0908, 34.867),
			pth(32.0924, 34.8685),
			pth(32.0936, 34.873),
			pth(32.0932, 34.879),
			pth(32.0918, 34.885),
			pth(32.0898, 34.889),
			pth(32.0876, 34.89),
			pth(32.0864, 34.888)
		],
		elevation: () => .5,
		streets: [
			{
				from: 0,
				to: .22,
				he: "ז׳בוטינסקי",
				en: "Jabotinsky"
			},
			{
				from: .22,
				to: .42,
				he: "אם המושבות",
				en: "Em HaMoshavot"
			},
			{
				from: .42,
				to: .62,
				he: "רוטשילד",
				en: "Rothschild"
			},
			{
				from: .62,
				to: .82,
				he: "עובד בן עמי",
				en: "Oved Ben Ami"
			},
			{
				from: .82,
				to: 1,
				he: "אחוזת בית",
				en: "Ahuzat Bayit"
			}
		],
		pois: [
			{
				...pth(32.0938, 34.8912),
				r: 28,
				he: "הקניון הגדול",
				en: "HaGadol Mall"
			},
			{
				...pth(32.0884, 34.8636),
				r: 26,
				he: "בילינסון",
				en: "Beilinson"
			},
			{
				...pth(32.0862, 34.885),
				r: 22,
				he: "כיכר המייסדים",
				en: "Founders Square"
			},
			{
				...pth(32.0852, 34.8868),
				r: 22,
				he: "בית הכנסת הגדול",
				en: "Great Synagogue"
			}
		]
	}),
	defineTrack({
		id: "rishon",
		nameHe: "ראשון לציון",
		nameEn: "Rishon LeZion",
		city: "rishon",
		cityHe: "ראשון לציון",
		cityEn: "Rishon LeZion",
		lengthHint: "3 הקפות · היקב",
		description: "רוטשילד, בית הכנסת הגדול, היקב ונחלת יהודה. בהשראת המקום, לא מפה ולא GIS.",
		descriptionEn: "Rothschild, the Great Synagogue, the winery and Nahalat Yehuda. Inspired by the place — not a map, not GIS.",
		image: "/tracks/rishon.jpg",
		width: 20,
		seed: 1882,
		theme: "jaffa",
		ground: 9075300,
		sand: 13943972,
		sky: {
			...TLV_GOLDEN,
			fogDensity: .0014
		},
		checkpointCount: 10,
		points: [
			rsh(31.9645, 34.8028),
			rsh(31.964, 34.8046),
			rsh(31.9632, 34.8064),
			rsh(31.962, 34.8076),
			rsh(31.9632, 34.8088),
			rsh(31.9648, 34.8082),
			rsh(31.966, 34.8066),
			rsh(31.9664, 34.8046),
			rsh(31.9658, 34.803)
		],
		elevation: () => .5,
		streets: [
			{
				from: 0,
				to: .28,
				he: "רוטשילד",
				en: "Rothschild"
			},
			{
				from: .28,
				to: .52,
				he: "הרצל",
				en: "Herzl"
			},
			{
				from: .52,
				to: .76,
				he: "היקב",
				en: "The Winery"
			},
			{
				from: .76,
				to: 1,
				he: "נחלת יהודה",
				en: "Nahalat Yehuda"
			}
		],
		pois: [
			{
				...rsh(31.9626, 34.803),
				r: 28,
				he: "בית הכנסת הגדול",
				en: "Great Synagogue"
			},
			{
				...rsh(31.9608, 34.8086),
				r: 26,
				he: "היקב",
				en: "The Winery"
			},
			{
				...rsh(31.9656, 34.8012),
				r: 22,
				he: "מגדל המים",
				en: "Water Tower"
			}
		]
	}),
	defineTrack({
		id: "ashdod",
		nameHe: "נמל אשדוד",
		nameEn: "Ashdod Port",
		city: "ashdod",
		cityHe: "אשדוד",
		cityEn: "Ashdod",
		lengthHint: "3 הקפות · הרציפים",
		description: "הנמל, המרינה, הרצל ורוגוזין. בהשראת המקום, לא מפה ולא GIS.",
		descriptionEn: "The port, the marina, Herzl and Rogozin. Inspired by the place — not a map, not GIS.",
		image: "/tracks/ashdod.jpg",
		width: 20,
		seed: 1956,
		theme: "port",
		ground: 8025196,
		sand: 13154456,
		sky: {
			...TLV_BLUE,
			fogDensity: .0014
		},
		water: {
			x: asd(31.81, 34.62).x,
			z: asd(31.81, 34.62).z,
			w: 280,
			d: 420,
			color: 1727088
		},
		checkpointCount: 10,
		points: [
			asd(31.821, 34.646),
			asd(31.816, 34.642),
			asd(31.81, 34.638),
			asd(31.805, 34.636),
			asd(31.802, 34.638),
			asd(31.802, 34.644),
			asd(31.806, 34.65),
			asd(31.812, 34.652),
			asd(31.818, 34.651),
			asd(31.822, 34.648)
		],
		elevation: () => .4,
		streets: [
			{
				from: 0,
				to: .28,
				he: "הרציף",
				en: "The Quay"
			},
			{
				from: .28,
				to: .5,
				he: "המרינה",
				en: "The Marina"
			},
			{
				from: .5,
				to: .75,
				he: "הרצל",
				en: "Herzl"
			},
			{
				from: .75,
				to: 1,
				he: "רוגוזין",
				en: "Rogozin"
			}
		],
		pois: [
			{
				...asd(31.8218, 34.6436),
				r: 32,
				he: "נמל אשדוד",
				en: "Ashdod Port"
			},
			{
				...asd(31.804, 34.636),
				r: 26,
				he: "המרינה",
				en: "The Marina"
			},
			{
				...asd(31.806, 34.65),
				r: 24,
				he: "הרצל",
				en: "Herzl"
			}
		]
	}),
	defineTrack({
		id: "ashkelon",
		nameHe: "אשקלון",
		nameEn: "Ashkelon",
		city: "ashkelon",
		cityHe: "אשקלון",
		cityEn: "Ashkelon",
		lengthHint: "3 הקפות · החומות",
		description: "הגן הלאומי, החומות, המרינה וברנע. בהשראת המקום, לא מפה ולא GIS.",
		descriptionEn: "The national park, the walls, the marina and Barnea. Inspired by the place — not a map, not GIS.",
		image: "/tracks/ashkelon.jpg",
		width: 20,
		seed: 1150,
		theme: "stone",
		ground: 10127984,
		sand: 14733488,
		sky: {
			...TLV_GOLDEN,
			fogDensity: .0014
		},
		water: {
			x: ask(31.67, 34.54).x,
			z: ask(31.67, 34.54).z,
			w: 280,
			d: 420,
			color: 1730688
		},
		checkpointCount: 10,
		points: [
			ask(31.679, 34.556),
			ask(31.673, 34.552),
			ask(31.667, 34.549),
			ask(31.662, 34.548),
			ask(31.66, 34.553),
			ask(31.664, 34.56),
			ask(31.67, 34.566),
			ask(31.676, 34.57),
			ask(31.682, 34.568),
			ask(31.682, 34.561)
		],
		elevation: () => .6,
		streets: [
			{
				from: 0,
				to: .28,
				he: "המרינה",
				en: "The Marina"
			},
			{
				from: .28,
				to: .52,
				he: "הגן הלאומי",
				en: "National Park"
			},
			{
				from: .52,
				to: .76,
				he: "ברנע",
				en: "Barnea"
			},
			{
				from: .76,
				to: 1,
				he: "הרצל",
				en: "Herzl"
			}
		],
		pois: [
			{
				...ask(31.679, 34.556),
				r: 28,
				he: "המרינה",
				en: "The Marina"
			},
			{
				...ask(31.662, 34.548),
				r: 28,
				he: "הגן הלאומי",
				en: "National Park"
			},
			{
				...ask(31.682, 34.57),
				r: 24,
				he: "ברנע",
				en: "Barnea"
			}
		]
	}),
	defineTrack({
		id: "scopus",
		nameHe: "הר הצופים",
		nameEn: "Mount Scopus",
		city: "jerusalem",
		cityHe: "ירושלים",
		cityEn: "Jerusalem",
		lengthHint: "עלייה אחת · תצפית לעיר העתיקה",
		description: "מהגבעה הצרפתית עולים לאוניברסיטה ולתצפית — העיר העתיקה למטה, הרי ירושלים מסביב. בהשראת המקום, לא מפה ולא GIS.",
		descriptionEn: "From French Hill up to the university and lookout — Old City below, Jerusalem hills around. Inspired by the place — not a map, not GIS.",
		image: "/tracks/scopus.jpg",
		width: 24,
		seed: 1968,
		theme: "stone",
		open: true,
		ground: 12167305,
		sand: 13351060,
		sky: {
			elevation: 32,
			azimuth: 226,
			turbidity: 3.8,
			rayleigh: 1.35,
			mieCoefficient: .003,
			mieDirectionalG: .74,
			exposure: .82,
			fog: 14207144,
			fogDensity: 18e-5
		},
		checkpointCount: 8,
		points: [
			jer(31.7866, 35.2344),
			jer(31.7882, 35.237),
			jer(31.7896, 35.2396),
			jer(31.789, 35.2422),
			jer(31.7874, 35.2412),
			jer(31.7866, 35.2386),
			jer(31.7884, 35.2378),
			jer(31.7906, 35.24),
			jer(31.7924, 35.2428),
			jer(31.7938, 35.2452),
			jer(31.7928, 35.2466),
			jer(31.7912, 35.2454)
		],
		elevation: (t) => 4 + 78 * Math.pow(t, 1.12),
		streets: [
			{
				from: 0,
				to: .22,
				he: "הגבעה הצרפתית",
				en: "French Hill"
			},
			{
				from: .22,
				to: .48,
				he: "העלייה",
				en: "The Climb"
			},
			{
				from: .48,
				to: .74,
				he: "האוניברסיטה",
				en: "The University"
			},
			{
				from: .74,
				to: 1,
				he: "התצפית",
				en: "The Lookout"
			}
		],
		pois: [
			{
				...jer(31.7866, 35.2344),
				r: 28,
				he: "הגבעה הצרפתית",
				en: "French Hill"
			},
			{
				...jer(31.7934, 35.2442),
				r: 28,
				he: "האוניברסיטה",
				en: "Hebrew University"
			},
			{
				...jer(31.7912, 35.2452),
				r: 32,
				he: "תצפית הר הצופים",
				en: "Scopus Lookout"
			},
			{
				...jer(31.778, 35.2354),
				r: 40,
				he: "העיר העתיקה",
				en: "Old City"
			}
		]
	}),
	defineTrack({
		id: "walls",
		nameHe: "החומות",
		nameEn: "The Walls",
		city: "jerusalem",
		cityHe: "ירושלים",
		cityEn: "Jerusalem",
		lengthHint: "3 הקפות · סביב העיר",
		description: "שער האריות, השער החדש, ציון, האשפות ומגדל דוד מבחוץ. בהשראת המקום, לא מפה ולא GIS.",
		descriptionEn: "Lions' Gate, New Gate, Zion, Dung Gate and the Tower of David from outside. Inspired by the place — not a map, not GIS.",
		image: "/tracks/walls.jpg",
		width: 22,
		seed: 1538,
		theme: "stone",
		ground: 12167305,
		sand: 13351060,
		sky: {
			elevation: 18,
			azimuth: 238,
			turbidity: 6,
			rayleigh: 1.85,
			mieCoefficient: .0044,
			mieDirectionalG: .8,
			exposure: .7,
			fog: 13680800,
			fogDensity: 45e-5
		},
		checkpointCount: 12,
		points: [
			jer(31.7764, 35.2276),
			jer(31.778, 35.2266),
			jer(31.7794, 35.226),
			jer(31.7808, 35.2278),
			jer(31.7817, 35.2304),
			jer(31.7824, 35.2332),
			jer(31.7818, 35.2356),
			jer(31.7808, 35.2368),
			jer(31.7788, 35.237),
			jer(31.7766, 35.2362),
			jer(31.7748, 35.2342),
			jer(31.7736, 35.2316),
			jer(31.7728, 35.2292),
			jer(31.7736, 35.2272),
			jer(31.775, 35.2264)
		],
		elevation: () => 1.6,
		streets: [
			{
				from: 0,
				to: .18,
				he: "שער יפו",
				en: "Jaffa Gate"
			},
			{
				from: .18,
				to: .36,
				he: "השער החדש",
				en: "New Gate"
			},
			{
				from: .36,
				to: .54,
				he: "שער שכם",
				en: "Damascus Gate"
			},
			{
				from: .54,
				to: .72,
				he: "שער האריות",
				en: "Lions' Gate"
			},
			{
				from: .72,
				to: .88,
				he: "שער האשפות",
				en: "Dung Gate"
			},
			{
				from: .88,
				to: 1,
				he: "שער ציון",
				en: "Zion Gate"
			}
		],
		pois: [
			{
				...jer(31.7764, 35.2276),
				r: 28,
				he: "שער יפו",
				en: "Jaffa Gate"
			},
			{
				...jer(31.7808, 35.2368),
				r: 26,
				he: "שער האריות",
				en: "Lions' Gate"
			},
			{
				...jer(31.7748, 35.2342),
				r: 26,
				he: "שער האשפות",
				en: "Dung Gate"
			},
			{
				...jer(31.7728, 35.2292),
				r: 24,
				he: "שער ציון",
				en: "Zion Gate"
			},
			{
				...jer(31.7767, 35.2342),
				r: 30,
				he: "הכותל",
				en: "Western Wall"
			}
		]
	}),
	defineTrack({
		id: "modiin",
		nameHe: "מודיעין · 431",
		nameEn: "Modiin · 431",
		city: "modiin",
		cityHe: "מודיעין",
		cityEn: "Modiin",
		lengthHint: "3 הקפות · היער",
		description: "כביש 431, ענבה, ליגד סנטר והעיר המתוכננת. בהשראת המקום, לא מפה ולא GIS.",
		descriptionEn: "Highway 431, Anabe, Ligad Center and the planned city. Inspired by the place — not a map, not GIS.",
		image: "/tracks/modiin.jpg",
		width: 22,
		seed: 1996,
		theme: "highway",
		ground: 6978136,
		sand: 12103824,
		sky: {
			elevation: 36,
			azimuth: 214,
			turbidity: 3.8,
			rayleigh: 1.3,
			mieCoefficient: .0032,
			mieDirectionalG: .72,
			exposure: .84,
			fog: 13161668,
			fogDensity: .0013
		},
		checkpointCount: 10,
		points: [
			mod(31.887, 34.995),
			mod(31.888, 35.002),
			mod(31.89, 35.008),
			mod(31.893, 35.012),
			mod(31.898, 35.012),
			mod(31.904, 35.008),
			mod(31.906, 35.002),
			mod(31.904, 34.996),
			mod(31.898, 34.992),
			mod(31.892, 34.992)
		],
		elevation: () => 1.2,
		streets: [
			{
				from: 0,
				to: .2,
				he: "כביש 431",
				en: "Route 431"
			},
			{
				from: .2,
				to: .4,
				he: "עמק דותן",
				en: "Emek Dotan"
			},
			{
				from: .4,
				to: .6,
				he: "ליגד",
				en: "Ligad"
			},
			{
				from: .6,
				to: .8,
				he: "ענבה",
				en: "Anabe"
			},
			{
				from: .8,
				to: 1,
				he: "היער",
				en: "The Forest"
			}
		],
		pois: [
			{
				...mod(31.887, 34.995),
				r: 28,
				he: "431",
				en: "Route 431"
			},
			{
				...mod(31.89, 35.01),
				r: 26,
				he: "ליגד סנטר",
				en: "Ligad Center"
			},
			{
				...mod(31.905, 35),
				r: 30,
				he: "פארק ענבה",
				en: "Anabe Park"
			}
		]
	}),
	defineTrack({
		id: "ramon",
		nameHe: "מכתש רמון · הירידה",
		nameEn: "Ramon Crater Descent",
		city: "negev",
		cityHe: "נגב",
		cityEn: "Negev",
		lengthHint: "ירידה אחת · מהתצפית לרצפה",
		description: "מהתצפית במצפה רמון, סרפנטינות במצוק, עד רצפת המכתש. בלי בניינים — רק מדבר. בהשראת המקום, לא מפה ולא GIS.",
		descriptionEn: "From the Mitzpe Ramon lookout, switchbacks down the cliff, to the crater floor. Desert only. Inspired by the place — not a map, not GIS.",
		image: "/tracks/ramon.jpg",
		width: 26,
		seed: 1956,
		theme: "desert",
		open: true,
		ground: 11565650,
		sand: 13934704,
		sky: {
			elevation: 52,
			azimuth: 204,
			turbidity: 8.2,
			rayleigh: 1.2,
			mieCoefficient: .0068,
			mieDirectionalG: .7,
			exposure: .82,
			fog: 14731428,
			fogDensity: 28e-5
		},
		checkpointCount: 8,
		points: [
			ram(30.6132, 34.801),
			ram(30.612, 34.8042),
			ram(30.6106, 34.8074),
			ram(30.6088, 34.8092),
			ram(30.6064, 34.8078),
			ram(30.6052, 34.8048),
			ram(30.6066, 34.8018),
			ram(30.6042, 34.8002),
			ram(30.6014, 34.8026),
			ram(30.5992, 34.806),
			ram(30.5964, 34.8044),
			ram(30.5938, 34.801),
			ram(30.5904, 34.7992),
			ram(30.5872, 34.8024),
			ram(30.584, 34.8058),
			ram(30.5802, 34.8038),
			ram(30.5764, 34.8002),
			ram(30.5722, 34.7974)
		],
		elevation: (t) => {
			if (t < .08) return 168;
			if (t > .9) return 1.2;
			const u = (t - .08) / .82;
			return 168 * Math.pow(1 - u, 1.18) + 1.2;
		},
		streets: [
			{
				from: 0,
				to: .14,
				he: "התצפית",
				en: "The Lookout"
			},
			{
				from: .14,
				to: .32,
				he: "שפת המכתש",
				en: "Crater Rim"
			},
			{
				from: .32,
				to: .62,
				he: "הסרפנטינות",
				en: "Switchbacks"
			},
			{
				from: .62,
				to: .82,
				he: "נחל רמון",
				en: "Nahal Ramon"
			},
			{
				from: .82,
				to: 1,
				he: "רצפת המכתש",
				en: "Crater Floor"
			}
		],
		pois: [
			{
				...ram(30.6132, 34.801),
				r: 32,
				he: "התצפית",
				en: "The Lookout"
			},
			{
				...ram(30.6088, 34.8092),
				r: 36,
				he: "שפת המכתש",
				en: "Crater Rim"
			},
			{
				...ram(30.5992, 34.806),
				r: 32,
				he: "הסרפנטינות",
				en: "Switchbacks"
			},
			{
				...ram(30.5722, 34.7974),
				r: 40,
				he: "רצפת המכתש",
				en: "Crater Floor"
			}
		]
	}),
	defineTrack({
		id: "hw40",
		nameHe: "כביש 40",
		nameEn: "Highway 40",
		city: "negev",
		cityHe: "נגב",
		cityEn: "Negev",
		lengthHint: "3 הקפות · שדה בוקר",
		description: "שדה בוקר, קבר בן גוריון, עבדת וחולות. בהשראת המקום, לא מפה ולא GIS.",
		descriptionEn: "Sde Boker, Ben-Gurion's tomb, Avdat and the dunes. Inspired by the place — not a map, not GIS.",
		image: "/tracks/hw40.jpg",
		width: 22,
		seed: 40,
		theme: "desert",
		ground: 12886128,
		sand: 15258792,
		sky: {
			elevation: 52,
			azimuth: 198,
			turbidity: 9,
			rayleigh: 1.1,
			mieCoefficient: .0072,
			mieDirectionalG: .66,
			exposure: .82,
			fog: 15259828,
			fogDensity: .0013
		},
		checkpointCount: 10,
		points: [
			hwy40(30.874, 34.793),
			hwy40(30.862, 34.788),
			hwy40(30.848, 34.782),
			hwy40(30.832, 34.778),
			hwy40(30.812, 34.775),
			hwy40(30.796, 34.773),
			hwy40(30.794, 34.78),
			hwy40(30.81, 34.784),
			hwy40(30.828, 34.788),
			hwy40(30.848, 34.792),
			hwy40(30.866, 34.796)
		],
		elevation: () => 1.4,
		streets: [
			{
				from: 0,
				to: .2,
				he: "שדה בוקר",
				en: "Sde Boker"
			},
			{
				from: .2,
				to: .4,
				he: "קבר בן גוריון",
				en: "Ben-Gurion Tomb"
			},
			{
				from: .4,
				to: .6,
				he: "עבדת",
				en: "Avdat"
			},
			{
				from: .6,
				to: .8,
				he: "כביש 40",
				en: "Route 40"
			},
			{
				from: .8,
				to: 1,
				he: "החולות",
				en: "The Dunes"
			}
		],
		pois: [
			{
				...hwy40(30.874, 34.793),
				r: 28,
				he: "שדה בוקר",
				en: "Sde Boker"
			},
			{
				...hwy40(30.847, 34.781),
				r: 26,
				he: "קבר בן גוריון",
				en: "Ben-Gurion Tomb"
			},
			{
				...hwy40(30.794, 34.773),
				r: 28,
				he: "עבדת",
				en: "Avdat"
			}
		]
	}),
	defineTrack({
		id: "eilatmtn",
		nameHe: "הרי אילת",
		nameEn: "Eilat Mountains",
		city: "eilat",
		cityHe: "אילת",
		cityEn: "Eilat",
		lengthHint: "3 הקפות · הגרניט",
		description: "מעבר הרים, שונית אלמוג מבט, נחל שלמה והאדום. בהשראת המקום, לא מפה ולא GIS.",
		descriptionEn: "The mountain pass, Coral Beach view, Nahal Shlomo and the red rock. Inspired by the place — not a map, not GIS.",
		image: "/tracks/eilatmtn.jpg",
		width: 20,
		seed: 1951,
		theme: "desert",
		ground: 10771002,
		sand: 13138e3,
		sky: {
			elevation: 12,
			azimuth: 248,
			turbidity: 7.4,
			rayleigh: 1.7,
			mieCoefficient: .0058,
			mieDirectionalG: .84,
			exposure: .78,
			fog: 12882032,
			fogDensity: .0014
		},
		water: {
			x: eil(29.51, 34.91).x,
			z: eil(29.51, 34.91).z,
			w: 280,
			d: 200,
			color: 682632
		},
		checkpointCount: 10,
		points: [
			eil(29.558, 34.932),
			eil(29.552, 34.926),
			eil(29.546, 34.92),
			eil(29.538, 34.916),
			eil(29.528, 34.916),
			eil(29.52, 34.918),
			eil(29.518, 34.924),
			eil(29.526, 34.928),
			eil(29.536, 34.93),
			eil(29.548, 34.932),
			eil(29.556, 34.934)
		],
		elevation: (t) => 1.5 + 12 * Math.exp(-(((t - .35) / .18) ** 2)),
		streets: [
			{
				from: 0,
				to: .2,
				he: "נחל שלמה",
				en: "Nahal Shlomo"
			},
			{
				from: .2,
				to: .42,
				he: "המעבר",
				en: "The Pass"
			},
			{
				from: .42,
				to: .62,
				he: "הרי אילת",
				en: "Eilat Mountains"
			},
			{
				from: .62,
				to: .82,
				he: "שונית אלמוג",
				en: "Coral Beach"
			},
			{
				from: .82,
				to: 1,
				he: "הירידה",
				en: "The Descent"
			}
		],
		pois: [
			{
				...eil(29.558, 34.932),
				r: 26,
				he: "נחל שלמה",
				en: "Nahal Shlomo"
			},
			{
				...eil(29.545, 34.918),
				r: 26,
				he: "המעבר",
				en: "The Pass"
			},
			{
				...eil(29.51, 34.918),
				r: 28,
				he: "שונית אלמוג",
				en: "Coral Beach"
			}
		]
	}),
	defineTrack({
		id: "gushdan",
		nameHe: "גוש דן פתוח",
		nameEn: "Gush Dan Open",
		city: "telaviv",
		cityHe: "תל אביב",
		cityEn: "Tel Aviv",
		lengthHint: "נסיעה אחת · יפו עד הרצליה",
		description: "יפו, הטיילת, רידינג, הנמל והרצליה — מסלול פתוח לאורך החוף. בהשראת המקום, לא מפה ולא GIS.",
		descriptionEn: "Jaffa to Herzliya along the coast — one way, no loop. Inspired by the place — not a map, not GIS.",
		image: "/tracks/gushdan.jpg",
		width: 26,
		seed: 1909,
		theme: "bauhaus",
		open: true,
		ground: 8026736,
		sand: 13945008,
		sky: {
			...TLV_GOLDEN,
			fogDensity: 7e-4
		},
		water: {
			x: tlv(32.11, 34.748).x,
			z: tlv(32.11, 34.748).z,
			w: 420,
			d: 1800,
			color: 1730688
		},
		checkpointCount: 12,
		points: [
			tlv(32.0546, 34.7564),
			tlv(32.0608, 34.7608),
			tlv(32.0674, 34.7642),
			tlv(32.0742, 34.767),
			tlv(32.0816, 34.7696),
			tlv(32.0892, 34.7718),
			tlv(32.0964, 34.7742),
			tlv(32.1038, 34.7786),
			tlv(32.1122, 34.7834),
			tlv(32.122, 34.7882),
			tlv(32.1324, 34.7916),
			tlv(32.143, 34.7942),
			tlv(32.1536, 34.7964),
			tlv(32.1618, 34.7976),
			tlv(32.1662, 34.8008)
		],
		elevation: () => .5,
		streets: [
			{
				from: 0,
				to: .14,
				he: "יפו",
				en: "Jaffa"
			},
			{
				from: .14,
				to: .28,
				he: "הטיילת",
				en: "The Promenade"
			},
			{
				from: .28,
				to: .42,
				he: "רוטשילד",
				en: "Rothschild"
			},
			{
				from: .42,
				to: .56,
				he: "עזריאלי",
				en: "Azrieli"
			},
			{
				from: .56,
				to: .7,
				he: "דיזנגוף",
				en: "Dizengoff"
			},
			{
				from: .7,
				to: .84,
				he: "הנמל",
				en: "The Port"
			},
			{
				from: .84,
				to: 1,
				he: "הרצליה",
				en: "Herzliya"
			}
		],
		pois: [
			{
				...tlv(32.0547, 34.7556),
				r: 36,
				he: "מגדל השעון יפו",
				en: "Jaffa Clock Tower"
			},
			{
				...tlv(32.0893, 34.7732),
				r: 32,
				he: "הילטון",
				en: "Hilton"
			},
			{
				...tlv(32.1035, 34.7788),
				r: 36,
				he: "רידינג",
				en: "Reading"
			},
			{
				...tlv(32.0968, 34.7735),
				r: 30,
				he: "נמל תל אביב",
				en: "Tel Aviv Port"
			},
			{
				...tlv(32.1635, 34.7965),
				r: 34,
				he: "מרינה הרצליה",
				en: "Herzliya Marina"
			}
		]
	}),
	defineTrack({
		id: "nazareth",
		nameHe: "נצרת",
		nameEn: "Nazareth",
		city: "galilee",
		cityHe: "גליל",
		cityEn: "Galilee",
		lengthHint: "3 הקפות · העיר העתיקה",
		description: "כנסית הבשורה, השוק, הר הקפיצה וסמטאות האבן. בהשראת המקום, לא מפה ולא GIS.",
		descriptionEn: "Basilica of the Annunciation, the souq, Mount Precipice and stone alleys. Inspired by the place — not a map, not GIS.",
		image: "/tracks/nazareth.jpg",
		width: 20,
		seed: 1966,
		theme: "stone",
		ground: 9075304,
		sand: 13943976,
		sky: {
			elevation: 18,
			azimuth: 232,
			turbidity: 4.8,
			rayleigh: 1.45,
			mieCoefficient: .004,
			mieDirectionalG: .8,
			exposure: .74,
			fog: 13154464,
			fogDensity: .0015
		},
		checkpointCount: 10,
		points: [
			naz(32.7022, 35.2976),
			naz(32.7036, 35.2966),
			naz(32.7054, 35.2968),
			naz(32.7064, 35.2984),
			naz(32.7058, 35.3002),
			naz(32.7042, 35.3012),
			naz(32.7024, 35.301),
			naz(32.7008, 35.2998),
			naz(32.7004, 35.298),
			naz(32.7012, 35.2972)
		],
		elevation: () => 2.8,
		streets: [
			{
				from: 0,
				to: .28,
				he: "הבשורה",
				en: "Annunciation"
			},
			{
				from: .28,
				to: .52,
				he: "מעיין מרים",
				en: "Mary's Well"
			},
			{
				from: .52,
				to: .76,
				he: "השוק",
				en: "The Souq"
			},
			{
				from: .76,
				to: 1,
				he: "העיר העתיקה",
				en: "Old City"
			}
		],
		pois: [
			{
				...naz(32.7014, 35.2962),
				r: 28,
				he: "כנסית הבשורה",
				en: "Annunciation"
			},
			{
				...naz(32.7068, 35.2972),
				r: 24,
				he: "מעיין מרים",
				en: "Mary's Well"
			},
			{
				...naz(32.697, 35.288),
				r: 28,
				he: "הר הקפיצה",
				en: "Mount Precipice"
			}
		]
	}),
	defineTrack({
		id: "tzfat",
		nameHe: "צפת",
		nameEn: "Safed",
		city: "galilee",
		cityHe: "גליל",
		cityEn: "Galilee",
		lengthHint: "3 הקפות · ההר",
		description: "המצודה, בתי כנסת כחולים, רובע האמנים והנוף לגליל. בהשראת המקום, לא מפה ולא GIS.",
		descriptionEn: "The citadel, blue synagogues, the artists' quarter and the Galilee view. Inspired by the place — not a map, not GIS.",
		image: "/tracks/tzfat.jpg",
		width: 20,
		seed: 1480,
		theme: "stone",
		ground: 8024164,
		sand: 13154456,
		sky: {
			elevation: 8.5,
			azimuth: 248,
			turbidity: 6.2,
			rayleigh: 1.7,
			mieCoefficient: .0052,
			mieDirectionalG: .86,
			exposure: .72,
			fog: 9075308,
			fogDensity: .0015
		},
		checkpointCount: 10,
		points: [
			tzf(32.967, 35.495),
			tzf(32.9682, 35.4936),
			tzf(32.9676, 35.4918),
			tzf(32.9658, 35.4912),
			tzf(32.9642, 35.4922),
			tzf(32.9632, 35.4942),
			tzf(32.9638, 35.4962),
			tzf(32.9654, 35.497),
			tzf(32.9668, 35.4964)
		],
		elevation: () => 1.8,
		streets: [
			{
				from: 0,
				to: .25,
				he: "המצודה",
				en: "The Citadel"
			},
			{
				from: .25,
				to: .5,
				he: "העיר העתיקה",
				en: "Old City"
			},
			{
				from: .5,
				to: .75,
				he: "רובע האמנים",
				en: "Artists' Quarter"
			},
			{
				from: .75,
				to: 1,
				he: "בית הכנסת הארי",
				en: "Ari Synagogue"
			}
		],
		pois: [
			{
				...tzf(32.9688, 35.4972),
				r: 26,
				he: "המצודה",
				en: "Citadel"
			},
			{
				...tzf(32.9688, 35.4914),
				r: 22,
				he: "בית הכנסת הארי",
				en: "Ari Synagogue"
			},
			{
				...tzf(32.9692, 35.4926),
				r: 20,
				he: "אבוהב",
				en: "Abuhav Synagogue"
			},
			{
				...tzf(32.9652, 35.4908),
				r: 24,
				he: "העיר העתיקה",
				en: "Old City"
			}
		]
	}),
	defineTrack({
		id: "masada",
		nameHe: "מצדה",
		nameEn: "Masada",
		city: "deadsea",
		cityHe: "ים המלח",
		cityEn: "Dead Sea",
		lengthHint: "נסיעה אחת · שביל הנחש",
		description: "מהמבקרים בשביל הנחש עד המצודה — עלייה אחת, צוק ומדבר. בהשראת המקום, לא מפה ולא GIS.",
		descriptionEn: "From the visitor center up the snake path to the fortress — one climb. Inspired by the place — not a map, not GIS.",
		image: "/tracks/masada.jpg",
		width: 20,
		seed: 73,
		theme: "desert",
		open: true,
		ground: 10518616,
		sand: 14205072,
		sky: {
			elevation: 22,
			azimuth: 118,
			turbidity: 5.4,
			rayleigh: 1.35,
			mieCoefficient: .0044,
			mieDirectionalG: .78,
			exposure: .76,
			fog: 13943968,
			fogDensity: .0014
		},
		water: {
			x: mas(31.315, 35.382).x,
			z: mas(31.315, 35.382).z,
			w: 180,
			d: 420,
			color: 2787480
		},
		checkpointCount: 7,
		points: [
			mas(31.311, 35.363),
			mas(31.3116, 35.3604),
			mas(31.3124, 35.3578),
			mas(31.3134, 35.3556),
			mas(31.3148, 35.3542),
			mas(31.316, 35.3534)
		],
		elevation: (t) => 2 + 48 * Math.pow(t, 1.2),
		streets: [
			{
				from: 0,
				to: .28,
				he: "כביש 90",
				en: "Route 90"
			},
			{
				from: .28,
				to: .55,
				he: "שביל הנחש",
				en: "Snake Path"
			},
			{
				from: .55,
				to: .8,
				he: "המצודה",
				en: "The Fortress"
			},
			{
				from: .8,
				to: 1,
				he: "רמפה",
				en: "Ramp"
			}
		],
		pois: [
			{
				...mas(31.3157, 35.3538),
				r: 28,
				he: "מצדה",
				en: "Masada"
			},
			{
				...mas(31.3172, 35.3536),
				r: 24,
				he: "הארמון הצפוני",
				en: "Northern Palace"
			},
			{
				...mas(31.313, 35.3555),
				r: 26,
				he: "שביל הנחש",
				en: "Snake Path"
			},
			{
				...mas(31.311, 35.363),
				r: 24,
				he: "מרכז המבקרים",
				en: "Visitor Center"
			}
		]
	}),
	defineTrack({
		id: "batyam",
		nameHe: "בת ים",
		nameEn: "Bat Yam",
		city: "telaviv",
		cityHe: "תל אביב",
		cityEn: "Tel Aviv",
		lengthHint: "3 הקפות · הטיילת",
		description: "טיילת בת ים, החוף הרחב, המלונות ויפו באופק. בהשראת המקום, לא מפה ולא GIS.",
		descriptionEn: "Bat Yam promenade, the wide beach, hotels and Jaffa on the horizon. Inspired by the place — not a map, not GIS.",
		image: "/tracks/batyam.jpg",
		width: 20,
		seed: 1958,
		theme: "bauhaus",
		ground: 9078392,
		sand: 14865588,
		sky: {
			...TLV_GOLDEN,
			fogDensity: .0014
		},
		water: {
			x: bym(32.015, 34.73).x,
			z: bym(32.015, 34.73).z,
			w: 220,
			d: 380,
			color: 1730688
		},
		checkpointCount: 10,
		points: [
			bym(32.02, 34.739),
			bym(32.016, 34.738),
			bym(32.012, 34.7375),
			bym(32.008, 34.737),
			bym(32.005, 34.7385),
			bym(32.006, 34.743),
			bym(32.01, 34.746),
			bym(32.014, 34.747),
			bym(32.018, 34.746),
			bym(32.021, 34.743)
		],
		elevation: () => .4,
		streets: [
			{
				from: 0,
				to: .22,
				he: "טיילת בת ים",
				en: "Bat Yam Promenade"
			},
			{
				from: .22,
				to: .44,
				he: "בן גוריון",
				en: "Ben Gurion"
			},
			{
				from: .44,
				to: .66,
				he: "החוף",
				en: "The Beach"
			},
			{
				from: .66,
				to: .84,
				he: "המרינה",
				en: "The Marina"
			},
			{
				from: .84,
				to: 1,
				he: "לעבר יפו",
				en: "Toward Jaffa"
			}
		],
		pois: [
			{
				...bym(32.0164, 34.7364),
				r: 28,
				he: "לאונרדו",
				en: "Leonardo"
			},
			{
				...bym(32.0192, 34.7368),
				r: 24,
				he: "ארמון ים",
				en: "Armon Yam"
			},
			{
				...bym(32.007, 34.737),
				r: 26,
				he: "החוף",
				en: "The Beach"
			}
		]
	}),
	defineTrack({
		id: "rehovot",
		nameHe: "רחובות",
		nameEn: "Rehovot",
		city: "rehovot",
		cityHe: "רחובות",
		cityEn: "Rehovot",
		lengthHint: "3 הקפות · הרצל",
		description: "מכון ויצמן, בית ויצמן, רחוב הרצל ופארק המדע. בהשראת המקום, לא מפה ולא GIS.",
		descriptionEn: "Weizmann Institute, Weizmann House, Herzl Street and the science park. Inspired by the place — not a map, not GIS.",
		image: "/tracks/rehovot.jpg",
		width: 20,
		seed: 1934,
		theme: "bauhaus",
		ground: 6978136,
		sand: 13155480,
		sky: {
			...TLV_GOLDEN,
			fogDensity: .0014
		},
		checkpointCount: 10,
		points: [
			rhv(31.894, 34.808),
			rhv(31.898, 34.811),
			rhv(31.902, 34.814),
			rhv(31.906, 34.817),
			rhv(31.908, 34.82),
			rhv(31.91, 34.816),
			rhv(31.908, 34.811),
			rhv(31.904, 34.807),
			rhv(31.9, 34.804),
			rhv(31.896, 34.804),
			rhv(31.893, 34.806)
		],
		elevation: () => .7,
		streets: [
			{
				from: 0,
				to: .22,
				he: "הרצל",
				en: "Herzl"
			},
			{
				from: .22,
				to: .46,
				he: "ויצמן",
				en: "Weizmann"
			},
			{
				from: .46,
				to: .68,
				he: "פארק המדע",
				en: "Science Park"
			},
			{
				from: .68,
				to: .86,
				he: "ביל״ו",
				en: "Bilu"
			},
			{
				from: .86,
				to: 1,
				he: "המעבדות",
				en: "The Labs"
			}
		],
		pois: [
			{
				...rhv(31.896, 34.808),
				r: 26,
				he: "הרצל",
				en: "Herzl"
			},
			{
				...rhv(31.9072, 34.8194),
				r: 28,
				he: "בית ויצמן",
				en: "Weizmann House"
			},
			{
				...rhv(31.9076, 34.8092),
				r: 26,
				he: "מאיץ קפלר",
				en: "Koffler Accelerator"
			}
		]
	}),
	defineTrack({
		id: "nahariya",
		nameHe: "נהריה",
		nameEn: "Nahariya",
		city: "galilee",
		cityHe: "גליל",
		cityEn: "Galilee",
		lengthHint: "3 הקפות · הגעתון",
		description: "תעלת הגעתון, הטיילת, החוף והדרך לראש הנקרה. בהשראת המקום, לא מפה ולא GIS.",
		descriptionEn: "The Gaaton canal, the promenade, the beach and the road to Rosh Hanikra. Inspired by the place — not a map, not GIS.",
		image: "/tracks/nahariya.jpg",
		width: 20,
		seed: 1947,
		theme: "bauhaus",
		ground: 8026728,
		sand: 14734516,
		sky: {
			...TLV_GOLDEN,
			fogDensity: .0014
		},
		water: {
			x: nah(33.006, 35.086).x,
			z: nah(33.006, 35.086).z,
			w: 200,
			d: 360,
			color: 2783888
		},
		checkpointCount: 10,
		points: [
			nah(33.006, 35.094),
			nah(33.007, 35.091),
			nah(33.008, 35.089),
			nah(33.01, 35.088),
			nah(33.012, 35.09),
			nah(33.011, 35.094),
			nah(33.009, 35.097),
			nah(33.006, 35.098),
			nah(33.004, 35.096),
			nah(33.004, 35.094)
		],
		elevation: () => .4,
		streets: [
			{
				from: 0,
				to: .22,
				he: "הגעתון",
				en: "Gaaton"
			},
			{
				from: .22,
				to: .44,
				he: "הטיילת",
				en: "The Promenade"
			},
			{
				from: .44,
				to: .66,
				he: "החוף",
				en: "The Beach"
			},
			{
				from: .66,
				to: .84,
				he: "סוקולוב",
				en: "Sokolov"
			},
			{
				from: .84,
				to: 1,
				he: "לנקרה",
				en: "Toward Hanikra"
			}
		],
		pois: [
			{
				...nah(33.0064, 35.0924),
				r: 26,
				he: "הגעתון",
				en: "Gaaton"
			},
			{
				...nah(33.0104, 35.0854),
				r: 24,
				he: "הטיילת",
				en: "Promenade"
			},
			{
				...nah(33.009, 35.097),
				r: 24,
				he: "סוקולוב",
				en: "Sokolov"
			}
		]
	}),
	defineTrack({
		id: "ramla",
		nameHe: "רמלה",
		nameEn: "Ramla",
		city: "ramla",
		cityHe: "רמלה",
		cityEn: "Ramla",
		lengthHint: "3 הקפות · העיר העתיקה",
		description: "המגדל הלבן, השוק, המסגד הגדול ובריכת הקשתות. בהשראת המקום, לא מפה ולא GIS.",
		descriptionEn: "The White Tower, the market, the Great Mosque and the Pool of Arches. Inspired by the place — not a map, not GIS.",
		image: "/tracks/ramla.jpg",
		width: 20,
		seed: 716,
		theme: "stone",
		ground: 9075300,
		sand: 13943972,
		sky: {
			...TLV_GOLDEN,
			fogDensity: .0014
		},
		checkpointCount: 10,
		points: [
			rml(31.931, 34.863),
			rml(31.929, 34.866),
			rml(31.927, 34.868),
			rml(31.925, 34.867),
			rml(31.924, 34.864),
			rml(31.925, 34.861),
			rml(31.927, 34.859),
			rml(31.93, 34.86),
			rml(31.9315, 34.862)
		],
		elevation: () => .8,
		streets: [
			{
				from: 0,
				to: .22,
				he: "המגדל הלבן",
				en: "White Tower"
			},
			{
				from: .22,
				to: .46,
				he: "השוק",
				en: "The Market"
			},
			{
				from: .46,
				to: .68,
				he: "המסגד הגדול",
				en: "Great Mosque"
			},
			{
				from: .68,
				to: .86,
				he: "הקשתות",
				en: "The Arches"
			},
			{
				from: .86,
				to: 1,
				he: "הרצל",
				en: "Herzl"
			}
		],
		pois: [
			{
				...rml(31.9304, 34.8676),
				r: 26,
				he: "המגדל הלבן",
				en: "White Tower"
			},
			{
				...rml(31.9266, 34.8684),
				r: 24,
				he: "המסגד הגדול",
				en: "Great Mosque"
			},
			{
				...rml(31.9264, 34.8596),
				r: 24,
				he: "בריכת הקשתות",
				en: "Pool of Arches"
			}
		]
	}),
	defineTrack({
		id: "holon",
		nameHe: "חולון",
		nameEn: "Holon",
		city: "telaviv",
		cityHe: "תל אביב",
		cityEn: "Tel Aviv",
		lengthHint: "3 הקפות · העיר",
		description: "מוזיאון העיצוב, פארק פרס, סוקולוב והדרך לבת ים. בהשראת המקום, לא מפה ולא GIS.",
		descriptionEn: "Design Museum, Peres Park, Sokolov and the road to Bat Yam. Inspired by the place — not a map, not GIS.",
		image: "/tracks/holon.jpg",
		width: 20,
		seed: 1940,
		theme: "bauhaus",
		ground: 8026734,
		sand: 14208176,
		sky: {
			...TLV_GOLDEN,
			fogDensity: .0014
		},
		checkpointCount: 10,
		points: [
			hol(32.007, 34.779),
			hol(32.011, 34.776),
			hol(32.016, 34.773),
			hol(32.02, 34.772),
			hol(32.02, 34.777),
			hol(32.017, 34.782),
			hol(32.012, 34.787),
			hol(32.007, 34.79),
			hol(32.003, 34.787),
			hol(32.004, 34.782)
		],
		elevation: () => .5,
		streets: [
			{
				from: 0,
				to: .22,
				he: "מוזיאון העיצוב",
				en: "Design Museum"
			},
			{
				from: .22,
				to: .44,
				he: "סוקולוב",
				en: "Sokolov"
			},
			{
				from: .44,
				to: .66,
				he: "פארק פרס",
				en: "Peres Park"
			},
			{
				from: .66,
				to: .84,
				he: "חנקין",
				en: "Hankin"
			},
			{
				from: .84,
				to: 1,
				he: "לבת ים",
				en: "Toward Bat Yam"
			}
		],
		pois: [
			{
				...hol(32.0062, 34.7814),
				r: 26,
				he: "מוזיאון העיצוב",
				en: "Design Museum"
			},
			{
				...hol(32.018, 34.772),
				r: 24,
				he: "סוקולוב",
				en: "Sokolov"
			},
			{
				...hol(32.0042, 34.7886),
				r: 26,
				he: "פארק פרס",
				en: "Peres Park"
			}
		]
	}),
	defineTrack({
		id: "beitshan",
		nameHe: "בית שאן",
		nameEn: "Beit Shean",
		city: "kinneret",
		cityHe: "כנרת",
		cityEn: "Kinneret",
		lengthHint: "3 הקפות · הגן הלאומי",
		description: "התיאטרון הרומי, הקארדו, העמודים והגלבוע. בהשראת המקום, לא מפה ולא GIS.",
		descriptionEn: "The Roman theatre, the cardo, columns and Mount Gilboa. Inspired by the place — not a map, not GIS.",
		image: "/tracks/beitshan.jpg",
		width: 20,
		seed: 63,
		theme: "stone",
		ground: 10127978,
		sand: 14207136,
		sky: {
			...TLV_GOLDEN,
			fogDensity: .0014
		},
		checkpointCount: 10,
		points: [
			bsn(32.503, 35.502),
			bsn(32.505, 35.506),
			bsn(32.507, 35.51),
			bsn(32.506, 35.514),
			bsn(32.502, 35.516),
			bsn(32.498, 35.514),
			bsn(32.496, 35.51),
			bsn(32.497, 35.505),
			bsn(32.5, 35.502)
		],
		elevation: () => .6,
		streets: [
			{
				from: 0,
				to: .24,
				he: "התיאטרון",
				en: "The Theatre"
			},
			{
				from: .24,
				to: .48,
				he: "הקארדו",
				en: "The Cardo"
			},
			{
				from: .48,
				to: .7,
				he: "העמודים",
				en: "The Columns"
			},
			{
				from: .7,
				to: .88,
				he: "שאול המלך",
				en: "King Saul"
			},
			{
				from: .88,
				to: 1,
				he: "הגלבוע",
				en: "Gilboa"
			}
		],
		pois: [
			{
				...bsn(32.5016, 35.5004),
				r: 28,
				he: "התיאטרון",
				en: "Theatre"
			},
			{
				...bsn(32.504, 35.508),
				r: 24,
				he: "הקארדו",
				en: "Cardo"
			},
			{
				...bsn(32.49, 35.42),
				r: 32,
				he: "הגלבוע",
				en: "Gilboa"
			}
		]
	}),
	defineTrack({
		id: "hadera",
		nameHe: "חדרה",
		nameEn: "Hadera",
		city: "highway",
		cityHe: "כבישים",
		cityEn: "Highways",
		lengthHint: "3 הקפות · החוף",
		description: "אורות רבין, הארובות, כביש 4 והחוף. בהשראת המקום, לא מפה ולא GIS.",
		descriptionEn: "Orot Rabin, the chimneys, Highway 4 and the beach. Inspired by the place — not a map, not GIS.",
		image: "/tracks/hadera.jpg",
		width: 20,
		seed: 1891,
		theme: "highway",
		ground: 9077868,
		sand: 14734512,
		sky: {
			...TLV_GOLDEN,
			fogDensity: .0014
		},
		water: {
			x: hdr(32.44, 34.875).x,
			z: hdr(32.44, 34.875).z,
			w: 240,
			d: 400,
			color: 1730688
		},
		checkpointCount: 10,
		points: [
			hdr(32.47, 34.888),
			hdr(32.46, 34.884),
			hdr(32.45, 34.88),
			hdr(32.44, 34.878),
			hdr(32.43, 34.882),
			hdr(32.432, 34.892),
			hdr(32.44, 34.9),
			hdr(32.45, 34.906),
			hdr(32.46, 34.904),
			hdr(32.468, 34.896)
		],
		elevation: () => .5,
		streets: [
			{
				from: 0,
				to: .22,
				he: "אורות רבין",
				en: "Orot Rabin"
			},
			{
				from: .22,
				to: .44,
				he: "כביש 4",
				en: "Highway 4"
			},
			{
				from: .44,
				to: .66,
				he: "החוף",
				en: "The Beach"
			},
			{
				from: .66,
				to: .84,
				he: "הבילויים",
				en: "Habibluim"
			},
			{
				from: .84,
				to: 1,
				he: "גבעת אולגה",
				en: "Givat Olga"
			}
		],
		pois: [
			{
				...hdr(32.4684, 34.8822),
				r: 32,
				he: "אורות רבין",
				en: "Orot Rabin"
			},
			{
				...hdr(32.44, 34.9),
				r: 24,
				he: "כביש 4",
				en: "Highway 4"
			},
			{
				...hdr(32.44, 34.878),
				r: 26,
				he: "החוף",
				en: "The Beach"
			}
		]
	}),
	defineTrack({
		id: "lod",
		nameHe: "לוד · נתב״ג",
		nameEn: "Lod · Ben Gurion",
		city: "ramla",
		cityHe: "רמלה",
		cityEn: "Ramla",
		lengthHint: "3 הקפות · הנמל",
		description: "מגדל הפיקוח, הטרמינל, כביש 1 והעיר העתיקה. בהשראת המקום, לא מפה ולא GIS.",
		descriptionEn: "The control tower, the terminal, Highway 1 and the old city. Inspired by the place — not a map, not GIS.",
		image: "/tracks/lod.jpg",
		width: 22,
		seed: 1950,
		theme: "highway",
		ground: 8026736,
		sand: 13155484,
		sky: {
			...TLV_GOLDEN,
			fogDensity: .0014
		},
		checkpointCount: 10,
		points: [
			lodp(31.999, 34.87),
			lodp(31.99, 34.875),
			lodp(31.98, 34.88),
			lodp(31.97, 34.886),
			lodp(31.958, 34.89),
			lodp(31.952, 34.888),
			lodp(31.954, 34.882),
			lodp(31.964, 34.876),
			lodp(31.976, 34.872),
			lodp(31.988, 34.868),
			lodp(31.996, 34.867)
		],
		elevation: () => .5,
		streets: [
			{
				from: 0,
				to: .24,
				he: "נתב״ג",
				en: "Ben Gurion"
			},
			{
				from: .24,
				to: .46,
				he: "כביש 1",
				en: "Highway 1"
			},
			{
				from: .46,
				to: .68,
				he: "הטרמינל",
				en: "The Terminal"
			},
			{
				from: .68,
				to: .86,
				he: "ג׳ורג׳ חליל",
				en: "George Khalil"
			},
			{
				from: .86,
				to: 1,
				he: "העיר העתיקה",
				en: "Old City"
			}
		],
		pois: [
			{
				...lodp(31.9764, 34.8852),
				r: 32,
				he: "נתב״ג",
				en: "Ben Gurion"
			},
			{
				...lodp(31.9528, 34.8904),
				r: 26,
				he: "כנסית ג׳ורג׳",
				en: "St. George"
			},
			{
				...lodp(31.97, 34.886),
				r: 24,
				he: "כביש 1",
				en: "Highway 1"
			}
		]
	}),
	defineTrack({
		id: "kshmona",
		nameHe: "קרית שמונה",
		nameEn: "Kiryat Shmona",
		city: "galilee",
		cityHe: "גליל",
		cityEn: "Galilee",
		lengthHint: "3 הקפות · הצפון",
		description: "עמק החולה, כביש 90, הרי נפתלי ותל חי. בהשראת המקום, לא מפה ולא GIS.",
		descriptionEn: "Hula Valley, Highway 90, Naftali mountains and Tel Hai. Inspired by the place — not a map, not GIS.",
		image: "/tracks/kshmona.jpg",
		width: 20,
		seed: 1949,
		theme: "park",
		ground: 5929544,
		sand: 12101752,
		sky: {
			elevation: 28,
			azimuth: 220,
			turbidity: 3.6,
			rayleigh: 1.35,
			mieCoefficient: .0034,
			mieDirectionalG: .74,
			exposure: .8,
			fog: 12899512,
			fogDensity: .0013
		},
		checkpointCount: 10,
		points: [
			ksm(33.208, 35.57),
			ksm(33.214, 35.572),
			ksm(33.222, 35.575),
			ksm(33.23, 35.578),
			ksm(33.234, 35.574),
			ksm(33.23, 35.568),
			ksm(33.222, 35.564),
			ksm(33.214, 35.562),
			ksm(33.208, 35.564)
		],
		elevation: () => 1.2,
		streets: [
			{
				from: 0,
				to: .22,
				he: "כביש 90",
				en: "Highway 90"
			},
			{
				from: .22,
				to: .44,
				he: "תל חי",
				en: "Tel Hai"
			},
			{
				from: .44,
				to: .66,
				he: "החולה",
				en: "The Hula"
			},
			{
				from: .66,
				to: .84,
				he: "נפתלי",
				en: "Naftali"
			},
			{
				from: .84,
				to: 1,
				he: "העיר",
				en: "The Town"
			}
		],
		pois: [
			{
				...ksm(33.208, 35.57),
				r: 24,
				he: "העיר",
				en: "The Town"
			},
			{
				...ksm(33.2354, 35.5792),
				r: 26,
				he: "תל חי",
				en: "Tel Hai"
			},
			{
				...ksm(33.226, 35.584),
				r: 28,
				he: "נפתלי",
				en: "Naftali"
			}
		]
	}),
	defineTrack({
		id: "raanana",
		nameHe: "רעננה",
		nameEn: "Raanana",
		city: "herzliya",
		cityHe: "הרצליה",
		cityEn: "Herzliya",
		lengthHint: "3 הקפות · אחוזה",
		description: "פארק רעננה, אחוזה, קניון רננים והשרון. בהשראת המקום, לא מפה ולא GIS.",
		descriptionEn: "Raanana Park, Ahuza, Renanim Mall and the Sharon. Inspired by the place — not a map, not GIS.",
		image: "/tracks/raanana.jpg",
		width: 20,
		seed: 1922,
		theme: "park",
		ground: 5929546,
		sand: 13155480,
		sky: {
			...TLV_GOLDEN,
			fogDensity: .0014
		},
		checkpointCount: 10,
		points: [
			raa(32.184, 34.87),
			raa(32.185, 34.864),
			raa(32.1855, 34.858),
			raa(32.184, 34.853),
			raa(32.181, 34.852),
			raa(32.179, 34.856),
			raa(32.178, 34.862),
			raa(32.179, 34.868),
			raa(32.181, 34.872),
			raa(32.183, 34.872)
		],
		elevation: () => .5,
		streets: [
			{
				from: 0,
				to: .22,
				he: "אחוזה",
				en: "Ahuza"
			},
			{
				from: .22,
				to: .44,
				he: "הפארק",
				en: "The Park"
			},
			{
				from: .44,
				to: .66,
				he: "רננים",
				en: "Renanim"
			},
			{
				from: .66,
				to: .84,
				he: "ויצמן",
				en: "Weizmann"
			},
			{
				from: .84,
				to: 1,
				he: "השרון",
				en: "The Sharon"
			}
		],
		pois: [
			{
				...raa(32.184, 34.87),
				r: 24,
				he: "אחוזה",
				en: "Ahuza"
			},
			{
				...raa(32.185, 34.853),
				r: 28,
				he: "פארק רעננה",
				en: "Raanana Park"
			},
			{
				...raa(32.184, 34.865),
				r: 24,
				he: "רננים",
				en: "Renanim"
			}
		]
	}),
	defineTrack({
		id: "afula",
		nameHe: "עפולה",
		nameEn: "Afula",
		city: "kinneret",
		cityHe: "כנרת",
		cityEn: "Kinneret",
		lengthHint: "3 הקפות · הכיכר",
		description: "הכיכר הגדולה, עמק יזרעאל, הגלבוע וכביש 65. בהשראת המקום, לא מפה ולא GIS.",
		descriptionEn: "The big circle, Jezreel Valley, Mount Gilboa and Highway 65. Inspired by the place — not a map, not GIS.",
		image: "/tracks/afula.jpg",
		width: 20,
		seed: 1925,
		theme: "highway",
		ground: 8030808,
		sand: 13680784,
		sky: {
			...TLV_GOLDEN,
			fogDensity: .0014
		},
		checkpointCount: 10,
		points: [
			afl(32.61, 35.289),
			afl(32.608, 35.295),
			afl(32.606, 35.3),
			afl(32.602, 35.302),
			afl(32.598, 35.298),
			afl(32.596, 35.292),
			afl(32.598, 35.286),
			afl(32.602, 35.282),
			afl(32.607, 35.283),
			afl(32.61, 35.286)
		],
		elevation: () => .8,
		streets: [
			{
				from: 0,
				to: .22,
				he: "הכיכר",
				en: "The Circle"
			},
			{
				from: .22,
				to: .44,
				he: "כביש 65",
				en: "Highway 65"
			},
			{
				from: .44,
				to: .66,
				he: "יזרעאל",
				en: "Jezreel"
			},
			{
				from: .66,
				to: .84,
				he: "הגלבוע",
				en: "Gilboa"
			},
			{
				from: .84,
				to: 1,
				he: "העיר",
				en: "The Town"
			}
		],
		pois: [
			{
				...afl(32.61, 35.289),
				r: 28,
				he: "הכיכר",
				en: "The Circle"
			},
			{
				...afl(32.607, 35.3),
				r: 24,
				he: "כביש 65",
				en: "Highway 65"
			},
			{
				...afl(32.598, 35.286),
				r: 26,
				he: "הגלבוע",
				en: "Gilboa"
			}
		]
	}),
	defineTrack({
		id: "ksaba",
		nameHe: "כפר סבא",
		nameEn: "Kfar Saba",
		city: "herzliya",
		cityHe: "הרצליה",
		cityEn: "Herzliya",
		lengthHint: "3 הקפות · ויצמן",
		description: "ויצמן, ארלוזורוב, גן הזיכרון והשרון. בהשראת המקום, לא מפה ולא GIS.",
		descriptionEn: "Weizmann, Arlozorov, the memorial garden and the Sharon. Inspired by the place — not a map, not GIS.",
		image: "/tracks/ksaba.jpg",
		width: 20,
		seed: 1903,
		theme: "bauhaus",
		ground: 6978136,
		sand: 13155480,
		sky: {
			...TLV_GOLDEN,
			fogDensity: .0014
		},
		checkpointCount: 10,
		points: [
			ksb(32.175, 34.908),
			ksb(32.176, 34.912),
			ksb(32.178, 34.915),
			ksb(32.18, 34.914),
			ksb(32.181, 34.91),
			ksb(32.18, 34.906),
			ksb(32.178, 34.903),
			ksb(32.175, 34.903),
			ksb(32.174, 34.906)
		],
		elevation: () => .5,
		streets: [
			{
				from: 0,
				to: .22,
				he: "ויצמן",
				en: "Weizmann"
			},
			{
				from: .22,
				to: .44,
				he: "ארלוזורוב",
				en: "Arlozorov"
			},
			{
				from: .44,
				to: .66,
				he: "גן הזיכרון",
				en: "Memorial Garden"
			},
			{
				from: .66,
				to: .84,
				he: "טשרניחובסקי",
				en: "Tchernichovsky"
			},
			{
				from: .84,
				to: 1,
				he: "השרון",
				en: "The Sharon"
			}
		],
		pois: [
			{
				...ksb(32.175, 34.908),
				r: 26,
				he: "ויצמן",
				en: "Weizmann"
			},
			{
				...ksb(32.178, 34.914),
				r: 24,
				he: "ארלוזורוב",
				en: "Arlozorov"
			},
			{
				...ksb(32.178, 34.906),
				r: 24,
				he: "גן הזיכרון",
				en: "Memorial Garden"
			}
		]
	}),
	defineTrack({
		id: "arad",
		nameHe: "ערד",
		nameEn: "Arad",
		city: "negev",
		cityHe: "נגב",
		cityEn: "Negev",
		lengthHint: "3 הקפות · המדבר",
		description: "העיר על הרכס, מדבר יהודה, הדרך לים המלח. בהשראת המקום, לא מפה ולא GIS.",
		descriptionEn: "The ridge town, the Judean desert and the road to the Dead Sea. Inspired by the place — not a map, not GIS.",
		image: "/tracks/arad.jpg",
		width: 20,
		seed: 1962,
		theme: "desert",
		ground: 12886128,
		sand: 14731416,
		sky: {
			elevation: 22,
			azimuth: 248,
			turbidity: 8.2,
			rayleigh: 2.1,
			mieCoefficient: .007,
			mieDirectionalG: .8,
			exposure: .78,
			fog: 14206112,
			fogDensity: .0014
		},
		checkpointCount: 10,
		points: [
			ard(31.258, 35.213),
			ard(31.255, 35.22),
			ard(31.252, 35.228),
			ard(31.25, 35.236),
			ard(31.252, 35.244),
			ard(31.256, 35.246),
			ard(31.26, 35.24),
			ard(31.262, 35.23),
			ard(31.262, 35.22),
			ard(31.26, 35.214)
		],
		elevation: () => 2.2,
		streets: [
			{
				from: 0,
				to: .22,
				he: "יהודה",
				en: "Yehuda"
			},
			{
				from: .22,
				to: .44,
				he: "הרכס",
				en: "The Ridge"
			},
			{
				from: .44,
				to: .66,
				he: "לים המלח",
				en: "Toward Dead Sea"
			},
			{
				from: .66,
				to: .84,
				he: "מואב",
				en: "Moav"
			},
			{
				from: .84,
				to: 1,
				he: "העיר",
				en: "The Town"
			}
		],
		pois: [
			{
				...ard(31.258, 35.213),
				r: 26,
				he: "ערד",
				en: "Arad"
			},
			{
				...ard(31.255, 35.23),
				r: 24,
				he: "הרכס",
				en: "The Ridge"
			},
			{
				...ard(31.25, 35.244),
				r: 24,
				he: "לים המלח",
				en: "Dead Sea road"
			}
		]
	})
]);
function getTrack(id) {
	const t = TRACKS.find((x) => x.id === id);
	if (!t) throw new Error(`Unknown track ${id}`);
	return t;
}
function isDriveable(track) {
	return track.width >= 19.5 && track.city !== "nyc";
}
function streetName(track, t, he) {
	const u = t < 0 ? t + 1 : t % 1;
	const seg = track.streets.find((s) => u >= s.from && u < s.to) ?? track.streets[track.streets.length - 1];
	return he ? seg.he : seg.en;
}
function nearestPoi(track, x, z, he) {
	let best = "";
	let bestD = Infinity;
	for (const p of track.pois) {
		const d = Math.hypot(x - p.x, z - p.z);
		if (d < p.r && d < bestD) {
			bestD = d;
			best = he ? p.he : p.en;
		}
	}
	return best;
}
function nightAmt(clock) {
	const t = (clock % 1 + 1) % 1;
	return clamp$1(.5 + .5 * Math.cos(t * Math.PI * 2), 0, 1);
}
function todLabel(clock, he) {
	const t = (clock % 1 + 1) % 1;
	if (t < .16 || t >= .9) return he ? "לילה" : "Night";
	if (t < .3) return he ? "זריחה" : "Dawn";
	if (t < .44) return he ? "בוקר" : "Morning";
	if (t < .62) return he ? "צהריים" : "Noon";
	if (t < .78) return he ? "אחר הצהריים" : "Afternoon";
	return he ? "שקיעה" : "Sunset";
}
function skyAt(def, clock, weather = "clear") {
	const az = def.sky.azimuth;
	const nightFog = def.theme === "stone" || def.theme === "jaffa" ? 1315086 : def.theme === "desert" ? 1446156 : def.theme === "park" ? 791568 : def.theme === "manhattan" ? 659480 : 790552;
	const dayFog = def.water ? 12113124 : 12899036;
	const keys = [
		{
			t: 0,
			elevation: -7,
			azimuth: az,
			turbidity: 12,
			rayleigh: .22,
			mieCoefficient: .01,
			mieDirectionalG: .96,
			exposure: .68,
			fog: nightFog,
			fogDensity: .0042
		},
		{
			t: .2,
			elevation: 3.5,
			azimuth: az,
			turbidity: 8.2,
			rayleigh: 1.85,
			mieCoefficient: .006,
			mieDirectionalG: .88,
			exposure: .78,
			fog: 13150344,
			fogDensity: .0038
		},
		{
			t: .34,
			elevation: 22,
			azimuth: az,
			turbidity: 3.4,
			rayleigh: 1.15,
			mieCoefficient: .0032,
			mieDirectionalG: .72,
			exposure: .92,
			fog: 11848928,
			fogDensity: .0022
		},
		{
			t: .5,
			elevation: 64,
			azimuth: az,
			turbidity: 1.85,
			rayleigh: .72,
			mieCoefficient: .0018,
			mieDirectionalG: .55,
			exposure: .94,
			fog: dayFog,
			fogDensity: .0018
		},
		{
			t: .7,
			elevation: 16,
			azimuth: az,
			turbidity: 6.2,
			rayleigh: 1.8,
			mieCoefficient: .0052,
			mieDirectionalG: .84,
			exposure: .88,
			fog: 12888200,
			fogDensity: .0032
		},
		{
			t: .84,
			elevation: 2.2,
			azimuth: az,
			turbidity: 9.4,
			rayleigh: 1.15,
			mieCoefficient: .008,
			mieDirectionalG: .92,
			exposure: .7,
			fog: 3818584,
			fogDensity: .0038
		},
		{
			t: 1,
			elevation: -7,
			azimuth: az,
			turbidity: 12,
			rayleigh: .22,
			mieCoefficient: .01,
			mieDirectionalG: .96,
			exposure: .68,
			fog: nightFog,
			fogDensity: .0042
		}
	];
	const t = (clock % 1 + 1) % 1;
	let i = 0;
	while (i < keys.length - 2 && keys[i + 1].t < t) i += 1;
	const a = keys[i];
	const b = keys[i + 1];
	const u = (t - a.t) / Math.max(1e-4, b.t - a.t);
	const preset = {
		elevation: lerp(a.elevation, b.elevation, u),
		azimuth: az,
		turbidity: lerp(a.turbidity, b.turbidity, u),
		rayleigh: lerp(a.rayleigh, b.rayleigh, u),
		mieCoefficient: lerp(a.mieCoefficient, b.mieCoefficient, u),
		mieDirectionalG: lerp(a.mieDirectionalG, b.mieDirectionalG, u),
		exposure: lerp(a.exposure, b.exposure, u),
		fog: lerpColor(a.fog, b.fog, u),
		fogDensity: lerp(a.fogDensity, b.fogDensity, u)
	};
	const night = t < .22 || t > .86;
	if (weather === "rain") {
		preset.turbidity += 5;
		preset.exposure *= .86;
		preset.fogDensity += .0032;
		preset.rayleigh *= .55;
		preset.fog = night ? 1185308 : 8029324;
	} else if (weather === "storm") {
		preset.turbidity += 9;
		preset.exposure *= .7;
		preset.fogDensity += .0058;
		preset.rayleigh *= .35;
		preset.elevation = night ? -8 : Math.min(preset.elevation, 28);
		preset.fog = night ? 790548 : 4871260;
	} else if (weather === "hamsin") {
		preset.turbidity += 7;
		preset.exposure *= 1.08;
		preset.fogDensity += .0044;
		preset.rayleigh *= .72;
		preset.fog = night ? 2759698 : 13938816;
		preset.elevation = Math.min(preset.elevation, 42);
	}
	return preset;
}
function skyFor(def, night, weather = "clear") {
	return skyAt(def, night ? .92 : .5, weather);
}
var MODES = [
	"circuit",
	"time",
	"drift",
	"knockout",
	"heat"
];
var WX = [
	"clear",
	"clear",
	"rain",
	"storm"
];
function hash(s) {
	let h = 2166136261;
	for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
	return h >>> 0;
}
function dailyKey(d = /* @__PURE__ */ new Date()) {
	return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}
function todayChallenge(d = /* @__PURE__ */ new Date()) {
	const key = dailyKey(d);
	const h = hash(key);
	return {
		key,
		trackId: TRACKS[h % TRACKS.length].id,
		mode: MODES[h % MODES.length],
		weather: WX[(h >>> 5) % WX.length],
		night: (h >>> 9 & 1) === 1
	};
}
var CAR_UNLOCK = {
	sabra: 0,
	carmel: 4,
	kfir: 8,
	negev: 12,
	yam: 16
};
var CAREER = [
	{
		id: "lic-start",
		chapter: 0,
		chapterHe: "רישיון תל אביב",
		chapterEn: "TLV license",
		trackId: "hayarkon",
		mode: "circuit",
		nameHe: "שיעור 1 · הישאר על הכביש",
		nameEn: "Lesson 1 · Stay on the road",
		night: false,
		unlockStars: 0,
		gold: 1,
		silver: 2,
		bronze: 3,
		lineHe: "נועם: שלוש הקפות. בלי לרדת לחול.",
		lineEn: "Noam: Three laps. Stay off the sand."
	},
	{
		id: "lic-brake",
		chapter: 0,
		chapterHe: "רישיון תל אביב",
		chapterEn: "TLV license",
		trackId: "namal",
		mode: "time",
		nameHe: "שיעור 2 · בלימה בנמל",
		nameEn: "Lesson 2 · Port braking",
		night: false,
		unlockStars: 1,
		gold: 88,
		silver: 108,
		bronze: 132,
		lineHe: "מאיה: בלום לפני הפנייה. לא בתוכה.",
		lineEn: "Maya: Brake before the corner. Not in it."
	},
	{
		id: "lic-drift",
		chapter: 0,
		chapterHe: "רישיון תל אביב",
		chapterEn: "TLV license",
		trackId: "oldjaffa",
		mode: "drift",
		nameHe: "שיעור 3 · אבני יפו",
		nameEn: "Lesson 3 · Jaffa stones",
		night: true,
		unlockStars: 3,
		gold: 7200,
		silver: 4200,
		bronze: 2200,
		lineHe: "ארי: תן לו להחליק. אל תילחם בהגה.",
		lineEn: "Ari: Let it slide. Don't fight the wheel."
	},
	{
		id: "lic-clean",
		chapter: 0,
		chapterHe: "רישיון תל אביב",
		chapterEn: "TLV license",
		trackId: "rothschild",
		mode: "circuit",
		nameHe: "שיעור 4 · הקפה נקייה",
		nameEn: "Lesson 4 · Clean lap",
		night: false,
		unlockStars: 5,
		gold: 1,
		silver: 2,
		bronze: 3,
		lineHe: "תמר: רוטשילד צר. קו אחד, בלי קיר.",
		lineEn: "Tamar: Rothschild is tight. One line, no walls."
	},
	{
		id: "lic-wet",
		chapter: 0,
		chapterHe: "רישיון תל אביב",
		chapterEn: "TLV license",
		trackId: "ayalon",
		mode: "time",
		nameHe: "שיעור 5 · איילון רטוב",
		nameEn: "Lesson 5 · Wet Ayalon",
		night: true,
		unlockStars: 8,
		gold: 82,
		silver: 102,
		bronze: 126,
		weather: "rain",
		lineHe: "מאיה: שלוליות בצד. תישאר במרכז.",
		lineEn: "Maya: Puddles on the edge. Stay center."
	},
	{
		id: "lic-heat",
		chapter: 0,
		chapterHe: "רישיון תל אביב",
		chapterEn: "TLV license",
		trackId: "telaviv",
		mode: "heat",
		nameHe: "שיעור 6 · בריחה מאיילון",
		nameEn: "Lesson 6 · Ayalon getaway",
		night: true,
		unlockStars: 11,
		gold: 95,
		silver: 120,
		bronze: 150,
		lineHe: "נועם: שני שוטרים. אל תיגע בהם.",
		lineEn: "Noam: Two cops. Don't tap them."
	},
	{
		id: "tlv-promenade",
		chapter: 1,
		chapterHe: "תל אביב",
		chapterEn: "Tel Aviv",
		trackId: "hayarkon",
		mode: "circuit",
		nameHe: "טיילת הזהב",
		nameEn: "Golden promenade",
		night: false,
		unlockStars: 0,
		gold: 1,
		silver: 2,
		bronze: 3,
		lineHe: "נועם: טיילת. אל תיגע בתיירים.",
		lineEn: "Noam: Promenade. Don't clip the tourists."
	},
	{
		id: "tlv-azrieli",
		chapter: 1,
		chapterHe: "תל אביב",
		chapterEn: "Tel Aviv",
		trackId: "telaviv",
		mode: "circuit",
		nameHe: "מעגל עזריאלי",
		nameEn: "Azrieli circuit",
		night: false,
		unlockStars: 0,
		gold: 1,
		silver: 2,
		bronze: 3,
		lineHe: "מאיה: שלושת המגדלים מימין. תשמור קו.",
		lineEn: "Maya: Three towers on the right. Hold the line."
	},
	{
		id: "tlv-port-time",
		chapter: 1,
		chapterHe: "תל אביב",
		chapterEn: "Tel Aviv",
		trackId: "namal",
		mode: "time",
		nameHe: "נגד השעון בנמל",
		nameEn: "Port time attack",
		night: true,
		unlockStars: 2,
		gold: 85,
		silver: 105,
		bronze: 130,
		weather: "rain"
	},
	{
		id: "jaffa-drift",
		chapter: 2,
		chapterHe: "יפו והדרום",
		chapterEn: "Jaffa & the south",
		trackId: "oldjaffa",
		mode: "drift",
		nameHe: "דריפט ביפו",
		nameEn: "Jaffa drift",
		night: true,
		unlockStars: 5,
		gold: 9e3,
		silver: 5500,
		bronze: 2800
	},
	{
		id: "jaffa-circuit",
		chapter: 2,
		chapterHe: "יפו והדרום",
		chapterEn: "Jaffa & the south",
		trackId: "oldjaffa",
		mode: "circuit",
		nameHe: "נמל יפו",
		nameEn: "Jaffa port",
		night: false,
		unlockStars: 5,
		gold: 1,
		silver: 2,
		bronze: 3
	},
	{
		id: "tlv-heat",
		chapter: 2,
		chapterHe: "יפו והדרום",
		chapterEn: "Jaffa & the south",
		trackId: "hayarkon",
		mode: "heat",
		nameHe: "מרדף בטיילת",
		nameEn: "Promenade heat",
		night: true,
		unlockStars: 8,
		gold: 90,
		silver: 120,
		bronze: 160
	},
	{
		id: "jer-gold",
		chapter: 3,
		chapterHe: "ישראל",
		chapterEn: "Israel",
		trackId: "jerusalem",
		mode: "circuit",
		nameHe: "ירושלים של זהב",
		nameEn: "Jerusalem of gold",
		night: false,
		unlockStars: 11,
		gold: 1,
		silver: 2,
		bronze: 3
	},
	{
		id: "haifa-drop",
		chapter: 3,
		chapterHe: "ישראל",
		chapterEn: "Israel",
		trackId: "haifa",
		mode: "knockout",
		nameHe: "הדחה בכרמל",
		nameEn: "Carmel knockout",
		night: false,
		unlockStars: 11,
		gold: 1,
		silver: 2,
		bronze: 3
	},
	{
		id: "eilat-time",
		chapter: 3,
		chapterHe: "ישראל",
		chapterEn: "Israel",
		trackId: "eilat",
		mode: "time",
		nameHe: "קו החוף באילת",
		nameEn: "Eilat shoreline",
		night: false,
		unlockStars: 14,
		gold: 80,
		silver: 100,
		bronze: 125
	},
	{
		id: "negev-ring",
		chapter: 3,
		chapterHe: "ישראל",
		chapterEn: "Israel",
		trackId: "beersheva",
		mode: "circuit",
		nameHe: "טבעת הנגב",
		nameEn: "Negev ring",
		night: false,
		unlockStars: 12,
		gold: 1,
		silver: 2,
		bronze: 3,
		lineHe: "תמר: חול בצדדים. תישאר על רגר.",
		lineEn: "Tamar: Sand on the edges. Stay on Rager."
	},
	{
		id: "netanya-cliff",
		chapter: 3,
		chapterHe: "ישראל",
		chapterEn: "Israel",
		trackId: "netanya",
		mode: "drift",
		nameHe: "דריפט על המצוק",
		nameEn: "Cliff drift",
		night: true,
		unlockStars: 12,
		gold: 8e3,
		silver: 4800,
		bronze: 2400,
		lineHe: "ארי: הטיילת צרה. אל תיפול לים.",
		lineEn: "Ari: Tight promenade. Don't drop into the sea."
	},
	{
		id: "hw1-climb",
		chapter: 3,
		chapterHe: "ישראל",
		chapterEn: "Israel",
		trackId: "hw1",
		mode: "time",
		nameHe: "עלייה לשער הגיא",
		nameEn: "Sha'ar HaGai climb",
		night: false,
		unlockStars: 14,
		gold: 92,
		silver: 114,
		bronze: 140,
		lineHe: "מאיה: כביש רחב. אל תישן בירידה.",
		lineEn: "Maya: Wide road. Don't sleep on the descent."
	},
	{
		id: "herz-marina",
		chapter: 3,
		chapterHe: "ישראל",
		chapterEn: "Israel",
		trackId: "herzliya",
		mode: "heat",
		nameHe: "מרדף במרינה",
		nameEn: "Marina heat",
		night: true,
		unlockStars: 14,
		gold: 100,
		silver: 130,
		bronze: 170,
		lineHe: "נועם: הייטק ויאכטות. המשטרה אוהבת את זה.",
		lineEn: "Noam: Tech and yachts. Cops love this."
	},
	{
		id: "nyc-neon",
		chapter: 4,
		chapterHe: "ניו יורק",
		chapterEn: "New York",
		trackId: "timessquare",
		mode: "circuit",
		nameHe: "ניאון בטיימס",
		nameEn: "Times Square neon",
		night: true,
		unlockStars: 17,
		gold: 1,
		silver: 2,
		bronze: 3
	},
	{
		id: "nyc-park-drift",
		chapter: 4,
		chapterHe: "ניו יורק",
		chapterEn: "New York",
		trackId: "centralpark",
		mode: "drift",
		nameHe: "דריפט בסנטרל פארק",
		nameEn: "Central Park drift",
		night: false,
		unlockStars: 17,
		gold: 11e3,
		silver: 6500,
		bronze: 3200
	},
	{
		id: "nyc-bridge",
		chapter: 4,
		chapterHe: "ניו יורק",
		chapterEn: "New York",
		trackId: "brooklynbridge",
		mode: "time",
		nameHe: "גשר ברוקלין",
		nameEn: "Brooklyn Bridge run",
		night: true,
		unlockStars: 20,
		gold: 95,
		silver: 120,
		bronze: 150
	},
	{
		id: "nyc-island-ko",
		chapter: 5,
		chapterHe: "המחתרת",
		chapterEn: "The Underground",
		trackId: "manhattan",
		mode: "knockout",
		nameHe: "הקפת האי",
		nameEn: "Island knockout",
		night: true,
		unlockStars: 24,
		gold: 1,
		silver: 2,
		bronze: 3
	},
	{
		id: "nyc-manhattan-heat",
		chapter: 5,
		chapterHe: "המחתרת",
		chapterEn: "The Underground",
		trackId: "manhattan",
		mode: "heat",
		nameHe: "מרדף במנהטן",
		nameEn: "Manhattan heat",
		night: true,
		unlockStars: 27,
		gold: 140,
		silver: 180,
		bronze: 230,
		weather: "storm"
	},
	{
		id: "nyc-nypd",
		chapter: 5,
		chapterHe: "המחתרת",
		chapterEn: "The Underground",
		trackId: "timessquare",
		mode: "heat",
		nameHe: "משטרת ניו יורק",
		nameEn: "NYPD",
		night: true,
		unlockStars: 30,
		gold: 90,
		silver: 115,
		bronze: 145
	},
	{
		id: "tlv-ko",
		chapter: 2,
		chapterHe: "יפו והדרום",
		chapterEn: "Jaffa & the south",
		trackId: "telaviv",
		mode: "knockout",
		nameHe: "הדחה באיילון",
		nameEn: "Ayalon knockout",
		night: true,
		unlockStars: 8,
		gold: 1,
		silver: 2,
		bronze: 3
	},
	{
		id: "jer-night",
		chapter: 3,
		chapterHe: "ישראל",
		chapterEn: "Israel",
		trackId: "jerusalem",
		mode: "time",
		nameHe: "ירושלים בלילה",
		nameEn: "Jerusalem night",
		night: true,
		unlockStars: 13,
		gold: 88,
		silver: 110,
		bronze: 138
	},
	{
		id: "haifa-night",
		chapter: 3,
		chapterHe: "ישראל",
		chapterEn: "Israel",
		trackId: "haifa",
		mode: "circuit",
		nameHe: "חיפה בלילה",
		nameEn: "Haifa nights",
		night: true,
		unlockStars: 14,
		gold: 1,
		silver: 2,
		bronze: 3
	},
	{
		id: "eilat-storm",
		chapter: 3,
		chapterHe: "ישראל",
		chapterEn: "Israel",
		trackId: "eilat",
		mode: "time",
		nameHe: "סערה באילת",
		nameEn: "Eilat storm",
		night: true,
		unlockStars: 16,
		gold: 92,
		silver: 118,
		bronze: 148,
		weather: "storm"
	},
	{
		id: "haifa-heat",
		chapter: 3,
		chapterHe: "ישראל",
		chapterEn: "Israel",
		trackId: "haifa",
		mode: "heat",
		nameHe: "מרדף בכרמל",
		nameEn: "Carmel heat",
		night: true,
		unlockStars: 18,
		gold: 110,
		silver: 145,
		bronze: 185
	},
	{
		id: "nyc-park-lap",
		chapter: 4,
		chapterHe: "ניו יורק",
		chapterEn: "New York",
		trackId: "centralpark",
		mode: "circuit",
		nameHe: "לולאת הפארק",
		nameEn: "Park loop",
		night: false,
		unlockStars: 20,
		gold: 1,
		silver: 2,
		bronze: 3
	},
	{
		id: "tlv-rothschild",
		chapter: 1,
		chapterHe: "תל אביב",
		chapterEn: "Tel Aviv",
		trackId: "rothschild",
		mode: "circuit",
		nameHe: "העיר הלבנה",
		nameEn: "White City",
		night: false,
		unlockStars: 3,
		gold: 1,
		silver: 2,
		bronze: 3
	},
	{
		id: "tlv-ayalon",
		chapter: 1,
		chapterHe: "תל אביב",
		chapterEn: "Tel Aviv",
		trackId: "ayalon",
		mode: "time",
		nameHe: "איילון נגד השעון",
		nameEn: "Ayalon attack",
		night: true,
		unlockStars: 4,
		gold: 82,
		silver: 102,
		bronze: 128
	},
	{
		id: "caesarea-run",
		chapter: 3,
		chapterHe: "ישראל",
		chapterEn: "Israel",
		trackId: "caesarea",
		mode: "circuit",
		nameHe: "אמת המים",
		nameEn: "The aqueduct",
		night: false,
		unlockStars: 12,
		gold: 1,
		silver: 2,
		bronze: 3
	},
	{
		id: "deadsea-time",
		chapter: 3,
		chapterHe: "ישראל",
		chapterEn: "Israel",
		trackId: "deadsea",
		mode: "time",
		nameHe: "מינוס 430",
		nameEn: "Minus 430",
		night: false,
		unlockStars: 14,
		gold: 86,
		silver: 108,
		bronze: 136
	},
	{
		id: "acre-drift",
		chapter: 3,
		chapterHe: "ישראל",
		chapterEn: "Israel",
		trackId: "acre",
		mode: "drift",
		nameHe: "דריפט בחומות",
		nameEn: "Walls drift",
		night: true,
		unlockStars: 15,
		gold: 9500,
		silver: 5800,
		bronze: 3e3
	},
	{
		id: "hanikra-time",
		chapter: 6,
		chapterHe: "הצפון",
		chapterEn: "The North",
		trackId: "hanikra",
		mode: "time",
		nameHe: "המצוק הלבן",
		nameEn: "The white cliff",
		night: false,
		unlockStars: 16,
		gold: 90,
		silver: 112,
		bronze: 140,
		lineHe: "תמר: מנהרה ואז ים. אל תיכנס לקיר.",
		lineEn: "Tamar: Tunnel then sea. Don't kiss the wall."
	},
	{
		id: "haifa-quay",
		chapter: 6,
		chapterHe: "הצפון",
		chapterEn: "The North",
		trackId: "haifaport",
		mode: "heat",
		nameHe: "מרדף ברציפים",
		nameEn: "Quay heat",
		night: true,
		unlockStars: 16,
		gold: 110,
		silver: 140,
		bronze: 180,
		lineHe: "ארי: עגורנים וסמויים. תברח לבת גלים.",
		lineEn: "Ari: Cranes and unmarked cars. Break for Bat Galim."
	},
	{
		id: "carmel-full",
		chapter: 6,
		chapterHe: "הצפון",
		chapterEn: "The North",
		trackId: "stellamaris",
		mode: "circuit",
		nameHe: "הכרמל מלמעלה",
		nameEn: "Carmel from the top",
		night: false,
		unlockStars: 18,
		gold: 1,
		silver: 2,
		bronze: 3,
		lineHe: "מאיה: ירידה ארוכה. הבלם הוא החבר שלך.",
		lineEn: "Maya: Long descent. The brake is your friend."
	},
	{
		id: "kinneret-lap",
		chapter: 6,
		chapterHe: "הצפון",
		chapterEn: "The North",
		trackId: "tiberias",
		mode: "circuit",
		nameHe: "הקפה על הכנרת",
		nameEn: "Kinneret lap",
		night: false,
		unlockStars: 18,
		gold: 1,
		silver: 2,
		bronze: 3,
		lineHe: "נועם: מים מימין. אל תיפול פנימה.",
		lineEn: "Noam: Water on the right. Don't drop in."
	},
	{
		id: "golan-98",
		chapter: 6,
		chapterHe: "הצפון",
		chapterEn: "The North",
		trackId: "golan",
		mode: "time",
		nameHe: "כביש 98",
		nameEn: "Route 98",
		night: false,
		unlockStars: 19,
		gold: 94,
		silver: 116,
		bronze: 145,
		lineHe: "תמר: בזלת ורוח. שמור קו.",
		lineEn: "Tamar: Basalt and wind. Hold the line."
	},
	{
		id: "hermon-climb",
		chapter: 6,
		chapterHe: "הצפון",
		chapterEn: "The North",
		trackId: "hermon",
		mode: "drift",
		nameHe: "דריפט בשלג",
		nameEn: "Snow drift",
		night: false,
		unlockStars: 20,
		gold: 8e3,
		silver: 4800,
		bronze: 2400,
		lineHe: "ארי: אחיזה חצי. הזווית תעשה את השאר.",
		lineEn: "Ari: Half grip. The angle does the rest."
	},
	{
		id: "hw6-run",
		chapter: 7,
		chapterHe: "העורקים",
		chapterEn: "The Arteries",
		trackId: "hw6",
		mode: "time",
		nameHe: "חוצה ישראל",
		nameEn: "Trans-Israel",
		night: false,
		unlockStars: 21,
		gold: 88,
		silver: 110,
		bronze: 138,
		lineHe: "מאיה: רחב ומהיר. אל תישן במחלף.",
		lineEn: "Maya: Wide and fast. Don't sleep at the interchange."
	},
	{
		id: "hw2-coast",
		chapter: 7,
		chapterHe: "העורקים",
		chapterEn: "The Arteries",
		trackId: "hw2",
		mode: "circuit",
		nameHe: "כביש החוף",
		nameEn: "Coast road",
		night: true,
		unlockStars: 21,
		gold: 1,
		silver: 2,
		bronze: 3,
		lineHe: "נועם: ים משמאל. שמור נתיב ימין.",
		lineEn: "Noam: Sea on the left. Hold the right lane."
	},
	{
		id: "hw90-arava",
		chapter: 7,
		chapterHe: "העורקים",
		chapterEn: "The Arteries",
		trackId: "hw90",
		mode: "heat",
		nameHe: "מרדף בערבה",
		nameEn: "Arava heat",
		night: false,
		unlockStars: 22,
		gold: 120,
		silver: 155,
		bronze: 200,
		weather: "clear",
		lineHe: "ארי: 200 ק״מ של כלום. תברח דרומה.",
		lineEn: "Ari: 200km of nothing. Run south."
	},
	{
		id: "petah-lap",
		chapter: 8,
		chapterHe: "השפלה",
		chapterEn: "The Plain",
		trackId: "petah",
		mode: "circuit",
		nameHe: "אם המושבות",
		nameEn: "Em HaMoshavot",
		night: false,
		unlockStars: 22,
		gold: 1,
		silver: 2,
		bronze: 3,
		lineHe: "תמר: ז׳בוטינסקי רחב. אל תיכנס לקניון.",
		lineEn: "Tamar: Jabotinsky is wide. Don't enter the mall."
	},
	{
		id: "rishon-wine",
		chapter: 8,
		chapterHe: "השפלה",
		chapterEn: "The Plain",
		trackId: "rishon",
		mode: "drift",
		nameHe: "דריפט ביקב",
		nameEn: "Winery drift",
		night: true,
		unlockStars: 23,
		gold: 8200,
		silver: 5e3,
		bronze: 2600,
		lineHe: "מאיה: רוטשילד צר. זווית קצרה.",
		lineEn: "Maya: Rothschild is tight. Short angle."
	},
	{
		id: "ashdod-heat",
		chapter: 8,
		chapterHe: "השפלה",
		chapterEn: "The Plain",
		trackId: "ashdod",
		mode: "heat",
		nameHe: "מרדף בנמל",
		nameEn: "Port heat",
		night: true,
		unlockStars: 23,
		gold: 115,
		silver: 145,
		bronze: 185,
		lineHe: "ארי: עגורנים ומכולות. תברח למרינה.",
		lineEn: "Ari: Cranes and containers. Break for the marina."
	},
	{
		id: "ashkelon-walls",
		chapter: 8,
		chapterHe: "השפלה",
		chapterEn: "The Plain",
		trackId: "ashkelon",
		mode: "time",
		nameHe: "החומות",
		nameEn: "The walls",
		night: false,
		unlockStars: 24,
		gold: 92,
		silver: 114,
		bronze: 142,
		lineHe: "נועם: אבן וים. שמור קו על החומה.",
		lineEn: "Noam: Stone and sea. Hold the wall line."
	},
	{
		id: "scopus-climb",
		chapter: 9,
		chapterHe: "ירושלים רבתי",
		chapterEn: "Greater Jerusalem",
		trackId: "scopus",
		mode: "circuit",
		nameHe: "הצופים",
		nameEn: "Scopus",
		night: false,
		unlockStars: 24,
		gold: 1,
		silver: 2,
		bronze: 3,
		lineHe: "מאיה: ירידה ארוכה. הבלם שוב.",
		lineEn: "Maya: Long descent. The brake again."
	},
	{
		id: "walls-loop",
		chapter: 9,
		chapterHe: "ירושלים רבתי",
		chapterEn: "Greater Jerusalem",
		trackId: "walls",
		mode: "time",
		nameHe: "סביב החומות",
		nameEn: "Around the walls",
		night: true,
		unlockStars: 25,
		gold: 96,
		silver: 118,
		bronze: 148,
		lineHe: "נועם: אבן חלקה בלילה. אל תיגע בחומה.",
		lineEn: "Noam: Smooth stone at night. Don't kiss the wall."
	},
	{
		id: "modiin-431",
		chapter: 9,
		chapterHe: "ירושלים רבתי",
		chapterEn: "Greater Jerusalem",
		trackId: "modiin",
		mode: "knockout",
		nameHe: "431",
		nameEn: "431",
		night: false,
		unlockStars: 25,
		gold: 1,
		silver: 2,
		bronze: 3,
		lineHe: "ארי: יער ואז מחלף. מי שנרדם יוצא.",
		lineEn: "Ari: Forest then interchange. Sleep and you're out."
	},
	{
		id: "ramon-rim",
		chapter: 10,
		chapterHe: "הנגב",
		chapterEn: "The Negev",
		trackId: "ramon",
		mode: "circuit",
		nameHe: "שפת המכתש",
		nameEn: "Crater rim",
		night: false,
		unlockStars: 26,
		gold: 1,
		silver: 2,
		bronze: 3,
		weather: "hamsin",
		lineHe: "תמר: אל תיפול פנימה.",
		lineEn: "Tamar: Don't fall in."
	},
	{
		id: "hw40-boker",
		chapter: 10,
		chapterHe: "הנגב",
		chapterEn: "The Negev",
		trackId: "hw40",
		mode: "time",
		nameHe: "שדה בוקר",
		nameEn: "Sde Boker",
		night: false,
		unlockStars: 26,
		gold: 98,
		silver: 122,
		bronze: 152,
		lineHe: "נועם: ישר, חם, ריק.",
		lineEn: "Noam: Straight, hot, empty."
	},
	{
		id: "eilat-pass",
		chapter: 10,
		chapterHe: "הנגב",
		chapterEn: "The Negev",
		trackId: "eilatmtn",
		mode: "drift",
		nameHe: "המעבר האדום",
		nameEn: "The red pass",
		night: false,
		unlockStars: 28,
		gold: 8600,
		silver: 5200,
		bronze: 2800,
		lineHe: "מאיה: סיכות. זווית או קיר.",
		lineEn: "Maya: Hairpins. Angle or wall."
	},
	{
		id: "gush-roam",
		chapter: 11,
		chapterHe: "גוש דן",
		chapterEn: "Gush Dan",
		trackId: "gushdan",
		mode: "roam",
		nameHe: "חותמות הגוש",
		nameEn: "Metro stamps",
		night: false,
		unlockStars: 8,
		gold: 150,
		silver: 210,
		bronze: 280,
		lineHe: "תמר: יפו עד הרצליה. אספי את כולם.",
		lineEn: "Tamar: Jaffa to Herzliya. Collect them all."
	},
	{
		id: "gal-nazareth",
		chapter: 6,
		chapterHe: "הגליל",
		chapterEn: "The Galilee",
		trackId: "nazareth",
		mode: "circuit",
		nameHe: "סמטאות נצרת",
		nameEn: "Nazareth alleys",
		night: false,
		unlockStars: 16,
		gold: 1,
		silver: 2,
		bronze: 3,
		lineHe: "תמר: אל תיגע בכנסייה.",
		lineEn: "Tamar: Don't clip the basilica."
	},
	{
		id: "gal-tzfat",
		chapter: 6,
		chapterHe: "הגליל",
		chapterEn: "The Galilee",
		trackId: "tzfat",
		mode: "drift",
		nameHe: "סיכות צפת",
		nameEn: "Safed pins",
		night: true,
		unlockStars: 18,
		gold: 7200,
		silver: 4200,
		bronze: 2200,
		lineHe: "מאיה: ירידות. זווית.",
		lineEn: "Maya: Downhill. Angle."
	},
	{
		id: "ds-masada",
		chapter: 8,
		chapterHe: "המדבר",
		chapterEn: "The desert",
		trackId: "masada",
		mode: "time",
		nameHe: "שביל הנחש",
		nameEn: "Snake path",
		night: false,
		unlockStars: 20,
		gold: 96,
		silver: 120,
		bronze: 150,
		weather: "hamsin",
		lineHe: "ארי: למעלה בלי לבלום.",
		lineEn: "Ari: Up without braking."
	},
	{
		id: "tlv-batyam",
		chapter: 1,
		chapterHe: "רישיון תל אביב",
		chapterEn: "TLV license",
		trackId: "batyam",
		mode: "circuit",
		nameHe: "טיילת בת ים",
		nameEn: "Bat Yam promenade",
		night: false,
		unlockStars: 4,
		gold: 1,
		silver: 2,
		bronze: 3,
		lineHe: "נועם: יפו באופק. שמור על הקו.",
		lineEn: "Noam: Jaffa on the horizon. Hold the line."
	},
	{
		id: "cup-coast",
		chapter: 12,
		chapterHe: "גביע ישראל",
		chapterEn: "Israel Cup",
		trackId: "hw2",
		mode: "circuit",
		nameHe: "גמר החוף",
		nameEn: "Coast final",
		night: true,
		unlockStars: 36,
		gold: 1,
		silver: 2,
		bronze: 3,
		weather: "clear",
		lineHe: "נועם: כביש 2 בלילה. זה הגביע.",
		lineEn: "Noam: Highway 2 at night. This is the cup."
	},
	{
		id: "cup-capital",
		chapter: 12,
		chapterHe: "גביע ישראל",
		chapterEn: "Israel Cup",
		trackId: "walls",
		mode: "knockout",
		nameHe: "גמר הבירה",
		nameEn: "Capital final",
		night: true,
		unlockStars: 38,
		gold: 1,
		silver: 2,
		bronze: 3,
		lineHe: "מאיה: מי שנרדם על החומה יוצא.",
		lineEn: "Maya: Sleep on the wall and you're out."
	},
	{
		id: "cup-south",
		chapter: 12,
		chapterHe: "גביע ישראל",
		chapterEn: "Israel Cup",
		trackId: "hw90",
		mode: "time",
		nameHe: "גמר הערבה",
		nameEn: "Arava final",
		night: false,
		unlockStars: 40,
		gold: 92,
		silver: 116,
		bronze: 148,
		weather: "hamsin",
		lineHe: "ארי: חמסין וחום. שעון נקי.",
		lineEn: "Ari: Hamsin and heat. A clean clock."
	},
	{
		id: "cup-final",
		chapter: 12,
		chapterHe: "גביע ישראל",
		chapterEn: "Israel Cup",
		trackId: "telaviv",
		mode: "heat",
		nameHe: "גביע ישראל",
		nameEn: "Israel Cup",
		night: true,
		unlockStars: 44,
		gold: 105,
		silver: 135,
		bronze: 175,
		lineHe: "תמר: עזריאלי בלילה. תברח ותשמור על הגביע.",
		lineEn: "Tamar: Azrieli at night. Run and keep the cup."
	}
];
function dailyEvent(d = /* @__PURE__ */ new Date()) {
	const ch = todayChallenge(d);
	return {
		id: `daily-${ch.key}`,
		chapter: 0,
		chapterHe: "אתגר היום",
		chapterEn: "Daily challenge",
		trackId: ch.trackId,
		mode: ch.mode,
		nameHe: "אתגר היום",
		nameEn: "Daily challenge",
		night: ch.night,
		unlockStars: 0,
		gold: ch.mode === "time" ? 85 : ch.mode === "drift" ? 7e3 : ch.mode === "heat" ? 105 : 1,
		silver: ch.mode === "time" ? 107 : ch.mode === "drift" ? 4200 : ch.mode === "heat" ? 135 : 2,
		bronze: ch.mode === "time" ? 133 : ch.mode === "drift" ? 2200 : ch.mode === "heat" ? 175 : 3,
		weather: ch.weather
	};
}
function getEvent(id) {
	if (id.startsWith("daily-")) return dailyEvent();
	if (id.startsWith("weekly-")) return weeklyEvent();
	return CAREER.find((e) => e.id === id) ?? null;
}
function weeklyKey(d = /* @__PURE__ */ new Date()) {
	const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
	const day = t.getUTCDay() || 7;
	t.setUTCDate(t.getUTCDate() + 4 - day);
	const yearStart = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
	const week = Math.ceil(((t.getTime() - yearStart.getTime()) / 864e5 + 1) / 7);
	return `${t.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}
function weeklyEvent(d = /* @__PURE__ */ new Date()) {
	const key = weeklyKey(d);
	const ch = todayChallenge(new Date(d.getFullYear(), d.getMonth(), d.getDate() + 3));
	return {
		id: `weekly-${key}`,
		chapter: 0,
		chapterHe: "אליפות השבוע",
		chapterEn: "Weekly cup",
		trackId: ch.trackId,
		mode: ch.mode === "heat" ? "circuit" : ch.mode,
		nameHe: "אליפות השבוע",
		nameEn: "Weekly cup",
		night: true,
		unlockStars: 0,
		gold: ch.mode === "time" ? 78 : ch.mode === "drift" ? 8e3 : 1,
		silver: ch.mode === "time" ? 98 : ch.mode === "drift" ? 4800 : 2,
		bronze: ch.mode === "time" ? 122 : ch.mode === "drift" ? 2400 : 3,
		weather: ch.weather
	};
}
function starsFor(ev, r) {
	if (ev.mode === "heat") {
		if (r.busted) return 0;
		if (r.heatMax < .48) return 3;
		if (r.totalTime <= ev.gold) return 3;
		if (r.heatMax < .82) return 2;
		return 1;
	}
	if (ev.mode === "drift") {
		if (r.driftScore >= ev.gold) return 3;
		if (r.driftScore >= ev.silver) return 2;
		if (r.driftScore >= ev.bronze) return 1;
		return 0;
	}
	if (ev.mode === "time" || ev.mode === "roam") {
		if (r.totalTime <= ev.gold) return 3;
		if (r.totalTime <= ev.silver) return 2;
		if (r.totalTime <= ev.bronze) return 1;
		return 0;
	}
	if (r.place <= 1) return 3;
	if (r.place <= 2) return 2;
	if (r.place <= 3) return 1;
	return 0;
}
function maxStars() {
	return CAREER.length * 3;
}
function chapters() {
	const map = /* @__PURE__ */ new Map();
	for (const ev of CAREER) {
		const cur = map.get(ev.chapter) ?? {
			he: ev.chapterHe,
			en: ev.chapterEn,
			events: []
		};
		cur.events.push(ev);
		map.set(ev.chapter, cur);
	}
	return [...map.entries()].sort((a, b) => a[0] - b[0]).map(([, v]) => v);
}
var CARS = [
	{
		id: "sabra",
		nameHe: "צבר",
		nameEn: "Sabra",
		tagline: "סדאן משפחתי · 0–100 ב־8.4 שנ׳",
		color: 15920872,
		accent: 1718890,
		maxSpeed: 53,
		accel: 6.2,
		brake: 9.2,
		turnRate: 1.85,
		grip: .9,
		drag: .55,
		mass: 1.12,
		body: "gt",
		zeroTo100: 8.4
	},
	{
		id: "carmel",
		nameHe: "כרמל T",
		nameEn: "Carmel T",
		tagline: "האצ׳בק חם · 0–100 ב־6.6 שנ׳",
		color: 12856356,
		accent: 1708048,
		maxSpeed: 64,
		accel: 6.8,
		brake: 10.4,
		turnRate: 2.12,
		grip: .92,
		drag: .58,
		mass: .96,
		body: "hatch",
		zeroTo100: 6.6
	},
	{
		id: "kfir",
		nameHe: "כפיר V8",
		nameEn: "Kfir V8",
		tagline: "קופה אמריקאית · 0–100 ב־4.9 שנ׳",
		color: 1714760,
		accent: 13148746,
		maxSpeed: 72,
		accel: 8.2,
		brake: 9.6,
		turnRate: 1.68,
		grip: .84,
		drag: .46,
		mass: 1.34,
		body: "muscle",
		nitroStart: .28,
		zeroTo100: 4.9
	},
	{
		id: "negev",
		nameHe: "נגב",
		nameEn: "Negev",
		tagline: "ראלי · אחיזה בחצץ · 0–100 ב־5.8 שנ׳",
		color: 12886122,
		accent: 3811348,
		maxSpeed: 58,
		accel: 7.4,
		brake: 10,
		turnRate: 1.92,
		grip: .97,
		drag: .5,
		mass: 1.24,
		body: "rally",
		zeroTo100: 5.8
	},
	{
		id: "yam",
		nameHe: "ים סוף",
		nameEn: "Yam Suf",
		tagline: "ספורט נמוך · 0–100 ב־3.5 שנ׳",
		color: 791584,
		accent: 7260356,
		maxSpeed: 86,
		accel: 10.4,
		brake: 12.4,
		turnRate: 1.78,
		grip: .88,
		drag: .4,
		mass: .94,
		body: "super",
		zeroTo100: 3.5
	}
];
function getCar(id) {
	return CARS.find((x) => x.id === id) ?? CARS[0];
}
var RIVALS = [
	{
		he: "נועם כהן",
		en: "Noam Cohen"
	},
	{
		he: "מאיה לוי",
		en: "Maya Levi"
	},
	{
		he: "ארי מזרחי",
		en: "Ari Mizrahi"
	},
	{
		he: "תמר בן דוד",
		en: "Tamar Ben-David"
	}
];
var PAINTS = [
	{
		id: 0,
		he: "מקורי",
		en: "Stock",
		color: 0
	},
	{
		id: 1,
		he: "שנהב",
		en: "Ivory",
		color: 15920872
	},
	{
		id: 2,
		he: "לילה",
		en: "Night",
		color: 1711138
	},
	{
		id: 3,
		he: "טורקיז",
		en: "Teal",
		color: 2789258
	},
	{
		id: 4,
		he: "ארד",
		en: "Bronze",
		color: 12093770
	}
];
var UPGRADE_COST = {
	engine: [
		900,
		1800,
		3200
	],
	tires: [
		800,
		1600,
		2800
	],
	nitro: [
		1e3,
		2e3,
		3600
	]
};
var LIVERIES = [
	{
		id: 0,
		he: "נקי",
		en: "Clean"
	},
	{
		id: 1,
		he: "פסים",
		en: "Stripes"
	},
	{
		id: 2,
		he: "שקיעה",
		en: "Sunset"
	},
	{
		id: 3,
		he: "משבצות",
		en: "Checkers"
	},
	{
		id: 4,
		he: "להבות",
		en: "Flames"
	},
	{
		id: 5,
		he: "זהב",
		en: "Gold line"
	},
	{
		id: 6,
		he: "ספליט",
		en: "Split"
	}
];
function emptyTune() {
	return {
		engine: 0,
		tires: 0,
		nitro: 0,
		paint: 0,
		livery: 0
	};
}
function applyTune(base, tune) {
	const paint = PAINTS[tune.paint];
	const color = !paint || paint.id === 0 || paint.color === 0 ? base.color : paint.color;
	return {
		...base,
		color,
		maxSpeed: base.maxSpeed + tune.engine * 1.4,
		accel: base.accel + tune.engine * .38,
		turnRate: base.turnRate + tune.tires * .1,
		grip: Math.min(.99, base.grip + tune.tires * .034),
		nitroDrain: .42 - tune.nitro * .07,
		nitroStart: .34 + tune.nitro * .18
	};
}
function nextCost(kind, level) {
	if (level >= 3) return null;
	return UPGRADE_COST[kind][level] ?? null;
}
function racePayout(r) {
	if (r.busted) return 80;
	if (r.mode === "heat") return r.place === 1 ? 1600 : 80;
	if (r.mode === "drift") {
		if (r.driftScore >= 9e3) return 1400;
		if (r.driftScore >= 5e3) return 850;
		return 400;
	}
	if (r.mode === "time" || r.mode === "roam") {
		if (r.place === 1) return 1100;
		return 500;
	}
	if (r.place === 1) return 1400;
	if (r.place === 2) return 800;
	if (r.place === 3) return 450;
	return 220;
}
var WEATHER_GRIP = {
	clear: 1,
	rain: .76,
	storm: .6,
	hamsin: .86
};
function sampleGhost(frames, time, dt = .16) {
	if (!frames.length) return null;
	const i = Math.min(frames.length - 1, Math.max(0, Math.floor(time / dt)));
	const a = frames[i];
	const b = frames[Math.min(frames.length - 1, i + 1)];
	const f = Math.min(1, (time - i * dt) / dt);
	let dy = b.yaw - a.yaw;
	while (dy > Math.PI) dy -= Math.PI * 2;
	while (dy < -Math.PI) dy += Math.PI * 2;
	return {
		x: a.x + (b.x - a.x) * f,
		y: a.y + (b.y - a.y) * f,
		z: a.z + (b.z - a.z) * f,
		yaw: a.yaw + dy * f
	};
}
function sampleGhostLoop(frames, time, dt = .16) {
	if (!frames.length) return null;
	const period = frames.length * dt;
	return sampleGhost(frames, (time % period + period) % period, dt);
}
function paceGhost(samples, length, duration, dt = .16) {
	const frames = [];
	const n = samples.length;
	if (n < 2 || duration < 4) return frames;
	const len = Math.max(1, length);
	for (let t = 0; t < duration - dt * .5; t += dt) {
		const s = t / duration % 1 * len;
		let i = 0;
		let lo = 0;
		let hi = n - 1;
		while (lo < hi) {
			const mid = lo + hi >> 1;
			if (samples[mid].s < s) lo = mid + 1;
			else hi = mid;
		}
		i = Math.max(0, lo - 1);
		const a = samples[i];
		const b = samples[(i + 1) % n];
		const span = b.s > a.s ? b.s - a.s : 1;
		const f = Math.min(1, Math.max(0, (s - a.s) / span));
		frames.push({
			x: a.x + (b.x - a.x) * f,
			y: a.y + (b.y - a.y) * f,
			z: a.z + (b.z - a.z) * f,
			yaw: Math.atan2(-a.tx, -a.tz)
		});
	}
	return frames;
}
var MODE_LAPS = {
	circuit: 3,
	time: 2,
	drift: 2,
	knockout: 3,
	heat: 2,
	roam: 99
};
var MODE_INFO = {
	circuit: {
		he: "מעגל",
		en: "Circuit",
		blurbHe: "שלוש הקפות מול יריבים. מקום ראשון = שלושה כוכבים.",
		blurbEn: "Three laps against rivals. First place is three stars."
	},
	time: {
		he: "נגד השעון",
		en: "Time attack",
		blurbHe: "שתי הקפות נקיות. בלי יריבים — רק אתה, השעון והרחוב.",
		blurbEn: "Two clean laps. No rivals — just you, the clock and the street."
	},
	drift: {
		he: "דריפט",
		en: "Drift",
		blurbHe: "זווית מתוקה, קומבו וניר-מיס. שמור על 20–40°.",
		blurbEn: "Sweet angle, combo and near-miss. Hold 20–40°."
	},
	knockout: {
		he: "הדחה",
		en: "Knockout",
		blurbHe: "כל הקפה מוציאה את האחרון. תשרוד עד הסוף.",
		blurbEn: "Last place is cut each lap. Survive to the end."
	},
	heat: {
		he: "מרדף",
		en: "Heat",
		blurbHe: "המשטרה מאחוריך. מחסומים, כוכבי מבוקש, קירור אם תברח.",
		blurbEn: "Cops on your tail. Roadblocks, wanted stars, cooldown if you escape."
	},
	roam: {
		he: "חופשי",
		en: "Free roam",
		blurbHe: "גוש דן פתוח. אסוף ציוני דרך. בלי יריבים, בלי הקפות.",
		blurbEn: "Open Gush Dan. Collect landmarks. No rivals, no laps."
	}
};
function hasAiPack(mode) {
	return mode === "circuit" || mode === "knockout";
}
function hasCops(mode) {
	return mode === "heat";
}
function clamp(v, a, b) {
	return Math.max(a, Math.min(b, v));
}
var PHYSICS_DT = 1 / 120;
var MAX_ACCUMULATOR = .2;
var DEFAULT_ASSISTS = {
	abs: true,
	tcs: true,
	esc: true
};
var HANDLING = {
	arcade: {
		gripMul: 1.08,
		nitroMul: 1,
		rubberBand: true,
		driftBoost: 1,
		lockSlip: .22,
		yawDamp: .72
	},
	simcade: {
		gripMul: .94,
		nitroMul: .52,
		rubberBand: false,
		driftBoost: .58,
		lockSlip: .16,
		yawDamp: 1
	}
};
var WEATHER_SPEC = {
	clear: {
		long: 1,
		lat: 1,
		roll: 1,
		hydro: 0,
		vis: 1
	},
	rain: {
		long: .78,
		lat: .72,
		roll: 1.42,
		hydro: .22,
		vis: .82
	},
	storm: {
		long: .62,
		lat: .55,
		roll: 1.7,
		hydro: .4,
		vis: .62
	},
	hamsin: {
		long: .9,
		lat: .84,
		roll: 1.12,
		hydro: 0,
		vis: .7
	}
};
var SURFACE_SPEC = {
	asphalt: {
		long: 1,
		lat: 1,
		roll: 1
	},
	curb: {
		long: .82,
		lat: .74,
		roll: 1.22
	},
	sand: {
		long: .54,
		lat: .48,
		roll: 2.35
	},
	water: {
		long: .42,
		lat: .36,
		roll: 1.85
	}
};
/** Pacejka magic-formula lateral/longitudinal tire force. Odd in slip, peak near 0.12. */
function pacejka(slip, D, B = 10.4, C = 1.9, E = .97) {
	const x = slip;
	return D * Math.sin(C * Math.atan(B * x - E * (B * x - Math.atan(B * x))));
}
/** Monotone brake force. No step around 82–83% or lock threshold. */
function brakeForce(brake, statsBrake, pitch = 0) {
	const b = clamp(brake, 0, 1);
	const dive = 1 + clamp(pitch, 0, 1) * .22;
	return b * statsBrake * dive;
}
function absModulate(brake, slipRatio, enabled) {
	if (!enabled) return {
		brake: clamp(brake, 0, 1),
		active: false
	};
	if (slipRatio < -.18) {
		const cut = clamp((-slipRatio - .12) / .22, 0, .68);
		return {
			brake: clamp(brake, 0, 1) * (1 - cut),
			active: true
		};
	}
	return {
		brake: clamp(brake, 0, 1),
		active: false
	};
}
function tcsModulate(throttle, slipRatio, enabled) {
	if (!enabled) return {
		throttle: clamp(throttle, 0, 1),
		active: false
	};
	if (slipRatio > .14) {
		const cut = clamp((slipRatio - .1) / .28, 0, .62);
		return {
			throttle: clamp(throttle, 0, 1) * (1 - cut),
			active: true
		};
	}
	return {
		throttle: clamp(throttle, 0, 1),
		active: false
	};
}
function escYaw(slipAngle, yawRate, enabled, drifting) {
	if (!enabled || drifting) return {
		yaw: 0,
		active: false
	};
	const a = Math.abs(slipAngle);
	if (a < .18) return {
		yaw: 0,
		active: false
	};
	const sign = -Math.sign(slipAngle);
	const mag = clamp((a - .18) * .55, 0, .85);
	const rateCut = clamp(Math.abs(yawRate) * .12, 0, .4);
	return {
		yaw: sign * mag * (1 - rateCut),
		active: true
	};
}
function hydroplane(speedAbs, hydro) {
	if (hydro <= 0) return 1;
	const onset = 26;
	if (speedAbs <= onset) return 1;
	return 1 - clamp((speedAbs - onset) / 48, 0, 1) * hydro;
}
var REC_KEY = "rush.records.v3";
function recordPayload(trackId, carId, t, physicsVersion) {
	return `${trackId}|${carId}|${t}|${physicsVersion}`;
}
function isLiveRecord(r, version) {
	return r.physicsVersion === version;
}
async function sha256hex(s) {
	const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
	return Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, "0")).join("");
}
/** Codex 62: one-key atomic replace. No IndexedDB / pglite. */
function writeRecords(arr, storage = globalThis.localStorage, key = REC_KEY) {
	const raw = JSON.stringify(arr);
	storage.setItem(key, raw);
	if (storage.getItem(key) !== raw) throw new Error("records mismatch");
}
var KEY$1 = "rush-v1";
var LEGACY = "tlv-rush-v1";
var GHOST_KEY = "rush-ghosts-v1";
function empty() {
	return {
		version: 3,
		best: {},
		career: { stars: {} },
		cash: 500,
		tunes: {},
		damage: {},
		handling: "arcade"
	};
}
function load() {
	try {
		const raw = localStorage.getItem(KEY$1) ?? localStorage.getItem(LEGACY);
		if (!raw) return empty();
		const p = JSON.parse(raw);
		return {
			version: 3,
			best: p.best ?? {},
			muted: p.muted,
			night: p.night,
			quality: p.quality,
			fov: p.fov,
			career: { stars: p.career?.stars ?? {} },
			cash: typeof p.cash === "number" ? p.cash : 500,
			tunes: p.tunes ?? {},
			damage: p.damage ?? {},
			dailyDone: p.dailyDone,
			weeklyDone: p.weeklyDone,
			handling: p.handling === "simcade" ? "simcade" : "arcade",
			assists: {
				abs: p.assists?.abs !== false,
				tcs: p.assists?.tcs !== false,
				esc: p.assists?.esc !== false
			},
			lang: p.lang === "ar" || p.lang === "en" || p.lang === "he" ? p.lang : void 0
		};
	} catch {
		return empty();
	}
}
function write$1(data) {
	try {
		const raw = JSON.stringify(data);
		localStorage.setItem(KEY$1, raw);
		if (localStorage.getItem(KEY$1) !== raw) throw new Error("save mismatch");
	} catch {}
}
function recordBest(id, time, opts) {
	if (opts?.eligible === false) return false;
	if (!Number.isFinite(time) || time < 8 || time > 2700) return false;
	const data = load();
	const prev = data.best[id];
	const better = prev == null || time < prev;
	if (better) {
		data.best[id] = time;
		write$1(data);
	}
	persistTimed({
		t: time,
		trackId: id,
		carId: opts?.carId ?? "sabra",
		physicsVersion: 6,
		hash: ""
	});
	return better;
}
async function persistTimed(rec) {
	try {
		rec.hash = await sha256hex(recordPayload(rec.trackId, rec.carId, rec.t, rec.physicsVersion));
		const all = loadTimed().filter((r) => isLiveRecord(r, 6));
		all.push(rec);
		writeRecords(all);
	} catch {}
}
function loadTimed() {
	try {
		const raw = localStorage.getItem(REC_KEY);
		if (!raw) return [];
		const p = JSON.parse(raw);
		return Array.isArray(p) ? p : [];
	} catch {
		return [];
	}
}
function getMuted() {
	return !!load().muted;
}
function setMutedSave(muted) {
	const data = load();
	data.muted = muted;
	write$1(data);
}
function allBests() {
	return load().best;
}
function getNight() {
	const n = load().night;
	return n === void 0 ? false : n;
}
function setNightSave(night) {
	const data = load();
	data.night = night;
	write$1(data);
}
function getQuality() {
	const q = load().quality;
	if (q === "low" || q === "mid") return q;
	return "high";
}
function setQualitySave(quality) {
	const data = load();
	data.quality = quality;
	write$1(data);
}
function getFov() {
	return Math.max(0, Math.min(12, load().fov ?? 0));
}
function setFovSave(fov) {
	const data = load();
	data.fov = Math.max(0, Math.min(12, fov));
	write$1(data);
}
function allEventStars() {
	return load().career.stars;
}
function totalStars() {
	const s = load().career.stars;
	let n = 0;
	for (const v of Object.values(s)) n += v ?? 0;
	return n;
}
function recordEventStars(id, stars) {
	const data = load();
	if (stars > (data.career.stars[id] ?? 0)) {
		data.career.stars[id] = stars;
		write$1(data);
		return true;
	}
	return false;
}
function isCarUnlocked(id) {
	return totalStars() >= (CAR_UNLOCK[id] ?? 0);
}
function getCash() {
	return load().cash;
}
function addCash(amount) {
	const data = load();
	data.cash = Math.max(0, Math.round(data.cash + amount));
	write$1(data);
	return data.cash;
}
function spendCash(amount) {
	const data = load();
	if (data.cash < amount) return false;
	data.cash -= amount;
	write$1(data);
	return true;
}
function getTune(id) {
	return {
		...emptyTune(),
		...load().tunes[id] ?? {}
	};
}
function setTune(id, tune) {
	const data = load();
	data.tunes[id] = tune;
	write$1(data);
}
function getDamage(id) {
	return load().damage[id] ?? 0;
}
function setDamage(id, n) {
	const data = load();
	data.damage[id] = Math.max(0, Math.min(1, n));
	write$1(data);
}
function repairCar(id) {
	const dmg = getDamage(id);
	if (dmg < .04) return false;
	if (!spendCash(Math.max(80, Math.round(dmg * 850)))) return false;
	setDamage(id, 0);
	return true;
}
function repairCost(id) {
	const dmg = getDamage(id);
	if (dmg < .04) return 0;
	return Math.max(80, Math.round(dmg * 850));
}
function loadGhosts() {
	try {
		const raw = localStorage.getItem(GHOST_KEY);
		if (!raw) return {};
		return JSON.parse(raw);
	} catch {
		return {};
	}
}
function getGhost(id) {
	return loadGhosts()[id] ?? null;
}
function recordGhost(id, time, frames) {
	if (!Number.isFinite(time) || time < 8) return false;
	if (frames.length < 8) return false;
	const all = loadGhosts();
	const prev = all[id];
	if (prev && prev.time <= time) return false;
	all[id] = {
		time,
		frames
	};
	try {
		localStorage.setItem(GHOST_KEY, JSON.stringify(all));
	} catch {
		return false;
	}
	return true;
}
function markDailyDone(key) {
	const data = load();
	data.dailyDone = key;
	write$1(data);
}
function markWeeklyDone(key) {
	const data = load();
	data.weeklyDone = key;
	write$1(data);
}
function getHandling() {
	return load().handling === "simcade" ? "simcade" : "arcade";
}
function setHandlingSave(handling) {
	const data = load();
	data.handling = handling;
	write$1(data);
}
function getAssists() {
	const a = load().assists;
	return {
		abs: a?.abs !== false,
		tcs: a?.tcs !== false,
		esc: a?.esc !== false
	};
}
function setAssistsSave(assists) {
	const data = load();
	data.assists = { ...assists };
	write$1(data);
}
function flushSave() {
	write$1(load());
}
if (typeof document !== "undefined") {
	document.addEventListener("visibilitychange", () => {
		if (document.visibilityState === "hidden") flushSave();
	});
	window.addEventListener("pagehide", () => flushSave());
}
function getLang() {
	return load().lang ?? null;
}
function setLangSave(lang) {
	const data = load();
	data.lang = lang;
	write$1(data);
}
function copy(lang, he, en, ar) {
	if (lang === "he") return he;
	if (lang === "ar") return ar ?? en;
	return en;
}
function nextLang(lang) {
	if (lang === "he") return "ar";
	if (lang === "ar") return "en";
	return "he";
}
function langShort(lang) {
	if (lang === "he") return "עב";
	if (lang === "ar") return "ع";
	return "EN";
}
function dirFor(lang) {
	return lang === "en" ? "ltr" : "rtl";
}
function BootOverlay({ etaMs, frac, langHe, city, name }) {
	const ms = Math.max(400, Math.min(2e4, Math.round(etaMs)));
	const p = Math.max(0, Math.min(1, frac));
	const remain = p >= .18 ? Math.max(0, ms * (1 - p) / 1e3) : null;
	const stuck = p > 0 && p < .18;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "absolute inset-0 z-50 flex items-center justify-center bg-bg p-6 text-fg",
		"data-boot-overlay": "1",
		"data-boot-eta": ms,
		"data-boot-frac": p.toFixed(2),
		role: "status",
		"aria-live": "polite",
		"aria-busy": "true",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-md",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium uppercase tracking-widest text-muted",
					children: city
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-2 text-2xl font-semibold tracking-tight",
					children: langHe ? "טוען מסלול" : "Loading track"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted",
					children: name
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-8 text-center text-3xl font-semibold tabular-nums tracking-tight",
					children: remain == null || stuck ? langHe ? "טוען…" : "Loading…" : langHe ? `עוד ${remain.toFixed(1)} שניות` : `${remain.toFixed(1)}s remaining`
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6 h-1.5 overflow-hidden rounded-full bg-surface-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-full rounded-full bg-accent",
						style: { width: `${Math.max(4, p * 100)}%` }
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-center text-xs font-medium uppercase tracking-widest text-subtle",
					children: langHe ? "זמן שנותר עד הזינוק" : "Time left until start"
				})
			]
		})
	});
}
function TouchControls({ engine, langHe }) {
	const t = (he, en) => langHe ? he : en;
	const setPadFromEvent = (el, clientX, clientY) => {
		const r = el.getBoundingClientRect();
		const x = (clientX - r.left) / r.width;
		const y = (clientY - r.top) / r.height;
		const steer = (.5 - x) * 2;
		const vert = 1 - y * 2;
		engine?.setTouch({
			steer,
			throttle: vert > .08 ? vert : 0,
			brake: vert < -.08 ? -vert : 0
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pointer-events-none absolute inset-x-0 bottom-0 z-20 flex items-end justify-between gap-4 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] md:hidden",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "pointer-events-auto h-28 w-40 rounded-xl border border-border bg-surface/80",
			onPointerDown: (e) => {
				e.target.setPointerCapture(e.pointerId);
				setPadFromEvent(e.currentTarget, e.clientX, e.clientY);
			},
			onPointerMove: (e) => {
				if (e.buttons) setPadFromEvent(e.currentTarget, e.clientX, e.clientY);
			},
			onPointerUp: () => engine?.setTouch({
				steer: 0,
				throttle: 0,
				brake: 0
			}),
			onPointerCancel: () => engine?.setTouch({
				steer: 0,
				throttle: 0,
				brake: 0
			}),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex h-full items-center justify-center text-xs font-medium text-muted",
				children: t("הגה · גז", "Steer · gas")
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "pointer-events-auto flex gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "min-h-14 min-w-16 rounded-lg border border-border bg-surface/80 px-3 text-sm font-medium text-fg",
					onPointerDown: () => engine?.setTouch({ rewind: true }),
					onPointerUp: () => engine?.setTouch({ rewind: false }),
					onPointerCancel: () => engine?.setTouch({ rewind: false }),
					children: t("ריוויינד", "Rewind")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "min-h-14 min-w-16 rounded-lg border border-border bg-surface/80 px-3 text-sm font-medium text-fg",
					onPointerDown: () => engine?.setTouch({ brake: 1 }),
					onPointerUp: () => engine?.setTouch({ brake: 0 }),
					onPointerCancel: () => engine?.setTouch({ brake: 0 }),
					children: t("בלם", "Brake")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "min-h-14 min-w-16 rounded-lg border border-border bg-surface/80 px-3 text-sm font-medium text-fg",
					onPointerDown: () => engine?.setTouch({ drift: true }),
					onPointerUp: () => engine?.setTouch({ drift: false }),
					onPointerCancel: () => engine?.setTouch({ drift: false }),
					children: t("דריפט", "Drift")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "min-h-14 min-w-16 rounded-lg border border-accent/50 bg-surface/80 px-3 text-sm font-medium text-accent",
					onPointerDown: () => engine?.setTouch({ nitro: true }),
					onPointerUp: () => engine?.setTouch({ nitro: false }),
					onPointerCancel: () => engine?.setTouch({ nitro: false }),
					children: t("ניטרו", "Nitro")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "min-h-20 min-w-20 rounded-lg bg-fg px-4 text-sm font-medium text-bg",
					onPointerDown: () => engine?.setTouch({ throttle: 1 }),
					onPointerUp: () => engine?.setTouch({ throttle: 0 }),
					onPointerCancel: () => engine?.setTouch({ throttle: 0 }),
					children: t("גז", "Gas")
				})
			]
		})]
	});
}
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var styles = {
	primary: "bg-fg text-bg hover:bg-fg/90 border border-transparent",
	ghost: "bg-transparent text-fg hover:bg-surface-2 border border-transparent",
	outline: "bg-transparent text-fg border border-border hover:bg-surface-2",
	subtle: "bg-surface-2 text-fg border border-border hover:bg-surface"
};
function Button({ className, variant = "primary", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		className: cn("inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-4 text-sm font-medium transition-colors duration-(--motion-quick,150ms) disabled:pointer-events-none disabled:opacity-40", styles[variant], className),
		...props
	});
}
var KEY = "rush-load-eta-v1";
function read() {
	try {
		const raw = localStorage.getItem(KEY);
		if (!raw) return {};
		const p = JSON.parse(raw);
		return p && typeof p === "object" ? p : {};
	} catch {
		return {};
	}
}
function write(data) {
	try {
		localStorage.setItem(KEY, JSON.stringify(data));
	} catch {}
}
function slot(trackId, quality, night) {
	return `${trackId}|${quality}|${night ? "n" : "d"}`;
}
var HEAVY = /* @__PURE__ */ new Set([
	"ayalon",
	"manhattan",
	"timessquare",
	"gushdan",
	"jerusalem",
	"scopus",
	"ramon",
	"hermon",
	"oldjaffa",
	"rothschild",
	"telaviv",
	"namal"
]);
function estimateLoadMs(trackId, quality, night) {
	const prev = read()[slot(trackId, quality, night)];
	if (typeof prev === "number" && prev > 250 && prev < 6e4) return Math.round(prev * 1.04);
	let ms = 1100;
	if (quality === "high") ms += 400;
	else if (quality === "mid") ms += 180;
	if (night) ms += 200;
	if (HEAVY.has(trackId)) ms += 400;
	return ms;
}
function recordLoadMs(trackId, quality, night, ms) {
	if (!Number.isFinite(ms) || ms < 200 || ms > 9e4) return;
	const data = read();
	const k = slot(trackId, quality, night);
	const prev = data[k];
	data[k] = prev ? prev * .45 + ms * .55 : ms;
	write(data);
}
function Hud({ hud, langHe, mapRef, onPause, onMute, muted, night, onNight, onSkipReplay, onPhotoFilter, onPhotoHide, onPhotoExit, onPhotoSave }) {
	if (hud.photo) {
		if (hud.photoHide) return null;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "pointer-events-none absolute inset-0 z-10 p-4 pt-[max(1rem,env(safe-area-inset-top))]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "pointer-events-none absolute inset-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute start-0 top-0 h-8 w-8 border-s-2 border-t-2 border-fg/50" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute end-0 top-0 h-8 w-8 border-e-2 border-t-2 border-fg/50" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute start-0 bottom-0 h-8 w-8 border-s-2 border-b-2 border-fg/50" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute end-0 bottom-0 h-8 w-8 border-e-2 border-b-2 border-fg/50" })
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "pointer-events-auto mx-auto flex max-w-lg flex-col gap-2 rounded-lg border border-border bg-surface/85 p-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium uppercase tracking-widest text-muted",
						children: langHe ? "מצב צילום" : "Photo mode"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: langHe ? "A/D סיבוב · W/S גובה · E קרוב · רווח רחוק" : "A/D orbit · W/S height · E closer · Space farther"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted",
						children: [
							langHe ? "פילטר" : "Filter",
							" · ",
							hud.photoFilter
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: onPhotoFilter,
								className: "min-h-11 rounded-md border border-border px-3 text-sm",
								children: langHe ? "פילטר הבא" : "Next filter"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: onPhotoHide,
								className: "min-h-11 rounded-md border border-border px-3 text-sm",
								children: langHe ? "הסתר ממשק" : "Hide UI"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: onPhotoSave,
								className: "min-h-11 rounded-md border border-border px-3 text-sm",
								children: langHe ? "שמור תמונה" : "Save photo"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pointer-events-none absolute inset-0 z-10 p-4 pt-[max(1rem,env(safe-area-inset-top))]",
		children: [
			typeof location !== "undefined" && /(?:^|[?&])qa=1(?:&|$)/.test(location.search) ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "pointer-events-none absolute start-3 top-3 z-20 font-mono text-[10px] text-muted",
				children: [
					hud.backend,
					" · p95 ",
					Math.round(hud.msP95 || 0),
					"ms · dc ",
					hud.drawCalls || 0,
					" · tri ",
					(hud.triangles || 0) >= 1e3 ? `${Math.round((hud.triangles || 0) / 1e3)}k` : hud.triangles || 0,
					" · g",
					hud.geometries || 0,
					" t",
					hud.textures || 0,
					" · kin ",
					Number(hud.kinMix || 0).toFixed(2)
				]
			}) : null,
			hud.mode === "heat" && hud.heat > .12 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cn("pointer-events-none absolute inset-0", hud.heat > .7 ? "shadow-[inset_0_0_90px_var(--color-danger)]" : "shadow-[inset_0_0_70px_var(--color-accent)]"),
				style: { opacity: .25 + hud.heat * .45 }
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-3",
				children: [!hud.replay && !hud.finished ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-lg border border-border bg-surface/80 px-3 py-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-[11px] font-medium uppercase tracking-widest text-muted",
						children: [hud.mode === "roam" ? langHe ? "חופשי" : "Roam" : hud.pointToPoint ? langHe ? "נקודה לנקודה" : "A → B" : langHe ? `הקפה ${hud.lap}/${hud.totalLaps}` : `Lap ${hud.lap}/${hud.totalLaps}`]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 flex items-baseline gap-3 text-fg",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-lg font-semibold tabular-nums leading-none",
							children: formatTime(hud.lapTime)
						})]
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: onPause,
					className: "pointer-events-auto grid size-11 place-items-center rounded-md border border-border bg-surface/80 text-fg",
					"aria-label": "pause",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, { className: "size-4" })
				})]
			}),
			hud.wrongWay ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 flex justify-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "rounded-lg border border-danger bg-danger px-5 py-2 text-center text-xl font-semibold tracking-wide text-bg",
					children: langHe ? "כיוון הפוך · הסתובב" : "WRONG WAY · turn around"
				})
			}) : !hud.onTrack ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 flex justify-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "rounded-lg border border-accent bg-accent px-5 py-2 text-center text-xl font-semibold tracking-wide text-bg",
					children: langHe ? "חזור לכביש · עקוב אחרי החצים" : "Back on the road · follow the arrows"
				})
			}) : null,
			hud.mode === "heat" && hud.chasing && hud.heat > .35 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-6 text-center text-lg font-semibold tracking-widest text-danger",
				children: langHe ? "מבוקש" : "WANTED"
			}) : null,
			hud.rewind ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-6 text-center text-lg font-semibold tracking-widest text-accent",
				children: langHe ? "ריוויינד" : "REWIND"
			}) : null,
			hud.replay ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "pointer-events-auto mx-auto mt-8 flex max-w-sm flex-col items-center gap-3 rounded-lg border border-border bg-surface/85 px-4 py-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium uppercase tracking-widest text-muted",
						children: langHe ? "ריפליי" : "Replay"
					}),
					hud.replaySlow ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-semibold tracking-widest text-accent",
						children: langHe ? "הילוך איטי" : "SLOW-MO"
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium",
						children: hud.camName === "hood" ? langHe ? "תא נהג" : "Hood" : hud.camName === "bumper" ? langHe ? "פגוש" : "Bumper" : hud.camName === "heli" ? langHe ? "מסוק" : "Helicopter" : langHe ? "מעקב" : "Chase"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onSkipReplay,
						className: "min-h-11 rounded-md border border-border bg-surface px-4 text-sm font-medium",
						children: langHe ? "דלג · Enter" : "Skip · Enter"
					})
				]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute bottom-28 end-4 md:bottom-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-[11.5rem] rounded-lg border border-border bg-surface/80 px-3 py-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "max-w-[11rem] truncate text-xs font-medium text-muted",
						children: [hud.street, hud.poi ? ` · ${hud.poi}` : ""]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 flex items-end justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-2 text-xs text-muted",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gauge, { className: "size-3.5" }), langHe ? "קמ״ש" : "km/h"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-4xl font-semibold tabular-nums leading-tight",
							children: Math.round(hud.speedKmh)
						})] })]
					})]
				})
			})
		]
	});
}
function themeWash(theme, night) {
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
function resolveTrack(trackId) {
	return TRACKS.find((track) => track.id === trackId) ?? TRACKS[0];
}
function Overlay({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "absolute inset-0 z-40 flex items-center justify-center bg-bg/70 p-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "w-full max-w-sm rounded-xl border border-border bg-surface p-6",
			children
		})
	});
}
function Menu({ screen, setScreen, trackId, setTrackId, carId, setCarId, langHe, lang, cycleLang, muted, setMuted, night, setNightMode, t, track, car, quality, setQualityMode, fov, setFovMode, mode, setMode, starTotal, eventId, setEventId, weather, setWeatherMode, cash, setCash, handling, setHandlingMode, assists, setAssistsMode, onTuned, startCareer }) {
	const [cityFilter, setCityFilter] = (0, import_react.useState)("telaviv");
	const [showSet, setShowSet] = (0, import_react.useState)(false);
	allBests();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative flex h-full min-h-0 flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0 h-full w-full transition duration-500",
				style: { background: themeWash(track.theme, night) },
				"aria-hidden": true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute inset-0 bg-bg/72" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "relative z-10 flex items-center justify-between px-5 py-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-medium tracking-wide text-muted",
					children: "RUSH"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "min-h-11 rounded-md border border-border bg-surface/80 px-3 text-xs font-medium",
						onClick: cycleLang,
						children: langShort(lang)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "grid size-11 place-items-center rounded-md border border-border bg-surface/80",
						onClick: () => setShowSet((v) => !v),
						"aria-label": "settings",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, { className: "size-4" })
					})]
				})]
			}),
			showSet ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative z-20 mx-5 mb-2 rounded-lg border border-border bg-surface/90 p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium",
						children: t("הגדרות", "Settings")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: cn("min-h-10 flex-1 rounded-md border text-sm", quality === "low" ? "border-fg bg-fg text-bg" : "border-border"),
								onClick: () => setQualityMode("low"),
								children: t("נמוכה", "Low")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: cn("min-h-10 flex-1 rounded-md border text-sm", quality === "mid" ? "border-fg bg-fg text-bg" : "border-border"),
								onClick: () => setQualityMode("mid"),
								children: t("בינונית", "Mid")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: cn("min-h-10 flex-1 rounded-md border text-sm", quality === "high" ? "border-fg bg-fg text-bg" : "border-border"),
								onClick: () => setQualityMode("high"),
								children: t("גבוהה", "High")
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: cn("flex min-h-10 flex-1 items-center justify-center gap-2 rounded-md border text-sm", !night ? "border-fg bg-fg text-bg" : "border-border"),
							onClick: () => setNightMode(false),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { className: "size-4" }), t("יום", "Day")]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: cn("flex min-h-10 flex-1 items-center justify-center gap-2 rounded-md border text-sm", night ? "border-fg bg-fg text-bg" : "border-border"),
							onClick: () => setNightMode(true),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, { className: "size-4" }), t("לילה", "Night")]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "mt-3 flex min-h-10 w-full items-center justify-center gap-2 rounded-md border border-border text-sm",
						onClick: () => setMuted(!muted),
						children: [muted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolumeX, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "size-4" }), muted ? t("מושתק", "Muted") : t("צליל", "Sound")]
					})
				]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "relative z-10 flex min-h-0 flex-1 flex-col overflow-y-auto px-5 pb-8",
				children: [
					screen === "title" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mx-auto mt-auto mb-4 w-full max-w-lg",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted",
								children: t("מרוץ בישראל", "Race Israel", "سباق إسرائيل")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "mt-2 text-5xl font-semibold tracking-tight text-balance",
								children: "RUSH"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-4 max-w-md text-pretty text-sm leading-relaxed text-muted",
								children: t("בחר מסלול וסע. W גז, A/D הגה.", "Pick a track and drive. W gas, A/D steer.", "اختر مساراً وقد. W بنزين، A/D توجيه.")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								className: "mt-8 min-h-14 w-full text-base",
								onClick: () => {
									setEventId(null);
									setMode("circuit");
									setScreen("tracks");
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flag, { className: "size-4" }), t("בחר מסלול", "Choose track", "اختر المسار")]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-6 text-xs text-subtle",
								children: t("W גז · A/D הגה · Esc תפריט", "W gas · A/D steer · Esc menu", "W بنزين · A/D توجيه · Esc قائمة")
							})
						]
					}) : null,
					screen === "career" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CareerPanel, {
						langHe,
						t,
						starTotal,
						onBack: () => setScreen("title"),
						onStart: startCareer
					}) : null,
					screen === "garage" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GaragePanel, {
						langHe,
						t,
						carId,
						setCarId,
						cash,
						setCash,
						onBack: () => setScreen("title"),
						onTuned
					}) : null,
					screen === "tracks" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mx-auto w-full max-w-3xl",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "sticky top-0 z-20 -mx-1 mb-3 border-b border-border bg-bg/95 px-1 py-3 backdrop-blur",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											className: "shrink-0 text-sm text-muted",
											onClick: () => setScreen("title"),
											children: t("חזרה", "Back")
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "min-w-0 flex-1 truncate text-sm font-medium",
											children: langHe ? track.nameHe : track.nameEn
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
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
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-3xl font-semibold tracking-tight",
								children: t("מסלולים", "Tracks")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-muted",
								children: t("בהשראת המקומות — לא מפה, לא GIS. בחר וסע.", "Inspired by the places — not a map, not GIS. Pick and drive.")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-4 flex flex-wrap gap-2",
								children: CITY_FILTERS.filter((c) => c.id === "all" || TRACKS.some((tr) => isDriveable(tr) && tr.city === c.id)).map((c) => {
									const active = cityFilter === c.id;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setCityFilter(c.id),
										className: cn("min-h-10 rounded-full border px-3.5 text-sm font-medium", active ? "border-fg bg-fg text-bg" : "border-border bg-surface/80 text-muted"),
										children: langHe ? c.he : c.en
									}, c.id);
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 flex gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => setNightMode(false),
									className: cn("flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg border text-sm font-medium", !night ? "border-fg bg-fg text-bg" : "border-border bg-surface/80 text-muted"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { className: "size-4" }), t("יום", "Day")]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => setNightMode(true),
									className: cn("flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg border text-sm font-medium", night ? "border-fg bg-fg text-bg" : "border-border bg-surface/80 text-muted"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, { className: "size-4" }), t("לילה", "Night")]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-5 grid gap-3 sm:grid-cols-2",
								children: TRACKS.filter((tr) => isDriveable(tr) && (cityFilter === "all" || tr.city === cityFilter)).map((tr) => {
									const active = tr.id === trackId;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => {
											setTrackId(tr.id);
											setEventId(null);
											setMode("circuit");
											setScreen("race");
										},
										className: cn("overflow-hidden rounded-xl border text-start", active ? "border-fg" : "border-border"),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "relative block",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "block h-24 w-full",
													style: { background: themeWash(tr.theme, night) },
													"aria-hidden": true
												}),
												night ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pointer-events-none absolute inset-0 bg-bg/35" }) : null,
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "absolute top-2 end-2 flex items-center gap-1 rounded-md border border-border bg-surface/85 px-2 py-1 text-xs font-medium",
													children: [night ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, { className: "size-3" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { className: "size-3" }), night ? t("לילה", "Night") : t("יום", "Day")]
												})
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "bg-surface p-4",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-xs text-muted",
													children: langHe ? tr.cityHe : tr.cityEn
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "mt-1 font-semibold",
													children: langHe ? tr.nameHe : tr.nameEn
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "mt-1 text-xs text-muted",
													children: tr.lengthHint
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
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
					screen === "cars" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mx-auto w-full max-w-xl",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "sticky top-0 z-20 -mx-1 mb-3 border-b border-border bg-bg/95 px-1 py-3 backdrop-blur",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											className: "shrink-0 text-sm text-muted",
											onClick: () => setScreen(eventId ? "career" : "tracks"),
											children: t("חזרה", "Back")
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "min-w-0 flex-1 truncate text-sm font-medium",
											children: langHe ? car.nameHe : car.nameEn
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											className: "min-h-11 shrink-0 px-5",
											disabled: !isCarUnlocked(carId),
											onClick: () => setScreen("race"),
											children: t("זינוק", "Start")
										})
									]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-3xl font-semibold tracking-tight",
								children: t("רכב", "Car")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-4 flex gap-2",
								children: CARS.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: cn("h-10 flex-1 rounded-md border", c.id === carId ? "border-fg" : "border-border"),
									style: { background: `#${c.color.toString(16).padStart(6, "0")}` },
									onClick: () => setCarId(c.id),
									"aria-label": c.id
								}, c.id))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
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
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-5 grid gap-2",
								children: CARS.map((c) => {
									const active = c.id === carId;
									const unlocked = isCarUnlocked(c.id);
									const need = CAR_UNLOCK[c.id];
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => {
											if (unlocked) setCarId(c.id);
										},
										className: cn("flex items-center gap-4 rounded-lg border bg-surface p-4 text-start", active && unlocked ? "border-fg" : "border-border", !unlocked && "opacity-55"),
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "size-10 shrink-0 rounded-md border border-border",
												style: { background: `#${c.color.toString(16).padStart(6, "0")}` }
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "min-w-0 flex-1",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "block font-medium",
														children: langHe ? c.nameHe : c.nameEn
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "mt-0.5 block text-xs text-muted",
														children: c.tagline
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "mt-2 flex gap-3",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
																className: "block w-16",
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "block text-xs text-subtle",
																	children: langHe ? "מהירות" : "Speed"
																}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "mt-0.5 block h-1 rounded-full bg-surface-2",
																	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																		className: "block h-full rounded-full bg-fg",
																		style: { width: `${Math.round(c.maxSpeed / 52 * 100)}%` }
																	})
																})]
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
																className: "block w-16",
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "block text-xs text-subtle",
																	children: langHe ? "האצה" : "Accel"
																}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "mt-0.5 block h-1 rounded-full bg-surface-2",
																	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																		className: "block h-full rounded-full bg-fg",
																		style: { width: `${Math.round(c.accel / 24 * 100)}%` }
																	})
																})]
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
																className: "block w-16",
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "block text-xs text-subtle",
																	children: langHe ? "אחיזה" : "Grip"
																}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "mt-0.5 block h-1 rounded-full bg-surface-2",
																	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																		className: "block h-full rounded-full bg-fg",
																		style: { width: `${Math.round(c.grip * 100)}%` }
																	})
																})]
															})
														]
													})
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-xs tabular-nums text-muted",
												children: unlocked ? `${Math.round(c.maxSpeed * 3.6)} km/h` : t(`נעול · ${need}★`, `Locked · ${need}★`)
											})
										]
									}, c.id);
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
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
function CareerPanel({ langHe, t, starTotal, onBack, onStart }) {
	const earned = allEventStars();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto w-full max-w-3xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "text-sm text-muted",
				onClick: onBack,
				children: t("חזרה", "Back")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex items-end justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-3xl font-semibold tracking-tight",
					children: t("קריירה", "Career")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted",
					children: t("רישיון תל אביב, אחר כך הערים. תפוס את הרחוב.", "TLV license, then the cities. Take the street.")
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "flex items-center gap-1.5 text-sm font-medium",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "size-4 fill-accent text-accent" }),
						starTotal,
						"/",
						maxStars()
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 space-y-8",
				children: chapters().map((ch) => {
					const open = starTotal >= (ch.events[0]?.unlockStars ?? 0);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs font-medium uppercase tracking-widest text-muted",
						children: [langHe ? ch.he : ch.en, !open ? ` · ${t("נעול", "Locked")}` : ""]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 grid gap-2",
						children: ch.events.map((ev) => {
							const locked = starTotal < ev.unlockStars;
							const got = earned[ev.id] ?? 0;
							const info = MODE_INFO[ev.mode];
							const Icon = ev.mode === "heat" ? Shield : ev.mode === "time" ? Timer : ev.mode === "drift" ? Gauge : Trophy;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								disabled: locked,
								onClick: () => onStart(ev.id),
								className: cn("flex items-center gap-3 rounded-lg border bg-surface p-4 text-start", locked ? "border-border opacity-50" : "border-border hover:border-fg"),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "grid size-10 shrink-0 place-items-center rounded-md border border-border bg-surface-2",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "min-w-0 flex-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "block font-medium",
												children: langHe ? ev.nameHe : ev.nameEn
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "mt-0.5 block text-xs text-muted",
												children: [
													langHe ? info.he : info.en,
													ev.night ? ` · ${t("לילה", "Night")}` : ` · ${t("יום", "Day")}`,
													ev.weather && ev.weather !== "clear" ? ` · ${ev.weather === "storm" ? t("סערה", "Storm") : ev.weather === "hamsin" ? t("חמסין", "Hamsin") : t("גשם", "Rain")}` : "",
													locked ? ` · ${t(`${ev.unlockStars} כוכבים`, `${ev.unlockStars} stars`)}` : ""
												]
											}),
											ev.lineHe && !locked ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "mt-1 block text-[11px] text-fg/80",
												children: langHe ? ev.lineHe : ev.lineEn
											}) : null
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "flex gap-0.5",
										children: [
											0,
											1,
											2
										].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: cn("size-4", i < got ? "fill-accent text-accent" : "text-subtle") }, i))
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
function GaragePanel({ langHe, t, carId, setCarId, cash, setCash, onBack, onTuned }) {
	const car = CARS.find((c) => c.id === carId) ?? CARS[0];
	const tune = getTune(carId);
	const tuned = applyTune(car, tune);
	const buy = (kind) => {
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
	const buyPaint = (id) => {
		if (id === tune.paint) return;
		if (id !== 0 && !spendCash(450)) return;
		setTune(carId, {
			...tune,
			paint: id
		});
		setCash(getCash());
		onTuned();
	};
	const buyLivery = (id) => {
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto w-full max-w-xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "text-sm text-muted",
				onClick: onBack,
				children: t("חזרה", "Back")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex items-end justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-3xl font-semibold tracking-tight",
					children: t("מוסך", "Garage")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "tabular-nums text-sm font-medium",
					children: ["₪", cash.toLocaleString()]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted",
				children: t("שדרג מנוע, צמיגים וניטרו. צבע ₪450. ליבריה ₪700.", "Upgrade engine, tires and nitro. Paint ₪450. Livery ₪700.")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-5 grid gap-2",
				children: CARS.map((c) => {
					const unlocked = isCarUnlocked(c.id);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						disabled: !unlocked,
						onClick: () => unlocked && setCarId(c.id),
						className: cn("flex items-center gap-3 rounded-lg border bg-surface p-3 text-start", c.id === carId ? "border-fg" : "border-border", !unlocked && "opacity-50"),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "size-8 shrink-0 rounded-md border border-border",
								style: { background: `#${applyTune(c, getTune(c.id)).color.toString(16).padStart(6, "0")}` }
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "min-w-0 flex-1 font-medium",
								children: langHe ? c.nameHe : c.nameEn
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs tabular-nums text-muted",
								children: unlocked ? `${Math.round(applyTune(c, getTune(c.id)).maxSpeed * 3.6)} km/h` : t("נעול", "Locked")
							})
						]
					}, c.id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 space-y-3 rounded-lg border border-border bg-surface p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium",
						children: langHe ? car.nameHe : car.nameEn
					}),
					[
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
					].map(([key, label, hint]) => {
						const lvl = tune[key];
						const cost = nextCost(key, lvl);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm font-medium",
										children: label
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted",
										children: hint
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-1.5 flex gap-1",
										children: [
											0,
											1,
											2
										].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("h-1.5 flex-1 rounded-full", i < lvl ? "bg-accent" : "bg-surface-2") }, i))
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								disabled: cost == null || cash < cost,
								onClick: () => buy(key),
								className: "min-h-11 shrink-0 rounded-md border border-border px-3 text-xs font-medium disabled:opacity-40",
								children: cost == null ? t("מקס", "Max") : `₪${cost.toLocaleString()}`
							})]
						}, key);
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
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
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-2 pt-1",
						children: PAINTS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => buyPaint(p.id),
							className: cn("size-11 rounded-md border", tune.paint === p.id ? "border-fg" : "border-border"),
							style: { background: p.id === 0 ? `#${car.color.toString(16).padStart(6, "0")}` : `#${p.color.toString(16).padStart(6, "0")}` },
							"aria-label": langHe ? p.he : p.en
						}, p.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "pt-2 text-xs text-muted",
						children: t("ליבריה", "Livery")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-2",
						children: LIVERIES.map((lv) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
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
					repairCost(carId) > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
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
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-xs text-muted",
						children: t("המרכב תקין", "Body is clean")
					})
				]
			})
		]
	});
}
function RaceController({ screen, setScreen, trackId, carId, langHe, night, setNight, quality, setQuality, fov, mode, eventId, weather, tuneTick, handling, assists, muted, setMuted, setStarTotal, setCash, track, t, engineRef }) {
	const [hud, setHud] = (0, import_react.useState)(null);
	const [result, setResult] = (0, import_react.useState)(null);
	const [paused, setPaused] = (0, import_react.useState)(false);
	const [record, setRecord] = (0, import_react.useState)(false);
	const [raceKey, setRaceKey] = (0, import_react.useState)(0);
	const [earned, setEarned] = (0, import_react.useState)(0);
	const [boot, setBoot] = (0, import_react.useState)(null);
	const canvasRef = (0, import_react.useRef)(null);
	const mapRef = (0, import_react.useRef)(null);
	(0, import_react.useLayoutEffect)(() => {
		if (screen !== "race") {
			setBoot(null);
			return;
		}
		setBoot({
			etaMs: estimateLoadMs(trackId, quality, night),
			frac: 0
		});
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
	(0, import_react.useEffect)(() => {
		if (screen !== "race") return;
		const canvas = canvasRef.current;
		if (!canvas) return;
		let cancelled = false;
		let inst = null;
		const t0 = performance.now();
		setHud(null);
		(async () => {
			await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
			await new Promise((r) => setTimeout(r, 48));
			if (cancelled) return;
			const { RaceEngine } = await import("./engine-Bp9uDIWD.mjs");
			const { loadAyalonRoad } = await import("./road-assets-DFzE_7km.mjs");
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
				tune: emptyTune(),
				handling,
				assists,
				onHud: setHud,
				onBoot: (frac) => setBoot((b) => b ? {
					...b,
					frac
				} : {
					etaMs: estimateLoadMs(trackId, quality, night),
					frac
				}),
				onRestore: () => setRaceKey((k) => k + 1),
				onFinish: (r) => {
					const ok = r.eligible !== false;
					const isBest = ok ? recordBest(r.trackId, r.totalTime, {
						eligible: true,
						carId
					}) : false;
					setRecord(isBest);
					const ev = r.eventId ? getEvent(r.eventId) : null;
					const got = !ok ? 0 : ev ? starsFor(ev, r) : r.place === 1 ? 3 : r.place === 2 ? 2 : r.place === 3 ? 1 : 0;
					setEarned(got);
					if (ok && r.eventId) recordEventStars(r.eventId, got);
					if (ok && r.eventId?.startsWith("daily-")) markDailyDone(r.eventId.slice(6));
					if (ok && r.eventId?.startsWith("weekly-")) markWeeklyDone(r.eventId.slice(7));
					setStarTotal(totalStars());
					const pay = ok ? r.cash || racePayout(r) : 0;
					setCash(ok ? addCash(pay) : getCash());
					setResult(r);
				}
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
	(0, import_react.useEffect)(() => {
		if (screen !== "race") return;
		const onKey = (e) => {
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
	(0, import_react.useEffect)(() => {
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
		const mx = (x) => pad + (x - minX) * s;
		const mz = (z) => pad + (z - minZ) * s;
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
		ctx.lineWidth = 5;
		ctx.beginPath();
		for (let k = 0; k < Math.max(8, Math.floor(n * .32)); k++) {
			const p = pts[(start + k) % n];
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
	}, [hud]);
	const toggleNight = () => {
		const next = !night;
		setNight(next);
		setNightSave(next);
		engineRef.current?.setNight(next);
	};
	if (screen !== "race") return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
			ref: canvasRef,
			className: "block h-full w-full touch-none",
			onPointerDown: () => engineRef.current?.unlockAudio()
		}),
		boot ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BootOverlay, {
			etaMs: boot.etaMs,
			frac: boot.frac,
			langHe,
			city: langHe ? track.cityHe : track.cityEn,
			name: langHe ? track.nameHe : track.nameEn
		}) : null,
		hud && !result && !boot ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hud, {
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
		hud && !hud.photo && !boot ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TouchControls, {
			engine: engineRef.current,
			langHe
		}) : null,
		hud && hud.countdown > 0 && !boot ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "pointer-events-none absolute inset-0 z-30 flex flex-col items-center justify-center gap-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-6xl font-semibold tabular-nums tracking-tight text-fg",
					children: hud.countdown > 1 ? Math.ceil(hud.countdown) : t("סע!", "GO")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "rounded-full border border-border bg-surface/80 px-4 py-2 text-sm font-medium text-fg",
					children: t("W גז · A/D הגה", "W gas · A/D steer")
				}),
				hud.banter ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "max-w-md px-6 text-center text-sm font-medium text-fg",
					children: hud.banter
				}) : null
			]
		}) : null,
		paused && !result && !hud?.photo ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Overlay, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "text-2xl font-semibold tracking-tight",
			children: t("תפריט", "Menu")
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-5 flex flex-col gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: () => {
						setPaused(false);
						engineRef.current?.setPaused(false);
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-4" }), t("המשך", "Resume")]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					onClick: () => {
						engineRef.current?.restartRace();
						setPaused(false);
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "size-4" }), t("התחל מחדש", "Restart")]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					onClick: () => {
						setPaused(false);
						setScreen("title");
						setHud(null);
						setResult(null);
					},
					children: t("מסך ראשי", "Main menu")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					onClick: () => {
						const m = engineRef.current?.toggleMute() ?? !muted;
						setMuted(m);
						setMutedSave(m);
					},
					children: [muted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolumeX, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "size-4" }), muted ? t("מושתק", "Muted") : t("צליל", "Sound")]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-xs font-medium uppercase tracking-widest text-muted",
					children: t("הגדרות", "Settings")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					onClick: toggleNight,
					children: [night ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { className: "size-4" }), night ? t("יום", "Day") : t("לילה", "Night")]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: quality === "low" ? "primary" : "outline",
							className: "flex-1",
							onClick: () => {
								setQuality("low");
								setQualitySave("low");
								engineRef.current?.applyQuality("low");
							},
							children: t("נמוכה", "Low")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: quality === "mid" ? "primary" : "outline",
							className: "flex-1",
							onClick: () => {
								setQuality("mid");
								setQualitySave("mid");
								engineRef.current?.applyQuality("mid");
							},
							children: t("בינונית", "Mid")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: quality === "high" ? "primary" : "outline",
							className: "flex-1",
							onClick: () => {
								setQuality("high");
								setQualitySave("high");
								engineRef.current?.applyQuality("high");
							},
							children: t("גבוהה", "High")
						})
					]
				})
			]
		})] }) : null,
		result ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Overlay, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-xs font-medium uppercase tracking-widest text-muted",
				children: [
					langHe ? track.cityHe : track.cityEn,
					" · ",
					langHe ? track.nameHe : track.nameEn
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-2 text-3xl font-semibold tracking-tight",
				children: result.place === 1 ? t("ניצחון", "Victory") : t(`מקום ${result.place}`, `P${result.place}`)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 font-medium tabular-nums text-lg",
				children: formatTime(result.totalTime)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 text-sm text-muted",
				children: [
					t("הקפה הטובה", "Best lap"),
					" ",
					formatTime(result.bestLap)
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 flex flex-col gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: () => {
						setResult(null);
						setHud(null);
						setPaused(false);
						setRaceKey((k) => k + 1);
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "size-4" }), t("מרוץ נוסף", "Race again")]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
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
}
function GameApp() {
	const [screen, setScreen] = (0, import_react.useState)("title");
	const [trackId, setTrackId] = (0, import_react.useState)("ayalon");
	const [carId, setCarId] = (0, import_react.useState)("sabra");
	const [muted, setMuted] = (0, import_react.useState)(false);
	const [night, setNight] = (0, import_react.useState)(false);
	const [quality, setQuality] = (0, import_react.useState)("high");
	const [fov, setFov] = (0, import_react.useState)(0);
	const [lang, setLang] = (0, import_react.useState)("he");
	const langHe = lang === "he";
	const [handling, setHandling] = (0, import_react.useState)("arcade");
	const [assists, setAssists] = (0, import_react.useState)({
		abs: true,
		tcs: true,
		esc: true
	});
	const [mode, setMode] = (0, import_react.useState)("circuit");
	const [eventId, setEventId] = (0, import_react.useState)(null);
	const [starTotal, setStarTotal] = (0, import_react.useState)(0);
	const [weather, setWeather] = (0, import_react.useState)("clear");
	const [cash, setCash] = (0, import_react.useState)(500);
	const [tuneTick, setTuneTick] = (0, import_react.useState)(0);
	const engineRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (screen === "cars" || screen === "career" || screen === "garage") setScreen(screen === "cars" ? "race" : "tracks");
	}, [screen]);
	(0, import_react.useEffect)(() => {
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
	const t = (he, en, ar) => copy(lang, he, en, ar);
	const track = resolveTrack(trackId);
	const car = CARS.find((x) => x.id === carId) ?? CARS[0];
	const cycleLang = () => {
		const next = nextLang(lang);
		setLang(next);
		setLangSave(next);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		dir: dirFor(lang),
		className: "relative h-dvh w-full overflow-hidden bg-bg text-fg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RaceController, {
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
			engineRef
		}), screen !== "race" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, {
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
			setMuted: (m) => {
				setMuted(m);
				setMutedSave(m);
			},
			night,
			setNightMode: (n) => {
				setNight(n);
				setNightSave(n);
			},
			t,
			track,
			car,
			quality,
			setQualityMode: (q) => {
				setQuality(q);
				setQualitySave(q);
			},
			fov,
			setFovMode: (v) => {
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
			setHandlingMode: (h) => {
				setHandling(h);
				setHandlingSave(h);
			},
			assists,
			setAssistsMode: (a) => {
				setAssists(a);
				setAssistsSave(a);
			},
			onTuned: () => setTuneTick((n) => n + 1),
			startCareer: (id) => {
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
		}) : null]
	});
}
var routes_exports = /* @__PURE__ */ __exportAll({ component: () => Home });
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GameApp, {});
}
//#endregion
export { her as $, getCar as A, afl as B, emptyTune as C, tib as Ct, sampleGhostLoop as D, sampleGhost as E, skyAt as F, bsv as G, asd as H, skyFor as I, dsea as J, bym as K, streetName as L, getTrack as M, nearestPoi as N, CARS as O, nightAmt as P, hdr as Q, todLabel as R, applyTune as S, rsh as St, racePayout as T, tzf as Tt, ask as U, ard as V, bsn as W, gol as X, eil as Y, hai as Z, tcsModulate as _, pth as _t, setDamage as a, hwy90 as at, hasCops as b, rhv as bt, MAX_ACCUMULATOR as c, ksb as ct, WEATHER_SPEC as d, mas as dt, hol as et, absModulate as f, mod as ft, pacejka as g, nik as gt, hydroplane as h, net as ht, recordGhost as i, hwy6 as it, getEvent as j, RIVALS as k, PHYSICS_DT as l, ksm as lt, escYaw as m, naz as mt, getDamage as n, hwy2 as nt, DEFAULT_ASSISTS as o, hzl as ot, brakeForce as p, nah as pt, cae as q, getGhost as r, hwy40 as rt, HANDLING as s, jer as st, routes_exports as t, hwy1 as tt, SURFACE_SPEC as u, lodp as ut, MODE_LAPS as v, raa as vt, paceGhost as w, tlv as wt, WEATHER_GRIP as x, rml as xt, hasAiPack as y, ram as yt, acr as z };
