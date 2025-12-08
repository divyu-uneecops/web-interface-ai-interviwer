"use client";

import { useState } from "react";
import { Plus, Search, ListFilter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  InterviewerCard,
  type Interviewer,
} from "@/components/dashboard/interviewer-card";
import {
  CreateInterviewerModal,
  type InterviewerFormData,
} from "@/components/dashboard/create-interviewer-modal";

// Sample data - in real app this would come from an API
const sampleInterviewers: Interviewer[] = [
  {
    id: "1",
    name: "Alex Mitchell",
    description: "Creates comfortable environment for early-career Applicants.",
    imageUrl: "/interviewer-male.jpg",
    roundType: "Behavioural round",
  },
  {
    id: "2",
    name: "Alex Mitchell",
    description: "Creates comfortable environment for early-career Applicants.",
    imageUrl: "/interviewer-female.jpg",
    roundType: "Behavioural round",
  },
  {
    id: "3",
    name: "Alex Mitchell",
    description: "Creates comfortable environment for early-career Applicants.",
    imageUrl: "/interviewer-female.jpg",
    roundType: "Behavioural round",
  },
  {
    id: "4",
    name: "Alex Mitchell",
    description: "Creates comfortable environment for early-career Applicants.",
    imageUrl: "/interviewer-male.jpg",
    roundType: "Behavioural round",
  },
  {
    id: "5",
    name: "Alex Mitchell",
    description: "Creates comfortable environment for early-career Applicants.",
    imageUrl: "/interviewer-female.jpg",
    roundType: "Behavioural round",
  },
  {
    id: "6",
    name: "Alex Mitchell",
    description: "Creates comfortable environment for early-career Applicants.",
    imageUrl: "/interviewer-male.jpg",
    roundType: "Behavioural round",
  },
  {
    id: "7",
    name: "Alex Mitchell",
    description: "Creates comfortable environment for early-career Applicants.",
    imageUrl: "/interviewer-female.jpg",
    roundType: "Behavioural round",
  },
  {
    id: "8",
    name: "Alex Mitchell",
    description: "Creates comfortable environment for early-career Applicants.",
    imageUrl: "/interviewer-male.jpg",
    roundType: "Behavioural round",
  },
];

export default function InterviewersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [interviewers, setInterviewers] =
    useState<Interviewer[]>(sampleInterviewers);

  const handleCreateInterviewer = (data: InterviewerFormData) => {
    // Create new interviewer - in real app this would call an API
    const newInterviewer: Interviewer = {
      id: `new-${Date.now()}`,
      name: data.name || "New Interviewer",
      description: data.about || "AI Interviewer",
      imageUrl: "/interviewer-male.jpg",
      roundType:
        data.roundType === "behavioural" ? "Behavioural round" : data.roundType,
    };

    setInterviewers((prev) => [newInterviewer, ...prev]);
    console.log("New interviewer created:", data);
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
      {filteredInterviewers?.length === 0 && (
        <div className="text-center py-12">
          <p className="text-[#737373]">No interviewers found</p>
        </div>
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
