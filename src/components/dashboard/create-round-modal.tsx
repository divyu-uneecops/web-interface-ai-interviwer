"use client";

import * as React from "react";
import { X, ChevronLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";

interface CreateRoundModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: RoundFormData) => void;
}

export interface RoundFormData {
  roundName: string;
  roundType: string;
  roundObjective: string;
  duration: string;
  language: string;
  interviewer: string;
  skills: string[];
  questionType: "ai" | "hybrid" | "custom";
  aiGeneratedQuestions: number;
  customQuestions: number;
  customQuestionTexts: string[];
  interviewInstructions: string;
  allowSkip: boolean;
  sendReminder: boolean;
  reminderTime: string;
}

const roundTypeOptions = [
  { value: "behavioral", label: "Behavioral" },
  { value: "technical", label: "Technical" },
  { value: "screening", label: "Screening" },
  { value: "final", label: "Final Round" },
];

const languageOptions = [
  { value: "en", label: "English" },
  { value: "hi", label: "Hindi" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
];

const durationOptions = [
  { value: "15", label: "15 minutes" },
  { value: "30", label: "30 minutes" },
  { value: "45", label: "45 minutes" },
  { value: "60", label: "60 minutes" },
  { value: "90", label: "90 minutes" },
];

const reminderTimeOptions = [
  { value: "15", label: "15 minutes before" },
  { value: "30", label: "30 minutes before" },
  { value: "60", label: "1 hour before" },
  { value: "120", label: "2 hours before" },
  { value: "1440", label: "1 day before" },
  { value: "2880", label: "2 days" },
];

const mockInterviewers = [
  { id: "1", name: "Product Manager", image: "" },
  { id: "2", name: "HR Manager", image: "" },
  { id: "3", name: "UX Designer", image: "" },
  { id: "4", name: "Sales", image: "" },
  { id: "5", name: "Marketing", image: "" },
  { id: "6", name: "Software Engineer", image: "" },
];

const skillOptions = [
  "JavaScript",
  "React",
  "Node.js",
  "Python",
  "TypeScript",
  "SQL",
  "Problem Solving",
  "Communication",
  "Collaboration",
];

export function CreateRoundModal({
  open,
  onOpenChange,
  onSubmit,
}: CreateRoundModalProps) {
  const [step, setStep] = React.useState<1 | 2 | 3>(1);
  const [formData, setFormData] = React.useState<RoundFormData>({
    roundName: "",
    roundType: "",
    roundObjective: "",
    duration: "",
    language: "",
    interviewer: "",
    skills: [],
    questionType: "ai",
    aiGeneratedQuestions: 5,
    customQuestions: 0,
    customQuestionTexts: [],
    interviewInstructions: "",
    allowSkip: false,
    sendReminder: false,
    reminderTime: "30",
  });

  const handleClose = () => {
    setStep(1);
    setFormData({
      roundName: "",
      roundType: "",
      roundObjective: "",
      duration: "",
      language: "",
      interviewer: "",
      skills: [],
      questionType: "ai",
      aiGeneratedQuestions: 5,
      customQuestions: 0,
      customQuestionTexts: [],
      interviewInstructions: "",
      allowSkip: false,
      sendReminder: false,
      reminderTime: "30",
    });
    onOpenChange(false);
  };

  const handleNext = () => {
    if (step < 3) {
      setStep((prev) => (prev + 1) as 1 | 2 | 3);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((prev) => (prev - 1) as 1 | 2 | 3);
    }
  };

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(formData);
    }
    handleClose();
  };

  const toggleSkill = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill],
    }));
  };

  const updateCustomQuestion = (index: number, value: string) => {
    const newQuestions = [...formData.customQuestionTexts];
    newQuestions[index] = value;
    setFormData((prev) => ({
      ...prev,
      customQuestionTexts: newQuestions,
    }));
  };

  const addCustomQuestion = () => {
    setFormData((prev) => ({
      ...prev,
      customQuestions: prev.customQuestions + 1,
      customQuestionTexts: [...prev.customQuestionTexts, ""],
    }));
  };

  const removeCustomQuestion = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      customQuestions: prev.customQuestions - 1,
      customQuestionTexts: prev.customQuestionTexts.filter(
        (_, i) => i !== index
      ),
    }));
  };

  const selectInterviewer = (id: string) => {
    setFormData((prev) => ({ ...prev, interviewer: id }));
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/30 z-40" onClick={handleClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white border border-[#e5e5e5] rounded-lg shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-2px_rgba(0,0,0,0.1)] w-full max-w-[779px] max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-[#e5e5e5]">
            <div className="flex flex-col gap-1.5">
              <h2 className="text-lg font-semibold text-[#0a0a0a] leading-none">
                Create new round
              </h2>
              <p className="text-sm text-[#737373] leading-5">
                {step === 1 && "Add round details"}
                {step === 2 && "Questions"}
                {step === 3 && "Instructions & settings"}
              </p>
            </div>
            <button
              onClick={handleClose}
              className="w-4 h-4 flex items-center justify-center rounded-sm opacity-70 hover:opacity-100 transition-opacity"
            >
              <X className="w-4 h-4 text-[#737373]" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {step === 1 && (
              <div className="space-y-4">
                <p className="text-sm font-bold text-[#0a0a0a] leading-none">
                  Round details
                </p>
                <div className="space-y-4">
                  {/* Round name and Round type side by side */}
                  <div className="flex gap-2.5">
                    <div className="flex-1 space-y-2">
                      <Label className="text-sm font-medium text-[#0a0a0a] leading-5">
                        Round name <span className="text-neutral-950">*</span>
                      </Label>
                      <Input
                        value={formData.roundName}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            roundName: e.target.value,
                          }))
                        }
                        placeholder="Behavioural round"
                        className="h-9 shadow-[0px_1px_2px_0px_rgba(2,86,61,0.12)]"
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <Label className="text-sm font-medium text-[#0a0a0a] leading-5">
                        Round type <span className="text-neutral-950">*</span>
                      </Label>
                      <Select
                        value={formData.roundType}
                        onValueChange={(value) =>
                          setFormData((prev) => ({ ...prev, roundType: value }))
                        }
                      >
                        <SelectTrigger className="h-9 shadow-[0px_1px_2px_0px_rgba(2,86,61,0.12)]">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {roundTypeOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Round Objective */}
                  <div className="space-y-2 relative">
                    <Label className="text-sm font-medium text-[#0a0a0a] leading-5">
                      Round Objective <span className="text-red-700">*</span>
                    </Label>
                    <div className="relative">
                      <Textarea
                        value={formData.roundObjective}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            roundObjective: e.target.value,
                          }))
                        }
                        placeholder="Describe what you want to assess in this round..."
                        className="min-h-[103px] shadow-[0px_1px_2px_0px_rgba(2,86,61,0.12)] pr-24"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-2 text-sm text-[#02563d] underline"
                      >
                        Generate from AI
                      </button>
                    </div>
                    <p className="text-xs text-[#737373] leading-none">
                      This helps AI generate relevant questions
                    </p>
                  </div>

                  {/* Duration and Language side by side */}
                  <div className="flex gap-2.5">
                    <div className="flex-1 space-y-2">
                      <Label className="text-sm font-medium text-[#0a0a0a] leading-5">
                        Duration <span className="text-neutral-950">*</span>
                      </Label>
                      <Select
                        value={formData.duration}
                        onValueChange={(value) =>
                          setFormData((prev) => ({ ...prev, duration: value }))
                        }
                      >
                        <SelectTrigger className="h-9 shadow-[0px_1px_2px_0px_rgba(2,86,61,0.12)]">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {durationOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex-1 space-y-2">
                      <Label className="text-sm font-medium text-[#0a0a0a] leading-5">
                        Language <span className="text-neutral-950">*</span>
                      </Label>
                      <Select
                        value={formData.language}
                        onValueChange={(value) =>
                          setFormData((prev) => ({ ...prev, language: value }))
                        }
                      >
                        <SelectTrigger className="h-9 shadow-[0px_1px_2px_0px_rgba(2,86,61,0.12)]">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {languageOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Select Interviewer - Card based */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-[#0a0a0a] leading-5">
                      Select Interviewer
                    </Label>
                    <div className="flex gap-2 flex-wrap">
                      {/* Add new card */}
                      <button
                        type="button"
                        className="border border-dashed border-[#d1d1d1] rounded p-1 flex flex-col items-center gap-1 w-[70px] h-[98px]"
                      >
                        <div className="bg-[#e5e5e5] rounded w-[62px] h-[62px] flex items-center justify-center relative">
                          <Plus className="w-6 h-6 text-black" />
                        </div>
                        <p className="text-xs text-[#737373] leading-none text-center">
                          + Add new
                        </p>
                      </button>

                      {/* Interviewer cards */}
                      {mockInterviewers.map((interviewer) => (
                        <button
                          key={interviewer.id}
                          type="button"
                          onClick={() => selectInterviewer(interviewer.id)}
                          className={`border rounded p-1 flex flex-col items-center gap-1 w-[70px] h-[98px] transition-all ${
                            formData.interviewer === interviewer.id
                              ? "border-[#02563d] bg-[#f0f5f2] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)]"
                              : "border-[#d1d1d1]"
                          }`}
                        >
                          <div className="bg-[#e5e5e5] rounded w-[62px] h-[62px] flex items-center justify-center">
                            {/* Placeholder for avatar */}
                          </div>
                          <p className="text-xs text-[#737373] leading-none text-center">
                            {interviewer.name}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Skills for round */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-[#0a0a0a] leading-5">
                      Skills for round <span className="text-red-700">*</span>
                    </Label>
                    <div className="border border-[#e5e5e5] rounded-md h-9 px-3 py-1 flex items-center gap-1 shadow-[0px_1px_2px_0px_rgba(2,86,61,0.12)]">
                      {formData.skills.length > 0 ? (
                        formData.skills.map((skill) => (
                          <Badge
                            key={skill}
                            className="bg-[#e5e5e5] text-[#0a0a0a] border-0 rounded-full px-2 h-6 text-xs font-normal hover:bg-[#e5e5e5]"
                          >
                            {skill}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-sm text-[#737373]">
                          Select skills
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {skillOptions.map((skill) => (
                        <Badge
                          key={skill}
                          variant={
                            formData.skills.includes(skill)
                              ? "default"
                              : "outline"
                          }
                          className={`cursor-pointer h-6 px-2 text-xs font-normal rounded-md border ${
                            formData.skills.includes(skill)
                              ? "bg-[#02563d] text-white border-transparent hover:bg-[#02563d]"
                              : "bg-white border-[#e5e5e5] text-[#0a0a0a] hover:bg-[#f5f5f5]"
                          }`}
                          onClick={() => toggleSkill(skill)}
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <p className="text-sm font-bold text-[#0a0a0a] leading-none">
                  Questions
                </p>
                <div className="space-y-5">
                  {/* Questions type */}
                  <div className="space-y-2.5">
                    <Label className="text-sm font-medium text-[#0a0a0a] leading-5">
                      Questions type
                    </Label>
                    <RadioGroup
                      value={formData.questionType}
                      onValueChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          questionType: value as "ai" | "hybrid" | "custom",
                          // Reset custom questions when switching away from hybrid/custom
                          customQuestions:
                            value === "hybrid" || value === "custom"
                              ? prev.customQuestions
                              : 0,
                          customQuestionTexts:
                            value === "hybrid" || value === "custom"
                              ? prev.customQuestionTexts
                              : [],
                        }))
                      }
                      className="flex gap-3"
                    >
                      {/* AI generated questions */}
                      <label
                        className={`flex-1 flex gap-3 p-3 rounded-md border cursor-pointer transition-all ${
                          formData.questionType === "ai"
                            ? "bg-[#f0f5f2] border-[#02563d]"
                            : "border-[#e5e5e5]"
                        }`}
                      >
                        <RadioGroupItem
                          value="ai"
                          id="ai"
                          className="h-4 w-4 mt-0.5"
                        />
                        <div className="flex-1 space-y-1.5">
                          <p className="text-sm font-medium text-[#0a0a0a] leading-none">
                            AI generated questions
                          </p>
                          <p className="text-sm font-normal text-[#737373] leading-5">
                            AI will generate relevant questions based on the job
                            User and interview goal.
                          </p>
                        </div>
                      </label>

                      {/* Hybrid mode */}
                      <label
                        className={`flex-1 flex gap-3 p-3 rounded-md border cursor-pointer transition-all ${
                          formData.questionType === "hybrid"
                            ? "bg-[#f0f5f2] border-[#02563d]"
                            : "border-[#e5e5e5]"
                        }`}
                      >
                        <RadioGroupItem
                          value="hybrid"
                          id="hybrid"
                          className="h-4 w-4 mt-0.5"
                        />
                        <div className="flex-1 space-y-1.5">
                          <p className="text-sm font-medium text-[#0a0a0a] leading-none">
                            Hybrid mode
                          </p>
                          <p className="text-sm font-normal text-[#737373] leading-5">
                            Combine your custom questions with AI-generated
                            ones.
                          </p>
                        </div>
                      </label>
                    </RadioGroup>
                  </div>

                  {/* AI Generated Questions */}
                  {(formData.questionType === "ai" ||
                    formData.questionType === "hybrid") && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-[#0a0a0a] leading-5">
                        No. of AI generated questions{" "}
                        <span className="text-neutral-950">*</span>
                      </Label>
                      <Select
                        value={formData.aiGeneratedQuestions.toString()}
                        onValueChange={(value) =>
                          setFormData((prev) => ({
                            ...prev,
                            aiGeneratedQuestions: parseInt(value),
                          }))
                        }
                      >
                        <SelectTrigger className="h-9 shadow-[0px_1px_2px_0px_rgba(2,86,61,0.12)]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[3, 5, 7, 10, 15].map((num) => (
                            <SelectItem key={num} value={num.toString()}>
                              {num}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* Hybrid mode - Custom questions */}
                  {formData.questionType === "hybrid" && (
                    <div className="space-y-5">
                      {/* No. of custom question */}
                      <div className="flex gap-5">
                        <div className="flex-1 space-y-2">
                          <Label className="text-sm font-medium text-[#0a0a0a] leading-5">
                            No. of custom question{" "}
                            <span className="text-neutral-950">*</span>
                          </Label>
                          <Select
                            value={formData.customQuestions.toString()}
                            onValueChange={(value) => {
                              const num = parseInt(value);
                              setFormData((prev) => {
                                const currentCount =
                                  prev.customQuestionTexts.length;
                                const newTexts = [...prev.customQuestionTexts];
                                if (num > currentCount) {
                                  // Add empty questions
                                  for (let i = currentCount; i < num; i++) {
                                    newTexts.push("");
                                  }
                                } else if (num < currentCount) {
                                  // Remove questions
                                  newTexts.splice(num);
                                }
                                return {
                                  ...prev,
                                  customQuestions: num,
                                  customQuestionTexts: newTexts,
                                };
                              });
                            }}
                          >
                            <SelectTrigger className="h-9 shadow-[0px_1px_2px_0px_rgba(2,86,61,0.12)]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {[1, 2, 3, 4, 5].map((num) => (
                                <SelectItem key={num} value={num.toString()}>
                                  {num}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Custom question inputs */}
                      {formData.customQuestionTexts.map((question, index) => (
                        <div key={index} className="space-y-2">
                          <Label className="text-sm font-medium text-[#0a0a0a] leading-5">
                            Question {index + 1}.{" "}
                            <span className="text-neutral-950">*</span>
                          </Label>
                          <Input
                            value={question}
                            onChange={(e) =>
                              updateCustomQuestion(index, e.target.value)
                            }
                            placeholder="Write your question here"
                            className="h-9 shadow-[0px_1px_2px_0px_rgba(2,86,61,0.12)]"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Custom questions only mode */}
                  {formData.questionType === "custom" && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium text-[#0a0a0a] leading-5">
                          Custom questions
                        </Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={addCustomQuestion}
                          className="h-8 px-3 text-xs font-medium border-[#e5e5e5] text-[#0a0a0a] hover:bg-[#f5f5f5]"
                        >
                          + Add question
                        </Button>
                      </div>
                      {formData.customQuestionTexts.map((question, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            value={question}
                            onChange={(e) =>
                              updateCustomQuestion(index, e.target.value)
                            }
                            placeholder={`Question ${index + 1}`}
                            className="h-9 flex-1 shadow-[0px_1px_2px_0px_rgba(2,86,61,0.12)]"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeCustomQuestion(index)}
                            className="h-9 w-9 p-0 text-[#737373] hover:text-[#0a0a0a] hover:bg-[#f5f5f5]"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <p className="text-sm font-bold text-[#0a0a0a] leading-none">
                  Instructions & settings
                </p>
                <div className="space-y-5">
                  {/* Interview instructions */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-[#0a0a0a] leading-5">
                      Interview instructions{" "}
                      <span className="text-red-700">*</span>
                    </Label>
                    <Textarea
                      value={formData.interviewInstructions}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          interviewInstructions: e.target.value,
                        }))
                      }
                      placeholder="Write interview instructions here"
                      className="min-h-[103px] shadow-[0px_1px_2px_0px_rgba(2,86,61,0.12)]"
                    />
                  </div>

                  {/* Settings */}
                  <div className="space-y-2.5">
                    <Label className="text-sm font-medium text-[#0a0a0a] leading-5">
                      Settings
                    </Label>
                    <div className="space-y-3">
                      {/* Allow skip */}
                      <div className="border border-[#e5e5e5] rounded p-3">
                        <button
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              allowSkip: !prev.allowSkip,
                            }))
                          }
                          className="flex items-start justify-between w-full cursor-pointer"
                        >
                          <div className="flex-1 space-y-2 pr-3">
                            <p className="text-sm font-medium text-[#0a0a0a] leading-none">
                              Allow skip <span className="text-red-700">*</span>
                            </p>
                            <p className="text-sm font-normal text-[#737373] leading-5">
                              Applicants must complete this question.
                            </p>
                          </div>
                          <div className="relative inline-flex h-5 w-9 shrink-0 items-center rounded-full border-2 border-transparent transition-colors bg-[#e5e5e5]">
                            <span
                              className={`pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg transition-transform ${
                                formData.allowSkip
                                  ? "translate-x-4"
                                  : "translate-x-0"
                              }`}
                            />
                          </div>
                        </button>
                      </div>

                      {/* Send reminder */}
                      <div className="border border-[#e5e5e5] rounded p-3 space-y-5">
                        <button
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              sendReminder: !prev.sendReminder,
                            }))
                          }
                          className="flex items-start justify-between w-full cursor-pointer"
                        >
                          <div className="flex-1 space-y-2 pr-3">
                            <p className="text-sm font-medium text-[#0a0a0a] leading-none">
                              Send reminder
                            </p>
                            <p className="text-sm font-normal text-[#737373] leading-5">
                              Email reminder before scheduled interview
                            </p>
                          </div>
                          <div
                            className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full border-2 border-transparent transition-colors ${
                              formData.sendReminder
                                ? "bg-[#02563d] justify-end"
                                : "bg-[#e5e5e5]"
                            }`}
                          >
                            <span
                              className={`pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg transition-transform ${
                                formData.sendReminder
                                  ? "translate-x-4"
                                  : "translate-x-0"
                              }`}
                            />
                          </div>
                        </button>
                        {formData.sendReminder && (
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-[#0a0a0a] leading-5">
                              Set reminder time
                            </Label>
                            <Select
                              value={formData.reminderTime}
                              onValueChange={(value) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  reminderTime: value,
                                }))
                              }
                            >
                              <SelectTrigger className="h-9 shadow-[0px_1px_2px_0px_rgba(2,86,61,0.12)]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {reminderTimeOptions.map((option) => (
                                  <SelectItem
                                    key={option.value}
                                    value={option.value}
                                  >
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
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 p-6 border-t border-[#e5e5e5]">
            {step > 1 && (
              <Button
                variant="outline"
                onClick={handleBack}
                className="h-9 px-4 text-sm font-medium bg-[#f5f5f5] border-0 text-[#171717] hover:bg-[#f5f5f5] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]"
              >
                Previous
              </Button>
            )}
            <Button
              onClick={step === 3 ? handleSubmit : handleNext}
              className="h-9 px-4 text-sm font-medium bg-[#02563d] text-white hover:bg-[#02563d]/90 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]"
            >
              {step === 3 ? "Create round" : "Next"}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
