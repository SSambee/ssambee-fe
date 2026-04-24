"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import "react-day-picker/dist/style.css";
import "react-big-calendar/lib/css/react-big-calendar.css";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/common/sidebar/AppSidebar";
import { DashboardHeader } from "@/components/common/header/DashbardHeader";
import { BreadcrumbProvider } from "@/providers/BreadcrumbProvider";
import Providers from "@/providers/Providers";
import { useAuthContext } from "@/providers/AuthProvider";

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuthContext();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!user && !isLoading) {
      const targetPath = pathname.startsWith("/learners")
        ? "/learners/login"
        : "/educators/login";
      router.replace(targetPath);
    }
  }, [user, isLoading, router, pathname]);

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

  if (!user) {
    return null;
  }

  return (
    <BreadcrumbProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <DashboardHeader />
          {children}
        </SidebarInset>
      </SidebarProvider>
    </BreadcrumbProvider>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </Providers>
  );
}
