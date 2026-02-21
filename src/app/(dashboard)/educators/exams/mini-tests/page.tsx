"use client";

import {
  ArrowLeft,
  Loader2,
  Save,
  Search,
  CheckCircle2,
  Settings2,
  Pencil,
  Eye,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useSetBreadcrumb } from "@/hooks/useBreadcrumb";
import { cn } from "@/lib/utils";

import { MiniTestsCategoryModal } from "./_components/MiniTestsCategoryModal";
import { MiniTestsResultModal } from "./_components/MiniTestsResultModal";
import { MiniTestsStudentTable } from "./_components/MiniTestsStudentTable";
import { useMiniTestsPage } from "./_hooks/useMiniTestsPage";

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
    <div className="container mx-auto space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" className="h-9 w-9 p-0" asChild>
            <Link href="/educators/exams">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">미니테스트</h1>
            <p className="text-muted-foreground">
              카테고리별 미니테스트 결과를 입력하고 관리합니다.
            </p>
            {feedbackMessage ? (
              <p className="mt-1 text-xs font-medium text-primary">
                {feedbackMessage}
              </p>
            ) : null}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleQuickEdit}
            className="gap-2"
            disabled={!isEditMode}
          >
            <Settings2 className="h-4 w-4" />
            카테고리
          </Button>
          {selectedExamId && isExamFinalized ? (
            <Button
              variant="outline"
              className="gap-2"
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
                className="gap-2"
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
                className="gap-2"
              >
                <Pencil className="h-4 w-4" />
                수정
              </Button>
            ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        <div className="space-y-6">
          <Card>
            <div className="p-4">
              <h2 className="text-sm font-semibold">수업 및 시험 선택</h2>
            </div>
            <CardContent className="p-4 pt-0 space-y-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="수업 검색"
                  className="pl-8 h-9 text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="space-y-1 max-h-[200px] overflow-y-auto pr-1">
                {isLoadingClasses ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  </div>
                ) : filteredClasses.length === 0 ? (
                  <p className="text-xs text-center py-4 text-muted-foreground">
                    수업이 없습니다.
                  </p>
                ) : (
                  filteredClasses.map((cls) => (
                    <button
                      key={cls.id}
                      type="button"
                      onClick={() => void selectClass(cls.id)}
                      className={cn(
                        "w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
                        selectedClassId === cls.id
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted"
                      )}
                    >
                      {cls.name}
                    </button>
                  ))
                )}
              </div>

              <Separator />

              <div className="space-y-1 max-h-[200px] overflow-y-auto pr-1">
                {!selectedClassId ? (
                  <p className="text-xs text-center py-4 text-muted-foreground">
                    수업을 먼저 선택하세요.
                  </p>
                ) : isLoadingExams ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  </div>
                ) : exams.length === 0 ? (
                  <p className="text-xs text-center py-4 text-muted-foreground">
                    시험이 없습니다.
                  </p>
                ) : (
                  exams.map((exam) => (
                    <button
                      key={exam.id}
                      type="button"
                      onClick={() => void selectExam(exam.id)}
                      className={cn(
                        "w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
                        selectedExamId === exam.id
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted"
                      )}
                    >
                      <div className="font-medium">{exam.examName}</div>
                      <div className="text-[10px] opacity-80">
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
                "transition-all",
                isCategoryApplyFeedback
                  ? "ring-2 ring-primary/40 border-primary/40"
                  : ""
              )}
            >
              <div className="p-4">
                <h2 className="text-sm font-semibold">포함된 과제</h2>
              </div>
              <CardContent className="p-4 pt-0 space-y-2">
                {includedAssignments.length === 0 ? (
                  <div className="text-xs text-muted-foreground py-2">
                    <p>포함된 과제가 없습니다.</p>
                    <div className="mt-2 flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        className="h-8 px-3 text-xs"
                        onClick={handleQuickEdit}
                        disabled={!isEditMode}
                      >
                        포함 과제 설정
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        className="h-8 px-3 text-xs"
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
                      className="flex items-center gap-2 text-xs"
                    >
                      <CheckCircle2 className="h-3 w-3 text-primary" />
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
            <Card className="flex flex-col items-center justify-center py-20 border-dashed">
              <p className="text-muted-foreground">
                수업과 시험을 선택하여 채점을 시작하세요.
              </p>
            </Card>
          ) : isLoadingStudents || isLoadingAssignmentData ? (
            <div className="flex h-[400px] items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : students.length === 0 ? (
            <Card className="flex flex-col items-center justify-center py-20 border-dashed">
              <p className="text-muted-foreground">
                해당 시험에 등록된 학생이 없습니다.
              </p>
            </Card>
          ) : includedAssignments.length === 0 ? (
            <Card className="flex flex-col items-center justify-center py-20 border-dashed">
              <p className="text-muted-foreground mb-4">
                성적표에 포함된 과제가 없습니다.
              </p>
              <Button
                type="button"
                onClick={handleQuickEdit}
                disabled={!isEditMode}
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

      <MiniTestsCategoryModal vm={vm} />

      <MiniTestsResultModal
        open={isResultModalOpen}
        onOpenChange={setIsResultModalOpen}
        selectedExamId={selectedExamId}
        includedAssignments={includedAssignments}
        filteredResultRows={filteredResultRows}
        resultSearchTerm={resultSearchTerm}
        onResultSearchTermChange={setResultSearchTerm}
        showOnlyMissingResults={showOnlyMissingResults}
        onToggleMissingFilter={() => setShowOnlyMissingResults((prev) => !prev)}
      />
    </div>
  );
}
