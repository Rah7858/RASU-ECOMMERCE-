import { memo } from "react";
import { SkeletonBase } from "./SkeletonBase";

function ProductCardSkeletonInner() {
  return (
    <div className="bg-card rounded-2xl overflow-hidden border border-border/50">
      {/* Image area — matches aspect-[4/5] from product cards */}
      <SkeletonBase className="aspect-[4/5] w-full" rounded="none" />

      {/* Product info */}
      <div className="p-4 space-y-3">
        {/* Subcategory */}
        <SkeletonBase className="h-3 w-16" rounded="full" />
        {/* Name */}
        <SkeletonBase className="h-5 w-3/4" rounded="md" />
        {/* Price row */}
        <div className="flex items-center gap-2">
          <SkeletonBase className="h-5 w-20" rounded="md" />
          <SkeletonBase className="h-4 w-14" rounded="md" />
        </div>
        {/* Rating */}
        <SkeletonBase className="h-4 w-24" rounded="full" />
      </div>
    </div>
  );
}

export const ProductCardSkeleton = memo(ProductCardSkeletonInner);
