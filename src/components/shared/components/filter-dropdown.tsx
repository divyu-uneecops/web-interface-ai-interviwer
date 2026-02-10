"use client";

import { useState, useEffect } from "react";
import { ListFilter } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  FilterDropdownProps,
  FilterState,
} from "../interfaces/shared.interface";
import { cn } from "@/lib/utils";

function isStringArray(value: string[] | string): value is string[] {
  return Array.isArray(value);
}

export function FilterDropdown({
  filterGroups,
  onApplyFilters,
  initialFilters = {},
  buttonLabel = "Filters",
  buttonClassName,
  contentClassName,
}: FilterDropdownProps) {
  const [tempFilters, setTempFilters] = useState<FilterState>(initialFilters);
  const [open, setOpen] = useState(false);

  // Sync tempFilters with initialFilters when they change
  useEffect(() => {
    setTempFilters(initialFilters);
  }, [initialFilters]);

  const handleFilterChange = (groupId: string, value: string) => {
    setTempFilters((prev) => {
      const current = prev[groupId];
      const arr = Array.isArray(current) ? current : [];
      if (arr.includes(value)) {
        return {
          ...prev,
          [groupId]: arr.filter((v) => v !== value),
        };
      } else {
        return {
          ...prev,
          [groupId]: [...arr, value],
        };
      }
    });
  };

  const handleTextFilterChange = (fieldId: string, value: string) => {
    setTempFilters((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  const handleApplyFilters = () => {
    onApplyFilters(tempFilters);
    setOpen(false);
  };

  const hasContent = filterGroups?.length > 0;

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="secondary"
          className={
            buttonClassName ||
            "h-9 px-4 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]"
          }
        >
          <ListFilter className="w-4 h-4" />
          {buttonLabel}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className={cn(
          contentClassName ||
            "w-[220px] p-[4px] gap-[12px] flex flex-col items-start bg-white border border-[#e5e5e5] rounded-[8px] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)] overflow-hidden"
        )}
      >
        <div className="content-stretch flex flex-col items-start relative shrink-0 w-full gap-0">
          {filterGroups?.map((group, groupIndex) => (
            <div
              key={group?.id}
              className="content-stretch flex flex-col items-start relative shrink-0 w-full"
            >
              {group?.type === "text" ? (
                <div className="content-stretch flex flex-col items-start relative shrink-0 w-full px-[8px] py-[6px]">
                  <DropdownMenuLabel className="px-0 py-[6px] text-sm font-semibold text-[#0a0a0a] leading-[20px] w-full whitespace-pre-wrap">
                    {group?.label}
                  </DropdownMenuLabel>
                  <input
                    type="text"
                    placeholder={
                      group?.placeholder ??
                      `Search by ${group?.label?.toLowerCase() ?? ""}`
                    }
                    value={
                      typeof tempFilters[group?.id] === "string"
                        ? tempFilters[group?.id]
                        : ""
                    }
                    onChange={(e) =>
                      handleTextFilterChange(group?.id, e.target.value)
                    }
                    onKeyDown={(e) => e.stopPropagation()}
                    className="w-full mt-1 px-2 py-1.5 text-sm text-[#0a0a0a] border border-[#e5e5e5] rounded-md outline-none placeholder:text-[#737373] focus:ring-1 focus:ring-[#02563d] focus:border-[#02563d]"
                  />
                </div>
              ) : (
                <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
                  <DropdownMenuLabel className="px-[8px] py-[6px] text-sm font-semibold text-[#0a0a0a] leading-[20px] w-full whitespace-pre-wrap">
                    {group?.label}
                  </DropdownMenuLabel>
                  {group?.options?.map((option) => (
                    <DropdownMenuCheckboxItem
                      key={option?.value}
                      checked={(isStringArray(tempFilters[group?.id])
                        ? tempFilters[group?.id]
                        : []
                      ).includes(option?.value)}
                      onCheckedChange={() =>
                        handleFilterChange(group?.id, option?.value)
                      }
                      onSelect={(e) => e.preventDefault()}
                      className="w-full pl-[32px] pr-[8px] py-[6px] text-sm text-[#0a0a0a] leading-[20px] hover:bg-[#f5f5f5] rounded-sm cursor-pointer data-highlighted:bg-[#f5f5f5] focus:bg-[#f5f5f5] [&>span]:size-4"
                    >
                      {option?.label}
                    </DropdownMenuCheckboxItem>
                  ))}
                </div>
              )}
              {groupIndex < (filterGroups?.length ?? 0) - 1 && (
                <DropdownMenuSeparator className="bg-[#e5e5e5] h-px w-full my-0 mx-0" />
              )}
            </div>
          ))}
        </div>

        {hasContent && (
          <div className="content-stretch flex gap-0 items-center justify-end relative shrink-0 w-full">
            <Button
              variant="default"
              className="h-[36px] px-[16px] py-[8px] w-[212px] rounded-md bg-[#02563d] text-white hover:bg-[#02563d]/90 shadow-[0px_1px_2px_0px_rgba(2,86,61,0.12)]"
              onClick={handleApplyFilters}
            >
              Apply filters
            </Button>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
