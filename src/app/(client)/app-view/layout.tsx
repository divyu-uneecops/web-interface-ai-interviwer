"use client";

import { Sidebar } from "@/components/app-view/sidebar";
import { DashboardHeader } from "@/components/app-view/header";
import { usePathname } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

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
