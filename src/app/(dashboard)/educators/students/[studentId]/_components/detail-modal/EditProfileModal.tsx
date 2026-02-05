"use client";

import { useForm, useWatch } from "react-hook-form";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModal } from "@/providers/ModalProvider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  EditProfileFormData,
  EditProfileFormDataType,
} from "@/types/students.type";
import { editProfileSchema } from "@/validation/students.validation";
import { useUpdateEnrollment } from "@/hooks/useEnrollment";
import { GRADE_SELECTING_OPTIONS } from "@/constants/students.default";
import { Textarea } from "@/components/ui/textarea";
import { InputForm } from "@/components/common/input/InputForm";
import SelectBtn from "@/components/common/button/SelectBtn";

type EditProfileModalProps = {
  studentData: EditProfileFormDataType;
};

const getFormDataOnly = (
  data: EditProfileFormDataType
): EditProfileFormData => {
  return {
    studentName: data.studentName ?? "",
    school: data.school ?? "",
    schoolYear: data.schoolYear ?? "",
    studentPhone: data.studentPhone ?? "",
    parentPhone: data.parentPhone ?? "",
    email: data.email ?? "",
    memo: data.memo ?? "",
  };
};

export default function EditProfileModal({
  studentData,
}: EditProfileModalProps) {
  const { isOpen, closeModal } = useModal();
  const [isEditMode, setIsEditMode] = useState(false);

  // 수강생 정보 수정
  const { mutate: updateStudent, isPending } = useUpdateEnrollment();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors, isValid, isDirty, dirtyFields },
  } = useForm<EditProfileFormData>({
    resolver: zodResolver(editProfileSchema),
    mode: "onChange",
    defaultValues: getFormDataOnly(studentData),
  });

  // 모달 열릴 때 폼 초기화
  useEffect(() => {
    if (isOpen) {
      reset(getFormDataOnly(studentData));
    }
  }, [isOpen, studentData, reset]);

  const watchedName = useWatch({ control, name: "studentName" });
  const watchedSchool = useWatch({ control, name: "school" });
  const watchedSchoolYear = useWatch({ control, name: "schoolYear" });
  const watchedStudentPhone = useWatch({ control, name: "studentPhone" });
  const watchedEmail = useWatch({ control, name: "email" });
  const watchedParentPhone = useWatch({ control, name: "parentPhone" });

  const onSubmit = (data: EditProfileFormData) => {
    // dirtyFields 기준으로 변경된 데이터만 추출
    const changedData = Object.keys(dirtyFields).reduce((acc, key) => {
      const field = key as keyof EditProfileFormData;
      acc[field] = data[field];
      return acc;
    }, {} as Partial<EditProfileFormData>);

    if (Object.keys(changedData).length === 0) {
      // 혹시나 isDirty가 true인데 바뀐게 없다면
      setIsEditMode(false);
      return;
    }

    updateStudent(
      { id: studentData.id, data: changedData },
      {
        onSuccess: () => {
          console.log("수강생 정보 수정 성공:", changedData);

          setIsEditMode(false);
          closeModal();
        },
        onError: () => {
          alert("수강생 정보 수정에 실패했습니다.");
        },
      }
    );
  };

  const handleClose = () => {
    reset(studentData); // 변경사항 초기화
    setIsEditMode(false);
    closeModal();
  };

  const handleEditToggle = () => {
    setIsEditMode(true);
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          reset(studentData);
          setIsEditMode(false);
          closeModal();
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>학생 정보</DialogTitle>
          <DialogDescription>
            학생 정보를 최신 상태로 유지하세요.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="max-h-[70vh] overflow-y-auto pr-2 py-2 space-y-4 custom-scrollbar">
            {/* 학생 정보 */}
            <div className="flex flex-col gap-4 text-xs">
              <InputForm
                label="학생 이름"
                disabled={!isEditMode}
                error={errors.studentName?.message}
                {...register("studentName")}
                onReset={() =>
                  setValue("studentName", "", { shouldDirty: true })
                }
                showReset={isEditMode && !!watchedName}
              />

              <InputForm
                label="학교"
                disabled={!isEditMode}
                error={errors.school?.message}
                {...register("school")}
                onReset={() => setValue("school", "", { shouldDirty: true })}
                showReset={isEditMode && !!watchedSchool}
              />

              <div className="space-y-2">
                <Label className="text-xs text-gray-500 ml-1">학년</Label>
                <SelectBtn
                  disabled={!isEditMode}
                  value={watchedSchoolYear}
                  optionSize="sm"
                  className="w-full h-[58px] text-base"
                  options={GRADE_SELECTING_OPTIONS}
                  onChange={(val) =>
                    setValue("schoolYear", val as string, {
                      shouldDirty: true,
                      shouldValidate: true,
                    })
                  }
                  placeholder="학년 선택"
                />
                {errors.schoolYear?.message && (
                  <p className="text-xs text-red-500 ml-1">
                    {errors.schoolYear.message}
                  </p>
                )}
              </div>

              <InputForm
                label="연락처"
                disabled={!isEditMode}
                error={errors.studentPhone?.message}
                {...register("studentPhone")}
                onReset={() =>
                  setValue("studentPhone", "", { shouldDirty: true })
                }
                showReset={isEditMode && !!watchedStudentPhone}
              />

              <InputForm
                label="이메일"
                disabled={!isEditMode}
                error={errors.email?.message}
                {...register("email")}
                onReset={() => setValue("email", "", { shouldDirty: true })}
                showReset={isEditMode && !!watchedEmail}
              />

              <InputForm
                label="학부모 연락처"
                disabled={!isEditMode}
                error={errors.parentPhone?.message}
                {...register("parentPhone")}
                onReset={() =>
                  setValue("parentPhone", "", { shouldDirty: true })
                }
                showReset={isEditMode && !!watchedParentPhone}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="memo">메모</Label>
              <Textarea
                id="memo"
                disabled={!isEditMode}
                {...register("memo")}
                placeholder="학생 관련 메모를 입력하세요"
                rows={4}
              />
            </div>

            <div className="flex gap-2 justify-end">
              <Button
                className="cursor-pointer"
                type="button"
                variant="outline"
                onClick={handleClose}
              >
                닫기
              </Button>
              {!isEditMode && (
                <Button
                  type="button"
                  variant="default"
                  onClick={handleEditToggle}
                >
                  수정
                </Button>
              )}
              {isEditMode && (
                <Button
                  className="cursor-pointer"
                  type="submit"
                  disabled={!isValid || !isDirty || isPending}
                >
                  {isPending ? "저장 중..." : "저장"}
                </Button>
              )}
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
