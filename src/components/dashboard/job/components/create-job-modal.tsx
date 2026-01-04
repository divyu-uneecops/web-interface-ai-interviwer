"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

import { jobService } from "../services/job.service";
import { CreateJobModalProps, JobFormData } from "../interfaces/job.interface";
import { transformToAPIPayload, validate } from "../utils/job.utils";
import {
  domainOptions,
  experienceOptions,
  jobLevelOptions,
  openingsOptions,
  statusOptions,
  userTypeOptions,
} from "../constants/job.constants";

export function CreateJobModal({
  open,
  onOpenChange,
  onSuccess,
  mappingValues,
  isEditMode = false,
  jobDetail,
}: CreateJobModalProps) {
  const [skillInput, setSkillInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formik = useFormik<JobFormData>({
    initialValues: {
      title: "",
      industry: "",
      jobLevel: "",
      jobType: "",
      minExperience: null,
      maxExperience: null,
      description: "",
      noOfOpenings: null,
      attachment: null,
      status: "",
      skills: [],
    },
    validate: validate,
    enableReinitialize: true,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        if (isEditMode) {
          // Edit mode - update existing job
          // Use the jobId from job detail if available, otherwise use the record ID
          // const payloadJobId = jobDetailJobId || jobId;
          // const payload = transformToAPIPayload(values, payloadJobId);
          // const response = await jobService.updateJobOpening(
          //   jobId,
          //   { appId: "69521cd1c9ba83a076aac3ae" },
          //   payload
          // );
          // toast.success(response?.message || "Job updated successfully", {
          //   duration: 8000,
          // });
        } else {
          // Create mode - create new job
          const payload = transformToAPIPayload(values);
          const response = await jobService.createJobOpening({}, payload);
          toast.success(response?.message || "Job created successfully", {
            duration: 8000,
          });
        }
        formik.resetForm();
        setSkillInput("");
        onOpenChange(false);
        if (onSuccess) {
          onSuccess();
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

  // Fetch job data when in edit mode
  useEffect(() => {
    if (open && isEditMode) {
      formik.setValues(jobDetail as JobFormData);
    } else if (!open) {
      // Reset form when modal closes
      formik.resetForm();
      setSkillInput("");
    }
  }, [open, isEditMode]);

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
      <DialogContent className="sm:max-w-[779px] max-h-[90vh] overflow-y-auto p-6 gap-4">
        <DialogHeader className="gap-1.5">
          <DialogTitle className="text-lg font-semibold text-[#0a0a0a] leading-none">
            {isEditMode ? "Edit Job" : "Create New Job"}
          </DialogTitle>
          <DialogDescription className="sr-only"></DialogDescription>
        </DialogHeader>

        <form onSubmit={formik?.handleSubmit} className="space-y-4">
          {/* Basic job details Section */}
          <div className="space-y-4">
            {/* Parse job documentation */}
            <div className="space-y-2">
              <Label className="font-semibold text-sm text-[#000000]">
                Parse job documentation
              </Label>
              <div className="border border-dashed border-[#d1d1d1] rounded bg-transparent h-[114px] flex items-center justify-center">
                <div className="flex flex-col items-center gap-2 px-4 py-8 text-center">
                  <p className="text-sm text-[#02563d] leading-5 w-[188px]">
                    Drag and drop files here or click to upload
                  </p>
                  <p className="text-xs text-[#747474] leading-none">
                    Max file size is 500kb. Supported file types are .jpg and
                    .png.
                  </p>
                </div>
              </div>
            </div>

            {/* Or divider */}
            <div className="flex items-center justify-center gap-2.5 w-full">
              <div className="flex-1 h-px bg-[#e5e5e5]" />
              <span className="text-sm text-[#737373] leading-none">or</span>
              <div className="flex-1 h-px bg-[#e5e5e5]" />
            </div>

            {/* Job Title */}
            <div className="space-y-2">
              <Label
                htmlFor="title"
                className="text-sm font-medium text-[#0a0a0a] leading-none"
              >
                Job title <span className="text-red-700">*</span>
              </Label>
              <Input
                id="title"
                name="title"
                placeholder="e.g. senior product manager"
                value={formik.values.title}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`h-9 shadow-[0px_1px_2px_0px_rgba(2,86,61,0.12)] border-[#e5e5e5] ${
                  formik.touched.title && formik.errors.title
                    ? "border-red-500"
                    : ""
                }`}
              />
            </div>

            {/* Domain, Job Level, User Type */}
            <div className="grid grid-cols-3 gap-2.5">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-[#0a0a0a] leading-none">
                  Industry
                </Label>
                <Select
                  value={formik.values.industry}
                  onValueChange={(value) => {
                    formik.setFieldValue("industry", value);
                    formik.setFieldTouched("industry", true);
                  }}
                >
                  <SelectTrigger className="w-full h-9 shadow-[0px_1px_2px_0px_rgba(2,86,61,0.12)] border-[#e5e5e5]">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {mappingValues?.industry?.map((option, index) => (
                      <SelectItem key={index} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-[#0a0a0a] leading-none">
                  Job level
                </Label>
                <Select
                  value={formik.values.jobLevel}
                  onValueChange={(value) => {
                    formik.setFieldValue("jobLevel", value);
                    formik.setFieldTouched("jobLevel", true);
                  }}
                >
                  <SelectTrigger
                    className={`w-full h-9 shadow-[0px_1px_2px_0px_rgba(2,86,61,0.12)] border-[#e5e5e5] ${
                      formik.touched.jobLevel && formik.errors.jobLevel
                        ? "border-red-500"
                        : ""
                    }`}
                  >
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {mappingValues?.jobLevel?.map((option, index) => (
                      <SelectItem key={index} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-[#0a0a0a] leading-none">
                  Job type
                </Label>
                <Select
                  value={formik.values.jobType}
                  onValueChange={(value) => {
                    formik.setFieldValue("jobType", value);
                    formik.setFieldTouched("jobType", true);
                  }}
                >
                  <SelectTrigger
                    className={`w-full h-9 shadow-[0px_1px_2px_0px_rgba(2,86,61,0.12)] border-[#e5e5e5] ${
                      formik.touched.jobType && formik.errors.jobType
                        ? "border-red-500"
                        : ""
                    }`}
                  >
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {mappingValues?.jobType?.map((option, index) => (
                      <SelectItem key={index} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Min/Max Experience */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-[#0a0a0a] leading-none">
                  Min experience <span className="text-red-700">*</span>
                </Label>
                <Select
                  value={formik?.values?.minExperience?.toString() || ""}
                  onValueChange={(value) => {
                    formik.setFieldValue("minExperience", Number(value));
                    formik.setFieldTouched("minExperience", true);
                  }}
                >
                  <SelectTrigger
                    className={`w-full h-9 shadow-[0px_1px_2px_0px_rgba(2,86,61,0.12)] border-[#e5e5e5] ${
                      formik.touched.minExperience &&
                      formik.errors.minExperience
                        ? "border-red-500"
                        : ""
                    }`}
                  >
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {experienceOptions?.map((option) => (
                      <SelectItem key={option?.value} value={option?.value}>
                        {option?.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-[#0a0a0a] leading-none">
                  Max experience <span className="text-red-700">*</span>
                </Label>
                <Select
                  value={formik?.values?.maxExperience?.toString() || ""}
                  onValueChange={(value) => {
                    formik.setFieldValue("maxExperience", Number(value));
                    formik.setFieldTouched("maxExperience", true);
                  }}
                >
                  <SelectTrigger
                    className={`w-full h-9 shadow-[0px_1px_2px_0px_rgba(2,86,61,0.12)] border-[#e5e5e5] ${
                      formik.touched.maxExperience &&
                      formik.errors.maxExperience
                        ? "border-red-500"
                        : ""
                    }`}
                  >
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {experienceOptions?.map((option) => (
                      <SelectItem key={option?.value} value={option?.value}>
                        {option?.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Job Description */}
            <div className="space-y-2 relative">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="description"
                  className="text-sm font-medium text-[#0a0a0a] leading-none"
                >
                  Job description <span className="text-red-700">*</span>
                </Label>
                <button
                  type="button"
                  className="text-sm text-[#02563d] underline leading-none hover:text-[#02563d]/80 absolute right-0 top-0"
                >
                  Generate from AI
                </button>
              </div>
              <Textarea
                id="description"
                name="description"
                placeholder="Write a short description of the job"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`min-h-[75px] shadow-[0px_1px_2px_0px_rgba(2,86,61,0.12)] border-[#e5e5e5] resize-none ${
                  formik.touched.description && formik.errors.description
                    ? "border-red-500"
                    : ""
                }`}
              />
            </div>

            {/* No. of openings, Attachment, Job status */}
            <div className="grid grid-cols-3 gap-2.5">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-[#0a0a0a] leading-none">
                  No. of openings
                </Label>
                <Select
                  value={formik?.values?.noOfOpenings?.toString() || ""}
                  onValueChange={(value) => {
                    formik.setFieldValue("noOfOpenings", Number(value));
                    formik.setFieldTouched("noOfOpenings", true);
                  }}
                >
                  <SelectTrigger className="w-full h-9 shadow-[0px_1px_2px_0px_rgba(2,86,61,0.12)] border-[#e5e5e5]">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {openingsOptions?.map((option) => (
                      <SelectItem key={option?.value} value={option?.value}>
                        {option?.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-[#0a0a0a] leading-none">
                  Attachment
                </Label>
                <div className="h-9 bg-white border border-[#e5e5e5] rounded-lg shadow-[0px_1px_2px_0px_rgba(2,86,61,0.12)] flex items-center px-3">
                  <button
                    type="button"
                    className="text-sm font-medium text-[#0a0a0a] px-1.5 py-px"
                  >
                    Choose file
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-[#0a0a0a] leading-none">
                  Job status <span className="text-red-700">*</span>
                </Label>
                <Select
                  value={formik.values.status}
                  onValueChange={(value) => {
                    formik.setFieldValue("status", value);
                    formik.setFieldTouched("status", true);
                  }}
                >
                  <SelectTrigger
                    className={`w-full h-9 shadow-[0px_1px_2px_0px_rgba(2,86,61,0.12)] border-[#e5e5e5] ${
                      formik.touched.status && formik.errors.status
                        ? "border-red-500"
                        : ""
                    }`}
                  >
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions?.map((option) => (
                      <SelectItem key={option?.value} value={option?.value}>
                        {option?.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Required Skills */}
            <div className="space-y-2">
              <Label
                htmlFor="skills"
                className="text-sm font-medium text-[#0a0a0a] leading-none"
              >
                Required skills <span className="text-red-700">*</span>
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
            </div>
          </div>

          <DialogFooter className="sm:justify-end">
            <Button
              type="submit"
              className="bg-[#02563d] hover:bg-[#02563d]/90 text-white h-9 px-4 rounded-lg shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]"
              disabled={
                isSubmitting || !formik.isValid || (!formik.dirty && isEditMode)
              }
            >
              {isSubmitting
                ? isEditMode
                  ? "Updating..."
                  : "Creating..."
                : isEditMode
                ? "Update job"
                : "Create job"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
