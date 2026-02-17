"use client";

import { useParams } from "next/navigation";
import CallPage from "@/components/user/call/call-page";

import { useAppDispatch } from "@/store/hooks";
import { useEffect } from "react";
import { toast } from "sonner";
import { fetchFormProperties } from "@/store/call/call.thunks";

export default function ApplicantAuthPage() {
  const params = useParams();
  const interviewId = params?.id as string;
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchFormProperties())
      .unwrap()
      .catch((error: any) => {
        toast.error(error || "Failed to fetch Form Properties");
      });
  }, []);

  return <CallPage interviewId={interviewId} />;
}
