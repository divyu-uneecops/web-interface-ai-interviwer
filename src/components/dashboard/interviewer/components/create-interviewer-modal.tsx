"use client";

import * as React from "react";
import { useFormik } from "formik";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { interviewerService } from "../services/interviewer.services";
import { transformToAPIPayload } from "../utils/interviewer.utils";

interface CreateInterviewerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: InterviewerFormData) => void;
}

export interface InterviewerFormData {
  name: string;
  voice: string;
  description: string;
  skills: string;
  roundType: string;
  language: string;
  personality: {
    empathy: number;
    rapport: number;
    exploration: number;
    speed: number;
  };
}

const voiceOptions = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
];

const roundTypeOptions = [
  { value: "Technical", label: "Technical" },
  { value: "Behavioral", label: "Behavioral" },
  { value: "HR Round", label: "HR Round" },
  { value: "Screening", label: "Screening" },
];

const languageOptions = [{ value: "English", label: "English" }];

const validate = (values: InterviewerFormData) => {
  const errors: Partial<Record<keyof InterviewerFormData, string>> = {};

  if (!values.name || values.name.trim() === "") {
    errors.name = "Interviewer name is required";
  }

  if (!values.voice || values.voice.trim() === "") {
    errors.voice = "Voice is required";
  }

  if (!values.skills || values.skills.trim() === "") {
    errors.skills = "Interviewer skills are required";
  }

  if (!values.roundType || values.roundType.trim() === "") {
    errors.roundType = "Round type is required";
  }

  return errors;
};

export function CreateInterviewerModal({
  open,
  onOpenChange,
  onSubmit,
}: CreateInterviewerModalProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const formik = useFormik<InterviewerFormData>({
    initialValues: {
      name: "",
      voice: "",
      description: "",
      skills: "",
      roundType: "",
      language: "",
      personality: {
        empathy: 100,
        rapport: 100,
        exploration: 100,
        speed: 100,
      },
    },
    validate,
    onSubmit: async (values, { resetForm }) => {
      setIsSubmitting(true);
      try {
        const payload = transformToAPIPayload(values);
        const response = await interviewerService.createInterviewer(
          {},
          payload
        );
        toast.success(response?.message || "Interviewer created successfully", {
          duration: 8000,
        });
        onSubmit?.(values);
        resetForm();
        onOpenChange(false);
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

  React.useEffect(() => {
    if (!open) {
      formik.resetForm();
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[779px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create interviewer</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          {/* Basic Information Section */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Interviewer Name */}
              <div className="space-y-2">
                <Label htmlFor="name">
                  Interviewer name <span className="text-neutral-950">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Maya"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="shadow-[0px_1px_2px_0px_rgba(2,86,61,0.12)]"
                />
                {formik.touched.name && formik.errors.name && (
                  <p className="text-sm text-red-500">{formik.errors.name}</p>
                )}
              </div>

              {/* Voice */}
              <div className="space-y-2">
                <Label htmlFor="voice">
                  Voice <span className="text-neutral-950">*</span>
                </Label>
                <Select
                  value={formik.values.voice}
                  onValueChange={(value) =>
                    formik.setFieldValue("voice", value)
                  }
                >
                  <SelectTrigger className="w-full shadow-[0px_1px_2px_0px_rgba(2,86,61,0.12)]">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {voiceOptions?.map((option) => (
                      <SelectItem key={option?.value} value={option?.value}>
                        {option?.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formik.touched.voice && formik.errors.voice && (
                  <p className="text-sm text-red-500">{formik.errors.voice}</p>
                )}
              </div>
            </div>

            {/* About Interviewer */}
            <div className="space-y-2 relative">
              <div className="flex items-center justify-between">
                <Label htmlFor="about">About interviewer</Label>
                <button
                  type="button"
                  className="text-sm text-[#02563d] underline hover:text-[#02563d]/80"
                >
                  Generate from AI
                </button>
              </div>
              <Textarea
                id="description"
                name="description"
                placeholder="Write about interviewer...."
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="min-h-[103px] shadow-[0px_1px_2px_0px_rgba(2,86,61,0.12)]"
              />
            </div>

            {/* Interviewer Skills */}
            <div className="space-y-2">
              <Label htmlFor="skills">
                Interviewer skills <span className="text-neutral-950">*</span>
              </Label>
              <Input
                id="skills"
                name="skills"
                placeholder="Add skills"
                value={formik.values.skills}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="shadow-[0px_1px_2px_0px_rgba(2,86,61,0.12)]"
              />
              {formik.touched.skills && formik.errors.skills && (
                <p className="text-sm text-red-500">{formik.errors.skills}</p>
              )}
            </div>

            {/* Round Type and Language */}
            <div className="grid grid-cols-2 gap-4">
              {/* Round Type */}
              <div className="space-y-2">
                <Label htmlFor="roundType">
                  Round type <span className="text-neutral-950">*</span>
                </Label>
                <Select
                  value={formik.values.roundType}
                  onValueChange={(value) =>
                    formik.setFieldValue("roundType", value)
                  }
                >
                  <SelectTrigger className="w-full shadow-[0px_1px_2px_0px_rgba(2,86,61,0.12)] opacity-50">
                    <SelectValue placeholder="Behavioural" />
                  </SelectTrigger>
                  <SelectContent>
                    {roundTypeOptions.map((option) => (
                      <SelectItem key={option?.value} value={option?.value}>
                        {option?.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Language */}
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select
                  value={formik.values.language}
                  onValueChange={(value) =>
                    formik.setFieldValue("language", value)
                  }
                >
                  <SelectTrigger className="w-full shadow-[0px_1px_2px_0px_rgba(2,86,61,0.12)]">
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
          </div>

          {/* Personality Traits Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-[#0a0a0a]">
              Personality traits
            </h3>

            <div className="space-y-6">
              {/* Empathy */}
              <div className="flex items-center gap-4">
                <div className="w-20 shrink-0">
                  <Label className="text-sm font-medium">Empathy</Label>
                </div>
                <Slider
                  value={[formik.values.personality.empathy]}
                  onValueChange={(value) =>
                    formik.setFieldValue("personality.empathy", value[0])
                  }
                  max={100}
                  step={1}
                  className="flex-1"
                />
              </div>

              {/* Rapport */}
              <div className="flex items-center gap-4">
                <div className="w-20 shrink-0">
                  <Label className="text-sm font-medium">Rapport</Label>
                </div>
                <Slider
                  value={[formik.values.personality.rapport]}
                  onValueChange={(value) =>
                    formik.setFieldValue("personality.rapport", value[0])
                  }
                  max={100}
                  step={1}
                  className="flex-1"
                />
              </div>

              {/* Exploration */}
              <div className="flex items-center gap-4">
                <div className="w-20 shrink-0">
                  <Label className="text-sm font-medium">Exploration</Label>
                </div>
                <Slider
                  value={[formik.values.personality.exploration]}
                  onValueChange={(value) =>
                    formik.setFieldValue("personality.exploration", value[0])
                  }
                  max={100}
                  step={1}
                  className="flex-1"
                />
              </div>

              {/* Speed */}
              <div className="flex items-center gap-4">
                <div className="w-20 shrink-0">
                  <Label className="text-sm font-medium">Speed</Label>
                </div>
                <Slider
                  value={[formik.values.personality.speed]}
                  onValueChange={(value) =>
                    formik.setFieldValue("personality.speed", value[0])
                  }
                  max={100}
                  step={1}
                  className="flex-1"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isSubmitting || !formik.isValid}>
              {isSubmitting ? "Creating..." : "Create interviewer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
