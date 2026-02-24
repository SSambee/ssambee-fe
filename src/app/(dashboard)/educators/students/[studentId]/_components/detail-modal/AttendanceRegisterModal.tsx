import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModal } from "@/providers/ModalProvider";
import {
  AttendanceRegisterFormData,
  AttendanceStatus,
} from "@/types/students.type";
import { AttendanceRegisterSchema } from "@/validation/students.validation";
import {
  getAttendanceRegisterFormDefaults,
  ATTENDANCE_STATUS_OPTIONS,
} from "@/constants/students.default";
import SelectBtn from "@/components/common/button/SelectBtn";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCreateAttendance } from "@/hooks/useEnrollment";
import { useDialogAlert } from "@/hooks/useDialogAlert";

type AttendanceRegisterModalProps = {
  studentId: string;
  mainLectureId: string;
};

export default function AttendanceRegisterModal({
  studentId,
  mainLectureId,
}: AttendanceRegisterModalProps) {
  const { isOpen, closeModal } = useModal();
  const { showAlert } = useDialogAlert();

  // 개별 수강생 출결 등록
  const { mutate: createAttendance, isPending } = useCreateAttendance(
    mainLectureId,
    studentId
  );

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors, isValid },
  } = useForm<AttendanceRegisterFormData>({
    resolver: zodResolver(AttendanceRegisterSchema),
    mode: "onChange",
    defaultValues: getAttendanceRegisterFormDefaults(),
  });

  const status = useWatch({ control, name: "status" });

  const onSubmit = (data: AttendanceRegisterFormData) => {
    createAttendance(
      {
        date: data.date,
        status: data.status as AttendanceStatus,
        memo: data.memo,
      },
      {
        onSuccess: () => {
          reset();
          closeModal();
        },
        onError: async () => {
          await showAlert({ description: "출결 등록에 실패했습니다." });
        },
      }
    );
  };

  const handleClose = () => {
    reset();
    closeModal();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-[32px]">
        <DialogHeader>
          <DialogTitle className="text-[24px] font-bold text-label-normal">
            출결 등록
          </DialogTitle>
          <DialogDescription className="text-[18px] font-medium text-label-alternative">
            수업 출결 정보를 추가로 기록하세요.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4 border rounded-[20px] px-[24px] py-[16px] bg-surface-normal-light-alternative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date" className="text-muted-foreground">
                  수업 일자
                </Label>
                <Input
                  id="date"
                  type="date"
                  {...register("date")}
                  className="rounded-[12px] text-base px-4 h-[58px] w-full bg-white border border-neutral-200"
                />
                {errors.date && (
                  <p className="text-xs text-red-500">{errors.date.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="status" className="text-muted-foreground">
                  출결 상태
                </Label>
                <SelectBtn
                  id="status"
                  value={status}
                  placeholder="출결 상태"
                  optionSize="lg"
                  className="text-base px-4 h-[58px] w-full bg-white border border-neutral-200"
                  options={ATTENDANCE_STATUS_OPTIONS}
                  onChange={(value) =>
                    setValue("status", value, {
                      shouldValidate: true,
                      shouldDirty: true,
                    })
                  }
                />
                {errors.status && (
                  <p className="text-xs text-red-500">
                    {errors.status.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="memo" className="text-muted-foreground">
                메모
              </Label>
              <Textarea
                id="memo"
                {...register("memo")}
                placeholder="특이사항을 입력하세요."
                rows={4}
                className="text-base p-4 min-h-[130px] w-full rounded-[12px] bg-white border border-neutral-200 shadow-none"
              />
            </div>
          </div>

          <div className="flex gap-2 w-full justify-end">
            <Button
              className="cursor-pointer h-[48px] px-[28px] py-[12px] rounded-[12px] bg-white border border-neutral-200 hover:bg-neutral-50 text-label-normal shadow-none"
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isPending}
            >
              닫기
            </Button>
            <Button
              className={`cursor-pointer h-[48px] px-[28px] py-[12px] rounded-[12px] bg-brand-700 hover:bg-brand-800 text-white shadow-none ${!isValid || isPending ? "bg-neutral-200 text-neutral-500 cursor-not-allowed" : ""}`}
              type="submit"
              disabled={!isValid || isPending}
            >
              {isPending ? "등록 중..." : "등록"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
