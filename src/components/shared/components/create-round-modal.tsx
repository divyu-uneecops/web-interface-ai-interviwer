"use client";

import { Plus, X } from "lucide-react";
import { useFormik } from "formik";
import { toast } from "sonner";
import Image from "next/image";

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

import { roundService } from "../services/round.service";

import {
  transformToCreateRoundPayload,
  transformToUpdateRoundPayload,
} from "../utils/shared.utils";
import {
  CreateRoundModalProps,
  RoundFormData,
} from "../interfaces/shared.interface";
import { useState, useEffect, useRef } from "react";
import { interviewerService } from "../../app-view/interviewer/services/interviewer.services";
import {
  Interviewer,
  APIPaginationInfo,
} from "../../app-view/interviewer/interfaces/interviewer.interfaces";
import { transformAPIResponseToInterviewers } from "../../app-view/interviewer/utils/interviewer.utils";

const validate = (values: RoundFormData) => {
  const errors: Partial<Record<keyof RoundFormData, string>> = {};

  if (!values?.roundName || values?.roundName?.trim() === "") {
    errors.roundName = "Round name is required";
  }

  if (!values?.roundType) {
    errors.roundType = "Round type is required";
  }

  if (!values?.roundObjective || values?.roundObjective?.trim() === "") {
    errors.roundObjective = "Round objective is required";
  }

  if (!values?.duration) {
    errors.duration = "Duration is required";
  }

  if (!values?.language) {
    errors.language = "Language is required";
  }

  if (values?.skills?.length === 0) {
    errors.skills = "At least one skill is required";
  }

  if (
    !values?.interviewInstructions ||
    values?.interviewInstructions?.trim() === ""
  ) {
    errors.interviewInstructions = "Interview instructions are required";
  }

  if (
    values?.questionType === "ai" &&
    (!values?.aiGeneratedQuestions || values?.aiGeneratedQuestions < 1)
  ) {
    errors.aiGeneratedQuestions = "Number of AI questions must be at least 1";
  }

  if (values?.questionType === "hybrid") {
    if (!values.aiGeneratedQuestions || values.aiGeneratedQuestions < 1) {
      errors.aiGeneratedQuestions = "Number of AI questions must be at least 1";
    }
    if (!values?.customQuestions || values?.customQuestions < 1) {
      errors.customQuestions = "Number of custom questions must be at least 1";
    }
    // Validate custom question texts
    const emptyQuestions = values?.customQuestionTexts?.filter(
      (q) => !q || q.trim() === ""
    );
    if (emptyQuestions.length > 0) {
      errors.customQuestionTexts = "All custom questions must be filled";
    }
  }

  return errors;
};

// Validate step 1 fields
const validateStep1 = (values: RoundFormData) => {
  const errors: Partial<Record<keyof RoundFormData, string>> = {};

  if (!values?.roundName || values?.roundName?.trim() === "") {
    errors.roundName = "Round name is required";
  }

  if (!values?.roundType) {
    errors.roundType = "Round type is required";
  }

  if (!values?.roundObjective || values?.roundObjective?.trim() === "") {
    errors.roundObjective = "Round objective is required";
  }

  if (!values?.duration) {
    errors.duration = "Duration is required";
  }

  if (!values?.language) {
    errors.language = "Language is required";
  }

  if (values?.skills?.length === 0) {
    errors.skills = "At least one skill is required";
  }

  return errors;
};

// Validate step 2 fields
const validateStep2 = (values: RoundFormData) => {
  const errors: Partial<Record<keyof RoundFormData, string>> = {};

  if (
    values.questionType === "ai" &&
    (!values?.aiGeneratedQuestions || values?.aiGeneratedQuestions < 1)
  ) {
    errors.aiGeneratedQuestions = "Number of AI questions must be at least 1";
  }

  if (values?.questionType === "hybrid") {
    if (!values?.aiGeneratedQuestions || values?.aiGeneratedQuestions < 1) {
      errors.aiGeneratedQuestions = "Number of AI questions must be at least 1";
    }
    if (!values?.customQuestions || values?.customQuestions < 1) {
      errors.customQuestions = "Number of custom questions must be at least 1";
    }
    // Validate custom question texts
    const emptyQuestions = values?.customQuestionTexts?.filter(
      (q) => !q || q.trim() === ""
    );
    if (emptyQuestions?.length > 0) {
      errors.customQuestionTexts = "All custom questions must be filled";
    }
  }

  return errors;
};

// Validate step 3 fields
const validateStep3 = (values: RoundFormData) => {
  const errors: Partial<Record<keyof RoundFormData, string>> = {};

  if (
    !values.interviewInstructions ||
    values.interviewInstructions.trim() === ""
  ) {
    errors.interviewInstructions = "Interview instructions are required";
  }

  return errors;
};

// Check if a specific step is valid
const isStepValid = (step: 1 | 2 | 3, values: RoundFormData): boolean => {
  let stepErrors: Partial<Record<keyof RoundFormData, string>> = {};

  switch (step) {
    case 1:
      stepErrors = validateStep1(values);
      break;
    case 2:
      stepErrors = validateStep2(values);
      break;
    case 3:
      stepErrors = validateStep3(values);
      break;
  }

  return Object.keys(stepErrors).length === 0;
};

export function CreateRoundModal({
  open,
  onOpenChange,
  onSubmit: onSubmitCallback,
  mappingValues,
  jobId,
  isEditMode = false,
  roundDetail,
  roundId,
}: CreateRoundModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const [interviewers, setInterviewers] = useState<Interviewer[]>([]);
  const [isLoadingInterviewers, setIsLoadingInterviewers] = useState(false);
  const [pagination, setPagination] = useState<APIPaginationInfo>({
    total: 0,
    nextOffset: null,
    previousOffset: null,
    limit: 10,
  });
  const [currentOffset, setCurrentOffset] = useState(0);
  const interviewerContainerRef = useRef<HTMLDivElement>(null);

  const formik = useFormik<RoundFormData>({
    initialValues: {
      roundName: roundDetail?.roundName || "",
      roundType: roundDetail?.roundType || "",
      roundObjective: roundDetail?.roundObjective || "",
      duration: roundDetail?.duration || "",
      language: roundDetail?.language || "",
      interviewer: roundDetail?.interviewer || "",
      skills: roundDetail?.skills || [],
      questionType: roundDetail?.questionType || "ai",
      aiGeneratedQuestions: roundDetail?.aiGeneratedQuestions || 0,
      customQuestions: roundDetail?.customQuestions || 0,
      customQuestionTexts: roundDetail?.customQuestionTexts || [],
      interviewInstructions: roundDetail?.interviewInstructions || "",
      allowSkip: roundDetail?.allowSkip || false,
      sendReminder: roundDetail?.sendReminder || false,
      reminderTime: roundDetail?.reminderTime || "3 days",
    },
    validate,
    enableReinitialize: true,
    onSubmit: async (values: RoundFormData) => {
      setIsSubmitting(true);
      try {
        if (isEditMode && roundId) {
          // Calculate dirty fields by comparing current values with initial values
          // Use Formik's touched fields to determine which fields have been edited
          const dirtyFields: Partial<Record<keyof RoundFormData, boolean>> = {};
          Object.keys(formik?.touched).forEach((key) => {
            const fieldKey = key as keyof RoundFormData;
            dirtyFields[fieldKey] = true;
          });

          const updatePayload = transformToUpdateRoundPayload(
            values,
            dirtyFields
          );
          const response = await roundService.updateRound(
            roundId,
            updatePayload
          );
          toast.success(response?.message || "Round updated successfully", {
            duration: 8000,
          });
        } else {
          // Create new round
          const payload = transformToCreateRoundPayload(values, jobId);
          const response = await roundService.createRound({}, payload);
          toast.success(response?.message || "Round created successfully", {
            duration: 8000,
          });
        }

        formik.resetForm();
        setSkillInput("");
        setStep(1);
        onOpenChange(false);
        if (onSubmitCallback) {
          onSubmitCallback();
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

  useEffect(() => {
    setCurrentOffset(0);
    setInterviewers([]);
    fetchInterviewers(0, false);
  }, [formik?.values?.roundType, formik?.values?.language]);

  useEffect(() => {
    if (currentOffset > 0) {
      fetchInterviewers(currentOffset, true);
    }
  }, [currentOffset]);

  // Handle scroll for lazy loading
  useEffect(() => {
    const container = interviewerContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;

      // Load more when scrolled 80% down
      if (
        scrollPercentage >= 0.8 &&
        pagination.nextOffset !== null &&
        pagination?.nextOffset < pagination?.total &&
        !isLoadingInterviewers
      ) {
        setCurrentOffset(pagination.nextOffset);
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [pagination.nextOffset, isLoadingInterviewers]);

  const fetchInterviewers = async (offset: number, append: boolean = false) => {
    setIsLoadingInterviewers(true);
    try {
      const params: Record<string, any> = {
        limit: 10, // Initial load of 10 interviewers
        offset: offset,
      };

      // Build filters based on roundType and language from form
      const filterConditions: any[] = [];

      const roundType = formik.values.roundType;
      const language = formik.values.language;

      if (roundType) {
        filterConditions.push({
          key: "#.records.roundType",
          operator: "$in",
          value: [roundType],
          type: "select",
        });
      }

      if (language) {
        filterConditions.push({
          key: "#.records.language",
          operator: "$in",
          value: [language],
          type: "select",
        });
      }

      const response = await interviewerService.getInterviewers(params, {
        filters: {
          $and: filterConditions,
        },
        appId: "69521cd1c9ba83a076aac3ae",
      });

      const result = transformAPIResponseToInterviewers(
        response?.data || [],
        response?.page || {
          total: 0,
          nextOffset: null,
          previousOffset: null,
          limit: 10,
        }
      );

      if (append) {
        setInterviewers((prev) => [...prev, ...(result?.interviewers || [])]);
      } else {
        setInterviewers(result?.interviewers || []);
      }
      setPagination(result?.pagination);
    } catch (error: any) {
      if (!append) {
        setInterviewers([]);
      }
      toast.error(
        error?.response?.data?.message || "Failed to fetch interviewers",
        {
          duration: 8000,
        }
      );
    } finally {
      setIsLoadingInterviewers(false);
    }
  };

  const handleNext = () => {
    setStep((prev) => (prev + 1) as 1 | 2 | 3);
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((prev) => (prev - 1) as 1 | 2 | 3);
    }
  };

  const handleSubmit = () => {
    formik?.handleSubmit();
  };

  const handleAddSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && skillInput?.trim()) {
      e.preventDefault();
      const trimmedSkill = skillInput?.trim();
      if (!formik?.values?.skills?.includes(trimmedSkill)) {
        formik.setFieldValue("skills", [
          ...formik?.values?.skills,
          trimmedSkill,
        ]);
      }
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    formik.setFieldValue(
      "skills",
      formik.values.skills.filter((skill) => skill !== skillToRemove)
    );
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-[779px] sm:max-w-[779px] sm:w-[779px] p-6 gap-4 max-h-[90vh] overflow-y-auto bg-white border border-[#e5e5e5] rounded-[10px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-2px_rgba(0,0,0,0.1)] [&>button]:top-[15px] [&>button]:right-[15px]"
        showCloseButton={true}
      >
        <DialogHeader className="gap-1.5 text-left pb-0">
          <DialogTitle className="text-lg font-semibold text-[#0a0a0a] leading-none">
            {isEditMode ? "Edit Round" : "Create new round"}
          </DialogTitle>
          <DialogDescription className="sr-only"></DialogDescription>
        </DialogHeader>

        {/* Content */}
        <div className="flex flex-col gap-4">
          {step === 1 && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-4">
                {/* Round name and Round type side by side */}
                <div className="flex gap-[10px]">
                  <div className="flex-1 flex flex-col gap-2">
                    <Label className="text-sm font-medium text-[#0a0a0a] leading-5">
                      Round name <span className="text-[#0a0a0a]">*</span>
                    </Label>
                    <Input
                      name="roundName"
                      value={formik?.values?.roundName}
                      onChange={formik?.handleChange}
                      onBlur={formik?.handleBlur}
                      placeholder="Behavioural round"
                      className={`h-9 shadow-[0px_1px_2px_0px_rgba(2,86,61,0.12)] ${
                        formik?.touched?.roundName && formik?.errors?.roundName
                          ? "border-red-500"
                          : ""
                      }`}
                    />
                    {formik?.touched?.roundName &&
                      formik?.errors?.roundName && (
                        <p className="text-xs text-red-500">
                          {formik?.errors?.roundName}
                        </p>
                      )}
                  </div>
                  <div className="flex-1 flex flex-col gap-2">
                    <Label className="text-sm font-medium text-[#0a0a0a] leading-5">
                      Round type <span className="text-[#0a0a0a]">*</span>
                    </Label>
                    <Select
                      value={formik?.values?.roundType}
                      onValueChange={(value) => {
                        formik?.setFieldValue("roundType", value);
                        formik?.setFieldTouched("roundType", true);
                      }}
                    >
                      <SelectTrigger
                        className={`w-full h-9 shadow-[0px_1px_2px_0px_rgba(2,86,61,0.12)]`}
                      >
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {mappingValues?.createRound?.roundType?.map(
                          (option, index) => (
                            <SelectItem key={index} value={option}>
                              {option}
                            </SelectItem>
                          )
                        )}
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
                      name="roundObjective"
                      value={formik?.values?.roundObjective}
                      onChange={formik?.handleChange}
                      onBlur={formik?.handleBlur}
                      placeholder="Describe what you want to assess in this round..."
                      className={`min-h-[103px] shadow-[0px_1px_2px_0px_rgba(2,86,61,0.12)] pr-24 ${
                        formik?.touched?.roundObjective &&
                        formik?.errors?.roundObjective
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
                  {formik?.touched?.roundObjective &&
                    formik?.errors?.roundObjective && (
                      <p className="text-xs text-red-500">
                        {formik?.errors?.roundObjective}
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
                      value={formik?.values?.duration}
                      onValueChange={(value) => {
                        formik?.setFieldValue("duration", value);
                        formik?.setFieldTouched("duration", true);
                      }}
                    >
                      <SelectTrigger
                        className={`w-full h-9 shadow-[0px_1px_2px_0px_rgba(2,86,61,0.12)] `}
                      >
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {mappingValues?.createRound?.duration?.map(
                          (option, index) => (
                            <SelectItem key={index} value={option}>
                              {option}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-1 flex flex-col gap-2">
                    <Label className="text-sm font-medium text-[#0a0a0a] leading-5">
                      Language <span className="text-[#0a0a0a]">*</span>
                    </Label>
                    <Select
                      value={formik?.values?.language}
                      onValueChange={(value) => {
                        formik?.setFieldValue("language", value);
                        formik?.setFieldTouched("language", true);
                      }}
                    >
                      <SelectTrigger
                        className={`w-full h-9 shadow-[0px_1px_2px_0px_rgba(2,86,61,0.12)]`}
                      >
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {mappingValues?.createRound?.language?.map(
                          (option, index) => (
                            <SelectItem key={index} value={option}>
                              {option}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Select Interviewer - Card based */}
                <div className="flex flex-col gap-2">
                  <Label className="text-sm font-medium text-[#0a0a0a] leading-5">
                    Select Interviewer
                  </Label>
                  <div
                    ref={interviewerContainerRef}
                    className="flex gap-2 flex-wrap max-h-[200px] overflow-y-auto"
                    style={{ scrollbarWidth: "thin" }}
                  >
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
                    {interviewers?.length === 0 && isLoadingInterviewers ? (
                      <div className="flex items-center justify-center w-[70px] h-[98px]">
                        <div className="w-8 h-8 border-2 border-[#02563d] border-t-transparent rounded-full animate-spin" />
                      </div>
                    ) : (
                      <>
                        {interviewers.map((interviewer) => (
                          <button
                            key={interviewer?.id}
                            type="button"
                            onClick={() => selectInterviewer(interviewer?.id)}
                            className={`border rounded p-1 flex flex-col items-center gap-1 w-[70px] h-[98px] transition-all ${
                              formik.values.interviewer === interviewer?.id
                                ? "border-[#02563d] bg-[#f0f5f2] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)]"
                                : "border-[#d1d1d1]"
                            }`}
                          >
                            <div className="relative rounded w-[62px] h-[62px] overflow-hidden">
                              <Image
                                src={
                                  interviewer?.avatar || "/interviewer-male.jpg"
                                }
                                alt={interviewer?.name}
                                fill
                                className="object-cover"
                                sizes="62px"
                              />
                            </div>
                            <p className="text-xs text-[#737373] leading-none text-center w-[62px]">
                              {interviewer?.name}
                            </p>
                          </button>
                        ))}
                        {isLoadingInterviewers && interviewers.length > 0 && (
                          <div className="flex items-center justify-center w-[70px] h-[98px]">
                            <div className="w-6 h-6 border-2 border-[#02563d] border-t-transparent rounded-full animate-spin" />
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* Skills for round */}
                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="skills"
                    className="text-sm font-medium text-[#0a0a0a] leading-5"
                  >
                    Skills for round <span className="text-[#b91c1c]">*</span>
                  </Label>
                  <div
                    className={`flex flex-wrap gap-1 p-3 border rounded-lg shadow-[0px_1px_2px_0px_rgba(2,86,61,0.12)] min-h-[36px] bg-white items-center ${
                      formik?.touched?.skills && formik?.errors?.skills
                        ? "border-red-500"
                        : "border-[#e5e5e5]"
                    }`}
                  >
                    {formik?.values?.skills?.map((skill) => (
                      <Badge
                        key={skill}
                        variant="secondary"
                        className="flex items-center gap-0.5 h-[18px] bg-[#e5e5e5] text-[#000000] text-xs font-normal tracking-[0.3px] rounded-full px-2 border-0"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => {
                            formik?.setFieldTouched("skills", true);
                            handleRemoveSkill(skill);
                          }}
                          className="ml-0.5 hover:bg-[rgba(0,0,0,0.1)] rounded-full"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                    <Input
                      id="skills"
                      placeholder={
                        formik?.values?.skills?.length === 0 ? "Add skills" : ""
                      }
                      value={skillInput}
                      onChange={(e) => setSkillInput(e?.target?.value)}
                      onBlur={() => formik?.setFieldTouched("skills", true)}
                      onKeyDown={handleAddSkill}
                      className="flex-1 min-w-[120px] border-0 shadow-none focus-visible:ring-0 p-0 h-auto text-sm"
                    />
                  </div>
                  {formik?.touched?.skills && formik?.errors?.skills && (
                    <p className="text-xs text-red-500">
                      {formik?.errors?.skills}
                    </p>
                  )}
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
                    value={formik?.values?.questionType}
                    onValueChange={(value) => {
                      formik?.setFieldValue(
                        "questionType",
                        value as "ai" | "hybrid" | "custom"
                      );

                      formik?.setFieldTouched("questionType", true);
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
                        formik?.values?.questionType === "ai"
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
                        formik?.values?.questionType === "hybrid"
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
                {formik?.values?.questionType === "ai" && (
                  <div className="flex flex-col gap-2">
                    <Label className="text-sm font-medium text-[#0a0a0a] leading-5">
                      No. of AI generated questions{" "}
                      <span className="text-[#0a0a0a]">*</span>
                    </Label>
                    <Select
                      value={formik?.values?.aiGeneratedQuestions?.toString()}
                      onValueChange={(value) => {
                        formik?.setFieldValue(
                          "aiGeneratedQuestions",
                          parseInt(value)
                        );
                        formik.setFieldTouched("aiGeneratedQuestions", true);
                      }}
                    >
                      <SelectTrigger
                        className={`w-full h-9 shadow-[0px_1px_2px_0px_rgba(2,86,61,0.12)] `}
                      >
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {[
                          0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
                        ].map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Hybrid mode - AI and Custom questions side by side */}
                {formik?.values?.questionType === "hybrid" && (
                  <div className="flex flex-col gap-5">
                    {/* No. of AI and Custom questions side by side */}
                    <div className="flex gap-5">
                      <div className="flex-1 flex flex-col gap-2">
                        <Label className="text-sm font-medium text-[#0a0a0a] leading-5">
                          No. of AI generated questions{" "}
                          <span className="text-[#0a0a0a]">*</span>
                        </Label>
                        <Select
                          value={formik?.values?.aiGeneratedQuestions?.toString()}
                          onValueChange={(value) => {
                            formik?.setFieldValue(
                              "aiGeneratedQuestions",
                              parseInt(value)
                            );
                            formik?.setFieldTouched(
                              "aiGeneratedQuestions",
                              true
                            );
                          }}
                        >
                          <SelectTrigger
                            className={`w-full h-9 shadow-[0px_1px_2px_0px_rgba(2,86,61,0.12)] `}
                          >
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {[
                              1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
                            ].map((num) => (
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
                          value={formik?.values?.customQuestions?.toString()}
                          onValueChange={(value) => {
                            const num = parseInt(value);
                            const currentCount =
                              formik?.values?.customQuestionTexts?.length;
                            const newTexts = [
                              ...formik?.values?.customQuestionTexts,
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
                            className={`w-full h-9 shadow-[0px_1px_2px_0px_rgba(2,86,61,0.12)]`}
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[
                              1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
                            ].map((num) => (
                              <SelectItem key={num} value={num.toString()}>
                                {num}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Custom question inputs */}
                    {formik?.values?.customQuestionTexts?.map(
                      (question, index) => (
                        <div key={index} className="flex flex-col gap-2">
                          <Label className="text-sm font-medium text-[#0a0a0a] leading-5">
                            Question {index + 1}.{" "}
                            <span className="text-[#0a0a0a]">*</span>
                          </Label>
                          <Input
                            value={question}
                            onChange={(e) =>
                              updateCustomQuestion(index, e?.target?.value)
                            }
                            onBlur={() =>
                              formik?.setFieldTouched(
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
                    value={formik?.values?.interviewInstructions}
                    onChange={formik?.handleChange}
                    onBlur={formik?.handleBlur}
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
                        <div className="pointer-events-auto">
                          <Switch
                            checked={formik?.values?.allowSkip}
                            onCheckedChange={(checked) => {
                              formik?.setFieldValue("allowSkip", checked);
                              formik?.setFieldTouched("allowSkip", true);
                            }}
                          />
                        </div>
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
                          checked={Boolean(formik?.values?.sendReminder)}
                          onCheckedChange={(checked) => {
                            formik.setFieldValue("sendReminder", checked);
                            formik?.setFieldTouched("sendReminder", true);
                          }}
                        />
                      </div>
                      {formik.values.sendReminder && (
                        <div className="flex flex-col gap-2">
                          <Label className="text-sm font-medium text-[#0a0a0a] leading-5">
                            Set reminder time
                          </Label>
                          <Select
                            value={formik?.values?.reminderTime}
                            onValueChange={(value) => {
                              formik?.setFieldValue("reminderTime", value);
                              formik?.setFieldTouched("reminderTime", true);
                            }}
                          >
                            <SelectTrigger className="w-full h-9 shadow-[0px_1px_2px_0px_rgba(2,86,61,0.12)]">
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                              {mappingValues?.createRound?.reminderTime?.map(
                                (option, index) => (
                                  <SelectItem key={index} value={option}>
                                    {option}
                                  </SelectItem>
                                )
                              )}
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
              isSubmitting || (step < 3 && !isStepValid(step, formik?.values))
            }
            className="h-9 px-4 text-sm font-medium bg-[#02563d] text-white hover:bg-[#02563d]/90 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting
              ? isEditMode
                ? "Updating..."
                : "Creating..."
              : step === 3
              ? isEditMode
                ? "Update round"
                : "Create round"
              : "Next"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
