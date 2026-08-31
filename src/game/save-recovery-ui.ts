import type { SavePersistenceStatus } from "./save-recovery";

export const SAVE_STATUS_EVENT = "rush-save-status";
const NOTICE_ID = "rush-save-recovery-notice";
let dismissedSignature = "";
let focusReturnTarget: HTMLElement | null = null;

function rememberFocus(existing: HTMLElement | null) {
  if (focusReturnTarget !== null || existing !== null) return;
  const active = document.activeElement;
  if (active && typeof (active as HTMLElement).focus === "function") {
    focusReturnTarget = active as HTMLElement;
  }
}

function restorePreviousFocus() {
  const target = focusReturnTarget;
  focusReturnTarget = null;
  try {
    target?.focus();
  } catch {
    // The original control may have been removed while recovery was visible.
  }
}

export type SaveRecoveryUiActions = {
  restore(): void;
  startFresh(): void;
  retry(): void;
  reload(): void;
};

function signature(status: SavePersistenceStatus) {
  return [
    status.state,
    status.source,
    status.errorCode ?? "",
    status.recoveryErrorCode ?? "",
    status.recoveryAction,
    status.error ?? "",
  ].join(":");
}

function button(label: string, action: () => void) {
  const element = document.createElement("button");
  element.type = "button";
  element.textContent = label;
  Object.assign(element.style, {
    minHeight: "44px",
    border: "1px solid rgba(255,255,255,.45)",
    borderRadius: "10px",
    padding: "10px 14px",
    background: "#ffffff",
    color: "#111827",
    fontWeight: "700",
    cursor: "pointer",
  });
  element.addEventListener("click", action);
  return element;
}

function copyFor(status: SavePersistenceStatus) {
  if (status.state === "recovered") {
    return {
      title: "השמירה שוחזרה · Save restored",
      body: "עותק הגיבוי אומת והוחזר. יש לטעון מחדש כדי להשתמש בנתונים ששוחזרו. · The verified backup was restored. Reload to use the recovered data.",
    };
  }
  if (status.state === "fresh-started") {
    return {
      title: "נוצרה שמירה חדשה · New save created",
      body: status.quarantined
        ? "העותק הפגום נשמר בנפרד לפני יצירת שמירה חדשה. · The rejected bytes were preserved separately before a new save was created."
        : "נוצרו שמירה חדשה וגיבוי מאומת. · A new save and verified backup were created.",
    };
  }
  if (status.state === "recovery-available") {
    return {
      title: "נמצא גיבוי שמירה · Save backup found",
      body: "נתוני השמירה הראשיים חסרים. לא תתבצע כתיבה עד לבחירה מפורשת. · The primary save is missing. Writes are blocked until you choose an action.",
    };
  }
  if (status.state === "rejected") {
    if (status.recoveryAction === "retry") {
      return {
        title: "לא ניתן לקרוא את השמירה · Save storage unavailable",
        body: "לא בוצעה כתיבה ולא נדרסו נתונים. תקן הרשאות או נפח אחסון ונסה שוב. · No write occurred and no data was overwritten. Fix storage permissions or capacity, then retry.",
      };
    }
    return {
      title: "נתוני השמירה נדחו · Save data rejected",
      body: status.backupAvailable
        ? "השמירה הראשית לא נדרסה. קיים גיבוי מאומת שניתן לשחזר. · The primary bytes were not overwritten. A verified backup can be restored."
        : "השמירה הראשית לא נדרסה. ניתן להתחיל מחדש רק לאחר שמירת העותק הפגום בנפרד. · The primary bytes were not overwritten. A fresh save requires preserving the rejected copy first.",
    };
  }
  return {
    title: "השינויים לא נשמרו · Changes were not saved",
    body: "המשחק שמר את הנתונים הקיימים ולא דרס אותם. נסה שוב לאחר תיקון הרשאות או נפח אחסון. · Existing bytes were preserved. Retry after fixing storage permissions or capacity.",
  };
}

export function publishSavePersistenceStatus(status: SavePersistenceStatus, actions: SaveRecoveryUiActions) {
  if (typeof window === "undefined" || typeof document === "undefined") return;
  window.dispatchEvent(new CustomEvent(SAVE_STATUS_EVENT, { detail: status }));

  const visible = ["rejected", "write-failed", "recovery-available", "recovered", "fresh-started"].includes(status.state);
  const existing = document.getElementById(NOTICE_ID);
  const isDialog = status.notice !== "success";
  if (!visible) {
    // A successful/ordinary state closes the dismissal cycle. A later failure,
    // even with the same shape, must become visible again.
    dismissedSignature = "";
    if (existing) {
      existing.remove();
      restorePreviousFocus();
    }
    return;
  }
  if (dismissedSignature === signature(status)) {
    if (existing) {
      existing.remove();
      restorePreviousFocus();
    }
    return;
  }
  if (!document.body) return;
  const currentSignature = signature(status);
  if (existing?.dataset.saveStatusSignature === currentSignature) return;
  if (isDialog) rememberFocus(existing);
  existing?.remove();
  if (!isDialog) restorePreviousFocus();

  const notice = document.createElement("section");
  notice.id = NOTICE_ID;
  notice.dataset.saveStatusSignature = currentSignature;
  notice.setAttribute("role", status.notice === "success" ? "status" : "alertdialog");
  notice.setAttribute("aria-live", status.notice === "success" ? "polite" : "assertive");
  notice.setAttribute("aria-atomic", "true");
  notice.setAttribute("aria-label", "Save recovery");
  notice.tabIndex = -1;
  Object.assign(notice.style, {
    position: "fixed",
    insetInline: "12px",
    bottom: "12px",
    zIndex: "2147483647",
    maxWidth: "760px",
    marginInline: "auto",
    border: "1px solid rgba(255,255,255,.28)",
    borderRadius: "16px",
    padding: "16px",
    background: "rgba(17,24,39,.97)",
    color: "#ffffff",
    boxShadow: "0 18px 50px rgba(0,0,0,.45)",
    fontFamily: "system-ui, -apple-system, sans-serif",
    lineHeight: "1.45",
    direction: "rtl",
  });

  const copy = copyFor(status);
  const heading = document.createElement("h2");
  heading.textContent = copy.title;
  Object.assign(heading.style, { margin: "0 0 8px", fontSize: "18px", fontWeight: "800" });
  const body = document.createElement("p");
  body.textContent = copy.body;
  Object.assign(body.style, { margin: "0 0 14px", fontSize: "14px" });
  const controls = document.createElement("div");
  Object.assign(controls.style, { display: "flex", flexWrap: "wrap", gap: "8px" });
  let primaryAction: HTMLButtonElement | null = null;

  if (status.recoveryAction === "restore-backup") {
    primaryAction = button("שחזר גיבוי · Restore backup", actions.restore);
    controls.append(primaryAction);
  } else if (status.recoveryAction === "start-fresh") {
    let armed = false;
    const fresh = button("התחל מחדש ושמור עותק פגום · Start fresh and preserve rejected copy", () => {
      if (!armed) {
        armed = true;
        fresh.textContent = "לחץ שוב לאישור · Press again to confirm";
        fresh.focus();
        return;
      }
      actions.startFresh();
    });
    primaryAction = fresh;
    controls.append(fresh);
  } else if (status.recoveryAction === "retry") {
    primaryAction = button("נסה שוב · Retry", actions.retry);
    controls.append(primaryAction);
  }

  if (status.state === "recovered" || status.state === "fresh-started") {
    controls.append(button("טען מחדש · Reload", actions.reload));
  }

  controls.append(button("סגור · Dismiss", () => {
    dismissedSignature = signature(status);
    notice.remove();
    restorePreviousFocus();
  }));
  notice.append(heading, body, controls);
  document.body.append(notice);
  if (isDialog) (primaryAction ?? notice).focus();
}
