"use client";

import { useForm, useWatch } from "react-hook-form";
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";

import { InputForm } from "@/components/common/input/InputForm";
import { phoneNumberFormatter } from "@/utils/phone";
import { useParentPhoneStore } from "@/stores/registered.store";
import { ParentPhoneFormData } from "@/types/auth.type";
import { parentPhoneSchema } from "@/validation/auth.validation";

export default function ParentPhoneForm() {
  const { setParentPhone, setParentPhoneValid } = useParentPhoneStore();

  const {
    register,
    setValue,
    control,
    clearErrors,
    formState: { errors, isValid },
  } = useForm<ParentPhoneFormData>({
    resolver: zodResolver(parentPhoneSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: { parentPhoneNumber: "" },
  });

  const parentPhoneNumber = useWatch({ control, name: "parentPhoneNumber" });

  useEffect(() => {
    setParentPhone({ parentPhoneNumber });
    setParentPhoneValid(isValid);
  }, [parentPhoneNumber, isValid, setParentPhone, setParentPhoneValid]);

  return (
    <InputForm
      id="parentPhoneNumber"
      label="학부모 전화번호"
      type="tel"
      error={errors.parentPhoneNumber?.message}
      {...register("parentPhoneNumber", {
        onChange: (e) => {
          const formatted = phoneNumberFormatter(e.target.value);
          setValue("parentPhoneNumber", formatted);
        },
      })}
      showReset={!!parentPhoneNumber}
      onReset={() => {
        setValue("parentPhoneNumber", "");
        clearErrors("parentPhoneNumber");
      }}
    />
  );
}
