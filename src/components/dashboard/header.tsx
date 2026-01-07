"use client";

import { useState } from "react";
import { Bell, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreateInterviewDialog } from "@/components/dashboard/create-interview/create-interview-dialog";
import { usePathname } from "next/navigation";

interface DashboardHeaderProps {
  userName?: string;
}

export function DashboardHeader({ userName = "Rahul" }: DashboardHeaderProps) {
  const [isCreateInterviewOpen, setIsCreateInterviewOpen] = useState(false);

  return (
    <>
      <header className="h-[72px] bg-[rgba(255,255,255,0.8)] backdrop-blur-sm border-b border-[rgba(0,0,0,0.1)] flex items-center justify-between px-8">
        {/* Greeting */}
        {/* Dynamically show header/subtitle based on route */}
        {/* 
          Use Next.js's usePathname hook from 'next/navigation' to avoid direct window access.
          This works properly in both client and server components, is SSR safe, and no warning will appear.
        */}
        {(() => {
          // Import usePathname at the top of your file:
          // import { usePathname } from "next/navigation";
          const pathname = usePathname();

          let h1 = `Hello ${userName} !`;
          let p = "Manage your job openings and hiring pipeline";

          if (pathname && pathname.startsWith("/dashboard/jobs")) {
            h1 = "Job Openings";
            p = "Manage your job openings and hiring pipeline";
          } else if (
            pathname &&
            pathname.startsWith("/dashboard/interviewers")
          ) {
            h1 = "AI Interviewers";
            p = "Manage your job openings and hiring pipeline";
          } else if (pathname && pathname.startsWith("/dashboard/interviews")) {
            h1 = "Interviews";
            p = "View and manage candidate interviews";
          } else if (pathname && pathname.startsWith("/dashboard")) {
            h1 = `Hello ${userName} !`;
            p = "Manage your job openings and hiring pipeline";
          }

          return (
            <div>
              <h1 className="text-xl font-bold text-black leading-7">{h1}</h1>
              <p className="text-xs text-black leading-4">{p}</p>
            </div>
          );
        })()}

        {/* Actions */}
        <div className="flex items-center gap-3 h-9">
          <Button
            variant="secondary"
            size="default"
            className="h-9 px-4 rounded-lg shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]"
            onClick={() => setIsCreateInterviewOpen(true)}
          >
            <Plus className="w-4 h-4" />
            Create interview
          </Button>

          <button className="p-0 hover:bg-[rgba(0,0,0,0.05)] rounded-lg transition-colors">
            <Bell className="w-6 h-6 text-[#02563d]" strokeWidth={1.5} />
          </button>

          {/* User Avatar */}
          <div className="px-1">
            <div className="w-9 h-9 bg-[rgba(2,86,61,0.1)] rounded-full flex items-center justify-center">
              <span className="text-sm font-normal text-[#02563d] tracking-[-0.15px]">
                JD
              </span>
            </div>
          </div>
        </div>
      </header>

      <CreateInterviewDialog
        open={isCreateInterviewOpen}
        onOpenChange={setIsCreateInterviewOpen}
      />
    </>
  );
}
