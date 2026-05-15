import { memo } from "react";
import { SkeletonBase } from "./SkeletonBase";

function NavbarSkeletonInner() {
  return (
    <div className="h-20 md:h-24 bg-background/80 backdrop-blur-xl border-b border-border/30 flex items-center px-4 md:px-8">
      {/* Left nav links */}
      <div className="hidden lg:flex items-center gap-10 flex-1">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonBase key={i} className="h-4 w-16" rounded="md" />
        ))}
      </div>

      {/* Mobile menu button */}
      <div className="lg:hidden">
        <SkeletonBase className="h-10 w-10" rounded="xl" />
      </div>

      {/* Center logo */}
      <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-3">
        <SkeletonBase className="h-10 w-10" rounded="full" />
        <SkeletonBase className="h-6 w-20" rounded="md" />
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2 ml-auto">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonBase key={i} className="h-10 w-10" rounded="xl" />
        ))}
      </div>
    </div>
  );
}

export const NavbarSkeleton = memo(NavbarSkeletonInner);
