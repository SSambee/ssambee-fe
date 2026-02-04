"use client";

import React from "react";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
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
    <header className="flex h-14 shrink-0 items-center justify-between border-b bg-background px-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <Separator orientation="vertical" className="mx-2 h-4" />
        {breadcrumbs.length > 0 && (
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={index}>
                  {index > 0 && <BreadcrumbSeparator />}
                  <BreadcrumbItem>
                    {crumb.href ? (
                      <BreadcrumbLink href={crumb.href}>
                        {crumb.label}
                      </BreadcrumbLink>
                    ) : (
                      <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                    )}
                  </BreadcrumbItem>
                </React.Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        )}
      </div>
      <div className="flex items-center gap-3">
        <Avatar className="size-8">
          <AvatarImage src={user?.image || undefined} alt={displayName} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <span className="text-sm font-medium">{displayName}</span>
      </div>
    </header>
  );
}
