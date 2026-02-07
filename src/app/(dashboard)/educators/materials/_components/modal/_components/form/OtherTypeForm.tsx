"use client";

import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Card, CardContent } from "@/components/ui/card";
import { InputForm } from "@/components/common/input/InputForm";
import { TextareaForm } from "@/components/common/input/TextareaForm";
import FileUploadField from "@/components/common/input/FileUploadField";
import { OtherFormData } from "@/types/materials.type";
import { otherFormSchema } from "@/validation/materials.validation";
import { getOtherFormDefaults } from "@/constants/materials.default";

type OtherTypeFormProps = {
  onDataChange?: (data: OtherFormData, isValid: boolean) => void;
  userName: string;
};

export default function OtherTypeForm({
  onDataChange,
  userName,
}: OtherTypeFormProps) {
  const {
    register,
    setValue,
    control,
    getValues,
    formState: { errors, isValid },
  } = useForm<OtherFormData>({
    resolver: zodResolver(otherFormSchema),
    mode: "onChange",
    defaultValues: getOtherFormDefaults(),
  });

  const file = useWatch({ control, name: "file" });

  useEffect(() => {
    const formData = getValues();
    onDataChange?.(formData, isValid);
  }, [file, isValid, getValues, onDataChange]);

  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        <div>
          <h3 className="font-semibold text-lg mb-2">기타 자료 등록</h3>
          <p className="text-sm text-muted-foreground">
            시험지, 동영상, 전달 업무 자료 외의 자료입니다.
          </p>
        </div>

        <div className="space-y-4">
          <InputForm
            label="제목"
            id="title"
            error={errors.title?.message}
            {...register("title")}
          />

          <div className="flex flex-row gap-2">
            <InputForm
              label="클래스명"
              id="className"
              error={errors.className?.message}
              {...register("className")}
            />

            <InputForm
              label="등록자"
              id="writer"
              disabled
              className="bg-gray-50"
              value={userName}
              readOnly
            />
          </div>

          <TextareaForm
            label="세부 내용"
            id="description"
            error={errors.description?.message}
            {...register("description")}
          />

          <FileUploadField
            label="첨부 파일"
            file={file}
            onFileChange={(file) =>
              setValue("file", file, { shouldValidate: true })
            }
            accept="*"
            showPreview={true}
            error={errors.file?.message as string}
          />
        </div>
      </CardContent>
    </Card>
  );
}
