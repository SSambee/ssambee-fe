"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Download, Edit, Trash2, Send } from "lucide-react";

import Title from "@/components/common/header/Title";
import { Button } from "@/components/ui/button";
import { MOCK_MATERIALS } from "@/data/materials.mock";
import {
  FormMode,
  OtherFormData,
  PaperFormData,
  VideoFormData,
  RequestFormData,
} from "@/types/materials.type";
import { useModal } from "@/providers/ModalProvider";
import { CheckModal } from "@/components/common/modals/CheckModal";

import PaperTypeForm from "../_components/modal/_components/form/PaperTypeForm";
import VideoTypeForm from "../_components/modal/_components/form/VideoTypeForm";
import RequestTypeForm from "../_components/modal/_components/form/RequestTypeForm";
import OtherTypeForm from "../_components/modal/_components/form/OtherTypeForm";
import { ExportToNoticeModal } from "../_components/modal/ExportToNoticeModal";

export default function MaterialsDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { openModal } = useModal();
  const materialsId = params.materialsId as string;

  // TODO: API에서 데이터 가져오기
  const material = MOCK_MATERIALS.find((m) => m.id === materialsId);

  const [mode, setMode] = useState<FormMode>("view");
  const [formData, setFormData] = useState<
    PaperFormData | VideoFormData | RequestFormData | OtherFormData | null
  >(null);
  const [isFormValid, setIsFormValid] = useState(false);

  if (!material) {
    return (
      <div className="container mx-auto px-8 py-8">
        <p>자료를 찾을 수 없습니다.</p>
      </div>
    );
  }

  const handleFormDataChange = (
    data: PaperFormData | VideoFormData | RequestFormData | OtherFormData,
    isValid: boolean
  ) => {
    setFormData(data);
    setIsFormValid(isValid);
  };

  const handleEdit = () => {
    setMode("edit");
  };

  const handleCancel = () => {
    setMode("view");
    setFormData(null);
    setIsFormValid(false);
  };

  const handleSave = () => {
    if (!isFormValid) {
      alert("필수 항목을 모두 입력해주세요.");
      return;
    }

    // TODO: API 호출하여 수정
    console.log("수정 데이터:", formData);
    alert("자료가 수정되었습니다.");
    setMode("view");
  };

  const handleDelete = () => {
    openModal(
      <CheckModal
        title="자료 삭제"
        description={`"${material.title}" 자료를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`}
        confirmText="삭제"
        onConfirm={() => {
          // TODO: API 호출하여 삭제
          alert("자료가 삭제되었습니다.");
          router.push("/educators/materials");
        }}
      />
    );
  };

  const handleDownload = () => {
    if (!material.file) {
      alert("다운로드할 파일이 없습니다.");
      return;
    }

    const fileName =
      material.file instanceof File ? material.file.name : material.title;
    alert(`다운로드: ${fileName}`);
    // TODO: 실제 파일 다운로드 구현
  };

  const handleExportToNotice = () => {
    openModal(<ExportToNoticeModal material={material} />);
  };

  const renderForm = () => {
    switch (material.type) {
      case "PAPER":
        return (
          <PaperTypeForm
            mode={mode}
            initialData={material}
            onDataChange={handleFormDataChange}
            userName={material.writer}
          />
        );
      case "VIDEO":
        return (
          <VideoTypeForm
            mode={mode}
            initialData={material}
            onDataChange={handleFormDataChange}
            userName={material.writer}
          />
        );
      case "REQUEST":
        return (
          <RequestTypeForm
            mode={mode}
            initialData={material}
            onDataChange={handleFormDataChange}
            userName={material.writer}
          />
        );
      case "OTHER":
        return (
          <OtherTypeForm
            mode={mode}
            initialData={material}
            onDataChange={handleFormDataChange}
            userName={material.writer}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-8 py-8 space-y-6 max-w-[1400px]">
      <div className="flex items-center justify-between">
        <Title
          title={mode === "view" ? "학습 자료 상세" : "학습 자료 수정"}
          description={
            mode === "view"
              ? "학습 자료의 상세 정보를 확인합니다."
              : "학습 자료 정보를 수정합니다."
          }
        />

        <div className="flex gap-2">
          {mode === "view" ? (
            <>
              <Button
                variant="default"
                onClick={handleExportToNotice}
                className="cursor-pointer bg-green-600 hover:bg-green-700"
              >
                <Send className="h-4 w-4 mr-2" />
                공지로 내보내기
              </Button>
              {material.type !== "VIDEO" && (
                <Button
                  variant="outline"
                  onClick={handleDownload}
                  className="cursor-pointer"
                >
                  <Download className="h-4 w-4 mr-2" />
                  다운로드
                </Button>
              )}
              <Button
                variant="outline"
                onClick={handleEdit}
                className="cursor-pointer"
              >
                <Edit className="h-4 w-4 mr-2" />
                수정
              </Button>
              <Button
                variant="outline"
                onClick={handleDelete}
                className="cursor-pointer"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                삭제
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={handleCancel}
                className="cursor-pointer"
              >
                취소
              </Button>
              <Button
                onClick={handleSave}
                disabled={!isFormValid}
                className={`cursor-pointer ${!isFormValid ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                저장
              </Button>
            </>
          )}
        </div>
      </div>

      {renderForm()}

      {mode === "view" && (
        <div className="flex justify-end">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="cursor-pointer"
          >
            목록으로
          </Button>
        </div>
      )}
    </div>
  );
}
