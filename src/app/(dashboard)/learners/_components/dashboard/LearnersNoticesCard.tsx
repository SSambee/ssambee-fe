import { Megaphone } from "lucide-react";

import { type LearnersNotice } from "@/types/learners-dashboard";
import { Card, CardContent } from "@/components/ui/card";

type LearnersNoticesCardProps = {
  notices: LearnersNotice[];
};

const noticeTagClassMap = {
  신규: "bg-slate-200 text-slate-700",
  시험: "bg-indigo-200 text-indigo-700",
  휴원: "bg-slate-300 text-slate-700",
} as const;

export default function LearnersNoticesCard({
  notices,
}: LearnersNoticesCardProps) {
  return (
    <Card className="shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100">
            <Megaphone className="h-4 w-4 text-indigo-600" />
          </span>
          <p className="text-sm font-semibold">공지사항</p>
        </div>

        <div className="mt-6 space-y-5">
          {notices.map((notice) => (
            <div
              key={notice.id}
              className="space-y-2 border-b border-muted pb-4 last:border-b-0 last:pb-0"
            >
              <div className="flex items-center justify-between">
                <span
                  className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${noticeTagClassMap[notice.tag]}`}
                >
                  {notice.tag}
                </span>
                <span className="text-xs text-muted-foreground">
                  {notice.dateLabel}
                </span>
              </div>
              <p className="text-sm font-semibold text-foreground">
                {notice.title}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
