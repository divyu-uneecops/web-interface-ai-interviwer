"use client";

import { useState } from "react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CreateInterviewDialog } from "@/components/app-view/create-interview/create-interview-dialog";
import { usePathname, useRouter } from "next/navigation";
import { Logo } from "../logo";

interface DashboardHeaderProps {
  userName?: string;
}

export function DashboardHeader({ userName = "Rahul" }: DashboardHeaderProps) {
  const [isCreateInterviewOpen, setIsCreateInterviewOpen] = useState(false);
  const router = useRouter();
  const initial = (userName?.trim() || "U").charAt(0).toUpperCase();

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

          if (pathname && pathname.startsWith("/app-view/jobs")) {
            h1 = "Job Openings";
            p = "Manage your job openings and hiring pipeline";
          } else if (
            pathname &&
            pathname.startsWith("/app-view/interviewers")
          ) {
            h1 = "AI Interviewers";
            p = "Manage your job openings and hiring pipeline";
          } else if (pathname && pathname.startsWith("/app-view/interviews")) {
            h1 = "Interviews";
            p = "View and manage candidate interviews";
          } else if (pathname && pathname.startsWith("/app-view/profile")) {
            return <Logo />;
          } else if (pathname && pathname.startsWith("/app-view/dashboard")) {
            h1 = `Hello ${userName} !`;
            p = "Manage your job openings and hiring pipeline";
          }

          return (
            <div>
              <h1 className="text-xl font-bold text-black leading-7">{h1}</h1>
              <p className="text-xs text-black leading-4 font-normal">{p}</p>
            </div>
          );
        })()}

        {/* Actions */}
        <div className="flex items-center gap-3 h-9">
          {/* <Button
            variant="secondary"
            size="default"
            className="h-9 px-4 rounded-lg shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]"
            onClick={() => setIsCreateInterviewOpen(true)}
          >
            <Plus className="w-4 h-4" />
            Create interview
          </Button> */}

          {/* <button className="p-0 hover:bg-[rgba(0,0,0,0.05)] rounded-lg transition-colors">
            <Bell className="w-6 h-6 text-[#02563d]" strokeWidth={1.5} />
          </button> */}

          {/* User avatar — click to open menu with Logout */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="rounded-full p-0.5 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#02563d] focus:ring-offset-2 transition-opacity"
                aria-label="Account menu"
              >
                <div className="w-9 h-9 rounded-full bg-[#02563d]/10 flex items-center justify-center">
                  <span className="text-sm font-medium text-[#02563d]">
                    {initial}
                  </span>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              sideOffset={6}
              className="w-40 rounded-lg border border-[#e5e5e5] bg-white p-1 shadow-md"
            >
              <DropdownMenuItem
                onClick={() => router.push("/")}
                className="cursor-pointer gap-2 rounded-md px-3 py-2 text-sm text-[#dc2626] focus:bg-red-50 focus:text-[#dc2626]"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <CreateInterviewDialog
        open={isCreateInterviewOpen}
        onOpenChange={setIsCreateInterviewOpen}
      />
    </>
  );
}
