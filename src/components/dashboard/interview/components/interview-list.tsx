"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  MoreHorizontal,
  Eye,
  Trash2,
  ExternalLink,
  Calendar,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable, Column } from "@/components/shared/components/data-table";
import { InterviewStatsGrid } from "./interview-stats-card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FilterDropdown } from "@/components/shared/components/filter-dropdown";
import {
  FilterState,
  FilterGroup,
} from "@/components/shared/interfaces/shared.interface";

import { InterviewDetail } from "../interfaces/interview.interface";
import {
  formatDateTime,
  getStatusText,
  formatInterviewDate,
} from "../utils/interview.utils";
import {
  stats,
  statusStyles,
  mockInterviews,
} from "../constants/interview.constants";
import { toast } from "sonner";
import { DataTableSkeleton } from "@/components/shared/components/data-table-skeleton";

export default function InterviewList() {
  const [searchQuery, setSearchQuery] = useState("");
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

  // Define filter groups for interviews
  const interviewFilterGroups: FilterGroup[] = [
    {
      id: "status",
      label: "Status",
      options: [
        { value: "scheduled", label: "Scheduled" },
        { value: "in-progress", label: "In Progress" },
        { value: "completed", label: "Completed" },
        { value: "cancelled", label: "Cancelled" },
        { value: "pending", label: "Pending" },
      ],
    },
  ];

  useEffect(() => {
    fetchInterviews();
  }, [currentOffset, appliedFilters, searchQuery]);

  const fetchInterviews = () => {
    setIsLoading(true);

    // Simulate API delay
    setTimeout(() => {
      // Filter by status
      let filtered = [...mockInterviews];

      if (appliedFilters.status.length > 0) {
        filtered = filtered.filter((interview) =>
          appliedFilters.status.includes(interview.status)
        );
      }

      // Filter by search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(
          (interview) =>
            interview.candidateName.toLowerCase().includes(query) ||
            interview.candidateEmail.toLowerCase().includes(query) ||
            interview.jobTitle.toLowerCase().includes(query)
        );
      }

      // Calculate pagination
      const total = filtered.length;
      const startIndex = currentOffset;
      const endIndex = startIndex + PAGE_LIMIT;
      const paginatedInterviews = filtered.slice(startIndex, endIndex);

      setInterviews(paginatedInterviews);
      setPagination({
        total,
        nextOffset: endIndex < total ? endIndex : null,
        previousOffset: startIndex > 0 ? startIndex - PAGE_LIMIT : null,
        limit: PAGE_LIMIT,
      });

      setIsLoading(false);
      // Scroll to top when page changes
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 300);
  };

  // Define table columns - matching Figma design exactly
  const columns: Column<InterviewDetail>[] = useMemo(
    () => [
      {
        id: "applicants",
        header: "Applicants",
        align: "left",
        cell: (interview) => (
          <span className="text-sm font-normal text-[#0a0a0a]">
            {interview.candidateName}
          </span>
        ),
      },
      {
        id: "email",
        header: "Email",
        align: "center",
        cell: (interview) => (
          <span className="text-sm font-normal text-[#0a0a0a] text-center">
            {interview.candidateEmail}
          </span>
        ),
      },
      {
        id: "job",
        header: "Job title",
        align: "center",
        cell: (interview) => (
          <span className="text-sm font-normal text-[#0a0a0a] text-center">
            {interview.jobTitle}
          </span>
        ),
      },
      {
        id: "round",
        header: "Round",
        align: "center",
        cell: (interview) => (
          <span className="text-sm font-normal text-[#0a0a0a] text-center">
            {interview.roundName}
          </span>
        ),
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
                statusStyles[interview.status] || statusStyles.pending
              }`}
            >
              {getStatusText(interview.status)}
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
            {interview.score !== undefined && interview.score !== null ? (
              <span className="text-sm font-normal text-[#0a0a0a]">
                {interview.score} %
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
        cell: (interview) => (
          <span className="text-sm font-normal text-[#0a0a0a] text-center">
            {formatInterviewDate(interview.scheduledDate)}
          </span>
        ),
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
          <Link href={`/dashboard/interviews/${interview.id}`}>
            <Eye className="h-4 w-4 text-[#737373]" />
            View details
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const handleDeleteInterview = (id: string) => {
    // Remove from mock data (in a real app, this would be an API call)
    const interviewIndex = mockInterviews.findIndex(
      (int) => int.interviewId === id
    );
    if (interviewIndex !== -1) {
      mockInterviews.splice(interviewIndex, 1);
      toast.success("Interview deleted successfully", {
        duration: 3000,
      });
      setCurrentOffset(0);
      fetchInterviews();
    } else {
      toast.error("Interview not found", {
        duration: 3000,
      });
    }
  };

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
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentOffset(0);
            }}
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
        data={interviews}
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
            <p className="text-[#737373] text-sm">No interviews found</p>
          </div>
        }
        rowActions={renderRowActions}
      />
    </div>
  );
}
