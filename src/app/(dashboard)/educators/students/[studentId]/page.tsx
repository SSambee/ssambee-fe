"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Title from "@/components/common/header/Title";
import { useModal } from "@/app/providers/ModalProvider";
import {
  useEnrollmentAttendances,
  useEnrollmentDetail,
} from "@/hooks/useEnrollment";
import EmptyState from "@/components/common/EmptyState";
import { phoneNumberFormatter } from "@/utils/phone";
import StatusLabel from "@/components/common/label/StatusLabel";
import {
  EditProfileFormDataType,
  GetEnrollmentDetail,
} from "@/types/students.type";
import { STUDENT_STATUS_LABEL } from "@/constants/students.default";
import { formatLectureTimes } from "@/utils/formatLectureTimes";
import { StudentProfileAvatar } from "@/components/common/avatar/StudentProfileAvatar";
import { CommonLectureCard } from "@/components/common/CommonLectureCard";

import EditProfileModal from "./_components/detail-modal/EditProfileModal";
import AttendanceDetailModal from "./_components/detail-modal/AttendanceDetailModal";
import AttendanceRegisterModal from "./_components/detail-modal/AttendanceRegisterModal";

export default function StudentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { openModal } = useModal();

  const studentId = params.studentId as string;

  const [visibleLectures, setVisibleLectures] = useState(6);

  // 학생 상세 데이터 조회
  const {
    data: enrollmentData,
    isPending: isDetailPending,
    isError: isDetailError,
  } = useEnrollmentDetail(studentId);

  // 전체 강의 목록
  const allLectures = enrollmentData?.lectures || [];

  // IN_PROGRESS 상태인 강의 중 가장 최신 강의 ID
  const inProgressLectures = allLectures.filter(
    (lecture) => lecture.status === "IN_PROGRESS"
  );
  const mainLectureId = inProgressLectures[0]?.id;

  // 진행 중인 수업이 있는지 확인
  const hasNoInProgressLecture = !mainLectureId;

  // 학생 출결 통계 조회
  const {
    data: attendanceData,
    isPending: isAttendancePending,
    isError: isAttendanceError,
  } = useEnrollmentAttendances(mainLectureId, studentId);

  const attendanceStats = attendanceData?.stats;
  const attendancesList = attendanceData?.attendances || [];
  const enrolledLectures = enrollmentData?.lectures || [];

  if (isDetailPending || (isAttendancePending && !hasNoInProgressLecture)) {
    return <div className="p-8 text-center text-neutral-400">로딩 중...</div>;
  }
  if (
    isDetailError ||
    (!hasNoInProgressLecture && isAttendanceError) ||
    !enrollmentData
  ) {
    return (
      <EmptyState
        message="학생 정보를 불러올 수 없습니다."
        showBackButton={true}
      />
    );
  }

  // 최근 30일 출결 통계
  const lateCount = attendanceStats?.lateCount || 0;
  const absentCount = attendanceStats?.absentCount || 0;
  const attendanceRate = attendanceStats?.attendanceRate || 0;

  const handleLoadMore = () => {
    setVisibleLectures((prev) => prev + 6);
  };

  const getScheduleMeta = (
    lectureTimes: GetEnrollmentDetail["lectures"][0]["lectureTimes"]
  ) => {
    if (lectureTimes.length === 0) {
      return {
        hasSchedule: false,
        scheduleDays: "일정 없음",
        scheduleTime: "-",
      };
    }

    const firstTimeRange = `${lectureTimes[0].startTime} - ${lectureTimes[0].endTime}`;
    const hasSingleTimeRange = lectureTimes.every(
      (lectureTime) =>
        `${lectureTime.startTime} - ${lectureTime.endTime}` === firstTimeRange
    );

    if (hasSingleTimeRange) {
      return {
        hasSchedule: true,
        scheduleDays: lectureTimes
          .map((lectureTime) => lectureTime.day)
          .join(", "),
        scheduleTime: firstTimeRange,
      };
    }

    return {
      hasSchedule: false,
      scheduleDays: formatLectureTimes(lectureTimes),
      scheduleTime: "-",
    };
  };

  return (
    <div className="container mx-auto space-y-8 p-6">
      <Title
        title="학생 상세 정보"
        description="학생의 상세 정보를 확인하고 관리합니다."
      />

      <Card className="rounded-[24px] border border-neutral-100 bg-white">
        <CardContent className="flex flex-col justify-between gap-6 p-6 sm:flex-row">
          <div className="flex gap-6 items-center">
            <div className="shrink-0">
              <StudentProfileAvatar
                seedKey={studentId}
                size={120}
                sizePreset="Medium"
                label={`${enrollmentData.studentName}의 프로필`}
              />
            </div>

            <div className="flex-1 space-y-3">
              <div className="flex flex-col">
                <h2 className="flex items-center gap-2 text-xl font-bold tracking-tight text-neutral-700 xl:text-2xl">
                  {enrollmentData.studentName}
                  <span className="flex gap-1 text-sm">
                    {enrollmentData.appStudentId ? (
                      <StatusLabel color="green">앱 사용자</StatusLabel>
                    ) : (
                      <StatusLabel color="red">미등록</StatusLabel>
                    )}
                    <StatusLabel
                      color={
                        enrollmentData.status === "ACTIVE"
                          ? "green"
                          : enrollmentData.status === "PAUSED"
                            ? "yellow"
                            : "red"
                      }
                    >
                      {STUDENT_STATUS_LABEL[enrollmentData.status]}
                    </StatusLabel>
                  </span>
                </h2>
                <p className="mt-1 text-sm text-neutral-400">
                  🎓 학교 | {enrollmentData.school} ·{" "}
                  {enrollmentData.schoolYear}
                </p>
                <p className="text-sm text-neutral-400">
                  📱 연락처 |{" "}
                  {phoneNumberFormatter(enrollmentData.studentPhone || "")}
                </p>
                <p className="text-sm text-neutral-400">
                  ✉️ 이메일 | {enrollmentData.email || "-"}
                </p>
                <p className="text-sm text-neutral-400">
                  👨‍👩‍👦 학부모 |{" "}
                  {phoneNumberFormatter(enrollmentData.parentPhone || "")}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Button
              variant="outline"
              className="h-10 rounded-[12px] border border-neutral-200 bg-white px-6 text-[16px] font-semibold text-neutral-400 hover:bg-neutral-50"
              onClick={() =>
                openModal(
                  <EditProfileModal
                    studentData={enrollmentData as EditProfileFormDataType}
                  />
                )
              }
            >
              정보 수정
            </Button>
            <Button
              variant="outline"
              className="h-10 rounded-[12px] border border-neutral-200 bg-white px-6 text-[16px] font-semibold text-neutral-400 hover:bg-neutral-50"
              onClick={() =>
                openModal(
                  <AttendanceDetailModal
                    studentData={enrollmentData}
                    attendancesList={attendancesList}
                  />
                )
              }
            >
              출결 상세
            </Button>
            <Button
              disabled={hasNoInProgressLecture}
              className={`h-10 rounded-[12px] px-6 text-[16px] font-semibold shadow-md ${
                hasNoInProgressLecture
                  ? "bg-neutral-200 text-neutral-500 cursor-not-allowed"
                  : "bg-brand-700 hover:bg-brand-800 text-white"
              }`}
              onClick={() =>
                openModal(
                  <AttendanceRegisterModal
                    studentId={studentId}
                    mainLectureId={mainLectureId ?? ""}
                  />
                )
              }
            >
              출결 등록
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="rounded-[24px] border border-[#eaecf2] bg-white">
          <CardContent className="p-6 text-left">
            <p className="mb-2 text-sm text-neutral-400">지각 횟수</p>
            <p className="text-3xl font-bold text-status-warning-normal">
              {lateCount || 0}회
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-[24px] border border-[#eaecf2] bg-white">
          <CardContent className="p-6 text-left">
            <p className="mb-2 text-sm text-neutral-400">결석 횟수</p>
            <p className="text-3xl font-bold text-status-negative-normal">
              {absentCount || 0}회
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-[24px] border border-[#eaecf2] bg-white">
          <CardContent className="p-6 text-left">
            <p className="mb-2 text-sm text-neutral-400">출석률 (최근 30일)</p>
            <p className="text-3xl font-bold text-status-positive-normal">
              {attendanceRate || 0}%
            </p>
          </CardContent>
        </Card>
      </div>

      {isAttendanceError && (
        <p className="text-sm text-neutral-400">
          일부 출결 데이터는 현재 불러오지 못했습니다.
        </p>
      )}

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold tracking-tight text-neutral-700 xl:text-2xl">
            수강 중인 수업
          </h3>
          <span className="text-sm text-neutral-400">
            총 {enrolledLectures.length}개
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {enrolledLectures
            .slice(0, visibleLectures)
            .map((lecture: GetEnrollmentDetail["lectures"][0]) => {
              const scheduleMeta = getScheduleMeta(lecture.lectureTimes);

              return (
                <CommonLectureCard
                  key={lecture.id}
                  subject={lecture.subject}
                  schoolYear={lecture.schoolYear}
                  title={lecture.title}
                  scheduleDays={scheduleMeta.scheduleDays}
                  scheduleTime={scheduleMeta.scheduleTime}
                  hasSchedule={scheduleMeta.hasSchedule}
                  instructorName={enrollmentData.instructorName}
                  onClick={() =>
                    router.push(
                      `/educators/students/${studentId}/lectures/${lecture.lectureEnrollmentId}`
                    )
                  }
                  className="h-full"
                />
              );
            })}
        </div>

        {visibleLectures < enrolledLectures.length && (
          <div className="flex justify-center pt-4">
            <Button
              variant="outline"
              className="h-12 rounded-[12px] border border-neutral-200 bg-white px-6 text-[16px] font-semibold text-neutral-400 hover:bg-neutral-50"
              onClick={handleLoadMore}
            >
              더보기 ({enrolledLectures.length - visibleLectures})
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
