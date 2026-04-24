"use client";

import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { StudentProfileAvatar } from "@/components/common/avatar/StudentProfileAvatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { useReportSearchSection } from "../_hooks/useReportSearchSection";

export function ReportSearchSection() {
  const {
    classes,
    exams,
    students,
    selectedClassId,
    selectedExamId,
    selectedStudentId,
    isLoadingClasses,
    isLoadingExams,
    isLoadingStudents,
    handleClassClick,
    handleExamClick,
    handleStudentClick,
    filteredClasses,
    searchTerm,
    setSearchTerm,
    warningOpen,
    setWarningOpen,
    warningExamName,
  } = useReportSearchSection();

  return (
    <>
      <section className="space-y-4 rounded-[24px] border border-[#eaecf2] bg-white p-5 shadow-none sm:p-6">
        <div className="space-y-1">
          <h3 className="text-[16px] font-semibold tracking-[-0.16px] text-[#4a4d5c]">
            발송 대상 선택
          </h3>
          <p className="text-[13px] font-medium text-[#8b90a3]">
            수업, 시험, 학생 순서대로 선택하세요.
          </p>
        </div>

        <div className="space-y-3.5">
          <div className="space-y-2">
            <p className="text-[12px] font-semibold text-[#8b90a3]">
              1. 수업 검색
            </p>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#b0b4c2]" />
              <Input
                type="text"
                placeholder="수업명 검색"
                className="h-10 rounded-[12px] border-[#e9ebf0] bg-[#fcfcfd] pl-9 text-[13px] font-medium tracking-[-0.13px] placeholder:text-[#8b90a3]"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>
            <Card className="rounded-[14px] border border-[#eaecf2] bg-[#fcfcfd] shadow-none">
              <CardContent className="max-h-[156px] overflow-y-auto p-2.5">
                {isLoadingClasses ? (
                  <p className="py-4 text-center text-[13px] font-medium text-[#8b90a3]">
                    수업 목록을 불러오는 중입니다.
                  </p>
                ) : filteredClasses.length === 0 ? (
                  <p className="py-4 text-center text-[13px] font-medium text-[#8b90a3]">
                    {searchTerm
                      ? "검색 결과가 없습니다."
                      : classes.length === 0
                        ? "등록된 수업이 없습니다."
                        : "수업명을 검색해주세요."}
                  </p>
                ) : (
                  <div className="space-y-1.5">
                    {filteredClasses.map((cls) => (
                      <button
                        type="button"
                        key={cls.id}
                        onClick={() => handleClassClick(cls.id)}
                        className={cn(
                          "w-full rounded-[10px] border border-transparent px-3 py-2 text-left text-[13px] font-semibold transition-colors",
                          selectedClassId === cls.id
                            ? "border-[#4b72f7] bg-[#4b72f7] text-white"
                            : "text-[#4a4d5c] hover:border-[#e9ebf0] hover:bg-white"
                        )}
                      >
                        {cls.name}
                      </button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-2">
            <p className="text-[12px] font-semibold text-[#8b90a3]">
              2. 시험 목록
              {selectedClassId && exams.length > 0 && (
                <span className="ml-1 text-[11px] font-medium">
                  ({exams.length}개)
                </span>
              )}
            </p>
            <Card className="rounded-[14px] border border-[#eaecf2] bg-[#fcfcfd] shadow-none">
              <CardContent className="max-h-[176px] overflow-y-auto p-2.5">
                {isLoadingExams ? (
                  <p className="py-4 text-center text-[13px] font-medium text-[#8b90a3]">
                    시험 목록을 불러오는 중입니다.
                  </p>
                ) : !selectedClassId ? (
                  <p className="py-4 text-center text-[13px] font-medium text-[#8b90a3]">
                    먼저 수업을 선택해주세요.
                  </p>
                ) : exams.length === 0 ? (
                  <p className="py-4 text-center text-[13px] font-medium text-[#8b90a3]">
                    해당 수업에 시험이 없습니다.
                  </p>
                ) : (
                  <div className="space-y-1.5">
                    {exams.map((exam) => (
                      <button
                        type="button"
                        key={exam.id}
                        onClick={() =>
                          handleExamClick(
                            exam.id,
                            exam.examName,
                            exam.hasStatistics
                          )
                        }
                        className={cn(
                          "w-full rounded-[10px] border border-transparent px-3 py-2 text-left transition-colors",
                          selectedExamId === exam.id
                            ? "border-[#4b72f7] bg-[#4b72f7] text-white"
                            : "text-[#4a4d5c] hover:border-[#e9ebf0] hover:bg-white",
                          !exam.hasStatistics && "cursor-not-allowed opacity-60"
                        )}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="truncate text-[13px] font-semibold">
                            {exam.examName}
                          </span>
                          {exam.hasStatistics ? (
                            <span
                              className={cn(
                                "shrink-0 text-[11px] font-medium",
                                selectedExamId === exam.id
                                  ? "text-white/80"
                                  : "text-[#8b90a3]"
                              )}
                            >
                              {exam.totalStudents}명
                            </span>
                          ) : (
                            <span className="shrink-0 text-[11px] font-semibold text-[#c27a16]">
                              최종저장 필요
                            </span>
                          )}
                        </div>
                        <p
                          className={cn(
                            "mt-0.5 text-[11px] font-medium",
                            selectedExamId === exam.id
                              ? "text-white/70"
                              : "text-[#8b90a3]"
                          )}
                        >
                          {exam.examDate}
                        </p>
                      </button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-2">
            <p className="text-[12px] font-semibold text-[#8b90a3]">
              3. 학생 목록
              {selectedExamId && students.length > 0 && (
                <span className="ml-1 text-[11px] font-medium">
                  ({students.length}명)
                </span>
              )}
            </p>
            <Card className="rounded-[14px] border border-[#eaecf2] bg-[#fcfcfd] shadow-none">
              <CardContent className="max-h-[224px] overflow-y-auto p-2.5">
                {isLoadingStudents ? (
                  <p className="py-4 text-center text-[13px] font-medium text-[#8b90a3]">
                    학생 목록을 불러오는 중입니다.
                  </p>
                ) : !selectedExamId ? (
                  <p className="py-4 text-center text-[13px] font-medium text-[#8b90a3]">
                    먼저 시험을 선택해주세요.
                  </p>
                ) : students.length === 0 ? (
                  <p className="py-4 text-center text-[13px] font-medium text-[#8b90a3]">
                    해당 시험을 친 학생이 없습니다.
                  </p>
                ) : (
                  <div className="space-y-1.5">
                    {students.map((student) => (
                      <button
                        type="button"
                        key={student.id}
                        onClick={() => handleStudentClick(student.id)}
                        className={cn(
                          "w-full rounded-[10px] border border-transparent px-3 py-2 text-left transition-colors",
                          selectedStudentId === student.id
                            ? "border-[#4b72f7] bg-[#4b72f7] text-white"
                            : "text-[#4a4d5c] hover:border-[#e9ebf0] hover:bg-white"
                        )}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex min-w-0 items-center gap-2">
                            <StudentProfileAvatar
                              size={24}
                              seedKey={student.id}
                              label={`${student.name || "학생"} 프로필 이미지`}
                            />
                            <span className="truncate text-[13px] font-semibold">
                              {student.name}
                            </span>
                          </div>
                          <span
                            className={cn(
                              "text-[11px] font-semibold",
                              selectedStudentId === student.id
                                ? "text-white"
                                : "text-[#3863f6]"
                            )}
                          >
                            {student.score}점
                          </span>
                        </div>
                        <p
                          className={cn(
                            "mt-0.5 text-[11px] font-medium",
                            selectedStudentId === student.id
                              ? "text-white/70"
                              : "text-[#8b90a3]"
                          )}
                        >
                          {student.rank}등 / {student.totalStudents}명
                        </p>
                      </button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      <Dialog open={warningOpen} onOpenChange={setWarningOpen}>
        <DialogContent className="max-w-md rounded-[20px] border border-[#eaecf2] p-6">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-[20px] font-bold tracking-[-0.2px] text-[#040405]">
              성적표 발송 불가
            </DialogTitle>
            <DialogDescription className="text-[14px] font-medium leading-6 text-[#8b90a3]">
              {warningExamName
                ? `${warningExamName} 시험은 아직 저장되지 않았습니다.`
                : "선택한 시험은 아직 저장되지 않았습니다."}
              <br />
              채점 완료 후 저장되어야 성적표 발송이 가능합니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="pt-2">
            <Button
              className="h-10 rounded-[10px] bg-[#3863f6] px-4 text-[14px] font-semibold text-white hover:bg-[#2f57e8]"
              onClick={() => setWarningOpen(false)}
            >
              확인
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
