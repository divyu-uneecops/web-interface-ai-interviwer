"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import Image from "next/image";

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
import { authService } from "@/services/auth.service";
import {
  LoginFormValues,
  ValidationError,
} from "../interfaces/auth.interfaces";

const initialValues: LoginFormValues = {
  emailOrPhone: "",
};

const validate = (values: LoginFormValues) => {
  const errors: ValidationError = {};

  if (!values.emailOrPhone || values.emailOrPhone?.trim()?.length === 0) {
    errors.emailOrPhone = "Email or phone number is required";
  }

  return errors;
};

export default function Login() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formik = useFormik<LoginFormValues>({
    initialValues,
    validate: validate,
    onSubmit: async (values) => {
      setIsSubmitting(true);

      try {
        // Determine if input is email or phone
        const isEmail = values.emailOrPhone.includes("@");

        if (isEmail) {
          // For email login, call the login API to send OTP
          const response = await authService.login({
            name: "", // API might need this, adjust based on actual API requirements
            email: values.emailOrPhone.trim(),
          });

          toast.success("Verification code sent to your email", {
            duration: 3000,
          });

          // Store email in session storage for verification page
          if (typeof window !== "undefined") {
            sessionStorage.setItem("emailOrPhone", values.emailOrPhone);
          }

          // Navigate to verification page
          router.push("/verification");
        } else {
          // For phone login, register to send OTP
          const phoneDigits = values.emailOrPhone.replace(/\D/g, "");
          const response = await authService.register({
            phone: phoneDigits,
          });

          toast.success("Verification code sent to your phone", {
            duration: 3000,
          });

          // Store phone number in session storage for verification page
          if (typeof window !== "undefined") {
            sessionStorage.setItem("emailOrPhone", values.emailOrPhone);
          }

          // Navigate to verification page
          router.push("/verification");
        }
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

  const handleSocialLogin = (provider: "google" | "facebook") => {
    toast.info(
      `${provider === "google" ? "Google" : "Facebook"} login coming soon`,
      {
        duration: 3000,
      }
    );
    // TODO: Implement social login
  };

  // onChange handler for email/phone
  const handleEmailOrPhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    formik.handleChange(e);
    // Only mark as touched if field was already touched or submit attempted
    // This allows validation to run and clear errors when user fixes them
    // but doesn't show errors while user is still typing initially
    if (formik.touched.emailOrPhone || formik.submitCount > 0) {
      formik.setFieldTouched("emailOrPhone");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Main Content */}
      <div className="flex min-h-screen">
        {/* Left Side - Gradient Background with Decorative Elements */}
        <div className="hidden lg:flex lg:w-1/2 h-screen sticky top-0 bg-gradient-to-b from-[#02563d] to-[#052e16] relative overflow-hidden">
          {/* Decorative Ellipse 7 */}
          <div className="absolute left-[-181px] w-[426px] h-[426px] top-[677px]">
            <div className="absolute inset-[-152.58%]">
              <div className="w-full h-full rounded-full bg-white/10 blur-3xl" />
            </div>
          </div>

          {/* Decorative Ellipse 8 */}
          <div className="absolute left-[478px] w-[224px] h-[224px] top-[-131px]">
            <div className="absolute inset-[-156.25%]">
              <div className="w-full h-full rounded-full bg-white/10 blur-3xl" />
            </div>
          </div>

          {/* HIRE FASTER Text */}
          <p className="absolute font-extrabold leading-[60px] left-[-11px] text-[90px] top-[166px] uppercase bg-clip-text text-transparent bg-gradient-to-r from-[rgba(153,153,153,0.15)] to-[rgba(255,255,255,0.3)]">
            HIRE FASTER
          </p>

          {/* SCREEN INTELLIGENTLY Text */}
          <div className="absolute font-black leading-[65px] left-[720px] text-[75px] text-right top-[596px] translate-x-[-100%] uppercase whitespace-nowrap bg-clip-text text-transparent bg-gradient-to-r from-[rgba(255,255,255,0.3)] to-[rgba(153,153,153,0.15)]">
            <p className="mb-0">Screen</p>
            <p>intelligently</p>
          </div>

          {/* Rectangle Image - Brain/Circuit Board Graphic */}
          <div className="absolute h-[473px] left-[39px] top-[217px] w-[544px]">
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
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center bg-[#fafafa] min-h-screen">
          <div className="w-full max-w-[448px] flex flex-col gap-8 px-8">
            <Logo />

            <div className="flex flex-col gap-0">
              <form onSubmit={formik?.handleSubmit} noValidate>
                <Card className="border-2 border-[rgba(0,0,0,0.1)] rounded-[14px] p-0 flex flex-col gap-6 bg-white">
                  <CardHeader className="px-6 pt-6 pb-0 flex flex-col gap-[6px] h-[46px]">
                    <CardTitle className="text-base font-medium leading-4 text-[#0a0a0a] tracking-[-0.3125px]">
                      Welcome Back
                    </CardTitle>
                    <CardDescription className="text-base font-normal leading-6 text-[#717182] tracking-[-0.3125px] h-6">
                      Sign in to your InterviewAI account
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="px-6 pb-6 flex flex-col gap-4">
                    {/* Email Input */}
                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor="email-or-phone"
                        className="text-sm font-medium leading-none text-[#0a0a0a]"
                      >
                        Email Address <span className="text-[#dc2626]">*</span>
                      </label>
                      <div className="flex flex-col gap-2">
                        <input
                          id="email-or-phone"
                          name="emailOrPhone"
                          type="text"
                          placeholder="Email or phone number"
                          required
                          value={formik.values.emailOrPhone}
                          onChange={handleEmailOrPhoneChange}
                          onBlur={(e) => {
                            formik.handleBlur(e);
                            formik.setFieldTouched("emailOrPhone", true);
                          }}
                          disabled={isSubmitting}
                          autoComplete="username"
                          autoFocus
                          className="h-9 w-full rounded-md border border-[#e5e5e5] bg-white px-3 py-1 text-sm leading-5 text-[#737373] placeholder:text-[#737373] shadow-[0_1px_2px_0_rgba(2,86,61,0.12)] outline-none focus:border-[#A3A3A3] focus:shadow-[0_0_0_3px_rgba(2,86,61,0.50)] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        />
                        {formik.touched.emailOrPhone &&
                          formik.errors.emailOrPhone && (
                            <p className="text-sm text-[#dc2626]">
                              {formik.errors.emailOrPhone}
                            </p>
                          )}
                      </div>
                    </div>

                    {/* Continue Button */}
                    <Button
                      type="submit"
                      variant="default"
                      className="w-full h-9 bg-[#02563d] text-[#fafafa] font-medium text-sm rounded-md shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] hover:bg-[#02563d]/90 disabled:opacity-50"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        "Continue"
                      )}
                    </Button>

                    {/* Divider */}
                    <div className="relative h-4 w-full">
                      <div className="absolute border-t border-[#e2e8f0] top-[7.5px] left-0 w-full" />
                      <div className="absolute bg-white h-4 left-1/2 top-0 -translate-x-1/2 flex items-center justify-center px-2">
                        <p className="text-xs font-normal leading-4 text-[#62748e] uppercase whitespace-nowrap">
                          Or continue with
                        </p>
                      </div>
                    </div>

                    {/* Social Login Buttons */}
                    <div className="grid grid-cols-2 gap-3 h-9">
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full h-9 bg-white border border-[rgba(0,0,0,0.1)] rounded-md hover:bg-white flex items-center justify-center gap-2 relative"
                        onClick={() => handleSocialLogin("google")}
                        disabled={isSubmitting}
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          className="shrink-0"
                        >
                          <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                          />
                          <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                          />
                          <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            fill="#FBBC05"
                          />
                          <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                          />
                        </svg>
                        <span className="text-sm font-medium leading-5 text-[#0a0a0a] tracking-[-0.1504px]">
                          Google
                        </span>
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full h-9 bg-white border border-[rgba(0,0,0,0.1)] rounded-md hover:bg-white flex items-center justify-center gap-2 relative"
                        onClick={() => handleSocialLogin("facebook")}
                        disabled={isSubmitting}
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          className="shrink-0"
                        >
                          <path
                            d="M24 12c0-6.627-5.373-12-12-12S0 5.373 0 12c0 5.99 4.388 10.954 10.125 11.854V15.47H7.078V12h3.047V9.356c0-3.007 1.792-4.668 4.533-4.668 1.312 0 2.686.234 2.686.234v2.953H15.83c-1.491 0-1.956.925-1.956 1.874V12h3.328l-.532 3.469h-2.796v8.385C19.612 22.954 24 17.99 24 12z"
                            fill="#1877F2"
                          />
                        </svg>
                        <span className="text-sm font-medium leading-5 text-[#0a0a0a] tracking-[-0.1504px]">
                          Facebook
                        </span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </form>

              {/* Footer */}
              <div className="flex items-center justify-between py-0 mt-0 w-full">
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
