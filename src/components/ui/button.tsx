import { type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "ghost" | "outline" | "subtle";

const styles: Record<Variant, string> = {
  primary:
    "bg-fg text-bg hover:bg-fg/90 border border-transparent",
  ghost: "bg-transparent text-fg hover:bg-surface-2 border border-transparent",
  outline: "bg-transparent text-fg border border-border hover:bg-surface-2",
  subtle: "bg-surface-2 text-fg border border-border hover:bg-surface",
};

export function Button({
  className,
  variant = "primary",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-4 text-sm font-medium transition-colors duration-(--motion-quick,150ms) disabled:pointer-events-none disabled:opacity-40",
        styles[variant],
        className,
      )}
      {...props}
    />
  );
}
