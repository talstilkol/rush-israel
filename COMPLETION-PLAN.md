# RUSH Israel — תוכנית השלמה מאוחדת, 15.10.2026

1. **מצב:** המשחק אינו גמור. אף יחידת RSH אינה מתקבלת כאן כמוצר מושלם. `67/67 ACCEPTED` הוא רישום היסטורי של תוכנית העבודה.
1.1 זו המשכה של תוכנית MP-001–MP-046 מ־11.10, באותם מזהים ותלויות. היא כוללת את `main` ואת PR 83 ב־`6395474` ואת התיקונים בענף `fix/rush-completion-2026-10-15`.
1.2 מקור מצב המוצר הוא [PRODUCT-READINESS.json](PRODUCT-READINESS.json); משימות ההמשך נשמרות ב־[COMPLETION-BACKLOG.json](COMPLETION-BACKLOG.json). קובצי RSH/manifest הישנים נשמרים כראיה היסטורית.
1.3 חזון האיכות נשאר משחק מירוצים מצוין: נהיגה מובנת ומהנה, תגובה עקבית, מסלולים קריאים, יריבים הוגנים, ביצועים מדודים ושמירה אמינה. הביטוי “הטוב בעולם” הוא שאיפה הנבחנת ב־Playtest, לא סטטוס הנגזר ממיזוג PR.

2. **גבול הביצוע הקיים:** משחק WebGL פרטי; חמש מכוניות בדיוניות ושמונת מסלולי V1. 48 המסלולים הנוספים נשמרים אך אינם מגדילים את חבילת השחרור. Multiplayer, שחרור ציבורי וחנויות Native אינם נכללים ללא שינוי Scope מפורש.
2.1 אין להציג מכוניות extrusion כסריקה, צילום מסך כקבלת אמנות, דגל נגישות כ־WCAG או FPS של SwiftShader כביצועי מכשיר.

3. **סדר הסגירה:** ייצוב והתנהגות → שלמות סשן/נתונים → אמנות ונהיגה בכל V1 → ביצועים וקלט במכשירים → רישוי/נגישות → Staging פרטי, Alpha, RC, rollback ותג חתום.
3.1 חסימת רישוי/מכשיר אינה עוצרת תיקוני קוד בלתי תלויים. תחומי בדיקה שונים אינם מחליפים זה את זה.
3.2 סיום משימה מחייב את קריטריון הקבלה שלה, מקור/Hash מזוהים, פלט גולמי, סביבת בדיקה ושאריות פתוחות. אין ספירת אחוזי מוצר אוטומטית.

4. **בדיקות נפרדות ומפורשות:**

| פקודה | מה היא מוכיחה |
|---|---|
| `npm test` | בדיקות הקוד הנוכחי, כולל פיזיקה, Snapshot, שיאים ו־Ghosts |
| `npm run test:historical` | שחזור עץ Git המקורי `b2c0d46` ובדיקת החוזים שלו בלבד |
| `npm run qa:ci` | שער QA מקומי שמפעיל שרת, בדיקות דפדפן, build וסריקות |
| `npm run test:soak` | Damage smoke ואחריו 1800 שניות אמיתיות; דורש תנועה, מסלול שלם וללא שגיאות |
| `npm run check:release` | סירוב לשחרור כל עוד אין ראיות סגורות לכל 13 השערים |

4.1 `required-ci / validate` נשאר השם הנדרש ב־Ruleset והוא מאגד jobs של קוד נוכחי, דפדפן, סוק וחוזים היסטוריים. אין `continue-on-error`.
4.2 לפני שינוי זה `npm test` **כן** הפעיל את הסוק בעקיפין. הרצה אינה הוכחת מעבר: הסקריפט הישן לא חייב סיום מסלול. מעתה הסוק הוא job חובה גלוי ונפרד.
4.3 עדכון חוזה היסטורי לבייטים חדשים אינו דרך לקבל מוצר. הבדיקות ההיסטוריות רצות על הקוד ההיסטורי המדויק; ההתנהגות החדשה נבדקת בנפרד.

5. **13 שערים — התצפית הנוכחית:**

| שער | מצב | מה חסר |
|---|---|---|
| 1: licensing | not-done | 66 unverified image assets; source/creator/licence evidence required. |
| 2: main protection | verified-settings | Live ruleset 23177340 is active and requires strict required-ci / validate, PRs, no bypass, no deletion or force push. |
| 3: clean clone and build | partial | Clean f03d13f clone: npm ci --offline --no-audit and production build without QA hooks passed. Latest patched dependencies also install and build; final-head hosted verification pending. |
| 4: CI | partial | Current-source unit/build/security and historical jobs passed on earlier development commits. Replaced runs were cancelled; complete required-ci / validate on the final PR head is not yet verified. |
| 5: secrets | partial | Local tracked-source scan passed; repeat on staged final source and bind to final commit. |
| 6: Ayalon freeze | not-done | Low Ayalon ramps and on-road supports were corrected and visually rechecked. All real-world clearance checks pass; owner golden/still acceptance is still absent. |
| 7: driving | partial | Eight assisted browser V1 races reached result UI on f03d13f, without official records/stars. New current-source condition/restart UI test passed. Heavy damage and human playability acceptance remain open. |
| 8: desktop p95 | not-done | Named physical Windows device, exact build and raw measurements unavailable. |
| 9: mobile p95 | not-done | Named physical mobile device, exact build, thermal and raw measurements unavailable. |
| 10: 30-minute soak | pending | Earlier immutable r2 soak passed 1800 seconds with 15 completed races and zero off-road ratio; it predates current runtime. A newer intermediate snapshot run was explicitly stopped after replacement. Clean f03d13f soak is running separately. Final-head required-CI soak remains pending; no earlier result accepts the final candidate. |
| 11: save | partial | Current record-class roundtrips tested; current migration/recovery and owner save acceptance pending. |
| 12: accessibility and legal | not-done | WCAG AA, canvas accessibility, privacy and licence acceptance unavailable; A11Y_COMPLETE=false. |
| 13: signed release tag | not-done | Version is 0.0.0-private; signed tag, private staging, Alpha, RC and rollback evidence unavailable. |

6. **המשך 46 המשימות המקוריות:** `locally-verified` הוא אימות מקומי צר; הוא אינו קבלת יחידת RSH או שחרור.

| מזהה | משימה | מצב | ראיה/חוסר נוכחי |
|---|---|---|---|
| MP-001 | איחוד מצב מוצר ותוכנית | partial | היסטוריית 67 היחידות מופרדת ממצב מוצר; אין יחידה בציון 100. |
| MP-002 | תיקון שגיאות TypeScript | locally-verified | TypeScript עובר מקומית בגרסת העבודה. האבחונים הישנים כבר תוקנו ב-6395474. |
| MP-003 | רגרסיית איילון 200 מטר | partial | qa:drive עבר: 200 מטר על הכביש ובדיקת היגוי; טרם מוזג ל-main. |
| MP-004 | חריגת מים בתנאי העולם | partial | 56 עולמות נבנו ונבדקו במצב יום/לילה/גשם ללא חריגה; אין קבלת אמנות. |
| MP-005 | גאומטריית רמון וגבולות elevation | partial | כל 56 המסלולים finite; שמונת מסלולי V1 הושלמו בסימולציה בלבד. |
| MP-006 | התאמת visual ו-collider | partial | חיפוש גאומטרי גלובלי ל-placement תוקן; התאמה חזותית מלאה עוד נדרשת. |
| MP-007 | מעבר חוזים מבוקר | partial | 194 בדיקות קוד נוכחי ו-466 בדיקות היסטוריות הופרדו; סוק הוא job חובה מפורש. CI חי על הענף המתוקן טרם נמדד. |
| MP-008 | Scope משותף ל-8 מסלולי V1 | partial | 6395474 כולל רשימת 8 מסלולים ו-Career פעיל מסונן; נדרשת בדיקת כל מסלולי הכניסה. |
| MP-009 | Grid שערים וסיום מרוץ | partial | תוקנו דגימת endpoint ומיקום sample במסלול פתוח; הושלמו 8 מסלולים בסימולציה, לא כל בדיקות השלילה בדפדפן. |
| MP-010 | Reset מלא וכשלי boot | partial | איפוס מצב מרוץ וקלט הורחב; נפתרה לחיצה שאבדה לפני hydration. בדיקת parity מלאה עדיין פתוחה. |
| MP-011 | זמן ואובדן simulation ticks | partial | טלמטריה מקבלת זמן frame לא חתוך; אובדן זמן פוסל שיא. אימות שעון במכשירים פתוח. |
| MP-012 | Rewind עקבי | partial | Snapshot רכב כולל מצב חולף; Rewind משחזר lap/sectors/KO/POI ו-ledger. מרוץ עם סיוע אינו זכאי לשיא. בדיקות מעבר גבולות מלאות פתוחות. |
| MP-013 | Collision בין מפלסים ונזק | partial | בדיקות רכב בגובה שונה ונזק מתמשך עברו; פגיעה חזיתית בקיר אמיתי נבדקה. כל מעטפת collision עדיין דורשת קבלה. |
| MP-014 | Ledger תגמולים וקנסות | partial | פרס עקיפה משולם רק עבור מקום טוב יותר מהשיא במרוץ; אפס הוא סכום תקף; Finish כפול מאותו result אינו משלם שוב. |
| MP-015 | Input Snapshot לפי tick | partial | הקלט נדגם ב-fixed tick; blur/pause/restart מאפסים מקלדת, מגע ו-overrides. נדרשים מכשירי מגע ובקר. |
| MP-016 | Ghost Replay עם timestamps | partial | שארית זמן ההקלטה נשמרת; timestamps קיימים. נדרשת בדיקת Replay ארוך וגבולות rewind. |
| MP-017 | כיול Handling ו-Tuning | open | לא התקבלה ראיה חדשה לסגירת קריטריון הקבלה. |
| MP-018 | AI לתחרות הוגנת | open | לא התקבלה ראיה חדשה לסגירת קריטריון הקבלה. |
| MP-019 | חוקי modes ו-countdown | open | לא התקבלה ראיה חדשה לסגירת קריטריון הקבלה. |
| MP-020 | בעלות משאבים ובחירת road kit | partial | מדיניות נתיבים אחת ל-loader ול-world; 56 עולמות: אפס dispose לטקסטורות cache ואפס dispose כפול. |
| MP-021 | PostFX lifecycle ו-quality | partial | PostFX משחרר passes; low puddles נשמר. 20 מחזורים בתנוחת התחלה יציבה: 30 טקסטורות/1194 גאומטריות בכל מדידה; לא מדידת GPU פיזי. |
| MP-022 | Art direction של איילון | open | לא התקבלה ראיה חדשה לסגירת קריטריון הקבלה. |
| MP-023 | Hero Car ואופי חמש המכוניות | open | לא התקבלה ראיה חדשה לסגירת קריטריון הקבלה. |
| MP-024 | Audio ו-feedback | open | לא התקבלה ראיה חדשה לסגירת קריטריון הקבלה. |
| MP-025 | Baseline וביצועים במכשיר יעד | open | לא התקבלה ראיה חדשה לסגירת קריטריון הקבלה. |
| MP-026 | Career של V1 | partial | סינון אירועי V1 כבר קיים בענף; השלמת כל אירוע בדפדפן עדיין פתוחה. |
| MP-027 | Champion ו-Challenge progression | partial | Champion נספר מכוכבי V1; נדרשת קבלת התקדמות מלאה ושמירת legacy. |
| MP-028 | Ruleset לשיאים ו-Ghosts | partial | Best ו-timed records כוללים tune, car definition, track geometry, physics ותנאים; Ghosts מופרדים באותו ruleset ונבדקת תקינותם. קבלה מלאה עדיין פתוחה. |
| MP-029 | Save migration והגנת Legacy | partial | בדיקות היסטוריות נשמרו בנפרד; נדרשת קבלת migration/recovery על הקוד הנוכחי ושמירה אמיתית של בעלים. |
| MP-030 | Topology Placement ורציפות מסלולים | partial | מסלולים פתוחים אינם מתחברים בגדרות ובשוליים; רמפת יפו רציפה; endpoint אינו חוזר להתחלה. |
| MP-031 | השלמת שבעת מסלולי V1 הנותרים | open | לא התקבלה ראיה חדשה לסגירת קריטריון הקבלה. |
| MP-032 | קבלה של כל המכוניות והאירועים | open | לא התקבלה ראיה חדשה לסגירת קריטריון הקבלה. |
| MP-033 | Touch ומסך צר | partial | איפוס blur כולל מגע; קבלת ריבוי מגעים ומכשיר פיזי עדיין פתוחה. |
| MP-034 | Gamepad ומקלדת לאורך כל ה-flow | partial | מקלדת והיגוי נבדקו בדפדפן; בקר פיזי ו-disconnect עדיין פתוחים. |
| MP-035 | Onboarding שפה ונגישות | partial | A11Y_COMPLETE הוחזר ל-false; WCAG AA, RTL מלא, ניגודיות ו-onboarding אינם סגורים. |
| MP-036 | PWA Offline ועדכון לפי הגדרה | partial | PWA_COMPLETE הוחזר ל-false; אין service worker ואין הוכחת offline/update. |
| MP-037 | נכסים ותחזוקת תלויות | partial | נוצר CSV מדויק של 66 תמונות לא מאומתות עם SHA-256. מקור/יוצר/רישיון עדיין חסרים. |
| MP-038 | Assets עם content fingerprints | partial | הוסרה הוראת immutable לקבצי game/basis ללא טביעת תוכן; נדרשת בדיקת A→B ו-rollback וכן pipeline fingerprints. |
| MP-039 | Production packaging ו-Staging | partial | Production build עבר ובדיקה לא מצאה QA hooks; בדיקת staging פרטי ו-build ארוז נדרשת. |
| MP-040 | Soak leak ו-context recovery אמיתיים | partial | סוק r2 עבר 1800 שניות/15 מרוצים על snapshot קודם. סוק של HEAD הסופי ו-context recovery עדיין פתוחים; אין להעביר ראיות אוטומטית בין גרסאות. |
| MP-041 | Browser ומכשירים פיזיים | open | לא התקבלה ראיה חדשה לסגירת קריטריון הקבלה. |
| MP-042 | Alpha ומשוב משחקנים | open | לא התקבלה ראיה חדשה לסגירת קריטריון הקבלה. |
| MP-043 | RC והוכחת rollback | open | לא התקבלה ראיה חדשה לסגירת קריטריון הקבלה. |
| MP-044 | שחרור לפי מדיניות הבעלים | open | לא התקבלה ראיה חדשה לסגירת קריטריון הקבלה. |
| MP-045 | Deterministic content במקום seeded PRNG | partial | לא נוסף שימוש באקראיות. החלפת ה-PRNG הקיים בתוכן מפורש עדיין פתוחה. |
| MP-046 | ניידות Shaders וסימוני כביש | partial | smoothstep עם קצוות הפוכים תוקן ב-road/postFX; נדרשת קבלת pixels וקומפילציית GPU במכשירי יעד. |

7. **קבלה לכל משימה ותלויותיה:**

7.1 **MP-001 — איחוד מצב מוצר ותוכנית**

- תלוי ב־אין; עדיפות P0.
- תוצר: מקור פעיל אחד ל-Scope, commit וראיות.
- סיום: המסמכים מתייחסים לאותה גרסה; snapshots היסטוריים מסומנים.

7.2 **MP-002 — תיקון שגיאות TypeScript**

- תלוי ב־MP-001; עדיפות P0.
- תוצר: imports וטיפוס HudState עקביים.
- סיום: typecheck מחזיר 0 diagnostics.

7.3 **MP-003 — רגרסיית איילון 200 מטר**

- תלוי ב־MP-002; עדיפות P0.
- תוצר: Root Cause ותיקון ממוקד.
- סיום: qa:drive עובר בענף ובבסיס המשולב עם אותה הגדרת מרוץ.

7.4 **MP-004 — חריגת מים בתנאי העולם**

- תלוי ב־MP-002; עדיפות P0.
- תוצר: קישור מפורש בין water material למקור צבע.
- סיום: שינוי יום לילה rain storm clear באיילון ללא exception.

7.5 **MP-005 — גאומטריית רמון וגבולות elevation**

- תלוי ב־MP-001; עדיפות P0.
- תוצר: samples וגאומטריה סופיים.
- סיום: finite checks בכל 56 הגדרות ונהיגה ברמון; רציפות בגבולות.

7.6 **MP-006 — התאמת visual ו-collider**

- תלוי ב־MP-001; עדיפות P0.
- תוצר: placement משותף ל-rendering ו-collision.
- סיום: 42 ה-colliders שהוזזו בענף נבדקים מול meshes; אין collision מנותק.

7.7 **MP-007 — מעבר חוזים מבוקר**

- תלוי ב־MP-002, MP-003, MP-004, MP-005, MP-006; עדיפות P0.
- תוצר: סיווג 60 כשלי חוזים ומעבר baseline מתועד.
- סיום: חוזים חדשים מאומתים בהתנהגות; חוזים היסטוריים נשמרים.

7.8 **MP-008 — Scope משותף ל-8 מסלולי V1**

- תלוי ב־MP-001; עדיפות P1.
- תוצר: membership לכל בורר ואתגר והפעלת אירוע.
- סיום: quick race daily weekly career ו-engine entry מכבדים אותה רשימה.

7.9 **MP-009 — Grid שערים וסיום מרוץ**

- תלוי ב־MP-003, MP-005; עדיפות P1.
- תוצר: חוקי RaceSession למסלול פתוח וסגור.
- סיום: אין finish לפני זינוק או ללא שערים; מקום נקבע לפי חוקי mode.

7.10 **MP-010 — Reset מלא וכשלי boot**

- תלוי ב־MP-002; עדיפות P1.
- תוצר: איפוס central ו-loading state עם Retry.
- סיום: Restart זהה ל-session חדש; rejected ready אינו משאיר overlay קבוע.

7.11 **MP-011 — זמן ואובדן simulation ticks**

- תלוי ב־MP-009; עדיפות P1.
- תוצר: מדיניות clock ו-eligibility.
- סיום: stall מתועד ומטופל; תוצאה אינה מקבלת יתרון זמן שקט.

7.12 **MP-012 — Rewind עקבי**

- תלוי ב־MP-009, MP-010, MP-011; עדיפות P1.
- תוצר: snapshot סיבתי מלא או Assisted ruleset.
- סיום: חציית lap checkpoint KO POI ו-reward אינה משאירה future state.

7.13 **MP-013 — Collision בין מפלסים ונזק**

- תלוי ב־MP-006, MP-009; עדיפות P1.
- תוצר: height filtering וסדר spawn/damage.
- סיום: 40 מטר בין מכוניות אינם collision; persistent damage נשמר לפי מוצר.

7.14 **MP-014 — Ledger תגמולים וקנסות**

- תלוי ב־MP-009, MP-012; עדיפות P1.
- תוצר: אירועי כסף מקומיים ו-commit פעם אחת.
- סיום: עקיפה חוזרת או rewind אינם מכפילים פרס; invalid result אינו משלם.

7.15 **MP-015 — Input Snapshot לפי tick**

- תלוי ב־MP-011; עדיפות P1.
- תוצר: raw input ו-smoothing ב-fixed dt.
- סיום: rendering ו-QA אינם משנים input; input log עקבי באותה סביבה.

7.16 **MP-016 — Ghost Replay עם timestamps**

- תלוי ב־MP-012, MP-015; עדיפות P1.
- תוצר: buffers עם tick או זמן אמיתי.
- סיום: 10 שניות הקלטה נשארות 10 שניות playback; rolling windows עקביים.

7.17 **MP-017 — כיול Handling ו-Tuning**

- תלוי ב־MP-013, MP-015; עדיפות P1.
- תוצר: מבחני acceleration brake steering drift surface.
- סיום: stock ו-upgraded תואמים לפעולת הפרמטרים; שינויי tuning מוסברים.

7.18 **MP-018 — AI לתחרות הוגנת**

- תלוי ב־MP-009, MP-017; עדיפות P1.
- תוצר: speed plan avoidance ועקיפה במטרים.
- סיום: יריבים מסיימים כל launch track בלי teleport או recovery loop.

7.19 **MP-019 — חוקי modes ו-countdown**

- תלוי ב־MP-009, MP-014, MP-018; עדיפות P1.
- תוצר: flow לכל מצב קיים.
- סיום: GO תואם throttle; Circuit Time Drift Knockout Heat Roam נותנים תוצאה תקינה.

7.20 **MP-020 — בעלות משאבים ובחירת road kit**

- תלוי ב־MP-004, MP-006; עדיפות P1.
- תוצר: cache ownership ו-source אחד ל-lanes/kit.
- סיום: Namal cold load אינו משחרר asphalt shared; world.dispose אינו משחרר curtains shared.

7.21 **MP-021 — PostFX lifecycle ו-quality**

- תלוי ב־MP-020; עדיפות P1.
- תוצר: dispose של passes ו-LOD עקבי.
- סיום: 20 מחזורים ללא growth; low נשאר low אחרי tick/weather/photo.

7.22 **MP-022 — Art direction של איילון**

- תלוי ב־MP-007, MP-017, MP-020, MP-045; עדיפות P1.
- תוצר: reference pack ו-road/sky/material composition.
- סיום: הכביש והצמתים קריאים ביום בלילה וב-weather; Golden מאושר מחדש.

7.23 **MP-023 — Hero Car ואופי חמש המכוניות**

- תלוי ב־MP-017, MP-020; עדיפות P1.
- תוצר: מודל ונכסים מתועדים ו-LODs.
- סיום: silhouette lights paint damage ו-LOD נבדקים; רכב אחד באיכות סופית.

7.24 **MP-024 — Audio ו-feedback**

- תלוי ב־MP-019, MP-023; עדיפות P1.
- תוצר: תגובות engine brake surface impact ומצבים.
- סיום: pause mute resume unlock עובדים; feedback מובן ב-Playtest.

7.25 **MP-025 — Baseline וביצועים במכשיר יעד**

- תלוי ב־MP-021, MP-022, MP-023, MP-046; עדיפות P1.
- תוצר: raw CPU/frame/GPU/bytes/loading metrics.
- סיום: מכשיר build quality resolution ונתונים גולמיים מתועדים; budgets נאכפים.

7.26 **MP-026 — Career של V1**

- תלוי ב־MP-008, MP-019; עדיפות P1.
- תוצר: אירועים ו-unlocks על מסלולי הגרסה.
- סיום: כל אירוע פעיל משתמש במסלול מאושר וניתן להשלמה.

7.27 **MP-027 — Champion ו-Challenge progression**

- תלוי ב־MP-014, MP-026; עדיפות P1.
- תוצר: הפרדת career stars ו-daily/weekly.
- סיום: Challenge בלבד אינו מעניק Champion; achievement משולם פעם אחת.

7.28 **MP-028 — Ruleset לשיאים ו-Ghosts**

- תלוי ב־MP-016, MP-019; עדיפות P1.
- תוצר: fingerprint של תנאי מרוץ וקטגוריות.
- סיום: mode laps weather tune handling assists content ו-physics אינם מעורבבים.

7.29 **MP-029 — Save migration והגנת Legacy**

- תלוי ב־MP-027, MP-028; עדיפות P1.
- תוצר: schema ותוכנית תאימות.
- סיום: load upgrade rejection recovery retry ו-rollback שומרים נתונים קיימים.

7.30 **MP-030 — Topology Placement ורציפות מסלולים**

- תלוי ב־MP-005, MP-006, MP-020; עדיפות P1.
- תוצר: פתוחים ללא חיבור finish-start ו-Jaffa רציף.
- סיום: finite samples; visual/collision parity ונהיגה בגבולות.

7.31 **MP-031 — השלמת שבעת מסלולי V1 הנותרים**

- תלוי ב־MP-025, MP-026, MP-030; עדיפות P1.
- תוצר: 7 מסלולים עם checklist זהה לאיילון.
- סיום: מרוץ AI visuals audio input weather ו-performance evidence לכל מסלול.

7.32 **MP-032 — קבלה של כל המכוניות והאירועים**

- תלוי ב־MP-023, MP-029, MP-031; עדיפות P1.
- תוצר: טבלת vehicle/event acceptance.
- סיום: stock tuned repair וביצועי event נבדקו על launch content.

7.33 **MP-033 — Touch ומסך צר**

- תלוי ב־MP-010, MP-015; עדיפות P1.
- תוצר: layout controls ו-pointer lifecycle.
- סיום: כל action נגיש במסך צר; cancel blur וריבוי מגעים אינם משאירים input.

7.34 **MP-034 — Gamepad ומקלדת לאורך כל ה-flow**

- תלוי ב־MP-015, MP-019; עדיפות P1.
- תוצר: navigation pause reconnect.
- סיום: תפריט race photo result עובדים; disconnect ו-blur מטופלים.

7.35 **MP-035 — Onboarding שפה ונגישות**

- תלוי ב־MP-024, MP-026, MP-033, MP-034; עדיפות P1.
- תוצר: הדרכת נהיגה קצרה ו-focus/lang/dir.
- סיום: משתתף חדש מסיים משימה; RTL text scale contrast reduced motion נבדקו.

7.36 **MP-036 — PWA Offline ועדכון לפי הגדרה**

- תלוי ב־MP-029, MP-035, MP-038; עדיפות P1.
- תוצר: Install/offline/update flows בהתאם להחלטת מוצר.
- סיום: הפעלה ללא רשת ועדכון עם save עובדים במסגרת scope שהוגדר.

7.37 **MP-037 — נכסים ותחזוקת תלויות**

- תלוי ב־MP-001; עדיפות P1.
- תוצר: מקור שימוש ורישיון לכל shipping asset; עדכוני dependencies מבודדים.
- סיום: 66 רשומות unverified נפתרו עבור הנכסים שנשלחים; עדכונים עוברים gates.

7.38 **MP-038 — Assets עם content fingerprints**

- תלוי ב־MP-020; עדיפות P1.
- תוצר: manifest URLs מזוהים בתוכן ו-cache policy.
- סיום: Build A אל B מקבל assets חדשים; rollback מקבל assets תואמים.

7.39 **MP-039 — Production packaging ו-Staging**

- תלוי ב־MP-007, MP-025, MP-037, MP-038; עדיפות P1.
- תוצר: build versioned פרטי ו-dossier.
- סיום: QA hook נעדר; smoke על ה-build הארוז; save/cache/headers תואמים.

7.40 **MP-040 — Soak leak ו-context recovery אמיתיים**

- תלוי ב־MP-021, MP-031, MP-039; עדיפות P1.
- תוצר: 20 מחזורים ו-1800 שניות עם assertions.
- סיום: תנועה/progress/finish ומדדי משאבים תקינים; WEBGL_lose_context ושחזור בדפדפן.

7.41 **MP-041 — Browser ומכשירים פיזיים**

- תלוי ב־MP-032, MP-035, MP-039; עדיפות P1.
- תוצר: מטריצה עם ראיות לכל יעד.
- סיום: Windows Chrome/Edge ושאר יעדים מאושרים; performance/input/audio/thermal נבדקו.

7.42 **MP-042 — Alpha ומשוב משחקנים**

- תלוי ב־MP-036, MP-040, MP-041; עדיפות P1.
- תוצר: defect log ותוצאות Playtest אמיתיות.
- סיום: תקלות מתועדפות ותוקנו; handling ו-UX נבדקו אחרי תיקון.

7.43 **MP-043 — RC והוכחת rollback**

- תלוי ב־MP-029, MP-039, MP-042; עדיפות P1.
- תוצר: release candidate עם artifacts ומדיניות upgrade.
- סיום: אין blockers; כל 13 השערים נבדקו על אותו commit; rollback בוצע.

7.44 **MP-044 — שחרור לפי מדיניות הבעלים**

- תלוי ב־MP-043; עדיפות P1.
- תוצר: הפצה פרטית מורשית עם tag חתום manifest artifacts changelog.
- סיום: שוחרר בפועל בהתאם להרשאה: tag חתום וקובץ build מזוהים קיימים; dossier ו-rollback trace נשמרו; הפצת הגרסה הפרטית אומתה.

7.45 **MP-045 — Deterministic content במקום seeded PRNG**

- תלוי ב־MP-007; עדיפות P2.
- תוצר: מיפוי תוכן יציב ו-IDs מבוססי תוכן.
- סיום: אין יצירת IDs/סדר/תוכן באקראיות; topology/golden נשמרים או מאושרים מחדש.

7.46 **MP-046 — ניידות Shaders וסימוני כביש**

- תלוי ב־MP-022; עדיפות P2.
- תוצר: smoothstep תקני וסימונים ממקור אחד.
- סיום: shader compile והשוואת pixels במכשירי יעד; אין שכבות lane כפולות.

8. **ראיות חיצוניות להשלמה:**
8.1 רישוי: CSV של 66 תמונות עם Hash אמיתי נמצא ב־`evidence/2026-10-15/asset-clearance-required.csv`. לכל רשומה נדרשים מקור/יוצר ורישיון או רישום יצירה של הבעלים. לא הומצאו קישורים או אישורים.
8.2 ביצועים: נדרשים מכשירי יעד מזוהים, מערכת ודפדפן, build/quality/resolution ונתונים גולמיים. המדידות הקיימות מ־Headless נשארות דיאגנוסטיקה.
8.3 אמנות: סטיל ו־Golden חדשים לאיילון ולשבעת המסלולים האחרים, על מקור מזוהה, וקבלת בעלים מפורשת. Hash לבדו אינו סטיל ואינו Freeze.
8.4 שחרור: Staging פרטי, שחקני Alpha, RC ללא blockers, ביצוע rollback וחתימה בידי בעל מפתח חתימה. אין מפתח חתימה זמין או הרשאת הפצה ציבורית שניתן להסיק ממיזוג קוד.

8. **בדיקה חזותית של Production:** צילום RUSH-ISRAEL-PRODUCTION-DRIVE.png מראה באיילון משטחים ומבנים החוצים את שדה הנהיגה ומסתירים את הדרך. זהו חסם פתוח ב־MP-006/MP-022/MP-030; סיום מרוץ אוטומטי אינו קבלת אמנות או Playtest. שמונת מרוצי הדפדפן הגיעו ל־Result UI בסיוע QA, וביפו/רוטשילד נמדד נזק 1.0. נדרש בירור collision/AI/handling לפני קבלת מסלולים.

9. **אימות מועמד לשחרור:** שומרים manifest ראיות מחוץ ל־Git, למשל `artifacts/release-candidate.json`, ומריצים `npm run check:release -- --manifest artifacts/release-candidate.json`. ה־manifest חייב לזהות את HEAD, את כל 13 השערים ואת אישור הבעלים. כך נמנעת הפניה בלתי אפשרית של commit ל־SHA של עצמו. התג החתום חייב להצביע לאותו HEAD. מצב ברירת המחדל נשאר חסום.

10. **תיקון בעקבות הבדיקה החזותית:** איילון מסנן רמפות דקורטיביות החודרות למעטפת מעבר בגובה 4.5 מטר מעל נתיבי המרוץ; תמיכות מוצבות מחוץ לכביש. מיקום אובייקטים סטטיים משתמש בחיפוש גאומטרי ולא ברמז התקדמות של רכב. בדיקת 56 העולמות בודקת גם חציות רמפה ותמיכות בפועל. נדרשת עדיין קבלת אמנות ו־Playtest; בדיקות הסוק הישנות אינן מיוחסות אוטומטית לתיקון החדש.

11. **עדכוני תלויות קיימים:** שולבו שלוש רשומות patch מענפי Dependabot של PR 82 ו־PR 47. המקורות, הגרסאות ו־integrity נרשמו ב־evidence/2026-10-15/dependabot-patch-integration.json. אין מכאן טענה שכל הפגיעויות במאגר נסגרו; קבלת סריקת תלויות מלאה נשארת פתוחה.

12. **תנאי מרוץ ומצב השלמה:** RTL_SCOPE_COMPLETE ו־ONBOARDING_COMPLETE הוחזרו ל־false. שינוי ידני של יום/לילה או assists פוסל את הסשן לשיא, גם לפני GO; פסילה זו נשמרת באיפוס פנימי. Restart ב־UI יוצר מנוע חדש עם התנאים העדכניים. בדיקת דפדפן ייעודית עברה ונכללת ב־required browser QA.
