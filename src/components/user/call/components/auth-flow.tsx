"use client";

import { useState } from "react";
import { useFormik } from "formik";
import { Loader2, ChevronRight } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Logo } from "@/components/logo";
import {
  ApplicantAuthFormValues,
  StartInterviewResponse,
} from "../interfaces/applicant-auth.interface";
import { validateApplicantAuthForm } from "../utils/applicant-auth.utils";
import { applicantAuthService } from "../services/applicant-auth.service";

const initialValues: ApplicantAuthFormValues = {
  fullName: "",
  email: "",
  countryCode: "+91",
  phone: "",
};

export interface StartInterviewParams {
  applicantId: string;
  jobId: string;
  roundId: string;
  interviewerId: string;
}

interface AuthFlowProps {
  onAuthenticated: (
    name: string,
    startInterviewResponse: StartInterviewResponse,
  ) => void;
  interviewId?: string;
}

export function AuthFlow({ onAuthenticated, interviewId }: AuthFlowProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formik = useFormik<ApplicantAuthFormValues>({
    initialValues,
    validate: validateApplicantAuthForm,
    validateOnChange: true,
    validateOnBlur: true,
    validateOnMount: false,
    onSubmit: async (values) => {
      if (!interviewId) {
        toast.error(
          "Invalid interview link. Please check your link and try again.",
          {
            duration: 5000,
          },
        );
        return;
      }

      setIsSubmitting(true);

      try {
        const response = await applicantAuthService.startInterviewAPI({
          email: values.email,
          interviewId,
        });

        if (!response.success) {
          toast.error("Failed to start interview. Please try again.", {
            duration: 5000,
          });
          return;
        }

        onAuthenticated("Devrishi Bhardwaj", response);
      } catch (error: any) {
        const errorMessage =
          error?.response?.data?.message ||
          error?.message ||
          "An error occurred. Please try again.";

        toast.error(errorMessage, {
          duration: 5000,
        });
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <div className="min-h-screen bg-white">
      <div className="flex min-h-screen">
        <div className="hidden lg:flex lg:w-1/2 h-screen sticky top-0 bg-gradient-to-b from-[#02563d] to-[#052e16] overflow-hidden">
          <div className="absolute inset-0 opacity-[0.35] overflow-hidden pointer-events-none">
            <Image
              src="/LoginLeftImage.svg"
              alt="AI Interview Graphic"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        <div className="w-full lg:w-1/2 flex items-center justify-center bg-white min-h-screen">
          <div className="w-full max-w-[448px] flex flex-col gap-8 px-8">
            <Logo />

            <div className="flex flex-col gap-0">
              <form onSubmit={formik.handleSubmit}>
                <Card className="border border-[#e5e5e5] rounded-[14px] p-0 flex flex-col gap-6 bg-white shadow-sm">
                  <CardHeader className="px-6 pt-6 pb-0 flex flex-col gap-[6px]">
                    <CardTitle className="text-base font-bold leading-5 text-[#0a0a0a]">
                      Welcome to AI Interviewer
                    </CardTitle>
                    <CardDescription className="text-sm font-normal leading-5 text-[#717182]">
                      Let's begin with you interview journey with AI
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="px-6 pb-6 flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                      <Input
                        id="fullName"
                        name="fullName"
                        type="text"
                        label="Full name"
                        placeholder="Email or phone number"
                        required
                        value={formik.values.fullName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        disabled={isSubmitting}
                        error={
                          formik.touched.fullName && formik.errors.fullName
                            ? formik.errors.fullName
                            : undefined
                        }
                        className="h-9 w-full rounded-md border border-[#e5e5e5] bg-white px-3 py-1 text-sm leading-5 text-[#0a0a0a] placeholder:text-[#737373] shadow-[0_1px_2px_0_rgba(2,86,61,0.12)] outline-none focus:border-[#A3A3A3] focus:shadow-[0_0_0_3px_rgba(2,86,61,0.50)] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        label="Email Address"
                        placeholder="Email or phone number"
                        required
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        disabled={isSubmitting}
                        error={
                          formik.touched.email && formik.errors.email
                            ? formik.errors.email
                            : undefined
                        }
                        className="h-9 w-full rounded-md border border-[#e5e5e5] bg-white px-3 py-1 text-sm leading-5 text-[#0a0a0a] placeholder:text-[#737373] shadow-[0_1px_2px_0_rgba(2,86,61,0.12)] outline-none focus:border-[#A3A3A3] focus:shadow-[0_0_0_3px_rgba(2,86,61,0.50)] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      />
                    </div>

                    <PhoneInput
                      label="Phone number"
                      required
                      placeholder="Email or phone number"
                      countryCode={formik.values.countryCode}
                      phoneNumber={formik.values.phone}
                      onCountryCodeChange={(value) => {
                        formik.setFieldValue("countryCode", value);
                      }}
                      onPhoneNumberChange={(e) => {
                        const phoneValue = e.target.value;
                        formik.setFieldValue("phone", phoneValue);
                        const digitsOnly = phoneValue.replace(
                          /[\s\-\(\)\+\.]/g,
                          "",
                        );
                        if (digitsOnly.length > 10 || formik.touched.phone) {
                          formik.setFieldTouched("phone", true, false);
                        }
                      }}
                      onFocus={(e) => {
                        if (!formik.touched.phone) {
                          formik.setFieldTouched("phone", true, false);
                        }
                      }}
                      onBlur={(e) => {
                        formik.setFieldTouched("phone", true);
                      }}
                      id="phone"
                      error={
                        formik.touched.phone && formik.errors.phone
                          ? formik.errors.phone
                          : undefined
                      }
                    />

                    <Button
                      type="submit"
                      variant="default"
                      className="w-full h-9 bg-[#02563d] text-white font-medium text-sm rounded-md shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] hover:bg-[#02563d]/90 disabled:opacity-50 flex items-center justify-center gap-2"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        <>
                          Continue
                          <ChevronRight className="w-4 h-4" />
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
