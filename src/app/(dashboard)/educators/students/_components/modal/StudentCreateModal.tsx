"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useModal } from "@/app/providers/ModalProvider";
import { StudentCreateFormData } from "@/types/students.type";
import {
  getCreateStudentFormDefaults,
  GRADE_SELECTING_OPTIONS,
} from "@/constants/students.default";
import SelectBtn from "@/components/common/button/SelectBtn";
import { studentCreateSchema } from "@/validation/students.validation";
import { useCreateEnrollment, useLecturesList } from "@/hooks/useEnrollment";
import { InputForm } from "@/components/common/input/InputForm";
import { formatPhoneNumber } from "@/utils/phone";
import { useDialogAlert } from "@/hooks/useDialogAlert";

export function StudentCreateModal() {
  const { isOpen, closeModal } = useModal();
  const { showAlert } = useDialogAlert();

  // 수강생 등록
  const { mutate: createEnrollment, isPending } = useCreateEnrollment();

  // 강의 목록 불러오기
  const { data: lectures = [] } = useLecturesList({ page: 1, limit: 100 });
  const lectureOptions = lectures.map((lecture) => ({
    label: lecture.title,
    value: lecture.id,
  }));

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors, isValid },
  } = useForm<StudentCreateFormData>({
    resolver: zodResolver(studentCreateSchema),
    mode: "onChange",
    defaultValues: getCreateStudentFormDefaults(),
  });

  const schoolYear = useWatch({ control, name: "schoolYear" });
  const assignedClass = useWatch({ control, name: "assignedClass" });

  // 전화번호 포맷팅
  const handlePhoneChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "studentPhone" | "parentPhone"
  ) => {
    const formatted = formatPhoneNumber(e.target.value);

    setValue(field, formatted, { shouldValidate: true });
  };

  const onSubmit = (data: StudentCreateFormData) => {
    // 폼에서 assignedClass 필드를 lectureId로 추출
    const { assignedClass: lectureId, ...rest } = data;

    createEnrollment(
      { lectureId, data: { ...rest, lectureId } },
      {
        onSuccess: async () => {
          await showAlert({ description: "수강생이 등록되었습니다." });
          closeModal();
          reset();
        },
      }
    );
  };
  const handleClose = () => {
    reset();
    closeModal();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-[32px]">
        <DialogHeader>
          <DialogTitle className="text-[24px] font-bold text-label-normal">
            학생 등록
          </DialogTitle>
          <DialogDescription className="text-[18px] font-medium text-label-alternative">
            등록 후 학적과 수업 정보를 바로 연결할 수 있어요.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4 border rounded-[20px] px-[24px] py-[16px] bg-surface-normal-light-alternative">
            <h3 className="text-[18px] font-semibold text-label-neutral py-[11px]">
              학생 정보
            </h3>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="studentName"
                    className="text-muted-foreground"
                  >
                    이름
                  </Label>
                  <InputForm
                    id="studentName"
                    label="학생 이름"
                    placeholder="이름 입력"
                    floating={false}
                    className="bg-white border border-neutral-200 rounded-[12px]"
                    required
                    error={errors.studentName?.message}
                    {...register("studentName")}
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="studentPhone"
                    className="text-muted-foreground"
                  >
                    연락처
                  </Label>
                  <InputForm
                    id="studentPhone"
                    label="연락처"
                    placeholder="연락처 입력"
                    floating={false}
                    className="bg-white border border-neutral-200 rounded-[12px]"
                    required
                    error={errors.studentPhone?.message}
                    {...register("studentPhone")}
                    onChange={(e) => handlePhoneChange(e, "studentPhone")}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="school" className="text-muted-foreground">
                    학교
                  </Label>
                  <InputForm
                    id="school"
                    label="학교"
                    placeholder="학교 입력"
                    floating={false}
                    className="bg-white border border-neutral-200 rounded-[12px]"
                    required
                    error={errors.school?.message}
                    {...register("school")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="schoolYear" className="text-muted-foreground">
                    학년
                  </Label>
                  <SelectBtn
                    id="schoolYear"
                    value={schoolYear}
                    placeholder="학년 선택"
                    optionSize="lg"
                    className="text-base px-4 h-[58px] w-full bg-white border border-neutral-200"
                    options={GRADE_SELECTING_OPTIONS}
                    onChange={(value) =>
                      setValue("schoolYear", value, {
                        shouldValidate: true,
                        shouldDirty: true,
                      })
                    }
                  />
                  {errors.schoolYear && (
                    <p className="text-xs text-red-500">
                      {errors.schoolYear.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="parentPhone"
                    className="text-muted-foreground"
                  >
                    학부모 연락처
                  </Label>
                  <InputForm
                    id="parentPhone"
                    label="학부모 연락처"
                    placeholder="학부모 연락처 입력"
                    floating={false}
                    className="bg-white border border-neutral-200 rounded-[12px]"
                    required
                    error={errors.parentPhone?.message}
                    {...register("parentPhone")}
                    onChange={(e) => handlePhoneChange(e, "parentPhone")}
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="registrationDate"
                    className="text-muted-foreground"
                  >
                    학생 등록 날짜
                  </Label>
                  <Input
                    id="registrationDate"
                    type="date"
                    {...register("registrationDate")}
                    disabled
                    className="rounded-[12px] text-base px-4 h-[58px] w-full bg-white border border-neutral-200"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4 border rounded-[20px] px-[24px] py-[16px] bg-surface-normal-light-alternative">
            <h3 className="text-[18px] font-semibold text-label-neutral py-[11px]">
              수업 정보
            </h3>

            <div>
              <div className="space-y-2">
                <Label htmlFor="assignedClass" className="sr-only">
                  배정 클래스
                </Label>
                <SelectBtn
                  id="assignedClass"
                  value={assignedClass}
                  placeholder="배정 클래스"
                  optionSize="lg"
                  className="text-base px-4 h-[58px] w-full bg-white border border-neutral-200"
                  options={lectureOptions}
                  onChange={(value) =>
                    setValue("assignedClass", value, {
                      shouldValidate: true,
                      shouldDirty: true,
                    })
                  }
                />
                {errors.assignedClass && (
                  <p className="text-xs text-red-500">
                    {errors.assignedClass.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4 border rounded-[20px] px-[24px] py-[16px] bg-surface-normal-light-alternative ">
            <h3 className="text-[18px] font-semibold text-label-neutral py-[11px]">
              추가 메모
            </h3>
            <div className="space-y-2">
              <Textarea
                id="memo"
                {...register("memo")}
                placeholder="추가 정보를 입력해주세요"
                rows={4}
                className="text-base p-4 min-h-[130px] w-full rounded-[12px] bg-white border border-neutral-200 shadow-none"
              />
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center">
              <p className="text-xs text-muted-foreground ml-1">
                * 저장 시 학사 담당자에게 자동으로 공유됩니다.
              </p>
            </div>
          </div>
          <div className="flex gap-2 w-full justify-end">
            <Button
              className="cursor-pointer h-[48px] px-[28px] py-[12px] rounded-[12px] bg-white border border-neutral-200 hover:bg-neutral-50 text-label-normal shadow-none"
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isPending}
            >
              닫기
            </Button>
            <Button
              className={`cursor-pointer h-[48px] px-[28px] py-[12px] rounded-[12px] bg-brand-700 hover:bg-brand-800 text-white shadow-none ${!isValid || isPending ? "bg-neutral-200 text-neutral-500 cursor-not-allowed" : ""}`}
              type="submit"
              disabled={!isValid || isPending}
            >
              {isPending ? "등록 중..." : "등록하기"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
