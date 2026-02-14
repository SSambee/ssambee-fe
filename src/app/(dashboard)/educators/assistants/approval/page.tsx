"use client";

import AssistantsApprovalApplicationsCard from "@/app/(dashboard)/educators/assistants/_components/approval/AssistantsApprovalApplicationsCard";
import AssistantsApprovalHeaderCard from "@/app/(dashboard)/educators/assistants/_components/approval/AssistantsApprovalHeaderCard";
import AssistantsApprovalStatusCard from "@/app/(dashboard)/educators/assistants/_components/approval/AssistantsApprovalStatusCard";
import { useAssistantsApprovalPage } from "@/app/(dashboard)/educators/assistants/_hooks/useAssistantsApprovalPage";
import { useSetBreadcrumb } from "@/hooks/useBreadcrumb";

export default function AssistantsApprovalPage() {
  useSetBreadcrumb([{ label: "조교 승인" }]);

  const vm = useAssistantsApprovalPage();

  return (
    <div className="container mx-auto space-y-8 p-6">
      <AssistantsApprovalHeaderCard vm={vm} />
      <AssistantsApprovalStatusCard vm={vm} />
      <AssistantsApprovalApplicationsCard vm={vm} />
    </div>
  );
}
