"use client";

import * as React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: InviteFormData) => void;
}

interface InviteFormData {
  email: string;
  role: string;
  permissions: {
    userManagement: {
      addUsers: boolean;
      editDetails: boolean;
      givePermissions: boolean;
      removeUsers: boolean;
    };
    jobPosting: {
      createJobPost: boolean;
      editJobPost: boolean;
      removeJobPost: boolean;
      trackJobPosting: boolean;
    };
    candidateManagement: {
      addCandidates: boolean;
      editCandidates: boolean;
      removeCandidates: boolean;
      downloadResume: boolean;
    };
    interviewScheduling: {
      createInterview: boolean;
      scheduleInterview: boolean;
      reviewFeedbacks: boolean;
      trackProgress: boolean;
    };
  };
}

const initialPermissions: InviteFormData["permissions"] = {
  userManagement: {
    addUsers: false,
    editDetails: false,
    givePermissions: false,
    removeUsers: false,
  },
  jobPosting: {
    createJobPost: false,
    editJobPost: false,
    removeJobPost: false,
    trackJobPosting: false,
  },
  candidateManagement: {
    addCandidates: false,
    editCandidates: false,
    removeCandidates: false,
    downloadResume: false,
  },
  interviewScheduling: {
    createInterview: false,
    scheduleInterview: false,
    reviewFeedbacks: false,
    trackProgress: false,
  },
};

export function InviteTeamMemberModal({
  isOpen,
  onClose,
  onSubmit,
}: InviteModalProps) {
  const [email, setEmail] = React.useState("");
  const [role, setRole] = React.useState("");

  const handleClose = () => {
    setEmail("");
    setRole("");
    onClose();
  };

  const handleSubmit = () => {
    onSubmit({ email, role, permissions: initialPermissions });
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/30 z-40" onClick={handleClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-[10px] shadow-xl border border-[#e5e5e5] w-full max-w-[779px] p-6 relative">
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute right-4 top-4 text-[#737373] hover:text-[#0a0a0a] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-[#0a0a0a]">
              Invite team member
            </h2>
            <p className="text-sm text-[#737373]">
              Send an invitation to join your team
            </p>
          </div>

          <div className="space-y-4">
            <p className="text-sm font-medium mb-2">Email</p>
            <Input
              type="email"
              placeholder="rohan@gmail.com"
              value={email}
              onChange={(e) => setEmail(e?.target?.value)}
            />

            <p className="text-sm font-medium mb-2">Role</p>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="member">Member</SelectItem>
              </SelectContent>
            </Select>

            {/* Footer */}
            <div className="flex justify-end pt-4">
              <Button onClick={handleSubmit} disabled={!email || !role}>
                Send invite
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
