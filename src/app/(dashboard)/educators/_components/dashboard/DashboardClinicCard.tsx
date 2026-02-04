import { ShieldCheck } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { DashboardClinicItem } from "@/types/dashboard";

type DashboardClinicCardProps = {
  clinics: DashboardClinicItem[];
};

export function DashboardClinicCard({ clinics }: DashboardClinicCardProps) {
  return (
    <Card className="shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-100">
            <ShieldCheck className="h-4 w-4 text-rose-600" />
          </span>
          <div>
            <p className="text-sm font-semibold">클리닉</p>
            <p className="text-xs text-muted-foreground">
              예정된 클리닉 일정을 확인하세요
            </p>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          {clinics.map((clinic) => (
            <div
              key={clinic.id}
              className="rounded-lg border border-muted/60 bg-muted/20 px-4 py-3"
            >
              <p className="text-xs text-muted-foreground">{clinic.date}</p>
              <p className="text-sm font-semibold text-foreground">
                {clinic.title}
              </p>
              {clinic.meta ? (
                <p className="text-xs text-muted-foreground">{clinic.meta}</p>
              ) : null}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
