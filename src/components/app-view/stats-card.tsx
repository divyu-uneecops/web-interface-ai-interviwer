"use client";

import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  icon: LucideIcon;
  iconBgColor?: string;
  iconColor?: string;
  value: string | number;
  label: string;
  className?: string;
}

export function StatsCard({
  icon: Icon,
  iconBgColor = "bg-[rgba(2,86,61,0.1)]",
  iconColor = "text-[#02563d]",
  value,
  label,
  className,
}: StatsCardProps) {
  return (
    <div
      className={cn(
        "bg-white border border-[rgba(0,0,0,0.1)] rounded px-6 py-4",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0",
            iconBgColor
          )}
        >
          <Icon className={cn("w-5 h-5", iconColor)} />
        </div>
        <div>
          <p className="text-2xl font-normal text-neutral-950 leading-8">
            {value}
          </p>
          <p className="text-xs text-[#45556c]">{label}</p>
        </div>
      </div>
    </div>
  );
}
