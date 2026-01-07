"use client";

import { useState, useEffect } from "react";
import { Plus, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { FilterDropdown } from "@/components/shared/components/filter-dropdown";
import {
  FilterState,
  FilterGroup,
} from "@/components/shared/interfaces/shared.interface";
import { interviewerService } from "../services/interviewer.services";
import {
  transformAPIResponseToInterviewers,
  transformAPIInterviewerItemToFormData,
  type APIPaginationInfo,
  type APIInterviewerItem,
} from "../utils/interviewer.utils";
import {
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
  const [appliedFilters, setAppliedFilters] = useState<FilterState>({
    roundType: [],
    language: [],
    voice: [],
  });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [interviewerDetail, setInterviewerDetail] =
    useState<InterviewerFormData | null>(null);
  const [editingInterviewerId, setEditingInterviewerId] = useState<
    string | null
  >(null);

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

  useEffect(() => {
    fetchInterviewers();
  }, [currentOffset, appliedFilters]);

  const fetchInterviewers = async () => {
    setIsLoading(true);
    setInterviewers([]);
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
        response.data,
        response.page
      );
      setInterviewers(result.interviewers);
      setPagination(result.pagination);
      // Scroll to top when page changes
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error: any) {
      setInterviewers([]);
      setPagination({
        total: 0,
        nextOffset: null,
        previousOffset: null,
        limit: PAGE_LIMIT,
      });
      toast.error(
        error?.response?.data?.message || "Failed to fetch interviewers",
        {
          duration: 8000,
        }
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateInterviewer = (data: InterviewerFormData) => {
    // Refresh the list after creating
    setCurrentOffset(0);
    fetchInterviewers();
  };

  const handleUpdateInterviewer = (data: InterviewerFormData) => {
    // Refresh the list after updating
    setCurrentOffset(0);
    fetchInterviewers();
    setIsEditModalOpen(false);
    setInterviewerDetail(null);
    setEditingInterviewerId(null);
  };

  const handleEditInterviewer = async (id: string) => {
    try {
      setEditingInterviewerId(id);
      const response = await interviewerService.getInterviewerDetail(id, {
        appId: "69521cd1c9ba83a076aac3ae",
      });
      const formData = transformAPIInterviewerItemToFormData(
        response as APIInterviewerItem
      );
      setInterviewerDetail(formData);
      setIsEditModalOpen(true);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to fetch interviewer details",
        {
          duration: 8000,
        }
      );
    }
  };

  const handleApplyFilters = (filters: FilterState) => {
    setAppliedFilters(filters);
    setCurrentOffset(0); // Reset to first page when filters are applied
  };

  const handlePreviousPage = () => {
    if (pagination.previousOffset !== null) {
      setCurrentOffset(pagination.previousOffset);
    }
  };

  const handleNextPage = () => {
    if (pagination.nextOffset !== null) {
      setCurrentOffset(pagination.nextOffset);
    }
  };

  const totalPages = Math.ceil(pagination.total / PAGE_LIMIT);
  const currentPage = Math.floor(currentOffset / PAGE_LIMIT) + 1;

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
            onChange={(e) => setSearchQuery(e.target.value)}
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
          {Array.from({ length: 8 }).map((_, index) => (
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
          {interviewers?.length > 0 && !isLoading && (
            <>
              <div className="grid grid-cols-4 gap-6">
                {interviewers?.map((interviewer) => (
                  <InterviewerCard
                    key={interviewer.id}
                    interviewer={interviewer}
                    onEdit={handleEditInterviewer}
                  />
                ))}
              </div>
            </>
          )}

          {/* Empty State */}
          {interviewers?.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <p className="text-[#737373]">No interviewers found</p>
            </div>
          )}

          {/* Pagination Controls */}
          {pagination.total > 0 && !isLoading && (
            <div className="flex items-center justify-end mt-6">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePreviousPage}
                  disabled={
                    pagination?.previousOffset === null ||
                    pagination?.previousOffset < 0 ||
                    isLoading
                  }
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>
                <div className="text-sm text-[#737373] px-4">
                  Page {currentPage} of {totalPages}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextPage}
                  disabled={
                    (pagination?.nextOffset &&
                      pagination?.nextOffset >= pagination?.total) ||
                    pagination?.nextOffset === null ||
                    isLoading
                  }
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Create Interviewer Modal */}
      <CreateInterviewerModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSubmit={handleCreateInterviewer}
      />

      {/* Edit Interviewer Modal */}
      <CreateInterviewerModal
        open={isEditModalOpen}
        onOpenChange={(open) => {
          setIsEditModalOpen(open);
          if (!open) {
            setInterviewerDetail(null);
            setEditingInterviewerId(null);
          }
        }}
        onSubmit={handleUpdateInterviewer}
        isEditMode={true}
        interviewerDetail={interviewerDetail}
        interviewerId={editingInterviewerId || undefined}
      />
    </div>
  );
}
