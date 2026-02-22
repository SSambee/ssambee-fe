"use client";

import { useParams, useRouter } from "next/navigation";

import EmptyState from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useSetBreadcrumb } from "@/hooks/useBreadcrumb";
import { formatLectureTimes } from "@/utils/formatLectureTimes";

import ExamListTable from "../_components/ExamListTable";
import ScoreChart from "../_components/ScoreChart";

import { useLearnerLectureDetailPage } from "./_hooks/useLearnerLectureDetailPage";

export default function LearnersLectureDetailPage() {
  const params = useParams();
  const router = useRouter();
  const lectureKey = params.lectureEnrollmentId as string;

  const {
    lectureDetail,
    lectureFromEnrollments,
    lectureTitle,
    isPending,
    hasResolveFailure,
    grades,
    displayLectureTitle,
    displayLectureSubject,
    displayInstructorName,
    selectedExamIds,
    handleSelectExam,
    resetSelectedExamIds,
    handleOpenExamDetail,
    handleMoveList,
  } = useLearnerLectureDetailPage({
    lectureKey,
    push: router.push,
  });

  useSetBreadcrumb([
    { label: "나의강의", href: "/learners/lectures" },
    { label: lectureTitle },
  ]);

  if (isPending) {
    return <div className="p-8 text-center">로딩 중...</div>;
  }

  if (!lectureDetail) {
    if (lectureFromEnrollments) {
      return (
        <div className="container mx-auto space-y-8 p-6">
          <section className="-mx-6 -mt-6 border-b border-[#e9ebf0] bg-white px-6 py-6 sm:px-8 sm:py-7">
            <h1 className="text-[30px] font-bold leading-[1.2] tracking-[-0.03em] text-[#040405] sm:text-[36px] sm:leading-[48px]">
              {lectureFromEnrollments.title}
            </h1>
            <p className="text-[16px] font-medium leading-6 tracking-[-0.01em] text-[rgba(22,22,27,0.4)] sm:text-[20px] sm:leading-7 sm:tracking-[-0.02em]">
              {displayLectureSubject} · {displayInstructorName} 강사
            </p>
          </section>

          <Card className="rounded-[24px] border border-[#eaecf2] bg-white">
            <CardContent className="space-y-3 p-6">
              <p className="text-sm font-semibold text-[#8b90a3]">강의 안내</p>
              <p className="text-sm text-[#16161b]/88">
                수업 시간:{" "}
                {formatLectureTimes(lectureFromEnrollments.lectureTimes)}
              </p>
              <p className="text-sm text-[#16161b]/88">
                담당 강사: {displayInstructorName}
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-[24px] border border-[#eaecf2] bg-white">
            <CardContent className="space-y-3 p-6">
              <p className="text-base font-semibold text-[#4a4d5c]">
                성적 데이터 준비 중입니다.
              </p>
              <p className="text-sm text-[#8b90a3]">
                이 강의는 아직 시험/성적 데이터가 없어 차트와 시험 목록을 표시할
                수 없습니다.
              </p>
              <div>
                <Button
                  variant="outline"
                  onClick={handleMoveList}
                  className="h-12 rounded-[12px] border border-[#d6d9e0] bg-white px-6 text-[16px] font-semibold text-[#6b6f80] hover:bg-[#fcfcfd]"
                >
                  목록으로 돌아가기
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return (
      <EmptyState
        message={
          hasResolveFailure
            ? "강의 ID를 수강 ID로 변환할 수 없어 데이터를 불러오지 못했습니다."
            : "강의 정보를 불러올 수 없습니다."
        }
        showBackButton={true}
      />
    );
  }

  return (
    <div className="container mx-auto space-y-8 p-6">
      <section className="-mx-6 -mt-6 border-b border-[#e9ebf0] bg-white px-6 py-6 sm:px-8 sm:py-7">
        <h1 className="text-[30px] font-bold leading-[1.2] tracking-[-0.03em] text-[#040405] sm:text-[36px] sm:leading-[48px]">
          {displayLectureTitle}
        </h1>
        <p className="text-[16px] font-medium leading-6 tracking-[-0.01em] text-[rgba(22,22,27,0.4)] sm:text-[20px] sm:leading-7 sm:tracking-[-0.02em]">
          {displayLectureSubject} · {displayInstructorName} 강사
        </p>
      </section>

      <Card className="rounded-[24px] border border-[#eaecf2] bg-white">
        <CardContent className="p-8">
          <div className="flex items-center justify-between pb-16">
            <p className="text-[24px] font-bold tracking-tight text-[#4a4d5c]">
              성적 변화 추이{" "}
              <span className="text-[24px] text-[#3863f6]">
                {selectedExamIds.length}개
              </span>
            </p>

            {selectedExamIds.length > 0 && (
              <Button
                variant="outline"
                onClick={resetSelectedExamIds}
                className="h-12 rounded-[12px] border border-[#d6d9e0] bg-white px-6 text-[14px] font-semibold text-[#6b6f80] hover:bg-[#fcfcfd]"
              >
                선택 초기화
              </Button>
            )}
          </div>

          {grades.length > 0 ? (
            <ScoreChart exams={grades} selectedExamIds={selectedExamIds} />
          ) : (
            <div className="flex h-[300px] items-center justify-center text-[#8b90a3]">
              표시할 데이터가 없습니다.
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="rounded-[24px] border border-[#eaecf2] bg-white">
        <CardContent className="p-6">
          <div className="pb-3">
            <p className="text-sm font-bold text-[#8b90a3]">시험 목록</p>
          </div>

          {grades.length > 0 ? (
            <ExamListTable
              exams={grades}
              selectedExamIds={selectedExamIds}
              onSelectExam={handleSelectExam}
              onOpenDetail={handleOpenExamDetail}
            />
          ) : (
            <div className="py-8 text-center text-[#8b90a3]">
              등록된 시험이 없습니다.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
