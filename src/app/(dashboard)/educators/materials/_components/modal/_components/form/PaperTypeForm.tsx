"use client";

import { useEffect, useRef } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { InputForm } from "@/components/common/input/InputForm";
import { TextareaForm } from "@/components/common/input/TextareaForm";
import FileUploadField from "@/components/common/input/FileUploadField";
import { PaperFormData, FormMode, Materials } from "@/types/materials.type";
import { paperFormSchema } from "@/validation/materials.validation";
import { getPaperFormDefaults } from "@/constants/materials.default";
import { decodeUtf8 } from "@/utils/decodeUtf";

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
    reset,
  } = useForm<PaperFormData>({
    resolver: mode === "view" ? undefined : zodResolver(paperFormSchema),
    mode: "onChange",
    defaultValues: initialData
      ? {
          title: initialData.title,
          writer: initialData?.writer ? initialData.writer : userName,
          description: initialData.description,
          file: initialData.file || null,
        }
      : { ...getPaperFormDefaults(), writer: userName },
  });

  const watchedValues = useWatch({ control });

  // onDataChange를 ref로 관리하여 의존성 배열에서 제외
  const onDataChangeRef = useRef(onDataChange);
  useEffect(() => {
    onDataChangeRef.current = onDataChange;
  }, [onDataChange]);

  useEffect(() => {
    if (mode !== "view" && onDataChangeRef.current) {
      // 다음 렌더링 사이클로 연기
      queueMicrotask(() => {
        onDataChangeRef.current?.(getValues(), isValid);
      });
    }
  }, [watchedValues, isValid, mode, getValues]);

  // mode가 view로 변경될 때 (취소 시) 폼 초기화
  useEffect(() => {
    if (mode === "view" && initialData) {
      reset({
        title: initialData.title,
        writer: initialData?.writer ? initialData.writer : userName,
        description: initialData.description,
        file: initialData.file || null,
      });
    }
  }, [mode, initialData, userName, reset]);

  return (
    <div className="space-y-4 border rounded-[20px] px-[24px] py-[16px] bg-white">
      <div>
        <h3 className="text-[18px] font-semibold text-label-neutral py-[11px]">
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

      <div className="space-y-4 pb-4">
        <div className="grid grid-cols-4 gap-2">
          <div className="col-span-3">
            <InputForm
              label="제목"
              id="title"
              error={errors.title?.message}
              disabled={isDisabled}
              {...register("title")}
            />
          </div>

          <div className="col-span-1">
            <InputForm
              label="등록자"
              id="writer"
              readOnly
              className="bg-white"
              {...register("writer")}
            />
          </div>
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
            accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsm,.xlsx,.hwp,.hwpx"
            error={errors.file?.message as string}
          />
        )}
        {isDisabled && initialData?.file && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              첨부 파일
            </label>
            <div className="border border-neutral-200 rounded-[12px] p-4 bg-white">
              <p className="text-sm text-gray-900">
                {decodeUtf8(initialData.file.name)}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
