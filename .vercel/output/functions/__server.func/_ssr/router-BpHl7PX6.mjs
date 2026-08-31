import { _ as require_jsx_runtime, f as createRouter, g as createRootRoute, h as createFileRoute, l as Scripts, m as lazyRouteComponent, p as Outlet, u as HeadContent } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as TriangleAlert } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-BpHl7PX6.js
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
Math.PI * 2;
function clamp(v, a, b) {
	return Math.max(a, Math.min(b, v));
}
function lerp(a, b, t) {
	return a + (b - a) * t;
}
function lerpColor(a, b, t) {
	const u = clamp(t, 0, 1);
	const ar = a >> 16 & 255;
	const ag = a >> 8 & 255;
	const ab = a & 255;
	const br = b >> 16 & 255;
	const bg = b >> 8 & 255;
	const bb = b & 255;
	const r = Math.round(ar + (br - ar) * u);
	const g = Math.round(ag + (bg - ag) * u);
	const bl = Math.round(ab + (bb - ab) * u);
	return r << 16 | g << 8 | bl;
}
function expSmooth(current, target, lambda, dt) {
	return current + (target - current) * (1 - Math.exp(-lambda * dt));
}
function wrapPi(a) {
	return Math.atan2(Math.sin(a), Math.cos(a));
}
function forwardDelta(from, to, closed = true) {
	let d = to - from;
	if (closed) {
		if (d < -.5) d += 1;
		if (d > .5) d -= 1;
	}
	return d;
}
function catmullRom(p0, p1, p2, p3, t) {
	const t2 = t * t;
	const t3 = t2 * t;
	return .5 * (2 * p1 + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 + (-p0 + 3 * p1 - 3 * p2 + p3) * t3);
}
function mulberry32(seed) {
	let a = seed >>> 0;
	return () => {
		a += 1831565813;
		let t = a;
		t = Math.imul(t ^ t >>> 15, t | 1);
		t ^= t + Math.imul(t ^ t >>> 7, t | 61);
		return ((t ^ t >>> 14) >>> 0) / 4294967296;
	};
}
function hash01(...parts) {
	let h = 2166136261;
	for (const p of parts) {
		h ^= p | 0;
		h = Math.imul(h, 16777619);
	}
	return (h >>> 0) / 4294967296;
}
function hashStr(s) {
	let h = 2166136261;
	for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
	return (h >>> 0) / 4294967296;
}
function errorId(msg) {
	let h = 2166136261;
	for (let i = 0; i < msg.length; i++) h = Math.imul(h ^ msg.charCodeAt(i), 16777619);
	return `E-${(h >>> 0).toString(16).padStart(8, "0")}`;
}
function formatTime(sec) {
	if (!Number.isFinite(sec) || sec < 0) return "—";
	const m = Math.floor(sec / 60);
	const s = sec - m * 60;
	const whole = Math.floor(s);
	const ms = Math.floor((s - whole) * 100);
	return `${m}:${whole.toString().padStart(2, "0")}.${ms.toString().padStart(2, "0")}`;
}
function AppErrorComponent({ error }) {
	const id = errorId(error.message || "unknown");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 bg-bg px-6 text-center text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-danger",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold",
				children: "משהו השתבש"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-muted",
				children: error.message || "שגיאה לא צפויה. נסו לרענן."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-xs tracking-widest text-subtle",
				"data-error-id": id,
				children: id
			})
		]
	});
}
var styles_default = "/assets/styles-CBaPAbV3.css";
var APP_TITLE = "RUSH Israel — סימולטור נהיגה ישראלי";
var APP_DESCRIPTION = "Private owner-controlled Three.js WebGL simcade driving game on fictional routes inspired by Israeli places.";
var Route$1 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1, viewport-fit=cover"
			},
			{ title: APP_TITLE },
			{
				name: "description",
				content: APP_DESCRIPTION
			},
			{
				name: "theme-color",
				content: "#0a0c0e"
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			}
		]
	}),
	component: () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "he",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", {
			className: "antialiased",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})]
		})]
	})
});
var $$splitComponentImporter = () => import("./routes-DbBF9-mc.mjs").then((n) => n.t);
var rootRouteChildren = { IndexRoute: createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter, "component") }).update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$1
}) };
var routeTree = Route$1._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		defaultErrorComponent: AppErrorComponent
	});
}
//#endregion
export { formatTime as a, hashStr as c, mulberry32 as d, wrapPi as f, expSmooth as i, lerp as l, catmullRom as n, forwardDelta as o, __exportAll as p, clamp as r, hash01 as s, router_exports as t, lerpColor as u };
