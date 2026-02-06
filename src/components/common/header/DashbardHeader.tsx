"use client";

import React from "react";

import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthContext } from "@/providers/AuthProvider";
import { useBreadcrumb } from "@/providers/BreadcrumbProvider";

export function DashboardHeader() {
  const { breadcrumbs } = useBreadcrumb();
  const { user } = useAuthContext();

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
  const initials = user?.name?.charAt(0) || "";

  return (
    <header className="flex h-[88px] shrink-0 items-center justify-between border-b border-[#e9ebf0] bg-white px-14 py-5">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="h-6 w-6 rounded-none bg-transparent p-0 text-[#8b90a3] shadow-none hover:bg-transparent hover:text-[#8b90a3] [&_svg]:size-6" />
        {breadcrumbs.length > 0 && (
          <Breadcrumb>
            <BreadcrumbList className="flex items-center gap-0.5 text-[16px] leading-6 tracking-[-0.16px]">
              {breadcrumbs.map((crumb, index) => {
                const isLast = index === breadcrumbs.length - 1;
                const textColor = isLast ? "text-[#8b90a3]" : "text-[#b0b4c2]";
                return (
                  <React.Fragment key={index}>
                    {index > 0 && (
                      <BreadcrumbSeparator className="inline-flex h-6 items-center px-[10px] py-0 text-[#b0b4c2]">
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
      <div className="flex items-center gap-4">
        <Avatar className="size-12 border-[1.5px] border-[#f4f6fa] bg-white">
          <AvatarImage src={user?.image || undefined} alt={displayName} />
          <AvatarFallback className="bg-[#f4f6fa] text-sm text-[#8b90a3]">
            {initials}
          </AvatarFallback>
        </Avatar>
        <span className="text-[18px] font-medium leading-[26px] tracking-[-0.18px] text-[#8b90a3]">
          {displayName}
        </span>
      </div>
    </header>
  );
}
