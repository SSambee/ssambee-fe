"use client";

import { useState } from "react";
import {
  FieldArrayWithId,
  Path,
  UseFormReturn,
  useFormState,
  useWatch,
} from "react-hook-form";
import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SelectBtn from "@/components/common/button/SelectBtn";
import { LectureFormInput } from "@/validation/lecture.validation";
import { formatPhoneNumber } from "@/utils/phone";
import { DatePickerField } from "@/components/common/input/DatePickerField";
import { LECTURE_GRADES } from "@/constants/lectures.constants";

type ManualStudentFormProps = {
  form: UseFormReturn<LectureFormInput>;
  fields: FieldArrayWithId<LectureFormInput, "students", "id">[];
  onRemove: (index: number) => void;
  disabled: boolean;
};

export function ManualStudentForm({
  form,
  fields,
  onRemove,
  disabled,
}: ManualStudentFormProps) {
  const [lockedIds, setLockedIds] = useState<Set<string>>(new Set());

  const { register, trigger, setValue } = form;
  const { errors } = useFormState({ control: form.control });
  const studentsValues = useWatch({ control: form.control, name: "students" });
  const studentGradeOptions = LECTURE_GRADES.map((grade) => ({
    label: grade,
    value: grade,
  }));

  const handlePhoneChange = (
    index: number,
    field: "phone" | "parentPhone",
    value: string
  ) => {
    setValue(`students.${index}.${field}`, formatPhoneNumber(value), {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const handleRemove = (index: number, fieldId: string) => {
    if (disabled) return;
    setLockedIds((prev) => {
      const next = new Set(prev);
      next.delete(fieldId);
      return next;
    });
    onRemove(index);
  };

  const handleToggleLock = async (index: number, fieldId: string) => {
    if (disabled) return;

    const isLocked = lockedIds.has(fieldId);
    if (isLocked) {
      setLockedIds((prev) => {
        const next = new Set(prev);
        next.delete(fieldId);
        return next;
      });
      return;
    }

    const isValid = await trigger([
      `students.${index}.name`,
      `students.${index}.phone`,
      `students.${index}.school`,
      `students.${index}.studentGrade`,
      `students.${index}.parentPhone`,
      `students.${index}.registrationDate`,
    ]);

    if (!isValid) return;

    setLockedIds((prev) => new Set(prev).add(fieldId));
  };

  return (
    <div className="space-y-6">
      {fields.map((field, index) => {
        const fieldErrors = errors.students?.[index];
        const isLocked = lockedIds.has(field.id) || disabled;

        return (
          <div
            key={field.id}
            className="rounded-[20px] bg-[#f7f8fa] px-6 pb-6 pt-4"
          >
            <div className="mb-4 flex items-center justify-between">
              <p className="text-[18px] font-semibold leading-[26px] tracking-[-0.18px] text-[rgba(22,22,27,0.4)]">
                학생 {index + 1}
              </p>
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleToggleLock(index, field.id)}
                  disabled={disabled}
                  className="h-10 px-3 border-transparent bg-transparent shadow-none text-[14px] font-semibold text-[#3863f6] hover:bg-transparent hover:text-[#3863f6]"
                >
                  {isLocked ? "수정" : "확정"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleRemove(index, field.id)}
                  disabled={disabled || isLocked}
                  className="h-10 w-10 rounded-[12px] border-[#d6d9e0] bg-white p-0 text-[#8b90a3]"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor={`student-${index}-name`} className="sr-only">
                  이름
                </label>
                <Input
                  id={`student-${index}-name`}
                  {...register(`students.${index}.name`)}
                  placeholder="이름"
                  disabled={isLocked}
                  className="h-14 rounded-[12px] border-[#d6d9e0] text-[16px] placeholder:text-[#8b90a3]"
                />
                {fieldErrors?.name?.message && (
                  <p className="mt-1 text-xs text-red-500">
                    {fieldErrors.name.message as string}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor={`student-${index}-studentGrade`}
                  className="sr-only"
                >
                  학년
                </label>
                <input
                  type="hidden"
                  {...register(`students.${index}.studentGrade`)}
                  id={`student-${index}-studentGrade`}
                />
                <SelectBtn
                  id={`student-${index}-studentGrade-select`}
                  value={studentsValues?.[index]?.studentGrade ?? ""}
                  placeholder="학년"
                  options={studentGradeOptions}
                  onChange={(value) =>
                    setValue(`students.${index}.studentGrade`, value, {
                      shouldDirty: true,
                      shouldValidate: true,
                    })
                  }
                  variant="figma"
                  className="!bg-transparent font-medium tracking-[-0.16px] text-[#8b90a3]"
                  isError={Boolean(fieldErrors?.studentGrade)}
                  disabled={isLocked}
                />
                {fieldErrors?.studentGrade?.message && (
                  <p className="mt-1 text-xs text-red-500">
                    {fieldErrors.studentGrade.message as string}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-3">
              <div>
                <label htmlFor={`student-${index}-school`} className="sr-only">
                  학교
                </label>
                <Input
                  id={`student-${index}-school`}
                  {...register(`students.${index}.school`)}
                  placeholder="학교"
                  disabled={isLocked}
                  className="h-14 rounded-[12px] border-[#d6d9e0] text-[16px] placeholder:text-[#8b90a3]"
                />
                {fieldErrors?.school?.message && (
                  <p className="mt-1 text-xs text-red-500">
                    {fieldErrors.school.message as string}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor={`student-${index}-phone`} className="sr-only">
                  연락처
                </label>
                <Input
                  id={`student-${index}-phone`}
                  {...register(`students.${index}.phone`, {
                    onChange: (event) =>
                      handlePhoneChange(index, "phone", event.target.value),
                  })}
                  placeholder="연락처"
                  disabled={isLocked}
                  className="h-14 rounded-[12px] border-[#d6d9e0] text-[16px] placeholder:text-[#8b90a3]"
                />
                {fieldErrors?.phone?.message && (
                  <p className="mt-1 text-xs text-red-500">
                    {fieldErrors.phone.message as string}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor={`student-${index}-parentPhone`}
                  className="sr-only"
                >
                  학부모 연락처
                </label>
                <Input
                  id={`student-${index}-parentPhone`}
                  {...register(`students.${index}.parentPhone`, {
                    onChange: (event) =>
                      handlePhoneChange(
                        index,
                        "parentPhone",
                        event.target.value
                      ),
                  })}
                  placeholder="학부모 연락처"
                  disabled={isLocked}
                  className="h-14 rounded-[12px] border-[#d6d9e0] text-[16px] placeholder:text-[#8b90a3]"
                />
                {fieldErrors?.parentPhone?.message && (
                  <p className="mt-1 text-xs text-red-500">
                    {fieldErrors.parentPhone.message as string}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor={`student-${index}-registrationDate`}
                  className="sr-only"
                >
                  등록 날짜
                </label>
                <DatePickerField
                  control={form.control}
                  name={
                    `students.${index}.registrationDate` as Path<LectureFormInput>
                  }
                  placeholder="등록 날짜"
                  disabled={isLocked}
                />
                {fieldErrors?.registrationDate?.message && (
                  <p className="mt-1 text-xs text-red-500">
                    {fieldErrors.registrationDate.message as string}
                  </p>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
