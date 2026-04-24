"use client";

import { Eye } from "lucide-react";

import { Button } from "@/components/ui/button";

import { GradingPageHeader } from "./_components/GradingPageHeader";
import { StudentListSidebar } from "./_components/StudentListSidebar";
import { GradingSummaryCards } from "./_components/GradingSummaryCards";
import { QuestionAnswerList } from "./_components/QuestionAnswerList";
import { GradingResultModal } from "./_modals/grading-result/GradingResultModal";
import { useGradingPage } from "./_hooks/useGradingPage";
import { useGradingReport } from "./_hooks/useGradingReport";

export default function GradingPage() {
  const containerClassName = "container mx-auto space-y-6 p-6";
  const vm = useGradingPage();
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
    onSelectPrevStudent,
    onSelectNextStudent,
    summary,
    gradingQuestions,
    handleSelectObjectiveAnswer,
    handleEssayAnswerChange,
    handleEssayCorrectChange,
    handleSave,
    handleSaveAndSelectNext,
    handleTempSave,
    handleEdit,
    handleComplete,
    canSave,
    canSaveAndNext,
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
  } = vm;

  const {
    overview,
    studentRows,
    questionStats,
    isLoading: isReportLoading,
    isError: isReportError,
  } = useGradingReport({
    examId: examDetail?.id ?? "",
    open: isResultModalOpen,
    examDetail,
  });

  if (isPending) {
    return (
      <div className={containerClassName}>
        <div className="rounded-[16px] border border-[#eaecf2] bg-white px-4 py-10 text-center text-[14px] font-medium text-[#8b90a3]">
          시험 정보를 불러오는 중입니다.
        </div>
      </div>
    );
  }

  if (isError || !examDetail) {
    return (
      <div className={containerClassName}>
        <div className="rounded-[16px] border border-[#ffdcdc] bg-[#fff7f7] px-4 py-10 text-center text-[14px] font-semibold text-[#d84949]">
          시험 정보를 불러오지 못했습니다.
        </div>
      </div>
    );
  }

  return (
    <div className={containerClassName}>
      <GradingPageHeader
        examName={examName}
        lectureName={lectureName}
        examSubtitle={examSubtitle}
      />

      <div className="flex flex-col gap-6 xl:flex-row">
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
                key={selectedStudentId || "no-student"}
                examSubtitle={examSubtitle}
                questions={gradingQuestions}
                onSelectObjectiveAnswer={handleSelectObjectiveAnswer}
                onEssayAnswerChange={handleEssayAnswerChange}
                onEssayCorrectChange={handleEssayCorrectChange}
                onSaveAndNextAction={handleSaveAndSelectNext}
                canSaveAndNext={canSaveAndNext}
                onSelectPrevStudent={onSelectPrevStudent}
                onSelectNextStudent={onSelectNextStudent}
                disabled={isInputDisabled}
              />

              <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
                {canViewResult && (
                  <Button
                    variant="outline"
                    onClick={openResultModal}
                    disabled={isSubmitting}
                    className="h-10 gap-2 rounded-[12px] border-[#d6d9e0] bg-white px-4 text-[13px] font-semibold text-[#6b6f80] hover:bg-[#fcfcfd] hover:text-[#5e6275]"
                  >
                    <Eye className="h-4 w-4" />
                    채점 결과 보기
                  </Button>
                )}
                {isEditing ? (
                  <>
                    <Button
                      variant="outline"
                      onClick={handleTempSave}
                      disabled={isInputDisabled || !canTempSave}
                      className="h-10 rounded-[12px] border-[#d6d9e0] bg-white px-4 text-[13px] font-semibold text-[#6b6f80] hover:bg-[#fcfcfd] hover:text-[#5e6275]"
                    >
                      임시저장
                    </Button>
                    <Button
                      onClick={handleSave}
                      disabled={isInputDisabled || !canSave}
                      className="h-10 rounded-[12px] bg-[#3863f6] px-4 text-[13px] font-semibold text-white hover:bg-[#2f57e8]"
                    >
                      저장
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={handleEdit}
                    className="h-10 rounded-[12px] bg-[#3863f6] px-4 text-[13px] font-semibold text-white hover:bg-[#2f57e8]"
                  >
                    수정
                  </Button>
                )}
                {isCompleted && (
                  <span className="text-[12px] font-medium text-[#8b90a3]">
                    완료된 시험이라 저장이 실패할 수 있습니다.
                  </span>
                )}
              </div>
            </>
          ) : (
            <div className="flex h-96 items-center justify-center rounded-[24px] border border-dashed border-[#d6d9e0] bg-white">
              <p className="text-[15px] font-medium text-[#8b90a3]">
                학생을 선택하면 답안을 입력할 수 있습니다.
              </p>
            </div>
          )}
        </div>
      </div>

      <GradingResultModal
        open={isResultModalOpen}
        onOpenChange={(open) => (open ? openResultModal() : closeResultModal())}
        title={examName}
        subtitle={`${examSubtitle} ${examName}`}
        overview={overview}
        studentRows={studentRows}
        questionStats={questionStats}
        isLoading={isReportLoading}
        isError={isReportError}
      />
    </div>
  );
}
