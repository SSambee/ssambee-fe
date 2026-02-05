"use client";

import { Button } from "@/components/ui/button";
import { useGradingPage } from "@/app/(dashboard)/educators/exams/[examId]/grading/_hooks/useGradingPage";
import { useSetBreadcrumb } from "@/hooks/useBreadcrumb";

import { GradingPageHeader } from "./_components/GradingPageHeader";
import { StudentListSidebar } from "./_components/StudentListSidebar";
import { GradingSummaryCards } from "./_components/GradingSummaryCards";
import { QuestionAnswerList } from "./_components/QuestionAnswerList";
import { GradingResultModal } from "./_modals/grading-result/GradingResultModal";

export default function GradingPage() {
  const {
    examDetail,
    isPending,
    isError,
    examName,
    lectureName,
    examSubtitle,
    students,
    selectedStudentId,
    onSelectStudent,
    summary,
    gradingQuestions,
    handleSelectObjectiveAnswer,
    handleEssayAnswerChange,
    handleEssayCorrectChange,
    handleSave,
    handleTempSave,
    handleEdit,
    handleComplete,
    canSave,
    canTempSave,
    canComplete,
    canViewResult,
    isCompleted,
    isInputDisabled,
    isEditing,
    isResultModalOpen,
    openResultModal,
    closeResultModal,
    isSubmitting,
  } = useGradingPage();

  useSetBreadcrumb([
    { label: "시험 관리", href: "/educators/exams" },
    { label: "채점 관리" },
  ]);

  if (isPending) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-sm text-muted-foreground">
          시험 정보를 불러오는 중입니다.
        </div>
      </div>
    );
  }

  if (isError || !examDetail) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-sm text-red-500">
          시험 정보를 불러오지 못했습니다.
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <GradingPageHeader
        examName={examName}
        lectureName={lectureName}
        examSubtitle={examSubtitle}
      />

      <div className="flex gap-6">
        <StudentListSidebar
          students={students}
          selectedStudentId={selectedStudentId}
          onSelectStudentAction={onSelectStudent}
          onCompleteAction={handleComplete}
          onOpenResultModalAction={openResultModal}
          disableComplete={!canComplete}
          disabled={isSubmitting}
          canViewResult={canViewResult}
        />

        <div className="flex-1">
          {selectedStudentId ? (
            <>
              <GradingSummaryCards summary={summary} />

              <QuestionAnswerList
                examSubtitle={examSubtitle}
                questions={gradingQuestions}
                onSelectObjectiveAnswer={handleSelectObjectiveAnswer}
                onEssayAnswerChange={handleEssayAnswerChange}
                onEssayCorrectChange={handleEssayCorrectChange}
                disabled={isInputDisabled}
              />

              <div className="flex items-center justify-end gap-3 mt-6">
                {isEditing ? (
                  <>
                    <Button
                      variant="outline"
                      onClick={handleTempSave}
                      disabled={isInputDisabled || !canTempSave}
                    >
                      임시저장
                    </Button>
                    <Button
                      onClick={handleSave}
                      disabled={isInputDisabled || !canSave}
                    >
                      저장
                    </Button>
                  </>
                ) : (
                  <Button onClick={handleEdit}>수정</Button>
                )}
                {isCompleted && (
                  <span className="text-xs text-muted-foreground">
                    완료된 시험이라 저장이 실패할 수 있습니다.
                  </span>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-96 text-muted-foreground">
              <p>학생을 선택하면 답안을 입력할 수 있습니다.</p>
            </div>
          )}
        </div>
      </div>

      <GradingResultModal
        open={isResultModalOpen}
        onOpenChange={(open) => (open ? openResultModal() : closeResultModal())}
        title={examName}
        subtitle={`${examSubtitle} ${examName}`}
        overview={{
          examDate: "-",
          averageScore: 0,
          top30AverageScore: 0,
          maxScore: 0,
        }}
        studentRows={[]}
        questionStats={[]}
      />
    </div>
  );
}
