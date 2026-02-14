import Link from "next/link";

import { Button } from "@/components/ui/button";

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
  return (
    <div className="flex flex-wrap items-center gap-2">
      {tabs.map((tab) => {
        const isDisabled = disabledTabs.includes(tab.key);

        if (tab.key === active) {
          return (
            <Button key={tab.key} className="rounded-full">
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
            className="rounded-full"
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
            className="rounded-full"
          >
            <Link href={tab.href}>{tab.label}</Link>
          </Button>
        );
      })}
    </div>
  );
}
