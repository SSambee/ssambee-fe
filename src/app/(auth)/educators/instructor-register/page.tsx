import RegisterForm from "@/components/auth/form/RegisterForm";
import AuthLayout from "@/components/auth/layout/AuthLayout";

export default function InstructorRegisterPage() {
  return (
    <AuthLayout
      title="강사 회원가입"
      description="강사 등록을 위해 필수 정보를 입력해주세요."
      role="instructor"
      type="register"
    >
      <RegisterForm roleType="EDUCATORS" userType="INSTRUCTOR" />
    </AuthLayout>
  );
}
