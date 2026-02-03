"use client";

import { useState } from "react";

import type { LearnerRole, RoleOption } from "@/types/auth.type";
import LoginForm from "@/components/auth/form/LoginForm";
import AuthLayout from "@/components/auth/layout/AuthLayout";
import RoleSelectorBtn from "@/components/auth/button/RoleSelectorBtn";

const LEARNER_ROLES: RoleOption<LearnerRole>[] = [
  { label: "학생", value: "STUDENT" },
  { label: "학부모", value: "PARENT" },
];

export default function LearnersLoginPage() {
  const [selectedRole, setSelectedRole] = useState<LearnerRole>("STUDENT");

  return (
    <AuthLayout
      title="반가워요!"
      description="학생 또는 학부모를 선택해 로그인 해주세요."
    >
      <RoleSelectorBtn
        options={LEARNER_ROLES}
        value={selectedRole}
        onChange={setSelectedRole}
      />

      <LoginForm selectedRole={selectedRole} />
    </AuthLayout>
  );
}
