"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  Building2,
  Clock,
  Plus,
  CheckCircle2,
  Search,
  Filter,
  Download,
  Pencil,
  Trash2,
  X,
  Eye,
  MoreVertical,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { JobStatsGrid } from "@/components/dashboard/job/components/job-stats-card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { StatusTag } from "@/components/ui/status-tag";
import { CreateRoundModal } from "@/components/dashboard/create-round-modal";
import {
  Applicant,
  JobDetail,
  JobStat,
  Round,
} from "@/components/dashboard/job/interfaces/job.interface";
import {
  mockApplicants,
  mockRounds,
} from "@/components/dashboard/job/constants/job.constants";
import { ApplicantStatus } from "@/components/dashboard/job/types/job.types";
import { jobService } from "@/components/dashboard/job/services/job.service";
import { transformAPIResponseToJobDetail } from "@/components/dashboard/job/utils/job.utils";
import { Skeleton } from "@/components/ui/skeleton";

import { CreateJobModal } from "./create-job-modal";
import { useAppSelector } from "@/store/hooks";

export const stats: JobStat[] = [
  { label: "Total Applicants", value: 143, icon: "applicants" },
  { label: "Completed", value: 90, icon: "completed" },
  { label: "Total Hired", value: 7, icon: "hired" },
  { label: "Avg Score", value: 82.2, icon: "score" },
];

export default function JobDetails() {
  const params = useParams();
  const [whatsappReminder, setWhatsappReminder] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddApplicantModalOpen, setIsAddApplicantModalOpen] = useState(false);
  const [isCreateRoundModalOpen, setIsCreateRoundModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("details");
  const [applicants, setApplicants] = useState<Applicant[]>(mockApplicants);
  const [rounds, setRounds] = useState<Round[]>(mockRounds);
  const [activeFilters, setActiveFilters] = useState<{
    status: string[];
    rounds: string[];
    applied: string[];
  }>({
    status: [],
    rounds: [],
    applied: [],
  });
  const [applicantTab, setApplicantTab] = useState<"single" | "bulk">("single");
  const [applicantForm, setApplicantForm] = useState({
    name: "",
    email: "",
    contact: "",
    attachment: null as File | null,
    jobTitle: "",
  });
  const [job, setJob] = useState<JobDetail | null>(null);
  const [isLoadingJob, setIsLoadingJob] = useState(true);

  const { mappingValues } = useAppSelector((state) => state.jobs);

  // Fetch job detail
  useEffect(() => {
    fetchJobDetail();
  }, [params.id]);

  const fetchJobDetail = async () => {
    if (!params.id || typeof params.id !== "string") {
      setIsLoadingJob(false);
      return;
    }

    setIsLoadingJob(true);
    try {
      const response = await jobService.getJobDetail(params.id, {
        appId: "69521cd1c9ba83a076aac3ae",
      });
      const transformedJob = transformAPIResponseToJobDetail(
        response,
        params.id
      );
      setJob(transformedJob);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to fetch job details",
        {
          duration: 8000,
        }
      );
    } finally {
      setIsLoadingJob(false);
    }
  };

  const handleRemoveFilter = (
    type: "status" | "rounds" | "applied",
    value: string
  ) => {
    setActiveFilters((prev) => ({
      ...prev,
      [type]: prev[type].filter((v) => v !== value),
    }));
  };

  const handleFilterChange = (
    type: "status" | "rounds" | "applied",
    value: string
  ) => {
    setActiveFilters((prev) => {
      const current = prev[type];
      if (current.includes(value)) {
        return {
          ...prev,
          [type]: current.filter((v) => v !== value),
        };
      } else {
        return {
          ...prev,
          [type]: [...current, value],
        };
      }
    });
  };

  const getStatusTag = (status: ApplicantStatus) => {
    switch (status) {
      case "Interviewed":
        return (
          <StatusTag variant="success" className="bg-[#def2eb] text-[#0e4230]">
            Interviewed
          </StatusTag>
        );
      case "Applied":
        return (
          <Badge className="bg-[#f5e1ff] text-[#5a3c66] border-0 rounded-full px-2 h-6 text-xs font-normal hover:bg-[#f5e1ff]">
            Applied
          </Badge>
        );
      case "Rejected":
        return (
          <Badge className="bg-[#fcefec] text-[#d92d20] border-0 rounded-full px-2 h-6 text-xs font-normal hover:bg-[#fcefec]">
            Rejected
          </Badge>
        );
    }
  };

  if (isLoadingJob) {
    return (
      <div className="space-y-8">
        {/* Job Header Skeleton */}
        <div className="flex items-start justify-between">
          <div className="space-y-2.5 flex-1">
            {/* Title + Badge */}
            <div className="flex items-center gap-2.5">
              <Skeleton className="h-7 w-64 bg-[#e5e5e5]" />
              <Skeleton className="h-6 w-16 rounded-full bg-[#e5e5e5]" />
            </div>
            {/* Meta Info */}
            <div className="flex items-center gap-4 h-5">
              <Skeleton className="h-5 w-24 bg-[#e5e5e5]" />
              <Skeleton className="h-5 w-20 bg-[#e5e5e5]" />
              <Skeleton className="h-5 w-28 bg-[#e5e5e5]" />
            </div>
          </div>
          {/* Actions */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3">
              <Skeleton className="h-5 w-10 bg-[#e5e5e5] rounded-full" />
              <Skeleton className="h-5 w-32 bg-[#e5e5e5]" />
            </div>
            <Skeleton className="h-9 w-20 bg-[#e5e5e5] rounded-md" />
          </div>
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-4 gap-4 h-[90px]">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="flex items-center gap-3 bg-white border border-[rgba(0,0,0,0.1)] rounded h-[90px] pl-[25px] pr-px"
            >
              <Skeleton className="w-10 h-10 rounded-[10px] bg-[#e5e5e5] shrink-0" />
              <div className="flex flex-col h-12 gap-2">
                <Skeleton className="h-8 w-16 bg-[#e5e5e5]" />
                <Skeleton className="h-4 w-24 bg-[#e5e5e5]" />
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Card Skeleton */}
        <div className="bg-white border border-[#e5e5e5] p-4 space-y-4">
          {/* Tabs Header Skeleton */}
          <div className="flex items-center justify-between">
            <Skeleton className="h-9 w-[551px] bg-[#f5f5f5] rounded-[10px]" />
            <Skeleton className="h-9 w-32 bg-[#e5e5e5] rounded-md" />
          </div>

          {/* Tab Content Skeleton */}
          <div className="mt-4 space-y-8">
            <div className="flex gap-8">
              {/* Left Column */}
              <div className="flex-1 space-y-8">
                <div className="bg-white rounded-lg shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] py-6 pl-6 pr-0">
                  <Skeleton className="h-4 w-32 mb-3 bg-[#e5e5e5]" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full bg-[#e5e5e5]" />
                    <Skeleton className="h-4 w-full bg-[#e5e5e5]" />
                    <Skeleton className="h-4 w-3/4 bg-[#e5e5e5]" />
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] py-6 pl-6 pr-0">
                  <Skeleton className="h-4 w-32 mb-3 bg-[#e5e5e5]" />
                  <div className="space-y-2">
                    {Array.from({ length: 4 }).map((_, index) => (
                      <div key={index} className="flex items-center gap-2 h-6">
                        <Skeleton className="w-4 h-4 bg-[#e5e5e5] rounded-full" />
                        <Skeleton className="h-4 w-32 bg-[#e5e5e5]" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {/* Right Column */}
              <div className="w-[372px] shrink-0">
                <div className="bg-white rounded-lg shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] h-[329px]">
                  <div className="px-6 pt-6 pb-0">
                    <Skeleton className="h-4 w-32 bg-[#e5e5e5]" />
                  </div>
                  <div className="px-6 pt-[30px] space-y-3">
                    {Array.from({ length: 3 }).map((_, index) => (
                      <div key={index}>
                        <Skeleton className="h-4 w-20 mb-1 bg-[#e5e5e5]" />
                        <Skeleton className="h-5 w-24 bg-[#e5e5e5]" />
                        {index < 2 && (
                          <div className="h-px bg-slate-200 mt-3" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-sm text-[#737373]">Job not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Job Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-2.5">
          {/* Title + Badge */}
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold text-black leading-7">
              {job?.title}
            </h1>
            <Badge
              className={`border-0 rounded-full px-2 h-6 text-xs font-normal ${
                job?.status === "active"
                  ? "bg-[#def2eb] text-[#0e4230] hover:bg-[#def2eb]"
                  : job?.status === "closed"
                  ? "bg-[#fcefec] text-[#d92d20] hover:bg-[#fcefec]"
                  : "bg-[#e5e5e5] text-[#000000] hover:bg-[#e5e5e5]"
              }`}
            >
              {job?.status === "active"
                ? "Active"
                : job?.status === "closed"
                ? "Closed"
                : "Draft"}
            </Badge>
          </div>

          {/* Meta Info */}
          <div className="flex items-center gap-4 h-5">
            <div className="flex items-center gap-1">
              <Building2 className="w-4 h-4 text-[#45556c]" />
              <span className="text-sm text-[#45556c] leading-5">
                {job?.industry}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-[#45556c]" />
              <span className="text-sm text-[#45556c] leading-5">
                {job?.jobType}
              </span>
            </div>
            {job?.createdOn && (
              <span className="text-sm text-[#45556c] leading-5">
                Posted {job?.createdOn}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3">
            <Switch
              checked={whatsappReminder}
              onCheckedChange={setWhatsappReminder}
            />
            <span className="text-sm font-medium text-[#0a0a0a]">
              Whatsapp reminder
            </span>
          </div>
          <Button
            variant="secondary"
            className="h-9 px-4 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]"
          >
            Share
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <JobStatsGrid stats={stats} />

      {/* Main Content Card */}
      <div className="bg-white border border-[#e5e5e5] p-4 space-y-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Tabs Header Row */}
          <div className="flex items-center justify-between">
            <TabsList className="bg-[#f5f5f5] h-9 p-[3px] rounded-[10px] w-[551px]">
              <TabsTrigger
                value="details"
                className="flex-1 h-[30px] rounded-lg text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                Job details
              </TabsTrigger>
              <TabsTrigger
                value="rounds"
                className="flex-1 h-[30px] rounded-lg text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                Rounds
              </TabsTrigger>
              <TabsTrigger
                value="applicants"
                className="flex-1 h-[30px] rounded-lg text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                Applicants
              </TabsTrigger>
            </TabsList>

            {activeTab === "details" && (
              <Button
                variant="default"
                size="default"
                onClick={() => setIsEditModalOpen(true)}
              >
                <Pencil className="w-4 h-4" />
                Edit Job details
              </Button>
            )}

            {activeTab === "rounds" && (
              <Button
                variant="default"
                size="default"
                onClick={() => setIsCreateRoundModalOpen(true)}
              >
                <Plus className="w-4 h-4" />
                Add round
              </Button>
            )}

            {activeTab === "applicants" && (
              <Button
                variant="default"
                size="default"
                onClick={() => setIsAddApplicantModalOpen(true)}
              >
                <Plus className="w-4 h-4" />
                Add Applicant
              </Button>
            )}
          </div>

          {/* Job Details Tab Content */}
          <TabsContent value="details" className="mt-4">
            <div className="flex gap-8">
              {/* Left Column - Job Description & Skills */}
              <div className="flex-1 space-y-8">
                {/* Job Description Card */}
                <div className="bg-white rounded-lg shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] py-6 pl-6 pr-0">
                  <h3 className="text-base font-medium text-neutral-950 mb-3 leading-4 tracking-[-0.3px]">
                    Job Description
                  </h3>
                  <p className="text-base text-[#314158] leading-[26px] tracking-[-0.3px] max-w-[652px]">
                    {job?.description}
                  </p>
                </div>

                {/* Skills Required Card */}
                <div className="bg-white rounded-lg shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] py-6 pl-6 pr-0">
                  <h3 className="text-base font-normal text-neutral-950 mb-3 leading-4 tracking-[-0.3px]">
                    Skills required
                  </h3>
                  <div className="space-y-2">
                    {job?.requiredSkills?.map((skill) => (
                      <div key={skill} className="flex items-center gap-2 h-6">
                        <CheckCircle2 className="w-4 h-4 text-[#059669]" />
                        <span className="text-base text-[#314158] leading-6 tracking-[-0.3px]">
                          {skill}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column - Job Information */}
              <div className="w-[372px] shrink-0">
                <div className="bg-white rounded-lg shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] h-[329px]">
                  {/* Card Title */}
                  <div className="px-6 pt-6 pb-0">
                    <h3 className="text-base font-normal text-neutral-950 leading-4 tracking-[-0.3px]">
                      Job Information
                    </h3>
                  </div>

                  {/* Card Content */}
                  <div className="px-6 pt-[30px] space-y-3">
                    {/* Job Level */}
                    <div className="space-y-1 h-10">
                      <p className="text-xs text-[#62748e] leading-4">
                        Job Level
                      </p>
                      <p className="text-sm text-neutral-950 leading-5 tracking-[-0.15px]">
                        {job?.jobLevel}
                      </p>
                    </div>

                    <div className="h-px bg-slate-200" />

                    {/* User Type */}
                    <div className="space-y-1 h-10">
                      <p className="text-xs text-[#62748e] leading-4">
                        Job Type
                      </p>
                      <p className="text-sm text-neutral-950 leading-5 tracking-[-0.15px]">
                        {job?.jobType}
                      </p>
                    </div>

                    <div className="h-px bg-slate-200" />

                    {/* Experience */}
                    <div className="space-y-1 h-10">
                      <p className="text-xs text-[#62748e] leading-4">
                        Experience
                      </p>
                      <p className="text-sm text-neutral-950 leading-5 tracking-[-0.15px]">
                        {`${job?.minExp || 0}-${job?.maxExp || 0} years`}
                      </p>
                    </div>

                    <div className="h-px bg-slate-200" />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Rounds Tab Content */}
          <TabsContent value="rounds" className="mt-4">
            <div className="bg-white border border-[#e5e5e5] rounded-md overflow-hidden">
              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#e5e5e5] h-10">
                      <th className="text-left py-0 px-2 h-10 text-sm font-medium text-[#737373]">
                        Round name
                      </th>
                      <th className="text-center py-0 px-2 h-10 text-sm font-medium text-[#737373]">
                        Duration
                      </th>
                      <th className="text-center py-0 px-2 h-10 text-sm font-medium text-[#737373]">
                        Questions
                      </th>
                      <th className="text-center py-0 px-2 h-10 text-sm font-medium text-[#737373]">
                        Applicants
                      </th>
                      <th className="text-center py-0 px-2 h-10 text-sm font-medium text-[#737373]">
                        Created
                      </th>
                      <th className="text-center py-0 px-2 h-10 text-sm font-medium text-[#737373]">
                        Quick action
                      </th>
                      <th className="text-center py-0 px-2 h-10 text-sm font-medium text-[#737373]">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-[#e5e5e5]">
                    {rounds.map((round, index) => (
                      <tr
                        key={round.id}
                        className="hover:bg-[#fafafa] transition-colors"
                        style={{
                          height:
                            index === 0
                              ? "78px"
                              : index === 1
                              ? "77px"
                              : "78px",
                        }}
                      >
                        <td className="p-2 whitespace-nowrap">
                          <span className="text-sm font-medium text-[#0a0a0a] leading-5">
                            {round.name}
                          </span>
                        </td>
                        <td className="p-2 whitespace-nowrap text-center">
                          <span className="text-sm text-[#0a0a0a] leading-5">
                            {round.duration}
                          </span>
                        </td>
                        <td className="p-2 whitespace-nowrap text-center">
                          <span className="text-sm text-[#0a0a0a] leading-5">
                            {round.questions}
                          </span>
                        </td>
                        <td className="p-2 whitespace-nowrap text-center">
                          <span className="text-sm text-[#0a0a0a] leading-5">
                            {round.applicants}
                          </span>
                        </td>
                        <td className="p-2 whitespace-nowrap text-center">
                          <span className="text-sm text-[#0a0a0a] leading-5">
                            {round.created}
                          </span>
                        </td>
                        <td className="p-2 whitespace-nowrap text-center">
                          <Button
                            variant="outline"
                            className="h-9 px-4 py-2 text-sm font-medium bg-[#f5f5f5] border-0 text-[#171717] hover:bg-[#f5f5f5] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] rounded-md"
                          >
                            Schedule interview
                          </Button>
                        </td>
                        <td className="p-2 whitespace-nowrap text-center">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button
                                className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-[#f5f5f5] transition-colors text-[#0a0a0a] p-[10px]"
                                title="Actions"
                              >
                                <MoreVertical className="w-4 h-4" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="w-[171px] p-1 border border-[#e5e5e5] rounded-md shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)]"
                            >
                              <DropdownMenuItem className="gap-2 pl-2 pr-2 py-1.5 cursor-pointer rounded-sm hover:bg-[#f5f5f5]">
                                <Eye className="w-4 h-4 text-[#737373]" />
                                <span className="text-sm text-[#0a0a0a] leading-5">
                                  View details
                                </span>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="gap-2 pl-8 pr-2 py-1.5 cursor-pointer rounded-sm hover:bg-[#f5f5f5] relative"
                                inset
                              >
                                <Pencil className="w-4 h-4 text-[#737373] absolute left-2" />
                                <span className="text-sm text-[#0a0a0a] leading-5">
                                  Edit
                                </span>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator className="h-px bg-[#e5e5e5] my-1" />
                              <DropdownMenuItem
                                variant="destructive"
                                className="gap-2 pl-8 pr-2 py-1.5 cursor-pointer rounded-sm hover:bg-[#f5f5f5] relative"
                                inset
                              >
                                <Trash2 className="w-4 h-4 text-[#b91c1c] absolute left-2" />
                                <span className="text-sm text-[#b91c1c] leading-5">
                                  Delete
                                </span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {rounds.length === 0 && (
                <div className="p-12 text-center">
                  <p className="text-sm text-[#737373]">
                    No rounds created yet. Click "Add round" to create your
                    first round.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Applicants Tab Content */}
          <TabsContent value="applicants" className="mt-4 space-y-4">
            {/* Search and Filters */}
            <div className="flex gap-3 items-center">
              <div className="flex-1 flex items-center gap-2 px-3 py-2.5 border-b border-[#e5e5e5]">
                <Search className="w-[10.667px] h-[10.667px] text-[#737373]" />
                <input
                  type="text"
                  placeholder="Search Applicant"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 text-sm text-[#737373] bg-transparent border-0 outline-none placeholder:text-[#737373]"
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="secondary"
                    className="h-9 px-4 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]"
                  >
                    <Filter className="w-4 h-4" />
                    Filters
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-[207px] p-1 shadow-md"
                >
                  <div className="space-y-0">
                    <DropdownMenuLabel className="px-2 py-1.5 text-sm font-semibold">
                      Status
                    </DropdownMenuLabel>
                    <DropdownMenuCheckboxItem
                      checked={activeFilters.status.includes("Interviewed")}
                      onCheckedChange={() =>
                        handleFilterChange("status", "Interviewed")
                      }
                      className="pl-8"
                    >
                      Interviewed
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={activeFilters.status.includes("Applied")}
                      onCheckedChange={() =>
                        handleFilterChange("status", "Applied")
                      }
                      className="pl-8"
                    >
                      Applied
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={activeFilters.status.includes("Rejected")}
                      onCheckedChange={() =>
                        handleFilterChange("status", "Rejected")
                      }
                      className="pl-8"
                    >
                      Rejected
                    </DropdownMenuCheckboxItem>
                  </div>
                  <DropdownMenuSeparator />
                  <div className="space-y-0">
                    <DropdownMenuLabel className="px-2 py-1.5 text-sm font-semibold">
                      Rounds
                    </DropdownMenuLabel>
                    <DropdownMenuCheckboxItem
                      checked={activeFilters.rounds.includes("Round 1")}
                      onCheckedChange={() =>
                        handleFilterChange("rounds", "Round 1")
                      }
                      className="pl-8"
                    >
                      Round 1
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={activeFilters.rounds.includes("Round 2")}
                      onCheckedChange={() =>
                        handleFilterChange("rounds", "Round 2")
                      }
                      className="pl-8"
                    >
                      Round 2
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={activeFilters.rounds.includes("Round 3")}
                      onCheckedChange={() =>
                        handleFilterChange("rounds", "Round 3")
                      }
                      className="pl-8"
                    >
                      Round 3
                    </DropdownMenuCheckboxItem>
                  </div>
                  <DropdownMenuSeparator />
                  <div className="space-y-0">
                    <DropdownMenuLabel className="px-2 py-1.5 text-sm font-semibold">
                      Applied
                    </DropdownMenuLabel>
                    <DropdownMenuCheckboxItem
                      checked={activeFilters.applied.includes("Yesterday")}
                      onCheckedChange={() =>
                        handleFilterChange("applied", "Yesterday")
                      }
                      className="pl-8"
                    >
                      Yesterday
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={activeFilters.applied.includes("This week")}
                      onCheckedChange={() =>
                        handleFilterChange("applied", "This week")
                      }
                      className="pl-8"
                    >
                      This week
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={activeFilters.applied.includes("This month")}
                      onCheckedChange={() =>
                        handleFilterChange("applied", "This month")
                      }
                      className="pl-8"
                    >
                      This month
                    </DropdownMenuCheckboxItem>
                  </div>
                  <div className="p-1">
                    <Button
                      variant="ghost"
                      className="w-full h-9 justify-start text-[#02563d] hover:text-[#02563d] hover:bg-transparent font-medium"
                      onClick={() => {
                        // Apply filters logic here
                        console.log("Filters applied:", activeFilters);
                      }}
                    >
                      Apply filters
                    </Button>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Active Filter Tags */}
            {(activeFilters.status.length > 0 ||
              activeFilters.rounds.length > 0 ||
              activeFilters.applied.length > 0) && (
              <div className="flex gap-2.5 items-start flex-wrap">
                {activeFilters.status.map((filter) => (
                  <Badge
                    key={`status-${filter}`}
                    className="bg-[#e5e5e5] text-[#000000] border-0 rounded-full px-2 h-6 text-xs font-normal hover:bg-[#e5e5e5] flex items-center gap-0.5"
                  >
                    {filter}
                    <button
                      onClick={() => handleRemoveFilter("status", filter)}
                      className="ml-0.5 hover:bg-[rgba(0,0,0,0.1)] rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
                {activeFilters.rounds.map((filter) => (
                  <Badge
                    key={`rounds-${filter}`}
                    className="bg-[#e5e5e5] text-[#000000] border-0 rounded-full px-2 h-6 text-xs font-normal hover:bg-[#e5e5e5] flex items-center gap-0.5"
                  >
                    {filter}
                    <button
                      onClick={() => handleRemoveFilter("rounds", filter)}
                      className="ml-0.5 hover:bg-[rgba(0,0,0,0.1)] rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
                {activeFilters.applied.map((filter) => (
                  <Badge
                    key={`applied-${filter}`}
                    className="bg-[#e5e5e5] text-[#000000] border-0 rounded-full px-2 h-6 text-xs font-normal hover:bg-[#e5e5e5] flex items-center gap-0.5"
                  >
                    {filter}
                    <button
                      onClick={() => handleRemoveFilter("applied", filter)}
                      className="ml-0.5 hover:bg-[rgba(0,0,0,0.1)] rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}

            {/* Applicants Table */}
            <div className="bg-white border border-[#e5e5e5] rounded-md overflow-hidden px-4">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#e5e5e5] h-10">
                    <th className="text-left px-2 py-0 text-sm font-medium text-[#737373]">
                      Applicant name
                    </th>
                    <th className="text-center px-2 py-0 text-sm font-medium text-[#737373] w-[220px]">
                      Email
                    </th>
                    <th className="text-center px-2 py-0 text-sm font-medium text-[#737373]">
                      Contact number
                    </th>
                    <th className="text-center px-2 py-0 text-sm font-medium text-[#737373] w-[166px]">
                      Status
                    </th>
                    <th className="text-center px-2 py-0 text-sm font-medium text-[#737373] w-[144px]">
                      Applied
                    </th>
                    <th className="text-center px-2 py-0 text-sm font-medium text-[#737373]">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {applicants.map((applicant, index) => (
                    <tr
                      key={applicant.id}
                      className={`border-b border-[#e5e5e5] last:border-b-0 ${
                        index === 0
                          ? "h-[78px]"
                          : index === 1
                          ? "h-[77px]"
                          : "h-[78px]"
                      }`}
                    >
                      <td className="px-2 py-2 text-sm text-[#0a0a0a] text-left">
                        {applicant.name}
                      </td>
                      <td className="px-2 py-2 text-sm text-[#0a0a0a] text-center">
                        {applicant.email}
                      </td>
                      <td className="px-2 py-2 text-sm text-[#0a0a0a] text-center">
                        {applicant.contact}
                      </td>
                      <td className="px-2 py-2 text-center">
                        {getStatusTag(applicant.status)}
                      </td>
                      <td className="px-2 py-2 text-sm text-[#0a0a0a] text-center">
                        {applicant.appliedDate}
                      </td>
                      <td className="px-2 py-2 text-center">
                        <div className="flex items-center justify-center gap-4">
                          <button
                            className="text-[#737373] hover:text-[#0a0a0a] transition-colors"
                            title="Download"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button
                            className="text-[#3b82f6] hover:text-[#2563eb] transition-colors"
                            title="Edit"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            className="text-[#b91c1c] hover:text-[#991b1b] transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Job Modal */}
      <CreateJobModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        onSuccess={() => {
          fetchJobDetail();
        }}
        mappingValues={mappingValues}
        isEditMode={true}
        jobDetail={{
          title: job?.title || "",
          industry: job?.industry || "",
          jobLevel: job?.jobLevel || "",
          jobType: job?.jobType || "",
          minExperience: job?.minExp || null,
          maxExperience: job?.maxExp || null,
          description: job?.description || "",
          noOfOpenings: job?.numOfOpenings || null,
          attachment: null,
          status: job?.status || "",
          skills: job?.requiredSkills || [],
        }}
      />

      {/* Create Round Modal */}
      <CreateRoundModal
        open={isCreateRoundModalOpen}
        onOpenChange={setIsCreateRoundModalOpen}
        onSubmit={(data) => {
          // Handle round creation
          const newRound: Round = {
            id: Date.now().toString(),
            name: data.roundName,
            duration: `${data.duration} min`,
            questions:
              data.questionType === "ai"
                ? data.aiGeneratedQuestions
                : data.questionType === "hybrid"
                ? data.aiGeneratedQuestions + data.customQuestions
                : data.customQuestions,
            applicants: 0,
            created: "Just now",
          };
          setRounds((prev) => [...prev, newRound]);
          setIsCreateRoundModalOpen(false);
        }}
      />

      {/* Add Applicant Modal */}
      <Dialog
        open={isAddApplicantModalOpen}
        onOpenChange={setIsAddApplicantModalOpen}
      >
        <DialogContent className="sm:max-w-[779px] max-h-[90vh] overflow-y-auto p-6 gap-4 shadow-lg">
          <DialogHeader className="gap-1.5 items-start">
            <DialogTitle className="text-lg font-semibold text-[#0a0a0a] leading-none">
              Create Applicant
            </DialogTitle>
            <p className="text-sm text-[#737373] leading-5">
              Add Applicant details
            </p>
          </DialogHeader>

          <div className="space-y-4">
            {/* Tabs */}
            <div className="bg-[#f5f5f5] h-9 p-[3px] rounded-[10px] flex">
              <button
                type="button"
                onClick={() => setApplicantTab("single")}
                className={`flex-1 h-full rounded-md text-sm font-medium transition-all flex items-center justify-center ${
                  applicantTab === "single"
                    ? "bg-white shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] border border-transparent"
                    : "text-[#0a0a0a]"
                }`}
              >
                Single Applicant
              </button>
              <button
                type="button"
                onClick={() => setApplicantTab("bulk")}
                className={`flex-1 h-full rounded-md text-sm font-medium transition-all flex items-center justify-center ${
                  applicantTab === "bulk"
                    ? "bg-white shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] border border-transparent"
                    : "text-[#0a0a0a]"
                }`}
              >
                Bulk Applicants
              </button>
            </div>

            {applicantTab === "single" ? (
              <div className="space-y-5">
                {/* Parse resume */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-[#000000]">
                    Parse resume
                  </Label>
                  <div className="border border-dashed border-[#d1d1d1] rounded bg-transparent h-[114px] flex items-center justify-center">
                    <div className="flex flex-col items-center gap-2 px-4 py-8 text-center">
                      <p className="text-sm text-[#02563d] leading-5">
                        Drag and drop files here or click to upload
                      </p>
                      <p className="text-xs text-[#747474] leading-none">
                        Max file size is 500kb. Supported file types are .jpg
                        and .png.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Or divider */}
                <div className="flex items-center gap-2.5">
                  <div className="flex-1 h-px bg-[#e5e5e5]" />
                  <span className="text-sm text-[#737373] leading-none">
                    or
                  </span>
                  <div className="flex-1 h-px bg-[#e5e5e5]" />
                </div>

                {/* Applicant name */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-[#0a0a0a]">
                    Applicant name <span className="text-red-700">*</span>
                  </Label>
                  <Input
                    value={applicantForm.name}
                    onChange={(e) =>
                      setApplicantForm((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    placeholder="Mohan kuman"
                    className="h-9 shadow-[0px_1px_2px_0px_rgba(2,86,61,0.12)]"
                  />
                </div>

                {/* Email and Contact */}
                <div className="flex gap-2.5">
                  <div className="flex-1 space-y-2">
                    <Label className="text-sm font-medium text-[#0a0a0a]">
                      Applicant email <span className="text-red-700">*</span>
                    </Label>
                    <Input
                      value={applicantForm.email}
                      onChange={(e) =>
                        setApplicantForm((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      placeholder="mohankumar@gmail.com"
                      className="h-9 shadow-[0px_1px_2px_0px_rgba(2,86,61,0.12)]"
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label className="text-sm font-medium text-[#0a0a0a]">
                      Contact number <span className="text-neutral-950">*</span>
                    </Label>
                    <Input
                      value={applicantForm.contact}
                      onChange={(e) =>
                        setApplicantForm((prev) => ({
                          ...prev,
                          contact: e.target.value,
                        }))
                      }
                      placeholder="+91 9876543210"
                      className="h-9 shadow-[0px_1px_2px_0px_rgba(2,86,61,0.12)]"
                    />
                  </div>
                </div>

                {/* Attachment and Job title */}
                <div className="flex gap-2.5">
                  <div className="flex-1 space-y-2">
                    <Label className="text-sm font-medium text-[#0a0a0a]">
                      Attachment
                    </Label>
                    <div className="h-9 border border-[#e5e5e5] rounded-md shadow-[0px_1px_2px_0px_rgba(2,86,61,0.12)] bg-white px-3 flex items-center">
                      <button
                        type="button"
                        className="text-sm font-medium text-[#0a0a0a] px-1.5 py-px"
                      >
                        Choose file
                      </button>
                    </div>
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label className="text-sm font-medium text-[#0a0a0a]">
                      Job title
                    </Label>
                    <Select
                      value={applicantForm.jobTitle}
                      onValueChange={(value) =>
                        setApplicantForm((prev) => ({
                          ...prev,
                          jobTitle: value,
                        }))
                      }
                    >
                      <SelectTrigger className="w-full h-9 shadow-[0px_1px_2px_0px_rgba(2,86,61,0.12)] opacity-50">
                        <SelectValue placeholder="Product manager" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="product-manager">
                          Product manager
                        </SelectItem>
                        <SelectItem value="senior-pm">Senior PM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-[#000000]">
                  Upload resumes or import data excel{" "}
                  <span className="text-red-700">*</span>
                </Label>
                <div className="border border-dashed border-[#d1d1d1] rounded bg-transparent h-[114px] flex items-center justify-center">
                  <div className="flex flex-col items-center gap-2 px-4 py-8 text-center">
                    <p className="text-sm text-[#02563d] leading-5">
                      Drag and drop files here or click to upload
                    </p>
                    <p className="text-xs text-[#747474] leading-none">
                      Max file size is 500kb. Supported file types are .jpg and
                      .png.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2 justify-end">
            <Button
              type="button"
              variant="default"
              className="h-9 px-4 bg-[#02563d] hover:bg-[#02563d]/90 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]"
              onClick={() => {
                console.log("Applicant added:", applicantForm);
                setIsAddApplicantModalOpen(false);
                setApplicantForm({
                  name: "",
                  email: "",
                  contact: "",
                  attachment: null,
                  jobTitle: "",
                });
              }}
            >
              Next
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
