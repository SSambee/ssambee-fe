"use client";

import {
  Loader2,
  Save,
  Search,
  CheckCircle2,
  Settings2,
  Pencil,
  Eye,
} from "lucide-react";
import dynamic from "next/dynamic";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useSetBreadcrumb } from "@/hooks/useBreadcrumb";
import { cn } from "@/lib/utils";

import { ExamsNavigationTabs } from "../_components/ExamsNavigationTabs";

import { MiniTestsStudentTable } from "./_components/MiniTestsStudentTable";
import { useMiniTestsPage } from "./_hooks/useMiniTestsPage";

const MiniTestsCategoryModal = dynamic(
  () =>
    import("./_components/MiniTestsCategoryModal").then(
      (module) => module.MiniTestsCategoryModal
    ),
  { ssr: false, loading: () => null }
);

const MiniTestsResultModal = dynamic(
  () =>
    import("./_components/MiniTestsResultModal").then(
      (module) => module.MiniTestsResultModal
    ),
  { ssr: false, loading: () => null }
);

export default function MiniTestsPage() {
  useSetBreadcrumb([
    { label: "시험 관리", href: "/educators/exams" },
    { label: "미니테스트" },
  ]);

  const vm = useMiniTestsPage();
  const {
    exams,
    selectedClassId,
    selectedExamId,
    isLoadingClasses,
    isLoadingExams,
    isLoadingStudents,
    selectClass,
    selectExam,
    feedbackMessage,
    isEditMode,
    isSaving,
    isExamFinalized,
    searchTerm,
    setSearchTerm,
    filteredClasses,
    includedAssignments,
    isCategoryApplyFeedback,
    isLoadingAssignmentData,
    students,
    currentSelections,
    resultSearchTerm,
    setResultSearchTerm,
    showOnlyMissingResults,
    setShowOnlyMissingResults,
    isResultModalOpen,
    setIsResultModalOpen,
    filteredResultRows,
    handleQuickEdit,
    handleOpenResultModal,
    handleSaveAll,
    handleEnableEditMode,
    handleSelectionChange,
    handleOpenAssignmentCreationGuide,
  } = vm;

  return (
    <div className="container mx-auto space-y-8 p-6">
      <section className="-mx-6 -mt-6 border-b border-[#e9ebf0] bg-white px-6 py-6 sm:px-8 sm:py-7">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div className="space-y-1.5">
            <h1 className="text-[30px] font-bold leading-[1.2] tracking-[-0.03em] text-[#040405] sm:text-[36px] sm:leading-[48px]">
              미니테스트
            </h1>
            <p className="text-[16px] font-medium leading-6 tracking-[-0.01em] text-[rgba(22,22,27,0.4)] sm:text-[20px] sm:leading-7 sm:tracking-[-0.02em]">
              카테고리별 미니테스트 결과를 입력하고 관리합니다.
            </p>
            {feedbackMessage ? (
              <p className="text-[13px] font-semibold leading-5 tracking-[-0.13px] text-[#3863f6]">
                {feedbackMessage}
              </p>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <Button
              variant="outline"
              onClick={handleQuickEdit}
              className="h-11 gap-2 rounded-[12px] border-[#d6d9e0] bg-white px-4 text-[15px] font-semibold text-[#6b6f80] hover:bg-[#fcfcfd] hover:text-[#5e6275]"
              disabled={!isEditMode}
            >
              <Settings2 className="h-4 w-4" />
              카테고리
            </Button>
            {selectedExamId && isExamFinalized ? (
              <Button
                variant="outline"
                className="h-11 gap-2 rounded-[12px] border-[#d6d9e0] bg-white px-4 text-[15px] font-semibold text-[#6b6f80] hover:bg-[#fcfcfd] hover:text-[#5e6275]"
                onClick={handleOpenResultModal}
              >
                <Eye className="h-4 w-4" />
                결과 보기
              </Button>
            ) : null}
            {selectedExamId &&
              (isEditMode ? (
                <Button
                  onClick={handleSaveAll}
                  disabled={isSaving}
                  className="h-11 gap-2 rounded-[12px] bg-[#3863f6] px-5 text-[15px] font-semibold text-white shadow-[0_0_14px_rgba(138,138,138,0.08)] hover:bg-[#2f57e8]"
                >
                  {isSaving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  최종 저장
                </Button>
              ) : (
                <Button
                  variant="outline"
                  onClick={handleEnableEditMode}
                  className="h-11 gap-2 rounded-[12px] border-[#d6d9e0] bg-white px-4 text-[15px] font-semibold text-[#6b6f80] hover:bg-[#fcfcfd] hover:text-[#5e6275]"
                >
                  <Pencil className="h-4 w-4" />
                  수정
                </Button>
              ))}
          </div>
        </div>
      </section>

      <ExamsNavigationTabs />

      <div className="grid gap-6 xl:grid-cols-[320px_1fr] xl:items-start">
        <div className="space-y-6">
          <Card className="rounded-[24px] border border-[#eaecf2] bg-white shadow-none">
            <div className="px-5 pt-5 sm:px-6 sm:pt-6">
              <h2 className="text-[18px] font-semibold tracking-[-0.18px] text-[#4a4d5c]">
                수업 및 시험 선택
              </h2>
              <p className="mt-1 text-[13px] font-medium leading-5 tracking-[-0.13px] text-[rgba(22,22,27,0.4)]">
                수업과 시험을 선택한 뒤 채점을 진행하세요.
              </p>
            </div>
            <CardContent className="space-y-4 px-5 pb-5 pt-4 sm:px-6 sm:pb-6">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#b0b4c2]" />
                <Input
                  placeholder="수업 검색"
                  className="h-12 rounded-[12px] border-[#e9ebf0] bg-[#fcfcfd] pl-10 text-[15px] font-medium tracking-[-0.15px] placeholder:text-[#8b90a3] focus-visible:ring-0"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="space-y-1 max-h-[208px] overflow-y-auto pr-1">
                {isLoadingClasses ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="h-4 w-4 animate-spin text-[#8b90a3]" />
                  </div>
                ) : filteredClasses.length === 0 ? (
                  <p className="py-4 text-center text-[13px] font-medium text-[#8b90a3]">
                    수업이 없습니다.
                  </p>
                ) : (
                  filteredClasses.map((cls) => (
                    <button
                      key={cls.id}
                      type="button"
                      onClick={() => void selectClass(cls.id)}
                      className={cn(
                        "w-full rounded-[12px] border border-transparent px-3 py-2.5 text-left text-[14px] font-medium transition-colors",
                        selectedClassId === cls.id
                          ? "border-[#4b72f7] bg-[#4b72f7] text-white"
                          : "text-[#4a4d5c] hover:border-[#e9ebf0] hover:bg-[#fcfcfd]"
                      )}
                    >
                      {cls.name}
                    </button>
                  ))
                )}
              </div>

              <Separator className="bg-[#eaecf2]" />

              <div className="space-y-1 max-h-[208px] overflow-y-auto pr-1">
                {!selectedClassId ? (
                  <p className="py-4 text-center text-[13px] font-medium text-[#8b90a3]">
                    수업을 먼저 선택하세요.
                  </p>
                ) : isLoadingExams ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="h-4 w-4 animate-spin text-[#8b90a3]" />
                  </div>
                ) : exams.length === 0 ? (
                  <p className="py-4 text-center text-[13px] font-medium text-[#8b90a3]">
                    시험이 없습니다.
                  </p>
                ) : (
                  exams.map((exam) => (
                    <button
                      key={exam.id}
                      type="button"
                      onClick={() => void selectExam(exam.id)}
                      className={cn(
                        "w-full rounded-[12px] border border-transparent px-3 py-2.5 text-left text-[14px] transition-colors",
                        selectedExamId === exam.id
                          ? "border-[#4b72f7] bg-[#4b72f7] text-white"
                          : "text-[#4a4d5c] hover:border-[#e9ebf0] hover:bg-[#fcfcfd]"
                      )}
                    >
                      <div className="font-semibold">{exam.examName}</div>
                      <div className="text-[11px] opacity-80">
                        {exam.examDate}
                      </div>
                    </button>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {selectedExamId && (
            <Card
              className={cn(
                "rounded-[24px] border border-[#eaecf2] bg-white shadow-none transition-all",
                isCategoryApplyFeedback
                  ? "border-[#4b72f7]/40 ring-2 ring-[#4b72f7]/30"
                  : ""
              )}
            >
              <div className="px-5 pt-5 sm:px-6 sm:pt-6">
                <h2 className="text-[18px] font-semibold tracking-[-0.18px] text-[#4a4d5c]">
                  포함된 과제
                </h2>
              </div>
              <CardContent className="space-y-2 px-5 pb-5 pt-4 sm:px-6 sm:pb-6">
                {includedAssignments.length === 0 ? (
                  <div className="py-2 text-[13px] font-medium text-[#8b90a3]">
                    <p>포함된 과제가 없습니다.</p>
                    <div className="mt-2 flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        className="h-9 rounded-[10px] border-[#d6d9e0] px-3 text-[13px] font-semibold text-[#6b6f80] hover:bg-[#fcfcfd] hover:text-[#5e6275]"
                        onClick={handleQuickEdit}
                        disabled={!isEditMode}
                      >
                        포함 과제 설정
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        className="h-9 rounded-[10px] bg-[#f4f6fe] px-3 text-[13px] font-semibold text-[#3863f6] hover:bg-[#e1e7fe]"
                        onClick={() => void handleOpenAssignmentCreationGuide()}
                      >
                        과제 생성 안내
                      </Button>
                    </div>
                  </div>
                ) : (
                  includedAssignments.map((assignment) => (
                    <div
                      key={assignment.id}
                      className="flex items-center gap-2 rounded-[10px] bg-[#fcfcfd] px-3 py-2 text-[13px] font-medium text-[#4a4d5c]"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#3863f6]" />
                      <span>
                        {assignment.categoryName} · {assignment.title}
                      </span>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          {!selectedExamId ? (
            <Card className="flex flex-col items-center justify-center rounded-[24px] border border-dashed border-[#d6d9e0] bg-white py-24 shadow-none">
              <p className="text-[15px] font-medium text-[#8b90a3]">
                수업과 시험을 선택하여 채점을 시작하세요.
              </p>
            </Card>
          ) : isLoadingStudents || isLoadingAssignmentData ? (
            <Card className="flex h-[420px] items-center justify-center rounded-[24px] border border-[#eaecf2] bg-white shadow-none">
              <Loader2 className="h-8 w-8 animate-spin text-[#8b90a3]" />
            </Card>
          ) : students.length === 0 ? (
            <Card className="flex flex-col items-center justify-center rounded-[24px] border border-dashed border-[#d6d9e0] bg-white py-24 shadow-none">
              <p className="text-[15px] font-medium text-[#8b90a3]">
                해당 시험에 등록된 학생이 없습니다.
              </p>
            </Card>
          ) : includedAssignments.length === 0 ? (
            <Card className="flex flex-col items-center justify-center rounded-[24px] border border-dashed border-[#d6d9e0] bg-white py-24 shadow-none">
              <p className="mb-4 text-[15px] font-medium text-[#8b90a3]">
                성적표에 포함된 과제가 없습니다.
              </p>
              <Button
                type="button"
                onClick={handleQuickEdit}
                disabled={!isEditMode}
                className="h-11 rounded-[12px] bg-[#3863f6] px-5 text-[15px] font-semibold text-white shadow-[0_0_14px_rgba(138,138,138,0.08)] hover:bg-[#2f57e8]"
              >
                포함 과제 설정
              </Button>
            </Card>
          ) : (
            <MiniTestsStudentTable
              students={students}
              includedAssignments={includedAssignments}
              currentSelections={currentSelections}
              isEditMode={isEditMode}
              isCategoryApplyFeedback={isCategoryApplyFeedback}
              onSelectionChange={handleSelectionChange}
            />
          )}
        </div>
      </div>

      {vm.isCategoryModalOpen ? <MiniTestsCategoryModal vm={vm} /> : null}

      {isResultModalOpen ? (
        <MiniTestsResultModal
          open={isResultModalOpen}
          onOpenChange={setIsResultModalOpen}
          selectedExamId={selectedExamId}
          includedAssignments={includedAssignments}
          filteredResultRows={filteredResultRows}
          resultSearchTerm={resultSearchTerm}
          onResultSearchTermChange={setResultSearchTerm}
          showOnlyMissingResults={showOnlyMissingResults}
          onToggleMissingFilter={() =>
            setShowOnlyMissingResults((prev) => !prev)
          }
        />
      ) : null}
    </div>
  );
}
