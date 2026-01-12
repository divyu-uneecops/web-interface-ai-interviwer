"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import { toast } from "sonner";
import { Loader2, Eye, EyeOff, ArrowLeft } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

import { Logo } from "@/components/logo";
import {
  LoginFormValues,
  ValidationError,
} from "../interfaces/auth.interfaces";
import { authService } from "../services/auth.service";

const initialValues: LoginFormValues = {
  email: "",
  password: "",
  keepSignedIn: false,
};

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex?.test(email);
};

const validate = (values: LoginFormValues, isPasswordStep: boolean) => {
  const errors: ValidationError = {};

  if (!values?.email || values.email?.trim()?.length === 0) {
    errors.email = "Email address is required";
  } else if (!isValidEmail(values.email.trim())) {
    errors.email = "Please enter a valid email address";
  }

  if (isPasswordStep) {
    if (!values?.password || values.password?.trim()?.length === 0) {
      errors.password = "Password is required";
    }
  }

  return errors;
};

export default function Login() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordStep, setIsPasswordStep] = useState(false);

  const formik = useFormik<LoginFormValues>({
    initialValues,
    validate: (values) => validate(values, isPasswordStep),
    onSubmit: async (values) => {
      setIsSubmitting(true);

      try {
        if (!isPasswordStep) {
          // Step 1: Verify email
          await authService.verifyEmail({ email: values.email });
          setIsPasswordStep(true);
          toast?.success("Email verified. Please enter your password.", {
            duration: 3000,
          });
        } else {
          // Step 2: Login with email and password
          // TODO: Implement actual login API call
          toast?.success("Login successful! Redirecting...", {
            duration: 2000,
          });
          // Navigate to dashboard or home page
          setTimeout(() => {
            router.push("/app-view/dashboard");
          }, 1000);
        }
      } catch (error: any) {
        const errorMessage =
          error?.response?.data?.message ||
          "An error occurred. Please try again.";

        toast?.error(errorMessage, {
          duration: 8000,
        });
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const handleSocialLogin = (provider: "google" | "facebook") => {
    toast?.info(
      `${provider === "google" ? "Google" : "Facebook"} login coming soon`,
      {
        duration: 3000,
      }
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Main Content */}
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

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center bg-[#fafafa] min-h-screen">
          <div className="w-full max-w-[448px] flex flex-col gap-8 px-8">
            <Logo />

            <div className="flex flex-col gap-0">
              <form onSubmit={formik?.handleSubmit}>
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
                    <div className="flex flex-col gap-2 relative">
                      <label
                        htmlFor="email"
                        className="text-sm font-medium leading-none text-[#0a0a0a]"
                      >
                        Email Address <span className="text-[#dc2626]">*</span>
                      </label>
                      <div className="flex flex-col gap-2">
                        {isPasswordStep ? (
                          <div className="relative">
                            <Input
                              id="email"
                              name="email"
                              type="text"
                              value={formik?.values?.email}
                              disabled={true}
                              className="h-9 w-full rounded-md border border-[#e5e5e5] bg-white px-3 py-1 pr-9 text-sm leading-5 text-[#0a0a0a] shadow-[0_1px_2px_0_rgba(2,86,61,0.12)] outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setIsPasswordStep(false);
                                formik.setFieldValue("password", "");
                              }}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#737373] hover:text-[#0a0a0a] transition-colors"
                              disabled={isSubmitting}
                            >
                              <ArrowLeft className="w-5 h-5" />
                            </button>
                          </div>
                        ) : (
                          <Input
                            id="email"
                            name="email"
                            type="text"
                            placeholder="Email address"
                            required
                            value={formik?.values?.email}
                            onChange={formik?.handleChange}
                            onBlur={formik?.handleBlur}
                            disabled={isSubmitting}
                            className="h-9 w-full rounded-md border border-[#e5e5e5] bg-white px-3 py-1 text-sm leading-5 text-[#737373] placeholder:text-[#737373] shadow-[0_1px_2px_0_rgba(2,86,61,0.12)] outline-none focus:border-[#A3A3A3] focus:shadow-[0_0_0_3px_rgba(2,86,61,0.50)] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                          />
                        )}
                        {formik?.touched?.email && formik?.errors?.email && (
                          <p className="text-sm text-[#dc2626]">
                            {formik?.errors?.email}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Password Input - Only shown in password step */}
                    {isPasswordStep && (
                      <div className="flex flex-col gap-2 relative">
                        <div className="flex items-start justify-between">
                          <label
                            htmlFor="password"
                            className="text-sm font-medium leading-none text-[#0a0a0a]"
                          >
                            Password <span className="text-[#dc2626]">*</span>
                          </label>
                          <Link
                            href="/forgot-password"
                            className="text-sm text-[#737373] underline decoration-solid underline-offset-2 hover:text-[#0a0a0a] transition-colors leading-none"
                          >
                            Forgot your password?
                          </Link>
                        </div>
                        <div className="flex flex-col gap-2">
                          <div className="relative">
                            <Input
                              id="password"
                              name="password"
                              type={showPassword ? "text" : "password"}
                              placeholder="Password"
                              required
                              value={formik?.values?.password || ""}
                              onChange={formik?.handleChange}
                              onBlur={formik?.handleBlur}
                              disabled={isSubmitting}
                              className="h-9 w-full rounded-md border border-[#e5e5e5] bg-white px-3 py-1 pr-9 text-sm leading-5 text-[#0a0a0a] placeholder:text-[#737373] shadow-[0_1px_2px_0_rgba(2,86,61,0.12)] outline-none focus:border-[#A3A3A3] focus:shadow-[0_0_0_3px_rgba(2,86,61,0.50)] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#737373] hover:text-[#0a0a0a] transition-colors"
                              disabled={isSubmitting}
                            >
                              {showPassword ? (
                                <EyeOff className="w-5 h-5" />
                              ) : (
                                <Eye className="w-5 h-5" />
                              )}
                            </button>
                          </div>
                          {formik?.touched?.password &&
                            formik?.errors?.password && (
                              <p className="text-sm text-[#dc2626]">
                                {formik?.errors?.password}
                              </p>
                            )}
                        </div>
                      </div>
                    )}

                    {/* Keep me signed in - Only shown in password step */}
                    {isPasswordStep && (
                      <Checkbox
                        id="keep-signed-in"
                        label="Keep me signed in"
                        checked={formik.values.keepSignedIn}
                        onCheckedChange={(checked) => {
                          formik.setFieldValue("keepSignedIn", checked);
                        }}
                        disabled={isSubmitting}
                      />
                    )}

                    {/* Submit Button */}
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
                      ) : isPasswordStep ? (
                        "Sign In"
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
