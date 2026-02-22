import { FileText, Paperclip, X } from "lucide-react";
import { JSONContent } from "@tiptap/react";

import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { InputForm } from "@/components/common/input/InputForm";
import TiptapEditor from "@/components/common/editor/TiptapEditor";
import { PostType } from "@/types/communication/instructorPost";
import { Materials } from "@/types/materials.type";

type CreateContentProps = {
  title: string;
  setTitle: (val: string) => void;
  content: JSONContent;
  setContent: (val: JSONContent) => void;
  selectedPostType: PostType;
  selectedMaterials: Materials[];
  setSelectedMaterials: (materials: Materials[]) => void;
  handleOpenAddResourceModal: () => void;
  handleSubmit: () => void;
  isSubmitting: boolean;
  onCancel: () => void;
};

export default function CreateContent({
  title,
  setTitle,
  content,
  setContent,
  selectedPostType,
  selectedMaterials,
  setSelectedMaterials,
  handleOpenAddResourceModal,
  handleSubmit,
  isSubmitting,
  onCancel,
}: CreateContentProps) {
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
          />
        </div>

        {selectedPostType === "NOTICE" && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">
              * 현재 공지사항에는 첨부파일을 추가할 수 없습니다. (추후 업데이트
              예정)
            </p>
          </div>
        )}

        {/* 첨부파일 (자료 공유 시에만 표시) */}
        {selectedPostType === "SHARE" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">첨부파일</Label>
              <Button
                variant="outline"
                onClick={handleOpenAddResourceModal}
                className="h-8 text-xs gap-1.5"
              >
                <Paperclip className="h-3.5 w-3.5" />
                자료실에서 선택
              </Button>
            </div>

            <div
              className={`rounded-xl border-2 border-dashed p-4 transition-colors ${
                selectedMaterials.length > 0
                  ? "bg-slate-50/50 border-slate-200"
                  : "bg-white border-slate-100"
              }`}
            >
              {selectedMaterials.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedMaterials.map((m) => (
                    <div
                      key={m.id}
                      className="group flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 shadow-sm transition-all hover:border-blue-300"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="p-2 bg-slate-50 rounded-lg border border-slate-100 group-hover:bg-blue-50 group-hover:border-blue-100 transition-colors">
                          <FileText className="h-4 w-4 text-slate-400 group-hover:text-blue-500" />
                        </div>
                        <div className="flex flex-col overflow-hidden">
                          <span className="text-sm font-medium text-slate-700 truncate max-w-[180px]">
                            {m.title}
                          </span>
                          <span className="text-[10px] text-slate-400 uppercase font-semibold">
                            {m.type}
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        className="h-7 w-7 p-0 rounded-full hover:bg-red-50 hover:text-red-500"
                        onClick={() => {
                          const filtered = selectedMaterials.filter(
                            (item) => item.id !== m.id
                          );
                          setSelectedMaterials(filtered);
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 flex flex-col items-center justify-center space-y-2">
                  <div className="p-3 bg-slate-50 rounded-full">
                    <Paperclip className="h-6 w-6 text-slate-300" />
                  </div>
                  <p className="text-sm text-slate-400">
                    학습 자료실에서 자료를 선택하여 첨부하세요
                  </p>
                </div>
              )}
            </div>
            <p className="text-[11px] text-slate-400 px-1">
              * 자료 공유는 학습 자료실에 미리 업로드한 파일만 첨부할 수
              있습니다.
            </p>
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
