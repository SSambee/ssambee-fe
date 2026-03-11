import { Paperclip, FileText, X } from "lucide-react";
import { JSONContent } from "@tiptap/react";

import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import TiptapEditor from "@/components/common/editor/TiptapEditor";
import {
  GetInstructorPostDetailResponse,
  GetAssistantWorkDetailResponse,
} from "@/types/communication/instructorPost";
import { GetStudentPostDetailResponse } from "@/types/communication/studentPost";
import { CommonPostAttachment } from "@/types/communication/commonPost";
import { Materials } from "@/types/materials.type";
import { decodeUtf8 } from "@/utils/decodeUtf";

type PostContentProps = {
  isNoticePost: boolean;
  isWorksPost: boolean;
  isEditing: boolean;
  editTitle: string;
  setEditTitle: (val: string) => void;
  editContent: JSONContent;
  setEditContent: (val: JSONContent) => void;
  noticePostData: GetInstructorPostDetailResponse | undefined;
  inquiryPostData: GetStudentPostDetailResponse | undefined;
  worksPostData: GetAssistantWorkDetailResponse | undefined;
  currentData:
    | GetInstructorPostDetailResponse
    | GetStudentPostDetailResponse
    | GetAssistantWorkDetailResponse
    | undefined;
  handleAttachmentClick: (file: CommonPostAttachment) => void;
  selectedMaterials: Materials[];
  removedAttachmentIds: string[];
  handleOpenAddResourceModal: () => void;
  handleRemoveExistingAttachment: (attachmentId: string) => void;
  handleRemoveNewMaterial: (materialId: string) => void;
};

export default function PostContent({
  isNoticePost,
  isWorksPost,
  isEditing,
  editTitle,
  setEditTitle,
  editContent,
  setEditContent,
  noticePostData,
  inquiryPostData,
  worksPostData,
  currentData,
  handleAttachmentClick,
  selectedMaterials,
  removedAttachmentIds,
  handleOpenAddResourceModal,
  handleRemoveExistingAttachment,
  handleRemoveNewMaterial,
}: PostContentProps) {
  // 안전하게 JSON을 파싱하는 헬퍼 함수
  const getParsedContent = (content: string | undefined) => {
    if (!content) return {};
    try {
      return JSON.parse(content);
    } catch {
      // 텍스트 데이터일 경우 객체 구조로 리턴
      return {
        type: "doc",
        content: [
          { type: "paragraph", content: [{ type: "text", text: content }] },
        ],
      };
    }
  };

  const existingAttachments = currentData?.attachments || [];
  const visibleExistingAttachments = existingAttachments.filter(
    (att) => !removedAttachmentIds.includes(att.id)
  );

  return (
    <Card>
      <CardContent className="p-8">
        {isEditing ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="sr-only">
                제목
              </Label>
              <Input
                id="title"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="text-lg font-bold h-12"
              />
            </div>
            <TiptapEditor
              content={editContent}
              onChange={setEditContent}
              className="min-h-[200px]"
            />

            <div className="space-y-3 pt-2 border-t">
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium">첨부파일</Label>
                <Button
                  variant="outline"
                  onClick={handleOpenAddResourceModal}
                  className="h-auto py-2 px-3 text-sm gap-2 rounded-lg border-neutral-200 hover:border-brand-500 hover:text-brand-500 transition-colors cursor-pointer"
                >
                  <Paperclip className="h-4 w-4" />
                  자료실에서 선택
                </Button>
              </div>

              <div
                className={`rounded-xl border-2 border-dashed p-4 transition-colors ${
                  visibleExistingAttachments.length > 0 ||
                  selectedMaterials.length > 0
                    ? "bg-slate-50/50 border-slate-200"
                    : "bg-white border-slate-100"
                }`}
              >
                {visibleExistingAttachments.length > 0 ||
                selectedMaterials.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {visibleExistingAttachments.map((att) => (
                      <div
                        key={att.id}
                        className="group flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 shadow-sm transition-all hover:border-blue-300"
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className="p-2 bg-slate-50 rounded-lg border border-slate-100 group-hover:bg-blue-50 group-hover:border-blue-100 transition-colors">
                            <FileText className="h-4 w-4 text-slate-400 group-hover:text-blue-500" />
                          </div>
                          <div className="flex flex-col overflow-hidden">
                            <span className="text-sm font-medium text-slate-700 truncate max-w-[180px]">
                              {decodeUtf8(att.filename)}
                            </span>
                            <span className="text-[10px] text-slate-400 uppercase font-semibold">
                              기존 자료
                            </span>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          className="h-7 w-7 p-0 rounded-full hover:bg-red-50 hover:text-red-500"
                          onClick={() => handleRemoveExistingAttachment(att.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
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
                          onClick={() => handleRemoveNewMaterial(m.id)}
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
          </div>
        ) : (
          <div className="min-h-[200px]">
            <h2 className="text-2xl font-bold mb-4">
              {noticePostData?.title ??
                inquiryPostData?.title ??
                worksPostData?.title ??
                ""}
            </h2>
            {isWorksPost ? (
              <div className="border-t pt-4">
                <p className="text-slate-700 whitespace-pre-wrap">
                  {worksPostData?.memo || ""}
                </p>
              </div>
            ) : (
              <div className="border-t pt-4">
                <TiptapEditor
                  content={getParsedContent(
                    noticePostData?.content ?? inquiryPostData?.content ?? ""
                  )}
                  readOnly={true}
                />
              </div>
            )}
            {!!currentData?.attachments?.length &&
              currentData.attachments.length > 0 && (
                <div className="mt-24 pt-6 border-t">
                  <div className="flex items-center gap-2 mb-4">
                    <Paperclip className="h-4 w-4 text-blue-600" />
                    <span className="font-semibold text-sm">첨부된 자료</span>
                    <span className="text-xs text-muted-foreground">
                      {currentData?.attachments?.length ?? 0}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {currentData?.attachments?.map((file) => (
                      <div
                        key={file.id}
                        className="group flex items-center justify-between p-3 rounded-xl border bg-slate-50/50 hover:bg-white hover:border-blue-200 hover:shadow-sm transition-all cursor-pointer"
                        onClick={() => handleAttachmentClick(file)}
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className="p-2 bg-white rounded-lg border group-hover:border-blue-100">
                            <FileText className="h-5 w-5 text-blue-500" />
                          </div>
                          <div className="flex flex-col overflow-hidden">
                            <span className="text-sm font-medium truncate">
                              {isNoticePost
                                ? file.filename
                                : decodeUtf8(file.filename)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
