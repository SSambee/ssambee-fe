"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { LogOut, User } from "lucide-react";

import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthContext } from "@/providers/AuthProvider";
import { useBreadcrumb } from "@/providers/BreadcrumbProvider";
import { useAuth } from "@/hooks/useAuth";
import { API_URL_TYPE } from "@/hooks/useAuth";
import { Role } from "@/types/auth.type";

import { StudentProfileAvatar } from "../avatar/StudentProfileAvatar";

export function DashboardHeader() {
  const { breadcrumbs } = useBreadcrumb();
  const { user } = useAuthContext();
  const { signout } = useAuth();
  const router = useRouter();
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const getRoleLabel = (userType: string) => {
    switch (userType) {
      case "INSTRUCTOR":
        return "강사";
      case "ASSISTANT":
        return "조교";
      case "STUDENT":
        return "학생";
      case "PARENT":
        return "학부모";
      default:
        return "";
    }
  };

  const displayName = user ? `${getRoleLabel(user.userType)} ${user.name}` : "";
  const userSeedKey = user?.id ?? "default-user";

  const isValidRole = (type: string): type is Role =>
    ["INSTRUCTOR", "ASSISTANT", "STUDENT", "PARENT"].includes(type);

  const handleProfileClick = () => {
    if (!user?.userType || !isValidRole(user.userType)) return;
    const profileRoutes: Record<Role, string> = {
      INSTRUCTOR: "/educators/profile",
      ASSISTANT: "/educators/profile",
      STUDENT: "/learners/profile",
      PARENT: "/learners/profile",
    };
    const route = profileRoutes[user.userType];
    router.push(route);
  };

  const handleLogout = () => {
    if (!user?.userType || !isValidRole(user.userType)) return;
    signout(API_URL_TYPE[user.userType]);
  };

  return (
    <header className="flex h-[88px] shrink-0 items-center justify-between border-b border-neutral-200 bg-white px-14 py-5">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="h-6 w-6 rounded-none bg-transparent p-0 text-neutral-400 shadow-none hover:bg-transparent hover:text-neutral-400 [&_svg]:size-6" />
        {breadcrumbs.length > 0 && (
          <Breadcrumb>
            <BreadcrumbList className="flex items-center gap-0.5 text-[16px] leading-6 tracking-[-0.16px]">
              {breadcrumbs.map((crumb, index) => {
                const isLast = index === breadcrumbs.length - 1;
                const textColor = isLast ? "text-[#8b90a3]" : "text-[#b0b4c2]";
                return (
                  <React.Fragment key={index}>
                    {index > 0 && (
                      <BreadcrumbSeparator className="inline-flex h-6 items-center px-[10px] py-0 text-neutral-300">
                        /
                      </BreadcrumbSeparator>
                    )}
                    <BreadcrumbItem>
                      {crumb.href ? (
                        <BreadcrumbLink
                          href={crumb.href}
                          className={`inline-flex h-6 items-center rounded-full px-[10px] py-0 font-semibold ${textColor}`}
                        >
                          {crumb.label}
                        </BreadcrumbLink>
                      ) : (
                        <BreadcrumbPage
                          className={`inline-flex h-6 items-center rounded-full px-[10px] py-0 font-semibold ${textColor}`}
                        >
                          {crumb.label}
                        </BreadcrumbPage>
                      )}
                    </BreadcrumbItem>
                  </React.Fragment>
                );
              })}
            </BreadcrumbList>
          </Breadcrumb>
        )}
      </div>
      {isMounted ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex cursor-pointer items-center gap-4"
            >
              <StudentProfileAvatar
                seedKey={userSeedKey}
                size={48}
                sizePreset="Medium-2"
                label="내 프로필 아바타"
                className="border-[1.5px] border-neutral-50 shadow-sm"
              />
              <span className="text-[18px] font-medium leading-[26px] tracking-[-0.18px] text-neutral-400">
                {displayName}
              </span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-50">
            <DropdownMenuItem
              onClick={handleProfileClick}
              className="cursor-pointer"
            >
              <User className="mr-2 h-4 w-4" />
              <span>내 프로필</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              <span>로그아웃</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <div className="flex items-center gap-4">
          <StudentProfileAvatar
            seedKey={userSeedKey}
            size={48}
            sizePreset="Medium-2"
            label="내 프로필 아바타"
            className="border-[1.5px] border-neutral-50 shadow-sm"
          />
          <span className="text-[18px] font-medium leading-[26px] tracking-[-0.18px] text-neutral-400">
            {displayName}
          </span>
        </div>
      )}
    </header>
  );
}
