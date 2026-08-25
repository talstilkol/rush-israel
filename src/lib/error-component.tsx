import type { ErrorComponentProps } from "@tanstack/react-router";
import { TriangleAlert } from "lucide-react";
import { errorId } from "@/game/math";

export function AppErrorComponent({ error }: ErrorComponentProps) {
  const id = errorId(error.message || "unknown");
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-3 bg-bg px-6 text-center text-fg">
      <span className="text-danger" aria-hidden="true">
        <TriangleAlert className="size-10" strokeWidth={2} />
      </span>
      <h1 className="text-lg font-semibold">משהו השתבש</h1>
      <p className="max-w-md text-sm break-words text-muted">{error.message || "שגיאה לא צפויה. נסו לרענן."}</p>
      <p className="font-mono text-xs tracking-widest text-subtle" data-error-id={id}>
        {id}
      </p>
    </main>
  );
}