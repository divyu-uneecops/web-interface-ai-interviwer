"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  ListFilter,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
      <div>
        {/* Pagination Controls - Top Right */}
        {pagination.total > 0 &&
          (() => {
            const startResult = currentOffset + 1;
            const endResult = Math.min(
              currentOffset + jobs.length,
              pagination.total
            );

            return (
              <div className="flex items-center justify-end">
                <div className="flex items-center gap-2 mr-2 mb-2">
                  <div className="text-sm text-[#737373] mr-2">
                    {startResult}-{endResult} of {pagination.total}
                  </div>
                  <button
                    onClick={() => {
                      if (
                        pagination.previousOffset !== null &&
                        pagination.previousOffset >= 0
                      ) {
                        setCurrentOffset(pagination.previousOffset);
                      }
                    }}
                    disabled={
                      pagination.previousOffset === null ||
                      pagination.previousOffset < 0 ||
                      isLoading
                    }
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="sr-only">Previous</span>
                  </button>

                  <button
                    onClick={() => {
                      if (pagination.nextOffset !== null) {
                        setCurrentOffset(pagination.nextOffset);
                      }
                    }}
                    disabled={pagination.nextOffset === null || isLoading}
                  >
                    <ChevronRight className="h-4 w-4" />
                    <span className="sr-only">Next</span>
                  </button>
                </div>
              </div>
            );
          })()}

        <div className="bg-white border border-[#e5e5e5] rounded-lg overflow-hidden px-4">
          <table className="w-full ">
            <thead>
              <tr className="border-b border-[#e5e5e5] h-10">
                <th className="text-left px-2 text-sm font-medium text-[#737373]">
                  Position
                </th>
                <th className="text-center px-2 text-sm font-medium text-[#737373] w-[125px]">
                  Status
                </th>
                <th className="text-center px-2 text-sm font-medium text-[#737373]">
                  No. of opening
                </th>
                <th className="text-center px-2 text-sm font-medium text-[#737373]">
                  Applicants
                </th>
                <th className="text-center px-2 text-sm font-medium text-[#737373]">
                  Interviews
                </th>
                <th className="text-center px-2 text-sm font-medium text-[#737373]">
                  Created
                </th>
                <th className="w-16"></th>
              </tr>
            </thead>
            <tbody>
              {jobs?.map((job) => (
                <tr
                  key={job.id}
                  className="border-b border-[#e5e5e5] last:border-b-0 hover:bg-[#fafafa] h-[66px]"
                >
                  <td className="px-2 text-sm font-normal text-[#0a0a0a]">
                    {job.position}
                  </td>
                  <td className="px-2 text-center">
                    <div className="flex justify-center">
                      <Badge
                        variant="outline"
                        className={`capitalize font-normal text-xs tracking-[0.3px] rounded-full px-2 py-0 h-6 ${
                          statusStyles[job.status]
                        }`}
                      >
                        {job.status === "active"
                          ? "Active"
                          : job.status === "closed"
                          ? "Closed"
                          : "Draft"}
                      </Badge>
                    </div>
                  </td>
                  <td className="px-2 text-sm text-[#0a0a0a] text-center">
                    {job.noOfOpening}
                  </td>
                  <td className="px-2 text-sm text-[#0a0a0a] text-center">
                    {job.applicants}
                  </td>
                  <td className="px-2 text-sm text-[#0a0a0a] text-center">
                    {job.interviews}
                  </td>
                  <td className="px-2 text-sm text-[#0a0a0a] text-center">
                    {job.created}
                  </td>
                  <td className="px-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 p-0"
                        >
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {jobs?.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <p className="text-[#737373]">No jobs found</p>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <p className="text-[#737373]">Loading...</p>
          </div>
        )}
      </div>

      {/* Create Job Modal */}
      <CreateJobModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSubmit={handleCreateJob}
      />
    </div>
  );
}
