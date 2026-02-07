"use client";

import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Card, CardContent } from "@/components/ui/card";
import { InputForm } from "@/components/common/input/InputForm";
import { TextareaForm } from "@/components/common/input/TextareaForm";
import { VideoFormData } from "@/types/materials.type";
import { videoFormSchema } from "@/validation/materials.validation";
import { getVideoFormDefaults } from "@/constants/materials.default";
import { getYoutubeVideoId } from "@/utils/youtubeLink";

type VideoTypeFormProps = {
  onDataChange?: (data: VideoFormData, isValid: boolean) => void;
  userName: string;
};

export default function VideoTypeForm({
  onDataChange,
  userName,
}: VideoTypeFormProps) {
  const {
    register,
    control,
    getValues,
    formState: { errors, isValid },
  } = useForm<VideoFormData>({
    resolver: zodResolver(videoFormSchema),
    mode: "onChange",
    defaultValues: getVideoFormDefaults(),
  });

  const youtubeLink = useWatch({ control, name: "youtubeLink" });
  const videoId = getYoutubeVideoId(youtubeLink || "");

  useEffect(() => {
    const formData = getValues();
    onDataChange?.(formData, isValid);
  }, [youtubeLink, isValid, getValues, onDataChange]);

  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        <div>
          <h3 className="font-semibold text-lg mb-2">동영상 강의 등록</h3>
          <p className="text-sm text-muted-foreground">
            동영상 강의를 YouTube 링크로 등록합니다.
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

          <InputForm
            label="YouTube 링크"
            id="youtubeLink"
            error={errors.youtubeLink?.message}
            {...register("youtubeLink")}
          />

          {videoId && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">미리보기</p>
              <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black">
                <iframe
                  src={`https://www.youtube.com/embed/${videoId}`}
                  title="YouTube video preview"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute top-0 left-0 w-full h-full"
                />
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
