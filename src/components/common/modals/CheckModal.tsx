"use client";

import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useModal } from "@/providers/ModalProvider";

type CheckModalProps = {
  title: string;
  description: string;
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
  hideCancel?: boolean;
  confirmDisabled?: boolean;
};

export const CheckModal = ({
  title,
  description,
  onConfirm,
  onCancel,
  confirmText = "확인",
  cancelText = "취소",
  hideCancel = false,
  confirmDisabled = false,
}: CheckModalProps) => {
  const { isOpen, closeModal } = useModal();
  const [isConfirming, setIsConfirming] = useState(false);

  const handleCancel = () => {
    onCancel?.();
    closeModal();
  };

  const handleConfirm = async () => {
    if (isConfirming) return;
    setIsConfirming(true);

    try {
      await onConfirm();
      closeModal();
    } catch (error) {
      console.error("확인 동작 실패:", error);
    } finally {
      setIsConfirming(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) handleCancel();
      }}
    >
      <DialogContent className="w-[calc(100vw-28px)] max-w-[424px] gap-0 rounded-[24px] border-0 bg-white px-7 py-7 shadow-[0_0_14px_rgba(138,138,138,0.16)] sm:px-8 sm:py-8">
        <DialogHeader className="items-center gap-2.5 p-0 text-center">
          <DialogTitle className="w-full text-[22px] font-semibold leading-[31px] tracking-[-0.22px] text-[#040405]">
            {title}
          </DialogTitle>
          <p className="w-full whitespace-pre-line text-[16px] font-medium leading-[24px] tracking-[-0.16px] text-[rgba(22,22,27,0.4)]">
            {description}
          </p>
        </DialogHeader>

        <DialogFooter className="mt-8 flex w-full flex-row justify-center gap-2.5 p-0">
          {!hideCancel ? (
            <Button
              variant="outline"
              className="h-[46px] flex-1 rounded-[10px] border-0 bg-[#e1e7fe] px-7 text-[14px] font-semibold leading-[20px] tracking-[-0.14px] text-[#3863f6] shadow-[0_0_14px_rgba(138,138,138,0.08)] hover:bg-[#d5defe]"
              onClick={handleCancel}
            >
              {cancelText}
            </Button>
          ) : null}

          <Button
            variant="default"
            className={`h-[46px] rounded-[10px] bg-[#3863f6] px-7 text-[14px] font-semibold leading-[20px] tracking-[-0.14px] text-white shadow-[0_0_14px_rgba(138,138,138,0.08)] hover:bg-[#2f57e8] ${hideCancel ? "max-w-[196px]" : "flex-1"}`}
            onClick={handleConfirm}
            disabled={confirmDisabled || isConfirming}
          >
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
