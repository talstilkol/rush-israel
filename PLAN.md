# RUSH — ביקורת כנה (2026-08-26 00:57)

מקרא: **DONE** = בקוד, רץ, נבדק. **PARTIAL** = התחלה, לא המפרט. **NOT DONE** = לא נגענו. **FAKED** = סומן V בלי לעמוד במפרט.

**שום פריט מול GT7 / Unreal / GIS / "רחובות אמיתיים" לא בציון 100.**

100 מול מפרט זעיר בלבד: Esc, 120Hz, GitHub, דילוג NYC בישראל, כרטיסים בלי JPEG, איילון `open` 28מ׳, סוד לא ב־source, hook לא על grok-sandbox.com, bloom חלש, smear.

אין Unreal בסנדבוקס. אין OSM/DEM. זה Three.js.

---

## 0. פסק דין

אב־טיפוס WebGL. מאז 00:44: סוד הוסר, hook רק localhost, 0–100 נמדד ל־5 דגמים.  
**לא נסגרו:** רוטציית ברוקר, GIS, 6DoF, HDRI, CI, צילום איילון מול ייחוס, הקפאת מסלולים.

| תחום | דוח | עכשיו | אמת |
|---|---:|---:|---|
| GIS | 1 | 1 | lat/lon ידני |
| גרפיקה | 2 | 2.4 | צלליות. פרימיטיבים |
| רכב | 2 | 2.3 | flakes + תא. לא סריקה |
| תאורה | 2 | 2.1 | ACES, אין HDRI |
| פיזיקה | 2 | 2.6 | היבריד + 0–100 ±30% |
| AI | 2 | 2 | לא נגענו |
| תקינות | 1 | 2.7 | סוד בחוץ; hook לא בפיוויו; אין חתימת שיא |
| ביצועים | 3 | 3.2 | Low/Mid/High, לא מדוד 16.6ms |
| קוד | 3 | 3 | `@ts-nocheck` world/game-app |
| UX | 3 | 3.6 | Esc + כרטיסי צבע |
| Audio | 2 | 2 | oscillators |

---

## 1. Codex 24ש׳ / שבוע / חודש

| # | משימה | סטטוס | 100? | אמת |
|---|---|---|---|---|
| 24.1 סובב OAuth | **PARTIAL** | לא | הוסר מהמקור. **לא** סובבנו בברוקר |
| 24.2 חסום QA hook | **PARTIAL** | לא | `VITE_QA` או DEV+localhost. **אין** על grok-sandbox.com. `finishNow` חי ב־127.0.0.1 |
| 24.3 records אמינים | **PARTIAL** | לא | 8–2700ש׳ + eligible. אין hash |
| 24.4 בלי מצג שווא | **PARTIAL** | לא | כותרת מסלולים: "בהשראת, לא GIS". כרטיסי כביש 1/2/6/כרמל תוקנו. שאר התיאורים עדיין נשמעים כמו מקומות |
| 24.5 artifacts | **NOT DONE** | לא | |
| W1.1 CI בלי nocheck | **NOT DONE** | לא | |
| W1.2 save טרנזקציה | **NOT DONE** | לא | localStorage |
| W1.3 damage lifecycle | **PARTIAL** | לא | dents. אין CCD |
| W1.4 GPU soak | **PARTIAL** | לא | dispose כן |
| W1.5 envelope חתום | **PARTIAL** | לא | |
| W1.6 perf+headers | **NOT DONE** | לא | |
| M1 Unreal brief | **NOT DONE** | לא | אי אפשר כאן |
| M2 freeze 52 | **FAKED** | לא | המשכנו לגעת במסלולים |
| M3 legal | **NOT DONE** | לא | |
| M4 CRS | **NOT DONE** | לא | |
| M5 vehicle lab + compiler | **PARTIAL** | לא | 0–100 על איילון. אין משטח, אין road compiler |

Unreal/GIS שלבים 0–6 בדוח: **הכל NOT DONE**.

---

## 2. תוכנית ווב — אחת־אחת

### A גרפיקה
| # | סטטוס | 100? |
|---|---|---|
| A1 HDRI וולומטרי | **PARTIAL** | לא — קנבס |
| A2 ACES+GI | **PARTIAL** | לא — ACES בלי GI |
| A3 Cascades | **PARTIAL** | לא — צל אחד + blob |
| A4 Bloom חלש | **DONE** זעיר | כן מול "חלש" |
| A5 אופק | **PARTIAL** | לא |
| A6 אספלט סריקה | **PARTIAL** | לא — canvas |
| A7 SSR | **PARTIAL** | לא |
| A8 רוחב מציאות | **PARTIAL** | לא — רק איילון 28=8×3.5 |
| A9 מכוניות סרוקות | **PARTIAL** | לא — extrusion |
| A10 תא | **PARTIAL** | לא |
| A11 פנסים | **PARTIAL** | לא |
| A12 אפס גנריים | **PARTIAL** | לא — בלי NYC בישראל. סמלים=תיבות |
| A13 סמלים מדויקים | **PARTIAL** | לא — צללית |
| A14 ת״י | **PARTIAL** | לא — canvas |
| A15 עצים 3 LOD מרחק | **PARTIAL** | לא — לפי איכות |
| A16 DEM | **NOT DONE** | לא |
| A17 ים | **PARTIAL** | לא |
| A18 פוסט Asphalt | **PARTIAL** | לא |

### B פיזיקה
| # | סטטוס | 100? |
|---|---|---|
| B1 4×Pacejka | **PARTIAL** | לא — 34% kin seed |
| B2 Y חופשי | **PARTIAL** | לא — קפיץ |
| B3 תאוצה | **PARTIAL** | לא — 5 דגמים בתוך 30% על איילון. לא מעבדה |
| B4 הגה אנלוגי | **PARTIAL** | לא — slew, אין FFB |
| B5 OBB | **PARTIAL** | לא — AABB |
| B6 60fps | **PARTIAL** | לא |

### C ישראל
| # | סטטוס | 100? | אמת |
|---|---|---|---|
| C1 איילון | **PARTIAL** | לא | A→B, 28מ׳, נגד, 2 רמפות, רכבת זזה. לא GIS |
| C2 עזריאלי/ToHa | **PARTIAL** | לא | צללית פרימיטיבים |
| C3 רוטשילד | **PARTIAL** | לא | פיקוס + curtain |
| C4 הירקון | **PARTIAL** | לא | הילטון מוסט |
| C5 רידינג | **PARTIAL** | לא | ארובות. לא סריקה |
| C6 יפו | **PARTIAL** | לא | שעון מוסט |
| C7 ירושלים | **PARTIAL** | לא | קשת. אין DEM |
| C8 רמון/חרמון/כרמל | **PARTIAL** | לא | פרימיטיבים |

### D / G
| # | סטטוס |
|---|---|
| D1 Esc | **DONE** זעיר |
| D2 i18n | **PARTIAL** |
| D3 כרטיס=runtime | **PARTIAL** — צבע, לא צילום |
| G0–G7 | **PARTIAL** |
| G8 smear | **DONE** זעיר |
| G9 WebGPU | **NOT DONE** |

---

## 3. FAKED אם מישהו סימן V על

- "tire-only yaw" — 34% kinematic
- "רחובות אמיתיים / GIS" — נקודות ידניות
- "freeze 52" — המשכנו לערוך
- "סוד סובב" — רק הוסר מהריפו
- "0–100 מעבדה" — איילון + TCS, ±30%
- GT7 / Unreal / Nanite / Lumen

---

## 4. תוכנית ביצוע — להשלים את הכל

שתי מסילות. בלי לערבב.

### מסילה W (כאן, יעד Asphalt-like)

**W0 — P0 שנשאר**
1. רוטציית ברוקר — מחוץ לסנדבוקס. כאן: לוודא שאין hex ב־git history בלי rewrite (לא נדרש אם המפתח כבר דלף).
2. שיאים: `physicsVersion` + hash; reject אם לא תואם.
3. תיאורי מסלול: "בהשראת", לא "כביש 20 / GPS".
4. CI: lint על `physics.ts`+`vehicle.ts`; אסור `@ts-nocheck` חדש.
5. soak 100 מחזורי תפריט↔מרוץ.

**W1 פריים**
1. לוג ms ב־DEV.
2. fps<50 → כיבוי planar→bloom→צל.

**W2 כביש**
1. Shader ייעודי.
2. Planar 256 High+לילה.
3. `laneWidth≈3.5` בכל המסלולים.

**W3 רכב**
1. טלמטריה: אחוז kin מול tire (לא להסתיר).
2. טסט 0–100 ב־CI (המדידה כבר ידנית).
3. בלי double-count spin.
4. איירבורן 12ms.
5. OBB מסובב.

**W4 איילון — סגירה**
1. צילום מול ייחוס השלום. **NOT DONE**
2. הקפאה אמיתית עד שהצילום עובר.
3. סבידור ייחודי.
4. 4 מחלפים ויזואליים: לגשר או למחוק.

**W5 אחרי W4** — רוטשילד → יפו → ירושלים → רמון → חרמון → כרמל. כל אחד: 8 סמלים + offset + צילום.

**W6 לא לעשות:** אונליין, גאראז׳, 50 מכוניות, Unreal בדפדפן, WebGPU לפני W2.

### מסילה U (מחוץ לסנדבוקס, חודשים)
GEO-01..VS-16 מהדוח. Unreal 5.8, EPSG:2039, Chaos Vehicle ±5%. **לא כאן.**

---

## 5. סדר `המשך` הבא

G0 Sprint 1 **PARTIAL**: telemetry, 12 מצלמות, probe, inventory, exposure 0.68, three pinned.  
לא: WebGPURenderer, TSL, GIS, hero GLB, CI forced-WebGL.

הבא: G1-01 RendererFacade דק סביב WebGLRenderer הקיים — בלי להחליף world.ts.

---

**שורה אחת:** רוב ה־V = **PARTIAL**. היחידים 100 מול מפרט זעיר הם Esc / 120Hz / GitHub / כרטיסי צבע / איילון פתוח / סוד בחוץ / hook לא בפיוויו. GIS, Unreal, 6DoF, HDRI, CI — **NOT DONE**.
