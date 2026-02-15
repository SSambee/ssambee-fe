"use client";

import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

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
      <div className="space-y-4">
        {/* 1. 수업 검색 */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">
            1. 수업 검색
          </h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="수업명 검색"
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* 수업 목록 */}
          <Card>
            <CardContent className="max-h-[150px] overflow-y-auto p-2">
              {isLoadingClasses ? (
                <p className="py-4 text-center text-sm text-muted-foreground">
                  수업 목록을 불러오는 중입니다.
                </p>
              ) : filteredClasses.length === 0 ? (
                <p className="py-4 text-center text-sm text-muted-foreground">
                  {searchTerm
                    ? "검색 결과가 없습니다."
                    : classes.length === 0
                      ? "등록된 수업이 없습니다."
                      : "수업명을 검색해주세요."}
                </p>
              ) : (
                <div className="space-y-1">
                  {filteredClasses.map((cls) => (
                    <button
                      key={cls.id}
                      onClick={() => handleClassClick(cls.id)}
                      className={`w-full rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-muted ${
                        selectedClassId === cls.id
                          ? "bg-primary text-primary-foreground hover:bg-primary/90"
                          : ""
                      }`}
                    >
                      {cls.name}
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 2. 시험 목록 */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">
            2. 시험 목록
            {selectedClassId && exams.length > 0 && (
              <span className="ml-2 text-xs">({exams.length}개)</span>
            )}
          </h3>
          <Card>
            <CardContent className="max-h-[150px] overflow-y-auto p-2">
              {isLoadingExams ? (
                <p className="py-4 text-center text-sm text-muted-foreground">
                  시험 목록을 불러오는 중입니다.
                </p>
              ) : !selectedClassId ? (
                <p className="py-4 text-center text-sm text-muted-foreground">
                  먼저 수업을 선택해주세요.
                </p>
              ) : exams.length === 0 ? (
                <p className="py-4 text-center text-sm text-muted-foreground">
                  해당 수업에 시험이 없습니다.
                </p>
              ) : (
                <div className="space-y-1">
                  {exams.map((exam) => (
                    <button
                      key={exam.id}
                      onClick={() =>
                        handleExamClick(
                          exam.id,
                          exam.examName,
                          exam.hasStatistics
                        )
                      }
                      className={`w-full rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-muted ${
                        selectedExamId === exam.id
                          ? "bg-primary text-primary-foreground hover:bg-primary/90"
                          : ""
                      } ${exam.hasStatistics ? "" : "cursor-not-allowed opacity-60"}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{exam.examName}</span>
                        {exam.hasStatistics ? (
                          <span className="text-xs opacity-70">
                            {exam.totalStudents}명
                          </span>
                        ) : (
                          <span className="text-xs text-amber-600">
                            최종저장 필요
                          </span>
                        )}
                      </div>
                      <p className="text-xs opacity-60">{exam.examDate}</p>
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 3. 학생 목록 */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">
            3. 학생 목록
            {selectedExamId && students.length > 0 && (
              <span className="ml-2 text-xs">({students.length}명)</span>
            )}
          </h3>
          <Card>
            <CardContent className="max-h-[150px] overflow-y-auto p-2">
              {isLoadingStudents ? (
                <p className="py-4 text-center text-sm text-muted-foreground">
                  학생 목록을 불러오는 중입니다.
                </p>
              ) : !selectedExamId ? (
                <p className="py-4 text-center text-sm text-muted-foreground">
                  먼저 시험을 선택해주세요.
                </p>
              ) : students.length === 0 ? (
                <p className="py-4 text-center text-sm text-muted-foreground">
                  해당 시험을 친 학생이 없습니다.
                </p>
              ) : (
                <div className="space-y-1">
                  {students.map((student) => (
                    <button
                      key={student.id}
                      onClick={() => handleStudentClick(student.id)}
                      className={`w-full rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-muted ${
                        selectedStudentId === student.id
                          ? "bg-primary text-primary-foreground hover:bg-primary/90"
                          : ""
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{student.name}</span>
                        <span className="text-xs opacity-70">
                          {student.score}점
                        </span>
                      </div>
                      <p className="text-xs opacity-60">
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
      <Dialog open={warningOpen} onOpenChange={setWarningOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>성적표 발송 불가</DialogTitle>
            <DialogDescription>
              {warningExamName
                ? `${warningExamName} 시험은 아직 저장되지 않았습니다.`
                : "선택한 시험은 아직 저장되지 않았습니다."}
              <br />
              채점 완료 후 저장되어야 성적표 발송이 가능합니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setWarningOpen(false)}>확인</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
