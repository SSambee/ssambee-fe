"use client";

import AssistantsHistoryDetailDialog from "@/app/(dashboard)/educators/assistants/_components/history/AssistantsHistoryDetailDialog";
import AssistantsHistoryLayout from "@/app/(dashboard)/educators/assistants/_components/history/AssistantsHistoryLayout";
import { useAssistantsHistoryPage } from "@/app/(dashboard)/educators/assistants/_hooks/useAssistantsHistoryPage";
import { useSetBreadcrumb } from "@/hooks/useBreadcrumb";

export default function AssistantsTaskHistoryPage() {
  useSetBreadcrumb([{ label: "업무 지시 내역" }]);

  const vm = useAssistantsHistoryPage();

  return (
    <div className="container mx-auto space-y-8 p-6">
      <AssistantsHistoryLayout vm={vm} />
      <AssistantsHistoryDetailDialog vm={vm} />
    </div>
  );
}
