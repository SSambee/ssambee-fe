"use client";

import { useRouter } from "next/navigation";
import type { UseFormReturn } from "react-hook-form";

import { useCreateExam } from "@/hooks/exams/useCreateExam";
import { useUpdateExam } from "@/hooks/exams/useUpdateExam";
import {
  mapExamFormToCreatePayload,
  mapExamFormToUpdatePayload,
} from "@/services/exams/exams.mapper";
import type { ExamFormInput } from "@/validation/exam.validation";

type UseExamSubmitParams = {
  form: UseFormReturn<ExamFormInput>;
  isEditing: boolean;
  selectedExamId: string;
  activeLectureId: string;
};

export const useExamSubmit = ({
  form,
  isEditing,
  selectedExamId,
  activeLectureId,
}: UseExamSubmitParams) => {
  const router = useRouter();

  const createExamMutation = useCreateExam({
    onSuccess: () => {
      router.push("/educators/exams");
    },
    onError: (error) => {
      alert(error.message);
    },
  });

  const updateExamMutation = useUpdateExam({
    onSuccess: () => {
      router.push("/educators/exams");
    },
    onError: (error) => {
      alert(error.message);
    },
  });

  const handleSave = form.handleSubmit((formData) => {
    if (isEditing && selectedExamId !== "new") {
      const payload = mapExamFormToUpdatePayload(formData);
      updateExamMutation.mutate({ examId: selectedExamId, payload });
    } else {
      const lectureId = formData.lectureId || activeLectureId;
      const payload = mapExamFormToCreatePayload(formData);
      createExamMutation.mutate({ lectureId, payload });
    }
  });

  return {
    handleSave,
    isSubmitting: createExamMutation.isPending || updateExamMutation.isPending,
  };
};
