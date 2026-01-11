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
  ROUND_TYPE_OPTIONS,
  DURATION_OPTIONS,
  LANGUAGE_OPTIONS,
  MOCK_INTERVIEWERS,
} from "../constants";
import { useSkillsManager } from "../hooks/useSkillsManager";

interface Step3RoundDetailsProps {
  formData: InterviewFormData;
  onFieldChange: <K extends keyof InterviewFormData>(
    field: K,
    value: InterviewFormData[K]
  ) => void;
}

export const Step3RoundDetails = ({
  formData,
  onFieldChange,
}: Step3RoundDetailsProps) => {
  const roundSkillsManager = useSkillsManager(formData.roundSkills, (skills) =>
    onFieldChange("roundSkills", skills)
  );

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm font-bold text-[#0a0a0a] leading-none">
        Round details
      </p>

      <div className="flex flex-col gap-4">
        <div className="flex gap-[10px]">
          <div className="flex-1 flex flex-col gap-2">
            <Label className="text-sm font-medium text-[#0a0a0a] leading-none">
              Round name <span className="text-[#0a0a0a]">*</span>
            </Label>
            <Input
              value={formData.roundName}
              onChange={(e) => onFieldChange("roundName", e.target.value)}
              placeholder="Behavioural round"
              className="h-9 shadow-[0px_1px_2px_0px_rgba(2,86,61,0.12)] border-[#e5e5e5]"
            />
          </div>
          <div className="flex-1 flex flex-col gap-2">
            <Label className="text-sm font-medium text-[#0a0a0a] leading-none">
              Round type <span className="text-[#0a0a0a]">*</span>
            </Label>
            <Select
              value={formData.roundType}
              onValueChange={(value) => onFieldChange("roundType", value)}
            >
              <SelectTrigger className="w-full h-9 shadow-[0px_1px_2px_0px_rgba(2,86,61,0.12)] border-[#e5e5e5]">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {ROUND_TYPE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-col gap-2 relative">
          <Label className="text-sm font-medium text-[#0a0a0a] leading-none">
            Round Objective <span className="text-[#b91c1c]">*</span>
          </Label>
          <div className="relative">
            <Textarea
              value={formData.objective}
              onChange={(e) => onFieldChange("objective", e.target.value)}
              placeholder="Describe what you want to assess in this round..."
              className="min-h-[103px] shadow-[0px_1px_2px_0px_rgba(2,86,61,0.12)] border-[#e5e5e5] pr-24"
            />
            <button
              type="button"
              className="absolute right-0 top-0 text-sm text-[#02563d] underline leading-none"
            >
              Generate from AI
            </button>
          </div>
          <p className="text-xs text-[#737373] leading-none">
            This helps AI generate relevant questions
          </p>
        </div>

        <div className="flex gap-[10px]">
          <div className="flex-1 flex flex-col gap-2">
            <Label className="text-sm font-medium text-[#0a0a0a] leading-none">
              Duration <span className="text-[#0a0a0a]">*</span>
            </Label>
            <Select
              value={formData.duration}
              onValueChange={(value) => onFieldChange("duration", value)}
            >
              <SelectTrigger className="w-full h-9 shadow-[0px_1px_2px_0px_rgba(2,86,61,0.12)] border-[#e5e5e5]">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {DURATION_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1 flex flex-col gap-2">
            <Label className="text-sm font-medium text-[#0a0a0a] leading-none">
              Language <span className="text-[#0a0a0a]">*</span>
            </Label>
            <Select
              value={formData.language}
              onValueChange={(value) => onFieldChange("language", value)}
            >
              <SelectTrigger className="w-full h-9 shadow-[0px_1px_2px_0px_rgba(2,86,61,0.12)] border-[#e5e5e5]">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label className="text-sm font-medium text-[#0a0a0a] leading-none">
            Select Interviewer
          </Label>
          <div className="flex gap-2 items-center">
            <button
              type="button"
              className="border border-dashed border-[#d1d1d1] rounded p-1 flex flex-col items-center gap-1 w-[70px] h-[98px]"
            >
              <div className="flex flex-col gap-1 h-[90px] items-center">
                <div className="bg-[#e5e5e5] rounded w-[62px] h-[62px] relative">
                  <Plus className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-black" />
                </div>
                <p className="text-xs text-[#737373] leading-none text-center w-[62px]">
                  + Add new
                </p>
              </div>
            </button>
            {MOCK_INTERVIEWERS.map((interviewer) => (
              <button
                key={interviewer.id}
                type="button"
                onClick={() => onFieldChange("interviewerId", interviewer.id)}
                className={`border rounded p-1 flex flex-col items-center gap-1 w-[70px] h-[98px] transition-all ${
                  formData.interviewerId === interviewer.id
                    ? "border-[#02563d] bg-[#f0f5f2] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)]"
                    : "border-[#d1d1d1]"
                }`}
              >
                <div className="flex flex-col gap-1 h-[90px] items-center">
                  <div className="relative rounded w-[62px] h-[62px] overflow-hidden">
                    <img
                      src={interviewer.image}
                      alt={interviewer.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-xs text-[#737373] leading-none text-center w-[62px]">
                    {interviewer.name}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label className="text-sm font-medium text-[#0a0a0a] leading-none">
            Skills for round <span className="text-[#b91c1c]">*</span>
          </Label>
          <div className="flex gap-2">
            <div className="flex-1 flex items-center gap-1 px-3 py-1 min-h-[36px] border border-[#e5e5e5] rounded-md shadow-[0px_1px_2px_0px_rgba(2,86,61,0.12)] bg-white">
              <div className="flex flex-wrap gap-1 flex-1 items-center">
                {formData.roundSkills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className="gap-1 bg-[#e5e5e5] text-black text-xs px-2 py-0 rounded-full h-[18px]"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => roundSkillsManager.removeSkill(skill)}
                      className="ml-1 hover:opacity-70"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
                <input
                  value={roundSkillsManager.newSkill}
                  onChange={(e) =>
                    roundSkillsManager.setNewSkill(e.target.value)
                  }
                  onKeyDown={roundSkillsManager.handleKeyDown}
                  placeholder={
                    formData.roundSkills.length === 0 ? "Add skill" : ""
                  }
                  className="flex-1 min-w-[100px] text-sm text-[#737373] bg-transparent border-0 outline-0"
                />
              </div>
            </div>
            <Button
              type="button"
              onClick={roundSkillsManager.addSkill}
              className="h-9 px-4 bg-[#02563d] hover:bg-[#02563d]/90"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
