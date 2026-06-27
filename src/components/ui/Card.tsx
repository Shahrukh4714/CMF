import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface CardProps {
  variant?: "elevated" | "bordered" | "flat";
  hover?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
  className?: string;
  children: ReactNode;
  as?: "div" | "section" | "article";
}

const variantClasses = {
  elevated: "card-base",
  bordered: "card-base",
  flat: "bg-neutral-primary-soft",
};

const paddingClasses = {
  none: "p-0",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export function Card({
  variant = "bordered",
  hover = false,
  padding = "md",
  className,
  children,
  as: Tag = "div",
}: CardProps) {
  return (
    <Tag
      className={cn(
        "rounded-base",
        variantClasses[variant],
        paddingClasses[padding],
        hover && "card-interactive",
        className
      )}
    >
      {children}
    </Tag>
  );
}

export function CardHeader({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5 mb-4", className)}>
      {children}
    </div>
  );
}

export function CardTitle({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <h3
      className={cn(
        "text-lg font-bold leading-snug tracking-tight text-heading",
        className
      )}
    >
      {children}
    </h3>
  );
}

export function CardDescription({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <p
      className={cn(
        "text-sm text-body leading-relaxed",
        className
      )}
    >
      {children}
    </p>
  );
}

export function CardContent({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return <div className={cn(className)}>{children}</div>;
}

export function CardFooter({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 mt-6 pt-4 border-t border-border-default",
        className
      )}
    >
      {children}
    </div>
  );
}
