"use client";

import { useParams, useSearchParams } from "next/navigation";
import CallPage from "@/components/user/call/call-page";

export default function ApplicantAuthPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const interviewId = params?.id as string;

  return (
    <CallPage
      interviewId={"1"}
    />
  );
}
