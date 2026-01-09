"use client";

import { useFormik } from "formik";
import { toast } from "sonner";
import { useMemo, useState } from "react";
import { X } from "lucide-react";

import {
  Dialog,
  DialogContent,
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
import {
  transformToAPIPayload,
  transformToUpdatePayload,
} from "../utils/interviewer.utils";
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

  if (!values.name?.trim()) errors.name = "Interviewer name is required";
  if (!values.voice) errors.voice = "Voice is required";
  if (!values.skills.length) errors.skills = "At least one skill is required";
  if (!values.roundType) errors.roundType = "Round type is required";

  return errors;
};

export function CreateInterviewerModal({
  open,
  onOpenChange,
  onSubmit: onSubmitCallback,
  isEditMode = false,
  interviewerDetail,
  interviewerId,
}: CreateInterviewerModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [skillInput, setSkillInput] = useState("");

  const initialValues = useMemo<InterviewerFormData>(
    () => ({
      name: interviewerDetail?.name || "",
      voice: interviewerDetail?.voice || "",
      description: interviewerDetail?.description || "",
      skills: interviewerDetail?.skills || [],
      roundType: interviewerDetail?.roundType || "",
      language: interviewerDetail?.language || "",
      personality: {
        empathy: interviewerDetail?.personality?.empathy || 0,
        rapport: interviewerDetail?.personality?.rapport || 0,
        exploration: interviewerDetail?.personality?.exploration || 0,
        speed: interviewerDetail?.personality?.speed || 0,
      },
    }),
    [interviewerDetail]
  );

  const formik = useFormik<InterviewerFormData>({
    enableReinitialize: true,
    initialValues,
    validate,
    onSubmit: async (values, { resetForm }) => {
      setIsSubmitting(true);
      try {
        if (isEditMode && interviewerId) {
          if (!formik.dirty) {
            onOpenChange(false);
            return;
          }

          const payload = transformToUpdatePayload(values, initialValues);

          await interviewerService.updateInterviewer(interviewerId, payload);
          toast.success("Interviewer updated successfully");
        } else {
          const payload = transformToAPIPayload(values);
          await interviewerService.createInterviewer({}, payload);
          toast.success("Interviewer created successfully");
        }

        resetForm();
        setSkillInput("");
        onSubmitCallback?.();
        onOpenChange(false);
      } catch (error: any) {
        toast.error(
          error?.response?.data?.message || "An unknown error occurred"
        );
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const handleAddSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && skillInput.trim()) {
      e.preventDefault();
      const trimmed = skillInput.trim();

      if (!formik.values.skills.includes(trimmed)) {
        formik.setFieldValue("skills", [...formik.values.skills, trimmed]);
      }
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skill: string) => {
    formik.setFieldValue(
      "skills",
      formik.values.skills.filter((s) => s !== skill)
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[780px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit interviewer" : "Create interviewer"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {/* Name & Voice */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Interviewer name *</Label>
              <Input {...formik.getFieldProps("name")} />
            </div>

            <div>
              <Label>Voice *</Label>
              <Select
                value={formik.values.voice}
                onValueChange={(v) => formik.setFieldValue("voice", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {voiceOptions.map((v) => (
                    <SelectItem key={v.value} value={v.value}>
                      {v.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Description */}
          <div>
            <Label>About interviewer</Label>
            <Textarea {...formik.getFieldProps("description")} />
          </div>

          {/* Skills */}
          <div>
            <Label>Skills *</Label>
            <div className="flex flex-wrap gap-2 border rounded p-2">
              {formik.values.skills.map((skill) => (
                <Badge key={skill} className="flex items-center gap-1">
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
              <Input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleAddSkill}
                className="border-0 shadow-none"
                placeholder="Add skill"
              />
            </div>
          </div>

          {/* Round & Language */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Round type *</Label>
              <Select
                value={formik.values.roundType}
                onValueChange={(v) => formik.setFieldValue("roundType", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {roundTypeOptions.map((r) => (
                    <SelectItem key={r.value} value={r.value}>
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Language</Label>
              <Select
                value={formik.values.language}
                onValueChange={(v) => formik.setFieldValue("language", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {languageOptions.map((l) => (
                    <SelectItem key={l.value} value={l.value}>
                      {l.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Personality */}
          {(["empathy", "rapport", "exploration", "speed"] as const).map(
            (key) => (
              <div key={key} className="flex items-center gap-4">
                <Label className="w-24 capitalize">{key}</Label>
                <Slider
                  max={10}
                  step={1}
                  value={[formik.values.personality[key]]}
                  onValueChange={(v) =>
                    formik.setFieldValue(`personality.${key}`, v[0])
                  }
                />
              </div>
            )
          )}

          <DialogFooter>
            <Button
              type="submit"
              disabled={
                isSubmitting || !formik.isValid || (isEditMode && !formik.dirty)
              }
            >
              {isEditMode ? "Update interviewer" : "Create interviewer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
