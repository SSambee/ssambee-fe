"use client";

import Title from "@/components/common/header/Title";
import { ExamSelectionSection } from "@/app/(dashboard)/educators/exams/create/_components/create/ExamSelectionSection";
import { ExamInfoSection } from "@/app/(dashboard)/educators/exams/create/_components/create/ExamInfoSection";
import { ExamScoreSection } from "@/app/(dashboard)/educators/exams/create/_components/create/ExamScoreSection";
import { ExamQuestionsSection } from "@/app/(dashboard)/educators/exams/create/_components/create/ExamQuestionsSection";
import { ExamStickyFooter } from "@/app/(dashboard)/educators/exams/create/_components/create/ExamStickyFooter";
import { useExamCreateForm } from "@/app/(dashboard)/educators/exams/create/_hooks/useExamCreateForm";
import { useSetBreadcrumb } from "@/hooks/useBreadcrumb";

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
    <div className="container mx-auto space-y-6 p-6 pb-28">
      <Title
        title="시험 등록/수정"
        description="시험 정보를 입력하고 문항을 구성합니다."
      />

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
