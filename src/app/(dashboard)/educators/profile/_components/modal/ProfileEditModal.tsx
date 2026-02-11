import { useState, useRef } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Camera } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { InputForm } from "@/components/common/input/InputForm";
import {
  profileUpdateSchema,
  type ProfileUpdateFormData,
} from "@/validation/profile.validation";
import type { Profile } from "@/types/profile.type";
import { useModal } from "@/providers/ModalProvider";

type ProfileEditModalProps = {
  profile: Profile;
  onSubmit: (data: ProfileUpdateFormData) => void;
};

export function ProfileEditModal({ profile, onSubmit }: ProfileEditModalProps) {
  const { isOpen, closeModal } = useModal();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    control,
  } = useForm<ProfileUpdateFormData>({
    resolver: zodResolver(profileUpdateSchema),
    mode: "onChange",
    defaultValues: {
      name: profile.name,
      email: profile.email,
      subjects: profile.subjects,
      academyName: profile.academyName,
      bio: profile.bio,
    },
  });

  const formValues = useWatch({ control });

  const onInternalSubmit = (data: ProfileUpdateFormData) => {
    onSubmit({
      ...data,
      imageFile: imageFile,
    });
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
      // TODO: API 연동 - 이미지 업로드
      setImageFile(file);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>프로필 수정</DialogTitle>
          <DialogDescription>
            프로필을 최신 정보로 수정하세요.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onInternalSubmit)} className="space-y-6">
          <div className="flex justify-center">
            <div className="relative">
              <Avatar className="size-24 border-2 border-neutral-50">
                <AvatarImage
                  src={previewImage || profile.image || undefined}
                  alt={profile.name}
                />
                <AvatarFallback className="bg-neutral-50 text-2xl text-neutral-400">
                  {profile.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
              <Button
                type="button"
                onClick={handleImageClick}
                className="absolute bottom-0 right-0 h-8 w-8 rounded-full border-2 border-white shadow-md p-0 cursor-pointer"
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-20">
            <InputForm
              id="name"
              label="이름 *"
              {...register("name")}
              error={errors.name?.message}
              showReset={(formValues.name?.length ?? 0) > 0}
              onReset={() => setValue("name", "")}
            />
            <InputForm
              id="email"
              type="email"
              label="이메일 *"
              {...register("email")}
              error={errors.email?.message}
              showReset={(formValues.email?.length ?? 0) > 0}
              onReset={() => setValue("email", "")}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <InputForm
              id="academyName"
              label="소속 학원명"
              {...register("academyName")}
              showReset={(formValues.academyName?.length ?? 0) > 0}
              onReset={() => setValue("academyName", "")}
            />
          </div>

          <InputForm
            id="bio"
            label="한 줄 소개"
            {...register("bio")}
            showReset={(formValues.bio?.length ?? 0) > 0}
            onReset={() => setValue("bio", "")}
          />

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={closeModal}
              className="cursor-pointer"
            >
              취소
            </Button>
            <Button type="submit" className="cursor-pointer">
              변경 사항 저장
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
