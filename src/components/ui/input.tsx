import * as React from "react"

import { cn } from "@/lib/utils"

interface InputProps extends React.ComponentProps<"input"> {
  label?: string
  error?: string
  required?: boolean
}

function Input({ className, type, label, id, error, required, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={id}
          className="text-sm font-medium text-[#0a0a0a]"
        >
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
      )}
      <input
        id={id}
        type={type}
        data-slot="input"
        aria-invalid={error ? "true" : undefined}
        className={cn(
          "file:text-foreground placeholder:text-[#6B6B6B] selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-[#C4C4C4] h-9 w-full min-w-0 rounded-md border bg-white px-3 py-1 text-base shadow-xs transition-[color,box-shadow,border-color] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "focus-visible:outline-none focus-visible:border focus-visible:border-[#A3A3A3] focus-visible:shadow-[0_0_0_3px_rgba(2,86,61,0.50)]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          error && "border-destructive",
          error && "focus-visible:border-destructive focus-visible:shadow-[0_0_0_3px_rgba(220,38,38,0.20)] focus-visible:bg-white",
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  )
}

export { Input }
