import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { InterviewFormData } from "../types";
import { AI_QUESTION_COUNTS, CUSTOM_QUESTION_COUNTS } from "../constants";

interface Step4QuestionsProps {
  formData: InterviewFormData;
  onFieldChange: <K extends keyof InterviewFormData>(
    field: K,
    value: InterviewFormData[K]
  ) => void;
}

export const Step4Questions = ({
  formData,
  onFieldChange,
}: Step4QuestionsProps) => {
  const handleQuestionsTypeChange = (
    value: InterviewFormData["questionsType"]
  ) => {
    onFieldChange("questionsType", value);
    if (value !== "hybrid") {
      onFieldChange("customQuestionsCount", 0);
      onFieldChange("customQuestions", []);
    }
  };

  const handleCustomQuestionsCountChange = (count: number) => {
    const currentCount = formData.customQuestions.length;
    const newQuestions = [...formData.customQuestions];

    if (count > currentCount) {
      for (let i = currentCount; i < count; i++) {
        newQuestions.push("");
      }
    } else if (count < currentCount) {
      newQuestions.splice(count);
    }

    onFieldChange("customQuestionsCount", count);
    onFieldChange("customQuestions", newQuestions);
  };

  const updateCustomQuestion = (index: number, value: string) => {
    const newQuestions = [...formData.customQuestions];
    newQuestions[index] = value;
    onFieldChange("customQuestions", newQuestions);
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm font-bold text-[#0a0a0a] leading-none">Questions</p>
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-[10px]">
          <Label className="text-sm font-medium text-[#0a0a0a] leading-5">
            Questions type
          </Label>
          <RadioGroup
            value={formData.questionsType}
            onValueChange={(value) =>
              handleQuestionsTypeChange(
                value as InterviewFormData["questionsType"]
              )
            }
            className="flex gap-3"
          >
            <label
              className={`flex-1 flex gap-3 p-3 rounded border cursor-pointer transition-all ${
                formData.questionsType === "ai"
                  ? "bg-[#f0f5f2] border-[#02563d]"
                  : "border-[#e5e5e5]"
              }`}
            >
              <RadioGroupItem value="ai" id="ai" className="h-4 w-4 mt-0.5" />
              <div className="flex-1 flex flex-col gap-1.5">
                <p className="text-sm font-medium text-[#0a0a0a] leading-none">
                  AI generated questions
                </p>
                <p className="text-sm font-normal text-[#737373] leading-5">
                  AI will generate relevant questions based on the job User and
                  interview goal.
                </p>
              </div>
            </label>

            <label
              className={`flex-1 flex gap-3 p-3 rounded border cursor-pointer transition-all ${
                formData.questionsType === "hybrid"
                  ? "bg-[#f0f5f2] border-[#02563d]"
                  : "border-[#e5e5e5]"
              }`}
            >
              <RadioGroupItem
                value="hybrid"
                id="hybrid"
                className="h-4 w-4 mt-0.5"
              />
              <div className="flex-1 flex flex-col gap-1.5">
                <p className="text-sm font-medium text-[#0a0a0a] leading-none">
                  Hybrid mode
                </p>
                <p className="text-sm font-normal text-[#737373] leading-5">
                  Combine your custom questions with AI-generated ones.
                </p>
              </div>
            </label>
          </RadioGroup>
        </div>

        {formData.questionsType === "ai" && (
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-medium text-[#0a0a0a] leading-5">
              No. of AI generated questions{" "}
              <span className="text-[#0a0a0a]">*</span>
            </Label>
            <Select
              value={formData.aiGeneratedQuestions.toString()}
              onValueChange={(value) =>
                onFieldChange("aiGeneratedQuestions", parseInt(value))
              }
            >
              <SelectTrigger className="w-full h-9 shadow-[0px_1px_2px_0px_rgba(2,86,61,0.12)]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {AI_QUESTION_COUNTS.map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {formData.questionsType === "hybrid" && (
          <div className="flex flex-col gap-5">
            <div className="flex gap-5">
              <div className="flex-1 flex flex-col gap-2">
                <Label className="text-sm font-medium text-[#0a0a0a] leading-5">
                  No. of AI generated questions{" "}
                  <span className="text-[#0a0a0a]">*</span>
                </Label>
                <Select
                  value={formData.aiGeneratedQuestions.toString()}
                  onValueChange={(value) =>
                    onFieldChange("aiGeneratedQuestions", parseInt(value))
                  }
                >
                  <SelectTrigger className="w-full h-9 shadow-[0px_1px_2px_0px_rgba(2,86,61,0.12)]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {AI_QUESTION_COUNTS.map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <Label className="text-sm font-medium text-[#0a0a0a] leading-5">
                  No. of custom question{" "}
                  <span className="text-[#0a0a0a]">*</span>
                </Label>
                <Select
                  value={formData.customQuestionsCount.toString()}
                  onValueChange={(value) =>
                    handleCustomQuestionsCountChange(parseInt(value))
                  }
                >
                  <SelectTrigger className="w-full h-9 shadow-[0px_1px_2px_0px_rgba(2,86,61,0.12)]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CUSTOM_QUESTION_COUNTS.map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {formData.customQuestions.map((question, index) => (
              <div key={index} className="flex flex-col gap-2">
                <Label className="text-sm font-medium text-[#0a0a0a] leading-5">
                  Question {index + 1}.{" "}
                  <span className="text-[#0a0a0a]">*</span>
                </Label>
                <Input
                  value={question}
                  onChange={(e) => updateCustomQuestion(index, e.target.value)}
                  placeholder="Write your question here"
                  className="h-9 shadow-[0px_1px_2px_0px_rgba(2,86,61,0.12)]"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
