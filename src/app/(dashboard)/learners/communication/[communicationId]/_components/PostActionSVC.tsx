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
    <div className="flex items-center gap-2">
      {!isEditing && isMine && (
        <>
          <Button
            variant="outline"
            onClick={handleStartEdit}
            className="h-11 px-5 rounded-xl text-[14px] font-bold border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-all active:scale-95 cursor-pointer"
          >
            <Edit className="h-4 w-4 mr-2 text-blue-500" /> 수정
          </Button>
          <Button
            variant="outline"
            onClick={handleDelete}
            className="h-11 px-5 rounded-xl text-[14px] font-bold border-slate-200 text-slate-600 hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all active:scale-95 cursor-pointer"
          >
            <Trash2 className="h-4 w-4 mr-2 text-red-500" /> 삭제
          </Button>
        </>
      )}

      {isEditing && (
        <>
          <Button
            onClick={handleSaveEdit}
            className="h-11 px-6 rounded-xl text-[14px] font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-100 transition-all active:scale-95 cursor-pointer"
          >
            <Save className="h-4 w-4 mr-2" /> 저장하기
          </Button>
          <Button
            variant="outline"
            onClick={handleCancelEdit}
            className="h-11 px-5 rounded-xl text-[14px] font-bold border-slate-200 text-slate-500 hover:bg-slate-50 transition-all active:scale-95 cursor-pointer"
          >
            <X className="h-4 w-4 mr-2" /> 취소
          </Button>
        </>
      )}

      <Button
        variant="outline"
        onClick={handleBack}
        className="h-11 px-5 rounded-xl text-[14px] font-bold border-slate-200 text-slate-500 hover:bg-slate-50 transition-all active:scale-95 cursor-pointer"
      >
        <ArrowLeft className="h-4 w-4 mr-2 text-slate-400" /> 뒤로가기
      </Button>
    </div>
  );
}
