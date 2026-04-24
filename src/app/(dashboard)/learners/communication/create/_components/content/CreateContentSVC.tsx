import { JSONContent } from "@tiptap/react";

import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { InputForm } from "@/components/common/input/InputForm";
import TiptapEditor from "@/components/common/editor/TiptapEditor";

type CreateContentSVCProps = {
  title: string;
  setTitle: (val: string) => void;
  content: JSONContent;
  setContent: (val: JSONContent) => void;
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
          <Label className="sr-only text-sm font-medium">내용</Label>
          <TiptapEditor
            content={content} // 객체 전달
            onChange={(json) => setContent(json)} // 객체로 바로 업데이트
            placeholder="내용을 입력하세요"
            className="min-h-[400px]"
            onFileUpload={setAttachment}
            attachment={attachment}
            onRemoveAttachment={() => setAttachment(undefined)}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button
            variant="outline"
            onClick={onCancel}
            className="h-14 w-[140px] gap-2.5 rounded-xl border-neutral-200 px-0 text-base font-semibold tracking-[-0.01em] text-neutral-500 shadow-none hover:border-brand-500 hover:text-brand-500 transition-colors cursor-pointer"
          >
            취소
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="h-14 w-[140px] gap-2.5 rounded-xl border border-[#3863f6] bg-[#3863f6] px-0 text-base font-semibold tracking-[-0.01em] text-white shadow-[0_0_14px_rgba(138,138,138,0.08)] hover:bg-[#2f57e8] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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
