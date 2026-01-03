"use client";

import { ReactNode, useMemo } from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
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

  // Calculate current page from offset
  const currentPage = Math.floor(currentOffset / pagination.limit) + 1;
  const totalPages = Math.ceil(pagination.total / pagination.limit);

  // Calculate which page numbers to show
  const pageNumbers = useMemo(() => {
    const pages: (number | "ellipsis")[] = [];
    const maxVisiblePages = 3;

    if (totalPages <= maxVisiblePages + 2) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      // Calculate start and end of visible range
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      // Adjust if we're near the start
      if (currentPage <= 2) {
        end = Math.min(totalPages - 1, 3);
      }

      // Adjust if we're near the end
      if (currentPage >= totalPages - 1) {
        start = Math.max(2, totalPages - 2);
      }

      // Add ellipsis after first page if needed
      if (start > 2) {
        pages.push("ellipsis");
      }

      // Add visible page range
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      // Add ellipsis before last page if needed
      if (end < totalPages - 1) {
        pages.push("ellipsis");
      }

      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  }, [currentPage, totalPages]);

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

  const handlePageClick = (page: number) => {
    const newOffset = (page - 1) * pagination.limit;
    onPaginationChange(newOffset);
  };

  const isPreviousDisabled =
    pagination.previousOffset === null ||
    pagination.previousOffset < 0 ||
    isLoading;

  const isNextDisabled =
    (pagination.nextOffset && pagination.nextOffset >= pagination.total) ||
    pagination.nextOffset === null ||
    isLoading;

  return (
    <div className="flex items-center justify-end gap-1 mt-2">
      {/* Previous Button */}
      <button
        onClick={handlePrevious}
        disabled={isPreviousDisabled}
        className={cn(
          "inline-flex items-center gap-1 h-9 px-4 py-2 rounded-md transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          "disabled:pointer-events-none disabled:opacity-50",
          "hover:bg-[#f5f5f5] text-[#0a0a0a]",
          isPreviousDisabled && "cursor-not-allowed opacity-50"
        )}
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="text-sm font-medium">Previous</span>
      </button>

      {/* Page Numbers */}
      {pageNumbers.map((page, index) => {
        if (page === "ellipsis") {
          return (
            <div
              key={`ellipsis-${index}`}
              className="flex items-center justify-center h-9 w-9 p-2.5"
            >
              <MoreHorizontal className="h-4 w-4 text-[#0a0a0a]" />
            </div>
          );
        }

        const isActive = page === currentPage;
        return (
          <button
            key={page}
            onClick={() => handlePageClick(page)}
            disabled={isLoading}
            className={cn(
              "inline-flex items-center justify-center h-9 w-9 rounded-md transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              "disabled:pointer-events-none disabled:opacity-50",
              "text-sm font-medium",
              isActive
                ? "bg-white border border-[#e5e5e5] text-[#0a0a0a] shadow-[0px_1px_2px_0px_rgba(2,86,61,0.12)]"
                : "hover:bg-[#f5f5f5] text-[#0a0a0a]"
            )}
            aria-label={`Go to page ${page}`}
            aria-current={isActive ? "page" : undefined}
          >
            {page}
          </button>
        );
      })}

      {/* Next Button */}
      <button
        onClick={handleNext}
        disabled={isNextDisabled}
        className={cn(
          "inline-flex items-center gap-1 h-9 px-4 py-2 rounded-md transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          "disabled:pointer-events-none disabled:opacity-50",
          "hover:bg-[#f5f5f5] text-[#0a0a0a]",
          isNextDisabled && "cursor-not-allowed opacity-50"
        )}
        aria-label="Next page"
      >
        <span className="text-sm font-medium">Next</span>
        <ChevronRight className="h-4 w-4" />
      </button>
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
    <div className={className}>
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

      {/* Pagination Controls - Bottom */}
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
