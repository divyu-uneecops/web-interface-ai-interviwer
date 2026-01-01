import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function isEmpty(value: unknown): boolean {
  if (value == null) return true; // null or undefined

  if (typeof value === "string") return value.trim().length === 0;

  if (Array.isArray(value)) return value.length === 0;

  if (value instanceof Map || value instanceof Set) {
    return value.size === 0;
  }

  if (typeof value === "object") {
    return Object.keys(value as object).length === 0;
  }

  return false;
}

export function buildUrl(
  template: string,
  params: Record<string, string | number>
): string {
  return template.replace(/{(\w+)}/g, (_, key) => {
    const value = params[key];
    if (value === undefined) {
      throw new Error(`Missing URL param: ${key}`);
    }
    return encodeURIComponent(String(value));
  });
}
