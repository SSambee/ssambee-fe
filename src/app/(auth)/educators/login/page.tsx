"use client";

import { useState } from "react";

import type { EducatorRole, RoleOption } from "@/types/auth.type";
import LoginForm from "@/components/auth/form/LoginForm";
import AuthLayout from "@/components/auth/layout/AuthLayout";
import RoleSelectorBtn from "@/components/auth/button/RoleSelectorBtn";

const EDUCATOR_ROLES: RoleOption<EducatorRole>[] = [
  { label: "강사", value: "INSTRUCTOR" },
  { label: "조교", value: "ASSISTANT" },
];

export default function EducatorsLoginPage() {
  const [selectedRole, setSelectedRole] = useState<EducatorRole>("INSTRUCTOR");

  return (
    <AuthLayout
      title="반가워요!"
      description="강사 또는 조교를 선택해 로그인 해주세요."
      role={selectedRole === "INSTRUCTOR" ? "instructor" : "assistant"}
      type="login"
    >
      <RoleSelectorBtn
        options={EDUCATOR_ROLES}
        value={selectedRole}
        onChange={setSelectedRole}
      />

      <LoginForm selectedRole={selectedRole} />
    </AuthLayout>
  );
}
