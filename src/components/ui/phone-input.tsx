import * as React from "react"
import { cn } from "@/lib/utils"
import { Input } from "./input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select"

interface PhoneInputProps {
  label?: string
  required?: boolean
  error?: string
  countryCode: string
  phoneNumber: string
  onCountryCodeChange: (value: string) => void
  onPhoneNumberChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
  id?: string
  className?: string
}

// Common country codes
const countryCodes = [
  { value: "+1", label: "+1", country: "US" },
  { value: "+91", label: "+91", country: "IN" },
  { value: "+44", label: "+44", country: "GB" },
  { value: "+86", label: "+86", country: "CN" },
  { value: "+81", label: "+81", country: "JP" },
  { value: "+49", label: "+49", country: "DE" },
  { value: "+33", label: "+33", country: "FR" },
  { value: "+61", label: "+61", country: "AU" },
  { value: "+55", label: "+55", country: "BR" },
  { value: "+7", label: "+7", country: "RU" },
  { value: "+82", label: "+82", country: "KR" },
  { value: "+39", label: "+39", country: "IT" },
  { value: "+34", label: "+34", country: "ES" },
  { value: "+31", label: "+31", country: "NL" },
  { value: "+46", label: "+46", country: "SE" },
  { value: "+41", label: "+41", country: "CH" },
  { value: "+65", label: "+65", country: "SG" },
  { value: "+971", label: "+971", country: "AE" },
  { value: "+27", label: "+27", country: "ZA" },
  { value: "+52", label: "+52", country: "MX" },
]

export function PhoneInput({
  label,
  required,
  error,
  countryCode,
  phoneNumber,
  onCountryCodeChange,
  onPhoneNumberChange,
  onFocus,
  onBlur,
  id,
  className,
}: PhoneInputProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && (
        <label
          htmlFor={id}
          className="text-sm font-medium text-[#0a0a0a]"
        >
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
      )}
      <div className="flex gap-2">
        <Select
          value={countryCode}
          onValueChange={onCountryCodeChange}
        >
          <SelectTrigger 
            className={cn(
              "w-fit min-w-[80px] h-9 border-[#C4C4C4] rounded-md",
              error && "border-destructive"
            )}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {countryCodes.map((code) => (
              <SelectItem key={code.value} value={code.value}>
                {code.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <input
          id={id}
          type="tel"
          value={phoneNumber}
          onChange={onPhoneNumberChange}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder="9876543210"
          data-slot="input"
          aria-invalid={error ? "true" : undefined}
          className={cn(
            "placeholder:text-[#6B6B6B] selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-[#C4C4C4] h-9 flex-1 min-w-0 rounded-md border bg-white px-3 py-1 text-base shadow-xs transition-[color,box-shadow,border-color] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            "focus-visible:outline-none focus-visible:border focus-visible:border-[#A3A3A3] focus-visible:shadow-[0_0_0_3px_rgba(2,86,61,0.50)]",
            "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
            error && "border-destructive",
            error && "focus-visible:border-destructive focus-visible:shadow-[0_0_0_3px_rgba(220,38,38,0.20)] focus-visible:bg-white"
          )}
        />
      </div>
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  )
}

