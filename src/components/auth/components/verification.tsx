"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import { toast } from "sonner";
import { ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Logo } from "@/components/logo";
import { validateVerificationForm } from "../utils/auth.utils";
import { VerificationFormValues } from "../types/auth.types";
import { authService } from "../services/auth.service";

const initialValues: VerificationFormValues = {
  verificationCode: "",
};

export default function Verification() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resendSeconds, setResendSeconds] = useState(0);
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [resendAvailableAtMs, setResendAvailableAtMs] = useState<number | null>(
    null
  );

  const computeRemainingSeconds = (availableAtMs: number) => {
    const diffMs = availableAtMs - Date.now();
    return Math.max(0, Math.ceil(diffMs / 1000));
  };

  // Important: read sessionStorage only after mount to avoid hydration mismatch
  useEffect(() => {
    try {
      setEmailOrPhone(sessionStorage.getItem("emailOrPhone") || "");
      const storedAvailableAt = sessionStorage.getItem("otpResendAvailableAt");
      const parsed = storedAvailableAt ? Number(storedAvailableAt) : NaN;

      // If missing/invalid, start a fresh cooldown from now (OTP was just sent before this screen)
      const availableAt = Number.isFinite(parsed) ? parsed : Date.now() + 60_000;
      sessionStorage.setItem("otpResendAvailableAt", availableAt.toString());

      setResendAvailableAtMs(availableAt);
      setResendSeconds(computeRemainingSeconds(availableAt));
    } catch {
      setEmailOrPhone("");
      setResendAvailableAtMs(null);
      setResendSeconds(0);
    }
  }, []);

  useEffect(() => {
    if (!resendAvailableAtMs) return;
    const t = window.setInterval(() => {
      setResendSeconds(computeRemainingSeconds(resendAvailableAtMs));
    }, 1000);
    return () => window.clearInterval(t);
  }, [resendAvailableAtMs]);

  const formik = useFormik<VerificationFormValues>({
    initialValues,
    validate: validateVerificationForm,
    validateOnChange: true,
    validateOnBlur: true,
    validateOnMount: false,
    onSubmit: async (values, { setTouched }) => {
      setTouched({ verificationCode: true });
      setIsSubmitting(true);

      try {
        if (!emailOrPhone) {
          toast.error("Session expired. Please sign up again.", {
            duration: 5000,
          });
          router.push("/signup");
          return;
        }

        // Verify OTP
        const response = await authService.verifyOtp({
          identifier: emailOrPhone,
          otp: values.verificationCode.replace(/\D/g, ""), // Ensure only digits
        });

        // Clean up stored identifier after successful verification
        sessionStorage.removeItem("emailOrPhone");
        sessionStorage.removeItem("otpResendAvailableAt");

        toast.success("Verification successful! Redirecting...", {
          duration: 2000,
        });

        // Redirect to login after successful verification
        setTimeout(() => {
          router.push("/login");
        }, 1000);
      } catch (error: any) {
        const errorMessage =
          error?.response?.data?.message ||
          error?.message ||
          "Invalid verification code. Please try again.";

        toast.error(errorMessage, {
          duration: 5000,
        });
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  // onChange handler for verification code
  const handleVerificationCodeChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newValue = e.target.value.replace(/\D/g, ""); // Only allow digits
    formik.setFieldValue("verificationCode", newValue);
    // Only mark as touched if field was already touched or submit attempted
    // This allows validation to run and clear errors when user fixes them
    // but doesn't show errors while user is still typing initially
    if (formik.touched.verificationCode || formik.submitCount > 0) {
      formik.setFieldTouched("verificationCode", true, false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="flex min-h-screen">
        {/* Left Side - Gradient Background with Decorative Elements (same as Login) */}
        <div className="hidden lg:flex lg:w-1/2 h-screen sticky top-0 bg-gradient-to-b from-[#02563d] to-[#052e16] relative overflow-hidden">
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

        {/* Right Side - Verification Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center bg-[#fafafa] min-h-screen">
          <div className="w-full max-w-[440px] flex flex-col gap-8">
            <Logo />

            <div className="flex flex-col gap-2">
              <form noValidate onSubmit={formik.handleSubmit}>
                <Card className="border-2 border-[rgba(0,0,0,0.1)] rounded-[14px] p-6 flex flex-col gap-6 bg-white">
                  <CardHeader className="px-0 flex flex-col gap-[6px]">
                    <CardTitle className="text-base font-medium leading-4 text-[#0a0a0a] tracking-[-0.3125px]">
                      Verification code
                    </CardTitle>
                    <CardDescription className="text-base font-normal leading-6 text-[#717182] tracking-[-0.3125px]">
                      Enter the code sent to{" "}
                      <span className="text-[#0a0a0a]">
                        {emailOrPhone || "your email"}
                      </span>
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="px-0 flex flex-col gap-4">
                    {/* Verification Code Input */}
                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor="verification-code"
                        className="text-sm font-medium leading-none text-[#0a0a0a]"
                      >
                        Verification code{" "}
                        <span className="text-[#dc2626]">*</span>
                      </label>

                      <Input
                        id="verification-code"
                        name="verificationCode"
                        type="text"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        placeholder="000000"
                        required
                        value={formik.values.verificationCode}
                        onChange={handleVerificationCodeChange}
                        onBlur={(e) => {
                          formik.handleBlur(e);
                          formik.setFieldTouched("verificationCode", true);
                        }}
                        error={
                          (formik.touched.verificationCode ||
                            formik.submitCount > 0) &&
                            formik.errors.verificationCode
                            ? formik.errors.verificationCode
                            : undefined
                        }
                        maxLength={6}
                        disabled={isSubmitting}
                        className="h-9 w-full rounded-md border border-[#e5e5e5] bg-white px-3 py-1 text-sm leading-5 text-[#0a0a0a] placeholder:text-[#737373] shadow-[0_1px_2px_0_rgba(2,86,61,0.12)] outline-none focus:border-[#A3A3A3] focus:shadow-[0_0_0_3px_rgba(2,86,61,0.50)] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      />

                      {/* Resend Code */}
                      <div className="flex justify-end text-xs text-[#737373]">
                        {resendSeconds > 0 ? (
                          <span>Resend code in {resendSeconds}s</span>
                        ) : (
                          <button
                            type="button"
                            className="text-[#02563d] font-medium hover:underline transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isSubmitting || !emailOrPhone}
                            onClick={async () => {
                              if (!emailOrPhone) return;
                              try {
                                await authService.resendOtp({
                                  identifier: emailOrPhone,
                                });
                                toast.success("OTP resent successfully.", {
                                  duration: 3000,
                                });
                                const availableAt = Date.now() + 60_000;
                                try {
                                  sessionStorage.setItem(
                                    "otpResendAvailableAt",
                                    availableAt.toString()
                                  );
                                } catch {
                                  // ignore storage errors (e.g. privacy mode)
                                }
                                setResendAvailableAtMs(availableAt);
                                setResendSeconds(
                                  computeRemainingSeconds(availableAt)
                                );
                              } catch (error: any) {
                                toast.error(
                                  error?.response?.data?.message ||
                                  error?.message ||
                                  "Failed to resend OTP.",
                                  { duration: 5000 }
                                );
                              }
                            }}
                          >
                            Resend code
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Bottom Actions */}
                    <div className="grid grid-cols-2 gap-3 h-9">
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full h-9 bg-white border border-[rgba(0,0,0,0.1)] rounded-md hover:bg-white"
                        onClick={() => router.push("/signup")}
                        disabled={isSubmitting}
                      >
                        Back
                      </Button>

                      <Button
                        type="submit"
                        variant="default"
                        className="w-full h-9 bg-[#02563d] text-[#fafafa] font-medium text-sm rounded-md shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] hover:bg-[#02563d]/90 disabled:opacity-50"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Verifying...
                          </>
                        ) : (
                          <>
                            Verify <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </Button>
                    </div>
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
