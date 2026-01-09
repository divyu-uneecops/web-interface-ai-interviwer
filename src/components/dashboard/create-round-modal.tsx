"use client";

import * as React from "react";
import { Plus, X } from "lucide-react";
import { useFormik } from "formik";
import { toast } from "sonner";
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
import serverInterfaceService from "@/services/server-interface.service";
import {
  transformToAPIPayload,
  validate,
  isStepValid,
} from "./round/utils/round.utils";

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
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const formik = useFormik<RoundFormData>({
    initialValues: {
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
    },
    validate,
    enableReinitialize: true,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        const payload = transformToAPIPayload(values);
        const response = await serverInterfaceService.post(
          "/v2/forminstances",
          {},
          payload
        );
        toast.success(response?.message || "Round created successfully", {
          duration: 8000,
        });
        formik.resetForm();
        setStep(1);
        onOpenChange(false);
        if (onSubmit) {
          onSubmit(values);
        }
      } catch (error: any) {
        toast.error(
          error?.response?.data?.message || "An unknown error occurred",
          {
            duration: 8000,
          }
        );
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  // Reset form when modal closes
  React.useEffect(() => {
    if (!open) {
      formik.resetForm();
      setStep(1);
    }
  }, [open]);

  const handleClose = () => {
    setStep(1);
    formik.resetForm();
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
    // Validate current step before proceeding
    if (isStepValid(step, formik.values)) {
      if (step < 3) {
        setStep((prev) => (prev + 1) as 1 | 2 | 3);
      }
    } else {
      // Mark all fields in current step as touched to show errors
      if (step === 1) {
        formik.setFieldTouched("roundName", true);
        formik.setFieldTouched("roundType", true);
        formik.setFieldTouched("roundObjective", true);
        formik.setFieldTouched("duration", true);
        formik.setFieldTouched("language", true);
        formik.setFieldTouched("skills", true);
      } else if (step === 2) {
        formik.setFieldTouched("questionType", true);
        formik.setFieldTouched("aiGeneratedQuestions", true);
        if (
          formik.values.questionType === "hybrid" ||
          formik.values.questionType === "custom"
        ) {
          formik.setFieldTouched("customQuestions", true);
          formik.setFieldTouched("customQuestionTexts", true);
        }
      } else if (step === 3) {
        formik.setFieldTouched("interviewInstructions", true);
      }
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((prev) => (prev - 1) as 1 | 2 | 3);
    }
  };

  const handleSubmit = () => {
    formik.handleSubmit();
  };

  const toggleSkill = (skill: string) => {
    const currentSkills = formik.values.skills;
    const newSkills = currentSkills.includes(skill)
      ? currentSkills.filter((s) => s !== skill)
      : [...currentSkills, skill];
    formik.setFieldValue("skills", newSkills);
  };

  const updateCustomQuestion = (index: number, value: string) => {
    const newQuestions = [...formik.values.customQuestionTexts];
    newQuestions[index] = value;
    formik.setFieldValue("customQuestionTexts", newQuestions);
  };

  const selectInterviewer = (id: string) => {
    formik.setFieldValue("interviewer", id);
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
                      name="roundName"
                      value={formik.values.roundName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="Behavioural round"
                      className={`h-9 shadow-[0px_1px_2px_0px_rgba(2,86,61,0.12)] ${
                        formik.touched.roundName && formik.errors.roundName
                          ? "border-red-500"
                          : ""
                      }`}
                    />
                    {formik.touched.roundName && formik.errors.roundName && (
                      <p className="text-xs text-red-500">
                        {formik.errors.roundName}
                      </p>
                    )}
                  </div>
                  <div className="flex-1 flex flex-col gap-2">
                    <Label className="text-sm font-medium text-[#0a0a0a] leading-5">
                      Round type <span className="text-[#0a0a0a]">*</span>
                    </Label>
                    <Select
                      value={formik.values.roundType}
                      onValueChange={(value) => {
                        formik.setFieldValue("roundType", value);
                        formik.setFieldTouched("roundType", true);
                      }}
                    >
                      <SelectTrigger
                        className={`w-full h-9 shadow-[0px_1px_2px_0px_rgba(2,86,61,0.12)] ${
                          formik.touched.roundType && formik.errors.roundType
                            ? "border-red-500"
                            : ""
                        }`}
                      >
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
                    {formik.touched.roundType && formik.errors.roundType && (
                      <p className="text-xs text-red-500">
                        {formik.errors.roundType}
                      </p>
                    )}
                  </div>
                </div>

                {/* Round Objective */}
                <div className="flex flex-col gap-2 relative">
                  <Label className="text-sm font-medium text-[#0a0a0a] leading-5">
                    Round Objective <span className="text-[#b91c1c]">*</span>
                  </Label>
                  <div className="relative">
                    <Textarea
                      name="roundObjective"
                      value={formik.values.roundObjective}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="Describe what you want to assess in this round..."
                      className={`min-h-[103px] shadow-[0px_1px_2px_0px_rgba(2,86,61,0.12)] pr-24 ${
                        formik.touched.roundObjective &&
                        formik.errors.roundObjective
                          ? "border-red-500"
                          : ""
                      }`}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-2 text-sm text-[#02563d] underline leading-none"
                    >
                      Generate from AI
                    </button>
                  </div>
                  {formik.touched.roundObjective &&
                    formik.errors.roundObjective && (
                      <p className="text-xs text-red-500">
                        {formik.errors.roundObjective}
                      </p>
                    )}
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
                      value={formik.values.duration}
                      onValueChange={(value) => {
                        formik.setFieldValue("duration", value);
                        formik.setFieldTouched("duration", true);
                      }}
                    >
                      <SelectTrigger
                        className={`w-full h-9 shadow-[0px_1px_2px_0px_rgba(2,86,61,0.12)] ${
                          formik.touched.duration && formik.errors.duration
                            ? "border-red-500"
                            : ""
                        }`}
                      >
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
                    {formik.touched.duration && formik.errors.duration && (
                      <p className="text-xs text-red-500">
                        {formik.errors.duration}
                      </p>
                    )}
                  </div>
                  <div className="flex-1 flex flex-col gap-2">
                    <Label className="text-sm font-medium text-[#0a0a0a] leading-5">
                      Language <span className="text-[#0a0a0a]">*</span>
                    </Label>
                    <Select
                      value={formik.values.language}
                      onValueChange={(value) => {
                        formik.setFieldValue("language", value);
                        formik.setFieldTouched("language", true);
                      }}
                    >
                      <SelectTrigger
                        className={`w-full h-9 shadow-[0px_1px_2px_0px_rgba(2,86,61,0.12)] ${
                          formik.touched.language && formik.errors.language
                            ? "border-red-500"
                            : ""
                        }`}
                      >
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
                    {formik.touched.language && formik.errors.language && (
                      <p className="text-xs text-red-500">
                        {formik.errors.language}
                      </p>
                    )}
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
                          formik.values.interviewer === interviewer.id
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
                  <div
                    className={`border rounded-md h-9 px-3 py-1 flex items-center gap-1 flex-wrap shadow-[0px_1px_2px_0px_rgba(2,86,61,0.12)] min-h-[36px] ${
                      formik.touched.skills && formik.errors.skills
                        ? "border-red-500"
                        : "border-[#e5e5e5]"
                    }`}
                  >
                    {formik.values.skills.length > 0 ? (
                      formik.values.skills.map((skill) => (
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
                  {formik.touched.skills && formik.errors.skills && (
                    <p className="text-xs text-red-500">
                      {formik.errors.skills}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {skillOptions.map((skill) => (
                      <Badge
                        key={skill}
                        variant={
                          formik.values.skills.includes(skill)
                            ? "default"
                            : "outline"
                        }
                        className={`cursor-pointer h-6 px-2 text-xs font-normal rounded-md border ${
                          formik.values.skills.includes(skill)
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
                    value={formik.values.questionType}
                    onValueChange={(value) => {
                      formik.setFieldValue(
                        "questionType",
                        value as "ai" | "hybrid" | "custom"
                      );
                      // Reset custom questions when switching away from hybrid/custom
                      if (value !== "hybrid" && value !== "custom") {
                        formik.setFieldValue("customQuestions", 0);
                        formik.setFieldValue("customQuestionTexts", []);
                      }
                    }}
                    className="flex gap-3"
                  >
                    {/* AI generated questions */}
                    <label
                      className={`flex-1 flex gap-3 p-3 rounded border cursor-pointer transition-all ${
                        formik.values.questionType === "ai"
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
                        formik.values.questionType === "hybrid"
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
                {formik.values.questionType === "ai" && (
                  <div className="flex flex-col gap-2">
                    <Label className="text-sm font-medium text-[#0a0a0a] leading-5">
                      No. of AI generated questions{" "}
                      <span className="text-[#0a0a0a]">*</span>
                    </Label>
                    <Select
                      value={formik.values.aiGeneratedQuestions.toString()}
                      onValueChange={(value) => {
                        formik.setFieldValue(
                          "aiGeneratedQuestions",
                          parseInt(value)
                        );
                        formik.setFieldTouched("aiGeneratedQuestions", true);
                      }}
                    >
                      <SelectTrigger
                        className={`w-full h-9 shadow-[0px_1px_2px_0px_rgba(2,86,61,0.12)] ${
                          formik.touched.aiGeneratedQuestions &&
                          formik.errors.aiGeneratedQuestions
                            ? "border-red-500"
                            : ""
                        }`}
                      >
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
                    {formik.touched.aiGeneratedQuestions &&
                      formik.errors.aiGeneratedQuestions && (
                        <p className="text-xs text-red-500">
                          {formik.errors.aiGeneratedQuestions}
                        </p>
                      )}
                  </div>
                )}

                {/* Hybrid mode - AI and Custom questions side by side */}
                {formik.values.questionType === "hybrid" && (
                  <div className="flex flex-col gap-5">
                    {/* No. of AI and Custom questions side by side */}
                    <div className="flex gap-5">
                      <div className="flex-1 flex flex-col gap-2">
                        <Label className="text-sm font-medium text-[#0a0a0a] leading-5">
                          No. of AI generated questions{" "}
                          <span className="text-[#0a0a0a]">*</span>
                        </Label>
                        <Select
                          value={formik.values.aiGeneratedQuestions.toString()}
                          onValueChange={(value) => {
                            formik.setFieldValue(
                              "aiGeneratedQuestions",
                              parseInt(value)
                            );
                            formik.setFieldTouched(
                              "aiGeneratedQuestions",
                              true
                            );
                          }}
                        >
                          <SelectTrigger
                            className={`w-full h-9 shadow-[0px_1px_2px_0px_rgba(2,86,61,0.12)] ${
                              formik.touched.aiGeneratedQuestions &&
                              formik.errors.aiGeneratedQuestions
                                ? "border-red-500"
                                : ""
                            }`}
                          >
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
                        {formik.touched.aiGeneratedQuestions &&
                          formik.errors.aiGeneratedQuestions && (
                            <p className="text-xs text-red-500">
                              {formik.errors.aiGeneratedQuestions}
                            </p>
                          )}
                      </div>
                      <div className="flex-1 flex flex-col gap-2">
                        <Label className="text-sm font-medium text-[#0a0a0a] leading-5">
                          No. of custom question{" "}
                          <span className="text-[#0a0a0a]">*</span>
                        </Label>
                        <Select
                          value={formik.values.customQuestions.toString()}
                          onValueChange={(value) => {
                            const num = parseInt(value);
                            const currentCount =
                              formik.values.customQuestionTexts.length;
                            const newTexts = [
                              ...formik.values.customQuestionTexts,
                            ];
                            if (num > currentCount) {
                              // Add empty questions
                              for (let i = currentCount; i < num; i++) {
                                newTexts.push("");
                              }
                            } else if (num < currentCount) {
                              // Remove questions
                              newTexts.splice(num);
                            }
                            formik.setFieldValue("customQuestions", num);
                            formik.setFieldValue(
                              "customQuestionTexts",
                              newTexts
                            );
                            formik.setFieldTouched("customQuestions", true);
                          }}
                        >
                          <SelectTrigger
                            className={`w-full h-9 shadow-[0px_1px_2px_0px_rgba(2,86,61,0.12)] ${
                              formik.touched.customQuestions &&
                              formik.errors.customQuestions
                                ? "border-red-500"
                                : ""
                            }`}
                          >
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
                        {formik.touched.customQuestions &&
                          formik.errors.customQuestions && (
                            <p className="text-xs text-red-500">
                              {formik.errors.customQuestions}
                            </p>
                          )}
                      </div>
                    </div>

                    {/* Custom question inputs */}
                    {formik.values.customQuestionTexts.map(
                      (question, index) => (
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
                            onBlur={() =>
                              formik.setFieldTouched(
                                "customQuestionTexts",
                                true
                              )
                            }
                            placeholder="Write your question here"
                            className={`h-9 shadow-[0px_1px_2px_0px_rgba(2,86,61,0.12)] ${
                              formik.touched.customQuestionTexts &&
                              formik.errors.customQuestionTexts
                                ? "border-red-500"
                                : ""
                            }`}
                          />
                        </div>
                      )
                    )}
                    {formik.touched.customQuestionTexts &&
                      formik.errors.customQuestionTexts && (
                        <p className="text-xs text-red-500">
                          {formik.errors.customQuestionTexts}
                        </p>
                      )}
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
                    name="interviewInstructions"
                    value={formik.values.interviewInstructions}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Write interview instructions here"
                    className={`min-h-[103px] shadow-[0px_1px_2px_0px_rgba(2,86,61,0.12)] ${
                      formik.touched.interviewInstructions &&
                      formik.errors.interviewInstructions
                        ? "border-red-500"
                        : ""
                    }`}
                  />
                  {formik.touched.interviewInstructions &&
                    formik.errors.interviewInstructions && (
                      <p className="text-xs text-red-500">
                        {formik.errors.interviewInstructions}
                      </p>
                    )}
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
                          checked={formik.values.allowSkip}
                          onCheckedChange={(checked) =>
                            formik.setFieldValue("allowSkip", checked)
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
                          checked={formik.values.sendReminder}
                          onCheckedChange={(checked) =>
                            formik.setFieldValue("sendReminder", checked)
                          }
                        />
                      </div>
                      {formik.values.sendReminder && (
                        <div className="flex flex-col gap-2">
                          <Label className="text-sm font-medium text-[#0a0a0a] leading-5">
                            Set reminder time
                          </Label>
                          <Select
                            value={formik.values.reminderTime}
                            onValueChange={(value) =>
                              formik.setFieldValue("reminderTime", value)
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
            disabled={
              isSubmitting || (step < 3 && !isStepValid(step, formik.values))
            }
            className="h-9 px-4 text-sm font-medium bg-[#02563d] text-white hover:bg-[#02563d]/90 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting
              ? "Creating..."
              : step === 3
              ? "Create round"
              : "Next"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
