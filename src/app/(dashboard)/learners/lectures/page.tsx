"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import noProfile from "@/assets/images/no-profile.jpg";
import { CommonLectureCard } from "@/components/common/CommonLectureCard";
import Title from "@/components/common/header/Title";
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
    return <div className="p-8 text-center">로딩 중...</div>;
  }

  if (isError || !profile) {
    return (
      <div className="p-8 text-center text-muted-foreground">
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
    <div className="container mx-auto max-w-[1400px] space-y-6 px-8 py-8">
      <Title
        title="나의강의"
        description="수강 중인 강의 목록을 확인하고 강의별 성적 상세로 이동합니다."
      />

      <Card>
        <CardContent className="flex flex-col justify-between gap-6 p-6 sm:flex-row">
          <div className="flex gap-6">
            <div className="shrink-0">
              <Image
                src={noProfile}
                alt="학습자 프로필 이미지"
                width={120}
                height={120}
                className="rounded-lg object-cover"
              />
            </div>

            <div className="flex-1 space-y-3">
              <div className="flex flex-col">
                <h2 className="flex items-center gap-1 text-2xl font-bold">
                  {profile.name}
                  <span className="text-sm text-muted-foreground">
                    <StatusLabel color="green">앱 사용자</StatusLabel>
                  </span>
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {profile.userType === "STUDENT"
                    ? `🎓 학교 | ${profile.school || "-"} · ${profile.schoolYear || "-"}`
                    : `👨‍👩‍👦 자녀 | ${childSummary}`}
                </p>
                <p className="text-sm text-muted-foreground">
                  📱 연락처 | {phoneNumberFormatter(profile.phone || "") || "-"}
                </p>
                <p className="text-sm text-muted-foreground">
                  ✉️ 이메일 | {profile.email || "-"}
                </p>
                <p className="text-sm text-muted-foreground">
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
              className="cursor-pointer"
              variant="outline"
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
        <Card>
          <CardContent className="p-6 text-left">
            <p className="mb-2 text-sm text-muted-foreground">지각 횟수</p>
            <p className="text-3xl font-bold text-yellow-600">
              {isAttendancePending
                ? "-"
                : attendanceSummary
                  ? `${attendanceSummary.lateCount}회`
                  : "-"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-left">
            <p className="mb-2 text-sm text-muted-foreground">결석 횟수</p>
            <p className="text-3xl font-bold text-red-600">
              {isAttendancePending
                ? "-"
                : attendanceSummary
                  ? `${attendanceSummary.absentCount}회`
                  : "-"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-left">
            <p className="mb-2 text-sm text-muted-foreground">
              출석률 (최근 30일)
            </p>
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
        <p className="text-sm text-muted-foreground">
          일부 출결 데이터는 현재 불러오지 못했습니다.
        </p>
      )}

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">수강 중인 수업</h3>
          <span className="text-sm text-muted-foreground">
            총 {lectures.length}개
          </span>
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
                instructorInitial={instructorName.slice(0, 1) || "-"}
                onClick={() => handleMoveLectureDetail(lecture)}
                className="h-full"
              />
            );
          })}
        </div>

        {visibleLectures < lectures.length && (
          <div className="flex justify-center pt-4">
            <Button variant="outline" onClick={handleLoadMore}>
              더보기 ({lectures.length - visibleLectures})
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
