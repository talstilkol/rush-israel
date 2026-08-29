# RUSH Israel

משחק נהיגה פרטי בשליטת הבעלים, מבוסס Three.js ו־WebGL, עם פיזיקת
simcade בקצב קבוע של 120Hz ומסלולים בדיוניים בהשראת מקומות בישראל.

Private owner-controlled Three.js WebGL simcade driving game on fictional routes
inspired by Israeli places.

## מצב מדויק — 29.08.2026

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
| מצב התוכנית | `CURRENT-STATE.json` |
| תור הביצוע | `QUEUE.json` |

## רישוי

`LICENSE` הוא רישיון קנייני מסוג All Rights Reserved. אין הרשאה להעתיק,
לשנות, להפיץ, לארח או לפרסם ללא אישור כתוב מפורש של הבעלים.

רכיבי צד שלישי ונכסים ללא ראיית מקור/רישיון מספקת אינם מקבלים כיסוי מהרישיון
הקנייני. ראו `THIRD-PARTY-NOTICES.md` ו־`ASSET-PROVENANCE.json`.
