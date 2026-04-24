"use client";

import AssistantsManageLayout from "@/app/(dashboard)/educators/assistants/_components/manage/AssistantsManageLayout";
import AssistantsManageModals from "@/app/(dashboard)/educators/assistants/_components/manage/AssistantsManageModals";
import { useAssistantsManagePage } from "@/app/(dashboard)/educators/assistants/_hooks/useAssistantsManagePage";
import { useSetBreadcrumb } from "@/hooks/useBreadcrumb";
import { useAuthContext } from "@/providers/AuthProvider";

export default function AssistantsPage() {
  useSetBreadcrumb([{ label: "조교 관리" }]);

  const { user } = useAuthContext();
  const instructorName = user?.name ?? "담당 강사";
  const vm = useAssistantsManagePage();

  return (
    <div className="container mx-auto space-y-8 p-6">
      <AssistantsManageLayout vm={vm} />
      <AssistantsManageModals instructorName={instructorName} vm={vm} />
    </div>
  );
}
