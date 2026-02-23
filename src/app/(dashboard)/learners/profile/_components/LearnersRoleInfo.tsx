import { School } from "lucide-react";

import DataTable from "@/components/common/table/DataTable";
import { Card, CardContent } from "@/components/ui/card";
import type { LearnerProfile } from "@/types/learners-profile.type";

import {
  childColumns,
  instructorColumns,
} from "./table/LearnersProfileTableColumns";

type LearnersRoleInfoProps = {
  profile: LearnerProfile;
};

export function LearnersRoleInfo({ profile }: LearnersRoleInfoProps) {
  const isStudent = profile.userType === "STUDENT";

  return (
    <Card className="w-full rounded-[24px] border border-[#eaecf2] bg-white">
      <CardContent className="space-y-5 p-5 sm:p-6">
        <h3 className="text-xl font-bold tracking-tight text-[#4a4d5c] xl:text-2xl">
          {isStudent ? "담당 강사 정보" : "자녀 정보"}
        </h3>

        {isStudent && (
          <div className="mt-2 flex items-center justify-between rounded-[12px] border border-[#d6d9e0] bg-[#f4f6fe] p-4">
            <span className="flex items-center gap-3 text-[16px] font-semibold tracking-[-0.02em] text-[#3863f6]">
              <div className="rounded-md bg-[#e1e7fe] p-2">
                <School className="h-4 w-4 text-[#3863f6]" />
              </div>
              {profile.school} / {profile.schoolYear}
            </span>
          </div>
        )}

        {isStudent ? (
          <DataTable
            data={profile.instructors}
            columns={instructorColumns}
            emptyMessage="연결된 강사 정보가 없습니다."
          />
        ) : (
          <DataTable
            data={profile.children}
            columns={childColumns}
            emptyMessage="연결된 자녀 정보가 없습니다."
          />
        )}
      </CardContent>
    </Card>
  );
}
