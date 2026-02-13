"use client";

import { Sidebar } from "@/components/app-view/sidebar";
import { DashboardHeader } from "@/components/app-view/dashboard-header";
import { usePathname } from "next/navigation";
import { useAppDispatch } from "@/store/hooks";
import { useEffect, useState } from "react";
import { fetchForm, fetchViews } from "@/store/app/app.thunks";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const [utilsLoaded, setUtilsLoaded] = useState(false);

  useEffect(() => {
    Promise.allSettled([
      dispatch(fetchForm()).unwrap(),
      dispatch(fetchViews()).unwrap(),
    ])
      .then(([formResult, viewsResult]) => {
        if (formResult.status === "rejected") {
          toast.error(formResult.reason || "Failed to fetch Form Properties");
        }
        if (viewsResult.status === "rejected") {
          toast.error(viewsResult.reason || "Failed to fetch Views");
        }
      })
      .finally(() => {
        setUtilsLoaded(true);
      });
  }, [dispatch]);

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
        <main className="px-6 py-[10px]">
          {utilsLoaded ? (
            children
          ) : (
            <div className="flex items-center justify-center min-h-[60vh]">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
