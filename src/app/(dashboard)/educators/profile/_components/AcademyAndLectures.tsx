import { Building2 } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import DataTable from "@/components/common/table/DataTable";
import type { Lecture } from "@/types/profile.type";

import { lectureColumns } from "./table/LectureTableColumns";

type AcademyAndLecturesProps = {
  academyName: string;
  lectures: Lecture[];
};

export function AcademyAndLectures({
  academyName,
  lectures,
}: AcademyAndLecturesProps) {
  return (
    <Card className="w-full">
      <CardContent className="space-y-4 p-6">
        <h3 className="text-lg font-semibold">소속 및 담당 강의</h3>
        <div>
          <div className="mt-2 flex items-center justify-between rounded-lg bg-brand-25 p-3">
            <span className="flex items-center gap-3 font-semibold text-brand-600">
              <div className="rounded-sm bg-brand-100 p-2">
                <Building2 className="h-4 w-4 text-neutral-400" />
              </div>
              {academyName}
            </span>
          </div>
        </div>
        <div>
          <DataTable
            data={lectures}
            columns={lectureColumns}
            emptyMessage="담당 중인 강의가 없습니다."
          />
        </div>
      </CardContent>
    </Card>
  );
}
