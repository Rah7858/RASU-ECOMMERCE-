import { memo } from "react";
import { SkeletonBase } from "./SkeletonBase";

function AdminStatCardSkeletonInner() {
  return (
    <div className="bg-card rounded-2xl border border-border/50 p-6 space-y-4">
      <div className="flex items-center justify-between">
        <SkeletonBase className="h-10 w-10" rounded="xl" />
        <SkeletonBase className="h-4 w-16" rounded="full" />
      </div>
      <div className="space-y-2">
        <SkeletonBase className="h-8 w-28" rounded="md" />
        <SkeletonBase className="h-4 w-20" rounded="md" />
      </div>
    </div>
  );
}

export const AdminStatCardSkeleton = memo(AdminStatCardSkeletonInner);
