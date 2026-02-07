"use client";

import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Card, CardContent } from "@/components/ui/card";
import { InputForm } from "@/components/common/input/InputForm";
import { TextareaForm } from "@/components/common/input/TextareaForm";
import FileUploadField from "@/components/common/input/FileUploadField";
import { RequestFormData } from "@/types/materials.type";
import { requestFormSchema } from "@/validation/materials.validation";
import { getRequestFormDefaults } from "@/constants/materials.default";

type RequestTypeFormProps = {
  onDataChange?: (data: RequestFormData, isValid: boolean) => void;
};

export default function RequestTypeForm({
  onDataChange,
}: RequestTypeFormProps) {
  const {
    register,
    setValue,
    control,
    getValues,
    formState: { errors, isValid },
  } = useForm<RequestFormData>({
    resolver: zodResolver(requestFormSchema),
    mode: "onChange",
    defaultValues: getRequestFormDefaults(),
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
          <h3 className="font-semibold text-lg mb-2">요청 자료 등록</h3>
          <p className="text-sm text-muted-foreground">
            강사가 조교에게 전달할 업무 자료입니다.
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
              {...register("writer")}
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
            error={errors.file?.message as string}
          />

          <InputForm
            label="구글 드라이브 링크 (선택)"
            id="driveLink"
            error={errors.driveLink?.message}
            {...register("driveLink")}
          />
        </div>
      </CardContent>
    </Card>
  );
}
