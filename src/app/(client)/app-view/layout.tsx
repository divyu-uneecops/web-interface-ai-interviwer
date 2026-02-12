"use client";

import { Sidebar } from "@/components/app-view/sidebar";
import { DashboardHeader } from "@/components/app-view/dashboard-header";
import { usePathname } from "next/navigation";
import { useAppDispatch } from "@/store/hooks";
import { useEffect } from "react";
import { fetchForm } from "@/store/app/app.thunks";
import { toast } from "sonner";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();
  const pathname = usePathname();

  useEffect(() => {
    dispatch(fetchForm())
      .unwrap()
      .catch((error: any) => {
        toast.error(error || "Failed to fetch Form Properties");
      });
  }, []);

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Sidebar */}
      {/* Hide Sidebar on /app-view/profile */}
      {pathname && !pathname.startsWith("/app-view/profile") && <Sidebar />}

      {/* Main Content */}
      <div
        className={`${
          pathname && !pathname.startsWith("/app-view/profile") ? "pl-64" : ""
        }`}
      >
        {/* Header */}
        <DashboardHeader />

        {/* Page Content */}
        <main className="px-6 py-[10px]">{children}</main>
      </div>
    </div>
  );
}
