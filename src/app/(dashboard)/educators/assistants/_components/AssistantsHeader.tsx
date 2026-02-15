import { CheckSquare } from "lucide-react";

import AssistantsTabs, {
  type AssistantsTabKey,
} from "@/app/(dashboard)/educators/assistants/_components/AssistantsTabs";
import Title from "@/components/common/header/Title";
import { Button } from "@/components/ui/button";

type AssistantsHeaderProps = {
  activeTab: AssistantsTabKey;
  onTabClick: (tab: AssistantsTabKey) => void;
  disabledTabs?: AssistantsTabKey[];
  onOpenTaskModal: () => void;
  actionNotice: string | null;
};

export default function AssistantsHeader({
  activeTab,
  onTabClick,
  disabledTabs,
  onOpenTaskModal,
  actionNotice,
}: AssistantsHeaderProps) {
  return (
    <div className="space-y-6">
      <Title
        title="조교 관리"
        description="배정된 조교를 조회하고 업무를 배정/평가합니다."
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <AssistantsTabs
          active={activeTab}
          onTabClick={onTabClick}
          disabledTabs={disabledTabs}
        />
        <Button
          variant="outline"
          className="rounded-full"
          onClick={onOpenTaskModal}
        >
          <CheckSquare className="mr-2 h-4 w-4" />
          조교 업무 지시
        </Button>
      </div>

      {actionNotice ? (
        <div className="rounded-lg border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
          {actionNotice}
        </div>
      ) : null}
    </div>
  );
}
