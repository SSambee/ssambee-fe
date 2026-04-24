"use client";

import { useState } from "react";

import RoleSelectorBtn from "@/components/auth/button/RoleSelectorBtn";
import RegisterForm from "@/components/auth/form/RegisterForm";
import AuthLayout from "@/components/auth/layout/AuthLayout";
import { LearnerRole, RoleOption } from "@/types/auth.type";
import SchoolInfoForm from "@/components/auth/form/SchoolInfoForm";
import ParentPhoneForm from "@/components/auth/form/ParentPhoneForm";

const LEARNER_ROLES: RoleOption<LearnerRole>[] = [
  { label: "학생", value: "STUDENT" },
  { label: "학부모", value: "PARENT" },
];

const DESCRIPTION_BY_ROLE: Record<LearnerRole, string> = {
  STUDENT: "학생 정보를 입력하고 가입을 진행해주세요.",
  PARENT: "자녀의 학습 관리를 위한 학부모 회원 정보를 입력해주세요.",
};

export default function ParentRegisterPage() {
  const [selectedRole, setSelectedRole] = useState<LearnerRole>("STUDENT");

  return (
    <AuthLayout
      title="회원가입"
      description={DESCRIPTION_BY_ROLE[selectedRole]}
      role="student"
      type="register"
    >
      <RoleSelectorBtn
        options={LEARNER_ROLES}
        value={selectedRole}
        onChange={setSelectedRole}
      />

      <div className="mt-6">
        {selectedRole === "STUDENT" && (
          <div className="space-y-4">
            <SchoolInfoForm />
            <RegisterForm
              requireSchoolInfo={true}
              roleType="LEARNERS"
              userType="STUDENT"
              extraFields={<ParentPhoneForm />}
            />
          </div>
        )}
        {selectedRole === "PARENT" && (
          <RegisterForm roleType="LEARNERS" userType="PARENT" />
        )}
      </div>
    </AuthLayout>
  );
}
