# חורים מול קודקס + תוכנית ביצוע לתתי-סעיפים

**תאריך:** 26 באוגוסט 2026  
**כנה:** EXECUTION_PLAN 0–42 + TECH_RESEARCH מכסים את **גרעין הגרפיקה**. למטה כל מה שנשאר דק, בלי מספר, או בלי מתכון קובץ-שורה.  
**אין קוד בסשן הזה.**

מקרא לרשימה:
- **חסר לגמרי** = לא היה סעיף ממוספר עם מתכון.
- **דק** = היה כותרת בלי 4 רמות / בלי קובץ / בלי שער.
- **מחוץ למסגרת** = קודקס הזכיר, כאן נעול "לא עושים".

---

## חלק 1 — הרשימה המלאה

### 1.1 קודקס 26 סעיפים (מסמך 25.8.2026)

| § קודקס | בעץ? | חור |
|---|---|---|
| 1.1 Ultra WebGPU | 8.7 דק | אין רשימת API שנשברת (Reflector/composer/CSM.js) כצ'קליסט קבצים |
| 1.1 Balanced | 33 דק | אין `csmCascades` ב-QualityProfile עדיין |
| 1.1 Compat | 33 | חסר: 30fps clamp ב-engine |
| 1.1 Photo cinematic | 8.7.4 | חסר DoF / motion blur / supersample — לא נעול |
| 1.2 אותו בסיס נכסים | חסר | אין טבלת LOD0/1/2 לכל סוג נכס |
| 2 renderer modern | 8 | חסר `await init()` צ'קליסט שגיאות |
| 3 color/exposure | 7, 34 | EnvironmentState לא מחובר ל-engine |
| 4 glTF/KTX2/Meshopt | 9.1 דק | אין שורת `toktx` / נתיב transcoder (יש `public/basis/`!) |
| 5 world cells | 9.4 דק | אין גודל תא, היסטרזיס, unload |
| 6 road dry/wet | 3.3 | אין micro-normal / puddle UV, רק roughness |
| 7 WebGPU+TSL | 8.2–8.3 | אין קובץ כניסה `three/webgpu` מול `three` |
| 8 CSM+probes | 8.4 | אין מיקום 3 probes באיילון |
| 9 TRAA/TAAU | 8.5 | נעול WebGPU; חסר "מה אם אין TRAANode ב-r185" |
| 10 weather/SSGI/vol | 17 | חסר תקציב ms ו-feature flag |
| 11 streaming | חסר | תור טעינת glb/png |
| 12 art direction | דק | LOOKS לא בשימוש |
| 13 QA קשוח | 15 | חסר histogram לילה סקריפט |
| 14 MRT | **חסר לגמרי** | |
| 15 GPU-driven | **חסר** | |
| 16 HLOD/impostor | **חסר** | |
| 17 cleanup three | 2.4 דק | אין רשימת dispose לפי אובייקט |
| 18 debug hooks shipping | 1.2 | אין `check-qa-hook.mjs` כתוב |
| 19 CI WebGPU+WebGL2 | 10.4 | אין מטריצת CI |
| 20 no secrets | PLAN 24.1 | אין grep secrets |
| 21 photo stills marked | דק | אין watermark "Photo Mode" |
| 22 lookdev | EnvironmentState | לא מחובר |
| 23 G5 facade atlas | **דק מאוד** | |
| 24 G6 headlight cookies | A11 דק | |
| 25 G4 blob spec | דק | גודל/גובה לא נעולים |

### 1.2 קודקס 24ש׳ / שבוע / חודש (PLAN.md §1)

| ID | בעץ? | חור |
|---|---|---|
| 24.1 OAuth rotate | מחוץ | רק "אין hex ב-src" |
| 24.5 artifacts | **חסר** | תיקייה, שמות קבצים |
| W1.1 CI בלי nocheck | 1.4 דק | אין job |
| W1.2 save טרנזקציה | **חסר** | |
| W1.3 damage/CCD | 5.5 דק | אין 12ms airborne מתכון |
| W1.5 envelope חתום | 1.3 | hash בלי HMAC — חסר JSON schema |
| W1.6 perf headers | **חסר** | Cache-Control למשחק |
| M1 Unreal | מחוץ | נעול לא |
| M2 freeze 52 | 6.5 | חסר hash קבצים |
| M3 legal | **חסר** | LICENSES.md תבנית |
| M4 CRS/EPSG | מחוץ | נעול לא |
| M5 vehicle lab | 25 | אין `qa:accel` schema |

### 1.3 A/B/C/D/G שנשאר דק

| ID | חור |
|---|---|
| A5 אופק | אין טבלת fogDensity לכל theme |
| A10 תא | אין שמות mesh + vis chase/hood |
| A11 פנסים | אין cookie, צבע, dist |
| A14 ת״י | מותר PNG קיים; חסר "אסור canvas חדש" כשער grep |
| A15 עצים | אין מטר LOD0/1/2 |
| A17 ים | foam/normal — אין גובה גל |
| A18 פוסט Asphalt | smear יש; חסר chromatic/vignette lock |
| B4 gamepad | 27 דק — אין קובץ+עקומה מלאה |
| B6 60fps | 2.3 — אין clamp Low=30 |
| D2 i18n | **חסר** |
| D3 כרטיס≠צילום runtime | **חסר** — כרטיסים הם JPEG סטטי |
| G5 atlas | **חסר מתכון UV** |
| G6 cookies | **חסר** |

### 1.4 מוצרים בריפו שלא בקודקס / צריך נעילה

| קובץ | החלטה חסרה |
|---|---|
| `career.ts` `garage.ts` `daily.ts` | למחוק / להשאיר מתים |
| `src/lib/multiplayer` | למחוק / לא לגעת |
| `src/lib/auth` | לא קודקס מירוץ — לא לגעת |
| PWA grok | לא קודקס — לא לגעת |
| `audio.ts` oscillators | להשאיר, לא FMOD |
| `canvasInventory.ts` | חסר שער grep אוטומטי |

### 1.5 מה שכבר מכוסה (לא ברשימת החורים)

21.1–21.8 בוצעו חלקית. 3.1 CSM chain, 3.2 UV dashes, 2.2 cascade, NYC import, inspired copy, kinMix, qa:ramp, TECH_RESEARCH D1–D20.

---

## חלק 2 — מחקר קצר לכל חור + מתכון ממוספר

### 43. Photo cinematic (קודקס 1.1.4)

43.1. מחקר: DoF ב-three WebGL = `BokehPass` (יקר). Motion blur = `AfterimagePass` או smear הקיים. SSAA = `SSAAPass` יקר.  
43.2. **החלטה:** Photo WebGL = DPR 1.35 + smear קיים + **בלי** BokehPass.  
43.3. Photo WebGPU (אחרי 8.2): `dof` TSL אופציונלי, target 30fps.  
43.4. Watermark: HUD "מצב צילום / Photo Mode" כש-`photo===true`. קובץ: `game-app.tsx`.  
43.5. שער: צילום עם הטקסט; p95 לא נמדד כ-drive.

### 44. MRT / deferred (קודקס 15)

44.1. מחקר: WebGL2 MRT קיים; three deferred לא סטנדרטי למשחק מירוץ קטן.  
44.2. **החלטה: לא MRT.** Forward + SMAA.  
44.3. לא לפתוח שוב.

### 45. GPU-driven / compute (קודקס 15)

45.1. TSL compute = WebGPU. InstancedMesh כבר CPU matrices.  
45.2. **החלטה:** אין compute particles. Sparks נשארים JS.  
45.3. אחרי WebGPU: אופציונלי compute לעצים — לא שער.

### 46. HLOD / impostor קו רקיע

46.1. Asphalt: billboard רחוק.  
46.2. **החלטה:** אחרי freeze איילון, עזריאלי+ToHa מעל 420m = `THREE.Sprite` 256px baked **קיים** (לא canvas חדש).  
46.3. מתכון: 46.3.1 צילום אורתו מהמשחק → PNG `azrieli-impostor.png` (אפייה **חד-פעמית** מותרת אחרי 6.5). 46.3.2 Sprite במרחק. 46.3.3 mesh מלא נכבה >420m.  
46.4. לפני 6.5: לא.

### 47. World cells — מספרים

47.1. **החלטה:** תא 256×256m, היסטרזיס טעינה 64m, unload 320m.  
47.2. איילון כולו תא אחד עד freeze (המסדרון קצר).  
47.3. אחרי 6.5: `world/cells.ts` `cellId(x,z)=floor(x/256)+":"+floor(z/256)`.  
47.4. קבוצות: `cell-azrieli`, `cell-savidor`, `cell-south`.  
47.5. שער: מעבר תא לא מייצר GC spike >8ms ב-p95.

### 48. Probes איילון

48.1. היום: cube 96 אחד.  
48.2. **החלטה:** 3 probes אחרי freeze: t=0.2 דרום, t=0.48 השלום, t=0.72 סבידור. גודל 64 (לא 256).  
48.3. רענון: פעם בכניסה למסלול + החלפת יום/לילה. לא כל פריים.  
48.4. קובץ: `engine.ts` `bakeProbes()`.  
48.5. WebGPU: אותם probes, בלי Reflector.

### 49. KTX2 — שורה מחייבת

49.1. Transcoder **כבר** ב-`public/basis/`. Loader חייב `setTranscoderPath("/basis/")`.  
49.2. Encode (כשיש PNG מקור, לא עכשיו):

```
toktx --2d --genmipmap --t2 --encode uastc --uastc_quality 2 --zcmp 18 out.ktx2 in.png
```

49.3. אלbedo כביש: UASTC. UI: ETC1S. HDR: לא KTX2 — RGBE.  
49.4. בלי `toktx` בסנדבוקס: לא ממירים. 9.1 נשאר NOT DONE.  
49.5. שער: קובץ `.ktx2` ב-`public/game/` + טעינה ב-High בלי שגיאת console.

### 50. G5 Facade atlas

50.1. **החלטה:** ישראל — **אפס** canvas. NYC נשאר canvas עד 35.3.  
50.2. אטלס ישראל רק מצילום CC0/משתמש, 2048, 4×4 חזיתות, UV `atlasIndex` על InstancedMesh.  
50.3. בלי תמונות: לא אטלס. קוביות עם `curtain-*.png` הקיימים.  
50.4. מתכון אחרי 6.5: `public/game/facade-tlv.ktx2` או PNG.  
50.5. שער: `canvasInventory` = probe בלבד **לבילד ישראל** (NYC chunk נפרד).

### 51. G6 Headlight cookies

51.1. מחקר: `SpotLight.map` ב-three = cookie.  
51.2. **החלטה:** High+לילה בלבד. 2 SpotLight על הרכב, `map=beam.png` **הקיים**, angle 0.42, dist 38, intensity 1.8 לילה / 0 יום.  
51.3. אין atlas חדש.  
51.4. קובץ: `car-mesh.ts` / vis headlights.  
51.5. שער: צילום לילה g08 עם כתם אור על האספלט, לא מלבן.

### 52. G4 Blob — מספרים

52.1. Plane 4.2×2.1m, y=0.04 מעל הכביש, opacity 0.38 יום / 0.55 לילה.  
52.2. עוקב `player.x/z/yaw`.  
52.3. Low: נשאר. CSM mute: נשאר.  
52.4. לא ellipse shader.

### 53. A5 Fog לכל theme

| theme | day density | night | far |
|---|---|---|---|
| ayalon/city | 0.000012 | 0.00016 | 10000 |
| desert/ramon | 0.00006 | 0.00012 | 12000 |
| snow/hermon | 0.00004 | 0.0001 | 12000 |
| carmel | 0.00002 | 0.0001 | 12000 |
| stone/jerusalem | 0.00003 | 0.00012 | 8000 |

53.1. לא volumetric clouds.  
53.2. שער: scopus/ramon/hermon בלי חיתוך אופק (כבר far 12000).

### 54. A10 תא / A15 עצים / A17 ים

54.1. Hood: `glass.visible=false` אם השם כולל `glass`. Chase: `dash.visible=false`.  
54.2. עצים: LOD0 <80m, LOD1 80–180, hide >180. לפי `distanceTo(player)` לא לפי quality בלבד.  
54.3. ים: `foam.png` + `water-n` offset 0.04/0.026 (קיים). גל ±0.06m. לא FFT.  
54.4. שער עצים: 2 draw calls (קרונה+גזע instanced).

### 55. A18 פוסט

55.1. **החלטה:** smear קיים. Vignette ב-GRADE `uNight` בלבד. **אין** chromatic aberration (זול-נראה-רע).  
55.2. Bloom 0.11 לילה High בלבד — לא לגעת.

### 56. EnvironmentState חיבור

56.1. `lookFromFlags` → `gfx.setEnvironment(LOOKS[id].exposure)`.  
56.2. `wetness` → `roadMat.userData.uWet`.  
56.3. קובץ: `engine.ts` `applyLook()`.  
56.4. שער: החלפת rain משנה exposure בלי reload.

### 57. LookDev / golden

57.1. 12 מצלמות ב-`goldenCameras.ts` — קיימות.  
57.2. `qa:ayalon` חייב לצלם g01/g07/g08 לפחות.  
57.3. pixelmatch: threshold 0.12, fail אם >8% פיקסלים.  
57.4. סקריפט: `scripts/pixel-golden.mjs` (לא קיים — זה החור).  
57.5. שער 10.3 = הסקריפט ירוק.

### 58. Histogram לילה

58.1. Playwright קורא 4 שורות מהקנבס, ממוצע luma.  
58.2. יום: 0.22–0.72. לילה: 0.08–0.38. לא 0, לא 0.95.  
58.3. `scripts/luma-qa.mjs`.  
58.4. אחרי 6.5.

### 59. `check-qa-hook.mjs`

59.1. `npm run build && rg finishNow dist` — נכשל אם מופיע מחוץ ל-comment.  
59.2. יעד: `import.meta.env.VITE_QA` נמחק בפרוד → dead-code-elim.  
59.3. `package.json` `"check:qa": "node scripts/check-qa-hook.mjs"`.  
59.4. שער 10.5.

### 60. `qa:accel` schema

```json
{ "physicsVersion": 3, "track": "ayalon", "runs": [
  { "carId": "sabra", "t": [8.1, 8.4, 8.0], "mean": 8.17, "target": 8.4, "tol": 0.3 }
]}
```

60.1. 5 דגמים, 3 ריצות, TCS/ABS/ESC off.  
60.2. Fail אם mean מחוץ ל-±30% מ-25.2.  
60.3. שער 10.7.

### 61. Records JSON (1.3)

```json
{ "t": 123.45, "trackId": "ayalon", "carId": "sabra", "physicsVersion": 3,
  "hash": "sha256 hex of trackId|carId|t|physicsVersion" }
```

61.1. localStorage key `rush.records.v3`.  
61.2. אין HMAC.  
61.3. טסט: `scripts/records.test.mjs` גרסה 2 נדחית.

### 62. Save טרנזקציה (W1.2)

62.1. **החלטה:** localStorage + `JSON.stringify` אטומי למפתח אחד. אין IndexedDB.  
62.2. כתיבה: `writeRecords(arr)` מחליף את המפתח בשלמות.  
62.3. לא pglite למשחק.

### 63. CCD / airborne 12ms (W1.3)

63.1. אם `y > groundY + 0.55` ל-12ms רצופים: `airborne=true`, לא clamp עליון 0.5 (היום ה-clamp מונע טיסה — **זה באג מול המפרט**).  
63.2. מתכון: להעלות clamp ל-`groundY+8` כש-vy>2; רמפות נשארות snap.  
63.3. **אחרי** 21.8, סשן נפרד. סיכון: רכב נופל מאיילון.  
63.4. שער: רמפה עם y1-y0>5 לא מפעילה airborne; קפיצה מדרכה כן.

### 64. Damage lifecycle

64.1. dents visual: כבר.  
64.2. `damage` 0–1 מוריד grip (קיים).  
64.3. אין תיקון במהלך מרוץ. Esc לא מאפס. Restart מאפס.  
64.4. לא מערכת ספיירים.

### 65. Gamepad (27 / B4)

65.1. קובץ: `input.ts`.  
65.2. `axes[0]` → `sign(x)*pow(|x|,1.6)` אם `|x|>0.12`.  
65.3. `axes[1]` או `buttons[7]` = throttle; `buttons[6]` = brake.  
65.4. אין FFB.  
65.5. שער: qa:drive עם override נשאר מקלדת.

### 66. Low 30fps clamp

66.1. `lite`: אם dt<1/28, skip render כל פריים שני. פיזיקה 120Hz נשארת.  
66.2. לא vsync תכנותי.

### 67. i18n (D2)

67.1. כל מחרוזת UI ב-`i18n.ts`. אסור עברית ב-`engine.ts`.  
67.2. כרטיסי מסלול כבר he/en.  
67.3. שער: grep `game-app.tsx` בלי עברית מחוץ ל-`langHe ?`.

### 68. כרטיסי JPEG (D3)

68.1. `public/tracks/*.jpg` = תמונות תפריט, **לא** runtime 3D.  
68.2. אסור לטעון אותן כ-texture עולם.  
68.3. שער: grep `tracks/` מחוץ לקומפוננטת תפריט.

### 69. Dead code

69.1. **החלטה:** לא מוחקים `career.ts`/`garage.ts`/`multiplayer` בסשן גרפיקה (סיכון רגרסיה).  
69.2. אחרי freeze: לא לייבא מ-`game-app` — tree-shake.  
69.3. אסור פיצ'רי אונליין חדשים.

### 70. Audio

70.1. oscillators נשארים.  
70.2. אין FMOD/Howler.  
70.3. mute ב-Esc settings (קיים).  
70.4. לא שער גרפיקה.

### 71. Cleanup / dispose

71.1. `world.dispose` = bag + geometries.  
71.2. `csm.dispose()` לפני `gfx.dispose()`.  
71.3. `leases.disposeAll()`.  
71.4. Soak 20 מחזורים: textures delta ≤2. סקריפט: `soak-menu-race.mjs` (קיים).  
71.5. שער 10.12: להריץ ולהצמיד לוג.

### 72. CI matrix

72.1. Job1: `tsc && qa:drive && qa:ramp && qa:webgl2`.  
72.2. Job2: `vite build && check:qa`.  
72.3. Job3 WebGPU: N/A עד 8.2; אז `forceWebGL` smoke.  
72.4. אין GitHub Actions חובה בסנדבוקס — סקריפט `npm test` מריץ unit.  
72.5. `package.json` `"qa": "npm run qa:drive && npm run qa:ramp && npm run qa:webgl2"`.

### 73. Secrets grep

73.1. `scripts/brand-check` / `rg "sk-|apiKey|BEGIN RSA" src`.  
73.2. שער: אפס התאמות ב-`src/game`.

### 74. Perf headers

74.1. Vite preview: `Cache-Control: public, max-age=31536000, immutable` ל-`/game/*` ו-`/basis/*`.  
74.2. `index.html` no-cache.  
74.3. לא Cloudflare כאן.

### 75. LICENSES.md תבנית (M3)

```
# public/game/LICENSES.md
- asphalt-*.png: generated procedural, no third-party photo
- sky-*.png: generated
- Kenney (if added): CC0 URL
- Poly Haven HDRI (if added): CC0 URL + filename
- hero glTF: user-supplied / NOT PRESENT
```

75.1. בלי הקובץ: אסור לייבא hero.

### 76. WebGPU init צ'קליסט (8.1)

76.1. `import { WebGPURenderer } from "three/webgpu"`.  
76.2. `const r = new WebGPURenderer({ antialias:false, forceWebGL: !wantGpu, powerPreference:"high-performance" })`.  
76.3. `await r.init()`.  
76.4. אם throw: נפילה ל-WebGLRenderer הקיים, לוג `[gfx] webgpu fail`.  
76.5. כבוי: Reflector, EffectComposer הישן, CSM.js, `onBeforeCompile` כביש.  
76.6. דולק: probe, TSL road (סשן נפרד), SMAA node או FXAA.  
76.7. שער: `?webgpu=1` לא שובר `qa:drive` על מכונה בלי GPU (forceWebGL).

### 77. TRAA אם אין TRAANode ב-r185

77.1. בדיקה: `import("three/tsl").then(m => "TRAANode" in m || "traa" in m)`.  
77.2. אם אין: Photo WebGPU = SMAA. לא TAARenderPass.  
77.3. **החלטה:** לא לכתוב TRAA ידני.

### 78. SSGI flag

78.1. `SSGI_OFF = true` קבוע ב-`postfx.ts`.  
78.2. וולומטרי: fog Exp2 בלבד.  
78.3. גשם: Points קיימים. לא חלקיקי GPU.  
78.4. לפתוח SSGI רק אם p95 High <12ms אחרי 4.2+6.5 — כמעט בטוח לא.

### 79. Streaming תור

79.1. `assemble()` כבר ממתין ל-PNG.  
79.2. **החלטה:** לא mesh streaming עד cells (47).  
79.3. NYC `import()` כבר 21.4.

### 80. 30fps / pixel (Asphalt)

80.1. High desktop: pixelScale 0.85 (כמו 50–85% 3D).  
80.2. לא 50% אוטומטי — 21.6 מוריד אם p95>20.  
80.3. נעול.

### 81. Impostor + Azrieli bands (6.2 פירוט)

81.1. Mesh גוף: 3 צילינדרים/פריזמות קיימים.  
81.2. פסי קומות: `InstancedMesh` `BoxGeometry(w, 0.35, d)` count= floors.  
81.3. square 187, circular ~49 rings או 1 torus per 4 floors — **מקס 3 InstancedMesh** לשלושת המגדלים.  
81.4. לא 49 `Mesh`.  
81.5. סשן 21.10 אחרי 21.9 (צילום) **או** אם המשתמש אומר להמשיך בלי צילום.

### 82. Freeze hash (6.5)

82.1. `scripts/ayalon-hash.mjs` sha256 של `world.ts` שורות ayalon + `tracks.ts` ayalon block.  
82.2. כותב `golden-baseline/ayalon.lock`.  
82.3. CI נכשל אם hash זז בלי bump `AYALON_LOCK=2`.

### 83. Landmark offset test (21.12)

83.1. Playwright: `getColliders` ליד spline, min dist > width/2+2.  
83.2. חסר hook `getColliders` — להוסיף בסשן.  
83.3. שער: איילון piers כבר הוזזו; טסט מוודא.

### 84. מה *לא* ייכתב יותר (נעילה נוספת)

84.1. Pedestrians.  
84.2. Traffic AI שיפור.  
84.3. Windshield rain drops.  
84.4. Tire mark decal persistence.  
84.5. FFT ocean.  
84.6. Volumetric clouds.  
84.7. Rapier/Cannon.  
84.8. OSM/DEM.  
84.9. Unreal.  
84.10. AgX עד HDRI+LUT.  
84.11. MRT.  
84.12. pmndrs/postprocessing.

---

## חלק 3 — סדר סשנים מעודכן (אחרי 21.8)

21.9 עצירה לצילום השלום.  
21.10 עזריאלי InstancedMesh (81).  
21.11 `check-qa-hook` (59) + records schema (61) — מותר במקביל ל-21.9 כי לא איילון-ארט.  
21.12 `qa:accel` (60).  
21.13 LookDev connect (56) + fog table (53).  
21.14 Headlight cookies (51).  
21.15 Blob numbers (52).  
21.16 pixel-golden (57).  
21.17 Low 30fps (66).  
21.18 Gamepad curve (65).  
21.19 Freeze hash (82) **רק אחרי 6.1**.  
21.20 `?webgpu=1` (76).

הפרת 21.19 לפני 6.1 = הפרת 0.3.

---

**סוף.** כל חור מקודקס 26 / 24ש׳ / A–G שיש לו משמעות בווב יש עכשיו מספר 43–84. אין סעיף קודקס גרפיקה בלי תשובה.
