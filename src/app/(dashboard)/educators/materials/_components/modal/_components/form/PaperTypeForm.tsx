"use client";

import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Card, CardContent } from "@/components/ui/card";
import { InputForm } from "@/components/common/input/InputForm";
import { TextareaForm } from "@/components/common/input/TextareaForm";
import FileUploadField from "@/components/common/input/FileUploadField";
import { PaperFormData, FormMode, Materials } from "@/types/materials.type";
import { paperFormSchema } from "@/validation/materials.validation";
import { getPaperFormDefaults } from "@/constants/materials.default";

type PaperTypeFormProps = {
  mode?: FormMode;
  initialData?: Materials;
  onDataChange?: (data: PaperFormData, isValid: boolean) => void;
  userName: string;
};

export default function PaperTypeForm({
  mode = "create",
  initialData,
  onDataChange,
  userName,
}: PaperTypeFormProps) {
  const isDisabled = mode === "view";

  const {
    register,
    setValue,
    control,
    getValues,
    formState: { errors, isValid },
  } = useForm<PaperFormData>({
    resolver: mode === "view" ? undefined : zodResolver(paperFormSchema),
    mode: "onChange",
    defaultValues: initialData
      ? {
          title: initialData.title,
          writer: initialData?.writer ? initialData.writer : userName,
          className: initialData.className || "",
          description: initialData.description,
          file: initialData.file || null,
        }
      : { ...getPaperFormDefaults(), writer: userName },
  });

  const watchedValues = useWatch({ control });

  useEffect(() => {
    if (mode !== "view") {
      const formData = getValues();
      onDataChange?.(formData, isValid);
    }
  }, [watchedValues, isValid, getValues, onDataChange, mode]);

  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        <div>
          <h3 className="font-semibold text-lg mb-2">
            {mode === "create" ? "시험지 등록" : "시험지"}
          </h3>
          <p className="text-sm text-muted-foreground">
            {mode === "create"
              ? "시험지/PDF 파일을 업로드합니다."
              : mode === "view"
                ? "시험지 정보를 확인합니다."
                : "시험지 정보를 수정합니다."}
          </p>
        </div>

        <div className="space-y-4">
          <InputForm
            label="제목"
            id="title"
            error={errors.title?.message}
            disabled={isDisabled}
            {...register("title")}
          />

          <div className="flex flex-row gap-2">
            <InputForm
              label="클래스명"
              id="className"
              error={errors.className?.message}
              disabled={isDisabled}
              {...register("className")}
            />

            <InputForm
              label="등록자"
              id="writer"
              readOnly
              className="bg-gray-50"
              {...register("writer")}
            />
          </div>

          <TextareaForm
            label="세부 내용"
            id="description"
            error={errors.description?.message}
            disabled={isDisabled}
            {...register("description")}
          />

          {!isDisabled && (
            <FileUploadField
              label="시험지 파일"
              file={watchedValues.file}
              onFileChange={(file) =>
                setValue("file", file, { shouldValidate: true })
              }
              accept=".pdf,.doc,.docx"
              error={errors.file?.message as string}
            />
          )}

          {isDisabled && watchedValues.file && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                첨부 파일
              </label>
              <div className="border rounded-lg p-4 bg-gray-50">
                <p className="text-sm text-gray-900">
                  {watchedValues.file.name}
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
