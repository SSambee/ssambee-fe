"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";

import { Card, CardContent } from "@/components/ui/card";
import { InputForm } from "@/components/common/input/InputForm";
import { TextareaForm } from "@/components/common/input/TextareaForm";
import FileUploadField from "@/components/common/input/FileUploadField";
import { OtherFormData, FormMode, Materials } from "@/types/materials.type";
import { otherFormSchema } from "@/validation/materials.validation";
import { getOtherFormDefaults } from "@/constants/materials.default";

type OtherTypeFormProps = {
  mode?: FormMode;
  initialData?: Materials;
  onDataChange?: (data: OtherFormData, isValid: boolean) => void;
  userName: string;
};

export default function OtherTypeForm({
  mode = "create",
  initialData,
  onDataChange,
  userName,
}: OtherTypeFormProps) {
  const isDisabled = mode === "view";
  const [imageFile, setImageFile] = useState<File | null>(null);

  const {
    register,
    setValue,
    control,
    getValues,
    formState: { errors, isValid },
  } = useForm<OtherFormData>({
    resolver: mode === "view" ? undefined : zodResolver(otherFormSchema),
    mode: "onChange",
    defaultValues: initialData
      ? {
          title: initialData.title,
          writer: userName,
          className: initialData.className || "",
          description: initialData.description,
          image: initialData.image instanceof File ? initialData.image : null,
        }
      : { ...getOtherFormDefaults(), writer: userName },
  });

  const handleImageChange = (file: File | null) => {
    setImageFile(file); // 미리보기용 로컬 상태 업데이트
    setValue("image", file, { shouldValidate: true }); // react-hook-form 상태 업데이트 (실제 전송용)
  };

  const watchedValues = useWatch({ control });

  useEffect(() => {
    if (mode !== "view") {
      const formData = getValues();
      onDataChange?.(formData, isValid);
    }
  }, [watchedValues, isValid, getValues, onDataChange, mode]);

  /**
   * [실제 서비스용 로직]
   * 1. 사용자가 파일을 새로 올렸으면 Blob URL 생성
   * 2. 없으면 기존 DB에 있던 이미지 URL 사용
   * 3. 컴포넌트가 사라지거나 파일이 바뀌면 메모리에서 삭제
   */
  const displayImageUrl = useMemo(() => {
    if (imageFile) {
      const blobUrl = URL.createObjectURL(imageFile);
      // 클린업 함수를 대신할 방법이 없으므로 useEffect에서 관리하거나
      // 아래와 같이 처리 후 나중에 revoke 시점을 관리합니다.
      return blobUrl;
    }
    if (typeof initialData?.image === "string") {
      return initialData.image;
    }
    return null;
  }, [imageFile, initialData?.image]);

  // 메모리 누수 방지를 위한 가비지 컬렉션
  useEffect(() => {
    return () => {
      if (displayImageUrl && displayImageUrl.startsWith("blob:")) {
        URL.revokeObjectURL(displayImageUrl);
      }
    };
  }, [displayImageUrl]);

  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        <div>
          <h3 className="font-semibold text-lg mb-2">
            {mode === "create" ? "기타 자료 등록" : "기타 자료"}
          </h3>
          <p className="text-sm text-muted-foreground">
            {mode === "create"
              ? "이미지 등의 자료를 업로드합니다."
              : mode === "view"
                ? "기타 자료 정보를 확인합니다."
                : "기타 자료 정보를 수정합니다."}
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
              label="이미지"
              file={imageFile}
              onFileChange={handleImageChange}
              accept="image/*"
              error={errors.image?.message as string}
              showPreview={true}
            />
          )}

          {isDisabled && displayImageUrl && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                이미지
              </label>
              <div className="border rounded-lg p-4 bg-gray-50">
                <Image
                  src={displayImageUrl!}
                  alt={initialData?.title || "이미지"}
                  width={400}
                  height={300}
                  className="max-w-full h-auto max-h-[300px] rounded-lg object-contain"
                  // blob URL일 때는 Next.js 서버 최적화 건너뜀뜀
                  unoptimized={displayImageUrl.startsWith("blob:")}
                />
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
