"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Briefcase,
  Users,
  CircleCheck,
  Trophy,
  TrendingUp,
  ArrowRight,
} from "lucide-react";

// Stat cards data
const statCards = [
  {
    label: "Active Jobs",
    value: "5",
    subtitle: "1 paused",
    icon: Briefcase,
  },
  {
    label: "Total Applicants",
    value: "143",
    subtitle: "+12 this week",
    showTrend: true,
    icon: Users,
  },
  {
    label: "Interviews Done",
    value: "90",
    subtitle: "63% completion",
    icon: CircleCheck,
  },
  {
    label: "Avg. Score",
    value: "82.2",
    subtitle: "Across all Users",
    icon: Trophy,
  },
];

// Active jobs data
const activeJobs = [
  {
    title: "Senior Frontend Developer",
    details: "Engineering • Remote",
    applicants: 24,
    interviewed: 18,
    hired: 2,
    left: 0,
  },
  {
    title: "Product Manager",
    details: "Product • San Francisco, CA",
    applicants: 31,
    interviewed: 12,
    hired: 0,
    left: 369,
  },
  {
    title: "UX Designer",
    details: "Design • New York, NY",
    applicants: 19,
    interviewed: 15,
    hired: 1,
    left: 738,
  },
];

// Recent interviews data
const recentInterviews = [
  {
    name: "Sarah Johnson",
    details: "sarthak@gmail.com • 9876543210",
    status: "Completed",
    statusColor: "bg-[#dcfce7] text-[#008236]",
    score: 87,
    initials: "SJ",
  },
  {
    name: "Michael Chen",
    details: "Product Manager • Priya Sharma",
    status: "In Progress",
    statusColor: "bg-[rgba(2,86,61,0.1)] text-[#02563d]",
    initials: "MC",
  },
  {
    name: "Emily Rodriguez",
    details: "UX Designer • Sarah Mitchell",
    status: "Scheduled",
    statusColor: "bg-[#fef9c2] text-[#a65f00]",
    initials: "ER",
  },
  {
    name: "James Wilson",
    details: "Senior Frontend Developer • Alex Chen",
    status: "Completed",
    statusColor: "bg-[#dcfce7] text-[#008236]",
    score: 92,
    initials: "JW",
  },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-[24px] h-[820px]">
      {/* Dashboard Title */}
      <div className="flex h-[36px] items-center justify-between">
        <h1 className="font-bold text-xl leading-7 text-black font-['Inter',sans-serif]">
          Dashboard
        </h1>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-4 gap-[24px] h-[138px]">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white border border-[rgba(0,0,0,0.1)] rounded-[4px] p-px"
            >
              <div className="flex flex-col gap-[8px] p-[24px] h-full">
                <div className="flex h-[20px] items-center justify-between">
                  <p className="font-['Inter',sans-serif] font-normal text-sm leading-5 text-[#45556c] tracking-[-0.15px]">
                    {stat.label}
                  </p>
                  <Icon className="w-4 h-4 text-[#45556c] shrink-0" />
                </div>
                <div className="flex h-[36px] items-start">
                  <p className="flex-1 font-['Inter',sans-serif] font-normal text-[30px] leading-[36px] text-[#0a0a0a] tracking-[0.3955px] min-w-0">
                    {stat.value}
                  </p>
                </div>
                <div className="h-[20px] relative">
                  {stat.showTrend ? (
                    <>
                      <div className="absolute left-0 top-[4px] w-3 h-3">
                        <TrendingUp className="w-3 h-3 text-[#00a63e]" />
                      </div>
                      <p className="font-['Inter',sans-serif] font-normal text-sm leading-5 text-[#00a63e] tracking-[-0.15px] absolute left-4">
                        {stat.subtitle}
                      </p>
                    </>
                  ) : (
                    <p className="font-['Inter',sans-serif] font-normal text-sm leading-5 text-[#45556c] tracking-[-0.15px]">
                      {stat.subtitle}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Jobs Section */}
      <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-[14px] p-[17px] flex flex-col gap-[12px]">
        <div className="h-[32px] flex items-center justify-between">
          <p className="font-['Inter',sans-serif] font-normal text-base leading-4 text-[#0a0a0a] tracking-[-0.3125px]">
            Active Jobs
          </p>
          <button className="h-[32px] rounded-lg w-[98.383px] relative flex items-center justify-center hover:opacity-80 transition-opacity">
            <span className="absolute font-['Inter',sans-serif] font-medium text-sm leading-5 text-[#0a0a0a] tracking-[-0.15px] left-[36.5px] top-[6.5px] translate-x-[-50%]">
              View All
            </span>
            <ArrowRight className="absolute left-[72.38px] top-2 w-4 h-4" />
          </button>
        </div>
        <div className="h-[143px] relative">
          {activeJobs.map((job, index) => (
            <div
              key={index}
              className="absolute border border-[rgba(0,0,0,0.1)] rounded-[10px] flex flex-col gap-[8px] h-[142px] top-0 w-[349px] pt-[17px] px-[17px] pb-px"
              style={{ left: `${job.left}px` }}
            >
              <div className="h-[24px]">
                <p className="font-['Inter',sans-serif] font-normal text-base leading-6 text-[#0a0a0a] tracking-[-0.3125px]">
                  {job.title}
                </p>
              </div>
              <div className="h-[20px]">
                <p className="font-['Inter',sans-serif] font-normal text-sm leading-5 text-[#45556c] tracking-[-0.15px]">
                  {job.details}
                </p>
              </div>
              <div className="h-[44px] relative">
                <div className="absolute flex flex-col items-center justify-center h-[44px] left-0 top-0 w-[98px]">
                  <div className="h-[28px] w-full flex items-center justify-center">
                    <p className="font-['Inter',sans-serif] font-normal text-lg leading-7 text-[#02563d] text-center tracking-[-0.4395px]">
                      {job.applicants}
                    </p>
                  </div>
                  <div className="h-[16px] w-full flex items-center justify-center">
                    <p className="font-['Inter',sans-serif] font-normal text-xs leading-4 text-[#62748e] text-center">
                      Applicants
                    </p>
                  </div>
                </div>
                <div className="absolute flex flex-col items-center justify-center h-[44px] left-[108px] top-0 w-[99px]">
                  <div className="h-[28px] w-full flex items-center justify-center">
                    <p className="font-['Inter',sans-serif] font-normal text-lg leading-7 text-[#00a63e] text-center tracking-[-0.4395px]">
                      {job.interviewed}
                    </p>
                  </div>
                  <div className="h-[16px] w-full flex items-center justify-center">
                    <p className="font-['Inter',sans-serif] font-normal text-xs leading-4 text-[#62748e] text-center">
                      Interviewed
                    </p>
                  </div>
                </div>
                <div className="absolute flex flex-col items-center justify-center h-[44px] left-[217px] top-0 w-[98px]">
                  <div className="h-[28px] w-full flex items-center justify-center">
                    <p className="font-['Inter',sans-serif] font-normal text-lg leading-7 text-[#9810fa] text-center tracking-[-0.4395px]">
                      {job.hired}
                    </p>
                  </div>
                  <div className="h-[16px] w-full flex items-center justify-center">
                    <p className="font-['Inter',sans-serif] font-normal text-xs leading-4 text-[#62748e] text-center">
                      Hired
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Interviews Section */}
      <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-[14px] pl-[25px] pr-px py-[25px] flex flex-col gap-[30px] h-[460px]">
        <div className="h-[16px]">
          <p className="font-['Inter',sans-serif] font-normal text-base leading-4 text-[#0a0a0a] tracking-[-0.3125px]">
            Recent Interviews
          </p>
        </div>
        <div className="flex-1 flex flex-col gap-[12px]">
          {recentInterviews.map((interview, index) => (
            <div
              key={index}
              className="border border-[rgba(0,0,0,0.1)] rounded-[10px] flex h-[82px] items-center justify-between px-[17px] py-px shrink-0 w-full"
            >
              <div className="flex gap-[16px] items-center h-[48px]">
                <div className="bg-gradient-to-b from-[#02563d] to-[#034d35] rounded-full w-10 h-10 flex items-center justify-center shrink-0">
                  <span className="font-['Inter',sans-serif] font-normal text-sm leading-5 text-white tracking-[-0.15px]">
                    {interview.initials}
                  </span>
                </div>
                <div className="flex flex-col gap-[4px] flex-1 h-[48px]">
                  <div className="h-[24px]">
                    <p className="font-['Inter',sans-serif] font-normal text-base leading-6 text-[#0a0a0a] tracking-[-0.3125px]">
                      {interview.name}
                    </p>
                  </div>
                  <div className="h-[20px]">
                    <p className="font-['Inter',sans-serif] font-normal text-sm leading-5 text-[#45556c]">
                      {interview.details}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex gap-[16px] items-center">
                <Badge
                  className={`${interview.statusColor} border-0 h-[22px] rounded-lg px-[9px] py-[3px] font-['Inter',sans-serif] font-medium text-xs leading-4 shrink-0`}
                >
                  {interview.status}
                </Badge>
                {interview.score && (
                  <div className="flex flex-col items-center h-[44px] w-[32.703px] shrink-0">
                    <div className="h-[28px] w-full flex items-center justify-center">
                      <p className="font-['Inter',sans-serif] font-normal text-xl leading-7 text-[#02563d] text-center tracking-[-0.4492px]">
                        {interview.score}
                      </p>
                    </div>
                    <div className="h-[16px] w-full flex items-center justify-center">
                      <p className="font-['Inter',sans-serif] font-normal text-xs leading-4 text-[#62748e] text-center">
                        Score
                      </p>
                    </div>
                  </div>
                )}
                <Button className="bg-[#02563d] h-8 rounded-lg w-[55.969px] hover:bg-[#02563d]/90 shrink-0 flex items-center justify-center">
                  <span className="font-['Inter',sans-serif] font-medium text-sm leading-5 text-white tracking-[-0.15px]">
                    View
                  </span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
