"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useCreateLecture } from "@/hooks/lectures/useCreateLecture";
import { useLectureCreateStore } from "@/stores/lectures";
import {
  lectureFormSchema,
  LectureFormInput,
} from "@/validation/lecture.validation";

import { CreatePageHeader } from "./_components/CreatePageHeader";
import { LectureInfoSection } from "./_components/LectureInfoSection";
import { LectureScheduleSection } from "./_components/LectureScheduleSection";
import { ManualStudentForm } from "./_components/ManualStudentForm";
import { StudentRegistrationSection } from "./_components/StudentRegistrationSection";
import { useLectureCreateForm } from "./_hooks/useLectureCreateForm";

export default function LectureCreatePage() {
  const router = useRouter();
  const schedules = useLectureCreateStore((state) => state.schedules);
  const scheduleData = useLectureCreateStore((state) => state.scheduleData);
  const isSaved = useLectureCreateStore((state) => state.isSaved);
  const addSchedule = useLectureCreateStore((state) => state.addSchedule);
  const removeSchedule = useLectureCreateStore((state) => state.removeSchedule);
  const setScheduleData = useLectureCreateStore(
    (state) => state.setScheduleData
  );
  const setIsSaved = useLectureCreateStore((state) => state.setIsSaved);
  const resetCreateState = useLectureCreateStore((state) => state.reset);

  // React Hook Form 적용
  const lectureForm = useForm<LectureFormInput>({
    resolver: zodResolver(lectureFormSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      subject: "",
      schoolYear: "",
      startDate: "",
      status: "개강전",
      students: [
        {
          name: "",
          phone: "",
          school: "",
          studentGrade: "",
          parentPhone: "",
          registrationDate: "",
        },
      ],
    },
  });

  useEffect(() => {
    return () => {
      resetCreateState();
    };
  }, [resetCreateState]);

  const createLectureMutation = useCreateLecture();

  const handleAddSchedule = () => {
    if (isSaved) return;
    addSchedule();
  };

  const handleRemoveSchedule = (id: number) => {
    if (isSaved) return;
    removeSchedule(id);
  };

  const { handleSave, handleCancel } = useLectureCreateForm({
    lectureForm,
    schedules,
    scheduleData,
    createLecture: createLectureMutation,
    setIsSaved,
    resetCreateState,
    onSuccess: () => {
      setIsSaved(true);
      router.push("/educators/lectures");
    },
  });

  const onCancel = () => handleCancel(isSaved, () => router.back());

  return (
    <div className="container mx-auto space-y-6 p-6">
      <CreatePageHeader
        isSaved={isSaved}
        onSave={handleSave}
        onCancel={onCancel}
      />

      <LectureInfoSection form={lectureForm} disabled={isSaved} />

      <LectureScheduleSection
        schedules={schedules}
        scheduleData={scheduleData}
        disabled={isSaved}
        onAdd={handleAddSchedule}
        onRemove={handleRemoveSchedule}
        onScheduleDataChange={setScheduleData}
      />

      <StudentRegistrationSection disabled={isSaved}>
        <ManualStudentForm form={lectureForm} disabled={isSaved} />
      </StudentRegistrationSection>
    </div>
  );
}
