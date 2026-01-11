import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { InterviewFormData } from "../types";
import { REMINDER_TIME_OPTIONS } from "../constants";

interface Step5InstructionsProps {
  formData: InterviewFormData;
  onFieldChange: <K extends keyof InterviewFormData>(
    field: K,
    value: InterviewFormData[K]
  ) => void;
}

export const Step5Instructions = ({
  formData,
  onFieldChange,
}: Step5InstructionsProps) => {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm font-bold text-[#0a0a0a] leading-none">
        Instructions & settings
      </p>
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <Label className="text-sm font-medium text-[#0a0a0a] leading-5">
            Interview instructions <span className="text-[#b91c1c]">*</span>
          </Label>
          <Textarea
            value={formData.instructions}
            onChange={(e) => onFieldChange("instructions", e.target.value)}
            placeholder="Write interview instructions here"
            className="min-h-[103px] shadow-[0px_1px_2px_0px_rgba(2,86,61,0.12)]"
          />
        </div>

        <div className="flex flex-col gap-[10px]">
          <Label className="text-sm font-medium text-[#0a0a0a] leading-5">
            Settings
          </Label>
          <div className="flex flex-col gap-3">
            <div className="border border-[#e5e5e5] rounded p-3">
              <div className="flex items-start justify-between w-full">
                <div className="flex-1 flex flex-col gap-2 pr-3">
                  <p className="text-sm font-medium text-[#0a0a0a] leading-none">
                    Allow skip <span className="text-[#b91c1c]">*</span>
                  </p>
                  <p className="text-sm font-normal text-[#737373] leading-5">
                    Applicants must complete this question.
                  </p>
                </div>
                <Switch
                  checked={formData.allowSkip}
                  onCheckedChange={(checked) =>
                    onFieldChange("allowSkip", checked)
                  }
                />
              </div>
            </div>

            <div className="border border-[#e5e5e5] rounded p-3 flex flex-col gap-5">
              <div className="flex items-start justify-between w-full">
                <div className="flex-1 flex flex-col gap-2 pr-3">
                  <p className="text-sm font-medium text-[#0a0a0a] leading-none">
                    Send reminder
                  </p>
                  <p className="text-sm font-normal text-[#737373] leading-5">
                    Email reminder before scheduled interview
                  </p>
                </div>
                <Switch
                  checked={formData.sendReminder}
                  onCheckedChange={(checked) =>
                    onFieldChange("sendReminder", checked)
                  }
                />
              </div>
              {formData.sendReminder && (
                <div className="flex flex-col gap-2">
                  <Label className="text-sm font-medium text-[#0a0a0a] leading-5">
                    Set reminder time
                  </Label>
                  <Select
                    value={formData.reminderTime}
                    onValueChange={(value) =>
                      onFieldChange("reminderTime", value)
                    }
                  >
                    <SelectTrigger className="w-full h-9 shadow-[0px_1px_2px_0px_rgba(2,86,61,0.12)]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {REMINDER_TIME_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
