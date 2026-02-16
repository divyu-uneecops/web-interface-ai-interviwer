"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

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
import { authService } from "../services/auth.service";
import { isValidEmail } from "../utils/auth.utils";

type ForgotPasswordFormValues = {
    email: string;
};

const initialValues: ForgotPasswordFormValues = {
    email: "",
};

const normalizeEmail = (raw: string) => {
    const trimmed = raw.trim();
    return trimmed;
};

const validate = (values: ForgotPasswordFormValues) => {
    const errors: Record<string, string> = {};
    const email = values.email?.trim() || "";

    if (!email) {
        errors.email = "Email address is required";
        return errors;
    }

    if (!isValidEmail(email)) {
        errors.email = "Please enter a valid email address";
    }

    return errors;
};

export default function ForgotPassword() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const formik = useFormik<ForgotPasswordFormValues>({
        initialValues,
        validate,
        validateOnChange: true,
        validateOnBlur: true,
        validateOnMount: false,
        onSubmit: async (values, { setTouched }) => {
            setTouched({ email: true });
            setIsSubmitting(true);

            try {
                const normalizedEmail = normalizeEmail(values.email);

                // Best-effort: if it's an email, check if user exists first (matches login behavior).
                if (isValidEmail(normalizedEmail)) {
                    const verify = await authService.verifyEmail({ identifier: normalizedEmail });
                    if (verify?.exists === false) {
                        toast.error("User does not exist. Please sign up.", { duration: 8000 });
                        return;
                    }
                }

                await authService.forgotPasswordRequestOtp({ email: normalizedEmail });

                try {
                    sessionStorage.setItem("otpResendAvailableAt", (Date.now() + 60_000).toString());
                    sessionStorage.setItem("emailOrPhone", normalizedEmail);
                    sessionStorage.setItem("otpBackTo", "/forgot-password");
                    sessionStorage.setItem("otpSuccessRedirectTo", "/login");
                } catch {
                    // ignore storage errors (e.g. privacy mode)
                }

                toast.success("Verification code sent. Please check your inbox.", {
                    duration: 4000,
                });
                router.push("/reset-password");
            } catch (error: any) {
                toast.error(
                    error?.response?.data?.message ||
                    error?.message ||
                    "Failed to send verification code. Please try again.",
                    { duration: 8000 }
                );
            } finally {
                setIsSubmitting(false);
            }
        },
    });

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

                {/* Right Side - Forgot Password Form */}
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
                                            Enter your email to receive a verification code
                                        </CardDescription>
                                    </CardHeader>

                                    <CardContent className="px-0 flex flex-col gap-4">
                                        <Input
                                            id="email"
                                            name="email"
                                            type="text"
                                            label="Email Address"
                                            placeholder="Email address"
                                            required
                                            value={formik.values.email}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={
                                                (formik.touched.email || formik.submitCount > 0) &&
                                                    formik.errors.email
                                                    ? formik.errors.email
                                                    : undefined
                                            }
                                            disabled={isSubmitting}
                                            className="h-9 w-full rounded-md border border-[#e5e5e5] bg-white px-3 py-1 text-sm leading-5 text-[#0a0a0a] placeholder:text-[#737373] shadow-[0_1px_2px_0_rgba(2,86,61,0.12)] outline-none focus:border-[#A3A3A3] focus:shadow-[0_0_0_3px_rgba(2,86,61,0.50)] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                        />

                                        <Button
                                            type="submit"
                                            variant="default"
                                            className="w-full h-9 bg-[#02563d] text-[#fafafa] font-medium text-sm rounded-md shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] hover:bg-[#02563d]/90 disabled:opacity-50"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    Sending...
                                                </>
                                            ) : (
                                                "Send verification code"
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


