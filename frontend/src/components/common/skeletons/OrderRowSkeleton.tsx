import { memo } from "react";
import { SkeletonBase } from "./SkeletonBase";

function OrderRowSkeletonInner() {
  return (
    <div className="flex items-center gap-4 p-4 border-b border-border/50">
      {/* Order ID */}
      <SkeletonBase className="h-4 w-24 shrink-0" rounded="md" />
      {/* Customer */}
      <SkeletonBase className="h-4 w-32 shrink-0 hidden sm:block" rounded="md" />
      {/* Items count */}
      <SkeletonBase className="h-4 w-16 shrink-0 hidden md:block" rounded="md" />
      {/* Amount */}
      <SkeletonBase className="h-4 w-20 shrink-0" rounded="md" />
      {/* Status badge */}
      <SkeletonBase className="h-6 w-20 shrink-0" rounded="full" />
      {/* Date */}
      <SkeletonBase className="h-4 w-24 shrink-0 hidden lg:block" rounded="md" />
      {/* Actions */}
      <div className="ml-auto">
        <SkeletonBase className="h-8 w-8" rounded="md" />
      </div>
    </div>
  );
}

export const OrderRowSkeleton = memo(OrderRowSkeletonInner);
