import { useEffect, useRef, useState } from "react";
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
import { useModal } from "@/app/providers/ModalProvider";

type ProfileEditModalProps = {
  profile: Profile;
  onSubmit: (data: ProfileUpdateFormData) => void;
};

export function ProfileEditModal({ profile, onSubmit }: ProfileEditModalProps) {
  const { isOpen, closeModal } = useModal();
  const [isEditMode, setIsEditMode] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    control,
    reset,
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

  useEffect(() => {
    if (!isOpen) return;

    reset({
      name: profile.name,
      email: profile.email,
      subjects: profile.subjects,
      academyName: profile.academyName,
      bio: profile.bio,
    });
  }, [
    isOpen,
    profile.name,
    profile.email,
    profile.subjects,
    profile.academyName,
    profile.bio,
    reset,
  ]);

  const onInternalSubmit = (data: ProfileUpdateFormData) => {
    onSubmit({
      ...data,
      email: profile.email,
      imageFile: imageFile,
    });
  };

  const handleClose = () => {
    setIsEditMode(false);
    setPreviewImage(null);
    setImageFile(null);
    closeModal();
  };

  const handleImageClick = () => {
    if (!isEditMode) return;
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
    <Dialog open={isOpen}>
      <DialogContent
        className="w-[calc(100vw-32px)] max-h-[88vh] max-w-[860px] gap-0 overflow-y-auto rounded-[24px] border-0 bg-white p-0 shadow-[0_0_14px_rgba(138,138,138,0.16)]"
        showClose={false}
        onPointerDownOutside={(event) => event.preventDefault()}
        onFocusOutside={(event) => event.preventDefault()}
        onInteractOutside={(event) => event.preventDefault()}
        onEscapeKeyDown={(event) => event.preventDefault()}
      >
        <DialogHeader className="gap-2 border-b border-[#e9ebf0] px-6 pb-5 pt-6 sm:px-8">
          <DialogTitle className="text-[24px] font-bold leading-8 tracking-[-0.02em] text-[#040405]">
            프로필 수정
          </DialogTitle>
          <DialogDescription className="text-[18px] font-medium leading-[26px] tracking-[-0.02em] text-[rgba(22,22,27,0.4)]">
            프로필을 최신 정보로 수정하세요.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(onInternalSubmit)}
          className="space-y-6 px-6 pb-6 pt-6 sm:px-8 sm:pb-8"
        >
          <div className="rounded-[16px] border border-[#e9ebf0] bg-[#f7f8fa] px-4 py-5 sm:px-6">
            <div className="flex justify-center">
              <div className="relative">
                <Avatar className="size-24 border-[1.5px] border-[#f4f6fa]">
                  <AvatarImage
                    src={previewImage || profile.image || undefined}
                    alt={profile.name}
                  />
                  <AvatarFallback className="bg-[#f4f6fa] text-2xl text-[#8b90a3]">
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
                  disabled={!isEditMode}
                  className="absolute bottom-0 right-0 h-9 w-9 rounded-full border-2 border-white bg-[#3863f6] p-0 text-white shadow-[0_0_14px_rgba(138,138,138,0.08)] hover:bg-[#2f57e8] disabled:bg-[#d6d9e0] disabled:text-white/80"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-2 grid grid-cols-1 gap-4 md:grid-cols-2">
            <InputForm
              id="name"
              label="이름 *"
              {...register("name")}
              disabled={!isEditMode}
              error={errors.name?.message}
              showReset={(formValues.name?.length ?? 0) > 0}
              onReset={() => setValue("name", "")}
              className="h-14 rounded-[12px] border-[#d6d9e0] bg-white px-4 text-[16px] font-medium leading-6 tracking-[-0.16px] text-[#2b2e3a] focus:border-[#d6d9e0] focus:ring-0"
            />
            <InputForm
              id="email"
              type="email"
              label="이메일 *"
              {...register("email")}
              disabled
              error={errors.email?.message}
              showReset={false}
              onReset={() => setValue("email", "")}
              className="h-14 rounded-[12px] border-[#d6d9e0] bg-[#f7f8fa] px-4 text-[16px] font-medium leading-6 tracking-[-0.16px] text-[#8b90a3] focus:ring-0"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <InputForm
              id="academyName"
              label="소속 학원명"
              {...register("academyName")}
              disabled={!isEditMode}
              showReset={(formValues.academyName?.length ?? 0) > 0}
              onReset={() => setValue("academyName", "")}
              className="h-14 rounded-[12px] border-[#d6d9e0] bg-white px-4 text-[16px] font-medium leading-6 tracking-[-0.16px] text-[#2b2e3a] focus:border-[#d6d9e0] focus:ring-0"
            />
          </div>

          <InputForm
            id="bio"
            label="한 줄 소개"
            {...register("bio")}
            disabled={!isEditMode}
            showReset={(formValues.bio?.length ?? 0) > 0}
            onReset={() => setValue("bio", "")}
            className="h-14 rounded-[12px] border-[#d6d9e0] bg-white px-4 text-[16px] font-medium leading-6 tracking-[-0.16px] text-[#2b2e3a] focus:border-[#d6d9e0] focus:ring-0"
          />

          {!isEditMode ? (
            <p className="rounded-[12px] border border-[#e9ebf0] bg-[#f7f8fa] px-4 py-3 text-[14px] font-medium leading-5 tracking-[-0.02em] text-[#6b6f80]">
              저장된 정보입니다. 수정하려면 아래에서 수정하기를 눌러주세요.
            </p>
          ) : null}

          <DialogFooter className="mt-6 flex w-full flex-row gap-2.5 border-t border-[#e9ebf0] pt-6 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="h-[46px] flex-1 rounded-[10px] border-0 bg-[#e1e7fe] px-7 text-[14px] font-semibold leading-5 tracking-[-0.02em] text-[#3863f6] shadow-[0_0_14px_rgba(138,138,138,0.08)] hover:bg-[#d5defe] sm:flex-none"
            >
              취소
            </Button>
            {isEditMode ? (
              <Button
                type="submit"
                className="h-[46px] flex-1 rounded-[10px] bg-[#3863f6] px-7 text-[14px] font-semibold leading-5 tracking-[-0.02em] text-white shadow-[0_0_14px_rgba(138,138,138,0.08)] hover:bg-[#2f57e8] sm:flex-none"
              >
                변경 사항 저장
              </Button>
            ) : (
              <Button
                type="button"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  setIsEditMode(true);
                }}
                className="h-[46px] flex-1 rounded-[10px] bg-[#3863f6] px-7 text-[14px] font-semibold leading-5 tracking-[-0.02em] text-white shadow-[0_0_14px_rgba(138,138,138,0.08)] hover:bg-[#2f57e8] sm:flex-none"
              >
                수정하기
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
