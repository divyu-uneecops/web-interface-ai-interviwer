"use client";

import { useState } from "react";
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
import {
  JobStatsGrid,
  type JobStat,
} from "@/components/dashboard/job-stats-card";
import {
  CreateJobModal,
  type JobFormData,
} from "@/components/dashboard/job/components/create-job-modal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Job {
  id: string;
  position: string;
  status: "active" | "draft" | "closed";
  noOfOpening: number;
  applicants: number;
  interviews: number;
  created: string;
}

const stats: JobStat[] = [
  { label: "Total Applicants", value: 143, icon: "applicants" },
  { label: "Completed", value: 90, icon: "completed" },
  { label: "Total Hired", value: 7, icon: "hired" },
  { label: "Avg Score", value: 82.2, icon: "score" },
];

const sampleJobs: Job[] = [
  {
    id: "1",
    position: "Senior software engineer",
    status: "active",
    noOfOpening: 3,
    applicants: 10,
    interviews: 5,
    created: "2d ago",
  },
  {
    id: "2",
    position: "Senior software engineer",
    status: "active",
    noOfOpening: 3,
    applicants: 10,
    interviews: 5,
    created: "2d ago",
  },
  {
    id: "3",
    position: "Senior software engineer",
    status: "draft",
    noOfOpening: 3,
    applicants: 10,
    interviews: 5,
    created: "2d ago",
  },
  {
    id: "4",
    position: "Senior software engineer",
    status: "closed",
    noOfOpening: 3,
    applicants: 10,
    interviews: 5,
    created: "2d ago",
  },
  {
    id: "5",
    position: "Senior product manager",
    status: "active",
    noOfOpening: 3,
    applicants: 10,
    interviews: 5,
    created: "2d ago",
  },
];

const statusStyles = {
  active: "bg-[#def2eb] text-[#0e4230] border-transparent",
  draft: "bg-[#e5e5e5] text-[#000000] border-transparent",
  closed: "bg-[#fcefec] text-[#d92d20] border-transparent",
};

export default function JobsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [jobs, setJobs] = useState<Job[]>(sampleJobs);

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

  const filteredJobs = jobs.filter((job) =>
    job.position.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-black">Job Openings</h2>

        {/* Search & Actions */}
        <div className="flex items-center gap-3">
          {/* Search Input */}
          <div className="relative w-[245px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-[10.667px] w-[10.667px] text-[#737373]" />
            <Input
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e?.target?.value)}
              className="pl-8 border-0 border-b border-[#e5e5e5] rounded-none focus-visible:ring-0 focus-visible:border-[#02563d] shadow-none"
            />
          </div>

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
      <div className="bg-white border border-[#e5e5e5] rounded-lg overflow-hidden px-4">
        <table className="w-full">
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
            {filteredJobs?.map((job) => (
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

        {/* Empty State */}
        {filteredJobs?.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[#737373]">No jobs found</p>
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
