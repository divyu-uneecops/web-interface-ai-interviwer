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

export interface FilterGroup {
  id: string;
  label: string;
  options: FilterOption[];
}

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterState {
  [key: string]: string[];
}

interface FilterDropdownProps {
  filterGroups: FilterGroup[];
  onApplyFilters: (filters: FilterState) => void;
  initialFilters: FilterState;
  buttonLabel?: string;
  buttonClassName?: string;
  contentClassName?: string;
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
      const current = prev[groupId] || [];
      if (current.includes(value)) {
        return {
          ...prev,
          [groupId]: current.filter((v) => v !== value),
        };
      } else {
        return {
          ...prev,
          [groupId]: [...current, value],
        };
      }
    });
  };

  const handleApplyFilters = () => {
    onApplyFilters(tempFilters);
    setOpen(false);
  };

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
        className={
          contentClassName ||
          "w-[207px] p-0 shadow-md border border-[#e5e5e5] rounded-md overflow-hidden"
        }
      >
        <div>
          {filterGroups?.map((group, groupIndex) => (
            <div key={group?.id}>
              <div className="py-[6px]">
                <DropdownMenuLabel className="px-[8px] py-[6px] text-xs font-semibold text-[#0A0A0A] tracking-[0.5px] leading-[16px]">
                  {group?.label}
                </DropdownMenuLabel>
                {group?.options?.map((option) => (
                  <DropdownMenuCheckboxItem
                    key={option?.value}
                    checked={(tempFilters[group?.id] || []).includes(
                      option?.value
                    )}
                    onCheckedChange={() =>
                      handleFilterChange(group?.id, option?.value)
                    }
                    onSelect={(e) => e.preventDefault()}
                    className="pl-8 pr-2 py-[6px] text-sm text-[#1a1a1a] leading-[20px] hover:bg-[#f5f5f5] rounded-sm cursor-pointer data-highlighted:bg-[#f5f5f5] focus:bg-[#f5f5f5]"
                  >
                    {option?.label}
                  </DropdownMenuCheckboxItem>
                ))}
              </div>
              {groupIndex < filterGroups?.length - 1 && (
                <DropdownMenuSeparator />
              )}
            </div>
          ))}
        </div>

        {/* Apply Filters Button */}
        <div className="border-t border-[#e5e5e5] bg-[#fafafa]">
          <div className="p-[4px]">
            <Button
              variant="ghost"
              className="w-full h-9 justify-center text-[#02563d] hover:text-[#02563d] hover:bg-[#02563d]/5 active:bg-[#02563d]/10 font-medium text-sm rounded-sm transition-colors"
              onClick={handleApplyFilters}
            >
              Apply filters
            </Button>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
