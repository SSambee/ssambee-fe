"use client";

import { LogOut } from "lucide-react";

import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { DashboardSidebarFooterPanel } from "@/shared/common/ui/DashboardFooter";

type AppSidebarFooterProps = {
  loading: boolean;
  onLogout: () => void;
};

export function AppSidebarFooter({ loading, onLogout }: AppSidebarFooterProps) {
  return (
    <SidebarFooter className="mt-auto shrink-0 border-0 bg-transparent p-0 px-4 pb-6 shadow-none">
      <SidebarMenu className="gap-3">
        <SidebarMenuItem>
          <DashboardSidebarFooterPanel />
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton
            onClick={onLogout}
            disabled={loading}
            className="h-14 gap-[14px] rounded-[12px] px-6 py-4 text-[18px] leading-[26px] tracking-[-0.18px] font-semibold text-[rgba(22,22,27,0.28)] hover:bg-transparent hover:text-inherit cursor-pointer"
          >
            <LogOut className="size-[18px] text-current" />
            <span>{loading ? "로그아웃 중..." : "로그아웃"}</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  );
}
