"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useFormik } from "formik";
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

const domainOptions = [
  { value: "engineering", label: "Engineering" },
  { value: "technical", label: "Technical" },
  { value: "product", label: "Product" },
  { value: "design", label: "Design" },
  { value: "marketing", label: "Marketing" },
  { value: "sales", label: "Sales" },
  { value: "hr", label: "Human Resources" },
];

const jobLevelOptions = [
  { value: "junior", label: "Junior" },
  { value: "mid", label: "Mid" },
  { value: "senior", label: "Senior" },
  { value: "lead", label: "Lead" },
  { value: "manager", label: "Manager" },
  { value: "director", label: "Director" },
];

const userTypeOptions = [
  { value: "full-time", label: "Full time" },
  { value: "part-time", label: "Part time" },
  { value: "contract", label: "Contract" },
  { value: "intern", label: "Intern" },
];

const experienceOptions = [
  { value: "0", label: "0 year" },
  { value: "1", label: "1 year" },
  { value: "2", label: "2 years" },
  { value: "3", label: "3 years" },
  { value: "4", label: "4 years" },
  { value: "5", label: "5 years" },
  { value: "6", label: "6 years" },
  { value: "7", label: "7 years" },
  { value: "8", label: "8+ years" },
];

const openingsOptions = [
  { value: "1", label: "1" },
  { value: "2", label: "2" },
  { value: "3", label: "3" },
  { value: "4", label: "4" },
  { value: "5", label: "5" },
  { value: "10", label: "10" },
];

const statusOptions = [
  { value: "active", label: "Active" },
  { value: "draft", label: "Draft" },
  { value: "closed", label: "Closed" },
];

// Mapping functions for API format
const mapDomainToAPI = (domain: string): string => {
  const domainMap: Record<string, string> = {
    engineering: "Engineering",
    technical: "Technical",
    product: "Product",
    design: "Design",
    marketing: "Marketing",
    sales: "Sales",
    hr: "Human Resources",
  };
  return domainMap[domain] || "Engineering";
};

const mapJobLevelToAPI = (jobLevel: string): string => {
  const levelMap: Record<string, string> = {
    junior: "Entry Level",
    mid: "Mid Level",
    senior: "Senior Level",
    lead: "Lead",
    manager: "Manager",
    director: "VP/Executive",
  };
  return levelMap[jobLevel] || "Mid Level";
};

const mapUserTypeToAPI = (userType: string): string => {
  const typeMap: Record<string, string> = {
    "full-time": "Full Time",
    "part-time": "Part Time",
    contract: "Contract",
    intern: "Intern",
  };
  return typeMap[userType] || "Full Time";
};

const mapStatusToAPI = (status: string): string => {
  return status.charAt(0).toUpperCase() + status.slice(1);
};

// Transform form data to API payload format
const transformToAPIPayload = (values: JobFormData) => {
  // Generate a unique jobID (you might want to get this from the backend)
  const jobID = Math.floor(Math.random() * 1000) + 100;

  // Transform skills to API format
  const requiredSkills = values.skills.map((skill) => [
    {
      propertyId: "694a3306c9ba83a076aac1b2",
      key: "skill",
      value: skill,
    },
  ]);

  const valuesArray = [
    {
      propertyId: "694a378dc9ba83a076aac1d5",
      key: "jobID",
      value: jobID,
    },
    {
      propertyId: "694a23bec9ba83a076aac179",
      key: "title",
      value: values.title,
    },
    ...(values.industry
      ? [
          {
            propertyId: "694a23f0c9ba83a076aac17a",
            key: "domain",
            value: mapDomainToAPI(values.industry),
          },
        ]
      : []),
    ...(values.jobType
      ? [
          {
            propertyId: "694a2412c9ba83a076aac17b",
            key: "employmentType",
            value: mapUserTypeToAPI(values.jobType),
          },
        ]
      : []),
    ...(values.jobLevel
      ? [
          {
            propertyId: "694a2b80c9ba83a076aac188",
            key: "jobLevel",
            value: mapJobLevelToAPI(values.jobLevel),
          },
        ]
      : []),
    {
      propertyId: "694a2c0ec9ba83a076aac18b",
      key: "minExp",
      value: parseFloat(values.minExperience) || 0,
    },
    {
      propertyId: "694a2c2ac9ba83a076aac18c",
      key: "maxExp",
      value: parseFloat(values.maxExperience) || 0,
    },
    {
      propertyId: "694a2c48c9ba83a076aac18d",
      key: "description",
      value: values.description,
    },
    ...(values.noOfOpenings
      ? [
          {
            propertyId: "694a2c8ec9ba83a076aac18e",
            key: "numOfOpenings",
            value: parseInt(values.noOfOpenings) || 1,
          },
        ]
      : []),
    {
      propertyId: "694a2511c9ba83a076aac17f",
      key: "status",
      value: mapStatusToAPI(values.status),
    },
    ...(values.skills.length > 0
      ? [
          {
            propertyId: "694a33eac9ba83a076aac1b9",
            key: "requiredSkills",
            value: requiredSkills,
          },
        ]
      : []),
  ];

  return {
    values: valuesArray,
    propertyIds: [
      "694a378dc9ba83a076aac1d5",
      "694a23bec9ba83a076aac179",
      "694a23f0c9ba83a076aac17a",
      "694a2412c9ba83a076aac17b",
      "694a2b80c9ba83a076aac188",
      "694a2c0ec9ba83a076aac18b",
      "694a2c2ac9ba83a076aac18c",
      "694a2c48c9ba83a076aac18d",
      "694a2c8ec9ba83a076aac18e",
      "694a2cd1c9ba83a076aac18f",
      "694a2511c9ba83a076aac17f",
      "694a33eac9ba83a076aac1b9",
    ],
    flows: [
      {
        stageId: "1",
        status: "PENDING",
      },
    ],
    status: "PENDING",
    formId: "694a2393c9ba83a076aac178",
  };
};

// Formik validation function
const validate = (values: JobFormData) => {
  const errors: Partial<Record<keyof JobFormData, string>> = {};

  if (!values.title || values.title.trim() === "") {
    errors.title = "Job title is required";
  }

  if (!values.minExperience) {
    errors.minExperience = "Min experience is required";
  }

  if (!values.maxExperience) {
    errors.maxExperience = "Max experience is required";
  }

  if (values.minExperience && values.maxExperience) {
    const minExp = parseInt(values.minExperience);
    const maxExp = parseInt(values.maxExperience);
    if (minExp > maxExp) {
      errors.maxExperience =
        "Max experience must be greater than or equal to min experience";
    }
  }

  if (!values.description || values.description.trim() === "") {
    errors.description = "Job description is required";
  }

  if (!values.status) {
    errors.status = "Job status is required";
  }

  if (!values.skills || values.skills.length === 0) {
    errors.skills = "At least one skill is required";
  }

  console.log(errors);
  return errors;
};

export function CreateJobModal({
  open,
  onOpenChange,
  onSubmit,
}: CreateJobModalProps) {
  const [skillInput, setSkillInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formik = useFormik<JobFormData>({
    initialValues: {
      title: "",
      industry: "",
      jobLevel: "",
      jobType: "",
      minExperience: "",
      maxExperience: "",
      description: "",
      noOfOpenings: "",
      attachment: null,
      status: "",
      skills: [],
    },
    validate,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        const payload = transformToAPIPayload(values);
        await jobService.createJobOpening(payload);
        onSubmit?.(values);
        formik.resetForm();
        setSkillInput("");
        onOpenChange(false);
      } catch (error) {
        console.error("Error creating job opening:", error);
        // You might want to show an error toast here
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      formik.resetForm();
      setSkillInput("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleAddSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && skillInput.trim()) {
      e.preventDefault();
      const trimmedSkill = skillInput.trim();
      if (!formik.values.skills.includes(trimmedSkill)) {
        formik.setFieldValue("skills", [...formik.values.skills, trimmedSkill]);
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
            Create new job opening
          </DialogTitle>
          <DialogDescription className="sr-only"></DialogDescription>
        </DialogHeader>

        <form onSubmit={formik.handleSubmit} className="space-y-4">
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
                    {domainOptions?.map((option) => (
                      <SelectItem key={option?.value} value={option?.value}>
                        {option?.label}
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
                    {jobLevelOptions?.map((option) => (
                      <SelectItem key={option?.value} value={option?.value}>
                        {option?.label}
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
                    {userTypeOptions?.map((option) => (
                      <SelectItem key={option?.value} value={option?.value}>
                        {option?.label}
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
                  value={formik.values.minExperience}
                  onValueChange={(value) => {
                    formik.setFieldValue("minExperience", value);
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
                  value={formik.values.maxExperience}
                  onValueChange={(value) => {
                    formik.setFieldValue("maxExperience", value);
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
                  value={formik.values.noOfOpenings}
                  onValueChange={(value) => {
                    formik.setFieldValue("noOfOpenings", value);
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
              disabled={isSubmitting || !formik.isValid || !formik.dirty}
            >
              {isSubmitting ? "Creating..." : "Create job"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
