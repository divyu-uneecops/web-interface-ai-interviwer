"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Logo } from "@/components/logo";
import { authService } from "../services/auth.service";
import { validateVerificationCode } from "../utils/auth.utils";

type ResetPasswordFormValues = {
  verificationCode: string;
  newPassword: string;
};

const initialValues: ResetPasswordFormValues = {
  verificationCode: "",
  newPassword: "",
};

const validate = (values: ResetPasswordFormValues) => {
  const errors: Record<string, string> = {};

  const codeError = validateVerificationCode(values.verificationCode);
  if (codeError) errors.verificationCode = codeError;

  if (!values.newPassword || values.newPassword.trim().length === 0) {
    errors.newPassword = "New password is required";
  } else if (values.newPassword.length < 8) {
    errors.newPassword = "Password must be at least 8 characters";
  }

  return errors;
};

export default function ResetPassword() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [resendSeconds, setResendSeconds] = useState(0);
  const [resendAvailableAtMs, setResendAvailableAtMs] = useState<number | null>(
    null
  );

  const computeRemainingSeconds = (availableAtMs: number) => {
    const diffMs = availableAtMs - Date.now();
    return Math.max(0, Math.ceil(diffMs / 1000));
  };

  useEffect(() => {
    try {
      const storedEmail = sessionStorage.getItem("emailOrPhone") || "";
      setEmail(storedEmail);

      const storedAvailableAt = sessionStorage.getItem("otpResendAvailableAt");
      const parsed = storedAvailableAt ? Number(storedAvailableAt) : NaN;

      // If missing/invalid, allow resend immediately on this screen.
      const availableAt = Number.isFinite(parsed) ? parsed : Date.now();
      sessionStorage.setItem("otpResendAvailableAt", availableAt.toString());

      setResendAvailableAtMs(availableAt);
      setResendSeconds(computeRemainingSeconds(availableAt));
    } catch {
      setEmail("");
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

  const handleResendCode = async () => {
    if (!email) return;
    try {
      await authService.forgotPasswordRequestOtp({ email });
      toast.success("OTP resent successfully.", { duration: 3000 });
      const availableAt = Date.now() + 60_000;
      try {
        sessionStorage.setItem("otpResendAvailableAt", availableAt.toString());
      } catch {
        // ignore storage errors
      }
      setResendAvailableAtMs(availableAt);
      setResendSeconds(computeRemainingSeconds(availableAt));
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || error?.message || "Failed to resend OTP.",
        { duration: 8000 }
      );
    }
  };

  const formik = useFormik<ResetPasswordFormValues>({
    initialValues,
    validate,
    validateOnChange: true,
    validateOnBlur: true,
    validateOnMount: false,
    onSubmit: async (values, { setTouched }) => {
      setTouched({ verificationCode: true, newPassword: true });
      setIsSubmitting(true);

      try {
        if (!email) {
          toast.error("Session expired. Please try again.", { duration: 5000 });
          router.push("/forgot-password");
          return;
        }

        await authService.forgotPasswordVerifyOtp({
          email,
          otp: values.verificationCode.replace(/\D/g, ""),
          newPassword: values.newPassword,
        });

        toast.success("Password reset successful. Redirecting to login...", {
          duration: 3000,
        });

        try {
          sessionStorage.removeItem("emailOrPhone");
          sessionStorage.removeItem("otpResendAvailableAt");
          sessionStorage.removeItem("otpBackTo");
          sessionStorage.removeItem("otpSuccessRedirectTo");
        } catch {
          // ignore
        }

        setTimeout(() => router.push("/login"), 600);
      } catch (error: any) {
        toast.error(
          error?.response?.data?.message ||
          error?.message ||
          "Invalid verification code. Please try again.",
          { duration: 8000 }
        );
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const handleVerificationCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.replace(/\D/g, "");
    formik.setFieldValue("verificationCode", newValue);
    if (formik.touched.verificationCode || formik.submitCount > 0) {
      formik.setFieldTouched("verificationCode", true, false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="flex min-h-screen">
        {/* Left Side - Gradient Background with Decorative Elements */}
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

        {/* Right Side - Reset Password Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center bg-[#fafafa] min-h-screen">
          <div className="w-full max-w-[440px] flex flex-col gap-8">
            <Logo />

            <div className="flex flex-col gap-2">
              <form noValidate onSubmit={formik.handleSubmit}>
                <Card className="border-2 border-[rgba(0,0,0,0.1)] rounded-[14px] p-6 flex flex-col gap-6 bg-white">
                  <CardHeader className="px-0 flex flex-col gap-[6px]">
                    <CardTitle className="text-base font-medium leading-4 text-[#0a0a0a] tracking-[-0.3125px]">
                      Reset your password
                    </CardTitle>
                    <CardDescription className="text-base font-normal leading-6 text-[#717182] tracking-[-0.3125px]">
                      Enter code send on{" "}
                      <span className="text-[#02563d] font-medium">
                        {email || "your email"}
                      </span>
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="px-0 flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-start justify-between gap-3">
                        <label
                          htmlFor="verificationCode"
                          className="text-sm font-medium leading-none text-[#0a0a0a]"
                        >
                          Verification code{" "}
                          <span className="text-[#dc2626]">*</span>
                        </label>

                        <div className="text-xs text-[#737373] leading-none pt-[1px]">
                          {resendSeconds > 0 ? (
                            <span>Resend code in {resendSeconds}s</span>
                          ) : (
                            <button
                              type="button"
                              className="text-[#02563d] font-medium hover:underline transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={isSubmitting || !email}
                              onClick={handleResendCode}
                            >
                              Resend code
                            </button>
                          )}
                        </div>
                      </div>

                      <Input
                        id="verificationCode"
                        name="verificationCode"
                        type="text"
                        placeholder="000000"
                        required
                        inputMode="numeric"
                        autoComplete="one-time-code"
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
                    </div>

                    <div className="relative">
                      <Input
                        id="newPassword"
                        name="newPassword"
                        type={showPassword ? "text" : "password"}
                        label="New Password"
                        placeholder="********"
                        required
                        value={formik.values.newPassword}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                          (formik.touched.newPassword || formik.submitCount > 0) &&
                            formik.errors.newPassword
                            ? formik.errors.newPassword
                            : undefined
                        }
                        disabled={isSubmitting}
                        className="h-9 w-full rounded-md border border-[#e5e5e5] bg-white px-3 py-1 pr-9 text-sm leading-5 text-[#0a0a0a] placeholder:text-[#737373] shadow-[0_1px_2px_0_rgba(2,86,61,0.12)] outline-none focus:border-[#A3A3A3] focus:shadow-[0_0_0_3px_rgba(2,86,61,0.50)] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((s) => !s)}
                        className="absolute right-3 top-[34px] text-[#737373] hover:text-[#0a0a0a] transition-colors"
                        disabled={isSubmitting}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>

                    <Button
                      type="submit"
                      variant="default"
                      className="w-full h-9 bg-[#02563d] text-[#fafafa] font-medium text-sm rounded-md shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] hover:bg-[#02563d]/90 disabled:opacity-50"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Resetting...
                        </>
                      ) : (
                        "Reset password"
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </form>

              <div className="flex items-center justify-center py-0 mt-0 w-full">
                <p className="text-sm font-normal leading-5 text-[#45556c] text-center tracking-[-0.1504px]">
                  Don&apos;t have an account?
                </p>
                <Link
                  href="/signup"
                  className="text-sm font-medium text-[#02563d] hover:underline transition-colors ml-2"
                >
                  Create an account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


