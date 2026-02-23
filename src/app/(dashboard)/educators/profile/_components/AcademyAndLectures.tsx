import { Clock3, Search, Users } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import type { Lecture } from "@/types/profile.type";

type AcademyAndLecturesProps = {
  academyName: string;
  teacherName: string;
  lectures: Lecture[];
};

export function AcademyAndLectures({
  academyName,
  teacherName,
  lectures,
}: AcademyAndLecturesProps) {
  return (
    <Card className="w-full rounded-[24px] border border-[#eaecf2] bg-white">
      <CardContent className="space-y-8 p-5 sm:p-6">
        <div className="space-y-5">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold tracking-tight text-[#4a4d5c] xl:text-2xl">
              담당 강의
            </h3>
            <span className="text-xl font-bold tracking-tight text-[#8b90a3] xl:text-2xl">
              {lectures.length}개
            </span>
          </div>

          <div className="flex h-[56px] items-center gap-3 rounded-[12px] border border-[#d6d9e0] bg-[#fcfcfd] px-4">
            <Search className="h-5 w-5 text-[#8b90a3]" />
            <p className="text-[16px] font-medium text-[#8b90a3]">
              담당 강의를 검색해보세요
            </p>
          </div>
        </div>

        {lectures.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3 lg:grid-cols-2">
            {lectures.map((lecture) => {
              const isOpened = lecture.studentCount > 0;
              return (
                <article
                  key={lecture.id}
                  className="overflow-hidden rounded-[20px] border border-[#eaecf2] bg-white"
                >
                  <div className="space-y-6 px-6 pb-4 pt-6">
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-lg bg-[#e1e7fe] px-3 py-2 text-[14px] font-semibold leading-5 tracking-[-0.02em] text-[#2554f5]">
                        {academyName}
                      </span>
                      <span className="rounded-lg bg-[#e9ebf0] px-3 py-2 text-[14px] font-semibold leading-5 tracking-[-0.02em] text-[#5e6275]">
                        {lecture.target}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <h4 className="text-[20px] font-semibold tracking-tight text-[#040405]">
                        {lecture.name}
                      </h4>
                      <span
                        className={`rounded-full px-2 py-1 text-[14px] font-semibold leading-5 tracking-[-0.02em] ${
                          isOpened
                            ? "bg-[#dcfce7] text-[#16a34a]"
                            : "bg-[#fef3c7] text-[#f59e0b]"
                        }`}
                      >
                        {isOpened ? "운영 중" : "개강 전"}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-[18px] font-medium leading-[26px] tracking-[-0.02em] text-[#6b6f80]">
                        <Clock3 className="h-5 w-5" />
                        <span>시간 정보 없음</span>
                      </div>
                      <div className="flex items-center gap-2 text-[18px] font-medium leading-[26px] tracking-[-0.02em] text-[#6b6f80]">
                        <Users className="h-5 w-5" />
                        <span>{lecture.studentCount}명</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-[#f4f6fa] px-6 py-4">
                    <div className="flex items-center gap-3 text-[18px] font-medium leading-[26px] tracking-[-0.02em] text-[#8b90a3]">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#f4f6fa] bg-white text-[14px] font-semibold text-[#6b6f80]">
                        {teacherName.charAt(0)}
                      </div>
                      <span>담당 강사 {teacherName}</span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-[#d6d9e0] py-20 text-center text-[18px] font-medium text-[#8b90a3]">
            담당 중인 강의가 없습니다.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
