import { ArrowLeft, Edit, Trash2, Save, X } from "lucide-react";

import { Button } from "@/components/ui/button";

type PostActionsProps = {
  isEditing: boolean;
  isMine: boolean;
  handleStartEdit: () => void;
  handleDelete: () => void;
  handleSaveEdit: () => void;
  handleCancelEdit: () => void;
  handleBack: () => void;
};

export default function PostActions({
  isEditing,
  isMine,
  handleStartEdit,
  handleDelete,
  handleSaveEdit,
  handleCancelEdit,
  handleBack,
}: PostActionsProps) {
  return (
    <div className="flex gap-2">
      {!isEditing && isMine && (
        <>
          <Button
            variant="outline"
            onClick={handleStartEdit}
            className="h-[50px] rounded-lg text-base"
          >
            <Edit className="h-4 w-4 mr-2" /> 수정
          </Button>
          <Button
            variant="outline"
            onClick={handleDelete}
            className="h-[50px] rounded-lg text-base text-red-600"
          >
            <Trash2 className="h-4 w-4 mr-2" /> 삭제
          </Button>
        </>
      )}
      {isEditing && (
        <>
          <Button
            onClick={handleSaveEdit}
            className="h-[50px] rounded-lg text-base bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Save className="h-4 w-4 mr-2" /> 저장
          </Button>
          <Button
            variant="outline"
            onClick={handleCancelEdit}
            className="h-[50px] rounded-lg text-base"
          >
            <X className="h-4 w-4 mr-2" /> 취소
          </Button>
        </>
      )}
      <Button
        variant="outline"
        onClick={handleBack}
        className="h-[50px] rounded-lg"
      >
        <ArrowLeft className="h-5 w-5 mr-2" /> 뒤로가기
      </Button>
    </div>
  );
}
