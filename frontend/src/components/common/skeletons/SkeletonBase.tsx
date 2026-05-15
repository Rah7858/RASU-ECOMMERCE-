import { memo } from "react";
import { cn } from "@/lib/utils";

interface SkeletonBaseProps {
  className?: string;
  rounded?: "sm" | "md" | "lg" | "xl" | "2xl" | "full" | "none";
}

function SkeletonBaseInner({ className, rounded = "lg" }: SkeletonBaseProps) {
  const roundedClass = {
    none: "",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    "2xl": "rounded-2xl",
    full: "rounded-full",
  }[rounded];

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-muted/60",
        roundedClass,
        className
      )}
      aria-hidden="true"
    >
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </div>
  );
}

export const SkeletonBase = memo(SkeletonBaseInner);
