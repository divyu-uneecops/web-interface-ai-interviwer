"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { CheckIcon } from "lucide-react"

import { cn } from "@/lib/utils"

interface CheckboxProps extends Omit<React.ComponentProps<typeof CheckboxPrimitive.Root>, 'onCheckedChange'> {
  label?: string
  onCheckedChange?: (checked: boolean) => void
}

function Checkbox({
  className,
  label,
  id,
  onCheckedChange,
  ...props
}: CheckboxProps) {
  const handleCheckedChange = (checked: boolean | "indeterminate") => {
    onCheckedChange?.(checked === true)
  }

  return (
    <div className="flex items-center gap-2">
      <CheckboxPrimitive.Root
        id={id}
        data-slot="checkbox"
        className={cn(
          "peer border-[#02563D] dark:bg-input/30 data-[state=checked]:bg-[#02563D] data-[state=checked]:text-white dark:data-[state=checked]:bg-[#02563D] data-[state=checked]:border-[#02563D] focus-visible:border-[#02563D] focus-visible:ring-[#02563D]/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        onCheckedChange={handleCheckedChange}
        {...props}
      >
        <CheckboxPrimitive.Indicator
          data-slot="checkbox-indicator"
          className="grid place-content-center text-current transition-none"
        >
          <CheckIcon className="size-3.5" />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
      {label && (
        <label
          htmlFor={id}
          className="text-sm text-[#45556c] cursor-pointer"
        >
          {label}
        </label>
      )}
    </div>
  )
}

export { Checkbox }
