"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

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
import { useMaterials } from "@/hooks/useMaterials";

import MaterialsTypeSelect from "./_components/tab/MaterialsTypeSelect";
import PaperTypeForm from "./_components/form/PaperTypeForm";
import VideoTypeForm from "./_components/form/VideoTypeForm";
import RequestTypeForm from "./_components/form/RequestTypeForm";
import OtherTypeForm from "./_components/form/OtherTypeForm";

export function CreateMaterialsModal() {
  const { isOpen, closeModal } = useModal();
  const { user } = useAuthContext();

  // 리스트 갱신
  const { createMutation } = useMaterials({
    page: 1,
    limit: 10,
    type: "ALL",
    sort: "latest",
  });

  const [selectedMaterialsType, setSelectedMaterialsType] =
    useState<MaterialsType>("PAPER");

  const [formData, setFormData] = useState<
    PaperFormData | VideoFormData | RequestFormData | OtherFormData | null
  >(null);

  const [isFormValid, setIsFormValid] = useState(false);

  // 탭 전환 시 데이터 초기화
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

  const handleClose = () => {
    setSelectedMaterialsType("PAPER");
    setFormData(null);
    setIsFormValid(false);
    closeModal();
  };

  // 학습 자료 등록
  const handleSubmit = () => {
    if (!isFormValid || !formData) {
      alert("필수 항목을 모두 입력해주세요.");
      return;
    }

    const body = new FormData();
    body.append("title", formData.title);
    body.append("description", formData.description || "");
    body.append("type", selectedMaterialsType);

    if ("lectureId" in formData && formData.lectureId) {
      body.append("lectureId", formData.lectureId as string);
    }

    // 유형별 데이터 매핑
    if (selectedMaterialsType === "VIDEO") {
      const videoData = formData as VideoFormData;
      body.append("youtubeUrl", videoData.link);
    } else if (selectedMaterialsType === "REQUEST") {
      // REQUEST: 파일 + 외부 다운로드 링크
      const requestData = formData as RequestFormData;
      if (requestData.file instanceof File) {
        body.append("file", requestData.file);
      }
      if (requestData.driveLink) {
        body.append("externalDownloadUrl", requestData.driveLink);
      }
    } else {
      // PAPER, OTHER는 파일만 전송
      const fileData = formData as PaperFormData | OtherFormData;
      const fileField =
        selectedMaterialsType === "OTHER"
          ? (fileData as OtherFormData).image
          : (fileData as PaperFormData).file;

      if (fileField instanceof File) {
        body.append("file", fileField);
      }
    }

    createMutation.mutate(body, {
      onSuccess: () => {
        handleClose();
      },
    });
  };

  // 선택된 분류에 따라 해당 폼 렌더링
  const renderForm = () => {
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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-[32px]">
        <DialogHeader>
          <DialogTitle className="text-[24px] font-bold text-label-normal">
            학습 자료 등록
          </DialogTitle>
          <DialogDescription className="text-[18px] font-medium text-label-alternative">
            새로운 학습 자료를 업로드합니다.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <MaterialsTypeSelect
            selectedMaterialsType={selectedMaterialsType}
            toggleMaterialsType={toggleMaterialsType}
          />

          {renderForm()}

          <div className="flex justify-end gap-3 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={createMutation.isPending}
              className="cursor-pointer h-[48px] px-[28px] py-[12px] rounded-[12px] bg-white border border-neutral-200 hover:bg-neutral-50 text-label-normal shadow-none"
            >
              취소
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!isFormValid || createMutation.isPending}
              className={`cursor-pointer h-[48px] px-[28px] py-[12px] rounded-[12px] bg-brand-700 hover:bg-brand-800 text-white shadow-none ${
                !isFormValid || createMutation.isPending
                  ? "bg-neutral-200 text-neutral-500 cursor-not-allowed"
                  : ""
              }`}
            >
              {createMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  등록 중...
                </>
              ) : (
                "등록하기"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
