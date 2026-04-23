"use client";

import Image from "next/image";
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
} from "@/components/ui/sidebar";
import { useAuthContext } from "@/app/providers/AuthProvider";
import { Role } from "@/types/auth.type";
import { API_URL_TYPE, useAuth } from "@/shared/common/hooks/useAuth";
import { AppSidebarFooter } from "@/components/common/sidebar/AppSidebarFooter";

const instructorMenuItems = [
  {
    title: "홈",
    url: "/educators",
    icon: Home,
  },
  {
    title: "수업 관리",
    url: "/educators/lectures",
    icon: BookOpen,
  },
  {
    title: "학생 관리",
    url: "/educators/students",
    icon: GraduationCap,
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

const assistantMenuItems = [
  {
    title: "홈",
    url: "/educators",
    icon: Home,
  },
  {
    title: "수업 관리",
    url: "/educators/lectures",
    icon: BookOpen,
  },
  {
    title: "학생 관리",
    url: "/educators/students",
    icon: GraduationCap,
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
    title: "대시보드",
    url: "/learners",
    icon: Home,
  },
  {
    title: "프로필",
    url: "/learners/profile",
    icon: Users,
  },
  {
    title: "나의강의",
    url: "/learners/lectures",
    icon: FileText,
  },
  {
    title: "소통",
    url: "/learners/communication",
    icon: MessageSquare,
  },
];

const getMenuItems = (userType?: Role) => {
  if (userType === "INSTRUCTOR") return instructorMenuItems;
  if (userType === "ASSISTANT") return assistantMenuItems;
  return otherMenuItems;
};

const isMenuItemActive = (pathname: string, url: string) => {
  if (url === "/educators" || url === "/learners") {
    return pathname === url;
  }

  return pathname === url || pathname.startsWith(url + "/");
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
    <Sidebar className="border-r border-[#e9ebf0] [&_[data-slot=sidebar-inner]]:bg-white">
      <SidebarHeader className="pl-6 pr-8 py-8">
        <Link href={"/"} className="inline-flex items-start">
          <Image
            src="/brand/ssam-b.svg"
            alt="ssam B"
            width={138}
            height={68}
            priority
          />
        </Link>
      </SidebarHeader>
      <SidebarContent className="pt-[28px]">
        <SidebarGroup className="p-0">
          <SidebarGroupContent className="px-4">
            <SidebarMenu className="gap-3">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isMenuItemActive(pathname, item.url)}
                    className="h-14 gap-[14px] rounded-[12px] px-6 py-4 text-[18px] leading-[26px] tracking-[-0.18px] font-semibold text-[rgba(22,22,27,0.28)] hover:bg-transparent hover:text-inherit data-[active=true]:bg-[#f4f6fe] data-[active=true]:text-[#4b72f7] data-[active=true]:font-bold"
                  >
                    <Link href={item.url}>
                      <item.icon className="size-[18px] text-current" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <AppSidebarFooter loading={loading} onLogout={handleLogout} />
    </Sidebar>
  );
}
