import type { Role } from "@/types/auth.type";

const EDUCATOR_ROLES: Role[] = ["INSTRUCTOR", "ASSISTANT"];

export function isEducatorRole(userType: Role): boolean {
  return EDUCATOR_ROLES.includes(userType);
}
