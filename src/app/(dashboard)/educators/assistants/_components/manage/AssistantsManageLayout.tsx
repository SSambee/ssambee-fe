"use client";

import AssistantsFiltersBar from "@/app/(dashboard)/educators/assistants/_components/AssistantsFiltersBar";
import AssistantsHeader from "@/app/(dashboard)/educators/assistants/_components/AssistantsHeader";
import AssistantsStatsGrid from "@/app/(dashboard)/educators/assistants/_components/AssistantsStatsGrid";
import AssistantsTable from "@/app/(dashboard)/educators/assistants/_components/AssistantsTable";
import type { AssistantsManagePageViewModel } from "@/app/(dashboard)/educators/assistants/_hooks/useAssistantsManagePage";
import { statusColorMap } from "@/constants/assistants.constants";

type AssistantsManageLayoutProps = {
  vm: AssistantsManagePageViewModel;
};

export default function AssistantsManageLayout({
  vm,
}: AssistantsManageLayoutProps) {
  const { state, list, actions } = vm;

  return (
    <>
      <AssistantsHeader
        activeTab={state.activeTab}
        onTabClick={(tab) => {
          if (tab === "contracts") {
            return;
          }

          if (tab === "manage") {
            actions.setActiveModal("none");
          }
        }}
        disabledTabs={["contracts"]}
        onOpenTaskModal={() => actions.setActiveModal("task")}
        actionNotice={state.headerNotice}
      />

      <AssistantsStatsGrid
        stats={state.stats}
        onOpenContractManageModal={actions.openContractManageModal}
      />

      <AssistantsFiltersBar
        activeStatusFilter={list.activeStatusFilter}
        onChangeActiveStatusFilter={actions.changeActiveStatusFilter}
        searchKeyword={list.assistantsSearchKeyword}
        onChangeSearchKeyword={actions.setAssistantsSearchKeyword}
      />

      <AssistantsTable
        statusLabel={list.statusLabel}
        totalCount={list.totalCount}
        assistants={list.paginatedAssistants}
        statusColorMap={statusColorMap}
        pagination={list.pagination}
        onOpenAssistantDetail={actions.openAssistantDetailModal}
        onPageChange={actions.setCurrentPage}
      />
    </>
  );
}
