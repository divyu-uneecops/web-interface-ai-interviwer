"use client";

import { useState } from "react";
import Link from "next/link";
import { Formik, Form, FormikProps } from "formik";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { PhoneInput } from "@/components/ui/phone-input";
import {
  ArrowRight,
  Zap,
  Sparkles,
  Users,
  BarChart3,
  Shield,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { StatsPanel } from "@/components/stats-panel";
import { validateSignupForm } from "../utils/auth.utils";
import { SignupFormValues } from "../types/auth.types";
import { authService } from "../services/auth.service";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const initialValues: SignupFormValues = {
  firstName: "",
  lastName: "",
  email: "",
  username: "",
  countryCode: "+91",
  phone: "",
  designation: "",
  password: "",
  confirmPassword: "",
  companyName: "",
  website: "",
  industry: "",
  companySize: "",
};

export default function Signup() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const router = useRouter();

  const industries = [
    { value: "technology", label: "Technology" },
    { value: "healthcare", label: "Healthcare" },
    { value: "finance", label: "Finance" },
    { value: "retail", label: "Retail" },
    { value: "manufacturing", label: "Manufacturing" },
    { value: "education", label: "Education" },
    { value: "other", label: "Other" },
  ];

  const companySizes = [
    { value: "1-10", label: "1-10 employees" },
    { value: "11-50", label: "11-50 employees" },
    { value: "51-200", label: "51-200 employees" },
    { value: "201-500", label: "201-500 employees" },
    { value: "501-1000", label: "501-1000 employees" },
    { value: "1000+", label: "1000+ employees" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Main Content */}
      <div className="flex min-h-screen">

        {/* Left Side - Stats Panel */}
        <div className="hidden lg:block w-1/2 h-screen sticky top-0">
          <StatsPanel />
        </div>
        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-8 py-12 bg-[#fafafa]">
          <div className="w-full max-w-[448px] space-y-4">
            <Logo />

            {/* Progress Indicator */}
            <div className="flex items-center justify-between w-full">
              <div className="flex-1 flex items-center">
                <div className="flex flex-col items-center gap-1">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 1 || step > 1
                      ? "bg-[#02563d] text-white"
                      : "bg-slate-200 text-[#45556c]"
                      }`}
                  >
                    {step > 1 ? <CheckCircle className="w-4 h-4" /> : "1"}
                  </div>
                  <span className="text-xs text-[#45556c]">Your Info</span>
                </div>
                <div
                  className={`flex-1 h-0.5 mx-2 ${step >= 2 ? "bg-[#02563d]" : "bg-slate-200"
                    }`}
                />
              </div>
              <div className="flex flex-col items-center gap-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 2 || step > 2
                    ? "bg-[#02563d] text-white"
                    : "bg-slate-200 text-[#45556c]"
                    }`}
                >
                  {step > 2 ? <CheckCircle className="w-4 h-4" /> : "2"}
                </div>
                <span className="text-xs text-[#45556c]">Company Setup</span>
              </div>
            </div>

            {/* Form Card */}
            <Formik
              initialValues={initialValues}
              validate={validateSignupForm}
              onSubmit={async () => {
                // Final step submit is handled by the Step 2 button handler.
              }}
              validateOnChange={true}
              validateOnBlur={true}
              validateOnMount={false}
            >
              {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                setFieldValue,
                setFieldTouched,
                submitCount,
                validateForm,
                submitForm,
              }: FormikProps<SignupFormValues>) => {
                type PasswordFieldName = "password" | "confirmPassword";

                const setMaskedFieldValue = (
                  field: PasswordFieldName,
                  nextValue: string,
                  nextCaretPos?: number
                ) => {
                  setFieldValue(field, nextValue);

                  // Preserve caret position after rerender (best-effort)
                  if (typeof window !== "undefined" && typeof nextCaretPos === "number") {
                    window.requestAnimationFrame(() => {
                      const el = document.getElementById(field) as HTMLInputElement | null;
                      if (el && typeof el.setSelectionRange === "function") {
                        el.setSelectionRange(nextCaretPos, nextCaretPos);
                      }
                    });
                  }
                };

                const handleAsteriskMaskKeyDown =
                  (field: PasswordFieldName) => (e: React.KeyboardEvent<HTMLInputElement>) => {
                    const key = e.key;
                    const el = e.currentTarget;
                    const start = el.selectionStart ?? 0;
                    const end = el.selectionEnd ?? start;
                    const currentValue = values[field] ?? "";

                    // Allow navigation / modifiers / form controls
                    const allowedKeys = [
                      "ArrowLeft",
                      "ArrowRight",
                      "ArrowUp",
                      "ArrowDown",
                      "Home",
                      "End",
                      "Tab",
                      "Shift",
                      "Control",
                      "Alt",
                      "Meta",
                      "Escape",
                      "Enter",
                    ];
                    if (allowedKeys.includes(key)) return;

                    // Backspace
                    if (key === "Backspace") {
                      e.preventDefault();
                      if (start === end && start > 0) {
                        const next = currentValue.slice(0, start - 1) + currentValue.slice(end);
                        setMaskedFieldValue(field, next, start - 1);
                        return;
                      }
                      const next = currentValue.slice(0, start) + currentValue.slice(end);
                      setMaskedFieldValue(field, next, start);
                      return;
                    }

                    // Delete
                    if (key === "Delete") {
                      e.preventDefault();
                      if (start === end && start < currentValue.length) {
                        const next =
                          currentValue.slice(0, start) + currentValue.slice(start + 1);
                        setMaskedFieldValue(field, next, start);
                        return;
                      }
                      const next = currentValue.slice(0, start) + currentValue.slice(end);
                      setMaskedFieldValue(field, next, start);
                      return;
                    }

                    // Ignore other non-character keys (e.g., F5)
                    if (key.length !== 1 || e.ctrlKey || e.metaKey || e.altKey) return;

                    // Insert typed character
                    e.preventDefault();
                    const next = currentValue.slice(0, start) + key + currentValue.slice(end);
                    setMaskedFieldValue(field, next, start + 1);
                  };

                const handleAsteriskMaskPaste =
                  (field: PasswordFieldName) => (e: React.ClipboardEvent<HTMLInputElement>) => {
                    e.preventDefault();
                    const el = e.currentTarget;
                    const start = el.selectionStart ?? 0;
                    const end = el.selectionEnd ?? start;
                    const currentValue = values[field] ?? "";
                    const pasted = e.clipboardData.getData("text") ?? "";
                    const next = currentValue.slice(0, start) + pasted + currentValue.slice(end);
                    setMaskedFieldValue(field, next, start + pasted.length);
                  };

                const handleContinue = async () => {
                  if (step === 1) {
                    // Validate step 1 fields (lastName is optional)
                    const step1Fields = ['firstName', 'email', 'username', 'phone', 'designation', 'password', 'confirmPassword'] as const;
                    await setFieldTouched('firstName', true);
                    await setFieldTouched('email', true);
                    await setFieldTouched('username', true);
                    await setFieldTouched('phone', true);
                    await setFieldTouched('designation', true);
                    await setFieldTouched('password', true);
                    await setFieldTouched('confirmPassword', true);

                    const validationErrors = await validateForm();
                    const hasStep1Errors = step1Fields.some(field => validationErrors[field]);

                    // Also check lastName if provided (it's optional but must be valid if filled)
                    if (values.lastName && validationErrors.lastName) {
                      await setFieldTouched('lastName', true);
                      return;
                    }

                    if (hasStep1Errors) return;

                    // Call register API on "Continue"
                    setIsSubmitting(true);
                    try {
                      const number = (values.phone || "").replace(
                        /[\s\-\(\)\+\.]/g,
                        ""
                      );

                      const formData = new FormData();
                      formData.append("email", values.email?.trim() || "");
                      formData.append("username", values.username?.trim() || "");
                      formData.append("firstName", values.firstName?.trim() || "");
                      formData.append("lastName", values.lastName?.trim() || "");
                      formData.append("number", number);
                      formData.append("countryCode", values.countryCode || "");
                      formData.append("password", values.password || "");

                      const response = await authService.register(formData);

                      toast.success(
                        response?.message ?? "Registered successfully. Please verify OTP.",
                        { duration: 5000 }
                      );
                      setIsRegistered(true);
                      // Store identifier for OTP verification screen
                      if (typeof window !== "undefined") {
                        // Start resend cooldown timer (persisted so refresh can't bypass it)
                        sessionStorage.setItem(
                          "otpResendAvailableAt",
                          (Date.now() + 60_000).toString()
                        );
                        sessionStorage.setItem(
                          "emailOrPhone",
                          (values.email?.trim() || number || "").toString()
                        );
                      }
                      router.push("/verification");
                    } catch (error: any) {
                      const errorMessage =
                        error?.response?.data?.message ||
                        error?.message ||
                        "Registration failed. Please try again.";
                      toast.error(errorMessage, { duration: 8000 });
                    } finally {
                      setIsSubmitting(false);
                    }
                  }
                };

                const handleBack = () => {
                  if (step === 2) {
                    setStep(1);
                  }
                };

                const handleStep2Submit = async (e: React.MouseEvent) => {
                  e.preventDefault();
                  // Validate all step 2 fields
                  await setFieldTouched('companyName', true);
                  await setFieldTouched('website', true);
                  await setFieldTouched('industry', true);
                  await setFieldTouched('companySize', true);
                  // Also ensure password fields are valid before final submission
                  await setFieldTouched('password', true);
                  await setFieldTouched('confirmPassword', true);
                  await setFieldTouched('username', true);

                  const validationErrors = await validateForm();
                  const step2Fields = ['companyName', 'website', 'industry', 'companySize'] as const;
                  const step1RequiredFields = ['firstName', 'email', 'username', 'phone', 'designation', 'password', 'confirmPassword'] as const;
                  const hasStep2Errors = step2Fields.some(field => validationErrors[field]);
                  const hasStep1Errors = step1RequiredFields.some(field => validationErrors[field]);

                  // Also check lastName if provided (it's optional but must be valid if filled)
                  if (values.lastName && validationErrors.lastName) {
                    await setFieldTouched('lastName', true);
                    return;
                  }

                  if (hasStep2Errors || hasStep1Errors) return;

                  // Step 2 currently doesn't have a backend API in this repo.
                  // Ensure register was completed on step 1, then move user to login.
                  if (!isRegistered) {
                    toast.error("Please complete Step 1 registration first.", {
                      duration: 5000,
                    });
                    setStep(1);
                    return;
                  }

                  toast.success("Setup completed. Please login.", { duration: 5000 });
                  router.push("/login");
                };

                return (
                  <Form noValidate>
                    <div className="bg-white border-2 border-[rgba(0,0,0,0.1)] rounded-[14px] p-6 space-y-6">
                      <div>
                        <h1 className="text-base font-medium text-neutral-950 mb-1">
                          {step === 1 ? "Welcome Back" : "Setup Your Organisation"}
                        </h1>
                        <p className="text-base text-[#717182]">
                          {step === 1
                            ? "Sign in to your InterviewAI account"
                            : "Help us customize your experience"}
                        </p>
                      </div>

                      <div className="space-y-4">
                        {step === 1 ? (
                          <>
                            <div className="grid grid-cols-2 gap-3">
                              <Input
                                label="First name"
                                name="firstName"
                                id="firstName"
                                placeholder="John"
                                value={values.firstName}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={(touched.firstName || submitCount > 0) && errors.firstName ? errors.firstName : undefined}
                                required
                              />
                              <Input
                                label="Last name"
                                name="lastName"
                                id="lastName"
                                placeholder="Dow"
                                value={values.lastName}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={(touched.lastName || submitCount > 0) && errors.lastName ? errors.lastName : undefined}
                              />
                            </div>
                            <Input
                              label="Email Address"
                              name="email"
                              id="email"
                              type="email"
                              placeholder="johndoe@gmail.com"
                              value={values.email}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={(touched.email || submitCount > 0) && errors.email ? errors.email : undefined}
                              required
                            />
                            <Input
                              label="Username"
                              name="username"
                              id="username"
                              placeholder="johndoe"
                              value={values.username}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={(touched.username || submitCount > 0) && errors.username ? errors.username : undefined}
                              required
                            />
                            <PhoneInput
                              label="Phone number"
                              required
                              countryCode={values.countryCode}
                              phoneNumber={values.phone}
                              onCountryCodeChange={(value) => {
                                setFieldValue("countryCode", value);
                              }}
                              onPhoneNumberChange={(e) => {
                                const phoneValue = e.target.value;
                                setFieldValue("phone", phoneValue);

                                // Remove all non-digit characters to check length
                                const digitsOnly = phoneValue.replace(/[\s\-\(\)\+\.]/g, "");

                                // Show error immediately if more than 10 digits or if field was already touched/submitted
                                if (digitsOnly.length > 10 || touched.phone || submitCount > 0) {
                                  setFieldTouched("phone", true, false);
                                }
                              }}
                              onFocus={(e) => {
                                // Mark as touched on focus so errors show if validation fails
                                if (!touched.phone) {
                                  setFieldTouched("phone", true, false);
                                }
                              }}
                              onBlur={(e) => {
                                setFieldTouched("phone", true);
                              }}
                              id="phone"
                              error={(touched.phone || submitCount > 0) && errors.phone ? errors.phone : undefined}
                            />
                            <Input
                              label="Designation"
                              name="designation"
                              id="designation"
                              placeholder="Founder"
                              value={values.designation}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={(touched.designation || submitCount > 0) && errors.designation ? errors.designation : undefined}
                              required
                            />
                            <Input
                              label="Password"
                              id="password"
                              name="password"
                              type="text"
                              placeholder="********"
                              value={"*".repeat(values.password?.length ?? 0)}
                              suppressHydrationWarning
                              data-lpignore="true"
                              data-1p-ignore="true"
                              data-bwignore="true"
                              onChange={() => {
                                // Intentionally no-op: value is controlled + masked.
                                // Actual value updates happen via onKeyDown/onPaste handlers.
                              }}
                              onKeyDown={handleAsteriskMaskKeyDown("password")}
                              onPaste={handleAsteriskMaskPaste("password")}
                              onBlur={handleBlur}
                              error={(touched.password || submitCount > 0) && errors.password ? errors.password : undefined}
                              autoComplete="new-password"
                              required
                            />
                            <Input
                              label="Confirm password"
                              id="confirmPassword"
                              name="confirmPassword"
                              type="text"
                              placeholder="********"
                              value={"*".repeat(values.confirmPassword?.length ?? 0)}
                              suppressHydrationWarning
                              data-lpignore="true"
                              data-1p-ignore="true"
                              data-bwignore="true"
                              onChange={() => {
                                // Intentionally no-op: value is controlled + masked.
                                // Actual value updates happen via onKeyDown/onPaste handlers.
                              }}
                              onKeyDown={handleAsteriskMaskKeyDown("confirmPassword")}
                              onPaste={handleAsteriskMaskPaste("confirmPassword")}
                              onBlur={handleBlur}
                              error={(touched.confirmPassword || submitCount > 0) && errors.confirmPassword ? errors.confirmPassword : undefined}
                              autoComplete="new-password"
                              required
                            />
                          </>
                        ) : (
                          <>
                            <Input
                              label="Organisation name"
                              name="companyName"
                              id="companyName"
                              placeholder="HROne company"
                              value={values.companyName}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={(touched.companyName || submitCount > 0) && errors.companyName ? errors.companyName : undefined}
                              required
                            />
                            <Input
                              label="Organisation website"
                              name="website"
                              id="website"
                              type="url"
                              placeholder="www.hrone.com"
                              value={values.website}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={(touched.website || submitCount > 0) && errors.website ? errors.website : undefined}
                              required
                            />
                            <div className="space-y-1.5">
                              <Label className="text-sm font-medium text-[#0f1728]">
                                Industry
                                <span className="text-destructive ml-1">*</span>
                              </Label>
                              <Select
                                value={values.industry}
                                onValueChange={(value) => {
                                  setFieldValue("industry", value);
                                  if (touched.industry || submitCount > 0) {
                                    setFieldTouched("industry", true, false);
                                  }
                                }}
                                onOpenChange={(open) => {
                                  if (!open && (touched.industry || submitCount > 0)) {
                                    setFieldTouched("industry", true);
                                  }
                                }}
                              >
                                <SelectTrigger className={`w-full h-10 border-[#cfd4dc] rounded-lg ${(touched.industry || submitCount > 0) && errors.industry ? "border-destructive" : ""
                                  }`}>
                                  <SelectValue placeholder="Select industry" />
                                </SelectTrigger>
                                <SelectContent>
                                  {industries.map((item) => (
                                    <SelectItem key={item.value} value={item.value}>
                                      {item.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              {(touched.industry || submitCount > 0) && errors.industry && (
                                <p className="text-sm text-destructive">{errors.industry}</p>
                              )}
                            </div>
                            <div className="space-y-1.5">
                              <Label className="text-sm font-medium text-[#0f1728]">
                                Organisation size
                                <span className="text-destructive ml-1">*</span>
                              </Label>
                              <Select
                                value={values.companySize}
                                onValueChange={(value) => {
                                  setFieldValue("companySize", value);
                                  if (touched.companySize || submitCount > 0) {
                                    setFieldTouched("companySize", true, false);
                                  }
                                }}
                                onOpenChange={(open) => {
                                  if (!open && (touched.companySize || submitCount > 0)) {
                                    setFieldTouched("companySize", true);
                                  }
                                }}
                              >
                                <SelectTrigger className={`w-full h-10 border-[#cfd4dc] rounded-lg ${(touched.companySize || submitCount > 0) && errors.companySize ? "border-destructive" : ""
                                  }`}>
                                  <SelectValue placeholder="Select company size" />
                                </SelectTrigger>
                                <SelectContent>
                                  {companySizes.map((item) => (
                                    <SelectItem key={item.value} value={item.value}>
                                      {item.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              {(touched.companySize || submitCount > 0) && errors.companySize && (
                                <p className="text-sm text-destructive">{errors.companySize}</p>
                              )}
                            </div>
                          </>
                        )}

                        <div className="flex gap-3">
                          {step === 2 && (
                            <Button
                              type="button"
                              variant="secondary"
                              className="flex-1"
                              onClick={handleBack}
                            >
                              Back
                            </Button>
                          )}
                          <Button
                            type="button"
                            variant="default"
                            className="flex-1"
                            onClick={step === 1 ? handleContinue : handleStep2Submit}
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Processing...
                              </>
                            ) : (
                              <>
                                {step === 1 ? "Continue" : "Complete Setup"}
                                <ArrowRight className="w-4 h-4 ml-2" />
                              </>
                            )}
                          </Button>
                        </div>

                        <div className="relative">
                          <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-200" />
                          </div>
                          <div className="relative flex justify-center">
                            <span className="bg-white px-2 text-xs text-[#62748e] uppercase">
                              Or continue with
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <Button type="button" variant="social" className="w-full">
                            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                              <path
                                fill="currentColor"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                              />
                              <path
                                fill="currentColor"
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                              />
                              <path
                                fill="currentColor"
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                              />
                              <path
                                fill="currentColor"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                              />
                            </svg>
                            Google
                          </Button>
                          <Button type="button" variant="social" className="w-full">
                            <svg
                              className="w-4 h-4 mr-2"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                            </svg>
                            Facebook
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Form>
                );
              }}
            </Formik>

            <div className="flex flex-col items-center gap-4">
              <div className="text-center text-sm text-[#45556c]">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-[#02563d] font-medium hover:underline"
                >
                  Sign In
                </Link>
              </div>

              <Link
                href="#"
                className="inline-flex items-center gap-2 text-sm text-[#02563d] font-medium hover:underline"
              >
                <Users className="w-4 h-4" />
                Invite team member
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
