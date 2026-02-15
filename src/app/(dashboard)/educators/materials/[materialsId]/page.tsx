"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Download, Edit, Loader2, Trash2 } from "lucide-react";

import Title from "@/components/common/header/Title";
import { Button } from "@/components/ui/button";
import {
  FormMode,
  OtherFormData,
  PaperFormData,
  VideoFormData,
  RequestFormData,
} from "@/types/materials.type";
import { useModal } from "@/providers/ModalProvider";
import { CheckModal } from "@/components/common/modals/CheckModal";
import {
  useDownloadMaterial,
  useMaterialDetail,
  useMaterials,
} from "@/hooks/useMaterials";

import PaperTypeForm from "../_components/modal/_components/form/PaperTypeForm";
import VideoTypeForm from "../_components/modal/_components/form/VideoTypeForm";
import RequestTypeForm from "../_components/modal/_components/form/RequestTypeForm";
import OtherTypeForm from "../_components/modal/_components/form/OtherTypeForm";

export default function MaterialsDetailPage() {
  const { materialsId } = useParams();
  const router = useRouter();
  const { openModal } = useModal();

  const { updateMutation, deleteMutation } = useMaterials({
    page: 1,
    limit: 10,
    type: "ALL",
    sort: "latest",
  });

  const { data: material, isLoading } = useMaterialDetail(
    materialsId as string
  );

  const { mutate: downloadMutation } = useDownloadMaterial();

  const [mode, setMode] = useState<FormMode>("view");
  const [formData, setFormData] = useState<
    PaperFormData | VideoFormData | RequestFormData | OtherFormData | null
  >(null);
  const [isFormValid, setIsFormValid] = useState(false);

  if (isLoading) {
    return (
      <div className="container mx-auto px-8 py-32 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

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
    if (!isFormValid || !formData) {
      alert("필수 항목을 모두 입력해주세요.");
      return;
    }

    const body = new FormData();
    body.append("title", formData.title || "");
    body.append("description", formData.description || "");

    // VIDEO 타입: youtubeUrl 업데이트
    if (material.type === "VIDEO") {
      const videoData = formData as VideoFormData;
      body.append("youtubeUrl", videoData.link || "");
    } else if (material.type === "REQUEST") {
      // REQUEST: 파일 + 외부 다운로드 링크
      const requestData = formData as RequestFormData;
      if (requestData.file instanceof File) {
        body.append("file", requestData.file);
      }
      if (requestData.driveLink) {
        body.append("externalDownloadUrl", requestData.driveLink);
      }
    } else {
      // PAPER, OTHER: 파일만 전송
      const fileData = formData as PaperFormData | OtherFormData;
      const fileField =
        material.type === "OTHER"
          ? (fileData as OtherFormData).image
          : (fileData as PaperFormData).file;

      if (fileField instanceof File) {
        body.append("file", fileField);
      }
    }

    updateMutation.mutate(
      { materialId: material.id, payload: body },
      {
        onSuccess: () => {
          router.push("/educators/materials");
        },
      }
    );
  };

  const handleDelete = () => {
    openModal(
      <CheckModal
        title="자료 삭제"
        description={`"${material.title}" 자료를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`}
        confirmText="삭제"
        onConfirm={() => {
          deleteMutation.mutate(material.id, {
            onSuccess: () => {
              router.push("/educators/materials");
            },
          });
        }}
      />
    );
  };

  const handleDownload = async () => {
    downloadMutation(material.id);
  };

  const renderForm = () => {
    const commonProps = {
      mode,
      initialData: material,
      onDataChange: handleFormDataChange,
      userName: material.writer,
    };

    switch (material.type) {
      case "PAPER":
        return <PaperTypeForm key={mode} {...commonProps} />;
      case "VIDEO":
        return <VideoTypeForm key={mode} {...commonProps} />;
      case "REQUEST":
        return <RequestTypeForm key={mode} {...commonProps} />;
      case "OTHER":
        return <OtherTypeForm key={mode} {...commonProps} />;
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
                disabled={!isFormValid || updateMutation.isPending}
                className={`cursor-pointer ${!isFormValid ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {updateMutation.isPending ? "저장 중..." : "저장"}
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
