"use client";

import {
  Briefcase,
  Users,
  CalendarClock,
  CircleCheck,
  Layers,
  UserPlus,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { JobStat } from "../interfaces/job.interface";

const iconMap = {
  jobs: {
    Icon: Briefcase,
    bgColor: "bg-[rgba(2,86,61,0.1)]",
    iconColor: "text-[#02563d]",
  },
  rounds: {
    Icon: Layers,
    bgColor: "bg-amber-50",
    iconColor: "text-amber-600",
  },
  applicants: {
    Icon: Users,
    bgColor: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  scheduled: {
    Icon: CalendarClock,
    bgColor: "bg-purple-50",
    iconColor: "text-purple-600",
  },
  completed: {
    Icon: CircleCheck,
    bgColor: "bg-green-50",
    iconColor: "text-green-600",
  },
};

interface JobStatsCardProps {
  stat: JobStat;
  className?: string;
}

export function JobStatsCard({ stat, className }: JobStatsCardProps) {
  const { Icon, bgColor, iconColor } =
    iconMap[stat.icon as keyof typeof iconMap];

  return (
    <div
      className={cn(
        "flex items-center gap-3 bg-white border border-[rgba(0,0,0,0.1)] rounded h-[90px] pl-[25px] pr-px",
        className
      )}
    >
      <div
        className={cn(
          "w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0",
          bgColor
        )}
      >
        <Icon className={cn("w-5 h-5", iconColor)} />
      </div>
      <div className="flex flex-col h-12">
        <p className="text-2xl font-normal text-neutral-950 leading-8 tracking-[0.07px] font-['Inter']">
          {stat.value}
        </p>
        <p className="text-xs font-normal text-[#45556c] leading-4 font-['Inter']">
          {stat.label}
        </p>
      </div>
    </div>
  );
}

interface JobStatsGridProps {
  stats: JobStat[];
}

export function JobStatsGrid({ stats }: JobStatsGridProps) {
  return (
    <div className="grid grid-cols-4 gap-4 h-[90px]">
      {stats?.map((stat, index) => (
        <JobStatsCard key={index} stat={stat} />
      ))}
    </div>
  );
}
