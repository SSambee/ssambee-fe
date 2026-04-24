"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";

import { SCHOOL_INFO_FORM_DEFAULTS } from "@/constants/auth.defaults";
import { useSchoolStore } from "@/stores/registered.store";
import { schoolInfoSchema } from "@/validation/auth.validation";
import { SchoolInfoFormData } from "@/types/auth.type";
import SelectBtn from "@/components/common/button/SelectBtn";
import { GRADE_SELECTING_OPTIONS } from "@/constants/students.default";
import { InputForm } from "@/components/common/input/InputForm";

export default function SchoolInfoForm() {
  const { setSchoolInfo, setSchoolInfoValid } = useSchoolStore();

  const {
    register,
    setValue,
    control,
    clearErrors,
    formState: { errors, isValid },
  } = useForm<SchoolInfoFormData>({
    mode: "onChange",
    resolver: zodResolver(schoolInfoSchema),
    reValidateMode: "onChange",
    defaultValues: SCHOOL_INFO_FORM_DEFAULTS,
  });

  const school = useWatch({ control, name: "school" });
  const schoolYear = useWatch({ control, name: "schoolYear" });

  // 값이 바뀔 때마다 store에 반영
  useEffect(() => {
    setSchoolInfo({
      school,
      schoolYear,
    });
    setSchoolInfoValid(isValid);
  }, [school, schoolYear, isValid, setSchoolInfo, setSchoolInfoValid]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-[10px]">
        <InputForm
          id="school"
          label="학교"
          type="text"
          error={errors.school?.message}
          {...register("school")}
          showReset={!!school}
          onReset={() => {
            setValue("school", "");
            clearErrors("school");
          }}
        />

        <div>
          <label
            htmlFor="schoolYear"
            className="sr-only block text-sm font-medium text-gray-700 mb-2"
          >
            학년
          </label>

          <SelectBtn
            id="schoolYear"
            value={schoolYear}
            placeholder="학년"
            options={GRADE_SELECTING_OPTIONS}
            onChange={(value) =>
              setValue("schoolYear", value, {
                shouldValidate: true,
                shouldDirty: true,
              })
            }
            className={`w-full h-[58px] border rounded-lg ${
              errors.schoolYear
                ? "border-red-600 focus:ring-red-500"
                : "border-gray-300 focus:ring-blue-500"
            }`}
          />

          {errors.schoolYear && (
            <p id="schoolYear-error" className="mt-1 text-sm text-red-600">
              {errors.schoolYear.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
