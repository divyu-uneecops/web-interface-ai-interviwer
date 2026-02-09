import { ApiUser } from "../types/user-management.types";

export function formatUserName(user: ApiUser): string {
  const parts = [user.firstName, user.lastName].filter(Boolean);
  return parts.length > 0 ? parts.join(" ") : "--";
}

export function formatPhone(user: ApiUser): string {
  const p = user.phoneNumber;
  if (!p?.number) return "--";
  return p.countryCode ? `${p.countryCode} ${p.number}` : p.number;
}

export function formatRole(user: ApiUser): string {
  const roles = user.appRoles;
  if (!roles?.length) return "--";
  return roles.join(", ");
}
