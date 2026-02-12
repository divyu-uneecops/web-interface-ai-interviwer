"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  Briefcase,
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
import { JobDetail, JobStat } from "../interfaces/job.interface";
import { CreateJobModal } from "./create-job-modal";
import { jobService } from "../services/job.service";
import { transformAPIResponseToJobs } from "../utils/job.utils";
import { statusStyles } from "../constants/job.constants";
import { isEmpty } from "@/lib/utils";
import { toast } from "sonner";
import { useAppSelector } from "@/store/hooks";
import { DataTableSkeleton } from "@/components/shared/components/data-table-skeleton";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty";

const SEARCH_DEBOUNCE_MS = 400;

export default function JobList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [stats, setStats] = useState<JobStat[]>([
    { label: "Total Jobs", value: 0, icon: "jobs" },
    { label: "Total Applicants", value: 0, icon: "applicants" },
    { label: "Total Interviews Scheduled", value: 0, icon: "scheduled" },
    { label: "Total Interviews Completed", value: 0, icon: "completed" },
  ]);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
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
  const { views } = useAppSelector((state) => state.appState);

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
  const [jobCountsMap, setJobCountsMap] = useState<
    Record<string, { applicants: number; interviews: number }>
  >({});
  const [loadingCountsForJobIds, setLoadingCountsForJobIds] = useState<
    Set<string>
  >(new Set());

  const appIdPayload = { appId: "69521cd1c9ba83a076aac3ae" };
  const listParams = { limit: 1, offset: 0 };

  const fetchStats = async () => {
    setIsLoadingStats(true);
    try {
      const [
        jobsResult,
        applicantsResult,
        interviewsScheduledResult,
        interviewsCompletedResult,
      ] = await Promise.allSettled([
        jobService.getJobOpenings(
          listParams,
          {
            ...appIdPayload,
            filters: { $and: [] },
          },
          {
            objectId: views?.["jobs"]?.objectId || "",
            viewId: views?.["jobs"]?.viewId || "",
          }
        ),
        jobService.getApplicants(
          listParams,
          {
            ...appIdPayload,
            filters: { $and: [] },
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

      const totalJobs = getTotal(jobsResult);
      const totalApplicants = getTotal(applicantsResult);
      const totalScheduled = getTotal(interviewsScheduledResult);
      const totalCompleted = getTotal(interviewsCompletedResult);

      setStats((prev) => [
        {
          ...prev[0],
          value: totalJobs,
          label: labelFor(totalJobs, "Total Jobs", "Total Job"),
        },
        {
          ...prev[1],
          value: totalApplicants,
          label: labelFor(
            totalApplicants,
            "Total Applicants",
            "Total Applicant"
          ),
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
    } finally {
      setIsLoadingStats(false);
    }
  };

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
    fetchJobs();
  }, [currentOffset, appliedFilters, searchKeyword]);

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    if (jobs.length > 0) {
      fetchJobCounts(jobs.map((j) => j?.id));
    } else {
      setJobCountsMap({});
    }
  }, [jobs]);

  const getTotalFromResult = (result: PromiseSettledResult<any>) =>
    result.status === "fulfilled" && result.value?.page?.total?.[0] != null
      ? result.value.page.total[0]
      : 0;

  const fetchJobCounts = async (jobIds: string[]) => {
    if (jobIds?.length === 0) return;
    setLoadingCountsForJobIds((prev) => new Set([...prev, ...(jobIds || [])]));
    try {
      const jobIdFilter = (jobId: string) => ({
        key: "#.records.jobID",
        operator: "$eq",
        value: jobId,
        type: "text",
      });

      const settled = await Promise.allSettled(
        jobIds.map(async (jobId) => {
          const [applicantsResult, interviewsResult] = await Promise.allSettled(
            [
              jobService.getApplicants(
                listParams,
                {
                  ...appIdPayload,
                  filters: { $and: [jobIdFilter(jobId)] },
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
                    $and: [jobIdFilter(jobId)],
                  },
                },
                {
                  objectId: views?.["interviews"]?.objectId || "",
                  viewId: views?.["interviews"]?.viewId || "",
                }
              ),
            ]
          );
          const applicants = getTotalFromResult(applicantsResult);
          const interviews = getTotalFromResult(interviewsResult);
          return { jobId, applicants, interviews };
        })
      );

      const results = settled
        .filter(
          (
            r
          ): r is PromiseFulfilledResult<{
            jobId: string;
            applicants: number;
            interviews: number;
          }> => r.status === "fulfilled"
        )
        .map((r) => r.value);

      setJobCountsMap((prev) => {
        const next = { ...prev };
        results.forEach(({ jobId, applicants, interviews }) => {
          next[jobId] = { applicants, interviews };
        });
        return next;
      });
    } finally {
      setLoadingCountsForJobIds((prev) => {
        const next = new Set(prev);
        jobIds.forEach((id) => next.delete(id));
        return next;
      });
    }
  };

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
        ...(searchKeyword ? { query: searchKeyword } : {}),
      };

      const response = await jobService.getJobOpenings(
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
          sort: {
            createdOn: "DESC",
          },
          appId: "69521cd1c9ba83a076aac3ae",
        },
        {
          objectId: views?.["jobs"]?.objectId || "",
          viewId: views?.["jobs"]?.viewId || "",
        }
      );
      const result = transformAPIResponseToJobs(response?.data, response?.page);
      setJobs(result?.jobs);
      setPagination({
        total: result?.pagination?.total[0] || 0,
        nextOffset: result?.pagination?.nextOffset,
        previousOffset: result?.pagination?.previousOffset,
        limit: result?.pagination?.limit,
      });
      // Scroll to top when page changes
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error: any) {
      toast.error(
        error ? error?.response?.data?.message : "An unknown error occurred",
        {
          duration: 8000,
        }
      );
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
        cell: (job) => {
          const loading = job?.id && loadingCountsForJobIds.has(job?.id);
          const counts = job?.id ? jobCountsMap[job?.id] : undefined;
          if (loading) return "...";
          return counts?.applicants ?? job?.applicants ?? "--";
        },
      },
      {
        id: "interviews",
        header: "Interviews",
        align: "center",
        cell: (job) => {
          const loading = job?.id && loadingCountsForJobIds.has(job?.id);
          const counts = job?.id ? jobCountsMap[job?.id] : undefined;
          if (loading) return "...";
          return counts?.interviews ?? job?.interviews ?? "--";
        },
      },
      {
        id: "created",
        header: "Created",
        align: "center",
        accessor: (job) => job?.createdOn,
      },
    ],
    [jobCountsMap, loadingCountsForJobIds]
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
      const response = await jobService.deleteJobOpening({
        id: id || "",
        objectId: views?.["jobs"]?.objectId || "",
      });
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
      {isLoadingStats ? (
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
      ) : (
        <JobStatsGrid stats={stats} />
      )}

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
          <Empty className="py-12">
            <EmptyMedia variant="icon">
              <Briefcase className="h-8 w-8 text-[#737373]" />
            </EmptyMedia>
            <EmptyHeader>
              <EmptyTitle>No jobs found</EmptyTitle>
              <EmptyDescription>
                {appliedFilters?.status?.length > 0 || searchQuery
                  ? "Try adjusting your filters or search query to find what you're looking for."
                  : "Get started by creating your first job opening."}
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
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
