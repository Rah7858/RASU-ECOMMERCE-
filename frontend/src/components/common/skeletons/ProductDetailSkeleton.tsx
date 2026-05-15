import { memo } from "react";
import { SkeletonBase } from "./SkeletonBase";

function ProductDetailSkeletonInner() {
  return (
    <div className="min-h-screen bg-background pt-32 pb-20">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image gallery */}
          <div className="space-y-4">
            <SkeletonBase className="aspect-square w-full" rounded="2xl" />
            <div className="flex gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <SkeletonBase key={i} className="w-20 h-20" rounded="xl" />
              ))}
            </div>
          </div>

          {/* Product info */}
          <div className="space-y-6">
            {/* Breadcrumb */}
            <SkeletonBase className="h-4 w-48" rounded="full" />
            {/* Category */}
            <SkeletonBase className="h-3 w-24" rounded="full" />
            {/* Title */}
            <SkeletonBase className="h-8 w-3/4" rounded="md" />
            {/* Rating */}
            <div className="flex items-center gap-2">
              <SkeletonBase className="h-5 w-28" rounded="full" />
              <SkeletonBase className="h-5 w-16" rounded="full" />
            </div>
            {/* Price */}
            <div className="flex items-center gap-3">
              <SkeletonBase className="h-8 w-24" rounded="md" />
              <SkeletonBase className="h-6 w-16" rounded="md" />
            </div>
            {/* Description */}
            <div className="space-y-2">
              <SkeletonBase className="h-4 w-full" rounded="md" />
              <SkeletonBase className="h-4 w-5/6" rounded="md" />
              <SkeletonBase className="h-4 w-2/3" rounded="md" />
            </div>
            {/* Size selector */}
            <div className="space-y-3">
              <SkeletonBase className="h-5 w-20" rounded="md" />
              <div className="flex gap-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <SkeletonBase key={i} className="w-12 h-12" rounded="xl" />
                ))}
              </div>
            </div>
            {/* Action buttons */}
            <div className="flex gap-3 pt-4">
              <SkeletonBase className="h-12 flex-1" rounded="full" />
              <SkeletonBase className="h-12 w-12" rounded="full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const ProductDetailSkeleton = memo(ProductDetailSkeletonInner);
