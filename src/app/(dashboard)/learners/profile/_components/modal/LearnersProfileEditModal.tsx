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

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    control,
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

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>프로필 수정</DialogTitle>
          <DialogDescription>
            프로필 정보를 최신 상태로 유지하세요.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
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
              disabled
              error={errors.email?.message}
              showReset={false}
              onReset={() => setValue("email", "")}
            />
          </div>

          {profile.userType === "STUDENT" ? (
            <>
              <div className="grid grid-cols-2 gap-4">
                <InputForm
                  id="school"
                  label="학교"
                  {...register("school")}
                  error={errors.school?.message}
                  showReset={(formValues.school?.length ?? 0) > 0}
                  onReset={() => setValue("school", "")}
                />

                <InputForm
                  id="schoolYear"
                  label="학년"
                  {...register("schoolYear")}
                  error={errors.schoolYear?.message}
                  showReset={(formValues.schoolYear?.length ?? 0) > 0}
                  onReset={() => setValue("schoolYear", "")}
                />
              </div>

              <InputForm
                id="parentPhoneNumber"
                label="학부모 연락처"
                {...register("parentPhoneNumber")}
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
              />
            </>
          ) : (
            <p className="text-sm text-neutral-500">
              학부모 계정은 이름만 수정할 수 있습니다.
            </p>
          )}

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
