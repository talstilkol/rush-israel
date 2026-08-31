# RUSH Israel

משחק נהיגה פרטי בשליטת הבעלים, מבוסס Three.js ו־WebGL, עם פיזיקת
simcade בקצב קבוע של 120Hz ומסלולים בדיוניים בהשראת מקומות בישראל.

Private owner-controlled Three.js WebGL simcade driving game on fictional routes
inspired by Israeli places.

## מצב מדויק — 31.08.2026

| מדד | מצב |
|---|---:|
| מסלולי Version 1 | **8** |
| כלי רכב בדיוניים | **5** |
| שערי שחרור ירוקים | **0/13** |
| נכסי `public/` ללא ראיית רישיון מספקת | **66** |
| מוכנות להפצה ציבורית | **לא** |
| Visibility חי של GitHub | **Public** |
| יעד מדיניות | **Private — נדרשת פעולת בעלים** |

המאגר הציבורי כעת אינו מעניק רישיון ואינו מאשר הפצה ציבורית.  
Public accessibility of this repository does not grant a licence or authorize public distribution.

## גבול המוצר

| שם Version 1 | מזהה מאגר |
|---|---|
| Ayalon | `ayalon` |
| Rothschild | `rothschild` |
| Yarkon–Reading | `namal` |
| Jaffa | `oldjaffa` |
| Jerusalem–Scopus | `scopus` |
| Haifa–Carmel | `haifa` |
| Ramon | `ramon` |
| Hermon | `hermon` |

48 מזהי המסלולים האחרים נשמרים במאגר אך נדחים מ־Version 1.

הפרויקט אינו GIS, אינו Digital Twin, אינו מערכת ניווט או סימולטור מדידה,
ואינו מבוסס Unreal או Unity. WebGPU אינו Renderer ברירת המחדל.

## דרישות מדויקות

| כלי | גרסה |
|---|---:|
| Node.js | **22.16.0** |
| npm | **10.9.2** |

## התקנה והרצה

```bash
npm ci
npm run dev
```

כתובת ברירת המחדל: `http://127.0.0.1:8080/`

## בדיקות

```bash
npm test
npm run qa:ci
npm run build:dev
```

- `npm test` — כל בדיקות היחידה.
- `npm run qa:ci` — QA עצמאי שמפעיל וסוגר שרת בעצמו.
- `npm run build:dev` — Build דטרמיניסטי ללא Migration למסד הנתונים.

## גבול התלויות — RSH-020

| מדד | לפני | אחרי |
|---|---:|---:|
| חבילות Runtime ישירות | 52 | 10 |
| חבילות Development ישירות | 22 | 20 |
| סך חבילות ישירות | 74 | 30 |
| חבילות שהוסרו | — | 44 |

Authentication, database, migrations, multiplayer and preview-host template code are not part of Version 1 and are absent from the runtime. The retained `/__grok/*` URLs serve the product-specific PWA only. See `DEPENDENCY-POLICY.md` and `DEPENDENCY-BOUNDARY-MANIFEST.json`.

## שמירה ושחזור — RSH-021–RSH-022

| מדד | ערך |
|---|---:|
| גרסה נוכחית | 3 |
| גרסאות מקור נתמכות | 0, 1, 2, 3 |
| מסלול מיגרציה | 0→1→2→3 |
| כתיבה קנונית דטרמיניסטית | כן |
| גיבוי מאומת | כן — דור אחד |
| חריצי שמירת bytes פגומים | 2 |
| שחזור אוטומטי | לא |
| שחזור מפורש עם UI נגיש | כן |
| דריסת שמירה פגומה/עתידית | לא |
| מחיקת מפתח Legacy | לא |
| `removeItem()` / `clear()` | לא |

הסמכויות: `SAVE-SCHEMA-MANIFEST.json`, `RSH-021-SAVE-SCHEMA-CONTRACT.md`,
`SAVE-RECOVERY-MANIFEST.json` ו־`RSH-022-SAVE-RECOVERY-CONTRACT.md`.

## שליטה

`W` גז · `A`/`D` הגה · `Esc` תפריט. תמיכת Touch ו־Gamepad כלולה בגבול
Version 1 אך קבלת מטריצת הדפדפנים והמכשירים מתבצעת ב־RSH-043.

## מקורות אמת

| נושא | קובץ |
|---|---|
| הגדרת המוצר | `PRODUCT-DEFINITION.json` |
| מיפוי 8/48 המסלולים | `TRACK-CATALOGUE-CLASSIFICATION.json` |
| נכסים ורישיונות | `ASSET-PROVENANCE.json` |
| Metadata ו־PWA | `PRODUCT-METADATA.json` |
| גבול תלויות | `DEPENDENCY-BOUNDARY-MANIFEST.json` |
| סכמת שמירה | `SAVE-SCHEMA-MANIFEST.json` |
| גיבוי ושחזור | `SAVE-RECOVERY-MANIFEST.json` |
| מדיניות עדכונים | `DEPENDENCY-POLICY.md` |
| מצב התוכנית | `CURRENT-STATE.json` |
| תור הביצוע | `QUEUE.json` |

## רישוי

`LICENSE` הוא רישיון קנייני מסוג All Rights Reserved. אין הרשאה להעתיק,
לשנות, להפיץ, לארח או לפרסם ללא אישור כתוב מפורש של הבעלים.

רכיבי צד שלישי ונכסים ללא ראיית מקור/רישיון מספקת אינם מקבלים כיסוי מהרישיון
הקנייני. ראו `THIRD-PARTY-NOTICES.md` ו־`ASSET-PROVENANCE.json`.
