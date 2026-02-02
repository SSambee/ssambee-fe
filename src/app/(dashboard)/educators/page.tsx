"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

export default function EducatorsDashboardPage() {
  const { signout } = useAuth();
  return (
    <div>
      <h1>EducatorsDashboardPage</h1>
      <Button variant="outline" onClick={() => signout("MGMT")}>
        Educator 로그아웃
      </Button>
      <Button variant="outline">
        <Link href="/educators/lectures">수업 관리</Link>
      </Button>
      <Button variant="outline">
        <Link href="/educators/students">학생 관리</Link>
      </Button>
      <Button variant="outline">
        <Link href="/educators/communication">소통 관리</Link>
      </Button>
    </div>
  );
}
