"use client";

import { useEffect, useState, useRef } from "react";
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
import { materialsService } from "@/services/materials.service";

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
  const [displayImageUrl, setDisplayImageUrl] = useState<string | null>(null);
  const [imageRemoved, setImageRemoved] = useState(false);

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
          writer: initialData?.writer ? initialData.writer : userName,
          className: initialData.className || "",
          description: initialData.description,
          image: null,
        }
      : { ...getOtherFormDefaults(), writer: userName },
  });

  const handleImageChange = (file: File | null) => {
    setImageFile(file);
    setValue("image", file, { shouldValidate: true });
    // 파일이 제거되면 미리보기 URL도 초기화
    if (file === null) {
      // 이미지를 제거한 경우
      setImageRemoved(true);
      setDisplayImageUrl(null);
    } else {
      // 이미지를 추가한 경우
      setImageRemoved(false);
    }
  };

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

  // 이미지 URL 생성 및 업데이트
  useEffect(() => {
    let isMounted = true;
    let objectUrl: string | null = null;

    const updateImageUrl = async () => {
      // 새로 선택한 이미지 파일이 있는 경우
      if (imageFile) {
        objectUrl = URL.createObjectURL(imageFile);
        if (isMounted) {
          setDisplayImageUrl(objectUrl);
          return;
        }
      }
      if (initialData?.id && !imageRemoved) {
        // 삭제하지 않았다면 기존 이미지
        try {
          const response = await materialsService.getDownloadUrl(
            initialData.id
          );
          if (isMounted) {
            setDisplayImageUrl(response.data.url);
          }
        } catch (err) {
          console.error("이미지 URL 가져오기 실패:", err);
          if (isMounted) {
            setDisplayImageUrl(null);
          }
        }
      } else {
        if (isMounted) {
          setDisplayImageUrl(null);
        }
      }
    };

    updateImageUrl();

    return () => {
      isMounted = false;
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [imageFile, initialData?.id, imageRemoved]);

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
              externalPreviewUrl={displayImageUrl}
            />
          )}

          {isDisabled && displayImageUrl && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                이미지
              </label>
              <div className="border rounded-lg p-4 bg-gray-50">
                <Image
                  src={displayImageUrl}
                  alt={initialData?.title || "이미지"}
                  width={400}
                  height={300}
                  unoptimized={true}
                  className="max-w-full h-auto max-h-[300px] rounded-lg object-contain"
                />
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
