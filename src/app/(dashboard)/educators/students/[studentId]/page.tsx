"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Title from "@/components/common/header/Title";
import noProfile from "@/assets/images/no-profile.jpg";
import { useModal } from "@/providers/ModalProvider";
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

  // 전체 강의 목록 (상태 필터링 제거)
  const allLectures = enrollmentData?.lectures || [];

  // IN_PROGRESS 상태인 강의 중 가장 최신 강의 ID (출결 조회의 기준)
  const inProgressLectures = allLectures.filter(
    (lecture) => lecture.status === "IN_PROGRESS"
  );
  const mainLectureId = inProgressLectures[0]?.id;

  // 진행 중인 수업이 있는지 확인 (출결 등록 가능 여부)
  const hasNoInProgressLecture = !mainLectureId;

  // 학생 출결 통계 조회 (진행 중인 강의가 있을 때만)
  const {
    data: attendanceData,
    isPending: isAttendancePending,
    isError: isAttendanceError,
  } = useEnrollmentAttendances(mainLectureId, studentId);

  const attendanceStats = attendanceData?.stats;
  const attendancesList = attendanceData?.attendances || [];
  const enrolledLectures = enrollmentData?.lectures || [];

  if (isDetailPending || (isAttendancePending && !hasNoInProgressLecture)) {
    return (
      <div className="flex items-center justify-center h-screen">
        로딩 중...
      </div>
    );
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

  return (
    <div className="container mx-auto space-y-8 p-6">
      <Title
        title="학생 상세 정보"
        description="학생의 상세 정보를 확인하고 관리합니다."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 학생 프로필 */}
        <Card className="lg:col-span-2">
          <CardContent className="flex gap-6 p-6 justify-between sm:flex-row flex-col">
            <div className="flex gap-6">
              {/* 프로필 이미지 */}
              <div className="shrink-0">
                <Image
                  src={noProfile}
                  alt={"학생 프로필 이미지"}
                  width={120}
                  height={120}
                  className="rounded-lg object-cover"
                />
              </div>

              {/* 학생 정보 */}
              <div className="flex-1 space-y-3">
                <div className="flex flex-col">
                  <h2 className="text-2xl font-bold flex items-center gap-1">
                    {enrollmentData.studentName}
                    <span className="text-sm text-muted-foreground">
                      {enrollmentData.appStudentId ? (
                        <StatusLabel color="green">앱 사용자</StatusLabel>
                      ) : (
                        <StatusLabel color="red">미등록</StatusLabel>
                      )}
                    </span>
                    {/* TODO: 상태, 컬러 매핑 객체 만들어 사용 > 라벨 컴포넌트 변경해야함*/}
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
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    🎓 학교 | {enrollmentData.school} ·{" "}
                    {enrollmentData.schoolYear}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    📱 연락처 |{" "}
                    {phoneNumberFormatter(enrollmentData.studentPhone || "")}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    ✉️ 이메일 | {enrollmentData.email || ""}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    👨‍👩‍👦 학부모 |{" "}
                    {phoneNumberFormatter(enrollmentData.parentPhone || "")}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Button
                className="cursor-pointer"
                variant="outline"
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
                className="cursor-pointer"
                variant="outline"
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
                className="cursor-pointer"
                disabled={hasNoInProgressLecture}
                variant="default"
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
      </div>

      {/* 출결 통계 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6 text-left">
            <p className="text-sm text-muted-foreground mb-2">지각 횟수</p>
            <p className="text-3xl font-bold text-yellow-600">
              {lateCount || 0}회
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-left">
            <p className="text-sm text-muted-foreground mb-2">결석 횟수</p>
            <p className="text-3xl font-bold text-red-600">
              {absentCount || 0}회
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-left">
            <p className="text-sm text-muted-foreground mb-2">
              출석률 (최근 30일)
            </p>
            <p className="text-3xl font-bold text-green-600">
              {attendanceRate || 0}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 수강 중인 수업 */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">수강 중인 수업</h3>
          <span className="text-sm text-muted-foreground">
            총 {enrolledLectures.length}개
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {enrolledLectures
            .slice(0, visibleLectures)
            .map((lecture: GetEnrollmentDetail["lectures"][0]) => (
              <Card
                key={lecture.id}
                className="hover:shadow-md transition-shadow relative cursor-pointer"
                onClick={() =>
                  router.push(
                    `/educators/students/${studentId}/lectures/${lecture.lectureEnrollmentId}`
                  )
                }
              >
                <CardContent className="w-full">
                  <div className="absolute top-0 left-0 w-full h-[40%] bg-blue-500 rounded-t-lg"></div>
                  <div>
                    <div className="flex items-center gap-2 mt-[40%]">
                      <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded">
                        {lecture.subject}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {lecture.schoolYear}
                      </span>
                    </div>
                    <h4 className="font-semibold text-lg">{lecture.title}</h4>
                  </div>
                  <div className="space-y-1.5 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">담당 강사:</span>
                      <span className="font-medium">
                        {enrollmentData.instructorName}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">수업 시간:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {formatLectureTimes(lecture.lectureTimes)}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          {visibleLectures < enrolledLectures.length && (
            <div className="flex justify-center pt-4">
              <Button variant="outline" onClick={handleLoadMore}>
                더보기 ({enrolledLectures.length - visibleLectures})
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
