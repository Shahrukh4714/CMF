import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type BadgeVariant = "default" | "brand" | "success" | "warning" | "danger" | "info";
type BadgeSize = "sm" | "md";

interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  pill?: boolean;
  dot?: boolean;
  className?: string;
  children: ReactNode;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: "bg-neutral-primary-soft text-heading border-border-default",
  brand: "bg-brand-softer text-fg-brand-strong border-border-brand-subtle",
  success: "bg-success-soft text-fg-success-strong border-border-success-subtle",
  warning: "bg-warning-soft text-fg-warning border-border-warning-subtle",
  danger: "bg-danger-soft text-fg-danger-strong border-border-danger-subtle",
  info: "bg-neutral-tertiary text-fg-info border-border-default",
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: "px-2 py-0.5 text-[10px]",
  md: "px-2.5 py-1 text-xs",
};

const dotColors: Record<BadgeVariant, string> = {
  default: "bg-body",
  brand: "bg-fg-brand",
  success: "bg-fg-success",
  warning: "bg-fg-warning",
  danger: "bg-fg-danger",
  info: "bg-fg-info",
};

export function Badge({
  variant = "default",
  size = "md",
  pill = false,
  dot = false,
  className,
  children,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 border font-medium tracking-wide uppercase",
        pill ? "rounded-full" : "rounded-[10px]",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {dot && (
        <span
          className={cn(
            "h-1.5 w-1.5 rounded-full",
            dotColors[variant]
          )}
        />
      )}
      {children}
    </span>
  );
}
