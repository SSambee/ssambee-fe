"use client";

import { useEffect, useRef } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { InputForm } from "@/components/common/input/InputForm";
import { TextareaForm } from "@/components/common/input/TextareaForm";
import FileUploadField from "@/components/common/input/FileUploadField";
import { RequestFormData, FormMode, Materials } from "@/types/materials.type";
import { requestFormSchema } from "@/validation/materials.validation";
import { getRequestFormDefaults } from "@/constants/materials.default";
import { decodeUtf8 } from "@/utils/decodeUtf";

type RequestTypeFormProps = {
  mode?: FormMode;
  initialData?: Materials;
  onDataChange?: (data: RequestFormData, isValid: boolean) => void;
  userName: string;
};

export default function RequestTypeForm({
  mode = "create",
  initialData,
  onDataChange,
  userName,
}: RequestTypeFormProps) {
  const isDisabled = mode === "view";

  const {
    register,
    setValue,
    control,
    getValues,
    formState: { errors, isValid },
    reset,
  } = useForm<RequestFormData>({
    resolver: mode === "view" ? undefined : zodResolver(requestFormSchema),
    mode: "onChange",
    defaultValues: initialData
      ? {
          title: initialData.title,
          writer: initialData?.writer ? initialData.writer : userName,
          description: initialData.description,
          file: initialData.file || null,
          driveLink: initialData.externalDownloadUrl || "",
        }
      : { ...getRequestFormDefaults(), writer: userName },
  });

  // 모든 폼 필드 실시간 추적
  const watchedValues = useWatch({ control });

  const file = watchedValues.file;

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
        driveLink: initialData.link || "",
      });
    }
  }, [mode, initialData, userName, reset]);

  return (
    <div
      className={`space-y-4 border rounded-[20px] bg-white ${mode !== "create" ? "shadow-sm p-10" : "px-[24px] py-[16px]"}`}
    >
      <div className="py-4">
        <h3
          className={`font-semibold text-label-neutral ${mode !== "create" ? "text-[20px]" : "text-[18px]"}`}
        >
          {mode === "create" ? "요청 자료 등록" : "요청 자료"}
        </h3>
        <p
          className={`text-muted-foreground ${mode !== "create" ? "text-[18px]" : "text-sm"}`}
        >
          {mode === "create"
            ? "강사가 조교에게 전달할 업무 자료입니다."
            : mode === "view"
              ? "요청 자료 정보를 확인합니다."
              : "요청 자료 정보를 수정합니다."}
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
            label="첨부 파일"
            file={file}
            onFileChange={(file) =>
              setValue("file", file, { shouldValidate: true })
            }
            accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsm,.xlsx,.hwp,.hwpx,image/*"
            error={errors.file?.message as string}
          />
        )}

        {isDisabled && initialData?.file && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              첨부 파일
            </label>
            <div className="border border-neutral-200 rounded-[12px] h-[58px] px-4 bg-white flex items-center">
              <p className="text-sm text-gray-900">
                {decodeUtf8(initialData.file.name)}
              </p>
            </div>
          </div>
        )}

        <div className="relative space-y-2">
          {!isDisabled ? (
            <InputForm
              label="구글 드라이브 링크 (선택)"
              id="driveLink"
              error={errors.driveLink?.message}
              {...register("driveLink")}
            />
          ) : (
            initialData?.externalDownloadUrl && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  구글 드라이브 링크
                </label>
                <div className="border rounded-[12px] p-3 bg-white border-neutral-200 flex items-center justify-between">
                  <span className="text-sm truncate mr-4">
                    {initialData.externalDownloadUrl}
                  </span>
                  <a
                    href={initialData.externalDownloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-10 px-4 rounded-xl bg-[#3863f6] hover:bg-[#2f57e8] text-white text-sm font-semibold transition-colors shrink-0 flex items-center justify-center cursor-pointer"
                  >
                    링크 이동
                  </a>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
