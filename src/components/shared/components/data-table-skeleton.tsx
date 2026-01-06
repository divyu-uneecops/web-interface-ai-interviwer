"use client";

import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Props for DataTableSkeleton component
 */
export interface DataTableSkeletonProps<T = any> {
  /** Column definitions (same as DataTable columns) */
  columns: number;
  /** Number of skeleton rows to display */
  rows: number;
  /** Additional className for container */
  className?: string;
  /** Additional className for each row */
  rowClassName?: string;
  /** Additional className for each skeleton item */
  skeletonClassName?: string;
}

/**
 * Generic skeleton loader component for tables
 * Renders skeleton elements based on columns and rows count
 *
 * @example
 * ```tsx
 * <DataTableSkeleton
 *   columns={columns}
 *   rows={5}
 * />
 * ```
 */
export function DataTableSkeleton<T = any>({
  columns = 7,
  rows = 5,
  className,
  rowClassName,
  skeletonClassName,
}: DataTableSkeletonProps<T>) {
  return (
    <div className={cn("w-full", className)}>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className={cn("flex gap-2 mb-2", rowClassName)}>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton
              key={colIndex}
              className={cn(
                "h-8 bg-[#e5e5e5] flex-1 w-full",
                skeletonClassName
              )}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
