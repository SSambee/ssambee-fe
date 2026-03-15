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
import { useDialogAlert } from "@/hooks/useDialogAlert";

import PaperTypeForm from "../_components/modal/_components/form/PaperTypeForm";
import VideoTypeForm from "../_components/modal/_components/form/VideoTypeForm";
import RequestTypeForm from "../_components/modal/_components/form/RequestTypeForm";
import OtherTypeForm from "../_components/modal/_components/form/OtherTypeForm";

export default function MaterialsDetailPage() {
  const { materialsId } = useParams();
  const router = useRouter();
  const { openModal } = useModal();
  const { showAlert } = useDialogAlert();

  const { updateMutation, deleteMutation } = useMaterials({
    page: 1,
    limit: 10,
    type: "ALL",
    sort: "latest",
  });

  const { data: material, isLoading } = useMaterialDetail(
    materialsId as string
  );

  const { mutate: downloadMutation } = useDownloadMaterial("EDUCATORS");

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

  const handleSave = async () => {
    if (!isFormValid || !formData) {
      await showAlert({ description: "필수 항목을 모두 입력해주세요." });
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
    downloadMutation({ materialsId: material.id });
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
    <div className="container mx-auto space-y-8 p-6 mb-10">
      <Title
        title={mode === "view" ? "학습 자료 상세" : "학습 자료 수정"}
        description={
          mode === "view"
            ? "학습 자료의 상세 정보를 확인합니다."
            : "학습 자료 정보를 수정합니다."
        }
      />

      <div className="space-y-8">
        <div className="flex flex-wrap items-center justify-end gap-3">
          {mode === "view" ? (
            <>
              {material.type !== "VIDEO" && (
                <Button
                  variant="outline"
                  onClick={handleDownload}
                  className="h-14 w-[140px] gap-2.5 rounded-xl border-neutral-200 px-0 text-base font-semibold tracking-[-0.01em] text-neutral-500 shadow-none hover:border-brand-500 hover:text-brand-500 transition-colors cursor-pointer"
                >
                  <Download className="h-5 w-5" />
                  다운로드
                </Button>
              )}
              <Button
                variant="outline"
                onClick={handleEdit}
                className="h-14 w-[140px] gap-2.5 rounded-xl border-neutral-200 px-0 text-base font-semibold tracking-[-0.01em] text-neutral-500 shadow-none hover:border-brand-500 hover:text-brand-500 transition-colors cursor-pointer"
              >
                <Edit className="h-5 w-5" />
                수정
              </Button>
              <Button
                variant="outline"
                onClick={handleDelete}
                className="h-14 w-[140px] gap-2.5 rounded-xl border-neutral-200 px-0 text-base font-semibold tracking-[-0.01em] text-neutral-500 shadow-none hover:border-brand-500 hover:text-brand-500 transition-colors cursor-pointer"
              >
                <Trash2 className="h-5 w-5" />
                삭제
              </Button>

              <Button
                variant="outline"
                onClick={() => router.back()}
                className="h-14 w-[140px] gap-2.5 rounded-xl border-neutral-200 px-0 text-base font-semibold tracking-[-0.01em] text-neutral-500 shadow-none hover:border-brand-500 hover:text-brand-500 transition-colors cursor-pointer"
              >
                목록으로
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={handleCancel}
                className="h-14 w-[140px] gap-2.5 rounded-xl border-neutral-200 px-0 text-base font-semibold tracking-[-0.01em] text-neutral-500 shadow-none hover:border-brand-500 hover:text-brand-500 transition-colors cursor-pointer"
              >
                취소
              </Button>
              <Button
                onClick={handleSave}
                disabled={!isFormValid || updateMutation.isPending}
                className="h-14 w-[140px] gap-2.5 rounded-xl border border-[#3863f6] bg-[#3863f6] px-0 text-base font-semibold tracking-[-0.01em] text-white shadow-[0_0_14px_rgba(138,138,138,0.08)] hover:bg-[#2f57e8] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updateMutation.isPending ? "저장 중..." : "저장"}
              </Button>
            </>
          )}
        </div>

        <div>{renderForm()}</div>
      </div>
    </div>
  );
}
