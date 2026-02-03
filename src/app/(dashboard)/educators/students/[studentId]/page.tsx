"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Title from "@/components/common/header/Title";
import { mockLectures } from "@/data/lectures.mock";
import noProfile from "@/assets/images/no-profile.jpg";
import { useModal } from "@/providers/ModalProvider";
import {
  useEnrollmentAttendances,
  useEnrollmentDetail,
} from "@/hooks/useEnrollment";
import EmptyState from "@/components/common/EmptyState";
import { phoneNumberFormatter } from "@/utils/phone";
import StatusLabel from "@/components/common/label/StatusLabel";
import { EditProfileFormDataType } from "@/types/students.type";
import { STUDENT_STATUS_LABEL } from "@/constants/students.default";

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
    data: enrollment,
    isPending,
    isError,
  } = useEnrollmentDetail(studentId);

  // const lectureData = enrollment?.lecture;

  // 학생 출결 통계 조회
  const {
    data: attendanceData,
    isPending: isAttendancePending,
    isError: isAttendanceError,
  } = useEnrollmentAttendances(studentId);

  const attendanceStats = attendanceData?.stats;

  if (isPending || isAttendancePending) {
    return (
      <div className="flex items-center justify-center h-screen">
        로딩 중...
      </div>
    );
  }
  if (isError || isAttendanceError || !enrollment) {
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

  // 수강 중인 수업 목록 (임시로 mockLectures 사용)
  const enrolledLectures = mockLectures.slice(0, 13);

  const handleLoadMore = () => {
    setVisibleLectures((prev) => prev + 6);
  };

  return (
    <div className="container mx-auto px-8 py-8 space-y-6 max-w-[1200px]">
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
                  src={enrollment.profileImage || noProfile}
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
                    {enrollment.studentName}
                    <span className="text-sm text-muted-foreground">
                      {enrollment.appStudentId ? (
                        <StatusLabel color="green">앱 사용자</StatusLabel>
                      ) : (
                        <StatusLabel color="red">미등록</StatusLabel>
                      )}
                    </span>
                    {/* TODO: 상태, 컬러 매핑 객체 만들어 사용 > 라벨 컴포넌트 변경해야함*/}
                    <StatusLabel
                      color={
                        enrollment.status === "ACTIVE"
                          ? "green"
                          : enrollment.status === "PAUSED"
                            ? "yellow"
                            : "red"
                      }
                    >
                      {STUDENT_STATUS_LABEL[enrollment.status]}
                    </StatusLabel>
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    🎓 학교 | {enrollment.school} · {enrollment.schoolYear}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    📱 연락처 |{" "}
                    {phoneNumberFormatter(enrollment.studentPhone || "")}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    ✉️ 이메일 | {enrollment.email || "-"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    👨‍👩‍👦 학부모 |{" "}
                    {phoneNumberFormatter(enrollment.parentPhone || "")}
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
                      studentData={enrollment as EditProfileFormDataType}
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
                  openModal(<AttendanceDetailModal studentData={enrollment} />)
                }
              >
                출결 상세
              </Button>
              <Button
                className="cursor-pointer"
                variant="default"
                onClick={() =>
                  openModal(<AttendanceRegisterModal studentId={studentId} />)
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
            <p className="text-3xl font-bold text-yellow-600">{lateCount}회</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-left">
            <p className="text-sm text-muted-foreground mb-2">결석 횟수</p>
            <p className="text-3xl font-bold text-red-600">{absentCount}회</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-left">
            <p className="text-sm text-muted-foreground mb-2">
              출석률 (최근 30일)
            </p>
            <p className="text-3xl font-bold text-green-600">
              {attendanceRate}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 수강 중인 수업 */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">수강 중인 수업</h3>
          <span className="text-sm text-muted-foreground">
            {/* TODO: 수강 중인 수업이 단일 객체로 내려옴... */}총 ?개
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {enrolledLectures.slice(0, visibleLectures).map((lecture) => (
            <Card
              key={lecture.id}
              className="hover:shadow-md transition-shadow relative cursor-pointer"
              onClick={() =>
                router.push(
                  `/educators/students/${studentId}/lectures/${lecture.id}`
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
                  <h4 className="font-semibold text-lg">{lecture.name}</h4>
                </div>
                <div className="space-y-1.5 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">담당 강사:</span>
                    <span className="font-medium">{lecture.instructor}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">수업 시간:</span>
                    <span className="font-medium">
                      {lecture.schedule.days.join(", ")} {lecture.schedule.time}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {visibleLectures < enrolledLectures.length && (
          <div className="flex justify-center pt-4">
            <Button variant="outline" onClick={handleLoadMore}>
              더보기 ({enrolledLectures.length - visibleLectures})
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
