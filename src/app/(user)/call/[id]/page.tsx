"use client";

import { useParams } from "next/navigation";
import CallPage from "@/components/user/call/call-page";

export default function ApplicantAuthPage() {
  const params = useParams();
  const interviewId = params?.id as string;

  return <CallPage interviewId={interviewId} />;
}
