"use client";

import { CreatePageHeader } from "./_components/CreatePageHeader";
import { LectureInfoSection } from "./_components/LectureInfoSection";
import { LectureScheduleSection } from "./_components/LectureScheduleSection";
import { ManualStudentForm } from "./_components/ManualStudentForm";
import { StudentRegistrationSection } from "./_components/StudentRegistrationSection";
import { useLectureCreatePage } from "./_hooks/useLectureCreatePage";

export default function LectureCreatePage() {
  const { state, form, schedule, actions } = useLectureCreatePage();

  return (
    <div className="min-h-screen bg-[#f4f6fa]">
      <CreatePageHeader
        isSaved={state.isSaved}
        isSubmitting={state.isSubmitting}
        onSave={actions.save}
        onCancel={actions.cancel}
      />
      <div className="py-10 lg:py-20">
        <div className="mx-auto flex max-w-[1660px] flex-col gap-10 px-4 sm:px-6 lg:px-10 xl:flex-row xl:px-[140px]">
          <div className="flex flex-1 flex-col gap-10">
            <LectureInfoSection
              form={form.lectureForm}
              disabled={state.isSaved}
            />

            <LectureScheduleSection
              schedules={schedule.schedules}
              scheduleData={schedule.scheduleData}
              disabled={state.isSaved}
              onAdd={actions.addSchedule}
              onRemove={actions.removeSchedule}
              onScheduleDataChange={actions.setScheduleData}
            />
          </div>

          <div className="flex flex-1 flex-col">
            <StudentRegistrationSection
              disabled={state.isSaved}
              actionLabel="+ 학생 추가"
              onAction={actions.appendStudent}
            >
              <ManualStudentForm
                form={form.lectureForm}
                fields={form.fields}
                onRemove={actions.removeStudent}
                disabled={state.isSaved}
              />
            </StudentRegistrationSection>
          </div>
        </div>
      </div>
    </div>
  );
}
