"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  ListFilter,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DataTable, Column } from "@/components/shared/components/data-table";
import { JobStatsGrid } from "@/components/dashboard/job/components/job-stats-card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { JobDetail, JobFormData } from "../interfaces/job.interface";
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

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [jobDetail, setJobDetail] = useState<JobFormData | null>(null);

  const { mappingValues } = useAppSelector((state) => state.jobs);

  useEffect(() => {
    fetchJobs();
  }, [currentOffset]);

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
      const params = {
        limit: PAGE_LIMIT,
        offset: currentOffset,
      };
      const response = await jobService.getJobOpenings(params, {
        filters: {
          $and: [],
        },
        appId: "69521cd1c9ba83a076aac3ae",
      });
      const result = transformAPIResponseToJobs(response.data, response.page);
      setJobs(result.jobs);
      setPagination(result.pagination);
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
                statusStyles[job?.status]
              }`}
            >
              {job?.status === "active"
                ? "Active"
                : job?.status === "closed"
                ? "Closed"
                : "Draft"}
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
          <Link href={`/dashboard/jobs/${job?.id}`}>
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
          onClick={() => handleDeleteJob(job?.jobId)}
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
    const JobFormData: JobFormData = {
      title: job.title,
      industry: job.industry,
      jobLevel: job.jobLevel,
      jobType: job.jobType,
      minExperience: job.minExp,
      maxExperience: job.maxExp,
      description: job.description,
      noOfOpenings: job.numOfOpenings,
      attachment: null,
      status: job.status,
      skills: job.requiredSkills,
    };
    setJobDetail(JobFormData);
    setIsEditModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="relative w-[245px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-[10.667px] w-[10.667px] text-[#737373]" />
          <Input
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e?.target?.value)}
            className="pl-8 border-0 border-b border-[#e5e5e5] rounded-none focus-visible:ring-0 focus-visible:border-[#02563d] shadow-none"
          />
        </div>

        {/* Search & Actions */}
        <div className="flex items-center gap-3">
          {/* Search Input */}

          {/* Filters Button */}
          <Button variant="secondary" size="default">
            <ListFilter className="w-4 h-4" />
            Filters
          </Button>

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
      <CreateJobModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSuccess={() => {
          fetchJobs();
        }}
        mappingValues={mappingValues}
      />

      {/* Edit Job Modal */}
      <CreateJobModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        onSuccess={() => {
          fetchJobs();
        }}
        mappingValues={mappingValues}
        isEditMode={true}
        jobDetail={jobDetail}
      />
    </div>
  );
}
