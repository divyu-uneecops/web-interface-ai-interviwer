"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Building2,
  Clock,
  Plus,
  CheckCircle2,
  Search,
  Download,
  Pencil,
  Trash2,
  Eye,
  MoreVertical,
  MoreHorizontal,
  Briefcase,
  ChevronLeft,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { StatusTag } from "@/components/ui/status-tag";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyMedia,
} from "@/components/ui/empty";

import { JobStatsGrid } from "@/components/app-view/job/components/job-stats-card";
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
} from "@/components/app-view/job/interfaces/job.interface";
import { ApplicantStatus } from "@/components/app-view/job/types/job.types";
import { jobService } from "@/components/app-view/job/services/job.service";
import {
  transformAPIResponseToJobDetail,
  transformAPIResponseToApplicants,
  transformAPIResponseToRounds,
} from "@/components/app-view/job/utils/job.utils";
import { CreateJobModal } from "./create-job-modal";
import { AddApplicantModal } from "./add-applicant-modal";
import { useAppSelector } from "@/store/hooks";
import { isEmpty } from "@/lib/utils";
import { CreateRoundModal } from "@/components/shared/components/create-round-modal";
import { ScheduleInterviewDialog } from "./schedule-interview-dialog";
import { InterviewDetail } from "@/components/app-view/interviews/interfaces/interview.interface";
import {
  formatInterviewDate,
  transformAPIResponseToInterviews,
} from "@/components/app-view/interviews/utils/interview.utils";
import { statusStyles } from "@/components/app-view/interviews/constants/interview.constants";
import { interviewService } from "@/components/app-view/interviews/services/interview.service";

const SEARCH_DEBOUNCE_MS = 400;

export default function JobDetails() {
  const params = useParams();
  const router = useRouter();
  const [whatsappReminder, setWhatsappReminder] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [job, setJob] = useState<JobDetail | null>(null);
  const [isLoadingJob, setIsLoadingJob] = useState(true);
  const [stats, setStats] = useState<JobStat[]>([
    { label: "Total Rounds", value: 0, icon: "rounds" },
    { label: "Total Applicants", value: 0, icon: "applicants" },
    { label: "Total Interviews Scheduled", value: 0, icon: "scheduled" },
    { label: "Total Interviews Completed", value: 0, icon: "completed" },
  ]);
  const { mappingValues } = useAppSelector((state) => state.jobs);
  const { form } = useAppSelector((state) => state.appState);
  const { views } = useAppSelector((state) => state.appState);

  const [isAddApplicantModalOpen, setIsAddApplicantModalOpen] = useState(false);
  const [isEditApplicantModalOpen, setIsEditApplicantModalOpen] =
    useState(false);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [appliedFilters, setAppliedFilters] = useState<FilterState>({
    status: [],
  });
  const [isLoadingApplicants, setIsLoadingApplicants] = useState(false);
  const [currentApplicantsOffset, setCurrentApplicantsOffset] = useState(0);
  const [applicantsPagination, setApplicantsPagination] = useState({
    total: 0,
    nextOffset: null as number | null,
    previousOffset: null as number | null,
    limit: 10,
  });
  const [editingApplicant, setEditingApplicant] = useState<Applicant | null>(
    null
  );
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

  const [isCreateRoundModalOpen, setIsCreateRoundModalOpen] = useState(false);
  const [isEditRoundModalOpen, setIsEditRoundModalOpen] = useState(false);
  const [editingRound, setEditingRound] = useState<Round | null>(null);
  const [rounds, setRounds] = useState<Round[]>([]);
  const [isLoadingRounds, setIsLoadingRounds] = useState(false);
  const [roundsPagination, setRoundsPagination] = useState({
    total: 0,
    nextOffset: null as number | null,
    previousOffset: null as number | null,
    limit: 10,
  });
  const [currentRoundsOffset, setCurrentRoundsOffset] = useState(0);
  const [scheduleInterviewDialogOpen, setScheduleInterviewDialogOpen] =
    useState(false);
  const [scheduleInterviewRound, setScheduleInterviewRound] =
    useState<Round | null>(null);

  // Applicant Interviews tab (interviews for this job only)
  const [jobInterviews, setJobInterviews] = useState<InterviewDetail[]>([]);
  const [jobInterviewsPagination, setJobInterviewsPagination] = useState({
    total: 0,
    nextOffset: null as number | null,
    previousOffset: null as number | null,
    limit: 10,
  });
  const [currentJobInterviewsOffset, setCurrentJobInterviewsOffset] =
    useState(0);
  const [isLoadingJobInterviews, setIsLoadingJobInterviews] = useState(false);
  const [jobInterviewsSearchQuery, setJobInterviewsSearchQuery] = useState("");
  const [jobInterviewsSearchKeyword, setJobInterviewsSearchKeyword] =
    useState("");
  const jobInterviewsSearchDebounceRef = useRef<ReturnType<
    typeof setTimeout
  > | null>(null);
  const [jobInterviewsAppliedFilters, setJobInterviewsAppliedFilters] =
    useState<FilterState>({ status: [] });
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

  const PAGE_LIMIT = 10;

  const listParams = { limit: 1, offset: 0 };
  const appIdPayload = { appId: "69521cd1c9ba83a076aac3ae" };

  // Fetch job detail
  useEffect(() => {
    fetchStats();
    fetchJobDetail();
  }, [params?.id]);

  // Debounce search input -> searchKeyword for applicants
  useEffect(() => {
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }
    searchDebounceRef.current = setTimeout(() => {
      setSearchKeyword(searchQuery.trim());
      setCurrentApplicantsOffset(0);
      searchDebounceRef.current = null;
    }, SEARCH_DEBOUNCE_MS);
    return () => {
      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current);
      }
    };
  }, [searchQuery]);

  // Fetch applicants when on applicants tab
  useEffect(() => {
    if (activeTab === "applicants" && params?.id) {
      fetchApplicants();
    }
  }, [activeTab, params?.id, appliedFilters, searchKeyword]);

  // Fetch rounds when on rounds tab
  useEffect(() => {
    if (activeTab === "rounds" && params?.id) {
      fetchRounds();
    }
  }, [activeTab, params?.id]);

  // Debounce search for applicant interviews tab
  useEffect(() => {
    if (jobInterviewsSearchDebounceRef.current) {
      clearTimeout(jobInterviewsSearchDebounceRef.current);
    }
    jobInterviewsSearchDebounceRef.current = setTimeout(() => {
      setJobInterviewsSearchKeyword(jobInterviewsSearchQuery.trim());
      setCurrentJobInterviewsOffset(0);
      jobInterviewsSearchDebounceRef.current = null;
    }, SEARCH_DEBOUNCE_MS);
    return () => {
      if (jobInterviewsSearchDebounceRef.current) {
        clearTimeout(jobInterviewsSearchDebounceRef.current);
      }
    };
  }, [jobInterviewsSearchQuery]);

  // Fetch job interviews when on applicant-interviews tab
  useEffect(() => {
    if (activeTab === "applicant-interviews" && params?.id) {
      fetchJobInterviews();
    }
  }, [
    activeTab,
    params?.id,
    currentJobInterviewsOffset,
    jobInterviewsAppliedFilters,
    jobInterviewsSearchKeyword,
  ]);

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

  const fetchJobDetail = async () => {
    if (!params.id || typeof params.id !== "string") {
      setIsLoadingJob(false);
      return;
    }

    setIsLoadingJob(true);
    try {
      const response = await jobService.getJobDetail(
        { id: params.id, objectId: views?.["jobs"]?.objectId || "" },
        {
          appId: "69521cd1c9ba83a076aac3ae",
        }
      );
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

  const fetchStats = async () => {
    if (!params.id || typeof params.id !== "string") {
      return;
    }

    const [
      roundsResult,
      applicantsResult,
      interviewsScheduledResult,
      interviewsCompletedResult,
    ] = await Promise.allSettled([
      jobService.getRounds(
        listParams,
        {
          ...appIdPayload,
          filters: {
            $and: [
              {
                key: "#.records.jobID",
                operator: "$eq",
                value: params?.id,
                type: "text",
              },
            ],
          },
        },
        {
          objectId: views?.["rounds"]?.objectId || "",
          viewId: views?.["rounds"]?.viewId || "",
        }
      ),
      jobService.getApplicants(
        listParams,
        {
          ...appIdPayload,
          filters: {
            $and: [
              {
                key: "#.records.jobID",
                operator: "$eq",
                value: params?.id,
                type: "text",
              },
            ],
          },
        },
        {
          objectId: views?.["applicants"]?.objectId || "",
          viewId: views?.["applicants"]?.viewId || "",
        }
      ),
      jobService.getInterviews(
        listParams,
        {
          ...appIdPayload,
          filters: {
            $and: [
              {
                key: "#.records.jobId",
                operator: "$eq",
                value: params?.id,
                type: "text",
              },
              {
                key: "#.records.status",
                operator: "$in",
                value: ["Scheduled"],
                type: "select",
              },
            ],
          },
        },
        {
          objectId: views?.["interviews"]?.objectId || "",
          viewId: views?.["interviews"]?.viewId || "",
        }
      ),
      jobService.getInterviews(
        listParams,
        {
          ...appIdPayload,
          filters: {
            $and: [
              {
                key: "#.records.jobId",
                operator: "$eq",
                value: params?.id,
                type: "text",
              },
              {
                key: "#.records.status",
                operator: "$in",
                value: ["Completed"],
                type: "select",
              },
            ],
          },
        },
        {
          objectId: views?.["interviews"]?.objectId || "",
          viewId: views?.["interviews"]?.viewId || "",
        }
      ),
    ]);

    const getTotal = (result: PromiseSettledResult<any>) =>
      result.status === "fulfilled" && result.value?.page?.total?.[0] != null
        ? result.value.page.total[0]
        : 0;

    const labelFor = (value: number, plural: string, singular: string) =>
      value === 1 ? singular : plural;

    const totalRounds = getTotal(roundsResult);
    const totalApplicants = getTotal(applicantsResult);
    const totalScheduled = getTotal(interviewsScheduledResult);
    const totalCompleted = getTotal(interviewsCompletedResult);

    setStats((prev) => [
      {
        ...prev[0],
        value: totalRounds,
        label: labelFor(totalRounds, "Total Rounds", "Total Round"),
      },
      {
        ...prev[1],
        value: totalApplicants,
        label: labelFor(totalApplicants, "Total Applicants", "Total Applicant"),
      },
      {
        ...prev[2],
        value: totalScheduled,
        label: labelFor(
          totalScheduled,
          "Total Interviews Scheduled",
          "Total Interview Scheduled"
        ),
      },
      {
        ...prev[3],
        value: totalCompleted,
        label: labelFor(
          totalCompleted,
          "Total Interviews Completed",
          "Total Interview Completed"
        ),
      },
    ]);
  };

  const fetchApplicants = async () => {
    if (!params.id || typeof params.id !== "string") {
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
        ...(searchKeyword ? { query: searchKeyword } : {}),
      };

      const response = await jobService.getApplicants(
        params_query,
        {
          filters: {
            $and: [
              {
                key: "#.records.jobID",
                operator: "$eq",
                value: params?.id,
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
          sort: {
            createdOn: "DESC",
          },
          appId: "69521cd1c9ba83a076aac3ae",
        },
        {
          objectId: views?.["applicants"]?.objectId || "",
          viewId: views?.["applicants"]?.viewId || "",
        }
      );
      const result = transformAPIResponseToApplicants(
        response.data,
        response.page
      );
      setApplicants(result.applicants);
      setApplicantsPagination({
        total: result?.pagination?.total[0] || 0,
        nextOffset: result?.pagination?.nextOffset,
        previousOffset: result?.pagination?.previousOffset,
        limit: result?.pagination?.limit,
      });
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
  };

  const fetchRounds = async () => {
    if (!params.id || typeof params.id !== "string") {
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

      const response = await jobService.getRounds(
        params_query,
        {
          filters: {
            $and: [
              {
                key: "#.records.jobID",
                operator: "$eq",
                value: params?.id as string,
                type: "text",
              },
            ],
          },
          sort: {
            createdOn: "DESC",
          },
          appId: "69521cd1c9ba83a076aac3ae",
        },
        {
          objectId: views?.["rounds"]?.objectId || "",
          viewId: views?.["rounds"]?.viewId || "",
        }
      );
      const result = transformAPIResponseToRounds(response.data, response.page);
      setRounds(result.rounds);
      setRoundsPagination({
        total: result?.pagination?.total[0] || 0,
        nextOffset: result?.pagination?.nextOffset,
        previousOffset: result?.pagination?.previousOffset,
        limit: result?.pagination?.limit,
      });
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
  };

  const fetchJobInterviews = async () => {
    if (!params?.id || typeof params.id !== "string") {
      setIsLoadingJobInterviews(false);
      return;
    }

    setIsLoadingJobInterviews(true);
    setJobInterviews([]);
    setJobInterviewsPagination({
      total: 0,
      nextOffset: null,
      previousOffset: null,
      limit: PAGE_LIMIT,
    });

    try {
      const listParams: Record<string, any> = {
        limit: 1,
        offset: currentJobInterviewsOffset,
        ...(jobInterviewsSearchKeyword
          ? { query: jobInterviewsSearchKeyword }
          : {}),
      };

      const jobIdFilter = {
        key: "#.records.jobId",
        operator: "$eq",
        value: params.id,
        type: "text",
      };

      const response = await jobService.getInterviews(
        listParams,
        {
          filters: {
            $and: [
              jobIdFilter,
              ...(jobInterviewsAppliedFilters?.status?.length > 0
                ? [
                    {
                      key: "#.records.status",
                      operator: "$in",
                      value: jobInterviewsAppliedFilters.status,
                      type: "select",
                    },
                  ]
                : []),
            ],
          },
          appId: "69521cd1c9ba83a076aac3ae",
        },
        {
          objectId: views?.["interviews"]?.objectId || "",
          viewId: views?.["interviews"]?.viewId || "",
        }
      );

      const result = transformAPIResponseToInterviews(
        response?.data || [],
        response?.page || {
          total: 0,
          nextOffset: null,
          previousOffset: null,
          limit: PAGE_LIMIT,
        }
      );

      setJobInterviews(result?.interviews || []);
      setJobInterviewsPagination({
        total: result?.pagination?.total?.[0] ?? 0,
        nextOffset: result?.pagination?.nextOffset ?? null,
        previousOffset: result?.pagination?.previousOffset ?? null,
        limit: result?.pagination?.limit ?? PAGE_LIMIT,
      });

      if (currentJobInterviewsOffset === 0) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch (error: any) {
      console.error("Error fetching job interviews:", error);
      toast.error(
        error?.response?.data?.message || "Failed to fetch interviews",
        { duration: 3000 }
      );
      setJobInterviews([]);
      setJobInterviewsPagination({
        total: 0,
        nextOffset: null,
        previousOffset: null,
        limit: PAGE_LIMIT,
      });
    } finally {
      setIsLoadingJobInterviews(false);
    }
  };

  const handleApplyFilters = (filters: FilterState) => {
    setAppliedFilters(filters);
    setCurrentApplicantsOffset(0); // Reset to first page when filters are applied
  };

  const handleApplyJobInterviewFilters = (filters: FilterState) => {
    setJobInterviewsAppliedFilters(filters);
    setCurrentJobInterviewsOffset(0);
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
        accessor: (round) => round?.totalQuestions,
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
        cell: (round) => (
          <Button
            variant="outline"
            className="h-9 px-4 py-2 text-sm font-medium bg-[#f5f5f5] border-0 text-[#171717] hover:bg-[#f5f5f5] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] rounded-md"
            onClick={() => {
              setScheduleInterviewRound(round);
              setScheduleInterviewDialogOpen(true);
            }}
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
        <DropdownMenuItem onClick={() => handleEditRound(round)}>
          <Pencil className="h-4 text-[#737373] mr-2" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onClick={() => handleDeleteRound(round?.id)}
        >
          <Trash2 className="h-4 mr-2" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

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
        <DropdownMenuItem
          disabled={isEmpty(applicant?.attachment)}
          onClick={() => handleDownloadAttachment(applicant?.attachment)}
        >
          <Download className="h-4 text-[#737373] mr-2" />
          Download Resume
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

  // Applicant Interviews tab: columns (same structure as interviews-list)
  const jobInterviewColumns: Column<InterviewDetail>[] = useMemo(
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

  const renderJobInterviewRowActions = (interview: InterviewDetail) => (
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

  const handleDeleteApplicant = async (id: string) => {
    if (isEmpty(id)) return;
    try {
      const response = await jobService.deleteApplicant({
        id,
        objectId: views?.["applicants"]?.objectId || "",
      });
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

  const handleDeleteRound = async (id: string) => {
    if (isEmpty(id)) return;
    try {
      const response = await jobService.deleteRound({
        id,
        objectId: views?.["rounds"]?.objectId || "",
      });
      toast.success(response ? response : "Round deleted successfully", {
        duration: 8000, // 8 seconds
      });
      // Refresh rounds list
      fetchRounds();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to delete round", {
        duration: 8000, // 8 seconds
      });
    }
  };

  const handleEditApplicant = (applicant: Applicant) => {
    setEditingApplicant(applicant);
    setIsEditApplicantModalOpen(true);
  };

  const handleEditRound = (round: Round) => {
    setEditingRound(round);
    setIsEditRoundModalOpen(true);
  };

  const handleDownloadAttachment = async (attachment: string) => {
    if (isEmpty(attachment)) return;
    try {
      const url = await jobService.downloadApplicantAttachment(attachment);
      if (url) {
        // Open the presigned S3 URL in a new tab to trigger download
        window.open(url, "_blank");
      } else {
        toast.error("Failed to get download link", { duration: 8000 });
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to download attachment",
        {
          duration: 8000,
        }
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
          <div className="flex">
            <ChevronLeft
              className="cursor-pointer mr-2"
              onClick={() => router.back()}
            />
            <div>
              {/* Title + Badge */}
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl font-bold text-black leading-7">
                  {job?.title}
                </h1>
                <Badge
                  className={`border-0 rounded-full px-2 h-6 text-xs font-normal ${
                    job?.status === "Active"
                      ? "bg-[#def2eb] text-[#0e4230] hover:bg-[#def2eb]"
                      : job?.status === "Closed"
                      ? "bg-[#fcefec] text-[#d92d20] hover:bg-[#fcefec]"
                      : "bg-[#e5e5e5] text-[#000000] hover:bg-[#e5e5e5]"
                  }`}
                >
                  {job?.status}
                </Badge>
              </div>

              {/* Meta Info */}
              <div className="flex items-center gap-4 mt-2">
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
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* <div className="flex items-center gap-3">
            <Switch
              checked={whatsappReminder}
              onCheckedChange={setWhatsappReminder}
            />
            <span className="text-sm font-medium text-[#0a0a0a]">
              Whatsapp reminder
            </span>
          </div> */}
          {/* <Button
            variant="secondary"
            className="h-9 px-4 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]"
          >
            Share
          </Button> */}
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
              <TabsTrigger
                value="applicant-interviews"
                className="flex-1 h-[30px] rounded-lg text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                Interviews
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
              loadingState={<DataTableSkeleton columns={6} rows={3} />}
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
              loadingState={<DataTableSkeleton columns={6} rows={3} />}
              emptyState={
                <div className="text-center py-12">
                  <p className="text-sm text-[#737373]">
                    {appliedFilters?.status?.length > 0 || searchQuery
                      ? "Try adjusting your filters or search query to find what you're looking for."
                      : "No applicants found"}
                  </p>
                </div>
              }
              rowActions={renderApplicantRowActions}
            />
          </TabsContent>

          {/* Applicant Interviews Tab Content */}
          <TabsContent value="applicant-interviews" className="mt-4 space-y-4">
            <div className="flex gap-3 items-center">
              <div className="flex-1 flex items-center gap-2 px-3 py-2.5 border-b border-[#e5e5e5] w-[245px]">
                <Search className="w-4 h-4 text-[#737373]" />
                <input
                  type="text"
                  placeholder="Search"
                  value={jobInterviewsSearchQuery}
                  onChange={(e) =>
                    setJobInterviewsSearchQuery(e?.target?.value ?? "")
                  }
                  className="flex-1 text-sm text-[#737373] bg-transparent border-0 outline-none placeholder:text-[#737373]"
                />
              </div>

              <FilterDropdown
                filterGroups={interviewFilterGroups}
                onApplyFilters={handleApplyJobInterviewFilters}
                initialFilters={jobInterviewsAppliedFilters}
              />
            </div>

            <DataTable<InterviewDetail>
              data={jobInterviews ?? []}
              columns={jobInterviewColumns}
              getRowId={(interview) => interview?.id}
              pagination={jobInterviewsPagination}
              currentOffset={currentJobInterviewsOffset}
              onPaginationChange={setCurrentJobInterviewsOffset}
              isLoading={isLoadingJobInterviews}
              loadingState={<DataTableSkeleton columns={8} rows={11} />}
              emptyState={
                <div className="text-center py-12">
                  <Calendar className="w-12 h-12 text-[#737373] mx-auto mb-4" />
                  <p className="text-[#737373] text-sm font-medium">
                    No interviews found for this job
                  </p>
                  {(jobInterviewsAppliedFilters?.status?.length > 0 ||
                    jobInterviewsSearchQuery) && (
                    <p className="text-[#737373] text-sm mt-1">
                      Try adjusting your filters or search query.
                    </p>
                  )}
                </div>
              }
              rowActions={renderJobInterviewRowActions}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Job Modal */}
      {isEditModalOpen && (
        <CreateJobModal
          open={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          onSuccess={() => {
            fetchJobDetail();
          }}
          mappingValues={mappingValues}
          form={form}
          views={views}
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
          jobId={job?.id}
        />
      )}

      {/* Create Round Modal */}
      {isCreateRoundModalOpen && (
        <CreateRoundModal
          open={isCreateRoundModalOpen}
          onOpenChange={setIsCreateRoundModalOpen}
          onSubmit={() => {
            fetchRounds();
          }}
          mappingValues={mappingValues}
          jobId={(params?.id as string) || ""}
          form={form}
          views={views}
        />
      )}

      {/* Edit Round Modal */}
      {isEditRoundModalOpen && (
        <CreateRoundModal
          open={isEditRoundModalOpen}
          onOpenChange={setIsEditRoundModalOpen}
          onSubmit={() => {
            fetchRounds();
          }}
          mappingValues={mappingValues}
          isEditMode={true}
          jobId={(params?.id as string) || ""}
          roundDetail={{
            roundName: editingRound?.name || "",
            roundType: editingRound?.type || "",
            roundObjective: editingRound?.objective || "",
            duration: editingRound?.duration || "",
            language: editingRound?.language || "",
            interviewer: editingRound?.interviewer || "",
            skills: editingRound?.skills || [],
            questionType: editingRound?.questionType as "ai" | "hybrid",
            aiGeneratedQuestions: editingRound?.aiGeneratedQuestions || 0,
            customQuestions: editingRound?.customQuestions || 0,
            customQuestionTexts: editingRound?.customQuestionTexts || [],
            interviewInstructions: editingRound?.interviewInstructions || "",
            allowSkip: editingRound?.allowSkip || false,
            sendReminder: editingRound?.sendReminder || false,
            reminderTime: editingRound?.reminderTime || "3 days",
          }}
          roundId={editingRound?.id}
          form={form}
          views={views}
        />
      )}

      {/* Add Applicant Modal */}
      {isAddApplicantModalOpen && (
        <AddApplicantModal
          open={isAddApplicantModalOpen}
          onOpenChange={setIsAddApplicantModalOpen}
          jobInfo={{ jobId: params?.id as string, jobTitle: job?.title || "" }}
          onSubmit={() => {
            // Handle applicant submission here
            fetchApplicants();
          }}
          form={form}
          views={views}
          mappingValues={mappingValues}
        />
      )}

      {/* Edit Applicant Modal */}
      {isEditApplicantModalOpen && (
        <AddApplicantModal
          open={isEditApplicantModalOpen}
          onOpenChange={(open) => {
            setIsEditApplicantModalOpen(open);
            if (!open) {
              setEditingApplicant(null);
            }
          }}
          jobInfo={{ jobId: params?.id as string, jobTitle: job?.title || "" }}
          isEditMode={true}
          applicantId={editingApplicant?.id}
          applicantDetail={{
            name: editingApplicant?.name || "",
            email: editingApplicant?.email || "",
            contact: editingApplicant?.contact || "",
            attachment:
              typeof editingApplicant?.attachment === "string"
                ? null
                : editingApplicant?.attachment || null,
          }}
          onSubmit={() => {
            // Handle applicant update here
            fetchApplicants();
          }}
          form={form}
          views={views}
          mappingValues={mappingValues}
        />
      )}

      {/* Schedule Interview Dialog */}
      {scheduleInterviewDialogOpen && (
        <ScheduleInterviewDialog
          open={scheduleInterviewDialogOpen}
          onOpenChange={(open) => {
            setScheduleInterviewDialogOpen(open);
            if (!open) setScheduleInterviewRound(null);
          }}
          form={form}
          round={scheduleInterviewRound}
          jobId={(params?.id as string) || ""}
          views={views}
          onSuccess={() => {}}
        />
      )}
    </div>
  );
}
