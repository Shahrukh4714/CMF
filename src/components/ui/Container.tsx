import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type ContainerSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "full";

interface ContainerProps {
  size?: ContainerSize;
  className?: string;
  children: ReactNode;
  as?: "div" | "section" | "article" | "header" | "footer";
}

const sizeClasses: Record<ContainerSize, string> = {
  xs: "max-w-xs",
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  full: "max-w-full",
};

export function Container({
  size = "xl",
  className,
  children,
  as: Tag = "div",
}: ContainerProps) {
  return (
    <Tag
      className={cn(
        "mx-auto w-full px-4 sm:px-6",
        sizeClasses[size],
        className
      )}
    >
      {children}
    </Tag>
  );
}
