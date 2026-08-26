# RUSH — מחקר טכנולוגי והחלטות נעולות

**תאריך:** 26 באוגוסט 2026  
**מסגרת:** דפדפן, `three@0.185.1`, בלי Unreal/Unity/Babylon.  
**יעד ריאלי:** Asphalt Legends / CarX Street במובייל-ווב. לא GT7.  
**סטטוס קוד:** ~13%. שערי שחרור 0/13.

כל סעיף מסתיים ב-**החלטה.** אין "נבדוק אחר כך".

מקורות: [WebGPURenderer](https://threejs.org/docs/pages/WebGPURenderer.html) · [TSL](https://threejs.org/docs/TSL.html) · [KTX2Loader](https://threejs.org/docs/pages/KTX2Loader.html) · [three#28957 nodes≠WebGLRenderer](https://github.com/mrdoob/three.js/issues/28957) · [discourse WebGPU slower on many meshes](https://discourse.threejs.org/t/why-webgpurenderer-performance-significantly-lower-than-webglrenderer/77629) · [Instanced vs Batched](https://discourse.threejs.org/t/how-to-choose-between-instancedmesh-and-batchedmesh/81221) · Poly Haven CC0 HDRI.

---

## 1. מה שובר את התמונה אצלנו (חולשות אמיתיות)

לא חסר "יותר פוליגונים". חסר **חומר + תאורה + זהות**.

| חולשה | למה זה נראה זול | מה *לא* יתקן |
|---|---|---|
| שמיים PNG / Sky פרוצדורלי | אין IBL, רכב/כביש מתים | עוד bloom |
| extrusion רכב | צללית לא GT | 200k פולי בלי סריקה |
| סמלים primitives | מזוהה, לא מצולם | GIS |
| composer+CSM+Reflector | שלושה מעברים כבדים | WebGPU כקסם |
| Pacejka+crawl | simcade | Rapier 3D על ספליין |
| 0 KTX2 | PNG לא דחוס GPU | "פייפליין" בלי קבצים |

**החלטה 1.1:** תקציב הפריים והזהות (כביש מבריק, רכב, HDRI, סמל איילון) לפני WebGPU ולפני מסלולים חדשים.

---

## 2. Renderer

| אפשרות | יתרון | חיסרון אצלנו | מתאים? |
|---|---|---|---|
| `WebGLRenderer` (היום) | EffectComposer, CSM.js, Reflector, `onBeforeCompile` לכביש | אין TSL, אין TRAANode | **כן — ברירת מחדל** |
| `WebGPURenderer` בלי `forceWebGL` | TSL, PostProcessing nodes, CSMShadowNode | `await init()`, שובר Reflector/CSM.js/composer הישן; בשיח three לעיתים **איטי פי 2–4** על הרבה mesh לא-instanced | רק דגל |
| `WebGPURenderer({forceWebGL:true})` | TSL על backend WebGL2 | עדיין לא CSM.js/Reflector; שכבת פוסט אחרת | CI / בדיקת TSL |
| Babylon / PlayCanvas | CSM/PBR בוגר | זריקת כל המשחק | **לא** |
| Unity/Unreal Web | Nanite/Lumen | מחוץ למסגרת | **לא** |

**החלטה 2.1:** ברירת מחדל נשארת `WebGLRenderer`.  
**החלטה 2.2:** `?webgpu=1` רק אחרי 21.8 + רמפה ירוקה. דורש `await renderer.init()`.  
**החלטה 2.3:** בנתיב WebGPU: בלי Reflector, בלי EffectComposer הישן, בלי `onBeforeCompile`. פוסט = `three/tsl` `PostProcessing`.  
**החלטה 2.4:** אם WebGPU p95 גרוע מ-WebGL באותה סצנה — הדגל נשאר כבוי. לא "Ultra" אוטומטי.

---

## 3. חומרים / שיידרים

| אפשרות | רץ על | שימוש |
|---|---|---|
| `MeshPhysicalMaterial` + GLSL inject | WebGLRenderer | כביש/צבע **עכשיו** |
| `MeshPhysicalNodeMaterial` + TSL | WebGPURenderer בלבד (גם כש-backend=WebGL2) | אחרי 2.2 |
| `ShaderMaterial` מלא | שניהם, כפול תחזוקה | **לא** לכביש |
| pmndrs/postprocessing | WebGL | סטאק שלישי — **לא** |

CSM.js **דורס** `onBeforeCompile`. שרשור אחרי `setupMaterial` הוא החובה (כבר ב-21.7).

**החלטה 3.1:** כביש נשאר GLSL inject על Physical. לא TSL עד WebGPU.  
**החלטה 3.2:** לא לכתוב שני שיידרים במקביל. שכפול TSL = סשן נפרד אחרי שהנתיב WebGPU מציג פריים.  
**החלטה 3.3:** `metalness=0` על אספלט וצבע רכב. כרום רק על trim.

---

## 4. אנטי-אליאסינג

| | איכות | עלות | הערות |
|---|---|---|---|
| MSAA native | חדה | נשברת עם composer | כבוי כשיש פוסט |
| FXAA | חלש | זול | נראה סבון |
| SMAA | טוב | בינוני | **High/Mid היום** |
| SSAA | מעולה | יקר | Photo בלבד אם בכלל |
| `TAARenderPass` | מריחה | בלי reprojection | **לא TRAA** |
| `TRAANode` | ייצוב אמיתי | WebGPU | Photo WebGPU בלבד |

**החלטה 4.1:** SMAA Mid+High. Low בלי פוסט.  
**החלטה 4.2:** TRAA לא על WebGL. לא לסמן "TAA".  
**החלטה 4.3:** Photo WebGL = SMAA + DPR bump. Photo WebGPU (אם 2.2) = TRAANode אופציונלי.

---

## 5. צללים

| | מתאים | |
|---|---|---|
| `CSM.js` examples | WebGLRenderer | **High 2×1024 היום** |
| `CSMShadowNode` | WebGPU | נתיב 2.2 בלבד |
| אור אחד PCF | Low/Mid | Mid: 1×512 אחרי 8.4 |
| VSM | רך מדי, bleed | **לא** |
| RT shadows | לא ב-three יציב | **לא** |

**החלטה 5.1:** לא מחליפים CSM.js כל עוד WebGL.  
**החלטה 5.2:** mute (21.6) במקום dispose — ה-defines נשארים.  
**החלטה 5.3:** Blob shadow על הרכב נשאר תמיד (Asphalt עושה את זה).  
**החלטה 5.4:** 3 cascades רק אם p95 < 16ms אחרי freeze. ברירת מחדל 2.

---

## 6. השתקפויות / GI

| | |
|---|---|
| `Reflector` 768 | WebGL, High, yaw follow. **לא** WebGPU |
| SSR מסך | אין פתרון three יציב וזול לנהיגה | **לא** |
| Cube probe 96 | IBL מקומי. להשאיר | |
| HDRI PMREM | IBL עולמי. חסר קובץ | אחרי הורדת `.hdr` |
| GTAO half-res | AO זול יחסית | High בלבד, אחרי freeze, ≤2ms |
| SSGI / Lumen-like | יקר, לא 60Hz ווב | **כבוי לתמיד בנהיגה** |

**החלטה 6.1:** Reflector נשאר WebGL High. ב-WebGPU — probe בלבד.  
**החלטה 6.2:** SSGI לא נכנס לנתיב drive.  
**החלטה 6.3:** GTAO רק אם 21.6 לא מוריד planar כבר ב-p95.

---

## 7. Color / חשיפה

| | |
|---|---|
| ACES Filmic (היום) | ניגודי, "סינמטי" זול. הסצנה כבר מכוילת אליו |
| AgX | ניטרלי יותר, שטוח בלי grade. three תומך |
| Linear / none | שטיפה לבנה — מה שהמשתמש שנא |

**החלטה 7.1:** נשארים ACES עד שיש HDRI + grade נפרד. החלפה ל-AgX בלי LUT = רגרסיה.  
**החלטה 7.2:** `outputColorSpace = SRGBColorSpace`. Linear workflow.  
**החלטה 7.3:** חשיפה יום 0.55–0.85, לילה 0.15–0.28. לא 0, לא 2.

---

## 8. HDRI / שמיים

| | |
|---|---|
| `sky-day.png` | יש, לא IBL |
| `Sky()` פרוצדורלי | שוטף ללבן אם turbidity גבוה |
| Poly Haven `kloofendal_*_puresky` 2K CC0 | IBL אמיתי, ~5–20MB |
| 16K HDR | מיותר לווב |

**החלטה 8.1:** בלי קובץ `.hdr` ב-repo = אין HDRI.  
**החלטה 8.2:** כשיהיה: 2K, `RGBELoader` → `PMREMGenerator`, High בלבד.  
**החלטה 8.3:** לילה: HDRI לילה 1K או כיבוי IBL + שמש 0.16. לא canvas גרדיאנט.  
**החלטה 8.4:** אסור לקרוא ל-`Sky()` "HDRI".

---

## 9. טקסטורות / נכסים

| | מתי |
|---|---|
| PNG baked (היום) | כביש, flake, blob, שלטים — **לא לאפות חדש** |
| KTX2 BasisU UASTC | hero, atlas חזיתות, HDR לא (HDR = RGBE) |
| Meshopt glb | רכב — **יש** |
| Draco | לא צריך אם Meshopt |

KTX2 בלי קובץ + בלי `basis` transcoder ב-`public/` = loader מת.

**החלטה 9.1:** לא ממירים asphalt-*.png עד freeze איילון.  
**החלטה 9.2:** KTX2 רק עם קובץ + LICENSE + transcoder. אחרת הסרת ה-loader מהטענה "פייפליין".  
**החלטה 9.3:** Atlas חזיתות ישראל = PNG/KTX2 ממקור צילום, לא canvas runtime.

---

## 10. גיאומטריה / draw calls

| | כלל |
|---|---|
| `InstancedMesh` | אותה גיאומטריה × N (עצים, עמודים, קהל) |
| `BatchedMesh` | גיאומטריות **שונות** (5+ סוגי בניין) |
| Mesh נפרד לכל קומת עזריאלי | אסור (26.2.5) |

WebGPURenderer נחנק מ-20k mesh לא-instanced. Instancing הוא תנאי ל-WebGPU.

**החלטה 10.1:** יעד איילון High <80 calls.  
**החלטה 10.2:** עזריאלי פסים = InstancedMesh אחד.  
**החלטה 10.3:** לא BatchedMesh עד שיש 5+ גיאומטריות בניין אחרי freeze.

---

## 11. רכב

| | |
|---|---|
| 5 extrusion glb | placeholder. **לא hero** |
| Kenney Car Kit CC0 | LOD2/צעצוע. אסור GT |
| Sketchfab CC-BY | רק אחרי LICENSE.md + גלגלים נפרדים + לא מותג |
| סריקה לייזר | אין בסנדבוקס |

**החלטה 11.1:** 4.2 נשאר NOT DONE בלי נכס.  
**החלטה 11.2:** flake = `flake.png` + אופציונלי inject world-space; לא canvas.  
**החלטה 11.3:** hood: להחביא זכוכית; chase: להחביא דאש. בלי מושבים.

---

## 12. פיזיקה

| | |
|---|---|
| 120Hz custom (היום) | spline Y + Pacejka רוחב + crawl |
| Rapier/Cannon 3D | מתנגש בספליין, יקר ב-JS |
| 4-post מלא | גלגל-אדמה נפרד — אחרי freeze, עדיין על הספליין |

**החלטה 12.1:** אין מנוע פיזיקה חיצוני.  
**החלטה 12.2:** crawl נשאר מתחת ל-10 מ׳/ש׳. HUD מציג `kin`. אסור "tire-only".  
**החלטה 12.3:** שיפוע = `grade * g` מנקודת הספליין, לא DEM.

---

## 13. ישראל / GIS

| | |
|---|---|
| OSM/DEM בסנדבוקס | אסור (רשת+משקל+יושרה) |
| ספליין + סמלים GPS ידניים | מה שיש |
| Mapbox/Google photogrammetry | רישיון + מחוץ למסגרת |

**החלטה 13.1:** אפס GIS. עותק "בהשראת".  
**החלטה 13.2:** Freeze איילון חסום לצילום השלום ממך. בלי זה אין Phase 7.  
**החלטה 13.3:** רוחב 3.5m רק איילון נעול (28m). שאר `WIDTH_DEBT`.

---

## 14. פוסט / איכות לפי פרופיל (נעול)

| פרופיל | pixel | צל | composer | bloom | planar | יעד fps |
|---|---|---|---|---|---|---|
| compat/Low | 1.0 | 0 | לא | לא | לא | 30 |
| balanced/Mid | 0.75 | 1×512 | SMAA | לא | לא | 60 |
| high | 0.85 | CSM 2×1024 | SMAA | חלש לילה | 768 | 60 |
| ultra | 1.0 | כמו high | כמו high | כמו high | 768 | 60 — **לא WebGPU** |
| photo | 1.0–1.35 | כמו high | כמו high | כמו high | 768 | 30 |

כיבוי אוטומטי (21.6): planar → bloom → CSM mute → pixelScale×0.85 ≥0.5.

**החלטה 14.1:** ultra ≠ WebGPU.  
**החלטה 14.2:** 60fps אייפון לא יסומן בלי מדידת משתמש.

---

## 15. מה *כן* נותן קפיצת תמונה לכל וואט (סדר)

1. HDRI 2K + ACES (כשיש קובץ)  
2. כביש specular + planar (יש חלקית)  
3. רכב hero (חסר נכס)  
4. pixelScale 0.85 + instancing (Asphalt: חצי רזולוציה)  
5. סמל איילון בלי קוביות גנריות  
6. CSM 2 cascades  
7. SMAA  
8. WebGPU/TSL/TRAA/GTAO — **אחרי 1–6**

---

## 16. שאלות פתוחות — תשובות סופיות

16.1. מחליפים ל-WebGPU עכשיו? **לא.**  
16.2. TSL לכביש ב-WebGLRenderer? **לא.**  
16.3. AgX במקום ACES? **לא** עד HDRI+grade.  
16.4. Rapier? **לא.**  
16.5. BatchedMesh לכל העיר? **לא** עד אחרי freeze.  
16.6. SSR? **לא.**  
16.7. GTAO? רק High אחרי freeze אם p95 מאפשר.  
16.8. Kenney=hero? **לא.**  
16.9. Canvas PNG חדש? **לא.**  
16.10. מסלול חדש? **לא.**  
16.11. אונליין/גאראז׳? **לא.**  
16.12. Unreal? **לא.**  
16.13. Freeze בלי צילום השלום? **לא.**  
16.14. `TAARenderPass` = TRAA? **לא.**  
16.15. Loader KTX2 בלי קבצים = פייפליין? **לא.**  
16.16. 60fps מובייל מהסנדבוקס? **לא ניתן.**  
16.17. Photo Mode = renderer שני? **לא.** DPR בלבד.  
16.18. pmndrs/postprocessing? **לא.**  
16.19. `Sky()` = HDRI? **לא.**  
16.20. נגד איילון ניתן לנהיגה? **לא** עד מחלף.

---

## 17. סדר מימוש אחרי המסמך הזה

לא משנים את 21.x. ממשיכים:

17.1. 21.8 טסט רמפת השלום (Y)  
17.2. עצירה ל-6.1 צילום משתמש  
17.3. 6.2 עזריאלי InstancedMesh פסים  
17.4. 8.1 דגל WebGPU מאחורי `init()`  
17.5. HDRI רק עם קובץ

---

**סוף המחקר.** כל החלטה למעלה מחייבת כמו סעיף 0 ב-EXECUTION_PLAN.
