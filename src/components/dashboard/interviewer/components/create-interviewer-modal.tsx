"use client";

import { useFormik } from "formik";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { X } from "lucide-react";

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
import { Badge } from "@/components/ui/badge";

import { interviewerService } from "../services/interviewer.services";
import { transformToAPIPayload } from "../utils/interviewer.utils";
import {
  CreateInterviewerModalProps,
  InterviewerFormData,
} from "../interfaces/interviewer.interfaces";
import {
  voiceOptions,
  roundTypeOptions,
  languageOptions,
} from "../constants/interviewer.constants";

const validate = (values: InterviewerFormData) => {
  const errors: Partial<Record<keyof InterviewerFormData, string>> = {};

  if (!values.name || values.name.trim() === "") {
    errors.name = "Interviewer name is required";
  }

  if (!values.voice || values.voice.trim() === "") {
    errors.voice = "Voice is required";
  }

  if (!values.skills || values.skills.length === 0) {
    errors.skills = "At least one skill is required";
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [skillInput, setSkillInput] = useState("");

  const formik = useFormik<InterviewerFormData>({
    initialValues: {
      name: "",
      voice: "",
      description: "",
      skills: [],
      roundType: "",
      language: "",
      personality: {
        empathy: 0,
        rapport: 0,
        exploration: 0,
        speed: 0,
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
        setSkillInput("");
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

  useEffect(() => {
    if (!open) {
      formik.resetForm();
      setSkillInput("");
    }
  }, [open]);

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[779px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create interviewer</DialogTitle>
          <DialogDescription className="sr-only"></DialogDescription>
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
              <Label
                htmlFor="skills"
                className="text-sm font-medium text-[#0a0a0a] leading-none"
              >
                Interviewer skills <span className="text-red-700">*</span>
              </Label>
              <div
                className={`flex flex-wrap gap-1 p-3 border rounded-lg shadow-[0px_1px_2px_0px_rgba(2,86,61,0.12)] min-h-[36px] bg-white items-center ${
                  formik.touched.skills && formik.errors.skills
                    ? "border-red-500"
                    : "border-[#e5e5e5]"
                }`}
              >
                {formik.values.skills?.map((skill) => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className="flex items-center gap-0.5 h-[18px] bg-[#e5e5e5] text-[#000000] text-xs font-normal tracking-[0.3px] rounded-full px-2 border-0"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="ml-0.5 hover:bg-[rgba(0,0,0,0.1)] rounded-full"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
                <Input
                  id="skills"
                  placeholder={
                    formik.values.skills.length === 0 ? "Add skills" : ""
                  }
                  value={skillInput}
                  onChange={(e) => setSkillInput(e?.target?.value)}
                  onBlur={() => formik.setFieldTouched("skills", true)}
                  onKeyDown={handleAddSkill}
                  className="flex-1 min-w-[120px] border-0 shadow-none focus-visible:ring-0 p-0 h-auto text-sm"
                />
              </div>
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
                  <SelectTrigger className="w-full shadow-[0px_1px_2px_0px_rgba(2,86,61,0.12)]">
                    <SelectValue placeholder="Select" />
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
                  max={10}
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
                  max={10}
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
                  max={10}
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
                  max={10}
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
