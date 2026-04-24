import { ArrowLeft, Edit, Trash2, Save, X } from "lucide-react";

import { Button } from "@/components/ui/button";

type PostActionSVCProps = {
  isEditing: boolean;
  isMine: boolean;
  handleStartEdit: () => void;
  handleDelete: () => void;
  handleSaveEdit: () => void;
  handleCancelEdit: () => void;
  handleBack: () => void;
};

export default function PostActionSVC({
  isEditing,
  isMine,
  handleStartEdit,
  handleDelete,
  handleSaveEdit,
  handleCancelEdit,
  handleBack,
}: PostActionSVCProps) {
  return (
    <div className="flex items-center gap-3">
      {!isEditing && isMine && (
        <>
          <Button
            variant="outline"
            onClick={handleStartEdit}
            className="h-14 w-[140px] gap-2.5 rounded-xl border-neutral-200 px-0 text-base font-semibold tracking-[-0.01em] text-neutral-500 shadow-none hover:border-brand-500 hover:text-brand-500 transition-colors cursor-pointer"
          >
            <Edit className="h-5 w-5" /> 수정
          </Button>
          <Button
            variant="outline"
            onClick={handleDelete}
            className="h-14 w-[140px] gap-2.5 rounded-xl border-neutral-200 px-0 text-base font-semibold tracking-[-0.01em] text-neutral-500 shadow-none hover:border-brand-500 hover:text-brand-500 transition-colors cursor-pointer"
          >
            <Trash2 className="h-5 w-5" /> 삭제
          </Button>
        </>
      )}

      {isEditing && (
        <>
          <Button
            onClick={handleSaveEdit}
            className="h-14 w-[140px] gap-2.5 rounded-xl border border-[#3863f6] bg-[#3863f6] px-0 text-base font-semibold tracking-[-0.01em] text-white shadow-[0_0_14px_rgba(138,138,138,0.08)] hover:bg-[#2f57e8] cursor-pointer"
          >
            <Save className="h-5 w-5" /> 저장하기
          </Button>
          <Button
            variant="outline"
            onClick={handleCancelEdit}
            className="h-14 w-[140px] gap-2.5 rounded-xl border-neutral-200 px-0 text-base font-semibold tracking-[-0.01em] text-neutral-500 shadow-none hover:border-brand-500 hover:text-brand-500 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" /> 취소
          </Button>
        </>
      )}

      <Button
        variant="outline"
        onClick={handleBack}
        className="h-14 w-[140px] gap-2.5 rounded-xl border-neutral-200 px-0 text-base font-semibold tracking-[-0.01em] text-neutral-500 shadow-none hover:border-brand-500 hover:text-brand-500 transition-colors cursor-pointer"
      >
        <ArrowLeft className="h-5 w-5" /> 뒤로가기
      </Button>
    </div>
  );
}
