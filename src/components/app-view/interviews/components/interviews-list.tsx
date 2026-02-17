"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import Link from "next/link";
import { Plus, Search, MoreHorizontal, Eye, Calendar } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { DataTable, Column } from "@/components/shared/components/data-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FilterDropdown } from "@/components/shared/components/filter-dropdown";
import {
  FilterState,
  FilterGroup,
} from "@/components/shared/interfaces/shared.interface";
import { InterviewDetail } from "../interfaces/interview.interface";
import {
  formatInterviewDate,
  transformAPIResponseToInterviews,
} from "../utils/interview.utils";
import { statusStyles } from "../constants/interview.constants";
import { DataTableSkeleton } from "@/components/shared/components/data-table-skeleton";
import { interviewService } from "../services/interview.service";
import { useAppSelector } from "@/store/hooks";

const SEARCH_DEBOUNCE_MS = 400;

export default function InterviewsList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [interviews, setInterviews] = useState<InterviewDetail[]>([]);
  const [pagination, setPagination] = useState({
    total: 0,
    nextOffset: null as number | null,
    previousOffset: null as number | null,
    limit: 10,
  });
  const PAGE_LIMIT = 10;
  const [currentOffset, setCurrentOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [appliedFilters, setAppliedFilters] = useState<FilterState>({
    status: [],
  });
  const { views } = useAppSelector((state) => state.appState);

  // Define filter groups for interviews
  const interviewFilterGroups: FilterGroup[] = [
    {
      id: "status",
      label: "Status",
      options: [
        { value: "Scheduled", label: "Scheduled" },
        { value: "Completed", label: "Completed" },
        { value: "Cancelled", label: "Cancelled" },
      ],
    },
  ];

  // Debounce search input -> searchKeyword
  useEffect(() => {
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }
    searchDebounceRef.current = setTimeout(() => {
      setSearchKeyword(searchQuery.trim());
      setCurrentOffset(0);
      searchDebounceRef.current = null;
    }, SEARCH_DEBOUNCE_MS);
    return () => {
      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current);
      }
    };
  }, [searchQuery]);

  useEffect(() => {
    fetchInterviews();
  }, [currentOffset, appliedFilters, searchKeyword]);

  const fetchInterviews = async () => {
    setIsLoading(true);
    setInterviews([]);
    setPagination({
      total: 0,
      nextOffset: null,
      previousOffset: null,
      limit: PAGE_LIMIT,
    });

    try {
      const params: Record<string, any> = {
        limit: 1,
        offset: currentOffset,
        ...(searchKeyword ? { query: searchKeyword } : {}),
      };

      const response = await interviewService.getInterviewsFromView(
        params,
        {
          filters: {
            $and: [
              ...(appliedFilters?.status?.length > 0
                ? [
                    {
                      key: "#.records.status",
                      operator: "$in",
                      value: appliedFilters.status,
                      type: "select",
                    },
                  ]
                : []),
            ],
          },
          appId: process.env.NEXT_PUBLIC_APP_ID || "",
        },
        {
          objectId: views?.["interviews"]?.objectId || "",
          viewId: views?.["interviews"]?.viewId || "",
        }
      );

      // Transform API response
      const result = transformAPIResponseToInterviews(
        response?.data || [],
        response?.page || {
          total: 0,
          nextOffset: null,
          previousOffset: null,
          limit: PAGE_LIMIT,
        }
      );

      setInterviews(result?.interviews || []);
      setPagination({
        total: result?.pagination?.total[0] || 0,
        nextOffset: result?.pagination?.nextOffset,
        previousOffset: result?.pagination?.previousOffset,
        limit: result?.pagination?.limit,
      });

      // Scroll to top when page changes
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error: any) {
      console.error("Error fetching interviews:", error);
      toast.error(
        error?.response?.data?.message || "Failed to fetch interviews",
        {
          duration: 3000,
        }
      );
      setInterviews([]);
      setPagination({
        total: 0,
        nextOffset: null,
        previousOffset: null,
        limit: PAGE_LIMIT,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Define table columns - matching Figma design exactly
  const columns: Column<InterviewDetail>[] = useMemo(
    () => [
      {
        id: "applicants",
        header: "Applicants",
        align: "left",
        accessor: (interview) => interview?.candidateName,
      },
      {
        id: "email",
        header: "Email",
        align: "center",
        accessor: (interview) => interview?.candidateEmail?.label,
      },
      {
        id: "job",
        header: "Job title",
        align: "center",
        accessor: (interview) => interview?.jobTitle?.label,
      },
      {
        id: "round",
        header: "Round",
        align: "center",
        accessor: (interview) => interview?.roundName?.label,
      },
      {
        id: "status",
        header: "Status",
        align: "center",
        width: "125px",
        cell: (interview) => (
          <div className="flex justify-center">
            <Badge
              variant="outline"
              className={`font-normal text-xs tracking-[0.3px] rounded-full px-2 py-0 h-6 border-transparent ${
                statusStyles[
                  interview?.status?.toLowerCase() as keyof typeof statusStyles
                ]
              }`}
            >
              {interview?.status}
            </Badge>
          </div>
        ),
      },
      {
        id: "score",
        header: "Score",
        align: "center",
        width: "111px",
        cell: (interview) => (
          <div className="flex justify-center">
            {interview?.score !== undefined && interview?.score !== null ? (
              <span className="text-sm font-normal text-[#0a0a0a]">
                {interview?.score} %
              </span>
            ) : (
              <span className="text-sm text-[#737373]">-</span>
            )}
          </div>
        ),
      },
      {
        id: "interviewDate",
        header: "Interview date",
        align: "center",
        accessor: (interview) => formatInterviewDate(interview?.interviewDate),
      },
    ],
    []
  );

  // Row actions renderer - matching Figma design
  const renderRowActions = (interview: InterviewDetail) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4 text-[#0a0a0a]" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-[171px] p-1 bg-white border border-[#e5e5e5] rounded-md shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)]"
      >
        <DropdownMenuItem asChild>
          <Link href={`/app-view/interviews/${interview?.id}`}>
            <Eye className="h-4 w-4 text-[#737373]" />
            View details
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const handleApplyFilters = (filters: FilterState) => {
    setAppliedFilters(filters);
    setCurrentOffset(0); // Reset to first page when filters are applied
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 px-3 py-2.5 border-b border-[#e5e5e5] w-[245px]">
          <Search className="w-4 h-4 text-[#737373]" />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e?.target?.value)}
            className="flex-1 text-sm text-[#737373] bg-transparent border-0 outline-none placeholder:text-[#737373]"
          />
        </div>

        {/* Search & Actions */}
        <div className="flex items-center gap-3">
          {/* Filters Button */}
          <FilterDropdown
            filterGroups={interviewFilterGroups}
            onApplyFilters={handleApplyFilters}
            initialFilters={appliedFilters}
          />

          {/* Create Interview Button */}
          <Button
            variant="secondary"
            size="default"
            onClick={() => {
              // TODO: Open create interview modal
              toast.info("Create interview feature coming soon");
            }}
            className="h-9 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]"
          >
            <Plus className="w-4 h-4" />
            Create interview
          </Button>
        </div>
      </div>

      {/* Interviews Table */}
      <DataTable<InterviewDetail>
        data={interviews || []}
        columns={columns}
        getRowId={(interview) => interview?.id}
        pagination={pagination}
        currentOffset={currentOffset}
        onPaginationChange={setCurrentOffset}
        isLoading={isLoading}
        loadingState={<DataTableSkeleton columns={8} rows={11} />}
        emptyState={
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-[#737373] mx-auto mb-4" />
            <p className="text-[#737373] text-sm font-medium">
              No interviews found
            </p>
            {(appliedFilters?.status?.length > 0 || searchQuery) && (
              <p className="text-[#737373] text-sm mt-1">
                Try adjusting your filters or search query to find what
                you&apos;re looking for.
              </p>
            )}
          </div>
        }
        rowActions={renderRowActions}
      />
    </div>
  );
}
