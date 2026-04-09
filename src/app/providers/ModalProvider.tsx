"use client";

import { createContext, useContext, useState } from "react";

type ModalContextType = {
  isOpen: boolean;
  modalContent: React.ReactNode | null;
  openModal: (content: React.ReactNode) => void;
  closeModal: () => void;
};

const ModalContext = createContext<ModalContextType | null>(null);

export function ModalProvider({ children }: { children: React.ReactNode }) {
  // 모달 열림/닫힘 상태
  const [isOpen, setIsOpen] = useState(false);

  // 모달에 표시할 컨텐츠 (React Element)
  const [modalContent, setModalContent] = useState<React.ReactNode | null>(
    null
  );

  const openModal = (content: React.ReactNode) => {
    setModalContent(content);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setModalContent(null);
  };

  // Context에 전달할 값
  const contextValue = {
    isOpen,
    modalContent,
    openModal,
    closeModal,
  };

  return (
    <ModalContext.Provider value={contextValue}>
      {children}
      {modalContent}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);

  if (!context) {
    throw new Error("useModal은 ModalProvider 안에서 사용해야 합니다.");
  }

  return context;
}
