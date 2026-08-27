# RUSH — רשימת משימות קדימה (איפוס 27.8.2026)

**אחוז כנה:** ~13% מתוכנית קודקס. שערי שחרור 2/13.  
**יעד:** משחק WebGL שנראה כמו Asphalt במובייל. לא GT7. לא Unreal. לא GIS.  
**מקור אמת:** [EXECUTION_PLAN.md](/workspace/EXECUTION_PLAN.md) · [MASTER_PLAN_AUDIT.md](/workspace/MASTER_PLAN_AUDIT.md)

סטטוס: **DONE** | **PARTIAL** | **NOT DONE** | **FAKED** | **BLOCKED**.  
כל V חייב מפרט זעיר + בדיקה שרצה. אחרת זה לא 100.

---

## 0. חוקים שלא זזים

0.1. בלי OSM / DEM / "רחובות אמיתיים" / פוטוגרמטריה / רכב סרוק.  
0.2. בלי ערים חדשות. בלי PNG פרוצדורלי חדש.  
0.3. בלי העמקת מסלול חוץ מאיילון עד **1.5 הקפאה**.  
0.4. בלי Unreal / Nanite / Lumen / RT / TRAA-על-WebGL / SSGI.  
0.5. בלי אונליין, גאראז׳, 50 מכוניות.  
0.6. בלי מגדל חדש בלי תמונת השלום מהמשתמש.  
0.7. סשן מימוש = פריט אחד מהתור למטה.

---

## 1. תור ביצוע (רק זה. לפי הסדר)

### 1.1 BLOCKED — מחכים למשתמש
1.1.1. תמונת השלום אמיתית מהמשחק (לא AI, לא golden-baseline של הסוכן).  
1.1.2. עד אז: **אסור** מגדלים בשמות חדשים. **אסור** הקפאת איילון.  
1.1.3. טלפון 60fps — צריך מכשיר משתמש.  
1.1.4. p95 GPU אמיתי — צריך GPU אמיתי, לא הסנדבוקס.

### 1.2 עכשיו — גרפיקה בלי מגדלים
1.2.1. קוביית סביבה ב-boot **לכל** מסלול — **DONE** (tiny).  
1.2.2. כביש: envMap מהסצנה + `uWet` + רמפות Physical — **DONE** (tiny: IBL/clearcoat; אין SSR).  
1.2.3. רפלקטור מישורי 768 + yaw + גובה כביש — **DONE** (tiny: RT לא הורם).  
1.2.4. SMAA Mid/High — **DONE** (tiny: SMAAPass; לא TAA).  
1.2.5. CSM High 3 / Mid 1 / Low 0 — **DONE** (tiny).  
1.2.6. לילה/יום — **DONE** (tiny). לא HDRI.  
1.2.26. שחיקת נתיב מ־blob על האספלט — **DONE** (tiny).

### 1.3 אחרי תמונת השלום
1.3.1. Pose-lock מצלמת השלום.  
1.3.2. QA עזריאלי מול הסטיל (פרימיטיבים קיימים).  
1.3.3. בלי מגדלים חדשים.  
1.3.4. `AYALON_LOCK` נעול + commit `golden: freeze ayalon` עם ACK.

### 1.4 אחרי הקפאה — ישראל (מסלול אחד לסשן)
1.4.1. `landmark-gps.ts` לכל מסלול.  
1.4.2. רוטשילד → הירקון → יפו → ירושלים → רמון → חרמון → כרמל.  
1.4.3. לכל אחד: 8 GPS + אופסט מתנגש + pose זהב אחד. בלי ערים חדשות.

### 1.5 אחרי שסלייס ישראל נראה כמו משחק
1.5.1. **לא** לעבור ברירת מחדל ל-WebGPU.  
1.5.2. UASTC אטלס **או** להסיר טענת KTX2 — **DONE** (tiny: PNG בלבד, אין blob.ktx2, אין KTX2Loader).  
1.5.3. תאי עולם 256m רק אם drawCalls מעל תקציב.  
1.5.4. רכב hero glTF רק אם המשתמש נותן רישיון.  
1.5.5. TSL כביש רק אחרי WebGPU אופציונלי ירוק.

### 1.6 שחרור
1.6.1. Pixel-diff ב-CI רק אחרי סטילים מאושרים.  
1.6.2. WebGPU CI לנתיב משחק — רק אם 1.5.1 קיים.  
1.6.3. 13/13 שערים. היום 2/13.

---

## 2. מה כבר 100 למפרט הזעיר (לא לגעת)

- עותק "בהשראת" + README כנה  
- PHYSICS_VERSION + hash שיאים  
- בלי nocheck ב-world/game-app  
- HUD p95 + cascade planar→bloom→CSM→pixelScale  
- CSM lease + 3/1/0  
- NYC dynamic import + DataTexture (לא PNG)  
- Pacejka + tire yaw + 4-post Y + CCD + 200m corridor  
- UV dashes + lane-arrow.png  
- Meshopt 5 רכבים extruded (לא סריקה)  
- Esc / עברית  
- SSGI כבוי  
- Low מציג ≤30fps (`shouldPresent`)  
- כביש MeshPhysical + bump/rough PNG  
- פתיתי צבע onBeforeCompile  
- לילה מולא + פנסים בצד הנגדי באיילון  
- שמש יום 1.12  
- גנטרי + שלטי 90 במחלפים  
- בלי טבעת מזויפת בגלויות  

---

## 3. פתוח — סטטוס כנה

| ID | פריט | סטטוס | 100? |
|---|---|---|---|
| 1.1.1 | סטיל השלום מהמשתמש | **BLOCKED** | no |
| 1.3.4 | הקפאת איילון | **NOT DONE** | no |
| 5.2 | זכוכית עזריאלי מול תמונה | **NOT DONE** | no |
| 5.3 | מגדלים בשמות | **PARTIAL** / **BLOCKED** | no |
| 3.1 | רכב hero סרוק | **NOT DONE** (**FAKED** אם "סריקה") | no |
| 7.1 | WebGPU כרנדרר משחק | **NOT DONE** | no |
| 7.2 | TSL | **NOT DONE** | no |
| 8.1 | UASTC | **DONE** (tiny: loader removed; not UASTC atlas) | no (atlas) |
| 8.4 | תאי 256m | **NOT DONE** | no |
| 9.2 | pixel-diff CI | **NOT DONE** | no |
| 2.2 | planar 768 | **PARTIAL** | no |
| Codex2 | כביש פוטוגרמטרי | **FAKED** אם נטען אמיתי | no |
| G2 | HDRI | **NOT DONE** (PNG 2D) | no |

---

## 4. אסור לכתוב כמשימה

Unreal, כיסוי 100% ישראל לפני שהמנוע נראה כמו משחק, RT, 50 מכוניות, אונליין, "סיימנו את קודקס", "מספר 1 בעולם".

---

## 5. הפריט של הסשן הזה

**1.2.1** קוביית סביבה ב-boot לכל מסלול — רכב וכביש מקבלים השתקפות סצנה, לא רק באיילון.
