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
import { AppFormIds } from "@/store/app/app.thunks";

const PAGE_LIMIT = 12;
const SEARCH_DEBOUNCE_MS = 400;

export interface ScheduleInterviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: AppFormIds;
  round: Round | null;
  jobId: string;
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

// Interview form instance (forminstances) constants — property IDs from form schema

const SCHEDULE_INTERVIEW_PROPERTY_IDS = [
  "6960bae9c9ba83a076aac8a4",
  "6960bb55c9ba83a076aac8a6",
  "6960bb8cc9ba83a076aac8a7",
  "6960bc56c9ba83a076aac8aa",
  "6960bcfcc9ba83a076aac8ae",
  "6960bd1ec9ba83a076aac8af",
  "6960c795c9ba83a076aac8b1",
  "6968b19ac90d705a920ddbec",
  "6968b256c90d705a920ddbf0",
  "6968b28bc90d705a920ddbf1",
  "6968b2e2c90d705a920ddbf2",
  "69732b4c1641f4dea8f6600a",
  "6989bedefdb0e9975c9f5e8e",
  "6989bf0abd6acbd1fd13d199",
  "6989bf73dfb659edb0bec752",
  "6989bfc7d2fcbec3ff44e4aa",
  "6989c0cadfb659edb0bec755",
  "698d5c25b598b586ab9c9589",
  "698d5c47bd6acbd1fd13d1ac",
  "698d5ce9bb2ef527cbb8244e",
  "698d5d0d2d28552b6f555924",
];

function mapLinkValidityToV2(value: string): string {
  const opt = LINK_VALIDITY_OPTIONS.find((o) => o.value === value);
  return opt ? opt.label : value;
}

function buildScheduleInterviewPayload(
  applicant: Applicant,
  options: {
    roundId: string;
    interviewerId: string;
    formUser: string[];
    jobId: string;
    linkValidityV2: string;
    notes: string;
    interviewLink: string;
    createdAt: number;
  },
  formId: string
): Record<string, unknown> {
  const {
    roundId,
    interviewerId,
    formUser,
    jobId,
    linkValidityV2,
    notes,
    interviewLink,
    createdAt,
  } = options;

  const categoryScoresValue = [
    { propertyId: "6989c016dd395e99bbbb74a8", key: "technical" },
    { propertyId: "6989c051dfb659edb0bec753", key: "communication" },
    { propertyId: "6989c0702d28552b6f555906", key: "problemSolving" },
    { propertyId: "6989c08cdfb659edb0bec754", key: "leadership" },
    { propertyId: "6989c0a41fccaff8d0e0bf2e", key: "cultureFit" },
  ];

  const values = [
    {
      propertyId: "6960bae9c9ba83a076aac8a4",
      key: "applicantEmail",
      value: applicant?.id,
    },
    {
      propertyId: "6960bb55c9ba83a076aac8a6",
      key: "roundName",
      value: roundId,
    },
    {
      propertyId: "6960bb8cc9ba83a076aac8a7",
      key: "interviewerName",
      value: interviewerId,
    },
    {
      propertyId: "6960bc56c9ba83a076aac8aa",
      key: "status",
      value: "Scheduled",
    },
    { propertyId: "6960bcfcc9ba83a076aac8ae", key: "score", value: 0 },
    {
      propertyId: "6960bd1ec9ba83a076aac8af",
      key: "formUser",
      value: formUser,
    },
    {
      propertyId: "6960c795c9ba83a076aac8b1",
      key: "jobTitle",
      value: jobId,
    },
    { propertyId: "6968b19ac90d705a920ddbec", key: "jobId", value: jobId },
    { propertyId: "6968b256c90d705a920ddbf0", key: "roundId", value: roundId },
    {
      propertyId: "6968b28bc90d705a920ddbf1",
      key: "interviewerId",
      value: interviewerId,
    },
    {
      propertyId: "6968b2e2c90d705a920ddbf2",
      key: "applicantId",
      value: applicant?.id,
    },
    {
      propertyId: "6989c0cadfb659edb0bec755",
      key: "categoryScores",
      value: categoryScoresValue,
    },
    {
      propertyId: "698d5c25b598b586ab9c9589",
      key: "v2LinkValidity",
      value: linkValidityV2,
    },
    { propertyId: "698d5c47bd6acbd1fd13d1ac", key: "v2Notes", value: notes },
    {
      propertyId: "698d5ce9bb2ef527cbb8244e",
      key: "createdAt",
      value: createdAt,
    },
    {
      propertyId: "698d5d0d2d28552b6f555924",
      key: "interviewLink",
      value: interviewLink,
    },
  ];

  return {
    values,
    propertyIds: SCHEDULE_INTERVIEW_PROPERTY_IDS,
    flows: [{ stageId: "1", status: "PENDING" }],
    status: "PENDING",
    formId: formId,
  };
}

export function ScheduleInterviewDialog({
  open,
  onOpenChange,
  form,
  round,
  jobId,
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
  const [interviewLink, setInterviewLink] = useState(
    `${window.location.protocol}//${window.location.host}/call/${round?.id}`
  );
  const [copied, setCopied] = useState(false);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [isLoadingApplicants, setIsLoadingApplicants] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const handleSchedule = async () => {
    if (!round || selectedApplicants.size === 0 || !linkValidity) return;

    const selectedApplicantRecords = applicants.filter((a: Applicant) =>
      selectedApplicants.has(a?.id)
    );
    if (selectedApplicantRecords.length === 0) {
      toast.error("No selected applicants found", { duration: 8000 });
      return;
    }

    setIsSubmitting(true);
    const linkValidityV2 = mapLinkValidityToV2(linkValidity);
    const createdAt = Math.floor(Date.now() / 1000);

    try {
      const payloads = selectedApplicantRecords.map((applicant) =>
        buildScheduleInterviewPayload(
          applicant,
          {
            roundId: round?.id || "",
            interviewerId: round?.interviewerID ?? "",
            formUser: ["6936a4d92276e3fc3ac7b13b"],
            jobId,
            linkValidityV2,
            notes,
            interviewLink,
            createdAt,
          },
          form?.["createInterviews"]
        )
      );

      await Promise.all(
        payloads.map((payload) =>
          jobService.createInterviewFormInstance(payload as Record<string, any>)
        )
      );

      toast.success(
        `Interview scheduled for ${selectedApplicantRecords.length} applicant(s)`,
        { duration: 8000 }
      );
      onSuccess?.();
      onOpenChange(false);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ?? "Failed to schedule interview(s)",
        { duration: 8000 }
      );
    } finally {
      setIsSubmitting(false);
    }
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
                  backgroundColor: "#F0F5F3",
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
                    color: "#4A5565",
                    lineHeight: "20px",
                    display: "block",
                    textAlign: "left",
                  }}
                >
                  Interview Link
                </label>
                <div
                  style={{
                    display: "flex",
                    backgroundColor: "#FFF",
                    padding: `8px 12px`,
                    alignItems: "center",
                  }}
                >
                  <p
                    id="schedule-interview-link"
                    style={{
                      flex: 1,
                      fontSize: 14,
                      fontWeight: 400,
                      color: "#364153",
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

                  <div
                    className="flex items-center gap-2 text-[#02563D] cursor-pointer"
                    onClick={handleCopyLink}
                  >
                    <Copy
                      style={{ width: 16, height: 16, flexShrink: 0 }}
                      aria-hidden="true"
                    />
                    <span>{copied ? "Copied!" : "Copy link"}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Applicants Section */}
          <div className="flex flex-col gap-4">
            <div className="text-[14px] text-[#0A0A0A] leading-[14px] font-bold">
              Select Applicants to share link
            </div>

            <Label className="text-[14px] font-medium text-[#0A0A0A] leading-[14px]">
              Applicants <span className="text-[#b91c1c]">*</span>
            </Label>

            <div className="w-full flex items-center gap-2 px-3 py-2.5 border-b border-[#e5e5e5]">
              <Search className="w-4 h-4 text-[#737373]" />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 text-sm text-[#737373] bg-transparent border-0 outline-none placeholder:text-[#737373]"
              />
            </div>

            <div
              ref={listContainerRef}
              className="max-h-[300px] overflow-y-auto bg-[#F5F5F5] p-[10px]"
              style={{ scrollbarWidth: "thin" }}
            >
              {isLoadingApplicants ? (
                <div className="py-8 text-center text-[14px] text-[#737373] leading-[20px]">
                  Loading applicants…
                </div>
              ) : (
                <div className="flex flex-col gap-0">
                  <div className="flex items-center pb-[10px] border-b border-[#e5e5e5] justify-between">
                    <div className="flex gap-3">
                      <Checkbox
                        checked={allSelected}
                        onCheckedChange={handleSelectAll}
                        className="border-[#e5e5e5] data-[state=checked]:bg-[#02563d] data-[state=checked]:border-[#02563d]"
                      />
                      <span className="text-[14px] text-[#0A0A0A] font-medium leading-[14px]">
                        Select all
                      </span>
                    </div>
                    <div>
                      <Badge
                        variant="secondary"
                        className="bg-[#e5e5e5] text-[#0a0a0a] text-[12px] px-2 py-0  font-normal rounded-full leading-[16px]"
                      >
                        {pagination.total > 0
                          ? pagination.total
                          : applicants.length}{" "}
                        Applicants
                      </Badge>
                    </div>
                  </div>

                  {filteredApplicants.map((applicant) => (
                    <div
                      key={applicant?.id}
                      className="flex items-center py-2 justify-between"
                    >
                      <div className="flex gap-3">
                        <Checkbox
                          checked={selectedApplicants.has(applicant?.id)}
                          onCheckedChange={(checked) =>
                            handleApplicantToggle(
                              applicant?.id,
                              checked === true
                            )
                          }
                          className="border-[#e5e5e5] data-[state=checked]:bg-[#02563d] data-[state=checked]:border-[#02563d]"
                        />
                        <span className="text-[14px] text-[#0a0a0a] font-normal leading-[20px]">
                          {applicant.name || "—"}
                        </span>
                      </div>

                      <div className="flex gap-4 flex-wrap">
                        {applicant.email && (
                          <div className="flex items-center gap-[6px]">
                            <Mail className="w-[14px] h-[14px] text-[#737373] shrink-0" />
                            <span className="text-[14px] text-[#737373] leading-[20px]">
                              {applicant.email}
                            </span>
                          </div>
                        )}
                        {applicant.contact && (
                          <div className="flex items-center gap-[6px]">
                            <Phone className="w-[14px] h-[14px] text-[#737373] shrink-0" />
                            <span className="text-[14px] text-[#737373] leading-[20px]">
                              {applicant.contact}
                            </span>
                          </div>
                        )}
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
            disabled={
              selectedApplicants.size === 0 || !linkValidity || isSubmitting
            }
            className="h-9 px-4 text-[14px] font-semibold leading-[20px] bg-[#02563d] hover:bg-[#02563d]/90 text-white rounded-[10px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] disabled:opacity-50"
          >
            {isSubmitting ? "Scheduling..." : "Schedule"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
