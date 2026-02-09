import * as React from "react";
import { cn } from "@/lib/utils";

export type StatusTagVariant =
  | "success"
  | "warning"
  | "neutral"
  | "active"
  | "pending";

export interface StatusTagProps {
  children: React.ReactNode;
  variant?: StatusTagVariant;
  className?: string;
}

const variantStyles: Record<StatusTagVariant, string> = {
  success: "bg-[#def2eb] text-[#0e4230]",
  warning: "bg-[#fff5d7] text-[#665830]",
  neutral: "bg-[#e5e5e5] text-[#000000]",
  active: "bg-[#DEF2EB] text-[#0E4230]",
  pending: "bg-[#FFF5D7] text-[#665830]",
};

export function StatusTag({
  children,
  variant = "neutral",
  className,
}: StatusTagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-normal leading-4 tracking-[0.3px]",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
