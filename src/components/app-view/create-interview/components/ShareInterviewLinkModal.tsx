"use client";

import { useState, useMemo } from "react";
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
import { Search, Mail, Phone } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Applicant {
  id: string;
  name: string;
  email: string;
  phone: string;
}

interface ShareInterviewLinkModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  interviewLink: string;
}

// Mock applicants data - in real app this would come from props or API
const mockApplicants: Applicant[] = [
  {
    id: "1",
    name: "Sarthak Rathee",
    email: "sarthak@gmail.com",
    phone: "9876543210",
  },
  {
    id: "2",
    name: "Sarthak Rathee",
    email: "sarthak@gmail.com",
    phone: "9876543210",
  },
  {
    id: "3",
    name: "Sarthak Rathee",
    email: "sarthak@gmail.com",
    phone: "9876543210",
  },
  {
    id: "4",
    name: "Sarthak Rathee",
    email: "sarthak@gmail.com",
    phone: "9876543210",
  },
  {
    id: "5",
    name: "Sarthak Rathee",
    email: "sarthak@gmail.com",
    phone: "9876543210",
  },
  {
    id: "6",
    name: "Sarthak Rathee",
    email: "sarthak@gmail.com",
    phone: "9876543210",
  },
  {
    id: "7",
    name: "Sarthak Rathee",
    email: "sarthak@gmail.com",
    phone: "9876543210",
  },
  {
    id: "8",
    name: "Sarthak Rathee",
    email: "sarthak@gmail.com",
    phone: "9876543210",
  },
  {
    id: "9",
    name: "Sarthak Rathee",
    email: "sarthak@gmail.com",
    phone: "9876543210",
  },
  {
    id: "10",
    name: "Sarthak Rathee",
    email: "sarthak@gmail.com",
    phone: "9876543210",
  },
];

export function ShareInterviewLinkModal({
  open,
  onOpenChange,
  interviewLink,
}: ShareInterviewLinkModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedApplicants, setSelectedApplicants] = useState<Set<string>>(
    new Set()
  );
  const [linkValidity, setLinkValidity] = useState("");
  const [notes, setNotes] = useState("");

  const filteredApplicants = useMemo(() => {
    if (!searchQuery.trim()) return mockApplicants;
    const query = searchQuery.toLowerCase();
    return mockApplicants.filter(
      (applicant) =>
        applicant.name.toLowerCase().includes(query) ||
        applicant.email.toLowerCase().includes(query) ||
        applicant.phone.includes(query)
    );
  }, [searchQuery]);

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

  const handleShare = () => {
    // Handle share logic here
    console.log("Sharing interview link:", {
      interviewLink,
      selectedApplicants: Array.from(selectedApplicants),
      linkValidity,
      notes,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[779px] sm:max-w-[779px] sm:w-[779px] p-6 gap-4 max-h-[90vh] overflow-y-auto bg-white border border-[#e5e5e5] rounded-[10px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-2px_rgba(0,0,0,0.1)] [&>button]:top-[15px] [&>button]:right-[15px]">
        <DialogHeader className="gap-1.5 text-left pb-0">
          <DialogTitle className="text-lg font-semibold text-[#0a0a0a] leading-none">
            Share interview link
          </DialogTitle>
          <DialogDescription className="text-sm text-[#737373] leading-5">
            Select Applicants to share link
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          {/* Applicants Section */}
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-medium text-[#0a0a0a] leading-none">
              Applicants <span className="text-[#b91c1c]">*</span>
            </Label>

            {/* Search Input */}
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

            {/* Applicants List */}
            <div className="border border-[#e5e5e5] rounded-[10px] p-4 max-h-[300px] overflow-y-auto">
              <div className="flex flex-col gap-0">
                {/* Select All */}
                <div className="flex items-center gap-3 py-2 border-b border-[#e5e5e5] last:border-b-0">
                  <Checkbox
                    checked={allSelected}
                    onCheckedChange={handleSelectAll}
                    className="border-[#e5e5e5] data-[state=checked]:bg-[#02563d] data-[state=checked]:border-[#02563d]"
                  />
                  <span className="text-sm text-[#0a0a0a] font-normal">
                    Select all
                  </span>
                  <Badge
                    variant="secondary"
                    className="ml-auto bg-[#e5e5e5] text-[#0a0a0a] text-xs px-2 py-0 h-[18px] font-normal rounded-full"
                  >
                    {mockApplicants.length} Applicants
                  </Badge>
                </div>

                {/* Individual Applicants */}
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
                      <span className="text-sm text-[#0a0a0a] font-normal">
                        {applicant.name}
                      </span>
                      <div className="flex items-center gap-4 flex-wrap">
                        <div className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-[#737373] shrink-0" />
                          <span className="text-xs text-[#737373]">
                            {applicant.email}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-[#737373] shrink-0" />
                          <span className="text-xs text-[#737373]">
                            {applicant.phone}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Link Validity Section */}
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-medium text-[#0a0a0a] leading-none">
              Link validity <span className="text-[#b91c1c]">*</span>
            </Label>
            <Select value={linkValidity} onValueChange={setLinkValidity}>
              <SelectTrigger className="w-full h-9 shadow-[0px_1px_2px_0px_rgba(2,86,61,0.12)] border-[#e5e5e5]">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1day">1 Day</SelectItem>
                <SelectItem value="3days">3 Days</SelectItem>
                <SelectItem value="7days">7 Days</SelectItem>
                <SelectItem value="30days">30 Days</SelectItem>
                <SelectItem value="never">Never Expires</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Notes Section */}
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-medium text-[#0a0a0a] leading-none">
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

        {/* Footer with Share Button */}
        <div className="flex justify-end pt-2">
          <Button
            type="button"
            onClick={handleShare}
            disabled={selectedApplicants.size === 0 || !linkValidity}
            className="h-9 px-4 bg-[#02563d] hover:bg-[#02563d]/90 text-white font-semibold rounded-[10px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] disabled:opacity-50"
          >
            Share
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
