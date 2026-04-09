"use client";

import { useCallback, useRef } from "react";

import { CheckModal } from "@/components/common/modals/CheckModal";
import { useModal } from "@/app/providers/ModalProvider";

type AlertOptions = {
  title?: string;
  description: string;
  confirmText?: string;
};

type ConfirmOptions = {
  title?: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
};

export const useDialogAlert = () => {
  const { openModal } = useModal();
  const pendingResolveRef = useRef<
    | { type: "alert"; resolve: () => void }
    | { type: "confirm"; resolve: (value: boolean) => void }
    | null
  >(null);

  const clearPendingPromise = useCallback(() => {
    const pending = pendingResolveRef.current;
    if (!pending) return;

    if (pending.type === "alert") {
      pending.resolve();
    } else {
      pending.resolve(false);
    }

    pendingResolveRef.current = null;
  }, []);

  const showAlert = useCallback(
    ({ title = "알림", description, confirmText = "확인" }: AlertOptions) => {
      clearPendingPromise();

      return new Promise<void>((resolve) => {
        pendingResolveRef.current = { type: "alert", resolve };

        const handleResolve = () => {
          resolve();

          if (
            pendingResolveRef.current?.type === "alert" &&
            pendingResolveRef.current.resolve === resolve
          ) {
            pendingResolveRef.current = null;
          }
        };

        openModal(
          <CheckModal
            title={title}
            description={description}
            confirmText={confirmText}
            hideCancel
            onConfirm={handleResolve}
            onCancel={handleResolve}
          />
        );
      });
    },
    [clearPendingPromise, openModal]
  );

  const showConfirm = useCallback(
    ({
      title = "확인",
      description,
      confirmText = "확인",
      cancelText = "취소",
    }: ConfirmOptions) => {
      clearPendingPromise();

      return new Promise<boolean>((resolve) => {
        pendingResolveRef.current = { type: "confirm", resolve };

        const handleResolve = (value: boolean) => {
          resolve(value);

          if (
            pendingResolveRef.current?.type === "confirm" &&
            pendingResolveRef.current.resolve === resolve
          ) {
            pendingResolveRef.current = null;
          }
        };

        openModal(
          <CheckModal
            title={title}
            description={description}
            confirmText={confirmText}
            cancelText={cancelText}
            onConfirm={() => handleResolve(true)}
            onCancel={() => handleResolve(false)}
          />
        );
      });
    },
    [clearPendingPromise, openModal]
  );

  return {
    showAlert,
    showConfirm,
  };
};
