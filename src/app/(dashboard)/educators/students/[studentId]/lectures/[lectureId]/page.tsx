"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import Title from "@/components/common/header/Title";
import { Card, CardContent } from "@/components/ui/card";
import EmptyState from "@/components/common/EmptyState";
import { useLectureEnrollmentDetail } from "@/hooks/useEnrollment";

import ExamListTable from "../_components/ExamListTable";
import ScoreChart from "../_components/ScoreChart";

export default function LectureDetailPage() {
  const params = useParams();
  const lectureEnrollmentId = params.lectureId as string;

  const [selectedExamIds, setSelectedExamIds] = useState<string[]>([]);

  // 해당 강의의 성적 데이터 조회
  const { data, isPending, isError } =
    useLectureEnrollmentDetail(lectureEnrollmentId);

  if (isPending) return <div className="p-8 text-center">로딩 중...</div>;

  if (isError || !data) {
    return (
      <EmptyState
        message="성적 정보를 불러올 수 없습니다."
        showBackButton={true}
      />
    );
  }

  const { lecture, grades } = data.data ?? {};

  if (!lecture || !grades) {
    return (
      <EmptyState
        message="성적 정보를 불러올 수 없습니다."
        showBackButton={true}
      />
    );
  }

  // 시험 리스트(테이블) 클릭
  const handleSelectExam = (examId: string) => {
    setSelectedExamIds(
      (prev) =>
        prev.includes(examId)
          ? prev.filter((id) => id !== examId) // 이미 선택되었으면 제거
          : [...prev, examId] // 선택 추가
    );
  };

  // 선택 초기화
  const handleResetSelection = () => {
    setSelectedExamIds([]);
  };

  return (
    <div className="container mx-auto space-y-8 p-6">
      <Title
        title={lecture.title}
        description={`${lecture.subject} · ${lecture.instructor.name} 강사`}
      />

      <Card>
        <CardContent className="p-8">
          <div className="flex items-center justify-between pb-16">
            <p className="text-[24px] font-bold text-neutral-700">
              성적 변화 추이{" "}
              {selectedExamIds.length > 0 && (
                <span className="text-[24px] text-brand-700">
                  {selectedExamIds.length}개
                </span>
              )}
            </p>
            <div>
              {selectedExamIds.length > 0 && (
                <Button variant="outline" onClick={handleResetSelection}>
                  선택 초기화
                </Button>
              )}
            </div>
          </div>
          {grades.length > 0 ? (
            <ScoreChart exams={grades} selectedExamIds={selectedExamIds} />
          ) : (
            <div className="flex items-center justify-center h-[300px] text-muted-foreground">
              표시할 데이터가 없습니다.
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="pb-3">
            <p className="font-bold text-neutral-700 text-[20px] py-[11px]">
              시험 목록
            </p>
          </div>

          {grades.length > 0 ? (
            <ExamListTable
              exams={grades}
              selectedExamIds={selectedExamIds}
              onSelectExam={handleSelectExam}
            />
          ) : (
            <div className="text-center text-muted-foreground py-8">
              등록된 시험이 없습니다.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
