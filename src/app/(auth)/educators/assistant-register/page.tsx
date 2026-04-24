import AuthenticationCodeForm from "@/components/auth/form/AuthenticationCodeForm";
import RegisterForm from "@/components/auth/form/RegisterForm";
import AuthLayout from "@/components/auth/layout/AuthLayout";

export default function AssistantRegisterPage() {
  return (
    <AuthLayout
      title="조교 회원가입"
      description="강사님께 받은 인증 코드를 사용해 가입해주세요."
      role="assistant"
      type="register"
    >
      <AuthenticationCodeForm />
      <RegisterForm
        requireAuthCode={true}
        roleType="EDUCATORS"
        userType="ASSISTANT"
      />
    </AuthLayout>
  );
}
