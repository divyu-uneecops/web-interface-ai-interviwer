"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { DataTable, Column } from "@/components/shared/components/data-table";
import { JobStatsGrid } from "@/components/app-view/job/components/job-stats-card";
import { FilterDropdown } from "@/components/shared/components/filter-dropdown";
import {
  FilterState,
  FilterGroup,
} from "@/components/shared/interfaces/shared.interface";
import { JobDetail } from "../interfaces/job.interface";
import { CreateJobModal } from "./create-job-modal";
import { jobService } from "../services/job.service";
import { transformAPIResponseToJobs } from "../utils/job.utils";
import { stats, statusStyles } from "../constants/job.constants";
import { isEmpty } from "@/lib/utils";
import { toast } from "sonner";
import { useAppSelector } from "@/store/hooks";
import { DataTableSkeleton } from "@/components/shared/components/data-table-skeleton";

export default function JobList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [jobs, setJobs] = useState<JobDetail[]>([]);
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
  const { mappingValues } = useAppSelector((state) => state.jobs);

  // Define filter groups for jobs
  const jobFilterGroups: FilterGroup[] = [
    {
      id: "status",
      label: "Status",
      options:
        mappingValues?.jobOpening?.status?.map((status: string) => ({
          value: status,
          label: status,
        })) || [],
    },
  ];

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [jobDetail, setJobDetail] = useState<JobDetail | null>(null);

  useEffect(() => {
    fetchJobs();
  }, [currentOffset, appliedFilters]);

  const fetchJobs = async () => {
    setIsLoading(true);
    setJobs([]);
    setPagination({
      total: 0,
      nextOffset: null,
      previousOffset: null,
      limit: PAGE_LIMIT,
    });
    try {
      const params: Record<string, any> = {
        limit: PAGE_LIMIT,
        offset: currentOffset,
      };

      const response = await jobService.getJobOpenings(params, {
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
        appId: "69521cd1c9ba83a076aac3ae",
      });
      const result = transformAPIResponseToJobs(response?.data, response?.page);
      setJobs(result?.jobs);
      setPagination(result?.pagination);
      // Scroll to top when page changes
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      setJobs([]);
      setPagination({
        total: 0,
        nextOffset: null,
        previousOffset: null,
        limit: 10,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Define table columns
  const columns: Column<JobDetail>[] = useMemo(
    () => [
      {
        id: "position",
        header: "Position",
        align: "left",
        accessor: (job) => job?.title,
      },
      {
        id: "status",
        header: "Status",
        align: "center",
        width: "125px",
        cell: (job) => (
          <div className="flex justify-center">
            <Badge
              variant="outline"
              className={`capitalize font-normal text-xs tracking-[0.3px] rounded-full px-2 py-0 h-6 ${
                statusStyles[
                  job?.status?.toLowerCase() as keyof typeof statusStyles
                ]
              }`}
            >
              {job?.status}
            </Badge>
          </div>
        ),
      },
      {
        id: "noOfOpening",
        header: "No. of opening",
        align: "center",
        accessor: (job) => job?.numOfOpenings,
      },
      {
        id: "applicants",
        header: "Applicants",
        align: "center",
        accessor: (job) => job?.applicants,
      },
      {
        id: "interviews",
        header: "Interviews",
        align: "center",
        accessor: (job) => job?.interviews,
      },
      {
        id: "created",
        header: "Created",
        align: "center",
        accessor: (job) => job?.createdOn,
      },
    ],
    []
  );

  // Row actions renderer
  const renderRowActions = (job: JobDetail) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href={`/app-view/jobs/${job?.id}`}>
            <Eye className="h-4 text-[#737373]" />
            View details
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleEditJob(job)}>
          <Pencil className="h-4 text-[#737373]" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onClick={() => handleDeleteJob(job?.id)}
        >
          <Trash2 className="h-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const handleDeleteJob = async (id: string) => {
    if (isEmpty(id)) return;
    try {
      const response = await jobService.deleteJobOpening(id);
      toast.success(response ? response : "An unknown error occurred", {
        duration: 8000, // 8 seconds
      });
      setCurrentOffset(0);
      if (currentOffset === 0) {
        fetchJobs();
      }
    } catch (error: any) {
      toast.error(
        error ? error.response.data.message : "An unknown error occurred",
        {
          duration: 8000, // 8 seconds
        }
      );
    }
  };

  const handleEditJob = (job: JobDetail) => {
    setJobDetail(job);
    setIsEditModalOpen(true);
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
            onChange={(e) => setSearchQuery(e?.target?.value)}
            className="flex-1 text-sm text-[#737373] bg-transparent border-0 outline-none placeholder:text-[#737373]"
          />
        </div>

        {/* Search & Actions */}
        <div className="flex items-center gap-3">
          {/* Filters Button */}
          <FilterDropdown
            filterGroups={jobFilterGroups}
            onApplyFilters={handleApplyFilters}
            initialFilters={appliedFilters}
          />

          {/* Create Job Button */}
          <Button
            variant="default"
            size="default"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus className="w-4 h-4" />
            Create job
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <JobStatsGrid stats={stats} />

      {/* Jobs Table */}
      <DataTable<JobDetail>
        data={jobs}
        columns={columns}
        getRowId={(job) => job?.id}
        pagination={pagination}
        currentOffset={currentOffset}
        onPaginationChange={setCurrentOffset}
        isLoading={isLoading}
        loadingState={<DataTableSkeleton columns={7} rows={11} />}
        emptyState={
          <div className="text-center py-12">
            <p className="text-[#737373]">"No jobs found"</p>
          </div>
        }
        rowActions={renderRowActions}
      />

      {/* Create Job Modal */}
      {isCreateModalOpen && (
        <CreateJobModal
          open={isCreateModalOpen}
          onOpenChange={setIsCreateModalOpen}
          onSuccess={() => {
            fetchJobs();
          }}
          mappingValues={mappingValues}
        />
      )}

      {/* Edit Job Modal */}
      {isEditModalOpen && (
        <CreateJobModal
          open={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          onSuccess={() => {
            fetchJobs();
          }}
          mappingValues={mappingValues}
          isEditMode={true}
          jobDetail={{
            title: jobDetail?.title || "",
            industry: jobDetail?.industry || "",
            jobLevel: jobDetail?.jobLevel || "",
            jobType: jobDetail?.jobType || "",
            minExperience: jobDetail?.minExp || null,
            maxExperience: jobDetail?.maxExp || null,
            description: jobDetail?.description || "",
            noOfOpenings: jobDetail?.numOfOpenings || null,
            attachment: null,
            status: jobDetail?.status || "",
            skills: jobDetail?.requiredSkills || [],
          }}
          jobId={jobDetail?.id}
        />
      )}
    </div>
  );
}
