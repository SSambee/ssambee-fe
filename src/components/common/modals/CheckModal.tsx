"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useModal } from "@/providers/ModalProvider";

type CheckModalProps = {
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
  hideCancel?: boolean;
};

export const CheckModal = ({
  title,
  description,
  onConfirm,
  onCancel,
  confirmText = "확인",
  cancelText = "취소",
  hideCancel = false,
}: CheckModalProps) => {
  const { isOpen, closeModal } = useModal();

  const handleCancel = () => {
    onCancel?.();
    closeModal();
  };

  const handleCloseOnly = () => {
    closeModal();
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) handleCancel();
      }}
    >
      <DialogContent className="max-w-md">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-xl font-bold">{title}</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground pt-2">
            {description}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="p-6 pt-2 flex flex-row justify-end gap-2">
          {!hideCancel ? (
            <Button
              variant="outline"
              className="cursor-pointer"
              onClick={handleCancel}
            >
              {cancelText}
            </Button>
          ) : null}

          <Button
            variant="default"
            className="cursor-pointer"
            onClick={() => {
              onConfirm();
              handleCloseOnly();
            }}
          >
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
