"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  ListFilter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  InterviewerCard,
  type Interviewer,
} from "@/components/dashboard/interviewer/components/interviewer-card";
import {
  CreateInterviewerModal,
  type InterviewerFormData,
} from "@/components/dashboard/interviewer/components/create-interviewer-modal";
import { interviewerService } from "../services/interviewer.services";
import {
  transformAPIResponseToInterviewers,
  type APIPaginationInfo,
} from "../utils/interviewer.utils";
import { toast } from "sonner";

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

  useEffect(() => {
    fetchInterviewers();
  }, [currentOffset, searchQuery]);

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
          $and: [],
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

  const handleEditInterviewer = (id: string) => {
    console.log("Edit interviewer:", id);
    // TODO: Implement edit functionality
  };

  const filteredInterviewers = interviewers.filter(
    (interviewer) =>
      interviewer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      interviewer.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        <h2 className="text-xl font-bold text-black">AI Interviewers</h2>

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
          <div className="grid grid-cols-4 gap-6">
            {filteredInterviewers?.map((interviewer) => (
              <InterviewerCard
                key={interviewer.id}
                interviewer={interviewer}
                onEdit={handleEditInterviewer}
              />
            ))}
          </div>

          {/* Empty State */}
          {filteredInterviewers?.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <p className="text-[#737373]">No interviewers found</p>
            </div>
          )}

          {/* Pagination Controls */}
          {pagination.total > 0 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-[#737373]">
                Showing {currentOffset + 1} to{" "}
                {Math.min(currentOffset + PAGE_LIMIT, pagination.total)} of{" "}
                {pagination.total} interviewers
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePreviousPage}
                  disabled={pagination.previousOffset === null || isLoading}
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
                  disabled={pagination.nextOffset === null || isLoading}
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
    </div>
  );
}
