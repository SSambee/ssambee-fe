"use client";

import { useState } from "react";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useExamsByLecture } from "@/hooks/exams/useExamsByLecture";
import { Lecture, LectureStatus } from "@/types/lectures";

import { LectureDetailStudents } from "./LectureDetailStudents";
import { LectureDetailExams } from "./LectureDetailExams";
import { LectureDetailHeader } from "./LectureDetailHeader";
import { LectureDetailEditForm } from "./LectureDetailEditForm";
import { LectureDetailStudentsEditable } from "./LectureDetailStudentsEditable";
import { LectureDetailReadOnly } from "./LectureDetailReadOnly";
import { useLectureDetailModal } from "./_hooks/useLectureDetailModal";

type LectureDetailModalProps = {
  lecture: Lecture | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function LectureDetailModal({
  lecture,
  open,
  onOpenChange,
}: LectureDetailModalProps) {
  const [activeTab, setActiveTab] = useState<"students" | "tests">("students");

  const {
    mergedLecture,
    studentList,
    currentStudents,
    isLectureLoading,
    isEditing,
    setIsEditing,
    resetEditState,
    editTitle,
    editStatus,
    editStartDate,
    editInstructor,
    editTimes,
    statusOptions,
    dayOptions,
    scheduleSummary,
    setEditTitle,
    setEditStatus,
    setEditStartDate,
    handleEditStart,
    handleEditCancel,
    handleSaveEdit,
    handleAddSchedule,
    handleRemoveSchedule,
    handleScheduleChange,
  } = useLectureDetailModal({ lecture, open });

  const { data: examsByLecture } = useExamsByLecture(
    open ? mergedLecture.id : undefined
  );
  const testsCount = examsByLecture?.length ?? 0;

  const handleModalOpenChange = (nextOpen: boolean) => {
    resetEditState();
    setIsEditing(false);
    if (!nextOpen) {
      setActiveTab("students");
    }
    onOpenChange(nextOpen);
  };

  if (!lecture) return null;

  return (
    <Dialog open={open} onOpenChange={handleModalOpenChange}>
      <DialogContent
        className="w-[calc(100vw-24px)] max-w-[800px] overflow-hidden rounded-[32px] border-0 bg-white p-0 shadow-[0_0_14px_rgba(138,138,138,0.16)]"
        showClose={false}
      >
        <LectureDetailHeader
          isEditing={isEditing}
          onSave={handleSaveEdit}
          onCancel={handleEditCancel}
          onEditStart={handleEditStart}
          onClose={() => handleModalOpenChange(false)}
        />

        {isEditing ? (
          <div className="px-6 py-5 sm:px-10 sm:py-6">
            <LectureDetailEditForm
              editTitle={editTitle}
              editStatus={editStatus}
              editStartDate={editStartDate}
              editInstructor={editInstructor}
              editTimes={editTimes}
              currentStudents={currentStudents}
              statusOptions={statusOptions}
              dayOptions={dayOptions}
              onTitleChange={setEditTitle}
              onStatusChange={(value) => setEditStatus(value as LectureStatus)}
              onStartDateChange={setEditStartDate}
              onScheduleAdd={handleAddSchedule}
              onScheduleRemove={handleRemoveSchedule}
              onScheduleChange={handleScheduleChange}
            />

            <div className="mt-5 border-y border-[#f4f6fa]">
              <div className="flex items-center gap-6">
                <button
                  type="button"
                  onClick={() => setActiveTab("students")}
                  className={`flex items-center gap-[6px] border-b-2 px-6 py-4 ${
                    activeTab === "students"
                      ? "border-[#3863f6]"
                      : "border-transparent"
                  }`}
                >
                  <span
                    className={`text-[18px] font-semibold leading-[26px] tracking-[-0.18px] ${
                      activeTab === "students"
                        ? "text-[rgba(22,22,27,0.88)]"
                        : "text-[rgba(22,22,27,0.16)]"
                    }`}
                  >
                    등록 학생
                  </span>
                  <span
                    className={`inline-flex h-6 min-w-6 items-center justify-center rounded-full px-2 text-[16px] leading-6 tracking-[-0.16px] ${
                      activeTab === "students"
                        ? "bg-[#e1e7fe] font-semibold text-[#2554f5]"
                        : "bg-[#e9ebf0] font-medium text-[#b0b4c2]"
                    }`}
                  >
                    {studentList.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("tests")}
                  className={`flex items-center gap-[6px] border-b-2 px-6 py-4 ${
                    activeTab === "tests"
                      ? "border-[#3863f6]"
                      : "border-transparent"
                  }`}
                >
                  <span
                    className={`text-[18px] font-semibold leading-[26px] tracking-[-0.18px] ${
                      activeTab === "tests"
                        ? "text-[rgba(22,22,27,0.88)]"
                        : "text-[rgba(22,22,27,0.16)]"
                    }`}
                  >
                    테스트
                  </span>
                  <span
                    className={`inline-flex h-6 min-w-6 items-center justify-center rounded-full px-2 text-[16px] leading-6 tracking-[-0.16px] ${
                      activeTab === "tests"
                        ? "bg-[#e1e7fe] font-semibold text-[#2554f5]"
                        : "bg-[#e9ebf0] font-medium text-[#b0b4c2]"
                    }`}
                  >
                    {testsCount}
                  </span>
                </button>
              </div>
            </div>

            <div className="mt-6">
              {activeTab === "students" ? (
                isLectureLoading ? (
                  <div className="rounded-[16px] border border-[#f4f6fa] bg-[#f7f8fa] px-6 py-8 text-center text-sm text-[#8b90a3]">
                    학생 목록 불러오는 중...
                  </div>
                ) : (
                  <LectureDetailStudentsEditable students={studentList} />
                )
              ) : (
                <LectureDetailExams
                  lectureId={mergedLecture.id}
                  lectureName={mergedLecture.name}
                  enabled={open && activeTab === "tests"}
                />
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="px-6 pb-6 pt-4 sm:px-10">
              <LectureDetailReadOnly
                lecture={mergedLecture}
                currentStudents={currentStudents}
                scheduleSummary={scheduleSummary()}
                statusOverride={editStatus}
                startDateOverride={editStartDate}
                instructorOverride={editInstructor}
              />
            </div>

            <div className="border-y border-[#f4f6fa] px-6 sm:px-10">
              <div className="flex items-center gap-6">
                <button
                  type="button"
                  onClick={() => setActiveTab("students")}
                  className={`flex items-center gap-[6px] border-b-2 px-6 py-4 ${
                    activeTab === "students"
                      ? "border-[#3863f6]"
                      : "border-transparent"
                  }`}
                >
                  <span
                    className={`text-[18px] font-semibold leading-[26px] tracking-[-0.18px] ${
                      activeTab === "students"
                        ? "text-[rgba(22,22,27,0.88)]"
                        : "text-[rgba(22,22,27,0.16)]"
                    }`}
                  >
                    등록 학생
                  </span>
                  <span
                    className={`inline-flex h-6 min-w-6 items-center justify-center rounded-full px-2 text-[16px] leading-6 tracking-[-0.16px] ${
                      activeTab === "students"
                        ? "bg-[#e1e7fe] font-semibold text-[#2554f5]"
                        : "bg-[#e9ebf0] font-medium text-[#b0b4c2]"
                    }`}
                  >
                    {studentList.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("tests")}
                  className={`flex items-center gap-[6px] border-b-2 px-6 py-4 ${
                    activeTab === "tests"
                      ? "border-[#3863f6]"
                      : "border-transparent"
                  }`}
                >
                  <span
                    className={`text-[18px] font-semibold leading-[26px] tracking-[-0.18px] ${
                      activeTab === "tests"
                        ? "text-[rgba(22,22,27,0.88)]"
                        : "text-[rgba(22,22,27,0.16)]"
                    }`}
                  >
                    테스트
                  </span>
                  <span
                    className={`inline-flex h-6 min-w-6 items-center justify-center rounded-full px-2 text-[16px] leading-6 tracking-[-0.16px] ${
                      activeTab === "tests"
                        ? "bg-[#e1e7fe] font-semibold text-[#2554f5]"
                        : "bg-[#e9ebf0] font-medium text-[#b0b4c2]"
                    }`}
                  >
                    {testsCount}
                  </span>
                </button>
              </div>
            </div>

            <div className="px-6 pb-7 pt-6 sm:px-10">
              {activeTab === "students" ? (
                isLectureLoading ? (
                  <div className="rounded-[16px] border border-[#f4f6fa] bg-[#f7f8fa] px-6 py-8 text-center text-sm text-[#8b90a3]">
                    학생 목록 불러오는 중...
                  </div>
                ) : (
                  <LectureDetailStudents students={studentList} />
                )
              ) : (
                <LectureDetailExams
                  lectureId={mergedLecture.id}
                  lectureName={mergedLecture.name}
                  enabled={open && activeTab === "tests"}
                />
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
