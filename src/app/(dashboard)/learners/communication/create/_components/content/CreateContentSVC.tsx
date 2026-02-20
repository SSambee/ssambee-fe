import { Paperclip } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { InputForm } from "@/components/common/input/InputForm";
import TiptapEditor from "@/components/common/editor/TiptapEditor";

type CreateContentSVCProps = {
  title: string;
  setTitle: (val: string) => void;
  content: string;
  setContent: (val: string) => void;
  attachment: File | undefined;
  setAttachment: (file: File | undefined) => void;
  handleSubmit: () => void;
  isSubmitting: boolean;
  onCancel: () => void;
};

export default function CreateContentSVC({
  title,
  setTitle,
  content,
  setContent,
  handleSubmit,
  isSubmitting,
  onCancel,
  attachment,
  setAttachment,
}: CreateContentSVCProps) {
  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <h3 className="font-semibold text-lg">게시글 작성</h3>

        <div className="space-y-2">
          <InputForm
            label="제목"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">내용</Label>
          <TiptapEditor
            content={content}
            onChange={setContent}
            placeholder="내용을 입력하세요"
            className="min-h-[400px]"
            onFileUpload={setAttachment}
          />
        </div>
        {attachment && (
          <div className="flex items-center justify-between p-3 bg-slate-50 border border-dashed border-slate-200 rounded-lg">
            <div className="flex items-center gap-2 overflow-hidden">
              <span className="text-blue-600 font-medium">
                <Paperclip className="h-4 w-4" />
              </span>
              <span className="text-sm text-slate-600 truncate">
                {attachment.name}
              </span>
            </div>
            <button
              onClick={() => setAttachment(undefined)}
              className="text-xs text-red-500 hover:underline ml-4"
            >
              삭제
            </button>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-4">
          <Button
            variant="outline"
            onClick={onCancel}
            className="h-11 px-6 rounded-xl text-[14px] font-bold border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-all active:scale-95"
          >
            취소
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="cursor-pointer h-11 px-8 rounded-xl text-[14px] font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-100 transition-all active:scale-95 disabled:opacity-50 disabled:grayscale disabled:scale-100"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="cursor-pointer h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                등록 중...
              </span>
            ) : (
              "게시글 등록"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
