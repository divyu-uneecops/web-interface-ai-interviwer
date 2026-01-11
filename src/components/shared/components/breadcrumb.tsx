"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav
      className={cn("flex items-center gap-1.5 flex-wrap", className)}
      aria-label="Breadcrumb"
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        const isFirst = index === 0;

        return (
          <div key={index} className="flex items-center gap-1.5">
            {!isFirst && (
              <ChevronRight className="w-[15px] h-[15px] text-[#737373]" />
            )}
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="text-sm text-[#737373] hover:text-[#0a0a0a] transition-colors"
              >
                {item?.label}
              </Link>
            ) : (
              <span
                className={cn(
                  "text-sm",
                  isLast ? "text-[#0a0a0a]" : "text-[#737373]"
                )}
              >
                {item?.label}
              </span>
            )}
          </div>
        );
      })}
    </nav>
  );
}
