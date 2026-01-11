"use client";

import { Calendar, Clock, CircleCheck, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import { InterviewStat } from "../interfaces/interview.interface";

const iconMap = {
  total: {
    Icon: Calendar,
    bgColor: "bg-[rgba(2,86,61,0.1)]",
    iconColor: "text-[#02563d]",
  },
  scheduled: {
    Icon: Clock,
    bgColor: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  completed: {
    Icon: CircleCheck,
    bgColor: "bg-green-50",
    iconColor: "text-green-600",
  },
  score: {
    Icon: Target,
    bgColor: "bg-yellow-50",
    iconColor: "text-yellow-600",
  },
};

interface InterviewStatsCardProps {
  stat: InterviewStat;
  className?: string;
}

export function InterviewStatsCard({
  stat,
  className,
}: InterviewStatsCardProps) {
  const { Icon, bgColor, iconColor } = iconMap[stat.icon];

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

interface InterviewStatsGridProps {
  stats: InterviewStat[];
}

export function InterviewStatsGrid({ stats }: InterviewStatsGridProps) {
  return (
    <div className="grid grid-cols-4 gap-4 h-[90px]">
      {stats?.map((stat, index) => (
        <InterviewStatsCard key={index} stat={stat} />
      ))}
    </div>
  );
}
