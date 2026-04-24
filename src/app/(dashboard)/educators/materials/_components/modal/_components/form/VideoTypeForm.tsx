"use client";

import { useEffect, useRef } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { InputForm } from "@/components/common/input/InputForm";
import { TextareaForm } from "@/components/common/input/TextareaForm";
import { VideoFormData, FormMode, Materials } from "@/types/materials.type";
import { videoFormSchema } from "@/validation/materials.validation";
import { getVideoFormDefaults } from "@/constants/materials.default";
import { getYoutubeVideoId } from "@/utils/youtubeLink";

type VideoTypeFormProps = {
  mode?: FormMode;
  initialData?: Materials;
  onDataChange?: (data: VideoFormData, isValid: boolean) => void;
  userName: string;
};

export default function VideoTypeForm({
  mode = "create",
  initialData,
  onDataChange,
  userName,
}: VideoTypeFormProps) {
  const isDisabled = mode === "view";

  const {
    register,
    getValues,
    control,
    formState: { errors, isValid },
    reset,
  } = useForm<VideoFormData>({
    resolver: mode === "view" ? undefined : zodResolver(videoFormSchema),
    mode: "onChange",
    defaultValues: initialData
      ? {
          title: initialData.title,
          writer: initialData?.writer ? initialData.writer : userName,
          description: initialData.description,
          link: initialData.link || "",
        }
      : { ...getVideoFormDefaults(), writer: userName },
  });

  // 모든 폼 필드 실시간 추적
  const watchedValues = useWatch({ control });

  const link = watchedValues.link ?? initialData?.link;
  const videoId = getYoutubeVideoId(link || "");

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
        link: initialData.link || "",
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
          {mode === "create" ? "동영상 강의 등록" : "동영상 강의"}
        </h3>
        <p
          className={`text-muted-foreground ${mode !== "create" ? "text-[18px]" : "text-sm"}`}
        >
          {mode === "create"
            ? "동영상 강의를 YouTube 링크로 등록합니다."
            : mode === "view"
              ? "동영상 강의 정보를 확인합니다."
              : "동영상 강의 정보를 수정합니다."}
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
          <InputForm
            label="YouTube 링크"
            id="link"
            error={errors.link?.message}
            disabled={isDisabled}
            {...register("link")}
          />

          {link && videoId && videoId.length > 0 && (
            <div className="relative w-full aspect-video rounded-[12px] overflow-hidden bg-black border border-neutral-200">
              <iframe
                src={`https://www.youtube.com/embed/${videoId}`}
                title="YouTube video preview"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute top-0 left-0 w-full h-full"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
