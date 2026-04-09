"use client";

import "react-day-picker/dist/style.css";
import "react-big-calendar/lib/css/react-big-calendar.css";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/common/sidebar/AppSidebar";
import { DashboardHeader } from "@/components/common/header/DashbardHeader";
import { BreadcrumbProvider } from "@/app/providers/BreadcrumbProvider";
import { useAuthContext } from "@/app/providers/AuthProvider";
import { DashboardFooter } from "@/shared/common/ui/DashboardFooter";

export function DashboardLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoading } = useAuthContext();

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
          <p className="mt-4 text-sm text-neutral-500">인증 확인 중...</p>
        </div>
      </div>
    );
  }

  return (
    <BreadcrumbProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="min-h-screen">
          <div className="flex min-h-screen flex-col">
            <DashboardHeader />
            <div className="flex-1">{children}</div>
            <DashboardFooter />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </BreadcrumbProvider>
  );
}
