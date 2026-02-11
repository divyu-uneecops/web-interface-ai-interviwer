"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Search, Mail, Phone, Copy } from "lucide-react";
import { generateInterviewLink } from "@/components/app-view/create-interview/constants";
import { Badge } from "@/components/ui/badge";
import {
  Round,
  Applicant,
} from "@/components/app-view/job/interfaces/job.interface";
import { jobService } from "@/components/app-view/job/services/job.service";
import { transformAPIResponseToApplicants } from "@/components/app-view/job/utils/job.utils";
import { toast } from "sonner";

const PAGE_LIMIT = 12;
const SEARCH_DEBOUNCE_MS = 400;

export interface ScheduleInterviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  round: Round | null;
  jobId: string;
  jobTitle?: string;
  onSuccess?: () => void;
}

type PaginationState = {
  total: number;
  nextOffset: number | null;
  previousOffset: number | null;
  limit: number;
};

const LINK_VALIDITY_OPTIONS = [
  { value: "1day", label: "1 Day" },
  { value: "3days", label: "3 Days" },
  { value: "7days", label: "7 Days" },
  { value: "30days", label: "30 Days" },
];

const COPY_FEEDBACK_MS = 2000;

export function ScheduleInterviewDialog({
  open,
  onOpenChange,
  round,
  jobId,
  jobTitle = "",
  onSuccess,
}: ScheduleInterviewDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [selectedApplicants, setSelectedApplicants] = useState<Set<string>>(
    new Set()
  );
  const [linkValidity, setLinkValidity] = useState("");
  const [notes, setNotes] = useState("");
  const [interviewLink, setInterviewLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [isLoadingApplicants, setIsLoadingApplicants] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentOffset, setCurrentOffset] = useState(0);
  const [pagination, setPagination] = useState<PaginationState>({
    total: 0,
    nextOffset: null,
    previousOffset: null,
    limit: PAGE_LIMIT,
  });
  const listContainerRef = useRef<HTMLDivElement>(null);

  // Reset state when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setSearchQuery("");
      setSearchKeyword("");
      setSelectedApplicants(new Set());
      setLinkValidity("");
      setNotes("");
      setInterviewLink("");
      setCopied(false);
      setApplicants([]);
      setCurrentOffset(0);
      setPagination({
        total: 0,
        nextOffset: null,
        previousOffset: null,
        limit: PAGE_LIMIT,
      });
    }
  }, [open]);

  // Generate interview link when dialog opens (for this round/job)
  useEffect(() => {
    if (open && jobId && round) {
      setInterviewLink(generateInterviewLink());
    }
  }, [open, jobId, round?.id]);

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

  // Fetch applicants when dialog opens (initial load) or search changes
  useEffect(() => {
    if (!open || !jobId) return;
    setCurrentOffset(0);
    fetchApplicants(0, true);
  }, [open, jobId, searchKeyword]);

  // Load more when offset changes to a positive value (scroll loaded next page)
  useEffect(() => {
    if (currentOffset > 0) {
      fetchApplicants(currentOffset, false);
    }
  }, [currentOffset]);

  // Scroll listener for lazy loading (same pattern as interviewer-list)
  useEffect(() => {
    const container = listContainerRef?.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;
      const totalCount =
        typeof pagination.total === "number" ? pagination.total : 0;

      if (
        scrollPercentage >= 0.8 &&
        pagination.nextOffset !== null &&
        pagination.nextOffset < totalCount &&
        !isLoadingApplicants &&
        !isLoadingMore
      ) {
        setCurrentOffset(pagination.nextOffset);
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [
    pagination.nextOffset,
    pagination.total,
    isLoadingApplicants,
    isLoadingMore,
  ]);

  const fetchApplicants = async (
    offset: number,
    isInitialLoad: boolean = true
  ) => {
    if (!jobId) return;

    if (isInitialLoad) {
      setIsLoadingApplicants(true);
      setApplicants([]);
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
      const paramsQuery: Record<string, any> = {
        limit: PAGE_LIMIT,
        offset,
        ...(searchKeyword ? { query: searchKeyword } : {}),
      };
      const jobIdFilter = {
        key: "#.records.jobID",
        operator: "$eq",
        value: jobId,
        type: "text",
      };
      const response = await jobService.getApplicants(paramsQuery, {
        filters: { $and: [jobIdFilter] },
        appId: "69521cd1c9ba83a076aac3ae",
      });
      const result = transformAPIResponseToApplicants(
        response?.data ?? [],
        response?.page
      );
      const totalRaw = result?.pagination?.total;
      const totalCount =
        Array.isArray(totalRaw) && totalRaw.length > 0
          ? totalRaw[0]
          : typeof totalRaw === "number"
          ? totalRaw
          : 0;

      if (isInitialLoad) {
        setApplicants(result.applicants);
      } else {
        setApplicants((prev) => [...prev, ...result.applicants]);
      }
      setPagination({
        total: totalCount,
        nextOffset: result?.pagination?.nextOffset ?? null,
        previousOffset: result?.pagination?.previousOffset ?? null,
        limit: result?.pagination?.limit ?? PAGE_LIMIT,
      });
    } catch (error: any) {
      if (isInitialLoad) {
        setApplicants([]);
        setPagination({
          total: 0,
          nextOffset: null,
          previousOffset: null,
          limit: PAGE_LIMIT,
        });
      }
      toast.error(
        error?.response?.data?.message ?? "Failed to fetch applicants",
        { duration: 8000 }
      );
    } finally {
      setIsLoadingApplicants(false);
      setIsLoadingMore(false);
    }
  };

  const filteredApplicants = useMemo(() => {
    if (!searchQuery.trim()) return applicants;
    const query = searchQuery.toLowerCase();
    return applicants.filter(
      (applicant) =>
        (applicant?.name ?? "").toLowerCase().includes(query) ||
        (applicant?.email ?? "").toLowerCase().includes(query) ||
        (applicant?.contact ?? "").toLowerCase().includes(query)
    );
  }, [applicants, searchQuery]);

  const allSelected = useMemo(() => {
    return (
      filteredApplicants.length > 0 &&
      filteredApplicants.every((app) => selectedApplicants.has(app.id))
    );
  }, [filteredApplicants, selectedApplicants]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const newSelected = new Set(selectedApplicants);
      filteredApplicants.forEach((app) => newSelected.add(app.id));
      setSelectedApplicants(newSelected);
    } else {
      const newSelected = new Set(selectedApplicants);
      filteredApplicants.forEach((app) => newSelected.delete(app.id));
      setSelectedApplicants(newSelected);
    }
  };

  const handleApplicantToggle = (applicantId: string, checked: boolean) => {
    const newSelected = new Set(selectedApplicants);
    if (checked) {
      newSelected.add(applicantId);
    } else {
      newSelected.delete(applicantId);
    }
    setSelectedApplicants(newSelected);
  };

  const handleCopyLink = async () => {
    if (!interviewLink) return;
    try {
      await navigator.clipboard.writeText(interviewLink);
      setCopied(true);
      toast.success("Link copied to clipboard");
      setTimeout(() => setCopied(false), COPY_FEEDBACK_MS);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const handleSchedule = () => {
    // TODO: integrate with schedule interview API when available
    onSuccess?.();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-[779px] sm:max-w-[779px] sm:w-[779px] p-6 gap-4 max-h-[90vh] overflow-y-auto bg-white border border-[#e5e5e5] rounded-[10px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-2px_rgba(0,0,0,0.1)] [&>button]:top-[15px] [&>button]:right-[15px]"
        showCloseButton={true}
      >
        <DialogHeader className="gap-[6px] text-left pb-0">
          <DialogTitle className="text-[18px] font-semibold text-[#0a0a0a] leading-[1.2]">
            Share interview link
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          {/* Interview Link Section — pixel-perfect: explicit px values */}
          {interviewLink && (
            <div style={{ width: "100%" }}>
              <div
                style={{
                  backgroundColor: "#f5f5f5",
                  border: "1px solid #dcdcdc",
                  borderRadius: 10,
                  padding: 16,
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                <label
                  htmlFor="schedule-interview-link"
                  style={{
                    fontSize: 14,
                    fontWeight: 400,
                    color: "#0a0a0a",
                    lineHeight: "20px",
                    display: "block",
                    textAlign: "left",
                  }}
                >
                  Interview link
                </label>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    minHeight: 20,
                  }}
                >
                  <p
                    id="schedule-interview-link"
                    style={{
                      flex: 1,
                      fontSize: 14,
                      fontWeight: 400,
                      color: "#0a0a0a",
                      lineHeight: "20px",
                      margin: 0,
                      minWidth: 0,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      textAlign: "left",
                    }}
                    aria-label={`Interview link: ${interviewLink}`}
                  >
                    {interviewLink}
                  </p>
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    aria-label={copied ? "Link copied" : "Copy interview link"}
                    style={{
                      flexShrink: 0,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 6,
                      height: 32,
                      paddingLeft: 12,
                      paddingRight: 12,
                      paddingTop: 6,
                      paddingBottom: 6,
                      fontSize: 14,
                      fontWeight: 500,
                      color: "#0a0a0a",
                      backgroundColor: "#e5e5e5",
                      border: "1px solid #e5e5e5",
                      borderRadius: 6,
                      cursor: "pointer",
                      outline: "none",
                    }}
                    className="hover:!bg-[#d5d5d5] focus:ring-2 focus:ring-[#02563d] focus:ring-offset-2 focus:outline-none"
                  >
                    <Copy
                      style={{ width: 16, height: 16, flexShrink: 0 }}
                      aria-hidden="true"
                    />
                    <span>{copied ? "Copied!" : "Copy link"}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Applicants Section */}
          <div className="flex flex-col gap-2">
            <Label className="text-[14px] font-medium text-[#0a0a0a] leading-[20px]">
              Applicants <span className="text-[#b91c1c]">*</span>
            </Label>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-[10.667px] w-[10.667px] text-[#737373]" />
              <Input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 shadow-[0px_1px_2px_0px_rgba(2,86,61,0.12)] border-[#e5e5e5]"
              />
            </div>

            <div
              ref={listContainerRef}
              className="border border-[#e5e5e5] rounded-[10px] p-4 max-h-[300px] overflow-y-auto"
              style={{ scrollbarWidth: "thin" }}
            >
              {isLoadingApplicants ? (
                <div className="py-8 text-center text-[14px] text-[#737373] leading-[20px]">
                  Loading applicants…
                </div>
              ) : (
                <div className="flex flex-col gap-0">
                  <div className="flex items-center gap-3 py-2 border-b border-[#e5e5e5] last:border-b-0">
                    <Checkbox
                      checked={allSelected}
                      onCheckedChange={handleSelectAll}
                      className="border-[#e5e5e5] data-[state=checked]:bg-[#02563d] data-[state=checked]:border-[#02563d]"
                    />
                    <span className="text-[14px] text-[#0a0a0a] font-normal leading-[20px]">
                      Select all
                    </span>
                    <Badge
                      variant="secondary"
                      className="ml-auto bg-[#e5e5e5] text-[#0a0a0a] text-[12px] px-2 py-0 h-[18px] font-normal rounded-full leading-[18px]"
                    >
                      {pagination.total > 0
                        ? pagination.total
                        : applicants.length}{" "}
                      Applicants
                    </Badge>
                  </div>

                  {filteredApplicants.map((applicant) => (
                    <div
                      key={applicant.id}
                      className="flex items-center gap-3 py-2 border-b border-[#e5e5e5] last:border-b-0"
                    >
                      <Checkbox
                        checked={selectedApplicants.has(applicant.id)}
                        onCheckedChange={(checked) =>
                          handleApplicantToggle(applicant.id, checked === true)
                        }
                        className="border-[#e5e5e5] data-[state=checked]:bg-[#02563d] data-[state=checked]:border-[#02563d]"
                      />
                      <div className="flex flex-col gap-1 flex-1 min-w-0">
                        <span className="text-[14px] text-[#0a0a0a] font-normal leading-[20px]">
                          {applicant.name || "—"}
                        </span>
                        <div className="flex items-center gap-4 flex-wrap">
                          {applicant.email && (
                            <div className="flex items-center gap-[6px]">
                              <Mail className="w-[14px] h-[14px] text-[#737373] shrink-0" />
                              <span className="text-[12px] text-[#737373] leading-[16px]">
                                {applicant.email}
                              </span>
                            </div>
                          )}
                          {applicant.contact && (
                            <div className="flex items-center gap-[6px]">
                              <Phone className="w-[14px] h-[14px] text-[#737373] shrink-0" />
                              <span className="text-[12px] text-[#737373] leading-[16px]">
                                {applicant.contact}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {filteredApplicants.length === 0 && !isLoadingApplicants && (
                    <div className="py-6 text-center text-[14px] text-[#737373] leading-[20px]">
                      No applicants found
                    </div>
                  )}

                  {isLoadingMore && (
                    <div className="py-3 text-center text-[14px] text-[#737373] leading-[20px]">
                      Loading more…
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Link Validity Section */}
          <div className="flex flex-col gap-2">
            <Label className="text-[14px] font-medium text-[#0a0a0a] leading-[20px]">
              Link validity <span className="text-[#b91c1c]">*</span>
            </Label>
            <Select value={linkValidity} onValueChange={setLinkValidity}>
              <SelectTrigger className="w-full h-9 shadow-[0px_1px_2px_0px_rgba(2,86,61,0.12)] border-[#e5e5e5]">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {LINK_VALIDITY_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Notes Section */}
          <div className="flex flex-col gap-2">
            <Label className="text-[14px] font-medium text-[#0a0a0a] leading-[20px]">
              Notes
            </Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Write note for Applicant here...."
              className="min-h-[103px] shadow-[0px_1px_2px_0px_rgba(2,86,61,0.12)] border-[#e5e5e5]"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button
            type="button"
            onClick={handleSchedule}
            disabled={selectedApplicants.size === 0 || !linkValidity}
            className="h-9 px-4 text-[14px] font-semibold leading-[20px] bg-[#02563d] hover:bg-[#02563d]/90 text-white rounded-[10px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] disabled:opacity-50"
          >
            Schedule
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
