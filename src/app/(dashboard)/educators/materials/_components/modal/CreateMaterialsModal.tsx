"use client";

import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useModal } from "@/providers/ModalProvider";
import {
  MaterialsType,
  PaperFormData,
  VideoFormData,
  RequestFormData,
  OtherFormData,
} from "@/types/materials.type";
import { useAuthContext } from "@/providers/AuthProvider";

import MaterialsTypeSelect from "./_components/tab/MaterialsTypeSelect";
import PaperTypeForm from "./_components/form/PaperTypeForm";
import VideoTypeForm from "./_components/form/VideoTypeForm";
import RequestTypeForm from "./_components/form/RequestTypeForm";
import OtherTypeForm from "./_components/form/OtherTypeForm";

export function CreateMaterialsModal() {
  const { isOpen, closeModal } = useModal();
  const { user } = useAuthContext();

  const [selectedMaterialsType, setSelectedMaterialsType] =
    useState<MaterialsType>("PAPER");

  const [formData, setFormData] = useState<
    PaperFormData | VideoFormData | RequestFormData | OtherFormData | null
  >(null);

  const [isFormValid, setIsFormValid] = useState(false);

  const toggleMaterialsType = (materialsType: MaterialsType) => {
    setSelectedMaterialsType(materialsType);
    setFormData(null);
    setIsFormValid(false);
  };

  const handleFormDataChange = (
    data: PaperFormData | VideoFormData | RequestFormData | OtherFormData,
    isValid: boolean
  ) => {
    setFormData(data);
    setIsFormValid(isValid);
  };

  // 학습 자료 등록
  const handleSubmit = () => {
    if (!isFormValid) {
      alert("필수 항목을 모두 입력해주세요.");
      return;
    }

    // TODO: API 호출
    console.log("제출 데이터:", { type: selectedMaterialsType, ...formData });

    alert("학습 자료가 등록되었습니다.");
    handleClose();
  };

  const handleClose = () => {
    setSelectedMaterialsType("PAPER");
    setFormData(null);
    setIsFormValid(false);
    closeModal();
  };

  // 선택된 분류에 따라 해당 폼 렌더링
  const renderForm = () => {
    // 작성자명
    const commonProps = {
      onDataChange: handleFormDataChange,
      userName: user?.name || "",
    };

    switch (selectedMaterialsType) {
      case "PAPER":
        return <PaperTypeForm {...commonProps} />;
      case "VIDEO":
        return <VideoTypeForm {...commonProps} />;
      case "REQUEST":
        return <RequestTypeForm {...commonProps} />;
      case "OTHER":
        return <OtherTypeForm {...commonProps} />;
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">학습 자료 등록</DialogTitle>
          <DialogDescription>
            새로운 학습 자료를 업로드합니다.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <MaterialsTypeSelect
            selectedMaterialsType={selectedMaterialsType}
            toggleMaterialsType={toggleMaterialsType}
          />

          {renderForm()}

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="cursor-pointer"
            >
              취소
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!isFormValid}
              className={`cursor-pointer ${!isFormValid ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              등록하기
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
