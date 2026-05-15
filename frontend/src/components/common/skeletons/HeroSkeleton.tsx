import { memo } from "react";
import { SkeletonBase } from "./SkeletonBase";

function HeroSkeletonInner() {
  return (
    <section className="relative h-screen bg-background overflow-hidden">
      {/* Background image placeholder */}
      <SkeletonBase className="absolute inset-0" rounded="none" />

      {/* Content overlay */}
      <div className="relative h-full container mx-auto px-4 md:px-8 flex items-center">
        <div className="grid lg:grid-cols-2 gap-12 items-center w-full pt-20">
          {/* Left content */}
          <div className="space-y-8 z-10">
            {/* Headline — 3 lines */}
            <div className="space-y-4">
              <SkeletonBase className="h-16 md:h-20 lg:h-24 w-3/4" rounded="lg" />
              <SkeletonBase className="h-16 md:h-20 lg:h-24 w-1/2" rounded="lg" />
              <SkeletonBase className="h-16 md:h-20 lg:h-24 w-2/3" rounded="lg" />
            </div>
            {/* Subtitle */}
            <div className="space-y-2">
              <SkeletonBase className="h-5 w-full max-w-md" rounded="md" />
              <SkeletonBase className="h-5 w-4/5 max-w-md" rounded="md" />
            </div>
            {/* CTA buttons */}
            <div className="flex gap-4">
              <SkeletonBase className="h-14 w-44" rounded="full" />
              <SkeletonBase className="h-14 w-40" rounded="full" />
            </div>
            {/* Stats */}
            <div className="flex gap-10">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="text-center space-y-2">
                  <SkeletonBase className="h-8 w-16 mx-auto" rounded="md" />
                  <SkeletonBase className="h-4 w-24" rounded="md" />
                </div>
              ))}
            </div>
          </div>

          {/* Right widgets (desktop) */}
          <div className="hidden lg:block relative h-full">
            <SkeletonBase className="absolute top-32 right-0 h-24 w-56" rounded="2xl" />
            <SkeletonBase className="absolute bottom-48 right-20 h-24 w-40" rounded="2xl" />
            <SkeletonBase className="absolute top-1/2 right-8 h-14 w-14" rounded="full" />
          </div>
        </div>
      </div>
    </section>
  );
}

export const HeroSkeleton = memo(HeroSkeletonInner);
