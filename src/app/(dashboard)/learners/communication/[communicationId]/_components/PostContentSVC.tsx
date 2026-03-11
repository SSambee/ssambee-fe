import { useRef } from "react";
import { Paperclip, FileText, X } from "lucide-react";
import { JSONContent } from "@tiptap/react";

import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import TiptapEditor from "@/components/common/editor/TiptapEditor";
import { GetInstructorPostDetailResponse } from "@/types/communication/instructorPost";
import { GetStudentPostDetailResponse } from "@/types/communication/studentPost";
import { CommonPostAttachment } from "@/types/communication/commonPost";
import { decodeUtf8 } from "@/utils/decodeUtf";
import { Button } from "@/components/ui/button";

type PostContentSVCProps = {
  isNoticePost: boolean;
  isEditing: boolean;
  editTitle: string;
  setEditTitle: (val: string) => void;
  editContent: JSONContent;
  setEditContent: (val: JSONContent) => void;
  editFile: File | null;
  setEditFile: (file: File | null) => void;
  noticePostData: GetInstructorPostDetailResponse | undefined;
  inquiryPostData: GetStudentPostDetailResponse | undefined;
  currentData:
    | GetInstructorPostDetailResponse
    | GetStudentPostDetailResponse
    | undefined;
  handleAttachmentClick: (file: CommonPostAttachment) => void;
  shouldRemoveExistingFile: boolean;
  setShouldRemoveExistingFile: (val: boolean) => void;
};

export default function PostContentSVC({
  isNoticePost,
  isEditing,
  editTitle,
  setEditTitle,
  editContent,
  setEditContent,
  editFile,
  setEditFile,
  noticePostData,
  inquiryPostData,
  currentData,
  handleAttachmentClick,
  shouldRemoveExistingFile,
  setShouldRemoveExistingFile,
}: PostContentSVCProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // 기존 첨부 파일 목록
  const existingAttachments = currentData?.attachments ?? [];

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
                  onClick={() => fileInputRef.current?.click()}
                  className="h-auto py-2 px-3 text-sm gap-2 rounded-lg border-neutral-200 hover:border-brand-500 hover:text-brand-500 transition-colors cursor-pointer"
                >
                  <Paperclip className="h-4 w-4" />
                  파일 선택
                </Button>
              </div>

              <div
                className={`rounded-xl border-2 border-dashed p-4 transition-colors ${
                  (existingAttachments.length > 0 &&
                    !shouldRemoveExistingFile) ||
                  editFile
                    ? "bg-slate-50/50 border-slate-200"
                    : "bg-white border-slate-100"
                }`}
              >
                {editFile ? (
                  <div className="group flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 shadow-sm transition-all hover:border-blue-300">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="p-2 bg-slate-50 rounded-lg border border-slate-100 group-hover:bg-blue-50 group-hover:border-blue-100 transition-colors">
                        <FileText className="h-4 w-4 text-slate-400 group-hover:text-blue-500" />
                      </div>
                      <div className="flex flex-col overflow-hidden">
                        <span className="text-sm font-medium text-slate-700 truncate max-w-[180px]">
                          {editFile.name}
                        </span>
                        <span className="text-[10px] text-slate-400 uppercase font-semibold">
                          새 파일
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEditFile(null);
                        if (fileInputRef.current)
                          fileInputRef.current.value = "";
                      }}
                      className="h-7 w-7 p-0 rounded-full hover:bg-red-50 hover:text-red-500"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : existingAttachments.length > 0 &&
                  !shouldRemoveExistingFile ? (
                  existingAttachments.map((f) => (
                    <div
                      key={f.id || f.filename}
                      className="group flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 shadow-sm transition-all hover:border-blue-300"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="p-2 bg-slate-50 rounded-lg border border-slate-100 group-hover:bg-blue-50 group-hover:border-blue-100 transition-colors">
                          <FileText className="h-4 w-4 text-slate-400 group-hover:text-blue-500" />
                        </div>
                        <div className="flex flex-col overflow-hidden">
                          <span className="text-sm font-medium text-slate-700 truncate max-w-[180px]">
                            {decodeUtf8(f.filename)}
                          </span>
                          <span className="text-[10px] text-slate-400 uppercase font-semibold">
                            기존 자료
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => setShouldRemoveExistingFile(true)}
                        className="h-7 w-7 p-0 rounded-full hover:bg-red-50 hover:text-red-500"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="py-8 flex flex-col items-center justify-center space-y-2">
                    <div className="p-3 bg-slate-50 rounded-full">
                      <Paperclip className="h-6 w-6 text-slate-300" />
                    </div>
                    <p className="text-sm text-slate-400">
                      파일을 선택하여 첨부하세요
                    </p>
                  </div>
                )}
              </div>
              <p className="text-[11px] text-slate-400 px-1">
                * 하나의 파일만 첨부할 수 있습니다.
              </p>

              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => {
                  const file = e.target.files?.[0] ?? null;
                  setEditFile(file);
                  if (file) {
                    setShouldRemoveExistingFile(false);
                  }
                }}
                className="hidden"
              />
            </div>
          </div>
        ) : (
          <div className="min-h-[200px]">
            <h2 className="text-2xl font-bold mb-4">
              {noticePostData?.title ?? inquiryPostData?.title ?? ""}
            </h2>
            <div className="border-t pt-4">
              <TiptapEditor
                content={getParsedContent(
                  noticePostData?.content ?? inquiryPostData?.content ?? ""
                )}
                readOnly={true}
              />
            </div>
            {/* 첨부 파일 목록 */}
            {existingAttachments.length > 0 && (
              <div className="mt-8 pt-6 border-t">
                <div className="flex items-center gap-2 mb-4">
                  <Paperclip className="h-4 w-4 text-blue-600" />
                  <span className="font-semibold text-sm">첨부된 자료</span>
                  <span className="text-xs text-muted-foreground">
                    {existingAttachments.length}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {existingAttachments.map((file) => (
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
