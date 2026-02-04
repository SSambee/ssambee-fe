import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/common/sidebar/AppSidebar";
import { DashboardHeader } from "@/components/common/header/DashbardHeader";
import { BreadcrumbProvider } from "@/providers/BreadcrumbProvider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
