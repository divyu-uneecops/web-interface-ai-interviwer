"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/store/hooks";
import { toast } from "sonner";
import { fetchRoles } from "@/store/user-management/user-management.thunks";

export default function JobsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchRoles())
      .unwrap()
      .catch((error: any) => {
        toast.error(error || "Failed to fetch Form Properties");
      });
  }, []);

  return <>{children}</>;
}
