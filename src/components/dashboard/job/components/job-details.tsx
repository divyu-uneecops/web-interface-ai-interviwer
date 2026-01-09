"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
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
  MoreHorizontal,
  Briefcase,
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
import { DataTable, Column } from "@/components/shared/components/data-table";
import { DataTableSkeleton } from "@/components/shared/components/data-table-skeleton";
import { FilterDropdown } from "@/components/shared/components/filter-dropdown";
import {
  FilterState,
  FilterGroup,
} from "@/components/shared/interfaces/shared.interface";
import {
  Applicant,
  JobDetail,
  JobStat,
  Round,
} from "@/components/dashboard/job/interfaces/job.interface";
import { mockApplicants } from "@/components/dashboard/job/constants/job.constants";
import { ApplicantStatus } from "@/components/dashboard/job/types/job.types";
import { jobService } from "@/components/dashboard/job/services/job.service";
import {
  transformAPIResponseToJobDetail,
  transformAPIResponseToApplicants,
  transformAPIResponseToRounds,
} from "@/components/dashboard/job/utils/job.utils";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyMedia,
} from "@/components/ui/empty";

import { CreateJobModal } from "./create-job-modal";
import { AddApplicantModal } from "./add-applicant-modal";
import { useAppSelector } from "@/store/hooks";
import { isEmpty } from "@/lib/utils";

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
  const [isEditApplicantModalOpen, setIsEditApplicantModalOpen] =
    useState(false);
  const [isCreateRoundModalOpen, setIsCreateRoundModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("details");
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [rounds, setRounds] = useState<Round[]>([]);
  const [appliedFilters, setAppliedFilters] = useState<FilterState>({
    status: [],
    rounds: [],
    applied: [],
  });
  const [job, setJob] = useState<JobDetail | null>(null);
  const [isLoadingJob, setIsLoadingJob] = useState(true);
  const [isLoadingApplicants, setIsLoadingApplicants] = useState(false);
  const [isLoadingRounds, setIsLoadingRounds] = useState(false);
  const [applicantsPagination, setApplicantsPagination] = useState({
    total: 0,
    nextOffset: null as number | null,
    previousOffset: null as number | null,
    limit: 10,
  });
  const [roundsPagination, setRoundsPagination] = useState({
    total: 0,
    nextOffset: null as number | null,
    previousOffset: null as number | null,
    limit: 10,
  });
  const [currentApplicantsOffset, setCurrentApplicantsOffset] = useState(0);
  const [currentRoundsOffset, setCurrentRoundsOffset] = useState(0);
  const [editingApplicant, setEditingApplicant] = useState<Applicant | null>(
    null
  );
  const PAGE_LIMIT = 10;

  const { mappingValues } = useAppSelector((state) => state.jobs);

  // Define filter groups for applicants
  const applicantFilterGroups: FilterGroup[] = [
    {
      id: "status",
      label: "Status",
      options: [
        { value: "Interviewed", label: "Interviewed" },
        { value: "Applied", label: "Applied" },
        { value: "Rejected", label: "Rejected" },
      ],
    },
  ];

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

  const fetchApplicants = useCallback(async () => {
    if (!params.id || typeof params.id !== "string") {
      setIsLoadingApplicants(false);
      return;
    }

    // Wait for job to be loaded to get jobId
    if (!job?.jobId) {
      setIsLoadingApplicants(false);
      return;
    }

    setIsLoadingApplicants(true);
    setApplicants([]);
    setApplicantsPagination({
      total: 0,
      nextOffset: null,
      previousOffset: null,
      limit: PAGE_LIMIT,
    });
    try {
      const params_query: Record<string, any> = {
        limit: PAGE_LIMIT,
        offset: currentApplicantsOffset,
      };

      const response = await jobService.getApplicants(params_query, {
        filters: {
          $and: [
            {
              key: "#.records.jobId",
              operator: "$eq",
              value: job?.jobId,
              type: "text",
            },
            ...(appliedFilters.status.length > 0
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
      const result = transformAPIResponseToApplicants(
        response.data,
        response.page
      );
      setApplicants(result.applicants);
      setApplicantsPagination(result.pagination);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to fetch applicants",
        {
          duration: 8000,
        }
      );
      setApplicants([]);
      setApplicantsPagination({
        total: 0,
        nextOffset: null,
        previousOffset: null,
        limit: PAGE_LIMIT,
      });
    } finally {
      setIsLoadingApplicants(false);
    }
  }, [
    params.id,
    job?.jobId,
    currentApplicantsOffset,
    appliedFilters,
    searchQuery,
  ]);

  // Fetch job detail
  useEffect(() => {
    fetchJobDetail();
  }, [params.id]);

  const fetchRounds = useCallback(async () => {
    if (!params.id || typeof params.id !== "string") {
      setIsLoadingRounds(false);
      return;
    }

    // Wait for job to be loaded to get jobId
    if (!job?.jobId) {
      setIsLoadingRounds(false);
      return;
    }

    setIsLoadingRounds(true);
    setRounds([]);
    setRoundsPagination({
      total: 0,
      nextOffset: null,
      previousOffset: null,
      limit: PAGE_LIMIT,
    });
    try {
      const params_query: Record<string, any> = {
        limit: PAGE_LIMIT,
        offset: currentRoundsOffset,
      };

      const response = await jobService.getRounds(params_query, {
        filters: {
          $and: [
            {
              key: "#.records.jobName",
              operator: "$eq",
              value: job?.jobId,
              type: "text",
            },
          ],
        },
        appId: "69521cd1c9ba83a076aac3ae",
      });
      const result = transformAPIResponseToRounds(response.data, response.page);
      setRounds(result.rounds);
      setRoundsPagination(result.pagination);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to fetch rounds", {
        duration: 8000,
      });
      setRounds([]);
      setRoundsPagination({
        total: 0,
        nextOffset: null,
        previousOffset: null,
        limit: PAGE_LIMIT,
      });
    } finally {
      setIsLoadingRounds(false);
    }
  }, [params.id, job?.jobId, currentRoundsOffset]);

  // Fetch applicants when on applicants tab
  useEffect(() => {
    if (activeTab === "applicants" && params.id && job?.jobId) {
      fetchApplicants();
    }
  }, [activeTab, fetchApplicants, params.id, job?.jobId]);

  // Fetch rounds when on rounds tab
  useEffect(() => {
    if (activeTab === "rounds" && params.id && job?.jobId) {
      fetchRounds();
    }
  }, [activeTab, fetchRounds, params.id, job?.jobId]);

  const handleApplyFilters = (filters: FilterState) => {
    setAppliedFilters(filters);
    setCurrentApplicantsOffset(0); // Reset to first page when filters are applied
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

  // Define table columns for applicants
  const applicantColumns: Column<Applicant>[] = useMemo(
    () => [
      {
        id: "name",
        header: "Applicant name",
        align: "left",
        accessor: (applicant) => applicant?.name,
      },
      {
        id: "email",
        header: "Email",
        align: "center",
        width: "220px",
        accessor: (applicant) => applicant?.email,
      },
      {
        id: "contact",
        header: "Contact number",
        align: "center",
        accessor: (applicant) => applicant?.contact,
      },
      {
        id: "status",
        header: "Status",
        align: "center",
        width: "166px",
        cell: (applicant) => (
          <div className="flex justify-center">
            {getStatusTag(applicant?.status)}
          </div>
        ),
      },
      {
        id: "appliedDate",
        header: "Applied",
        align: "center",
        width: "144px",
        accessor: (applicant) => applicant?.appliedDate,
      },
    ],
    []
  );

  // Define table columns for rounds
  const roundColumns: Column<Round>[] = useMemo(
    () => [
      {
        id: "name",
        header: "Round name",
        align: "left",
        accessor: (round) => round?.name,
      },
      {
        id: "duration",
        header: "Duration",
        align: "center",
        accessor: (round) => round?.duration,
      },
      {
        id: "questions",
        header: "Questions",
        align: "center",
        accessor: (round) => round?.questions,
      },
      {
        id: "applicants",
        header: "Applicants",
        align: "center",
        accessor: (round) => round?.applicants,
      },
      {
        id: "created",
        header: "Created",
        align: "center",
        accessor: (round) => round?.created,
      },
      {
        id: "quickAction",
        header: "Quick action",
        align: "center",
        cell: () => (
          <Button
            variant="outline"
            className="h-9 px-4 py-2 text-sm font-medium bg-[#f5f5f5] border-0 text-[#171717] hover:bg-[#f5f5f5] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] rounded-md"
          >
            Schedule interview
          </Button>
        ),
      },
    ],
    []
  );

  // Row actions renderer for rounds
  const renderRoundRowActions = (round: Round) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>
          <Eye className="h-4 text-[#737373] mr-2" />
          View details
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Pencil className="h-4 text-[#737373] mr-2" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">
          <Trash2 className="h-4 mr-2" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const handleDeleteApplicant = async (id: string) => {
    if (isEmpty(id)) return;
    try {
      const response = await jobService.deleteApplicant(id);
      toast.success(response ? response : "Applicant deleted successfully", {
        duration: 8000, // 8 seconds
      });
      // Refresh applicants list
      fetchApplicants();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to delete applicant",
        {
          duration: 8000, // 8 seconds
        }
      );
    }
  };

  const handleEditApplicant = (applicant: Applicant) => {
    setEditingApplicant(applicant);
    setIsEditApplicantModalOpen(true);
  };

  // Row actions renderer for applicants
  const renderApplicantRowActions = (applicant: Applicant) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>
          <Download className="h-4 text-[#737373] mr-2" />
          Download
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleEditApplicant(applicant)}>
          <Pencil className="h-4 text-[#737373] mr-2" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onClick={() => handleDeleteApplicant(applicant?.id)}
        >
          <Trash2 className="h-4 mr-2" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

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
                    {Array.from({ length: 3 }).map((_, index) => (
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
                    {Array.from({ length: 2 }).map((_, index) => (
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
      <Empty className="h-64">
        <EmptyHeader>
          <EmptyMedia>
            <Briefcase className="w-8 h-8 text-[#737373]" />
          </EmptyMedia>
          <EmptyTitle>Job not found</EmptyTitle>
          <EmptyDescription>
            The job you're looking for doesn't exist or has been removed.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
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
          <TabsContent value="rounds" className="mt-4 space-y-4">
            {/* Rounds Table */}
            <DataTable<Round>
              data={rounds}
              columns={roundColumns}
              getRowId={(round) => round?.id}
              pagination={roundsPagination}
              currentOffset={currentRoundsOffset}
              onPaginationChange={setCurrentRoundsOffset}
              isLoading={isLoadingRounds}
              loadingState={<DataTableSkeleton columns={6} rows={10} />}
              emptyState={
                <div className="text-center py-12">
                  <p className="text-sm text-[#737373]">
                    No rounds created yet. Click "Add round" to create your
                    first round.
                  </p>
                </div>
              }
              rowActions={renderRoundRowActions}
            />
          </TabsContent>

          {/* Applicants Tab Content */}
          <TabsContent value="applicants" className="mt-4 space-y-4">
            {/* Search and Filters */}
            <div className="flex gap-3 items-center">
              <div className="flex-1 flex items-center gap-2 px-3 py-2.5 border-b border-[#e5e5e5] w-[245px]">
                <Search className="w-4 h-4 text-[#737373]" />
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 text-sm text-[#737373] bg-transparent border-0 outline-none placeholder:text-[#737373]"
                />
              </div>

              {/* Filters Button */}
              <FilterDropdown
                filterGroups={applicantFilterGroups}
                onApplyFilters={handleApplyFilters}
                initialFilters={appliedFilters}
              />
            </div>

            {/* Applicants Table */}
            <DataTable<Applicant>
              data={applicants}
              columns={applicantColumns}
              getRowId={(applicant) => applicant?.id}
              pagination={applicantsPagination}
              currentOffset={currentApplicantsOffset}
              onPaginationChange={setCurrentApplicantsOffset}
              isLoading={isLoadingApplicants}
              loadingState={<DataTableSkeleton columns={6} rows={10} />}
              emptyState={
                <div className="text-center py-12">
                  <p className="text-sm text-[#737373]">No applicants found</p>
                </div>
              }
              rowActions={renderApplicantRowActions}
            />
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
          // Handle round creation - refresh rounds list
          fetchRounds();
          setIsCreateRoundModalOpen(false);
        }}
      />

      {/* Add Applicant Modal */}
      <AddApplicantModal
        open={isAddApplicantModalOpen}
        onOpenChange={setIsAddApplicantModalOpen}
        jobInfo={{ jobId: job?.jobId || "", jobTitle: job?.title || "" }}
        onSubmit={(form) => {
          // Handle applicant submission here
          fetchApplicants();
        }}
      />

      {/* Edit Applicant Modal */}
      <AddApplicantModal
        open={isEditApplicantModalOpen}
        onOpenChange={(open) => {
          setIsEditApplicantModalOpen(open);
          if (!open) {
            setEditingApplicant(null);
          }
        }}
        jobInfo={{ jobId: job?.jobId || "", jobTitle: job?.title || "" }}
        isEditMode={true}
        applicantId={editingApplicant?.id}
        applicantDetail={
          editingApplicant
            ? {
                name: editingApplicant.name,
                email: editingApplicant.email,
                contact: editingApplicant.contact,
                attachment: null,
              }
            : null
        }
        onSubmit={(form) => {
          // Handle applicant update here
          fetchApplicants();
        }}
      />
    </div>
  );
}
