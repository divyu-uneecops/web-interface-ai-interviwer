"use client";

import { ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Column alignment options
 */
export type ColumnAlignment = "left" | "center" | "right";

/**
 * Column definition for DataTable
 */
export interface Column<T> {
  /** Unique identifier for the column */
  id: string;
  /** Header label */
  header: string;
  /** Column alignment */
  align?: ColumnAlignment;
  /** Column width (CSS value) */
  width?: string;
  /** Custom cell renderer */
  cell?: (row: T, index: number) => ReactNode;
  /** Accessor function to get cell value */
  accessor?: (row: T) => ReactNode;
  /** Whether column is sortable */
  sortable?: boolean;
}

/**
 * Pagination state
 */
export interface PaginationState {
  /** Total number of items */
  total: number;
  /** Next page offset (null if no next page) */
  nextOffset: number | null;
  /** Previous page offset (null if no previous page) */
  previousOffset: number | null;
  /** Items per page limit */
  limit: number;
}

/**
 * DataTable props
 */
export interface DataTableProps<T> {
  /** Array of data items */
  data: T[];
  /** Column definitions */
  columns: Column<T>[];
  /** Unique key accessor for each row */
  getRowId: (row: T) => string;
  /** Pagination state */
  pagination?: PaginationState;
  /** Current offset for pagination */
  currentOffset?: number;
  /** Callback when pagination changes */
  onPaginationChange?: (offset: number) => void;
  /** Loading state */
  isLoading?: boolean;
  /** Empty state message */
  emptyMessage?: string;
  /** Custom empty state component */
  emptyState?: ReactNode;
  /** Custom loading state component */
  loadingState?: ReactNode;
  /** Custom row actions renderer */
  rowActions?: (row: T) => ReactNode;
  /** Additional className for table container */
  className?: string;
  /** Additional className for table */
  tableClassName?: string;
  /** Row click handler */
  onRowClick?: (row: T) => void;
  /** Show pagination controls */
  showPagination?: boolean;
}

/**
 * DataTablePagination component
 */
interface DataTablePaginationProps {
  pagination: PaginationState;
  currentOffset: number;
  onPaginationChange: (offset: number) => void;
  isLoading?: boolean;
  dataLength: number;
}

function DataTablePagination({
  pagination,
  currentOffset,
  onPaginationChange,
  isLoading = false,
  dataLength,
}: DataTablePaginationProps) {
  if (pagination.total === 0) return null;

  const startResult = currentOffset + 1;
  const endResult = Math.min(currentOffset + dataLength, pagination.total);

  const handlePrevious = () => {
    if (pagination.previousOffset !== null && pagination.previousOffset >= 0) {
      onPaginationChange(pagination.previousOffset);
    }
  };

  const handleNext = () => {
    if (pagination.nextOffset !== null) {
      onPaginationChange(pagination.nextOffset);
    }
  };

  const isPreviousDisabled =
    pagination.previousOffset === null ||
    pagination.previousOffset < 0 ||
    isLoading;

  const isNextDisabled = pagination.nextOffset === null || isLoading;

  return (
    <div className="flex items-center justify-end">
      <div className="flex items-center gap-2 mr-2 mb-2">
        <div className="text-sm text-[#737373] mr-2">
          {startResult}-{endResult} of {pagination.total}
        </div>
        <button
          onClick={handlePrevious}
          disabled={isPreviousDisabled}
          className={cn(
            "inline-flex items-center justify-center rounded-md transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            "disabled:pointer-events-none disabled:opacity-50",
            "hover:bg-accent hover:text-accent-foreground",
            isPreviousDisabled && "cursor-not-allowed opacity-50"
          )}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Previous</span>
        </button>

        <button
          onClick={handleNext}
          disabled={isNextDisabled}
          className={cn(
            "inline-flex items-center justify-center rounded-md transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            "disabled:pointer-events-none disabled:opacity-50",
            "hover:bg-accent hover:text-accent-foreground",
            isNextDisabled && "cursor-not-allowed opacity-50"
          )}
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Next</span>
        </button>
      </div>
    </div>
  );
}

/**
 * Reusable DataTable component with pagination support
 *
 * @example
 * ```tsx
 * <DataTable
 *   data={jobs}
 *   columns={columns}
 *   getRowId={(job) => job.id}
 *   pagination={pagination}
 *   currentOffset={currentOffset}
 *   onPaginationChange={setCurrentOffset}
 *   isLoading={isLoading}
 * />
 * ```
 */
export function DataTable<T>({
  data,
  columns,
  getRowId,
  pagination,
  currentOffset = 0,
  onPaginationChange,
  isLoading = false,
  emptyMessage = "No data found",
  emptyState,
  loadingState,
  rowActions,
  className,
  tableClassName,
  onRowClick,
  showPagination = true,
}: DataTableProps<T>) {
  const getCellContent = (column: Column<T>, row: T, index: number) => {
    if (column?.cell) {
      return column?.cell(row, index);
    }
    if (column?.accessor) {
      return column?.accessor(row);
    }
    return null;
  };

  const getAlignmentClass = (align?: ColumnAlignment) => {
    switch (align) {
      case "center":
        return "text-center";
      case "right":
        return "text-right";
      default:
        return "text-left";
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Pagination Controls - Top */}
      {showPagination &&
        pagination &&
        onPaginationChange &&
        pagination.total > 0 && (
          <DataTablePagination
            pagination={pagination}
            currentOffset={currentOffset}
            onPaginationChange={onPaginationChange}
            isLoading={isLoading}
            dataLength={data?.length}
          />
        )}

      {/* Table */}
      <div className="bg-white border border-[#e5e5e5] rounded-lg overflow-hidden px-4">
        <table className={cn("w-full", tableClassName)}>
          <thead>
            <tr className="border-b border-[#e5e5e5] h-10">
              {columns.map((column) => (
                <th
                  key={column.id}
                  className={cn(
                    "px-2 text-sm font-medium text-[#737373]",
                    getAlignmentClass(column.align),
                    column.width && `w-[${column.width}]`
                  )}
                  style={column.width ? { width: column.width } : undefined}
                >
                  {column.header}
                </th>
              ))}
              {rowActions && <th className="w-16"></th>}
            </tr>
          </thead>
          <tbody>
            {!isLoading &&
              data?.map((row, index) => (
                <tr
                  key={getRowId(row)}
                  className={cn(
                    "border-b border-[#e5e5e5] last:border-b-0 hover:bg-[#fafafa] h-[66px]",
                    onRowClick && "cursor-pointer"
                  )}
                  onClick={() => onRowClick?.(row)}
                >
                  {columns?.map((column) => (
                    <td
                      key={column?.id}
                      className={cn(
                        "px-2 text-sm font-normal text-[#0a0a0a]",
                        getAlignmentClass(column?.align)
                      )}
                    >
                      {getCellContent(column, row, index)}
                    </td>
                  ))}
                  {rowActions && (
                    <td className="px-2" onClick={(e) => e.stopPropagation()}>
                      {rowActions?.(row)}
                    </td>
                  )}
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Loading State */}
      {isLoading &&
        (loadingState || (
          <div className="text-center py-12">
            <p className="text-[#737373]">Loading...</p>
          </div>
        ))}

      {/* Empty State */}
      {!isLoading &&
        data?.length === 0 &&
        (emptyState || (
          <div className="text-center py-12">
            <p className="text-[#737373]">{emptyMessage}</p>
          </div>
        ))}
    </div>
  );
}
