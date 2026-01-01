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

import { Job, JobFormData } from "../interfaces/job.interface";
import { CreateJobModal } from "./create-job-modal";
import { jobService } from "../services/job.service";
import { transformAPIResponseToJobs } from "../utils/job.utils";
import { stats, statusStyles } from "../constants/job.constants";

export default function JobList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [pagination, setPagination] = useState({
    total: 0,
    nextOffset: null as number | null,
    previousOffset: null as number | null,
    limit: 10,
  });
  const [currentOffset, setCurrentOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const PAGE_LIMIT = 10;

  const handleCreateJob = (data: JobFormData) => {
    const newJob: Job = {
      id: `new-${Date.now()}`,
      position: data.title || "New Position",
      status: data.status as "active" | "draft" | "closed",
      noOfOpening: parseInt(data.noOfOpenings) || 1,
      applicants: 0,
      interviews: 0,
      created: "Just now",
    };

    setJobs((prev) => [newJob, ...prev]);
    console.log("New job created:", data);
  };

  const handleDeleteJob = (id: string) => {
    setJobs((prev) => prev.filter((job) => job.id !== id));
  };

  // Define table columns
  const columns: Column<Job>[] = useMemo(
    () => [
      {
        id: "position",
        header: "Position",
        align: "left",
        accessor: (job) => job.position,
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
        accessor: (job) => job.noOfOpening,
      },
      {
        id: "applicants",
        header: "Applicants",
        align: "center",
        accessor: (job) => job.applicants,
      },
      {
        id: "interviews",
        header: "Interviews",
        align: "center",
        accessor: (job) => job.interviews,
      },
      {
        id: "created",
        header: "Created",
        align: "center",
        accessor: (job) => job.created,
      },
    ],
    []
  );

  // Row actions renderer
  const renderRowActions = (job: Job) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href={`/dashboard/jobs/${job.id}`}>
            <Eye className="h-4 text-[#737373]" />
            View details
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Pencil className="h-4 text-[#737373]" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onClick={() => handleDeleteJob(job.id)}
        >
          <Trash2 className="h-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true);
      setJobs([]);
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
        console.error("Error fetching jobs:", error);
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
    fetchJobs();
  }, [currentOffset]);

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
      <DataTable<Job>
        data={jobs}
        columns={columns}
        getRowId={(job) => job?.id}
        pagination={pagination}
        currentOffset={currentOffset}
        onPaginationChange={setCurrentOffset}
        isLoading={isLoading}
        emptyMessage="No jobs found"
        rowActions={renderRowActions}
      />

      {/* Create Job Modal */}
      <CreateJobModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSubmit={handleCreateJob}
      />
    </div>
  );
}
