"use client";

import { useSetBreadcrumb } from "@/hooks/useBreadcrumb";

import { ExamSelectionSection } from "./_components/create/ExamSelectionSection";
import { ExamInfoSection } from "./_components/create/ExamInfoSection";
import { ExamScoreSection } from "./_components/create/ExamScoreSection";
import { ExamQuestionsSection } from "./_components/create/ExamQuestionsSection";
import { ExamStickyFooter } from "./_components/create/ExamStickyFooter";
import { useExamCreateForm } from "./_hooks/useExamCreateForm";

export default function CreateExamPage() {
  useSetBreadcrumb([
    { label: "시험 관리", href: "/educators/exams" },
    { label: "시험 등록/수정" },
  ]);
  const {
    examForm,
    fields,
    lectures,
    examsByLecture,
    activeLectureId,
    selectedExamId,
    isEditMode,
    isEditing,
    isReadOnly,
    isSubmitting,
    isFormDisabled,
    isSelectDisabled,
    isLecturesPending,
    isExamsByLecturePending,
    totalQuestions,
    totalScore,
    autoScore,
    questionsErrorMessage,
    handleLectureSelection,
    handleExamSelection,
    handleAddQuestion,
    handleRemoveQuestion,
    handleAutoScoreChange,
    handleManualScoreChange,
    handleSave,
    openBackModal,
    startEdit,
  } = useExamCreateForm();

  return (
    <div className="container mx-auto space-y-8 p-6 pb-32">
      <section className="-mx-6 -mt-6 border-b border-[#e9ebf0] bg-white px-6 py-6 sm:px-8 sm:py-7">
        <div className="space-y-1.5">
          <h1 className="text-[30px] font-bold leading-[1.2] tracking-[-0.03em] text-[#040405] sm:text-[36px] sm:leading-[48px]">
            시험 등록/수정
          </h1>
          <p className="text-[16px] font-medium leading-6 tracking-[-0.01em] text-[rgba(22,22,27,0.4)] sm:text-[20px] sm:leading-7 sm:tracking-[-0.02em]">
            시험 정보를 입력하고 문항을 구성합니다.
          </p>
        </div>
      </section>

      <ExamSelectionSection
        lectures={lectures}
        lectureValue={activeLectureId}
        onLectureChange={handleLectureSelection}
        isLecturesLoading={isLecturesPending}
        exams={examsByLecture}
        examValue={selectedExamId}
        onExamChange={handleExamSelection}
        isExamsLoading={isExamsByLecturePending}
        disabled={isSelectDisabled}
      />

      <ExamInfoSection
        form={examForm}
        lectures={lectures}
        isLecturesLoading={isLecturesPending}
        disabled={isFormDisabled}
        disableLectureSelect={isEditing}
        showLectureSelect={false}
      />

      <ExamScoreSection
        totalQuestions={totalQuestions}
        totalScore={totalScore}
        errorMessage={questionsErrorMessage}
        autoScore={autoScore}
        onAutoScoreChange={handleAutoScoreChange}
        disabled={isFormDisabled}
      />

      <ExamQuestionsSection
        form={examForm}
        fields={fields}
        disabled={isFormDisabled}
        onAdd={handleAddQuestion}
        onRemove={handleRemoveQuestion}
        onScoreManualChange={handleManualScoreChange}
      />

      <ExamStickyFooter
        totalQuestions={totalQuestions}
        totalScore={totalScore}
        isSaving={isSubmitting}
        isSaveDisabled={isReadOnly}
        showEditButton={isEditing && !isEditMode}
        onEdit={startEdit}
        onBack={openBackModal}
        backLabel="뒤로가기"
        onSave={handleSave}
      />
    </div>
  );
}
