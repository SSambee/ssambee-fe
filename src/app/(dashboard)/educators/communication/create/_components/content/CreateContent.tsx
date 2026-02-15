import { X } from "lucide-react";

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
  content: string;
  setContent: (val: string) => void;
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
          <div className="space-y-2">
            <Label className="text-sm font-medium">첨부파일</Label>
            <div className="border-2 border-dashed rounded-lg p-6 text-center">
              {selectedMaterials.length > 0 ? (
                <div className="mb-4 space-y-2 text-left">
                  {selectedMaterials.map((m) => (
                    <div
                      key={m.id}
                      className="flex items-center justify-between bg-muted p-2 rounded-md text-sm"
                    >
                      <span>{m.title}</span>
                      <Button
                        variant="outline"
                        type="button"
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
                <p className="text-sm text-muted-foreground text-center mb-2">
                  학습 자료실에서 자료를 선택하세요
                </p>
              )}
              <Button variant="outline" onClick={handleOpenAddResourceModal}>
                자료실에서 선택
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              * 자료 공유는 학습 자료실에 미리 업로드한 파일만 첨부할 수
              있습니다.
            </p>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onCancel}>
            취소
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "등록 중..." : "게시글 등록"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
