import { RIVALS } from "./cars";
import type { CareerEvent } from "./career";

export function rivalName(i: number, he: boolean) {
  const r = RIVALS[((i % RIVALS.length) + RIVALS.length) % RIVALS.length];
  return he ? r.he : r.en;
}

export function introLine(ev: CareerEvent | null, he: boolean): string {
  if (ev?.lineHe) return he ? ev.lineHe : (ev.lineEn ?? ev.lineHe);
  const i = (ev?.chapter ?? 1) % RIVALS.length;
  const name = rivalName(i, he);
  const linesHe = [
    `${name}: בוא נראה אם אתה שייך לרחוב.`,
    `${name}: אל תישן בזינוק.`,
    `${name}: אני לוקח את הקו הפנימי.`,
    `${name}: נסיעה נקייה. בלי דרמות.`,
  ];
  const linesEn = [
    `${name}: Let's see if you belong on this street.`,
    `${name}: Don't sleep on the lights.`,
    `${name}: I'm taking the inside line.`,
    `${name}: Clean run. No drama.`,
  ];
  return he ? linesHe[i] : linesEn[i];
}

export function overtakeLine(ahead: boolean, he: boolean, rivalIdx: number): string {
  const name = rivalName(rivalIdx, he);
  if (ahead) {
    return he ? `${name}: תעבור אותי? חח.` : `${name}: Passing me? Cute.`;
  }
  return he ? `${name}: חזרתי. תתרגל.` : `${name}: I'm back. Get used to it.`;
}

export function finishLine(place: number, busted: boolean, he: boolean, rivalIdx: number): string {
  const name = rivalName(rivalIdx, he);
  if (busted) return he ? `${name}: המשטרה עשתה לך את העבודה.` : `${name}: The cops did my job.`;
  if (place === 1) return he ? `${name}: סבבה. סיבוב הבא שלי.` : `${name}: Fine. Next one's mine.`;
  if (place === 2) return he ? `${name}: קרוב. לא מספיק.` : `${name}: Close. Not enough.`;
  return he ? `${name}: לך הביתה, תתקן את הרכב.` : `${name}: Go home. Fix the car.`;
}
