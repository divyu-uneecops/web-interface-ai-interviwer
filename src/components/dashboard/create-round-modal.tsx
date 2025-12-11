"use client";

import * as React from "react";
import { Plus, X } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import Image from "next/image";

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
  { id: "1", name: "Product Manager", image: "/interviewer-male.jpg" },
  { id: "2", name: "HR Manager", image: "/interviewer-female.jpg" },
  { id: "3", name: "UX Designer", image: "/interviewer-male.jpg" },
  { id: "4", name: "Sales", image: "/interviewer-female.jpg" },
  { id: "5", name: "Marketing", image: "/interviewer-male.jpg" },
  { id: "6", name: "Software Engineer", image: "/interviewer-female.jpg" },
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

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      handleClose();
    } else {
      onOpenChange(true);
    }
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

  const selectInterviewer = (id: string) => {
    setFormData((prev) => ({ ...prev, interviewer: id }));
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="max-w-[779px] sm:max-w-[779px] sm:w-[779px] p-6 gap-4 max-h-[90vh] overflow-y-auto bg-white border border-[#e5e5e5] rounded-[10px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-2px_rgba(0,0,0,0.1)] [&>button]:top-[15px] [&>button]:right-[15px]"
        showCloseButton={true}
      >
        <DialogHeader className="gap-1.5 text-left pb-0">
          <DialogTitle className="text-lg font-semibold text-[#0a0a0a] leading-none">
            Create new round
          </DialogTitle>
          <DialogDescription className="text-sm text-[#737373] leading-5">
            Add round details
          </DialogDescription>
        </DialogHeader>

        {/* Content */}
        <div className="flex flex-col gap-4">
          {step === 1 && (
            <div className="flex flex-col gap-4">
              <p className="text-sm font-bold text-[#0a0a0a] leading-none">
                Round details
              </p>
              <div className="flex flex-col gap-4">
                {/* Round name and Round type side by side */}
                <div className="flex gap-[10px]">
                  <div className="flex-1 flex flex-col gap-2">
                    <Label className="text-sm font-medium text-[#0a0a0a] leading-5">
                      Round name <span className="text-[#0a0a0a]">*</span>
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
                  <div className="flex-1 flex flex-col gap-2">
                    <Label className="text-sm font-medium text-[#0a0a0a] leading-5">
                      Round type <span className="text-[#0a0a0a]">*</span>
                    </Label>
                    <Select
                      value={formData.roundType}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, roundType: value }))
                      }
                    >
                      <SelectTrigger className="w-full h-9 shadow-[0px_1px_2px_0px_rgba(2,86,61,0.12)]">
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
                <div className="flex flex-col gap-2 relative">
                  <Label className="text-sm font-medium text-[#0a0a0a] leading-5">
                    Round Objective <span className="text-[#b91c1c]">*</span>
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
                      className="absolute right-3 top-2 text-sm text-[#02563d] underline leading-none"
                    >
                      Generate from AI
                    </button>
                  </div>
                  <p className="text-xs text-[#737373] leading-none">
                    This helps AI generate relevant questions
                  </p>
                </div>

                {/* Duration and Language side by side */}
                <div className="flex gap-[10px]">
                  <div className="flex-1 flex flex-col gap-2">
                    <Label className="text-sm font-medium text-[#0a0a0a] leading-5">
                      Duration <span className="text-[#0a0a0a]">*</span>
                    </Label>
                    <Select
                      value={formData.duration}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, duration: value }))
                      }
                    >
                      <SelectTrigger className="w-full h-9 shadow-[0px_1px_2px_0px_rgba(2,86,61,0.12)]">
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
                  <div className="flex-1 flex flex-col gap-2">
                    <Label className="text-sm font-medium text-[#0a0a0a] leading-5">
                      Language <span className="text-[#0a0a0a]">*</span>
                    </Label>
                    <Select
                      value={formData.language}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, language: value }))
                      }
                    >
                      <SelectTrigger className="w-full h-9 shadow-[0px_1px_2px_0px_rgba(2,86,61,0.12)]">
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
                <div className="flex flex-col gap-2">
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
                      <p className="text-xs text-[#737373] leading-none text-center w-[62px]">
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
                        <div className="relative rounded w-[62px] h-[62px] overflow-hidden">
                          <Image
                            src={interviewer.image}
                            alt={interviewer.name}
                            fill
                            className="object-cover"
                            sizes="62px"
                          />
                        </div>
                        <p className="text-xs text-[#737373] leading-none text-center w-[62px]">
                          {interviewer.name}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Skills for round */}
                <div className="flex flex-col gap-2">
                  <Label className="text-sm font-medium text-[#0a0a0a] leading-5">
                    Skills for round <span className="text-[#b91c1c]">*</span>
                  </Label>
                  <div className="border border-[#e5e5e5] rounded-md h-9 px-3 py-1 flex items-center gap-1 flex-wrap shadow-[0px_1px_2px_0px_rgba(2,86,61,0.12)] min-h-[36px]">
                    {formData.skills.length > 0 ? (
                      formData.skills.map((skill) => (
                        <Badge
                          key={skill}
                          className="bg-[#e5e5e5] text-[#0a0a0a] border-0 rounded-full px-2 h-6 text-xs font-normal hover:bg-[#e5e5e5] flex items-center gap-0.5"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleSkill(skill);
                            }}
                            className="ml-0.5 hover:bg-[rgba(0,0,0,0.1)] rounded-full p-0.5 flex items-center justify-center"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))
                    ) : (
                      <span className="text-sm text-[#737373]">
                        Select skills
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
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
            <div className="flex flex-col gap-4">
              <p className="text-sm font-bold text-[#0a0a0a] leading-none">
                Questions
              </p>
              <div className="flex flex-col gap-5">
                {/* Questions type */}
                <div className="flex flex-col gap-[10px]">
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
                      className={`flex-1 flex gap-3 p-3 rounded border cursor-pointer transition-all ${
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
                      <div className="flex-1 flex flex-col gap-1.5">
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
                      className={`flex-1 flex gap-3 p-3 rounded border cursor-pointer transition-all ${
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

                {/* AI Generated Questions - AI mode only */}
                {formData.questionType === "ai" && (
                  <div className="flex flex-col gap-2">
                    <Label className="text-sm font-medium text-[#0a0a0a] leading-5">
                      No. of AI generated questions{" "}
                      <span className="text-[#0a0a0a]">*</span>
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
                      <SelectTrigger className="w-full h-9 shadow-[0px_1px_2px_0px_rgba(2,86,61,0.12)]">
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

                {/* Hybrid mode - AI and Custom questions side by side */}
                {formData.questionType === "hybrid" && (
                  <div className="flex flex-col gap-5">
                    {/* No. of AI and Custom questions side by side */}
                    <div className="flex gap-5">
                      <div className="flex-1 flex flex-col gap-2">
                        <Label className="text-sm font-medium text-[#0a0a0a] leading-5">
                          No. of AI generated questions{" "}
                          <span className="text-[#0a0a0a]">*</span>
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
                          <SelectTrigger className="w-full h-9 shadow-[0px_1px_2px_0px_rgba(2,86,61,0.12)]">
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
                      <div className="flex-1 flex flex-col gap-2">
                        <Label className="text-sm font-medium text-[#0a0a0a] leading-5">
                          No. of custom question{" "}
                          <span className="text-[#0a0a0a]">*</span>
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
                          <SelectTrigger className="w-full h-9 shadow-[0px_1px_2px_0px_rgba(2,86,61,0.12)]">
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
                      <div key={index} className="flex flex-col gap-2">
                        <Label className="text-sm font-medium text-[#0a0a0a] leading-5">
                          Question {index + 1}.{" "}
                          <span className="text-[#0a0a0a]">*</span>
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
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col gap-4">
              <p className="text-sm font-bold text-[#0a0a0a] leading-none">
                Instructions & settings
              </p>
              <div className="flex flex-col gap-5">
                {/* Interview instructions */}
                <div className="flex flex-col gap-2">
                  <Label className="text-sm font-medium text-[#0a0a0a] leading-5">
                    Interview instructions{" "}
                    <span className="text-[#b91c1c]">*</span>
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
                <div className="flex flex-col gap-[10px]">
                  <Label className="text-sm font-medium text-[#0a0a0a] leading-5">
                    Settings
                  </Label>
                  <div className="flex flex-col gap-3">
                    {/* Allow skip */}
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
                            setFormData((prev) => ({
                              ...prev,
                              allowSkip: checked,
                            }))
                          }
                        />
                      </div>
                    </div>

                    {/* Send reminder */}
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
                            setFormData((prev) => ({
                              ...prev,
                              sendReminder: checked,
                            }))
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
                              setFormData((prev) => ({
                                ...prev,
                                reminderTime: value,
                              }))
                            }
                          >
                            <SelectTrigger className="w-full h-9 shadow-[0px_1px_2px_0px_rgba(2,86,61,0.12)]">
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
        <DialogFooter className="flex items-center justify-end gap-2">
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
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
