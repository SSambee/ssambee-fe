import "react-day-picker/dist/style.css";
import "react-big-calendar/lib/css/react-big-calendar.css";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/common/sidebar/AppSidebar";
import { DashboardHeader } from "@/components/common/header/DashbardHeader";
import { BreadcrumbProvider } from "@/providers/BreadcrumbProvider";
import Providers from "@/providers/Providers";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <BreadcrumbProvider>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <DashboardHeader />
            {children}
          </SidebarInset>
        </SidebarProvider>
      </BreadcrumbProvider>
    </Providers>
  );
}
