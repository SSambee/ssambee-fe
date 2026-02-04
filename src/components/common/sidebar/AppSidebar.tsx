"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  GraduationCap,
  BookOpen,
  Calendar,
  MessageSquare,
  Users,
  FileText,
  FolderOpen,
  Home,
  LogOut,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { useAuthContext } from "@/providers/AuthProvider";
import { Role } from "@/types/auth.type";
import { API_URL_TYPE, useAuth } from "@/hooks/useAuth";

const instructorMenuItems = [
  {
    title: "홈",
    url: "/educators",
    icon: Home,
  },
  {
    title: "학생 관리",
    url: "/educators/students",
    icon: GraduationCap,
  },
  {
    title: "수업 관리",
    url: "/educators/lectures",
    icon: BookOpen,
  },
  {
    title: "스케줄 관리",
    url: "/educators/schedules",
    icon: Calendar,
  },
  {
    title: "소통",
    url: "/educators/communication",
    icon: MessageSquare,
  },
  {
    title: "조교 센터",
    url: "/educators/assistants",
    icon: Users,
  },
  {
    title: "시험 관리",
    url: "/educators/exams",
    icon: FileText,
  },
  {
    title: "학습 자료실",
    url: "/educators/materials",
    icon: FolderOpen,
  },
];

const otherMenuItems = [
  {
    title: "예제1",
    url: "/example1",
    icon: BookOpen,
  },
  {
    title: "예제2",
    url: "/example2",
    icon: Calendar,
  },
  {
    title: "예제3",
    url: "/example3",
    icon: FileText,
  },
];

const getMenuItems = (userType?: Role) => {
  if (userType === "INSTRUCTOR") return instructorMenuItems;
  return otherMenuItems;
};

export function AppSidebar() {
  const { user } = useAuthContext();
  const { signout, loading } = useAuth();
  const menuItems = getMenuItems(user?.userType);
  const pathname = usePathname();

  // 로그아웃 핸들러
  const handleLogout = async () => {
    if (!user?.userType) return;

    try {
      // 현재 유저의 타입에 맞는 API Role(MGMT or SVC) 전달
      const apiRole = API_URL_TYPE[user.userType];
      await signout(apiRole);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <span className="text-lg font-semibold">Logo</span>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={
                      pathname === item.url ||
                      pathname?.startsWith(item.url + "/")
                    }
                  >
                    <Link href={item.url}>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout} disabled={loading}>
              <LogOut className="size-4" />
              <span>{loading ? "로그아웃 중..." : "로그아웃"}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
