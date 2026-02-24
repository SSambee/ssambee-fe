import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type AssistantsTabKey = "manage" | "contracts" | "approval" | "history";

type AssistantsTabsProps = {
  active: AssistantsTabKey;
  onTabClick?: (tab: AssistantsTabKey) => void;
  disabledTabs?: AssistantsTabKey[];
};

const tabs: Array<{ key: AssistantsTabKey; label: string; href: string }> = [
  { key: "manage", label: "조교 관리", href: "/educators/assistants" },
  {
    key: "contracts",
    label: "계약서 관리",
    href: "/educators/assistants",
  },
  {
    key: "approval",
    label: "조교 승인",
    href: "/educators/assistants/approval",
  },
  {
    key: "history",
    label: "업무 지시 내역",
    href: "/educators/assistants/history",
  },
];

export default function AssistantsTabs({
  active,
  onTabClick,
  disabledTabs = [],
}: AssistantsTabsProps) {
  const activeTabClassName =
    "h-10 rounded-full border border-[#3863f6] bg-[#3863f6] px-4 text-[16px] font-semibold text-white hover:bg-[#2f57e8] hover:text-white";
  const inactiveTabClassName =
    "h-10 rounded-full border border-[#d6d9e0] bg-white px-4 text-[16px] font-semibold text-[#6b6f80] hover:bg-[#fcfcfd] hover:text-[#5e6275]";

  return (
    <div className="flex flex-wrap items-center gap-2">
      {tabs.map((tab) => {
        const isDisabled = disabledTabs.includes(tab.key);

        if (tab.key === active) {
          return (
            <Button key={tab.key} className={activeTabClassName}>
              {tab.label}
            </Button>
          );
        }

        return onTabClick &&
          (tab.key === "manage" || tab.key === "contracts") ? (
          <Button
            key={tab.key}
            type="button"
            variant="outline"
            className={cn(inactiveTabClassName, isDisabled && "opacity-50")}
            disabled={isDisabled}
            onClick={() => onTabClick(tab.key)}
          >
            {tab.label}
          </Button>
        ) : (
          <Button
            key={tab.key}
            asChild
            variant="outline"
            className={inactiveTabClassName}
          >
            <Link href={tab.href}>{tab.label}</Link>
          </Button>
        );
      })}
    </div>
  );
}
