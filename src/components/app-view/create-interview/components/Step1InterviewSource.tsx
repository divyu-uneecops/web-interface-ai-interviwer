import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import type { InterviewFormData } from "../types";

interface Step1InterviewSourceProps {
  formData: InterviewFormData;
  onSourceChange: (source: InterviewFormData["interviewSource"]) => void;
}

export const Step1InterviewSource = ({
  formData,
  onSourceChange,
}: Step1InterviewSourceProps) => {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm font-bold text-[#0a0a0a] leading-none">
        Choose how you want to set up this interview
      </p>
      <div className="flex flex-col gap-[10px]">
        <Label className="text-sm font-medium text-[#0a0a0a] leading-none">
          Interview source <span className="text-[#b91c1c]">*</span>
        </Label>
        <RadioGroup
          value={formData.interviewSource}
          onValueChange={(value) =>
            onSourceChange(value as InterviewFormData["interviewSource"])
          }
          className="flex gap-3"
        >
          <button
            type="button"
            onClick={() => onSourceChange("existing")}
            className={`flex flex-1 gap-3 items-start p-3 rounded-[6px] border border-solid transition-colors ${
              formData.interviewSource === "existing"
                ? "bg-[#f0f5f2] border-[#02563d]"
                : "bg-transparent border-[#e5e5e5]"
            }`}
          >
            <RadioGroupItem value="existing" id="existing" className="mt-0.5" />
            <div className="flex flex-col gap-1.5 items-start flex-1">
              <Label
                htmlFor="existing"
                className="text-sm font-medium text-[#0a0a0a] leading-none cursor-pointer"
              >
                Use Existing Job
              </Label>
              <p className="text-sm font-normal text-[#737373] leading-5">
                Create interview for an existing job profile
              </p>
            </div>
          </button>
          <button
            type="button"
            onClick={() => onSourceChange("new")}
            className={`flex flex-1 gap-3 items-start p-3 rounded-[6px] border border-solid transition-colors ${
              formData.interviewSource === "new"
                ? "bg-[#f0f5f2] border-[#02563d]"
                : "bg-transparent border-[#e5e5e5]"
            }`}
          >
            <RadioGroupItem value="new" id="new" className="mt-0.5" />
            <div className="flex flex-col gap-1.5 items-start flex-1">
              <Label
                htmlFor="new"
                className="text-sm font-medium text-[#0a0a0a] leading-none cursor-pointer"
              >
                Create New Job
              </Label>
              <p className="text-sm font-normal text-[#737373] leading-5">
                Create a new job profile for an interview
              </p>
            </div>
          </button>
        </RadioGroup>
      </div>
    </div>
  );
};
