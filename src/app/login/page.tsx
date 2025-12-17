"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { StatsPanel } from "@/components/stats-panel";
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

export default function LoginPage() {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [keepSignedIn, setKeepSignedIn] = useState(false);

  const handleSendCode = () => {
    console.log("Sending verification code to:", emailOrPhone);
    // In a real app, this would send the code and redirect to verification
  };

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Main Content */}
      <div className="flex min-h-screen">

         {/* Left Side - Stats Panel */}
         <div className="hidden lg:block w-1/2 h-screen sticky top-0">
          <StatsPanel />
        </div>
        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 min-h-screen">
          <div className="w-full max-w-md flex flex-col gap-8">
            <Logo />

            <div className="flex flex-col gap-1">
              <Card className="p-6 flex flex-col gap-6">
                <CardHeader className="px-0">
                  <CardTitle>Welcome Back</CardTitle>
                  <CardDescription>
                    Sign in to your InterviewAI account
                  </CardDescription>
                </CardHeader>

                <CardContent className="px-0 pb-0 flex flex-col gap-4">
                  <Input
                    label="Email Address or Phone number"
                    id="email-or-phone"
                    type="text"
                    placeholder="Email or phone number"
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                  />

                  <Checkbox
                    id="keep-signed-in"
                    label="Keep me signed in"
                    checked={keepSignedIn}
                    onCheckedChange={setKeepSignedIn}
                  />

                  <Button
                    variant="default"
                    className="w-full"
                    onClick={handleSendCode}
                  >
                    Send a verification code
                  </Button>

                  {/* Divider */}
                  <div className="relative h-4 flex items-center justify-center">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-200" />
                    </div>
                    <div className="relative bg-white px-2">
                      <span className="text-xs text-[#62748e] uppercase">
                        Or continue with
                      </span>
                    </div>
                  </div>

                  {/* Social Login Buttons */}
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="social" className="w-full">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <path
                          d="M15.68 8.18182C15.68 7.61455 15.6291 7.06909 15.5345 6.54545H8V9.64364H12.3055C12.1164 10.64 11.5491 11.4836 10.6982 12.0509V14.0655H13.2945C14.8073 12.6691 15.68 10.6182 15.68 8.18182Z"
                          fill="#4285F4"
                        />
                        <path
                          d="M8 16C10.16 16 11.9709 15.2873 13.2945 14.0655L10.6982 12.0509C9.98545 12.5309 9.07636 12.8218 8 12.8218C5.91636 12.8218 4.15273 11.4109 3.52 9.52H0.858182V11.5927C2.17455 14.2036 4.87273 16 8 16Z"
                          fill="#34A853"
                        />
                        <path
                          d="M3.52 9.52C3.36 9.04 3.26909 8.52727 3.26909 8C3.26909 7.47273 3.36 6.96 3.52 6.48V4.40727H0.858182C0.312727 5.49091 0 6.70545 0 8C0 9.29455 0.312727 10.5091 0.858182 11.5927L3.52 9.52Z"
                          fill="#FBBC05"
                        />
                        <path
                          d="M8 3.17818C9.17818 3.17818 10.2255 3.58545 11.0418 4.37091L13.3527 2.06C11.9673 0.792727 10.1564 0 8 0C4.87273 0 2.17455 1.79636 0.858182 4.40727L3.52 6.48C4.15273 4.58909 5.91636 3.17818 8 3.17818Z"
                          fill="#EA4335"
                        />
                      </svg>
                      Google
                    </Button>
                    <Button variant="social" className="w-full">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <path
                          d="M16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 11.993 2.92547 15.3027 6.75 15.9028V10.3125H4.71875V8H6.75V6.2375C6.75 4.2325 7.94438 3.125 9.77172 3.125C10.6467 3.125 11.5625 3.28125 11.5625 3.28125V5.25H10.5538C9.56 5.25 9.25 5.86672 9.25 6.5V8H11.4688L11.1141 10.3125H9.25V15.9028C13.0745 15.3027 16 11.993 16 8Z"
                          fill="#1877F2"
                        />
                      </svg>
                      Facebook
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div className="flex items-center justify-center gap-1 mt-2">
                <span className="text-sm text-[#45556c]">
                  Don&apos;t have an account?
                </span>
                <Link href="/signup" className="text-sm text-[#02563d] font-medium hover:underline">
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
