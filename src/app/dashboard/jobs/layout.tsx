"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/store/hooks";
import { fetchFormProperties } from "@/store/jobs/jobs.thunks";
import { toast } from "sonner";

export default function JobsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchFormProperties())
      .unwrap()
      .catch((error: any) => {
        toast.error(error || "Failed to fetch Form Properties");
      });
  }, []);

  return <>{children}</>;
}
