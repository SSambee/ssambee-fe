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
import { useModal } from "@/providers/ModalProvider";
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

export function StudentCreateModal() {
  const { isOpen, closeModal } = useModal();

  // 수강생 등록
  const { mutate: createEnrollment, isPending } = useCreateEnrollment();

  // 강의 목록 불러오기
  const { data: lectures = [] } = useLecturesList({ page: 1, limit: 100 });
  const lectureOptions = lectures.map((l) => ({ label: l.title, value: l.id }));

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
        onSuccess: () => {
          alert("수강생이 등록되었습니다.");
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">학생 등록</DialogTitle>
          <DialogDescription>
            등록 후 학적과 수업 정보를 바로 연결할 수 있습니다.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            {/* 학생 정보 */}
            <h3 className="text-base font-semibold">
              학생 정보<span className="text-red-500">*</span>
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <InputForm
                  id="studentName"
                  label="학생 이름"
                  required
                  error={errors.studentName?.message}
                  {...register("studentName")}
                />
              </div>

              <div className="space-y-2">
                <InputForm
                  id="studentPhone"
                  label="연락처"
                  required
                  error={errors.studentPhone?.message}
                  {...register("studentPhone")}
                  onChange={(e) => handlePhoneChange(e, "studentPhone")}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <InputForm
                  id="school"
                  label="학교"
                  required
                  error={errors.school?.message}
                  {...register("school")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="schoolYear" className="sr-only">
                  학년
                </Label>
                <SelectBtn
                  id="schoolYear"
                  value={schoolYear}
                  placeholder="학년 선택"
                  optionSize="sm"
                  className="text-base px-4 h-[58px] w-full"
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
          </div>

          {/* 학부모 정보 */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold">
              학부모 정보<span className="text-red-500">*</span>
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <InputForm
                  id="parentPhone"
                  label="학부모 연락처"
                  required
                  error={errors.parentPhone?.message}
                  {...register("parentPhone")}
                  onChange={(e) => handlePhoneChange(e, "parentPhone")}
                />
              </div>
            </div>
          </div>

          {/* 수업 정보 */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold">
              수업 정보<span className="text-red-500">*</span>
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="assignedClass">배정 클래스</Label>
                <SelectBtn
                  id="assignedClass"
                  value={assignedClass}
                  placeholder="클래스 선택"
                  optionSize="sm"
                  className="text-base px-4 h-[58px] w-full"
                  options={lectureOptions}
                  onChange={(val) =>
                    setValue("assignedClass", val, { shouldValidate: true })
                  }
                />
                {errors.assignedClass && (
                  <p className="text-xs text-red-500">
                    {errors.assignedClass.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="registrationDate">학생 등록 날짜</Label>
                <Input
                  id="registrationDate"
                  type="date"
                  {...register("registrationDate")}
                  disabled
                  className="bg-muted text-base px-4 h-[58px] w-full"
                />
              </div>
            </div>
          </div>

          {/* 추가 메모 */}
          <div className="space-y-2">
            <Label htmlFor="memo">추가 메모</Label>
            <Textarea
              id="memo"
              {...register("memo")}
              placeholder="학생에 대한 추가 정보를 입력하세요"
              rows={4}
              className="text-base p-4 min-h-[130px] w-full"
            />
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center">
            <p className="text-xs text-muted-foreground">
              저장 시 학사 담당자에게 자동으로 공유됩니다.
            </p>
            <div className="flex gap-2">
              <Button
                className="cursor-pointer"
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isPending}
              >
                닫기
              </Button>
              <Button
                className={`cursor-pointer ${!isValid || isPending ? "opacity-50 cursor-not-allowed" : ""}`}
                type="submit"
                disabled={!isValid || isPending}
              >
                {isPending ? "등록 중..." : "학생 등록"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
