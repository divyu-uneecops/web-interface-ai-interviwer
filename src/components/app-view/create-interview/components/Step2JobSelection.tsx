import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import type { InterviewFormData } from "../types";
import {
  DOMAIN_OPTIONS,
  JOB_LEVEL_OPTIONS,
  USER_TYPE_OPTIONS,
  MOCK_EXISTING_JOBS,
  MOCK_ROUNDS,
} from "../constants";
import { useSkillsManager } from "../hooks/useSkillsManager";

interface Step2JobSelectionProps {
  formData: InterviewFormData;
  onFieldChange: <K extends keyof InterviewFormData>(
    field: K,
    value: InterviewFormData[K]
  ) => void;
}

export const Step2JobSelection = ({
  formData,
  onFieldChange,
}: Step2JobSelectionProps) => {
  const skillsManager = useSkillsManager(formData.skills, (skills) =>
    onFieldChange("skills", skills)
  );

  // Existing job selection
  if (formData.interviewSource === "existing") {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-sm font-bold text-[#0a0a0a] leading-none">
          Choose a job opening and interview round
        </p>
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-medium text-[#0a0a0a] leading-none">
              Job opening <span className="text-[#0a0a0a]">*</span>
            </Label>
            <Select
              value={formData.selectedJobId || ""}
              onValueChange={(value) => onFieldChange("selectedJobId", value)}
            >
              <SelectTrigger className="w-full h-9 shadow-[0px_1px_2px_0px_rgba(2,86,61,0.12)] border-[#e5e5e5]">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {MOCK_EXISTING_JOBS.map((job) => (
                  <SelectItem key={job.id} value={job.id}>
                    {job.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-sm font-medium text-[#0a0a0a] leading-none">
              Interview round <span className="text-[#0a0a0a]">*</span>
            </Label>
            <Select
              value={formData.selectedRoundId || ""}
              onValueChange={(value) => onFieldChange("selectedRoundId", value)}
            >
              <SelectTrigger className="w-full h-9 shadow-[0px_1px_2px_0px_rgba(2,86,61,0.12)] border-[#e5e5e5]">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {MOCK_ROUNDS.map((round) => (
                  <SelectItem key={round.value} value={round.value}>
                    {round.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    );
  }

  // New job creation form
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-sm font-bold text-[#0a0a0a] leading-none">
        Basic job details
      </h3>

      <div className="flex flex-col gap-2">
        <Label className="font-semibold text-sm text-[#000000]">
          Parse job documentation
        </Label>
        <div className="border border-dashed border-[#d1d1d1] rounded bg-transparent h-[114px] flex items-center justify-center">
          <div className="flex flex-col items-center gap-2 px-4 py-8 text-center">
            <p className="text-sm text-[#02563d] leading-5 w-[188px]">
              Drag and drop files here or click to upload
            </p>
            <p className="text-xs text-[#747474] leading-none">
              Max file size is 500kb. Supported file types are .jpg and .png.
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2.5 w-full">
        <div className="flex-1 h-px bg-[#e5e5e5]" />
        <span className="text-sm text-[#737373] leading-none">or</span>
        <div className="flex-1 h-px bg-[#e5e5e5]" />
      </div>

      <div className="flex flex-col gap-2">
        <Label className="text-sm font-medium text-[#0a0a0a] leading-none">
          Job title <span className="text-[#b91c1c]">*</span>
        </Label>
        <Input
          value={formData.jobTitle}
          onChange={(e) => onFieldChange("jobTitle", e.target.value)}
          placeholder="e.g. senior product manager"
          className="h-9 shadow-[0px_1px_2px_0px_rgba(2,86,61,0.12)] border-[#e5e5e5]"
        />
      </div>

      <div className="grid grid-cols-3 gap-2.5">
        <div className="flex flex-col gap-2">
          <Label className="text-sm font-medium text-[#0a0a0a] leading-none">
            Domain <span className="text-[#b91c1c]">*</span>
          </Label>
          <Select
            value={formData.domain}
            onValueChange={(value) => onFieldChange("domain", value)}
          >
            <SelectTrigger className="w-full h-9 shadow-[0px_1px_2px_0px_rgba(2,86,61,0.12)] border-[#e5e5e5]">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {DOMAIN_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2">
          <Label className="text-sm font-medium text-[#0a0a0a] leading-none">
            Job level <span className="text-[#b91c1c]">*</span>
          </Label>
          <Select
            value={formData.jobLevel}
            onValueChange={(value) => onFieldChange("jobLevel", value)}
          >
            <SelectTrigger className="w-full h-9 shadow-[0px_1px_2px_0px_rgba(2,86,61,0.12)] border-[#e5e5e5]">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {JOB_LEVEL_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2">
          <Label className="text-sm font-medium text-[#0a0a0a] leading-none">
            User type <span className="text-[#b91c1c]">*</span>
          </Label>
          <Select
            value={formData.userType}
            onValueChange={(value) => onFieldChange("userType", value)}
          >
            <SelectTrigger className="w-full h-9 shadow-[0px_1px_2px_0px_rgba(2,86,61,0.12)] border-[#e5e5e5]">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {USER_TYPE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2.5">
        <div className="flex flex-col gap-2">
          <Label className="text-sm font-medium text-[#0a0a0a] leading-none">
            Min experience <span className="text-[#b91c1c]">*</span>
          </Label>
          <Input
            type="number"
            value={formData.minExperience}
            onChange={(e) => onFieldChange("minExperience", e.target.value)}
            placeholder="Enter years"
            className="h-9 shadow-[0px_1px_2px_0px_rgba(2,86,61,0.12)] border-[#e5e5e5]"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label className="text-sm font-medium text-[#0a0a0a] leading-none">
            Max experience <span className="text-[#b91c1c]">*</span>
          </Label>
          <Input
            type="number"
            value={formData.maxExperience}
            onChange={(e) => onFieldChange("maxExperience", e.target.value)}
            placeholder="Enter years"
            className="h-9 shadow-[0px_1px_2px_0px_rgba(2,86,61,0.12)] border-[#e5e5e5]"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label className="text-sm font-medium text-[#0a0a0a] leading-none">
            No. of openings <span className="text-[#b91c1c]">*</span>
          </Label>
          <Input
            type="number"
            value={formData.noOfOpenings}
            onChange={(e) => onFieldChange("noOfOpenings", e.target.value)}
            placeholder="Enter number"
            className="h-9 shadow-[0px_1px_2px_0px_rgba(2,86,61,0.12)] border-[#e5e5e5]"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label className="text-sm font-medium text-[#0a0a0a] leading-none">
          Job description <span className="text-[#b91c1c]">*</span>
        </Label>
        <Textarea
          value={formData.description}
          onChange={(e) => onFieldChange("description", e.target.value)}
          placeholder="Enter job description"
          className="min-h-[100px] shadow-[0px_1px_2px_0px_rgba(2,86,61,0.12)] border-[#e5e5e5]"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label className="text-sm font-medium text-[#0a0a0a] leading-5">
          Skills <span className="text-[#b91c1c]">*</span>
        </Label>
        <div className="flex gap-2">
          <Input
            value={skillsManager.newSkill}
            onChange={(e) => skillsManager.setNewSkill(e.target.value)}
            onKeyDown={skillsManager.handleKeyDown}
            placeholder="Add skill"
            className="h-9 flex-1 shadow-[0px_1px_2px_0px_rgba(2,86,61,0.12)] border-[#e5e5e5]"
          />
          <Button
            type="button"
            onClick={skillsManager.addSkill}
            className="h-9 px-4 bg-[#02563d] hover:bg-[#02563d]/90"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        {formData.skills.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.skills.map((skill) => (
              <Badge key={skill} variant="secondary" className="gap-1">
                {skill}
                <button
                  type="button"
                  onClick={() => skillsManager.removeSkill(skill)}
                  className="ml-1 hover:opacity-70"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
