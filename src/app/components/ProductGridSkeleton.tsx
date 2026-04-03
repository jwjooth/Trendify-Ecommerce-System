import { memo } from "react";
import { SKELETON_ITEMS_COUNT } from "@lib/constants";

export const ProductGridSkeleton = memo(() => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {Array.from({ length: SKELETON_ITEMS_COUNT }).map((_, index) => (
      <div key={index} className="rounded-lg overflow-hidden bg-white shadow">
        <div className="bg-gradient-to-r from-slate-200 to-slate-300 animate-pulse h-64 mb-4" />
        <div className="p-4 space-y-3">
          <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded animate-pulse" />
          <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded animate-pulse w-3/4" />
          <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded animate-pulse w-1/2" />
        </div>
      </div>
    ))}
  </div>
));

ProductGridSkeleton.displayName = "ProductGridSkeleton";
