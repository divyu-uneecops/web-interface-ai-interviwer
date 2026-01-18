"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, Search } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import { FilterDropdown } from "@/components/shared/components/filter-dropdown";
import {
  FilterState,
  FilterGroup,
} from "@/components/shared/interfaces/shared.interface";
import { interviewerService } from "../services/interviewer.services";
import {
  APIPaginationInfo,
  Interviewer,
  InterviewerFormData,
} from "../interfaces/interviewer.interfaces";
import { CreateInterviewerModal } from "./create-interviewer-modal";
import { InterviewerCard } from "./interviewer-card";
import {
  roundTypeOptions,
  languageOptions,
  voiceOptions,
} from "../constants/interviewer.constants";
import { transformAPIResponseToInterviewers } from "../utils/interviewer.utils";

const PAGE_LIMIT = 12; // 4 columns x 3 rows

export function InterviewerList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [interviewers, setInterviewers] = useState<Interviewer[]>([]);
  const [pagination, setPagination] = useState<APIPaginationInfo>({
    total: 0,
    nextOffset: null,
    previousOffset: null,
    limit: PAGE_LIMIT,
  });
  const [currentOffset, setCurrentOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<FilterState>({
    roundType: [],
    language: [],
    voice: [],
  });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [interviewerDetail, setInterviewerDetail] =
    useState<Interviewer | null>(null);
  const observerTarget = useRef<HTMLDivElement>(null);

  // Define filter groups for interviewers
  const interviewerFilterGroups: FilterGroup[] = [
    {
      id: "roundType",
      label: "Round Type",
      options: roundTypeOptions,
    },
    {
      id: "language",
      label: "Language",
      options: languageOptions,
    },
    {
      id: "voice",
      label: "Voice",
      options: voiceOptions,
    },
  ];

  // Fetch interviewers when filters change (initial load and reset)
  useEffect(() => {
    setCurrentOffset(0);
    fetchInterviewers(0, true);
  }, [appliedFilters]);

  // Fetch more interviewers when offset changes (lazy loading)
  useEffect(() => {
    if (
      currentOffset > 0 &&
      pagination.nextOffset !== null &&
      pagination?.nextOffset >= pagination?.total
    ) {
      fetchInterviewers(currentOffset, false);
    }
  }, [currentOffset]);

  const fetchInterviewers = async (
    offset: number,
    isInitialLoad: boolean = true
  ) => {
    if (isInitialLoad) {
      setIsLoading(true);
      setInterviewers([]);
      setPagination({
        total: 0,
        nextOffset: null,
        previousOffset: null,
        limit: PAGE_LIMIT,
      });
    } else {
      setIsLoadingMore(true);
    }

    try {
      const params: Record<string, any> = {
        limit: PAGE_LIMIT,
        offset: offset,
      };

      const response = await interviewerService.getInterviewers(params, {
        filters: {
          $and: [
            ...(appliedFilters.roundType.length > 0
              ? [
                  {
                    key: "#.records.roundType",
                    operator: "$in",
                    value: appliedFilters.roundType,
                    type: "select",
                  },
                ]
              : []),
            ...(appliedFilters.language.length > 0
              ? [
                  {
                    key: "#.records.language",
                    operator: "$in",
                    value: appliedFilters.language,
                    type: "select",
                  },
                ]
              : []),
            ...(appliedFilters.voice.length > 0
              ? [
                  {
                    key: "#.records.voice",
                    operator: "$in",
                    value: appliedFilters.voice,
                    type: "select",
                  },
                ]
              : []),
          ],
        },
        appId: "69521cd1c9ba83a076aac3ae",
      });

      const result = transformAPIResponseToInterviewers(
        response?.data || [],
        response?.page || {
          total: 0,
          nextOffset: null,
          previousOffset: null,
          limit: PAGE_LIMIT,
        }
      );

      if (isInitialLoad) {
        setInterviewers(result?.interviewers);
      } else {
        setInterviewers((prev) => [...prev, ...result?.interviewers]);
      }
      setPagination(result?.pagination);
    } catch (error: any) {
      if (isInitialLoad) {
        setInterviewers([]);
        setPagination({
          total: 0,
          nextOffset: null,
          previousOffset: null,
          limit: PAGE_LIMIT,
        });
      }
      toast.error(
        error?.response?.data?.message || "Failed to fetch interviewers",
        {
          duration: 8000,
        }
      );
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  const handleCreateInterviewer = () => {
    setCurrentOffset(0);

    if (currentOffset === 0) {
      fetchInterviewers(0, true);
    }
  };

  const handleUpdateInterviewer = () => {
    setInterviewerDetail(null);
    setCurrentOffset(0);

    if (currentOffset === 0) {
      fetchInterviewers(0, true);
    }
  };

  const handleEditInterviewer = async (interviewer: Interviewer) => {
    setInterviewerDetail(interviewer);
    setIsEditModalOpen(true);
  };

  const handleApplyFilters = (filters: FilterState) => {
    setAppliedFilters(filters);
    setCurrentOffset(0); // Reset to first page when filters are applied
  };

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (
          target.isIntersecting &&
          pagination.nextOffset !== null &&
          !isLoading &&
          !isLoadingMore &&
          pagination?.nextOffset < pagination?.total
        ) {
          setCurrentOffset(pagination.nextOffset);
        }
      },
      {
        root: null,
        rootMargin: "100px",
        threshold: 0.1,
      }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        {/* Search Input */}
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
            filterGroups={interviewerFilterGroups}
            onApplyFilters={handleApplyFilters}
            initialFilters={appliedFilters}
          />

          {/* Create AI Interviewer Button */}
          <Button
            variant="default"
            size="default"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus className="w-4 h-4" />
            Create AI interviewer
          </Button>
        </div>
      </div>

      {/* Interviewers Grid */}
      {isLoading ? (
        <div className="grid grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, index: number) => (
            <div
              key={index}
              className="bg-white border border-[#d1d1d1] rounded p-2 flex flex-col animate-pulse"
            >
              <div className="w-full aspect-square rounded bg-gray-200 mb-1" />
              <div className="h-4 bg-gray-200 rounded mb-2" />
              <div className="h-3 bg-gray-200 rounded mb-1" />
              <div className="h-3 bg-gray-200 rounded mb-4" />
              <div className="h-9 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      ) : (
        <>
          {interviewers?.length > 0 && (
            <>
              <div className="grid grid-cols-4 gap-6">
                {interviewers?.map((interviewer: Interviewer) => (
                  <InterviewerCard
                    key={interviewer?.id}
                    interviewer={interviewer}
                    onEdit={() => {
                      handleEditInterviewer(interviewer);
                    }}
                  />
                ))}
              </div>
            </>
          )}

          {/* Empty State */}
          {interviewers?.length === 0 && (
            <div className="text-center py-12">
              <p className="text-[#737373]">No interviewers found</p>
            </div>
          )}

          {/* Loading More Indicator */}
          {isLoadingMore && (
            <div className="grid grid-cols-4 gap-6 mt-6">
              {Array.from({ length: 4 }).map((_, index: number) => (
                <div
                  key={`loading-more-${index}`}
                  className="bg-white border border-[#d1d1d1] rounded p-2 flex flex-col animate-pulse"
                >
                  <div className="w-full aspect-square rounded bg-gray-200 mb-1" />
                  <div className="h-4 bg-gray-200 rounded mb-2" />
                  <div className="h-3 bg-gray-200 rounded mb-1" />
                  <div className="h-3 bg-gray-200 rounded mb-4" />
                  <div className="h-9 bg-gray-200 rounded" />
                </div>
              ))}
            </div>
          )}

          {/* Sentinel element for Intersection Observer */}
          {pagination?.nextOffset !== null &&
            !isLoading &&
            pagination?.nextOffset < pagination?.total && (
              <div ref={observerTarget} className="h-10 w-full" />
            )}
        </>
      )}

      {/* Create Interviewer Modal */}
      {isCreateModalOpen && (
        <CreateInterviewerModal
          open={isCreateModalOpen}
          onOpenChange={setIsCreateModalOpen}
          onSubmit={handleCreateInterviewer}
        />
      )}

      {/* Edit Interviewer Modal */}
      {isEditModalOpen && (
        <CreateInterviewerModal
          open={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          onSubmit={handleUpdateInterviewer}
          isEditMode={true}
          interviewerDetail={{
            name: interviewerDetail?.name || "",
            voice: interviewerDetail?.voice || "",
            description: interviewerDetail?.description || "",
            skills: interviewerDetail?.interviewerSkills || [],
            roundType: interviewerDetail?.roundType || "",
            language: interviewerDetail?.language || "",
            personality: interviewerDetail?.personality || {
              empathy: 0,
              rapport: 0,
              exploration: 0,
              speed: 0,
            },
          }}
          interviewerId={interviewerDetail?.id || undefined}
        />
      )}
    </div>
  );
}
