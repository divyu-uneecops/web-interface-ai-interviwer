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
import { Switch } from "@/components/ui/switch";

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
  const [step, setStep] = React.useState<1 | 2>(1);
  const [email, setEmail] = React.useState("");
  const [role, setRole] = React.useState("");
  const [permissions, setPermissions] =
    React.useState<InviteFormData["permissions"]>(initialPermissions);

  const handleClose = () => {
    setStep(1);
    setEmail("");
    setRole("");
    setPermissions(initialPermissions);
    onClose();
  };

  const handleNextStep = () => {
    if (email && role) {
      setStep(2);
    }
  };

  const handleSubmit = () => {
    onSubmit({ email, role, permissions });
    handleClose();
  };

  const updatePermission = (
    category: keyof typeof permissions,
    key: string,
    value: boolean,
  ) => {
    setPermissions((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }));
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
              {step === 1
                ? "Send an invitation to join your team"
                : "Selection permissions for the members"}
            </p>
          </div>

          {step === 1 ? (
            /* Step 1: Basic Details */
            <div className="space-y-4">
              <p className="text-sm font-bold text-[#0a0a0a]">
                Basic job details
              </p>

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
                <Button onClick={handleNextStep} disabled={!email || !role}>
                  Select permissions
                </Button>
              </div>
            </div>
          ) : (
            /* Step 2: Permissions */
            <div className="space-y-4">
              <p className="text-sm font-bold text-[#0a0a0a]">Permissions</p>

              <div className="px-4 space-y-4">
                {/* Row 1: User Management & Job Posting */}
                <div className="flex gap-2">
                  {/* User Management */}
                  <div className="flex-1 bg-[#f5f5f5] p-3 rounded">
                    <p className="text-xs font-bold text-[#0a0a0a] mb-2.5">
                      User management
                    </p>
                    <div className="space-y-2.5">
                      <Switch
                        label="Add users"
                        checked={permissions.userManagement.addUsers}
                        onCheckedChange={(v) =>
                          updatePermission("userManagement", "addUsers", v)
                        }
                      />
                      <Switch
                        label="Edit details"
                        checked={permissions.userManagement.editDetails}
                        onCheckedChange={(v) =>
                          updatePermission("userManagement", "editDetails", v)
                        }
                      />
                      <Switch
                        label="Give permissions"
                        checked={permissions.userManagement.givePermissions}
                        onCheckedChange={(v) =>
                          updatePermission(
                            "userManagement",
                            "givePermissions",
                            v,
                          )
                        }
                      />
                      <Switch
                        label="Remove users"
                        checked={permissions.userManagement.removeUsers}
                        onCheckedChange={(v) =>
                          updatePermission("userManagement", "removeUsers", v)
                        }
                      />
                    </div>
                  </div>

                  {/* Job Posting */}
                  <div className="flex-1 bg-[#f5f5f5] p-3 rounded">
                    <p className="text-xs font-bold text-[#0a0a0a] mb-2.5">
                      Job posting
                    </p>
                    <div className="space-y-2.5">
                      <Switch
                        label="Create job post"
                        checked={permissions.jobPosting.createJobPost}
                        onCheckedChange={(v) =>
                          updatePermission("jobPosting", "createJobPost", v)
                        }
                      />
                      <Switch
                        label="Edit job post"
                        checked={permissions.jobPosting.editJobPost}
                        onCheckedChange={(v) =>
                          updatePermission("jobPosting", "editJobPost", v)
                        }
                      />
                      <Switch
                        label="Remove job post"
                        checked={permissions.jobPosting.removeJobPost}
                        onCheckedChange={(v) =>
                          updatePermission("jobPosting", "removeJobPost", v)
                        }
                      />
                      <Switch
                        label="Track job posting"
                        checked={permissions.jobPosting.trackJobPosting}
                        onCheckedChange={(v) =>
                          updatePermission("jobPosting", "trackJobPosting", v)
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Row 2: Candidate Management & Interview Scheduling */}
                <div className="flex gap-2">
                  {/* Candidate Management */}
                  <div className="flex-1 bg-[#f5f5f5] p-3 rounded">
                    <p className="text-xs font-bold text-[#0a0a0a] mb-2.5">
                      Candidate management
                    </p>
                    <div className="space-y-2.5">
                      <Switch
                        label="Add candidates"
                        checked={permissions.candidateManagement.addCandidates}
                        onCheckedChange={(v) =>
                          updatePermission(
                            "candidateManagement",
                            "addCandidates",
                            v,
                          )
                        }
                      />
                      <Switch
                        label="Edit candidates"
                        checked={permissions.candidateManagement.editCandidates}
                        onCheckedChange={(v) =>
                          updatePermission(
                            "candidateManagement",
                            "editCandidates",
                            v,
                          )
                        }
                      />
                      <Switch
                        label="Remove candidates"
                        checked={
                          permissions.candidateManagement.removeCandidates
                        }
                        onCheckedChange={(v) =>
                          updatePermission(
                            "candidateManagement",
                            "removeCandidates",
                            v,
                          )
                        }
                      />
                      <Switch
                        label="Download candidate resume"
                        checked={permissions.candidateManagement.downloadResume}
                        onCheckedChange={(v) =>
                          updatePermission(
                            "candidateManagement",
                            "downloadResume",
                            v,
                          )
                        }
                      />
                    </div>
                  </div>

                  {/* Interview Scheduling */}
                  <div className="flex-1 bg-[#f5f5f5] p-3 rounded">
                    <p className="text-xs font-bold text-[#0a0a0a] mb-2.5">
                      Interview scheduling
                    </p>
                    <div className="space-y-2.5">
                      <Switch
                        label="Create interview"
                        checked={
                          permissions.interviewScheduling.createInterview
                        }
                        onCheckedChange={(v) =>
                          updatePermission(
                            "interviewScheduling",
                            "createInterview",
                            v,
                          )
                        }
                      />
                      <Switch
                        label="Schedule interview"
                        checked={
                          permissions.interviewScheduling.scheduleInterview
                        }
                        onCheckedChange={(v) =>
                          updatePermission(
                            "interviewScheduling",
                            "scheduleInterview",
                            v,
                          )
                        }
                      />
                      <Switch
                        label="Review interview feedbacks"
                        checked={
                          permissions.interviewScheduling.reviewFeedbacks
                        }
                        onCheckedChange={(v) =>
                          updatePermission(
                            "interviewScheduling",
                            "reviewFeedbacks",
                            v,
                          )
                        }
                      />
                      <Switch
                        label="Track interview progress"
                        checked={permissions.interviewScheduling.trackProgress}
                        onCheckedChange={(v) =>
                          updatePermission(
                            "interviewScheduling",
                            "trackProgress",
                            v,
                          )
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-end">
                <Button onClick={handleSubmit}>Send invite</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
