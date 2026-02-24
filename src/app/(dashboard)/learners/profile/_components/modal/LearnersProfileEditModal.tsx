import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
import { useModal } from "@/providers/ModalProvider";
import { formatPhoneNumber } from "@/utils/phone";
import {
  learnersProfileUpdateSchema,
  type LearnersProfileUpdateFormData,
} from "@/validation/learners-profile.validation";
import type { LearnerProfile } from "@/types/learners-profile.type";

type LearnersProfileEditModalProps = {
  profile: LearnerProfile;
  onSubmit: (data: LearnersProfileUpdateFormData) => void;
};

export function LearnersProfileEditModal({
  profile,
  onSubmit,
}: LearnersProfileEditModalProps) {
  const { isOpen, closeModal } = useModal();
  const [isEditMode, setIsEditMode] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    control,
    reset,
  } = useForm<LearnersProfileUpdateFormData>({
    resolver: zodResolver(learnersProfileUpdateSchema),
    mode: "onChange",
    defaultValues: {
      name: profile.name,
      email: profile.email,
      school: profile.userType === "STUDENT" ? profile.school : undefined,
      schoolYear:
        profile.userType === "STUDENT" ? profile.schoolYear : undefined,
      parentPhoneNumber:
        profile.userType === "STUDENT" ? profile.parentPhone : undefined,
    },
  });

  const formValues = useWatch({ control });

  useEffect(() => {
    if (!isOpen) return;

    reset({
      name: profile.name,
      email: profile.email,
      school: profile.userType === "STUDENT" ? profile.school : undefined,
      schoolYear:
        profile.userType === "STUDENT" ? profile.schoolYear : undefined,
      parentPhoneNumber:
        profile.userType === "STUDENT" ? profile.parentPhone : undefined,
    });
  }, [
    isOpen,
    profile.name,
    profile.email,
    profile.school,
    profile.schoolYear,
    profile.parentPhone,
    profile.userType,
    reset,
  ]);

  const handleClose = () => {
    setIsEditMode(false);
    closeModal();
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
            프로필 정보를 최신 상태로 유지하세요.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 px-6 pb-6 pt-6 sm:px-8 sm:pb-8"
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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

          {profile.userType === "STUDENT" ? (
            <>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <InputForm
                  id="school"
                  label="학교"
                  {...register("school")}
                  disabled={!isEditMode}
                  error={errors.school?.message}
                  showReset={(formValues.school?.length ?? 0) > 0}
                  onReset={() => setValue("school", "")}
                  className="h-14 rounded-[12px] border-[#d6d9e0] bg-white px-4 text-[16px] font-medium leading-6 tracking-[-0.16px] text-[#2b2e3a] focus:border-[#d6d9e0] focus:ring-0"
                />

                <InputForm
                  id="schoolYear"
                  label="학년"
                  {...register("schoolYear")}
                  disabled={!isEditMode}
                  error={errors.schoolYear?.message}
                  showReset={(formValues.schoolYear?.length ?? 0) > 0}
                  onReset={() => setValue("schoolYear", "")}
                  className="h-14 rounded-[12px] border-[#d6d9e0] bg-white px-4 text-[16px] font-medium leading-6 tracking-[-0.16px] text-[#2b2e3a] focus:border-[#d6d9e0] focus:ring-0"
                />
              </div>

              <InputForm
                id="parentPhoneNumber"
                label="학부모 연락처"
                {...register("parentPhoneNumber")}
                disabled={!isEditMode}
                error={errors.parentPhoneNumber?.message}
                onChange={(event) => {
                  const formatted = formatPhoneNumber(event.target.value);
                  setValue("parentPhoneNumber", formatted, {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                }}
                showReset={(formValues.parentPhoneNumber?.length ?? 0) > 0}
                onReset={() =>
                  setValue("parentPhoneNumber", "", {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
                className="h-14 rounded-[12px] border-[#d6d9e0] bg-white px-4 text-[16px] font-medium leading-6 tracking-[-0.16px] text-[#2b2e3a] focus:border-[#d6d9e0] focus:ring-0"
              />
            </>
          ) : (
            <p className="rounded-[12px] border border-[#e9ebf0] bg-[#f7f8fa] px-4 py-3 text-[14px] font-medium leading-5 tracking-[-0.02em] text-[#6b6f80]">
              학부모 계정은 이름만 수정할 수 있습니다.
            </p>
          )}

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
