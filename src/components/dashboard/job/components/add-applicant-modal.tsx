"use client";

import { useEffect, useState } from "react";
import { useFormik } from "formik";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  AddApplicantModalProps,
  ApplicantForm,
} from "../interfaces/job.interface";
import { jobService } from "../services/job.service";
import { transformApplicantToAPIPayload } from "../utils/job.utils";

const validate = (values: ApplicantForm) => {
  const errors: Partial<Record<keyof ApplicantForm, string>> = {};

  if (!values.name || values?.name?.trim() === "") {
    errors.name = "Applicant name is required";
  }

  if (!values.email || values.email.trim() === "") {
    errors.email = "Applicant email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "Please enter a valid email address";
  }

  if (!values.contact || values.contact.trim() === "") {
    errors.contact = "Contact number is required";
  }

  return errors;
};

export function AddApplicantModal({
  open,
  onOpenChange,
  jobInfo,
  onSubmit,
  isEditMode = false,
  applicantDetail,
  applicantId,
}: AddApplicantModalProps) {
  const [applicantTab, setApplicantTab] = useState<"single" | "bulk">("single");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formik = useFormik<ApplicantForm>({
    initialValues: {
      name: applicantDetail?.name || "",
      email: applicantDetail?.email || "",
      contact: applicantDetail?.contact || "",
      attachment: applicantDetail?.attachment || null,
    },
    validate: validate,
    enableReinitialize: true,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        // Handle file upload if attachment exists
        let attachmentPath: string | undefined;
        if (values.attachment) {
          // Use the filename for now
          // TODO: Implement actual file upload to get the proper file path
          // The API expects format: propertyId//filename
          attachmentPath = values.attachment.name;
        }

        // Transform form data to API payload
        const payload = transformApplicantToAPIPayload(
          values,
          jobInfo.jobId,
          attachmentPath
        );

        if (isEditMode && applicantId) {
          // Update existing applicant
          const response = await jobService.updateApplicant(
            applicantId,
            {},
            payload
          );
          toast.success(response?.message || "Applicant updated successfully", {
            duration: 8000,
          });
        } else {
          // Create new applicant
          const response = await jobService.createApplicant(payload);
          toast.success(response?.message || "Applicant added successfully", {
            duration: 8000,
          });
        }

        // Call custom onSubmit if provided
        if (onSubmit) {
          onSubmit(values);
        }

        formik.resetForm();
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
      setApplicantTab("single");
    } else if (isEditMode && applicantDetail) {
      formik.setValues({
        name: applicantDetail.name || "",
        email: applicantDetail.email || "",
        contact: applicantDetail.contact || "",
        attachment: applicantDetail.attachment || null,
      });
    }
  }, [open, isEditMode, applicantDetail]);

  const handleFileChange = (file: File | null) => {
    if (!file) return;

    // Validate file type
    const validTypes = ["application/pdf"];
    if (!validTypes.includes(file?.type || "")) {
      toast.error("Please upload a PDF file", { duration: 8000 });
      return;
    }

    // Validate file size (5MB = 5 * 1024 * 1024 bytes)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file?.size && file.size > maxSize) {
      toast.error("File size must be less than 5MB", { duration: 8000 });
      return;
    }

    formik.setFieldValue("attachment", file);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[779px] max-h-[90vh] overflow-y-auto p-6 gap-4 shadow-lg">
        <DialogHeader className="gap-1.5 items-start">
          <DialogTitle className="text-lg font-semibold text-[#0a0a0a] leading-none">
            {isEditMode ? "Edit Applicant" : "Create Applicant"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          {/* Tabs */}
          <Tabs
            value={applicantTab}
            onValueChange={(value) =>
              setApplicantTab(value as "single" | "bulk")
            }
            className="w-full"
          >
            <TabsList className="bg-[#f5f5f5] h-9 p-[3px] rounded-[10px] flex w-full">
              <TabsTrigger
                value="single"
                className="flex-1 h-full rounded-md text-sm font-medium transition-all flex items-center justify-center text-[#0a0a0a] data-[state=active]:bg-white data-[state=active]:shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] data-[state=active]:border data-[state=active]:border-transparent"
              >
                Single Applicant
              </TabsTrigger>
              <TabsTrigger
                value="bulk"
                className="flex-1 h-full rounded-md text-sm font-medium transition-all flex items-center justify-center text-[#0a0a0a] data-[state=active]:bg-white data-[state=active]:shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] data-[state=active]:border data-[state=active]:border-transparent"
              >
                Bulk Applicants
              </TabsTrigger>
            </TabsList>

            <TabsContent value="single" className="mt-0">
              <div className="space-y-5">
                {/* Parse resume */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-[#000000]">
                    Parse resume
                  </Label>
                  <div className="border border-dashed border-[#d1d1d1] rounded bg-transparent h-[114px] flex items-center justify-center">
                    <div className="flex flex-col items-center gap-2 px-4 py-8 text-center">
                      <p className="text-sm text-[#02563d] leading-5">
                        Drag and drop files here or click to upload
                      </p>
                      <p className="text-xs text-[#747474] leading-none">
                        Max file size is 5MB. Supported file type is .pdf
                      </p>
                    </div>
                  </div>
                </div>

                {/* Or divider */}
                <div className="flex items-center gap-2.5">
                  <div className="flex-1 h-px bg-[#e5e5e5]" />
                  <span className="text-sm text-[#737373] leading-none">
                    or
                  </span>
                  <div className="flex-1 h-px bg-[#e5e5e5]" />
                </div>

                {/* Applicant name */}
                <div className="space-y-2">
                  <Label
                    htmlFor="name"
                    className="text-sm font-medium text-[#0a0a0a]"
                  >
                    Applicant name <span className="text-red-700">*</span>
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Mohan kuman"
                    className={`h-9 shadow-[0px_1px_2px_0px_rgba(2,86,61,0.12)] border-[#e5e5e5] ${
                      formik.touched.name && formik.errors.name
                        ? "border-red-500"
                        : ""
                    }`}
                  />
                  {formik.touched.name && formik.errors.name && (
                    <p className="text-xs text-red-500">{formik.errors.name}</p>
                  )}
                </div>

                {/* Email and Contact */}
                <div className="flex gap-2.5">
                  <div className="flex-1 space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-sm font-medium text-[#0a0a0a]"
                    >
                      Applicant email <span className="text-red-700">*</span>
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="mohankumar@gmail.com"
                      className={`h-9 shadow-[0px_1px_2px_0px_rgba(2,86,61,0.12)] border-[#e5e5e5] ${
                        formik.touched.email && formik.errors.email
                          ? "border-red-500"
                          : ""
                      }`}
                    />
                    {formik.touched.email && formik.errors.email && (
                      <p className="text-xs text-red-500">
                        {formik.errors.email}
                      </p>
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label
                      htmlFor="contact"
                      className="text-sm font-medium text-[#0a0a0a]"
                    >
                      Contact number <span className="text-neutral-950">*</span>
                    </Label>
                    <Input
                      id="contact"
                      name="contact"
                      value={formik.values.contact}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="+91 9876543210"
                      className={`h-9 shadow-[0px_1px_2px_0px_rgba(2,86,61,0.12)] border-[#e5e5e5] ${
                        formik.touched.contact && formik.errors.contact
                          ? "border-red-500"
                          : ""
                      }`}
                    />
                    {formik.touched.contact && formik.errors.contact && (
                      <p className="text-xs text-red-500">
                        {formik.errors.contact}
                      </p>
                    )}
                  </div>
                </div>

                {/* Attachment and Job title */}
                <div className="flex gap-2.5">
                  <div className="flex-1 space-y-2">
                    <Label className="text-sm font-medium text-[#0a0a0a]">
                      Attachment
                    </Label>
                    <div className="h-9 border border-[#e5e5e5] rounded-md shadow-[0px_1px_2px_0px_rgba(2,86,61,0.12)] bg-white px-3 flex items-center justify-between">
                      <span className="text-sm text-[#0a0a0a] truncate flex-1">
                        {formik.values.attachment
                          ? formik.values.attachment.name
                          : "No file chosen"}
                      </span>
                      <label className="text-sm font-medium text-[#0a0a0a] px-1.5 py-px cursor-pointer hover:text-[#02563d]">
                        <input
                          type="file"
                          accept="application/pdf"
                          className="hidden"
                          onChange={(e) => {
                            const file = e?.target?.files?.[0];
                            handleFileChange(file || null);
                          }}
                        />
                        Choose file
                      </label>
                    </div>
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label className="text-sm font-medium text-[#0a0a0a]">
                      Job title
                    </Label>
                    <Select disabled={true}>
                      <SelectTrigger className="w-full h-9 shadow-[0px_1px_2px_0px_rgba(2,86,61,0.12)] opacity-50 border-[#e5e5e5]">
                        <SelectValue placeholder={jobInfo?.jobTitle} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={jobInfo?.jobTitle}>
                          {jobInfo?.jobTitle}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="bulk" className="mt-0">
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-[#000000]">
                  Upload resumes or import data excel{" "}
                  <span className="text-red-700">*</span>
                </Label>
                <div className="border border-dashed border-[#d1d1d1] rounded bg-transparent h-[114px] flex items-center justify-center">
                  <div className="flex flex-col items-center gap-2 px-4 py-8 text-center">
                    <p className="text-sm text-[#02563d] leading-5">
                      Drag and drop files here or click to upload
                    </p>
                    <p className="text-xs text-[#747474] leading-none">
                      Max file size is 5MB. Supported file type is .pdf
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="gap-2 justify-end">
            <Button
              type="submit"
              variant="default"
              className="h-9 px-4 bg-[#02563d] hover:bg-[#02563d]/90 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]"
              disabled={isSubmitting || !formik.isValid}
            >
              {isSubmitting
                ? isEditMode
                  ? "Updating..."
                  : "Adding..."
                : isEditMode
                ? "Update"
                : "Next"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
