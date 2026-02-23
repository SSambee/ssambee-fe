"use client";

import { useRouter } from "next/navigation";

import { StudentProfileAvatar } from "@/components/common/avatar/StudentProfileAvatar";
import { CommonLectureCard } from "@/components/common/CommonLectureCard";
import StatusLabel from "@/components/common/label/StatusLabel";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useSetBreadcrumb } from "@/hooks/useBreadcrumb";
import { useModal } from "@/providers/ModalProvider";
import { phoneNumberFormatter } from "@/utils/phone";

import { useLearnerLecturesPage } from "./_hooks/useLearnerLecturesPage";

export default function LearnersLecturesPage() {
  useSetBreadcrumb([{ label: "나의강의" }]);

  const router = useRouter();
  const { openModal } = useModal();
  const {
    profile,
    lectures,
    instructorById,
    attendanceSummary,
    isAttendancePending,
    isAttendanceError,
    visibleLectures,
    handleLoadMore,
    handleOpenAttendanceDetail,
    handleMoveLectureDetail,
    getScheduleMeta,
    isPending,
    isError,
  } = useLearnerLecturesPage({
    openModal,
    push: router.push,
  });

  if (isPending) {
    return <div className="p-8 text-center text-[#8b90a3]">로딩 중...</div>;
  }

  if (isError || !profile) {
    return (
      <div className="p-8 text-center text-[#8b90a3]">
        강의 정보를 불러올 수 없습니다.
      </div>
    );
  }

  const primaryChild = profile.children[0];
  const childSummary = primaryChild
    ? `${primaryChild.name}${
        profile.children.length > 1
          ? ` 외 ${profile.children.length - 1}명`
          : ""
      }`
    : "-";

  return (
    <div className="container mx-auto space-y-8 p-6">
      <section className="-mx-6 -mt-6 border-b border-[#e9ebf0] bg-white px-6 py-6 sm:px-8 sm:py-7">
        <h1 className="text-[30px] font-bold leading-[1.2] tracking-[-0.03em] text-[#040405] sm:text-[36px] sm:leading-[48px]">
          나의강의
        </h1>
        <p className="text-[16px] font-medium leading-6 tracking-[-0.01em] text-[rgba(22,22,27,0.4)] sm:text-[20px] sm:leading-7 sm:tracking-[-0.02em]">
          수강 중인 강의 목록을 확인하고 강의별 성적 상세로 이동합니다.
        </p>
      </section>

      <Card className="rounded-[24px] border border-[#eaecf2] bg-white">
        <CardContent className="flex flex-col justify-between gap-6 p-6 sm:flex-row">
          <div className="flex gap-6">
            <div className="shrink-0">
              <StudentProfileAvatar
                size={120}
                sizePreset="XL"
                seedKey={profile.id || profile.name}
                label={`${profile.name} 프로필 이미지`}
                className="rounded-[12px] border border-[#f4f6fa]"
              />
            </div>

            <div className="flex-1 space-y-3">
              <div className="flex flex-col">
                <h2 className="flex items-center gap-2 text-xl font-bold tracking-tight text-[#4a4d5c] xl:text-2xl">
                  {profile.name}
                  <span className="text-sm text-[#8b90a3]">
                    <StatusLabel color="green">앱 사용자</StatusLabel>
                  </span>
                </h2>
                <p className="mt-1 text-sm text-[#8b90a3]">
                  {profile.userType === "STUDENT"
                    ? `🎓 학교 | ${profile.school || "-"} · ${profile.schoolYear || "-"}`
                    : `👨‍👩‍👦 자녀 | ${childSummary}`}
                </p>
                <p className="text-sm text-[#8b90a3]">
                  📱 연락처 | {phoneNumberFormatter(profile.phone || "") || "-"}
                </p>
                <p className="text-sm text-[#8b90a3]">
                  ✉️ 이메일 | {profile.email || "-"}
                </p>
                <p className="text-sm text-[#8b90a3]">
                  {profile.userType === "STUDENT"
                    ? `👨‍👩‍👦 학부모 | ${
                        phoneNumberFormatter(profile.parentPhone || "") || "-"
                      }`
                    : `📞 자녀 연락처 | ${
                        phoneNumberFormatter(primaryChild?.phone || "") || "-"
                      }`}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Button
              variant="outline"
              className="h-12 rounded-[12px] border border-[#d6d9e0] bg-white px-6 text-[16px] font-semibold text-[#6b6f80] hover:bg-[#fcfcfd]"
              onClick={() =>
                handleOpenAttendanceDetail(
                  profile.name,
                  attendanceSummary?.records ?? []
                )
              }
            >
              출결 상세
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="rounded-[24px] border border-[#eaecf2] bg-white">
          <CardContent className="p-6 text-left">
            <p className="mb-2 text-sm text-[#8b90a3]">지각 횟수</p>
            <p className="text-3xl font-bold text-yellow-600">
              {isAttendancePending
                ? "-"
                : attendanceSummary
                  ? `${attendanceSummary.lateCount}회`
                  : "-"}
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-[24px] border border-[#eaecf2] bg-white">
          <CardContent className="p-6 text-left">
            <p className="mb-2 text-sm text-[#8b90a3]">결석 횟수</p>
            <p className="text-3xl font-bold text-red-600">
              {isAttendancePending
                ? "-"
                : attendanceSummary
                  ? `${attendanceSummary.absentCount}회`
                  : "-"}
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-[24px] border border-[#eaecf2] bg-white">
          <CardContent className="p-6 text-left">
            <p className="mb-2 text-sm text-[#8b90a3]">출석률 (최근 30일)</p>
            <p className="text-3xl font-bold text-green-600">
              {isAttendancePending
                ? "-"
                : attendanceSummary?.attendanceRate !== null &&
                    attendanceSummary?.attendanceRate !== undefined
                  ? `${attendanceSummary.attendanceRate}%`
                  : "-"}
            </p>
          </CardContent>
        </Card>
      </div>

      {isAttendanceError && (
        <p className="text-sm text-[#8b90a3]">
          일부 출결 데이터는 현재 불러오지 못했습니다.
        </p>
      )}

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold tracking-tight text-[#4a4d5c] xl:text-2xl">
            수강 중인 수업
          </h3>
          <span className="text-sm text-[#8b90a3]">총 {lectures.length}개</span>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {lectures.slice(0, visibleLectures).map((lecture) => {
            const instructor = instructorById.get(lecture.instructorId);
            const scheduleMeta = getScheduleMeta(lecture.lectureTimes);
            const subject =
              lecture.subject || instructor?.subject || "과목 정보";
            const schoolYear =
              lecture.schoolYear ||
              (profile.userType === "STUDENT" ? profile.schoolYear : "") ||
              "학년 정보";
            const instructorName =
              lecture.instructorName || instructor?.name || "담당 강사";

            return (
              <CommonLectureCard
                key={lecture.id}
                subject={subject}
                schoolYear={schoolYear}
                title={lecture.title}
                scheduleDays={scheduleMeta.scheduleDays}
                scheduleTime={scheduleMeta.scheduleTime}
                hasSchedule={scheduleMeta.hasSchedule}
                instructorName={instructorName}
                onClick={() => handleMoveLectureDetail(lecture)}
                className="h-full"
              />
            );
          })}
        </div>

        {visibleLectures < lectures.length && (
          <div className="flex justify-center pt-4">
            <Button
              variant="outline"
              onClick={handleLoadMore}
              className="h-12 rounded-[12px] border border-[#d6d9e0] bg-white px-6 text-[16px] font-semibold text-[#6b6f80] hover:bg-[#fcfcfd]"
            >
              더보기 ({lectures.length - visibleLectures})
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
